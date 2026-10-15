"""Make index.html (the standalone page Vercel serves) from herby.html.

Usage:
    python3 tools/build_index.py

herby.html is written for the Claude page, which adds the <!doctype>, <head> and <body>
around it. A normal web host like Vercel serves files as they are, so index.html wraps
herby.html in that same outer page. Run this after every change to herby.html.
"""
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

HEAD = """<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<style>:root{color-scheme:light;box-sizing:border-box;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0}img{max-width:100%}[hidden]{display:none!important}</style>
</head>
<body>
<!-- Generated from herby.html by tools/build_index.py. Edit herby.html, then rerun the script. -->
"""

TAIL = """
</body>
</html>
"""


def main():
    page = open(os.path.join(ROOT, "herby.html")).read()
    # The <title>, font and icon lines at the top of herby.html belong in <head>.
    lines = page.split("\n")
    top = 0
    while top < len(lines) and lines[top].startswith(("<title", "<link")):
        top += 1
    head = HEAD.replace("</head>", "\n".join(lines[:top]) + "\n</head>")
    with open(os.path.join(ROOT, "index.html"), "w") as f:
        f.write(head + "\n".join(lines[top:]) + TAIL)
    print("wrote index.html")


if __name__ == "__main__":
    main()
