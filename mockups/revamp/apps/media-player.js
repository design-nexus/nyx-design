// Nyx Media Player on the revamp page: today's problems and three options.
(() => {
  // Film stills drawn in CSS (media-player.css): sc("space") etc.
  const sc = (k, cls = "", inner = "") => `<div class="sc sc-${k} ${cls}">${inner}</div>`;
  const SCENES = ["dusk", "sea", "forest", "city", "desert", "snow", "space", "lab"];

  const MOVIES = [
    ["The Lantern Keeper", 2021, "2 h 4 min", "7.8", { pct: 48 }],
    ["Saltwater Hymn", 2023, "2 h 11 min", "8.2", { seen: true }],
    ["Northbound", 2019, "1 h 52 min", "7.1", {}],
    ["Glass Harbor", 2022, "1 h 57 min", "7.4", { seen: true }],
    ["Kite Season", 2024, "1 h 44 min", "7.0", { isnew: true }],
    ["A Map of Rain", 2022, "1 h 41 min", "8.0", {}],
    ["The Quiet Engine", 2020, "2 h 20 min", "7.6", { pct: 12 }],
    ["Low Tide Club", 2023, "1 h 49 min", "7.3", {}],
    ["Copper Valley", 2016, "2 h 8 min", "7.7", { seen: true }],
    ["Signal Fires", 2025, "1 h 58 min", "7.5", { isnew: true }],
    ["Paper Moons", 2018, "1 h 38 min", "6.9", {}],
    ["Ember & Ash", 2017, "2 h 2 min", "6.8", {}],
    ["Winter Orchard", 2021, "1 h 46 min", "7.2", {}],
    ["The Ninth Bell", 2024, "2 h 15 min", "7.9", { isnew: true }],
    ["Far Shore", 2020, "1 h 55 min", "7.0", {}],
    ["Hollow Lights", 2019, "1 h 50 min", "6.7", {}],
    ["Sundial", 2023, "1 h 36 min", "7.4", {}],
    ["Brass Garden", 2018, "2 h 1 min", "7.1", {}],
  ];
  const scOf = (i) => SCENES[i % SCENES.length];

  const openBtn = (label = true) => `<button class="newbtn">${icon("plus")}<span>Open</span>${label ? `<span class="key">Ctrl O</span>` : ""}</button>`;
  const hdr = () => header({ icon: "film", name: "Media Player", center: search("Search movies, shows and episodes"), end: openBtn() });
  // A header without the sidebar button, for the options that have no sidebar.
  const hdrNoSide = ({ center = "", start = "", end = "" }) => `<header class="hdr"><div class="hdr-id">${icon("film", "app-ic")}<span class="app-name">Media Player</span></div><div class="hdr-start">${start}</div><div class="hdr-center">${center}</div><div class="hdr-end">${end}<span class="gap"></span>${ib("sliders", "Settings (Ctrl+,)")}</div></header>`;

  const wcard = ([k, title, sub, pct, dur]) => `<div class="wcard"><div class="th">${sc(k)}${pct ? `<span class="pb"><b style="width:${pct}%"></b></span>` : ""}${dur ? `<span class="dur">${dur}</span>` : ""}</div><b>${title}</b><span>${sub}</span></div>`;
  const cardRow = (title, items, more = "See all") => `<div class="crow3"><div class="sechead">${title}${more ? `<span class="more">${more}</span>` : ""}</div><div class="cards">${items.map(wcard).join("")}</div></div>`;

  const CONT = [["dusk", "The Lantern Keeper", "1 h 4 min left", 48], ["city", "Harbor Lights", "S1 · E3 · 31 min left", 30], ["lab", "The Quiet Engine", "2 h 3 min left", 12], ["sea", "Fieldnotes", "S1 · E8 · 12 min left", 74]];
  const NEXT = [["forest", "The Cartographers", "S3 · E1 · New season", 0, "52 min"], ["snow", "Harbor Lights", "S1 · E4 · Low Water", 0, "47 min"], ["desert", "Fieldnotes", "S2 · E1 · The Dry Year", 0, "38 min"], ["space", "Orbit Station", "S2 · E6 · Quiet Hours", 0, "55 min"]];
  const ADDED = [["snow", "Kite Season", "2024 · Movie", 0, "1 h 44"], ["city", "Signal Fires", "2025 · Movie", 0, "1 h 58"], ["sea", "The Ninth Bell", "2024 · Movie", 0, "2 h 15"], ["forest", "Winter Orchard", "2021 · Movie", 0, "1 h 46"]];

  /* ── Option A: a tidy library ───────────────────────────────────────── */
  const sideA = (on = "home") => `
    ${tiles([["cont", "clock", 4, "Continue", "blue"], ["next", "tv", 4, "Next up", "violet"], ["unw", "film", 27, "Unwatched", "amber"], ["queue", "queue", 5, "In the queue", "teal"]], "")}
    ${grp("Library", false, "", "accent")}
    ${navx("home", "Home", { active: on === "home" })}
    ${navx("film", "Movies", { active: on === "movies", cnt: 142 })}
    ${navx("tv", "TV shows", { cnt: 18 })}
    ${navx("listic", "All videos", { cnt: "1,204" })}
    ${navx("folder", "Folders")}
    ${grp("Playing", false, "", "green")}
    ${navx("playc", "Now playing", { active: on === "player" })}
    ${navx("queue", "Queue", { cnt: 5 })}
    ${grp("Playlists", false, icon("plus"), "amber")}
    ${navx("playlist", "Friday movie night", { cnt: 8 })}
    ${navx("playlist", "Comfort rewatches", { cnt: 14 })}
    ${navx("playlist", "Documentaries", { cnt: 6 })}
    <div class="foot">${icon("check-c", "ok")}<span>1,204 videos · 2,140 hours</span></div>`;

  const hero = () => `<div class="hero">${sc("space", "bg")}<div class="htext">
      <span class="kick">Continue watching</span>
      <h1>Orbit Station</h1>
      <div class="meta">Season 2 · Episode 5 · The Long Dark · 24 min left</div>
      <p>The relay goes quiet just as a storm crosses the station's orbit, and Ines has eleven minutes to decide who goes outside.</p>
      <div class="acts">${btn("Resume", "primary", "play")}${btn("Details", "", "info")}<span class="hprog">${prog(62)}</span></div>
    </div></div>`;

  const homeA = () => `<div class="mp-scroll">${hero()}${cardRow("Continue watching", CONT)}${cardRow("Next up", NEXT)}${cardRow("Recently added", ADDED)}</div>`;

  const pfoot = () => `<div class="status pfoot">
    <div class="pinfo">${sc("space", "mini")}<div class="tx"><b>Orbit Station</b><span>S2 · E5 · The Long Dark</span></div>${ib("x", "Close video")}</div>
    <div class="pmid"><div class="tr">${ib("prev", "Previous")}<button class="playb">${icon("pause")}</button>${ib("next", "Next")}</div>
      <div class="seek"><span>31:12</span><div class="track"><b style="width:56%"></b></div><span>55:40</span></div></div>
    <div class="pend">${ib("volume", "Mute (M)")}<span class="vtrack"><b style="width:68%"></b></span>${ib("expand", "Open the player")}</div>
  </div>`;

  const seekbar = (preview = true) => `<div class="oseek"><span class="t">31:12</span><div class="otrack"><b style="width:56%"></b>${[14, 33, 61, 82].map((x) => `<i style="left:${x}%"></i>`).join("")}<span class="knob" style="left:56%"></span>${preview ? `<div class="prev" style="left:71%">${sc("space", "pv")}<span>39:05 · Outside</span></div>` : ""}</div><span class="t">−24:28</span></div>`;

  // The player's controls: transport on the left, labelled track choices on the right.
  const osd = (o = {}) => `<div class="osd ${o.cls || ""}">
    ${seekbar(o.preview !== false)}
    <div class="ctl">
      <div class="l">${ib("prev", "Previous (Ctrl+←)")}${ib("rew", "Back 10 s (←)")}<button class="playb big">${icon("pause")}</button>${ib("ffw", "Forward 10 s (→)")}${ib("next", "Next (Ctrl+→)")}<span class="vol">${ib("volume", "Mute (M)")}<span class="vtrack"><b style="width:68%"></b></span></span></div>
      <div class="r">
        <button class="ochip ${o.subsOpen ? "on" : ""}">${icon("cc")}<span>English</span></button>
        <button class="ochip">${icon("volume")}<span>English 5.1</span></button>
        <button class="ochip">${icon("speed")}<span>1×</span></button>
        ${ib("listic", "Chapters (Page Up, Page Down)")}${ib("aspect", "Picture: shape, fill, turn")}${ib("expand", "Fullscreen (F)")}
      </div>
    </div></div>`;

  const subsPop = () => `<div class="opop" style="right:196px">
    <div class="oh">Subtitles</div>
    <div class="oi">${icon("check", "c0")}<span>Off</span></div>
    <div class="oi on">${icon("check", "c")}<span>English</span><span class="k">from the file</span></div>
    <div class="oi">${icon("check", "c0")}<span>English (SDH)</span></div>
    <div class="oi">${icon("check", "c0")}<span>Spanish</span></div>
    <div class="oi">${icon("folder", "c1")}<span>Load a subtitle file…</span></div>
    <div class="os"></div>
    <div class="orow"><span>Timing</span><button class="mini-b">Earlier</button><span class="v">0.0 s</span><button class="mini-b">Later</button></div>
    <div class="orow"><span>Size</span><span class="vtrack w"><b style="width:40%"></b></span><span class="v">100%</span></div>
    <div class="orow"><span>Dark background</span><span class="sp"></span>${sw(true)}</div>
  </div>`;

  const playerA = () => `<div class="stage">${sc("space", "bg")}
    <div class="otop"><b>Orbit Station</b><span>Season 2 · Episode 5 · The Long Dark · Ends at 10:42 PM</span></div>
    ${subsPop()}
    ${osd({ subsOpen: true, preview: false })}
  </div>`;

  /* ── Option B: a poster wall, tabs on top ──────────────────────────── */
  const tabsB = (on) => seg(["Home", "Movies", "TV shows", "All videos", "Playlists"], on);
  const nowPill = () => `<div class="nowpill">${sc("space", "nth")}<div class="tx"><b>Orbit Station</b><span>S2 · E5 · 24 min left</span></div>${ib("pause", "Pause (Space)")}</div>`;
  const hdrB = (on) => hdrNoSide({ center: tabsB(on), end: `${nowPill()}${ib("search", "Search (Ctrl F)")}${openBtn(false)}` });

  const poster = ([t, y, len, r, x], i, sel) => `<div class="poster ${sel ? "sel" : ""}"><div class="pa"${i >= 6 ? ` style="--hue:${(i * 47) % 300 + 30}deg"` : ""}>${sc(scOf(i + 3))}<span class="pt">${t}</span>${x.pct ? `<span class="pb"><b style="width:${x.pct}%"></b></span>` : ""}${x.seen ? `<span class="seen">${icon("check")}</span>` : ""}${x.isnew ? `<span class="nw">New</span>` : ""}</div><b>${t}</b><span>${y} · ★ ${r}</span></div>`;

  const detailsB = () => `<aside class="insp mdet">
    <div class="dh">${sc("dusk", "bd")}<div class="dt"><b>The Lantern Keeper</b><span>2021 · 2 h 4 min · ★ 7.8</span></div></div>
    <div class="ibody">
      <div class="dacts">${btn("Resume from 1:02:13", "primary", "play")}${ib("more", "More")}</div>
      <div class="dprog">${prog(48)}<span>1 h 1 min left</span></div>
      <div class="dsec2">${btn("Play from the start", "sm", "rew")}${btn("Add to queue", "sm", "queue")}</div>
      <p class="plot">A lighthouse keeper on a shrinking island takes in a stranger the night the lamp goes out, and the village starts to talk.</p>
      <div class="lab">File</div>
      <div class="card">
        <div class="row">${icon("folder")}<span class="k">Movies/The Lantern Keeper (2021)</span></div>
        <div class="row">${icon("film")}<span class="k">Picture</span><span class="v">4K · HDR · 24 fps</span></div>
        <div class="row">${icon("volume")}<span class="k">Sound</span><span class="v">English 5.1, Spanish</span></div>
        <div class="row">${icon("cc")}<span class="k">Subtitles</span><span class="v">English, French</span></div>
      </div>
      <div class="fix">${icon("search")} Wrong film? <b>Fix match…</b></div>
    </div></aside>`;

  const moviesB = () => `<div class="cols"><div class="main">
      <div class="btool">${seg(["All", "Unwatched", "Watched"], "All")}${dd("Recently added", "sort")}<span class="sp"></span><span class="cnt">142 movies · 27 unwatched</span></div>
      <div class="pgrid">${MOVIES.map((m, i) => poster(m, i, i === 0)).join("")}</div>
    </div>${detailsB()}</div>`;

  const EPS = [
    [1, "Dry Dock", "The crew returns to a station they barely recognise.", "54 min", { seen: true }],
    [2, "Second Shift", "Ines takes the night watch and hears something in the hull.", "51 min", { seen: true }],
    [3, "Low Orbit", "A supply run goes wrong and the relay is the only way home.", "56 min", { seen: true }],
    [4, "Ballast", "Theo argues for cutting the east ring loose.", "49 min", { seen: true }],
    [5, "The Long Dark", "The relay goes quiet just as a storm crosses the station's orbit.", "55 min", { pct: 56 }],
    [6, "Quiet Hours", "Eleven minutes of air, and four people who want to go outside.", "55 min", {}],
    [7, "Signal", "An old frequency answers back.", "52 min", {}],
  ];
  const showB = () => `<div class="mp-scroll show">
      <div class="sbanner">${sc("space", "bg")}<div class="stx">
        <span class="kick">TV show · 2024</span><h1>Orbit Station</h1>
        <div class="meta">2 seasons · 18 episodes · 3 left to watch</div>
        <div class="acts">${btn("Resume S2 · E5", "primary", "play")}${btn("Play season 2", "", "playlist")}${btn("Add to queue", "", "queue")}${ib("more", "Mark all watched, Fix match, Open folder")}</div>
      </div></div>
      <div class="eph">${seg(["Season 1", "Season 2", "Specials"], "Season 2")}<span class="sp"></span><span class="cnt">7 episodes · 4 watched</span></div>
      <div class="eps">${EPS.map(([n, t, p, d, x]) => `<div class="ep ${x.pct ? "cur" : ""}"><div class="eth">${sc(SCENES[(n + 5) % 8])}${x.pct ? `<span class="pb"><b style="width:${x.pct}%"></b></span>` : ""}</div><div class="etx"><b>${n} · ${t}</b><span>${p}</span></div><span class="ed">${d}</span>${x.seen ? `<span class="eseen">${icon("check-c")}</span>` : x.pct ? `<span class="eseen cur">${icon("playc")}</span>` : `<span class="eseen none"></span>`}</div>`).join("")}</div>
    </div>`;

  /* ── Option C: the player first ─────────────────────────────────────── */
  const hdrC = (o = {}) => hdrNoSide({ start: ib("listic", "Library and queue (Ctrl+B)", o.panel ? "on" : ""), center: search("Search movies, shows and episodes"), end: openBtn() });

  const upNextCard = () => `<div class="upnext">${sc("snow", "unth")}<div class="tx"><span class="k">Up next · in 12 s</span><b>S2 · E6 · Quiet Hours</b><div class="ub">${btn("Play now", "primary sm", "play")}${btn("Cancel", "sm")}</div></div></div>`;

  const stageC = (o = {}) => `<div class="stage">${sc("space", "bg")}
    <div class="otop"><b>Orbit Station</b><span>Season 2 · Episode 5 · The Long Dark · Ends at 10:42 PM</span></div>
    ${o.subs ? `<div class="subline up">Eleven minutes. Maybe less.</div>` : ""}
    ${o.upnext ? upNextCard() : ""}
    ${osd({ cls: o.narrow ? "narrow-osd" : "", preview: o.preview })}
  </div>`;

  const panelTabs = (on) => `<div class="ptabs">${seg(["Up next", "Chapters", "Sound", "Library"], on)}</div>`;

  const queueRows = () => `
    <div class="plab">Now playing</div>
    <div class="qrow now">${sc("space", "qth")}<div class="tx"><b>The Long Dark</b><span>Orbit Station · S2 · E5</span></div><span class="d">55:40</span></div>
    <div class="plab">Next · 4 videos · 3 h 31 min</div>
    ${[["snow", "Quiet Hours", "Orbit Station · S2 · E6", "55:12"], ["city", "Signal", "Orbit Station · S2 · E7", "52:30"], ["forest", "Harbor Lights", "S1 · E4 · Low Water", "47:05"], ["dusk", "The Lantern Keeper", "2021 · resume at 1:02:13", "2:04:10"]].map(([k, t, s, d]) => `<div class="qrow"><span class="grip">${icon("dots")}</span>${sc(k, "qth")}<div class="tx"><b>${t}</b><span>${s}</span></div><span class="d">${d}</span></div>`).join("")}
    <div class="pfoot2">${dd("Repeat: off", "repeat")}${ib("shuffle", "Shuffle")}<span class="sp"></span>${btn("Clear", "ghost sm")}</div>`;

  const soundPanel = () => `
    <div class="plab">Sound track</div>
    <div class="card radio">
      <div class="ro on"><span class="rd"></span><span>English 5.1</span><span class="k">Dolby Digital</span></div>
      <div class="ro"><span class="rd"></span><span>English stereo</span></div>
      <div class="ro"><span class="rd"></span><span>Director's commentary</span></div>
    </div>
    <div class="plab">Timing</div>
    <div class="card"><div class="ro2"><span>Sound delay</span><span class="sp"></span><button class="btn sm">Earlier</button><span class="v">−0.05 s</span><button class="btn sm">Later</button></div></div>
    <div class="plab">Loudness</div>
    <div class="card">
      <div class="ro2"><div class="tx"><span>Night mode</span><small>Evens out loud and quiet parts (N)</small></div><span class="sp"></span>${sw(true)}</div>
      <div class="ro2"><div class="tx"><span>Volume boost</span><small>Up to 150% for quiet videos</small></div><span class="sp"></span>${sw(false)}</div>
    </div>
    <div class="plab">Equalizer <span class="sp"></span>${sw(true)}</div>
    <div class="card eqc"><div class="ro2"><span>Preset</span><span class="sp"></span>${dd("Voice")}</div>
      <div class="eq">${[0.5, 0.42, 0.4, 0.48, 0.62, 0.7, 0.66, 0.55, 0.5, 0.46].map((v, i) => `<div class="fd"><span class="ft"><b style="bottom:${v * 100}%"></b></span><small>${["31", "62", "125", "250", "500", "1k", "2k", "4k", "8k", "16k"][i]}</small></div>`).join("")}</div>
      <div class="ro2 pre"><span>Preamp</span><span class="vtrack w"><b style="width:42%"></b></span><span class="v">−2 dB</span></div>
    </div>`;

  const libraryPanel = () => `
    <div class="field pfield">${icon("search")}<span class="ph">Search the library</span></div>
    <div class="plab">Continue watching</div>
    ${CONT.slice(0, 3).map(([k, t, s, p]) => `<div class="qrow">${sc(k, "qth", `<span class="pb"><b style="width:${p}%"></b></span>`)}<div class="tx"><b>${t}</b><span>${s}</span></div></div>`).join("")}
    <div class="plab">Browse</div>
    <div class="pnav">
      ${navx("film", "Movies", { cnt: 142 })}${navx("tv", "TV shows", { cnt: 18 })}${navx("listic", "All videos", { cnt: "1,204" })}${navx("folder", "Folders")}
      ${navx("playlist", "Playlists", { cnt: 3 })}
    </div>`;

  const panel = (tab, cls = "") => `<aside class="cpanel ${cls}">${panelTabs(tab)}<div class="pbody">${tab === "Up next" ? queueRows() : tab === "Sound" ? soundPanel() : libraryPanel()}</div></aside>`;

  /* ── New option: couch mode ─────────────────────────────────────────── */
  const tvMenu = (on, o = {}) => `<nav class="n1-menu ${o.rail ? "rail" : ""}">${[["search", "Search"], ["home", "Home"], ["film", "Movies"], ["tv", "TV shows"], ["listic", "All videos"], ["folder", "Folders"], ["playlist", "Playlists"], ["queue", "Queue", "4"]].map(([ic, t, n]) => `<div class="mi ${t === on ? "on" : ""}">${icon(ic)}<span>${t}</span>${n ? `<b>${n}</b>` : ""}</div>`).join("")}</nav>`;
  const tvCard = ([k, title, sub, pct, dur], focus) => `<div class="n1-card ${focus ? "focus" : ""}"><div class="th">${sc(k)}${pct ? `<span class="pb"><b style="width:${pct}%"></b></span>` : ""}${dur ? `<span class="dur">${dur}</span>` : ""}</div><b>${title}</b><span>${sub}</span></div>`;
  const tvKeys = (items) => `<div class="n1-keys">${items.map(([k, t]) => `<span>${k.split(" ").map((x) => `<kbd>${x}</kbd>`).join("")}${t}</span>`).join("")}</div>`;
  const homeN1 = (o = {}) => `<div class="n1-tv">${sc("space", "bg")}<div class="shade"></div>
      ${tvMenu("Home", { rail: o.narrow })}
      <div class="n1-info">
        <span class="kick">Continue watching</span>
        <h1>Orbit Station</h1>
        <div class="tags"><span>Season 2 · Episode 5</span><span>The Long Dark</span><span>24 min left</span><i class="q">4K</i><i class="q">HDR</i><i class="q">5.1</i></div>
        <p>The relay goes quiet just as a storm crosses the station's orbit, and Ines has eleven minutes to decide who goes outside.</p>
        <div class="acts">${btn("Resume", "primary", "play")}${btn("From the start", "", "rew")}${btn("Details", "", "info")}</div>
      </div>
      <div class="n1-shelf"><div class="sh">Continue watching <span>4</span></div><div class="row">${[["space", "Orbit Station", "S2 · E5 · 24 min left", 62], ...CONT].map((c, i) => tvCard(c, i === 0)).join("")}</div></div>
      <div class="n1-shelf nx"><div class="sh">Next up <span>4</span></div><div class="row">${NEXT.map((c) => tvCard(c)).join("")}</div></div>
      ${o.narrow ? "" : tvKeys([["← → ↑ ↓", "Move"], ["Enter", "Play"], ["I", "Details"], ["Q", "Add to queue"], ["Esc", "Back"]])}
    </div>`;

  const showN1 = () => `<div class="n1-tv show">${sc("space", "bg")}<div class="shade"></div>
      ${tvMenu("TV shows", { rail: true })}
      <div class="n1-info sh2">
        <span class="kick">TV show · 2024 · 2 seasons</span>
        <h1>Orbit Station</h1>
        <div class="acts">${btn("Resume S2 · E5", "primary", "play")}${btn("Play season 2", "", "playlist")}${btn("Add to queue", "", "queue")}${ib("more", "Mark all watched, Fix match, Open folder")}</div>
      </div>
      <div class="n1-seasons">${["Season 1", "Season 2", "Specials"].map((s) => `<span class="${s === "Season 2" ? "on" : ""}">${s}</span>`).join("")}<em>7 episodes · 4 watched</em></div>
      <div class="n1-eprow">${EPS.slice(2).map(([n, t, p, d, x]) => `<div class="n1-ep ${x.pct ? "focus" : ""}"><div class="th">${sc(SCENES[(n + 5) % 8])}${x.pct ? `<span class="pb"><b style="width:${x.pct}%"></b></span>` : ""}${x.seen ? `<span class="seen">${icon("check")}</span>` : ""}<span class="dur">${d}</span></div><b>${n} · ${t}</b>${x.pct ? `<p>${p}</p><div class="eacts">${btn("Resume at 31:12", "primary sm", "play")}${btn("Mark watched up to here", "sm", "check")}</div>` : `<span>${x.seen ? "Watched" : p}</span>`}</div>`).join("")}</div>
      ${tvKeys([["← →", "Episodes"], ["↑", "Seasons"], ["Enter", "Play"], ["W", "Mark watched"], ["Esc", "Back"]])}
    </div>`;

  /* ── New option: lists and folders ──────────────────────────────────── */
  const sideN2 = (on) => `
    ${grp("Library", true, "", "accent")}
    ${navx("home", "Home", { active: on === "home" })}
    ${navx("film", "Movies", { cnt: 142 })}
    ${navx("tv", "TV shows", { cnt: 18 })}
    ${navx("listic", "All videos", { active: on === "all", cnt: "1,204" })}
    ${grp("Folders", false, icon("plus"), "teal")}
    ${navx("folder", "Movies", { cnt: 142 })}
    ${navx("folder", "TV", { cnt: 486 })}
    ${navx("folder", "Home videos", { cnt: 311 })}
    ${navx("folder", "Downloads", { cnt: 265 })}
    ${grp("Playing", false, "", "green")}
    ${navx("playc", "Now playing", { sub: "Orbit Station" })}
    ${navx("queue", "Queue", { cnt: 4 })}
    ${grp("Playlists", false, icon("plus"), "amber")}
    ${navx("playlist", "Friday movie night", { cnt: 8 })}
    ${navx("playlist", "Comfort rewatches", { cnt: 14 })}
    ${navx("playlist", "Documentaries", { cnt: 6 })}`;
  const hdrN2 = (o = {}) => header({ icon: "film", name: "Media Player", center: search(o.narrow ? "Search" : "Search movies, shows and episodes"), end: `${ib("link", "Open a web address (Ctrl L)")}${openBtn(!o.narrow)}` });

  const vrow = ([k, title, sub, pct, right], o = {}) => `<div class="n2-vr ${o.sel ? "sel" : ""}"><div class="th">${sc(k)}${pct ? `<span class="pb"><b style="width:${pct}%"></b></span>` : ""}</div><div class="tx"><b>${title}</b><span>${sub}</span></div>${right || ""}</div>`;
  const left = (t) => `<span class="lft">${t}</span>`;
  const homeN2 = () => `<div class="n2-home">
      <div class="n2-colm">
        <div class="n2-sh">Continue watching<span class="sp"></span><span class="lnk">4</span></div>
        <div class="card n2-list">${[["space", "Orbit Station", "S2 · E5 · The Long Dark", 62, `${left("24 min left")}${btn("Resume", "primary sm", "play")}`], ["dusk", "The Lantern Keeper", "Movie · 2021", 48, `${left("1 h 4 min left")}${btn("Resume", "sm", "play")}`], ["city", "Harbor Lights", "S1 · E3 · Night Ferry", 30, `${left("31 min left")}${btn("Resume", "sm", "play")}`], ["lab", "The Quiet Engine", "Movie · 2020", 12, `${left("2 h 3 min left")}${btn("Resume", "sm", "play")}`]].map((r, i) => vrow(r, { sel: i === 0 })).join("")}</div>
        <div class="n2-sh">Next up<span class="sp"></span><span class="lnk">Shows you're following</span></div>
        <div class="card n2-list">${[["forest", "The Cartographers", "S3 · E1 · Into the Blank", 0, `${chip("New season", "acc")}${left("52 min")}`], ["snow", "Harbor Lights", "S1 · E4 · Low Water", 0, left("47 min")], ["desert", "Fieldnotes", "S2 · E1 · The Dry Year", 0, left("38 min")]].map((r) => vrow(r)).join("")}</div>
      </div>
      <div class="n2-colr">
        <div class="n2-sh">Recently added<span class="sp"></span><span class="lnk">See all</span></div>
        <div class="card n2-ra">${[["Kite Season", "Movie · 2024", "1 h 44 min", "Today"], ["Signal Fires", "Movie · 2025", "1 h 58 min", "Today"], ["Orbit Station", "S2 · E7 · Signal", "52 min", "Yesterday"], ["The Ninth Bell", "Movie · 2024", "2 h 15 min", "Mon"], ["Fieldnotes", "Season 2 · 8 episodes", "5 h 4 min", "Sun"], ["Winter Orchard", "Movie · 2021", "1 h 46 min", "Sat"], ["Beach day 2026", "Home videos · 14 clips", "38 min", "Sat"], ["Paper Moons", "Movie · 2018", "1 h 38 min", "Nov 2"]].map(([t, s, d, w]) => `<div class="ra"><div class="tx"><b>${t}</b><span>${s}</span></div><span class="d">${d}</span><span class="w">${w}</span></div>`).join("")}</div>
        <div class="n2-tip">${icon("folder")}<span>Drop videos, folders or M3U playlists here to play them; hold ${kbd("Shift")} to queue them.</span></div>
      </div>
    </div>`;

  const barN2 = (o = {}) => `<div class="status n2-bar">
      <div class="pinfo">${sc("space", "mini")}<div class="tx"><b>Orbit Station</b><span>S2 · E5 · The Long Dark</span></div></div>
      <div class="pmid"><div class="tr">${ib("rew", "Back 10 s")}<button class="playb">${icon("pause")}</button>${ib("ffw", "Forward 10 s")}${ib("next", "Next")}</div>
        <div class="seek"><span>31:12</span><div class="track"><b style="width:56%"></b></div><span>−24:28</span></div></div>
      <div class="pend">${o.narrow ? "" : `<span class="tchip">${icon("cc")}English</span><span class="tchip">${icon("volume")}English 5.1</span>`}${ib("eq", "Sound: track, delay, night mode, boost, equalizer")}${ib("volume", "Mute (M)")}${o.narrow ? "" : `<span class="vtrack"><b style="width:68%"></b></span>`}${ib("expand", "Open the player")}</div>
    </div>`;

  const VID = [
    ["space", "Orbit Station · S2 · E5 · The Long Dark", "Episode", "55:40", "2.1 GB", "Mar 4", 56],
    ["snow", "Orbit Station · S2 · E6 · Quiet Hours", "Episode", "55:12", "2.0 GB", "Mar 4", 0],
    ["dusk", "The Lantern Keeper", "Movie · 2021", "2:04:10", "14.2 GB", "Feb 18", 48],
    ["sea", "Saltwater Hymn", "Movie · 2023", "2:11:03", "9.8 GB", "Feb 2", 100],
    ["city", "Harbor Lights · S1 · E3 · Night Ferry", "Episode", "46:51", "1.4 GB", "Jan 30", 30],
    ["forest", "Northbound", "Movie · 2019", "1:52:20", "8.1 GB", "Jan 12", 0],
    ["desert", "Fieldnotes · S2 · E1 · The Dry Year", "Episode", "38:02", "980 MB", "Jan 9", 0],
    ["lab", "The Quiet Engine", "Movie · 2020", "2:20:44", "11.6 GB", "Dec 28", 12],
    ["sea", "Beach day 2026 · clip 03", "Home video", "2:14", "310 MB", "Dec 20", 0],
    ["snow", "Copper Valley", "Movie · 2016", "2:08:31", "7.4 GB", "Dec 2", 100],
    ["city", "Signal Fires", "Movie · 2025", "1:58:09", "12.0 GB", "Nov 30", 0],
  ];
  const wcell = (p) => p >= 100 ? `<span class="wd">${icon("check-c")}Watched</span>` : p ? `<span class="wp">${prog(p)}</span>` : `<span class="wn">Not yet</span>`;
  const videosN2 = () => `<div class="btool n2-tool">${seg(["All", "Movies", "Episodes", "Home videos"], "All")}<span class="n2-tog">${sw(false)}Only unwatched</span><span class="sp"></span><span class="cnt">1,204 videos · 2,140 hours</span>${dd("Date added", "sort")}</div>
    <div class="n2-tbl">${tbl([["Title"], ["Kind", "120px"], ["Length", "78px"], ["Size", "74px"], ["Added", "70px"], ["Watched", "110px"]], VID.map(([k, t, kind, len, size, added, p]) => [`${sc(k, "tth")}<b class="tt">${t}</b>`, kind, len, size, added, wcell(p)]), { sel: 2 })}</div>
    ${menu(330, 196, [["play", "Play", "Enter"], ["queue", "Play next"], ["plus", "Add to the queue", "Q"], ["playlist", "Add to a playlist", "", "sub"], "-", ["check-c", "Mark as watched", "W"], ["x", "Remove from Continue watching"], ["search", "Fix match…"], ["folder", "Show in its folder"]], 260).replace('<span>Add to a playlist</span>', `<span>Add to a playlist</span>${icon("chev-r", "chev")}`)}`;

  const foldersN2 = () => `<div class="n2-path">${["Videos", "TV", "Orbit Station"].map((p) => `<span class="pp">${p}</span>${icon("chev-r")}`).join("")}<b>Season 2</b><span class="sp"></span>${ib("play", "Play the folder")}${ib("sort", "Sort")}</div>
    <div class="n2-fl">${[["folder", "Extras", "6 videos"], ["folder", "Subtitles", "14 files"]].map(([ic, t, s]) => `<div class="n2-fr">${icon(ic, "fi")}<div class="tx"><b>${t}</b><span>${s}</span></div>${icon("chev-r", "cv")}</div>`).join("")}
      ${EPS.map(([n, t, p, d, x]) => `<div class="n2-fr v ${x.pct ? "sel" : ""}"><div class="th">${sc(SCENES[(n + 5) % 8])}${x.pct ? `<span class="pb"><b style="width:${x.pct}%"></b></span>` : ""}</div><div class="tx"><b>Orbit.Station.S02E0${n}.mkv</b><span>${n} · ${t} · ${d}</span></div>${x.seen ? icon("check-c", "ok") : x.pct ? icon("playc", "now") : ""}</div>`).join("")}
    </div>`;

  const ICONS = {
    playc: '<circle cx="12" cy="12" r="9"/><path d="M10 8.6v6.8l5.4-3.4z"/>',
    playlist: '<path d="M4 6h12M4 11h12M4 16h7"/><path d="M15 14v6l5-3z"/>',
    cc: '<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M10.6 10.3a2.2 2.2 0 1 0 0 3.4M17.1 10.3a2.2 2.2 0 1 0 0 3.4"/>',
    speed: '<path d="M4.5 17a8 8 0 1 1 15 0"/><path d="m12 13.5 3.6-4.2"/>',
    rew: '<path d="M11.5 6.5 4.5 12l7 5.5zM20 6.5 13 12l7 5.5z"/>',
    ffw: '<path d="m12.5 6.5 7 5.5-7 5.5zM4 6.5l7 5.5-7 5.5z"/>',
    aspect: '<rect x="3" y="5.5" width="18" height="13" rx="2"/><path d="M7 11V9h3M17 13v2h-3"/>',
  };

  REG("media-player", {
    name: "Media Player",
    summary: "Media Player has a lot in it (a library with posters, resume, queue, playlists, an equalizer and a good mpv player), but the sidebar barely groups it, the header and player are rows of bare icons, and sound settings are spread over three places.",
    problems: [
      "<b>A sidebar without sections:</b> Home, Movies, TV shows and All videos have no heading, Queue sits under Playlists, and Now playing isn't in the sidebar at all: you reach it only from the player bar or by playing something.",
      "<b>Folders is hidden:</b> it was a page and is now a toggle inside All videos, so the Folders link in the README and <tt>--section folders</tt> land somewhere that doesn't look like folders.",
      "<b>Four bare icons in the header:</b> Open a web address, Open videos, Equalizer and Settings look alike; opening a file, the thing most people come to do, has no label.",
      "<b>The player is a row of 14 icons:</b> previous, back, play, forward, next, mute, volume, chapters, picture, speed, sound, subtitles, fullscreen and close, all the same size. Which subtitles or sound track is on can't be seen without opening a menu.",
      "<b>Sound lives in three places:</b> the sound menu on the player (track, delay, night mode), Settings › Subtitles and sound (night mode again, boost) and the Equalizer card from the header.",
      "<b>Two close buttons with different jobs:</b> the player bar's × closes the video, right beside where the window's own close sits.",
      "<b>At 800 px</b> the Home banner keeps its text in the left half (about 330 px), so the title and plot wrap into a narrow column over an empty picture.",
      "<b>Each page repeats its name:</b> the header says “Media Player · Movies” and the page's toolbar says “Movies” again.",
    ],
    today: [],
    todayNote: "No screenshot: its test copy restored a play queue and opened a window outside the test screen, so it was stopped. The problems come from its code.",
    options: [
      { id: "a", name: "Poster wall", idea: "No sidebar: Home, Movies, TV shows, All videos and Playlists are tabs across the top, and the library gets the whole width. Movies is a wall of posters with a details panel beside it (resume, play from the start, add to queue, file and track info, Fix match). Shows open as a page with seasons and episodes. What's playing sits in the header as a small picture with pause; click it for the player. Suits a big library browsed like a streaming service.",
        shots: [
          ["b-movies","Movies","Posters, filters and a details panel"],
          ["b-show","A show","Seasons as tabs, episodes with progress"],
          ["b-movies-800","At 800 px","Four posters a row; details open as a page"],
        ] },
      { id: "b", name: "Player first", idea: "The video fills the window, and a panel beside it holds everything else in tabs: Up next (the queue, with repeat and shuffle), Chapters, Sound and Library. Sound brings the track, timing, night mode, boost and the equalizer together in one place, so the Equalizer card and the header icon go. Suits people who mostly open a file or a show and watch.",
        shots: [
          ["c-player","Watching, with Up next","The queue beside the video; the Up next card counting down"],
          ["c-sound","The Sound tab","Track, timing, night mode, boost and equalizer together"],
          ["c-player-800","At 800 px","The panel slides over the video, here on Library"],
        ] },
      { id: "c", name: "Couch mode", idea: "Made for watching from across the room. The whole window is the backdrop of whatever has focus, with its title, what's left and its picture and sound in big type, and the library below as shelves you move through with the arrow keys (or a remote, or a game pad): Continue watching, Next up, Recently added. The places (Search, Movies, TV shows, All videos, Folders, Playlists, Queue) are a menu down the left that folds to icons when you go into a show. A show's episodes are a row of large stills; the one in focus opens up with its plot, Resume and Mark watched up to here. Suits a TV or a projector more than a desk.",
        shots: [
          ["n1-home","Home","The focused show fills the window; shelves below"],
          ["n1-show","A show","Seasons, then episodes as a row; the focused one opens up"],
          ["n1-home-800","At 800 px","The menu folds to icons; the shelves keep their size"],
        ] },
      { id: "d", name: "Lists and folders", idea: "A library for people whose videos are files they've sorted themselves. The sidebar has headings: Library, Folders (as they are on disk, with + to add one), Playing (Now playing and the Queue) and Playlists. Home is lists rather than posters: Continue watching and Next up with their time left and Resume, and Recently added beside them. All videos is a sortable table with how far you've got in each, and the right-click menu has Play next, Add to the queue, Add to a playlist, Mark as watched, Fix match and Show in its folder. The player bar along the bottom says which subtitles and sound track are on, and its sound button opens everything about sound in one place. Suits big, file-based collections.",
        shots: [
          ["n2-home","Home","Lists with time left and Resume; Recently added beside"],
          ["n2-videos","All videos","A table you can sort, with its right-click menu open"],
          ["n2-folders-800","A folder at 800 px","The path across the top; files with progress"],
        ] },
    ],
    icons: ICONS,
    pages: {
      "a-home": () => win({ hdr: hdr(), side: sideA("home"), page: homeA(), over: pfoot() }),
      "a-player": () => `<div class="flushpage">${win({ hdr: hdr(), side: sideA("player"), page: playerA() })}</div>`,
      "b-movies": () => win({ hdr: hdrB("Movies"), side: "", page: moviesB() }),
      "b-show": () => win({ hdr: hdrB("TV shows"), side: "", page: showB() }),
      // At 800 px the panel lies over the video, here on its Library tab.
      "c-player": () => NARROW
        ? `<div class="flushpage">${win({ hdr: hdrC({ panel: true }), side: "", page: `<div class="cols over">${stageC({ narrow: true, preview: false })}${panel("Library", "float")}</div>` })}</div>`
        : `<div class="flushpage">${win({ hdr: hdrC({ panel: true }), side: "", page: `<div class="cols">${stageC({ upnext: true, subs: true, preview: false })}${panel("Up next")}</div>` })}</div>`,
      "n1-home": () => `<div class="flushpage">${win({ hdr: hdrNoSide({ center: search(NARROW ? "Search" : "Search movies, shows and episodes"), end: openBtn(!NARROW) }), side: "", page: homeN1({ narrow: NARROW }) })}</div>`,
      "n1-show": () => `<div class="flushpage">${win({ hdr: hdrNoSide({ start: `<button class="btn ghost n1-back">${icon("chev-l")}<span>TV shows</span></button>`, center: search("Search movies, shows and episodes"), end: openBtn() }), side: "", page: showN1() })}</div>`,
      "n2-home": () => win({ hdr: hdrN2(), side: sideN2("home"), page: homeN2(), over: barN2() }),
      "n2-videos": () => win({ hdr: hdrN2(), side: sideN2("all"), page: videosN2(), over: barN2() }),
      "n2-folders": () => win({ hdr: hdrN2({ narrow: true }), side: "", page: foldersN2(), over: barN2({ narrow: true }) }),
      "c-sound": () => `<div class="flushpage">${win({ hdr: hdrC({ panel: true }), side: "", page: `<div class="cols">${stageC({ preview: true })}${panel("Sound")}</div>` })}</div>`,
    },
  });
})();
