#!/usr/bin/env python3
"""Scaffold a Scriptorium Record.

Creates <root>/<slug>/ with every Record file, copied from ../assets/skeleton
with {{TITLE}}, {{SLUG}} and {{DATE}} filled. Refuses to overwrite an existing
Record.

Usage:
    python scaffold.py --root <parent-folder> --title "The Black Seal" [--slug black-seal]
"""
import argparse
import datetime
import re
import shutil
import sys
from pathlib import Path

SKELETON = Path(__file__).resolve().parent.parent / "assets" / "skeleton"


def slugify(title: str) -> str:
    s = re.sub(r"[^a-z0-9]+", "-", title.lower()).strip("-")
    return s or "novel"


def main() -> int:
    ap = argparse.ArgumentParser(description="Scaffold a Scriptorium Record.")
    ap.add_argument("--root", required=True, help="parent folder in which the Record folder is created")
    ap.add_argument("--title", required=True, help="the novel's title")
    ap.add_argument("--slug", help="folder name (default: derived from the title)")
    args = ap.parse_args()

    if not SKELETON.is_dir():
        print(f"error: skeleton not found at {SKELETON}", file=sys.stderr)
        return 2

    slug = args.slug or slugify(args.title)
    target = Path(args.root).expanduser().resolve() / slug
    if target.exists() and any(target.iterdir()):
        print(f"error: {target} already exists and is not empty; a Record is never overwritten", file=sys.stderr)
        return 1

    today = datetime.date.today().isoformat()
    created = []
    for src in sorted(SKELETON.rglob("*")):
        rel = src.relative_to(SKELETON)
        dst = target / rel
        if src.is_dir():
            dst.mkdir(parents=True, exist_ok=True)
            continue
        dst.parent.mkdir(parents=True, exist_ok=True)
        if src.name == ".keep":
            continue
        text = src.read_text(encoding="utf-8")
        text = text.replace("{{TITLE}}", args.title).replace("{{SLUG}}", slug).replace("{{DATE}}", today)
        dst.write_text(text, encoding="utf-8")
        created.append(str(rel))

    # Directories that start empty
    for d in ("chapters", "checkpoints/archive"):
        (target / d).mkdir(parents=True, exist_ok=True)

    print(f"Record scaffolded at {target}")
    for c in created:
        print(f"  {c}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
