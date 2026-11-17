// Nyx Music multi-media revamp mockups. Loaded after ../polish/mock.js.
"use strict";
const Q = new URLSearchParams(location.search);
const ROOT = document.documentElement;
const SCREEN = ROOT.dataset.screen;
const SHOT = Q.get("shot") === "1";
const W800 = Q.get("w") === "800";

const EXTRA = {
  book: '<path d="M5 4.5A2.5 2.5 0 0 1 7.5 2H18v18H7.5A2.5 2.5 0 0 0 5 22.5z"/><path d="M8 6h7M8 10h7M8 14h5"/>',
  skipb: '<path d="M8 12 16 6.5v11z" fill="currentColor" stroke="none"/><rect x="5" y="6.5" width="2.2" height="11" rx=".8" fill="currentColor" stroke="none"/>',
  skipf: '<path d="M16 12 8 6.5v11z" fill="currentColor" stroke="none"/><rect x="16.8" y="6.5" width="2.2" height="11" rx=".8" fill="currentColor" stroke="none"/>',
};

const icon = (n, c = "") => `<i data-i="${n}"${c ? ` class="${c}"` : ""}></i>`;
const ib = (n, tip = "", c = "") => `<button class="ib ${c}"${tip ? ` title="${tip}"` : ""}>${icon(n)}</button>`;
const cover = (g, size, r = 7) =>
  `<div class="art ${g} cv" style="${size ? `width:${size}px;height:${size}px;` : ""}border-radius:${r}px"></div>`;
const slider = (p) => `<div class="slider"><div class="tr"><div class="fill" style="width:${p}%"></div></div></div>`;

const NOW = {
  t: "Project Hail Mary", a: "Andy Weir", n: "Ray Porter", g: "g12",
  pos: "4:12:08", dur: "16:10:00", p: 26, left: "11h 58m left", chapter: "Chapter 8 · Absolute Magnitude",
};
const BOOKS = [
  { t: "Project Hail Mary", a: "Andy Weir", n: "Ray Porter", g: "g12", p: 26, left: "11h 58m left", series: "", offline: true, dur: "16h 10m" },
  { t: "The Way of Kings", a: "Brandon Sanderson", n: "Michael Kramer", g: "g7", p: 62, left: "17h 4m left", series: "Stormlight · 1", offline: true, dur: "45h 30m" },
  { t: "Words of Radiance", a: "Brandon Sanderson", n: "Kate Reading", g: "g11", p: 12, left: "42h left", series: "Stormlight · 2", offline: false, dur: "48h 13m" },
  { t: "Dune", a: "Frank Herbert", n: "Scott Brick", g: "g9", p: 88, left: "2h 14m left", series: "Dune · 1", offline: false, dur: "21h 2m" },
  { t: "Circe", a: "Madeline Miller", n: "Perdita Weeks", g: "g3", p: 0, left: "12h 8m", series: "", offline: false, dur: "12h 8m" },
  { t: "The Name of the Wind", a: "Patrick Rothfuss", n: "Nick Podehl", g: "g1", p: 45, left: "15h 20m left", series: "Kingkiller · 1", offline: true, dur: "27h 55m" },
  { t: "Children of Time", a: "Adrian Tchaikovsky", n: "Mel Hudson", g: "g5", p: 0, left: "16h 31m", series: "Children of Time · 1", offline: false, dur: "16h 31m" },
  { t: "Piranesi", a: "Susanna Clarke", n: "Chiwetel Ejiofor", g: "g6", p: 100, left: "Completed", series: "", offline: false, dur: "9h 2m" },
  { t: "Klara and the Sun", a: "Kazuo Ishiguro", n: "Sura Siu", g: "g14", p: 0, left: "10h 25m", series: "", offline: false, dur: "10h 25m" },
  { t: "Leviathan Wakes", a: "James S. A. Corey", n: "Jefferson Mays", g: "g16", p: 33, left: "13h left", series: "The Expanse · 1", offline: false, dur: "20h 56m" },
  { t: "Mistborn: The Final Empire", a: "Brandon Sanderson", n: "Michael Kramer", g: "g13", p: 0, left: "24h 39m", series: "Mistborn · 1", offline: false, dur: "24h 39m" },
  { t: "The Midnight Library", a: "Matt Haig", n: "Carey Mulligan", g: "g4", p: 71, left: "2h 30m left", series: "", offline: false, dur: "8h 45m" },
];
const CONTINUE = [BOOKS[0], BOOKS[1], BOOKS[5], BOOKS[3]];
const RECENT = [BOOKS[2], BOOKS[8], BOOKS[6], BOOKS[9]];
const SERIES = [
  ["Stormlight Archive", "4 books", "g7"],
  ["The Expanse", "9 books", "g16"],
  ["Mistborn", "7 books", "g13"],
  ["Kingkiller Chronicle", "2 books", "g1"],
];
const CHAPTERS = [
  ["0:00", "Chapter 1 · Stratt"],
  ["1:02:14", "Chapter 2 · Amigo"],
  ["2:18:40", "Chapter 3 · Hail Mary"],
  ["3:41:05", "Chapter 4 · Scientific Method"],
  ["4:12:08", "Chapter 8 · Absolute Magnitude"],
  ["5:55:22", "Chapter 9 · Eridian"],
];
const ALBUMS = [
  ["g7", "Hurry Up, We're Dreaming", "M83"],
  ["g12", "Random Access Memories", "Daft Punk"],
  ["g1", "In Rainbows", "Radiohead"],
  ["g5", "Immunity", "Jon Hopkins"],
  ["g9", "Music Has the Right…", "Boards of Canada"],
  ["g3", "Blonde", "Frank Ocean"],
];
const QUEUE = [
  ["Instant Crush", "Daft Punk", "5:37"],
  ["Get Lucky", "Daft Punk", "6:09"],
  ["Doin' It Right", "Daft Punk", "4:11"],
  ["Fragments of Time", "Daft Punk", "4:39"],
];

function header(sub, o = {}) {
  const ph = o.placeholder || "Search";
  return `<header class="hdr">
    <div class="hdr-id">${icon("music", "app-ic")}<span class="app-name">Music</span>${sub ? `<span class="app-sub"><span class="sep">/</span>${sub}</span>` : ""}</div>
    <div class="hdr-start"></div>
    <div class="hdr-center">${o.center ?? ""}</div>
    <div class="hdr-end">
      ${o.search !== false ? `<div class="search"${o.q ? ' style="color:var(--text)"' : ""}>${icon("search")}<span>${o.q || ph}</span><span class="key">Ctrl F</span></div>` : ""}
      ${ib("eq", "Equalizer")}${ib("sliders", "Settings")}
    </div>
  </header>`;
}

/** Media types as peers. Music browsing (songs/albums/…) lives inside Music, not the rail. */
function sidebar(active = "audiobooks") {
  const n = (k, label, i, extra = "") =>
    `<a class="nav ${k === active ? "active" : ""}" title="${label}">${icon(i)}<span>${label}</span>${extra}</a>`;
  return `<aside class="side"><div class="side-scroll">
    ${n("home", "Home", "home")}
    ${n("now-playing", "Now playing", "eq")}
    <div class="grp first">Listen</div>
    ${n("music", "Music", "disc", `<em class="cnt">386</em>`)}
    ${n("audiobooks", "Audiobooks", "book")}
    ${n("podcasts", "Podcasts", "podcast", `<em class="badge">3</em>`)}
    ${n("radio", "Radio", "radio")}
    <div class="grp">Library</div>
    ${n("downloads", "Downloads", "download")}
    ${n("queue", "Up next", "queue")}
    ${n("playlists", "Playlists", "list", `<em class="cnt">4</em>`)}
  </div></aside>`;
}

/** Same 3-column bar as Music (np | transport+seek | right). Spoken only swaps icons. */
function pbar(mode = "spoken") {
  if (mode === "music") {
    return `<footer class="pbar music">
      <div class="np">${cover("g12", 40, 6)}<div class="meta"><div class="t">Instant Crush</div><div class="a">Daft Punk · Random Access Memories</div></div></div>
      <div class="transport">
        <div class="tbtns">
          ${ib("shuffle", "Shuffle", "wide")}${ib("prev", "Previous", "big")}
          <button class="play" title="Pause">${icon("pause")}</button>
          ${ib("next", "Next", "big")}${ib("repeat", "Repeat", "wide on")}
        </div>
        <div class="seek"><span class="tm">2:14</span>${slider(40)}<span class="tm">5:37</span></div>
      </div>
      <div class="pright">
        ${ib("lyrics", "Lyrics", "wide")}${ib("queue", "Up next", "wide")}${ib("eq", "Equalizer")}${ib("clock", "Sleep timer")}
        ${ib("volume", "Mute")}${slider(70)}
      </div>
    </footer>`;
  }
  return `<footer class="pbar spoken">
    <div class="np">${cover(NOW.g, 40, 6)}<div class="meta"><div class="t">${NOW.t}</div><div class="a">${NOW.a} · ${NOW.n}</div></div></div>
    <div class="transport">
      <div class="tbtns">
        ${ib("skipb", "Skip backward", "wide")}${ib("prev", "Previous chapter", "big")}
        <button class="play" title="Pause">${icon("pause")}</button>
        ${ib("next", "Next chapter", "big")}${ib("skipf", "Skip forward", "wide")}
      </div>
      <div class="seek"><span class="tm">${NOW.pos}</span>${slider(NOW.p)}<span class="tm">${NOW.dur}</span></div>
    </div>
    <div class="pright">
      ${ib("bookmark", "Bookmark", "wide")}${ib("book", "Book details", "wide")}${ib("eq", "Equalizer")}${ib("clock", "Sleep timer")}
      ${ib("volume", "Mute")}${slider(70)}
    </div>
  </footer>`;
}

function win({ hdr, side, page, foot, cls = "" }) {
  return `<div class="win ${cls}">${hdr}${side}<main class="page">${page}</main>${foot}</div>`;
}
function mount(html) { document.body.innerHTML = html; }

const chips = (list, on = 0) =>
  `<div class="chips">${list.map((c, i) => `<span class="chip ${i === on ? "on" : ""}">${c}</span>`).join("")}</div>`;
const shead = (t, s = "", act = "", c = "") =>
  `<div class="shead ${c}"><span class="t">${t}</span>${s ? `<span class="s">${s}</span>` : ""}<span class="act">${act}</span></div>`;
const more = (l = "All") => `<button class="btn ghost">${l}</button>`;

function bookTile(b, o = {}) {
  const ring = b.p > 0 && b.p < 100 ? `<span class="prog-ring" style="--p:${b.p}"></span>` : "";
  const off = b.offline ? `<span class="offline-dot" title="Downloaded">${icon("download")}</span>` : "";
  const bar = b.p > 0 && b.p < 100 && o.bar ? `<div class="pbar-mini"><b style="width:${b.p}%"></b></div>` : "";
  return `<div class="book ${o.hover ? "hover" : ""} ${o.playing ? "playing" : ""}">
    <div class="art ${b.g} cv">${off}${ring}<span class="hplay">${icon("play")}</span></div>
    <div class="nm">${b.t}</div><div class="ar">${b.series || b.a}</div>${bar}</div>`;
}
const grid = (items, cols = 5, o = {}) =>
  `<div class="agrid" style="--cols:${cols}">${items.map((b, i) => bookTile(b, { bar: true, ...(o.each ? o.each(i, b) : {}) })).join("")}</div>`;
const shelf = (items, cw = 148) => `<div class="shelf" style="--cw:${cw}px">${items.join("")}</div>`;
function contCard(b) {
  return `<div class="cont-card">
    <div class="art ${b.g} cv" style="width:72px;height:72px;border-radius:7px;position:relative"><span class="prog-ring" style="--p:${b.p}"></span></div>
    <div class="meta"><div class="nm">${b.t}</div><div class="ar">${b.a}</div><div class="left">${b.left}</div></div>
    <button class="play-ib">${icon("play")}</button>
  </div>`;
}
function brow(b) {
  return `<div class="brow">
    <div class="art ${b.g} cv" style="width:56px;height:56px;border-radius:7px"></div>
    <div class="tt">
      <div class="nm">${b.t}</div>
      <div class="ar">${[b.a, b.series].filter(Boolean).join(" · ")}</div>
      <div class="meta-row">
        ${b.p > 0 && b.p < 100 ? `<div class="pbar-mini"><b style="width:${b.p}%"></b></div><span class="left">${b.left}</span>` : `<span class="left">${b.left}</span>`}
        ${b.offline ? `<span class="marks">${icon("download")}</span>` : ""}
      </div>
    </div>
    <button class="play-ib">${icon("play")}</button>
  </div>`;
}
function emptyState(title, desc, primary, secondary) {
  return `<div class="empty">${icon("book")}<div class="et">${title}</div><div class="ed">${desc}</div>
    <div class="acts">${primary ? `<button class="btn primary">${primary}</button>` : ""}${secondary ? `<button class="btn">${secondary}</button>` : ""}</div></div>`;
}
function libToolbar(o = {}) {
  return `<div class="ptool">
    <span class="dd">Fiction${icon("chev-d")}</span>
    ${o.chips ? chips(o.chips, o.on ?? 0) : ""}
    <span class="grow"></span>
    <div class="search" style="width:200px">${icon("search")}<span>${o.q || "Search this library"}</span></div>
    ${ib("more", "More")}
  </div>`;
}

function pageToday() {
  return `<div class="ptool"><span class="dd">Fiction${icon("chev-d")}</span><span class="dd">All${icon("chev-d")}</span></div>
    <div class="main">
      <div class="search" style="width:100%;margin-bottom:8px">${icon("search")}<span>Search this library</span></div>
      <div class="status-line">12 items</div>
      <div class="today-list">${BOOKS.map((b) => {
        const pr = b.p > 0 && b.p < 100 ? `${Math.round(b.p * 0.16)}h listened · ${b.left.replace(" left", "")} left` : b.p === 100 ? "Completed" : b.dur;
        return `<div class="today-row">${cover(b.g, 56, 6)}<div class="tt"><div class="nm">${b.t}</div><div class="ar">${[b.a, b.series].filter(Boolean).join(" · ")}</div><div class="pr">${pr}</div></div>${ib("play")}</div>`;
      }).join("")}</div>
    </div>`;
}

function pageA(o = {}) {
  const filters = ["All", "Recently added", "In progress", "Completed", "Series", "Genres", "Collections"];
  return `${libToolbar({ chips: filters, on: o.filterOn ?? 0, q: o.q })}
    <div class="main ${W800 ? "narrow" : ""}">
      ${o.banner || ""}
      ${o.hideContinue ? "" : `${shead("Continue listening", "", more("See all"), "first")}<div class="cont-strip">${CONTINUE.map(contCard).join("")}</div>`}
      ${o.seriesMode ? `${shead("Series", "4 series", "", o.hideContinue ? "first" : "")}
        <div class="agrid" style="--cols:4">${SERIES.map(([n, c, g]) =>
          `<div class="book"><div class="art ${g} cv"></div><div class="nm">${n}</div><div class="ar">${c}</div></div>`).join("")}</div>` : ""}
      ${o.searchMode ? `${shead(`Results for “${o.q}”`, "3 books", "", "first")}${grid([BOOKS[0], BOOKS[11], BOOKS[5]], 5)}`
        : o.empty ? emptyState("No audiobooks yet", "Books from your selected libraries will show up here.", "", "")
        : o.seriesMode ? "" : `${shead(o.sectionTitle || "Library", "12 books", more("Show more"), o.hideContinue ? "first" : "")}
      ${grid(o.books || BOOKS, W800 ? 3 : 5, { each: (i) => ({ hover: i === 1, playing: i === 0 }) })}`}
    </div>`;
}

function pageB() {
  return `<div class="ptool"><span class="dd">Fiction${icon("chev-d")}</span><span class="grow"></span>
      <div class="search" style="width:200px">${icon("search")}<span>Search this library</span></div>
      <span class="chip">Browse all</span></div>
    <div class="main">
      ${shead("Continue listening", "", more(), "first")}
      ${shelf(CONTINUE.map((b) => bookTile(b, { hover: b === CONTINUE[0] })), 148)}
      ${shead("Recently added", "", more())}
      ${shelf(RECENT.map((b) => bookTile(b)), 148)}
      ${shead("In progress", "", more())}
      ${shelf([BOOKS[3], BOOKS[5], BOOKS[9], BOOKS[11]].map((b) => bookTile(b, { bar: true })), 148)}
      ${shead("Stormlight Archive", "Series · 4 books", more())}
      ${shelf([BOOKS[1], BOOKS[2]].map((b) => bookTile(b)), 148)}
      ${shead("The Expanse", "Series · 9 books", more())}
      ${shelf([BOOKS[9]].map((b) => bookTile(b)), 148)}
    </div>`;
}

function pageC() {
  return `<div class="ptool">${chips(["All", "Recently added", "In progress", "Completed"], 0)}
      <span class="grow"></span>
      <div class="search" style="width:200px">${icon("search")}<span>Search this library</span></div></div>
    <div class="split">
      <aside class="facet">
        <div class="lab first">Library</div><a class="on">Fiction</a><a>Nonfiction</a>
        <div class="lab">Series</div>${SERIES.map(([n]) => `<a>${n}</a>`).join("")}
        <div class="lab">Genres</div><a>Science Fiction</a><a>Fantasy</a><a>Literary</a>
        <div class="lab">Collections</div><a>Staff picks</a><a>Finished 2026</a>
      </aside>
      <div class="main">${shead("Fiction", "12 books", "", "first")}${BOOKS.map(brow).join("")}</div>
    </div>`;
}

function pageDetail(conflict = false) {
  const b = BOOKS[0];
  return `<div class="detail">
    <div class="detail-back">${icon("chev-l")} Library</div>
    <div class="detail-hero">
      ${cover(b.g, 168, 10)}
      <div class="body">
        <div class="title">${b.t}</div>
        <div class="by">${b.a}</div>
        <div class="by dim">Narrated by ${b.n}</div>
        <div class="tags"><span class="tag">Science Fiction</span><span class="tag">2021</span><span class="tag">Downloaded</span></div>
        <div class="detail-prog">
          <div class="times"><span>${NOW.pos}</span><span>${b.left}</span></div>
          <div class="pbar-mini"><b style="width:${b.p}%"></b></div>
        </div>
        <div class="detail-acts">
          <button class="btn primary">${icon("play")} Resume</button>
          <button class="btn">${icon("check")} Mark completed</button>
          <button class="btn">${icon("download")} Downloaded</button>
        </div>
        ${conflict ? `<div class="conflict"><b>Listening position differs</b>
          <p>This device is at 4:12:08. The server has 6:48:22 from another device. Choose which position to keep.</p>
          <div class="acts"><button class="btn primary">Use this device</button><button class="btn">Use server</button></div></div>` : ""}
      </div>
    </div>
    <p class="detail-desc">Ryland Grace is the sole survivor on a desperate, last-chance mission—and if he fails, humanity and the Earth itself will perish. Except that right now, he doesn’t know that. He can’t even remember his own name, let alone the nature of his assignment or how to complete it.</p>
    <div class="detail-meta">
      <span class="k">Publisher</span><span>Audible Studios</span>
      <span class="k">Language</span><span>English</span>
      <span class="k">ISBN</span><span>9780593135204</span>
    </div>
    <div class="chapters">${shead("Chapters", "18", "", "first")}
      ${CHAPTERS.map(([tm, nm], i) => `<div class="ch ${i === 4 ? "on" : ""}"><span class="tm">${tm}</span><span class="nm">${nm}</span></div>`).join("")}
    </div>
    <div class="chapters">${shead("Bookmarks", "2")}
      <div class="ch"><span class="tm">2:18:40</span><span class="nm">Astrophage notes</span></div>
      <div class="ch"><span class="tm">4:12:08</span><span class="nm">Current place</span></div>
    </div>
  </div>`;
}

/** Same Now playing page Music already uses; audiobook mode swaps the right column. */
function pageNowPlaying(mode = "spoken") {
  if (mode === "music") {
    const bars = [40, 70, 95, 55, 80, 35, 88, 60, 45, 75, 50, 90, 30, 65, 85, 42, 78, 58, 92, 48];
    return `<div class="now">
      <div class="now-left">
        ${cover("g12", 280, 12)}
        <div class="title">Instant Crush</div>
        <div class="by acc">Daft Punk</div>
        <div class="by">Random Access Memories</div>
        <div class="meta">FLAC · 24-bit · 2013</div>
      </div>
      <div class="now-right">
        <div class="now-panel">
          <div class="seg"><button class="on">Spectrum</button><button>Lyrics</button></div>
          <div class="spec-mock">${bars.map((h) => `<span style="height:${h}%"></span>`).join("")}</div>
        </div>
        <div class="grp">Up next</div>
        <div class="now-list">${QUEUE.map(([t, a, d], i) =>
          `<div class="song ${i === 0 ? "on" : ""}"><span class="n">${i + 1}</span><span class="nm">${t}</span><span class="d">${d}</span></div>`
        ).join("")}</div>
      </div>
    </div>`;
  }
  return `<div class="now">
    <div class="now-left">
      ${cover(NOW.g, 280, 12)}
      <div class="title">${NOW.t}</div>
      <div class="by acc">${NOW.a}</div>
      <div class="by">Narrated by ${NOW.n}</div>
      <div class="meta">${NOW.chapter} · ${NOW.left}</div>
      <div class="now-acts">
        <button class="btn primary">${icon("play")} Resume</button>
        <button class="btn">${icon("info")} Details</button>
      </div>
    </div>
    <div class="now-right">
      <div class="now-panel" style="flex:none">
        <div class="seg"><button class="on">Chapters</button><button>Bookmarks</button></div>
        <div class="detail-prog" style="margin:8px 0 4px;max-width:none">
          <div class="times"><span>${NOW.pos}</span><span>${NOW.dur}</span></div>
          <div class="pbar-mini" style="height:4px"><b style="width:${NOW.p}%"></b></div>
        </div>
        <div style="display:flex;gap:8px;align-items:center;margin-top:4px">
          <span class="dim xs">Speed</span><button class="speed-chip" style="margin:0">1.25×</button>
          <span class="grow"></span>
          <button class="btn">${icon("bookmark")} Add bookmark</button>
        </div>
      </div>
      <div class="grp">Chapters</div>
      <div class="now-list chapters">${CHAPTERS.map(([tm, nm], i) =>
        `<div class="ch ${i === 4 ? "on" : ""}"><span class="tm">${tm}</span><span class="nm">${nm}</span></div>`
      ).join("")}</div>
    </div>
  </div>`;
}

function pageHome() {
  return `<div class="main">
    ${shead("Continue listening", "", more("Audiobooks"), "first")}
    <div class="cont-strip">${CONTINUE.slice(0, 3).map(contCard).join("")}</div>
    ${shead("Jump back in", "", more("Music"))}
    <div class="agrid" style="--cols:6">${ALBUMS.map(([g, n, a]) =>
      `<div class="book"><div class="art ${g} cv"></div><div class="nm">${n}</div><div class="ar">${a}</div></div>`
    ).join("")}</div>
    ${shead("New episodes", "", more("Podcasts"))}
    ${[["g3", "The World’s Most Expensive IV", "Reply All · 28 min left", 55],
       ["g5", "Ep 154: The Big Hack", "Darknet Diaries · New", 0],
       ["g8", "The Room of Requirement", "99% Invisible · 12 min left", 70]].map(([g, t, a, p]) =>
      `<div class="ep-row">${cover(g, 44, 6)}<div class="tt"><div class="nm">${t}</div><div class="ar">${a}</div>
        ${p ? `<div class="pbar-mini" style="margin-top:6px;max-width:160px"><b style="width:${p}%"></b></div>` : ""}</div>
        <button class="play-ib">${icon("play")}</button></div>`
    ).join("")}
    ${shead("Your stations", "", more("Radio"))}
    <div class="cont-strip">
      ${[["SomaFM Groove Salad", "Chillout"], ["Radio Paradise", "Eclectic"], ["NTS Radio", "London"]].map(([n, a]) =>
        `<div class="station"><span class="dot"></span><div><div class="nm">${n}</div><div class="ar">${a}</div></div></div>`
      ).join("")}
    </div>
  </div>`;
}

function pageMusic() {
  return `<div class="ptool">${chips(["Albums", "Songs", "Artists", "Genres", "Folders", "Recent"], 0)}
      <span class="grow"></span><span class="dd">By artist${icon("chev-d")}</span>
      <div class="seg icons"><button class="on">${icon("grid")}</button><button>${icon("list")}</button></div></div>
    <div class="main">
      <div class="agrid" style="--cols:5">${ALBUMS.concat([["g16","Selected Ambient…","Aphex Twin"],["g14","Dummy","Portishead"],["g10","Discovery","Daft Punk"],["g4","Endtroducing.....","DJ Shadow"]]).map(([g, n, a], i) =>
        `<div class="book ${i === 1 ? "playing" : ""}"><div class="art ${g} cv"></div><div class="nm">${n}</div><div class="ar">${a}</div></div>`
      ).join("")}</div>
    </div>`;
}

function pageDownloads() {
  return `<div class="ptool"><span class="title">Downloads</span><span class="grow"></span><span class="dim xs">1.8 GiB</span></div>
    <div class="main"><div class="dl-list">
      <div class="dl-row">${cover("g12", 48, 6)}<div class="tt"><div class="nm">Project Hail Mary</div><div class="st">Audiobook · Complete · 842 MiB</div></div>
        <div class="acts"><button class="btn">Play offline</button><button class="btn">Remove</button></div></div>
      <div class="dl-row">${cover("g7", 48, 6)}<div class="tt"><div class="nm">The Way of Kings</div><div class="st">Audiobook · Downloading · 1.1 / 2.4 GiB</div>
        <div class="pbar-mini"><b style="width:46%"></b></div></div>
        <div class="acts"><button class="btn">Pause</button><button class="btn">Cancel</button></div></div>
      <div class="dl-row">${cover("g3", 48, 6)}<div class="tt"><div class="nm">Reply All · #168</div><div class="st">Podcast · Complete</div></div>
        <div class="acts"><button class="btn">Play</button><button class="btn">Remove</button></div></div>
    </div></div>`;
}

function pageSettings() {
  return `<div class="settings-page">
    <div class="settings-intro">Connect your Audiobookshelf server to browse books and keep your place across devices.</div>
    <div class="abs-card"><div class="head">${icon("server")}<span class="ct">Connection</span></div>
      <div class="t500">Ken · abs.home.arpa</div>
      <div class="dim" style="margin:4px 0 12px">https://abs.home.arpa · Connected</div>
      <div style="display:flex;gap:8px"><button class="btn">Disconnect</button><button class="btn">Edit</button></div></div>
    <div class="abs-card"><div class="head">${icon("book")}<span class="ct">Libraries</span></div>
      <div class="desc">Choose the audiobook libraries you want to browse.</div>
      <div class="lib-pick">
        <label class="on"><span class="box"></span><span class="grow">Fiction</span><span class="dim xs">142 books</span></label>
        <label class="on"><span class="box"></span><span class="grow">Nonfiction</span><span class="dim xs">38 books</span></label>
        <label><span class="box"></span><span class="grow">Kids</span><span class="dim xs">12 books</span></label>
      </div></div>
    <div class="abs-card"><div class="head">${icon("clock")}<span class="ct">Playback</span></div>
      <div class="desc">Defaults for audiobooks. Music playback settings stay separate.</div>
      <div class="opt-row"><div><div class="ol">Default speed</div></div><span class="spin">1.25×</span></div>
      <div class="opt-row"><div><div class="ol">Skip backward</div></div><span class="spin">15 s</span></div>
      <div class="opt-row"><div><div class="ol">Skip forward</div></div><span class="spin">30 s</span></div>
      <div class="opt-row"><div><div class="ol">Default sleep timer</div><div class="od">Off</div></div><span class="spin">Off</span></div></div>
    <div class="abs-card"><div class="head">${icon("refresh")}<span class="ct">Synchronization</span></div>
      <div class="opt-row"><div><div class="ol">Sync listening progress</div><div class="od">Upload every 15 seconds while playing</div></div><span class="chip on">On</span></div></div>
    <div class="abs-card"><div class="head">${icon("download")}<span class="ct">Downloads</span></div>
      <div class="desc">~/.local/share/nyx-music/audiobookshelf</div>
      <button class="btn">Open downloads</button></div>
  </div>`;
}

function pageSettingsSignIn() {
  return `<div class="settings-page">
    <div class="settings-intro">Connect your Audiobookshelf server to browse books and keep your place across devices.</div>
    <div class="abs-card"><div class="head">${icon("server")}<span class="ct">Connection</span></div>
      <div class="field"><label>Server address</label><div class="inp">https://abs.home.arpa</div><div class="hint">Use the address you open in your browser.</div></div>
      <div class="field"><label>Username</label><div class="inp">ken</div></div>
      <div class="field"><label>Password</label><div class="inp">••••••••••</div></div>
      <button class="btn primary">Sign in</button></div>
  </div>`;
}

function pagePodcasts() {
  return `<div class="ptool"><span class="title">Podcasts</span><span class="grow"></span>
      <div class="search" style="width:200px">${icon("search")}<span>Find a podcast</span></div></div>
    <div class="main">
      ${shead("Following", "", more(), "first")}
      <div class="agrid" style="--cols:5">${[["g3","Reply All","Gimlet"],["g5","Darknet Diaries","Jack Rhysider"],["g8","99% Invisible","Roman Mars"]].map(([g,n,a]) =>
        `<div class="book"><div class="art ${g} cv"></div><div class="nm">${n}</div><div class="ar">${a}</div></div>`).join("")}</div>
      <div class="pod-abs">${shead("Audiobookshelf")}
        <div class="note">Shows from your podcast libraries on abs.home.arpa</div>
        <div class="agrid" style="--cols:5">${[["g14","The Daily","NYT"],["g6","Hardcore History","Dan Carlin"],["g2","Radiolab","WNYC"]].map(([g,n,a]) =>
          `<div class="book"><div class="art ${g} cv"></div><div class="nm">${n}</div><div class="ar">${a}</div></div>`).join("")}</div>
      </div>
    </div>`;
}

function pageRadio() {
  const popular = [
    ["SomaFM Groove Salad", "Chillout · United States · 96k"],
    ["Radio Paradise", "Eclectic · United States · 128k"],
    ["NTS Radio", "Electronic · United Kingdom · 128k"],
    ["Jazz24", "Jazz · United States · 128k"],
    ["FIP", "Eclectic · France · 192k"],
    ["BBC Radio 6 Music", "Alternative · United Kingdom · 128k"],
  ];
  return `<div class="ptool">
      <div class="seg"><button class="on">Popular</button><button>Genres</button><button>Countries</button></div>
      <span class="grow"></span>
      <div class="search" style="width:220px">${icon("search")}<span>Search stations</span></div>
    </div>
    <div class="main">
      ${shead("Your stations", "", "", "first")}
      <div class="cont-strip" style="flex-wrap:wrap;margin-bottom:8px">
        ${[["SomaFM Groove Salad", "Chillout · On air"], ["Radio Paradise", "Eclectic · On air"], ["NTS Radio", "London · On air"]].map(([n, a]) =>
          `<div class="station" style="min-width:240px"><span class="dot"></span><div class="grow"><div class="nm">${n}</div><div class="ar">${a}</div></div><button class="play-ib">${icon("play")}</button></div>`
        ).join("")}
      </div>
      ${shead("Popular", "Radio Browser")}
      <div class="dl-list">${popular.map(([n, a], i) => `
        <div class="dl-row">
          <div class="art ${["g5","g12","g7","g3","g9","g1"][i]} cv" style="width:44px;height:44px;border-radius:6px"></div>
          <div class="tt"><div class="nm">${n}</div><div class="st">${a}</div></div>
          <button class="play-ib">${icon("play")}</button>
        </div>`).join("")}
      </div>
    </div>`;
}

function render() {
  const musicPlaying = ["music", "now-playing-music"].includes(SCREEN);
  const foot = pbar(musicPlaying ? "music" : "spoken");
  const sideFor = (s) => {
    if (s === "home") return "home";
    if (s.startsWith("now-playing")) return "now-playing";
    if (s === "music" || s === "player-music") return "music";
    if (s === "downloads") return "downloads";
    if (s === "podcasts-abs" || s === "podcasts") return "podcasts";
    if (s === "radio") return "radio";
    if (s.startsWith("settings")) return "audiobooks";
    return "audiobooks";
  };

  const pages = {
    today: () => ({ sub: "Audiobooks", page: pageToday() }),
    a: () => ({ sub: "Audiobooks", page: pageA() }),
    b: () => ({ sub: "Audiobooks", page: pageB() }),
    c: () => ({ sub: "Audiobooks", page: pageC() }),
    search: () => ({ sub: "Audiobooks", page: pageA({ q: "hail", searchMode: true, hideContinue: true }) }),
    series: () => ({ sub: "Audiobooks", page: pageA({ filterOn: 4, seriesMode: true, hideContinue: true }) }),
    offline: () => ({
      sub: "Audiobooks",
      page: pageA({
        banner: `<div class="banner">${icon("cloud")}<div class="msg"><b>Server unavailable</b><span>Showing downloaded books. Progress will sync when you’re back online.</span></div><button class="btn">Retry</button></div>`,
        books: BOOKS.filter((b) => b.offline),
        sectionTitle: "Downloaded",
      }),
    }),
    empty: () => ({ sub: "Audiobooks", page: pageA({ empty: true, hideContinue: true }) }),
    setup: () => ({
      sub: "Audiobooks",
      page: emptyState("Audiobooks", "Connect your Audiobookshelf server to browse books, resume listening, and save books for offline playback.", "Connect Audiobookshelf", "Open downloads"),
    }),
    signin: () => ({
      sub: "Audiobooks",
      page: emptyState("Sign in to continue", "Reconnect your account to browse your libraries. Your downloads and listening progress are kept.", "Sign in", "Open downloads"),
    }),
    "choose-libs": () => ({
      sub: "Audiobooks",
      page: emptyState("Choose your audiobook libraries", "Select at least one library in Audiobookshelf settings to start browsing.", "Choose libraries", ""),
    }),
    detail: () => ({ sub: "Audiobooks", page: pageDetail(false) }),
    "detail-conflict": () => ({ sub: "Audiobooks", page: pageDetail(true) }),
    home: () => ({ sub: "Home", page: pageHome() }),
    music: () => ({ sub: "Music", page: pageMusic() }),
    "now-playing": () => ({ sub: "Now playing", page: pageNowPlaying("spoken") }),
    "now-playing-music": () => ({ sub: "Now playing", page: pageNowPlaying("music") }),
    downloads: () => ({ sub: "Downloads", page: pageDownloads() }),
    settings: () => ({ sub: "Settings", page: pageSettings(), search: false }),
    "settings-signin": () => ({ sub: "Settings", page: pageSettingsSignIn(), search: false }),
    "podcasts-abs": () => ({ sub: "Podcasts", page: pagePodcasts() }),
    radio: () => ({ sub: "Radio", page: pageRadio() }),
  };

  const key = SCREEN in pages ? SCREEN : "a";
  const cfg = pages[key]();
  const useFoot = ["setup", "signin", "choose-libs", "empty"].includes(key) ? pbar("spoken") : foot;
  mount(win({
    hdr: header(cfg.sub, { search: cfg.search, q: key === "search" ? "hail" : "" }),
    side: sidebar(sideFor(key)),
    page: cfg.page,
    foot: useFoot,
    cls: W800 ? "w800" : "",
  }));
}

render();

document.addEventListener("DOMContentLoaded", () => {
  const svg = (n) =>
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${EXTRA[n]}</svg>`;
  document.querySelectorAll("i[data-i]").forEach((el) => {
    if (EXTRA[el.dataset.i]) el.innerHTML = svg(el.dataset.i);
  });
  document.querySelector(".mock-switch")?.remove();
  if (SHOT) return;
  const screens = (ROOT.dataset.screens || "").split(",").filter(Boolean);
  const link = (k, v, label) => {
    const p = new URLSearchParams(location.search);
    p.set(k, v);
    const on = (Q.get(k) || { theme: "dark", screen: screens[0] }[k]) === v;
    return `<a class="${on ? "on" : ""}" href="?${p}">${label}</a>`;
  };
  const nav = document.createElement("nav");
  nav.className = "mock-switch";
  nav.innerHTML =
    screens.map((s) => link("screen", s, s)).join("") +
    "<span></span>" + link("theme", "dark", "Dark") + link("theme", "light", "Light") +
    '<span></span><a href="index.html">Gallery</a>';
  document.body.append(nav);
});
