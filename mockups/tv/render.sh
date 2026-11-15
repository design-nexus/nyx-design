#!/usr/bin/env bash
# Render the Nyx TV mockups to shots/ with headless Chromium. Nothing opens on screen.
# Usage: ./render.sh              every shot
#        ./render.sh PATTERN...   only shots whose name contains a pattern (tv-a-home, manager-b)
# Needs data.js and art/ first: python3 extract.py
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p shots
[[ -f data.js ]] || python3 extract.py
browser=$(command -v chromium || command -v google-chrome-stable || command -v chrome)

tv_screens=(home home-nohero offline card-menu movies shows collections movie show apps search signin servers profiles settings rows themes quick inputs ambient oled)
# Player: Plex rebuild (contract) + four archive directions.
player_dirs=(a b c d)
player_screens=(controls credits audio idle)
plex_screens=(idle controls scrubber audio remote)
mgr_screens=(add overview install replace verify restore repair backups diagnostics debloat debloat-confirm)
mgr_narrow=(overview replace debloat)

jobs=()
for d in a b c; do
  for s in "${tv_screens[@]}"; do
    for t in dark light; do jobs+=("tv-$d-$s-$t|1920,1080|screens.html?direction=$d&screen=$s&theme=$t"); done
  done
done
for s in "${plex_screens[@]}"; do
  for t in dark light; do jobs+=("tv-player-plex-$s-$t|1920,1080|screens.html?direction=plex&screen=player-$s&theme=$t"); done
done
for d in "${player_dirs[@]}"; do
  for s in "${player_screens[@]}"; do
    for t in dark light; do jobs+=("tv-player-$d-$s-$t|1920,1080|screens.html?direction=$d&screen=player-$s&theme=$t"); done
  done
done
for d in a b; do
  for s in "${mgr_screens[@]}"; do
    for t in dark light; do jobs+=("manager-$d-$s-$t|1280,800|manager.html?direction=$d&screen=$s&theme=$t"); done
  done
  for s in "${mgr_narrow[@]}"; do
    for t in dark light; do jobs+=("manager-$d-$s-800-$t|800,800|manager.html?direction=$d&screen=$s&theme=$t&w=800"); done
  done
done

if (($#)); then
  picked=()
  for j in "${jobs[@]}"; do
    for p in "$@"; do [[ ${j%%|*} == *"$p"* ]] && { picked+=("$j"); break; }; done
  done
  jobs=("${picked[@]}")
fi

render() {
  IFS='|' read -r name size query <<<"$1"
  local tmp
  tmp=$(mktemp -d)
  "$browser" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
    --no-first-run --no-default-browser-check --user-data-dir="$tmp" --allow-file-access-from-files \
    --window-size="$size" --virtual-time-budget=4000 \
    --screenshot="shots/$name.png" "file://$PWD/$query&shot=1" >/dev/null 2>&1 || true
  rm -rf "$tmp"
  if [[ -f shots/$name.png ]]; then
    magick "shots/$name.png" -quality 86 "shots/$name.jpg" && rm "shots/$name.png"
    echo "rendered $name"
  else
    echo "FAILED $name"
  fi
}
export -f render
export browser
printf '%s\n' "${jobs[@]}" | xargs -P 6 -I{} bash -c 'render "$@"' _ {}
