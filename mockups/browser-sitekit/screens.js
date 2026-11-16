// Browser's site styles, scripts, YouTube enhancer and Swift Selection Search import, drawn in
// Focus's frame from the revamp with its Studio page style (pages.js, pages.css, and
// ../browser-pages/pages2.css). DRAW[page](opt, state) returns the window. The themes are the real
// Nyx ones (themes.js); the styles, scripts and engines are made up.

const B = LAYOUT.b;
const head = (t, sub, right = "") => `<div class="pg-st pg-sth"><div><h2>${t}</h2><span>${sub}</span></div>${right}</div>`;
const gl = (t, right = "") => `<div class="gl glr"><span>${t}</span>${right}</div>`;
const btn = (label, cls = "", ic = "") => `<span class="pbtn ${cls}">${ic ? I(ic) : ""}${label}</span>`;
const ibx = (ic, cls = "") => `<span class="ibx ${cls}">${I(ic)}</span>`;
const find = (ph, typed = "") => `<div class="pg-find ${typed ? "on" : ""}">${I("search")}${typed ? `<span>${typed}<i class="caret"></i></span>` : `<span>${ph}</span>`}</div>`;
const chip = (t, cls = "") => `<span class="chip ${cls}">${t}</span>`;

// Tokyo Night: the theme the styles are drawn in.
const TN = NYX_THEMES.themes.find((t) => t.id === "tokyo-night").colours;

// ---- Settings, with the three new pages under Tools ----

const NAV = [
  ...SETTINGS_NAV.map(([g, list]) => (g === "Tools" ? [g, [list[0], ["styles", "palette", "Site styles", "--sw-pink"], ["scripts", "code", "Scripts", "--sw-graphite"], ["youtube", "video", "YouTube", "--sw-red"], ...list.slice(1)]] : [g, list])),
  ["", [["about", "browser", "About Browser", "--sw-graphite"]]],
];
const settingsFrame = (on, body, extra = "") => B.frame({ url: "about:settings", active: "settings", page: `<div class="pg"><nav class="pg-nav"><div class="pg-find">${I("search")}<span>Find in Settings</span></div>${pagenav(NAV, on)}</nav><section class="pg-c pg-set">${body}</section></div>`, extra });

// ---- Sites, and pictures of them in a theme ----

// [id, name, host, letter, brand colour, picture kind]
const STYLED = [
  ["youtube", "YouTube", "youtube.com", "▶", "#e62117", "grid"],
  ["github", "GitHub", "github.com", "G", "#24292f", "repo"],
  ["google", "Google", "google.com", "G", "#4285f4", "search"],
  ["gmail", "Gmail", "mail.google.com", "M", "#d93025", "mail"],
  ["reddit", "Reddit", "reddit.com", "r", "#ff4500", "feed"],
  ["x", "X", "x.com", "X", "#14171a", "feed"],
  ["wikipedia", "Wikipedia", "wikipedia.org", "W", "#3d3d3d", "article"],
  ["duckduckgo", "DuckDuckGo", "duckduckgo.com", "D", "#de5833", "search"],
  ["stackoverflow", "Stack Overflow", "stackoverflow.com", "S", "#f48024", "repo"],
  ["hackernews", "Hacker News", "news.ycombinator.com", "Y", "#ff6600", "list"],
  ["perplexity", "Perplexity", "perplexity.ai", "P", "#20808d", "search"],
  ["pinterest", "Pinterest", "pinterest.com", "P", "#e60023", "grid"],
];
const OFF = new Set(["x", "pinterest"]);
const ico = (letter, colour, cls = "") => `<span class="sico ${cls}" style="--c:${colour}">${letter}</span>`;
const strip = (c = TN) => `<span class="tstrip">${[c.bg, c.card, c.accent, ...(c.swatches ?? []).slice(1, 5)].map((x) => `<i style="background:${x}"></i>`).join("")}</span>`;
// A site's page in a theme's colours: its header and the shape of its content.
function sitePic(kind, c = TN, cls = "") {
  const body = {
    grid: `<div class="sp-grid">${"<i></i>".repeat(8)}</div>`,
    repo: `<div class="sp-repo"><b></b>${"<u></u>".repeat(6)}</div>`,
    search: `<div class="sp-search"><em></em><span></span></div>`,
    mail: `<div class="sp-mail"><i class="side"></i><div>${"<u></u>".repeat(7)}</div></div>`,
    feed: `<div class="sp-feed">${"<i><b></b><u></u></i>".repeat(3)}</div>`,
    article: `<div class="sp-article"><b></b>${"<u></u>".repeat(7)}</div>`,
    list: `<div class="sp-list">${"<u></u>".repeat(9)}</div>`,
  }[kind];
  return `<div class="sp ${cls}" style="--b:${c.bg};--p:${c.panel};--c:${c.card};--t:${c.text};--d:${c.dim};--a:${c.accent}"><div class="sp-top"><i></i><span></span></div>${body}</div>`;
}

// A code editor, as CodeMirror draws it in the Nyx editor theme.
function code(lines, { start = 1, cursor = -1 } = {}) {
  return `<div class="cm">${lines.map((l, i) => `<div class="cl ${i === cursor ? "cur" : ""}"><span class="ln">${start + i}</span><span class="cc">${l}</span></div>`).join("")}</div>`;
}
const k = (t) => `<span class="tk">${t}</span>`; // keyword or at-rule
const s = (t) => `<span class="ts">${t}</span>`; // string
const m = (t) => `<span class="tm">${t}</span>`; // comment, metadata
const p = (t) => `<span class="tp">${t}</span>`; // property
const v = (t) => `<span class="tv">${t}</span>`; // value

// ---- Site styles ----

const MINE = [
  ["Wide diffs", "github.com · 2 sections", "#24292f", "G", true],
  ["Field Notes: serif headings", "fieldnotes.example", "#c0843d", "F", true],
  ["Calendar: compact weeks", "calendar.example", "#d14836", "C", false],
];
const stylesHead = () => head("Site styles", "Styles that change how sites look. Browser's follow your theme: they're in Tokyo Night now.", `<div class="hbtns">${btn("Import", "", "download")}${btn("New style", "accent", "plus")}</div>`);
const mineRows = () => card(MINE.map(([n, d, col, l, on]) => row(n, d, `${sw(on)}${ibx("more")}`, ico(l, col))), "pg-dimoff");

function stylesList(opt) {
  if (opt === "a") {
    const r = ([id, name, host, l, col]) => `<div class="srow">${ico(l, col)}<div class="rt"><b>${name}</b><span>${host}</span></div>${sw(!OFF.has(id))}</div>`;
    return `${stylesHead()}
      ${gl("Browser's styles", `<span class="glnote">${strip()}Tokyo Night · ${STYLED.length - OFF.size} of ${STYLED.length} on</span>`)}
      <div class="card scols">${STYLED.map(r).join("")}</div>
      ${gl("Your styles")}${mineRows()}`;
  }
  if (opt === "b") {
    const c = ([id, name, host, l, col, kind]) => `<div class="scard ${OFF.has(id) ? "off" : ""}">${sitePic(kind)}<div class="sn">${ico(l, col, "sm")}<b>${name}</b>${sw(!OFF.has(id))}</div></div>`;
    return `${stylesHead()}
      ${gl("Browser's styles", `<span class="glnote">Catppuccin's, in your theme</span>`)}
      <div class="sgrid">${STYLED.slice(0, 8).map(c).join("")}</div>
      ${gl("Your styles")}${mineRows()}`;
  }
  const item = ([id, name, host, l, col], on) => `<div class="lrow2 ${on ? "on" : ""}">${ico(l, col, "sm")}<b>${name}</b><span class="dot ${OFF.has(id) ? "" : "lit"}"></span></div>`;
  return `${stylesHead()}
    <div class="scols2">
      <div class="card slist">${gl("Browser's")}${STYLED.map((st, i) => item(st, i === 0)).join("")}${gl("Yours")}${MINE.map(([n, , col, l, on]) => `<div class="lrow2">${ico(l, col, "sm")}<b>${n}</b><span class="dot ${on ? "lit" : ""}"></span></div>`).join("")}</div>
      <div class="sdetail">
        ${sitePic("grid", TN, "lg")}
        <div class="sdh">${ico("▶", "#e62117")}<div class="rt"><b>YouTube</b><span>Browser's style, from Catppuccin · follows your theme</span></div>${sw(true)}</div>
        ${card([row("Applies to", "youtube.com, m.youtube.com, music.youtube.com", ""), row("Accent", "The theme's own, or another of its swatches", drop("Theme accent")), row("Rounded thumbnails", "", sw(true)), row("Hide the Shorts shelf", "", sw(false))])}
        <div class="hbtns">${btn("Edit a copy", "", "code")}${btn("Check for updates", "", "reload")}</div>
      </div>
    </div>`;
}

function styleEditor() {
  const lines = [
    m("/* ==UserStyle=="), m("@name        Wide diffs"), m("@namespace  fieldnotes.example/styles"), m("@version    1.2.0"),
    m("@var checkbox hideTree \"Hide the file tree\" 1"), m("@var range width \"Width\" [1600, 1200, 2400, 100, \"px\"]"), m("==/UserStyle== */"), "",
    `${k("@-moz-document")} ${k("domain")}(${s("\"github.com\"")}) {`,
    `  ${p(".container-xl")} { ${p("max-width")}: ${v("var(--width)")}; }`,
    `  ${p(".diff-table")} { ${p("font-size")}: ${v("13px")}; }`,
    `  ${p(".file-header")} {`,
    `    ${p("background")}: ${v("var(--nyx-card)")};`,
    `    ${p("border-color")}: ${v("var(--nyx-accent)")};`,
    "  }",
    "}",
  ];
  return `<div class="pg-crumb"><span class="lnk">${I("back")}Site styles</span></div>
    <div class="pg-dh">${ico("G", "#24292f", "lg")}<div class="tt"><b>Wide diffs</b><span>Your style · github.com · edited just now</span></div>${sw(true)}${ibx("more")}</div>
    <div class="ecols">
      <div class="ecode">${code(lines, { cursor: 12 })}<div class="ebar"><span class="ok">● Saved</span><span class="grow"></span>${btn("Undo changes", "", "undo")}${btn("Save", "accent", "check")}</div></div>
      <div class="eside">
        ${gl("Applies to", `<span class="lnk">${I("plus")}Add</span>`)}${card([row("github.com", "Domain, and its subdomains", ibx("close")), row("gist.github.com/", "Addresses that start with this", ibx("close"))])}
        ${gl("Its options")}${card([row("Hide the file tree", "", sw(true)), row("Width", "", `<span class="rng"><i style="width:40%"></i><b style="left:40%"></b></span><em class="rv">1600 px</em>`)])}
        ${gl("Preview")}${sitePic("repo", TN, "md")}
      </div>
    </div>`;
}

function importOverlay(kind) {
  const isStyles = kind === "styles";
  const list = isStyles
    ? [["YouTube Catppuccin", "youtube.com", "LESS · 4 options", "Browser has YouTube: keep both, Browser's off"], ["GitHub Catppuccin", "github.com", "LESS · 5 options", "Browser has GitHub: keep both, Browser's off"], ["Wikipedia Catppuccin", "wikipedia.org", "LESS · 3 options", ""], ["Hacker News wide", "news.ycombinator.com", "CSS", ""], ["Old Calendar fix", "calendar.example", "CSS · off in Stylus", ""]]
    : [["GitHub: wide diffs", "github.com", "4 values", ""], ["Hacker News: collapse threads", "news.ycombinator.com", "1 value", ""], ["Reddit: open in new tabs", "reddit.com", "off in Tampermonkey", ""], ["Maps: metric distances", "maps.example", "talks to api.maps.example", "Asks to talk to another site"]];
  const rows = list.map(([n, d, c, warn]) => `<div class="irow"><span class="cbx on">${I("check")}</span><div class="rt"><b>${n}</b><span>${d}${warn ? ` · <em class="warnt">${warn}</em>` : ""}</span></div>${chip(c)}</div>`).join("");
  return `<div class="veil"></div><div class="pop b-pop idlg">
    <div class="idh"><span class="tile" style="--c:var(--sw-blue)">${I("download")}</span><div class="rt"><b>${isStyles ? "Import from Stylus" : "Import from Tampermonkey"}</b><span>${isStyles ? "stylus-2026-11-02.json · 12 styles" : "tampermonkey-backup-2026-11-02.zip · 4 scripts"}</span></div></div>
    <div class="ilist card">${rows}</div>
    ${isStyles ? `<p class="pnote2">LESS styles come with their options; change them once they're in. Styles for sites Browser has a style for are kept beside Browser's, which is turned off for that site.</p>` : `<p class="pnote2">Their stored values come too. A script that talks to other sites says which, on its page.</p>`}
    <div class="ifoot"><span class="sw on"><i></i></span><span>${isStyles ? "Keep them up to date from where they came from" : "Check for updates"}</span><span class="grow"></span>${btn("Cancel")}${btn(isStyles ? "Import 12 styles" : "Import 4 scripts", "accent")}</div></div>`;
}

const styles = (o, st) => settingsFrame("styles", st === "editor" ? styleEditor() : stylesList(o), st === "import" ? importOverlay("styles") : "");

// ---- Scripts ----

const SCRIPTS = [
  ["GitHub: wide diffs", "github.com · v1.4 · updated 3 days ago", "G", "#24292f", true, "Runs at start"],
  ["Hacker News: collapse threads", "news.ycombinator.com · v0.9 · updated last month", "Y", "#ff6600", true, ""],
  ["Maps: metric distances", "maps.example · v2.1 · talks to api.maps.example", "M", "#2f9e64", true, ""],
  ["Reddit: open in new tabs", "reddit.com · v1.0", "r", "#ff4500", false, ""],
];
function scriptsList() {
  return `${head("Scripts", "Little programs that run on the sites they name, like Tampermonkey's. Each one asks for what it needs.", `<div class="hbtns">${btn("Import", "", "download")}${btn("New script", "accent", "plus")}</div>`)}
    <div class="pg-top">${find("Find a script")}${btn("Check for updates", "", "reload")}</div>
    ${card(SCRIPTS.map(([n, d, l, col, on, run]) => row(n, d, `${run ? chip(run) : ""}${sw(on)}${ibx("more")}`, ico(l, col))), "pg-dimoff")}
    <p class="pnote2">Scripts run only on their sites, apart from the page's own code unless they ask to share it (@grant none). Their menus are in the Site card.</p>`;
}
function scriptEditor(state) {
  const lines = [
    m("// ==UserScript=="), m("// @name         GitHub: wide diffs"), m("// @namespace    fieldnotes.example"), m("// @version      1.4"), m("// @match        https://github.com/*"),
    m("// @grant        GM_getValue"), m("// @grant        GM_setValue"), m("// @grant        GM_registerMenuCommand"), m("// @run-at       document-start"), m("// ==/UserScript=="), "",
    `${k("const")} wide = GM_getValue(${s("\"wide\"")}, ${k("true")});`,
    `GM_registerMenuCommand(${s("\"Toggle wide\"")}, () => {`,
    `  GM_setValue(${s("\"wide\"")}, !wide);`,
    `  location.reload();`,
    "});",
  ];
  const tabs = `<div class="pg-tabs">${["Code", "Values"].map((t) => `<span class="${(state === "values") === (t === "Values") ? "on" : ""}">${t}</span>`).join("")}</div>`;
  const top = `<div class="pg-crumb"><span class="lnk">${I("back")}Scripts</span></div>
    <div class="pg-dh">${ico("G", "#24292f", "lg")}<div class="tt"><b>GitHub: wide diffs</b><span>v1.4 · from greasyfork.example · updated 3 days ago</span></div>${sw(true)}${ibx("more")}</div>${tabs}`;
  if (state === "values") {
    return top + `${card([["wide", "true"], ["collapsed", "[\"src/\", \"docs/\"]"], ["lastRun", "\"2026-11-14T09:12:00Z\""]].map(([key, val]) => `<div class="row vrow"><span class="mono kk">${key}</span><span class="mono vv">${val}</span>${ibx("note")}${ibx("close")}</div>`))}
      <div class="hbtns">${btn("Add a value", "", "plus")}${btn("Clear all", "danger", "trash")}</div>
      <p class="pnote2">What the script kept with GM_setValue. Change one only if you know what the script expects.</p>`;
  }
  return top + `<div class="ecols">
      <div class="ecode">${code(lines, { cursor: 13 })}<div class="ebar"><span class="ok">● Saved</span><span class="grow"></span>${btn("Undo changes", "", "undo")}${btn("Save", "accent", "check")}</div></div>
      <div class="eside">
        ${gl("What it may do")}${card([row("Run on github.com", "Every page there", "", `<span class="tile" style="--c:var(--sw-blue)">${I("globe")}</span>`), row("Keep its own values", "3 kept", "", `<span class="tile" style="--c:var(--sw-teal)">${I("file")}</span>`), row("Add to the Site card's menu", "Toggle wide", "", `<span class="tile" style="--c:var(--sw-violet)">${I("menu")}</span>`)])}
        ${gl("When it runs")}${card([row("Runs", "", seg(["At start", "Ready", "Idle"], 0)), row("In frames too", "", sw(false))])}
        ${gl("Updates")}${card([row("Check for updates", "From greasyfork.example", sw(true))])}
      </div></div>`;
}
const scripts = (o, st) => settingsFrame("scripts", st === "editor" || st === "values" ? scriptEditor(st) : scriptsList(), st === "import" ? importOverlay("scripts") : "");

// ---- Install card ----

function rawPage(lines) {
  return `<div class="raw">${lines.map((l) => `<div>${l || "&nbsp;"}</div>`).join("")}</div>`;
}
function install(o, st) {
  const style = st === "style";
  const page = rawPage(style
    ? ["/* ==UserStyle==", "@name YouTube Calm", "@namespace userstyles.example/youtube-calm", "@version 2.3.1", "@author Ridge Studio", "@preprocessor less", "@var select accent \"Accent\" [\"blue\", \"teal\", \"pink\"]", "==/UserStyle== */", "", "@-moz-document domain(\"youtube.com\") {", "  ytd-app { background: @base; }", "  …"]
    : ["// ==UserScript==", "// @name         Maps: metric distances", "// @namespace    greasyfork.example/1234", "// @version      2.1", "// @author       Field Notes", "// @match        https://maps.example/*", "// @grant        GM_xmlhttpRequest", "// @grant        GM_setValue", "// @connect      api.maps.example", "// ==/UserScript==", "", "(async () => {", "  …"]);
  const rowsS = [row("Applies to", "youtube.com", "", `<span class="tile" style="--c:var(--sw-blue)">${I("globe")}</span>`), row("Options", "Accent, and 3 more; set them after installing", "", `<span class="tile" style="--c:var(--sw-violet)">${I("sliders")}</span>`), row("Updates", "From userstyles.example, version 2.3.1", sw(true), `<span class="tile" style="--c:var(--sw-teal)">${I("reload")}</span>`)];
  const rowsJ = [row("Runs on", "maps.example", "", `<span class="tile" style="--c:var(--sw-blue)">${I("globe")}</span>`), row("Talks to another site", "api.maps.example, with your cookies there", "", `<span class="tile" style="--c:var(--sw-amber)">${I("warning")}</span>`), row("Keeps its own values", "", "", `<span class="tile" style="--c:var(--sw-teal)">${I("file")}</span>`), row("Updates", "From greasyfork.example, version 2.1", sw(true), `<span class="tile" style="--c:var(--sw-teal)">${I("reload")}</span>`)];
  const cardHtml = `<div class="pop b-pop icard">
    <div class="idh">${style ? ico("▶", "#e62117", "lg") : ico("M", "#2f9e64", "lg")}<div class="rt"><b>${style ? "Install this style?" : "Install this script?"}</b><span>${style ? "YouTube Calm · by Ridge Studio · userstyles.example" : "Maps: metric distances · by Field Notes · greasyfork.example"}</span></div></div>
    ${card(style ? rowsS : rowsJ)}
    ${style ? `<p class="pnote2">Browser has its own YouTube style; this one goes beside it, and Browser's turns off on youtube.com.</p>` : `<p class="pnote2">Install only scripts from people you trust: a script can read and change the pages it runs on.</p>`}
    <div class="ifoot"><span class="lnk">${I("code")}See its code</span><span class="grow"></span>${btn("Cancel")}${btn("Install", "accent", "download")}</div></div>`;
  return B.frame({ url: "journal", page, extra: cardHtml });
}

// ---- Site card ----

function siteCard() {
  const t = (ic, c, name, state, on) => `<div class="b-tg ${on ? "on" : ""}" style="--c:${c}">${I(ic)}<b>${name}</b><span>${state}</span></div>`;
  const body = `<div class="b-sh">${ico("G", "#24292f", "xl")}<div class="tt"><b>github.com</b><span class="ok">${I("lock")} Secure · DigiCert</span></div></div>
    <div class="b-tgs">${t("shield", "var(--sw-coral)", "Blocking", "6 blocked", true)}${t("key", "var(--sw-violet)", "Passwords", "1 login", true)}${t("globe", "var(--sw-teal)", "VPN", "Off", false)}${t("reader", "var(--sw-amber)", "Reader", "—", false)}</div>
    <div class="b-grp onsite"><div class="mh">On this site</div>
      ${row("GitHub", "Browser's style · in Tokyo Night", sw(true), `<span class="tile" style="--c:var(--sw-pink)">${I("palette")}</span>`)}
      ${row("Wide diffs", "Your style", sw(true), `<span class="tile" style="--c:var(--sw-pink)">${I("palette")}</span>`)}
      ${row("GitHub: wide diffs", "Script · running", `<span class="chip">${I("menu")}Toggle wide</span>`, `<span class="tile" style="--c:var(--sw-graphite)">${I("code")}</span>`)}
      <div class="osfoot"><span class="lnk">Find styles for this site</span><span class="grow"></span><span class="lnk">Site styles</span></div></div>
    <div class="b-sf"><span>${I("file")}2.1 MB stored</span><span class="grow"></span><span class="lnk">All site settings</span></div>`;
  const page = `<div class="ghpage">${sitePic("repo", TN, "full")}</div>`;
  return B.frame({ url: "gh", active: "gh", page, on: "site", extra: pop(body, { x: 236, y: 40, w: 360, cls: "b-pop b-site" }) });
}

// ---- YouTube ----

function youtube() {
  const body = `${head("YouTube", "How YouTube plays in Browser. Its colours are a Site style; its ads are Blocking's.")}
    ${gl("Player")}${card([row("Theater mode, always", "Videos open wide; YouTube's own button still switches back", sw(true)), row("No mini player", "Scrolling to the comments keeps the video where it is", sw(true))])}
    ${gl("Playback")}${card([row("Quality", "For videos, playlists and embedded videos", drop("1080p, or the best below")), row("Speed", "", drop("1×")), row("Volume", "Each video starts at", drop("YouTube's own")), row("Mouse wheel over the video", "Volume; with Ctrl, speed", sw(true)), row("Pause other tabs' videos", "When one starts playing", sw(true)), row("No autoplay in background tabs", "A video opened in the background waits until you look", sw(true)), row("Turn off “autoplay next”", "", sw(false))])}
    ${gl("Page")}${card([row("Hide cards and end screens", "The boxes over the video's last seconds", sw(true)), row("Open Shorts in the normal player", "With its controls, speed and theater mode", sw(false))])}`;
  return settingsFrame("youtube", body);
}

// ---- Selection search import ----

const ENGINES = [["Google", "#4285f4", "G"], ["Bing", "#008373", "b"], ["Google Images", "#4285f4", "G"], ["Maps", "#2f9e64", "M"], ["YouTube", "#e62117", "▶"], ["Reddit", "#ff4500", "r"], ["IMDb", "#f5c518", "I"], ["GitHub", "#24292f", "G"], ["Wikipedia", "#3d3d3d", "W"], ["Translate", "#4285f4", "T"]];
function sssPane() {
  return `${head("Selection search", "Search for selected text, from a row of icons over it")}
    ${card([row("Import from Swift Selection Search", "Its engines and settings, from a backup or from Swift Selection Search here", btn("Import…", "", "download"), `<span class="tile" style="--c:var(--sw-pink)">${I("select")}</span>`)])}
    ${gl("Popup")}${card([row("Show it", "", seg(["When text is selected", "With Alt", "Middle click", "Off"], 0)), row("Text box in the popup", "", sw(true))])}
    ${gl("Engines", `<span class="lnk">Add or remove engines…</span>`)}${card(ENGINES.slice(0, 6).map(([n, c, l]) => row(n, "", sw(true), `<span class="grip">${I("grip")}</span>${ico(l, c, "sm")}`)))}`;
}
function sssPreview() {
  const HOSTS = { Bing: "bing.com", Maps: "maps.example", YouTube: "youtube.com", Translate: "translate.example" };
  const rows = ENGINES.filter(([n]) => !["Google Images", "IMDb", "GitHub"].includes(n)).map(([n, c, l]) => {
    const fix = n === "Reddit";
    const have = n === "Google" || n === "Wikipedia";
    return `<div class="irow"><span class="cbx ${have ? "" : "on"}">${have ? "" : I("check")}</span>${ico(l, c, "sm")}<div class="rt"><b>${n}</b><span>${fix ? `<em class="warnt">Its address has no q= · fixed to /search?q=…</em>` : have ? "Browser has it already · kept as it is" : HOSTS[n]}</span></div>${fix ? chip("Fixed", "warn") : ""}</div>`;
  }).join("");
  return `<div class="veil"></div><div class="pop b-pop idlg">
    <div class="idh"><span class="tile" style="--c:var(--sw-pink)">${I("select")}</span><div class="rt"><b>Import from Swift Selection Search</b><span>SSS settings backup (2026-11-02).json · 19 engines</span></div></div>
    <div class="ilist card">${rows}<div class="irow more"><span class="dimt">and 12 more</span></div></div>
    <div class="ilist card iset">${[["Show it when text is selected", true], ["Open results in a new tab", true], ["Off on 2 sites", true]].map(([t, on]) => `<div class="irow"><span class="cbx ${on ? "on" : ""}">${I("check")}</span><div class="rt"><b>${t}</b></div></div>`).join("")}</div>
    <p class="pnote2">Copy and Open as link are Browser's own buttons already. Its engines join Settings › Search too.</p>
    <div class="ifoot"><span class="grow"></span>${btn("Cancel")}${btn("Import 17 engines", "accent")}</div></div>`;
}
const sss = (o, st) => settingsFrame("sel", sssPane(), st === "preview" ? sssPreview() : "");

const DRAW = {
  styles: (o, st) => styles(o, st || "list"),
  scripts: (o, st) => scripts(o, st || "list"),
  install: (o, st) => install(o, st || "style"),
  sitecard: () => siteCard(),
  youtube: () => youtube(),
  sss: (o, st) => sss(o, st || "pane"),
};
