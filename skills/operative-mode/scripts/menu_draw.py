#!/usr/bin/env python3
"""Menu Draw for the Operative Mode Framework's Play Menu and Magic Menu.

For a Player who says "roll for me": draws options at random from a menu,
so the pick is a real draw and not the Operator's preference (§15.9, Tool Draw).

Play Menu (assets/play-menu.json):
    python menu_draw.py                      # the core three: Story Type, one setting, Tone
    python menu_draw.py --offer 5            # offer 5 options per core category instead of picking 1
    python menu_draw.py --categories "Story Hooks,Character Archetypes" --pick 2
    python menu_draw.py --all                # one pick from every category and sub-list
    python menu_draw.py --list               # list categories and sub-lists with counts

Magic Menu (assets/magic-menu.json):
    python menu_draw.py --magic              # the core four: What Magic Is, The Reserve,
                                             #   How It Is Cast, How It Is Divided
    python menu_draw.py --magic --offer 5    # a shortlist of 5 per core set
    python menu_draw.py --magic --categories "Affinity,Running Dry"
    python menu_draw.py --magic --all        # one pick from every set
    python menu_draw.py --magic --list

    --menu path/to/menu.json overrides either default file.

--pick N draws N distinct options per sub-list (default 1).
--offer N is an alias for --pick N, phrased for offering a short list to the Player.
A draw never lands on Operator's Choice; a Player who wants a set left to the
Operator says so instead of rolling for it.
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
MAGIC_CORE = ["What Magic Is", "The Reserve", "How It Is Cast", "How It Is Divided"]
OPERATOR_CHOICE = "Operator's Choice"


def sample(options, n):
    pool = [o for o in dict.fromkeys(options) if o != OPERATOR_CHOICE]
    picks = []
    for _ in range(min(n, len(pool))):
        picks.append(pool.pop(secrets.randbelow(len(pool))))
    return picks


def main() -> None:
    here = os.path.dirname(os.path.abspath(__file__))
    assets = os.path.join(here, "..", "assets")
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("--magic", action="store_true", help="draw from the Magic Menu")
    p.add_argument("--menu", help="path to a menu JSON file")
    p.add_argument("--categories", help="comma-separated category names (see --list)")
    p.add_argument("--pick", type=int, default=1)
    p.add_argument("--offer", type=int)
    p.add_argument("--all", action="store_true")
    p.add_argument("--list", action="store_true")
    a = p.parse_args()
    n = a.offer or a.pick

    menu_path = a.menu or os.path.join(assets, "magic-menu.json" if a.magic else "play-menu.json")
    with open(menu_path, encoding="utf-8") as f:
        menu = json.load(f)

    if a.list:
        for cat, subs in menu.items():
            print(cat + ": " + ", ".join(f"{s} ({len(o)})" for s, o in subs.items()))
        return

    if a.all:
        cats = list(menu)
    elif a.categories:
        cats = [c.strip() for c in a.categories.split(",")]
    elif a.magic:
        cats = MAGIC_CORE
    else:
        cats = [SETTINGS[secrets.randbelow(len(SETTINGS))] if c == "<setting>" else c for c in CORE]

    for cat in cats:
        if cat not in menu:
            raise SystemExit(f"unknown category: {cat!r}; use --list")
        for sub, options in menu[cat].items():
            label = cat if sub == "Options" else f"{cat} / {sub}"
            print(f"{label}: {'; '.join(sample(options, n))}")
    print(f"(source: Tool Draw from the {'Magic' if a.magic else 'Play'} Menu)")


if __name__ == "__main__":
    main()
