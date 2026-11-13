// Nyx Settings on the revamp page: today's problems and three options.
(() => {
  // Every page, by section. Assistant and Local AI share one section here, so their two
  // Models pages become one.
  const SECS = [
    ["connections", "Connections", "wifi", [["wifi", "Wi-Fi"], ["bluetooth", "Bluetooth"], ["phone", "Connected Devices"], ["network", "Network"], ["server", "Mounts"], ["share", "Sharing"]]],
    ["hardware", "Hardware", "monitor", [["monitor", "Displays"], ["volume", "Sound"], ["battery", "Power & Battery"], ["lock", "Lock Screen"], ["printer", "Printers"], ["drive", "Disks"], ["mouse", "Logitech Devices"]]],
    ["personalization", "Personalization", "palette", [["palette", "Appearance"], ["window", "Window Style"], ["bar", "Bar & Notifications"], ["puzzle", "Bar Plugins"], ["moon", "Night Light"]]],
    ["desktop", "Desktop", "grid", [["dock", "Dock"], ["switcher", "Switcher"], ["sliders", "Control Center"], ["bell", "Notifications"], ["grid", "Tiling & Workspaces"], ["layers", "Workspace Profiles"], ["keyboard", "Keyboard Shortcuts"], ["startup", "Startup & Rules"], ["screenshot", "Capture & Tools"]]],
    ["input", "Input", "keyboard", [["keyboard", "Keyboard"], ["mouse", "Mouse"], ["touchpad", "Trackpad"]]],
    ["accounts", "Accounts", "user", [["users", "Users"], ["shield", "Sign-in & Security"], ["cloud", "Online Accounts"]]],
    ["assistant", "Assistant & AI", "sparkle", [["sparkle", "Assistant"], ["aura", "Aura"], ["mic", "Voice"], ["shield", "Permissions"], ["history", "Activity"], ["pulse", "Performance"], ["cpu", "Local AI"], ["cube", "Models"]]],
    ["system", "System", "cog", [["globe", "Time & Language"], ["power", "Boot & Login"], ["apps", "Default Apps"], ["store", "Software"], ["download", "Updates"], ["server", "Services"], ["puzzle", "Extensions"], ["nyxapp", "Nyx apps"], ["info", "About"]]],
  ];
  const SEC = Object.fromEntries(SECS.map((s) => [s[0], s]));

  // An icon on a tile in its section's colour.
  const T = (ic, sec) => `<i data-i="${ic}" class="ctile" style="--tc:var(--sec-${sec})"></i>`;
  // A group heading in a section's colour (the kit's grp takes swatch names only).
  const sgrp = (t, sec, first = false, act = "") => grp(t, first, act, "accent").replace("var(--accent)", `var(--sec-${sec})`);
  const slider = (pct, w = 200) => `<div class="slider" style="width:${w}px"><div class="tr"><div class="fill" style="width:${pct}%"></div></div><div class="kn" style="left:${pct}%"></div></div>`;
  const sl = (pct, val, w) => `<span class="slw">${slider(pct, w)}<span class="readout">${val}</span></span>`;
  const fold = (t, n = "") => `<div class="fold">${icon("chev-r")}<span>${t}</span>${n ? `<span class="n">${n}</span>` : ""}</div>`;

  const hdr = (o = {}) => `<header class="hdr"><div class="hdr-id">${icon("cog", "app-ic")}<span class="app-name">Settings</span></div><div class="hdr-start">${o.noSide ? "" : ib("sidebar", "Sidebar (Ctrl+B)")}${o.start || ""}</div><div class="hdr-center">${o.center !== undefined ? o.center : search("Search all settings", "Ctrl F", "wide")}</div><div class="hdr-end">${o.end || ""}</div></header>`;

  /* ── Option A: two levels ───────────────────────────────────────────── */
  const sideA = (on) => `
    <div class="navx cat ${on === "home" ? "active" : ""}">${T("home", "home")}<span class="ct"><b>Home</b><small>This computer and updates</small></span><span class="badge">12</span></div>
    <div class="hr"></div>
    ${SECS.map(([id, name, ic, pages]) => `<div class="navx cat ${on === id ? "active" : ""}">${T(ic, id)}<span class="ct"><b>${name}</b><small>${pages.slice(0, 3).map((p) => p[1]).join(", ")}</small></span></div>`).join("")}
    <div class="foot">${icon("history")}<span>Your changes · 23 settings</span></div>`;

  const shead = (sec, on, desc) => {
    const [, name, , pages] = SEC[sec];
    return `<div class="shead" style="--sc:var(--sec-${sec})">
      <div class="sh1"><span class="sk">${name}</span><span class="sp"></span>${btn("Open config", "ghost sm", "file-text")}</div>
      <div class="sh2"><b>${on}</b><span>${desc}</span></div>
      <div class="stabs">${pages.map(([, t]) => `<span class="${t === on ? "on" : ""}">${t}</span>`).join("")}</div></div>`;
  };

  const faders = (vals, labels, pre) => `<div class="faders">${vals.map((v, i) => `<div class="fd"><span class="ft"><span class="z"></span><b style="bottom:${v}%"></b></span><small>${labels[i]}</small></div>`).join("")}${pre !== undefined ? `<div class="fd pre"><span class="ft"><span class="z"></span><b style="bottom:${pre}%"></b></span><small>Preamp</small></div>` : ""}</div>`;

  const soundBody = () => `<div class="content"><div class="clamp" style="--clamp: 740px">
    ${setcard("Output", [
      ["Output device", "", dd("Studio Speakers", "volume")],
      ["Volume", "", sl(64, "64%")],
      ["Maximum volume", "The volume keys go up to this.", dd("100%")],
    ]).replace('gtitle"', 'gtitle first"')}
    <div class="gtitle">Equalizer & preamp<span class="note">Nine bands for every app, with a limiter so a boost doesn't distort.</span></div>
    <div class="card eqcard">
      <div class="opt"><div class="opt-text"><div>Equalizer</div><div class="d">Sound passes through it to Studio Speakers.</div></div>${dd("Loudness")}${ib("plus", "Save as a preset")}${sw(true)}</div>
      <div class="eqb">${faders([62, 58, 52, 50, 48, 50, 54, 60, 64], ["31", "62", "125", "250", "500", "1k", "2k", "4k", "8k"], 66)}</div>
      <div class="opt hr2"><div class="opt-text"><div class="okline">${icon("check-c")} Up to +4.0 dB louder.</div></div>${btn("Flat", "ghost sm")}</div>
    </div>
    ${setcard("Input", [["Microphone", "", dd("Built-in microphone", "mic")], ["Input level", "", sl(72, "72%")]])}
    ${fold("Apps playing sound", "2")}${fold("Remembered devices", "4")}${fold("Troubleshooting")}
  </div></div>`;

  const gest = (dir, label, act) => `<div class="gt"><span class="ga">${icon(dir)}</span><div class="tx"><small>${label}</small>${dd(act)}</div></div>`;
  const trackpadBody = () => `<div class="content"><div class="clamp" style="--clamp: 740px">
    ${setcard("Tapping", [
      ["Tap to click", "A light one-finger tap clicks.", sw(true)],
      ["Two- and three-finger taps", "Which button a multi-finger tap presses.", dd("Right, then middle")],
      ["Tap and drag", "Tap, then touch again and move to drag.", sw(true)],
    ]).replace('gtitle"', 'gtitle first"')}
    ${setcard("Scrolling", [["Natural scrolling", "Content follows your fingers. Turn off to reverse it.", sw(true)], ["Scroll speed", "", sl(45, "0.9×", 180)]])}
    <div class="gtitle gflex">Gestures<span class="sp"></span>${seg(["Three fingers", "Four fingers"], "Three fingers")}</div>
    <div class="card gcard"><div class="ggrid">
      ${gest("swipe-lr", "Swipe left or right", "Switch workspace")}${gest("swipe-u", "Swipe up", "Overview")}${gest("swipe-d", "Swipe down", "Show the desktop")}
      ${gest("pinch-in", "Pinch in", "Close the window")}${gest("pinch-out", "Pinch out", "Fullscreen")}${gest("tap3", "Tap", "Middle click")}
    </div>
    <div class="opt"><div class="opt-text"><div>Reverse left / right</div></div>${sw(false)}</div>
    <div class="opt"><div class="opt-text"><div>Loop around</div><div class="d">Swipe on from 5 back to 1, and from 1 to 5.</div></div>${sw(true)}</div></div>
    ${fold("Clicking", "4")}${fold("Swipe feel", "4")}
  </div></div>`;

  /* ── Option B: search first ─────────────────────────────────────────── */
  const qt = (ic, t, s, on, sec) => `<div class="qt ${on ? "on" : ""}" style="--tc:var(--sec-${sec})"><span class="qi">${icon(ic)}</span><div class="tx"><b>${t}</b><span>${s}</span></div>${sw(on)}</div>`;
  const qwide = (ic, t, inner, sec, span) => `<div class="qt wide" style="--tc:var(--sec-${sec});grid-column:span ${span}"><span class="qi">${icon(ic)}</span><div class="tx"><b>${t}</b></div>${inner}</div>`;
  const meter = (pct, label, c) => `<div class="mt">${ring(pct, { size: 38, c, label: " " })}<div class="tx"><b>${pct}%</b><span>${label}</span></div></div>`;
  const pcStrip = () => `<div class="pcs card">
      <span class="orb"></span><div class="tx"><b>Atlas</b><span>Lumen Book 14 · Omarchy 4.5</span></div>
      <div class="mts">${meter(12, "Processor", "var(--sw-blue)")}${meter(41, "Memory", "var(--sw-violet)")}${meter(61, "Disk", "var(--sw-amber)")}${meter(86, "Battery", "var(--sw-green)")}</div>
      <span class="vsep"></span><div class="upd"><b>12 updates</b><span>Omarchy and 11 packages</span></div>${btn("Update now", "primary", "download")}
    </div>`;
  const homeB = () => `<div class="content bh"><div class="clamp" style="--clamp: 960px">
    <div class="bigsearch">${icon("search")}<span class="ph">Search 640 settings</span><span class="hint">Try “brightness”, “hotkeys” or “wifi”</span><span class="key">Ctrl F</span></div>
    <div class="qgrid">
      ${qt("wifi", "Wi-Fi", "Home-5G", true, "connections")}${qt("bluetooth", "Bluetooth", "2 connected", true, "connections")}${qt("bell", "Do not disturb", "Off", false, "desktop")}${qt("moon", "Night Light", "From sunset", false, "personalization")}
      ${qwide("volume", "Volume", slider(64, 0), "hardware", 3)}${qwide("sun", "Brightness", slider(80, 0), "hardware", 4)}${qwide("battery", "Power", seg(["Saver", "Balanced", "Performance"], "Balanced"), "hardware", 5)}
    </div>
    ${pcStrip()}
    <div class="catgrid">${SECS.map(([id, name, ic, pages]) => `<div class="catc" style="--tc:var(--sec-${id})"><div class="cch">${T(ic, id)}<b>${name}</b></div><div class="ccl">${pages.slice(0, 5).map(([, t]) => `<span>${t}</span>`).join("")}${pages.length > 5 ? `<span class="more3">${pages.length - 5} more</span>` : ""}</div></div>`).join("")}</div>
  </div></div>`;

  const RES = () => [
    ["hardware", "monitor", "Displays", [["<mark>Bright</mark>ness", "Laptop screen.", sl(80, "80%", 160)]]],
    ["hardware", "battery", "Power & Battery", [["Display <mark>bright</mark>ness on battery", "Dims when you unplug.", sl(55, "55%", 160)], ["Keyboard backlight", "Matches “brightness”.", seg(["Off", "Low", "High"], "Low")]]],
    ["hardware", "lock", "Lock Screen", [["Dim the screen after", "Matches “brightness”.", dd("2 minutes")]]],
    ["personalization", "moon", "Night Light", [["Warmth", "Warmer colours in the evening. Matches “screen brightness”.", sl(35, "4500 K", 160)]]],
    ["desktop", "keyboard", "Keyboard Shortcuts", [["<mark>Bright</mark>ness up and down", "The keys that change it.", `<span class="kc">${kbd("F5")} ${kbd("F6")}</span>`]]],
  ];
  const searchB = () => `<div class="cols"><div class="list rlist">
      <div class="rl">${navx("search", "All results", { active: true, cnt: 6 })}</div>
      ${RES().map(([sec, ic, p, rows]) => `<div class="rl"><div class="navx">${T(ic, sec)}<span>${p}</span><span class="cnt">${rows.length}</span></div></div>`).join("")}
      <div class="rhint">${icon("info")} <span>${kbd("↑")} ${kbd("↓")} go through the results; ${kbd("Enter")} opens the page.</span></div>
    </div>
    <div class="main"><div class="content rs"><div class="clamp" style="--clamp: 720px">
      ${RES().map(([sec, ic, p, rows], gi) => `<div class="rgrp"><div class="rgh" style="--sc:var(--sec-${sec})">${T(ic, sec)}<span class="sk2">${SEC[sec][1]}</span>${icon("chev-r", "cr")}<b>${p}</b><span class="sp"></span><span class="op">Open page ${icon("chev-r")}</span></div>
        <div class="card ${gi === 0 ? "focus1" : ""}">${rows.map(([t, d, c]) => `<div class="opt"><div class="opt-text"><div>${t}</div><div class="d">${d}</div></div>${c}</div>`).join("")}</div></div>`).join("")}
    </div></div></div></div>`;

  const wifiB = () => `<div class="sibs">${SEC.connections[3].map(([, t]) => chip(t, t === "Wi-Fi" ? "on" : "")).join("")}</div>
    <div class="content"><div class="clamp" style="--clamp: 680px">
      <div class="card"><div class="opt"><span class="bigic" style="--tc:var(--sec-connections)">${icon("wifi")}</span><div class="opt-text"><div><b>Wi-Fi</b></div><div class="d">On · 6 networks nearby</div></div>${sw(true)}</div></div>
      <div class="gtitle">Connected to</div>
      <div class="card"><div class="opt">${icon("wifi", "sig s4")}<div class="opt-text"><div>Home-5G</div><div class="d">Secured · Excellent signal · 5 GHz</div></div>${btn("Details")}</div></div>
      <div class="gtitle gflex">Nearby networks<span class="sp"></span>${ib("refresh", "Look again")}</div>
      <div class="card">${[["Harbor Café", "Open · good signal", "s3", false], ["Neighbours-2G", "Secured · fair signal", "s2", true], ["Studio Guest", "Secured · weak signal", "s1", true], ["Printer-Direct", "Secured · weak signal", "s1", true]].map(([n, d, s, l]) => `<div class="opt">${icon("wifi", `sig ${s}`)}<div class="opt-text"><div>${n}</div><div class="d">${d}</div></div>${l ? icon("lock", "lk") : ""}${btn("Join", "sm")}</div>`).join("")}
        <div class="opt"><span class="addi">${icon("plus")}</span><div class="opt-text"><div class="acc">Join a hidden network…</div></div></div></div>
      ${fold("Saved networks", "8")}
    </div></div>`;

  /* ── Option C: one sidebar, sections folded ─────────────────────────── */
  const sideC = (open, on) => `
    ${tiles([["wifi", "wifi", "On", "Home-5G", "blue"], ["bt", "bluetooth", "2", "Bluetooth", "blue"], ["upd", "download", "12", "Updates", "red"], ["bat", "battery", "86%", "Battery", "green"]], "")}
    <div class="navx ${on === "home" ? "active" : ""}">${T("home", "home")}<span>Home</span></div>
    ${SECS.map(([id, name, ic, pages]) => id === open
      ? `${sgrp(name, id, false, icon("chev-d"))}${pages.map(([pi, t]) => navx(pi, t, { active: t === on })).join("")}`
      : `<div class="navx fold2">${T(ic, id)}<span>${name}</span><span class="cnt">${pages.length}</span>${icon("chev-r", "fc")}</div>`).join("")}
    <div class="foot">${icon("history")}<span>Your changes · 23 settings</span></div>`;

  const homeC = () => `<div class="content ch"><div class="clamp" style="--clamp: 900px">
    <div class="crow4">
      <div class="card pcc"><span class="orb big"></span><div class="tx"><b>Atlas</b><span>Lumen Book 14 (2026)</span>
        <div class="facts"><div><small>Omarchy</small>4.5.0</div><div><small>Memory</small>32 GB</div><div><small>Kernel</small>7.2.4</div><div><small>Up for</small>3 days 4 h</div></div></div></div>
      <div class="card updc"><div class="uh">${T("download", "system")}<div><b>12 updates</b><span>Omarchy 4.5.1, 9 packages, 2 from the AUR</span></div></div>${btn("Update now", "primary", "download")}<span class="lnk">See what's new</span></div>
    </div>
    <div class="gtitle">Quick settings</div>
    <div class="card qrow2"><div class="opt"><div class="opt-text"><div>Do not disturb</div><div class="d">Silence notifications until you turn it back on.</div></div>${sw(false)}</div>
      <div class="opt"><div class="opt-text"><div>Power profile</div><div class="d">Right now. Power & Battery sets it per power source.</div></div>${seg(["Saver", "Balanced", "Performance"], "Balanced")}</div></div>
    <div class="gtitle gflex">This computer<span class="sp"></span><span class="lnk">Activity, storage and disks ${icon("chev-r")}</span></div>
    <div class="gauges">${[[12, "Processor", "8 cores", "var(--sw-blue)"], [41, "Memory", "13 of 32 GB", "var(--sw-violet)"], [61, "Disk", "380 GB free", "var(--sw-amber)"], [86, "Battery", "3 h 40 min left", "var(--sw-green)"], [52, "Temperature", "52°", "var(--sw-red)"]].map(([p, l, s, c], i) => `<div class="card gg">${ring(p, { size: 54, c, label: i === 4 ? "52°" : p + "%" })}<div class="tx"><b>${l}</b><span>${s}</span></div></div>`).join("")}</div>
    <div class="sparks">${[["Processor", [0.2, 0.3, 0.25, 0.4, 0.35, 0.6, 0.45, 0.3, 0.32, 0.5, 0.38, 0.28, 0.3, 0.22], "12%"], ["Memory", [0.4, 0.41, 0.42, 0.41, 0.43, 0.42, 0.44, 0.43, 0.42, 0.41, 0.41, 0.42, 0.41, 0.41], "13 GB"], ["Network", [0.05, 0.1, 0.4, 0.2, 0.15, 0.6, 0.3, 0.1, 0.05, 0.2, 0.7, 0.3, 0.1, 0.08], "2.1 MB/s"]].map(([t, v, n]) => `<div class="card spk"><div class="r1"><b>${t}</b><span>${n}</span></div>${spark(v, { w: 260, h: 40 }).replace("<svg ", '<svg preserveAspectRatio="none" ')}</div>`).join("")}</div>
    <div class="gtitle">Storage</div>
    <div class="stor">${[["drive", "Atlas SSD", "1 TB · 380 GB free", 61, ""], ["usb", "Backup drive", "2 TB · 1.3 TB free", 34, "ok"]].map(([ic, t, d, p, c]) => `<div class="card st">${icon(ic)}<div class="tx"><div class="r1"><b>${t}</b><span>${d}</span></div>${prog(p, c)}</div></div>`).join("")}<div class="card st pk">${icon("store")}<div class="tx"><b>1,284 packages</b><span>Software ${icon("chev-r")}</span></div></div></div>
  </div></div>`;

  const displaysC = () => `<div class="pbar"><span class="t">Displays</span><span class="s">Resolution, refresh rate, scale and arrangement</span><span class="sp"></span>${btn("Open config", "ghost sm", "file-text")}</div>
    <div class="content"><div class="clamp" style="--clamp: 760px">
      <div class="card arr"><div class="mon sel" style="left:20%;top:44%;width:24%;height:30%"><b>Laptop screen</b><span>2880 × 1800</span></div><div class="mon" style="left:44%;top:16%;width:36%;height:44%"><b>Studio 27</b><span>3840 × 2160</span></div><div class="arrbt">${btn("Identify", "sm", "info")}</div><div class="arrhint">Drag the screens to match your desk</div></div>
      ${setcard("Laptop screen", [
        ["Use this display", "", sw(true)],
        ["Resolution & refresh rate", "", dd("2880 × 1800 · 120 Hz")],
        ["Scale", "Bigger text and controls.", dd("175%")],
        ["Brightness", "", sl(80, "80%")],
      ])}
      ${fold("Studio 27", "4")}${fold("Rendering", "5")}
    </div></div>`;

  /* ── New option: point at it ────────────────────────────────────────── */
  // A miniature desktop drawn in CSS; its colours come from --d-* (the current theme, or a
  // theme being previewed).
  const deskMini = (o = {}) => `<div class="n1-desk ${o.cls || ""}" style="${o.style || ""}">
    <div class="dbar"><span class="ws"><b class="on"></b><b></b><b></b><b></b></span><span class="clk">Thu 21:37</span><span class="tray">${icon("wifi")}${icon("bluetooth")}${icon("volume")}${icon("battery")}</span></div>
    <div class="dw wl ${o.hot === "win" ? "hot" : ""}"><div class="dwh"><i></i><i></i><i></i></div><div class="dapp"><div class="dside"><b class="on"></b><b></b><b></b><b></b></div><div class="dmain"><span class="l w70"></span><span class="l w50 dim"></span><span class="row on"></span><span class="row"></span><span class="row"></span><span class="btnx"></span></div></div></div>
    <div class="dw wt"><div class="dwh"><i></i><i></i><i></i></div><div class="dterm"><span><b class="c1"></b><b class="w40"></b></span><span><b class="c2"></b><b class="w60"></b></span><span><b class="c3"></b><b class="w30"></b></span><span><b class="c1"></b><b class="cur"></b></span></div></div>
    <div class="dw wb"><div class="dwh"><i></i><i></i><i></i></div><div class="dnote"><span class="l w60"></span><span class="l w90 dim"></span><span class="l w80 dim"></span><span class="l w40 dim"></span></div></div>
    ${o.toast ? `<div class="dtoast"><i></i><div><b></b><span></span></div></div>` : ""}
    <div class="ddock ${o.hot === "dock" ? "hot" : ""}"><i></i><i></i><i></i><i class="on"></i><i></i><i></i></div>
  </div>`;

  // [section, icon, name, sub, side, pillY, targetX, targetY, hot]
  const SPOTS = [
    ["desktop", "grid", "Workspaces", "Tiling, gaps, profiles", "l", 80, 180, 80],
    ["personalization", "window", "Window Style", "Borders, blur, shadows", "l", 180, 168, 190],
    ["hardware", "monitor", "Displays", "2 screens · 175%", "l", 270, 155, 270],
    ["personalization", "palette", "Appearance", "Theme and wallpaper", "l", 375, 230, 378],
    ["desktop", "keyboard", "Keyboard", "Layout and shortcuts", "l", 462, 262, 452],
    ["personalization", "bar", "Bar & Plugins", "Clock, tray, widgets", "t", 0, 482, 80, 390],
    ["connections", "wifi", "Wi-Fi & Bluetooth", "Home-5G · 2 devices", "t", 0, 637, 80, 560],
    ["hardware", "volume", "Sound & Battery", "64% · 86% charged", "r", 80, 682, 80],
    ["desktop", "bell", "Notifications", "Do not disturb off", "r", 150, 692, 126],
    ["desktop", "dock", "Dock", "Size, position, hiding", "r", 380, 524, 380, 0, true],
    ["input", "touchpad", "Trackpad & Mouse", "Tap to click, gestures", "r", 500, 492, 505],
  ];
  const spotPill = ([sec, ic, name, sub, side, y, , , x, hot]) => {
    const pos = side === "l" ? `left:-20px;top:${y - 21}px` : side === "r" ? `left:720px;top:${y - 21}px` : `left:${x - 75}px;top:0`;
    return `<div class="n1-pill ${side} ${hot ? "hot" : ""}" style="${pos};--tc:var(--sec-${sec})">${T(ic, sec)}<div class="tx"><b>${name}</b><span>${sub}</span></div></div>`;
  };
  const spotLine = ([sec, , , , side, y, tx, ty, x, hot]) => {
    const [x1, y1] = side === "l" ? [140, y] : side === "r" ? [720, y] : [x, 42];
    return `<line x1="${x1}" y1="${y1}" x2="${tx}" y2="${ty}" class="${hot ? "hot" : ""}"/><circle cx="${tx}" cy="${ty}" r="6.5" class="halo ${hot ? "hot" : ""}" style="--tc:var(--sec-${sec})"/><circle cx="${tx}" cy="${ty}" r="3.5" style="fill:var(--sec-${sec})"/>`;
  };
  const stageN1 = () => `<div class="n1-stage">
      <div class="n1-lap"><div class="scr">${deskMini({ toast: true, hot: "dock" })}</div><div class="deck"><div class="keys">${"<i></i>".repeat(56)}</div><div class="pad"></div></div></div>
      <svg class="n1-lines" viewBox="0 0 860 540" width="860" height="540">${SPOTS.map(spotLine).join("")}</svg>
      ${SPOTS.map(spotPill).join("")}
      <div class="n1-tip" style="left:430px;top:320px"><b>Dock</b><span>Click to change its size, position and hiding</span></div>
    </div>`;

  const REST = [
    ["connections", ["Connected Devices", "Network", "Mounts", "Sharing"]],
    ["hardware", ["Lock Screen", "Printers", "Disks", "Logitech Devices"]],
    ["personalization", ["Night Light"]],
    ["desktop", ["Switcher", "Control Center", "Startup & Rules", "Capture & Tools"]],
    ["accounts", ["Users", "Sign-in & Security", "Online Accounts"]],
    ["assistant", ["Assistant", "Aura", "Voice", "Permissions", "Activity", "Performance", "Local AI", "Models"]],
    ["system", ["Time & Language", "Boot & Login", "Default Apps", "Software", "Updates", "Services", "Extensions", "Nyx apps", "About"]],
  ];
  const homeN1 = () => `<div class="n1-home">
      <div class="n1-left">
        <div class="n1-hd"><b>Point at what you want to change</b><span>Every part of the picture opens its own settings. The rest is listed on the right.</span></div>
        ${stageN1()}
      </div>
      <aside class="n1-rest">
        <div class="card n1-pc"><span class="orb"></span><div class="tx"><b>Atlas</b><span>Lumen Book 14</span></div>${btn("12 updates", "primary sm", "download")}</div>
        <div class="n1-rh">Everything else</div>
        ${REST.map(([sec, pages]) => `<div class="n1-rs" style="--sc:var(--sec-${sec})"><div class="rsh">${T(SEC[sec][2], sec)}<b>${SEC[sec][1]}</b></div><div class="rsl">${pages.map((p) => `<span>${p}</span>`).join("")}</div></div>`).join("")}
      </aside>
    </div>`;

  // Themes: [name, bg, panel, accent, text, a2, a3, light?]
  const THEMES = [
    ["Tokyo Night", "#1a1b26", "#24283b", "#7aa2f7", "#c0caf5", "#bb9af7", "#9ece6a"],
    ["Everforest", "#2d353b", "#343f44", "#a7c080", "#d3c6aa", "#e69875", "#7fbbb3"],
    ["Catppuccin", "#1e1e2e", "#313244", "#cba6f7", "#cdd6f4", "#f38ba8", "#a6e3a1"],
    ["Gruvbox", "#282828", "#3c3836", "#fabd2f", "#ebdbb2", "#fb4934", "#b8bb26"],
    ["Nord", "#2e3440", "#3b4252", "#88c0d0", "#eceff4", "#bf616a", "#a3be8c"],
    ["Rosé Pine", "#191724", "#26233a", "#ebbcba", "#e0def4", "#c4a7e7", "#9ccfd8"],
    ["Kanagawa", "#1f1f28", "#2a2a37", "#7e9cd8", "#dcd7ba", "#e46876", "#98bb6c"],
    ["Latte", "#eff1f5", "#e6e9ef", "#8839ef", "#4c4f69", "#d20f39", "#40a02b"],
  ];
  const deskVars = ([, bg, panel, acc, text, a2, a3]) => `--d-bg:${bg};--d-win:${panel};--d-acc:${acc};--d-txt:${text};--d-a2:${a2};--d-a3:${a3};--d-wall:linear-gradient(150deg, color-mix(in srgb, ${a3} 55%, ${bg}), color-mix(in srgb, ${acc} 30%, ${bg}) 55%, ${bg})`;
  const themeCard = (t, state) => `<div class="n1-th ${state}"><div class="sw" style="background:${t[1]}"><span style="background:${t[2]}"></span><i style="background:${t[3]}"></i><i style="background:${t[5]}"></i><i style="background:${t[6]}"></i></div><b>${t[0]}</b>${state === "use" ? "<small>In use</small>" : state === "try" ? "<small>Previewing</small>" : ""}</div>`;

  const appearanceN1 = () => `<div class="n1-split">
      <div class="n1-ctl"><div class="n1-ci">
        <div class="gtitle first gflex">Theme<span class="sp"></span><span class="lnk">Show all 18 ${icon("chev-r")}</span></div>
        <div class="n1-themes">${THEMES.map((t, i) => themeCard(t, i === 0 ? "use" : i === 1 ? "try" : "")).join("")}</div>
        <div class="gtitle gflex">Wallpaper<span class="sp"></span>${btn("Next", "ghost sm", "refresh")}${btn("Choose…", "sm", "image")}</div>
        <div class="n1-walls">${["#a7c080,#2d353b", "#7fbbb3,#232a2e", "#e69875,#3a3530", "#d3c6aa,#4b565c", "#83c092,#1e2326"].map((g, i) => `<span class="${i === 0 ? "on" : ""}" style="background:linear-gradient(150deg,${g})"></span>`).join("")}</div>
        ${setcard("Fonts & icons", [["Interface font", "", dd("Inter")], ["Monospace font", "", dd("JetBrains Mono")], ["Icons", "", dd("Papirus Dark")]])}
        ${setcard("Apps follow the theme", [["Re-colour apps with the theme", "Synced for Tokyo Night · 2 min ago", sw(true)]])}
        ${fold("Settings window", "3")}${fold("Advanced", "2")}
      </div></div>
      <div class="n1-pv">
        <div class="pvf"><div class="pvh"><b>Preview</b><span>Try a theme here first; nothing changes until you apply it.</span></div>${deskMini({ cls: "big", style: deskVars(THEMES[1]) })}
        <div class="pvbar"><span class="from">${themeCard(THEMES[0], "mini")}</span>${icon("chev-r", "ar")}<span class="to">${themeCard(THEMES[1], "mini")}</span><span class="sp"></span>${btn("Keep Tokyo Night", "ghost")}${btn("Apply Everforest", "primary", "check")}</div></div>
      </div>
    </div>`;

  /* ── New option: like a phone ───────────────────────────────────────── */
  const prow = (ic, sec, t, v = "", o = {}) => `<div class="n2-row ${o.cls || ""}">${T(ic, sec)}<span class="t">${t}</span>${o.ctl || `<span class="v">${v}</span>${icon("chev-r", "cv")}`}</div>`;
  const PH = [
    ["connections", [["wifi", "Wi-Fi", "Home-5G"], ["bluetooth", "Bluetooth", "2 connected"], ["phone", "Connected Devices", "Pixel phone"], ["network", "Network", "Wired · VPN off"], ["server", "Mounts", "3 drives"], ["share", "Sharing", "Off"]]],
    ["hardware", [["monitor", "Displays", "2 screens"], ["volume", "Sound", "Studio Speakers · 64%"], ["battery", "Power & Battery", "86% · Balanced"], ["lock", "Lock Screen", "After 5 min"], ["printer", "Printers", "Office Laser"], ["drive", "Disks", "380 GB free"], ["mouse", "Logitech Devices", "MX Keys, MX Master"]]],
  ];
  const homeN2 = () => `<div class="content n2"><div class="n2-col">
      <div class="n2-search">${icon("search")}<span>Search</span><span class="key">Ctrl F</span></div>
      <div class="card n2-prof">
        <div class="n2-me">${av("Sam Rivera", 56)}<div class="tx"><b>Sam Rivera</b><span>Administrator · password and fingerprint</span></div>${icon("chev-r", "cv")}</div>
        <div class="n2-pc"><span class="orb"></span><div class="tx"><b>Atlas</b><span>Lumen Book 14 · Omarchy 4.5.0 · 32 GB</span></div>${icon("chev-r", "cv")}</div>
      </div>
      <div class="card n2-sugg"><span class="si">${icon("download")}</span><div class="tx"><b>12 updates are ready</b><span>Omarchy 4.5.1 and 11 packages. About 4 minutes.</span></div>${btn("Update", "primary sm")}</div>
      ${PH.map(([sec, rows]) => `<div class="n2-gh" style="color:var(--sec-${sec})">${SEC[sec][1]}</div><div class="card n2-list">${rows.map(([ic, t, v]) => prow(ic, sec, t, v)).join("")}</div>`).join("")}
    </div></div>`;

  const phHdr = (back, title) => hdr({ noSide: true, start: `<button class="btn ghost backb">${icon("chev-l")}<span>${back}</span></button>`, center: `<b class="n2-ht">${title}</b>`, end: ib("search", "Search (Ctrl F)") });
  const displayN2 = () => `<div class="content n2"><div class="n2-col">
      <h1 class="n2-big">Displays</h1>
      <div class="card arr n2-arr"><div class="mon sel" style="left:22%;top:42%;width:24%;height:32%"><b>Laptop screen</b><span>2880 × 1800</span></div><div class="mon" style="left:46%;top:14%;width:34%;height:46%"><b>Studio 27</b><span>3840 × 2160</span></div><div class="arrbt">${btn("Identify", "sm", "info")}</div><div class="arrhint">Drag the screens to match your desk</div></div>
      <div class="n2-gh">Laptop screen</div>
      <div class="card n2-list plain">
        <div class="n2-row"><span class="t">Use this display</span>${sw(true)}</div>
        <div class="n2-row"><span class="t">Resolution & refresh rate</span><span class="v">2880 × 1800 · 120 Hz</span>${icon("chev-r", "cv")}</div>
        <div class="n2-row"><span class="t">Scale</span><span class="v">175%</span>${icon("chev-r", "cv")}</div>
        <div class="n2-row sl"><span class="t">Brightness</span>${icon("sun", "lo")}${slider(80, 0)}${icon("sun", "hi")}</div>
        <div class="n2-row"><span class="t">Rotation</span><span class="v">Normal</span>${icon("chev-r", "cv")}</div>
      </div>
      <div class="n2-gh">Other screens</div>
      <div class="card n2-list plain">
        <div class="n2-row"><span class="t">Studio 27</span><span class="v">3840 × 2160 · 60 Hz · 150%</span>${icon("chev-r", "cv")}</div>
        <div class="n2-row"><span class="t">Mirror to an external screen</span>${sw(false)}</div>
        <div class="n2-row"><span class="t">Remembered displays</span><span class="v">3</span>${icon("chev-r", "cv")}</div>
        <div class="n2-row"><span class="t">Rendering</span><span class="v">VRR for games · hardware cursors</span>${icon("chev-r", "cv")}</div>
      </div>
    </div></div>`;

  const soundN2 = () => `<div class="content n2"><div class="n2-col">
      <h1 class="n2-big">Sound</h1>
      <div class="n2-gh">Output</div>
      <div class="card n2-list plain">
        <div class="n2-row"><span class="t">Plays through</span><span class="v">Studio Speakers</span>${icon("chev-r", "cv")}</div>
        <div class="n2-row sl"><span class="t">Volume</span>${icon("volume", "lo")}${slider(64, 0)}<span class="v rd">64%</span></div>
        <div class="n2-row"><span class="t">Maximum volume</span><span class="v">100%</span>${icon("chev-r", "cv")}</div>
        <div class="n2-row"><span class="t">Equalizer & preamp</span><span class="v">Loudness · on</span>${icon("chev-r", "cv")}</div>
      </div>
      <div class="n2-gh">Input</div>
      <div class="card n2-list plain">
        <div class="n2-row"><span class="t">Microphone</span><span class="v">Built-in microphone</span>${icon("chev-r", "cv")}</div>
        <div class="n2-row sl"><span class="t">Input level</span>${icon("mic", "lo")}${slider(72, 0)}<span class="v rd">72%</span></div>
      </div>
      <div class="card n2-list plain sp1">
        <div class="n2-row"><span class="t">Apps playing sound</span><span class="v">2</span>${icon("chev-r", "cv")}</div>
        <div class="n2-row"><span class="t">Remembered devices</span><span class="v">4</span>${icon("chev-r", "cv")}</div>
        <div class="n2-row"><span class="t">Troubleshooting</span>${icon("chev-r", "cv")}</div>
      </div>
    </div></div>`;

  /* ── New option: tasks, not pages ───────────────────────────────────── */
  const TASKS = [
    ["Get online", "wifi", "connections", ["Join a Wi-Fi network", "Pair headphones or a mouse", "Share files with your phone", "Connect a network drive", "Turn on a VPN"]],
    ["Look and feel", "palette", "personalization", ["Change the theme or wallpaper", "Make text and controls bigger", "Warmer colours in the evening", "Change how windows look", "Choose what the bar shows"]],
    ["Sound and screen", "monitor", "hardware", ["Make quiet sound louder", "Set up a second screen", "Choose a microphone", "Save battery", "Add a printer"]],
    ["Keys and pointer", "keyboard", "input", ["Change a keyboard shortcut", "Change trackpad gestures", "Add a keyboard layout", "Set up a Logitech mouse", "Make the pointer faster"]],
    ["Keep it safe", "shield", "accounts", ["Change your password", "Add a fingerprint", "Choose when the screen locks", "Decide what the assistant sees", "Add another person"]],
    ["Keep it running", "cog", "system", ["Install 12 updates", "Free up disk space", "Start an app when you sign in", "Set the time zone", "Choose the default apps"]],
  ];
  const askBox = (q = "") => `<div class="n3-ask ${q ? "typed" : ""}">${icon("sparkle")}${q ? `<span class="q">${q}</span>` : `<span class="ph">Say it in your own words: “make the text bigger”, “my headphones are quiet”</span>`}<span class="key">${q ? "Enter" : "Ctrl F"}</span></div>`;
  const sideN3 = () => `<aside class="n3-side">
      <div class="n3-sh">Needs you</div>
      <div class="card n3-need">
        <div class="nd">${T("download", "system")}<div class="tx"><b>12 updates ready</b><span>Omarchy 4.5.1 and 11 packages</span></div>${btn("Update", "primary sm")}</div>
        <div class="nd">${T("printer", "hardware")}<div class="tx"><b>Office Laser is out of paper</b><span>2 documents waiting</span></div></div>
        <div class="nd">${T("drive", "hardware")}<div class="tx"><b>Backup drive not seen for 9 days</b><span>Plug it in to back up</span></div></div>
      </div>
      <div class="n3-sh gflex">Recently changed<span class="sp"></span><span class="lnk">All 23</span></div>
      <div class="card n3-hist">${[["moon", "personalization", "Night Light", "From sunset", "2 h ago"], ["volume", "hardware", "Maximum volume", "100% → 150%", "Yesterday"], ["palette", "personalization", "Theme", "Tokyo Night", "Monday"], ["touchpad", "input", "Natural scrolling", "On", "Monday"]].map(([ic, sec, t, v, w]) => `<div class="hi">${T(ic, sec)}<div class="tx"><b>${t}</b><span>${v} · ${w}</span></div><span class="un">Undo</span></div>`).join("")}</div>
    </aside>`;
  const homeN3 = () => `<div class="n3-wrap"><div class="n3-main">
      <h1 class="n3-big">What would you like to do?</h1>
      ${askBox()}
      <div class="n3-grid">${TASKS.map(([t, ic, sec, items]) => `<div class="card n3-tc" style="--sc:var(--sec-${sec})"><div class="tch">${T(ic, sec)}<b>${t}</b></div>${items.map((x) => `<div class="tk"><span>${x}</span>${icon("chev-r")}</div>`).join("")}</div>`).join("")}</div>
      <div class="n3-foot">${icon("listic")}<span>Looking for a particular page?</span><span class="lnk">All settings, A to Z ${icon("chev-r")}</span></div>
    </div>${sideN3()}</div>`;

  const stepN3 = (n, title, from, ctl, d = "") => `<div class="n3-step"><span class="nn">${n}</span><div class="tx"><b>${title}</b>${d ? `<span>${d}</span>` : ""}<small>${from}</small></div>${ctl}</div>`;
  const fromP = (sec, page) => `<em style="color:var(--sec-${sec})">${SEC[sec][1]}</em> › ${page} · <u>Open page</u>`;
  const askN3 = () => `<div class="n3-wrap"><div class="n3-main">
      ${askBox("my headphones sound too quiet")}
      <div class="n3-ans">
        <div class="ah"><b>Four things can make Pulse Buds louder</b>${chip("Pulse Buds · Bluetooth · connected", "acc", "bluetooth")}</div>
        <div class="card">
          ${stepN3(1, "Turn the volume up", fromP("hardware", "Sound"), sl(64, "64%", 180))}
          ${stepN3(2, "Let the volume go past 100%", fromP("hardware", "Sound"), dd("150%"), "The volume keys can then go up to it.")}
          ${stepN3(3, "Boost quiet sounds", fromP("hardware", "Sound › Equalizer"), `${dd("Loudness")}${sw(true)}`, "A preset that lifts the low and high ends.")}
          ${stepN3(4, "Let the headphones set their own volume", fromP("connections", "Bluetooth › Pulse Buds"), sw(false), "Some headphones are quieter until this is on.")}
        </div>
        <div class="gtitle">Also matching</div>
        <div class="card">${[["hardware", "volume", "Sound", "Apps playing sound", "One app may be turned down on its own."], ["connections", "bluetooth", "Bluetooth", "Sound quality for Pulse Buds", "AAC · switch to SBC if it cuts out."]].map(([sec, ic, p, t, d]) => `<div class="opt">${T(ic, sec)}<div class="opt-text"><div>${t}</div><div class="d">${d}</div></div><span class="n3-pg">${p} ${icon("chev-r")}</span></div>`).join("")}</div>
      </div>
    </div>
    <aside class="n3-side">
      <div class="card n3-fix"><b>Did that help?</b><span>Changes made here are in Recently changed, so you can undo them.</span><div class="bt">${btn("Yes, thanks", "sm")}${btn("Still too quiet", "sm")}</div></div>
      <div class="n3-sh">Asked before</div>
      <div class="card n3-prev">${["make the text bigger", "stop the screen dimming", "turn off the startup sound", "use the external screen only"].map((q) => `<div class="pq">${icon("history")}<span>${q}</span></div>`).join("")}</div>
    </aside></div>`;

  const displayN3 = () => `<div class="n3-tasks">${icon("sparkle")}<span>Tasks here</span>${["Set up a second screen", "Make text bigger", "Mirror the screen"].map((t, i) => chip(t, i === 1 ? "on" : "")).join("")}</div>
    <div class="content"><div class="clamp" style="--clamp: 720px">
      <div class="card arr"><div class="mon sel" style="left:18%;top:44%;width:26%;height:32%"><b>Laptop screen</b><span>2880 × 1800</span></div><div class="mon" style="left:44%;top:14%;width:38%;height:46%"><b>Studio 27</b><span>3840 × 2160</span></div><div class="arrbt">${btn("Identify", "sm", "info")}</div></div>
      ${setcard("Laptop screen", [
        ["Use this display", "", sw(true)],
        ["Resolution & refresh rate", "", dd("2880 × 1800 · 120 Hz")],
        ["Scale", "Makes everything bigger on high-resolution screens.", dd("175%")],
        ["Brightness", "", sl(80, "80%", 160)],
      ]).replace('class="card"', 'class="card n3-hl"')}
      ${fold("Studio 27", "4")}${fold("Rendering", "5")}
    </div></div>`;

  const ICONS = {
    cog: '<circle cx="12" cy="12" r="3"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1"/>',
    bar: '<rect x="3" y="4" width="18" height="16" rx="2.5"/><path d="M3 8.5h18M6.5 6.2h3"/>',
    puzzle: '<path d="M9 4.5a2 2 0 0 1 4 0V6h4v4h1.5a2 2 0 0 1 0 4H17v4.5H5V14h1.5a2 2 0 0 0 0-4H5V6h4z"/>',
    dock: '<rect x="3" y="4" width="18" height="16" rx="2.5"/><rect x="7" y="15" width="10" height="2.5" rx="1"/>',
    switcher: '<rect x="3" y="7" width="8" height="10" rx="1.5"/><rect x="13" y="7" width="8" height="10" rx="1.5"/>',
    startup: '<path d="M12 3.5c3 2 4.5 5 4.5 9l-2 3h-5l-2-3c0-4 1.5-7 4.5-9z"/><circle cx="12" cy="10" r="1.5"/><path d="M9.5 18.5 12 21l2.5-2.5"/>',
    screenshot: '<path d="M4 8V5.5A1.5 1.5 0 0 1 5.5 4H8M16 4h2.5A1.5 1.5 0 0 1 20 5.5V8M20 16v2.5a1.5 1.5 0 0 1-1.5 1.5H16M8 20H5.5A1.5 1.5 0 0 1 4 18.5V16"/><rect x="8" y="9" width="8" height="6" rx="1"/>',
    touchpad: '<rect x="3.5" y="4.5" width="17" height="15" rx="2.5"/><path d="M3.5 15h17M12 15v4.5"/>',
    aura: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/>',
    pulse: '<path d="M3 12h4l2.5-6 5 12 2.5-6h4"/>',
    cpu: '<rect x="6" y="6" width="12" height="12" rx="2"/><rect x="9.5" y="9.5" width="5" height="5" rx="1"/><path d="M9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3"/>',
    cube: '<path d="m12 3 8 4.5v9L12 21l-8-4.5v-9z"/><path d="m4 7.5 8 4.5 8-4.5M12 12v9"/>',
    apps: '<rect x="4" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5"/><circle cx="16.75" cy="16.75" r="3.25"/>',
    store: '<path d="M5 8h14l-1 12H6z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/>',
    nyxapp: '<path d="M20 13.5A8 8 0 1 1 10.5 4a6.5 6.5 0 0 0 9.5 9.5z"/><path d="M16 4.5v3M14.5 6h3"/>',
    "swipe-lr": '<path d="M4 12h16M7.5 8.5 4 12l3.5 3.5M16.5 8.5 20 12l-3.5 3.5"/>',
    "swipe-u": '<path d="M12 20V4M8.5 7.5 12 4l3.5 3.5"/>',
    "swipe-d": '<path d="M12 4v16M8.5 16.5 12 20l3.5-3.5"/>',
    "pinch-in": '<path d="M4 4l6 6M20 4l-6 6M4 20l6-6M20 20l-6-6M10 6v4H6M14 6v4h4M10 18v-4H6M14 18v-4h4"/>',
    "pinch-out": '<path d="M10 10 4 4M14 10l6-6M10 14l-6 6M14 14l6 6M4 8V4h4M20 8V4h-4M4 16v4h4M20 16v4h-4"/>',
    tap3: '<circle cx="7" cy="9" r="2"/><circle cx="12" cy="7" r="2"/><circle cx="17" cy="9" r="2"/><path d="M5 15c2 3 12 3 14 0"/>',
  };

  REG("settings", {
    name: "Settings",
    summary: "Settings covers nearly everything on the computer and its search is good, but its one sidebar runs to about fifty pages, Home opens as a system monitor, and the most common switches (Wi-Fi, Bluetooth, volume, brightness) are a trip through the list away.",
    problems: [
      "<b>About fifty pages in one sidebar:</b> it scrolls for three screens; at 1280 px Personalization starts at the bottom edge, and Desktop, Input, Accounts and System are out of sight.",
      "<b>At 800 px</b> the rail is about fifty small icons with thin coloured bars between them; Displays, Connected Devices, Printers and Disks are look-alike rectangles.",
      "<b>Look-alike names in different places:</b> Bar & Notifications (Personalization) and Notifications (Desktop); Keyboard (Input) and Keyboard Shortcuts (Desktop); Mounts (Connections) and Disks (Hardware); two pages called Models (Local AI and Assistant); Updates, Software and About all update things.",
      "<b>Home is a system monitor:</b> the first screen is the computer's specs, five gauges and live charts; Quick settings has only Do not disturb and the power profile, so Wi-Fi, Bluetooth, volume and brightness need the sidebar.",
      "<b>“28 updates available” is a panel, not a button:</b> it looks like a readout, and the same count shows again in the sidebar badge.",
      "<b>Truncated facts at 800 px:</b> “Intel Core Ul…”, “7.2.8-9-om…”, and the five gauges wrap three and two, cutting off the Battery and Temperature labels.",
      "<b>The header says the page twice</b> (“Settings · Home” beside the highlighted Home row) and has nothing else but search.",
    ],
    today: [["settings-1280", "Today at 1280 px", "Home: specs, quick settings, gauges, activity"], ["settings-800", "Today at 800 px", "A rail of about fifty icons; facts cut off"]],
    options: [
      { id: "a", name: "Two levels", idea: "The sidebar lists only the nine sections, each with its coloured tile and the first few pages it holds; the section's pages are tabs across the top of the page, under its name in the section colour. Nothing scrolls out of sight, and at 800 px the rail is nine coloured tiles you can tell apart. Assistant and Local AI become one section, so there's one Models page. Open config sits with each page.",
        shots: [
          ["a-sound","Hardware › Sound","Sections in the sidebar, pages as tabs"],
          ["a-trackpad","Input › Trackpad","Gestures as pictures with a choice each"],
          ["a-sound-800","At 800 px","Nine coloured tiles in the rail"],
        ] },
      { id: "b", name: "Search first", idea: "Settings opens on a page made for getting somewhere: a big search, quick switches for the things changed most (Wi-Fi, Bluetooth, Do not disturb, Night Light, volume, brightness, power), one line about this computer with Update now, and every section as a card listing its pages. Search results show the settings themselves, so most changes happen right there. A page opens on its own with Back and its neighbours as chips. Suits people who'd rather type than browse.",
        shots: [
          ["b-home","Home","Search, quick switches, every section"],
          ["b-search","Searching “bright”","The settings themselves, by page, with counts"],
          ["b-wifi-800","A page at 800 px","Back to Home; the section's other pages as chips"],
        ] },
      { id: "c", name: "Point at it", idea: "Settings opens on a drawing of your computer: the bar, the tray, a notification, the windows, the dock, the screen's edge, the keyboard and the trackpad are labelled, and clicking any of them opens its settings. Whatever isn't on the picture (accounts, the assistant, printers, the system pages) is listed beside it. Pages that change how things look show a live preview next to the controls, and a new theme is tried there first and only applied when you say so. Suits people who know what they want to change but not what it's called.",
        shots: [
          ["n1-home","Home","Every labelled part opens its page; the rest listed on the right"],
          ["n1-appearance","Personalization › Appearance","Try a theme on the preview, then apply it"],
          ["n1-appearance-800","Appearance at 800 px","The preview above the controls"],
        ] },
      { id: "d", name: "Like a phone", idea: "One calm column, like a phone's settings. At the top are you (account and sign-in) and this computer, then anything that needs you, then every page as a row in its section that shows its current value (Wi-Fi: Home-5G, Sound: 64%). Clicking a row slides to that page, which is the same kind of list: switches and sliders sit in the row, and anything with more choices is a row that opens one level deeper, so no page is a wall of controls. Back always goes up one level. It looks the same at 800 px as at full width.",
        shots: [
          ["n2-home","Home","You, this computer, then every page with its current value"],
          ["n2-display","Hardware › Displays","Rows that open deeper; switches and sliders in place"],
          ["n2-sound-800","Sound at 800 px","The equalizer is a row one level down"],
        ] },
      { id: "e", name: "Tasks, not pages", idea: "Settings is sorted by what you want to do rather than where a setting lives: Get online, Look and feel, Sound and screen, Keys and pointer, Keep it safe and Keep it running, each with its common tasks. You can also say what's wrong in your own words; the answer gathers the settings that fix it from every page, as steps you change right there. Beside it are the things that need you and your recent changes with Undo. Every page is still one click away, under All settings, A to Z, and opens with the tasks it helps with. Suits people who don't want to learn where things are.",
        shots: [
          ["n3-home","Home","Tasks by what you want to do; needs you and recent changes beside"],
          ["n3-ask","Asking “my headphones sound too quiet”","Settings from three pages, as steps you change in place"],
          ["n3-display-800","Displays at 800 px","A page opened from a task, with its tasks as chips"],
        ] },
    ],
    icons: ICONS,
    pages: {
      "a-sound": () => win({ hdr: hdr(), side: sideA("hardware"), page: `${shead("hardware", "Sound", "Volume, devices, a 9-band equalizer and a preamp.")}${soundBody()}` }),
      "a-trackpad": () => win({ hdr: hdr(), side: sideA("input"), page: `${shead("input", "Trackpad", "Tapping, scrolling, and three- and four-finger gestures.")}${trackpadBody()}` }),
      "b-home": () => win({ hdr: hdr({ noSide: true, center: "", end: btn("Your changes · 23", "ghost", "history") }), side: "", page: homeB() }),
      "b-search": () => win({ hdr: hdr({ noSide: true, center: `<div class="search wide focus">${icon("search")}<span class="q">bright</span><span class="key">6 results on 5 pages</span></div>` }), side: "", page: searchB() }),
      "b-wifi": () => win({ hdr: hdr({ noSide: true, start: `<button class="btn ghost backb">${icon("chev-l")}<span>Home</span></button>`, center: `<div class="crumb"><span style="color:var(--sec-connections)">Connections</span>${icon("chev-r")}<b>Wi-Fi</b></div>`, end: `<span class="gap"></span>${ib("search", "Search all settings (Ctrl F)")}` }), side: "", page: wifiB() }),
      "c-home": () => win({ hdr: hdr(), side: sideC("", "home"), page: homeC() }),
      "c-displays": () => win({ hdr: hdr(), side: sideC("hardware", "Displays"), page: displaysC() }),
      "n1-home": () => win({ hdr: hdr({ noSide: true, end: btn("Your changes · 23", "ghost", "history") }), side: "", page: homeN1() }),
      "n1-appearance": () => win({ hdr: hdr({ noSide: true, start: `<button class="btn ghost backb">${icon("chev-l")}<span>${NARROW ? "Back" : "Your computer"}</span></button>`, center: `<div class="crumb"><span style="color:var(--sec-personalization)">Personalization</span>${icon("chev-r")}<b>Appearance</b></div>`, end: ib("search", "Search all settings (Ctrl F)") }), side: "", page: appearanceN1() }),
      "n2-home": () => win({ hdr: hdr({ noSide: true, center: "" }), side: "", page: homeN2() }),
      "n2-display": () => win({ hdr: phHdr("Settings", "Displays"), side: "", page: displayN2() }),
      "n2-sound": () => win({ hdr: phHdr("Settings", "Sound"), side: "", page: soundN2() }),
      "n3-home": () => win({ hdr: hdr({ noSide: true, center: "", end: btn("All settings, A to Z", "ghost", "listic") }), side: "", page: homeN3() }),
      "n3-ask": () => win({ hdr: hdr({ noSide: true, start: `<button class="btn ghost backb">${icon("chev-l")}<span>Tasks</span></button>`, center: "", end: btn("All settings, A to Z", "ghost", "listic") }), side: "", page: askN3() }),
      "n3-display": () => win({ hdr: hdr({ noSide: true, start: `<button class="btn ghost backb">${icon("chev-l")}<span>Tasks</span></button>`, center: `<div class="crumb"><span style="color:var(--sec-hardware)">Hardware</span>${icon("chev-r")}<b>Displays</b></div>`, end: ib("search", "Search all settings (Ctrl F)") }), side: "", page: displayN3() }),
    },
  });
})();
