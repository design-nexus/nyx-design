# Nyx Bar: redesign mockups

Mockups for a new Nyx Bar look and a Control Center in the same style. Nothing in
`nyx-bar/` or `nyx-control-center/` changed.

## Decided

- **Direction A, the refined strip**, at today's 32 px. A `size` setting picks compact
  (28 px), default (32), cozy (36) or spacious (40).
- **No quick settings and no Control Center button.** The status pill opens Control
  Center, on the page of the icon clicked: Wi-Fi, Bluetooth, Sound or Battery. Right-click
  opens the dashboard.
- **Control Center is redesigned** in the bar's popover style, as a floating panel under
  the status pill. Sound is a new page; Battery replaces today's basic page.
- The wide calendar, with the compact one as a setting, and the proposed new plugins.

The other five directions stay here for reference.

Open `index.html` for a gallery of every shot, or a page directly:
`directions.html`, `widgets.html`, `layouts.html` and `control-center.html` take
`?screen=<name>&theme=dark|light`.
Each page has a switcher at the bottom (left out of shots).

`./render.sh` re-renders every shot into `shots/` with headless Chromium (nothing opens on
screen); `./render.sh widgets` renders one page. Colours come from `tokens.css` (Nyx Dark
and Nyx Light, copied from `../desktop`). The wallpaper isn't committed: `render.sh` copies
the desktop mockups' copy or takes the current Omarchy theme's. Everything is drawn from
`parts.js` (icons, sample data, items, popovers, the bar directions and Control Center)
and `bar.css`.

The sample state is Tuesday 10 November 2026 at 14:32: workspace 2 active, 5 urgent, music
playing, a design review at 15:00 and three reminders left today.

## Shots

Every shot comes in `-dark` and `-light`; each direction also has a `-1280` shot.

| Shot | Shows |
| --- | --- |
| `directions-current` | Today's bar: 32 px, every item plain text or an icon at the same weight, the clock opening `cal` in a monospaced label. |
| `directions-a` | **A. Refined strip** (within 2.0, chosen). 32 px solid strip. Related items share a faint pill: launcher and workspaces; media; weather and stats; the four status icons, which open Control Center; notifications. The active workspace is an accent pill holding its windows' icons, others show a pip per window. The clock carries the next event ("Design review · 28 min"). Wide calendar open. |
| `directions-b` | **B. Menu bar** (within 2.0, after macOS). 30 px. The Nyx mark, the focused app in bold and its window title on the left, then workspace dots. Status icons together on the right; the date and time end the bar and open the calendar. |
| `directions-c` | **C. Islands** (breaks 2.0: floating, detached). Three rounded pills 8 px under the screen edge: busy workspaces as app icons, the clock with what's playing, and every status item with stats as rings. |
| `directions-d`, `-d-media`, `-d-notify` | **D. Dynamic island** (breaks 2.0: a black capsule that changes shape). At rest the centre capsule shows the time and a live activity. It grows into a player (`d-media`) and drops incoming notifications out of itself with their actions (`d-notify`). |
| `directions-e` | **E. Frosted float** (breaks 2.0: translucent, detached). Full width, 8 px in from the edges, rounded, with the Frosted material. Thin dividers group items; the active workspace is a glowing accent pill; the calendar is frosted too. |
| `directions-f` | **F. Omarchy polished** (within 2.0). Omarchy's compact 28 px layout (workspaces left, "Tuesday 14:32" in the middle, icons right), tidied: accent underline on the active workspace, dividers between hardware, connections and power, an updates count, hover states. |
| `widgets-calendar` | The wide calendar (about 800 × 580): month with a dot per calendar and red holidays, today's agenda with a now line, Join on the video call coming up and Open on hover, upcoming days, reminders due today with checkboxes (one overdue, one done). Six looks for the clock item. |
| `widgets-calendar-stacked` | The compact calendar (460 × 620), which also fits a third-party plugin's 480 × 640 limit: Thursday selected while today stays filled, Thursday's agenda, today's reminders. The clock's proposed settings. |
| `widgets-workspaces` | The hover preview (windows of workspace 1 with a layout thumbnail). Six workspace looks, each showing busy, empty, active and urgent. |
| `widgets-status` | Which Control Center page each icon in the status pill opens, and every icon state for network, Bluetooth, sound and battery. |
| `widgets-media` | Player switcher, art, love, seek, controls, volume, play-on device and the queue. Six inline looks. |
| `widgets-weather` | Now with feels-like and range, a storm watch, wind, humidity, UV and sunset, the next eight hours with chance of rain, five days on one temperature scale. Five inline looks. |
| `widgets-stats` | CPU graph with each core, memory, GPU, disk and network, top processes. Five inline looks, including amber under load. |
| `widgets-tray` | Three pinned icons and a drawer with the rest; Discord's own menu. Four tray looks. |
| `widgets-panels` | The bell's right-click menu (Do not disturb for a time, clear, settings). Bell states, and today's bell with a Control Center button for comparison. |
| `widgets-new` | Proposed new items: privacy dots (microphone, camera, screen sharing) with a popover to mute or stop, a recording timer, a keyboard layout switcher, the window title and keep awake. |
| `layouts-right` | Four status arrangements in direction A: one pill (default), separate icons (today), icons with values, battery only. Each repeated at 1.6×. |
| `layouts-left` | Four left sides: logo, workspaces and window title (default); workspaces only (today); workspaces as app icons; window title first with workspaces in the middle. |
| `layouts-presets` | The default `bar.toml` for each direction, with each bar in two halves, and what's new in the file. |
| `layouts-heights` | Direction A at the four sizes: compact 28, default 32, cozy 36, spacious 40 px. Compact drops the window dots under workspace numbers. |
| `control-center-dashboard` | Control Center as a floating panel under the status pill, with today's tiles: Wi-Fi, Bluetooth, VPN and Tailscale (each with a chevron to its own page), Do not disturb, tiling, night light, keep awake, Sound & brightness (its chips open Sound and Screens), Now playing, Power mode, Battery, Devices, Microphone, key light, capture. Today's 4-column grid, tile sizes and pages. |
| `control-center-edit` | Edit mode: dashed tiles with − to remove and a corner to resize, one being dragged, + for a new page, and the tiles that can be added (Home, Up next, Backup, plugin tiles). |
| `control-center-wifi` | The switch; the current network with Disconnect and Metered connection; address, router, router and internet ping, down, up, signal; known and other networks, with the password asked for in place. Foot: look again, speed test, share as QR code, Wi-Fi settings. |
| `control-center-wifi-more` | Scrolled down: the sign-in prompt, DNS as a row of icons (Cloudflare, Google, network, custom; the chosen one lit) and band (automatic or one band). |
| `control-center-bluetooth` | The switch, paired devices with state and battery, forget, devices nearby to pair, look again, Bluetooth settings. |
| `control-center-devices` | Flux phones: one asking to pair, paired devices with battery and charging, send the clipboard, ring. |
| `control-center-vpn` | Routes (Direct, NordVPN, Tor); NordVPN's location, favourites with the default marked, Kill Switch, Auto-connect, Threat Protection Lite, Pause, Technology, Protocol; Tor's modes and bridges; NetworkManager VPN connections; set up a VPN. |
| `control-center-vpn-location` | The location search with countries opening to cities and every city matching, stars for favourites, and the warning when NordVPN and Tor are both on. |
| `control-center-vpn-tor` | Tor carrying traffic: mode, exit with new circuit and auto, exit country list, latency, Tor browser, bridges, panic. |
| `control-center-tailscale` | Find a machine, this machine with copy address and name, receive files with Open Downloads, exit nodes (none, your own, Mullvad by country and city), machines with copy and send files, accounts. |
| `control-center-display` | Brightness per screen, scale of the focused screen, text size with reset, the laptop screen switch. |
| `control-center-sound` | New page holding today's volume popover: output devices, per-app volume, microphone with mute, input devices, who's recording; plus an output volume slider. |
| `control-center-battery` | Today's page (level, time left, using, capacity, cycles, charge limit, the three power modes) plus the last 24 hours and apps using a lot of power. |

## What each direction would take

All of them keep the plugin model: the bar is a host and every item is a plugin.

- **Current**: nothing.
- **A. Refined strip** (chosen): new `apps/bar/src/style.css` and a `size` setting (28,
  32, 36, 40 px; `height` still overrides). Pill groups need a layout entry for them (a
  nested array in `bar.toml`, read in `config.rs`, drawn as a box around those items in
  `bar.rs`). The workspaces plugin gets a `look` setting and app icons from the window
  state it already receives. `nyx.system`'s items run `nyx-control-center --toggle wifi`,
  `bluetooth`, `sound` or `battery` and stay highlighted while the panel is open;
  `nyx.panels` keeps only the bell. New plugins: `nyx.launcher` (the mark) and `nyx.window`
  (Hyprland's `activewindow` events). The next-event chip needs the clock plugin to read
  Nyx Calendar.
- **B. Menu bar**: the cheapest. CSS, a clock format, the `dots` look and `nyx.window`.
- **C. Islands**: a transparent bar window, a surface per section with a top margin, and
  an input region limited to the islands so clicks in the gaps reach the windows
  underneath. Exclusive zone of 52 px.
- **D. Dynamic island**: the most work. The capsule has to grow past the bar's height, so
  it needs its own layer-shell surface on the overlay layer that animates its size (or a
  plugin window from `popup_at`). A new `nyx.island` plugin coordinates media, timers and
  recordings, and Notification Center would hand its toasts to it instead of showing them
  in the corner.
- **E. Frosted float**: layer-shell margins and rounded corners, a translucent window and
  Hyprland blur on the `nyx-bar` layer and its popups (`layerrule = blur`, `blurpopups`).
  Uses the Frosted material that 2.0 already allows as an option.
- **F. Omarchy polished**: CSS, the `underline` look, dividers (`"|"` in `bar.toml`) and a
  new `nyx.updates` plugin.

## What the widgets would take

- **Wide calendar**: 800 × 580 fits the 800 × 900 popover limit `nyx-plugin-host` already
  gives first-party plugins (only third-party plugins are held to 480 × 640). The clock
  becomes a Rust stream plugin reading events and reminders through `nyx-pim`, writing back
  when a reminder is ticked, and finding meeting links for Join. The compact layout also
  fits a third-party plugin's limit.
- **Weather** needs Nyx Weather to output JSON with hourly and daily forecasts and alerts
  (today the bar reads its Waybar text).
- **Stats** adds per-core load and top processes from `/proc`.
- **Tray**: a drawer popover and a list of pinned icons. Dragging an icon onto the bar is a
  new host feature; a setting can do the same job.
- **Bell menu**: right-click menus already exist in the protocol.
- **New plugins**: privacy dots from PipeWire's streams and the screen-cast portal, the
  recording timer from Nyx Capture, keyboard layouts from Hyprland's `activelayout` events,
  window title from `activewindow`, keep awake through an idle inhibitor.

## What Control Center would take

Every detail page keeps what it does today (`qml/ControlCenter/details/`, the live QML Control Center), including
empty states such as "Wi-Fi is off", "No Bluetooth adapter", "Flux isn't running" with
Start Flux, and Tailscale's install and sign-in prompts. Wi-Fi, VPN and Tailscale stay
separate tiles and pages. The work is the look, plus:

- **Floating panel**: the QML Control Center is already a 400 px card at the top right
  under the bar (`Main.qml`), sized to its content and scrolling past the screen's height;
  only its look changes.
- **Opening from the pill**: `--toggle wifi`, `bluetooth` and `battery` exist; `sound`
  is a new `Detail`. Esc closes a page opened this way; Back goes to the dashboard.
- **Sound page** (new): today's `VolumePopover.qml` as a page,
  with an output volume slider added at the top. The Sound & brightness tile's output chip
  opens it, and its screen chip opens Screens.
- **Battery page**: today's facts and power modes, plus the 24-hour history (UPower's
  `GetHistory`) and apps using a lot of power.
- **Row look**: choices are tinted with a tick instead of a plain selected row; Pause,
  Technology, Protocol and Scale stay segmented; the foot keeps its icon buttons.
