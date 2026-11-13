#!/usr/bin/env bash
# Render the option shots to shots/ with headless Chromium. Nothing opens on screen.
# Each app's screens come from its options in apps/APP.js; "-800" ones are 800 px wide.
# Usage: ./render.sh               every app
#        ./render.sh APP...        only those apps
#        ./render.sh APP SCREEN... only those screens of one app
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p shots
browser=$(command -v chromium || command -v google-chrome-stable || command -v chrome)
list() { # app -> its option screens, one per line
  node -e '
    const fs = require("fs"); const APPS = {}; global.REG = (id, d) => { APPS[id] = d; };
    eval(fs.readFileSync(`apps/${process.argv[1]}.js`, "utf8"));
    for (const o of Object.values(APPS)[0].options || []) for (const [s] of o.shots) console.log(s);
  ' "$1"
}
tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT
shot() { # app screen
  local s=$2 size=1280,800 extra=""
  [[ $s == *-800 ]] && size=800,800 extra="&w=800"
  for t in dark light; do
    "$browser" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
      --no-first-run --no-default-browser-check --user-data-dir="$tmp" --allow-file-access-from-files \
      --window-size="$size" --virtual-time-budget=2000 \
      --screenshot="shots/$1-$s-$t.png" "file://$PWD/screens.html?app=$1&theme=$t&screen=${s%-800}&shot=1$extra" >/dev/null 2>&1
  done
}
if [[ $# -ge 2 && -f apps/$1.js && ! -f apps/$2.js ]]; then
  app=$1; shift
  for s in "$@"; do shot "$app" "$s"; echo "rendered $app $s"; done
  exit
fi
apps=("$@")
[[ ${#apps[@]} -eq 0 ]] && mapfile -t apps < <(command ls apps/*.js | xargs -n1 basename | sed 's/\.js$//')
for a in "${apps[@]}"; do
  n=0
  while read -r s; do shot "$a" "$s"; n=$((n + 1)); done < <(list "$a")
  echo "rendered $a ($n screens)"
done
