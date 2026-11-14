// Desktop › Dock: Nyx Dock's place, size, hiding, click animation and what's in it.
(() => {
  /* ── Sample data ─────────────────────────────────────────────────── */
  // [icon, swatch, name, running windows]
  const PINS = [["folder", "blue", "Files", 1], ["globe", "coral", "Browser", 2], ["terminal", "graphite", "Terminal", 1], ["music", "pink", "Music", 1], ["mail", "teal", "Mail", 0], ["calendar", "red", "Calendar", 0], ["image", "amber", "Photos", 0]];
  const ANIMS = [["squish", "Squish", "Presses flat and springs back."], ["bounce", "Bounce", "Hops up once, like it's waking."], ["ripple", "Ripple", "A ring spreads out from it."], ["pop", "Pop", "Grows for a moment, then settles."], ["glow", "Glow", "Lights up in its own colour."], ["depress", "Depress", "Sinks in like a button."], ["none", "None", "Stays still."]];

  /* ── Small drawings ──────────────────────────────────────────────── */
  const ai = (ic, c, o = {}) => `<span class="ai ${o.cls || ""}" style="--a:var(--sw-${c})${o.is ? `;--is:${o.is}px` : ""}">${icon(ic)}${o.run ? `<span class="run ${o.run > 1 ? "two" : ""}"></span>` : ""}${o.badge ? `<span class="bdg">${o.badge}</span>` : ""}</span>`;
  const dockItems = (o = {}) => [
    o.apps === false ? "" : ai("grid", "graphite"), o.apps === false ? "" : '<span class="sep"></span>',
    ...PINS.slice(0, o.pins || PINS.length).map(([ic, c, , r]) => ai(ic, c, { run: r })),
    '<span class="sep"></span>', ai("download", "violet", { badge: o.counts === false ? "" : "12" }), o.trash === false ? "" : ai("trash", "graphite", { cls: "tr" }),
  ].join("");
  const dock = (o = {}) => `<div class="ddk ${o.edge || "bottom"} ${o.cls || ""}" style="${o.is ? `--is:${o.is}px;` : ""}${o.style || ""}">${dockItems(o)}${o.meas ? `<span class="meas"><span>${o.meas}</span></span>` : ""}</div>`;
  const dwin = (style, kind = "files", cls = "") => {
    const body = {
      files: `<div class="dsd"><b class="on"></b><b></b><b></b><b></b></div><div class="dmn"><span class="l w60"></span><span class="rw on"></span><span class="rw"></span><span class="rw"></span><span class="rw"></span></div>`,
      term: `<div class="tm"><span><b class="c1 w20"></b><b class="w40"></b></span><span><b class="c2 w30"></b><b class="w50"></b></span><span><b class="c3 w20"></b><b class="w30"></b></span><span><b class="c1 w20"></b><b class="w60"></b></span></div>`,
      web: `<div class="dmn"><span class="pic" style="background:${wall("trip")}"></span><span class="l w70"></span><span class="l w90 dim"></span><span class="l w80 dim"></span></div>`,
      doc: `<div class="dmn"><span class="l w50"></span><span class="l w90 dim"></span><span class="l w80 dim"></span><span class="l w90 dim"></span><span class="l w40 dim"></span></div>`,
    }[kind];
    return `<div class="dw ${cls}" style="${style}"><div class="dwh"><i></i><i></i><i></i><b></b></div><div class="dwb">${body}</div></div>`;
  };
  const dbar = () => `<div class="dbar"><span class="ws"><b class="on"></b><b></b><b></b><b></b></span><span class="clk">Fri 14:20</span><span class="tray">${icon("wifi")}${icon("volume")}${icon("battery")}</span></div>`;
  const desk = (inner, o = {}) => `<div class="dsk ${o.cls || ""}" style="background:${wall(o.seed || "atlas-desk")};${o.style || ""}">${o.bar === false ? "" : dbar()}${inner}</div>`;
  const edges = (on) => `<span class="edges">${["bottom", "left", "right"].map((e) => `<span class="edge ${e} ${e === on ? "on" : ""}" title="${e}"><b></b></span>`).join("")}</span>`;
  const fx = (kind, c = "pink", ic = "music", is) => `<span class="fx ${kind}">${kind === "squish" || kind === "depress" ? '<span class="ghost"></span>' : ""}${ai(ic, c, { is })}${kind === "pop" ? '<i class="k1"></i><i class="k2"></i><i class="k3"></i>' : ""}</span>`;
  const ptr = '<path d="M5 3.5 18 12l-6 1.5-3 6z" fill="currentColor"/>';

  /* ── A: a mini desktop with the dock on it ───────────────────────── */
  const ctlA = () => `
    ${ocard("", [orow("<b>Use Nyx Dock</b>", "Instead of Omarchy's, now and at sign-in.", sw(true), { ic: "dock", sec: "desktop" })], { cls: "icons" })}
    ${ocard("Where it sits", [
      orow("Edge", "Bottom", edges("bottom")),
      orow("Icon size", "", sl(38, "48 px", 140)),
      orow("With two screens", "", dd("Apps on every screen")),
    ])}
    ${ocard("Hiding", [
      orow("Hide", "Smart: only while a window covers it.", seg(["Smart", "Auto", "Never"], "Smart")),
      orow("Window previews", "Rest the pointer on an app to see its windows.", sw(true)),
    ])}
    ${ocard("In the dock", [`<div class="ttiles">${[["grid", "Apps button", "First in line", true], ["search", "Search bar", "Always in Apps", false], ["download", "Badges", "Counts on folders", true], ["trash", "Trash", "At the end", true]].map(([ic, t, d, on]) => `<div class="tt"><div class="r">${icon(ic)}${sw(on)}</div><b>${t}</b><small>${d}</small></div>`).join("")}</div>`])}
    ${NARROW ? ocard("", [orow("Click animation", "How an icon answers a click.", dd("Squish"))]) : ""}
    ${ocard("", [nrow("Back to the defaults", "Pinned apps and folders stay", "", { ic: "refresh", sec: "desktop" })], { cls: "icons" })}`;

  const deskA = () => desk(`
      ${dwin("left:3%;top:9%;width:52%;height:62%", "files")}
      ${dwin("left:57.5%;top:9%;width:39.5%;height:38%", "term", "f")}
      ${dwin("left:57.5%;top:50%;width:39.5%;height:21%", "doc")}
      ${dock({ is: NARROW ? 17 : 22, cls: "hot", meas: "48 px" })}
      <span class="tag" style="left:3%;bottom:${NARROW ? 19 : 18}%">${icon("eye")}Smart: shown until a window covers it</span>`);

  const pvA = () => `
    ${pvhead("On your screen", "48 px, on the bottom edge of the laptop screen.", seg(["Empty desk", "Window over it"], "Empty desk"))}
    <div class="dskw">${deskA()}</div>
    ${NARROW ? "" : `<div class="card anims"><div class="anh"><b>Click animation</b><span>How an icon answers a click.</span></div>
      <div class="anrow">${ANIMS.map(([k, n]) => `<div class="an ${k === "squish" ? "on" : ""}"><div class="stg0">${fx(k, "pink", "music", 26)}</div><span>${n}</span></div>`).join("")}</div></div>
    ${pvfoot("Nothing moves when Reduce motion is on. Right-click the dock for these settings too.", "info")}`}`;

  /* ── B: the dock close up, at its real size ──────────────────────── */
  const ctlB = () => `
    ${ocard("", [orow("<b>Use Nyx Dock</b>", "Instead of Omarchy's, now and at sign-in.", sw(true), { ic: "dock", sec: "desktop" })], { cls: "icons" })}
    ${ocard("Size and place", [orow("Icon size", "", sl(25, "44 px", 130)), orow("Edge", "", seg(["Bottom", "Left", "Right"], "Bottom"))])}
    ${ocard("When it hides", [["Smart", "While a window covers it", true], ["Automatically", "Until the pointer reaches the edge", false], ["Never", "Always on screen", false]].map(([t, d, on]) => `<div class="opt ${on ? "picked" : ""}">${radio(on)}<div class="opt-text"><div>${t}</div><div class="d">${d}</div></div></div>`))}
    ${ocard("Running apps", [orow("With two screens", "", dd("On every screen")), orow("Window previews", "", sw(true))])}
    ${ocard("", [nrow("Apps button, folders and Trash", "", "All on", { ic: "grid", sec: "desktop" }), nrow("Back to the defaults", "", "", { ic: "refresh", sec: "desktop" })], { cls: "icons" })}`;

  const pvB = () => {
    // The dock at real size: 44 px icons; work out where each one sits for the labels.
    const is = 44, g = is * 0.24, items = [is, 1, ...Array(6).fill(is), 1, is, is];
    const total = items.reduce((a, b) => a + b, 0) + g * (items.length - 1) + 2 * g;
    const at = (k) => g + items.slice(0, k).reduce((a, b) => a + b + g, 0) + items[k] / 2 - total / 2;
    return `
    ${pvhead("At its real size", "44 px icons, as they'll look on the laptop screen.", btn("Play a click", "sm", "play"))}
    <div class="close" style="background:${wall("atlas-desk")}">
      ${dock({ is, pins: 6 })}
      <div class="pvpop" style="left:calc(50% + ${(at(3) - 132).toFixed(1)}px);top:24px"><div class="pph">${icon("globe")}Browser<span>2 windows</span></div><div class="ths">
        <div class="th on"><div class="tb"><span class="pic" style="background:${wall("trip")}"></span><span class="l" style="top:46px;width:70%"></span><span class="l" style="top:56px;width:50%"></span></div><small>Trip ideas · Lisbon</small></div>
        <div class="th"><div class="tb"><span class="pic" style="background:${wall("soup")}"></span><span class="l" style="top:46px;width:60%"></span><span class="l" style="top:56px;width:40%"></span></div><small>Weeknight recipes</small></div></div></div>
      <div class="callouts">${[["Apps", at(0)], ["Pinned · a dot when running", (at(2) + at(7)) / 2], ["A folder and the Trash", (at(9) + at(10)) / 2]].map(([t, p]) => `<span class="co" style="left:calc(50% + ${p.toFixed(1)}px)">${t}</span>`).join("")}</div>
    </div>
    <div class="pvrow2">
      <div class="card"><div class="hd2"><b>Click animation</b><span class="sp"></span>${dd("Squish")}</div>
        <div class="frames">${fx("none", "pink", "music", 30)}${icon("chev-r", "ar")}${fx("squish", "pink", "music", 30)}${icon("chev-r", "ar")}${fx("none", "pink", "music", 30)}</div>
        <p>Presses flat and springs back. Nothing moves when Reduce motion is on.</p></div>
      <div class="card"><div class="hd2"><b>Folders</b><span class="sp"></span><span class="lnk">Right-click a folder</span></div>
        <div class="fold-kinds">${[["Stack", "0,8 4,4 8,0"], ["Fan", "0,8 9,2 18,6"], ["Grid", "0,0 16,0 0,12"], ["List", "0,0 0,9 0,18"]].map(([n, p], i) => `<span class="fk ${i === 0 ? "on" : ""}"><span class="ico">${p.split(" ").map((xy) => { const [x, y] = xy.split(","); return `<b style="left:${x}px;top:${y / 1.5}px"></b>`; }).join("")}</span>${n}</span>`).join("")}</div>
        <p>How a folder opens. Each folder keeps its own.</p></div>
    </div>`;
  };

  /* ── C: a list of parts, one open beside it ──────────────────────── */
  const NAV = [["dock", "Where it sits", "Bottom · 48 px"], ["eye", "Hiding", "Smart"], ["spark", "Click animation", "Squish"], ["window", "Window previews", "On"], ["grid", "In the dock", "Apps, folders, Trash"], ["monitor", "Two screens", "Apps on every screen"]];
  const ctlC = (on) => `
    ${ocard("", [orow("<b>Use Nyx Dock</b>", "Instead of Omarchy's, now and at sign-in.", sw(true), { ic: "dock", sec: "desktop" })], { cls: "icons" })}
    ${ocard("Settings", NAV.map(([ic, t, v]) => nrow(t, "", v, { ic, sec: "desktop", cls: t === on ? "picked" : "" })), { cls: "icons navc" })}
    ${ocard("", [nrow("Back to the defaults", "Position, size, hiding and the rest. Pinned apps and folders stay.", "", { ic: "refresh", sec: "desktop" })], { cls: "icons" })}
    <div class="gtitle"><span class="note">Right-click the dock for these settings too.</span></div>`;

  const pvAnim = () => `
    ${pvhead("Click animation", "How an app's icon answers a click. Pick one to see it play.", btn("Play all", "sm", "play"))}
    <div class="agrid">${ANIMS.map(([k, n, d]) => `<div class="ag ${k === "squish" ? "on" : ""}"><div class="stg">${fx("none", "pink", "music", 26)}${icon("chev-r", "ar")}${fx(k, "pink", "music", 26)}</div><div class="nm"><b>${n}</b>${radio(k === "squish")}</div><p>${d}</p></div>`).join("")}
      <div class="ag"><div class="stg">${fx("squish", "coral", "globe", 26)}${fx("squish", "blue", "folder", 26)}</div><div class="nm"><b>On every icon</b></div><p>Apps, folders and Trash all answer the same way.</p></div></div>
    ${ocard("", [orow("Reduce motion is off", "When it's on, nothing in the dock moves, whatever you pick here.", btn("Accessibility", "sm"), { ic: "eye", sec: "desktop" })], { cls: "icons" })}`;

  const scene = (title, sub, o) => `<div class="scn">${desk(`
      ${o.win ? dwin("left:4%;top:12%;width:92%;height:84%", "web", "f") : dwin("left:8%;top:14%;width:56%;height:56%", "files")}
      ${o.gone ? '<span class="ghostdock"></span>' : ""}${dock({ is: 13, pins: 5, cls: o.gone ? "gone" : "" })}
      ${o.ptr ? `<svg class="ptr" viewBox="0 0 24 24" style="left:52%;bottom:2%">${ptr}</svg>` : ""}`, { seed: "atlas-desk" })}
      <div class="cap"><b>${title}</b><span>${sub}</span></div></div>`;
  const pvHide = () => `
    ${pvhead("Hiding", "What the dock does as windows come and go.", "")}
    <div class="scenes">
      ${scene("Nothing in the way", "The dock shows.", {})}
      ${scene("A window covers it", "It slides away.", { win: true, gone: true })}
      ${scene("Pointer at the bottom", "It comes back over the window.", { win: true, ptr: true })}
    </div>
    <div class="hidecards">${[["Smart", "Hides only while a window covers it.", true], ["Automatically", "Hidden until the pointer reaches the edge.", false], ["Never", "Always on screen; windows stop above it.", false]].map(([t, d, on]) => `<div class="hc ${on ? "on" : ""}">${radio(on)}<div><b>${t}</b><span>${d}</span></div></div>`).join("")}</div>
    ${ocard("", [orow("Wait before hiding", "After the window covers it or the pointer leaves.", sl(30, "300 ms", 150))])}
    ${pvfoot("With Reduce motion on, the dock appears and disappears without sliding.", "info")}`;

  /* ── The window ──────────────────────────────────────────────────── */
  const page = (body) => () => swin({ sec: "desktop", page: "Dock", desc: "Where the dock sits, how big it is, and when it hides.", body: body() });

  REG("dock", {
    name: "Dock",
    summary: "One long column of eleven rows: a switch to use Nyx Dock, then position, size, hiding, previews, the click animation, and four switches for what's in it. Nothing on the page shows the dock, so a change only shows once you look down at the real one.",
    problems: [
      "<b>No picture of the dock:</b> the edge, the size and the hiding are a dropdown, a slider reading “42 px” and another dropdown; you have to look away at the real dock to see what changed.",
      "<b>Click animation is a word in a dropdown:</b> Squish, Bounce, Ripple, Pop, Glow and Depress don't say what they look like until you click an icon in the dock.",
      "<b>The how-to sits above the settings:</b> three lines about right-clicking the dock and its folders push “Position” down and wrap further at 800 px.",
      "<b>Every row looks the same:</b> eleven text rows with long descriptions; the ones you'd change often (edge, size, hiding) look like the rare ones (Apps search bar, folder counts).",
      "<b>Hide's choices are explained in one sentence:</b> “Smart: hide while a window covers it. Automatically: until the pointer reaches the edge.” wraps to two lines at 800 px, and Never isn't explained.",
    ],
    today: [["dock-1280", "Today", ""], ["dock-800", "Today at 800 px", ""]],
    options: [
      { id: "a", name: "The dock on a desk", idea: "A mini desktop shows the dock on its edge at its size, with the hiding written on it, and the click animations as a row of frames under it to pick from. The controls are four short cards: where it sits (a picture of each edge), hiding and previews, what's in the dock as three tiles, and the rare things as rows that open a level down.",
        shots: [["a-desk", "The dock on a desk", "Edge, size and hiding drawn; the animations picked under it"], ["a-desk-800", "At 800 px", "The desk above; the click animation moves into the controls"]] },
      { id: "b", name: "Close up, at real size", idea: "The preview is the dock itself at the size it will be on screen, with a window preview open over Browser and labels for its parts. Under it, two cards for things you can't see until you use them: the click animation as frames, and how folders open. Hiding is three plain choices with a line each.",
        shots: [["b-close", "Close up at real size", "Window previews, labels for the parts, frames of the click"]] },
      { id: "c", name: "One part at a time", idea: "The controls are a list of the dock's parts with their current value; the chosen one opens on the right, large, with pictures: every click animation as before-and-after frames, or the three hiding choices acted out on small desks. Good if the dock gains more settings, since each part has room.",
        shots: [["c-anim", "Click animation open", "Every animation as frames, picked like a radio"], ["c-hide", "Hiding open", "The hiding acted out, and the delay"]] },
    ],
    pages: {
      "a-desk": page(() => split(ctlA(), pvA(), { sec: "desktop" })),
      "b-close": page(() => split(ctlB(), pvB(), { sec: "desktop", ctlw: 400 })),
      "c-anim": page(() => split(ctlC("Click animation"), pvAnim(), { sec: "desktop", ctlw: 360 })),
      "c-hide": page(() => split(ctlC("Hiding"), pvHide(), { sec: "desktop", ctlw: 360 })),
    },
  });
})();
