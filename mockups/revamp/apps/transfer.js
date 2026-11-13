// Nyx Transfer on the revamp page: today's problems and three options.
(() => {
  const ICONS = {
    xfer: '<path d="M4 8h13M13.5 4.5 17 8l-3.5 3.5M20 16H7M10.5 12.5 7 16l3.5 3.5"/>',
    "arrow-r": '<path d="M4 12h15M13.5 6.5 19 12l-5.5 5.5"/>',
    "arrow-u": '<path d="M12 20V5M6.5 10.5 12 5l5.5 5.5"/>',
    key: '<circle cx="8" cy="15" r="4"/><path d="m11 12 8.5-8.5M16 7l2.5 2.5M14 9l2 2"/>',
    both: '<path d="M4 8h16M16.5 4.5 20 8l-3.5 3.5M20 16H4M7.5 12.5 4 16l3.5 3.5"/>',
    mirror: '<path d="M12 3v18" stroke-dasharray="2 2.5"/><path d="M3.5 7h5v10h-5zM15.5 7h5v10h-5z"/>',
  };

  const hdr = (o = {}) => header({
    icon: "xfer", name: "Transfer",
    start: o.tabs === false ? "" : `<div class="tx-tabs">${(o.tabList || [["website ⇄ homelab", true], ["Photos ⇄ nas.local", false]]).map(([t, on]) => `<div class="tab ${on ? "on" : ""}">${icon("xfer")}<span class="tt">${t}</span><span class="x">${icon("x")}</span></div>`).join("")}<span class="plus">${icon("plus")}</span></div>`,
    end: o.end !== undefined ? o.end : `<button class="newbtn">${icon("server")}<span>Connect</span>${icon("chev-d", "cv")}</button><button class="newbtn">${icon("sync")}<span>Sync folders</span></button>`,
  });

  /* ── Sample files ─────────────────────────────────────────────────────── */
  const LOCAL = [
    ["folder", "assets", "48 items", "Today 09:41"],
    ["folder", "css", "6 items", "Today 09:40"],
    ["folder", "js", "11 items", "Today 09:40"],
    ["code", "index.html", "18.2 KB", "Today 09:41"],
    ["code", "about.html", "9.4 KB", "Yesterday"],
    ["code", "pricing.html", "12.7 KB", "Today 09:38"],
    ["image", "og-image.png", "212 KB", "Mon"],
    ["file-text", "robots.txt", "64 bytes", "12 Oct"],
    ["file-text", "sitemap.xml", "3.1 KB", "Today 09:41"],
    ["image", "favicon.ico", "15 KB", "3 Sep"],
  ];
  const REMOTE = [
    ["folder", "assets", "44 items", "2 Nov"],
    ["folder", "css", "6 items", "2 Nov"],
    ["folder", "js", "10 items", "2 Nov"],
    ["folder", "old", "112 items", "18 Jul"],
    ["code", "index.html", "17.9 KB", "2 Nov"],
    ["code", "about.html", "9.4 KB", "2 Nov"],
    ["image", "og-image.png", "212 KB", "2 Nov"],
    ["file-text", "robots.txt", "64 bytes", "12 Oct"],
    ["file-text", "sitemap.xml", "2.8 KB", "2 Nov"],
    ["image", "favicon.ico", "15 KB", "3 Sep"],
  ];
  const fileRows = (rows, sel = [], o = {}) => rows.map(([ic, n, s, m], i) => `<div class="tx-row ${sel.includes(i) ? "sel" : ""}">${icon(ic, ic === "folder" ? "fo" : "")}<span class="n">${n}</span>${o.kind ? `<span class="k">${ic === "folder" ? "Folder" : n.split(".").pop().toUpperCase()}</span>` : ""}<span class="s">${s}</span>${o.noDate ? "" : `<span class="m">${m}</span>`}</div>`).join("");
  const colHead = (o = {}) => `<div class="tx-th"><span class="n">Name ${icon("chev-u")}</span>${o.kind ? `<span class="k">Kind</span>` : ""}<span class="s">Size</span>${o.noDate ? "" : `<span class="m">Modified</span>`}</div>`;

  /* ── Option A: two panes, tidied ──────────────────────────────────────── */
  const sideA = () => `
    ${grp("This computer", true, "", "accent")}
    ${navx("home", "Home")}
    ${navx("folder", "website", { active: true, sub: "Projects" })}
    ${navx("download", "Downloads")}
    ${navx("image", "Pictures")}
    ${grp("Servers", false, icon("plus"), "green")}
    ${navx("server", "homelab", { sub: "SFTP" })}
    ${navx("server", "nas.local", { sub: "WebDAV" })}
    ${navx("server", "web host", { sub: "FTPS" })}
    ${grp("Cloud, from rclone", false, icon("plus"), "violet")}
    ${navx("cloud", "Drive", { sub: "rclone" })}
    ${navx("cloud", "Backblaze B2", { sub: "rclone" })}
    ${grp("Workflows", false, icon("plus"), "amber")}
    ${navx("sync", "Photos to NAS", { sub: "Copy" })}
    ${navx("both", "Notes both ways", { sub: "Sync" })}
    <div class="foot">${icon("check-c", "ok")}<span>Transfers keep going when you close the window</span></div>`;

  const pane = (o) => `<div class="tx-pane ${o.focus ? "focus" : ""}">
    <div class="tx-ph"><span class="tx-loc">${icon(o.ic)}<b>${o.name}</b>${o.proto ? `<span class="tx-proto">${o.proto}</span>` : ""}${icon("chev-d", "cv")}</span><span class="sp"></span>${ib("chev-l", "Back (Alt ←)")}${ib("arrow-u", "Up a folder")}${ib("filter", "Filter (Ctrl F)")}${ib("sort", "Sort and hidden files")}</div>
    <div class="tx-crumb">${o.path.map((p, i) => `${i ? icon("chev-r", "sep") : ""}<span class="${i === o.path.length - 1 ? "cur" : ""}">${p}</span>`).join("")}</div>
    ${colHead(o)}
    <div class="tx-list">${fileRows(o.rows, o.sel || [], o)}</div>
    ${o.sel && o.sel.length ? `<div class="tx-selbar"><span><b>${o.sel.length} selected</b> · ${o.selSize}</span><span class="sp"></span>${btn("Copy path", "ghost")}<button class="btn primary">${icon("copy")}<span>Copy to ${o.to}</span>${icon("arrow-r")}</button></div>` : `<div class="tx-pfoot">${o.rows.length} items${o.note ? ` · ${o.note}` : ""}</div>`}
  </div>`;

  const qbar = () => `<div class="tx-qbar">${icon("arrow-u", "up")}<span class="t"><b>Uploading assets</b> to homelab</span>${prog(64)}<span class="m">64% · 5 s left</span><span class="sp"></span><span class="tx-qmore">1 waiting · 1 failed</span>${btn("Transfers", "ghost", "chev-u")}</div>`;

  const qrows = [
    ["arrow-u", "assets", "website → homelab · /var/www/site", 64, "18.4 of 28.7 MB · 2.1 MB/s · 5 s left", "run"],
    ["arrow-u", "pricing.html, index.html", "website → homelab · /var/www/site", 0, "Waiting for the upload above", "wait"],
    ["download", "backup-2026-11.tar.gz", "nas.local → Downloads", 38, "Failed: the connection was reset, after 2 tries", "fail"],
    ["arrow-u", "IMG_4410 … IMG_4482 (73 photos)", "Pictures → nas.local · /photos/2026", 100, "Done at 08:52 · 412 MB", "done"],
  ];
  const queue = () => `<div class="tx-queue">
    <div class="tx-qh"><b>Transfers</b><span class="c">1 running · 1 waiting · 1 failed</span><span class="sp"></span>${btn("Clear finished", "ghost")}${ib("chev-d", "Hide transfers")}</div>
    ${qrows.map(([ic, n, w, p, m, st]) => `<div class="tx-q ${st}">${icon(ic, "qi")}<div class="tx"><div class="r1"><b>${n}</b><span class="w">${w}</span></div>${st === "done" ? "" : prog(p, st === "fail" ? "bad" : st === "wait" ? "" : "")}<span class="m">${m}</span></div>
      <div class="qa">${st === "run" ? ib("pause", "Pause") + ib("x", "Cancel") : st === "wait" ? ib("x", "Cancel") : st === "fail" ? btn("Try again", "", "refresh") + ib("x", "Remove") : icon("check-c", "okc")}</div></div>`).join("")}
  </div>`;

  const panesA = (o = {}) => `<div class="tx-panes">
    ${pane({ ic: "monitor", name: "This computer", path: ["Projects", "website", "dist"], rows: LOCAL, sel: [0, 3, 5], selSize: "1.3 MB", to: "homelab", focus: true, noDate: o.narrow })}
    ${pane({ ic: "server", name: "homelab", proto: "SFTP", path: ["/", "var", "www", "site"], rows: REMOTE, note: "Connected", noDate: o.narrow })}
  </div>`;

  /* ── Option B: one server at a time ───────────────────────────────────── */
  const sideB = () => `
    ${grp("Servers", true, icon("plus"), "accent")}
    ${navx("server", "homelab", { active: true, sub: "SFTP" })}
    ${navx("server", "nas.local", { sub: "WebDAV" })}
    ${navx("server", "web host", { sub: "FTPS" })}
    ${grp("Cloud, from rclone", false, icon("import"), "violet")}
    ${navx("cloud", "Drive")}
    ${navx("cloud", "Backblaze B2")}
    ${grp("This computer", false, "", "green")}
    ${navx("home", "Home")}
    ${navx("download", "Downloads")}
    ${grp("Workflows", false, icon("plus"), "amber")}
    ${navx("sync", "Photos to NAS")}
    ${navx("both", "Notes both ways")}`;

  const activity = () => `<div class="insp tx-act">
    <div class="ihead tx-ah"><b>Activity</b><span class="sp"></span>${btn("Clear", "ghost sm")}</div>
    <div class="ibody">
      <div class="lab">Now</div>
      <div class="tx-ac"><div class="r1">${icon("arrow-u", "up")}<b>assets</b><span>64%</span></div>${prog(64)}<span class="m">18.4 of 28.7 MB · 5 s left</span><div class="qa">${btn("Pause", "sm", "pause")}${btn("Cancel", "sm ghost")}</div></div>
      <div class="tx-ac"><div class="r1">${icon("arrow-u", "up")}<b>2 files</b><span>Waiting</span></div><span class="m">pricing.html, index.html</span></div>
      <div class="lab">Needs you</div>
      <div class="tx-ac bad"><div class="r1">${icon("alert", "al")}<b>backup-2026-11.tar.gz</b></div><span class="m">The connection to nas.local was reset after 2 tries.</span><div class="qa">${btn("Try again", "sm", "refresh")}</div></div>
      <div class="lab">Earlier today</div>
      <div class="tx-ac done"><div class="r1">${icon("check-c", "okc")}<b>73 photos</b><span>08:52</span></div><span class="m">To nas.local · 412 MB</span></div>
      <div class="tx-ac done"><div class="r1">${icon("check-c", "okc")}<b>notes</b><span>07:30</span></div><span class="m">Notes both ways · 6 changes</span></div>
    </div>
    <div class="ifoot tx-dest">${icon("download")}<span>Downloads go to <b>~/Downloads</b></span><span class="sp"></span><span class="lnk">Change</span></div>
  </div>`;

  const serverPage = (o = {}) => `<div class="cols"><div class="main tx-one">
    <div class="tx-sbar"><div class="tx-crumb big">${["homelab", "var", "www", "site"].map((p, i) => `${i ? icon("chev-r", "sep") : ""}<span class="${i === 3 ? "cur" : ""}">${p}</span>`).join("")}</div><span class="sp"></span>${btn("Upload", "", "export")}<button class="btn primary">${icon("download")}<span>Download 2</span></button>${ib("filter", "Filter (Ctrl F)")}${ib("more", "View and more")}</div>
    ${colHead({ kind: !o.narrow, noDate: o.narrow })}
    <div class="tx-list">${fileRows(REMOTE, [4, 6], { kind: !o.narrow, noDate: o.narrow })}</div>
    <div class="tx-drop">${icon("export")}<span>Drop files here to upload them to <b>/var/www/site</b></span></div>
    ${o.menu ? menu(o.narrow ? 120 : 260, 238, [["download", "Download to Downloads", "Ctrl D"], ["xfer", "Copy to another place…"], "-", ["copy", "Copy path"], ["rename", "Rename", "F2"], "-", ["trash", "Delete from homelab", "", "danger"]], 250) : ""}
    ${o.narrow ? `<div class="tx-qbar">${icon("arrow-u", "up")}<span class="t"><b>assets</b></span>${prog(64)}<span class="m">64%</span><span class="sp"></span><span class="tx-qmore">1 failed</span>${btn("Activity", "ghost", "chev-u")}</div>` : ""}
  </div>${o.narrow ? "" : activity()}</div>`;

  const connectDlg = () => dialog("Connect to a server", "", [btn("Cancel"), btn("Connect and save", "primary")], `
    <div class="tx-protos">${[["server", "SFTP", "SSH servers", true], ["server", "FTPS", "FTP with TLS"], ["globe", "WebDAV", "Nextcloud, NAS"], ["server", "FTP", "Unencrypted"], ["import", "rclone", "Import a remote"]].map(([ic, n, d, on]) => `<div class="tx-pr ${on ? "on" : ""}">${icon(ic)}<b>${n}</b><span>${d}</span></div>`).join("")}</div>
    <div class="tx-form">
      <label>Name<div class="field"><span>homelab</span></div></label>
      <div class="tx-two"><label>Server<div class="field"><span>homelab.lan</span></div></label><label class="port">Port<div class="field"><span>22</span></div></label></div>
      <div class="tx-two"><label>User name<div class="field"><span>sam</span></div></label><label>Sign in with<span class="dd">SSH agent${icon("chev-d")}</span></label></div>
      <label>Open in<div class="field"><span>/var/www/site</span></div></label>
      <div class="tx-key">${icon("key")}<div><b>New server: check its key</b><span>SHA256:q3Vb…8fKe. Compare it with the one your server shows before you trust it.</span></div>${btn("Trust this key")}</div>
    </div>`, 560);

  /* ── Option C: workflows first ────────────────────────────────────────── */
  const sideC = (on) => `
    ${navx("columns", "Browse", { active: on === "browse" })}
    ${navx("history", "Activity", { badge: 1 })}
    ${grp("Workflows", false, icon("plus"), "accent")}
    ${navx("sync", "All workflows", { active: on === "all", cnt: 4 })}
    ${navx("", "Site deploy", { dot: "var(--sw-coral)", active: on === "site" })}
    ${navx("", "Photos to NAS", { dot: "var(--sw-green)" })}
    ${navx("", "Notes both ways", { dot: "var(--sw-teal)" })}
    ${navx("", "Projects to B2", { dot: "var(--sw-violet)" })}
    ${grp("Locations", false, icon("plus"), "violet")}
    ${navx("monitor", "This computer")}
    ${navx("server", "homelab", { sub: "SFTP" })}
    ${navx("server", "nas.local", { sub: "WebDAV" })}
    ${navx("cloud", "Backblaze B2", { sub: "rclone" })}`;

  const wf = [
    ["Site deploy", "coral", "website/dist", "monitor", "homelab /var/www/site", "server", "Mirror", "mirror", "Last run yesterday · 38 files · 2.4 MB", "", ""],
    ["Photos to NAS", "green", "Pictures", "monitor", "nas.local /photos", "server", "Copy new and changed", "arrow-r", "Running · 412 of 640 MB", "run", ""],
    ["Notes both ways", "teal", "Documents/notes", "monitor", "Drive /notes", "cloud", "Both ways", "both", "Today 07:30 · 6 changes", "", "2 conflicts: both copies kept"],
    ["Projects to B2", "violet", "Projects", "monitor", "Backblaze B2 /projects", "cloud", "Copy new and changed", "arrow-r", "Never run · first run needs a preview", "", ""],
  ];
  const wfPage = () => `${pbar2("Workflows", "Saved syncs between two places", btn("New from the panes", "", "columns") + btn("New workflow", "primary", "plus"))}
    <div class="content tx-wfs"><div class="tx-wgrid">${wf.map(([n, c, a, ai, b, bi, mode, mi, last, st, warn]) => `<div class="tx-wf ${st}" style="--wc: var(--sw-${c})">
      <div class="r1"><span class="dot"></span><b>${n}</b><span class="sp"></span>${ib("more", "More")}</div>
      <div class="tx-ab"><span class="loc">${icon(ai)}${a}</span><span class="mode">${icon(mi)}</span><span class="loc">${icon(bi)}${b}</span></div>
      <div class="meta"><span class="chip2">${mode}</span><span>${last}</span></div>
      ${st === "run" ? prog(64) : ""}
      ${warn ? `<div class="warn">${icon("alert")}${warn}</div>` : ""}
      <div class="acts">${st === "run" ? btn("Pause", "", "pause") + btn("Details", "ghost") : btn("Preview and run", "primary", "eye") + btn("Edit", "ghost", "pen")}</div>
    </div>`).join("")}</div>
    <div class="sechead tx-rh">Recent runs<span class="more">Activity</span></div>
    <div class="card tx-runs">${tbl([["Workflow"], ["When", "150px"], ["Result"], ["", "90px"]], [
      [`<span class="tx-d" style="background:var(--sw-teal)"></span>Notes both ways`, "Today 07:30", `<span class="tx-warnt">${icon("alert")}6 changes, 2 conflicts kept both</span>`, `<span class="tx-lnk">Show</span>`],
      [`<span class="tx-d" style="background:var(--sw-green)"></span>Photos to NAS`, "Yesterday 22:00", "73 photos copied · 412 MB", `<span class="tx-lnk">Show</span>`],
      [`<span class="tx-d" style="background:var(--sw-coral)"></span>Site deploy`, "Yesterday 16:12", "38 files · 2 deleted on homelab", `<span class="tx-lnk">Show</span>`],
    ])}</div></div>`;

  const changes = [
    ["new", "Copy", "pricing.html", "12.7 KB"],
    ["new", "Copy", "assets/img/team-2026.webp", "184 KB"],
    ["new", "Copy", "assets/img/hero-dark.webp", "96 KB"],
    ["upd", "Update", "index.html", "18.2 KB"],
    ["upd", "Update", "sitemap.xml", "3.1 KB"],
    ["upd", "Update", "css/site.css", "41 KB"],
    ["del", "Delete", "old/landing-2024.html", "22 KB"],
    ["del", "Delete", "old/promo.css", "4 KB"],
  ];
  const previewPage = () => `${pbar2("Site deploy", "Preview · nothing has changed yet")}
    <div class="cols"><div class="main">
      <div class="banner2 warn">${icon("alert")}<div class="tx"><b>Mirror deletes 2 files on homelab</b><span>They aren't in website/dist any more. Switch to “Copy new and changed” to keep them.</span></div></div>
      <div class="tx-counts">${[["12", "to copy", "green"], ["23", "to update", "blue"], ["2", "to delete", "red"], ["1,204", "already the same", "graphite"]].map(([n, l, c]) => `<div class="tx-cnt" style="--cc: var(--sw-${c})"><b>${n}</b><span>${l}</span></div>`).join("")}</div>
      <div class="tx-chg">${tbl([["What", "92px"], ["File"], ["Size", "80px"]], changes.map(([k, a, f, s]) => [`<span class="tx-badge ${k}">${a}</span>`, f, s]))}<div class="tx-morechg">${icon("chev-d")}29 more changes</div></div>
      <div class="tx-runbar"><span>Total 2.4 MB · about 10 seconds</span><span class="sp"></span>${btn("Cancel", "ghost")}${btn("Queue workflow", "primary", "check")}</div>
    </div>
    <div class="insp tx-wset"><div class="ibody">
      <div class="lab">From</div><div class="field">${icon("monitor")}<span>website/dist</span></div>
      <div class="lab">To</div><div class="field">${icon("server")}<span>homelab /var/www/site</span></div>
      <div class="lab">How</div>${seg(["Copy", "Mirror", "Both ways"], "Mirror")}
      <div class="lab">Leave out</div><div class="field tx-pat"><span>*.map<br>.DS_Store<br>drafts/**</span></div>
      <div class="lab">Options</div>
      <div class="card">
        <div class="row"><span class="k">Compare checksums</span>${sw(true)}</div>
        <div class="row"><span class="k">Speed limit</span><span class="v">None</span></div>
        <div class="row"><span class="k">Retries after an error</span><span class="v">2</span></div>
      </div>
    </div></div></div>`;

  REG("transfer", {
    name: "Transfer",
    icons: ICONS,
    summary: "Transfer can copy between this computer, SFTP, FTP, WebDAV and rclone remotes, and sync folders, but it opens on the same home folder twice, its actions are a row of unlabelled header icons, and saved servers hide in a dropdown on each pane.",
    problems: [
      "<b>Two copies of the same folder:</b> both panes open on your home folder, so the window shows one list twice and the tab reads “ken → ken”.",
      "<b>Five bare icons in the header:</b> new connection, import an rclone remote (an open-folder icon), sync folders, workflows and search; nothing says which is which until you hover.",
      "<b>Servers hide in a dropdown</b> at the top of each pane (“Local ▾”); there's no list of the places you've saved.",
      "<b>Copy arrows float between the panes</b> whether or not anything is selected, and they don't say what they'll copy or where.",
      "<b>Folder sizes are wrong:</b> folders show the size of their directory entry (“50 B”, “1.4 KiB”), not what's in them.",
      "<b>The queue is a dim footer:</b> “TRANSFERS ›” and “0 active · 0 waiting” in grey, with a greyed-out clear button; failures and progress are a click away.",
      "<b>Each pane's toolbar is five icons</b> (back, forward, up, refresh, more), shown greyed out when they can't do anything.",
      "<b>Sync and workflows are dialogs on top of dialogs:</b> the workflow editor, its preview and the confirmation each open a new window.",
    ],
    today: [["transfer-1280", "Today at 1280 px", "Both panes on the same home folder"], ["transfer-800", "Today at 800 px", "The same layout, squeezed"]],
    options: [
      { id: "a", name: "Two panes, tidied", idea: "Keeps the two-pane way of working, for anyone who copies between places all day. Saved places get the shared sidebar (this computer, servers, rclone remotes and workflows under coloured headings); clicking one opens it in the pane you're in. Selecting files brings up a labelled “Copy to homelab →” in that pane, and the transfers live in a drawer at the foot that shows progress even when closed.",
        shots: [["a-browse", "Copying to a server", "Selection bar names what's copied and where"], ["a-queue", "Transfers", "The drawer: pause, cancel, try again"], ["a-browse-800", "At 800 px", "Icon rail; size and name only"]] },
      { id: "b", name: "One server at a time", idea: "Like a classic upload client: pick a server in the sidebar and its files fill the window, with labelled Upload and Download, a drop zone for files from Files, and Activity on the right. Copying between two servers stays in the menu (“Copy to another place…”). Best for people who mostly push a site or pull backups from one place.",
        shots: [["b-server", "Browsing a server", "Upload, Download and Activity"], ["b-connect", "Connecting", "Protocols as choices; the host key explained"], ["b-server-800", "At 800 px", "Activity folds into a bar"]] },
      { id: "c", name: "Workflows first", idea: "For people who set up syncs once and let them run: workflows are cards showing both places, the mode, the last run and any conflicts. Preview is a page, not a dialog: counts of what will be copied, updated and deleted, the file list, and the workflow's settings beside it, with one button to queue it. Browsing the two panes is one row in the sidebar.",
        shots: [["c-workflows", "Workflows", "Each sync as a card"], ["c-preview", "Preview before running", "What changes, with the settings beside it"]] },
    ],
    pages: {
      "a-browse": () => win({ hdr: hdr(), side: sideA(), page: `${panesA({ narrow: NARROW })}${qbar()}` }),
      "a-queue": () => win({ hdr: hdr(), side: sideA(), page: `${panesA()}${queue()}` }),
      "b-server": () => win({ hdr: hdr({ tabs: false, end: `<button class="newbtn">${icon("plus")}<span>Connect</span></button>` }), side: sideB(), page: serverPage({ menu: true, narrow: NARROW }) }),
      "b-connect": () => win({ hdr: hdr({ tabs: false, end: `<button class="newbtn open">${icon("plus")}<span>Connect</span></button>` }), side: sideB(), page: serverPage(), over: connectDlg() }),
      "c-workflows": () => win({ hdr: hdr({ tabs: false, end: `<button class="newbtn">${icon("server")}<span>Connect</span>${icon("chev-d", "cv")}</button>` }), side: sideC("all"), page: wfPage() }),
      "c-preview": () => win({ hdr: hdr({ tabs: false, end: `<button class="newbtn">${icon("server")}<span>Connect</span>${icon("chev-d", "cv")}</button>` }), side: sideC("site"), page: previewPage() }),
    },
  });
})();
