#!/usr/bin/env bash
# Check the icon sets, write their pages and photograph them into shots/ with headless
# Chromium. Nothing opens on screen.
# Usage: ./render.sh             every set
#        ./render.sh frame mono  only these sets (umbra, tinted, frame, colour-tile, mono, paper)
set -euo pipefail
cd "$(dirname "$0")"
python3 render.py
mkdir -p shots
browser=$(command -v chromium || command -v google-chrome-stable || command -v chrome)
tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT
want=("$@")
for f in pages/*.html; do
  name=$(basename "$f" .html)
  if ((${#want[@]})); then
    [[ " ${want[*]} " == *" ${name%-*-*} "* ]] || continue
  fi
  "$browser" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
    --no-first-run --no-default-browser-check --user-data-dir="$tmp" --allow-file-access-from-files \
    --window-size=1280,800 --virtual-time-budget=1500 \
    --screenshot="shots/$name.png" "file://$PWD/$f" >/dev/null 2>&1
  echo "shot $name"
done
