// Extension pages, round 2: every page the 17 extensions add, in style A (controls beside a
// device picture), which Ken picked in round 1 (pages/ext-styles.js, where these parts started).
(() => {
  const ID = "ext-pages";
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
  const hero = (ic, sec, name, sub, vals, end = "") => `<div class="card ex-hero"><span class="ex-hic">${T(ic, sec)}</span><div class="ex-ht"><b>${name}</b><span>${sub}</span></div><div class="ex-hv">${vals.map(([k, v, c]) => `<div><small>${k}</small><b ${c ? `style="color:${c}"` : ""}>${v}</b></div>`).join("")}</div>${end}</div>`;
  const col = (x) => `<div class="ex-col"><div class="ex-ci">${x}</div></div>`;

  /* ═══ ASUS ═══ */
  const asusHead = () => head("hardware", "Hardware", HW, "ASUS", "Performance, fan curves, battery care and firmware, through asusctl.", "ASUS extension");
  const perf = (o = {}) => gcard(o.t === false ? "" : "Performance", [
    orow("Right now", "Fn F5 cycles", seg(["Quiet", "Balanced", "Performance"], "Performance"), { ic: "pulse", sec: "hardware" }),
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

  /* ═══ Aura Lighting ═══ */
  const AC = "#3d8ae8";
  const auraHead = () => head("hardware", "Hardware", HW, "Aura Lighting", "The keyboard, the Slash lightbar and when each lights up.", "ASUS extension");
  const kbdRows = (inlineColour) => gcard("Keyboard", [
    orow("Brightness", "Keys too", seg(["Off", "Low", "Medium", "High"], "High"), { ic: "sun", sec: "hardware" }),
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

  /* ═══ Clipboard ═══ */
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

  const split2 = (sec, ctl, pv) => split(ctl, pv, { sec, ctlw: 470, cls: "ex-split" });
  const li = (ic, sec, t, d, end = "", cls = "") => `<div class="card ep-li ${cls}">${ic ? `<span class="lic" style="--tc:var(--sec-${sec})">${icon(ic)}</span>` : ""}<div><b>${t}</b>${d ? `<span>${d}</span>` : ""}</div>${end}</div>`;
  const ok = (t, c = "") => `<span class="ep-st ${c}">${t}</span>`;
  const DT2 = ["Workspace Profiles", "Keyboard Shortcuts", "Startup & Rules", "Capture & Tools", "Agents", "Clipboard", "Glimpse"];
  const ACC = ["Users", "Sign-in & Security", "Online Accounts", "Passwords"];

  /* ═══ Agents ═══ */
  const AG = [["Claude Code", "2.1.4", "resume · subagents", true], ["Codex CLI", "0.46.0", "resume · subagents", true], ["Grok Build", "1.3.0", "status · resume", true], ["Cursor CLI", "Installed", "resume", true], ["OpenCode", "0.15.2", "status · resume", true], ["Antigravity CLI", "", "status · resume", false], ["oh-my-pi", "", "status · resume", false], ["Muse Code", "", "resume", false], ["Crush", "", "status", false], ["Hermes", "", "resume", false]];
  const agentsA = () => page("desktop", split2("desktop", `
    ${gcard("Notifications", [orow("Notify when an agent needs you", "Approvals, finished turns, errors and agents that end unexpectedly; not the session on screen", sw(true), { ic: "bell", sec: "desktop" })], { first: true })}
    ${gcard("New sessions", [
      orow("Agent", "Listed first in New session", dd("The last one used"), { ic: "terminal", sec: "desktop" }),
      orow("Folder", "Where new sessions start", `<span class="rv">~/Projects</span>${btn("Change in Agents", "sm ghost")}`, { ic: "folder", sec: "desktop" }),
    ])}
    ${gcard("Quotas in the AI Hub", [
      orow("Claude Code", "Asks Anthropic with Claude Code's own sign-in", sw(true), { ic: "gauge", sec: "desktop" }),
      orow("Codex", "Asks OpenAI through codex app-server, with no model calls", sw(true), { ic: "gauge", sec: "desktop" }),
      orow("Grok Build", "Read only: its sign-in is never renewed here", sw(false), { ic: "gauge", sec: "desktop" }),
      orow("Cursor", "Asks Cursor with its own sign-in", sw(false), { ic: "gauge", sec: "desktop" }),
      orow("Antigravity", "Runs agy -p /usage", sw(false), { ic: "gauge", sec: "desktop" }),
    ], { note: "Each is checked every few minutes while on. Sign-ins go only to their own provider." })}
    ${gcard("Terminal", [orow("Font", "Change it under Appearance; colours follow the theme", `<span class="rv">System monospace</span>`, { ic: "text", sec: "desktop" })])}`, `
    ${pvhead("Agents on this computer", "Found on your PATH and in mise's installs. Shims are never run.", btn("Open Agents", "sm"))}
    ${stats([["Session manager", "Running", "Starts when Agents opens", "var(--success)"], ["Sessions", "3 open", "1 needs you"], ["Installed", "5 of 10", "Agents to pick from"]])}
    <div class="ep-grid ep-ag">${AG.map(([n, v, can, on]) => li("terminal", "desktop", n, on ? `${v} · ${can}` : "Not installed", "", on ? "" : "off")).join("")}</div>
    ${pvfoot("Quotas turned on show in the AI Hub on the bar.", "info")}`), head("desktop", "Desktop", DT2, "Agents", "Coding agents: notifications, the default agent, what is installed.", "Nyx Agents", true));

  /* ═══ Glimpse ═══ */
  const glimpseArt = () => `<div class="card ep-glimpse"><div class="q">${icon("search")}<span>budget</span><span class="kc">${kbd("Super")}${kbd("Space")}</span></div>
    ${[["file", "Budget 2026.ods", "~/Documents/Finance", "Matched the name", true], ["note", "Trip budget", "Notes · last week", "Matched the contents"], ["sparkle", "Spreadsheet about money", "~/Projects/ledger/README.md", "Matched the meaning · local AI"], ["calc", "= 1,240 × 12", "Calculator", "14,880"]].map(([ic, t, d, why, on]) => `<div class="r ${on ? "on" : ""}"><span class="lic" style="--tc:var(--sec-desktop)">${icon(ic)}</span><div><b>${t}</b><span>${d}</span></div><small>${why}</small></div>`).join("")}</div>`;
  const glimpseA = () => page("desktop", split2("desktop", `
    ${gcard("General", [
      orow("Show previews", "", sw(true), { ic: "eye", sec: "desktop" }),
      orow("Learn from what you pick", "Ranks what you open often higher", sw(true), { ic: "sparkle", sec: "desktop" }),
      orow("Search history and learned ranking", "Favourites and aliases are kept", btn("Clear", "sm dtext"), { ic: "history", sec: "desktop" }),
      orow("Pause indexing", "", sw(false), { ic: "pause", sec: "desktop" }),
      orow("Start indexing at login", "", sw(true), { ic: "power", sec: "desktop" }),
    ], { first: true })}
    ${gcard("Shortcuts", [
      orow("Use Glimpse shortcuts", "Instead of Omarchy's launcher", sw(true), { ic: "keyboard", sec: "desktop" }),
      orow("Search", "", `<span class="kc">${kbd("Super")}${kbd("Space")}</span>`, { ic: "search", sec: "desktop" }),
      orow("Contextual actions", "", `<span class="kc">${kbd("Ctrl")}${kbd("K")}</span>`, { ic: "keyboard", sec: "desktop" }),
      orow("Toggle favourite", "", `<span class="kc">${kbd("Ctrl")}${kbd("Shift")}${kbd("F")}</span>`, { ic: "star", sec: "desktop" }),
    ])}
    ${gcard("Sources", [
      orow("Projects", "~/Projects · semantic code search on", btn("Remove", "sm ghost"), { ic: "folder", sec: "desktop" }),
      orow("Documents", "~/Documents", btn("Remove", "sm ghost"), { ic: "folder", sec: "desktop" }),
      orow("Pictures", "~/Pictures", btn("Remove", "sm ghost"), { ic: "folder", sec: "desktop" }),
      nrow("Excluded folders", "2 exclusions", "", { ic: "eyeoff", sec: "desktop" }),
    ], { act: btn("Add folder", "sm", "plus") })}
    ${gcard("Local AI", [orow("Search by meaning", "EmbeddingGemma 2 in Nyx AI Core, on this computer. About 865 MB, downloaded once", sw(true), { ic: "sparkle", sec: "desktop" })])}
    ${gcard("Appearance", [orow("Follow Omarchy", "", sw(true), { ic: "palette", sec: "desktop" }), orow("Theme", "While not following", dd("Tokyo Night"), { ic: "palette", sec: "desktop", cls: "dis" })])}
    ${gcard("", [nrow("Plugins", "6 turned on", "", { ic: "puzzle", sec: "desktop" })])}`, `
    ${pvhead("What Super Space opens", "Apps, files, notes and more; it learns what you pick.", btn("Open Glimpse", "sm"))}
    ${glimpseArt()}
    ${stats([["Indexed", "48,120 files", "3 folders", ""], ["Local AI", "Ready", "Processing locally", "var(--success)"], ["Plugins", "6 on", "Calculator, Agents, …"]])}
    ${pvfoot("Indexing pauses on battery saver and when the processor runs hot.", "info")}`), head("desktop", "Desktop", DT2, "Glimpse", "Search, indexing, local AI and plugins.", "Nyx Glimpse", true));

  /* ═══ Passwords ═══ */
  const pwA = () => page("accounts", split2("accounts", `
    ${gcard("Locking", [
      orow("Lock after", "When the vault hasn't been used for this long", dd("15 minutes"), { ic: "clock", sec: "accounts" }),
      orow("Lock when the screen locks", "", sw(true), { ic: "lock", sec: "accounts" }),
      orow("Lock on sleep", "", sw(true), { ic: "moon", sec: "accounts" }),
    ], { first: true })}
    ${gcard("Copying", [
      orow("Clear copied values", "If the clipboard still holds the copy", dd("After 30 seconds"), { ic: "copy", sec: "accounts" }),
      orow("Paste once", "Clear the clipboard after the first paste", sw(false), { ic: "clip", sec: "accounts" }),
      orow("Notify on copy", "Names what was copied, never the value", sw(true), { ic: "bell", sec: "accounts" }),
    ])}
    ${gcard("Finding logins", [
      orow("In Glimpse", "Type “pw” and a name. Passwords are never shown there", sw(true), { ic: "search", sec: "accounts" }),
      orow("With Nyx Assistant", "Asks for a key press each time; never sees a password", sw(false), { ic: "sparkle", sec: "accounts" }),
      orow("Sync", "While the vault is open", dd("Every 30 minutes"), { ic: "refresh", sec: "accounts" }),
    ])}
    ${gcard("", [nrow("Browsers", "Fill on load · 2 paired", "", { ic: "globe", sec: "accounts" }), nrow("SSH agent", "Off", "", { ic: "terminal", sec: "accounts" }), nrow("Email aliases", "A random word", "", { ic: "mail", sec: "accounts" }), nrow("Templates", "11 built in", "", { ic: "file", sec: "accounts" })])}`, `
    <div class="card ep-vault"><span class="lic" style="--tc:var(--sec-accounts)">${icon("lock")}</span><div><b>Vault open</b><span>vault.example.com · locks in 12 minutes</span></div><span class="bts">${btn("Lock", "sm")}${btn("Sync", "sm", "refresh")}</span></div>
    ${stats([["Logins", "412", "3 weak", ""], ["Last synced", "4 min ago", "Every 30 minutes"], ["Passkeys", "9", "In 2 browsers"]])}
    <div class="ep-cap">Where your logins show up</div>
    <div class="ep-list">
      ${li("search", "accounts", "Glimpse", "“pw github” · names only, copy with Enter", ok("On"))}
      ${li("globe", "accounts", "Browsers", "Firefox and Chromium · fills on https into empty fields", ok("On"))}
      ${li("sparkle", "accounts", "Nyx Assistant", "Find, copy and generate, with a key press each time", ok("Off", "dim"))}
      ${li("terminal", "accounts", "SSH and git", "Keys turned on for the agent; each use asks first", ok("Off", "dim"))}
    </div>
    ${pvfoot("Passwords are filled and copied by Passwords alone; nothing else sees them.", "shield", btn("Open Passwords", "sm"))}`), head("accounts", "Accounts", ACC, "Passwords", "Vault locking, copying, Glimpse, browsers and email aliases.", "Nyx Passwords"));

  /* ═══ Hardware extensions: shared parts ═══ */
  const H = "hardware";
  const hw = (on, desc, ext) => head(H, "Hardware", ["Printers", "Disks", "ASUS", on === "ASUS" || on === "Aura Lighting" ? "Aura Lighting" : on].filter((v, i, a) => a.indexOf(v) === i), on, desc, ext, true);
  const hpage = (on, desc, ext, ctl, pv) => page(H, split2(H, ctl, pv), hw(on, desc, ext));
  const ban = (t, warn = false) => `<div class="card ep-ban ${warn ? "warn" : ""}">${icon(warn ? "warn" : "info")}<span>${t}</span></div>`;
  const picCard = (art, labels = "") => `<div class="card ep-pic">${art}${labels}</div>`;
  const dev = (art, name, sub, st) => `<div class="ex-dev">${art}<div class="ex-dt"><b>${name}</b><span>${sub}</span>${stats(st)}</div></div>`;
  const facts = (rows) => `<div class="card ex-facts">${rows.map(([k, v]) => `<div><small>${k}</small><span>${v}</span></div>`).join("")}</div>`;
  const rgbRows = (o = {}) => [
    orow("Effect", "The device's own effects", dd(o.effect || "Static"), { ic: "spark2", sec: H }),
    orow("Brightness", "", sl(o.bri || 80, `${o.bri || 80}%`, 120), { ic: "sun", sec: H }),
    orow("Follow the theme colour", "Takes the Omarchy theme's accent, and changes with the theme", sw(true), { ic: "palette", sec: H }),
    orow("Keep after restarting", "Stores the effect on the device, so it stays without OpenRGB", btn("Save to the device", "sm"), { ic: "download", sec: H }),
  ];
  const colourCard = (c, sub) => `<div class="card ex-pick"><div class="ex-ch"><b>Colour</b><span>${sub}</span></div>${swatches(c, { theme: c })}</div>`;
  const setupPage = (on, ext, desc, art, why, what, button, found = "Plugged in, not allowed yet") => hpage(on, desc, ext, `
    ${ban("Linux only lets <b>root</b> talk to these devices until a small rule allows your account to.", true)}
    ${gcard("Device access", [orow(button, what, btn("Allow access", "primary sm"), { ic: "lock", sec: H })], { first: false })}`, `
    ${pvhead(found, why)}
    ${picCard(art)}
    <div class="ep-list">${[["check-c", "Plugged in and found", "The device answers over USB"], ["lock", "Your account can't open it yet", "Only root can until the rule is installed"], ["shield", "One rule, asked once", "Asks for your password; nothing else changes"]].map(([ic, t, d], i) => li(ic, H, t, d, "", i === 1 ? "warn" : "")).join("")}</div>`);

  /* Pictures */
  const headsetArt = (c = "var(--sec-hardware)") => `<svg class="ep-art" viewBox="0 0 220 170" style="--kc:${c}"><path class="ln" d="M40 100V82a70 70 0 0 1 140 0v18" stroke-width="10" style="stroke-width:10;stroke:color-mix(in srgb,var(--text) 18%,transparent)"/><rect class="sh" x="22" y="92" width="44" height="64" rx="16"/><rect class="sh" x="154" y="92" width="44" height="64" rx="16"/><rect class="ac" x="30" y="104" width="28" height="40" rx="10"/><rect class="ac" x="162" y="104" width="28" height="40" rx="10"/><path class="ln" d="M30 146c-6 10-2 18 12 18h24" /><circle class="ac" cx="70" cy="164" r="4"/></svg>`;
  const camArt = () => `<div class="ep-cam"><div class="ep-feed"><span class="ep-person"></span><span class="ep-live">${icon("dot")}Live · 1920 × 1080</span><span class="ep-ptz">${ib("chev-l", "Pan left")}${ib("chev-u", "Tilt up")}${ib("chev-d", "Tilt down")}${ib("chev-r", "Pan right")}</span></div></div>`;
  const monArt = (c = "var(--sec-hardware)") => `<svg class="ep-art" viewBox="0 0 260 170" style="--kc:${c}"><rect class="sh" x="16" y="8" width="228" height="128" rx="8"/><rect class="ac" x="26" y="18" width="208" height="108" rx="4" style="opacity:.7"/><path class="sh" d="M112 136h36l6 20h-48z"/><rect class="sh" x="84" y="154" width="92" height="8" rx="4"/><text x="34" y="118">HDMI-1 · USB-C · DisplayPort-1</text></svg>`;
  const gpuArt = () => `<svg class="ep-art" viewBox="0 0 300 130" style="--kc:var(--sw-green)"><rect class="sh" x="8" y="14" width="284" height="92" rx="10"/><circle class="ac" cx="84" cy="60" r="34"/><circle class="ac" cx="200" cy="60" r="34"/><circle class="sh" cx="84" cy="60" r="8"/><circle class="sh" cx="200" cy="60" r="8"/><rect class="sh" x="30" y="106" width="150" height="12" rx="2"/><text x="226" y="100">RTX 5080</text></svg>`;
  const padArt = (c = "#3d6bff") => `<svg class="ep-art" viewBox="0 0 260 160" style="--kc:${c}"><path class="sh" d="M60 30h140c28 0 44 30 50 70 4 30-12 48-30 40-14-6-24-30-40-30H80c-16 0-26 24-40 30-18 8-34-10-30-40 6-40 22-70 50-70z"/><rect class="glow" x="96" y="26" width="68" height="8" rx="4"/><rect class="ac" x="98" y="40" width="64" height="30" rx="6"/><circle class="sh" cx="92" cy="96" r="14"/><circle class="sh" cx="168" cy="96" r="14"/><path class="ln" d="M52 64v18M43 73h18"/><circle class="ln" cx="206" cy="60" r="4"/><circle class="ln" cx="218" cy="72" r="4"/><circle class="ln" cx="194" cy="72" r="4"/><circle class="ln" cx="206" cy="84" r="4"/></svg>`;
  const tabletArt = () => `<svg class="ep-art" viewBox="0 0 280 160" style="--kc:var(--sec-hardware)"><rect class="sh" x="10" y="14" width="260" height="136" rx="14"/><rect class="ac" x="58" y="30" width="196" height="104" rx="4" style="opacity:.45"/><rect class="ln" x="80" y="42" width="152" height="80" rx="2" style="stroke-dasharray:4 4"/>${[0, 1, 2, 3].map((i) => `<rect class="sh" x="22" y="${36 + i * 24}" width="22" height="16" rx="4"/>`).join("")}<text x="86" y="118">Area used · 80%</text></svg>`;
  const deckArt = (cols, rows, o = {}) => `<div class="ep-deck ${o.cls || ""}" style="--cols:${cols}">${o.screen ? `<div class="scr"><b>14:32</b><span>Work · Page 1</span></div>` : ""}<div class="keys">${Array.from({ length: cols * rows }, (_, i) => { const k = (o.keys || [])[i]; return `<span class="${k ? "on" : ""} ${i === (o.sel ?? -1) ? "sel" : ""}">${k ? `${icon(k[0])}<small>${k[1]}</small>` : ""}</span>`; }).join("")}</div>${o.dials ? `<div class="dials"><i></i><i></i></div>` : ""}</div>`;
  const ramArt = (c) => `<svg class="ep-art" viewBox="0 0 300 90" style="--kc:${c}"><rect class="sh" x="10" y="20" width="280" height="56" rx="4"/><rect class="glow" x="14" y="10" width="272" height="10" rx="3"/><rect class="ac" x="14" y="12" width="272" height="8" rx="3"/>${Array.from({ length: 8 }, (_, i) => `<rect class="sh" x="${24 + i * 33}" y="34" width="24" height="26" rx="2"/>`).join("")}</svg>`;

  /* ═══ Logitech ═══ */
  const mlab = (t, v) => `<div><b>${t}</b><span>${v}</span><i></i></div>`;
  const logiMouse = () => hpage("MX Master 3S", "Battery, pointer speed, the wheels and buttons, through the Bolt receiver.", "Logitech extension", `
    ${gcard("Pointer", [
      orow("Pointer speed", "Higher is faster", `<span class="ex-rs">${sl(14, "1000 dpi", 120)}${ib("rotate", "Reset")}</span>`, { ic: "mouse", sec: H }),
      orow("Report rate", "Smoother, more battery", seg(["125", "250", "500", "1000 Hz"], "1000 Hz"), { ic: "pulse", sec: H }),
    ], { first: true })}
    ${gcard("Scrolling", [
      orow("Wheel mode", "", seg(["Ratchet", "Free spin", "SmartShift"], "SmartShift"), { ic: "scroll", sec: H }),
      orow("Shift threshold", "Lower shifts sooner", sl(24, "12", 110), { ic: "sliders", sec: H, cls: "nest" }),
      orow("Reverse wheel direction", "Content follows the wheel, like a touchpad", sw(false), { ic: "swap", sec: H }),
      orow("Reverse thumb wheel", "", sw(false), { ic: "swap", sec: H }),
    ], { note: "SmartShift clicks line by line until you flick the wheel, then spins free." })}
    ${gcard("Buttons", [orow("Back", "", dd("Default"), { ic: "mbtn", sec: H }), orow("Forward", "", dd("Default"), { ic: "mbtn", sec: H }), orow("Gesture button", "", dd("Middle click"), { ic: "mbtn", sec: H })], { note: "Each one can act as another. Put back whenever the mouse reconnects." })}
    ${gcard("Logitech", [orow("Keep settings applied", "Many devices forget them when switched off", sw(true), { ic: "rotate", sec: H })])}`, `
    ${pvhead("MX Master 3S", "Bolt receiver · firmware 12.02 · settings put back on connect", btn("Forget saved", "sm ghost"))}
    <div class="card ex-mpic"><div class="ex-mls">${mlab("Wheel", "SmartShift")}${mlab("Thumb wheel", "Scrolls sideways")}${mlab("Back · Forward", "Default")}${mlab("Gesture", "Middle click")}</div>${mouseArt()}</div>
    ${stats([["Battery", "70%", "Discharging", "var(--success)"], ["Speed", "1,000 dpi", "200–8,000"], ["Report rate", "1000 Hz", "Every 1 ms"]])}
    <div class="ep-cap">Easy-Switch · picking another sends the mouse there right away</div>
    <div class="ex-chs">${[["1", "This computer", "Hades", true], ["2", "Computer 2", "Not paired"], ["3", "Computer 3", "Not paired"]].map(([n, t, d, on]) => `<div class="card ${on ? "on" : ""}"><span class="n">${n}</span><div><b>${t}</b><span>${d}</span></div></div>`).join("")}</div>`);
  const logiKeys = () => hpage("MX Keys", "Battery, the backlight, media keys and special keys.", "Logitech extension", `
    ${gcard("Keys", [
      orow("Media keys first", "The top row controls brightness, volume and playback. Hold <b>Fn</b> for F1–F12", sw(true), { ic: "keyboard", sec: H }),
      orow("Turn off keys", "Selected keys do nothing, so they can't be hit by accident", `<span class="ep-chips">${chip("Caps Lock", "on", "check")}${chip("Insert")}${chip("Super")}</span>`, { ic: "keyboard", sec: H }),
    ], { first: true })}
    ${gcard("Backlight", [
      orow("Backlight", "Lights the keys when your hands are near", sw(true), { ic: "sun", sec: H }),
      orow("Brightness", "Turns off automatic", sl(50, "4 of 8", 110), { ic: "sun", sec: H, cls: "nest" }),
      orow("Turn off after", "Once you stop typing", sl(18, "60 s", 110), { ic: "clock", sec: H, cls: "nest" }),
    ])}
    ${gcard("Special keys", [nrow("Remap special keys", "Make any of 14 keys act as another one", "", { ic: "swap", sec: H })])}
    ${gcard("Easy-Switch", [orow("Computer", "This computer is <b>1</b>", seg(["1", "2", "3"], "1"), { ic: "laptop", sec: H })])}`, `
    ${pvhead("MX Keys", "Bolt receiver · firmware 4.1 · settings put back on connect")}
    <div class="card ex-lit">${kbdArt("#e8e6df")}<div class="ex-glow" style="--kc:#e8e6df"></div></div>
    ${stats([["Battery", "35%", "Discharging", "var(--success)"], ["Backlight", "4 of 8", "Off after 60 s"], ["Caps Lock", "Turned off", "Does nothing"]])}
    ${facts([["Type", "Keyboard"], ["Model", "B35B"], ["Serial", "8F2A-1C04"], ["Firmware", "RBK 4.1"]])}`);
  const logiG502 = () => hpage("G502 X LIGHTSPEED", "Battery, DPI, onboard profiles and lighting.", "Logitech extension", `
    ${gcard("Pointer", [
      orow("Pointer speed", "", `<span class="ex-rs">${sl(6, "1600 dpi", 120)}${ib("rotate", "Reset")}</span>`, { ic: "mouse", sec: H }),
      orow("Report rate", "", seg(["125", "250", "500", "1000 Hz"], "1000 Hz"), { ic: "pulse", sec: H }),
    ], { first: true })}
    ${gcard("Onboard profiles", [
      orow("Use onboard profiles", "Run from the settings stored in the mouse, as set up in G HUB", sw(true), { ic: "chip", sec: H }),
      orow("Profile", "Which stored profile is active", seg(["1", "2", "3", "4", "5"], "2"), { ic: "ul", sec: H, cls: "nest" }),
    ])}
    ${gcard("Lighting", [
      orow("Main", "", seg(["Off", "Solid", "Breathe", "Colour cycle"], "Breathe"), { ic: "spark2", sec: H }),
      orow("Main speed", "Seconds per cycle", sl(30, "3 s", 110), { ic: "clock", sec: H, cls: "nest" }),
      orow("Logo", "", seg(["Off", "Solid", "Breathe", "Colour cycle"], "Solid"), { ic: "spark2", sec: H }),
    ])}`, `
    ${pvhead("G502 X LIGHTSPEED", "LIGHTSPEED receiver · firmware 54.3")}
    ${ban("<b>Charge soon:</b> 12% left.", true)}
    ${picCard(mouseArt())}
    ${colourCard("#a855f7", "Main and Logo · following the theme")}
    ${stats([["Battery", "12%", "Charge soon", "var(--warning)"], ["Speed", "1,600 dpi", "100–25,600"], ["Profile", "2 of 5", "Stored in the mouse"]])}`);
  const logiSetup = () => setupPage("Logitech", "Logitech extension", "Logitech devices are plugged in, but this account can't talk to them yet.", mouseArt(), "Battery, buttons and lighting all need it.", "Installs <tt>/etc/udev/rules.d/42-logitech.rules</tt>. Asks for your password.", "Allow access to Logitech devices", "2 Logitech devices found");

  /* ═══ Headset ═══ */
  const headsetA = () => hpage("Arctis 7", "Battery, sidetone, lights and power-off timer.", "Headsets extension", `
    ${gcard("Sound", [
      orow("Sidetone", "Your own voice, while you talk", sl(30, "30%", 120), { ic: "mic", sec: H }),
      orow("Equalizer preset", "", dd("Bass boost"), { ic: "sliders", sec: H }),
      orow("Volume limiter", "Keeps the volume at a safe level", sw(false), { ic: "volume", sec: H }),
      orow("Microphone volume", "", sl(100, "100%", 120), { ic: "mic", sec: H }),
      orow("Mute by raising the mic", "", sw(true), { ic: "mic", sec: H }),
      orow("Voice prompts", "Spoken announcements such as “battery low”", sw(true), { ic: "volume", sec: H }),
    ], { first: true })}
    ${gcard("Headset", [
      orow("Lights", "", sw(true), { ic: "sun", sec: H }),
      orow("Mute light brightness", "", sl(100, "3", 110), { ic: "sun", sec: H }),
      orow("Turn off after", "When it's been silent this long", dd("30 minutes"), { ic: "power", sec: H }),
      orow("Bluetooth on at power-on", "", sw(false), { ic: "bt", sec: H }),
    ])}`, `
    ${pvhead("Arctis 7", "Battery and chat mix are read from the headset; the rest is what was last set here.")}
    ${picCard(headsetArt())}
    ${stats([["Battery", "64%", "About 15 hours", "var(--success)"], ["Chat mix", "More game", "The dial on the headset"], ["Turns off", "After 30 min", "Of silence"]])}
    ${gcard("", [orow("Warn when the battery is low", "A notification at 15%, checked every five minutes", sw(true), { ic: "bell", sec: H })])}`);

  /* ═══ Webcam ═══ */
  const camA = () => hpage("OBSBOT Tiny 3 Lite", "Picture and camera controls. Most cameras forget these when unplugged.", "Webcams extension", `
    ${gcard("Picture", [
      orow("Brightness", "", `<span class="ex-rs">${sl(50, "50", 110)}${ib("rotate", "Reset")}</span>`, { ic: "sun", sec: H }),
      orow("Contrast", "", `<span class="ex-rs">${sl(50, "50", 110)}${ib("rotate", "Reset")}</span>`, { ic: "contrast", sec: H }),
      orow("Automatic white balance", "", sw(true), { ic: "palette", sec: H }),
      orow("White balance", "Lower is warmer", sl(55, "5000 K", 110), { ic: "palette", sec: H, cls: "nest dis" }),
      orow("Anti-flicker", "Your mains frequency", seg(["Off", "50 Hz", "60 Hz"], "60 Hz"), { ic: "pulse", sec: H }),
      orow("Backlight compensation", "Brightens a subject in front of a bright window", sw(false), { ic: "sun", sec: H }),
    ], { first: true })}
    ${gcard("OBSBOT", [
      orow("Keep the camera awake", "Turns off its own sleep timer, even after a replug", sw(true), { ic: "eye", sec: H }),
      orow("Right now", "Awake · sleeps by itself: off", `${btn("Wake", "sm")}${btn("Sleep", "sm")}`, { ic: "power", sec: H }),
    ])}
    ${gcard("Microphone", [
      orow("Never let it go idle", "So the first word isn't clipped", sw(true), { ic: "mic", sec: H }),
      orow("Make it the default mic", "For apps like voice transcription", sw(false), { ic: "mic", sec: H }),
      orow("Keep it unmuted", "", sw(false), { ic: "mic", sec: H }),
    ])}
    ${gcard("", [orow("Reset everything", "Every control back to the camera's default", btn("Reset", "sm dtext"), { ic: "rotate", sec: H })])}`, `
    ${pvhead("Preview", "Only one app can use a camera at a time.", `<span class="rv">/dev/video2</span>`)}
    ${camArt()}
    <div class="ep-row">${["Wide", "Half body", "Close-up"].map((t, i) => chip(t, i === 1 ? "on" : "")).join("")}<span class="sp"></span>${btn("Centre", "sm", "target")}</div>
    <div class="ep-row"><span class="ep-cap">Positions</span>${[1, 2, 3].map((n) => btn(`Go to ${n}`, "sm")).join("")}<span class="sp"></span>${btn("Save as…", "sm ghost")}</div>
    <div class="card ep-meter"><span class="lic" style="--tc:var(--sec-hardware)">${icon("mic")}</span><div><b>OBSBOT Tiny 3 Lite microphone</b>${meter(42, 32)}</div></div>
    ${ban("AI tracking modes use OBSBOT's own commands and aren't in Settings yet.")}`);

  /* ═══ Corsair ═══ */
  const GAL = "#f2c14e";
  const corsairKb = () => hpage("Galleon 100 SD", "Lighting, device details and access for Corsair Web Hub.", "Corsair extension", `
    ${gcard("Lighting", rgbRows({ effect: "Static" }), { first: true })}
    ${gcard("Keys and firmware", [orow("Corsair Web Hub", "Key remaps, the dials and firmware updates, saved on the keyboard. Opens in Chrome or Chromium", btn("Open", "sm", "external"), { ic: "globe", sec: H })])}
    ${gcard("Built-in Stream Deck", [nrow("Stream Deck", "Running: set it up on its own page", "", { ic: "grid", sec: H })])}`, `
    ${pvhead("Galleon 100 SD", "A keyboard with a Stream Deck built in · USB 1b1c:2b0c")}
    <div class="card ex-lit">${kbdArt(GAL)}<div class="ex-glow" style="--kc:${GAL}"></div></div>
    ${colourCard(GAL, "Following the theme's accent")}
    ${facts([["Model", "Corsair Galleon 100 SD"], ["USB release", "1.04"], ["Serial", "A3F9-0071"], ["Interfaces", "Keyboard · Vendor-defined"]])}`);
  const corsairRam = () => hpage("Vengeance RGB", "Lighting, through OpenRGB.", "Corsair extension", `
    ${gcard("Lighting", rgbRows({ effect: "Rainbow wave", bri: 60 }).concat([orow("Speed", "", sl(50, "Medium", 110), { ic: "clock", sec: H })]), { first: true })}`, `
    ${pvhead("Vengeance RGB", "Memory · 2 sticks · through OpenRGB")}
    ${picCard(`<div class="ep-rams">${ramArt("var(--sw-violet)")}${ramArt("var(--sw-blue)")}</div>`)}
    ${facts([["Kind", "Memory"], ["Firmware", "—"], ["Serial", "Not reported"], ["Zones", "2 × 10 LEDs"]])}`);

  /* ═══ Stream Deck ═══ */
  const GK = [["terminal", "Terminal"], ["folder", "Files"], ["globe", "Browser"], ["play", "Play"], ["skip", "Next"], ["camera", "Shot"], ["mic", "Mute"], ["moon", "DND"], ["lock", "Lock"], ["grid", "Apps"], 0, ["chev-r", "Page 2"]];
  const deckRows = (n, sel) => [orow(`Key ${sel + 1} · ${GK[sel][1]}`, `Row ${Math.floor(sel / n) + 1}, column ${(sel % n) + 1}`, "", { ic: "grid", sec: H, cls: "ep-ksel" }),
    `<div class="opt ex-sub ep-kedit"><div class="field"><span>${GK[sel][1]}</span></div>${dd("Run a command")}<div class="field mono"><span>foot</span></div></div>`];
  const galleonDeck = () => hpage("Stream Deck", "The Galleon 100 SD's screen keys, top screen and dials, run by galleon-deck.", "Stream Deck extension", `
    ${gcard("Service", [orow("Run the Stream Deck", "Off, the keys fall back to a numpad", sw(true), { ic: "power", sec: H }), orow("Status", "Running", `${btn("Restart", "sm")}${btn("Open galleon-deck", "sm ghost")}`, { ic: "check-c", sec: H })], { first: true })}
    ${gcard("General", [
      orow("Brightness", "", sl(70, "70%", 110), { ic: "sun", sec: H }),
      orow("Start with profile", "", dd("Work"), { ic: "ul", sec: H }),
      orow("Clock format", "%H:%M is 24-hour", `<div class="field mono"><span>%H:%M</span></div>`, { ic: "clock", sec: H }),
      orow("Animations", "At login, plug-in and profile switch", sw(true), { ic: "spark2", sec: H }),
    ])}
    ${gcard("Profile", [orow("Theme", "Wallpaper follows your Omarchy wallpaper", dd("Synthwave"), { ic: "palette", sec: H }), orow("Volume step", "Each click of the left dial", sl(20, "2%", 110), { ic: "volume", sec: H })])}`, `
    ${pvhead("Keys on “Page 1”", "Work profile · click a key to change it", seg(["Page 1", "Page 2"], "Page 1"))}
    ${deckArt(3, 4, { screen: true, dials: true, keys: GK, sel: 0 })}
    <div class="card ep-keyed">${deckRows(3, 0).join("")}</div>
    <div class="ep-cap">Left dial: volume, press to mute · Right dial: pages, press for the start page</div>`);
  const EK = [["terminal", "Terminal"], ["folder", "Files"], ["globe", "Browser"], ["play", "Play"], ["skip", "Next"], ["camera", "Shot"], ["mic", "Mute"], 0, 0, 0, ["moon", "DND"], 0, 0, ["lock", "Lock"], ["chev-r", "Page 2"]];
  const elgato = () => hpage("Stream Deck MK.2", "What each key does, profiles, pages and brightness.", "Stream Deck extension", `
    ${gcard("Stream Deck", [orow("Running", "nyx-deck runs it in the background, at every sign-in", sw(true), { ic: "power", sec: H }), orow("Brightness", "", sl(70, "70%", 110), { ic: "sun", sec: H })], { first: true })}
    ${gcard("Profile", [orow("Profile to edit", "", dd("Default"), { ic: "ul", sec: H }), orow("Page to edit", "", dd("Main"), { ic: "ul", sec: H }), orow("Add a page", "", `<div class="field"><span class="ph">Page name</span></div>`, { ic: "plus", sec: H })])}`, `
    ${pvhead("Keys on “Main”", "Stream Deck MK.2 · 15 keys, 5 across", btn("Add page", "sm", "plus"))}
    ${deckArt(5, 3, { keys: EK, sel: 2, cls: "wide" })}
    <div class="card ep-keyed">${orow("Key 3 · Browser", "Row 1, column 3", "", { ic: "grid", sec: H, cls: "ep-ksel" })}<div class="opt ex-sub ep-kedit"><div class="field"><span>Browser</span></div>${dd("Run a command")}<div class="field mono"><span>firefox</span></div></div></div>`);

  /* ═══ RGB lighting ═══ */
  const RGBDEV = [["chip", "ROG STRIX Z790-E", "Motherboard · 4 zones", "var(--sw-red)"], ["ram", "Vengeance RGB × 2", "Memory", "var(--sw-violet)"], ["gpu", "RTX 4080 SUPER", "Graphics card", "var(--sw-green)"], ["fan", "LL120 fans × 3", "Cooler", "var(--sw-blue)"], ["mouse", "Basilisk V3", "Mouse", "var(--sw-teal)"]];
  const rgbAll = () => hpage("RGB lighting", "Every RGB device at once: one colour, the theme colour, saved profiles.", "RGB lighting extension", `
    ${gcard("Everything", [
      orow("Use the theme colour everywhere", "Each device's page can follow the theme as it changes", btn("Apply", "sm"), { ic: "palette", sec: H }),
      orow("Turn every light off", "", btn("Off", "sm"), { ic: "power", sec: H }),
    ], { first: true })}
    ${gcard("Profiles", [orow("Load a profile", "", dd("Evening"), { ic: "ul", sec: H }), orow("Save the lighting as a profile", "", `<div class="field"><span class="ph">Profile name</span></div>`, { ic: "download", sec: H })], { note: "Profiles are OpenRGB's: the effect and colours of every device." })}`, `
    ${pvhead("5 devices", "Through OpenRGB · each has its own page for effects, brightness and speed")}
    ${colourCard("#7c5cff", "One colour everywhere")}
    <div class="ep-list">${RGBDEV.map(([ic, n, k, c]) => li(ic, H, n, k, `<span class="ex-cdot" style="--c:${c}"></span>${icon("chev-r", "cv")}`)).join("")}</div>`);
  const rgbDev = () => hpage("ROG STRIX Z790-E", "Motherboard lighting.", "RGB lighting extension", `
    ${gcard("Lighting", rgbRows({ effect: "Breathing", bri: 70 }).concat([orow("Speed", "", sl(40, "Slow", 110), { ic: "clock", sec: H })]), { first: true })}`, `
    ${pvhead("ROG STRIX Z790-E", "Motherboard · through OpenRGB")}
    ${colourCard("#ef4444", "Breathing · not following the theme")}
    ${facts([["Kind", "Motherboard"], ["Maker", "ASUS"], ["Firmware", "AULA3-AR32-0207"], ["Connected at", "HID: /dev/hidraw4"]])}
    <div class="ep-list">${[["Aura Mainboard", "8 LEDs"], ["Aura Addressable 1", "36 LEDs"], ["Aura Addressable 2", "0 LEDs"], ["Aura Addressable 3", "12 LEDs"]].map(([z, n]) => li("", H, z, n)).join("")}</div>`);

  /* ═══ Monitors ═══ */
  const monA = () => hpage("DELL U2720Q", "Brightness, contrast, volume, input and power on the monitor itself.", "Monitors extension", `
    ${gcard("Picture", [
      orow("Brightness", "", sl(75, "75", 120), { ic: "sun", sec: H }),
      orow("Contrast", "", sl(75, "75", 120), { ic: "contrast", sec: H }),
      orow("Match the laptop screen", "Sets this monitor's brightness to the built-in screen's", btn("Match", "sm"), { ic: "laptop", sec: H }),
      orow("Colour preset", "", dd("6500 K"), { ic: "palette", sec: H }),
    ], { first: true })}
    ${gcard("Input and sound", [
      orow("Input", "Switching away shows another computer; switch back on the monitor", dd("USB-C"), { ic: "plug", sec: H }),
      orow("Speaker volume", "", sl(40, "40", 120), { ic: "volume", sec: H }),
    ])}
    ${gcard("Power", [orow("Turn the monitor off", "It wakes with its power button or a new picture", btn("Off", "sm"), { ic: "power", sec: H })])}`, `
    ${pvhead("DELL U2720Q", "DDC/CI · bus 4 · set on the monitor itself, not by the computer")}
    ${picCard(monArt())}
    ${stats([["Brightness", "75%", "Laptop screen: 40%"], ["Input", "USB-C", "This computer"], ["Preset", "6500 K", "Standard"]])}
    ${facts([["Model", "DELL U2720Q"], ["Maker code", "DEL"], ["Serial", "CN0F2H..."], ["I2C bus", "/dev/i2c-4"]])}`);
  const monSetup = () => setupPage("Monitors", "Monitors extension", "Allow your account to control external monitors.", monArt(), "Brightness, input and volume on the monitor itself, over DDC/CI.", "Installs <tt>/etc/udev/rules.d/45-nyx-ddc.rules</tt> so monitor control works without root. Asks once.", "Allow your account", "An external monitor is connected");

  /* ═══ Laptop ═══ */
  const lapA = () => hpage("Laptop", "Battery health and charge limit, power profile, keyboard light, mic and camera.", "Laptop extension", `
    ${gcard("Charge limit", [
      orow("Stop charging at", "80% is a good everyday limit", `${sl(60, "80%", 110)}`, { ic: "battery", sec: H }),
      orow("Start charging below", "Plugged in, it waits till then", sl(73, "75%", 110), { ic: "battery", sec: H }),
      orow("Charge to 100% once", "Until you set a limit again", btn("Charge fully", "sm"), { ic: "bolt", sec: H }),
    ], { first: true, note: "Keeping it below full makes the battery last more years." })}
    ${gcard("Power", [
      orow("Power profile", "", seg(["Saver", "Balanced", "Performance"], "Balanced"), { ic: "pulse", sec: H }),
      orow("Keyboard light", "", sl(66, "2 of 3", 110), { ic: "sun", sec: H }),
    ])}
    ${gcard("Privacy", [
      orow("Microphone", "Off mutes the default microphone for every app", sw(true), { ic: "mic", sec: H }),
      orow("Camera", "Off unloads its driver, so no app can use it. Asks for your password", sw(true), { ic: "camera", sec: H }),
    ])}`, `
    ${dev(laptopArt().replace('<path class="sbar"', '<path class="sbar" style="display:none"'), "Framework Laptop 13", "Framework · battery and power", [["Charge", "78%", "Charging to 80%", "var(--success)"], ["Health", "92%", "Of its original capacity"], ["Cycles", "214", "Charge cycles"]])}
    <div class="card ep-band"><div class="ep-bar"><i style="left:75%;width:5%"></i><b style="width:78%"></b></div><div class="ep-bl"><span>0%</span><span>Charging 78% · starts again below 75%, stops at 80%</span><span>100%</span></div></div>
    ${pvfoot("Batteries hold less as they age; below about 80% health you'll notice shorter runs.", "info")}`);

  /* ═══ NVIDIA ═══ */
  const nvA = () => hpage("GeForce RTX 5080 Laptop GPU", "Temperature, use, memory, power limit and which programs use it.", "NVIDIA extension", `
    ${gcard("Control", [
      orow("Power limit", "Lower is cooler and quieter", sl(70, "150 W", 120), { ic: "bolt", sec: H }),
      orow("Keep the driver loaded", "Programs start using the GPU faster, at a little idle power", sw(false), { ic: "chip", sec: H }),
    ], { first: true, note: "Both ask for your password. The power limit goes back to the default at restart." })}
    ${gcard("Programs using it", [orow("Hyprland", "", `<span class="rv">212 MB</span>`, { ic: "window", sec: H }), orow("Nyx AI Core", "", `<span class="rv">8,840 MB</span>`, { ic: "sparkle", sec: H }), orow("Firefox", "", `<span class="rv">164 MB</span>`, { ic: "globe", sec: H })])}`, `
    ${pvhead("RTX 5080 Laptop GPU", "Driver 580.95 · PCI 0000:01:00.0 · updated every 3 s")}
    ${picCard(gpuArt())}
    ${stats([["Temperature", "61 °C", "Fan 34%"], ["In use", "38%", "P2 · 1,980 MHz"], ["Memory", "9.2 of 16 GB", "3 programs"], ["Power", "84 W", "Limit 150 W"]])}
    <div class="card ep-mem"><div class="ex-ch"><b>Memory</b><span>9.2 GB of 16 GB</span></div><div class="ep-stack"><i style="width:55%;background:var(--sec-assistant)"></i><i style="width:1.3%;background:var(--sw-blue)"></i><i style="width:1%;background:var(--sw-amber)"></i></div><div class="ep-leg"><span><i style="background:var(--sec-assistant)"></i>Nyx AI Core 8.8 GB</span><span><i style="background:var(--sw-blue)"></i>Hyprland</span><span><i style="background:var(--sw-amber)"></i>Firefox</span></div></div>`);

  /* ═══ Controllers ═══ */
  const padA = () => hpage("DualSense", "Battery, a live button tester, rumble and lights.", "Game controllers extension", `
    ${gcard("Lights", [
      orow("Lightbar", "Follows the theme", `<span class="ex-cdot" style="--c:#3d6bff"></span>`, { ic: "sun", sec: H }),
      orow("Player lights", "", seg(["Off", "1", "2", "3", "4"], "1"), { ic: "user", sec: H }),
    ], { first: true })}
    ${gcard("Rumble", [orow("Try the rumble", "", `${btn("Light", "sm")}${btn("Strong", "sm")}${btn("Both", "sm")}`, { ic: "pulse", sec: H })])}`, `
    ${pvhead("Tester", "Hold buttons and move the sticks: this updates every second.")}
    <div class="card ep-pic ep-pad">${padArt()}<span class="ep-held">✕ · R1 held</span></div>
    <div class="ep-grid">${[["Left stick", "x −40% y +12%"], ["Right stick", "x 0% y 0%"], ["Left trigger", "0%"], ["Right trigger", "72%"]].map(([t, v]) => `<div class="card ep-li"><div><b>${t}</b><span>${v}</span></div>${t.includes("trigger") ? prog(parseInt(v) || 0) : ""}</div>`).join("")}</div>
    ${stats([["Battery", "60%", "Discharging", "var(--success)"], ["Connected by", "Bluetooth", ""], ["USB id", "054c:0ce6", ""]])}
    ${colourCard("#3d6bff", "Lightbar · following the theme")}`);

  /* ═══ Drawing tablet ═══ */
  const tabA = () => hpage("Drawing tablet", "Which screen the pen draws on, the area used, left-handed and mouse-like use.", "Drawing tablets extension", `
    ${gcard("Pen", [
      orow("Draw on", "The whole tablet maps to this screen", dd("eDP-1 (2560×1600)"), { ic: "monitor", sec: H }),
      orow("Area used", "Smaller means shorter moves", sl(75, "80%", 110), { ic: "crop", sec: H }),
      orow("Match the screen's shape", "Keeps circles round", sw(true), { ic: "crop", sec: H }),
      orow("Left-handed", "Turns the tablet around, buttons on the right", sw(false), { ic: "swap", sec: H }),
      orow("Move like a mouse", "The pen moves the pointer from where it is", sw(false), { ic: "mouse", sec: H }),
    ], { first: true, note: "Applied straight away." })}
    ${gcard("More", [orow("Pressure curve and more", "OpenTabletDriver sets the pressure curve and button actions", btn("Open OpenTabletDriver", "sm", "external"), { ic: "sliders", sec: H })])}`, `
    ${pvhead("Wacom Intuos S", "The area the pen uses, mapped onto the laptop screen")}
    ${picCard(tabletArt())}
    ${facts([["Connected", "wacom-intuos-s-pen"], ["Model", "Wacom Intuos S (CTL-4100)"], ["Drawing area", "152 × 95 mm"], ["Tablet buttons", "Drawing apps choose what they do"]])}`);

  /* ═══ Razer ═══ */
  const razerA = () => hpage("Razer Basilisk V3", "DPI, polling rate, battery and lighting.", "Razer extension", `
    ${gcard("Pointer", [
      orow("Sensitivity", "Higher is faster", sl(16, "4,000 dpi", 120), { ic: "mouse", sec: H }),
      orow("Polling rate", "Lower saves battery", seg(["125 Hz", "500 Hz", "1000 Hz"], "1000 Hz"), { ic: "pulse", sec: H }),
    ], { first: true })}
    ${gcard("Power", [orow("Sleep after", "Idle time before it sleeps", sl(33, "5 min", 110), { ic: "moon", sec: H })])}
    ${gcard("Lighting", [orow("Effect", "", dd("Colour cycle"), { ic: "spark2", sec: H }), orow("Brightness", "", sl(80, "80%", 110), { ic: "sun", sec: H })])}`, `
    ${pvhead("Razer Basilisk V3", "Through OpenRazer · serial PM1234")}
    ${picCard(mouseArt())}
    ${colourCard("#22c55e", "The last colour set here")}
    ${stats([["Battery", "86%", "Charging", "var(--success)"], ["Sensitivity", "4,000 dpi", "Up to 26,000"], ["Polling", "1000 Hz", ""]])}`);
  const razerSetup = () => hpage("Razer", "Set up OpenRazer for your Razer device.", "Razer extension", `
    ${ban("OpenRazer is installed, but its daemon isn't answering. Your account needs to be in the <tt>plugdev</tt> group, and the daemon running.", true)}
    ${gcard("Set up", [orow("Set up OpenRazer", "Adds you to <tt>plugdev</tt> and starts the daemon. Asks for your password; sign out and in afterwards", btn("Set up…", "primary sm"), { ic: "wrench", sec: H })])}`, `
    ${pvhead("A Razer device is plugged in", "DPI, polling rate, battery and lighting appear once OpenRazer answers.")}
    ${picCard(mouseArt())}
    <div class="ep-list">${[["check-c", "Razer Basilisk V3 found", "USB 1532:0099"], ["warn", "OpenRazer isn't answering", "Its daemon isn't running for this account"], ["user", "Sign out and in afterwards", "So the new group takes effect"]].map(([ic, t, d]) => li(ic, H, t, d)).join("")}</div>`);

  /* @@NEW@@ */

  const ICONS = {
      dot: '<circle cx="12" cy="12" r="4" fill="currentColor"/>',
      gauge: '<path d="M4 16a8 8 0 1 1 16 0"/><path d="m12 16 4-5"/>',
      text: '<path d="M5 6.5h14M12 6.5v12M9 18.5h6"/>',
      bt: '<path d="m7 7.5 10 9-5 4v-17l5 4-10 9"/>',
      contrast: '<circle cx="12" cy="12" r="8.5"/><path d="M12 3.5v17a8.5 8.5 0 0 0 0-17z" fill="currentColor"/>',
      crop: '<path d="M7 3v14h14M3 7h14v14"/>',
      target: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>',
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
  };
  const P = {
    asus: asusA, aura: auraA, "logi-mouse": logiMouse, "logi-keys": logiKeys, "logi-g502": logiG502, "logi-setup": logiSetup,
    headset: headsetA, webcam: camA, "corsair-kb": corsairKb, "corsair-ram": corsairRam, "deck-galleon": galleonDeck, "deck-elgato": elgato,
    "rgb-all": rgbAll, "rgb-dev": rgbDev, monitor: monA, "monitor-setup": monSetup, laptop: lapA, nvidia: nvA, controller: padA, tablet: tabA,
    razer: razerA, "razer-setup": razerSetup, agents: agentsA, clipboard: clipA, glimpse: glimpseA, passwords: pwA,
  };
  const S = (list) => list.flatMap(([k, label, cap, narrow]) => [[k, label, cap || "", `${ID}/${k}${Q}`]].concat(narrow ? [[`${k}-800`, `${label} at 800 px`, "", `${ID}/${k}${Q}`]] : []));
  const X = (id, name, idea, shots) => ({ id, name, idea, shots: S(shots) });

  REG(ID, {
    name: "Extension pages: every page",
    summary: "Round 2: every page the 17 extensions add, drawn in A (controls beside a device picture), which you picked. Settings on the left with Umbra tiles; on the right the device or app drawn from the page's preview block, its readings, and the rows that are pictures (curves, colours, camera, meters, key grids). Pages made per device are shown once for each kind of device. Sample devices and values are made up.",
    problems: [
      "<b>Agents' page never showed:</b> it sent its keywords as a list where Settings expects text, so Settings dropped the page. Fixed in Nyx Agents, and the page is drawn here.",
      "<b>No extension sets a section,</b> so all 13 catalog extensions land in Hardware. Fine for devices; the Stream Deck and RGB pages might sit better under Desktop and Personalization.",
      "<b>Setup pages repeat:</b> Logitech, Corsair, Monitors, Controllers and Razer each have their own “allow access” page with the same warning. They're drawn alike here: what was found, what's missing, one button.",
    ],
    todayNote: "Today's pages are in round 1 (Extension pages: style): one centred column of cards each.",
    options: [
      X("asus", "ASUS", "Two pages from asusctl: ASUS (profiles, battery care, fan curves, firmware) beside the laptop and its live fan curve, and Aura Lighting beside the lit keyboard and its colours.", [["asus", "ASUS", "", true], ["aura", "Aura Lighting", ""]]),
      X("logitech", "Logitech", "One page per device on a Bolt or LIGHTSPEED receiver, built from what the device can do: a mouse gets pointer, wheel, buttons and Easy-Switch; a keyboard gets keys and backlight; a gaming mouse gets onboard profiles and lighting. A setup page shows when this account can't open them yet.", [["logi-mouse", "MX Master 3S", "Labels on the mouse; Easy-Switch channels as cards", true], ["logi-keys", "MX Keys", ""], ["logi-g502", "G502 X LIGHTSPEED", "Low battery, onboard profiles, lighting"], ["logi-setup", "Allowing access", ""]]),
      X("headset", "Headsets", "One page per headset HeadsetControl finds. Battery and chat mix are read from the headset; sidetone, equalizer, lights and the power-off timer are what was last set here.", [["headset", "Arctis 7", ""]]),
      X("webcam", "Webcams", "One page per camera. The live preview, framing buttons, saved positions and the mic's level go in the pane; every control the camera reports is a row on the left, with OBSBOT's own wake and sleep.", [["webcam", "OBSBOT Tiny 3 Lite", "", true]]),
      X("corsair", "Corsair", "The Galleon 100 SD gets its lighting, Corsair Web Hub for key remaps and firmware, and a link to its built-in Stream Deck. Every other Corsair device OpenRGB sees gets a lighting page.", [["corsair-kb", "Galleon 100 SD", ""], ["corsair-ram", "Vengeance RGB memory", ""]]),
      X("streamdeck", "Stream Deck", "The Galleon's built-in deck (run by galleon-deck) and Elgato decks (run by nyx-deck). The keys are drawn as the deck: click one and edit its label and action under it.", [["deck-galleon", "Galleon's Stream Deck", "Screen, 12 keys and two dials", true], ["deck-elgato", "Stream Deck MK.2", ""]]),
      X("rgb", "RGB lighting", "One page for everything at once (one colour, the theme's colour, OpenRGB profiles), and a page per device with its effect, brightness, speed and zones.", [["rgb-all", "Every device", ""], ["rgb-dev", "A motherboard", ""]]),
      X("monitors", "Monitors", "One page per external monitor that answers DDC/CI: brightness and contrast set on the monitor itself, input, speaker volume and power. A setup page when the I2C buses are closed.", [["monitor", "DELL U2720Q", ""], ["monitor-setup", "Allowing access", ""]]),
      X("laptop", "Laptop", "Laptops that aren't ASUS: battery health and cycles, the charge window drawn as a bar, power profile, keyboard light, and switches that cut the mic and camera.", [["laptop", "Framework Laptop 13", ""]]),
      X("nvidia", "NVIDIA", "One page per GPU, updated every 3 seconds: temperature, use, memory and power as readings, memory split by program, and the power limit.", [["nvidia", "RTX 5080 Laptop GPU", ""]]),
      X("controllers", "Game controllers", "One page per controller: a live tester drawn on the pad, battery, rumble buttons and the lightbar's colour.", [["controller", "DualSense", ""]]),
      X("tablet", "Drawing tablets", "The pen's screen, the area used drawn on the tablet, left-handed and mouse-like use, and OpenTabletDriver for pressure.", [["tablet", "Wacom Intuos S", ""]]),
      X("razer", "Razer", "One page per device through OpenRazer: DPI, polling rate, sleep and lighting. A setup page when its daemon isn't answering.", [["razer", "Basilisk V3", ""], ["razer-setup", "Setting up OpenRazer", ""]]),
      X("agents", "Agents (Nyx Agents)", "Notifications, the default agent and folder, and which quotas the AI Hub checks. The agents found on this computer move to the pane as a grid.", [["agents", "Agents", ""]]),
      X("clipboard", "Clipboard (Nyx Clipboard)", "As in round 1: the pop-up drawn in the pane, with history and private mode as readings.", [["clipboard", "Clipboard", ""]]),
      X("glimpse", "Glimpse (Nyx Glimpse)", "General, shortcuts, sources, local AI and appearance on the left; what Super Space opens drawn on the right, with the index and local AI as readings.", [["glimpse", "Glimpse", ""]]),
      X("passwords", "Passwords (Nyx Passwords)", "Locking, copying and finding logins on the left; the vault's state with Lock and Sync, and where logins show up (Glimpse, browsers, the Assistant, SSH) on the right.", [["passwords", "Passwords", "", true]]),
    ],
    icons: ICONS,
    pages: P,
  });
})();
