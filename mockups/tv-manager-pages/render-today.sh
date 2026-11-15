#!/usr/bin/env bash
# Render sample Today shots (Manager A layout) into today/. Gallery captions label them as sample.
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p today
browser=$(command -v chromium || command -v google-chrome-stable || command -v chrome)
tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT
shot() {
  local id=$1 out=$2 size=$3 extra=${4:-}
  "$browser" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
    --no-first-run --no-default-browser-check --user-data-dir="$tmp" --allow-file-access-from-files \
    --window-size="$size" --virtual-time-budget=2500 \
    --screenshot="today/$out.png" \
    "file://$PWD/screens.html?app=$id&theme=dark&screen=today&shot=1$extra" >/dev/null 2>&1
  echo "today/$out.png ($(wc -c < "today/$out.png") bytes)"
}
for id in add overview install launcher replace verify restore repair backups diagnostics debloat settings; do
  shot "$id" "${id}-1280" 1280,800
done
shot overview overview-800 800,800 "&w=800"
shot replace replace-800 800,800 "&w=800"
shot debloat debloat-800 800,800 "&w=800"
