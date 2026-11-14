#!/usr/bin/env bash
# Render the Nyx Browser feature mockups to shots/ with headless Chromium. Nothing opens on screen.
# Usage: ./render.sh            every screen
#        ./render.sh share      only the screens named
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p shots
browser=$(command -v chromium || command -v google-chrome-stable || command -v chrome)
shots=(
  pwicon-board pwicon-a pwicon-b pwicon-c pwicon-d pwicon-e pwicon-f
  selection-popup settings-selection
  video-panel video-progress settings-downloads
  vpn-panel vpn-favorites vpn-countries vpn-search vpn-add settings-vpn
  open-in open-in-link
  shield-panel shield-picker settings-blocking
  passwords-field passwords-panel passwords-save passkey settings-passwords
  settings-tabs settings-tabs-2 tab-hibernated
  share share-qr
  quick-commands settings-gestures
)
want=("$@")
tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT
for screen in "${shots[@]}"; do
  if ((${#want[@]})) && [[ " ${want[*]} " != *" $screen "* ]]; then
    continue
  fi
  for t in mocha dark light; do
    "$browser" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
      --no-first-run --no-default-browser-check --user-data-dir="$tmp" --allow-file-access-from-files \
      --window-size=1440,900 --virtual-time-budget=1500 \
      --screenshot="shots/$screen-$t.png" "file://$PWD/browser.html?theme=$t&screen=$screen&shot=1" >/dev/null 2>&1
  done
  echo "rendered $screen"
done
