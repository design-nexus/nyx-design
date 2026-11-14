// Nyx Browser feature mockups, drawn with ../browser/browser.js's helpers (bar, sidebar, icon,
// SITES, win). browser.html?screen=<name>&theme=dark|light|mocha[&shot=1]

Object.assign(PATHS, {
  shield: "M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6z",
  shieldoff: "M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6zM4 4l16 16",
  globe: "M12 3a9 9 0 1 0 0 18 9 9 0 1 0 0-18M3 12h18M12 3c2.5 2.5 3.5 5.5 3.5 9s-1 6.5-3.5 9c-2.5-2.5-3.5-5.5-3.5-9s1-6.5 3.5-9",
  openin: "M14 4h6v6M20 4l-9 9M18 14v6H4V6h6",
  videodl: "M4 6h11v12H4zM15 10l5-3v10l-5-3M9.5 9v5.5M7.2 12.3l2.3 2.3 2.3-2.3",
  copy: "M9 9h10v10H9zM5 15V5h10",
  link: "M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1",
  mail: "M4 6h16v12H4zM4 7l8 6 8-6",
  note: "M6 4h9l3 3v13H6zM9 10h6M9 14h6",
  message: "M4 5h16v11H9l-5 4z",
  phone: "M8 3h8v18H8zM11 18h2",
  computer: "M4 5h16v11H4zM9 20h6M12 16v4",
  tablet: "M6 3h12v18H6zM11 18h2",
  files: "M4 7h6l2 2h8v9H4zM12 11v5M9.5 13.5L12 16l2.5-2.5",
  picker: "M12 3v4M12 17v4M3 12h4M17 12h4M12 9a3 3 0 1 0 0 6 3 3 0 1 0 0-6",
  zap: "M13 3L5 14h6l-1 7 8-11h-6z",
  popup: "M4 5h16v14H4zM4 9h16M13 12h4v4h-4z",
  image: "M4 5h16v14H4zM4 16l5-5 4 4 2-2 5 5M15 9h.01",
  eye: "M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12zM12 9a3 3 0 1 0 0 6 3 3 0 1 0 0-6",
  font: "M5 19L11 5h2l6 14M8 14h8",
  code: "M9 8l-4 4 4 4M15 8l4 4-4 4",
  user: "M12 4a4 4 0 1 0 0 8 4 4 0 1 0 0-8M5 20c1-4 4-6 7-6s6 2 7 6",
  passkey: "M9 4a3.5 3.5 0 1 0 0 7 3.5 3.5 0 1 0 0-7M3 20c.7-3.5 3-5.5 6-5.5 1 0 2 .2 2.8.6M17 12a2 2 0 1 0 0 4 2 2 0 1 0 0-4M17 16v5M17 19h2",
  usbkey: "M9 3h6v7H9zM7 10h10v6a5 5 0 0 1-10 0z",
  dice: "M5 5h14v14H5zM9 9h.01M15 15h.01M15 9h.01M9 15h.01M12 12h.01",
  music: "M9 18V6l10-2v12M9 18a3 3 0 1 1-3-3 3 3 0 0 1 3 3M19 16a3 3 0 1 1-3-3 3 3 0 0 1 3 3",
  subtitles: "M4 6h16v12H4zM7 13h4M13 13h4M7 15.5h7",
  clock: "M12 4a8 8 0 1 0 0 16 8 8 0 1 0 0-16M12 8v4l3 2",
  grip: "M9 6h.01M15 6h.01M9 12h.01M15 12h.01M9 18h.01M15 18h.01",
  moon: "M20 14A8 8 0 1 1 10 4a6.5 6.5 0 0 0 10 10",
  command: "M9 6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3z",
  gesture: "M12 3a5 5 0 0 1 5 5v8a5 5 0 0 1-10 0V8a5 5 0 0 1 5-5M12 7v3",
  history: "M4 12a8 8 0 1 0 2.3-5.6M4 4v4h4M12 8v4l3 2",
  bookmark: "M7 4h10v16l-5-4-5 4z",
  trash: "M5 7h14M10 7V4h4v3M7 7l1 13h8l1-13",
  upload: "M12 16V4M7 9l5-5 5 5M5 20h14",
  private: "M3 10c3-1 6-1 9 1 3-2 6-2 9-1-.5 4-3 6-5 6s-3-1.5-4-3c-1 1.5-2 3-4 3s-4.5-2-5-6z",
  play: "M8 5l11 7-11 7z",
  eyeoff: "M3 3l18 18M10.6 6.1A9.5 9.5 0 0 1 22 12s-1 1.8-3 3.5M6.5 6.6C3.9 8.2 2 12 2 12s3.5 6 10 6c1.7 0 3.2-.4 4.5-1",
  select: "M5 5h14v6H5zM8 15h8M10 19h4",
  flag: "M5 21V4M5 4h12l-2 4 2 4H5",
  bolt: "M13 3L5 14h6l-1 7 8-11h-6z",
  dup: "M8 8h12v12H8zM4 16V4h12",
  undo: "M9 14L4 9l5-5M4 9h10a6 6 0 0 1 0 12h-3",
  arrowup: "M12 19V5M6 11l6-6 6 6",
  layers: "M12 4l9 5-9 5-9-5zM3 14l9 5 9-5",
  refresh: "M20 12a8 8 0 1 1-2.3-5.6M20 4v5h-5",
});

Object.assign(SITES, {
  video: ["Ridge loop in 4K: Calera to the saddle", "youtube.com", "/watch?v=r1dge-l00p", fav("▶", "#ff0033")],
  signin: ["Sign in · Field Notes", "fieldnotes.example", "/login", fav("F", "#c0843d")],
  ghlogin: ["Sign in to GitHub", "github.com", "/login", fav("G", "#24292f")],
});

// ---- the Passwords icon: options to choose from ----

const dot = (x, y, r = 0.9) => `M${x - r} ${y}a${r} ${r} 0 1 0 ${2 * r} 0 ${r} ${r} 0 1 0-${2 * r} 0`;
const star = (x, y) => `M${x} ${y - 2.2}v4.4M${x - 1.9} ${y - 1.1}l3.8 2.2M${x - 1.9} ${y + 1.1}l3.8-2.2`;
const PW_ICONS = {
  a: ["Shield and lock", "The Passwords app's own icon, as a line drawing. Content blocking's shield would change to another icon", "M12 2.5l8 3.2v5.6c0 5-3.4 9-8 10.7-4.6-1.7-8-5.7-8-10.7V5.7zM10.1 11.2V9.6a1.9 1.9 0 0 1 3.8 0v1.6M8.8 11.2h6.4v4.9H8.8z"],
  b: ["Password field", "A field of hidden characters, like a login form's", `M4.5 7h15a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-15a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2z${dot(7.5, 12, 1.1)}${dot(12, 12, 1.1)}${dot(16.5, 12, 1.1)}`],
  c: ["Padlock with a password", "A lock with hidden characters inside it", `M7.5 10.5V8a4.5 4.5 0 0 1 9 0v2.5M5.5 10.5h13a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1h-13a1 1 0 0 1-1-1v-8.5a1 1 0 0 1 1-1z${dot(8.6, 15.8)}${dot(12, 15.8)}${dot(15.4, 15.8)}`],
  d: ["Key", "A plain key, drawn level so it reads at toolbar size", "M7 7.8a4.2 4.2 0 1 0 0 8.4 4.2 4.2 0 1 0 0-8.4M11.2 12H22M19.2 12v3.6M15.9 12v2.7"],
  e: ["Account and lock", "A person with a lock: your logins", "M9.5 4a3.5 3.5 0 1 0 0 7 3.5 3.5 0 1 0 0-7M3 20c.6-3.6 3.2-5.8 6.5-5.8 1 0 1.9.2 2.7.5M15.5 16v-1.3a2 2 0 0 1 4 0V16M14.5 16h6v4.5h-6z"],
  f: ["The app's tile", "Nyx Passwords' own icon in colour, as extensions show theirs", null],
};
const PW = (SCREEN.match(/^pwicon-([a-f])$/) || [])[1] || Q.get("pw") || "d";
PATHS.block = "M12 3a9 9 0 1 0 0 18 9 9 0 1 0 0-18M5.6 5.6l12.8 12.8";
function pwi(k = PW) {
  if (k === "key") return icon("key");
  if (k === "f") {
    return `<svg class="i pwtile" viewBox="0 0 24 24"><rect x="1" y="1" width="22" height="22" rx="6.5" fill="#2a2b31" stroke="#4b8ef5" stroke-opacity=".5" stroke-width="1"/>
      <path d="M12 4.6l5.6 2.1v3.9c0 3.6-2.3 6.4-5.6 7.8-3.3-1.4-5.6-4.2-5.6-7.8V6.7z" fill="#6aa5fb" stroke="none"/>
      <path d="M10.6 11.2v-1.1a1.4 1.4 0 0 1 2.8 0v1.1" stroke="#16161a" stroke-width="1.4"/><rect x="9.8" y="11" width="4.4" height="3.6" rx=".8" fill="#16161a" stroke="none"/></svg>`;
  }
  return `<svg class="i" viewBox="0 0 24 24"><path d="${PW_ICONS[k][2]}"/></svg>`;
}

function pwBoard() {
  const opt = (k, i) => {
    const [name, sub] = PW_ICONS[k];
    const b = (n) => `<div class="btn">${icon(n)}</div>`;
    return `<div class="pwopt"><div class="hero">${pwi(k)}</div><b>${"ABCDEF"[i]} · ${name}</b><small>${sub}</small>
      <div class="samples"><div class="strip">${b("share")}${b("capture")}${b("assistant")}<div class="btn on">${pwi(k)}</div>${b("puzzle")}${b("globe")}</div>
      <div class="mini-in"><span class="nk">${pwi(k)}</span></div><div class="mini-nav">${pwi(k)}Passwords</div></div></div>`;
  };
  return `<div class="board"><h1>The Passwords icon</h1>
    <p>Six options, each in the top bar beside its neighbours, inside a login field and in Settings. The next six shots put each one on the login page with the field menu.</p>
    <div class="pwgrid">${"abcdef".split("").map(opt).join("")}</div></div>`;
}

// ---- small pieces ----

const L = (ch, color, size = 16, r = 4) =>
  `<span class="fv" style="background:${color};width:${size}px;height:${size}px;border-radius:${r}px;font-size:${Math.round(size * 0.55)}px">${ch}</span>`;
const sw = (on = true) => `<span class="switch ${on ? "on" : ""}"></span>`;
const segx = (opts, on = 0) => `<div class="seg">${opts.map((o, i) => `<span class="${i === on ? "on" : ""}">${o}</span>`).join("")}</div>`;
const sel = (v) => `<span class="selectx"><span class="sv">${v}</span>${icon("chev")}</span>`;
const pbtn = (t, cls = "") => `<span class="pbtn ${cls}">${t}</span>`;
const prow = (title, note, ctl) => `<div class="prow"><div class="tx">${title}${note ? `<small>${note}</small>` : ""}</div>${ctl}</div>`;
const card = (title, rows, note = "") => `<div class="gtitle">${title}</div><div class="groupcard">${note ? `<div class="cnote">${note}</div>` : ""}${rows.join("")}</div>`;
const chip = (t, x = true) => `<span class="chipx">${t}${x ? icon("x") : ""}</span>`;
const flag = (cc) => `<span class="flag ${cc}"></span>`;

const BROWSERS = {
  firefox: ["Firefox", "#e66000", "F"],
  chromium: ["Chromium", "#4c8bf5", "C"],
  vivaldi: ["Vivaldi", "#ef3939", "V"],
  zen: ["Zen Browser", "#2b2a33", "Z"],
};
const bico = (k, size = 18) => L(BROWSERS[k][2], BROWSERS[k][1], size, size / 2);

const ENGINES = [
  ["Google", "G", "#4285f4"], ["DuckDuckGo", "D", "#de5833"], ["Wikipedia", "W", "#3d3d3d"],
  ["YouTube", "▶", "#ff0033"], ["Maps", "M", "#2f9e64"], ["Reddit", "r", "#ff4500"],
  ["GitHub", "G", "#24292f"], ["Translate", "T", "#1a73e8"], ["Amazon", "a", "#ff9900"],
];

// The top bar with the new buttons: video and the shield in the address field; VPN and Open in
// beside Passwords and Extensions.
function fbar({ url = "journal", address = null, shield = 23, video = false, on = "", vpn = true } = {}) {
  const [, host, path] = SITES[url];
  const b = (n, ic, extra = "") => `<div class="btn ${on === n ? "on" : ""}" data-a="${n}">${icon(ic)}${extra}</div>`;
  const site = `<span class="site" data-a="site">${icon(address ? address.icon : "lock")}</span>`;
  const text = address
    ? `<span class="text"><span class="host">${address.text}</span></span>`
    : `<span class="text"><span class="host">${host}</span><span class="path">${path}</span></span>`;
  const pa = (video ? `<div class="btn vid ${on === "video" ? "on" : ""}" data-a="video">${icon("videodl")}</div>` : "") +
    (shield !== null ? `<div class="btn shieldb ${on === "shield" ? "on" : ""}" data-a="shield">${icon(PW === "a" ? "block" : "shield")}<span class="cnt">${shield}</span></div>` : "") +
    `<div class="btn">${icon("qr")}</div><div class="btn">${icon("star")}</div>`;
  return `<div class="bar">
    <div class="btn">${icon("back")}</div><div class="btn dim">${icon("fwd")}</div><div class="btn">${icon("reload")}</div>
    <div class="url">${site}${text}<span class="pa">${pa}</span></div>
    ${b("share", "share")}${b("capture", "capture")}${b("assistant", "assistant")}<div class="btn ${on === "key" ? "on" : ""}" data-a="key">${pwi()}</div>${b("puzzle", "puzzle")}
    ${b("vpn", "globe", vpn ? '<span class="badge ok"></span>' : "")}${b("openin", "openin")}${b("download", "download", '<span class="badge"></span>')}
    <div class="sep"></div><div class="btn">${icon("settings")}</div><div class="btn">${icon("menu")}</div>
  </div>`;
}

// ---- pages ----

function journal({ mark = false, promo = false, link = false } = {}) {
  const lead = mark ? `<mark class="selx">Cedar Spring</mark>` : "Cedar Spring";
  const rest = link
    ? ` is the only reliable water in late autumn. See the <u class="lnk" data-a="lnk">Cedar Spring water report</u> for this week's flow. The creek at the second switchback runs until the first hard frost.`
    : " is the only reliable water in late autumn. The creek at the second switchback runs until the first hard frost, and the trough by the old gate is for cattle.";
  return `<div class="site-page"><header><b>Field Notes</b><span>Trips</span><span>Gear</span><span>Maps</span><span>About</span></header>
    <div class="hero"><h1>Water on the ridge: where to fill up between Calera and the saddle</h1><p>${lead}${rest}</p></div>
    ${promo ? `<div class="promo" data-a="promo"><span class="ad">Sponsored</span><b>Ultralight water filters</b><span>30% off this week only</span><span class="shop">Shop now</span></div>` : ""}
    <div class="cards"><div class="card"></div><div class="card"></div><div class="card"></div></div></div>`;
}

function videoPage() {
  return `<div class="site-page vidpage"><header><b><span class="yt">▶</span>Tube</b><span class="sbox">Search</span></header>
    <div class="vwrap"><div class="player"><div class="play">${icon("play")}</div><div class="scrub"><span></span></div><div class="time">4:12 / 18:42</div></div>
    <div class="vmeta"><h1>Ridge loop in 4K: Calera to the saddle</h1><p>Trail Days · 182K views · 3 days ago</p></div></div>
    <div class="vside">${[1, 2, 3, 4].map((i) => `<div class="vs"><span class="th t${i}"></span><span><b>${["Water sources on the ridge", "Packing light for late autumn", "Calera trailhead walkthrough", "Night hike: the saddle"][i - 1]}</b><small>Trail Days · ${[12, 9, 22, 31][i - 1]} min</small></span></div>`).join("")}</div></div>`;
}

function signin({ menu = "", gh = false } = {}) {
  const name = gh ? "GitHub" : "Field Notes";
  return `<div class="site-page signin ${gh ? "gh" : ""}"><header><b>${name}</b>${gh ? "" : "<span>Trips</span><span>Gear</span><span>Maps</span>"}</header>
    <div class="form"><div class="logo">${gh ? "G" : "F"}</div><h1>Sign in to ${name}</h1>
      <label>Email or username</label><div class="in focus" data-a="field"><span class="caret"></span><span class="nk">${pwi()}</span>${menu}</div>
      <label>Password</label><div class="in"><span class="nk">${pwi()}</span></div>
      <div class="go">Sign in</div>${gh ? `<div class="go alt" data-a="pk">${icon("passkey")}Sign in with a passkey</div>` : ""}
      <p class="small">New here? <u>Create an account</u></p></div></div>`;
}

// ---- settings ----

const NAV = [
  ["Browser", [["general", "home", "General"], ["appearance", "settings", "Appearance"], ["tabs", "sidebar", "Tabs & Sidebar"], ["toolbar", "menu", "Toolbar"],
    ["selection", "select", "Selection Search"], ["downloads", "download", "Downloads"], ["gestures", "gesture", "Gestures"], ["integrations", "assistant", "Nyx Integrations"]]],
  ["Privacy", [["passwords", "pw", "Passwords"], ["blocking", "shield", "Content Blocking"], ["vpn", "globe", "VPN"]]],
  ["Firefox", [["search", "search", "Search"], ["privacy", "lock", "Privacy & Security"], ["extensions", "puzzle", "Extensions"]]],
];
function settingsPage(pane, title, body) {
  return `<div class="prefs"><nav>${NAV.map(([g, items]) => `<div class="grp">${g}</div>` +
    items.map(([id, ic, t]) => `<div class="tab ${id === pane ? "on" : ""}">${ic === "pw" ? pwi() : icon(ic)}<span class="t">${t}</span></div>`).join("")).join("")}
  </nav><main>${title ? `<h2>${title}</h2>` : ""}${body}</main></div>`;
}
const settingsShot = (hash, pane, title, body, extra = "") =>
  `<div class="win">${win(sidebar({ active: "" }), fbar({ address: { icon: "browser", text: `about:preferences#${hash}` }, shield: null }), `<main class="page">${settingsPage(pane, title, body)}</main>`)}${extra}</div>`;

// ---- selection search ----

function selectionPopup() {
  const e = ENGINES.slice(0, 8).map(([n, c, col], i) => `<span class="e ${i === 0 ? "hover" : ""}" title="${n}">${L(c, col, 20, 5)}</span>`).join("");
  return `<div class="ssp" data-anchor-sel>
    <div class="q"><span>Cedar Spring</span><span class="caret"></span><span class="k">Enter · Google</span></div>
    <div class="ic"><span class="e">${icon("copy")}</span><span class="e">${icon("link")}</span><span class="vs"></span>${e}<span class="e">${icon("more")}</span></div>
  </div>`;
}

function settingsSelection() {
  const eng = ENGINES.slice(0, 7).map(([n, c, col], i) => `<div class="prow eng">${`<span class="grip">${icon("grip")}</span>`}${L(c, col, 18, 5)}<div class="tx">${n}<small>${["Keyword g · the default", "Keyword d", "Keyword w", "Keyword yt", "Keyword m", "Keyword r", "Keyword gh"][i]}</small></div>${sw(i !== 5)}${sw(i < 3)}</div>`).join("");
  return settingsShot("nyxSelection", "selection", "Selection Search", `
    ${card("Popup", [
      prow("Show the popup", "When you select text on a page", segx(["On selection", "Holding Alt", "Middle-click", "Off"])),
      prow("Edit the text before searching", "A text box above the icons, with the selection in it", sw(true)),
      prow("Icon size", "", segx(["Small", "Medium", "Large"], 1)),
    ])}
    <div class="gtitle cols">Engines<span>Popup</span><span>Menu</span></div>
    <div class="groupcard">${eng}<div class="prow"><div class="tx"><small style="margin:0">Drag to reorder. Engines from Firefox's search settings appear here too.</small></div>${pbtn(`${icon("plus")}Add engine`)}</div></div>
    ${card("Results", [
      prow("Open results in", "", segx(["New tab next to this one", "Background tab", "This tab"])),
      prow("Turned off on", "", `<div class="chips">${chip("docs.google.com")}${chip("figma.com")}${pbtn(`${icon("plus")}Add`, "small")}</div>`),
    ])}`);
}

// ---- video downloads ----

function videoPanel() {
  const q = [["2160p", "4K · VP9", "1.9 GB"], ["1440p", "VP9", "1.1 GB"], ["1080p", "H.264 · your default", "620 MB"], ["720p", "H.264", "310 MB"], ["480p", "H.264", "140 MB"]];
  return `<div class="pop panelx vpanel" data-anchor="video" data-align="center" style="width:380px">
    <div class="vhead"><span class="th t1"><i>18:42</i></span><div class="tl"><b>Ridge loop in 4K: Calera to the saddle</b><small>Trail Days · youtube.com</small></div></div>
    ${segx([`Video`, `Audio only`])}
    <div class="qlist">${q.map(([r, f, s], i) => `<div class="pr ${i === 2 ? "on" : ""}"><span class="radio ${i === 2 ? "on" : ""}"></span><b>${r}</b><span class="grow dimt">${f}</span><span class="dimt">${s}</span></div>`).join("")}</div>
    <div class="pc"><div class="pr">${icon("subtitles")}<span class="grow">Subtitles<small>English, embedded</small></span>${sw(true)}</div>
    <div class="pr">${icon("folder")}<span class="grow">Save to<small>~/Videos</small></span>${pbtn("Change", "small")}</div></div>
    <div class="pfoot"><span class="dimt grow" style="font-size:11.5px">yt-dlp 2026.10.22</span>${pbtn("Cancel")}${pbtn(`${icon("download")}Download`, "primary")}</div>
  </div>`;
}

function downloadsPanel() {
  const job = (th, title, meta, pct, state = "") => `<div class="dl"><span class="th ${th}"></span><div class="tl"><b>${title}</b>
    ${pct !== null ? `<div class="prog ${state}"><span style="width:${pct}%"></span></div>` : ""}<small>${meta}</small></div><div class="btn">${icon(pct === null ? "folder" : "x")}</div></div>`;
  const file = (ic, title, meta) => `<div class="dl"><span class="fico">${icon(ic)}</span><div class="tl"><b>${title}</b><small>${meta}</small></div><div class="btn">${icon("folder")}</div></div>`;
  return `<div class="pop panelx" data-anchor="download" style="width:380px">
    <div class="ph"><div class="tl"><b>Downloads</b></div>${pbtn("Clear", "link")}</div>
    ${job("t1", "Ridge loop in 4K: Calera to the saddle", "1080p · 386 of 620 MB · 48 MB/s · 5 s left", 62)}
    ${job("t2", "Packing light for late autumn", "Merging video and audio…", 100, "busy")}
    ${file("music", "Lo-fi radio session.opus", "Audio · 84 MB · done")}
    ${file("download", "ridge-loop-map.pdf", "2.4 MB · maps.example · done")}
    <div class="row" style="margin-top:6px">Show all downloads</div>
  </div>`;
}

function settingsDownloads() {
  return settingsShot("nyxDownloads", "downloads", "Downloads", `
    ${card("Files", [
      prow("Save files to", "~/Downloads", pbtn("Change…")),
      prow("Ask where to save each file", "", sw(false)),
      prow("Open the Downloads panel when a download starts", "", sw(true)),
    ])}
    ${card("Videos", [
      prow("Offer to download videos", "The download icon in the address field, on sites yt-dlp supports", sw(true)),
      prow("Default quality", "", segx(["Best", "1080p", "720p", "Ask each time"], 1)),
      prow("Audio only as", "", segx(["Opus", "M4A", "MP3"])),
      prow("Save videos to", "~/Videos", pbtn("Change…")),
      prow("File names", "Ridge loop in 4K [Trail Days].mp4", sel("Title [Channel]")),
      prow("Embed subtitles, chapters and the thumbnail", "", sw(true)),
      prow("Videos that need you signed in", "yt-dlp uses Browser's sign-in for that site, and only that site", sw(true)),
      prow("yt-dlp", "2026.10.22 · /usr/bin/yt-dlp · updated with the system", pbtn("Check now")),
    ])}`);
}

// ---- VPN ----

Object.assign(PATHS, {
  star: "M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z",
  chevdown: "M6 9l6 6 6-6",
  chevup: "M6 15l6-6 6 6",
});

// The Location section with search and favourites, as Control Center has them: favourites first
// (Fastest, then starred places), the search field, and every country with its cities. `view`:
// "favorites" (the list's start), "countries" (a country opened) or "search" ("san" typed).
function vpnLocations(view) {
  const star = (on) => `<span class="vstar ${on ? "on" : ""}" title="${on ? "Remove from favourites" : "Add to favourites"}">${icon("star")}</span>`;
  const place = (cc, name, sub, { on = false, fav = false, indent = false, open = null, note = "" } = {}) =>
    `<div class="pr vpl ${on ? "on" : ""} ${indent ? "ind" : ""}">${indent ? "" : flag(cc)}<span class="grow">${name}${sub ? `<small>${sub}</small>` : ""}${note ? `<small class="vnote">${note}</small>` : ""}</span>${on ? `<span class="check">${icon("check")}</span>` : ""}${open !== null ? `<span class="vexp" title="Cities in ${name}">${icon(open ? "chevup" : "chevdown")}</span>` : ""}${star(fav)}</div>`;
  const favorites = `<div class="vgroup">Favourites</div><div class="pc">
      <div class="pr vpl">${icon("bolt")}<span class="grow">Fastest server<small>Wherever NordVPN is quickest now</small></span></div>
      ${place("us", "Atlanta", "United States", { on: true, fav: true })}
      ${place("se", "Sweden", "Whole country", { fav: true })}
      ${place("nl", "Amsterdam", "Netherlands", { fav: true })}
    </div>`;
  const search = (q) => `<div class="vsearch ${q ? "typed" : ""}">${icon("search")}<span class="${q ? "" : "dimt"}">${q || "Find a country or city"}</span>${q ? `<span class="caret"></span><span class="vclear">${icon("x")}</span>` : ""}</div>`;
  let list;
  if (view === "search") {
    list = `<div class="vlist">
      <div class="vgroup">Countries</div>
      ${place("sm", "San Marino", "", {})}
      <div class="vgroup">Cities</div>
      ${place("us", "San Francisco", "United States")}
      ${place("cl", "Santiago", "Chile", { note: "No NordVPN proxy here right now" })}
      ${place("us", "San Jose", "United States")}
      ${place("es", "San Sebastián", "Spain")}
    </div>`;
  } else if (view === "countries") {
    list = `<div class="vlist">
      ${place("ch", "Switzerland", "")}
      ${place("gb", "United Kingdom", "")}
      ${place("us", "United States", "", { open: true })}
      ${place("", "Atlanta", "", { indent: true, on: true, fav: true })}
      ${place("", "Chicago", "", { indent: true })}
      ${place("", "Dallas", "", { indent: true })}
      ${place("", "Denver", "", { indent: true })}
      ${place("", "Los Angeles", "", { indent: true })}
    </div>`;
  } else {
    list = `<div class="vlist">
      ${place("al", "Albania", "", { open: false })}
      ${place("ar", "Argentina", "", { open: false })}
      ${place("au", "Australia", "", { open: false })}
      ${place("at", "Austria", "", { open: false })}
      ${place("be", "Belgium", "", { open: false })}
    </div>`;
  }
  return `${favorites}${search(view === "search" ? "san" : "")}${list}`;
}

function vpnPanel(view = null) {
  const loc = (cc, name, sub, on = false) => `<div class="pr ${on ? "on" : ""}">${flag(cc)}<span class="grow">${name}<small>${sub}</small></span>${on ? `<span class="check">${icon("check")}</span>` : `<span class="dimt">${sub.split("·")[1] || ""}</span>`}</div>`;
  const where = view ? "NordVPN · Atlanta, United States #11590" : "NordVPN · Netherlands #842";
  return `<div class="pop panelx" data-anchor="vpn" style="width:374px">
    <div class="ph"><span class="badgeico ok">${icon("globe")}</span><div class="tl"><b>Connected</b><small>${where}</small></div>${sw(true)}</div>
    <div class="stats"><div><small>Server</small>${view ? "us11590.nordvpn.com" : "185.107.56.12"}</div><div><small>Latency</small>${view ? "31 ms" : "18 ms"}</div><div><small>Covers</small>Browser only</div></div>
    <div class="mhead">Location</div>
    ${view ? vpnLocations(view) : `<div class="pc">${loc("nl", "Netherlands", "Amsterdam · 18 ms", true)}${loc("us", "United States", "New York · 92 ms")}${loc("de", "Germany", "Frankfurt · 24 ms")}${loc("jp", "Japan", "Tokyo · 231 ms")}
    <div class="pr">${icon("bolt")}<span class="grow">Fastest server</span><span class="dimt">${icon("fwd")}</span></div></div>`}
    <div class="mhead">Use it for</div>
    ${segx(["Every workspace", "Trips only"], 1)}
    <div class="row" style="margin-top:10px">VPN settings</div>
  </div>`;
}

function settingsVpn(extra = "") {
  return settingsShot("nyxVpn", "vpn", "VPN", `
    ${card("Connections", [
      `<div class="prow">${L("N", "#4687ff", 26, 7)}<div class="tx">NordVPN<small>Connected · Netherlands #842 · HTTPS proxy</small></div>${pbtn("Disconnect")}<div class="btn">${icon("more")}</div></div>`,
      `<div class="prow">${L("M", "#294d73", 26, 7)}<div class="tx">Mullvad<small>WireGuard · mullvad-se-got-wg-001.conf</small></div>${pbtn("Connect")}<div class="btn">${icon("more")}</div></div>`,
      `<div class="prow"><div class="tx"><small style="margin:0">Only Browser's traffic goes through these. Logins are kept in Nyx Passwords.</small></div>${pbtn(`${icon("plus")}Add VPN`, "primary")}</div>`,
    ])}
    ${card("Workspaces", [
      prow(`<span class="wsi">T</span>Trips`, "", sel(`${flag("nl")}NordVPN · Netherlands`)),
      prow(`<span class="wsi">W</span>Work`, "", sel("No VPN")),
      prow(`<span class="wsi">H</span>Home`, "", sel(`${flag("se")}Mullvad · Sweden`)),
    ])}
    ${card("Protection", [
      prow("Stop browsing if the VPN drops", "Pages wait instead of loading without it", sw(true)),
      prow("Look up addresses through the VPN", "DNS goes with the traffic, not to your network's server", sw(true)),
      prow("Keep calls from showing your real address", "WebRTC uses the VPN too", sw(true)),
      prow("Sites that skip the VPN", "", `<div class="chips">${chip("localhost")}${chip("*.local")}${chip("192.168.1.0/24")}${chip("bank.example")}${pbtn(`${icon("plus")}Add`, "small")}</div>`),
    ])}`, extra);
}

function vpnAdd() {
  const p = [["NordVPN", "N", "#4687ff", true], ["Surfshark", "S", "#1ec2b3"], ["Private Internet Access", "P", "#4bb543"], ["Windscribe", "W", "#0b2b4c"],
    ["Mullvad", "M", "#294d73", false, "WireGuard"], ["Proton VPN", "P", "#6d4aff", false, "WireGuard"], ["WireGuard file", "⌁", "#88171a", false, ".conf"], ["Proxy", "⇄", "#5b6178", false, "SOCKS5 · HTTPS"]];
  return `<div class="veil"></div><div class="sheet" style="width:600px">
    <h3>Add a VPN</h3><p class="dimt">Browser connects through your provider's servers; the rest of the computer doesn't.</p>
    <div class="pgrid">${p.map(([n, c, col, on, sub]) => `<div class="prov ${on ? "on" : ""}">${L(c, col, 30, 9)}<b>${n}</b><small>${sub || "Sign in"}</small></div>`).join("")}</div>
    <div class="fieldl">Service username</div><div class="inx">qL9dW2xK4mNbV7ZfTc3Ra</div>
    <div class="fieldl">Service password</div><div class="inx dots">••••••••••••••••••••••</div>
    <p class="dimt small">Not your NordVPN account password: <u>find your service credentials</u> under Manual setup in your Nord Account.</p>
    <div class="pfoot" style="margin-top:18px"><span class="grow"></span>${pbtn("Cancel")}${pbtn("Add NordVPN", "primary")}</div>
  </div>`;
}

// ---- open in another browser ----

function openInMenu() {
  const r = (k, kbd = "", on = false) => `<div class="mi ${on ? "on" : ""}">${bico(k)}<span>${BROWSERS[k][0]}</span>${kbd ? `<span class="k">${kbd}</span>` : ""}</div>`;
  return `<div class="pop menu" data-anchor="openin" style="width:330px">
    <div class="mhead">Open this page in</div>
    ${r("firefox", "Ctrl+Shift+O", true)}${r("chromium")}${r("vivaldi")}${r("zen")}
    <div class="mline"></div>
    <div class="mi">${icon("private")}In a private window<span class="k">${icon("fwd")}</span></div>
    <div class="mi">${icon("flag")}Always open fieldnotes.example in…<span class="k">${icon("fwd")}</span></div>
    <div class="mline"></div>
    <div class="mi dim">${icon("settings")}The button opens Firefox in one click</div>
  </div>`;
}

function linkMenu() {
  return `<div class="pop menu" data-anchor="lnk" data-align="left" data-dy="2" style="width:310px">
    <div class="mi">${icon("plus")}Open link in new tab</div>
    <div class="mi">${icon("browser")}Open link in new window</div>
    <div class="mi">${icon("private")}Open link in private window</div>
    <div class="mline"></div>
    <div class="mi">${bico("firefox")}Open link in Firefox</div>
    <div class="mi hover">${icon("openin")}Open link in<span class="k">${icon("fwd")}</span></div>
    <div class="mline"></div>
    <div class="mi">${icon("bookmark")}Bookmark link</div>
    <div class="mi">${icon("copy")}Copy link</div>
    <div class="mi">${icon("share")}Share link<span class="k">${icon("fwd")}</span></div>
    <div class="mline"></div>
    <div class="mi">${icon("search")}Search Google for “Cedar Spring…”<span class="k">${icon("fwd")}</span></div>
  </div><div class="pop menu sub" style="width:200px">
    <div class="mi">${bico("chromium")}Chromium</div><div class="mi">${bico("vivaldi")}Vivaldi</div><div class="mi">${bico("zen")}Zen Browser</div>
  </div>`;
}

// ---- content blocking ----

function shieldPanel() {
  const t = (ic, n, on) => `<div class="tg ${on ? "on" : ""}">${icon(ic)}<small>${n}</small></div>`;
  return `<div class="pop panelx" data-anchor="shield" data-align="center" style="width:350px">
    <div class="ph"><span class="badgeico">${icon("shield")}</span><div class="tl"><b>fieldnotes.example</b><small>Blocking ads and trackers</small></div>${sw(true)}</div>
    <div class="big"><b>23</b><span>blocked on this page<small>4 of 9 domains connected · 1,482 since Browser started</small></span></div>
    <div class="tools">${pbtn(`${icon("picker")}Pick an element`)}${pbtn(`${icon("zap")}Zap one`)}</div>
    <div class="mhead">On this site</div>
    <div class="tgs">${t("popup", "Pop-ups", true)}${t("image", "Large media", false)}${t("eye", "Cosmetic", true)}${t("font", "Web fonts", false)}${t("code", "JavaScript", false)}</div>
    <div class="row" style="margin-top:10px;justify-content:space-between">Content blocking settings<span class="dimt">uBlock Origin ${icon("fwd")}</span></div>
  </div>`;
}

function pickerBar() {
  return `<div class="picker" data-anchor="promo" data-pick></div><div class="pickbar">
    <span class="badgeico">${icon("picker")}</span>
    <div class="tl"><small>Hide this element on fieldnotes.example</small><span class="mono">fieldnotes.example##.promo-banner</span></div>
    <div class="slider"><small>Broader</small><span class="track"><i></i></span><small>Exact</small></div>
    ${pbtn("Preview")}${pbtn("Cancel")}${pbtn("Hide", "primary")}
  </div>`;
}

function settingsBlocking() {
  const list = (n, sub, on) => prow(n, sub, sw(on));
  return settingsShot("nyxBlocking", "blocking", "Content Blocking", `
    ${card("Blocking", [
      prow("Block ads and trackers", "uBlock Origin 1.67 · lists updated 2 hours ago", `${pbtn(`${icon("refresh")}Update now`)}${sw(true)}`),
    ])}
    ${card("Filter lists", [
      list("uBlock filters", "Ads, privacy, badware, quick fixes", true),
      list("EasyList and EasyPrivacy", "", true),
      list("Peter Lowe's list", "", true),
      list("Cookie notices", "EasyList Cookie", true),
      list("Annoyances", "AdGuard: social widgets, pop-ups, newsletters", false),
      prow("Regional lists", "", sel("None")),
    ])}
    ${card("Sites", [
      prow("Not blocked on", "", `<div class="chips">${chip("bank.example")}${chip("calendar.example")}${pbtn(`${icon("plus")}Add`, "small")}</div>`),
      prow("My filters", "3 rules", pbtn("Edit…")),
    ])}
    ${card("Also", [
      prow("Reject cookie banners", "Firefox answers them for you, refusing where it can", sw(true)),
      prow("Remove tracking from links", "utm_, fbclid and the like, when you open or copy a link", sw(true)),
      prow("Advanced", "uBlock Origin's own dashboard: the logger, dynamic rules, backups", pbtn("Open…")),
    ])}`);
}

// ---- passwords ----

function fieldMenu() {
  const acct = (n, s, c) => `<div class="row2">${L(c, "#c0843d", 26, 7)}<span class="grow"><b>${n}</b><small>${s}</small></span></div>`;
  return `<div class="pwmenu">
    <div class="head"><span class="mark">${pwi()}</span><span class="name">Passwords</span><span class="host">fieldnotes.example</span></div>
    <div class="row2 on">${L("K", "#c0843d", 26, 7)}<span class="grow"><b>ken@design-nex.us</b><small>Field Notes · used today</small></span><span class="gochev">${icon("fwd")}</span></div>
    ${acct("ken.trail", "Field Notes · old account", "K")}
    <div class="sep"></div>
    <div class="row2">${icon("dice")}<span class="grow">Suggest a strong password</span></div>
    <div class="row2">${pwi()}<span class="grow">Open Passwords</span><span class="kb">Alt+Shift+Y</span></div>
  </div>`;
}

function passwordsPanel() {
  const row = (n, s, c, col, on = false) => `<div class="lrow ${on ? "on" : ""}">${L(c, col, 30, 8)}<span class="grow"><b>${n}</b><small>${s}</small></span></div>`;
  return `<div class="pop pwpanel" data-anchor="key" data-align="right">
    <header><span class="brand">${pwi()}</span><label class="search">${icon("search")}<span>Search Passwords</span><kbd>/</kbd></label><div class="btn">${icon("dice")}</div><div class="btn">${icon("settings")}</div></header>
    <div class="panes"><aside>
      ${segx(["All", "Logins", "Cards", "Notes"])}
      <div class="glab">On this page <span class="host">fieldnotes.example</span></div>
      ${row("Field Notes", "ken@design-nex.us", "F", "#c0843d", true)}${row("Field Notes", "ken.trail", "F", "#c0843d")}
      <div class="glab">Vault</div>
      ${row("Fastmail", "ken@fastmail.com", "@", "#0067b9")}${row("GitHub", "design-nexus · passkey", "G", "#24292f")}${row("Calendar", "ken", "C", "#d14836")}${row("Visa ···· 4417", "Ken Ramos · 08/29", "V", "#1a1f71")}
    </aside><section>
      <div class="dhead">${L("F", "#c0843d", 46, 13)}<div><b>Field Notes</b><small>fieldnotes.example</small></div></div>
      <div class="dbar">${pbtn(`${icon("arrowup")}Autofill`, "primary")}${pbtn(`${icon("copy")}Copy password`)}${pbtn("Edit")}</div>
      <div class="fields">
        <div class="fld"><div><small>Username</small>ken@design-nex.us</div><div class="btn">${icon("copy")}</div></div>
        <div class="fld"><div><small>Password</small><span class="secret">••••••••••••••</span></div><div class="btn">${icon("eye")}</div><div class="btn">${icon("copy")}</div></div>
        <div class="fld"><div><small>One-time code</small><span class="code">482 913</span></div><span class="ring">17</span><div class="btn">${icon("copy")}</div></div>
        <div class="fld"><div><small>Website</small><span class="lnkc">https://fieldnotes.example</span></div></div>
      </div>
      <div class="slab">Notes</div><div class="fields"><div class="fld"><div class="dimt">Trail journal account. Recovery codes in the vault's “Field Notes codes” note.</div></div></div>
    </section></div>
  </div>`;
}

function saveBar() {
  return `<div class="pop savebar" data-anchor="key" data-align="right">
    <div class="sbh"><span class="mark">${pwi()}</span><b>Save this login to Passwords?</b><span class="host">fieldnotes.example</span></div>
    <div class="fields small"><div class="fld"><div><small>Username</small>ken@design-nex.us</div></div><div class="fld"><div><small>Password</small><span class="secret">•••••••••••</span></div><div class="btn">${icon("eye")}</div></div></div>
    <div class="pfoot">${pbtn("Never for this site", "link")}<span class="grow"></span>${pbtn("Not now")}${pbtn("Save", "primary")}</div>
  </div>`;
}

function passkeySheet() {
  return `<div class="pop panelx pk" data-anchor="site" data-align="left" style="width:400px">
    <div class="ph"><span class="badgeico">${icon("passkey")}</span><div class="tl"><b>Sign in to github.com with a passkey</b><small>From Nyx Passwords</small></div></div>
    <div class="pc">
      <div class="pr on">${L("G", "#24292f", 26, 7)}<span class="grow">design-nexus<small>Passkey · created 3 Oct</small></span><span class="check">${icon("check")}</span></div>
      <div class="pr">${L("G", "#24292f", 26, 7)}<span class="grow">ken-ramos<small>Passkey · created 12 Aug</small></span></div>
    </div>
    <p class="dimt small" style="margin:2px 4px 12px">Passwords asks for your password or fingerprint before signing.</p>
    <div class="pfoot">${pbtn(`${icon("usbkey")}Use a security key instead`, "link")}<span class="grow"></span>${pbtn("Cancel")}${pbtn("Continue", "primary")}</div>
  </div>`;
}

function settingsPasswords() {
  return settingsShot("nyxPasswords", "passwords", "Passwords", `
    <div class="groupcard"><div class="prow"><span class="pwbrand">${pwi()}</span><div class="tx">Nyx Passwords<small>Connected · unlocked · 148 items. Browser keeps no passwords of its own.</small></div>${pbtn("Open Passwords")}${pbtn("Lock")}</div></div>
    ${card("Filling", [
      prow("Fill logins when a page loads", "Only when the site has one login, on HTTPS", sw(true)),
      prow("Show the key in login fields", "Click it, or the field, for this site's logins", sw(true)),
      prow("Copy the one-time code after filling", "", sw(true)),
      prow("Cards and addresses", "", segx(["Fill both", "Cards only", "Off"])),
    ])}
    ${card("Saving", [
      prow("Offer to save new logins and changed passwords", "", sw(true)),
      prow("Suggest strong passwords for new accounts", "", sw(true)),
      prow("Never saved on", "4 sites", pbtn("Manage…")),
    ])}
    ${card("Passkeys", [
      prow("Use passkeys from Nyx Passwords", "Sites ask Passwords first; a security key only when you choose one", sw(true)),
      prow("Save new passkeys in Nyx Passwords", "", sw(true)),
    ])}
    ${card("Firefox's saved logins", [
      prow("12 logins saved in this profile before Passwords", "Import them, then they're removed from the profile", pbtn(`${icon("upload")}Import into Passwords`)),
    ])}`);
}

// ---- tabs ----

function settingsTabs() {
  return settingsShot("nyxTabs", "tabs", "Tabs & Sidebar", `
    ${card("Tabs", [
      prow("Orientation", "Switches at once; tabs, workspaces and split views stay as they are", segx(["Vertical", "Horizontal"])),
      prow("Close tabs with a middle click", "", sw(true)),
    ])}
    ${card("New tabs", [
      prow("Open new tabs", "", segx(["Next to this one", "After related tabs", "At the end"], 1)),
      prow("Open bookmarks in", "", segx(["A new tab", "A background tab", "This tab"])),
      prow("Address bar and search results open in", "Alt+Enter does the other", segx(["This tab", "A new tab"])),
      prow("Links from other apps open in", "", segx(["A new tab", "A new window", "This tab"])),
      prow("New tab page", "", sel("Dashboard")),
    ])}
    ${card("Closing tabs", [
      prow("After closing a tab, go to", "", segx(["Last used", "The left", "The right", "Its opener"])),
      prow("Ask before closing a window with several tabs", "", sw(true)),
      prow("Keep the window open after its last tab", "", sw(false)),
    ])}`);
}

function settingsTabs2() {
  return settingsShot("nyxTabs", "tabs", "", `
    ${card("Tab bar", [
      prow("Double-clicking a tab", "", sel("Renames it")),
      prow("Close buttons", "", segx(["Always", "On hover", "Active tab only"], 1)),
      prow("Switch tabs with the mouse wheel over them", "", sw(false)),
      prow("Show a preview when hovering a tab", "", sw(true)),
      prow("Pinned tabs keep their address", "Going elsewhere opens a new tab", sw(true)),
    ])}
    ${card("Switching", [
      prow("Ctrl+Tab goes through tabs", "", segx(["Recently used", "In order"])),
      prow("Show the tabs while switching", "", sw(true)),
    ])}
    ${card("Hibernation", [
      prow("Hibernate background tabs after", "They stay in place and reload when you come back", sel("30 minutes")),
      prow("Never hibernate", "", `<div class="chips">${chip("Tabs playing sound", false)}${chip("Pinned tabs", false)}${chip("calendar.example")}</div>`),
      prow("Load restored tabs only when you open them", "", sw(true)),
    ])}
    ${card("Startup", [
      prow("When Browser starts", "", segx(["Continue where you left off", "A new tab", "Home pages"])),
      prow("Sessions", "Save the open tabs under a name and reopen them later", `${pbtn("Save open tabs…")}${pbtn("3 saved")}`),
    ])}`);
}

function tabMenu() {
  return `<div class="pop menu" data-anchor="tabgh" data-align="left" data-dx="176" data-dy="-14" style="width:260px">
    <div class="mi">${icon("reload")}Reload tab</div>
    <div class="mi">${icon("dup")}Duplicate tab</div>
    <div class="mi">${icon("pin")}Pin tab</div>
    <div class="mi">${icon("note")}Rename tab</div>
    <div class="mline"></div>
    <div class="mi hover">${icon("moon")}Hibernate tab</div>
    <div class="mi">${icon("moon")}Hibernate other tabs</div>
    <div class="mline"></div>
    <div class="mi">${icon("layers")}Move to workspace<span class="k">${icon("fwd")}</span></div>
    <div class="mi">${bico("firefox")}Open in Firefox</div>
    <div class="mline"></div>
    <div class="mi">${icon("x")}Close tab<span class="k">Ctrl+W</span></div>
  </div>`;
}

// ---- share ----

function sharePanel(qrMode = false) {
  const tile = (ic, label, c) => `<div class="stile"><span class="sc" style="--c:var(--sw-${c})">${icon(ic)}</span>${label}</div>`;
  const dev = (ic, name, status, cls = "") => `<div class="sdev ${cls}"><span class="sa">${icon(ic)}<i></i></span><b>${name}</b><small>${status}</small></div>`;
  const pageCard = `<div class="spage"><span class="sfav">${SITES.journal[3]}</span><div class="tl"><b>Water on the ridge: where to fill up between Calera and the saddle</b><small>fieldnotes.example</small></div><div class="btn" title="Copy link">${icon("copy")}</div></div>`;
  if (qrMode) {
    return `<div class="pop panelx sharep" data-anchor="share" data-align="center">
      <div class="ph"><div class="btn">${icon("back")}</div><div class="tl"><b>QR code</b></div></div>
      ${pageCard}
      <div class="qrbox">${qr(196)}</div>
      <p class="dimt" style="text-align:center;margin:10px 0 12px">Point your phone's camera at it to open the page</p>
      <div class="pfoot" style="justify-content:center">${pbtn(`${icon("copy")}Copy image`)}${pbtn(`${icon("download")}Save`)}</div>
    </div>`;
  }
  return `<div class="pop panelx sharep" data-anchor="share" data-align="center">
    ${pageCard}
    <div class="stiles">${tile("copy", "Copy link", "graphite")}${tile("qr", "QR code", "violet")}${tile("mail", "Mail", "blue")}${tile("note", "Notes", "amber")}
      ${tile("message", "Messages", "green")}${tile("cloud", "Cloud", "teal")}${tile("files", "Files", "coral")}${tile("openin", "Firefox", "pink")}</div>
    <div class="mhead">Nearby</div>
    <div class="sdevs">${dev("phone", "Ken's Pixel", "Nearby", "ok")}${dev("computer", "Office PC", "Online", "ok")}${dev("tablet", "Kitchen tablet", "Asleep", "off")}</div>
    <div class="sfoot">${icon("share")}<span class="grow">More in Share…</span>${icon("fwd")}</div>
  </div>`;
}

function qr(size) {
  const n = 25, c = size / n;
  let seed = 11, s = "";
  const rnd = () => (seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;
  const corner = (x, y) => (x < 8 && y < 8) || (x >= n - 8 && y < 8) || (x < 8 && y >= n - 8);
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
    let on;
    if (corner(x, y)) {
      const fx = x < 8 ? x : x - (n - 7), fy = y < 8 ? y : y - (n - 7);
      on = fx >= 0 && fx <= 6 && fy >= 0 && fy <= 6 && (fx === 0 || fx === 6 || fy === 0 || fy === 6 || (fx >= 2 && fx <= 4 && fy >= 2 && fy <= 4));
    } else on = rnd() > 0.5;
    if (on) s += `<rect x="${(x * c).toFixed(2)}" y="${(y * c).toFixed(2)}" width="${(c + 0.4).toFixed(2)}" height="${(c + 0.4).toFixed(2)}"/>`;
  }
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" fill="#16161e">${s}</svg>`;
}

// ---- suggestions ----

function quickCommands() {
  const r = (ic, t, sub, k = "", on = false) => `<div class="qr2 ${on ? "on" : ""}">${ic}<span class="grow">${t}${sub ? `<small>${sub}</small>` : ""}</span>${k ? `<span class="kb">${k}</span>` : ""}</div>`;
  return `<div class="veil"></div><div class="qc">
    <div class="qin">${icon("command")}<span>water</span><span class="caret"></span><span class="kb">F2</span></div>
    <div class="qbody">
      <div class="mhead">Tabs</div>
      ${r(SITES.journal[3], "Water on the ridge: where to fill up…", "Open tab · Trips", "Switch", true)}
      <div class="mhead">Bookmarks and history</div>
      ${r(icon("bookmark"), "Water sources on the ridge (map)", "maps.example · Bookmarks › Trips")}
      ${r(icon("history"), "Cedar Spring water report", "fieldnotes.example · visited yesterday")}
      <div class="mhead">Commands</div>
      ${r(icon("moon"), "Hibernate other tabs", "", "")}
      ${r(icon("openin"), "Open this page in Firefox", "", "Ctrl+Shift+O")}
      ${r(icon("videodl"), "Download this page's video", "", "")}
      <div class="mhead">Settings</div>
      ${r(icon("settings"), "Selection Search › Show the popup", "", "")}
    </div>
    <div class="qfoot"><span><span class="kb">↑↓</span> choose</span><span><span class="kb">Enter</span> open</span><span><span class="kb">Tab</span> narrow to a section</span><span class="grow"></span><span>Tabs, bookmarks, history, commands and settings</span></div>
  </div>`;
}

function settingsGestures() {
  const g = (d, name, act) => `<div class="prow"><svg class="gst" viewBox="0 0 48 30"><path d="${d}"/><circle cx="${d.split(/[ML ]/).filter(Boolean)[0]}" cy="${d.split(/[ML ]/).filter(Boolean)[1]}" r="2.6"/></svg><div class="tx">${name}</div>${sel(act)}</div>`;
  return settingsShot("nyxGestures", "gestures", "Gestures", `
    ${card("Mouse gestures", [
      prow("Draw with the right mouse button held", "Release to do the action; a short click still opens the menu", sw(true)),
      prow("Show the trail while drawing", "", sw(true)),
      prow("Rocker gestures", "Hold right and click left to go back, the other way to go forward", sw(false)),
    ])}
    <div class="gtitle">Gestures</div><div class="groupcard">
      ${g("M40 15 L8 15", "Left", "Back")}${g("M8 15 L40 15", "Right", "Forward")}${g("M24 26 L24 4 L24 26", "Up, down", "Reload")}
      ${g("M24 4 L24 26", "Down", "New tab")}${g("M12 4 L12 24 L38 24", "Down, right", "Close tab")}${g("M38 24 L12 24 L12 4", "Left, up", "Reopen closed tab")}
      ${g("M8 24 L24 6 L40 24", "Up and over", "Hibernate other tabs")}${g("M10 6 L38 6 L38 26", "Right, down", "Open in Firefox")}
      <div class="prow"><div class="tx"><small style="margin:0">Any command from Quick Commands can have a gesture.</small></div>${pbtn(`${icon("plus")}Add gesture`)}</div>
    </div>`);
}

// ---- screens ----

const FEATURES = {
  "pwicon-board": () => pwBoard(),
  ...Object.fromEntries("abcdef".split("").map((k) => [`pwicon-${k}`, () => `<div class="win">${win(sidebar({ active: "" }), fbar({ url: "signin", shield: 2 }), page(signin({ menu: fieldMenu() })))}<div class="note show">${"ABCDEF"["abcdef".indexOf(k)]} · ${PW_ICONS[k][0]}</div></div>`])),
  "selection-popup": () => `<div class="win">${win(sidebar(), fbar(), page(journal({ mark: true })))}${selectionPopup()}<div class="tip" data-tip-sel>Google · middle-click for a background tab</div></div>`,
  "settings-selection": settingsSelection,
  "video-panel": () => `<div class="win">${win(sidebar({ active: "" }), fbar({ url: "video", video: true, on: "video", shield: 41 }), page(videoPage()))}${videoPanel()}</div>`,
  "video-progress": () => `<div class="win">${win(sidebar({ active: "" }), fbar({ url: "video", video: true, on: "download", shield: 41 }), page(videoPage()))}${downloadsPanel()}</div>`,
  "settings-downloads": settingsDownloads,
  "vpn-panel": () => `<div class="win">${win(sidebar(), fbar({ on: "vpn" }))}${vpnPanel()}</div>`,
  "vpn-favorites": () => `<div class="win">${win(sidebar(), fbar({ on: "vpn" }))}${vpnPanel("favorites")}</div>`,
  "vpn-countries": () => `<div class="win">${win(sidebar(), fbar({ on: "vpn" }))}${vpnPanel("countries")}</div>`,
  "vpn-search": () => `<div class="win">${win(sidebar(), fbar({ on: "vpn" }))}${vpnPanel("search")}</div>`,
  "vpn-add": () => settingsVpn(vpnAdd()),
  "settings-vpn": () => settingsVpn(),
  "open-in": () => `<div class="win">${win(sidebar(), fbar({ on: "openin" }))}${openInMenu()}</div>`,
  "open-in-link": () => `<div class="win">${win(sidebar(), fbar(), page(journal({ link: true })))}${linkMenu()}</div>`,
  "shield-panel": () => `<div class="win">${win(sidebar(), fbar({ on: "shield" }), page(journal({ promo: true })))}${shieldPanel()}</div>`,
  "shield-picker": () => `<div class="win picking">${win(sidebar(), fbar({ on: "shield" }), page(journal({ promo: true })))}${pickerBar()}</div>`,
  "settings-blocking": settingsBlocking,
  "passwords-field": () => `<div class="win">${win(sidebar({ active: "" }), fbar({ url: "signin", shield: 2 }), page(signin({ menu: fieldMenu() })))}</div>`,
  "passwords-panel": () => `<div class="win">${win(sidebar({ active: "" }), fbar({ url: "signin", shield: 2, on: "key" }), page(signin()))}${passwordsPanel()}</div>`,
  "passwords-save": () => `<div class="win">${win(sidebar(), fbar({ on: "key" }))}${saveBar()}</div>`,
  passkey: () => `<div class="win">${win(sidebar({ active: "" }), fbar({ url: "ghlogin", shield: 0 }), page(signin({ gh: true })))}${passkeySheet()}</div>`,
  "settings-passwords": settingsPasswords,
  "settings-tabs": settingsTabs,
  "settings-tabs-2": settingsTabs2,
  "tab-hibernated": () => `<div class="win hibshot">${win(sidebar(), fbar())}${tabMenu()}</div>`,
  share: () => `<div class="win">${win(sidebar(), fbar({ on: "share" }))}${sharePanel()}</div>`,
  "share-qr": () => `<div class="win">${win(sidebar(), fbar({ on: "share" }))}${sharePanel(true)}</div>`,
  "quick-commands": () => `<div class="win">${win(sidebar(), fbar())}${quickCommands()}</div>`,
  "settings-gestures": settingsGestures,
};

document.body.innerHTML = (FEATURES[SCREEN] || FEATURES["selection-popup"])();

// Hibernated tabs: dimmed, with a moon; the context menu opens on one of them.
if (SCREEN === "tab-hibernated") {
  for (const t of document.querySelectorAll(".side .tab")) {
    const name = t.querySelector(".t")?.textContent || "";
    if (/nyx-browser|Hacker News|Gecko/.test(name)) {
      t.classList.add("hib");
      t.querySelector(".x")?.insertAdjacentHTML("beforebegin", `<span class="moon">${icon("moon")}</span>`);
    }
    if (/nyx-browser/.test(name)) t.dataset.a = "tabgh";
  }
}

// Panels open under the button, field or element they belong to.
for (const p of document.querySelectorAll("[data-anchor]")) {
  const a = document.querySelector(`[data-a="${p.dataset.anchor}"]`);
  if (!a) continue;
  const r = a.getBoundingClientRect();
  const dx = Number(p.dataset.dx || 0), dy = Number(p.dataset.dy || 0);
  if (p.hasAttribute("data-pick")) {
    Object.assign(p.style, { left: `${r.left - 4}px`, top: `${r.top - 4}px`, width: `${r.width + 8}px`, height: `${r.height + 8}px` });
    continue;
  }
  p.style.top = `${r.bottom + 6 + dy}px`;
  const align = p.dataset.align || "right";
  if (align === "right") p.style.left = `${Math.min(r.right, innerWidth - 8) - p.offsetWidth + dx}px`;
  else if (align === "left") p.style.left = `${r.left + dx}px`;
  else p.style.left = `${Math.min(r.left + r.width / 2 - p.offsetWidth / 2, innerWidth - 8 - p.offsetWidth) + dx}px`;
}

// The selection popup sits under the selected words; its tooltip under the first engine.
const mark = document.querySelector(".selx");
const ssp = document.querySelector(".ssp");
if (mark && ssp) {
  const r = mark.getBoundingClientRect();
  ssp.style.left = `${r.left - 8}px`;
  ssp.style.top = `${r.bottom + 8}px`;
  const e = ssp.querySelector(".e.hover").getBoundingClientRect();
  const tip = document.querySelector("[data-tip-sel]");
  tip.style.left = `${e.left}px`;
  tip.style.top = `${e.bottom + 10}px`;
}

// The link menu's submenu beside its row.
const sub = document.querySelector(".menu.sub");
if (sub) {
  const row = [...document.querySelectorAll(".mi.hover")].pop().getBoundingClientRect();
  sub.style.left = `${row.right + 10}px`;
  sub.style.top = `${row.top - 6}px`;
}
