// Nyx Notes mockups: a sample vault, the window's parts and every screen.
"use strict";

/* ── Sample vault ────────────────────────────────────────────────────────── */
const NOTES = [
  ["Lumen launch plan", "Projects/Lumen", "Launch on 2 December. Beta feedback is in; the onboarding copy and the pricing page are the last two pieces…", "Today 14:20", { pin: true }],
  ["Pricing page", "Projects/Lumen", "Three tiers, yearly first. Compare with [[Competitor notes]] before the review…", "Today 11:05", {}],
  ["2026-11-12", "Daily notes", "Stand-up: Ada on onboarding, Dev on the release build. Call with Acme at 3…", "Today 09:12", {}],
  ["Competitor notes", "Research", "What Notion, Obsidian and Bear do for first run; screenshots in Attachments…", "Yesterday", {}],
  ["Hinge tests", "Projects/Workshop", "Brass vs steel, 2000 cycles each. Steel squeaks after 1400; see the table…", "Mon", {}],
  ["Reading list", "", "Designing Data-Intensive Applications · The Shape of Design · A Pattern Language…", "10 Nov", {}],
  ["Onboarding copy", "Projects/Lumen", "Three screens, one sentence each. “Your notes, in your folders.”…", "9 Nov", {}],
];

/* ── Window parts ───────────────────────────────────────────────────────── */
const hdr = (o = {}) => header({
  icon: "file-text", name: "Notes",
  center: `<div class="search ${o.pal ? "focus" : ""}" style="width:380px">${icon("search")}<span>${o.q || "Go to a note or do anything"}</span><span class="key">Ctrl K</span></div>`,
  end: `${ib("split", "Split the editor")}${ib("panel", "Inspector", o.insp === false ? "" : "on")}${ib("more", "Menu", o.menu ? "on" : "")}`,
});

function sidebar(active) {
  const tn = (ic, t, cls = "", o = {}) => `<div class="tn ${cls} ${active === t ? "active" : ""}">${o.cv ? icon(o.cv, "cv") : icon("chev-r", "cv blank")}${icon(ic)}<span>${t}</span>${o.cnt ? `<span class="cnt">${o.cnt}</span>` : ""}</div>`;
  return `
    <div class="vault">${icon("book")}<span>Work vault</span><span class="dd">${icon("chev-d")}</span></div>
    <div class="tree">
      ${tn("clock", "Recent", "", {})}
      ${tn("pin", "Pinned", "", { cnt: 2 })}
      ${tn("daily", "Daily notes", "", { cv: "chev-r", cnt: 48 })}
    </div>
    ${grp("Folders", false, icon("plus"), "accent")}
    <div class="tree">
      ${tn("folder", "Projects", "", { cv: "chev-d", cnt: 3 })}
      ${tn("folder", "Lumen", "l1", { cv: "chev-d", cnt: 9 })}
      ${tn("file-text", "Lumen launch plan", "l2")}
      ${tn("file-text", "Pricing page", "l2")}
      ${tn("folder", "Workshop", "l1", { cv: "chev-r", cnt: 4 })}
      ${tn("folder", "Research", "", { cv: "chev-r", cnt: 12 })}
      ${tn("folder", "Attachments", "", { cv: "chev-r", cnt: 31 })}
    </div>
    ${grp("Tags", false, "", "violet")}
    <div class="tagrow">${chip("#launch 8")}${chip("#design 14")}${chip("#research 6")}${chip("#workshop 4")}${chip("#people 11")}</div>
    <div class="foot">${icon("check-c", "ok")}<span>Synced with Nextcloud</span></div>`;
}

function noteList(title, n, rows, o = {}) {
  return `<div class="list"><div class="nlhead"><b>${title}</b><span class="n">${n}</span><span class="sp"></span><span class="dd" style="height:24px;font-size:.923em">Edited${icon("chev-d")}</span>${ib("plus", "New note")}</div>${o.chips || ""}<div class="nlist">${rows.map(([t, f, s, m, x], i) => `<div class="nrow ${i === (o.sel ?? 0) ? "sel" : ""}"><div class="t">${x.pin ? icon("pin") : ""}${t}</div><div class="s">${s}</div><div class="m"><span>${m}</span>${f ? `<span>${f}</span>` : ""}</div></div>`).join("")}</div></div>`;
}

function ebar(o = {}) {
  return `<div class="ebar2"><span class="crumb">Projects / Lumen / <b>Lumen launch plan</b></span>${o.unsaved ? '<span class="dot" title="Unsaved"></span>' : ""}<span class="sp"></span>${seg(["Source", "Live", "Read"], o.mode || "Live")}</div>`;
}

function doc(o = {}) {
  if (o.mode === "Source") return `<div class="doc"><div class="col"><div class="src"><span class="m">---</span>
status: <span class="m">doing</span>
tags: [launch, design]
<span class="m">---</span>
<span class="h"># Lumen launch plan</span>

Launch on **2 December**. Beta feedback is in; the [[Onboarding copy]]
and the [[Pricing page]] are the last two pieces.

<span class="h">## This week</span>

- [x] Collect beta feedback
- [ ] Final <span class="m">#design</span> pass on onboarding
- [ ] Price review with Dev (Thursday)</div></div></div>`;
  const sel = o.sel ? '<span class="sel">the last two pieces</span>' : "the last two pieces";
  return `<div class="doc"><div class="col ${o.mode === "Read" ? "reading" : ""}">
    <h1>Lumen launch plan</h1>
    <div class="props">${chip("doing", "acc")}${chip("#launch")}${chip("#design")}${chip("Edited today 14:20", "", "clock")}</div>
    <p>Launch on <b>2 December</b>. Beta feedback is in; the <span class="wl">Onboarding copy</span> and the <span class="wl">Pricing page</span> are ${sel}.</p>
    <div class="callout"><b>${icon("info")}Decision</b>Ship without the team plan; add it in January once billing is ready.</div>
    <h2>This week</h2>
    <div class="task done"><span class="cbx sq done">${icon("check")}</span><span>Collect beta feedback</span></div>
    <div class="task"><span class="cbx sq"></span><span>Final <span class="tg">#design</span> pass on onboarding</span></div>
    <div class="task"><span class="cbx sq"></span><span>Price review with Dev (Thursday)</span></div>
    <h2>Milestones</h2>
    <table><tr><th>What</th><th>Who</th><th>When</th></tr><tr><td>Release build</td><td>Dev</td><td>28 Nov</td></tr><tr><td>Press note</td><td>Ada</td><td>1 Dec</td></tr><tr><td>Launch</td><td>Everyone</td><td>2 Dec</td></tr></table>
  </div></div>`;
}

function insp(tab = "Outline", o = {}) {
  let body = "";
  if (tab === "Outline") body = `<div class="lab">On this note</div><div class="oitem on">Lumen launch plan</div><div class="oitem l2">This week</div><div class="oitem l2">Milestones</div>
    <div class="lab">Backlinks <span class="cnt">3</span></div><div class="bl"><b>2026-11-12</b><span>…call about the <u>Lumen launch plan</u> at 3…</span></div><div class="bl"><b>Pricing page</b><span>…ties into the <u>launch plan</u>…</span></div><div class="bl"><b>Onboarding copy</b><span>…see the <u>Lumen launch plan</u>…</span></div>`;
  if (tab === "Links") body = `<div class="lab">Links from here <span class="cnt">2</span></div><div class="bl"><b>Onboarding copy</b><span>Projects/Lumen</span></div><div class="bl"><b>Pricing page</b><span>Projects/Lumen</span></div><div class="lab">Mentioned, not linked <span class="cnt">1</span></div><div class="bl"><b>Competitor notes</b><span>“…before the Lumen launch…”</span><div style="margin-top:6px">${btn("Link it", "sm")}</div></div>`;
  if (tab === "Info") body = `<div class="lab">This note</div><div class="stats"><div><b>412</b><span>words</span></div><div><b>2 min</b><span>reading</span></div><div><b>3</b><span>tasks · 1 done</span></div><div><b>Saved</b><span>14:20</span></div></div>
    <div class="lab">Properties <span class="act">Edit</span></div><div class="card"><div class="row"><span class="k">status</span><span class="v">doing</span></div><div class="row"><span class="k">tags</span><span class="v">launch, design</span></div><div class="row"><span class="k">created</span><span class="v">3 Nov 2026</span></div></div>
    <div class="lab">File</div><div class="card"><div class="row"><span class="k">Projects/Lumen/Lumen launch plan.md</span></div></div>`;
  if (tab === "Assist") body = `<div class="lab">Assist · on this computer</div><div class="asks">${chip("Summarize")}${chip("Shorten", "on")}${chip("Fix grammar")}${chip("Change the tone")}${chip("Outline")}${chip("Ask the vault…")}</div>
    <div class="lab">Proposed edit</div><div class="diff">Launch on 2 December. <del>Beta feedback is in; the Onboarding copy and the Pricing page are the last two pieces.</del><ins>Only the onboarding copy and pricing page remain.</ins></div>
    <div style="display:flex;gap:6px;margin-top:10px">${btn("Apply", "primary")}${btn("Try again")}${btn("Discard", "ghost")}</div>
    <p style="color:var(--text-tertiary);font-size:.846em;margin-top:10px">Nothing changes until you apply it. Runs on Nyx AI Core; nothing leaves this computer.</p>`;
  return `<div class="insp"><div class="itabs">${seg(o.tabs || ["Outline", "Links", "Info"], tab)}</div><div class="ibody">${body}</div></div>`;
}

const editorWith = (o = {}) => `<div class="ed">${ebar(o)}${doc(o)}${o.overDoc || ""}</div>`;
const tabsRow = (on, extra = []) => `<div class="tabs">${[["file-text", "Lumen launch plan"], ["file-text", "Pricing page"], ...extra].map(([ic, t]) => `<div class="tab ${t === on ? "on" : ""}">${icon(ic)}<span class="tt">${t}</span><span class="x">${icon("close")}</span></div>`).join("")}<span class="plus">${icon("plus")}</span></div>`;
const shell = (main, o = {}) => win({ hdr: hdr(o), side: o.noSide ? "" : sidebar(o.active || "Lumen launch plan"), page: `${o.tabs === false ? "" : tabsRow(o.tab || "Lumen launch plan", o.moreTabs)}<div class="cols">${main}</div>`, over: o.over || "" });

/* ── Screens ────────────────────────────────────────────────────────────── */
PAGES.editor = () => shell(noteList("Lumen", 9, NOTES.filter((n) => n[1] === "Projects/Lumen")) + editorWith() + insp("Outline"));
PAGES.live = () => shell(editorWith() + insp("Outline"), {});
PAGES.reading = () => shell(noteList("Lumen", 9, NOTES.filter((n) => n[1] === "Projects/Lumen")) + editorWith({ mode: "Read" }), { insp: false });
PAGES.source = () => shell(editorWith({ mode: "Source", unsaved: true }) + insp("Info"));
PAGES.format = () => shell(noteList("Lumen", 9, NOTES.filter((n) => n[1] === "Projects/Lumen")) + editorWith({ sel: true, overDoc: `<div class="fbar pop" style="top:128px;left:150px">${ib("bold", "Bold (Ctrl+B)")}${ib("italic", "Italic (Ctrl+I)")}${ib("link", "Link (Ctrl+L)")}<span class="sep"></span>${ib("hd", "Heading")}${ib("ul", "List")}${ib("task", "Task (Ctrl+T)")}${ib("quote", "Quote")}${ib("code", "Code")}<span class="sep"></span>${ib("sparkle", "Assist")}</div>` }) + insp("Outline"));
PAGES.palette = () => shell(editorWith() + insp("Outline"), { pal: true, q: '<span style="color:var(--text)">pri</span>',
  over: `<div class="veil" style="background:color-mix(in srgb,var(--bg) 40%,transparent)"></div><div class="pal pop">
    <div class="field focus">${icon("search")}<span>pri</span><span class="grow"></span><span class="ph">Notes, commands, tags, headings</span></div>
    <div class="ph2">Notes</div>
    <div class="pi on">${icon("file-text")}<span><b>Pri</b>cing page</span><span class="w">Projects/Lumen</span></div>
    <div class="pi">${icon("file-text")}<span>Competitor notes · “…their <b>pri</b>cing tiers…”</span><span class="w">Research</span></div>
    <div class="ph2">Do</div>
    <div class="pi">${icon("export")}<span><b>Pri</b>nt or export as PDF…</span><span class="k">Ctrl P</span></div>
    <div class="pi">${icon("graph")}<span>Open the graph</span><span class="k">Ctrl G</span></div>
    <div class="pi">${icon("history")}<span>History of this note</span><span class="k">Ctrl H</span></div>
    <div class="pi">${icon("sync")}<span>Sync now</span></div>
    <div class="ph2" style="font-weight:400">↑↓ to move · Enter to open · Ctrl Enter in a new tab</div></div>` });
PAGES.menu = () => shell(editorWith() + insp("Outline"), { menu: true,
  over: `<div class="menu pop" style="top:42px;right:46px;width:250px">
    <div class="mh">Note</div>
    <div class="mi">${icon("plus")}<span>New note</span><span class="k">Ctrl N</span></div>
    <div class="mi">${icon("daily")}<span>Today's daily note</span><span class="k">Ctrl ⇧ D</span></div>
    <div class="mi">${icon("rename")}<span>Rename or move…</span><span class="k">F2</span></div>
    <div class="mi">${icon("copy")}<span>Duplicate</span></div>
    <div class="mi">${icon("share")}<span>Share…</span></div>
    <div class="mi danger">${icon("trash2")}<span>Move to Trash</span></div>
    <div class="ms"></div><div class="mh">View</div>
    <div class="mi">${icon("graph")}<span>Graph</span><span class="k">Ctrl G</span></div>
    <div class="mi">${icon("kanban")}<span>Collections</span></div>
    <div class="mi">${icon("canvas")}<span>Canvas</span></div>
    <div class="mi">${icon("book")}<span>Writing projects</span></div>
    <div class="mi">${icon("expand")}<span>Focus mode</span><span class="k">F11</span></div>
    <div class="ms"></div><div class="mh">Vault</div>
    <div class="mi">${icon("sync")}<span>Sync now</span></div>
    <div class="mi">${icon("book")}<span>Switch vault…</span></div>
    <div class="ms"></div>
    <div class="mi">${icon("cmd")}<span>Everything else</span><span class="k">Ctrl K</span></div>
  </div>` });
PAGES.search = () => shell(noteList("Search", "4 notes", [
  ["Pricing page", "Projects/Lumen", "Three tiers, yearly first. The <mark>launch</mark> price holds for the first month…", "Today 11:05", {}],
  ["Lumen launch plan", "Projects/Lumen", "<mark>Launch</mark> on 2 December. Beta feedback is in…", "Today 14:20", { pin: true }],
  ["2026-11-12", "Daily notes", "…call with Acme about the <mark>launch</mark> at 3…", "Today 09:12", {}],
  ["Competitor notes", "Research", "…before the Lumen <mark>launch</mark>, compare first-run…", "Yesterday", {}],
], { chips: `<div class="qchips">${chip("launch", "on")}${chip("path:Projects", "on", "folder")}${chip("+ tag:", "")}${chip("+ after:", "")}</div>` }) + editorWith() + insp("Outline"), { q: '<span style="color:var(--text)">launch path:Projects</span>' });
PAGES.graph = () => shell(`<div class="ed"><div class="graph"><div class="gtools">${seg(["Whole vault", "This note"], "This note")}<span class="dd">Depth 2${icon("chev-d")}</span><span class="dd">All tags${icon("chev-d")}</span>${btn("Fit", "sm")}</div>
  <svg viewBox="0 0 900 600">${[[450, 300, 230, 170], [450, 300, 680, 180], [450, 300, 700, 420], [450, 300, 260, 440], [230, 170, 120, 260], [680, 180, 800, 110], [700, 420, 820, 500], [260, 440, 140, 520]].map(([a, b, c, d]) => `<line x1="${a}" y1="${b}" x2="${c}" y2="${d}" stroke="currentColor" stroke-opacity=".25"/>`).join("")}
  ${[[450, 300, 14, "Lumen launch plan", 1], [230, 170, 9, "Pricing page"], [680, 180, 9, "Onboarding copy"], [700, 420, 8, "2026-11-12"], [260, 440, 8, "Competitor notes"], [120, 260, 5, "Pricing research"], [800, 110, 5, "Copy drafts"], [820, 500, 5, "Acme"], [140, 520, 5, "Bear"]].map(([x, y, r, t, on]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${on ? "var(--accent)" : "var(--dim-text)"}"/><text x="${x}" y="${y + r + 16}" text-anchor="middle" font-size="13" fill="currentColor" fill-opacity="${on ? 1 : .7}">${t}</text>`).join("")}</svg></div></div>` + insp("Links"), { moreTabs: [["graph", "Graph"]], tab: "Graph" });
PAGES.collections = () => shell(`<div class="ed"><div class="ebar2"><span class="crumb"><b>Lumen work</b> · status in Projects/Lumen</span><span class="sp"></span>${seg(["Table", "List", "Board", "Gallery"], "Board")}<span class="dd" style="height:24px">Group: status${icon("chev-d")}</span></div><div class="kan">
  <div class="kcol"><h4>To do <span>3</span></h4><div class="kcard"><b>Press note</b><span>#launch · Ada</span></div><div class="kcard"><b>Team plan</b><span>January</span></div><div class="kcard"><b>FAQ</b><span>#support</span></div></div>
  <div class="kcol"><h4>Doing <span>2</span></h4><div class="kcard"><b>Lumen launch plan</b><span>#launch #design</span></div><div class="kcard"><b>Pricing page</b><span>#launch</span></div></div>
  <div class="kcol"><h4>Done <span>4</span></h4><div class="kcard"><b>Beta feedback</b><span>Nov 8</span></div><div class="kcard"><b>Onboarding copy</b><span>Nov 9</span></div></div>
</div></div>`, { moreTabs: [["kanban", "Lumen work"]], tab: "Lumen work", insp: false });
PAGES.history = () => shell(`<div class="ed"><div class="ebar2"><span class="crumb">History of <b>Lumen launch plan</b></span><span class="sp"></span>${btn("Restore the checked lines", "")}${btn("Restore this version", "primary")}</div><div class="hist">
  <div class="tl"><div class="ti">${""}<b>Now</b><span>412 words</span></div><div class="ti on"><b>Today 11:40</b><span>−2 lines · +1 line</span></div><div class="ti"><b>Yesterday 17:02</b><span>+ Milestones table</span></div><div class="ti"><b>Mon 10 Nov</b><span>+ This week</span></div><div class="ti"><b>3 Nov</b><span>Created</span></div></div>
  <div class="hd2"><div class="dl"><div># Lumen launch plan</div><div></div><div class="r">Launch on 28 November. Beta feedback is still coming in.</div><div class="a">Launch on **2 December**. Beta feedback is in; the [[Onboarding copy]]</div><div class="a">and the [[Pricing page]] are the last two pieces.</div><div></div><div>## This week</div><div>- [x] Collect beta feedback</div></div></div>
</div></div>`, { moreTabs: [["history", "History"]], tab: "History", insp: false });
PAGES.assist = () => shell(editorWith({ sel: true }) + insp("Assist", { tabs: ["Outline", "Links", "Info", "Assist"] }));
PAGES.conflict = () => shell(`<div class="ed"><div class="banner2 warn">${icon("alert")}<div class="tx"><b>This note changed here and on Nextcloud</b><span>Choose what to keep; the other version stays in History.</span></div>${btn("Keep both", "")}</div><div class="cmp">
  <div class="pane"><div class="hh"><b>On this computer</b><span>Today 14:20</span><span class="grow"></span>${btn("Keep this", "primary")}</div><div class="txt">Launch on 2 December. Beta feedback is in; the onboarding copy and the pricing page are <mark>the last two pieces</mark>.</div></div>
  <div class="pane"><div class="hh"><b>On Nextcloud</b><span>Today 14:05 · from the laptop</span><span class="grow"></span>${btn("Keep this", "")}</div><div class="txt">Launch on 2 December. Beta feedback is in; the onboarding copy and the pricing page are <mark>all that's left, plus the FAQ</mark>.</div></div>
</div></div>`, { insp: false });
PAGES.split = () => shell(`<div class="ed" style="border-right:1px solid var(--divider-line)">${ebar()}${doc()}</div><div class="ed"><div class="ebar2"><span class="crumb">Projects / Lumen / <b>Pricing page</b></span><span class="sp"></span>${seg(["Source", "Live", "Read"], "Live")}</div><div class="doc"><div class="col"><h1>Pricing page</h1><div class="props">${chip("doing", "acc")}${chip("#launch")}</div><p>Three tiers, yearly first. Compare with <span class="wl">Competitor notes</span> before the review.</p><h2>Tiers</h2><table><tr><th>Tier</th><th>Monthly</th><th>Yearly</th></tr><tr><td>Free</td><td>0</td><td>0</td></tr><tr><td>Plus</td><td>6</td><td>60</td></tr><tr><td>Pro</td><td>12</td><td>120</td></tr></table></div></div></div>`, { insp: false });
PAGES.welcome = () => win({ hdr: header({ icon: "file-text", name: "Notes" }), side: "", page: `<div class="welcome"><div class="wcard"><h2>Your notes, in your folders</h2><p>Notes keeps plain Markdown files in a folder you choose — a vault. Obsidian vaults open as they are.</p>
  <div style="display:flex;gap:8px">${btn("Choose a folder…", "primary", "folder")}${btn("Create a new vault", "", "plus")}</div>
  <div class="recent"><div class="lab" style="font-size:.846em;font-weight:600;color:var(--text-tertiary);margin-bottom:4px">Recent vaults</div><div class="tn">${icon("book")}Work vault<span>~/Notes/Work</span></div><div class="tn">${icon("book")}Garden<span>~/Documents/Garden</span></div></div>
  <p style="margin:14px 0 0;font-size:.923em">Or ${'<span style="color:var(--accent)">open a single Markdown file</span>'}.</p></div></div>` });
PAGES.library = () => shell(`<div class="ed"><div class="lib"><h3>Pinned</h3><div class="lgrid"><div class="lcard"><b>${icon("pin")}Lumen launch plan</b><p>Launch on 2 December. Beta feedback is in…</p><span>Today 14:20</span></div><div class="lcard"><b>${icon("pin")}Reading list</b><p>Designing Data-Intensive Applications…</p><span>10 Nov</span></div></div>
  <h3>Recent</h3><div class="lgrid">${NOTES.slice(1, 7).map(([t, f, s, m]) => `<div class="lcard"><b>${t}</b><p>${s.slice(0, 60)}…</p><span>${m} · ${f || "Vault"}</span></div>`).join("")}</div>
  <h3>Saved searches</h3><div style="display:flex;gap:6px">${chip("#launch -done")}${chip("tasks this week")}${chip("path:Research after:2026-10-01")}</div></div></div>`, { tabs: false, insp: false, active: "Recent", over: idea("Idea · a Library home", "Opening the vault shows what's pinned, recent and saved, instead of an empty editor.") });
PAGES.before = () => `<div class="win">
  <header class="hdr"><div class="hdr-id">${icon("file-text", "app-ic")}<span class="app-name">Notes</span><span class="app-sub" style="margin-left:8px">Work vault</span></div><div class="hdr-start">${ib("sidebar")}</div><div class="hdr-center"><span style="color:var(--text-tertiary)">Projects/Lumen /</span>&nbsp;<b>Lumen launch plan</b>&nbsp;<span style="color:var(--accent)">•</span></div><div class="hdr-end"><div class="search" style="width:170px">${icon("search")}<span>Search notes</span></div>${ib("split")}${ib("panel")}${ib("more", "", "on")}${ib("sliders")}</div></header>
  <aside class="side"><div class="side-scroll"><div class="tree">${["Projects", "  Lumen", "    Lumen launch plan", "    Pricing page", "  Workshop", "Research", "Daily Notes", "Templates", "Attachments"].map((t) => `<div class="tn" style="padding-left:${8 + (t.length - t.trimStart().length) * 7}px">${icon(t.includes("plan") || t.includes("page") ? "file-text" : "folder")}<span>${t.trim()}</span></div>`).join("")}</div><div class="grp">TAGS</div><div class="tn">#launch 8</div><div class="tn">#design 14</div></div></aside>
  <main class="page" style="flex-direction:column"><div class="b-tabs"><span class="t">Lumen launch plan •</span><span>Pricing page</span></div><div style="flex:1;display:flex"><div style="flex:1">${doc()}</div></div><div class="b-foot"><span>412 words · 2 min read · Ln 4, Col 12</span><span class="grow"></span><span>Markdown</span><span>● Unsaved</span></div></main>
  <div class="b-menu pop">${["Save all", "Open vault…", "New note", "New folder", "Refresh vault and search index", "Save", "Save a copy", "Undo", "Redo", "Live formatting", "Reading mode", "Toggle task", "Fold or unfold heading", "Find in note", "AI writing assistance…", "Ask the vault…", "Semantic / hybrid search…", "Related notes / backlink suggestions…", "Local AI and integration preferences…", "Rebuild semantic index", "Personal sync…", "Sync now", "Sync conflicts…", "Extension commands…", "Daily note", "New note from template…", "Insert template…", "Attach files…", "…and 27 more"].map((t) => `<div>${t}</div>`).join("")}</div>
</div>`;
