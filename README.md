# Herby

Herby formats PlantMed Dispensary hold-script reminders. Paste the rows for a patient's scripts on hold (name, quantity, repeats, expiry) and Herby writes the SMS/email reminder, checking every product name against the PlantMed RRP pricelist.

Live page: https://claude.ai/artifact/9uj9ELvUbmEwXnCAphzUZy (also deployable as-is on Vercel or any static host, which serves `index.html`).

## What it does

- Puts names in UPPER CASE and adds the type (OIL, FLOWER, CART, PASTILLE, CAPS) plus the flower tub size or oil bottle size from the pricelist, e.g. `AVANI BLING BLAU 10g FLOWER`, `AURA CBD200 30ml OIL`.
- Sorts scripts expiring within 2 months under **Expiring Soon**; leaves expired scripts out. The date rolls over at midnight in the viewer's own timezone.
- Labels scripts on the inventory's discontinued list as **Discontinued** and keeps their names as typed.
- Never changes a name on its own. Near-spellings, products sold as more than one type (KIND ROSA), names not in the pricelist and size mismatches are flagged, and the message can't be copied until each one is resolved.
- Copy buttons for the message and for the SMS/email notes, From and Subject lines.
- Everything runs in the browser; nothing pasted is saved or sent anywhere.

## Files

| File | What it is |
| --- | --- |
| `herby.html` | The whole tool: page, styles, matching logic and the built-in product list. This is the source to edit. |
| `index.html` | The same page as a standalone web page, which Vercel serves. Generated: run `python3 tools/build_index.py` after editing `herby.html`. |
| `tools/build_index.py` | Makes `index.html` from `herby.html`. |
| `tools/build_catalog.py` | Rebuilds the product list from the pricelist spreadsheet and applies the staff-confirmed corrections. |
| `tools/build_discontinued.py` | Rebuilds the discontinued list from the inventory spreadsheet (its Discontinued tab plus rows marked Product DISCONTINUED). |
| `tests/run_tests.py`, `tests/checks.js` | Puts every pricelist product and the staff-reported names through the matcher. |

## Updating the pricelist or inventory

The spreadsheets themselves are not in this repo (see `.gitignore`). Names are matched against the pricelist; the inventory's discontinued list only labels scripts as Discontinued (kept as typed, never renamed).

```bash
pip install openpyxl
python3 tools/build_catalog.py "path/to/! PlantMed RRP Pricelist.xlsx" herby.html
python3 tools/build_discontinued.py "path/to/Inventory & Expiry Medication Dispense.xlsx" herby.html
python3 tools/build_index.py
python3 tests/run_tests.py
```

Staff-confirmed corrections the raw sheet gets wrong live in `FIXES` in `tools/build_catalog.py` (for example Alfie 25:25 Sativa Oil is 30ml; T50 and C100 oral liquid are Tasmanian Botanics). Add new ones there so they survive the next rebuild.

## Tests

`python3 tests/run_tests.py` needs macOS (it uses the built-in `osascript` JavaScript engine). Expect `products 313 failures 0`.

Created by JCIHB.
