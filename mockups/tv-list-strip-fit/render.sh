#!/usr/bin/env bash
# Render fit-strip mockups into shots/.
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p shots
export TMPDIR="${TMPDIR:-$HOME/.cftmp}"
mkdir -p "$TMPDIR"
[[ -f data.js ]] || ln -sfn ../tv-home-focus/data.js data.js
[[ -d art ]] || ln -sfn ../tv-home-focus/art art
browser=$(command -v chromium || command -v google-chrome-stable || command -v chrome)

jobs=()
for kind in playlist collection; do
  prefix=$([[ $kind == playlist ]] && echo pl || echo col)
  for v in a b c d e; do
    for t in dark light; do
      jobs+=("${prefix}-${v}-${t}|screens.html?kind=${kind}&variant=${v}&theme=${t}")
    done
  done
done

if (($#)); then
  picked=()
  for j in "${jobs[@]}"; do
    for p in "$@"; do [[ ${j%%|*} == *"$p"* ]] && { picked+=("$j"); break; }; done
  done
  jobs=("${picked[@]}")
fi

for j in "${jobs[@]}"; do
  IFS='|' read -r name query <<<"$j"
  tmp="$TMPDIR/fit-$name"
  rm -rf "$tmp"; mkdir -p "$tmp"
  "$browser" --headless=new --disable-gpu --disable-dev-shm-usage --hide-scrollbars \
    --force-device-scale-factor=1 --no-first-run --user-data-dir="$tmp" --allow-file-access-from-files \
    --window-size=1920,1080 --virtual-time-budget=8000 \
    --screenshot="shots/$name.png" "file://$PWD/$query" >/dev/null 2>&1 || true
  rm -rf "$tmp"
  if [[ -f shots/$name.png ]]; then echo "rendered $name"; else echo "FAILED $name"; fi
done
