#!/usr/bin/env bash
# Render the Nyx Agents mockups to shots/ with headless Chromium. Nothing opens on screen.
# Usage: ./render.sh            every screen
#        ./render.sh NAME...    only those screens
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p shots
browser=$(command -v chromium || command -v google-chrome-stable || command -v chrome)
all=(empty new active needs more stopping failed ended discard split desktop subagents history hub before)
want=("${@:-${all[@]}}")
tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT
for s in "${want[@]}"; do
  for t in dark light; do
    "$browser" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
      --no-first-run --no-default-browser-check --user-data-dir="$tmp" --allow-file-access-from-files \
      --window-size=1280,800 --virtual-time-budget=2000 \
      --screenshot="shots/screens-$s-$t.png" "file://$PWD/screens.html?theme=$t&screen=$s&shot=1" >/dev/null 2>&1
  done
  echo "rendered $s"
done
