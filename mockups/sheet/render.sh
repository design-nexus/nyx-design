#!/usr/bin/env bash
# Render the inset-sheet shots to shots/ with headless Chromium. Nothing opens on screen.
# Each shot comes today (blended, no lines) and as the inset sheet, dark and light.
# The pages are the polish, Lyra and Git mockups; ?v=sheet (Git: ?div=c) draws the sheet.
# Usage: ./render.sh            every shot
#        ./render.sh files mail only these shots (and their -800)
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p shots
browser=$(command -v chromium || command -v google-chrome-stable || command -v chrome)
# name  page (in ../)  query  window size
shots=(
  "files polish/files.html - 1280,800"
  "mail polish/mail.html - 1280,800"
  "settings polish/settings.html screen=sound 1280,800"
  "settings-card polish/settings.html screen=card 1280,800"
  "calendar polish/calendar.html - 1280,800"
  "lyra lyra/screens.html screen=home 1280,800"
  "lyra-album lyra/screens.html screen=album 1280,800"
  "theater polish/theater.html screen=detail 1280,800"
  "theater-library polish/theater.html screen=library 1280,800"
  "git git/screens.html screen=changes 1280,800"
  "git-flow git/screens.html screen=flow 1280,800"
  "files-800 polish/files.html - 800,800"
  "mail-800 polish/mail.html - 800,800"
  "calendar-800 polish/calendar.html - 800,800"
  "lyra-800 lyra/screens.html screen=home 800,800"
  "git-800 git/screens.html screen=changes&w=800 800,800"
)
want=("$@")
tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT
for s in "${shots[@]}"; do
  read -r name page query size <<<"$s"
  if ((${#want[@]})) && [[ ! " ${want[*]} " == *" ${name%-800} "* ]]; then continue; fi
  [[ $query == - ]] && query="" || query="&$query"
  for look in today sheet; do
    if [[ $page == git/* ]]; then
      [[ $look == sheet ]] && v="&div=c" || v=""
    else
      [[ $look == sheet ]] && v="&v=sheet" || v="&v=blended"
    fi
    for t in dark light; do
      "$browser" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
        --no-first-run --no-default-browser-check --user-data-dir="$tmp" --allow-file-access-from-files \
        --window-size="$size" --virtual-time-budget=2000 \
        --screenshot="shots/$name-$look-$t.png" "file://$PWD/../$page?theme=$t&shot=1$query$v" >/dev/null 2>&1
    done
  done
  echo "rendered $name"
done
