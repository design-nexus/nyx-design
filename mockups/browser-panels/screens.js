// Browser's tool panels, three options each, drawn in Focus's frame from the revamp. DRAW[panel](opt,
// state) returns the window. Passwords, VPN and Share open from the Site card (at the address, with a
// back link to it); Extensions rises from the sidebar's foot. Sample data is made up.

Object.assign(EXTRA, {
  card: "M3 6h18v12H3zM3 10h18M7 15h3",
  idcard: "M3 5h18v14H3zM9 9.5a2 2 0 1 0 0 .01M5.5 16c.6-2.4 6.4-2.4 7 0M14 10h4M14 13h3",
  wand: "M4 20L15 9M14 3v2M20 9h-2M18.5 4.5l-1.4 1.4M10 4.5l1 1M18.5 13.5l-1-1",
  terminal: "M3 5h18v14H3zM7 10l3 2-3 2M12 15h4",
  unlock: "M7 11V7a5 5 0 0 1 9.6-2M5 11h14v10H5z",
  passkey: "M10 9a3 3 0 1 0 0 .01M4 20c0-3 2.7-5 6-5 1 0 2 .2 2.8.6M17 13a2 2 0 1 0 0 .01M17 15v6M17 18h2",
  stars: "M12 4l2.2 4.6 5 .7-3.6 3.5.9 5-4.5-2.4-4.5 2.4.9-5L4.8 9.3l5-.7z",
  left: "M15 6l-6 6 6 6",
  right: "M9 6l6 6-6 6",
  down: "M6 9l6 6 6-6",
  plugin: "M12 3v4M8 7h8v4a4 4 0 0 1-8 0zM12 15v6",
  spark: "M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M6 18l2.5-2.5M15.5 8.5L18 6",
});

const B = LAYOUT.b;
// A panel: at the Site card (x 236, top 40) with a back link to it, or rising from the sidebar's foot.
const atSite = (html, w, cls = "") => `<div class="pop b-pop b-card pp ${cls}" style="left:236px;top:40px;width:${w}px">${html}</div>`;
const atFoot = (html, w, cls = "") => `<div class="pop b-pop b-card pp ${cls}" data-up="760" style="left:150px;top:0;width:${w}px">${html}</div>`;
const backTo = (label, right = "") => `<div class="b-back">${I("back")}<span>${label}</span><span class="grow"></span>${right}</div>`;
const head = (icon, t, sub, right = "") => `<div class="b-ph">${icon}<div class="tt"><b>${t}</b>${sub ? `<span>${sub}</span>` : ""}</div>${right}</div>`;
const grp = (h, inner, cls = "") => `<div class="b-grp ${cls}">${h ? `<div class="mh">${h}</div>` : ""}${inner}</div>`;
const rws = (list) => list.map(([l, t, d, c]) => row(t, d, c || "", l || "")).join("");
const pfoot = (html) => `<div class="b-pf">${html}</div>`;
const ib = (ic, cls = "", title = "") => `<span class="ib ${cls}" title="${title}">${I(ic)}</span>`;
const field = (ph, typed = "", right = "") => `<div class="pfield">${I("search")}${typed ? `<span class="typed">${typed}<i class="caret"></i></span>` : `<span class="ph">${ph}</span>`}<span class="grow"></span>${right}</div>`;
const chips = (list, on = 0, cls = "") => `<div class="pchips ${cls}">${list.map((c, i) => `<span class="pchip ${i === on ? "on" : ""}">${c}</span>`).join("")}</div>`;
const banner = (kind, ic, text, btns = "") => `<div class="pban ${kind}">${I(ic)}<div class="bt"><span>${text}</span>${btns ? `<div class="bb">${btns}</div>` : ""}</div></div>`;
const btn = (label, cls = "", ic = "") => `<span class="pbtn ${cls}">${ic ? I(ic) : ""}${label}</span>`;
const spin = (cls = "") => `<span class="spin ${cls}"></span>`;
const toast = (ic, text) => `<div class="ptoast">${I(ic)}<span>${text}</span></div>`;
const dot = `<span class="adot"></span>`;
const hl = (s, q) => q ? s.replace(new RegExp(q, "i"), (m) => `<mark>${m}</mark>`) : s;
// A centred message: a big tinted icon, a title, a line, buttons.
const empty = (ic, c, t, d, btns = "", extra = "") => `<div class="pempty"><span class="tile" style="--c:${c}">${ic}</span><b>${t}</b><span>${d}</span>${btns ? `<div class="bb">${btns}</div>` : ""}${extra}</div>`;

// ---------------------------------------------------------------------------------------------
// Passwords
// ---------------------------------------------------------------------------------------------
const PWI = {
  fn: [fv("journal"), "Field Notes", "mara.q@fieldnotes.example"],
  fn2: [fv("journal"), "Field Notes", "editor@fieldnotes.example"],
  mail: [fv("mail"), "Fastmail", "mara.quinn@fastmail.example"],
  gh: [fv("gh"), "GitHub", "mquinn"],
  store: [fv("store"), "Peak Outfitters", "m.quinn@post.example"],
  kitchen: [fv("recipes"), "Trail Kitchen", "maraq"],
  weather: [fv("weather"), "Weather", "Sign in with GitHub"],
  tmaps: [fv("maps"), "Trail maps", "mara.quinn"],
  days: [fv("video"), "Trail Days", "mara.q@post.example"],
  card: [`<span class="xi sm" style="--c:#1a5fb4">${I("card")}</span>`, "Visa", "•••• 4821 · 08/29"],
  id: [`<span class="xi sm" style="--c:var(--sw-teal)">${I("idcard")}</span>`, "Mara Quinn", "Home"],
  note: [`<span class="xi sm" style="--c:var(--sw-amber)">${I("note")}</span>`, "Trailhead gate codes", "Secure note"],
  ssh: [`<span class="xi sm" style="--c:var(--sw-graphite)">${I("terminal")}</span>`, "Laptop key", "SSH key · ed25519"],
};
const pit = (k, right = "", o = {}) => { const [ic, t, d] = PWI[k]; return `<div class="pit ${o.on ? "on" : ""} ${o.hover ? "hover" : ""}">${ic}<div class="rt"><b>${hl(t, o.q)}</b><span>${hl(d, o.q)}</span></div>${right}</div>`; };
const pwFilters = ["All", "Logins", "Cards", "Identities", "Notes"];
const ring = (p, n) => `<span class="cring" style="--p:${p}%"><i>${n}</i></span>`;

// The item, shared by every option: A and C show it as a sub-view, B in its right pane.
function pwItem(kind) {
  const copy = ib("copy", "", "Copy");
  const fieldRow = (label, value, right, cls = "") => `<div class="pf ${cls}"><div class="rt"><span>${label}</span><b>${value}</b></div>${right}</div>`;
  if (kind === "login" || kind === "site" || kind === "other" || kind === "offer") {
    const other = kind === "other" || kind === "offer";
    const top = other
      ? head(fv("store", "lg"), "Peak Outfitters", "peakoutfitters.example", ib("star"))
      : head(fv("journal", "lg"), "Field Notes", "fieldnotes.example", ib("star-filled", "fav"));
    const primary = kind === "other"
      ? `<div class="pact">${btn("Fill on this site…", "accent wide", "arrow-right")}</div>` + banner("warn", "warning", "This login is for <b>peakoutfitters.example</b>. Fill it on fieldnotes.example anyway?", btn("Fill anyway", "accent") + btn("Cancel"))
      : kind === "offer"
      ? banner("ok", "check", "Filled. Add <b>fieldnotes.example</b> to this login, so it's suggested here next time?", btn("Add", "accent") + btn("Not now"))
      : `<div class="pact">${btn("Autofill", "accent wide", "zap")}</div>`;
    const sec = kind === "login" ? banner("sec", "shield", "This password is also used for 2 other logins.", `<span class="lnk">Change this password</span>`) : "";
    const pass = kind === "login" ? `<b class="mono">ridge-Cedar-41-saddle</b>` : `<b>••••••••••••••</b>`;
    return `${top}${primary}${sec}
      <div class="pfs">
        ${fieldRow("Username", other ? "m.quinn@post.example" : "mara.q@fieldnotes.example", copy)}
        <div class="pf"><div class="rt"><span>Password</span>${pass}</div>${ib(kind === "login" ? "eye" : "eye")}${copy}</div>
        ${other ? "" : `<div class="pf"><div class="rt"><span>One-time code</span><b class="mono big">482 913</b></div>${ring(62, 18)}${copy}</div>`}
        ${other ? "" : fieldRow("Passkey", `<span class="okb">${I("passkey")}Saved in Passwords</span>`, "")}
      </div>
      <div class="pfs">${fieldRow("Website", other ? "peakoutfitters.example" : "fieldnotes.example", ib("copy") + ib("external", "", "Open in a new tab"))}${other ? "" : fieldRow("Website", "app.fieldnotes.example", ib("copy") + ib("external"))}</div>
      ${kind === "login" ? toast("check", "Password copied · cleared from the clipboard in 90 s") : ""}`;
  }
  if (kind === "card") return `${head(`<span class="xi lg" style="--c:#1a5fb4">${I("card")}</span>`, "Visa", "Mara Quinn", ib("star"))}
      <div class="pact">${btn("Autofill", "accent wide", "zap")}</div>
      <div class="pline">${I("card")}<span>Visa ending in 4821 · expires 08/29</span></div>
      <p class="pnote">The number and security code fill straight into the page; Passwords shows them in the app.</p>`;
  if (kind === "ssh") return `${head(`<span class="xi lg" style="--c:var(--sw-graphite)">${I("terminal")}</span>`, "Laptop key", "SSH key · ed25519", ib("star"))}
      <div class="pfs">
        ${fieldRow("Public key", `<span class="mono sm">ssh-ed25519 AAAAC3NzaC1lZDI1…k9Qe mara@laptop</span>`, copy)}
        ${fieldRow("Fingerprint", `<span class="mono sm">SHA256:4f9XcLr0…tQ2c</span>`, copy)}
      </div>
      ${banner("info", "help", "The private key never leaves Passwords. Its SSH agent signs for you.", `<span class="lnk">Open in Passwords ${I("external")}</span>`)}
      <div class="pdiv"></div>
      <div class="pmini">${pit("note", `<span class="lnk">Open in Passwords ${I("external")}</span>`)}</div>
      <p class="pnote">Notes and other kinds open in the Passwords app.</p>`;
  if (kind === "generator") return `<div class="pgen">
      ${seg(["Password", "Passphrase", "Username"], 0)}
      <div class="pout"><span class="mono">k7#Vq2!rTn9@pLm4Wz&amp;e</span>${ib("reload", "", "Make another")}</div>
      <div class="psl"><span>Length</span><div class="slider"><i style="width:21%"></i><b style="left:21%"></b></div><em>20</em></div>
      <div class="pchk">${["A–Z", "a–z", "0–9", "!@#"].map((c) => `<span class="pchip on">${I("check")}${c}</span>`).join("")}</div>
      <p class="pnote">Passphrase: 3 to 10 words. Username: words or random letters.</p>
      <div class="pbtns">${btn("Copy", "", "copy")}${btn("Fill into page", "accent", "zap")}</div></div>`;
  if (kind === "settings") return `<div class="pset">
      ${grp("In this browser", rws([
        ["", "Fill when a page loads", "Only on the site the login is for", sw(false)],
        ["", "Show a menu in login fields", "Pick a login right in the page", sw(true)],
        ["", "Copy one-time codes after filling", "", sw(true)],
        ["", "Stay unlocked while Passwords is", "", sw(true)],
        ["", "Use Passwords for passkeys", "", sw(true)],
        ["", "Sign in with a passkey without asking", "When a site has only one", sw(false)],
      ]))}
      ${grp("", rws([[tile("plug", "var(--sw-green)"), "Paired with Passwords", "On this computer · since Nov 2", btn("Unpair", "danger")]]))}</div>`;
  if (kind === "empty") return empty(I("key"), "var(--sw-violet)", "Nothing saved for fieldnotes.example", "Save what you've typed into the page, or make a new password for it.", btn("Save login from page", "accent", "download") + btn("New password", "", "wand"));
  return "";
}

// Before the vault opens: not running, pairing, locked.
function pwGate(state) {
  if (state === "locked") return empty(I("lock"), "var(--sw-violet)", "Passwords is locked", "Unlock it to fill logins and see your vault.", btn("Unlock", "accent", "unlock"), `<p class="pnote c">Also: Unlocking… · Couldn't unlock, try again</p>`);
  if (state === "pair") return empty(I("plug"), "var(--sw-violet)", "Confirm in Passwords", "Check Passwords shows the same code, then allow Browser.", "", `<div class="pcode">123 456</div><div class="pwait">${spin()}<span>Waiting for Passwords…</span></div><p class="pnote c">Before: Connect to Nyx Passwords · Pair with Passwords. After a failure: Pairing failed · Try again</p>`);
  if (state === "down") return empty(I("warning"), "var(--sw-amber)", "Passwords isn't running", "Open the Passwords app, then try again.", btn("Try again", "accent", "reload") + btn("Open Passwords", "", "external"), `<p class="pnote c">Also: Couldn't reach Passwords</p>`);
  return "";
}
const GATES = ["locked", "pair", "down"];

const pwHeadA = (typed = "") => `<div class="pbar">${field("Search Passwords", typed, typed ? `<span class="pcount">4</span>` : kbd("/"))}${ib("wand", "", "Generate")}${ib("lock", "", "Lock")}${ib("settings", "", "Settings")}</div>`;
const siteLogins = (hover = 0) => grp("For fieldnotes.example", `
    ${pit("fn", btn("Fill", "accent"), { hover: hover === 1 })}
    ${pit("fn2", btn("Fill"))}
    <div class="pit">${`<span class="xi sm" style="--c:var(--sw-green)">${I("passkey")}</span>`}<div class="rt"><b>Passkey</b><span>mara.q@fieldnotes.example</span></div>${btn("Use")}</div>`, "plist");
const searchResults = (q) => grp("4 results", ["kitchen", "days", "note", "tmaps"].map((k, i) => pit(k, I("arrow-right", "dimi"), { q, hover: i === 0 })).join(""), "plist");

function pwA(state) {
  if (GATES.includes(state)) return atSite(backTo("fieldnotes.example") + pwGate(state), 380, "pw-a");
  const sub = (title, body) => atSite(backTo("Passwords", `<span class="sv">${title}</span>`) + body, 380, "pw-a");
  if (state === "site") return atSite(`${backTo("fieldnotes.example")}${pwHeadA()}${chips(pwFilters)}${siteLogins(1)}
      ${grp("Favorites", pit("mail", ring(62, 18)) + pit("gh"), "plist")}
      ${grp("All items · 128", pit("store") + pit("card") + pit("kitchen"), "plist")}
      ${pfoot(`<span>${I("unlock")} Unlocked</span><span class="grow"></span><span class="lnk">Open Passwords ${I("external")}</span>`)}`, 380, "pw-a");
  if (state === "search") return atSite(`${backTo("fieldnotes.example")}${pwHeadA("trail")}${chips(pwFilters)}${searchResults("trail")}
      ${pfoot(`<span>${kbd("↑", "↓")} choose</span><span>${kbd("Enter")} open</span><span>${kbd("Esc")} clear</span>`)}`, 380, "pw-a");
  if (state === "empty") return atSite(`${backTo("fieldnotes.example")}${pwHeadA()}${chips(pwFilters)}${pwItem("empty")}${grp("Favorites", pit("mail", ring(62, 18)) + pit("gh"), "plist")}
      ${pfoot(`<span>${I("unlock")} Unlocked</span><span class="grow"></span><span class="lnk">Open Passwords ${I("external")}</span>`)}`, 380, "pw-a");
  if (state === "generator") return sub("Generate", pwItem("generator"));
  if (state === "settings") return sub("Settings", pwItem("settings"));
  return sub("", pwItem(state) + (state === "ssh" ? "" : pfoot(`<span class="grow"></span><span class="lnk">Open in Passwords ${I("external")}</span>`)));
}

function pwB(state) {
  const top = (typed = "") => `<div class="pbbar"><div class="pbl">${field("Search Passwords", typed, typed ? `<span class="pcount">4</span>` : kbd("/"))}</div><span class="grow"></span>${ib("wand", state === "generator" ? "on" : "", "Generate")}${ib("lock", "", "Lock")}${ib("settings", state === "settings" ? "on" : "", "Settings")}<span class="lnk">Open Passwords ${I("external")}</span></div>`;
  if (GATES.includes(state)) return atSite(backTo("fieldnotes.example") + `<div class="pbgate">${pwGate(state)}</div>`, 640, "pw-b");
  const sel = { site: "fn", login: "fn", other: "store", offer: "store", card: "card", ssh: "ssh" }[state];
  let list;
  if (state === "search") list = `${chips(pwFilters, 0, "sm")}${["kitchen", "days", "note", "tmaps"].map((k, i) => pit(k, "", { q: "trail", on: i === 0 })).join("")}<p class="pnote pkeys">${kbd("↑", "↓")} choose · ${kbd("Enter")} fill · ${kbd("Esc")} clear</p>`;
  else list = `${chips(pwFilters, state === "card" ? 2 : 0, "sm")}
      ${state === "empty" ? `<div class="mh">Suggested · fieldnotes.example</div><p class="pnote">Nothing yet</p>` : `<div class="mh">Suggested · fieldnotes.example</div>${pit("fn", sel === "fn" ? "" : `<span class="hfill">Fill</span>`, { on: sel === "fn" })}${pit("fn2")}`}
      <div class="mh">Favorites</div>${pit("mail")}${pit("gh")}
      <div class="mh">All items</div>${pit("store", "", { on: sel === "store" })}${pit("card", "", { on: sel === "card" })}${pit("ssh", "", { on: sel === "ssh" })}${pit("kitchen")}`;
  const right = state === "search" ? `${head(fv("recipes", "lg"), "Trail Kitchen", "trailkitchen.example", ib("star"))}<div class="pact">${btn("Fill on this site…", "accent wide", "arrow-right")}</div><div class="pfs"><div class="pf"><div class="rt"><span>Username</span><b>maraq</b></div>${ib("copy")}</div><div class="pf"><div class="rt"><span>Password</span><b>••••••••••••</b></div>${ib("eye")}${ib("copy")}</div></div>`
    : pwItem(state === "site" ? "site" : state);
  return atSite(`${backTo("fieldnotes.example")}${top(state === "search" ? "trail" : "")}<div class="pb2"><div class="pbl list">${list}</div><div class="pbr">${state === "generator" ? `<div class="pbrh">Generate</div>` : state === "settings" ? `<div class="pbrh">Settings</div>` : ""}${right}</div></div>`, 640, "pw-b");
}

function pwC(state) {
  if (GATES.includes(state)) return atSite(backTo("fieldnotes.example") + pwGate(state), 360, "pw-c");
  const sub = (title, body, from = "Passwords") => atSite(backTo(from, title ? `<span class="sv">${title}</span>` : "") + body, 360, "pw-c");
  const tiles = (on = "") => `<div class="pctiles">${[["wand", "Generate"], ["search", "Search"], ["download", "Save from page"], ["lock", "Lock"]].map(([ic, l]) => `<div class="b-act ${on === ic ? "on" : ""}">${I(ic)}<span>${l}</span></div>`).join("")}</div>`;
  if (state === "site" || state === "empty") {
    const card = state === "empty" ? `<div class="b-grp plist">${pwItem("empty")}</div>`
      : `<div class="b-grp plist">${pit("fn", btn("Fill", "accent"), { hover: true })}${pit("fn2", btn("Fill"))}<div class="pit"><span class="xi sm" style="--c:var(--sw-green)">${I("passkey")}</span><div class="rt"><b>Sign in with a passkey</b><span>mara.q@fieldnotes.example</span></div>${btn("Use")}</div></div>`;
    return atSite(`${backTo("fieldnotes.example")}
      ${head(`<span class="tile" style="--c:var(--sw-violet)">${I("key")}</span>`, "Passwords", state === "empty" ? "Nothing for this site" : "2 logins and a passkey for this site", ib("settings", "", "Settings"))}
      ${card}${tiles()}
      ${grp("Recently used", pit("mail", ring(62, 18)) + pit("gh") + pit("store"), "plist")}
      ${pfoot(`<span>${I("unlock")} Unlocked</span><span class="grow"></span><span class="lnk">Open Passwords ${I("external")}</span>`)}`, 360, "pw-c");
  }
  if (state === "search") return sub("", `${field("Search Passwords", "trail", `<span class="pcount">4</span>`)}${chips(pwFilters)}${searchResults("trail")}${grp("Favorites", pit("mail") + pit("gh"), "plist")}`);
  if (state === "generator") return sub("Generate", pwItem("generator"));
  if (state === "settings") return sub("Settings", pwItem("settings"));
  return sub("", pwItem(state) + (state === "ssh" ? "" : pfoot(`<span class="grow"></span><span class="lnk">Open in Passwords ${I("external")}</span>`)));
}

// ---------------------------------------------------------------------------------------------
// VPN
// ---------------------------------------------------------------------------------------------
const flag = (code, c, cls = "") => `<span class="vflag ${cls}" style="background:${c}">${code}</span>`;
const COUNTRIES = [["AL", "Albania", "#c8102e", 1], ["AR", "Argentina", "#4b9cd3", 1], ["AU", "Australia", "#00247d", 5], ["AT", "Austria", "#c8102e", 1], ["BE", "Belgium", "#3a3a3a", 1], ["BR", "Brazil", "#009c3b", 1], ["CA", "Canada", "#d52b1e", 3]];
const FAVS_V = [["PT", "Lisbon", "Portugal", "#046a38"], ["JP", "Tokyo", "Japan", "#bc002d"]];
const star = (on) => `<span class="vstar ${on ? "on" : ""}">${I(on ? "star-filled" : "star")}</span>`;
const vrow = (fl, t, d, right = "", cls = "") => `<div class="vr ${cls}">${fl}<div class="rt"><b>${t}</b>${d ? `<span>${d}</span>` : ""}</div>${right}</div>`;
const countryRow = ([code, name, c, n], o = {}) => vrow(flag(code, c, "sm"), name, n > 1 ? `${n} cities` : "", `${o.check ? I("check", "vchk") : ""}${star(o.star)}${n > 1 ? `<span class="vchev ${o.open ? "open" : ""}">${I(o.open ? "down" : "right")}</span>` : `<span class="vchev"></span>`}`, o.cls || "");

function vpnParts(state) {
  const on = ["on", "search", "cities", "busy", "error", "two", "pia"].includes(state);
  const pia = state === "pia";
  const status = state === "busy" ? `<span class="warnt">${spin("sm")} Moving to Geneva…</span>`
    : state === "nows" ? "Off · Trips is set to No VPN"
    : on ? `<span class="ok">● Connected · ${pia ? "Private Internet Access" : "NordVPN"}</span>` : "Off for this tab";
  const place = pia ? ["US", "United States · Chicago", "#3c3b6e"] : ["CH", "Switzerland · Zurich", "#d52b1e"];
  const server = pia ? "us-chicago.privacy.example" : "ch412.nordvpn.example";
  const list = () => {
    if (state === "search") return `<div class="mh">Countries</div>${countryRow(["SM", "San Marino", "#5eb6e4", 1])}<div class="mh">Cities</div>${vrow(flag("US", "#3c3b6e", "sm"), hl("San Francisco", "san"), "United States", star(false))}${vrow(flag("US", "#3c3b6e", "sm"), hl("San Jose", "san"), "United States", star(false))}${vrow(flag("CL", "#d52b1e", "sm"), hl("Santiago", "san"), "Chile", star(false))}`;
    if (["cities", "busy", "error"].includes(state)) {
      return `${countryRow(["CH", "Switzerland", "#d52b1e", 3], { open: true, check: false })}
        ${vrow("", "Zurich", "", (state === "cities" ? I("check", "vchk") : "") + star(true), "city")}
        ${vrow("", "Geneva", state === "busy" ? "Asking NordVPN for a server…" : "", (state === "busy" ? spin("sm") : "") + star(false), `city ${state === "busy" ? "busy" : ""} ${state === "error" ? "err" : ""}`)}
        ${state === "error" ? `<div class="verr">${I("warning")}<span>No NordVPN proxy in Geneva right now. Try another city, or Fastest server.</span></div>` : ""}
        ${vrow("", "Bern", "", star(false), "city")}
        ${countryRow(["SY", "Syria", "#007a3d", 1], { cls: "dim" })}`;
    }
    return COUNTRIES.slice(0, 6).map((c) => countryRow(c)).join("");
  };
  return { on, pia, status, place, server, list };
}

function vpnNone(w) {
  return atSite(`${backTo("fieldnotes.example")}${head(tile("globe", "var(--sw-teal)"), "VPN", "Not set up")}
    ${empty(I("globe"), "var(--sw-teal)", "No VPN added yet", "Add NordVPN, Private Internet Access or any proxy, and Browser sends its pages through it. Other apps aren't affected.", btn("Add a VPN…", "accent", "plus"))}
    ${pfoot(`<span class="grow"></span><span class="lnk">VPN settings</span>`)}`, w);
}

function vpnA(state) {
  if (state === "none") return vpnNone(370);
  const p = vpnParts(state);
  const hero = `<div class="vhero ${p.on ? "on" : ""} ${state === "busy" ? "busy" : ""}">${flag(p.place[0], p.place[2])}<div><b>${p.place[1]}</b><span>${p.server} · Browser only</span></div>${p.pia ? "" : star(true)}</div>`;
  const conns = state === "two" ? grp("Connection", rws([[`<span class="radio on"></span>`, "NordVPN", "Account · 6,400 servers"], [`<span class="radio"></span>`, "Office proxy", "SOCKS5 · proxy.office.example:1080"]])) : "";
  const use = grp("Use it for", `<div class="vseg">${seg(["Every workspace", "Trips only"], 0)}</div>${state === "nows" ? `<p class="pnote">Trips is set to No VPN. Turning it on gives Trips its own VPN; the others keep theirs.</p>` : ""}`);
  const places = p.pia ? `<div class="b-grp"><p class="pnote pad">Private Internet Access picks its own server: there are no places to choose.</p></div>`
    : grp("Location", `<div class="vfavs">${`<span class="pchip on">${I("zap")}Fastest</span>`}<span class="pchip">${I("star-filled")}Zurich</span>${FAVS_V.map(([, city]) => `<span class="pchip">${I("star-filled")}${city}</span>`).join("")}</div>
      <div class="vfield">${field("Find a country or city", state === "search" ? "san" : "")}</div><div class="vlist">${p.list()}</div>`);
  return atSite(`${backTo("fieldnotes.example")}${head(tile("globe", "var(--sw-teal)"), "VPN", p.status, sw(p.on))}${hero}${conns}${use}${places}
    ${pfoot(`<span class="lnk">${I("shield")}Skip the VPN on this site</span><span class="grow"></span><span class="lnk">VPN settings</span>`)}`, 370, "vpn-a");
}

function vpnB(state) {
  if (state === "none") return vpnNone(360);
  const p = vpnParts(state);
  const menuOpen = state === "two" ? "conn" : state === "nows" ? "ws" : "";
  const bar = `<div class="vbar ${p.on ? "on" : ""}">${sw(p.on)}<div class="rt"><b>${p.on ? (state === "busy" ? "Moving to Geneva…" : `Connected · ${p.place[1].replace(" · ", ", ")}`) : state === "nows" ? "Off · Trips uses No VPN" : "Off for this tab"}</b><span>${p.on ? `${p.server} · Browser only` : "Last: Switzerland, Zurich"}</span></div></div>
    <div class="vchips"><span class="drop ${menuOpen === "conn" ? "on" : ""}">${I("plug")}${p.pia ? "Private Internet Access" : "NordVPN"}${I("chevron")}</span><span class="drop ${menuOpen === "ws" ? "on" : ""}">${I("workspace")}${state === "nows" ? "Trips: No VPN" : "Every workspace"}${I("chevron")}</span></div>`;
  const list = p.pia ? `<div class="b-grp"><p class="pnote pad">Private Internet Access picks its own server: <b>${p.server}</b>. There are no places to choose.</p></div>`
    : `${field("Find a country or city", state === "search" ? "san" : "")}
      <div class="b-grp vlist tall">${state === "search" || ["cities", "busy", "error"].includes(state) ? p.list() : `
        ${vrow(`<span class="vflag sm z">${I("zap")}</span>`, "Fastest server", "NordVPN picks", "")}
        <div class="mh">Favourites</div>${vrow(flag("CH", "#d52b1e", "sm"), "Zurich", "Switzerland", I("check", "vchk") + star(true))}${FAVS_V.map(([code, city, country, c]) => vrow(flag(code, c, "sm"), city, country, star(true))).join("")}
        <div class="mh">All countries</div>${COUNTRIES.slice(0, 4).map((c) => countryRow(c)).join("")}`}</div>`;
  const menus = menuOpen === "conn"
    ? `<div class="pop b-pop b-ctx vmenu" style="left:250px;top:182px;width:250px">${menu([["plug", "NordVPN", "", { on: true }], ["plug", "Office proxy", "SOCKS5"], "-", ["plus", "Add a VPN…", ""]])}</div>`
    : menuOpen === "ws" ? `<div class="pop b-pop b-ctx vmenu" style="left:368px;top:182px;width:250px">${menu([{ h: "Use it for" }, ["workspace", "Every workspace", ""], ["workspace", "Trips only", ""], ["close", "No VPN for Trips", "", { on: true }]])}</div>` : "";
  return atSite(`${backTo("fieldnotes.example")}${bar}${list}
    ${pfoot(`<span class="lnk">${I("shield")}Skip the VPN on this site</span><span class="grow"></span><span class="lnk">VPN settings</span>`)}`, 360, "vpn-b") + menus;
}

function vpnC(state) {
  if (state === "none") return vpnNone(350);
  const p = vpnParts(state);
  if (["search", "cities", "busy", "error"].includes(state)) return atSite(`${backTo("VPN", `<span class="sv">Location</span>`)}
    ${field("Find a country or city", state === "search" ? "san" : "")}
    <div class="vfavs">${`<span class="pchip">${I("zap")}Fastest</span>`}<span class="pchip on">${I("star-filled")}Zurich</span>${FAVS_V.map(([, city]) => `<span class="pchip">${I("star-filled")}${city}</span>`).join("")}</div>
    <div class="b-grp vlist tall">${p.list()}${state === "search" ? "" : COUNTRIES.slice(0, 2).map((c) => countryRow(c)).join("")}</div>`, 350, "vpn-c");
  if (state === "two") return atSite(`${backTo("VPN", `<span class="sv">Connection</span>`)}
    ${grp("", rws([[`<span class="radio on"></span>`, "NordVPN", "Account · ch412.nordvpn.example"], [`<span class="radio"></span>`, "Office proxy", "SOCKS5 · proxy.office.example:1080"]]))}
    ${grp("", rws([[I("plus"), "Add a VPN…", "NordVPN, Private Internet Access, or a proxy"]]))}
    ${grp("Covers", rws([[I("browser"), "Browser only", "Other apps on this computer aren't affected"]]))}`, 350, "vpn-c");
  const ws = state === "nows" ? drop("No VPN") : drop("Every workspace");
  return atSite(`${backTo("fieldnotes.example")}${head(tile("globe", "var(--sw-teal)"), "VPN", p.status, sw(p.on))}
    ${grp("", `${p.pia ? "" : row("Location", p.on ? "Switzerland · Zurich" : "Switzerland · Zurich (when on)", I("arrow-right", "dimi"), flag("CH", "#d52b1e", "sm"))}
      ${row("Connection", `${p.pia ? "Private Internet Access" : "NordVPN"} · ${p.server}`, I("arrow-right", "dimi"), tile("plug", "var(--sw-teal)"))}
      ${row("Trips", state === "nows" ? "This workspace goes direct" : "Uses the VPN like every workspace", ws, `<span class="sq" style="--c:var(--sw-teal)">T</span>`)}`)}
    ${p.pia ? "" : `<div class="vfavs">${`<span class="pchip">${I("zap")}Fastest</span>`}<span class="pchip on">${I("star-filled")}Zurich</span>${FAVS_V.map(([, city]) => `<span class="pchip">${I("star-filled")}${city}</span>`).join("")}</div>`}
    ${state === "nows" ? `<p class="pnote pad">Turning it on gives Trips its own VPN; the other workspaces keep theirs.</p>` : ""}
    ${grp("", `${row("Skip the VPN on fieldnotes.example", "Some sites block VPNs", sw(false), tile("shield", "var(--sw-coral)"))}
      ${row("Protection", "Stops if the VPN drops · DNS and calls through it", I("arrow-right", "dimi"), tile("lock", "var(--sw-green)"))}`)}
    ${pfoot(`<span>${I("browser")} Browser only</span><span class="grow"></span><span class="lnk">VPN settings</span>`)}`, 350, "vpn-c");
}

// D: today's panel (vpn.js), part for part: emoji flags, the badge and switch, Server and Covers,
// Favourites, the search and the countries, Use it for, VPN settings.
const ef = (cc) => (cc ? String.fromCodePoint(...[...cc].map((c) => 0x1f1a5 + c.charCodeAt(0))) : "");
const dflag = (cc) => `<span class="dflag">${ef(cc)}</span>`;
const dico = (ic, cls = "") => `<span class="dico ${cls}">${I(ic)}</span>`;
const dstar = (on) => dico(on ? "star-filled" : "star", on ? "on" : "");
const drow = (lead, name, sub, right = "", cls = "") => `<div class="drow ${cls}">${lead}<span class="dgrow"><span>${name}</span>${sub ? `<small>${sub}</small>` : ""}</span>${right}</div>`;
function vpnD(state) {
  if (state === "none") return atSite(`${backTo("fieldnotes.example")}<div class="dempty"><p>No VPN added yet. Browser can go through NordVPN, Private Internet Access, or any SOCKS5 or HTTPS proxy, without their extensions.</p>${btn("Add a VPN…", "accent")}</div>`, 374, "vpn-d");
  const p = vpnParts(state);
  const busy = state === "busy" ? "busy" : "";
  const head = `<div class="dhead"><span class="dbadge ${p.on ? "on" : ""}">${I("globe")}</span><div class="dtext"><b>${p.on ? "Connected" : "Off for this tab"}</b><small>${p.pia ? "Private Internet Access · United States · Chicago" : "NordVPN · Switzerland · Zurich"}</small></div>${sw(p.on)}</div>
    <div class="dstats"><div><small>Server</small><span>${p.server}</span></div><div><small>Covers</small><span>Browser only</span></div></div>`;
  const conns = state === "two" ? `<div class="dlabel">Connection</div><div class="dlist">${drow(dflag("CH"), "NordVPN", "", "<small>Switzerland · Zurich</small>", "on")}${drow(dflag(""), "Office proxy", "", "<small></small>")}</div>` : "";
  const country = (cc, name, o = {}) => drow(dflag(cc), name, "", `${o.here ? dico("check", "chk") : ""}${o.cities ? dico("chevron", o.open ? "rot" : "") : ""}${dstar(o.star)}`, `place ${o.here ? "on" : ""}`);
  const city = (name, o = {}) => drow("", name, o.note ? `<em class="dnote">${o.note}</em>` : "", `${o.here ? dico("check", "chk") : ""}${dstar(o.star)}`, `place indent ${o.here ? "on" : ""}`);
  let places;
  if (state === "search") places = `<div class="dgroup in">Countries</div>${country("SM", "San Marino")}<div class="dgroup in">Cities</div>${drow(dflag("US"), "San Francisco", "United States", dstar(false), "place")}${drow(dflag("US"), "San Jose", "United States", dstar(false), "place")}${drow(dflag("CL"), "Santiago", "Chile", dstar(false), "place")}`;
  else if (["cities", "busy", "error"].includes(state)) places = `${country("SE", "Sweden", { cities: true })}${country("CH", "Switzerland", { cities: true, open: true })}${city("Zurich", { here: state !== "busy", star: true })}${city("Geneva", { note: state === "error" ? "No NordVPN proxy here right now" : "" })}${city("Bern")}${country("TW", "Taiwan", { cities: true })}`;
  else places = `${country("AL", "Albania")}${country("AR", "Argentina", { cities: true })}${country("AU", "Australia", { cities: true })}${country("AT", "Austria")}${country("BE", "Belgium", { cities: true })}${country("BR", "Brazil")}`;
  const location = p.pia ? "" : `<div class="dlabel">Location</div><div class="dgroup">Favourites</div>
    <div class="dlist ${busy}">${drow(`<span class="dbolt">${I("zap")}</span>`, "Fastest server", "Wherever NordVPN is quickest now", "", "place")}${drow(dflag("CH"), "Zurich", "Switzerland", (state === "busy" ? "" : dico("check", "chk")) + dstar(true), `place ${state === "busy" ? "" : "on"}`)}${drow(dflag("PT"), "Portugal", "Whole country", dstar(true), "place")}</div>
    <div class="dsearch">${I("search")}${state === "search" ? `<span class="typed">san<i class="caret"></i></span>` : `<span class="ph">Find a country or city</span>`}</div>
    <div class="dlist dplaces ${busy}">${places}</div>`;
  return atSite(`${backTo("fieldnotes.example")}${head}${conns}${location}
    <div class="dlabel">Use it for</div><div class="dseg"><span class="on">Every workspace</span><span>Trips only</span></div>
    <div class="dsettings">VPN settings</div>`, 374, "vpn-d");
}

// E: a quick menu, like a system Wi-Fi menu; every place is one click further.
function vpnE(state) {
  if (state === "none") return vpnNone(320);
  const p = vpnParts(state);
  const placesView = ["search", "cities", "busy", "error"].includes(state);
  if (placesView) return atSite(`${backTo("VPN", `<span class="sv">Places</span>`)}${field("Find a country or city", state === "search" ? "san" : "")}<div class="b-grp vlist tall">${p.list()}${state === "search" ? "" : COUNTRIES.slice(0, 2).map((c) => countryRow(c)).join("")}</div>`, 320, "vpn-e");
  if (state === "two") return atSite(`${backTo("VPN", `<span class="sv">Connection</span>`)}${grp("", rws([[`<span class="radio on"></span>`, "NordVPN", "ch412.nordvpn.example · Browser only"], [`<span class="radio"></span>`, "Office proxy", "SOCKS5 · proxy.office.example:1080"]]))}${grp("", rws([[I("plus"), "Add a VPN…", ""]]))}`, 320, "vpn-e");
  const quick = (fl, t, d, here) => `<div class="eq ${here ? "on" : ""}">${fl}<div class="rt"><b>${t}</b>${d ? `<span>${d}</span>` : ""}</div>${here ? I("check", "vchk") : ""}</div>`;
  const places = p.pia ? "" : `<div class="mh">Places</div>
    ${quick(`<span class="vflag sm z">${I("zap")}</span>`, "Fastest server", "", false)}${quick(flag("CH", "#d52b1e", "sm"), "Zurich", "Switzerland", true)}${FAVS_V.map(([code, city, country, c]) => quick(flag(code, c, "sm"), city, country, false)).join("")}
    <div class="eq more">${I("globe")}<div class="rt"><b>Every country and city…</b></div>${I("arrow-right", "dimi")}</div><div class="msep"></div>`;
  const mrow = (ic, t, val, ctl = I("arrow-right", "dimi")) => `<div class="eq">${I(ic)}<div class="rt"><b>${t}</b></div>${val ? `<span class="ev">${val}</span>` : ""}${ctl}</div>`;
  return atSite(`${backTo("fieldnotes.example")}
    <div class="etop ${p.on ? "on" : ""}"><span class="tile" style="--c:var(--sw-teal)">${I("globe")}</span><div class="rt"><b>VPN</b><span>${p.status}</span></div>${sw(p.on)}</div>
    <div class="emenu">${places}
      ${mrow("plug", "Connection", p.pia ? "Private Internet Access" : "NordVPN")}
      ${mrow("workspace", "Use it for", state === "nows" ? "Trips: No VPN" : "Every workspace")}
      ${mrow("shield", "Skip it on this site", "", sw(false))}
      <div class="msep"></div>${mrow("settings", "VPN settings", "", "")}</div>`, 320, "vpn-e");
}

// F: workspaces first; the place picker below serves the chosen row.
function vpnF(state) {
  if (state === "none") return vpnNone(370);
  const p = vpnParts(state);
  const nows = state === "nows";
  const ws = (l, name, c, d, val, o = {}) => `<div class="fws ${o.on ? "on" : ""}"><span class="sq" style="--c:${c}">${l}</span><div class="rt"><b>${name}${o.on ? `<em>This workspace</em>` : ""}</b><span>${d}</span></div>${drop(val)}</div>`;
  const placeName = p.pia ? "Private Internet Access · Chicago" : "NordVPN · Zurich";
  const rows = `${ws("T", "Trips", "var(--sw-teal)", nows ? "Goes direct" : `${placeName} · like every workspace`, nows ? "No VPN" : "Every workspace", { on: true })}
    ${ws("W", "Work", "var(--sw-blue)", `${placeName} · like every workspace`, "Every workspace")}
    ${ws("H", "Home", "var(--sw-amber)", "Goes direct", "No VPN")}`;
  const conns = state === "two" ? grp("Connection", rws([[`<span class="radio on"></span>`, "NordVPN", "ch412.nordvpn.example"], [`<span class="radio"></span>`, "Office proxy", "SOCKS5 · proxy.office.example:1080"]])) : "";
  const picker = p.pia ? `<div class="b-grp"><p class="pnote pad">Private Internet Access picks its own server: there are no places to choose.</p></div>`
    : grp(nows ? "Place for Trips, when it's on" : "Place for every workspace", `<div class="vfavs"><span class="pchip">${I("zap")}Fastest</span><span class="pchip on">${I("star-filled")}Zurich</span>${FAVS_V.map(([, city]) => `<span class="pchip">${I("star-filled")}${city}</span>`).join("")}</div>
      <div class="vfield">${field("Find a country or city", state === "search" ? "san" : "")}</div><div class="vlist">${["search", "cities", "busy", "error"].includes(state) ? p.list() : COUNTRIES.slice(0, 4).map((c) => countryRow(c)).join("")}</div>`);
  return atSite(`${backTo("fieldnotes.example")}<div class="b-ph">${tile("globe", "var(--sw-teal)")}<div class="tt"><b>VPN</b><span>${p.status}</span>${p.on ? `<span class="dimt">${p.server} · Browser only</span>` : ""}</div>${sw(p.on)}</div>
    ${grp("Workspaces", rows)}${conns}${picker}
    ${pfoot(`<span class="lnk">${I("shield")}Skip the VPN on this site</span><span class="grow"></span><span class="lnk">VPN settings</span>`)}`, 370, "vpn-f");
}

// G: a big power button, like the VPN apps; every place in its own view.
function vpnG(state) {
  if (state === "none") return vpnNone(360);
  const p = vpnParts(state);
  if (["search", "cities", "error"].includes(state)) return atSite(`${backTo("VPN", `<span class="sv">Places</span>`)}${field("Find a country or city", state === "search" ? "san" : "")}
    <div class="vfavs flat"><span class="pchip">${I("zap")}Fastest</span><span class="pchip on">${I("star-filled")}Zurich</span>${FAVS_V.map(([, city]) => `<span class="pchip">${I("star-filled")}${city}</span>`).join("")}</div>
    <div class="b-grp vlist tall">${p.list()}${state === "search" ? "" : COUNTRIES.slice(0, 2).map((c) => countryRow(c)).join("")}</div>`, 360, "vpn-g");
  const busy = state === "busy";
  const label = busy ? `<b class="warnt">Moving to Geneva…</b>` : p.on ? `<b class="ok">Connected</b>` : `<b>${state === "nows" ? "Off · Trips is set to No VPN" : "Off for this tab"}</b>`;
  const placeCard = `<div class="gplace">${flag(p.place[0], p.place[2])}<div class="rt"><b>${busy ? "Switzerland · Geneva" : p.place[1]}</b><span>${p.server} · Browser only</span></div>${p.pia ? "" : btn("Change", "", "globe")}</div>`;
  const menuOpen = state === "two" ? `<div class="pop b-pop b-ctx vmenu" style="left:338px;top:452px;width:250px">${menu([["plug", "NordVPN", "", { on: true }], ["plug", "Office proxy", "SOCKS5"], "-", ["plus", "Add a VPN…", ""]])}</div>` : "";
  return atSite(`${backTo("fieldnotes.example")}
    <div class="gpower ${p.on ? "on" : ""} ${busy ? "busy" : ""}"><span class="gbtn">${I("power")}</span>${label}</div>
    ${placeCard}
    ${p.pia ? "" : `<div class="vfavs flat"><span class="pchip">${I("zap")}Fastest</span><span class="pchip on">${I("star-filled")}Zurich</span>${FAVS_V.map(([, city]) => `<span class="pchip">${I("star-filled")}${city}</span>`).join("")}</div>`}
    ${state === "nows" ? `<p class="pnote pad">Turning it on gives Trips its own VPN; the other workspaces keep theirs.</p>` : ""}
    ${grp("", rws([["", "Use it for", "", seg(["Every workspace", "Trips only"], 0)], ["", "Connection", "", `<span class="drop ${state === "two" ? "on" : ""}">${I("plug")}${p.pia ? "Private Internet Access" : "NordVPN"}${I("chevron")}</span>`]]))}
    ${pfoot(`<span class="grow"></span><span class="lnk">VPN settings</span>`)}`, 360, "vpn-g") + menuOpen;
}

// ---------------------------------------------------------------------------------------------
// Extensions
// ---------------------------------------------------------------------------------------------
// [name, colour, letter or icon, state line, { on, pin, badge, built, priv }]
const XS = [
  ["Blocking", "var(--sw-coral)", "shield", "14 blocked", { on: true, badge: "14", built: true }],
  ["Passwords", "var(--sw-violet)", "key", "2 logins", { on: true, built: true }],
  ["VPN", "var(--sw-teal)", "globe", "Off", { on: false, built: true }],
  ["Dark Reader", "#2f2f36", "D", "Reads this site when clicked", { on: true, pin: true }],
  ["SponsorBlock", "#e0402a", "S", "Can't read this site", { on: true, badge: "3" }],
  ["Stash Tabs", "#1f6feb", "T", "Reads every site", { on: true, pin: true, priv: true }],
  ["Zotero Connector", "#c4302b", "Z", "Off", { on: false }],
];
const xic = (x, cls = "") => `<span class="xi ${cls}" style="--c:${x[1]}">${x[2].length > 1 ? I(x[2]) : x[2]}${x[4].badge ? `<em class="xbadge">${x[4].badge}</em>` : ""}</span>`;
function extMenu(left) {
  return `<div class="pop b-pop b-ctx xmenu" data-up="790" style="left:${left}px;top:0;width:270px">${menu([
    { h: "Dark Reader" }, ["pin", "Pin to the sidebar", "", { on: true }], ["back", "Move up", ""], ["forward", "Move down", ""], "-",
    { h: "Can read this site" }, [null, `<span class="radio on"></span>&nbsp;&nbsp;When you click it`, ""], [null, `<span class="radio"></span>&nbsp;&nbsp;Always on fieldnotes.example`, "", { hover: true }], [null, `<span class="radio"></span>&nbsp;&nbsp;On every site`, ""], "-",
    { h: "Dark Reader's own" }, ["moon", "Turn off for this site", ""], ["settings", "Dark Reader options", ""], "-",
    ["sliders", "Manage", ""], ["trash", "Remove…", "", { danger: true }], ["warning", "Report…", ""]])}</div>`;
}
const xmsgs = (state) => state === "blocked"
  ? banner("bad", "warning", "<b>Zotero Connector</b> was turned off: it breaks the rules for extensions.", `<span class="lnk">Details</span>`) + banner("info", "shield", "On sites Browser protects, like your bank's, extensions can't read the page.", `<span class="lnk">Let them on this site</span>`)
  : state === "attention" ? banner("info", "eye", "<b>SponsorBlock</b> wants to read fieldnotes.example. Click it to allow it this time.", "") : "";
const xprivOff = (x, state) => state === "private" && !x[4].priv && !x[4].built;

function extA(state) {
  const frameO = state === "private" ? { priv: true } : {};
  const list = state === "empty" ? XS.slice(0, 3) : XS;
  const t = (x) => {
    const off = !x[4].on || xprivOff(x, state);
    const hover = state === "menu" && x[0] === "Dark Reader";
    return `<div class="b-x ${off ? "off" : ""} ${hover ? "hover" : ""}">${xic(x, "lg")}${x[4].pin ? `<span class="pin">${I("pin")}</span>` : ""}${state === "attention" && x[0] === "SponsorBlock" ? `<span class="xdot"></span>` : ""}${!x[4].built ? `<span class="xmore ${hover ? "on" : ""}">${I("more")}</span>` : ""}<b>${x[0].replace(" Connector", "")}</b><span>${xprivOff(x, state) ? "Not in private" : x[4].built ? x[3] : !x[4].on ? "Off" : state === "attention" && x[0] === "SponsorBlock" ? "Wants access" : x[0] === "Stash Tabs" ? "Every site" : x[0] === "SponsorBlock" ? "No access" : "On click"}</span></div>`;
  };
  const body = `<div class="b-xh"><b>Extensions</b><span class="lnk">Manage</span></div>${xmsgs(state)}
    <div class="b-xg">${list.map(t).join("")}<div class="b-x add"><span class="xi lg">${I("plus")}</span><b>Get more</b><span>Add-ons site</span></div></div>
    ${state === "empty" ? empty(I("puzzle"), "var(--sw-violet)", "No extensions yet", "Add one for dark mode, reading lists, references and more.", btn("Get extensions", "accent", "search")) : ""}
    ${state === "private" ? `<div class="b-xf">${I("private")} Dimmed ones aren't allowed in private windows. Allow them in Manage.</div>` : state === "empty" ? "" : `<div class="b-xf">${I("eye")} Dark Reader can read this site when you click it</div>`}`;
  return B.frame({ ...frameO, on: "ext", extra: `<div class="pop b-pop b-ext pp" data-up="760" style="left:160px;top:0;width:360px">${body}</div>` + (state === "menu" ? extMenu(526) : "") });
}

function extB(state) {
  const frameO = state === "private" ? { priv: true } : {};
  const strip = `<div class="b-tgs three">${XS.slice(0, 3).map((x) => `<div class="b-tg ${x[4].on ? "on" : ""}" style="--c:${x[1]}">${I(x[2])}<b>${x[0]}</b><span>${x[3]}</span></div>`).join("")}</div>`;
  const xr = (x) => {
    const off = !x[4].on || xprivOff(x, state);
    const att = state === "attention" && x[0] === "SponsorBlock";
    const line = xprivOff(x, state) ? "Not allowed in private windows" : att ? `<span class="warnt">Wants to read this site · click to allow</span>` : x[0] === "Zotero Connector" && state === "blocked" ? `<span class="bad">Turned off: breaks the rules for extensions</span>` : x[3];
    return `<div class="xr ${off ? "off" : ""} ${state === "menu" && x[0] === "Dark Reader" ? "hover" : ""}">${xic(x)}${att ? `<span class="xdot"></span>` : ""}<div class="rt"><b>${x[0]}</b><span>${line}</span></div>${ib("pin", x[4].pin ? "on" : "", "Pin")}${ib("more", state === "menu" && x[0] === "Dark Reader" ? "on" : "")}</div>`;
  };
  const rowsH = state === "empty" ? empty(I("puzzle"), "var(--sw-violet)", "No extensions yet", "Add one for dark mode, reading lists, references and more.", btn("Get extensions", "accent", "search"))
    : grp("Added", XS.slice(3).map(xr).join(""));
  const body = `${head(tile("puzzle", "var(--sw-violet)"), "Extensions", state === "private" ? "In this private window" : "On fieldnotes.example")}${strip}${xmsgs(state)}${rowsH}
    ${pfoot(`<span class="lnk">${I("search")}Get more</span><span class="grow"></span><span class="lnk">Manage</span>`)}`;
  return B.frame({ ...frameO, on: "ext", extra: atFoot(body, 370, "ext-b") + (state === "menu" ? extMenu(526) : "") });
}

function extC(state) {
  const frameO = state === "private" ? { priv: true } : {};
  const reads = XS.slice(3).filter((x) => x[4].on);
  const siteRow = (x) => {
    const att = state === "attention" && x[0] === "SponsorBlock";
    const off = xprivOff(x, state);
    const ctl = off ? `<span class="chip">Not in private</span>` : att ? btn("Allow", "soft") : x[0] === "Dark Reader" ? seg(["On click", "Always"], 0) : x[0] === "Stash Tabs" ? `<span class="chip">${I("globe")}Every site</span>` : `<span class="chip">No access</span>`;
    return `<div class="xr ${off ? "off" : ""} ${state === "menu" && x[0] === "Dark Reader" ? "hover" : ""}">${xic(x)}${att ? `<span class="xdot"></span>` : ""}<div class="rt"><b>${x[0]}</b><span>${att ? `<span class="warnt">Wants to read this site</span>` : off ? "Not allowed in private windows" : x[0] === "Dark Reader" ? "Reads it when you click it" : x[0] === "Stash Tabs" ? "Reads every site" : "Doesn't read this site"}</span></div>${ctl}${ib("more", state === "menu" && x[0] === "Dark Reader" ? "on" : "")}</div>`;
  };
  const builtins = `<div class="xbuilt">${XS.slice(0, 3).map((x) => `<span class="xb ${x[4].on ? "on" : ""}" style="--c:${x[1]}">${I(x[2])}<b>${x[0]}</b><em>${x[3]}</em></span>`).join("")}</div>`;
  const body = state === "empty"
    ? `${head(fv("journal", "lg"), "fieldnotes.example", "What extensions can do here", `<span class="lnk">Manage</span>`)}${empty(I("puzzle"), "var(--sw-violet)", "No extensions yet", "Add one for dark mode, reading lists, references and more.", btn("Get extensions", "accent", "search"))}${builtins}`
    : `${head(state === "private" ? `<span class="tile" style="--c:var(--sw-violet)">${I("private")}</span>` : fv("journal", "lg"), state === "private" ? "Private window" : "fieldnotes.example", "What extensions can do here", `<span class="lnk">Manage</span>`)}
      ${xmsgs(state)}
      ${grp("On this site", reads.map(siteRow).join(""))}
      <div class="b-xg">${XS.slice(3).filter((x) => !x[4].on).map((x) => `<div class="b-x off">${xic(x, "lg")}<b>${x[0].replace(" Connector", "")}</b><span>${state === "blocked" ? "Blocked" : "Off"}</span></div>`).join("")}<div class="b-x add"><span class="xi lg">${I("plus")}</span><b>Get more</b><span>Add-ons site</span></div></div>
      ${builtins}`;
  return B.frame({ ...frameO, on: "ext", extra: atFoot(body, 380, "ext-c") + (state === "menu" ? extMenu(536) : "") });
}

// ---------------------------------------------------------------------------------------------
// Share
// ---------------------------------------------------------------------------------------------
const APPS = [["mail", "Mail", "var(--sw-blue)", "New message with the link"], ["message", "Messages", "var(--sw-green)", "Send it in a chat"], ["note", "Notes", "var(--sw-amber)", "Add it to a note"], ["cloud", "Cloud", "var(--sw-teal)", "Save it to your cloud"]];
const DEVS = [["phone", "Pixel 9", "var(--sw-green)", "Nearby · ready"], ["computer", "Office PC", "var(--sw-blue)", "Online · same account"], ["phone", "Kitchen tablet", "var(--sw-amber)", "Not connected"]];
function qrSvg() {
  let s = 7;
  const r = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  const n = 29, cells = [];
  const finder = (x, y) => { for (let i = 0; i < 7; i++) for (let j = 0; j < 7; j++) if (i === 0 || i === 6 || j === 0 || j === 6 || (i > 1 && i < 5 && j > 1 && j < 5)) cells.push([x + i, y + j]); };
  const inF = (x, y) => (x < 8 && y < 8) || (x > n - 9 && y < 8) || (x < 8 && y > n - 9);
  finder(0, 0); finder(n - 7, 0); finder(0, n - 7);
  for (let x = 0; x < n; x++) for (let y = 0; y < n; y++) if (!inF(x, y) && r() > 0.52) cells.push([x, y]);
  return `<svg class="qr" viewBox="-2 -2 ${n + 4} ${n + 4}"><rect x="-2" y="-2" width="${n + 4}" height="${n + 4}" fill="#fff"/>${cells.map(([x, y]) => `<rect x="${x}" y="${y}" width="1.02" height="1.02"/>`).join("")}</svg>`;
}
function shareParts(state) {
  const own = state === "own";
  const apps = state === "main" || state === "unavailable" || state === "qr";
  const devs = state === "main" || state === "unavailable" || state === "qr";
  const note = state === "looking" ? `<div class="snote">${spin("sm")}<span>Looking for where to share…</span></div>`
    : state === "nowhere" ? `<div class="snote">${I("help")}<span>Share has nowhere to send a link in one click.</span></div>`
    : state === "down" ? `<div class="snote">${I("warning")}<span>Share isn't available.</span></div>` : "";
  const appState = (a) => state === "unavailable" && a[1] === "Cloud" ? "Sign in to Cloud first" : "";
  const devState = (d) => d[1] === "Kitchen tablet" ? (state === "unavailable" ? d[3] : null) : d[3];
  return { own, apps, devs, note, appState, devState };
}
const pageHead = (own, right) => own ? head(`<span class="tile" style="--c:var(--sw-graphite)">${I("sliders")}</span>`, "Settings", "Browser's own page: no web address", right) : head(fv("journal", "lg"), "Water on the ridge", "fieldnotes.example/2026/11/water-on-the-ridge", right);
const shareFrame = (o, extra) => B.frame({ on: "site", url: o.own ? "about:settings" : "journal", active: o.own ? "settings" : "journal", page: o.own ? settingsPage("settings-general", "b") : undefined, extra });
const shareQR = (w, from) => atSite(`${backTo(from, `<span class="sv">QR code</span>`)}<div class="sqr">${qrSvg()}<p>Point your phone’s camera at it to open the page</p><span class="sqaddr">fieldnotes.example/2026/11/water-on-the-ridge</span>${btn("Save to Downloads", "accent", "download")}</div>`, w, "share-qr");

function shareA(state) {
  const p = shareParts(state);
  if (state === "qr") return shareFrame(p, shareQR(360, "Share"));
  const tileA = (ic, l, c, why = "") => `<div class="app ${why || p.own ? "off" : ""}"><span class="tile big" style="--c:${c}">${I(ic)}</span><span>${l}</span>${why ? `<em>${why}</em>` : ""}</div>`;
  const tiles = `<div class="apps sapps">${p.apps ? APPS.map((a) => tileA(a[0], a[1], a[2], p.appState(a))).join("") : ""}${tileA("qr", "QR code", "var(--sw-violet)")}</div>`;
  const devs = p.devs ? grp("Nearby", DEVS.filter((d) => p.devState(d) !== null).map((d) => { const off = d[3] === "Not connected"; return `<div class="row ${off ? "off" : ""}">${tile(d[0], d[2])}<div class="rt"><b>${d[1]}</b><span>${d[3]}</span></div>${btn("Send")}</div>`; }).join("")) : "";
  return shareFrame(p, atSite(`${backTo(p.own ? "Settings" : "fieldnotes.example")}${pageHead(p.own, btn("Copy link", p.own ? "off" : "", "link"))}
    ${grp("Send to", tiles + p.note)}${devs}
    ${pfoot(`<span class="${p.own ? "off" : ""}">${I("zap")} Copy a clean link, without trackers</span>${sw(!p.own)}<span class="grow"></span>${state === "down" ? "" : `<span class="lnk">More in Share ${I("external")}</span>`}`)}`, 360, "share-a"));
}

function shareB(state) {
  const p = shareParts(state);
  if (state === "qr") return shareFrame(p, shareQR(350, "Share"));
  const r = (ic, c, t, d, right = "", off = false) => `<div class="row ${off || p.own ? "off" : ""}">${tile(ic, c)}<div class="rt"><b>${t}</b><span>${d}</span></div>${right}</div>`;
  const first = grp("", r("link", "var(--sw-graphite)", "Copy link", "fieldnotes.example/2026/11/water-on-the-ridge") + r("zap", "var(--sw-green)", "Copy a clean link", "Without trackers like utm_source") + r("qr", "var(--sw-violet)", "QR code", "Open it on a phone", I("arrow-right", "dimi")));
  const apps = p.apps ? grp("Apps", APPS.map((a) => r(a[0], a[2], a[1], p.appState(a) || a[3], "", !!p.appState(a))).join("")) : `<div class="b-grp">${p.note}</div>`;
  const devs = p.devs ? grp("Nearby", DEVS.filter((d) => p.devState(d) !== null).map((d) => r(d[0], d[2], d[1], d[3], btn("Send"), d[3] === "Not connected")).join("")) : "";
  const more = state === "down" ? "" : grp("", r("external", "var(--sw-graphite)", "More in Share", "Every app and device Share knows", I("arrow-right", "dimi")));
  return shareFrame(p, atSite(`${backTo(p.own ? "Settings" : "fieldnotes.example")}${pageHead(p.own, "")}${first}${apps}${devs}${more}`, 350, "share-b"));
}

function shareC(state) {
  const p = shareParts(state);
  if (state === "qr") return shareFrame(p, shareQR(370, "Share"));
  const page = `<div class="spcard ${p.own ? "off" : ""}">${p.own ? `<div class="spthumb own">${I("sliders")}</div>` : `<div class="spthumb">${scene()}</div>`}<div class="sptxt"><b>${p.own ? "Settings" : "Water on the ridge"}</b><span>${p.own ? "Browser's own page: no web address" : "fieldnotes.example/2026/11/water-on-the-ridge"}</span><div class="spbtns">${btn("Copy link", "accent", "link")}${btn("Clean link", "", "zap")}</div></div></div>`;
  const sq = (ic, l, c, why = "") => `<div class="sq4 ${why || p.own ? "off" : ""}"><span class="tile" style="--c:${c}">${I(ic)}</span><b>${l}</b>${why ? `<em>${why}</em>` : ""}</div>`;
  const grid = `<div class="sgrid">${p.apps ? APPS.map((a) => sq(a[0], a[1], a[2], p.appState(a) ? "Sign in first" : "")).join("") : ""}${sq("qr", "QR code", "var(--sw-violet)")}</div>${p.note}`;
  const devs = p.devs ? `<div class="mh">Nearby</div><div class="sdevs">${DEVS.filter((d) => p.devState(d) !== null).map((d) => `<span class="sdev ${d[3] === "Not connected" || p.own ? "off" : ""}">${tile(d[0], d[2])}<span><b>${d[1]}</b><em>${d[3]}</em></span></span>`).join("")}</div>` : "";
  return shareFrame(p, atSite(`${backTo(p.own ? "Settings" : "fieldnotes.example")}${page}<div class="b-grp plain">${grid}${devs}</div>
    ${pfoot(`<span class="grow"></span>${state === "down" ? "" : `<span class="lnk">More in Share ${I("external")}</span>`}`)}`, 370, "share-c"));
}

// ---------------------------------------------------------------------------------------------
const pwPage = (state) => ({ url: "login", page: loginPage({ filled: state === "offer" }) });
const DRAW = {
  pw: (o, s) => B.frame({ ...pwPage(s), on: "site", extra: { a: pwA, b: pwB, c: pwC }[o](s || "site") }),
  vpn: (o, s) => B.frame({ on: "site", extra: { a: vpnA, b: vpnB, c: vpnC, d: vpnD, e: vpnE, f: vpnF, g: vpnG }[o](s || "on") }),
  ext: (o, s) => ({ a: extA, b: extB, c: extC }[o](s || "main")),
  share: (o, s) => ({ a: shareA, b: shareB, c: shareC }[o](s || "main")),
};
