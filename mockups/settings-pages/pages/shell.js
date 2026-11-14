// The Settings window every page sits in: the two-level layout Ken picked (revamp option A):
// the sections in the sidebar in their colours, each section's pages as tabs under its name.
// Functions only: the gallery loads this file without the kit.
"use strict";

const SECS = [
  ["connections", "Connections", "wifi", [["wifi", "Wi-Fi"], ["bluetooth", "Bluetooth"], ["phone", "Connected Devices"], ["network", "Network"], ["server", "Mounts"], ["share", "Sharing"]]],
  ["hardware", "Hardware", "monitor", [["monitor", "Displays"], ["volume", "Sound"], ["battery", "Power & Battery"], ["lock", "Lock Screen"], ["printer", "Printers"], ["drive", "Disks"]]],
  ["personalization", "Personalization", "palette", [["palette", "Appearance"], ["window", "Window Style"], ["bar", "Bar & Notifications"], ["puzzle", "Bar Plugins"], ["moon", "Night Light"]]],
  ["desktop", "Desktop", "grid", [["dock", "Dock"], ["switcher", "Switcher"], ["sliders", "Control Center"], ["bell", "Notifications"], ["grid", "Tiling & Workspaces"], ["layers", "Workspace Profiles"], ["keyboard", "Keyboard Shortcuts"], ["startup", "Startup & Rules"], ["screenshot", "Capture & Tools"]]],
  ["input", "Input", "keyboard", [["keyboard", "Keyboard"], ["mouse", "Mouse"], ["touchpad", "Trackpad"]]],
  ["accounts", "Accounts", "user", [["users", "Users"], ["shield", "Sign-in & Security"], ["cloud", "Online Accounts"]]],
  ["assistant", "Assistant & AI", "sparkle", [["sparkle", "Assistant"], ["aura", "Aura"], ["mic", "Voice"], ["shield", "Permissions"], ["history", "Activity"], ["pulse", "Performance"], ["cpu", "Local AI"], ["cube", "Models"]]],
  ["system", "System", "cog", [["globe", "Time & Language"], ["power", "Boot & Login"], ["apps", "Default Apps"], ["store", "Software"], ["download", "Updates"], ["server", "Services"], ["puzzle", "Extensions"], ["nyxapp", "Nyx apps"], ["info", "About"]]],
];
const SEC = Object.fromEntries(SECS.map((s) => [s[0], s]));

/** An icon on a tile in its section's colour. */
const T = (ic, sec) => `<i data-i="${ic}" class="ctile" style="--tc:var(--sec-${sec})"></i>`;
/** A slider, 0–100. */
const slider = (pct, w = 200) => `<div class="slider" style="width:${w ? w + "px" : "auto"}"><div class="tr"><div class="fill" style="width:${pct}%"></div></div><div class="kn" style="left:${pct}%"></div></div>`;
/** A slider with its readout. */
const sl = (pct, val, w) => `<span class="slw">${slider(pct, w)}<span class="readout">${val}</span></span>`;

/** The header: the app, the sidebar button, search across everything. */
const shdr = (o = {}) => `<header class="hdr"><div class="hdr-id">${icon("cog", "app-ic")}<span class="app-name">Settings</span></div><div class="hdr-start">${ib("sidebar", "Sidebar (Ctrl+B)")}${o.start || ""}</div><div class="hdr-center">${o.center !== undefined ? o.center : search("Search all settings", "Ctrl F", "wide")}</div><div class="hdr-end">${o.end || ""}</div></header>`;

/** The sidebar: Home, then the sections with their first pages. */
const sside = (on) => `
  <div class="navx cat first ${on === "home" ? "active" : ""}">${T("home", "home")}<span class="ct"><b>Home</b><small>This computer and updates</small></span><span class="badge">12</span></div>
  ${SECS.map(([id, name, ic, pages]) => `<div class="navx cat ${on === id ? "active" : ""}">${T(ic, id)}<span class="ct"><b>${name}</b><small>${pages.slice(0, 3).map((p) => p[1]).join(", ")}</small></span></div>`).join("")}
  <div class="foot">${icon("history")}<span>Your changes · 23 settings</span></div>`;

/** The page head: the section in its colour, the page's name and what it's for, the tabs. */
const shead = (sec, on, desc, end = "") => {
  const [, name, , pages] = SEC[sec];
  return `<div class="shead" style="--sc:var(--sec-${sec})">
    <div class="sh1"><span class="sk">${name}</span><span class="sp"></span>${end}${btn("Open config", "ghost sm", "file-text")}</div>
    <div class="sh2"><b>${on}</b><span>${desc}</span></div>
    <div class="stabs">${pages.map(([, t]) => `<span class="${t === on ? "on" : ""}">${t}</span>`).join("")}</div></div>`;
};

/** A whole Settings window on one page: o = { sec, page, desc, body, hdr, over, end }. */
const swin = (o) => win({ hdr: o.hdr || shdr(), side: sside(o.sec), page: `${shead(o.sec, o.page, o.desc, o.end)}${o.body}`, over: o.over || "" });

/** A row in a card: [title, desc, control], with an optional leading icon on a soft tile. */
const orow = (t, d = "", c = "", o = {}) => `<div class="opt ${o.cls || ""}">${o.ic ? `<span class="lic" style="--tc:var(--sec-${o.sec || "hardware"})">${icon(o.ic)}</span>` : ""}<div class="opt-text"><div>${t}</div>${d ? `<div class="d">${d}</div>` : ""}</div>${c}</div>`;
/** A row that opens a page one level down. */
const nrow = (t, d = "", v = "", o = {}) => orow(t, d, `${v ? `<span class="rv">${v}</span>` : ""}${icon("chev-r", "cv")}`, { ...o, cls: `onav ${o.cls || ""}` });
/** A card of rows under an optional heading. */
const ocard = (heading, rows, o = {}) => `${heading ? `<div class="gtitle ${o.first ? "first" : ""} ${o.act ? "gflex" : ""}">${heading}${o.act ? `<span class="sp"></span>${o.act}` : ""}${o.note ? `<span class="note">${o.note}</span>` : ""}</div>` : ""}<div class="card ${o.cls || ""}">${rows.join("")}</div>`;
/** Wi-Fi signal bars, 1–4. */
const bars4 = (n) => `<span class="sig4">${[1, 2, 3, 4].map((i) => `<b class="${i <= n ? "on" : ""}" style="height:${3 + i * 3}px"></b>`).join("")}</span>`;
/** A key combination as keycaps. */
const keys = (...k) => `<span class="kc">${k.map(kbd).join("")}</span>`;
/** A level meter, 0–100. */
const meter = (pct, n = 24) => `<span class="lvl">${Array.from({ length: n }, (_, i) => `<b class="${i < (pct / 100) * n ? "on" : ""} ${i >= n * 0.8 ? "hi" : ""}"></b>`).join("")}</span>`;
/** The equalizer curve as an SVG through nine band gains (dB, −12…+12). */
const eqCurve = (gains, { w = 420, h = 140, handles = true } = {}) => {
  const pad = Math.min(12, h * 0.12), mx = Math.min(14, w * 0.04);
  const n = gains.length, x = (i) => mx + (i * (w - 2 * mx)) / (n - 1), y = (g) => h / 2 - (g / 6) * (h / 2 - pad) * (h < 60 ? 1 : 0.5);
  const pts = gains.map((g, i) => [x(i), y(g)]);
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 1; i < n; i++) { const [x0, y0] = pts[i - 1], [x1, y1] = pts[i], cx = (x0 + x1) / 2; d += ` C${cx},${y0} ${cx},${y1} ${x1},${y1}`; }
  const grid = [-12, -6, 0, 6, 12].map((g) => `<line x1="0" x2="${w}" y1="${y(g)}" y2="${y(g)}" class="${g === 0 ? "z" : ""}"/>`).join("");
  return `<svg class="eqc" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" preserveAspectRatio="none">${handles ? grid : ""}<path d="${d} L${w - mx},${h} L${mx},${h}Z" class="fillp"/><path d="${d}" class="line"/>${handles ? pts.map(([a, b]) => `<circle cx="${a}" cy="${b}" r="5"/>`).join("") : ""}</svg>`;
};
/* ── Style B (Ken's pick): controls on the left, a live picture of what they change on the right ── */
/** The page body: `ctl` (cards of controls) beside `pv` (the preview). o = { sec, cls, ctlw }. At 800 px the preview sits above. */
const split = (ctl, pv, o = {}) => `<div class="split2 ${o.cls || ""}"${o.ctlw ? ` style="--ctlw:${o.ctlw}px"` : ""}><div class="ctl"><div class="ci">${ctl}</div></div><div class="pv" style="--tc:var(--sec-${o.sec || "hardware"})">${pv}</div></div>`;
/** The preview's heading: title, a line under it, controls on the right. */
const pvhead = (t, s, end = "") => `<div class="pvh"><div><b>${t}</b><span>${s}</span></div><span class="sp"></span>${end}</div>`;
/** A line of notes at the foot of the preview. */
const pvfoot = (text, ic = "check-c", end = "") => `<div class="pvfoot">${icon(ic)}<span>${text}</span><span class="sp"></span>${end}</div>`;
const radio = (on) => `<span class="rad ${on ? "on" : ""}"></span>`;
const chk = (on) => `<span class="cbx sq ${on ? "done" : ""}">${on ? icon("check") : ""}</span>`;
/** A wallpaper-like gradient from a seed. */
const wall = (seed) => { const n = hash(seed); return `linear-gradient(${140 + (n % 40)}deg, color-mix(in srgb, var(--sw-${SW[n % 8]}) 60%, #10121a), color-mix(in srgb, var(--sw-${SW[(n >>> 3) % 8]}) 45%, #0b0c11))`; };
/** A screen drawn with a wallpaper, a bar and two windows; o = { sel, main, seed, style }. */
const screenArt = (name, res, o = {}) => `<div class="scr2 ${o.sel ? "sel" : ""}" style="${o.style || ""}"><div class="glass" style="background:${wall(o.seed || name)}"><span class="mb"></span><span class="mw"></span><span class="mw b"></span></div>${name ? `<div class="lbl"><b>${name}</b><span>${res}</span></div>` : ""}${o.main ? `<span class="main">${icon("star")}Main</span>` : ""}</div>`;

/* ── NyxOS: twelve categories (platform/nyxos/layout.rs), coloured as the groups they come from ── */
const NSECS = [
  ["accounts", "Accounts", "user", "accounts", [["cloud", "Accounts"]]],
  ["appearance", "Appearance", "palette", "personalization", [["palette", "Appearance"], ["window", "Window Style"], ["bar", "Bar"]]],
  ["displays", "Displays", "monitor", "hardware", [["monitor", "Displays"], ["moon", "Night Light"]]],
  ["desktop", "Desktop", "grid", "desktop", [["puzzle", "Bar Plugins"], ["dock", "Dock"], ["switcher", "Switcher"], ["sliders", "Control Center"], ["bell", "Notifications"], ["grid", "Tiling & Workspaces"], ["layers", "Workspace Profiles"], ["startup", "Startup & Rules"], ["screenshot", "Capture & Tools"]]],
  ["input", "Input", "keyboard", "input", [["keyboard", "Keyboard"], ["mouse", "Mouse"], ["touchpad", "Trackpad"], ["keyboard", "Keyboard Shortcuts"]]],
  ["network", "Network", "wifi", "connections", [["wifi", "Wi-Fi"], ["bluetooth", "Bluetooth"], ["phone", "Connected Devices"], ["network", "Network"], ["share", "Sharing"]]],
  ["sound", "Sound", "volume", "hardware", [["volume", "Sound"]]],
  ["power", "Power", "battery", "hardware", [["battery", "Power & Battery"]]],
  ["security", "Security", "shield", "accounts", [["shield", "Sign-in & Security"], ["lock", "Lock Screen"]]],
  ["apps", "Apps & Defaults", "apps", "system", [["apps", "Default Apps"], ["store", "Software"], ["puzzle", "Extensions"], ["sparkle", "Assistant"], ["cpu", "Local AI"]]],
  ["storage", "Storage & Backup", "drive", "hardware", [["server", "Mounts"], ["drive", "Disks"]]],
  ["system", "System", "cog", "system", [["globe", "Time & Language"], ["power", "Boot & Sign-in"], ["server", "Services"], ["printer", "Printers"], ["download", "Updates"], ["info", "About"]]],
];
const NSEC = Object.fromEntries(NSECS.map((s) => [s[0], s]));
/** NyxOS's sidebar. */
const nside = (on) => `
  <div class="navx cat first ${on === "home" ? "active" : ""}">${T("home", "home")}<span class="ct"><b>Home</b><small>This computer and updates</small></span><span class="badge">3</span></div>
  ${NSECS.map(([id, name, ic, col, pages]) => `<div class="navx cat ${on === id ? "active" : ""}">${T(ic, col)}<span class="ct"><b>${name}</b><small>${pages.slice(0, 3).map((p) => p[1]).join(", ")}</small></span></div>`).join("")}`;
/** NyxOS's page head: its category in its colour, the page, the category's pages as tabs. */
const nhead = (cat, on, desc, end = "") => {
  const [, name, , col, pages] = NSEC[cat];
  return `<div class="shead" style="--sc:var(--sec-${col})">
    <div class="sh1"><span class="sk">${name}</span><span class="sp"></span>${end}</div>
    <div class="sh2"><b>${on}</b><span>${desc}</span></div>
    ${pages.length > 1 ? `<div class="stabs">${pages.map(([, t]) => `<span class="${t === on ? "on" : ""}">${t}</span>`).join("")}</div>` : '<div class="stabs"></div>'}</div>`;
};
/** A NyxOS Settings window: o = { cat, page, desc, body, hdr, over, end }. */
const nwin = (o) => win({ hdr: o.hdr || shdr(), side: nside(o.cat), page: `${nhead(o.cat, o.page, o.desc, o.end)}${o.body}`, over: o.over || "" });

/* ── Round 3: a control's design up close ──
 * o = { sec, page, desc, rows (the left column), title, spec, idea, states: [[label, html]],
 *       zoom (how much the states are enlarged), n (states a row), real: [[label, html]] (at real size; the last
 *       one is today's when o.today), extra, foot } */
const ctlSpec = (o) => swin({ sec: o.sec || "desktop", page: o.page, desc: o.desc, body: split(o.rows, `
  ${pvhead(`${o.title}, up close`, o.spec)}
  <div class="card spk2" style="--zoom:${o.zoom || 2.4};--n:${o.n || o.states.length}"><div class="spr">${o.states.map(([l, h]) => `<div class="spc"><div class="big">${h}</div><small>${l}</small></div>`).join("")}</div></div>
  <div class="card spk3">${o.real.map(([l, h], i) => `<div class="sl1 ${o.today && i === o.real.length - 1 ? "was" : ""}"><b>${l}</b><span>${h}</span></div>`).join("")}</div>
  ${o.extra || ""}<p class="spidea">${o.idea}</p>${o.foot ? pvfoot(o.foot, "info") : ""}`, { sec: o.sec || "desktop" }) });

const EQ_BANDS = ["31", "62", "125", "250", "500", "1k", "2k", "4k", "8k"];
const EQ_LOUD = [5, 4, 2, 0, -1, 0, 2, 4, 5];

const SHELL_ICONS = {
  cog: '<circle cx="12" cy="12" r="3"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1"/>',
  bar: '<rect x="3" y="4" width="18" height="16" rx="2.5"/><path d="M3 8.5h18M6.5 6.2h3"/>',
  puzzle: '<path d="M9 4.5a2 2 0 0 1 4 0V6h4v4h1.5a2 2 0 0 1 0 4H17v4.5H5V14h1.5a2 2 0 0 0 0-4H5V6h4z"/>',
  dock: '<rect x="3" y="4" width="18" height="16" rx="2.5"/><rect x="7" y="15" width="10" height="2.5" rx="1"/>',
  switcher: '<rect x="3" y="7" width="8" height="10" rx="1.5"/><rect x="13" y="7" width="8" height="10" rx="1.5"/>',
  startup: '<path d="M12 3.5c3 2 4.5 5 4.5 9l-2 3h-5l-2-3c0-4 1.5-7 4.5-9z"/><circle cx="12" cy="10" r="1.5"/><path d="M9.5 18.5 12 21l2.5-2.5"/>',
  screenshot: '<path d="M4 8V5.5A1.5 1.5 0 0 1 5.5 4H8M16 4h2.5A1.5 1.5 0 0 1 20 5.5V8M20 16v2.5a1.5 1.5 0 0 1-1.5 1.5H16M8 20H5.5A1.5 1.5 0 0 1 4 18.5V16"/><rect x="8" y="9" width="8" height="6" rx="1"/>',
  touchpad: '<rect x="3.5" y="4.5" width="17" height="15" rx="2.5"/><path d="M3.5 15h17M12 15v4.5"/>',
  aura: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/>',
  pulse: '<path d="M3 12h4l2.5-6 5 12 2.5-6h4"/>',
  cpu: '<rect x="6" y="6" width="12" height="12" rx="2"/><rect x="9.5" y="9.5" width="5" height="5" rx="1"/><path d="M9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3"/>',
  cube: '<path d="m12 3 8 4.5v9L12 21l-8-4.5v-9z"/><path d="m4 7.5 8 4.5 8-4.5M12 12v9"/>',
  apps: '<rect x="4" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5"/><circle cx="16.75" cy="16.75" r="3.25"/>',
  store: '<path d="M5 8h14l-1 12H6z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/>',
  nyxapp: '<path d="M20 13.5A8 8 0 1 1 10.5 4a6.5 6.5 0 0 0 9.5 9.5z"/><path d="M16 4.5v3M14.5 6h3"/>',
  speaker: '<rect x="6" y="3" width="12" height="18" rx="2.5"/><circle cx="12" cy="14.5" r="3.2"/><circle cx="12" cy="7.5" r="1.3"/>',
  headphones: '<path d="M4 15v-3a8 8 0 0 1 16 0v3"/><rect x="3.5" y="14" width="4" height="6.5" rx="1.5"/><rect x="16.5" y="14" width="4" height="6.5" rx="1.5"/>',
  laptop: '<rect x="5" y="5" width="14" height="10" rx="1.5"/><path d="M3 18.5h18"/>',
  mute: '<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="m16 9.5 5 5M21 9.5l-5 5"/>',
  rotate: '<path d="M20 12a8 8 0 1 1-2.3-5.6"/><path d="M20 4v4h-4"/>',
  scale: '<path d="M4 20 20 4M14 4h6v6M10 20H4v-6"/>',
  qr: '<rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><path d="M14 14h2v2h-2zM18 14h2M14 18h2M18 18h2v2"/>',
  warn: '<path d="M12 3.5 2.5 20h19z"/><path d="M12 10v4.5M12 17.5h.01" stroke-width="1.9"/>',
  pkg: '<path d="m12 3 8 4.5v9L12 21l-8-4.5v-9z"/><path d="m4 7.5 8 4.5 8-4.5M12 12v9M8 5.2l8 4.6"/>',
  chip: '<rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3"/>',
  hist: '<path d="M3.5 12a8.5 8.5 0 1 0 2.5-6"/><path d="M3.5 4v4.5H8M12 7.5V12l3 2"/>',
  wrench: '<path d="M14.5 6.5a4 4 0 0 0-5.3 5.3L4 17l3 3 5.2-5.2a4 4 0 0 0 5.3-5.3l-2.5 2.5-2.5-.5-.5-2.5z"/>',
  wifi1: '<path d="M12 18.5h.01" stroke-width="2.6"/><path d="M8.5 15a5 5 0 0 1 7 0"/>',
  eye2: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',
  conflict: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5v5M12 16h.01" stroke-width="1.9"/>',
  cmdk: '<path d="M9 6.5A2.5 2.5 0 1 0 6.5 9H9zM9 9h6v6H9zM15 6.5A2.5 2.5 0 1 1 17.5 9H15zM9 17.5A2.5 2.5 0 1 1 6.5 15H9zM15 17.5a2.5 2.5 0 1 0 2.5-2.5H15z"/>',
  "swipe-lr": '<path d="M4 12h16M7.5 8.5 4 12l3.5 3.5M16.5 8.5 20 12l-3.5 3.5"/>',
};
