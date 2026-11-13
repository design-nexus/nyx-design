# Nyx apps revamp: mockups

One page with a tab per app (`index.html`): each tab shows the app today, what's wrong
with it, and two or three options. Mockups only; Ken picks what gets built.

- `index.html`, `gallery.js`, `gallery.css`: the page, its tabs (`ORDER`) and the
  full-window viewer (← → through every shot, carrying on into the next tab; D and L for
  dark and light; Esc closes).
- `screens.html?app=ID&screen=NAME&theme=dark|light[&w=800]`: one screen, live.
- `./render.sh [APP…]` or `./render.sh APP SCREEN…`: renders the option shots to
  `shots/ID-SCREEN-dark.png` and `-light.png` with headless Chromium (nothing opens on
  screen). Screens ending in `-800` are rendered 800 px wide, the tiled width.
- `today/`: screenshots of the real apps (git-ignored: they show Ken's own data).
- Shared parts: `tokens.css`, `mock.css`, `mock.js`, `nyx-after.css`, `kit.css` and
  `kit.js` (the Design 2.0 window, as in mockups/reminders), and `common.js` /
  `common.css` (rows, tiles, settings cards, tables, art, charts, menus, dialogs).
  Don't change these for one app; put app-only parts in `apps/ID.js` and `apps/ID.css`.

## An app's file

`apps/ID.js` is one IIFE that calls `REG(ID, { … })`, like `apps/mail.js`:

```js
(() => {
  // sample data and builders: functions only — nothing may call a kit helper at load,
  // because the gallery loads every app's file without the kit
  REG("mail", {
    name: "Mail", accent: "violet",            // accent: a swatch name, or leave it out
    summary: "One or two sentences on where the app stands.",
    problems: ["<b>Short label:</b> what's wrong, in plain words.", …],
    today: [["mail-1280", "Today at 1280 px", "note"], …],   // files in today/, or []
    todayNote: "Why there's no screenshot, when today is [].",
    options: [
      { id: "a", name: "Short name", idea: "What this option is, in a few sentences.",
        shots: [["a-inbox", "Title", "note"], ["a-inbox-800", "At 800 px", "note"]] },
      …
    ],
    pages: { "a-inbox": () => win({ hdr, side, page }), … },  // one per screen, no -800
  });
})();
```

Every option differs in layout or flow, not just colour. Each option has two or three
shots; each app has at least one shot at 800 px. Sample data is made up (no real names,
mail or files from Ken's machine: the shots are public). Window parts come from the kit:
`win`, `header`, `search`, `navx`, `grp` (coloured section headings: `"accent"` for the
first group, then swatches), `tiles`, `pbar2`, `setcard`, `lrow`, `tbl`, `art`, `av`,
`menu`, `dialog`, `toast`, `empty`, and `railed(win(…))` for an icon-rail sidebar at any
width.
