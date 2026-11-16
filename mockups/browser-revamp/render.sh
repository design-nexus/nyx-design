#!/usr/bin/env bash
# Render screens to shots/LAYOUT-SCREEN-THEME.png with headless Chromium (a Studio, b Focus,
# c Workbench). Nothing opens on screen. Screens, window sizes and which screens are drawn in each
# layout come from plan.js; the shared ones are drawn in Focus only.
# Usage: ./render.sh               every layout, every screen
#        ./render.sh a b           only those layouts
#        ./render.sh a main menu   only those screens of those layouts
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p shots
browser=$(command -v chromium || command -v google-chrome-stable || command -v chrome)
mapfile -t screens < <(node -e 'const { SCREENS } = require("./plan.js"); for (const s of SCREENS) console.log(`${s.id} ${s.w},${s.h} ${s.per ? 1 : 0}`)')
tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT
shot() { # dir screen size
  local extra=""
  [[ $3 == 800,* ]] && extra="&w=800"
  for t in dark light; do
    "$browser" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
      --no-first-run --no-default-browser-check --user-data-dir="$tmp" --allow-file-access-from-files \
      --window-size="$3" --virtual-time-budget=2000 \
      --screenshot="shots/$1-$2-$t.png" "file://$PWD/screens.html?dir=$1&screen=$2&theme=$t&shot=1$extra" >/dev/null 2>&1
  done
}
dirs=(a b c)
want=()
if [[ $# -ge 1 ]]; then
  dirs=()
  for x in "$@"; do [[ $x =~ ^[abc]$ ]] && dirs+=("$x") || want+=("$x"); done
fi
for d in "${dirs[@]}"; do
  n=0
  for s in "${screens[@]}"; do
    read -r screen size per <<<"$s"
    [[ $d != b && $per == 0 ]] && continue
    if ((${#want[@]})) && [[ " ${want[*]} " != *" $screen "* ]]; then continue; fi
    shot "$d" "$screen" "$size"
    n=$((n + 1))
  done
  echo "rendered $d ($n screens)"
done
