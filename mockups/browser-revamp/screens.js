// Screens that look the same in every layout. They're drawn with Focus's renderers (LAYOUT.b):
// L.frame (the window), L.panel (a frosted card), L.ctx (a right-click menu). Browser's own pages
// come from pages.js. A layout's own drawing of a screen (LAYOUT[id].screens) takes the place of these.

// The workspace switcher: every layout opens this one from its workspace control.
const workspaceSwitcher = () => `<div class="mh">Workspaces</div>${SPACES.map(([l, n, c], i) => `<div class="b-wsr ${i === 0 ? "on" : ""}"><span class="sq" style="--c:${c}">${l}</span><div class="tt"><b>${n}</b><span>${[7, 6, 3][i]} tabs${i === 1 ? " · VPN off" : ""}</span></div><div class="fs">${[["maps", "journal", "weather"], ["gh", "docs", "mail"], ["store", "recipes", "video"]][i].map((k) => fv(k)).join("")}</div></div>`).join("")}
  <div class="b-wsm">${menu([["plus", "New workspace", "Ctrl ⇧ N"], ["sliders", "Edit Trips…", ""], ["workspace", "Move this tab to…", "", { sub: true }]])}</div>
  <p class="b-wsk">${kbd("Ctrl", "1–9")} switch · or swipe with two fingers</p>`;

// Address suggestions: Focus's command bar. `drop` is the version that opens from an address field.
function suggestions({ drop = false } = {}) {
  const r = (ic, main, kind, o = "") => `<div class="b-r ${o}">${ic}<span class="m">${main}</span><span class="k">${kind}</span></div>`;
  return `<div class="b-cq">${I("search")}<span class="typed">trail map<i class="caret"></i></span><span class="b-eng"><span class="fv" style="--c:#de5833">D</span>DuckDuckGo</span></div>
    <div class="b-cl">
      ${r(`<span class="ri">${I("search")}</span>`, "trail map<b> calera ridge</b>", `Search ${kbd("↵")}`, "sel")}
      ${r(`<span class="ri">${I("search")}</span>`, "trail map<b> app offline</b>", "Search")}
      <div class="mh">Tabs</div>
      ${r(fv("maps", "lg"), `<b>Trail</b>heads near Calera <small>maps.example</small>`, "Switch to tab")}
      <div class="mh">Bookmarks and history</div>
      ${r(fv("maps", "lg"), `Ridge loop · <b>trail map</b> <small>in Trips</small>`, `${I("star")} Bookmark`)}
      ${r(fv("journal", "lg"), `Five <b>trail</b>s for a short day <small>yesterday</small>`, "History")}
      <div class="mh">Commands</div>
      ${r(`<span class="ri">${I("split")}</span>`, `Split view with <b>Trailheads near Calera</b>`, kbd("Ctrl", "⇧", "↵"))}
      ${r(`<span class="ri">${I("workspace")}</span>`, `Move this tab to <b>Work</b>`, "Command")}
      ${drop ? "" : r(`<span class="ri">${I("trash")}</span>`, `Clear data for <b>fieldnotes.example</b>`, "Command")}
    </div>
    <div class="b-cf">${kbd("↵")} open ${kbd("Ctrl", "↵")} new tab ${kbd("Tab")} pick an engine ${kbd("/")} commands only<span class="grow"></span>Search with <span class="fv" style="--c:#3d3d3d">W</span><span class="fv" style="--c:#e62117">▶</span><span class="fv" style="--c:#2f9e64">M</span></div>`;
}

const SCREEN_DEFS = {
  site: (L) => L.panel("site", PANELS.site()),
  insecure: (L) => L.panel("site", PANELS.insecure(), { url: "router", page: insecurePage() }),
  permission: (L) => L.panel("permission", PANELS.permission(), { url: "maps", page: mapsPage() }),
  downloads: (L) => L.panel("dl", PANELS.dl()),
  share: (L) => L.panel("share", PANELS.share()),
  vpn: (L) => L.panel("vpn", PANELS.vpn()),
  passwords: (L) => L.panel("pw", PANELS.pw(), { url: "login", page: loginPage({ filled: false }) }),
  video: (L) => L.panel("video", PANELS.video(), { url: "video", page: videoPage() }),
  assistant: (L) => L.panel("ai", PANELS.ai()),
  extensions: (L) => L.panel("ext", PANELS.ext()),
  install: (L) => L.panel("install", PANELS.install()),
  "save-login": (L) => L.panel("savelogin", PANELS.savelogin(), { url: "login", page: loginPage() }),

  context: (L) => L.ctx("link"),
  "context-page": (L) => L.ctx("page"),
  "context-image": (L) => L.ctx("image"),
  "context-text": (L) => L.ctx("text"),
  "tab-menu": (L) => L.ctx("tab"),

  settings: (L) => L.frame({ url: "about:settings", active: "settings", page: settingsPage("settings", L.id) }),
  "settings-general": (L) => L.frame({ url: "about:settings", active: "settings", page: settingsPage("settings-general", L.id) }),
  "settings-privacy": (L) => L.frame({ url: "about:settings", active: "settings", page: settingsPage("settings-privacy", L.id) }),
  "settings-search": (L) => L.frame({ url: "about:settings", active: "settings", page: settingsPage("settings-search", L.id) }),
  "settings-find": (L) => L.frame({ url: "about:settings", active: "settings", page: settingsPage("settings-find", L.id) }),

  history: (L) => L.frame({ url: "about:library", active: "library", page: libraryPage("history") }),
  "library-bookmarks": (L) => L.frame({ url: "about:library", active: "library", page: libraryPage("bookmarks") }),
  "library-downloads": (L) => L.frame({ url: "about:library", active: "library", page: libraryPage("downloads") }),

  addons: (L) => L.frame({ url: "about:extensions", active: "addons", page: extensionsPage() }),
  "addon-detail": (L) => L.frame({ url: "about:extensions", active: "addons", page: extensionPage() }),
  newtab: (L) => L.frame({ url: "newtab", active: "newtab", page: newtabPage() }),
  error: (L) => L.frame({ url: "store", page: errorPage() }),
};
