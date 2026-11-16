// Focus: sidebar only. No top bar: navigation, the address, Essentials, a bookmarks shelf and the
// tabs are in the sidebar, and the page runs the full height. Ctrl+L or Ctrl+T opens a command bar
// in the middle of the window. Everything about the page is in one Site card from the address
// (blocking, logins, VPN, Share, video); Downloads, Extensions and the menu rise from the sidebar's
// foot. Its frosted menus, cards and panels are the ones every layout uses, so screens that aren't
// about the frame are drawn here only; Browser's own pages are pages.js.
(() => {
  const SIDE = 252;

  const tab = (key, o = {}) => `<div class="b-tab ${o.on ? "on" : ""} ${o.hover ? "hover" : ""} ${o.sub ? "sub" : ""} ${o.sleep ? "sleep" : ""}">${fv(key)}<span class="t">${o.label || title(key)}</span>${o.sound ? I("volume", "snd") : ""}${o.on ? I("close", "x") : ""}</div>`;
  const pageTab = (ic, c, label) => `<div class="b-tab on"><span class="fv" style="--c:${c}">${I(ic)}</span><span class="t">${label}</span>${I("close", "x")}</div>`;
  const PAGE_TABS = { newtab: ["plus", "var(--accent)", "New tab"], settings: ["sliders", "var(--sw-graphite)", "Settings"], addons: ["puzzle", "var(--sw-violet)", "Extensions"], library: ["history", "var(--sw-blue)", "Library"] };
  const OWN = { video: "Ridge loop in 4K", router: "Router setup", login: "Sign in · Field Notes" };

  const shelf = (open = "") => `<div class="b-shelf"><div class="b-sh2">${I("bookmark")}<span>Bookmarks</span>${I("chevron")}</div>
    <div class="b-bms">${BOOKMARKS.slice(0, 12).map((b) => b.folder ? `<span class="bt folder ${b.folder === open ? "on" : ""}">${I("folder")}</span>` : `<span class="bt">${fv(b.key)}</span>`).join("")}</div></div>`;

  function sidebar({ active = "journal", url = "journal", on = "", hover = "", priv = false, bmOpen = "" } = {}) {
    const insecure = INSECURE.has(url);
    const field = url === "newtab"
      ? `<div class="b-url focus">${I("search")}<span class="ph">Search or command</span></div>`
      : url.startsWith("about:")
      ? `<div class="b-url"><span class="b-lock">${I(url === "about:reader" ? "reader" : "browser")}</span><b>${url[6].toUpperCase() + url.slice(7)}</b></div>`
      : `<div class="b-url ${on === "site" ? "on" : ""}"><span class="b-lock ${insecure ? "warn" : ""}">${I(insecure ? "warning" : "lock")}</span><b>${host(url)}</b><span class="grow"></span>${insecure ? `<span class="b-count warn">Not secure</span>` : `<span class="b-count">${I("shield")}${url === "maps" ? 3 : url === "video" ? 22 : 14}</span>`}${url === "video" ? `<span class="b-count vid">${I("videodl")}</span>` : ""}</div>`;
    const tabs = priv
      ? `<div class="b-privh"><span class="sq" style="--c:var(--sw-violet)">${I("private")}</span><b>Private window</b></div><p class="b-privnote">Forgotten when this window closes. Downloads and bookmarks stay.</p>
         <div class="b-new">${I("plus")}<span>New private tab</span></div>${tab("journal", { on: true, label: "Water on the ridge" })}${tab("store", { label: "Gaiter sizes" })}`
      : `${shelf(bmOpen)}
      <div class="b-space"><span class="sq" style="--c:var(--sw-teal)">T</span><b>Trips</b><span class="grow"></span>${I("search")}</div>
      ${tab("maps", { on: active === "maps" })}
      <div class="b-folder">${I("folder-open")}<span>Ridge loop</span></div>
      ${tab("weather", { sub: true })}${tab("recipes", { sub: true })}
      <div class="b-div"><i></i><span>Today</span><i></i><span class="clr">Clear</span></div>
      <div class="b-new">${I("plus")}<span>New tab</span></div>
      ${PAGE_TABS[active] ? pageTab(...PAGE_TABS[active]) : ""}
      ${tab(OWN[active] ? active : "journal", { on: active === "journal" || !!OWN[active], label: OWN[active] || "Water on the ridge" })}
      <div class="b-split">${fv("docs")}<span class="t">Tabbrowser</span><i></i>${fv("wiki")}<span class="t">Gecko</span></div>
      ${tab("gh", { hover: hover === "gh" })}
      ${tab("music", { sound: true, label: "Lo-fi radio" })}
      ${tab("store", { sleep: active !== "store", on: active === "store", label: "Gaiter sizes" })}`;
    return `<aside class="b-side ${priv ? "priv" : ""}">
      <div class="b-top"><div class="btn">${I("sidebar")}</div><span class="grow"></span><div class="btn">${I("back")}</div><div class="btn dim">${I("forward")}</div><div class="btn">${I("reload")}</div></div>
      ${field}
      ${priv ? "" : `<div class="b-ess">${ESSENTIALS.map((k, i) => `<div class="e ${i === 1 ? "dot" : ""}">${fv(k, "lg")}</div>`).join("")}</div>`}
      ${tabs}
      <div class="b-foot">
        <div class="b-spaces ${on === "ws" ? "on" : ""}">${SPACES.map(([l, , c], i) => `<span class="${i === 0 ? "on" : ""}" style="--c:${c}"></span>`).join("")}<span class="add">${I("plus")}</span></div>
        <span class="grow"></span>
        <div class="btn ${on === "dl" ? "on" : ""}">${I("download")}<span class="ring"></span></div>
        <div class="btn ${on === "ext" ? "on" : ""}">${I("puzzle")}</div>
        <div class="btn ${on === "menu" ? "on" : ""}">${I("more")}</div>
      </div>
    </aside>`;
  }

  function frame(o = {}) {
    if (o.narrow) return `<div class="win b-win"><main class="sheet" style="left:8px;top:8px;right:8px;bottom:8px">${o.page || webPage({ narrow: true })}</main>
      <div class="b-peek">${sidebar({ url: o.url || "journal" })}</div><div class="b-edge"></div>${o.extra || ""}</div>`;
    if (o.collapsed) return `<div class="win b-win"><main class="sheet" style="left:8px;top:8px;right:8px;bottom:8px">${o.page || webPage()}</main>
      <div class="b-float"><div class="btn">${I("sidebar")}</div><div class="btn">${I("back")}</div><span class="b-fu"><span class="b-lock">${I("lock")}</span><b>fieldnotes.example</b><span class="b-count">${I("shield")}14</span></span><span class="b-ft">${fv("journal")}7 tabs</span></div><div class="b-edge"></div>${o.extra || ""}</div>`;
    const sheets = o.split
      ? `<main class="sheet focus" style="left:${SIDE}px;top:8px;width:calc((100vw - ${SIDE + 16}px) / 2);bottom:8px">${o.page || webPage()}</main>
         <main class="sheet" style="right:8px;top:8px;width:calc((100vw - ${SIDE + 16}px) / 2);bottom:8px">${o.page2 || mapsPage()}</main>`
      : `<main class="sheet" style="left:${SIDE}px;top:8px;right:8px;bottom:8px">${o.page || webPage()}</main>`;
    return `<div class="win b-win ${o.priv ? "b-privwin" : ""}">${sidebar({ active: o.active || o.url || "journal", url: o.url || "journal", on: o.on, hover: o.hover, priv: o.priv, bmOpen: o.bmOpen })}${sheets}${o.extra || ""}</div>`;
  }

  // A frosted card: a big icon and title, groups of rows, a foot. `back` names the Site card it's part of.
  const cardHtml = (p, back = "") => `${back ? `<div class="b-back">${I("back")}<span>${back}</span></div>` : ""}
    ${p.title ? `<div class="b-ph">${p.icon || ""}<div class="tt"><b>${p.title}</b>${p.sub ? `<span>${p.sub}</span>` : ""}</div>${p.right || ""}</div>` : ""}
    ${p.blocks.map((bl) => `<div class="b-grp ${bl.rows ? "" : "plain"}">${bl.h ? `<div class="mh">${bl.h}</div>` : ""}${bl.rows ? bl.rows.map(([l, t, d, c]) => row(t, d, c || "", l || "")).join("") : ""}${bl.html || ""}</div>`).join("")}
    ${p.foot ? `<div class="b-pf">${p.foot}</div>` : ""}`;

  function panel(tool, p, o = {}) {
    let pop, on = "";
    if (["dl", "ext", "install"].includes(tool)) { on = tool === "dl" ? "dl" : "ext"; pop = `<div class="pop b-pop b-card" data-up="760" style="left:150px;top:0;width:${tool === "install" ? 400 : 380}px">${cardHtml(p)}</div>`; }
    else if (tool === "ai") pop = `<div class="pop b-pop b-card b-dock" style="right:16px;top:16px;bottom:16px;width:380px">${cardHtml(p)}</div>`;
    else { on = "site"; pop = `<div class="pop b-pop b-card" style="left:236px;top:40px;width:360px">${cardHtml(p, ["pw", "share", "vpn", "video"].includes(tool) ? host(o.url || "journal") : "")}</div>`; }
    return frame({ ...o, on, extra: pop });
  }

  // Quick actions along a menu's top, by what was clicked; the rest follow as a list.
  const STRIP = { link: [["plus", "New tab"], ["split", "Split"], ["link", "Copy"], ["share", "Share"]], page: [["back", "Back"], ["reload", "Reload"], ["star", "Bookmark"], ["share", "Share"]],
    image: [["copy", "Copy"], ["download", "Save"], ["share", "Share"], ["assistant", "Describe"]], text: [["copy", "Copy"], ["search", "Search"], ["assistant", "Explain"], ["note", "Note"]], tab: [["reload", "Reload"], ["copy", "Duplicate"], ["pin", "Pin"], ["close", "Close"]] };
  const SPOT = { link: [590, 604], image: [834, 388], text: [448, 527], page: [1150, 200], tab: [150, 567] };
  function ctx(kind, o = {}) {
    const strip = STRIP[kind], icons = strip.map((s) => s[0]);
    let rest = CTX[kind].filter((it) => it === "-" || !icons.includes(it[0]) || (it[0] === "close" && it[1] !== "Close tab"));
    rest = rest.filter((it, i) => !(it === "-" && (i === 0 || rest[i - 1] === "-")));
    const body = `<div class="b-qs">${strip.map(([ic, l], i) => `<div class="b-q ${i === 1 && kind !== "tab" ? "on" : ""}" title="${l}">${I(ic)}</div>`).join("")}</div>${menu(rest.map((it) => (Array.isArray(it) && it[3]?.hover && kind !== "tab" ? [it[0], it[1], it[2], { ...it[3], hover: false }] : it)))}`;
    const [x, y] = SPOT[kind];
    const page = webPage({ link: kind === "link", img: kind === "image", sel: kind === "text" });
    return frame({ page, hover: kind === "tab" ? "gh" : "", extra: atPointer(body, x, y, "b-pop b-ctx") + (kind === "tab" ? submenu(menu(WS_SUB), "b-pop b-ctx") : "") });
  }

  LAYOUT.b = {
    id: "b", frame, panel, ctx,
    screens: {
      main: () => frame(),
      bookmarks: () => frame({ bmOpen: "Trips", extra: `<div class="pop b-pop b-ctx" style="left:150px;top:182px;width:260px">${menu([{ html: `<div class="mh">Trips</div>` }, ...TRIPS_FOLDER.map((b) => b === "-" ? "-" : b.open ? ["browser", b.open, ""] : b.folder ? ["folder", b.folder, "", { sub: true }] : [null, `${fv(b.key)}&nbsp;&nbsp;${b.t}`, ""])])}</div>` }),
      collapsed: () => frame({ collapsed: true }),
      split: () => frame({ split: true }),
      workspaces: () => frame({ on: "ws", extra: `<div class="pop b-pop b-card b-wsp" data-up="760" style="left:12px;top:0;width:320px">${workspaceSwitcher()}</div>` }),
      narrow: () => frame({ narrow: true }),
      private: () => frame({ priv: true }),
      "tab-preview": () => frame({ hover: "gh", extra: `<div class="pop b-pop b-prev" style="left:240px;top:540px;width:300px"><div class="pvimg"><div class="gh"><i></i><i></i><i></i><i></i></div></div><div class="b-pvt"><b>design-nexus/nyx-browser</b><span>github.com · 2 hours ago · 120 MB</span></div></div>` }),
      address: () => frame({ extra: veil("b-veil") + pop(suggestions(), { x: 300, y: 92, w: 680, cls: "b-pop b-cmd" }) }),
      site: () => {
        const t = (ic, c, name, state, on) => `<div class="b-tg ${on ? "on" : ""}" style="--c:${c}">${I(ic)}<b>${name}</b><span>${state}</span></div>`;
        const act = (ic, l) => `<div class="b-act">${I(ic)}<span>${l}</span></div>`;
        const body = `<div class="b-sh">${fv("journal", "xl")}<div class="tt"><b>fieldnotes.example</b><span class="ok">${I("lock")} Secure · Let's Encrypt</span></div></div>
          <div class="b-tgs">${t("shield", "var(--sw-coral)", "Blocking", "14 blocked", true)}${t("key", "var(--sw-violet)", "Passwords", "2 logins", true)}${t("globe", "var(--sw-teal)", "VPN", "Zurich", true)}${t("reader", "var(--sw-amber)", "Reader", "6 min read", false)}</div>
          <div class="b-acts">${act("link", "Copy link")}${act("share", "Share")}${act("qr", "QR code")}${act("openin", "Open in")}${act("capture", "Capture")}</div>
          <div class="b-perms"><div class="mh">Permissions</div>
            <div class="b-p">${I("location")}<span>Location</span><em>Ask</em></div><div class="b-p">${I("camera")}<span>Camera</span><em class="no">Blocked</em></div>
            <div class="b-p">${I("bell")}<span>Notifications</span><em class="yes">Allowed</em></div><div class="b-p">${I("volume")}<span>Autoplay</span><em>Block audio</em></div></div>
          <div class="b-sf"><span>${I("cookie")}1.4 MB stored</span><span class="lnk">Clear</span><span class="grow"></span><span class="lnk">All site settings</span></div>`;
        return frame({ on: "site", extra: pop(body, { x: 236, y: 40, w: 344, cls: "b-pop b-site" }) });
      },
      find: () => frame({ page: webPage({ find: true }), extra: `<div class="pop b-pop b-findbar" style="left:calc(50% + 126px - 230px);top:22px;width:460px">${I("search")}<span class="typed">cedar<i class="caret"></i></span><em>1 of 3</em><span class="b-fb">${I("chevron")}</span><span class="b-fb up">${I("chevron")}</span><span class="chip">Aa</span>${I("close", "x")}</div>` }),
      menu: () => {
        const tiles = [["window", "New window"], ["private", "Private"], ["history", "Library"], ["capture", "Capture"], ["assistant", "Assistant"], ["command", "Commands"]];
        const body = `<div class="b-tiles">${tiles.map(([ic, l]) => `<div class="b-t">${I(ic)}<span>${l}</span></div>`).join("")}</div>
          <div class="b-zoom">${I("zoom")}<span>Zoom</span><span class="grow"></span><span class="zb">${I("minus")}</span><b>110%</b><span class="zb">${I("plus")}</span></div>
          ${menu([["search", "Find in page", "Ctrl F"], ["reader", "Reader view", "F9"], ["translate", "Translate page", ""], ["printer", "Print…", "Ctrl P"], ["file", "Save page…", "Ctrl S"],
            "-", ["layout", "Customize sidebar", ""], ["sliders", "Settings", "Ctrl ,", { hover: true }], ["help", "Help and shortcuts", "F1"], "-", ["power", "Quit Browser", "Ctrl Q"]])}`;
        return frame({ on: "menu", extra: `<div class="pop b-pop b-menu" data-up="760" style="left:196px;top:0;width:300px">${body}</div>` });
      },
      extensions: () => {
        const x = (e, pinned) => `<div class="b-x ${e[5] ? "" : "off"}">${extIcon(e, "lg")}${pinned ? `<span class="pin">${I("pin")}</span>` : ""}<b>${e[0].replace("Content blocking", "Blocking").replace(" Connector", "")}</b><span>${e[5] ? (e[4] ? "Built in" : e[6]) : "Off"}</span></div>`;
        const body = `<div class="b-xh"><b>Extensions</b><span class="lnk">Manage</span></div>
          <div class="b-xg">${EXTS.map((e, i) => x(e, i < 2 || i === 3)).join("")}<div class="b-x add"><span class="xi lg">${I("plus")}</span><b>Get more</b><span>Add-ons site</span></div></div>
          <div class="b-xf">${I("eye")} Dark Reader can read this site when you click it</div>`;
        return frame({ on: "ext", extra: `<div class="pop b-pop b-ext" data-up="760" style="left:160px;top:0;width:336px">${body}</div>` });
      },
      reader: () => frame({ url: "about:reader", page: readerPage() + `<div class="b-rtool">${["font", "minus", "plus", "sun", "sound"].map((ic) => `<div class="btn">${I(ic)}</div>`).join("")}<span class="hs"></span><div class="btn">${I("close")}</div></div>` }),
      print: () => frame({ extra: veil("b-veil2") + `<div class="pop b-pop b-set b-print" style="left:170px;top:52px;width:940px;height:696px">
          <div class="b-prv"><div class="sheetp"><b>Water on the ridge: where to fill up between Calera and the saddle</b>${scene("pp")}<i></i><i></i><i></i><i class="s"></i><i></i><i></i></div><div class="b-pgs"><span class="on"></span><span></span></div></div>
          <div class="b-prs"><div class="b-sth"><h2>Print</h2><div class="btn">${I("close")}</div></div>
            <div class="mh">Printer</div><div class="b-prn on">${I("printer")}<div class="tt"><b>Brother HL-L2350</b><span>Ready · office</span></div>${I("check")}</div><div class="b-prn">${I("file")}<div class="tt"><b>Save as PDF</b><span>~/Documents</span></div></div>
            ${card([row("Pages", "", seg(["All", "This one", "Custom"], 0)), row("Copies", "", `<span class="drop">1</span>`), row("Simplify the page", "Text and photos only", sw(true)), row("Headers and footers", "", sw(false))])}
            <div class="b-prb"><span class="grow"></span><span class="pbtn">Cancel</span><span class="pbtn accent">Print 2 pages</span></div></div></div>` }),
      firstrun: () => `<div class="win b-win"><div class="fr b-fr"><div class="fr-card b-pop">
          <div class="fr-logo">${I("browser")}</div><h1>Welcome to Browser</h1><p>Pick a layout. You can change it any time in Settings › Layout & tabs, and each window can have its own.</p>
          ${layoutCards("b", true)}
          <div class="fr-opts">${card([row("Bring in bookmarks, passwords and history", "From Firefox · found on this computer", drop("Firefox"), tile("download", "var(--sw-blue)")), row("Block ads and trackers", "uBlock Origin, built in", sw(true), tile("shield", "var(--sw-coral)"))])}</div>
          <div class="fr-btns"><span class="lnk">Skip</span><span class="grow"></span><span class="pbtn accent">Continue with Focus ${I("arrow-right")}</span></div></div></div></div>`,
    },
  };
})();
