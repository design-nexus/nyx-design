// Nyx Reminders mockups: sample lists and reminders, the window's parts and every screen.
"use strict";

/* ── Sample data ─────────────────────────────────────────────────────────── */
const LISTS = {
  work: { name: "Work", color: "#3d8ae8", acct: "google" },
  errands: { name: "Errands", color: "#f5875a", acct: "google" },
  family: { name: "Family", color: "#8b6cf0", acct: "google" },
  home: { name: "Home", color: "#59d45b", acct: "local" },
};
const ACCTS = { google: "ken@design-nex.us", local: "On this computer" };
// [title, list, due, opts]
const T = {
  invoice: ["Send invoice to Acme", "work", "Yesterday", { over: true, p: 1, note: "Net 30 · PDF in Mail", tags: ["billing"] }],
  standup: ["Prepare stand-up notes", "work", "Today 9:30", { rep: "Weekdays", p: 3 }],
  cleaning: ["Pick up dry cleaning", "errands", "Today 18:00", { flag: true }],
  mom: ["Call Mom about Thanksgiving", "family", "Today", { flag: true, note: "Ask about the train times" }],
  renew: ["Renew design-nex.us", "work", "Fri 14 Nov", { p: 2, tags: ["domains"] }],
  groceries: ["Groceries for the weekend", "errands", "Sat 15 Nov", { subs: "1 of 4" }],
  filter: ["Replace the furnace filter", "home", "Mon 17 Nov", { rep: "Every 3 months" }],
  dentist: ["Book the dentist", "family", "Next week", {}],
  plants: ["Water the plants", "home", "Every 3 days", { rep: "Every 3 days" }],
  review: ["Review the Q4 roadmap", "work", "Wed 19 Nov", { note: "Notes from Sam's draft" }],
  tax: ["Gather receipts for taxes", "home", "", { tags: ["taxes"] }],
};
const ago = (k) => T[k];

/* ── Window parts ───────────────────────────────────────────────────────── */
const hdr = (o = {}) => header({
  icon: "check-c", name: "Reminders",
  center: search(o.q ? `<span style="color:var(--text)">${o.q}</span>` : "Search reminders", "Ctrl F", o.q ? "focus" : ""),
});

function sidebar(active, o = {}) {
  const tile = (k, ic, n, nm, c) => `<div class="stile ${active === k ? "on" : ""}" style="--tc:${c}"><div class="r1"><span class="ic">${icon(ic)}</span><span class="n">${n}</span></div><span class="nm">${nm}</span></div>`;
  const lists = (acct) => Object.entries(LISTS).filter(([, l]) => l.acct === acct)
    .map(([k, l]) => navx("", l.name, { dot: l.color, active: active === k, cnt: { work: 4, errands: 2, family: 3, home: 3 }[k] })).join("");
  return `
    <div class="stiles">
      ${tile("today", "sun", 4, "Today", "var(--sw-blue)")}
      ${tile("scheduled", "calendar2", 9, "Scheduled", "var(--sw-red)")}
      ${tile("flagged", "flag", 2, "Flagged", "var(--sw-amber)")}
      ${tile("all", "inbox2", 12, "All", "var(--sw-graphite)")}
    </div>
    ${navx("check-c", "Completed", { active: active === "completed", cnt: 38 })}
    ${grp(ACCTS.google, false, icon("chev-d"), "violet")}
    ${lists("google")}
    ${grp(ACCTS.local, false, icon("chev-d"), "green")}
    ${lists("local")}
    <div class="hr"></div>
    ${navx("users", "Accounts", {})}
    <div class="foot">${o.offline ? `${icon("cloudoff", "warn")}<span>Offline · changes are kept and sent later</span>` : `${icon("check-c", "ok")}<span>Synced 2 min ago</span>`}</div>`;
}

function pbar(title, sub, o = {}) {
  return `<div class="pbar"><span class="t">${title}</span>${sub ? `<span class="s">${sub}</span>` : ""}<span class="sp"></span>
    <span class="tog">Show completed ${sw(o.done)}</span>
    <span class="dd">${o.manual ? "Manual order" : "By date"}${icon("chev-d")}</span></div>`;
}

function quickAdd(o = {}) {
  const l = LISTS[o.list || "work"];
  const typing = o.typing;
  return `<div class="qa"><div class="field ${typing ? "focus" : ""}">${icon("plus")}${typing ? `<span>${typing}</span>` : '<span class="ph">Add a reminder — “Call Sam tomorrow at 9”</span>'}</div>
    <span class="dest" title="Goes to"><span class="cdot" style="background:${l.color}"></span>${l.name}${icon("chev-d")}</span></div>
    ${o.parse ? `<div class="parse">Adds ${o.parse}</div>` : ""}`;
}

function row(k, o = {}) {
  const [title, list, due, x] = ago(k);
  const l = LISTS[list];
  const bits = [];
  if (due) bits.push(chip(due, x.over ? "red" : "", "calendar2"));
  if (x.rep && x.rep !== due) bits.push(chip(x.rep, "", "repeat"));
  else if (x.rep) bits.push(chip("", "", "repeat"));
  if (o.showList !== false && !o.inList) bits.push(`<span class="ldot"><b style="background:${l.color}"></b>${l.name}</span>`);
  (x.tags || []).forEach((t) => bits.push(`<span class="htag">#${t}</span>`));
  if (x.note) bits.push(`<span class="note">${x.note}</span>`);
  if (x.subs) bits.push(`<span>${icon("listic")} ${x.subs}</span>`);
  return `<div class="rrow ${o.sel ? "sel" : ""} ${o.hover ? "hover" : ""} ${o.done ? "done" : ""} ${o.child ? "child" : ""}">
    ${x.p && !o.done ? `<span class="pb p${x.p}"></span>` : ""}
    <span class="cbx ${o.done ? "done" : ""}">${o.done ? icon("check") : ""}</span>
    <div class="tx"><div class="tt">${title}</div>${bits.length ? `<div class="ln">${bits.join("")}</div>` : ""}</div>
    ${x.flag ? icon("flag", "fl") : ""}</div>`;
}
const sub = (title, o = {}) => `<div class="rrow child ${o.done ? "done" : ""}"><span class="cbx ${o.done ? "done" : ""}">${o.done ? icon("check") : ""}</span><div class="tx"><div class="tt">${title}</div></div></div>`;

function detail(k, o = {}) {
  const [title, list, due, x] = ago(k);
  const l = LISTS[list];
  return `<div class="insp">
    <div class="ihead"><div class="ttl"><span class="cbx"></span><span>${title}</span></div>
      <div class="notes">${x.note || "Notes"}</div></div>
    <div class="ibody">
      <div class="lab">When</div>
      <div class="card">
        <div class="row">${icon("calendar2")}<span class="k">Date</span><span class="dd2">${due.split(" ")[0] || "Add a date"}${icon("chev-d")}</span></div>
        <div class="row">${icon("clock")}<span class="k">Time</span><span class="dd2">${due.includes(":") ? due.split(" ").pop() : "All day"}${icon("chev-d")}</span></div>
        <div class="row">${icon("repeat")}<span class="k">Repeat</span><span class="dd2">${x.rep || "Never"}${icon("chev-d")}</span></div>
        <div class="row">${icon("bell")}<span class="k">Alert</span><span class="dd2">${due.includes(":") ? "10 min before" : "On the day at 9:00"}${icon("chev-d")}</span></div>
      </div>
      <div class="lab">Details</div>
      <div class="card">
        <div class="row">${icon("listic")}<span class="k">List</span><span class="dd2"><span class="cdot" style="background:${l.color}"></span>${l.name}${icon("chev-d")}</span></div>
        <div class="row">${icon("flag")}<span class="k">Priority</span>${seg(["None", "Low", "Med", "High"], ["None", "High", "Med", "Low"][x.p || 0])}</div>
        <div class="row">${icon("flag")}<span class="k">Flagged</span>${sw(x.flag)}</div>
        <div class="row">${icon("hash")}<span class="k">Tags</span><span class="${(x.tags || []).length ? "v" : "add"}">${(x.tags || []).map((t) => "#" + t).join(" ") || "Add a tag"}</span></div>
        <div class="row">${icon("link")}<span class="k">Link</span><span class="add">Add a link</span></div>
      </div>
      <div class="lab">Subtasks <span class="cnt">${o.subs ? "1 of 3" : ""}</span></div>
      <div class="card">
        ${o.subs ? `<div class="subrow"><span class="cbx done">${icon("check")}</span><span style="color:var(--text-tertiary);text-decoration:line-through">Export the hours</span>${icon("chev-r")}</div>
        <div class="subrow"><span class="cbx"></span><span>Attach the PDF</span>${icon("chev-r")}</div>
        <div class="subrow"><span class="cbx"></span><span>Copy finance@acme.example</span>${icon("chev-r")}</div>` : ""}
        <div class="subrow add">${icon("plus")}<span>Add a subtask</span></div>
      </div>
      ${o.from ? `<div class="lab">From</div><div class="fromrow">${icon("mail")}<span>Mail · “Invoice reminder” from Acme Billing</span></div>` : ""}
    </div>
    <div class="ifoot"><span class="s" style="color:var(--text-tertiary);font-size:.846em">Saved as you type</span><span class="grow"></span>${btn("Delete", "dtext", "trash2")}</div>
  </div>`;
}

const page = (inner, insp = "") => `<div class="cols"><div class="main">${inner}</div>${insp}</div>`;

/* ── Screens ────────────────────────────────────────────────────────────── */
PAGES.today = () => win({ hdr: hdr(), side: sidebar("today"), page: page(pbar("Today", "Thursday 12 November") + quickAdd() + `<div class="rlist">
  <div class="rgrp red">Overdue <span class="c">1</span></div>${row("invoice")}
  <div class="rgrp">Today <span class="c">3</span></div>${row("standup")}${row("cleaning")}${row("mom")}
</div>`) });

PAGES.scheduled = () => win({ hdr: hdr(), side: sidebar("scheduled"), page: page(pbar("Scheduled", "9 reminders") + quickAdd() + `<div class="rlist">
  <div class="rgrp red">Overdue <span class="c">1</span></div>${row("invoice")}
  <div class="rgrp">Today <span class="c">3</span></div>${row("standup")}${row("cleaning")}
  <div class="rgrp">Tomorrow</div>${row("renew")}
  <div class="rgrp">This week <span class="c">2</span></div>${row("groceries")}${row("filter")}
  <div class="rgrp">Later <span class="c">2</span></div>${row("review")}${row("dentist")}
</div>`) });

PAGES.list = () => win({ hdr: hdr(), side: sidebar("work"), page: page(pbar(`<span style="color:${LISTS.work.color}">●</span> Work`, "ken@design-nex.us · 4 open", { manual: true }) + quickAdd() + `<div class="rlist">
  ${row("invoice", { inList: true })}
  ${sub("Export the hours", { done: true })}${sub("Attach the PDF")}${sub("Copy finance@acme.example")}
  ${row("standup", { inList: true })}${row("renew", { inList: true })}${row("review", { inList: true })}
  <div class="done-head">Drag to reorder · Manual order is kept per list</div>
</div>`) });

PAGES.flagged = () => win({ hdr: hdr(), side: sidebar("flagged"), page: page(pbar("Flagged", "2 reminders") + quickAdd({ list: "family" }) + `<div class="rlist">${row("cleaning")}${row("mom")}</div>`) });

PAGES.completed = () => win({ hdr: hdr(), side: sidebar("completed"), page: page(`<div class="pbar"><span class="t">Completed</span><span class="s">38 reminders</span><span class="sp"></span>${btn("Clear older than 30 days", "ghost")}</div>` + `<div class="rlist">
  <div class="rgrp">Today</div>${row("tax", { done: true })}
  <div class="rgrp">Yesterday</div>${row("plants", { done: true })}${row("dentist", { done: true })}
  <div class="rgrp">Last week</div>${row("filter", { done: true })}
</div>`) });

PAGES.detail = () => win({ hdr: hdr(), side: sidebar("today"), page: page(pbar("Today", "Thursday 12 November") + quickAdd() + `<div class="rlist">
  <div class="rgrp red">Overdue <span class="c">1</span></div>${row("invoice", { sel: true })}
  <div class="rgrp">Today <span class="c">3</span></div>${row("standup")}${row("cleaning")}${row("mom")}
</div>`, detail("invoice", { subs: true, from: true })) });

PAGES.quickadd = () => win({ hdr: hdr(), side: sidebar("today"), page: page(pbar("Today", "Thursday 12 November") +
  quickAdd({ typing: 'Call Sam <b>tomorrow at 9</b> <b>every monday</b> <span style="color:var(--accent)">#calls</span>', list: "work", parse: `${chip("Tomorrow 9:00", "acc", "calendar2")}${chip("Every Monday", "acc", "repeat")}${chip("#calls", "acc")} to <b style="color:var(--text)">Work</b> · Enter adds · Tab picks another list` }) +
  `<div class="rlist"><div class="rgrp red">Overdue <span class="c">1</span></div>${row("invoice")}<div class="rgrp">Today <span class="c">3</span></div>${row("standup")}${row("cleaning")}${row("mom")}</div>`) });

PAGES.menu = () => win({ hdr: hdr(), side: sidebar("today"), page: page(pbar("Today", "Thursday 12 November") + quickAdd() + `<div class="rlist">
  <div class="rgrp red">Overdue <span class="c">1</span></div>${row("invoice")}
  <div class="rgrp">Today <span class="c">3</span></div>${row("standup", { hover: true })}${row("cleaning")}${row("mom")}
</div>`), over: `<div class="menu pop" style="top:300px;left:560px">
  <div class="mi">${icon("check-c")}<span>Complete</span><span class="k">Space</span></div>
  <div class="mi">${icon("flag")}<span>Flag</span><span class="k">S</span></div>
  <div class="ms"></div>
  <div class="mi hover">${icon("calendar2")}<span>Due</span>${icon("chev-r", "chev")}</div>
  <div class="mi">${icon("flag")}<span>Priority</span>${icon("chev-r", "chev")}</div>
  <div class="mi">${icon("listic")}<span>Move to list</span>${icon("chev-r", "chev")}</div>
  <div class="ms"></div>
  <div class="mi">${icon("copy")}<span>Copy</span><span class="k">Ctrl C</span></div>
  <div class="mi danger">${icon("trash2")}<span>Delete</span><span class="k">Del</span></div>
</div>
<div class="menu pop" style="top:356px;left:822px;width:210px">
  <div class="mi">${icon("sun")}<span>Today</span></div><div class="mi">${icon("calendar2")}<span>Tomorrow</span></div><div class="mi">${icon("calendar2")}<span>Next Monday</span></div><div class="mi">${icon("calendar2")}<span>Pick a date…</span></div><div class="ms"></div><div class="mi">${icon("x")}<span>No date</span></div>
</div>` });

PAGES.nomatch = () => win({ hdr: hdr({ q: "dentst" }), side: sidebar("all"), page: page(pbar("All", "Searching “dentst”") + `<div class="empty2">${icon("search")}<b>No reminders match “dentst”</b><span>Search looks at titles, notes and #tags in every list.</span><div class="bts">${btn("Search every list", "primary")}${btn("Clear the search", "ghost")}</div></div>`) });

PAGES.empty = () => win({ hdr: hdr(), side: sidebar("home"), page: page(pbar(`<span style="color:${LISTS.home.color}">●</span> Home`, "On this computer", { manual: true }) + quickAdd({ list: "home" }) + `<div class="empty2">${icon("check-c")}<b>Nothing left in Home</b><span>Type above to add one — “Water the plants every 3 days” sets the repeat for you.</span><div class="bts">${btn("Show completed", "ghost")}</div></div>`) });

PAGES.signin = () => win({ hdr: hdr(), side: sidebar("work", { offline: true }), page: page(`<div class="banner2 warn">${icon("alert")}<div class="tx"><b>ken@design-nex.us needs you to sign in again</b><span>Its lists still show what was last synced; new changes wait until you sign in.</span></div>${btn("Sign in", "primary")}</div>` + pbar(`<span style="color:${LISTS.work.color}">●</span> Work`, "Last synced 2 hours ago", { manual: true }) + quickAdd() + `<div class="rlist">${row("invoice", { inList: true })}${row("standup", { inList: true })}${row("renew", { inList: true })}</div>`) });

PAGES.expand = () => win({ hdr: hdr(), side: sidebar("today"), page: page(pbar("Today", "Thursday 12 November") + quickAdd() + `<div class="rlist">
  <div class="rgrp red">Overdue <span class="c">1</span></div>
  <div class="xrow"><div class="top"><span class="cbx"></span><div class="tt">Send invoice to Acme</div><span class="grow"></span>${icon("flag", "fl")}</div>
    <div class="nt">Net 30 · PDF in Mail</div>
    <div class="bar">${chip("Yesterday", "red", "calendar2")}${chip("10 min before", "", "bell")}${chip("High", "", "flag")}${chip("#billing", "acc")}${chip("Work", "", "listic")}${chip("3 subtasks", "", "listic")}${chip("Add a link", "", "link")}</div></div>
  <div class="rgrp">Today <span class="c">3</span></div>${row("standup")}${row("cleaning")}${row("mom")}
</div>`), over: idea("Idea · rows that open in place", "Instead of an inspector, a reminder expands where it is; each chip opens its own small picker. More room for the list, less for details.") });

PAGES.overview = () => win({ hdr: hdr(), side: sidebar("today"), page: page(pbar("Today", "Thursday 12 November") + `<div class="ov"><div class="c red"><b>1</b><span>Overdue</span></div><div class="c"><b>3</b><span>Due today · 1 done</span></div><div class="c"><b>2</b><span>Flagged</span></div></div><div class="dayline"><div></div></div>` + quickAdd() + `<div class="rlist">
  <div class="rgrp red">Overdue <span class="c">1</span></div>${row("invoice")}
  <div class="rgrp">Morning</div>${row("standup")}<div class="rgrp">Evening</div>${row("cleaning")}<div class="rgrp">Any time</div>${row("mom")}
</div>`), over: idea("Idea · a day at a glance", "Today opens with what's overdue, due and flagged, and groups the day by morning, evening and any time.") });

PAGES.before = () => `<div class="win">
  <header class="hdr"><div class="hdr-id">${icon("check-c", "app-ic")}<span class="app-name">Reminders</span><span class="app-sub" style="margin-left:8px">Today</span></div><div class="hdr-center"><div class="b-qa">${icon("plus")}<span>Add a reminder — “Call Sam tomorrow at 9”</span></div></div><div class="hdr-end">${ib("sliders")}</div></header>
  <aside class="side"><div class="side-scroll">
    <div class="search b-side-search">${icon("search")}<span>Find reminders (Ctrl+F)</span></div>
    <div class="grp first" style="color:var(--accent)">SMART LISTS</div>
    <div class="nav active">${icon("sun")}<span>Today</span><i class="cnt">4</i></div><div class="nav">${icon("calendar2")}<span>Scheduled</span><i class="cnt">9</i></div><div class="nav">${icon("star")}<span>Flagged</span><i class="cnt">2</i></div><div class="nav">${icon("inbox2")}<span>All</span><i class="cnt">12</i></div><div class="nav">${icon("check-c")}<span>Completed</span></div>
    <div class="grp">KEN@DESIGN-NEX.US ${icon("plus")}</div>
    <div class="nav"><span class="bdot" style="background:#3d8ae8"></span><span>Work</span>${icon("cloudoff")}</div><div class="nav"><span class="bdot" style="background:#f5875a"></span><span>Errands</span>${icon("cloudoff")}</div>
    <div class="grp">ON THIS COMPUTER</div><div class="nav"><span class="bdot" style="background:#59d45b"></span><span>Home</span><i class="cnt">3</i></div>
    <div class="nav" style="margin-top:20px">${icon("users")}<span>Online accounts</span></div>
    <div class="side-foot">12 reminders · 1 overdue · Offline</div>
  </div></aside>
  <main class="page" style="flex-direction:column"><div class="banner2 warn">${icon("cloudoff")}<div class="tx"><b>Offline</b></div></div><div style="display:flex;flex:1"><div style="flex:1">
    <div class="b-row"><span class="cbx"></span><div class="tx">Send invoice to Acme<div class="ln"><span style="color:var(--danger)">Yesterday</span> · Net 30 · #billing · Work</div></div><span class="pr">!!!</span></div>
    <div class="b-row"><span class="cbx"></span><div class="tx">Prepare stand-up notes<div class="ln">Today 9:30 ⟳ · Work</div></div><span class="pr">!</span></div>
    <div class="b-row"><span class="cbx"></span><div class="tx">Pick up dry cleaning<div class="ln">Today 18:00 · Errands</div></div>${icon("star")}</div>
  </div><div class="b-detail"><b>Send invoice to Acme</b><div class="l">DUE</div><span class="dd">Yesterday${icon("chev-d")}</span><div class="l">PRIORITY</div>${seg(["None", "Low", "Medium", "High"], "High")}<div class="l">MORE</div><span>Flagged ${sw(false)}</span><span class="grow"></span><span style="align-self:flex-end">${ib("trash")}</span></div></div></main>
</div>`;
