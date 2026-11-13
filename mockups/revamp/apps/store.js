// Nyx Store on the revamp page: today's problems and three options.
(() => {
  // [name, summary, glyph, installed?]
  const ESS = [
    ["Firefox", "Fast, private web browser", "web", true],
    ["LibreOffice", "Office documents", "file-text"],
    ["KeePassXC", "Passwords in a file you own", "lock"],
    ["VLC", "Plays almost any video", "play", true],
    ["Signal", "Private messages and calls", "chat"],
    ["Obsidian", "Notes that link to each other", "spark"],
  ];
  const NYX = [["Nyx Mail", "mail", "violet"], ["Nyx Music", "music", "pink"], ["Nyx Photos", "image", "teal"], ["Nyx Weather", "sun", "blue"], ["Nyx Maps", "mapin", "green"]];
  const appic = (name, size = 40, glyph = "") => `<span class="appic" style="width:${size}px;height:${size}px;border-radius:${Math.round(size * 0.26)}px">${art("app" + name, { r: 0 })}${glyph ? icon(glyph) : `<b style="font-size:${Math.round(size * 0.42)}px">${name[0]}</b>`}</span>`;
  const nyxic = (glyph, c, size = 40) => `<span class="appic nyx" style="width:${size}px;height:${size}px;border-radius:${Math.round(size * 0.26)}px;--nc:var(--sw-${c})">${icon(glyph)}</span>`;
  const get = (installed, label) => installed ? `<button class="pill open">${label || "Open"}</button>` : `<button class="pill">${label || "Install"}</button>`;

  const hdr = (o = {}) => header({
    icon: "bag", name: "Store",
    start: o.start || "",
    center: o.center !== undefined ? o.center : search(o.q || "Search apps", "Ctrl F"),
    end: o.end || "",
  });

  /* ── Option A: a tidy store ───────────────────────────────────────────── */
  const sideA = (on = "home") => `
    ${navx("home", "Home", { active: on === "home" })}
    ${navx("nyxlogo", "Nyx apps", { cnt: 24 })}
    ${grp("Categories", false, "", "accent")}
    ${navx("palette", "Create", { cnt: 108, active: on === "create" })}
    ${navx("pen", "Work", { cnt: 366 })}
    ${navx("game", "Play", { cnt: 156 })}
    ${navx("terminal", "Develop", { cnt: 125 })}
    ${navx("grid", "All categories")}
    ${grp("This computer", false, "", "green")}
    ${navx("check-c", "Installed", { cnt: 64 })}
    ${navx("download", "Updates", { badge: 7, active: on === "updates" })}
    ${navx("server", "Sources")}
    <div class="foot">${icon("check-c", "ok")}<span>1,148 apps · checked 5 min ago</span></div>`;

  const hero = (narrow) => `<div class="hero">${art("blender-hero-3", { r: 0, cls: "hbg" })}<div class="hshade"></div>
    <div class="htx"><span class="kick">MAKE SOMETHING BIG</span><b>Blender</b><span class="d">Model, animate and render in 3D, from the first sketch to the final frame.</span><div class="hb">${btn("Install", "primary", "download")}<span class="src">Arch Linux · extra · free</span></div></div>
    <div class="dots3"><i class="on"></i><i></i><i></i></div>
    ${narrow ? "" : `<div class="hshot">${art("blender-ui", { r: 6, ic: "monitor" })}</div>`}</div>`;
  const appCard = ([n, s, g, inst]) => `<div class="acard">${appic(n, 44)}<div class="tx"><b>${n}</b><span>${s}</span></div>${get(inst)}</div>`;
  const homeA = (narrow) => `<div class="shome"><div class="clamp" style="--clamp: 1000px">
    ${hero(narrow)}
    <div class="sechead">${icon("star")}Everyday essentials<span class="more">See all</span></div>
    <div class="agrid">${ESS.slice(0, narrow ? 4 : 6).map(appCard).join("")}</div>
    <div class="sechead">${icon("nyxlogo")}Made for NyxOS<span class="more">See all 24</span></div>
    <div class="nrow">${NYX.slice(0, narrow ? 4 : 5).map(([n, g, c], i) => `<div class="ncard2">${nyxic(g, c, 52)}<b>${n.replace("Nyx ", "")}</b>${get(i === 0 || i === 3)}</div>`).join("")}</div>
    <div class="sechead">${icon("archive")}Bundles<span class="more">Install a whole set in one go</span></div>
    <div class="bgrid">${[["Photo studio", "Darktable, GIMP and Inkscape", 3, ["Darktable", "GIMP", "Inkscape"]], ["Home office", "LibreOffice, Thunderbird and Okular", 3, ["LibreOffice", "Thunderbird", "Okular"]]].slice(0, narrow ? 1 : 2).map(([t, d, n, apps]) => `<div class="bcard"><div class="bics">${apps.map((a) => appic(a, 30)).join("")}</div><div class="tx"><b>${t}</b><span>${d}</span></div>${get(false, `Install ${n}`)}</div>`).join("")}</div>
  </div></div>`;

  const appPage = () => `<div class="apage"><div class="clamp" style="--clamp: 900px">
    <div class="back">${icon("chev-l")}Create</div>
    <div class="ahead">${appic("Krita", 88)}<div class="tx"><b>Krita</b><span class="by">KDE community · Painting and drawing</span><div class="tags">${chip("Arch Linux · extra", "acc", "server")}${chip("Free · GPL-3.0")}${chip("Installs for everyone", "", "users")}</div></div><div class="act">${btn("Install", "primary big", "download")}<span class="note">Asks for your password</span></div></div>
    <div class="shots">${[0, 1, 2].map((i) => `<div class="shot2">${art("krita-shot" + i, { r: 8, ic: i === 0 ? "image" : "" })}</div>`).join("")}</div>
    <div class="acols">
      <div class="desc"><p>A whole studio of brushes and one blank canvas. Krita is a painting app made by artists: sketch, ink, colour and animate, with stabilisers for steady lines, brush engines that feel like paper, and layers that behave the way you expect.</p><p>It opens Photoshop files and saves its own, so nothing you paint is locked in.</p></div>
      <div class="card info">${[["Version", "5.2.9"], ["Download", "112 MB"], ["Package", "krita"], ["Website", '<span class="lnk">krita.org</span>']].map(([k, v]) => `<div class="row"><span class="k">${k}</span><span class="v">${v}</span></div>`).join("")}
        <div class="row term"><span class="k">From a terminal</span><span class="v mono">sudo pacman -S krita</span>${ib("copy", "Copy the command")}</div></div>
    </div>
  </div></div>`;

  /* ── Option B: tabs across the top ─────────────────────────────────────── */
  const tabsB = (on, narrow) => `<div class="stabs2">${[["Discover", "compass"], ["Categories", "grid"], ["Your apps", "check-c"], ["Updates", "download", 7], ["Sources", "server"]].map(([t, i, n]) => `<button class="${t === on ? "on" : ""}">${icon(i)}<span>${t}</span>${n ? `<span class="b">${n}</span>` : ""}</button>`).join("")}</div>`;
  const hdrB = (on) => hdr({ center: tabsB(on), end: search("Search apps", "Ctrl F") }).replace('<div class="hdr-start">' + ib("sidebar", "Sidebar (Ctrl+B)"), '<div class="hdr-start">');
  const CATS = [["Create", "palette", "pink", 108], ["Work", "pen", "amber", 366], ["Play", "game", "violet", 156], ["Develop", "terminal", "teal", 125], ["Internet", "web", "blue", 142], ["Audio & video", "music", "coral", 97]];
  const discover = () => `<div class="shome"><div class="clamp" style="--clamp: 1040px">
    <div class="feat3">
      <div class="fbig">${art("krita-hero-9", { r: 0, cls: "hbg" })}<div class="hshade"></div><div class="htx"><span class="kick">A CANVAS WITHOUT LIMITS</span><b>Krita</b><span class="d">A whole studio of brushes. One blank canvas.</span><div class="hb">${btn("Install", "primary", "download")}</div></div></div>
      <div class="fside">${[["OBS Studio", "Turn your screen into a studio"], ["Godot", "Make the game you always wanted"]].map(([n, d]) => `<div class="fsm">${art("fs" + n, { r: 0, cls: "hbg" })}<div class="hshade"></div><div class="htx">${appic(n, 34)}<div><b>${n}</b><span>${d}</span></div></div></div>`).join("")}</div>
    </div>
    <div class="cgrid">${CATS.map(([t, i, c, n]) => `<div class="ccard" style="--cc:var(--sw-${c})"><span class="ci">${icon(i)}</span><div><b>${t}</b><span>${n} apps</span></div></div>`).join("")}</div>
    <div class="sechead">Everyday essentials<span class="more">See all</span></div>
    <div class="agrid">${ESS.map(appCard).join("")}</div>
    <div class="sechead">Made for NyxOS<span class="more">See all 24</span></div>
    <div class="agrid">${NYX.slice(0, 3).map(([n, g, c], i) => `<div class="acard">${nyxic(g, c, 44)}<div class="tx"><b>${n}</b><span>${["Every account in one inbox", "Your library and radio", "Albums, people and places"][i]}</span></div>${get(i === 0)}</div>`).join("")}</div>
  </div></div>`;

  const UPD = [
    ["Firefox", "Web browser", "144.0.2", "145.0", "Arch Linux", "68 MB"],
    ["Signal", "Messages", "7.71", "7.73", "Arch Linux", "120 MB"],
    ["Obsidian", "Notes", "1.9.12", "1.10.2", "Arch Linux", "104 MB"],
    ["Omarchy", "Desktop", "3.2.1", "3.2.2", "Omarchy", "2 MB"],
    ["Steam", "Games", "1.0.0.84", "1.0.0.85", "Arch Linux", "4 MB"],
  ];
  const updates = (o = {}) => `<div class="supd"><div class="clamp" style="--clamp: 860px">
    <div class="ucard"><span class="ui">${icon("download")}</span><div class="tx"><b>7 updates are ready</b><span>5 apps (with 41 system packages they need) and 2 community rebuilds · 412 MB. You'll see every change before anything is installed.</span></div>${btn("Review and update", "primary")}</div>
    <div class="sechead">Apps<span class="more">Last updated 3 days ago</span></div>
    <div class="card ulist">${UPD.map(([n, k, a, b, src, sz]) => `<div class="urow">${appic(n, 34)}<div class="tx"><b>${n}</b><span>${k} · ${src}</span></div><span class="ver">${a}<i>${icon("chev-r")}</i><b>${b}</b></span><span class="sz">${sz}</span></div>`).join("")}</div>
    <div class="sechead">Built from community recipes (AUR)</div>
    <div class="card"><div class="opt">${appic("Zen", 30)}<div class="opt-text"><div>Zen Browser <span class="dim2">1.16 → 1.17</span></div><div class="d">Rebuilt on this computer from a recipe you review first.</div></div>${btn("Review build…", "sm")}</div>
      <div class="opt">${appic("Spotify", 30)}<div class="opt-text"><div>Spotify <span class="dim2">1.2.70 → 1.2.74</span></div><div class="d">Repository packages it needs are updated first.</div></div>${btn("Review build…", "sm")}</div></div>
    <div class="note2">${icon("shield")}<span>Updates keep each app's original source. 38 apps installed before Store need their source confirmed once. <b>Confirm sources…</b></span></div>
  </div></div>`;

  const review = () => dialog("Review the changes", "Nothing is installed until you apply. Omarchy and Arch Linux packages are signed; Store checked every signature.", [btn("Not now"), btn("Apply 46 changes", "primary")],
    `<div class="rv">
      <div class="rvh">${seg(["Apps · 5", "System · 41", "Removed · 0"], "Apps · 5")}<span class="sp"></span><span class="tot">412 MB</span></div>
      ${tbl([["Package"], ["Installed", "92px"], ["New", "92px"], ["From", "100px"]], [["firefox", "144.0.2", "<b>145.0</b>", "Arch Linux"], ["signal-desktop", "7.71", "<b>7.73</b>", "Arch Linux"], ["obsidian", "1.9.12", "<b>1.10.2</b>", "Arch Linux"], ["omarchy", "3.2.1", "<b>3.2.2</b>", "Omarchy"], ["steam", "1.0.0.84", "<b>1.0.0.85</b>", "Arch Linux"]])}
      <div class="rvn">${icon("info")}<span>Also updates 41 libraries and system packages these need, such as <b>mesa</b>, <b>nss</b> and <b>gtk4</b>. Asks for your password once.</span></div>
    </div>`, 620);

  /* ── Option C: search with details beside it ──────────────────────────── */
  const RES = [
    ["Darktable", "Develop and edit raw photos", "Arch Linux", false],
    ["GIMP", "Edit and retouch images", "Arch Linux", true],
    ["digiKam", "Organise a large photo library", "Arch Linux", false],
    ["Shotwell", "Simple photo manager", "Arch Linux", false],
    ["RawTherapee", "Raw photo processing", "Arch Linux", false],
    ["Photoprism", "Photos in your browser, self-hosted", "AUR", false],
    ["Pinta", "Easy drawing and editing", "AUR", false],
  ];
  const sideC = (on = "search") => `
    ${navx("home", "Home")}
    ${navx("search", "Search", { active: on === "search" })}
    ${grp("Categories", false, "", "accent")}
    ${navx("palette", "Create")}
    ${navx("pen", "Work")}
    ${navx("game", "Play")}
    ${navx("terminal", "Develop")}
    ${grp("This computer", false, "", "green")}
    ${navx("check-c", "Installed", { cnt: 64 })}
    ${navx("download", "Updates", { badge: 7 })}
    ${navx("server", "Sources", { active: on === "sources" })}`;
  const searchC = (narrow) => `<div class="cols"><div class="list sres">
    <div class="sfil">${chip("All", "on")}${chip("Omarchy")}${chip("Arch")}${chip("AUR")}</div>
    <div class="sinc"><span>Include packages</span><span class="d">Libraries and command-line tools</span>${sw(false)}</div>
    <div class="scroll">${RES.map(([n, s, src, inst], i) => `<div class="srow ${i === 0 ? "sel" : ""}">${appic(n, 36)}<div class="tx"><b>${n}</b><span>${s}</span></div><span class="src2 ${src === "AUR" ? "aur" : ""}">${inst ? "Installed" : src}</span></div>`).join("")}</div></div>
    <div class="main sdet"><div class="dpad">
      <div class="ahead sm">${appic("Darktable", 64)}<div class="tx"><b>Darktable</b><span class="by">Develop and edit raw photos</span></div><div class="act">${btn("Install", "primary", "download")}</div></div>
      <div class="tags">${chip("Arch Linux · extra", "acc", "server")}${chip("Free · GPL-3.0")}${narrow ? "" : chip("Installs for everyone", "", "users")}</div>
      <div class="shots one">${art("darktable-ui-2", { r: 8, ic: "image" })}</div>
      <p class="dsc">A virtual lighttable and darkroom: manage your raw photos in a database, look through them, and develop them non-destructively with more than sixty modules.</p>
      <div class="card info">${[["Version", "5.2.1"], ["Download", "38 MB"], ["Package", "darktable"], ["Website", '<span class="lnk">darktable.org</span>']].map(([k, v]) => `<div class="row"><span class="k">${k}</span><span class="v">${v}</span></div>`).join("")}</div>
    </div></div></div>`;

  const sources = () => `<div class="ssrc"><div class="clamp" style="--clamp: 780px">
    <div class="ph2"><b>Sources</b><span>Where apps come from. Omarchy always comes first; updates keep each app's original source.</span></div>
    ${setcard("Built in", [
      [`<span class="sh">${icon("star", "si2")}Omarchy</span>`, "The preferred source for Omarchy apps and packages.", chip("First", "acc")],
      [`<span class="sh">${icon("server", "si2")}Arch Linux</span>`, "Core, extra and multilib.", sw(true)],
      [`<span class="sh">${icon("pkgbox", "si2")}AUR</span>`, "Community recipes, reviewed by you and built on this computer.", sw(true)],
    ])}
    ${setcard("More sources", [
      [`<span class="sh">${icon("shield", "si2")}BlackArch</span>`, "Security and research tools. Sets itself up: checks the signing key and adds only the keyring.", btn("Set up…", "sm")],
      [`<span class="sh">${icon("server", "si2")}chaotic-aur</span>`, "Off · its apps keep their source but stop updating.", `${sw(false)}${btn("Manage", "sm ghost")}`],
    ])}
    <div class="addrow">${btn("Add a source…", "", "plus")}<span>Signed packages and a trusted key are required.</span></div>
    ${setcard("Update protection", [["Apps installed before Store", "38 apps need their source confirmed once so updates come from the right place.", btn("Review…", "sm")]])}
  </div></div>`;

  REG("store", {
    name: "Store",
    summary: "Store browses Omarchy, Arch and AUR apps, installs and removes them, and reviews every change before it happens, but its Home is half taken by one screenshot, its install buttons are unlabelled squares, and updates and sources are easy to miss.",
    problems: [
      "<b>A screenshot takes half the window:</b> the featured app fills the top of Home at both sizes, so the first row of apps sits below the fold.",
      "<b>Unlabelled square buttons:</b> each app in a shelf has a small blue square with a download arrow or a play triangle; nothing says Install or Open.",
      "<b>Long, cut-off summaries:</b> “Word processor part of the Libre…”, “VLC media player, the open-sou…” come from package metadata and are clipped mid-word.",
      "<b>Updates have no count:</b> the sidebar's Updates row looks like the others even when updates are waiting; the only status is “1148 apps · 59 installed · Omarchy first” in small type in the header.",
      "<b>“Repositories” among everyday pages:</b> a technical word, next to Home and Categories, for a page most people never need.",
      "<b>App details open in a dialog</b> over the page, with the facts (license, package, scope, terminal command) as rows of text.",
      "<b>At 800 px</b> the sidebar is five unlabelled icons and the category cards are cramped into one row.",
    ],
    today: [["store-1280", "Today at 1280 px", "A big featured screenshot; square buttons"], ["store-800", "Today at 800 px", "The screenshot still fills the top"]],
    options: [
      { id: "a", name: "A tidy store", idea: "The same sidebar, sorted out: Home and Nyx apps, the four categories under a coloured heading, then This computer with Installed, Updates (with a count) and Sources. The featured app is a short banner with its Install button, and every app has a labelled Install or Open pill. An app opens as its own page with screenshots, where it comes from and who it installs for, and the terminal command to copy.",
        shots: [["a-home", "Home", "A short banner, labelled pills, Nyx apps, bundles"], ["a-app", "An app", "A page instead of a dialog"], ["a-home-800", "At 800 px", "Rail with coloured bars; no screenshot"]] },
      { id: "b", name: "Tabs across the top", idea: "No sidebar: Discover, Categories, Your apps, Updates and Sources as tabs in the header, with the update count on its tab, and the page centred under them. Discover is editorial (one large feature, two smaller ones, the categories as coloured tiles). Updates is one card with everything waiting, the apps with old and new versions, AUR rebuilds on their own, and the full review before anything installs.",
        shots: [["b-discover", "Discover", "Features, categories, essentials"], ["b-updates", "Updates", "One card, the apps, AUR rebuilds"], ["b-review", "Reviewing an update", "Every change, by kind, before applying"]] },
      { id: "c", name: "Search and details", idea: "For people who know what they want. Search leads: results on the left with where each comes from (Omarchy, Arch, AUR, or Installed), filters for the source and a switch to include libraries and tools; the app's details stay open on the right, so you can step through results. Sources becomes a settings-style page with switches, BlackArch's one-click setup, and the one-time source check for older installs.",
        shots: [["c-search", "Search", "Results with sources; details beside them"], ["c-sources", "Sources", "Switches, BlackArch, update protection"], ["c-search-800", "At 800 px", "Rail, results and details"]] },
    ],
    icons: {
      bag: '<path d="M5 8h14l-1 12.5H6z"/><path d="M9 10V6.5a3 3 0 0 1 6 0V10"/>',
      nyxlogo: '<path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a6.8 6.8 0 0 0 10.5 10.5z"/><path d="m16.5 3 .8 1.9 1.9.8-1.9.8-.8 1.9-.8-1.9-1.9-.8 1.9-.8z"/>',
      game: '<rect x="2.5" y="7" width="19" height="11" rx="5"/><path d="M7.5 10.5v4M5.5 12.5h4M15.5 11.5h.01M17.5 13.5h.01" stroke-width="1.9"/>',
      pkgbox: '<path d="m12 3 8.5 4.5v9L12 21l-8.5-4.5v-9z"/><path d="m3.5 7.5 8.5 4.5 8.5-4.5M12 12v9"/>',
    },
    pages: {
      "a-home": () => win({ hdr: hdr({ q: "Search apps and AUR" }), side: sideA("home"), page: homeA(NARROW) }),
      "a-app": () => win({ hdr: hdr({ q: "Search apps and AUR" }), side: sideA("create"), page: appPage() }),
      "b-discover": () => win({ hdr: hdrB("Discover"), side: "", page: discover() }),
      "b-updates": () => win({ hdr: hdrB("Updates"), side: "", page: updates() }),
      "b-review": () => win({ hdr: hdrB("Updates"), side: "", page: updates(), over: review() }),
      "c-search": () => railed(win({ hdr: hdr({ center: `<div class="search wide focus">${icon("search")}<span class="q">photo</span><span class="key">7 results</span></div>` }), side: sideC("search"), page: searchC(NARROW) })),
      "c-sources": () => railed(win({ hdr: hdr({ q: "Search apps and AUR" }), side: sideC("sources"), page: sources() })),
    },
  });
})();
