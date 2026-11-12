# Nyx Browser: mockups

Mockups for Browser's chrome on the Zen source fork (`design-nexus/nyx-browser`, branch `fork`),
in Nyx Design 2.0. They start from the layout the earlier chrome layer had (sidebar button, top bar
order, star and QR, workspace row, Folders, foot) and add what the fork brings: horizontal tabs as
a full layout, the four sidebar modes, More tools for a narrow window, the new tab page and
Browser's own settings panes. Nothing outside this folder changed.

Open `index.html` for the gallery, or `browser.html?screen=<name>&theme=mocha|dark|light` for one
screen. `./render.sh` re-renders every shot into `shots/` with headless Chromium (nothing opens on
screen); `./render.sh newtab settings` renders only those. Windows are 1440 × 900, and the narrow
one 800 × 800 (tiled). Colors are `tokens.css` (Nyx Dark and Light, copied from the polish mockups) and Catppuccin Mocha
in `browser.css`, NyxOS's default.

## What the shots settle

- **One frame:** the top bar, sidebar and foot are one surface; the page is an inset sheet with a
  1 px line, the card radius and 8 px clearance (STYLE.md §1).
- **Top bar:** back, forward, reload, the address field (site identity, QR, star), then the action
  area (Share, Capture, Assistant, Passwords, Extensions, Downloads), Settings and the menu. A
  narrow window moves the last actions into More tools instead of squeezing the address field.
- **Sidebar:** the workspace row (name, menu, tab search), Essentials, pinned tabs, Folders, the
  day's tabs with split groups as one row, New tab, and the foot's workspace icons and F1.
  Compact is the 56 px icon rail; hidden reveals at the window's edge.
- **Horizontal tabs:** the workspace chip, pinned tabs, folders and split groups lie in one row
  under the top bar, and a drag's marker stands between tabs.
- **Bookmarks bar:** under the top bar (with horizontal tabs, under the tab row), on the same
  frame surface: bookmarks and folders, separators, Other bookmarks at the end, and » for what
  doesn't fit. Firefox's choice stays: shown on new tabs only (the default), always, or never.
  **Icons only** (Settings › Toolbar) shows bookmarks as just their icon, with the name on hover;
  folders always keep their names.
- **Security:** a page that isn't secure says so in words in the address field.
- **Frosted menus:** an option; solid is the default.

| Shot | Shows |
| --- | --- |
| `vertical` | Vertical tabs, sidebar expanded |
| `compact` | The icon rail |
| `hidden` | No sidebar; its button in the top bar; the reveal edge |
| `horizontal` | Tabs in a row |
| `horizontal-drag` | Dragging a tab in the row |
| `overflow` | 800 px: Automatic chose the rail; More tools open |
| `vertical-bookmarks` | The bookmarks bar with vertical tabs |
| `horizontal-bookmarks` | The bookmarks bar under the tab row |
| `bookmarks-folder` | A bookmarks folder open |
| `compact-bookmarks` | A narrow window: » holds the rest |
| `bookmarks-icons` | The bookmarks bar with Icons only on |
| `settings-toolbar` | Settings, Toolbar: when the bar shows, and Icons only |
| `newtab-bookmarks` | The bookmarks bar on the new tab page |
| `workspaces` | The workspace menu |
| `split` | Split view, the focused page outlined |
| `frosted` | The workspace menu, frosted |
| `insecure` | A page without HTTPS |
| `newtab` | The new tab page |
| `appearance` | The Appearance panel |
| `settings` | Settings, Tabs & Sidebar |
