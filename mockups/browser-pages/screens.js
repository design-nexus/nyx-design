// Browser's last pages, drawn in Focus's frame from the revamp with its Studio page style
// (pages.js, pages.css). DRAW[page](opt, state) returns the window. The themes are the real Nyx
// ones (themes.js, from `nyx-browser-bridge themes`); everything else is made up.

const B = LAYOUT.b;
const head = (t, sub, right = "") => `<div class="pg-st pg-sth"><div><h2>${t}</h2><span>${sub}</span></div>${right}</div>`;
const gl = (t, right = "") => `<div class="gl glr"><span>${t}</span>${right}</div>`;
const btn = (label, cls = "", ic = "") => `<span class="pbtn ${cls}">${ic ? I(ic) : ""}${label}</span>`;
const keys = (...k) => kbd(...k);
const find = (ph, typed = "") => `<div class="pg-find ${typed ? "on" : ""}">${I("search")}${typed ? `<span>${typed}<i class="caret"></i></span>` : `<span>${ph}</span>`}</div>`;

// ---- frames ----

const EXT_NAV = (on) => `<nav class="pg-nav"><div class="pg-t">${I("puzzle")}<b>Extensions</b></div>${pagenav([["", [["ext", "puzzle", "Extensions", 0, "3"], ["themes", "palette", "Themes", 0, "17"], ["plugins", "plug", "Plugins", 0, "2"], ["access", "globe", "Site access", 0, "3"], ["keys", "keyboard", "Shortcuts", 0, "5"]]]], on)}</nav>`;
const extFrame = (on, body, extra = "") => B.frame({ url: "about:extensions", active: "addons", page: `<div class="pg">${EXT_NAV(on)}<section class="pg-c">${body}</section></div>`, extra });
const NAV_ABOUT = [...SETTINGS_NAV, ["", [["about", "browser", "About Browser", "--sw-graphite"]]]];
const settingsFrame = (on, body, extra = "") => B.frame({ url: "about:settings", active: "settings", page: `<div class="pg"><nav class="pg-nav"><div class="pg-find">${I("search")}<span>Find in Settings</span></div>${pagenav(NAV_ABOUT, on)}</nav><section class="pg-c pg-set">${body}</section></div>`, extra });

// ---- Themes ----

const T = NYX_THEMES;
const TEAL = T.accents.find((a) => a.name === "teal").colour;
const byId = (id) => T.themes.find((t) => t.id === id);
// A theme's picture: a small window in its colours, with its accent.
const mini = (c, accent = c.accent, cls = "") => `<div class="tw ${cls}" style="--b:${c.bg};--p:${c.panel};--c:${c.card};--t:${c.text};--d:${c.dim};--a:${accent}"><i class="s"><u></u><u></u><u class="on"></u><u></u></i><i class="sh"><b></b><u></u><u></u><em></em></i></div>`;
const strip = (c, accent = c.accent) => `<span class="tstrip">${[c.bg, c.panel, c.card, accent, ...(c.swatches ?? []).slice(1, 3)].map((x) => `<i style="background:${x}"></i>`).join("")}</span>`;
const check = (on) => (on ? `<span class="tchk">${I("check")}</span>` : `<span class="tchk off"></span>`);
const accentRow = (picked, compact = false) => `<div class="accents ${compact ? "compact" : ""}">
  <span class="acc def ${picked ? "" : "on"}" title="Theme default"><i style="background:conic-gradient(${T.accents.slice(0, 6).map((a) => a.colour).join(",")})"></i>${compact ? "" : "<b>Theme default</b>"}</span>
  ${T.accents.map((a) => `<span class="acc ${a.name === picked ? "on" : ""}" title="${a.name}"><i style="background:${a.colour}"></i></span>`).join("")}</div>`;

function themesPage(opt, state) {
  const picked = state === "picked";
  const current = picked ? "tokyo-night" : "follow";
  const accentName = picked ? "teal" : "";
  const acc = (t) => (picked && t.id === "tokyo-night" ? TEAL : t.colours.accent);
  const sys = T.system;
  const dark = T.themes.filter((t) => !t.light), light = T.themes.filter((t) => t.light);
  const sub = "Browser's colours: a Nyx theme and an accent. Other Nyx apps keep their own.";
  let body;
  if (opt === "a") {
    const tcard = (t) => `<div class="tcard ${t.id === current ? "on" : ""}">${mini(t.colours, acc(t))}<div class="tn"><b>${t.name}</b>${t.id === current ? I("check") : ""}</div></div>`;
    body = `${head("Themes", sub)}
      <div class="tfollow card ${current === "follow" ? "on" : ""}">${mini(sys.colours, sys.colours.accent, "lg")}<div class="rt"><b>Follow system</b><span>${sys.name} · ${sys.light ? "light" : "dark"} · what Nyx Settings picks for every app</span></div>${check(current === "follow")}</div>
      ${gl("Dark")}<div class="tgrid">${dark.map(tcard).join("")}</div>
      ${gl("Light")}<div class="tgrid">${light.map(tcard).join("")}</div>
      ${gl("Accent", `<span class="glnote">Buttons, links, the selected tab and folders</span>`)}${accentRow(accentName)}`;
  } else if (opt === "b") {
    const trow = (t) => `<div class="trow ${t.id === current ? "on" : ""}">${strip(t.colours, acc(t))}<b>${t.name}</b>${check(t.id === current)}</div>`;
    body = `${head("Themes", sub)}
      ${card([`<div class="row tb-top">${strip(sys.colours)}<div class="rt"><b>Follow system</b><span>${sys.name} · what Nyx Settings picks for every app</span></div>${check(current === "follow")}</div>`,
        `<div class="row tb-top"><span class="tlead">${I("palette")}</span><div class="rt"><b>Accent</b><span>${picked ? "Teal, over the theme's own" : "The theme's own"}</span></div>${accentRow(accentName, true)}</div>`])}
      ${gl("Dark")}<div class="tcols card">${dark.map(trow).join("")}</div>
      ${gl("Light")}<div class="tcols card">${light.map(trow).join("")}</div>`;
  } else {
    const shown = picked ? byId("tokyo-night").colours : sys.colours;
    const lrow = (id, name, c, note) => `<div class="lrow ${id === current ? "on" : ""}"><span class="ldot" style="--b:${c.bg};--a:${id === current && picked ? TEAL : c.accent}"></span><b>${name}</b>${note ? `<span>${note}</span>` : ""}${id === current ? I("check") : ""}</div>`;
    body = `${head("Themes", sub)}
      <div class="tc">
        <div class="tcl">
          <div class="bigprev">${mini(shown, picked ? TEAL : shown.accent, "xl")}</div>
          <div class="tcaption"><b>${picked ? "Tokyo Night" : `Follow system · ${sys.name}`}</b><span>${picked ? "Browser only · teal accent" : "What Nyx Settings picks for every app"}</span></div>
          ${gl("Accent")}${accentRow(accentName)}
        </div>
        <div class="tcr card">${lrow("follow", "Follow system", sys.colours, sys.name)}<div class="lsep"></div>${T.themes.map((t) => lrow(t.id, t.name, t.colours, t.light ? "Light" : "")).join("")}</div>
      </div>`;
  }
  const html = extFrame("themes", body);
  if (!picked) return html;
  // The page takes the theme and accent at once: Tokyo Night's colours and teal. It's a dark
  // theme, so Browser is dark whichever mode the gallery shows.
  document.documentElement.dataset.theme = "dark";
  const c = byId("tokyo-night").colours;
  return `<div class="repaint" style="--bg:${c.bg};--panel:${c.panel};--card:${c.card};--surface:${c.card};--popover:${c.card};--raised:${c.card};--text:${c.text};--dim-text:${c.dim};--text-tertiary:${c.dim};--theme-accent:${TEAL};--app-accent:${TEAL};--accent:${TEAL};--nav-active:color-mix(in srgb, ${TEAL} 16%, ${c.bg});--on-accent:#10111a">${html}</div>`;
}

// ---- Extensions page ----

const xrow = (e, more = false, on = false) => row(e[0], e[1], `<span class="chip">${e[6] === "On click" ? I("eye") : I("globe")}${e[6]}</span>${sw(e[5])}<span class="ibx ${on ? "on" : ""}">${I("more")}</span>`, extIcon(e));
const builtIns = () => {
  const big = (e, d) => `<div class="pg-xcard card">${extIcon(e, "lg")}<div class="tt"><b>${e[0]}</b><span>${d}</span></div><div class="ft"><span class="lnk">Settings</span><span class="grow"></span>${sw(e[5])}</div></div>`;
  return `<div class="pg-xgrid">${big(EXTS[0], "uBlock Origin, with Browser's panel. 1,204 blocked this week.")}${big(EXTS[1], "Nyx Passwords fills logins and passkeys.")}${big(EXTS[2], "Browser only; per workspace.")}</div>`;
};
function extDetail(state) {
  const e = EXTS[3];
  const top = `<div class="pg-crumb"><span class="lnk">${I("back")}Extensions</span></div>
    <div class="pg-dh">${extIcon(e, "lg")}<div class="tt"><b>Dark Reader</b><span>Version 4.9.96 · by Dark Reader Ltd · updated Oct 30</span></div>${sw(true)}<span class="ibx">${I("more")}</span></div>`;
  if (state === "options") {
    return top + `<div class="pg-tabs">${["Overview", "Permissions", "Its options"].map((t, i) => `<span class="${i === 2 ? "on" : ""}">${t}</span>`).join("")}</div>
      <div class="xopts card"><div class="xo-h">${extIcon(e)}<b>Dark Reader</b><span class="grow"></span><span class="xo-on">${sw(true)} On</span></div>
        <div class="xo-mode">${seg(["Dark", "Light"], 0)}<span class="grow"></span><span class="lnk">fieldnotes.example: invert listed only</span></div>
        ${["Brightness", "Contrast", "Sepia", "Grayscale"].map((n, i) => `<div class="xo-sl"><span>${n}</span><div class="slider"><i style="width:${[100, 92, 0, 0][i] / 1.5 + 10}%"></i><b style="left:${[100, 92, 0, 0][i] / 1.5 + 10}%"></b></div><em>${[100, 92, 0, 0][i]}%</em></div>`).join("")}
        <div class="xo-foot"><span class="lnk">Site list</span><span class="lnk">Dev tools</span><span class="grow"></span><span class="dimt">Dark Reader's own page, shown here</span></div></div>`;
  }
  return top + `<div class="pg-tabs">${["Overview", "Permissions", "Its options"].map((t, i) => `<span class="${i === 1 ? "on" : ""}">${t}</span>`).join("")}</div>
    <div class="xcols"><div>
      ${gl("It needs")}${card([row("Read and change pages on every site", "To darken them", "", tile("globe", "var(--sw-amber)")), row("See your tabs", "Their addresses and titles", "", tile("browser", "var(--sw-blue)")), row("Keep its settings", "In Browser's storage", "", tile("file", "var(--sw-graphite)"))])}
      ${gl("It may ask for", `<span class="glnote">Off until you turn them on</span>`)}${card([row("Download files", "To save a theme you made", sw(false), tile("download", "var(--sw-teal)")), row("Read what you copy", "To paste colours", sw(false), tile("copy", "var(--sw-violet)"))])}
    </div><div>
      ${gl("Sites", `<span class="lnk">${I("plus")}Add a site</span>`)}${card([row("Every site", "Granted when you added it", `<span class="lnk">Only on click</span>`, tile("globe", "var(--accent)")), row("fieldnotes.example", "Always, even on click only", `<span class="ibx">${I("close")}</span>`, fv("journal")), row("maps.example", "Never", `<span class="ibx">${I("close")}</span>`, fv("maps"))])}
      ${gl("In Browser")}${card([row("Run in private windows", "", sw(false)), row("Pin its button", "", sw(true)), row("Update automatically", "", sw(true))])}
    </div></div>
    <div class="pg-rm">${btn("Remove", "danger", "trash")}${btn("Report", "", "warning")}</div>`;
}
const EXT_KEYS = [
  [EXTS[3], [["Toggle on this site", ["Alt", "Shift", "D"]], ["Open its panel", null], ["Toggle everywhere", ["Alt", "Shift", "A"]]]],
  [EXTS[4], [["Skip the segment", ["Alt", "Shift", "K"]], ["Mark where a sponsor starts", ["Alt", "Shift", ";"]]]],
  [EXTS[5], [["Save to Zotero", ["Ctrl", "Shift", "S"]]]],
];
function extShortcuts(state) {
  const krow = (name, k, i, j) => {
    const editing = state === "recording" && i === 0 && j === 0;
    const clash = state === "clash" && ((i === 0 && j === 0) || (i === 2 && j === 0));
    const right = editing ? `<span class="krec">${keys("Alt", "Shift")}<span class="kdots">…</span></span><span class="lnk dimt">Esc to cancel</span>`
      : `${k ? keys(...(clash ? ["Alt", "Shift", "D"] : k)) : `<span class="dimt">Not set</span>`}<span class="lnk">${k ? "Change" : "Set"}</span>${k ? `<span class="ibx">${I("undo")}</span>` : ""}`;
    return `<div class="row krow ${editing ? "rec" : ""} ${clash ? "clash" : ""}"><div class="rt"><b>${name}</b>${clash ? `<span class="warnt">${I("warning")} Alt+Shift+D is also ${i === 0 ? "Zotero's “Save to Zotero”" : "Dark Reader's “Toggle on this site”"}: only one works</span>` : ""}</div>${right}</div>`;
  };
  return `${head("Shortcuts", "Keys for what extensions can do. Browser's own are in Keyboard shortcuts.", `<span class="lnk">${I("keyboard")}Keyboard shortcuts</span>`)}
    ${EXT_KEYS.map(([e, list], i) => `${gl(`${extIcon(e, "sm")}${e[0]}`)}${card(list.map(([n, k], j) => krow(n, k, i, j)))}`).join("")}`;
}
function extensionsPage2(state) {
  if (state === "permissions" || state === "options") return extFrame("ext", extDetail(state));
  if (state === "shortcuts" || state === "recording" || state === "clash") return extFrame("keys", extShortcuts(state));
  const body = `<div class="pg-top">${find("Find in your extensions")}${btn("Get extensions", "accent", "plus")}</div>
    <div class="gl">Built into Browser</div>${builtIns()}
    <div class="gl">Installed</div>${card([xrow(EXTS[3], true, true), xrow(EXTS[4]), xrow(EXTS[5])], "pg-dimoff xlist")}`;
  const menuHtml = `<div class="pop b-pop b-ctx" style="left:988px;top:358px;width:250px">${menu([["pin", "Pin its button", "", { on: true }], ["back", "Move up", ""], ["forward", "Move down", ""], "-", ["sliders", "Its own options", ""], ["settings", "Permissions and details", "", { hover: true }], "-", ["trash", "Remove…", "", { danger: true }], ["warning", "Report…", ""]])}</div>`;
  return extFrame("ext", body, menuHtml);
}

// ---- Keyboard shortcuts ----

const KEYS = [
  ["Tabs", "browser", [["New tab", ["Ctrl", "T"]], ["Close tab", ["Ctrl", "W"]], ["Reopen the closed tab", ["Ctrl", "Shift", "T"]], ["Next tab", ["Ctrl", "Tab"]], ["Previous tab", ["Ctrl", "Shift", "Tab"]], ["Split view with the next tab", ["Ctrl", "Alt", "V"]]]],
  ["The page", "file", [["Address and search", ["Ctrl", "L"]], ["Find in page", ["Ctrl", "F"]], ["Reload", ["Ctrl", "R"]], ["Reader view", ["F9"]], ["Print", ["Ctrl", "P"]], ["Zoom in", ["Ctrl", "+"]]]],
  ["The window", "window", [["New window", ["Ctrl", "N"]], ["New private window", ["Ctrl", "Shift", "P"]], ["Show or hide the sidebar", ["Ctrl", "B"]], ["Full screen", ["F11"]]]],
  ["Browser", "sliders", [["Quick commands", ["F2"]], ["Appearance", ["Ctrl", ","]], ["Keyboard shortcuts", ["F1"]], ["History", ["Ctrl", "H"]], ["Bookmarks", ["Ctrl", "Shift", "O"]], ["Downloads", ["Ctrl", "Shift", "Y"]], ["Share", ["Alt", "Shift", "S"]], ["Passwords", ["Alt", "Shift", "Y"]]]],
];
function keysRows(state, q) {
  const groups = KEYS.map(([g, ic, list]) => [g, ic, list.filter(([n]) => !q || n.toLowerCase().includes(q))]).filter(([, , l]) => l.length);
  const krow = ([n, k], gi, i) => {
    const rec = state === "edit" && gi === 0 && i === 2;
    const changed = gi === 3 && i === 0;
    const right = rec ? `<span class="krec">${keys("Ctrl", "Shift")}<span class="kdots">…</span></span><span class="lnk">Reset</span><span class="lnk dimt">Esc</span>`
      : `${keys(...k)}${changed ? `<span class="chip">Changed</span>` : ""}<span class="lnk">Change</span>`;
    return `<div class="row krow ${rec ? "rec" : ""}"><div class="rt"><b>${q ? n.replace(new RegExp(q, "i"), (m) => `<mark>${m}</mark>`) : n}</b>${changed ? `<span>Browser's: Ctrl+Shift+Space</span>` : ""}</div>${right}</div>`;
  };
  return groups.map(([g, , l], gi) => `${gl(g)}${card(l.map((r, i) => krow(r, gi, i)))}`).join("");
}
function keysPage(opt, state) {
  const q = state === "search" ? "tab" : "";
  if (opt === "a") {
    const body = `<div class="pg-crumb"><span class="lnk">${I("back")}Gestures</span></div>
      ${head("Keyboard shortcuts", "Browser's keys. Change any of them; an extension's are in Extensions › Shortcuts.", btn("Reset all", "", "undo"))}
      <div class="pg-top">${find("Find a shortcut", q)}</div>${keysRows(state, q)}`;
    return settingsFrame("gest", body);
  }
  const nav = `<nav class="pg-nav"><div class="pg-t">${I("keyboard")}<b>Keyboard shortcuts</b></div>${pagenav([["", KEYS.map(([g, ic, l], i) => [g, ic, g, 0, String(l.length)])], ["", [["ext", "puzzle", "Extensions'", 0, "6"]]]], q ? "" : "Tabs")}
    <span class="grow"></span><div class="ni">${I("undo")}<span>Reset all</span></div></nav>`;
  const body = `<div class="pg-top">${find("Find a shortcut", q)}<span class="dimt">Click keys to change them</span></div>${keysRows(state, q)}`;
  return B.frame({ url: "about:shortcuts", active: "settings", page: `<div class="pg">${nav}<section class="pg-c">${body}</section></div>` });
}

// ---- About ----

function aboutPage(opt) {
  if (opt === "a") {
    const body = `<div class="ab-hero"><span class="ab-logo">${I("browser")}</span><div class="tt"><b>Browser</b><span>Version 0.9.4 · November 14, 2026</span><span class="ok">● Up to date</span></div>${btn("Check for updates", "", "reload")}</div>
      ${card([row("What's new", "In 0.9.4: Themes, extension shortcuts, a faster Library", I("arrow-right", "dimi"), tile("star", "var(--sw-amber)")),
        row("Copy version info", "Browser 0.9.4 (2026-11-14) · Linux x86-64 · Nyx Dark", btn("Copy", "", "copy"), tile("copy", "var(--sw-blue)")),
        row("Credits", "Everyone who made Browser, and what it's built on", I("arrow-right", "dimi"), tile("user", "var(--sw-violet)")),
        row("Licences", "Free software: MPL 2.0 and others", I("arrow-right", "dimi"), tile("file", "var(--sw-graphite)"))])}
      <p class="pg-desc ab-note">Browser is part of Nyx, by Design Nexus. Report a problem or ask for something on GitHub.</p>`;
    return settingsFrame("about", body);
  }
  const dialog = `<div class="pop b-pop ab-dlg" style="left:440px;top:210px;width:400px">
    <span class="ab-logo lg">${I("browser")}</span><b>Browser</b><span class="dimt">Version 0.9.4 · November 14, 2026</span>
    <div class="ab-up"><span class="ok">● Up to date</span>${btn("Check again", "", "reload")}</div>
    <div class="ab-links"><span class="lnk">What's new</span><span class="lnk">Credits</span><span class="lnk">Licences</span><span class="lnk">${I("copy")}Copy version info</span></div>
    <span class="dimt sm">Part of Nyx, by Design Nexus</span></div>`;
  return B.frame({ extra: veil("b-veil") + dialog });
}

// ---- Containers ----

const COLOURS = ["var(--sw-blue)", "var(--sw-amber)", "var(--sw-green)", "var(--sw-pink)", "var(--sw-violet)", "var(--sw-teal)", "var(--sw-red)", "var(--sw-graphite)"];
function containersPage(state) {
  const crow = ([ic, c, n, d], edit) => edit
    ? `<div class="row cedit"><div class="ce"><div class="ce-top">${tile(ic, c)}<span class="ce-name">${n}<i class="caret"></i></span><span class="grow"></span>${btn("Done", "accent")}</div>
        <div class="ce-l"><span>Colour</span>${COLOURS.map((x) => `<span class="cdot ${x === c ? "on" : ""}" style="--c:${x}"></span>`).join("")}</div>
        <div class="ce-l"><span>Icon</span>${["user", "computer", "lock", "tag", "home", "star", "globe", "music"].map((x) => `<span class="cico ${x === ic ? "on" : ""}">${I(x)}</span>`).join("")}</div></div></div>`
    : row(n, d, `<span class="lnk">Edit</span><span class="ibx">${I("close")}</span>`, tile(ic, c));
  const list = [["user", "var(--sw-blue)", "Personal", "2 tabs open"], ["computer", "var(--sw-amber)", "Work", "5 tabs open · Work space opens in it"], ["lock", "var(--sw-green)", "Banking", "None open"], ["tag", "var(--sw-pink)", "Shopping", "1 tab open"]];
  const body = `${head("Layout & tabs", "How the window is laid out, and how tabs behave")}
    ${gl("Tabs")}${card([row("Open new tabs", "", drop("After related tabs")), row("Put unused tabs to sleep", "", drop("After 30 minutes"))])}
    ${gl("Containers", `<span class="glnote">Sites in one can't see your cookies in another</span>`)}${card([...list.map((c, i) => crow(c, state === "edit" && i === 1)), row("New container", "", "", `<span class="tile" style="--c:var(--text-tertiary)">${I("plus")}</span>`)])}
    ${card([row("Open links in a container", "From a link's menu, a tab's menu, or a space", sw(true))])}`;
  return settingsFrame("settings", body);
}

// ---- Library: import and back up ----

function libraryImport() {
  const page = libraryPage("bookmarks").replace(`<span class="pbtn">${I("folder")}New folder</span>`, `<span class="pbtn">${I("folder")}New folder</span><span class="pbtn on">${I("download")}Import and back up${I("chevron")}</span>`);
  const dd = `<div class="pop b-pop b-ctx" style="left:900px;top:70px;width:270px">${menu([{ h: "Bring in" }, ["browser", "From another browser…", "Firefox, Chrome, Brave"], ["file", "From a file…", "HTML"], "-", { h: "Keep a copy" }, ["history", "Back up now", "", { hover: true }], ["undo", "Restore a backup", "", { sub: true }], ["openin", "Export as a file…", "HTML"]])}</div>`;
  return B.frame({ url: "about:library", active: "library", page, extra: dd });
}

const DRAW = {
  themes: (o, s) => themesPage(o, s || "follow"),
  extensions: (o, s) => extensionsPage2(s || "menu"),
  keys: (o, s) => keysPage(o, s || "list"),
  about: (o) => aboutPage(o),
  containers: (o, s) => containersPage(s || "list"),
  library: () => libraryImport(),
};
