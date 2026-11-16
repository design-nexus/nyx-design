# Nyx Activity pages: mockups

The pages inside the Activity Ken picked on the revamp page (option B, a dashboard you
arrange, and E, Processes as apps and what they run). One tab per page, grouped as Activity's
sidebar groups them, each with today's page, what's wrong with it, and two or three options.
Mockups only; Ken picks what gets built. Picks are in `picks.json`.

- `index.html`, `gallery.js`, `gallery.css`: the page, its tabs (`SECTIONS`, using Activity's
  own section ids) and the full-window viewer (← → through every shot, carrying on into the
  next tab; D and L for dark and light; Esc closes). A tab without `pages/ID.js` shows dimmed.
- `screens.html?app=ID&screen=NAME&theme=dark|light[&w=800]`: one screen, live.
- `./render.sh [ID…]` or `./render.sh ID SCREEN…`: renders the option shots to
  `shots/ID-SCREEN-dark.png` and `-light.png` with headless Chromium. Screens ending in `-800`
  are 800 px wide.
- `today/`: screenshots of the real pages (git-ignored: they show Ken's own data), taken from
  a test copy of Activity (`NYX_ACTIVITY_APP_ID`, scratch XDG folders, `--section ID`) on a
  headless output, as `today/ID-1280.png` and `-800.png`.
- The kit is `../revamp`'s (tokens, mock, kit, common, and `apps/activity.css` for the
  Activity window); don't change it from here. `pages/shell.js` and `shell.css` are the
  Activity window, its sidebar and the cards, graphs and lists every page uses; a tab's own
  parts go in `pages/ID.js` and `pages/ID.css`.

A tab's file calls `REG(ID, { name, summary, problems, today, options, pages })` as on the
revamp page. Functions only at load: the gallery loads every tab's file without the kit.
Sample data is made up; the shots are public. Readings shown are ones Activity's samplers can
actually take (`nyx-activity/apps/activity/src/sampler/`).
