#!/usr/bin/env bash
# Render the Nyx Dock mockups to shots/ with headless Chromium. Nothing opens on screen.
# Usage: ./render.sh                 every page
#        ./render.sh ideas           only these pages (directions, features, ideas)
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p shots
# The pages use the bar mockups' styles, whose wallpaper isn't committed: make sure it's there.
if [[ ! -f ../bar/wallpaper.webp ]]; then
  if [[ -f ../desktop/wallpaper.webp ]]; then
    cp ../desktop/wallpaper.webp ../bar/
  else
    bg=$(ls "${XDG_STATE_HOME:-$HOME/.local/state}"/omarchy/current/theme/backgrounds/* 2>/dev/null | grep -v omarchy.webp | head -1 || true)
    [[ -n $bg ]] && magick "$bg" ../bar/wallpaper.webp
  fi
fi
browser=$(command -v chromium || command -v google-chrome-stable || command -v chrome)
pages=(
  directions:current,a,b,c,d,e,v
  features:indicators,preview,card,folder,apps,menu
  ideas:keys,recent,media,drives,downloads,drop,minimized,hidden
)
want=("$@")
tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT
for entry in "${pages[@]}"; do
  page=${entry%%:*}
  if ((${#want[@]})) && [[ ! " ${want[*]} " == *" $page "* ]]; then continue; fi
  IFS=, read -ra screens <<<"${entry#*:}"
  for s in "${screens[@]}"; do
    for t in dark light; do
      "$browser" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
        --no-first-run --no-default-browser-check --user-data-dir="$tmp" --allow-file-access-from-files \
        --window-size=1920,1080 --virtual-time-budget=1500 \
        --screenshot="shots/$page-$s-$t.png" "file://$PWD/$page.html?theme=$t&screen=$s&shot=1" >/dev/null 2>&1
    done
    echo "rendered $page-$s"
  done
done
