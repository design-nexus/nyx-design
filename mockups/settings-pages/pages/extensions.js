// System › Extensions: Settings extensions that add pages (device brands, apps), installed from
// a catalog or GitHub. Style B: extensions on the left, what the selected one adds on the right.
(() => {
  const S = "system";
  const P = ["system", "Extensions", "Pages for more devices and apps, added to Settings."];
  const page = (body) => () => swin({ sec: P[0], page: P[1], desc: P[2], body: body() });

  /* ── Sample data: [id, name, icon, colour, line, pages, version, state] ── */
  const INSTALLED = [
    ["lumen", "Lumen Book", "laptop", "amber", "Performance, fans, charge limit, keyboard light", 2, "1.2.0", "update"],
    ["clip", "Clipboard", "clip", "pink", "History, privacy, snippets", 1, "0.4.1", "on"],
    ["glimpse", "Glimpse", "search", "teal", "Local search, sources, models", 1, "0.3.0", "on"],
    ["pass", "Passwords", "lock", "green", "Vault locking, clipboard clearing", 1, "0.2.2", "on"],
    ["agents", "Agents", "sparkle", "violet", "Coding agents and their notifications", 0, "0.1.0", "off"],
  ];
  const CATALOG = [
    ["logi", "Logitech", "mouse", "blue", "Battery, pointer speed, buttons and backlight", "found"],
    ["cam", "Webcams", "camera", "coral", "Zoom, focus, framing and tracking", ""],
    ["head", "Headsets", "headphones", "violet", "Battery, sidetone and lights", ""],
    ["razer", "Razer", "keyboard", "green", "Lighting and sensitivity", ""],
    ["print", "Label printers", "printer", "graphite", "Tape, margins and templates", ""],
  ];

  /* ── Small parts ─────────────────────────────────────────────────── */
  const xic = (ic, c, cls = "") => `<span class="ex-ic ${cls}" style="--c:var(--sw-${c})">${icon(ic)}</span>`;
  const instRow = ([id, n, ic, c, line, pages, v, st], sel) => `<div class="opt ex-row ${sel ? "picked" : ""} ${st === "off" ? "off" : ""}">${xic(ic, c)}<div class="opt-text"><div>${n}${st === "update" ? ' <span class="ex-up">Update</span>' : ""}</div><div class="d">${st === "off" ? "Turned off · its pages are hidden" : `${pages} page${pages === 1 ? "" : "s"} · ${v}`}</div></div>${sw(st !== "off")}</div>`;

  /* ═══ A: installed, and where their pages go ═════════════════════════ */
  const aCtl = () => `
    <div class="ubar card ex-ubar"><span class="lic" style="--tc:var(--accent)">${icon("download")}</span><div class="opt-text"><div><b>1 update</b> · Lumen Book 1.3.0</div><div class="d">Checked this morning</div></div>${btn("Update", "primary sm")}</div>
    ${ocard("Installed", INSTALLED.map((x, i) => instRow(x, i === 0)), { act: `${btn("Look for devices", "sm ghost", "refresh")}` })}
    ${ocard("", [
      nrow("Get more extensions", "Devices and apps from the catalog", "12", { ic: "puzzle", sec: S }),
      nrow("Add from GitHub", "Any repository with an extension.toml", "", { ic: "code", sec: S }),
    ], { cls: "icons" })}`;

  // A small Settings: the sidebar, and the two sections that gain a page.
  const MAP = [
    ["hardware", "Hardware", ["Displays", "Sound", "Power & Battery", "Disks"], "Lumen Book"],
    ["personalization", "Personalization", ["Appearance", "Window Style", "Bar"], "Keyboard Light"],
  ];
  const map = () => `<div class="card ex-map">
      <div class="ex-side">${SECS.map(([id, name, ic]) => `<div class="ex-sr ${MAP.some((m) => m[0] === id) ? "on" : ""}">${T(ic, id)}<span>${name}</span>${MAP.some((m) => m[0] === id) ? '<b class="ex-plus">+1</b>' : ""}</div>`).join("")}</div>
      <div class="ex-tabs">${MAP.map(([id, name, tabs, nw]) => `<div class="ex-sec" style="--sc:var(--sec-${id})"><small>${name}</small><div class="ex-strip">${tabs.map((t) => `<span>${t}</span>`).join("")}<span class="new">${nw}<em>New</em></span></div></div>`).join("")}
        <div class="ex-mini"><div class="ex-mh">${xic("laptop", "amber", "sm")}<b>Lumen Book</b><span>Hardware</span></div>
          <div class="ex-mr"><span>Performance</span>${seg(["Quiet", "Balanced", "Fast"], "Balanced")}</div>
          <div class="ex-mr"><span>Charge limit</span><span class="ex-sl">${slider(80, 0)}</span><small>80%</small></div>
          <div class="ex-mr"><span>Fans</span><span class="dd">Automatic${icon("chev-d")}</span></div>
        </div>
      </div>
    </div>`;

  const aPv = () => `
    ${pvhead("Lumen Book", "For this laptop · adds 2 pages · 1.2.0", `${btn("Remove", "ghost sm", "trash")}${btn("Update to 1.3.0", "sm", "download")}`)}
    ${map()}
    <div class="notes card ex-notes"><div class="nh">New in 1.3.0</div><ul>${["A Quiet mode that keeps the fans off below 60 °C.", "The charge limit can stop at 60%, for a laptop that stays plugged in.", "Keyboard light follows your theme's accent colour."].map((x) => `<li>${x}</li>`).join("")}</ul></div>
    ${pvfoot("Turning an extension off hides its pages and keeps its settings; Remove deletes it.", "info")}`;

  /* ═══ B: a catalog to browse ═════════════════════════════════════════ */
  const catRow = ([id, n, ic, c, line, st], sel) => `<div class="opt ex-row ${sel ? "picked" : ""}">${xic(ic, c)}<div class="opt-text"><div>${n}${st === "found" ? ' <span class="ex-found">Plugged in</span>' : ""}</div><div class="d">${line}</div></div>${btn("Install", "sm")}</div>`;
  const bCtl = () => `
    <div class="ex-top"><div class="field">${icon("search")}<span class="ph">Search extensions</span></div>${seg(["All", "Installed 5", "Available"], "Available")}</div>
    ${ocard("Devices", CATALOG.slice(0, 4).map((x, i) => catRow(x, i === 0)), { note: "From the Nyx catalog" })}
    ${ocard("Apps", [catRow(["notes", "Notes sync", "file-text", "amber", "Folders, sync and sharing for Notes", ""]), catRow(["media", "Media keys", "music", "pink", "Which player the keys control", ""])])}`;

  const bPv = () => `
    <div class="ex-hero card">${xic("mouse", "blue", "lg")}<div class="ex-ht"><b>Logitech</b><span>Battery, pointer speed, scrolling, buttons, backlight, Easy-Switch and lighting for Logitech mice and keyboards.</span><div class="ex-meta">${chip("1.4.2")}${chip("By Nyx")}${chip("Needs nothing else", "acc")}</div></div>${btn("Install", "primary", "download")}</div>
    <div class="ex-found-bar">${icon("check-c")}<span><b>A Logitech mouse is plugged in.</b> Installing adds its page under Input.</span></div>
    <div class="ex-two">
      <div class="card ex-works"><div class="nh">Works with</div>${["Mice and keyboards that speak HID++", "Unifying and Bolt receivers", "Lightspeed gaming mice"].map((x) => `<div class="ex-w">${icon("check")}${x}</div>`).join("")}</div>
      <div class="card ex-pagepv"><div class="nh">The page it adds · Input › Logitech</div>
        <div class="ex-pp"><div class="ex-mouse"><i class="b1"></i><i class="b2"></i><i class="wh"></i><em>87%</em></div>
          <div class="ex-pr"><div><span>Pointer speed</span>${slider(55, 0)}</div><div><span>Smooth scrolling</span>${sw(true)}</div><div><span>Thumb button</span><span class="dd">Back${icon("chev-d")}</span></div></div></div>
      </div>
    </div>
    ${ocard("", [
      orow("Talks to Logitech devices", "Over USB, Bluetooth and their receivers", "", { ic: "usb", sec: S }),
      orow("Keeps its settings with yours", "In your config folder, so they go into backups", "", { ic: "folder", sec: S }),
      orow("Doesn't use the internet", "Updates come through Settings", "", { ic: "globe", sec: S }),
    ], { cls: "icons ex-can" })}
    ${pvfoot("Extensions run as you; the catalog's are checked by Nyx.", "shield", `<span class="lnk">Add one from GitHub…</span>`)}`;

  /* ═══ C: devices first ═══════════════════════════════════════════════ */
  const cCtl = () => `
    <div class="ubar card ex-ubar"><span class="lic" style="--tc:var(--sec-${S})">${icon("refresh")}</span><div class="opt-text"><div><b>4 devices</b> connected</div><div class="d">Looked a minute ago</div></div>${btn("Look again", "sm")}</div>
    ${ocard("Installed", INSTALLED.map((x) => instRow(x, false)), { act: `<span class="note">1 update</span>${btn("Update", "sm")}` })}
    ${ocard("", [nrow("Catalog and GitHub", "12 extensions to add", "", { ic: "puzzle", sec: S })], { cls: "icons" })}`;

  // Devices around the laptop: [label, icon, x%, y%, state, text]
  const DEV = [
    ["Keyboard", "keyboard", "left:4%;top:13%", "ok", "Built in · Lumen Book"],
    ["Mouse", "mouse", "right:4%;top:13%", "add", "Logitech can add its settings"],
    ["USB webcam", "camera", "left:4%;top:87%", "none", "Works; nothing extra to set"],
    ["Headset", "headphones", "right:4%;top:87%", "add", "Headsets can add battery and sidetone"],
  ];
  const cPv = () => `
    ${pvhead("What's connected", "Each device, and the extension that adds settings for it", btn("Look again", "sm", "refresh"))}
    <div class="ex-desk card">
      <div class="ex-lap"><div class="ex-scr" style="background:${wall("night")}"></div><div class="ex-deck"></div><b>Atlas</b><span>Lumen Book 14</span></div>
      <svg class="ex-lines" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path d="M44 34 L22 16"/><path d="M56 34 L78 16" class="add"/><path d="M44 56 L22 84" class="none"/><path d="M56 56 L78 84" class="add"/>
      </svg>
      ${DEV.map(([n, ic, pos, st, t]) => `<div class="ex-dev ${st}" style="${pos}">${xic(ic, st === "ok" ? "amber" : st === "add" ? "blue" : "graphite", "sm")}<div><b>${n}</b><span>${t}</span></div>${st === "add" ? btn("Install", "sm") : st === "ok" ? icon("check-c", "ex-ok") : ""}</div>`).join("")}
    </div>
    <div class="ex-legend"><span><i class="ok"></i>Has its settings</span><span><i class="add"></i>An extension can add them</span><span><i class="none"></i>Nothing extra needed</span></div>`;

  REG("extensions", {
    name: "Extensions",
    icons: {
      camera: '<rect x="3" y="7" width="13" height="10" rx="2"/><path d="m16 10.5 5-3v9l-5-3z"/>',
      laptop: '<rect x="5" y="5" width="14" height="10" rx="1.5"/><path d="M3 18.5h18"/>',
    },
    summary: "Extensions is a long card per state: Installed (each with its description, its pages, its version, Remove and a switch), then Available from the catalog, then a GitHub address box. Look for devices and Check for updates sit by the first heading.",
    problems: [
      "<b>Four lines of text per extension:</b> a description, “Pages: …”, “Version …” and sometimes “No matching devices found right now”, all the same size, so the list reads as a block of text.",
      "<b>You can't see what it adds:</b> “Pages: ASUS, Aura Lighting” names the pages but not where they appear in Settings or what's on them.",
      "<b>Remove and the switch sit side by side</b> on every row with no hint of the difference (off hides the pages; Remove deletes it).",
      "<b>Updates are a row among the extensions:</b> “Updates available (1)” with Update all, and a small tag on the row; nothing says what's new.",
      "<b>The catalog doesn't know your devices:</b> available extensions are a plain list; nothing says a Logitech mouse is plugged in right now.",
      "<b>Buttons crowd the heading</b> at 800 px, and the descriptions wrap to three lines beside Remove and the switch.",
    ],
    today: [["extensions-1280", "Today", ""], ["extensions-800", "Today at 800 px", ""]],
    options: [
      { id: "a", name: "Installed, and where their pages go",
        idea: "The left column is what you have: an update bar when one is waiting, then each installed extension with its icon, how many pages it adds and a switch. The selected one is drawn on the right as a small Settings: the sections that gain a page, its new tabs marked, and a glimpse of the page itself, with what's new in its update under it. The catalog and GitHub are rows that open their own pages.",
        shots: [["a-pages", "Lumen Book selected", "Its two pages in Hardware and Personalization, and what's new in 1.3.0"], ["a-pages-800", "At 800 px", "The map above the list"]] },
      { id: "b", name: "A catalog to browse",
        idea: "A small store for extensions. The left column lists the catalog by kind, with a search and All, Installed and Available; anything matching a device that's plugged in says so. The right side is the selected extension's page: what it does, what it works with, a picture of the page it adds and where, and Install.",
        shots: [["b-catalog", "Logitech in the catalog", "A Logitech mouse is plugged in; its page would go under Input"]] },
      { id: "c", name: "Devices first",
        idea: "Extensions exist for your hardware, so the picture is your hardware: the computer in the middle and every connected device around it, each marked with whether it has its settings, could get them from an extension (with Install right there), or needs nothing. The installed list with its switches stays on the left.",
        shots: [["c-devices", "What's connected", "The mouse and headset could get settings; the webcam needs nothing"]] },
    ],
    pages: {
      "a-pages": page(() => split(aCtl(), aPv(), { sec: S })),
      "b-catalog": page(() => split(bCtl(), bPv(), { sec: S })),
      "c-devices": page(() => split(cCtl(), cPv(), { sec: S })),
    },
  });
})();
