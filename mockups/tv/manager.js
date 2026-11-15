// Nyx TV Manager mockups, on the revamp kit (Design 2.0 desktop window).
// manager.html?direction=a|b&screen=<name>&theme=dark|light[&w=800]
// TVs, firmware, package names and measurements here are samples, not audit results.
"use strict";
const MD = Q.get("direction") || "a";
Object.assign(KI, {
  tvi: '<rect x="2.5" y="5" width="19" height="12.5" rx="2"/><path d="M8 21h8M12 17.5V21"/>',
  pairc: '<rect x="3" y="6.5" width="18" height="11" rx="2.5"/><path d="M7 12h.01M10.5 12h.01M14 12h.01M17.5 12h.01" stroke-width="2.4"/>',
  restore: '<path d="M3.5 12a8.5 8.5 0 1 0 2.5-6"/><path d="M3.5 4v4.5H8"/>',
  wrench: '<path d="M14.5 6.5a4 4 0 0 0 5 5L21 13l-8 8-3-3 8-8-1.5-1.5a4 4 0 0 1-5-5L13 2z"/>',
  gauge: '<path d="M4 18a8 8 0 1 1 16 0"/><path d="m12 14 4-5"/>',
  broom: '<path d="M14 4l6 6M12 6l6 6-7 7H5v-6z"/><path d="M8 19l-3-3"/>',
  package: '<path d="M12 3 3.5 7.5v9L12 21l8.5-4.5v-9z"/><path d="M3.5 7.5 12 12l8.5-4.5M12 12v9"/>',
  rows: '<rect x="3" y="4" width="18" height="5" rx="1.5"/><rect x="3" y="11" width="18" height="5" rx="1.5"/><path d="M3 20h10"/>',
});

const TVS = [
  { n: "Living Room", m: "TCL 75Q570G", ip: "192.168.1.41", on: true },
  { n: "Bedroom", m: "TCL 55Q570G", ip: "192.168.1.57", on: false },
];
const SECTIONS = [
  ["overview", "tvi", "Overview"],
  ["install", "download", "Install and update"],
  ["replace", "home", "Launcher"],
  ["backups", "archive", "Backups"],
  ["diagnostics", "gauge", "Diagnostics"],
  ["debloat", "broom", "Debloat", "Advanced"],
];
const SECTION_OF = { add: "add", overview: "overview", install: "install", replace: "replace", verify: "replace", restore: "replace", repair: "replace", backups: "backups", diagnostics: "diagnostics", debloat: "debloat", "debloat-confirm": "debloat" };

function sideA(screen) {
  const act = SECTION_OF[screen];
  const tvs = TVS.map((t, i) => `<div class="navx ${i === 0 && act !== "add" ? "active" : ""}"><span class="cdot" style="background:${t.on ? "var(--success)" : "var(--text-tertiary)"}"></span><span>${t.n}</span><span class="sub">${t.on ? "" : "Offline"}</span></div>`).join("");
  return grp("Televisions", true, icon("plus"), "accent") + tvs + navx("plus", "Add a TV", { active: act === "add" }) +
    grp("Living Room", false, "", "teal") + SECTIONS.map(([k, ic, t, sub]) => navx(ic, t, { active: act === k, sub })).join("") +
    `<div class="foot"><i data-i="check-c" class="ok"></i>adb 35.0.2 · bundled</div>`;
}
const hdrA = (title) => header({ icon: "tvi", name: "TV Manager", center: "", end: ib("refresh", "Refresh (F5)") });
const hdrB = () => header({ icon: "tvi", name: "TV Manager", center: `<span class="dd">${'<span class="dot on" style="margin-right:4px"></span>'}Living Room · TCL 75Q570G${icon("chev-d")}</span>`, end: ib("plus", "Add a TV") + ib("refresh", "Refresh (F5)") });
const winA = (screen, page, over = "") => win({ hdr: hdrA(), side: sideA(screen), page, over });
const winB = (page, over = "") => win({ hdr: hdrB(), side: "", page, over });

const stepper = (steps, on) => `<div class="stepper">${steps.map((s, i) => `${i ? '<span class="ln"></span>' : ""}<span class="st ${i < on ? "done" : i === on ? "on" : ""}"><b>${i < on ? "✓" : i + 1}</b>${s}</span>`).join("")}</div>`;
const checkRow = (state, t, sub = "", m = "") => {
  const ic = { ok: ["check-c", "ok"], warn: ["alert", "warn"], bad: ["x", "bad"], wait: ["clock", "dim2"] }[state];
  return `<div class="check">${icon(ic[0], ic[1])}<div class="tx">${t}${sub ? `<small>${sub}</small>` : ""}</div>${m ? `<span class="m">${m}</span>` : ""}</div>`;
};

// ---------- Pieces both directions share ----------
const tvFacts = () => `<div class="kv">
  <span>Model</span><span>TCL 75Q570G</span>
  <span>Android TV</span><span>12 (API 31) · Google TV</span>
  <span>Firmware</span><span class="mono">V8-T652T01-LF1V312.0</span>
  <span>Connection</span><span>Wireless debugging · 192.168.1.41:37215 · 6 ms</span>
  <span>Nyx TV</span><span>0.1.0 · signed · update 0.1.1 available</span>
  <span>Home app</span><span>Nyx TV <span class="dim2">(stock launcher disabled, restorable)</span></span></div>`;

const discovered = () => `<div class="card">
  ${lrow({ lead: `<span class="dot on"></span>`, title: "Living Room TV", sub: "TCL 75Q570G · 192.168.1.41 · wireless debugging, pairing available", end: btn("Pair", "primary") , sel: true })}
  ${lrow({ lead: `<span class="dot on"></span>`, title: "Bedroom TV", sub: "TCL 55Q570G · 192.168.1.57 · network debugging on port 5555", end: btn("Connect") })}
  ${lrow({ lead: `<span class="dot off"></span>`, title: "Chromecast with Google TV", sub: "192.168.1.63 · debugging is off on this device", end: `<span class="dim2">Turn on debugging first</span>` })}</div>`;
const pairCard = () => `<div class="mcard"><h3>${icon("pairc")}Pair with Living Room TV</h3>
  <p>On the TV: Settings → System → Developer options → Wireless debugging → Pair device with pairing code. Type the six digits it shows.</p>
  <div style="display:flex;align-items:center;gap:16px;margin-top:12px"><div class="pair"><span>4</span><span>8</span><span>3</span><span class="focus">|</span><span></span><span></span></div>
  <div class="field" style="width:220px"><span class="mono">192.168.1.41:</span><span class="ph mono">pairing port</span></div></div>
  <div class="acts">${btn("Pair", "primary")}${btn("Cancel", "ghost")}</div></div>`;
const manualCard = () => `<div class="mcard"><h3>${icon("network")}Enter an address</h3><p>For a TV on another network, or with discovery blocked.</p>
  <div style="display:flex;gap:8px;margin-top:10px"><div class="field" style="flex:1"><span class="ph">192.168.1.x:5555</span></div>${btn("Connect")}</div></div>`;

const releases = (installing) => `<div class="card">
  ${lrow({ lead: icon("package"), title: "Nyx TV 0.1.1", sub: "Latest · 6.8 MB · signed by design-nexus · SHA-256 checked", meta: "Nov 12", end: installing ? "" : btn("Update", "primary"), sel: true })}
  ${lrow({ lead: icon("package"), title: "Nyx TV 0.1.0", sub: "Installed on this TV · 6.7 MB", meta: "Nov 2", end: `<span class="dim2">Installed</span>` })}
  ${lrow({ lead: icon("file"), title: "Install from a file…", sub: "An APK you built or downloaded; its signature is checked against releases" })}</div>
  ${installing ? `<div class="mcard"><h3>${icon("download")}Updating Living Room TV</h3>
    <div style="display:flex;align-items:center;gap:12px;margin-top:10px">${prog(64)}<span class="dim2" style="white-space:nowrap">Pushing APK · 4.3 of 6.8 MB</span></div>
    <div class="term" style="margin-top:12px"><b>$</b> adb install -r --no-incremental nyx-tv-0.1.1.apk<br>Performing Streamed Install<br>…</div>
    <p style="margin-top:10px">Settings, rows and Plex sign-in stay on the TV. If the new version doesn't start, the Manager puts 0.1.0 back.</p></div>` : ""}`;

const changes = () => tbl([["What", ""], ["Now", "150px"], ["After", "190px"]], [
  [`<span>Home app <span class="dim2 mono">android.app.role.HOME</span></span>`, "Google TV", "<b>Nyx TV</b>"],
  [`<span class="mono">com.google.android.apps.tv.launcherx</span>`, "Enabled", `<span class="warn">Disabled for user 0</span>`],
  [`<span class="mono">com.google.android.tungsten.setupwraith</span>`, "Enabled", "Unchanged"],
  [`<span>Play Store, Chromecast, inputs, updates</span>`, "Enabled", "Unchanged"],
]);
const snapshotNote = () => `<div class="banner2">${icon("history")}<div class="tx"><b>The TV's current state is saved first</b><span>Snapshot for TCL 75Q570G, firmware V8-T652T01-LF1V312.0 · used by Restore and Repair</span></div></div>`;
const warn = () => `<div class="banner2 warn">${icon("alert")}<div class="tx"><b>This changes system settings on the TV</b><span>Nothing is uninstalled. Wireless debugging stays on so you can restore from this computer.</span></div></div>`;

const verifyRows = () => `<div class="card">
  ${checkRow("ok", "Nyx TV starts", "Cold start measured over adb", "412 ms")}
  ${checkRow("ok", "Home button opens Nyx TV", "Sent KEYCODE_HOME from three apps")}
  ${checkRow("ok", "Stock launcher isn't running", "No process for com.google.android.apps.tv.launcherx")}
  ${checkRow("ok", "Settings, Play Store and Plex open")}
  ${checkRow("ok", "Wireless debugging still connected")}
  ${checkRow("wait", "Restart test", "The TV restarts and should come back to Nyx TV", btn("Restart TV", "sm"))}</div>`;

const snapshots = () => `<div class="card">
  ${lrow({ lead: icon("history"), title: "Before Nyx TV · Nov 14, 13:02", sub: "Firmware V8-T652T01-LF1V312.0 · Google TV home, 2 packages", meta: "Matches this TV", sel: true })}
  ${lrow({ lead: icon("history"), title: "Before debloat · Nov 14, 13:40", sub: "Firmware V8-T652T01-LF1V312.0 · 3 packages", meta: "Matches this TV" })}
  ${lrow({ lead: icon("history"), title: "Bedroom TV · Nov 10", sub: "TCL 55Q570G · different TV: can't be applied here", meta: `<span class="dim2">Other TV</span>` })}</div>`;

const repairRows = () => `<div class="card">
  ${checkRow("warn", "Firmware changed", "V8-T652T01-LF1V312.0 → V8-T652T01-LF1V318.1, installed Nov 13")}
  ${checkRow("bad", "Google TV home is enabled again", "The update turned com.google.android.apps.tv.launcherx back on")}
  ${checkRow("ok", "Nyx TV is installed and starts", "", "398 ms")}
  ${checkRow("ok", "Home role still lists Nyx TV")}</div>`;

const backupRows = () => `<div class="card">
  ${lrow({ lead: icon("rows"), title: "Layout and preferences", sub: "Rows, favorites, hidden apps, theme · 14 KB · Nov 14", end: btn("Export…", "sm"), sel: true })}
  ${lrow({ lead: icon("history"), title: "System snapshots", sub: "2 snapshots for this TV · only restored to the same model and firmware", end: btn("Export…", "sm") })}
  ${lrow({ lead: icon("import"), title: "Import a backup…", sub: "From a file or another TV" })}</div>
  <div class="mcard"><h3>${icon("copy")}Copy layout to another TV</h3><p>Sends rows, favorites and theme. Apps the other TV doesn't have are left out.</p>
  <div class="acts">${btn("Copy to Bedroom TV", "primary")}<span class="dim2" style="align-self:center">Bedroom TV is offline · will copy when it connects</span></div></div>
  <div class="banner2">${icon("lock")}<div class="tx"><b>Plex sign-in is never in a backup</b><span>Sign in to Plex again on the other TV.</span></div></div>`;

const diagCards = () => `<div class="cardgrid" style="--cw:150px">
  <div class="kcard"><span class="k">${icon("gauge")}Memory (PSS)</span><span class="v">54 MB</span>${spark([.5, .52, .55, .5, .48, .49, .51, .5, .47, .48], { w: 130, h: 26 })}</div>
  <div class="kcard"><span class="k">${icon("spark")}CPU when idle</span><span class="v">0.3%</span>${spark([.1, .05, .08, .04, .03, .05, .02, .03, .02, .03], { w: 130, h: 26 })}</div>
  <div class="kcard"><span class="k">${icon("clock")}Cold start</span><span class="v">780 ms</span><span class="s">Warm 210 ms</span></div>
  <div class="kcard"><span class="k">${icon("tvi")}Google TV home</span><span class="v">Not running</span><span class="s">Was 182 MB PSS before</span></div></div>`;
const logs = () => `<div class="term"><b>13:41:02</b> NyxTV/Start  cold start 780 ms (cache 31 ms, first frame 612 ms)<br>
<b>13:41:03</b> NyxTV/Plex   connected Home Server via local 192.168.1.20 · token ••••••••<br>
<b>13:41:03</b> NyxTV/Art    memory cache 18.2/32 MB · disk 212/512 MB<br>
<b>13:52:40</b> NyxTV/Plex   <span class="red">Home Server unreachable · retry in 120 s</span><br>
<b>13:54:41</b> NyxTV/Plex   reconnected · 3 rows refreshed</div>`;

const PKGS = [
  ["opt", "TCL Home Channel", "com.tcl.example.channel", "Promoted content row service", "Low", true],
  ["opt", "TCL Weather widget", "com.tcl.example.weather", "Weather overlay; unused with Nyx TV", "Low", true],
  ["opt", "Google TV recommendations", "com.google.android.example.recs", "Feeds the stock launcher's rows", "Low", true],
  ["dep", "TCL Magic Connect", "com.tcl.example.magicconnect", "Phone casting on some firmware", "Medium"],
  ["dep", "TCL Voice assistant", "com.tcl.example.voice", "Far-field voice on some models", "Medium"],
  ["unk", "com.tcl.example.svc3", "com.tcl.example.svc3", "No description yet", "Unknown"],
  ["pro", "Google Play Store", "com.android.vending", "Apps and updates", "Protected"],
  ["pro", "Chromecast built-in", "com.google.android.apps.mediashell", "Casting", "Protected"],
  ["pro", "System update", "com.tcl.example.ota", "Firmware updates", "Protected"],
];
const CLS = { opt: ["opt", "Verified optional", "check-c"], dep: ["dep", "Device dependent", "alert"], unk: ["unk", "Unknown", "info"], pro: ["pro", "Protected", "lock"] };
function pkgTable(checked = true) {
  const groups = ["opt", "dep", "unk", "pro"];
  return groups.map((g) => {
    const rows = PKGS.filter((p) => p[0] === g);
    const [c, label, ic] = CLS[g];
    return `<div class="grpbar"><span class="cls ${c}">${icon(ic)}${label}</span><span class="n">${rows.length}</span><span class="sp"></span>${g === "opt" ? `<span class="dim2">Offered</span>` : g === "pro" ? `<span class="dim2">Never changed</span>` : `<span class="dim2">Not offered</span>`}</div>
      <div class="card">${rows.map((p) => `<div class="opt" style="min-height:40px"><span class="cbx sq ${g === "opt" && checked && p[5] ? "done" : ""}" style="${g === "opt" ? "" : "opacity:.35"}">${g === "opt" && checked && p[5] ? icon("check") : ""}</span>
        <div class="opt-text"><div>${p[1]} <span class="dim2 mono wide-only" style="margin-left:6px">${p[2]}</span></div><div class="d">${p[3]}</div></div>
        <span class="dim2 wide-only" style="width:80px;text-align:right">${p[4]}</span></div>`).join("")}</div>`;
  }).join("");
}
const debloatHead = () => `<div class="banner2 warn">${icon("alert")}<div class="tx"><b>Optional, and not needed for Nyx TV</b><span>Packages are disabled, never removed. Each one can be turned back on here. Catalog for TCL 75Q570G · V8-T652T01-LF1V312.0.</span></div></div>`;
const measureTable = (after) => tbl([["", ""], ["Before", "120px"], ["After", "120px"]], [
  ["Free memory", "1.21 GB", after ? `<b class="ok">1.36 GB</b>` : `<span class="dim2">Measured after</span>`],
  ["Running background services", "41", after ? `<b class="ok">36</b>` : `<span class="dim2">—</span>`],
  ["Nyx TV cold start", "780 ms", after ? "760 ms" : `<span class="dim2">—</span>`],
]);

// ---------- Direction A: TV list in the sidebar, a page per section ----------
const A = {
  add: () => winA("add", pbar2("Add a TV", "Searching the network…", ib("refresh")) + `<div class="mbody">${discovered()}<div class="mrow">${pairCard()}${manualCard()}</div></div>`),
  overview: () => winA("overview", pbar2("Living Room", "TCL 75Q570G · connected", btn("Update to 0.1.1", "primary", "download")) + `<div class="mbody">
    <div class="mrow"><div class="mcard" style="flex:1.4"><h3>${icon("tvi")}This TV</h3>${tvFacts()}</div>
      <div class="mcard"><h3>${icon("home")}Launcher</h3><p>Nyx TV is the home app. Google TV home is disabled and can be restored.</p>
      <div class="acts">${btn("Verify", "", "check-c")}${btn("Restore", "", "restore")}</div></div></div>
    ${diagCards()}</div>`),
  install: () => winA("install", pbar2("Install and update", "Living Room") + `<div class="mbody">${releases(true)}</div>`),
  replace: () => winA("replace", pbar2("Set Nyx TV as the home app", "Living Room") + `<div class="mbody">${warn()}<div class="card">${changes()}</div>${snapshotNote()}
    <div style="display:flex;gap:8px;justify-content:flex-end">${btn("Cancel", "ghost")}${btn("Save snapshot and set Nyx TV", "primary")}</div></div>`),
  verify: () => winA("verify", pbar2("Verify", "Living Room · Nyx TV is the home app", btn("Run again", "", "refresh")) + `<div class="mbody">${verifyRows()}</div>`),
  restore: () => winA("restore", pbar2("Restore the original launcher", "Living Room") + `<div class="mbody">${snapshots()}<div class="mcard"><h3>${icon("restore")}What Restore does</h3><p>Turns Google TV home back on and makes it the home app, as in the snapshot. Nyx TV stays installed; remove it from Install and update.</p>
    <div class="acts">${btn("Restore Google TV home", "primary")}${btn("Restore and remove Nyx TV", "dtext")}</div></div></div>`),
  repair: () => winA("repair", pbar2("Repair after an update", "Living Room") + `<div class="mbody"><div class="banner2 bad">${icon("alert")}<div class="tx"><b>Home is set to Google TV again</b><span>A firmware update changed the launcher settings. Repair takes a new snapshot first.</span></div>${btn("Repair", "primary")}</div>${repairRows()}</div>`),
  backups: () => winA("backups", pbar2("Backups", "Living Room") + `<div class="mbody">${backupRows()}</div>`),
  diagnostics: () => winA("diagnostics", pbar2("Diagnostics", "Living Room · live", btn("Export report…", "", "export")) + `<div class="mbody">${diagCards()}<div class="sechead">Recent log <span class="more">Tokens and addresses are redacted in exports</span></div>${logs()}</div>`),
  debloat: () => winA("debloat", pbar2("Debloat", "Living Room · advanced", btn("Disable 3 packages", "primary")) + `<div class="mbody" style="gap:6px">${debloatHead()}${pkgTable()}</div>`),
  "debloat-confirm": () => winA("debloat-confirm", pbar2("Debloat", "Living Room · advanced") + `<div class="mbody" style="gap:6px">${debloatHead()}${pkgTable()}</div>`,
    dialog("Disable 3 packages?", "TCL Home Channel, TCL Weather widget and Google TV recommendations. A snapshot is saved first; each one can be turned back on.", [btn("Cancel", "ghost"), btn("Disable", "primary")], `<div class="card" style="margin-top:12px">${measureTable(false)}</div>`, 480)),
};

// ---------- Direction B: one TV at a time, guided flows ----------
const flow = (steps, on, title, sub, body, foot) => winB(`<div class="mbody center"><div class="mcol">${stepper(steps, on)}<div><div class="title2">${title}</div><div class="dim2" style="margin-top:4px">${sub}</div></div>${body}
  <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:4px">${foot}</div></div></div>`);
const SETUP = ["Find the TV", "Install", "Set as home", "Verify"];
const B = {
  add: () => flow(["Find the TV", "Pair", "Done"], 0, "Find your TV", "TVs with debugging on show up here", discovered() + manualCard(), btn("Back", "ghost") + btn("Pair Living Room TV", "primary")),
  overview: () => winB(`<div class="mbody">
    <div class="mrow" style="align-items:stretch"><div class="mcard" style="display:flex;gap:18px;align-items:center;flex:1.5"><div class="tvart wide-only" style="width:190px;height:112px;flex:none"></div>
      <div style="min-width:0"><div class="big">Living Room</div><div class="dim2">TCL 75Q570G · Nyx TV 0.1.0 is the home app</div>
      <div style="display:flex;gap:6px;margin-top:10px;flex-wrap:wrap">${chip("Connected", "acc", "check-c")}${chip("Stock launcher disabled")}${chip("Update 0.1.1")}</div></div></div>
    <div class="mcard"><h3>${icon("spark")}Right now</h3><div class="kv" style="grid-template-columns:110px 1fr"><span>Memory</span><span>54 MB</span><span>Idle CPU</span><span>0.3%</span><span>Cold start</span><span>780 ms</span></div></div></div>
    <div class="cardgrid" style="--cw:200px">
      ${[["download", "Update Nyx TV", "0.1.1 · 6.8 MB · signed"], ["check-c", "Verify the launcher", "Home button, restart, apps"], ["restore", "Restore Google TV home", "From the Nov 14 snapshot"], ["archive", "Back up layout", "Rows, favorites, theme"], ["gauge", "Diagnostics", "Memory, CPU, logs, report"], ["broom", "Debloat", "Advanced · optional"]]
        .map(([ic, t, s], i) => `<div class="kcard" style="${i === 0 ? "box-shadow:inset 0 0 0 1.5px color-mix(in srgb,var(--accent) 55%,transparent)" : ""}"><span class="k">${icon(ic)}${t}</span><span class="s">${s}</span></div>`).join("")}</div>
    <div class="mrow"><div style="flex:1.5"><div class="sechead">Activity</div><div class="card">
      ${checkRow("ok", "Verified the launcher", "Home button, restart and apps", "Nov 14, 13:05")}
      ${checkRow("ok", "Set Nyx TV as the home app", "Snapshot saved first", "Nov 14, 13:03")}
      ${checkRow("ok", "Installed Nyx TV 0.1.0", "Signed release · 6.7 MB", "Nov 14, 13:01")}
      ${checkRow("ok", "Paired over wireless debugging", "", "Nov 14, 12:58")}</div></div>
    <div class="wide-only"><div class="sechead">Other TVs</div><div class="card">${lrow({ lead: '<span class="dot off"></span>', title: "Bedroom", sub: "TCL 55Q570G · last seen Nov 10" })}${lrow({ lead: icon("plus"), title: "Add a TV" })}</div></div></div></div>`),
  install: () => flow(SETUP, 1, "Install Nyx TV", "Living Room · TCL 75Q570G", releases(true), btn("Back", "ghost") + btn("Next", "primary")),
  replace: () => flow(SETUP, 2, "Make Nyx TV the home app", "Here's everything that changes on the TV", warn() + `<div class="card">${changes()}</div>` + snapshotNote(), btn("Back", "ghost") + btn("Save snapshot and set Nyx TV", "primary")),
  verify: () => flow(SETUP, 3, "Check that it worked", "Run on the TV over wireless debugging", verifyRows(), btn("Run again", "ghost") + btn("Done", "primary")),
  restore: () => flow(["Pick a snapshot", "Restore", "Check"], 0, "Restore the original launcher", "Snapshots are only offered for the same TV and firmware", snapshots(), btn("Cancel", "ghost") + btn("Restore Google TV home", "primary")),
  repair: () => flow(["Check", "Snapshot", "Repair", "Verify"], 0, "The TV was updated", "Nyx TV found what changed", repairRows(), btn("Not now", "ghost") + btn("Repair", "primary")),
  backups: () => winB(`<div class="mbody center"><div class="mcol"><div class="title2">Backups</div>${backupRows()}</div></div>`),
  diagnostics: () => winB(`<div class="mbody">${pbar2("Diagnostics", "Living Room · live", btn("Export report…", "", "export")).replace('class="pbar"', 'class="pbar" style="border:0;padding:0"')}${diagCards()}${logs()}</div>`),
  debloat: () => flow(["Choose", "Measure", "Disable", "Compare"], 0, "Debloat Living Room TV", "Only verified optional packages can be chosen", `<div style="margin-top:-6px">${debloatHead()}</div><div>${pkgTable()}</div>`, btn("Cancel", "ghost") + btn("Measure and continue", "primary")).replace('class="mcol"', 'class="mcol" style="max-width:820px;gap:8px"'),
  "debloat-confirm": () => flow(["Choose", "Measure", "Disable", "Compare"], 3, "Done: 3 packages disabled", "Measured the same way before and after", `<div class="card">${measureTable(true)}</div><div class="card">${PKGS.filter((p) => p[5]).map((p) => lrow({ lead: `<span class="cls opt">${icon("check-c")}</span>`, title: p[1], sub: p[2], end: btn("Turn back on", "sm") })).join("")}</div>`, btn("Restore all", "dtext") + btn("Done", "primary")),
};

const PAGES_MGR = MD === "b" ? B : A;
ROOT.dataset.screens = Object.keys(PAGES_MGR).join(",");
mount((PAGES_MGR[SCREEN] || PAGES_MGR.overview)());
