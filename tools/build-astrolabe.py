#!/usr/bin/env python3
"""Build Astrolabe (apps/astrolabe/index.html) from apps/astrolabe/src.

Usage:
    python tools/build-astrolabe.py                       # writes apps/astrolabe/index.html (a complete document)
    python tools/build-astrolabe.py --fragment out.html   # also writes a body-only copy for a claude.ai Artifact

The output is one self-contained file: open it from disk, GitHub Pages or any static host.
Only Python 3 and the standard library are needed.
"""
import argparse
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "apps", "astrolabe", "src")
OUT = os.path.join(ROOT, "apps", "astrolabe", "index.html")
MODULES = ["core.js", "store.js", "model.js", "editor.js", "views.js", "ui.js", "main.js"]


def read(*parts):
    with open(os.path.join(SRC, *parts), encoding="utf-8") as f:
        return f.read()


def build():
    shell = read("shell.html")
    style = read("style.css")
    script = "(() => {\n\"use strict\";\n" + "\n".join(read("js", m) for m in MODULES) + "\n})();"
    if "</script" in script.lower():
        raise SystemExit("a module contains '</script', which would end the inline script early")
    page = shell.replace("/*__STYLE__*/", style).replace("/*__SCRIPT__*/", script)
    head, body = page.split("<!--HEAD-END-->", 1)
    full = (
        '<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n'
        '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
        + head.strip() + "\n</head>\n<body>\n" + body.strip() + "\n</body>\n</html>\n"
    )
    fragment = head.strip() + "\n" + body.strip() + "\n"
    return full, fragment


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--fragment", help="also write a body-only copy (for publishing as an Artifact)")
    a = ap.parse_args()
    full, fragment = build()
    with open(OUT, "w", encoding="utf-8") as f:
        f.write(full)
    print("wrote", os.path.relpath(OUT, ROOT), f"({len(full) // 1024} KB)")
    if a.fragment:
        with open(a.fragment, "w", encoding="utf-8") as f:
            f.write(fragment)
        print("wrote", a.fragment)


if __name__ == "__main__":
    main()
