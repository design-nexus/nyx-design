// Assistant & AI › Language Model: which model the assistant talks and plans with.
(() => {
  const SEC = "assistant";
  const DESC = "Choose and download the language model.";
  const page = (body, o = {}) => swin({ sec: SEC, page: o.page || "Language Model", desc: o.desc || DESC, body });

  /* ── Sample data ─────────────────────────────────────────────────── */
  // [name, maker, size, download GB, graphics memory GB, words/s on Atlas, first word s, sees the screen, good at, state]
  const M = {
    e4b: ["Gemma 4 E4B", "Google", "8 billion", 5.3, 6.3, 34, 0.61, true, ["Quick spoken answers", "Using tools", "Sees the screen"], "use"],
    e2b: ["Gemma 4 E2B", "Google", "5 billion", 3.2, 3.9, 52, 0.42, true, ["Quickest answers", "Light on memory"], "have"],
    q9: ["Qwen 3.5 9B", "Qwen", "9 billion", 5.8, 5.6, 24, 0.78, false, ["Plans with many steps", "Using tools", "Thinking it through"], "get"],
    mi: ["Ministral 3 3B", "Mistral AI", "3 billion", 2.1, 2.4, 64, 0.35, true, ["Writing", "Sees the screen"], "get"],
    q14: ["Qwen 3.5 14B", "Qwen", "14 billion", 9.0, 11.8, 18, 1.1, true, ["Plans with many steps", "Sees the screen"], "big"],
    ll: ["Llama 3.3 8B", "Meta", "8 billion", 4.9, 5.2, 40, 0.7, false, ["Chat"], "folder"],
  };
  const CARD_GB = 8, EXTRA_GB = 0.9; // speech, voice and the conversation also sit on the card

  /* ── Small drawings ──────────────────────────────────────────────── */
  const mart = (k, size = 30) => `<span class="lm-art" style="width:${size}px;height:${size}px;background:${wall("m" + k)}">${icon("cube")}</span>`;
  const state = (s, m) => ({
    use: `<span class="pill" style="--tc:var(--sec-assistant)">${icon("check")}In use</span>`,
    have: `<span class="rv">Downloaded</span>`,
    folder: `<span class="rv">Downloaded</span>`,
    get: `<span class="rv">${m ? m[3] : ""} GB</span>`,
    big: `<span class="rv warnt">Too big</span>`,
  })[s];
  const mrow = (k, o = {}) => {
    const m = M[k];
    return `<div class="opt lm-row ${o.on ? "picked" : ""}">${mart(k)}<div class="opt-text"><div>${m[0]}</div><div class="d">${o.d || m[8].slice(0, 2).join(" · ")}</div></div>${state(m[9], m)}</div>`;
  };
  /** How full the graphics card would be: the model, what the assistant keeps beside it, and the rest. */
  const fit = (k, o = {}) => {
    const m = M[k], used = m[4] + EXTRA_GB, spare = CARD_GB - used;
    return `<div class="lm-fit ${spare < 0 ? "over" : ""}">
      <div class="fr"><b>${o.title || "On Atlas's graphics card"}</b><span>${spare >= 0 ? `Fits, with ${spare.toFixed(1)} GB to spare` : `Needs ${(-spare).toFixed(1)} GB more than the card has`}</span></div>
      <div class="fb"><b class="m" style="width:${Math.min(100, (m[4] / CARD_GB) * 100)}%"></b><b class="x" style="width:${Math.max(0, Math.min(100 - (m[4] / CARD_GB) * 100, (EXTRA_GB / CARD_GB) * 100))}%"></b></div>
      ${o.legend === false ? "" : `<div class="fl"><span><i class="m"></i>${m[0]} · ${m[4]} GB</span><span><i class="x"></i>Speech, voice and the conversation · ${EXTRA_GB} GB</span></div>`}
    </div>`;
  };
  const stat = (big, unit, label) => `<div class="lm-stat"><b>${big}<small>${unit}</small></b><span>${label}</span></div>`;

  /* ═══ A: a list and a model card ════════════════════════════════════ */
  const modelCard = (k) => {
    const m = M[k], cur = M.e4b;
    return `<div class="lm-card card">
      <div class="mh">${mart(k, NARROW ? 44 : 56)}<div class="tx"><b>${m[0]}</b><span>${m[1]} · ${m[2]} parameters · ${m[3]} GB download</span></div>
        <div class="bts">${m[9] === "get" ? btn("Download and use", "primary", "download") : m[9] === "use" ? state("use") : btn("Use", "primary")}</div></div>
      ${NARROW ? "" : `<div class="good">${m[8].map((g) => chip(g, "", "check")).join("")}${m[7] ? "" : chip("Can't see the screen", "", "x")}</div>`}
      <div class="stats">${stat(m[5], "words/s", "How fast it talks")}${stat(m[6], "s", "Until the first word")}${stat(m[4], "GB", "Graphics memory")}</div>
      ${fit(k, { legend: !NARROW })}
    </div>`;
  };
  const race = (k) => { const m = M[k]; return `<div class="rc ${m[9]}"><span>${m[0]}</span><span class="mb"><b style="width:${(m[5] / 55) * 100}%"></b></span><small>${m[5]} words/s</small></div>`; };
  const versus = () => `<div class="lm-vs card"><div class="vh">Compared with Gemma 4 E4B, the one in use</div>
      <div class="race">${race("q9")}${race("e4b")}</div>
      ${[["arrow-up", "Better at plans with many steps, like tidying a folder of files", "up"], ["arrow-dn", "About a third slower to answer", "dn"], ["arrow-dn", "Can't look at the screen, so “what's this?” won't work", "dn"]].map(([, t, c]) => `<div class="vr ${c}">${icon(c === "up" ? "chev-u" : "chev-d")}<span>${t}</span></div>`).join("")}</div>`;
  const aCtl = () => `
    ${ocard("Recommended for Atlas", [mrow("e4b"), mrow("e2b"), mrow("q9", { on: true }), mrow("mi")], { first: true, act: `<span class="note">These fit its 8 GB card</span>` })}
    ${ocard("Also on this computer", [mrow("ll", { d: "In a model folder · can't see the screen" })])}
    ${ocard("", [nrow("Every model", "Update or remove the models on Atlas", "7", { ic: "cube", sec: SEC }), nrow("Get one from Hugging Face", "By its name, like org/model-GGUF", "", { ic: "download", sec: SEC })], { cls: "icons lm-more" })}`;
  const aPv = () => `${modelCard("q9")}${NARROW ? "" : versus()}${NARROW ? "" : pvfoot("Switching restarts the assistant, which takes a few seconds.", "info")}`;
  const modelsA = () => page(split(aCtl(), aPv(), { sec: SEC, cls: "lm lm-a" }));

  /* ═══ B: one Models page; the assistant is one of its jobs ══════════ */
  const JOBS = [["sparkle", "Assistant", "Gemma 4 E4B", true], ["chat", "Chat", "Gemma 4 E4B"], ["search", "Search and knowledge", "Nomic Embed 2"], ["code", "Coding tools", "Qwen 3.5 Coder 7B"]];
  const cand = (k) => {
    const m = M[k], over = m[4] + EXTRA_GB > CARD_GB;
    return `<div class="lm-cand card ${m[9] === "use" ? "on" : ""} ${over ? "big" : ""}">
      <div class="ch">${mart(k, 34)}<div class="tx"><b>${m[0]}</b><span>${m[8].slice(0, 2).join(" · ")}</span></div></div>
      <div class="cm"><span>Speed</span><span class="mb"><b style="width:${(m[5] / 55) * 100}%"></b></span><small>${m[5]} words/s</small></div>
      <div class="cm ${over ? "over" : ""}"><span>Memory</span><span class="mb"><b style="width:${Math.min(100, ((m[4] + EXTRA_GB) / CARD_GB) * 100)}%"></b></span><small>${(m[4] + EXTRA_GB).toFixed(1)} of 8 GB</small></div>
      <div class="cf"><span class="fx">${m[7] ? `${icon("eye")}Sees the screen` : `${icon("x")}Can't see the screen`}</span>${m[9] === "use" ? state("use") : m[9] === "have" ? btn("Use", "sm") : over ? `<span class="warnt">Too big for Atlas</span>` : btn(`Download · ${m[3]} GB`, "sm", "download")}</div>
    </div>`;
  };
  const bCtl = () => `
    ${ocard("What each job uses", JOBS.map(([ic, n, m, on]) => `<div class="opt onav ${on ? "picked" : ""}"><span class="lic" style="--tc:var(--sec-assistant)">${icon(ic)}</span><div class="opt-text"><div>${n}</div><div class="d">${m}</div></div>${icon("chev-r", "cv")}</div>`), { first: true, cls: "icons", note: "" })}
    <div class="lm-hint">${icon("info")}<span>Apps that don't choose a model use these. Nyx Assistant uses the Assistant one.</span></div>
    ${ocard("On this computer", [nrow("All models", "7 models · 38.4 GB · 1 update", "", { ic: "cube", sec: SEC }), nrow("Get a model from Hugging Face", "By its name, like org/model-GGUF", "", { ic: "download", sec: SEC })], { cls: "icons" })}`;
  const bPv = () => `${pvhead("For the assistant", "Models that can use tools, measured on Atlas", seg(["Fits Atlas", "All"], "Fits Atlas"))}
     <div class="lm-cands">${["e4b", "e2b", "q9", "mi"].map(cand).join("")}</div>
     ${NARROW ? "" : `<div class="lm-cand card big wide">${mart("q14", 34)}<div class="tx"><b>Qwen 3.5 14B</b><span>Better plans, but needs 12.7 GB; Atlas has 8 GB</span></div><span class="warnt">Too big for Atlas</span></div>`}
     ${pvfoot("The assistant restarts with the new model; it takes a few seconds.", "info")}`;
  const modelsB = () => page(split(bCtl(), bPv(), { sec: SEC, cls: "lm lm-b", ctlw: 400 }), { page: "Models", desc: "The models Nyx apps run on this computer, and what each job uses." });

  /* ═══ C: speed against memory ═══════════════════════════════════════ */
  const XMAX = 14, YMAX = 70;
  const dotAt = (k, o = {}) => {
    const m = M[k], x = ((m[4] + EXTRA_GB) / XMAX) * 100, y = (m[5] / YMAX) * 100;
    return `<div class="lm-dot ${m[9]} ${o.sel ? "sel" : ""} ${o.left ? "left" : ""}" style="left:${x}%;bottom:${y}%"><i></i><span>${m[0]}</span></div>`;
  };
  const scatter = () => `<div class="lm-plot card">
      <div class="yl">Words per second</div>
      <div class="area">
        ${[0, 20, 40, 60].map((v) => `<span class="gy" style="bottom:${(v / YMAX) * 100}%"><small>${v}</small></span>`).join("")}
        ${[0, 4, 8, 12].map((v) => `<span class="gx" style="left:${(v / XMAX) * 100}%"><small>${v} GB</small></span>`).join("")}
        <div class="nofit" style="left:${(CARD_GB / XMAX) * 100}%"><span>Too big for Atlas</span></div>
        <div class="cap" style="left:${(CARD_GB / XMAX) * 100}%"><small>8 GB card</small></div>
        ${dotAt("e2b")}${dotAt("e4b")}${dotAt("mi")}${dotAt("q9", { sel: true })}${dotAt("ll")}${dotAt("q14", { left: true })}
      </div>
      <div class="xl">Graphics memory it needs, with speech and the conversation</div>
    </div>`;
  const cCtl = () => `
    ${ocard("In use", [`<div class="opt">${mart("e4b")}<div class="opt-text"><div>Gemma 4 E4B</div><div class="d">34 words/s · sees the screen</div></div>${state("use")}</div>`], { first: true })}
    <div class="gtitle">Picked on the chart</div>
    <div class="card lm-pick">
      <div class="ph">${mart("q9", 40)}<div class="tx"><b>Qwen 3.5 9B</b><span>Qwen · 5.8 GB download</span></div></div>
      <div class="good">${M.q9[8].map((g) => chip(g, "", "check")).join("")}${chip("Can't see the screen", "", "x")}</div>
      ${fit("q9", { legend: false, title: "Graphics card" })}
      <div class="pb">${btn("Download and use", "primary", "download")}${btn("Download only")}</div>
    </div>
    ${ocard("Show", [orow("Only models that see the screen", "", chk(false)), orow("Models that don't fit", "Dimmed, past the 8 GB line", chk(true))])}`;
  const cPv = () => `${pvhead("Speed and size", "Each dot is a model, measured on Atlas. Up is faster; right needs more memory.", "")}
     ${scatter()}
     <div class="lm-key">${[["use", "In use"], ["have", "Downloaded"], ["get", "Not downloaded"], ["big", "Doesn't fit"]].map(([c, t]) => `<span class="${c}"><i></i>${t}</span>`).join("")}</div>`;
  const modelsC = () => page(split(cCtl(), cPv(), { sec: SEC, cls: "lm lm-c", ctlw: 400 }));

  REG("assistant-models", {
    name: "Language Model",
    summary: "Today the assistant's model is picked from two dropdowns: one of every model file on the computer, one of the recommended models, with one line about the picked one under it. Nothing compares the models or shows whether one fits the graphics card beside the speech and voice models. Local AI has its own Models page and a “Default models” list with an Assistant row, so the same choice lives in two places. Options A and C keep a Language Model page under Assistant (no tab is underlined, as the new tab row only has Models); option B merges it into the one Models page, where the assistant is one of the jobs a model does.",
    problems: [
      "<b>Two dropdowns for one choice:</b> “Installed models” and “Recommended models” each have a Model dropdown; picking one in the first “does not change the default”, and the Use button sits alone in a strip under it.",
      "<b>File names as names:</b> <tt>gemma-4-E4B-it-Q4_K_M (in use)</tt> beside “Gemma 4 E4B (Q4_K_M) (in use)”; quantization codes mean nothing to most people.",
      "<b>No comparison:</b> you see one model's line at a time, so there's no way to tell which is faster, which can see the screen, or what you'd give up.",
      "<b>Memory as a sentence:</b> “about 6.3 GB of graphics memory”, with no picture of how full the card would be next to speech, the voice and the conversation.",
      "<b>The same choice in two places:</b> Local AI's “Default models” also has an Assistant row, and Local AI › Models lists the same files again with Remove buttons.",
      "<b>Notes that explain the controls:</b> each group starts with a sentence about what the dropdowns do; at 800 px they wrap to two lines.",
    ],
    today: [["assistant-models-1280", "Today", ""], ["assistant-models-800", "Today at 800 px", ""]],
    options: [
      { id: "a", name: "A list and a model card", idea: "The models that fit this computer are one list, each with what it's good at and whether it's in use, downloaded or how big the download is; models from elsewhere are listed under it. Picking one fills the preview with its card: what it's good at, how fast it talks on this computer, the memory it needs drawn on the graphics card next to speech and the voice, and how it differs from the one in use. Download and Use are on the card. Removing models and downloading by name stay on the Models page, one row away.",
        shots: [["a", "Language Model", "Qwen 3.5 9B picked: fits with room to spare, but can't see the screen"], ["a-800", "At 800 px", "The model card above the list"]] },
      { id: "b", name: "One Models page, with jobs", idea: "Language Model and Local AI's default models merge into the one Models page. Its first card is the jobs models do (the assistant, chat, search and knowledge, coding tools), each with its model; picking a job shows the models that can do it as cards in the preview, with their speed, how much of the graphics card they'd fill, and Use or Download. Every model on the computer, and downloading by name, are a row away. This tab goes; the Models tab is underlined.",
        shots: [["b", "Models › Assistant", "The assistant's job picked: four models that fit, one that doesn't"]] },
      { id: "c", name: "Speed against size", idea: "The preview is a chart: each model is a dot, higher for faster answers on this computer and further right for more graphics memory, with the card's 8 GB as a line and everything past it shaded. Clicking a dot shows that model in the controls with what it's good at, how full the card would be, and Download or Use. The one in use stays at the top; two checkboxes hide models that can't see the screen or don't fit.",
        shots: [["c", "Language Model", "Qwen 3.5 9B picked on the chart"]] },
    ],
    pages: { a: modelsA, b: modelsB, c: modelsC },
  });
})();
