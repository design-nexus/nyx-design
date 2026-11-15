// TV Manager shell (Manager A: TVs in the sidebar) and shared bits for overhaul pages.
"use strict";

const TM_ICONS = {
  tvi: '<rect x="2.5" y="5" width="19" height="12.5" rx="2"/><path d="M8 21h8M12 17.5V21"/>',
  pairc: '<rect x="3" y="6.5" width="18" height="11" rx="2.5"/><path d="M7 12h.01M10.5 12h.01M14 12h.01M17.5 12h.01" stroke-width="2.4"/>',
  restore: '<path d="M3.5 12a8.5 8.5 0 1 0 2.5-6"/><path d="M3.5 4v4.5H8"/>',
  wrench: '<path d="M14.5 6.5a4 4 0 0 0 5 5L21 13l-8 8-3-3 8-8-1.5-1.5a4 4 0 0 1-5-5L13 2z"/>',
  gauge: '<path d="M4 18a8 8 0 1 1 16 0"/><path d="m12 14 4-5"/>',
  broom: '<path d="M14 4l6 6M12 6l6 6-7 7H5v-6z"/><path d="M8 19l-3-3"/>',
  package: '<path d="M12 3 3.5 7.5v9L12 21l8.5-4.5v-9z"/><path d="M3.5 7.5 12 12l8.5-4.5M12 12v9"/>',
  rows: '<rect x="3" y="4" width="18" height="5" rx="1.5"/><rect x="3" y="11" width="18" height="5" rx="1.5"/><path d="M3 20h10"/>',
  radar: '<circle cx="12" cy="12" r="2"/><path d="M12 4a8 8 0 0 1 8 8M12 1a11 11 0 0 1 11 11"/><path d="M12 7a5 5 0 0 1 5 5"/>',
};

const TVS = [
  { n: "Bedroom TV", m: "TCL 55Q570G", ip: "192.168.1.237", on: true },
  { n: "Living Room", m: "TCL 75Q570G", ip: "192.168.1.41", on: false },
];

const NAV_SECTIONS = [
  ["overview", "tvi", "Overview"],
  ["install", "download", "Install and update"],
  ["launcher", "home", "Launcher"],
  ["backups", "archive", "Backups"],
  ["diagnostics", "gauge", "Diagnostics"],
  ["debloat", "broom", "Debloat", "Advanced"],
];

const SECTION_OF = {
  add: "add", overview: "overview", install: "install",
  launcher: "launcher", replace: "launcher", verify: "launcher", restore: "launcher", repair: "launcher",
  backups: "backups", diagnostics: "diagnostics", debloat: "debloat", "debloat-confirm": "debloat",
  settings: "overview",
};

function sideA(screen) {
  const act = SECTION_OF[screen] || screen;
  const tvs = TVS.map((t, i) =>
    `<div class="navx ${i === 0 && act !== "add" ? "active" : ""}"><span class="cdot" style="background:${t.on ? "var(--success)" : "var(--text-tertiary)"}"></span><span>${t.n}</span><span class="sub">${t.on ? "" : "Offline"}</span></div>`
  ).join("");
  return grp("Televisions", true, icon("plus"), "accent") + tvs +
    navx("plus", "Add a TV", { active: act === "add" }) +
    grp("Bedroom TV", false, "", "teal") +
    NAV_SECTIONS.map(([k, ic, t, sub]) => navx(ic, t, { active: act === k, sub })).join("") +
    `<div class="foot"><i data-i="check-c" class="ok"></i>adb 1.0.41 · 1 device</div>`;
}

const hdrA = () => header({ icon: "tvi", name: "TV Manager", center: "", end: ib("refresh", "Refresh (F5)") + ib("sliders", "Settings (Ctrl+,)") });

const tpage = (screen, page, over = "") => {
  const w = win({ hdr: hdrA(), side: sideA(screen), page: `<div class="tm-body">${page}</div>`, over });
  return NARROW ? railed(w) : w;
};

const PKGS = [
  ["opt", "TCL Home Channel", "com.tcl.example.channel", true],
  ["opt", "TCL Weather widget", "com.tcl.example.weather", true],
  ["opt", "Google TV recommendations", "com.google.android.example.recs", true],
  ["dep", "TCL Magic Connect", "com.tcl.example.magicconnect", false],
  ["dep", "TCL Voice assistant", "com.tcl.example.voice", false],
  ["pro", "Google Play Store", "com.android.vending", false],
  ["pro", "Chromecast built-in", "com.google.android.apps.mediashell", false],
  ["pro", "System update", "com.tcl.example.ota", false],
];
