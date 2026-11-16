#!/usr/bin/env bash
# Render every panel, option and state to shots/PANEL-OPT-STATE-THEME.png with headless Chromium,
# 1280×800. Nothing opens on screen; the profile is a throwaway folder removed on exit.
# Usage: ./render.sh             everything
#        ./render.sh pw vpn      only those panels
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p shots
browser=$(command -v chromium || command -v google-chrome-stable || command -v chrome)
mapfile -t jobs < <(node -e '
  const { PANELS } = require("./plan.js");
  const want = process.argv.slice(1);
  for (const p of PANELS) if (!want.length || want.includes(p.id))
    for (const o of p.options) for (const [s] of p.states) console.log(`${p.id} ${o.id} ${s}`);' "$@")
tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT
for j in "${jobs[@]}"; do
  read -r panel opt state <<<"$j"
  for t in dark light; do
    "$browser" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
      --no-first-run --no-default-browser-check --user-data-dir="$tmp" --allow-file-access-from-files \
      --window-size=1280,800 --virtual-time-budget=2000 \
      --screenshot="shots/$panel-$opt-$state-$t.png" "file://$PWD/screens.html?panel=$panel&opt=$opt&state=$state&theme=$t&shot=1" >/dev/null 2>&1
  done
done
echo "rendered ${#jobs[@]} screens, dark and light"
