// The parts every Nyx 2.0 mockup page shares: icons mock.js doesn't have, small builders,
// the window shell and the page switcher. Loaded after mock.js; screens.html mounts the
// app's page. From mockups/reminders (also in contacts and notes).
"use strict";
const Q = new URLSearchParams(location.search);
const ROOT = document.documentElement;
const SCREEN = ROOT.dataset.screen;
const SHOT = Q.get("shot") === "1";
const NARROW = Q.get("w") === "800";

const KI = {
  terminal: '<rect x="3" y="4.5" width="18" height="15" rx="2.5"/><path d="m7 9.5 3 2.5-3 2.5M12.5 15H17"/>',
  alert: '<path d="M12 3.5 2.5 20h19z"/><path d="M12 10v4.5M12 17.5h.01" stroke-width="1.9"/>',
  copy: '<rect x="8" y="8" width="12.5" height="12.5" rx="2.5"/><path d="M16 8V6a2.5 2.5 0 0 0-2.5-2.5h-7A2.5 2.5 0 0 0 4 6v7a2.5 2.5 0 0 0 2.5 2.5H8"/>',
  history: '<path d="M3.5 12a8.5 8.5 0 1 0 2.5-6"/><path d="M3.5 4v4.5H8M12 7.5V12l3 2"/>',
  repeat: '<path d="m17 2.5 3.5 3.5L17 9.5"/><path d="M3.5 11.5v-1A4.5 4.5 0 0 1 8 6h12.5M7 21.5 3.5 18 7 14.5"/><path d="M20.5 12.5v1A4.5 4.5 0 0 1 16 18H3.5"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4"/>',
  rename: '<path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16z"/><path d="m13.5 6.5 4 4"/>',
  close: '<path d="M17.5 6.5l-11 11M6.5 6.5l11 11"/>',
  link: '<path d="M10 14a4.5 4.5 0 0 0 6.4 0l3-3a4.5 4.5 0 0 0-6.4-6.4l-1 1"/><path d="M14 10a4.5 4.5 0 0 0-6.4 0l-3 3a4.5 4.5 0 0 0 6.4 6.4l1-1"/>',
  phone: '<path d="M5 3.5h3.5l1.8 4.5-2.3 1.4a11 11 0 0 0 6.6 6.6l1.4-2.3 4.5 1.8V19a1.5 1.5 0 0 1-1.6 1.5A16.5 16.5 0 0 1 3.5 5.1 1.5 1.5 0 0 1 5 3.5z"/>',
  chat: '<path d="M20.5 11.5a8 8 0 0 1-11.8 7L3.5 20l1.5-4.7A8 8 0 1 1 20.5 11.5z"/>',
  cake: '<path d="M4 21h16M5 21v-7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v7M5 16.5c2 0 2-1.5 3.5-1.5S10.5 16.5 12 16.5s2-1.5 3.5-1.5 1.5 1.5 3.5 1.5M12 12V8.5M12 4.5l1 2a1 1 0 0 1-2 0z"/>',
  merge: '<circle cx="6" cy="5.5" r="2.2"/><circle cx="6" cy="18.5" r="2.2"/><circle cx="18" cy="18.5" r="2.2"/><path d="M6 7.7v8.6M6 7.7c0 6 5 8.6 9.8 10.8"/>',
  pin: '<path d="M9 3.5h6l-1 5 3.5 3.5h-11L10 8.5zM12 12v8.5"/>',
  graph: '<circle cx="6" cy="6" r="2.2"/><circle cx="18" cy="8" r="2.2"/><circle cx="9" cy="18" r="2.2"/><circle cx="18" cy="18" r="2.2"/><path d="M8 7l8 1M7 8l1.6 8M11 18h5M17.6 10.2l.3 5.6"/>',
  kanban: '<rect x="3" y="4" width="5" height="16" rx="1.5"/><rect x="9.5" y="4" width="5" height="11" rx="1.5"/><rect x="16" y="4" width="5" height="7" rx="1.5"/>',
  canvas: '<rect x="3" y="3" width="8" height="6" rx="1.5"/><rect x="13" y="15" width="8" height="6" rx="1.5"/><rect x="13" y="3" width="8" height="8" rx="1.5"/><path d="M7 9v5a2 2 0 0 0 2 2h4"/>',
  book: '<path d="M4 4.5A1.5 1.5 0 0 1 5.5 3H19v15H5.5A1.5 1.5 0 0 0 4 19.5zM4 19.5A1.5 1.5 0 0 0 5.5 21H19v-3"/>',
  outline: '<path d="M4 6h16M8 11h12M8 16h12M4 11h.01M4 16h.01" />',
  sparkle: '<path d="M12 3.5 13.8 9 19.5 10.5 13.8 12.2 12 18 10.2 12.2 4.5 10.5 10.2 9z"/><path d="M19 3v3M17.5 4.5h3"/>',
  bold: '<path d="M7 5h6a3.5 3.5 0 0 1 0 7H7zM7 12h7a3.5 3.5 0 0 1 0 7H7z" stroke-width="2"/>',
  italic: '<path d="M10 5h8M6 19h8M14 5l-4 14"/>',
  hd: '<path d="M5 5v14M13 5v14M5 12h8M17 10l2-1.5V19"/>',
  ul: '<path d="M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01" stroke-width="1.8"/>',
  task: '<rect x="3.5" y="4" width="6" height="6" rx="1.5"/><path d="m4.8 7 1.2 1.2 2.2-2.4M13 7h7.5M3.5 14h6v6h-6zM13 17h7.5"/>',
  code: '<path d="m16 18 6-6-6-6M8 6l-6 6 6 6"/>',
  quote: '<path d="M5 18c2-1 3-3 3-6V7H4v5h4M15 18c2-1 3-3 3-6V7h-4v5h4"/>',
  attach: '<path d="m20.5 11.5-8.4 8.4a5 5 0 0 1-7.1-7.1l8.4-8.4a3.3 3.3 0 0 1 4.7 4.7l-8.4 8.4a1.7 1.7 0 0 1-2.4-2.4l7.8-7.8"/>',
  split: '<rect x="3" y="4.5" width="18" height="15" rx="2.5"/><path d="M12 4.5v15"/>',
  panel: '<rect x="3" y="4.5" width="18" height="15" rx="2.5"/><path d="M15 4.5v15"/>',
  cmd: '<path d="M9 6.5A2.5 2.5 0 1 0 6.5 9H9zM9 9h6v6H9zM15 6.5A2.5 2.5 0 1 1 17.5 9H15zM9 17.5A2.5 2.5 0 1 1 6.5 15H9zM15 17.5a2.5 2.5 0 1 0 2.5-2.5H15z"/>',
  sync: '<path d="M20 12a8 8 0 0 1-13.7 5.7M4 12a8 8 0 0 1 13.7-5.7"/><path d="M17.5 2.5v4h-4M6.5 21.5v-4h4"/>',
  cloudoff: '<path d="M8 6.2A6 6 0 0 1 16.2 10.2 4.5 4.5 0 0 1 20.6 16M17.5 19H6a3.5 3.5 0 0 1-1.4-6.7M3 3l18 18"/>',
  import: '<path d="M12 3.5v11M7.5 10l4.5 4.5 4.5-4.5M4.5 15v3.5A2 2 0 0 0 6.5 20.5h11a2 2 0 0 0 2-2V15"/>',
  export: '<path d="M12 14.5v-11M7.5 8 12 3.5 16.5 8M4.5 15v3.5A2 2 0 0 0 6.5 20.5h11a2 2 0 0 0 2-2V15"/>',
  addperson: '<circle cx="10" cy="8" r="4"/><path d="M2.5 20.5a7.5 7.5 0 0 1 12.5-5.6M18.5 14v6M15.5 17h6"/>',
  lock: '<rect x="4.5" y="11" width="15" height="10" rx="2.5"/><path d="M8 11V7.5a4 4 0 0 1 8 0V11"/>',
  calendar2: '<rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
  inbox2: '<path d="M3 13h5l1.5 3h5l1.5-3h5"/><path d="M5.5 5h13L21 13v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5z"/>',
  hash: '<path d="M9 3.5 7 20.5M17 3.5l-2 17M4 9h16.5M3.5 15H20"/>',
  daily: '<rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4M8 14h3"/>',
  trash2: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
  dots: '<path d="M5 12h.01M12 12h.01M19 12h.01" stroke-width="2.8"/>',
  mapin: '<path d="M12 21s7-6.2 7-11.5a7 7 0 0 0-14 0C5 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
  web: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
  people: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.6a3.5 3.5 0 0 1 0 6.8M18 14a6.5 6.5 0 0 1 3.5 6"/>',
  person: '<circle cx="12" cy="8" r="4"/><path d="M4.5 20.5a7.5 7.5 0 0 1 15 0"/>',
  share: '<circle cx="18" cy="5.5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="18.5" r="2.5"/><path d="m8.2 10.8 7.6-4M8.2 13.2l7.6 4"/>',
  expand: '<path d="M4 9V5.5A1.5 1.5 0 0 1 5.5 4H9M15 4h3.5A1.5 1.5 0 0 1 20 5.5V9M20 15v3.5a1.5 1.5 0 0 1-1.5 1.5H15M9 20H5.5A1.5 1.5 0 0 1 4 18.5V15"/>',
  listic: '<path d="M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01" stroke-width="1.8"/>',
};
const icon = (n, c = "") => `<i data-i="${n}"${c ? ` class="${c}"` : ""}></i>`;
const ib = (n, tip = "", c = "") => `<button class="ib ${c}"${tip ? ` title="${tip}"` : ""}>${icon(n)}</button>`;
const btn = (label, c = "", ic = "") => `<button class="btn ${c}">${ic ? icon(ic) : ""}<span>${label}</span></button>`;
const search = (ph, key = "Ctrl F", c = "") => `<div class="search ${c}">${icon("search")}<span>${ph}</span><span class="key">${key}</span></div>`;
const chip = (t, c = "", ic = "") => `<span class="chip2 ${c}">${ic ? icon(ic) : ""}${t}</span>`;
const sw = (on) => `<span class="switch ${on ? "on" : ""}"></span>`;
const seg = (items, on) => `<div class="seg">${items.map((x) => `<button class="${x === on ? "on" : ""}">${x}</button>`).join("")}</div>`;
const navx = (ic, t, o = {}) => `<div class="navx ${o.active ? "active" : ""}">${o.dot ? `<span class="cdot" style="background:${o.dot}"></span>` : icon(ic)}<span>${t}</span>${o.sub ? `<span class="sub">${o.sub}</span>` : ""}${o.badge ? `<span class="badge">${o.badge}</span>` : o.cnt !== undefined ? `<span class="cnt">${o.cnt}</span>` : ""}</div>`;
// A group heading. `sec` colours it as its section (Design 2.0's coloured sidebar
// sections): "accent" for the sidebar's first group, else a swatch name.
const grp = (t, first, act = "", sec = "") => `<div class="grp2 ${first ? "first" : ""} ${sec ? "sec" : ""}"${sec ? ` style="--sc: var(--${sec === "accent" ? "accent" : "sw-" + sec})"` : ""}>${t}${act ? `<span class="act">${act}</span>` : ""}</div>`;
const kbd = (k) => `<span class="kbd">${k}</span>`;
const idea = (title, text) => SHOT && Q.get("noidea") ? "" : `<div class="idea"><b>${title}</b>${text}</div>`;

/** The window: `hdr` (header html), `side` (sidebar html or ""), `page` (sheet html), `over` (floating parts). */
function win({ hdr, side, page, over = "" }) {
  return `<div class="win ${side ? "" : "no-side"}">${hdr}${side ? `<aside class="side"><div class="side-scroll">${side}</div></aside>` : ""}<main class="page">${page}</main>${over}</div>`;
}

/** The header: the app's mark and name, then start, centre and end parts. */
function header({ icon: ic, name, start = "", center = "", end = "" }) {
  return `<header class="hdr"><div class="hdr-id">${icon(ic, "app-ic")}<span class="app-name">${name}</span></div><div class="hdr-start">${ib("sidebar", "Sidebar (Ctrl+B)")}${start}</div><div class="hdr-center">${center}</div><div class="hdr-end">${end}<span class="gap"></span>${ib("sliders", "Settings (Ctrl+,)")}</div></header>`;
}

const PAGES = {};
function mount(html) {
  document.body.innerHTML = html;
  if (NARROW) document.body.classList.add("narrow");
}
document.addEventListener("DOMContentLoaded", () => {
  const svg = (n) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${KI[n]}</svg>`;
  document.querySelectorAll("i[data-i]").forEach((el) => { if (KI[el.dataset.i]) el.innerHTML = svg(el.dataset.i); });
  if (NARROW) document.body.classList.add("narrow");
  document.querySelector(".mock-switch")?.remove();
  if (SHOT) return;
  const screens = (ROOT.dataset.screens || "").split(",").filter(Boolean);
  const link = (k, v, label) => {
    const p = new URLSearchParams(location.search);
    p.set(k, v);
    const on = (Q.get(k) || { theme: "dark", screen: screens[0] }[k]) === v;
    return `<a class="${on ? "on" : ""}" href="?${p}">${label}</a>`;
  };
  const bar = document.createElement("nav");
  bar.className = "mock-switch";
  bar.innerHTML = screens.map((s) => link("screen", s, s)).join("") + "<span></span>" + link("theme", "dark", "Dark") + link("theme", "light", "Light") + `<span></span><a href="index.html#${Q.get("app") || ""}">Gallery</a>`;
  document.body.append(bar);
});
