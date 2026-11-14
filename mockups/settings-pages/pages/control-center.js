// Desktop › Control Center: the quick settings panel: how it opens, its tiles and pages, and
// its two items in the bar.
(() => {
  /* ── Sample data ─────────────────────────────────────────────────── */
  // [icon, name, state, on, class]
  const PAGE1 = [["wifi", "Wi-Fi", "Home-5G", true], ["bluetooth", "Bluetooth", "2 devices", true], ["belloff", "Do not disturb", "Off", false, "dnd"], ["moon", "Night Light", "From sunset", true], ["contrast", "Dark style", "On", true], ["cup", "Keep awake", "Off", false], ["rec", "Record screen", "Ready", false], ["plane", "Airplane mode", "Off", false]];
  const MORE = [["hotspot", "Hotspot", "Share this connection"], ["keyboard", "Keyboard light", "Brightness"], ["mic", "Microphone", "Mute"], ["picker", "Colour picker", "Pick from the screen"], ["screenshot", "Screenshot", "Region or window"], ["power", "Power mode", "Balanced"]];

  /* ── Small drawings ──────────────────────────────────────────────── */
  const tile = ([ic, n, s, on, cls], o = {}) => `<div class="qtl ${on ? "on" : ""} ${cls || ""} ${o.cls || ""}">${o.edit ? `<span class="rm">${icon("x")}</span>` : ""}<span class="ci">${icon(ic)}</span><div class="tx"><b>${n}</b><span>${s}</span></div>${o.add ? `<span class="add">${icon("plus")}</span>` : ""}</div>`;
  const panel = (o = {}) => `<div class="ccp ${o.edit ? "edit" : ""} ${o.cls || ""}">
      ${o.edit
        ? `<div class="edh"><b>Edit tiles</b><span class="ptabs"><span class="on">Everyday</span><span>Devices</span><span class="add">+</span></span></div>`
        : `<div class="hd2"><div class="tx"><b>Friday 13 November</b><span>Battery 86% · 5 h 10 min left</span></div><span class="cb ${o.hot ? "hot" : ""}">${icon("pen")}</span><span class="cb">${icon("power")}</span></div>`}
      <div class="ctg">${PAGE1.map((t, i) => o.edit && i === 5 ? `<div class="qtl slot">Drop here</div>` : tile(t, { edit: o.edit, cls: o.edit && i === 6 ? "lift" : "" })).join("")}</div>
      ${o.edit ? "" : `<div class="ccs"><div class="r">${icon("volume")}<span class="bar"><b style="width:64%"></b></span></div><div class="r">${icon("sun")}<span class="bar"><b style="width:80%"></b></span></div></div>
      <div class="ccm">${art("slow-tide", { w: 38, h: 38, r: 8 })}<div class="tx"><b>Slow Tide</b><span>The Harbour Lights</span></div><span class="pl">${icon("prev")}${icon("pause")}${icon("next")}</span></div>`}
      <div class="dots"><b class="on"></b><b></b></div></div>`;
  const barstrip = (o = {}) => `<div class="barstrip"><span class="ws"><b class="on"></b><b></b><b></b></span><span class="sp"></span><span>Fri 14:20</span><span class="sp"></span><span class="stw ${o.st === false ? "off" : ""}">${icon("sun")}18°${icon("cpu")}12%${icon("wifi")}${icon("volume")}${icon("battery")}86%</span><span class="cc ${o.cc === false ? "off" : ""}">${icon("sliders")}</span></div>`;
  const note = (t, style) => `<span class="side-note" style="${style}"><span class="dt"></span><span class="ln"></span><span>${t}</span></span>`;

  /* ── A: the panel beside its settings ────────────────────────────── */
  const ctlA = () => `
    ${ocard("Opening it", [
      orow("Keys", "Or the button in the bar.", keys("Super", "D"), { ic: "keyboard", sec: "desktop" }),
      orow("Open on the last page", "Off: it always opens on the first.", sw(true), { ic: "layers", sec: "desktop" }),
    ], { first: true, cls: "icons" })}
    ${ocard("In the bar", [
      barstrip(),
      orow("Nyx Status", "Weather, CPU, memory, network, sound and battery.", sw(true), { ic: "spark", sec: "desktop" }),
      orow("Control Center button", "One icon that opens and closes it.", sw(true), { ic: "sliders", sec: "desktop" }),
    ], { cls: "icons" })}
    ${ocard("Tiles", [
      nrow("Change the tiles", "Add, take off and move them, page by page.", "2 pages", { ic: "grid", sec: "desktop" }),
      orow("Standard layout", "Put back the standard tiles and pages.", btn("Restore", "sm"), { ic: "refresh", sec: "desktop" }),
    ], { cls: "icons" })}`;

  const pvA = () => `
    ${pvhead("Control Center", "Page 1 of 2, as it opens from the bar.", seg(["Everyday", "Devices"], "Everyday"))}
    <div class="ccstage" style="justify-content:${NARROW ? "center" : "flex-start"};padding-left:${NARROW ? 0 : 24}px">${panel({ hot: true })}
      ${note("<b>Pencil:</b> change the tiles", "left:352px;top:calc(50% - 211px)")}
      ${note("<b>Do not disturb</b>, as in Notifications", "left:352px;top:calc(50% - 99px)")}
      ${note("Volume, brightness and music", "left:352px;top:calc(50% + 72px)")}
      ${note("<b>Opens on the last page</b> you left", "left:352px;top:calc(50% + 194px)")}
    </div>`;

  /* ── B: edit the tiles here ──────────────────────────────────────── */
  const ctlB = () => `
    ${ocard("Opening it", [orow("Keys", "", keys("Super", "D")), orow("Open on the last page", "", sw(true))], { first: true })}
    ${ocard("Pages", [
      `<div class="opt picked">${icon("grid", "inl")}<div class="opt-text"><div>Everyday</div><div class="d">8 tiles, volume, brightness and music</div></div><span class="rv">Page 1</span></div>`,
      `<div class="opt">${icon("grid", "inl")}<div class="opt-text"><div>Devices</div><div class="d">4 tiles and the battery of each device</div></div><span class="rv">Page 2</span></div>`,
      `<div class="opt"><span class="addi">${icon("plus")}</span><div class="opt-text"><div class="acc">Add a page</div></div></div>`,
    ], { act: btn("Restore standard", "sm ghost", "refresh") })}
    ${ocard("In the bar", [orow("Nyx Status", "What it shows is set on Bar Plugins.", sw(true)), orow("Control Center button", "", sw(true))])}`;

  const pvB = () => `
    ${pvhead("Editing Everyday", "Drag a tile to move it; × takes it off. Changes show at once.", btn("Done", "primary sm"))}
    <div class="edstage">${panel({ edit: true })}
      <div class="drawer"><div class="dh"><b>More tiles</b><span>Drag one in, or click +</span></div>
        ${MORE.map(([ic, n, s]) => tile([ic, n, s, false], { add: true })).join("")}
      </div></div>
    ${pvfoot("Volume, brightness and the music player stay at the foot of the first page.", "info")}`;

  /* ── C: on the desktop ───────────────────────────────────────────── */
  const ctlC = () => `
    ${ocard("In the bar", [
      orow("Nyx Status", "The weather, CPU, memory, network, sound and battery at a glance.", sw(true), { ic: "spark", sec: "desktop" }),
      orow("Control Center button", "One icon that opens and closes the panel.", sw(true), { ic: "sliders", sec: "desktop" }),
      nrow("What Nyx Status shows", "", "Bar Plugins", { ic: "puzzle", sec: "desktop" }),
    ], { first: true, cls: "icons" })}
    ${ocard("Opening it", [
      orow("Keys", "", keys("Super", "D"), { ic: "keyboard", sec: "desktop" }),
      orow("Open on the last page", "Off: it always opens on the first.", sw(true), { ic: "layers", sec: "desktop" }),
    ], { cls: "icons" })}
    ${ocard("Tiles", [nrow("Change the tiles", "", "2 pages", { ic: "grid", sec: "desktop" }), orow("Standard layout", "", btn("Restore", "sm"), { ic: "refresh", sec: "desktop" })], { cls: "icons" })}`;
  const dwin = (style, kind) => `<div class="dw" style="${style}"><div class="dwh"><i></i><i></i><i></i><b></b></div><div class="dwb">${kind === "files" ? `<div class="dsd"><b class="on"></b><b></b><b></b></div><div class="dmn"><span class="l w60"></span><span class="rw on"></span><span class="rw"></span><span class="rw"></span></div>` : `<div class="dmn"><span class="l w50"></span><span class="l w90 dim"></span><span class="l w80 dim"></span><span class="l w60 dim"></span></div>`}</div></div>`;
  const pvC = () => `
    ${pvhead("On your desktop", "It drops from the button at the right of the bar.", btn("Open the real one", "sm", "external"))}
    <div class="dsk ccd" style="background:${wall("atlas-desk")}">
      <div class="dbar"><span class="ws"><b class="on"></b><b></b><b></b><b></b></span><span class="clk">Fri 14:20</span><span class="tray"><span class="stw">${icon("sun")}18° ${icon("cpu")}12% ${icon("wifi")}${icon("volume")}${icon("battery")}86%</span><span class="cc">${icon("sliders")}</span></span></div>
      ${dwin("left:2.5%;top:10%;width:58%;height:86%", "files")}${dwin("left:62%;top:10%;width:35.5%;height:86%", "doc")}
      <div class="veil2"></div>${panel()}
    </div>
    <div class="card" style="padding:12px 14px;display:flex;flex-direction:column;gap:9px"><div style="display:flex;align-items:center;gap:8px"><b style="font-weight:600">Nyx Status shows</b><span class="dim" style="font-size:.923em">in the bar, beside the button</span><span style="flex:1"></span><span class="lnk">Change on Bar Plugins ${icon("chev-r")}</span></div>
      <div style="display:flex;flex-wrap:wrap;gap:6px">${[["sun", "Weather"], ["cpu", "CPU"], ["server", "Memory"], ["wifi", "Network"], ["bluetooth", "Bluetooth"], ["volume", "Sound"], ["battery", "Battery"]].map(([ic, n]) => chip(n, "on", ic)).join("")}</div></div>`;

  /* ── The window ──────────────────────────────────────────────────── */
  const page = (body) => () => swin({ sec: "desktop", page: "Control Center", desc: "The quick settings panel: how it opens, its tiles, and its place in the bar.", body: body() });

  REG("control-center", {
    name: "Control Center",
    summary: "A short page: a row that says Super + D opens it, a switch for opening on the last page, a Restore button for the standard tiles, and two switches for its items in the bar. The tiles themselves can only be changed from the panel, and nothing here shows what the panel looks like.",
    problems: [
      "<b>The panel is never shown:</b> the page is about a panel of tiles, sliders and a music player, and there's no picture of it; “Standard layout · Restore” doesn't say what you'd get back.",
      "<b>The tiles can't be changed here:</b> “Change the tiles with the pencil at the top of the panel” sends you away to do the main thing people come for.",
      "<b>An instruction dressed as a setting:</b> “Open it · Super D, or the bar button” is a row with no control, styled like the rows that have one.",
      "<b>The bar items look unrelated:</b> Nyx Status and the Control Center button are two switches under “In the bar”, with no picture of where they sit; what Nyx Status shows is on another page, said in a note above the group.",
      "<b>Half the page is empty</b> at 1280 px, while the useful parts (tiles, pages) aren't on it.",
    ],
    today: [["control-center-1280", "Today", ""], ["control-center-800", "Today at 800 px", ""]],
    options: [
      { id: "a", name: "The panel beside its settings", idea: "The preview is the panel itself at full size, with notes on the parts the settings change: the pencil, Do not disturb, the page dots. The controls are three cards: opening it (the keys as keycaps, the last-page switch), the bar (a strip of the bar with both items outlined, and their switches), and the tiles, which open a level down to change.",
        shots: [["a-panel", "The panel beside its settings", "Notes on the parts the settings change"], ["a-panel-800", "At 800 px", "The panel, smaller, above the controls"]] },
      { id: "b", name: "Edit the tiles here", idea: "The tiles are changed on this page instead of only in the panel: the preview is the panel in edit mode, with a tile being dragged, a slot to drop it in, and a column of more tiles to add. The controls list the panel's pages to pick which one you're editing, with the opening and bar settings above and below.",
        shots: [["b-edit", "Edit the tiles here", "Dragging a tile; more tiles to add on the right"]] },
      { id: "c", name: "On the desktop", idea: "The preview is a mini desktop with the panel dropped from its button, and Nyx Status beside it in the bar, so the bar items and the panel are seen together. The bar comes first in the controls; under the desktop, what Nyx Status shows is listed, with a link to change it on Bar Plugins.",
        shots: [["c-desk", "On the desktop", "The panel open from the bar, Nyx Status beside it"]] },
    ],
    pages: {
      "a-panel": page(() => split(ctlA(), pvA(), { sec: "desktop" })),
      "b-edit": page(() => split(ctlB(), pvB(), { sec: "desktop", ctlw: 400 })),
      "c-desk": page(() => split(ctlC(), pvC(), { sec: "desktop" })),
    },
    icons: {
      belloff: '<path d="M6.5 8.5a5.5 5.5 0 0 1 9.3-3.9M17.5 11v3l2 3H7M10 20a2 2 0 0 0 4 0M3.5 3.5l17 17"/>',
      contrast: '<circle cx="12" cy="12" r="8.5"/><path d="M12 3.5v17a8.5 8.5 0 0 0 0-17z" fill="currentColor"/>',
      cup: '<path d="M5 9h11v5a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5zM16 10.5h1.5a2.5 2.5 0 0 1 0 5H16M8.5 3.5V6M11.5 3.5V6"/>',
      rec: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="3.5" fill="currentColor"/>',
      plane: '<path d="M10.5 4a1.5 1.5 0 0 1 3 0v5l7 4v2l-7-2v4l2 1.5V20L12 19l-3.5 1v-1.5l2-1.5v-4l-7 2v-2l7-4z"/>',
      hotspot: '<circle cx="12" cy="12" r="2"/><path d="M8.5 8.5a5 5 0 0 0 0 7M15.5 8.5a5 5 0 0 1 0 7M5.5 5.5a9.2 9.2 0 0 0 0 13M18.5 5.5a9.2 9.2 0 0 1 0 13"/>',
      picker: '<path d="m14.5 4.5 5 5-9 9H5.5v-5z"/><path d="m12.5 6.5 5 5"/>',
    },
  });
})();
