// Focus-strip variants for Home. screens.html?kind=&variant=&theme=
const Q = new URLSearchParams(location.search);
const KIND = Q.get("kind") || "collection"; // collection | playlist | app
const VARIANT = Q.get("variant") || "a"; // a|b|c or 1|2|3
document.documentElement.dataset.theme = Q.get("theme") || "dark";

const D = window.NYX;
const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const bg = (src) => (src ? `background-image:url('${src}')` : "");

const HERO = D.heroes[0];
const COL = D.collections[0];
const KIDS = (COL.items || D.recentMovies).slice(0, 4);
const PLAYLIST = {
  title: "Friday Night",
  count: 18,
  summary: "A hand-picked stack for the end of the week — thrillers first, then something lighter.",
};
const PLAY_KIDS = D.recentMovies.slice(0, 4);
const APPS = [
  { name: "Netflix", letter: "N" },
  { name: "YouTube", letter: "Y" },
  { name: "Plex", letter: "P" },
  { name: "Prime Video", letter: "P" },
];

function nav() {
  return `<div class="nav">
    <div class="brand">Nyx <small>TV</small></div>
    <div class="tabs">
      <div class="tab on">Home</div>
      <div class="tab">Movies</div>
      <div class="tab">TV Shows</div>
      <div class="tab">Apps</div>
    </div>
    <div class="end"><span>⌕</span><span>⚙</span><span>7:42</span><span style="width:48px;height:48px;border-radius:50%;background:linear-gradient(140deg,#fab387,#f5c2e7);display:grid;place-items:center;font-weight:700">K</span></div>
  </div>`;
}

function rowCards(kind, focusIndex) {
  if (kind === "app") {
    return APPS.map((a, i) =>
      `<div class="card app${i === focusIndex ? " focus" : ""}">${esc(a.letter)}</div>`
    ).join("");
  }
  const list = kind === "playlist" ? D.recentMovies.slice(0, 6) : D.collections.slice(0, 6);
  return list.map((c, i) => {
    const art = c.poster || (D.recentMovies[i] && D.recentMovies[i].poster);
    return `<div class="card${i === focusIndex ? " focus" : ""}" style="${bg(art)}"></div>`;
  }).join("");
}

function posterRail(kids) {
  return `<div class="rail">${kids.map((c) => `<div class="p" style="${bg(c.poster)}"></div>`).join("")}</div>`;
}

function listStrip(kind, variant) {
  const isPlaylist = kind === "playlist";
  const eyebrow = isPlaylist ? "PLAYLIST" : "COLLECTION";
  const title = isPlaylist ? PLAYLIST.title : COL.title;
  const count = isPlaylist ? `${PLAYLIST.count} titles` : `${COL.count || 12} titles`;
  const summary = isPlaylist
    ? PLAYLIST.summary
    : (COL.summary || "A curated set from your library.");
  const kids = isPlaylist ? PLAY_KIDS : KIDS;
  const holdBg = HERO.backdrop;

  if (variant === "a") {
    return {
      badge: `${eyebrow} · A · Identity`,
      backdrop: holdBg,
      dim: false,
      info: `<div class="eyebrow">${eyebrow}</div>
        <div class="title">${esc(title)}</div>
        <div class="meta">${esc(count)}</div>
        <div class="summary">${esc(summary)}</div>`,
    };
  }
  if (variant === "b") {
    return {
      badge: `${eyebrow} · B · Poster rail`,
      backdrop: holdBg,
      dim: false,
      info: `<div class="eyebrow">${eyebrow}</div>
        <div class="title">${esc(title)}</div>
        <div class="meta">${esc(count)}</div>
        <div class="summary">${esc(summary)}</div>
        ${posterRail(kids)}`,
    };
  }
  // C · First-title hero
  const first = kids[0];
  return {
    badge: `${eyebrow} · C · First-title hero`,
    backdrop: first.backdrop || first.poster || holdBg,
    dim: false,
    info: `<div class="eyebrow">${esc(title)}</div>
      <div class="title">${esc(first.title)}</div>
      <div class="meta">${esc([first.year, (first.genres || []).slice(0, 2).join(", ")].filter(Boolean).join("  ·  "))}</div>
      <div class="summary">${esc(first.summary || "")}</div>
      ${posterRail(kids)}`,
  };
}

function appStrip(variant) {
  const focused = APPS[2]; // Plex in the middle for variant 2
  const holdBg = HERO.backdrop;
  if (variant === "1") {
    return {
      badge: "APP · 1 · Identity",
      backdrop: holdBg,
      dim: true,
      focusApp: 0,
      info: `<div class="eyebrow">APP</div>
        <div class="title">${esc(APPS[0].name)}</div>
        <div class="meta">Installed on this TV</div>
        <div class="summary">Open ${esc(APPS[0].name)} from Home. Titles from this app aren’t available to Nyx.</div>
        <div class="cta">Open</div>`,
    };
  }
  if (variant === "2") {
    return {
      badge: "APP · 2 · Plex titles (other apps → identity)",
      backdrop: D.continue[0].backdrop || D.continue[0].thumb || holdBg,
      dim: false,
      focusApp: 2,
      info: `<div class="eyebrow">FROM PLEX</div>
        <div class="title">${esc(D.continue[0].series || D.continue[0].title)}</div>
        <div class="meta">Continue Watching</div>
        <div class="summary">${esc(D.continue[0].summary || "Pick up where you left off in Plex.")}</div>
        ${posterRail(PLAY_KIDS)}`,
    };
  }
  // 3 hold featured
  return {
    badge: "APP · 3 · Hold featured (today)",
    backdrop: holdBg,
    dim: false,
    focusApp: 1,
    info: `<div class="eyebrow">NEW IN MOVIES</div>
      <div class="title">${esc(HERO.title)}</div>
      <div class="meta">${esc([HERO.year, (HERO.genres || []).slice(0, 2).join(", ")].filter(Boolean).join("  ·  "))}</div>
      <div class="summary">${esc(HERO.summary)}</div>`,
  };
}

function render() {
  const isApp = KIND === "app";
  const shot = isApp ? appStrip(VARIANT) : listStrip(KIND, VARIANT);
  const focusIndex = isApp ? (shot.focusApp ?? 0) : 0;
  const rowLabel = isApp ? "Favorite Apps" : KIND === "playlist" ? "Playlists" : "Collections";

  document.getElementById("root").innerHTML = `
    <div class="stage">
      <div class="backdrop${shot.dim ? " dim" : ""}" style="${bg(shot.backdrop)}"></div>
      ${nav()}
      <div class="badge">${esc(shot.badge)}</div>
      <div class="info">${shot.info}</div>
      <div class="rows">
        <div class="row-label">${esc(rowLabel)}</div>
        <div class="cards">${rowCards(KIND, focusIndex)}</div>
      </div>
    </div>`;
}

render();
