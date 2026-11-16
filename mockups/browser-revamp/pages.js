// Browser's own pages, the same in every layout (Studio's design): Settings, Library and Extensions
// are a page in the sheet with a sidebar of their own; the new tab page. Each returns the page's
// HTML for a layout's frame to hold.
const pagenav = (items, onId) => items.map(([g, list]) => `${g ? `<div class="gl">${g}</div>` : ""}${list.map(([id, ic, t, c, n]) => `<div class="ni ${id === onId ? "on" : ""}">${c ? tile(ic, `var(${c})`) : I(ic)}<span>${t}</span>${n ? `<span class="n">${n}</span>` : ""}</div>`).join("")}`).join("");

function settingsPage(id, cur) {
  const pane = PANES[id](cur);
  const finding = id === "settings-find";
  const body = `<div class="pg-st"><h2>${pane.title}</h2><span>${pane.sub}</span></div>${pane.top || ""}
    ${pane.groups.map((g) => `<div class="gl">${g.h}</div>${card(g.rows.map(([t, d, c]) => row(t, d, c)))}`).join("")}`;
  return `<div class="pg"><nav class="pg-nav">
      <div class="pg-find ${finding ? "on" : ""}">${I("search")}<span>${finding ? "cookies" : "Find in Settings"}</span>${finding ? I("close") : ""}</div>
      ${pagenav(SETTINGS_NAV, finding ? "" : id)}
    </nav><section class="pg-c pg-set">${body}</section></div>`;
}

const dlTile = (ic) => tile(ic, ic === "video" ? "var(--sw-red)" : ic === "image" ? "var(--sw-amber)" : "var(--sw-blue)");
function libraryPage(kind) {
  const nav = [["", [["history", "history", "History"], ["bookmarks", "bookmark", "Bookmarks", 0, "57"], ["downloads", "download", "Downloads", 0, "6"], ["reading", "reader", "Reading list", 0, "3"]]]];
  let body;
  if (kind === "history") body = `<div class="pg-top"><div class="pg-find">${I("search")}<span>Find in history</span></div><span class="pbtn">${I("trash")}Clear history…</span></div>
    ${HISTORY.map(([day, items]) => `<div class="gl">${day}</div>${card(items.map(([t, k, n]) => `<div class="row pg-hrow"><span class="tm">${t}</span>${fv(k)}<div class="rt"><b>${n}</b></div><span class="hs">${host(k)}</span></div>`))}`).join("")}`;
  else if (kind === "bookmarks") body = `<div class="pg-top"><div class="pg-find">${I("search")}<span>Find in bookmarks</span></div><span class="pbtn">${I("plus")}Add</span><span class="pbtn">${I("folder")}New folder</span></div>
    <div class="pg-bmv"><div class="pg-tree card">${BM_TREE.map(([n, c, on, d]) => `<div class="tr ${on ? "on" : ""}" style="padding-left:${10 + d * 16}px">${I(n === "Reading list" ? "reader" : "folder")}<span>${n}</span><em>${c}</em></div>`).join("")}</div>
    <div class="pg-bml">${card(TRIPS_FOLDER.filter((b) => b.key || b.folder).map((b) => b.folder ? row(b.folder, `${b.n} bookmarks`, I("arrow-right", "dimi"), `<span class="tile" style="--c:var(--sw-amber)">${I("folder")}</span>`) : row(b.t, `${host(b.key)}${SITES[b.key][2]}`, `<div class="btn">${I("more")}</div>`, fv(b.key, "lg"))))}</div></div>`;
  else body = `<div class="pg-top"><div class="pg-find">${I("search")}<span>Find in downloads</span></div><span class="pbtn">${I("folder")}Open folder</span></div>
    ${card(DOWNLOADS.map(([ic, n, s, p]) => row(n, p > 0 ? `${progress(p)}<span>384 of 620 MB · 6 s left</span>` : p < 0 ? `<span style="color:var(--danger)">${s}</span>` : s, p > 0 ? `<div class="btn">${I("pause")}</div>` : p < 0 ? `<span class="lnk">Retry</span>` : `<div class="btn">${I("folder")}</div>`, dlTile(ic))))}`;
  return `<div class="pg"><nav class="pg-nav"><div class="pg-t">${I("history")}<b>Library</b></div>${pagenav(nav, kind)}</nav><section class="pg-c">${body}</section></div>`;
}

const extNav = (on) => `<nav class="pg-nav"><div class="pg-t">${I("puzzle")}<b>Extensions</b></div>${pagenav([["", [["ext", "puzzle", "Extensions", 0, "6"], ["themes", "palette", "Themes", 0, "3"], ["plugins", "plug", "Plugins", 0, "2"], ["access", "globe", "Site access"], ["keys", "keyboard", "Shortcuts"]]]], on)}</nav>`;
function extensionsPage() {
  const big = (e, d) => `<div class="pg-xcard card">${extIcon(e, "lg")}<div class="tt"><b>${e[0]}</b><span>${d}</span></div><div class="ft"><span class="lnk">Settings</span><span class="grow"></span>${sw(e[5])}</div></div>`;
  const inst = (e) => row(e[0], e[1], `${drop(`Site access: ${e[6]}`)}${sw(e[5])}<div class="btn">${I("more")}</div>`, extIcon(e));
  return `<div class="pg">${extNav("ext")}<section class="pg-c">
      <div class="pg-top"><div class="pg-find">${I("search")}<span>Find in your extensions</span></div><span class="pbtn accent">${I("plus")}Get extensions</span></div>
      <div class="gl">Built into Browser</div>
      <div class="pg-xgrid">${big(EXTS[0], "uBlock Origin, with Nyx's panel. 1,204 blocked this week.")}${big(EXTS[1], "Nyx Passwords fills logins and passkeys.")}${big(EXTS[2], "Browser only; per workspace.")}</div>
      <div class="gl">Installed</div>${card(EXTS.slice(3).map(inst), "pg-dimoff")}
      <div class="gl">Plugins</div>${card([row("OpenH264 video codec", "Plays video calls · Cisco · 2.4.1", sw(true), tile("video", "var(--sw-blue)")), row("Widevine", "Plays protected video · Google", sw(true), tile("plug", "var(--sw-green)"))])}
    </section></div>`;
}
function extensionPage() {
  const e = EXTS[3];
  return `<div class="pg">${extNav("ext")}<section class="pg-c">
      <div class="pg-crumb"><span class="lnk">${I("back")}Extensions</span></div>
      <div class="pg-dh">${extIcon(e, "lg")}<div class="tt"><b>Dark Reader</b><span>Version 4.9.96 · by Dark Reader Ltd · updated Oct 30</span></div><span class="pbtn">${I("sliders")}Its own settings</span>${sw(true)}</div>
      <p class="pg-desc">Dark mode for every website. Turns light pages dark with adjustable brightness, contrast and sepia.</p>
      <div class="gl">Site access</div>${card([row("Read and change pages", "Only after you click its button", seg(["Always", "On click", "Never"], 1)), row("fieldnotes.example", "Allowed until you leave", `<span class="lnk">Remove</span>`, fv("journal")), row("Run in private windows", "", sw(false))])}
      <div class="gl">In Browser</div>${card([row("Pin its button", "Beside Extensions, wherever the layout keeps them", sw(true)), row("Shortcut", "Toggle on this site", `<span class="kbd"><kbd>Alt</kbd><kbd>Shift</kbd><kbd>D</kbd></span>`), row("Update automatically", "", sw(true))])}
      <div class="pg-rm"><span class="pbtn danger">${I("trash")}Remove</span><span class="pbtn">${I("help")}Report a problem</span></div>
    </section></div>`;
}

function newtabPage() {
  return `<div class="nt">
    <div class="nt-hi"><h1>Good evening</h1><span>${I("sun")} 54° in Calera · ${I("clock")} Dentist at 9:30 tomorrow</span></div>
    <div class="nt-q">${I("search")}<span>Search or enter an address</span><span class="eng"><span class="fv" style="--c:#de5833">D</span>${I("chevron")}</span></div>
    <div class="nt-favs">${FAVS.map(([k, n]) => `<div class="f">${fv(k, "xl")}<span>${n}</span></div>`).join("")}</div>
    <div class="nt-cols">
      <div><div class="gl">Jump back in</div>${card([row(title("gh"), "Work · 2 hours ago", "", fv("gh", "lg")), row(title("docs"), "Work · yesterday", "", fv("docs", "lg")), row(title("store"), "Home · asleep", "", fv("store", "lg"))])}</div>
      <div><div class="gl">Recently closed</div>${card([row(title("news"), "10 minutes ago", `<span class="lnk">Reopen</span>`, fv("news", "lg")), row(title("video"), "1 hour ago", `<span class="lnk">Reopen</span>`, fv("video", "lg")), row("3 tabs from Ridge loop", "Folder · today", `<span class="lnk">Reopen</span>`, `<span class="tile" style="--c:var(--sw-amber)">${I("folder")}</span>`)])}</div>
    </div><span class="nt-cust">${I("sliders")} Customize</span></div>`;
}
