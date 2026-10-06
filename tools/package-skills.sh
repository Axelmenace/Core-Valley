#!/usr/bin/env bash
# Build one upload-ready zip per skill (claude.ai > Settings > Capabilities > Skills).
set -euo pipefail
root="$(cd "$(dirname "$0")/.." && pwd)"
mkdir -p "$root/dist"
for dir in "$root"/skills/*/; do
  name="$(basename "$dir")"
  rm -f "$root/dist/$name.zip"
  (cd "$root/skills" && zip -qr "$root/dist/$name.zip" "$name" -x '*/__pycache__/*')
  echo "dist/$name.zip"
done
