// System › Nyx apps: the look every Nyx app shares, and installing, updating and removing the
// apps. Style B: controls on the left, the apps (or one app) on the right.
(() => {
  const S = "system";
  const P = ["system", "Nyx apps", "The look every Nyx app shares, and the apps themselves."];
  const page = (body) => () => swin({ sec: P[0], page: P[1], desc: P[2], body: body() });

  /* ── Sample data: [id, name, icon, colour, what it is, version, update to] ── */
  const APPS = [
    ["settings", "Settings", "cog", "red", "A control panel for Omarchy", "0.9.4", ""],
    ["contacts", "Contacts", "users", "blue", "Contacts, favorites and lists", "1.3.0", ""],
    ["music", "Music", "music", "pink", "Your library, radio and podcasts", "1.8.0", "1.8.1"],
    ["pdf", "PDF", "file-text", "coral", "Read, fill in and mark up PDFs", "0.9.2", "0.10.0"],
    ["weather", "Weather", "sun", "amber", "Forecasts, hourly conditions and alerts", "1.2.0", "1.2.1"],
    ["passwords", "Passwords", "lock", "green", "Your password vault", "0.6.1", ""],
    ["git", "Git", "code", "violet", "Repositories and working changes", "0.4.0", ""],
    ["notepad", "Notepad", "pen", "teal", "Plain text, with tabs", "1.1.2", ""],
    ["photos", "Photos", "image", "green", "A photo gallery and editor", "0.7.0", ""],
    ["activity", "Activity", "pulse", "teal", "Processes, usage and startup apps", "0.5.3", ""],
    ["fonts", "Fonts", "tag", "graphite", "Google Fonts and Nerd Fonts", "0.3.1", ""],
    ["archive", "Archive", "archive", "amber", "Open and make archives", "0.2.0", ""],
  ];
  const MORE = [
    ["store", "Store", "store", "violet", "Discover, install and update apps"],
    ["torrents", "Torrents", "download", "blue", "A BitTorrent client"],
    ["media", "Media Player", "film", "red", "Movies and TV shows"],
    ["chat", "Chat", "chat", "teal", "Chat with models on Ollama"],
    ["office", "Office", "file", "blue", "Write, Sheets and Present"],
  ];

  /* ── Small parts ─────────────────────────────────────────────────── */
  const aic = (ic, c, cls = "") => `<span class="nx-ic ${cls}" style="--c:var(--sw-${c})">${icon(ic)}</span>`;
  const look = (o = {}) => ocard(o.head === undefined ? "Look" : o.head, [
    orow("Follow the Omarchy theme", "Its colours, and change when it does", sw(true), { ic: "palette", sec: S }),
    orow("Theme when not following", "", `<span class="dd nx-dis">Nyx Dark${icon("chev-d")}</span>`, { ic: "moon", sec: S }),
    orow("Density", "", seg(["Comfortable", "Compact"], o.compact ? "Compact" : "Comfortable"), { ic: "list", sec: S }),
    orow("Text size", "", sl(o.text || 40, `${o.textv || 100}%`, 110), { ic: "tag", sec: S }),
    orow("Open on", "", seg(["Start page", "Last page"], "Start page"), { ic: "window", sec: S }),
  ], { cls: "icons nx-look", note: o.note, first: o.first });

  /* ═══ A: the look, on a real app ═════════════════════════════════════ */
  const aCtl = () => `
    ${look({ first: true, note: "Every Nyx app follows these at once" })}
    ${ocard("", [
      nrow("Apps", "12 installed, 5 more to install", "3 updates", { ic: "nyxapp", sec: S }),
      nrow("Apps with their own theme", "Set on Appearance › App themes", "Music, Photos", { ic: "palette", sec: S }),
    ], { cls: "icons" })}`;

  const PEOPLE = [["Sam Rivera", "Design · Lumen"], ["Alex Kim", "Brother"], ["Priya Shah", "Book club"], ["Jordan Lee", "Climbing"], ["Maya Chen", "Work"], ["Leo Martin", "Neighbour"], ["Nora Fischer", "Work"], ["Omar Haddad", "Football"], ["Ines Duarte", "Family"], ["Theo Novak", "Studio"]];
  const appWin = (compact) => `<div class="nx-win ${compact ? "compact" : ""}">
      <div class="nx-wh">${aic("users", "blue", "xs")}<b>Contacts</b><span class="nx-ws">${icon("search")}Search</span></div>
      <div class="nx-wb">
        <div class="nx-wside">${[["users", "All", 248, true], ["star", "Favorites", 12], ["heart", "Family", 9], ["tag", "Work", 31], ["calendar", "Birthdays", 4]].map(([ic, n, c, on]) => `<div class="${on ? "on" : ""}">${icon(ic)}<span>${n}</span><small>${c}</small></div>`).join("")}</div>
        <div class="nx-wlist">${PEOPLE.slice(0, compact ? 10 : 7).map(([n, d], i) => `<div class="${i === 0 ? "on" : ""}">${av(n, compact ? 22 : 28)}<div><b>${n}</b><span>${d}</span></div></div>`).join("")}</div>
        <div class="nx-wdet">${av("Sam Rivera", 52)}<b>Sam Rivera</b><span>Design lead at Lumen</span><div class="nx-wf"><small>Phone</small><span>+1 555 0142</span><small>Email</small><span>sam@example.com</span><small>Birthday</small><span>March 14</span></div></div>
      </div>
    </div>`;

  const aPv = () => `
    ${pvhead("How Nyx apps look", "Contacts, with the Omarchy theme, comfortable, at 100%", seg(["Contacts", "Music", "Notepad"], "Contacts"))}
    ${appWin(false)}
    <div class="nx-cmp">
      <div class="nx-ct on"><b>Comfortable</b><span>7 people fit in this window</span></div>
      <div class="nx-ct"><b>Compact</b><span>10 people fit</span></div>
      <div class="nx-ct"><b>Your own theme for one app</b><span class="lnk">Appearance › App themes ${icon("chev-r")}</span></div>
    </div>`;

  /* ═══ B: the apps, with versions and what's new ══════════════════════ */
  const appRow = ([id, n, ic, c, d, v, up], sel) => `<div class="opt nx-row ${sel ? "picked" : ""}">${aic(ic, c)}<div class="opt-text"><div>${n}</div><div class="d">${up ? `${v} → <b class="nx-new">${up}</b>` : v}</div></div>${up ? '<span class="nx-dot"></span>' : ""}</div>`;
  const bCtl = () => `
    <div class="ubar card"><span class="lic" style="--tc:var(--accent)">${icon("download")}</span><div class="opt-text"><div><b>3 updates</b> · Music, PDF, Weather</div><div class="d">About 4 minutes to build</div></div>${btn("Update all", "primary sm")}</div>
    <div class="gtitle gflex">Installed<span class="sp"></span><span class="note">12</span></div>
    <div class="card nx-grid2">${APPS.map((a) => appRow(a, a[0] === "music")).join("")}</div>
    ${ocard("", [nrow("5 more to install", "Store, Torrents, Media Player, Chat, Office", "", { ic: "plus", sec: S }), nrow("Look", "Follows Omarchy · comfortable · 100%", "", { ic: "palette", sec: S })], { cls: "icons" })}`;

  const bPv = () => `
    <div class="nx-hero card">${aic("music", "pink", "lg")}<div class="nx-ht"><b>Music</b><span>Your music library, radio and podcasts</span><div class="nx-meta">${chip("1.8.0 installed")}${chip("1.8.1 ready", "acc")}</div></div><div class="nx-hb">${btn("Update", "primary", "download")}${btn("Open", "", "external")}</div></div>
    <div class="notes card"><div class="nh">New in 1.8.1 · released yesterday</div><ul>${["Podcasts remember where you stopped on every episode, not just the last one.", "The queue keeps its order when you shuffle an album into it.", "Radio stations show the song that's playing.", "Fixes: album art in the mini player, and gapless playback after a pause."].map((x) => `<li>${x}</li>`).join("")}</ul></div>
    <div class="nx-facts card">${[["Installed", "October 2"], ["Last updated", "3 weeks ago"], ["On disk", "38 MB"], ["Updating takes", "About 1 minute"]].map(([k, v]) => `<div><small>${k}</small><span>${v}</span></div>`).join("")}</div>
    ${ocard("", [orow("Remove Music", "Your library and playlists stay in your Music folder", btn("Remove…", "sm"), { ic: "trash", sec: S })], { cls: "icons" })}
    ${pvfoot("Apps build from source on this computer; a terminal shows the progress.", "info")}`;

  /* ═══ C: every app as a tile ═════════════════════════════════════════ */
  const cCtl = () => `
    <div class="ubar card"><span class="lic" style="--tc:var(--accent)">${icon("download")}</span><div class="opt-text"><div><b>3 updates</b> ready</div><div class="d">Music, PDF and Weather</div></div>${btn("Update all", "primary sm")}</div>
    ${look({ head: "Every app's look", text: 40 })}
    ${ocard("", [nrow("Apps with their own theme", "Set on Appearance › App themes", "2", { ic: "palette", sec: S })], { cls: "icons" })}`;
  const tile = ([id, n, ic, c, d, v, up], inst, sel) => `<div class="nx-tile ${inst ? "" : "out"} ${sel ? "sel" : ""}">${aic(ic, c, "md")}${up ? '<span class="nx-badge">1</span>' : ""}<b>${n}</b><small>${inst ? (up ? `${up} ready` : v) : "Not installed"}</small></div>`;
  const cPv = () => `
    ${pvhead("Nyx apps", "12 installed · click one for its details", seg(["All 17", "Installed", "Not installed"], "All 17"))}
    <div class="nx-tiles">${APPS.map((a) => tile(a, true, false)).join("")}${MORE.map((a) => tile(a, false, a[0] === "torrents")).join("")}</div>
    <div class="nx-pop card">${aic("download", "blue", "md")}<div class="opt-text"><b>Torrents</b><span>A BitTorrent client: magnet links, a queue, and limits for when you're on a metered network.</span></div><div class="nx-pb"><small>Builds in about 3 minutes</small>${btn("Install", "primary sm", "plus")}</div></div>
    ${pvfoot("Apps build from source on this computer; a terminal shows the progress.", "info")}`;

  REG("nyx", {
    name: "Nyx apps",
    icons: {},
    summary: "Nyx apps is two cards: Look (follow the Omarchy theme, system theme, density, text size, where apps open) and Apps, seventeen rows of a name, a line on what it is, and Installed with Remove, or Install. Update every app is a row at the very end.",
    problems: [
      "<b>The look has no picture:</b> density, text size and the theme change every Nyx app, but the page shows only a dropdown, a two-way switch and a slider reading “100 %”.",
      "<b>No versions, no updates:</b> the app rows never say which version you have or that one is waiting; “Update every app” is the last row, under seventeen others.",
      "<b>Remove is red on every installed app,</b> twelve bright buttons in a column, more prominent than anything else on the page.",
      "<b>A greyed-out theme dropdown</b> sits under Follow Omarchy theme with nothing saying it only applies when you turn that off.",
      "<b>Installed and not installed are mixed</b> in one list in a fixed order, so the five you could add are scattered between the twelve you have.",
      "<b>Explanations sit above both cards</b> and wrap at 800 px (“Give one app its own theme under Appearance → App themes.”).",
    ],
    today: [["nyx-1280", "Today", ""], ["nyx-800", "Today at 800 px", ""]],
    options: [
      { id: "a", name: "The look, on a real app",
        idea: "The page is about the look first. The left column has the five look settings with icons; the right shows an actual Nyx app (Contacts, Music or Notepad) drawn with them, so switching to Compact or 110% text changes the picture, with how many rows fit at each density. The apps are one row under the settings that opens their own page.",
        shots: [["a-look", "Contacts with your look", "Following Omarchy, comfortable, 100%"], ["a-look-800", "At 800 px", "The app above the settings"]] },
      { id: "b", name: "Apps with versions and what's new",
        idea: "The page is about the apps. Updates sit on top with Update all; below, the installed apps in two columns, each with its version and a dot when an update is ready. The selected app fills the right side: what's new in its update, when it was installed, how long updating takes, and Update, Open and Remove. The look and the apps you could add are rows at the end.",
        shots: [["b-apps", "Music selected", "1.8.1 is ready; what's new in it"]] },
      { id: "c", name: "Every app as a tile",
        idea: "All seventeen apps as tiles on the right, installed ones bright with their version and an update badge, the others dimmed. Clicking one opens a card under the tiles to install, update or remove it. The left column keeps updates and the look, so the page covers both without sub-pages.",
        shots: [["c-tiles", "All 17 apps", "Torrents selected, ready to install"]] },
    ],
    pages: {
      "a-look": page(() => split(aCtl(), aPv(), { sec: S })),
      "b-apps": page(() => split(bCtl(), bPv(), { sec: S, ctlw: 460 })),
      "c-tiles": page(() => split(cCtl(), cPv(), { sec: S })),
    },
  });
})();
