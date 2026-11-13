// Nyx Fonts on the revamp page: today's problems and three options.
(() => {
  // Made-up families, each drawn with a font that ships with most Linux systems.
  // [name, category, styles, css family, weight, designer, flags]
  const F = [
    ["Halden Sans", "Sans serif", 18, "Inter", 400, "Ida Halden", { inst: true, variable: true }],
    ["Marlow", "Serif", 8, "P052", 400, "Marlow Type Co.", {}],
    ["Quarry Mono", "Monospace", 8, "JetBrainsMono Nerd Font", 400, "Quarry Labs", { inst: true, update: true }],
    ["Vellum Display", "Display", 5, "Noto Serif Display", 300, "Ottilie Brandt", { variable: true }],
    ["Brisk Grotesk", "Sans serif", 9, "Geist", 500, "Brisk Foundry", { variable: true }],
    ["Orchard Text", "Serif", 6, "C059", 400, "Rafael Orchard", {}],
    ["Tallis Condensed", "Display", 4, "Nimbus Sans Narrow", 700, "Tallis & Webb", {}],
    ["Duet Sans", "Sans serif", 4, "iA Writer Quattro S", 400, "Two Pens Studio", { inst: true }],
    ["Atlas Roman", "Serif", 4, "Nimbus Roman", 400, "Atlas Letters", {}],
    ["Ledger Mono", "Monospace", 4, "iA Writer Mono S", 400, "Two Pens Studio", {}],
    ["Kestrel", "Sans serif", 12, "Noto Sans", 400, "Kestrel Collective", { variable: true }],
    ["Ferrule Code", "Monospace", 6, "FiraCode Nerd Font", 400, "Ferrule", {}],
  ];
  const ff = (f, size, w) => `font-family:'${f[3]}';font-weight:${w || f[4]};${size ? `font-size:${size}px;` : ""}`;
  const SAMPLE = "Sphinx of black quartz, judge my vow";
  const NERD = ["\uf07b", "\ue725", "\uf489", "\ue7a8", "\uf0e7", "\ue0b0", "\uf015", "\uf1eb", "\uf013", "\uf121"];

  const hdr = (o = {}) => header({ icon: "type", name: "Fonts", center: search(o.q || "Search Google Fonts and Nerd Fonts", "Ctrl K"), end: o.end || "" });

  /* ── Option A: a grid of specimens ──────────────────────────────────── */
  const sideA = (on = "google") => `
    ${tiles([["google", "globe", "1,961", "Google Fonts", "blue"], ["nerd", "terminal", 72, "Nerd Fonts", "violet"], ["inst", "check-c", 6, "Installed", "green"], ["upd", "refresh", 2, "Updates", "amber"]], on)}
    ${grp("Browse", false, "", "accent")}
    ${navx("globe", "Google Fonts", { active: on === "google", cnt: "1,961" })}
    ${navx("terminal", "Nerd Fonts", { active: on === "nerd", cnt: 72 })}
    ${grp("On this computer", false, "", "green")}
    ${navx("check-c", "Installed with Fonts", { active: on === "inst", cnt: 6 })}
    ${navx("monitor", "Every system font", { cnt: 214 })}
    ${NARROW ? "" : grp("Sample", false, "", "violet")}
    <div class="fo-sample hide-narrow"><div class="field"><span>${SAMPLE}</span></div><div class="fo-size"><span>Size</span><div class="slider"><div class="tr"><div class="fill" style="width:36%"></div></div><div class="kn" style="left:36%"></div></div><b>32</b></div></div>
    <div class="foot">${icon("check-c", "ok")}<span>Font lists updated today</span></div>`;

  const cats = (on = "All") => `<div class="fo-chips">${["All", "Sans serif", "Serif", "Display", "Handwriting", "Monospace"].map((c) => chip(c, c === on ? "on" : "")).join("")}</div>`;

  const cardA = (f, i, o = {}) => `<div class="fo-card ${o.hover === i ? "hover" : ""}">
    <div class="spec" style="${ff(f, 27)}">${o.name ? f[0] : SAMPLE}</div>
    <div class="ft"><div class="tx"><b>${f[0]}</b><span>${f[1]} · ${f[2]} styles${f[6].variable ? " · variable" : ""}</span></div>
      ${f[6].update ? btn("Update", "sm", "refresh") : f[6].inst ? `<span class="fo-ok">${icon("check")}Installed</span>` : o.hover === i ? btn("Install", "sm primary", "download") : ""}</div>
  </div>`;

  const gridA = () => `${pbar2("Google Fonts", "1,961 families", `${cats()}${dd("Popular", "sort")}`)}
    <div class="scroll fo-grid">${F.map((f, i) => cardA(f, i, { hover: 1 })).join("")}</div>`;

  const familyA = () => {
    const f = F[0];
    const W = [["Thin", 100], ["Light", 300], ["Regular", 400], ["Medium", 500], ["Semibold", 600], ["Bold", 700], ["Black", 900]];
    return `<div class="fo-fbar">${ib("chev-l", "Back (Alt+←)")}<span class="crumb">Google Fonts</span>${icon("chev-r", "sep")}<b>${f[0]}</b><span class="sp"></span>${btn("Open folder", "ghost", "folder")}${btn("Remove", "dtext", "trash")}<span class="fo-ok big">${icon("check")}Installed · variable</span></div>
    <div class="scroll fo-fam"><div class="clamp" style="--clamp: 900px">
      <div class="fo-hero" style="${ff(f, 64, 600)}">${SAMPLE}</div>
      <div class="fo-meta"><span>${f[1]}</span><span>${f[2]} styles</span><span>By ${f[5]}</span><span>Open Font License</span><span>Latin, Greek, Cyrillic</span></div>
      <div class="fo-two">
        <div><div class="sechead">Styles</div>
          <div class="card fo-styles">${W.map(([n, w]) => `<div class="row"><span class="n">${n} ${w}</span><span class="s" style="${ff(f, 22, w)}">${SAMPLE.slice(0, 26)}</span></div>`).join("")}</div></div>
        <div><div class="sechead">Characters</div>
          <div class="card fo-glyphs" style="${ff(f, 22)}">${"AaBbCcDdEeFfGgHhIiJjKk0123456789&@?!€£$%(){}".split("").map((c) => `<span>${c}</span>`).join("")}</div>
          <div class="sechead">Install as</div>
          <div class="card">${[["Static files", "One file per style; works in every app", false], ["Variable file", "Every weight in one file", true]].map(([t, d, on]) => `<div class="opt"><span class="fo-radio ${on ? "on" : ""}"></span><div class="opt-text"><div>${t}</div><div class="d">${d}</div></div></div>`).join("")}</div>
        </div>
      </div>
    </div></div>`;
  };

  /* ── Option B: a list in each font, with a specimen beside it ───────── */
  const sideB = (on = "google") => `
    ${grp("Browse", true, "", "accent")}
    ${navx("globe", "Google Fonts", { active: on === "google", cnt: "1,961" })}
    ${navx("terminal", "Nerd Fonts", { active: on === "nerd", cnt: 72 })}
    ${grp("Library", false, "", "green")}
    ${navx("check-c", "Installed", { active: on === "inst", badge: 2 })}
    ${navx("monitor", "System fonts", { cnt: 214 })}
    <div class="foot">${icon("download")}<span>Installs to ~/.local/share/fonts</span></div>`;

  const listB = (sel = 0) => `<div class="list fo-list">
    <div class="fo-lh2"><span>1,961 families</span><span class="sp"></span>${dd("All categories", "filter")}${dd("Popular", "sort")}</div>
    <div class="scroll">${F.map((f, i) => `<div class="fo-row ${i === sel ? "sel" : ""}"><div class="r1"><span>${f[1]} · ${f[2]} styles</span>${f[6].update ? `<span class="fo-up">Update</span>` : f[6].inst ? icon("check-c", "fo-ic") : ""}</div><div class="s" style="${ff(f, 21)}">${f[0]}</div></div>`).join("")}</div>
  </div>`;

  const inspB = (f = F[0]) => `<div class="main fo-spec">
    <div class="fo-sh"><div><b>${f[0]}</b><span>${f[1]} · ${f[2]} styles · by ${f[5]} · Open Font License</span></div><span class="sp"></span>${f[6].inst ? `${ib("folder", "Open the font's folder")}${btn("Remove", "dtext")}` : ""}${btn(f[6].inst ? "Installed" : "Install", f[6].inst ? "" : "primary", f[6].inst ? "check" : "download")}</div>
    <div class="fo-tbar"><div class="field">${icon("pen")}<span>${SAMPLE}</span></div><div class="fo-size"><div class="slider"><div class="tr"><div class="fill" style="width:36%"></div></div><div class="kn" style="left:36%"></div></div><b>48 pt</b></div>${seg(["Regular", "Bold", "Italic"], "Regular")}</div>
    <div class="scroll fo-sbody">
      <div class="fo-big" style="${ff(f, 52)}">${SAMPLE}</div>
      <div class="fo-abc" style="${ff(f, 22)}">ABCDEFGHIJKLMNOPQRSTUVWXYZ<br>abcdefghijklmnopqrstuvwxyz<br>0123456789 !?&amp;@#$%*()[]{}</div>
      <div class="fo-para" style="${ff(f, 15)}">Type is a beautiful group of letters, not a group of beautiful letters. A good text face disappears into the reading: you notice the words, the rhythm of the lines and the space between them, and only later the shapes that made it easy.</div>
      <div class="fo-wts">${[200, 300, 400, 500, 700, 900].map((w) => `<span style="${ff(f, 26, w)}">Ag</span>`).join("")}</div>
    </div>
  </div>`;

  const installedB = () => `${pbar2("Installed", "6 families · 38 MB", `${btn("Update all", "primary", "refresh")}`)}
    <div class="banner2 fo-upd">${icon("refresh")}<div class="tx"><b>2 updates</b><span>Quarry Mono 3.2 and Halden Sans 4.1 are out.</span></div></div>
    <div class="scroll fo-ins">
      <div class="tbl">
        <div class="th"><span style="flex:1">Family</span><span style="flex:0 0 110px">From</span><span style="flex:0 0 90px">Version</span><span style="flex:0 0 70px">Size</span><span style="flex:0 0 200px"></span></div>
        ${[[F[2], "Nerd Fonts", "3.1 → 3.2", "14 MB", true], [F[0], "Google Fonts", "4.0 → 4.1", "1.8 MB", true], [F[7], "Google Fonts", "1.2", "820 KB"], [F[11], "Nerd Fonts", "3.2", "11 MB"], [F[4], "Google Fonts", "2.0", "640 KB"], [F[10], "Google Fonts", "2.013", "9.6 MB"]].map(([f, src, v, sz, up]) => `<div class="tr"><span style="flex:1"><b class="fo-in" style="${ff(f, 18)}">${f[0]}</b></span><span style="flex:0 0 110px">${src}</span><span style="flex:0 0 90px" class="${up ? "fo-new" : ""}">${v}</span><span style="flex:0 0 70px">${sz}</span><span style="flex:0 0 200px;justify-content:flex-end">${up ? btn("Update", "sm", "refresh") : ""}${ib("folder", "Open folder")}${btn("Remove", "sm dtext")}</span></div>`).join("")}
      </div>
      <div class="fo-drop">${icon("download")}<span>Drop .ttf, .otf or .ttc files here to install them too</span></div>
      <div class="fo-danger"><div><b>Remove every font installed with Fonts</b><span>Fonts you added yourself and system fonts stay.</span></div>${btn("Remove all…", "dtext")}</div>
    </div>`;

  /* ── Option C: a type tester ────────────────────────────────────────── */
  const testerC = (o = {}) => `<div class="fo-tt">
    <div class="fo-ttbar"><div class="field big">${icon("pen")}<span>The quick fox naps by the harbour</span></div><div class="fo-size"><div class="slider"><div class="tr"><div class="fill" style="width:30%"></div></div><div class="kn" style="left:30%"></div></div><b>36 pt</b></div>${seg(["Light", "Regular", "Bold"], "Regular")}</div>
    <div class="fo-ttsub">${cats("All")}<span class="sp"></span>${dd("Popular", "sort")}</div>
    <div class="scroll fo-ttl">${F.slice(0, 7).map((f, i) => `<div class="fo-tr ${(o.pinned || []).includes(i) ? "pin" : ""}">
      <div class="h"><b>${f[0]}</b><span>${f[1]} · ${f[2]} styles</span><span class="sp"></span>${ib("pin", "Compare", (o.pinned || []).includes(i) ? "on" : "")}${f[6].update ? btn("Update", "sm", "refresh") : f[6].inst ? `<span class="fo-ok">${icon("check")}Installed</span>` : btn("Install", "sm", "download")}</div>
      <div class="s" style="${ff(f, 36)}">The quick fox naps by the harbour</div>
      ${f[1] === "Monospace" ? `<div class="nerd" style="font-family:'${f[3]}'">${NERD.map((g) => `<span>${g}</span>`).join("")}<em>Nerd Font icons included</em></div>` : ""}
    </div>`).join("")}</div>
    ${o.pinned ? `<div class="fo-tray"><span class="t">Comparing</span>${o.pinned.map((i) => `<span class="chip2 on" style="${ff(F[i])}">${F[i][0]} ${icon("x")}</span>`).join("")}<span class="sp"></span>${btn("Compare 3 fonts", "primary", "columns")}</div>` : ""}
  </div>`;

  const compareC = () => {
    const P = [F[0], F[1], F[4]];
    return `<div class="fo-cbar">${ib("chev-l", "Back")}<b>Comparing 3 fonts</b><span class="sp"></span>${seg(["Heading", "Paragraph", "Interface", "Code"], "Paragraph")}${btn("Add a font", "ghost", "plus")}</div>
    <div class="fo-cmp">${P.map((f) => `<div class="fo-col">
      <div class="h"><b>${f[0]}</b><span>${f[1]}</span><span class="sp"></span>${f[6].inst ? `<span class="fo-ok">${icon("check")}Installed</span>` : btn("Install", "sm primary", "download")}${ib("x", "Stop comparing")}</div>
      <div class="hd" style="${ff(f, 30, f[3] === "P052" ? 700 : 600)}">Weekend market opens at the harbour</div>
      <div class="p" style="${ff(f, 15)}">Stalls run from the lighthouse to the old ferry steps, with bread, cheese and late apples from the valley farms. Bring a bag; the first hundred visitors get a free coffee.</div>
      <div class="ui" style="${ff(f, 13)}"><span class="b1">Save changes</span><span class="b2">Cancel</span><span class="lnk">Learn more</span></div>
      <div class="nums" style="${ff(f, 20)}">0123456789 · €48.20 · 12:45</div>
      <div class="wf">${[12, 16, 22].map((z) => `<div><span>${z} px</span><b style="${ff(f, z)}">Stalls run from the lighthouse to the old ferry steps</b></div>`).join("")}</div>
      <div class="gl" style="${ff(f, 22)}">Aa Gg Rr Qq &amp; @ ? ! ß é ø</div>
    </div>`).join("")}</div>`;
  };

  /* ── New option C: a page you set with a pair of fonts ──────────────── */
  const hdrN = (end = "") => header({ icon: "type", name: "Fonts", center: search(NARROW ? "Search fonts" : "Search Google Fonts and Nerd Fonts", "Ctrl K"), end }).replace(ib("sidebar", "Sidebar (Ctrl+B)"), "");
  const updBtn = () => `<button class="n1-upd">${icon("refresh")}<span>2 updates</span></button>`;
  const SLOTS = { h: ["Heading", "violet"], b: ["Body", "teal"], c: ["Code", "amber"] };
  const tagSlot = (k) => `<span class="n1-tag" style="--sc:var(--sw-${SLOTS[k][1]})">${SLOTS[k][0]}</span>`;
  const status = (f) => f[6].update ? `<span class="fo-up">Update</span>` : f[6].inst ? icon("check-c", "fo-ic") : "";

  const n1Row = (f, o = {}) => `<div class="n1-r ${o.sel ? "sel" : ""}"><div class="tx"><div class="nm" style="${ff(f, 21)}">${f[0]}</div><div class="mt">${o.meta || `${f[1]} · ${f[2]} styles`}</div></div>${o.tag ? tagSlot(o.tag) : ""}${o.end ?? status(f)}</div>`;

  const n1Pick = (src, body, foot = `${icon("download")}<span>Drop .ttf or .otf files here to install them</span>`) => `<div class="list n1-pick">
    <div class="n1-src">${seg(["Google", "Nerd Fonts", "This computer"], src)}</div>
    ${body}
    <div class="n1-foot">${foot}</div>
  </div>`;

  const n1For = (k, what) => `<div class="n1-for" style="--sc:var(--sw-${SLOTS[k][1]})"><span class="d"></span><span>${what}</span></div>`;

  const n1Slots = (on, pair, end) => `<div class="n1-slots">${Object.entries(SLOTS).map(([k, [n, c]], i) => `<div class="n1-slot ${k === on ? "on" : ""}" style="--sc:var(--sw-${c})"><span class="k">${n}</span><b style="${ff(pair[i], 15, pair[i][3] === "Noto Serif Display" ? 400 : null)}">${pair[i][0]}</b><span class="st">${pair[i][6].inst ? icon("check-c") : ""}</span>${icon("chev-d", "cv")}</div>`).join("")}<span class="sp"></span>${end}</div>`;

  const PAIR = [F[3], F[1], F[2]];
  const n1Article = (pair = PAIR, on = "h") => {
    const [h, b, c] = pair;
    return `<div class="n1-paper">
      <div class="kick" style="${ff(b, 11)}">Harbour Notes · Issue 14</div>
      <div class="n1-zone ${on === "h" ? "on" : ""}" style="--sc:var(--sw-violet)"><div class="h1" style="${ff(h, NARROW ? 30 : 50, 300)}">The weekend market returns to the harbour</div>${on === "h" ? `<span class="zt">Heading · trying ${h[0]}</span>` : ""}</div>
      <div class="std" style="${ff(b, NARROW ? 14 : 18)}">Stalls run from the lighthouse to the old ferry steps, with bread, cheese and late apples from the valley farms.</div>
      <div class="by" style="${ff(b, 12)}">By Mara Quill · Saturday 14 November · 4 min read</div>
      <div class="cols2" style="${ff(b, NARROW ? 13.5 : 14.5)}"><p>The first boats come in before six, and by eight the quay smells of coffee and smoke. Bring a bag: the first hundred visitors get a free cup, and the bakery promises it won't run out of rye this time.</p><p>Parking fills fast, so the ferry runs every twenty minutes on market days. Dogs are welcome on a lead, and the tide table is posted by the harbour office.</p></div>
      <div class="q" style="${ff(h, NARROW ? 18 : 22, 400)}">“We sold out of apples by ten, twice.”</div>
      <div class="code" style="${ff(c, 12.5)}"><span class="c1">market</span>.open(<span class="c2">"08:00"</span>) <span class="c3">// 46 stalls, tide at 11:40</span></div>
      <div class="set">Set in ${h[0]}, ${b[0]} and ${c[0]}</div>
    </div>`;
  };

  const n1Pair = () => n1Pick("Google", `
    <div class="n1-fl"><span>1,961</span><span class="sp"></span>${dd("All categories", "filter")}${dd("Popular", "sort")}</div>
    ${n1For("h", "Choosing the <b>heading</b>: point at a font to try it")}
    <div class="scroll n1-rows">${[F[0], F[3], F[1], F[4], F[6], F[5], F[8], F[10], F[7], F[9]].map((f) => n1Row(f, { sel: f === F[3], tag: f === F[3] ? "h" : f === F[1] ? "b" : "", end: f === F[3] ? btn("Install", "sm primary", "download") : undefined })).join("")}</div>`);

  const n1PairPage = () => `<div class="cols">${n1Pair()}<div class="main n1-sheet">${n1Slots("h", PAIR, `${seg(["Article", "Interface", "Terminal"], "Article")}${btn("Install 2", "primary", "download")}`)}<div class="scroll n1-desk">${n1Article()}</div></div></div>`;

  const NF = [
    ["Ferrule Code", "Monospace", 6, "FiraCode Nerd Font", 400, "Ferrule", {}],
    F[2],
    ["Pylon Mono", "Monospace", 8, "JetBrainsMono Nerd Font", 300, "Pylon Works", {}],
    ["Tern Code", "Monospace", 4, "FiraCode Nerd Font", 500, "Tern", { inst: true }],
    ["Gantry Mono", "Monospace", 6, "JetBrainsMono Nerd Font", 700, "Gantry", {}],
    ["Spool Mono", "Monospace", 5, "FiraCode Nerd Font", 300, "Spool & Co.", {}],
    ["Rivet Mono", "Monospace", 7, "JetBrainsMono Nerd Font", 500, "Rivet", {}],
    ["Bollard Mono", "Monospace", 4, "FiraCode Nerd Font", 400, "Bollard", {}],
    ["Capstan Code", "Monospace", 8, "JetBrainsMono Nerd Font", 400, "Capstan", {}],
    ["Mooring Mono", "Monospace", 6, "FiraCode Nerd Font", 300, "Mooring", {}],
    ["Winch Mono", "Monospace", 5, "JetBrainsMono Nerd Font", 600, "Winch Type", {}],
  ];
  const glyphs = (f, n = 6) => `<span class="n1-gl" style="font-family:'${f[3]}'">${NERD.slice(0, n).join(" ")}</span>`;
  const n1Code = () => {
    const pair = [F[3], F[1], NF[0]];
    const c = NF[0];
    const T = (s) => `<div>${s}</div>`;
    return `<div class="cols">${n1Pick("Nerd Fonts", `
      <div class="n1-fl"><span>72 families, icons included</span><span class="sp"></span>${dd("Popular", "sort")}</div>
      ${n1For("c", "Choosing the <b>code</b> font")}
      <div class="scroll n1-rows">${NF.map((f, i) => n1Row(f, { sel: i === 0, tag: i === 0 ? "c" : "", meta: `${f[2]} styles ${glyphs(f)}`, end: i === 0 ? btn("Install", "sm primary", "download") : undefined })).join("")}</div>`)}
      <div class="main n1-sheet">${n1Slots("c", pair, `${seg(["Article", "Interface", "Terminal"], "Terminal")}${btn("Install 3", "primary", "download")}`)}
        <div class="scroll n1-desk"><div class="n1-term" style="${ff(c, 14)}">
          <div class="bar"><b></b><b></b><b></b><span>kitty: ~/harbour</span></div>
          <div class="body">
            ${T(`<span class="pl a">\uf015 ~/harbour </span><span class="pa a">\ue0b0</span><span class="pl b">\ue725 main </span><span class="pa b">\ue0b0</span> ls`)}
            ${T(`<span class="bl">\uf07b src</span>&nbsp;&nbsp;<span class="bl">\uf07b assets</span>&nbsp;&nbsp;<span class="or">\ue7a8 main.rs</span>&nbsp;&nbsp;<span class="gr">\uf121 index.html</span>&nbsp;&nbsp;\uf013 config.toml`)}
            ${T(`<span class="pl a">\uf015 ~/harbour </span><span class="pa a">\ue0b0</span><span class="pl b">\ue725 main </span><span class="pa b">\ue0b0</span> cat src/tide.rs`)}
            ${T(`<span class="kw">fn</span> <span class="fn">is_open</span>(stalls: <span class="ty">u32</span>, tide: <span class="ty">f32</span>) -&gt; <span class="ty">bool</span> {`)}
            ${T(`&nbsp;&nbsp;&nbsp;&nbsp;stalls &gt;= <span class="nu">40</span> &amp;&amp; tide != <span class="nu">0.0</span> <span class="cm">// =&gt; true on market days</span>`)}
            ${T(`}`)}
            ${T(`<span class="pl a">\uf015 ~/harbour </span><span class="pa a">\ue0b0</span><span class="pl b">\ue725 main </span><span class="pa b">\ue0b0</span> <span class="cur"></span>`)}
          </div>
        </div>
        <div class="card n1-var"><div class="h"><b>Install ${c[0]} as</b><span>Which Nerd Font variants to keep</span></div>
          ${[["Mono", "Icons one cell wide, for terminals", true], ["Regular", "Larger icons, for editors and bars", true], ["Propo", "Proportional, for interfaces", false]].map(([t, d, on]) => `<div class="opt"><span class="cbx sq ${on ? "done" : ""}">${on ? icon("check") : ""}</span><div class="opt-text"><div>${t}</div><div class="d">${d}</div></div></div>`).join("")}
        </div>
        <div class="card n1-sizes"><div class="h"><b>At terminal sizes</b></div>${[11, 13, 16].map((z) => `<div class="z"><span>${z} px</span><b style="${ff(c, z)}">\uf07b src  \ue725 main  stalls &gt;= 40 &amp;&amp; tide != 0.0 =&gt; open</b></div>`).join("")}</div></div>
      </div></div>`;
  };

  const n1Mine = () => {
    const sec = (t, n, end = "") => `<div class="n1-sec"><span>${t}</span><em>${n}</em><span class="sp"></span>${end}</div>`;
    const act = `${ib("folder", "Open the font's folder")}${btn("Remove", "sm dtext")}`;
    return n1Pick("This computer", `
      <div class="scroll n1-rows">
        ${sec("Updates", 2, btn("Update all", "sm primary", "refresh"))}
        ${n1Row(F[2], { meta: "Nerd Fonts · 3.1 → <b class=\"fo-new\">3.2</b>", end: btn("Update", "sm", "refresh") })}
        ${n1Row(F[0], { meta: "Google · 4.0 → <b class=\"fo-new\">4.1</b>", end: btn("Update", "sm", "refresh") })}
        ${sec("Installed with Fonts", 4)}
        ${n1Row(F[7], { meta: "Google · 820 KB" })}
        ${n1Row(F[11], { meta: "Nerd Fonts · 11 MB" })}
        ${n1Row(F[4], { meta: "Google · 640 KB", sel: true, tag: "b", end: act })}
        ${sec("System and yours", 214)}
        ${n1Row(F[10], { meta: "System" })}
        ${n1Row(F[8], { meta: "Added by you" })}
      </div>`);
  };
  const n1MinePage = () => {
    const pair = [F[0], F[4], F[2]];
    return `<div class="cols">${n1Mine()}<div class="main n1-sheet">${n1Slots("b", pair, "")}<div class="scroll n1-desk">${n1Article(pair, "b")}</div></div></div>`;
  };

  /* ── New option D: flip through one specimen at a time ──────────────── */
  const n2Bar = (src) => `<div class="n2-tb">${seg(["Google Fonts", "Nerd Fonts", "This computer"], src)}${NARROW ? "" : cats(src === "Nerd Fonts" ? "Monospace" : "All")}<span class="sp"></span>${src === "This computer" ? `<span class="n2-upd">${icon("refresh")}2 updates</span>${btn("Update all", "primary")}` : ""}${dd(src === "This computer" ? "Name" : "Popular", "sort")}</div>`;

  const n2Idx = (list, cur, total, end = "") => `<div class="n2-idx"><div class="n2-cnt"><b>${cur + 1} of ${total}</b><span>${kbd("←")} ${kbd("→")} to flip</span></div><div class="n2-cards">${list.map((f, i) => `<div class="n2-ic ${i === cur ? "on" : ""}"><span class="aa" style="${ff(f, 26)}">Aa</span><span class="nm">${f[0]}</span>${f[6].update ? `<i class="n2-dot up"></i>` : f[6].inst ? `<i class="n2-dot"></i>` : ""}</div>`).join("")}${end}</div></div>`;

  const n2Poster = (f, o = {}) => {
    const mono = f[1] === "Monospace";
    const line = mono ? "let tide = harbour.next_high();" : SAMPLE;
    const action = o.action || (f[6].inst ? `<span class="fo-ok big">${icon("check")}Installed</span>${ib("folder", "Open the font's folder")}${btn("Remove", "dtext")}` : `${btn("Install", "primary n2-inst", "download")}`);
    return `<div class="n2-stage">
      <button class="n2-nav">${icon("chev-l")}</button>
      <div class="n2-pc">
        <div class="l">
          <div class="n2-meta"><span>${f[1]}</span><span>${f[2]} styles${f[6].variable ? " · variable" : ""}</span><span>by ${f[5]}</span>${mono ? `<span class="nf">Nerd Font icons</span>` : ""}</div>
          <div class="n2-name" style="${ff(f, NARROW ? 54 : 84, f[3] === "Noto Serif Display" ? 300 : null)}">${f[0]}</div>
          <div class="n2-try"><div class="field">${icon("pen")}<span>${line}</span></div><div class="fo-size"><div class="slider"><div class="tr"><div class="fill" style="width:40%"></div></div><div class="kn" style="left:40%"></div></div><b>48</b></div></div>
          <div class="n2-wf">${(NARROW ? [14, 20, 28, 36] : [14, 20, 30, 46]).map((z) => `<div><span>${z}</span><b style="${ff(f, z)}">${line}</b></div>`).join("")}</div>
        </div>
        <div class="r">
          <div class="n2-aa" style="${ff(f, 132)}">Aa</div>
          <div class="n2-gl" style="${ff(f, 20)}">${"ABCDEFGHIJKLMNOPQRSTabcdefghijklmnopqrst0123456789&@?!".slice(0, NARROW ? 20 : 54).split("").map((ch) => `<span>${ch}</span>`).join("")}</div>
          ${mono ? `<div class="n2-ico" style="font-family:'${f[3]}'">${NERD.map((g) => `<span>${g}</span>`).join("")}</div>` : `<div class="n2-wts">${[300, 400, 500, 700].map((w) => `<span style="${ff(f, 22, w)}">Ag</span>`).join("")}</div>`}
          <div class="n2-lic">Open Font License · Latin, Greek, Cyrillic</div>
          <div class="n2-act">${action}</div>
        </div>
      </div>
      <button class="n2-nav">${icon("chev-r")}</button>
    </div>`;
  };

  const n2Flip = () => `${n2Bar("Google Fonts")}${n2Poster(F[3])}${n2Idx(F.slice(0, 11), 3, "1,961")}`;

  const n2Install = () => {
    const f = NF[0];
    const body = `<div class="card n2-dv">${[["Mono", "Icons one cell wide; best for terminals", true], ["Regular", "Larger icons, for editors and bars", true], ["Propo", "Proportional spacing, for interfaces", false]].map(([t, d, on]) => `<div class="opt"><span class="cbx sq ${on ? "done" : ""}">${on ? icon("check") : ""}</span><div class="opt-text"><div>${t}</div><div class="d">${d}</div></div><span class="n2-sz">${on ? "4 MB" : ""}</span></div>`).join("")}</div>
      <div class="n2-where">${icon("folder")}<span>Goes to <b>~/.local/share/fonts/nyx-fonts</b>, just for you. Apps see it right away.</span></div>
      <div class="n2-rem">${sw(true)}<span>Use these choices for every Nerd Font</span></div>`;
    return `${n2Bar("Nerd Fonts")}${n2Poster(f)}${n2Idx([NF[2], NF[1], NF[0], ...NF.slice(3)], 2, 72)}${dialog(`Install ${f[0]}`, "Version 3.2 · 6 styles · 8 MB with the variants ticked below.", [btn("Cancel"), btn("Install", "primary", "download")], body, 440)}`;
  };

  const n2Mine = () => {
    const f = F[2];
    const list = [F[0], F[7], F[2], F[11], F[4], F[10], F[8], F[1]];
    return `${n2Bar("This computer")}
      ${n2Poster(f, { action: `${btn("Update to 3.2", "primary", "refresh")}${ib("folder", "Open the font's folder")}${btn("Remove", "dtext")}` })}
      ${n2Idx(list, 2, 220, `<div class="n2-drop">${icon("download")}<span>Drop font files to add them</span></div>`)}`;
  };

  REG("fonts", {
    name: "Fonts",
    summary: "Fonts has both catalogs, live previews and one-click installs, but its main view is a plain table of names in the interface font, so you have to click every row to see what a font looks like, and the preview below squeezes the list to four rows.",
    problems: [
      "<b>You can't see the fonts:</b> the table lists every family in the app's own font, so finding a nice serif means clicking down the list one row at a time.",
      "<b>Two search boxes, one under the other:</b> “Search both catalogs” in the header and “Filter Google Fonts” on the page.",
      "<b>The preview squeezes the list:</b> at 1280 px it takes the lower half, leaving four rows of the table; at 800 px the sample wraps and the alphabet falls off the bottom.",
      "<b>Install hides in the preview:</b> there's no way to install from the list, and once installed, Remove is a red button next to a bare folder icon.",
      "<b>Counts squashed into the header</b> (“1,961 Google · 72 Nerd · 6 installed”) in small grey text.",
      "<b>No updates in sight:</b> when an installed font has a newer version, nothing says so until you open Installed and read the Status column.",
      "<b>The sidebar has four rows and a lot of space,</b> with nothing for the sample text or size, which live only in the preview.",
      "<b>Dropping font files to install them</b> works anywhere in the window, but nothing in the app says so.",
    ],
    today: [["fonts-1280", "Today at 1280 px", "Names in the app font; preview squeezes the list"], ["fonts-800", "Today at 800 px", "Two searches; the sample wraps"]],
    options: [
      { id: "a", name: "List and specimen", idea: "Closest to today, fixed. The list keeps its speed but draws each name in its own font, and the specimen moves beside it at full height, with the sample, size and style above it and Install at the top. Installed becomes a proper page with updates first, Update all, the drop area for your own font files, and Remove all set apart at the bottom.",
        shots: [
          ["b-list","Google Fonts","Names in their fonts; full-height specimen"],
          ["b-installed","Installed","Updates first; drop your own files"],
          ["b-list-800","At 800 px","Rail, list and specimen"],
        ] },
      { id: "b", name: "Type tester", idea: "For choosing a font for something. Type your own line once and every font shows it at the same size, one per row, with Install beside it; Nerd Fonts show their icons. Pin a few to compare them side by side as a heading, a paragraph, buttons and numbers.",
        shots: [
          ["c-tester","Testing a line","Your text in every font, three pinned"],
          ["c-compare","Comparing three","Heading, paragraph, buttons, numbers"],
          ["c-tester-800","At 800 px","Rail, same rows"],
        ] },
      { id: "c", name: "Pairing sheet", idea: "You choose fonts by setting a real page with them. The page has three slots, Heading, Body and Code; pick a slot, point at fonts in the list and the page changes as you go. Switch the page between an article, an app's interface and a terminal (where Nerd Font icons and ligatures show). Install the whole pair in one go. Your own fonts and updates are the list's third tab. Suits people choosing fonts for a site, a document or their desktop.",
        shots: [
          ["n1-pair","Choosing a heading","Point at a font; the page changes"],
          ["n1-code","Choosing a code font","Nerd Fonts in a terminal, variants to keep"],
          ["n1-mine-800","At 800 px","Your fonts and updates, in the same list"],
        ] },
      { id: "d", name: "Flip through", idea: "One font at a time, as a full specimen page: its name set large in itself, your own line at four sizes, its characters, weights or Nerd icons, and Install. ← and → flip to the next font, with the neighbours shown as small cards along the bottom. Install asks once which files to keep (static or variable, which Nerd variants) and can remember. Suits browsing for something that catches your eye rather than searching for a name.",
        shots: [
          ["n2-flip","Browsing Google Fonts","One specimen per page, flip with the arrows"],
          ["n2-install","Installing a Nerd Font","Pick the variants once"],
          ["n2-mine-800","At 800 px","Your fonts, with updates on top"],
        ] },
    ],
    pages: {
      "a-grid": () => win({ hdr: hdr(), side: sideA(), page: gridA() }),
      "a-family": () => win({ hdr: hdr(), side: sideA(), page: familyA() }),
      "b-list": () => win({ hdr: hdr(), side: sideB(), page: `<div class="cols">${listB()}${inspB()}</div>` }),
      "b-installed": () => win({ hdr: hdr({ q: "Search fonts" }), side: sideB("inst"), page: installedB() }),
      "c-tester": () => win({ hdr: hdr(), side: sideB(), page: testerC({ pinned: [0, 1, 4] }) }),
      "c-compare": () => win({ hdr: hdr(), side: sideB(), page: compareC() }),
      "n1-pair": () => win({ hdr: hdrN(updBtn()), side: "", page: n1PairPage() }),
      "n1-code": () => win({ hdr: hdrN(updBtn()), side: "", page: n1Code() }),
      "n1-mine": () => win({ hdr: hdrN(updBtn()), side: "", page: n1MinePage() }),
      "n2-flip": () => win({ hdr: hdrN(), side: "", page: n2Flip() }),
      "n2-install": () => win({ hdr: hdrN(), side: "", page: n2Install() }),
      "n2-mine": () => win({ hdr: hdrN(), side: "", page: n2Mine() }),
    },
    icons: {
      type: '<path d="M4 20 10 4h1.5l6 16M6.3 14h9"/><path d="M17 20h4"/>',
    },
  });
})();
