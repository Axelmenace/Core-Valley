#!/usr/bin/env python3
"""Inline Ficcraft's stylesheet and scripts into a single HTML file.

    python3 ficcraft/tools/bundle.py                 # -> ficcraft/dist/ficcraft.html (open it from disk)
    python3 ficcraft/tools/bundle.py --artifact      # -> ficcraft/dist/ficcraft-artifact.html (page body for a Claude artifact)

The artifact variant drops <!doctype>, <html>, <head> and <body>: the Claude artifact host
wraps the page in its own document skeleton. Only the standard library is needed.
"""
import argparse
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent


def read(rel):
    return (ROOT / rel).read_text(encoding="utf-8")


def inline(html):
    def css(m):
        return "<style>\n" + read(m.group(1)) + "\n</style>"

    def js(m):
        src = read(m.group(1))
        if "</script" in src.lower():
            sys.exit(f"{m.group(1)} contains a closing script tag; it can't be inlined safely.")
        return "<script>\n" + src + "\n</script>"

    html = re.sub(r'<link rel="stylesheet" href="(css/[^"]+)">', css, html)
    html = re.sub(r'<script src="(js/[^"]+)"></script>', js, html)
    return html


def section(html, name):
    m = re.search(rf"<!-- @{name}-start -->(.*?)<!-- @{name}-end -->", html, re.S)
    if not m:
        sys.exit(f"index.html is missing its @{name}-start/@{name}-end markers.")
    return m.group(1).strip()


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--artifact", action="store_true", help="emit page content for a Claude artifact")
    ap.add_argument("-o", "--out", help="output path")
    args = ap.parse_args()

    html = inline(read("index.html"))
    if args.artifact:
        html = section(html, "head") + "\n" + section(html, "body") + "\n"
        default = ROOT / "dist" / "ficcraft-artifact.html"
    else:
        default = ROOT / "dist" / "ficcraft.html"

    out = pathlib.Path(args.out) if args.out else default
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(html, encoding="utf-8")
    print(f"wrote {out} ({len(html.encode('utf-8')) / 1024:.0f} KiB)")


if __name__ == "__main__":
    main()
