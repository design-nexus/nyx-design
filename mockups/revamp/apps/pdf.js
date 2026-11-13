// Nyx PDF on the revamp page: today's problems and three options.
(() => {
  const DOCS = [
    ["Fern field guide", "~/Books", "Page 12 of 48", 25, "guide"],
    ["Orchard Lane lease", "~/Documents/Home", "Page 3 of 6", 50, "lease"],
    ["Q3 board report", "~/Work/Board", "Page 1 of 22", 5, "report"],
    ["Kitchen renovation quote", "~/Documents/Home", "Read to the end", 100, "quote"],
    ["Pine Ridge trail map", "~/Downloads", "Page 1 of 2", 50, "map"],
    ["Bike service manual", "~/Books", "Page 31 of 120", 26, "manual"],
    ["Choir concert programme", "~/Downloads", "Page 2 of 4", 50, "report"],
    ["Garden planting plan", "~/Documents/Home", "Page 1 of 3", 33, "quote"],
  ];

  /* ── A page of a PDF ───────────────────────────────────────────────── */
  const P = {
    fern: "Ferns grow best where the light is broken and the ground stays damp. In the shaded valley below the falls, the soft shield fern and the hart's-tongue share the banks with mosses that never quite dry out.",
    fern2: "The lady fern is the easiest to find. Its fronds are wide in the middle and narrow at both ends, and in autumn they turn a pale copper before they fall back to the crown.",
    fern3: "Look under the fronds for the rows of spore cases. Their shape tells most species apart more reliably than the leaves do, especially late in the season when the fronds are worn.",
  };
  const lines = (n, w = [100, 96, 98, 92, 70]) => Array.from({ length: n }, (_, i) => `<i style="width:${w[i % w.length]}%"></i>`).join("");
  const page = (kind = "guide", o = {}) => {
    const k = { guide: () => `
      <div class="ph">Chapter 3 · The shaded valley<span>12</span></div>
      <h3>Ferns of the damp banks</h3>
      <p>${o.hl ? P.fern.replace("the soft shield fern and the hart's-tongue", `<mark>the soft shield fern and the hart's-tongue</mark>`) : P.fern}</p>
      <div class="fig">${art("fern12", { h: 120, r: 2 })}<span>Fig. 3.2 · Lady fern in late summer</span></div>
      <p>${o.hl ? P.fern2.replace("turn a pale copper", `<u>turn a pale copper</u>`) : P.fern2}</p>
      <p>${P.fern3}</p>
      ${o.note ? `<span class="pnote" style="top:${o.noteTop || 130}px">${icon("note")}</span><div class="ptxt" style="top:${o.txtTop || 560}px">Check the banks below the second bridge</div>` : ""}
      ${o.ink ? `<svg class="ink" viewBox="0 0 200 60"><path d="M10 40 C 40 10, 70 55, 100 30 S 160 20, 190 38"/></svg>` : ""}`,
      lease: () => `
      <div class="ph">Orchard Lane Lettings<span>3 of 6</span></div>
      <h3 class="c">Residential lease agreement</h3>
      <p class="sm">This agreement is made between the landlord and the tenant named below, for the flat at 14 Orchard Lane, for a term of twelve months.</p>
      <div class="ff"><label>Tenant's full name</label><span class="fld ${o.fill ? "filled" : ""} ${o.focus ? "focus" : ""}">${o.fill ? "Robin Ashdown" : ""}</span></div>
      <div class="ff two"><div><label>Start date</label><span class="fld ${o.fill ? "filled" : ""}">${o.fill ? "1 December 2026" : ""}</span></div><div><label>Monthly rent</label><span class="fld filled">£1,150</span></div></div>
      <div class="ff"><label>Parking</label><span class="chk"><b class="${o.fill ? "on" : ""}">${o.fill ? "✓" : ""}</b>One space in the rear yard</span><span class="chk"><b></b>None</span></div>
      <p class="sm">${lines(0)}The tenant agrees to keep the flat in good order, to report repairs promptly, and not to sublet without written consent.</p>
      <div class="ff sig"><div><label>Tenant's signature</label><span class="sline">${o.sign ? `<span class="sigd">Robin Ashdown</span>` : ""}</span></div><div><label>Date</label><span class="fld ${o.fill ? "filled" : ""}">${o.fill ? "12/11/2026" : ""}</span></div></div>`,
      report: () => `<div class="ph">Q3 board report<span>1</span></div><h3>Quarter at a glance</h3><p class="sm">Revenue grew in every region, led by the coast stores.</p><div class="pbars">${[60, 72, 54, 88, 66, 92].map((v) => `<b style="height:${v}%"></b>`).join("")}</div><div class="plines">${lines(8)}</div>`,
      quote: () => `<div class="ph">Renovation quote<span>1</span></div><h3>Kitchen</h3><div class="plines">${lines(5)}</div><div class="ptbl">${lines(6, [100])}</div>`,
      map: () => `<div class="ph">Pine Ridge<span>1</span></div><div class="pmap">${art("pinemap", { h: "100%", r: 2 })}</div>`,
      manual: () => `<div class="ph">Service manual<span>31</span></div><h3>Brakes</h3><div class="plines">${lines(6)}</div><div class="fig">${art("bike31", { h: 80, r: 2 })}</div><div class="plines">${lines(4)}</div>`,
    }[kind];
    return `<div class="pp ${kind} ${o.cls || ""}" ${o.w ? `style="width:${o.w}px"` : ""}>${k()}</div>`;
  };
  const thumb = (kind, n, o = {}) => `<div class="th ${o.sel ? "sel" : ""} ${o.cur ? "cur" : ""}"><div class="tp">${page(kind, { cls: "mini" })}${o.rot ? `<span class="rot">${icon("rotate")}</span>` : ""}</div><span>${n}</span></div>`;

  /* ── Option A: a tidy sidebar, a labelled toolbar ──────────────────── */
  const sideA = (on = "library") => `
    ${grp("PDF", false, "", "accent")}
    ${navx("books", "Library", { active: on === "library", cnt: 24 })}
    ${navx("merge", "Combine PDFs")}
    ${grp("Open files", false, "", "violet")}
    ${navx("file-text", "Fern field guide", { active: on === "read" || on === "pages", sub: "" })}
    ${on === "read" || on === "pages" ? `<div class="subnav">${navx("eye", "Read", { active: on === "read" })}${navx("pages", "Pages", { active: on === "pages", cnt: 48 })}</div>` : ""}
    ${navx("file-text", "Orchard Lane lease", { badge: "•" })}
    ${navx("file-text", "Q3 board report")}
    <div class="foot hide-narrow">${icon("info")}<span>Drop PDFs anywhere to open them</span></div>`;
  const hdrA = (o = {}) => header({ icon: "file-text", name: "PDF", center: o.center || search("Search your files", "Ctrl F"), end: o.end || `<button class="newbtn">${icon("folder")}<span>Open</span><span class="key">Ctrl O</span></button>` });
  const libCard = ([n, path, at, pct, kind], i) => `<div class="lcard"><div class="lprev">${page(kind, { cls: "mini" })}</div><div class="lb"><b>${n}</b><span>${path}</span><div class="lprog"><span>${at}</span>${prog(pct, pct === 100 ? "ok" : "")}</div></div></div>`;
  const libraryA = () => `<div class="main ppage">
    ${pbar2("Library", "24 files", `${seg(["Recent", "Name"], "Recent")}${btn("Combine PDFs", "", "merge")}${btn("Open a file", "primary", "folder")}`)}
    <div class="content"><div class="lgrid">${DOCS.map(libCard).join("")}</div></div></div>`;
  const tools = (on = "Highlight", o = {}) => {
    const T = [["cursor", "Select"], ["-"], ["highlight", "Highlight", true], ["pen", "Draw"], ["note", "Note"], ["textbox", "Text", true], ["-"], ["sign", "Sign"]];
    return `<div class="tools">${T.map(([ic, n, more]) => ic === "-" ? '<span class="tsep"></span>' : `<span class="tl ${n === on ? "on" : ""}" title="${n}">${icon(ic)}<span class="tn">${n}</span>${more ? icon("chev-d", "tm") : ""}</span>`).join("")}${on !== "Select" ? `<span class="tcol" title="Colour and size"><b></b>${icon("chev-d")}</span>` : ""}</div>`;
  };
  const vbar = (o = {}) => `<div class="vbar">${ib("panel", "Side panel (F9)", o.panel ? "on" : "")}<span class="tsep"></span>${tools(o.tool)}<span class="sp"></span>${ib("undo", "Undo (Ctrl+Z)")}${ib("redo", "Redo (Ctrl+Shift+Z)")}${o.dirty ? btn("Save", "primary") : ""}</div>`;
  const pnav = (n = 12, of = 48) => `<div class="pnav">${ib("chev-l", "Back (Alt+←)")}<span class="pg"><span class="pf">${n}</span><span class="pt">of ${of}</span></span>${ib("chev-r", "Forward (Alt+→)")}</div>`;
  const hdrRead = () => hdrA({ center: pnav(), end: `${dd("Fit width", "zoom")}${ib("search", "Find in this file (Ctrl+F)")}${ib("more", "More: save a copy, print, present, page colours, close")}` });
  const panel = (on = "Pages") => `<div class="spanel"><div class="sph">${seg(["Pages", "Outline", "Markup"], on)}</div><div class="spb">${[["guide", 11], ["guide", 12, { cur: true }], ["manual", 13], ["guide", 14]].map(([k, n, o]) => thumb(k, n, o || {})).join("")}</div></div>`;
  const readA = () => `<div class="main ppage">${vbar({ tool: "Highlight", dirty: true, panel: !NARROW })}
    <div class="vbody">${NARROW ? "" : panel()}<div class="canvas">${page("guide", { hl: true, note: true, w: NARROW ? 520 : 560 })}</div></div></div>`;

  /* ── Option B: tabs and modes ──────────────────────────────────────── */
  const tabsB = (on = 1) => `<div class="tabs ptabs"><span class="tab ${on === 0 ? "on" : ""}">${icon("books")}<span class="tt">Library</span></span>${[["Fern field guide", false], ["Orchard Lane lease", true], ["Q3 board report", false]].map(([n, d], i) => `<span class="tab ${on === i + 1 ? "on" : ""}">${icon("file-text")}<span class="tt">${n}</span>${d ? '<span class="dirty"></span>' : ""}<span class="x">${icon("x")}</span></span>`).join("")}<span class="plus">${icon("plus")}</span></div>`;
  const modes = (on) => `<div class="pmodes">${[["eye", "Read"], ["highlight", "Mark up"], ["sign", "Fill & sign"], ["pages", "Pages"]].map(([ic, n]) => `<span class="pm ${n === on ? "on" : ""}">${icon(ic)}<span>${n}</span></span>`).join("")}</div>`;
  const hdrB = (on) => header({ icon: "file-text", name: "PDF", center: modes(on), end: `${ib("search", "Find (Ctrl+F)")}${ib("more", "More: open, save a copy, print, present, close")}` });
  const floatNav = () => `<div class="fnav pop">${ib("chev-l", "Previous page")}<span class="pg"><span class="pf">12</span><span class="pt">of 48</span></span>${ib("chev-r", "Next page")}<span class="tsep"></span>${ib("minus", "Zoom out")}<span class="zv">110%</span>${ib("plus", "Zoom in")}<span class="tsep"></span>${dd("Fit width")}</div>`;
  const readB = () => `<div class="main ppage">${tabsB(1)}<div class="vbody"><div class="canvas c2">${page("guide", { w: NARROW ? 560 : 620 })}</div>${floatNav()}</div></div>`;
  const inspB = () => `<div class="insp pinsp"><div class="ibody">
    <div class="lab">Highlight</div>
    <div class="card"><div class="row"><span class="k">Colour</span><span class="pcols">${["#f4d03f", "#7bd389", "#7fb8f5", "#f59bb4", "#c9a2f5"].map((c, i) => `<b style="background:${c}" class="${i === 0 ? "on" : ""}"></b>`).join("")}</span></div><div class="row"><span class="k">Opacity</span><span class="v">40%</span></div><div class="row"><span class="k">Kind</span>${seg(["Highlight", "Underline", "Strike"], "Highlight")}</div></div>
    <div class="lab">Markup in this file<span class="cnt">5</span></div>
    <div class="card mlist2">${[["#f4d03f", "Highlight · page 12", "the soft shield fern and the hart's-tongue"], ["#7fb8f5", "Underline · page 12", "turn a pale copper"], ["#f59bb4", "Note · page 12", "Check the banks below the second bridge"], ["#7bd389", "Drawing · page 9", ""], ["#f4d03f", "Highlight · page 4", "where the stream bends north"]].map(([c, t, q], i) => `<div class="row ${i === 0 ? "sel" : ""}"><span class="mdot" style="background:${c}"></span><div class="mt"><b>${t}</b>${q ? `<span>“${q}”</span>` : ""}</div></div>`).join("")}</div>
  </div></div>`;
  const markupB = () => `<div class="main ppage">${tabsB(1)}${vbar({ tool: "Highlight", dirty: true })}<div class="vbody"><div class="canvas c2">${page("guide", { hl: true, note: true, ink: true, w: 560, txtTop: 520 })}</div>${inspB()}</div></div>`;
  const pagesB = () => `<div class="main ppage">${tabsB(1)}
    <div class="selbar"><b>3 pages selected</b><span class="sp"></span>${btn("Rotate", "", "rotate")}${btn("Save as new file", "", "export")}${btn("Delete", "dtext", "trash")}<span class="tsep"></span>${btn("Add pages", "", "plus")}${btn("Save", "primary")}</div>
    <div class="content"><div class="pgrid">${[["guide", 9], ["guide", 10, { sel: true }], ["manual", 11, { sel: true, rot: true }], ["guide", 12, { sel: true }], ["guide", 13], ["manual", 14], ["guide", 15], ["guide", 16], ["report", 17], ["guide", 18], ["guide", 19], ["manual", 20]].map(([k, n, o]) => thumb(k, n, o || {})).join("")}</div>
    <p class="pnote2">${icon("info")} Drag pages to reorder them, or drop PDFs between them. Nothing changes on disk until you save.</p></div></div>`;

  /* ── Option C: a workspace with an inspector ───────────────────────── */
  const strip = (sel = [3]) => `<div class="pstrip">${[1, 2, 3, 4, 5, 6].map((n) => thumb(n === 3 ? "lease" : "quote", n, { cur: n === 3, sel: sel.includes(n) && sel.length > 1 })).join("")}</div>`;
  const inspC = () => `<div class="insp pinsp"><div class="ihead"><b class="it">Orchard Lane lease</b><span class="is">6 pages · a form with 7 fields · signed</span></div><div class="ibody">
    <div class="lab">Fill in<span class="cnt">5 of 7</span><span class="act">Clear the form</span></div>
    <div class="card">${[["Tenant's full name", "Robin Ashdown"], ["Start date", "1 December 2026"], ["Monthly rent", "£1,150"], ["Parking", "One space"], ["Date", "12/11/2026"], ["Guarantor", ""], ["Phone", ""]].map(([k, v]) => `<div class="row"><span class="k">${k}</span>${v ? `<span class="v">${v}</span>` : `<span class="add">Fill in</span>`}</div>`).join("")}</div>
    <div class="lab">Sign</div>
    <div class="card"><div class="row sigrow"><span class="sigd sm">Robin Ashdown</span><span class="sp"></span><span class="v ok">${icon("check")} On page 3</span></div><div class="row"><span class="add">${icon("plus")} Draw or add a signature</span></div></div>
  </div><div class="ifoot">${btn("Save", "primary")}${btn("Save a copy…", "ghost")}<span class="sp"></span>${ib("printer", "Print")}</div></div>`;
  const formC = () => `<div class="main ppage">
    <div class="vbar"><span class="pdoc">${icon("file-text")}<b>Orchard Lane lease</b><span class="dirty"></span></span><span class="sp"></span>${seg(["Read", "Mark up", "Fill & sign", "Pages"], "Fill & sign")}<span class="sp"></span>${ib("undo", "Undo")}${ib("redo", "Redo")}</div>
    <div class="vbody">${NARROW ? "" : strip()}<div class="canvas c2">${page("lease", { fill: true, sign: true, focus: true, w: NARROW ? 470 : 500 })}</div>${inspC()}</div></div>`;
  const inspRead = () => `<div class="insp pinsp"><div class="ihead"><b class="it">Fern field guide</b><span class="is">48 pages · 5 marks · no form</span></div><div class="ibody">
    <div class="lab">Outline</div>
    <div class="card otree">${[["1", "Before you go", 1, 0], ["2", "The high moor", 6, 0], ["3", "The shaded valley", 11, 0, true], ["", "Ferns of the damp banks", 12, 1, true], ["", "Mosses and liverworts", 17, 1], ["4", "The river meadows", 23, 0], ["5", "Telling them apart", 34, 0]].map(([n, t, p, d, on]) => `<div class="row ${on ? "on" : ""} ${d ? "deep" : ""}"><span class="on2">${n}</span><span class="k">${t}</span><span class="v">${p}</span></div>`).join("")}</div>
    <div class="lab">Your markup<span class="cnt">5</span><span class="act">Show all</span></div>
    <div class="card mlist2">${[["#f4d03f", "Highlight · page 12", "the soft shield fern and the hart's-tongue"], ["#7fb8f5", "Underline · page 12", "turn a pale copper"], ["#f59bb4", "Note · page 12", "Check the banks below the second bridge"]].map(([c, t, q]) => `<div class="row"><span class="mdot" style="background:${c}"></span><div class="mt"><b>${t}</b><span>“${q}”</span></div></div>`).join("")}</div>
  </div></div>`;
  const readC = () => `<div class="main ppage">
    <div class="vbar"><span class="pdoc">${icon("file-text")}<b>Fern field guide</b></span><span class="sp"></span>${seg(["Read", "Mark up", "Fill & sign", "Pages"], "Read")}<span class="sp"></span>${ib("undo", "Undo")}${ib("redo", "Redo")}</div>
    <div class="vbody">${[11, 12, 13, 14, 15, 16].reduce((a, n) => a + thumb(n === 13 ? "manual" : "guide", n, { cur: n === 12 }), '<div class="pstrip">') + "</div>"}<div class="canvas c2">${page("guide", { hl: true, note: true, w: 500, txtTop: 600 })}</div>${inspRead()}</div></div>`;
  const hdrC = (n = 3, of = 6) => header({ icon: "file-text", name: "PDF", start: `${btn("Library", "ghost", "books")}`, center: pnav(n, of), end: `${dd("Fit page", "zoom")}${ib("search", "Find (Ctrl+F)")}${ib("more", "More")}` });

  REG("pdf", {
    name: "PDF",
    summary: "PDF can already read, mark up, fill in, sign and rearrange, but you'd hardly know: the sidebar is three unlabelled icons even at full width, and every tool is a bare icon in one long strip.",
    problems: [
      "<b>A sidebar of three bare icons:</b> Library, Document and Pages are icons with no names even at 1280 px, and Document and Pages are there even when no file is open.",
      "<b>Every tool is a bare icon:</b> Select, Highlight, Underline, Strike out, Draw, Note, Text box, Edit text and Sign sit in one strip with the panel, undo, redo and save, and the header adds back, forward, zoom out, zoom in, fit width, fit page, layout and more: about twenty icons around one page.",
      "<b>The library is two big cards in an empty room:</b> no search of your files you can see (it's a bare magnifier in the header), and the path in bold competes with the name.",
      "<b>Two places for pages:</b> Pages is a separate sidebar page with its own save and undo, so rotating one page means leaving the one you're reading.",
      "<b>Forms and signatures are hidden features:</b> nothing says a file has fields to fill or needs a signature; you find out by clicking on it.",
      "<b>Open files are invisible:</b> tabs exist (Ctrl+Tab), but there's no list of what's open or which file has unsaved changes until you're in it.",
      "<b>Combine PDFs</b> sits next to Open a file as if it were as common, and appears again inside Pages.",
    ],
    today: [["pdf-1280", "Today at 1280 px", "Library: three bare icons and two cards"], ["pdf-800", "Today at 800 px", "The same, tighter"]],
    options: [
      { id: "a", name: "Labelled and tidy", idea: "The layout you have, with names. The sidebar says Library and Combine PDFs, then lists your open files (unsaved ones marked); the file you're in shows Read and Pages under it, so they only appear when they can work. The library is a grid of covers with where you left off. Reading, one toolbar sits above the page: tools with labels (Highlight and Text open their variants), the colour, undo, redo, and Save only while there's something to save. The header holds the page number and a single Fit width menu for zoom and layout.",
        shots: [["a-library", "Library", "Named sidebar, open files, covers with progress"], ["a-read", "Reading and marking up", "Labelled tools; the page number in the header"], ["a-read-800", "At 800 px", "Rail; the side panel floats; tools keep their icons"]] },
      { id: "b", name: "Tabs and modes", idea: "No sidebar: open files are tabs under the header (the Library is the first), and the header switches between four modes: Read, Mark up, Fill & sign, and Pages. Read is just the page with a small floating bar for the page and zoom. Mark up brings the tools and an inspector with the colour and a list of everything you've marked. Pages turns the file into a grid you select, rotate, delete, extract or add to. Best if you want reading to be quiet and editing to be deliberate.",
        shots: [["b-read", "Read", "Just the page; page and zoom float below"], ["b-markup", "Mark up", "Tools, the page and an inspector of your markup"], ["b-pages-800", "Pages at 800 px", "Select pages; labelled actions above the grid"]] },
      { id: "c", name: "A workspace", idea: "Built around getting a document done. Page thumbnails run down the left (drag them to reorder, so Pages and the reader are one view), the page sits in the middle, and an inspector on the right says what the file needs: the form's fields with what's filled and what's missing, the signature to place, then Save. The same inspector shows outline and markup in the other modes. Best for leases, forms and contracts rather than books.",
        shots: [["c-form", "Filling in and signing", "Fields and signature listed beside the page"], ["c-read", "Reading a book", "The same inspector shows the outline and your markup"], ["c-form-800", "At 800 px", "Thumbnails hide; the inspector stays"]] },
    ],
    pages: {
      "a-library": () => win({ hdr: hdrA(), side: sideA("library"), page: libraryA() }),
      "a-read": () => win({ hdr: hdrRead(), side: sideA("read"), page: readA() }),
      "b-read": () => win({ hdr: hdrB("Read"), side: "", page: readB() }),
      "b-markup": () => win({ hdr: hdrB("Mark up"), side: "", page: markupB() }),
      "b-pages": () => win({ hdr: hdrB("Pages"), side: "", page: pagesB() }),
      "c-form": () => win({ hdr: hdrC(), side: "", page: formC() }),
      "c-read": () => win({ hdr: hdrC(12, 48), side: "", page: readC() }),
    },
    icons: {
      books: '<path d="M4 4.5h4v15H4zM10 4.5h4v15h-4z"/><path d="m16 5.2 3.7-1 3 14.6-3.7 1z"/>',
      pages: '<rect x="4" y="3.5" width="7" height="9" rx="1.2"/><rect x="13" y="3.5" width="7" height="9" rx="1.2"/><rect x="4" y="14.5" width="7" height="6" rx="1.2"/><rect x="13" y="14.5" width="7" height="6" rx="1.2"/>',
      cursor: '<path d="M5 3.5 18.5 10l-6 1.8-2.3 6.2z"/>',
      highlight: '<path d="m14 4.5 5.5 5.5L11 18.5H5.5V13z"/><path d="M3 21h18"/>',
      note: '<path d="M5 4h14v11l-5 5H5z"/><path d="M14 20v-5h5"/>',
      textbox: '<rect x="3.5" y="4.5" width="17" height="15" rx="2"/><path d="M8 9h8M12 9v7"/>',
      sign: '<path d="M3 17c3-1 4-9 6-9s0 8 2 8 2-4 4-4 1 3 3 3 2-1 3-2"/><path d="M3 21h18"/>',
      undo: '<path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11"/>',
      redo: '<path d="m15 14 5-5-5-5"/><path d="M20 9H9.5a5.5 5.5 0 0 0 0 11H13"/>',
      rotate: '<path d="M20 12a8 8 0 1 1-2.3-5.7L20 8.5"/><path d="M20 3.5v5h-5"/>',
      zoom: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5M8 11h6M11 8v6"/>',
      minus: '<path d="M5 12h14"/>',
    },
  });
})();
