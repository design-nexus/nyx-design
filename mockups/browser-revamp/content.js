// What's in every surface, the same in all three layouts: bookmarks, the web pages, each panel's
// contents, context menus, Settings panes, Library. A layout draws these its own way (dirs/ID.js).
// Sample data is made up (the shots are public).

// ---- Bookmarks: the bar's items, then what the Trips folder holds.
const BOOKMARKS = [
  { key: "news", t: "Hacker News" }, { folder: "Trips", n: 7 }, { key: "maps", t: "Maps" }, { key: "weather", t: "Weather" },
  { folder: "Gear", n: 12 }, { key: "recipes", t: "Trail Kitchen" }, { key: "gh", t: "GitHub" }, { folder: "Reading", n: 9 },
  { key: "wiki", t: "Wikipedia" }, { key: "video", t: "YouTube" }, { key: "store", t: "Peak Outfitters" }, { key: "cal", t: "Calendar" },
];
const TRIPS_FOLDER = [
  { key: "maps", t: "Ridge loop map" }, { key: "weather", t: "Calera forecast" }, { key: "journal", t: "Water on the ridge" },
  { key: "store", t: "Gaiter sizes" }, { folder: "Permits", n: 3 }, { folder: "Campgrounds", n: 5 }, "-",
  { open: "Open all 7 in a new workspace" },
];
const bmItem = (b, cls = "") => b.folder
  ? `<span class="bm folder ${cls}">${I("folder")}<span>${b.folder}</span></span>`
  : `<span class="bm ${cls}">${fv(b.key)}<span>${b.t}</span></span>`;

// ---- Pages in the sheet, besides Field Notes' article (kit.js).
const loginPage = ({ filled = true } = {}) => `<div class="web wl"><header class="w-nav"><b class="w-logo"><span class="w-mark"></span>Field Notes</b><nav><span>Trips</span><span>Gear</span></nav></header>
  <div class="wl-card"><h2>Sign in to Field Notes</h2><label>Email</label><div class="wl-in">${filled ? "mara.q@fieldnotes.example" : ""}</div><label>Password</label><div class="wl-in">${filled ? "•••••••••••••" : ""}</div><div class="wl-btn">Sign in</div><p>New here? <a>Create an account</a></p></div></div>`;
const videoPage = () => `<div class="web wv"><header class="wv-nav"><b><span class="wv-logo">▶</span>YouTube</b><span class="wv-search">Search</span></header>
  <div class="wv-main"><div class="wv-player">${scene("wv-scene")}<div class="wv-bar"><i style="width:34%"></i></div><span class="wv-time">6:21 / 18:42</span></div>
  <h2>Ridge loop in 4K: Calera to the saddle</h2><div class="wv-ch"><span class="w-av"></span><b>Trail Days</b><span>212K subscribers</span></div></div>
  <aside class="wv-side">${[1, 2, 3, 4].map((i) => `<div class="wv-rel"><i></i><span><b>${["Five water sources on the PCT", "Packing light for late autumn", "Calera Ridge at sunrise", "How to filter cattle water"][i - 1]}</b>Trail Days</span></div>`).join("")}</aside></div>`;
const mapsPage = () => `<div class="web wm"><div class="wm-map"><i class="r1"></i><i class="r2"></i><i class="r3"></i><i class="park"></i><i class="lake"></i><b class="mpin p1"></b><b class="mpin p2"></b><b class="mpin p3"></b></div>
  <div class="wm-panel"><div class="wm-search">${I("search")}Trailheads near Calera</div>${["Calera Ridge trailhead · 4.2 mi", "Cedar Spring access · 6.0 mi", "Old Gate lot · 7.1 mi"].map((t) => `<div class="wm-res"><b class="mpin"></b><span>${t}</span></div>`).join("")}</div></div>`;
const insecurePage = () => `<div class="web wr"><div class="wr-card"><div class="wr-logo">Trailhead Wi-Fi</div><h2>Router setup</h2><label>Admin password</label><div class="wl-in">••••••</div><div class="wl-btn">Log in</div><p class="wr-note">Firmware 2.4.1 · router.local</p></div></div>`;
const readerPage = () => `<div class="rd"><div class="rd-col"><div class="rd-site">fieldnotes.example · 6 min read</div><h1>Water on the ridge: where to fill up between Calera and the saddle</h1><div class="rd-by">Mara Quinn · Nov 9, 2026</div>
  <p>Cedar Spring is the only reliable water in late autumn. The creek at the second switchback runs until the first hard frost, and the trough by the old gate is for cattle — filter it twice if you must.</p>
  <p>From the trailhead, follow the ridge loop north for 4.2 miles. The spring sits 200 feet below the saddle on the east side, marked by a stand of incense cedar. In a dry year it slows to a trickle by November; bring a scoop and patience.</p>
  <p>Past the saddle there's nothing reliable until the far trailhead, so carry three liters out of the spring. The creek crossing at mile six is usually dry by October.</p></div></div>`;
const errorPage = () => `<div class="er"><div class="er-ic">${I("globe")}</div><h1>Can't reach peakoutfitters.example</h1><p>The site didn't answer. It may be down, or the address may be wrong.</p>
  <div class="er-btns"><span class="pbtn accent">${I("reload")}Try again</span><span class="pbtn">${I("history")}Open a saved copy</span></div>
  <div class="er-try"><div class="mh">Things to try</div><span>${I("check")}Your connection works: other sites load</span><span>${I("globe")}Turn off VPN for this workspace</span><span>${I("search")}Search for “peakoutfitters gaiters”</span></div>
  <small>DNS_PROBE_FINISHED_NXDOMAIN</small></div>`;

// ---- Panels. A panel is { icon, title, sub, right, blocks: [{ h, right, rows }|{ html }], foot }.
// rows are [lead, title, description, control].
const rowsHtml = (rows) => rows.map(([lead, t, d, c]) => row(t, d, c || "", lead || "")).join("");
const progress = (p) => `<div class="pb"><i style="width:${p}%"></i></div>`;

const PANELS = {
  site: () => ({
    icon: fv("journal", "lg"), title: "fieldnotes.example", sub: `<span class="ok">${I("lock")} Secure connection</span>`, right: `<span class="lnk">Certificate</span>`,
    blocks: [
      { h: "Blocking", rows: [[tile("shield", "var(--sw-coral)"), "14 ads and trackers blocked", "On for this site", sw(true)]] },
      { h: "Logins", rows: [[tile("key", "var(--sw-violet)"), "2 saved logins", "mara.q@fieldnotes.example and 1 more", I("arrow-right", "dimi")]] },
      { h: "Permissions", rows: [[I("location"), "Location", "", drop("Ask")], [I("camera"), "Camera", "", drop("Blocked")], [I("bell"), "Notifications", "", drop("Allowed")], [I("volume"), "Autoplay", "", drop("Block audio")]] },
    ],
    foot: `<span>${I("cookie")} 1.4 MB stored</span><span class="lnk">Clear</span><span class="grow"></span><span class="lnk">Site settings</span>`,
  }),
  insecure: () => ({
    icon: `<span class="tile" style="--c:var(--warning)">${I("warning")}</span>`, title: "router.local", sub: `<span style="color:var(--warning)">${I("warning")} Not secure: sent without encryption</span>`,
    blocks: [
      { html: `<div class="warnbox">Anyone on this network can see what you type here, including passwords. Browser won't fill saved logins on this page.</div>` },
      { h: "This site", rows: [[I("key"), "Don't offer to save logins here", "", sw(true)], [I("shield"), "Blocking", "Nothing blocked here", sw(true)]] },
      { h: "Permissions", rows: [[I("location"), "Location", "", drop("Blocked")], [I("bell"), "Notifications", "", drop("Blocked")]] },
    ],
    foot: `<span class="lnk">Why this matters</span><span class="grow"></span><span class="lnk">Try HTTPS</span>`,
  }),
  permission: () => ({
    icon: fv("maps", "lg"), title: "maps.example wants to know your location", sub: "To show trailheads near you",
    blocks: [{ html: `<div class="permbtns"><span class="pbtn">Block</span><span class="pbtn">Allow once</span><span class="pbtn accent">Allow while visiting</span></div>` },
      { rows: [[I("location"), "Use approximate location", "Within about 3 km, not your exact spot", sw(true)]] }],
    foot: `<span>${I("sliders")} Every site's location requests are in Settings › Privacy</span>`,
  }),
  dl: () => ({
    icon: tile("download", "var(--sw-blue)"), title: "Downloads", sub: "1 downloading · 620 MB", right: `<span class="lnk">Show all</span>`,
    blocks: [
      { h: "Now", rows: [[tile("video", "var(--sw-red)"), "Ridge loop in 4K.webm", `${progress(62)}<span>384 of 620 MB · 48 MB/s · 6 s left</span>`, `<div class="btn">${I("pause")}</div>`]] },
      { h: "Today", rows: [[tile("file", "var(--sw-green)"), "calera-ridge.gpx", "48 KB · maps.example", `<div class="btn">${I("folder")}</div>`], [tile("image", "var(--sw-amber)"), "saddle-panorama.jpg", "3.2 MB · fieldnotes.example", `<div class="btn">${I("folder")}</div>`], [tile("file", "var(--sw-red)"), "permit-application.pdf", `<span style="color:var(--danger)">Failed: the server stopped answering</span>`, `<span class="lnk">Retry</span>`]] },
    ],
    foot: `<span>${I("folder")} ~/Downloads</span><span class="grow"></span><span class="lnk">Clear list</span>`,
  }),
  share: () => ({
    icon: fv("journal", "lg"), title: "Water on the ridge", sub: "fieldnotes.example/2026/11/water-on-the-ridge", right: `<span class="pbtn">${I("link")}Copy</span>`,
    blocks: [
      { h: "Apps", html: `<div class="apps">${[["mail", "Mail", "var(--sw-blue)"], ["note", "Notes", "var(--sw-amber)"], ["message", "Messages", "var(--sw-green)"], ["cloud", "Cloud", "var(--sw-teal)"], ["qr", "QR code", "var(--sw-graphite)"]].map(([ic, l, c]) => `<div class="app"><span class="tile big" style="--c:${c}">${I(ic)}</span><span>${l}</span></div>`).join("")}</div>` },
      { h: "Nearby", rows: [[tile("phone", "var(--sw-green)"), "Pixel 9", "Nearby · Bluetooth", `<span class="pbtn">Send</span>`], [tile("computer", "var(--sw-blue)"), "Office PC", "Online · same account", `<span class="pbtn">Send</span>`]] },
    ],
    foot: `<span>${I("zap")} Copy a clean link without trackers</span><span class="grow"></span>${sw(true)}`,
  }),
  vpn: () => ({
    icon: tile("globe", "var(--sw-teal)"), title: "VPN", sub: `<span class="ok">● Connected · Zurich</span>`, right: sw(true),
    blocks: [
      { html: `<div class="vpnhero"><div class="vflag">CH</div><div><b>Switzerland · Zurich</b><span>NordVPN · 185.12.44.9 · 18 ms</span></div><span class="pbtn">Change</span></div>` },
      { h: "Per workspace", rows: [[`<span class="sq" style="--c:var(--sw-teal)">T</span>`, "Trips", "Through the VPN", drop("Zurich")], [`<span class="sq" style="--c:var(--sw-blue)">W</span>`, "Work", "Direct", drop("Off")], [`<span class="sq" style="--c:var(--sw-amber)">H</span>`, "Home", "Through the VPN", drop("Fastest")]] },
      { html: `<div class="note">${I("shield")} Only Browser's traffic goes through the VPN; other apps don't.</div>` },
    ],
    foot: `<span class="lnk">Add a VPN</span><span class="grow"></span><span class="lnk">VPN settings</span>`,
  }),
  pw: () => ({
    icon: tile("key", "var(--sw-violet)"), title: "Passwords", sub: "fieldnotes.example · Nyx Passwords", right: `<span class="lnk">Open app</span>`,
    blocks: [
      { h: "Logins for this site", rows: [[`<span class="av">M</span>`, "mara.q@fieldnotes.example", "Used today · strong", `<span class="pbtn accent">Fill</span>`], [`<span class="av" style="--c:var(--sw-teal)">E</span>`, "editor@fieldnotes.example", "2 months ago · reused on 1 site", `<span class="pbtn">Fill</span>`]] },
      { h: "Passkey", rows: [[tile("key", "var(--sw-green)"), "Sign in with a passkey", "Saved in Nyx Passwords · fingerprint", `<span class="pbtn">Use</span>`]] },
      { rows: [[I("zap"), "Generate a password", "20 characters · letters, numbers, symbols", I("arrow-right", "dimi")], [I("plus"), "Add a login", "", ""]] },
    ],
    foot: `<span>${I("lock")} Unlocked · locks in 10 minutes</span>`,
  }),
  video: () => ({
    icon: tile("videodl", "var(--sw-red)"), title: "Ridge loop in 4K: Calera to the saddle", sub: "Trail Days · 18:42 · youtube.com",
    blocks: [
      { html: `<div class="vthumb">${scene("vt")}<span>18:42</span></div>` },
      { html: `<div class="vrow">${seg(["Video", "Audio only"], 0)}<span class="grow"></span>${drop("WebM")}</div>` },
      { h: "Quality", rows: [[`<span class="radio on"></span>`, "2160p · 4K", "1.9 GB", ""], [`<span class="radio"></span>`, "1080p", "620 MB", ""], [`<span class="radio"></span>`, "720p", "310 MB", ""]] },
      { rows: [[I("subtitles"), "Subtitles", "English, embedded", sw(true)], [I("folder"), "Save to", "~/Videos", drop("Change")]] },
    ],
    foot: `<span>yt-dlp 2026.08.19</span><span class="grow"></span><span class="pbtn accent">${I("download")}Download 1.9 GB</span>`,
  }),
  ai: () => ({
    icon: tile("assistant", "var(--sw-teal)"), title: "Assistant", sub: "About this page · on this computer",
    blocks: [{ html: `<div class="chat">
      <div class="ctxp">${fv("journal")}<span>Reading <b>Water on the ridge</b></span></div>
      <div class="msg me">Where can I get water past the saddle?</div>
      <div class="msg ai"><p>Nothing reliable past the saddle in late autumn. The article names three sources:</p><ul><li><b>Cedar Spring</b>, 200 ft below the saddle, east side: the only reliable one.</li><li><b>The creek</b> at the second switchback, until the first hard frost.</li><li><b>The trough</b> by the old gate: cattle water, filter twice.</li></ul>
        <div class="src"><span class="chip">${fv("journal")}fieldnotes.example</span><span class="chip">${fv("maps")}Ridge loop map</span></div></div>
      <div class="sugg"><span class="chip">Summarize the page</span><span class="chip">Distances between sources</span></div>
      <div class="ask">${I("assistant")}<span>Ask about this page</span>${kbd("Ctrl", "Space")}</div></div>` }],
  }),
  ext: () => ({
    icon: tile("puzzle", "var(--sw-violet)"), title: "Extensions", sub: "On fieldnotes.example", right: `<span class="lnk">Manage</span>`,
    blocks: [
      { h: "Built into Browser", rows: EXTS.slice(0, 3).map((e) => [extIcon(e), e[0], e[1], sw(e[5])]) },
      { h: "Installed", rows: EXTS.slice(3).map((e) => [extIcon(e), e[0], e[1], `<span class="chip">${e[6] === "On click" ? I("eye") : I("globe")}${e[6]}</span>${sw(e[5])}`]) },
    ],
    foot: `<span class="lnk">${I("search")} Find more extensions</span>`,
  }),
  install: () => ({
    icon: `<span class="xi lg" style="--c:#1f6feb">S</span>`, title: "Add Stash Tabs?", sub: "Version 3.2 · by Stashworks · addons.mozilla.org",
    blocks: [
      { h: "It asks to", rows: [[I("browser"), "See and change your tabs", "Needed to save and restore groups of tabs", ""], [I("bookmark"), "Read and change bookmarks", "It stores stashes as a bookmarks folder", ""], [I("globe"), "Read pages you visit", "Only when you click its button", drop("On click")]] },
      { rows: [[I("private"), "Run in private windows", "", sw(false)], [I("layout"), "Pin its button", "", sw(true)]] },
    ],
    foot: `<span class="grow"></span><span class="pbtn">Cancel</span><span class="pbtn accent">Add extension</span>`,
  }),
  savelogin: () => ({
    icon: tile("key", "var(--sw-violet)"), title: "Save this login?", sub: "fieldnotes.example · to Nyx Passwords",
    blocks: [{ rows: [[I("user"), "mara.q@fieldnotes.example", "Username", ""], [I("lock"), "•••••••••••••", "Strong · not used on other sites", I("eye", "dimi")]] },
      { rows: [[I("folder"), "Vault", "", drop("Personal")]] }],
    foot: `<span class="lnk">Never for this site</span><span class="grow"></span><span class="pbtn">Not now</span><span class="pbtn accent">Save</span>`,
  }),
};

// ---- Context menus: [icon, label, right, options]
const CTX = {
  link: [["plus", "Open in new tab", ""], ["split", "Open beside this page", "", { hover: true }], ["workspace", "Open in workspace", "", { sub: true }], ["private", "Open in private window", ""], ["openin", "Open in another browser", "", { sub: true }], "-",
    ["link", "Copy link", ""], ["zap", "Copy clean link", ""], ["share", "Share link…", ""], ["qr", "QR code", ""], "-",
    ["bookmark", "Bookmark link", ""], ["download", "Save link as…", ""], "-", ["assistant", "Ask Assistant about this link", ""], "-", ["picker", "Hide element", ""], ["code", "Inspect", "Ctrl ⇧ C"]],
  page: [["back", "Back", "Alt ←"], ["reload", "Reload", "Ctrl R"], ["star", "Bookmark page", "Ctrl D"], "-",
    ["share", "Share page…", ""], ["qr", "QR code", ""], ["capture", "Capture", "Ctrl ⇧ X"], ["reader", "Reader view", "F9", { hover: true }], ["translate", "Translate page", ""], ["printer", "Print…", "Ctrl P"], ["file", "Save page…", "Ctrl S"], "-",
    ["assistant", "Summarize with Assistant", ""], "-", ["picker", "Hide element", ""], ["code", "Inspect", "Ctrl ⇧ C"]],
  image: [["image", "Open image in new tab", ""], ["copy", "Copy image", "", { hover: true }], ["link", "Copy image link", ""], ["download", "Save image as…", ""], ["share", "Share image…", ""], "-",
    ["search", "Search with this image", "", { sub: true }], ["assistant", "Describe with Assistant", ""], ["capture", "Edit in Capture", ""], "-", ["picker", "Hide element", ""], ["code", "Inspect", "Ctrl ⇧ C"]],
  text: [["copy", "Copy", "Ctrl C"], ["search", "Search DuckDuckGo for “Cedar Spring”", "", { hover: true }], ["select", "Search with", "", { sub: true }], "-",
    ["assistant", "Explain with Assistant", ""], ["translate", "Translate selection", ""], ["note", "Add to Notes", ""], ["share", "Share selection…", ""], "-", ["code", "Inspect", "Ctrl ⇧ C"]],
  tab: [["plus", "New tab below", ""], ["reload", "Reload", "Ctrl R"], ["copy", "Duplicate", ""], ["pin", "Pin to Essentials", ""], ["sound", "Mute site", ""], "-",
    ["split", "Split with…", "", { sub: true }], ["workspace", "Move to workspace", "", { sub: true, hover: true }], ["folder", "Move to folder", "", { sub: true }], ["moon", "Put to sleep", ""], "-",
    ["link", "Copy link", ""], ["share", "Share…", ""], "-", ["close", "Close tab", "Ctrl W"], ["close", "Close other tabs", ""], ["undo", "Reopen closed tab", "Ctrl ⇧ T"]],
};
// The submenu shown beside the tab menu's "Move to workspace".
const WS_SUB = [{ html: `<div class="mh">Move to</div>` }, ...SPACES.map(([l, n, c], i) => [null, `<span class="sq sm" style="--c:${c}">${l}</span>${n}`, i === 0 ? "Here" : "", { dim: i === 0 }]), "-", ["plus", "New workspace…", ""]];

// ---- Settings: the navigation and each pane's groups of rows ([title, description, control]).
const SETTINGS_NAV = [
  ["Browser", [["settings-general", "sliders", "General", "--sw-graphite"], ["appearance", "palette", "Appearance", "--sw-violet"], ["settings", "layout", "Layout & tabs", "--sw-blue"], ["home", "home", "Start page", "--sw-teal"], ["settings-search", "search", "Search", "--sw-amber"]]],
  ["Privacy", [["settings-privacy", "shield", "Privacy & blocking", "--sw-coral"], ["pw", "key", "Passwords", "--sw-violet"], ["perm", "location", "Permissions", "--sw-green"], ["vpn", "globe", "VPN", "--sw-teal"]]],
  ["Tools", [["sel", "select", "Selection search", "--sw-pink"], ["dl", "download", "Downloads", "--sw-blue"], ["gest", "grip", "Gestures", "--sw-amber"], ["ext", "puzzle", "Extensions", "--sw-violet"], ["sync", "sync", "Sync", "--sw-green"]]],
];
const PANES = {
  settings: (cur) => ({
    title: "Layout & tabs", sub: "How the window is laid out, and how tabs behave",
    top: layoutCards(cur),
    groups: [
      { h: "In this layout", rows: cur === "a" ? [["Sidebar", "", seg(["Expanded", "Compact", "Hidden", "Automatic"], 3)], ["Bookmarks bar", "", seg(["Always", "New tabs", "Never"], 0)], ["Toolbar", "Share, Downloads and Extensions; the rest under ⋯", `<span class="lnk">Customize</span>`]]
        : cur === "b" ? [["Bookmarks shelf", "Bookmarks as tiles above the tabs", seg(["Shown", "Folded", "Hidden"], 0)], ["Clear today's tabs", "Unpinned tabs move to History", drop("Every night")], ["At 800 px", "The sidebar slides over the page", sw(true)]]
        : [["Library rail", "Workspaces, bookmarks, history", seg(["Shown", "Hidden"], 0)], ["Bookmarks bar", "", seg(["Always", "New tabs", "Never"], 0)], ["Tab bar", "Tabs shrink to their icons when there are many", seg(["Shrink", "Scroll"], 0)]] },
      { h: "Tabs", rows: [["Open new tabs", "", drop("After related tabs")], ["After closing a tab, go to", "", drop("The last used tab")], ["Put unused tabs to sleep", "", drop("After 30 minutes")]] },
    ],
  }),
  "settings-general": () => ({
    title: "General", sub: "Startup, files and language",
    groups: [
      { h: "Startup", rows: [["When Browser starts", "", drop("Open last session")], ["Default browser", "Browser opens links from other apps", `<span class="chip ok">${I("check")}Yes</span>`]] },
      { h: "Files", rows: [["Save downloads to", "~/Downloads", drop("Change")], ["Ask where to save each file", "", sw(false)], ["Open PDFs in", "", drop("Nyx PDF")]] },
      { h: "Language", rows: [["Language", "", drop("English (US)")], ["Offer to translate pages", "In languages you don't read", sw(true)], ["Check spelling as you type", "", sw(true)]] },
    ],
  }),
  "settings-privacy": () => ({
    title: "Privacy & blocking", sub: "What sites can see and keep",
    groups: [
      { h: "Content blocking", rows: [["Block ads and trackers", "uBlock Origin, built in · 1,204 this week", sw(true)], ["Filter lists", "8 lists · updated today", `<span class="lnk">Edit</span>`], ["Sites allowed", "3 sites show ads", `<span class="lnk">Manage</span>`]] },
      { h: "Cookies and site data", rows: [["Third-party cookies", "", drop("Blocked")], ["Delete cookies when Browser closes", "Except sites you keep", sw(false)], ["Stored data", "412 MB on 86 sites", `<span class="lnk">Manage</span>`]] },
      { h: "History", rows: [["Keep history", "", drop("For 90 days")], ["Clear history…", "", `<span class="pbtn">Clear</span>`]] },
    ],
  }),
  "settings-search": () => ({
    title: "Search", sub: "Engines, suggestions and keywords",
    groups: [
      { h: "Default engine", rows: [["In the address bar", "", drop("DuckDuckGo")], ["In private windows", "", drop("DuckDuckGo")]] },
      { h: "Suggestions", rows: [["Search suggestions", "From the engine as you type", sw(true)], ["Open tabs, history and bookmarks", "", sw(true)], ["Commands", "Split view, workspaces, site data…", sw(true)]] },
      { h: "Engines and keywords", rows: [[`${fv("wiki")} Wikipedia`, "Type w and a space", `<span class="kbd"><kbd>w</kbd></span>`], [`${fv("video")} YouTube`, "Type yt and a space", `<span class="kbd"><kbd>yt</kbd></span>`], [`${fv("maps")} Maps`, "Type m and a space", `<span class="kbd"><kbd>m</kbd></span>`]] },
    ],
  }),
  "settings-find": () => ({
    title: "Results for “cookies”", sub: "4 settings in 2 panes",
    groups: [
      { h: "Privacy & blocking", rows: [["Third-party <mark>cookies</mark>", "", drop("Blocked")], ["Delete <mark>cookies</mark> when Browser closes", "Except sites you keep", sw(false)], ["Stored data", "<mark>Cookies</mark> and site data: 412 MB on 86 sites", `<span class="lnk">Manage</span>`]] },
      { h: "Permissions", rows: [["Sites that can set <mark>cookies</mark> in private windows", "None", `<span class="lnk">Add</span>`]] },
    ],
  }),
};
// The three layouts as cards, drawn small (Settings and first run).
function layoutCards(cur, big = false) {
  const card = (id, name, d) => `<div class="lc ${cur === id ? "on" : ""} ${big ? "big" : ""}"><div class="lt lt-${id}"><i class="h"></i><i class="bmk"></i><i class="s"></i><i class="p"></i><i class="ins"></i></div><b>${cur === id ? I("check") : ""}${name}</b><span>${d}</span></div>`;
  return `<div class="lcs">${card("a", "Studio", "Header, bookmarks bar, tab sidebar")}${card("b", "Focus", "Sidebar only, command bar")}${card("c", "Workbench", "Tab bar, address bar, Library rail")}</div>`;
}

// ---- Library
const HISTORY = [
  ["Today", [["19:12", "journal", "Water on the ridge · Field Notes"], ["19:04", "maps", "Trailheads near Calera"], ["18:58", "weather", "Calera · 10-day forecast"], ["18:40", "video", "Ridge loop in 4K · Trail Days"], ["17:15", "gh", "design-nexus/nyx-browser"]]],
  ["Yesterday", [["21:30", "recipes", "Camp stove chili · Trail Kitchen"], ["20:02", "store", "Gaiter sizes · Peak Outfitters"], ["14:11", "wiki", "Gecko (software) · Wikipedia"], ["09:45", "news", "Hacker News"]]],
];
const DOWNLOADS = [["video", "Ridge loop in 4K.webm", "620 MB · youtube.com", 62], ["file", "calera-ridge.gpx", "48 KB · maps.example · Today"], ["image", "saddle-panorama.jpg", "3.2 MB · fieldnotes.example · Today"], ["file", "permit-application.pdf", "Failed · permits.example · Today", -1], ["file", "gaiter-size-chart.pdf", "210 KB · peakoutfitters.example · Yesterday"], ["file", "nyx-browser-1.24.2.tar.xz", "92 MB · github.com · Nov 10"]];
// [name, count, selected, depth]
const BM_TREE = [["Bookmarks bar", 12, false, 0], ["Trips", 7, true, 1], ["Permits", 3, false, 2], ["Campgrounds", 5, false, 2], ["Gear", 12, false, 1], ["Reading", 9, false, 1], ["Other bookmarks", 24, false, 0], ["Reading list", 3, false, 0]];
