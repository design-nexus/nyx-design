// Nyx Files on the revamp page: today's problems and three options.
(() => {
  // Kinds of item: [icon, colour, label]
  const K = {
    folder: ["folder-fill", "var(--accent)", "Folder"],
    pdf: ["file-text", "var(--sw-red)", "PDF document"],
    sheet: ["fsheet", "var(--sw-green)", "Spreadsheet"],
    img: ["image", "var(--sw-teal)", "Image"],
    doc: ["file-text", "var(--sw-blue)", "Word document"],
    text: ["file", "var(--dim-text)", "Text"],
    zip: ["archive", "var(--sw-coral)", "Archive"],
    video: ["film", "var(--sw-violet)", "Video"],
    audio: ["music", "var(--sw-pink)", "Audio"],
  };
  const fic = (k, cls = "") => `<span class="fic ${cls}" style="--fc:${K[k][1]}">${icon(K[k][0])}</span>`;

  const ITEMS = [
    ["folder", "Invoices", "24 items", "Today 09:12"],
    ["folder", "Menu photos", "48 items", "Yesterday"],
    ["folder", "Website", "11 items", "Oct 30"],
    ["pdf", "Spring menu.pdf", "2.4 MB", "Today 10:41"],
    ["sheet", "Price list 2026.xlsx", "86 KB", "Today 08:55"],
    ["img", "Shop floor plan.png", "1.1 MB", "Nov 9"],
    ["img", "Logo.svg", "14 KB", "Nov 2"],
    ["doc", "Supplier letter.docx", "42 KB", "Nov 1"],
    ["text", "Opening hours.txt", "1 KB", "Oct 28"],
    ["zip", "Contracts 2025.zip", "18.6 MB", "Oct 20"],
    ["video", "Welcome video.mp4", "212 MB", "Oct 14"],
    ["audio", "Shop jingle.mp3", "3.2 MB", "Oct 3"],
    ["sheet", "Staff rota.ods", "31 KB", "Sep 29"],
    ["text", "Notes for Sam.md", "4 KB", "Sep 12"],
  ];

  const vseg = (on) => `<div class="seg icons">${[["list", "List"], ["grid", "Icons"], ["columns", "Columns"]].map(([i, t]) => `<button class="${i === on ? "on" : ""}" title="${t}">${icon(i)}</button>`).join("")}</div>`;
  const crumbs = (parts) => `<div class="crumbs">${parts.map((p, i) => i === parts.length - 1 ? `<b>${p}</b>` : `<span class="${i < parts.length - 2 ? "far" : ""}">${p}</span>${icon("chev-r", i < parts.length - 2 ? "far" : "")}`).join("")}</div>`;
  const navbtns = (back = true) => `<span class="fnav">${ib("chev-l", "Back (Alt+←)", back ? "" : "off")}${ib("chev-r", "Forward (Alt+→)", "off")}${ib("chev-u", "Enclosing folder (Alt+↑)")}</span>`;
  const hdr = (o = {}) => header({
    icon: "folder", name: "Files",
    start: navbtns() + crumbs(o.path || ["Home", "Documents", "Lumen Bakery"]),
    center: o.center !== undefined ? o.center : search(o.q || "Search Home and drives", "Ctrl K"),
    end: `${o.view === false ? "" : vseg(o.view || "list")}<button class="newbtn">${icon("folder-plus")}<span>New</span>${icon("chev-d", "dd-chev")}</button>`,
  });

  const tabs = (on = 0) => `<div class="tabs">${[["folder", "Lumen Bakery"], ["download", "Downloads"], ["cloud", "Google Drive"]].map(([i, t], n) => `<div class="tab ${n === on ? "on" : ""}">${icon(i)}<span class="tt">${t}</span>${n === on ? `<span class="x">${icon("x")}</span>` : ""}</div>`).join("")}<span class="plus" title="New tab (Ctrl+T)">${icon("plus")}</span></div>`;

  /* ── Option A: tidy explorer ─────────────────────────────────────────── */
  const sideA = (on = "lumen", o = {}) => `
    ${o.noTiles ? navx("clock", "Recent") + navx("download", "Downloads") + navx("trash", "Trash") : tiles([["recent", "clock", 18, "Recent", "blue"], ["dl", "download", 6, "Downloads", "green"], ["net", "network", 2, "Network", "teal"], ["trash", "trash", 12, "Trash", "graphite"]], on)}
    ${grp("Places", false, "", "accent")}
    ${navx("home", "Home")}
    ${navx("monitor", "Desktop")}
    ${navx("file-text", "Documents")}
    ${navx("image", "Pictures")}
    ${navx("music", "Music")}
    ${navx("film", "Videos")}
    ${grp("Pinned", false, icon("plus"), "green")}
    ${navx("folder", "Lumen Bakery", { active: on === "lumen" })}
    ${navx("folder", "Tax 2026")}
    ${navx("folder", "Lisbon trip")}
    ${grp("Cloud", false, "", "violet")}
    ${navx("cloud", "Google Drive", { sub: "Synced" })}
    ${grp("Devices", false, "", "amber")}
    ${navx("drive", "System", { sub: "212 GB free" })}
    <div class="navx">${icon("usb")}<span>Backup drive</span><span class="ej" title="Eject">${icon("eject")}</span></div>`;

  const table = (o = {}) => {
    const rows = (o.items || ITEMS).map(([k, n, s, m], i) => `<div class="frow ${i === (o.sel ?? 3) ? "sel" : ""} ${o.multi && o.multi.includes(i) ? "sel" : ""}">${fic(k)}<span class="n">${n}</span><span class="s">${s}</span><span class="m">${m}</span><span class="k wide-only">${K[k][2]}</span></div>`).join("");
    return `<div class="ftbl"><div class="fth"><span class="n">Name ${icon("chev-u", "si")}</span><span class="s">Size</span><span class="m">Modified</span><span class="k wide-only">Kind</span></div><div class="fbody">${rows}</div></div>`;
  };
  const status = (left, right = "212 GB free on System") => `<div class="fstatus"><span>${left}</span><span class="sp"></span><span>${right}</span></div>`;

  const pdfPage = (big) => `<div class="pdfpg ${big ? "big" : ""}"><b>Lumen Bakery</b><i>Spring menu</i><div class="ln w8"></div><div class="ln w6"></div><div class="ln w7"></div><div class="dots"><span></span><span></span></div><div class="ln w5"></div><div class="ln w8"></div><div class="ln w6"></div></div>`;

  const previewPanel = () => `<div class="insp fprev">
    <div class="pv">${pdfPage(true)}<span class="pg">Page 1 of 2</span></div>
    <div class="pvn"><b>Spring menu.pdf</b><span>PDF document · 2.4 MB</span></div>
    <div class="pva">${btn("Open", "primary", "external")}${btn("Open with…", "", "fapps")}${ib("more", "More")}</div>
    <div class="ibody">
      <div class="card">
        <div class="row"><span class="k">Modified</span><span class="v">Today 10:41</span></div>
        <div class="row"><span class="k">Created</span><span class="v">Nov 3</span></div>
        <div class="row"><span class="k">Where</span><span class="v">Lumen Bakery</span></div>
        <div class="row"><span class="k">Permissions</span><span class="v"><span class="mode">rw-r--r--</span></span></div>
      </div>
    </div></div>`;

  const pageA = (o = {}) => `${tabs()}<div class="cols"><div class="main">${table(o)}${status(o.narrow ? "14 items · 1 selected" : "14 items · 1 selected, 2.4 MB")}</div>${o.noPrev ? "" : previewPanel()}</div>`;

  const ctxMenu = () => `<div class="menu pop fmenu" style="left:440px;top:208px;width:268px">
    <div class="mi hover">${icon("external")}<span>Open</span><span class="k">Enter</span></div>
    <div class="mi">${icon("fapps")}<span>Open with</span>${icon("chev-r", "chev")}</div>
    <div class="mi">${icon("eye")}<span>Quick preview</span><span class="k">Space</span></div>
    <div class="ms"></div>
    <div class="mrow3"><span>${icon("fcut")}Cut</span><span>${icon("copy")}Copy</span><span>${icon("rename")}Rename</span></div>
    <div class="ms"></div>
    <div class="mi">${icon("fmove")}<span>Move or copy to…</span></div>
    <div class="mi">${icon("archive")}<span>Compress…</span></div>
    <div class="mi">${icon("send")}<span>Send to</span>${icon("chev-r", "chev")}</div>
    <div class="mi">${icon("terminal")}<span>Your actions</span>${icon("chev-r", "chev")}</div>
    <div class="ms"></div>
    <div class="mi">${icon("pin")}<span>Pin to sidebar</span></div>
    <div class="mi">${icon("palette")}<span>Colour and icon…</span></div>
    <div class="mi">${icon("info")}<span>Properties</span><span class="k">Alt Enter</span></div>
    <div class="ms"></div>
    <div class="mi danger">${icon("trash")}<span>Move to Trash</span><span class="k">Del</span></div>
  </div>`;

  /* ── Option B: a home to start from ──────────────────────────────────── */
  const sideB = (on = "home") => `
    ${navx("home", "Overview", { active: on === "home" })}
    ${navx("clock", "Recent", { cnt: 18 })}
    ${navx("star", "Pinned", { cnt: 3 })}
    ${grp("Folders", false, "", "accent")}
    ${navx("home", "Home")}
    ${navx("monitor", "Desktop")}
    ${navx("file-text", "Documents")}
    ${navx("download", "Downloads", { badge: 6 })}
    ${navx("image", "Pictures", { active: on === "pics" })}
    ${navx("music", "Music")}
    ${navx("film", "Videos")}
    ${grp("Storage", false, "", "violet")}
    ${navx("drive", "System")}
    ${navx("usb", "Backup drive")}
    ${navx("cloud", "Google Drive")}
    ${navx("network", "Network")}
    ${navx("trash", "Trash", { cnt: 12 })}`;

  const recentCard = (kind, name, when, seed) => `<div class="rcard"><div class="th">${kind === "img" ? art(seed, { r: 0 }) : kind === "pdf" ? `<div class="thdoc">${pdfPage()}</div>` : `<div class="thdoc ic">${fic(kind, "lg")}</div>`}</div><div class="rb"><b>${name}</b><span>${when}</span></div></div>`;
  const pinCard = (name, sub, c) => `<div class="pcard">${fic("folder", "md")}<div><b>${name}</b><span>${sub}</span></div></div>`;
  const store = (ic, name, sub, pct, end = "", c = "") => `<div class="scard2"><div class="r1">${icon(ic)}<b>${name}</b><span class="sp"></span>${end}</div>${prog(pct, c)}<span class="sub">${sub}</span></div>`;

  const home = (narrow) => `<div class="fhome"><div class="clamp" style="--clamp: 940px">
    <div class="sechead">Recent<span class="more">Show all</span></div>
    <div class="rgrid">
      ${recentCard("pdf", "Spring menu.pdf", "Edited today, 10:41")}
      ${recentCard("img", "Shop window.jpg", "Added today, 09:30", "shopwin")}
      ${recentCard("sheet", "Price list 2026.xlsx", "Edited today, 08:55")}
      ${recentCard("img", "Tram 28.jpg", "Yesterday", "tram28x")}
      ${narrow ? "" : recentCard("doc", "Supplier letter.docx", "Nov 1")}
    </div>
    <div class="sechead">Pinned<span class="more">Edit</span></div>
    <div class="pgrid">
      ${pinCard("Lumen Bakery", "14 items · Documents")}
      ${pinCard("Tax 2026", "32 items · Documents")}
      ${pinCard("Lisbon trip", "212 photos · Pictures")}
    </div>
    <div class="sechead">Storage</div>
    <div class="sgrid">
      ${store("drive", "System", "212 GB free of 512 GB", 58)}
      ${store("usb", "Backup drive", "640 GB free of 1 TB · USB", 36, btn("Eject", "sm", "eject"))}
      ${store("cloud", "Google Drive", "5.9 GB free of 15 GB · Synced", 61)}
    </div>
    <div class="sechead">New in Downloads<span class="more">Open Downloads</span></div>
    <div class="dlist">${[["pdf", "Boarding pass LIS.pdf", "220 KB · 12 min ago"], ["zip", "Font pack.zip", "8.4 MB · 1 h ago"], ["img", "Receipt scan.png", "640 KB · Yesterday"], ["sheet", "Bank export Nov.csv", "12 KB · Yesterday"]].slice(0, narrow ? 2 : 4).map(([k, n, s]) => `<div class="drow">${fic(k)}<div><b>${n}</b><span>${s}</span></div></div>`).join("")}</div>
    <div class="trashline">${icon("trash")}<span><b>Trash</b> · 12 items, 340 MB</span><span class="sp"></span>${btn("Open", "ghost")}${btn("Empty Trash…", "dtext")}</div>
  </div></div>`;

  const homeHdr = () => header({ icon: "folder", name: "Files", start: navbtns(false), center: search("Search Home and drives", "Ctrl K", "wide"), end: `<button class="newbtn">${icon("folder-plus")}<span>New</span>${icon("chev-d", "dd-chev")}</button>` });

  const PICS = ["Tram 28", "Alfama roofs", "Pastéis", "Belém tower", "Miradouro", "Tiles", "LX Factory", "Sunset bridge", "Market", "Ferry", "Sintra", "Night walk", "Yellow door", "Fado bar", "Cais do Sodré", "Azulejo 2", "Castle walls", "Rooftop", "Bookshop", "River", "Bica lift", "Graffiti", "Lighthouse", "Breakfast"];
  const grid = () => `${pbar2("Lisbon trip", "212 photos", `<span class="tsize">${icon("image", "s")}<span class="slider" style="width:96px"><span class="tr"><span class="fill" style="width:55%"></span></span><span class="kn" style="left:55%"></span></span>${icon("image", "l")}</span>${dd("Date taken", "sort")}`)}
    <div class="scroll"><div class="pics">${PICS.map((p, i) => `<div class="pic ${[1, 2, 5, 9].includes(i) ? "sel" : ""}">${art("lx" + p, { r: 8 })}<span>${p}.jpg</span>${[1, 2, 5, 9].includes(i) ? `<i class="tick">${icon("check")}</i>` : ""}</div>`).join("")}</div></div>
    <div class="selbar pop"><b>4 selected</b><span class="d">18.2 MB</span><span class="vr"></span>${btn("Copy", "ghost", "copy")}${btn("Move to…", "ghost", "fmove")}${btn("Compress", "ghost", "archive")}${btn("Send to", "ghost", "send")}${btn("Move to Trash", "ghost dtext", "trash")}<span class="vr"></span>${ib("x", "Clear selection (Esc)")}</div>`;

  const RESULTS = [
    ["pdf", "Invoice 2291 — Acme Flour.pdf", "Documents › Lumen Bakery › Invoices", "Today"],
    ["pdf", "Invoice 2290 — Northfield Dairy.pdf", "Documents › Lumen Bakery › Invoices", "Yesterday"],
    ["sheet", "Invoices 2026.xlsx", "Documents › Tax 2026", "Nov 8"],
    ["folder", "Invoices", "Documents › Lumen Bakery", "Today"],
    ["pdf", "Invoice template.pdf", "Google Drive › Templates", "Oct 2"],
    ["zip", "Old invoices 2023.zip", "Backup drive › Archive", "Mar 2024"],
  ];
  const searchPage = () => `<div class="cols"><div class="main">
    <div class="sbar2"><div><b>6 results for “invoice”</b><span>Names and text inside documents</span></div><span class="sp"></span>${seg(["This folder", "Home", "Everywhere"], "Everywhere")}</div>
    <div class="chips">${chip("Any kind", "on", "filter")}${chip("Documents", "", "file-text")}${chip("Images", "", "image")}${chip("Any time", "", "clock")}${chip("Include hidden files")}</div>
    <div class="scroll res">${RESULTS.map(([k, n, w, t], i) => `<div class="rrow ${i === 0 ? "sel" : ""}">${fic(k)}<div class="tx"><b>${n.replace(/invoice/i, (m) => `<mark>${m}</mark>`)}</b><span>${w}</span></div><span class="t">${t}</span></div>`).join("")}
      <div class="rnote">${icon("info")} Searched Home, the Backup drive and Google Drive in 0.4 s. Folders you excluded in Settings › Search are skipped.</div>
    </div></div>
    <div class="insp fprev">
      <div class="pv"><div class="pdfpg big inv"><b>INVOICE 2291</b><i>Acme Flour Co.</i><div class="ln w8"></div><div class="ln w6"></div><div class="tblk"><span></span><span></span><span></span></div><div class="ln w5"></div><div class="tot">$1,284.00</div></div></div>
      <div class="pvn"><b>Invoice 2291 — Acme Flour.pdf</b><span>PDF document · 180 KB</span></div>
      <div class="pva">${btn("Open", "primary", "external")}${btn("Show in folder", "", "folder")}${ib("more", "More")}</div>
      <div class="ibody"><div class="card">
        <div class="row"><span class="k">Modified</span><span class="v">Today 07:58</span></div>
        <div class="row"><span class="k">Where</span><span class="v">Lumen Bakery › Invoices</span></div>
      </div></div>
    </div></div>`;

  /* ── Option C: columns and an inspector ───────────────────────────────── */
  const col = (rows, active, w = 214) => `<div class="fcol" style="width:${w}px">${rows.map(([k, n, x], i) => `<div class="crow3 ${i === active ? (x === "on" ? "on" : "path") : ""}">${fic(k)}<span class="n">${n}</span>${k === "folder" ? icon("chev-r", "cv") : ""}</div>`).join("")}</div>`;
  const colsC = (narrow) => `<div class="fcols">
    ${narrow ? "" : col([["folder", "Desktop"], ["folder", "Documents"], ["folder", "Downloads"], ["folder", "Music"], ["folder", "Pictures"], ["folder", "Videos"]], 1)}
    ${col([["folder", "Lumen Bakery"], ["folder", "Recipes"], ["folder", "Tax 2026"], ["doc", "CV 2026.docx"], ["pdf", "Lease.pdf"]], 0)}
    ${col([["folder", "Invoices"], ["folder", "Menu photos"], ["folder", "Website"], ["pdf", "Spring menu.pdf", "on"], ["sheet", "Price list 2026.xlsx"], ["img", "Shop floor plan.png"], ["img", "Logo.svg"], ["doc", "Supplier letter.docx"], ["text", "Opening hours.txt"], ["zip", "Contracts 2025.zip"], ["video", "Welcome video.mp4"], ["audio", "Shop jingle.mp3"]], 3, narrow ? 236 : 244)}
  </div>`;
  const inspector = (narrow) => `<div class="insp fins">
    <div class="pv sm">${pdfPage(true)}</div>
    <div class="pvn"><b>Spring menu.pdf</b><span>PDF document · 2.4 MB · 2 pages</span></div>
    <div class="pva">${btn("Open", "primary", "external")}${btn("Open with", "", "fapps")}</div>
    <div class="ibody">
      <div class="lab">Information</div>
      <div class="card">
        <div class="row"><span class="k">Modified</span><span class="v">Today 10:41</span></div>
        <div class="row"><span class="k">Created</span><span class="v">Nov 3</span></div>
        <div class="row"><span class="k">Permissions</span><span class="v"><span class="mode">rw-r--r--</span> 644</span></div>
      </div>
      ${narrow ? "" : `<div class="lab">Colour</div>
      <div class="swrow">${["", "red", "coral", "amber", "green", "teal", "blue", "violet", "pink"].map((c, i) => `<span class="swx ${i === 0 ? "none" : ""} ${c === "red" ? "on" : ""}" style="${c ? `background:var(--sw-${c})` : ""}"></span>`).join("")}<span class="emo" title="An icon or emoji">${icon("sparkle")}</span></div>`}
      <div class="lab">Actions</div>
      <div class="acts">${btn("Rename", "sm", "rename")}${btn("Duplicate", "sm", "copy")}${btn("Compress", "sm", "archive")}${btn("Print", "sm", "printer")}</div>
    </div></div>`;
  const keysBar = (narrow) => `<div class="kbar"><span class="mode">${icon("keyboard")}10xer</span>${[["Space", "Preview"], ["Enter", "Open"], ["F2", "Rename"], ["y y", "Copy"], ["d d", "Trash"], ["g h", "Go home"], [":", "Command"]].slice(0, narrow ? 4 : 7).map(([k, t]) => `<span class="kb">${kbd(k)}${t}</span>`).join("")}<span class="sp"></span><span class="f1">${kbd("F1")} All shortcuts</span></div>`;
  const pageC = (narrow) => `${tabs()}<div class="cols"><div class="main">${colsC(narrow)}${keysBar(narrow)}</div>${inspector(narrow)}</div>`;

  const jobs = () => `<div class="jobs pop">
    <div class="jh"><b>Transfers</b><span class="sp"></span>${ib("chev-d", "Hide")}</div>
    <div class="job"><div class="r1">${icon("copy")}<span><b>Copying 48 photos</b> to Backup drive</span></div>${prog(64)}<div class="r2"><span>31 of 48 · 412 MB of 640 MB</span><span class="sp"></span><span>About 20 s left</span>${ib("pause", "Pause")}${ib("x", "Cancel")}</div></div>
    <div class="job"><div class="r1">${icon("archive")}<span><b>Compressing</b> Contracts 2025</span></div>${prog(22, "warn")}<div class="r2"><span>Waiting for you: 1 file already exists</span></div></div>
  </div>`;
  const replaceDlg = () => dialog("“Logo.svg” is already in Website", "The one you're copying is newer and a little larger. Which do you want to keep?",
    [`<label class="chk"><span class="cbx sq"></span>Do the same for the other 3</label><span class="sp"></span>`, btn("Skip"), btn("Keep both"), btn("Replace", "primary")],
    `<div class="cmp"><div class="cf"><div class="cth">${art("logo-new", { w: 56, h: 56, r: 8, ic: "image" })}</div><div><b>Copying</b><span>18 KB · Today 10:12</span></div></div><div class="cf"><div class="cth">${art("logo-old", { w: 56, h: 56, r: 8, ic: "image" })}</div><div><b>Already there</b><span>14 KB · Nov 2</span></div></div></div>`, 500);

  /* ── Option C (n1): two folders side by side ─────────────────────────── */
  const RIGHT = [
    ["folder", "Invoices", "22 items", "Oct 31"],
    ["folder", "Menu photos", "48 items", "Oct 31"],
    ["pdf", "Spring menu.pdf", "2.1 MB", "Nov 1"],
    ["sheet", "Price list 2025.xlsx", "79 KB", "Jan 6"],
    ["img", "Logo.svg", "14 KB", "Nov 2"],
    ["doc", "Supplier letter.docx", "42 KB", "Nov 1"],
    ["text", "Opening hours.txt", "1 KB", "Oct 28"],
    ["zip", "Contracts 2025.zip", "18.6 MB", "Oct 20"],
    ["video", "Welcome video.mp4", "212 MB", "Oct 14"],
  ];
  const MARK = { only: ["Only here", "green"], newer: ["Newer", "amber"], older: ["Older", "graphite"], done: ["Replaced", "green"] };
  const n1row = ([k, n, s, m], i, o) => {
    const mk = o.marks && o.marks[i];
    return `<div class="n1-row ${o.sel && o.sel.includes(i) ? "sel" : ""} ${o.cur === i ? "cur" : ""} ${o.marks ? (mk ? "mk" : "same") : ""}">${fic(k)}<span class="n">${n}</span>${mk ? `<span class="n1-mk" style="--mc:var(--sw-${MARK[mk][1]})">${MARK[mk][0]}</span>` : ""}<span class="s">${s}</span><span class="m">${m}</span></div>`;
  };
  const n1pane = (o) => `<div class="n1-pane ${o.active ? "on" : ""}">
    <div class="n1-ptabs">${o.tabs.map(([ic, t], i) => `<span class="n1-pt ${i === 0 ? "on" : ""}">${icon(ic)}<span>${t}</span></span>`).join("")}<span class="n1-pt add" title="New tab on this side">${icon("plus")}</span><span class="sp"></span><span class="n1-side">${o.label}</span></div>
    <div class="n1-loc"><span class="dev">${icon(o.dev)}${o.devName}</span>${icon("chev-r", "sep")}${o.path.map((p, i) => i === o.path.length - 1 ? `<b>${p}</b>` : `<span class="${i < o.path.length - 2 ? "far" : ""}">${p}</span>${icon("chev-r", "sep" + (i < o.path.length - 2 ? " far" : ""))}`).join("")}<span class="sp"></span><span class="free">${o.free}</span></div>
    <div class="n1-th"><span class="n">Name ${icon("chev-u", "si")}</span><span class="s">Size</span><span class="m">Modified</span></div>
    <div class="n1-body">${o.pre || ""}${o.items.map((r, i) => n1row(r, i, o)).join("")}</div>
    <div class="n1-pfoot">${o.foot}</div></div>`;
  const n1keys = (narrow) => `<div class="n1-keys">${[["F3", "Preview", "eye"], ["F4", "Open with", "fapps"], ["F5", "Copy across", "copy", "primary"], ["F6", "Move across", "fmove"], ["F7", "New folder", "folder-plus"], ["F8", "Trash", "trash"]].map(([k, t, ic, c]) => `<button class="n1-k ${c || ""}"><span class="kc">${k}</span>${icon(ic)}<span class="kt">${t}</span></button>`).join("")}<span class="sp"></span><span class="n1-hint">${kbd("Tab")} Other side</span>${narrow ? "" : `<span class="n1-hint">${kbd("Ctrl U")} Swap</span>`}</div>`;
  const n1side = () => `
    ${grp("Places", true, "", "accent")}
    ${navx("clock", "Recent")}
    ${navx("home", "Home")}
    ${navx("monitor", "Desktop")}
    ${navx("file-text", "Documents")}
    ${navx("download", "Downloads", { badge: 6 })}
    ${navx("image", "Pictures")}
    ${navx("music", "Music")}
    ${navx("film", "Videos")}
    ${grp("Pinned", false, icon("plus"), "green")}
    <div class="navx active">${icon("folder")}<span>Lumen Bakery</span><span class="n1-lr">Left</span></div>
    ${navx("folder", "Tax 2026")}
    ${navx("folder", "Lisbon trip")}
    ${grp("Drives and cloud", false, "", "amber")}
    ${navx("drive", "System", { sub: "212 GB free" })}
    <div class="navx">${icon("usb")}<span>Backup drive</span><span class="n1-lr">Right</span><span class="ej" title="Eject">${icon("eject")}</span></div>
    ${navx("cloud", "Google Drive", { sub: "Synced" })}
    ${navx("network", "Network")}
    ${navx("trash", "Trash", { cnt: 12 })}`;
  const n1hdr = (cmp) => header({
    icon: "folder", name: "Files",
    center: search("Search both folders", "Ctrl K"),
    end: `${ib("nswap", "Swap sides (Ctrl+U)")}${ib("ncompare", "Compare the two folders", cmp ? "on" : "")}<div class="seg icons n1-lay"><button class="on" title="Side by side">${icon("split")}</button><button title="One above the other">${icon("nstack")}</button></div>${vseg("list")}<button class="newbtn">${icon("folder-plus")}<span>New</span>${icon("chev-d", "dd-chev")}</button>`,
  });
  const n1left = (o = {}) => n1pane({ active: true, label: "Left", tabs: [["folder", "Lumen Bakery"], ["download", "Downloads"]], dev: "drive", devName: "System", path: ["Home", "Documents", "Lumen Bakery"], free: "212 GB free", items: ITEMS, ...o });
  const n1right = (o = {}) => n1pane({ label: "Right", tabs: [["usb", "Lumen Bakery"], ["cloud", "Google Drive"]], dev: "usb", devName: "Backup drive", path: ["Backups", "Lumen Bakery"], free: "640 GB free", items: RIGHT, foot: "9 items", ...o });
  const n1page = (narrow) => `<div class="n1-split">${n1left({ sel: [3], cur: 3, foot: "14 items · Spring menu.pdf, 2.4 MB" })}${n1right()}</div>${n1keys(narrow)}`;
  const n1move = () => `<div class="n1-cmp">${icon("ncompare")}<span><b>Comparing the two folders.</b> The left has 7 items the right doesn't and 2 newer ones.</span><span class="sp"></span>${btn("Select the differences", "sm")}${btn("Copy newer across", "sm primary")}${ib("x", "Stop comparing")}</div>
    <div class="n1-split">${n1left({ sel: [4, 5, 11], cur: 11, marks: { 0: "newer", 2: "only", 3: "newer", 4: "only", 5: "only", 11: "only", 12: "only", 13: "only" }, foot: "14 items · 3 selected, 4.3 MB" })}${n1right({ marks: { 2: "done", 3: "only" }, pre: `<div class="n1-row in">${fic("sheet")}<span class="n">Price list 2026.xlsx</span><span class="n1-inprog">${prog(100, "ok")}</span><span class="m">Copied</span></div><div class="n1-row in">${fic("img")}<span class="n">Shop floor plan.png</span><span class="n1-inprog">${prog(58)}</span><span class="m">58%</span></div><div class="n1-row in wait">${fic("audio")}<span class="n">Shop jingle.mp3</span><span class="n1-inprog">${prog(0)}</span><span class="m">Waiting</span></div>`, foot: "9 items · 3 arriving" })}</div>
    <div class="n1-xfer">${icon("copy")}<span class="tx"><b>Copying 3 items</b> to Backup drive › Lumen Bakery</span>${prog(62)}<span class="t">2.7 of 4.3 MB · a few seconds left</span>${ib("pause", "Pause")}${ib("x", "Cancel")}<span class="vr"></span>${btn("All transfers", "ghost sm")}</div>
    ${n1keys(false)}`;

  /* ── Option D (n2): one bar for where you are, tags and Quick Look ────── */
  const N2TAGS = { 0: ["red"], 3: ["amber", "coral"], 4: ["amber"], 5: ["amber"], 7: ["red"], 9: ["blue"], 12: ["amber", "green"], 13: ["violet"] };
  const TAGNAMES = [["red", "Urgent", 4], ["coral", "To print", 2], ["amber", "Bakery", 10], ["green", "Done", 31], ["blue", "Taxes", 9], ["violet", "Personal", 6]];
  const tdots = (cs = []) => `<span class="n2-tg">${cs.map((c) => `<i style="background:var(--sw-${c})"></i>`).join("")}</span>`;
  const n2omni = (segs, find) => `<div class="n2-omni">${segs.map(([ic, t, c], i) => `<span class="n2-seg ${i === segs.length - 1 ? "on" : ""} ${c || ""}">${ic ? icon(ic) : ""}<span>${t}</span>${i === segs.length - 1 ? icon("chev-d", "n2-ddc") : ""}</span>${i < segs.length - 1 ? icon("chev-r", "sep " + (c || "")) : ""}`).join("")}<span class="sp"></span><span class="n2-find">${icon("search")}<span>${find}</span></span></div>`;
  const n2hdr = (segs, find) => header({ icon: "folder", name: "Files", start: navbtns(), center: n2omni(segs, find), end: `<button class="newbtn">${icon("folder-plus")}<span>New</span>${icon("chev-d", "dd-chev")}</button>` });
  const N2PATH = [["drive", "System", "far"], ["home", "Home", "far"], ["", "Documents"], ["folder-fill", "Lumen Bakery"]];
  const n2tools = (group = "Group by kind") => `<div class="n2-tools"><div class="seg n2-views">${[["list", "List"], ["grid", "Icons"], ["columns", "Columns"]].map(([i, t], n) => `<button class="${n === 0 ? "on" : ""}">${icon(i)}<span>${t}</span></button>`).join("")}</div>${dd(group, "layers")}${dd("Name", "sort")}<span class="sp"></span>${btn("Tags", "ghost", "tag")}${btn("Send to", "ghost", "send")}${btn("Quick Look", "ghost", "eye")}</div>`;
  const N2GROUPS = [["Folders", [0, 1, 2]], ["Documents", [3, 4, 7, 8, 12, 13]], ["Images", [5, 6]], ["Audio and video", [10, 11]], ["Archives", [9]]];
  const n2list = (narrow) => `<div class="n2-list"><div class="n2-th"><span class="n">Name ${icon("chev-u", "si")}</span><span class="s">Size</span><span class="m">Modified</span></div><div class="n2-body">${N2GROUPS.map(([g, ids]) => `<div class="n2-gh">${g}<span class="c">${ids.length}</span></div>${ids.map((i) => { const [k, n, s, m] = ITEMS[i]; return `<div class="n2-row ${i === 3 ? "sel" : ""}">${fic(k)}<span class="n">${n}</span>${tdots(N2TAGS[i])}<span class="s">${s}</span><span class="m">${m}</span></div>`; }).join("")}`).join("")}</div></div>`;
  const n2status = (narrow, left = "14 items · Spring menu.pdf selected, 2.4 MB") => `<div class="n2-status"><span>${left}</span><span class="sp"></span><span class="n2-job">${icon("copy")}<span>Copying 48 photos</span>${prog(64)}<span>64%</span></span><span class="vr"></span><span>212 GB free</span>${narrow ? "" : `<span class="vr"></span><span>${kbd("Space")} Quick Look</span>`}</div>`;
  const n2side = (on = "lumen") => `
    ${grp("Favourites", true, "", "accent")}
    ${navx("clock", "Recent")}
    ${navx("home", "Home")}
    ${navx("file-text", "Documents")}
    ${navx("download", "Downloads", { badge: 6 })}
    ${navx("image", "Pictures")}
    ${grp("Pinned", false, icon("plus"), "green")}
    ${navx("folder", "Lumen Bakery", { active: on === "lumen" })}
    ${navx("folder", "Tax 2026")}
    ${grp("Locations", false, "", "violet")}
    ${navx("drive", "System", { sub: "212 GB free" })}
    <div class="navx">${icon("usb")}<span>Backup drive</span><span class="ej" title="Eject">${icon("eject")}</span></div>
    ${navx("cloud", "Google Drive", { sub: "Synced" })}
    ${navx("network", "Network")}
    ${navx("trash", "Trash", { cnt: 12 })}
    ${grp("Tags", false, icon("plus"), "pink")}
    ${TAGNAMES.slice(0, 5).map(([c, t, n]) => navx("", t, { dot: `var(--sw-${c})`, cnt: n, active: on === t })).join("")}`;
  const n2page = (narrow) => `${tabs()}${n2tools()}${n2list(narrow)}${n2status(narrow)}`;
  const menuPage = (p) => p === 1
    ? `<div class="n2-pg"><b>Lumen Bakery</b><i>Spring menu</i><div class="sec">Breads</div>${[["Country sourdough", "6.50"], ["Seeded rye", "5.80"], ["Olive fougasse", "4.90"]].map(([a, b]) => `<div class="it"><span>${a}</span><span>${b}</span></div>`).join("")}<div class="ph"><span></span><span></span><span></span></div><div class="sec">Pastries</div>${[["Butter croissant", "2.90"], ["Cardamom bun", "3.40"], ["Lemon tart", "4.20"], ["Pain au chocolat", "3.10"]].map(([a, b]) => `<div class="it"><span>${a}</span><span>${b}</span></div>`).join("")}</div>`
    : `<div class="n2-pg"><b>Lumen Bakery</b><i>Cakes and coffee</i><div class="sec">Cakes</div>${[["Carrot cake", "4.50"], ["Rhubarb crumble", "4.80"], ["Hazelnut torte", "5.20"]].map(([a, b]) => `<div class="it"><span>${a}</span><span>${b}</span></div>`).join("")}<div class="sec">Coffee</div>${[["Espresso", "2.20"], ["Flat white", "3.30"], ["Oat latte", "3.60"], ["Filter, refills free", "2.80"]].map(([a, b]) => `<div class="it"><span>${a}</span><span>${b}</span></div>`).join("")}<div class="ph"><span></span><span></span></div><div class="note">Open daily 7–3 · Sundays 8–1</div></div>`;
  const n2ql = () => `<div class="veil n2-veil"><div class="n2-ql pop">
    <div class="n2-qh">${fic("pdf", "md")}<div class="t"><b>Spring menu.pdf</b><span>PDF document · 2.4 MB · 2 pages · Edited today, 10:41</span></div>${tdots(["amber", "coral"])}<span class="sp"></span>${btn("Open in Office", "primary", "external")}${ib("fapps", "Open with")}${ib("send", "Send to")}${ib("expand", "Full screen")}${ib("x", "Close (Space)")}</div>
    <div class="n2-qb"><span class="n2-qnav">${icon("chev-l")}</span><div class="n2-pages">${menuPage(1)}${menuPage(2)}</div><span class="n2-qnav">${icon("chev-r")}</span></div>
    <div class="n2-qf"><span class="pn">${icon("chev-l")}Website</span><span class="sp"></span><span class="c">4 of 14 · ${kbd("←")} ${kbd("→")} next file · ${kbd("Space")} close · ${kbd("Enter")} open</span><span class="sp"></span><span class="pn">Price list 2026.xlsx${icon("chev-r")}</span></div>
  </div></div>`;
  const TAGGED = [
    ["Lumen Bakery", "Documents", [["pdf", "Spring menu.pdf", "2.4 MB", "Today 10:41", ["amber", "coral"]], ["sheet", "Price list 2026.xlsx", "86 KB", "Today 08:55", ["amber"]], ["img", "Shop floor plan.png", "1.1 MB", "Nov 9", ["amber"]], ["sheet", "Staff rota.ods", "31 KB", "Sep 29", ["amber", "green"]]]],
    ["Menu photos", "Documents › Lumen Bakery", [["img", "Croissant tray.jpg", "3.6 MB", "Nov 4", ["amber"]], ["img", "Sourdough loaf.jpg", "4.1 MB", "Nov 4", ["amber"]], ["img", "Cinnamon buns.jpg", "3.2 MB", "Nov 4", ["amber", "coral"]]]],
    ["Desktop", "Home", [["img", "Flyer draft.png", "2.2 MB", "Yesterday", ["amber", "red"]]]],
    ["Bakery shared", "Google Drive", [["sheet", "Supplier list.xlsx", "22 KB", "Oct 30", ["amber"]], ["pdf", "Oven manual.pdf", "5.8 MB", "Aug 14", ["amber"]]]],
  ];
  const n2tagPage = () => `<div class="n2-tbar"><span class="n2-tbig" style="background:var(--sw-amber)"></span><div><b>Bakery</b><span>10 items in 4 places, tagged by you</span></div><span class="sp"></span>${dd("Group by folder", "layers")}${dd("Modified", "sort")}${btn("Rename or recolour…", "ghost", "pen")}</div>
    <div class="n2-list"><div class="n2-th"><span class="n">Name</span><span class="w">Where</span><span class="s">Size</span><span class="m">Modified</span></div><div class="n2-body">${TAGGED.map(([f, where, rows]) => `<div class="n2-gh">${icon("folder")}${f}<span class="c">${where}</span></div>${rows.map(([k, n, s, m, t]) => `<div class="n2-row ${n.startsWith("Sourdough") ? "sel" : ""}">${fic(k)}<span class="n">${n}</span>${tdots(t)}<span class="w">${where === "Home" ? f : f}</span><span class="s">${s}</span><span class="m">${m}</span></div>`).join("")}`).join("")}</div></div>
    ${n2status(false, "10 items · Sourdough loaf.jpg selected")}`;
  const n2tagPop = () => `<div class="menu pop n2-tagpop" style="left:404px;top:384px;width:248px">
    <div class="mh">Tags for Sourdough loaf.jpg</div>
    ${TAGNAMES.map(([c, t], i) => `<div class="mi ${i === 1 ? "hover" : ""}"><span class="cbx sq ${c === "amber" ? "done" : ""}">${c === "amber" ? icon("check") : ""}</span><span class="n2-d" style="background:var(--sw-${c})"></span><span>${t}</span>${i < 4 ? `<span class="k">Ctrl ${i + 1}</span>` : ""}</div>`).join("")}
    <div class="ms"></div>
    <div class="n2-newtag">${icon("plus")}<span>New tag…</span></div>
  </div>`;

  /* ── Option E (n3): a big preview with a filmstrip ───────────────────── */
  const n3thumb = (k, n) => {
    if (k === "folder") return `<div class="n3-th ic">${fic("folder", "lg")}</div>`;
    if (k === "img") return `<div class="n3-th">${art("lb" + n, { r: 0 })}</div>`;
    if (k === "video") return `<div class="n3-th">${art("vid" + n, { r: 0 })}<span class="n3-play">${icon("play")}</span></div>`;
    if (k === "pdf") return `<div class="n3-th pg">${pdfPage()}</div>`;
    if (k === "sheet") return `<div class="n3-th pg"><div class="n3-sheet">${"<span></span>".repeat(30)}</div></div>`;
    if (k === "doc" || k === "text") return `<div class="n3-th pg"><div class="n3-doc ${k}"><b></b>${"<i></i>".repeat(8)}</div></div>`;
    if (k === "audio") return `<div class="n3-th ic wav">${bars([.3, .6, .9, .5, .7, 1, .4, .8, .55, .35, .7, .45], { h: 30, c: "var(--sw-pink)", gap: 2 })}</div>`;
    return `<div class="n3-th ic">${fic(k, "lg")}</div>`;
  };
  const n3scene = () => `<div class="n3-scene"><span class="sun"></span><span class="hill"></span><span class="roofs"></span><span class="river"></span></div>`;
  const n3strip = (items, on, o = {}) => `<div class="n3-strip">${items.map(([k, n], i) => `<div class="n3-card ${i === on ? "on" : ""} ${o.sel && o.sel.includes(i) ? "sel" : ""}">${o.scene === i ? `<div class="n3-th">${n3scene()}</div>` : n3thumb(k, n)}${o.sel && o.sel.includes(i) ? `<i class="n3-tick">${icon("check")}</i>` : ""}<span>${n}</span></div>`).join("")}</div>`;
  const vseg4 = () => `<div class="seg icons">${[["list", "List"], ["grid", "Icons"], ["columns", "Columns"], ["ngallery", "Gallery"]].map(([i, t]) => `<button class="${i === "ngallery" ? "on" : ""}" title="${t}">${icon(i)}</button>`).join("")}</div>`;
  const n3hdr = (path) => header({ icon: "folder", name: "Files", start: navbtns() + crumbs(path), center: search("Search Home and drives", "Ctrl K"), end: `${vseg4()}<button class="newbtn">${icon("folder-plus")}<span>New</span>${icon("chev-d", "dd-chev")}</button>` });
  const n3side = (on = "lumen") => `
    ${grp("Collections", true, "", "accent")}
    ${navx("clock", "Recent", { cnt: 18 })}
    ${navx("calendar", "This week", { cnt: 9 })}
    ${navx("file-text", "Documents", { cnt: 212 })}
    ${navx("image", "Images", { cnt: "1.4k" })}
    ${navx("film", "Audio and video", { cnt: 86 })}
    ${navx("drive", "Large files", { sub: "Over 100 MB" })}
    ${grp("Folders", false, icon("plus"), "green")}
    ${navx("home", "Home")}
    ${navx("monitor", "Desktop")}
    ${navx("download", "Downloads", { badge: 6 })}
    ${navx("folder", "Lumen Bakery", { active: on === "lumen" })}
    ${navx("folder", "Lisbon trip", { active: on === "lisbon" })}
    ${grp("Storage", false, "", "violet")}
    ${navx("drive", "System", { sub: "212 GB free" })}
    <div class="navx">${icon("usb")}<span>Backup drive</span><span class="ej" title="Eject">${icon("eject")}</span></div>
    ${navx("cloud", "Google Drive", { sub: "Synced" })}
    ${navx("network", "Network")}
    ${navx("trash", "Trash", { cnt: 12 })}`;
  const n3info = () => `<div class="insp n3-info">
    <div class="n3-nm"><b>Spring menu.pdf</b><span>PDF document · 2.4 MB · 2 pages</span></div>
    <div class="n3-acts">${btn("Open", "primary", "external")}${btn("Open with", "", "fapps")}${ib("more", "More")}</div>
    <div class="ibody">
      <div class="lab">Information</div>
      <div class="card">
        <div class="row"><span class="k">Modified</span><span class="v">Today 10:41</span></div>
        <div class="row"><span class="k">Created</span><span class="v">Nov 3</span></div>
        <div class="row"><span class="k">Where</span><span class="v">Lumen Bakery</span></div>
        <div class="row"><span class="k">Permissions</span><span class="v"><span class="mode">rw-r--r--</span></span></div>
      </div>
      <div class="lab">Colour</div>
      <div class="swrow">${["", "red", "coral", "amber", "green", "teal", "blue", "violet"].map((c, i) => `<span class="swx ${i === 0 ? "none" : ""} ${c === "amber" ? "on" : ""}" style="${c ? `background:var(--sw-${c})` : ""}"></span>`).join("")}</div>
      <div class="lab">Actions</div>
      <div class="acts">${btn("Send to", "sm", "send")}${btn("Compress", "sm", "archive")}${btn("Rename", "sm", "rename")}${btn("Trash", "sm dtext", "trash")}</div>
    </div></div>`;
  const n3stage = (inner, cap) => `<div class="n3-view"><span class="n3-nav l">${icon("chev-l")}</span>${inner}<span class="n3-nav r">${icon("chev-r")}</span><div class="n3-cap">${cap}</div></div>`;
  const n3sbar = (title, sub, filt) => `<div class="n3-sbar"><b>${title}</b><span class="d">${sub}</span><span class="sp"></span>${seg(["Everything", "Documents", "Images", "Media"], filt)}${dd("Modified", "sort")}</div>`;
  const n3page = (narrow) => `${tabs()}<div class="n3-stage">${n3stage(`<div class="n3-spread">${menuPage(1)}${narrow ? "" : menuPage(2)}</div>`, `<span>${narrow ? "Page 1 of 2" : "Pages 1–2 of 2"}</span><span class="sp"></span>${narrow ? `<span class="n3-mini">${btn("Open", "primary sm", "external")}${btn("Open with", "sm", "fapps")}</span>` : `<span class="n3-zoom">${ib("chev-d", "Smaller")}<span>Fit</span>${ib("plus", "Larger")}</span>`}`)}${narrow ? "" : n3info()}</div>${n3sbar("Lumen Bakery", narrow ? "14 items" : "14 items · 3 folders · Spring menu.pdf is 4 of 14", "Everything")}${n3strip(ITEMS, 3)}`;
  const LX = [["img", "Tram 28.jpg"], ["img", "Alfama roofs.jpg"], ["img", "Pastéis.jpg"], ["img", "Belém tower.jpg"], ["img", "Miradouro.jpg"], ["img", "Tiles.jpg"], ["video", "Ferry ride.mp4"], ["img", "LX Factory.jpg"], ["img", "Sunset bridge.jpg"], ["img", "Market.jpg"], ["img", "Sintra.jpg"], ["img", "Night walk.jpg"]];
  const n3photoInfo = () => `<div class="insp n3-info">
    <div class="n3-nm"><b>Miradouro.jpg</b><span>JPEG image · 3.8 MB · 4032 × 3024</span></div>
    <div class="n3-acts">${btn("Open in Photos", "primary", "external")}${ib("refresh", "Rotate")}${ib("more", "More")}</div>
    <div class="ibody">
      <div class="lab">Photo</div>
      <div class="card">
        <div class="row"><span class="k">Taken</span><span class="v">Oct 12, 18:42</span></div>
        <div class="row"><span class="k">Camera</span><span class="v">Pocket camera 2</span></div>
        <div class="row"><span class="k">Exposure</span><span class="v">1/250 s · f/1.8 · ISO 80</span></div>
        <div class="row"><span class="k">Place</span><span class="v">Lisbon, Portugal</span></div>
      </div>
      <div class="lab">File</div>
      <div class="card">
        <div class="row"><span class="k">Modified</span><span class="v">Oct 12</span></div>
        <div class="row"><span class="k">Where</span><span class="v">Pictures › Lisbon trip</span></div>
      </div>
      <div class="acts n3-pa">${btn("Set as background", "sm", "image")}${btn("Send to", "sm", "send")}</div>
    </div></div>`;
  const n3photos = () => `${tabs(0).replace("Lumen Bakery", "Lisbon trip")}<div class="n3-stage">${n3stage(`<div class="n3-photo">${n3scene()}</div>`, `<span>5 of 212</span><span class="sp"></span><span class="n3-zoom">${ib("chev-d", "Smaller")}<span>Fit</span>${ib("plus", "Larger")}</span>`)}${n3photoInfo()}</div><div class="n3-sbar on"><span class="n3-ck">${icon("check")}</span><b>3 selected</b><span class="d">10.9 MB · Ctrl-click or Space adds more</span><span class="sp"></span>${btn("Copy", "ghost", "copy")}${btn("Move to…", "ghost", "fmove")}${btn("Compress", "ghost", "archive")}${btn("Send to", "ghost", "send")}${btn("Move to Trash", "ghost dtext", "trash")}${ib("x", "Clear selection (Esc)")}</div>${n3strip(LX, 4, { sel: [2, 4, 5], scene: 4 })}`;

  REG("files", {
    name: "Files", accent: "blue",
    summary: "Files does a great deal (tabs, three views, previews, cloud, archives, a keyboard mode), but it opens on a wall of hidden folders with Unix permissions, hides its actions behind bare icons in a crowded header, and its sidebar has no Documents, Downloads or Pictures.",
    problems: [
      "<b>Opens on a wall of dot-folders:</b> Home shows .agents, .cache, .cargo… first, twenty rows of hidden folders before anything you made.",
      "<b>Permissions as a column:</b> “drwxr-xr-x 755” takes the widest column after the name; the Kind column says “Folder” on every row.",
      "<b>The header is eleven icons in raised groups:</b> back, forward and up, copy path, new tab, three views, appearance, settings, close; none is labelled and there's no way to make a new folder or file from it.",
      "<b>A thin sidebar:</b> only Home, Desktop, Recent, Network and Trash by default; drives show as “OS” and “RESTORE” with the same generic icon, and nothing says how full they are.",
      "<b>No sign of what's selected</b> beyond “1 folder selected” in the corner; the preview is hidden until you press Space.",
      "<b>At 800 px</b> the Size column is cut in half and Kind and Modified are gone, while the permissions column stays; the rail has eight icons with no section marks.",
      "<b>The keyboard mode and F1 shortcuts</b> are a small “F1 Shortcuts” link at the foot of the sidebar; there's nothing to show 10xer mode is there.",
    ],
    today: [["files-1280", "Today at 1280 px", "Home with hidden folders and the permissions column"], ["files-800", "Today at 800 px", "Size cut off; Kind and Modified gone"]],
    options: [
      { id: "a", name: "Start from Overview", idea: "Files opens on an Overview instead of a folder: recent files as thumbnails, pinned folders as cards, every drive and cloud account with how full it is (eject right there), and the Trash with its size. Search across Home and the drives is the big field in the header, with results from every place in one list. Icons view is for pictures: bigger thumbnails, a size slider, and a bar of labelled actions when you select some. Good for people who mostly go back to what they had open.",
        shots: [
          ["b-home","Overview","Recent, pinned, storage and Trash"],
          ["b-search","Search everywhere","Results from every drive, with their folder"],
          ["b-grid","Icons with a selection","Labelled actions for what's selected"],
        ] },
      { id: "b", name: "Columns and inspector", idea: "For people who live in the keyboard. The sidebar is a rail, Columns is the view, and the right side is a full inspector: the preview, the facts (permissions stay here), the folder or file colour, and the common actions. 10xer mode gets a bar along the foot that shows the next keys to press. Copies and moves gather in a Transfers card you can tuck away, and a clash asks once with both files side by side.",
        shots: [
          ["c-columns","Columns","Rail, three columns, inspector, keys bar"],
          ["c-copy","Copying, with a clash","Transfers card and Replace, Keep both or Skip"],
          ["c-columns-800","At 800 px","Two columns and the inspector"],
        ] },
      { id: "c", name: "Two folders side by side", idea: "A commander for people who move and back up files. Two folders sit side by side, each with its own tabs, drive and path; Tab switches sides and the labelled keys along the foot (Copy across, Move across, New folder, Trash) always act from the active side to the other. Compare marks what's only on one side or newer, so copying a backup up to date is a couple of keys. Transfers show right in the folder they're arriving in. At 800 px the two folders stack.",
        shots: [
          ["n1-folder", "Lumen Bakery beside its backup", "Two folders, their own tabs and drives, the keys along the foot"],
          ["n1-move", "Comparing and copying across", "Only here and Newer marks; files arriving on the right"],
          ["n1-folder-800", "At 800 px", "The two folders one above the other"],
        ] },
      { id: "d", name: "Path bar, tags and Quick Look", idea: "A calm everyday browser in the spirit of Finder. One big bar in the header shows where you are (click a part to jump, or the arrow for its neighbours) and searches the folder you're in. Files are grouped by kind, and colour tags (Urgent, Bakery, Done…) sit beside names and in the sidebar, gathering tagged files from every folder and drive. Space opens Quick Look: a large preview over the window you can arrow through, file by file.",
        shots: [
          ["n2-folder", "Lumen Bakery, grouped by kind", "Path bar, tag dots, a transfer in the status bar"],
          ["n2-quicklook", "Quick Look", "Space opens a big preview; ← and → step through the folder"],
          ["n2-tags", "A tag across folders", "Everything tagged Bakery, wherever it lives"],
        ] },
      { id: "e", name: "Big preview and filmstrip", idea: "Seeing comes first. The selected file fills the window (a menu reads as a menu, a photo as a photo) with its facts and actions beside it, and the folder runs along the bottom as a filmstrip of real thumbnails. The sidebar adds collections that gather files from everywhere: Recent, This week, Documents, Images, Large files. Good for people who think in what a file looks like rather than what it's called.",
        shots: [
          ["n3-folder", "Lumen Bakery in Gallery", "The menu large, facts beside it, the folder as a filmstrip"],
          ["n3-photos", "Photos, with a selection", "Photo details; the strip bar turns into the selection's actions"],
          ["n3-folder-800", "At 800 px", "Preview and filmstrip; Open moves under the preview"],
        ] },
    ],
    icons: {
      fsheet: '<rect x="3.5" y="4" width="17" height="16" rx="2.5"/><path d="M3.5 9.5h17M3.5 14.5h17M9.5 9.5V20"/>',
      eject: '<path d="M12 5 4.5 14h15z"/><path d="M5 18.5h14"/>',
      fcut: '<circle cx="6" cy="17.5" r="2.8"/><circle cx="18" cy="17.5" r="2.8"/><path d="M8 15.5 18.5 4M16 15.5 5.5 4"/>',
      fmove: '<path d="M3 7.5A2.5 2.5 0 0 1 5.5 5H9l2 2.2h7.5A2.5 2.5 0 0 1 21 9.7v7.8a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 17.5z"/><path d="M9 13.5h6M12.5 11l2.5 2.5-2.5 2.5"/>',
      fapps: '<rect x="4" y="4" width="6.5" height="6.5" rx="1.8"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.8"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.8"/><path d="M16.75 13.5v6.5M13.5 16.75H20"/>',
      nswap: '<path d="M4 8.5h15M15.5 5l3.5 3.5-3.5 3.5M20 15.5H5M8.5 12 5 15.5 8.5 19"/>',
      ncompare: '<path d="M12 3.5v17M8 20.5h8M4.5 7.5h15M4.5 7.5 2 13.5a2.8 2.8 0 0 0 5 0zM19.5 7.5 17 13.5a2.8 2.8 0 0 0 5 0z"/>',
      nstack: '<rect x="3" y="4.5" width="18" height="15" rx="2.5"/><path d="M3 12h18"/>',
      ngallery: '<rect x="3" y="3.5" width="18" height="11" rx="2"/><rect x="3" y="17" width="4.5" height="3.5" rx="1"/><rect x="9.75" y="17" width="4.5" height="3.5" rx="1"/><rect x="16.5" y="17" width="4.5" height="3.5" rx="1"/>',
    },
    pages: {
      "a-list": () => win({ hdr: hdr(), side: sideA(), page: pageA({ narrow: NARROW, noPrev: NARROW }) }),
      "a-menu": () => win({ hdr: hdr(), side: sideA(), page: pageA({ sel: 3 }), over: ctxMenu() }),
      "b-home": () => win({ hdr: homeHdr(), side: sideB("home"), page: home(NARROW) }),
      "b-search": () => win({ hdr: header({ icon: "folder", name: "Files", start: navbtns(), center: `<div class="search wide focus">${icon("search")}<span class="q">invoice</span><span class="key">Esc</span></div>`, end: `<button class="newbtn">${icon("folder-plus")}<span>New</span>${icon("chev-d", "dd-chev")}</button>` }), side: sideB("search"), page: searchPage() }),
      "b-grid": () => win({ hdr: hdr({ path: ["Home", "Pictures", "Lisbon trip"], view: "grid" }), side: sideB("pics"), page: grid() }),
      "c-columns": () => railed(win({ hdr: hdr({ view: "columns" }), side: sideA("lumen", { noTiles: true }), page: pageC(NARROW) })),
      "n1-folder": () => win({ hdr: n1hdr(false), side: n1side(), page: n1page(NARROW) }),
      "n1-move": () => win({ hdr: n1hdr(true), side: n1side(), page: n1move() }),
      "n2-folder": () => win({ hdr: n2hdr(N2PATH, "Search Lumen Bakery"), side: n2side(), page: n2page(NARROW) }),
      "n2-quicklook": () => win({ hdr: n2hdr(N2PATH, "Search Lumen Bakery"), side: n2side(), page: n2page(false), over: n2ql() }),
      "n2-tags": () => win({ hdr: n2hdr([["tag", "Tags", "far"], ["", "Bakery"]], "Search tagged Bakery"), side: n2side("Bakery"), page: n2tagPage(), over: n2tagPop() }),
      "n3-folder": () => win({ hdr: n3hdr(["Home", "Documents", "Lumen Bakery"]), side: n3side(), page: n3page(NARROW) }),
      "n3-photos": () => win({ hdr: n3hdr(["Home", "Pictures", "Lisbon trip"]), side: n3side("lisbon"), page: n3photos() }),
      "c-copy": () => railed(win({ hdr: hdr({ path: ["Home", "Documents", "Lumen Bakery", "Website"], view: "columns" }), side: sideA("lumen", { noTiles: true }), page: pageC(false) + jobs(), over: replaceDlg() })),
    },
  });
})();
