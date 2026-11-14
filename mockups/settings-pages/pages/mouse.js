// Input › Mouse, in style B: a picture of the mouse and its acceleration, or each mouse on its own.
(() => {
  const P = { sec: "input", page: "Mouse", desc: "Pointer speed, acceleration, scrolling, and settings for one mouse." };

  /* A mouse, top view: o = { lefty, natural, size } */
  const mouseArt = (o = {}) => {
    const pri = o.lefty ? "r" : "l";
    return `<svg class="ms-art" viewBox="0 0 160 240" width="${o.size || 150}">
      <defs><linearGradient id="msg" x1="0" x2="0" y1="0" y2="1"><stop offset="0" class="g0"/><stop offset="1" class="g1"/></linearGradient></defs>
      <path class="body" d="M80 6C38 6 14 40 14 92v62c0 46 28 80 66 80s66-34 66-80V92C146 40 122 6 80 6z"/>
      <path class="btn ${pri === "l" ? "pri" : ""}" d="M78 8C40 10 16 42 16 92v8h62z"/>
      <path class="btn ${pri === "r" ? "pri" : ""}" d="M82 8c38 2 62 34 62 84v8H82z"/>
      <rect class="wheel" x="71" y="34" width="18" height="40" rx="9"/>
      <path class="wl" d="M74 44h12M74 52h12M74 60h12"/>
      <path class="arr" d="M80 28V14M75 19l5-6 5 6"/><path class="arr" d="M80 80v14M75 89l5 6 5-6"/>
    </svg>`;
  };
  /* Acceleration: pointer travel against hand speed. */
  const accel = (flat) => `<svg class="ms-acc" viewBox="0 0 300 170" preserveAspectRatio="none">
      ${[0, 1, 2, 3].map((i) => `<line x1="0" x2="300" y1="${20 + i * 40}" y2="${20 + i * 40}" class="g"/>`).join("")}
      <path d="M0 140 L300 40" class="flat ${flat ? "on" : ""}"/>
      <path d="M0 140 C90 136 160 110 300 18" class="adapt ${flat ? "" : "on"}"/>
      
    </svg><div class="ms-ax"><span>Slow hand</span><span>Hand speed</span><span>Fast hand</span></div>`;

  /* ═══ A: the mouse, drawn ═══════════════════════════════════════════ */
  const pointer = () => split(`
    ${ocard("Pointer", [
      orow("Speed", "Mice and trackpads", sl(60, "+0.20", 110), { ic: "mouse", sec: "input" }),
      orow("Acceleration", "", seg(["Adaptive", "Flat"], "Adaptive"), { ic: "spark", sec: "input" }),
      orow("Left-handed", "Swap the left and right buttons", sw(false), { ic: "swap", sec: "input" }),
    ], { first: true, cls: "icons" })}
    ${ocard("Scrolling", [
      orow("Natural scrolling", "Content moves with the wheel", sw(false), { ic: "scroll", sec: "input" }),
      orow("Scroll speed", "", sl(31, "1.00×", 130), { ic: "sliders", sec: "input" }),
    ], { cls: "icons" })}
    ${ocard("Mice", [
      nrow("Glide M3", "Bluetooth · its own speed and acceleration", `${icon("battery", "ms-bat")}80%`, { ic: "mouse", sec: "input" }),
      nrow("Office mouse", "Not connected · seen on Tuesday", "", { ic: "hist", sec: "input" }),
    ], { cls: "icons", note: "Give one mouse settings of its own." })}`,
    `${pvhead("Every mouse", "How the pointer and the wheel behave, unless a mouse has its own settings.", seg(["Every mouse", "Glide M3"], "Every mouse"))}
     <div class="ms-row">
       <div class="card ms-pic">${mouseArt()}
         <div class="ms-lab l"><b>Click</b><span>Left button</span></div>
         <div class="ms-lab r"><b>Menu</b><span>Right button</span></div>
         <div class="ms-lab w"><b>Wheel down</b><span>The page moves up</span></div></div>
       <div class="card ms-chart"><div class="ms-ch"><b>Adaptive acceleration</b><span>Quick flicks go further; slow moves stay precise.</span></div>${accel(false)}
         <div class="ms-key"><span><i class="adapt"></i>Adaptive</span><span><i class="flat"></i>Flat: the same distance at any speed, best for games</span></div></div>
     </div>
     <div class="card ms-pad"><div class="ms-ph"><b>Try it</b><span>Move across the pad: the trail shows how far the pointer goes.</span></div>
       <svg class="ms-trail" viewBox="0 0 560 110" preserveAspectRatio="none"><path d="M20 86 C120 84 160 30 260 34 S420 90 540 26"/>${[[20, 86], [140, 62], [260, 34], [400, 70], [540, 26]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3.5"/>`).join("")}</svg>
       <div class="ms-target">${icon("pointer")}</div></div>`, { sec: "input", cls: "ms-a" });

  /* ═══ B: each mouse on its own ═════════════════════════════════════ */
  const devs = (sel) => `
    ${ocard("", [
      `<div class="opt ${sel === 0 ? "picked" : ""}"><span class="lic" style="--tc:var(--sec-input)">${icon("sliders")}</span><div class="opt-text"><div>Every mouse</div><div class="d">Speed +0.20 · adaptive · normal scrolling</div></div>${icon("chev-r", "cv")}</div>`,
    ], { first: true, cls: "icons" })}
    ${ocard("Connected", [
      `<div class="opt ${sel === 1 ? "picked" : ""}"><span class="lic" style="--tc:var(--sec-input)">${icon("mouse")}</span><div class="opt-text"><div>Glide M3</div><div class="d">Bluetooth · own speed and acceleration</div></div><span class="pill" style="--tc:var(--sec-input)">Own</span>${icon("chev-r", "cv")}</div>`,
      `<div class="opt"><span class="lic" style="--tc:var(--sec-input)">${icon("touchpad")}</span><div class="opt-text"><div>Built-in trackpad</div><div class="d">Tapping and gestures are on Trackpad</div></div>${icon("chev-r", "cv")}</div>`,
    ], { cls: "icons" })}
    ${ocard("Remembered", [
      `<div class="opt ${sel === 2 ? "picked" : ""}"><span class="lic" style="--tc:var(--sec-input)">${icon("mouse")}</span><div class="opt-text"><div>Office mouse</div><div class="d">Not connected · seen on Tuesday</div></div><span class="pill" style="--tc:var(--sec-input)">Own</span>${icon("chev-r", "cv")}</div>`,
    ], { cls: "icons", note: "Mice with their own settings get them back when they connect." })}`;
  const own = (o) => `<div class="ms-own">${o ? `<span class="pill" style="--tc:var(--sec-input)">Own</span>` : `<span class="ms-same">Same as every mouse</span>`}</div>`;
  const device = () => split(devs(1), `
    <div class="ms-dh"><div class="ms-mini">${mouseArt({ size: 54 })}</div><div><b>Glide M3</b><span>Connected over Bluetooth · battery 80%</span></div><span class="sp"></span>${btn("Use every mouse's settings", "sm")}</div>
    <div class="card ms-ov">
      ${orow("Speed", own(true), sl(70, "+0.40", 150), { ic: "mouse", sec: "input" })}
      ${orow("Acceleration", own(true), seg(["Adaptive", "Flat"], "Flat"), { ic: "spark", sec: "input" })}
      ${orow("Natural scrolling", own(false), sw(false), { ic: "scroll", sec: "input", cls: "same" })}
    </div>
    <div class="ms-row b">
      <div class="card ms-chart"><div class="ms-ch"><b>Flat, at +0.40</b><span>The same distance however fast you move.</span></div>${accel(true)}</div>
      <div class="card ms-ext">${T("puzzle", "input")}<b>Buttons and DPI</b><span>Glide's own app can set its side buttons and sensor.</span>${btn("Get it from Extensions", "sm")}</div>
    </div>
    ${pvfoot("They come back whenever the Glide M3 reconnects.", "check-c", btn("Forget this mouse", "sm ghost"))}`, { sec: "input", cls: "ms-b" });

  REG("mouse", {
    name: "Mouse",
    summary: "Three groups of rows: Pointer (speed as a −1 to 1 slider, acceleration, left-handed), Scrolling, and Per device, where every connected mouse, under its hardware name, gets a stacked editor of its own sliders and dropdowns. Remembered mice are a fold below. Nothing shows what the numbers do.",
    problems: [
      "<b>Speed is a bare number:</b> “Pointer speed 0.20, 0 is the default”, from −1 to 1, with nothing to try it on.",
      "<b>Acceleration needs reading:</b> Adaptive or Flat in a dropdown, explained in a sentence about gaming.",
      "<b>Hardware names:</b> per-device editors are titled “ite-tech.-inc.-ite-device(8910)-1”, and a keyboard's pointer shows up as a mouse.",
      "<b>Every mouse's editor is open at once,</b> each with Speed, Acceleration, Natural scroll and a reset button, so two mice make the page twice as long.",
      "<b>No sign of what's overridden:</b> a mouse's own settings look the same as the global ones, so you can't tell which apply.",
      "<b>“(mouse)” in labels</b> (“Natural scrolling (mouse)”, “Scroll speed (mouse)”) to tell them from the trackpad's.",
    ],
    today: [["mouse-1280", "Today", ""], ["mouse-800", "Today at 800 px", ""]],
    options: [
      { id: "a", name: "Mouse picture", idea: "The settings are three short cards: pointer, scrolling, and the mice that have their own settings, by name. On the right a drawn mouse labels what each button and the wheel do (left-handed swaps them, natural scrolling flips the arrows), beside a chart of the acceleration curve against Flat. A pad underneath lets you try the speed. The chip at the top switches the picture to one mouse.",
        shots: [["a-pointer", "Every mouse", ""], ["a-pointer-800", "At 800 px", ""]] },
      { id: "b", name: "Each mouse on its own", idea: "The left is a list: Every mouse first, then the ones connected, then remembered ones. Picking a mouse shows only its settings, each marked Own or Same as every mouse, so it's clear what applies. Its acceleration chart, where to get its button settings, and Forget sit with it.",
        shots: [["b-device", "Glide M3's own settings", "Speed and acceleration are its own"]] },
    ],
    icons: {
      swap: '<path d="M7 4v16M3.5 16.5 7 20l3.5-3.5M17 20V4M13.5 7.5 17 4l3.5 3.5"/>',
      scroll: '<rect x="7" y="3" width="10" height="18" rx="5"/><path d="M12 7v4"/>',
      pointer: '<path d="M5 3.5 19 10l-6 2-2 6z"/>',
    },
    pages: {
      "a-pointer": () => swin({ ...P, body: pointer() }),
      "b-device": () => swin({ ...P, body: device() }),
    },
  });
})();
