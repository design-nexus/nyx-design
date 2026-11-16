# Nyx Browser redesign: mockups

A full UX and UI redesign of Browser (the Zen fork, `design-nexus/nyx-browser`). Round 1 drew three
whole-browser directions; Ken kept all three as Browser's **layouts**, chosen at first run and in
Settings › Layout & tabs. Round 2 drew every surface in each layout. Round 3 (this folder) makes them
one design: the layouts differ only in the window's frame. Mockups only: nothing outside this folder
changed. Earlier approved designs are in `../browser/` and `../browser-features/`.

- **Studio:** a header with a centred address and one Site button, the bookmarks bar under it, the
  tab sidebar, the page as an inset sheet.
- **Focus:** sidebar only, with a bookmarks shelf above the tabs; the page runs the full height. Ctrl+L
  opens a command bar in the middle of the window.
- **Workbench:** a tab bar across the top, the address bar under it, the bookmarks bar, and a Library
  rail on the left for workspaces, bookmarks, history and the reading list.

What's shared:

- Every menu, card, panel and prompt is Focus's (frosted). Right-click menus have a row of icon
  buttons on top. The workspace switcher is Focus's, with New, Edit and Move this tab.
- Address suggestions are Focus's command bar; Studio and Workbench open it from their address field.
- Settings, Library, Extensions and the new tab page are Studio's pages.
- Icons are Umbra's symbolic set (`umbra-icons`), with Browser's own where Umbra has none.

## Files

- `index.html`, `gallery.js`, `gallery.css`: the page: an Overview, then a tab per surface grouped
  by section, each with today's shot (where there is one), what's wrong with it, and the surface:
  in each layout for the window screens and the address bar, once for the rest. The full-window viewer
  is `../settings-pages`' (← → through every shot, carrying on into the next tab; D and L for dark and
  light; Esc closes).
- `plan.js`: the layouts, the sections and tabs (with window sizes), which are drawn per layout
  (`PER_LAYOUT`), today's shots, what's wrong.
- `screens.html?dir=a|b|c&screen=NAME&theme=dark|light[&w=800]`: one screen, live. Shared screens
  are drawn in Focus whatever `dir` says.
- `./render.sh [a b c] [SCREEN…]`: renders `shots/LAYOUT-SCREEN-THEME.png` with headless Chromium
  (nothing opens on screen): Focus has every screen, Studio and Workbench the per-layout ones.
  `narrow` is 800 × 800, the rest 1280 × 800.
- `content.js`: what every surface holds: bookmarks, pages (login, video, maps, router, reader,
  error), each panel's contents, context menus, Settings panes, Library data.
- `screens.js`: the shared screens, and the shared workspace switcher and suggestions.
  `pages.js`, `pages.css`: Browser's own pages.
- `dirs/b.*`: Focus's frame and the shared menus, cards and panels (loaded for every layout).
  `dirs/a.*`, `dirs/c.*`: Studio's and Workbench's frames.
- `kit.js`, `kit.css`: sample sites, the article page, popover placement, controls.
- `icons.py`: writes `icons.js` from `../../../umbra-icons` (the glyphs, by the names the mockups
  use) and `nyx-browser/src/nyx/icons` (the rest). Run `python3 icons.py` after changing either.
- `capture-today.py`: today's Browser through `nyx-browser/nyx/tools/marionette.py`: Firefox
  headless (`MOZ_HEADLESS`), a scratch profile and home, made-up local pages, so no window opens and
  no real profile is read. Popups are copied into the window before each shot. Output goes to
  `today/` (git-ignored). Run `python3 capture-today.py` (needs the build in
  `nyx-browser/engine/obj-*/dist/bin`).

Sample data is made up; the shots are public.
