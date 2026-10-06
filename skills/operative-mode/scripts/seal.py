#!/usr/bin/env python3
"""Hash Seal for the Operative Mode Framework (Draft 0.4, §23.2, Level 3).

A commitment scheme: fix a hidden fact now, prove later that it was not changed.

    python seal.py make SEAL-3 "The informant is the steward, paid by House Merrow." --dir seals
        -> writes seals/SEAL-3.json (plaintext + nonce; do NOT show it to the User)
        -> prints the digest to publish in the Record: SEAL-3 sha256:<hex>

    python seal.py verify seals/SEAL-3.json
        -> recomputes the digest from the stored nonce and plaintext and prints it,
           so the User can compare it with the digest published earlier.

    python seal.py check <digest> <nonce> "<plaintext>"
        -> lets the User verify a revelation independently of the file.

The nonce (32 random bytes) stops a short secret being found by hashing guesses.
The digest binds the Operator: any change to the plaintext changes the digest.
Hiding holds only while the file stays unread by the User; binding holds regardless.
"""
import hashlib
import json
import os
import secrets
import sys


def digest(nonce_hex: str, plaintext: str) -> str:
    return hashlib.sha256((nonce_hex + "|" + plaintext).encode("utf-8")).hexdigest()


def make(seal_id: str, plaintext: str, directory: str) -> None:
    os.makedirs(directory, exist_ok=True)
    nonce = secrets.token_hex(32)
    d = digest(nonce, plaintext)
    path = os.path.join(directory, f"{seal_id}.json")
    if os.path.exists(path):
        raise SystemExit(f"{path} exists; a seal is never overwritten. Use a new id.")
    with open(path, "w", encoding="utf-8") as f:
        json.dump({"id": seal_id, "nonce": nonce, "plaintext": plaintext, "sha256": d}, f, indent=2)
    print(f"{seal_id} sha256:{d}")
    print(f"(stored at {path}; publish only the line above)")


def verify(path: str) -> None:
    with open(path, encoding="utf-8") as f:
        s = json.load(f)
    d = digest(s["nonce"], s["plaintext"])
    ok = "MATCHES stored digest" if d == s["sha256"] else "DOES NOT MATCH stored digest"
    print(f"{s['id']} sha256:{d} ({ok})")
    print(f"nonce: {s['nonce']}")
    print(f"plaintext: {s['plaintext']}")


def main() -> None:
    args = sys.argv[1:]
    if len(args) >= 3 and args[0] == "make":
        directory = "seals"
        if "--dir" in args:
            i = args.index("--dir")
            directory = args[i + 1]
            args = args[:i] + args[i + 2:]
        make(args[1], args[2], directory)
    elif len(args) == 2 and args[0] == "verify":
        verify(args[1])
    elif len(args) == 4 and args[0] == "check":
        d = digest(args[2], args[3])
        print("MATCH" if d == args[1].replace("sha256:", "") else "NO MATCH")
    else:
        print(__doc__)
        sys.exit(1)


if __name__ == "__main__":
    main()
