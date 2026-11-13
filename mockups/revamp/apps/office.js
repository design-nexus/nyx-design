// Nyx Office (Write, Sheets and Present) on the revamp page: today's problems and three options.
(() => {
  // The three apps: [icon, swatch, name, noun]
  const KD = { write: ["owrite", "blue", "Write", "document"], sheets: ["osheet", "green", "Sheets", "spreadsheet"], present: ["opresent", "coral", "Present", "presentation"] };
  const kic = (k, cls = "") => cls === "big" ? `<span class="kicb" style="--kc:var(--sw-${KD[k][1]})">${icon(KD[k][0])}</span>` : icon(KD[k][0], "kic").replace("<i ", `<i style="--kc:var(--sw-${KD[k][1]})" `);

  /* Small pictures of pages: a document, a sheet, a slide. */
  const miniDoc = (v = 0) => `<div class="mdoc v${v}"><b></b>${v === 1 ? '<em></em>' : ""}<i class="w9"></i><i class="w7"></i><i class="w8"></i>${v === 2 ? '<s></s>' : ""}<i class="w6"></i><i class="w9"></i><i class="w5"></i>${v === 3 ? "" : '<i class="w8"></i><i class="w7"></i>'}</div>`;
  const miniSheet = (v = 0) => `<div class="msheet v${v}">${Array.from({ length: 7 }, (_, r) => `<div class="mr ${r === 0 ? "h" : ""}">${Array.from({ length: 4 }, (_, c) => `<span class="${r > 0 && c > 0 && (r + c + v) % 3 === 0 ? "n" : ""}"></span>`).join("")}</div>`).join("")}</div>`;
  const miniSlide = (seed) => `<div class="mslide">${art(seed, { r: 3 })}<b></b><i></i></div>`;

  const hdrDoc = (k, title, o = {}) => header({
    icon: KD[k][0], name: o.app || KD[k][2],
    start: `<div class="doc"><span class="dim">·</span><b>${title}</b>${o.saved === false ? '<span class="dot" title="Not saved"></span>' : `<span class="saved">${o.savedText || "Saved"}</span>`}</div>`,
    center: o.center || "",
    end: o.end || "",
  });
  const tint = (html, k) => html.replace('class="app-ic"', `class="app-ic" style="color:var(--sw-${KD[k][1]})"`);
  const noToggle = (html) => html.replace('<div class="hdr-start">' + ib("sidebar", "Sidebar (Ctrl+B)"), '<div class="hdr-start">');
  const zoom = (z = "90%") => `<span class="zoom">${ib("minus", "Zoom out")}<span>${z}</span>${ib("plus", "Zoom in")}</span>`;

  /* ── The document everyone edits ───────────────────────────────────────── */
  const paper = (o = {}) => `<div class="paper ${o.cls || ""}">
    <div class="pk">GREENWAY GARDEN CLUB</div>
    <h1>Spring newsletter</h1>
    <div class="psub">March 2026 · Issue 14</div>
    <h2>This month</h2>
    <p>The beds by the gate are finally dug over, and the first broad beans are up. Thank you to everyone who came out in the rain on Sunday — twelve of you, and two dogs.</p>
    <div class="pfig">${art("raised-beds-7", { w: "100%", h: 96, r: 2 })}<span>The new raised beds, week two</span></div>
    <h2>Seed swap${o.sel ? '<span class="caret"></span>' : ""}</h2>
    <p>Bring what you saved last autumn to the hall on <span class="${o.hl ? "hl" : ""}">Saturday 14 March, 10 till 1</span>. Label your packets with the variety and the year. ${o.comment ? '<span class="cm">We’ll have spare envelopes</span>' : "We’ll have spare envelopes"} and a table for anything unusual.</p>
    <ul><li>Tomatoes, beans and squash are always wanted</li><li>Flower seeds go on the green table</li><li>Please, no seed you bought this year</li></ul>
    <h2>Volunteers needed</h2>
    <p>We need four people for the compost rota in April. Sign up on the board in the shed, or reply to this newsletter.</p>
  </div>`;

  const tbBtn = (i, t, on) => `<button class="ib ${on ? "on" : ""}" title="${t}">${icon(i)}</button>`;
  const sep = '<span class="tsep"></span>';

  /* ── Option A: three apps, tidied ─────────────────────────────────────── */
  const tmplCard = (title, desc, pic) => `<div class="tcard"><div class="tpic">${pic}</div><div class="tb"><b>${title}</b><span>${desc}</span></div></div>`;
  const recentDoc = (title, where, when, fmt, v) => `<div class="rdoc"><div class="tpic">${miniDoc(v)}</div><div class="tb"><b>${title}</b><span>${where}</span><span class="w">${when}<span class="fmt">${fmt}</span></span></div></div>`;

  const homeA = (narrow) => `<div class="ohome"><div class="clamp" style="--clamp: 980px">
    <div class="banner2 orecover">${icon("history")}<div class="tx"><b>Bring back your unsaved work?</b><span>“Minutes, March meeting” closed unexpectedly yesterday at 18:20.</span></div>${btn("Discard", "ghost")}${btn("Bring it back", "primary")}</div>
    <div class="sechead">Start something new</div>
    <div class="tgrid">
      ${tmplCard("Blank document", "An empty page", `<div class="mdoc blank"></div>`)}
      ${tmplCard("Personal letter", "Your address, the date and a friendly letter", miniDoc(1))}
      ${tmplCard("Recipe", "Ingredients, steps and notes for a dish", miniDoc(2))}
      ${tmplCard("Journal", "Today, the highlights and what's next", miniDoc(3))}
    </div>
    <div class="sechead">Recent<span class="more">${narrow ? "" : "Sort: Last opened"}</span></div>
    <div class="rgrid2">
      ${recentDoc("Spring newsletter", "Documents › Garden club", "Today 10:42", "NWRITE", 0)}
      ${recentDoc("Minutes, March meeting", "Documents › Garden club", "Yesterday", "DOCX", 3)}
      ${recentDoc("Letter to the council", "Documents", "Mar 2", "ODT", 1)}
      ${recentDoc("Lemon drizzle", "Documents › Recipes", "Feb 18", "MD", 2)}
      ${narrow ? "" : recentDoc("Reading list", "Desktop", "Feb 3", "TXT", 0)}
    </div>
    <div class="openline">${icon("info")}<span>Write opens .nwrite, .docx, .odt, .md and .txt. Drop a file anywhere on the window to open it.</span></div>
  </div></div>`;

  const sideWrite = () => `
    ${navx("home", "Home")}
    ${navx("owrite", "Spring newsletter", { active: true })}
    <div class="hide-narrow">${grp("Outline", false, "", "accent")}</div>
    <div class="hide-narrow outline">
      <div class="ol l1">Spring newsletter</div>
      <div class="ol l2">This month</div>
      <div class="ol l2 on">Seed swap</div>
      <div class="ol l2">Volunteers needed</div>
      <div class="ol l2">Dates for your diary</div>
      <div class="ol l3">Open day</div>
      <div class="ol l3">Autumn show</div>
    </div>
    <div class="foot">${icon("check-c", "ok")}<span>1,240 words · saved 10:42</span></div>`;

  const toolbarA = (narrow) => `<div class="otb">
    ${tbBtn("undo", "Undo (Ctrl+Z)")}${tbBtn("redo", "Redo (Ctrl+Shift+Z)")}${sep}
    ${dd("Heading 2")}${narrow ? "" : dd("Inter") + `<span class="dd num">12${icon("chev-d")}</span>`}${sep}
    ${tbBtn("bold", "Bold (Ctrl+B)")}${tbBtn("italic", "Italic (Ctrl+I)")}${tbBtn("underline", "Underline (Ctrl+U)")}${narrow ? "" : `<button class="ib col" title="Text colour">${icon("textcol")}<b style="background:#2d6a4f"></b></button><button class="ib col" title="Highlight">${icon("marker")}<b style="background:#f5d547"></b></button>`}${sep}
    ${tbBtn("ul", "Bulleted list")}${tbBtn("ol", "Numbered list")}${sep}
    <button class="btn ghost ins">${icon("plus")}<span>Insert</span>${icon("chev-d")}</button>
    ${tbBtn("chat", "Comment (Ctrl+Alt+M)")}
  </div>`;

  const inspWrite = () => `<div class="insp oinsp">
    <div class="isegs">${seg(["Text", "Page", "Review"], "Text")}</div>
    <div class="ibody">
      <div class="lab">Style</div>
      <div class="card"><div class="row"><span class="k">Heading 2</span><span class="v dim">Inter 15 · semibold</span></div>
        <div class="row"><span class="add">Make every Heading 2 look like this</span></div>
        <div class="row"><span class="add muted">Put it back as it was</span></div></div>
      <div class="lab">Paragraph</div>
      <div class="card">
        <div class="row"><span class="k">Alignment</span><div class="seg icons sm">${[["al-left", 1], ["al-center"], ["al-right"], ["al-just"]].map(([i, on]) => `<button class="${on ? "on" : ""}">${icon(i)}</button>`).join("")}</div></div>
        <div class="row"><span class="k">Line spacing</span>${dd("1.15")}</div>
        <div class="row"><span class="k">Space before</span><span class="fld">12 pt</span></div>
        <div class="row"><span class="k">Space after</span><span class="fld">6 pt</span></div>
        <div class="row"><span class="k">Indent</span><span class="stepr">${ib("outdent", "Outdent (Shift+Tab)")}${ib("indent", "Indent (Tab)")}</span></div>
      </div>
      <div class="lab">In the text</div>
      <div class="ibtns">${btn("Link", "sm", "link")}${btn("Symbol", "sm", "omega")}${btn("Footnote", "sm", "fnote")}${btn("Copy formatting", "sm", "brush")}</div>
    </div></div>`;

  const writeA = (narrow) => `<div class="cols"><div class="main">${toolbarA(narrow)}<div class="desk">${paper({ sel: true })}</div></div>${narrow ? "" : inspWrite()}</div>`;

  /* ── Option B: one Office app ─────────────────────────────────────────── */
  const sideB = (on = "home") => `
    ${navx("home", "Home", { active: on === "home" })}
    ${navx("clock", "Recent", { cnt: 14 })}
    ${grp("Kinds", false, "", "accent")}
    <div class="navx">${kic("write")}<span>Documents</span><span class="cnt">8</span></div>
    <div class="navx">${kic("sheets")}<span>Spreadsheets</span><span class="cnt">4</span></div>
    <div class="navx">${kic("present")}<span>Presentations</span><span class="cnt">2</span></div>
    ${grp("Templates", false, "", "green")}
    ${navx("sparkle", "All templates", { cnt: 9 })}
    <div class="foot">${icon("check-c", "ok")}<span>Saves on its own</span></div>`;

  const ftabs = (on) => `<div class="tabs otabs">
    <div class="tab ${on === "home" ? "on" : ""}">${icon("home")}<span class="tt">Home</span></div>
    <div class="tab ${on === "write" ? "on" : ""}">${kic("write")}<span class="tt">Spring newsletter</span>${on === "write" ? `<span class="x">${icon("x")}</span>` : ""}</div>
    <div class="tab ${on === "sheets" ? "on" : ""}">${kic("sheets")}<span class="tt">Club budget 2026</span><span class="udot" title="Not saved"></span></div>
    <div class="tab ${on === "present" ? "on" : ""}">${kic("present")}<span class="tt">Open day talk</span></div>
    <span class="plus">${icon("plus")}</span></div>`;

  const newCard = (k, title, picks) => `<div class="ncard" style="--kc:var(--sw-${KD[k][1]})"><div class="nh">${kic(k, "big")}<div><b>${title}</b><span>Blank, or from a template</span></div></div><div class="picks"><span class="pk2 blank">${icon("plus")}Blank</span>${picks.map((p) => `<span class="pk2">${p}</span>`).join("")}</div></div>`;
  const RECENT = [
    ["write", "Spring newsletter", "Documents › Garden club", "Today 10:42", "NWRITE"],
    ["sheets", "Club budget 2026", "Documents › Garden club", "Today 09:15", "XLSX"],
    ["present", "Open day talk", "Documents › Garden club", "Yesterday", "PPTX"],
    ["write", "Minutes, March meeting", "Documents › Garden club", "Yesterday", "DOCX"],
    ["sheets", "Seed swap list", "Desktop", "Mar 4", "ODS"],
    ["write", "Letter to the council", "Documents", "Mar 2", "ODT"],
    ["sheets", "Plot holders.csv", "Downloads", "Feb 27", "CSV"],
  ];
  const homeB = (narrow) => `<div class="ohome"><div class="clamp" style="--clamp: 980px">
    <div class="banner2 orecover">${icon("history")}<div class="tx"><b>Bring back your unsaved work?</b><span>“Seed swap list” closed unexpectedly yesterday at 18:20.</span></div>${btn("Discard", "ghost")}${btn("Bring it back", "primary")}</div>
    <div class="sechead">New</div>
    <div class="ngrid">
      ${newCard("write", "Document", ["Letter", "Recipe", "Journal"])}
      ${newCard("sheets", "Spreadsheet", ["Budget", "Inventory", "Trip"])}
      ${newCard("present", "Presentation", ["Trip plan", "Celebration", "Story"])}
    </div>
    <div class="sechead">Recent<span class="more">${seg(["All", "Documents", "Sheets", "Slides"], "All")}</span></div>
    <div class="rtbl">${RECENT.slice(0, narrow ? 6 : 7).map(([k, n, w, t, f], i) => `<div class="rr ${i === 0 ? "" : ""}">${kic(k)}<span class="n">${n}</span><span class="w wide-only">${w}</span><span class="fmt">${f}</span><span class="t">${t}</span></div>`).join("")}</div>
    <div class="openline">${btn("Open a file…", "", "folder")}<span>Word, Excel, PowerPoint, OpenDocument, Markdown, CSV and text files.</span></div>
  </div></div>`;

  const COLS = ["A", "B", "C", "D", "E", "F", "G", "H"];
  const ROWS = [
    [["Club budget 2026", "title"]],
    [],
    [["Category", "th"], ["Planned", "th r"], ["Actual", "th r"], ["Difference", "th r"], ["Notes", "th"]],
    [["Seeds & bulbs"], ["$420.00", "r"], ["$386.50", "r"], ["$33.50", "r"], [""]],
    [["Tools"], ["$300.00", "r"], ["$342.00", "r"], ["−$42.00", "r bad"], ["Two new hoes"]],
    [["Hall rent"], ["$600.00", "r"], ["$600.00", "r"], ["$0.00", "r"], [""]],
    [["Refreshments"], ["$180.00", "r"], ["$154.20", "r"], ["$25.80", "r"], ["Open day tea"]],
    [["Printing"], ["$90.00", "r"], ["$112.40", "r"], ["−$22.40", "r bad"], ["Extra flyers"]],
    [["Website"], ["$120.00", "r"], ["$120.00", "r"], ["$0.00", "r"], [""]],
    [["Total", "tot"], ["$1,710.00", "r tot"], ["$1,715.10", "r tot"], ["−$5.10", "r tot bad"], ["", "tot"]],
  ];
  const grid = (narrow) => {
    const nc = narrow ? 6 : 8, nr = 22;
    const head = `<div class="gr gh"><span class="corner"></span>${COLS.slice(0, nc).map((c) => `<span class="${c === "D" ? "on" : ""}">${c}</span>`).join("")}</div>`;
    const body = Array.from({ length: nr }, (_, r) => {
      const row = ROWS[r] || [];
      const inSel = r >= 3 && r <= 8;
      return `<div class="gr ${r === 0 ? "first" : ""}"><span class="rh ${inSel ? "on" : ""}">${r + 1}</span>${COLS.slice(0, nc).map((c, ci) => {
        const [v, cls] = row[ci] || ["", ""];
        const sel = ci === 3 && inSel;
        return `<span class="c ${cls || ""} ${sel ? "sel" : ""} ${sel && r === 3 ? "act" : ""} ${sel && r === 8 ? "selend" : ""}">${v || ""}</span>`;
      }).join("")}</div>`;
    }).join("");
    return `<div class="grid">${head}${body}${narrow ? "" : `<div class="pchart pop2"><div class="ch">Planned and actual</div>${chartSvg()}<div class="lg"><span><i style="background:var(--sw-green)"></i>Planned</span><span><i style="background:var(--sw-teal)"></i>Actual</span></div></div>`}</div>`;
  };
  const chartSvg = () => {
    const P = [420, 300, 600, 180, 90, 120], A = [386.5, 342, 600, 154.2, 112.4, 120], h = 120, max = 640;
    return `<svg viewBox="0 0 240 ${h + 18}" width="240" height="${h + 18}">${[0, 1, 2, 3].map((g) => `<path d="M0 ${h - (g * h) / 3} H240" stroke="#e5e7eb" stroke-width="1"/>`).join("")}${P.map((p, i) => `<rect x="${i * 40 + 6}" y="${h - (p / max) * h}" width="13" height="${(p / max) * h}" fill="#40916c" rx="1.5"/><rect x="${i * 40 + 20}" y="${h - (A[i] / max) * h}" width="13" height="${(A[i] / max) * h}" fill="#52b5b8" rx="1.5"/><text x="${i * 40 + 20}" y="${h + 13}" font-size="8.5" fill="#6b7280" text-anchor="middle">${["Seeds", "Tools", "Hall", "Tea", "Print", "Web"][i]}</text>`).join("")}</svg>`;
  };
  const toolbarSheet = (narrow) => `<div class="otb">
    ${tbBtn("undo", "Undo")}${tbBtn("redo", "Redo")}${sep}
    ${tbBtn("bold", "Bold")}${tbBtn("italic", "Italic")}${narrow ? "" : `<button class="ib col" title="Fill colour">${icon("marker")}<b style="background:#b7e4c7"></b></button>`}${sep}
    ${tbBtn("currency", "Currency", true)}${tbBtn("percent", "Percent")}${narrow ? "" : tbBtn("merge2", "Merge cells") + tbBtn("wrap", "Wrap text")}${sep}
    ${tbBtn("sort", "Sort A to Z")}${tbBtn("filter", "Filter")}${sep}
    <button class="btn ghost ins">${icon("plus")}<span>Insert</span>${icon("chev-d")}</button>
    <span class="sp"></span>${narrow ? "" : btn("Summarize", "ghost", "sigma")}
  </div>
  <div class="fbar"><span class="nb">D4:D9</span><span class="fx">${icon("fx")}</span><span class="fv"><b class="ref">=B4</b>−<b class="ref2">C4</b></span></div>`;
  const sheetTabs = () => `<div class="stabs"><span class="st on">Budget</span><span class="st">Members</span><span class="st">Events</span><span class="st add">${icon("plus")}</span><span class="sp"></span><span class="sum">Sum <b>−$5.10</b> · Average <b>−$0.85</b> · Count <b>6</b></span></div>`;
  const inspSheet = () => `<div class="insp oinsp">
    <div class="isegs">${seg(["Cell", "Number", "Data", "Page"], "Number")}</div>
    <div class="ibody">
      <div class="lab">Format</div>
      <div class="card fmts">${[["General", "1715.1"], ["Number", "1,715.10"], ["Currency", "$1,715.10", true], ["Percent", "171510%"], ["Date", "5 Oct 2026"]].map(([n, e, on]) => `<div class="row ${on ? "on" : ""}"><span class="k">${n}</span><span class="v dim">${e}</span>${on ? icon("check", "ck") : ""}</div>`).join("")}</div>
      <div class="lab">Currency</div>
      <div class="card">
        <div class="row"><span class="k">Symbol</span>${dd("$ Dollar")}</div>
        <div class="row"><span class="k">Decimals</span><span class="stepr">${ib("minus", "Fewer")}<span class="n">2</span>${ib("plus", "More")}</span></div>
        <div class="row"><span class="k">Below zero</span>${dd("−$1.00 in red")}</div>
      </div>
      <div class="lab">Your own format</div>
      <div class="field mono">$#,##0.00;[Red]−$#,##0.00</div>
    </div></div>`;
  const sheetB = (narrow) => `${ftabs("sheets")}<div class="cols"><div class="main">${toolbarSheet(narrow)}${grid(narrow)}${sheetTabs()}</div>${narrow ? "" : inspSheet()}</div>`;
  const sideSheet = () => sideB("none");

  /* ── Option C: just the page ──────────────────────────────────────────── */
  const floatBar = (x, y) => `<div class="fbar2 pop" style="left:${x}px;top:${y}px">${dd("Normal text")}<span class="tsep"></span>${tbBtn("bold", "Bold", true)}${tbBtn("italic", "Italic")}${tbBtn("underline", "Underline")}<button class="ib col">${icon("marker")}<b style="background:#f5d547"></b></button><span class="tsep"></span>${tbBtn("link", "Link (Ctrl+K)")}${tbBtn("chat", "Comment (Ctrl+Alt+M)")}${tbBtn("more", "More")}</div>`;
  const margin = (narrow) => narrow ? "" : `<div class="margin">
    <div class="mcard on">${av("Ruth Okoye", 24)}<div><div class="mh"><b>Ruth Okoye</b><span>9:40</span></div><p>Can we say how many envelopes? Last year we ran out by eleven.</p><div class="ma"><span>Reply</span><span>Resolve</span></div></div></div>
    <div class="mcard">${av("Dev Patel", 24)}<div><div class="mh"><b>Dev Patel</b><span>Yesterday</span></div><p>Rota sheet is in the shed, top shelf.</p></div></div>
  </div>`;
  const writeC = (narrow) => `<div class="desk cdesk ${narrow ? "n" : ""}"><div class="pwrap">${paper({ hl: true, comment: true, cls: "c" })}${margin(narrow)}</div>${floatBar(narrow ? 112 : 230, narrow ? 240 : 258)}<div class="wcount">${icon("check-c")}1,240 words · saved</div></div>`;

  const SLIDES = [["Welcome to the open day", "s1"], ["What we grow", "s2"], ["A year on the plots", "s3"], ["How to join", "s4"], ["Seed swap", "s5"], ["Thank you", "s6"]];
  const presentC = () => `<div class="cols"><div class="list slides">${SLIDES.map(([t, s], i) => `<div class="sl ${i === 0 ? "on" : ""}"><span class="no">${i + 1}</span><div class="th">${art("slide" + s, { r: 4 })}<span>${t}</span></div></div>`).join("")}<div class="sladd">${icon("plus")}New slide</div></div>
    <div class="main stage">
      <div class="canvas"><div class="slide">${art("open-day-hero", { r: 0, cls: "bg" })}<div class="shade"></div><div class="tbox sel"><span class="h">Welcome to the open day</span><span class="hd tl"></span><span class="hd tr"></span><span class="hd bl"></span><span class="hd br"></span><span class="rot"></span></div><div class="sub">Greenway Garden Club · Saturday 14 March</div></div>
        <div class="fbar2 pop" style="left:50%;top:18px;transform:translateX(-50%)">${dd("Inter Display")}<span class="dd num">54${icon("chev-d")}</span><span class="tsep"></span>${tbBtn("bold", "Bold", true)}${tbBtn("italic", "Italic")}<button class="ib col">${icon("textcol")}<b style="background:#fff"></b></button><span class="tsep"></span>${btn("Animate", "ghost sm", "sparkle")}${btn("Arrange", "ghost sm", "layers")}</div>
      </div>
      <div class="notes"><b>Speaker notes</b><p>Thank everyone for coming. Point out the tea table and the seed swap at the back. Keep this under two minutes.</p></div>
    </div></div>`;

  REG("office", {
    name: "Office",
    summary: "Write, Sheets and Present open and save Word, Excel and PowerPoint files and do a great deal, but each starts on a sparse Home with a single icon in its sidebar, and the editors hide most of what they can do behind bare icons and an Inspector you have to know is there.",
    problems: [
      "<b>A sidebar with one icon in it:</b> on Home the sidebar is a single house; the open file and its outline only appear once something is open, so the left of the window is empty most of the time.",
      "<b>Recent files as plain text rows:</b> a name and a path (often a long hidden one), an Open button on each row, and nothing to show what the file looks like.",
      "<b>“Open a file” is a row inside Recent</b>, listing extensions (“.nwrite, .docx, .odt…”) instead of being a button in the header; there's no New button outside Home either.",
      "<b>Three apps that look like one:</b> Write, Sheets and Present have the same blue house and the same Home; nothing tells you which one you're in except the name, and moving from a document to a spreadsheet means another window.",
      "<b>The editing bar is a row of bare icons</b> (bold, alignment, lists, picture, table, link, comment, then a More menu), and much of it appears again in the Inspector, so the same control lives in two places.",
      "<b>Header readouts are tiny:</b> “1 recent file” or a word count sits at the far right in small type, beside the window buttons.",
      "<b>At 800 px</b> the template cards turn into two big empty boxes, and in a document the Inspector and the bar compete for the width.",
    ],
    today: [["office-1280", "Write's Home at 1280 px", "One icon in the sidebar; Recent is text rows"], ["office-800", "Write's Home at 800 px", "Big empty template cards"], ["office-sheets-1280", "Sheets' Home at 1280 px", "The same page with different templates"]],
    options: [
      { id: "a", name: "Three apps, tidied", idea: "Keep Write, Sheets and Present as three apps, each with its own colour. Home has no sidebar: unsaved work to bring back at the top, templates as little pages, and recent files as thumbnails with their format. In a file, the sidebar is the outline (or the slides); the bar along the top holds the everyday formatting, with Insert as one labelled menu instead of six bare icons, and the Inspector only holds what isn't in the bar (paragraph spacing, styles, page setup and review), so nothing appears twice.",
        shots: [["a-home", "Write's Home", "Recovery, templates as pages, recent as thumbnails"], ["a-write", "Writing", "Outline, the everyday bar, an Inspector without repeats"], ["a-write-800", "At 800 px", "Rail, bar and page; the Inspector folds away"]] },
      { id: "b", name: "One Office app", idea: "One window for all three, like a browser with tabs: a document, a spreadsheet and a presentation open side by side as tabs, each with its colour. Home starts any of the three (blank or from a template) and lists every recent file with a filter for the kind. The sidebar sorts files by kind and keeps templates together. The Inspector stays on the right for whichever file is in front.",
        shots: [["b-home", "Home", "New of any kind; every recent file"], ["b-sheet", "A spreadsheet in a tab", "Formula bar, sheet tabs, number formats"], ["b-home-800", "At 800 px", "Rail and the same Home"]] },
      { id: "c", name: "Just the page", idea: "The document is the whole window. No sidebar and no Inspector: a small bar floats beside what you've selected with what fits it (text styles for text, size and wrap for a picture, Animate and Arrange on a slide), and comments sit in the margin next to the text they're about. The outline, find and page setup are a click away in the header. Best for writing and presenting rather than heavy formatting.",
        shots: [["c-write", "Writing", "A floating bar and comments in the margin"], ["c-present", "A presentation", "Slides on the left, the slide and its notes"], ["c-write-800", "At 800 px", "The page and the bar, comments as a count"]] },
    ],
    icons: {
      owrite: '<path d="M14 3H7.5A2.5 2.5 0 0 0 5 5.5v13A2.5 2.5 0 0 0 7.5 21h9a2.5 2.5 0 0 0 2.5-2.5V8z"/><path d="M14 3v5h5M8.5 12.5h7M8.5 16h5"/>',
      osheet: '<path d="M14 3H7.5A2.5 2.5 0 0 0 5 5.5v13A2.5 2.5 0 0 0 7.5 21h9a2.5 2.5 0 0 0 2.5-2.5V8z"/><path d="M14 3v5h5M8.5 11.5h7v6h-7zM8.5 14.5h7M12 11.5v6"/>',
      opresent: '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M12 16v4M8.5 20.5h7M8 9.5h5M8 12h8"/>',
      underline: '<path d="M7 4v7a5 5 0 0 0 10 0V4M5 20.5h14"/>',
      "al-left": '<path d="M4 6h16M4 10.5h10M4 15h16M4 19.5h10"/>',
      "al-center": '<path d="M4 6h16M7 10.5h10M4 15h16M7 19.5h10"/>',
      "al-right": '<path d="M4 6h16M10 10.5h10M4 15h16M10 19.5h10"/>',
      "al-just": '<path d="M4 6h16M4 10.5h16M4 15h16M4 19.5h10"/>',
      ol: '<path d="M10 6h10M10 12h10M10 18h10M4 4.5h1.5V9M4 9h3M4 14.5a1.5 1.5 0 0 1 3 .4c0 1-3 2.1-3 3.6h3"/>',
      undo: '<path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11"/>',
      redo: '<path d="m15 14 5-5-5-5"/><path d="M20 9H9.5a5.5 5.5 0 0 0 0 11H13"/>',
      textcol: '<path d="m6 16 6-12 6 12M8.2 11.5h7.6"/>',
      marker: '<path d="m9 11-5 5v3h3l5-5M14.5 4.5l5 5-7 7-5-5z"/>',
      minus: '<path d="M5 12h14"/>',
      outdent: '<path d="M21 5H11M21 12H11M21 19H11M7 8l-4 4 4 4"/>',
      indent: '<path d="M21 5H11M21 12H11M21 19H11M3 8l4 4-4 4"/>',
      omega: '<path d="M4.5 20h5v-2.5a7 7 0 1 1 5 0V20h5"/>',
      fnote: '<path d="M4 6h10M4 11h10M4 16h6M17 4.5h2V10M16.5 10h3.5"/>',
      brush: '<path d="M18.5 3.5a2 2 0 0 1 2.8 2.8L13 14.6 10.4 12z"/><path d="M10 13.5c-2.5 0-4 1.6-4 3.8 0 1.4-1 2.5-2.5 2.7 1.3.7 2.8 1 4.2 1 3 0 5.3-2 5.3-4.6"/>',
      currency: '<path d="M12 3v18M16.5 7c-.7-1.3-2.3-2-4.5-2-2.6 0-4.5 1.3-4.5 3.4 0 4.8 9.5 2.4 9.5 7.2 0 2.1-2 3.4-5 3.4-2.3 0-4-.8-4.8-2.2"/>',
      percent: '<path d="M19 5 5 19"/><circle cx="7" cy="7" r="2.5"/><circle cx="17" cy="17" r="2.5"/>',
      merge2: '<rect x="3" y="4" width="18" height="16" rx="2.5"/><path d="M12 4v4M12 16v4M7 12h10M14.5 9.5 17 12l-2.5 2.5M9.5 9.5 7 12l2.5 2.5"/>',
      wrap: '<path d="M4 6h16M4 12h13a3 3 0 0 1 0 6h-4M4 18h5M15 16l-2 2 2 2"/>',
      sigma: '<path d="M18 5H6l6 7-6 7h12"/>',
      fx: '<path d="M14 4.5h-1.5A2.5 2.5 0 0 0 10 7v12.5a2.5 2.5 0 0 1-2.5 2M7 10h6M15 12l5 6M20 12l-5 6"/>',
    },
    pages: {
      "a-home": () => win({ hdr: tint(header({ icon: "owrite", name: "Write", center: search("Search your documents", "Ctrl F"), end: `${btn("Open…", "ghost", "folder")}<button class="newbtn">${icon("plus")}<span>New document</span><span class="key">Ctrl N</span></button>` }), "write"), side: "", page: homeA(NARROW) }),
      "a-write": () => win({ hdr: tint(hdrDoc("write", "Spring newsletter", { end: `${NARROW ? "" : zoom("90%")}${ib("search", "Find (Ctrl+F)")}${ib("eye", "Focus mode (Ctrl+Shift+F)")}${NARROW ? "" : ib("panel", "Inspector (Ctrl+Alt+I)", "on")}<span class="gap"></span>${btn(NARROW ? "PDF" : "Export PDF", "", "export")}` }), "write"), side: sideWrite(), page: writeA(NARROW) }),
      "b-home": () => win({ hdr: header({ icon: "owrite", name: "Office", center: search("Search documents, sheets and slides", "Ctrl F", "wide"), end: `${btn("Open…", "ghost", "folder")}<button class="newbtn">${icon("plus")}<span>New</span>${icon("chev-d", "dd-chev")}</button>` }), side: sideB("home"), page: `${ftabs("home")}${homeB(NARROW)}` }),
      "b-sheet": () => win({ hdr: header({ icon: "owrite", name: "Office", start: `<div class="doc"><span class="dim">·</span><b>Club budget 2026</b><span class="dot" title="Not saved"></span></div>`, end: `${zoom("100%")}${ib("search", "Find (Ctrl+F)")}${ib("panel", "Inspector (Ctrl+Alt+I)", "on")}<span class="gap"></span>${btn("Export PDF", "", "export")}` }), side: sideSheet(), page: sheetB(NARROW) }),
      "c-write": () => win({ hdr: noToggle(header({ icon: "owrite", name: "Write", start: `${btn("Home", "ghost", "chev-l")}<div class="doc"><b>Spring newsletter</b><span class="saved">Saved</span></div>`, end: `${ib("outline", "Outline")}<button class="ib cmb" title="Comments">${icon("chat")}<span class="bdg">2</span></button>${ib("search", "Find (Ctrl+F)")}${NARROW ? "" : zoom("100%")}${ib("more", "Page setup, export, print")}` })), side: "", page: writeC(NARROW) }),
      "c-present": () => win({ hdr: tint(noToggle(header({ icon: "opresent", name: "Present", start: `${btn("Home", "ghost", "chev-l")}<div class="doc"><b>Open day talk</b><span class="saved">Saved</span></div>`, end: `${btn("New slide", "ghost", "plus")}${ib("search", "Find (Ctrl+F)")}${zoom("Fit")}${ib("more", "Looks, master slide, export")}<span class="gap"></span><button class="btn primary">${icon("play")}<span>Present</span><span class="key2">F5</span></button>` })), "present"), side: "", page: presentC() }),
    },
  });
})();
