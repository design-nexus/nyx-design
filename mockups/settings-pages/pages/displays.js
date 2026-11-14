// Hardware › Displays: arrangement, each display's mode, scale, rotation and brightness,
// rendering, remembered displays and split screens (virtual monitors, experimental).
(() => {
  const page = (body) => () => swin({ sec: "hardware", page: "Displays", desc: "Resolution, scale, brightness and how the screens sit.", body: body() });
  const pill = (t, c = "var(--warning)", ic = "") => `<span class="pill" style="--tc:${c}">${ic ? icon(ic) : ""}${t}</span>`;
  const exp = () => pill("Experimental", "var(--sw-violet)");

  // The desk: the laptop screen beside Studio 27.
  const desk = (o = {}) => `<div class="arr2 big">
      ${screenArt("Laptop screen", "2880 × 1800 · 175%", { sel: o.sel !== "studio", main: true, seed: "lap", style: "left:13%;top:31%;width:30%;height:56%" })}
      ${screenArt("Studio 27", "3840 × 2160 · 150%", { sel: o.sel === "studio", seed: "studio", style: "left:45%;top:7%;width:42%;height:74%" })}
      <div class="ahint">${icon("expand")}Drag a screen to move it; the edges snap together</div>
    </div>`;
  const sample = (pct, what) => `<div class="scalepv card"><div class="sp1"><small>At ${pct}% on the ${what}</small><div class="sampw"><div class="samph"><i></i><i></i><i></i><b>Files</b></div><div class="sampb"><span class="sbx"></span><div><b>Documents</b><span>12 items · today</span></div></div><div class="sampb"><span class="sbx v"></span><div><b>Holiday photos</b><span>248 items</span></div></div></div></div>
       <div class="sp2"><b>Text and controls</b><span>About as big as on a 14-inch laptop at 100%. Most people like 150–200% on this screen.</span>${seg(["150", "175", "200"], "175")}</div></div>`;

  /* ── A: the desk, and the chosen screen's settings ─────────────── */
  const deskA = () => split(`
    <div class="gtitle first gflex">Display<span class="sp"></span><span class="dx-nar">${seg(["Laptop screen", "Studio 27"], "Laptop screen")}</span></div>
    <div class="dpick">${[["Laptop screen", "Built in · main", true], ["Studio 27", "HDMI · 27 inch", false]].map(([n, d, on]) => `<div class="dp ${on ? "on" : ""}">${icon(on ? "laptop" : "monitor")}<div><b>${n}</b><span>${d}</span></div></div>`).join("")}</div>
    ${ocard("", [
      orow("Resolution", "", dd("2880 × 1800"), { ic: "monitor" }),
      orow("Refresh rate", "", seg(["60", "90", "120 Hz"], "120 Hz"), { ic: "pulse" }),
      orow("Rotation", "", dd("Normal"), { ic: "rotate" }),
    ], { cls: "icons" })}
    ${ocard("Size and light", [
      orow("Scale", "", dd("175%"), { ic: "scale" }),
      orow("Brightness", "", sl(80, "80%", 120), { ic: "sun" }),
      orow("Bar, dock and widgets", "Turn off for a TV or a projector.", sw(true), { ic: "dock" }),
    ], { cls: "icons" })}
    ${ocard("More", [
      nrow("Rendering", "", "VRR for games", { ic: "chip" }),
      nrow(`Split a screen ${exp()}`, "", "Off", { ic: "columns" }),
      nrow("Remembered displays", "", "2", { ic: "hist" }),
    ], { cls: "icons" })}`,
    `${pvhead("Your desk", "Click a screen to change it. The bar and new windows open on the main one.", `${seg(["Extend", "Mirror", "One screen"], "Extend")}${btn("Identify", "sm", "info")}`)}
     ${desk()}
     ${sample(175, "laptop screen")}`);

  /* ── B: one display at a time ──────────────────────────────────── */
  const thumb = (seed, w = 46, h = 29, o = "") => `<span class="dx-th ${o}" style="width:${w}px;height:${h}px;background:${wall(seed)}"></span>`;
  const drow = (seed, n, d, o = {}) => `<div class="opt ${o.on ? "picked" : ""} ${o.off ? "dx-off" : ""}">${thumb(seed, o.w, o.h)}<div class="opt-text"><div>${n}</div><div class="d">${d}</div></div>${o.end || ""}</div>`;
  const listB = () => split(`
    ${ocard("Connected", [
      drow("lap", "Laptop screen", "Built in · main display"),
      drow("studio", "Studio 27", "HDMI · on the right", { on: true }),
    ], { first: true })}
    ${ocard("Not connected", [
      drow("proj", "Meeting-room projector", "Last used Tuesday", { off: true }),
      drow("tv", "Living-room TV", "Last used in October", { off: true }),
    ], { note: "Their settings come back when they're plugged in again." })}
    ${ocard("For every display", [
      nrow("Arrangement", "Extended · Studio 27 on the right", "", { ic: "grid" }),
      nrow("Rendering", "For all displays", "VRR for games", { ic: "chip" }),
      nrow(`Split a screen ${exp()}`, "", "", { ic: "columns" }),
    ], { cls: "icons" })}`,
    `${pvhead("Studio 27", "Lumen U27 · connected by HDMI", `${btn("Identify", "sm", "info")}`)}
     <div class="dx-hero card">
       <div class="dx-stand"><div class="dx-big" style="background:${wall("studio")}"><span class="mb"></span><span class="mw"></span><span class="mw b"></span><span class="dx-ruler">Looks like 2560 × 1440</span></div><i class="dx-neck"></i><i class="dx-foot"></i></div>
       <div class="dx-facts">${[["Size", "27 inch"], ["Sharpest at", "3840 × 2160"], ["Text looks like", "2560 × 1440"], ["Variable refresh", "Not supported"]].map(([k, v]) => `<div><small>${k}</small><span>${v}</span></div>`).join("")}</div>
     </div>
     <div class="dx-grid card">
       ${orow("Use this display", "", sw(true))}
       ${orow("Main display", "", sw(false))}
       ${orow("Resolution", "", dd("3840 × 2160"))}
       ${orow("Refresh rate", "", seg(["30", "60 Hz"], "60 Hz"))}
       ${orow("Scale", "", seg(["125", "150", "175"], "150"))}
       ${orow("Rotation", "", `<div class="seg icons dx-rot">${[0, 90, 180, 270].map((d) => `<button class="${d === 0 ? "on" : ""}"><i class="dx-r" style="transform:rotate(${d}deg)"></i></button>`).join("")}</div>`)}
       ${orow("Brightness", "", sl(60, "60%", 110))}
       ${orow("Bar, dock and widgets", "", sw(true))}
       ${orow("Position", "", dd("Right of the laptop"))}
       ${orow("Show the laptop screen here", "", sw(false))}
     </div>
     <div class="pvfoot">${icon("info")}<span>Changes ask “Keep these settings?” and go back on their own after 15 seconds.</span></div>`, { ctlw: 330 });

  /* ── C: the picture follows the card you're in ─────────────────── */
  const fold = (ic, t, v) => `<div class="card dx-fold">${orow(t, v, icon("chev-d", "cv"), { ic })}</div>`;
  const renderC = () => split(`
    ${fold("grid", "Arrangement", "Extended · Studio 27 on the right")}
    ${fold("laptop", "Laptop screen", "2880 × 1800 · 120 Hz · 175% · main")}
    ${fold("monitor", "Studio 27", "3840 × 2160 · 60 Hz · 150%")}
    <div class="gtitle gflex">Rendering<span class="sp"></span><span class="note">For all displays</span></div>
    <div class="card dx-focus">
      ${orow("Variable refresh rate", "Smoother games and video when the frame rate dips.", dd("For games"), { ic: "refresh" })}
      ${orow("Hardware cursor", "Less work for the pointer.", dd("Automatic"), { ic: "mouse" })}
      ${orow("Direct to screen", "Full-screen games skip a step. Turn off if they flicker.", dd("Automatic"), { ic: "chip" })}
    </div>
    <div class="dx-gap"></div>
    ${fold("columns", `Split a screen ${exp()}`, "Off · every screen whole")}
    ${fold("hist", "Remembered displays", "Meeting-room projector, Living-room TV")}`,
    `${pvhead("Rendering", "What the graphics settings are doing on each screen right now.")}
     <div class="dx-live">
       ${[["lap", "Laptop screen", "A game is full screen", [["Variable refresh", "On", 1], ["Hardware cursor", "Yes", 1], ["Direct to screen", "Yes", 1]]],
          ["studio", "Studio 27", "Showing the desktop", [["Variable refresh", "Not supported", 0], ["Hardware cursor", "Yes", 1], ["Direct to screen", "Not now", 2]]]].map(([s, n, d, rows]) => `
         <div class="card dx-lc"><div class="dx-lh">${thumb(s, 40, 25)}<div><b>${n}</b><span>${d}</span></div></div>
         ${rows.map(([k, v, ok]) => `<div class="dx-lr"><span>${k}</span><b class="${ok === 1 ? "ok" : ok === 0 ? "no" : ""}">${v}</b></div>`).join("")}</div>`).join("")}
     </div>
     <div class="card dx-timing">
       <div class="dx-tt"><b>Why variable refresh helps</b><span>A game making 48 frames a second on a 120 Hz screen</span></div>
       ${[["Fixed 120 Hz", false], ["Variable refresh", true]].map(([lab, vrr]) => {
         const ticks = Array.from({ length: 31 }, (_, i) => `<i style="left:${(i / 30) * 100}%"></i>`).join("");
         const frames = [0, 2.5, 5, 7.5, 10, 12.5, 15, 17.5, 20, 22.5, 25, 27.5].map((t, i) => {
           const at = vrr ? t : Math.ceil(t);
           const wobble = !vrr && i % 2 === 1;
           return `<b class="${wobble ? "late" : ""}" style="left:${(at / 30) * 100}%"></b>`;
         }).join("");
         return `<div class="dx-trow"><span>${lab}</span><div class="dx-track">${ticks}${frames}</div><em class="${vrr ? "ok" : ""}">${vrr ? "Even" : "Uneven"}</em></div>`;
       }).join("")}
       <div class="dx-tleg"><span><i class="tk"></i>Screen refresh</span><span><i class="fr"></i>New frame shown</span><span><i class="fr late"></i>Shown late</span></div>
     </div>
     <div class="card dx-tips"><div class="dx-th2">If something looks wrong</div>
       ${[["Full-screen games flicker", "Set Direct to screen to Off"], ["The pointer leaves trails or disappears", "Set Hardware cursor to Off"], ["The screen goes dark for a moment in games", "Set Variable refresh rate to Off"]].map(([a, b]) => `<div class="dx-tip"><span>${a}</span>${icon("chev-r", "cv")}<b>${b}</b></div>`).join("")}</div>
     ${pvfoot("“For games” turns variable refresh on only while a game is full screen. Automatic lets the system decide.", "check-c")}`, { ctlw: 440 });

  const regions = () => `<div class="dx-split">
      <div class="dx-mon" style="background:${wall("studio")}">
        ${[["1–9", "Your usual workspaces", 26], ["1–3", "Region 2", 48], ["1–3", "Region 3", 26]].map(([ws, n, w], i) => `<div class="dx-reg ${i === 1 ? "on" : ""}" style="flex:${w}"><b>${n}</b><span>Workspaces ${ws}</span>${i === 1 ? `<em>${icon("monitor")}Focused</em>` : ""}</div>`).join(`<i class="dx-gut"></i>`)}
      </div>
      <div class="dx-pct"><span style="flex:26">26%</span><span style="flex:48">48%</span><span style="flex:26">26%</span></div>
    </div>`;
  const splitC = () => split(`
    ${fold("grid", "Arrangement", "Extended · Studio 27 on the right")}
    ${fold("monitor", "Studio 27", "3840 × 2160 · 60 Hz · 150%")}
    ${fold("chip", "Rendering", "Variable refresh for games · the rest automatic")}
    <div class="gtitle gflex">Split a screen<span class="sp"></span>${exp()}</div>
    <div class="card dx-focus">
      ${orow("Split this screen", "", dd("Studio 27"), { ic: "monitor" })}
      <div class="opt dx-lay">${[["Off", [1]], ["Two equal", [1, 1]], ["Three equal", [1, 1, 1]], ["Larger middle", [1, 2, 1]]].map(([n, p]) => `<div class="dx-l ${n === "Larger middle" ? "on" : ""}"><span>${p.map((f) => `<i style="flex:${f}"></i>`).join("")}</span><small>${n}</small></div>`).join("")}</div>
      ${orow("Shortcuts act on", "", dd("Where the focus is"), { ic: "keyboard" })}
      ${orow("Full screen fills", "", dd("Its region"), { ic: "expand" })}
      ${orow("Save this layout as", "", `<span class="field dx-name"><span>Writing</span></span>`, { ic: "bookmark" })}
    </div>
    <div class="dx-gap"></div>
    ${fold("hist", "Remembered displays", "Meeting-room projector, Living-room TV")}`,
    `${pvhead("Studio 27, split in three", "Drag the gaps to change the sizes. Nothing closes when you join them again.", `${btn("Join for now", "sm")}`)}
     ${regions()}
     <div class="card dx-wsn">${icon("info", "inl")}<div><b>The left region keeps your usual workspaces</b><span>The others get their own, numbered from 1, and come back where they were after you join the screen.</span></div></div>
     ${pvfoot("If a layout ever leaves you stuck, one command in a terminal gives every screen back whole.", "check-c")}`, { ctlw: 440 });

  REG("displays", {
    name: "Displays",
    summary: "Displays has the right parts (an arrangement you drag, a card per screen, rendering, remembered displays, and split screens behind an experimental switch), but they arrive as one long column: the desk is a dark box with output names, and each screen's card opens with read-outs before its controls.",
    problems: [
      "<b>The desk is just names:</b> the arrangement draws each screen as a label on a dark box, with no outline, so overlapping screens print on top of each other.",
      "<b>Read-outs before controls:</b> every screen's card starts with “VRR active: Yes” and “Hardware cursors in use: Yes”; brightness, resolution and scale come after.",
      "<b>Port names as headings:</b> the cards are headed eDP-2 or HDMI-A-1 with the maker's model code under them, not “Laptop screen” or “Studio 27”.",
      "<b>Scale is a number in a list:</b> nothing shows how big text and windows will be before you pick 150% or 175%.",
      "<b>Rare things sit in line:</b> Rendering, Remembered displays and the experimental split screens are full groups on the same scroll as resolution.",
      "<b>At 800 px</b> the desk takes the first screen and every row's explanation wraps; you scroll past the read-outs to reach the first control.",
    ],
    today: [["displays-1280", "Today", "Taken beside test screens, so the arrangement shows those too"], ["displays-800", "Today at 800 px", ""]],
    options: [
      { id: "a", name: "Desk and settings", idea: "Round 1's pick, tidied. The desk fills the right: click a screen to choose it, drag it to move it, and Extend, Mirror or One screen sit above it. Under the desk a sample window shows text at the chosen scale. On the left are the chosen screen's settings in two short cards, and Rendering, Split a screen and Remembered displays are one row each that open their own page.",
        shots: [["a-desk", "The desk with the laptop screen chosen", ""], ["a-desk-800", "At 800 px", "The desk above, the screen's settings below"]] },
      { id: "b", name: "One display at a time", idea: "A list of every display on the left: the ones connected now, then the ones you've set up before that aren't plugged in (you can still change them). Choosing one shows it on the right as a large picture at its real shape, with what it supports and every setting for it in one card. The arrangement and rendering are rows under the list.",
        shots: [["b-list", "Studio 27 chosen", "Remembered displays sit in the same list, dimmed"]] },
      { id: "c", name: "The picture follows the card", idea: "Every setting is in one column on the left, and the picture on the right changes with the card you're in. In Rendering it shows what variable refresh, the hardware cursor and direct-to-screen are doing on each screen right now, and why variable refresh helps. In Split a screen it shows the screen cut into regions with their workspaces. Cards you aren't using fold to one line.",
        shots: [["c-render", "Rendering, with each screen's live status", "Today's read-outs move here, out of the way"], ["c-split", "Split a screen (experimental)", "The regions you drag, and which workspaces each gets"]] },
    ],
    pages: { "a-desk": page(deskA), "b-list": page(listB), "c-render": page(renderC), "c-split": page(splitC) },
  });
})();
