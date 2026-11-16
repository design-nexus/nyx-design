#!/usr/bin/env bash
# Render home focus-strip mockups to shots/.
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p shots
export TMPDIR="${TMPDIR:-$HOME/.cftmp}"
mkdir -p "$TMPDIR"
[[ -f data.js ]] || ln -sfn ../tv/data.js data.js
[[ -d art ]] || ln -sfn ../tv/art art
browser=$(command -v chromium || command -v google-chrome-stable || command -v chrome)

jobs=()
for kind in collection playlist; do
  for v in a b c; do
    for t in dark light; do
      jobs+=("list-${kind}-${v}-${t}|screens.html?kind=${kind}&variant=${v}&theme=${t}")
    done
  done
done
for v in 1 2 3; do
  for t in dark light; do
    jobs+=("app-${v}-${t}|screens.html?kind=app&variant=${v}&theme=${t}")
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
  tmp="$TMPDIR/u$name"
  rm -rf "$tmp"; mkdir -p "$tmp"
  "$browser" --headless=new --disable-gpu --disable-dev-shm-usage --hide-scrollbars \
    --force-device-scale-factor=1 --no-first-run --user-data-dir="$tmp" --allow-file-access-from-files \
    --window-size=1920,1080 --virtual-time-budget=8000 \
    --screenshot="shots/$name.png" "file://$PWD/$query" >/dev/null 2>&1 || true
  rm -rf "$tmp"
  if [[ -f shots/$name.png ]]; then echo "rendered $name"; else echo "FAILED $name"; fi
done
