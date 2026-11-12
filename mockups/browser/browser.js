// Nyx Browser mockups. browser.html?screen=<name>&theme=dark|light|mocha[&w=800][&shot=1]
const Q = new URLSearchParams(location.search);
const THEME = Q.get("theme") || "dark";
const SCREEN = Q.get("screen") || "vertical";
document.documentElement.dataset.theme = THEME;
if (Q.get("shot")) document.documentElement.classList.add("shot");

const PATHS = {
  back: "M15 6l-6 6 6 6", fwd: "M9 6l6 6-6 6", reload: "M20 12a8 8 0 1 1-2.3-5.6M20 4v5h-5",
  sidebar: "M4 5h16v14H4zM9 5v14", lock: "M7 11V8a5 5 0 0 1 10 0v3M6 11h12v9H6z",
  warn: "M12 4l9 16H3zM12 10v4M12 17h.01", star: "M12 4l2.5 5.2 5.5.8-4 3.9 1 5.6L12 17l-5 2.5 1-5.6-4-3.9 5.5-.8z",
  qr: "M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h2v2h-2zM18 14h2M14 20h2M18 18h2v2",
  share: "M12 3v12M8 7l4-4 4 4M5 13v6h14v-6", capture: "M4 8V5h3M17 5h3v3M20 16v3h-3M7 19H4v-3M9 12a3 3 0 1 0 6 0 3 3 0 1 0-6 0",
  assistant: "M12 3l1.8 4.7L18.5 9.5 13.8 11.3 12 16l-1.8-4.7L5.5 9.5l4.7-1.8zM18 15l.9 2.1L21 18l-2.1.9L18 21l-.9-2.1L15 18l2.1-.9z",
  key: "M15 7a4 4 0 1 1-3.5 6L5 19.5V16h3v-3h2.5M16 8h.01", puzzle: "M10 4h4v3a2 2 0 1 0 0 4v3h-3a2 2 0 1 0-4 0H4v-4a2 2 0 1 0 0-4V4h6",
  download: "M12 4v11M7 10l5 5 5-5M5 20h14", settings: "M12 9a3 3 0 1 0 0 6 3 3 0 1 0 0-6M19 12l2 1-1 3-2.2-.3-1.6 1.6.3 2.2-3 1-1-2h-2l-1 2-3-1 .3-2.2-1.6-1.6L3 16l-1-3 2-1v-2L2 9l1-3 2.2.3 1.6-1.6L6.5 2.5l3-1 1 2h2l1-2 3 1-.3 2.2 1.6 1.6L21 6l1 3-2 1z",
  menu: "M4 7h16M4 12h16M4 17h16", more: "M6 12h.01M12 12h.01M18 12h.01", chev: "M8 10l4 4 4-4", plus: "M12 5v14M5 12h14",
  search: "M11 5a6 6 0 1 0 0 12 6 6 0 1 0 0-12M20 20l-4.3-4.3", folder: "M4 7h6l2 2h8v9H4z", folderopen: "M4 7h6l2 2h8v2M4 7v11h14l2-7H8l-2 7",
  x: "M7 7l10 10M17 7L7 17", sound: "M5 10v4h3l4 3V7L8 10zM16 9a4 4 0 0 1 0 6", splitv: "M4 5h16v14H4zM12 5v14",
  check: "M5 12l4 4 10-10", cloud: "M7 18a4 4 0 0 1-.5-8A6 6 0 0 1 18 9a4.5 4.5 0 0 1-1 9z", grid: "M5 5h5v5H5zM14 5h5v5h-5zM5 14h5v5H5zM14 14h5v5h-5z",
  pin: "M9 4h6l-1 6 3 3H7l3-3zM12 13v7", home: "M4 11l8-7 8 7M6 10v10h12V10", browser: "M4 6h16v12H4zM4 10h16",
};
const icon = (n) => `<svg class="i" viewBox="0 0 24 24"><path d="${PATHS[n]}"/></svg>`;
const fav = (letter, color) => `<span class="fv" style="background:${color}">${letter}</span>`;
const SITES = {
  journal: ["Field Notes Journal", "fieldnotes.example", "/2026/11/water-on-the-ridge", fav("F", "#c0843d")],
  docs: ["Firefox Source Docs", "firefox-source-docs.mozilla.org", "/browser/components/tabbrowser", fav("M", "#e66000")],
  mail: ["Inbox · Fastmail", "app.fastmail.com", "/mail/Inbox", fav("@", "#0067b9")],
  gh: ["design-nexus/nyx-browser", "github.com", "/design-nexus/nyx-browser", fav("G", "#24292f")],
  maps: ["Trailheads near Calera", "maps.example", "/search/trailheads", fav("M", "#2f9e64")],
  news: ["Hacker News", "news.ycombinator.com", "/", fav("Y", "#ff6600")],
  music: ["Music · Lo-fi radio", "music.example", "/radio", fav("♪", "#8b5cf6")],
  wiki: ["Gecko · Wikipedia", "en.wikipedia.org", "/wiki/Gecko_(software)", fav("W", "#3d3d3d")],
  cal: ["Calendar", "calendar.example", "/week", fav("C", "#d14836")],
};
const tab = (key, cls = "", extra = "") => {
  const [title, , , f] = SITES[key];
  return `<div class="tab ${cls}">${f}<span class="t">${title}</span>${extra}<span class="x">${icon("x")}</span></div>`;
};

function bar({ sidebarButton = false, url = "journal", insecure = false, focus = false, overflow = false, extraActions = true, address = null } = {}) {
  const [, host, path] = SITES[url];
  const site = address ? `<span class="site">${icon(address.icon)}</span>`
    : insecure
    ? `<span class="site warn">${icon("warn")}Not secure</span>`
    : `<span class="site">${icon("lock")}</span>`;
  const text = address ? (address.placeholder ? `<span class="text" style="color:var(--text-tertiary)">${address.text}</span>` : `<span class="text"><span class="host">${address.text}</span></span>`)
    : `<span class="text"><span class="host">${host}</span><span class="path">${path}</span></span>`;
  const actions = overflow
    ? `<div class="btn" title="Share">${icon("share")}</div><div class="btn hover">${icon("more")}</div>`
    : `<div class="btn">${icon("share")}</div><div class="btn">${icon("capture")}</div><div class="btn">${icon("assistant")}</div>` +
      (extraActions ? `<div class="btn">${icon("key")}</div><div class="btn">${icon("puzzle")}</div>` : "") +
      `<div class="btn">${icon("download")}<span class="badge"></span></div>`;
  return `<div class="bar">
    ${sidebarButton ? `<div class="btn">${icon("sidebar")}</div><div class="sep"></div>` : ""}
    <div class="btn">${icon("back")}</div><div class="btn dim">${icon("fwd")}</div><div class="btn">${icon("reload")}</div>
    <div class="url ${focus ? "focus" : ""}">${site}${text}
      <span class="pa"><div class="btn">${icon("qr")}</div><div class="btn">${icon("star")}</div></span></div>
    ${actions}<div class="sep"></div><div class="btn">${icon("settings")}</div><div class="btn">${icon("menu")}</div>
  </div>`;
}

function sidebar({ active = "journal", hover = "", folderOpen = true } = {}) {
  return `<aside class="side">
    <div class="bar" style="padding:0;gap:2px;height:var(--header)"><div class="btn on">${icon("sidebar")}</div></div>
    <div class="space"><span class="ico">T</span><span class="name">Trips</span><span class="chev">${icon("chev")}</span><div class="btn" title="Search tabs">${icon("search")}</div></div>
    <div class="ess">
      <div class="fav">${SITES.mail[3]}</div><div class="fav">${SITES.cal[3]}</div><div class="fav">${SITES.gh[3]}</div><div class="fav">${SITES.music[3]}</div>
    </div>
    <div class="tabs">
      ${tab("maps", "", `<span class="sound">${icon("pin")}</span>`)}
      <div class="glabel">Folders<div class="btn">${icon("plus")}</div></div>
      <div class="folder">${icon(folderOpen ? "folderopen" : "folder")}<span>Ridge loop</span><span class="count">3</span></div>
      ${folderOpen ? tab("news", "sub") + tab("cal", "sub") : ""}
      <div class="glabel">Today</div>
      ${tab("journal", active === "journal" ? "on" : "")}
      <div class="split-chip">${tab("docs", active === "split" ? "on" : "")}${tab("wiki")}</div>
      ${tab("gh", hover === "gh" ? "hover" : "")}
      ${tab("music", "", `<span class="sound">${icon("sound")}</span>`)}
      <div class="newtab">${icon("plus")}<span class="t">New tab</span></div>
    </div>
    <div class="foot"><span class="ws on">T</span><span class="ws">W</span><span class="ws">H</span><div class="btn" style="width:26px;height:26px">${icon("plus")}</div><span class="keys">F1 Shortcuts</span></div>
  </aside>`;
}

function rail() {
  return `<aside class="side">
    <div class="bar" style="padding:0;height:var(--header);justify-content:center"><div class="btn">${icon("sidebar")}</div></div>
    <div class="space"><span class="ico">T</span></div>
    <div class="ess"><div class="fav">${SITES.mail[3]}</div><div class="fav">${SITES.cal[3]}</div></div>
    <div class="tabs" style="align-items:center">
      ${tab("maps")}<div class="tab">${icon("folder")}</div>${tab("journal", "on")}${tab("docs")}${tab("gh")}${tab("music")}
      <div class="tab" style="color:var(--text-tertiary)">${icon("plus")}</div>
    </div>
    <div class="foot"><span class="ws on">T</span><span class="ws">W</span><span class="ws">H</span></div>
  </aside>`;
}

function hrow({ drop = false } = {}) {
  return `<div class="hrow">
    <span class="chip"><span class="ico">T</span>Trips${icon("chev")}</span>
    ${tab("mail", "pin")}${tab("cal", "pin")}
    <span class="folder">${icon("folder")}Ridge loop<span class="count" style="margin-left:6px">3</span></span>
    ${tab("journal", "on")}
    <span class="split-chip">${tab("docs")}${tab("wiki")}</span>
    ${tab("gh")}${tab("music", "", `<span class="sound">${icon("sound")}</span>`)}
    <div class="newtab">${icon("plus")}</div><span class="gap"></span>
    <div class="btn">${icon("search")}</div>
  </div>${drop ? `<div class="drop" style="left:578px;top:${46 + 4}px;height:28px"></div>` : ""}`;
}

const site = (kind = "") => kind === "docs"
  ? `<div class="site-page docs"><header><b>Firefox Source Docs</b><span>Browser</span><span>Toolkit</span><span>Gecko</span></header>
     <div class="hero"><h1>Tabbrowser</h1><p>The tab strip, tab groups and the tab context menu live in browser/components/tabbrowser.</p></div>
     <pre>gBrowser.addTab(url, {\n  triggeringPrincipal,\n  inBackground: true,\n});</pre></div>`
  : `<div class="site-page"><header><b>Field Notes</b><span>Trips</span><span>Gear</span><span>Maps</span><span>About</span></header>
     <div class="hero"><h1>Water on the ridge: where to fill up between Calera and the saddle</h1>
     <p>Cedar Spring is the only reliable water in late autumn. The creek at the second switchback runs until the first hard frost, and the trough by the old gate is for cattle.</p></div>
     <div class="cards"><div class="card"></div><div class="card"></div><div class="card"></div></div></div>`;

PATHS.chevrons = "M7 7l5 5-5 5M13 7l5 5-5 5";
function bookmarks({ open = false, overflow = false, iconsOnly = false } = {}) {
  const b = (k, label, cls = "") => `<span class="bm ${cls}" title="${label}">${SITES[k][3]}<span class="label">${label}</span></span>`;
  const f = (label, cls = "") => `<span class="bm folder ${cls}">${icon("folder")}<span class="label">${label}</span></span>`;
  return `<div class="bmarks ${iconsOnly ? "icons" : ""}">
    ${b("mail", "Fastmail")}${b("cal", "Calendar")}${b("gh", "GitHub")}
    ${f("Trips", open ? "open" : "")}${f("Reading")}<span class="bsep"></span>
    ${b("news", "Hacker News")}${b("docs", "Firefox Docs")}${overflow ? "" : b("wiki", "Wikipedia") + b("maps", "Maps") + (iconsOnly ? b("music", "Music") + b("journal", "Field Notes") : "")}
    <span class="gap"></span>${overflow ? `<span class="bm more">${icon("chevrons")}</span>` : ""}${f("Other bookmarks")}
  </div>`;
}

function bookmarkFolder() {
  return `<div class="pop menu" style="left:524px;top:76px">
    <div class="mi">${SITES.maps[3]}Trailheads near Calera</div>
    <div class="mi hover">${SITES.journal[3]}Water on the ridge</div>
    <div class="mi">${icon("folder")}Gear lists<span class="k">${icon("fwd")}</span></div>
    <div class="mline"></div>
    <div class="mi">${icon("folderopen")}Open all in tabs</div>
    <div class="mi">${icon("folderopen")}Open all in a split view</div>
  </div>`;
}

const page = (inner = site()) => `<main class="page">${inner}</main>`;

function workspacesMenu() {
  return `<div class="pop menu" style="left:16px;top:84px">
    <div class="mhead">Workspaces</div>
    <div class="mi on"><span class="check">${icon("check")}</span>Trips<span class="k">Ctrl+1</span></div>
    <div class="mi"><span style="width:17px"></span>Work<span class="k">Ctrl+2</span></div>
    <div class="mi hover"><span style="width:17px"></span>Home<span class="k">Ctrl+3</span></div>
    <div class="mline"></div>
    <div class="mi">${icon("plus")}New workspace</div>
    <div class="mi">${icon("settings")}Edit Trips…</div>
  </div>`;
}

function appearancePanel(vertical = true) {
  const sws = ["blue", "violet", "pink", "red", "coral", "amber", "green", "teal", "graphite"]
    .map((n, i) => `<span class="sw${i === 0 ? " on" : ""}" style="background:var(--sw-${n}, var(--accent))"></span>`).join("");
  return `<div class="pop panel" style="right:52px;top:44px">
    <h3>Appearance</h3>
    <div class="opt"><div class="l">Tabs</div><div class="seg"><span class="${vertical ? "on" : ""}">Vertical</span><span class="${vertical ? "" : "on"}">Horizontal</span></div></div>
    <div class="opt"><div class="l">Sidebar<small>${vertical ? "Follows window width" : "Vertical tabs only"}</small></div><div class="seg"><span class="on">Automatic</span><span>Expanded</span><span>Compact</span><span>Hidden</span></div></div>
    <div class="opt"><div class="l">Theme</div><div class="seg"><span class="on">Follow system</span><span>Dark</span><span>Light</span></div></div>
    <div class="opt"><div class="l">Accent<small>Theme default</small></div><div class="swatches">${sws}</div></div>
    <div class="opt"><div class="l">Density</div><div class="seg"><span class="on">Default</span><span>Compact</span><span>Balanced</span><span>Relaxed</span></div></div>
    <div class="switchrow"><span>Frosted menus</span><span class="switch"></span></div>
    <div class="row">All browser settings</div>
  </div>`;
}

function newtab() {
  const tile = (k, n) => `<div class="tilex"><div class="sq">${SITES[k][3]}</div>${n}</div>`;
  return `<div class="ntp">
    <div class="logo">${icon("browser")}</div>
    <div class="search">${icon("search")}Search or enter an address<span class="k">Ctrl+L</span></div>
    <h4>Favorites<span>Edit</span></h4>
    <div class="tiles">${tile("mail", "Fastmail")}${tile("cal", "Calendar")}${tile("gh", "GitHub")}${tile("maps", "Maps")}${tile("music", "Music")}<div class="tilex add"><div class="sq">${icon("plus")}</div>Add</div></div>
    <h4>Frequently visited</h4>
    <div class="tiles">${tile("news", "Hacker News")}${tile("wiki", "Wikipedia")}${tile("docs", "Firefox Docs")}${tile("journal", "Field Notes")}</div>
    <h4>Recent tabs</h4>
    <div class="recent">${tab("journal", "", '<span class="when">2 min ago</span>')}${tab("docs", "", '<span class="when">1 h ago</span>')}</div>
    <div class="weather">${icon("cloud")}Calera · Rain 11°</div>
    <div class="customize">${icon("grid")}Customize</div>
  </div>`;
}

function prefs(pane = "tabs") {
  return `<div class="prefs"><nav>
    <div class="grp">Browser</div>
    <div class="tab">${icon("home")}<span class="t">General</span></div>
    <div class="tab">${icon("settings")}<span class="t">Appearance</span></div>
    <div class="tab ${pane === "tabs" ? "on" : ""}">${icon("sidebar")}<span class="t">Tabs & Sidebar</span></div>
    <div class="tab ${pane === "toolbar" ? "on" : ""}">${icon("menu")}<span class="t">Toolbar</span></div>
    <div class="tab">${icon("assistant")}<span class="t">Nyx Integrations</span></div>
    <div class="grp">Firefox</div>
    <div class="tab">${icon("search")}<span class="t">Search</span></div>
    <div class="tab">${icon("lock")}<span class="t">Privacy & Security</span></div>
    <div class="tab">${icon("puzzle")}<span class="t">Extensions</span></div>
  </nav><main>${pane === "toolbar" ? toolbarPane() : `
    <h2>Tabs & Sidebar</h2>
    <div class="gtitle">Tabs</div>
    <div class="groupcard">
      <div class="prow"><div class="tx">Orientation<small>Switches at once; tabs, workspaces and split views stay as they are</small></div><div class="seg"><span class="on">Vertical</span><span>Horizontal</span></div></div>
      <div class="prow"><div class="tx">Close tabs with a middle click</div><span class="switch on"></span></div>
    </div>
    <div class="gtitle">Sidebar</div>
    <div class="groupcard">
      <div class="prow"><div class="tx">Mode<small>Automatic: expanded from 1400 px, an icon rail from 900 px, hidden below</small></div><div class="seg"><span class="on">Automatic</span><span>Expanded</span><span>Compact</span><span>Hidden</span></div></div>
      <div class="prow"><div class="tx">Reveal a hidden sidebar at the window's edge</div><span class="switch on"></span></div>
    </div>
    <div class="gtitle">Workspaces</div>
    <div class="groupcard">
      <div class="prow"><div class="tx">Show workspace icons at the sidebar's foot</div><span class="switch on"></span></div>
    </div>`}
  </main></div>`;
}

function toolbarPane() {
  return `<h2>Toolbar</h2>
    <div class="gtitle">Top bar</div>
    <div class="groupcard">
      <div class="prow"><div class="tx">Buttons<small>Choose and arrange them; those without room go into More tools</small></div><span class="bm" style="background:var(--tile)">Customize…</span></div>
      <div class="prow"><div class="tx">Show the QR code button in the address field</div><span class="switch on"></span></div>
    </div>
    <div class="gtitle">Bookmarks bar</div>
    <div class="groupcard">
      <div class="prow"><div class="tx">Show the bookmarks bar</div><div class="seg"><span>Always</span><span class="on">New tab only</span><span>Never</span></div></div>
      <div class="prow"><div class="tx">Icons only<small>Bookmarks show just their icon, with the name on hover; folders keep their names</small></div><span class="switch on"></span></div>
    </div>`;
}

function overflowMenu() {
  return `<div class="pop menu" style="right:64px;top:42px">
    <div class="mi">${icon("capture")}Capture<span class="k">Alt+Shift+C</span></div>
    <div class="mi">${icon("assistant")}Assistant<span class="k">Alt+Shift+A</span></div>
    <div class="mi">${icon("key")}Passwords</div>
    <div class="mi">${icon("puzzle")}Extensions</div>
    <div class="mi">${icon("download")}Downloads</div>
  </div>`;
}

const SCREENS = {
  vertical: () => `<div class="win">${win(sidebar(), bar())}</div>`,
  compact: () => `<div class="win rail">${win(rail(), bar())}</div>`,
  hidden: () => `<div class="win nosidebar">${bar({ sidebarButton: true })}<div class="body">${page()}</div><div class="edge"></div></div>`,
  horizontal: () => `<div class="win nosidebar">${bar({ sidebarButton: false })}${hrow()}<div class="body">${page()}</div></div>`,
  "horizontal-drag": () => `<div class="win nosidebar">${bar()}${hrow({ drop: true }).replace('class="tab on"', 'class="tab on" style="opacity:.55"')}<div class="body">${page()}</div><div class="note">Dragging a tab: the marker stands between tabs</div></div>`,
  workspaces: () => `<div class="win">${win(sidebar(), bar())}${workspacesMenu()}</div>`,
  split: () => `<div class="win">${win(sidebar({ active: "split" }), bar({ url: "docs" }), `<main class="page split"><div class="pane">${site()}</div><div class="pane focused">${site("docs")}</div></main>`)}</div>`,
  newtab: () => `<div class="win">${win(sidebar({ active: "" }), bar({ address: { icon: "search", text: "Search or enter an address", placeholder: true } }), `<main class="page">${newtab()}</main>`)}</div>`,
  appearance: () => `<div class="win">${win(sidebar(), bar())}${appearancePanel()}</div>`,
  settings: () => `<div class="win">${win(sidebar({ active: "" }), bar({ address: { icon: "browser", text: "about:preferences#nyxTabs" } }), `<main class="page">${prefs()}</main>`)}</div>`,
  insecure: () => `<div class="win">${win(sidebar(), bar({ insecure: true }))}<div class="tip" style="left:236px;top:46px">The connection to this site isn't secure</div></div>`,
  frosted: () => `<div class="win frost">${win(sidebar(), bar())}${workspacesMenu()}<div class="note">Frosted menus: an option, solid by default</div></div>`,
  "vertical-bookmarks": () => `<div class="win">${win(sidebar(), bar() + bookmarks())}</div>`,
  "horizontal-bookmarks": () => `<div class="win nosidebar">${bar()}${hrow()}${bookmarks()}<div class="body">${page()}</div></div>`,
  "bookmarks-folder": () => `<div class="win">${win(sidebar(), bar() + bookmarks({ open: true }))}${bookmarkFolder()}</div>`,
  "compact-bookmarks": () => `<div class="win rail">${win(rail(), bar() + bookmarks({ overflow: true }))}</div>`,
  "bookmarks-icons": () => `<div class="win">${win(sidebar(), bar() + bookmarks({ iconsOnly: true }))}<div class="tip" style="left:300px;top:78px">Calendar</div></div>`,
  "settings-toolbar": () => `<div class="win">${win(sidebar({ active: "" }), bar({ address: { icon: "browser", text: "about:preferences#nyxToolbar" } }) + bookmarks({ iconsOnly: true }), `<main class="page">${prefs("toolbar")}</main>`)}</div>`,
  "newtab-bookmarks": () => `<div class="win">${win(sidebar({ active: "" }), bar({ address: { icon: "search", text: "Search or enter an address", placeholder: true } }) + bookmarks(), `<main class="page">${newtab()}</main>`)}</div>`,
  overflow: () => `<div class="win rail">${win(rail(), bar({ overflow: true }))}${overflowMenu()}</div>`,
};

function win(side, top, main = page()) {
  return `<div class="body">${side}<div style="flex:1;min-width:0;display:flex;flex-direction:column">${top}<div class="body">${main}</div></div></div>`;
}

document.body.innerHTML = (SCREENS[SCREEN] || SCREENS.vertical)();
