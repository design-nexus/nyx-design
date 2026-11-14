# Nyx Settings pages: mockups

The pages inside the two-level Settings Ken picked on the revamp page (option A: sections in
the sidebar, each section's pages as tabs). One tab per page, grouped by section, each with
today's page, what's wrong with it, and its options. Mockups only; Ken picks what gets built.

- Round 1, `pages/styles.js`: three page styles drawn on Sound, Displays, Wi-Fi, Keyboard
  Shortcuts and Updates; Ken picked B (controls beside a live preview, `split` in shell.js).
  Round 2: every page in style B, and the NyxOS tabs (its sidebar and Home, its own pages,
  and how system changes are applied), drawn with `nwin`. Picks are in `picks.json`.
- Extensions, round 3, `pages/ext-devices.js`: the Galleon's Stream Deck run by Settings, and the ASTRO A50 X
- Extensions, round 1, `pages/ext-styles.js`: three styles for the pages extensions add
  (drawn by `ext/render.rs` from their JSON), shown on ASUS, Aura Lighting, a Logitech mouse
  and Clipboard. Once Ken picks one, every extension's pages get drawn in it.
- `pages/oa-settings.js`: what an online account's Connection settings button opens
  (tabs in the dialog, a dialog with its own sidebar, or no popup at all).
- `index.html`, `gallery.js`, `gallery.css`: the page, its tabs (`SECTIONS`) and the
  full-window viewer (← → through every shot, carrying on into the next tab; D and L for dark
  and light; Esc closes). A tab without `pages/ID.js` shows dimmed.
- `screens.html?app=ID&screen=NAME&theme=dark|light[&w=800]`: one screen, live.
- `./render.sh [ID…]` or `./render.sh ID SCREEN…`: renders the option shots to
  `shots/ID-SCREEN-dark.png` and `-light.png` with headless Chromium. Screens ending in `-800`
  are 800 px wide.
- `today/`: screenshots of the real pages (git-ignored: they show Ken's own data), taken with
  Settings' `SETTINGS_SNAPSHOT` on a headless output, as `today/ID-1280.png` and `-800.png`.
- The kit is `../revamp`'s (tokens, mock, kit, common, and its `apps/settings.css` for the
  Settings shell); don't change it from here. `pages/shell.js` and `shell.css` are the Settings
  window and the rows, meters and curves every page uses; a tab's own parts go in
  `pages/ID.js` and `pages/ID.css`.

A tab's file calls `REG(ID, { name, summary, problems, today, options, pages })` as on the
revamp page. Functions only at load: the gallery loads every tab's file without the kit.
Sample data is made up; the shots are public.
