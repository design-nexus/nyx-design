// Nyx Git mockups: sample data (nyx-git's own history, files and diffs), Git's parts
// (header, sidebar, page bar, inspector) and every page. Loaded after ../polish/mock.js,
// which reads the theme and screen from the URL and draws its icons once the page is built.
"use strict";
const Q = new URLSearchParams(location.search);
const ROOT = document.documentElement;
const SCREEN = ROOT.dataset.screen;
const SHOT = Q.get("shot") === "1";
const NARROW = Q.get("w") === "800";

/* ── Icons mock.js doesn't have ─────────────────────────────────────────── */
const GI = {
  git: '<circle cx="6" cy="5.5" r="2.2"/><circle cx="6" cy="18.5" r="2.2"/><circle cx="18" cy="8" r="2.2"/><path d="M6 7.7v8.6M18 10.2c0 4-6 3.5-11 7"/>',
  branch: '<circle cx="6.5" cy="5.5" r="2.2"/><circle cx="6.5" cy="18.5" r="2.2"/><circle cx="17.5" cy="7" r="2.2"/><path d="M6.5 7.7v8.6M17.5 9.2c0 4.3-4 5-9.5 7.6"/>',
  flow: '<circle cx="5" cy="12" r="2.2"/><circle cx="19" cy="5.5" r="2.2"/><circle cx="19" cy="18.5" r="2.2"/><path d="M7.2 12c5 0 5-6.5 9.6-6.5M7.2 12c5 0 5 6.5 9.6 6.5"/>',
  changes: '<path d="M14 3H7.5A2.5 2.5 0 0 0 5 5.5v13A2.5 2.5 0 0 0 7.5 21h9a2.5 2.5 0 0 0 2.5-2.5V8z"/><path d="M14 3v5h5M12 11v6M9 14h6"/>',
  history: '<path d="M3.5 12a8.5 8.5 0 1 0 2.5-6"/><path d="M3.5 4v4.5H8M12 7.5V12l3 2"/>',
  review: '<path d="M12 21s7.5-3.6 7.5-9.5V5.5L12 3 4.5 5.5v6C4.5 17.4 12 21 12 21z"/><path d="m8.8 12 2.2 2.2 4.2-4.4"/>',
  activity: '<path d="M3 12h4l3-7 4 14 3-7h4"/>',
  sync: '<path d="M20 12a8 8 0 0 1-13.7 5.7M4 12a8 8 0 0 1 13.7-5.7"/><path d="M17.5 2.5v4h-4M6.5 21.5v-4h4"/>',
  down: '<path d="M12 4v14M6.5 12.5 12 18l5.5-5.5"/>',
  up: '<path d="M12 20V6M6.5 11.5 12 6l5.5 5.5"/>',
  worktree: '<path d="M3 7.5A2.5 2.5 0 0 1 5.5 5H9l2 2.2h7.5A2.5 2.5 0 0 1 21 9.7v7.8a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 17.5z"/><path d="M9 15.5V12M9 12c0-1.6 1.2-2.4 3-2.4h3"/>',
  remote: '<path d="M17.5 19a4.5 4.5 0 1 0-1.3-8.8A6 6 0 0 0 4.5 12a3.5 3.5 0 0 0 1.5 7z"/>',
  stash: '<rect x="3.5" y="4" width="17" height="5" rx="1.5"/><path d="M5 9v9a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9M10 13h4"/>',
  commit: '<circle cx="12" cy="12" r="3.5"/><path d="M3 12h5.5M15.5 12H21"/>',
  merge: '<circle cx="6" cy="5.5" r="2.2"/><circle cx="6" cy="18.5" r="2.2"/><circle cx="18" cy="18.5" r="2.2"/><path d="M6 7.7v8.6M6 7.7c0 6 5 8.6 9.8 10.8"/>',
  rebase: '<circle cx="6" cy="5" r="2"/><circle cx="6" cy="19" r="2"/><circle cx="18" cy="12" r="2"/><path d="M6 7v10M8 5c6 0 8 2 8 5M8 19c6 0 8-2 8-5"/>',
  cherry: '<circle cx="7.5" cy="16.5" r="3.5"/><circle cx="16.5" cy="17.5" r="3.5"/><path d="M8.5 13C10 8 13 5 18 3.5M15.5 14c-.5-4 .5-7.5 2.5-10.5"/>',
  minus: '<path d="M5 12h14"/>',
  open: '<path d="M14.5 3.5h6v6M10 14 20.5 3.5M18.5 13.5v5a2 2 0 0 1-2 2h-11a2 2 0 0 1-2-2v-11a2 2 0 0 1 2-2h5"/>',
  copy: '<rect x="8" y="8" width="12.5" height="12.5" rx="2.5"/><path d="M16 8V6a2.5 2.5 0 0 0-2.5-2.5h-7A2.5 2.5 0 0 0 4 6v7a2.5 2.5 0 0 0 2.5 2.5H8"/>',
  grip: '<path d="M9 6h.01M15 6h.01M9 12h.01M15 12h.01M9 18h.01M15 18h.01" stroke-width="2.6"/>',
  alert: '<path d="M12 3.5 2.5 20h19z"/><path d="M12 10v4.5M12 17.5h.01" stroke-width="1.9"/>',
  fit: '<path d="M4 9V5.5A1.5 1.5 0 0 1 5.5 4H9M15 4h3.5A1.5 1.5 0 0 1 20 5.5V9M20 15v3.5a1.5 1.5 0 0 1-1.5 1.5H15M9 20H5.5A1.5 1.5 0 0 1 4 18.5V15"/>',
  help: '<circle cx="12" cy="12" r="9"/><path d="M9.6 9.3a2.5 2.5 0 0 1 4.8 1c0 1.7-2.4 2.2-2.4 3.7M12 17h.01" stroke-width="1.8"/>',
  terminal: '<rect x="3" y="4.5" width="18" height="15" rx="2.5"/><path d="m7 9.5 3 2.5-3 2.5M12.5 15H17"/>',
  agent: '<rect x="5" y="7" width="14" height="11" rx="3"/><path d="M12 7V4.5M9 12h.01M15 12h.01M9.5 15.2h5" stroke-width="1.7"/>',
  zoomin: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5M11 8v6M8 11h6"/>',
  zoomout: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5M8 11h6"/>',
  undo: '<path d="M9 14 4 9l5-5"/><path d="M4 9h11a5 5 0 0 1 0 10h-2"/>',
  conflict: '<path d="M12 3.5 2.5 20h19z"/><path d="M9 13.5h6M9 16.5h6"/>',
};
const icon = (n, c = "") => `<i data-i="${n}"${c ? ` class="${c}"` : ""}></i>`;
const ib = (n, tip = "", c = "") => `<button class="ib ${c}"${tip ? ` title="${tip}"` : ""}>${icon(n)}</button>`;
const search = (ph, o = {}) => `<div class="search ${o.wide ? "wide" : ""} ${o.focus ? "focus" : ""}">${icon("search")}<span${o.q ? ' style="color:var(--text)"' : ""}>${o.q || ph}</span><span class="key">${o.key ?? "Ctrl F"}</span></div>`;
const seg = (items, on, c = "") => `<div class="seg ${c}">${items.map((x) => { const [k, label, ic] = Array.isArray(x) ? x : [x, x]; return `<button class="${k === on ? "on" : ""}">${ic ? icon(ic) : ""}<span>${label}</span></button>`; }).join("")}</div>`;
const lab = (t, cnt = "", act = "") => `<div class="lab">${t}${cnt !== "" ? `<span class="cnt">${cnt}</span>` : ""}${act ? `<span class="act">${act}</span>` : ""}</div>`;
const kv = (k, v) => `<div class="kv"><span class="k">${k}</span><span class="v">${v}</span></div>`;
const arow = (ic, t, c = "", k = "") => `<div class="arow ${c}">${icon(ic)}<span>${t}</span>${k ? `<span class="k">${k}</span>` : ""}</div>`;
const sc = (s) => `<span class="sc ${s.toLowerCase()}">${s}</span>`;
const pill = (t, c = "", dot = false) => `<span class="pill ${c}">${dot ? '<span class="d"></span>' : ""}${t}</span>`;

/* ── Data: nyx-git as it is on Ken's laptop, plus the work in progress around it ── */
const REPO = { name: "nyx-git", path: "~/Projects/nyx-git", branch: "main", up: "origin/main", ahead: 2, behind: 0 };
const WORKTREES = [
  { name: "nyx-git", branch: "main", path: "~/Projects/nyx-git", changed: 4, here: true },
  { name: "nyx-git-header", branch: "ui/header-polish", path: "~/Projects/nyx-git-header", changed: 2, agent: "Claude Code", state: "working" },
  { name: "nyx-git-review", branch: "feature/review-checks", path: "~/Projects/nyx-git-review", changed: 0 },
];
const BRANCHES = [
  { name: "main", up: "origin/main", ahead: 2, current: true },
  { name: "ui/header-polish", ahead: 4, behind: 0, wt: "nyx-git-header", agent: true },
  { name: "feature/review-checks", ahead: 2, behind: 1, wt: "nyx-git-review", pr: 47 },
  { name: "agents/codex-palette", ahead: 3, behind: 0, agentBlocked: true },
  { name: "fix/blame-non-utf8", ahead: 1, behind: 3, pr: 45 },
];
const COMMITS = [
  ["f6a12d0", "Header: the destinations stay in one place", "Ken Smith", "19 minutes ago", "main"],
  ["a36ad16", "Git 2.0 refinement: Flow reads its branches in parallel", "Ken Smith", "43 minutes ago", "origin/main"],
  ["e598782", "Control API 2: nyx git status, repos, branches, worktrees…", "Ken Smith", "48 minutes ago"],
  ["99ad956", "Review: the repository's pull and merge requests", "Ken Smith", "55 minutes ago"],
  ["12de5f3", "Rebase Studio and Conflict Studio", "Ken Smith", "1 hour ago"],
  ["e9941f0", "Flow: the work in progress on a canvas", "Ken Smith", "1 hour ago"],
  ["0fab0f6", "Git 2.0 foundation: five destinations in the header", "Ken Smith", "1 hour ago", "", "v2.0.0-beta"],
  ["5bea5e6", "Build against nyx-design 8b41fb1 and nyx-core 9187295", "Ken Smith", "2 hours ago"],
  ["6370fa6", "Dropdown lists check the current choice", "Ken Smith", "21 hours ago"],
  ["a455048", "One nyx-core: the revision nyx-design uses", "Ken Smith", "3 days ago"],
  ["cdd24ce", "Theme Engine 2.0: follows theme changes as they happen", "Ken Smith", "3 days ago", "", "v1.4.0"],
  ["5e227a5", "Bump nyx-design: window controls on floating windows", "Ken Smith", "8 days ago"],
  ["f65d3f9", "Allow restarting background services after installation", "Ken Smith", "11 days ago"],
  ["9371e23", "fix: add visible dialog dismissal controls", "Ken Smith", "13 days ago"],
  ["0e568c7", "Add repository and playback settings with working behavior", "Ken Smith", "2 weeks ago"],
  ["698b282", "Settings: standard groups; Changes filter in the header", "Ken Smith", "2 weeks ago"],
];
const FILES = {
  staged: [["M", "window.rs", "apps/git/src/ui"], ["A", "header.rs", "apps/git/src/ui"]],
  changes: [["M", "style.css", "apps/git/src/ui"], ["M", "sidebar.rs", "apps/git/src/ui"]],
  untracked: [["A", "pagebar.rs", "apps/git/src/ui"]],
};
// window.rs, the header change: f6a12d0's diff.
const DIFF = [
  ["h", "@@ -188,7 +188,7 @@ pub fn present(app: &gtk::Application) -> Rc<Ui> {"],
  [" ", 188, "    let search = gtk::SearchEntry::new();"],
  [" ", 189, '    search.set_placeholder_text(Some("Filter changed files"));'],
  ["-", 191, '    search.set_width_chars(<mark class="d">22</mark>);'],
  ["+", 191, '    search.set_width_chars(<mark class="a">18</mark>);'],
  [" ", 192, "    search.set_valign(gtk::Align::Center);"],
  ["h", "@@ -208,8 +208,9 @@"],
  [" ", 208, "        let row = widgets::hbox(4);"],
  [" ", 210, "        row.append(&image);"],
  ["+", 211, "        // A fixed-width count, empty at zero, so the header never reflows."],
  [" ", 212, '        let count = widgets::label("", "sync-count");'],
  ["-", 213, "        count.<mark class=\"d\">set_visible(false)</mark>;"],
  ["+", 213, "        count.<mark class=\"a\">set_width_chars(2)</mark>;"],
  [" ", 214, "        row.append(&count);"],
  [" ", 215, "        b.set_child(Some(&row));"],
  ["h", "@@ -395,6 +396,10 @@"],
  [" ", 396, "    let summary = header.subtitle.clone();"],
  [" ", 397, "    summary.set_ellipsize(gtk::pango::EllipsizeMode::Middle);"],
  ["+", 398, "    // Fixed widths on both sides of the header keep the destinations in one place."],
  ["+", 399, "    summary.set_width_chars(26);"],
  ["+", 400, "    summary.set_max_width_chars(26);"],
  ["+", 401, "    summary.set_xalign(0.0);"],
  [" ", 402, '    summary.set_text("Open a repository");'],
  [" ", 403, "    summary.set_visible(true);"],
];

/* ── Window parts ───────────────────────────────────────────────────────── */
const DESTS = [["flow", "Flow", "flow"], ["changes", "Changes", "changes"], ["history", "History", "history"], ["review", "Review", "review"], ["activity", "Activity", "activity"]];
const syncBtn = (o = {}) => `<button class="sync ${o.open ? "open" : ""}" title="Push 2 commits to origin/main"><span class="main">${icon("sync")}<span class="n">${icon("down")}<b>${REPO.behind}</b></span><span class="n">${icon("up")}<b>${REPO.ahead}</b></span></span><span class="more">${icon("chev-d")}</span></button>`;
const switchers = (o = {}) => `<button class="sw repo ${o.repoOpen ? "open" : ""}" title="Repositories (Ctrl+K)">${icon("folder")}<span>${o.repo || REPO.name}</span>${icon("chev-d")}</button>
  ${o.noBranch ? "" : `<button class="sw br ${o.state ? "warnst" : ""} ${o.brOpen ? "open" : ""}" title="Branches (Ctrl+Shift+B)">${icon("branch")}<span>${o.branch || REPO.branch}${o.state ? ` <span class="st">· ${o.state}</span>` : ""}</span>${icon("chev-d")}</button>`}`;

// dir: a (centred destinations), b (destinations in the sidebar), c (command field, tabs below)
function header(dest = "changes", o = {}) {
  const dir = o.dir || "a";
  const id = `<div class="hdr-id">${icon("git", "app-ic")}<span class="app-name">Git</span></div>`;
  const start = `<div class="hdr-start"><span class="gap"></span>${o.empty ? "" : switchers(o)}</div>`;
  const end = (extra = "") => `<div class="hdr-end">${o.empty ? "" : syncBtn(o)}${extra}${ib("more", "Repository tools (F10)", o.moreOn ? "hover" : "")}${ib("sliders", "Settings (Ctrl+,)")}</div>`;
  if (dir === "b") {
    return `<header class="hdr">${id}${start}<div class="hdr-center"><div class="search" style="width:400px">${icon("search")}<span>Search or run a command</span><span class="key">Ctrl Shift P</span></div></div>${end()}</header>`;
  }
  if (dir === "c") {
    return `<header class="hdr">${id}${start}<div class="hdr-center"><div class="search" style="width:420px">${icon("search")}<span>Go to a branch, commit, file or command…</span><span class="key">Ctrl Shift P</span></div></div>${end()}</header>`;
  }
  const center = o.empty ? "" : `<div class="seg dest ${NARROW ? "compact" : ""}">${DESTS.map(([k, label, ic]) => `<button class="${k === dest ? "on" : ""}" title="${label} (Ctrl+${DESTS.findIndex((d) => d[0] === k) + 1})">${icon(ic)}<span>${label}</span></button>`).join("")}</div>`;
  return `<header class="hdr">${id}${start}<div class="hdr-center">${center}</div>${end(ib("search", "Search this page (Ctrl+F)"))}</header>`;
}
// Direction C: the destinations as a tab row under the header.
const destTabs = (dest) => `<div style="height:38px;display:flex;align-items:center;gap:2px;padding:0 12px">${DESTS.map(([k, label, ic]) => `<span class="chip ${k === dest ? "on" : ""}" style="box-shadow:none;${k === dest ? "" : "background:transparent"}">${icon(ic)}${label}</span>`).join("")}</div>`;

function sidebar(o = {}) {
  const nav = (ic, t, extra = "", c = "") => `<a class="nav ${c}" title="${t}">${icon(ic)}<span>${t}</span>${extra}</a>`;
  const destNav = o.dir === "b" ? DESTS.map(([k, label, ic]) => nav(ic, label, "", k === o.dest ? "active" : "")).join("") + `<div class="gsep" style="height:1px;background:var(--hair);margin:10px 8px 0"></div>` : "";
  const wtRows = WORKTREES.map((w) => nav("worktree", w.name, w.agent ? '<span class="dot ok" title="Claude Code is working here"></span>' : w.changed ? `<em class="ahead">${w.changed}</em>` : "", w.here && o.dir !== "b" ? "active" : "")).join("");
  const brRows = BRANCHES.map((b) => nav("branch", b.name, b.agentBlocked ? '<span class="dot warn" title="Codex is waiting for permission"></span>' : b.ahead ? `<em class="ahead">${b.behind ? `↓${b.behind} ` : ""}↑${b.ahead}</em>` : "", b.current && o.dir === "b" ? "active" : "")).join("");
  return `<aside class="side"><div class="side-scroll">
    ${destNav}
    <div class="search side-filter">${icon("filter")}<span>Filter</span><span class="key"></span></div>
    <div class="grp">Worktrees${icon("plus")}</div>${wtRows}
    <div class="gsep"></div>
    <div class="grp">Branches${icon("plus")}</div>${brRows}
    <div class="gsep"></div>
    <div class="grp">Remotes</div>${nav("remote", "origin", icon("chev-r"), "collapsed")}
    <div class="grp">Tags</div>${nav("tag", "4 tags", icon("chev-r"), "collapsed")}
    <div class="grp">Stashes${icon("plus")}</div>${nav("stash", "WIP: blame gutter widths")}
  </div></aside>`;
}

const pagebar = (left, right = "") => `<div class="pagebar">${left}<span class="sp"></span>${right}</div>`;
function win({ dest = "changes", page, dir = "a", side = true, over = "", hdr }) {
  const tabs = dir === "c" ? destTabs(dest) : "";
  return `<div class="win ${side ? "" : "no-side"}">${hdr || header(dest, { dir })}${side ? sidebar({ dir, dest }) : ""}<main class="page">${tabs}${page}</main>${over}</div>`;
}

/* ── Pages ──────────────────────────────────────────────────────────────── */
const frow = ([s, nm, dir], c = "", staged = false) => `<div class="frow ${c}">${sc(s)}<span class="nm">${nm}</span><span class="dir">${dir}</span><span class="op" title="${staged ? "Unstage (Space)" : "Stage (Space)"}">${icon(staged ? "minus" : "plus")}</span></div>`;
const dline = ([k, n, t]) => k === "h"
  ? `<div class="dl hunk"><span class="n"></span><span class="c"><span class="ht">${n}</span><span class="stage">Stage hunk</span></span></div>`
  : `<div class="dl ${k === "+" ? "add" : k === "-" ? "del" : ""}"><span class="n">${n}</span><span class="c">${k === " " ? " " : k} ${t}</span></div>`;

function composer(o = {}) {
  return `<div class="composer">
    <div class="field ${o.focus ? "focus" : ""}">${o.summary ? `<span>${o.summary}</span>` : '<span class="ter">Summary</span>'}<span class="cnt">${o.summary ? `${o.summary.length}/50` : ""}</span></div>
    <div class="field area ph">${o.body || "Description"}</div>
    <div class="crow"><span class="check"></span><span>Amend</span><span class="sp"></span><span class="link xs">Template</span><span class="link xs">Last message</span></div>
    <div class="commit-btn">${icon("check")}Commit ${o.count ?? 2} files<span class="k">Ctrl Enter</span></div>
  </div>`;
}
function changes(o = {}) {
  const banner = o.rebase ? `<div class="opbanner">${icon("alert")}<div class="grow"><div class="t">Rebase in progress · stopped at 3 of 5</div><div class="xs dim">Splitting “Flow: the work in progress on a canvas”: its changes are unstaged below. Commit them in pieces, then continue.</div></div><button class="btn">Abort</button><button class="btn">Skip</button><button class="btn primary">Continue</button></div>` : "";
  const groups = o.rebase
    ? `${lab("Conflicts", 1, "Conflict Studio")}${frow(["U", "flow.rs", "apps/git/src/core"], "")}${lab("Changes", 3, "Stage all")}${frow(["M", "flow.rs", "apps/git/src/ui"], "sel")}${frow(["M", "pages.rs", "apps/git/src/ui"])}${frow(["M", "style.css", "apps/git/src/ui"])}`
    : `${lab("Staged", 2, "Unstage all")}${FILES.staged.map((f) => frow(f, "", true)).join("")}
       ${lab("Changes", 2, "Stage all")}${frow(FILES.changes[0], "sel")}${frow(FILES.changes[1], "hover")}
       ${lab("Untracked", 1)}${frow(FILES.untracked[0])}`;
  const split = Q.get("split") === "1" || o.split;
  const diff = split
    ? `<div class="split2"><div class="diff">${DIFF.map(([k, n, t]) => k === "+" ? `<div class="dl filler"><span class="n"></span><span class="c"> </span></div>` : dline([k, n, t])).join("")}</div><div class="diff">${DIFF.map(([k, n, t]) => k === "-" ? `<div class="dl filler"><span class="n"></span><span class="c"> </span></div>` : dline([k, n, t])).join("")}</div></div>`
    : `<div class="diff">${DIFF.map(dline).join("")}</div>`;
  return `${pagebar(`${seg(["All", "Unstaged", "Staged"], "All")}${search("Filter changed files")}`, `<button class="btn ghost">${icon("undo")}Discard all…</button>`)}
  ${banner}
  <div class="body">
    <div class="files"><div class="list">${groups}</div>${composer(o.rebase ? { summary: "Flow: canvas, cards and links", count: 1 } : { summary: "Header: repository and branch switchers", focus: false })}</div>
    <div class="diffcol">
      <div class="diffbar"><div class="crumb">apps${icon("chev-r")}git${icon("chev-r")}src${icon("chev-r")}ui${icon("chev-r")}<b>${o.rebase ? "flow.rs" : "style.css"}</b></div><span class="sp"></span>
        ${seg(["Unified", "Split"], split ? "Split" : "Unified")}<button class="btn ghost sm">Stage lines</button><button class="btn ghost sm">Discard</button>${ib("more", "Blame, file history")}</div>
      ${diff}
    </div>
  </div>`;
}

// History: lanes drawn per row. lane 0 is main; 1 is ui/header-polish (rebased on f6a12d0).
function lanesSvg(row, total) {
  const x = (l) => 14 + l * 16, mid = 18, col = ["var(--accent)", "var(--sw-violet)", "var(--sw-pink)"];
  let s = "";
  const line = (l, y1, y2, c) => (s += `<path d="M${x(l)} ${y1}V${y2}" stroke="${c}" stroke-width="2" fill="none"/>`);
  if (row.top0) line(0, 0, mid, col[0]);
  if (row.bot0) line(0, mid, 36, col[0]);
  if (row.side) line(1, 0, 36, col[1]);
  if (row.sideBot) line(1, mid, 36, col[1]);
  if (row.join) s += `<path d="M${x(1)} 0C${x(1)} 10 ${x(0)} 8 ${x(0)} ${mid}" stroke="${col[1]}" stroke-width="2" fill="none"/>`;
  const l = row.lane || 0;
  s += `<circle cx="${x(l)}" cy="${mid}" r="${row.head ? 5.5 : 4.5}" fill="${col[l]}"/><circle cx="${x(l)}" cy="${mid}" r="${row.head ? 2.4 : 0}" fill="var(--bg)"/>`;
  return `<svg class="lanes" viewBox="0 0 64 36">${s}</svg>`;
}
function history(o = {}) {
  const side = [
    { h: "3b91c0e", s: "Sidebar: worktree and branch groups on nyx_ui::sidebar", a: "Claude Code", t: "4 minutes ago", refs: [["ui/header-polish", ""]], lane: 1, sideTop: false, side: false },
    { h: "8f02d17", s: "Header: sync split button with ahead and behind", a: "Claude Code", t: "11 minutes ago", lane: 1, side: true },
    { h: "c44e9a2", s: "Header: repository and branch switchers", a: "Claude Code", t: "16 minutes ago", lane: 1, side: true },
  ];
  const rows = [];
  side.forEach((r, i) => rows.push({ ...r, side: false, sideBot: i === 0, ...(i > 0 ? { side: true } : {}) }));
  COMMITS.forEach((c, i) => rows.push({ h: c[0], s: c[1], a: c[2], t: c[3], refs: [...(c[4] ? [[c[4], c[4].startsWith("origin") ? "remote" : i === 0 ? "head" : ""]] : []), ...(c[5] ? [[c[5], "tag"]] : [])], lane: 0, top0: i > 0, bot0: i < COMMITS.length - 1, join: i === 0, head: i === 0 }));
  const sel = 3;
  const list = rows.slice(0, NARROW ? 18 : 19).map((r, i) => `<div class="grow-r ${i === sel ? "sel" : i === 6 ? "hover" : ""}">${lanesSvg(r)}<span class="refs">${(r.refs || []).map(([n, c]) => `<span class="ref ${c}">${c === "tag" ? icon("tag") : c === "remote" ? icon("remote") : icon("branch")}${n}</span>`).join("")}</span><span class="subj ${r.lane === 1 ? "" : ""}">${r.s}</span><span class="hs hash">${r.h}</span><span class="au">${r.a}</span><span class="tm">${r.t}</span></div>`).join("");
  const c = rows[sel];
  const insp = `<aside class="insp">
    <div class="ttl"><span class="hash" style="color:var(--text);font-size:12.5px">f6a12d0</span>${ib("copy", "Copy hash (Ctrl+C)")}<span class="sp"></span>${pill("main", "acc")}</div>
    <div class="crow" style="margin:4px 0 10px"><span class="avatar lg">KS</span><div><div class="t500">Ken Smith</div><div class="xs dim">Today at 21:35 · parent <span class="acc mono">a36ad16</span></div></div></div>
    <div class="msg"><div class="s">${c.s}</div><div class="dim">Changes' filter and History's Find share one slot; the subtitle, status and Pull/Push counts have fixed widths, so nothing beside the switch changes width between pages.</div></div>
    ${lab("Changed files", 1)}
    <div class="frow sel">${sc("M")}<span class="nm">window.rs</span><span class="dir">apps/git/src/ui</span><span class="ter xs tnum">+30 −14</span></div>
    <div class="minidiff">${DIFF.slice(9, 15).map(dline).join("")}</div>
    <div class="btnrow"><button class="btn sm">${icon("branch")}Branch here</button><button class="btn sm">${icon("cherry")}Cherry-pick</button>${ib("more", "Revert, reset, tag, compare (Shift+F10)")}</div>
  </aside>`;
  const bar = pagebar(`<button class="dd">${icon("branch")}All branches${icon("chev-d")}</button>${search("Search commits, authors, hashes", { wide: !NARROW })}`, `${seg(["Graph", "Timeline"], o.timeline ? "Timeline" : "Graph")}<button class="btn ghost">${icon("merge")}Collapse merges</button>`);
  if (o.timeline) return `${bar}<div class="body"><div class="canvas" style="background-image:none">${timeline()}</div>${insp}</div>`;
  return `${bar}<div class="body"><div class="graph">${list}</div>${NARROW ? "" : insp}</div>`;
}
function timeline() {
  const W = 860, col = 50, y = [70, 130, 190];
  let s = `<svg class="links" viewBox="0 0 ${W} 520" preserveAspectRatio="xMinYMin meet">`;
  const lanes = [["main", 0, 15, "var(--accent)"], ["ui/header-polish", 0, 3, "var(--sw-violet)"], ["feature/review-checks", 6, 9, "var(--sw-pink)"]];
  const X = (i) => W - 40 - i * col;
  lanes.forEach(([n, a, b, c], li) => {
    s += `<path d="M${X(b)} ${y[li]}H${X(a)}" stroke="${c}" stroke-width="2.5" stroke-linecap="round"/>`;
    s += `<text x="${X(b) - 8}" y="${y[li] + 4}" text-anchor="end" font-size="11.5" font-weight="600" fill="${c}" font-family="Inter">${n}</text>`;
    for (let i = a; i <= b; i++) s += `<circle cx="${X(i)}" cy="${y[li]}" r="${i === a ? 6 : 4.5}" fill="${c}"/>`;
  });
  s += `<path d="M${X(4)} ${y[0]}C${X(3.5)} ${y[0]} ${X(3.5)} ${y[1]} ${X(3)} ${y[1]}" stroke="var(--sw-violet)" stroke-width="2.5" fill="none"/>`;
  s += `<path d="M${X(10)} ${y[0]}C${X(9.5)} ${y[0]} ${X(9.5)} ${y[2]} ${X(9)} ${y[2]}" stroke="var(--sw-pink)" stroke-width="2.5" fill="none"/>`;
  ["now", "1 h", "3 h", "21 h", "3 d", "8 d", "2 w"].forEach((t, i) => (s += `<text x="${X(i * 2.4)}" y="250" text-anchor="middle" font-size="11" fill="var(--text-tertiary)" font-family="Inter">${t}</text>`));
  s += `<path d="M20 232H${W - 20}" stroke="var(--hair)"/>`;
  s += `</svg>`;
  return s + `<div style="position:absolute;left:16px;top:290px;right:16px" class="dim xs">Newest on the right. Hover a dot for its commit; click to select it. The same commits and edges as the graph, along time.</div>`;
}

// Flow: positions in canvas pixels.
function flow() {
  const C = [
    { id: "main", x: 24, y: 214, nm: "main", ln: "trunk · ↑2 to push", ln2: "Header: the destinations stay in one place · 19m", wt: ["here", "nyx-git · 4 changed · here"], trunk: true, cur: true },
    { id: "hdr", x: 290, y: 28, nm: "ui/header-polish", ln: "↑4 ahead of main", ln2: "Sidebar: worktree and branch groups · 4m", wt: ["dirty", "nyx-git-header · 2 changed"], chips: [pill("Claude Code · working", "ok", true), pill("#48 · checks passing", "acc")], sel: true },
    { id: "rev", x: 290, y: 236, nm: "feature/review-checks", ln: "↑2 ↓1 vs main", ln2: "Review: CI checks and approvals · 2h", wt: ["", "nyx-git-review · clean"], chips: [pill("#47 · 1 check failing", "bad")] },
    { id: "pal", x: 290, y: 420, nm: "agents/codex-palette", ln: "↑3 ahead of main", ln2: "Palette: typed commands for Review · 1h", chips: [pill("Codex · waiting for permission", "warn", true)] },
    { id: "blame", x: 548, y: 382, nm: "fix/blame-non-utf8", ln: "↑1 ↓3 · on feature/review-checks", ln2: "Blame: keep lines that aren't UTF-8 · 1d", chips: [pill("#45 · draft", "")] },
  ];
  const H = { main: 136, hdr: 150, rev: 132, pal: 108, blame: 108 };
  const p = Object.fromEntries(C.map((c) => [c.id, c]));
  const R = (c) => [c.x + 220, c.y + 26], L = (c) => [c.x, c.y + 26], M = (c) => [c.x + 110, c.y + H[c.id] / 2];
  const curve = ([x1, y1], [x2, y2]) => `M${x1} ${y1}C${(x1 + x2) / 2} ${y1} ${(x1 + x2) / 2} ${y2} ${x2} ${y2}`;
  let s = '<svg class="links">';
  [["main", "hdr"], ["main", "rev"], ["main", "pal"], ["rev", "blame"]].forEach(([a, b]) => {
    const strong = b === "hdr";
    s += `<path d="${curve(R(p[a]), L(p[b]))}" stroke="${strong ? "var(--accent)" : "var(--text-tertiary)"}" stroke-opacity="${strong ? 0.9 : 0.5}" stroke-width="2" fill="none"/>`;
  });
  // A pull request: dashed, into main.
  s += `<path d="M${p.hdr.x} ${p.hdr.y + 96}C${p.hdr.x - 60} ${p.hdr.y + 96} ${p.main.x + 150} ${p.main.y - 70} ${p.main.x + 150} ${p.main.y}" stroke="var(--accent)" stroke-opacity=".75" stroke-width="2" stroke-dasharray="6 5" fill="none"/>`;
  // Derived: shared files, dotted amber.
  s += `<path d="M${p.hdr.x + 220} ${p.hdr.y + 70}C${p.hdr.x + 300} ${p.hdr.y + 70} ${p.hdr.x + 300} ${p.pal.y + 54} ${p.pal.x + 220} ${p.pal.y + 54}" stroke="var(--warning)" stroke-width="2" stroke-dasharray="1.5 5" stroke-linecap="round" fill="none"/>`;
  s += "</svg>";
  const card = (c) => `<div class="fcard ${c.trunk ? "trunk" : ""} ${c.sel ? "sel" : ""}" style="left:${c.x}px;top:${c.y}px">
    <div class="top"><div class="nm">${c.cur ? '<span class="cur"></span>' : ""}${c.nm}</div><div class="ln">${c.ln}</div><div class="ln2">${c.ln2}</div>${c.chips ? `<div class="chipz">${c.chips.join("")}</div>` : ""}</div>
    ${c.wt ? `<div class="wt ${c.wt[0]}">${icon("worktree")}${c.wt[1]}</div>` : ""}</div>`;
  const labels = `<span class="flabel acc" style="left:${p.main.x + 150}px;top:${p.main.y - 44}px">#48 → main</span><span class="flabel warn" style="left:${p.hdr.x + 296}px;top:${p.hdr.y + 150}px">2 shared files</span>`;
  const insp = `<aside class="insp">
    <div class="ttl">${icon("branch")}ui/header-polish</div><div class="sub">Builds on main · started 4 hours ago</div>
    ${lab("Git")}${kv("Ahead", "4 commits ahead of main")}${kv("Last commit", "3b91c0e · 4 minutes ago")}
    ${lab("Worktree")}${kv("Folder", "~/Projects/nyx-git-header")}${kv("Changes", '<span class="warn">2 changed files</span>')}
    ${lab("Agent")}<div class="crow" style="padding:3px 0"><span class="avatar agent">CC</span><div class="grow"><div class="t500">Claude Code</div><div class="xs dim">Working · “Polish the header and sidebar”</div></div></div>
    ${lab("Review")}${kv("Request", '<span class="acc">#48</span> · 1 approval')}${kv("Checks", '<span class="ok">4 of 4 passing</span>')}
    ${lab("Shared files")}<div class="xs dim" style="line-height:1.45">With <b class="t500" style="color:var(--text)">agents/codex-palette</b>: style.css, palette.rs. Worked out from their changes, not a Git relationship.</div>
    ${lab("Actions")}<div class="acts">${arow("worktree", "Open worktree", "primary")}${arow("agent", "Open Claude Code session")}${arow("history", "Show history")}${arow("merge", "Merge into main…", "hover")}${arow("rebase", "Rebase onto main…")}${arow("open", "Open request #48")}</div>
  </aside>`;
  const legend = Q.get("legend") === "1" ? `<div class="legend">
    <svg viewBox="0 0 34 10"><path d="M2 5h30" stroke="var(--text-tertiary)" stroke-width="2"/></svg><span>Git ancestry: started from the branch to its left</span>
    <svg viewBox="0 0 34 10"><path d="M2 5h30" stroke="var(--accent)" stroke-width="2" stroke-dasharray="6 5"/></svg><span>Pull or merge request into a branch</span>
    <svg viewBox="0 0 34 10"><path d="M2 5h30" stroke="var(--warning)" stroke-width="2" stroke-dasharray="1.5 5" stroke-linecap="round"/></svg><span>Shared files (worked out, not Git)</span>
    <svg viewBox="0 0 34 10"><path d="M2 5h30" stroke="var(--accent)" stroke-width="2.5" stroke-dasharray="3 4"/></svg><span>An action you're about to take</span></div>` : "";
  return `${pagebar(`${search("Find a branch or worktree")}${seg(["Active", "All"], "Active")}`, `<button class="btn">${icon("plus")}New${icon("chev-d")}</button>${ib("fit", "Fit (0)")}${ib("help", "What the lines mean", Q.get("legend") === "1" ? "on" : "")}`)}
    <div class="body"><div class="canvas"><div class="stage">${s}${C.map(card).join("")}${labels}</div><div class="zoomctl">${ib("zoomout", "Zoom out (−)")}${ib("zoomin", "Zoom in (+)")}</div>${legend}</div>${NARROW ? "" : insp}</div>`;
}

function review(o = {}) {
  if (o.empty) {
    return `${pagebar(seg(["Open", "All"], "Open"))}<div class="body"><div class="empty" style="flex:1">${icon("review")}<div class="t">Connect a hosting account</div><div class="d">See this repository's pull requests, checks and reviews on GitHub, GitLab, Forgejo or Gitea. Local Git works without one.</div><button class="btn primary" style="margin-top:10px">Connect an account…</button></div></div>`;
  }
  const R = [
    [48, "Header: repository and branch switchers", "ui/header-polish", [pill("4 of 4 checks", "ok", true), pill("1 approval", "acc")], "Claude Code · 16m", true],
    [47, "Review: CI checks and approvals", "feature/review-checks", [pill("1 failing", "bad", true), pill("changes requested", "warn")], "Ken Smith · 2h"],
    [46, "Activity: day headings and source chips", "ui/activity-days", [pill("running", "warn", true)], "Ken Smith · 5h"],
    [45, "Blame: keep lines that aren't UTF-8", "fix/blame-non-utf8", [pill("draft"), pill("no checks")], "Ken Smith · 1d"],
  ];
  const list = R.map(([n, t, br, chips, by, sel]) => `<div class="rrow ${sel ? "sel" : ""}"><span class="n">#${n}</span><div class="grow"><div class="t">${t}</div><div class="m">${icon("branch")}<span>${br} → main</span></div><div class="m">${chips.join("")}<span class="ter">${by}</span></div></div></div>`).join("");
  const chk = (st, n, t) => `<div class="chk"><span class="d" style="background:var(--${st})"></span><span>${n}</span><span class="tm">${t}</span></div>`;
  const detail = `<div class="detail">
    <div class="crow"><span class="ter">#48</span>${pill("Open", "ok")}<span class="xs dim">ui/header-polish → main · opened by Claude Code for Ken Smith</span></div>
    <div class="ttl">Header: repository and branch switchers</div>
    <div class="crow" style="margin:6px 0 4px"><button class="btn primary">${icon("merge")}Merge…</button><button class="btn">${icon("flow")}Show in Flow</button><button class="btn ghost">${icon("open")}Open on GitHub</button></div>
    <div class="twocol">
      <div>${lab("Checks", "4")}${chk("success", "cargo test", "2m 41s")}${chk("success", "cargo clippy", "1m 12s")}${chk("success", "rustfmt", "8s")}${chk("success", "nix build (NyxOS)", "6m 05s")}
        ${lab("Reviews")}<div class="crow" style="height:32px"><span class="avatar">KS</span><span class="t500">Ken Smith</span><span class="sp"></span>${pill("Approved", "ok")}</div></div>
      <div>${lab("Commits", "3")}${[["3b91c0e", "Sidebar: worktree and branch groups"], ["8f02d17", "Header: sync split button"], ["c44e9a2", "Header: repository and branch switchers"]].map(([h, s]) => `<div class="kv"><span class="k hash">${h}</span><span class="v">${s}</span></div>`).join("")}
        ${lab("Files", "5")}${[["M", "window.rs", "+64 −41"], ["A", "header.rs", "+212"], ["M", "sidebar.rs", "+88 −120"], ["M", "style.css", "+46 −12"], ["A", "pagebar.rs", "+57"]].map(([s, f, d]) => `<div class="frow">${sc(s)}<span class="nm">${f}</span><span class="dir"></span><span class="ter xs tnum">${d}</span></div>`).join("")}</div>
    </div></div>`;
  return `${pagebar(`${seg(["Open", "All"], "Open")}${search("Filter requests")}`, `<span class="xs ter">design-nexus/nyx-git on GitHub</span><button class="btn">${icon("plus")}New request…</button>`)}<div class="body"><div class="rlist">${list}</div>${detail}</div>`;
}

function activity() {
  const A = [
    ["Today", [
      ["commit", "Create commit", "Header: the destinations stay in one place · main", "Nyx Git", "21:35", true],
      ["up", "Push", "main → origin/main · 1 commit", "Nyx Git", "21:36"],
      ["flow", "Create worktree", "nyx-git-header for ui/header-polish", "Nyx Git", "21:12"],
      ["commit", "Commit", "Git 2.0 refinement: Flow reads its branches in parallel", "Git reflog", "20:52"],
      ["rebase", "Interactive rebase", "main · 5 commits rewritten · recovery point saved", "Nyx Git", "20:31"],
      ["down", "Fetch", "origin · 2 branches updated", "Nyx Git", "20:04"],
    ]],
    ["Yesterday", [
      ["branch", "Checkout", "moving from feature/review-checks to main", "Git reflog", "23:40"],
      ["undo", "Reset (mixed)", "main to 6370fa6 · 1 commit left main", "Nyx Git", "23:12"],
      ["commit", "Commit", "Dropdown lists check the current choice", "Git reflog", "00:31"],
    ]],
  ];
  const list = A.map(([d, rows]) => `<div class="dayhead">${d}</div>` + rows.map(([ic, t, s, src, tm, sel]) => `<div class="arow2 ${sel ? "sel" : ""}">${icon(ic)}<div class="grow"><div class="t">${t}</div><div class="s">${s}</div></div>${pill(src, src === "Nyx Git" ? "acc" : "")}<span class="tm">${tm}</span></div>`).join("")).join("");
  const insp = `<aside class="insp">
    <div class="ttl">${icon("commit")}Create commit</div><div class="sub">Today at 21:35:45 · in nyx-git</div>
    <div class="xs dim" style="line-height:1.45">Recorded by Nyx Git when it ran this, with every reference it moved.</div>
    ${lab("References")}${kv("HEAD", '<span class="mono xs">a36ad16 → f6a12d0</span>')}${kv("main", '<span class="mono xs">a36ad16 → f6a12d0</span>')}
    ${lab("Recovery")}<div class="xs dim" style="line-height:1.45;margin-bottom:6px">A branch at a commit keeps it; nothing else changes.</div>
    <div class="acts">${arow("branch", "Branch at a36ad16…")}${arow("copy", "Copy commit hash")}${arow("history", "Show in History")}</div>
  </aside>`;
  return `${pagebar(`${seg(["All", "Nyx Git", "Git reflog"], "All")}<button class="dd">All kinds${icon("chev-d")}</button>${search("Filter activity")}`)}<div class="body"><div class="col" style="flex:1;padding:0 8px 0 12px">${list}</div>${insp}</div>`;
}

function rebaseStudio() {
  const S = [
    ["pick", "f6a12d0", "Header: the destinations stay in one place"],
    ["reword", "a36ad16", "Git 2.0 refinement: Flow reads its branches in parallel"],
    ["split", "e9941f0", "Flow: the work in progress on a canvas", "drag"],
    ["pick", "e598782", "Control API 2: nyx git status, repos, branches…"],
    ["squash", "99ad956", "Review: the repository's pull and merge requests", "fold"],
    ["fixup", "12de5f3", "Rebase Studio and Conflict Studio", "fold"],
    ["drop", "0fab0f6", "Git 2.0 foundation: five destinations"],
  ];
  const cards = S.map(([a, h, s, c = ""]) => `<div class="rcard ${a === "drop" ? "drop" : ""} ${c}">${icon("grip", "grip")}<span class="hash">${h}</span><span class="subj">${s}</span><span class="act-dd ${a}">${a[0].toUpperCase() + a.slice(1)}${icon("chev-d")}</span></div>${a === "reword" ? `<div class="reword-box"><div class="field">Flow: read branches in parallel, about 0.4 s for 400</div></div>` : ""}`).join("");
  const insp = `<aside class="insp" style="--insp-w:320px">
    <div class="ttl">Proposed history</div><div class="sub">Oldest first · 5 commits from 7</div>
    ${["Header: the destinations stay in one place", "Flow: read branches in parallel, about 0.4 s for 400 · new message", "Flow: the work in progress on a canvas · stops to split", "Control API 2: nyx git status … (+2 folded in)"].map((t, i) => `<div class="kv"><span class="k" style="width:20px" >${i + 1}</span><span class="v">${t}</span></div>`).join("")}
    <div class="xs ter" style="margin-top:4px">1 commit dropped</div>
    ${lab("Published")}<div class="banner" style="background:color-mix(in srgb,var(--warning) 10%,var(--bg));box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--warning) 28%,transparent)">${icon("alert")}<div class="xs" style="line-height:1.45">6 of these are on origin/main. Rewriting them means force-pushing later; Nyx Git won't do that for you.</div></div>
    ${lab("Likely conflicts")}<div class="xs warn" style="line-height:1.45">e9941f0 now comes before e598782; both change pages.rs.</div>
    ${lab("Other references")}<div class="xs dim">v2.0.0-beta stays on the old commits.</div>
    ${lab("Recovery")}<div class="xs dim" style="line-height:1.45">A recovery point is saved at f6a12d0 first. Abort during the rebase returns main to where it was.</div>
    <span class="sp"></span><div class="crow" style="margin-top:12px"><button class="btn">Reset plan</button><span class="sp"></span><button class="btn primary">Review and start…</button></div>
  </aside>`;
  return `${pagebar(`<button class="btn ghost">${icon("chev-l")}History</button><span class="t600">Rebase main onto 5bea5e6</span><span class="xs ter">7 commits</span>`, `<span class="xs ter">Drag cards or Alt+↑ ↓ to reorder</span>`)}<div class="body"><div class="cards">${cards}</div>${insp}</div>`;
}

function conflictStudio() {
  const code = (rows) => `<div class="diff">${rows.map(([c, t]) => `<div class="dl ${c}"><span class="c">${t}</span></div>`).join("")}</div>`;
  const pane = (t, rows) => `<div class="pane">${lab(t)}${code(rows)}</div>`;
  const base = [["", "fn card_width() -> f64 {"], ["", "    260.0"], ["", "}"]], ours = [["", "fn card_width() -> f64 {"], ["ours", "    248.0"], ["", "}"]], theirs = [["", "fn card_width(zoom: f64) -> f64 {"], ["theirs", "    260.0 * zoom"], ["", "}"]];
  const result = [["", "/// A card's width on the canvas."], ["mk", "<<<<<<< main"], ["ours", "fn card_width() -> f64 {"], ["ours", "    248.0"], ["mk", "======="], ["theirs", "fn card_width(zoom: f64) -> f64 {"], ["theirs", "    260.0 * zoom"], ["mk", ">>>>>>> ui/header-polish"], ["", "}"], ["", ""], ["", "fn card_height() -> f64 {"], ["", "    112.0"], ["", "}"]];
  return `${pagebar(`<button class="btn ghost">${icon("chev-l")}Changes</button><span class="t600">Merge ui/header-polish into main</span>`, `<span class="xs ter">1 conflict left here · 1 file unresolved</span><button class="btn">Abort merge…</button>`)}
  <div class="body"><div class="files" style="width:240px">${lab("Unresolved", 1)}<div class="frow sel">${sc("U")}<span class="nm">flow.rs</span><span class="dir">apps/git/src/core</span></div>${lab("Resolved", 2)}<div class="frow">${icon("check-c", "ok")}<span class="nm">layout.rs</span><span class="dir">apps/git/src/ui</span></div><div class="frow">${icon("check-c", "ok")}<span class="nm">style.css</span><span class="dir">apps/git/src/ui</span></div></div>
  <div class="diffcol" style="gap:10px">
    <div class="three">${pane("Base", base)}${pane("Ours · main", ours)}${pane("Theirs · ui/header-polish", theirs)}</div>
    <div class="diffbar">${lab("Result")}<span class="sp"></span>${ib("chev-u", "Previous conflict (Alt+↑)")}${ib("chev-d", "Next conflict (Alt+↓)")}${seg(["Ours", "Theirs", "Both", "Base"], "")}<button class="btn">Start over</button><button class="btn primary">Mark resolved…</button></div>
    ${code(result)}
  </div></div>`;
}

/* ── Popovers and overlays ──────────────────────────────────────────────── */
function repoPopover() {
  const row = (ic, t, s, r = "", c = "") => `<div class="prow ${c}">${icon(ic)}<span>${t}</span><span class="s">${s}</span><span class="r">${r}</span></div>`;
  return `<div class="popover" style="left:68px;top:44px;width:380px"><span class="caret" style="left:40px"></span>${search("Find a repository", { key: "", focus: true })}
    ${lab("Open")}${row("folder", "nyx-git", "~/Projects/nyx-git", '<span class="xs">main · 4 changed</span>', "sel")}${row("folder", "nyx-glimpse", "~/Projects/nyx-glimpse", '<span class="xs">main</span>')}
    ${lab("Favorites")}${row("star", "nyxos", "~/Projects/nyxos", '<span class="xs">main</span>')}${row("star", "nyx-packages", "~/Projects/nyx-packages", '<span class="xs">main</span>')}
    ${lab("Recent")}${row("clock", "nyx-design", "~/Projects/nyx-design", '<span class="xs">main · ↑1</span>', "hover")}${row("clock", "nyx-agents", "~/Projects/nyx-agents", '<span class="xs">main</span>')}
    <div class="sepl"></div><div class="foot"><button class="btn sm">${icon("folder")}Open…</button><button class="btn sm">${icon("download")}Clone…</button><button class="btn sm">${icon("plus")}New…</button><span class="sp"></span><span class="xs ter" style="align-self:center">Ctrl K</span></div></div>`;
}
function branchPopover() {
  const row = (t, r, c = "", ic = "branch") => `<div class="prow ${c}">${icon(ic)}<span>${t}</span><span class="r">${r}</span></div>`;
  return `<div class="popover" style="left:186px;top:44px;width:360px"><span class="caret" style="left:40px"></span>${search("Switch to a branch", { key: "", focus: true })}
    ${lab("Local")}${row("main", `<span class="xs">↑2</span>${icon("check", "acc")}`, "sel")}${row("ui/header-polish", '<span class="xs">in nyx-git-header</span>', "hover")}${row("feature/review-checks", '<span class="xs">in nyx-git-review</span>')}${row("agents/codex-palette", '<span class="xs">↑3</span>')}${row("fix/blame-non-utf8", '<span class="xs">↓3 ↑1</span>')}
    ${lab("Remote")}${row("origin/main", "", "", "remote")}${row("origin/ui/header-polish", "", "", "remote")}
    <div class="sepl"></div><div class="prow">${icon("plus")}<span>New branch from main…</span><span class="r xs">Ctrl Shift N</span></div>
    <div class="xs ter" style="padding:4px 10px 2px">Branches checked out in another worktree open there instead.</div></div>`;
}
function syncPopover() {
  const row = (ic, t, s = "", c = "", k = "") => `<div class="prow ${c}">${icon(ic)}<span>${t}</span><span class="s">${s}</span><span class="r xs">${k}</span></div>`;
  return `<div class="popover" style="right:118px;top:44px;width:300px"><span class="caret" style="right:60px"></span>
    <div class="xs dim" style="padding:6px 10px 4px">main tracks origin/main · fetched 2 minutes ago</div>
    ${row("up", "Push 2 commits", "", "sel", "Ctrl Alt P")}${row("down", "Pull", "already up to date", "dis", "Ctrl Shift L")}${row("sync", "Fetch", "", "", "Ctrl Shift F")}
    <div class="sepl"></div>${row("sync", "Fetch all open repositories")}${row("remote", "Remotes…")}</div>`;
}
function settingsCard() {
  const g = (ic, t, s, on) => `<a class="nav ${on ? "active" : ""}" style="height:44px">${icon(ic)}<div class="grow"><div style="font-weight:${on ? 500 : 400}">${t}</div><div class="xs dim">${s}</div></div></a>`;
  const opt = (t, d, ctl) => `<div class="opt"><div class="opt-text"><div class="t500">${t}</div><div class="d">${d}</div></div>${ctl}</div>`;
  return `<div class="veil"></div><div class="scard"><div class="groups">${search("Search settings", { key: "" })}<div style="height:8px"></div>
    ${g("folder", "Repositories", "Clone folder, fetching", true)}${g("history", "History", "Graph, timeline")}${g("changes", "Changes", "Diffs, commit messages")}${g("users", "Accounts", "GitHub, GitLab, Forgejo")}${g("palette", "Appearance", "Theme, accent, motion")}${g("keyboard", "Keyboard", "Every shortcut")}${g("info", "About", "Version, licence")}</div>
    <div class="gsec"><h3>Repositories</h3><div class="card">
      ${opt("Clone into", "Where new clones go.", `<span class="dd">~/Projects${icon("chev-d")}</span>`)}
      ${opt("Fetch in the background", "Fetch open repositories every so often. Nothing else changes.", `<span class="dd">Every 15 minutes${icon("chev-d")}</span>`)}
      ${opt("Open on", "What Git shows when it starts.", seg(["Flow", "Last page"], "Last page"))}
      ${opt("Watch for changes", "Read the repository again when files change outside Git.", '<span class="switch on"></span>')}
    </div><div class="gtitle">Agents</div><div class="card">
      ${opt("Show Nyx Agents sessions", "On Flow and in the sidebar, from what Nyx Agents shares. Nothing is sent.", '<span class="switch on"></span>')}
    </div></div></div>`;
}

/* ── Screens ────────────────────────────────────────────────────────────── */
const PAGES = {
  flow: () => win({ dest: "flow", page: flow() }),
  changes: () => win({ dest: "changes", page: changes() }),
  "changes-split": () => win({ dest: "changes", page: changes({ split: true }) }),
  "changes-rebase": () => win({ dest: "changes", page: changes({ rebase: true }), hdr: header("changes", { branch: "main", state: "rebasing 3/5" }) }),
  history: () => win({ dest: "history", page: history() }),
  timeline: () => win({ dest: "history", page: history({ timeline: true }) }),
  review: () => win({ dest: "review", page: review() }),
  "review-empty": () => win({ dest: "review", page: review({ empty: true }) }),
  activity: () => win({ dest: "activity", page: activity() }),
  rebase: () => win({ dest: "history", page: rebaseStudio() }),
  conflicts: () => win({ dest: "changes", page: conflictStudio(), hdr: header("changes", { state: "merging" }) }),
  "repo-switcher": () => win({ dest: "changes", page: changes(), hdr: header("changes", { repoOpen: true }), over: repoPopover() }),
  "branch-switcher": () => win({ dest: "changes", page: changes(), hdr: header("changes", { brOpen: true }), over: branchPopover() }),
  "sync-menu": () => win({ dest: "changes", page: changes(), hdr: header("changes", { open: true }), over: syncPopover() }),
  "empty-repo": () => win({ dest: "history", hdr: header("history", { branch: "main", repo: "new-project" }), page: `${pagebar(search("Search commits, authors, hashes"))}<div class="body"><div class="empty" style="flex:1">${icon("commit")}<div class="t">No commits yet</div><div class="d">new-project has 3 untracked files. Stage them in Changes and make the first commit.</div><button class="btn primary" style="margin-top:10px">Go to Changes</button></div></div>` }),
  none: () => `<div class="win no-side">${header("", { empty: true }).replace(ib("search", "Search this page (Ctrl+F)"), "")}<main class="page"><div class="empty" style="flex:1">${icon("git")}<div class="t">Open a repository</div><div class="d">Open a folder with a Git repository, clone one, or start a new one.</div>
    <div class="crow" style="margin-top:12px"><button class="btn primary">${icon("folder")}Open…</button><button class="btn">${icon("download")}Clone…</button><button class="btn">${icon("plus")}New repository…</button></div>
    <div style="width:460px;margin-top:26px;text-align:left">${lab("Recent")}${["nyx-git", "nyx-glimpse", "nyxos", "nyx-packages"].map((r, i) => `<div class="prow ${i === 0 ? "hover" : ""}">${icon("folder")}<span>${r}</span><span class="s">~/Projects/${r}</span><span class="r xs">${["19 minutes ago", "2 hours ago", "today", "today"][i]}</span></div>`).join("")}</div></div></main></div>`,
  settings: () => win({ dest: "changes", page: changes(), over: settingsCard() }),
};

function mount(html) {
  document.body.innerHTML = html;
  if (NARROW) document.body.classList.add("narrow");
}
document.addEventListener("DOMContentLoaded", () => {
  const svg = (n) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${GI[n]}</svg>`;
  document.querySelectorAll("i[data-i]").forEach((el) => { if (GI[el.dataset.i]) el.innerHTML = svg(el.dataset.i); });
  document.querySelector(".mock-switch")?.remove();
  if (SHOT) return;
  const screens = (ROOT.dataset.screens || "").split(",").filter(Boolean);
  const link = (k, v, label) => {
    const p = new URLSearchParams(location.search);
    p.set(k, v);
    const on = (Q.get(k) || { theme: "dark", screen: screens[0], w: "1280" }[k]) === v;
    return `<a class="${on ? "on" : ""}" href="?${p}">${label}</a>`;
  };
  const nav = document.createElement("nav");
  nav.className = "mock-switch";
  nav.innerHTML = screens.map((s) => link("screen", s, s)).join("") + "<span></span>" + link("theme", "dark", "Dark") + link("theme", "light", "Light") + "<span></span>" + link("w", "1280", "1280") + link("w", "800", "800") + '<span></span><a href="index.html">Gallery</a>';
  document.body.append(nav);
});
