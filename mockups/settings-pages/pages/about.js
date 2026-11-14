// System › About: this computer, Settings' and Omarchy's versions, your changes, backups and
// snapshots. Style B: controls on the left, a picture on the right.
(() => {
  const S = "system";
  const P = ["system", "About", "This computer, the versions it runs, and your settings."];
  const page = (body) => () => swin({ sec: P[0], page: P[1], desc: P[2], body: body() });

  /* ── Sample data ─────────────────────────────────────────────────── */
  // [icon, label, value, sub, bar%]
  const SPECS_L = [
    ["cpu", "Processor", "Ryzen 7 8840U", "8 cores · 5.1 GHz", 0],
    ["chip", "Memory", "32 GB", "11.4 GB in use", 36],
    ["monitor", "Graphics", "Radeon 780M", "Built in", 0],
  ];
  const SPECS_R = [
    ["drive", "Storage", "1 TB", "412 GB free", 59],
    ["laptop", "Display", "14″ · 2880 × 1800", "120 Hz", 0],
    ["battery", "Battery", "92% health", "312 charges", 92],
  ];
  // Your changes by page: [section, page, count, what]
  const CHANGES = [
    ["desktop", "Keyboard Shortcuts", 6, "6 of your own, 3 turned off"],
    ["hardware", "Displays", 4, "Scale, refresh rate, the arrangement"],
    ["desktop", "Tiling & Workspaces", 4, "Gaps, borders, new windows split"],
    ["input", "Trackpad", 3, "Tap to click, natural scrolling, gestures"],
    ["personalization", "Window Style", 3, "Rounded corners, blur, shadows"],
    ["hardware", "Sound", 2, "Maximum volume, the equalizer"],
    ["desktop", "Startup & Rules", 1, "2 startup programs"],
  ];

  /* ── Small parts ─────────────────────────────────────────────────── */
  const callout = ([ic, l, v, sub, bar]) => `<div class="ab-co"><span class="lic" style="--tc:var(--sec-${S})">${icon(ic)}</span><div><small>${l}</small><b>${v}</b><span>${sub}</span>${bar ? `<span class="prog ${bar > 80 ? "ok" : ""}"><b style="width:${bar}%"></b></span>` : ""}</div></div>`;
  const laptop = (cls = "") => `<div class="ab-lap ${cls}"><div class="ab-scr" style="background:${wall("night")}"><span class="ab-bar"></span><span class="ab-w1"></span><span class="ab-w2"></span></div><div class="ab-deck"><i></i></div></div>`;

  const versions = (o = {}) => ocard(o.head === undefined ? "Versions" : o.head, [
    orow("Settings 0.9.4", "Up to date · checked an hour ago", btn("Check now", "sm"), { ic: "cog", sec: S }),
    orow("Omarchy 4.5.1", "Stable channel · updates on Home", btn("Open Home", "sm"), { ic: "nyxapp", sec: S }),
    orow("Install extension updates by themselves", "Settings itself always asks first", sw(true), { ic: "puzzle", sec: S }),
  ], { cls: "icons", first: o.first });

  /* ═══ A: this computer, with its specs around it ═════════════════════ */
  const aCtl = () => `
    ${ocard("This computer", [
      orow("Name", "Shown on the network and to other devices", `<span class="field ab-name">Atlas${icon("pen")}</span>`, { ic: "laptop", sec: S }),
    ], { first: true, cls: "icons" })}
    ${versions()}
    ${ocard("Your settings", [
      nrow("Your changes", "23 settings changed here, on 7 pages", "23", { ic: "history", sec: S }),
      orow("Move your settings", "One file to keep or move", `${btn("Export…", "sm")}${btn("Import…", "sm")}`, { ic: "export", sec: S }),
      orow("Snapshot", "Save the system as it is now, to go back to", btn("Create", "sm"), { ic: "hist", sec: S }),
    ], { cls: "icons" })}`;

  const aPv = () => `
    ${pvhead("Atlas", "Lumen Book 14 · bought in 2025", btn("Copy details", "sm", "copy"))}
    <div class="ab-stage card">
      <div class="ab-col l">${SPECS_L.map(callout).join("")}</div>
      <div class="ab-mid">${laptop()}<b>Lumen Book 14</b><span>Serial LB14-27Q-0193</span></div>
      <div class="ab-col r">${SPECS_R.map(callout).join("")}</div>
    </div>
    <div class="ab-os card">${[["Omarchy", "4.5.1"], ["Linux", "7.2.9"], ["Hyprland", "0.57.2"], ["Up for", "3 days, 4 hours"]].map(([k, v]) => `<div><small>${k}</small><span>${v}</span></div>`).join("")}</div>
    ${pvfoot("Copy details puts all of this on the clipboard, for a bug report or a forum post.", "info")}`;

  /* ═══ B: your changes, as the picture ════════════════════════════════ */
  const bCtl = () => `
    <div class="card ab-me">${laptop("sm")}<div class="opt-text"><b>Atlas</b><span>Lumen Book 14 · Omarchy 4.5.1</span><span>Ryzen 7 · 32 GB · 1 TB</span></div>${icon("chev-r", "cv")}</div>
    ${versions()}
    ${ocard("Going back", [
      orow("Snapshot", "Save the system as it is now", btn("Create", "sm"), { ic: "hist", sec: S }),
      nrow("Earlier snapshots", "On Boot & Login", "6", { ic: "power", sec: S }),
    ], { cls: "icons" })}`;

  const bars2 = () => {
    const by = {};
    CHANGES.forEach(([s, , n]) => { by[s] = (by[s] || 0) + n; });
    const tot = Object.values(by).reduce((a, b) => a + b, 0);
    return `<div class="ab-stack">${Object.entries(by).sort((a, b) => b[1] - a[1]).map(([s, n]) => `<i style="flex:${n};background:var(--sec-${s})"></i>`).join("")}</div>
      <div class="ab-sleg">${Object.entries(by).sort((a, b) => b[1] - a[1]).map(([s, n]) => `<span><i style="background:var(--sec-${s})"></i>${SEC[s][1]} <b>${n}</b></span>`).join("")}</div>`;
  };
  const bPv = () => `
    ${pvhead("Your changes", "23 settings on 7 pages. Reset gives a page back to your own config.", btn("Reset all…", "sm ghost"))}
    <div class="card ab-sum">${bars2()}</div>
    <div class="card ab-ch">${CHANGES.map(([s, p, n, w], i) => `<div class="opt ${i === 0 ? "picked" : ""}">${T(SEC[s][3].find((x) => x[1] === p)?.[0] || SEC[s][2], s)}<div class="opt-text"><div>${p} <span class="ab-n">${n}</span></div><div class="d">${w}</div></div>${btn("Show", "sm ghost")}${btn("Reset", "sm")}</div>`).join("")}</div>
    <div class="ab-mv card"><span class="lic" style="--tc:var(--sec-${S})">${icon("export")}</span><div class="opt-text"><div>Take them with you</div><div class="d">All of these, and Settings' own preferences, in one file</div></div>${btn("Export…", "sm")}${btn("Import…", "sm")}</div>`;

  /* ═══ C: versions and going back ═════════════════════════════════════ */
  const cCtl = () => `
    ${versions({ first: true })}
    <div class="card ab-snap"><span class="lic" style="--tc:var(--success)">${icon("hist")}</span><div class="opt-text"><div><b>Take a snapshot</b></div><div class="d">The whole system as it is now. If an update goes wrong, pick it from the boot menu.</div></div>${btn("Create", "primary sm")}</div>
    ${ocard("Your settings", [
      nrow("Your changes", "On 7 pages", "23", { ic: "history", sec: S }),
      orow("Move your settings", "", `${btn("Export…", "sm")}${btn("Import…", "sm")}`, { ic: "export", sec: S }),
      nrow("This computer", "Lumen Book 14 · Ryzen 7 · 32 GB", "Atlas", { ic: "laptop", sec: S }),
    ], { cls: "icons" })}`;

  // [when, kind, title, sub, snapshot?]
  const TL = [
    ["Today", "now", "Running Omarchy 4.5.1 and Settings 0.9.4", "Up for 3 days"],
    ["Nov 10", "snap", "Before updating to Omarchy 4.5.1", "Taken by the update · 12 packages changed", true],
    ["Nov 10", "up", "Omarchy 4.5.1", "Faster theme switching, fixes for the bar"],
    ["Nov 6", "snap", "Before trying the new bar", "Taken by you", true],
    ["Nov 2", "up", "Settings 0.9.4", "Extensions can add pages to any section"],
    ["Oct 27", "snap", "Before updating to Omarchy 4.5.0", "Taken by the update · 48 packages changed", true],
    ["Oct 27", "up", "Omarchy 4.5.0", "The new Walker launcher and Wi-Fi sharing"],
  ];
  const cPv = () => `
    ${pvhead("Versions and snapshots", "What changed on Atlas, and the points you can go back to", seg(["All", "Snapshots"], "All"))}
    <div class="card ab-tl">${TL.map(([d, k, t, s, snap], i) => `<div class="ab-ti ${k} ${i === 1 ? "sel" : ""}"><span class="ab-td">${d}</span><span class="ab-tn"><i></i></span><div class="opt-text"><div>${t}</div><div class="d">${s}</div></div>${snap ? (i === 1 ? btn("How to go back", "sm") : `<span class="ab-sz">${["", "2.1 GB", "", "0.4 GB", "", "3.8 GB"][i]}</span>`) : ""}</div>`).join("")}</div>
    ${pvfoot("To go back, pick a snapshot from the boot menu; your own files aren't touched.", "info")}`;

  REG("about", {
    name: "About",
    icons: {
      laptop: '<rect x="5" y="5" width="14" height="10" rx="1.5"/><path d="M3 18.5h18"/>',
    },
    summary: "About is four groups in a column: Settings (its version, Check now, extension updates by themselves), Your changes (folded), Move your settings (Export and Import), and Omarchy (version, channel, a pointer to Home for updates, and Create snapshot). Nothing on it is about the computer itself.",
    problems: [
      "<b>Nothing about this computer:</b> no model, processor, memory, storage or name; the page called About only lists two version numbers.",
      "<b>Versions read like a log:</b> “Settings 0.1.1 · Up to date. Not checked yet.” and Omarchy's “Version 4.5.0rc2-1” and “Channel rc” are bare rows with the value far right.",
      "<b>Your changes is a folded row</b> with “2 options changed here” under it; what changed, and where, only shows after opening it.",
      "<b>Snapshots have no history:</b> Create snapshot sits at the bottom with no list of earlier ones or how to go back to one.",
      "<b>Long explanations above groups</b> (“Everything Settings keeps — its own preferences, Hyprland options, shortcuts, displays, sound and lighting — in one file.”) wrap to two lines at 800 px.",
      "<b>The tabs scroll at 800 px:</b> About is the last tab and its first one is cut to “: Language”.",
    ],
    today: [["about-1280", "Today", ""], ["about-800", "Today at 800 px", ""]],
    options: [
      { id: "a", name: "This computer, with its specs around it",
        idea: "About becomes about the computer: a drawing of it on the right with its processor, memory, graphics, storage, display and battery around it, memory and storage with how full they are, and the versions it runs underneath, with Copy details for a bug report. The left column renames it and keeps the versions, your changes, moving your settings and snapshots as short cards.",
        shots: [["a-computer", "Atlas", "A Lumen Book 14 with its specs around it"], ["a-computer-800", "At 800 px", "The computer above the cards"]] },
      { id: "b", name: "Your changes as the picture",
        idea: "The thing only Settings knows is what you've changed, so that's the picture: a bar of your changes by section, then every page with something changed, what it is, Show and Reset, and Export and Import at the foot. The computer shrinks to one card on the left above the versions and snapshots.",
        shots: [["b-changes", "23 changes on 7 pages", "Keyboard Shortcuts has the most"]] },
      { id: "c", name: "Versions and going back",
        idea: "A history of the computer: every Omarchy and Settings update and every snapshot on one timeline, newest first, with what each update brought and how big each snapshot is. The left column checks for updates and makes a snapshot in one click; selecting a snapshot explains how to go back to it from the boot menu.",
        shots: [["c-history", "Versions and snapshots", "The snapshot taken before 4.5.1 selected"]] },
    ],
    pages: {
      "a-computer": page(() => split(aCtl(), aPv(), { sec: S })),
      "b-changes": page(() => split(bCtl(), bPv(), { sec: S })),
      "c-history": page(() => split(cCtl(), cPv(), { sec: S })),
    },
  });
})();
