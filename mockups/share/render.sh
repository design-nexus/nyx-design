#!/usr/bin/env bash
# Render the Share Sheet mockup to shots/ with headless Chromium. Nothing opens on screen.
# Usage: ./render.sh             every screen
#        ./render.sh files url   only these screens
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p shots
browser=$(command -v chromium || command -v google-chrome-stable || command -v chrome)
screens=(files url sending menu qr first)
((${#@})) && screens=("$@")

tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT
for s in "${screens[@]}"; do
  for t in dark light; do
    "$browser" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
      --no-first-run --no-default-browser-check --user-data-dir="$tmp" --allow-file-access-from-files \
      --window-size=1280,800 --virtual-time-budget=1500 \
      --screenshot="shots/share-$s-$t.png" "file://$PWD/share.html?screen=$s&theme=$t&shot=1" >/dev/null 2>&1
  done
  echo "rendered $s"
done

# The Share app (app.html): a floating window, in both themes.
apps=(nearby sending incoming transfers settings empty)
[[ -n ${APP_SCREENS:-} ]] && read -ra apps <<<"$APP_SCREENS"
for s in "${apps[@]}"; do
  for t in dark light; do
    "$browser" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
      --no-first-run --no-default-browser-check --user-data-dir="$tmp" --allow-file-access-from-files \
      --window-size=1280,800 --virtual-time-budget=1500 \
      --screenshot="shots/app-$s-$t.png" "file://$PWD/app.html?screen=$s&theme=$t&shot=1" >/dev/null 2>&1
  done
  echo "rendered app $s"
done
