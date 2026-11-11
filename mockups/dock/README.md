# Nyx Dock: redesign mockups

Mockups for the dock in the new bar's style (`../bar`, direction A) and features that would
improve it. Nothing in `nyx-dock/` changed.

Open `index.html` for a gallery of every shot, or a page directly: `directions.html`,
`features.html` and `ideas.html` take `?screen=<name>&theme=dark|light`. Each page has a
switcher at the bottom (left out of shots).

`./render.sh` re-renders every shot into `shots/` with headless Chromium (nothing opens on
screen); `./render.sh ideas` renders one page. The pages use the bar mockups' tokens,
styles, icons and bar (`../bar/tokens.css`, `bar.css`, `parts.js`); `dock.js` and
`dock.css` add the dock. Nyx apps show their real icons (`crates/nyx-icons/apps`); others
are drawn in the same satin style. The sample state is the bar mockups': Tuesday
10 November 2026 at 14:32, with Files focused (two windows), Ghostty with three, Mail with
four unread, Chat asking for attention, Store installing, Music playing.

## Shots

Every shot comes in `-dark` and `-light`.

| Shot | Shows |
| --- | --- |
| `directions-current` | Today's dock: a card with a hairline, 42 px icons, a dot per running app and an accent bar for the focused one, grey Apps and Trash squares. |
| `directions-a` | **A. Refined float** (suggested, within 2.0). The bar's popover surface, 48 px, 22 px radius and a soft shadow, 10 px above the edge. A mark per window (up to three), an accent bar for the focused app, a faint line between pins and running apps, a stronger one before folders. The Apps button in the accent; badges, progress, an urgent glow and a playing chip on the icons. |
| `directions-b` | **B. Grouped pills** (within 2.0). The bar's pill groups carried down: Apps, the apps, folders and Trash as three pills. |
| `directions-c` | **C. Edge strip** (within 2.0). Full width on the bottom edge, keeping its space like a taskbar: Apps and a search field (Glimpse) left, apps centred, folders and Trash right. |
| `directions-d` | **D. Magnify** (breaks 2.0: frosted, motion). Icons grow toward the pointer, up to 1.5×. Better as a setting on any look; Reduce motion turns it off. |
| `directions-e` | **E. Minimal** (breaks 2.0: no surface). Icons float over the wallpaper with a shadow. |
| `directions-v` | Direction A on the left edge: marks on the inner side, lines across. |
| `features-indicators` | Five running-app styles (marks, pills, underline, glow, none) and the states each keeps: badge, notification count, progress, playing, urgent. |
| `features-preview` | Window previews: larger live thumbnails, the workspace each window is on, minimized ones dimmed, close on hover, the current one ringed; arrows and Enter. |
| `features-card` | The app card for Music: what's playing with controls, recently played, New window, Play on…, Keep in Dock, Quit. Today's contents for Calendar, Files, the browser and other apps are listed. |
| `features-folder` | Downloads as a grid, with grid, list and fan in the header, Newest first, Open in Files. Folder looks: stack, the folder's own icon, a count. |
| `features-apps` | The Apps panel: search (Tab hands it to Glimpse), categories, Frequent, every app. |
| `features-menu` | The dock's right-click menu: size, position and hiding as quick choices, switches (previews, magnify, recent apps, Apps button, Trash), Add a folder, Dock settings; the new `dock.toml` keys. |
| `ideas-keys` | **Super + number**: holding Super numbers the first nine apps; Super+1…9 opens or cycles, Super+Shift+number opens a new window. |
| `ideas-recent` | **Recent apps**: the last three unpinned apps after a faint line; drag one left of it to keep it. |
| `ideas-media` | **Now playing**: whatever plays (through MPRIS) as its cover with a progress line before the folders; controls on hover. |
| `ideas-drives` | **Drives**: a USB drive or SD card beside the folders with an eject button; its card shows space used, Open, back up with Nyx Backup, Eject. |
| `ideas-downloads` | **Downloads in progress**: an arrow on Downloads while `.part` or `.crdownload` files grow; its card lists them with speed and time left, and what finished today. |
| `ideas-drop` | **Dropping files**: apps that can't open the file fade; the one under the pointer lights and says what happens (Open with Firefox, Attach to a new email, Copy to Projects, Move to Trash). |
| `ideas-minimized` | **Minimized windows** as thumbnails before the folders (an option, as macOS). |
| `ideas-hidden` | **Hidden**: a short line where the dock is while windows fill the screen; it fades while typing and isn't shown for fullscreen apps. |

## What it would take

The dock is QML (`nyx-dock/qml/Dock`) with a Rust backend (`nyx-dock-backend`).

- **Look A**: `DockBar.qml` (surface, radius, shadow, padding), `AppTile.qml` (marks per
  window, the focused bar, badge and progress placement), `SatinTile.qml` (the Apps button
  in the accent). Popovers (`CardPopup`, `PreviewPopup`, `FolderPopup`, `AppsPopup`,
  `DockMenu`) take the bar's popover style; the shared `Nyx.Ui` pieces already match it.
- **B, C, E**: variations of the bar surface (`look` setting). C also needs an exclusive
  zone so windows keep clear of it, and the search field runs `nyx-glimpse --toggle`.
- **Magnify**: per-tile scale from the pointer's distance in `DockBar.qml`, off when Reduce
  motion is on.
- **Indicators**: an `indicator` setting drawn in `AppTile.qml`.
- **Super + number**: Hyprland binds that call the backend (`nyx-dock --activate N`), and
  the numbers shown while Super is held (a `submap` or the backend watching the key).
- **Recent apps**: the backend already sees apps start; keep the last unpinned ones and
  send them with the items (`recent` setting).
- **Now playing**: an MPRIS watcher in the backend (Control Center's provider has one).
- **Drives**: udisks2 over D-Bus for removable drives, mount and eject.
- **Downloads in progress**: watching the folders already in the dock for `.part` and
  `.crdownload` files and their growth; totals where the browser writes them.
- **Drop feedback**: the desktop files' `MimeType=` against the dragged file's type, which
  the drop handler already reads.
- **Minimized windows**: the minimized list the previews already use, drawn as tiles.
- **Hidden line**: a small layer surface (or the hidden bar drawn 4 px tall) shown while
  hidden.
