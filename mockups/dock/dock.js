// Nyx Dock mockups: the dock's apps, folders and Trash, each dock look, and what opens
// above it. Built on the bar mockups' parts (../bar/parts.js: icons, the bar, mount).
"use strict";

/* ── Icons the bar mockups don't have ─────────────────────────────────────────── */
Object.assign(P, {
  trash: '<path d="M4 6.5h16M9.5 6.5V4.5h5v2M6 6.5l1 13a1.5 1.5 0 0 0 1.5 1.4h7a1.5 1.5 0 0 0 1.5-1.4l1-13M10 10.5v6M14 10.5v6"/>',
  eject: '<path d="M12 4 4.5 13.5h15z"/><path d="M5 18.5h14"/>',
  usb: '<rect x="7" y="9" width="10" height="12.5" rx="2"/><path d="M9 9V3.5h6V9M10.5 6h.01M13.5 6h.01"/>',
  dl: '<path d="M12 3.5v12M7 11l5 5 5-5M4.5 20.5h15"/>',
  apps: '<rect x="4" y="4" width="6" height="6" rx="1.6"/><rect x="14" y="4" width="6" height="6" rx="1.6"/><rect x="4" y="14" width="6" height="6" rx="1.6"/><rect x="14" y="14" width="6" height="6" rx="1.6"/>',
  history: '<path d="M3.5 12a8.5 8.5 0 1 0 2.5-6"/><path d="M3.5 4v4.5H8M12 7.5V12l3 2"/>',
  min: '<path d="M5 18.5h14"/>',
  eye: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',
  file: '<path d="M14 3.5H7.5A2 2 0 0 0 5.5 5.5v13a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2V8z"/><path d="M14 3.5V8h4.5"/>',
  image: '<rect x="3.5" y="4.5" width="17" height="15" rx="2.5"/><circle cx="9" cy="10" r="1.8"/><path d="m20.5 16-5-5-9 8.5"/>',
  zoom: '<circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.4-4.4M8.5 11h5M11 8.5v5"/>',
  sort: '<path d="M7 4v16M3.5 16.5 7 20l3.5-3.5M17 20V4M13.5 7.5 17 4l3.5 3.5"/>',
  list: '<path d="M8.5 6h12M8.5 12h12M8.5 18h12M3.5 6h.01M3.5 12h.01M3.5 18h.01" stroke-width="1.8"/>',
  fan: '<path d="M12 20.5 5 7.5M12 20.5l7-13M12 20.5V5"/>',
  newwin: '<rect x="3.5" y="5" width="17" height="14" rx="2.5"/><path d="M3.5 9h17M12 12v4.5M9.75 14.25h4.5"/>',
  star: '<path d="m12 3.5 2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.8l-5.2 2.8 1-5.8-4.3-4.1 5.9-.8z"/>',
  sparkle: '<path d="M12 3.5v4M12 16.5v4M3.5 12h4M16.5 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18"/>',
});

/* ── App icons ────────────────────────────────────────────────────────────────── */
// Nyx apps: their real icons (crates/nyx-icons). Others: drawn in the same satin style.
const NYX = (n) => `<img class="ai" src="../../crates/nyx-icons/apps/io.github.design_nexus.nyx.${n}.svg" alt="">`;
const TP = (g, c) => `<span class="ai tp" style="--c:${c}"><span>${ic(g)}</span></span>`;

const DOCK = {
  files: { i: NYX("Files"), n: "Files", w: 2, focus: true },
  browser: { i: TP("globe", "#5b9cff"), n: "Firefox", w: 1 },
  mail: { i: NYX("Mail"), n: "Mail", w: 1, badge: 4 },
  calendar: { i: NYX("Calendar"), n: "Calendar" },
  notes: { i: NYX("Notes"), n: "Notes", w: 1 },
  music: { i: NYX("Music"), n: "Music", w: 1, playing: true },
  chatgpt: { i: TP("sparkle", "#19c39c"), n: "ChatGPT" },
  theater: { i: NYX("Theater"), n: "Theater" },
  settings: { i: NYX("Settings"), n: "Settings" },
  terminal: { i: TP("terminal", "#8bd5ca"), n: "Ghostty", w: 3 },
  store: { i: NYX("Store"), n: "Store", w: 1, progress: 62 },
  chat: { i: NYX("Chat"), n: "Chat", w: 1, urgent: true, badge: 2 },
  pdf: { i: NYX("Pdf"), n: "PDF" },
  photos: { i: NYX("Photos"), n: "Photos" },
  write: { i: NYX("Write"), n: "Write" },
  weather: { i: NYX("Weather"), n: "Weather" },
  capture: { i: NYX("Capture"), n: "Capture" },
};
const PINS = ["files", "browser", "mail", "calendar", "notes", "music", "chatgpt", "theater", "settings"];
const RUNNING = ["terminal", "store", "chat"];

/* ── Tiles ────────────────────────────────────────────────────────────────────── */
// One app: its icon, a badge, a progress bar, and a mark per window (up to three).
function tile(k, o = {}) {
  const a = { ...DOCK[k], ...(o.a || {}) };
  const cls = ["dt", a.focus && "focus", a.w && "run", a.urgent && "urg", a.min && "minw", o.hov && "hov", o.dim && "dimt", o.drop && "drop", o.cls]
    .filter(Boolean).join(" ");
  const marks = a.w ? `<span class="ind">${"<u></u>".repeat(Math.min(a.w, 3))}</span>` : "";
  const badge = a.badge && o.badges !== false ? `<span class="dbdg">${a.badge}</span>` : "";
  const prog = a.progress ? `<span class="dprog"><b style="width:${a.progress}%"></b></span>` : "";
  const key = o.key ? `<span class="dkey">${o.key}</span>` : "";
  const play = a.playing && o.play ? `<span class="dplay">${eq()}</span>` : "";
  const st = o.scale ? ` style="--z:${o.scale}"` : "";
  return `<div class="${cls}" id="d-${o.id || k}"${st}>${a.i}${badge}${prog}${play}${key}${marks}</div>`;
}
const launcher = (o = {}) => `<div class="dt launch ${o.hov ? "hov" : ""}" id="d-apps"><span class="ai lt">${ic("apps")}</span></div>`;
// Folders: newest files stacked, or the folder icon; a count when set.
const thumbs = ["g7", "g5", "g10"];
function folderTile(kind = "stack", o = {}) {
  const inner = kind === "stack"
    ? `<span class="ai stack"><i class="art g10"></i><i class="doc">${ic("file")}</i><i class="art g7"></i></span>`
    : `<span class="ai fold" style="--f:${o.color || "var(--sw-blue)"}"><svg viewBox="0 0 48 48"><path class="b" d="M5 13a4 4 0 0 1 4-4h10l4 4h16a4 4 0 0 1 4 4v20a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4z"/><path class="f" d="M5 19a3 3 0 0 1 3-3h32a3 3 0 0 1 3 3v18a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4z"/>${o.glyph ? `<g transform="translate(16 21) scale(.66)" class="g">${P[o.glyph]}</g>` : ""}</svg></span>`;
  const cnt = o.count ? `<span class="fcnt">${o.count}</span>` : "";
  const dl = o.downloading ? `<span class="dldot">${ic("dl")}</span>` : "";
  return `<div class="dt fld ${o.hov ? "hov" : ""} ${o.drop ? "drop" : ""}" id="${o.id || "d-" + kind}">${inner}${cnt}${dl}</div>`;
}
const trash = (o = {}) => `<div class="dt trash ${o.drop ? "drop" : ""}" id="d-trash"><span class="ai lt ${o.full === false ? "" : "full"}">${ic("trash")}</span></div>`;
const drive = (o = {}) => `<div class="dt drv ${o.hov ? "hov" : ""}" id="d-drive"><span class="ai lt drvi">${ic("usb")}</span><span class="ej">${ic("eject")}</span></div>`;
const sep = (c = "") => `<span class="dsep ${c}"></span>`;

/* ── Docks ────────────────────────────────────────────────────────────────────── */
// o: look, size, hov (app key), keys, drop, extra (markup before the folders), cls.
function dock(o = {}) {
  const look = o.look || "a";
  const hov = o.hov || "";
  const t = (k, i) => tile(k, { hov: hov === k, key: o.keys && i < 9 ? i + 1 : "", play: look !== "cur", dim: o.dim?.includes(k), drop: o.drop === k, badges: look !== "cur" || k !== "chat", ...(o.scales ? { scale: o.scales[k] } : {}) });
  const pins = PINS.map(t).join("");
  const run = RUNNING.map((k, i) => t(k, 99)).join("");
  const folders = o.folders ?? `${folderTile("stack", { id: "d-downloads", hov: hov === "downloads", downloading: o.downloading, drop: o.drop === "downloads" })}${folderTile("folder", { id: "d-projects", glyph: "code", color: "var(--sw-violet)", drop: o.drop === "projects" })}`;
  const tail = `${o.extraEnd || ""}${folders}${trash({ drop: o.drop === "trash" })}`;
  const style = `--is:${o.size || (look === "cur" ? 42 : 48)}px`;
  if (look === "b") {
    return `<div class="dock b ${o.cls || ""}" style="${style}">
      <div class="dg">${launcher({ hov: hov === "apps" })}</div>
      <div class="dg">${pins}${sep("thin")}${run}</div>
      <div class="dg">${tail}</div></div>`;
  }
  if (look === "c") {
    return `<div class="dock c ${o.cls || ""}" style="${style}">
      <div class="cl">${launcher()}<div class="csrch">${ic("search", "sm")}<span>Search apps and files</span><span class="kbdk">Super Space</span></div></div>
      <div class="cm">${pins}${sep()}${run}</div>
      <div class="cr">${tail}</div></div>`;
  }
  const head = o.apps === false ? "" : `${launcher({ hov: hov === "apps" })}${look === "e" ? "" : sep()}`;
  return `<div class="dock ${look} ${o.cls || ""}" style="${style}">${head}${pins}${o.extraPins || ""}${look === "cur" ? "" : sep("thin")}${run}${sep()}${tail}</div>`;
}

/* ── Above the dock ───────────────────────────────────────────────────────────── */
// A popover above the tile `at` (placed once laid out). align: center|left|right.
const above = (inner, at, w, align = "center", c = "") => `<div class="pop dup ${c}" data-up="${at}" data-align="${align}" ${w ? `style="width:${w}px"` : ""}>${inner}</div>`;
const tip = (text, at) => `<div class="dtip" data-up="${at}" data-align="center" data-gap="10">${text}</div>`;

function placeUp() {
  document.querySelectorAll("[data-up]").forEach((p) => {
    const a = document.getElementById(p.dataset.up);
    if (!a) return;
    const r = a.getBoundingClientRect(), w = p.offsetWidth, al = p.dataset.align;
    let left = al === "left" ? r.left - 6 : al === "right" ? r.right - w + 6 : r.left + r.width / 2 - w / 2;
    left = Math.max(10, Math.min(innerWidth - w - 10, left));
    p.style.left = `${left}px`;
    const dk = a.closest(".dock");
    const top = Math.min(r.top, dk ? dk.getBoundingClientRect().top : r.top);
    p.style.bottom = `${innerHeight - top + +(p.dataset.gap || 10)}px`;
  });
}

// A window thumbnail: a little window of the app's kind.
const thumb = (kind = "files", c = "") => `<div class="wthumb ${kind} ${c}"><span class="wtb"></span><span class="wts"></span><span class="wtc"><i></i><i></i><i></i><i></i><i></i><i></i></span></div>`;

function previewPop() {
  const card = (k, title, ws, kind, c = "", trail = "") => `<div class="wcard ${c}">${thumb(kind, c.includes("min") ? "minimized" : "")}
    <div class="wct">${DOCK[k].i}<span class="grow ell">${title}</span>${trail}</div></div>`;
  return `<div class="wcards">
    ${card("files", "nyx-bar", "1", "files", "cur", `<span class="chip">Workspace 1</span>`)}
    ${card("files", "Downloads", "3", "files", "hov", `<span class="chip">Workspace 3</span><button class="ibtn sm wx" title="Close">${ic("x")}</button>`)}
    ${card("files", "Wallpapers", "", "photos", "min", `<span class="chip">Minimized</span>`)}
  </div>
  <div class="pfoot"><span class="ter xs">Click a window to go to it · middle-click the icon for a new one</span><span class="grow"></span><span class="kbdk">Super Tab</span></div>`;
}

function musicCard() {
  return `<div class="dch">${DOCK.music.i}<div class="grow"><b>Music</b><div class="ps">Playing · Bluetooth headphones</div></div><button class="ibtn sm" title="Show windows">${ic("windows")}</button></div>
  <div class="dnow">${cover(56, "g7", 9)}<div class="grow"><div class="pt">Midnight City</div><div class="ps">M83 · Hurry Up, We're Dreaming</div>
    <div class="dnc"><button class="ibtn sm">${ic("prev")}</button><button class="ibtn playb">${ic("pause")}</button><button class="ibtn sm">${ic("next")}</button><span class="grow"></span><button class="ibtn sm acc">${ic("heartf")}</button></div></div></div>
  ${rail(38, "thin dseek")}
  ${gl("Recently played")}
  <div class="drec">${[["g5", "Teen Dream", "Beach House"], ["g10", "Currents", "Tame Impala"], ["g7", "Random Access Memories", "Daft Punk"]].map(([g, t, a]) => `<div class="drr">${cover(34, g, 6)}<div class="grow"><div class="ell">${t}</div><div class="ps ell">${a}</div></div></div>`).join("")}</div>
  <div class="msep"></div>
  <div class="menu">
    <div class="mi">${ic("newwin")}New window<span class="grow"></span><span class="kbdk">Middle-click</span></div>
    <div class="mi">${ic("cast")}Play on…<span class="grow"></span>${ic("chev-r", "ter sm")}</div>
    <div class="msep"></div>
    <div class="mi hov">${ic("pin")}Keep in Dock<span class="grow"></span>${ic("check", "acc sm")}</div>
    <div class="mi">${ic("power")}Quit</div>
  </div>`;
}

const FILES = [
  ["image", "g7", "sunset-over-lake.jpg", "2 min ago"], ["file", "", "Invoice-2026-11.pdf", "1 h ago"], ["image", "g5", "screenshot-14-02.png", "1 h ago"],
  ["box", "", "nyx-dock-0.9.tar.gz", "Yesterday"], ["image", "g10", "night-sky.png", "Yesterday"], ["file", "", "notes-meeting.md", "Monday"],
  ["file", "", "budget.ods", "Monday"], ["image", "g7", "IMG_2041.jpg", "Sunday"],
];
function folderPop(view = "grid") {
  const cell = ([g, art, n, t]) => `<div class="fcell">${art ? `<span class="fth art ${art}"></span>` : `<span class="fth doc">${ic(g)}</span>`}<span class="fn ell">${n}</span><span class="ft ter">${t}</span></div>`;
  return `<div class="fph"><b>Downloads</b><span class="ter small">12 items</span><span class="grow"></span>
    <div class="seg mini"><span class="${view === "grid" ? "on" : ""}">${ic("apps")}</span><span class="${view === "list" ? "on" : ""}">${ic("list")}</span><span>${ic("fan")}</span></div></div>
  <div class="fgrid">${FILES.map(cell).join("")}</div>
  <div class="pfoot"><span class="link">Open in Files</span><span class="grow"></span><span class="chip">${ic("sort", "xs")}Newest first</span></div>`;
}

const ALL = ["Activity", "Archive", "Backup", "Calculator", "Calendar", "Capture", "Chat", "Contacts", "Containers", "Files", "Fonts", "Git", "Glimpse", "Home", "Mail", "Maps", "Music", "News", "Notes", "Office", "Passwords", "Pdf", "Photos", "Present", "Reminders", "Settings", "Sheets", "Store", "Tasks", "Theater", "Weather", "Write"];
const NAMES = { Pdf: "PDF", Present: "Present", Office: "Docs" };
function appsPanel() {
  const cell = (n, c = "") => `<div class="acell ${c}">${NYX(n)}<span class="ell">${NAMES[n] || n}</span></div>`;
  return `<div class="aph">${srch("Search apps", "")}<span class="ter xs">Tab: files and the web in Glimpse</span></div>
  <div class="achips">${["All", "Nyx", "Internet", "Office", "Media", "Games", "System", "Development"].map((c, i) => `<span class="chip ${i === 0 ? "on" : ""}">${c}</span>`).join("")}</div>
  ${gl("Frequent")}
  <div class="agrid freq">${["Files", "Mail", "Notes", "Music", "Calendar", "Photos", "Settings", "Write"].map((n, i) => cell(n, i === 2 ? "hov" : "")).join("")}</div>
  ${gl("All apps", '<span class="ter xs">32</span>')}
  <div class="agrid">${ALL.slice(0, 24).map((n) => cell(n)).join("")}</div>`;
}

function dockMenu() {
  return `<div class="menu">
    <div class="mh">Dock</div>
    <div class="sl dsl">${ic("zoom")}${rail(46)}<span class="pv tnum ter">48</span></div>
    <div class="mrow"><span>Position</span><div class="seg mini"><span>Left</span><span class="on">Bottom</span><span>Right</span></div></div>
    <div class="mrow"><span>Hide</span><div class="seg mini"><span class="on">Smart</span><span>Auto</span><span>Never</span></div></div>
    <div class="msep"></div>
    <div class="mi">${ic("windows")}Window previews<span class="grow"></span>${sw(true)}</div>
    <div class="mi">${ic("zoom")}Magnify on hover<span class="grow"></span>${sw(false)}</div>
    <div class="mi">${ic("history")}Recent apps<span class="grow"></span>${sw(true)}</div>
    <div class="mi">${ic("apps")}Apps button<span class="grow"></span>${sw(true)}</div>
    <div class="mi">${ic("trash")}Trash<span class="grow"></span>${sw(true)}</div>
    <div class="msep"></div>
    <div class="mi hov">${ic("folder")}Add a folder…</div>
    <div class="mi">${ic("gear")}Dock settings</div>
  </div>`;
}

/* ── A screen ─────────────────────────────────────────────────────────────────── */
// The new bar on top, the wallpaper (or windows), the dock, what's open, the caption.
function screen({ dockHtml, pops = "", caption, spec = "", windows = false, veil = false, bar = true }) {
  mount(`<div class="desk dk">
    ${windows ? fakeWindows() : ""}
    ${veil ? '<div class="veil"></div>' : ""}
    ${bar ? BARS.a() : ""}
    ${spec}
    ${dockHtml}
    ${pops}
    ${caption ? `<div class="cap-tag dcap"><div class="ct"><b>${caption.name}</b>${caption.rule ? `<span class="rule ${caption.rule[0]}">${caption.rule[1]}</span>` : ""}</div><p>${caption.desc.replace(/`([^`]+)`/g, "<code>$1</code>")}</p></div>` : ""}
  </div>`);
  const go = () => requestAnimationFrame(placeUp);
  document.fonts.ready.then(go);
  addEventListener("load", go);
  addEventListener("resize", go);
}
