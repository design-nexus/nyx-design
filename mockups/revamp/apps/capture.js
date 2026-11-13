// Nyx Capture on the revamp page: today's problems (from the code) and three options.
(() => {
  /* Made-up screens, drawn small: a picture of a window, not part of the app. */
  const lines = (n, w = [90, 70, 82, 60, 76]) => Array.from({ length: n }, (_, i) => `<i style="width:${w[i % w.length]}%"></i>`).join("");
  const fake = (kind, o = {}) => {
    const t = {
      invoice: `<div class="fs-bar"><b></b><b></b><b></b><span>billing.example/invoices/2291</span></div><div class="fs-page"><div class="fs-h">Invoice INV-2291</div><div class="fs-sub">Northwind Studio · due 21 Nov</div><div class="fs-tbl">${[["Design review", "$1,200.00"], ["Prototype build", "$2,450.00"], ["Icon set, 48 icons", "$860.00"], ["Travel", "$318.40"]].map(([a, b]) => `<div><span>${a}</span><span>${b}</span></div>`).join("")}<div class="tot"><span>Total</span><span>$4,828.40</span></div></div><div class="fs-lines">${lines(3)}</div></div>`,
      code: `<div class="fs-term">${["$ cargo build --release", "   Compiling nyx-ui v0.9.2", "   Compiling capture v1.4.0", "warning: unused variable: `area`", "  --> src/overlay.rs:212:9", "    Finished release in 41.2s", "$ "].map((l, i) => `<div class="${i === 3 ? "w" : i === 5 ? "ok" : ""}">${l}</div>`).join("")}</div>`,
      map: `<div class="fs-map"><svg viewBox="0 0 160 100" preserveAspectRatio="none"><path d="M0 70 Q40 50 70 60 T160 40" stroke="#f7d774" stroke-width="5" fill="none"/><path d="M20 0 L50 100M100 0 L120 100M0 30 L160 20" stroke="#fff" stroke-width="2.5" fill="none" opacity=".8"/><circle cx="118" cy="44" r="5" fill="#e5484d" stroke="#fff" stroke-width="2"/></svg></div>`,
      chart: `<div class="fs-dash"><div class="fs-h2">Q4 numbers</div><div class="fs-kp">${["$48.2k", "1,284", "3.9%"].map((v) => `<b>${v}</b>`).join("")}</div><div class="fs-bars">${[40, 62, 55, 78, 70, 90, 84, 96].map((v) => `<i style="height:${v}%"></i>`).join("")}</div></div>`,
      slides: `<div class="fs-slide"><b>Design review</b><span>Sidebar sections, round two</span></div>`,
      chat: `<div class="fs-chat">${["l", "r", "l", "l", "r", "l"].map((s, i) => `<i class="${s}" style="width:${[60, 48, 72, 40, 56, 66][i]}%"></i>`).join("")}</div>`,
      settings: `<div class="fs-set"><div class="fs-side">${lines(6, [80, 64, 72, 58, 70, 66])}</div><div class="fs-main">${Array.from({ length: 5 }, () => `<div class="r"><i></i><b></b></div>`).join("")}</div></div>`,
      error: `<div class="fs-err"><div class="dlg"><b>Couldn't save “notes.md”</b><span>The disk is full. Free some space and try again.</span><div class="bt"><i></i><i class="p"></i></div></div></div>`,
    }[kind];
    return t ? `<div class="fs fs-${kind}">${t}</div>` : art(o.seed || kind, { r: 0 });
  };

  // [title, app, kind, time, size, flags]
  const CAPS = [
    ["Invoice INV-2291", "Firefox", "invoice", "14:02", "1440 × 900", { star: true }],
    ["cargo build", "kitty", "code", "13:40", "1200 × 760", {}],
    ["Route to the harbour", "Maps", "map", "12:15", "1280 × 800", {}],
    ["Q4 numbers", "Sheets", "chart", "11:02", "1600 × 1000", { star: true }],
    ["Design review", "Slides", "slides", "10:30", "1920 × 1080", { video: "2:14" }],
    ["Team chat, scrolled", "Chat", "chat", "09:12", "900 × 3400", { scrolled: true }],
    ["Lighthouse render", "Blender", "photo", "Yesterday", "1920 × 1080", {}],
    ["Display settings", "Settings", "settings", "Yesterday", "1280 × 800", {}],
    ["Couldn't save notes.md", "Code - OSS", "error", "Yesterday", "640 × 260", {}],
  ];
  const thumb = ([t, app, kind, time, size, x], i, o = {}) => `<div class="cp-th ${o.sel === i ? "sel" : ""}">
    <div class="pic">${fake(kind, { seed: t })}${x.video ? `<span class="dur">${icon("play")}${x.video}</span>` : ""}${x.scrolled ? `<span class="tag">Scrolled</span>` : ""}${x.star ? `<span class="st">${icon("starf")}</span>` : ""}</div>
    <div class="cap"><b>${t}</b><span>${app} · ${time}</span></div></div>`;

  const MODES = [
    ["region", "Smart", "1", "Drag an area, click a window, or click empty space for the screen"],
    ["window", "Window", "2", "Click a window"],
    ["monitor", "Screen", "3", "The screen you're on"],
    ["scrollcap", "Scroll", "4", "A long page, stitched as you scroll"],
    ["rec", "Record", "5", "A video of an area, a window or the screen"],
    ["textcap", "Text", "6", "Copy the text in an area"],
    ["qr", "QR code", "7", "Read a code on screen"],
    ["pipette", "Colour", "8", "Copy the colour of a pixel"],
  ];

  const newBtn = () => `<span class="cp-split"><button class="newbtn">${icon("region")}<span>New capture</span><span class="key">Print</span></button><button class="newbtn dd-arrow">${icon("chev-d")}</button></span><button class="cp-recbtn">${icon("rec")}<span>Record</span></button>`;

  /* ── Option A: History tidied, and an editor with a tool rail ──────── */
  const sideA = (on = "recent") => `
    ${tiles([["recent", "clock", 48, "Recent", "blue"], ["star", "starf", 6, "Starred", "amber"], ["shots", "image", 41, "Screenshots", "violet"], ["rec", "rec", 7, "Recordings", "red"]], on)}
    ${grp("Kinds", false, "", "accent")}
    ${navx("scrollcap", "Scrolled", { cnt: 3 })}
    ${navx("textcap", "With text read", { cnt: 29 })}
    ${navx("pin", "Pinned on screen", { cnt: 1 })}
    ${grp("By app", false, "", "green")}
    ${navx("", "Firefox", { dot: "var(--sw-coral)", cnt: 14 })}
    ${navx("", "kitty", { dot: "var(--sw-pink)", cnt: 9 })}
    ${navx("", "Blender", { dot: "var(--sw-amber)", cnt: 6 })}
    ${navx("", "Settings", { dot: "var(--sw-teal)", cnt: 4 })}
    <div class="foot">${icon("history")}<span>Kept 30 days · starred kept always</span></div>`;

  const inspA = () => `<div class="insp cp-insp">
    <div class="ibody">
      <div class="cp-big">${fake("invoice")}</div>
      <div class="cp-it"><b>Invoice INV-2291</b><span>Firefox · today 14:02 · 1440 × 900</span></div>
      <div class="cp-acts">${btn("Edit", "primary", "pen")}${btn("Copy", "", "copy")}${btn("Copy text", "", "textcap")}${ib("more", "More: pin, export, share, show in folder, delete")}</div>
      <div class="lab">Text in it<span class="act">Copy</span></div>
      <div class="card cp-ocr">Invoice INV-2291 · Northwind Studio · due 21 Nov · Design review $1,200.00 · Prototype build $2,450.00 · Icon set, 48 icons $860.00 · Travel $318.40 · Total $4,828.40</div>
      <div class="cp-saved">${icon("check-c")}<span>Saved to Pictures/Captures</span></div>
    </div></div>`;

  const gridA = (o = {}) => `<div class="scroll cp-grid">
    <div class="cp-day">Today<span>6</span></div>
    <div class="cp-tiles">${CAPS.slice(0, 6).map((c, i) => thumb(c, i, o)).join("")}</div>
    <div class="cp-day">Yesterday<span>3</span></div>
    <div class="cp-tiles">${CAPS.slice(6).map((c, i) => thumb(c, i + 6, o)).join("")}</div>
  </div>`;

  const historyA = () => `<div class="cols"><div class="main">${gridA({ sel: 0 })}</div>${NARROW ? "" : inspA()}</div>`;

  const hdrA = () => header({ icon: "region", name: "Capture", center: search(NARROW ? "Search captures" : "Search captures and the text in them", "Ctrl F"), end: newBtn() });

  const TOOLS = [
    ["Draw", [["arrowt", "Arrow", "A", true], ["linet", "Line", "L"], ["rectt", "Rectangle", "R"], ["ellt", "Ellipse", "E"], ["penft", "Freehand", "P"], ["hilite", "Highlighter", "H"], ["textcap", "Text", "T"], ["step", "Numbered step", "N"]]],
    ["Hide", [["blur", "Blur", "B"], ["grid", "Pixelate", "X"], ["boxt", "Solid box", "D"]]],
    ["Picture", [["crop", "Crop", "C"], ["cut", "Cut out a band", "K"], ["spot", "Spotlight", "S"], ["scantext", "Read text", "O"], ["backdrop", "Backdrop", "⇧B"]]],
  ];

  const canvasShot = (o = {}) => `<div class="cp-canvas ${o.backdrop ? "bd" : ""}"><div class="cp-shot">${fake("invoice")}
      <svg class="cp-ann" viewBox="0 0 100 62.5" preserveAspectRatio="none"><path d="M78 13 L60 27" stroke="#e5484d" stroke-width="1" fill="none" vector-effect="non-scaling-stroke" style="stroke-width:4px" stroke-linecap="round"/><path d="M60 27 l1.2 -4.6 M60 27 l4.6 -0.9" stroke="#e5484d" fill="none" vector-effect="non-scaling-stroke" style="stroke-width:4px" stroke-linecap="round"/></svg>
      <div class="cp-rect" style="left:8%;top:40%;width:84%;height:27%"></div>
      <span class="cp-step" style="left:4.5%;top:37%">1</span><span class="cp-step" style="left:4.5%;top:70%">2</span>
      <div class="cp-blur" style="left:52%;top:16%;width:30%;height:6%"></div>
      <div class="cp-note" style="left:73%;top:6%">Due Friday!</div>
    </div></div>`;

  const editorA = () => `<div class="cols cp-ed">
    <div class="cp-rail">
      ${ib("cursor", "Select (V)")}
      ${TOOLS.map(([g, ts]) => `<div class="g">${g}</div>${ts.map(([ic, n, k, on]) => `<button class="t ${on ? "on" : ""}" title="${n} (${k})">${icon(ic)}</button>`).join("")}`).join("")}
    </div>
    <div class="main cp-stage">${canvasShot()}<div class="cp-zoom">${ib("chev-l", "Zoom out")}<span>Fit · 62%</span>${ib("plus", "Zoom in")}</div></div>
    <div class="insp cp-props">
      <div class="ihead"><b class="cp-pt">${icon("arrowt")}Arrow</b><span class="cp-ps">Press A again for the next style</span></div>
      <div class="ibody">
        <div class="lab">Style</div>${seg(["Standard", "Pointy", "Curved", "Double"], "Standard")}
        <div class="lab">Colour</div>
        <div class="cp-sw">${["red", "amber", "green", "blue", "violet", "pink", "graphite"].map((c, i) => `<span class="${i === 0 ? "on" : ""}" style="background:var(--sw-${c})"></span>`).join("")}<span class="own">${icon("plus")}</span><span class="own">${icon("pipette")}</span></div>
        <div class="lab">Size<span class="cnt">6</span></div>
        <div class="slider"><div class="tr"><div class="fill" style="width:30%"></div></div><div class="kn" style="left:30%"></div></div>
        <div class="lab">On this picture</div>
        <div class="card">${[["arrowt", "Arrow"], ["rectt", "Rectangle"], ["step", "Steps 1 and 2"], ["blur", "Blur"], ["textcap", "Text: Due Friday!"]].map(([ic, n]) => `<div class="row">${icon(ic)}<span class="k">${n}</span></div>`).join("")}</div>
      </div>
    </div>
  </div>`;

  const hdrEd = (o = {}) => header({
    icon: "region", name: "Capture" + `<span class="app-sub"><span class="sep">·</span>Invoice INV-2291</span>`,
    end: `${ib("undo", "Undo (Ctrl+Z)")}${ib("redo", "Redo (Ctrl+Shift+Z)")}<span class="gap"></span>${o.compact ? "" : btn("Redact", "ghost", "redact")}${ib("pin", "Pin on screen")}${ib("share", "Share")}<span class="gap"></span>${btn("Save", "", "save")}${btn("Copy", "primary", "copy")}`,
  }).replace(ib("sidebar", "Sidebar (Ctrl+B)"), "");

  /* ── Option B: capture first ────────────────────────────────────────── */
  const hdrB = (on) => header({ icon: "region", name: "Capture", center: seg(["Capture", "History"], on), end: "" }).replace(ib("sidebar", "Sidebar (Ctrl+B)"), "");

  const homeB = () => `<div class="scroll cp-home"><div class="clamp" style="--clamp: 900px">
    <div class="cp-modes">${MODES.map(([ic, n, k, d], i) => `<div class="cp-mode ${i === 0 ? "on" : ""} ${i === 4 ? "rec" : ""}"><div class="r1"><span class="ic">${icon(ic)}</span><span class="kbd">${k}</span></div><b>${n}</b><span>${d}</span></div>`).join("")}</div>
    <div class="cp-opts">
      <span>${sw(false)}Edit after capture</span><span>${sw(false)}Wait 3 seconds</span>
      <span class="sp"></span><span class="lbl">After a screenshot</span>${dd("Copy and save")}
    </div>
    <div class="cp-tip">${icon("keyboard")}<span>The Print key opens the same bar anywhere. Esc cancels.</span></div>
    <div class="sechead">Recent<span class="more">See all 48</span></div>
    <div class="cp-strip">${CAPS.slice(0, 5).map((c, i) => thumb(c, i)).join("")}</div>
  </div></div>`;

  const desk = () => `<div class="cp-desk">
    <div class="dw w1"><div class="tb"><b></b><b></b><b></b><span>billing.example</span></div>${fake("invoice")}</div>
    <div class="dw w2"><div class="tb"><span>kitty</span></div>${fake("code")}</div>
    <div class="dw w3"><div class="tb"><span>Maps</span></div>${fake("map")}</div>
    <div class="cp-sel" style="left:84px;top:196px;width:556px;height:252px"><i class="h a"></i><i class="h b"></i><i class="h c"></i><i class="h d"></i></div>
    <div class="cp-mag" style="left:602px;top:420px"><div class="px">${Array.from({ length: 49 }, (_, i) => `<b style="background:${i % 7 === 3 ? "#3d8ae8" : Math.floor(i / 7) === 3 ? "#3d8ae8" : (i * 37) % 11 < 3 ? "#5b5e6e" : "#f4f5f8"}"></b>`).join("")}</div><span>556 × 252 · Firefox</span></div>
    <div class="cp-bar pop">
      <div class="seg cp-mseg">${MODES.map(([ic, n], i) => `<button class="${i === 0 ? "on" : ""}">${icon(ic)}<span>${n}</span></button>`).join("")}</div>
      <span class="sep"></span>
      <button class="cp-tog on">${icon("pen")}<span>Edit after</span></button><button class="cp-tog">${icon("timer")}<span>3 s delay</span></button>
      <span class="sep"></span>
      <span class="hint">Drag an area, or click a window</span>${kbd("Esc")}
    </div>
  </div>`;

  /* ── Option C: search what you've captured ─────────────────────────── */
  const hl = (s, q = "invoice") => s.replace(new RegExp(`(${q})`, "ig"), "<mark>$1</mark>");
  const RES = [
    ["Invoice INV-2291", "Firefox · today 14:02", "invoice", "…Northwind Studio · <mark>Invoice</mark> INV-2291 · due 21 Nov · Total $4,828.40…"],
    ["Inbox", "Mail · Tuesday", "settings", "…Acme Billing: <mark>Invoice</mark> INV-2291 is due Friday. Your <mark>invoice</mark> for October is attached…"],
    ["Q4 numbers", "Sheets · Monday", "chart", "…paid <mark>invoices</mark> 1,284 · overdue 3.9%…"],
    ["cargo build", "kitty · 2 Nov", "code", "…src/<mark>invoice</mark>_export.rs:44 · warning: unused…"],
  ];
  const searchC = () => `<div class="cols">
    <div class="list cp-rl"><div class="cp-rlh"><b>4 captures</b><span>with “invoice” in their text</span></div><div class="scroll">
      ${RES.map(([t, m, k, s], i) => `<div class="cp-r ${i === 0 ? "sel" : ""}"><div class="pic">${fake(k)}</div><div class="tx"><b>${hl(t)}</b><span class="m">${m}</span><span class="s">${s}</span></div></div>`).join("")}
    </div></div>
    <div class="main cp-pv">
      <div class="cp-pvbar"><div><b>Invoice INV-2291</b><span>Firefox · today 14:02 · 1440 × 900</span></div><span class="sp"></span>${ib("starf", "Starred", "on")}${btn("Copy text", "", "textcap")}${btn("Copy", "", "copy")}${btn("Edit", "primary", "pen")}${ib("more", "More")}</div>
      <div class="cp-pvstage"><div class="cp-shot">${fake("invoice")}<span class="cp-hit" style="left:6.5%;top:21%;width:13.5%;height:6.5%"></span></div></div>
      <div class="cp-found">${icon("textcap")}<span>Found “<b>invoice</b>” once in this picture. The text was read on this computer and never leaves it.</span></div>
    </div>
  </div>`;

  const sideC = (on = "all") => `
    ${navx("clock", "All captures", { active: on === "all", cnt: 48 })}
    ${navx("starf", "Starred", { cnt: 6 })}
    ${navx("rec", "Recordings", { active: on === "rec", cnt: 7 })}
    ${grp("Saved searches", false, icon("plus"), "accent")}
    ${navx("search", "invoice", { active: on === "q" })}
    ${navx("search", "error")}
    ${navx("search", "wifi password")}`;

  const playerC = () => `<div class="cols">
    <div class="list cp-rl"><div class="cp-rlh"><b>Recordings</b><span>7 · in your Videos folder</span></div><div class="scroll">
      ${[["Design review", "Slides · today 10:30", "2:14", "slides"], ["Bug: menu flickers", "Firefox · Monday", "0:38", "settings"], ["Render timelapse", "Blender · 4 Nov", "1:05", "photo"], ["Onboarding walkthrough", "Screen · 2 Nov", "4:51", "chart"]].map(([t, m, d, k], i) => `<div class="cp-r ${i === 0 ? "sel" : ""}"><div class="pic">${fake(k, { seed: t })}<span class="dur">${d}</span></div><div class="tx"><b>${t}</b><span class="m">${m}</span><span class="s">${["MP4 · 1920 × 1080 · 38 MB · mic and system sound", "WebM · 1280 × 800 · 6 MB", "GIF · 960 × 540 · 22 MB", "MP4 · 1920 × 1080 · 81 MB · webcam"][i]}</span></div></div>`).join("")}
    </div></div>
    <div class="main cp-pv">
      <div class="cp-pvbar"><div><b>Design review</b><span>Slides · today 10:30 · 2:14</span></div><span class="sp"></span>${btn("Show in folder", "ghost", "folder")}${btn("Copy file", "", "copy")}${btn("Trim", "primary", "cut")}${ib("more", "More")}</div>
      <div class="cp-pvstage"><div class="cp-shot vid">${fake("slides")}<div class="cp-vctl">${icon("play")}<span>0:42 / 2:14</span><span class="pr"><b style="width:31%"></b></span>${icon("volume")}${icon("expand")}</div></div></div>
      <div class="cp-trim">
        <div class="tl">${Array.from({ length: 14 }, (_, i) => `<i style="background:linear-gradient(${i * 25}deg, color-mix(in srgb, var(--sw-violet) 60%, #111), color-mix(in srgb, var(--sw-blue) 50%, #111))"></i>`).join("")}<span class="keep" style="left:12%;right:20%"></span><span class="ph" style="left:34%"></span></div>
        <div class="tr2"><span>Keep 0:16 to 1:47</span><span class="sp"></span><span class="m">The original file stays as it is.</span>${btn("Cancel", "ghost")}${btn("Save trimmed copy", "primary")}</div>
      </div>
    </div>
  </div>`;

  const editorC = () => `<div class="cp-edc">
    <div class="cp-groups">
      ${ib("cursor", "Select (V)")}
      <span class="cp-gb on">${icon("arrowt")}<span>Draw</span>${icon("chev-d")}</span>
      <span class="cp-gb">${icon("blur")}<span>Hide</span>${icon("chev-d")}</span>
      <span class="cp-gb">${icon("crop")}<span>Picture</span>${icon("chev-d")}</span>
      <span class="sep"></span>
      <span class="cp-dot" style="background:var(--sw-red)"></span>${dd("6 px")}
      <span class="sp"></span>${btn("Redact", "ghost", "redact")}
    </div>
    ${menu(64, 98, [["#", "Draw"], ["arrowt", "Arrow", "A", "hover"], ["linet", "Line", "L"], ["rectt", "Rectangle", "R"], ["ellt", "Ellipse", "E"], ["penft", "Freehand", "P"], ["hilite", "Highlighter", "H"], ["textcap", "Text", "T"], ["step", "Numbered step", "N"]], 220)}
    <div class="cp-stage">${canvasShot()}</div>
  </div>`;

  /* ── New option C: a big stage over a filmstrip ─────────────────────── */
  const hdrN = (o = {}) => header({
    icon: "region", name: "Capture" + (o.sub ? `<span class="app-sub"><span class="sep">·</span>${o.sub}</span>` : ""),
    center: o.center ?? search(NARROW ? "Search captures" : "Search captures and the text in them", "Ctrl F"), end: o.end ?? newBtn(),
  }).replace(ib("sidebar", "Sidebar (Ctrl+B)"), "");

  const n1Top = () => `<div class="n1-top">${[["All", 48, true], ["Starred", 6], ["Screenshots", 41], ["Recordings", 7], ["Scrolled", 3], ["With text", 29], ["Pinned", 1]].map(([t, n, on]) => `<span class="n1-chip ${on ? "on" : ""}">${t}<em>${n}</em></span>`).join("")}<span class="sp"></span><span class="n1-keep">${icon("history")}Kept 30 days</span>${dd("Every app", "filter")}</div>`;

  const n1Stage = () => `<div class="n1-stage">
    <button class="n1-nav">${icon("chev-l")}</button>
    <div class="n1-view"><div class="n1-col">
      <div class="pic n1-pic">${fake("invoice")}</div>
      <div class="n1-info"><div class="tx"><b>Invoice INV-2291</b><span>Firefox · today 14:02 · 1440 × 900</span></div><span class="sp"></span>
        ${ib("starf", "Starred", "on n1-star")}${ib("pin", "Pin on screen")}${ib("share", "Share")}${ib("folder", "Show in folder")}${ib("more", "More: export, delete")}<span class="gap"></span>${btn("Copy text", "", "textcap")}${btn("Copy", "", "copy")}${btn("Edit", "primary", "pen")}</div>
    </div></div>
    <button class="n1-nav">${icon("chev-r")}</button>
  </div>`;

  const n1Frame = ([t, , kind, , , x], sel) => `<div class="n1-f ${sel ? "sel" : ""}"><div class="pic">${fake(kind, { seed: t })}${x.video ? `<span class="dur">${icon("play")}${x.video}</span>` : ""}${x.scrolled ? `<span class="tag">Scrolled</span>` : ""}${x.star ? `<span class="st">${icon("starf")}</span>` : ""}</div><span class="tm">${t}</span></div>`;
  const n1Strip = () => {
    const days = [["Today", CAPS.slice(0, 6), 0], ["Yesterday", CAPS.slice(6), 6], ["Monday", [CAPS[3], CAPS[1], CAPS[2]], 9]];
    return `<div class="n1-strip">${days.map(([d, cs, o]) => `<div class="n1-day"><div class="dl">${d}<span>${cs.length}</span></div><div class="fr">${cs.map((c, i) => n1Frame(c, o + i === 0)).join("")}</div></div>`).join("")}</div>`;
  };

  const n1History = () => `${n1Top()}${n1Stage()}${n1Strip()}`;

  const DOCK = [
    ["Draw", [["arrowt", "Arrow", "A"], ["linet", "Line", "L"], ["rectt", "Rectangle", "R"], ["ellt", "Ellipse", "E"], ["penft", "Freehand", "P"], ["hilite", "Highlight", "H"], ["textcap", "Text", "T"], ["step", "Steps", "N"]]],
    ["Hide", [["blur", "Blur", "B"], ["grid", "Pixelate", "X"], ["boxt", "Solid box", "D"]]],
    ["Picture", [["crop", "Crop", "C"], ["cut", "Cut a band", "K"], ["spot", "Spotlight", "S"], ["scantext", "Read text", "O"], ["backdrop", "Backdrop", "⇧B"]]],
  ];
  const n1Tool = ([ic, n, k], on) => `<button class="n1-t ${on ? "on" : ""}">${icon(ic)}<span>${n}</span><em>${k}</em></button>`;
  const swatches = (c = "") => `<div class="cp-sw ${c}">${["red", "amber", "green", "blue", "violet", "graphite"].map((s, i) => `<span class="${i === 0 ? "on" : ""}" style="background:var(--sw-${s})"></span>`).join("")}<span class="own">${icon("plus")}</span><span class="own">${icon("pipette")}</span></div>`;

  const n1Edit = () => `<div class="n1-ed">
    <div class="n1-estage">
      <div class="n1-props pop"><b>${icon("arrowt")}Arrow</b><span class="sep"></span>${seg(["Standard", "Pointy", "Curved", "Double"], "Standard")}<span class="sep"></span>${swatches()}<span class="sep"></span><span class="lb">Size</span><div class="slider"><div class="tr"><div class="fill" style="width:30%"></div></div><div class="kn" style="left:30%"></div></div><b class="v">6 px</b></div>
      ${canvasShot()}
      <div class="cp-zoom">${ib("chev-l", "Zoom out")}<span>Fit · 62%</span>${ib("plus", "Zoom in")}</div>
    </div>
    <div class="n1-dock">
      <div class="n1-g"><div class="gl">Pick</div><div class="ts">${n1Tool(["cursor", "Select", "V"])}</div></div>
      ${DOCK.map(([g, ts]) => `<div class="n1-g"><div class="gl">${g}</div><div class="ts">${ts.map((t) => n1Tool(t, t[0] === "arrowt")).join("")}</div></div>`).join("")}
    </div>
  </div>`;

  /* ── New option D: the day as a journal, with a capture dock ────────── */
  const n2Side = () => `
    ${grp("Days", true, "", "accent")}
    ${navx("calendar", "Today", { active: true, cnt: 9 })}
    ${navx("calendar", "Yesterday", { cnt: 6 })}
    ${navx("calendar", "Monday", { cnt: 11 })}
    ${navx("calendar", "Sunday", { cnt: 4 })}
    ${navx("calendar", "Earlier in November", { cnt: 18 })}
    ${grp("Only show", false, "", "violet")}
    ${navx("starf", "Starred", { cnt: 6 })}
    ${navx("rec", "Recordings", { cnt: 7 })}
    ${navx("scrollcap", "Scrolled", { cnt: 3 })}
    ${navx("textcap", "Text copied", { cnt: 14 })}
    ${navx("pipette", "Colours picked", { cnt: 12 })}
    ${navx("pin", "Pinned on screen", { cnt: 1 })}
    <div class="foot">${icon("history")}<span>Kept 30 days · starred kept always</span></div>`;

  const n2Entry = (time, kind, ic, label, meta, body, end = "") => `<div class="n2-e k-${kind}"><div class="when">${time}</div><span class="dot">${icon(ic)}</span><div class="n2-c"><div class="h"><b>${label}</b><span class="m">${meta}</span><span class="sp"></span>${end}</div>${body}</div></div>`;

  const n2Journal = () => `<div class="n2-head"><div class="tx"><b>Today</b><span>Thursday 12 November · 9 captures</span></div><span class="sp"></span>${dd("Every app", "filter")}${btn("Select", "ghost", "check-c")}</div>
    <div class="scroll n2-list">
      ${n2Entry("14:02", "shot", "image", "Invoice INV-2291", "Screenshot · Firefox · 1440 × 900", `<div class="n2-shot"><div class="pic">${fake("invoice")}</div><div class="r"><div class="lab">Text in it</div><div class="ocr">Invoice INV-2291 · Northwind Studio · due 21 Nov · Design review $1,200.00 · Prototype build $2,450.00 · Icon set, 48 icons $860.00 · Total $4,828.40</div><div class="acts">${btn("Edit", "primary", "pen")}${btn("Copy", "", "copy")}${btn("Copy text", "", "textcap")}${ib("pin", "Pin on screen")}${ib("share", "Share")}${ib("more", "More")}</div><div class="saved">${icon("check-c")}Saved to Pictures/Captures</div></div></div>`, ib("starf", "Starred", "on n2-star"))}
      ${n2Entry("13:51", "col", "pipette", "Colour picked", "from Settings", `<div class="n2-col"><span class="swc" style="background:#3d8ae8"></span><b>#3D8AE8</b><span class="v">rgb(61, 138, 232)</span><span class="v">hsl(213, 79%, 57%)</span></div>`, btn("Copy", "sm", "copy"))}
      ${n2Entry("13:40", "txt", "textcap", "Text copied", "kitty · 6 lines, line breaks kept", `<div class="n2-txt">$ cargo build --release<br>&nbsp;&nbsp;&nbsp;Compiling capture v1.4.0<br>warning: unused variable: \`area\`<br>&nbsp;&nbsp;--&gt; src/overlay.rs:212:9</div>`, `${ib("image", "See the picture")}${btn("Copy again", "sm", "copy")}`)}
      ${n2Entry("12:40", "rec", "rec", "Design review", "Recording · Slides · 2:14", `<div class="n2-mini"><div class="pic">${fake("slides")}<span class="dur">${icon("play")}2:14</span></div><div class="tx"><span class="lab">MP4 · 1920 × 1080 · 38 MB</span><span>Mic and system sound · saved to Videos</span></div></div>`, `${btn("Show in folder", "sm ghost", "folder")}${btn("Trim", "sm", "cut")}${btn("Play", "sm", "play")}`)}
      ${n2Entry("12:15", "shot", "image", "Route to the harbour", "Screenshot · Maps · 1280 × 800", `<div class="n2-mini"><div class="pic">${fake("map")}</div><div class="tx"><span class="lab">Text in it</span><span>Harbour Road · Ferry Steps · 12 min walk · 0.9 km</span></div></div>`, `${btn("Copy", "sm", "copy")}${btn("Edit", "sm", "pen")}`)}
    </div>
    <div class="n2-dock">
      <div class="modes">${MODES.map(([ic, n, k], i) => `<button class="n2-m ${i === 0 ? "on" : ""} ${i === 4 ? "rec" : ""}">${icon(ic)}<span>${n}</span><em>${k}</em></button>`).join("")}</div>
      <div class="opts"><span>${sw(true)}Edit after capture</span><span>${sw(false)}Wait 3 seconds</span><span class="sp"></span><span class="hint">${kbd("Print")} opens this bar anywhere</span><span class="lbl">After a screenshot</span>${dd("Copy and save")}</div>
    </div>`;

  const BAR = [["cursor", "Select", "V"], ["arrowt", "Arrow", "A"], ["rectt", "Rectangle", "R"], ["textcap", "Text", "T"], ["hilite", "Highlight", "H"], ["step", "Steps", "N"], ["blur", "Blur", "B"], ["crop", "Crop", "C"]];
  const BAR2 = [["linet", "Line", "L"], ["ellt", "Ellipse", "E"], ["penft", "Freehand", "P"], ["grid", "Pixelate", "X"], ["boxt", "Solid box", "D"], ["cut", "Cut a band", "K"], ["spot", "Spotlight", "S"], ["scantext", "Read text", "O"], ["backdrop", "Backdrop", "⇧B"]];
  const n2Tool = ([ic, n, k], on) => `<button class="n2-tb ${on ? "on" : ""}" title="${n} (${k})">${icon(ic)}<span>${n}</span></button>`;
  const n2Markup = () => `<div class="n2-mk">
    <div class="n2-bar pop"><div class="row">${BAR.map((t) => n2Tool(t, t[0] === "arrowt")).join("")}<span class="sep"></span><button class="n2-tb open">${icon("chev-u")}<span>Fewer tools</span></button></div>
      <div class="row r2">${BAR2.map((t) => n2Tool(t)).join("")}</div></div>
    <div class="n2-cv"><div class="n2-cvw">${canvasShot().replace('<div class="cp-note"', '<span class="n2-hd" style="left:78%;top:20.8%"></span><span class="n2-hd" style="left:60%;top:43.2%"></span><div class="cp-note"')}
      <div class="n2-bub pop"><div class="bh">${icon("arrowt")}<b>Arrow</b><span class="sp"></span>${ib("trash", "Delete (Del)")}</div>
        <div class="bl">Style</div>${seg(["Standard", "Pointy", "Curved", "Double"], "Standard")}
        <div class="bl">Colour</div>${swatches("n2-swr")}
        <div class="bl">Size<span>6 px</span></div><div class="slider"><div class="tr"><div class="fill" style="width:30%"></div></div><div class="kn" style="left:30%"></div></div>
      </div></div></div>
    <div class="n2-zoom">${ib("chev-l", "Zoom out")}<span>Fit · 74%</span>${ib("plus", "Zoom in")}</div>
    <div class="n2-send pop">${btn("Redact", "ghost", "redact")}${ib("pin", "Pin on screen")}${ib("share", "Share")}<span class="sep"></span>${btn("Save", "", "save")}${btn("Copy", "primary", "copy")}</div>
  </div>`;

  REG("capture", {
    name: "Capture",
    summary: "Capture does a great deal (eight capture modes, a full editor, text search over your history, recording), but almost all of it is reached through bare icons with tooltips, so most of it is invisible until you hover or read the README.",
    problems: [
      "<b>The header is a row of bare icons:</b> region, window, screen, scroll, record, pause and webcam, plus a status line, all unlabelled at the top right of the History window.",
      "<b>Text, QR code and Colour are missing from the window:</b> they're only on the capture bar, so someone who opens Capture from the launcher never finds them.",
      "<b>Five of the eight modes on the capture bar have no label</b> (Scroll, Record, Text, QR code, Colour), and its options (edit after, delay, keep line breaks, review) are icons too.",
      "<b>The editor's sixteen tools are one flat row of icons</b> that wraps onto a second row at 800 px, with colour, size, fill and corners hidden behind one palette button.",
      "<b>Copy and Save aren't easier to find than Pin or Redact:</b> the editor's header has seven bare icons in a row.",
      "<b>The sidebar is four plain rows</b> (Recent, Screenshots, Recordings, Starred) with no counts and nothing else, while the header is crowded.",
      "<b>Copy, Pin, Export and Share for a capture</b> are only in the right-click menu; selecting captures shows just Delete and Clear.",
      "<b>The empty state is one line</b>: “No captures yet. Ctrl+N grabs a region.”, with no button to do it.",
    ],
    today: [],
    todayNote: "No screenshot: starting Capture can open its capture bar over the screen, so it wasn't run. The problems come from its code.",
    options: [
      { id: "a", name: "Capture first", idea: "Opening Capture shows what it can do: all eight modes as big labelled cards with their keys and a line on each, the options as switches, and your latest captures below. History is the second tab. The capture bar that the Print key opens labels every mode and every option, so nothing on it is an icon you have to guess.",
        shots: [
          ["b-home","Capture page","Eight modes, labelled"],
          ["b-bar","The capture bar","Every mode and option named"],
          ["b-home-800","At 800 px","Modes two to a row"],
        ] },
      { id: "b", name: "Search your captures", idea: "Built around finding things again. Search runs over the text read from every shot, the results show where the words were found, and the picture highlights them. Saved searches sit in the sidebar. Recordings play in place with a trim bar. The editor folds its tools into three labelled menus (Draw, Hide, Picture), so it fits an 800 px window on one row.",
        shots: [
          ["c-search","Searching “invoice”","Matches in the text, highlighted on the picture"],
          ["c-player","Recordings","Play and trim in place"],
          ["c-editor-800","Editor at 800 px","Tools in three labelled menus"],
        ] },
      { id: "c", name: "Filmstrip", idea: "No sidebar and no grid: the capture you're looking at fills the window, with its actions named underneath, and every capture runs along the bottom as a filmstrip, grouped by day. Arrow keys step through them. Edit happens right there: the filmstrip makes way for a dock with every tool named and grouped (Draw, Hide, Picture), and the selected tool's settings float above the picture. Suits people who mostly grab one shot, look at it, and fix it.",
        shots: [
          ["n1-history","History","The capture large, the rest along the bottom"],
          ["n1-edit","Editing in place","A named dock replaces the filmstrip"],
          ["n1-history-800","At 800 px","Same stage, fewer frames"],
        ] },
      { id: "d", name: "Day journal", idea: "Your day as a timeline: screenshots, text you copied, colours you picked and recordings, each with the time and what you can do with it, newest at the top. The capture modes sit at the bottom like a message box, all eight named, with their options beside them. The editor is all picture: a floating bar of named tools (More tools opens a second row), the selected mark's settings in a bubble beside it, and Copy and Save in the corner. Suits people who capture lots of small things through the day.",
        shots: [
          ["n2-journal","Today","A timeline of the day; modes at the bottom"],
          ["n2-markup","Editor","Floating named tools; settings beside the mark"],
          ["n2-journal-800","At 800 px","The days move into the header menu"],
        ] },
    ],
    pages: {
      "a-history": () => win({ hdr: hdrA(), side: sideA(), page: historyA() }),
      "a-editor": () => win({ hdr: hdrEd(), side: "", page: editorA() }),
      "b-home": () => win({ hdr: hdrB("Capture"), side: "", page: homeB() }),
      "b-bar": () => desk(),
      "c-search": () => win({ hdr: header({ icon: "region", name: "Capture", center: `<div class="search focus cp-q">${icon("search")}<span>invoice</span>${icon("x")}</div>`, end: newBtn() }), side: sideC("q"), page: searchC() }),
      "c-player": () => win({ hdr: header({ icon: "region", name: "Capture", center: search("Search captures and the text in them", "Ctrl F"), end: newBtn() }), side: sideC("rec"), page: playerC() }),
      "c-editor": () => win({ hdr: hdrEd({ compact: true }), side: "", page: editorC() }),
      "n1-history": () => win({ hdr: hdrN(), side: "", page: n1History() }),
      "n1-edit": () => win({ hdr: hdrN({ sub: "Editing Invoice INV-2291", center: "", end: `${ib("undo", "Undo (Ctrl+Z)")}${ib("redo", "Redo (Ctrl+Shift+Z)")}<span class="gap"></span>${btn("Redact", "ghost", "redact")}${ib("pin", "Pin on screen")}${ib("share", "Share")}<span class="gap"></span>${btn("Save", "", "save")}${btn("Copy", "primary", "copy")}${btn("Done", "", "check")}` }), side: "", page: n1Edit() }),
      "n2-journal": () => win({ hdr: header({ icon: "region", name: "Capture", start: NARROW ? `<span class="n2-daydd">${dd("Today", "calendar")}</span>` : "", center: search(NARROW ? "Search captures" : "Search captures and the text in them", "Ctrl F"), end: "" }).replace(NARROW ? ib("sidebar", "Sidebar (Ctrl+B)") : "\u0000", ""), side: NARROW ? "" : n2Side(), page: n2Journal() }),
      "n2-markup": () => win({ hdr: hdrN({ sub: "Invoice INV-2291", center: "", end: `${ib("undo", "Undo (Ctrl+Z)")}${ib("redo", "Redo (Ctrl+Shift+Z)")}` }), side: "", page: n2Markup() }),
    },
    icons: {
      region: '<path d="M4 8V5.5A1.5 1.5 0 0 1 5.5 4H8M16 4h2.5A1.5 1.5 0 0 1 20 5.5V8M20 16v2.5a1.5 1.5 0 0 1-1.5 1.5H16M8 20H5.5A1.5 1.5 0 0 1 4 18.5V16M12 9v6M9 12h6"/>',
      scrollcap: '<rect x="6" y="3" width="12" height="18" rx="2"/><path d="M12 8v8M9.5 13.5 12 16l2.5-2.5"/>',
      rec: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4" fill="currentColor" stroke="none"/>',
      textcap: '<path d="M5 7V5h14v2M12 5v14M9 19h6"/>',
      qr: '<rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><path d="M14 14h2v2h-2zM18 18h2v2h-2zM18 14h2M14 18v2"/>',
      pipette: '<path d="M19.5 4.5a2.1 2.1 0 0 1 0 3l-2 2-3-3 2-2a2.1 2.1 0 0 1 3 0zM15.5 8.5 7 17l-2.5.5L4 20l-1-1 2.5-.5L6 16l8.5-8.5"/>',
      timer: '<circle cx="12" cy="13.5" r="7.5"/><path d="M12 9.5v4l2.5 1.5M9.5 2.5h5"/>',
      arrowt: '<path d="M5 19 19 5M10 5h9v9"/>',
      linet: '<path d="M5 19 19 5"/>',
      rectt: '<rect x="4" y="6" width="16" height="12" rx="1.5"/>',
      ellt: '<ellipse cx="12" cy="12" rx="8.5" ry="6.5"/>',
      penft: '<path d="M4 17c3-6 5 2 8-3s4-7 8-6"/>',
      hilite: '<path d="m9 15 7.5-7.5a2.1 2.1 0 0 1 3 3L12 18H9zM4 20h8"/>',
      step: '<circle cx="12" cy="12" r="8.5"/><path d="M10.5 9.5 12.5 8v8"/>',
      spot: '<circle cx="12" cy="12" r="4.5"/><path d="M12 2.5V5M12 19v2.5M2.5 12H5M19 12h2.5"/>',
      blur: '<path d="M12 3.5s6 6.5 6 10.5a6 6 0 0 1-12 0c0-4 6-10.5 6-10.5z"/>',
      boxt: '<rect x="4" y="7" width="16" height="10" rx="1.5" fill="currentColor"/>',
      cut: '<circle cx="6.5" cy="7" r="2.5"/><circle cx="6.5" cy="17" r="2.5"/><path d="M8.5 8.5 20 17M8.5 15.5 20 7"/>',
      crop: '<path d="M7 3v14h14M3 7h14v14"/>',
      scantext: '<path d="M4 8V5.5A1.5 1.5 0 0 1 5.5 4H8M16 4h2.5A1.5 1.5 0 0 1 20 5.5V8M20 16v2.5a1.5 1.5 0 0 1-1.5 1.5H16M8 20H5.5A1.5 1.5 0 0 1 4 18.5V16M8.5 9h7M12 9v7"/>',
      backdrop: '<rect x="3" y="3" width="18" height="18" rx="3"/><rect x="7" y="7" width="10" height="10" rx="1.5"/>',
      undo: '<path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11"/>',
      redo: '<path d="m15 14 5-5-5-5"/><path d="M20 9H9.5a5.5 5.5 0 0 0 0 11H13"/>',
      cursor: '<path d="M5 3.5 19 11l-6.5 1.5L9.5 19z"/>',
      redact: '<rect x="3" y="9.5" width="18" height="5" rx="1" fill="currentColor"/><path d="M3 5.5h10M3 18.5h14"/>',
      save: '<path d="M5 4h11l3 3v13H5z"/><path d="M8 4v5h7V4M8 20v-6h8v6"/>',
      starf: '<path fill="currentColor" d="m12 3.5 2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.8l-5.2 2.8 1-5.8-4.3-4.1 5.9-.8z"/>',
    },
  });
})();
