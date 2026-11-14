// Extension pages, round 3: the Galleon 100 SD's Stream Deck run by Settings (no galleon-deck),
// and the Logitech ASTRO A50 X. Style A, with the parts from pages/ext-pages.js.
(() => {
  const ID = "ext-devices";
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

  /* ═══ Galleon 100 SD: the Stream Deck run by Settings (nyx-deck), no galleon-deck ═══ */
  const SD = "Stream Deck";
  const SDX = "Stream Deck extension";
  const SDD = "The Galleon 100 SD's 12 screen keys, top screen and dials.";
  const WORK = [["terminal", "Terminal"], ["folder", "Files"], ["globe", "Browser"], ["play", "Play"], ["skip", "Next"], ["camera", "Shot"], ["mic", "Mute"], ["moon", "DND"], ["lock", "Lock"], ["grid", "Apps"], 0, ["chev-r", "Page 2"]];
  const GAME = [["bolt", "Resupply"], ["rotate", "Reinforce"], ["target", "Eagle"], ["spark2", "Orbital"], ["shield", "Shield"], ["fan", "Sentry"], ["mic", "Push to talk"], ["camera", "Clip"], ["volume", "Game vol"], ["moon", "DND"], 0, ["chev-l", "Back"]];
  // The deck as drawn on the right: the top screen, 12 keys 3 across, two dials.
  const gdeck = (keys, o = {}) => `<div class="ep-deck gd ${o.th || "th-synth"} ${o.shape || ""}" style="--cols:3">
    <div class="scr">${o.scr || `<small>Work · Page 1</small><b>14:32</b><span>Fri 13 Nov</span><em>${icon("play")}Midnight City</em>`}</div>
    <div class="keys">${keys.map((k, i) => `<span class="${k ? "on" : ""} ${i === (o.sel ?? -1) ? "sel" : ""} ${(o.lit || []).includes(i) ? "lit" : ""}">${k ? `${icon(k[0])}<small>${k[1]}</small>` : ""}</span>`).join("")}</div>
    <div class="dials"><i></i><i></i></div></div>`;
  const kfield = (t, cls = "") => `<div class="field ${cls}"><span>${t}</span></div>`;
  const colourDots = (cs, on) => `<span class="ep-cds">${cs.map((c) => `<span class="ex-cdot ${c === on ? "on" : ""}" style="--c:${c}"></span>`).join("")}</span>`;
  const sdMain = (o = {}) => `
    ${gcard(SD, [
      orow("Run the Stream Deck", "Off, the keys type numbers like a numpad", sw(true), { ic: "power", sec: H }),
      orow("Brightness", "", sl(70, "70%", 110), { ic: "sun", sec: H }),
    ], { first: true })}
    ${gcard("Profiles", [
      orow("Profile", "The deck switches too", dd(o.profile || "Work"), { ic: "ul", sec: H }),
      orow("Pages", "3 pages · the last is the deck's own settings page", btn("Add page", "sm", "plus"), { ic: "grid", sec: H }),
      nrow("Manage profiles", "Add, rename, reorder, import a galleon-deck add-on", "4 profiles", { ic: "ul", sec: H }),
    ])}
    ${gcard("More", [
      nrow("Switch by app", "Helldivers 2 → Gaming, Blender → Blender", "On", { ic: "window", sec: H }),
      nrow("Top screen and dials", "Clock, what's playing · volume and pages", "", { ic: "clock", sec: H }),
      nrow("Look", "Synthwave, rounded keys, the boot animation", "", { ic: "palette", sec: H }),
    ])}`;
  const keyEditor = (name, ic, rows) => `<div class="card ep-ked">
    <div class="ep-kedh"><span class="ep-kic">${icon(ic)}</span><div class="ep-kedf">${kfield(name)}<span class="ep-kedc">Key ${colourDots(["#1e2130", "#3b1c5a", "#1d2b5c", "#0f3d3a"], "#3b1c5a")}Text ${colourDots(["#ffffff", "#f2c14e", "#7ee0ff"], "#ffffff")}</span></div>${btn("Icon…", "sm ghost", "search")}</div>
    ${rows}</div>`;
  const deckKeys = () => hpage(SD, SDD, SDX, sdMain(), `
    ${pvhead("Keys on “Page 1”", "Work profile · drag a key to move it", seg(["Page 1", "Page 2", "Settings"], "Page 1"))}
    ${gdeck(WORK, { sel: 2 })}
    ${keyEditor("Browser", "globe", `
      ${orow("Does", "", dd("Run a command"), { cls: "ep-kr" })}
      ${orow("Command", "", kfield("firefox", "mono"), { cls: "ep-kr" })}
      ${orow("Show whether it worked", "A ✓ or ✗ on the key when it finishes", sw(false), { cls: "ep-kr" })}`)}
    ${pvfoot("Every change shows on the deck within a second.", "check-c")}`);
  const step = (t, c = "") => `<span class="ep-step ${c}">${t}</span>`;
  const deckSeq = () => hpage(SD, SDD, SDX, sdMain({ profile: "Gaming" }), `
    ${pvhead("Keys on “Stratagems”", "Gaming profile · Helldivers 2 switches to it", seg(["Stratagems", "Comms", "Settings"], "Stratagems"))}
    ${gdeck(GAME, { sel: 0, th: "th-hud", shape: "cut", scr: `<small>Gaming · Stratagems</small><b>HELLDIVERS 2</b><span>Auto-switched</span>` })}
    ${keyEditor("Resupply", "bolt", `
      ${orow("Does", "", dd("A sequence of keys"), { cls: "ep-kr" })}
      ${orow("Hold throughout", "", `<span class="ep-steps">${step("CTRL", "hold")}</span>`, { cls: "ep-kr" })}
      <div class="opt ep-kr ep-seqrow"><span class="ep-cap">Steps</span><span class="ep-steps">${["S", "S", "W", "D"].map((k) => step(k)).join("")}${step("+", "add")}</span><span class="sp"></span>${btn("Record", "sm", "dot")}</div>
      ${orow("Between steps", "", sl(20, "40 ms", 100), { cls: "ep-kr" })}
      ${orow("Repeat until pressed again", "", sw(false), { cls: "ep-kr" })}`)}
    <div class="ep-cap">Steps can be keys, combos (CTRL+V), mouse clicks, moves and scrolls, or a WAIT.</div>`);
  const deckScreen = () => hpage(SD, SDD, SDX, `
    ${gcard("Top screen", [
      orow("Profile and page", "", sw(true), { ic: "ul", sec: H }),
      orow("Clock and date", "", kfield("%H:%M", "mono"), { ic: "clock", sec: H }),
      orow("What's playing", "From any player", sw(true), { ic: "play", sec: H }),
      orow("Volume while it changes", "A bar across the screen", sw(true), { ic: "volume", sec: H }),
    ], { first: true })}
    ${gcard("Left dial", [
      orow("Turn", "", dd("Volume"), { ic: "rotate", sec: H }),
      orow("Press", "", dd("Mute"), { ic: "dot", sec: H }),
      orow("Volume step", "Each click", sl(20, "2%", 100), { ic: "sliders", sec: H }),
    ])}
    ${gcard("Right dial", [
      orow("Turn", "", dd("Pages"), { ic: "rotate", sec: H }),
      orow("Press", "", dd("Start page"), { ic: "dot", sec: H }),
      orow("Hold and turn", "", dd("Profiles"), { ic: "ul", sec: H }),
    ])}`, `
    ${pvhead("Top screen", "As it is now: Work profile, Spotify playing")}
    <div class="card ep-bigscr th-synth"><small>Work · Page 1</small><b>14:32</b><span>Friday 13 November</span><div class="np">${icon("play")}<div><em>Midnight City</em><i>M83</i></div></div><div class="vol"><i style="width:45%"></i></div></div>
    <div class="ep-dialmap">${[["Left dial", "Turn: volume", "Press: mute"], ["Right dial", "Turn: pages", "Press: start page · hold and turn: profiles"]].map(([t, a, b]) => `<div class="card"><i></i><div><b>${t}</b><span>${a}</span><span>${b}</span></div></div>`).join("")}</div>`);
  const THEMES = [["Amber", "th-amber"], ["Cyberpunk", "th-cyber"], ["Synthwave", "th-synth"], ["Matrix", "th-matrix"], ["Arctic", "th-arctic"], ["HUD", "th-hud"], ["Mono", "th-mono"], ["Wallpaper", "th-wall"]];
  const deckLook = () => hpage(SD, SDD, SDX, `
    ${gcard("Theme", [
      orow("Theme", "For the Work profile", dd("Synthwave"), { ic: "palette", sec: H }),
      orow("Make one from the wallpaper", "Follows the wallpaper when the theme changes", btn("Make", "sm"), { ic: "image", sec: H }),
      orow("Key shape", "", seg(["Rounded", "Cut corners"], "Rounded"), { ic: "grid", sec: H }),
      orow("Colours", "Change any of the theme's", `${colourDots(["#3b1c5a", "#ff5fd2", "#7ee0ff"], "")}`, { ic: "pipette", sec: H }),
    ], { first: true })}
    ${gcard("Animations", [
      orow("When you sign in or plug it in", "", dd("CRT power-on"), { ic: "spark2", sec: H }),
      orow("Your own animation", "A GIF instead", btn("Choose…", "sm"), { ic: "image", sec: H, cls: "nest" }),
      orow("Profile switch", "A short glitch, then the new profile's logo", sw(true), { ic: "spark2", sec: H }),
    ])}`, `
    ${pvhead("Themes", "Click one to use it on this profile")}
    <div class="ep-themes">${THEMES.map(([n, c]) => `<div class="card ${n === "Synthwave" ? "on" : ""}"><div class="ep-tk ${c}">${Array.from({ length: 6 }, () => "<i></i>").join("")}</div><span>${n}</span></div>`).join("")}</div>
    ${gdeck(WORK, {})}`);
  const deckAuto = () => hpage(SD, SDD, SDX, `
    ${gcard("Switch by app", [orow("Switch profiles by the focused app", "When none matches, it goes back to the start profile", sw(true), { ic: "window", sec: H })], { first: true })}
    ${gcard("Rules", [
      orow("Helldivers 2", "Window class <tt>helldivers2.exe</tt>", dd("Gaming"), { ic: "target", sec: H }),
      orow("Blender", "Window class <tt>blender</tt>", dd("Blender"), { ic: "window", sec: H }),
      orow("Star Citizen", "From the Star Citizen add-on", dd("Star Citizen"), { ic: "puzzle", sec: H }),
      orow("Add a rule", "Pick the app's window, then the profile", btn("Pick a window", "sm", "plus"), { ic: "plus", sec: H }),
    ], { note: "Checked top to bottom. A profile from an add-on brings its own rule." })}`, `
    ${pvhead("Right now", "Helldivers 2 has the focus, so the deck shows Gaming")}
    ${gdeck(GAME, { th: "th-hud", shape: "cut", scr: `<small>Gaming · Stratagems</small><b>HELLDIVERS 2</b><span>Auto-switched</span>` })}
    <div class="ep-list">${[["target", "Helldivers 2", "Gaming", "on"], ["window", "Firefox", "No rule · Work"], ["window", "Blender", "Blender"]].map(([ic, t, d, c]) => li(ic, H, t, d, c ? ok("Now", "on") : "", "")).join("")}</div>`);
  const deckMove = () => hpage(SD, SDD, SDX, `
    ${ban("<b>galleon-deck is running.</b> Settings runs the deck itself now: bring your profiles over, then turn galleon-deck off.", true)}
    ${gcard("Move from galleon-deck", [
      orow("Import profiles and themes", "4 profiles and 2 themes in <tt>~/.config/galleon-deck</tt>; it's left as it is", btn("Import", "primary sm"), { ic: "download", sec: H }),
      orow("Turn galleon-deck off", "Stops its service so only one program drives the deck", btn("Turn off", "sm"), { ic: "power", sec: H }),
      orow("Remove galleon-deck", "Its program, service and fonts; your files stay", btn("Remove", "sm dtext"), { ic: "trash2", sec: H }),
    ], { first: false })}
    ${gcard("Device access", [orow("Allow the deck and typing", "Installs <tt>/etc/udev/rules.d/71-nyx-galleon.rules</tt> and loads <tt>uinput</tt>. Asks for your password once.", btn("Allowed", "sm ghost", "check"), { ic: "lock", sec: H })])}`, `
    ${pvhead("Nothing else to install", "nyx-deck already runs Elgato Stream Decks; it runs this one too")}
    ${gdeck(WORK, {})}
    <div class="ep-list">${[["check-c", "One program for every deck", "nyx-deck, beside the Elgato decks"], ["check-c", "No separate app", "Everything galleon-deck's app does is on these pages"], ["shield", "Safe if it stops", "The keys go back to typing numbers"]].map(([ic, t, d]) => li(ic, H, t, d)).join("")}</div>`);

  /* ═══ Logitech ASTRO A50 X (Headsets extension, run by Gearbench) ═══ */
  const AX = "A50 X";
  const AXD = "Balance, microphone, both equalizers, the stream mix and the base station, through Gearbench.";
  const AXX = "Headsets extension";
  const a50Art = (inp = 0) => `<div class="ep-a50">${headsetArt("var(--sw-teal)")}<div class="ep-base"><div class="ep-cradle"></div><div class="ep-ins">${["PC", "PS", "XBOX"].map((t, i) => `<span class="${i === inp ? "on" : ""}">${t}</span>`).join("")}</div><div class="ep-hdmi">${["HDMI in", "HDMI in", "HDMI out"].map((t) => `<i title="${t}"></i>`).join("")}</div></div></div>`;
  const mix = (game) => `<span class="ep-mixr"><small>Game</small>${sl(game, "", 110)}<small>Voice</small></span>`;
  const gb = (t = "Run by Gearbench, which drives the headset. Settings shows its controls.") => pvfoot(t, "info", btn("Open Gearbench", "sm ghost", "external"));
  const a50Main = () => hpage(AX, AXD, AXX, `
    ${gcard("Sound", [
      orow("Balance", "", mix(60), { ic: "sliders", sec: H }),
      orow("Headset volume", "", sl(66, "14 of 21", 110), { ic: "volume", sec: H }),
      nrow("Apps on Chat", "Discord, Zoom and Signal", "3 apps", { ic: "mic", sec: H }),
    ], { first: true, note: "The dial on the headset moves the balance too." })}
    ${gcard("Microphone", [
      orow("Boom", "Flip it up to mute", ok("Down · live", "on"), { ic: "mic", sec: H }),
      orow("Sidetone", "Your own voice in the earcups", sl(50, "3 of 6", 110), { ic: "mic", sec: H }),
      orow("Noise gate", "", seg(["Off", "Night", "Home", "Tournament"], "Night"), { ic: "mic", sec: H }),
    ])}
    ${gcard("Equalizers", [
      orow("Headphones", "", seg(["Default", "Gaming", "Media"], "Gaming"), { ic: "sliders", sec: H }),
      orow("Microphone", "", seg(["Default", "Competition", "Broadcast"], "Broadcast"), { ic: "sliders", sec: H }),
      nrow("Change the bands", "10 bands each · presets of your own", "", { ic: "sliders", sec: H }),
    ], { note: "The presets are the headset's own, kept in it." })}
    ${gcard("", [nrow("Stream mix", "What the stream port sends: Game, Voice, Mic, Bluetooth", "", { ic: "volume", sec: H })])}
    ${gcard("Headset and base station", [
      orow("Auto sleep", "When it's idle this long", seg(["Never", "15", "30", "60 min"], "30"), { ic: "power", sec: H }),
      orow("Deep sleep", "The base station sleeps after 15 idle minutes", sw(false), { ic: "moon", sec: H }),
      orow("Base station light", "", sl(60, "60%", 110), { ic: "sun", sec: H }),
      orow("Tones", "Sounds at the ends of the wheel and dial", seg(["None", "Minimal", "All"], "Minimal"), { ic: "bell", sec: H }),
    ])}`, `
    ${pvhead("A50 X", "Through its base station · in the base, charging")}
    ${picCard(a50Art(0))}
    ${stats([["Battery", "82%", "Charging in the base", "var(--success)"], ["Balance", "60 / 40", "More game"], ["Boom", "Down", "Microphone live"]])}
    <div class="ep-cap">On this computer</div>
    <div class="ep-list">${[["volume", "A50 X Game", "Default output · games, music, the browser", ok("Default", "on")], ["mic", "A50 X Chat", "Discord, Zoom, Signal", ok("3 apps")], ["mic", "A50 X Microphone", "Default input · noise suppression on", ok("Default", "on")]].map(([ic, t, d, e]) => li(ic, H, t, d, e)).join("")}</div>
    ${ban("PC, PlayStation and Xbox are switched on the base station itself.")}
    ${gb()}`);
  const APPS = [["Discord", "Chat", "Playing now"], ["Zoom", "Chat", ""], ["Signal", "Chat", ""], ["Steam", "Game", "Playing now"], ["Firefox", "Game", "Playing now"], ["Spotify", "Game", ""]];
  const a50Voice = () => hpage(AX, AXD, AXX, `
    ${gcard("Where each app plays", APPS.map(([n, w, d]) => orow(n, d, seg(["Game", "Chat"], w), { ic: n === "Firefox" ? "globe" : n === "Spotify" ? "play" : n === "Steam" ? "target" : "mic", sec: H })), { first: true, note: "Chat is the side the balance calls Voice." })}
    ${gcard("Everything else", [orow("Apps not listed", "", seg(["Game", "Chat"], "Game"), { ic: "grid", sec: H })])}`, `
    ${pvhead("Balance", "60 / 40: the game a little louder than voices")}
    <div class="card ep-mixer">${[["Game", 100, "Steam · Firefox"], ["Voice", 66, "Discord"]].map(([t, v, a]) => `<div class="ch"><div class="bar"><i style="height:${v}%"></i></div><b>${t}</b><span>${v}%</span><small>${a}</small></div>`).join("")}<div class="knob"><small>Balance</small>${mix(60)}</div></div>
    ${gb("The balance is the headset's own: its dial and this slider move the same thing.")}`);
  // Ten bands from −6 to +6 dB, drawn as bars around the 0 line.
  const BANDS = ["32", "64", "125", "250", "500", "1k", "2k", "4k", "8k", "16k"];
  const eqCard = (title, preset, gains) => `<div class="card ep-eq"><div class="ex-ch"><b>${title}</b><span>${preset}</span></div>
    <div class="bands">${gains.map((g, i) => `<div class="band"><div class="track"><i style="${g >= 0 ? `bottom:50%;height:${(g / 6) * 50}%` : `top:50%;height:${(-g / 6) * 50}%`}"></i><b style="bottom:calc(${50 + (g / 6) * 50}% - 5px)"></b></div><small>${BANDS[i]}</small><span>${g > 0 ? "+" : ""}${g}</span></div>`).join("")}</div></div>`;
  const a50Eq = () => hpage(AX, AXD, AXX, `
    ${gcard("Headphones", [
      orow("Preset", "", dd("Gaming"), { ic: "sliders", sec: H }),
      orow("Save as a new preset", "Your own, kept on this computer", btn("Save…", "sm"), { ic: "download", sec: H }),
    ], { first: true, note: "On the headset: Default, Gaming and Media. Yours: Footsteps, Late night." })}
    ${gcard("Microphone", [
      orow("Preset", "", dd("Broadcast"), { ic: "mic", sec: H }),
      orow("Save as a new preset", "", btn("Save…", "sm"), { ic: "download", sec: H }),
    ], { note: "On the headset: Default, Competition and Broadcast." })}`, `
    ${pvhead("Equalizers", "The headset's own: a band moved here goes straight to it")}
    ${eqCard("Headphones", "Gaming · on the headset", [3, 2, 0, -1, -2, 0, 2, 4, 3, 1])}
    ${eqCard("Microphone", "Broadcast · on the headset", [-6, -3, 1, 2, 1, 0, 2, 3, 1, -2])}
    ${gb()}`);
  const STREAM = [["Game", 75, false], ["Voice", 60, false], ["Mic", 90, false], ["Bluetooth", 0, true]];
  const a50Stream = () => hpage(AX, AXD, AXX, `
    ${gcard("Stream mix", [
      orow("Stream port level", "", sl(80, "80%", 110), { ic: "volume", sec: H }),
      ...STREAM.map(([t, v, m]) => orow(t, m ? "Muted" : "", `<span class="ex-rs">${sl(v, `${v}%`, 110)}${ib(m ? "volume" : "mic", m ? "Unmute" : "Mute")}</span>`, { ic: t === "Mic" ? "mic" : t === "Bluetooth" ? "bt" : "volume", sec: H, cls: m ? "dis" : "" })),
    ], { first: true, note: "What streaming apps record from the Stream Out input." })}`, `
    ${pvhead("Stream mix", "What the base station's stream port sends")}
    <div class="card ep-mixer ep-mix4">${STREAM.map(([t, v, m]) => `<div class="ch ${m ? "off" : ""}"><div class="bar"><i style="height:${v}%"></i></div><b>${t}</b><span>${m ? "Muted" : `${v}%`}</span></div>`).join("")}</div>
    ${li("volume", H, "A50 X Stream Out", "The input OBS and other streaming apps record", ok("In use", "on"))}
    ${gb()}`);
  const a50Setup = () => hpage(AX, AXD, AXX, `
    ${ban("The A50 X plays sound already. Its controls come from <b>Gearbench</b>, an open-source app for Logitech G devices.", false)}
    ${gcard("Set up", [
      orow("Install Gearbench", "Version 1.3.1 from its releases on GitHub. Adds its device rules and the <tt>gearbench</tt> group; asks for your password", btn("Install", "primary sm"), { ic: "download", sec: H }),
    ], { note: "Gearbench drives every Logitech G device it supports, so the Logitech extension leaves those to it." })}`, `
    ${pvhead("A50 X found", "Plugged in by USB · the base station is on PC")}
    ${picCard(a50Art(0))}
    <div class="ep-list">${[["check-c", "Sound works already", "Game, Chat and the microphone"], ["download", "The controls need Gearbench", "Balance, microphone, equalizers, stream mix, battery"], ["shield", "Nothing leaves this computer", "No account; it sends nothing over the network"]].map(([ic, t, d], i) => li(ic, H, t, d, "", i === 1 ? "warn" : "")).join("")}</div>`);

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
    "deck-keys": deckKeys, "deck-sequence": deckSeq, "deck-screen": deckScreen, "deck-look": deckLook, "deck-auto": deckAuto, "deck-move": deckMove,
    a50x: a50Main, "a50x-voice": a50Voice, "a50x-eq": a50Eq, "a50x-stream": a50Stream, "a50x-setup": a50Setup,
  };
  const S = (list) => list.flatMap(([k, label, cap, narrow]) => [[k, label, cap || "", `${ID}/${k}${Q}`]].concat(narrow ? [[`${k}-800`, `${label} at 800 px`, "", `${ID}/${k}${Q}`]] : []));
  const X = (id, name, idea, shots) => ({ id, name, idea, shots: S(shots) });

  REG(ID, {
    name: "Galleon's Stream Deck and the A50 X",
    summary: "Two device pages in style A. The Galleon 100 SD's Stream Deck run by Settings itself, with everything galleon-deck and its app do, so galleon-deck isn't needed. And the Logitech ASTRO A50 X with everything Gearbench can do for it. Sample profiles, keys and values are made up.",
    problems: [
      "<b>Who drives the Galleon's deck:</b> nyx-deck, the small service in the Stream Deck extension that already runs Elgato decks, learns the Galleon's protocol (a keep-alive every 500 ms, JPEG images for the keys and the top screen, key and dial reports, typing through <tt>uinput</tt>), as published in node-elgato-stream-deck 7.5. galleon-deck's config format stays readable, so its profiles, themes and add-ons import as they are.",
      "<b>Everything is on four pages:</b> keys (with sequences, mouse steps and repeat), the top screen and dials, the look and animations, and switching by app. galleon-deck's own app isn't needed.",
      "<b>The A50 X runs through Gearbench</b> (GPL-3.0, version 1.3.1), which drives it through the base station: battery, balance, sidetone, noise gate, boom, both equalizers, the stream mix, sleep, light and tones, each tested on one. The Headsets extension talks to Gearbench's daemon. Gearbench can't switch between PC, PlayStation and Xbox; that stays on the base station.",
      "<b>Two programs on one device:</b> Gearbench warns against it, so the Logitech extension stops driving the Logitech G devices Gearbench has.",
      "<b>Switching the base station to a console</b> takes the headset's sound devices away from this computer until it's back on PC; apps playing to it move to the next output.",
    ],
    todayNote: "Today the Stream Deck page sets up galleon-deck (packages, its installer, device access) and edits its config; the app has no A50 X page.",
    options: [
      X("galleon", "Galleon 100 SD: Stream Deck", "The deck is drawn as it looks, in its theme: click a key to edit it underneath. Profiles and pages on the left, with switching by app, the top screen and dials, and the look one row each.", [
        ["deck-keys", "Keys", "Click a key; edit its icon, label, colours and action under the deck", true],
        ["deck-sequence", "A macro key", "A sequence held on Ctrl, with Record, step timing and repeat"],
        ["deck-screen", "Top screen and dials", ""],
        ["deck-look", "Look", "Themes drawn as keys, key shape, animations"],
        ["deck-auto", "Switch by app", ""],
        ["deck-move", "Moving from galleon-deck", "Import, then turn it off"],
      ]),
      X("a50x", "ASTRO A50 X", "One page in the Headsets extension, run by Gearbench: balance, volume, microphone, both equalizers' presets and the headset's settings on the left; the headset in its base station, its readings and its three sound devices on the right. The equalizers and the stream mix have pages of their own.", [
        ["a50x", "A50 X", "", true],
        ["a50x-eq", "Equalizers", "Both of the headset's ten-band equalizers, drawn"],
        ["a50x-stream", "Stream mix", "What the stream port sends"],
        ["a50x-voice", "Apps on Chat", "Which apps play on Chat, and the balance drawn as two channels"],
        ["a50x-setup", "Installing Gearbench", ""],
      ]),
    ],
    icons: ICONS,
    pages: P,
  });
})();
