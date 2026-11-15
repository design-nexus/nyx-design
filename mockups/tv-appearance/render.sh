#!/usr/bin/env bash
# Render Appearance redesign mockups. Nothing opens on screen.
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p shots
browser=$(command -v chromium || command -v google-chrome-stable || command -v chrome)
tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT

render() {
  local name=$1 size=$2 url=$3
  local w=${size%,*} h=${size#*,}
  echo "  $name"
  "$browser" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
    --no-first-run --no-default-browser-check --user-data-dir="$tmp" --allow-file-access-from-files \
    --window-size="$w,$h" --screenshot="$PWD/shots/$name.jpg" "file://$PWD/$url" >/dev/null 2>&1
}

echo "Rendering Appearance directions…"
for d in a b c d; do
  for t in dark light; do
    render "appearance-$d-$t" "1920,1080" "screens.html?dir=$d&theme=$t"
  done
done
echo "Done → shots/"
