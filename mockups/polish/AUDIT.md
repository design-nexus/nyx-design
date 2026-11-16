# Nyx UI polish: audit and proposals

October 2026. Read-only audit of every Nyx app against [STYLE.md](../../STYLE.md) (Nyx
Design 2.0), with proposals for a cleaner, more polished, macOS-like finish that keeps
2.0's principles: one surface, Inter, accent only for state, every colour a token.

The mockups in this folder show the proposals on six apps (Files, Mail, Settings,
Music, Calendar, Theater). Open [index.html](index.html) for the gallery; each app page
switches between **Before**, **After A (blended)** and **After B (tinted sidebar)**, and
between Nyx Dark and Nyx Light. "Before" is rebuilt from the current CSS values listed
below, so it is a close approximation, not a screenshot.

---

## 1. Summary

The shared 2.0 layer is in good shape: 35 of 38 app repos call
`nyx_theme::use_design_2()`, the unified header (`nyx_ui::chrome::app_header`), the
sidebar and the settings card are shared, and the density table applies everywhere.

What makes the suite look less finished than it is:

1. **Per-app CSS drifted from 2.0.** Most apps still carry v1 rules (700/800 weights,
   glows, 999 px pills, bordered panels) that their own "2.0" blocks never overrode.
2. **The spec leaves gaps that every app fills differently**: no content-width cap, no
   type scale beyond a dozen named elements, no row dividers in blended cards, no empty
   state recipe, no focus ring.
3. **Files is still v1** underneath a 2.0 coat of paint, and it is the app people open
   most.

Fixing the shared layer first (section 4) removes most of the inconsistency without
touching each app.

---

## 2. Cross-app findings

| Problem | Where | Effect |
| --- | --- | --- |
| Weights above 600 | ~15 apps. Files 46×, Music 11×, Media Player 12×, Photos 8×, plus shared `nyx-ui/src/media.css:36,67,127` and `nyx-playback/src/controls.css:135,212` | Titles shout; 2.0's "plain type" is lost |
| Type-scale sprawl | Chat 23 sizes, Files ~30, Notes ~30, Activity ~40 px sizes | No rhythm; sizes 9–10 px appear (Calendar hour labels, Chat headings, Pulse badges) |
| px font sizes | Activity, Store, Fonts, Maps, Weather, Torrents, Archive, Transfer, Photos | Suite *Text size* setting scales `em`, so px text doesn't follow it |
| Off-scale radii | 4, 5, 6, 8, 9, 10, 12, 14, 999 px in almost every app; `base2.css:181` itself uses 8 on the header search | Corners don't match from one control to the next |
| Pills where 2.0 says none | Media Player chips and icon buttons (`style.css:173,185,337`), Chat send/chips (`style.css:97,836`), Home robot actions, Pulse compact nav | Mixed shape language |
| No content-width cap | `nyx_ui::clamp::Clamp` exists but no page helper uses it. Settings and Archive cap at 920, Home's Connections at 760, everything else is unbounded | Option pages and readers stretch across a 1280 px window; line lengths reach 180+ characters |
| Card metrics vary | Padding 12/14 → 18/20; gaps 6 → 12 | Pages from different apps look like different products |
| Blended cards have no row lines | `@hairline` and `@divider` resolve to transparent when blended (`nyx-theme/src/lib.rs:212-213`) | Rows in a card float; long groups are hard to scan |
| Page titles repeating the header | Music "Albums" (`sections/albums.rs:35`), Media Player "All videos", News "Top Stories", Theater playlist header | Two titles for one place |
| Text buttons where icons belong | Pulse ~220, Git ~104, Containers inspector, Office zoom, Calculator graph tools | Toolbars read as forms |
| Bare empty states | Capture, Transfer, Maps, Pulse, PDF side panel, Office recents | Empty views look broken rather than empty |
| Search field has no focus ring | `base2.css:163-172` (brightens only) | Keyboard focus is hard to see |
| Status and confirmations in odd places | Theater writes to the sidebar foot (`window.rs:40-46`); Git and Glimpse keep status bars; Files keeps its footer | 2.0 says toasts |

---

## 3. Per-app findings

Most impactful first. Paths are relative to each app's repo.

### Files (v1 "Strata" under a 2.0 overlay)

- Own theme engine: `src/ui/theme.rs:33` starts with `* { all: unset; }` then loads a
  7,567-line `style.css` with its own `@strata_*` colours. No `use_design_2()`, no
  `app_header`, no `settings_card`. A "Nyx 2.0" block at `style.css:7262-7567` repaints
  it to look blended.
- Header is a `gtk::HeaderBar` with hand-built content (`ui/window/composition/layout.rs:50,159-174`);
  control groups sit in grey 8 px pills (`style.css:7346-7354`).
- Status bar remains: `.shortcut-footer` (`style.css:3380`) with bold, tracked, 999 px
  key pills (`3435-3445`).
- 39× weight 700, 2× 800: breadcrumb (`685`, `761`), column headers 700 in 58% accent
  with 3 px/1 px borders (`3743-3751`), preview title 1.85em/800 (`2963`).
- ~20 distinct radii (5 px ×38, 6 ×26, 4 ×23, 9 ×14, 8 ×13 …); only 6 rules use 7.
- Sidebar 201 px, min 169 (`ui/window.rs:82-83`) instead of 212.
- Folder colours hard-coded (`style.css:4370-4394`) instead of theme swatches.
- Mono for UI values (`413`, `5588`, `7557`); 0.12em uppercase eyebrows (`1409`, `2959`).
- Good: the 2.0 sidebar block (`7290-7404`), list rows (`7412`), preview header (`7475-7526`).

### Mail

- HTML bodies are a hard-coded white slab: `#fff` with `#1f2328` text, `15px/1.5 system-ui`
  (`apps/mail/src/reader.rs:625-627`). Every newsletter is a bright rectangle in a dark theme.
- Reader has no width limit: `.conversation` `20px 24px 36px` (`style.css:146-148`).
- 700 on unread sender/subject (`style.css:101-104`) and avatar initials (`177`, `314`).
- List column 340 px, not 360 (`window.rs:1579`); rows `7px 12px 8px` with sizes
  0.95 / 0.88 / 0.86em (`style.css:71-132`).
- Selection hard-codes `mix(@theme_bg, @theme_accent, 0.16)` instead of `@nav_active` (`68`, `83`).
- Compose window still has a status bar (`compose.rs:354`).
- Good: per-folder empty states (`window.rs:560-593`), hover row actions (`706-730`).

### Settings

- Content width 920 (`widgets.rs:97`); 2.0 says ~760 for option pages.
- Dashboard: 92 px ring gauge (`sections/home.rs:192`, spec 64), 2.1em badge count
  (`style.css:432`), hero padding 22/24 (`406`), tile padding 16 (`458`).
- Settings-dialog page padding `4px 40px 40px` (`style.css:568`) vs 16/20/28 in the window.
- Sidebar group labels: section colour over a 35% line, uppercase, tracked. With nine
  coloured sections the sidebar reads as a rainbow of headings.
- Radii 1 and 4 (`12`, `270`, `712`, `717`); custom `.search-empty` with 96 px padding.

### Music

- In-page title "Albums" 15 px/600 (`sections/albums.rs:35`, `style.css:885`) duplicates
  the header subtitle.
- `.detail-title` 1.9em/**800** (`526`), `.empty-title` 1.2em/800 (`554`), lyric lines
  700 (`812`), disc headers 700 with 1.6 px tracking (`720`).
- Album focus glow `@theme_glow` (`463`); covers radius 6 / 8 (`438`, `467`), player
  card 12 (`916`), now-playing 14 (`1003`).
- Grid gutters come from 10 px child padding (`452`), so ~20 px with no row rhythm;
  covers fixed 168 px (`views.rs:31`).
- Outlined panels with their own fill: `.eq-panel` (`291`), `.lyrics` (`796`).
- Volume popover mute is a text toggle (`playerbar.rs:71`).
- Good: player bar layout (`playerbar.rs:196-305`), the `Loader` stack (`views.rs:510-578`).

### Calendar

- Sidebar uses the 212 px nav; the spec gives trees (mini month + calendars) 236.
- Grid text too small: hour labels 0.76em ≈ 9.9 px without `tnum` (`days.rs:260`),
  "all day" 0.72em (`216`), day names 0.76em uppercase (`188`).
- No quick add in the header (spec's Time grid has one); only New event (`window.rs:887`).
- Radii 9 (today), 5 (all-day bars), 6, 10 (`days.rs:204,225`, `month.rs:167`, `style.css:78,138`).
- Light themes hard-code white `on_accent` in Cairo (`draw.rs:56`).
- Good: event tint and inner edge (`draw.rs:153-163`), 4% hour lines and now-line dot (`days.rs:251-310`).

### Theater

- Detail hero title 2.1em/700 (`style.css:17`); eyebrow with 1 px tracking (`131`);
  monogram 3em/700 (`44`); playlist header 1.35em/700 acting as a page title (`73`).
- Status and confirmations go to the sidebar foot (`window.rs:40-46`, e.g. "Marked
  watched" at `library.rs:1457`), not toasts.
- Shared `media.css`: poster radius 6 with a lift-and-glow hover (`4-6`, `120-124`),
  focus glow `0 0 14px @theme_glow` (`63`, `92`), badges 800 (`36`).
- Empty state has two actions (`library.rs:644-653`).
- Hero radius 14 (`124`), hero buttons 8 (`135`); page padding `0 18px 36px 8px` (`4`).

### Media Player

- Page titles "All videos", "TV shows" (`sections/videos.rs:39`, `shows.rs:52`).
- `.detail-title` 1.9em/800 (`328`), `.empty-title` 800 (`382`), up-next 800/700 (`246-255`),
  column headers 700 (`27`).
- `.chip` is a 999 px pill at 700 with a visible border (`337-345`); icon buttons 999 px (`173`, `185`).
- Metadata values in JetBrains Mono (`377`); asymmetric page padding `0 18px 28px 8px` (`690`).

### Photos

- Closest media app to 2.0 (justified grid, date groups, header selection pill, 288 px drawer).
- Editor never got a 2.0 pass: visible border (`style.css:690`), `@theme_surface` panel (`698`),
  bordered tool buttons (`737`), glowing swatch (`761`).
- 700 on gallery empty title (`53`), lightbox title (`663`), scrub bubble (`830`).
- Grid gap 8 (`grid.rs:17`); cell radius 4 (`1060`).

### Notes, Notepad

- Notes reading headings 700 at 1.7/1.4/1.2em (`notes-app/src/style.css:25-28`) while Live
  mode uses 1.8/1.12/1.0 (`notes-editor/src/lib.rs:189-192`); the two views don't match.
- Notes' reading column isn't centred: fixed 48 px left margin, `70ch` limits only the
  right edge (`lib.rs:276-285`). Duplicate rules at `style.css:18/40/116`.
- Notepad defaults to full width (`prefs.rs:54`) in JetBrains Mono (`editor.rs:219`)
  with 1.2 line spacing (`prefs.rs:50`); 900×700 default window (`window.rs:76`).

### Reminders, Contacts, Chat, News

- Reminders: 700 priority marks (`style.css:64-77`); unbounded list; 0.72em/0.1em
  detail heading (`107`); no loading state (`window.rs:355`).
- Contacts: no avatars in list rows (`ui.rs:651-690`); name 13 px beside a 48 px avatar;
  two heading styles (`group-title` vs `.contact-heading` 2 px tracking, `style.css:18`).
- Chat: 23 font sizes; 860 px message column (`sections/chat/mod.rs:223`); pills on send,
  chips and jump-to-bottom; headings at 9.4–9.9 px.
- News: unbounded serif reader without line-height (`reader.rs:112`, `style.css:171`);
  invisible text selection (`style.css:189-193`); "Top Stories" title row; unscoped
  `listview > row` rule (`103-120`). `paper.css` is the cleanest sheet in the suite.

### Dashboards and utilities

- Home: outlined device cards (`style.css:83`), `#1b1b1f` text (`234`), 2.2em readout,
  999 px pills, card padding 12/14 → 18/24.
- Activity: card titles as uppercase small caps (`charts.rs:485`), ~40 px sizes, 72 px ring,
  side padding 16 vs 20, card gaps 12 / 8 / 6.
- Pulse: ~220 text buttons, bare empty labels, 0.7em badges, circular compact nav items.
- Weather: no width cap (hero stretches), 2.2em temperature, 44 px daily rows.
- Calculator: 17 hard-coded Cairo colours (`views/graph_view.rs:405,578-602`) — the graph
  stays dark under Nyx Light; 700 ×4; radii 4–16; Title Case mode names.
- Store: swatch tints on every tile; 26 px feature title; 32/36 hero padding.
- Containers: text Stop/Restart/Start/Snapshot/Delete; 8 px page sides; small caps everywhere.
- Torrents, Transfer, Archive, Fonts, Git, Maps: px type, radii 2–5 / 8 / 14, asymmetric
  toolbar padding (0/16/0/20, 6/16/6/20, 0/12/0/14). Git keeps a status bar and has no
  empty states; Maps has a 320 px panel with its own 46 px header.

### Already polished (copy these)

Photos' header selection pill and `.photos-foot`; Music's `Loader`; Calendar's event
drawing; Passwords' list/detail empty states; PDF's tab pills; News' `paper.css`;
Glimpse and Capture (token-only sheets); Office's template cards.

---

## 4. Proposals

Everything below stays inside 2.0: one surface (with an optional tinted sidebar),
Inter, accent only for state, tokens for every colour. It changes metrics, type and a
few component details. Numbers are for **Balanced** density at text size 1.0.

### 4.1 Typography (macOS-like rhythm with Inter)

| Role | Size | Weight | Tracking | Font | Colour |
| --- | --- | --- | --- | --- | --- |
| Caption: counts, times, column headers | 11 px (0.846em) | 500 | 0 | Inter, `tnum` | `text_tertiary` |
| Secondary: descriptions, previews | 12 px (0.923em) | 400 | 0 | Inter | `dim_text` |
| Body, nav, rows | 13 px (1em) | 400 (500 selected) | 0 | Inter | `text` |
| Emphasis: card title, row title | 13 px | 600 | 0 | Inter | `text` |
| Heading: drawer, dialog | 15 px (1.154em) | 600 | -0.01em | Inter | `text` |
| Title: message subject, event | 17 px (1.308em) | 600 | -0.012em | Inter | `text` |
| Readout | 22 px (1.692em) | 600 | -0.02em | Inter Display, `tnum` | `text` |
| Document / hero title | 26 px (2em) | 600 | -0.022em | Inter Display | `text` |

- **Seven sizes, all in em**, so *Text size* scales everything. Nothing under 11 px.
- **Inter Display at 20 px and up** (already installed): tighter, SF-Display-like
  headings without changing families.
- Body copy line-height 1.45; single-line UI 1.25.
- **Weights 400 / 500 / 600 only.** 700 and 800 go everywhere, including the shared
  `media.css` and `controls.css`.
- Mono only for code, paths in previews and logs. Numeric readouts use Inter with `tnum`.

### 4.2 Labels

- **Sidebar group labels in sentence case** ("Favorites", "Library", "Hardware"),
  11 px / 600 / `text_tertiary`, no tracking, 16 px above, 4 px below, aligned with the
  nav labels' text. This is the biggest single step towards the macOS look.
- Section colours (Settings) move from the label onto the **nav icons** (see 4.5).
- Uppercase stays only for small in-page section labels where a column needs a quiet
  heading (Calendar's "ALL-DAY", a table's group header).

### 4.3 Spacing and width

- 4 px grid only: 4 / 8 / 12 / 16 / 20 / 24 / 32.
- Page padding **20 top, 24 sides, 32 bottom** (narrow: 16 / 16 / 24).
- **One shared, centred content cap** in `nyx-ui`'s page helper: **720 px** for option
  pages, **680 px** for reading columns (mail, notes, news, docs), unlimited for grids
  and tables.
- Cards: 14 px inside (rows 10/14), **20 px between groups**, 6 px from a group label
  to its card. Dashboard cards in flowing rows with 12 px gaps.

### 4.4 Rows and cards

- **Inset dividers** inside cards, `alpha(text, 0.06)`, starting at the text edge (after
  an icon tile) and running to the card edge, so long groups scan like System Settings.
  Drawn even when blended.
- Option rows 44 px (Balanced), title 13/400, description 12/400 `dim_text`. 2.0's 52 px
  rows with 500 titles feel heavy at this size.
- List rows 32 px with radius 7; selection `@nav_active`; no zebra, no lines.
- Column headers: 11 px / 500 / `text_tertiary`, sort arrow in the accent, no borders.

### 4.5 Sidebar

- 220 px (236 for trees), 8 px inside, nav items 32 px, radius 7, 16 px icons.
- **Selection: a rounded tint with the icon in the accent and the label at 500. No
  2 px edge bar.** The bar fights the rounded pill and reads as a v1 leftover.
- Optional **22 px icon tiles** (radius 6) in the section's colour with a white glyph,
  for apps whose sections carry colour (Settings, Home). Everywhere else, plain icons.
- Counts at the right in `text_tertiary` `tnum`; unread badges a 18 px accent-tint capsule.
- The foot holds account or storage (Files: a 3 px usage meter; Mail: the account).

Two variants are mocked up:

- **A, blended:** today's single surface; the header runs the full width.
- **B, tinted:** the sidebar is an inset panel, 8 px from the window edges, radius 12,
  filled `mix(bg, text, 0.035)` (dark) / `mix(bg, text, 0.045)` (light) with a 1 px
  `alpha(text, 0.05)` edge. The app's icon and name move to the top of the panel and the
  header starts beside it, as in macOS 26. Structure still comes from spacing; there are
  still no lines between areas. GTK can draw this with a margin, a radius and a fill on
  the sidebar box; no blur needed.

### 4.6 Header

- 46 px. App icon 18 px in the accent; **app name 13/600 in `text`** (accent only marks
  state), subtitle or path in `dim_text` after a `/`.
- Icon buttons 28 px, 16 px glyphs, radius 7, 2 px apart; related buttons grouped by an
  8 px gap, not by grey pills.
- Search: 28 px field, radius 7, 220 px at the right, `Ctrl F` hint in `text_tertiary`.
- Primary action: a 28 px solid accent square with an `on_accent` icon, at most one.
- Segmented controls: 28 px, radius 7, raised selected segment.

### 4.7 Elevation and focus

- Popovers and dialogs: `@theme_popover`, radius 15, `0 0 0 1px alpha(text, 0.08)`, then
  `0 2px 6px alpha(shadow, 0.25), 0 16px 40px alpha(shadow, 0.45)`.
- Settings card: the same elevation over a `@veil`; left column 240 px on the card
  colour, sentence-case group list with icon tiles.
- **Keyboard focus ring** on every control: `0 0 0 3px alpha(accent, 0.35)`, offset-free;
  the search field keeps it too.
- Toasts: bottom-centre, `@theme_popover`, radius 11, same shadow, 3.5 s.

### 4.8 Media

- Art radius 7 (posters and covers alike), `0 1px 2px alpha(shadow, 0.3), 0 6px 16px
  alpha(shadow, 0.25)`. No lift, no glow; hover dims the art 6% and shows a play button.
- Grids: 20 px column gap, 24 px row gap, title 13/500 and subtitle 12 `dim_text` under
  the art, flush-left with it.
- Detail heroes: backdrop fades into `bg`; title 26/600 Inter Display; one primary
  "Play" button plus icon buttons; overview at 13/1.5 capped at 620 px.
- Player bar: part of the surface (no card), 64 px, art 40 px; transport centred with a
  32 px round play button; 4 px tracks; times 11 px `tnum`.

### 4.9 States

- Empty, loading, error: centred; 40 px icon in `text_tertiary`; 15/600 line; 13 px
  `dim_text` line (max 360 px); at most one button. A shared `nyx_ui::widgets::empty_state`
  already exists; make it the only way.

### 4.10 Per-app highlights in the mockups

| App | What changes |
| --- | --- |
| Files | 2.0 header with crumbs and a view switch; no footer (storage meter in the sidebar foot); quiet column headers; tab pills; folder icons in the accent |
| Mail | 360 px list with 3-line rows, unread dot, 600 sender; 680 px reader; HTML bodies on the theme (or on a radius-11 paper card with an inset), not a white slab |
| Settings | 720 px cap; icon tiles in section colours; inset dividers; 44 px rows; the settings card in the new elevation |
| Music | No in-page title; 20/24 grid; radius-7 covers with shadow; flat player bar |
| Calendar | 236 px tree sidebar with mini month; quick add in the header; 11 px `tnum` hours; today as an accent circle; events radius 7 |
| Theater | No page title; filter chips; radius-7 posters; detail hero in Inter Display 600; toast instead of sidebar-foot status |

---

## 5. Suggested order of work

1. **Shared layer** (`nyx-design`): `base2.css` (type scale, radii, dividers, focus
   ring, header metrics, sidebar selection, optional tinted sidebar), `media.css` and
   `nyx-playback/controls.css` (weights, radii, no glow), a clamped page helper and a
   single `empty_state` in `nyx-ui`.
2. **STYLE.md revision** with the tables in section 4.
3. **Per app**, worst first: Files (move to `app_header`, `settings_card`, drop the
   footer and `* { all: unset }`), Music, Media Player, Theater, Mail, Calendar, then
   the rest. Each app reinstalled with `./install.sh <app>` as it changes.
