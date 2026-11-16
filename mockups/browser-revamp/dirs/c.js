// Workbench: tabs on top. A tab bar across the window, the address bar under it (navigation, the
// address with its Site button, Assistant, Downloads, Extensions, the menu), the bookmarks bar, then a
// Library rail on the left for workspaces, bookmarks, history and the reading list. Only the frame is
// Workbench's: its menus and panels are Focus's (screens.js), and its pages are pages.js.
(() => {
  const RAIL = 52, TABS = 40, BAR = 44, BM = 30;

  const ctab = (key, label, o = {}) => `<div class="c-tab ${o.on ? "on" : ""} ${o.hover ? "hover" : ""} ${o.icon ? "ico" : ""} ${o.sleep ? "sleep" : ""} ${o.grp ? "grp" : ""}">${fv(key)}${o.icon ? "" : `<span>${label}</span>`}${o.sound ? I("volume", "snd") : ""}${o.on && !o.icon ? I("close", "x") : ""}</div>`;

  function tabbar({ narrow = false, collapsed = false, priv = false, hover = "" } = {}) {
    let tabs;
    if (priv) tabs = `<span class="c-priv">${I("private")}Private</span>${ctab("journal", "Water on the ridge", { on: true })}${ctab("store", "Gaiter sizes")}`;
    else if (collapsed) tabs = `${["maps", "weather", "recipes"].map((k) => ctab(k, "", { icon: true })).join("")}${ctab("journal", "Water on the ridge", { on: true })}${["docs", "wiki", "gh", "mail", "cal", "news", "store"].map((k) => ctab(k, "", { icon: true })).join("")}${ctab("music", "", { icon: true, sound: true })}`;
    else if (narrow) tabs = `${ctab("maps", "Trailheads near Calera")}${ctab("journal", "Water on the ridge", { on: true })}${ctab("gh", "design-nexus/nyx-browser")}${ctab("music", "Lo-fi radio", { sound: true })}<div class="c-more">+4</div>`;
    else tabs = `${ctab("maps", "Trailheads near Calera")}<span class="c-gl">${I("folder-open")}Ridge loop</span>${ctab("weather", "Calera · 10-day forecast", { grp: true })}${ctab("recipes", "Camp stove chili", { grp: true })}
      ${ctab("journal", "Water on the ridge", { on: true })}<div class="c-tab c-splt">${fv("docs")}<span>Tabbrowser</span><i></i>${fv("wiki")}<span>Gecko</span></div>
      ${ctab("gh", "design-nexus/nyx-browser", { hover: hover === "gh" })}${ctab("music", "Lo-fi radio", { sound: true })}${ctab("store", "Gaiter sizes", { sleep: true })}`;
    return `<header class="c-tabbar ${priv ? "priv" : ""}"><div class="c-tabs">${tabs}<div class="btn sm">${I("plus")}</div></div>${narrow ? "" : `<div class="btn sm">${I("chevron")}</div>`}</header>`;
  }

  function bar({ url = "journal", typed = null, narrow = false, rail = true, on = "" } = {}) {
    const insecure = INSECURE.has(url);
    const field = typed !== null
      ? `<div class="c-url focus">${I("search")}<span class="typed">${typed}<i class="caret"></i></span></div>`
      : url === "newtab"
      ? `<div class="c-url">${I("search")}<span class="ph">Search or enter an address</span>${kbd("Ctrl", "L")}</div>`
      : `<div class="c-url">${insecure ? `<span class="c-site warn">${I("warning")}Not secure</span>` : `<span class="c-site">${I("lock")}<i></i>${I("shield")}<b>${url === "maps" ? 3 : 14}</b></span>`}${addr(url)}<span class="end">${I("key")}${I("star")}</span></div>`;
    const b = (id, ic, extra = "") => `<div class="btn ${on === id ? "on" : ""}">${I(ic)}${extra}</div>`;
    const tools = narrow ? `${b("dl", "download", `<span class="ring"></span>`)}${b("menu", "menu")}`
      : `${b("ai", "assistant")}${b("dl", "download", `<span class="ring"></span>`)}${b("ext", "puzzle")}<span class="vsep"></span>${b("menu", "menu")}`;
    return `<div class="c-bar"><div class="c-nav">${narrow ? "" : `<div class="btn ${rail ? "on" : ""}">${I("sidebar")}</div>`}<div class="btn">${I("back")}</div><div class="btn dim">${I("forward")}</div><div class="btn">${I("reload")}</div></div>${field}<div class="c-tools">${tools}</div></div>`;
  }

  const bmbar = (narrow = false, open = "") => `<div class="c-bm">${(narrow ? BOOKMARKS.slice(0, 7) : BOOKMARKS).map((b) => bmItem(b, b.folder === open ? "on" : "")).join("")}<span class="grow"></span>${narrow ? `<span class="bm">${I("chevrons")}</span>` : `<span class="bm folder">${I("folder")}<span>Other</span></span>`}</div>`;

  const rail = (ws = false) => `<aside class="c-rail" style="top:${TABS + BAR + BM}px">
    ${SPACES.map(([l, , c], i) => `<span class="c-ws ${i === 0 ? "on" : ""}" style="--c:${c}">${l}</span>`).join("")}<span class="c-wsadd ${ws ? "on" : ""}">${I("chevron")}</span>
    <span class="c-rs"></span>
    <div class="btn" title="Bookmarks">${I("bookmark")}</div>
    <div class="btn" title="History">${I("history")}</div>
    <div class="btn" title="Reading list">${I("reader")}</div>
    <div class="btn" title="Downloads">${I("download")}</div>
    <span class="grow"></span>
    <div class="btn" title="Settings">${I("sliders")}</div>
  </aside>`;

  function frame(o = {}) {
    const narrow = o.narrow, showRail = !narrow && !o.collapsed && !o.priv;
    const showBm = !o.collapsed;
    const left = showRail ? RAIL : 8, top = TABS + BAR + (showBm ? BM : 0);
    const sheets = o.split
      ? `<main class="sheet focus" style="left:${left}px;top:${top}px;width:calc((100vw - ${left + 16}px) / 2);bottom:8px">${o.page || webPage()}</main>
         <main class="sheet" style="right:8px;top:${top}px;width:calc((100vw - ${left + 16}px) / 2);bottom:8px">${o.page2 || mapsPage()}</main>`
      : `<main class="sheet" style="left:${left}px;top:${top}px;right:8px;bottom:8px">${o.page || webPage({ narrow })}</main>`;
    return `<div class="win c-win ${o.priv ? "c-privwin" : ""}">${tabbar({ narrow, collapsed: o.collapsed, priv: o.priv, hover: o.hover })}
      ${bar({ url: o.url || "journal", typed: o.typed ?? null, narrow, rail: showRail, on: o.on })}
      ${showBm ? bmbar(narrow, o.bmOpen) : ""}${showRail ? rail(o.on === "ws") : ""}
      ${sheets}${o.extra || ""}</div>`;
  }

  LAYOUT.c = {
    id: "c", frame,
    screens: {
      main: () => frame(),
      bookmarks: () => frame({ bmOpen: "Trips", extra: `<div class="pop b-pop b-ctx" style="left:100px;top:112px;width:260px">${menu(TRIPS_FOLDER.map((b) => b === "-" ? "-" : b.open ? ["browser", b.open, ""] : b.folder ? ["folder", b.folder, "", { sub: true }] : [null, `${fv(b.key)}&nbsp;&nbsp;${b.t}`, ""]))}</div>` }),
      collapsed: () => frame({ collapsed: true }),
      split: () => frame({ split: true }),
      workspaces: () => frame({ on: "ws", extra: `<div class="pop b-pop b-card b-wsp" style="left:56px;top:118px;width:320px">${workspaceSwitcher()}</div>` }),
      narrow: () => frame({ narrow: true }),
      private: () => frame({ priv: true }),
      address: () => frame({ typed: "trail map", extra: pop(suggestions({ drop: true }), { x: 112, y: 42, w: 760, cls: "b-pop b-cmd b-from" }) }),
    },
  };
})();
