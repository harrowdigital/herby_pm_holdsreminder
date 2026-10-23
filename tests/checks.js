const WORD={OIL:"Oil",FLOWER:"Flower",CART:"Cart",PASTILLE:"Pastille",CAPS:"Caps"};
const clean=n=>n.replace(/\([^)]*\)?/g," ").replace(/[*]/g," ").replace(/\b\d+(\.\d+)?\s*%/g," ").replace(/\s+/g," ").trim();
const run=n=>analyse(n,{name:n,qty:1,rep:"1",date:new Date()});
const key=p=>clean(p.name).toLowerCase();
let n=0,fails=[];
for(const P of PRODUCTS){ if(!TYPES.includes(P.type)) continue; n++;
  const base=clean(P.name), hasWord=typeInName(base);
  const inputs=[hasWord?base:base+" "+WORD[P.type]]; if(!hasWord) inputs.push(base);
  for(const inp of inputs){
    const r=run(inp), typedType=!!typeInName(inp), why=[];
    if(r.fixed) why.push("respelled");
    if(typedType){
      if(r.status!=="ok") why.push("status "+r.status+" "+r.note);
      if(!r.match||r.match.type!==P.type) why.push("wrong type match");
      else if(key(r.match)!==key(P)) why.push("other product "+r.match.name);
      const unit=SIZE_UNITS[P.type];
      const midWord=new RegExp("\\b"+WORD[P.type]+"s?\\b.*\\S","i").test(base.replace(unit?new RegExp(unit.re.source,"gi"):/$^/,"").replace(/\s*-?\s*$/,""));
      if(unit&&!midWord&&r.status==="ok"&&!r.out.endsWith(" "+P.size.split("|")[0]+" "+P.type)) why.push("bad ending");
    } else {
      if(!r.types.includes(P.type)) why.push("type not offered "+r.types);
      if(r.status==="ok"&&r.type!==P.type) why.push("auto type "+r.type);
    }
    if(why.length) fails.push(`${inp}  =>  ${r.out}  [${r.status}] ${why.join("; ")}`);
  }
}
console.log("products",n,"failures",fails.length);fails.forEach(f=>console.log(" -",f));
for(const t of ["Kind Medical Rosa Oil","Kind Rosa Oil","Kind Rosa","Aura Purple Rain","Green Weekend Blueberry Cheese","Walken","Spectrum Blue Oil 50mL","Avani Bling Blau 15g","Alfie 25:25 Sativa Oil","Alma Calma","Medcan FX200 Oil","Rainbow Region Rainbow Moonlight","Cannatrek Medible 10:10","Antg Juno Cart"]){const r=run(t);console.log(r.status.padEnd(6),t.padEnd(34),"=>",r.out,"["+r.types+"]",r.note||"");}
console.log("----");
let conf=0;for(const P of PRODUCTS){if(!TYPES.includes(P.type))continue;const r=run(clean(P.name));if(r.status==="confirm")conf++;}
console.log("pricelist names asking to confirm:",conf);
for(const t of ["Tasbot T50 Oil","Tasbot T50","Tasmanian Botanics T50 Oil","Tasmanian T50 Oil","T50 Oil","Sativite T50 Oil","Tasbot C100 Oil","Alma Calma Live Rosin Night Cart","Cymra Superbly Ro","Kind Rosaa Flwr","Totally Fake Product"]){const r=run(t);
 console.log(r.status.padEnd(8),t.padEnd(34),"=>",r.out,"|",r.note||"","·",r.match&&r.match.name);
 if(r.options.length)console.log("          options:",r.options.map(p=>cleanProductName(p.name).toUpperCase()+" ("+(p.size?p.size+" ":"")+p.type+")").join(" | "));}
// pick an option end to end
input.value="Tasbot C100 Oil\t1\t1\t22/01/2027";render();const it=current.items[0];if(!it.options.length){console.log("no options, status",it.status,it.out);}else{
console.log("button html:",(els.groups.innerHTML.match(/<div class="options">.*?<\/div>/)||[""])[0].slice(0,220));
overrides[it.line]={name:cleanProductName(it.options[0].name),type:it.options[0].type};render();console.log("after picking option 1:",current.items[0].status,current.items[0].out);}
let bb=0;for(const P of PRODUCTS){if(!TYPES.includes(P.type)||!P.supplier)continue;const b=P.supplier.split(/\s+/)[0];const r=run(b+" "+clean(P.name));if(!(r.status==="ok"||r.status==="pick")||r.fixed){bb++;console.log("BRAND-FAIL",b+" "+clean(P.name),"=>",r.status,r.note);}}
console.log("brand-in-front failures:",bb);
for(const t of ["Kind Medical Rosa Oil","Kind Medical Rosa","Byron Bio Crystalbrook Cream","Cymra Superbly Rosey","Aura Therapeutics CBD200","Medcan FX200 Oil","Curaleaf Superbly Rosey"]){const r=run(t);console.log("REG",r.status.padEnd(7),t.padEnd(30),"=>",r.out);}
for(const t of ["Sativite T50 Oil","T50 Oil","T25 Ruby Oil","Cannatrek T25 Ruby Oil","Medcan GLU01","Medcan GLU01-V","Cannatrek Medible 10:10","Aura Purple Rain","Walken","Green Weekend Blueberry Cheese","Sativite PACT","Rainbow Region Rainbow Moonlight","Alfie K Mint","Superbly Rosy"]){const r=run(t);console.log("REG2",r.status.padEnd(7),t.padEnd(30),"=>",r.out,"·",r.match&&r.match.name);}
for(const t of ["Kind Medical Rosa","Kind Rosa","Kind Medical Libra","Antg Juno","Tasbot C100 Oil","Sativite T50 Oil"]){const r=run(t);console.log("REG3",r.status.padEnd(7),t.padEnd(22),"=>",r.out,"["+r.types+"]");}
for(const t of ["Tasbot C100 Oil","Tasbot C100","Tasmanian Botanics C100 Oil","Sativite C100 Oil","Tasbot T50 Oil","C100 Oil"]){const r=run(t);console.log("TAS",r.status.padEnd(7),t.padEnd(30),"=>",r.out,"·",r.match&&r.match.name);}
// Simulate the clock moving to just after midnight on 15/12/2026 (a script expiring 14/12 becomes expired; one expiring 15/02/2027 becomes "soon").
input.value="Medcan FX200 Oil\t1\t1\t14/12/2026\nAvani Mango Passion\t1\t1\t15/02/2027";render();
console.log("before:",els.today.textContent,current.items.map(i=>i.group).join(","));
const RealDate=Date;Date=function(...a){return a.length?new RealDate(...a):new RealDate(2026,11,15,0,0,5);};Date.prototype=RealDate.prototype;
checkNewDay();
console.log("after midnight:",els.today.textContent,current.items.map(i=>i.group).join(","));
Date=RealDate;
// Unreadable lines say why.
input.value="ANTG Rocky Oil\t1\t0\t26/11/2026\nCymra Superbly Green Buzzy\t1\t1\t31/02/2027\nX\t1\t1\t29/02/2028\nY\t1\t1\t15/13/2027\nZ\t1\t1\tsoon\nW\tone\t1\t01/01/2027\nonly two\tcolumns";render();
console.log("UNREADABLE",els.count.innerHTML);console.log("UNREADABLE",els.badLines.innerHTML.replace(/<[^>]+>/g," ").replace(/\s+/g," "));
// No pricelist match at all -> kept as typed (probably discontinued), doesn't block copying.
input.value="Gods Gift\t1\t1\t01/03/2027\nGod's Gift Flower\t1\t1\t01/03/2027\nTotally Fake Product\t1\t1\t01/03/2027\nMedcan FX200 Oil\t1\t1\t01/03/2027";render();
current.items.forEach(i=>console.log("GONE",i.status.padEnd(7),i.out));console.log("GONE copy disabled:",els.copy.disabled);
input.value="Cymra Superbly Ro\t1\t1\t01/03/2027";render();console.log("GONE partial stays flagged:",current.items[0].status,"copy disabled:",els.copy.disabled);
// Discontinued list from the inventory.
for(const t of ["Gods Gift","God's Gift","Mystery Mountain Gods Gift 15g","Mystery Mountain El Chapo","Superbly Cozey","Superbly Dusky","Cymra Superbly Dusky","Sativite PACT T26","Sativite PACT","Kind Taurus","Stanley Brothers Night","Medcan FX200 Oil","Kind Rosa","Aura Purple Rain","Totally Fake Product"]){const r=run(t);console.log("DISC",r.status.padEnd(7),t.padEnd(34),"=>",r.out,"|",r.discName||"",r.discNote?"(note: "+r.discNote+")":"");}
input.value="Gods Gift\t1\t1\t01/03/2027\nMedcan FX200 Oil\t1\t1\t01/03/2027";render();console.log("DISC copy disabled:",els.copy.disabled);
// Demo list: (dis) marker, type word before codes, GUMMY -> PASTILLE, C200 = CBD200, TB = Tasmanian Botanics.
input.value=["med FGW t20 smalls\t1\t1\t12/11/2026","kind iris \t1\t1\t12/11/2026","alfie gt haze oil (dis) \t1\t2\t12/11/2026","aura c200\t1\tlast rpt \t12/11/2026","alfie gt haze oil (dis) \t1\t2\t24/12/2026","west coast kush (dis)\t1\t2\t24/12/2026","elysian harmony\t1\t2\t24/12/2026","medcan lak \t1\t2\t24/12/2026","aura c200\t1\tlast rpt \t24/12/2026","frosted king\t1\tlast rpt \t24/12/2026","TB T50\t1\tlast rpt \t24/12/2026","fgw smalls T20\t1\tlast rpt \t24/12/2026","hana lemon skunk \t1\tlast rpt \t24/12/2026","aura c200\t1\t1\t24/02/2027","alma calma gummy\t1\t1\t24/02/2027","TB T50\t1\t1\t24/02/2027","ctrek ruby oil T25\t1\t1\t24/02/2027","rocky flower\t1\t1\t24/02/2027"].join("\n");render();
current.items.forEach(i=>console.log("DEMO",i.status.padEnd(7),i.out.padEnd(36),"·",i.match?i.match.name:"",i.discName?"disc: "+i.discName:""));
console.log("DEMO copy disabled:",els.copy.disabled,"|",els.copyNote.textContent);
for(const t of ["C100 oral liquid","Tasbot C100","Medicabilis T25:C25","Cannatrek C12T12 Ruby Oil","Antg Juno Cart 1g","Green Weekend Dry Flower Blue Cheese","Aura Live Cola Gummies","Elysian Aria Vape","Medcan GLU01-V","Kind Rosa Oil (dis)"]){const r=run(t);console.log("EXTRA",r.status.padEnd(7),t.padEnd(36),"=>",r.out);}
// TBC100 = Tasmanian Botanics CBD100 oil.
for(const t of ["TBC100","tbc100","TBC100 Oil","TB C100","TB T50","C100 Oil","Aura C200","ANTG Elan CBD100","Alfie CBD100"]){const r=run(t);console.log("TBC",r.status.padEnd(7),t.padEnd(18),"=>",r.out,"·",r.match&&r.match.name);}
// Date typos that can only mean one thing are read; real problems still aren't.
input.value=["CYMRA SUPERBLY ROSEY\t1\t2\t21//03/2027","A\t1\t1\t21 / 03 / 2027","B\t1\t1\t21/03//2027","C\t1\t1\t21-03-2027","D\t1\t1\t31/02/2027","E\t1\t1\t21/03"].join("\n");render();
console.log("DATES",els.count.innerHTML.replace(/<[^>]+>/g,""),"|",current.items.map(i=>i.text.split(" - Expiry ")[1]).join(", "));
console.log("DATES bad:",els.badLines.innerHTML.replace(/<[^>]+>/g," ").replace(/\s+/g," ").slice(0,220));
// Beacon oil is written THC30.
for(const t of ["Beacon THC30 GSC Oil","Beacon THC 30 GSC Oil","beacon thc30 gsc","Beacon GSC Oil","Beacon THC30 GSC","Beacon GSC Cart","Beacon Face Mintz THC30"]){const r=run(t);console.log("BEACON",r.status.padEnd(7),t.padEnd(26),"=>",r.out,"·",r.match&&r.match.name);}
for(const t of ["Medicabilis 200 CBD Full Spectrum","MEDICABILIS 200 CBD FULL SPECTRUM OIL","Medicabilis 200 CBD FS","Med 200 CBD Full Spectrum","Entoura CBD200 Full Spectrum","Entoura CBD200 Broad Spectrum","KIND CBD200 FS","SatiOil CBD 200FS"]){const r=run(t);console.log("FSCHK",r.status.padEnd(7),t.padEnd(38),"=>",r.out,"·",r.match&&r.match.name);}
// Australian Natural = ANTG.
for(const t of ["Australian Natural Rocky Oil","Australian Natural Therapeutics Rocky Oil","Australian Natural Rocky","Australian Natural Juno Cart","Australian Natural Elan","Australian Natural Eve #4 CBD Oil","LGP Frosted King","ANTG Rocky Oil"]){const r=run(t);console.log("AUSNAT",r.status.padEnd(7),t.padEnd(42),"=>",r.out,"·",r.match&&r.match.name,"["+r.types+"]");}
// Same-row brands: Cybis is Cymra, Entoura oils are Entoura, carts/gummies have their own brands.
for(const t of ["Cybis Oil","Cymra Cybis Oil","Cannatrek Cybis Oil","Entoura CBD200 Full Spectrum","Grandiosa Buenos Diaz Cart","Kind Rosa Cart","Medcan MediChew Lime 50","Nova EclipX Mango","Cymra Aurelius Day","ctrek ruby oil T25","T25 Topaz Flower","Cannatrek mCart Blend S","Cannatrek Medible 10:10"]){const r=run(t);console.log("BRAND",r.status.padEnd(7),t.padEnd(30),"=>",r.out);}
// Avani Advanced products are capsules.
for(const t of ["avani 25 cbd capsule","Avani Advanced CBD25","Avani CBD25 Caps","Avani 2.5:20 Capsule","Avani THC10 Caps","Avani 5:5 Caps","avani 25 cbd"]){const r=run(t);console.log("AVANI",r.status.padEnd(7),t.padEnd(24),"=>",r.out,"|",r.options.map(p=>displayName(p)).join(" / "));}
for(const t of ["avani 25 cbd capsule","avani 25 cbd gummy","avani 25 cbd","Avani Advanced CBD25","Avani 2.5:20 Pastille","Avani 2.5:20"]){const r=run(t);console.log("AVANI2",r.status.padEnd(7),t.padEnd(24),"=>",r.out,"["+r.types+"]");}
overrides["avani 25 cbd"]={type:"PASTILLE"};console.log("AVANI2 picked PASTILLE =>",run("avani 25 cbd").out);overrides["avani 25 cbd"]={type:"CAPS"};console.log("AVANI2 picked CAPS =>",run("avani 25 cbd").out);delete overrides["avani 25 cbd"];
// GSC = Girl Scout Cookies.
for(const t of ["Beacon GSC Flower","Beacon GSC","Beacon Girl Scout Cookies","Beacon GSC Cart","Beacon THC30 GSC Oil","Beacon GSC Oil"]){const r=run(t);console.log("GSC",r.status.padEnd(7),t.padEnd(28),"=>",r.out,"["+r.types+"]");}
// FS200 = CBD200 FS.
for(const t of ["kind fs200","KIND FS200 Oil","Medicabilis FS200","KIND CBD200 FS","SatiOil CBD 200FS","Entoura CBD200 Full Spectrum"]){const r=run(t);console.log("FS200",r.status.padEnd(7),t.padEnd(30),"=>",r.out);}
console.log("---- CBD dose reader");
{ let bad = 0;
  const D = [ // [typed, kind, mg each, expected per day, expect Herby to ask?]
    ["0.5","oil",200,0.5,false],["1","oil",200,1,false],["0.5ml","oil",200,0.5,false],["0.5ml TDS","oil",200,1.5,false],["0.5 mL t.d.s.","oil",200,1.5,false],
    ["0.3ml mane + 0.6ml NOCTE","oil",200,0.9,false],["0.3ml mane and 0.6ml nocte","oil",200,0.9,false],["mane 0.3ml, nocte 0.6ml","oil",200,0.9,false],
    ["0.5ml BD","oil",200,1,false],["0.5mL b.i.d.","oil",200,1,false],["1ml qid","oil",200,4,false],["1ml QDS","oil",200,4,false],
    ["0.25ml mane, midi and nocte","oil",200,0.75,false],["0.25mL mane midi vesp nocte","oil",200,1,false],
    ["0.5ml twice daily","oil",200,1,false],["0.5ml twice a day","oil",200,1,false],["0.5ml 2x daily","oil",200,1,false],["0.5ml x2 daily","oil",200,1,false],
    ["0.5ml x 2","oil",200,1,false],["0.5mL 3 times a day","oil",200,1.5,false],["0.5ml three times daily","oil",200,1.5,false],
    ["0.5ml 8 hourly","oil",200,1.5,false],["0.5ml q8h","oil",200,1.5,false],["1ml every 12 hours","oil",200,2,false],["0.5ml 4-6 hourly","oil",200,3,true],
    ["0.5ml daily","oil",200,0.5,false],["0.5ml once daily","oil",200,0.5,false],["1ml nocte","oil",200,1,false],["1ml at night","oil",200,1,false],
    ["1 ml in the morning","oil",200,1,false],["0.5ml morning and night","oil",200,1,false],["0.5ml mane & nocte","oil",200,1,false],["take 0.5ml sublingually bd","oil",200,1,false],
    ["0.5ml bd with food","oil",200,1,false],["1ml bd hold under tongue for 60 seconds","oil",200,2,false],["0.5ml BD mane and nocte","oil",200,1,false],
    ["50mg BD","oil",200,0.5,false],["1ml (200mg) bd","oil",200,2,false],["100mg nocte","oil",100,1,false],
    ["0.5-1ml bd","oil",200,2,true],["0.5ml to 1ml nocte","oil",200,1,true],["0.5ml prn max 2ml/day","oil",200,null,true],["0.5ml PRN","oil",200,null,true],
    ["1mL TDS PRN","oil",200,null,true],["0.5ml bd + 0.5ml prn","oil",200,1,false],["1ml nocte, 0.5ml prn","oil",200,1,false],["0.5ml bd and 0.5ml prn max 1ml/day","oil",200,1,false],["prn 0.5ml","oil",200,null,true],["0.5mL as needed","oil",200,null,true],["1 cap nocte + 1 cap prn","pack",50,1,false],["0.5ml od","oil",200,0.5,true],["10 drops bd","oil",200,1,true],
    ["0.25ml bd for 1 week then 0.5ml bd","oil",200,1,true],["1ml stat then 0.5ml bd","oil",200,1,false],["0.5ml mane ON","oil",200,1,true],
    ["1/2 ml bd","oil",200,1,false],["½ml nocte","oil",200,0.5,false],["half a ml nocte","oil",200,0.5,false],["0.5ml tds blah","oil",200,1.5,true],
    ["1ml weekly","oil",200,1/7,false],["0.5ml alt die","oil",200,0.25,false],["0.5ml tds mane nocte","oil",200,1.5,true],["0.5ml as directed","oil",200,0.5,true],
    ["0,5ml bd","oil",200,1,false],["0.5ML MANE + 1ML NOCTE","oil",200,1.5,false],["1ml on waking","oil",200,1,false],
    ["1 cap bd","pack",50,2,false],["2 chews nocte","pack",50,2,false],["100mg daily","pack",50,2,false],["1 tds","pack",50,3,false],["1","pack",50,1,false],
    ["1 capsule mane, 2 capsules nocte","pack",25,3,false],["1-2 caps nocte","pack",50,2,true],
    ["2 pumps bd","pump",20,4,false],["40mg daily","pump",20,2,false],["1 spray tds","pump",20,3,false],
    ["0.5ml bd","",null,1,false],["50mg bd","",null,null,true],["hello","oil",200,null,true],
  ];
  for (const [t, k, mg, want, ask] of D) {
    const r = readDose(t, k || null, mg), got = r && r.perDay, asked = !!(r && r.asks.length);
    const ok = (want == null ? got == null : got != null && Math.abs(got - want) < 1e-6) && asked === ask;
    if (!ok) { bad++; console.log(" x", JSON.stringify(t), "=>", got, asked ? "ASKS" : "sure", r && r.how, r && r.asks.join(" | ")); }
  }
  console.log("dose cases", D.length, "failures", bad);
}
console.log("---- written as staff want");
for (const [t, want] of [["spec blue caps","SPECTRUM BLUE SOFTGEL CAPSULES"],["Spectrum Blue capsules","SPECTRUM BLUE SOFTGEL CAPSULES"],["spec blue soft gels","SPECTRUM BLUE SOFTGEL CAPSULES"],["spectrum blue 2.5/3.75","SPECTRUM BLUE SOFTGEL CAPSULES"],["SPECTRUM BLUE 2.5/3.75 soft gels SOFT GELS (60 )*","SPECTRUM BLUE SOFTGEL CAPSULES"],["spec blue oil","SPECTRUM BLUE 50ml OIL"]]) { const r = run(t); console.log(r.out === want && r.status === "ok" ? "ok  " : "FAIL", t.padEnd(50), "=>", r.out, r.status); }
