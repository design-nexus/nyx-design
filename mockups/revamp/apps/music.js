// Nyx Music on the revamp page: today's problems and three options.
(() => {
  const NW = () => typeof NARROW !== "undefined" && NARROW;
  const ALBUMS = [
    ["Northern Lights", "The Lanterns", 2024], ["Paper Boats", "Mira Vale", 2022], ["Midnight Freeway", "Static Bloom", 2023],
    ["Low Tide", "Harbor & Pine", 2021], ["Velvet Hours", "June Okoro", 2025], ["Field Notes", "The Quiet Engines", 2019],
    ["Sundial", "Kasimir", 2020], ["Glass Garden", "Odessa Ray", 2024], ["Copper Sky", "The Lanterns", 2021],
    ["Slow Motion City", "Neon Harbor", 2022], ["Wild Honey", "Mira Vale", 2019], ["After the Rain", "Theo Marsh Trio", 2018],
    ["Blue Hour", "Sol Andersen", 2023], ["Lighthouse Radio", "Harbor & Pine", 2024], ["Small Fires", "Odessa Ray", 2020],
    ["Westbound", "Static Bloom", 2021], ["Daydream Static", "Neon Harbor", 2025], ["Orchard", "June Okoro", 2022],
  ];
  const NOW = { t: "Golden Hour Drive", a: "The Lanterns", al: "Northern Lights" };
  const TRACKS = [
    [1, "Northern Lights", "4:12", 18], [2, "Golden Hour Drive", "3:58", 42], [3, "Paper Lanterns", "4:31", 11], [4, "Slow Burn", "3:47", 9],
    [5, "Ferris Wheel", "5:02", 14], [6, "Coastline", "4:20", 7], [1, "Night Swim", "3:33", 6], [2, "Static Hearts", "4:05", 12], [3, "Echo Park", "3:51", 5], [4, "Home by Morning", "6:14", 8],
  ];
  const cover = (al, s, r = 8) => art(al, { w: s, h: s, r, cls: `mu-p${hash(al) % 6}` });

  /* ── The player bar, shared ─────────────────────────────────────────── */
  const player = (o = {}) => `<footer class="status mu-bar">
    <div class="np">${cover(NOW.al, 46, 6)}<div class="tx"><b>${NOW.t}</b><span>${NOW.a} · ${NOW.al}</span></div>${ib("heart", "Love")}</div>
    <div class="ctl"><div class="btns">${ib("shuffle", "Shuffle (S)", "on")}${ib("prev", "Previous (Ctrl+←)")}<button class="play">${icon("pause")}</button>${ib("next", "Next (Ctrl+→)")}${ib("repeat", "Repeat (R)")}</div>
      <div class="pos"><span>1:47</span><span class="tr"><b style="width:45%"></b></span><span>3:58</span></div></div>
    <div class="rt">${o.noLyrics ? "" : ib("lyrics", "Lyrics", o.lyricsOn ? "on" : "")}${ib("queue", "Up next", o.queueOn ? "on" : "")}${ib("eq", "Equalizer", o.eqOn ? "on" : "")}${ib("moon", "Sleep timer")}<span class="vol">${icon("volume")}<span class="tr"><b style="width:70%"></b></span></span></div>
  </footer>`;
  const spectrum = (n = 48, h = 60) => {
    const v = Array.from({ length: n }, (_, i) => { const x = i / n; return Math.max(0.06, (0.85 - x * 0.55) * (0.55 + 0.45 * Math.abs(Math.sin(i * 1.7 + 0.6))) * (i < 3 ? 0.7 + i * 0.1 : 1)); });
    return bars(v, { h, c: "var(--accent)", gap: 3 });
  };
  const playing = () => `<span class="mu-eq"><b></b><b></b><b></b></span>`;

  /* ── Option A: library player ──────────────────────────────────────── */
  const sideA = (on = "albums") => `
    ${tiles([["recent", "spark", 24, "New", "pink"], ["played", "history", 86, "History", "blue"], ["most", "star", 50, "Top songs", "amber"], ["queue", "queue", 12, "Up next", "teal"]], on)}
    ${grp("Library", false, "", "accent")}
    ${navx("note", "Songs", { cnt: "1,284", active: on === "songs" })}
    ${navx("disc", "Albums", { cnt: 112, active: on === "albums" })}
    ${navx("person", "Artists", { cnt: 64 })}
    ${navx("genre", "Genres", { cnt: 18 })}
    ${navx("folder", "Folders")}
    ${grp("Online", false, "", "teal")}
    ${navx("radio", "Radio", { cnt: 8 })}
    ${navx("podcast", "Podcasts", { badge: 3 })}
    ${grp("Playlists", false, icon("plus"), "violet")}
    ${navx("listic", "Road trip", { cnt: 42 })}
    ${navx("listic", "Focus", { cnt: 31 })}
    ${navx("listic", "Sunday morning", { cnt: 18 })}
    <div class="foot">${icon("check-c", "ok")}<span>Library up to date</span></div>`;
  const hdrA = (o = {}) => header({ icon: "music", name: "Music", center: search(NW() ? "Search music" : o.q || "Search songs, albums and artists", "Ctrl F"), end: ib("pip", "Mini player") });

  const albums = () => {
    const n = NW() ? 12 : 18;
    return `<div class="main">
      ${pbar2("Albums", "112 albums", `${btn("Shuffle all", "ghost", "shuffle")}${dd("By artist", "sort")}`)}
      <div class="scroll"><div class="mu-grid">${ALBUMS.slice(0, n).map(([al, ar, y], i) => `<div class="ac ${i === 0 ? "hov" : ""} ${al === NOW.al ? "now" : ""}"><div class="cv">${cover(al, "100%", 8)}${i === 0 ? `<button class="hp">${icon("play")}</button>` : ""}</div><b>${al}</b><span>${ar} · ${y}</span></div>`).join("")}</div></div></div>`;
  };
  const album = () => `<div class="main mu-album"><div class="scroll">
    <div class="ah">${cover(NOW.al, 196, 10)}<div class="ai"><span class="k">Album</span><h1>${NOW.al}</h1><a>${NOW.a}</a><span class="m">2024 · Indie · 10 songs · 44 min · FLAC 24-bit</span>
      <div class="bt">${btn("Play", "primary", "play")}${btn("Shuffle", "", "shuffle")}${btn("Add to playlist", "ghost", "plus")}${ib("more", "Play next, add to queue, open folder")}</div></div></div>
    <div class="mu-tl">
      <div class="th"><span class="n">#</span><span class="t">Title</span><span class="p">Plays</span><span class="d">Time</span></div>
      <div class="disc">Disc 1</div>
      ${TRACKS.slice(0, 6).map(([n, t, d, p]) => `<div class="tr ${t === NOW.t ? "now" : ""}"><span class="n">${t === NOW.t ? playing() : n}</span><span class="t">${t}</span><span class="p">${p}</span><span class="d">${d}</span></div>`).join("")}
      <div class="disc">Disc 2</div>
      ${TRACKS.slice(6).map(([n, t, d, p]) => `<div class="tr"><span class="n">${n}</span><span class="t">${t}</span><span class="p">${p}</span><span class="d">${d}</span></div>`).join("")}
    </div>
    <div class="mu-more"><div class="sechead">More by The Lanterns</div><div class="row">${[["Copper Sky", 2021], ["Harbor Songs", 2018], ["Live at the Rialto", 2022]].map(([a, y]) => `<div class="mc2">${cover(a, 56, 6)}<div><b>${a}</b><span>${y}</span></div></div>`).join("")}</div></div>
  </div></div>`;

  /* ── Option B: now playing at the centre, top tabs ─────────────────── */
  const tabsB = (on) => seg(["Now playing", "Library", "Radio", "Podcasts", "Playlists"], on);
  const hdrB = (on) => header({ icon: "music", name: "Music", center: tabsB(on), end: `${ib("search", "Search (Ctrl+F)")}${ib("pip", "Mini player")}` });
  const LYR = ["Windows down on the coast road", "your hand out catching the light", "radio playing something we half know", "and the whole world turning gold", "We don't have to say it", "we don't have to say it now", "Golden hour, golden hour", "hold it while it lasts"];
  const nowB = () => `<div class="main mu-now">
    <div class="bg">${cover(NOW.al, "100%", 0)}</div>
    <div class="in">
      <div class="lcol">${cover(NOW.al, NW() ? 220 : 300, 12)}
        <div class="ti"><span class="st">Playing</span><h1>${NOW.t}</h1><a>${NOW.a}</a><span class="m">${NOW.al} · 2024 · FLAC 24-bit</span></div>
        <div class="spec">${spectrum(NW() ? 36 : 56, NW() ? 44 : 56)}</div>
      </div>
      ${NW() ? "" : `<div class="ccol"><div class="lh">${seg(["Lyrics", "Spectrum"], "Lyrics")}<span class="src">From the song's .lrc file</span></div><div class="lyr">${LYR.map((l, i) => `<p class="${i === 3 ? "cur" : i < 3 ? "past" : ""}">${l}</p>`).join("")}</div></div>`}
      <div class="rcol card">
        <div class="rh">${seg(["Up next", "Sound"], NW() ? "Sound" : "Up next")}</div>
        ${NW() ? eqPanel() : upNext()}
      </div>
    </div></div>`;
  const upNext = () => `<div class="un">${[["Paper Lanterns", "The Lanterns", "4:31", "Northern Lights"], ["Slow Burn", "The Lanterns", "3:47", "Northern Lights"], ["Tidewater", "Harbor & Pine", "4:02", "Low Tide"], ["Glass Garden", "Odessa Ray", "3:29", "Glass Garden"], ["Neon Rain", "Neon Harbor", "3:55", "Slow Motion City"], ["Sundial", "Kasimir", "5:10", "Sundial"]].map(([t, a, d, al]) => `<div class="ur">${icon("grip", "gr")}${cover(al, 34, 5)}<div class="tx"><b>${t}</b><span>${a}</span></div><span class="d">${d}</span></div>`).join("")}</div>
    <div class="uf">${btn("Save as playlist", "ghost sm", "plus")}<span class="sp"></span>${btn("Clear", "ghost sm", "trash")}</div>`;
  const eqPanel = () => {
    const B = [["32", 62], ["64", 66], ["125", 58], ["250", 50], ["500", 46], ["1k", 48], ["2k", 54], ["4k", 60], ["8k", 64], ["16k", 58]];
    return `<div class="eq">
      <div class="eqh"><span>Equalizer</span>${sw(true)}<span class="sp"></span>${dd("Warm")}${ib("plus", "Save as preset…")}</div>
      <div class="fd">${B.map(([f, v]) => `<div class="f"><span class="tr"><b style="bottom:${v}%"></b><i style="height:${Math.abs(v - 50)}%;${v >= 50 ? "bottom:50%" : `top:50%`}"></i></span><span class="l">${f}</span></div>`).join("")}</div>
      <div class="card eqo">
        <div class="opt"><div class="opt-text"><div>Crossfade</div></div>${dd("4 seconds")}</div>
        <div class="opt"><div class="opt-text"><div>Volume leveling</div></div>${dd("By album")}</div>
        <div class="opt"><div class="opt-text"><div>Sleep timer</div></div>${dd("End of album", "moon")}</div>
      </div></div>`;
  };
  const libraryB = () => `<div class="main mu-lib">
    <div class="mu-sub">${["Songs", "Albums", "Artists", "Genres", "Folders"].map((t, i) => `<span class="sb ${i === 0 ? "on" : ""}">${t}</span>`).join("")}<span class="sep"></span>${["Recently added", "Recently played", "Most played"].map((t) => `<span class="sb">${t}</span>`).join("")}<span class="sp"></span><div class="field">${icon("filter")}<span class="ph">Filter 1,284 songs</span></div></div>
    <div class="scroll">${tbl([["", "34px"], ["Title"], ["Artist", "170px"], ["Album", "180px"], ["Time", "56px"], ["Plays", "52px"], ["Added", "92px"], ["Format", "120px"]],
      [["Golden Hour Drive", "The Lanterns", "Northern Lights", "3:58", "42", "Oct 2", "FLAC · 24-bit"], ["Coastline", "The Lanterns", "Northern Lights", "4:20", "7", "Oct 2", "FLAC · 24-bit"], ["Paper Boats", "Mira Vale", "Paper Boats", "3:12", "31", "Jun 14", "MP3 · 320k"], ["Midnight Freeway", "Static Bloom", "Midnight Freeway", "4:48", "19", "Aug 30", "FLAC · 16-bit"], ["Tidewater", "Harbor & Pine", "Low Tide", "4:02", "12", "Mar 3", "Opus · 160k"], ["Velvet Hours", "June Okoro", "Velvet Hours", "3:36", "27", "Nov 8", "AAC · 256k"], ["Lantern Song", "The Quiet Engines", "Field Notes", "5:21", "4", "Jan 19", "FLAC · 16-bit"], ["Sundial", "Kasimir", "Sundial", "5:10", "15", "Feb 2", "Ogg · 192k"], ["Glass Garden", "Odessa Ray", "Glass Garden", "3:29", "22", "Sep 11", "FLAC · 24-bit"], ["Neon Rain", "Neon Harbor", "Slow Motion City", "3:55", "9", "Jul 21", "MP3 · V0"], ["Honey Moon", "Mira Vale", "Wild Honey", "4:14", "33", "May 5", "MP3 · 320k"], ["After the Rain", "Theo Marsh Trio", "After the Rain", "6:02", "6", "Apr 28", "FLAC · 16-bit"], ["Blue Hour", "Sol Andersen", "Blue Hour", "4:41", "11", "Oct 19", "AAC · 256k"], ["Small Fires", "Odessa Ray", "Small Fires", "3:18", "17", "Dec 1", "FLAC · 24-bit"], ["Westbound", "Static Bloom", "Westbound", "4:09", "8", "Aug 4", "Opus · 160k"]].map((r, i) => [i === 0 ? playing() : cover(r[2], 26, 4), `<b class="${i === 0 ? "acc" : ""}">${r[0]}</b>`, ...r.slice(1)]), { cls: "mu-tbl", sel: 0 })}</div>
  </div>`;

  /* ── Option C: home, podcasts and radio ────────────────────────────── */
  const sideC = (on = "home") => `
    ${navx("home", "Home", { active: on === "home" })}
    ${navx("bars", "Now playing")}
    ${grp("Library", false, "", "accent")}
    ${navx("note", "Songs", { cnt: "1,284" })}
    ${navx("disc", "Albums", { cnt: 112 })}
    ${navx("person", "Artists", { cnt: 64 })}
    ${navx("genre", "Genres", { cnt: 18 })}
    ${navx("folder", "Folders")}
    ${navx("history", "Recent and most played")}
    ${grp("Online", false, "", "teal")}
    ${navx("radio", "Radio", { active: on === "radio", cnt: 8 })}
    ${navx("podcast", "Podcasts", { active: on === "pods", badge: 3 })}
    ${grp("Playlists", false, icon("plus"), "violet")}
    ${navx("queue", "Up next", { cnt: 12 })}
    ${navx("listic", "Road trip", { cnt: 42 })}
    ${navx("listic", "Focus", { cnt: 31 })}`;
  const EPS = [["Field Recordings", "The sound of empty cities", "48 min", 35, true], ["Kitchen Table Science", "Why bread rises (and sometimes doesn't)", "32 min", 0, false], ["Slow History", "The year without a summer", "1 h 5 min", 0, true]];
  const home = () => `<div class="main mu-home"><div class="scroll"><div class="pad">
    <div class="sechead">Jump back in</div>
    <div class="jb">${[["Northern Lights", "The Lanterns"], ["Road trip", "Playlist · 42 songs"], ["Velvet Hours", "June Okoro"], ["Glass Garden", "Odessa Ray"], ["Focus", "Playlist · 31 songs"], ["Low Tide", "Harbor & Pine"]].map(([a, b], i) => `<div class="ac">${cover(a, "100%", 8)}<b>${a}</b><span>${b}</span></div>`).join("")}</div>
    <div class="two">
      <div><div class="sechead">New episodes<span class="more">All podcasts</span></div>
        <div class="card mu-eps">${EPS.map(([s, t, d, p, dl]) => `<div class="ep">${cover(s, 44, 8)}<div class="tx"><span class="s">${s}</span><b>${t}</b><span class="m">${p ? `${prog(p)}<em>31 min left</em>` : `<em>${d}</em>`}${dl ? `<em class="dl">${icon("download")}Downloaded</em>` : ""}</span></div>${ib("play", p ? "Resume" : "Play")}</div>`).join("")}</div></div>
      <div><div class="sechead">Your stations<span class="more">All radio</span></div>
        <div class="card mu-st">${[["KXRT Indie 101", "Odessa Ray · Small Fires", true], ["Lo-fi Lounge", "Live", false], ["Jazz FM Lisbon", "Theo Marsh Trio · Blue Note", false], ["Classic Rock 88", "Live", false]].map(([n, s, on]) => `<div class="st">${art(n, { w: 36, h: 36, r: 18, ic: "radio" })}<div class="tx"><b>${n}</b><span>${on ? `<i class="air">On air</i>` : ""}${s}</span></div>${ib("play", "Play")}</div>`).join("")}</div></div>
    </div>
    <div class="sechead">Most played this month</div>
    <div class="mu-top">${[["Golden Hour Drive", "The Lanterns", 42, "Northern Lights"], ["Honey Moon", "Mira Vale", 33, "Wild Honey"], ["Paper Boats", "Mira Vale", 31, "Paper Boats"], ["Velvet Hours", "June Okoro", 27, "Velvet Hours"], ["Glass Garden", "Odessa Ray", 22, "Glass Garden"], ["Midnight Freeway", "Static Bloom", 19, "Midnight Freeway"]].map(([t, a, n, al], i) => `<div class="tp"><span class="r">${i + 1}</span>${cover(al, 36, 5)}<div class="tx"><b>${t}</b><span>${a}</span></div><span class="n">${n} plays</span></div>`).join("")}</div>
  </div></div></div>`;
  const podcasts = () => `<div class="main mu-pod">
    ${pbar2("Podcasts", "6 shows · 3 new episodes", `${btn("Check for new", "ghost", "refresh")}${btn("Find a podcast", "", "search")}`)}
    <div class="shows">${[["Field Recordings", 1], ["Kitchen Table Science", 0], ["Slow History", 1], ["The Long Way Round", 0], ["Pocket Astronomy", 1], ["Night Owl Stories", 0]].map(([n, nw], i) => `<div class="sh ${i === 0 ? "on" : ""}">${cover(n, 72, 10)}${nw ? `<span class="nb">New</span>` : ""}<span>${n}</span></div>`).join("")}</div>
    <div class="cols"><div class="main"><div class="scroll"><div class="pad">
      <div class="shead">${cover("Field Recordings", 88, 12)}<div class="tx"><h2>Field Recordings</h2><span class="a">Studio Ember · Society and culture</span><p>Sound designers walk through places at odd hours and tell you what they hear. A new episode every Thursday.</p><div class="bt">${btn("Play latest", "primary", "play")}${btn("Subscribed", "", "check")}${ib("more", "Copy feed address, unsubscribe")}</div></div></div>
      <div class="eps">${[["Nov 12", "The sound of empty cities", "48 min", 35, true, true], ["Nov 5", "A night in a train station", "41 min", 100, true, false], ["Oct 29", "Fog horns, explained", "36 min", 0, false, false], ["Oct 22", "The quietest room in the world", "52 min", 0, false, false]].map(([d, t, len, p, dl, nw]) => `<div class="er ${p === 100 ? "done" : ""}"><div class="tx"><span class="d">${d}${nw ? `<em class="nw">New</em>` : ""}</span><b>${t}</b><span class="m">${p === 100 ? "Played" : p ? `${prog(p)}31 min left` : len}${dl ? ` · ${icon("download")}Downloaded` : ""}</span></div>${p === 100 ? "" : dl ? "" : ib("download", "Download to play offline")}${ib("more", "Play next, add to queue, mark as played")}<button class="ib pl">${icon("play")}</button></div>`).join("")}</div>
    </div></div></div></div>
  </div>`;

  /* ── Option C: column browser ──────────────────────────────────────── */
  const sideN1 = (on = "music") => `
    ${grp("Library", true, "", "accent")}
    ${navx("music", "Music", { active: on === "music", cnt: "1,284" })}
    ${navx("spark", "Recently added", { cnt: 24 })}
    ${navx("history", "Recently played")}
    ${navx("star", "Most played")}
    ${navx("folder", "Folders")}
    ${grp("Online", false, "", "teal")}
    ${navx("radio", "Radio", { active: on === "radio", cnt: 8 })}
    ${navx("podcast", "Podcasts", { badge: 3 })}
    ${grp("Playlists", false, icon("plus"), "violet")}
    ${navx("queue", "Up next", { cnt: 12 })}
    ${navx("listic", "Road trip", { cnt: 42 })}
    ${navx("listic", "Focus", { cnt: 31 })}
    ${navx("listic", "Sunday morning", { cnt: 18 })}
    <div class="foot">${icon("check-c", "ok")}<span>1,284 songs · 3 days of music</span></div>`;
  const bcol = (title, rows, sel, o = {}) => `<div class="n1-bc ${o.cls || ""}"><div class="bh">${title}</div><div class="br">${rows.map((r, i) => {
    const [t, n, c] = Array.isArray(r) ? r : [r];
    return `<div class="bi ${i === sel ? "on" : ""} ${i === 0 && o.all ? "all" : ""}">${c ? cover(c, 22, 4) : ""}${o.star && i > 0 ? icon("star", i < 3 ? "st on" : "st") : ""}<span class="t">${t}</span>${n !== undefined ? `<span class="n">${n}</span>` : ""}</div>`;
  }).join("")}</div></div>`;
  const n1Lib = () => `<div class="main n1-lib">
    ${pbar2("Music", "1,284 songs · 112 albums · 64 artists", `${btn("Shuffle all", "ghost", "shuffle")}${seg(["Columns", "Covers"], "Columns")}`)}
    <div class="n1-cb">
      ${bcol("Genre", [["All 18 genres"], ["Ambient", 41], ["Electronic", 96], ["Folk", 73], ["Indie", 212], ["Jazz", 88], ["Pop", 154], ["Rock", 230]], 4, { all: true })}
      ${bcol("Artist", [["All 9 artists"], ["Harbor & Pine", 24], ["June Okoro", 31], ["Mira Vale", 38], ["Odessa Ray", 29], ["Static Bloom", 22], ["The Lanterns", 28], ["The Quiet Engines", 12]], 6, { all: true })}
      ${bcol("Album", [["All 3 albums"], ["Copper Sky", 2021, "Copper Sky"], ["Harbor Songs", 2018, "Harbor Songs"], ["Northern Lights", 2024, "Northern Lights"]], 3, { all: true })}
    </div>
    <div class="n1-al">${cover(NOW.al, 52, 6)}<div class="tx"><b>${NOW.al}</b><span>${NOW.a} · 2024 · 10 songs · 44 min · FLAC 24-bit</span></div><span class="sp"></span>${btn("Play", "primary", "play")}${btn("Shuffle", "", "shuffle")}${ib("more", "Play next, add to queue, add to playlist, open folder")}</div>
    <div class="scroll">${tbl([["#", "40px"], ["Title"], ["Time", "56px"], ["Plays", "52px"], ["Added", "84px"], ["Format", "116px"]],
      TRACKS.map(([n, t, d, p], i) => [i === 1 ? playing() : `${i > 5 ? 2 : 1}·${n}`, `<b class="${i === 1 ? "acc" : ""}">${t}</b>`, d, p, "Oct 2", "FLAC · 24-bit"]), { cls: "mu-tbl n1-tbl", sel: 1 })}</div>
  </div>`;
  const n1Radio = () => {
    const S = [
      ["KXRT Indie 101", "Odessa Ray · Small Fires", "US", "128k", true, true],
      ["Lo-fi Lounge", "Kasimir · Sundial", "UK", "192k", true, false],
      ["Jazz FM Lisbon", "Theo Marsh Trio · Blue Note", "Portugal", "128k", true, false],
      ["Radio Alfama", "Live", "Portugal", "96k", false, false],
      ["Blue Room Jazz", "Sol Andersen · Blue Hour", "Sweden", "256k", false, false],
      ["Late Night Standards", "Live", "US", "128k", false, false],
      ["Smooth Harbor", "June Okoro · Velvet Hours", "Canada", "160k", false, false],
      ["Swing Street 24/7", "Live", "US", "64k", false, false],
    ];
    return `<div class="main n1-lib">
      ${pbar2("Radio", "58,000 stations from Radio Browser · no account needed", `${btn("Add a station", "ghost", "plus")}${seg(["Columns", "Covers"], "Columns")}`)}
      <div class="n1-cb">
        ${bcol("Browse", [["Favorites", 8], ["Most popular"], ["By genre"], ["By country"]], 2)}
        ${bcol("Genre", [["Ambient", 312], ["Classical", 1840], ["Indie", 920], ["Jazz", 2210], ["Lo-fi", 410], ["News", 3105], ["Rock", 4120]], 3)}
        ${bcol("Country", [["All 64 countries"], ["Canada", 96], ["Portugal", 41], ["Sweden", 38], ["United Kingdom", 210], ["United States", 640]], 0, { all: true })}
      </div>
      <div class="scroll">${tbl([["", "34px"], ["", "30px"], ["Station"], ["On air now", "260px"], ["Country", "120px"], ["Quality", "70px"]],
        S.map(([n, s, c, q, fav, on]) => [on ? playing() : art(n, { w: 24, h: 24, r: 12, ic: "radio" }), icon("star", fav ? "fav on" : "fav"), `<b class="${on ? "acc" : ""}">${n}</b>`, s === "Live" ? `<span class="live">Live</span>` : s, c, q]), { cls: "mu-tbl n1-tbl n1-rtbl", sel: 0 })}</div>
    </div>`;
  };

  const n1RadioBar = () => player()
    .replace(/<div class="np">[\s\S]*?(?=<div class="ctl">)/, `<div class="np">${art("KXRT Indie 101", { w: 46, h: 46, r: 23, ic: "radio" })}<div class="tx"><b>KXRT Indie 101</b><span>On air: Odessa Ray · Small Fires</span></div>${ib("star", "Favorite", "on")}</div>\n    `)
    .replace(/<div class="pos">[\s\S]*?<\/div>/, `<div class="pos n1-live"><span class="live">Live</span><span>Indie · United States · 128k</span></div>`);

  /* ── Option D: listening timeline ──────────────────────────────────── */
  const hdrN2 = () => header({ icon: "music", name: "Music",
    center: `<div class="n2-cmd">${icon("search")}<span>${NW() ? "Play anything" : "Play or queue anything: songs, albums, artists, stations, podcasts"}</span><span class="key">Ctrl K</span></div>`,
    end: `${NW() ? ib("eq", "Sound") : ""}${ib("pip", "Mini player")}` });
  const n2Row = ([tm, t, a, al, d], o = {}) => `<div class="n2-r ${o.cls || ""}"><span class="tm">${tm}</span>${o.grip ? icon("grip", "gr") : ""}${cover(al, 36, 5)}<div class="tx"><b>${t}</b><span>${a} · ${al}</span></div><span class="d">${d}</span>${o.end || ""}</div>`;
  const n2Now = () => `<div class="n2-now">
    <div class="bg">${cover(NOW.al, "100%", 0)}</div>
    <div class="in">
      <span class="tm">10:12</span>
      ${cover(NOW.al, NW() ? 120 : 156, 10)}
      <div class="info">
        <span class="st">${playing()}Playing now</span>
        <h1>${NOW.t}</h1>
        <span class="a"><a>${NOW.a}</a> · ${NOW.al} · 2024 · FLAC 24-bit</span>
        <div class="ly"><p class="past">radio playing something we half know</p><p>and the whole world turning gold</p></div>
        <div class="pos"><span>1:47</span><span class="tr"><b style="width:45%"></b>${spectrum(NW() ? 40 : 64, 22)}</span><span>3:58</span></div>
        <div class="ctl">${ib("shuffle", "Shuffle (S)", "on")}${ib("prev", "Previous")}<button class="play">${icon("pause")}</button>${ib("next", "Next")}${ib("repeat", "Repeat (R)")}<span class="sp"></span>${ib("heart", "Love")}${ib("lyrics", "Lyrics", "on")}${ib("more", "Go to album, add to playlist, open folder")}</div>
      </div>
    </div>
  </div>`;
  const n2Timeline = () => `<div class="n2-tl">
    <div class="sec past"><span class="h">Earlier</span><span class="sp"></span><a>Recently played</a></div>
    ${[["9:58", "Velvet Hours", "June Okoro", "Velvet Hours", "3:36"], ["10:02", "Paper Boats", "Mira Vale", "Paper Boats", "3:12"], ["10:05", "Midnight Freeway", "Static Bloom", "Midnight Freeway", "4:48"]].slice(NW() ? 2 : 1).map((r) => n2Row(r, { cls: "done", end: ib("refresh", "Play again") })).join("")}
    ${n2Now()}
    <div class="sec"><span class="h">Up next</span><span class="c">12 songs · 48 min · ends 11:02</span><span class="sp"></span>${btn("Save as playlist", "ghost sm", "plus")}${btn("Clear", "ghost sm", "trash")}</div>
    ${[["10:16", "Paper Lanterns", "The Lanterns", "Northern Lights", "4:31"], ["10:21", "Slow Burn", "The Lanterns", "Northern Lights", "3:47"]].map((r) => n2Row(r, { grip: true })).join("")}
    <div class="n2-mark">${icon("moon")}<span><b>Sleep timer</b> · end of the album: fades out and pauses here, at 10:24</span><span class="sp"></span>${btn("Change", "ghost sm")}</div>
    ${[["10:24", "Tidewater", "Harbor & Pine", "Low Tide", "4:02"], ["10:28", "Glass Garden", "Odessa Ray", "Glass Garden", "3:29"], ["10:32", "Field Recordings: The sound of empty cities", "Podcast", "Field Recordings", "31 min left"]].map((r) => n2Row(r, { grip: true, cls: "after" })).join("")}
  </div>`;
  const n2Side = () => `<aside class="n2-side">
    <div class="card n2-sound">
      <div class="h">Sound</div>
      ${eqPanel()}
    </div>
    <div class="n2-vol">${icon("volume")}<span class="tr"><b style="width:70%"></b></span><span>70%</span></div>
  </aside>`;
  const n2Page = () => `<div class="main n2-page"><div class="scroll"><div class="n2-wrap">${n2Timeline()}${NW() ? "" : n2Side()}</div></div></div>`;
  const n2Add = () => {
    const br = [["note", "Songs", "1,284"], ["disc", "Albums", 112], ["person", "Artists", 64], ["genre", "Genres", 18], ["folder", "Folders"], ["spark", "Recently added"], ["history", "Recently played"], ["star", "Most played"], ["radio", "Radio"], ["podcast", "Podcasts"], ["listic", "Playlists", 4]];
    const res = (lead, t, s, sel) => `<div class="rr ${sel ? "sel" : ""}">${lead}<div class="tx"><b>${t}</b><span>${s}</span></div>${sel ? `<span class="acts">${btn("Play", "primary sm", "play")}${btn("Play next", "sm")}${btn("Add to queue", "sm", "plus")}</span>` : ""}</div>`;
    return `<div class="veil n2-veil"><div class="n2-pal pop">
      <div class="q">${icon("search")}<span class="v">lant</span><span class="caret"></span><span class="sp"></span><span class="kbd">Esc</span></div>
      <div class="body">
        <div class="browse"><div class="h">Browse</div>${br.map(([i, t, n]) => `<div class="bi">${icon(i)}<span>${t}</span>${n !== undefined ? `<em>${n}</em>` : ""}</div>`).join("")}</div>
        <div class="res">
          <div class="top">${art("The Lanterns", { w: 64, h: 64, r: 32, ic: "person" })}<div class="tx"><span class="k">Artist</span><b>The Lanterns</b><span>3 albums · 28 songs · 214 plays</span></div>${btn("Play all", "", "play")}${btn("Shuffle", "ghost", "shuffle")}</div>
          <div class="h">Songs</div>
          ${res(cover("Northern Lights", 34, 5), "Paper <u>Lant</u>erns", "The Lanterns · Northern Lights · 4:31", true)}
          ${res(cover("Field Notes", 34, 5), "<u>Lant</u>ern Song", "The Quiet Engines · Field Notes · 5:21")}
          <div class="h">Albums</div>
          ${res(cover("Northern Lights", 34, 5), "Northern Lights", "The <u>Lant</u>erns · 2024 · 10 songs")}
          ${res(cover("Copper Sky", 34, 5), "Copper Sky", "The <u>Lant</u>erns · 2021 · 9 songs")}
          <div class="h">Radio and podcasts</div>
          ${res(art("Lantern FM", { w: 34, h: 34, r: 17, ic: "radio" }), "<u>Lant</u>ern FM Porto", "Station · Portugal · Indie")}
          ${res(cover("Lanterns in the Dark", 34, 8), "<u>Lant</u>erns in the Dark", "Podcast · Night Owl Stories · 6 episodes")}
        </div>
      </div>
      <div class="ft"><span>${kbd("Enter")} play</span><span>${kbd("Shift Enter")} play next</span><span>${kbd("Ctrl Enter")} add to queue</span><span class="sp"></span><span>${kbd("Tab")} browse</span></div>
    </div></div>`;
  };

  REG("music", {
    name: "Music", accent: "pink",
    summary: "Music plays well and does a lot (radio, podcasts, a live spectrum, lyrics, an equalizer), but its sidebar is fifteen rows with no shape, and Now playing leads with a grey disc and an empty frequency chart.",
    problems: [
      "<b>Fifteen rows, no shape:</b> nine library pages sit under no heading, and “Playlists” holds only the Queue, which isn't a playlist; counts show on some rows (Albums 1, Artists 1) and not others.",
      "<b>Now playing leads with emptiness:</b> a grey placeholder disc and, while paused, a large blank chart labelled 50, 100, 200 … 10k: frequencies, in a music app.",
      "<b>Up next is a run-on line:</b> title and artist sit side by side in the same weight (“Two of a Kind, Workin' on a Full House Garth Brooks”), with no covers.",
      "<b>Two names for one page:</b> the header subtitle repeats the sidebar's “Now playing”, and the header's equalizer and mini-player buttons look like the Settings button next to them.",
      "<b>The player bar is mostly gaps:</b> tiny controls, a grey cover square, a moon with no label, and no way to open Up next from it.",
      "<b>Radio and Podcasts hide</b> under a small “Online” heading with no sign of new episodes or what's on air.",
      "<b>At 800 px</b> the rail is fifteen look-alike icons, and Up next is cut to two songs below the empty chart.",
    ],
    today: [["music-1280", "Today at 1280 px", "Now playing, paused"], ["music-800", "Today at 800 px", "Rail of 15 icons; Up next cut short"]],
    options: [
      { id: "a", name: "Now playing at the centre", idea: "No sidebar. Five tabs in the header (Now playing, Library, Radio, Podcasts, Playlists) and Now playing becomes the home: the cover large over a blurred copy of itself, the spectrum as a strip under it that only moves while music plays, timed lyrics in the middle, and Up next on the right with drag handles, Save as playlist and Clear. The same panel's Sound tab holds the equalizer, crossfade, volume leveling and the sleep timer. Library has its pages as a row of chips over the full song table. Suits people who listen more than they browse.",
        shots: [
          ["b-now","Now playing","Cover, spectrum strip, lyrics, Up next"],
          ["b-library","Library","Pages as chips; the song table with formats"],
          ["b-now-800","At 800 px","Cover and the Sound tab: equalizer, crossfade, sleep"],
        ] },
      { id: "b", name: "Home", idea: "A Home page opens the app: albums and playlists to jump back into, new podcast episodes with how much is left, your radio stations with what's on air, and this month's most played. The sidebar keeps the library and playlists, with Up next at the top of Playlists. Podcasts gets a proper page: your shows across the top with New marks, then the chosen show with Play latest and its episodes, each with progress, Downloaded or a download button.",
        shots: [
          ["c-home","Home","Jump back in, new episodes, stations, most played"],
          ["c-podcasts","Podcasts","Shows with New marks; episodes with progress"],
        ] },
      { id: "c", name: "Column browser", idea: "For big libraries, the classic way: three columns, Genre, Artist and Album, narrow everything down, and the songs of whatever you pick fill the table below, with the album's cover, Play and Shuffle between them. One “Music” page replaces Songs, Albums, Artists and Genres; the sidebar keeps Recently added, played and most played, Folders, Radio, Podcasts and the playlists. Radio uses the same columns (Browse, Genre, Country) over a table of stations and what's on air. Suits people who know what they want to hear.",
        shots: [
          ["n1-library","Library","Genre, Artist and Album columns over the songs"],
          ["n1-radio","Radio","The same columns for stations, with what's on air"],
          ["n1-library-800","At 800 px","Rail; the columns stay, the table drops two columns"],
        ] },
      { id: "d", name: "Listening timeline", idea: "One column that reads like your listening: what played earlier, the song playing now (cover, lyrics, a spectrum in the progress line and the controls), then Up next, each with the time it will start. The sleep timer shows as a line in the queue where it will pause. There are no library pages to click through: one box at the top (Ctrl K) finds songs, albums, artists, stations and podcasts and plays, plays next or queues them, with the library's pages listed beside the results. Sound (equalizer, crossfade, leveling, sleep) sits on the right. Suits people who mostly put music on and let it run.",
        shots: [
          ["n2-now","What's playing","Earlier, now and up next with start times; the sleep timer in the queue"],
          ["n2-add","Ctrl K","Find anything; play, play next or add to the queue"],
          ["n2-now-800","At 800 px","One column; Sound moves behind the header button"],
        ] },
    ],
    icons: {
      pip: '<rect x="3" y="4.5" width="18" height="15" rx="2.5"/><rect x="11.5" y="11" width="7" height="6" rx="1.2" fill="currentColor" stroke="none"/>',
      grip: '<path d="M9 6h.01M15 6h.01M9 12h.01M15 12h.01M9 18h.01M15 18h.01" stroke-width="2.6"/>',
      bars: '<path d="M5 20v-6M9.5 20V8M14 20v-9M18.5 20V4"/>',
    },
    pages: {
      "a-albums": () => win({ hdr: hdrA(), side: sideA(), page: albums(), over: player() }),
      "a-album": () => win({ hdr: hdrA(), side: sideA(), page: album(), over: player() }),
      "b-now": () => win({ hdr: hdrB("Now playing"), side: "", page: nowB(), over: player({ queueOn: !NW(), eqOn: NW(), lyricsOn: !NW() }) }),
      "b-library": () => win({ hdr: hdrB("Library"), side: "", page: libraryB(), over: player() }),
      "c-home": () => win({ hdr: hdrA(), side: sideC(), page: home(), over: player() }),
      "c-podcasts": () => win({ hdr: hdrA({ q: "Search your music and podcasts" }), side: sideC("pods"), page: podcasts(), over: player() }),
      "n1-library": () => win({ hdr: hdrA(), side: sideN1(), page: n1Lib(), over: player() }),
      "n1-radio": () => win({ hdr: hdrA({ q: "Search stations by name" }), side: sideN1("radio"), page: n1Radio(), over: n1RadioBar() }),
      "n2-now": () => win({ hdr: hdrN2(), side: "", page: n2Page() }),
      "n2-add": () => win({ hdr: hdrN2(), side: "", page: n2Page(), over: n2Add() }),
    },
  });
})();
