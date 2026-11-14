// Round 1: three ways every Settings page could be built, each drawn on the same five pages.
(() => {
  const C = (clamp, html, cls = "") => `<div class="content ${cls}"><div class="clamp" style="--clamp:${clamp}px">${html}</div></div>`;
  const radio = (on) => `<span class="rad ${on ? "on" : ""}"></span>`;
  const chk = (on) => `<span class="cbx sq ${on ? "done" : ""}">${on ? icon("check") : ""}</span>`;

  /* ── Sample data ─────────────────────────────────────────────────── */
  const OUTS = [["speaker", "Studio Speakers", "USB audio", true], ["headphones", "Pulse Buds", "Bluetooth · 80% battery", false], ["laptop", "Laptop speakers", "Built in", false], ["monitor", "Studio 27", "HDMI", false]];
  const NETS = [["Harbor Café", "Open", 3, false], ["Neighbours-2G", "WPA2", 2, true], ["Studio Guest", "WPA3", 2, true], ["Printer-Direct", "WPA2", 1, true], ["Atlas Hotspot", "WPA3", 1, true]];
  const MINE = [["Open Notes", ["Super", "N"], "Apps & menus"], ["Toggle Night Light", ["Super", "Shift", "N"], "Media & hardware"], ["Screenshot a window", ["Super", "Shift", "S"], "Screenshots & recording"], ["Move window to the other screen", ["Super", "Alt", "→"], "Workspaces & monitors"], ["Glimpse", ["Super", "Space"], "Apps & menus"], ["Clipboard history", ["Super", "V"], "Apps & menus"]];
  const CATS = [["apps", "Apps & menus", 24, "blue", "Terminal, browser, launcher"], ["window", "Windows", 31, "violet", "Close, full screen, float, split"], ["grid", "Workspaces & monitors", 28, "pink", "Go to 1–9, move, scratchpad"], ["screenshot", "Screenshots & recording", 9, "teal", "Region, window, screen, record"], ["volume", "Media & hardware", 18, "amber", "Volume, brightness, keyboard light"], ["user", "Your own", 6, "green", "Added by you"]];
  const WIN_KEYS = [["Close the window", ["Super", "W"]], ["Full screen", ["Super", "F"]], ["Float or tile", ["Super", "T"]], ["Split the other way", ["Super", "J"]], ["Focus left / right", ["Super", "←", "→"]], ["Swap with the next window", ["Super", "Shift", "←"]], ["Grow the window", ["Super", "="]], ["Shrink the window", ["Super", "-"]], ["Pin on every workspace", ["Super", "P"]], ["Group windows as tabs", ["Super", "G"]]];
  const PKGS = [["Linux kernel", "7.2.8 → 7.2.9", "142 MB", "Restart needed"], ["Mesa", "26.1.1 → 26.1.2", "38 MB", ""], ["PipeWire", "1.6.2 → 1.6.3", "4 MB", ""], ["Hyprland", "0.57.1 → 0.57.2", "9 MB", "Sign out needed"], ["Firefox", "151.0 → 151.0.2", "88 MB", ""], ["Nyx Files", "2.4.0 → 2.4.1", "6 MB", ""], ["OpenSSL", "3.6.1 → 3.6.2", "7 MB", ""], ["systemd", "259.3 → 259.4", "21 MB", ""], ["Noto fonts", "2026.10 → 2026.11", "64 MB", ""]];

  /* ── Small drawings ──────────────────────────────────────────────── */
  const wall = (seed) => { const n = hash(seed); return `linear-gradient(${140 + (n % 40)}deg, color-mix(in srgb, var(--sw-${SW[n % 8]}) 60%, #10121a), color-mix(in srgb, var(--sw-${SW[(n >>> 3) % 8]}) 45%, #0b0c11))`; };
  const screen = (name, res, o = {}) => `<div class="scr2 ${o.sel ? "sel" : ""}" style="${o.style || ""}"><div class="glass" style="background:${wall(o.seed || name)}"><span class="mb"></span><span class="mw"></span><span class="mw b"></span></div><div class="lbl"><b>${name}</b><span>${res}</span></div>${o.main ? `<span class="main">${icon("star")}Main</span>` : ""}</div>`;
  const arrangement = (o = {}) => `<div class="arr2 ${o.cls || ""}">
      ${screen("Laptop screen", "2880 × 1800 · 175%", { sel: true, main: true, seed: "lap", style: "left:14%;top:30%;width:30%;height:58%" })}
      ${screen("Studio 27", "3840 × 2160 · 150%", { seed: "studio", style: "left:46%;top:6%;width:40%;height:74%" })}
      ${o.tools !== false ? `<div class="atools">${btn("Identify", "sm", "info")}</div>` : ""}
      ${o.hint ? `<div class="ahint">${icon("expand")}Drag the screens to match your desk</div>` : ""}
    </div>`;
  const miniCurve = (w = 120, h = 34) => eqCurve(EQ_LOUD, { w, h, handles: false });
  const qr = () => { let s = ""; for (let i = 0; i < 121; i++) s += `<b class="${(hash("q" + i) % 3 === 0) || [0, 1, 2, 10, 11, 12, 22, 23, 24, 8, 9, 19, 20, 30, 31, 96, 97, 98, 108, 109, 110, 118, 119, 120].includes(i) ? "on" : ""}"></b>`; return `<span class="qr">${s}</span>`; };
  // A keyboard with Super's shortcuts coloured by what they do.
  const KMAP = { W: "violet", F: "violet", T: "violet", J: "violet", P: "violet", G: "violet", "=": "violet", "-": "violet", Return: "blue", B: "blue", N: "blue", E: "blue", M: "blue", Space: "blue", V: "blue", K: "blue", "1": "pink", "2": "pink", "3": "pink", "4": "pink", "5": "pink", "6": "pink", "7": "pink", "8": "pink", "9": "pink", S: "pink", Tab: "pink", R: "teal", Y: "teal", Print: "teal", F1: "amber", F2: "amber", F3: "amber", F5: "amber", F6: "amber", F10: "amber", L: "green", O: "green" };
  const KROWS = [
    [["Esc", 1.2], ["F1"], ["F2"], ["F3"], ["F4"], ["F5"], ["F6"], ["F7"], ["F8"], ["F9"], ["F10"], ["F11"], ["F12"], ["Print", 1.3]],
    [["`"], ["1"], ["2"], ["3"], ["4"], ["5"], ["6"], ["7"], ["8"], ["9"], ["0"], ["-"], ["="], ["⌫", 1.8]],
    [["Tab", 1.5], ["Q"], ["W"], ["E"], ["R"], ["T"], ["Y"], ["U"], ["I"], ["O"], ["P"], ["["], ["]"], ["\\", 1.3]],
    [["Caps", 1.8], ["A"], ["S"], ["D"], ["F"], ["G"], ["H"], ["J"], ["K"], ["L"], [";"], ["'"], ["Return", 2]],
    [["Shift", 2.3], ["Z"], ["X"], ["C"], ["V"], ["B"], ["N"], ["M"], [","], ["."], ["/"], ["Shift", 2.5]],
    [["Ctrl", 1.4], ["Fn"], ["Super", 1.4], ["Alt", 1.2], ["Space", 6.2], ["Alt", 1.2], ["Ctrl", 1.4], ["←"], ["→"]],
  ];
  const keyboard = (sel = "F") => `<div class="kbmap">${KROWS.map((r) => `<div class="kr">${r.map(([k, w = 1]) => {
    const c = KMAP[k], cls = k === "Super" ? "mod" : k === sel ? "sel" : c ? "has" : "";
    return `<span class="ky ${cls}" style="flex:${w};${c ? `--kc:var(--sw-${c})` : ""}">${k}</span>`;
  }).join("")}</div>`).join("")}</div>`;

  /* ═══ Style A: status first ═════════════════════════════════════════ */
  const hero = (sec, ic, small, title, sub, end, foot = "") => `<div class="hero" style="--tc:var(--sec-${sec})"><div class="hr1"><span class="hic">${icon(ic)}</span><div class="htx"><small>${small}</small><b>${title}</b><span>${sub}</span></div><div class="hend">${end}</div></div>${foot}</div>`;

  const soundA = () => C(860, `
    ${hero("hardware", "speaker", "Playing through", "Studio Speakers", "USB audio · 48 kHz · the Loudness equalizer is on", `${ib("mute", "Mute")}`,
      `<div class="hvol">${icon("volume")}${slider(64, 0)}<b>64%</b></div>
       <div class="hchips">${OUTS.map(([ic, n, , on]) => chip(n, on ? "on" : "", ic)).join("")}<span class="sp"></span><span class="lnk">Sound settings for this device ${icon("chev-r")}</span></div>`)}
    <div class="cols2">
      ${ocard("Sound", [
        orow("Equalizer", "Loudness: lifts the lows and highs", `<span class="mini">${miniCurve(110, 30)}</span>${icon("chev-r", "cv")}`, { ic: "eq", cls: "onav" }),
        orow("Maximum volume", "The volume keys stop here.", dd("100%"), { ic: "volume" }),
        orow("Switch to new devices", "When headphones connect.", sw(true), { ic: "headphones" }),
      ], { cls: "icons" })}
      ${ocard("Microphone", [
        orow("Built-in microphone", meter(58, 16), dd("Change"), { ic: "mic" }),
        orow("Input level", "", sl(72, "72%", 130), { ic: "sliders" }),
        orow("Noise reduction", "Cuts fans and keyboard clicks.", sw(false), { ic: "spark" }),
      ], { cls: "icons" })}
    </div>
    ${ocard("More", [nrow("Apps playing sound", "", "Music, Browser", { ic: "apps" }), nrow("Remembered devices", "", "4", { ic: "hist" }), nrow("Troubleshooting", "Restart sound if a device goes missing", "", { ic: "wrench" })], { cls: "icons more3" })}`);

  const displaysA = () => C(860, `
    <div class="hero arrh" style="--tc:var(--sec-hardware)">
      <div class="hr1"><span class="hic">${icon("monitor")}</span><div class="htx"><small>2 displays</small><b>Extended desktop</b><span>The laptop screen is the main one. Drag the screens to match your desk.</span></div><div class="hend">${seg(["Extend", "Mirror", "One screen"], "Extend")}</div></div>
      ${arrangement({ hint: false })}
    </div>
    <div class="gtitle gflex">Laptop screen<span class="pill dot" style="--tc:var(--success)">Main display</span><span class="sp"></span>${seg(["Laptop screen", "Studio 27"], "Laptop screen")}</div>
    <div class="cols2">
      ${ocard("", [
        orow("Resolution", "", dd("2880 × 1800"), { ic: "monitor" }),
        orow("Refresh rate", "", seg(["60 Hz", "120 Hz"], "120 Hz"), { ic: "refresh" }),
        orow("Rotation", "", dd("Normal"), { ic: "rotate" }),
      ], { cls: "icons" })}
      ${ocard("", [
        orow("Scale", "Bigger text and controls", seg(["100", "150", "175", "200"], "175"), { ic: "scale" }),
        orow("Brightness", "", sl(80, "80%", 120), { ic: "sun" }),
        orow("Night Light", "From sunset", `<span class="rv">On</span>${icon("chev-r", "cv")}`, { ic: "moon", cls: "onav" }),
      ], { cls: "icons" })}
    </div>
    ${ocard("More", [nrow("Rendering", "Variable refresh rate, hardware cursors", "VRR for games", { ic: "chip" }), nrow("Remembered displays", "", "3", { ic: "hist" })], { cls: "icons more3" })}`);

  const wifiA = () => C(820, `
    ${hero("connections", "wifi", "Connected to", "Home-5G", "Excellent signal · 5 GHz · WPA3 · 866 Mb/s", `${btn("Share", "", "qr")}${btn("Details")}<span class="vsep"></span>${sw(true)}`,
      `<div class="hfacts"><div><small>Address</small>192.168.1.24</div><div><small>Router</small>192.168.1.1</div><div><small>Connected for</small>3 h 12 min</div><div><small>Today</small>1.8 GB down · 240 MB up</div></div>`)}
    ${ocard("Nearby networks", NETS.map(([n, sec, s, lock]) => `<div class="opt">${bars4(s)}<div class="opt-text"><div>${n}</div><div class="d">${sec === "Open" ? "Open · anyone can see what you send" : sec}</div></div>${lock ? icon("lock", "lk") : ""}${btn("Join", "sm")}</div>`).concat([`<div class="opt"><span class="addi">${icon("plus")}</span><div class="opt-text"><div class="acc">Join a hidden network…</div></div></div>`]), { act: `<span class="note">6 found</span>${ib("refresh", "Look again")}` })}
    ${ocard("More", [nrow("Saved networks", "Forget one, or choose which to join first", "8", { ic: "hist", sec: "connections" }), nrow("VPN, proxy and wired", "On the Network page", "", { ic: "network", sec: "connections" })], { cls: "icons more3" })}`);

  const keysA = () => C(980, `
    ${hero("desktop", "keyboard", "142 shortcuts", "Super is your main key", "6 of your own · 3 turned off · 1 clash to fix", btn("Add a shortcut", "primary", "plus"),
      `<div class="hsearch">${icon("search")}<span>Search shortcuts, or press the keys</span>${kbd("Ctrl F")}</div>
       <div class="hchips">${chip("All", "on")}${CATS.map(([, n]) => chip(n)).join("")}</div>`)}
    <div class="banner2 warn">${icon("warn")}<div class="tx"><b>Super + E does two things</b><span>It opens Files and the emoji picker; only Files happens.</span></div>${btn("Choose one")}</div>
    <div class="cols2 w60">
      ${ocard("Your shortcuts", MINE.map(([t, k, c]) => `<div class="opt"><div class="opt-text"><div>${t}</div><div class="d">${c}</div></div>${keys(...k)}</div>`), { act: `<span class="lnk">Edit</span>` })}
      ${ocard("Everything else", CATS.slice(0, 5).map(([ic, n, cnt, c]) => nrow(n, "", String(cnt), { ic, sec: "desktop" })).concat([nrow("Turned off", "", "3", { ic: "eye2", sec: "desktop" })]), { cls: "icons" })}
    </div>`);

  const updatesA = () => C(860, `
    ${hero("system", "download", "Ready to install", "12 updates", "Omarchy 4.5.1, 9 packages and 2 from the AUR · 412 MB · about 4 minutes", `${btn("What's new", "ghost")}${btn("Update now", "primary", "download")}`,
      `<div class="hfacts"><div><small>Last checked</small>10 minutes ago</div><div><small>Channel</small>Stable</div><div><small>After updating</small>Restart for the new kernel</div><div><small>Snapshot first</small>Yes, so you can go back</div></div>`)}
    <div class="cols2">
      ${ocard("In this update", [
        orow("Omarchy 4.5.1", "Faster theme switching, fixes for the bar", chip("Notes", "acc"), { ic: "nyxapp", sec: "system" }),
        orow("Linux kernel 7.2.9", "Needs a restart", `<span class="rv">142 MB</span>`, { ic: "chip", sec: "system" }),
        orow("Mesa 26.1.2", "Graphics drivers", `<span class="rv">38 MB</span>`, { ic: "monitor", sec: "system" }),
        nrow("9 more", "PipeWire, Hyprland, Firefox and others", "", { ic: "pkg", sec: "system" }),
      ], { cls: "icons" })}
      ${ocard("How updates happen", [
        orow("Update channel", "", dd("Stable"), { ic: "layers", sec: "system" }),
        orow("Include the AUR", "2 packages built from it", sw(true), { ic: "pkg", sec: "system" }),
        orow("Firmware", "2 devices · up to date", btn("Check", "sm"), { ic: "cpu", sec: "system" }),
        orow("Snapshot before updating", "", sw(true), { ic: "hist", sec: "system" }),
      ], { cls: "icons" })}
    </div>
    ${ocard("More", [nrow("Maintenance", "Package keys, unused packages, the last update's log", "5", { ic: "wrench", sec: "system" }), nrow("Update history", "", "Last: 3 days ago", { ic: "hist", sec: "system" })], { cls: "icons more3" })}`);

  /* ═══ Style B: controls with a preview ══════════════════════════════ */
  const split = (ctl, pv, o = {}) => `<div class="split2 ${o.cls || ""}"><div class="ctl"><div class="ci">${ctl}</div></div><div class="pv" style="--tc:var(--sec-${o.sec || "hardware"})">${pv}</div></div>`;
  const pvhead = (t, s, end = "") => `<div class="pvh"><div><b>${t}</b><span>${s}</span></div><span class="sp"></span>${end}</div>`;

  const soundB = () => split(`
    ${ocard("Plays through", OUTS.map(([ic, n, d, on]) => `<div class="opt ${on ? "picked" : ""}">${radio(on)}<span class="lic" style="--tc:var(--sec-hardware)">${icon(ic)}</span><div class="opt-text"><div>${n}</div><div class="d">${d}</div></div></div>`), { first: true, cls: "icons" })}
    ${ocard("Volume", [orow(`${icon("volume", "inl")}`, "", `<span class="slw grow">${slider(64, 0)}<span class="readout">64%</span></span>`, { cls: "volrow" }), orow("Maximum volume", "The volume keys stop here.", dd("100%"))])}
    ${ocard("Microphone", [orow("Built-in microphone", meter(58, 16), dd("Change")), orow("Input level", "", sl(72, "72%", 120))])}`,
    `${pvhead("Equalizer", "Every app passes through it on its way to Studio Speakers.", `${dd("Loudness")}${sw(true)}`)}
     <div class="eqbig card">
       <div class="eqy"><span>+12</span><span>+6</span><span>0</span><span>−6</span><span>−12</span></div>
       <div class="eqp">${eqCurve(EQ_LOUD, { w: 450, h: 290 })}<div class="eqx">${EQ_BANDS.map((b) => `<span>${b}</span>`).join("")}</div></div>
       <div class="pre"><small>Preamp</small><div class="vsl"><b style="bottom:62%"></b></div><span>+2 dB</span></div>
     </div>
     <div class="pvchips">${["Flat", "Loudness", "Voice", "More bass", "More treble", "Night"].map((p) => chip(p, p === "Loudness" ? "on" : "")).join("")}${chip("Save as a preset…", "", "plus")}</div>
     <div class="pvfoot">${icon("check-c")}<span>Up to +4 dB louder, and a limiter keeps the boost from distorting.</span><span class="sp"></span><span class="lvls">L ${meter(64, 18)}<br>R ${meter(60, 18)}</span></div>`);

  const displaysB = () => split(`
    <div class="gtitle first gflex">Display<span class="sp"></span></div>
    <div class="dpick">${[["Laptop screen", "Built in · main", true], ["Studio 27", "HDMI", false]].map(([n, d, on]) => `<div class="dp ${on ? "on" : ""}">${icon(on ? "laptop" : "monitor")}<div><b>${n}</b><span>${d}</span></div></div>`).join("")}</div>
    ${ocard("", [orow("Use this display", "", sw(true)), orow("Resolution", "", dd("2880 × 1800")), orow("Refresh rate", "", seg(["60", "90", "120 Hz"], "120 Hz")), orow("Rotation", "", dd("Normal"))])}
    ${ocard("Size and light", [orow("Scale", "", dd("175%")), orow("Brightness", "", sl(80, "80%", 120)), orow("Main display", "The bar and new windows open here.", sw(true))])}
    ${ocard("", [nrow("Rendering", "", "VRR for games"), nrow("Remembered displays", "", "3")])}`,
    `${pvhead("Your desk", "Drag a screen to move it; the edges snap together.", `${seg(["Extend", "Mirror", "One"], "Extend")}${btn("Identify", "sm", "info")}`)}
     ${arrangement({ cls: "big", tools: false })}
     <div class="scalepv card"><div class="sp1"><small>At 175% on the laptop screen</small><div class="sampw"><div class="samph"><i></i><i></i><i></i><b>Files</b></div><div class="sampb"><span class="sbx"></span><div><b>Documents</b><span>12 items · today</span></div></div><div class="sampb"><span class="sbx v"></span><div><b>Holiday photos</b><span>248 items</span></div></div></div></div>
       <div class="sp2"><b>Text and controls</b><span>About as big as on a 14-inch laptop at 100%. Most people like 150–200% on this screen.</span>${seg(["150", "175", "200"], "175")}</div></div>`);

  const wifiB = () => split(`
    ${ocard("", [orow("<b>Wi-Fi</b>", "6 networks nearby", sw(true), { ic: "wifi", sec: "connections" })], { cls: "icons" })}
    ${ocard("Networks", [`<div class="opt picked">${bars4(4)}<div class="opt-text"><div>Home-5G</div><div class="d">Connected · WPA3</div></div>${icon("check", "okc")}</div>`].concat(NETS.map(([n, s, b, l]) => `<div class="opt">${bars4(b)}<div class="opt-text"><div>${n}</div><div class="d">${s}</div></div>${l ? icon("lock", "lk") : ""}</div>`)).concat([`<div class="opt"><span class="addi">${icon("plus")}</span><div class="opt-text"><div class="acc">Hidden network…</div></div></div>`]), { act: ib("refresh", "Look again") })}`,
    `${pvhead("Home-5G", "Connected for 3 h 12 min", `${btn("Disconnect")}`)}
     <div class="netcard card">
       <div class="nsig">${ring(92, { size: 92, c: "var(--sec-connections)", label: "92%" })}<div><b>Excellent signal</b><span>5 GHz · channel 44 · 866 Mb/s</span></div></div>
       <div class="nspark"><div class="r1"><b>Traffic</b><span>${chip("Down 2.1 MB/s", "acc")} ${chip("Up 180 kB/s")}</span></div>${spark([0.1, 0.2, 0.15, 0.4, 0.3, 0.7, 0.5, 0.35, 0.3, 0.6, 0.8, 0.4, 0.25, 0.3, 0.5, 0.45, 0.2, 0.3], { w: 440, h: 64, c: "var(--sec-connections)" }).replace("<svg ", '<svg preserveAspectRatio="none" ')}</div>
     </div>
     <div class="nfacts card">${[["Address", "192.168.1.24"], ["Router", "192.168.1.1"], ["DNS", "Automatic"], ["Security", "WPA3 Personal"], ["Hardware address", "Private for this network"], ["Today", "1.8 GB · 240 MB"]].map(([k, v]) => `<div><small>${k}</small><span>${v}</span></div>`).join("")}</div>
     <div class="nrowx"><div class="card nopts">${orow("Join automatically", "", sw(true))}${orow("Metered", "Updates wait for another network", sw(false))}</div><div class="card nshare">${qr()}<div><b>Share</b><span>Scan with a phone to join</span></div></div></div>`, { sec: "connections" });

  const keysB = () => split(`
    <div class="field focus">${icon("search")}<span class="ph">Search, or press the keys</span></div>
    <div class="kcats">${CATS.map(([ic, n, cnt, c]) => `<span class="kcat ${n === "Windows" ? "on" : ""}" style="--kc:var(--sw-${c})"><i></i>${n}<small>${cnt}</small></span>`).join("")}</div>
    ${ocard("Windows", WIN_KEYS.slice(0, 8).map(([t, k], i) => `<div class="opt ${i === 1 ? "picked" : ""}"><div class="opt-text"><div>${t}</div></div>${keys(...k)}</div>`), { act: btn("Add", "sm", "plus") })}`,
    `${pvhead("Super and…", "The keys that do something with Super held, coloured by what they do. Click a key to change it.", seg(["Super", "+ Shift", "+ Alt"], "Super"))}
     <div class="kbwrap card">${keyboard("F")}
       <div class="kpop"><span class="kf">F</span><div><b>Super + F: Full screen</b><span>Windows · also Super + Shift + F for full screen without the bar</span></div><div class="bts">${btn("Change", "sm")}${btn("Turn off", "sm ghost")}</div></div></div>
     <div class="klegend">${CATS.slice(0, 5).map(([, n, , c]) => `<span><i style="background:var(--sw-${c})"></i>${n}</span>`).join("")}<span><i class="free"></i>Free</span></div>`, { sec: "desktop" });

  const updatesB = () => split(`
    <div class="ubar card">${chk(true)}<div class="opt-text"><div><b>12 updates</b> selected</div><div class="d">412 MB · about 4 minutes</div></div>${btn("Update", "primary", "download")}</div>
    <div class="gtitle">Omarchy</div><div class="card">${`<div class="opt picked">${chk(true)}<span class="lic" style="--tc:var(--sec-system)">${icon("nyxapp")}</span><div class="opt-text"><div>Omarchy 4.5.1</div><div class="d">4.5.0 → 4.5.1</div></div><span class="rv">22 MB</span></div>`}</div>
    <div class="gtitle gflex">Packages<span class="sp"></span><span class="note">9</span></div><div class="card">${PKGS.slice(0, 5).map(([n, v, s, w]) => `<div class="opt">${chk(true)}<div class="opt-text"><div>${n}</div><div class="d">${v}${w ? ` · <em>${w}</em>` : ""}</div></div><span class="rv">${s}</span></div>`).join("")}<div class="opt"><div class="opt-text"><div class="acc">4 more</div></div></div></div>`,
    `${pvhead("Omarchy 4.5.1", "Released 2 days ago · 22 MB · no restart needed", chip("Stable", "acc"))}
     <div class="notes card">
       <div class="nh">What's new</div>
       <ul>${["Themes switch about twice as fast, and the wallpaper fades across.", "The bar keeps its place when a second screen is plugged in.", "Night Light follows the sunset where you are, without a location service.", "Screen recordings can include the microphone.", "Fixes: the lock screen on 120 Hz screens, and the clipboard after waking."].map((x) => `<li>${x}</li>`).join("")}</ul>
       <div class="nh">Also in this update</div>
       <div class="ntags">${["Hyprland 0.57.2", "Walker 2.1", "Nyx Files 2.4.1"].map((x) => chip(x)).join("")}</div>
     </div>
     ${ocard("", [orow("Restart afterwards", "For the new Linux kernel; you can keep working until then.", "", { ic: "power", sec: "system" }), orow("Sign out afterwards", "Hyprland 0.57.2 starts with your next sign-in.", "", { ic: "user", sec: "system" })], { cls: "icons prep" })}
     <div class="pvfoot">${icon("hist")}<span>A snapshot is taken first, so you can go back from the boot menu.</span><span class="sp"></span><span class="lnk">Full release notes ${icon("external")}</span></div>`, { sec: "system" });

  /* ═══ Style C: overview tiles ═══════════════════════════════════════ */
  // tiles: [icon, name, value, sub, visual, on]; the detail opens under the row with the chosen tile.
  const ov = (sec, tiles, detail, top = "") => {
    const on = tiles.findIndex((t) => t[5]);
    const row = (a) => a.map(([ic, n, v, s, vis, o]) => `<div class="ovt ${o ? "on" : ""}"><div class="oh">${T(ic, sec)}<span>${n}</span>${o ? icon("chev-u", "oc") : icon("chev-d", "oc")}</div><b>${v}</b><small>${s}</small>${vis ? `<div class="ovis">${vis}</div>` : ""}</div>`).join("");
    const cols = NARROW ? 2 : 3, r = Math.floor(on / cols);
    let html = "";
    for (let i = 0; i < tiles.length; i += cols) {
      html += row(tiles.slice(i, i + cols));
      if (i / cols === r) html += `<div class="ovd" style="--at:${((on % cols) + 0.5) / cols * 100}%">${detail}</div>`;
    }
    return C(940, `${top}<div class="ovgrid" style="--tc:var(--sec-${sec});--n:${cols}">${html}</div>`, "ovc");
  };

  const soundC = () => ov("hardware", [
    ["speaker", "Output", "Studio Speakers", "USB audio · 64%", `${slider(64, 0)}`, true],
    ["mic", "Microphone", "Built-in", "72% · noise reduction off", meter(58, 20)],
    ["eq", "Equalizer", "Loudness", "Up to +4 dB", miniCurve(200, 30)],
    ["apps", "Apps", "2 playing", "Music, Browser"],
    ["hist", "Devices", "4 remembered", "Pulse Buds last used yesterday"],
    ["wrench", "Troubleshooting", "All good", "PipeWire running for 3 days"],
  ], `<div class="odet">
      <div class="dchips">${OUTS.map(([ic, n, d, on]) => `<div class="dc ${on ? "on" : ""}">${icon(ic)}<div><b>${n}</b><span>${d}</span></div></div>`).join("")}</div>
      <div class="drows">${orow("Volume", "", sl(64, "64%", 220))}${orow("Maximum volume", "The volume keys stop here.", dd("100%"))}${orow("Use whenever it's connected", "Switch to Studio Speakers when they're plugged in.", sw(true))}${orow("Balance", "", `<span class="slw"><small class="lr">L</small>${slider(50, 140)}<small class="lr">R</small></span>`)}</div>
    </div>`);

  const displaysC = () => ov("hardware", [
    ["laptop", "Laptop screen", "175% · 120 Hz", "2880 × 1800 · main", "", true],
    ["monitor", "Studio 27", "150% · 60 Hz", "3840 × 2160 · HDMI"],
    ["grid", "Arrangement", "Extended", "Studio 27 above, to the right", `<div class="miniarr"><i></i><i class="b"></i></div>`],
    ["sun", "Brightness", "80%", "Laptop screen", slider(80, 0)],
    ["chip", "Rendering", "VRR for games", "Hardware cursors on"],
    ["hist", "Remembered", "3 displays", "Office projector, TV, Dock"],
  ], `<div class="odet two">
      <div class="dprev">${screen("Laptop screen", "2880 × 1800", { sel: true, seed: "lap", style: "position:relative;width:100%;height:150px" })}</div>
      <div class="drows">${orow("Use this display", "", sw(true))}${orow("Resolution", "", dd("2880 × 1800"))}${orow("Refresh rate", "", seg(["60 Hz", "120 Hz"], "120 Hz"))}${orow("Scale", "Bigger text and controls", seg(["100", "150", "175", "200"], "175"))}${orow("Rotation", "", dd("Normal"))}</div>
    </div>`);

  const wifiC = () => ov("connections", [
    ["wifi", "Wi-Fi", "Home-5G", "On · excellent · 5 GHz", bars4(4)],
    ["search", "Nearby", "6 networks", "1 open, 5 secured", "", true],
    ["hist", "Saved", "8 networks", "Joined automatically"],
    ["info", "This connection", "192.168.1.24", "Router 192.168.1.1"],
    ["qr", "Share", "Show a code", "For phones and guests"],
    ["network", "VPN and wired", "Off", "On the Network page"],
  ], `<div class="odet"><div class="nlist">${NETS.concat([["Office-Mesh", "WPA3", 1, true]]).map(([n, s, b, l]) => `<div class="nl">${bars4(b)}<div><b>${n}</b><span>${s}</span></div>${l ? icon("lock", "lk") : ""}${btn("Join", "sm")}</div>`).join("")}</div>
      <div class="dfoot"><span class="acc">${icon("plus")} Join a hidden network…</span><span class="sp"></span>${btn("Look again", "sm ghost", "refresh")}</div></div>`);

  const keysC = () => ov("desktop", [
    ["apps", "Apps & menus", "24", "Terminal, browser, launcher"],
    ["window", "Windows", "31", "Close, full screen, float, split", "", true],
    ["grid", "Workspaces & monitors", "28", "Go to 1–9, move, scratchpad"],
    ["screenshot", "Screenshots & recording", "9", "Region, window, screen"],
    ["volume", "Media & hardware", "18", "Volume, brightness, lights"],
    ["user", "Your own", "6", "1 clash to fix", `<span class="pill" style="--tc:var(--warning)">${icon("warn")}Super + E</span>`],
  ], `<div class="odet"><div class="klist">${WIN_KEYS.slice(0, NARROW ? 6 : 10).map(([t, k]) => `<div class="kl"><span>${t}</span>${keys(...k)}</div>`).join("")}</div>
      <div class="dfoot"><span class="dim">21 more in Windows</span><span class="sp"></span>${btn("Add to Windows", "sm", "plus")}</div></div>`,
    `<div class="ovtop"><div class="field">${icon("search")}<span class="ph">Search 142 shortcuts, or press the keys</span></div>${btn("Add a shortcut", "primary", "plus")}</div>`);

  const updatesC = () => ov("system", [
    ["nyxapp", "Omarchy", "4.5.1 is ready", "Faster themes, bar fixes"],
    ["pkg", "Packages", "9 updates", "Kernel 7.2.9 needs a restart", "", true],
    ["store", "AUR", "2 updates", "Built on this computer"],
    ["cpu", "Firmware", "Up to date", "2 devices · checked today"],
    ["layers", "Channel", "Stable", "Tested releases"],
    ["wrench", "Maintenance", "5 tools", "Keys, unused packages, logs"],
  ], `<div class="odet">${tbl([["Package"], ["Version", "190px"], ["Size", "70px"], ["", "130px"]], PKGS.slice(0, 5).map(([n, v, s, w]) => [`<b>${n}</b>`, v, s, w ? chip(w, "acc") : ""]), { cls: "ptbl" })}<div class="dfoot"><span class="dim">4 more</span><span class="sp"></span>${btn("Update packages only", "sm")}</div></div>`,
    `<div class="ovtop sum card"><span class="lic" style="--tc:var(--sec-system)">${icon("download")}</span><div class="opt-text"><div><b>12 updates</b> · 412 MB · about 4 minutes</div><div class="d">Checked 10 minutes ago · a snapshot is taken first</div></div>${btn("What's new", "ghost")}${btn("Update all", "primary", "download")}</div>`);

  /* ── The window around each ──────────────────────────────────────── */
  const P = {
    sound: ["hardware", "Sound", "Output, volume, the equalizer and the microphone."],
    displays: ["hardware", "Displays", "Resolution, scale, brightness and how the screens sit."],
    wifi: ["connections", "Wi-Fi", "Networks nearby, the one you're on, and saved ones."],
    keys: ["desktop", "Keyboard Shortcuts", "What every key combination does, and your own."],
    updates: ["system", "Updates", "Omarchy, packages, the AUR and firmware."],
  };
  const page = (k, body) => () => swin({ sec: P[k][0], page: P[k][1], desc: P[k][2], body: body() });

  const shotsFor = (L, narrow) => [
    [`${L}-sound`, "Hardware › Sound", ""], [`${L}-displays`, "Hardware › Displays", ""], [`${L}-wifi`, "Connections › Wi-Fi", ""],
    [`${L}-keys`, "Desktop › Keyboard Shortcuts", ""], [`${L}-updates`, "System › Updates", ""], narrow,
  ];

  REG("styles", {
    name: "Page styles",
    summary: "The two-level Settings fixed getting to a page; the pages themselves are still long single columns of rows that all look the same. A banner, a heading, a card of rows, another heading, another card: the one thing you came for (what's playing, which network, how many updates) is a row like any other. Pick one of these three ways to build every page; round 2 draws every page in it, with two or three layouts each.",
    problems: [
      "<b>Every page is the same wall of rows:</b> an UPPERCASE heading, a card of rows, another heading, another card; nothing says what state things are in at a glance.",
      "<b>The thing you came for is a row like any other:</b> Wi-Fi's network is a row reading “Connected to … ”; the volume is Sound's third row; on Omarchy, Updates is a channel dropdown at the top of Software with no count of what's waiting.",
      "<b>Pages that are nearly empty:</b> Wi-Fi is a switch, one line of text and a Scan button; the networks only show after Scan, and the rest of the page is blank.",
      "<b>Read-outs before controls:</b> Displays shows “VRR active: Yes” and “Hardware cursors in use: Yes” above brightness, resolution and scale.",
      "<b>Controls without a picture of what they change:</b> the equalizer is nine columns of numbers; the arrangement is a dark box with output names in it; scale is a percentage in a dropdown.",
      "<b>Long lists with a control on every row:</b> Keyboard Shortcuts is 196 rows, each with keycaps joined by “+” and its own switch, sorted into groups you only find by scrolling.",
      "<b>Explanations above groups and banners at the top</b> push the controls down (“The preamp makes everything louder before it reaches the speakers — use it when…”), and wrap to two or three lines at 800 px.",
      "<b>Rows have no icons,</b> so a long card is a column of text; the section colours from the sidebar stop at the tabs, and rarely used groups (Troubleshooting, Remembered devices, Maintenance) sit with everyday ones.",
    ],
    today: [
      ["audio-1280", "Sound today", "A banner, then Output, then the equalizer's columns"],
      ["displays-1280", "Displays today", "Taken beside test screens, so the arrangement shows those too"],
      ["wifi-1280", "Wi-Fi today", "The networks show only after Scan"],
      ["keybindings-1280", "Keyboard Shortcuts today", "196 rows, a switch on each"],
      ["software-1280", "Software today (Omarchy's updates)", "On Omarchy, updates are a row in Software"],
      ["audio-800", "Sound today at 800 px", ""],
    ],
    options: [
      { id: "a", name: "Status first", idea: "Every page opens on one card that answers “what's going on here”: what's playing and how loud, which network you're on, how many updates and how big, how the screens are arranged. Its main control sits in it (the volume, the Wi-Fi switch, Update now). Below it the settings are short cards of rows with an icon each, side by side where there's room; anything you'd seldom touch (troubleshooting, remembered devices, rendering, maintenance) is one row in More that opens its own page.",
        good: "Pages you glance at: Sound, Wi-Fi, Bluetooth, Power, Updates, Disks, About.",
        shots: shotsFor("a", ["a-sound-800", "Sound at 800 px", "The cards stack under the status card"]) },
      { id: "b", name: "Controls with a preview", idea: "Pages split in two: the controls in a column on the left, and on the right a large live picture of what they change: the equalizer curve you can drag, the screens on your desk with a sample of text at the chosen scale, the network's signal and traffic, a keyboard showing which keys Super already uses, the release notes of the selected update. At 800 px the picture sits above the controls.",
        good: "Pages that change something you can see: Displays, Sound, Appearance, Window Style, Bar, Dock, Keyboard Shortcuts, Trackpad.",
        shots: shotsFor("b", ["b-displays-800", "Displays at 800 px", "The desk above the controls"]) },
      { id: "c", name: "Overview tiles", idea: "A page starts as a grid of tiles, one per group, each with its current value and a small picture (the volume, the mic level, the equalizer curve). Clicking a tile opens its settings right under its row, pointing up at it, and closes the one that was open, so a long page is six tiles instead of six screens of rows. Page-wide actions (search, Update all) sit on a bar above the tiles.",
        good: "Long pages with many groups: Tiling & Workspaces, Startup & Rules, Keyboard Shortcuts, Disks, the Assistant pages.",
        shots: shotsFor("c", ["c-keys-800", "Keyboard Shortcuts at 800 px", "Two tiles a row; the open one's list under it"]) },
    ],
    pages: {
      "a-sound": page("sound", soundA), "a-displays": page("displays", displaysA), "a-wifi": page("wifi", wifiA), "a-keys": page("keys", keysA), "a-updates": page("updates", updatesA),
      "b-sound": page("sound", soundB), "b-displays": page("displays", displaysB), "b-wifi": page("wifi", wifiB), "b-keys": page("keys", keysB), "b-updates": page("updates", updatesB),
      "c-sound": page("sound", soundC), "c-displays": page("displays", displaysC), "c-wifi": page("wifi", wifiC), "c-keys": page("keys", keysC), "c-updates": page("updates", updatesC),
    },
  });
})();
