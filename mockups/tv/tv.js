// Nyx TV mockups: every launcher screen in three directions.
// screens.html?direction=a|b|c&screen=<name>&theme=dark|light
const Q = new URLSearchParams(location.search);
const DIR = Q.get("direction") || "a";
const SCREEN = Q.get("screen") || "home";
document.documentElement.dataset.theme = Q.get("theme") || "dark";
document.body.className = `dir-${DIR}`;
const D = window.NYX;

const svg = (p, extra = "") => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${extra}>${p}</svg>`;
const I = {
  logo: svg('<path d="M4 18V6l8 9 8-9v12" />'),
  home: svg('<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/>'),
  film: svg('<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 3v18M17 3v18M3 7.5h4M17 7.5h4M3 12h18M3 16.5h4M17 16.5h4"/>'),
  tv: svg('<rect x="2" y="6" width="20" height="13" rx="2"/><path d="m8 2 4 4 4-4"/>'),
  grid: svg('<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>'),
  search: svg('<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>'),
  gear: svg('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>'),
  play: svg('<path d="M7 4.5v15l12.5-7.5z" fill="currentColor"/>'),
  info: svg('<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 7.5v.5"/>'),
  plus: svg('<path d="M12 5v14M5 12h14"/>'),
  check: svg('<path d="m5 12.5 4.5 4.5L19 7.5"/>'),
  mic: svg('<rect x="9" y="2.5" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3.5"/>'),
  wifi: svg('<path d="M2 8.5a15 15 0 0 1 20 0M5.5 12a10 10 0 0 1 13 0M9 15.5a5 5 0 0 1 6 0"/><circle cx="12" cy="19" r="1" fill="currentColor"/>'),
  bt: svg('<path d="m7 7 10 10-5 4V3l5 4L7 17"/>'),
  input: svg('<rect x="2" y="4" width="20" height="14" rx="2"/><path d="M8 21h8M10 11h7m-3-3 3 3-3 3"/>'),
  picture: svg('<rect x="3" y="4" width="18" height="14" rx="2"/><circle cx="9" cy="9.5" r="1.8"/><path d="m21 15-5-5-8 8"/>'),
  sound: svg('<path d="M11 5 6 9H3v6h3l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/>'),
  speaker: svg('<rect x="5" y="2.5" width="14" height="19" rx="2"/><circle cx="12" cy="14" r="3.5"/><circle cx="12" cy="7" r="1"/>'),
  moon: svg('<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>'),
  clock: svg('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),
  eyeoff: svg('<path d="M3 3l18 18M10.6 5.1A10 10 0 0 1 12 5c6 0 9.5 7 9.5 7a17 17 0 0 1-3 3.8M6.6 6.6C3.9 8.4 2.5 12 2.5 12S6 19 12 19a9.6 9.6 0 0 0 5.4-1.6"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/>'),
  move: svg('<path d="M12 3v18M8 7l4-4 4 4M8 17l4 4 4-4"/>'),
  trash: svg('<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>'),
  folder: svg('<path d="M3 6a2 2 0 0 1 2-2h4l2 2.5h8a2 2 0 0 1 2 2V18a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>'),
  star: svg('<path d="m12 3 2.8 5.8 6.2.9-4.5 4.4 1 6.2L12 17.4l-5.5 2.9 1-6.2L3 9.7l6.2-.9z"/>'),
  starf: svg('<path d="m12 3 2.8 5.8 6.2.9-4.5 4.4 1 6.2L12 17.4l-5.5 2.9 1-6.2L3 9.7l6.2-.9z" fill="currentColor"/>'),
  back: svg('<path d="M15 5 8 12l7 7"/>'),
  chevr: svg('<path d="m9 5 7 7-7 7"/>'),
  chevd: svg('<path d="m5 9 7 7 7-7"/>'),
  server: svg('<rect x="3" y="3.5" width="18" height="7" rx="2"/><rect x="3" y="13.5" width="18" height="7" rx="2"/><path d="M7 7h.01M7 17h.01"/>'),
  globe: svg('<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>'),
  refresh: svg('<path d="M20 11a8 8 0 0 0-14.5-4.5L3 9M4 13a8 8 0 0 0 14.5 4.5L21 15"/><path d="M3 4v5h5M21 20v-5h-5"/>'),
  palette: svg('<path d="M12 3a9 9 0 1 0 0 18c1.1 0 1.6-.8 1.6-1.6 0-.5-.2-.9-.5-1.2-.3-.3-.5-.7-.5-1.2 0-.9.7-1.6 1.6-1.6H16a5 5 0 0 0 5-5c0-4.1-4-7.4-9-7.4z"/><circle cx="7.5" cy="11" r="1"/><circle cx="10" cy="7" r="1"/><circle cx="15" cy="7" r="1"/>'),
  rows: svg('<rect x="3" y="4" width="18" height="5" rx="1.5"/><rect x="3" y="11" width="18" height="5" rx="1.5"/><path d="M3 20h10"/>'),
  user: svg('<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>'),
  image: svg('<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-5-5L5 21"/>'),
  pulse: svg('<path d="M3 12h4l3-8 4 16 3-8h4"/>'),
  about: svg('<rect x="3" y="3" width="18" height="18" rx="4"/><path d="M12 11v5M12 7.5v.5"/>'),
  remote: svg('<rect x="7" y="2" width="10" height="20" rx="5"/><circle cx="12" cy="8" r="2"/><path d="M10 14h.01M14 14h.01M10 17h.01M14 17h.01"/>'),
  link: svg('<path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/>'),
  ext: svg('<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>'),
  bookmark: svg('<path d="M6 3h12v18l-6-4-6 4z"/>'),
  heart: svg('<path d="M12 20s-7.5-4.6-9-9.2C1.8 6.9 5.6 3.5 9 5.2c1.3.7 2.3 1.8 3 2.8.7-1 1.7-2.1 3-2.8 3.4-1.7 7.2 1.7 6 5.6C19.5 15.4 12 20 12 20z"/>'),
  dots: svg('<circle cx="5" cy="12" r="1.6" fill="currentColor"/><circle cx="12" cy="12" r="1.6" fill="currentColor"/><circle cx="19" cy="12" r="1.6" fill="currentColor"/>'),
  sun: svg('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>'),
  ethernet: svg('<rect x="3" y="6" width="18" height="13" rx="2"/><path d="M7 19v-4M10 19v-4M14 19v-4M17 19v-4M9 6V3h6v3"/>'),
  antenna: svg('<path d="M12 12v9M8 21h8M5 3l7 9 7-9"/>'),
  pause: svg('<path d="M7 5h4v14H7zM13 5h4v14h-4z" fill="currentColor" stroke="none"/>'),
  back10: svg('<path d="M3.5 12a8.5 8.5 0 1 0 1.6-5"/><path d="M3 4.5v4.5h4.5"/><text x="8.2" y="15.2" fill="currentColor" stroke="none" font-size="6.5" font-weight="700" font-family="Inter,sans-serif">10</text>'),
  fwd10: svg('<path d="M20.5 12a8.5 8.5 0 1 1-1.6-5"/><path d="M21 4.5v4.5h-4.5"/><text x="8.2" y="15.2" fill="currentColor" stroke="none" font-size="6.5" font-weight="700" font-family="Inter,sans-serif">10</text>'),
  cc: svg('<rect x="2" y="5" width="20" height="14" rx="3"/><path d="M7 12h3M14 12h3M7 15h5"/>'),
  chapters: svg('<path d="M4 6h16M4 12h16M4 18h10"/>'),
};

const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const bg = (src) => (src ? `background-image:url('${src}')` : "");
const runtime = (m) => (m >= 60 ? `${Math.floor(m / 60)}h ${m % 60}m` : `${m}m`);
const sep = '<i class="sep"></i>';
const metaLine = (c, extra = []) => {
  const parts = [c.year, (c.genres || []).slice(0, 2).join(", "), c.minutes ? runtime(c.minutes) : null, ...extra].filter(Boolean);
  const chips = [c.cert ? `<span class="chip line">${esc(c.cert)}</span>` : "", ...(c.badges || []).map((b) => `<span class="chip">${esc(b)}</span>`)];
  return `<div class="meta">${parts.map(esc).join(sep)}${chips.join("")}</div>`;
};
const ratingChips = (c) => {
  const r = c.ratings || {};
  const out = [];
  if (r.rt_critic) out.push(`<span class="chip rt"><b>●</b> Critics ${Math.round(r.rt_critic)}%</span>`);
  if (r.rt_audience) out.push(`<span class="chip rt">Audience ${Math.round(r.rt_audience)}%</span>`);
  if (r.imdb) out.push(`<span class="chip">IMDb ${r.imdb}</span>`);
  if (r.tmdb) out.push(`<span class="chip">TMDB ${r.tmdb}</span>`);
  return out.join("");
};
const epCode = (c) => (c.season != null ? `S${c.season} · E${c.episode}` : "");
const fmtTime = (minutes) => `${Math.floor(minutes / 60)}:${String(minutes % 60).padStart(2, "0")}`;

const HERO = D.heroes[0];
const CLOCK = "7:42";

// ---------- Cards ----------
function poster(c, o = {}) {
  const w = o.w || 220;
  const badge = c.unwatched ? `<span class="count">${c.unwatched}</span>` : c.watched ? `<span class="seen">${I.check}</span>` : "";
  const bar = c.progress ? `<div class="bar"><i style="width:${c.progress * 100}%"></i></div>` : "";
  const card = `<div class="card poster${o.focus ? " focus" : ""}" style="--w:${w}px"><div class="img" style="${bg(c.poster)}"></div>${o.badges === false ? "" : badge}${bar}</div>`;
  if (!o.cap) return card;
  return `<div class="cardwrap">${card}<div class="cap" style="--w:${w}px"><b>${esc(c.title)}</b><span>${esc(o.sub ?? c.year ?? "")}</span></div></div>`;
}
function land(c, o = {}) {
  const w = o.w || 420;
  const img = o.img || c.thumb || c.backdrop || c.poster;
  const isEp = c.kind === "episode";
  const title = isEp ? c.series : c.title;
  const sub = isEp ? `${epCode(c)} · ${c.title}` : o.sub ?? (c.progress ? `${runtime(Math.round(c.minutes * (1 - c.progress)))} left` : c.year);
  const bar = c.progress ? `<div class="bar"><i style="width:${c.progress * 100}%"></i></div>` : "";
  const inside = o.inside !== false;
  const label = inside ? `<div class="shade"></div><div class="label"><b>${esc(title)}</b><span>${esc(sub)}</span></div>` : "";
  const seen = c.watched && o.seen ? `<span class="seen">${I.check}</span>` : "";
  const card = `<div class="card land${o.focus ? " focus" : ""}" style="--w:${w}px"><div class="img" style="${bg(img)}"></div>${label}${seen}${bar}</div>`;
  if (inside) return card;
  return `<div class="cardwrap">${card}<div class="cap" style="--w:${w}px"><b>${esc(o.capTitle ?? title)}</b><span>${esc(o.capSub ?? sub)}</span></div></div>`;
}

const APPS = [
  { n: "Netflix", bg: "#000", fg: "#e50914", w: "NETFLIX" },
  { n: "YouTube", bg: "#fff", fg: "#ff0000", w: "▶ YouTube", dark: true },
  { n: "Plex", bg: "#1f1f1f", fg: "#e5a00d", w: "plex" },
  { n: "Prime Video", bg: "#0f171e", fg: "#00a8e1", w: "prime video" },
  { n: "Disney+", bg: "linear-gradient(135deg,#0b1c5a,#1a49c9)", fg: "#fff", w: "Disney+" },
  { n: "Hulu", bg: "#0b0c0f", fg: "#1ce783", w: "hulu" },
  { n: "Max", bg: "linear-gradient(135deg,#002be7,#0019a8)", fg: "#fff", w: "max" },
  { n: "Apple TV", bg: "#000", fg: "#fff", w: " tv" },
  { n: "Spotify", bg: "#121212", fg: "#1ed760", w: "Spotify" },
  { n: "Twitch", bg: "#9146ff", fg: "#fff", w: "twitch" },
  { n: "Crunchyroll", bg: "#f47521", fg: "#fff", w: "crunchyroll" },
  { n: "Tubi", bg: "#4b00ff", fg: "#ffff13", w: "tubi" },
  { n: "Pluto TV", bg: "#000", fg: "#fff200", w: "pluto tv" },
  { n: "Peacock", bg: "#000", fg: "#fff", w: "peacock" },
  { n: "Paramount+", bg: "linear-gradient(135deg,#0064ff,#0033a0)", fg: "#fff", w: "Paramount+" },
  { n: "Kodi", bg: "#17b2e7", fg: "#fff", w: "KODI" },
];
const SYS = [
  { n: "Settings", icon: I.gear, sys: true },
  { n: "Play Store", icon: I.play, sys: true },
  { n: "TV inputs", icon: I.input, sys: true },
  { n: "Files", icon: I.folder, sys: true },
];
function app(a, o = {}) {
  const w = o.w || 300;
  if (a.folder) {
    const minis = a.apps.slice(0, 4).map((x) => `<div class="mini" style="background:${x.bg};color:${x.fg}">${esc(x.w.slice(0, 1).trim() || x.n[0])}</div>`).join("");
    const card = `<div class="app folder${o.focus ? " focus" : ""}" style="--w:${w}px">${minis}</div>`;
    return o.cap ? `<div class="cardwrap">${card}<div class="cap" style="--w:${w}px"><b>${esc(a.n)}</b><span>${a.apps.length} apps</span></div></div>` : card;
  }
  const inner = a.sys ? `<div style="display:grid;place-items:center;gap:10px;color:var(--text)"><span class="sys" style="display:block">${a.icon}</span></div>` : `<span class="word" style="color:${a.fg}">${esc(a.w)}</span>`;
  const style = a.sys ? `background:var(--s0);--w:${w}px` : `background:${a.bg};--w:${w}px`;
  const card = `<div class="app${o.focus ? " focus" : ""}" style="${style}">${inner}</div>`;
  return o.cap ? `<div class="cardwrap">${card}<div class="cap" style="--w:${w}px"><b>${esc(a.n)}</b>${o.sub ? `<span>${esc(o.sub)}</span>` : ""}</div></div>` : card;
}
const STREAMING = { folder: true, n: "Streaming", apps: APPS.slice(9, 15) };

// ---------- Chrome ----------
const TABS = [["home", "Home", I.home], ["movies", "Movies", I.film], ["shows", "TV Shows", I.tv], ["apps", "Apps", I.grid]];
function nav(active = "home", o = {}) {
  const tab = ([id, label, icon]) => {
    const cls = `tab${id === active ? " on" : ""}${o.focus === id ? " focus" : ""}`;
    return `<div class="${cls}">${DIR === "b" ? icon : ""}<span>${label}</span></div>`;
  };
  const ib = (id, icon) => `<div class="iconbtn${o.focus === id ? " focus" : ""}">${icon}</div>`;
  const status = o.offline ? `<div class="status-dot"><i></i>Offline</div>` : "";
  const brand = `<div class="brand"><span class="mark">${I.logo}</span>Nyx<small>TV</small></div>`;
  if (DIR === "b") {
    return `<div class="nav">${brand}<div class="tabs">${TABS.map(tab).join("")}<div class="tab${active === "search" ? " on" : ""}${o.focus === "search" ? " focus" : ""}">${I.search}</div><div class="tab${active === "settings" ? " on" : ""}${o.focus === "settings" ? " focus" : ""}">${I.gear}</div></div>
      <div class="end">${status}<span class="clock">${CLOCK}</span><span class="avatar${o.focus === "profile" ? " focus" : ""}">K</span></div></div>`;
  }
  return `<div class="nav">${brand}<div class="tabs">${TABS.map(tab).join("")}</div>
    <div class="end">${status}${ib("search", I.search)}${ib("settings", I.gear)}<span class="avatar${o.focus === "profile" ? " focus" : ""}">K</span><span class="clock">${CLOCK}</span></div></div>`;
}
const hints = (list) => `<div class="hints">${list.map(([k, t]) => `<span><kbd>${k}</kbd>${t}</span>`).join("")}</div>`;
const row = (title, inner, o = {}) => `<div class="row"${o.style ? ` style="${o.style}"` : ""}><div class="row-title">${title}${o.sub ? `<span>${o.sub}</span>` : ""}</div><div class="strip" style="gap:${o.gap || 28}px">${inner}</div></div>`;

// ---------- Home ----------
const heroText = (c, o = {}) => `
  ${o.eyebrow === false ? "" : `<div class="eyebrow">${o.eyebrow || "New in Movies"}</div>`}
  <div class="${o.size || "h-hero"}" style="margin:${o.eyebrow === false ? 0 : o.tight ? 10 : 18}px 0 ${o.tight ? 14 : 22}px;max-width:${o.titleW || 1100}px">${esc(c.title)}</div>
  ${metaLine(c)}
  ${o.tight ? "" : `<div class="btns" style="margin-top:20px;gap:12px">${ratingChips(c)}</div>`}
  <p class="summary" style="margin-top:${o.tight ? 16 : 22}px;max-width:${o.sumW || 880}px;-webkit-line-clamp:${o.lines || 3}">${esc(c.summary)}</p>
  ${o.buttons === false ? "" : `<div class="btns" style="margin-top:${o.tight ? 26 : 34}px">
    <div class="btn primary${o.focus === "play" ? " focus" : ""}">${I.play}${c.progress ? "Resume" : "Play"}</div>
    <div class="btn${o.focus === "info" ? " focus" : ""}">${I.info}More info</div>
    <div class="btn round">${I.plus}</div></div>`}`;

const favApps = (o = {}) => APPS.slice(0, o.n || 7).map((a, i) => app(a, { w: o.w || 300, focus: o.focus === i })).join("");
const contRow = (o = {}) => row("Continue Watching", D.continue.slice(0, o.n || 6).map((c, i) => land(c, { w: o.w || 420, focus: o.focus === i })).join(""), { gap: o.gap });
const postersRow = (title, list, o = {}) => row(title, list.slice(0, o.n || 9).map((c, i) => poster(c, { w: o.w || 220, focus: o.focus === i })).join(""), { sub: o.sub, gap: o.gap });

function homeA(o = {}) {
  if (o.nohero) {
    const f = D.continue[0];
    return `<div class="backdrop" style="${bg(f.backdrop || f.thumb)}"></div>${nav("home", o)}
      <div class="layer" style="left:96px;top:190px;right:auto;width:1100px;bottom:auto">
        <div class="h-1" style="margin-bottom:16px">${esc(f.series || f.title)}</div>
        <div class="meta">${esc(f.kind === "episode" ? `${epCode(f)} · ${f.title}` : f.year)}${sep}${runtime(Math.round(f.minutes * (1 - f.progress)))} left</div>
        <p class="summary" style="margin-top:18px;-webkit-line-clamp:2">${esc(f.summary)}</p></div>
      <div class="rows" style="top:500px">${contRow({ focus: o.cardFocus ?? 0 })}${row("Favorite Apps", favApps())}${postersRow("Recently Added Movies", D.recentMovies)}</div>`;
  }
  return `<div class="backdrop" style="${bg(HERO.backdrop)}"></div>${nav("home", o)}
    <div class="layer" style="left:96px;top:176px;right:auto;bottom:auto;width:1200px">${heroText(HERO, { focus: "play" })}</div>
    <div class="rows" style="top:770px">${contRow({ w: 400 })}${row("Favorite Apps", favApps())}</div>`;
}
function homeB(o = {}) {
  if (o.nohero) {
    return `<div class="backdrop soft" style="${bg(HERO.backdrop)};opacity:.35"></div>${nav("home", o)}
      <div class="rows" style="top:176px">${row("Favorite Apps", favApps({ w: 330, n: 6 }), { gap: 30 })}${contRow({ focus: o.cardFocus ?? 0, w: 440 })}${postersRow("Recently Added Movies", D.recentMovies)}</div>`;
  }
  return `<div class="backdrop" style="${bg(HERO.backdrop)};bottom:300px"></div>
    ${nav("home", o)}
    <div class="layer" style="left:96px;top:215px;right:auto;bottom:auto;width:1100px">${heroText(HERO, { focus: "play", size: "h-1", lines: 2, titleW: 900 })}</div>
    <div class="rows" style="top:690px">${row("", favApps({ w: 318, n: 6 }), { gap: 30, style: "margin-bottom:24px" })}${contRow({ w: 440 })}</div>`;
}
function homeC(o = {}) {
  const hero = o.nohero ? "" : `
    <div class="layer" style="left:96px;right:96px;top:124px;height:460px;border-radius:28px;overflow:hidden;background:var(--mantle)">
      <div style="position:absolute;right:0;top:0;bottom:0;width:1150px;${bg(HERO.backdrop)};background-size:cover;background-position:center"></div>
      <div style="position:absolute;inset:0;background:linear-gradient(90deg,var(--mantle) 38%,color-mix(in srgb,var(--mantle) 70%,transparent) 55%,transparent 80%)"></div>
      <div style="position:absolute;left:64px;top:52px;width:900px">${heroText(HERO, { focus: "play", size: "h-2", lines: 2, sumW: 780, titleW: 800, tight: true })}</div>
    </div>`;
  const top = o.nohero ? 130 : 620;
  return `${nav("home", o)}${hero}
    <div class="rows" style="top:${top}px">${contRow({ w: 360, n: 7, gap: 24, focus: o.nohero ? o.cardFocus ?? 0 : undefined })}${row("Favorite Apps", favApps({ w: 240, n: 9 }), { gap: 24 })}${postersRow("Recently Added Movies", D.recentMovies, { w: 186, n: 11, gap: 24 })}</div>`;
}
const home = (o) => ({ a: homeA, b: homeB, c: homeC })[DIR](o || {});

function offline() {
  const pos = DIR === "b" ? "right:96px;top:150px" : DIR === "c" ? "right:96px;top:130px" : "right:96px;top:150px";
  const b = `<div class="banner" style="${pos}"><i></i><b>Home Server is unreachable.</b> Showing your cached library · retrying in 2 min</div>`;
  return home({ offline: true }) + b;
}

function cardMenu() {
  const f = D.continue[0];
  const pos = DIR === "a" ? "left:560px;top:420px" : DIR === "b" ? "left:680px;top:300px" : "left:500px;top:250px";
  return `${home({ nohero: true, cardFocus: 0 })}<div class="scrim"></div>
    <div class="menu" style="${pos}"><h4>${esc(f.series || f.title)}</h4><p>${esc(f.kind === "episode" ? `${epCode(f)} · ${f.title}` : f.year)}</p>
      <div class="mi focus">${I.play}Resume<span class="r">from ${fmtTime(Math.round(f.minutes * f.progress))}</span></div>
      <div class="mi">${I.refresh}Play from the beginning</div>
      <div class="mi">${I.check}Mark as watched</div>
      <div class="mi">${I.tv}Go to show</div>
      <hr><div class="mi">${I.eyeoff}Remove from Continue Watching</div>
      <div class="mi">${I.rows}Edit this row</div></div>
    ${hints([["OK", "Choose"], ["Back", "Close"]])}`;
}

// ---------- Libraries ----------
function library(kind) {
  const list = kind === "movies" ? D.recentMovies : D.recentShows;
  const title = kind === "movies" ? "Movies" : "TV Shows";
  const count = kind === "movies" ? `${D.counts.movies.toLocaleString()} movies` : `${D.counts.shows.toLocaleString()} shows`;
  const chips = ["All", ...D.genres.slice(0, 8)].map((g, i) => `<span class="chip${i === 0 ? "" : " line"}" style="height:52px;padding:0 22px;font-size:23px;border-radius:26px;${i === 0 ? "background:var(--text);color:var(--base)" : ""}">${esc(g)}</span>`).join("");
  const sort = `<span class="chip line" style="height:52px;padding:0 22px;font-size:23px;border-radius:26px">${I.chevd}Recently added</span>`;
  if (DIR === "c") {
    const side = [["Recently added", true], ["Title"], ["Release date"], ["Rating"], ["Unwatched first"]].map(([t, on]) => `<div class="li${on ? " on" : ""}" style="height:68px;font-size:24px">${t}${on ? `<span class="r">${I.check}</span>` : ""}</div>`).join("");
    const gen = D.genres.slice(0, 7).map((g) => `<div class="li" style="height:62px;font-size:23px;color:var(--sub1)">${esc(g)}</div>`).join("");
    const grid = list.slice(0, 21).map((c, i) => poster(c, { w: 186, focus: i === 1, cap: true })).join("");
    return `${nav(kind)}<div class="layer" style="left:96px;top:130px;width:330px;bottom:0">
        <div class="h-2">${title}</div><div class="dim" style="font-size:23px;margin:6px 0 26px">${count}</div>
        <div class="eyebrow" style="margin:0 0 8px 28px;color:var(--sub0)">Sort</div>${side}
        <div class="eyebrow" style="margin:24px 0 8px 28px;color:var(--sub0)">Genre</div>${gen}</div>
      <div class="layer" style="left:480px;top:150px;right:60px;display:flex;flex-wrap:wrap;gap:34px 26px;align-content:flex-start">${grid}</div>`;
  }
  const w = DIR === "a" ? 222 : 196;
  const n = DIR === "a" ? 7 : 8;
  const grid = list.slice(0, n * 3).map((c, i) => poster(c, { w, focus: i === 2, cap: true })).join("");
  const head = DIR === "a"
    ? `<div class="layer" style="left:96px;top:150px;bottom:auto;right:96px"><div style="display:flex;align-items:baseline;gap:22px"><div class="h-1">${title}</div><div class="dim" style="font-size:26px">${count}</div></div>
        <div style="display:flex;gap:12px;margin-top:28px">${chips}<span style="margin-left:auto">${sort}</span></div></div>`
    : `<div class="layer" style="top:160px;bottom:auto;display:flex;justify-content:center;gap:12px">${chips}${sort}</div>`;
  const top = DIR === "a" ? 340 : 270;
  const backdrop = DIR === "a" ? `<div class="backdrop soft" style="${bg(list[2].backdrop || HERO.backdrop)};opacity:.5"></div>` : "";
  return `${backdrop}${nav(kind)}${head}<div class="layer" style="left:96px;right:60px;top:${top}px;display:flex;flex-wrap:wrap;gap:40px ${DIR === "a" ? 34 : 30}px;align-content:flex-start">${grid}</div>`;
}

function collections() {
  const cs = D.collections;
  if (DIR === "a") {
    const card = (c, i) => {
      const ps = c.posters.slice(0, 3);
      const stack = ps.map((p, j) => `<div class="card poster" style="--w:170px;position:absolute;left:${j * 92}px;top:${[16, 0, 16][j]}px;transform:rotate(${[-5, 0, 5][j]}deg);z-index:${[1, 3, 2][j]}"><div class="img" style="${bg(p)}"></div></div>`).join("");
      return `<div style="width:380px;flex:none"><div class="${i === 1 ? "card focus" : ""}" style="position:relative;height:300px;width:380px;border-radius:24px;${i === 1 ? "background:rgba(127,132,156,.16);" : ""}padding:20px 0 0 18px"><div style="position:relative">${stack}</div></div>
        <div class="cap" style="--w:380px"><b>${esc(c.title)}</b><span>${c.count} movies</span></div></div>`;
    };
    return `<div class="backdrop soft" style="${bg(HERO.backdrop)};opacity:.4"></div>${nav("movies")}
      <div class="layer" style="left:96px;top:150px;bottom:auto"><div class="h-1">Collections</div><div class="dim" style="margin-top:8px">${cs.length} collections in Movies</div></div>
      <div class="layer" style="left:96px;right:60px;top:330px;display:flex;flex-wrap:wrap;gap:48px 44px">${cs.slice(0, 8).map(card).join("")}</div>`;
  }
  if (DIR === "b") {
    const card = (c, i) => `<div class="cardwrap"><div class="card square${i === 1 ? " focus" : ""}" style="--w:380px;display:grid;grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr;gap:4px;overflow:hidden;background:var(--s0)">
        ${c.posters.slice(0, 4).map((p) => `<div style="${bg(p)};background-size:cover;background-position:center"></div>`).join("")}</div>
        <div class="cap" style="--w:380px"><b>${esc(c.title)}</b><span>${c.count} movies</span></div></div>`;
    return `${nav("movies")}<div class="layer" style="top:160px;bottom:auto;text-align:center"><div class="h-2">Collections</div></div>
      <div class="layer" style="left:96px;right:60px;top:270px;display:flex;flex-wrap:wrap;gap:44px 36px">${cs.slice(0, 8).map(card).join("")}</div>`;
  }
  const card = (c, i) => poster({ poster: c.poster, title: c.title, unwatched: c.count }, { w: 186, focus: i === 1, cap: true, sub: `${c.count} movies` });
  return `${nav("movies")}<div class="layer" style="left:96px;top:140px;bottom:auto"><div class="h-2">Collections</div><div class="dim" style="font-size:23px;margin-top:6px">From Movies · grouped by Plex collection</div></div>
    <div class="layer" style="left:96px;right:60px;top:290px;display:flex;flex-wrap:wrap;gap:40px 26px">${cs.slice(0, 16).map(card).join("")}</div>`;
}

// ---------- Details ----------
const castRow = (c, n = 7) => c.cast.slice(0, n).map((name, i) => `<div style="width:150px;flex:none;text-align:center;white-space:normal">
  <div style="width:120px;height:120px;margin:0 auto 14px;border-radius:60px;display:grid;place-items:center;font-size:36px;font-weight:650;background:var(--s0);color:var(--sub1)">${esc(name.split(" ").map((p) => p[0]).slice(0, 2).join(""))}</div>
  <div style="font-size:22px;font-weight:600;line-height:1.2">${esc(name)}</div></div>`).join("");

function movieDetail() {
  const m = D.movieDetail;
  const btns = `<div class="btns" style="margin-top:34px"><div class="btn primary focus">${I.play}Play</div><div class="btn">${I.check}Mark watched</div><div class="btn round">${I.bookmark}</div><div class="btn round">${I.dots}</div></div>`;
  const facts = `<div style="display:grid;grid-template-columns:200px 1fr;gap:12px 24px;font-size:24px;margin-top:30px">
    <span class="dim">Director</span><span>${esc(m.director || "—")}</span><span class="dim">Starring</span><span>${esc(m.cast.slice(0, 3).join(", "))}</span><span class="dim">Studio</span><span>${esc(m.studio || "—")}</span></div>`;
  if (DIR === "a") {
    return `<div class="backdrop" style="${bg(m.backdrop)}"></div>${nav("movies")}
      <div class="layer" style="left:96px;top:166px;right:auto;bottom:auto;width:1100px">${heroText(m, { eyebrow: m.tagline || "Movie", buttons: false, lines: 3 })}${btns}</div>
      <div class="rows" style="top:790px"><div class="row"><div class="row-title">Cast</div><div class="strip" style="gap:24px">${castRow(m, 9)}</div></div></div>`;
  }
  if (DIR === "b") {
    const tabs = ["Overview", "Cast & Crew", "More Like This", "Details"].map((t, i) => `<div class="tab${i === 0 ? " on" : ""}" style="${i === 0 ? "background:var(--s0);color:var(--text)" : ""}">${t}</div>`).join("");
    return `<div class="backdrop full" style="${bg(m.backdrop)};bottom:440px"></div><div class="layer" style="top:640px;background:var(--base)"></div>${nav("movies")}
      <div class="card poster" style="--w:330px;position:absolute;left:96px;top:330px;box-shadow:var(--card-shadow)"><div class="img" style="${bg(m.poster)}"></div></div>
      <div class="layer" style="left:480px;top:420px;right:96px;bottom:auto">
        <div class="h-1" style="color:#fff;text-shadow:0 4px 30px rgba(0,0,0,.6)">${esc(m.title)}</div></div>
      <div class="layer" style="left:480px;top:660px;right:96px;bottom:auto">${metaLine(m)}<div class="btns" style="margin-top:16px;gap:12px">${ratingChips(m)}</div>
        <div class="btns" style="margin-top:28px"><div class="btn primary focus">${I.play}Play</div><div class="btn">${I.check}Mark watched</div><div class="btn round">${I.bookmark}</div></div></div>
      <div class="layer" style="left:96px;top:910px;bottom:auto;display:flex;gap:6px">${tabs}</div>
      <p class="summary" style="position:absolute;left:96px;top:1000px;max-width:1500px;-webkit-line-clamp:1">${esc(m.summary)}</p>`;
  }
  const related = m.related.slice(0, 8).map((c) => poster(c, { w: 160 })).join("");
  return `<div class="layer" style="height:520px;${bg(m.backdrop)};background-size:cover;background-position:center 20%;opacity:.28"></div>
    <div class="layer" style="height:520px;background:linear-gradient(0deg,var(--base),transparent)"></div>${nav("movies")}
    <div class="card poster" style="--w:400px;position:absolute;left:96px;top:150px;box-shadow:var(--card-shadow)"><div class="img" style="${bg(m.poster)}"></div></div>
    <div class="layer" style="left:560px;top:150px;right:96px;bottom:auto">${heroText(m, { eyebrow: "Movie", size: "h-1", buttons: false, lines: 3, sumW: 1100 })}${btns}${facts}</div>
    <div class="layer" style="left:96px;top:800px;bottom:auto;right:0"><div class="h-3" style="margin-bottom:18px">More like this</div><div style="display:flex;gap:24px">${related}</div></div>`;
}

function showDetail() {
  const s = D.showDetail;
  let fi = s.episodes.findIndex((e) => D.continue.some((c) => c.id === e.id));
  if (fi < 0) fi = 4;
  const eps = s.episodes.map((e, i) => (i < fi ? { ...e, progress: 0 } : e));
  const next = eps[fi];
  const seasons = s.seasons.map((x, i) => `<div class="tab${i === 0 ? " on" : ""}" style="${i === 0 ? (DIR === "a" ? "" : "background:var(--s0);color:var(--text)") : ""}">${x.title}<span class="dim" style="font-size:21px">${x.unwatched ? `${x.unwatched} new` : `${x.count}`}</span></div>`).join("");
  const resume = `<div class="btn primary">${I.play}Resume ${epCode(next)}</div>`;
  if (DIR === "a") {
    const from = Math.max(0, fi - 2);
    const row2 = eps.slice(from, from + 7).map((e, j, _, i = j + from) => land({ ...e, watched: i < fi }, { w: 400, focus: i === fi, inside: false, seen: true, img: e.thumb || s.backdrop, capTitle: `${e.episode}. ${e.title}`, capSub: `${runtime(e.minutes)}${i === fi ? ` · ${runtime(Math.round(e.minutes * (1 - e.progress)))} left` : ""}` })).join("");
    return `<div class="backdrop" style="${bg(s.backdrop)}"></div>${nav("shows")}
      <div class="layer" style="left:96px;top:180px;right:auto;bottom:auto;width:1100px">${heroText(s, { eyebrow: `${s.seasons.length} seasons`, buttons: false, lines: 2, size: "h-1" })}
        <div class="btns" style="margin-top:30px">${resume}<div class="btn">${I.refresh}Shuffle</div><div class="btn round">${I.check}</div></div></div>
      <div class="layer" style="left:74px;top:640px;bottom:auto;display:flex;gap:6px">${seasons}</div>
      <div class="rows" style="top:720px"><div class="strip">${row2}</div></div>`;
  }
  if (DIR === "b") {
    const from = Math.max(0, fi - 2);
    const list = eps.slice(from, from + 6).map((e, j, _, i = j + from) => `<div class="li${i === fi ? " focus" : ""}" style="height:150px;gap:30px;padding:0 24px">
        <div class="card land" style="--w:212px;flex:none"><div class="img" style="${bg(e.thumb || s.backdrop)}"></div>${i < fi ? `<span class="seen" style="top:8px;right:8px;width:34px;height:34px">${I.check}</span>` : ""}${e.progress ? `<div class="bar" style="left:10px;right:10px;bottom:10px"><i style="width:${e.progress * 100}%"></i></div>` : ""}</div>
        <div class="t" style="gap:6px"><span style="font-size:27px;font-weight:620">${e.episode}. ${esc(e.title)}</span><small style="white-space:normal;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;max-width:900px">${esc(e.summary)}</small></div>
        <span class="r">${runtime(e.minutes)}</span></div>`).join("");
    return `<div class="backdrop full" style="${bg(s.backdrop)};bottom:600px"></div><div class="layer" style="top:480px;background:var(--base)"></div>${nav("shows")}
      <div class="layer" style="left:96px;top:250px;right:96px;bottom:auto"><div class="h-1" style="color:#fff;text-shadow:0 4px 30px rgba(0,0,0,.6)">${esc(s.title)}</div></div>
      <div class="layer" style="left:96px;top:370px;bottom:auto;display:flex;align-items:center;gap:40px">${metaLine(s, [`${s.seasons.length} seasons`])}<div class="btns">${resume}</div></div>
      <div class="layer" style="left:96px;top:520px;width:300px;bottom:auto;display:flex;flex-direction:column;gap:8px">${seasons}</div>
      <div class="layer" style="left:440px;top:500px;right:96px;bottom:auto;display:flex;flex-direction:column;gap:6px">${list}</div>`;
  }
  const side = s.seasons.map((x, i) => `<div class="li${i === 0 ? " on" : ""}" style="height:120px;gap:20px;padding:0 16px">
      <div class="card poster" style="--w:64px;flex:none;border-radius:8px"><div class="img" style="${bg(x.poster || s.poster)}"></div></div>
      <div class="t"><span>${x.title}</span><small>${x.count} episodes${x.unwatched ? ` · ${x.unwatched} unwatched` : ""}</small></div></div>`).join("");
  const grid = eps.slice(0, 9).map((e, i) => land({ ...e, watched: i < fi }, { w: 400, focus: i === fi, inside: false, seen: true, img: e.thumb || s.backdrop, capTitle: `${e.episode}. ${e.title}`, capSub: runtime(e.minutes) })).join("");
  return `${nav("shows")}
    <div class="layer" style="left:96px;top:140px;right:96px;bottom:auto;display:flex;gap:40px;align-items:flex-start">
      <div class="card poster" style="--w:170px;flex:none"><div class="img" style="${bg(s.poster)}"></div></div>
      <div style="flex:1"><div class="h-2">${esc(s.title)}</div><div style="margin-top:10px">${metaLine(s, [`${s.seasons.length} seasons`])}</div>
        <p class="summary" style="margin-top:12px;-webkit-line-clamp:2;max-width:1200px;font-size:24px">${esc(s.summary)}</p></div>
      <div class="btns">${resume}</div></div>
    <div class="layer" style="left:96px;top:430px;width:400px;bottom:auto;display:flex;flex-direction:column;gap:8px">${side}</div>
    <div class="layer" style="left:560px;top:430px;right:40px;display:flex;flex-wrap:wrap;gap:30px 28px;align-content:flex-start">${grid}</div>`;
}

// ---------- Apps ----------
function apps() {
  const menu = (pos) => `<div class="scrim" style="background:rgba(var(--scrim),.5)"></div><div class="menu" style="${pos};width:520px"><h4>Netflix</h4><p>Version 8.120 · from Play Store</p>
    <div class="mi focus">${I.move}Move<span class="r">◀ ▶</span></div><div class="mi">${I.starf}Remove from favorites</div><div class="mi">${I.folder}Add to folder</div>
    <div class="mi">${I.eyeoff}Hide</div><hr><div class="mi">${I.info}App info</div><div class="mi danger">${I.trash}Uninstall</div></div>`;
  const all = [...APPS, ...SYS];
  if (DIR === "a") {
    const favs = APPS.slice(0, 5).map((a, i) => app(a, { w: 330, focus: i === 0 })).join("");
    const grid = [STREAMING, ...APPS.slice(5, 9), ...SYS, ...APPS.slice(15)].map((a) => app(a, { w: 260, cap: true, sub: a.sys ? "System" : "" })).join("");
    return `<div class="backdrop soft" style="${bg(HERO.backdrop)};opacity:.3"></div>${nav("apps")}
      <div class="rows" style="top:170px">${row("Favorites", favs, { sub: "Shown on Home" })}
      <div class="row"><div class="row-title">All Apps<span>${all.length} installed</span></div><div style="display:flex;flex-wrap:wrap;gap:30px 30px;padding:0 96px">${grid}</div></div></div>
      ${menu("left:470px;top:170px")}`;
  }
  if (DIR === "b") {
    return `${nav("apps")}<div class="rows" style="top:170px">
      ${row("Favorites", APPS.slice(0, 6).map((a, i) => app(a, { w: 300, focus: i === 0 })).join(""), { sub: "Shown on Home" })}
      ${row("Streaming", STREAMING.apps.map((a) => app(a, { w: 300 })).join(""), { sub: "Folder" })}
      ${row("More Apps", [...APPS.slice(6, 9), ...SYS].map((a) => app(a, { w: 300 })).join(""))}</div>
      ${menu("left:430px;top:200px")}`;
  }
  const sec = (title, list, focus) => `<div class="eyebrow" style="color:var(--sub0);margin:26px 0 16px">${title}</div><div style="display:flex;flex-wrap:wrap;gap:24px 24px">${list.map((a, i) => app(a, { w: 200, focus: i === focus, cap: true })).join("")}</div>`;
  return `${nav("apps")}<div class="layer" style="left:96px;right:96px;top:120px">
      <div style="display:flex;align-items:center;gap:20px"><div class="h-2">Apps</div><span class="dim" style="font-size:23px">${all.length} installed · ${3} hidden</span>
        <div class="field" style="margin-left:auto;width:520px;height:68px;font-size:24px">${I.search}<span class="dim">Search apps</span></div></div>
      ${sec("Favorites", APPS.slice(0, 7), 0)}${sec("All apps", [STREAMING, ...APPS.slice(7, 9), ...APPS.slice(15), ...SYS])}</div>
    ${menu("left:320px;top:220px")}`;
}

// ---------- Search ----------
function search() {
  const S = D.search;
  const keys = "abcdefghijklmnopqrstuvwxyz1234567890".split("");
  const kbd = (focus) => `<div class="kbd">${keys.map((k) => `<div class="key${k === focus ? " focus" : ""}">${k}</div>`).join("")}<div class="key wide">${I.back}</div><div class="key wide">space</div><div class="key">${I.mic}</div></div>`;
  const field = (w) => `<div class="field" style="width:${w}px">${I.search}<span>${S.q}</span><i class="caret"></i><span style="margin-left:auto" class="iconbtn">${I.mic}</span></div>`;
  const appsHit = APPS.filter((a) => /st|ar/i.test(a.n)).slice(0, 1);
  const top = S.movies[0];
  if (DIR === "b") {
    const strip = keys.slice(0, 26).map((k, i) => `<span style="width:52px;text-align:center;font-size:30px;font-weight:560;${k === "r" ? "color:var(--base);background:var(--text);border-radius:12px;padding:6px 0" : "color:var(--sub0)"}">${k}</span>`).join("");
    return `${nav("search", {})}
      <div class="layer" style="top:160px;bottom:auto;display:flex;justify-content:center">${field(900)}</div>
      <div class="layer" style="top:290px;bottom:auto;display:flex;justify-content:center;gap:6px;align-items:center">${strip}<span class="iconbtn" style="margin-left:20px">${I.back}</span></div>
      <div class="rows" style="top:400px">${row("Movies", S.movies.slice(0, 9).map((c, i) => poster(c, { w: 200, focus: i === 0 })).join(""), { sub: `${S.movies.length} results` })}
        ${row("TV Shows", S.shows.slice(0, 9).map((c) => poster(c, { w: 200 })).join(""))}</div>`;
  }
  if (DIR === "a") {
    return `<div class="backdrop soft" style="${bg(top.backdrop || HERO.backdrop)};opacity:.35"></div>${nav("search", { focus: "search" })}
      <div class="layer" style="left:96px;top:170px;width:600px;bottom:auto">${field(588)}<div style="margin-top:26px">${kbd("r")}</div>
        <div class="dim" style="font-size:22px;margin-top:22px;display:flex;gap:12px;align-items:center">${I.mic.replace("<svg", '<svg width="26" height="26"')}Hold the mic button on the remote to speak</div></div>
      <div class="layer" style="left:760px;top:150px;right:0">
        ${row("Movies", S.movies.slice(0, 7).map((c) => poster(c, { w: 190 })).join(""), { sub: `${S.movies.length} results`, gap: 22 }).replaceAll("padding-left:96px", "padding-left:0").replaceAll("96px 22px", "0 22px")}
        ${row("TV Shows", S.shows.slice(0, 7).map((c) => poster(c, { w: 190 })).join(""), { gap: 22 })}
        ${row("Episodes · Collections · Apps", [...S.episodes.slice(0, 2).map((c) => land(c, { w: 340 })), ...S.collections.slice(0, 1).map((c) => land({ title: c.title, kind: "collection", year: `${c.count} movies`, backdrop: c.posters[0] }, { w: 340 })), ...appsHit.map((a) => app(a, { w: 340 }))].join(""), { gap: 22 })}</div>`;
  }
  const group = (title, inner) => `<div style="margin-bottom:30px"><div class="eyebrow" style="color:var(--sub0);margin-bottom:14px">${title}</div><div style="display:flex;gap:20px">${inner}</div></div>`;
  return `${nav("search", { focus: "search" })}
    <div class="layer panel" style="left:96px;top:140px;width:640px;bottom:60px;padding:28px">${field(584)}<div style="margin-top:26px">${kbd()}</div>
      <div class="eyebrow" style="color:var(--sub0);margin:30px 0 10px">Recent</div>
      ${["altered carbon", "dune", "star trek"].map((t) => `<div class="li" style="height:64px;font-size:24px">${I.clock.replace("<svg", '<svg class="lead"')}${t}</div>`).join("")}</div>
    <div class="layer" style="left:790px;top:140px;right:40px">
      ${group(`Movies · ${S.movies.length}`, S.movies.slice(0, 6).map((c, i) => poster(c, { w: 164, focus: i === 0, cap: true })).join(""))}
      ${group(`TV Shows · ${S.shows.length}`, S.shows.slice(0, 6).map((c) => poster(c, { w: 164, cap: true })).join(""))}
      ${group("Episodes", S.episodes.slice(0, 3).map((c) => land(c, { w: 340 })).join(""))}</div>`;
}

// ---------- Plex sign-in, servers, profiles ----------
function qr(seed = 7) {
  return `<div class="qr"><canvas data-qr="${seed}" width="29" height="29"></canvas></div>`;
}
function drawQR() {
  document.querySelectorAll("canvas[data-qr]").forEach((cv) => {
    const g = cv.getContext("2d");
    let s = +cv.dataset.qr;
    const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
    g.fillStyle = "#11111b";
    for (let y = 0; y < 29; y++) for (let x = 0; x < 29; x++) if (rnd() > 0.52) g.fillRect(x, y, 1, 1);
    for (const [x, y] of [[0, 0], [22, 0], [0, 22]]) {
      g.fillStyle = "#fff"; g.fillRect(x, y, 7, 7);
      g.fillStyle = "#11111b"; g.fillRect(x, y, 7, 7);
      g.fillStyle = "#fff"; g.fillRect(x + 1, y + 1, 5, 5);
      g.fillStyle = "#11111b"; g.fillRect(x + 2, y + 2, 3, 3);
    }
  });
}
function signin() {
  const code = "N7XQ".split("").map((ch) => `<span style="width:120px;height:150px;border-radius:24px;display:grid;place-items:center;font-size:92px;font-weight:720;background:rgba(127,132,156,.16)">${ch}</span>`).join("");
  const steps = `<div style="font-size:30px;color:var(--sub1);line-height:1.6">On your phone or computer, go to<br><b style="color:var(--text);font-size:40px">plex.tv/link</b><br>and enter this code:</div>`;
  const wait = `<div class="dim" style="display:flex;align-items:center;gap:14px;font-size:24px"><span style="width:22px;height:22px;border-radius:11px;border:3px solid var(--accent);border-right-color:transparent"></span>Waiting for you to sign in · the code changes in 14 min</div>`;
  const btns = `<div class="btns"><div class="btn focus">${I.link}Enter a server address instead</div><div class="btn">Skip for now</div></div>`;
  const back = DIR === "c" ? "" : `<div class="backdrop soft" style="${bg(HERO.backdrop)};opacity:.45"></div>`;
  if (DIR === "c") {
    return `${nav("settings", { focus: null })}<div class="layer" style="left:96px;top:170px;width:960px;bottom:auto">
        <div class="eyebrow">Plex</div><div class="h-1" style="margin:14px 0 30px">Sign in to your Plex account</div>${steps}
        <div style="display:flex;gap:18px;margin:34px 0">${code}</div>${wait}<div style="margin-top:44px">${btns}</div></div>
      <div class="layer panel" style="left:1200px;top:200px;width:620px;height:640px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:30px">${qr()}<div class="dim" style="font-size:24px;text-align:center">Or scan with your phone<br>to sign in with the Plex app</div></div>`;
  }
  const box = DIR === "b" ? "panel" : "";
  return `${back}<div class="nav"><div class="brand"><span class="mark">${I.logo}</span>Nyx<small>TV</small></div></div>
    <div class="layer ${box}" style="left:${DIR === "b" ? 360 : 96}px;right:${DIR === "b" ? 360 : 96}px;top:${DIR === "b" ? 170 : 180}px;bottom:${DIR === "b" ? 110 : 120}px;display:flex;align-items:center;gap:90px;padding:0 ${DIR === "b" ? 90 : 0}px;${DIR === "b" ? "background:color-mix(in srgb,var(--mantle) 88%,transparent);backdrop-filter:blur(30px)" : ""}">
      <div style="flex:1"><div class="eyebrow">Connect Plex</div><div class="h-1" style="margin:14px 0 30px;font-size:${DIR === "b" ? 54 : 64}px">Sign in to Plex</div>${steps}
        <div style="display:flex;gap:18px;margin:30px 0">${code}</div>${wait}<div style="margin-top:40px">${btns}</div></div>
      <div style="display:flex;flex-direction:column;align-items:center;gap:22px">${qr()}<div class="dim" style="font-size:22px">Or scan to sign in</div></div></div>`;
}

const SERVERS = [
  { n: "Home Server", s: "Owned · Local · 192.168.1.20 · 3 ms", libs: "Movies, TV Shows", on: true, icon: I.server },
  { n: "Home Server", s: "Owned · Remote · plex.direct · 48 ms", libs: "Used when away from home", icon: I.globe },
  { n: "Cabin NAS", s: "Owned · Offline since Tuesday", libs: "Movies", off: true, icon: I.server },
  { n: "Shared from Alex", s: "Shared · Remote · 72 ms", libs: "Movies, Anime", icon: I.globe },
];
function servers() {
  const list = SERVERS.map((s, i) => `<div class="li${i === 0 ? " focus" : ""}" style="height:116px">${s.icon.replace("<svg", '<svg class="lead"')}
      <div class="t"><span>${s.n}${s.on ? ' <span class="chip" style="height:32px;font-size:18px;margin-left:10px;background:var(--green);color:#1e1e2e">IN USE</span>' : ""}</span><small>${s.s} · ${s.libs}</small></div>
      <span class="r">${s.off ? `<span style="color:var(--yellow)">Unavailable</span>` : I.chevr}</span></div>`).join("");
  const add = `<div class="li">${I.plus.replace("<svg", '<svg class="lead"')}<div class="t"><span>Add a server by address</span><small>For servers Plex can't find on its own</small></div></div>
    <div class="li">${I.refresh.replace("<svg", '<svg class="lead"')}<div class="t"><span>Search the network again</span><small>Last searched 2 min ago · found 1 server</small></div></div>`;
  const head = `<div class="eyebrow">Plex</div><div class="h-1" style="margin:12px 0 12px">Choose a server</div><div class="dim" style="margin-bottom:34px">Signed in as ken · Nyx TV prefers a local connection and falls back to remote.</div>`;
  if (DIR === "c") {
    return `${nav("settings")}<div class="layer" style="left:96px;top:150px;width:1100px">${head}<div class="panel" style="padding:14px">${list}</div><div style="margin-top:20px">${add}</div></div>`;
  }
  return `${DIR === "a" ? `<div class="backdrop soft" style="${bg(HERO.backdrop)};opacity:.35"></div>` : ""}<div class="nav"><div class="brand"><span class="mark">${I.logo}</span>Nyx<small>TV</small></div></div>
    <div class="layer" style="left:${DIR === "b" ? 440 : 96}px;width:1040px;top:170px">${head}${list}<hr style="border:0;height:1.5px;background:rgba(127,132,156,.2);margin:16px 0">${add}</div>`;
}

const PROFILES = [["Ken", "linear-gradient(140deg,#fab387,#f5c2e7)"], ["Sarah", "linear-gradient(140deg,#89b4fa,#b4befe)"], ["Kids", "linear-gradient(140deg,#a6e3a1,#94e2d5)", true], ["Guest", "linear-gradient(140deg,#585b70,#7f849c)"]];
function profiles() {
  const size = DIR === "c" ? 200 : 240;
  const av = ([n, g, lock], i) => `<div style="display:flex;flex-direction:column;align-items:center;gap:24px">
      <div style="width:${size}px;height:${size}px;border-radius:${DIR === "c" ? 44 : size / 2}px;background:${g};display:grid;place-items:center;font-size:${size * 0.4}px;font-weight:700;color:#1e1e2e;${i === 0 ? `box-shadow:0 0 0 6px var(--base),0 0 0 12px var(--accent),var(--card-shadow);transform:scale(1.08)` : "opacity:.8"}">${n[0]}</div>
      <div style="font-size:30px;font-weight:${i === 0 ? 680 : 500};color:${i === 0 ? "var(--text)" : "var(--sub0)"}">${n}</div>${lock ? '<div class="dim" style="font-size:20px;margin-top:-16px">Managed · PIN</div>' : ""}</div>`;
  const add = `<div style="display:flex;flex-direction:column;align-items:center;gap:24px"><div style="width:${size}px;height:${size}px;border-radius:${DIR === "c" ? 44 : size / 2}px;box-shadow:inset 0 0 0 3px var(--s1);display:grid;place-items:center;color:var(--sub0)">${I.plus.replace("<svg", '<svg width="70" height="70"')}</div><div style="font-size:30px;color:var(--sub0)">Add</div></div>`;
  const back = DIR === "a" ? `<div class="backdrop soft" style="${bg(HERO.backdrop)};opacity:.4"></div>` : DIR === "b" ? `<div class="layer" style="background:radial-gradient(ellipse at 50% 0%,color-mix(in srgb,var(--accent) 18%,transparent),transparent 60%)"></div>` : "";
  return `${back}<div class="nav"><div class="brand"><span class="mark">${I.logo}</span>Nyx<small>TV</small></div><div class="end"><span class="clock">${CLOCK}</span></div></div>
    <div class="layer" style="top:${DIR === "c" ? 260 : 230}px;bottom:auto;text-align:center"><div class="h-1">Who's watching?</div><div class="dim" style="margin-top:14px">Plex Home on Home Server</div></div>
    <div class="layer" style="top:${DIR === "c" ? 470 : 470}px;bottom:auto;display:flex;justify-content:center;gap:${DIR === "c" ? 70 : 80}px">${PROFILES.map(av).join("")}${add}</div>
    ${hints([["OK", "Choose"], ["Long-press", "Edit profile"]])}`;
}

// ---------- Settings ----------
const SETTINGS_NAV = [["Home screen", I.home], ["Content rows", I.rows], ["Appearance", I.palette], ["Apps", I.grid], ["Plex", I.server], ["Ambient mode", I.image], ["TV and inputs", I.tv], ["Remote and keys", I.remote], ["Diagnostics", I.pulse], ["About", I.about]];
function settingsFrame(activeIdx, right, o = {}) {
  const items = SETTINGS_NAV.map(([t, ic], i) => `<div class="li${i === activeIdx ? (o.navFocus ? " focus" : " on") : ""}" style="height:80px;font-size:26px">${ic.replace("<svg", '<svg class="lead"')}${t}${i === activeIdx ? `<span class="r">${I.chevr}</span>` : ""}</div>`).join("");
  if (DIR === "b") {
    return `${nav("settings")}<div class="layer" style="left:120px;right:120px;top:150px;bottom:40px;display:flex;gap:40px">
      <div style="width:440px;flex:none"><div class="h-2" style="margin:0 0 24px 28px">Settings</div>${items}</div>
      <div class="panel" style="flex:1;padding:40px 36px;overflow:hidden">${right}</div></div>`;
  }
  const back = DIR === "a" ? `<div class="backdrop soft" style="${bg(HERO.backdrop)};opacity:.3"></div>` : "";
  return `${back}${nav("settings", { focus: DIR === "a" ? undefined : undefined })}<div class="layer" style="left:96px;top:${DIR === "c" ? 130 : 150}px;width:520px;bottom:40px"><div class="h-2" style="margin:0 0 24px 28px">Settings</div>${items}</div>
    <div class="layer ${DIR === "c" ? "panel" : ""}" style="left:680px;right:96px;top:${DIR === "c" ? 140 : 160}px;bottom:60px;padding:${DIR === "c" ? "40px 36px" : "8px 0"};overflow:hidden">${right}</div>`;
}
const group = (t) => `<div class="eyebrow" style="color:var(--sub0);margin:26px 0 10px 28px">${t}</div>`;
function settings() {
  const r = `<div class="h-3" style="margin:0 0 6px 28px">Home screen</div><div class="dim" style="margin:0 0 10px 28px;font-size:23px">What the home screen shows and how it starts.</div>
    ${group("Featured")}
    <div class="li focus"><div class="t"><span>Featured hero</span><small>A large backdrop for one title at the top of Home</small></div><span class="r"><span class="toggle on"></span></span></div>
    <div class="li"><div class="t"><span>Featured title</span><small>Newest in Movies and TV Shows</small></div><span class="r">Recently added ${I.chevr}</span></div>
    <div class="li"><div class="t"><span>Trailers and video backgrounds</span><small>Never played automatically</small></div><span class="r">Off</span></div>
    ${group("Layout")}
    <div class="li"><div class="t"><span>Favorite apps</span><small>Where the apps row sits</small></div><span class="r"><span class="seg"><span>Top</span><span class="on">After Continue</span><span>Bottom</span></span></span></div>
    <div class="li"><div class="t"><span>Clock</span></div><span class="r"><span class="seg"><span class="on">12-hour</span><span>24-hour</span><span>Off</span></span></span></div>
    <div class="li"><div class="t"><span>Show server status</span><small>A small dot when a server can't be reached</small></div><span class="r"><span class="toggle on"></span></span></div>`;
  return settingsFrame(0, r);
}
function rowsEditor() {
  const ROWS = [["Featured hero", "Backdrop", true], ["Continue Watching", "Landscape · 20", true], ["Favorite Apps", "App tiles · 7", true, true], ["Recently Added Movies", "Poster · 20 · Movies", true], ["Recently Added TV Shows", "Poster · 20 · TV Shows", true], ["Next Episodes", "Landscape · 12", true], ["Collections", "Poster · pinned: Star Wars, Alien", true], ["Science Fiction", "Poster · genre row", false]];
  const list = ROWS.map(([t, s, on, moving], i) => `<div class="li${moving ? " focus" : ""}" style="height:86px;${moving ? "box-shadow:0 0 0 4px var(--accent);transform:translateX(18px)" : ""}">
      <span class="grip"><i></i><i></i><i></i></span><div class="t"><span>${t}</span><small>${s}</small></div>
      <span class="r">${moving ? `<span style="font-size:22px">${I.move.replace("<svg", '<svg width="26" height="26"')} Moving</span>` : `<span class="toggle${on ? " on" : ""}"></span>`}</span></div>`).join("");
  const r = `<div style="display:flex;gap:40px;height:100%">
    <div style="flex:1.1"><div class="h-3" style="margin:0 0 6px 28px">Content rows</div><div class="dim" style="margin:0 0 18px 28px;font-size:23px">Up and down to move · OK to drop</div>${list}
      <div class="li" style="color:var(--accent)">${I.plus.replace("<svg", '<svg class="lead" style="color:var(--accent)"')}Add a row</div></div>
    <div style="flex:.9;border-left:1.5px solid rgba(127,132,156,.18);padding-left:36px">
      <div class="eyebrow" style="color:var(--sub0);margin-bottom:16px">Favorite Apps</div>
      <div style="font-size:24px;color:var(--sub1);margin-bottom:12px">Card style</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:28px">
        ${[["Landscape", 1.78], ["Poster", 0.67], ["Square", 1], ["App tiles", 1.78]].map(([t, ar], i) => `<div style="height:120px;border-radius:16px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;background:rgba(127,132,156,.12);${i === 3 ? "box-shadow:inset 0 0 0 3px var(--accent)" : ""}"><span style="height:46px;width:${46 * ar}px;border-radius:6px;background:${i === 3 ? "var(--accent)" : "var(--s1)"}"></span><span style="font-size:20px;color:var(--sub1)">${t}</span></div>`).join("")}</div>
      <div class="li" style="padding:0"><div class="t"><span>Items</span></div><span class="r"><span class="chip">−</span><b style="color:var(--text);font-size:28px;width:40px;text-align:center">7</b><span class="chip">+</span></span></div>
      <div class="li" style="padding:0"><div class="t"><span>Place</span><small>Above or below the media rows</small></div><span class="r">After Continue ${I.chevr}</span></div>
      <div class="li" style="padding:0"><div class="t"><span>Show on Home</span></div><span class="r"><span class="toggle on"></span></span></div></div></div>`;
  return settingsFrame(1, r) + hints([["▲ ▼", "Move row"], ["OK", "Drop"], ["Back", "Cancel"]]);
}
const THEMES = [
  ["Catppuccin Mocha", "#1e1e2e", "#313244", "#cdd6f4", "#cba6f7", true],
  ["Catppuccin Macchiato", "#24273a", "#363a4f", "#cad3f5", "#c6a0f6"],
  ["Catppuccin Frappé", "#303446", "#414559", "#c6d0f5", "#ca9ee6"],
  ["Catppuccin Latte", "#eff1f5", "#ccd0da", "#4c4f69", "#8839ef"],
  ["OLED Black", "#000000", "#1a1a1a", "#e6e6e6", "#cba6f7"],
  ["Nyx Dark", "#0d0e12", "#1f2028", "#e7e8ee", "#3d8ae8"],
];
function themes() {
  const card = ([n, b, s, t, a, cur], i) => `<div style="width:260px"><div style="height:180px;border-radius:18px;background:${b};padding:18px;position:relative;${i === 1 ? "box-shadow:0 0 0 5px var(--base),0 0 0 10px var(--accent),var(--card-shadow);transform:scale(1.05)" : "box-shadow:0 0 0 1.5px rgba(127,132,156,.3)"}">
      <div style="height:16px;width:90px;border-radius:8px;background:${t};opacity:.85"></div><div style="display:flex;gap:10px;margin-top:22px">${[0, 1, 2].map((j) => `<div style="width:70px;height:96px;border-radius:10px;background:${j === 0 ? a : s}"></div>`).join("")}</div>
      ${cur ? `<span style="position:absolute;top:14px;right:14px;width:36px;height:36px;border-radius:18px;background:${a};color:${b};display:grid;place-items:center">${I.check.replace("<svg", '<svg width="22" height="22"')}</span>` : ""}</div>
    <div style="font-size:23px;font-weight:600;margin-top:14px">${n}</div></div>`;
  const ACC = [["Mauve", "var(--mauve)"], ["Blue", "var(--blue)"], ["Lavender", "var(--lavender)"], ["Pink", "var(--pink)"], ["Peach", "var(--peach)"], ["Yellow", "var(--yellow)"], ["Green", "var(--green)"], ["Teal", "var(--teal)"], ["Red", "var(--red)"]];
  const sw = ACC.map(([n, c], i) => `<div style="display:flex;flex-direction:column;align-items:center;gap:10px"><span style="width:64px;height:64px;border-radius:32px;background:${c};${i === 0 ? "box-shadow:0 0 0 4px var(--base),0 0 0 8px var(--text)" : ""}"></span><span style="font-size:19px;color:var(--sub0)">${n}</span></div>`).join("");
  const r = `<div class="h-3" style="margin:0 0 6px 28px">Appearance</div><div class="dim" style="margin:0 0 24px 28px;font-size:23px">Previewed behind this panel as you move.</div>
    <div style="display:flex;flex-wrap:wrap;gap:34px 30px;padding-left:28px">${THEMES.map(card).join("")}</div>
    ${group("Accent")}<div style="display:flex;gap:22px;padding-left:28px">${sw}</div>`;
  return settingsFrame(2, r);
}

// ---------- Quick settings, inputs ----------
const QS = [
  [I.wifi, "Wi-Fi", "Home-5G"], [I.bt, "Bluetooth", "Remote, Soundbar"], [I.input, "Input", "HDMI 2 · PlayStation 5"], [I.picture, "Picture", "Movie"],
  [I.sound, "Sound", "Dolby Atmos"], [I.speaker, "Sound output", "Soundbar (eARC)"], [I.moon, "Sleep timer", "Off"], [I.image, "Ambient now", "Start the screensaver"],
];
function quick() {
  const tile = ([ic, t, s], i) => `<div style="height:${DIR === "b" ? 150 : 136}px;border-radius:${DIR === "c" ? 16 : 24}px;padding:22px 24px;display:flex;flex-direction:column;justify-content:space-between;${i === 0 ? "background:var(--accent);color:var(--on-accent);transform:scale(1.04)" : i < 2 || i === 5 ? "background:color-mix(in srgb,var(--accent) 22%,var(--s0))" : "background:var(--s0)"}">
      <span style="width:38px;height:38px;display:block">${ic}</span><div><div style="font-size:25px;font-weight:640;white-space:nowrap">${t}</div><div style="font-size:20px;opacity:.75;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${s}</div></div></div>`;
  const footer = `<div class="li" style="height:76px">${I.gear.replace("<svg", '<svg class="lead"')}All TV settings<span class="r">${I.ext}</span></div>
    <div class="dim" style="font-size:20px;padding:6px 28px">TCL 75Q570G · Nyx TV 0.1 · Home Server connected</div>`;
  const under = home({});
  if (DIR === "b") {
    return `${under}<div class="scrim"></div><div class="layer" style="z-index:9;top:0;bottom:auto;background:var(--mantle);padding:46px 96px 36px;border-radius:0 0 36px 36px;box-shadow:0 30px 100px rgba(0,0,0,.5)">
      <div style="display:flex;align-items:center;margin-bottom:28px"><div class="h-3">Quick settings</div><span class="clock" style="margin-left:auto">${CLOCK} · Saturday, November 14</span></div>
      <div style="display:grid;grid-template-columns:repeat(8,1fr);gap:18px">${QS.map(tile).join("")}</div>
      <div style="display:flex;gap:20px;margin-top:22px;align-items:center"><div class="li" style="height:70px;background:rgba(127,132,156,.12)">${I.gear.replace("<svg", '<svg class="lead"')}All TV settings</div><span class="dim" style="font-size:21px;margin-left:auto">TCL 75Q570G · Nyx TV 0.1</span></div></div>`;
  }
  if (DIR === "c") {
    const list = QS.map(([ic, t, s], i) => `<div class="li${i === 0 ? " focus" : ""}" style="height:82px">${ic.replace("<svg", '<svg class="lead"')}<div class="t"><span>${t}</span></div><span class="r">${s}${i < 7 ? I.chevr : ""}</span></div>`).join("");
    return `${under}<div class="scrim"></div><div class="layer panel" style="z-index:9;left:auto;width:660px;right:40px;top:40px;bottom:40px;padding:30px 20px">
      <div class="h-3" style="margin:0 0 18px 28px">Quick settings</div>${list}<hr style="border:0;height:1.5px;background:rgba(127,132,156,.2);margin:12px">${footer}</div>`;
  }
  return `${under}<div class="scrim"></div><div class="layer" style="z-index:9;left:auto;width:720px;background:var(--mantle);padding:56px 48px;box-shadow:-30px 0 100px rgba(0,0,0,.45)">
    <div class="clock" style="font-size:64px;font-weight:300">${CLOCK}</div><div class="dim" style="margin-bottom:34px">Saturday, November 14</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:18px">${QS.map(tile).join("")}</div><div style="margin-top:22px">${footer}</div></div>`;
}
const INPUTS = [["HDMI 1", "Soundbar · eARC", I.speaker], ["HDMI 2", "PlayStation 5", I.input, true], ["HDMI 3", "No signal", I.input], ["HDMI 4", "No signal", I.input], ["Live TV", "Antenna", I.antenna]];
function inputs() {
  const under = home({});
  if (DIR === "a") {
    const t = INPUTS.map(([n, s, ic, cur], i) => `<div style="width:270px;height:230px;border-radius:26px;padding:28px;display:flex;flex-direction:column;justify-content:space-between;background:${i === 1 ? "var(--text)" : "var(--s0)"};color:${i === 1 ? "var(--base)" : s === "No signal" ? "var(--sub0)" : "var(--text)"};${i === 1 ? "transform:scale(1.07);box-shadow:var(--card-shadow)" : ""}">
        <span style="width:46px;height:46px;display:block">${ic}</span><div><div style="font-size:32px;font-weight:680">${n}</div><div style="font-size:22px;opacity:.75">${s}</div></div></div>`).join("");
    return `${under}<div class="scrim" style="background:rgba(var(--scrim),.82)"></div><div class="layer" style="z-index:9;top:330px;bottom:auto;text-align:center"><div class="h-2">Inputs</div><div class="dim" style="margin-top:8px">Names come from HDMI-CEC when the device reports one</div></div>
      <div class="layer" style="z-index:9;top:500px;bottom:auto;display:flex;justify-content:center;gap:30px">${t}</div>${hints([["OK", "Switch"], ["Long-press", "Rename"], ["Back", "Close"]]).replace('class="hints"', 'class="hints" style="z-index:10"')}`;
  }
  if (DIR === "b") {
    const t = INPUTS.map(([n, s, ic], i) => `<div class="li${i === 1 ? " focus" : ""}" style="height:120px;flex:1;flex-direction:column;justify-content:center;align-items:flex-start;gap:4px;background:${i === 1 ? "" : "var(--s0)"}"><span style="font-size:28px;font-weight:660">${n}</span><span style="font-size:21px;opacity:.7">${s}</span></div>`).join("");
    return `${under}<div class="scrim"></div><div class="layer" style="z-index:9;top:auto;height:330px;background:var(--mantle);border-radius:36px 36px 0 0;padding:40px 96px">
      <div style="display:flex;align-items:baseline;gap:20px;margin-bottom:26px"><div class="h-3">Inputs</div><span class="dim" style="font-size:22px">Current: Nyx TV</span></div><div style="display:flex;gap:18px">${t}</div></div>`;
  }
  const list = INPUTS.map(([n, s, ic], i) => `<div class="li${i === 1 ? " focus" : ""}" style="height:96px">${ic.replace("<svg", '<svg class="lead"')}<div class="t"><span>${n}</span><small>${s}</small></div>${i === 1 ? `<span class="r">${I.chevr}</span>` : ""}</div>`).join("");
  return `${under}<div class="scrim"></div><div class="layer panel" style="z-index:9;left:40px;width:620px;top:40px;bottom:40px;padding:30px 20px"><div class="h-3" style="margin:0 0 18px 28px">Inputs</div>${list}
    <hr style="border:0;height:1.5px;background:rgba(127,132,156,.2);margin:12px"><div class="li" style="height:76px">${I.gear.replace("<svg", '<svg class="lead"')}Input settings<span class="r">${I.ext}</span></div></div>`;
}

// ---------- Ambient ----------
function ambient() {
  const h = D.heroes[3] || HERO;
  if (DIR === "a") {
    return `<div class="backdrop full" style="${bg(h.backdrop)}"></div>
      <div class="layer" style="left:96px;top:auto;bottom:90px;right:auto;color:#fff;text-shadow:0 4px 30px rgba(0,0,0,.6)">
        <div style="font-size:150px;font-weight:250;letter-spacing:-.03em;line-height:1">${CLOCK}</div><div style="font-size:32px;opacity:.85;margin-top:6px">Saturday, November 14 · 54°</div></div>
      <div class="layer" style="right:96px;left:auto;top:auto;bottom:100px;text-align:right;color:#fff;opacity:.8;text-shadow:0 2px 20px rgba(0,0,0,.7)"><div style="font-size:30px;font-weight:620">${esc(h.title)}</div><div style="font-size:22px">${h.year} · In your Plex library</div></div>`;
  }
  if (DIR === "b") {
    return `<div class="backdrop full" style="${bg(h.backdrop)}"></div>
      <div class="layer" style="left:auto;right:96px;top:70px;bottom:auto;text-align:right;color:#fff;text-shadow:0 4px 30px rgba(0,0,0,.6)"><div style="font-size:96px;font-weight:300;line-height:1">${CLOCK}</div><div style="font-size:26px;opacity:.85">Saturday, November 14</div></div>
      <div class="layer" style="left:96px;top:auto;bottom:80px;right:auto;color:#fff;text-shadow:0 2px 20px rgba(0,0,0,.7)"><div class="eyebrow" style="color:#fff;opacity:.8">From your library</div><div style="font-size:44px;font-weight:700;margin-top:8px">${esc(h.title)}</div></div>`;
  }
  return `<div class="layer" style="background:#000"></div>
    <div class="layer" style="left:160px;right:160px;top:90px;bottom:240px;${bg(h.backdrop)};background-size:cover;background-position:center;border-radius:6px;box-shadow:0 30px 120px rgba(0,0,0,.7)"></div>
    <div class="layer" style="top:auto;bottom:80px;display:flex;justify-content:space-between;align-items:baseline;padding:0 160px;color:#ddd">
      <div><div style="font-size:30px;font-weight:620">${esc(h.title)}</div><div style="font-size:22px;color:#999">${h.year} · ${esc((h.genres || []).join(", "))}</div></div>
      <div style="font-size:72px;font-weight:300">${CLOCK}</div></div>`;
}
function oled() {
  const pos = DIR === "a" ? "left:140px;bottom:120px" : DIR === "b" ? "left:0;right:0;top:440px;text-align:center" : "right:220px;top:180px;text-align:right";
  return `<div class="layer" style="background:#000"></div><div style="position:absolute;${pos};color:#5a5a66">
    <div style="font-size:${DIR === "b" ? 140 : 110}px;font-weight:200;letter-spacing:-.02em;line-height:1">${CLOCK}</div><div style="font-size:26px;color:#3e3e48;margin-top:10px">Saturday, November 14</div></div>`;
}

// ---------- Player: four directions (A Gradient · B Lean back · C Status chips · D Center) ----------
// Theater-inspired. No remote-key hints. Skip sits above the scrubber, never in the icon row.
const PLAY = (() => {
  const ep = D.continue.find((c) => c.kind === "episode") || D.continue[0];
  const next = D.nextEpisodes?.[0] || D.continue.find((c) => c.kind === "episode" && c.id !== ep.id) || ep;
  return {
    ep,
    next,
    title: ep.kind === "episode" ? `${ep.series}` : ep.title,
    code: ep.kind === "episode" ? epCode(ep) : (ep.year ? String(ep.year) : ""),
    sub: ep.kind === "episode" ? ep.title : "",
    art: ep.backdrop || ep.thumb || ep.poster,
    nextArt: next.thumb || next.backdrop || next.poster,
    nextLabel: next.kind === "episode" ? `${next.series} · ${epCode(next)}` : next.title,
    nextSub: next.kind === "episode" ? next.title : "",
    intro: { start: 0.02, end: 0.09 },
    credits: { start: 0.88, end: 0.98 },
    duration: "42:18",
    remaining: "−33:06",
  };
})();
const PDIR = ["a", "b", "c", "d", "plex"].includes(DIR) ? DIR : "a";

const pScrub = (pct) => {
  const { intro, credits } = PLAY;
  const chapters = [0.18, 0.34, 0.52, 0.71].map((x) => `<i class="tick" style="left:${x * 100}%"></i>`).join("");
  return `<div class="p-scrub"><div class="track">
    <i class="band intro" style="left:${intro.start * 100}%;width:${(intro.end - intro.start) * 100}%"></i>
    <i class="band credits" style="left:${credits.start * 100}%;width:${(credits.end - credits.start) * 100}%"></i>
    ${chapters}
    <i class="fill" style="width:${pct * 100}%"></i>
    <i class="knob" style="left:${pct * 100}%"></i>
  </div></div>`;
};

const pSkip = (label, focus = true) =>
  label ? `<div class="p-skip"><div class="pill${focus ? " focus" : ""}">${esc(label)}</div></div>` : "";

const pPlayDisc = (focus) =>
  `<div class="p-disc${focus ? " focus" : ""}">${I.pause}</div>`;

const audioPanel = () => {
  const row = (t, s, o = {}) =>
    `<div class="p-row${o.focus ? " focus" : ""}"><div class="t"><span>${t}</span>${s ? `<small>${s}</small>` : ""}</div><span class="r">${o.check ? I.check : ""}</span></div>`;
  return `<div class="p-panel">
    <div class="p-panel-h">Audio & sync</div>
    ${row("English · Dolby Atmos", "TrueHD 7.1", { focus: true, check: true })}
    ${row("English · AAC", "2.0 stereo")}
    ${row("Commentary", "Director")}
    <div class="p-panel-sec">Audio sync</div>
    ${row("Offset", "−500 ms when dialogue lags", { check: false })}
    <div class="p-row"><div class="t"><span>−500 ms</span><small>↑↓ nudge 50 ms</small></div></div>
  </div>`;
};

/** Shared picture + vignette; chrome is direction-specific. */
function playerShell(chrome) {
  return `<div class="backdrop full player-pic" style="${bg(PLAY.art)}"></div>
    <div class="player-vignette"></div>
    <div class="player dir-${PDIR}">${chrome}</div>`;
}

// --- A · Gradient (Theater ship parity) ---
function playerA(state) {
  if (state === "idle") return playerShell("");
  const pct = state === "credits" ? 0.91 : state === "audio" ? 0.22 : 0.06;
  const time = state === "credits" ? "38:24" : state === "audio" ? "9:12" : "2:18";
  const rem = state === "credits" ? "−3:54" : state === "audio" ? "−33:06" : "−40:00";
  const skipBand = state === "controls"
    ? pSkip("Skip Intro")
    : state === "credits"
      ? `<div class="p-skip"><div class="pill focus">Skip Credits</div><div class="pill ghost">Next episode</div></div>`
      : "";
  const focusPlay = state !== "controls" && state !== "credits" && state !== "audio";
  return playerShell(`
    <div class="p-top"><b>${esc(PLAY.title)}</b><span>${esc(PLAY.code)}${PLAY.sub ? ` · ${esc(PLAY.sub)}` : ""}</span></div>
    ${skipBand}
    <div class="p-bottom">
      <div class="p-seekline"><span class="mono">${time}</span>${pScrub(pct)}<span class="mono">${rem}</span></div>
      <div class="p-bar">
        <div class="p-left"><div class="p-icon">${I.back10}</div>${pPlayDisc(focusPlay)}<div class="p-icon">${I.fwd10}</div></div>
        <div class="p-right">
          <div class="p-icon">${I.sound}</div>
          <div class="p-icon">${I.cc}</div>
          <div class="p-icon">1×</div>
          <div class="p-icon">${I.gear}</div>
        </div>
      </div>
    </div>
    ${state === "audio" ? `<div class="p-overlay">${audioPanel()}</div>` : ""}`);
}

// --- B · Lean back (Theater mockup C) ---
function playerB(state) {
  if (state === "idle") return playerShell("");
  const pct = state === "credits" ? 0.91 : state === "audio" ? 0.22 : 0.06;
  const time = state === "credits" ? "38:24" : state === "audio" ? "9:12" : "2:18";
  const rem = state === "credits" ? "−3:54" : "−40:00";
  const skipIntro = state === "controls" ? pSkip("Skip Intro") : "";
  const upNext = state === "credits" ? `<div class="p-upnext">
      <div class="thumb" style="${bg(PLAY.nextArt)}"></div>
      <div class="meta"><span class="k">Up next · plays in 8 s</span><b>${esc(PLAY.nextLabel)}</b><span>${esc(PLAY.nextSub)}</span>
        <div class="acts"><div class="pill focus">Play now</div><div class="pill ghost">Don't play</div></div></div>
    </div>` : "";
  return playerShell(`
    <div class="p-top"><b>${esc(PLAY.title)}</b><span>${esc(PLAY.code)}${PLAY.sub ? ` · ${esc(PLAY.sub)}` : ""}</span></div>
    ${skipIntro}
    ${upNext}
    <div class="p-bottom">
      <div class="p-seekline"><span class="mono">${time}</span>${pScrub(pct)}<span class="mono">${rem}</span></div>
      <div class="p-bar">
        <div class="p-left"><div class="p-icon">${I.back10}</div>${pPlayDisc(state !== "audio" && state !== "credits")}<div class="p-icon">${I.fwd10}</div></div>
        <div class="p-chips">
          <span class="chip${state === "audio" ? " on" : ""}">${I.cc}Audio & subtitles</span>
          <span class="chip">${I.chapters}Chapters</span>
          <span class="chip">1×</span>
        </div>
      </div>
    </div>
    ${state === "audio" ? `<div class="p-overlay pop">${audioPanel()}</div>` : ""}`);
}

// --- C · Status chips (Media Player) ---
function playerC(state) {
  if (state === "idle") return playerShell("");
  const pct = state === "credits" ? 0.91 : state === "audio" ? 0.22 : 0.06;
  const time = state === "credits" ? "38:24" : state === "audio" ? "9:12" : "2:18";
  const rem = state === "credits" ? "−3:54" : "−40:00";
  const skipBand = state === "controls"
    ? pSkip("Skip Intro")
    : state === "credits"
      ? `<div class="p-skip"><div class="pill focus">Skip Credits</div><div class="pill ghost">Next episode</div></div>`
      : "";
  return playerShell(`
    <div class="p-top"><b>${esc(PLAY.title)}</b><span>${esc(PLAY.code)}${PLAY.sub ? ` · ${esc(PLAY.sub)}` : ""}</span></div>
    ${skipBand}
    <div class="p-bottom">
      <div class="p-seekline"><span class="mono">${time}</span>${pScrub(pct)}<span class="mono">${rem}</span></div>
      <div class="p-bar">
        <div class="p-left"><div class="p-icon">${I.back10}</div>${pPlayDisc(!skipBand && state !== "audio")}<div class="p-icon">${I.fwd10}</div></div>
        <div class="p-status">
          <span class="chip${state === "audio" ? " on" : ""}">English SDH</span>
          <span class="chip">Atmos</span>
          <span class="chip">1×</span>
        </div>
      </div>
    </div>
    ${state === "audio" ? `<div class="p-overlay pop">${audioPanel()}</div>` : ""}`);
}

// --- D · Center transport (TV-native) ---
function playerD(state) {
  if (state === "idle") return playerShell("");
  const pct = state === "credits" ? 0.91 : state === "audio" ? 0.22 : 0.06;
  const time = state === "credits" ? "38:24" : state === "audio" ? "9:12" : "2:18";
  const skipBand = state === "controls"
    ? pSkip("Skip Intro")
    : state === "credits"
      ? `<div class="p-skip"><div class="pill focus">Skip Credits</div><div class="pill ghost">Next episode</div></div>`
      : "";
  return playerShell(`
    <div class="p-top center"><b>${esc(PLAY.title)}</b><span>${esc(PLAY.code)}${PLAY.sub ? ` · ${esc(PLAY.sub)}` : ""}</span></div>
    ${state !== "audio" ? `<div class="p-center">
      <div class="p-icon lg">${I.back10}</div>
      ${pPlayDisc(!skipBand)}
      <div class="p-icon lg">${I.fwd10}</div>
    </div>` : ""}
    ${skipBand}
    <div class="p-bottom slim">
      <div class="p-seekline full"><span class="mono">${time}</span>${pScrub(pct)}<span class="mono">${PLAY.duration}</span>
        <div class="p-icon gear">${I.gear}</div></div>
    </div>
    ${state === "audio" ? `<div class="scrim player-scrim"></div><div class="layer player-rail"><div class="h-3" style="margin:0 0 18px 8px">Audio & sync</div>
      <div class="p-row focus"><div class="t"><span>English · Dolby Atmos</span><small>TrueHD 7.1</small></div><span class="r">${I.check}</span></div>
      <div class="p-row"><div class="t"><span>English · AAC</span><small>2.0 stereo</small></div></div>
      <div class="p-row"><div class="t"><span>Commentary</span><small>Director</small></div></div>
      <div class="p-panel-sec">Audio sync</div>
      <div class="p-row"><div class="t"><span>Offset</span><small>−500 ms when dialogue lags</small></div><span class="r"><b>−500 ms</b></span></div>
    </div>` : ""}`);
}

function playerByDir(state) {
  return ({ a: playerA, b: playerB, c: playerC, d: playerD, plex: playerPlex }[PDIR] || playerA)(state);
}

/** Tiny remote legend for chrome shots (full diagram is player-remote). */
const pRemoteHint = () =>
  `<div class="p-remote-hint">
    <div class="rh-title">Remote</div>
    <div class="rh-grid">
      <span>OK</span><span>Play/Pause · or open focused control</span>
      <span>← →</span><span>Seek (±30s on scrubber; hold accelerates)</span>
      <span>↑</span><span>Show chrome · focus scrubber · then Subs/Settings</span>
      <span>↓</span><span>View More → Chapters · or hide</span>
      <span>Back</span><span>Close panel · hide chrome · exit if idle</span>
    </div>
  </div>`;

const plexMeta = () => {
  const year = PLAY.ep.year || "2026";
  const mins = PLAY.ep.minutes || 104;
  const dur = mins >= 60 ? `${Math.floor(mins / 60)} hour${mins >= 120 ? "s" : ""} ${mins % 60 ? `${mins % 60} minutes` : ""}`.trim() : `${mins} minutes`;
  return `${year} • ${dur}`;
};

const plexScrub = (pct, focused) => {
  const { intro, credits } = PLAY;
  return `<div class="px-scrub${focused ? " focus" : ""}"><div class="track">
    <i class="band intro" style="left:${intro.start * 100}%;width:${(intro.end - intro.start) * 100}%"></i>
    <i class="band credits" style="left:${credits.start * 100}%;width:${(credits.end - credits.start) * 100}%"></i>
    <i class="fill" style="width:${pct * 100}%"></i>
    <i class="knob" style="left:${pct * 100}%"></i>
  </div></div>`;
};

const plexChrome = ({ pct, time, rem, focus, skip, ends }) => {
  const foc = focus || "scrubber";
  return `
    <div class="px-toolbar">
      <div class="px-titleblock">
        <div class="px-title">${esc(PLAY.title)}</div>
        <div class="px-meta">${esc(plexMeta())}${PLAY.code ? ` · ${esc(PLAY.code)}` : ""}${PLAY.sub ? ` · ${esc(PLAY.sub)}` : ""}</div>
      </div>
      <div class="px-clock"><b>${CLOCK}</b><span>Ends at ${ends || "6:48 PM"}</span></div>
    </div>
    ${skip ? `<div class="px-skip"><div class="pill focus">Skip Intro</div></div>` : ""}
    <div class="px-controls">
      <div class="px-actions">
        <div class="px-icon${foc === "subs" ? " focus" : ""}">${I.cc}<span>Subtitles</span></div>
        <div class="px-icon${foc === "settings" ? " focus" : ""}">${I.gear}<span>Settings</span></div>
      </div>
      <div class="px-seek${foc === "scrubber" ? " focus" : ""}">
        <span class="mono">${time}</span>
        ${plexScrub(pct, foc === "scrubber")}
        <span class="mono rem">${rem}</span>
      </div>
      <div class="px-more${foc === "more" ? " focus" : ""}">${I.chevd}<span>View More</span></div>
    </div>`;
};

const plexSettingsPanel = (focusRow = "offset") => {
  const row = (id, label, value, opts = {}) =>
    `<div class="px-menu-row${focusRow === id ? " focus" : ""}${opts.nyx ? " nyx" : ""}">
      <span class="lab">${label}${opts.nyx ? `<i class="nyx-tag">Nyx</i>` : ""}</span>
      <span class="val">${value}${opts.chev ? I.chevr : ""}</span>
    </div>`;
  return `<div class="px-menu">
    <div class="px-menu-title">Settings</div>
    ${row("quality", "Quality", "Original", { chev: true })}
    ${row("subs", "Subtitles", "None", { chev: true })}
    ${row("audio", "Audio", "English · AAC 5.1", { chev: true })}
    ${row("options", "Playback Options", "", { chev: true })}
    ${row("offset", "Audio sync", "−500 ms", { nyx: true, chev: true })}
  </div>`;
};

const plexAudioPanel = () => `<div class="px-menu">
  <div class="px-menu-title">Audio sync</div>
  <div class="px-menu-hint">Plex dropped this — Nyx keeps it for dialogue lag</div>
  <div class="px-menu-row focus"><span class="lab">Offset</span><span class="val">−500 ms</span></div>
  <div class="px-offset">
    <div class="px-icon">${I.back}</div>
    <b>−500 ms</b>
    <div class="px-icon">${I.chevr}</div>
  </div>
  <div class="px-menu-hint">← → nudge 50 ms · OK to confirm</div>
</div>`;

const plexChapters = () => `<div class="px-deck">
  <div class="px-deck-title">Chapters</div>
  <div class="px-deck-row">
    ${[1, 2, 3, 4].map((n, i) => `<div class="px-chapter${i === 0 ? " focus" : ""}">
      <div class="art" style="${bg(PLAY.art)}"></div>
      <b>Chapter ${n}</b><span>${["0:00", "18:20", "42:05", "1:08:40"][i]}</span>
    </div>`).join("")}
  </div>
</div>`;

// --- Plex copy from Bedroom TV (com.plexapp.android) + Nyx audio sync ---
function playerPlex(state) {
  const shell = (chrome) => `<div class="backdrop full player-pic" style="${bg(PLAY.art)}"></div>
    <div class="player-vignette"></div>
    <div class="player dir-plex">${chrome}</div>`;

  if (state === "idle") return shell("");

  if (state === "remote") {
    return shell(`<div class="remote-map">
      <div class="rm-card">
        <div class="rm-h">Player remote</div>
        <div class="rm-sub">Matched to Plex Android TV on the Bedroom TV · Nyx adds Audio sync in Settings</div>
        <div class="rm-body">
          <div class="rm-pad">
            <div class="rm-dpad">
              <span class="rm-key up">↑</span>
              <span class="rm-key left">←</span>
              <span class="rm-key ok">OK</span>
              <span class="rm-key right">→</span>
              <span class="rm-key down">↓</span>
            </div>
            <div class="rm-keys-row"><span class="rm-key back">Back</span><span class="rm-key media">▶ / ❚❚</span><span class="rm-key media">≪ ≫</span></div>
          </div>
          <table class="rm-table">
            <thead><tr><th>Key</th><th>Chrome hidden</th><th>Chrome visible</th></tr></thead>
            <tbody>
              <tr><td>OK</td><td>Play / Pause</td><td>Open focused control (Settings, Subs, chapter…)</td></tr>
              <tr><td>Left / Right</td><td>Seek − / + (~30s; hold accelerates)</td><td>On scrubber = seek; else move focus</td></tr>
              <tr><td>Up</td><td>Show chrome, focus scrubber</td><td>Scrubber → Subtitles / Settings</td></tr>
              <tr><td>Down</td><td>Show chrome, focus scrubber</td><td>View More → Chapters deck</td></tr>
              <tr><td>Back</td><td>Exit player</td><td>Close panel, else hide chrome</td></tr>
              <tr><td>Play / Pause / RW / FF</td><td colspan="2">Media keys — same as Plex</td></tr>
            </tbody>
          </table>
        </div>
        <div class="rm-note">No −10 / Play disc / +10 row — scrubber is the transport. Audio sync lives under Settings (Nyx-only; Plex removed it).</div>
      </div>
    </div>`);
  }

  if (state === "scrubber") {
    return shell(plexChrome({ pct: 0.34, time: "14:22", rem: "−27:56", focus: "scrubber", ends: "6:47 PM" }) + pRemoteHint());
  }

  if (state === "audio") {
    // Settings open with Audio sync (Nyx) focused — Plex no longer ships offset
    return shell(
      plexChrome({ pct: 0.18, time: "18:44", rem: "−1:26:15", focus: "settings", ends: "6:48 PM" }) +
      plexSettingsPanel("offset")
    );
  }

  if (state === "controls") {
    return shell(
      plexChrome({ pct: 0.06, time: "2:18", rem: "−40:00", focus: "scrubber", skip: true, ends: "6:48 PM" }) +
      pRemoteHint()
    );
  }

  // chapters via "credits" archive name unused; scrubber already covers seek.
  // Default / unknown → controls chrome
  return shell(plexChrome({ pct: 0.22, time: "9:12", rem: "−33:06", focus: "more" }) + plexChapters());
}

const SCREENS = {
  home: () => home({}),
  "home-nohero": () => home({ nohero: true, cardFocus: 0 }),
  offline,
  "card-menu": cardMenu,
  movies: () => library("movies"),
  shows: () => library("shows"),
  collections,
  movie: movieDetail,
  show: showDetail,
  apps,
  search,
  signin,
  servers,
  profiles,
  settings,
  rows: rowsEditor,
  themes,
  quick,
  inputs,
  ambient,
  oled,
  "player-idle": () => playerByDir("idle"),
  "player-controls": () => playerByDir("controls"),
  "player-credits": () => playerByDir("credits"),
  "player-audio": () => playerByDir("audio"),
  "player-scrubber": () => playerByDir("scrubber"),
  "player-remote": () => playerByDir("remote"),
};

document.getElementById("stage").innerHTML = (SCREENS[SCREEN] || SCREENS.home)();
drawQR();
if (!Q.get("shot")) {
  const sw = document.createElement("div");
  sw.style.cssText = "position:fixed;left:8px;bottom:8px;z-index:99;font:13px Inter;background:#000a;color:#fff;padding:6px 10px;border-radius:8px;max-width:98vw;overflow:auto";
  const isPlayer = SCREEN.startsWith("player-");
  const dirs = isPlayer ? ["plex", "a", "b", "c", "d"] : ["a", "b", "c"];
  sw.innerHTML = dirs.map((d) => `<a style="color:${d === DIR ? "#cba6f7" : "#fff"};margin-right:8px" href="?direction=${d}&screen=${SCREEN}&theme=${document.documentElement.dataset.theme}">${d.toUpperCase()}</a>`).join("") +
    Object.keys(SCREENS).map((s) => `<a style="color:${s === SCREEN ? "#cba6f7" : "#aaa"};margin-right:6px" href="?direction=${isPlayer && !s.startsWith("player-") ? "plex" : DIR}&screen=${s}&theme=${document.documentElement.dataset.theme}">${s}</a>`).join("");
  document.body.append(sw);
}
