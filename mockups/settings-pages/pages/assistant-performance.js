// Assistant & AI › Performance: how fast the assistant answers and what it costs in memory and power.
(() => {
  const SEC = "assistant";
  const DESC = "How fast it answers and what it holds in memory.";
  const page = (body) => swin({ sec: SEC, page: "Performance", desc: DESC, body });

  /* ── Sample data ─────────────────────────────────────────────────── */
  // The stages of the last answer, from when you stopped speaking: [label, ends at ms, colour].
  const STAGES = [["Your words recognised", 180, "teal"], ["Decided what to do", 240, "blue"], ["First word of the answer", 610, "violet"], ["Voice started", 780, "pink"], ["You hear it", 840, "amber"]];
  const RECENT = [1.1, 0.9, 0.82, 1.4, 0.76, 0.88, 0.95, 0.7, 1.2, 0.84, 0.79, 0.92, 1.05, 0.81, 0.74, 0.86, 0.9, 0.78, 0.83, 0.84];
  // Graphics memory on Atlas's 8 GB card: [label, GB, colour].
  const VRAM = [["Language model", 4.6, "teal"], ["Seeing the screen", 0.9, "blue"], ["Speech", 0.4, "violet"], ["Voice", 0.3, "pink"], ["Other apps", 0.7, "graphite"]];
  const PRESETS = [
    ["Lite", "Gemma 4 E2B. Speech runs on the processor; models leave memory after 5 minutes.", "", false],
    ["Balanced", "Gemma 4 E4B, which can see the screen. Fits an 8 GB graphics card.", "Recommended", true],
    ["Advanced", "A larger model that remembers more of the conversation.", "", false],
  ];

  /* ── Small drawings ──────────────────────────────────────────────── */
  const pc = (c) => `var(--sw-${c})`;
  const sum = (a) => a.reduce((s, x) => s + x, 0);
  /** A line chart filling its box: series = [{ vals 0–1, c, fill, dash }], dots = indexes to mark on the first. */
  const chart = (series, { dots = [], cap = null } = {}) => {
    const W = 600, H = 100;
    const path = (vals) => vals.map((v, i) => `${i ? "L" : "M"}${((i * W) / (vals.length - 1)).toFixed(1)},${(H - v * (H - 6) - 3).toFixed(1)}`).join(" ");
    const grid = [0.25, 0.5, 0.75].map((g) => `<line x1="0" x2="${W}" y1="${H * g}" y2="${H * g}"/>`).join("");
    return `<div class="pf-chart"><svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">${grid}
      ${cap !== null ? `<line class="cap" x1="0" x2="${W}" y1="${H - cap * (H - 6) - 3}" y2="${H - cap * (H - 6) - 3}"/>` : ""}
      ${series.map((s) => `${s.fill ? `<path d="${path(s.vals)} L${W},${H} L0,${H}Z" fill="${s.c}" opacity="${s.fill}"/>` : ""}<path d="${path(s.vals)}" fill="none" stroke="${s.c}" stroke-width="2" ${s.dash ? 'stroke-dasharray="4 4"' : ""} vector-effect="non-scaling-stroke" stroke-linejoin="round"/>`).join("")}
    </svg>${dots.map((i) => { const v = series[0].vals[i]; return `<span class="dot" style="left:${(i / (series[0].vals.length - 1)) * 100}%;top:${((H - v * (H - 6) - 3) / H) * 100}%;--c:${series[0].c}"></span>`; }).join("")}</div>`;
  };
  /** The graphics card's memory as one stacked bar, with a legend. */
  const vramBar = (o = {}) => {
    const total = 8, used = sum(VRAM.map((v) => v[1]));
    return `<div class="pf-vram card">
      <div class="r1"><b>Graphics memory</b><span>${used.toFixed(1)} of ${total} GB · the assistant uses ${(used - 0.7).toFixed(1)} GB</span></div>
      <div class="stack">${VRAM.map(([n, g, c]) => `<b style="flex:${g};background:${pc(c)}" title="${n}"></b>`).join("")}<b class="free" style="flex:${total - used}"></b></div>
      ${o.legend === false ? "" : `<div class="lg">${VRAM.map(([n, g, c]) => `<span><i style="background:${pc(c)}"></i>${n}<small>${g} GB</small></span>`).join("")}<span><i class="free"></i>Free<small>${(total - used).toFixed(1)} GB</small></span></div>`}
    </div>`;
  };
  const presetRows = () => PRESETS.map(([n, d, tag, on]) => `<div class="opt ${on ? "picked" : ""}">${radio(on)}<div class="opt-text"><div>${n}${tag ? ` <span class="pill" style="--tc:var(--sec-assistant)">${tag}</span>` : ""}</div><div class="d">${n === "Advanced" ? `${d} <em>Needs 12 GB; Atlas has 8 GB.</em>` : d}</div></div></div>`);
  const loadedRows = (o = {}) => [
    orow("Language model", "Gemma 4 E4B · 16,000 tokens", `<span class="pill dot">In memory</span>`, { ic: "sparkle", sec: SEC }),
    orow("Seeing the screen", o.short ? "Loads when it's needed" : "Loads when you ask about the screen", `<span class="pill dot" style="--tc:var(--text-tertiary)">Waiting</span>`, { ic: "eye", sec: SEC }),
    orow("Speech recognition", "Listens as you talk · loaded in 0.4 s", `<span class="pill dot">Ready</span>`, { ic: "mic", sec: SEC }),
    orow("Voice", o.short ? "Kokoro · graphics card" : "Kokoro, on the graphics card", `<span class="pill dot">Ready</span>`, { ic: "volume", sec: SEC }),
  ];

  /* ═══ A: the last answer, step by step ══════════════════════════════ */
  const waterfall = () => {
    const end = 900;
    let from = 0;
    return `<div class="pf-wf card">
      <div class="wfh"><div><b>0.84 s</b><span>from when you stopped speaking until you heard the answer</span></div><span class="pill" style="--tc:var(--success)">${icon("check")}Faster than usual</span></div>
      <div class="wfax"><span></span><div>${[0, 200, 400, 600, 800].map((t) => `<small style="left:${(t / end) * 100}%">${t ? (t / 1000).toFixed(1) + " s" : "0"}</small>`).join("")}</div><span></span></div>
      ${STAGES.map(([l, ms, c], i) => { const a = from; from = ms; return `<div class="wfr ${i === STAGES.length - 1 ? "last" : ""}"><span class="l"><i style="background:${pc(c)}"></i>${l}</span><div class="tk"><b style="left:${(a / end) * 100}%;width:${((ms - a) / end) * 100}%;background:${pc(c)}"></b></div><span class="v">${ms} ms</span></div>`; }).join("")}
      <div class="wfn">${icon("info")}<span>One pause between phrases, 120 ms. The first word waits on the language model, so a smaller model answers sooner.</span></div>
    </div>`;
  };
  const recent = () => {
    const max = 1.5;
    return `<div class="pf-recent card"><div class="r1"><b>The last 20 answers</b><span>Usually 0.7–1.1 s</span></div>
      <div class="rb">${RECENT.map((v, i) => `<b class="${i === RECENT.length - 1 ? "on" : ""} ${v > 1.15 ? "slow" : ""}" style="height:${(v / max) * 100}%"></b>`).join("")}<span class="avg" style="bottom:${(0.89 / max) * 100}%"><small>Average 0.89 s</small></span></div></div>`;
  };

  const aCtl = (o = {}) => `
    ${ocard("Preset", presetRows(), { first: true, note: o.narrow ? "" : "", act: `<span class="note">Sets the model, where speech runs and when models unload.</span>` })}
    ${ocard("Loaded now", loadedRows(), { cls: "icons" })}
    ${ocard("", [nrow("Speed tests", "Measure loading, talking and seeing the screen", "", { ic: "pulse", sec: SEC }), nrow("Last problem", "Yesterday at 18:02, while recognising speech", "", { ic: "warn", sec: SEC })], { cls: "icons pf-more" })}`;
  const aPv = () => `${pvhead("Last answer", "Spoken, 2 minutes ago", seg(["Last", "Average"], "Last"))}
     ${waterfall()}
     ${NARROW ? "" : recent()}
     ${vramBar({ legend: !NARROW })}`;
  const perfA = () => page(split(aCtl(), aPv(), { sec: SEC, cls: "pf pf-a" }));

  /* ═══ B: live charts ════════════════════════════════════════════════ */
  const SPEED = [0.58, 0.64, 0.61, 0.7, 0.66, 0.52, 0.63, 0.72, 0.69, 0.6, 0.66, 0.68];
  const MEM_A = [0.6, 0.6, 0.72, 0.72, 0.72, 0.72, 0.72, 0.72, 0.72, 0.84, 0.84, 0.84, 0.84, 0.84, 0.84, 0.84, 0.84, 0.84, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.86, 0.86, 0.86, 0.86, 0.86];
  const MEM_O = MEM_A.map((v) => v - 0.6 + 0.09);
  const TEMP = [0.38, 0.38, 0.6, 0.66, 0.62, 0.5, 0.44, 0.42, 0.58, 0.64, 0.52, 0.46, 0.42, 0.4, 0.6, 0.68, 0.66, 0.54, 0.48, 0.62, 0.66, 0.55, 0.47, 0.43, 0.41, 0.63, 0.65, 0.54, 0.48, 0.44];
  const WATT = TEMP.map((v, i) => Math.max(0.1, v * 0.9 - 0.12 + (SPEED[i] ? 0.18 : 0)));
  const tile = (t, big, unit, sub, body) => `<div class="pf-tile card"><div class="th"><div><b>${t}</b><span>${sub}</span></div><span class="big">${big}<small>${unit}</small></span></div>${body}</div>`;
  const bPv = () => `${pvhead("Live", "Atlas, the last 10 minutes · 6 answers", seg(["10 min", "1 hour", "Today"], "10 min"))}
     ${tile("Answer speed", "34", "words/s", "Each dot is one answer", chart([{ vals: SPEED, c: "var(--sec-assistant)", fill: 0.16 }], { dots: SPEED.map((_, i) => i) }))}
     ${tile("Graphics memory", "6.9", "of 8 GB", `<span class="k"><i style="background:var(--sec-assistant)"></i>Assistant</span><span class="k"><i style="background:var(--sw-graphite)"></i>Other apps</span>`, chart([{ vals: MEM_A, c: "var(--sec-assistant)", fill: 0.22 }, { vals: MEM_O, c: "var(--sw-graphite)", fill: 0.3 }], { cap: 0.94 }))}
     ${NARROW ? "" : tile("Graphics card", "61", "°C · 38 W", `<span class="k"><i style="background:var(--sw-amber)"></i>Heat</span><span class="k"><i class="dash" style="border-color:var(--sw-coral)"></i>Power</span>`, chart([{ vals: TEMP, c: "var(--sw-amber)", fill: 0.12 }, { vals: WATT, c: "var(--sw-coral)", dash: true }]))}
     ${NARROW ? "" : pvfoot("Plugged in · processor 54 °C · the card sleeps while the assistant is idle.", "power")}`;
  const bCtl = () => `
    ${ocard("Preset", [`<div class="pf-pseg">${[["Lite", "Quickest"], ["Balanced", "Recommended"], ["Advanced", "Needs 12 GB"]].map(([n, d]) => `<div class="${n === "Balanced" ? "on" : ""} ${n === "Advanced" ? "no" : ""}"><b>${n}</b><span>${d}</span></div>`).join("")}</div>`], { first: true })}
    ${ocard("What Balanced sets", [
      orow("Language model", "", dd("Gemma 4 E4B")),
      orow("Conversation it remembers", "Longer uses more memory.", dd("16,000 tokens")),
      orow("Speech recognition runs on", "", dd("Graphics card")),
      orow("Unload when unused for", "", dd("15 minutes")),
    ], { note: "Change one and the preset becomes Custom." })}
    ${ocard("Speed tests", [
      orow("Loading", "Last run: 3.2 s to get ready", btn("Run", "sm"), { ic: "download", sec: SEC }),
      orow("Talking", "Last run: first word after 0.6 s", btn("Run", "sm"), { ic: "mic", sec: SEC }),
      orow("Seeing the screen", "Last run: 1.9 s per look", btn("Run", "sm"), { ic: "eye", sec: SEC }),
    ], { cls: "icons", act: btn("Run all", "sm ghost") })}`;
  const perfB = () => page(split(bCtl(), bPv(), { sec: SEC, cls: "pf pf-b" }));

  /* ═══ C: pick a preset by what it costs ═════════════════════════════ */
  // [name, model, first word s, words/s, GB, watts, sees the screen, remembers, state]
  const CMP = [
    ["Lite", "Gemma 4 E2B", 0.42, 52, 3.1, 22, false, "8,000 tokens", "", ["Processor", "5 minutes"]],
    ["Balanced", "Gemma 4 E4B", 0.61, 34, 6.2, 38, true, "16,000 tokens", "on", ["Graphics card", "15 minutes"]],
    ["Advanced", "Qwen 3.5 14B", 1.1, 18, 11.8, 55, true, "32,000 tokens", "big", ["Graphics card", "1 hour"]],
  ];
  const meterRow = (label, val, pct, cls = "") => `<div class="mr ${cls}"><div class="ml"><span>${label}</span><b>${val}</b></div><span class="mb"><b style="width:${Math.min(100, pct)}%"></b></span></div>`;
  const cmpCol = ([n, m, fw, wps, gb, w, see, mem, st, [stt, unl]]) => `<div class="pf-col card ${st}">
      <div class="ch"><div><b>${n}</b><span class="cm">${m}</span></div>${st === "on" ? `<span class="pill" style="--tc:var(--sec-assistant)">${icon("check")}In use</span>` : ""}</div>
      ${meterRow("First word", `${fw} s`, (fw / 1.2) * 100)}
      ${meterRow("Speed", `${wps} words/s`, (wps / 55) * 100)}
      ${meterRow("Graphics memory", `${gb} GB`, (gb / 8) * 100, gb > 8 ? "over" : "")}
      ${meterRow("Power while answering", `${w} W`, (w / 60) * 100)}
      <div class="fx"><span>${see ? `${icon("check", "y")}Sees the screen` : `${icon("x", "n")}Can't see the screen`}</span><span>${icon("history", "y")}Remembers ${mem}</span><span>${icon("mic", "y")}Speech on the ${stt.toLowerCase()}</span><span>${icon("clock", "y")}Unloads after ${unl}</span></div>
      <div class="cf">${st === "on" ? `<span class="dim">Recommended for Atlas</span>` : st === "big" ? `<span class="warnx">${icon("warn")}Needs a 12 GB card</span>` : btn("Use Lite", "sm")}</div>
    </div>`;
  const cPv = () => `${pvhead("Presets on Atlas", "Measured by the speed tests 3 days ago", btn("Measure again", "sm", "refresh"))}
     <div class="pf-cols">${CMP.map(cmpCol).join("")}</div>
     <div class="pf-custom card">${icon("sliders")}<div><b>Custom</b><span>Choose the model, how much it remembers and where speech runs yourself.</span></div>${btn("Set up", "sm")}</div>
     ${pvfoot("The assistant restarts with the new preset if it has to.", "info")}`;
  const lastBar = () => { let from = 0; return `<div class="pf-lbar">${STAGES.map(([, ms, c]) => { const w = ms - from; from = ms; return `<b style="flex:${w};background:${pc(c)}"></b>`; }).join("")}</div>`; };
  const cCtl = () => `
    <div class="gtitle first gflex">Last answer<span class="sp"></span><span class="note">2 minutes ago</span></div>
    <div class="card pf-last"><div class="lh"><b>0.84 s</b><span>until you heard it</span></div>${lastBar()}
      ${STAGES.map(([l, ms, c]) => `<div class="ls"><i style="background:${pc(c)}"></i><span>${l}</span><b>${ms} ms</b></div>`).join("")}</div>
    ${ocard("Loaded now", loadedRows({ short: true }).slice(0, 3).concat([orow("Graphics card", "61 °C · 38 W · 24% busy", `<span class="rv">6.9 of 8 GB</span>`, { ic: "chip", sec: SEC })]), { cls: "icons" })}
    ${ocard("", [nrow("Speed tests", "Also seeing the screen and using the computer", "", { ic: "pulse", sec: SEC }), nrow("Last problem", "Yesterday at 18:02, while recognising speech", "", { ic: "warn", sec: SEC })], { cls: "icons pf-more" })}`;
  const perfC = () => page(split(cCtl(), cPv(), { sec: SEC, cls: "pf pf-c", ctlw: 400 }));

  REG("assistant-performance", {
    name: "Performance",
    summary: "Today the page is a list of read-outs: the last answer's timings as rows of milliseconds, what's loaded, temperatures, and a line telling you to run benchmarks in a terminal. When the assistant isn't running, only a stray “Last failure” record and a banner show. The one setting, the hardware preset, is a dropdown that only appears when the assistant answers.",
    problems: [
      "<b>Nearly empty when the assistant is off:</b> a “Last failure” heading with a turn number, a stage name in quotes and “268 registered tools”, then a banner; the rest of the page is blank.",
      "<b>Numbers without a picture:</b> five stage rows of milliseconds under a thin bar with no labels; nothing says whether 840 ms is quick or slow for this computer.",
      "<b>Memory as a sentence:</b> “6.9 GB of 8 GB used, the assistant 6.1 GB”; you can't see what fills the graphics card or how close it is to full.",
      "<b>The preset hides what it does:</b> Lite, Balanced and Advanced are names in a dropdown; what each changes, and what it costs in speed and memory, isn't shown.",
      "<b>Jargon:</b> “stage transcribing”, “registered tools”, file names of models and projectors, “Kokoro on cuda”.",
      "<b>Benchmarks only in a terminal:</b> the page ends by naming four <tt>nyx-assistant bench</tt> commands to type.",
    ],
    today: [["assistant-performance-1280", "Today", "The assistant wasn't running: only the last failure and a banner"], ["assistant-performance-800", "Today at 800 px", ""]],
    options: [
      { id: "a", name: "The last answer, step by step", idea: "The preview takes apart the last answer: one bar per step from when you stopped speaking to when you heard it, on a shared time scale, so the slow step stands out. Under it, the last 20 answers as bars against their average, and the graphics card's memory as one stacked bar. The controls are the preset as three plain choices with what each does, what's loaded now with a state on each, and speed tests and the last problem one level down.",
        shots: [["a", "Performance", "The steps of the last answer, recent answers, and what fills the graphics card"], ["a-800", "At 800 px", "The steps and memory above the preset"]] },
      { id: "b", name: "Live charts", idea: "The preview is three live charts over the last 10 minutes, an hour or today: how fast the assistant answers (a dot per answer), the graphics memory it and other apps hold against the card's size, and the card's heat and power. The preset sits at the top as three buttons; under it, what that preset sets, each one a dropdown you can change. Speed tests run from the page instead of a terminal, with the last result on each.",
        shots: [["b", "Performance", "Speed, memory and heat over the last 10 minutes"], ["b-800", "At 800 px", "Two charts above the preset"]] },
      { id: "c", name: "Pick a preset by what it costs", idea: "The preview compares the three presets side by side as measured on this computer: how soon the first word comes, how fast it talks, how much graphics memory it needs against the card's size, the power it draws, and whether it can see the screen. You pick one there; one that doesn't fit says so. The controls column is the plain state: the last answer's steps as a coloured bar and list, and what's loaded now.",
        shots: [["c", "Performance", "Lite, Balanced and Advanced compared on Atlas"]] },
    ],
    pages: { a: perfA, b: perfB, c: perfC },
  });
})();
