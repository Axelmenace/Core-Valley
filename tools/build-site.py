#!/usr/bin/env python3
"""Build the Operative Mode website (site/index.html) from site/src and the skill's assets.

The Play Menu is read from the skill itself, so the site never drifts from it:
  skills/operative-mode/assets/play-menu.json   the option lists (authoritative)
  skills/operative-mode/assets/play-menu.md     one-line descriptions, groups, refinements

Usage:
    python tools/build-site.py                       # writes site/index.html (a complete document)
    python tools/build-site.py --fragment out.html   # also writes a body-only copy for an Artifact

The output is one self-contained file: it opens from disk, from GitHub Pages, or from any static host.
Only Python 3 and the standard library are needed.
"""
import argparse
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ASSETS = os.path.join(ROOT, "skills", "operative-mode", "assets")
SRC = os.path.join(ROOT, "site", "src")
OUT = os.path.join(ROOT, "site", "index.html")

# The app's modules, concatenated in this order inside one function scope.
APP_MODULES = ["core.js", "compile.js", "menu.js", "magic.js", "deploy.js", "table.js", "operator.js", "codex.js", "main.js"]

# Short names used in the Play Menu's "What each category sets" table.
SHORT = {
    "Story Types": "Story Types",
    "Character Archetypes": "Character Archetypes",
    "Romantic Interest": "Romantic Interest",
    "Creatures and Beings": "Creatures and Beings",
    "Historical": "Historical Settings",
    "Sci-Fi": "Sci-Fi Settings",
    "Post-Apocalyptic": "Post-Apocalyptic Settings",
    "Dark World": "Dark World Settings",
    "Trope Fusion": "Trope Fusion Settings",
    "Fantasy and Magic": "Fantasy and Magic Settings",
    "Role and Profession": "Role and Profession Settings",
    "Social Structure": "Social Structure Settings",
    "Story Mechanics": "Story Mechanics",
    "Story Hooks": "Story Hooks",
    "Tone and Atmosphere": "Tone and Atmosphere",
    "Environment and Location": "Environment and Location Settings",
    "Religions and Religious Themes": "Religions and Religious Themes",
    "Politics and Ideology": "Politics and Ideology",
}


def cells(line):
    return [c.strip() for c in line.strip().strip("|").split("|")]


def strip_md(s):
    s = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", s)
    return s.replace("**", "").replace("`", "").strip()


def player_facing(blurb):
    """Drop the editorial notes addressed to the Menu's compiler (sources, spelling fixes, "your lists")."""
    blurb = blurb.replace(", as your examples show", "")
    sentences = re.split(r"(?<=\.)\s+(?=[A-Z\"])", blurb)
    noise = re.compile(
        r"\bYour\b|corrected|spelling|follow the standard|standard conventions|drawn from|follow the subgenre|"
        r"Wikipedia|Reedsy|TCK|Worlds Without End|first group are|Additions sit|kept as given"
    )
    return " ".join(s for s in sentences if not noise.search(s))


def parse_menu_md(path, menu):
    """Return per-category metadata pulled from play-menu.md."""
    with open(path, encoding="utf-8") as f:
        lines = f.read().splitlines()

    meta = {cat: {"blurb": "", "sets": "", "desc": {}, "groups": [], "num": 0} for cat in menu}
    refinements = {}
    hook_examples = []
    cat = None
    header = None
    want_blurb = False

    for line in lines:
        m = re.match(r"^## (\d+)\. (.+)$", line)
        if m:
            name = m.group(2).strip()
            cat = name if name in menu else None
            if cat:
                meta[cat]["num"] = int(m.group(1))
            header, want_blurb = None, bool(cat)
            continue
        if line.startswith("## "):
            cat, header, want_blurb = None, None, False
            continue
        if want_blurb and line.strip() and not line.startswith("|") and not line.startswith("#"):
            meta[cat]["blurb"] = player_facing(strip_md(line))
            want_blurb = False
            continue
        if not line.startswith("|"):
            header = None if not line.strip() else header
            continue
        row = cells(line)
        if header is None:
            header = row
            continue
        if set("".join(row)) <= set("-: "):
            continue
        h0 = header[0]

        if h0 == "Category" and len(header) == 2:  # the "What each category sets" table
            for short in row[0].split(","):
                full = SHORT.get(short.strip())
                if full:
                    meta[full]["sets"] = strip_md(row[1])
            continue
        if cat is None:
            continue
        if h0 == "Refinement":
            refinements[row[0]] = [o.strip() for o in row[1].split(";") if o.strip()]
            continue
        if h0 == "Example" and len(header) == 2:
            hook_examples.append({"title": row[0], "hooks": row[1]})
            continue
        if h0 in ("Group", "Sphere", "Kind"):
            opts = []
            for c in row[1:]:
                opts += [o.strip() for o in c.split(";") if o.strip()]
            meta[cat]["groups"].append({"name": row[0], "options": opts})
            continue
        if h0 in ("Option", "Hook"):
            rec = {}
            for k, v in zip(header[1:], row[1:]):
                v = strip_md(v)
                if not v:
                    continue
                key = {
                    "In one line": "desc",
                    "Definition": "desc",
                    "What it offers": "desc",
                    "Period": "period",
                    "Fusion": "fusion",
                    "What it sets": "sets",
                    "Example": "example",
                    "Status": "status",
                }.get(k)
                if key:
                    rec[key] = v
            meta[cat]["desc"][strip_md(row[0])] = rec
    return meta, refinements, hook_examples


def build_menu():
    with open(os.path.join(ASSETS, "play-menu.json"), encoding="utf-8") as f:
        menu = json.load(f)
    meta, refinements, hook_examples = parse_menu_md(os.path.join(ASSETS, "play-menu.md"), menu)

    categories, missing = [], []
    for cat, subs in menu.items():
        md = meta[cat]
        grouped = {o for g in md["groups"] for o in g["options"]}
        out_subs = []
        for sub, options in subs.items():
            opts = []
            for o in options:
                rec = {"name": o}
                rec.update(md["desc"].get(o, {}))
                if "desc" not in rec and o not in grouped and cat != "Historical Settings":
                    missing.append(f"{cat} / {o}")
                opts.append(rec)
            entry = {"name": sub, "options": opts}
            if sub == "Options" and md["groups"]:
                entry["groups"] = md["groups"]
            out_subs.append(entry)
        categories.append(
            {"key": cat, "num": md["num"], "blurb": md["blurb"], "sets": md["sets"], "subs": out_subs}
        )
    for m in missing:
        print(f"note: no one-line description for {m}", file=sys.stderr)
    return {"categories": categories, "refinements": refinements, "hookExamples": hook_examples}


def read(name):
    with open(os.path.join(SRC, name), encoding="utf-8") as f:
        return f.read()


def safe_script(js):
    # A literal "</script" inside inlined code or data would end the element early.
    return js.replace("</script", "<\\/script")


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("--fragment", help="also write a body-only copy (no doctype/html/head/body) here")
    a = p.parse_args()

    page = read("page.html")
    head, body = page.split("<!--HEAD-END-->")
    head = head.replace("/*__STYLE__*/", read("style.css"))
    menu_js = "const PLAY_MENU = " + json.dumps(build_menu(), ensure_ascii=False, separators=(",", ":")) + ";"
    app_js = "(() => {\n\"use strict\";\n" + "\n".join(read(os.path.join("app", m)) for m in APP_MODULES) + "\n})();"
    scripts = "\n".join(
        f"<script>\n{safe_script(js)}\n</script>" for js in (menu_js, read("data.js"), app_js)
    )
    body = body.replace("<!--__SCRIPTS__-->", scripts)

    full = (
        '<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n'
        '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
        + head.strip()
        + "\n</head>\n<body>\n"
        + body.strip()
        + "\n</body>\n</html>\n"
    )
    with open(OUT, "w", encoding="utf-8") as f:
        f.write(full)
    print(f"site/index.html ({len(full.encode('utf-8')) // 1024} KB)")

    if a.fragment:
        frag = head.strip() + "\n" + body.strip() + "\n"
        with open(a.fragment, "w", encoding="utf-8") as f:
            f.write(frag)
        print(f"{a.fragment} ({len(frag.encode('utf-8')) // 1024} KB)")


if __name__ == "__main__":
    main()
