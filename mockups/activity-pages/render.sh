#!/usr/bin/env bash
# Render the option shots to shots/ with headless Chromium. Nothing opens on screen.
# Each tab's screens come from its options in pages/ID.js; "-800" ones are 800 px wide.
# Usage: ./render.sh               every tab
#        ./render.sh ID...         only those tabs
#        ./render.sh ID SCREEN...  only those screens of one tab
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p shots
browser=$(command -v chromium || command -v google-chrome-stable || command -v chrome)
list() { # tab -> its option screens, one per line
  node -e '
    const fs = require("fs"); const APPS = {}; global.REG = (id, d) => { APPS[id] = d; };
    eval(fs.readFileSync(`pages/${process.argv[1]}.js`, "utf8"));
    for (const o of Object.values(APPS)[0].options || []) for (const [s, , , src] of o.shots) console.log(src ? `${s}\t${src}` : s);
  ' "$1"
}
tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT
shot() { # tab screen [TAB/SCREEN?query]: the shot's name, and what it draws when another tab's screen
  local s=$2 size=1280,800 extra="" app=$1 scr=${2%-800}
  [[ $s == *-800 ]] && size=800,800 extra="&w=800"
  if [[ -n ${3:-} ]]; then app=${3%%/*}; scr=${3#*/}; [[ $scr == *\?* ]] && extra="$extra&${scr#*\?}" && scr=${scr%%\?*}; fi
  for t in dark light; do
    "$browser" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
      --no-first-run --no-default-browser-check --user-data-dir="$tmp" --allow-file-access-from-files \
      --window-size="$size" --virtual-time-budget=2000 \
      --screenshot="shots/$1-$s-$t.png" "file://$PWD/screens.html?app=$app&theme=$t&screen=$scr&shot=1$extra" >/dev/null 2>&1
  done
}
tabs_all() { command ls pages/*.js | xargs -n1 basename | sed 's/\.js$//' | grep -vx shell; }
if [[ $# -ge 2 && -f pages/$1.js && ! -f pages/$2.js ]]; then
  tab=$1; shift
  for s in "$@"; do shot "$tab" "$s" "$(list "$tab" | awk -F'\t' -v s="$s" '$1 == s { print $2 }')"; echo "rendered $tab $s"; done
  exit
fi
tabs=("$@")
[[ ${#tabs[@]} -eq 0 ]] && mapfile -t tabs < <(tabs_all)
for a in "${tabs[@]}"; do
  n=0
  while IFS=$'\t' read -r s src; do shot "$a" "$s" "$src"; n=$((n + 1)); done < <(list "$a")
  echo "rendered $a ($n screens)"
done
