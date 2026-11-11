#!/usr/bin/env bash
# The built-in themes' preview pictures (<id>.jpg, 1280x720), for the theme picker.
# Omarchy's own preview is used where the theme is Omarchy's (same colours, see
# ../themes/<id>/colors.toml); the others are drawn from preview.html in the theme's
# resolved colours with headless Chromium. Nothing opens on screen.
# Usage: ./render.sh            every built-in theme
#        ./render.sh nord ...   only these
set -euo pipefail
cd "$(dirname "$0")"
json=../builtin-themes.json
declare -A omarchy=(
  [gruvbox-dark]=gruvbox [nord]=nord [kanagawa]=kanagawa [everforest]=everforest
  [tokyo-night]=tokyo-night [catppuccin-mocha]=catppuccin [catppuccin-latte]=catppuccin-latte
)
browser=$(command -v chromium || command -v google-chrome-stable || command -v chrome)
ids=("$@")
((${#ids[@]})) || mapfile -t ids < <(python3 -c "import json,sys; print('\n'.join(json.load(open('$json'))))")
tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT
for id in "${ids[@]}"; do
  src=/usr/share/omarchy/themes/${omarchy[$id]:-none}/preview.png
  if [[ -n ${omarchy[$id]:-} && -f $src ]]; then
    magick "$src" -resize 1280x720 -quality 86 "$id.jpg"
  else
    python3 - "$json" "$id" > "$tmp/theme.js" <<'EOF'
import json, sys
themes = json.load(open(sys.argv[1]))
t = dict(themes[sys.argv[2]], id=sys.argv[2])
print("window.THEME = " + json.dumps(t) + ";")
EOF
    cp preview.html "$tmp/"
    "$browser" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1.5 \
      --no-first-run --no-default-browser-check --user-data-dir="$tmp/profile" --allow-file-access-from-files \
      --window-size=1280,720 --virtual-time-budget=1500 \
      --screenshot="$tmp/shot.png" "file://$tmp/preview.html" >/dev/null 2>&1
    magick "$tmp/shot.png" -resize 1280x720 -quality 86 "$id.jpg"
  fi
  echo "$id.jpg"
done
