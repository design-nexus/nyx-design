#!/usr/bin/env bash
# Render the Nyx Browser mockups to shots/ with headless Chromium. Nothing opens on screen.
# Usage: ./render.sh            every screen
#        ./render.sh vertical   only the screens named
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p shots
browser=$(command -v chromium || command -v google-chrome-stable || command -v chrome)
# screen  window size
shots=(
  "vertical 1440,900" "compact 1280,800" "hidden 1280,800" "horizontal 1440,900" "horizontal-drag 1440,900"
  "workspaces 1440,900" "split 1440,900" "newtab 1440,900" "appearance 1440,900" "settings 1440,900"
  "insecure 1440,900" "frosted 1440,900" "overflow 800,800"
  "vertical-bookmarks 1440,900" "horizontal-bookmarks 1440,900" "bookmarks-folder 1440,900"
  "compact-bookmarks 1100,800" "newtab-bookmarks 1440,900"
)
want=("$@")
tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT
for s in "${shots[@]}"; do
  read -r screen size <<<"$s"
  if ((${#want[@]})) && [[ " ${want[*]} " != *" $screen "* ]]; then
    continue
  fi
  for t in mocha dark light; do
    "$browser" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
      --no-first-run --no-default-browser-check --user-data-dir="$tmp" --allow-file-access-from-files \
      --window-size="$size" --virtual-time-budget=1500 \
      --screenshot="shots/$screen-$t.png" "file://$PWD/browser.html?theme=$t&screen=$screen&shot=1" >/dev/null 2>&1
  done
  echo "rendered $screen"
done
