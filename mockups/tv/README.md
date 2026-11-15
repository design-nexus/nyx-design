# Nyx TV: mockups

Mockups for Nyx TV, a Plex-first replacement launcher for Android TV and Google TV, and Nyx TV
Manager, the desktop app that installs and manages it. Nothing is built yet; Ken picks a direction
for each before any app code is written.

**Chosen:** launcher direction **A · Cinema** and Manager direction **A** (TVs in the sidebar).
**Player chrome:** **A · Gradient** (Theater ship parity).

Open `index.html` for the gallery. Each launcher row is one screen in every direction, so the viewer
(click a shot, then ← →) steps A, B, C and on to the next screen; D and L switch dark and light,
Esc closes. **Player** rows are four chrome options (Gradient, Lean back, Status chips, Center) —
no remote-key hints; Skip Intro / Credits sit above the scrubber.

## Directions

- **Launcher A · Cinema:** the focused title's backdrop fills the screen; rows on its lower
  gradient; text tabs at top left.
- **Launcher B · Shelf:** hero, then the favorite apps directly under it, then media rows; a
  centred pill for navigation.
- **Launcher C · Gallery:** solid base, an inset hero card, denser poster rows; backdrops only on
  details screens. The least drawing per frame on TV hardware.
- **Manager A:** every TV in the sidebar, a page per section (Overview, Install and update,
  Launcher, Backups, Diagnostics, Debloat).
- **Manager B:** one TV at a time on a dashboard; every change is a guided flow with steps.

The launcher is 1920 × 1080, the size Google TV draws its UI at, in Catppuccin Mocha (dark) and
Latte (light) with the mauve accent. The Manager uses the Design 2.0 window from
`../revamp/` (tokens, kit and common parts, linked rather than copied) at 1280 × 800, with
Overview, Launcher and Debloat also at 800 × 800.

## Files

- `screens.html?direction=a|b|c&screen=NAME&theme=dark|light`: one launcher screen, live
  (`tv.js`, `tv.css`).
- `manager.html?direction=a|b&screen=NAME&theme=dark|light[&w=800]`: one Manager screen
  (`manager.js`, `manager.css`).
- `extract.py`: builds `data.js` and `art/` from Nyx Theater's Plex cache
  (`~/.cache/nyx-theater/library.sqlite3`, opened read-only).
- `./render.sh [PATTERN…]`: renders every shot (or those whose name contains a pattern, such as
  `tv-a-home` or `manager-b`) to `shots/` with headless Chromium, six at a time, as JPEG. Nothing
  opens on screen. Runs `extract.py` first if `data.js` is missing.

`art/`, `data.js` and `shots/` are git-ignored: they hold Ken's own library and its artwork.

## What's real and what's a sample

The movies, shows, episodes, artwork, ratings, cast and watch progress come from Ken's library.
The library has one Plex collection, so the Collections screens group titles into franchises.
Everything else is a sample: the server names and addresses, Plex profiles, the sign-in code,
the TVs and their firmware, the HDMI inputs, the debloat package names and classes, and every
memory, CPU and start-time figure. The debloat catalog and the launcher-replacement steps come
from the Phase 0 audit of the real TVs, not from these screens.
