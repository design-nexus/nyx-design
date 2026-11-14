// Personalization › Bar & Notifications (Omarchy's own bar): position, widgets, text size, notifications.
(() => {
  const S = "personalization";
  // Widgets: id -> [name, plugin id, how it looks in the bar]
  const WG = {
    menu: ["Omarchy menu", "omarchy.menu", () => `<span class="bw-logo"></span>`],
    ws: ["Workspaces", "omarchy.workspaces", () => `<span class="bw-ws"><b class="on">1</b><b>2</b><b>3</b><b>4</b></span>`],
    title: ["Window title", "omarchy.window", () => `<span class="bw-t">Notes</span>`],
    clock: ["Clock", "omarchy.clock", () => `<span class="bw-t b">Fri 14:17</span>`],
    media: ["Now playing", "omarchy.media", () => `<span class="bw-ic">${icon("music")}</span>`],
    tray: ["Tray", "omarchy.tray", () => `<span class="bw-ic">${icon("cloud")}${icon("chat")}</span>`],
    bt: ["Bluetooth", "omarchy.bluetooth", () => `<span class="bw-ic">${icon("bluetooth")}</span>`],
    net: ["Network", "omarchy.network", () => `<span class="bw-ic">${icon("wifi")}</span>`],
    vol: ["Sound", "omarchy.audio", () => `<span class="bw-ic">${icon("volume")}</span>`],
    bat: ["Battery", "omarchy.battery", () => `<span class="bw-ic">${icon("battery")}<small>86%</small></span>`],
    bell: ["Notifications", "omarchy.notifications", () => `<span class="bw-ic">${icon("bell")}</span>`],
    weather: ["Weather Glance", "skyline.weather", () => `<span class="bw-t">${icon("sun")}18°</span>`],
    cpu: ["CPU", "omarchy.cpu", () => `<span class="bw-t">${icon("cpu")}12%</span>`],
    upd: ["Updates", "omarchy.updates", () => `<span class="bw-t">${icon("download")}12</span>`],
    rec: ["Screen recording", "omarchy.recording", () => `<span class="bw-ic">${icon("screenshot")}</span>`],
    kb: ["Keyboard layout", "omarchy.keyboard", () => `<span class="bw-t">EN</span>`],
    spacer: ["Spacer", "16 px", () => `<span class="bw-sp"></span>`],
  };
  const L = ["menu", "ws", "title"], C = ["clock"], R = ["media", "weather", "tray", "spacer", "bt", "net", "vol", "bat", "bell"];
  const ADD = ["cpu", "upd", "rec", "kb"];
  const draw = (ids, hot) => ids.map((k) => `<span class="bwi ${k === hot ? "hot" : ""}">${WG[k][2]()}</span>`).join("");
  // The bar at full size.
  const obar = (o = {}) => `<div class="obar ${o.cls || ""}"><div class="ob-l">${draw(L, o.hot)}</div><div class="ob-c">${draw(C, o.hot)}</div><div class="ob-r">${draw(R, o.hot)}</div></div>`;
  // A small screen with the bar on one edge.
  const oscreen = (pos = "top", o = {}) => `<div class="osc pos-${pos} ${o.cls || ""} ${o.transparent ? "tr" : ""} ${o.full ? "full" : ""}">
      ${o.full ? obar({ hot: o.hot, cls: `on-${pos}` }) : `<div class="osc-bar">${pos === "top" || pos === "bottom" ? `<span class="m"></span><span class="w"><b class="on"></b><b></b><b></b></span><span class="c"></span><span class="r"><b></b><b></b><b></b><b></b></span>` : `<span class="m"></span><span class="w"><b class="on"></b><b></b><b></b></span><span class="r"><b></b><b></b><b></b></span>`}</div>`}
      <div class="osc-area"><i class="a"></i><i class="b"></i></div>
      ${o.toasts ? `<div class="osc-toasts">${o.toasts}</div>` : ""}
    </div>`;
  const posCards = (on = "top") => `<div class="ob-pos">${["top", "bottom", "left", "right"].map((p) => `<div class="obp ${p === on ? "on" : ""}">${oscreen(p, { cls: "tiny" })}<span>${p[0].toUpperCase() + p.slice(1)}</span></div>`).join("")}</div>`;

  const NOTES = [["chat", "Sam Rivera", "Lunch at 1? The place by the harbour.", "Messages · now", "blue"], ["download", "12 updates are ready", "About 4 minutes, then a restart.", "Updates · 10 min", "red"], ["screenshot", "Screenshot saved", "Pictures › Screenshots", "Capture · 25 min", "teal"], ["calendar", "Design review in 15 minutes", "Room 2 · with Priya and Jon", "Calendar · 1 h", "violet"], ["battery", "Battery at 20%", "Plug in soon, or Power saver turns on.", "Power · 2 h", "amber"], ["music", "Now playing: Evening Tide", "Harbour Lights", "Music · 3 h", "coral"]];
  const toast = ([ic, t, b, m, c], cls = "") => `<div class="otoast ${cls}" style="--tc:var(--sw-${c})"><span class="oti">${icon(ic)}</span><div><b>${t}</b><span>${b}</span></div><small>${m.split(" · ")[1]}</small></div>`;

  /* ═══ A: the bar drawn big ═════════════════════════════════════════ */
  const aCtl = () => `
    <div class="gtitle first">Position</div>
    ${posCards("top")}
    ${ocard("", [orow("Transparent background", "Let the wallpaper show through", sw(false)), orow("Text size", "The bar, menus and panels", sl(22, "11 pt", 110)), orow("Show or hide the bar", keys("Super", "Shift", "Space"), btn("Toggle", "sm"))])}
    ${ocard("Notifications", [orow("Do not disturb", keys("Super", "Ctrl", ","), sw(false), { ic: "moon", sec: S }), orow("Showing now", "2 on screen", btn("Dismiss all", "sm"), { ic: "bell", sec: S }), nrow("Recent notifications", "", "6", { ic: "history", sec: S })], { cls: "icons" })}`;
  const zone = (t, ids, n) => `<div class="obz"><div class="obzh">${t}<span>${n}</span></div><div class="obzc">${ids.map((k) => `<span class="obchip ${k === "weather" ? "drag" : ""} ${k === "spacer" ? "spc" : ""}"><span class="obcv">${WG[k][2]()}</span><small>${WG[k][0]}</small></span>`).join("")}</div></div>`;
  const aPv = () => `
    ${pvhead("Your bar", "Drag a widget to reorder it or move it to another section.", btn("Restore Omarchy's bar", "sm ghost", "history"))}
    <div class="ob-stage">${oscreen("top", { cls: "big", full: true, hot: "weather", toasts: toast(NOTES[0]) })}</div>
    ${NARROW ? obar({ hot: "weather" }) : ""}
    <div class="obzs">${zone("Left", L, 3)}${zone("Center", C, 1)}${zone("Right", R, 9)}</div>
    <div class="obadd"><span class="dim">Add</span>${ADD.map((k) => chip(WG[k][0], "", "plus")).join("")}${chip("Spacer", "", "plus")}</div>`;

  /* ═══ B: two pages, Bar and Notifications ══════════════════════════ */
  const halves = (on) => `<div class="ob-half">${seg(["Bar", "Notifications"], on)}</div>`;
  const bNotesCtl = () => `
    ${halves("Notifications")}
    ${ocard("", [orow("<b>Do not disturb</b>", "Silence pop-ups until you turn it back on", sw(false), { ic: "moon", sec: S }), orow("Shortcut", "", keys("Super", "Ctrl", ","), { ic: "keyboard", sec: S })], { cls: "icons" })}
    <div class="gtitle gflex">Recent<span class="sp"></span>${btn("Clear history", "sm ghost dtext")}</div>
    <div class="card ob-hist">${NOTES.map(([ic, t, b, m, c]) => `<div class="opt"><span class="lic" style="--tc:var(--sw-${c})">${icon(ic)}</span><div class="opt-text"><div>${t}</div><div class="d">${m}</div></div></div>`).join("")}</div>`;
  const bNotesPv = () => `
    ${pvhead("On your screen", "New notifications stack in the corner; the newest is on top.", btn("Dismiss all", "sm"))}
    <div class="ob-nstage">
      ${oscreen("top", { cls: "big nt", full: true })}
      <div class="ob-stack">${toast(NOTES[0], "big")}${toast(NOTES[1], "big")}</div>
    </div>
    <div class="card ob-dnd"><span class="lic" style="--tc:var(--sec-${S})">${icon("moon")}</span><div class="opt-text"><div>With Do not disturb on</div><div class="d">Nothing pops up and the bell in the bar shows a moon. Notifications still go to Recent, so you can catch up later.</div></div></div>`;
  const bBarCtl = () => `
    ${halves("Bar")}
    <div class="gtitle">Position</div>${posCards("bottom")}
    ${ocard("", [orow("Transparent background", "", sw(true)), orow("Text size", "", sl(22, "11 pt", 110)), orow("Show or hide", keys("Super", "Shift", "Space"), btn("Toggle", "sm"))])}
    ${ocard("", [nrow("Widgets", "", "13 in 3 sections", { ic: "grid", sec: S }), nrow("Restore Omarchy's bar", "", "", { ic: "history", sec: S })], { cls: "icons" })}`;
  const bBarPv = () => `
    ${pvhead("At the bottom, see-through", "The wallpaper shows through the bar.", "")}
    <div class="ob-stage">${oscreen("bottom", { cls: "big", transparent: true, full: true })}</div>`;

  /* ═══ C: the widget list with details ══════════════════════════════ */
  const wrow = (k, on) => `<div class="opt obw ${on ? "picked" : ""}">${icon("dots", "obh")}<span class="obwv">${WG[k][2]()}</span><div class="opt-text"><div>${WG[k][0]}</div></div><span class="obid">${WG[k][1]}</span></div>`;
  const sect = (t, ids, hot) => `<div class="gtitle gflex">${t}<span class="note">· ${ids.length}</span><span class="sp"></span>${btn("Spacer", "sm ghost", "plus")}</div><div class="card">${ids.map((k) => wrow(k, k === hot)).join("")}</div>`;
  const cCtl = () => `
    <div class="ob-top card">${seg(["Top", "Bottom", "Left", "Right"], "Top")}<span class="sp"></span><span>See-through</span>${sw(false)}</div>
    ${sect("Left", L)}${sect("Center", C, "clock")}${sect("Right", R.slice(0, 5))}`;
  const cPv = () => `
    ${pvhead("Clock", "omarchy.clock · from Omarchy", `${btn("Remove from bar", "sm ghost dtext")}`)}
    ${obar({ hot: "clock", cls: "solo" })}
    <div class="ob-callout"><span></span></div>
    <div class="card ob-det">
      ${orow("Section", "Kept in the middle of the screen, whatever is on either side.", seg(["Left", "Center", "Right"], "Center"))}
      ${orow("Order", "The only widget in Center.", `<span class="obud">${ib("chev-u", "Move up")}${ib("chev-d", "Move down")}</span>`)}
      ${nrow("Its own settings", "Date format, 24-hour time, the calendar it opens", "Time & Language")}
    </div>
    <div class="ob-pop card"><div class="obp-h"><b>November 2026</b><span class="dim">A click on the clock opens this</span></div><div class="obp-g">${["M", "T", "W", "T", "F", "S", "S"].map((d) => `<small>${d}</small>`).join("")}${Array.from({ length: 35 }, (_, i) => { const d = i - 5; return `<span class="${d === 13 ? "on" : d < 1 || d > 30 ? "dim" : ""}">${d < 1 ? 26 + d + 5 : d > 30 ? d - 30 : d}</span>`; }).join("")}</div></div>`;

  const W = (body) => swin({ sec: S, page: "Bar & Notifications", desc: "Where the bar sits, what's on it, and how notifications behave.", body });
  REG("bar", {
    name: "Bar & Notifications",
    summary: "Omarchy's bar: four position cards, a transparency switch and a Toggle button, then the widgets as long Left, Center and Right lists with arrows and a ⋯ menu, the shell's text size, and notifications (Do not disturb, dismiss, history) at the very bottom.",
    problems: [
      "<b>The widgets are a list of names:</b> “Omarchy menu, omarchy.menu” with arrows; nothing shows what the bar will look like after a move.",
      "<b>The bar itself isn't on the page:</b> the position cards draw a blue line, but there's no picture of your bar with its clock, tray and icons.",
      "<b>Notifications are buried:</b> Do not disturb and the history sit under three widget lists and a folded Shell text group; most people come for those.",
      "<b>Big position cards:</b> four cards 140 px wide take the first screen at 800 px, for a choice made once.",
      "<b>Plugin ids everywhere:</b> every widget row shows its id in monospace under the name.",
    ],
    today: [["bar-1280", "Today", ""], ["bar-800", "Today at 800 px", ""]],
    options: [
      { id: "a", name: "The bar drawn big", idea: "The right side shows your screen with the bar where it sits, then the bar itself at full size, then its three sections as chips you drag between, with widgets to add underneath. Position, transparency and text size are on the left with notifications under them, so Do not disturb is on the first screen.",
        shots: [["a", "Dragging Weather Glance", "The bar, then its sections"], ["a-800", "At 800 px", "The bar above the controls"]] },
      { id: "b", name: "Bar and Notifications, side by side", idea: "A switch at the top splits the page in two. Notifications shows Do not disturb and your recent notifications on the left, and how they appear on screen on the right. Bar has the position, transparency and text size with the screen beside them; the widgets are one row that opens the arrangement.",
        shots: [["b", "Notifications", "Recent ones on the left, the screen on the right"], ["b-bar", "Bar", "At the bottom, see-through"]] },
      { id: "c", name: "Widget list with details", idea: "Position and transparency are one line at the top; below, each section is a short list of its widgets drawn as they look in the bar. Picking one highlights it in the bar on the right and shows what it is, where it sits, and what a click on it opens, with Move and Remove beside it.",
        shots: [["c", "The clock picked", "Its section, its order, its calendar"]] },
    ],
    pages: {
      a: () => W(split(aCtl(), aPv(), { sec: S, ctlw: 400, cls: "ob-a" })),
      b: () => W(split(bNotesCtl(), bNotesPv(), { sec: S, ctlw: 400, cls: "ob-b" })),
      "b-bar": () => W(split(bBarCtl(), bBarPv(), { sec: S, ctlw: 400, cls: "ob-b" })),
      c: () => W(split(cCtl(), cPv(), { sec: S, ctlw: 420, cls: "ob-c" })),
    },
  });
})();
