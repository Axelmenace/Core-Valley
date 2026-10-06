#!/usr/bin/env python3
"""Menu Draw for the Operative Mode Framework Play Menu (assets/play-menu.json).

For a Player who says "roll for me": draws options at random from the Play Menu,
so the pick is a real draw and not the Operator's preference (§15.9, Tool Draw).

Usage:
    python menu_draw.py                      # the core three: Story Type, one setting, Tone
    python menu_draw.py --offer 5            # offer 5 options per core category instead of picking 1
    python menu_draw.py --categories "Story Hooks,Character Archetypes" --pick 2
    python menu_draw.py --all                # one pick from every category and sub-list
    python menu_draw.py --list               # list categories and sub-lists with counts
    python menu_draw.py --menu path/to/play-menu.json

--pick N draws N distinct options per sub-list (default 1).
--offer N is an alias for --pick N, phrased for offering a short list to the Player.
"""
import argparse
import json
import os
import secrets

SETTINGS = [
    "Historical Settings",
    "Sci-Fi Settings",
    "Post-Apocalyptic Settings",
    "Dark World Settings",
    "Trope Fusion Settings",
    "Fantasy and Magic Settings",
    "Environment and Location Settings",
]
CORE = ["Story Types", "<setting>", "Tone and Atmosphere"]


def sample(options, n):
    pool = list(dict.fromkeys(options))
    picks = []
    for _ in range(min(n, len(pool))):
        picks.append(pool.pop(secrets.randbelow(len(pool))))
    return picks


def main() -> None:
    here = os.path.dirname(os.path.abspath(__file__))
    default_menu = os.path.join(here, "..", "assets", "play-menu.json")
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("--menu", default=default_menu)
    p.add_argument("--categories", help="comma-separated category names (see --list)")
    p.add_argument("--pick", type=int, default=1)
    p.add_argument("--offer", type=int)
    p.add_argument("--all", action="store_true")
    p.add_argument("--list", action="store_true")
    a = p.parse_args()
    n = a.offer or a.pick

    with open(a.menu, encoding="utf-8") as f:
        menu = json.load(f)

    if a.list:
        for cat, subs in menu.items():
            print(cat + ": " + ", ".join(f"{s} ({len(o)})" for s, o in subs.items()))
        return

    if a.all:
        cats = list(menu)
    elif a.categories:
        cats = [c.strip() for c in a.categories.split(",")]
    else:
        cats = [SETTINGS[secrets.randbelow(len(SETTINGS))] if c == "<setting>" else c for c in CORE]

    for cat in cats:
        if cat not in menu:
            raise SystemExit(f"unknown category: {cat!r}; use --list")
        for sub, options in menu[cat].items():
            label = cat if sub == "Options" else f"{cat} / {sub}"
            print(f"{label}: {'; '.join(sample(options, n))}")
    print("(source: Tool Draw from the Play Menu)")


if __name__ == "__main__":
    main()
