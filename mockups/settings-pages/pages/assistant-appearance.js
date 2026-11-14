// Assistant & AI › Aura: the glow at the screen's edge while the assistant is busy.
(() => {
  const DESC = "The glow at the edge of the screen while Echo is busy.";
  const o = (ic) => ({ ic, sec: "assistant" });
  const page = (body) => () => swin({ sec: "assistant", page: "Aura", desc: DESC, body: body() });
  const STATES = [["listen", "Listening", "Your turn to talk"], ["think", "Thinking", "Working out an answer"], ["speak", "Speaking", "Pulses with its voice"], ["wait", "Waiting for you", "Needs a yes or no"]];

  /* ── Drawings ────────────────────────────────────────────────────── */
  const wp = (a, b, ang = 150) => `linear-gradient(${ang}deg, color-mix(in srgb, var(--sw-${a}) 55%, #10121a), color-mix(in srgb, var(--sw-${b}) 40%, #0b0c11))`;
  const WP = { "aura-desk": ["violet", "blue"], "lap-a": ["teal", "blue"], "studio-a": ["coral", "violet"], "grid-listen": ["blue", "violet"], "grid-think": ["teal", "blue"], "grid-speak": ["pink", "violet"], "grid-wait": ["violet", "blue"] };
  // Edge Flow: a lit stretch of the left side, bottom and right side.
  const flow = (len = 0.16, off = 0.17, w = 160, h = 100) => {
    const L = 2 * h + w, d = len * L, path = `M1.5,0 L1.5,${h - 1.5} L${w - 1.5},${h - 1.5} L${w - 1.5},0`;
    return `<svg class="aa-flow" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">${["glow", "core"].map((c) => `<path d="${path}" class="${c}" stroke-dasharray="${d} ${L}" stroke-dashoffset="${-off * L}"/>`).join("")}</svg>`;
  };
  const aura = (state, style = "full", mini = false) => style === "full" ? `<span class="aa-aura s-${state}"></span>` : `<span class="aa-ef s-${state}">${mini ? flow(0.3, 0.12, 150, 62) : flow()}</span>`;
  const desk = (state, style = "full", o2 = {}) => `<div class="aa-desk ${o2.cls || ""}" style="background:${wp(...(WP[o2.seed || "aura-desk"]))};${o2.style || ""}">
      <span class="dbar"><i></i><i class="on"></i><i></i></span><span class="dw a"></span><span class="dw b"></span>
      ${o2.pill === false ? "" : `<span class="aa-pill s-${state}"><i></i>${o2.pill || "Echo is answering…"}</span>`}
      ${o2.off ? "" : aura(state, style)}
    </div>`;
  const styleTiles = (on) => `<div class="aa-sty">${[["full", "Full Aura", "A soft glow all round"], ["edge", "Edge Flow", "A light that travels"]].map(([k, n, d]) => `<div class="sct ${on === k ? "on" : ""}"><div class="mini">${aura("speak", k, true)}</div><div class="tx">${radio(on === k)}<div><b>${n}</b><span>${d}</span></div></div></div>`).join("")}</div>`;
  const legend = (on) => `<div class="aa-leg">${STATES.map(([k, n, d]) => `<div class="lg ${k === on ? "on" : ""}"><span class="sw s-${k}"></span><div><b>${n}</b><span>${d}</span></div></div>`).join("")}</div>`;

  /* ── A: one live screen ──────────────────────────────────────────── */
  const aCtl = () => `
    ${ocard("", [orow("<b>Aura</b>", "Shows that Echo is listening, thinking or talking.", sw(true), o("aura"))], { cls: "icons" })}
    <div class="gtitle">Style</div>${styleTiles("full")}
    ${ocard("Look", [
      orow("Thickness", "", sl(22, "3 px", 140), o("layers")),
      orow("Glow", "", sl(40, "Soft", 140), o("sun")),
      orow("Breathing speed", "", sl(28, "Normal", 140), o("refresh")),
    ], { cls: "icons" })}
    ${ocard("When and where", [
      orow("Between replies", "", seg(["Stay faint", "Hide"], "Stay faint"), o("clock")),
      orow("Move with its voice", "", sw(true), o("volume")),
      nrow("Screens and motion", "", "The screen in use", o("monitor")),
    ], { cls: "icons" })}`;
  const aPv = () => `
    ${pvhead("On your screen", "Click a state to see how it looks.", seg(["Listening", "Thinking", "Speaking", "Waiting"], "Speaking"))}
    ${desk("speak", "full", { cls: "big" })}
    ${legend("speak")}
    ${pvfoot("Colours come from your theme, tinted with Echo's own.", "palette")}`;

  /* ── B: Edge Flow, and where and when it shows ───────────────────── */
  const bCtl = () => `
    ${ocard("", [orow("<b>Aura</b>", "", sw(true), o("aura")), orow("Style", "", seg(["Full Aura", "Edge Flow"], "Edge Flow"), o("spark"))], { cls: "icons" })}
    ${ocard("Edge Flow", [
      orow("Line width", "", sl(22, "3 px", 130), o("layers")),
      orow("Length", "How much is lit.", sl(28, "Short", 130), o("columns")),
      orow("Speed", "", sl(28, "Normal", 130), o("refresh")),
    ], { cls: "icons" })}
    ${ocard("Which screens", [
      `<div class="opt picked">${radio(true)}<div class="opt-text"><div>The one you're using</div></div></div>`,
      `<div class="opt">${radio(false)}<div class="opt-text"><div>The main screen</div><div class="d">Laptop screen</div></div>${dd("Change")}</div>`,
      `<div class="opt">${radio(false)}<div class="opt-text"><div>Every screen</div></div></div>`,
    ])}`;
  const vis = () => {
    const cols = [["listen", 70, "Listening"], ["think", 85, "Thinking"], ["speak", 100, "Answer"], ["rest", 22, "Quiet"], ["listen", 70, "Listening"], ["speak", 95, "Answer"], ["rest", 22, "Quiet"], ["off", 0, "Ended"]];
    return `<div class="card aa-vis"><div class="vh"><b>During a conversation</b><span>Between replies it stays faint, so you know Echo is still listening.</span></div>
      <div class="vbars">${cols.map(([k, h, l]) => `<div class="vc"><div class="vb"><b class="s-${k}" style="height:${h}%"></b></div><small>${l}</small></div>`).join("")}</div></div>`;
  };
  const bPv = () => `
    ${pvhead("Where it shows", "On the screen you're using; it moves with you.", chip("2 screens", "acc", "monitor"))}
    <div class="aa-two">
      <div class="scn" style="width:39%">${desk("speak", "edge", { seed: "lap-a", pill: false, off: true, cls: "dim" })}<span class="lb">Laptop screen</span></div>
      <div class="scn" style="width:59%">${desk("speak", "edge", { seed: "studio-a", pill: "Echo is answering…" })}<span class="lb on">${icon("check-c")}Studio 27 · you're using it</span></div>
    </div>
    ${vis()}`;

  /* ── C: every state at once ──────────────────────────────────────── */
  const cCtl = () => `
    ${ocard("", [orow("<b>Aura</b>", "", sw(true), o("aura")), orow("Style", "", seg(["Full Aura", "Edge Flow"], "Full Aura"), o("spark"))], { cls: "icons" })}
    ${ocard("Colour", [
      `<div class="opt picked">${radio(true)}<div class="opt-text"><div>Your theme with Echo's tint</div><div class="d">Each state keeps its colour; Echo's teal blends in.</div></div><span class="aa-sws">${STATES.map(([k]) => `<i class="s-${k}"></i>`).join("")}</span></div>`,
      `<div class="opt">${radio(false)}<div class="opt-text"><div>Your theme only</div><div class="d">Changes when you change themes.</div></div><span class="aa-sws plain">${STATES.map(([k]) => `<i class="s-${k}"></i>`).join("")}</span></div>`,
    ])}
    ${ocard("Motion", [
      orow("Glow", "", sl(40, "Soft", 130), o("sun")),
      orow("Breathing speed", "", sl(28, "Normal", 130), o("refresh")),
      orow("Move with its voice", "Speaking pulses as it talks.", sw(true), o("volume")),
      orow("Less motion", "Holds still instead of breathing.", dd("Like the system"), o("eye")),
    ], { cls: "icons" })}`;
  const cPv = () => `
    ${pvhead("Every state", "How the glow tells you what Echo is doing.", btn("Play through", "sm", "play"))}
    <div class="aa-grid">${STATES.map(([k, n, d]) => `<div class="cell">${desk(k, "full", { seed: "grid-" + k, pill: n + "…" })}<div class="cl"><span class="sw s-${k}"></span><b>${n}</b><span>${d}</span></div></div>`).join("")}</div>
    ${pvfoot("With less motion on, the glow fades in and out instead of breathing.", "eye")}`;

  REG("assistant-appearance", {
    name: "Aura",
    summary: "Twelve rows in one card with no picture of the glow they change. Style, thickness, glow, speed and flow length are words and decimals (0.40, 1.00×, 0.14), rows for one style show for the other, and the main screen is typed in by its connector name.",
    problems: [
      "<b>No picture of the glow:</b> a setting you only ever see on screen is described in words (“Controls Full Aura's glow reach and Edge Flow's line width”).",
      "<b>Bare numbers:</b> glow 0.40, speed 1.00× and flow length 0.14 in a monospace readout, with no sense of subtle or strong.",
      "<b>Rows for the other style:</b> Flow length only does something in Edge Flow, and thickness means two different things, but both always show.",
      "<b>Typing a connector name:</b> “Primary output” asks for something like eDP-2 instead of letting you pick a screen.",
      "<b>One long card:</b> switches, choices and sliders for look, timing, colour, motion and screens are all in one list of twelve rows.",
      "<b>The page never says what Aura is</b> beyond “Aura border, movement and displays.”",
    ],
    today: [["assistant-appearance-1280", "Today", ""], ["assistant-appearance-800", "Today at 800 px", ""]],
    options: [
      {
        id: "a", name: "One live screen",
        idea: "A large mini desktop glows exactly as the settings say; click a state (Listening, Thinking, Speaking, Waiting) to see its colour. The style is two picture tiles, Full Aura and Edge Flow, and the sliders read in words (Soft, Normal) as well as numbers. Screens, colours and motion are one row that opens its own page.",
        shots: [["a", "One live screen", ""], ["a-800", "At 800 px", "The screen above the controls"]],
      },
      {
        id: "b", name: "Where and when it shows",
        idea: "For people with more than one screen. The picture shows your screens side by side and which one glows (the one you're using, the main one, or all), and a bar chart shows how bright it is through a conversation: bright while it answers, faint between replies, gone when it ends. Only the chosen style's settings show, so Edge Flow gets its length slider and Full Aura doesn't.",
        shots: [["b", "Edge Flow on two screens", "The screen you're using glows; the chart shows when"]],
      },
      {
        id: "c", name: "Every state at once",
        idea: "Four small screens show all four states together, each in its colour, so you can judge the colours and how calm the motion is in one look. The controls are about colour and motion: theme colours with or without Echo's tint, glow, breathing speed, moving with its voice, and less motion.",
        shots: [["c", "Every state at once", "Colour and motion, side by side"]],
      },
    ],
    pages: { a: page(() => split(aCtl(), aPv(), { sec: "assistant", ctlw: 430 })), b: page(() => split(bCtl(), bPv(), { sec: "assistant", ctlw: 430 })), c: page(() => split(cCtl(), cPv(), { sec: "assistant", ctlw: 430 })) },
  });
})();
