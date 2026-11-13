// Nyx Torrents on the revamp page: today's problems and three options.
(() => {
  // [name, kind, size, pct, status, down, up, eta, ratio, category, seeds/peers]
  const T = [
    ["debian-13.2.0-amd64-DVD-1.iso", "disc", "3.7 GB", 64, "down", "8.4 MB/s", "220 KB/s", "4 min", "0.12", "Linux ISOs", "412 / 38"],
    ["Nosferatu (1922) restored 1080p", "film", "4.1 GB", 31, "down", "3.1 MB/s", "96 KB/s", "15 min", "0.03", "Public-domain films", "96 / 21"],
    ["fedora-workstation-43-x86_64.iso", "disc", "2.3 GB", 100, "seed", "", "1.2 MB/s", "", "2.41", "Linux ISOs", "188 / 12"],
    ["archlinux-2026.11.01-x86_64.iso", "disc", "1.4 GB", 100, "seed", "", "640 KB/s", "", "4.80", "Linux ISOs", "903 / 7"],
    ["The General (1926) Buster Keaton", "film", "2.8 GB", 100, "done", "", "", "", "1.02", "Public-domain films", ""],
    ["ubuntu-26.04-desktop-amd64.iso", "disc", "6.2 GB", 12, "paused", "", "", "", "0.00", "Linux ISOs", ""],
    ["Metropolis (1927) complete cut", "film", "7.9 GB", 0, "meta", "", "", "", "0.00", "Public-domain films", "0 / 3"],
    ["tails-amd64-7.2.img", "disc", "1.5 GB", 88, "error", "", "", "", "0.40", "Linux ISOs", ""],
    ["Pride and Prejudice, LibriVox audiobook", "music", "612 MB", 100, "seed", "", "88 KB/s", "", "1.76", "Audiobooks", "41 / 2"],
    ["linuxmint-23-cinnamon-64bit.iso", "disc", "2.9 GB", 100, "done", "", "", "", "1.33", "Linux ISOs", ""],
  ];
  const ST = {
    down: ["Downloading", "acc"], seed: ["Seeding", "ok"], done: ["Finished", ""], paused: ["Paused", "warn"],
    meta: ["Getting file list", ""], error: ["Folder missing", "red"],
  };
  const status = (s) => `<span class="tr-st ${ST[s][1]}">${ST[s][0]}</span>`;
  const fic = (k) => `<span class="tr-fic tr-${k}">${icon(k)}</span>`;
  const pcol = (p, s) => `<span class="tr-pc">${prog(p, s === "seed" || s === "done" ? "ok" : s === "paused" ? "warn" : s === "error" ? "bad" : "")}<b>${p}%</b></span>`;

  const hdr = (o = {}) => header({
    icon: "magnet", name: "Torrents",
    center: o.center !== undefined ? o.center : search(o.q || "Filter torrents", "Ctrl F"),
    end: `${o.noSpeed ? "" : `<span class="tr-rate wide-only">${icon("download")}11.5 MB/s<span class="sep"></span>${icon("upload")}2.2 MB/s</span>`}<button class="tr-slow ${o.slow ? "on" : ""}" title="Slow mode">${icon("turtle")}<span>Slow</span></button><button class="newbtn">${icon("plus")}<span>Add</span><span class="key">Ctrl O</span></button>`,
  });

  /* ── Option A: tidy list, details beside it ─────────────────────────── */
  const sideA = (on = "all") => `
    ${tiles([["down", "download", 2, "Downloading", "blue"], ["seed", "upload", 3, "Seeding", "green"], ["done", "check", 2, "Finished", "violet"], ["paused", "pause", 1, "Paused", "amber"]], on)}
    ${grp("Transfers", false, "", "accent")}
    ${navx("listic", "All torrents", { active: on === "all", cnt: 10 })}
    ${navx("refresh", "Active now", { cnt: 5 })}
    ${navx("alert", "Problems", { badge: 1 })}
    ${grp("Categories", false, icon("plus"), "green")}
    ${navx("", "Linux ISOs", { dot: "var(--sw-blue)", cnt: 6 })}
    ${navx("", "Public-domain films", { dot: "var(--sw-coral)", cnt: 3 })}
    ${navx("", "Audiobooks", { dot: "var(--sw-teal)", cnt: 1 })}
    ${grp("Tags", false, icon("plus"), "violet")}
    ${navx("tag", "64-bit", { cnt: 5 })}
    ${navx("tag", "restored", { cnt: 2 })}
    ${grp("Discover", false, "", "amber")}
    ${navx("search", "Search sites")}
    <div class="foot">${icon("shield", "ok")}<span>On wg0 · port open · 214 GB free</span></div>`;

  const rowsA = (sel = 0, cols = "a") => `<div class="tbl tr-tbl tr-${cols}">
    <div class="th"><span class="c-name">Name</span><span class="c-size">Size</span><span class="c-prog">Progress</span><span class="c-st">Status</span><span class="c-dn">Down</span><span class="c-eta">Time left</span><span class="c-ratio">Ratio</span></div>
    ${T.map(([n, k, sz, p, s, dn, up, eta, r], i) => `<div class="tr ${i === sel ? "sel" : ""}"><span class="c-name">${fic(k)}<span class="nm">${n}</span></span><span class="c-size">${sz}</span><span class="c-prog">${pcol(p, s)}</span><span class="c-st">${status(s)}</span><span class="c-dn">${dn || "–"}</span><span class="c-eta">${eta || "–"}</span><span class="c-ratio">${r}</span></div>`).join("")}
  </div>`;

  const selbar = (n = 1) => `<div class="tr-selbar">
    <span class="cnt">${n} selected</span>
    ${btn("Pause", "", "pause")}${btn("Move to…", "ghost", "folder")}${btn("Category", "ghost", "tag")}<span class="wide-only">${btn("Queue", "ghost", "sort")}</span>
    <span class="sp"></span>${btn("Columns", "ghost", "columns")}${btn("Remove", "dtext", "trash")}</div>`;

  const pieces = () => `<div class="tr-pieces">${Array.from({ length: 96 }, (_, i) => `<b class="${(i * 37) % 100 < 64 ? "have" : (i * 11) % 9 === 0 ? "part" : ""}"></b>`).join("")}</div>`;

  const inspA = (tab = "General") => `<div class="insp tr-insp">
    <div class="ihead"><div class="tr-ih">${fic("disc")}<div><b>debian-13.2.0-amd64-DVD-1.iso</b><span>Linux ISOs · 64-bit</span></div></div>
    <div class="tr-ip"><div class="r"><b>64%</b><span>2.4 of 3.7 GB · 4 min left</span></div>${prog(64)}</div>
    <div class="tr-itabs">${seg(["General", "Files", "Peers", "Trackers", "Speed"], tab)}</div></div>
    <div class="ibody">${tab === "Files" ? filesTab() : generalTab()}</div>
    <div class="ifoot">${btn("Pause", "primary", "pause")}${btn("Open folder", "", "folder")}<span style="flex:1"></span>${ib("more", "More")}</div>
  </div>`;

  const generalTab = () => `
    <div class="lab">Speed</div>
    <div class="card tr-spd"><div class="r"><span>${icon("download")}<b>8.4 MB/s</b></span><span>${icon("upload")}<b>220 KB/s</b></span></div>${spark([.2, .35, .5, .45, .62, .7, .66, .8, .74, .82, .9, .86, .84, .88], { w: 246, h: 40 })}</div>
    <div class="lab">Pieces</div>${pieces()}
    <div class="lab">Transfer</div>
    <div class="card">
      <div class="row"><span class="k">Seeds and peers</span><span class="v">412 · 38</span></div>
      <div class="row"><span class="k">Ratio</span><span class="v">0.12</span></div>
      <div class="row"><span class="k">Availability</span><span class="v">31.4</span></div>
      <div class="row"><span class="k">Added</span><span class="v">Today 19:42</span></div>
      <div class="row"><span class="k">Saved to</span><span class="v">~/Downloads/ISOs</span></div>
    </div>`;

  const filesTab = () => `
    <div class="lab">3 files · 3.7 GB<span class="act">Select all</span></div>
    <div class="card tr-files">
      ${[["debian-13.2.0-amd64-DVD-1.iso", "3.7 GB", 64, "Normal"], ["SHA256SUMS", "4 KB", 100, "High"], ["SHA256SUMS.sign", "1 KB", 100, "High"]].map(([n, s, p, pr]) => `<div class="row"><span class="cbx sq done">${icon("check")}</span><div class="tx"><b>${n}</b><span>${s} · ${p}%</span></div>${dd(pr)}</div>`).join("")}
    </div>
    <div class="lab">Options</div>
    <div class="card">
      <div class="row"><span class="k">Download in order</span>${sw(false)}</div>
      <div class="row"><span class="k">First and last pieces first</span>${sw(true)}</div>
      <div class="row"><span class="k">Speed limit</span><span class="v">None</span></div>
    </div>`;

  const pageA = (o = {}) => `${pbar2("All torrents", "10 · 2 downloading", seg(["All", "Active", "Finished"], "All"))}
    <div class="cols"><div class="main">${selbar()}<div class="scroll">${rowsA(0)}</div></div>${inspA(o.tab)}</div>`;

  const addDialog = () => `<div class="veil"><div class="dlg pop tr-add">
    <div class="h">Add torrent</div>
    <div class="tr-addname">${fic("film")}<div><b>Nosferatu (1922) restored 1080p</b><span>4.1 GB · 3 files · from a magnet link</span></div></div>
    <div class="tr-form">
      <label>Save to</label><div class="field">${icon("folder")}<span>~/Videos/Public domain</span><span style="flex:1"></span>${btn("Change…", "sm")}</div>
      <label>Category</label><div>${dd("Public-domain films")}</div>
      <label>Tags</label><div class="field"><span class="chip2">restored</span><span class="ph">Add a tag</span></div>
      <label>Folder</label><div>${seg(["Original", "Make a folder", "No folder"], "Original")}</div>
    </div>
    <div class="tr-addfiles">
      <div class="th"><span class="cbx sq done">${icon("check")}</span><b>Files</b><span class="sp"></span><span class="t">4.1 GB of 4.1 GB</span></div>
      ${[["Nosferatu.1922.1080p.mkv", "4.0 GB", "Normal"], ["Nosferatu.1922.en.srt", "86 KB", "Normal"], ["poster.jpg", "1.2 MB", "Skip"]].map(([n, s, p]) => `<div class="r"><span class="cbx sq ${p === "Skip" ? "" : "done"}">${p === "Skip" ? "" : icon("check")}</span><span class="n">${n}</span><span class="s">${s}</span>${dd(p)}</div>`).join("")}
    </div>
    <div class="tr-addopts"><span>${sw(false)} Start paused</span><span>${sw(true)} Download in order</span><span>${sw(false)} First and last pieces first</span><span>${sw(false)} Skip the check</span></div>
    <div class="bt">${btn("Cancel")}${btn("Add torrent", "primary", "download")}</div>
  </div></div>`;

  /* ── Option B: a downloads list, one pane ──────────────────────────── */
  const card = ([n, k, sz, p, s, dn, up, eta, r, cat, sp], i, o = {}) => {
    const line = s === "down" ? `<b>${dn}</b> · ${eta} left · ${sp.split(" / ")[1]} peers` : s === "seed" ? `Seeding at ${up} · ratio ${r}` : s === "done" ? `Finished · ratio ${r}` : s === "paused" ? `Paused at ${p}%` : s === "meta" ? "Getting the file list from 3 peers…" : "The folder ~/Downloads/USB is missing";
    const act = s === "down" || s === "seed" ? ib("pause", "Pause") : s === "paused" || s === "error" ? ib("play", "Resume") : "";
    const main = s === "done" || s === "seed" ? btn("Open", "", "external") : s === "error" ? btn("Choose folder…", "", "folder") : "";
    return `<div class="tr-card ${s} ${o.sel ? "sel" : ""}">${fic(k)}<div class="tx">
      <div class="r1"><b>${n}</b><span class="cat">${cat}</span></div>
      ${s === "down" || s === "paused" || s === "meta" || s === "error" ? `<div class="bar">${prog(p, s === "paused" ? "warn" : s === "error" ? "bad" : "")}</div>` : ""}
      <div class="r2"><span class="${s === "error" ? "err" : ""}">${line}</span><span class="sz">${s === "down" || s === "paused" ? `${(parseFloat(sz) * p / 100).toFixed(1)} of ` : ""}${sz}</span></div>
    </div><div class="acts">${main}${act}${ib("more", "More")}</div></div>`;
  };

  const strip = () => `<div class="tr-strip">
    <div class="tr-now"><div class="v"><span>${icon("download")}<b>11.5</b> MB/s</span><span class="up">${icon("upload")}<b>2.2</b> MB/s</span></div>${spark([.3, .32, .4, .38, .5, .55, .7, .62, .66, .8, .78, .9, .85, .88, .9, .86, .92, .88, .9, .94], { w: 240, h: 34 })}</div>
    <div class="tr-chips">${chip("All · 10", "on")}${chip("Active · 5")}${chip("Finished · 2")}${chip("Paused · 1")}${chip("Problems · 1", "red", "alert")}<span class="sp"></span>${chip("Linux ISOs", "", "tag")}${chip("Films", "", "tag")}${chip("Audiobooks", "", "tag")}</div>
  </div>`;

  const pageB = (o = {}) => `<div class="scroll tr-bscroll"><div class="clamp" style="--clamp: 860px">
    ${strip()}
    <div class="tr-sec">Downloading<span>3</span></div>
    ${[0, 1, 6].map((i) => card(T[i], i, { sel: o.sel === i })).join("")}
    <div class="tr-sec">Needs you<span>1</span></div>
    ${card(T[7], 7)}
    <div class="tr-sec">Seeding and finished<span>5</span></div>
    ${[2, 3, 8].map((i) => card(T[i], i, { sel: o.sel === i })).join("")}
  </div></div>
  <div class="tr-foot"><span>${icon("shield", "ok")} On wg0</span><span>Port 51413 open</span><span>214 GB free</span><span class="sp"></span><span>${icon("turtle")} Slow mode from 08:00 to 18:00 on weekdays</span></div>`;

  const hdrB = (o = {}) => hdr({ center: seg(["Downloads", "Search"], "Downloads"), ...o }).replace(ib("sidebar", "Sidebar (Ctrl+B)"), "");

  const menuB = () => menu(560, 186, [
    ["pause", "Pause", "Space"], ["play", "Force resume"], "-",
    ["folder", "Open folder"], ["folder", "Move to…"], ["rename", "Rename…"], ["turtle", "Limit speed…"], "-",
    ["tag", "Category", "›"], ["tag", "Tags", "›"], ["sort", "Queue", "›"], "-",
    ["refresh", "Check the files again"], ["radio", "Ask trackers for peers now"], ["copy", "Copy magnet link", "Ctrl C"], ["export", "Save .torrent file…"], "-",
    ["trash", "Remove…", "Delete", "danger"],
  ], 250);

  /* ── Option C: a home dashboard and search ─────────────────────────── */
  const sideC = (on) => `
    ${navx("home", "Home", { active: on === "home" })}
    ${navx("search", "Search", { active: on === "search" })}
    ${grp("Transfers", false, "", "accent")}
    ${navx("download", "Downloading", { cnt: 2 })}
    ${navx("upload", "Seeding", { cnt: 3 })}
    ${navx("check-c", "Finished", { cnt: 2 })}
    ${navx("pause", "Paused", { cnt: 1 })}
    ${navx("alert", "Problems", { badge: 1 })}
    ${grp("Saved searches", false, icon("plus"), "green")}
    ${navx("history", "debian dvd")}
    ${navx("history", "silent films 1920s")}
    ${navx("history", "librivox austen")}
    ${grp("Categories", false, icon("plus"), "violet")}
    ${navx("", "Linux ISOs", { dot: "var(--sw-blue)", cnt: 6 })}
    ${navx("", "Public-domain films", { dot: "var(--sw-coral)", cnt: 3 })}
    ${navx("", "Audiobooks", { dot: "var(--sw-teal)", cnt: 1 })}`;

  const homeC = () => `<div class="scroll tr-home"><div class="clamp" style="--clamp: 940px">
    <div class="tr-hello"><div><b>Downloading 2 · seeding 3</b><span>Everything's fine. Debian finishes in about 4 minutes.</span></div><span class="sp"></span>${btn("Pause all", "", "pause")}</div>
    <div class="cardgrid" style="--cw: 190px">
      <div class="kcard"><span class="k">${icon("download")}Down now</span><span class="v">11.5 MB/s</span><span class="s">No limit</span></div>
      <div class="kcard"><span class="k">${icon("upload")}Up now</span><span class="v">2.2 MB/s</span><span class="s">Limit 4 MB/s</span></div>
      <div class="kcard"><span class="k">${icon("repeat")}Shared this week</span><span class="v">38.6 GB</span><span class="s">Ratio 1.9 overall</span></div>
      <div class="kcard"><span class="k">${icon("drive")}Free space</span><span class="v">214 GB</span><span class="s">~/Downloads</span></div>
    </div>
    <div class="tr-graph card"><div class="gh"><b>Speed</b><span class="lg"><i class="d"></i>Down<i class="u"></i>Up</span><span class="sp"></span>${seg(["5 min", "1 hour", "Today"], "1 hour")}</div>
      <div class="gb">${bars([.2, .25, .3, .5, .62, .58, .7, .74, .4, .3, .35, .5, .66, .8, .86, .9, .84, .78, .82, .88, .92, .9, .86, .9], { h: 84, c: "var(--accent)", gap: 4 })}
      <div class="ov">${bars([.1, .12, .1, .2, .18, .2, .22, .25, .2, .16, .14, .2, .22, .26, .24, .3, .28, .26, .24, .3, .32, .3, .28, .3], { h: 84, c: "var(--sw-green)", gap: 4 })}</div></div></div>
    <div class="tr-two">
      <div><div class="sechead">Downloading now<span class="more">See all</span></div>
        ${[T[0], T[1]].map(([n, k, sz, p, s, dn, , eta]) => `<div class="tr-mini">${fic(k)}<div class="tx"><b>${n}</b>${prog(p)}<span>${dn} · ${eta} left</span></div>${ib("pause", "Pause")}</div>`).join("")}</div>
      <div><div class="sechead">Connection</div>
        <div class="card tr-conn">
          <div class="row">${icon("shield", "ok")}<span class="k">Bound to wg0 (your VPN)</span><span class="v ok">Up</span></div>
          <div class="row">${icon("globe")}<span class="k">Port 51413</span><span class="v ok">Open</span></div>
          <div class="row">${icon("network")}<span class="k">Peers found without trackers</span><span class="v">312 nodes</span></div>
          <div class="row">${icon("turtle")}<span class="k">Slow mode</span><span class="v">Weekdays 08:00–18:00</span></div>
        </div></div>
    </div>
    <div class="sechead">Finished recently<span class="more">See all</span></div>
    <div class="card tr-fin">${[T[4], T[9], T[8]].map(([n, k, sz, , , , , , r], i) => `<div class="row">${fic(k)}<span class="n">${n}</span><span class="m">${sz} · ratio ${r}</span><span class="m">${["Today 14:10", "Yesterday", "Mon"][i]}</span>${btn("Open", "sm", "external")}${ib("folder", "Show in folder")}</div>`).join("")}</div>
  </div></div>`;

  const RES = [
    ["debian-13.2.0-amd64-DVD-1.iso", "3.7 GB", 1840, 22, "OpenSeed", "2 days ago"],
    ["debian-13.2.0-amd64-netinst.iso", "754 MB", 1205, 9, "OpenSeed", "2 days ago"],
    ["debian-13.2.0-arm64-DVD-1.iso", "3.5 GB", 402, 6, "PublicTrack", "3 days ago"],
    ["debian-live-13.2.0-amd64-kde.iso", "3.4 GB", 288, 14, "OpenSeed", "3 days ago"],
    ["debian-live-13.2.0-amd64-gnome.iso", "3.2 GB", 260, 11, "LinuxTracker", "3 days ago"],
    ["debian-13.1.0-amd64-DVD-1.iso", "3.7 GB", 96, 2, "PublicTrack", "6 weeks ago"],
    ["debian-12.12.0-amd64-DVD-1.iso", "3.8 GB", 74, 1, "LinuxTracker", "3 months ago"],
    ["debian-13.2.0-i386-netinst.iso", "690 MB", 61, 0, "OpenSeed", "2 days ago"],
    ["debian-edu-13.2.0-amd64-BD-1.iso", "21.4 GB", 38, 3, "PublicTrack", "4 days ago"],
    ["debian-13.2.0-amd64-DLBD-1.iso", "46.1 GB", 22, 4, "LinuxTracker", "4 days ago"],
    ["debian-live-13.2.0-amd64-xfce.iso", "3.0 GB", 19, 1, "OpenSeed", "3 days ago"],
    ["debian-13.2.0-ppc64el-DVD-1.iso", "3.6 GB", 7, 0, "PublicTrack", "5 days ago"],
  ];
  const searchC = (o = {}) => `<div class="tr-search">
    <div class="tr-q"><div class="field focus big">${icon("search")}<span>debian dvd</span></div>${dd("Software")}${btn("Search", "primary")}</div>
    <div class="tr-plugins">${icon("puzzle")}<span>Searching 3 of 4 sites:</span>${chip("OpenSeed", "on", "check")}${chip("PublicTrack", "on", "check")}${chip("LinuxTracker", "on", "check")}${chip("ArchiveBay")}<span class="sp"></span><span class="lnk">Manage sites…</span></div>
    <div class="tr-rhead"><b>48 results</b><span class="hint">Most seeds first</span><span class="sp"></span><div class="field sm">${icon("filter")}<span class="ph">Filter results</span></div></div>
    <div class="scroll"><div class="tbl tr-rt">
      <div class="th"><span class="c-name">Name</span><span class="c-size">Size</span><span class="c-seed">Seeds</span><span class="c-lee">Leechers</span><span class="c-site">Site</span><span class="c-pub">Published</span><span class="c-add"></span></div>
      ${RES.map(([n, s, se, le, site, pub], i) => `<div class="tr ${i === 0 ? "sel" : ""}"><span class="c-name">${fic("disc")}<span class="nm">${n}</span></span><span class="c-size">${s}</span><span class="c-seed"><span class="sd ${se > 500 ? "hi" : se > 150 ? "mid" : ""}"></span>${se.toLocaleString("en")}</span><span class="c-lee">${le}</span><span class="c-site">${site}</span><span class="c-pub">${pub}</span><span class="c-add">${i === 0 ? btn("Add", "sm primary", "download") : ib("download", "Add")}</span></div>`).join("")}
    </div></div>
  </div>`;

  /* ── Option C: a queue board ────────────────────────────────────────── */
  const hdrN = (o = {}) => hdr(o).replace(ib("sidebar", "Sidebar (Ctrl+B)"), btn("Search sites", "ghost", "globe"));
  // A card on the board: i into T, and how its state reads in its column.
  const bcard = (i, o = {}) => {
    const [n, k, sz, p, s, dn, up, eta, r] = T[i];
    const line = o.line || (s === "down" ? `<b>${dn}</b> · ${eta} left` : s === "seed" ? `${up} up` : s === "done" ? `Ratio ${r}` : s === "paused" ? `Paused at ${p}%` : s === "meta" ? "Getting the file list…" : "Folder missing");
    const bar = o.bar !== undefined ? o.bar : p;
    return `<div class="tn1-card ${s} ${o.sel ? "sel" : ""} ${o.ghost ? "ghost" : ""} ${o.drag ? "drag" : ""}">
      <div class="r1">${o.q ? `<span class="q">${o.q}</span>` : ""}${fic(k)}<b>${n}</b></div>
      ${o.nobar ? "" : `<div class="bar">${prog(bar, o.barc || (s === "seed" || s === "done" ? "ok" : s === "paused" ? "warn" : s === "error" ? "bad" : ""))}</div>`}
      <div class="r2"><span class="${s === "error" ? "err" : ""}">${line}</span><span class="m">${o.meta || sz}</span></div>
      ${o.act ? `<div class="r3">${o.act}</div>` : ""}</div>`;
  };
  const bcol = (title, c, cnt, head, cards, o = {}) => `<div class="tn1-col ${o.cls || ""}" style="--cc:${swc(c)}">
    <div class="ch"><span class="dot"></span><b>${title}</b><span class="n">${cnt}</span><span class="sp"></span>${head}</div>
    <div class="cc">${cards.join("")}${o.foot || ""}</div></div>`;
  const board = (o = {}) => {
    const upNext = o.drag
      ? [`<div class="tn1-slot"></div>`, bcard(6, { q: "2", meta: "7.9 GB" })]
      : [bcard(6, { q: "1", meta: "7.9 GB" }), bcard(5, { q: "2" })];
    return `<div class="tn1-board">
      ${bcol("Up next", "amber", 2, `<span class="hint">Drag to reorder</span>`, upNext, { foot: `<div class="tn1-cap">${icon("sort")}Two run at once; the next starts when one finishes.</div><div class="tn1-add">${icon("download")}<span>Drop a .torrent file or magnet link here to queue it</span></div>` })}
      ${bcol("Downloading", "blue", 3, ib("pause", "Pause all"), [bcard(0, { sel: !o.drag }), bcard(1), bcard(7, { line: "The folder ~/Downloads/USB is missing", meta: "88%", act: `${btn("Choose folder…", "sm", "folder")}${ib("play", "Resume")}` })])}
      ${bcol("Seeding", "green", 3, `<span class="lnk">Limits</span>`, [bcard(2, { bar: 80, meta: "Ratio 2.41 of 3", line: "1.2 MB/s up" }), bcard(3, { bar: 96, meta: "Ratio 4.80 of 5", line: "640 KB/s up" }), bcard(8, { bar: 59, meta: "Ratio 1.76 of 3", line: "88 KB/s up" })])}
      ${NARROW ? `<div class="tn1-col shut" style="--cc:${swc("violet")}"><span class="dot"></span><b>Done</b><span class="n">2</span></div>`
        : bcol("Done", "violet", 2, `<span class="lnk">Clear</span>`, [bcard(4, { nobar: true, line: "Finished Mon · ratio 1.02", meta: "2.8 GB", act: `${btn("Open", "sm", "external")}${ib("folder", "Show in folder")}` }), bcard(9, { nobar: true, line: "Finished Sun · ratio 1.33", meta: "2.9 GB", act: `${btn("Open", "sm", "external")}${ib("folder", "Show in folder")}` })])}
    </div>`;
  };
  const sheet = () => `<div class="tn1-sheet">
    <div class="sh">${fic("disc")}<div class="tt"><b>debian-13.2.0-amd64-DVD-1.iso</b><span>Linux ISOs · ${chip("64-bit", "", "tag")}</span></div><span class="sp"></span>${seg(["General", "Files", "Peers", "Trackers", "Speed"], "General")}<span class="sp"></span>${btn("Pause", "", "pause")}${btn("Open folder", "ghost", "folder")}${ib("more", "More: move, rename, limit speed, queue, check again, copy magnet link, remove")}${ib("x", "Close")}</div>
    <div class="sb">
      <div class="c1"><div class="big"><b>64%</b><span>2.4 of 3.7 GB · 4 min left</span></div>${prog(64)}<div class="lab">Pieces</div>${pieces()}</div>
      <div class="c2 wide-only"><div class="lab"><span>${icon("download")}<b>8.4 MB/s</b></span><span>${icon("upload")}<b>220 KB/s</b></span></div>${spark([.2, .35, .5, .45, .62, .7, .66, .8, .74, .82, .9, .86, .84, .88, .9, .85, .92, .88], { w: 300, h: 70 }).replace("<svg ", '<svg preserveAspectRatio="none" style="width:100%;height:70px" ')}</div>
      <div class="c3">${[["Seeds and peers", "412 · 38"], ["Ratio", "0.12"], ["Availability", "31.4"], ["Saved to", "~/Downloads/ISOs"]].map(([k, v]) => `<div class="kv"><span>${k}</span><b>${v}</b></div>`).join("")}</div>
    </div></div>`;
  const pageN1 = (o = {}) => `<div class="tn1-bar">${chip("All · 10", "on")}${chip("Linux ISOs · 6", "", "")}${chip("Films · 3")}${chip("Audiobooks · 1")}${dd("Tags", "tag")}<span class="sp"></span><span class="tn1-conn">${icon("shield", "ok")}On wg0 · port open · 214 GB free</span></div>
    ${board(o)}${o.drag ? "" : sheet()}
    ${o.drag ? `<div class="tn1-ghostcard" style="left:${NARROW ? 30 : 40}px;top:104px">${bcard(5, { q: "1", drag: true })}</div>${toast("Drop it first in line, or on Downloading to start it now")}` : ""}`;

  /* ── Option D: a library ────────────────────────────────────────────── */
  const LIB = [
    ["Films", "film", [[4, "general3"], [1, "nosferatu1"], [6, "metropolis8"]]],
    ["Linux ISOs", "disc", [[0, "debian2"], [2, "fedora6"], [3, "arch4"], [5, "ubuntu9"], [7, "tails5"], [9, "mint7"]]],
    ["Audiobooks", "music", [[8, "pride1"]]],
  ];
  const tile = (i, seed, poster, sel) => {
    const [n, k, sz, p, s, dn, up, eta, r] = T[i];
    const tag = s === "down" ? `<span class="pc">${p}%</span>` : s === "paused" ? `<span class="pc w">${icon("pause")}Paused</span>` : s === "error" ? `<span class="pc r">${icon("alert")}Needs you</span>` : s === "meta" ? `<span class="pc">Starting</span>` : "";
    const line = s === "down" ? `${dn} · ${eta} left` : s === "seed" ? `Seeding · ratio ${r}` : s === "done" ? `${sz} · ready` : s === "paused" ? `${p}% of ${sz}` : s === "meta" ? "Getting the file list" : "Folder missing";
    return `<div class="tn2-tile ${poster ? "poster" : ""} ${sel ? "sel" : ""} ${s}">
      <div class="pic">${art(seed, { r: 10, ic: k })}${tag}${s !== "done" && s !== "seed" ? `<span class="pb"><b style="width:${p}%"></b></span>` : ""}</div>
      <b class="nm">${n}</b><span class="st"><i class="d"></i>${line}</span></div>`;
  };
  const panelN2 = (o = {}) => {
    const film = o.tab === "Transfer";
    const [n, k, sz, p] = T[film ? 1 : 0];
    const about = `<div class="lab">About</div><div class="card">
        <div class="row"><span class="k">Saved to</span><span class="v">~/Downloads/ISOs</span></div>
        <div class="row"><span class="k">Category</span>${dd("Linux ISOs")}</div>
        <div class="row"><span class="k">Tags</span><span class="v">${chip("64-bit")} <span class="add">Add</span></span></div>
        <div class="row"><span class="k">In the queue</span><span class="v">Running · 1 of 2</span></div>
        <div class="row"><span class="k">Added</span><span class="v">Today 19:42</span></div></div>
      <div class="lab">When it's done</div><div class="card">
        <div class="row"><span class="k">Keep sharing until</span>${dd("Ratio 2")}</div>
        <div class="row"><span class="k">Then</span>${dd("Stop")}</div></div>`;
    const transfer = `<div class="lab">Speed<span class="act">${icon("download")} 3.1 MB/s · ${icon("upload")} 96 KB/s</span></div><div class="card tn2-g">${spark([.3, .25, .4, .5, .45, .55, .5, .62, .58, .6, .7, .64, .66, .7], { w: 260, h: 36 }).replace("<svg ", '<svg preserveAspectRatio="none" style="width:100%;height:36px" ')}</div>
      <div class="lab">Pieces<span class="act tn2-io">In order ${sw(true)}</span></div><div class="tr-pieces">${Array.from({ length: 96 }, (_, i) => `<b class="${i < 30 ? "have" : i < 33 || i > 93 ? "part" : ""}"></b>`).join("")}</div>
      <div class="lab">Peers<span class="cnt">96 seeds · 21 peers</span><span class="act lnk">See all</span></div><div class="card">${[["qBittorrent 5.1", "1.2 MB/s"], ["Transmission 4.1", "840 KB/s"]].map(([x, y]) => `<div class="row"><span class="k">${x}</span><span class="v">${y}</span></div>`).join("")}</div>
      <div class="lab">Trackers<span class="cnt">2 of 3 working</span></div><div class="card">${[["tracker.openseed.example", "Working", "ok"], ["udp://tracker.public.example", "Working", "ok"], ["films.example.net", "Not answering", "bad"]].map(([x, y, c]) => `<div class="row"><span class="k">${x}</span><span class="v ${c}">${y}</span></div>`).join("")}</div>`;
    return `<div class="insp tn2-insp">
      <div class="tn2-hero">${art(film ? "nosferatu1" : "debian2", { r: 0, ic: k })}</div>
      <div class="ihead"><b class="tn2-t">${n}</b><span class="tn2-s">${film ? "Public-domain films" : "Linux ISOs"} · ${sz}</span>
        <div class="tr-ip"><div class="r"><b>${p}%</b><span>${film ? "1.3 of 4.1 GB · 15 min left" : "2.4 of 3.7 GB · 4 min left"}</span></div>${prog(p)}</div>
        <div class="tn2-acts">${btn("Pause", "primary", "pause")}${btn("Open folder", "", "folder")}<span class="sp"></span>${ib("more", "More: move, rename, limit speed, check again, copy magnet link, save .torrent, remove")}</div>
        <div class="tr-itabs">${seg(["About", "Files", "Transfer"], o.tab || "About")}</div></div>
      <div class="ibody">${film ? transfer : about}</div></div>`;
  };
  const pageN2 = (o = {}) => {
    const sel = o.tab === "Transfer" ? 1 : 0;
    return `<div class="tn2-bar">${seg(["Everything", "Films", "Linux ISOs", "Audiobooks"], "Everything")}${dd("Any state")}${dd("Newest first", "sort")}<span class="sp"></span><span class="tr-conn2">${icon("shield", "ok")}<span>On wg0 · port open · 214 GB free</span></span></div>
    <div class="cols"><div class="main"><div class="scroll tn2-grid">
      ${LIB.map(([cat, ic, items]) => `<div class="tn2-sec"><b>${cat}</b><span>${items.length}</span></div><div class="tn2-tiles ${cat === "Films" ? "posters" : ""}">${items.map(([i, seed]) => tile(i, seed, cat === "Films", i === sel)).join("")}</div>`).join("")}
    </div></div>${panelN2(o)}</div>`;
  };

  REG("torrents", {
    name: "Torrents",
    summary: "Torrents has a solid engine and every qBittorrent feature, but the window doesn't help you use them: a row of faint icons, a details pane that takes half the window even when nothing is selected, and eleven sidebar filters that all say 0.",
    problems: [
      "<b>A row of faint, bare icons:</b> magnet, resume, pause, remove and the queue arrows sit greyed out beside Add until something is selected, so the toolbar looks broken and nothing says what the icons do.",
      "<b>Two ways to filter:</b> a search button in the header and a “Filter by name” field just below it do the same thing.",
      "<b>Half the window is “Select a torrent”:</b> the details pane sits under the list whether or not anything is selected, and its tabs float on their own at the right.",
      "<b>Eleven filters, every one at 0:</b> All, Downloading, Seeding, Completed, Paused, Active, Inactive and Errored, plus Uncategorized and Untagged, all show even when they're empty, and Active and Inactive overlap the others.",
      "<b>The status line is tiny and crowded:</b> speeds, port, DHT nodes and free space run together in small grey text, and at 800 px they disappear entirely.",
      "<b>Search plugins are hard to find:</b> they're behind a puzzle icon, and the only way to manage them is a dialog.",
      "<b>At 800 px</b> the rail is twelve identical grey icons with no colour or break between sections.",
      "<b>The empty state is a sentence and two plain buttons</b> inside the table card, and the tip about dropping a file on the window is easy to miss.",
    ],
    today: [["torrents-1280", "Today at 1280 px", "Empty list, a half-height details pane"], ["torrents-800", "Today at 800 px", "Grey rail, faint toolbar"]],
    options: [
      { id: "a", name: "Downloads list", idea: "Like a browser's downloads page. One column of cards, grouped as Downloading, Needs you, and Seeding and finished, each with a big progress bar, a line in plain words and an Open button when it's done. The live speed and filter chips sit at the top, and the connection and slow mode at the foot. Search is the second tab in the header. Every action is still in each card's menu. Suits people who add a torrent now and then.",
        shots: [
          ["b-cards","Downloads","Cards grouped by what they need"],
          ["b-menu","A card's menu","Every action, in plain words"],
          ["b-cards-800","At 800 px","One column, same cards"],
        ] },
      { id: "b", name: "Home and search", idea: "A Home page answers “is it working?”: speeds, how much you've shared, free space, a speed graph, what's downloading, and whether the VPN, the port and peer finding are fine. Search gets its own page with the sites as chips you can switch on and off, and saved searches in the sidebar. The transfer filters stay below.",
        shots: [
          ["c-home","Home","Speeds, a graph and the connection's health"],
          ["c-search","Search","Sites as chips, results with Add"],
          ["c-search-800","Search at 800 px","Rail, fewer columns"],
        ] },
      { id: "c", name: "Queue board", idea: "Torrents as a board with a column for each stage: Up next, Downloading, Seeding and Done. Up next is the queue in order, and you drag a card to change its place or onto Downloading to start it now. Seeding cards fill up toward the ratio where they stop, and finished ones have Open. Select a card and its details (pieces, speed, files, peers, trackers) open in a sheet along the bottom. Categories and tags filter the whole board. Best if you queue a lot and want to see what runs next.",
        shots: [
          ["n1-board", "The board", "A column per stage; Debian open in the sheet below"],
          ["n1-drag", "Changing the queue", "Dragging Ubuntu ahead of Metropolis"],
          ["n1-board-800", "At 800 px", "Done folds into a strip; the sheet keeps the essentials"],
        ] },
      { id: "d", name: "Library", idea: "Shows what you've downloaded, not transfers: films as posters, ISOs and audiobooks as tiles, each with a bar while it downloads and a word when it needs you. Choose one and the panel opens with a progress bar, Pause and Open folder, then About (folder, category, tags, its place in the queue, when to stop sharing), Files, and Transfer for speed, pieces, peers and trackers. Search sites is a button at the top. Best if torrents are mostly how you get films and books.",
        shots: [
          ["n2-library", "Library", "Grouped by category; Debian open on the right"],
          ["n2-transfer", "A film's transfer", "Nosferatu: speed, pieces in order, peers and trackers"],
          ["n2-library-800", "At 800 px", "Three tiles a row, the panel narrower"],
        ] },
    ],
    pages: {
      "a-list": () => win({ hdr: hdr(), side: sideA(), page: pageA() }),
      "a-add": () => win({ hdr: hdr(), side: sideA(), page: pageA(), over: addDialog() }),
      "a-files": () => win({ hdr: hdr(), side: sideA(), page: pageA({ tab: "Files" }) }),
      "b-cards": () => win({ hdr: hdrB(), side: "", page: pageB() }),
      "b-menu": () => win({ hdr: hdrB(), side: "", page: pageB({ sel: 0 }), over: menuB() }),
      "n1-board": () => win({ hdr: hdrN(), side: "", page: pageN1() }),
      "n1-drag": () => win({ hdr: hdrN(), side: "", page: pageN1({ drag: true }) }),
      "n2-library": () => win({ hdr: hdrN({ q: "Filter your library" }), side: "", page: pageN2() }),
      "n2-transfer": () => win({ hdr: hdrN({ q: "Filter your library" }), side: "", page: pageN2({ tab: "Transfer" }) }),
      "c-home": () => win({ hdr: hdr({ center: search("Search sites for torrents", "Ctrl K") }), side: sideC("home"), page: homeC() }),
      "c-search": () => win({ hdr: hdr({ center: "" }), side: sideC("search"), page: searchC() }),
    },
    icons: {
      magnet: '<path d="M5.5 3.5h4v8a2.5 2.5 0 0 0 5 0v-8h4v8a6.5 6.5 0 0 1-13 0z"/><path d="M5.5 7.5h4M14.5 7.5h4"/>',
      turtle: '<path d="M3.5 15a7.5 6 0 0 1 15 0z"/><path d="M18.5 15h1.5a1.8 1.8 0 0 0 0-3.6h-1.6M6.5 15l-1 3M15.5 15l1 3M8 10.5l3 4.5 3-4.5"/>',
      upload: '<path d="M12 20.5v-11M7.5 14 12 9.5l4.5 4.5M5 4h14"/>',
      puzzle: '<path d="M9 5a2 2 0 1 1 4 0v1.5h4a1 1 0 0 1 1 1v4h-1.5a2 2 0 1 0 0 4H18v4a1 1 0 0 1-1 1h-4v-1.5a2 2 0 1 0-4 0V20H5a1 1 0 0 1-1-1v-4h1.5a2 2 0 1 0 0-4H4v-3.5a1 1 0 0 1 1-1h4z"/>',
    },
  });
})();
