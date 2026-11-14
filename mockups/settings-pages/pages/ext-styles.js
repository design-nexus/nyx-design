// Extension pages, round 1: three styles for every page an extension adds, drawn on four that
// cover the row kinds: ASUS (profiles, a slider with marks, the fan curve, firmware switches),
// Aura Lighting (colours, zone checkboxes, a switch group), a Logitech mouse (one page per
// device: battery, DPI, wheel, buttons) and Clipboard (an app's extension: a status row,
// a shortcut field, folding groups). Extensions print their pages as JSON (ext/protocol.rs),
// so a style applies to every extension at once.
(() => {
  const ID = "ext-styles";
  const Q = "?look=tile&sw=segment&sl=bar&rd=tinted&cb=tinted";

  /* ── Heads: the section, the page, the section's tabs with the extension's pages in them ── */
  const HW = ["Displays", "Sound", "Power & Battery", "Lock Screen", "Printers", "Disks", "ASUS", "Aura Lighting", "MX Master 3S"];
  const DT = ["Notifications", "Tiling & Workspaces", "Workspace Profiles", "Keyboard Shortcuts", "Startup & Rules", "Capture & Tools", "Glimpse", "Clipboard"];
  const from = (name) => `<span class="ex-from">${icon("puzzle")}${name}</span>`;
  const head = (sec, secName, tabs, on, desc, ext, more = false) => `<div class="shead" style="--sc:var(--sec-${sec})">
    <div class="sh1"><span class="sk">${secName}</span><span class="sp"></span>${from(ext)}</div>
    <div class="sh2"><b>${on}</b><span>${desc}</span></div>
    <div class="stabs">${more ? `<span class="ex-tarr">${icon("chev-l")}</span>` : ""}${tabs.map((t) => `<span class="${t === on ? "on" : ""}">${t}</span>`).join("")}</div></div>`;
  const page = (sec, body, h) => win({ hdr: shdr(), side: sside(sec), page: `${h}${body}` });

  /* ── Parts ── */
  const fld = (t, cls = "") => `<div class="field ex-fld ${cls}">${t}</div>`;
  const tag = (t, c = "var(--warning)") => `<span class="pill ex-tag" style="--tc:${c}">${t}</span>`;
  const marks = (vals, on) => `<span class="ex-marks">${vals.map((v) => `<span class="${v === on ? "on" : ""}">${v}</span>`).join("")}</span>`;
  const gt = (t, ic, sec, note = "") => `<div class="gtitle ex-gt">${T(ic, sec)}<span>${t}</span>${note ? `<span class="note">${note}</span>` : ""}</div>`;
  const gcard = (t, rows, o = {}) => ocard(t, rows, { cls: `icons ${o.cls || ""}`, note: o.note, first: o.first });
  const SW8 = ["#ffffff", "#ef4444", "#f59e0b", "#facc15", "#22c55e", "#22d3ee", "#3b82f6", "#a855f7", "#ec4899"];
  const swatches = (on, o = {}) => `<div class="ex-sws ${o.cls || ""}">${o.theme ? `<span class="ex-swt" style="--c:${o.theme}"><i></i>Theme</span>` : ""}${SW8.map((c) => `<span class="ex-sw ${c === on ? "on" : ""}" style="--c:${c}"></span>`).join("")}<span class="ex-hex">${icon("pipette")}${on}</span></div>`;
  const zone = (name, on) => `<div class="ex-zone"><span>${name}</span>${["Boot", "Awake", "Sleep", "Shut down"].map((m, i) => `<label>${chk(on[i])}${m}</label>`).join("")}</div>`;

  /* The fan curve: points [°C, %] from 20 to 100 °C. */
  const curve = (pts, o = {}) => {
    const w = o.w || 520, h = o.h || 170, X = (t) => 26 + ((t - 20) / 80) * (w - 36), Y = (p) => h - 18 - (p / 100) * (h - 30);
    const d = pts.map(([t, p], i) => `${i ? "L" : "M"}${X(t).toFixed(1)},${Y(p).toFixed(1)}`).join(" ");
    const grid = [0, 25, 50, 75, 100].map((p) => `<line x1="26" x2="${w - 10}" y1="${Y(p)}" y2="${Y(p)}"/><text x="0" y="${Y(p) + 3}">${p}%</text>`).join("")
      + [20, 40, 60, 80, 100].map((t) => `<text x="${X(t) - 8}" y="${h - 2}">${t}°</text>`).join("");
    const now = o.now ? `<line class="now" x1="${X(o.now)}" x2="${X(o.now)}" y1="8" y2="${h - 18}"/><text class="nowt" x="${X(o.now) + 5}" y="18">${o.now}° now</text>` : "";
    return `<svg class="ex-curve" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">${grid}${now}<path class="area" d="${d} L${X(pts[pts.length - 1][0])},${Y(0)} L${X(pts[0][0])},${Y(0)}Z"/><path class="ln" d="${d}"/>${pts.map(([t, p]) => `<circle cx="${X(t)}" cy="${Y(p)}" r="4.5"/>`).join("")}</svg>`;
  };
  const FAN = [[30, 0], [45, 18], [60, 20], [70, 26], [80, 42], [88, 68], [95, 100]];
  const curveCard = (o = {}) => `<div class="card ex-cc ${o.cls || ""}"><div class="ex-ch"><b>${o.title || "Fan curve"}</b><span>${o.sub || "Performance profile · drag a point"}</span><span class="sp"></span>${seg(["CPU fan", "GPU fan"], "CPU fan")}</div>
    ${curve(FAN, { now: 62, h: o.h, w: o.w })}
    <div class="ex-cf">${["Quiet", "Balanced", "Maximum"].map((p) => chip(p)).join("")}<span class="sp"></span>${btn("Copy to GPU fan", "sm ghost")}</div></div>`;

  /* Drawings for A's device pictures. */
  const laptopArt = (c = "var(--sec-hardware)") => `<svg class="ex-art ex-lap" viewBox="0 0 260 150" style="--kc:${c}">
    <path class="lid" d="M44 8h172a8 8 0 0 1 8 8v100H36V16a8 8 0 0 1 8-8z"/><rect class="scr" x="46" y="18" width="168" height="90" rx="3"/>
    <path class="base" d="M14 118h232l-10 18a8 8 0 0 1-7 4H31a8 8 0 0 1-7-4z"/>
    ${Array.from({ length: 4 }, (_, r) => Array.from({ length: 14 }, (_, k) => `<rect class="key" x="${42 + k * 13 + r * 2}" y="${121 + r * 3.6}" width="10" height="2.4" rx=".6"/>`).join("")).join("")}
    <path class="sbar" d="M90 60l14-14M100 70l26-26M112 82l38-38M128 92l40-40"/></svg>`;
  const mouseArt = () => `<svg class="ex-art ex-mouse" viewBox="0 0 170 230">
    <path class="body" d="M85 6C44 6 18 42 18 96v56c0 44 28 74 67 74s67-30 67-74V96C152 42 126 6 85 6z"/>
    <path class="seam" d="M85 8v84M20 92h130"/><rect class="wheel" x="76" y="28" width="18" height="42" rx="9"/>
    <path class="thumb" d="M14 112c-6 0-8 5-8 11v30c0 6 2 11 8 11"/><rect class="sb" x="2" y="122" width="10" height="13" rx="3"/><rect class="sb" x="2" y="140" width="10" height="13" rx="3"/>
    <circle class="ges" cx="40" cy="150" r="7"/></svg>`;
  const kbdArt = (c) => `<svg class="ex-art ex-kbd" viewBox="0 0 360 110" style="--kc:${c}">
    <rect class="deck" x="2" y="2" width="356" height="106" rx="10"/>
    ${Array.from({ length: 5 }, (_, r) => Array.from({ length: 15 - (r === 4 ? 6 : 0) }, (_, k) => { const wide = r === 4 && k === 4; return `<rect class="key" x="${12 + k * 22.6 + (r === 4 && k > 4 ? 22.6 * 5 : 0)}" y="${12 + r * 18.5}" width="${wide ? 22.6 * 6 - 4 : 18.6}" height="14.5" rx="3"/>`; }).join("")).join("")}</svg>`;
  const slashArt = (c) => `<div class="ex-slash" style="--kc:${c}">${Array.from({ length: 14 }, (_, i) => `<i style="opacity:${0.25 + ((i * 7) % 10) / 13}"></i>`).join("")}</div>`;
  const clipArt = () => `<div class="ex-clip card"><div class="cq">${icon("search")}<span>Search 656 items</span><span class="kc">${kbd("Super")}${kbd("Ctrl")}${kbd("V")}</span></div>
    ${[["text", "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIM…", "Terminal · 2 min"], ["link", "https://github.com/design-nexus/nyx-settings/pull/412", "Firefox · 6 min"], ["image", "Screenshot 2026-11-13 20.51.png · 1.2 MB", "Capture · 20 min"], ["text", "Meet at the north entrance, 7:30", "Signal · 1 h"]].map(([k, t, s], i) => `<div class="ci2 ${i === 0 ? "on" : ""}"><span class="k">${icon(k === "image" ? "image" : k === "link" ? "link" : "copy")}</span><div><b>${t}</b><span>${s}</span></div></div>`).join("")}</div>`;

  /* The stats line A's preview block draws: [label, value, sub]. */
  const stats = (rows) => `<div class="ex-stats">${rows.map(([l, v, s, c]) => `<div><small>${l}</small><b ${c ? `style="color:${c}"` : ""}>${v}</b>${s ? `<span>${s}</span>` : ""}</div>`).join("")}</div>`;

  /* ═══ ASUS ═══════════════════════════════════════════════════════════════════════════ */
  const asusHead = () => head("hardware", "Hardware", HW, "ASUS", "Performance, fan curves, battery care and firmware, through asusctl.", "ASUS extension");
  const perf = (o = {}) => gcard(o.t === false ? "" : "Performance", [
    orow("Right now", "Fn F5 cycles them", seg(["Quiet", "Balanced", "Performance"], "Performance"), { ic: "pulse", sec: "hardware" }),
    orow("When plugged in", "", dd("Performance"), { ic: "plug", sec: "hardware" }),
    orow("On battery", "", dd("Quiet"), { ic: "battery", sec: "hardware" }),
  ], { first: o.first, note: o.note });
  const battery = () => gcard("Battery care", [
    orow("Charge limit", "80% keeps the battery healthy if it's usually plugged in", "", { ic: "battery", sec: "hardware", cls: "ex-stack" }),
    `<div class="opt ex-sub">${sl(80, "80%", 0)}${marks(["60%", "80%", "100%"], "80%")}</div>`,
    orow("Charge to full once", "Ignores the limit until the next full charge", btn("Charge to 100%", "sm"), { ic: "bolt", sec: "hardware" }),
  ]);
  const fans = (inline) => gcard("Fan curves", [
    orow("Profile to edit", "Each profile has its own curves", dd("Performance"), { ic: "fan", sec: "hardware" }),
    orow("Use custom fan curves", "Off uses the firmware's curves", sw(true), { ic: "sliders", sec: "hardware" }),
    inline ? `<div class="opt ex-sub">${curveCard({ cls: "inl", w: 600, h: 150 })}</div>` : "",
    orow("Reset to the firmware's curves", "For this profile", btn("Reset", "sm ghost"), { ic: "rotate", sec: "hardware" }),
  ]);
  const firmware = () => gcard("Firmware", [
    orow("Boot sound", "The ASUS sound at power-on", sw(true), { ic: "volume", sec: "hardware" }),
    orow(`Turn off the dedicated GPU ${tag("Restart needed")}`, "Longer battery life, no NVIDIA graphics", sw(false), { ic: "chip", sec: "hardware" }),
    orow(`GPU mode ${tag("Restart needed")}`, "Hybrid saves battery", dd("Hybrid"), { ic: "monitor", sec: "hardware" }),
    orow("Panel overdrive", "Faster pixel response", sw(true), { ic: "spark2", sec: "hardware" }),
  ]);
  const advanced = () => gcard("Advanced", [nrow("Power limits and tuning", "Hotter, louder, faster; each value resets to the firmware's", "", { ic: "wrench", sec: "hardware" })]);

  const asusA = () => page("hardware", split(`${perf({ first: true })}${battery()}${fans(false)}${firmware()}${advanced()}`, `
    <div class="ex-dev">${laptopArt()}<div class="ex-dt"><b>Zephyrus G16</b><span>GU605CW · BIOS 312 · asusctl 6.1.12</span>${stats([["Profile", "Performance", "Fn F5"], ["Battery", "78%", "Charging to 80%", "var(--success)"], ["CPU", "62 °C", "Fans 2,400 rpm"], ["GPU", "Hybrid", "NVIDIA asleep"]])}</div></div>
    ${curveCard({ h: 190 })}
    ${pvfoot("Profiles change with Fn F5 too; Settings follows.", "check-c")}`, { sec: "hardware", ctlw: 440, cls: "ex-split" }), asusHead());
  const asusB = () => page("hardware", split(`${perf({ first: true })}${battery()}${fans(false)}${firmware()}${advanced()}`, `
    ${pvhead("Zephyrus G16 · GU605CW", "From the ASUS extension: what its pictures and readings show.")}
    <div class="card ex-glance">${[["Right now", "Performance"], ["Charge limit", "80%"], ["Custom fan curves", "On"], ["GPU mode", "Hybrid"]].map(([k, v]) => `<div><small>${k}</small><b>${v}</b></div>`).join("")}</div>
    ${curveCard({ h: 220, title: "Fan curves", sub: "Performance · CPU fan" })}
    ${pvfoot("Readings and pictures move here; the settings stay on the left.", "info")}`, { sec: "hardware", ctlw: 440, cls: "ex-split" }), asusHead());
  const hero = (ic, sec, name, sub, vals, end = "") => `<div class="card ex-hero"><span class="ex-hic">${T(ic, sec)}</span><div class="ex-ht"><b>${name}</b><span>${sub}</span></div><div class="ex-hv">${vals.map(([k, v, c]) => `<div><small>${k}</small><b ${c ? `style="color:${c}"` : ""}>${v}</b></div>`).join("")}</div>${end}</div>`;
  const col = (x) => `<div class="ex-col"><div class="ex-ci">${x}</div></div>`;
  const asusC = () => page("hardware", col(`${hero("laptop", "hardware", "Zephyrus G16", "GU605CW · asusctl 6.1.12", [["Profile", "Performance"], ["Battery", "78% · to 80%", "var(--success)"], ["CPU", "62 °C"]])}
    ${gt("Performance", "pulse", "hardware")}${perf({ t: false })}
    ${gt("Battery care", "battery", "hardware")}${battery().replace(/^<div class="gtitle[^>]*>.*?<\/div>/, "")}
    ${gt("Fan curves", "fan", "hardware")}${fans(true).replace(/^<div class="gtitle[^>]*>.*?<\/div>/, "")}`), asusHead());

  /* ═══ Aura Lighting ══════════════════════════════════════════════════════════════════ */
  const AC = "#3d8ae8";
  const auraHead = () => head("hardware", "Hardware", HW, "Aura Lighting", "The keyboard, the Slash lightbar and when each lights up.", "ASUS extension");
  const kbdRows = (inlineColour) => gcard("Keyboard", [
    orow("Brightness", "Also on the keyboard's keys", seg(["Off", "Low", "Medium", "High"], "High"), { ic: "sun", sec: "hardware" }),
    orow("Effect", "", seg(["Static", "Breathe", "Rainbow", "Pulse"], "Static"), { ic: "spark2", sec: "hardware" }),
    orow("Follow the theme", "Takes the theme's keyboard colour", sw(true), { ic: "palette", sec: "hardware" }),
    inlineColour ? `<div class="opt ex-sub">${swatches(AC, { theme: AC })}</div>` : orow("Colour", "The theme's, #3d8ae8", `<span class="ex-cdot" style="--c:${AC}"></span>`, { ic: "pipette", sec: "hardware" }),
  ], { first: true });
  const zones = () => gcard("When the lights are on", [`<div class="opt ex-zones">${zone("Keyboard", [1, 1, 0, 0])}${zone("Lightbar", [1, 1, 0, 1])}${zone("Logo", [1, 1, 0, 0])}</div>`], { note: "Leave Sleep off so the keyboard is dark while the laptop sleeps." });
  const slash = () => gcard("Slash lightbar", [
    orow("Slash lightbar", "The lights on the lid", sw(true), { ic: "lightbar", sec: "hardware" }),
    orow("Animation", "", dd("Flux"), { ic: "spark2", sec: "hardware", cls: "nest" }),
    orow("Brightness", "", sl(70, "70%", 120), { ic: "sun", sec: "hardware", cls: "nest" }),
    orow("Low battery warning", "Flashes under 20%", sw(true), { ic: "battery", sec: "hardware", cls: "nest" }),
  ]);
  const auraA = () => page("hardware", split(`${kbdRows(false)}${zones()}${slash()}`, `
    ${pvhead("Keyboard and lightbar", "The lights as they are now: Static in the theme's blue.", seg(["Keyboard", "Lightbar"], "Keyboard"))}
    <div class="card ex-lit">${kbdArt(AC)}<div class="ex-glow" style="--kc:${AC}"></div></div>
    <div class="card ex-pick"><div class="ex-ch"><b>Colour</b><span>Following Nyx Dark's keyboard colour</span></div>${swatches(AC, { theme: AC })}</div>
    <div class="card ex-sl2">${slashArt(AC)}<div><b>Slash lightbar</b><span>Flux · 70% · flashes under 20% battery</span></div></div>
    ${pvfoot("The keyboard keys change brightness too; Settings follows.", "check-c")}`, { sec: "hardware", ctlw: 440, cls: "ex-split" }), auraHead());
  const auraB = () => page("hardware", split(`${kbdRows(false)}${zones()}${slash()}`, `
    ${pvhead("Aura Lighting", "From the ASUS extension: its colours, and what's set now.")}
    <div class="card ex-pick big"><div class="ex-ch"><b>Colour</b><span>Keyboard · following the theme</span></div>${swatches(AC, { theme: AC, cls: "lg" })}</div>
    <div class="card ex-glance">${[["Brightness", "High"], ["Effect", "Static"], ["Slash lightbar", "On · Flux"], ["Lit when", "Boot, awake"]].map(([k, v]) => `<div><small>${k}</small><b>${v}</b></div>`).join("")}</div>
    ${pvfoot("Readings and pictures move here; the settings stay on the left.", "info")}`, { sec: "hardware", ctlw: 440, cls: "ex-split" }), auraHead());
  const auraC = () => page("hardware", col(`${hero("bulb", "hardware", "Aura Lighting", "Keyboard, Slash lightbar and logo", [["Effect", "Static"], ["Colour", `<span class="ex-cdot" style="--c:${AC}"></span>Theme`], ["Brightness", "High"]])}
    ${gt("Keyboard", "keyboard", "hardware")}${kbdRows(true).replace(/^<div class="gtitle[^>]*>.*?<\/div>/, "")}
    ${gt("When the lights are on", "clock", "hardware", "Leave Sleep off so the keyboard is dark while the laptop sleeps.")}${zones().replace(/^<div class="gtitle[^>]*>.*?<\/div>/, "")}`), auraHead());

  /* ═══ Logitech mouse ═════════════════════════════════════════════════════════════════ */
  const mxHead = () => head("hardware", "Hardware", HW, "MX Master 3S", "Battery, pointer speed, the wheels and buttons, through the Bolt receiver.", "Logitech extension");
  const mxRows = (first = true) => `${gcard("Pointer", [
    orow("Pointer speed", "1,600 DPI", `<span class="ex-rs">${sl(40, "1600", 130)}${ib("rotate", "Reset")}</span>`, { ic: "mouse", sec: "hardware" }),
    orow("Report rate", "", seg(["125", "250", "500", "1000 Hz"], "1000 Hz"), { ic: "pulse", sec: "hardware" }),
  ], { first })}
    ${gcard("Scrolling", [
      orow("Wheel mode", "", seg(["Ratchet", "Free spin", "SmartShift"], "SmartShift"), { ic: "scroll", sec: "hardware" }),
      orow("Shift to free spin at", "How fast you flick", sl(55, "Medium", 110), { ic: "sliders", sec: "hardware", cls: "nest" }),
      orow("Reverse the thumb wheel", "", sw(false), { ic: "swap", sec: "hardware" }),
    ])}
    ${gcard("Buttons", [
      orow("Back button", "", dd("Back"), { ic: "mbtn", sec: "hardware" }),
      orow("Forward button", "", dd("Forward"), { ic: "mbtn", sec: "hardware" }),
      orow("Gesture button", "Hold and move", dd("Workspaces"), { ic: "mbtn", sec: "hardware" }),
    ])}
    ${gcard("Easy-Switch", [orow("Computer", "Channel 1 is this one", seg(["1", "2", "3"], "1"), { ic: "laptop", sec: "hardware" })])}`;
  const mlab = (t, v) => `<div><b>${t}</b><span>${v}</span><i></i></div>`;
  const mxA = () => page("hardware", split(mxRows(), `
    ${pvhead("MX Master 3S", "Bolt receiver · firmware 12.02 · settings kept on the mouse", btn("Forget", "sm ghost"))}
    <div class="card ex-mpic"><div class="ex-mls">${mlab("Wheel", "SmartShift")}${mlab("Thumb wheel", "Scrolls sideways")}${mlab("Back · Forward", "Back · Forward")}${mlab("Gesture", "Workspaces")}</div>${mouseArt()}</div>
    ${stats([["Battery", "70%", "About 40 days", "var(--success)"], ["Speed", "1,600 DPI", "Reset: 1,000"], ["Report rate", "1000 Hz", "Every 1 ms"], ["Channel", "1 of 3", "This computer"]])}
    <div class="ex-chs">${[["1", "This computer", "Hades", true], ["2", "MacBook Air", "Last used Tuesday"], ["3", "Free", "Hold 3 to pair"]].map(([n, t, d, on]) => `<div class="card ${on ? "on" : ""}"><span class="n">${n}</span><div><b>${t}</b><span>${d}</span></div></div>`).join("")}</div>
    ${pvfoot("Easy-Switch: the button under the mouse moves it between computers.", "check-c")}`, { sec: "hardware", ctlw: 440, cls: "ex-split" }), mxHead());
  const mxB = () => page("hardware", split(mxRows(), `
    ${pvhead("MX Master 3S", "From the Logitech extension: its readings.")}
    <div class="card ex-bat"><span class="lic" style="--tc:var(--success)">${icon("battery")}</span><div><b>Battery 70%</b><span>About 40 days left</span></div><span class="ex-bm">${prog(70, "ok")}</span></div>
    <div class="card ex-facts">${[["Model", "MX Master 3S"], ["Connection", "Bolt receiver, channel 1"], ["Firmware", "12.02"], ["Serial", "4A1F-29C0"]].map(([k, v]) => `<div><small>${k}</small><span>${v}</span></div>`).join("")}</div>
    ${pvfoot("Readings and pictures move here; the settings stay on the left.", "info", btn("Forget", "sm ghost"))}`, { sec: "hardware", ctlw: 440, cls: "ex-split" }), mxHead());
  const mxC = () => page("hardware", col(`${hero("mouse", "hardware", "MX Master 3S", "Bolt receiver · firmware 12.02", [["Battery", "70%", "var(--success)"], ["Speed", "1,600 DPI"], ["Channel", "1 of 3"]], btn("Forget", "sm ghost"))}
    ${gt("Pointer", "mouse", "hardware")}${mxRows(false).replace(/^\s*<div class="gtitle[^>]*>.*?<\/div>/, "").replace(/<div class="gtitle([^>]*)>(Scrolling|Buttons|Easy-Switch)/g, (m, a, t) => `<div class="gtitle ex-gt"${a.replace(/class="[^"]*"/, "")}>${T({ Scrolling: "scroll", Buttons: "mbtn", "Easy-Switch": "laptop" }[t], "hardware")}<span>${t}</span>`)}`), mxHead());

  /* ═══ Clipboard (an app's extension) ═════════════════════════════════════════════════ */
  const clipHead = () => head("desktop", "Desktop", DT, "Clipboard", "History, privacy, snippets, verification codes and the shortcut.", "Nyx Clipboard", true);
  const status = () => `<div class="card ex-status"><span class="lic" style="--tc:var(--sec-desktop)">${icon("clip")}</span><div class="opt-text"><div><b>656 items</b> · 0 pinned · 0 snippets</div><div class="d">28.8 MB on this computer · watching the clipboard</div></div>${btn("Open Clipboard", "sm")}</div>`;
  const clipRows = (o = {}) => `${o.status ? status() : ""}
    ${gcard("", [orow("Private mode", "Stops saving what you copy. Also Ctrl Shift P", sw(false), { ic: "eyeoff", sec: "desktop" })], { first: !o.status })}
    ${gcard("Opening", [
      orow("Shortcut", "Super V still pastes as Omarchy does", `<span class="kc">${kbd("Super")}${kbd("Ctrl")}${kbd("V")}</span>`, { ic: "keyboard", sec: "desktop" }),
      orow("Opens", "", seg(["In the middle", "At the pointer"], "In the middle"), { ic: "window", sec: "desktop" }),
      orow("Between items pasted together", "Several picked with Ctrl Space", dd("A new line"), { ic: "ul", sec: "desktop" }),
    ])}
    ${gcard("History", [
      orow("Keep", "Older items go first; pinned stay", dd("1,000"), { ic: "history", sec: "desktop" }),
      orow("For", "Unused items are removed after", dd("30 days"), { ic: "clock", sec: "desktop" }),
      orow("Save images", "Up to 10 MB each", sw(true), { ic: "image", sec: "desktop" }),
      orow("Clear history", "Everything except pinned items", btn("Clear", "sm dtext"), { ic: "trash2", sec: "desktop" }),
    ])}
    ${o.more !== false ? gcard("", [nrow("Verification codes", "Codes from notifications, at the top while valid", "", { ic: "shield", sec: "desktop" }), nrow("Assistant", "Translate into English", "", { ic: "sparkle", sec: "desktop" }), nrow("Actions from other apps", "2 apps", "", { ic: "puzzle", sec: "desktop" })]) : ""}`;
  const clipA = () => page("desktop", split(clipRows({ more: true }), `
    ${pvhead("The pop-up", "What Super Ctrl V opens: newest first, search as you type.", btn("Open Clipboard", "sm"))}
    ${clipArt()}
    ${stats([["History", "656 items", "28.8 MB"], ["Pinned", "0", "Kept for good"], ["Private mode", "Off", "Ctrl Shift P"]])}
    ${pvfoot("Passwords and keys are kept in memory for two minutes, never written down.", "shield")}`, { sec: "desktop", ctlw: 440, cls: "ex-split" }), clipHead());
  const clipB = () => page("desktop", split(clipRows({ more: false }), `
    ${pvhead("Clipboard", "From Nyx Clipboard: its status and its other pages.")}
    ${status()}
    ${gcard("More", [nrow("Verification codes", "Codes from notifications, at the top while valid", "", { ic: "shield", sec: "desktop" }), nrow("Assistant", "Translate into English", "", { ic: "sparkle", sec: "desktop" }), nrow("Actions from other apps", "2 apps", "", { ic: "puzzle", sec: "desktop" }), nrow("Privacy", "Passwords and keys, and apps never saved from", "", { ic: "eyeoff", sec: "desktop" })])}
    ${pvfoot("Status rows and folding groups move here; the settings stay on the left.", "info")}`, { sec: "desktop", ctlw: 440, cls: "ex-split" }), clipHead());
  const clipC = () => page("desktop", col(`${hero("clip", "desktop", "Clipboard", "656 items · 28.8 MB · watching the clipboard", [["Pinned", "0"], ["Snippets", "0"], ["Private mode", "Off"]], btn("Open Clipboard", "sm"))}
    ${clipRows({ more: true }).replace(/<div class="gtitle([^>]*)>(Opening|History)/g, (m, a, t) => `<div class="gtitle ex-gt">${T(t === "Opening" ? "keyboard" : "history", "desktop")}<span>${t}</span>`)}`), clipHead());

  /* ── Options ── */
  const shots = (o, names) => names.map(([p, label]) => [[`${o}-${p}`, label, "", `${ID}/${o}-${p}${Q}`], [`${o}-${p}-800`, `${label} at 800 px`, "", `${ID}/${o}-${p}${Q}`]]).flat();
  const PAGES4 = [["asus", "ASUS"], ["aura", "Aura Lighting"], ["mouse", "Logitech mouse"], ["clipboard", "Clipboard"]];

  REG(ID, {
    name: "Extension pages: style",
    summary: "Every page an extension adds is drawn by one renderer (ext/render.rs) from the JSON its helper prints: groups become titled cards of rows, centred in one column. There's no preview pane, no picture, and nothing that says the page came from an extension, so ASUS, Aura, a Logitech mouse and Clipboard all look like long forms next to the redesigned pages. A style picked here applies to all 17 extensions: the 13 in the catalog, plus Agents, Clipboard, Glimpse and Passwords.",
    problems: [
      "<b>One narrow column in a wide window:</b> the cards sit in the middle with empty space either side, while the built-in pages are controls beside a live picture.",
      "<b>Pictures buried in forms:</b> the fan curve is a full-width chart inside the Fan curves card, the colour picker a row of dots inside Keyboard; you scroll past settings to see what they change.",
      "<b>No tiles, no tags that read:</b> rows have no icons, and \"Restart needed\" is a small grey label beside the title.",
      "<b>Readings look like settings:</b> battery, model, firmware and serial are rows in a card like any other, at the bottom of the page.",
      "<b>A slider with marks takes three lines:</b> Charge limit is a title, a description, then a full-width bar with 60%, 80% and 100% buttons under it.",
      "<b>Nothing says where a page comes from:</b> ASUS and Aura Lighting look built in; removing them is on System › Extensions.",
    ],
    today: [["ext-asus-1280", "ASUS today", ""], ["ext-aura-1280", "Aura Lighting today", ""], ["ext-clipboard-1280", "Clipboard today", "Logitech isn't installed here; its page is the same kind of card stack."], ["ext-asus-800", "ASUS at 800 px", ""]],
    options: [
      { id: "a", name: "Controls beside a device picture", idea: "The built-in pages' style, with the picture coming from the extension. A page's JSON gets an optional <code>preview</code> block: a device kind Settings knows how to draw (laptop, keyboard, mouse, headset, camera, monitor, controller, tablet, an app's window), labels on it, and up to four readings. Rows that are pictures (the fan curve, the colour picker, the camera, meters) move into the pane under it; the settings stay on the left with Umbra tiles. Pages without the block get B's pane. The head says which extension the page is from.",
        shots: shots("a", PAGES4) },
      { id: "b", name: "Controls beside an automatic pane", idea: "The same split with no change to extensions. Settings builds the pane from what the page already has: the subtitle and banners as its heading, an at-a-glance card from the current values of the first rows, the picture rows (curve, colours, camera, meters), info rows as a facts card, a status row at the top, and folding groups as links. Every extension gets it the day it's built; the panes are plainer than A's.",
        shots: shots("b", PAGES4) },
      { id: "c", name: "One column with a device card", idea: "No split. A card at the top shows the device or app on an Umbra tile, its name, and three readings. Below, the groups are the new cards with a tile on each heading, and pictures stay inline in their group at full width. Closest to today and simplest for extension authors, but it doesn't match the built-in pages beside it.",
        shots: shots("c", PAGES4) },
    ],
    icons: {
      plug: '<path d="M8 3v5M16 3v5M6 8h12v3a6 6 0 0 1-12 0zM12 17v4"/>',
      fan: '<circle cx="12" cy="12" r="1.8"/><path d="M12 10.2c-1-3.6.4-6.7 3-6.7 2.4 0 3 3.4-1.2 5.6M13.8 12c3.6-1 6.7.4 6.7 3 0 2.4-3.4 3-5.6-1.2M12 13.8c1 3.6-.4 6.7-3 6.7-2.4 0-3-3.4 1.2-5.6M10.2 12c-3.6 1-6.7-.4-6.7-3 0-2.4 3.4-3 5.6 1.2"/>',
      bolt: '<path d="M13 2.5 5 13.5h6l-1 8 8-11h-6z"/>',
      spark2: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"/>',
      pipette: '<path d="m14.5 4.5 5 5M17 2.5a2.1 2.1 0 0 1 3 3l-2 2-3-3zM15 7.5 6 16.5 5 19l2.5-1 9-9"/>',
      lightbar: '<path d="M5 19 19 5M8 19l11-11M5 16 16 5"/>',
      bulb: '<path d="M9 17.5h6M10 20.5h4M12 3.5a5.5 5.5 0 0 0-3.3 9.9c.8.6 1.3 1.6 1.3 2.6h4c0-1 .5-2 1.3-2.6A5.5 5.5 0 0 0 12 3.5z"/>',
      clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
      scroll: '<rect x="7" y="3" width="10" height="18" rx="5"/><path d="M12 7v4"/>',
      swap: '<path d="M7 4v16M3.5 16.5 7 20l3.5-3.5M17 20V4M13.5 7.5 17 4l3.5 3.5"/>',
      mbtn: '<path d="M12 3.5c-4 0-6.5 3-6.5 7.5v3c0 4 2.7 6.5 6.5 6.5s6.5-2.5 6.5-6.5v-3c0-4.5-2.5-7.5-6.5-7.5zM12 3.5V10M5.5 10h13"/>',
      clip: '<rect x="5.5" y="4.5" width="13" height="16" rx="2"/><path d="M9 4.5V3.5h6v1M9 10h6M9 13.5h6M9 17h3.5"/>',
      eyeoff: '<path d="M3 3l18 18M10.6 6.2A9 9 0 0 1 12 6c6 0 9.5 6 9.5 6a16 16 0 0 1-2.6 3.3M6.6 7.6A16 16 0 0 0 2.5 12S6 18 12 18a8.6 8.6 0 0 0 4-1"/>',
      image: '<rect x="3.5" y="4.5" width="17" height="15" rx="2"/><circle cx="9" cy="10" r="1.8"/><path d="m4 18 5-5 3.5 3.5L15 14l5 4.5"/>',
      "chev-l": '<path d="m14.5 6-6 6 6 6"/>',
    },
    pages: Object.fromEntries(["a", "b", "c"].flatMap((o) => PAGES4.map(([p]) => [`${o}-${p}`, { a: { asus: asusA, aura: auraA, mouse: mxA, clipboard: clipA }, b: { asus: asusB, aura: auraB, mouse: mxB, clipboard: clipB }, c: { asus: asusC, aura: auraC, mouse: mxC, clipboard: clipC } }[o][p]]))),
  });
})();
