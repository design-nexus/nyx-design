// Nyx Home on the revamp page: today's problems and three options.
(() => {
  const HOUSE = "Maple House";

  /* ── Parts ──────────────────────────────────────────────────────────── */
  // A device card: size s (one row), m (two rows), l (two columns, two rows).
  const dcard = ({ ic, c = "accent", name, state, on = false, size = "s", ctrl = "", body = "", warn = false, cls = "" }) => `
    <div class="hc ${size} ${on ? "on" : ""} ${warn ? "warn" : ""} ${cls}" style="--dc:${c === "accent" ? "var(--accent)" : swc(c)}">
      <div class="hc-top"><span class="hc-ic">${icon(ic)}</span><div class="hc-tx"><b>${name}</b><span>${state}</span></div>${ctrl}</div>
      ${body}
    </div>`;
  const slider = (pct) => `<div class="hslider"><b style="width:${pct}%"></b><i style="left:${pct}%"></i></div>`;
  const swatches = `<div class="hsw">${["#ffd27a", "#ffb15c", "#f5875a", "#c95fc6", "#8b6cf0", "#3d8ae8"].map((x, i) => `<span style="background:${x}" class="${i === 0 ? "on" : ""}"></span>`).join("")}</div>`;

  const thermostat = (o = {}) => dcard({ ic: "thermo", c: "coral", name: "Hallway thermostat", state: "Heating to 22°", on: true, size: "l", ctrl: ib("more", "Details"),
    body: `<div class="th-body"><div class="th-now"><span class="big">21.5°</span><span class="lbl">Inside now · 46% humidity</span></div>
      <div class="th-set"><button class="rb">−</button><div><b>22°</b><span>Target</span></div><button class="rb">+</button></div></div>
      <div class="th-foot">${seg(["Heat", "Cool", "Auto", "Off"], "Heat")}<span class="sp"></span><span class="fan">${icon("fan")} Fan · Auto</span></div>` });
  const lightGroup = (o = {}) => dcard({ ic: "bulb", c: "amber", name: o.name || "Living room lights", state: o.state || "3 lights · 70%", on: true, size: "m", ctrl: sw(true),
    body: `<div class="hc-ctl">${slider(o.pct || 70)}${swatches}</div>` });
  const light = (name, state, pct, on = true) => dcard({ ic: "bulb", c: "amber", name, state, on, size: "m", ctrl: sw(on),
    body: `<div class="hc-ctl">${slider(on ? pct : 0)}<span class="hc-note">${on ? "Warm white" : "Off since 6:40 pm"}</span></div>` });
  const vacuum = () => dcard({ ic: "robot", c: "teal", name: "Dusty", state: "Docked · battery 100%", size: "m", ctrl: ib("more", "Details"),
    body: `<span class="hc-note">Cleaned the kitchen · 2 h ago</span><div class="hc-ctl row">${ib("play", "Start")}${ib("pause", "Pause")}${ib("home", "Dock")}<span class="sp"></span>${btn("Map", "sm", "mapin")}</div>` });
  const lock = () => dcard({ ic: "lock", c: "green", name: "Front door", state: "Locked", ctrl: btn("Unlock", "sm") });
  const openWin = () => dcard({ ic: "window2", c: "coral", name: "Kitchen window", state: "Open · 25 min", warn: true });
  const purifier = () => dcard({ ic: "fan", c: "blue", name: "Air purifier", state: "Auto · air good", on: true, ctrl: sw(true) });
  const speaker = () => dcard({ ic: "speaker", c: "violet", name: "Living room speaker", state: "Playing · Rainy Day Jazz", on: true, ctrl: ib("pause", "Pause") });
  const camera = (name, room, seed, o = {}) => dcard({ ic: "camera", c: "red", name, state: o.state || `${room} · 2 min ago`, size: o.size || "l", cls: "cam", ctrl: o.live ? `<span class="live">● Live</span>` : ib("more", "Details"),
    body: `<div class="cam-pic">${art(seed, { r: 8, ic: "camera" })}<span class="cam-tags">${o.tags || ""}</span></div>` });
  const sensor = (ic, c, name, state) => dcard({ ic, c, name, state });

  const scenes = (list = [["Movie night", "violet", "film"], ["Good morning", "amber", "sun"], ["Dinner", "coral", "utensils"], ["Away", "blue", "shield"], ["Good night", "graphite", "moon"]]) =>
    `<div class="scenes">${list.map(([n, c, ic]) => `<div class="scene" style="--dc:${swc(c)}">${icon(ic)}<span>${n}</span></div>`).join("")}<div class="scene add">${icon("plus")}<span>Scene</span></div></div>`;

  const summary = (narrow = false) => `<div class="hsum">
    ${[["bulb", "amber", "Lights on", "5", "Living room, kitchen, office"], ["door", "coral", "Open", "1", "Kitchen window"], ["users", "blue", "People home", "2 of 3", "Alex is out"], ["thermo", "red", "Inside", "21.5°", "Heating to 22°"], ["check-c", "green", "Devices", "All good", "42 working"]].map(([ic, c, k, v, s]) =>
      `<div class="kcard hk" style="--dc:${swc(c)}"><span class="k">${icon(ic)}${k}</span><span class="v">${v}</span><span class="s">${s}</span></div>`).join("")}
  </div>`;

  const hdr = (o = {}) => header({ icon: "home", name: "Home", center: search(o.q || "Search devices and rooms", "Ctrl F"), end: o.end || "" });

  /* ── Option A: rooms in the sidebar ─────────────────────────────────── */
  const ROOMS = [["sofa", "Living room", 9], ["utensils", "Kitchen", 6], ["bed", "Bedroom", 4], ["monitor", "Office", 5], ["door", "Hallway", 3], ["garage", "Garage", 2], ["tree", "Garden", 3]];
  const sideA = (on = "overview", o = {}) => `
    ${o.noTiles ? "" : tiles([["lights", "bulb", 5, "Lights on", "amber"], ["open", "door", 1, "Open", "coral"], ["people", "users", 2, "At home", "blue"], ["look", "alert", 1, "Needs a look", "red"]], on)}
    ${grp(HOUSE, false, "", "accent")}
    ${navx("grid", "Overview", { active: on === "overview" })}
    ${navx("camera", "Cameras", { active: on === "cameras", cnt: 3 })}
    ${navx("zap", "Automations", { active: on === "autos", cnt: 8 })}
    ${navx("history", "Activity", { active: on === "activity" })}
    ${grp("Rooms", false, icon("plus"), "teal")}
    ${navx("layers", "All devices", { cnt: 42 })}
    ${ROOMS.map(([ic, n, c]) => navx(ic, n, { active: on === n, cnt: c })).join("")}
    <div class="foot hfoot"><span class="hdot"></span><span>${HOUSE} · connected</span></div>`;

  const overviewA = () => `<div class="main hpage">
    ${pbar2("Good evening", "Wednesday 12 November", btn("Edit", "", "pen"))}
    <div class="content">
      ${summary()}
      <div class="sechead">Scenes</div>
      ${scenes()}
      <div class="sechead">Favourites<span class="more">Add a device</span></div>
      <div class="hgrid">${thermostat()}${lightGroup()}${vacuum()}${lock()}${openWin()}${purifier()}${speaker()}</div>
      <div class="hbot">
        <div class="kcard hcams"><span class="k">${icon("camera")}Cameras · 3<span class="sp"></span><span class="lnk">Open Cameras</span></span><div class="hcrow">${[["Driveway", "driveway7"], ["Back garden", "garden2"], ["Garage", "garage4"]].map(([n, s]) => `<div class="hcth">${art(s, { r: 7 })}<span>${n}</span></div>`).join("")}</div></div>
        <div class="kcard energy"><span class="k">${icon("zap")}Energy today<span class="sp"></span><span class="lnk">8.4 kWh</span></span>${bars([.2, .15, .1, .1, .12, .3, .6, .5, .35, .3, .28, .4, .45, .38, .33, .42, .7, .9, .8, .55], { h: 56, c: "var(--sw-amber)" })}<span class="s">Most at 6 pm · 12% less than yesterday</span></div>
      </div>
    </div></div>`;

  const detailsA = () => `<div class="insp hinsp">
    <div class="ihead"><div class="di-top"><span class="hc-ic big" style="--dc:${swc("amber")}">${icon("bulb")}</span><div><b>Floor lamp</b><span>Living room · Hue White Ambiance</span></div>${ib("x", "Close")}</div></div>
    <div class="ibody">
      <div class="lab">Light</div>
      <div class="card"><div class="row"><span class="k">On</span>${sw(true)}</div><div class="row"><span class="k">Brightness</span><span class="v">55%</span></div><div class="row slrow">${slider(55)}</div><div class="row"><span class="k">Colour</span>${swatches}</div><div class="row"><span class="k">Effect</span>${dd("None")}</div></div>
      <div class="lab">Device</div>
      <div class="card"><div class="row">${icon("rename")}<span class="k">Name</span><span class="v">Floor lamp</span></div><div class="row">${icon("sofa")}<span class="k">Room</span>${dd("Living room")}</div><div class="row">${icon("star")}<span class="k">On Overview</span>${sw(false)}</div><div class="row">${icon("eyeoff")}<span class="k">Hide in Nyx Home</span>${sw(false)}</div></div>
      <div class="lab">Readings<span class="cnt">4</span></div>
      <div class="card"><div class="row"><span class="k">Signal</span><span class="v">Strong</span></div><div class="row"><span class="k">Last changed</span><span class="v">6:12 pm</span></div></div>
    </div>
    <div class="ifoot">${btn("Open in Home Assistant", "ghost", "external")}</div>
  </div>`;

  const roomA = () => `<div class="cols"><div class="main hpage">
    ${pbar2("Living room", "9 devices · 3 lights on", `${btn("Arrange", "", "grid")}${ib("more", "More: show hidden devices, new light group")}`)}
    <div class="content">
      ${scenes([["Movie night", "violet", "film"], ["Reading", "amber", "book"], ["All off", "graphite", "power"]])}
      <div class="sechead">Lights · 4<span class="more">${icon("plus")} Light group</span></div>
      <div class="hgrid c3">${lightGroup()}${light("Floor lamp", "55%", 55)}${light("Ceiling", "Off", 0, false)}</div>
      <div class="sechead">Climate and media · 3</div>
      <div class="hgrid c3">${purifier()}${sensor("thermo", "red", "Temperature", "21.8° · 47%")}${speaker()}</div>
      <div class="sechead">Covers · 2</div>
      <div class="hgrid c3">${dcard({ ic: "blinds", c: "teal", name: "Bay window", state: "Open 80%", ctrl: `${ib("chev-u", "Open")}${ib("chev-d", "Close")}` })}${dcard({ ic: "blinds", c: "teal", name: "Patio", state: "Closed", ctrl: `${ib("chev-u", "Open")}${ib("chev-d", "Close")}` })}</div>
    </div></div>${detailsA()}</div>`;

  /* ── Option B: rooms at a glance ────────────────────────────────────── */
  const tabsB = (on) => `<div class="htabs">${[["home", "Home"], ["camera", "Cameras"], ["zap", "Automations"], ["history", "Activity"]].map(([ic, n]) => `<span class="htab ${n === on ? "on" : ""}">${icon(ic)}<span>${n}</span></span>`).join("")}</div>`;
  const hdrB = (on) => header({ icon: "home", name: "Home", start: "", center: tabsB(on), end: `${ib("search", "Search devices (Ctrl+F)")}<span class="hstat"><span class="hdot"></span>${wideOnly(HOUSE)}</span>` });
  const roomCard = (ic, name, temp, chips, quick, sel = false, c = "teal") => `<div class="rcard ${sel ? "sel" : ""}" style="--dc:${swc(c)}">
    <div class="rc-top"><span class="hc-ic">${icon(ic)}</span><b>${name}</b><span class="t">${temp}</span></div>
    <div class="rc-chips">${chips.map(([t, w]) => `<span class="${w ? "w" : ""}">${t}</span>`).join("")}</div>
    <div class="rc-q">${quick.map(([qi, on, tip]) => `<span class="q ${on ? "on" : ""}" title="${tip}">${icon(qi)}</span>`).join("")}</div>
  </div>`;
  const roomsGrid = (sel = true) => `<div class="rgrid">
    ${roomCard("sofa", "Living room", "21.8°", [["3 lights on"], ["Speaker playing"], ["Blinds 80%"]], [["bulb", true, "Lights"], ["fan", true, "Purifier"], ["speaker", true, "Speaker"]], sel, "violet")}
    ${roomCard("utensils", "Kitchen", "22.4°", [["1 light on"], ["Window open", true]], [["bulb", true, "Lights"], ["plug", false, "Kettle"]], false, "coral")}
    ${roomCard("bed", "Bedroom", "19.6°", [["All off"], ["Blinds closed"]], [["bulb", false, "Lights"], ["fan", false, "Fan"]], false, "blue")}
    ${roomCard("monitor", "Office", "20.9°", [["1 light on"], ["Desk plug on"]], [["bulb", true, "Lights"], ["plug", true, "Desk plug"]], false, "amber")}
    ${roomCard("door", "Hallway", "21.5°", [["Heating to 22°"], ["Front door locked"]], [["thermo", true, "Thermostat"], ["lock", true, "Lock"]], false, "red")}
    ${roomCard("garage", "Garage", "14.2°", [["Door closed"], ["Dusty docked"]], [["garage", false, "Garage door"], ["robot", false, "Dusty"]], false, "graphite")}
    ${roomCard("tree", "Garden", "9.8°", [["Sprinkler off"], ["Gate closed"]], [["drop", false, "Sprinkler"], ["bulb", false, "Path lights"]], false, "green")}
    ${roomCard("drop", "Bathroom", "22.9°", [["Fan off"], ["68% humidity", true]], [["bulb", false, "Lights"], ["fan", false, "Fan"]], false, "teal")}
  </div>
  <div class="sechead">Robots</div>
  <div class="rbots">${[["robot", "teal", "Dusty", "Docked · battery 100%", "Start"], ["mower", "green", "Mowbot", "Charging · 64%", "Mow"]].map(([ic, c, n, s, a]) => `<div class="rcard rbot" style="--dc:${swc(c)}"><span class="hc-ic">${icon(ic)}</span><div class="hc-tx"><b>${n}</b><span>${s}</span></div>${btn(a, "sm", "play")}${btn("Map", "sm ghost", "mapin")}</div>`).join("")}</div>`;
  const drawerB = () => `<div class="insp hinsp drawer">
    <div class="ihead"><div class="di-top"><span class="hc-ic big" style="--dc:${swc("violet")}">${icon("sofa")}</span><div><b>Living room</b><span>21.8° · 47% · 9 devices</span></div>${ib("x", "Close")}</div>
      <div class="di-sc">${btn("Movie night", "sm", "film")}${btn("Reading", "sm", "book")}${btn("All off", "sm", "power")}</div></div>
    <div class="ibody">
      <div class="lab">Lights<span class="act">${icon("plus")} Group</span></div>
      <div class="card">${[["Living room lights", "3 lights · 70%", true], ["Floor lamp", "55%", true], ["Ceiling", "Off", false], ["Shelf strip", "40%", true]].map(([n, s, on]) => `<div class="row drow"><span class="hc-ic sm ${on ? "on" : ""}" style="--dc:${swc("amber")}">${icon("bulb")}</span><div class="dt"><b>${n}</b><span>${s}</span></div>${sw(on)}</div>`).join("")}</div>
      <div class="lab">Climate and media</div>
      <div class="card">${[["fan", "blue", "Air purifier", "Auto · air good", sw(true)], ["speaker", "violet", "Speaker", "Rainy Day Jazz", ib("pause", "Pause")], ["blinds", "teal", "Window blinds", "Open 80%", ib("chev-d", "Close")]].map(([ic, c, n, s, ctl]) => `<div class="row drow"><span class="hc-ic sm on" style="--dc:${swc(c)}">${icon(ic)}</span><div class="dt"><b>${n}</b><span>${s}</span></div>${ctl}</div>`).join("")}</div>
    </div>
    <div class="ifoot">${btn("Open the room", "", "expand")}<span class="sp"></span>${btn("Arrange", "ghost", "grid")}</div>
  </div>`;
  const homeB = (o = {}) => `<div class="cols"><div class="main hpage">
    <div class="content">
      <div class="hello"><div><h1>Good evening</h1><p>5 lights on · the kitchen window is open · 21.5° inside · 2 people home</p></div><span class="sp"></span>${btn("Edit", "ghost", "pen")}</div>
      ${scenes()}
      <div class="sechead">Rooms<span class="more">All devices · 42</span></div>
      ${roomsGrid(!o.noDrawer)}
    </div></div>${o.noDrawer ? "" : drawerB()}</div>`;
  const camerasB = () => `<div class="main hpage">
    ${pbar2("Cameras", "6 cameras · stills from the last check", `${btn("Arrange", "", "grid")}`)}
    <div class="content"><div class="camwall">
      ${[["Driveway", "Outside", "driveway7", "Person · 4 min ago", "Battery 82%"], ["Back garden", "Garden", "garden2", "Quiet", "Battery 64%"], ["Living room", "Living room", "living9", "Quiet", "Plugged in"], ["Garage", "Garage", "garage4", "Motion · 1 h ago", "Plugged in"], ["Front porch", "Outside", "porch3", "Parcel · 2 h ago", "Battery 91%"], ["Side gate", "Garden", "gate5", "Quiet", "Battery 40%"]].map(([n, r, s, ev, b], i) => `<div class="camtile ${i === 0 ? "big" : ""}">${art(s, { r: 0, ic: "camera" })}<div class="cam-ov"><div><b>${n}</b><span>${r} · ${ev}</span></div><span class="sp"></span><span class="cb">${b}</span>${i === 0 ? btn("Watch live", "primary sm", "play") : btn("Live", "sm", "play")}</div></div>`).join("")}
    </div>
    <p class="hnote">${icon("info")} Stills load once and don't refresh on their own, so battery cameras stay asleep. Live video stops after three minutes unless you keep watching.</p></div></div>`;

  /* ── Option C: automations first ────────────────────────────────────── */
  const AUTOS = [
    ["Desktop", "blue", "terminal", [["Focus mode at 9", "Weekdays at 9:00 · mute and switch to workspace 2", true, "Today 9:00"], ["Meeting window opens", "When Zoom opens · dim the office lights", true, "Yesterday"]]],
    ["Home Assistant", "teal", "server", [["Porch light at sunset", "At sunset · porch light on until 23:00", true, "Today 16:52"], ["Window left open", "Kitchen window open 30 min · notify phones", true, "Mon"], ["Away mode", "Everyone leaves · lights off, thermostat 17°", false, "Last week"]]],
    ["Hybrid", "violet", "merge", [["Welcome home", "Front door unlocks after dark · hallway 60%, notify", true, "Today 18:04"], ["Movie on the desktop", "Video player full screen · Movie night scene", true, "Sat"]]],
  ];
  const autoList = (sel = "Welcome home") => `<div class="list alist">
    <div class="lhead2"><b>Automations</b><span class="c">7</span><span class="sp"></span>${seg(["All", "On", "Off"], "All")}</div>
    <div class="scroll">${AUTOS.map(([where, c, ic, items]) => `<div class="agrp" style="--dc:${swc(c)}">${icon(ic)}<span>${where === "Desktop" ? "On this computer" : where === "Home Assistant" ? "In Home Assistant" : "Hybrid"}</span></div>${items.map(([n, s, on, last]) => `<div class="arow ${n === sel ? "sel" : ""}"><div class="tx"><b>${n}</b><span>${s}</span></div>${sw(on)}</div>`).join("")}`).join("")}</div></div>`;
  const autoDetail = () => `<div class="main adet">
    <div class="ahead"><div><div class="aw" style="--dc:${swc("violet")}">${icon("merge")} Hybrid · runs on this computer</div><h1>Welcome home</h1></div><span class="sp"></span>${btn("Run now", "", "play")}${btn("Edit", "primary", "pen")}${ib("more", "More: open in canvas, duplicate, delete")}</div>
    <div class="scroll"><div class="apad">
      <div class="steps">
        <div class="step" style="--dc:${swc("blue")}"><span class="sl">When</span><div><b>Front door unlocks</b><span>Front door lock changes to Unlocked</span></div></div>
        <div class="step" style="--dc:${swc("amber")}"><span class="sl">Only if</span><div><b>It's after sunset</b><span>And the hallway is darker than 40 lux</span></div></div>
        <div class="step" style="--dc:${swc("green")}"><span class="sl">Then</span><div><b>Hallway lights to 60%</b><span>Wait 2 s, retry twice if it fails</span></div></div>
        <div class="step" style="--dc:${swc("green")}"><span class="sl">And</span><div><b>Send a notification</b><span>“Welcome home — the hallway's lit.”</span></div></div>
      </div>
      <div class="sechead">Recent runs<span class="more">All activity</span></div>
      <div class="card runs">${[["check-c", "ok", "Today 18:04", "Finished · 3 steps · 2.1 s"], ["check-c", "ok", "Yesterday 17:58", "Finished · 3 steps · 1.9 s"], ["alert", "bad", "Mon 19:20", "Hallway lights didn't answer · retried twice"], ["x", "skip", "Sun 13:02", "Skipped · it wasn't dark yet"]].map(([ic, t, w, s]) => `<div class="opt"><span class="rs ${t}">${icon(ic)}</span><div class="opt-text"><div>${w}</div><div class="d">${s}</div></div>${btn("Steps", "ghost sm", "chev-r")}</div>`).join("")}</div>
    </div></div></div>`;
  const autosC = () => `<div class="cols">${autoList()}${autoDetail()}</div>`;
  const node = (x, y, c, kind, title, sub, o = {}) => `<div class="node ${o.sel ? "sel" : ""}" style="left:${x}px;top:${y}px;--dc:${swc(c)}"><span class="nk">${kind}</span><b>${title}</b><span>${sub}</span></div>`;
  const canvasC = () => `<div class="cols"><div class="main cvs">
    <div class="cbar">${btn("Back", "ghost", "chev-l")}<b>Welcome home</b><span class="dim">· Hybrid</span><span class="sp"></span>${dd("Action", "plus")}${btn("Add step", "", "plus")}<span class="vsep"></span>${btn("Dry run", "", "check")}${btn("Live test", "", "play")}${btn("Save", "primary")}</div>
    <div class="board">
      <svg class="wires" width="100%" height="100%"><path d="M245 95 L245 140"/><path d="M245 205 L245 260"/><path d="M330 172 C 505 172, 505 172, 505 260"/><path d="M245 325 L245 380"/><path d="M245 325 C 245 352, 505 352, 505 380"/></svg>
      ${node(160, 30, "blue", "When", "Front door unlocks", "Lock · Unlocked")}
      ${node(160, 140, "amber", "Question", "After sunset?", "Sun below the horizon")}
      ${node(160, 260, "green", "Yes", "Hallway to 60%", "Retry 2 × · 5 s timeout", { sel: true })}
      ${node(420, 260, "graphite", "No", "Do nothing", "End")}
      ${node(160, 380, "green", "Then", "Send a notification", "“Welcome home”")}
      ${node(420, 380, "teal", "In parallel", "Porch light on", "For 10 minutes")}
      <div class="zoom">${ib("plus", "Zoom in")}<span>100%</span>${ib("x", "Fit")}</div>
    </div></div>
    <div class="insp hinsp">
      <div class="ihead"><div class="di-top"><span class="hc-ic big" style="--dc:${swc("green")}">${icon("bulb")}</span><div><b>Hallway to 60%</b><span>Action · Home Assistant</span></div></div></div>
      <div class="ibody">
        <div class="lab">Do this</div>
        <div class="card"><div class="row"><span class="k">Device</span>${dd("Hallway lights")}</div><div class="row"><span class="k">Turn</span>${dd("On")}</div><div class="row"><span class="k">Brightness</span><span class="v">60%</span></div></div>
        <div class="lab">If it fails</div>
        <div class="card"><div class="row"><span class="k">Timeout</span><span class="v">5 s</span></div><div class="row"><span class="k">Retries</span><span class="v">2</span></div><div class="row"><span class="k">Then</span>${dd("Notify me")}</div></div>
        <div class="lab">Next step</div>
        <div class="card"><div class="row"><span class="k">Send a notification</span>${icon("chev-r")}</div></div>
      </div>
      <div class="ifoot">${btn("Connect next step…", "", "link")}<span class="sp"></span>${ib("trash", "Delete step")}</div>
    </div></div>`;

  /* ── Option C: the floor plan ───────────────────────────────────────── */
  const sideN1 = (on = "home") => `
    ${navx("home", "Home", { active: on === "home" })}
    ${navx("camera", "Cameras", { active: on === "cameras", cnt: 6 })}
    ${navx("zap", "Automations", { active: on === "autos", cnt: 8 })}
    ${navx("history", "Activity", { active: on === "activity" })}
    ${grp("Server", false, "", "teal")}
    ${navx("", "Connected", { dot: "var(--success)" })}`;
  // A device on the plan: x, y inside its room; t is a short label beside it.
  const pdev = (x, y, ic, c, o = {}) => `<span class="hn1-dev ${o.on ? "on" : ""} ${o.warn ? "warn" : ""} ${o.sel ? "sel" : ""}" style="left:${x}px;top:${y}px;--dc:${swc(c)}">${icon(ic)}${o.t ? `<em class="${o.tl ? "l" : ""}">${o.t}</em>` : ""}</span>`;
  const pwho = (x, y, name) => `<span class="hn1-who" style="left:${x}px;top:${y}px">${av(name, 22)}</span>`;
  // [key, name, temp, humidity, x, y, w, h, lit (glow x,y) or "", sub]
  const PLAN = [
    ["living", "Living room", 21.8, 47, 0, 0, 270, 260, "40% 70%", "3 lights on"],
    ["kitchen", "Kitchen", 22.4, 51, 270, 0, 210, 170, "35% 65%", "Window open"],
    ["office", "Office", 20.9, 44, 480, 0, 180, 170, "30% 70%", "1 light on"],
    ["hall", "Hallway", 21.5, 46, 270, 170, 390, 90, "", "Heating to 22°"],
    ["bed", "Bedroom", 19.6, 49, 0, 260, 250, 200, "", "All off"],
    ["bath", "Bathroom", 22.9, 68, 250, 260, 150, 200, "", "68% humidity"],
    ["garage", "Garage", 14.2, 58, 400, 260, 260, 200, "", "Door closed"],
  ];
  const tcol = (t) => { const k = Math.max(0, Math.min(1, (t - 14) / 10)); return k < .5 ? `color-mix(in srgb, var(--sw-blue) ${Math.round((1 - k * 2) * 100)}%, var(--sw-teal))` : `color-mix(in srgb, var(--sw-amber) ${Math.round((1 - (k - .5) * 2) * 100)}%, var(--sw-coral))`; };
  const DEVS = () => ({
    living: [pdev(36, 196, "bulb", "amber", { on: true }), pdev(128, 118, "bulb", "amber"), pdev(222, 52, "bulb", "amber", { on: true }), pdev(40, 64, "speaker", "violet", { on: true }), pdev(222, 200, "fan", "blue", { on: true }), pdev(126, 222, "camera", "red"), pwho(170, 150, "Sam Rivera")],
    kitchen: [pdev(52, 96, "bulb", "amber", { on: true }), pdev(150, 104, "plug", "coral")],
    office: [pdev(40, 104, "bulb", "amber", { on: true }), pdev(126, 104, "plug", "coral", { on: true }), pwho(84, 60, "Jo Park")],
    hall: [pdev(110, 58, "thermo", "coral", { on: true, t: "21.5° → 22°" }), pdev(262, 58, "bulb", "amber")],
    bed: [pdev(58, 120, "bulb", "amber"), pdev(170, 120, "blinds", "teal")],
    bath: [pdev(58, 120, "fan", "blue")],
    garage: [pdev(50, 120, "robot", "teal", { t: "Dusty · docked" }), pdev(214, 150, "garage", "graphite")],
  });
  const CLIM = () => ({
    living: [pdev(222, 200, "fan", "blue", { on: true, t: "Purifier · auto", tl: true })],
    hall: [pdev(46, 58, "thermo", "coral", { on: true, sel: true, t: "Heating to 22°" })],
    bath: [pdev(58, 140, "fan", "blue", { t: "Fan off" })],
    bed: [pdev(170, 140, "blinds", "teal", { t: "Blinds closed", tl: true })],
  });
  const plan = (o = {}) => {
    const clim = o.layer === "Climate";
    return `<div class="hn1-plan ${clim ? "clim" : ""}">
      ${PLAN.map(([k, n, t, h, x, y, w, ht, lit, sub]) => `<div class="hn1-room ${o.sel === k ? "sel" : ""} ${lit && !clim ? "lit" : ""} ${k === "bath" && !clim ? "wn" : ""}" style="left:${x}px;top:${y}px;width:${w}px;height:${ht}px;${lit && !clim ? `--gx:${lit.split(" ")[0]};--gy:${lit.split(" ")[1]};` : ""}${clim ? `--tc:${tcol(t)};` : ""}">
        ${clim ? `<div class="hn1-big"><b>${t.toFixed(1)}°</b><span>${h}% humidity</span></div>` : `<div class="hn1-rl"><b>${n}</b><span>${t}°</span></div><div class="hn1-rs ${k === "kitchen" || k === "bath" ? "w" : ""}">${sub}</div>`}
        ${clim ? `<div class="hn1-rl only"><b>${n}</b></div>` : ""}
        ${((clim ? CLIM() : DEVS())[k] || []).join("")}
      </div>`).join("")}
      <span class="hn1-door" style="left:654px;top:198px" title="Front door">${icon("lock")}</span>
      ${clim ? "" : `<span class="hn1-flag" style="left:340px;top:-30px">${icon("window2")}Open 25 min</span>`}
      <span class="hn1-dtag" style="left:604px;top:226px">Locked</span>
    </div>`;
  };
  const roomPanelN1 = () => `<div class="insp hinsp hn1-insp">
    <div class="ihead"><div class="di-top"><span class="hc-ic big" style="--dc:${swc("violet")}">${icon("sofa")}</span><div><b>Living room</b><span>21.8° · 47% · Sam is here</span></div>${ib("x", "Close")}</div>
      <div class="di-sc">${btn("Movie night", "sm", "film")}${btn("Reading", "sm", "book")}${btn("All off", "sm", "power")}</div></div>
    <div class="ibody">
      <div class="lab">Lights · 2 of 3 on<span class="act">${icon("plus")} Group</span></div>
      <div class="card">
        <div class="row drow"><span class="hc-ic sm on" style="--dc:${swc("amber")}">${icon("bulb")}</span><div class="dt"><b>Living room lights</b><span>Group · 70%</span></div>${sw(true)}</div>
        <div class="row slrow">${slider(70)}</div>
        ${[["Floor lamp", "55% · warm white", true], ["Ceiling", "Off", false], ["Shelf strip", "40%", true]].map(([n, s, on]) => `<div class="row drow"><span class="hc-ic sm ${on ? "on" : ""}" style="--dc:${swc("amber")}">${icon("bulb")}</span><div class="dt"><b>${n}</b><span>${s}</span></div>${sw(on)}</div>`).join("")}
      </div>
      <div class="lab">Climate and media</div>
      <div class="card">${[["fan", "blue", "Air purifier", "Auto · air good", sw(true)], ["speaker", "violet", "Speaker", "Rainy Day Jazz", ib("pause", "Pause")], ["blinds", "teal", "Bay window", "Open 80%", ib("chev-d", "Close")]].map(([ic, c, n, s, ctl]) => `<div class="row drow"><span class="hc-ic sm on" style="--dc:${swc(c)}">${icon(ic)}</span><div class="dt"><b>${n}</b><span>${s}</span></div>${ctl}</div>`).join("")}</div>
      <div class="lab">Camera</div>
      <div class="hn1-cam">${art("living9", { r: 9, ic: "camera" })}<div class="ov"><span>Living room · quiet · 2 min ago</span>${btn("Live", "sm", "play")}</div></div>
    </div>
  </div>`;
  const thermoPanelN1 = () => `<div class="insp hinsp hn1-insp">
    <div class="ihead"><div class="di-top"><span class="hc-ic big" style="--dc:${swc("coral")}">${icon("thermo")}</span><div><b>Hallway thermostat</b><span>Hallway · heating</span></div>${ib("x", "Close")}</div></div>
    <div class="ibody">
      <div class="hn1-th"><div class="now"><b>21.5°</b><span>Inside now · 46%</span></div><div class="th-set"><button class="rb">−</button><div><b>22°</b><span>Target</span></div><button class="rb">+</button></div></div>
      <div class="hn1-mode">${seg(["Heat", "Cool", "Auto", "Off"], "Heat")}<span class="fan">${icon("fan")} Fan · Auto</span></div>
      <div class="lab">Every room</div>
      <div class="card">${PLAN.slice().sort((a, b) => b[2] - a[2]).map(([, n, t, h]) => `<div class="row"><span class="hn1-sw" style="background:${tcol(t)}"></span><span class="k">${n}</span><span class="v hn1-hum">${h}%</span><span class="v hn1-t">${t.toFixed(1)}°</span></div>`).join("")}</div>
      <div class="lab">Also on this layer</div>
      <div class="card"><div class="row drow"><span class="hc-ic sm on" style="--dc:${swc("blue")}">${icon("fan")}</span><div class="dt"><b>Air purifier</b><span>Living room · auto</span></div>${sw(true)}</div><div class="row drow"><span class="hc-ic sm" style="--dc:${swc("blue")}">${icon("fan")}</span><div class="dt"><b>Bathroom fan</b><span>Off · turns on above 70%</span></div>${sw(false)}</div></div>
    </div>
  </div>`;
  const layers = (on) => `<div class="hn1-layers">${[["layers", "Everything"], ["bulb", "Lights"], ["thermo", "Climate"], ["shield", "Security"], ["zap", "Energy"]].map(([ic, n]) => chip(n, n === on ? "on" : "", ic)).join("")}</div>`;
  const pageN1 = (o = {}) => {
    const layer = o.layer || "Everything";
    const main = `<div class="main hn1-main">
      <div class="hn1-bar">${seg(["House", "Outside"], "House")}${layers(layer)}<span class="sp"></span>${btn("Edit plan", "ghost", "pen")}</div>
      <div class="hn1-stage">${plan({ sel: o.sel, layer })}
        ${layer === "Climate" ? `<div class="hn1-legend"><span>14°</span><b></b><span>24°</span></div>` : `<div class="hn1-now">${icon("users")}2 of 3 home${icon("bulb")}5 lights on${icon("check-c")}42 devices fine</div>`}
        ${o.pop ? `<div class="hn1-pop pop"><div class="di-top"><span class="hc-ic" style="--dc:${swc("violet")}">${icon("sofa")}</span><div><b>Living room</b><span>21.8° · 3 lights on</span></div>${ib("x", "Close")}</div>
          <div class="hn1-pl"><span class="hc-ic sm on" style="--dc:${swc("amber")}">${icon("bulb")}</span><b>Lights</b><span class="sp"></span>${sw(true)}</div>${slider(70)}
          <div class="hn1-pq">${[["bulb", true], ["speaker", true], ["fan", true], ["blinds", false]].map(([ic, on]) => `<span class="q ${on ? "on" : ""}">${icon(ic)}</span>`).join("")}</div>
          <div class="hn1-pb">${btn("Movie night", "sm", "film")}${btn("Open the room", "sm primary", "expand")}</div></div>` : ""}
      </div>
      <div class="hn1-foot">${scenes()}</div>
    </div>`;
    return o.pop ? main : `<div class="cols">${main}${layer === "Climate" ? thermoPanelN1() : roomPanelN1()}</div>`;
  };
  const hdrN1 = () => hdr({ end: `<span class="hstat"><span class="hdot"></span>${wideOnly(HOUSE)}</span>` });

  /* ── Option D: one list, and today's timeline ──────────────────────── */
  const drowN2 = (ic, c, name, state, ctl, o = {}) => `<div class="hn2-row ${o.on ? "on" : ""} ${o.warn ? "warn" : ""} ${o.open ? "open" : ""} ${o.sub ? "sub" : ""}" style="--dc:${swc(c)}">
    <div class="r"><span class="hc-ic sm ${o.on ? "on" : ""}">${icon(ic)}</span><div class="dt"><b>${name}</b><span>${state}</span></div>${o.mini !== undefined ? `<span class="hn2-mini">${slider(o.mini)}</span>` : ""}${ctl}</div>
    ${o.open ? `<div class="x">${o.open}</div>` : ""}</div>`;
  const roomN2 = (ic, name, info, rows, o = {}) => `<div class="hn2-room">
    <div class="hn2-rh">${icon(ic)}<b>${name}</b><span class="i">${info}</span><span class="sp"></span>${o.act || ""}</div>
    <div class="hn2-rows">${rows.join("")}</div></div>`;
  const lightRow = (name, state, pct, on, o = {}) => drowN2("bulb", "amber", name, state, sw(on), { on, mini: o.open || !on ? undefined : pct, ...o });
  const listN2 = (o = {}) => o.q ? `
    <div class="hn2-found">5 devices, 2 automations and 2 scenes match “hallway”</div>
    ${roomN2("door", "Hallway", "21.5° · 46%", [
      drowN2("thermo", "coral", "Hallway thermostat", "Heating to 22° · 21.5° now", `<span class="hn2-step"><button class="rb">−</button><b>22°</b><button class="rb">+</button></span>`, { on: true }),
      lightRow("Hallway lights", "Off since 18:30", 0, false),
      drowN2("lock", "green", "Front door", "Locked · by Welcome home", btn("Unlock", "sm"), { on: true }),
      drowN2("eye", "blue", "Hallway motion", "Clear · last seen 18:04", ""),
      drowN2("camera", "red", "Front porch camera", "Parcel · 2 h ago", btn("Live", "sm ghost", "play")),
    ])}
    ${roomN2("zap", "Automations that use them", "", [
      drowN2("merge", "violet", "Welcome home", "Hybrid · ran today at 18:04", sw(true), { on: true }),
      drowN2("server", "teal", "Hallway lights off at midnight", "Home Assistant · ran yesterday", sw(true), { on: true }),
    ])}
    ${roomN2("spark", "Scenes that change them", "", [
      drowN2("moon", "graphite", "Good night", "Hallway lights off · front door locked · 18°", btn("Run", "sm", "play")),
      drowN2("shield", "blue", "Away", "Every light off · heating to 17°", btn("Run", "sm", "play")),
    ])}` : `
    ${roomN2("star", "Pinned", "", [
      drowN2("thermo", "coral", "Hallway thermostat", "Heating to 22° · 21.5° now", `<span class="hn2-step"><button class="rb">−</button><b>22°</b><button class="rb">+</button></span>`, { on: true }),
      drowN2("lock", "green", "Front door", "Locked", btn("Unlock", "sm"), { on: true }),
      drowN2("window2", "coral", "Kitchen window", "Open · 25 min", "", { warn: true }),
    ], { act: `<span class="hn2-ra">Edit</span>` })}
    ${roomN2("sofa", "Living room", "21.8° · 3 lights on", [
      lightRow("Living room lights", "Group of 3 · 70%", 70, true),
      lightRow("Floor lamp", "55% · warm white", 55, true, { sub: true, open: `<div class="hn2-ex">${slider(55)}${swatches}<span class="sp"></span>${btn("Details", "sm ghost", "more")}</div>` }),
      lightRow("Ceiling", "Off since 18:40", 0, false, { sub: true }),
      drowN2("fan", "blue", "Air purifier", "Auto · air good", sw(true), { on: true }),
      drowN2("speaker", "violet", "Speaker", "Playing · Rainy Day Jazz", ib("pause", "Pause"), { on: true }),
    ], { act: btn("All off", "sm ghost", "power") })}
    ${roomN2("utensils", "Kitchen", "22.4° · window open", [
      lightRow("Kitchen lights", "40%", 40, true),
      drowN2("plug", "coral", "Kettle", "Off", sw(false)),
    ], { act: btn("All off", "sm ghost", "power") })}
    ${roomN2("garage", "Garage", "14.2°", [
      drowN2("robot", "teal", "Dusty", "Docked · battery 100%", `${btn("Start", "sm", "play")}${btn("Map", "sm ghost", "mapin")}`),
    ])}`;
  const tlN2 = (o = {}) => {
    const ev = (t, ic, c, title, sub, extra = "", cls = "") => `<div class="hn2-ev ${cls}" style="--dc:${swc(c)}"><span class="t">${t}</span><span class="d">${icon(ic)}</span><div class="b"><b>${title}</b><span>${sub}</span>${extra}</div></div>`;
    const steps = `<div class="hn2-steps">${[["When", "Front door unlocked", ""], ["Only if", "After sunset: yes", ""], ["Then", "Hallway lights to 60%", ""], ["And", "Notified Sam's phone", ""]].map(([k, v, t]) => `<div><span class="k">${k}</span><span class="v">${v}</span>${icon("check")}</div>`).join("")}</div>
      <div class="hn2-eb">${btn("Edit", "sm", "pen")}${btn("Canvas", "sm ghost", "canvas")}<span class="sp"></span>${btn("Run again", "sm ghost", "play")}</div>`;
    const items = o.q ? [
      ev("Now", "bulb", "amber", "Hallway lights are off", "Turned off by the switch at 18:30"),
      ev("18:04", "merge", "violet", "Welcome home ran", "Hybrid · 3 steps · 2.1 s", steps, "open"),
      ev("18:04", "lock", "green", "Front door unlocked", "With the keypad · locked again 18:05"),
      ev("17:30", "thermo", "coral", "Heating came on", "Hallway 20.4°, target 22°"),
      ev("00:00", "server", "teal", "Hallway lights off at midnight ran", "Home Assistant · nothing was on"),
    ] : [
      ev("Now", "window2", "coral", "The kitchen window is open", "25 minutes · it's 9° outside", `<div class="hn2-eb">${btn("Remind me in 10 min", "sm")}</div>`, "warn"),
      ev("18:21", "robot", "teal", "Dusty finished the kitchen", "32 min · 18 m² · back on the dock", `<div class="hn2-eb">${btn("Map", "sm ghost", "mapin")}</div>`),
      ev("18:04", "merge", "violet", "Welcome home ran", "Hallway to 60% · notified · 2.1 s"),
      ev("18:03", "user", "blue", "Sam came home", "Front door, with the keypad"),
      ev("17:30", "camera", "red", "Person at the driveway", "Driveway camera", `<div class="hn2-shot">${art("driveway7", { r: 8, ic: "camera" })}</div>`),
      ev("16:52", "server", "teal", "Porch light at sunset ran", "Home Assistant · on until 23:00"),
      ev("15:10", "user", "graphite", "Alex left", "Away since then"),
    ];
    return `<div class="hn2-tl">
      <div class="hn2-th"><b>Today</b><span class="sp"></span>${seg(["All", "Devices", "Automations"], o.q ? "Automations" : "All")}</div>
      <div class="scroll"><div class="hn2-evs">${items.join("")}</div></div>
      ${o.q ? "" : `<div class="hn2-en"><div class="k">${icon("zap")}Energy today<b>8.4 kWh</b><span>12% less than yesterday</span></div>${bars([.2, .15, .1, .1, .12, .3, .6, .5, .35, .3, .28, .4, .45, .38, .33, .42, .7, .9, .8, .55], { h: 30, c: "var(--sw-amber)", gap: 2 })}</div>`}
    </div>`;
  };
  const hdrN2 = (o = {}) => header({ icon: "home", name: "Home", center: o.q ? `<div class="search focus wide">${icon("search")}<span>hallway</span><span class="key">Esc</span></div>` : search("Search devices, rooms and automations", "Ctrl F", "wide"),
    end: `${btn("Cameras", "ghost", "camera")}${btn("Automations", "ghost", "zap")}<span class="hstat"><span class="hdot"></span>${wideOnly(HOUSE)}</span>` }).replace(ib("sidebar", "Sidebar (Ctrl+B)"), "");
  const pageN2 = (o = {}) => `<div class="cols"><div class="main hn2-main">
      ${o.q ? "" : `<div class="hn2-top"><div><b>Good evening</b><span>5 lights on · 21.5° inside · 2 of 3 home</span></div><span class="sp"></span>${btn("Arrange", "ghost", "grid")}</div><div class="hn2-sc">${scenes()}</div>`}
      <div class="scroll hn2-list">${listN2(o)}</div>
    </div>${tlN2(o)}</div>`;

  REG("home", {
    name: "Home", accent: "green",
    summary: "Home already does a lot (device cards, scenes, cameras, robots and three kinds of automation), but your rooms hide behind chips on one page, every page puts different bare icons in the header, and the connection lives in three places.",
    problems: [
      "<b>Rooms aren't in the sidebar:</b> they're a row of chips at the top of Rooms that wraps once you have more than a few, so getting to the kitchen is two clicks and a scan.",
      "<b>The header changes with every page:</b> a pencil on Overview, a grid and an eye on Rooms, a + on Automations, a refresh on Activity. None of them has a label, and the eye repeats Settings › Rooms › Show diagnostic entities.",
      "<b>Search only exists on Rooms:</b> the field vanishes on other pages, and Ctrl+F jumps you to Rooms to bring it back.",
      "<b>The connection is in three places:</b> the sidebar's foot, a Connections page under a lone “SETUP” heading, and Settings › Server and token.",
      "<b>Two ways to change Overview:</b> its edit toggle in the header and Settings › Overview sections do the same job.",
      "<b>New automation is a bare +</b> in the header, and Activity sits apart from Automations, so seeing what one automation did means switching pages and finding it in a list of every run.",
      "<b>No sense of the house at a glance:</b> Overview is a list of sections with plain headings; nothing says which rooms are warm, lit or open.",
    ],
    today: [],
    todayNote: "No screenshot: Home has no test app ID yet, so a test copy can't run beside your own. The problems come from its code.",
    options: [
      { id: "a", name: "Rooms at a glance", idea: "A home screen of rooms instead of a sidebar. Tabs across the header (Home, Cameras, Automations, Activity); Home says in one line what's going on, then shows a card per room with its temperature, what's on or open, and quick toggles. Choose a room and its devices slide in from the right, ready to use. Best if you think in rooms and mostly want to switch things off from the couch.",
        shots: [
          ["b-home","Home","A card per room; the living room open on the right"],
          ["b-cameras","Cameras","A camera wall with Live on each"],
          ["b-home-800","At 800 px","Rooms in two columns; the room opens over them"],
        ] },
      { id: "b", name: "Automations first", idea: "Keeps the sidebar of option A, and rebuilds Automations and Activity as one place. Automations are grouped by where they run (this computer, Home Assistant, or both), each with a switch; the selected one reads as a sentence (When, Only if, Then) with its recent runs right below, and the canvas gets a proper toolbar and an inspector for the selected step. Best if automations are the reason you open Home.",
        shots: [
          ["c-automations","Automations","Grouped by where they run; steps and recent runs"],
          ["c-canvas","The canvas","Labelled toolbar; the selected step in the inspector"],
          ["c-automations-800","At 800 px","Rail, list and the selected automation"],
        ] },
      { id: "c", name: "Floor plan", idea: "Home opens on a plan of your house: each room drawn where it is, glowing where lights are on, with its devices as small markers and the people who are home. Layers across the top (Lights, Climate, Security, Energy) show one kind of thing at a time, so Climate colours every room by its temperature. Choose a room or a device and its controls open beside the plan. Outside holds the garden, the mower and the outdoor cameras, and a robot's marker opens its map. You draw the plan once in Edit plan (or start from a box per room). Best if you know your house by where things are, not by their names.",
        shots: [
          ["n1-home", "Home", "The plan; the living room open on the right"],
          ["n1-climate", "The Climate layer", "Rooms coloured by temperature; the thermostat open"],
          ["n1-home-800", "At 800 px", "Rail, the plan, and the room as a small card"],
        ] },
      { id: "d", name: "List and today's timeline", idea: "Everything in one place, no pages to switch: every device in a dense list grouped by room, each with its control right on the row (a switch, a brightness bar, − and +), and Pinned at the top. Beside it, a timeline of today: who came and went, what the automations did, camera events with their still, the robot's runs, and anything that needs you. Search finds devices, rooms and automations together, and the timeline follows it. Cameras and Automations open from the header. Best if you'd rather scan than browse.",
        shots: [
          ["n2-home", "Home", "Devices by room; today's timeline beside them"],
          ["n2-search", "Searching “hallway”", "Devices and automations together; what they did today"],
          ["n2-home-800", "At 800 px", "The list and a narrower timeline"],
        ] },
    ],
    pages: {
      "a-overview": () => win({ hdr: hdr(), side: sideA("overview"), page: overviewA() }),
      "a-room": () => win({ hdr: hdr(), side: sideA("Living room"), page: roomA() }),
      "b-home": () => win({ hdr: hdrB("Home"), side: "", page: homeB({ noDrawer: NARROW }) + (NARROW ? `<div class="veil side-veil">${drawerB()}</div>` : "") }),
      "b-cameras": () => win({ hdr: hdrB("Cameras"), side: "", page: camerasB() }),
      "c-automations": () => win({ hdr: hdr({ end: `<button class="newbtn">${icon("plus")}<span>New automation</span><span class="key">Ctrl N</span></button>` }), side: sideA("autos", { noTiles: true }), page: autosC() }),
      "c-canvas": () => win({ hdr: hdr({ end: `<button class="newbtn">${icon("plus")}<span>New automation</span><span class="key">Ctrl N</span></button>` }), side: sideA("autos", { noTiles: true }), page: canvasC() }),
      "n1-home": () => railed(win({ hdr: hdrN1(), side: sideN1(), page: pageN1({ sel: "living", pop: NARROW }) })),
      "n1-climate": () => railed(win({ hdr: hdrN1(), side: sideN1(), page: pageN1({ layer: "Climate" }) })),
      "n2-home": () => win({ hdr: hdrN2(), side: "", page: pageN2() }),
      "n2-search": () => win({ hdr: hdrN2({ q: true }), side: "", page: pageN2({ q: true }) }),
    },
    icons: {
      bulb: '<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2V16h5v-.1c0-.8.4-1.5 1-2A6 6 0 0 0 12 3z"/>',
      thermo: '<path d="M14 14.8V5a2 2 0 0 0-4 0v9.8a4 4 0 1 0 4 0z"/><path d="M12 11v6"/>',
      door: '<path d="M6 21V4.5A1.5 1.5 0 0 1 7.5 3h9A1.5 1.5 0 0 1 18 4.5V21M4 21h16"/><path d="M14.5 12h.01" stroke-width="2.6"/>',
      window2: '<rect x="4" y="3.5" width="16" height="17" rx="1.5"/><path d="M12 3.5v17M4 12h16"/>',
      camera: '<rect x="3" y="7" width="13" height="10" rx="2.5"/><path d="m16 11 5-3v8l-5-3"/>',
      robot: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="9" r="2.5"/><path d="M6.5 15.5h11"/>',
      mower: '<path d="M3 16h14l2.5-6H10L8 6H4"/><circle cx="7" cy="17.5" r="2"/><circle cx="16" cy="17.5" r="2"/>',
      fan: '<circle cx="12" cy="12" r="1.8"/><path d="M12 10.2C11 6 12.5 3 15 3.5s2 4.5-3 6.7M13.8 12c4.2-1 7.2.5 6.7 3s-4.5 2-6.7-3M12 13.8c1 4.2-.5 7.2-3 6.7s-2-4.5 3-6.7M10.2 12C6 13 3 11.5 3.5 9s4.5-2 6.7 3"/>',
      speaker: '<rect x="5" y="3" width="14" height="18" rx="3"/><circle cx="12" cy="14" r="3.5"/><path d="M12 7h.01" stroke-width="2.6"/>',
      plug: '<path d="M9 3v5M15 3v5M6 8h12v3a6 6 0 0 1-12 0zM12 17v4"/>',
      zap: '<path d="M13 2.5 4.5 13.5H11l-1 8 8.5-11H12z"/>',
      garage: '<path d="M3 10 12 4l9 6v10.5H3z"/><path d="M7 20.5V13h10v7.5M7 16.5h10"/>',
      sofa: '<path d="M5 11V8a2.5 2.5 0 0 1 2.5-2.5h9A2.5 2.5 0 0 1 19 8v3"/><path d="M3 13a2 2 0 0 1 4 0v1.5h10V13a2 2 0 0 1 4 0v4.5H3zM5 17.5V20M19 17.5V20"/>',
      bed: '<path d="M3 19V6M3 14h18v5M21 14v-2.5A2.5 2.5 0 0 0 18.5 9H11v5"/><circle cx="6.8" cy="11.3" r="1.6"/>',
      utensils: '<path d="M7 3v8M5 3v5a2 2 0 0 0 4 0V3M7 11v10M17 21V3c-2 1.5-3 4-3 7h3"/>',
      tree: '<path d="M12 21v-5M12 3 6 11h3l-4 5h14l-4-5h3z"/>',
      drop: '<path d="M12 3.5s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/>',
      eyeoff: '<path d="M3 3l18 18M10.6 5.6A9.6 9.6 0 0 1 12 5.5c6 0 9.5 6.5 9.5 6.5a17 17 0 0 1-3 3.8M6.4 6.5A16.5 16.5 0 0 0 2.5 12S6 18.5 12 18.5a9 9 0 0 0 4.5-1.2M9.9 9.9a3 3 0 0 0 4.2 4.2"/>',
      blinds: '<path d="M4 3.5h16M5 3.5v10h14v-10M5 7h14M5 10.5h14M12 13.5v4"/><circle cx="12" cy="19" r="1.3"/>',
    },
  });
})();
