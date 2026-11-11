# Nyx Lyra: mockups

Mockups for Nyx Lyra, a YouTube Music app for NyxOS (Rust, GTK4, Nyx Design 2.0), drawn
from the Neon Futura concept image (`reference.png`) before anything is built. Lyra is
separate from Nyx Music, which keeps local music, radio and podcasts. Nothing outside this
folder changed.

**Chosen (11 November 2026):** direction **A** (now-playing column) for the main window,
**art and tabs** (`players-expanded-a`) for the expanded player, and the **strip**
(`players-mini-strip`) for the mini-player. The screens are drawn in A already. The other
directions and players stay here for reference.

Open `index.html` for a gallery of every shot, or a page directly: `directions.html`,
`screens.html`, `players.html` and `integration.html` take `?screen=<name>&theme=dark|light`.
Each page has a switcher at the bottom (left out of shots).

`./render.sh` re-renders every shot into `shots/` with headless Chromium (nothing opens on
screen); `./render.sh players` renders one page. App windows are 1280 × 800 (the default
window size) with Home and Album also at 800 × 800 (tiled); desktop shots are 1920 × 1080.
The app pages use the polish mockups' 2.0 look (`../polish/tokens.css`, `mock.css`,
`mock.js`, `nyx-after.css`); `lyra.js` and `lyra.css` add Lyra's parts. The desktop
pages use the bar and dock mockups (`../bar/parts.js`, `bar.css`, `../dock/dock.js`,
`dock.css`). `lyra-icon.svg` is a draft app icon in the suite's style (a lyre in the
violet swatch).

The violet is Lyra's default accent (`lyra = "violet"` in the themes' `[accents]`), not a
fixed colour: Follow Omarchy and the Accent row restyle it like any Nyx app. Covers are the
mockups' gradients, not album art; the lyrics are placeholder lines. The sample state is
the bar and dock mockups': Midnight City by M83 playing, 1:42 of 4:03.

## Shots

Every shot comes in `-dark` and `-light`.

| Shot | Shows |
| --- | --- |
| `directions-a` | **A. Now-playing column** (suggested). The concept's layout in 2.0: sidebar, a 300 px column with the cover, the song and the album's tracks, then the artwork grid and a featured album card, and the player bar across the foot. The column doesn't repeat the transport; the bar has the only set of controls. Below 1100 px the column folds away. |
| `directions-b` | **B. Shelves.** No column: Home as rows (Quick picks, Listen again, Mixed for you), as YouTube Music lays it out. Queue and lyrics open as a 288 px drawer from the bar. Closest to Nyx Music. |
| `directions-c` | **C. Queue on the right.** The content, then a 320 px panel with the cover and Up next / Lyrics / Related tabs; a slim bar with a progress line instead of the seek row. |
| `directions-d` | **D. Immersive** (breaks 2.0: artwork-tinted backdrop, glows, frosted bar and card). A's layout over a blur of the playing cover. Could only ship as a look in settings. |
| `directions-ref` | The concept image beside A, with what changed: no Radio, Downloads or Offline (Radio is Music's; Lyra doesn't download), the accent instead of fixed purple, one transport. |
| `screens-explore` | New releases, Charts, Moods & genres as entries; new albums and singles, the week's top songs with movement, mood tiles. |
| `screens-search` | `daft punk`: filters (Songs, Videos, Albums, Artists, Community playlists), the top result with Shuffle and Radio, songs beside it, albums. |
| `screens-artist` | The artist's banner fading into the page, Shuffle, Radio, Subscribed, top songs and albums. |
| `screens-album` | The album with the playing track marked and the next one hovered (play, like, more). While its own album is open, the column shows Up next instead. |
| `screens-playlist` | Ken's private playlist: a collage cover, description, edit, artist and album columns, an explicit tag. |
| `screens-liked` | Liked Music, YouTube Music's auto playlist, newest first. |
| `screens-library` | Playlists, Albums, Songs, Artists; New playlist, Liked Music, your playlists, mixes, a shared and a collaborative one. |
| `screens-signin` | First run: why sign in, and Google's own sign-in page in Lyra's web view with its address shown. "Continue without signing in" leaves it. |
| `screens-blocked` | If Google refuses the embedded browser: what happened, that Lyra won't work around it, what works without an account, Try again. |
| `screens-offline` | YouTube Music can't be reached: a banner with Retry, cached pages and covers stay, the bar's controls are off with an Offline chip. |
| `screens-unsupported` | A feature YouTube Music doesn't offer other apps (the library's songs, as an example) says so and offers YouTube Music's own page inside Lyra; a toast for a command YouTube Music didn't confirm. |
| `screens-empty` | Liked Music with nothing liked yet. |
| `screens-settings` | The settings card: Playback (lyrics, resume, mini-player on top, song-change notifications, audio quality, output), Account, Background ("Keep playing when closed"), then the standard Appearance, Keyboard and About. |
| `screens-home-800`, `screens-album-800` | Tiled at 800 px: the icon rail, no column, the bar with a progress line on top instead of the seek row. |
| `players-expanded-a` | **Expanded: art and tabs.** The cover large on the left with the song, seek and controls; Up next / Lyrics / Related on the right; Autoplay. |
| `players-expanded-b` | **Expanded: lyrics beside the art.** Lyrics follow the song; the bar stays. |
| `players-expanded-c` | **Expanded: backdrop** (breaks 2.0). The cover blurred across the window, everything centred, the current lyric line under the controls. |
| `players-mini-strip` | **Mini: strip**, 380 × 96: cover, song, three controls, like, Open Lyra, a progress line. |
| `players-mini-square` | **Mini: square**, 300 × 300, shown hovered: only the cover until the pointer is over it. |
| `players-mini-card` | **Mini: card**, 284 × 440: cover, seek with times, five controls, like, lyrics, volume. |
| `players-states` | The bar playing, paused, waiting for YouTube Music to confirm a command, reconnecting, signed out, and with nothing playing. |
| `integration-glimpse` | Glimpse with `music`: Lyra and Music as two panel results, Lyra's panel (source named, controls, volume, playlists) in the 728 × 230 dropdown slot, and `lyra …` / `music …` commands from the action registry. |
| `integration-media` | The bar's media popover with Lyra and Music as player chips. |
| `integration-notification` | A song-change notification while Lyra is in the background (optional, off by default). |
| `integration-dock` | Lyra beside Music in the dock, its card (playing, playlists, mini-player, Quit) and the now-playing chip with its cover. |

## What it would take

Lyra would be a new repository, `nyx-lyra`, built like the other GTK apps on the pinned
shared crates. In GTK4 terms:

- **Window, header, sidebar, settings:** `nyx_ui::chrome`, `nyx_ui::sidebar` (nav items,
  group labels, the icon rail below 980 px), `nyx_ui::settings_card` with the app's
  Playback, Account and Background groups, `nyx_ui::toast`, `nyx_ui::menu`. Collapsible
  groups and cover thumbnails on playlist rows may need small additions to the sidebar.
- **Covers and grids:** `nyx_ui::media` (`Artwork`, `PosterCard`, `hover_play`) in a
  `GridView` for grids and a horizontal scroller with arrow buttons for shelves; covers come
  from a bounded on-disk cache.
- **Player bar, column, expanded and mini-players:** Lyra's own widgets. `nyx-playback`'s
  controls drive mpv for video, while Lyra's playback is the web runtime's, so the bar
  reflects confirmed state (the waiting and reconnecting states) rather than sharing them.
- **The column (A)** hides below 1100 px with the same width check the sidebar uses; **B's
  drawer** would be an inspector-style panel (`nyx_ui::inspector`).
- **D and expanded C** need a blurred copy of the cover as a background (a scaled texture
  through a blur, as GTK can't blur behind itself); both break 2.0 and would be a setting.
- **Sign-in, the web view and unsupported features** are WebKitGTK 6.0 pages in Lyra's
  window, so the Phase 1 prototype decides which of these screens are real.
- **Glimpse, bar, dock, notifications:** MPRIS for the bar, dock and media keys; a `lyra`
  Glimpse panel like `music`'s; `lyra.*` actions in the nyx-actions registry for `nyx lyra …`.
