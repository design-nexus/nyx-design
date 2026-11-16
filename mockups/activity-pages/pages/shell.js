// The Activity window every tab draws its page in: the header, the sidebar as Activity has it
// after the revamp (Dashboard and Processes, then Performance and System), and the parts the
// pages share: cards, readings, graphs with an axis, rings, stacked bars, lists of apps.
// Loaded by screens.html after ../revamp's kit and common.js; every name here is global.

/* ── Made-up but steady data ── */
// A smooth series, 0–1, from a seed.
const series = (seed, n = 40, base = 0.4, amp = 0.25) => Array.from({ length: n }, (_, i) =>
  Math.max(0.02, Math.min(0.98, base + amp * (Math.sin(i * 0.37 + seed) * 0.6 + Math.sin(i * 0.91 + seed * 2.3) * 0.3 + Math.sin(i * 2.1 + seed * 5) * 0.12))));
// A series with bumps [at 0–1, height, width] and an optional step [at, by].
const shaped = (seed, n, base, amp, bumps = [], stepAt = null) => series(seed, n, base, amp).map((v, i) => {
  const x = i / (n - 1);
  const b = bumps.reduce((a, [p, h, w]) => a + h * Math.exp(-((x - p) ** 2) / (2 * w * w)), 0);
  const s = stepAt ? stepAt[1] / (1 + Math.exp(-(x - stepAt[0]) * 40)) : 0;
  return Math.max(0.02, Math.min(0.98, v + b + s));
});

/* ── Graphs ── */
// A line that stretches to its box.
const gline = (vals, c = "var(--accent)", h = 44) => spark(vals, { w: 300, h, c })
  .replace("<svg ", `<svg preserveAspectRatio="none" style="width:100%;height:${h}px" `)
  .replace('stroke-width="1.6"', 'stroke-width="1.6" vector-effect="non-scaling-stroke"');
// A graph with grid lines, a scale and a time axis; `more` lines are dashed on top.
const graph = (vals, c, h = 120, o = {}) => `<div class="ap-graph" style="--gh:${h}px">
  <div class="ap-gy"><span>${o.top || "100%"}</span><span>${o.mid || ""}</span><span>0</span></div>
  <div class="ap-gp"><div class="ap-gl">${gline(vals, c, h)}</div>${(o.more || []).map(([v, mc]) => `<div class="ap-gl more">${gline(v, mc, h).replace(/<path[^>]*opacity[^>]*\/>/, "")}</div>`).join("")}${o.mark ? `<span class="ap-gm" style="left:${o.mark[0] * 100}%"><em>${o.mark[1]}</em></span>` : ""}</div>
  <div class="ap-gx"><span>${o.from || "60 s ago"}</span><span>${o.to || "Now"}</span></div></div>`;
// A ring gauge with its value in the middle.
const dial = (pct, c = "var(--accent)", size = 92, label = "", sub = "") => {
  const r = 40, L = 2 * Math.PI * r;
  return `<div class="ap-ring" style="width:${size}px;height:${size}px"><svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="${r}" class="bg"/><circle cx="50" cy="50" r="${r}" style="stroke:${c};stroke-dasharray:${(pct / 100) * L} ${L}" transform="rotate(-90 50 50)"/></svg><div class="in"><b>${label || pct + "%"}</b>${sub ? `<span>${sub}</span>` : ""}</div></div>`;
};
// A bar split into parts: [[pct, colour, label, value]].
const stack = (parts, o = {}) => `<div class="ap-stack ${o.cls || ""}">${parts.map(([p, c]) => `<b style="width:${p}%;background:${c}"></b>`).join("")}</div>${o.legend === false ? "" : `<div class="ap-lg">${parts.filter((p) => p[2]).map(([, c, l, v]) => `<span><i style="background:${c}"></i>${l}${v ? ` <b>${v}</b>` : ""}</span>`).join("")}</div>`}`;
// A meter bar: pct 0–100, optional tone (warn, bad).
const meterBar = (pct, tone = "", c = "") => `<span class="ap-mb ${tone}"><b style="width:${Math.max(2, Math.min(100, pct))}%${c ? `;background:${c}` : ""}"></b></span>`;

/* ── Readings and cards ── */
// Big readings in a row: [[label, value, sub, tone]].
const readings = (items, o = {}) => `<div class="ap-reads ${o.cls || ""}" style="--n:${o.cols || items.length}">${items.map(([l, v, s, t]) => `<div class="ap-read"><span class="l">${l}</span><b class="${t || ""}">${v}</b>${s ? `<span class="s">${s}</span>` : ""}</div>`).join("")}</div>`;
// A card with a heading line: title, a note, and something at the end.
const acard = (title, body, o = {}) => `<div class="card ap-card ${o.cls || ""}" ${o.span ? `style="grid-column: span ${o.span}"` : ""}>${title !== "" ? `<div class="ap-ch">${o.ic ? icon(o.ic, "ic") : ""}<b>${title}</b>${o.meta ? `<span class="m">${o.meta}</span>` : ""}<span class="sp"></span>${o.end || ""}</div>` : ""}${body}</div>`;
// Key–value rows in a card.
const kv = (rows) => rows.map(([k, v]) => `<div class="row ap-kv"><span class="k">${k}</span><span class="v">${v}</span></div>`).join("");
// A small heading inside a page.
const sect = (t, end = "") => `<div class="ap-sect"><span>${t}</span><span class="sp"></span>${end}</div>`;
// A page heading: title, a line, and controls at the end.
const phead = (t, line = "", end = "") => `<div class="ap-ph"><div><b>${t}</b>${line ? `<span>${line}</span>` : ""}</div><span class="sp"></span>${end}</div>`;
// A plain-words note: icon, bold part, rest, and an optional button.
const note = (ic, b, rest, tone = "", button = "") => `<div class="ap-note ${tone}">${icon(ic)}<div class="tx"><b>${b}</b>${rest ? `<span>${rest}</span>` : ""}</div>${button}</div>`;

/* ── Apps ── */
// A letter on an Umbra tile in the app's colour (the icon theme's app style).
const uic = (name, c) => `<span class="u-aic" style="--uc: var(--sw-${c})">${name[0].toUpperCase()}</span>`;
// [name, colour, cpu %, memory, disk, gpu %, processes, user]
const APPS_NOW = [
  ["Blender", "amber", 41.2, "3.8 GB", "12 MB/s", 62, 3, "you"],
  ["Firefox", "coral", 8.4, "2.1 GB", "1.2 MB/s", 4, 14, "you"],
  ["ffmpeg", "green", 6.9, "412 MB", "38 MB/s", 18, 1, "you"],
  ["Code - OSS", "blue", 3.1, "1.4 GB", "–", 1, 9, "you"],
  ["Hyprland", "teal", 1.8, "310 MB", "–", 6, 1, "you"],
  ["PipeWire", "violet", 0.9, "48 MB", "–", 0, 3, "you"],
  ["Syncthing", "graphite", 0.6, "96 MB", "420 KB/s", 0, 1, "you"],
  ["kitty", "pink", 0.3, "120 MB", "–", 0, 2, "you"],
];
// One app in a list: its tile, name, a bar and a value.
const appRow = ([n, c], value, pct, o = {}) => `<div class="ap-app ${o.sel ? "sel" : ""}">${uic(n, c)}<span class="n">${n}${o.sub ? `<em>${o.sub}</em>` : ""}</span>${pct !== undefined ? meterBar(pct, "", `var(--sw-${c})`) : ""}<span class="v">${value}</span></div>`;

/* ── The window ── */
const ACT_ICONS = {
  pulse: '<path d="M3 12h4l2.5-6 5 12L17 12h4"/>',
  cpu: '<rect x="6" y="6" width="12" height="12" rx="2"/><rect x="9.5" y="9.5" width="5" height="5" rx="1"/><path d="M9.5 3v3M14.5 3v3M9.5 18v3M14.5 18v3M3 9.5h3M3 14.5h3M18 9.5h3M18 14.5h3"/>',
  memory: '<rect x="3" y="7" width="18" height="10" rx="2"/><path d="M7 10.5v3M10.5 10.5v3M14 10.5v3M17.5 10.5v3M6.5 17v2.5M12 17v2.5M17.5 17v2.5"/>',
  gpu: '<rect x="2.5" y="6" width="19" height="11" rx="2"/><circle cx="9" cy="11.5" r="2.8"/><path d="M15 9.5h3.5M15 13.5h3.5M5 17v2.5"/>',
  thermo: '<path d="M14 14.8V5a2 2 0 0 0-4 0v9.8a4 4 0 1 0 4 0z"/><path d="M12 11v5"/>',
  rocket: '<path d="M12 15.5 8.5 12C10 6.5 14 3.5 20.5 3.5 20.5 10 17.5 14 12 15.5z"/><path d="M8.5 12 5 11.5l2.5-3.5h4M12 15.5l.5 3.5 3.5-2.5v-4M5.5 18.5c.5-2 1.5-2.5 3-2"/>',
  cog: '<circle cx="12" cy="12" r="3"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1"/>',
  grip: '<path d="M9 6h.01M15 6h.01M9 12h.01M15 12h.01M9 18h.01M15 18h.01" stroke-width="2.6"/>',
  stop: '<rect x="6" y="6" width="12" height="12" rx="2"/>',
  upload: '<path d="M12 20.5v-11M7.5 14 12 9.5l4.5 4.5M5 4h14"/>',
  fan: '<circle cx="12" cy="12" r="1.8"/><path d="M12 10.2c-1-3.6.4-6.7 3-6.7 2.4 0 3 3.4-1.2 5.6M13.8 12c3.6-1 6.7.4 6.7 3 0 2.4-3.4 3-5.6-1.2M12 13.8c1 3.6-.4 6.7-3 6.7-2.4 0-3-3.4 1.2-5.6M10.2 12c-3.6 1-6.7-.4-6.7-3 0-2.4 3.4-3 5.6 1.2"/>',
  bolt: '<path d="M13 2.5 5 13.5h6l-1 8 8-11h-6z"/>',
  gauge: '<path d="M4 16a8 8 0 1 1 16 0"/><path d="m12 16 4-5"/>',
  plug: '<path d="M8 3v5M16 3v5M6 8h12v3a6 6 0 0 1-12 0zM12 17v4"/>',
  eth: '<rect x="5" y="4" width="14" height="12" rx="1.5"/><path d="M9 16v4h6v-4M8.5 8v3M11 8v3M13 8v3M15.5 8v3"/>',
  layers: '<path d="m12 3.5 9 4.5-9 4.5L3 8z"/><path d="m3 12 9 4.5 9-4.5M3 16l9 4.5 9-4.5"/>',
  timer: '<circle cx="12" cy="13" r="7.5"/><path d="M12 9v4l2.5 2M9.5 2.5h5"/>',
  box: '<path d="m12 3 8 4.5v9L12 21l-8-4.5v-9z"/><path d="m4 7.5 8 4.5 8-4.5M12 12v9"/>',
};
const NAV_NOW = { processes: 709, cpu: "36%", memory: "71%", storage: "4%", network: "↓ 2.2 KB/s", gpu: "7%", sensors: "68 °C" };
// The sidebar as Activity has it now (after the revamp).
const aside = (on = "", o = {}) => `
  ${navx("grid", "Dashboard", { active: on === "overview" })}
  ${navx("listic", "Processes", { active: on === "processes", cnt: NAV_NOW.processes })}
  ${grp("Performance", false, "", "accent")}
  ${[["cpu", "cpu", "CPU"], ["memory", "memory", "Memory"], ["storage", "drive", "Storage"], ["network", "wifi", "Network"], ["gpu", "gpu", "GPU"], ["sensors", "thermo", "Sensors"]].map(([id, ic, t]) => navx(ic, t, { active: on === id, sub: o.subs === false ? "" : NAV_NOW[id] })).join("")}
  ${grp("System", false, "", "violet")}
  ${navx("rocket", "Startup", { active: on === "startup" })}${navx("cog", "Services", { active: on === "services", badge: 1 })}`;
const ahdr = (o = {}) => header({
  icon: "pulse", name: "Activity", center: search(o.q || "Find a process or page", "Ctrl K"),
  end: `${o.end || ""}<button class="ac-live ${o.paused ? "paused" : ""}">${o.paused ? icon("play") : `<span class="dot"></span>`}<span>${o.paused ? "Paused" : "Live · 1 s"}</span></button>`,
});
// A page in the window. At 800 px the sidebar is a rail, as Activity does it.
const apage = (on, page, o = {}) => {
  const w = win({ hdr: ahdr(o), side: o.side !== undefined ? o.side : aside(on, o), page, over: o.over || "" });
  return NARROW ? railed(w) : w;
};
