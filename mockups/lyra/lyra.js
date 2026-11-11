// Nyx Lyra mockups: sample data, Lyra's parts (header, sidebar, player bar, grids, track
// lists) and the page switcher. Loaded after ../polish/mock.js (in the page head), which
// reads the theme and screen from the URL and draws the icons once the page is built.
"use strict";
const Q = new URLSearchParams(location.search);
const ROOT = document.documentElement;
const SCREEN = ROOT.dataset.screen;
const SHOT = Q.get("shot") === "1";

/* ── Icons mock.js doesn't have (drawn after it, by the same name) ─────────────── */
const LI = {
  lyra: '<path d="M7 3.5C5 8 6.2 13.6 10 15.5M17 3.5c2 4.5.8 10.1-3 12M7.3 7h9.4M10 7.5v8M12 7.5v9M14 7.5v8M12 16.5v3.5M9.5 20.5h5"/>',
  mini: '<rect x="3" y="4.5" width="18" height="15" rx="2.5"/><rect x="11.5" y="11.5" width="6.5" height="5" rx="1.2" fill="currentColor" stroke="none"/>',
  expand: '<path d="M14.5 4h5.5v5.5M9.5 20H4v-5.5M20 4l-6.5 6.5M4 20l6.5-6.5"/>',
  collapse: '<path d="M4 14.5h5.5V20M20 9.5h-5.5V4M9.5 14.5 3.5 20.5M14.5 9.5l6-6"/>',
  heartf: '<path fill="currentColor" d="M12 20s-7.5-4.6-9-9.3C2 7.4 4.2 4.5 7.3 4.5c2 0 3.6 1.1 4.7 2.7 1.1-1.6 2.7-2.7 4.7-2.7 3.1 0 5.3 2.9 4.3 6.2-1.5 4.7-9 9.3-9 9.3z"/>',
  share: '<circle cx="18" cy="5.5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="18.5" r="2.5"/><path d="m8.2 10.8 7.6-4.1M8.2 13.2l7.6 4.1"/>',
  trendup: '<path d="m12 6.5-6 8h12z" fill="currentColor" stroke="none"/>',
  trenddown: '<path d="m12 17.5 6-8H6z" fill="currentColor" stroke="none"/>',
  dash: '<path d="M7 12h10" stroke-width="2.2"/>',
  grip: '<path d="M9 6h.01M15 6h.01M9 12h.01M15 12h.01M9 18h.01M15 18h.01" stroke-width="2.6"/>',
  library: '<rect x="3.5" y="3.5" width="4" height="17" rx="1.2"/><rect x="10" y="3.5" width="4" height="17" rx="1.2"/><path d="m16.8 4.6 3.7 15.2"/>',
  saved: '<path d="M4 6h11M4 11h11M4 16h6"/><path d="m14 17 2.5 2.5L21 15"/>',
  pladd: '<path d="M4 6h11M4 11h11M4 16h7M18 13v7M14.5 16.5h7"/>',
  wifioff: '<path d="M8.5 16a5 5 0 0 1 7 0M12 19.5h.01M2 9a15 15 0 0 1 5-3.2M10.5 4.6A15 15 0 0 1 22 9M5 12.5a10 10 0 0 1 4-2.4M15 10.4a10 10 0 0 1 4 2.1M3 3l18 18"/>',
  history: '<path d="M3.5 12a8.5 8.5 0 1 0 2.5-6"/><path d="M3.5 4v4.5H8M12 7.5V12l3 2"/>',
  alert: '<path d="M12 3.5 2.5 20h19z"/><path d="M12 10v4.5M12 17.5h.01" stroke-width="1.9"/>',
  repeat1: '<path d="m17 2.5 3.5 3.5L17 9.5"/><path d="M3.5 11.5v-1A4.5 4.5 0 0 1 8 6h12.5M7 21.5 3.5 18 7 14.5"/><path d="M20.5 12.5v1A4.5 4.5 0 0 1 16 18H3.5"/><path d="M11 10.5 12.5 9.5v5" stroke-width="1.5"/>',
  web: '<rect x="3" y="4" width="18" height="16" rx="2.5"/><path d="M3 8.5h18M6 6.25h.01M8.5 6.25h.01" />',
  explicit: '<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M14.5 8h-5v8h5M9.5 12h4"/>',
};
const icon = (n, c = "") => `<i data-i="${n}"${c ? ` class="${c}"` : ""}></i>`;
const ib = (n, tip = "", c = "") => `<button class="ib ${c}"${tip ? ` title="${tip}"` : ""}>${icon(n)}</button>`;
const cover = (g, size, r = 6, c = "") => `<div class="art ${g} cv ${c}" style="${size ? `width:${size}px;height:${size}px;` : ""}border-radius:${r}px"></div>`;
const eqb = () => `<span class="eqb"><b style="height:55%"></b><b style="height:100%"></b><b style="height:70%"></b></span>`;
const slider = (p, c = "", knob = false) => `<div class="slider ${c}"><div class="tr"><div class="fill" style="width:${p}%"></div></div>${knob ? `<span class="kn" style="left:${p}%"></span>` : ""}</div>`;

/* ── Sample library ────────────────────────────────────────────────────────────── */
// The same track as the bar and dock mockups: Midnight City, 1:42 of 4:03.
const NOW = { t: "Midnight City", a: "M83", al: "Hurry Up, We're Dreaming", y: 2011, g: "g7", pos: "1:42", dur: "4:03", p: 42 };
const HURRY = [
  ["Intro", "5:22"], ["Midnight City", "4:03"], ["Reunion", "3:55"], ["Where the Boats Go", "1:39"], ["Wait", "5:43"],
  ["Raconte-moi une histoire", "4:12"], ["Train to Pluton", "1:13"], ["Claudia Lewis", "4:05"], ["This Bright Flash", "4:08"],
  ["When Will You Come Home?", "1:31"], ["Soon, My Friend", "2:19"], ["My Tears Are Becoming a Sea", "2:31"],
];
const ALBUMS = [
  ["g6", "Since I Left You", "The Avalanches", "2000"],
  ["g12", "Random Access Memories", "Daft Punk", "2013"],
  ["g9", "Music Has the Right to Children", "Boards of Canada", "1998"],
  ["g1", "In Rainbows", "Radiohead", "2007"],
  ["g5", "Immunity", "Jon Hopkins", "2013"],
  ["g14", "Dummy", "Portishead", "1994"],
  ["g16", "Selected Ambient Works 85–92", "Aphex Twin", "1992"],
  ["g11", "Currents", "Tame Impala", "2015"],
  ["g10", "Discovery", "Daft Punk", "2001"],
  ["g13", "Settle", "Disclosure", "2013"],
  ["g3", "Blonde", "Frank Ocean", "2016"],
  ["g4", "Endtroducing.....", "DJ Shadow", "1996"],
  ["g8", "Kid A", "Radiohead", "2000"],
  ["g2", "Ágætis byrjun", "Sigur Rós", "1999"],
  ["g15", "Carrie & Lowell", "Sufjan Stevens", "2015"],
  ["g7", "Hurry Up, We're Dreaming", "M83", "2011"],
];
const SONGS = [
  ["Midnight City", "M83", "g7", "4:03"], ["Instant Crush", "Daft Punk", "g12", "5:37"], ["Teardrop", "Massive Attack", "g13", "5:29"],
  ["Nightcall", "Kavinsky", "g11", "4:18"], ["Open Eye Signal", "Jon Hopkins", "g5", "7:48"], ["Roygbiv", "Boards of Canada", "g9", "2:31"],
  ["Glory Box", "Portishead", "g14", "5:01"], ["Reckoner", "Radiohead", "g1", "4:50"], ["Let It Happen", "Tame Impala", "g11", "7:47"],
  ["Xtal", "Aphex Twin", "g16", "4:54"], ["Ivy", "Frank Ocean", "g3", "4:09"], ["Frontier Psychiatrist", "The Avalanches", "g6", "4:49"],
];
const ARTISTS = [
  ["Daft Punk", "g12"], ["Radiohead", "g1"], ["Tame Impala", "g11"], ["Boards of Canada", "g9"],
  ["Jon Hopkins", "g5"], ["Portishead", "g14"], ["M83", "g7"], ["Aphex Twin", "g16"],
];
const MIXES = [
  ["My Supermix", "Daft Punk, M83, Tame Impala and more", "g10"], ["My Mix 1", "Boards of Canada, Aphex Twin", "g13"],
  ["My Mix 2", "Portishead, Massive Attack", "g14"], ["Discover Mix", "New to you, picked for you", "g1"],
  ["New Release Mix", "Fresh from artists you follow", "g11"], ["Replay Mix", "What you play most", "g5"],
];
const PLAYLISTS = [
  { k: "coding", n: "Late night coding", g: "g16", c: ["g16", "g9", "g5", "g13"], count: 48 },
  { k: "running", n: "Running", g: "g11", c: ["g11", "g3", "g10", "g1"], count: 32 },
  { k: "focus", n: "Focus", g: "g5", c: ["g5", "g2", "g8", "g15"], count: 61 },
  { k: "fav", n: "2026 favorites", g: "g3", c: ["g3", "g7", "g6", "g12"], count: 27 },
];

/* ── Window parts ──────────────────────────────────────────────────────────────── */
const search = (q = "", c = "") =>
  `<div class="search ${c}">${icon("search")}<span${q ? ' style="color:var(--text)"' : ""}>${q || "Search YouTube Music"}</span><span class="key">Ctrl F</span></div>`;

function header(sub = "", o = {}) {
  return `<header class="hdr">
    <div class="hdr-id">${icon("lyra", "app-ic")}<span class="app-name">Lyra</span>${sub ? `<span class="app-sub"><span class="sep">/</span>${sub}</span>` : ""}</div>
    <div class="hdr-start">${o.nav === false ? "" : `<span class="gap"></span>${ib("chev-l", "Back (Alt+Left)")}${ib("chev-r", "Forward (Alt+Right)", "dimmed")}`}</div>
    <div class="hdr-center">${o.center ?? search(o.q, o.focus ? "focus" : "")}</div>
    <div class="hdr-end">${o.end ?? ""}${ib("mini", "Mini-player (Ctrl+M)")}${ib("sliders", "Settings (Ctrl+,)")}</div>
  </header>`;
}

const NAV_TOP = [["home", "Home", "home"], ["explore", "Explore", "compass"], ["search", "Search", "search"]];
const NAV_LIB = [["library", "Library", "library"], ["liked", "Liked Music", "heart", "1,284"], ["artists", "Artists", "user", "86"], ["albums", "Albums", "disc", "142"], ["songs", "Songs", "note"]];
function sidebar(active = "home", o = {}) {
  const n = ([k, label, i, cnt]) => `<a class="nav ${k === active ? "active" : ""}" title="${label}">${icon(i)}<span>${label}</span>${cnt ? `<em class="cnt">${cnt}</em>` : ""}</a>`;
  const pl = (p) => `<a class="nav ${p.k === active ? "active" : ""} ${p.k === o.playing ? "playing" : ""}" title="${p.n}"><span class="art ${p.g} pl"></span><span>${p.n}</span></a>`;
  return `<aside class="side"><div class="side-scroll">
    ${NAV_TOP.map(n).join("")}
    <div class="grp">Your library${icon("chev-d")}</div>
    ${NAV_LIB.map((x) => n(x[0] === "liked" && o.likedCount !== undefined ? [...x.slice(0, 3), o.likedCount] : x)).join("")}
    <div class="grp">Playlists${icon("plus")}</div>
    ${n(["playlists", "All playlists", "list", "23"])}
    ${PLAYLISTS.map(pl).join("")}
  </div>${o.signedOut ? `<div class="acct"><span class="avatar" style="background:var(--field);color:var(--dim-text)">${icon("user")}</span><div class="grow"><div class="t500 acc">Sign in</div><div class="s">To see your library</div></div></div>` : `<div class="acct"><span class="avatar">K</span><div class="grow"><div class="t500">Ken</div><div class="s">YouTube Music</div></div>${icon("chev-d")}</div>`}</aside>`;
}

// The player bar. state: playing | paused | waiting | reconnecting | signedout | empty
function pbar(o = {}) {
  const s = o.state || "playing", t = o.track || NOW;
  const off = s === "reconnecting" || s === "empty";
  const liked = o.liked ?? s !== "signedout";
  const line2 = {
    waiting: `<div class="a wait">Waiting for YouTube Music…</div>`,
    reconnecting: `<div class="a warn">Reconnecting to YouTube Music…</div>`,
  }[s] || `<div class="a">${t.a} · ${t.al}</div>`;
  const np = s === "empty"
    ? `<div class="cv ph" style="width:48px;height:48px;border-radius:6px">${icon("note")}</div><div class="meta"><div class="t">Nothing playing</div><div class="a">Pick something to play</div></div>`
    : `${cover(t.g, 0, 6)}<div class="meta"><div class="t">${t.t}</div>${line2}</div>${ib(liked ? "heartf" : "heart", s === "signedout" ? "Sign in to like songs" : liked ? "Unlike (L)" : "Like (L)", liked ? "acc" : "")}`;
  const pb = s === "waiting" ? `<button class="play wait" title="Waiting for YouTube Music"><span class="spin"></span></button>`
    : `<button class="play" title="${s === "paused" || s === "empty" ? "Play" : "Pause"} (Space)">${icon(s === "paused" || s === "empty" ? "play" : "pause")}</button>`;
  const slim = o.slim;
  const pos = s === "empty" ? ["", ""] : [s === "waiting" ? "4:03" : t.pos, t.dur];
  const p = s === "empty" ? 0 : s === "waiting" ? 100 : t.p;
  return `<footer class="pbar ${off ? "off" : ""} ${slim ? "slim" : ""} ${o.cls || ""}">
    <span class="line"><b style="width:${p}%"></b></span>
    <div class="np">${np}</div>
    <div class="transport">
      <div class="tbtns">${ib("shuffle", "Shuffle (S)", "wide")}${ib("prev", "Previous (Ctrl+Left)", "big")}${pb}${ib("next", "Next (Ctrl+Right)", `big ${s === "waiting" ? "pressed" : ""}`)}${ib(o.repeat || "repeat", "Repeat (R)", `wide ${o.repeatOn !== false ? "on" : ""}`)}</div>
      ${slim ? "" : `<div class="seek"><span class="tm">${pos[0]}</span>${slider(p)}<span class="tm">${pos[1]}</span></div>`}
    </div>
    ${slim ? `<div class="seek" style="display:none"></div>` : ""}
    <div class="pright">${s === "reconnecting" ? `<span class="state-chip warn"><span class="dot"></span>Offline</span>` : ""}${s === "signedout" ? `<button class="btn" style="margin-right:6px">Sign in</button>` : ""}${ib("lyrics", "Lyrics", `wide ${o.lyricsOn ? "on" : ""}`)}${ib("queue", "Up next (Q)", `wide ${o.queueOn ? "on" : ""}`)}<span class="vol" style="display:contents">${ib("volume", "Mute (M)")}${slider(70, "wide")}</span>${slim ? "" : ib("expand", "Now playing (F)", "wide")}</div>
  </footer>`;
}

function win({ hdr, side = "", page, foot = "", cls = "", over = "" }) {
  return `<div class="win ${side ? "" : "no-side"} ${cls}">${hdr}${side}<main class="page">${page}</main>${foot}${over}</div>`;
}

/* ── Content parts ─────────────────────────────────────────────────────────────── */
const chips = (list, on = 0) => `<div class="chips">${list.map((c, i) => `<span class="chip ${i === on ? "on" : ""}">${c}</span>`).join("")}</div>`;
const shead = (t, s = "", act = "", c = "") => `<div class="shead ${c}"><span class="t">${t}</span>${s ? `<span class="s">${s}</span>` : ""}<span class="act">${act}</span></div>`;
const arrows = () => `${ib("chev-l", "Back", "dimmed")}${ib("chev-r", "More")}`;
const more = (label = "More") => `<button class="btn ghost">${label}</button>`;

// An album, playlist or artist tile. o: { hover, playing, round, sub }
function alb([g, nm, ar, yr], o = {}) {
  const sub = o.sub ?? (o.kind ? `${o.kind} · ${ar}` : ar);
  return `<div class="alb ${o.hover ? "hover" : ""} ${o.playing ? "playing" : ""} ${o.round ? "round" : ""}">
    <div class="art ${g} cv ${o.mix ? "mixart" : ""}">${o.art || ""}<span class="hplay">${icon("play")}</span><span class="more">${icon("more")}</span></div>
    <div class="nm">${nm}</div><div class="ar">${sub}</div></div>`;
}
const grid = (items, cols = 4, o = {}) => `<div class="agrid" style="--cols:${cols}">${items.map((a, i) => alb(a, { ...(o.each ? o.each(i, a) : {}) })).join("")}</div>`;
const shelf = (items, cw = 158) => `<div class="shelf" style="--cw:${cw}px">${items.join("")}</div>`;
const mixTile = ([n, d, g], o = {}) => alb([g, n, d], { ...o, mix: true, art: `<span class="art-t">${n.replace("My ", "")}<small>Mix</small></span>`, sub: d });
const artistTile = ([n, g], o = {}) => alb([g, n, ""], { round: true, sub: o.sub ?? "Artist", ...o });

function song([t, a, g, d], o = {}) {
  return `<div class="song ${o.on ? "on" : ""} ${o.hover ? "hover" : ""}">${o.pre || ""}${cover(g, 0, 5)}<div class="tt"><div>${t}</div><div class="a">${o.sub ?? a}</div></div>${o.post ?? `<span class="d">${d}</span>`}</div>`;
}
const songs = (list, cols = 3, o = {}) => `<div class="songs" style="--scols:${cols}">${list.map((s, i) => song(s, o.each ? o.each(i, s) : {})).join("")}</div>`;

// Compact rows: an album's tracks (the now-playing column) or the queue.
const trow = ([nm, d], i, on) => `<div class="trow ${on ? "on" : ""}">${on ? eqb() : `<span class="n">${i + 1}</span>`}<span class="nm">${nm}</span><span class="d">${d}</span></div>`;
const qrow = ([t, a, g, d], on = false, grip = true) =>
  `<div class="trow q ${on ? "on" : ""}">${cover(g, 0, 4)}<div class="tt"><div>${t}</div><div class="a">${a}</div></div>${on ? eqb() : `<span class="d">${d}</span>`}${grip ? icon("grip", "grip") : ""}</div>`;
const QUEUE = [
  ["Midnight City", "M83", "g7", "4:03"], ["Reunion", "M83", "g7", "3:55"], ["Instant Crush", "Daft Punk", "g12", "5:37"],
  ["Open Eye Signal", "Jon Hopkins", "g5", "7:48"], ["Nightcall", "Kavinsky", "g11", "4:18"], ["Roygbiv", "Boards of Canada", "g9", "2:31"],
  ["Teardrop", "Massive Attack", "g13", "5:29"], ["Let It Happen", "Tame Impala", "g11", "7:47"], ["Reckoner", "Radiohead", "g1", "4:50"],
];

// Full track list. rows: [title, artist, album, g, duration, liked, explicit]
function tlist(rows, o = {}) {
  const album = o.album;
  const head = album
    ? `<div class="tl-r album head"><span class="n">#</span><span>Title</span><span></span><span></span><span class="d">${icon("clock")}</span></div>`
    : `<div class="tl-r head"><span class="n">#</span><span>Title</span><span>Artist</span><span class="c2">Album</span><span></span><span class="d">${icon("clock")}</span></div>`;
  const r = (x, i) => {
    const on = i === o.on, hov = i === o.hover;
    const n = on ? eqb() : hov ? `<span class="ex">${icon("play")}</span><span class="exh">${i + 1}</span>` : `${i + 1}`;
    const lk = `<span class="lk ${x[5] ? "on" : ""}">${x[5] ? icon("heartf") : hov ? icon("heart") : ""}</span>`;
    const more = `<span class="lk">${hov ? icon("more") : ""}</span>`;
    const ex = x[6] ? `<span class="exp" title="Explicit">E</span>` : "";
    if (album) return `<div class="tl-r album ${on ? "on" : ""} ${hov ? "hover" : ""}"><span class="n">${n}</span><span class="ti"><span>${x[0]}</span>${ex}</span>${lk}${more}<span class="d">${x[4]}</span></div>`;
    return `<div class="tl-r ${on ? "on" : ""} ${hov ? "hover" : ""}"><span class="n">${n}</span><span class="ti">${cover(x[3], 0, 4)}<span>${x[0]}</span>${ex}</span><span class="c">${x[1]}</span><span class="c c2">${x[2]}</span>${lk}<span class="d">${x[4]}</span></div>`;
  };
  return `<div class="tlist">${head}${rows.map(r).join("")}</div>`;
}

/* ── Direction A: the now-playing column and Home ──────────────────────────────── */
const moods = ["All", "Relax", "Energize", "Focus", "Workout", "Commute", "Feel good"];
// The column lists the playing album's tracks, or Up next while that album is open.
const npcol = (list = "album", liked = true) => `<div class="npcol">
  <div class="grp">Now playing</div>
  <div class="art ${NOW.g} cv npart"></div>
  <div class="npmeta"><div class="grow"><div class="t">${NOW.t}</div><div class="a">${NOW.a} · ${NOW.al}</div></div>${liked ? ib("heartf", "Unlike (L)", "acc") : ib("heart", "Like (L)")}${ib("more", "More")}</div>
  ${list === "album"
    ? `<div class="from"><span class="grp" style="margin:0">From the album</span><span class="grow"></span><span class="ter xs">22 songs</span></div>
  <div class="list">${HURRY.slice(0, 9).map((t, i) => trow(t, i, i === 1)).join("")}</div>`
    : `<div class="from"><span class="grp" style="margin:0">Up next</span><span class="grow"></span><span class="ter xs">Then autoplay</span></div>
  <div class="list">${QUEUE.slice(1, 6).map((q) => qrow(q, false)).join("")}</div>`}
</div>`;
const featCard = () => `<div class="feat">${cover("g6", 0, 7)}<div class="body">
    <div class="top"><span class="ft">Since I Left You</span><span class="tag2">Album · 2000</span></div>
    <div class="by">The Avalanches · Recommended because you like M83</div>
    <div class="rows">${[["Since I Left You", "4:21"], ["Stay Another Season", "2:21"], ["Radio", "4:52"], ["Two Hearts in 3/4 Time", "2:41"]].map((t, i) => trow(t, i, false)).join("")}</div>
    <div class="acts"><button class="btn primary">${icon("play")}Play</button><button class="btn">${icon("shuffle")}Shuffle</button>${ib("saved", "Save to library")}${ib("more", "More")}</div>
  </div></div>`;
const homeA = (top = "") => `<div class="main">
  ${top}
  ${chips(moods)}
  ${shead("Listen again", "", `${more()}${arrows()}`)}
  ${grid(ALBUMS.slice(0, 10), 5, { each: (i) => ({ hover: i === 2 }) })}
  ${featCard()}
</div>`;

/* ── Rendering and the switcher ────────────────────────────────────────────────── */
function mount(html, bodyCls = "") {
  document.body.innerHTML = html;
  if (bodyCls) document.body.classList.add(...bodyCls.split(" "));
}

// mock.js draws the icons on DOMContentLoaded; this runs after it, for Lyra's icons and
// its own switcher (screens and theme; no before/after).
document.addEventListener("DOMContentLoaded", () => {
  const svg = (n) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${LI[n]}</svg>`;
  document.querySelectorAll("i[data-i]").forEach((el) => { if (LI[el.dataset.i]) el.innerHTML = svg(el.dataset.i); });
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
  nav.innerHTML = screens.map((s) => link("screen", s, s)).join("") + "<span></span>" + link("theme", "dark", "Dark") + link("theme", "light", "Light") + '<span></span><a href="index.html">Gallery</a>';
  document.body.append(nav);
});
