#!/usr/bin/env bash
# Render the Nyx Git mockups to shots/ with headless Chromium. Nothing opens on screen.
# Usage: ./render.sh                 every page
#        ./render.sh screens         only these pages (directions, screens)
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p shots
browser=$(command -v chromium || command -v google-chrome-stable || command -v chrome)
# page  screens  window size  extra query  name suffix
groups=(
  "directions a,b,c,before 1280,800 - -"
  "screens flow,changes,changes-split,changes-rebase,history,timeline,review,review-empty,activity,rebase,conflicts,repo-switcher,branch-switcher,sync-menu,empty-repo,none,settings 1280,800 - -"
  "screens flow 1280,800 legend=1 -legend"
  "screens changes,history,flow 800,800 w=800 -800"
)
want=("$@")
tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT
for g in "${groups[@]}"; do
  read -r page list size extra suffix <<<"$g"
  [[ $suffix == - ]] && suffix=""
  [[ $extra == - ]] && extra="" || extra="&$extra"
  if ((${#want[@]})) && [[ ! " ${want[*]} " == *" $page "* ]]; then continue; fi
  IFS=, read -ra screens <<<"$list"
  for s in "${screens[@]}"; do
    for t in dark light; do
      "$browser" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
        --no-first-run --no-default-browser-check --user-data-dir="$tmp" --allow-file-access-from-files \
        --window-size="$size" --virtual-time-budget=2000 \
        --screenshot="shots/$page-$s$suffix-$t.png" "file://$PWD/$page.html?theme=$t&screen=$s&shot=1$extra" >/dev/null 2>&1
    done
    echo "rendered $page-$s$suffix"
  done
done
