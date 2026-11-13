// Nyx News on the revamp page: today's problems and three options.
(() => {
  const TOPICS = [["globe", "World", "blue", 14], ["flag", "National", "red", 9], ["users", "Politics", "violet", 7], ["chart", "Business", "amber", 11], ["monitor", "Technology", "teal", 16], ["flask", "Science", "green", 6], ["heart", "Health", "pink", 5], ["palette", "Culture", "coral", 4]];
  const S = [
    ["The Meridian", "World", "Global talks reach a deal to cut ocean plastics by half", "Negotiators from 140 countries agreed overnight on limits for single-use packaging, with a fund to help poorer coastal nations clean up.", "38 min ago", "6 min read", "ocean1"],
    ["Field Notes", "Science", "Researchers grow coral that survives warmer seas", "A reef nursery off the southern coast bred corals that kept their colour through a summer two degrees above normal.", "1 h ago", "5 min read", "coral2"],
    ["Circuit Weekly", "Technology", "Chipmakers race to build smaller, cooler processors", "Three manufacturers showed designs that use half the power of last year's chips, aimed at laptops that last a full day.", "2 h ago", "4 min read", "chip3"],
    ["Market Daily", "Business", "Central bank holds rates and hints at cuts next year", "Officials kept borrowing costs steady for a fourth meeting but said inflation is cooling faster than they expected.", "2 h ago", "3 min read", "bank4"],
    ["Civic Post", "Health", "Daily walks linked to better sleep in a ten-year study", "People who walked 30 minutes a day fell asleep faster and woke less often, whatever time of day they walked.", "3 h ago", "4 min read", "walk5"],
    ["Open Lens", "Culture", "A museum of lost sounds opens in an old train station", "Dial-up modems, typewriters and the last steam whistle in the region are among 400 recordings you can play.", "4 h ago", "5 min read", "museum6"],
    ["Northwind Times", "National", "Storm season ends quieter than forecasters expected", "Only four named storms reached land this year, the fewest in a decade, though flooding hit two river towns hard.", "5 h ago", "3 min read", "storm7"],
    ["Civic Post", "Politics", "Election officials test new paper ballot scanners", "Counties will trial the machines in spring, with a hand count of every tenth ballot to check them.", "6 h ago", "4 min read", "ballot8"],
  ];
  const tc = (t) => (TOPICS.find((x) => x[1] === t) || [0, 0, "blue"])[2];
  const kicker = (src, topic, time) => `<span class="nk"><b style="color:${swc(tc(topic))}">${topic}</b><span>${src} · ${time}</span></span>`;

  const hdr = (o = {}) => header({ icon: "rss", name: "News", center: search(o.q || "Search stories", "Ctrl F"), end: o.end !== undefined ? o.end : `<button class="newbtn">${icon("plus")}<span>Follow</span><span class="key">Ctrl N</span></button>` });

  /* ── Option A: a tidy front page ────────────────────────────────────── */
  const side = (on = "top") => `
    ${grp("Today", false, "", "accent")}
    ${navx("newspaper", "Top stories", { active: on === "top", cnt: 72 })}
    ${navx("star", "For you", { active: on === "foryou", cnt: 18 })}
    ${navx("bookmark", "Saved", { active: on === "saved", badge: 4 })}
    ${grp("Topics", false, "", "violet")}
    ${TOPICS.map(([ic, n, c, k]) => navx("", n, { dot: swc(c), cnt: k, active: on === n })).join("")}
    ${grp("Following", false, icon("plus"), "amber")}
    ${[["The Meridian", 12], ["Circuit Weekly", 8], ["Field Notes", 5], ["Market Daily", 3]].map(([n, k]) => navx("rss", n, { cnt: k, active: on === n })).join("")}
    ${navx("compass", "Channels and topics", { active: on === "discover" })}
    <div class="foot">${icon("check-c", "ok")}<span>Updated 4 min ago</span></div>`;
  const briefing = (o = {}) => `<div class="brief ${o.cls || ""}">
    <div class="bh">${icon("sparkle")}<b>Your briefing</b><span>Five minutes, from today's top stories</span><span class="sp"></span>${btn("Listen", "ghost sm", "volume")}${btn("Read it all", "sm")}</div>
    <ul>${[["Ocean plastics:", "140 countries agree to halve single-use packaging, with a clean-up fund for coastal nations."], ["Rates:", "the central bank holds steady for a fourth time and hints at cuts next year."], ["Coral:", "a southern reef nursery bred corals that kept their colour through a hot summer."]].slice(0, o.n || 3).map(([a, b]) => `<li><b>${a}</b> ${b}</li>`).join("")}</ul>
  </div>`;
  const lead = (s = S[0]) => `<div class="lead">${art(s[6], { w: "46%", h: 230, r: 10, cls: "limg" })}<div class="ltx">${kicker(s[0], s[1], s[4])}<h2>${s[2]}</h2><p>${s[3]}</p><span class="lm">${s[5]} · ${icon("bookmark")} Save</span></div></div>`;
  const scard = (s) => `<div class="scard2">${art(s[6], { h: 116, r: 8 })}<div class="sc-tx">${kicker(s[0], s[1], s[4])}<b>${s[2]}</b></div></div>`;
  const shelf = (name, items) => `<div class="sechead">${name}<span class="more">See all ${icon("chev-r")}</span></div><div class="shelf">${items.map(scard).join("")}</div>`;
  const frontA = () => `<div class="main npage">
    ${pbar2("Top stories", "Thursday 12 November · 72 stories", `${seg(["Cards", "Headlines"], "Cards")}${ib("refresh", "Refresh (R)")}`)}
    <div class="content">
      ${briefing()}
      ${lead()}
      ${shelf("Also today", [S[1], S[2], S[3]])}
    </div></div>`;
  const readerBody = (o = {}) => `<div class="rcol">
    ${kicker("The Meridian", "World", "38 min ago")}
    <h1>Global talks reach a deal to cut ocean plastics by half</h1>
    <div class="rmeta">${av("Ines Calder", 26)}<span>By <b>Ines Calder</b> · 6 min read</span></div>
    ${o.noSum ? "" : `<div class="rsum">${icon("sparkle")}<div><b>In short</b><ul><li>Single-use packaging must fall by half by 2035.</li><li>A clean-up fund pays poorer coastal nations to collect waste.</li><li>Three big producers signed on only at the last minute.</li></ul></div></div>`}
    ${art("ocean1", { h: o.imgH || 220, r: 10 })}
    <p class="cap">Volunteers sort plastic collected along the northern shore. <span>Photo: Harbor Lens</span></p>
    <p>Negotiators from 140 countries agreed overnight to halve single-use plastic packaging within ten years, ending two weeks of talks that several times looked close to collapse.</p>
    <p>The deal sets a cap on new plastic made for packaging and creates a fund, paid for by the largest producers, to help coastal nations that receive much of the world's waste on their beaches.</p>
  </div>`;
  const readerA = () => `<div class="main npage reader">
    <div class="rbar2">${btn("Top stories", "ghost", "chev-l")}<span class="sp"></span>${btn("Open at The Meridian", "primary", "external")}${btn("Saved", "on", "bookmark")}${ib("copy", "Copy link")}${ib("textsize", "Text size")}${ib("more", "More: brief, compare sources, read aloud, export as a note")}</div>
    <div class="scroll">${readerBody()}</div>
  </div>`;

  /* ── Option B: three panes ──────────────────────────────────────────── */
  const nrow = (s, i, sel) => `<div class="nrow ${sel ? "sel" : ""} ${i < 4 ? "unread" : ""}"><div class="tx"><span class="src"><span class="sdot" style="background:${swc(tc(s[1]))}"></span>${s[0]}<span class="t">${s[4]}</span></span><b>${s[2]}</b><span class="ex">${s[3]}</span></div>${art(s[6], { w: 64, h: 64, r: 8 })}</div>`;
  const listB = (sel = 0) => `<div class="list nlist">
    <div class="lhead4"><b>Top stories</b><span class="sp"></span>${seg(["All", "Unread", "Starred"], "All")}</div>
    <div class="scroll">${S.map((s, i) => nrow(s, i, i === sel)).join("")}</div></div>`;
  const readerB = () => `<div class="main npage reader">
    <div class="rbar2">${btn("Open at The Meridian", "primary", "external")}<span class="sp"></span>${ib("star", "Star (S)")}${ib("bookmark", "Save (B)")}${ib("check", "Mark unread (M)")}${btn("Summarize", "", "sparkle")}${ib("more", "More: brief, compare sources, read aloud, export")}</div>
    <div class="scroll">${readerBody({ noSum: true, imgH: 200 })}</div></div>`;
  const discoverB = () => `<div class="main npage">
    ${pbar2("Channels and topics", "Follow what you want on your front page", `${btn("Import", "ghost", "import")}${btn("Export", "ghost", "export")}`)}
    <div class="content"><div class="disc">
      <div class="sechead">Topics</div>
      <div class="tgrid">${TOPICS.map(([ic, n, c], i) => `<div class="tcard ${i < 6 ? "on" : ""}" style="--dc:${swc(c)}"><span class="hc-ic">${icon(ic)}</span><b>${n}</b>${i < 6 ? `<span class="fl">${icon("check")} Following</span>` : `<span class="fl add">${icon("plus")} Follow</span>`}</div>`).join("")}</div>
      <div class="sechead">Publications</div>
      <div class="card pubs">${[["The Meridian", "World news, every morning", true], ["Circuit Weekly", "Chips, gadgets and the people who make them", true], ["Harbor Ledger", "The coast, its towns and its water", false], ["Field Notes", "Science, explained", true], ["Open Lens", "Arts, film and photography", false]].map(([n, d, f]) => `<div class="opt">${av(n, 32)}<div class="opt-text"><div>${n}</div><div class="d">${d}</div></div>${f ? btn("Following", "", "check") : btn("Follow", "primary", "plus")}</div>`).join("")}</div>
      <div class="sechead">Add a feed or a website</div>
      <div class="addf"><div class="field">${icon("link")}<span class="ph">A website or feed address, like harborledger.example</span></div>${btn("Find", "primary")}</div>
      <p class="nnote">${icon("info")} RSS, Atom and JSON feeds. Private and local addresses aren't fetched.</p>
    </div></div></div>`;

  /* ── Option C: a morning edition ────────────────────────────────────── */
  const tabsC = (on) => `<div class="ntabs">${["Today", "For you", "Saved", "Topics"].map((t) => `<span class="ntab ${t === on ? "on" : ""}">${t}${t === "Topics" ? icon("chev-d") : ""}${t === "Saved" ? `<span class="bdg">4</span>` : ""}</span>`).join("")}</div>`;
  const hdrC = (on = "Today") => header({ icon: "rss", name: "News", center: tabsC(on), end: `${ib("search", "Search (Ctrl F)")}${ib("plus", "Follow (Ctrl N)")}` });
  const edition = () => `<div class="main npage"><div class="content ed"><div class="clamp" style="--clamp: 780px">
    <div class="mast"><div><span class="dt">Thursday 12 November</span><h1>Good morning</h1></div><span class="sp"></span><span class="mm">72 stories from 9 publications · ${icon("refresh")} 4 min ago</span></div>
    ${briefing({ cls: "big", n: 3 })}
    <div class="sechead">The top five</div>
    <ol class="top5">${S.slice(0, 5).map((s, i) => `<li><span class="num">${i + 1}</span><div class="tx">${kicker(s[0], s[1], s[4])}<b>${s[2]}</b><span class="ex">${s[3]}</span></div>${art(s[6], { w: 108, h: 72, r: 8 })}</li>`).join("")}</ol>
  </div></div></div>`;
  const sheetC = () => `<div class="veil nveil"><div class="nsheet pop">
    <div class="rbar2">${btn("Close", "ghost", "x")}<span class="sp"></span>${btn("Open at The Meridian", "primary", "external")}${btn("Save", "", "bookmark")}${ib("textsize", "Text size")}${ib("more", "More")}</div>
    <div class="scroll">${readerBody({ imgH: 200 })}</div>
    <div class="nnext"><span>Next:</span><b>Researchers grow coral that survives warmer seas</b><span class="sp"></span>${kbd("J")}</div>
  </div></div>`;

  REG("news", {
    name: "News",
    summary: "News reads well once a story is open, but the front page is one giant headline, the AI briefing shows a clipped raw line, and the reader is a row of nine bare icons.",
    problems: [
      "<b>One story fills the screen:</b> the lead headline runs to six lines of large serif type, its photo floats in empty space, and nothing else is visible without scrolling.",
      "<b>The briefing is a clipped raw line:</b> “• [The Guardian] Pat Cummins press conference…” with the source in brackets, cut off, and two controls (a chevron and “Read briefing →”) for the same thing.",
      "<b>The reader's toolbar is nine bare icons:</b> Summarize, Brief, Compare, Speak, Save, Copy, Text size, Open and Export look the same, and “Read at publisher”, the thing you most often want, isn't any more prominent.",
      "<b>Following is hidden at the foot:</b> “Channels &amp; Topics” is pinned to the sidebar's bottom with a map-pin icon, and the publications you follow aren't listed anywhere you can click.",
      "<b>The page name shows twice:</b> “Top Stories” in the header and again in the page bar, beside a bare refresh and a bare layout toggle that repeats Settings › Layout.",
      "<b>At 800 px</b> the rail is twelve similar icons (eight topics among them), and the lead photo is cropped to a face's chin.",
      "<b>Unread and starred are half there:</b> the shortcuts M and S and the empty states mention them, but the sidebar has no Unread or Starred to find them.",
    ],
    today: [["news-1280", "Today at 1280 px", "Briefing line and one giant lead story"], ["news-800", "Today at 800 px", "Rail of twelve icons; the lead photo cropped"]],
    options: [
      { id: "a", name: "Your sources, tidied", idea: "The sidebar groups Today, your topics and the publications you follow, and Channels and topics becomes a proper page for following topics and feeds. Two ways to read: as a front page (a three-line briefing you can listen to, a lead story in proportion, then cards; the reader puts Open at the publisher first), or as three panes (sources, headlines with an unread dot, and the story beside them; J and K walk down the list).",
        variants: ["As a front page","As three panes"],
        shots: [
          ["a-front","As a front page · Top stories","Briefing, a lead story and cards"],
          ["a-reader","As a front page · Reading a story","Open at the publisher first; a short summary on top"],
          ["a-front-800","As a front page · At 800 px","Rail with coloured bars; the lead stacks"],
          ["b-reader","As three panes · Headlines and a story","Unread first; the story beside the list"],
          ["b-discover","As three panes · Channels and topics","Topics, publications, add by address, import and export"],
          ["b-reader-800","As three panes · At 800 px","Rail, headlines and the story"],
        ] },
      { id: "b", name: "A morning edition", idea: "One calm column, like a paper. Tabs across the header (Today, For you, Saved, Topics) replace the sidebar; Today opens with a briefing, then the top five stories numbered with a photo each, then the rest. A story opens over the page as a sheet you close to get back to exactly where you were, with the next story waiting at its foot. Best if you read News once a day, over breakfast.",
        shots: [
          ["c-today","Today","Briefing and the top five"],
          ["c-story","A story","Opens as a sheet over the edition"],
          ["c-today-800","At 800 px","The same column, tighter"],
        ] },
    ],
    pages: {
      "a-front": () => win({ hdr: hdr(), side: side("top"), page: frontA() }),
      "a-reader": () => win({ hdr: hdr(), side: side("top"), page: readerA() }),
      "b-reader": () => (NARROW ? railed : (x) => x)(win({ hdr: hdr(), side: side("top"), page: `<div class="cols">${listB()}${readerB()}</div>` })),
      "b-discover": () => win({ hdr: hdr(), side: side("discover"), page: discoverB() }),
      "c-today": () => win({ hdr: hdrC(), side: "", page: edition() }),
      "c-story": () => win({ hdr: hdrC(), side: "", page: edition(), over: sheetC() }),
    },
    icons: {
      rss: '<path d="M5 19.5h.01M4.5 11a8.5 8.5 0 0 1 8.5 8.5M4.5 4.5a15 15 0 0 1 15 15" stroke-width="1.9"/>',
      newspaper: '<path d="M4 5.5h13v13a2 2 0 0 0 2 2H6a2 2 0 0 1-2-2zM17 9h3v9.5a2 2 0 0 1-4 0"/><path d="M7.5 9h6M7.5 12.5h6M7.5 16h4"/>',
      chart: '<path d="M4 20V10M10 20V4M16 20v-7M21 20H3"/>',
      flask: '<path d="M9.5 3.5h5M10 3.5v6L4.8 18.3A1.5 1.5 0 0 0 6.1 20.5h11.8a1.5 1.5 0 0 0 1.3-2.2L14 9.5v-6M7.5 15h9"/>',
      textsize: '<path d="M3 18 7.5 6l4.5 12M4.6 14h5.8M14 18l3-8 3 8M15 15.5h4"/>',
    },
  });
})();
