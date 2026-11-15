# TV Manager pages: mockups

Complete UI overhaul of TV Manager inside the shell already chosen (Manager A: TVs in the
sidebar). One tab per page: **Today** is a real screenshot of the installed app; options are
different interaction models (consoles, wizards, diffs, filmstrips, …), not rearranged cards.
Mockups only; Ken picks what gets built. Picks go in `picks.json`.

- `index.html`, `gallery.js`, `gallery.css`: tabs and the full-window viewer.
- `screens.html?app=ID&screen=NAME&theme=dark|light[&w=800]`: one option screen, live.
- `./render.sh`: option shots → `shots/`.
- `today/`: real app screenshots (git-ignored), taken with `NYX_TV_MANAGER_APP_ID` on a
  headless output and scratch XDG (devices copied from `~/.config/nyx-tv-manager`).
- Kit: `../revamp/`. Shell + overhaul parts: `pages/shell.js`, `pages/shell.css`.

Binary stays `nyx-tv-manager`. Display name is **TV Manager**.
