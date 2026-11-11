#!/usr/bin/env bash
# Render the Nyx Bar mockups to shots/ with headless Chromium. Nothing opens on screen.
# Usage: ./render.sh                 every page
#        ./render.sh widgets         only these pages (directions, widgets, layouts, control-center)
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p shots
# The wallpaper isn't committed: reuse the desktop mockups' copy, else take the first one
# from the current Omarchy theme.
if [[ ! -f wallpaper.webp ]]; then
  if [[ -f ../desktop/wallpaper.webp ]]; then
    cp ../desktop/wallpaper.webp .
  else
    bg=$(ls "${XDG_STATE_HOME:-$HOME/.local/state}"/omarchy/current/theme/backgrounds/* 2>/dev/null | grep -v omarchy.webp | head -1 || true)
    [[ -n $bg ]] && magick "$bg" wallpaper.webp
  fi
fi
browser=$(command -v chromium || command -v google-chrome-stable || command -v chrome)
pages=(
  directions:current,a,b,c,d,d-media,d-notify,e,f
  widgets:calendar,calendar-stacked,workspaces,status,media,weather,stats,tray,panels,new
  layouts:right,left,presets,heights
  control-center:dashboard,edit,wifi,wifi-more,bluetooth,devices,vpn,vpn-location,vpn-tor,tailscale,display,sound,battery
)
want=("$@")
tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT
shot() { # out url width height
  "$browser" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
    --no-first-run --no-default-browser-check --user-data-dir="$tmp" --allow-file-access-from-files \
    --window-size="$3,$4" --virtual-time-budget=1500 \
    --screenshot="shots/$1.png" "file://$PWD/$2" >/dev/null 2>&1
}
for entry in "${pages[@]}"; do
  page=${entry%%:*}
  if ((${#want[@]})) && [[ ! " ${want[*]} " == *" $page "* ]]; then continue; fi
  IFS=, read -ra screens <<<"${entry#*:}"
  for s in "${screens[@]}"; do
    for t in dark light; do
      shot "$page-$s-$t" "$page.html?theme=$t&screen=$s&shot=1" 1920 1080
    done
    # Each bar direction also at 1280 px, to show what it drops when narrow.
    [[ $page == directions ]] && shot "$page-$s-1280" "$page.html?theme=dark&screen=$s&shot=1" 1280 800
    echo "rendered $page-$s"
  done
done
