// Nyx Theater on the revamp page: today's problems and three options.
(() => {
  const NW = () => typeof NARROW !== "undefined" && NARROW;
  const MOVIES = [
    ["The Cartographer", 2025], ["Glass Mountain", 2026], ["Harbor Lights", 2024], ["Night Shift", 2023], ["Paper Moon Rising", 2022],
    ["Small Hours", 2025], ["Signal Lost", 2024], ["Bright Water", 2021], ["Echo Valley", 2023], ["Iron Orchard", 2020],
    ["Last Train to Avalon", 2019], ["The Long Field", 2022], ["Copperhead", 2024], ["Winter Garden", 2021], ["Saint Elmo's Fire Brigade", 2018],
    ["Lowland", 2025], ["The Quiet Year", 2023], ["Red Kite", 2020], ["Sea of Lamps", 2024], ["Northern Line", 2022], ["Fable", 2021],
  ];
  const SHOWS = [["Saltwater", "S2 · E5", 62], ["The Night Desk", "S1 · E3", 30], ["Kingfisher", "S4 · E1", 12], ["Northbound", "S1 · E8", 81], ["Under the Lamps", "S3 · E2", 45]];
  const poster = (t, o = {}) => `<div class="th-po ${o.cls || ""}">${art(t, { w: "100%", h: "100%", r: 8, cls: `th-p${hash(t) % 6}`, label: `<em>${t}</em>` })}${o.watched ? `<span class="wd">${icon("check")}</span>` : ""}${o.prog ? `<span class="pg"><b style="width:${o.prog}%"></b></span>` : ""}</div>`;
  const back = (t, o = {}) => art(t + " still", { w: "100%", h: "100%", r: o.r ?? 8, cls: `th-b${hash(t) % 4}` });

  const servers = () => `<div class="th-srv">
    <div class="r">${icon("server")}<span>Plex</span><em>Living room</em><i class="ok"></i></div>
    <div class="r">${icon("server")}<span>Jellyfin</span><em>NAS</em><i class="ok"></i></div>
    <div class="f">${icon("check-c")}<span>Up to date · 2,418 titles</span>${ib("refresh", "Refresh libraries")}</div></div>`;

  /* ── Option A: tidy home ───────────────────────────────────────────── */
  const sideA = (on = "home", o = {}) => `
    ${grp("Watch", true, "", "accent")}
    ${navx("home", "Home", { active: on === "home" })}
    ${navx("compass", "Discover", { active: on === "discover" })}
    ${grp("Library", false, "", "green")}
    ${navx("film", "Movies", { cnt: "1,204", active: on === "movies" })}
    ${navx("tv", "TV shows", { cnt: 186 })}
    ${navx("layers", "Collections", { cnt: 42 })}
    ${o.views ? `${grp("Saved views", false, icon("plus"), "amber")}
    ${navx("filter", "Unwatched 4K", { cnt: 38, active: on === "view" })}
    ${navx("filter", "Short comedies", { cnt: 52 })}
    ${navx("filter", "Kids, under 100 min", { cnt: 61 })}` : ""}
    ${grp("Playlists", false, icon("plus"), "violet")}
    ${navx("listic", "Friday movie night", { cnt: 8 })}
    ${navx("listic", "Holiday classics", { cnt: 12, sub: "Plex" })}
    ${o.views ? "" : navx("listic", "Kids' favourites", { cnt: 14 })}
    ${servers()}`;
  const hdrA = (o = {}) => header({ icon: "film", name: "Theater", center: search(NW() ? "Search both servers" : "Search movies and shows", "Ctrl F"), end: `${o.end || ""}${btn("Open video", "ghost", "folder")}` });

  const hero = (o = {}) => `<div class="th-hero">${back("Glass Mountain", { r: 12 })}<div class="sh"></div>
    <div class="tx"><span class="k">New this week · on Plex and Jellyfin</span><h1>Glass Mountain</h1><span class="m">2026 · 1 h 58 min · Adventure · PG-13 · ${icon("star")}8.1</span>
      ${o.short ? "" : `<p>Two sisters cross a frozen range to bring their father's last letter home, and find the mountain remembers him too.</p>`}
      <div class="bt">${btn("Play", "primary", "play")}${btn("Details", "", "info")}${NW() ? "" : btn("Add to playlist", "ghost", "plus")}</div></div>
    <div class="dots"><b></b><i></i><i></i><i></i></div></div>`;
  const row = (title, items, o = {}) => `<div class="th-row"><div class="rh"><b>${title}</b>${o.sub ? `<span>${o.sub}</span>` : ""}<span class="sp"></span>${o.more ? `<a>${o.more}</a>` : ""}${ib("chev-l")}${ib("chev-r")}</div><div class="ri ${o.wide ? "wide" : ""}">${items}</div></div>`;
  const cw = () => SHOWS.slice(0, NW() ? 3 : 4).map(([t, e, p], i) => `<div class="th-cw">${back(t)}<span class="pg"><b style="width:${p}%"></b></span><span class="play">${icon("play")}</span><div class="ct"><b>${t}</b><span>${e} · ${Math.round((100 - p) * 0.5)} min left</span></div></div>`).join("");
  const posters = (from, n, o = {}) => MOVIES.slice(from, from + n).map(([t, y], i) => `<div class="th-pc">${poster(t, { watched: o.w && i === 2, both: i % 3 === 0 })}<b>${t}</b><span>${y}</span></div>`).join("");
  const homeA = () => `<div class="main th-home"><div class="scroll"><div class="pad">
    ${hero({ short: NW() })}
    ${row("Continue watching", cw(), { wide: true, sub: "4 in progress" })}
    ${row("Recently added movies", posters(2, NW() ? 5 : 7), { more: "All movies" })}
  </div></div></div>`;

  const details = () => `<div class="main th-det"><div class="scroll">
    <div class="bk">${back("The Cartographer", { r: 0 })}<div class="sh"></div></div>
    <div class="in">
      <div class="top">${poster("The Cartographer", { cls: "big" })}
        <div class="tx"><h1>The Cartographer</h1><span class="m">2025 · 2 h 11 min · PG-13 · Drama, Mystery</span>
          <div class="rt"><span class="rc imdb">IMDb <b>7.8</b></span><span class="rc rt">${icon("tomato")}<b>91%</b></span><span class="rc mc"><b>74</b> Metacritic</span><span class="rc you">${icon("star")}<b>Your rating</b> 4</span></div>
          <div class="bt">${btn("Play", "primary", "play")}${btn("Trailer", "", "film")}${btn("Mark watched", "", "check")}${btn("Add to playlist", "ghost", "plus")}${ib("more", "Play from start, copy title, refresh details")}</div>
          <div class="src">${icon("monitor")}<span><b>4K HDR · Dolby Atmos</b> from Plex · plays directly</span><span class="sp"></span>${dd("2 versions")}</div>
        </div></div>
      <p class="syn">A mapmaker hired to chart a valley before it's flooded finds that the oldest maps in the town hall don't match the land, and that someone has been redrawing them for forty years.</p>
      <div class="lab">Cast and crew</div>
      <div class="cast">${[["Ines Moreau", "Ada Lind"], ["Tomas Reyes", "Mayor Hale"], ["June Park", "Clara"], ["Owen Stiles", "The surveyor"], ["Bea Kwan", "Director"], ["Sami Haddad", "Writer"]].map(([n, r]) => `<div class="pp">${av(n, 52)}<b>${n}</b><span>${r}</span></div>`).join("")}</div>
      <div class="lab">More like this</div>
      <div class="ri">${posters(7, 7)}</div>
    </div></div></div>`;

  /* ── Option B: library browser ─────────────────────────────────────── */
  const gridB = (o = {}) => {
    const n = NW() ? 16 : 18;
    return `<div class="th-grid">${MOVIES.slice(0, n).map(([t, y], i) => `<div class="th-pc ${i === 1 ? "sel" : ""}">${poster(t, { watched: [3, 7, 10].includes(i), prog: i === 5 ? 40 : 0, both: i % 4 === 0 })}<b>${t}</b><span>${y}</span></div>`).join("")}</div>`;
  };
  const fbar = () => `<div class="th-fbar">${chip("Unwatched", "on")}${chip("Drama, Mystery", "on")}${chip("2020 – 2026", "on")}<span class="add">${icon("plus")}Filter</span><span class="sp"></span>${NW() ? "" : `<span class="srcs">${chip("Plex", "acc", "server")}${chip("Jellyfin", "acc", "server")}</span>`}${btn("Save view", "ghost sm", "bookmark")}</div>`;
  const drawer = () => `<div class="insp th-drw">
    <div class="bk">${back("Glass Mountain", { r: 10 })}</div>
    <div class="ibody">
      <h2>Glass Mountain</h2><span class="m">2026 · 1 h 58 min · PG-13</span>
      <div class="rt"><span class="rc imdb">IMDb <b>8.1</b></span><span class="rc rt">${icon("tomato")}<b>94%</b></span></div>
      <div class="bt">${btn("Play", "primary", "play")}${btn("Details", "", "info")}</div>
      <p>Two sisters cross a frozen range to bring their father's last letter home, and find the mountain remembers him too.</p>
      <div class="card kv">${[["On", "Plex and Jellyfin"], ["Best copy", "4K HDR · Atmos"], ["Plays", "Directly"], ["Collection", "Mountain films"]].map(([k, v]) => `<div class="row"><span class="k">${k}</span><span class="v">${v}</span></div>`).join("")}</div>
    </div></div>`;
  const pbarB = () => pbar2("Movies", "214 of 1,204", `${dd("Recently added", "sort")}${NW() ? "" : seg(["S", "M", "L"], "M")}<div class="seg icons">${`<button class="on">${icon("grid")}</button><button>${icon("list")}</button>`}</div>`);
  const pageB = (o = {}) => `<div class="main">${pbarB()}${fbar()}<div class="cols"><div class="main"><div class="scroll">${gridB()}</div></div>${NW() ? "" : drawer()}</div>${o.filters ? filterPop() : ""}</div>`;
  const filterPop = () => `<div class="th-fpop pop">
    <div class="fl">${["Watch state", "Genre", "Release year", "Runtime", "Ratings", "Certification", "Source and library", "Format", "Languages", "Edition", "People", "Studio", "Collection"].map((f, i) => `<div class="fi ${i === 1 ? "on" : ""}">${f}${[0, 1, 2].includes(i) ? `<span class="d"></span>` : ""}</div>`).join("")}</div>
    <div class="fr"><div class="field">${icon("search")}<span class="ph">Find a genre</span></div>
      <div class="opts">${[["Drama", 412, true], ["Mystery", 98, true], ["Comedy", 301], ["Adventure", 188], ["Animation", 76], ["Documentary", 64], ["Family", 120], ["Horror", 91], ["Science fiction", 133], ["Thriller", 207]].map(([g, n, on]) => `<div class="op"><span class="cbx sq ${on ? "done" : ""}">${on ? icon("check") : ""}</span><span>${g}</span><em>${n}</em></div>`).join("")}</div>
      <div class="ff">${btn("Clear all", "ghost")}<span class="sp"></span>${btn("Show 214 movies", "primary")}</div></div>
  </div>`;

  /* ── Option C: lean back ───────────────────────────────────────────── */
  const hdrC = (on = "Home") => header({ icon: "film", name: "Theater", center: seg(NW() ? ["Home", "Discover", "Movies", "TV", "More"] : ["Home", "Discover", "Movies", "TV shows", "Collections", "Playlists"], on), end: `${ib("search", "Search (Ctrl+F)")}${ib("folder", "Open video (Ctrl+O)")}` });
  const homeC = () => `<div class="main th-lean"><div class="scroll">
    <div class="th-big">${back("Saltwater", { r: 0 })}<div class="sh"></div>
      <div class="tx"><span class="k">${icon("history")}Pick up where you left off</span><h1>Saltwater</h1><span class="m">Season 2 · Episode 5 · “The Tide Line” · 18 min left</span>
        <span class="pg"><b style="width:62%"></b></span>
        <div class="bt">${btn("Resume", "primary", "play")}${btn("From the start", "", "repeat")}${btn("All episodes", "ghost", "listic")}</div></div>
      <div class="dots"><b></b><i></i><i></i><i></i><i></i></div></div>
    <div class="pad">
      ${row("Up next", SHOWS.slice(1, NW() ? 4 : 5).map(([t, e, p]) => `<div class="th-cw">${back(t)}<span class="pg"><b style="width:${p}%"></b></span><div class="ct"><b>${t}</b><span>${e}</span></div></div>`).join(""), { wide: true })}
      ${row("Because you watched The Cartographer", posters(9, NW() ? 5 : 8), { more: "Discover" })}
    </div></div></div>`;
  const player = () => `<div class="th-play">${back("Saltwater", { r: 0 })}
    <div class="top">${btn("Back to Saltwater", "ghost", "chev-l")}<span class="sp"></span>${chip("Direct Play · 1080p", "", "check-c")}</div>
    <div class="trk pop">
      <div class="col"><div class="h">Audio</div>${[["English · 5.1", true], ["English · Commentary", false], ["Spanish · Stereo", false]].map(([t, on]) => `<div class="o ${on ? "on" : ""}">${on ? icon("check") : "<i></i>"}<span>${t}</span></div>`).join("")}</div>
      <div class="col"><div class="h">Subtitles</div>${[["Off", false], ["English", true], ["English · for the deaf", false], ["Spanish", false]].map(([t, on]) => `<div class="o ${on ? "on" : ""}">${on ? icon("check") : "<i></i>"}<span>${t}</span></div>`).join("")}</div>
    </div>
    <div class="nx pop">${back("Saltwater e6", { r: 8 })}<div class="tx"><span class="k">Next episode in 8 s</span><b>E6 · The Breakwater</b><div class="bt">${btn("Play now", "primary sm", "play")}${btn("Don't play it", "sm")}</div></div></div>
    <div class="bar">
      <div class="pos"><span>41:12</span><span class="tr"><b style="width:88%"></b>${[18, 36, 55, 72].map((c) => `<i style="left:${c}%"></i>`).join("")}</span><span>46:50</span></div>
      <div class="ctl">${ib("back10", "Back 10 s")}<button class="pp">${icon("pause")}</button>${ib("fwd10", "Forward 10 s")}<span class="vol">${icon("volume")}<span class="tr"><b style="width:70%"></b></span></span><span class="sp"></span>
        <span class="lb on">${icon("subs")}Audio and subtitles</span><span class="lb">${icon("listic")}Chapters</span><span class="lb">1×</span>${ib("expand", "Full screen (F)")}</div>
    </div></div>`;

  REG("theater", {
    name: "Theater",
    summary: "Theater looks the part, with big art and both servers in one library, but its home page is half hero, the hero repeats the first Continue Watching card, and the sidebar is six plain rows over a long empty gap with the sync status squeezed into its foot.",
    problems: [
      "<b>The hero takes half the window</b> and shows the same title as the first Continue Watching card under it; at 800 px it fills the screen and the rows below are cut off.",
      "<b>Continue watching doesn't say how far you got:</b> no progress bars, an episode count in a corner, and an unexplained tick on one poster.",
      "<b>Posters run off the edge</b> with no arrows to scroll the row, so the last one is simply cut in half.",
      "<b>A flat sidebar:</b> six rows with no groups, Discover drawn with the same magnifier as search, no counts for Movies or TV, and a long empty column below.",
      "<b>Servers are invisible:</b> nothing says Plex or Jellyfin is connected; “Loading Plex libraries · 8645 titles” is squeezed into the sidebar foot.",
      "<b>Bare header icons:</b> Open video is a folder and Refresh an arrow, beside the Settings button; the subtitle repeats “Home”.",
      "<b>The hero offers only Resume</b> and an ⓘ, with no Play from start or a way to the episodes.",
    ],
    today: [["theater-1280", "Today at 1280 px", "Home with the hero"], ["theater-800", "Today at 800 px", "The hero fills the window"]],
    options: [
      { id: "a", name: "Tidy home", idea: "The same app, calmer. The sidebar groups Watch, Library (with counts) and Playlists, and its foot shows both servers with a green dot, the title count and Refresh. Home's hero is a third shorter and shows something new rather than repeating a row; Continue watching becomes wide stills with a progress bar and the time left; every row gets arrows. Details puts Play, Trailer, Mark watched and Add to playlist in words, the ratings as small badges, which copy will play, the cast and more like it.",
        shots: [["a-home", "Home", "Shorter hero; progress on Continue watching; servers in the sidebar"], ["a-details", "A movie", "Ratings, labelled actions, the copy that plays, cast"], ["a-home-800", "At 800 px", "Rail with coloured bars; the hero shrinks"]] },
      { id: "b", name: "Library browser", idea: "For people with big libraries who know what they're looking for. Movies and TV are a poster grid with the filters as chips across the top (Unwatched, genres, years, + Filter), the servers as chips you can switch off, sort, poster size and grid or list. Saved views live in the sidebar. Clicking a poster opens a drawer with the essentials and Play, without leaving the grid. + Filter opens every filter Theater has in one panel, with counts and a “Show 214 movies” button.",
        shots: [["b-movies", "Movies", "Filter chips, saved views, the info drawer"], ["b-filters", "Filters", "Every filter in one panel, with counts"], ["b-movies-800", "At 800 px", "Rail; four posters across; the drawer opens over"]] },
      { id: "c", name: "Lean back", idea: "Made for the couch: no sidebar, the six places as tabs in the header, and a full-width hero that picks up what you were watching, with Resume, From the start and All episodes. Rows of stills and posters under it. The player keeps everything in words at the foot (Audio and subtitles, Chapters, speed), marks chapters on the progress bar, and counts down to the next episode in a card you can play now or stop.",
        shots: [["c-home", "Home", "Header tabs; a hero that resumes"], ["c-player", "Playing", "Audio and subtitles; next-episode countdown; chapters"], ["c-home-800", "At 800 px", "Tabs shorten; the hero stays readable"]] },
    ],
    icons: {
      pip: '<rect x="3" y="4.5" width="18" height="15" rx="2.5"/><rect x="11.5" y="11" width="7" height="6" rx="1.2" fill="currentColor" stroke="none"/>',
      tomato: '<circle cx="12" cy="13.5" r="7.5"/><path d="M9 5.5c1 .8 2 1.2 3 1.2s2-.4 3-1.2M12 6.5V3.5"/>',
      subs: '<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M7 13h4M13 13h4M7 16h7"/>',
      back10: '<path d="M4 12a8 8 0 1 0 2.5-5.8"/><path d="M4 4v4.5h4.5"/><path d="M10 10v5M13 10h2.5v5H13z" stroke-width="1.4"/>',
      fwd10: '<path d="M20 12a8 8 0 1 1-2.5-5.8"/><path d="M20 4v4.5h-4.5"/><path d="M9 10v5M12 10h2.5v5H12z" stroke-width="1.4"/>',
    },
    pages: {
      "a-home": () => win({ hdr: hdrA(), side: sideA(), page: homeA() }),
      "a-details": () => win({ hdr: hdrA(), side: sideA("movies"), page: details() }),
      "b-movies": () => win({ hdr: hdrA(), side: sideA("movies", { views: true }), page: pageB() }),
      "b-filters": () => win({ hdr: hdrA(), side: sideA("movies", { views: true }), page: pageB({ filters: true }) }),
      "c-home": () => win({ hdr: hdrC(), side: "", page: homeC() }),
      "c-player": () => win({ hdr: header({ icon: "film", name: "Theater", center: `<div class="doc"><b>Saltwater</b><span class="dim">Season 2 · Episode 5 · The Tide Line</span></div>`, end: ib("pip", "Mini player") }), side: "", page: player() }),
    },
  });
})();
