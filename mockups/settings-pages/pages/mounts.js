// Connections › Mounts: three style-B layouts.
(() => {
  const DESC = "Drives at startup, shares from a NAS or Windows PC, and folders over SSH.";
  const page = (body) => () => swin({ sec: "connections", page: "Mounts", desc: DESC, body: body() });
  const S = "connections";
  // [icon, name, kind, from, to, state, colour]
  const MOUNTS = [
    ["globe", "Photos on NAS", "Windows or NAS share", "nas.local › Photos", "~/NAS/Photos", "Mounted", "blue"],
    ["server", "Media", "NFS share", "nas.local › /srv/media", "/mnt/media", "Ready", "violet"],
    ["drive", "Backup drive", "Drive at startup", "Backup · 1 TB partition", "/mnt/backup", "Mounted", "amber"],
    ["terminal", "Studio PC", "Folder over SSH", "sam@studio-pc", "~/Remote/Studio PC", "Away", "teal"],
  ];
  const KINDS = [["drive", "Drive at startup", "A partition, every time", "amber"], ["globe", "Windows or NAS share", "SMB shared folders", "blue"], ["server", "NFS share", "From a Linux server or NAS", "violet"], ["terminal", "Folder over SSH", "A computer you sign in to", "teal"]];
  const state = (st) => st === "Mounted" ? `<span class="pill dot">Mounted</span>` : st === "Ready" ? `<span class="pill dot" style="--tc:var(--sec-connections)">Mounts when opened</span>` : `<span class="pill dot" style="--tc:var(--text-tertiary)">Can't reach it</span>`;
  const mic = (ic, c) => `<span class="mt-ic" style="--mc:var(--sw-${c})">${icon(ic)}</span>`;
  const list = (sel, o = {}) => ocard("Your mounts", MOUNTS.map(([ic, n, k, f, t, st, c], i) => `<div class="opt ${i === sel ? "picked" : ""}">${mic(ic, c)}<div class="opt-text"><div>${n}</div><div class="d">${o.short ? k : o.sw ? `${f} → ${t}` : `In ${t}`}</div></div>${o.sw ? sw(st !== "Away") : state(st)}</div>`), { first: true, cls: "icons", act: o.act || "" });

  /* ── A: the mount you pick, drawn ─────────────────────────────────── */
  const aCtl = () => `
    ${list(0)}
    <div class="gtitle">Add a mount</div>
    <div class="mt-kinds">${KINDS.map(([ic, n, d, c]) => `<div class="mt-k card">${mic(ic, c)}<b>${n}</b></div>`).join("")}</div>
    ${ocard("", [nrow("The system's own", "Where Linux itself is mounted; left alone", "3", { ic: "lock", sec: S })], { cls: "icons" })}`;
  const aPv = () => `${pvhead("Photos on NAS", "A Windows or NAS share · added by you", `${btn("Open folder", "sm", "folder")}${btn("Unmount", "sm")}`)}
     <div class="mt-route card">
       <div class="mt-end">${mic("server", "blue")}<b>nas.local</b><span>Share: Photos</span></div>
       <div class="mt-arrow"><span class="lbl">SMB 3.1.1 · signed in as sam</span><i></i></div>
       <div class="mt-end">${mic("folder", "blue")}<b>~/NAS/Photos</b><span>A folder in your home</span></div>
     </div>
     <div class="mt-space card"><div class="r1"><b>1.2 TB used of 4 TB</b><span>2.8 TB free on the NAS</span></div><div class="mt-bar"><b style="width:30%"></b></div></div>
     ${ocard("", [
       orow("Mount when first opened", "A missing NAS never holds up starting", sw(true), { ic: "clock", sec: S }),
       orow("Read-only", "Files open but can't be changed", sw(false), { ic: "eye", sec: S }),
       orow("Signed in as", "The password is kept where only the system can read it", `${btn("Change", "sm")}`, { ic: "user", sec: S }),
     ], { cls: "icons" })}
     <div class="pvfoot">${icon("info")}<span>Stopping it leaves every file on the NAS where it is.</span><span class="sp"></span><span class="lnk dtx">Stop mounting it</span></div>`;
  const aBody = () => split(aCtl(), aPv(), { sec: S, cls: "mt-a" });

  /* ── B: adding a share, with the result drawn ─────────────────────── */
  const bCtl = () => `
    ${list(-1, { short: true, act: `<span class="note">4</span>` })}
    <div class="gtitle">Add</div>
    ${ocard("", KINDS.map(([ic, n, d, c], i) => `<div class="opt ${i === 1 ? "picked" : ""}">${radio(i === 1)}${mic(ic, c)}<div class="opt-text"><div>${n}</div><div class="d">${d}</div></div></div>`), { cls: "icons" })}`;
  const fld = (label, val, o = {}) => `<div class="mf ${o.cls || ""}"><label>${label}</label><span class="field ${o.focus ? "focus" : ""}">${o.ic ? icon(o.ic) : ""}<span class="${o.ph ? "ph" : ""}">${val}</span>${o.end || ""}</span></div>`;
  const bPv = () => `${pvhead("Add a Windows or NAS share", "Shared folders from a NAS or a Windows PC, over SMB.", "")}
     <div class="mt-form card">
       ${fld("Name", "Music on NAS")}
       ${fld("Server", "nas.local", { ic: "server" })}
       ${fld("Share", "Music", { ic: "folder", focus: true })}
       ${fld("Folder here", "~/NAS/Music", { ic: "home", end: `<span class="sp"></span>${icon("chev-d")}` })}
       <div class="mf wide"><div class="mt-found"><span>On nas.local:</span>${["Photos", "Music", "Backups", "Public"].map((x) => chip(x, x === "Music" ? "on" : "", "folder")).join("")}<span class="dim">Photos is already mounted</span></div></div>
       ${fld("Sign in", "sam", { ic: "user" })}
       ${fld("Password", "••••••••••", { ic: "lock" })}
       <div class="mf wide"><label></label><div class="mt-opts">${chk(true)}<span>Mount when first opened</span>${chk(false)}<span>Read-only</span><span class="sp"></span>${dd("Version: automatic")}</div></div>
     </div>
     <div class="mt-route card sm">
       <div class="mt-end">${mic("server", "blue")}<b>nas.local › Music</b><span>Found: 3 folders, 1,240 files</span></div>
       <div class="mt-arrow ok"><span class="lbl">${icon("check")}Test worked</span><i></i></div>
       <div class="mt-end">${mic("folder", "blue")}<b>~/NAS/Music</b><span>Made for you</span></div>
     </div>
     <div class="pvfoot">${icon("lock")}<span>Adding it asks for your password once.</span><span class="sp"></span>${btn("Test again", "sm ghost", "refresh")}${btn("Add share", "primary")}</div>`;
  const bBody = () => split(bCtl(), bPv(), { sec: S, cls: "mt-b" });

  /* ── C: where everything is mounted ───────────────────────────────── */
  // [depth, name, note, colour or "sys", icon]
  const TREE = [
    [0, "/", "Atlas · 1 TB · the system", "sys", "drive"],
    [1, "boot", "Starts Linux · the system", "sys", "power"],
    [1, "home/sam", "Your home folder", "", "home"],
    [2, "NAS/Photos", "Photos on NAS · nas.local", "blue", "globe"],
    [2, "Remote/Studio PC", "Studio PC · can't reach it", "teal", "terminal"],
    [1, "mnt", "", "", "folder"],
    [2, "media", "Media · NFS · mounts when opened", "violet", "server"],
    [2, "backup", "Backup drive · 1 TB partition", "amber", "drive"],
  ];
  const cCtl = () => `
    ${list(-1, { sw: true, act: btn("Add…", "sm", "plus") })}
    ${ocard("For all of them", [
      orow("Mount when first opened", "New mounts wait until something opens them", sw(true), { ic: "clock", sec: S }),
      orow("Ask for my password", "Remembered for a few minutes after", dd("Once"), { ic: "lock", sec: S }),
    ], { cls: "icons" })}`;
  const cPv = () => `${pvhead("Where everything is", "This computer's folders, with what's mounted where.", seg(["Tree", "List"], "Tree"))}
     <div class="mt-tree card">${TREE.map(([d, n, note, c, ic]) => `<div class="tn ${c === "sys" ? "sys" : c ? "mnt" : ""}" style="--d:${d};${c && c !== "sys" ? `--mc:var(--sw-${c})` : ""}">${d ? `<span class="tl"></span>` : ""}<span class="ti">${icon(ic)}</span><b>${n}</b>${note ? `<span class="tnote">${note}</span>` : ""}${c && c !== "sys" ? `<span class="tk">${icon("link")}</span>` : ""}</div>`).join("")}</div>
     <div class="mt-leg"><span><i class="sys"></i>The system's own, left alone</span><span><i class="mnt"></i>Yours, coloured by kind</span><span class="sp"></span><span class="dim">Click a mount to open it</span></div>`;
  const cBody = () => split(cCtl(), cPv(), { sec: S, cls: "mt-c" });

  REG("mounts", {
    name: "Mounts",
    summary: "Today Mounts opens on four big tiles for adding a mount, then the list of mounts, each one row with its source, folder and kind run together and two grey tags. Adding happens in a dialog per kind; what a mount is doing, and where its files end up, is in that one line of text.",
    problems: [
      "<b>Adding comes before what you have:</b> four large tiles fill the top half; your mounts are below them.",
      "<b>A mount is one dense line:</b> “//192.168.1.2/ · /mnt/nas · SMB share · when first opened”, plus tags like “Ready: mounts when opened” and “Yours, in /etc/fstab”.",
      "<b>No picture of where things go:</b> nothing shows the server, the share and the folder here as a path, or how full the share is.",
      "<b>Per-mount choices can't be changed:</b> mount when first opened and read-only are only asked when adding; afterwards there's just Open and Remove.",
      "<b>Tiles that look like buttons with no text weight:</b> the descriptions wrap to two lines at 800 px (“A folder on another computer you can sign in to”).",
    ],
    today: [["mounts-1280", "Today", ""], ["mounts-800", "Today at 800 px", ""]],
    options: [
      { id: "a", name: "The mount you pick, drawn", idea: "Your mounts come first, each with an icon for its kind and a clear state (mounted, mounts when opened, can't reach it). Picking one shows it on the right as a path: the server and share, an arrow with how it connects, and the folder it appears as here; then how full it is, and the choices that used to be fixed at adding (mount when first opened, read-only, who it signs in as). The four kinds to add sit below the list as small cards.",
        shots: [["a-mount", "Photos on NAS picked", ""], ["a-mount-800", "At 800 px", ""]] },
      { id: "b", name: "Adding, with the result drawn", idea: "Adding gets the preview instead of a dialog: pick a kind on the left, and the right becomes its form with the path it will make drawn under it, server to folder, filled in as you type. Test connection runs on its own once the share is typed and says what it found, so the Add button is only pressed when it's known to work.",
        shots: [["b-add", "Adding a share", ""], ["b-add-800", "At 800 px", ""]] },
      { id: "c", name: "Where everything is", idea: "The picture is this computer's folders as a short tree, with every mount hung where it appears: the system's own in grey (left alone), yours in the colour of their kind. It answers “where did my NAS end up” at a glance. The left lists the mounts with a switch to mount or unmount each, and the two choices that apply to all of them.",
        shots: [["c-tree", "The folder tree", ""], ["c-tree-800", "At 800 px", ""]] },
    ],
    pages: { "a-mount": page(aBody), "b-add": page(bBody), "c-tree": page(cBody) },
  });
})();
