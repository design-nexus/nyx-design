#!/usr/bin/env bash
# Render the Nyx Git mockups to shots/ with headless Chromium. Nothing opens on screen.
# Usage: ./render.sh                 every page
#        ./render.sh screens         only these pages (directions, screens)
#        ./render.sh div             only the divider-line shots
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
  "screens changes,history,flow,review,activity,rebase,none 1280,800 div=a -div-a"
  "screens changes,history 1280,800 div=b -div-b"
  "screens changes,history 1280,800 div=c -div-c"
  "screens changes,history 1280,800 div=d -div-d"
  "screens changes,history 800,800 w=800&div=a -800-div-a"
)
want=("$@")
tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT
for g in "${groups[@]}"; do
  read -r page list size extra suffix <<<"$g"
  [[ $suffix == - ]] && suffix=""
  [[ $extra == - ]] && extra="" || extra="&$extra"
  if ((${#want[@]})); then
    pick=""
    [[ " ${want[*]} " == *" $page "* ]] && pick=1
    [[ " ${want[*]} " == *" div "* && $suffix == *-div-* ]] && pick=1
    [[ -n $pick ]] || continue
  fi
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
