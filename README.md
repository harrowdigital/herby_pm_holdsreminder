# Herby

Herby formats PlantMed Dispensary hold-script reminders. Paste the rows for a patient's scripts on hold (name, quantity, repeats, expiry) and Herby writes the SMS/email reminder, checking every product name against the PlantMed RRP pricelist.

Live page: https://claude.ai/artifact/9uj9ELvUbmEwXnCAphzUZy

## What it does

- Puts names in UPPER CASE and adds the type (OIL, FLOWER, CART, PASTILLE, CAPS) plus the flower tub size or oil bottle size from the pricelist, e.g. `AVANI BLING BLAU 10g FLOWER`, `AURA CBD200 30ml OIL`.
- Sorts scripts expiring within 2 months under **Expiring Soon**; leaves expired scripts out. The date rolls over at midnight in the viewer's own timezone.
- Never changes a name on its own. Near-spellings, products sold as more than one type (KIND ROSA), names not in the pricelist and size mismatches are flagged, and the message can't be copied until each one is resolved.
- Copy buttons for the message and for the SMS/email notes, From and Subject lines.
- Everything runs in the browser; nothing pasted is saved or sent anywhere.

## Files

| File | What it is |
| --- | --- |
| `herby.html` | The whole tool: page, styles, matching logic and the built-in product list. |
| `tools/build_catalog.py` | Rebuilds the product list from the pricelist spreadsheet and applies the staff-confirmed corrections. |
| `tests/run_tests.py`, `tests/checks.js` | Puts every pricelist product and the staff-reported names through the matcher. |

## Updating the pricelist

The spreadsheet itself is not in this repo (see `.gitignore`).

```bash
pip install openpyxl
python3 tools/build_catalog.py "path/to/! PlantMed RRP Pricelist.xlsx" herby.html
python3 tests/run_tests.py
```

Staff-confirmed corrections the raw sheet gets wrong live in `FIXES` in `tools/build_catalog.py` (for example Alfie 25:25 Sativa Oil is 30ml; T50 and C100 oral liquid are Tasmanian Botanics). Add new ones there so they survive the next rebuild.

## Tests

`python3 tests/run_tests.py` needs macOS (it uses the built-in `osascript` JavaScript engine). Expect `products 313 failures 1`: the one listed is ANTG Elan Oil, which ties with its sister product ANTG Elan CBD100 at the same type and size, so the message line is still correct.

Created by JCIHB.
