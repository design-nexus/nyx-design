// Assistant & AI › Local AI: Nyx AI Core, the local model server every Nyx app and coding tool talks to.
(() => {
  const SEC = "assistant";
  const DESC = "Nyx AI Core: what it holds in memory, updates, default models and coding tools.";
  const page = (body) => swin({ sec: SEC, page: "Local AI", desc: DESC, body });

  /* ── Sample data ─────────────────────────────────────────────────── */
  const ADDR = "http://127.0.0.1:8090/v1";
  // Apps: [icon, name, what it does, model index, state: active | idle | key]
  const APPS = [["sparkle", "Assistant", "Answering now", 0, "active"], ["chat", "Chat", "Idle", 0, "idle"], ["search", "Glimpse", "Idle", 1, "idle"], ["code", "Coding tools", "2 tools", 2, "api"]];
  // Models: [name, GB, state line, state: busy | idle | off, kept by]
  const MODELS = [["Gemma 4 E4B", 6.2, "answering", "busy", "Nyx Assistant"], ["Nomic Embed 2", 0.6, "idle", "idle", ""], ["Qwen 3.5 Coder 7B", 4.9, "not loaded", "off", ""]];

  const ARTC = { "Gemma 4 E4B": ["teal", "blue"], "Nomic Embed 2": ["amber", "coral"], "Qwen 3.5 Coder 7B": ["violet", "pink"] };
  const mart = (name, size = 30) => { const [a, b] = ARTC[name] || ["graphite", "blue"]; return `<span class="la-art" style="width:${size}px;height:${size}px;background:linear-gradient(140deg, color-mix(in srgb, var(--sw-${a}) 80%, #000), color-mix(in srgb, var(--sw-${b}) 60%, #111))">${icon("cube")}</span>`; };
  const memBar = (title, used, total, parts, o = {}) => `<div class="la-mem">
      <div class="r1"><b>${title}</b><span>${used} of ${total} GB${o.free ? ` · ${o.free}` : ""}</span></div>
      <div class="bar">${parts.map(([n, g, c]) => `<b style="flex:${g};background:${c}" title="${n}"></b>`).join("")}<b class="free" style="flex:${total - used}"></b></div>
      ${o.legend ? `<div class="lg">${parts.map(([n, g, c]) => `<span><i style="background:${c}"></i>${n}<small>${g} GB</small></span>`).join("")}</div>` : ""}
    </div>`;
  const GPU = [["Gemma 4 E4B", 6.2, "var(--sec-assistant)"], ["Nomic Embed 2", 0.6, "var(--sw-blue)"]];
  const RAM = [["Nyx AI Core", 2.1, "var(--sec-assistant)"], ["Everything else", 9.3, "var(--sw-graphite)"]];

  /* ═══ A: who's talking to it ════════════════════════════════════════ */
  // The diagram, laid out in px for its box: tall (apps above, the core, models below) or wide (left to right).
  const diagram = () => {
    const wide = NARROW, W = wide ? 680 : 556, H = wide ? 236 : 372;
    const apps = APPS.map((a, i) => wide ? { x: 0, y: i * 62, w: 150, h: 48 } : { x: i * 142.67, y: 0, w: 128, h: 52 });
    const core = wide ? { x: 230, y: 50, w: 224, h: 136 } : { x: 143, y: 126, w: 270, h: 112 };
    const mods = MODELS.map((m, i) => wide ? { x: 510, y: i * 90, w: 170, h: 56 } : { x: i * 190, y: 310, w: 176, h: 62 });
    const curve = (x1, y1, x2, y2) => wide ? `M${x1},${y1} C${(x1 + x2) / 2},${y1} ${(x1 + x2) / 2},${y2} ${x2},${y2}` : `M${x1},${y1} C${x1},${(y1 + y2) / 2} ${x2},${(y1 + y2) / 2} ${x2},${y2}`;
    const inAt = (i, n) => wide ? [core.x, core.y + 22 + (i * (core.h - 44)) / (n - 1)] : [core.x + 30 + (i * (core.w - 60)) / (n - 1), core.y];
    const outAt = (i, n) => wide ? [core.x + core.w, core.y + 30 + (i * (core.h - 60)) / (n - 1)] : [core.x + 40 + (i * (core.w - 80)) / (n - 1), core.y + core.h];
    const appEdge = (a, i) => { const b = apps[i], [x2, y2] = inAt(i, APPS.length); return wide ? [b.x + b.w, b.y + b.h / 2, x2, y2] : [b.x + b.w / 2, b.y + b.h, x2, y2]; };
    const modEdge = (m, i) => { const b = mods[i], [x1, y1] = outAt(i, MODELS.length); return wide ? [x1, y1, b.x, b.y + b.h / 2] : [x1, y1, b.x + b.w / 2, b.y]; };
    const edges = APPS.map((a, i) => [appEdge(a, i), a[4]]).concat(MODELS.map((m, i) => [modEdge(m, i), m[3]]));
    const keyE = appEdge(APPS[3], 3), kx = (keyE[0] + keyE[2]) / 2, ky = (keyE[1] + keyE[3]) / 2;
    return `<div class="la-dia ${wide ? "wide" : "tall"}" style="width:${W}px;height:${H}px">
      <svg width="${W}" height="${H}">${edges.map(([[x1, y1, x2, y2], st]) => `<path class="e ${st}" d="${curve(x1, y1, x2, y2)}"/>`).join("")}
        ${edges.filter(([, st]) => st === "active" || st === "busy").map(([[x1, y1, x2, y2]]) => `<circle class="pulse" cx="${(x1 + x2) / 2}" cy="${(y1 + y2) / 2}" r="3.5"/>`).join("")}</svg>
      ${APPS.map(([ic, n, d, , st], i) => { const b = apps[i]; return `<div class="nd app ${st}" style="left:${b.x}px;top:${b.y}px;width:${b.w}px;height:${b.h}px"><span class="ni">${icon(ic)}</span><div><b>${n}</b><span>${d}</span></div></div>`; }).join("")}
      <div class="nd core" style="left:${core.x}px;top:${core.y}px;width:${core.w}px;height:${core.h}px">
        <div class="ch"><span class="ni big">${icon("cpu")}</span><div><b>Nyx AI Core</b><span><i class="live"></i>Running · 2 models loaded</span></div></div>
        <div class="cc">${chip("Graphics card", "on", "chip")}${chip("Processor", "", "cpu")}</div>
      </div>
      <span class="key" style="left:${kx}px;top:${ky}px">${icon("lock")}Key needed</span>
      ${MODELS.map(([n, g, d, st, kept], i) => { const b = mods[i]; return `<div class="nd mod ${st}" style="left:${b.x}px;top:${b.y}px;width:${b.w}px;height:${b.h}px">${mart(n, wide ? 28 : 30)}<div><b>${n}</b><span>${st === "off" ? `${g} GB · ${d}` : `${g} GB · ${d}`}</span></div>${kept ? `<span class="pin" title="Kept loaded by ${kept}">${icon("pin")}</span>` : ""}</div>`; }).join("")}
    </div>`;
  };
  const aPv = () => `${pvhead("Who's using it", "Apps on Atlas and the models they're talking to, live", NARROW ? "" : `<span class="pill dot">2 talking</span>`)}
     <div class="la-diacard card">${diagram()}</div>
     ${NARROW ? "" : `<div class="card la-mems">${memBar("Graphics memory", 6.8, 8, GPU)}${memBar("System memory", 11.4, 32, RAM, { free: "20.6 GB free" })}</div>`}
     ${NARROW ? "" : pvfoot("9 answers since it started · first word after 0.43 s on average · 88 words a second", "pulse")}`;
  const coreRow = () => orow("<b>Nyx AI Core</b>", "Running · llama.cpp b5120", btn("Restart", "sm"), { ic: "cpu", sec: SEC });
  const aCtl = () => `
    ${ocard("", [coreRow()], { cls: "icons", first: true })}
    ${ocard("Memory", [
      orow("Models kept loaded", "More switch faster, use more memory.", seg(["1", "2", "3", "4"], "2")),
      orow("Unload an unused model after", "", dd("15 minutes")),
      orow("Battery saver", "On battery, run on the processor: slower, but the battery lasts.", sw(false)),
    ])}
    ${ocard("Coding tools", [
      orow("Let coding tools use these models", "Tools that speak the OpenAI API", sw(true)),
      orow("Address", `<span class="mono">${ADDR}</span>`, ib("copy", "Copy")),
      orow("API key", "Only tools that have it can connect.", btn("Copy key", "sm", "copy")),
    ])}
    ${ocard("", [nrow("Which model each app uses", "", "4 set", { ic: "layers", sec: SEC }), nrow("Model updates", "", "Automatic", { ic: "refresh", sec: SEC })], { cls: "icons la-more" })}`;
  const localA = () => page(split(aCtl(), aPv(), { sec: SEC, cls: "la la-a", ctlw: 400 }));

  /* ═══ B: what it holds, and how fast ════════════════════════════════ */
  const ACT = [0.1, 0.2, 0.15, 0.6, 0.8, 0.7, 0.3, 0.2, 0.9, 0.85, 0.4, 0.2, 0.15, 0.5, 0.7, 0.65, 0.3];
  const loadedCard = ([n, g, d, st, kept], i) => `<div class="la-ld card ${st}">
      ${mart(n, 40)}<div class="tx"><b>${n}</b><span>${g} GB · ${i === 0 ? "1 of 2 answering" : "idle"}</span>${kept ? `<span class="kp">${icon("pin")}Kept loaded by ${kept}</span>` : `<span class="cd"><span class="prog"><b style="width:73%"></b></span>Unloads in 4 min</span>`}</div>
      <div class="sk">${spark(i === 0 ? ACT : ACT.map((v) => v * 0.25), { w: 120, h: 34, c: "var(--sec-assistant)" })}</div>
      ${btn("Unload", "sm")}
    </div>`;
  const statTile = (big, unit, label, vals) => `<div class="la-stat card"><span>${label}</span><b>${big}<small>${unit}</small></b>${spark(vals, { w: 160, h: 26, c: "var(--sec-assistant)" }).replace("<svg ", '<svg preserveAspectRatio="none" ')}</div>`;
  const bPv = () => `${pvhead("In memory now", "2 models loaded on the graphics card", btn("Unload all", "sm"))}
     <div class="card la-mems big">${memBar("Graphics memory", 6.8, 8, GPU, { legend: true })}${memBar("System memory", 11.4, 32, RAM, { free: "20.6 GB free", legend: true })}</div>
     ${MODELS.slice(0, 2).map(loadedCard).join("")}
     ${NARROW ? "" : `<div class="la-stats">${statTile("9", "", "Answers since it started", [0.1, 0.1, 0.3, 0.3, 0.4, 0.6, 0.6, 0.7, 1])}${statTile("0.43", "s", "Until the first word", [0.5, 0.6, 0.4, 0.45, 0.5, 0.42, 0.38, 0.44, 0.4])}${statTile("88", "words/s", "Answer speed", [0.6, 0.7, 0.65, 0.72, 0.7, 0.75, 0.68, 0.74, 0.72])}</div>`}
     ${NARROW ? "" : pvfoot("Running on the graphics card (CUDA), with the processor as a fallback.", "check-c")}`;
  const bCtl = () => `
    ${ocard("", [coreRow()], { cls: "icons", first: true })}
    ${ocard("Memory and updates", [
      orow("Models kept loaded", "Every Nyx app shares them.", dd("Two")),
      orow("Unload after", "Unless an app keeps it loaded.", dd("15 minutes")),
      orow("Model updates", "Only while plugged in and idle.", dd("Automatic")),
      orow("Battery saver", "On battery, run on the processor.", sw(false)),
    ])}
    ${ocard("Which model each app uses", [
      orow("Chat", "", dd("Gemma 4 E4B")), orow("Assistant", "", dd("Gemma 4 E4B")), orow("Search and knowledge", "", dd("Nomic Embed 2")), orow("Coding tools", "", dd("Qwen 3.5 Coder 7B")),
    ], { cls: "la-defs" })}
    ${ocard("", [nrow("Coding tools", "Let tools on Atlas use these models", "On", { ic: "code", sec: SEC })], { cls: "icons la-more" })}`;
  const localB = () => page(split(bCtl(), bPv(), { sec: SEC, cls: "la la-b" }));

  // B, one level down: Coding tools.
  const REQS = [["Code editor", "Qwen 3.5 Coder 7B", "1,240 words", "2 min ago", true], ["Code editor", "Qwen 3.5 Coder 7B", "380 words", "6 min ago", true], ["Terminal helper", "Gemma 4 E4B", "96 words", "18 min ago", true], ["Unknown tool", "", "Wrong key", "1 hour ago", false], ["Code editor", "Qwen 3.5 Coder 7B", "2,015 words", "2 hours ago", true]];
  const apiCtl = () => `
    ${ocard("", [orow("<b>Let coding tools use local models</b>", "Tools on Atlas that speak the OpenAI API", sw(true), { ic: "code", sec: SEC })], { cls: "icons", first: true })}
    ${ocard("Connect a tool", [
      orow("Address", `<span class="mono">${ADDR}</span>`, ib("copy", "Copy")),
      orow("API key", `<span class="mono">nyx-••••••••••••3f9a</span>`, btn("Copy", "sm", "copy")),
      orow("Model", "When a tool doesn't name one", dd("Qwen 3.5 Coder 7B")),
    ], { note: "Paste these into the tool's settings for an OpenAI-compatible provider." })}
    <div class="la-safe card">${icon("shield")}<div><b>Only this computer</b><span>The address answers programs on Atlas, and only those with the key.</span></div></div>`;
  const apiPv = () => `${pvhead("Requests from tools", "The last few hours", seg(["All", "Refused"], "All"))}
     <div class="card la-reqs">${REQS.map(([t, m, n, w, ok]) => `<div class="rq ${ok ? "" : "bad"}"><span class="ri">${icon(ok ? "code" : "lock")}</span><div class="tx"><b>${t}</b><span>${ok ? m : "Refused: the key didn't match"}</span></div><span class="n">${ok ? n : ""}</span><span class="w">${w}</span></div>`).join("")}</div>
     <div class="card la-snip"><div class="sh"><b>In a tool's settings</b>${btn("Copy all", "sm ghost", "copy")}</div>
       <div class="code"><span><i>Base URL</i>${ADDR}</span><span><i>API key</i>nyx-••••••••••••3f9a</span><span><i>Model</i>qwen3.5-coder-7b</span></div></div>`;
  const crumb = () => `<div class="la-crumb">${btn("Local AI", "ghost sm", "chev-l")}${icon("chev-r", "sep")}<b>Coding tools</b></div>`;
  const localApi = () => page(`${crumb()}${split(apiCtl(), apiPv(), { sec: SEC, cls: "la la-api" })}`);

  REG("local-ai", {
    name: "Local AI",
    summary: "Today Local AI is a long column: Nyx AI Core's status as three read-out rows, then memory and update choices, four default-model dropdowns and the coding tools switch with its address and key. What's loaded shows only as a line of text (“No model is loaded”), and nothing shows which apps are using the models or how full memory is.",
    problems: [
      "<b>Status as sentences:</b> “9 requests since it started · first word after 428 ms on average · 87.8 words per second” sits under the heading, before the card it describes.",
      "<b>Memory is one long line:</b> “17.1 GB graphics memory, 33.0 GB system memory (11.7 GB free)”, with nothing showing what fills it.",
      "<b>Who's using it is invisible:</b> you can't see which apps or coding tools are talking to the local models, or which model keeps which app waiting.",
      "<b>Jargon:</b> “Acceleration: CUDA, CPU”, “llama.cpp prism-b12128”, “OpenAI-compatible API”.",
      "<b>Long descriptions under every row</b> wrap to two or three lines at 800 px (Model updates, Battery saver), pushing the coding tools off the screen.",
      "<b>Big empty rows:</b> Acceleration and Memory are read-outs as tall as the rows with controls, right-aligned far from their labels.",
    ],
    today: [["local-ai-1280", "Today", ""], ["local-ai-800", "Today at 800 px", ""]],
    options: [
      { id: "a", name: "Who's using it", idea: "The preview is a live diagram: the apps that use local models (the assistant, Chat, Glimpse, coding tools) connected to Nyx AI Core, and Nyx AI Core to the models it has loaded, with the line lit while one is answering. A model an app keeps loaded has a pin; the coding tools' line shows it needs the key. Under it, graphics and system memory as bars. The controls are short: restart, how many models stay loaded and for how long, battery saver, and the coding tools switch, address and key; which model each app uses and model updates are one row each.",
        shots: [["a", "Local AI", "The assistant answering through Gemma 4 E4B"], ["a-800", "At 800 px", "The diagram left to right, above the controls"]] },
      { id: "b", name: "What it holds, and how fast", idea: "The preview is about memory and speed: graphics and system memory as stacked bars, a card for each loaded model with its activity, what keeps it loaded or when it'll unload, and an Unload button, then answers, time to the first word and speed as small charts. The controls keep every setting on the page, with which model each app uses as a card of dropdowns. Coding tools get their own page one level down, with the address and key to paste into a tool and a list of the requests tools have made, including refused ones.",
        shots: [["b", "Local AI", "Two models loaded, one kept by the assistant"], ["b-api", "Local AI › Coding tools", "One level down: what to paste into a tool, and its requests"]] },
    ],
    pages: { a: localA, b: localB, "b-api": localApi },
  });
})();
