# Inset sheet: mockups

Direction C from the Git divider mockups (`../git`, `&div=c`), tried on apps with different
layouts before it goes into the design spec. Nyx Design 2.0 draws the header, sidebar and
page on one surface with no lines between them. Here the header, the sidebar and any bar
across the foot (Lyra's player bar) stay one surface, the frame, and the main body is a sheet
inside it: a 1 px line on all four sides (`text` at 9% in dark, 11% in light), radius 12,
8 px clear of the window's right and bottom edges. With no sidebar, or with it hidden at
800 px, the sheet is 8 px clear on the left too. The fills don't change.

Open `index.html` for the gallery: every app today (blended) and as the sheet, dark and
light, with the full-window viewer (← → step through every shot, D and L switch theme, Esc
closes). `./render.sh` renders every shot into `shots/` with headless Chromium (nothing
opens on screen); `./render.sh files mail` renders only those.

The pages are the existing mockups, not copies: `../polish` (Files, Mail, Settings,
Calendar, Theater), `../lyra` (Lyra) and `../git` (Git). `?v=sheet` on a polish or Lyra
page makes `../polish/mock.js` load `sheet.css`, the only styling added here; the Git pages
draw the same sheet with `&div=c`. Each live page's switcher has "After C · inset sheet".

| Shot | Layout |
| --- | --- |
| `files` | Explorer: tabs and a column list |
| `mail` | A message list and the reader |
| `settings`, `settings-card` | Option cards in a 720 px column; the settings card over the window |
| `calendar` | A tree sidebar with the mini month; the week grid |
| `lyra`, `lyra-album` | The now-playing column and a grid, the player bar in the frame; an album |
| `theater`, `theater-library` | A full-bleed backdrop clipped by the sheet's corners; a poster grid |
| `git`, `git-flow` | Panels (files, diff, inspector); the Flow canvas |
| `files-800`, `mail-800`, `calendar-800`, `lyra-800`, `git-800` | Tiled at 800 px: icon rails, hidden sidebars |

Every shot comes as `<shot>-today-<theme>` and `<shot>-sheet-<theme>`.
