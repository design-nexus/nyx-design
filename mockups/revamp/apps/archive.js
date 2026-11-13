// Nyx Archive on the revamp page: today's problems and three options.
(() => {
  // [name, format, size, where, when, flags]
  const RECENT = [
    ["lighthouse-project.7z", "7z", "184 MB", "~/Projects", "Today 10:14", { lock: true }],
    ["type-specimens.zip", "zip", "42 MB", "~/Downloads", "Yesterday", {}],
    ["firmware-bundle.tar.gz", "tar.gz", "96 MB", "~/Downloads", "Mon", { ro: true }],
    ["scans-2025.zip", "zip", "1.2 GB", "~/Documents", "Sun", {}],
    ["wallpapers-4k.7z.001", "7z", "4.0 GB", "~/Pictures", "2 Nov", { parts: 3, ro: true }],
    ["notes-backup.tar.xz", "tar.xz", "8.4 MB", "~/Backups", "28 Oct", {}],
    ["old-website.rar", "rar", "63 MB", "~/Archive", "14 Oct", { ro: true }],
    ["recipes.zip", "zip", "3.1 MB", "~/Documents", "2 Oct", {}],
  ];
  const FMT = { "7z": "violet", zip: "blue", "tar.gz": "teal", "tar.xz": "green", rar: "coral" };
  const badge = (f) => `<span class="ar-fmt" style="--fc: var(--sw-${FMT[f]})">${f.toUpperCase()}</span>`;
  const pkg = (f, s = 34) => `<span class="ar-pkg" style="--fc: var(--sw-${FMT[f]}); width:${s}px; height:${s}px">${icon("box")}</span>`;

  // [name, kind, size, packed, modified]
  const ITEMS = [
    ["models", "dir", "412 MB", "131 MB", "8 Nov 2026", 34],
    ["renders", "dir", "220 MB", "38 MB", "11 Nov 2026", 12],
    ["textures", "dir", "96 MB", "14 MB", "2 Nov 2026", 58],
    ["lighthouse.blend", "file", "88 MB", "0.9 MB", "11 Nov 2026"],
    ["lighthouse-final.png", "img", "14.2 MB", "–", "11 Nov 2026"],
    ["notes.md", "txt", "6 KB", "–", "9 Nov 2026"],
    ["LICENSE.txt", "txt", "1 KB", "–", "1 Nov 2026"],
    ["README.md", "txt", "3 KB", "–", "1 Nov 2026"],
  ];
  const kic = (k) => k === "dir" ? icon("folder-fill", "ar-dir") : k === "img" ? icon("image", "ar-img") : k === "txt" ? icon("file-text", "ar-txt") : icon("file", "ar-file");

  const hdr = (o = {}) => header({
    icon: "box", name: "Archive" + (o.doc ? `<span class="app-sub"><span class="sep">·</span>${o.doc}</span>` : ""),
    start: o.back ? ib("chev-l", "Back to start (Esc)") : "",
    center: o.center || "",
    end: o.end || "",
  });
  const noSide = (h) => h.replace(ib("sidebar", "Sidebar (Ctrl+B)"), "");

  const listing = (o = {}) => `<div class="tbl ar-tbl">
    <div class="th"><span class="c-n">Name ${icon("chev-u", "srt")}</span><span class="c-s">Size</span><span class="c-p">Packed</span><span class="c-m">Modified</span></div>
    ${ITEMS.map(([n, k, s, p, m, cnt], i) => `<div class="tr ${(o.sel || []).includes(i) ? "sel" : ""}"><span class="c-n">${kic(k)}<span class="nm">${n}</span>${cnt ? `<span class="cnt">${cnt} items</span>` : ""}</span><span class="c-s">${s}</span><span class="c-p">${p}</span><span class="c-m">${m}</span></div>`).join("")}
  </div>`;

  const crumbs = (parts) => `<div class="ar-crumbs">${parts.map((p, i) => `${i ? icon("chev-r", "sep") : ""}<span class="${i === parts.length - 1 ? "on" : ""}">${i === 0 ? icon("box") : ""}${p}</span>`).join("")}</div>`;

  const progress = (o = {}) => `<div class="ar-job">
    <div class="ring-wrap">${ring(64, { size: 44, label: "64%" })}</div>
    <div class="tx"><b>${o.title || "Extracting to ~/Projects/lighthouse-project"}</b><span class="mono">${o.file || "models/hull/hull-high.obj"}</span><span>${o.meta || "468 of 728 MB · 41 MB/s · about 6 s left"}</span></div>
    <label class="ar-chk"><span class="cbx sq done">${icon("check")}</span>Open the folder when done</label>
    ${btn("Cancel")}
  </div>`;

  /* ── Option A: a start page and a proper browser ────────────────────── */
  const homeA = () => `<div class="scroll ar-home"><div class="clamp" style="--clamp: 880px">
    <div class="ar-drop">
      <div class="ic">${icon("box")}</div>
      <div class="tx"><b>Open an archive, or make one</b><span>Drop an archive here to open it, or any other files to compress them.</span></div>
      ${btn("New archive", "", "plus")}${btn("Open archive…", "primary", "folder")}
    </div>
    <div class="ar-rh"><b>Recent</b><span>${RECENT.length} archives</span><span class="sp"></span>${btn("Clear list", "ghost")}</div>
    <div class="card ar-recent">
      ${RECENT.map(([n, f, s, w, t, x], i) => `<div class="row ${i === 1 ? "hover" : ""}">${pkg(f)}<div class="tx"><div class="r1"><b>${n}</b>${x.lock ? icon("lock", "lk") : ""}${x.ro ? `<span class="ro">Read-only</span>` : ""}${x.parts ? `<span class="ro">${x.parts} parts</span>` : ""}</div><span>${w}</span></div>${badge(f)}<span class="m">${s}</span><span class="m t">${t}</span><span class="acts">${i === 1 ? `${btn("Extract", "sm", "download")}${ib("folder", "Show in folder")}${ib("x", "Remove from the list")}` : ""}</span></div>`).join("")}
    </div>
    <p class="ar-reads">Opens 7z, zip, rar, tar, iso, cab, deb, rpm and anything else 7-Zip can read.</p>
  </div></div>`;

  const toolA = (sel = 0) => `<div class="ar-tool">
    <span class="ar-split">${btn(sel ? `Extract ${sel} items` : "Extract all", "primary", "download")}<button class="btn primary dd-arrow">${icon("chev-d")}</button></span>
    ${btn("Add files", "", "plus")}${btn("Test", "ghost", "check-c")}${sel ? btn("Delete", "dtext", "trash") : ""}
    <span class="sp"></span><div class="field ar-search">${icon("search")}<span class="ph">Search this archive</span><span class="key2">Ctrl F</span></div>${ib("panel", "Archive details", NARROW ? "" : "on")}
  </div>`;

  const inspA = () => `<div class="insp ar-insp">
    <div class="ihead"><div class="ar-ih">${pkg("7z", 44)}<div><b>lighthouse-project.7z</b><span>~/Projects</span></div></div></div>
    <div class="ibody">
      <div class="ar-ratio"><div class="bar"><b style="width:31%"></b></div><div class="lg"><span><b>184 MB</b> packed</span><span><b>728 MB</b> unpacked</span></div><p>Packed to 25% of its size.</p></div>
      <div class="lab">About it</div>
      <div class="card">
        ${[["Format", "7z, solid"], ["Method", "LZMA2, level 7"], ["Contents", "106 files in 14 folders"], ["Locked", "Password, names hidden"], ["Changed", "Today 10:14"]].map(([k, v]) => `<div class="row"><span class="k">${k}</span><span class="v">${v}</span></div>`).join("")}
      </div>
      <div class="ar-pw">${icon("lock")}<span>Unlocked until you close it. The password is kept in memory only.</span></div>
    </div>
  </div>`;

  const browseA = (o = {}) => `${toolA(o.sel ? o.sel.length : 0)}
    <div class="ar-pathbar">${crumbs(["lighthouse-project.7z", "All files"])}<span class="sp"></span><span class="t">8 items · 728 MB</span></div>
    <div class="cols"><div class="main"><div class="scroll">${listing({ sel: o.sel })}</div>${o.job ? progress() : ""}${o.sel ? `<div class="ar-selfoot"><b>3 selected</b><span>514 MB</span><span class="sp"></span><span class="tip">Drag them out to extract them anywhere</span>${ib("copy", "Copy paths")}${ib("x", "Clear the selection (Esc)")}</div>` : ""}</div>${o.narrow ? "" : inspA()}</div>`;

  /* ── Option B: archives in a sidebar ────────────────────────────────── */
  const sideB = (on = "lighthouse") => `
    ${navx("plus", "New archive", { active: on === "new" })}
    ${navx("folder", "Open archive…")}
    ${grp("Recent", false, `<span class="ar-clear">Clear</span>`, "accent")}
    ${RECENT.slice(0, 6).map(([n, f, , , , x], i) => navx("", n.replace(/\.(7z|zip|tar\.gz|tar\.xz|rar)(\.001)?$/, ""), { dot: `var(--sw-${FMT[f]})`, active: on === "lighthouse" && i === 0, sub: f })).join("")}
    ${grp("Places", false, "", "green")}
    ${navx("download", "Downloads", { cnt: 12 })}
    ${navx("file-text", "Documents", { cnt: 5 })}
    <div class="foot">${icon("check-c", "ok")}<span>7-Zip 25.01 · reads 50 formats</span></div>`;

  const browseB = () => `${pbar2("lighthouse-project", "7z · 184 MB · 106 files · locked", `${btn("Test", "ghost", "check-c")}${btn("Add files", "", "plus")}<span class="ar-split">${btn("Extract all", "primary", "download")}<button class="btn primary dd-arrow">${icon("chev-d")}</button></span>`)}
    <div class="ar-pathbar">${crumbs(["lighthouse-project", "models"])}<span class="sp"></span>${seg([icon("listic"), icon("grid")], icon("grid")).replace('<div class="seg">', '<div class="seg icons">')}</div>
    <div class="scroll ar-grid">${[["hull", "dir", 12], ["lamp", "dir", 9], ["rocks", "dir", 13], ["hull-high.obj", "file"], ["hull-low.obj", "file"], ["lamp-glass.obj", "file"], ["lighthouse.mtl", "txt"], ["preview-front.png", "img"], ["preview-side.png", "img"], ["scale-reference.png", "img"], ["materials.json", "txt"], ["CHANGES.md", "txt"]].map(([n, k, c], i) => `<div class="ar-gi ${i === 7 ? "sel" : ""}">${k === "img" ? art(n, { h: 64, r: 6 }) : `<div class="gic ${k}">${kic(k)}</div>`}<b>${n}</b><span>${c ? `${c} items` : ["2.4 MB", "640 KB", "88 KB", "4 KB", "1.1 MB", "980 KB", "1.0 MB", "12 KB", "2 KB"][i - 3]}</span></div>`).join("")}</div>
    <div class="ar-selfoot">${art("preview-front.png", { w: 28, h: 28, r: 6 })}<b>preview-front.png</b><span>1.1 MB · 1920 × 1080</span><span class="sp"></span>${btn("Open", "sm", "external")}${btn("Extract", "sm", "download")}${ib("copy", "Copy path")}${ib("trash", "Delete from the archive")}</div>`;

  const createB = () => `${pbar2("New archive", "3 items · 412 MB before packing", "")}
    <div class="cols ar-create">
      <div class="main"><div class="scroll ar-cfiles">
        <div class="ar-ch"><b>Files</b><span class="sp"></span>${btn("Add files", "sm", "plus")}${btn("Add folder", "sm", "folder")}</div>
        <div class="card">${[["folder-fill", "Iceland trip", "214 files · 380 MB"], ["image", "map-sketch.png", "4.2 MB"], ["file-text", "itinerary.pdf", "1.1 MB"]].map(([ic, n, s]) => `<div class="row">${icon(ic, ic === "folder-fill" ? "ar-dir" : ic === "image" ? "ar-img" : "ar-txt")}<span class="n">${n}</span><span class="m">${s}</span>${ib("x", "Remove")}</div>`).join("")}</div>
        <div class="ar-dropmini">${icon("plus")}Drop more files here</div>
      </div></div>
      <div class="insp ar-copts">
        <div class="ibody">
          <div class="lab">Name and place</div>
          <div class="field">${icon("box")}<span>Iceland trip</span><span class="ext">.7z</span></div>
          <div class="field" style="margin-top:6px">${icon("folder")}<span>~/Pictures</span><span style="flex:1"></span><span class="lnk">Change</span></div>
          <div class="lab">Format</div>
          ${seg(["7z", "Zip", "tar.gz", "tar.xz"], "7z")}
          <p class="hint">7z packs smallest; zip opens everywhere.</p>
          <div class="lab">Compression<span class="act">Normal</span></div>
          <div class="ar-level"><div class="slider"><div class="tr"><div class="fill" style="width:50%"></div></div><div class="kn" style="left:50%"></div></div><div class="ticks"><span>Store</span><span>Fast</span><span>Normal</span><span>Maximum</span><span>Ultra</span></div></div>
          <div class="lab">Protect and split</div>
          <div class="card">
            <div class="row"><span class="k">Password</span><span class="ph">Optional</span></div>
            <div class="row"><span class="k">Hide file names</span>${sw(true)}</div>
            <div class="row"><span class="k">Split into parts</span>${dd("Off")}</div>
            <div class="row"><span class="k">Solid archive</span>${sw(true)}</div>
            <div class="row"><span class="k">Processor threads</span>${dd("Automatic")}</div>
            <div class="row"><span class="k">Move the originals to the trash</span>${sw(false)}</div>
          </div>
        </div>
        <div class="ifoot"><span class="est">About 140 MB</span><span style="flex:1"></span>${btn("Create archive", "primary", "box")}</div>
      </div>
    </div>`;

  /* ── Option C: one task at a time ───────────────────────────────────── */
  const openC = () => `<div class="scroll ar-task"><div class="clamp" style="--clamp: 620px">
    <div class="ar-hero">${pkg("7z", 64)}<div class="tx"><b>lighthouse-project.7z</b><span>106 files in 14 folders · 184 MB, 728 MB unpacked</span><div class="tags">${badge("7z")}<span class="chip2">${icon("lock")}Unlocked</span><span class="chip2">Can be changed</span></div></div></div>
    <div class="ar-big">
      <button class="ar-bigbtn primary">${icon("download")}<span><b>Extract to Projects</b><small>Into a new folder, ~/Projects/lighthouse-project</small></span></button>
      <div class="ar-row2">${btn("Extract to…", "", "folder")}${btn("Extract here, no new folder", "ghost")}</div>
    </div>
    <div class="ar-peek"><div class="ph"><b>Inside</b><span class="sp"></span><span class="lnk">Browse every file ${icon("chev-r")}</span></div>
      ${ITEMS.slice(0, 5).map(([n, k, s, , , c]) => `<div class="row">${kic(k)}<span class="n">${n}</span><span class="m">${c ? c + " items · " : ""}${s}</span></div>`).join("")}
    </div>
    <div class="ar-more">${btn("Add files", "ghost", "plus")}${btn("Test for errors", "ghost", "check-c")}${btn("Show in folder", "ghost", "folder")}</div>
  </div></div>`;

  const createC = () => `<div class="scroll ar-task"><div class="clamp" style="--clamp: 620px">
    <div class="ar-ct"><b>Compress 3 items</b><span>Iceland trip, map-sketch.png and itinerary.pdf · 385 MB</span></div>
    <div class="ar-fcards">
      ${[["7z", "Smallest", "Best packing. Opens with 7-Zip and most archive apps.", true], ["zip", "Works everywhere", "Opens on any computer or phone without extra apps."], ["tar.gz", "For Linux", "Keeps permissions. Quick to make and open."], ["tar.xz", "Smaller tar", "Like tar.gz, packed tighter, a little slower."]].map(([f, t, d, on]) => `<div class="ar-fc ${on ? "on" : ""}">${badge(f)}<b>${t}</b><span>${d}</span></div>`).join("")}
    </div>
    <div class="ar-lab">How hard to pack</div>
    <div class="ar-level"><div class="slider"><div class="tr"><div class="fill" style="width:50%"></div></div><div class="kn" style="left:50%"></div></div><div class="ticks"><span>Store</span><span>Fast</span><span>Normal</span><span>Maximum</span><span>Ultra</span></div></div>
    <div class="card ar-cc">
      <div class="row"><span class="k">Name</span><div class="field">Iceland trip<span class="ext">.7z</span></div></div>
      <div class="row"><span class="k">Save in</span>${dd("~/Pictures", "folder")}</div>
      <div class="row ex">${icon("chev-r")}<span class="k">More: password, hidden names, split into parts, solid, threads, trash the originals</span></div>
    </div>
    <div class="ar-go"><span>About 140 MB</span><span class="sp"></span>${btn("Cancel", "ghost")}${btn("Create archive", "primary", "box")}</div>
  </div></div>`;

  const doneC = () => `<div class="scroll ar-task"><div class="clamp" style="--clamp: 560px">
    <div class="ar-run">
      ${ring(64, { size: 120, label: "64%" })}
      <b>Extracting lighthouse-project.7z</b>
      <span class="mono">models/hull/hull-high.obj</span>
      <span>468 of 728 MB · 41 MB/s · about 6 s left</span>
      <label class="ar-chk"><span class="cbx sq done">${icon("check")}</span>Open the folder when done</label>
      ${btn("Cancel")}
    </div>
    <div class="ar-sep">Earlier</div>
    <div class="card ar-hist">
      <div class="row ok">${icon("check-c")}<div class="tx"><b>Created Iceland trip.7z</b><span>140 MB · tested, no errors · originals kept</span></div>${btn("Show in folder", "sm")}</div>
      <div class="row bad">${icon("alert")}<div class="tx"><b>Couldn't extract old-website.rar</b><span>2 files were damaged. Nothing half-written was left behind.</span></div>${btn("Details", "sm")}</div>
    </div>
  </div></div>`;

  REG("archive", {
    name: "Archive",
    summary: "Archive does the 7-Zip jobs well, with care over passwords and half-written files, but its start page is a big empty drop box over a short list, and everything after that (browse, create, extract) sits behind it with nothing on the start page to show it's there.",
    problems: [
      "<b>A drop box the size of the page:</b> a dashed area takes a third of the window to say “Drop files here”, and two-thirds of what's left is empty.",
      "<b>Recent says little:</b> each row is a name and a folder; format, size and date are small grey text that's dropped entirely at 800 px.",
      "<b>Nothing to do from Recent</b> except open the archive or remove the row: no Extract, no Show in folder, and the × to remove sits on every row at all times.",
      "<b>No settings or help in sight</b> on the start page: the header holds only the app's name, and Settings is a sliders icon you have to know about.",
      "<b>Browsing shows little about the archive:</b> details such as format, packing ratio and whether it's locked hide behind an info toggle.",
      "<b>Create hides half its options</b> under “Advanced” (password, split, solid, threads), and the format choice is a row of bare words with one line of help.",
      "<b>At 800 px</b> the drop box still takes the top half of the window, and long paths and names run into each other.",
    ],
    today: [["archive-1280", "Today at 1280 px", "A big drop box, two recent archives"], ["archive-800", "Today at 800 px", "Same, details dropped"]],
    options: [
      { id: "a", name: "Start page and browser", idea: "The same two steps, done properly. The start page is a slim drop bar with Open and New, then a full Recent list with format, size and date, and Extract and Show in folder on each row. An open archive gets a toolbar that says what it does (Extract all, which turns into Extract 3 items when you select some; Add files; Test; Delete only when something's selected), a search, and an inspector with the packing ratio and whether it's locked. Progress sits at the foot of the list.",
        shots: [["a-home", "Start page", "Slim drop bar, full Recent list"], ["a-browse", "An open archive", "Labelled toolbar, inspector, progress"], ["a-browse-800", "At 800 px", "Inspector folded away, three items selected"]] },
      { id: "b", name: "Archives in a sidebar", idea: "Like Files: recent archives live in the sidebar, so switching between them is one click, with New archive and Open at the top and your Downloads and Documents below. Contents show as a list or as a grid with picture previews. New archive is a full page: files on the left, and every option on the right in plain sight (format, a compression slider, password, hidden names, split, solid, threads, trash the originals) with the size it'll come to.",
        shots: [["b-browse", "Browsing as a grid", "Recent archives in the sidebar"], ["b-create", "New archive", "Every option visible"], ["b-create-800", "New archive at 800 px", "Rail; options beside the files"]] },
      { id: "c", name: "One task at a time", idea: "For a small floating window that opens when you double-click an archive. Opening one shows what it is and one big button, Extract to Projects, with the other ways to extract below and a peek at what's inside. Compressing asks one thing at a time, with formats as cards that say what each is for. While a job runs, the window is the progress, with earlier jobs below.",
        shots: [["c-open-800", "Opening an archive", "One big Extract button"], ["c-create-800", "Compressing files", "Formats as cards"], ["c-progress-800", "Extracting", "Progress, then earlier jobs"]] },
    ],
    pages: {
      "a-home": () => win({ hdr: noSide(hdr({ end: btn("Keyboard", "ghost", "keyboard") })), side: "", page: homeA() }),
      "a-browse": () => win({ hdr: noSide(hdr({ doc: "lighthouse-project.7z", back: true })), side: "", page: NARROW ? browseA({ sel: [0, 3, 4], narrow: true }) : browseA({ job: true }) }),
      "b-browse": () => win({ hdr: hdr({ center: search("Search this archive", "Ctrl F") }), side: sideB(), page: browseB() }),
      "b-create": () => win({ hdr: hdr(), side: sideB("new"), page: createB() }),
      "c-open": () => win({ hdr: noSide(hdr({ end: ib("more", "More") })), side: "", page: openC() }),
      "c-create": () => win({ hdr: noSide(hdr({ back: true })), side: "", page: createC() }),
      "c-progress": () => win({ hdr: noSide(hdr()), side: "", page: doneC() }),
    },
    icons: {
      box: '<path d="M12 3 20 7.2v9.6L12 21l-8-4.2V7.2z"/><path d="M4 7.2 12 11.5l8-4.3M12 11.5V21M8 5.1l8 4.3"/>',
    },
  });
})();
