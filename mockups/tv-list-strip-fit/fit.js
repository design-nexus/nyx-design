// Compact list-focus strips that stay above Home ROWS_TOP (472 px). No row push.
const Q = new URLSearchParams(location.search);
const KIND = Q.get("kind") || "playlist";
const VARIANT = Q.get("variant") || "a";
document.documentElement.dataset.theme = Q.get("theme") || "dark";

const D = window.NYX;
const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const bg = (src) => (src ? `background-image:url('${src}')` : "");

const COL = D.collections[0];
const COL_KIDS = (COL.items || D.recentMovies).slice(0, 4);
const PLAY = {
  title: "AI",
  count: 12,
  summary: "Machines, minds, and the line between them — sci‑fi that asks what we become.",
};
const PLAY_KIDS = D.recentMovies.slice(0, 4);

const NAMES = {
  a: "A · Compact text",
  b: "B · Side filmstrip",
  c: "C · Lead poster",
  d: "D · Tiny ticks",
  e: "E · Title + count",
};

function nav() {
  return `<div class="nav">
    <div class="brand">Nyx <small>TV</small></div>
    <div class="tabs">
      <div class="tab on">Home</div>
      <div class="tab">Movies</div>
      <div class="tab">TV Shows</div>
      <div class="tab">Apps</div>
    </div>
    <div class="end"><span>⌕</span><span>⚙</span><span>1:55</span></div>
  </div>`;
}

function rowCards(kind) {
  // Playlist/collection tiles: use list posters when present, else movie posters.
  const list = kind === "playlist"
    ? D.recentMovies.slice(0, 6)
    : D.collections.slice(0, 6);
  return list.map((c, i) => {
    const art = c.poster || c.posters?.[0] || D.recentMovies[i]?.poster;
    return `<div class="card${i === 0 ? " focus" : ""}" style="${bg(art)}"></div>`;
  }).join("");
}

function strip(kind, variant) {
  const isPlaylist = kind === "playlist";
  const listTitle = isPlaylist ? PLAY.title : COL.title;
  const count = isPlaylist ? `${PLAY.count} titles` : `${COL.count || 12} titles`;
  const summary = isPlaylist ? PLAY.summary : (COL.summary || "A curated set from your library.");
  const kids = isPlaylist ? PLAY_KIDS : COL_KIDS;
  const first = kids[0] || D.recentMovies[0];
  // Hold a calmer featured backdrop for text-led variants; C can use first-title art.
  const holdBg = D.heroes[0].backdrop || first.backdrop || first.poster;
  const label = isPlaylist ? "PLAYLIST" : "COLLECTION";
  const rowLabel = isPlaylist ? "Playlists" : "Collections";

  let body = "";
  let backdrop = holdBg;

  if (variant === "a") {
    body = `
      <div class="eyebrow">${label}</div>
      <div class="title">${esc(listTitle)}</div>
      <div class="meta">${esc(count)}</div>
      <div class="summary">${esc(summary)}</div>`;
  } else if (variant === "b") {
    body = `
      <div class="copy">
        <div class="eyebrow">${label}</div>
        <div class="title">${esc(listTitle)}</div>
        <div class="meta">${esc(count)}</div>
      </div>
      <div class="film">${kids.map((c) => `<div class="p" style="${bg(c.poster)}"></div>`).join("")}</div>`;
  } else if (variant === "c") {
    backdrop = first.backdrop || first.poster || holdBg;
    body = `
      <div class="lead" style="${bg(first.poster)}"></div>
      <div class="copy">
        <div class="eyebrow">${esc(listTitle)}</div>
        <div class="title">${esc(first.title)}</div>
        <div class="meta">${esc([first.year, (first.genres || []).slice(0, 2).join(", ")].filter(Boolean).join("  ·  "))}</div>
        <div class="summary">${esc(first.summary || summary)}</div>
      </div>`;
  } else if (variant === "d") {
    body = `
      <div class="eyebrow">${label}</div>
      <div class="title">${esc(listTitle)}</div>
      <div class="meta">${esc(count)}</div>
      <div class="ticks">${kids.map((c) => `<div class="p" style="${bg(c.poster)}"></div>`).join("")}</div>`;
  } else {
    body = `
      <div class="eyebrow">${label}</div>
      <div class="title">${esc(listTitle)}</div>
      <div class="chip">${esc(count)}</div>`;
  }

  return {
    badge: NAMES[variant],
    backdrop,
    body,
    rowLabel,
    variantClass: `strip v-${variant}`,
  };
}

function render() {
  const shot = strip(KIND, VARIANT);
  document.getElementById("root").innerHTML = `
    <div class="stage">
      <div class="backdrop" style="${bg(shot.backdrop)}"></div>
      ${nav()}
      <div class="${shot.variantClass}">${shot.body}</div>
      <div class="rows">
        <div class="row-label">${esc(shot.rowLabel)}</div>
        <div class="cards">${rowCards(KIND)}</div>
      </div>
    </div>`;
}

render();
