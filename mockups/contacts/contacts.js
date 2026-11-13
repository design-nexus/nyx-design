// Nyx Contacts mockups: sample people, lists and books, the window's parts and every screen.
"use strict";

/* ── Sample data ─────────────────────────────────────────────────────────── */
const SW = ["#3d8ae8", "#8b6cf0", "#c95fc6", "#f2655f", "#f5875a", "#eeb43f", "#59d45b", "#3cc4c9"];
// [first, last, sub, opts]: photo is an art class from mock.css; fav; book
const P = [
  ["Ada", "Okafor", "Product designer · Lumen Labs", { photo: "g3", fav: true }],
  ["Bea", "Lindqvist", "bea@lindqvist.example", { bday: true }],
  ["Ben", "Carter", "Carter & Sons", {}],
  ["Carlos", "Mendes", "carlos.mendes@fastmail.example", { photo: "g9" }],
  ["Chloé", "Martin", "Studio Martin", {}],
  ["Dev", "Patel", "Engineering lead · Lumen Labs", { fav: true }],
  ["Elena", "Rossi", "elena@rossi.example", { photo: "g6" }],
  ["Farah", "Haddad", "Haddad Architects", {}],
  ["Grace", "Kim", "grace.kim@uni.example", {}],
  ["Hiro", "Tanaka", "+81 90-1234-5678", { photo: "g16" }],
  ["Isla", "Murphy", "Book club", {}],
  ["Jonas", "Weber", "Weber Bikes", {}],
  ["Mara", "Silva", "mara@silva.example", { soon: true }],
  ["Olivia", "Chen", "Family", { fav: true, photo: "g14" }],
  ["Sam", "Rivera", "+1 555-987-6543", { dup: true }],
];
const initials = (f, l) => (f[0] + (l ? l[0] : "")).toUpperCase();
const colorOf = (name) => SW[[...name].reduce((a, c) => a + c.charCodeAt(0), 0) % SW.length];
function avatar(f, l, size, photo) {
  if (photo) return `<span class="avatar art ${photo}" style="width:${size}px;height:${size}px"></span>`;
  return `<span class="avatar" style="width:${size}px;height:${size}px;background:${colorOf(f + l)};font-size:${Math.round(size * 0.38)}px">${initials(f, l)}</span>`;
}

/* ── Window parts ───────────────────────────────────────────────────────── */
const hdr = (o = {}) => header({
  icon: "person", name: "Contacts",
  center: search(o.q ? `<span style="color:var(--text)">${o.q}</span>` : "Search people, companies, emails, phones", "Ctrl F", "wide " + (o.q ? "focus" : "")),
  end: `<button class="newbtn">${icon("plus")}<span>New</span><span class="key">Ctrl N</span></button>`,
});

function sidebar(active, o = {}) {
  return `
    ${navx("people", "All contacts", { active: active === "all", cnt: 214 })}
    ${navx("star", "Favorites", { active: active === "fav", cnt: 3 })}
    ${grp("Lists", false, icon("plus"), "accent")}
    ${navx("", "Family", { dot: SW[1], cnt: 6, active: active === "family" })}
    ${navx("", "Book club", { dot: SW[4], cnt: 9, active: active === "club" })}
    ${navx("", "Work", { dot: SW[0], cnt: 23, active: active === "work" })}
    ${grp("Accounts", false, "", "green")}
    ${navx("cloud", "Fastmail", { sub: o.syncing ? "syncing…" : "", cnt: o.syncing ? undefined : 162, active: active === "fastmail" })}
    ${navx("lock", "Google", { sub: "read only", active: active === "google" })}
    ${navx("drive", "On this computer", { cnt: 52, active: active === "local" })}
    ${grp("Tidy up", false, "", "violet")}
    ${navx("cake", "Birthdays", { sub: "next 30 days", cnt: 2, active: active === "bdays" })}
    ${navx("merge", "Duplicates", { badge: 1, active: active === "dups" })}
    <div class="foot">${o.syncing ? `${icon("sync")}<span>Syncing Fastmail…</span>` : `${icon("check-c", "ok")}<span>All accounts up to date</span>`}</div>`;
}

function listCol(title, n, people, o = {}) {
  let last = "";
  const rows = people.map(([f, l, sb, x], i) => {
    const L = f[0];
    const head = o.letters !== false && L !== last ? `<div class="letter">${(last = L)}</div>` : "";
    const sel = o.sel?.includes(i) ? "sel" : "";
    return `${head}<div class="crow ${sel} ${o.hover === i ? "hover" : ""}">${o.checks ? `<span class="cbx sq ${sel ? "done" : ""}">${sel ? icon("check") : ""}</span>` : ""}${avatar(f, l, 32, x.photo)}<div class="tx"><div class="nm">${f} ${l}</div><div class="sb">${sb}</div></div>${x.fav ? icon("star", "st") : ""}</div>`;
  }).join("");
  return `<div class="list"><div class="lhead"><b>${title}</b><span class="n">${n}</span><span class="sp"></span><span class="dd">${o.sort || "First name"}${icon("chev-d")}</span>${o.menu ? ib("more", "List actions", "on") : ""}</div><div class="clist">${rows}</div></div>`;
}

function fields(o = {}) {
  const fr = (fl, fv, acts, hover) => `<div class="frow ${hover ? "hover" : ""}"><span class="fl">${fl}</span><div class="fv">${fv}</div><div class="ha">${acts.map((a) => ib(a)).join("")}</div></div>`;
  return `
    <div class="dsec"><div class="fcard">
      ${fr("work", '<a>ada@lumen.example</a>', ["copy", "mail"], o.hover)}
      ${fr("home", '<a>ada.okafor@fastmail.example</a>', ["copy", "mail"])}
    </div></div>
    <div class="dsec"><div class="fcard">
      ${fr("cell", "+1 555-123-4567", ["copy", "phone", "chat"])}
      ${fr("work", "+1 555-410-2200 ext. 31", ["copy", "phone"])}
    </div></div>
    <div class="dsec"><div class="fcard">
      ${fr("work", '1 Main St, Springfield, IL 62701<div class="d">USA</div>', ["copy", "mapin"])}
    </div></div>
    <div class="dsec"><div class="fcard">
      ${fr("birthday", '12 April 1985<div class="d">Turns 41 in 5 months</div>', ["calendar2"])}
      ${fr("website", "<a>lumen.example/ada</a>", ["copy", "external"])}
    </div></div>
    <div class="dsec"><div class="lab">Lists</div><div class="lchips">${chip("Work", "", "")}${chip("Book club", "", "")}${chip("Add to a list", "acc", "plus")}</div></div>
    <div class="dsec"><div class="lab">Notes</div><div class="fcard note">Met at the Lumen design review. Prefers email before 10.<br>Kids: Tomi and Ife.</div></div>`;
}

function details(o = {}) {
  const where = o.ro ? `${icon("lock")}Google · read only` : `${icon("cloud")}Fastmail`;
  return `<div class="dmain"><div class="dscroll"><div class="dclamp">
    <div class="dhead">${avatar("Ada", "Okafor", 88, "g3")}<div class="nm">Ada Okafor ${icon("star")}</div><div class="ttl">Product designer · Lumen Labs</div><div class="where">${where}</div>
      <div class="cacts"><div class="cact">${icon("mail")}Email</div><div class="cact">${icon("phone")}Call</div><div class="cact">${icon("chat")}Message</div><div class="cact ${o.ro ? "off" : ""}">${icon("rename")}Edit</div><div class="cact">${icon("more")}More</div></div></div>
    ${fields(o)}
  </div></div></div>`;
}

function editor(o = {}) {
  const er = (lbl, val, ph) => `<div class="erow"><span class="lbl">${lbl}${icon("chev-d")}</span><div class="field">${val ? `<span>${val}</span>` : `<span class="ph">${ph}</span>`}</div><span class="rm">${icon("x")}</span></div>`;
  const add = (t) => `<div class="erow add">${icon("plus")}<span>${t}</span></div>`;
  const nf = (ph, v) => `<div class="field">${v ? `<span>${v}</span>` : `<span class="ph">${ph}</span>`}</div>`;
  const isNew = o.isNew;
  return `<div class="dmain"><div class="dscroll"><div class="dclamp">
    <div class="ehead"><div class="photo">${isNew ? `<span class="avatar" style="width:88px;height:88px;background:var(--field);color:var(--text-tertiary)">${icon("person")}</span>` : avatar("Ada", "Okafor", 88, "g3")}<span class="cam">${icon("image")}</span></div>
      <div class="names">${nf("First name", isNew ? "" : "Ada")}${nf("Last name", isNew ? "" : "Okafor")}${nf("Company", isNew ? "" : "Lumen Labs")}${nf("Job title", isNew ? "" : "Product designer")}<span class="more">${icon("chev-d")}More name fields (middle, prefix, suffix, shown as)</span></div></div>
    <div class="dsec"><div class="lab">Email</div><div class="fcard">${isNew ? er("home", "", "name@example.com") : er("work", "ada@lumen.example") + er("home", "ada.okafor@fastmail.example")}${add("Add an email")}</div></div>
    <div class="dsec"><div class="lab">Phone</div><div class="fcard">${isNew ? add("Add a phone") : er("cell", "+1 555-123-4567") + add("Add a phone")}</div></div>
    <div class="dsec"><div class="lab">More</div><div class="fcard">
      <div class="erow"><span class="lbl">birthday${icon("chev-d")}</span><div class="field ${o.date ? "focus" : ""}">${icon("calendar2")}<span${isNew ? ' class="ph"' : ""}>${isNew ? "Add a birthday" : "12 April 1985"}</span></div><span class="rm">${icon("x")}</span></div>
      ${add("Add an address")}${add("Add a website")}</div></div>
    <div class="dsec"><div class="lab">Lists</div><div class="lchips">${isNew ? chip("Work", "on") + chip("Added because Work is open", "") : chip("Work", "on") + chip("Book club", "on")}${chip("Family", "")}</div></div>
  </div></div><div class="ebar"><span class="s">${isNew ? "New contact in On this computer" : "Editing · Fastmail"}</span><span class="grow"></span>${isNew ? "" : btn("Delete", "dtext", "trash2")}${btn("Cancel", "ghost")}${btn(isNew ? "Add contact" : "Save", "primary")}</div></div>`;
}

const page = (list, main) => `<div class="cols">${list}${main}</div>`;
const sorted = P.slice().sort((a, b) => a[0].localeCompare(b[0]));

/* ── Screens ────────────────────────────────────────────────────────────── */
PAGES.all = () => win({ hdr: hdr(), side: sidebar("all"), page: page(listCol("All contacts", 214, sorted, { sel: [0] }), details()) });
PAGES.detail = () => win({ hdr: hdr(), side: sidebar("all"), page: page(listCol("All contacts", 214, sorted, { sel: [0] }), details({ hover: true })) });
PAGES.edit = () => win({ hdr: hdr(), side: sidebar("all"), page: page(listCol("All contacts", 214, sorted, { sel: [0] }), editor({ date: true })),
  over: `<div class="datepop pop" style="top:500px;left:760px"><div class="mh2">${icon("chev-l")}<span>April 1985</span>${icon("chev-r")}</div><div class="g">${["M", "T", "W", "T", "F", "S", "S"].map((d) => `<span class="h">${d}</span>`).join("")}${[...Array(30)].map((_, i) => `<span class="${i + 1 === 12 ? "on" : ""}">${i + 1}</span>`).join("")}</div><div class="yr"><span>Year</span><span class="dd">1985${icon("chev-d")}</span><span>No year</span></div></div>` });
PAGES.new = () => win({ hdr: hdr(), side: sidebar("work"), page: page(listCol("Work", 23, sorted.filter((p) => /Lumen|Weber|Haddad|Carter/.test(p[2]))), editor({ isNew: true })) });

PAGES.select = () => win({ hdr: hdr(), side: sidebar("all"), page: page(listCol("All contacts", 214, sorted, { sel: [1, 3, 4], checks: true }), `<div class="dmain"><div class="empty2">${icon("people")}<b>3 contacts selected</b><span>Choose what to do with them below, or Ctrl-click to add more.</span></div></div>`),
  over: `<div class="selbar"><b>3 selected</b>${btn("Add to list", "", "plus")}${btn("Email", "", "mail")}${btn("Export", "", "export")}${btn("Delete", "dtext", "trash2")}${ib("close", "Clear the selection")}</div>` });

PAGES.listmenu = () => win({ hdr: hdr(), side: sidebar("club"), page: page(listCol("Book club", 9, sorted.filter((p, i) => i % 2 === 0), { menu: true, sel: [0] }), details()),
  over: `<div class="menu pop" style="top:126px;left:412px">
    <div class="mi">${icon("mail")}<span>Email everyone</span></div>
    <div class="mi">${icon("export")}<span>Export this list…</span></div>
    <div class="ms"></div>
    <div class="mi hover">${icon("rename")}<span>Rename…</span></div>
    <div class="mi">${icon("palette")}<span>Colour</span>${icon("chev-r", "chev")}</div>
    <div class="ms"></div>
    <div class="mi danger">${icon("trash2")}<span>Delete this list</span></div>
    <div class="mh" style="font-weight:400">Its people stay in your contacts</div>
  </div>` });

PAGES.bdays = () => win({ hdr: hdr(), side: sidebar("bdays"), page: `<div class="dmain"><div class="pbar"><span class="t">Birthdays</span><span class="s">2 in the next 30 days</span><span class="sp"></span>${btn("Add to Calendar", "", "calendar2")}</div><div class="dscroll"><div class="dclamp">
  <div class="bmonth">November</div><div class="fcard">
    <div class="brow today">${avatar("Bea", "Lindqvist", 34)}<div class="tx">Bea Lindqvist<span>Turns 34</span></div><span class="when">Today</span>${btn("Message", "sm", "chat")}</div>
    <div class="brow">${avatar("Mara", "Silva", 34)}<div class="tx">Mara Silva<span>Turns 29</span></div><span class="when">Mon 17 · in 5 days</span></div></div>
  <div class="bmonth">December</div><div class="fcard">
    <div class="brow">${avatar("Hiro", "Tanaka", 34, "g16")}<div class="tx">Hiro Tanaka<span>Turns 52</span></div><span class="when">Thu 4 · in 22 days</span></div>
    <div class="brow">${avatar("Olivia", "Chen", 34, "g14")}<div class="tx">Olivia Chen<span>No year</span></div><span class="when">Sat 20 · in 38 days</span></div></div>
  <div class="bmonth">January</div><div class="fcard">
    <div class="brow">${avatar("Dev", "Patel", 34)}<div class="tx">Dev Patel<span>Turns 41</span></div><span class="when">Tue 6 · in 55 days</span></div></div>
</div></div></div>` });

PAGES.dups = () => win({ hdr: hdr(), side: sidebar("dups"), page: `<div class="dmain"><div class="pbar"><span class="t">Duplicates</span><span class="s">1 pair · the same phone number</span><span class="sp"></span>${btn("Not the same person", "ghost")}${btn("Merge", "primary", "merge")}</div><div class="dscroll"><div class="dclamp" style="max-width:720px">
  <div class="dup">
    <div class="hd"></div>
    <div class="hd">${avatar("Sam", "Rivera", 40)}<b>Sam Rivera</b><span class="k">On this computer · added 2021</span></div>
    <div class="hd">${avatar("Sam", "Rivera", 40, "g12")}<b>Samuel Rivera</b><span class="k">Fastmail · added last week</span></div>
    <div class="k">Name</div><div><span class="pick"></span>Sam Rivera</div><div><span class="pick on"></span>Samuel Rivera</div>
    <div class="k">Photo</div><div><span class="pick"></span><span class="same">None</span></div><div><span class="pick on"></span>Their photo</div>
    <div class="k">Phone</div><div>555-987-6543</div><div>+1 555-987-6543<span class="both">same number · kept once</span></div>
    <div class="k">Email</div><div>sam@rivera.example</div><div>samuel.rivera@work.example<span class="both">both kept</span></div>
    <div class="k">Company</div><div><span class="pick on"></span>Rivera Builds</div><div><span class="pick"></span><span class="same">None</span></div>
    <div class="k">Lists</div><div>Family</div><div><span class="same">None</span><span class="both">kept</span></div>
  </div>
  <p style="color:var(--text-tertiary);margin-top:12px">Values that differ are yours to choose; every email, phone and list is kept. Merge can be undone.</p>
</div></div></div>` });

PAGES.import = () => win({ hdr: hdr(), side: sidebar("all"), page: page(listCol("All contacts", 214, sorted, {}), `<div class="dmain"></div>`),
  over: `<div class="veil"><div class="dlg pop" style="width:520px">
    <div class="h">Import 6 contacts from team.vcf</div><p>Into <span class="dd" style="display:inline-flex;height:24px">On this computer${icon("chev-d")}</span> · 2 update people you have · 1 looks like a duplicate</p>
    <div class="fcard" style="margin-top:14px">
      <div class="irow"><span class="cbx sq done">${icon("check")}</span>${avatar("Kai", "Nakamura", 28)}<div class="tx">Kai Nakamura<span>kai@lumen.example</span></div></div>
      <div class="irow"><span class="cbx sq done">${icon("check")}</span>${avatar("Leo", "Fischer", 28)}<div class="tx">Leo Fischer<span>+49 30 1234567</span></div></div>
      <div class="irow"><span class="cbx sq done">${icon("check")}</span>${avatar("Dev", "Patel", 28)}<div class="tx">Dev Patel<span>adds a work phone</span></div><span class="tag2 upd">updates</span></div>
      <div class="irow"><span class="cbx sq done">${icon("check")}</span>${avatar("Ada", "Okafor", 28, "g3")}<div class="tx">Ada Okafor<span>new job title</span></div><span class="tag2 upd">updates</span></div>
      <div class="irow off"><span class="cbx sq"></span>${avatar("Sam", "Rivera", 28)}<div class="tx">Sam Rivera<span>same phone as Sam Rivera</span></div><span class="tag2 dup2">duplicate?</span></div>
      <div class="irow"><span class="cbx sq done">${icon("check")}</span>${avatar("Priya", "Shah", 28)}<div class="tx">Priya Shah<span>priya@shah.example</span></div></div>
    </div>
    <div class="bt">${btn("Cancel", "ghost")}${btn("Import 5", "primary")}</div></div></div>` });

PAGES.online = () => win({ hdr: hdr(), side: sidebar("google", { syncing: true }), page: `<div class="cols"><div class="list" style="display:flex;flex-direction:column"><div class="banner2" style="margin:10px">${icon("lock")}<div class="tx"><b>Google is read only</b><span>Copy someone to On this computer to change them.</span></div></div>${listCol("Google", 41, sorted.slice(0, 9), { sel: [0] }).replace('<div class="list">', "").replace(/<\/div>$/, "")}</div>${details({ ro: true })}</div>` });

PAGES.empty = () => win({ hdr: hdr(), side: sidebar("local"), page: `<div class="dmain"><div class="empty2">${icon("addperson")}<b>No contacts on this computer yet</b><span>Add someone, or bring your contacts in from a vCard or CSV file. Contacts in your accounts show under Accounts.</span><div class="bts">${btn("New contact", "primary", "plus")}${btn("Import…", "", "import")}</div></div></div>` });

PAGES.favgrid = () => win({ hdr: hdr(), side: sidebar("fav"), page: `<div class="dmain"><div class="pbar"><span class="t">Favorites</span><span class="s">3 people</span></div><div class="fgrid">
  ${[["Ada", "Okafor", "Lumen Labs", "g3"], ["Dev", "Patel", "Lumen Labs", ""], ["Olivia", "Chen", "Family", "g14"]].map(([f, l, s, ph]) => `<div class="fcard2">${avatar(f, l, 64, ph)}<b>${f} ${l}</b><span>${s}</span><div class="mini">${ib("mail")}${ib("phone")}${ib("chat")}</div></div>`).join("")}
  <div class="fcard2" style="justify-content:center;color:var(--text-tertiary);box-shadow:inset 0 0 0 1px var(--hair);background:transparent">${icon("plus")}<span>Star someone to add them here</span></div>
</div></div>`, over: idea("Idea · Favorites as cards", "The people you reach most, one click from Email, Call or Message.") });

PAGES.before = () => `<div class="win">
  <header class="hdr"><div class="hdr-id">${icon("person", "app-ic")}<span class="app-name">Contacts</span><span class="app-sub" style="margin-left:8px">All contacts</span></div><div class="hdr-start">${ib("sidebar")}</div><div class="hdr-center">${search("Search contacts (Ctrl+F)", "")}</div><div class="hdr-end">${ib("rename")}${ib("more", "", "on")}${ib("addperson", "", "primary")}${ib("sliders")}</div></header>
  <aside class="side"><div class="side-scroll">
    <div class="grp first" style="color:var(--accent)">CONTACTS</div><div class="nav active">${icon("people")}<span>All contacts</span><i class="cnt">214</i></div><div class="nav">${icon("star")}<span>Favorites</span><i class="cnt">3</i></div><div class="nav">${icon("cake")}<span>Birthdays</span><i class="cnt">2</i></div><div class="nav">${icon("merge")}<span>Duplicates</span><i class="cnt">1</i></div>
    <div class="grp">LISTS</div><div class="nav">${icon("listic")}<span>Family</span><i class="cnt">6</i></div><div class="nav">${icon("listic")}<span>Book club</span><i class="cnt">9</i></div>
    <div class="grp">ONLINE</div><div class="nav">${icon("cloud")}<span>Fastmail</span></div><div class="nav">${icon("plus")}<span>New list</span></div>
    <div class="side-foot">214 contacts · 0 selected</div>
  </div></aside>
  <main class="page" style="flex-direction:row"><div class="b-list">${sorted.slice(0, 11).map(([f, l, s], i) => `<div class="b-row ${i === 0 ? "sel" : ""}">${f} ${l}<span>${s}</span></div>`).join("")}</div>
  <div class="b-det"><div style="display:flex;gap:12px;align-items:center">${avatar("Ada", "Okafor", 48, "g3")}<div><b>Ada Okafor</b><div style="color:var(--dim-text)">Product designer · Lumen Labs</div></div></div><div style="margin-top:8px">${ib("star")}${ib("rename")}</div>
    <div class="g">EMAIL</div><div class="r"><div class="grow">ada@lumen.example<span>work</span></div>${ib("copy")}${ib("mail")}</div><div class="r"><div class="grow">ada.okafor@fastmail.example<span>home</span></div>${ib("copy")}${ib("mail")}</div>
    <div class="g">PHONE</div><div class="r"><div class="grow">+1 555-123-4567<span>cell</span></div>${ib("copy")}${ib("phone")}</div>
    <div class="g" style="margin-top:20px">BIRTHDAY</div><div>1985-04-12</div><div class="g">LISTS</div><div>Work, Book club</div></div></main>
  <div class="b-menu pop">${["Merge exact duplicates", "Import contacts…", "Export selected / view as vCard…", "Export selected / view as CSV…", "Add selected to list…", "Remove selected from this list", "Delete selected", "Rename this list…", "Delete this list", "Email this list"].map((t) => `<div>${t}</div>`).join("")}</div>
</div>`;
