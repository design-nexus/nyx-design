// Builders shared by every app on the revamp page, on top of kit.js: rows, tiles, cards,
// settings rows, tables, art, avatars, progress, charts, menus, dialogs, toasts and empty
// states. Everything returns HTML; nothing runs until a page is mounted.
"use strict";

const SW = ["blue", "violet", "pink", "red", "coral", "amber", "green", "teal", "graphite"];
const swc = (i) => `var(--sw-${typeof i === "number" ? SW[i % SW.length] : i})`;
const hash = (s) => [...String(s)].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);

/** An avatar with initials, coloured from the name. */
const av = (name, size = 28) => {
  const ini = name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
  return `<span class="avatar" style="width:${size}px;height:${size}px;font-size:${Math.round(size * 0.4)}px;background:${swc(hash(name))}">${ini}</span>`;
};

/** Placeholder art: a soft gradient from the seed, with an optional caption or icon. */
const art = (seed, { w = "100%", h = "100%", r = 8, label = "", ic = "", cls = "" } = {}) => {
  const n = hash(seed), a = SW[n % 8], b = SW[(n >>> 3) % 8], ang = n % 360;
  return `<div class="art ${cls}" style="width:${typeof w === "number" ? w + "px" : w};height:${typeof h === "number" ? h + "px" : h};border-radius:${r}px;background:linear-gradient(${ang}deg, color-mix(in srgb, var(--sw-${a}) 70%, #000), color-mix(in srgb, var(--sw-${b}) 55%, #111))">${ic ? icon(ic) : ""}${label ? `<span>${label}</span>` : ""}</div>`;
};

/** A list row: lead (html), title, sub, meta (right), and flags. */
const lrow = ({ lead = "", title, sub = "", meta = "", end = "", sel = false, unread = false, cls = "" }) =>
  `<div class="lrow ${sel ? "sel" : ""} ${unread ? "unread" : ""} ${cls}">${lead}<div class="tx"><div class="t1"><span class="tt">${title}</span>${meta ? `<span class="meta">${meta}</span>` : ""}</div>${sub ? `<div class="t2">${sub}</div>` : ""}</div>${end}</div>`;

/** A page bar: title, subtitle, and controls on the right. */
const pbar2 = (title, sub = "", end = "") => `<div class="pbar"><span class="t">${title}</span>${sub ? `<span class="s">${sub}</span>` : ""}<span class="sp"></span>${end}</div>`;

/** A dropdown button. */
const dd = (label, ic = "") => `<span class="dd">${ic ? icon(ic) : ""}${label}${icon("chev-d")}</span>`;

/** A settings card: [title, desc, control] rows; a heading above it. */
const setcard = (heading, rows, note = "") => `${heading ? `<div class="gtitle">${heading}${note ? `<span class="note">${note}</span>` : ""}</div>` : ""}<div class="card">${rows.map(([t, d, c]) => `<div class="opt"><div class="opt-text"><div>${t}</div>${d ? `<div class="d">${d}</div>` : ""}</div>${c || ""}</div>`).join("")}</div>`;

/** A table: columns [label, width?] and rows of cells. */
const tbl = (cols, rows, o = {}) => `<div class="tbl ${o.cls || ""}"><div class="th">${cols.map(([c, w]) => `<span style="${w ? `flex:0 0 ${w}` : "flex:1"}">${c}</span>`).join("")}</div>${rows.map((r, i) => `<div class="tr ${o.sel === i ? "sel" : ""}">${r.map((c, j) => `<span style="${cols[j][1] ? `flex:0 0 ${cols[j][1]}` : "flex:1"}">${c}</span>`).join("")}</div>`).join("")}</div>`;

/** Smart tiles (Design 2.0): [key, icon, count, name, swatch]. */
const tiles = (items, on) => `<div class="stiles">${items.map(([k, ic, n, nm, c]) => `<div class="stile ${on === k ? "on" : ""}" style="--tc:${swc(c)}"><div class="r1"><span class="ic">${icon(ic)}</span><span class="n">${n}</span></div><span class="nm">${nm}</span></div>`).join("")}</div>`;

/** A progress bar, 0–100. */
const prog = (pct, c = "") => `<span class="prog ${c}"><b style="width:${pct}%"></b></span>`;

/** A sparkline from values (0–1), as an inline SVG. */
const spark = (vals, { w = 120, h = 32, c = "var(--accent)", fill = true } = {}) => {
  const step = w / (vals.length - 1), pts = vals.map((v, i) => `${(i * step).toFixed(1)},${(h - v * (h - 2) - 1).toFixed(1)}`);
  return `<svg class="spark" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${fill ? `<path d="M0,${h} L${pts.join(" L")} L${w},${h}Z" fill="${c}" opacity=".14"/>` : ""}<path d="M${pts.join(" L")}" fill="none" stroke="${c}" stroke-width="1.6" stroke-linejoin="round"/></svg>`;
};
/** Bars from values (0–1). */
const bars = (vals, { h = 60, c = "var(--accent)", gap = 3 } = {}) => `<div class="bars" style="height:${h}px;gap:${gap}px">${vals.map((v) => `<b style="height:${Math.max(2, v * 100)}%;background:${c}"></b>`).join("")}</div>`;
/** A ring gauge, 0–100. */
const ring = (pct, { size = 64, c = "var(--accent)", label = "" } = {}) => {
  const r = size / 2 - 5, L = 2 * Math.PI * r;
  return `<span class="ring" style="width:${size}px;height:${size}px"><svg viewBox="0 0 ${size} ${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="var(--field)" stroke-width="6"/><circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="${c}" stroke-width="6" stroke-linecap="round" stroke-dasharray="${(L * pct) / 100} ${L}" transform="rotate(-90 ${size / 2} ${size / 2})"/></svg><b>${label || pct + "%"}</b></span>`;
};

/** A menu at x,y: items are [icon, label, key?, cls?] or "-" or ["#", heading]. */
const menu = (x, y, items, w = 256) => `<div class="menu pop" style="left:${x}px;top:${y}px;width:${w}px">${items.map((it) => it === "-" ? '<div class="ms"></div>' : it[0] === "#" ? `<div class="mh">${it[1]}</div>` : `<div class="mi ${it[3] || ""}">${it[0] ? icon(it[0]) : '<i></i>'}<span>${it[1]}</span>${it[2] ? `<span class="k">${it[2]}</span>` : ""}</div>`).join("")}</div>`;

/** A dialog over a veil. */
const dialog = (title, text, buttons = [], body = "", w = 440) => `<div class="veil"><div class="dlg pop" style="width:${w}px"><div class="h">${title}</div>${text ? `<p>${text}</p>` : ""}${body}<div class="bt">${buttons.join("")}</div></div></div>`;

/** A toast at the foot of the page. */
const toast = (text, action = "") => `<div class="toast2">${icon("check-c")}<span>${text}</span>${action ? btn(action) : ""}</div>`;

/** An empty state. */
const empty = (ic, title, text, buttons = []) => `<div class="empty2">${icon(ic)}<b>${title}</b><span>${text}</span>${buttons.length ? `<div class="bts">${buttons.join("")}</div>` : ""}</div>`;

/** A narrow-only or wide-only wrapper. */
const wideOnly = (h) => `<span class="wide-only">${h}</span>`;

/** The whole window with the usual header: o = { icon, name, sub, center, start, end, side, page, over }. */
const appwin = (o) => win({
  hdr: header({ icon: o.icon, name: o.name + (o.sub ? `<span class="app-sub"><span class="sep">·</span>${o.sub}</span>` : ""), start: o.start || "", center: o.center || "", end: o.end || "" }),
  side: o.side || "", page: o.page, over: o.over || "",
});

/** The same window with its sidebar as the icon rail, at any width. */
const railed = (html) => html.replace('<div class="win ', '<div class="win rail ');
