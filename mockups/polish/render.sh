#!/usr/bin/env bash
# Render every mockup to shots/ with headless Chromium. Nothing opens on screen.
# Usage: ./render.sh            all pages
#        ./render.sh files mail only these pages
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p shots
browser=$(command -v chromium || command -v google-chrome-stable || command -v chrome)

# page:screen1,screen2 (a page without screens renders once)
pages=(files mail settings:sound,card music calendar theater:library,detail)
want=("$@")

shoot() { # url out width height
  "$browser" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
    --no-first-run --no-default-browser-check --user-data-dir="$tmp" \
    --window-size="$3,$4" --virtual-time-budget=1500 --screenshot="$2" "$1" >/dev/null 2>&1
}

tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT
for entry in "${pages[@]}"; do
  page=${entry%%:*}
  if ((${#want[@]})) && [[ ! " ${want[*]} " == *" $page "* ]]; then continue; fi
  screens=("")
  [[ $entry == *:* ]] && IFS=, read -ra screens <<<"${entry#*:}"
  for s in "${screens[@]}"; do
    name=$page${s:+-$s}
    for v in before blended tinted; do
      for t in dark light; do
        shoot "file://$PWD/$page.html?v=$v&theme=$t&screen=$s&shot=1" "shots/$name-$v-$t.png" 1280 800
      done
    done
    for v in blended tinted; do
      shoot "file://$PWD/$page.html?v=$v&theme=dark&screen=$s&shot=1" "shots/$name-$v-dark-800.png" 800 800
    done
    echo "rendered $name"
  done
done
