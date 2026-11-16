// Studio: today's frame, refined. A header across the top (navigation, a centred address with one
// Site button, Share, Downloads, Extensions and ⋯, Settings, the menu), the bookmarks bar under it,
// the tab sidebar, the page as an inset sheet. Only the frame is Studio's: its menus and panels are
// Focus's (screens.js), and its pages are pages.js.
(() => {
  const SIDE = 236, HEAD = 46, BAR = 30;

  const site = (count = 14) => `<span class="a-site">${I("lock")}<i></i>${I("shield")}<b>${count}</b></span>`;

  function header({ narrow = false, url = "journal", typed = null, on = "", priv = false, find = false } = {}) {
    const insecure = INSECURE.has(url);
    const field = typed !== null
      ? `<div class="a-url focus">${I("search")}<span class="typed">${typed}<i class="caret"></i></span></div>`
      : url === "newtab"
      ? `<div class="a-url">${I("search")}<span class="ph">Search or enter an address</span>${kbd("Ctrl", "L")}</div>`
      : url.startsWith("about:")
      ? `<div class="a-url"><span class="a-site plain">${I(url === "about:reader" ? "reader" : "browser")}</span><span class="addr"><b>Browser</b><span>&nbsp;›&nbsp;${url.slice(6)}</span></span><span class="end">${I("star")}</span></div>`
      : `<div class="a-url ${on === "site" ? "focus" : ""}">${insecure ? `<span class="a-site warn">${I("warning")}Not secure</span>` : site(url === "maps" ? 3 : url === "video" ? 22 : 14)}${addr(url)}<span class="end">${url === "video" ? `<span class="${on === "video" ? "hl" : ""}">${I("videodl")}</span>` : ""}${on === "reader" ? `<span class="hl">${I("reader")}</span>` : ""}<span class="${on === "key" ? "hl" : ""}">${I("key")}</span>${I("star")}</span></div>`;
    const b = (id, ic, extra = "") => `<div class="btn ${on === id ? "on" : ""}">${I(ic)}${extra}</div>`;
    const actions = narrow
      ? `${b("share", "share")}${b("dl", "download", `<span class="ring"></span>`)}${b("more", "more")}`
      : `${b("share", "share")}${b("dl", "download", `<span class="ring"></span>`)}${b("ext", "puzzle")}${b("more", "more")}`;
    return `<header class="a-head ${priv ? "priv" : ""}" style="--side:${narrow ? 56 : SIDE}px">
      <div class="a-nav">${narrow ? "" : `<div class="btn">${I("sidebar")}</div>`}<div class="btn">${I("back")}</div><div class="btn dim">${I("forward")}</div><div class="btn">${I("reload")}</div></div>
      <div class="a-mid">${priv ? `<span class="a-priv">${I("private")}Private</span>` : ""}${field}</div>
      <div class="a-act">${actions}<span class="vsep"></span>${b("settings", "sliders")}${b("menu", "menu")}</div>
    </header>`;
  }

  function bmbar({ narrow = false, open = "" } = {}) {
    const items = narrow ? BOOKMARKS.slice(0, 6).map((b) => (b.folder ? bmItem(b) : `<span class="bm">${fv(b.key)}</span>`)).join("") : BOOKMARKS.slice(0, 11).map((b) => bmItem(b, b.folder === open ? "on" : "")).join("");
    return `<div class="a-bm" style="left:${narrow ? 56 : SIDE}px">${items}<span class="grow"></span><span class="bm more">${I("chevrons")}</span>${narrow ? "" : `<span class="vsep"></span><span class="bm folder">${I("folder")}<span>Other</span></span>`}</div>`;
  }

  const tab = (key, o = {}) => `<div class="a-tab ${o.on ? "on" : ""} ${o.hover ? "hover" : ""} ${o.sub ? "sub" : ""} ${o.sleep ? "sleep" : ""}">${fv(key)}<span class="t">${o.label || title(key)}</span>${o.sound ? `<span class="eq"><i></i><i></i><i></i></span>` : ""}${o.on ? I("close", "x") : ""}</div>`;
  const pageTab = (ic, c, label) => `<div class="a-tab on"><span class="fv" style="--c:${c}">${I(ic)}</span><span class="t">${label}</span>${I("close", "x")}</div>`;
  // Pages that take the place of Field Notes in the tab list.
  const OWN = { video: "Ridge loop in 4K", router: "Router setup", login: "Sign in · Field Notes" };
  const PAGE_TABS = { newtab: ["plus", "var(--accent)", "New tab"], settings: ["sliders", "var(--sw-graphite)", "Settings"], addons: ["puzzle", "var(--sw-violet)", "Extensions"], library: ["history", "var(--sw-blue)", "Library"] };

  function sidebar({ active = "journal", hover = "", priv = false, ws = false } = {}) {
    if (priv) return `<aside class="a-side priv">
      <div class="a-space"><span class="sq" style="--c:var(--sw-violet)">${I("private")}</span><b>Private window</b></div>
      <p class="a-privnote">Tabs, history and cookies here are forgotten when this window closes. Downloads and bookmarks stay.</p>
      <div class="a-gl">Tabs</div>
      ${tab("journal", { on: true, label: "Water on the ridge" })}${tab("store", { label: "Gaiter sizes" })}
      <div class="a-new">${I("plus")}<span>New private tab</span>${kbd("Ctrl", "T")}</div>
    </aside>`;
    return `<aside class="a-side">
      <div class="a-space ${ws ? "on" : ""}"><span class="sq" style="--c:var(--sw-teal)">T</span><b>Trips</b>${I("chevron")}<span class="grow"></span><div class="btn">${I("search")}</div></div>
      <div class="a-ess">${ESSENTIALS.map((k, i) => `<div class="e ${i === 0 ? "dot" : ""}">${fv(k, "lg")}</div>`).join("")}</div>
      ${tab("maps", { label: "Trailheads near Calera", on: active === "maps" })}
      <div class="a-folder">${I("folder-open")}<span>Ridge loop</span><span class="n">2</span></div>
      ${tab("weather", { sub: true })}${tab("recipes", { sub: true })}
      <div class="a-gl">Today</div>
      ${PAGE_TABS[active] ? pageTab(...PAGE_TABS[active]) : ""}
      ${tab(OWN[active] ? active : "journal", { on: active === "journal" || !!OWN[active], label: OWN[active] || "Water on the ridge" })}
      <div class="a-split">${fv("docs")}<span class="t">Tabbrowser</span><span class="bar"></span>${fv("wiki")}<span class="t">Gecko</span></div>
      ${tab("gh", { hover: hover === "gh" })}
      ${tab("music", { sound: true, label: "Lo-fi radio" })}
      ${tab("store", { sleep: active !== "store", on: active === "store", label: "Gaiter sizes" })}
      <div class="a-new">${I("plus")}<span>New tab</span>${kbd("Ctrl", "T")}</div>
      <div class="a-foot">${SPACES.map(([l, , c], i) => `<span class="ws ${i === 0 ? "on" : ""}" style="--c:${c}">${l}</span>`).join("")}<div class="btn sm">${I("plus")}</div><span class="grow"></span><div class="btn sm">${I("history")}</div></div>
    </aside>`;
  }

  function rail() {
    return `<aside class="a-rail">
      <span class="sq" style="--c:var(--sw-teal)">T</span>
      <div class="r">${fv("mail", "lg")}</div><div class="r">${fv("cal", "lg")}</div><span class="rs"></span>
      <div class="r">${fv("maps")}</div><div class="r on">${fv("journal")}</div><div class="r">${fv("docs")}</div><div class="r hov">${fv("gh")}</div><div class="r">${fv("music")}</div>
      <div class="r add">${I("plus")}</div><span class="grow"></span><div class="btn">${I("sidebar")}</div>
    </aside>`;
  }

  function frame(o = {}) {
    const narrow = o.narrow, compact = narrow || o.collapsed;
    const left = compact ? 56 : SIDE, top = HEAD + (o.bm === false ? 0 : BAR);
    const sheets = o.split
      ? `<main class="sheet focus" style="left:${left}px;top:${top}px;width:calc((100vw - ${left + 16}px) / 2);bottom:8px">${o.page || webPage()}</main>
         <main class="sheet" style="right:8px;top:${top}px;width:calc((100vw - ${left + 16}px) / 2);bottom:8px">${o.page2 || mapsPage()}</main>`
      : `<main class="sheet" style="left:${left}px;top:${top}px;right:8px;bottom:8px">${o.page || webPage({ narrow })}</main>`;
    return `<div class="win a-win ${o.priv ? "a-privwin" : ""}">${header({ narrow: compact, url: o.url || "journal", typed: o.typed ?? null, on: o.on || "", priv: o.priv })}
      ${compact ? rail() : sidebar({ active: o.active || o.url || "journal", hover: o.hover, priv: o.priv, ws: o.on === "ws" })}
      ${o.bm === false ? "" : bmbar({ narrow: compact, open: o.bmOpen })}
      ${sheets}${o.extra || ""}</div>`;
  }

  LAYOUT.a = {
    id: "a", frame,
    screens: {
      main: () => frame(),
      bookmarks: () => frame({ bmOpen: "Trips", extra: `<div class="pop b-pop b-ctx" style="left:${SIDE + 92}px;top:74px;width:260px">${menu(TRIPS_FOLDER.map((b) => b === "-" ? "-" : b.open ? ["browser", b.open, ""] : b.folder ? ["folder", b.folder, "", { sub: true }] : [null, `${fv(b.key)}&nbsp;&nbsp;${b.t}`, ""]))}</div>` }),
      collapsed: () => frame({ collapsed: true, extra: `<div class="pop b-pop b-prev a-hover" style="left:60px;top:268px;width:250px"><b>design-nexus/nyx-browser</b><span>github.com · Work</span></div>` }),
      split: () => frame({ split: true }),
      workspaces: () => frame({ on: "ws", extra: `<div class="pop b-pop b-card b-wsp" style="left:10px;top:84px;width:320px">${workspaceSwitcher()}</div>` }),
      narrow: () => frame({ narrow: true }),
      private: () => frame({ priv: true }),
      address: () => frame({ typed: "trail map", extra: pop(suggestions({ drop: true }), { x: 438, y: 4, w: 640, cls: "b-pop b-cmd b-from" }) }),
    },
  };
})();
