// Nyx Agents mockups: sample sessions, the window's parts and every screen. Loaded after
// ../polish/mock.js, which reads the theme and screen from the URL and draws its icons.
"use strict";
const Q = new URLSearchParams(location.search);
const ROOT = document.documentElement;
const SCREEN = ROOT.dataset.screen;
const SHOT = Q.get("shot") === "1";

/* ── Icons mock.js doesn't have ─────────────────────────────────────────── */
const AI = {
  agents: '<rect x="3" y="4.5" width="18" height="15" rx="3"/><path d="m7 9.5 3 2.5-3 2.5M12.5 15H17"/>',
  terminal: '<rect x="3" y="4.5" width="18" height="15" rx="2.5"/><path d="m7 9.5 3 2.5-3 2.5M12.5 15H17"/>',
  branch: '<circle cx="6.5" cy="5.5" r="2.2"/><circle cx="6.5" cy="18.5" r="2.2"/><circle cx="17.5" cy="7" r="2.2"/><path d="M6.5 7.7v8.6M17.5 9.2c0 4.3-4 5-9.5 7.6"/>',
  alert: '<path d="M12 3.5 2.5 20h19z"/><path d="M12 10v4.5M12 17.5h.01" stroke-width="1.9"/>',
  stop: '<rect x="6" y="6" width="12" height="12" rx="2.5" fill="currentColor" stroke="none"/>',
  "split-r": '<rect x="3" y="4.5" width="18" height="15" rx="2.5"/><path d="M12 4.5v15"/>',
  "split-d": '<rect x="3" y="4.5" width="18" height="15" rx="2.5"/><path d="M3 12h18"/>',
  copy: '<rect x="8" y="8" width="12.5" height="12.5" rx="2.5"/><path d="M16 8V6a2.5 2.5 0 0 0-2.5-2.5h-7A2.5 2.5 0 0 0 4 6v7a2.5 2.5 0 0 0 2.5 2.5H8"/>',
  history: '<path d="M3.5 12a8.5 8.5 0 1 0 2.5-6"/><path d="M3.5 4v4.5H8M12 7.5V12l3 2"/>',
  subs: '<circle cx="6" cy="6" r="2.2"/><circle cx="6" cy="18" r="2.2"/><circle cx="18" cy="12" r="2.2"/><path d="M8.2 6H12a2 2 0 0 1 2 2v2.5a1.5 1.5 0 0 0 1.5 1.5h.3M8.2 18H12a2 2 0 0 0 2-2v-2.5"/>',
  resume: '<path d="M20.5 12a8.5 8.5 0 1 1-2.6-6.1L20.5 8.5"/><path d="M20.5 3.5v5h-5"/>',
  spin: '<path d="M12 3.5a8.5 8.5 0 1 1-8.5 8.5" />',
  git: '<circle cx="6" cy="5.5" r="2.2"/><circle cx="6" cy="18.5" r="2.2"/><circle cx="18" cy="8" r="2.2"/><path d="M6 7.7v8.6M18 10.2c0 4-6 3.5-11 7"/>',
  rename: '<path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16z"/><path d="m13.5 6.5 4 4"/>',
  window2: '<rect x="3" y="4" width="18" height="16" rx="2.5"/><path d="M3 8.5h18"/>',
  peek: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',
  close: '<path d="M17.5 6.5l-11 11M6.5 6.5l11 11"/>',
  hide: '<path d="M5 12h14"/>',
};
const icon = (n, c = "") => `<i data-i="${n}"${c ? ` class="${c}"` : ""}></i>`;
const ib = (n, tip = "", c = "") => `<button class="ib ${c}"${tip ? ` title="${tip}"` : ""}>${icon(n)}</button>`;
const btn = (label, c = "", ic = "") => `<button class="btn ${c}">${ic ? icon(ic) : ""}<span>${label}</span></button>`;
const search = (ph, key = "Ctrl Shift F") => `<div class="search">${icon("search")}<span>${ph}</span><span class="key">${key}</span></div>`;
const logo = (h) => `<span class="lg ${h}">${{ claude: "C", codex: "X", agy: "A", muse: "M", grok: "G", cursor: "▲", omp: "π", shell: "›_" }[h]}</span>`;

/* ── Sample sessions ─────────────────────────────────────────────────────── */
const AGENTS = { claude: "Claude Code", codex: "Codex", agy: "Antigravity", muse: "Muse", grok: "Grok Build", cursor: "Cursor", omp: "oh-my-pi", shell: "Terminal" };
const S = {
  fix: { title: "Fix nested quotes", h: "codex", state: "blocked", branch: "codex/fix-quotes", wt: true, cwd: "~/Projects/nyx-glimpse", msg: "Wants to run cargo test -p parser", t: "now" },
  ux: { title: "Agents UX revamp", h: "claude", state: "working", branch: "main", cwd: "~/Projects/nyx-agents", subs: 3, t: "2m" },
  term: { title: "Terminal", h: "shell", state: "running", branch: "main", cwd: "~/Projects/nyx-agents", t: "8m" },
  web: { title: "Check the docs site", h: "claude", state: "working", branch: "main", cwd: "~/Projects/nyx-site", desk: true, t: "1m" },
  usage: { title: "Usage cards", h: "claude", state: "done", branch: "ui/usage-cards", wt: true, cwd: "~/Projects/nyx-agents", t: "1h" },
  agy: { title: "Antigravity · ken", h: "agy", state: "failed", cwd: "~", t: "27m" },
  muse: { title: "Docs pass", h: "muse", state: "ended", branch: "main", cwd: "~/Projects/nyx-design", t: "3h" },
};
const STATE = {
  blocked: ["Needs you", "blocked", "alert"],
  working: ["Working", "working", "spin"],
  running: ["Running", "", "terminal"],
  done: ["Done", "done", "check"],
  failed: ["Didn't start", "failed", "x"],
  ended: ["Ended", "", "stop"],
  stopping: ["Stopping…", "", "spin"],
  lost: ["Not running", "", "x"],
};
const mark = (s) => {
  const [, c, ic] = STATE[s.state];
  if (s.state === "working") return `<span class="mk working"><span class="dotm"></span></span>`;
  if (s.state === "running") return `<span class="mk"><span class="dotm ring"></span></span>`;
  return `<span class="mk ${c}">${icon(ic)}</span>`;
};
const sub = (s) => {
  const bits = [AGENTS[s.h]];
  if (s.state === "blocked") bits.push("needs you");
  else if (s.state === "working") bits.push(s.subs ? `working · ${s.subs} subagents` : "working");
  else if (s.state === "failed") bits.push("didn't start");
  else if (s.state === "done") bits.push("finished");
  else if (s.state === "ended") bits.push("ended");
  if (s.branch && s.state !== "failed") bits.push(s.branch);
  return bits.join(" · ");
};

/* ── Window parts ───────────────────────────────────────────────────────── */
function header(o = {}) {
  return `<header class="hdr">
    <div class="hdr-id">${icon("agents", "app-ic")}<span class="app-name">Agents</span></div>
    <div class="hdr-start">${ib("sidebar", "Sidebar (Ctrl+B)")}</div>
    <div class="hdr-center">${search("Search sessions")}</div>
    <div class="hdr-end"><button class="newbtn ${o.newOpen ? "open" : ""}">${icon("plus")}<span>New</span><span class="key">Ctrl T</span></button><span class="gap"></span>${ib("sliders", "Settings")}</div>
  </header>`;
}

function sidebar(active, o = {}) {
  const row = (k) => {
    const s = S[k];
    return `<div class="srow ${k === active ? "active" : ""}">${mark(s)}<div class="tx"><div class="t">${s.title}</div><div class="s">${sub(s)}</div></div><span class="tm">${s.t}</span></div>`;
  };
  const g = (t, keys, first) => keys.length ? `<div class="grp ${first ? "first" : ""}">${t}</div>${keys.map(row).join("")}` : "";
  const needs = o.needs ?? ["fix"];
  const act = o.active ?? ["ux", "web", "term"];
  const rec = o.recent ?? ["usage", "agy", "muse"];
  return `<aside class="side"><div class="side-scroll">
    ${g("Needs you", needs, true)}
    ${g("Active", act, !needs.length)}
    ${g("Recent", rec, !needs.length && !act.length)}
    <div class="hr"></div>
    <div class="navx ${active === "history" ? "active" : ""}">${icon("history")}<span>History</span><span class="cnt">214</span></div>
  </div></aside>`;
}

function tabs(open, on) {
  return `<div class="tabs">${open.map((k) => {
    const s = S[k];
    const [, , ic] = STATE[s.state];
    return `<div class="tab ${k === on ? "on" : ""}">${icon(s.h === "shell" ? "terminal" : ic === "spin" ? "agents" : ic)}<span class="tt">${s.title}</span>${s.state === "blocked" ? '<span class="bd"></span>' : ""}<span class="x">${icon("close")}</span></div>`;
  }).join("")}<span class="plus">${icon("plus")}</span></div>`;
}

function sbar(s, o = {}) {
  const st = o.state || s.state;
  const [label, cls] = STATE[st];
  const live = ["blocked", "working", "running", "stopping"].includes(st);
  const meta = [`<span>${AGENTS[s.h]}</span>`];
  if (s.branch) meta.push(`${icon("branch")}<span>${s.branch}${s.wt ? " (worktree)" : ""}</span>`);
  meta.push(`${icon("folder")}<span>${s.cwd}</span>`);
  if (s.msg && st === "blocked") meta.push(`<span class="msg">${s.msg}</span>`);
  const sep = '<span class="sep">·</span>';
  let act = "";
  if (st === "stopping") act = btn("Force stop", "stop", "stop");
  else if (live) act = btn(s.h === "shell" ? "Close" : "Stop", "stop", "stop");
  else if (st === "failed") act = btn("Try again", "", "resume") + btn("Discard", "", "trash");
  else act = btn("Resume", "primary", "resume") + btn("Discard", "", "trash");
  return `<div class="sbar">
    <span class="title ${o.titleHover ? "hover" : ""}">${s.title}${icon("rename", "ed")}</span>
    <span class="pill ${cls}">${st === "working" || st === "blocked" ? '<span class="d"></span>' : ""}${label}</span>
    <span class="meta">${meta.join(sep)}</span>
    <span class="act">${act}${ib("more", "More (session menu)", o.moreOpen ? "open" : "")}</span>
  </div>`;
}

function win(active, page, o = {}) {
  return `<div class="win">${header(o)}${sidebar(active, o)}<main class="page">${page}</main>${o.over || ""}</div>`;
}

/* ── Terminal screens ───────────────────────────────────────────────────── */
const T = {
  claude: `<span class="acc">✻</span> <span class="b">Claude Code</span>  <span class="dim">~/Projects/nyx-agents · main</span>

<span class="dim">&gt;</span> Make stuck sessions removable and simplify the session bar

<span class="acc">●</span> I'll start with how the manager starts holders.

<span class="ok">●</span> <span class="b">Read</span>(apps/nyx-agentd/src/server.rs)
  <span class="dim">⎿  Read 899 lines</span>

<span class="ok">●</span> <span class="b">Task</span>(Map the UI's session actions)
  <span class="dim">⎿  3 subagents running</span>

<span class="ok">●</span> <span class="b">Update</span>(apps/nyx-agentd/src/server.rs)
  <span class="dim">⎿  Updated with</span> <span class="ok">42 additions</span> <span class="dim">and</span> <span class="bad">9 removals</span>

<span class="acc">✻ Running the smoke test…</span> <span class="dim">(14s · esc to interrupt)</span>

<span class="dim">────────────────────────────────────────────────────────────────────────</span>
&gt; <span class="cur"></span>
<span class="dim">────────────────────────────────────────────────────────────────────────</span>
<span class="dim">  ? for shortcuts</span>`,
  codex: `<span class="b">›_ OpenAI Codex</span>  <span class="dim">~/Projects/nyx-glimpse · codex/fix-quotes</span>

<span class="dim">›</span> Fix the parser's handling of nested quotes

<span class="dim">•</span> Ran <span class="acc">rg -n "quote" crates/parser/src</span>
  <span class="dim">└ 14 matches in 3 files</span>
<span class="dim">•</span> Edited crates/parser/src/lex.rs <span class="ok">(+18</span> <span class="bad">-4)</span>

<span class="warn b">  Allow command?</span>

    <span class="dim">$</span> cargo test -p parser

  <span class="sel"> › 1. Yes </span>   2. Yes, and don't ask again for cargo test   3. No, tell Codex what to do

<span class="dim">  Press enter to confirm or esc to cancel</span>`,
  shell: `<span class="ok">ken@hades</span> <span class="acc">~/Projects/nyx-agents</span> <span class="dim">main</span>
<span class="dim">$</span> cargo test -p nyx-agentd
<span class="dim">   Compiling nyx-agentd v0.4.0</span>
<span class="dim">    Finished</span> test [unoptimized + debuginfo] target(s) in 6.21s
<span class="dim">     Running</span> unittests src/main.rs
running 12 tests
test server::tests::stop_ends_a_lost_session ... <span class="ok">ok</span>
test server::tests::forget_when_nothing_runs ... <span class="ok">ok</span>
test holder::tests::removes_only_its_socket ... <span class="ok">ok</span>

test result: <span class="ok">ok</span>. 12 passed; 0 failed

<span class="ok">ken@hades</span> <span class="acc">~/Projects/nyx-agents</span> <span class="dim">main</span>
<span class="dim">$</span> <span class="cur"></span>`,
  web: `<span class="acc">✻</span> <span class="b">Claude Code</span>  <span class="dim">~/Projects/nyx-site · main · desktop</span>

<span class="dim">&gt;</span> Open the docs site and check every link on the install page

<span class="ok">●</span> <span class="b">nyx-computer</span> - open_app (argv: ["firefox", "localhost:4000/install"])
  <span class="dim">⎿  Opened Firefox</span>

<span class="ok">●</span> <span class="b">nyx-computer</span> - screenshot
  <span class="dim">⎿  1280×800</span>

<span class="acc">●</span> The install page loaded. Checking its 23 links one by one.

<span class="ok">●</span> <span class="b">nyx-computer</span> - click (x: 742, y: 418)

<span class="acc">✻ Following “Package sources”…</span> <span class="dim">(41s · esc to interrupt)</span>`,
  usage: `<span class="acc">✻</span> <span class="b">Claude Code</span>  <span class="dim">~/Projects/nyx-agents · ui/usage-cards</span>

<span class="dim">&gt;</span> Draw one usage card per agent

<span class="ok">●</span> <span class="b">Update</span>(apps/ai-hub-plugin/src/views.rs)
  <span class="dim">⎿  Updated with</span> <span class="ok">88 additions</span> <span class="dim">and</span> <span class="bad">31 removals</span>

<span class="ok">●</span> All 31 plugin tests pass. The cards are on the Usage tab, one per
  agent, with the quota bars below the totals.

<span class="dim">&gt; /exit</span>`,
};

/* ── Pages ──────────────────────────────────────────────────────────────── */
const PAGES = {};

// Nothing open: start something here, in the last folder.
PAGES.empty = () => win(null, `<div class="start">
  <div class="hd"><b>Start a session</b><span>Pick an agent. It starts in the folder below and opens here.</span></div>
  <div class="where"><span class="t-sec">In</span><span class="dd">${icon("folder")}<span>~/Projects/nyx-agents</span>${icon("chev-d")}</span></div>
  <div class="tiles">
    ${[["claude", "last used"], ["codex", "0.167.0"], ["muse", "1.4.14"], ["agy", "1.5.3"], ["grok", "1.0.77"], ["cursor", "2026.11.05"], ["omp", "18.18.6"], ["shell", "your shell"]].map(([h, v], i) =>
      `<div class="tl ${i === 0 ? "hover" : ""}">${logo(h)}<div><b>${AGENTS[h]}</b><br><span>${v}</span></div></div>`).join("")}
  </div>
  <div class="keys"><kbd>Ctrl T</kbd> New session with options · <kbd>Ctrl Shift F</kbd> Find a session</div>
</div>`, { needs: [], active: [], recent: ["usage", "muse"] });

// New: an agent, a folder (recent ones one click away), two options, Start.
PAGES.new = () => win("ux", tabs(["ux", "term"], "ux") + sbar(S.ux) + `<div class="term">${T.claude}</div>`, {
  newOpen: true,
  over: `<div class="newpop pop">
    <div class="lbl">Agent</div>
    <div class="agents">
      ${["claude", "codex", "muse", "agy", "grok", "cursor", "omp", "shell"].map((h, i) =>
        `<div class="ag ${i === 1 ? "on" : ""}">${logo(h)}<b>${AGENTS[h]}</b>${i === 0 ? "<span>last</span>" : ""}</div>`).join("")}
    </div>
    <div class="lbl">Folder</div>
    <div class="fold">${icon("folder")}<span class="grow">~/Projects/nyx-glimpse</span>${icon("chev-r")}</div>
    <div class="recent">${["nyx-agents", "nyx-glimpse", "nyx-design", "nyx-site"].map((f, i) => `<span class="chip ${i === 1 ? "on" : ""}">${f}</span>`).join("")}</div>
    <div class="lbl">Options</div>
    <div class="opt2"><div class="tx"><div>Own worktree</div><div class="d">A new branch in its own folder, so agents work in parallel</div></div><span class="switch on"></span></div>
    <div class="opt2"><div class="tx"><div>Own desktop</div><div class="d">A separate screen it can drive; watch it beside the terminal</div></div><span class="switch"></span></div>
    <div class="foot"><span class="k">Enter starts · remembered next time</span>${btn("Cancel", "ghost")}${btn("Start Codex", "primary")}</div>
  </div>`,
});

// A working agent: title, state, where; Stop and More. Nothing else competes.
PAGES.active = () => win("ux", tabs(["ux", "fix", "term"], "ux") + sbar(S.ux, { titleHover: true }) + `<div class="body"><div class="term">${T.claude}</div>
  <div class="subs"><div class="sh">${icon("subs")}<b>3 subagents</b><span>running</span><span class="chips"><span class="c"><span class="dotm" style="color:var(--accent)"></span>Explore UI actions</span><span class="c"><span class="dotm" style="color:var(--accent)"></span>Read hub views</span><span class="c"><span class="dotm" style="color:var(--success)"></span>Check docs</span></span><span class="grow"></span>${icon("chev-u")}</div></div></div>`);

// Needs you: first in the sidebar, the tab dotted, what it asks in the bar.
PAGES.needs = () => win("fix", tabs(["ux", "fix", "term"], "fix") + sbar(S.fix) + `<div class="term">${T.codex}</div>`);

// More: everything else about the session, in one menu.
PAGES.more = () => win("ux", tabs(["ux", "fix", "term"], "ux") + sbar(S.ux, { moreOpen: true }) + `<div class="term">${T.claude}</div>`, {
  over: `<div class="menu pop" style="top:128px; right:18px">
    <div class="mi">${icon("search")}<span>Find</span><span class="k">Ctrl F</span></div>
    <div class="mi hover">${icon("split-r")}<span>Terminal beside</span><span class="k">Ctrl Shift O</span></div>
    <div class="mi">${icon("split-d")}<span>Terminal below</span><span class="k">Ctrl Shift E</span></div>
    <div class="mi check">${icon("subs")}<span>Subagents</span>${icon("check", "c")}</div>
    <div class="ms"></div>
    <div class="mi">${icon("git")}<span>Open in Nyx Git</span></div>
    <div class="mi">${icon("folder")}<span>Copy folder path</span></div>
    <div class="mi">${icon("rename")}<span>Rename…</span><span class="k">F2</span></div>
    <div class="ms"></div>
    <div class="mi">${icon("stop")}<span>Force stop</span></div>
    <div class="mi danger">${icon("trash")}<span>Discard…</span></div>
  </div>`,
});

// Stop was asked; the agent hasn't ended yet. A second press forces it.
PAGES.stopping = () => win("ux", tabs(["ux", "fix", "term"], "ux") + sbar(S.ux, { state: "stopping" }) + `<div class="term">${T.claude}</div>`, {
  over: `<div class="toast2">${icon("alert")}<span>Claude Code is still running. Press Force stop to end it now.</span></div>`,
});

// A start that failed: said plainly, with the way out on the same line.
PAGES.failed = () => win("agy", tabs(["ux", "agy"], "agy") + sbar(S.agy) + `<div class="body">
  <div class="endbar failed">${icon("alert")}<div class="tx"><b>Antigravity didn't start</b><span>The program exited before it opened a terminal. Its log is in ~/.local/state/nyx-agents/sessions/21aa3004/holder.log.</span></div>${btn("Open log", "ghost")}</div>
  <div class="start" style="opacity:.8"><div class="hd"><span>Nothing ran, so there is no screen to show.</span></div></div>
</div>`, { needs: ["fix"], active: ["ux", "web", "term"], recent: ["agy", "usage", "muse"] });

// Ended: why, then the last screen. Resume and Discard sit in the bar.
PAGES.ended = () => win("usage", tabs(["ux", "usage"], "usage") + sbar(S.usage) + `<div class="body">
  <div class="endbar done">${icon("check-c")}<div class="tx"><b>Claude Code finished</b><span>It exited normally 1 hour ago. Below is its last screen; Resume picks up the conversation.</span></div></div>
  <div class="term history">${T.usage}</div>
</div>`);

// Discard: one confirm, the worktree included when it has one.
PAGES.discard = () => win("usage", tabs(["ux", "usage"], "usage") + sbar(S.usage) + `<div class="body"><div class="term history">${T.usage}</div></div>`, {
  over: `<div class="veil"><div class="dlg pop">
    <div class="h">Discard “Usage cards”?</div>
    <p>Removes the session from Agents with its saved screen. The conversation stays in Claude Code's own history.</p>
    <div class="ck"><span class="box">${icon("check")}</span><div><div>Also remove its worktree</div><div class="d">~/.local/share/nyx-agents/worktrees/ui-usage-cards · no uncommitted changes · the branch is kept</div></div></div>
    <div class="bt">${btn("Cancel", "ghost")}${btn("Discard", "danger")}</div>
  </div></div>`,
});

// A terminal beside the agent: part of its tab, closed with its ×.
PAGES.split = () => win("ux", tabs(["ux", "fix"], "ux") + sbar(S.ux) + `<div class="split">
  <div class="pane"><div class="term">${T.claude}</div></div>
  <div class="pane"><div class="phdr">${icon("terminal")}<span class="grow">Terminal</span><span>~/Projects/nyx-agents</span>${ib("close", "Close the terminal")}</div><div class="term">${T.shell}</div></div>
</div>`, { active: ["ux", "web"] });

// The agent's own desktop, beside its terminal; Take over drives it.
PAGES.desktop = () => win("web", tabs(["ux", "web"], "web") + sbar(S.web) + `<div class="split">
  <div class="pane"><div class="term">${T.web}</div></div>
  <div class="dpane">
    <div class="phdr">${icon("monitor")}<span class="grow">Desktop</span><span class="t-cap">Firefox</span><span class="tk">${icon("mouse")}Take over</span>${ib("external", "Open in a window")}${ib("close", "Hide the desktop")}</div>
    <div class="screen"><div class="app"><div class="tb"><span class="dt"></span><span class="dt"></span><span class="dt"></span><span class="url">localhost:4000/install</span></div><div class="pg"><b>Install NyxOS</b><div class="bar" style="width:80%"></div><div class="bar" style="width:62%"></div><div class="bar" style="width:70%"></div><div style="color:#136dcd">Package sources ›</div><div class="bar" style="width:54%"></div><div class="bar" style="width:66%"></div></div></div>
    <span class="ptr"><svg viewBox="0 0 14 18"><path d="M1 1v14l4-4 3 6 2-1-3-6h5z" fill="#fff" stroke="#000" stroke-width="1"/></svg></span></div>
    <div class="note">The agent is driving. Take over sends your pointer and keys in; it can still act too.</div>
  </div>
</div>`, { needs: [], active: ["web", "ux", "term"] });

// Subagents open: a row of chips and the chosen one's transcript, read-only.
PAGES.subagents = () => win("ux", tabs(["ux", "fix", "term"], "ux") + sbar(S.ux) + `<div class="body"><div class="term">${T.claude}</div>
  <div class="subs"><div class="sh">${icon("subs")}<b>3 subagents</b><span class="chips"><span class="c on"><span class="dotm" style="color:var(--accent)"></span>Explore UI actions</span><span class="c"><span class="dotm" style="color:var(--accent)"></span>Read hub views</span><span class="c"><span class="dotm" style="color:var(--success)"></span>Check docs</span></span><span class="grow"></span><span class="t-cap">read-only transcript</span>${icon("chev-d")}</div>
  <div class="tr"><span class="dim">Explore UI actions · 41 steps · 2m</span>

<span class="acc">●</span> Grep("Stop|Forget|Starting", apps/nyx-agents/src/ui)
  <span class="dim">⎿ 46 matches</span>
<span class="acc">●</span> Read(apps/nyx-agents/src/ui/window.rs)
<span class="acc">●</span> Read(apps/nyx-agents/src/ui/page.rs)
<span class="ok">●</span> The tab bar has six icon buttons; Stop shows for Starting sessions,
  Forget only for ended ones…</div></div></div>`);

// History: every agent's past sessions, in the app. Resume opens them here.
PAGES.history = () => win("history", `<div class="hist">
  <div class="pbar"><span class="t-head">History</span>${["All", "Claude Code", "Codex", "Muse", "Cursor", "Grok"].map((c, i) => `<span class="chip ${i === 0 ? "on" : ""}">${c}</span>`).join("")}${search("Search titles and folders", "Ctrl F")}</div>
  <div class="list">
    <div class="day">Today</div>
    <div class="hr2 open">${logo("claude")}<div class="tx"><b>Make the stuck sessions removable</b><span>~/Projects/nyx-agents · 38 prompts · claude-opus-5-5</span></div><span class="tag">in Agents</span><span class="tm">14:06</span></div>
    <div class="exp"><div class="kvs"><span class="k">Folder</span><span class="v">~/Projects/nyx-agents</span><span class="k">Session ID</span><span class="v mono">70b47866-1d0f-4c2b-9a51-e1a0f2c3d4b5</span><span class="k">Steps</span><span class="v">212 steps · 1.1 M tokens</span></div>
      <div class="bt">${btn("Resume here", "primary", "resume")}${btn("Peek", "", "peek")}${btn("In a terminal", "", "terminal")}${btn("Folder", "", "folder")}${btn("Copy ID", "", "copy")}<span class="grow"></span>${btn("Move to Trash", "ghost", "trash")}</div></div>
    <div class="hr2">${logo("codex")}<div class="tx"><b>Fix the parser's handling of nested quotes</b><span>~/Projects/nyx-glimpse · 6 prompts</span></div><span class="tag">running</span><span class="tm">13:52</span></div>
    <div class="hr2">${logo("claude")}<div class="tx"><b>Draw one usage card per agent</b><span>~/Projects/nyx-agents · 12 prompts</span></div><span class="tm">12:40</span></div>
    <div class="day">Yesterday</div>
    <div class="hr2">${logo("muse")}<div class="tx"><b>Docs pass over STYLE.md</b><span>~/Projects/nyx-design · 9 prompts</span></div><span class="tm">21:12</span></div>
    <div class="hr2">${logo("cursor")}<div class="tx"><b>Bar plugin: badge alignment</b><span>~/Projects/nyx-bar · 4 prompts</span></div><span class="tm">17:03</span></div>
    <div class="hr2">${logo("grok")}<div class="tx"><b>Explain the holder protocol</b><span>~/Projects/nyx-agents · 2 prompts</span></div><span class="tm">15:44</span></div>
  </div>
</div>`);

// The AI Hub: a glance and a few actions; everything else opens Agents.
PAGES.hub = () => `<div class="desk">
  <div class="topbar"><span>14:24</span><span class="hubi">${icon("spark")}<span>4</span><span class="bd">1</span></span><span>${icon("wifi")}</span></div>
  <div class="hub pop">
    <div class="hh"><div class="grow"><b>AI Hub</b><br><span>4 agents · 1 needs you · 3 subagents</span></div>${btn("New", "", "plus")}</div>
    <div class="tabs2">${'<div class="seg"><button class="on">Agents</button><button>Usage</button><button>Local AI</button></div>'}</div>
    <div class="lbl">Needs you</div>
    <div class="card2 need"><div class="r1">${logo("codex")}<b>Fix nested quotes</b><span>now</span></div><div class="cmd">Allow command? $ cargo test -p parser</div><div class="bt">${btn("Open", "primary")}${btn("Stop", "stop", "stop")}</div></div>
    <div class="lbl">Working</div>
    <div class="card2" style="padding:2px 10px">
      <div class="wr">${logo("claude")}<b>Agents UX revamp</b><span>3 subagents · 2m</span></div>
      <div class="wr">${logo("claude")}<b>Check the docs site</b><span>desktop · 1m</span></div>
      <div class="wr">${logo("shell")}<b>Terminal</b><span>8m</span></div>
    </div>
    <div class="lbl">Quotas</div>
    <div class="q"><span>Claude · 5 h</span><div class="tr"><div style="width:34%"></div></div><span class="v">34%</span><span>Codex · week</span><div class="tr"><div style="width:61%"></div></div><span class="v">61%</span></div>
    <div class="foot">${btn("History", "", "history")}${btn("Open Agents", "", "agents")}</div>
  </div>
  <div class="callout" style="top:120px; left:60px"><b>The Hub glances; Agents owns the work.</b><br>Open, Stop and New stay here. Past sessions moved to Agents → History (Resume, Peek, In a terminal, Trash), so there's one place to find and manage them.</div>
</div>`;

// Today's window, for comparison.
PAGES.before = () => `<div class="win">
  <header class="hdr"><div class="hdr-id">${icon("agents", "app-ic")}<span class="app-name">Agents</span></div><div class="hdr-start">${ib("sidebar")}</div><div class="hdr-center">${search("Search sessions  (Ctrl+Shift+F)", "")}</div><div class="hdr-end">${ib("plus")}${ib("sliders")}</div></header>
  <aside class="side"><div class="side-scroll">
    <div class="grp first">Needs you</div><div class="nav">${icon("alert")}<span>Codex · nyx-glimpse</span></div>
    <div class="grp">Active</div><div class="nav active">${icon("terminal")}<span>Claude Code · ken</span></div><div class="nav">${icon("terminal")}<span>Antigravity CLI · ken</span></div><div class="nav">${icon("terminal")}<span>Terminal · ken</span></div>
    <div class="grp">Recent</div><div class="nav">${icon("stop")}<span>Terminal</span></div><div class="nav">${icon("stop")}<span>Terminal</span></div><div class="nav">${icon("x")}<span>Claude Code · nyx-agents</span></div>
    <div class="grp">Projects</div><div class="nav">${icon("folder")}<span>nyx-agents</span></div><div class="nav">${icon("folder")}<span>ken</span></div>
  </div></aside>
  <main class="page">${`<div class="tabs"><div class="tab on">${icon("terminal")}<span class="tt">Claude Code · ken</span><span class="x">${icon("close")}</span></div><div class="tab">${icon("terminal")}<span class="tt">Antigravity CLI · ken</span></div><span class="plus">${icon("plus")}</span></div>`}
    <div class="sbar"><span class="pill">Starting</span><span class="meta">claude <span class="sep">·</span> ~</span><span class="act">${ib("search")}${ib("split-r")}${ib("split-d")}${ib("git")}${ib("monitor")}${ib("stop")}</span></div>
    <div class="term"></div>
  </main>
  <div class="toast2" style="bottom:22px">${icon("alert")}<span>session is not running</span></div>
</div>`;

function mount(html) {
  document.body.innerHTML = html;
}
document.addEventListener("DOMContentLoaded", () => {
  const svg = (n) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${AI[n]}</svg>`;
  document.querySelectorAll("i[data-i]").forEach((el) => { if (AI[el.dataset.i]) el.innerHTML = svg(el.dataset.i); });
  document.querySelector(".mock-switch")?.remove();
  if (SHOT) return;
  const screens = (ROOT.dataset.screens || "").split(",").filter(Boolean);
  const link = (k, v, label) => {
    const p = new URLSearchParams(location.search);
    p.set(k, v);
    const on = (Q.get(k) || { theme: "dark", screen: screens[0] }[k]) === v;
    return `<a class="${on ? "on" : ""}" href="?${p}">${label}</a>`;
  };
  const bar = document.createElement("nav");
  bar.className = "mock-switch";
  bar.innerHTML = screens.map((s) => link("screen", s, s[0].toUpperCase() + s.slice(1))).join("") + "<span></span>" + link("theme", "dark", "Dark") + link("theme", "light", "Light") + '<span></span><a href="index.html">Gallery</a>';
  document.body.append(bar);
});
