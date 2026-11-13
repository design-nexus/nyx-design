// Nyx Photos (and its Photo Viewer) on the revamp page: today's problems and three options.
(() => {
  // Photos drawn in CSS (photos.css): ph("sea", 1.5) is a 3:2 seaside photo.
  const ph = (k, o = {}) => `<div class="ph pp-${k} ${o.cls || ""}" style="${o.ar ? `flex:${o.ar} 1 0;` : ""}${o.hue ? `--hue:${o.hue}deg;` : ""}">${o.fav ? `<span class="fav">${icon("star")}</span>` : ""}${o.dur ? `<span class="vd">${icon("play")}${o.dur}</span>` : ""}${o.sel !== undefined ? `<span class="pick ${o.sel ? "on" : ""}">${o.sel ? icon("check") : ""}</span>` : ""}${o.inner || ""}</div>`;

  const DAYS = [
    ["Saturday 8 November", "11 photos", [
      [["harbor", { ar: 1.5, fav: true, sel: true }], ["tram", { ar: 0.75 }], ["tiles", { ar: 1 }], ["sunset", { ar: 1.5 }]],
      [["food", { ar: 1 }], ["street", { ar: 0.75, dur: "0:24" }], ["sea", { ar: 1.78 }], ["portrait", { ar: 0.8 }]],
    ]],
    ["Tuesday 4 November", "6 photos", [
      [["garden", { ar: 1.33 }], ["flower", { ar: 1, fav: true }], ["garden", { ar: 0.75, hue: 40 }], ["snow", { ar: 1.5, hue: 0 }]],
    ]],
    ["Sunday 26 October", "14 photos", [
      [["forest", { ar: 1.5 }], ["lake", { ar: 1.33 }], ["forest", { ar: 0.75, hue: 30 }], ["dusk", { ar: 1 }]],
    ]],
  ];
  const timeline = (o = {}) => DAYS.map(([d, n, rows], gi) => `<div class="day"><div class="dh"><b>${d}</b><span>${n}</span></div>${rows.map((r) => `<div class="jrow">${r.map(([k, x]) => {
    const on = o.picked ? gi === 0 && o.picked.includes(k) : !!x.sel;
    return ph(k, { ...x, sel: o.picked ? on : on || undefined, cls: on ? "selp" : "" });
  }).join("")}</div>`).join("")}</div>`).join("");

  const scrubber = () => `<div class="scrub"><span class="on">Nov</span><span>Oct</span><span>Sep</span><span>Aug</span><span>Jul</span><span>Jun</span><span class="yr">2025</span><span>Dec</span><span>Oct</span><span class="yr">2024</span><i class="mark" style="top:14px"></i></div>`;

  const ALBUMS = [["Lisbon trip", 86, "harbor"], ["Garden 2026", 41, "garden"], ["Recipes", 23, "food"], ["Kids' drawings", 58, "tiles"]];

  /* ── Option A: the timeline, tidied ─────────────────────────────────── */
  const hdrA = (o = {}) => header({ icon: "image", name: "Photos", center: search("Search by name, date, camera or kind", "Ctrl F"), end: `${ib("info", "Photo info (I)", o.info ? "on" : "")}${ib("more", "More (F10)")}` });

  const sideA = () => `
    ${tiles([["all", "image", "2,418", "All photos", "coral"], ["fav", "star", 46, "Favorites", "amber"], ["recent", "clock", 124, "Recent", "blue"], ["vid", "video", 38, "Videos", "violet"]], "all")}
    ${grp("Library", false, "", "accent")}
    ${navx("camera", "Photos", { cnt: "2,040" })}
    ${navx("screenshot", "Screenshots", { cnt: 340 })}
    ${navx("folder", "Folders", { cnt: 6 })}
    ${grp("Tidy up", false, "", "amber")}
    ${navx("copy", "Possible duplicates", { cnt: 12 })}
    ${grp("Albums", false, icon("plus"), "violet")}
    ${ALBUMS.map(([n, c, k]) => `<div class="navx"><i class="acov pp-${k}"></i><span>${n}</span><span class="cnt">${c}</span></div>`).join("")}
    <div class="foot">${icon("check-c", "ok")}<span>Up to date · watching 2 folders</span></div>`;

  const selbar = (n, o = {}) => `<div class="selbar"><span class="selc">${icon("check")}${n} selected</span>
    ${btn("Favorite", "", "star")}${btn("Add to album", "", "album")}${n === 1 ? btn("Edit", "", "pen") : ""}${btn("Rotate", "", "rotate")}${ib("more", "Copy, rename, export, set as background, slideshow, show in Files")}
    <span class="sp"></span>${o.narrow ? ib("trash", "Move to trash (Delete)", "dang") : btn("Move to trash", "dtext", "trash")}${ib("x", "Deselect (Esc)")}</div>`;

  const footA = () => `<div class="gfoot"><span>2,418 photos · 38 videos</span><span class="sp"></span><span class="lbl">Group by</span>${seg(["Years", "Months", "Days", "All"], "Days")}<div class="seg icons">${`<button class="on" title="Rows that keep each photo's shape">${icon("rows")}</button><button title="Squares">${icon("grid")}</button>`}</div><span class="zoom">${icon("image", "zs")}<span class="vtr"><b style="width:46%"></b></span>${icon("image", "zl")}</span></div>`;

  const infoA = () => `<aside class="insp pinfo2">
    <div class="ihead"><div class="ipv">${ph("harbor")}</div><b class="fn">IMG_4821.jpg</b><span class="dt">Saturday 8 November 2026 · 17:42</span></div>
    <div class="ibody">
      <div class="card">
        <div class="row">${icon("image")}<div class="kv"><span>4032 × 3024 · 12.2 MP</span><small>3.1 MB · JPEG</small></div></div>
        <div class="row">${icon("camera")}<div class="kv"><span>Fujifilm X-T5 · 23 mm</span><small>f/2 · 1/250 s · ISO 200</small></div></div>
        <div class="row hist">${bars([0.05, 0.08, 0.12, 0.2, 0.32, 0.4, 0.46, 0.5, 0.58, 0.7, 0.82, 0.74, 0.6, 0.52, 0.48, 0.44, 0.4, 0.36, 0.3, 0.26, 0.3, 0.38, 0.28, 0.14], { h: 34, c: "var(--dim-text)", gap: 2 })}</div>
      </div>
      <div class="lab">Where</div>
      <div class="card"><div class="map"><i class="pin2"></i></div><div class="row">${icon("mapin")}<span class="k">Lisbon, Portugal</span><span class="v acc">Open map</span></div></div>
      <div class="lab">Folder and albums</div>
      <div class="card"><div class="row">${icon("folder")}<span class="k">Pictures/Camera</span><span class="v acc">Show in Files</span></div><div class="row chips">${chip("Lisbon trip", "acc", "album")}${chip("Add to album", "", "plus")}</div></div>
    </div></aside>`;

  const pageA = (o = {}) => `${o.narrow ? selbar(3, { narrow: true }) : selbar(1)}<div class="cols"><div class="main trow"><div class="tl">${timeline({ picked: o.narrow ? ["harbor", "tram", "sunset"] : null })}</div>${scrubber()}</div>${o.narrow ? "" : infoA()}</div>${footA()}`;

  /* ── Options E, F, G: the tidy timeline, without the tiles ─────────── */
  const sideE = (o = {}) => `
    ${grp("Library", true, "", "accent")}
    ${navx("image", "All photos", { active: true, cnt: "2,418" })}
    ${navx("star", "Favorites", { cnt: 46 })}
    ${navx("clock", "Recently added", { cnt: 124 })}
    ${navx("video", "Videos", { cnt: 38 })}
    ${navx("screenshot", "Screenshots", { cnt: 340 })}
    ${navx("folder", "Folders", { cnt: 6 })}
    ${o.dates ? `${grp("Dates", false, "", "teal")}
    <div class="e-dates">${navx("calendar2", "November 2026", { cnt: 31 })}
    ${navx("calendar2", "October", { cnt: 52 })}
    ${navx("calendar2", "September", { cnt: 77 })}
    ${navx("calendar2", "Summer 2026", { cnt: 412 })}
    ${navx("calendar2", "2025", { cnt: "1,108" })}
    ${navx("calendar2", "2024 and earlier", { cnt: 738 })}</div>` : ""}
    ${grp("Tidy up", false, "", "amber")}
    ${navx("copy", "Possible duplicates", { cnt: 12 })}
    ${grp("Albums", false, icon("plus"), "violet")}
    ${ALBUMS.map(([n, c, k]) => `<div class="navx"><i class="acov pp-${k}"></i><span>${n}</span><span class="cnt">${c}</span></div>`).join("")}
    <div class="foot">${icon("check-c", "ok")}<span>Up to date · watching 2 folders</span></div>`;

  const floatSel = (n) => `<div class="e-float">${selbar(n).replace('class="selbar"', 'class="selbar e-fbar"')}</div>`;
  const infoPop = () => `<div class="e-pop"><div class="e-ph">${icon("image")}<div><b>IMG_4821.jpg</b><span>Sat 8 Nov 2026 · 17:42</span></div></div>
    <div class="e-kv">${icon("camera")}<span>Fujifilm X-T5 · 23 mm · f/2 · 1/250 s</span></div>
    <div class="e-kv">${icon("image")}<span>4032 × 3024 · 3.1 MB · JPEG</span></div>
    <div class="e-kv">${icon("mapin")}<span>Lisbon, Portugal</span><b>Map</b></div>
    <div class="e-kv">${icon("folder")}<span>Pictures/Camera</span><b>Show in Files</b></div>
    <div class="e-kv">${icon("album")}<span>In Lisbon trip</span><b>Add to album</b></div></div>`;

  const pageE = (o = {}) => `${o.narrow ? selbar(3, { narrow: true }) : selbar(1)}<div class="cols"><div class="main trow"><div class="tl">${timeline({ picked: o.narrow ? ["harbor", "tram", "sunset"] : null })}</div>${o.noScrub ? "" : scrubber()}</div>${o.narrow ? "" : infoA()}</div>${footA()}`;
  const pageF = (o = {}) => `<div class="cols"><div class="main trow e-wide"><div class="tl">${timeline({ picked: o.picked ? ["harbor", "tram", "sunset"] : null })}</div>${scrubber()}${o.picked ? floatSel(3) : infoPop()}</div></div>${footA()}`;

  /* ── Option B: moments, albums and a Tidy up tab ────────────────────── */
  const hdrNoSide = ({ center = "", end = "" }) => `<header class="hdr"><div class="hdr-id">${icon("image", "app-ic")}<span class="app-name">Photos</span></div><div class="hdr-start"></div><div class="hdr-center">${center}</div><div class="hdr-end">${end}<span class="gap"></span>${ib("sliders", "Settings (Ctrl+,)")}</div></header>`;
  const hdrB = (on) => hdrNoSide({ center: seg(["Library", "Albums", "Folders", "Tidy up"], on), end: `${search("Search", "Ctrl F", "short")}${ib("more", "More (F10)")}` });

  const moment = (title, sub, items, o = {}) => `<div class="moment ${o.cls || ""}"><div class="mh"><div><b>${title}</b><span>${sub}</span></div><span class="sp"></span>${btn("Slideshow", "ghost sm", "play")}${btn("Select", "ghost sm", "check-c")}</div>
    <div class="bento">${items.map(([k, x = {}], i) => ph(k, { ...x, cls: i === 0 ? "big" : "" })).join("")}${o.more ? `<div class="morec">+${o.more}</div>` : ""}</div></div>`;

  const libraryB = () => `<div class="chipsrow">${["All", "Favorites", "Recently added", "Photos", "Screenshots", "Videos"].map((c, i) => chip(c, i === 0 ? "on" : "")).join("")}<span class="sp"></span><span class="cnt">2,418 photos · 38 videos</span>${dd("Days", "calendar")}</div>
    <div class="moments">
      ${moment("Saturday 8 November", "Lisbon · 11 photos and a video", [["harbor", { fav: true }], ["tram"], ["sunset"], ["tiles"], ["street", { dur: "0:24" }]], { more: 6 })}
      ${moment("Tuesday 4 November", "6 photos", [["garden"], ["flower", { fav: true }], ["garden", { hue: 40 }], ["snow"], ["food"]], { more: 1 })}
    </div>`;

  const albumsB = () => `<div class="btool2"><b>6 albums</b><span class="sp"></span>${btn("New album", "primary", "plus")}</div>
    <div class="agrid">${[...ALBUMS, ["Holidays 2025", 132, "snow"], ["Screens to keep", 17, "dusk"]].map(([n, c, k], i) => `<div class="acard ${i === 1 ? "sel" : ""}"><div class="amos">${ph(k, { cls: "a1" })}${ph(["sea", "forest", "street", "lake", "flower", "tram"][i], { cls: "a2" })}${ph(["portrait", "dusk", "food", "garden", "tiles", "harbor"][i], { cls: "a3" })}</div><b>${n}</b><span>${c} photos · ${["Nov 2026", "Mar – Nov 2026", "2024 – 2026", "2023 – 2026", "Dec 2025", "2026"][i]}</span></div>`).join("")}</div>
    ${menu(372, 150, [["play", "Play as slideshow"], ["export", "Export…"], ["rename", "Rename"], "-", ["trash", "Delete album (the photos stay)", "", "danger"]], 250)}`;

  const dupPh = (k, size, res, keep, hue) => `<div class="dup ${keep ? "keep" : ""}">${ph(k, { hue })}<div class="dmeta"><b>${res}</b><span>${size}</span></div>${keep ? `<span class="best">${icon("check")} Keep</span>` : btn("Move to trash", "sm dtext", "trash")}</div>`;
  const tidyB = () => `<div class="tidy"><div class="clamp" style="--clamp: 880px">
      <div class="tsums"><div class="tsum"><span class="tic amber">${icon("copy")}</span><div class="tx"><b>12 sets of possible duplicates</b><span>31 photos that look the same. Keep one of each to free about 148 MB.</span></div>${btn("Review", "primary")}</div>
      <div class="tsum"><span class="tic violet">${icon("screenshot")}</span><div class="tx"><b>340 screenshots</b><span>1.2 GB, most older than a month.</span></div>${btn("Show them")}</div></div>
      <div class="gtitle">Possible duplicates <span class="note">Sorted by how much space they take</span></div>
      <div class="dset"><div class="dsh"><b>Saturday 8 November · 17:42</b><span>3 photos · 9.4 MB</span><span class="sp"></span>${btn("Keep the largest", "sm")}</div><div class="drow">${dupPh("harbor", "3.1 MB", "4032 × 3024", true)}${dupPh("harbor", "3.0 MB", "4032 × 3024", false, 4)}${dupPh("harbor", "0.4 MB", "1600 × 1200 · copy", false, 8)}</div></div>
      <div class="dset"><div class="dsh"><b>Tuesday 4 November · 09:10</b><span>2 photos · 5.2 MB</span><span class="sp"></span>${btn("Keep the largest", "sm")}</div><div class="drow">${dupPh("flower", "2.8 MB", "3024 × 4032", true)}${dupPh("flower", "2.4 MB", "3024 × 4032 · edited", false, 6)}</div></div>
    </div></div>`;

  /* ── Option C: the viewer and the editor ───────────────────────────── */
  const strip = (cur = 3) => `<div class="strip">${["sunset", "tiles", "tram", "harbor", "food", "street", "sea", "portrait", "garden", "flower", "lake"].map((k, i) => ph(k, { cls: i === cur ? "cur" : "" })).join("")}</div>`;

  const viewerHdr = (o = {}) => `<header class="hdr vhdr">
    <div class="hdr-id">${o.standalone ? `${icon("image", "app-ic")}<span class="app-name">Photo Viewer</span>` : `<button class="btn ghost backb">${icon("chev-l")}<span>Library</span></button>`}</div>
    <div class="hdr-start"></div>
    <div class="hdr-center"><div class="vt"><b>IMG_4821.jpg</b><span>4 of 11 · Saturday 8 November</span></div></div>
    <div class="hdr-end">${o.standalone ? btn("Open in Photos", "", "external") : ""}${o.narrow ? ib("star", "Favorite (F)", "fav-on") + ib("pen", "Edit (E)") + ib("play", "Slideshow (S)") : btn("Favorite", "fav-on", "star") + btn("Edit", "", "pen") + btn("Slideshow", "", "play")}${ib("share", "Share")}${ib("more", "Rotate, copy, set as background, rename, show in Files, move to trash")}${o.narrow ? "" : ib("info", "Photo info (I)", "on")}<span class="gap"></span>${ib("sliders", "Settings (Ctrl+,)")}</div></header>`;

  const viewer = (o = {}) => `<div class="cols"><div class="main vstage">
      <div class="vpic">${ph("harbor", { cls: "hero" })}</div>
      <button class="nav l">${icon("chev-l")}</button><button class="nav r">${icon("chev-r")}</button>
      <div class="rotbar">${icon("rotate")}<span>Turned 90° in the viewer only</span>${btn("Save to file", "sm primary")}${btn("Undo", "sm ghost")}</div>
      <div class="zoomc"><span>Fit</span><span class="sep"></span>${ib("minus", "Zoom out (−)")}<b>38%</b>${ib("plus", "Zoom in (+)")}</div>
      ${strip()}
    </div>${o.info ? infoA() : ""}</div>`;

  const editorHdr = () => `<header class="hdr vhdr">
    <div class="hdr-id">${btn("Cancel", "ghost")}</div><div class="hdr-start">${ib("undo", "Undo (Ctrl+Z)")}${ib("redo", "Redo (Ctrl+Shift+Z)")}</div>
    <div class="hdr-center"><div class="vt"><b>Editing IMG_4821.jpg</b><span>Changes stay here until you save</span></div></div>
    <div class="hdr-end">${btn("Copy", "", "copy")}<span class="splitb">${btn("Save a copy", "primary", "check")}<button class="btn primary caret">${icon("chev-d")}</button></span></div></header>`;

  const slider = (label, v, val) => `<div class="esl"><div class="r1"><span>${label}</span><b>${val}</b></div><div class="etr"><span class="mid"></span><b style="left:${Math.min(50, v)}%;width:${Math.abs(v - 50)}%"></b><i style="left:${v}%"></i></div></div>`;
  const editor = () => `<div class="cols etool">
    <nav class="etabs">${[["crop", "Crop and turn"], ["adjust", "Adjust", true], ["pen", "Markup"], ["expand", "Resize"]].map(([ic, t, on]) => `<div class="etab ${on ? "on" : ""}">${icon(ic)}<span>${t}</span></div>`).join("")}</nav>
    <div class="main vstage edit"><div class="vpic">${ph("harbor", { cls: "hero warm" })}</div><div class="cmp">${icon("eye")} Hold <span class="kbd">\\</span> to compare</div></div>
    <aside class="epanel">
      <div class="lab2">Light and colour</div>
      ${slider("Brightness", 62, "+12")}${slider("Contrast", 56, "+6")}${slider("Saturation", 70, "+20")}
      <div class="lab2">Filter</div>
      <div class="filters">${[["None", ""], ["Mono", "mono"], ["Sepia", "sepia"]].map(([n, c], i) => `<div class="flt ${i === 0 ? "on" : ""}">${ph("harbor", { cls: c })}<span>${n}</span></div>`).join("")}</div>
      <div class="lab2">Saving</div>
      <div class="card scard2"><div class="opt"><div class="opt-text"><div>Quality</div><div class="d">JPEG, 92</div></div>${dd("92")}</div><div class="opt"><div class="opt-text"><div>Back up the original</div><div class="d">Before replacing it</div></div>${sw(true)}</div></div>
      ${btn("Reset all", "ghost", "undo")}
    </aside></div>`;

  /* ── New option: grid and big preview ───────────────────────────────── */
  const sideN1 = () => `
    ${grp("Library", true, "", "accent")}
    ${navx("image", "All photos", { active: true, cnt: "2,418" })}
    ${navx("star", "Favorites", { cnt: 46 })}
    ${navx("clock", "Recently added", { cnt: 124 })}
    ${grp("Kinds", false, "", "blue")}
    ${navx("camera", "Photos", { cnt: "2,040" })}
    ${navx("screenshot", "Screenshots", { cnt: 340 })}
    ${navx("video", "Videos", { cnt: 38 })}
    ${grp("Folders", false, "", "teal")}
    ${navx("folder", "Camera", { cnt: "1,612" })}
    ${navx("folder", "Phone backup", { cnt: 466 })}
    ${grp("Albums", false, icon("plus"), "violet")}
    ${ALBUMS.slice(0, 3).map(([n, c, k]) => `<div class="navx"><i class="acov pp-${k}"></i><span>${n}</span><span class="cnt">${c}</span></div>`).join("")}
    ${grp("Tidy up", false, "", "amber")}
    ${navx("copy", "Possible duplicates", { cnt: 12 })}`;

  const SQ = [
    ["Saturday 8 November", "Lisbon", ["harbor", "tram", "tiles", "sunset", "food", "street", "sea", "portrait", "harbor:20", "tram:30", "sunset:16"]],
    ["Tuesday 4 November", "Home", ["garden", "flower", "garden:40", "snow", "food:10", "flower:30"]],
    ["Sunday 26 October", "Pine Lake", ["forest", "lake", "forest:30", "dusk", "lake:20", "forest:60", "dusk:20", "lake:40"]],
  ];
  const sqGrid = (o = {}) => SQ.map(([d, place, ks], gi) => `<div class="n1-day"><div class="dh"><b>${d}</b><span>${place} · ${ks.length}</span></div><div class="n1-sq">${ks.map((kk, i) => {
    const [k, hue] = kk.split(":");
    const on = gi === 0 && (o.picked ? o.picked.includes(i) : i === 0);
    return ph(k, { hue, cls: on ? "selp" : "", fav: gi === 0 && i === 0, dur: gi === 0 && i === 5 ? "0:24" : "", sel: o.picked ? on : undefined });
  }).join("")}</div></div>`).join("");

  const gfootN1 = () => `<div class="n1-gf">${seg(["Years", "Months", "Days", "All"], "Days")}<span class="sp"></span><span class="zoom">${icon("image", "zs")}<span class="vtr"><b style="width:40%"></b></span>${icon("image", "zl")}</span></div>`;
  const factsN1 = () => `<div class="n1-facts">
      <div class="f">${icon("image")}<div><b>4032 × 3024</b><span>12.2 MP · 3.1 MB JPEG</span></div></div>
      <div class="f">${icon("camera")}<div><b>Fujifilm X-T5</b><span>23 mm · f/2 · 1/250 s · ISO 200</span></div></div>
      <div class="f">${icon("mapin")}<div><b>Lisbon, Portugal</b><span class="acc">Open map</span></div></div>
    </div>`;
  const loupe = (o = {}) => `<div class="n1-loupe">
      <div class="lh"><div class="tx"><b>IMG_4821.jpg</b><span>Saturday 8 November 2026 · 17:42 · 1 of 11</span></div>${ib("chev-l", "Previous (←)")}${ib("chev-r", "Next (→)")}${o.narrow ? "" : ib("expand", "Full size (Space)")}</div>
      <div class="lpic">${ph("harbor", { cls: "lp" })}</div>
      <div class="lacts">${btn("Favorite", "fav-on", "star")}${btn("Edit", "", "pen")}${o.narrow ? "" : btn("Rotate", "", "rotate")}${btn("Add to album", "", "album")}${ib("more", "Copy, rename, export, set as background, slideshow, show in Files")}<span class="sp"></span>${o.narrow ? ib("trash", "Move to trash (Delete)", "dang") : btn("Move to trash", "dtext", "trash")}</div>
      ${o.narrow ? "" : factsN1()}
      <div class="lfoot">${icon("folder")}<span>Pictures/Camera</span><span class="sp"></span>${chip("Lisbon trip", "acc", "album")}${o.narrow ? "" : `<span class="hint">${kbd("Space")} full size · ${kbd("I")} all details</span>`}</div>
    </div>`;

  const pickPane = () => `<div class="n1-loupe pick">
      <div class="lh"><div class="tx"><b>3 photos selected</b><span>Saturday 8 November · 9.6 MB</span></div>${btn("Deselect", "ghost sm")}</div>
      <div class="stack">${["sunset", "tram", "harbor"].map((k, i) => `<div class="sk s${i}">${ph(k)}</div>`).join("")}</div>
      <div class="lacts">${btn("Favorite", "", "star")}${btn("Rotate", "", "rotate")}${btn("Export…", "", "export")}${ib("more", "Copy, slideshow, show in Files")}<span class="sp"></span>${btn("Move to trash", "dtext", "trash")}</div>
      <div class="albs"><div class="ah">Add the 3 to an album</div>
        ${[...ALBUMS, ["Holidays 2025", 132, "snow"]].map(([n, c, k], i) => `<div class="al ${i === 0 ? "in" : ""}"><span class="cov pp-${k}"></span><div class="tx"><b>${n}</b><span>${i === 0 ? "All 3 are in it" : c + " photos"}</span></div>${i === 0 ? icon("check-c", "ok") : btn("Add", "sm")}</div>`).join("")}
        <div class="al new"><span class="cov nw">${icon("plus")}</span><div class="tx"><b>New album with these 3…</b></div></div>
      </div>
    </div>`;

  const hdrN1 = (o = {}) => header({ icon: "image", name: "Photos", start: o.narrow ? `<span class="n1-secdd">${dd("All photos", "image")}</span>` : "", center: search(o.narrow ? "Search" : "Search names, dates or cameras", "Ctrl F"), end: ib("more", "Select all, rescan, shortcuts (F10)") });
  const pageN1 = (o = {}) => `<div class="cols"><div class="list n1-gl"><div class="n1-gs">${sqGrid(o)}</div>${gfootN1()}</div><div class="main">${o.picked ? pickPane() : loupe(o)}</div></div>`;

  /* ── New option: zoom through time ──────────────────────────────────── */
  const zoomSeg = (on) => `<div class="seg n2-zoom">${["Years", "Months", "Days", "All"].map((x) => `<button class="${x === on ? "on" : ""}">${x}</button>`).join("")}</div>`;
  const hdrN2 = (on, o = {}) => hdrNoSide({ center: zoomSeg(on), end: `${o.narrow ? ib("search", "Search (Ctrl F)") : search("Search", "Ctrl F", "short")}${ib("more", "Select all, rescan, shortcuts (F10)")}` }).replace('<div class="hdr-start"></div>', `<div class="hdr-start"><button class="btn n2-sec ${o.open ? "open" : ""}">${icon("image")}<span>All photos</span>${icon("chev-d")}</button></div>`);

  const MONTHS = [
    ["November", "Lisbon, home · 86 photos, 3 videos", ["harbor", "tram", "sunset"], 12],
    ["October", "Pine Lake · 142 photos", ["forest", "lake", "dusk"], 4],
    ["September", "Home · 64 photos", ["garden", "flower", "food"], 2],
    ["August", "Seaside week · 210 photos, 9 videos", ["sea", "portrait", "sunset:20"], 9],
    ["July", "Garden party · 58 photos", ["flower:40", "garden:20", "food:20"], 1],
    ["June", "Mountains · 97 photos", ["snow", "lake:30", "forest:40"], 6],
  ];
  const mcard = ([m, sub, ks, fav], i) => `<div class="n2-mc ${i === 0 ? "hov" : ""}"><div class="mcol">${ks.map((kk, j) => { const [k, h] = kk.split(":"); return ph(k, { hue: h, cls: `m${j}` }); }).join("")}</div><div class="mt"><b>${m}</b>${fav ? `<span class="fv">${icon("star")}${fav}</span>` : ""}</div><span class="ms">${sub}</span></div>`;
  const ruler = (on) => `<div class="n2-ruler">${["2026", "2025", "2024", "2023", "2022"].map((y) => `<span class="${y === on ? "on" : ""}">${y}</span>`).join("")}</div>`;
  const monthsN2 = () => `<div class="n2-wrap"><div class="n2-sc">
      <div class="n2-yh"><b>2026</b><span>1,204 photos · 41 videos</span><span class="sp"></span>${btn("Slideshow of 2026", "ghost sm", "play")}</div>
      <div class="n2-mg">${MONTHS.map(mcard).join("")}</div>
      <div class="n2-yh nx"><b>2025</b><span>2,086 photos · 61 videos</span></div>
      <div class="n2-mg">${[["December", "Snow trip · 188 photos", ["snow:10", "lake", "portrait"], 7], ["November", "Home · 72 photos", ["tiles", "food:30", "flower"], 0], ["October", "Old town · 103 photos", ["street", "tram:20", "dusk"], 3]].map((m) => mcard(m, 9)).join("")}</div>
    </div>${ruler("2026")}</div>`;

  const DAYROWS = [
    ["Saturday 8 November", "Lisbon · 11 photos and a video", [["harbor", 1.5, 0], ["tram", 0.75, 1], ["tiles", 1, 0], ["sunset", 1.5, 1], ["food", 1, 0]], [["street", 0.75, 0, "0:24"], ["sea", 1.78, 1], ["portrait", 0.8, 0], ["harbor:20", 1.33, 0], ["tram:30", 0.75, 0]]],
    ["Tuesday 4 November", "Home · 6 photos", [["garden", 1.33, 0], ["flower", 1, 0], ["garden:40", 0.75, 0], ["snow", 1.5, 0], ["food:10", 1, 0]]],
    ["Sunday 2 November", "Home · 9 photos", [["portrait", 0.8, 0], ["lake", 1.5, 0], ["tiles", 1, 0], ["dusk", 1.33, 0], ["flower:20", 1, 0]]],
  ];
  const jr = (row) => `<div class="jrow n2-jr">${row.map(([kk, ar, s, dur]) => { const [k, h] = kk.split(":"); return ph(k, { ar, hue: h, sel: !!s, cls: s ? "selp" : "", dur }); }).join("")}</div>`;
  const dayN2 = () => `<div class="n2-wrap"><div class="n2-sc">
      <div class="n2-crumb"><span class="lnk">${icon("chev-l")}2026</span><b>November</b><span class="s">86 photos, 3 videos · Lisbon, home</span><span class="sp"></span>${btn("Slideshow", "ghost sm", "play")}</div>
      ${DAYROWS.map(([d, s, ...rows]) => `<div class="n2-day"><div class="dh"><b>${d}</b><span>${s}</span><span class="sp"></span><span class="pk">${icon("check-c")}Select day</span></div>${rows.map(jr).join("")}</div>`).join("")}
    </div>${ruler("2026")}
    <div class="n2-float"><span class="c">${icon("check")}3 selected</span>${btn("Favorite", "", "star")}${btn("Add to album", "", "album")}${btn("Rotate", "", "rotate")}${ib("more", "Copy, export, slideshow, show in Files")}<span class="vs"></span>${btn("Move to trash", "dtext", "trash")}${ib("x", "Deselect (Esc)")}</div>
    </div>`;

  const YEARS = [["2026", "1,204 photos · Lisbon, Pine Lake", ["harbor", "forest", "garden", "sea"]], ["2025", "2,086 photos · Seaside week, snow", ["snow", "sea:20", "portrait", "flower"]], ["2024", "1,530 photos · Garden, the old flat", ["garden:40", "tiles", "dusk", "food"]], ["2023", "988 photos · Lake house", ["lake", "street", "tram", "sunset"]], ["2022", "640 photos", ["forest:30", "sea", "flower:50", "garden"]], ["2021", "412 photos", ["dusk:20", "food", "snow", "portrait"]]];
  const yearsN2 = () => `<div class="n2-wrap"><div class="n2-sc">
      <div class="n2-yg">${YEARS.map(([y, s, ks]) => `<div class="n2-yc"><div class="ymos">${ks.map((kk, j) => { const [k, h] = kk.split(":"); return ph(k, { hue: h, cls: `y${j}` }); }).join("")}</div><div class="yt"><b>${y}</b><span>${s}</span></div></div>`).join("")}</div>
    </div>
    ${menu(10, 6, [["#", "Library"], ["image", "All photos", "", "check hover"], ["star", "Favorites", "46"], ["clock", "Recently added", "124"], "-", ["#", "Kinds"], ["camera", "Photos", "2,040"], ["screenshot", "Screenshots", "340"], ["video", "Videos", "38"], "-", ["folder", "Folders", "2"], ["album", "Albums", "4"], ["copy", "Possible duplicates", "12"]], 250)}
    </div>`;

  const ICONS = {
    video: '<rect x="3" y="6" width="13" height="12" rx="2.5"/><path d="m16 10.5 5-3v9l-5-3"/>',
    camera: '<path d="M4 8.5a2 2 0 0 1 2-2h2l1.5-2h5l1.5 2h2a2 2 0 0 1 2 2V18a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"/><circle cx="12" cy="13" r="3.5"/>',
    screenshot: '<path d="M4 8V5.5A1.5 1.5 0 0 1 5.5 4H8M16 4h2.5A1.5 1.5 0 0 1 20 5.5V8M20 16v2.5a1.5 1.5 0 0 1-1.5 1.5H16M8 20H5.5A1.5 1.5 0 0 1 4 18.5V16"/><rect x="8" y="9" width="8" height="6" rx="1"/>',
    album: '<rect x="3.5" y="7" width="17" height="13" rx="2.5"/><path d="M6.5 4h11"/><path d="m7 16.5 3.5-3.5 2.5 2.5 1.5-1.5 2.5 2.5"/>',
    rotate: '<path d="M4.5 12a7.5 7.5 0 0 1 13-5.1L20 9.5"/><path d="M20 4v5.5h-5.5"/><rect x="6" y="13" width="9" height="7" rx="1.5"/>',
    rows: '<rect x="3.5" y="4.5" width="7" height="6" rx="1.2"/><rect x="12.5" y="4.5" width="8" height="6" rx="1.2"/><rect x="3.5" y="13.5" width="10" height="6" rx="1.2"/><rect x="15.5" y="13.5" width="5" height="6" rx="1.2"/>',
    crop: '<path d="M6 2.5V16a2 2 0 0 0 2 2h13.5M2.5 6H16a2 2 0 0 1 2 2v13.5"/>',
    adjust: '<circle cx="12" cy="12" r="8.5"/><path d="M12 3.5v17"/><path fill="currentColor" stroke="none" d="M12 3.5a8.5 8.5 0 0 1 0 17z"/>',
    undo: '<path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11"/>',
    redo: '<path d="m15 14 5-5-5-5"/><path d="M20 9H9.5a5.5 5.5 0 0 0 0 11H13"/>',
    minus: '<path d="M5 12h14"/>',
  };

  REG("photos", {
    name: "Photos", accent: "coral",
    summary: "Photos is fast and full of features (a timeline, albums, search by date and camera, a viewer, an editor and its own Photo Viewer), but its sidebar is one unsorted list, its actions are bare icons floating in the header, and the timeline has no dates you can see.",
    problems: [
      "<b>One unsorted sidebar list:</b> Library, Favorites and Recent sit beside Videos, Screenshots and Photos (kinds) and Folders and Possible duplicates (tools), with no headings; only Albums has one, in grey.",
      "<b>Counts that don't help:</b> Library and Folders both say 441, and Videos shows 0 instead of hiding or explaining itself.",
      "<b>Five bare icons in the middle of the header:</b> Favorite, Album, Edit, Rotate and Delete float there whenever something is selected, with Delete beside Rotate and nothing saying how many photos they act on.",
      "<b>No dates in the timeline:</b> photos run together in one wall; the only dates are the scrubber's “2026”, “Oct” and “Sep”, far apart in a wide empty column on the right.",
      "<b>Grouping hides behind an icon:</b> Years, Months, Days and the layout live under an unlabelled grid button at the bottom right.",
      "<b>The info panel truncates the one thing you'd look for</b> (the file name), and lists size and folder in a plain box.",
      "<b>At 800 px</b> the sidebar is eleven look-alike icons (the albums are two identical folders and a +), and the header's actions disappear into ⋮.",
      "<b>The viewer is another row of nine icons</b> (favorite, edit, rotate, slideshow, copy, share, background, reveal, close) with no labels.",
    ],
    today: [["photos-1280", "Today at 1280 px", "Library with a photo selected and the info panel open"], ["photos-800", "Today at 800 px", "A rail of look-alike icons; actions gone into ⋮"]],
    options: [
      { id: "a", name: "Moments and albums", idea: "No sidebar: Library, Albums, Folders and Tidy up are tabs across the top. The library shows each day as a moment, a big photo with a few beside it, with Slideshow and Select on each; filters (Favorites, Recently added, Photos, Screenshots, Videos) are chips. Albums get a page of covers with their menu, and Tidy up gathers the possible duplicates and old screenshots so they can be cleared. Suits browsing more than managing.",
        shots: [
          ["b-library","Library as moments","Days as moments; filters as chips"],
          ["b-albums","Albums","Covers and dates; the album menu open"],
          ["b-tidy","Tidy up","Duplicates side by side with a clear Keep"],
        ] },
      { id: "b", name: "Viewer and editor first", idea: "The viewer and editor, which today are rows of bare icons, get the care. The viewer leads with labelled Favorite, Edit and Slideshow, keeps the rest under ⋯, says when a turn hasn't been saved to the file, and shows the info panel beside the photo. The editor has its tools as labelled tabs down the side and Save a copy (or Replace original) as one clear button. Photo Viewer, the light window for opening one file, is the same viewer with Open in Photos.",
        shots: [
          ["c-viewer","Viewer","Labelled actions, rotation not saved yet, info beside"],
          ["c-edit","Editor","Tools as tabs; Save a copy with Replace original under its arrow"],
          ["c-viewer-800","Photo Viewer at 800 px","The standalone viewer: icons, Open in Photos"],
        ] },
      { id: "c", name: "Grid and big preview", idea: "The library is two halves: a narrow grid of square thumbnails, grouped by day, and a big preview of whatever is picked, with its name, date, camera and place, and labelled Favorite, Edit, Rotate, Add to album and Move to trash under it. Arrow keys walk through the grid while the preview follows, so going through a day's photos doesn't need the viewer at all; Space still opens it full size. Pick several and the preview becomes the selection, with the album list right there. The sidebar is sorted into Library, Kinds, Folders, Albums and Tidy up. Suits sorting and culling lots of photos.",
        shots: [
          ["n1-library","Library","Grid on the left, the picked photo big on the right"],
          ["n1-pick","Three picked","The preview becomes the selection, with albums to add them to"],
          ["n1-library-800","At 800 px","Sections in a menu; three thumbnails a row beside the preview"],
        ] },
      { id: "d", name: "Zoom through time", idea: "The library is a zoom: Years, Months, Days and All are the main control in the middle of the header, and you go in by clicking a year, then a month, then a photo. Each month is a card with three of its photos, where it was and how many favourites it has, and a ruler of years runs down the right edge. Selecting photos brings up a bar of labelled actions floating at the bottom. With no sidebar, Favorites, the kinds, Folders, Albums and Possible duplicates are in the menu at the top left. Suits looking back through years of photos.",
        shots: [
          ["n2-months","Library: Months","Each month as a card; years down the right"],
          ["n2-day","Into November: Days","Days with places; three picked, actions floating below"],
          ["n2-years-800","Years at 800 px","The section menu open over the years"],
        ] },
      { id: "e", name: "Tidy timeline", idea: "Today's layout, sorted out, as before but without the tiles. The sidebar's first group, Library, lists All photos, Favorites, Recently added, Videos, Screenshots and Folders as plain rows with their counts; Tidy up and Albums follow under their coloured headings, each album shown by its cover. The timeline has a date heading on every day and a slim scrubber; selecting brings a bar of labelled actions with a count (Edit only for one photo, Move to trash apart), and the info panel sits on the right. Grouping and layout are labelled in the foot.",
        shots: [
          ["e-library", "Library", "Plain Library rows instead of tiles; info panel on the right"],
          ["e-library-800", "At 800 px", "The rail, with coloured bars between the groups; three picked"],
        ] },
      { id: "f", name: "Timeline at full width", idea: "The same sidebar and timeline as E, with the right panel gone so the photos get the whole width. Info for the picked photo opens as a small card over the timeline (press I), with the camera, size, place, folder and albums and their links. Picking several floats a bar of labelled actions at the bottom of the photos instead of a bar across the top.",
        shots: [
          ["f-library", "Library", "No right panel; info as a card over the photos"],
          ["f-pick", "Three picked", "Labelled actions floating at the bottom"],
          ["f-library-800", "At 800 px", "The rail and the wider timeline"],
        ] },
      { id: "g", name: "Timeline by date", idea: "The same sidebar and timeline as E, with a Dates group in the sidebar: this month, the last few months, then the seasons and years before them, each with its count, so jumping to “last summer” is one click. The dates replace the scrubber, and the info panel stays on the right.",
        shots: [
          ["g-library", "Library", "Dates in the sidebar; no scrubber"],
          ["g-library-800", "At 800 px", "The dates fold to one calendar icon on the rail"],
        ] },
    ],
    icons: ICONS,
    pages: {
      "a-library": () => win({ hdr: hdrA({ info: !NARROW }), side: sideA(), page: pageA({ narrow: NARROW }) }),
      "b-library": () => win({ hdr: hdrB("Library"), side: "", page: libraryB() }),
      "b-albums": () => win({ hdr: hdrB("Albums"), side: "", page: albumsB() }),
      "b-tidy": () => win({ hdr: hdrB("Tidy up"), side: "", page: tidyB() }),
      "c-viewer": () => NARROW
        ? win({ hdr: viewerHdr({ standalone: true, narrow: true }), side: "", page: viewer({}) })
        : win({ hdr: viewerHdr({}), side: "", page: viewer({ info: true }) }),
      "c-edit": () => win({ hdr: editorHdr(), side: "", page: editor() }),
      "n1-library": () => NARROW
        ? win({ hdr: hdrN1({ narrow: true }).replace(ib("sidebar", "Sidebar (Ctrl+B)"), ""), side: "", page: pageN1({ narrow: true }) })
        : win({ hdr: hdrN1(), side: sideN1(), page: pageN1() }),
      "n1-pick": () => win({ hdr: hdrN1(), side: sideN1(), page: pageN1({ picked: [0, 1, 3] }) }),
      "n2-months": () => win({ hdr: hdrN2("Months"), side: "", page: monthsN2() }),
      "n2-day": () => win({ hdr: hdrN2("Days"), side: "", page: dayN2() }),
      "e-library": () => win({ hdr: hdrA({ info: !NARROW }), side: sideE(), page: pageE({ narrow: NARROW }) }),
      "f-library": () => win({ hdr: hdrA({ info: true }), side: sideE(), page: pageF() }),
      "f-pick": () => win({ hdr: hdrA(), side: sideE(), page: pageF({ picked: true }) }),
      "g-library": () => win({ hdr: hdrA({ info: !NARROW }), side: sideE({ dates: true }), page: pageE({ narrow: NARROW, noScrub: true }) }),
      "n2-years": () => win({ hdr: hdrN2("Years", { narrow: NARROW, open: true }), side: "", page: yearsN2() }),
    },
  });
})();
