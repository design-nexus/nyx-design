#!/usr/bin/env bash
# Render the desktop mockups to shots/ with headless Chromium. Nothing opens on screen.
# Usage: ./render.sh               all pages
#        ./render.sh dock          only this page
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p shots
# The wallpaper isn't committed: take the first one from the current Omarchy theme.
if [[ ! -f wallpaper.webp ]]; then
  bg=$(ls "${XDG_STATE_HOME:-$HOME/.local/state}"/omarchy/current/theme/backgrounds/* 2>/dev/null | grep -v omarchy.webp | head -1 || true)
  [[ -n $bg ]] && magick "$bg" wallpaper.webp
fi
browser=$(command -v chromium || command -v google-chrome-stable || command -v chrome)
pages=(dock:default,preview,quick,stack,fan,hidden control-center:dashboard,volume,wifi,edit notification-center:inbox,group,pinned,history,settings)
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
