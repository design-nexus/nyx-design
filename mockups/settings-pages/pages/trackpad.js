// Input › Trackpad, in style B: a trackpad with every gesture drawn on it, or one gesture at a time.
(() => {
  const P = { sec: "input", page: "Trackpad", desc: "Tapping, clicking, scrolling, and gestures with three and four fingers." };

  const THREE = { left: "Switch workspace", right: "Switch workspace", up: "Glimpse", down: "Scratchpad", pinchin: "Float or tile", pinchout: "Full screen" };
  const DIRS = [["up", "Swipe up", "arrow-u"], ["down", "Swipe down", "arrow-d"], ["left", "Swipe left", "arrow-l"], ["right", "Swipe right", "arrow-r"], ["pinchin", "Pinch in", "pinch-in"], ["pinchout", "Pinch out", "pinch-out"]];

  /* The trackpad with fingers and arrows. o = { n, dir: only this one, trail } */
  const pad = (o = {}) => {
    const n = o.n || 3, xs = n === 3 ? [-34, 0, 34] : [-51, -17, 17, 51], ys = n === 3 ? [6, -6, 4] : [10, -4, -8, 6];
    const show = (d) => !o.dir || o.dir === d;
    const arrow = (d, x1, y1, x2, y2) => show(d) ? `<path class="ar ${o.dir === d ? "hot" : ""}" d="M${x1} ${y1} L${x2} ${y2}" marker-end="url(#tpa${o.dir ? "h" : ""})"/>` : "";
    return `<div class="tp-pad">
      <svg viewBox="-200 -120 400 240" preserveAspectRatio="xMidYMid meet">
        <defs><marker id="tpa" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10z" class="mk"/></marker>
          <marker id="tpah" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10z" class="mk hot"/></marker></defs>
        <rect x="-185" y="-112" width="370" height="224" rx="22" class="surf"/>
        ${arrow("up", 0, -34, 0, -92)}${arrow("down", 0, 34, 0, 92)}${arrow("left", -72, 0, -150, 0)}${arrow("right", 72, 0, 150, 0)}
        ${show("pinchin") ? `<path class="ar pin ${o.dir === "pinchin" ? "hot" : ""}" d="M-120 -80 L-82 -50" marker-end="url(#tpa${o.dir ? "h" : ""})"/><path class="ar pin ${o.dir === "pinchin" ? "hot" : ""}" d="M120 80 L82 50" marker-end="url(#tpa${o.dir ? "h" : ""})"/>` : ""}
        ${show("pinchout") ? `<path class="ar pin ${o.dir === "pinchout" ? "hot" : ""}" d="M82 -50 L120 -80" marker-end="url(#tpa${o.dir ? "h" : ""})"/><path class="ar pin ${o.dir === "pinchout" ? "hot" : ""}" d="M-82 50 L-120 80" marker-end="url(#tpa${o.dir ? "h" : ""})"/>` : ""}
        ${o.trail ? xs.map((x, i) => [3, 2, 1].map((k) => `<circle cx="${x}" cy="${ys[i] + k * 16}" r="${13 - k * 2}" class="ghost" style="opacity:${0.12 * (4 - k)}"/>`).join("")).join("") : ""}
        ${xs.map((x, i) => `<circle cx="${x}" cy="${ys[i] - (o.trail ? 6 : 0)}" r="14" class="fg"/>`).join("")}
      </svg>
    </div>`;
  };
  const label = (d, cls, t) => `<div class="tp-lab ${cls}"><small>${t || DIRS.find((x) => x[0] === d)[1]}</small><span>${THREE[d]}${icon("chev-d")}</span></div>`;

  /* ═══ A: every gesture on one trackpad ═════════════════════════════ */
  const gestures = () => split(`
    ${ocard("Tapping and clicking", [
      orow("Tap to click", "A light tap with one finger", sw(true), { ic: "touch", sec: "input" }),
      orow("Tap with two or three fingers", "", dd("2 = right-click"), { ic: "touchpad", sec: "input" }),
      orow("Tap and drag", "Tap, then touch again and move", sw(true), { ic: "drag", sec: "input" }),
      orow("Right-click by", "", dd("Pressing with two fingers"), { ic: "mouse", sec: "input" }),
      nrow("More", "Drag lock, middle-click, three-finger drag", "", { ic: "sliders", sec: "input" }),
    ], { first: true, cls: "icons" })}
    ${ocard("Scrolling and typing", [
      orow("Natural scrolling", "Content follows your fingers", sw(true), { ic: "scroll", sec: "input" }),
      orow("Scroll speed", "", sl(45, "1.00×", 120), { ic: "sliders", sec: "input" }),
      orow("Ignore the trackpad while typing", "", sw(true), { ic: "keyboard", sec: "input" }),
    ], { cls: "icons" })}`,
    `${pvhead("Gestures", "Click a label to change what that gesture does.", `${seg(["3 fingers", "4 fingers"], "3 fingers")}${sw(true)}`)}
     <div class="tp-stage card">
       <div class="tp-row">${label("pinchin", "l")}${label("up", "c")}${label("pinchout", "r")}</div>
       ${pad({ n: 3 })}
       <div class="tp-row">${label("left", "l", "Swipe left or right")}${label("down", "c")}<div class="tp-follow">${icon("swipe-lr")}<span>Workspaces slide with your fingers</span></div></div>
     </div>
     <div class="tp-opts">${chip("Reverse left and right", "", "swap")}${chip("Reverse up and down", "", "swap")}<span class="sp"></span><span class="lnk">Swipe feel ${icon("chev-r")}</span></div>
     ${pvfoot("Two fingers scroll, and two fingers sideways go back and forward in browsers.", "info")}`, { sec: "input", cls: "tp-a" });

  /* ═══ B: one gesture at a time ═════════════════════════════════════ */
  const list = (on) => `
    ${ocard("", [
      nrow("Tapping and clicking", "Tap to click · 2 fingers right-click", "", { ic: "touch", sec: "input" }),
      nrow("Scrolling", "Natural · 1.00× · ignored while typing", "", { ic: "scroll", sec: "input" }),
    ], { first: true, cls: "icons" })}
    ${ocard("Three fingers", DIRS.map(([d, n, ic]) => `<div class="opt onav ${on === d ? "picked" : ""}"><span class="tp-di">${icon(ic)}</span><div class="opt-text"><div>${n}</div></div><span class="rv">${THREE[d]}</span>${icon("chev-r", "cv")}</div>`), { cls: "tp-list", act: sw(true) })}
    ${ocard("", [
      nrow("Four fingers", "Swipe up: App launcher · down: Lock screen", "2 set", { ic: "hand", sec: "input" }),
      nrow("Swipe feel", "Loop around 5 workspaces · 300 px a swipe", "", { ic: "repeat", sec: "input", cls: on === "feel" ? "picked" : "" }),
    ], { cls: "icons tp-more" })}`;
  const ACTS = ["Nothing", "Switch workspace", "Next workspace", "Last used workspace", "Scratchpad", "Glimpse", "App launcher", "Notification history", "Full screen", "Float or tile", "Close window", "Screenshot", "Lock screen", "Open an app…", "Run a command…"];
  const one = () => split(list("up"), `
    ${pvhead("Swipe up with three fingers", "Opens Glimpse, with every window side by side.", btn("Try it", "sm", "play"))}
    <div class="tp-two">
      <div class="card tp-mini">${pad({ n: 3, dir: "up", trail: true })}</div>
      <div class="tp-to">${icon("chev-r")}</div>
      <div class="card tp-res"><div class="tp-scr" style="--wl:${wall("glimpse")}">${[0, 1, 2, 3, 4, 5].map((i) => `<span class="${i === 1 ? "on" : ""}" style="background:${wall("gw" + i)}"></span>`).join("")}</div><small>Glimpse</small></div>
    </div>
    <div class="tp-acts"><div class="tp-ah">What it does</div><div class="pvchips">${ACTS.map((a) => chip(a, a === "Glimpse" ? "on" : "")).join("")}</div></div>
    <div class="banner2 warn tp-ban">${icon("warn")}<div class="tx"><b>Another file also sets gestures</b><span>Its swipe up with three fingers wins over this one.</span></div>${btn("Turn those off", "sm")}</div>`, { sec: "input", cls: "tp-b" });

  const feel = () => split(list("feel"), `
    ${pvhead("Swipe feel", "How swiping between workspaces behaves.")}
    <div class="card tp-loop">
      <div class="tp-ring">${[1, 2, 3, 4, 5].map((n) => `<div class="tp-ws ${n === 2 ? "on" : ""}" style="--wl:${wall("ws" + n)}"><b>${n}</b></div>`).join("")}</div>
      <svg class="tp-back" viewBox="0 0 500 40" preserveAspectRatio="none"><path d="M470 4 C470 34, 30 34, 30 4" marker-end="url(#tpl)"/><defs><marker id="tpl" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10z"/></marker></defs></svg>
      <div class="tp-lt">Past 5, a swipe slides on to 1, and back</div>
      <div class="tp-dist"><span>One swipe</span><div class="tp-bar"><b style="width:30%"></b></div><span>300 px of finger travel</span></div>
    </div>
    <div class="card">
      ${orow("Loop around", "From the last workspace back to the first.", sw(true), { ic: "repeat", sec: "input" })}
      ${orow("Workspaces to swipe through", "1 to this many always stay open.", sl(38, "5", 120), { ic: "grid", sec: "input" })}
      ${orow("Swipe distance", "How far for one workspace.", sl(22, "300 px", 120), { ic: "swipe-lr", sec: "input" })}
      ${orow("Keep swiping past neighbours", "Several workspaces in one go.", sw(false), { ic: "next", sec: "input" })}
      ${orow("Make a workspace past the last", "Off while Loop around is on.", sw(false), { ic: "plus", sec: "input", cls: "off" })}
    </div>
    ${pvfoot("These apply to swipes that follow your fingers; Next workspace jumps one at a time.", "info")}`, { sec: "input", cls: "tp-b" });

  REG("trackpad", {
    name: "Trackpad",
    summary: "The longest Input page: Devices, Tapping, a Clicking fold, Scrolling with an explanation above it, then Gestures, where three and four fingers each get a grid of six dropdowns with Reverse switches, then folds for Swipe feel and a four-finger tap that isn't available. No picture shows which way a gesture goes or what it does.",
    problems: [
      "<b>Gestures are a grid of dropdowns:</b> Swipe left, right, up, down, Pinch in and out, each “Switch workspace (follows fingers)”, twice over for three and four fingers.",
      "<b>No picture of a gesture:</b> nothing shows the fingers, the direction, or what happens on screen.",
      "<b>Long dropdown labels get cut:</b> “2 fingers: right-click · 3 fingers: middle…”.",
      "<b>Explanations above groups</b> (“Two-finger movement is scrolling. Swiping two fingers sideways…”) push the controls down, and Swipe feel's descriptions run to three lines.",
      "<b>A row for something you can't do:</b> Four-finger tap is a fold that only says it's not available.",
      "<b>Swipe feel is abstract:</b> Loop around, workspaces to swipe through and swipe distance are switches and sliders with no picture of the workspaces.",
    ],
    today: [["trackpad-1280", "Today", ""], ["trackpad-800", "Today at 800 px", ""]],
    options: [
      { id: "a", name: "Gesture map", idea: "Tapping, clicking and scrolling are two short cards on the left, the rarer options behind More. The right is the trackpad with three fingers on it and an arrow for every swipe and pinch, each labelled with what it does; click a label to change it. A switch above flips to four fingers, the Reverse chips flip the arrows, and Swipe feel opens its own page.",
        shots: [["a-gestures", "Three-finger gestures", ""], ["a-gestures-800", "At 800 px", ""]] },
      { id: "b", name: "One gesture at a time", idea: "The left lists each gesture with what it does, like a menu. Picking one shows it moving on the trackpad, an arrow to what happens on screen, every action it could do as chips, and a warning if another file's gesture wins. Swipe feel gets a picture of the workspaces in a row, with the loop back from the last to the first and how far one swipe goes.",
        shots: [["b-one", "Swipe up with three fingers", "Another file has a gesture that wins"], ["b-feel", "Swipe feel", ""]] },
    ],
    icons: {
      "arrow-u": '<path d="M12 19V5M6 11l6-6 6 6"/>', "arrow-d": '<path d="M12 5v14M6 13l6 6 6-6"/>', "arrow-l": '<path d="M19 12H5M11 6l-6 6 6 6"/>', "arrow-r": '<path d="M5 12h14M13 6l6 6-6 6"/>',
      "pinch-in": '<path d="M4 4l6 6M10 5v5H5M20 20l-6-6M14 19v-5h5"/>', "pinch-out": '<path d="M10 10 4 4M4 9V4h5M14 14l6 6M20 15v5h-5"/>',
      touch: '<circle cx="12" cy="9" r="3"/><path d="M12 15v6M6.5 9a5.5 5.5 0 0 1 11 0"/>',
      drag: '<path d="M12 3v18M3 12h18M8 6l4-3 4 3M8 18l4 3 4-3M6 8l-3 4 3 4M18 8l3 4-3 4"/>',
      scroll: '<rect x="7" y="3" width="10" height="18" rx="5"/><path d="M12 7v4"/>',
      swap: '<path d="M7 4v16M3.5 16.5 7 20l3.5-3.5M17 20V4M13.5 7.5 17 4l3.5 3.5"/>',
      hand: '<path d="M8 13V5.5a1.5 1.5 0 0 1 3 0V12M11 11V4.5a1.5 1.5 0 0 1 3 0V12M14 11.5V6a1.5 1.5 0 0 1 3 0v8a7 7 0 0 1-7 7 6 6 0 0 1-5-3l-2-4a1.5 1.5 0 0 1 2.5-1.5L8 15"/>',
    },
    pages: {
      "a-gestures": () => swin({ ...P, body: gestures() }),
      "b-one": () => swin({ ...P, body: one() }),
      "b-feel": () => swin({ ...P, body: feel() }),
    },
  });
})();
