"""Run Herby's matching checks against herby.html (macOS: uses the built-in JavaScript engine).

Usage:
    python3 tests/run_tests.py

Pulls the <script> out of herby.html, stubs the few page elements it touches, appends
tests/checks.js and runs it with `osascript -l JavaScript`. checks.js puts every pricelist
product through the matcher (with and without its type word, and with its brand in front),
then prints a set of names that were reported by staff, so a change that breaks one shows up.
"""
import os
import subprocess
import sys
import tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

STUBS = """var OUT=[];var console={log:function(){OUT.push(Array.prototype.join.call(arguments,' '))}};
var els={};var document={getElementById:function(id){return els[id]||(els[id]={textContent:'',innerHTML:'',value:'',hidden:false,disabled:false,className:'',addEventListener:function(){},focus:function(){},querySelectorAll:function(){return []}})}};
var navigator={};var setInterval=function(){};document.addEventListener=function(){};document.hidden=false;document.querySelectorAll=function(){return []};
"""


def main():
    page = open(os.path.join(ROOT, "herby.html")).read()
    script = page.split("<script>")[1].split("</script>")[0]
    checks = open(os.path.join(ROOT, "tests", "checks.js")).read()
    with tempfile.NamedTemporaryFile("w", suffix=".js", delete=False) as f:
        f.write(STUBS + script + "\n" + checks + '\nOUT.join("\\n");')
        path = f.name
    try:
        result = subprocess.run(["osascript", "-l", "JavaScript", path], capture_output=True, text=True)
    finally:
        os.unlink(path)
    sys.stdout.write(result.stdout)
    sys.stderr.write(result.stderr)
    sys.exit(result.returncode)


if __name__ == "__main__":
    main()
