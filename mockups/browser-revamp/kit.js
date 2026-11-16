// Parts every direction draws with: icons, sample sites and tabs, the web page in the sheet,
// popovers, menus and settings controls. A direction's own frame is in dirs/ID.js. Sample data is
// made up (the shots are public).

// Icons neither Umbra nor Browser draws yet, in the same 24 px, 1.6 stroke style.
const EXTRA = {
  translate: "M4 6h9M8.5 4v2M6 6c0 4 3 7 6 8M11 6c-1 4-4 7-7 8M13 20l4-9 4 9M14.5 17h5",
  cookie: "M20 12a8 8 0 1 1-8-8 3 3 0 0 0 4 4 3 3 0 0 0 4 4zM9 10h.01M14 15h.01M9 15h.01",
  external: "M14 4h6v6M20 4l-9 9M18 14v6H4V6h6",
  plug: "M9 3v5M15 3v5M6 8h12v4a6 6 0 0 1-12 0zM12 18v3",
  workspace: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z",
  inbox: "M4 13l2-8h12l2 8v6H4zM4 13h5l1 2h4l1-2h5",
};
const I = (n, cls = "") => `<svg class="i ${cls}" viewBox="0 0 24 24">${ICONS[n] || `<path d="${EXTRA[n] || ""}"/>`}</svg>`;
const kbd = (...keys) => `<span class="kbd">${keys.map((k) => `<kbd>${k}</kbd>`).join("")}</span>`;

// Sites: key -> [title, host, path, favicon letter, favicon colour]
const SITES = {
  journal: ["Water on the ridge · Field Notes", "fieldnotes.example", "/2026/11/water-on-the-ridge", "F", "#c0843d"],
  maps: ["Trailheads near Calera", "maps.example", "/search/trailheads", "M", "#2f9e64"],
  mail: ["Inbox · Fastmail", "app.fastmail.com", "/mail/Inbox", "@", "#0067b9"],
  cal: ["Calendar", "calendar.example", "/week", "C", "#d14836"],
  gh: ["design-nexus/nyx-browser", "github.com", "/design-nexus/nyx-browser", "G", "#24292f"],
  music: ["Lo-fi radio · Music", "music.example", "/radio", "♪", "#8b5cf6"],
  news: ["Hacker News", "news.ycombinator.com", "/", "Y", "#ff6600"],
  docs: ["Tabbrowser · Firefox Source Docs", "firefox-source-docs.mozilla.org", "/browser/tabbrowser", "M", "#e66000"],
  wiki: ["Gecko · Wikipedia", "en.wikipedia.org", "/wiki/Gecko_(software)", "W", "#3d3d3d"],
  weather: ["Calera · 10-day forecast", "weather.example", "/calera", "☀", "#e0a21b"],
  video: ["Ridge loop in 4K · Trail Days", "youtube.com", "/watch?v=ridge", "▶", "#e62117"],
  recipes: ["Camp stove chili · Trail Kitchen", "trailkitchen.example", "/chili", "K", "#4f8a3c"],
  store: ["Gaiter sizes · Peak Outfitters", "peakoutfitters.example", "/gaiters", "P", "#2563c9"],
  router: ["Router setup", "router.local", "/admin", "R", "#1d6fd1"],
  login: ["Sign in · Field Notes", "fieldnotes.example", "/login", "F", "#c0843d"],
};
const INSECURE = new Set(["router"]);
const fv = (key, cls = "") => { const s = SITES[key]; return `<span class="fv ${cls}" style="--c:${s[4]}">${s[3]}</span>`; };
const host = (key) => SITES[key][1];
const title = (key) => SITES[key][0];

// Workspaces: [letter, name, colour]
const SPACES = [["T", "Trips", "var(--sw-teal)"], ["W", "Work", "var(--sw-blue)"], ["H", "Home", "var(--sw-amber)"]];
const ESSENTIALS = ["mail", "cal", "gh", "music"];

// Extensions: [name, what it does, colour, letter, built in, on, site access]
const EXTS = [
  ["Content blocking", "uBlock Origin, built in · 14 blocked here", "var(--sw-coral)", "shield", true, true, "Always"],
  ["Passwords", "Nyx Passwords · 2 logins for this site", "var(--sw-violet)", "key", true, true, "Always"],
  ["VPN", "Browser only · off", "var(--sw-teal)", "globe", true, false, "—"],
  ["Dark Reader", "Dark mode for every website", "#2f2f36", "D", false, true, "On click"],
  ["SponsorBlock", "Skip sponsor segments on YouTube", "#e0402a", "S", false, true, "youtube.com"],
  ["Zotero Connector", "Save references to Zotero", "#c4302b", "Z", false, false, "On click"],
];
const extIcon = (e, cls = "") => `<span class="xi ${cls}" style="--c:${e[2]}">${ICONS[e[3]] || EXTRA[e[3]] ? I(e[3]) : e[3]}</span>`;

// The web page in the sheet: Field Notes' article. Websites keep their own (light) colours.
const scene = (cls = "") => `<div class="scene ${cls}"><i class="m1"></i><i class="m2"></i><i class="m3"></i><i class="sun"></i></div>`;
function webPage({ narrow = false, link = false, sel = false, img = false, find = false } = {}) {
  const p1 = sel ? `<span class="w-sel">Cedar Spring</span> is the only reliable water in late autumn.` : find ? `<mark class="cur">Cedar</mark> Spring is the only reliable water in late autumn.` : "Cedar Spring is the only reliable water in late autumn.";
  const p2 = find ? "marked by a stand of incense <mark>cedar</mark>." : "marked by a stand of incense cedar.";
  return `<div class="web ${narrow ? "narrow" : ""}">
    <header class="w-nav"><b class="w-logo"><span class="w-mark"></span>Field Notes</b><nav><span>Trips</span><span>Gear</span><span>Maps</span>${narrow ? "" : "<span>About</span>"}</nav><span class="w-sub">Subscribe</span></header>
    <article>
      <div class="w-kicker">Trip report · Calera Ridge</div>
      <h1>Water on the ridge: where to fill up between Calera and the saddle</h1>
      <div class="w-by"><span class="w-av"></span>Mara Quinn · Nov 9, 2026 · 6 min read</div>
      ${scene(`w-hero ${img ? "w-imghover" : ""}`)}
      <p>${p1} The creek at the second switchback runs until the first hard frost, and the trough by the old gate is for cattle — filter it twice if you must.</p>
      <p>From the trailhead, follow <a class="${link ? "w-hover" : ""}">the ridge loop map</a> north for 4.2 miles. The spring sits 200 feet below the saddle on the east side, ${p2}</p>
    </article></div>`;
}

// Popovers, menus and controls.
const pop = (html, { x, y, w, cls = "", style = "" }) => `<div class="pop ${cls}" style="left:${x}px;top:${y}px;${w ? `width:${w}px;` : ""}${style}">${html}</div>`;
// items: "-" a separator, { h: "Heading" }, or [icon, label, right, { sub, hover, danger, on, dim }]
function menu(items) {
  return items.map((it) => {
    if (it === "-") return `<div class="msep"></div>`;
    if (it.h) return `<div class="mh">${it.h}</div>`;
    if (it.html) return it.html;
    const [ic, label, right = "", o = {}] = it;
    return `<div class="mi ${o.hover ? "hover" : ""} ${o.danger ? "danger" : ""} ${o.dim ? "dim" : ""}">${ic ? I(ic) : `<span class="ni"></span>`}<span class="ml">${label}</span>${right ? `<span class="mr">${right}</span>` : ""}${o.sub ? I("arrow-right", "sub") : ""}${o.on ? I("check", "chk") : ""}</div>`;
  }).join("");
}
const sw = (on = false) => `<span class="sw ${on ? "on" : ""}"><i></i></span>`;
const seg = (opts, i = 0) => `<span class="seg">${opts.map((o, n) => `<span class="${n === i ? "on" : ""}">${o}</span>`).join("")}</span>`;
const drop = (label) => `<span class="drop">${label}${I("chevron")}</span>`;
const row = (t, d, ctrl = "", ic = "") => `<div class="row">${ic}<div class="rt"><b>${t}</b>${d ? `<span>${d}</span>` : ""}</div>${ctrl}</div>`;
const card = (rows, cls = "") => `<div class="card ${cls}">${rows.join("")}</div>`;
const tile = (ic, c) => `<span class="tile" style="--c:${c}">${I(ic)}</span>`;
const veil = (cls = "") => `<div class="veil ${cls}"></div>`;
// The mouse pointer, where a right-click happened.
const cursor = (x, y) => `<svg class="cursor" style="left:${x}px;top:${y}px" viewBox="0 0 16 22"><path d="M1 1v17l4.5-4.2 3 6.7 2.8-1.3-3-6.6H14z"/></svg>`;
// A menu opened at the pointer: placed after the page is drawn (placePops), flipping up or left
// when it wouldn't fit, as menus do.
const atPointer = (html, x, y, cls) => `<div class="pop ${cls}" data-px="${x}" data-py="${y}" style="left:${x}px;top:${y}px">${html}</div>${cursor(x - 2, y)}`;
// A popover hanging from a button: right-aligned to it (data-right), or centred on it (data-mid).
const fromButton = (html, { right, mid, y, w, cls = "", up = false }) => `<div class="pop ${cls}" ${right !== undefined ? `data-right="${right}"` : ""} ${mid !== undefined ? `data-mid="${mid}"` : ""} ${up ? `data-up="${y}"` : ""} style="top:${y}px;${w ? `width:${w}px;` : ""}">${html}</div>`;
function placePops() {
  const W = innerWidth, H = innerHeight;
  for (const p of document.querySelectorAll(".pop[data-px]")) {
    const x = +p.dataset.px, y = +p.dataset.py, w = p.offsetWidth, h = p.offsetHeight;
    p.style.left = `${x + w > W - 8 ? x - w : x}px`;
    p.style.top = `${y + h > H - 8 ? Math.max(8, y - h) : y}px`;
  }
  for (const p of document.querySelectorAll(".pop[data-right]")) p.style.left = `${Math.min(+p.dataset.right, W - 8) - p.offsetWidth}px`;
  for (const p of document.querySelectorAll(".pop[data-mid]")) p.style.left = `${Math.max(8, Math.min(+p.dataset.mid - p.offsetWidth / 2, W - 8 - p.offsetWidth))}px`;
  for (const p of document.querySelectorAll(".pop[data-up]")) p.style.top = `${+p.dataset.up - p.offsetHeight}px`;
  // A submenu, beside its parent's highlighted row.
  for (const p of document.querySelectorAll(".pop.submenu")) {
    const parent = p.previousElementSibling?.classList.contains("cursor") ? p.previousElementSibling.previousElementSibling : p.previousElementSibling;
    const hov = parent?.querySelector(".mi.hover");
    if (!hov) continue;
    const r = parent.getBoundingClientRect(), h = hov.getBoundingClientRect();
    const right = r.right + p.offsetWidth - 4 < W - 8;
    p.style.left = `${right ? r.right - 4 : r.left - p.offsetWidth + 4}px`;
    p.style.top = `${Math.min(h.top - 6, H - 8 - p.offsetHeight)}px`;
  }
}
// A submenu: must come right after its parent popover (and the parent's pointer).
const submenu = (html, cls) => `<div class="pop submenu ${cls}" style="width:220px">${html}</div>`;

// The address shown as text: host bold, path dim.
const addr = (key, { path = true } = {}) => `<span class="addr"><b>${host(key)}</b>${path ? `<span>${SITES[key][2]}</span>` : ""}</span>`;

// The start page's favourites: [key, name]
const FAVS = [["mail", "Mail"], ["cal", "Calendar"], ["gh", "GitHub"], ["news", "Hacker News"], ["maps", "Maps"], ["weather", "Weather"], ["music", "Music"], ["video", "YouTube"]];
