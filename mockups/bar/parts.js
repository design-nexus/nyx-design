// Nyx Bar mockups: the URL (theme and screen), icons, sample data, every bar item and
// popover, and the bar directions. Pages build their markup from these and call mount().
"use strict";
const Q = new URLSearchParams(location.search);
const ROOT = document.documentElement;
ROOT.dataset.theme = Q.get("theme") || "dark";
const SCREEN = Q.get("screen") || (ROOT.dataset.screens || "").split(",")[0];
ROOT.dataset.screen = SCREEN;
const SHOT = Q.get("shot") === "1";

/* ── Icons: 24 px grid, 1.6 px round strokes (Umbra symbolic) ─────────────────── */
const P = {
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  "chev-l": '<path d="m15 18-6-6 6-6"/>',
  "chev-r": '<path d="m9 18 6-6-6-6"/>',
  "chev-d": '<path d="m6 9 6 6 6-6"/>',
  "chev-u": '<path d="m6 15 6-6 6 6"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  more: '<path d="M5 12h.01M12 12h.01M19 12h.01" stroke-width="2.8"/>',
  folder: '<path d="M3 7.5A2.5 2.5 0 0 1 5.5 5H9l2 2.2h7.5A2.5 2.5 0 0 1 21 9.7v7.8a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 17.5z"/>',
  code: '<path d="m16 18 6-6-6-6M8 6l-6 6 6 6"/>',
  music: '<path d="M9 18V5.5l11-2V16"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="17.5" cy="16" r="2.5"/>',
  note: '<path d="M10 18V5l8-1.5"/><circle cx="7.5" cy="18" r="2.5"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
  terminal: '<rect x="3" y="4" width="18" height="16" rx="2.5"/><path d="m7 9 3 3-3 3M12.5 15h4.5"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="m3.5 7 8.5 6 8.5-6"/>',
  pen: '<path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16z"/><path d="m13.5 6.5 4 4"/>',
  calendar: '<rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
  chat: '<path d="M20.5 11.5a8 8 0 0 1-11.8 7L3.5 20l1.5-4.6A8 8 0 1 1 20.5 11.5z"/>',
  wifi: '<path d="M5 12.5a10 10 0 0 1 14 0M8.5 16a5 5 0 0 1 7 0M2 9a15 15 0 0 1 20 0M12 19.5h.01"/>',
  wifi2: '<path d="M5 12.5a10 10 0 0 1 14 0M8.5 16a5 5 0 0 1 7 0M12 19.5h.01"/><path d="M2 9a15 15 0 0 1 20 0" opacity=".3"/>',
  wifi1: '<path d="M8.5 16a5 5 0 0 1 7 0M12 19.5h.01"/><path d="M2 9a15 15 0 0 1 20 0M5 12.5a10 10 0 0 1 14 0" opacity=".3"/>',
  wifioff: '<path d="M8.5 16a5 5 0 0 1 7 0M12 19.5h.01M2 9a15 15 0 0 1 5-3.2M10.5 4.6A15 15 0 0 1 22 9M5 12.5a10 10 0 0 1 4-2.4M15 10.4a10 10 0 0 1 4 2.1M3 3l18 18"/>',
  ethernet: '<rect x="4" y="4" width="16" height="13" rx="2"/><path d="M8 17v3.5h8V17M8 8v3M11 8v3M14 8v3M17 8v3" transform="translate(-1 0)"/>',
  bluetooth: '<path d="m7 7 10 10-5 5V2l5 5L7 17"/>',
  btoff: '<path d="m7 7 10 10-5 5V2l5 5L7 17" opacity=".45"/><path d="M3 3l18 18"/>',
  volume: '<path d="M11 5 6.5 9H3.5v6h3L11 19z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9.5 9.5 0 0 1 0 13"/>',
  vol1: '<path d="M11 5 6.5 9H3.5v6h3L11 19z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/>',
  mute: '<path d="M11 5 6.5 9H3.5v6h3L11 19z"/><path d="m16 9.5 5 5M21 9.5l-5 5"/>',
  bell: '<path d="M6 9a6 6 0 0 1 12 0c0 6 2.5 8 2.5 8h-17S6 15 6 9M10.3 20.5a2 2 0 0 0 3.4 0"/>',
  belloff: '<path d="M9 18a3 3 0 0 0 6 0M6 9a6 6 0 0 1 9.4-5M18 9c0 6 2 7 2 8H6.5M4 4l16 16"/><path d="M6 9c0 4-1 6-2 8"/>',
  moon: '<path d="M20.5 13.2A8.5 8.5 0 1 1 10.8 3.5a6.6 6.6 0 0 0 9.7 9.7z"/>',
  nightlight: '<path d="M18 14.5A7 7 0 1 1 9.5 6a5.5 5.5 0 0 0 8.5 8.5z"/><path d="M17 3v3M15.5 4.5h3"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4"/>',
  cloudsun: '<path d="M7.5 7.8a3.6 3.6 0 0 1 6.6-.6M3.2 9.5l1.3.4M7 2.8v1.4M3.4 5.2l1.1.9M11.6 3.6l-.8 1.1"/><path d="M8.5 20a3.6 3.6 0 0 1-.4-7.2 5.2 5.2 0 0 1 9.9 1.4 2.9 2.9 0 0 1-.5 5.8z"/>',
  cloud: '<path d="M7 19a4 4 0 0 1-.6-8 6 6 0 0 1 11.5 1.5A3.5 3.5 0 0 1 17.5 19z"/>',
  rain: '<path d="M7 15a4 4 0 0 1-.6-8 6 6 0 0 1 11.5 1.5A3.5 3.5 0 0 1 17.5 15z"/><path d="m8.5 18-1 2.5M12.5 18l-1 2.5M16.5 18l-1 2.5"/>',
  storm: '<path d="M7 15a4 4 0 0 1-.6-8 6 6 0 0 1 11.5 1.5A3.5 3.5 0 0 1 17.5 15z"/><path d="m12.5 14-2 3.5h3l-2 3.5"/>',
  moonc: '<path d="M14 4.2a5 5 0 0 0 5.8 5.8A5 5 0 1 1 14 4.2z"/><path d="M8.5 20a3.3 3.3 0 0 1-.4-6.6 4.6 4.6 0 0 1 8.8 1.2 2.7 2.7 0 0 1-.4 5.4z"/>',
  wind: '<path d="M3 8h11a2.5 2.5 0 1 0-2.5-2.5M3 12h15a2.5 2.5 0 1 1-2.5 2.5M3 16h7"/>',
  droplet: '<path d="M12 3s6.5 7 6.5 11.5a6.5 6.5 0 0 1-13 0C5.5 10 12 3 12 3z"/>',
  sunrise: '<path d="M12 3v5M9 5.5 12 2.5l3 3M4.6 11.6 6 13M2.5 18h19M18 13l1.4-1.4M7 18a5 5 0 0 1 10 0"/>',
  pin: '<path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
  alert: '<path d="M12 3.5 2.5 20h19z"/><path d="M12 10v4.5M12 17.5h.01" stroke-width="1.9"/>',
  play: '<path fill="currentColor" stroke="none" d="M8 5.2v13.6a1 1 0 0 0 1.5.9l11-6.8a1 1 0 0 0 0-1.8l-11-6.8A1 1 0 0 0 8 5.2z"/>',
  pause: '<rect fill="currentColor" stroke="none" x="6" y="5" width="4" height="14" rx="1.2"/><rect fill="currentColor" stroke="none" x="14" y="5" width="4" height="14" rx="1.2"/>',
  prev: '<path fill="currentColor" stroke="none" d="M19 6.2v11.6a1 1 0 0 1-1.6.8L10 13a1.2 1.2 0 0 1 0-2l7.4-5.6a1 1 0 0 1 1.6.8z"/><rect fill="currentColor" stroke="none" x="5" y="5.5" width="2.6" height="13" rx="1"/>',
  next: '<path fill="currentColor" stroke="none" d="M5 6.2v11.6a1 1 0 0 0 1.6.8L14 13a1.2 1.2 0 0 0 0-2L6.6 5.4a1 1 0 0 0-1.6.8z"/><rect fill="currentColor" stroke="none" x="16.4" y="5.5" width="2.6" height="13" rx="1"/>',
  shuffle: '<path d="M16 3.5h4.5V8M3.5 20 20.5 3.5M20.5 16v4.5H16M14.5 14.5l6 6M3.5 4l5 5"/>',
  repeat: '<path d="m17 2.5 3.5 3.5L17 9.5"/><path d="M3.5 11.5v-1A4.5 4.5 0 0 1 8 6h12.5M7 21.5 3.5 18 7 14.5"/><path d="M20.5 12.5v1A4.5 4.5 0 0 1 16 18H3.5"/>',
  heart: '<path d="M12 20s-7.5-4.6-9-9.3C2 7.4 4.2 4.5 7.3 4.5c2 0 3.6 1.1 4.7 2.7 1.1-1.6 2.7-2.7 4.7-2.7 3.1 0 5.3 2.9 4.3 6.2-1.5 4.7-9 9.3-9 9.3z"/>',
  heartf: '<path fill="currentColor" d="M12 20s-7.5-4.6-9-9.3C2 7.4 4.2 4.5 7.3 4.5c2 0 3.6 1.1 4.7 2.7 1.1-1.6 2.7-2.7 4.7-2.7 3.1 0 5.3 2.9 4.3 6.2-1.5 4.7-9 9.3-9 9.3z"/>',
  queue: '<path d="M3.5 6h12M3.5 11h12M3.5 16h7M17.5 18V9.5l3.5-1"/><circle cx="15.5" cy="18" r="2"/>',
  lyrics: '<path d="M4 5.5h16M4 10h10M4 14.5h12M4 19h7"/>',
  cast: '<path d="M3 8V6.5A2.5 2.5 0 0 1 5.5 4h13A2.5 2.5 0 0 1 21 6.5v11a2.5 2.5 0 0 1-2.5 2.5H14M3 12a8 8 0 0 1 8 8M3 16a4 4 0 0 1 4 4M3 20h.01"/>',
  mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 10.5a6.5 6.5 0 0 0 13 0M12 17v4"/>',
  camera: '<rect x="2.5" y="6.5" width="13" height="11" rx="2.5"/><path d="m15.5 10.5 6-3.5v10l-6-3.5"/>',
  screenshare: '<rect x="3" y="4" width="18" height="12" rx="2.5"/><path d="M8.5 20h7M12 16v4M9.5 10.5 12 8l2.5 2.5M12 8v5"/>',
  record: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4" fill="currentColor" stroke="none"/>',
  stop: '<rect x="6.5" y="6.5" width="11" height="11" rx="2" fill="currentColor" stroke="none"/>',
  keyboard: '<rect x="2.5" y="6" width="19" height="12" rx="2.5"/><path d="M6.5 10h.01M10 10h.01M14 10h.01M17.5 10h.01M7.5 14h9" stroke-width="1.8"/>',
  coffee: '<path d="M5 9h11v5a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5z"/><path d="M16 10.5h1.5a2.5 2.5 0 0 1 0 5H16M8.5 3.5v2.5M12 3.5v2.5"/>',
  headphones: '<path d="M4 15v-3a8 8 0 0 1 16 0v3"/><rect x="3.5" y="14" width="4" height="6.5" rx="1.5"/><rect x="16.5" y="14" width="4" height="6.5" rx="1.5"/>',
  speaker: '<rect x="6" y="3" width="12" height="18" rx="2.5"/><circle cx="12" cy="14.5" r="3"/><path d="M12 7h.01" stroke-width="2.4"/>',
  monitor: '<rect x="3" y="4" width="18" height="12" rx="2.5"/><path d="M8.5 20h7M12 16v4"/>',
  mouse: '<rect x="6" y="3" width="12" height="18" rx="6"/><path d="M12 7v3.5"/>',
  phone: '<rect x="6.5" y="2.5" width="11" height="19" rx="2.5"/><path d="M11 18.5h2"/>',
  vpn: '<path d="M12 3 4.5 6v5.5c0 4.5 3.2 8.2 7.5 9.5 4.3-1.3 7.5-5 7.5-9.5V6z"/><path d="m9 12 2 2 4-4"/>',
  lock: '<rect x="4.5" y="11" width="15" height="10" rx="2.5"/><path d="M8 11V7.5a4 4 0 0 1 8 0V11"/>',
  plane: '<path d="M21 15.5v-2l-8-5V4a1.5 1.5 0 0 0-3 0v4.5l-8 5v2l8-2.5v4.5l-2.5 1.8V21l4-1 4 1v-1.7L13 17.5V13z"/>',
  leaf: '<path d="M5 19c0-8 5-13 15-14-1 10-6 15-14 15"/><path d="M5 19l7-7"/>',
  gauge: '<path d="M4.5 17a8.5 8.5 0 1 1 15 0"/><path d="m12 13 3.5-4"/>',
  bolt: '<path d="M13 3 5 13.5h6L10 21l8-10.5h-6z"/>',
  power: '<path d="M12 3v9M17.7 6.6a8 8 0 1 1-11.4 0"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
  toggles: '<rect x="3" y="4.5" width="18" height="6.5" rx="3.25"/><circle cx="16.75" cy="7.75" r="1.5"/><rect x="3" y="13" width="18" height="6.5" rx="3.25"/><circle cx="7.25" cy="16.25" r="1.5"/>',
  cpu: '<rect x="6" y="6" width="12" height="12" rx="2"/><rect x="9.5" y="9.5" width="5" height="5" rx="1"/><path d="M9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3"/>',
  memory: '<rect x="3" y="7" width="18" height="10" rx="1.5"/><path d="M7 10.5v3M11 10.5v3M15 10.5v3M6 17v2.5M10 17v2.5M14 17v2.5M18 17v2.5"/>',
  gpu: '<rect x="2.5" y="6" width="19" height="11" rx="2"/><circle cx="9" cy="11.5" r="2.8"/><path d="M15 9.5h3.5M15 13.5h3.5M5 17v2.5"/>',
  thermo: '<path d="M10 4a2 2 0 0 1 4 0v10a4 4 0 1 1-4 0z"/><path d="M12 9v6"/>',
  drive: '<rect x="3" y="13" width="18" height="7" rx="2"/><path d="M4.5 13 7 5h10l2.5 8M7 16.5h.01"/>',
  down: '<path d="M12 4v16M6 14l6 6 6-6"/>',
  up: '<path d="M12 20V4M6 10l6-6 6 6"/>',
  check: '<path d="M20 6.5 9 17.5l-5-5"/>',
  x: '<path d="M17.5 6.5l-11 11M6.5 6.5l11 11"/>',
  external: '<path d="M14.5 3.5h6v6M10 14 20.5 3.5M18.5 13.5v5a2 2 0 0 1-2 2h-11a2 2 0 0 1-2-2v-11a2 2 0 0 1 2-2h5"/>',
  cloudsync: '<path d="M7 19a4 4 0 0 1-.6-8 6 6 0 0 1 11.5 1.5A3.5 3.5 0 0 1 17.5 19z"/><path d="m10 15 2 2 3-3.5"/>',
  gamepad: '<path d="M7 7h10a5 5 0 0 1 4.8 6.4l-1 3.4a2.3 2.3 0 0 1-3.9 1L15 16H9l-1.9 1.8a2.3 2.3 0 0 1-3.9-1l-1-3.4A5 5 0 0 1 7 7z"/><path d="M8 10v3M6.5 11.5h3M15.5 11h.01M17.5 12.5h.01" stroke-width="1.8"/>',
  key: '<circle cx="8" cy="15" r="4.5"/><path d="m11.2 11.8 8.8-8.8M16.5 6.5 19 9M14.5 8.5l2 2"/>',
  sync: '<path d="M20.5 12a8.5 8.5 0 0 1-14.6 5.9M3.5 12a8.5 8.5 0 0 1 14.6-5.9"/><path d="M20.5 4v4.5H16M3.5 20v-4.5H8"/>',
  box: '<path d="M12 3 4 7v10l8 4 8-4V7z"/><path d="m4 7 8 4 8-4M12 11v10"/>',
  windows: '<rect x="3" y="6" width="12" height="10" rx="2"/><rect x="9" y="10" width="12" height="10" rx="2"/>',
  layers: '<path d="m12 3 9 4.5-9 4.5-9-4.5z"/><path d="m3 12 9 4.5 9-4.5M3 16.5 12 21l9-4.5"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  flag: '<path d="M5 21V4M5 4h12l-2.5 4.5L17 13H5"/>',
  grid: '<rect x="4" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5"/>',
  reply: '<path d="M9 16 4 11l5-5"/><path d="M4 11h10a6 6 0 0 1 6 6v2"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4.5 20.5a7.5 7.5 0 0 1 15 0"/>',
};
const ic = (n, c = "") =>
  `<i class="ic ${c}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[n] ?? ""}</svg></i>`;

// The Nyx mark (crates/nyx-theme-core/brand/nyx-mark-small.svg), in currentColor.
let markN = 0;
const logo = (c = "") => {
  const id = `nyxm${markN++}`;
  return `<i class="ic logo ${c}"><svg viewBox="0 0 32 32"><mask id="${id}"><rect width="32" height="32" fill="#fff"/><circle cx="14" cy="15.4" r="11.4" fill="#000"/></mask><circle cx="16" cy="16" r="13" fill="currentColor" mask="url(#${id})"/></svg></i>`;
};

// App icons as small Nyx tiles: satin square, glyph in the app's swatch.
const APPS = {
  browser: ["globe", "blue", "Browser"],
  terminal: ["terminal", "graphite", "Terminal"],
  files: ["folder", "teal", "Files"],
  code: ["code", "violet", "Code"],
  music: ["music", "pink", "Music"],
  mail: ["mail", "coral", "Mail"],
  notes: ["pen", "amber", "Notes"],
  calendar: ["calendar", "red", "Calendar"],
  chat: ["chat", "green", "Chat"],
  weather: ["cloudsun", "amber", "Weather"],
  activity: ["gauge", "red", "Activity"],
};
const app = (k, c = "") => {
  const [g, s] = APPS[k];
  return `<span class="app ${c}" style="--sw: var(--sw-${s})">${ic(g)}</span>`;
};
// Third-party tray icons keep their own colours.
const TRAY = {
  discord: ["chat", "#5865f2", "Discord"],
  nextcloud: ["cloudsync", "#1f8fe0", "Nextcloud"],
  steam: ["gamepad", "currentColor", "Steam"],
  onepass: ["key", "#3b82f6", "1Password"],
  syncthing: ["sync", "#0891d1", "Syncthing"],
  kdeconnect: ["phone", "#3daee9", "KDE Connect"],
  obs: ["record", "#a1a1aa", "OBS Studio"],
  solaar: ["mouse", "#22c55e", "Solaar"],
};
const tray = (k, c = "") => `<span class="tri ${c}" style="color:${TRAY[k][1]}">${ic(TRAY[k][0])}</span>`;

const batt = (p, charging = false, c = "") =>
  `<i class="ic batt ${c}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="7" width="17" height="10" rx="2.6"/><path d="M22 10.5v3"/><rect class="lvl" x="4.6" y="9.1" width="${((12.8 * p) / 100).toFixed(1)}" height="5.8" rx="1.1" fill="currentColor" stroke="none"/>${charging ? '<path class="bolt" d="M12.3 7.6 8.6 12.6h3.1l-.8 3.9 3.8-5.1h-3.1z" stroke="none"/>' : ""}</svg></i>`;

const spark = (vals, w = 40, h = 14, max = 100, c = "") => {
  const step = w / (vals.length - 1);
  const pts = vals.map((v, i) => `${(i * step).toFixed(1)},${(h - 1 - (v / max) * (h - 2)).toFixed(1)}`);
  return `<svg class="spark ${c}" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><path class="fill" d="M0,${h} L${pts.join(" L")} L${w},${h}Z"/><path class="line" d="M${pts.join(" L")}"/></svg>`;
};
const ring = (p, size = 16, c = "") => {
  const r = (size - 3) / 2, cx = size / 2, len = 2 * Math.PI * r;
  return `<svg class="ring ${c}" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><circle class="trk" cx="${cx}" cy="${cx}" r="${r}"/><circle class="val" cx="${cx}" cy="${cx}" r="${r}" stroke-dasharray="${((len * p) / 100).toFixed(2)} ${len.toFixed(2)}" transform="rotate(-90 ${cx} ${cx})"/></svg>`;
};
const eq = (c = "") => `<span class="eq ${c}"><b style="height:45%"></b><b style="height:100%"></b><b style="height:62%"></b><b style="height:84%"></b></span>`;
const cover = (size, g = "g7", r = 4) => `<span class="art ${g}" style="width:${size}px;height:${size}px;border-radius:${r}px"></span>`;
const rail = (p, c = "") => `<div class="rail ${c}" style="--p:${p}%"><b></b></div>`;
const sw = (on) => `<span class="sw ${on ? "on" : ""}"></span>`;
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");

/* ── Sample state: Tuesday 10 November 2026, 14:32 ───────────────────────────── */
const WS = [
  { n: 1, apps: ["browser", "terminal"] },
  { n: 2, apps: ["files", "notes", "terminal"], active: true },
  { n: 3, apps: ["music"] },
  { n: 4, apps: [] },
  { n: 5, apps: ["mail", "chat"], urgent: true },
  { n: 6, apps: [] },
];
const wcls = (w) => [w.active && "on", w.apps.length && "occ", w.urgent && "urg"].filter(Boolean).join(" ");

/* ── Inline items ─────────────────────────────────────────────────────────────── */
// One bar item. id lets popovers anchor to it; "hov" and "open" are drawn states.
const it = (inner, id = "", c = "", tip = "") => `<div class="it ${c}"${id ? ` id="${id}"` : ""}${tip ? ` title="${tip}"` : ""}>${inner}</div>`;

const ws = {
  // Today's look: numbers, the active one tinted.
  numbers: (n = 5) => `<span class="wsn">${WS.slice(0, n).map((w) => `<span class="w ${wcls(w)}">${w.n}</span>`).join("")}</span>`,
  // A: the active workspace is an accent pill holding its windows' icons; others show
  // their number over one pip per window.
  pills: () =>
    `<span class="wsp">${WS.map((w) =>
      w.active
        ? `<span class="w on"><em>${w.n}</em>${w.apps.map((a) => ic(APPS[a][0])).join("")}</span>`
        : `<span class="w ${wcls(w)}"><em>${w.n}</em><span class="pips">${w.apps.map(() => "<u></u>").join("")}</span></span>`
    ).join("")}</span>`,
  // C: busy workspaces as their app icons; empty ones hidden.
  icons: () =>
    `<span class="wsi">${WS.filter((w) => w.apps.length).map((w) => `<span class="w ${wcls(w)}"><em>${w.n}</em>${w.apps.map((a) => app(a)).join("")}</span>`).join("")}</span>`,
  // B: dots, the active one stretched.
  dots: () => `<span class="wsd">${WS.map((w) => `<span class="${wcls(w)}"></span>`).join("")}</span>`,
  // E: numbers on a sliding accent pill, a dot under busy ones.
  accent: () => `<span class="wsa">${WS.map((w) => `<span class="w ${wcls(w)}">${w.n}</span>`).join("")}</span>`,
  // F: Omarchy's numbers with an accent underline.
  underline: () => `<span class="wsu">${WS.slice(0, 5).map((w) => `<span class="w ${wcls(w)}">${w.n}</span>`).join("")}</span>`,
};

const clock = {
  plain: () => `<span>Tue Nov 10&ensp;14:32</span>`,
  strong: () => `<span class="dim">Tue Nov 10</span><b class="t600">14:32</b>`,
  next: () => `${clock.strong()}<span class="nextev c-work"><u></u>Design review · 28 min</span>`,
  soon: () => `${clock.strong()}<span class="nextev soon c-work"><u></u>Design review in 4 min</span>`,
  stack: () => `<span class="stack"><b>14:32</b><small>Tue, Nov 10</small></span>`,
  time: () => `<b class="t600">14:32</b>`,
  mac: () => `<span class="t500">Tue Nov 10&ensp;2:32 PM</span>`,
  omarchy: () => `<span class="t500">Tuesday 14:32</span>`,
};

const media = {
  compact: () => `${cover(18, "g7")}<span class="mt ell">Midnight City</span>${eq()}`,
  expanded: () => `${cover(18, "g7")}<span class="mt ell">Midnight City <span class="dim">· M83</span></span><span class="mctl">${ic("prev")}${ic("pause")}${ic("next")}</span>`,
  minimal: () => `${eq()}`,
  progress: () => `${cover(18, "g7")}<span class="mprog"><span class="mt ell">Midnight City</span>${rail(42, "thin")}</span>`,
  paused: () => `${cover(18, "g7", 4).replace('class="art', 'class="art paused')}<span class="mt ell dim">Midnight City</span>${ic("play", "sm")}`,
  old: () => `${cover(16, "g7", 3)}<span>Midnight City — M83</span>`,
};

const weather = {
  basic: () => `${ic("cloudsun")}<span>57°</span>`,
  cond: () => `${ic("cloudsun")}<span>57°</span><span class="dim">Partly cloudy</span>`,
  range: () => `${ic("cloudsun")}<span>57°</span><span class="ter xs">62° / 46°</span>`,
  alert: () => `${ic("storm", "warn")}<span>57°</span><span class="chip warn">Storm 18:00</span>`,
  old: () => `<span>⛅ 57°F</span>`,
};

const CPU = [8, 14, 11, 22, 18, 9, 12, 30, 16, 10, 12, 12];
const stats = {
  text: () => `<span class="statt">${ic("cpu")}12%</span><span class="statt">${ic("memory")}41%</span><span class="statt">${ic("thermo")}52°</span>`,
  spark: () => `${ic("cpu")}${spark(CPU, 34, 14)}<span class="tnum">12%</span>`,
  rings: () => `<span class="rg">${ring(12)}<small>CPU</small></span><span class="rg">${ring(41, 16, "b")}<small>RAM</small></span><span class="rg">${ring(52, 16, "c")}<small>52°</small></span>`,
  busy: () => `${ic("cpu", "warn")}${spark([20, 35, 60, 72, 88, 94, 91, 94], 34, 14, 100, "warn")}<span class="tnum warn">94%</span>`,
  old: () => `<span>12%&ensp;41%&ensp;52°C</span>`,
};

const status = {
  net: (id = "i-net") => it(ic("wifi"), id),
  bt: (id = "i-bt") => it(ic("bluetooth"), id),
  vol: (id = "i-vol") => it(ic("volume"), id),
  bat: (id = "i-bat", pct = true) => it(`${batt(82)}${pct ? '<span class="tnum">82%</span>' : ""}`, id),
  // All four as one button that opens quick settings.
  group: (id = "i-status") => it(`${ic("wifi")}${ic("bluetooth")}${ic("volume")}${batt(82)}<span class="tnum">82%</span>`, id, "stat"),
  values: () => it(`${ic("wifi")}<span class="dim">Nexus-5G</span>`) + it(`${ic("headphones")}<span class="dim">70%</span>`) + it(`${ic("volume")}<span class="tnum dim">64%</span>`) + it(`${batt(82)}<span class="tnum">82%</span>`),
  separate: () => status.net() + status.bt() + status.vol() + status.bat("i-bat", false),
};

const bell = (n = 3, id = "i-bell") => it(`${ic("bell")}${n ? `<span class="bdg">${n}</span>` : ""}`, id, "bellit");
const dnd = () => it(`${ic("moon")}`, "", "bellit dnd");
const cc = (id = "i-cc") => it(ic("toggles"), id);
const trayItems = (keys = ["discord", "nextcloud", "steam"], chevron = true, id = "i-tray") =>
  it(`${keys.map((k) => tray(k)).join("")}${chevron ? ic("chev-d", "chev") : ""}`, id, "trayit");
const winTitle = (short = false) => it(`${app("files")}<b class="t600">Files</b>${short ? "" : '<span class="dim ell wt">~/Projects/nyx-bar</span>'}`, "i-win", "win");
const privacy = (id = "i-priv") => it(`<span class="priv"><u class="mic"></u><u class="scr"></u></span>`, id, "privit");
const recording = (id = "i-rec") => it(`<span class="recdot"></span><span class="tnum">02:14</span>${ic("stop", "sm")}`, id, "recit");
const kbd = (id = "i-kbd") => it(`<span class="kbd">EN</span>`, id);

/* ── Popover pieces ───────────────────────────────────────────────────────────── */
const prow = (i, t, s = "", c = "", trail = "") =>
  `<div class="prow ${c}"><span class="pi">${i.startsWith("<") ? i : ic(i)}</span><div class="grow"><div class="pt ell">${t}</div>${s ? `<div class="ps ell">${s}</div>` : ""}</div>${trail}</div>`;
const phead = (i, t, trail = "") => `<div class="phead">${ic(i)}<b>${t}</b><span class="grow"></span>${trail}</div>`;
const gl = (t, trail = "") => `<div class="sh"><span class="glabel">${t}</span><span class="grow"></span>${trail}</div>`;
const pfoot = (l, r = "") => `<div class="pfoot"><span class="link">${l}</span><span class="grow"></span>${r}</div>`;
const slider = (i, p, label = "", c = "") => `<div class="sl ${c}">${ic(i)}${rail(p)}${label ? `<span class="pv tnum">${label}</span>` : ""}</div>`;

/* ── Calendar ─────────────────────────────────────────────────────────────────── */
const CAL = {
  events: { 3: ["work"], 5: ["personal"], 6: ["work"], 10: ["work", "personal", "work", "personal"], 11: ["hol", "personal"], 12: ["work", "work", "family"], 13: ["family"], 17: ["work"], 18: ["personal"], 19: ["work", "family"], 21: ["personal"], 24: ["work"], 26: ["hol", "family"], 27: ["family"] },
};
function monthGrid(sel = 10, today = 10) {
  const lead = (new Date(2026, 10, 1).getDay() + 6) % 7; // weeks start on Monday
  let h = `<div class="mgrid">${["M", "T", "W", "T", "F", "S", "S"].map((d) => `<span class="wd">${d}</span>`).join("")}`;
  for (let i = 0; i < 42; i++) {
    const d = i - lead + 1, out = d < 1 || d > 30;
    const n = d < 1 ? 31 + d : d > 30 ? d - 30 : d;
    const ev = (!out && CAL.events[d]) || [];
    const c = [out && "out", !out && d === today && "today", !out && d === sel && "sel", i % 7 > 4 && "we", ev.includes("hol") && "hol"].filter(Boolean).join(" ");
    h += `<span class="d ${c}"><b>${n}</b><i>${ev.filter((e) => e !== "hol").slice(0, 3).map((e) => `<u class="c-${e}"></u>`).join("")}</i></span>`;
  }
  return h + "</div>";
}
const ev = (e) =>
  e.now
    ? `<div class="now"><span>${e.now}</span></div>`
    : `<div class="ev c-${e.c} ${e.cls || ""}"><span class="tm"><b>${e.s}</b>${e.e ? `<small>${e.e}</small>` : ""}</span><span class="cb"></span><div class="grow"><div class="et ell">${e.t}</div><div class="es ell">${e.sub}</div></div>${e.trail || ""}</div>`;
const TODAY = [
  { s: "09:30", e: "09:45", t: "Standup", c: "work", sub: "Work · Video call", cls: "past" },
  { s: "12:00", e: "13:00", t: "Lunch with Sam", c: "personal", sub: "Café Lumen", cls: "past" },
  { now: "14:32" },
  { s: "15:00", e: "16:00", t: "Design review: Nyx Bar", c: "work", sub: "Video call · Priya, Sam +2", cls: "next", trail: `<span class="soon">in 28 min</span><button class="btn primary sm">${ic("camera")}Join</button>` },
  { s: "17:30", e: "18:30", t: "Gym", c: "personal", sub: "Personal", cls: "hov", trail: `<button class="ibtn sm hov" title="Open in Calendar">${ic("external")}</button>` },
];
const THU = [
  { s: "11:00", e: "11:45", t: "Sprint planning", c: "work", sub: "Video call · Work", trail: `<button class="btn sm">${ic("camera")}Join</button>` },
  { s: "14:00", e: "14:30", t: "1:1 with Priya", c: "work", sub: "Room 4B · Work" },
  { s: "20:00", e: "", t: "Movie night", c: "family", sub: "Family", trail: `<button class="ibtn sm" title="Open in Calendar">${ic("external")}</button>` },
];
const UPCOMING = [
  ["Wed 11", "All day", "Veterans Day", "hol"],
  ["Wed 11", "10:00", "Dentist", "personal"],
  ["Thu 12", "11:00", "Sprint planning", "work"],
  ["Fri 13", "19:00", "Dinner at Mom’s", "family"],
];
const up = ([d, t, title, c]) => `<div class="up c-${c}"><span class="ud">${d}</span><span class="cb"></span><span class="grow ell">${title}</span><span class="ter tnum">${t}</span></div>`;
const REM = [
  { t: "Send invoice to Acme", due: "Overdue · yesterday", c: "late", list: "Work" },
  { t: "Pick up dry cleaning", due: "Today, 18:00", list: "Errands", c: "hov" },
  { t: "Call Mom about Thanksgiving", due: "Today", list: "Family" },
  { t: "Renew design-nex.us", due: "Done at 11:02", c: "done", list: "Work" },
];
const rem = (r) => `<div class="rem ${r.c || ""}"><span class="chk">${r.c === "done" ? ic("check") : ""}</span><div class="grow"><div class="rt ell">${r.t}</div><div class="rs">${r.due}</div></div><span class="list">${r.list}</span></div>`;

function calendarPop(layout = "two") {
  if (layout === "two")
    return `<div class="cal cal2">
  <div class="cal-top">
    <div><div class="cal-day">Tuesday</div><div class="cal-date">November 10, 2026 · Week 46</div></div>
    <span class="grow"></span>
    <button class="btn sm">Today</button>
    <button class="ibtn sm">${ic("chev-l")}</button><button class="ibtn sm">${ic("chev-r")}</button>
    <span class="vsep"></span>
    <button class="ibtn sm" title="Open Calendar">${app("calendar")}</button>
    <button class="ibtn sm" title="Open Reminders">${ic("check")}</button>
  </div>
  <div class="cal-cols">
    <div class="cal-left">
      <div class="mtitle">November <span>2026</span></div>
      ${monthGrid()}
      <div class="legend"><span class="c-work">Work</span><span class="c-personal">Personal</span><span class="c-family">Family</span><span class="c-hol">Holidays</span></div>
      <div class="upc">${gl("Upcoming")}${UPCOMING.map(up).join("")}</div>
    </div>
    <div class="cal-right">
      ${gl("Today", `<span class="ter xs">4 events</span><button class="ibtn sm" title="New event">${ic("plus")}</button>`)}
      <div class="agenda">${TODAY.map(ev).join("")}</div>
      ${gl("Reminders", `<span class="ter xs">3 left</span><button class="ibtn sm" title="New reminder">${ic("plus")}</button>`)}
      <div class="rems">${REM.map(rem).join("")}</div>
    </div>
  </div>
</div>`;
  return `<div class="cal cal1">
  <div class="cal-top">
    <div><div class="cal-day">Thursday 12</div><div class="cal-date">November 2026 · today is Tuesday 10</div></div>
    <span class="grow"></span>
    <button class="btn sm">Today</button>
    <button class="ibtn sm">${ic("chev-l")}</button><button class="ibtn sm">${ic("chev-r")}</button>
  </div>
  ${monthGrid(12, 10)}
  ${gl("Thursday 12", '<span class="ter xs">3 events</span>')}
  <div class="agenda">${THU.map(ev).join("")}</div>
  ${gl("Reminders due today", '<span class="ter xs">3 left</span>')}
  <div class="rems">${REM.slice(0, 2).map(rem).join("")}</div>
  ${pfoot("Open Calendar", '<span class="link">1 more in Reminders</span>')}
</div>`;
}

// Today's popover: the date in bold over `cal` in a monospaced label.
const calOld = () => `<div class="oldcal"><b>Tuesday, November 10, 2026</b><pre>   November 2026
Su Mo Tu We Th Fr Sa
 1  2  3  4  5  6  7
 8  9 10 11 12 13 14
15 16 17 18 19 20 21
22 23 24 25 26 27 28
29 30</pre></div>`;

/* ── System popovers ──────────────────────────────────────────────────────────── */
const appvol = (a, name, p) => `<div class="avol">${app(a)}<div class="grow"><div class="pt small">${name}</div>${rail(p, "thin")}</div><span class="pv tnum ter">${p}%</span></div>`;
/* ── Control Center (opened from the status pill) ─────────────────────────────── */
// Tiles keep Control Center's 4-column grid and sizes from tiles.rs: w × h cells.
Object.assign(P, {
  home: '<path d="M3.5 11 12 4l8.5 7"/><path d="M5.5 9.5V20h13V9.5"/>',
  network: '<rect x="9" y="2.5" width="6" height="5" rx="1.2"/><rect x="2.5" y="16.5" width="6" height="5" rx="1.2"/><rect x="15.5" y="16.5" width="6" height="5" rx="1.2"/><path d="M12 7.5V12M5.5 16.5V12h13v4.5"/>',
  signal: '<path d="M5 20v-3M10 20v-7M15 20v-11M20 20V5"/>',
  capture: '<path d="M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2"/><circle cx="12" cy="12" r="3"/>',
  keylight: '<rect x="2.5" y="10" width="19" height="10" rx="2.5"/><path d="M6.5 14h.01M10 14h.01M14 14h.01M17.5 14h.01M12 3v3M6.5 5l1.5 2M17.5 5 16 7" stroke-width="1.7"/>',
  bulb: '<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.6 10.8c.7.6 1.1 1.3 1.1 2.2h5c0-.9.4-1.6 1.1-2.2A6 6 0 0 0 12 3z"/>',
});
const cct = (w, h, inner, c = "") => `<div class="cct ${c}" style="grid-column:span ${w};grid-row:span ${h}">${inner}</div>`;
const ccTog = (i, t, s, on, chev = true, c = "") =>
  cct(2, 1, `<span class="qi">${i.startsWith("<") ? i : ic(i)}</span><div class="grow"><div class="pt ell">${t}</div><div class="ps ell">${s}</div></div>${chev ? `<span class="cchev">${ic("chev-r")}</span>` : ""}`, `tog ${on ? "on" : ""} ${c}`);
const ccOne = (i, t, on = false, c = "") => cct(1, 1, `<span class="qi">${ic(i)}</span><div class="pt ell">${t}</div>`, `one ${on ? "on" : ""} ${c}`);
const ccSlider = (i, p, val, di, dname) =>
  `<div class="ccsl"><button class="ibtn sm">${ic(i)}</button>${rail(p)}<span class="pv tnum">${val}</span>${di ? `<span class="ccdev">${ic(di, "sm")}<span class="ell">${dname}</span>${ic("chev-r", "xs")}</span>` : ""}</div>`;

const ccHead = (edit = false) =>
  edit
    ? `<div class="cchead"><b class="cctitle">Edit dashboard</b><span class="grow"></span><button class="btn sm">${ic("sync")}Restore default</button><button class="btn sm primary">Done</button></div>`
    : `<div class="cchead"><span class="avatar">K</span><div class="grow"><div class="pt">Ken</div><div class="ps">Battery 82% · 4 h 10 min left</div></div><button class="ibtn sm" title="Edit the dashboard">${ic("pen")}</button><button class="ibtn sm" title="Settings">${ic("gear")}</button><button class="ibtn sm" title="Lock, log out, restart, shut down">${ic("power")}</button></div>`;

Object.assign(P, {
  eye: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',
  qr: '<rect x="3.5" y="3.5" width="6.5" height="6.5" rx="1"/><rect x="14" y="3.5" width="6.5" height="6.5" rx="1"/><rect x="3.5" y="14" width="6.5" height="6.5" rx="1"/><path d="M14 14h3v3h-3zM17 17h3.5v3.5M14 20.5h.01M20.5 14h.01"/>',
  server: '<rect x="3" y="3.5" width="18" height="7.5" rx="2"/><rect x="3" y="13" width="18" height="7.5" rx="2"/><path d="M7 7.25h.01M7 16.75h.01" stroke-width="2.4"/>',
  trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4.5h6V7"/>',
  copy: '<rect x="8" y="8" width="12" height="12" rx="2.5"/><path d="M16 8V6.5A2.5 2.5 0 0 0 13.5 4h-7A2.5 2.5 0 0 0 4 6.5v7A2.5 2.5 0 0 0 6.5 16H8"/>',
  link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
  send: '<path d="M21 3 10 14M21 3l-6.5 18-4.5-7-7-4.5z"/>',
  paste: '<rect x="8" y="3.5" width="8" height="4" rx="1.2"/><path d="M8 5.5H6.5A2.5 2.5 0 0 0 4 8v10.5A2.5 2.5 0 0 0 6.5 21h11a2.5 2.5 0 0 0 2.5-2.5V8a2.5 2.5 0 0 0-2.5-2.5H16"/>',
  star: '<path d="m12 3.5 2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.8l-5.2 2.8 1-5.8-4.3-4.1 5.9-.8z"/>',
  starf: '<path fill="currentColor" d="m12 3.5 2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.8l-5.2 2.8 1-5.8-4.3-4.1 5.9-.8z"/>',
  onion: '<circle cx="12" cy="14" r="7"/><path d="M12 7c-2 2-3 4.5-3 7s1 5 3 7M12 7c2 2 3 4.5 3 7s-1 5-3 7M12 7V3.5"/>',
  font: '<path d="M4 20 9.5 5h1L16 20M6.2 14.5h7.6M16.5 20l2.5-6 2.5 6M17.4 18h3.2"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
});
// Row pieces: a small icon button, a choice (ticked when current), a setting with a switch,
// a NordVPN favourite (default mark and star), a row with its own segmented choice.
const rb = (i, tip, c = "") => `<button class="ibtn xs ${c}" title="${tip}">${ic(i)}</button>`;
const pick = (i, t, s = "", on = false, trail = "", c = "") => prow(i, t, s, `${on ? "cur" : ""} ${c}`, `${trail}${on ? ic("check", "acc sm") : ""}`);
const opt = (t, s, on, i = "gear") => prow(i, t, s, "", sw(on));
const fav = (i, t, s, def, starred) =>
  prow(i, t, s, "fav", `<span class="radio ${def ? "on" : ""}" title="${def ? "Where the VPN connects by default" : "Connect here by default"}"></span>${starred ? rb("starf", "Remove from favourites", "acc") : ""}`);
const segRow = (i, t, s, opts, on) =>
  `<div class="prow segrow"><span class="pi">${ic(i)}</span><div class="grow"><div class="pt">${t}</div><div class="ps">${s}</div><div class="segs">${opts.map((o, k) => `<span class="${k === on ? "on" : ""}" title="${t}: ${o}">${o}</span>`).join("")}</div></div></div>`;
const srch = (ph, q = "") => `<div class="srch">${ic("search", "sm")}<span class="${q ? "" : "ter"}">${q || ph}</span>${q ? '<span class="caret"></span>' : ""}</div>`;
const card = (rows, c = "") => `<div class="cccard ${c}">${rows}</div>`;
// The page's foot: icon buttons on the right as today, one shown hovered with its tooltip.
const ccFoot = (btns, left = "") =>
  `<div class="ccfoot">${left ? `<span class="ter xs">${left}</span>` : ""}<span class="grow"></span>${btns
    .map(([i, t, hov]) => `<button class="ibtn sm ${hov ? "hov" : ""}" title="${t}">${ic(i)}${hov ? `<span class="ftip">${t}</span>` : ""}</button>`)
    .join("")}</div>`;
const facts = (list) => `<div class="facts">${list.map(([k, v]) => `<div><span class="ter xs">${k}</span><b class="tnum">${v}</b></div>`).join("")}</div>`;

const ccTiles = () => [
  ccTog("wifi", "Wi-Fi", "Nexus-5G", true),
  ccTog("bluetooth", "Bluetooth", "WH-1000XM5", true),
  ccTog("vpn", "VPN", "NordVPN · Germany", true),
  ccTog("network", "Tailscale", "Connected · 4 machines", true),
  ccOne("moon", "Do not disturb"),
  ccOne("grid", "Tiling", true),
  ccOne("nightlight", "Night light", true),
  ccOne("coffee", "Keep awake"),
  cct(4, 2, `<div class="sbhead"><span class="ter xs">SOUND</span><span class="grow"></span><span class="ccdev">${ic("headphones", "sm")}<span class="ell">WH-1000XM5</span>${ic("chev-r", "xs")}</span></div>${ccSlider("volume", 64, "64%")}<div class="sbhead"><span class="ter xs">BRIGHTNESS</span><span class="grow"></span><span class="ccdev">${ic("monitor", "sm")}<span class="ell">Screens</span>${ic("chev-r", "xs")}</span></div>${ccSlider("sun", 80, "80%")}`, "sliders"),
  cct(4, 2, `<div class="ccm">${cover(56, "g7", 10)}<div class="grow"><div class="ps">${app("music")} Music</div><div class="pt ell">Midnight City</div><div class="ps">M83</div></div><span class="mctl">${ic("prev")}<span class="playb sm">${ic("pause")}</span>${ic("next")}</span></div><div class="seek"><span class="tnum ter xs">1:42</span>${rail(42)}<span class="tnum ter xs">4:03</span></div>`, "media"),
  cct(2, 1, `<div class="grow"><div class="pt">Power mode</div><div class="miniseg"><span>${ic("leaf", "sm")}</span><span class="on">${ic("gauge", "sm")}</span><span>${ic("bolt", "sm")}</span></div></div>`, "pmode"),
  ccTog(batt(82), "82%", "4 h 10 min left", false, true, "battile"),
  ccOne("phone", "Devices", true),
  ccOne("mic", "Microphone"),
  ccOne("keylight", "Key light"),
  ccOne("capture", "Capture"),
];
const ccDots = (add = false) => `<div class="ccdots"><span class="on"></span><span></span>${add ? `<button class="ibtn sm" title="Add a page">${ic("plus")}</button>` : ""}</div>`;

const ccDashboard = () => `${ccHead()}<div class="ccgrid">${ccTiles().join("")}</div>${ccDots()}`;

const ADDABLE = [["home", "Home", "Lights and scenes · 4 × 3"], ["calendar", "Up next", "Calendar · 4 × 3"], ["box", "Backup", "Last backup · 2 × 3"], ["cloudsun", "Weather", "Plugin · 2 × 1"], ["signal", "Ping", "Plugin · 1 × 1"], ["plus", "More plugins", "nyx plugin search"]];
const ccEdit = () => `${ccHead(true)}<div class="ccgrid edit">${ccTiles().map((t, i) => (i === 9 ? t.replace('class="cct ', 'class="cct lift ') : t)).join("")}</div>${ccDots(true)}
<div class="ccadd">${gl("Add to the dashboard", '<span class="ter xs">drag onto the grid</span>')}<div class="addgrid">${ADDABLE.map(([i, t, s]) => `<div class="addc">${ic(i)}<div class="grow"><div class="pt ell">${t}</div><div class="ps ell">${s}</div></div><span class="plus">${ic("plus", "sm")}</span></div>`).join("")}</div></div>`;

const ccDetail = (title, trail, body, foot = "", c = "") => `<div class="ccdh"><button class="ibtn sm" title="Back (Esc)">${ic("chev-l")}</button><b>${title}</b><span class="grow"></span>${trail}</div><div class="ccbody ${c}">${body}</div>${foot}`;


/* Detail pages: everything today's pages do (qml/ControlCenter/details/), in the new look. */
const lock = ic("lock", "ter sm");
const ccWifi = () => ccDetail("Wi-Fi", sw(true), `
${card(`${prow("wifi", "Nexus-5G", "Connected", "sel", rb("wifioff", "Disconnect"))}
<div class="prow optrow"><div class="grow"><div class="pt">Metered connection</div><div class="ps">Pause large downloads and updates on this network</div></div>${sw(false)}</div>`)}
${gl("Connection")}
${facts([["Address", "192.168.1.42/24"], ["Router", "192.168.1.1"], ["Router ping", "2 ms"], ["Internet ping", "18 ms"], ["Down", "2.4 MB/s"], ["Up", "180 KB/s"], ["Signal", "−48 dBm"]])}
${gl("Known networks")}
${card(prow("wifi2", "Home-2G", "", "", lock) + prow("wifi1", "Office", "", "", lock))}
${gl("Other networks")}
${card(`${prow("wifi2", "NETGEAR-42", "", "hov", lock)}<div class="pwrow"><span class="pwfield"><span class="dots">••••••••</span><span class="caret"></span><span class="grow"></span>${ic("eye", "sm ter")}</span><button class="ibtn sm primary" title="Join (Enter)">${ic("chev-r")}</button></div>${prow("wifi2", "Nexus-Guest")}${prow("wifi1", "Café Lumen")}`)}`,
  ccFoot([["sync", "Look for networks again"], ["gauge", "Speed test: measure download and upload", true], ["qr", "Share this network: a QR code a phone can scan to join"], ["gear", "Wi-Fi settings"]]), "more");

// DNS servers as a row of icons, the chosen one lit (as WifiDetail.qml has them).
const DNS = [
  ["cloud", "Cloudflare", "Cloudflare: 1.1.1.1, with DNS over TLS", true],
  ["search", "Google", "Google: 8.8.8.8, with DNS over TLS"],
  ["wifi", "Network", "The network's own: whatever the network you're on hands out"],
  ["pen", "Custom", "Custom: your own servers, typed in a terminal"],
];
const ccWifiMore = () => ccDetail("Wi-Fi", sw(true), `
${card(prow("wifi1", "Café Lumen") + prow("wifi1", "Pixel 9 hotspot", "", "", lock), "cut")}
${card(prow("key", "This network wants you to sign in", "Opens its sign-in page", "", ic("chev-r", "ter sm")), "warnc")}
${gl("DNS")}
${card(DNS.map(([i, t, tip, on], k) => `<div class="dnsc ${on ? "on" : ""} ${k === 2 ? "hov" : ""}" title="${tip}">${ic(i)}<span>${t}</span>${k === 2 ? `<span class="dtip">${tip}</span>` : ""}</div>`).join(""), "dnsrow")}
${gl("Band")}
${card(pick("wifi", "Automatic (now 5 GHz)", "", true) + pick("wifi", "2.4 GHz") + pick("wifi", "5 GHz") + pick("wifi", "6 GHz"))}`,
  ccFoot([["sync", "Look for networks again"], ["gauge", "Speed test: measure download and upload"], ["qr", "Share this network: a QR code a phone can scan to join"], ["gear", "Wi-Fi settings"]]), "scrolled");

const forget = (n) => rb("trash", `Forget ${n}: it has to be paired again to connect`);
const ccBluetooth = () => ccDetail("Bluetooth", sw(true), `
${gl("Devices")}
${card(`${prow("headphones", "WH-1000XM5", "Connected · battery 70%", "sel", forget("WH-1000XM5"))}
${prow("mouse", "MX Master 3S", '<span class="warn">Connected · battery 18%</span>', "sel", forget("MX Master 3S"))}
${prow("keyboard", "Keychron K3", "Working…", "hov", forget("Keychron K3"))}
${prow("phone", "Pixel 9", "Battery 64%", "", forget("Pixel 9"))}
${prow("gamepad", "Xbox Wireless Controller", "", "", forget("Xbox Wireless Controller"))}`)}
${gl("Available (looking…)", '<span class="spin"></span>')}
${card(prow("speaker", "JBL Flip 6") + prow("headphones", "Galaxy Buds2", "Pairing…", "hov") + prow("monitor", "Living room TV"))}
<div class="ter xs whint">Click a device to connect or disconnect it; click one nearby to pair. Looking stops when you leave this page.</div>`,
  ccFoot([["sync", "Look for devices again", true], ["gear", "Bluetooth settings"]]));

const ccDevices = () => ccDetail("Devices", "", `
${gl("Asking to pair")}
${card(prow("key", "Galaxy Tab S9", "Compare the key in Settings", "hov", ic("chev-r", "ter sm")))}
${gl("Paired")}
${card(prow("phone", "Pixel 9", "Connected · battery 80%, charging", "sel", rb("paste", "Send the clipboard to Pixel 9") + rb("volume", "Ring Pixel 9, to find it")) + prow("phone", "iPad", "Not connected", "dimrow"))}
<div class="ter xs whint">Phones and tablets paired through Flux. Pairing and what each device may do are in Settings › Connected Devices.</div>`,
  ccFoot([["gear", "Connected Devices settings: pair, and what each device may do", true]]));

const routes = (nord, tor) => card(
  pick("globe", "Direct", "No VPN: traffic goes straight out", !nord && !tor) +
  pick("vpn", "NordVPN", nord ? "Germany Frankfurt · de1047" : "Disconnected", nord) +
  pick("onion", "Tor", tor ? "Standard · exit DE" : "Off", tor));
const ccVpn = () => ccDetail("VPN", sw(true), `
${routes(true, false)}
${gl("NordVPN")}
${card(`${prow("pin", "Location", "Germany", "", rb("chev-d", "Pick a country"))}
${fav("pin", "Fastest", "", false, false)}
${fav("star", "Frankfurt #1047", "Default", true, true)}
${fav("star", "Zurich #312", "", false, true)}
${opt("Kill Switch", "Block the internet whenever the VPN drops", true)}
${opt("Auto-connect", "Connect when the computer starts", false)}
${opt("Threat Protection Lite", "Block ads and malicious sites", true)}
${segRow("pause", "Pause", "Reconnects by itself afterwards", ["5m", "15m", "1h", "24h"], -1)}
${segRow("vpn", "Technology", "NordLynx is the fastest", ["NordLynx", "OpenVPN", "NordWhisper"], 1)}
${segRow("signal", "Protocol", "TCP gets through stricter networks; UDP is faster", ["UDP", "TCP"], 0)}`)}
${gl("Tor")}
${card(pick("onion", "Maximum", "Everything, the local network cut off") + pick("onion", "Standard", "Internet traffic; the local network still works") + pick("onion", "Browser only", "Only apps set to use it; works beside NordVPN") + opt("Bridges", "For networks that block Tor", false, "network"))}
${gl("Connections")}
${card(prow("vpn", "Office (OpenVPN)", "Off", "", sw(false)) + prow("vpn", "Home (WireGuard)", "Off", "", sw(false)))}`,
  ccFoot([["plus", "Set up a VPN, or choose the default one (Settings › Online Accounts)"]]), "more");

const loc = (t, s = "", on = false, c = "") => pick("pin", t, s, on, rb(on ? "starf" : "star", on ? "Remove from favourites" : "Add to favourites", on ? "acc" : ""), c);
const ccVpnLocation = () => ccDetail("VPN", sw(true), `
${card(`<div class="warnrow2">${ic("alert")}<div class="grow"><div class="pt">NordVPN and Tor are both on</div><div class="ps">Pick one to keep</div></div>${rb("vpn", "Keep NordVPN")}${rb("onion", "Keep Tor")}</div>`, "warnc")}
${gl("NordVPN")}
${card(`${prow("pin", "Location", "Germany", "", rb("chev-u", "Pick a country", "acc"))}
${srch("Find a location", "fra")}
${pick("pin", "France", "", false, rb("chev-u", "Show its cities"))}
${loc("Paris", "", false, "indent")}${loc("Marseille", "", false, "indent")}${loc("Strasbourg", "", false, "indent")}
<div class="sublab">CITIES</div>
${loc("Frankfurt, Germany", "Connected", true)}
${loc("Francisco Beltrão, Brazil")}
${fav("pin", "Fastest", "", false, false)}
${fav("star", "Frankfurt #1047", "Default", true, true)}
${fav("star", "Zurich #312", "", false, true)}
${opt("Kill Switch", "Block the internet whenever the VPN drops", true)}
${opt("Auto-connect", "Connect when the computer starts", false)}
${opt("Threat Protection Lite", "Block ads and malicious sites", true)}`)}`,
  ccFoot([["plus", "Set up a VPN, or choose the default one (Settings › Online Accounts)"]]), "more");

const ccVpnTor = () => ccDetail("VPN", sw(true), `
${routes(false, true)}
${gl("Tor")}
${card(`${pick("onion", "Maximum", "Everything, the local network cut off")}
${pick("onion", "Standard", "Internet traffic; the local network still works", true)}
${pick("onion", "Browser only", "Only apps set to use it; works beside NordVPN")}
${prow("pin", "Exit", "DE · 185.220.101.4", "", rb("sync", "New circuit: a new route and exit") + rb("x", "Let Tor choose the exit country"))}
${prow("pin", "Exit country", "Pick where your traffic leaves Tor", "", rb("chev-u", "Choose the exit country", "acc"))}
<div class="sublist">${pick("pin", "DE", "312 exit relays", true)}${pick("pin", "NL", "201 exit relays")}${pick("pin", "US", "188 exit relays")}${pick("pin", "SE", "96 exit relays")}</div>
${prow("clock", "Latency", "412 ms", "", rb("sync", "Measure the latency now"))}
${prow("globe", "Tor browser", "A browser that can reach nothing but Tor", "", rb("chev-r", "Open a Tor-only browser"))}
${opt("Bridges", "For networks that block Tor", false, "network")}
${prow("alert", "Panic", "Stuck offline? Remove every Tor rule now", "dangerrow", rb("stop", "Remove every Tor firewall rule now"))}`)}
${gl("Connections")}
${card(prow("vpn", "Office (OpenVPN)", "Off", "", sw(false)))}`,
  ccFoot([["plus", "Set up a VPN, or choose the default one (Settings › Online Accounts)"]]), "more");

const machine = (i, n, sub, online, send = true) =>
  prow(i, n, sub, online ? "" : "dimrow", rb("copy", `Copy ${n}'s address`) + rb("link", `Copy ${n}'s name`) + (online && send ? rb("send", `Send files to ${n}`) : ""));
const ccTailscale = () => ccDetail("Tailscale", sw(true), `
${srch("Find a machine")}
${card(`${prow("monitor", "nyx-laptop", "100.101.12.4 · ken@github", "sel", rb("copy", "Copy this machine's Tailscale address") + rb("link", "Copy this machine's Tailscale name"))}
${prow("folder", "Receive files", "Files sent to this machine are saved to Downloads", "", rb("folder", "Open Downloads") + sw(true))}`)}
${gl("Exit node")}
${card(`${pick("ethernet", "None", "Internet traffic goes out directly", true)}
${pick("server", "homelab", "Your exit node")}
${pick("pin", "Germany", "8 servers", false, rb("chev-u", "Hide its cities", "acc"))}
${pick("pin", "Berlin", "de-ber-wg-001", false, "", "indent")}${pick("pin", "Frankfurt", "de-fra-wg-004", false, "", "indent")}
${pick("pin", "Sweden", "6 servers", false, rb("chev-d", "Show its cities"))}
${pick("pin", "United States", "24 servers", false, rb("chev-d", "Show its cities"))}`)}
${gl("Machines")}
${card(machine("server", "homelab", "online · 100.88.1.2", true) + machine("phone", "pixel-9", "online · 100.70.3.9", true) + machine("monitor", "work-desktop", "offline · 100.64.8.20", false))}
${gl("Accounts")}
${card(pick("user", "ken@github", "Personal tailnet", true) + pick("user", "design-nexus.org", "ken@design-nex.us"))}`, "", "more");

const ccDisplay = () => ccDetail("Screens", "", `
${gl("Brightness")}
${card(`<div class="cap">Laptop screen</div>${slider("sun", 80, "80%")}<div class="cap">LG UltraFine (2560×1440)</div>${slider("sun", 60, "60%")}`)}
${gl("Scale of the laptop screen")}
<div class="seg seg6"><span title="Everything on this screen at 100% of its size">1×</span><span class="on">1.25×</span><span>1.6×</span><span>2×</span><span>3×</span><span>4×</span></div>
${gl("Text size")}
${card(`<div class="sl"><button class="ibtn sm" title="Back to the standard size (12 px)">${ic("font")}</button>${rail(27)}<span class="pv tnum">12 px</span></div><div class="ter xs whint">The bar, menus, apps and terminals together</div>`)}
${card(prow("monitor", "Laptop screen", "On", "", sw(true)))}`,
  ccFoot([["gear", "Display settings: resolution, arrangement, refresh rate", true]]));

const ccSound = () => ccDetail("Sound", "", `
${gl("Output")}
${card(`<div class="sl big"><button class="ibtn sm" title="Mute">${ic("volume")}</button>${rail(64)}<span class="pv tnum">64%</span></div>`)}
${card(pick("headphones", "WH-1000XM5", "", true) + pick("speaker", "Laptop speakers") + pick("monitor", "LG UltraFine (HDMI)"))}
${gl("Apps")}
${appvol("music", "Music", 80)}
${appvol("browser", "Browser · YouTube", 45)}
${appvol("chat", "Chat · call", 100)}
${gl("Microphone")}
${card(`<div class="sl mic"><button class="ibtn sm" title="Mute the microphone">${ic("mic")}</button>${rail(72)}<span class="pv tnum">72%</span></div>`)}
${card(pick("headphones", "WH-1000XM5 headset", "", true) + pick("mic", "Laptop microphone"))}
<div class="recnow">${ic("record", "xs")}Recording now: Chat, OBS Studio</div>`,
  ccFoot([["gear", "Sound settings", true]], "Scroll on the bar's volume icon to change it"));

const LEVELS = [100, 100, 100, 98, 95, 92, 88, 84, 80, 76, 71, 66, 61, 57, 70, 85, 97, 100, 100, 97, 93, 90, 86, 82];
const ccBattery = () => ccDetail("Battery", "", `
<div class="bigbat"><div class="grow"><div class="bpct tnum">82%</div><div class="dim">On battery, 4 h 10 min left</div></div>${ring(82, 60, "bat")}</div>
${gl("Details")}
${facts([["Using", "9.8 W"], ["Capacity", "76.4 Wh"], ["Charge cycles", "214"], ["Charge limit", "80%"]])}
<div class="ter xs whint">Charging stops inside the limit to spare the battery.</div>
${gl("Power mode")}
${card(pick("leaf", "Power saver", "Longer battery life, slower") + pick("gauge", "Balanced", "The everyday setting", true) + pick("bolt", "Performance", "Fastest; more power, more heat"))}
${gl("Last 24 hours", '<span class="ter xs">Screen on 5 h 12 min</span>')}
<div class="bchart">${LEVELS.map((v, i) => `<b class="${i >= 13 && i <= 17 ? "chg" : ""} ${i === LEVELS.length - 1 ? "last" : ""}" style="height:${v}%"></b>`).join("")}</div>
<div class="baxis ter xs"><span>15:00</span><span>21:00</span><span>03:00</span><span>09:00</span><span>Now</span></div>
${gl("Using significant energy")}
${card(prow(app("browser"), "Browser", "12 tabs", "", '<span class="ter tnum small">18%</span>') + prow(app("code"), "Code", "cargo build", "", '<span class="ter tnum small">9%</span>'))}`,
  ccFoot([["gear", "Power settings: suspend, lid, power button", true]]));

/* ── Media, weather, stats, workspaces, tray, bell, new widgets ───────────────── */
const mediaPop = () => `<div class="mplayers"><span class="chip on">${app("music")}Music</span><span class="chip">${app("browser")}Browser</span><span class="grow"></span><button class="ibtn sm" title="Play on">${ic("cast")}</button></div>
<div class="mhero">${cover(96, "g7", 10)}<div class="grow"><div class="mtitle2">Midnight City</div><div class="dim">M83</div><div class="ter small">Hurry Up, We’re Dreaming · 2011</div></div><button class="ibtn sm acc" title="Love">${ic("heartf")}</button></div>
<div class="seek"><span class="tnum ter xs">1:42</span>${rail(42)}<span class="tnum ter xs">4:03</span></div>
<div class="mbig">${ic("shuffle", "ter")}${ic("prev")}<span class="playb">${ic("pause")}</span>${ic("next")}${ic("repeat", "acc")}</div>
${slider("volume", 80, "", "")}
${gl("Up next", `<span class="link xs">Queue</span>`)}
<div class="qrow">${cover(28, "g10", 5)}<div class="grow"><div class="pt ell small">Wait</div><div class="ps">M83</div></div><span class="ter xs tnum">5:43</span></div>
<div class="qrow">${cover(28, "g5", 5)}<div class="grow"><div class="pt ell small">Outro</div><div class="ps">M83</div></div><span class="ter xs tnum">4:07</span></div>`;

const HOURS = [["15:00", "cloudsun", 58, 0], ["16:00", "cloudsun", 59, 0], ["17:00", "cloud", 57, 10], ["18:00", "storm", 54, 70], ["19:00", "rain", 52, 60], ["20:00", "rain", 50, 40], ["21:00", "moonc", 49, 10], ["22:00", "moonc", 47, 0]];
const DAYS = [["Today", "storm", 46, 62], ["Wed", "rain", 44, 55], ["Thu", "cloud", 41, 52], ["Fri", "sun", 43, 58], ["Sat", "cloudsun", 47, 61]];
const weatherPop = () => `<div class="wtop"><span class="ter small">${ic("pin", "xs")}Chicago · updated 14:20</span><span class="grow"></span><button class="ibtn sm">${ic("sync")}</button></div>
<div class="wnow">${ic("cloudsun", "wbig")}<div><div class="wtemp tnum">57°</div></div><div class="grow"><div class="t500">Partly cloudy</div><div class="dim small">Feels like 54° · H 62° L 46°</div></div></div>
<div class="walert">${ic("alert")}<div class="grow"><div class="t500 small">Severe thunderstorm watch</div><div class="dim xs">18:00 to 23:00 · National Weather Service</div></div></div>
<div class="wchips"><span>${ic("wind", "xs")}14 mph NW</span><span>${ic("droplet", "xs")}62%</span><span>${ic("sun", "xs")}UV 3</span><span>${ic("sunrise", "xs")}16:32</span></div>
${gl("Next hours")}
<div class="hours">${HOURS.map(([t, i, d, r]) => `<div class="hr"><span class="ter xs tnum">${t}</span>${ic(i)}<b class="tnum">${d}°</b><span class="rainp xs tnum">${r ? r + "%" : ""}</span></div>`).join("")}</div>
${gl("5 days")}
<div class="days">${DAYS.map(([d, i, lo, hi]) => `<div class="day"><span class="dn">${d}</span>${ic(i)}<span class="ter tnum">${lo}°</span><span class="rng"><b style="left:${((lo - 38) / 26) * 100}%;right:${100 - ((hi - 38) / 26) * 100}%"></b></span><span class="tnum">${hi}°</span></div>`).join("")}</div>
${pfoot("Open Weather")}`;

const CPU_LONG = [8, 10, 9, 14, 22, 18, 12, 9, 11, 30, 26, 16, 12, 10, 9, 12, 15, 13, 12, 18, 24, 14, 11, 12, 10, 9, 13, 12];
const statsPop = () => `<div class="scard">
  <div class="srow">${ic("cpu")}<b>CPU</b><span class="grow"></span><span class="sbig tnum">12%</span></div>
  ${spark(CPU_LONG, 352, 54, 50, "big")}
  <div class="cores">${[18, 9, 6, 22, 11, 7, 30, 5].map((v) => `<b style="--p:${v * 2.2}%"></b>`).join("")}</div>
  <div class="ter xs">8 cores · 3.2 GHz · 52 °C · fan 2,100 rpm</div>
</div>
<div class="sgrid">
  <div class="scard sm">${ic("memory")}<div class="grow"><div class="srow"><b>Memory</b><span class="grow"></span><span class="tnum">6.6 / 16 GB</span></div>${rail(41)}</div></div>
  <div class="scard sm">${ic("gpu")}<div class="grow"><div class="srow"><b>GPU</b><span class="grow"></span><span class="tnum">8% · 48°</span></div>${rail(8)}</div></div>
  <div class="scard sm">${ic("drive")}<div class="grow"><div class="srow"><b>Disk</b><span class="grow"></span><span class="tnum">312 GB free</span></div>${rail(67)}</div></div>
  <div class="scard sm">${ic("down")}<div class="grow"><div class="srow"><b>Network</b><span class="grow"></span><span class="tnum">2.4 MB/s</span></div>${spark([2, 4, 3, 8, 12, 9, 5, 7, 6, 9, 11, 8], 140, 12, 14)}</div></div>
</div>
${gl("Top processes", '<span class="ter xs">CPU</span>')}
${[["browser", "Browser", "5.2%", "1.9 GB"], ["code", "Code (rust-analyzer)", "3.1%", "1.2 GB"], ["files", "Files", "0.8%", "240 MB"], ["music", "Music", "0.6%", "180 MB"]]
  .map(([a, n, c, m]) => `<div class="proc">${app(a)}<span class="grow ell">${n}</span><span class="ter tnum xs">${m}</span><span class="tnum small pc">${c}</span></div>`).join("")}
${pfoot("Open Activity", '<span class="ter xs">Updates every 3 s</span>')}`;

const wsPop = () => `<div class="wsh"><b>Workspace 1</b><span class="ter small">2 windows</span><span class="grow"></span><span class="kbdk">Super 1</span></div>
<div class="wsthumb"><div class="tw" style="--sw:var(--sw-blue)">${app("browser")}</div><div class="tw" style="--sw:var(--sw-graphite)">${app("terminal")}</div></div>
${prow(app("browser"), "GitHub — design-nexus/nyx-bar", "Browser", "hov")}
${prow(app("terminal"), "~/Projects/nyx-bar — cargo build", "Terminal")}
<div class="ter xs whint">Click to go there · scroll to move along · drop a window here to move it</div>`;

const trayPop = () => `<div class="trgrid">${["onepass", "syncthing", "kdeconnect", "obs", "solaar"].map((k, i) => `<span class="trc ${i === 0 ? "hov" : ""}">${tray(k)}<small>${TRAY[k][2]}</small></span>`).join("")}</div>
<div class="ter xs trhint">Drag an icon onto the bar to keep it there</div>`;
const trayMenu = () => `<div class="menu">
<div class="mi">${tray("discord")}<b>Discord</b></div><div class="msep"></div>
<div class="mi hov">Open Discord</div><div class="mi">${ic("mic")}Mute</div><div class="mi">${ic("headphones")}Deafen</div><div class="msep"></div>
<div class="mi">Check for updates</div><div class="mi">Quit Discord</div></div>`;

const bellMenu = () => `<div class="menu">
<div class="mi hov">${ic("moon")}Do not disturb<span class="grow"></span>${ic("chev-r", "ter sm")}</div>
<div class="sub"><div class="mi">For 1 hour</div><div class="mi">Until tomorrow morning</div><div class="mi">Until I turn it off</div></div>
<div class="msep"></div>
<div class="mi">${ic("x")}Clear 3 notifications</div>
<div class="mi">${ic("gear")}Notification settings</div></div>`;

const privPop = () => `${phead("shield", "In use now", "")}
${prow("mic", "Chat is using the microphone", "Since 14:05", "warnrow", '<button class="btn sm">Mute</button>')}
${prow("screenshare", "OBS Studio is sharing your screen", "Whole screen · since 14:20", "sharerow", '<button class="btn sm">Stop</button>')}
${gl("Recently")}
${prow("camera", "Browser used the camera", "meet.example.com · 9:30 to 9:45", "")}
${pfoot("Privacy settings")}`;
P.shield = '<path d="M12 21s7.5-3.6 7.5-9.5V5.5L12 3 4.5 5.5v6C4.5 17.4 12 21 12 21z"/>';
const kbdMenu = () => `<div class="menu">
<div class="mi hov"><span class="kbd">EN</span>English (US)<span class="grow"></span>${ic("check", "acc sm")}</div>
<div class="mi"><span class="kbd">DE</span>Deutsch</div>
<div class="mi"><span class="kbd">あ</span>Japanese (Mozc)</div>
<div class="msep"></div><div class="mi ter">Switch with Super+Space</div>
<div class="mi">${ic("keyboard")}Keyboard settings</div></div>`;

/* ── Bar directions ───────────────────────────────────────────────────────────── */
const vsep = () => `<span class="vsep"></span>`;
const BARS = {
  current: () => `<div class="nbar d-cur">
  <div class="sec l">${ws.numbers()}</div>
  <div class="sec c">${it(clock.plain(), "i-clock")}</div>
  <div class="sec r">${it(`${tray("discord")}${tray("nextcloud")}${tray("steam")}`, "i-tray", "trayit")}${it(media.old(), "i-media")}${it(weather.old(), "i-weather")}${it(stats.old(), "i-stats")}${status.net()}${status.bt()}${status.vol()}${it(batt(82), "i-bat")}${bell(3)}${cc()}</div>
</div>`,

  a: (o = {}) => `<div class="nbar d-a ${o.cls || ""}">
  <div class="sec l">${o.left ?? `<div class="grp">${it(logo(), "i-logo", "logoit")}${it(ws.pills(), "i-ws", "wsit")}</div>${winTitle()}`}</div>
  <div class="sec c">${o.center ?? `<div class="grp">${it(clock.next(), "i-clock")}</div>`}</div>
  <div class="sec r">${o.extra || ""}${o.right ?? `<div class="grp">${it(media.compact(), "i-media")}</div><div class="grp">${it(weather.basic(), "i-weather")}${it(stats.spark(), "i-stats")}</div>${trayItems()}<div class="grp">${status.group()}</div><div class="grp">${bell(3)}</div>`}</div>
</div>`,

  b: () => `<div class="nbar d-b">
  <div class="sec l">${it(logo(), "i-logo", "logoit")}${it('<b class="appname">Files</b>', "i-win")}${it('<span class="dim ell wt">~/Projects/nyx-bar</span>')}${vsep()}${it(ws.dots(), "i-ws", "wsit")}</div>
  <div class="sec c"></div>
  <div class="sec r">${trayItems(["discord", "nextcloud", "steam"], false)}${it(media.minimal(), "i-media")}${it(weather.basic(), "i-weather")}${it(`${batt(82)}<span class="tnum">82%</span>`, "i-bat")}${it(ic("wifi"), "i-net")}${it(ic("volume"), "i-vol")}${it(`${ic("bell")}<span class="bdot"></span>`, "i-bell", "bellit")}${it(clock.mac(), "i-clock")}</div>
</div>`,

  c: () => `<div class="nbar d-c">
  <div class="sec l"><div class="island">${it(logo(), "i-logo", "logoit")}${it(ws.icons(), "i-ws", "wsit")}</div></div>
  <div class="sec c"><div class="island">${it(clock.strong(), "i-clock")}<span class="isep"></span>${it(media.compact(), "i-media")}</div></div>
  <div class="sec r"><div class="island">${trayItems(["discord", "nextcloud", "steam"], true)}<span class="isep"></span>${it(stats.rings(), "i-stats")}${it(weather.basic(), "i-weather")}<span class="isep"></span>${status.net()}${status.bt()}${status.vol()}${status.bat()}<span class="isep"></span>${bell(3)}</div></div>
</div>`,

  d: () => `<div class="nbar d-d">
  <div class="sec l">${it(logo(), "i-logo", "logoit")}${it(ws.pills(), "i-ws", "wsit")}${winTitle()}</div>
  <div class="sec c"><div class="isl" id="i-clock">${cover(20, "g7", 10)}<b class="tnum">14:32</b><span class="dim">Tue 10</span>${eq()}</div></div>
  <div class="sec r">${it(weather.basic(), "i-weather")}${it(stats.spark(), "i-stats")}${trayItems()}${status.net()}${status.bt()}${status.vol()}${status.bat()}${bell(3)}</div>
</div>`,

  e: () => `<div class="nbar d-e">
  <div class="sec l">${it(logo(), "i-logo", "logoit")}${it(ws.accent(), "i-ws", "wsit")}${vsep()}${winTitle()}</div>
  <div class="sec c">${it(clock.next(), "i-clock")}</div>
  <div class="sec r">${it(media.compact(), "i-media")}${vsep()}${it(weather.basic(), "i-weather")}${it(stats.spark(), "i-stats")}${vsep()}${trayItems()}${vsep()}${status.net()}${status.bt()}${status.vol()}${status.bat()}${vsep()}${bell(3)}</div>
</div>`,

  f: () => `<div class="nbar d-f">
  <div class="sec l">${it(logo(), "i-logo", "logoit")}${it(ws.underline(), "i-ws", "wsit")}</div>
  <div class="sec c">${it(clock.omarchy(), "i-clock")}</div>
  <div class="sec r">${trayItems(["discord", "nextcloud"], true)}${vsep()}${it(`${ic("box")}<span class="xs">3</span>`, "i-upd", "", "3 updates")}${it(weather.basic(), "i-weather")}${vsep()}${status.bt()}${status.net()}${status.vol()}${vsep()}${it(ic("cpu"), "i-stats")}${status.bat()}${vsep()}${bell(3)}</div>
</div>`,
};

// The island grown downward over the windows: media, or an incoming notification.
const islandMedia = () => `<div class="isl-big media">
  <div class="ib-row">${cover(64, "g7", 14)}<div class="grow"><div class="ib-t">Midnight City</div><div class="ib-s">M83 · Music</div></div>${eq("big")}</div>
  <div class="seek"><span class="tnum xs">1:42</span>${rail(42)}<span class="tnum xs">-2:21</span></div>
  <div class="mbig">${ic("shuffle")}${ic("prev")}<span class="playb">${ic("pause")}</span>${ic("next")}${ic("cast")}</div>
</div>`;
const islandNotify = () => `<div class="isl-big notify">
  <div class="ib-row">${app("chat", "lg")}<div class="grow"><div class="ib-t">Sam Rivera <span class="ib-s">· Chat · now</span></div><div class="ib-s">Running 5 min late for the review, start without me?</div></div></div>
  <div class="ib-acts"><span class="ibb">${ic("reply", "sm")}Reply</span><span class="ibb">Mark as read</span><span class="ibb">${ic("belloff", "sm")}Mute Sam</span></div>
</div>`;

/* ── Page runtime ─────────────────────────────────────────────────────────────── */
// A popover: placed under the item with id `at` once laid out. align: center|left|right.
const pop = (inner, at, w, align = "center", c = "") => `<div class="pop ${c}" data-at="${at}" data-align="${align}" style="width:${w}px">${inner}</div>`;

function fakeWindows() {
  const lines = (n) => Array.from({ length: n }, () => "<span></span>").join("");
  return `<div class="wins">
  <div class="tile focus">
    <div class="th">${app("files")}<b>nyx-bar</b><span class="ph"></span><span class="grow"></span><span class="ph short"></span></div>
    <div class="ts"><span></span><span class="sel"></span><span></span><span></span><span></span><span></span></div>
    <div class="tc">${lines(14)}</div>
  </div>
  <div class="tile">
    <div class="th">${app("notes")}<b>Bar ideas</b><span class="grow"></span><span class="ph short"></span></div>
    <div class="ts"><span></span><span></span><span class="sel"></span><span></span></div>
    <div class="tc lines">${lines(9)}</div>
  </div>
  <div class="tile term"><pre><b class="pr">ken@nyx</b> <i>~/Projects/nyx-bar</i> $ cargo build --release
   Compiling nyx-plugin-view v0.4.0
   Compiling nyx-bar v0.3.0 (apps/bar)
    Finished release [optimized] in 41.2s
<b class="pr">ken@nyx</b> <i>~/Projects/nyx-bar</i> $ nyx plugin list
nyx.workspaces   bar     on   2.1 MB
nyx.clock        bar     on   interval 60 s
nyx.system       bar     on   3.4 MB
<b class="pr">ken@nyx</b> <i>~/Projects/nyx-bar</i> $ <span class="cur"></span></pre></div>
</div>`;
}

function place() {
  const bar = document.querySelector(".desk > .nbar");
  const barBottom = bar ? bar.getBoundingClientRect().bottom : 0;
  document.documentElement.style.setProperty("--top", `${barBottom}px`);
  document.querySelectorAll("[data-at]").forEach((p) => {
    const a = document.getElementById(p.dataset.at);
    if (!a) return;
    a.classList.add("open");
    const r = a.getBoundingClientRect(), w = p.offsetWidth, al = p.dataset.align;
    let left = al === "left" ? r.left - 4 : al === "right" ? r.right - w + 4 : r.left + r.width / 2 - w / 2;
    left = Math.max(8, Math.min(innerWidth - w - 8, left + +(p.dataset.dx || 0)));
    p.style.left = `${left}px`;
    p.style.top = `${Math.max(barBottom, r.bottom) + +(p.dataset.gap || 6)}px`;
  });
  document.querySelectorAll("[data-hov]").forEach((h) => document.getElementById(h.dataset.hov)?.classList.add("hov"));
}

function switcher() {
  const screens = (ROOT.dataset.screens || "").split(",").filter(Boolean);
  const link = (k, v, label) => {
    const p = new URLSearchParams(location.search);
    p.set(k, v);
    const on = (Q.get(k) || { theme: "dark", screen: SCREEN }[k]) === v;
    return `<a class="${on ? "on" : ""}" href="?${p}">${label}</a>`;
  };
  const nav = document.createElement("nav");
  nav.className = "mock-switch";
  nav.innerHTML = screens.map((s) => link("screen", s, s)).join("") + "<span></span>" + link("theme", "dark", "Dark") + link("theme", "light", "Light") + '<span></span><a href="index.html">Gallery</a>';
  document.body.append(nav);
}

function mount(markup) {
  document.body.innerHTML = markup;
  if (!SHOT) switcher();
  document.fonts.ready.then(() => requestAnimationFrame(place));
  addEventListener("resize", place);
}

// Small TOML highlighter for the bar.toml presets.
const toml = (src) =>
  esc(src)
    .split("\n")
    .map((l) =>
      l
        .replace(/("[^"]*")/g, '<span class="ts">$1</span>')
        .replace(/^(\[[^\]]+\])/, '<span class="tk">$1</span>')
        .replace(/^(\w[\w-]*)( =)/, '<span class="tk">$1</span>$2')
        .replace(/(#.*)$/, '<span class="tc">$1</span>')
    )
    .join("\n");
