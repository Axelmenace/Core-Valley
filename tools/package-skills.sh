#!/usr/bin/env bash
# Build one upload-ready zip per skill (claude.ai > Settings > Capabilities > Skills):
# the skills in skills/ and in each section's own skills/ folder (worldbuilding/skills/).
set -euo pipefail
root="$(cd "$(dirname "$0")/.." && pwd)"
mkdir -p "$root/dist"
for dir in "$root"/skills/*/ "$root"/*/skills/*/; do
  [ -f "$dir/SKILL.md" ] || continue
  name="$(basename "$dir")"
  parent="$(dirname "$dir")"
  rm -f "$root/dist/$name.zip"
  (cd "$parent" && zip -qr "$root/dist/$name.zip" "$name" -x '*/__pycache__/*')
  echo "dist/$name.zip"
done
