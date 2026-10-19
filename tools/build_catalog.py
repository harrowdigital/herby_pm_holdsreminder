"""Rebuild Herby's product list from the PlantMed RRP pricelist.

Usage:
    python3 tools/build_catalog.py "<path to pricelist .xlsx>" [herby.html]

Reads the OILS, FLOWERS, CARTS, GUMMIES + CAPS and ECONOMY MEDS sheets, works out each
product's brand, type (oil, flower, cart, pastille, caps, extract) and tub/bottle size,
applies the staff-confirmed corrections in FIXES, and writes catalog.json. If a path to
herby.html is given, the new list is also written into the page (const CATALOG = [...]).
Needs openpyxl (pip install openpyxl).
"""
import openpyxl,sys,json,re
wb=openpyxl.load_workbook(sys.argv[1],data_only=True)
SHEETS={'OILS':'OIL','FLOWERS':'FLOWER','CARTS':'CART','GUMMIES + CAPS':'PASTILLE','ECONOMY MEDS':'FLOWER'}
# Brand labels the pricelist writes on a product's own row (everything else there, like NEW, PREMIUM,
# olive oil or Portugal, is a note). The brand carries on to the rows below until the next heading.
SAME_ROW_BRANDS={'cymra':'CYMRA','cymra gummies':'CYMRA','entoura':'ENTOURA','entoura gummies':'ENTOURA',
  'solara botanics':'SOLARA BOTANICS','somai':'SOMAI','spectrum':'SPECTRUM','spectrum caps':'SPECTRUM',
  'green weekend':'GREEN WEEKEND','antg carts':'ANTG','aura carts':'AURA','beacon carts':'BEACON',
  'elysian':'ELYSIAN','grandiosa':'GRANDIOSA','harbour lr':'HARBOUR','kind':'KIND','lgp':'LGP','medcan':'MEDCAN',
  'phytoca':'PHYTOCA','redecan':'REDECAN','sativite':'SATIVITE','antg gummies':'ANTG','cannatrek gummies':'Cannatrek',
  'grandiosa gummies':'GRANDIOSA','hey day gummies':'HEYDAY','medcan medichew gummies':'MEDCAN','nova gummies':'NOVA',
  'phytoca gummies':'PHYTOCA','sativite caps':'SATIVITE','stanley brothers (gummies)':'STANLEY BROTHERS',
  'superseed (gummies)':'SUPERSEED'}
def typ(name,cat,default):
  s=(name+' '+cat).lower()
  if re.search(r'\b(cart|vape|pen)\b|satipen',s): return 'CART'
  if re.search(r'pastille|patille|gumm|chew|medible',s): return 'PASTILLE'
  if re.search(r'\bcaps\b|softgel|soft gel',s): return 'CAPS'
  if re.search(r'\boil\b|oral liquid',s): return 'OIL'
  # Whole words only: "Sherbert" must not count as "herb". "herb" and "extract" are category labels for hash, kief and rosin.
  if re.search(r'\b(hash|kief|rosin)\b',name.lower()) or re.search(r'\b(extract|herb)\b',cat.lower()): return 'EXTRACT'
  return default
out={};
for ws in wb.worksheets:
  sh=ws.title.strip()
  if sh not in SHEETS: continue
  sup=None; prevprod=False; rowbrand=False
  for r in ws.iter_rows(min_row=4,values_only=True):
    a,b,c,d,e=(r+(None,)*5)[:5]
    isprod=bool(c and d and 'categ' in str(d).lower())
    # Some brands are written on the product's own row (CYMRA next to "Cybis oil"), not on a heading row.
    label=re.sub(r'\s+',' ',str(a or '')).strip().lower()
    if isprod and label in SAME_ROW_BRANDS: sup=SAME_ROW_BRANDS[label]; rowbrand=True
    # Brand header: column A filled, not a product, not the description line under a product,
    # and no numbers in column C (CYMRA BOTANICALS has a note there; "non GMO" has "70% indica").
    if a and not isprod and not prevprod and not re.search(r'\d', str(c or '')): sup=str(a).strip(); rowbrand=False
    prevprod=isprod
    if c and d and 'categ' in str(d).lower():
      n=re.sub(r'\s+',' ',str(c)).strip()
      if n.lower() in out: continue
      s=sup if sh in ('OILS','FLOWERS','ECONOMY MEDS') or rowbrand or (sup or '').upper()=='CANNATREK CARTS' else ''
      t=typ(n,str(d),SHEETS[sh])
      g=re.match(r'\s*(\d+(?:\.\d+)?)\s*g',str(e or ''),re.I)
      size=(g.group(1)+'g') if (t=='FLOWER' and g) else ''
      if t=='OIL':
        mv=re.match(r'\s*(\d+(?:\.\d+)?)\s*(?:ml)?\s*$',str(e or ''),re.I)
        if mv: size=str(int(float(mv.group(1))))+'ml'
        inname=re.search(r'(\d+)\s*ml\b(?!/)',n,re.I)
        if size and inname and inname.group(1)+'ml'!=size: size=inname.group(1)+'ml|'+size
      out[n.lower()]=[n,s or '',t,size]
# Corrections confirmed by PlantMed staff.
FIXES={'alfie 25:25 sativa oil 30ml* (sativa)':{3:'30ml'},
  'juno 20:20 balanced pastilles (60 chews)':{1:'ANTG'},
  'rocky thc 30 pastilles (60 chews)':{1:'ANTG'},
  't50 oral liquid (ind dom)':{1:'Tasmanian Botanics (Tasbot, TB)'},
  'c100 oral liquid':{1:'Tasmanian Botanics (Tasbot, TB)'},
  'beacon thc 30 gsc oil (girl scout cookies)':{0:'Beacon THC30 GSC oil (girl scout cookies)'},
  # Listed under the "Avani CAPS - MCT oil" heading: capsules, not pastilles.
  'avani advanced cbd25':{1:'AVANI',2:'CAPS'},
  'avani advanced 2.5:20':{1:'AVANI',2:'CAPS'}}
for k,f in FIXES.items():
  for i,v in f.items(): out[k][i]=v
json.dump(list(out.values()),open('catalog.json','w'),separators=(',',':'))
print(len(out))
if len(sys.argv) > 2:
  page=open(sys.argv[2]).read()
  page,n=re.subn(r'const CATALOG = \[.*?\];\n', lambda m:'const CATALOG = '+json.dumps(list(out.values()),separators=(',',':'))+';\n', page, count=1, flags=re.S)
  assert n==1, 'CATALOG line not found in page'
  open(sys.argv[2],'w').write(page)
  print('updated', sys.argv[2])
from collections import Counter; print(Counter(v[2] for v in out.values()))
