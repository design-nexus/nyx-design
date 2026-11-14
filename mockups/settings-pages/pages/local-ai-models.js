// Assistant & AI › Models: the models Nyx apps run on this computer; downloading, updating and removing them.
(() => {
  const SEC = "assistant";
  const DESC = "Download, update and remove the models Nyx apps run on this computer.";
  const page = (body) => swin({ sec: SEC, page: "Models", desc: DESC, body });

  /* ── Sample data ─────────────────────────────────────────────────── */
  // key: [name, GB, parameters, capabilities, used by, state, colours, last used]
  // state: loaded | ok | update | folder | down (downloading)
  const M = {
    e4b: ["Gemma 4 E4B", 5.3, "8 billion", ["Chat", "Tools", "Thinking", "Vision", "Audio"], ["Assistant", "Chat"], "loaded", ["teal", "blue"], "Now"],
    coder: ["Qwen 3.5 Coder 7B", 4.7, "7 billion", ["Chat", "Tools"], ["Coding tools"], "update", ["violet", "pink"], "2 hours ago"],
    nomic: ["Nomic Embed 2", 0.6, "300 million", ["Embedding"], ["Search"], "loaded", ["amber", "coral"], "Now"],
    q9: ["Qwen 3.5 9B", 5.8, "9 billion", ["Chat", "Tools", "Thinking"], [], "down", ["blue", "violet"], ""],
    e2b: ["Gemma 4 E2B", 3.2, "5 billion", ["Chat", "Tools", "Vision", "Audio"], [], "folder", ["teal", "green"], "3 weeks ago"],
    ll: ["Llama 3.3 8B", 4.9, "8 billion", ["Chat"], [], "ok", ["coral", "red"], "2 months ago"],
    ms: ["Mistral Small 4 24B", 13.9, "24 billion", ["Chat", "Tools", "Vision"], [], "ok", ["graphite", "blue"], "5 weeks ago"],
  };
  const ORDER = ["e4b", "coder", "nomic", "q9", "ms", "e2b", "ll"];
  const mart = (k, size = 30) => { const [a, b] = M[k][6]; return `<span class="lx-art" style="width:${size}px;height:${size}px;background:linear-gradient(140deg, color-mix(in srgb, var(--sw-${a}) 80%, #000), color-mix(in srgb, var(--sw-${b}) 60%, #111))">${icon("cube")}</span>`; };
  const tag = (k) => {
    const m = M[k];
    if (m[5] === "down") return `<span class="lx-dl"><span class="prog"><b style="width:62%"></b></span><small>3.6 of 5.8 GB</small></span>`;
    if (m[5] === "update") return `<span class="pill" style="--tc:var(--sw-blue)">${icon("download")}Update</span>`;
    if (m[4].length) return `<span class="rv">${m[4].join(", ")}</span>`;
    if (m[5] === "folder") return `<span class="rv">${icon("folder", "fi")}</span>`;
    return "";
  };
  const lrowx = (k, o = {}) => {
    const m = M[k];
    return `<div class="opt lx-row ${o.on ? "picked" : ""}">${o.chk !== undefined ? chk(o.chk) : ""}${mart(k)}<div class="opt-text"><div>${m[0]}${m[5] === "loaded" ? '<i class="ld" title="Loaded"></i>' : ""}</div><div class="d">${o.d || `${m[1]} GB · ${m[3].slice(0, 3).join(", ")}`}</div></div>${o.end !== undefined ? o.end : tag(k)}</div>`;
  };

  /* ═══ A: library and model card ═════════════════════════════════════ */
  const facts = (rows) => `<div class="lx-facts">${rows.map(([k, v]) => `<div><small>${k}</small><span>${v}</span></div>`).join("")}</div>`;
  const aCard = () => `<div class="card lx-card">
      <div class="mh">${mart("coder", NARROW ? 44 : 52)}<div class="tx"><b>Qwen 3.5 Coder 7B</b><span>From Hugging Face · Qwen/Qwen3.5-Coder-7B-GGUF</span></div>${NARROW ? btn("Update · 1.1 GB", "primary", "download") : ""}</div>
      ${facts([["On disk", "4.7 GB"], ["Size", "7 billion parameters"], ["Quality", "Medium (Q4_K_M)"], ["Speed on Atlas", "41 words/s"]])}
      ${NARROW ? "" : `<div class="good"><span class="gl">Good at</span>${chip("Writing code", "", "code")}${chip("Using tools", "", "wrench")}${chip("Chat", "", "chat")}</div>
      <div class="used"><span class="gl">Used by</span><span class="ub">${icon("code")}Coding tools<small>when a tool names no model</small></span></div>`}
    </div>`;
  const aUpd = () => `<div class="card lx-upd">${icon("download")}<div><b>A newer version is out</b><span>Released 3 days ago · 1.1 GB · replaces this one when done</span></div>${btn("Update", "primary")}</div>`;
  const aCtl = () => `
    <div class="lx-top"><div class="field">${icon("search")}<span class="ph">${NARROW ? "Search, or paste a Hugging Face name" : "Search or paste a name"}</span></div>${btn("Check for updates", "", "refresh")}</div>
    <div class="lx-chips">${[["All", 7], ["Chat", 6], ["Seeing", 4], ["Search", 1], ["In use", 3]].map(([n, c], i) => `<span class="chip2 ${i === 0 ? "on" : ""}">${n}<small>${c}</small></span>`).join("")}</div>
    ${ocard("", ORDER.map((k) => lrowx(k, { on: k === "coder", d: k === "q9" ? "5.8 GB · downloading" : "" })), { cls: "lx-list" })}
    <div class="lx-sum">${icon("drive")}<span>7 models · 38.4 GB · 212 GB free on the disk</span></div>`;
  const aPv = () => `${NARROW ? "" : pvhead("Qwen 3.5 Coder 7B", "Downloaded 2 months ago · last used 2 hours ago", `${btn("Remove", "dtext sm", "trash")}`)}
     ${aCard()}
     ${NARROW ? "" : aUpd()}
     ${NARROW ? "" : ocard("Other versions of this model", [
       orow("Smaller and quicker", "3.6 GB · a little less careful", btn("Download", "sm")),
       orow("Better quality", "5.4 GB · about 15% slower on Atlas", btn("Download", "sm")),
     ], { cls: "lx-vers" })}
`;
  const libA = () => page(split(aCtl(), aPv(), { sec: SEC, cls: "lx lx-a" }));

  /* ═══ B: what takes up the space ════════════════════════════════════ */
  const TREE = [[["ms", 100]], [["q9", 52], ["e4b", 48]], [["ll", 37], ["coder", 35], ["e2b", 23], ["nomic", 5]]];
  const COLW = [36, 29, 35];
  const SEL = ["ms", "ll"];
  const treemap = () => `<div class="lx-tree">${TREE.map((col, ci) => `<div class="col" style="flex:${COLW[ci]}">${col.map(([k, h]) => {
    const m = M[k], cls = m[4].length ? "used" : m[5] === "down" ? "down" : m[5] === "folder" ? "folder" : "unused";
    return `<div class="tl ${cls} ${SEL.includes(k) ? "sel" : ""} ${h < 10 ? "tiny" : ""}" style="flex:${h}">${SEL.includes(k) ? `<span class="ck">${icon("check")}</span>` : ""}<b>${m[0]}</b><span>${m[1]} GB${m[4].length ? ` · ${m[4].join(", ")}` : m[5] === "down" ? " · 62% downloaded" : ` · last used ${m[7]}`}</span></div>`;
  }).join("")}</div>`).join("")}</div>`;
  const bPv = () => `${pvhead("Space on the disk", "38.4 GB of models; 212 GB still free", seg(["By size", "By last use"], "By size"))}
     ${treemap()}
     <div class="lx-key">${[["used", "Used by an app"], ["unused", "Not used by any app"], ["folder", "In another app's folder"], ["down", "Downloading"]].map(([c, t]) => `<span class="${c}"><i></i>${t}</span>`).join("")}</div>`;
  const bCtl = () => `
    <div class="lx-top"><div class="field">${icon("download")}<span class="ph">org/model-GGUF:Q4_K_M</span></div>${btn("Download", "", "")}</div>
    <div class="gtitle gflex">On Atlas<span class="sp"></span>${btn("Check for updates", "ghost sm", "refresh")}</div>
    <div class="card lx-list">${["ms", "ll", "e2b", "coder", "e4b", "nomic"].map((k) => {
      const m = M[k], locked = m[5] === "folder", used = m[4].length;
      return lrowx(k, { chk: locked ? undefined : SEL.includes(k), d: used ? `${m[1]} GB · used by ${m[4].join(", ")}` : locked ? `${m[1]} GB · in the assistant's folder` : `${m[1]} GB · last used ${m[7]}`, end: locked ? `<span class="rv lk" title="Settings doesn't delete it">${icon("lock")}</span>` : `<span class="rv">${m[1]} GB</span>` });
    }).join("")}</div>
    <div class="lx-bar card"><div><b>2 selected</b><span>18.8 GB comes back</span></div>${btn("Remove", "danger", "trash")}</div>
    <div class="lx-note">${icon("info")}<span>Models in another app's folder are listed, but Settings never deletes them.</span></div>`;
  const libB = () => page(split(bCtl(), bPv(), { sec: SEC, cls: "lx lx-b" }));

  /* ═══ C: one Models page, with a shelf of more to get ═══════════════ */
  const JOBS = [["sparkle", "Assistant", "Gemma 4 E4B"], ["chat", "Chat", "Gemma 4 E4B"], ["search", "Search", "Nomic Embed 2"], ["code", "Coding tools", "Qwen 3.5 Coder 7B"]];
  // [name, maker, what it's for, download GB, fits, colours]
  const SHELF = [
    ["Qwen 3.5 9B", "Qwen", "Long plans and tools", 5.8, "down", ["blue", "violet"]],
    ["Ministral 3 3B", "Mistral AI", "Quick answers, sees the screen", 2.1, "fits", ["coral", "amber"]],
    ["Granite 4 Tiny", "IBM", "Summaries and documents", 4.1, "fits", ["blue", "teal"]],
    ["Whisper Turbo", "OpenAI", "Turns speech into text", 1.6, "fits", ["teal", "green"]],
    ["Devstral Small", "Mistral AI", "Better code, but slower", 9.1, "tight", ["violet", "pink"]],
    ["Phi-5 Mini", "Microsoft", "Short answers, light on memory", 2.4, "fits", ["blue", "green"]],
    ["Nomic Code", "Nomic", "Finds code by what it does", 0.5, "fits", ["amber", "red"]],
    ["Llama 4 Scout", "Meta", "Big and capable", 62, "no", ["graphite", "red"]],
  ];
  const sart = ([, , , , , [a, b]], size = 36) => `<span class="lx-art" style="width:${size}px;height:${size}px;background:linear-gradient(140deg, color-mix(in srgb, var(--sw-${a}) 80%, #000), color-mix(in srgb, var(--sw-${b}) 60%, #111))">${icon("cube")}</span>`;
  const shelfCard = (s) => {
    const [n, mk, d, gb, fit] = s;
    const badge = { fits: `<span class="fit ok">${icon("check")}Fits Atlas</span>`, tight: `<span class="fit tight">${icon("warn")}Slow on Atlas</span>`, no: `<span class="fit no">${icon("x")}Too big</span>`, down: `<span class="fit ok">${icon("download")}Downloading</span>` }[fit];
    return `<div class="card lx-sh ${fit}">
      <div class="sh1">${sart(s)}<div class="tx"><b>${n}</b><span>${mk}</span></div></div>
      <span class="sd">${d}</span>
      <div class="sf">${badge}${fit === "down" ? `<span class="lx-dl"><span class="prog"><b style="width:62%"></b></span></span>` : fit === "no" ? `<span class="rv">${gb} GB</span>` : btn(`${gb} GB`, "sm", "download")}</div>
    </div>`;
  };
  const cCtl = () => `
    ${ocard("What each job uses", JOBS.map(([ic, n, m]) => orow(n, "", dd(m), { ic, sec: SEC })), { first: true, cls: "icons" })}
    <div class="gtitle gflex">On Atlas<span class="sp"></span><span class="note">7 · 38.4 GB</span></div>
    <div class="card">${["e4b", "coder", "nomic"].map((k) => lrowx(k)).join("")}${nrow("4 more", "Mistral Small 4 24B, Gemma 4 E2B and others", "")}</div>
    ${ocard("", [orow("Model updates", "1 waiting · checked today", dd("Automatic"), { ic: "refresh", sec: SEC })], { cls: "icons lx-more" })}`;
  const cPv = () => `${pvhead("Get more", "Picked for what Atlas can run, from Hugging Face", seg(["For Atlas", "Coding", "Seeing", "Speech"], "For Atlas"))}
     <div class="lx-hf card">${icon("search")}<span class="ph">Search Hugging Face, or paste org/model-GGUF:Q4_K_M</span>${btn("Download", "sm")}</div>
     <div class="lx-shelf">${SHELF.map(shelfCard).join("")}</div>
     <div class="card lx-going">${sart(SHELF[0], 32)}<div class="tx"><b>Downloading Qwen 3.5 9B</b><span>3.6 of 5.8 GB · 24 MB/s · about 2 minutes left</span><span class="prog"><b style="width:62%"></b></span></div>${ib("pause", "Pause")}${ib("x", "Cancel")}</div>
     ${pvfoot("A model's vision and speed-up parts download with it when it has them.", "info")}`;
  const libC = () => page(split(cCtl(), cPv(), { sec: SEC, cls: "lx lx-c", ctlw: 400 }));

  REG("local-ai-models", {
    name: "Models",
    summary: "Today Models is a box for typing a Hugging Face name, then one long card of every model file: its id, then size, parameters, quantization, architecture and capabilities in one grey line, with Remove or Update on some. Nothing says which app uses which model, how much of the disk they take together, or which you could do without. The revamp puts Assistant and Local AI in one section, so this becomes the one Models page; option C draws it with the assistant's choice folded in (see Language Model's option B).",
    problems: [
      "<b>Repository ids as names:</b> rows are titled with whole Hugging Face paths and file names, some over 60 characters, that run into the Remove button.",
      "<b>One grey line of facts:</b> “7.2 GB · 27B · PQ2_0 · qwen35 · Chat, Tools, Thinking, Vision”; quantization and architecture codes mean nothing to most people.",
      "<b>Nothing says what a model is for:</b> which app uses it, whether it's loaded, or when it was last used, so you can't tell what's safe to remove.",
      "<b>Downloading needs the exact name:</b> “org/repo-GGUF:Q4_K_M” typed into a box, with no suggestions of models that would run well here.",
      "<b>Space as a total only:</b> “12 models · 61.1 GB”; the biggest models don't stand out, and removing several means two clicks on each.",
      "<b>A note about folders</b> (“Models in ~/.local/share/nyx-ai/models and Nyx Assistant's model folder are listed too…”) explains why some rows have no Remove button, in a path.",
    ],
    today: [["local-ai-models-1280", "Today", ""], ["local-ai-models-800", "Today at 800 px", ""]],
    options: [
      { id: "a", name: "Library and model card", idea: "The controls are the library: one search box that also takes a Hugging Face name to download, filters for what models do, and one row per model with plain facts, the apps using it, an Update tag or a download's progress. Picking one shows its card in the preview: where it came from, its size and quality in words, its speed on this computer, what it's good at and which apps use it, with an update offered under it and Remove at the top.",
        shots: [["a", "Models", "Qwen 3.5 Coder 7B picked, with an update waiting"], ["a-800", "At 800 px", "The model card above the library"]] },
      { id: "b", name: "What takes up the space", idea: "The preview is a map of the disk space models take, each block sized by its model and coloured by whether an app uses it, so a big unused one stands out. The controls list the models biggest first with a checkbox each and when it was last used; ticking a few shows how much space comes back, and one Remove clears them. Models in another app's folder show a lock instead. Downloading by name and checking for updates sit at the top.",
        shots: [["b", "Models", "Two unused models ticked: 18.8 GB comes back"]] },
      { id: "c", name: "One Models page, with more to get", idea: "The merged page for the whole section: the controls start with what each job uses (the assistant, chat, search, coding tools) and the models on the computer under it. The preview is a shelf of models worth getting, picked for what this computer can run and filtered by job, each with what it's for, whether it fits and a Download button; searching Hugging Face or pasting a name is above it. Language Model's option B is the same page with the assistant's job picked.",
        shots: [["c", "Models", "The jobs and the models on Atlas, with a shelf to get more"]] },
    ],
    pages: { a: libA, b: libB, c: libC },
  });
})();
