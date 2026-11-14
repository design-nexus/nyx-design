// Personalization › Bar Plugins: add, update, turn on or off, and remove the bar's plugins.
(() => {
  const S = "personalization";
  // [key, name, id, kinds, on, colour, icon, author, update?]
  const ADDED = [
    ["pomo", "Pomodoro", "rpark.pomodoro", ["bar widget", "panel"], true, "coral", "clock", "Rina Park", "1.4"],
    ["weather", "Weather Glance", "skyline.weather", ["bar widget"], true, "amber", "sun", "Skyline", ""],
    ["vault", "Vaultkey", "vaultkey.bar", ["bar widget", "service"], true, "green", "lock", "Vaultkey", "2.1"],
    ["tunes", "Now Playing+", "tunes.nowplaying", ["bar widget"], false, "pink", "music", "Theo Marsh", ""],
    ["sync", "Lumen Sync", "lumen.sync", ["service"], true, "teal", "refresh", "Lumen", ""],
  ];
  const P = (k) => ADDED.find((p) => p[0] === k);
  const tile = (p, s = 30) => `<span class="pg-t" style="--tc:var(--sw-${p[5]});width:${s}px;height:${s}px">${icon(p[6])}</span>`;
  const kinds = (ks) => ks.map((k) => `<span class="pg-k">${k}</span>`).join("");

  // A bar with each plugin's widget: o = { hot, off: [keys], callouts }
  const W = {
    pomo: () => `${icon("clock")}18:42`,
    weather: () => `${icon("sun")}18°`,
    vault: () => `${icon("lock")}`,
    tunes: () => `${icon("music")}`,
  };
  const co = (o, label, cls = "") => o.callouts ? `<em class="pg-co ${cls}"><i></i><span>${label}</span></em>` : "";
  const LBL = { pomo: "Pomodoro", weather: "Weather Glance", tunes: "Now Playing+ · off", vault: "Vaultkey" };
  const pbar = (o = {}) => `<div class="pg-bar ${o.cls || ""} ${o.right ? "right" : ""}">
      ${o.right ? "" : `<span class="pgl"><span class="pg-logo">${co(o, "Omarchy", "own first")}</span><span class="pg-ws"><b class="on">1</b><b>2</b><b>3</b></span></span>
      <span class="pgc">Fri 14:17${co(o, "Omarchy", "own")}</span>`}
      <span class="pgr">${["pomo", "weather", "tunes", "vault"].map((k, i) => `<span class="pgw ${k === o.hot ? "hot" : ""} ${(o.off || []).includes(k) ? "off" : ""}">${W[k]()}${co(o, LBL[k], `l${i + 1}`)}</span>`).join("")}<span class="pgw sys">${icon("wifi")}${icon("volume")}${icon("battery")}${co(o, "Omarchy", "own deep")}</span><span class="pgw sys">${icon("bell")}</span></span>
    </div>`;

  const updBar = (n) => `<div class="card pg-upd"><span class="lic" style="--tc:var(--sec-${S})">${icon("download")}</span><div class="opt-text"><div><b>${n} updates</b></div><div class="d">Pomodoro 1.4 and Vaultkey 2.1</div></div>${btn("Update all", "primary sm")}</div>`;
  const prow = (p, o = {}) => `<div class="opt pg-row ${o.sel ? "picked" : ""}">${tile(p)}<div class="opt-text"><div>${p[1]}${p[8] ? `<span class="pg-new">Update</span>` : ""}</div><div class="d">${o.short ? p[3].join(", ") : `${p[3].join(" · ")}`}</div></div>${sw(p[4])}</div>`;

  /* ═══ A: list + detail ═════════════════════════════════════════════ */
  const aCtl = () => `
    ${updBar(2)}
    <div class="gtitle gflex">Added by you<span class="note">· 5</span><span class="sp"></span>${btn("Find more", "sm ghost", "search")}</div>
    <div class="card">${ADDED.map((p) => prow(p, { sel: p[0] === "pomo" })).join("")}</div>
    ${ocard("", [nrow("Omarchy's own", "Clock, workspaces, battery and more", "10 of 12 on", { ic: "nyxapp", sec: S })], { cls: "icons" })}`;
  const panel = () => `<div class="pg-panel"><div class="pgp-h"><b>Pomodoro</b><span>${icon("cog")}</span></div><div class="pgp-r">${ring(62, { size: 92, c: "var(--sw-coral)", label: "18:42" })}</div><div class="pgp-t">Focus · 2 of 4</div><div class="pgp-b"><span>Pause</span><span class="p">Skip</span></div></div>`;
  const aPv = () => { const p = P("pomo"); return `
    <div class="pg-dh">${tile(p, 48)}<div><b>${p[1]}</b><span>By ${p[7]} · version 1.3 · from GitHub</span></div><span class="sp"></span>${btn("Update to 1.4", "", "download")}${btn("Remove", "ghost dtext", "trash")}</div>
    <div class="pg-sec">What it adds</div>
    <div class="pg-adds">
      <div class="card pg-add w"><div class="pg-ah"><span class="pg-k">bar widget</span><span class="dim">In the bar's right section</span></div><div class="pg-wall">${pbar({ hot: "pomo", right: true })}</div></div>
      <div class="card pg-add"><div class="pg-ah"><span class="pg-k">panel</span><span class="dim">Opens from the widget</span></div><div class="pg-wall p">${panel()}</div></div>
    </div>
    <div class="card pg-facts">${[["Plugin", "rpark.pomodoro"], ["Source", "github.com/rpark/pomodoro"], ["Updated", "3 weeks ago"], ["New in 1.4", "Long breaks after every fourth focus"]].map(([k, v]) => `<div><small>${k}</small><span>${v}</span></div>`).join("")}</div>
    ${pvfoot("Plugins are added from git and run as you; only add ones you trust.", "shield", `<span class="lnk">Place it on the bar ${icon("chev-r")}</span>`)}`; };

  /* ═══ B: a catalog to browse ═══════════════════════════════════════ */
  const CAT = [
    ["Pomodoro", "Focus timer in the bar, with a panel for breaks.", "coral", "clock", "Rina Park", "added"],
    ["Weather Glance", "Today's weather; a click shows the week.", "amber", "sun", "Skyline", "added"],
    ["Stand Up", "A nudge to stretch every hour you've been typing.", "green", "user", "Moss Labs", ""],
    ["Clip Shelf", "Your last 20 copies, one click from the bar.", "blue", "copy", "Juno Reyes", ""],
    ["Mic Light", "Shows when any app is using the microphone.", "red", "mic", "Omarchy", "official"],
    ["Ping", "Your connection's speed and delay at a glance.", "teal", "network", "Arlo Finch", ""],
  ];
  const bCtl = () => `
    ${ocard("", [orow("Update all", "2 updates: Pomodoro, Vaultkey", btn("Update", "sm"), { ic: "download", sec: S })], { cls: "icons", first: true })}
    <div class="gtitle gflex">Installed<span class="note">· 5 added, 12 from Omarchy</span></div>
    <div class="card">${ADDED.map((p) => prow(p, { short: true })).join("")}</div>
    ${ocard("", [nrow("Omarchy's own", "", "10 of 12 on", { ic: "nyxapp", sec: S })], { cls: "icons" })}`;
  const bPv = () => `
    ${pvhead("Find more", "From the Omarchy plugin catalog.", `<div class="field pg-search">${icon("search")}<span class="ph">Search plugins</span></div>`)}
    <div class="pvchips">${["Popular", "New", "Productivity", "System", "Media", "Fun"].map((c, i) => chip(c, i === 0 ? "on" : "")).join("")}</div>
    <div class="pg-cat">${CAT.map(([n, d, c, ic, a, st]) => `<div class="card pg-cc"><div class="pg-cch"><span class="pg-t" style="--tc:var(--sw-${c});width:38px;height:38px">${icon(ic)}</span><div><b>${n}</b><span>${a}${st === "official" ? ` <span class="pg-off">${icon("check-c")}Omarchy</span>` : ""}</span></div></div><p>${d}</p><div class="pg-ccf">${st === "added" ? `<span class="pill dot">Added</span>` : btn("Add", "sm", "plus")}<span class="sp"></span><span class="dim">${[1240, 860, 412, 2290, 3105, 690][CAT.findIndex((x) => x[0] === n)].toLocaleString("en")} users</span></div></div>`).join("")}</div>
    ${pvfoot("Adding one fetches it with git and asks before it runs anything.", "shield")}`;

  /* ═══ C: plugins on your bar ═══════════════════════════════════════ */
  const cCtl = () => `
    ${updBar(2)}
    ${ocard("In the bar", ADDED.filter((p) => p[3].includes("bar widget")).map((p) => prow(p, { sel: p[0] === "tunes" })))}
    ${ocard("In the background", ADDED.filter((p) => !p[3].includes("bar widget")).map((p) => prow(p)))}
    ${ocard("", [nrow("Omarchy's own", "", "10 of 12 on", { ic: "nyxapp", sec: S }), nrow("Find more in the catalog", "", "", { ic: "search", sec: S })], { cls: "icons" })}`;
  const cPv = () => `
    ${pvhead("Your bar, by plugin", "Each part of the bar and the plugin it comes from. Now Playing+ is off.", "")}
    <div class="pg-stage">
      <div class="pg-wall big">${pbar({ off: ["tunes"], cls: "big", callouts: true })}</div>
    </div>
    <div class="card pg-bg"><div class="pg-bgh">Running in the background</div>${[[P("vault"), "Unlocks with your sign-in; the bar's lock opens it"], [P("sync"), "Keeps notes in step with your phone · no part in the bar"]].map(([p, d]) => `<div class="pg-bgr">${tile(p, 26)}<div><b>${p[1]}</b><span>${d}</span></div><span class="pill dot">Running</span></div>`).join("")}</div>`;

  const Wn = (body) => swin({ sec: S, page: "Bar Plugins", desc: "Plugins for the bar: turn them on or off, keep them updated, find more.", body });
  REG("plugins", {
    name: "Bar Plugins",
    summary: "Two buttons (Update all, and Catalog, which opens the website), then every plugin as a row: its name, its id in monospace, what kinds of thing it adds, a bin and a switch. Omarchy's own plugins follow in a second list of the same rows.",
    problems: [
      "<b>Ids instead of descriptions:</b> each row says <tt>vendor.plugin-name · bar widget, service</tt>; nothing says what the plugin does or where it shows up.",
      "<b>No updates in sight:</b> Update all fetches everything blind; nothing says which plugins have a new version or what changed.",
      "<b>Finding more leaves the app:</b> Catalog opens a browser; there's no way to add a plugin from here.",
      "<b>Omarchy's own plugins fill the page:</b> a dozen rows that are rarely touched follow the ones you added.",
      "<b>Remove is a bare bin icon</b> beside the switch on every row, armed by a first click with only a toast to say so.",
    ],
    today: [["plugins-1280", "Today", ""], ["plugins-800", "Today at 800 px", ""]],
    options: [
      { id: "a", name: "List with details", idea: "Your plugins are a short list with switches, with updates waiting in a bar at the top and Omarchy's own plugins as one row. Picking one shows what it adds, drawn: its widget in the bar, its panel, and what runs in the background, with who made it, the version and Update or Remove.",
        shots: [["a", "Pomodoro picked", "Its widget and its panel, drawn"], ["a-800", "At 800 px", "The detail above the list"]] },
      { id: "b", name: "Installed beside the catalog", idea: "The left keeps what you have, compact. The right is the catalog, browsed in the app: search, a few categories, and cards that say in a sentence what each plugin does, with Add on each. Adding fetches the plugin and asks before it runs anything.",
        shots: [["b", "Find more", "The catalog in the page"]] },
      { id: "c", name: "Plugins on your bar", idea: "The bar is drawn at full size with each part labelled by the plugin it comes from, so you can tell which switch does what; turning one off leaves a gap in the picture. Plugins with no part in the bar are listed underneath as running in the background.",
        shots: [["c", "Your bar, by plugin", "Now Playing+ turned off"]] },
    ],
    pages: {
      a: () => Wn(split(aCtl(), aPv(), { sec: S, ctlw: 380, cls: "pg-a" })),
      b: () => Wn(split(bCtl(), bPv(), { sec: S, ctlw: 360, cls: "pg-b" })),
      c: () => Wn(split(cCtl(), cPv(), { sec: S, ctlw: 380, cls: "pg-c" })),
    },
  });
})();
