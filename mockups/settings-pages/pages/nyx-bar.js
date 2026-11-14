// Personalization › Bar (Nyx Bar, where it's installed): size, status pill, clock, workspaces, arrangement.
(() => {
  const S = "personalization";
  const APPC = ["#7aa2f7", "#9ece6a", "#bb9af7", "#ff9e64"];
  const appI = (i, s = 12) => `<i class="nbap" style="background:${APPC[i % 4]};width:${s}px;height:${s}px"></i>`;
  // The workspaces in each look.
  const WS = {
    pills: () => `<span class="nbws pills"><b>1</b><b class="on">${appI(0)}${appI(1)}${appI(2)}</b><b>3</b><b>4</b></span>`,
    numbers: () => `<span class="nbws nums"><b>1</b><b class="on">2</b><b>3</b><b>4</b></span>`,
    icons: () => `<span class="nbws icons"><b>${appI(3)}</b><b class="on">${appI(0)}${appI(1)}</b><b>${appI(2)}</b></span>`,
    dots: () => `<span class="nbws dots"><b></b><b class="on"></b><b></b><b></b></span>`,
    underline: () => `<span class="nbws under"><b>1</b><b class="on">2</b><b>3</b><b>4</b></span>`,
  };
  const DATES = { short: "Fri Nov 13", long: "Friday, November 13", num: "11/13", none: "" };
  const STAT = () => [icon("wifi"), icon("bluetooth"), icon("volume"), icon("battery")];
  // Items: id -> [name, what it is, drawing]
  const IT = {
    ws: ["Workspaces", "nyx.workspaces", (o) => WS[o.ws || "pills"]()],
    win: ["Window title", "nyx.window", () => `<span class="nbt">${appI(0, 13)}Notes</span>`],
    clock: ["Clock", "nyx.clock", (o) => `<span class="nbt b">${DATES[o.date || "short"] ? `<span class="nbd">${DATES[o.date || "short"]}</span>` : ""}${o.h12 ? "2:17 PM" : "14:17"}${o.secs ? "<span class=nbd>:42</span>" : ""}</span>`],
    ai: ["AI Hub", "aihub.status", () => `<span class="nbt">${icon("sparkle")}</span>`],
    media: ["Now playing", "nyx.media", () => `<span class="nbt">${icon("music")}</span>`],
    weather: ["Weather", "nyx.weather", () => `<span class="nbt">${icon("sun")}18°</span>`],
    tray: ["Tray", "nyx.tray", () => `<span class="nbt">${icon("cloud")}</span>`],
    status: ["Status icons", "nyx.system", (o) => o.each ? STAT().map((x) => `<span class="nbp">${x}</span>`).join("") : `<span class="nbt">${STAT().join("")}</span>`],
    bell: ["Notifications", "nyx.notifications", () => `<span class="nbt">${icon("bell")}</span>`],
  };
  // Sections: entries are an id, a pill [ids], "|" (a divider) or "*" (other plugins).
  const LAYOUT = [[["ws"], "win"], [["clock"]], ["*", ["media", "ai"], "|", ["status"], "bell"]];
  const entry = (e, o) => {
    if (e === "|") return `<span class="nbdiv"></span>`;
    if (e === "*") return "";
    if (Array.isArray(e)) {
      if (e[0] === "status" && o.each) return IT.status[2](o);
      return `<span class="nbp ${e.includes(o.hot) ? "hot" : ""}">${e.map((k) => IT[k][2](o)).join("")}</span>`;
    }
    return `<span class="nbi ${e === o.hot ? "hot" : ""}">${IT[e][2](o)}</span>`;
  };
  const nbar = (o = {}) => `<div class="nbar ${o.cls || ""} ${o.edit ? "edit" : ""}" style="--h:${o.size || 32}px">${LAYOUT.map((sec, i) => `<div class="nbs s${i}">${o.edit ? `<em>${["Left", "Center", "Right"][i]}</em>` : ""}${sec.map((e) => entry(e, o)).join("")}</div>`).join("")}</div>`;
  const wall = (inner, cls = "") => `<div class="nbwall ${cls}"><i class="b1"></i><i class="b2"></i>${inner}</div>`;
  const calPop = (agenda = true) => `<div class="nbcal ${agenda ? "wide" : ""}"><div class="nbm"><div class="nbmh"><b>November 2026</b><span>${icon("chev-l")}${icon("chev-r")}</span></div><div class="nbmg">${["M", "T", "W", "T", "F", "S", "S"].map((d) => `<small>${d}</small>`).join("")}${Array.from({ length: 35 }, (_, i) => { const d = i - 5; return `<span class="${d === 13 ? "on" : d < 1 || d > 30 ? "dim" : ""} ${[4, 13, 18, 24].includes(d) ? "ev" : ""}">${d < 1 ? 26 + d + 5 : d > 30 ? d - 30 : d}</span>`; }).join("")}</div></div>
    ${agenda ? `<div class="nbag"><div class="nbah">Today</div>${[["15:00", "Design review", "violet"], ["17:30", "Pick up the bike", "amber"]].map(([t, n, c]) => `<div class="nbae" style="--tc:var(--sw-${c})"><i></i><div><b>${n}</b><span>${t}</span></div></div>`).join("")}<div class="nbah">Reminders</div><div class="nbae rem" style="--tc:var(--sw-teal)"><i></i><div><b>Call Sam back</b><span>Tomorrow</span></div></div></div>` : ""}</div>`;

  /* ═══ A: the bar at full size ══════════════════════════════════════ */
  const wsPick = (on) => `<div class="nbwp">${Object.keys(WS).map((k) => `<div class="nbw ${k === on ? "on" : ""}"><div class="nbwv">${WS[k]()}</div><span>${{ pills: "Pills", numbers: "Numbers", icons: "App icons", dots: "Dots", underline: "Underline" }[k]}</span></div>`).join("")}</div>`;
  const aCtl = () => `
    ${ocard("Bar", [orow("Size", "Height, text and icons", seg(["28", "32", "36", "40 px"], "32")), orow("Status icons in one pill", "Opens Control Center", sw(true))], { first: true })}
    ${ocard("Clock", [orow("Date", "", dd("Fri Nov 13")), orow("Time", "", seg(["Automatic", "12-hour", "24-hour"], "Automatic")), orow("Seconds", "", sw(false)), orow("A click opens", "", dd("Month and agenda"))])}
    <div class="gtitle">Workspaces</div>${wsPick("pills")}
    ${ocard("", [nrow("Arrangement", "What sits where, pills and dividers", "11 items", { ic: "grid", sec: S })], { cls: "icons" })}`;
  const aPv = () => `
    ${pvhead("Your bar, at full size", "Hover a part to see what it is; click it to jump to its setting.", "")}
    ${wall(`${nbar({ hot: "clock" })}<div class="nbpop">${calPop(true)}</div>`, "tall")}
    <div class="nbsz card"><span class="dim">Sizes</span>${[28, 32, 36, 40].map((h) => `<div class="nbszi ${h === 32 ? "on" : ""}"><span class="nbszb" style="height:${h * 0.75}px"></span><small>${h}</small></div>`).join("")}<span class="nbszt">32 px fits most screens; 36 or 40 suits a big screen seen from further away.</span></div>`;

  /* ═══ B: arrangement ═══════════════════════════════════════════════ */
  const card = (e, o = {}) => {
    if (e === "|") return `<div class="nbc div"><span class="nbdl"></span><small>Divider</small>${icon("dots", "nbm2")}</div>`;
    if (e === "*") return `<div class="nbc other">${icon("puzzle")}<div><b>Other plugins</b><small>Plugins this layout doesn't place go here</small></div></div>`;
    const ids = Array.isArray(e) ? e : [e];
    const pill = Array.isArray(e);
    return `<div class="nbc ${pill ? "pl" : ""} ${o.drag ? "drag" : ""}">${pill ? `<div class="nbph">${icon("dots", "nbh")}<span>${ids.length > 1 ? "Pill" : "On a pill of its own"}</span></div>` : ""}${ids.map((k) => `<div class="nbci">${pill ? "" : icon("dots", "nbh")}<span class="nbcv">${IT[k][2]({ date: "none" })}</span><b>${IT[k][0]}</b></div>`).join("")}</div>`;
  };
  const bCtl = () => `
    ${ocard("Look", [orow("Size", "", dd("Default (32 px)")), orow("Status icons in one pill", "", sw(true)), orow("Workspaces", "", dd("Pills"))], { first: true })}
    ${ocard("Clock", [orow("Date", "", dd("Fri Nov 13")), orow("Time", "", dd("Automatic")), orow("Seconds", "", sw(false)), orow("A click opens", "", dd("Month and agenda"))])}
    ${ocard("", [orow("Reset to NyxOS's arrangement", "Size, clock and workspaces stay", btn("Reset", "sm"))])}`;
  const bPv = () => `
    ${pvhead("Arrangement", "Drag an item to reorder it or move it to another section. Drop one on another to share a pill.", "")}
    ${nbar({ edit: true, cls: "solo" })}
    <div class="nbcols">${LAYOUT.map((sec, i) => `<div class="nbcol"><div class="nbch">${["Left", "Center", "Right"][i]}<span>${sec.filter((e) => e !== "|" && e !== "*").length}</span></div>${sec.map((e) => card(e, { drag: i === 2 && Array.isArray(e) && e[0] === "media" })).join("")}${i === 1 ? `<div class="nbdrop">Drop items here</div>` : ""}</div>`).join("")}</div>
    <div class="nbadd"><span class="dim">Add to the bar</span>${chip("Divider", "", "plus")}${chip("Weather", "", "plus")}${chip("Tray", "", "plus")}${chip("Keyboard layout", "", "plus")}${chip("Updates", "", "plus")}</div>
    ${pvfoot("Other plugins marks where plugins this layout doesn't place go, like the ones you add later.", "info")}`;

  /* ═══ C: pick a part ═══════════════════════════════════════════════ */
  const PARTS = [["bar", "Size", "Default · 32 px"], ["grid", "Workspaces", "Pills"], ["window", "Window title", "On"], ["clock", "Clock", "Fri Nov 13 · 24-hour"], ["puzzle", "Plugins", "Now playing and AI Hub"], ["wifi", "Status icons", "In one pill"], ["bell", "Notifications", "Bell with a count"]];
  const parts = (on) => `<div class="card nbparts">${PARTS.map(([ic, n, d]) => `<div class="opt ${n === on ? "picked" : ""}"><span class="lic" style="--tc:var(--sec-${S})">${icon(ic)}</span><div class="opt-text"><div>${n}</div><div class="d">${d}</div></div>${icon("chev-r", "cv")}</div>`).join("")}</div>`;
  const cCtl = () => `${parts("Workspaces")}${ocard("", [nrow("Arrangement", "What sits where, pills and dividers", "", { ic: "layers", sec: S })], { cls: "icons" })}`;
  const look = (k, n, d) => `<div class="nbl ${k === "pills" ? "on" : ""}"><div class="nbls"><div class="nbar mini"><div class="nbs s0">${entry(["ws"], { ws: k })}${entry("win", {})}</div></div></div><div class="nblt">${radio(k === "pills")}<div><b>${n}</b><span>${d}</span></div></div></div>`;
  const cPv = () => `
    ${pvhead("Workspaces", "How they look in the bar. Picked: Pills.", "")}
    ${wall(nbar({ hot: "ws" }), "short")}
    <div class="nbls-g">
      ${look("pills", "Pills", "The current one holds its windows' icons")}
      ${look("numbers", "Numbers", "Plain and compact")}
      ${look("icons", "App icons", "Each workspace shows what's open in it")}
      ${look("dots", "Dots", "The quietest")}
      ${look("underline", "Underline", "Numbers, the current one underlined")}
    </div>
    ${pvfoot("Click a workspace in the bar to go there; scroll over them to step through.", "info")}`;
  const cStatusCtl = () => `${parts("Status icons")}${ocard("Status icons", [orow("In one pill", "Network, Bluetooth, sound and battery", sw(true)), orow("A click opens", "", dd("Control Center"))], { cls: "nb-sel" })}`;
  const cStatusPv = () => `
    ${pvhead("Status icons", "Together in one pill that opens Control Center.", "")}
    ${wall(`${nbar({ hot: "status" })}<div class="nbcc"><div class="nbcch"><b>Control Center</b><span>${icon("cog")}</span></div><div class="nbccg">${[["wifi", "Wi-Fi", "Home-5G", true], ["bluetooth", "Bluetooth", "Pulse Buds", true], ["moon", "Night Light", "Off", false], ["bell", "Do not disturb", "Off", false]].map(([ic, n, v, on]) => `<div class="nbq ${on ? "on" : ""}"><span>${icon(ic)}</span><div><b>${n}</b><small>${v}</small></div></div>`).join("")}</div><div class="nbccs">${icon("volume")}${slider(64, 0)}</div><div class="nbccs">${icon("sun")}${slider(80, 0)}</div></div>`, "tall")}
    <div class="nbcmp card"><div><small>One pill</small><span class="nbsamp"><span class="nbp">${IT.status[2]({})}</span></span></div><div><small>Each on its own</small><span class="nbsamp each">${IT.status[2]({ each: true })}</span></div></div>`;

  const W = (body) => swin({ sec: S, page: "Bar", desc: "Nyx Bar's size, status icons, clock, workspaces and what goes where.", body });
  REG("nyx-bar", {
    name: "Bar (Nyx Bar)",
    summary: "Shown wherever Nyx Bar is installed. A column of dropdowns (size, the status pill, the clock's date, time, seconds and calendar, the workspaces' look), then the arrangement editor: Left, Center and Right lists of items with drag handles, pills, dividers and other plugins.",
    problems: [
      "<b>Every choice is a dropdown:</b> “Pills”, “Wed Nov 11”, “Month and agenda” are words; you see the result only in the bar itself.",
      "<b>Descriptions do the drawing:</b> the workspaces row explains five looks in one long sentence that wraps to two lines at 800 px.",
      "<b>The arrangement is a list:</b> pills, dividers and “Other plugins” are rows with tags, far from any picture of the bar they arrange.",
      "<b>Size is a guess:</b> 28, 32, 36 and 40 px are names in a list with nothing to compare.",
      "<b>Plumbing in the notes:</b> <tt>nyx plugin list</tt>, <tt>nyx-bar --layout-json</tt> and the clock's <tt>format</tt> key show up in descriptions.",
    ],
    today: [["nyx-bar-1280", "Today", ""], ["nyx-bar-800", "Today at 800 px", ""]],
    options: [
      { id: "a", name: "The bar at full size", idea: "The right side shows your bar at its real size over the wallpaper, with what the clock opens hanging under it and the four sizes side by side. The controls are three short cards, and the workspaces' five looks are drawn as small pictures to click. The arrangement is one row that opens the editor.",
        shots: [["a", "Clock and calendar", "The bar at real size"], ["a-800", "At 800 px", "The bar and its calendar above the controls"]] },
      { id: "b", name: "Arrange on the preview", idea: "The arrangement is the picture: the bar with its three sections outlined, then each section as a column of cards you drag, pills as one card holding their items, dividers as thin rows. The look and clock settings are a short column beside it.",
        shots: [["b", "Moving a pill", "Now playing and AI Hub share a pill"], ["b-800", "At 800 px", "The editor above the settings"]] },
      { id: "c", name: "Pick a part of the bar", idea: "A list of the bar's parts with their current values. Picking one shows the bar with that part lit up and its choices drawn as they'd look, like the five workspace looks, or Control Center opening from the status pill. One part at a time, never a long page.",
        shots: [["c", "Workspaces", "Five looks, drawn"], ["c-status", "Status icons", "One pill, and what it opens"]] },
    ],
    pages: {
      a: () => W(split(aCtl(), aPv(), { sec: S, ctlw: 420, cls: "nb-a" })),
      b: () => W(split(bCtl(), bPv(), { sec: S, ctlw: 340, cls: "nb-b" })),
      c: () => W(split(cCtl(), cPv(), { sec: S, ctlw: 360, cls: "nb-c" })),
      "c-status": () => W(split(cStatusCtl(), cStatusPv(), { sec: S, ctlw: 360, cls: "nb-c" })),
    },
  });
})();
