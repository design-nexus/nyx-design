#!/usr/bin/env bash
# Render Music multi-media mockups to shots/ with headless Chromium.
# Usage: ./render.sh              every page
#        ./render.sh directions   only these pages (directions, screens)
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p shots
browser=$(command -v chromium || command -v google-chrome-stable || command -v chrome)
groups=(
  "directions today,a,b,c 1280,800 -"
  "screens home,music,now-playing,now-playing-music,radio,search,series,offline,empty,setup,signin,choose-libs,detail,detail-conflict,downloads,settings,settings-signin,podcasts-abs 1280,800 -"
  "screens a 800,800 -800"
)
want=("$@")
tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT
for g in "${groups[@]}"; do
  read -r page list size suffix <<<"$g"
  [[ $suffix == - ]] && suffix=""
  if ((${#want[@]})) && [[ ! " ${want[*]} " == *" $page "* ]]; then continue; fi
  IFS=, read -ra screens <<<"$list"
  for s in "${screens[@]}"; do
    name=$s
    [[ $suffix == -800 ]] && name="a-800"
    for t in dark light; do
      url="file://$PWD/$page.html?theme=$t&screen=$s&shot=1"
      [[ $suffix == -800 ]] && url="file://$PWD/$page.html?theme=$t&screen=a&w=800&shot=1"
      "$browser" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
        --no-first-run --no-default-browser-check --user-data-dir="$tmp" --allow-file-access-from-files \
        --window-size="$size" --virtual-time-budget=2500 \
        --screenshot="shots/$page-$name-$t.png" "$url" >/dev/null 2>&1
    done
    echo "rendered $page-$name"
  done
done
# Drop shots that are no longer in the gallery
for obsolete in player-bar player-music; do
  rm -f shots/screens-$obsolete-dark.png shots/screens-$obsolete-light.png
done
