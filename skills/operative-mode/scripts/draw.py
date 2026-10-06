#!/usr/bin/env python3
"""Tool Draw for the Operative Mode Framework (Draft 0.4, §15.6 to §15.9).

Run this only AFTER the Stakes and the Odds have been stated in the conversation.
The point of the draw is that the Operator cannot choose the number.

Usage:
    python draw.py --odds likely            # a resolution draw
    python draw.py --odds 50                # numeric odds also accepted
    python draw.py --odds unlikely --oracle # an Oracle Question (yes/no reading)
    python draw.py --odds even --log path/to/draw-log.txt

Prints the rung, the odds, the d100 result, and the Outcome Band.
With --log, appends one line to a log file so draws can be audited later.
"""
import argparse
import datetime
import secrets

LADDER = {
    "certain": 100,
    "near-certain": 90,
    "likely": 70,
    "even": 50,
    "unlikely": 30,
    "remote": 10,
    "impossible": 0,
}

BANDS = ["Clean Success", "Success at Cost", "Failure with Opening", "Clean Failure"]
ORACLE = ["Yes, and", "Yes, but", "No, but", "No"]


def band_for(r: int, t: int) -> int:
    """Return the Band index for a d100 draw r against odds t (§15.7)."""
    if r <= t / 2:
        return 0
    if r <= t:
        return 1
    if r <= (t + 100) / 2:
        return 2
    return 3


def main() -> None:
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("--odds", required=True, help="a rung name (likely, even, ...) or a number 0-100")
    p.add_argument("--oracle", action="store_true", help="read the Band as an Oracle answer")
    p.add_argument("--log", help="append the draw to this log file")
    a = p.parse_args()

    key = a.odds.strip().lower()
    if key in LADDER:
        rung, t = key, LADDER[key]
    else:
        t = int(key)
        if not 0 <= t <= 100:
            raise SystemExit("odds must be 0 to 100")
        rung = next((k for k, v in LADDER.items() if v == t), "custom")

    if t in (0, 100):
        idx = 0 if t == 100 else 3
        r = None
    else:
        r = secrets.randbelow(100) + 1  # uniform 1..100 from the OS entropy source
        idx = band_for(r, t)

    label = (ORACLE if a.oracle else BANDS)[idx]
    roll = "no draw (certain or impossible)" if r is None else f"d100 = {r}"
    line = f"{rung} ({t}) | {roll} | {label}"
    print(line)

    if a.log:
        stamp = datetime.datetime.now().isoformat(timespec="seconds")
        with open(a.log, "a", encoding="utf-8") as f:
            f.write(f"{stamp} | {'oracle' if a.oracle else 'resolution'} | {line}\n")


if __name__ == "__main__":
    main()
