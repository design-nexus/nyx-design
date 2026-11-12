# Nyx App Style — 2.0

How Nyx apps look and behave. Most of it comes from the shared crates, so an app gets it
by using them rather than by copying another app:

| Crate | What it gives an app |
| --- | --- |
| `nyx-core` | Identity, XDG paths, preferences store, commands, atomic writes |
| `nyx-theme` | Theme files, Follow Omarchy, the suite settings, the shared stylesheet |
| `nyx-ui` | Window frame and header, sidebar, rows, cards, controls, dialogs, palette, keys |
| `nyx-icons` | App icons and symbolic header icons |

Apps move to 2.0 one at a time. Until an app has moved it follows
[docs/STYLE-v1.md](docs/STYLE-v1.md). An app moves by calling
`nyx_theme::use_design_2()` before `nyx_theme::install`: the 2.0 sheet
(`crates/nyx-theme/src/base2.css`) then loads on top of the shared one, the app's own
accent becomes `@theme_accent`, and sizes follow the 2.0 density table. Check that GTK
accepts the sheets with `cargo run -p nyx-theme --example check_css`. The mockups this guide comes from are the
*Nyx Design 2.0* canvas (Files, Notes, Settings, Photos, Mail, Calendar, Icons).

---

## 1. Principles

- **Compact, structured, breathable.** Dense enough to use a tiled half-screen window,
  with spacing doing the work lines used to do.
- **One frame, one sheet ("blended").** The header, the sidebar and any bar across the
  foot are one surface, the frame, with no lines or different fills between them. The
  page, the main body, is a sheet inset in the frame: one thin line around it, rounded
  corners (see Window and header). That is the only line between areas; inside the page,
  structure comes from spacing, alignment, the selection pill and cards.
- **Solid.** Opaque surfaces by default. Frosted is a theme option, not the default.
- **Neutral, with accent only for state.** Near-black (dark) or near-white (light) with
  no colour tint. The app's accent marks where you are and what is on: the selected nav
  item and row, focus, switches, the primary button, progress. Never whole surfaces.
- **Plain type.** Inter, regular weights. No glows, no mono-for-style, no wide tracking.
- **Icon buttons.** Actions are icon buttons with a tooltip naming the action and its key
  ("New folder (Ctrl+Shift+N)"). Text only where an icon can't say it: a dialog's
  confirm/cancel pair, a banner's single action, the second click of a dangerous action.
- **Works tiled at 800 px** with no horizontal scroll (see Responsive).
- **Everything from tokens.** No hard-coded colours in components; every colour is a
  theme token or a mix of them.

---

## 2. Themes

A theme is one TOML file. Every key is optional; what a file leaves out comes from the
theme it overrides or `inherits`, or is derived from its core colours.

- **Shipped themes** live in `crates/nyx-theme/themes/` and are built in.
  `nyx-dark.toml` sets every key and is the template. Default themes: **Nyx Dark** and
  **Nyx Light**.
- **User themes** go in `~/.config/nyx/themes/` (every app) or
  `~/.config/<app>/themes/` (one app). A file named like a shipped theme overrides it
  with only the keys it sets; any other name is a new theme, `custom:<file stem>`.
- **Live:** saving a theme file restyles every open Nyx app within a second.
- **Safe:** an unknown key rejects the file (with the error on stderr); a value that
  isn't a colour falls back with a warning. An app always starts.
- `nyx_theme::edit_copy(id)` writes a full copy of a theme to edit.

### What a theme sets

| Keys | Meaning | In CSS |
| --- | --- | --- |
| `name`, `light`, `inherits` | Display name, light or dark, theme to start from | |
| `bg` | Window and content: the page's sheet | `@theme_bg` |
| `panel` | The frame: header, sidebar, foot bar (equal to `bg` when blended) | `@theme_panel` |
| `card`, `raised` | Cards and grouped rows; raised controls (selected segment) | `@theme_card`, `@theme_raised` |
| `surface`, `popover` | Toasts; popovers, menus, dialogs | `@theme_surface`, `@theme_popover` |
| `text`, `dim_text`, `text_tertiary` | Primary, secondary, hint text | `@theme_text`, … |
| `border`, `divider` | Outlines where one is needed; lines inside a card | `@theme_border`, `@theme_divider` |
| `accent` | The theme accent, used when an app has none | `@theme_accent` |
| `danger`, `warning`, `success` | Status colours | `@theme_danger`, … |
| `muted`, `highlight`, `glow`, `shadow` | Neutral fills, spare selection tone, kept for v1, shadows | |
| `hover`, `selection` | Accent strength on hovered and selected rows, 0–1 | `--nyx-hover`, `--nyx-selection` |
| `[accents]` | Default accent per app: a swatch name or a colour (`files = "blue"`) | `@theme_app_accent` |
| `[sections.<app>]` | Accent per section of an app, a swatch name or a colour (`[sections.settings] privacy = "green"`) | `.section-<name>` |
| `[swatches]` | Named accent choices offered in each app's settings (see below) | |
| `[font]` | `ui`, `mono` (each a comma-separated list of names, preferred first: `"Inter, Inter Variable, Inter 18pt"`), `weight`, `heading_weight` | `font-family` on the window |
| `[shape]` | `radius_small`, `radius_card`, `radius_dialog` (px) | `--nyx-radius-*` |
| `[material]` | `surface` (`solid` / `frosted`), `see_through`, `blended` | |
| `[icons]` | `pack`: the icon theme it recommends; `file_colors`: file-type icons keep their brand colours (`brand`, the default) or take the theme's (`theme`) | |
| `[syntax]` | Code colours: `keyword`, `string`, `constant`, `type`, `preprocessor` (swatch names or colours; Follow Omarchy maps them from Omarchy's named colours) | |

Sizes, density, text size and motion are **not** theme keys: density and text size are
suite preferences, motion follows Reduce motion, and layout belongs to the apps.

### App accents

- Each app has an **Accent** row in its settings: the active theme's `[swatches]` plus
  *Theme default* (the theme's `[accents]` entry for the app, else `accent`).
- The choice is stored **by swatch name** in `~/.config/nyx/theme.toml`
  (`[app_accents] files = "violet"`), so it survives a theme switch: every theme defines
  the same names, tuned for its background (Nyx Light's are deeper).
- Swatch names: `blue`, `violet`, `pink`, `red`, `coral`, `amber`, `green`, `teal`,
  `graphite`.
- Sections (Settings) use `[sections.<app>]`; a section without one uses the app's accent.
- In code: `nyx_theme::app_accent(app)`, `section_accent(app, section)`, `swatches()`.

### Follow Omarchy

The default mode. Read `~/.local/state/omarchy/current/theme/colors.toml` (respect
`$XDG_STATE_HOME`) and map it onto the core colours; the other surfaces are derived.
App defaults come from Omarchy's named colours (Files `blue`, Mail `magenta`, Notes
`yellow`, Photos `orange`, Calendar `red`, Home `green`, …) and the swatches from its
palette. Omarchy's theme is polled once a second and restyles in place. If
`colors.toml` is missing or invalid, use the chosen Nyx theme.

### Suite settings

`~/.config/nyx/theme.toml` holds what every app shares: `mode` (`omarchy` / `theme`),
`theme`, `density`, `text_scale` (0.9–1.25), `start` (`home` / `last`) and
`[app_accents]`. Changing any of it in one app reaches every open app within a second.

---

## 3. Typography

- **Font:** the theme's `[font] ui` — Inter in Nyx Dark and Light, with `sans-serif`
  as fallback. Code and readouts that need alignment use `[font] mono` (JetBrains Mono).
  Numbers that line up use tabular figures (`font-feature-settings: "tnum"`).
- **Weights:** 400 regular, 500 for row titles and emphasis, 600 for titles. Nothing bolder.
- **Base size:** 13 px; everything else relative.

| Element | Size | Weight | Colour |
| --- | --- | --- | --- |
| App name in the header | 13.5 px | 600 | app accent |
| Header subtitle (section, folder) | 12.5 px | 400 | `dim_text` |
| Nav item, row title, body | 13 px | 400 / 500 | `text` |
| Row description, secondary | 12–12.5 px | 400 | `dim_text` |
| Group label (sidebar, page) | 11 px | 600 | `text_tertiary`, UPPERCASE, 0.06em |
| Card title | 13 px | 600 | `text` |
| Status bar, counts, times | 11.5 px | 400 | `dim_text` / `text_tertiary` |
| Document title (editor h1) | 26 px | 600 | `text` |
| Big readout (gauge) | 22 px | 600 | `text` |

No page titles: the header shows the app and where you are. Copy is sentence case,
American spelling; descriptions say what an option does for the user in one sentence.

---

## 4. Shape, density, motion

| Thing | Value |
| --- | --- |
| Radii | `radius_small` 7 (buttons, inputs, chips, nav items, rows) · `radius_card` 11 (cards, banners, toasts) · `radius_dialog` 15 (popovers, dialogs, preview windows). Only switches are pills. |
| Spacing | multiples of 2 and 4; content padding 14–16 px; gap between cards 12 px |
| Sidebar | 212 px (236 for trees: Notes, Calendar); 56 px icon-only when compact |
| Inspector / drawer | 268 px (Notes) · 288 px (Photos info) |
| Transitions | 120 ms ease-out for hover and colour; 200 ms for panels and width changes |
| Reduce motion | every duration 0; toolkit animations off |

Density is a suite preference; **Balanced** is the default.

| Size | Compact | Balanced | Relaxed |
| --- | --- | --- | --- |
| Header | 42 | 46 | 50 |
| Nav item | 30 | 34 | 38 |
| List row | 30 | 36 | 42 |
| Option row (settings) | 44 | 52 | 60 |
| Control (button, input, segmented) | 30 | 32 | 34 |
| Page padding (top) | 12 | 16 | 22 |

---

## 5. Window and header

```
┌──────────────────────────────────────────────────────────────────────────┐
│ ▣ Files  ‹ ›  ken › Projects › nyx-design      [⌕ Search  Ctrl F] ☰ ▦ ◉ ⋯ │ header 46
│ ⌂ Recent        ╭────────────────────────────────────────────────────────╮ │
│ ★ Starred       │ nyx-design ×  Downloads ×  +                           │ │
│ ▌Projects ◀──   │ Name ▾                    Size   Modified     Kind     │ │ the page:
│ DEVICES         │ ▌README.md                4.8 KB Today 13:40  Markdown │ │ a sheet
│ ▤ Samsung T7    │ …                                                      │ │
│                 ╰────────────────────────────────────────────────────────╯ │ 8 px
└──────────────────────────────────────────────────────────────────────────┘
```

- **The frame** (`nyx_ui::frame::AppFrame`): every main window is built on it. The
  header runs across the top, the sidebar down the left, an optional foot bar (a player
  bar) across the bottom under both; together they are one surface in `panel`. The page,
  the main body, is a **sheet** inset in it: `bg`, a 1 px line all round
  (`@sheet_line`: `text` at 9% in dark themes, 11% in light), `radius_card`, 8 px clear
  of the window's right and bottom edges and of the foot bar. With the sidebar hidden (a
  welcome page, an expanded player) the sheet is 8 px clear on the left too. Inside, the
  sheet keeps 8 px of room so nothing touches its line; content meant to reach its edges
  (a backdrop, a map) turns that off (`set_flush`) and is clipped to the corners.
- **Panes in the sheet** (a list and its detail, a page and its inspector, Files'
  columns) are split by a 1 px line in `@sheet_line` with 6 px of room on each side. A
  `gtk::Paned`'s handle draws it and still drags; panes side by side in a box put
  `nyx_ui::frame::pane_line` between them. A bar across the top of the panes (a page
  bar, tabs) has no line under it. The sheet's line
  is drawn whether or not the theme is blended; the frame's parts draw no lines of their
  own. Apps put their content in the page (`set_page`), their sidebar beside it
  (`set_sidebar`) and a foot bar under both (`set_foot`); the frame's look lives in
  `base2.css` (`.app-frame`, `.app-page`), so it changes there for every app.

- **One unified header** (46 px balanced) instead of a title bar plus toolbar:
  - **Left:** the symbolic app icon (20 px) and the app name in the app accent; an
    optional subtitle in `dim_text` (section, folder, account).
  - **Middle:** what the app navigates by: a path, the document title, a view switch
    (Day/Week/Month), the selection toolbar while items are selected, or search.
  - **Right:** contextual icon actions, then Settings last: the two-slider icon
    (`nyx_ui::chrome::settings_button`, `nyx-settings-symbolic`), tooltip
    "Settings (Ctrl+,)". The sidebar toggle sits here too when a subtitle would move it.
  - **Window controls** (minimize, maximize, close) only on **floating** windows, after
    a small gap; hidden when tiled.
  - The empty parts of the header drag the window; double-click maximizes.
- **No status bar.** Counts, sync state and shortcuts hints don't get a bar of their
  own; settings is in the header, and anything that needs showing goes where it
  belongs (an account at the sidebar's foot, live activity as a toast or in the header).
  The foot bar is for controls used everywhere in the app, like a player bar.
- **Tabs** (Files, Notes) sit in a 34 px row at the top of the page, inside the sheet;
  the active tab is a pill in the hover tone; `+` opens one.
- **Default size** 1280 × 800 floating; the layout must work at 800 px tiled.

---

## 6. Layouts

Pick the archetype that fits; don't force an app into another's layout.

| Archetype | Apps | Structure |
| --- | --- | --- |
| **Explorer** | Files, Mail, Contacts | Sidebar · list (or list column) · detail. Files opens previews in a **separate floating window** (Space, Esc closes, ↑/↓ follows the selection), not a side panel. Mail adds a 360 px message list and a reading pane. |
| **Workspace** | Notes, Write, Notepad | Tree or no sidebar · tabbed editor with a ~680 px reading column · optional inspector (Outline / Links / Info). Split editor on demand. |
| **Dashboard** | Settings, Home, Pulse | Sidebar of sections · cards in flowing rows (`flex: n 1 <min>px`), pages up to ~760 px wide for option lists. |
| **Media grid** | Photos, Music, Theater | Sidebar · justified grid with date groups and a timeline scrubber · info drawer. Selecting turns the header's middle into a selection toolbar. |
| **Time grid** | Calendar, Reminders | Sidebar with mini month and calendars · day columns with an all-day row, hour lines and a now line · event popover. Quick add in the header ("Lunch with Sam tomorrow at 1"). |

### Sidebar

- 212 px, part of the frame (`panel`, equal to `bg` when blended), with no line of its
  own: the page's sheet edge is beside it. Rows are nav items: icon (17 px), label,
  optional count in `text_tertiary` or a badge (accent tint) for unread.
- Group labels: small UPPERCASE, 14 px above, optional `+` at the right. In a sidebar
  with two or more groups, every group is a section and its label is coloured: the
  section's colour over a thin line of it (35%), and in the icon-only sidebar the divider
  where the label was is a short bar in that colour. `nyx_ui::sidebar::set_section(&label,
  name)` tags it; the theme's `[sections.<app>]` gives each name a swatch. Groups that come
  from accounts or sources (Mail's accounts, Calendar's) take
  `nyx_ui::sidebar::rotating_section(i)`: swatches in a fixed order (blue, violet, green,
  pink, coral, teal, red, amber). A sidebar with one group, and a group with no section
  (search results, an archive), stays `text_tertiary`.
- **Selected:** a pill in `mix(bg, app accent, selection)` with a 2 px accent bar at the
  left edge and the icon in the accent. Hover: the `--nyx-hover` tint.
- Collapses to 56 px icons below 980 px window width or with <kbd>Ctrl</kbd>+<kbd>B</kbd>
  (saved as `sidebar_collapsed`); labels, counts and group labels hide, tooltips stay.
  Tree sidebars (Notes, Calendar) hide entirely instead.
- Construction: the sidebar, its list and scroller are `hexpand(false)`; only the page
  column takes spare width.

### Responsive

At 800 px: the sidebar is icons (or hidden), inspectors and drawers float over the
content or hide, list columns drop the least useful column, Calendar shows five days.
Nothing is cut off and nothing scrolls sideways. Keep a page's minimum width under ~580 px.

---

## 7. Components

**Card:** `@theme_card` fill, `radius_card`, no outline when blended (a hairline in
`@theme_border` otherwise), 14 px inside. Header row: an accent icon (16 px), a 600 title,
an optional `dim_text` note or tag, actions at the right. Use cards for groups of related
controls or a summary, not around every item.

**Option row:** title (500) and one-line description (`dim_text`) on the left, the control
on the right, vertically centred; option-row height from density. Rows inside a card are
split by spacing when blended, by a `@theme_divider` line otherwise.

**List row:** list-row height, `radius_small`, hover tint, selected
`mix(bg, accent, selection)`. No zebra stripes, no row lines.

**Buttons:**
- Icon button: 32 px square, transparent, `dim_text` icon, hover tint and `text`.
- Toggled icon button: accent tint background, icon in the accent.
- Primary: a solid accent square with the icon in `on_accent`; at most one per view.
- Danger: hovers to `danger`; destructive actions need two clicks (arms for 4 s) or an
  Undo toast.

**Segmented control:** a `field` track (barely lighter than `bg`), 2 px inside; the
selected segment is `@theme_raised` with a soft shadow. Prefer it to a dropdown when the
options fit.

**Switch:** 36 × 20 pill; off `track`, on the accent with an `on_accent` knob.

**Search field:** `field` fill, `radius_small`, a search icon and the key hint (`Ctrl F`)
at the right; focus shows an accent outline.

**Chip / tag:** 24 px chip with `field` fill; accent chips for tags (`#design`).
Tags for row status ("Restart", "5 available") are 11 px, 600, accent or warning tint.

**Settings card:** settings open as a card over the window (`nyx_ui::settings_card`,
<kbd>Ctrl</kbd>+<kbd>,</kbd>): the groups listed on the left with an icon and a summary,
the chosen group on the right, a search across all of them. The app's own groups come
first, then three every app ends with, built by the card from the app's `Standard`:
- **Appearance** — Follow Omarchy, Theme, Accent, Reduce motion, Open on.
- **Keyboard** — every shortcut, with its keys.
- **About** — the app's icon (64 px), name (600), version, one line on what it does,
  licence, Project page and Report a problem buttons, and a Built with row.

An app never repeats these in its own groups; options that only its window has go in a
group named for what they're about (Editor, Playback), not "This window".

**Shared widgets:** use these rather than an app's own copy:
- `nyx_ui::tabs::TabRow` for tabs, under the header or inside it
- `nyx_ui::pathbar::PathBar` for breadcrumbs that turn into an entry on click or Ctrl+L
- `nyx_ui::sidebar` for `Sidebar`, `nav_item`, `group_label` and the icon rail below 980 px
- `nyx_ui::menu` for context and button menus with icons, key hints, check items and submenus
- `nyx_ui::toast` for `show`, `show_undo` and `show_action`

**Popover, dialog, preview window:** `@theme_popover`, `radius_dialog`, a soft shadow.
Dialogs keep their text confirm/cancel pair, safe choice first.

**Toast:** bottom-centre over the content, `@theme_surface`, `radius_card`; replaces any
toast showing; 3.5 s, 6 s with Undo. Confirm actions and report errors with toasts, not
alerts.

**Progress and meters:** 3–6 px tracks in `track` with an accent fill; activity in the
status bar gets a pulsing dot (still when Reduce motion is on).

**Gauges and graphs:** 64 px ring gauges and thin sparklines in the accent on `track`.

**Empty, loading and error states:** an icon, one line of what's going on and, if useful,
one action — centred in the content area.

---

## 8. Keys every app shares

| Key | Does |
| --- | --- |
| <kbd>Ctrl</kbd>+<kbd>K</kbd> | Command palette: every page, command and named button |
| <kbd>Ctrl</kbd>+<kbd>F</kbd> | Search |
| <kbd>Ctrl</kbd>+<kbd>,</kbd> | Settings |
| <kbd>Ctrl</kbd>+<kbd>B</kbd> | Collapse the sidebar |
| <kbd>F1</kbd> / <kbd>?</kbd> | Keyboard shortcuts |
| <kbd>Esc</kbd> | Clear, dismiss, close transient UI |
| <kbd>Space</kbd> | Preview where an app supports it |
| <kbd>F10</kbd> | The `⋯` menu |
| <kbd>Ctrl</kbd>+<kbd>W</kbd> / <kbd>Ctrl</kbd>+<kbd>Q</kbd> | Close the tab or document / quit |

Right-click opens a context menu wherever there are item actions. Check an app's
existing shortcuts before adding these; an established app key wins and the conflict is
noted in its shortcuts list.

---

## 9. Icons

- **App icons:** a 128 px canvas, a 112 px rounded square (radius 28) in a dark satin
  gradient (`#26262a` → `#121214`) with a faint accent glow at the top-left and an accent
  hairline at 0.3. One layered geometric glyph in the app's accent (a light-to-mid
  gradient over a 35% back layer). Must read at 24 px.
- **Following the theme:** that is the Nyx Dark look, and the shipped files use it.
  Installed icons follow the active theme (`nyx icons sync`): the tile comes from the
  theme's background (a light satin on light themes), and the glyph takes the swatch
  picked in the app's Accent row, else the theme's accent for the app, else the theme's
  version of the glyph's own swatch. Accents that are Nyx Dark swatches use the
  hand-tuned glyph pairs; others are derived (`make_icons.glyph_colors`).
- **Symbolic icons:** 24 px grid, 1.6 px round-capped strokes, `currentColor`; the header
  icon is the app's symbolic at 20 px in the app accent.
- Freedesktop icon-theme layout, falling back to the user's icon theme; third-party logos
  are never recoloured. The opt-in `nyx icons` launcher set may use curated
  geometric interpretations of recognized third-party marks, in the theme's nearest
  swatch; fallback logos retain their original colors on the theme's tile.
- **Umbra** (design-nexus/umbra-icons) is the suite's icon theme for everything that
  isn't an app: folders, file types, devices, status and the symbolic set, drawn in the
  theme's colours. Three looks: **Tile** (the default: the app-icon tile holding a
  folder or page outline with its mark), **Solid** (satin folder and page shapes, a
  coloured type badge) and **Line** (coloured outlines, thinner at large sizes). Code
  files carry their language's mark; cloud-drive folders their brand's, in its colours.
  Settings → Theme → Icons picks Umbra and its look.

---

## 10. Materials

- **Solid** (default): opaque surfaces.
- **Frosted** (`[material] surface = "frosted"`): the window is translucent and
  Hyprland's blur shows a darkened, desaturated desktop behind it. `see_through = false`
  keeps the frosted texture without showing the desktop. Without compositor blur it is
  solid. GTK can't blur its own content, so there is no per-panel glass.
- **Blended** (`blended = true`, the default): the frame and the sheet share one fill,
  as described in Principles. Unblended themes give the frame `panel` and keep the
  sheet's line; lines inside cards and between rows come back as before.

---

## 11. Bar

Nyx Bar (NyxOS's top bar) and its popovers follow the rest of this guide; these are the
bar's own rules. The mockups are in `mockups/bar/` (direction A, "refined strip").

**Strip:** a solid `@theme_panel` surface the full width of the screen, no outline,
no floating island. Heights are presets: compact 28 px, default 32, cozy 36, spacious 40;
text and icons grow a step with each.

**Pills:** related items share one pill, `alpha(text, 0.055)` with radius 8: launcher
and workspaces, media, weather and stats, the four status icons, the bell. An item on
its own has no fill until hovered. A pill lights in the accent tint while one of its
items is open (its popover, or the Control Center page it opened). A thin
`@theme_divider` line can separate items instead of a pill.

**Items:** icons 16 px, text 12.5 px; the time 600 and the date `dim_text`; secondary
text `dim_text`, never smaller than 11 px. Counts are `tnum`. State shows as colour on
the item: amber for a warning (a high CPU, an alert), `danger` for recording, the
accent for on. A chip (18 px, radius 9) carries one short fact: the next event, an
alert. Titles that can be long (the window, the song) give way with "…" on a narrow
screen; the clock stays centred where the sides allow.

**Popovers:** `@theme_popover`, radius 15, a hairline and a soft shadow, 14 px inside,
up to 800 × 900 for first-party ones. Inside, cards (`@theme_card`, radius 11) group
what belongs together; group labels are 11 px caps in `text_tertiary`; selected rows
are accent-tinted with a tick. A popover ends in one link-style action to the full app
(Open Weather, Open Activity) rather than a row of buttons.

**Control Center:** the status pill opens it, each icon on its own page (right-click:
the dashboard); the bar has no separate Control Center button by default. Its tiles and
pages use the same cards, round icon chips (the tile's swatch when on), chevrons for a
tile's page, and two-column fact cards.
