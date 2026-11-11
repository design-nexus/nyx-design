#!/usr/bin/env bash
# Render the Nyx Lyra mockups to shots/ with headless Chromium. Nothing opens on screen.
# Usage: ./render.sh                 every page
#        ./render.sh players         only these pages (directions, screens, players, integration)
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p shots
# The mini-player and integration pages use the bar mockups' wallpaper, which isn't committed.
if [[ ! -f ../bar/wallpaper.webp ]]; then
  if [[ -f ../desktop/wallpaper.webp ]]; then
    cp ../desktop/wallpaper.webp ../bar/
  else
    bg=$(ls "${XDG_STATE_HOME:-$HOME/.local/state}"/omarchy/current/theme/backgrounds/* 2>/dev/null | grep -v omarchy.webp | head -1 || true)
    [[ -n $bg ]] && magick "$bg" ../bar/wallpaper.webp
  fi
fi
browser=$(command -v chromium || command -v google-chrome-stable || command -v chrome)
# page  screens  window size  name suffix
groups=(
  "directions a,b,c,d 1280,800 -"
  "directions ref 1920,1080 -"
  "screens explore,search,artist,album,playlist,liked,library,signin,blocked,offline,unsupported,empty,settings 1280,800 -"
  "screens home,album 800,800 -800"
  "players expanded-a,expanded-b,expanded-c,mini-strip,mini-square,mini-card,states 1280,800 -"
  "integration glimpse,media,notification,dock 1920,1080 -"
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
    for t in dark light; do
      "$browser" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
        --no-first-run --no-default-browser-check --user-data-dir="$tmp" --allow-file-access-from-files \
        --window-size="$size" --virtual-time-budget=2000 \
        --screenshot="shots/$page-$s$suffix-$t.png" "file://$PWD/$page.html?theme=$t&screen=$s&shot=1" >/dev/null 2>&1
    done
    echo "rendered $page-$s$suffix"
  done
done
