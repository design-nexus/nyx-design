#!/usr/bin/env bash
# Render this gallery's shots to shots/ with headless Chromium. Nothing opens on screen.
# Screens come from screens.html's data-screens; data-narrow lists those also shot at 800 px.
# Usage: ./render.sh            every screen
#        ./render.sh NAME...    only those screens
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p shots
browser=$(command -v chromium || command -v google-chrome-stable || command -v chrome)
attr() { grep -o "data-$1=\"[^\"]*\"" screens.html | head -1 | cut -d'"' -f2 | tr , ' '; }
read -ra all <<<"$(attr screens)"
read -ra narrow <<<"$(attr narrow)"
want=("${@:-${all[@]}}")
tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT
shot() { # name size extra-query
  for t in dark light; do
    "$browser" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
      --no-first-run --no-default-browser-check --user-data-dir="$tmp" --allow-file-access-from-files \
      --window-size="$2" --virtual-time-budget=2000 \
      --screenshot="shots/screens-$1-$t.png" "file://$PWD/screens.html?theme=$t&screen=${1%-800}&shot=1$3" >/dev/null 2>&1
  done
  echo "rendered $1"
}
for s in "${want[@]}"; do
  shot "$s" 1280,800 ""
  [[ " ${narrow[*]} " == *" $s "* ]] && shot "$s-800" 800,800 "&w=800"
done
