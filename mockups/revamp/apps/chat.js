// Nyx Chat on the revamp page: today's problems and three options.
(() => {
  const NW = () => typeof NARROW !== "undefined" && NARROW;
  const CHATS = {
    pinned: [["Sourdough schedule", "2d"], ["Weekly meal plan", "5d"]],
    today: [["Lisbon in March", "now", true], ["Explain this regex", "11:20"], ["Poem for Maya", "9:05"]],
    earlier: [["Iterator borrows", "Yesterday"], ["Budget laptops", "Yesterday"], ["GTK popover focus", "Mon"], ["Board minutes", "Mon"]],
  };

  const chatrow = ([t, m, on]) => `<div class="navx ch-crow ${on ? "active" : ""}">${icon("chat")}<span>${t}</span><span class="cnt">${m}</span></div>`;

  const serverFoot = () => `<div class="ch-srv">${icon("server")}<div><b>Nyx AI Core</b><span>This computer · 12 models</span></div>${icon("chev-d")}</div>`;

  const modelPick = (o = {}) => `<div class="ch-model ${o.loading ? "loading" : ""}">
    <span class="mi">${icon("spark")}</span><b>${o.name || "Qwen3 8B"}</b>
    <span class="caps">${icon("wrench", "")}${icon("bulb", "")}</span>${icon("chev-d", "chev")}
    <span class="lbar"><b style="width:${o.loading ? 46 : 100}%"></b></span></div>`;

  const hdr = (o = {}) => header({
    icon: "chat", name: "Chat",
    center: o.center !== undefined ? o.center : modelPick(o),
    end: `${o.endExtra || ""}${ib("ghost", "Temporary chat (Ctrl+Shift+N)")}${o.noPanel ? "" : ib("panel", "This chat's prompt and settings", o.panelOn ? "on" : "")}<button class="newbtn">${icon("compose")}<span>New chat</span>${NW() ? "" : `<span class="key">Ctrl N</span>`}</button>`,
  });

  /* ── The conversation ─────────────────────────────────────────────── */
  const userMsg = (t) => `<div class="ch-me"><div class="bb">${t}</div></div>`;
  const reply = (o = {}) => `<div class="ch-ai">
    <div class="who">${icon("spark", "sp")}<b>Qwen3 8B</b><span class="tm">10:42</span></div>
    <div class="steps"><div class="step">${icon("bulb")}<span>Thought for 4 seconds</span>${icon("chev-r", "c")}</div><div class="step">${icon("globe")}<span>Searched the web: <i>Lisbon in March</i>, <i>Sintra day trip by train</i> · 6 pages</span>${icon("chev-r", "c")}</div></div>
    <div class="md">
      <p>Here's a relaxed plan with plenty of eating and walking, and Sintra as the day trip.</p>
      <h4>Day 1 · Alfama and Baixa</h4>
      <p>Start at the castle early, then wander down through Alfama's lanes to lunch at a tasca. Spend the evening in Baixa and Chiado, and book a table for fado.${cite(1)}</p>
      <h4>Day 2 · Sintra</h4>
      <p>Trains leave Rossio every 20 minutes and take about 40 minutes. Do Pena Palace first, before the coaches arrive, then Quinta da Regaleira.${cite(2)}</p>
      <h4>Day 3 · Belém and LX Factory</h4>
      <p>Pastéis de Belém at opening, the monastery, then a riverside walk to LX Factory for lunch.</p>
      ${o.short ? "" : `<p class="tip">${icon("info")} March is mild, 15–19 °C, but showers come and go: pack a light rain jacket.${cite(3)}</p>`}
    </div>
    <div class="srcs">${[["1", "visitlisboa.example"], ["2", "trains.example"], ["3", "weather.example"]].map(([n, d]) => `<span class="src"><b>${n}</b>${d}</span>`).join("")}</div>
    <div class="acts">${btn("Copy", "ghost sm", "copy")}${btn("Regenerate", "ghost sm", "refresh")}${btn("Read aloud", "ghost sm wide", "volume")}${ib("more", "Edit, continue, branch, delete")}<span class="sp"></span><span class="speed">${icon("zap")}41 words/s · 2.1 s to start</span></div>
    ${o.follow === false ? "" : `<div class="follow">${["Where should we stay?", "Make it cheaper", "Add a food tour"].map((f) => `<span class="fq">${f}</span>`).join("")}</div>`}
  </div>`;
  const cite = (n) => `<sup class="cite">${n}</sup>`;

  const composer = (o = {}) => `<div class="ch-comp ${o.big ? "big" : ""}">
    <div class="ta"><span class="ph">${o.ph || "Ask a follow-up…"}</span><span class="hint">${NW() ? "" : "/ prompts · @ model · # knowledge"}</span></div>
    <div class="row">${ib("plus", "Attach a file, image or screenshot")}
      <span class="tg on">${icon("globe")}<span>Web search</span></span>
      <span class="tg on">${icon("bulb")}<span>Think</span></span>
      <span class="tg">${icon("wrench")}<span>Tools</span><em>4</em></span>
      ${o.big ? `<span class="tg">${icon("book")}<span>Knowledge</span></span>` : ""}
      <span class="sp"></span>
      ${o.big ? "" : `<span class="ctx" title="How much of the model's memory this chat uses">${ring(14, { size: 20, c: "var(--accent)", label: " " })}<span>14% of memory</span></span>`}
      ${ib("mic", "Dictate (Ctrl+Space)")}<button class="ib primary send">${icon("arrow-up")}</button></div>
  </div>`;

  const convo = (o = {}) => `<div class="main ch-conv">
    ${o.bar ? o.bar : ""}
    <div class="scroll"><div class="ch-thread">
      ${userMsg("Plan three days in Lisbon in March for two of us. We like food, walking, and one day trip out of the city.")}
      ${reply(o)}
    </div></div>
    ${composer(o)}
  </div>`;

  /* ── Option A: chats first ─────────────────────────────────────────── */
  const sideA = () => `
    ${tiles([["models", "cube", 12, "Models", "blue"], ["know", "book", 4, "Knowledge", "green"], ["prompts", "terminal", 9, "Prompts", "amber"], ["arena", "swords", 128, "Arena votes", "pink"]])}
    ${grp("Pinned", false, "", "accent")}
    ${CHATS.pinned.map(chatrow).join("")}
    ${grp("Folders", false, icon("plus"), "green")}
    ${navx("folder", "Garden club", { cnt: 6 })}
    ${navx("folder", "Work", { cnt: 14 })}
    ${grp("Today", false, "", "violet")}
    ${CHATS.today.map(chatrow).join("")}
    ${grp("Earlier", false, icon("search"), "amber")}
    ${CHATS.earlier.map(chatrow).join("")}
    ${serverFoot()}`;

  const compare = () => {
    const A = [
      ["Qwen3 8B", "41 words/s", "Imagine one bathroom and a whole family. A <b>mutex</b> is the lock on the door: whoever goes in locks it, and everyone else waits in the hall until it's unlocked. Programs use it so two parts don't change the same thing at once and mess it up."],
      ["Gemma 3 12B", "26 words/s", "Think of a talking stick in class. Only the person holding the stick may speak. In a program, a <b>mutex</b> is that stick: a piece of code has to grab it before touching shared data, and hands it back when it's done, so nobody talks over anybody else."],
      ["Llama 3.2 3B", "88 words/s", "A <b>mutex</b> is like a “one at a time” rule for a swing. If two kids grab the swing together, someone falls off. The mutex makes the second kid wait their turn."],
    ];
    return `<div class="main ch-conv">
      <div class="ch-cmpbar">${icon("columns")}<span>Comparing three models on the same message</span><span class="sp"></span>${btn("Add a model", "ghost", "plus")}${btn("Stop comparing", "", "x")}</div>
      <div class="scroll"><div class="ch-thread wide">
        ${userMsg("Explain what a mutex is to a 12-year-old, in three sentences.")}
        <div class="ch-cmp">${A.map(([m, s, t], i) => `<div class="cc ${i === 0 ? "pick" : ""}"><div class="ch">${icon("spark", "sp")}<b>${m}</b><span class="speed">${s}</span></div><p>${t}</p><div class="cf">${i === 0 ? btn("Continuing with this", "primary sm", "check") : btn("Continue with this", "sm")}${ib("copy", "Copy")}${ib("refresh", "Regenerate")}</div></div>`).join("")}</div>
      </div></div>
      ${composer({ ph: "Reply to Qwen3 8B…" })}
    </div>`;
  };

  /* ── Option B: studio, three panes ─────────────────────────────────── */
  const tabsB = (on) => {
    const t = [["Chat", "chat"], ["Models", "cube"], ["Marketplace", "download"], ["Knowledge", "book"], ["Prompts", "terminal"], ["Arena", "swords"], ["Stats", "genre"]];
    return `<div class="seg ch-tabs">${t.map(([n, i]) => `<button class="${n === on ? "on" : ""}" title="${n}">${icon(i)}<span>${n}</span></button>`).join("")}</div>`;
  };
  const sideB = () => `
    <div class="field ch-sf">${icon("search")}<span class="ph">Search chats</span></div>
    ${grp("Pinned", false, "", "accent")}
    ${CHATS.pinned.map(chatrow).join("")}
    ${grp("Garden club", false, icon("sliders"), "green")}
    ${navx("chat", "Tomato blight, again", { cnt: "Tue" })}
    ${navx("chat", "Spring seed order", { cnt: "Oct 30" })}
    ${grp("Recent", false, "", "violet")}
    ${CHATS.today.concat(CHATS.earlier).slice(0, 6).map(chatrow).join("")}
    ${serverFoot()}`;
  const slider = (v) => `<span class="slider" style="width:120px"><span class="tr"><span class="fill" style="width:${v}%"></span></span><span class="kn" style="left:${v}%"></span></span>`;
  const inspB = () => `<div class="insp ch-insp">
    <div class="ihead"><b>This chat</b><span>Starts from the Work folder's settings</span></div>
    <div class="ibody">
      <div class="card ch-mcard"><div class="r1">${icon("spark", "sp")}<b>Qwen3 8B</b><span class="grow"></span>${chip("Loaded", "acc")}</div><div class="mem"><span>Graphics memory</span><span>6.1 of 8 GB</span></div>${prog(76)}<div class="capsrow">${chip("Tools", "", "wrench")}${chip("Thinking", "", "bulb")}</div></div>
      <div class="lab">Instructions</div>
      <div class="ch-sys">You're a friendly travel planner. Keep plans relaxed, with walking routes and where to eat.</div>
      <div class="lab">Tools</div>
      <div class="card">${[["globe", "Web search", true], ["file-text", "Read web pages", true], ["mapin", "Location", false], ["calc", "Calculator", true]].map(([i, t, on]) => `<div class="row">${icon(i)}<span class="k">${t}</span>${sw(on)}</div>`).join("")}</div>
      <div class="lab">Answers</div>
      <div class="card">
        <div class="row"><span class="k">Creativity</span>${slider(55)}<span class="v">0.7</span></div>
        <div class="row"><span class="k">Memory</span>${dd("8,000 words")}</div>
        <div class="row"><span class="k">Reply in JSON</span>${sw(false)}</div>
      </div>
      <div class="more2">${icon("sliders")}Top P, top K, seed and more</div>
    </div></div>`;

  const MKT = [
    ["Qwen3 8B", "Qwen", "2.1M", "Tools · Thinking", "fit"],
    ["Gemma 3 12B", "Google", "1.4M", "Vision", "fit"],
    ["Mistral Small 3.2 24B", "Mistral AI", "880k", "Tools · Vision", "part"],
    ["Llama 3.3 70B", "Meta", "1.9M", "Tools", "big"],
    ["Phi-4 mini", "Microsoft", "640k", "Tools", "fit"],
    ["Nomic Embed v2", "Nomic", "310k", "Embedding", "fit"],
    ["DeepSeek R1 Distill 14B", "DeepSeek", "1.2M", "Thinking", "part"],
  ];
  const fit = (k) => ({ fit: `<span class="ch-fit fit">${icon("check-c")}Fits</span>`, part: `<span class="ch-fit part">${icon("alert")}Partly</span>`, big: `<span class="ch-fit big">${icon("x")}Too big</span>` }[k]);
  const market = () => `<div class="main ch-mkt">
    <div class="mbar"><div class="field">${icon("search")}<span>gemma</span></div>${seg(["Hugging Face", "Ollama"], "Hugging Face")}<span class="sp"></span>${dd("Trending", "sort")}</div>
    <div class="fbar">${chip("All", "on")}${chip("Text")}${chip("Vision")}${chip("Embedding")}<span class="sp"></span><span class="hw">${icon("monitor")}This computer: 8 GB graphics · 32 GB memory</span></div>
    <div class="cols">
      <div class="list ch-mlist"><div class="scroll">${MKT.map(([n, a, d, t, f], i) => `<div class="mrow2 ${i === 1 ? "sel" : ""}">${art(n, { w: 34, h: 34, r: 8, ic: "cube" })}<div class="tx"><b>${n}</b><span>${a} · ${icon("download")}${d} · ${t}</span></div>${fit(f)}</div>`).join("")}</div></div>
      <div class="main ch-mdet"><div class="scroll"><div class="pad">
        <div class="h">${art("Gemma 3 12B", { w: 52, h: 52, r: 12, ic: "cube" })}<div><h2>Gemma 3 12B</h2><span>Google · Reads images · 128k context</span></div><span class="sp"></span>${btn("Model card", "ghost", "external")}</div>
        <p class="desc">A mid-size model that reads images as well as text. Good at summaries, writing and answering questions about screenshots and photos.</p>
        <div class="lab">Pick a size</div>
        <div class="card ch-vers">${[["Small", "Q3_K_M", "5.6 GB", "fit", ""], ["Balanced", "Q4_K_M", "7.3 GB", "fit", "Recommended"], ["Sharp", "Q6_K", "9.7 GB", "part", ""], ["Full", "Q8_0", "12.5 GB", "part", ""], ["Original", "F16", "23.5 GB", "big", ""]].map(([n, q, s, f, r]) => `<div class="vr ${r ? "rec" : ""}"><div class="tx"><b>${n}${r ? `<em>${r}</em>` : ""}</b><span>${q}</span></div><span class="sz">${s}</span>${fit(f)}${r ? btn("Download", "primary sm", "download") : btn("Download", "sm")}</div>`).join("")}</div>
        <p class="note">${icon("info")}Partly: some of it runs on the processor, so replies come slower. Sizes count the memory for 8,000 words of chat.</p>
      </div></div></div>
    </div>
    <div class="ch-dl">${icon("download")}<div class="tx"><b>Downloading Phi-4 mini · Balanced</b>${prog(62)}</div><span class="m">2.4 of 3.9 GB · 18 MB/s · 1 min left</span>${btn("Pause", "ghost sm")}${ib("x", "Cancel")}</div>
  </div>`;

  /* ── Option C: ask home, rail of pages ─────────────────────────────── */
  const sideC = (on = "home") => `
    ${navx("home", "Home", { active: on === "home" })}
    ${navx("history", "Chats", { active: on === "chats", cnt: 48 })}
    ${grp("Models", false, "", "blue")}
    ${navx("cube", "Models", { cnt: 12 })}
    ${navx("download", "Marketplace", { badge: 1 })}
    ${grp("Library", false, "", "green")}
    ${navx("book", "Knowledge", { cnt: 4 })}
    ${navx("terminal", "Prompts", { cnt: 9 })}
    ${grp("Play", false, "", "pink")}
    ${navx("swords", "Arena", { active: on === "arena" })}
    ${navx("genre", "Stats")}`;
  const home = () => `<div class="main ch-home"><div class="scroll"><div class="clamp" style="--clamp: 760px">
    <h1>What can I help with?</h1>
    ${composer({ big: true, ph: "Ask anything, or drop a file here" })}
    <div class="ch-pr">${[["/summarize", "Summarize this"], ["/translate", "Translate to Spanish"], ["/explain", "Explain like I'm new"], ["/review", "Review my code"]].map(([c, t]) => `<span class="pc"><b>${c}</b>${t}</span>`).join("")}</div>
    <div class="sechead">Pick up where you left off<span class="more">All chats</span></div>
    <div class="ch-recent">${[["Lisbon in March", "Qwen3 8B · 10 min ago", "Day 2 · Sintra: trains leave Rossio every 20 minutes…"], ["Explain this regex", "Qwen3 8B · 11:20", "It matches a date like 2026-11-12: four digits, a dash…"], ["Birthday poem for Maya", "Gemma 3 12B · 9:05", "Eleven candles, one big wish, a cake that's mostly…"], ["Rust: borrowing in iterators", "Qwen3 8B · Yesterday", "The closure borrows v mutably, so you can't also…"]].map(([t, m, p]) => `<div class="rc"><b>${t}</b><span class="m">${m}</span><span class="p">${p}</span></div>`).join("")}</div>
    <div class="ch-week">${[["chat", "23", "chats this week"], ["pen", "18,400", "words written for you"], ["zap", "88 words/s", "fastest: Llama 3.2 3B"]].map(([i, v, t]) => `<div class="kcard"><span class="k">${icon(i)}${t}</span><span class="v">${v}</span></div>`).join("")}</div>
    <div class="ch-status card">${icon("spark", "sp")}<div class="tx"><b>Qwen3 8B is ready</b><span>Loaded on this computer · 6.1 of 8 GB graphics memory</span></div>${prog(76)}${btn("Change", "ghost")}</div>
  </div></div></div>`;
  const arena = () => `<div class="main ch-arena">
    ${pbar2("Arena", "Two hidden models answer; you pick the better one", btn("New round", "", "refresh"))}
    <div class="cols"><div class="main"><div class="scroll"><div class="pad">
      <div class="q">${icon("chat")}<span>Write a two-line poem about a cat who hates Mondays.</span></div>
      <div class="ab">${[["A", "Sunbeam gone, the alarm's shrill call—<br>he blinks, then knocks your coffee off the wall."], ["B", "Monday came; he filed a quiet complaint:<br>one hairball, placed precisely, on fresh paint."]].map(([k, t]) => `<div class="ans"><div class="ah"><b>Model ${k}</b><span>hidden until you vote</span></div><p>${t}</p></div>`).join("")}</div>
      <div class="vote">${btn("A is better", "", "chev-l")}${btn("It's a tie")}${btn("Both are bad", "dtext")}${btn("B is better", "", "chev-r")}</div>
      <div class="sechead">Your last rounds</div>
      <div class="card ch-rounds">${[["Gemma 3 12B", "Phi-4 mini", "A haiku about rain on a tin roof"], ["Qwen3 8B", "Llama 3.2 3B", "Explain compound interest with pizza"], ["It's a tie", "", "Name a cafe run by cats"]].map(([w, l, q]) => `<div class="row">${icon(l ? "check-c" : "columns")}<span class="k">${q}</span><span class="v">${l ? `<b>${w}</b> beat ${l}` : w}</span></div>`).join("")}</div>
    </div></div></div>
    <div class="insp ch-lb"><div class="ihead"><b>Leaderboard</b><span>128 votes</span></div><div class="ibody">${[["Gemma 3 12B", 1112, "31–18–6"], ["Qwen3 8B", 1084, "28–20–7"], ["Mistral Small 24B", 1041, "19–19–4"], ["Phi-4 mini", 968, "12–24–3"], ["Llama 3.2 3B", 912, "9–28–2"]].map(([m, e, w], i) => `<div class="lb"><span class="n">${i + 1}</span><div class="tx"><b>${m}</b><span>${w} wins, losses, ties</span></div><span class="e">${e}</span></div>`).join("")}<div class="lbfoot">${btn("Reset leaderboard", "ghost dtext sm", "trash")}</div></div></div></div>
  </div>`;

  /* ── Option C: chat beside a workspace ────────────────────────────── */
  const hdrN1 = () => header({ icon: "chat", name: "Chat",
    start: `<button class="n1-jump">${icon("chat")}<b>Garden club badge</b>${icon("chev-d")}${NW() ? "" : `<span class="key">Ctrl K</span>`}</button>`,
    center: modelPick(),
    end: `${ib("ghost", "Temporary chat (Ctrl+Shift+N)")}<button class="newbtn">${icon("compose")}<span>New chat</span>${NW() ? "" : `<span class="key">Ctrl N</span>`}</button>` });
  const badge = (leaf = "#2c5a24", weight = 800) => `<svg class="n1-badge" viewBox="0 0 200 200" aria-hidden="true">
    <defs><path id="n1arc" d="M 41.7 121.2 A 62 62 0 1 1 158.3 121.2"/></defs>
    <circle cx="100" cy="100" r="94" fill="#f2e4c4" stroke="#6e4426" stroke-width="5"/>
    <circle cx="100" cy="100" r="80" fill="none" stroke="#6e4426" stroke-width="1.4" stroke-dasharray="2 4"/>
    <text font-family="Inter, sans-serif" font-weight="${weight}" font-size="14.5" fill="#6e4426" letter-spacing="1.5"><textPath href="#n1arc" startOffset="50%" text-anchor="middle">ELM STREET GROWERS</textPath></text>
    <ellipse cx="100" cy="124" rx="38" ry="33" fill="#d8452a"/>
    <path d="M73 112c3-10 12-16 22-17" stroke="#f7a07f" stroke-width="5" stroke-linecap="round" fill="none" opacity=".75"/>
    <path d="M100 93 88 80l14 6 2-14 6 13 13-5-9 12 14 4-15 4z" fill="${leaf}"/>
    <path d="M100 92c0-8 2-14 7-18" stroke="${leaf}" stroke-width="3.5" stroke-linecap="round" fill="none"/>
    <text x="100" y="171" font-family="Inter, sans-serif" font-weight="600" font-size="9" fill="#6e4426" letter-spacing="2.5" text-anchor="middle">SINCE 2019</text>
  </svg>`;
  const artCard = (v, note, on) => `<div class="n1-art ${on ? "on" : ""}"><span class="th">${badge(v === 1 ? "#4f8a3c" : "#2c5a24", v === 1 ? 600 : 800)}</span><div class="tx"><b>badge.svg</b><span>Version ${v} · ${note}</span></div>${on ? `<span class="sh">${icon("eye")}Showing</span>` : btn("Open", "ghost sm")}</div>`;
  const n1Thread = () => `<div class="scroll"><div class="n1-thread">
    ${userMsg("Make a round badge for our garden club as an SVG: a tomato in the middle, “Elm Street Growers” around the edge, earthy colours.")}
    <div class="ch-ai"><div class="who">${icon("spark", "sp")}<b>Qwen3 8B</b><span class="tm">10:12</span></div>
      <div class="md"><p>Here's a first go: a tomato with a leafy top on a cream disc, the name set around the top edge.</p></div>
      ${artCard(1, "cream disc, light leaves", false)}</div>
    ${userMsg("Darker leaves, and make the name bolder.")}
    <div class="ch-ai"><div class="who">${icon("spark", "sp")}<b>Qwen3 8B</b><span class="tm">10:14</span></div>
      <div class="steps"><div class="step">${icon("bulb")}<span>Thought for 3 seconds</span>${icon("chev-r", "c")}</div></div>
      <div class="md"><p>Done. The leaves are a deeper green and the name is bold and a little larger, so it still reads at badge size.</p></div>
      ${artCard(2, "darker leaves, bold name", true)}
      <div class="acts">${btn("Copy", "ghost sm", "copy")}${btn("Regenerate", "ghost sm", "refresh")}${ib("more", "Edit, continue, branch, read aloud, delete")}<span class="sp"></span><span class="speed">${icon("zap")}38 words/s</span></div>
    </div>
  </div></div>`;
  const n1Pane = (o = {}) => `<div class="main n1-pane">
    <div class="n1-ptabs">${o.back ? `<button class="n1-back">${icon("chev-l")}Chat</button>` : ""}<span class="pt on">${icon("image")}badge.svg</span><span class="pt">${icon("sliders")}Chat settings</span><span class="sp"></span>${ib("x", "Close the workspace")}</div>
    <div class="n1-pbar">${seg(["Preview", "Code"], "Preview")}<span class="vers"><span class="v">v1</span><span class="v on">v2</span></span><span class="sp"></span>${btn("Copy", "ghost sm", "copy")}${btn("Save as…", "sm", "download")}${ib("external", "Open in the browser")}</div>
    <div class="n1-stagec"><div class="frame">${badge()}</div></div>
    <div class="n1-pfoot">${icon("info")}<span>Changed from v1: the leaves are <b>#2C5A24</b> and the name is bold.</span><span class="sp"></span><a>Compare with v1</a></div>
  </div>`;
  const n1Page = () => NW()
    ? n1Pane({ back: true })
    : `<div class="cols n1-ws"><div class="main n1-chat">${n1Thread()}${composer({ ph: "Ask for a change…" })}</div>${n1Pane()}</div>`;
  const n1Palette = () => {
    const r = (ic, t, end = "", c = "") => `<div class="pr ${c}">${icon(ic)}<span class="t">${t}</span>${end}</div>`;
    const m = (t) => `<span class="m">${t}</span>`;
    return `<div class="veil n1-veil"><div class="n1-pal pop">
      <div class="q">${icon("search")}<span class="ph">Jump to a chat, a page or an action</span><span class="kbd">Esc</span></div>
      <div class="body">
        <div class="col">
          <div class="h" style="--sc: var(--accent)">Pinned</div>
          ${r("pin", "Sourdough schedule", m("2d"))}${r("pin", "Weekly meal plan", m("5d"))}
          <div class="h" style="--sc: var(--sw-violet)">Recent</div>
          ${r("chat", "Garden club badge", m("now"), "on")}${r("chat", "Lisbon in March", m("10:42"))}${r("chat", "Explain this regex", m("11:20"))}${r("chat", "Poem for Maya", m("9:05"))}${r("chat", "Iterator borrows", m("Yesterday"))}
          <div class="h" style="--sc: var(--sw-green)">Folders</div>
          ${r("folder", "Garden club", m("6 chats"))}${r("folder", "Work", m("14 chats"))}
        </div>
        <div class="col">
          <div class="h" style="--sc: var(--sw-blue)">Go to</div>
          ${r("cube", "Models", m("12"))}${r("download", "Marketplace", `<span class="b">1 update</span>`)}${r("book", "Knowledge", m("4"))}${r("terminal", "Prompts", m("9"))}${r("bulb", "Memories", m("7"))}${r("swords", "Arena")}${r("genre", "Stats")}
          <div class="h" style="--sc: var(--sw-pink)">Do</div>
          ${r("ghost", "New temporary chat", `<span class="k">Ctrl Shift N</span>`)}${r("columns", "Compare models on this message")}${r("image", "Screenshot into the chat", `<span class="k">Ctrl Shift S</span>`)}${r("export", "Export this chat")}
        </div>
      </div>
      <div class="ft"><span>${kbd("↑")}${kbd("↓")} move</span><span>${kbd("Enter")} open</span><span>${kbd("Ctrl P")} pin</span><span>${kbd("Ctrl D")} delete</span><span class="sp"></span><span>Searches every word in your chats</span></div>
    </div></div>`;
  };

  /* ── Option D: notebook ────────────────────────────────────────────── */
  const hdrN2 = (on = "Lisbon in March") => {
    const pins = [["history", "All chats"], ["cube", "Models"], ["download", "Marketplace"], ["book", "Knowledge"], ["terminal", "Prompts"], ["swords", "Arena"], ["genre", "Stats"]];
    const tabs = NW() ? [["Lisbon in March", "chat"]] : [["Lisbon in March", "chat"], ["Explain this regex", "chat"], ["Poem for Maya", "chat"]];
    return header({ icon: "chat", name: "Chat",
      center: `<div class="n2-tabs">${(NW() ? pins.slice(0, 1) : pins).map(([i, t]) => `<span class="pin ${t === on ? "on" : ""}" title="${t}">${icon(i)}</span>`).join("")}${NW() ? `<span class="pin" title="Models, Marketplace, Knowledge, Prompts, Arena, Stats">${icon("more")}</span>` : ""}<span class="dv"></span>${tabs.map(([t, i]) => `<span class="tb ${t === on ? "on" : ""}">${icon(i)}<span class="tt">${t}</span><span class="x">${icon("x")}</span></span>`).join("")}${NW() ? `<span class="more">+2</span>` : ""}<span class="plus" title="New chat (Ctrl+N)">${icon("plus")}</span></div>`,
      end: `${ib("ghost", "Temporary chat (Ctrl+Shift+N)")}` });
  };
  const sideN2 = () => `
    ${grp("Questions", true, "", "accent")}
    ${[["Plan three days in Lisbon in March", true], ["Where should we stay?"], ["Make it cheaper"], ["Add a food tour"]].map(([t, on], i) => `<div class="navx n2-oq ${on ? "active" : ""}"><span class="no">${i + 1}</span><span>${t}</span></div>`).join("")}
    ${grp("Branches", false, "", "violet")}
    ${navx("merge", "Lisbon on a budget", { sub: "from 3" })}
    ${grp("Attached", false, icon("plus"), "green")}
    ${navx("file-text", "flights-march.pdf")}
    ${navx("book", "Travel notes", { sub: "knowledge" })}
    ${grp("It remembers", false, "", "amber")}
    ${navx("bulb", "You're vegetarian")}
    ${navx("bulb", "Trains over buses")}
    ${serverFoot()}`;
  const n2Doc = () => `<div class="main n2-main">
    <div class="scroll"><div class="n2-doc">
      <div class="dh"><div class="tx"><h1>Lisbon in March</h1><span class="m">${chip("Travel", "", "folder")}${chip("#holidays")}<span>Started today · 4 questions</span></span></div>${ib("pin", "Pin")}${ib("export", "Export as Markdown or JSON")}${ib("more", "Rename, tag, move, archive, delete")}</div>
      <div class="n2-model">${modelPick()}<span class="tg on">${icon("globe")}<span>Web search</span></span><span class="tg on">${icon("bulb")}<span>Think</span></span><span class="tg">${icon("wrench")}<span>Tools</span><em>4</em></span><span class="sp"></span><span class="ctx">${ring(14, { size: 18, c: "var(--accent)", label: " " })}14% of memory</span>${ib("sliders", "Instructions, creativity, memory and more")}</div>
      <div class="n2-q"><span class="no">1</span><div class="tx"><p>Plan three days in Lisbon in March for two of us. We like food, walking, and one day trip out of the city.</p><span class="m">You · 10:41 ${icon("pen")}</span></div></div>
      <div class="n2-a">
        <div class="meta">${icon("spark", "sp")}<b>Qwen3 8B</b><span>·</span><span class="lk">${icon("bulb")}Thought 4 s</span><span>·</span><span class="lk">${icon("globe")}Read 6 web pages</span><span>·</span><span>${icon("zap")}41 words/s</span></div>
        <div class="md">
          <p>Here's a relaxed plan with plenty of eating and walking, and Sintra as the day trip.</p>
          <h4>Day 1 · Alfama and Baixa</h4>
          <p>Start at the castle early, then wander down through Alfama's lanes to lunch at a tasca. Spend the evening in Baixa and Chiado, and book a table for fado.${cite(1)}</p>
          <h4>Day 2 · Sintra</h4>
          <p>Trains leave Rossio every 20 minutes and take about 40 minutes. Do Pena Palace first, before the coaches arrive, then <span class="n2-hl">Quinta da Regaleira<span class="n2-pop pop"><span class="pb on">${icon("chat")}Ask about this</span><span class="pb">${icon("bulb")}Explain</span><span class="pb">${icon("copy")}Copy</span></span></span>.${cite(2)}</p>
          <h4>Day 3 · Belém and LX Factory</h4>
          <p>Pastéis de Belém at opening, the monastery, then a riverside walk to LX Factory for lunch.</p>
        </div>
        <div class="srcs">${[["1", "visitlisboa.example"], ["2", "trains.example"], ["3", "weather.example"]].map(([n, d]) => `<span class="src"><b>${n}</b>${d}</span>`).join("")}</div>
        <div class="acts"><span class="ver">${icon("chev-l")}2 of 2${icon("chev-r")}</span>${btn("Copy", "ghost sm", "copy")}${btn("Regenerate", "ghost sm", "refresh")}${btn("Read aloud", "ghost sm wide", "volume")}${btn("Branch from here", "ghost sm wide", "merge")}${ib("more", "Edit, continue, delete")}</div>
      </div>
      <div class="n2-q"><span class="no">2</span><div class="tx"><p>Where should we stay?</p><span class="m">You · 10:44 ${icon("pen")}</span></div></div>
    </div></div>
    ${composer({ ph: "Ask question 5…" })}
  </div>`;
  const sideN2b = () => `
    ${grp("Chats", true, "", "accent")}
    ${navx("history", "All chats", { active: true, cnt: 48 })}
    ${navx("pin", "Pinned", { cnt: 2 })}
    ${navx("archive", "Archived", { cnt: 11 })}
    ${grp("Folders", false, icon("plus"), "green")}
    ${navx("folder", "Garden club", { cnt: 6 })}
    ${navx("folder", "Travel", { cnt: 5 })}
    ${navx("folder", "Work", { cnt: 14 })}
    ${grp("Tags", false, "", "violet")}
    ${navx("tag", "holidays", { cnt: 4 })}
    ${navx("tag", "code", { cnt: 9 })}
    ${navx("tag", "recipes", { cnt: 3 })}
    ${serverFoot()}`;
  const n2Chats = () => {
    const R = [
      ["Lisbon in March", "Travel", "Qwen3 8B", "10:42", 8, "Here's a relaxed plan with plenty of eating and walking, and Sintra as the day trip.", true],
      ["Garden club badge", "Garden club", "Qwen3 8B", "10:14", 4, "Done. The leaves are a deeper green and the name is bold.", false],
      ["Explain this regex", "Work", "Qwen3 8B", "11:20", 2, "It matches a date like 2026-11-12: four digits, a dash, then two.", false],
      ["Poem for Maya", "", "Gemma 3 12B", "9:05", 2, "Eleven candles, one big wish, a cake that's mostly frosting…", false],
      ["Budget laptops", "", "Gemma 3 12B", "Yesterday", 6, "The cheaper one has a slower drive but the same screen and battery.", false],
      ["Sourdough schedule", "", "Llama 3.2 3B", "2d", 12, "Feed the starter at 8, mix at noon, shape by 4.", false],
      ["Iterator borrows", "Work", "Qwen3 8B", "Mon", 5, "The closure borrows v mutably, so you can't also read it inside the loop.", false],
      ["Board minutes", "Garden club", "Gemma 3 12B", "Mon", 3, "Agreed to order seed potatoes by March and fix the shed door.", false],
      ["Tomato blight, again", "Garden club", "Qwen3 8B", "Nov 4", 7, "Remove the lower leaves, water at the roots, and space the plants out.", false],
      ["Spring seed order", "Garden club", "Qwen3 8B", "Oct 30", 4, "Here's the order split by sowing month, with the cheapest supplier for each.", false],
    ];
    return `<div class="main n2-chats">
      <div class="n2-cbar"><div class="field">${icon("search")}<span class="ph">Search every word in your chats</span><span class="sp"></span><span class="n">Ctrl F</span></div>${dd("Any model")}${dd("Newest first", "sort")}</div>
      <div class="n2-sel">${icon("check-c")}<b>2 selected</b><span class="sp"></span>${btn("Move to folder", "ghost sm", "folder")}${btn("Tag", "ghost sm", "tag")}${btn("Export", "ghost sm", "export")}${btn("Archive", "ghost sm", "archive")}${btn("Delete", "ghost sm dtext", "trash")}</div>
      <div class="scroll">${R.map(([t, f, m, w, n, s, pin], i) => `<div class="n2-cr ${i < 2 ? "sel" : ""}"><span class="cbx sq ${i < 2 ? "done" : ""}">${i < 2 ? icon("check") : ""}</span><div class="tx"><div class="r1"><b>${t}</b>${pin ? icon("pin", "pn") : ""}${f ? chip(f, "", "folder") : ""}</div><span class="s">${s}</span></div><span class="mm">${m}</span><span class="nn">${n} messages</span><span class="w">${w}</span></div>`).join("")}</div>
    </div>`;
  };

  REG("chat", {
    name: "Chat",
    summary: "Chat does a great deal (tools, compare, arena, a model marketplace, voice), but it shows all of it at once: a sidebar of app pages that pushes your chats below the fold, a model picker that shows a file name, and rows of unlabelled icons under the message box and every reply.",
    problems: [
      "<b>Your chats come last:</b> eight app pages, a Folders hint and three headings fill the sidebar before the first chat appears under “Previous 30 days”; at 800 px the rail has no chats at all.",
      "<b>The model is a file name:</b> the header shows “nvidia/NVIDIA-Nemot…-Bolt…” and every reply repeats “…E4B-4GB:Q4_K_M 86 tok · 83.2 tok/s”.",
      "<b>Six bare toggles under the message box</b> (attach, screenshot, web search, location, thinking, JSON), told apart only by a faint blue fill.",
      "<b>Seven faint icons under every reply</b> (copy, regenerate, continue, edit, branch, read aloud, delete), all the same weight and barely visible.",
      "<b>The header mixes jobs:</b> the chat's title as a subtitle, the model, +, a sun-shaped parameters button, ⋮, Temporary chat (an eye with a line through it) and a search box squeezed in at the right.",
      "<b>“683 / 8k”</b> beside a tiny bar is the only sign of how full the chat's memory is, in model jargon.",
      "<b>The server sits in the sidebar foot</b> as “● 12 models / This computer ⌄”, easy to miss and cut off at 800 px.",
    ],
    today: [["chat-1280", "Today at 1280 px", "A short chat with a thinking model"], ["chat-800", "Today at 800 px", "Rail of page icons; no chats"]],
    options: [
      { id: "a", name: "Studio", idea: "For tinkerers. The app's seven pages become tabs in the header (Chat, Models, Marketplace, Knowledge, Prompts, Arena, Stats), so the sidebar is only chats, with a search and a section per folder. A panel on the right is always open with this chat's model, how much memory it takes, its instructions, tools and answer settings in plain words; the finer dials sit behind “Top P, top K, seed and more”. Marketplace lists models with a clear Fits, Partly or Too big for this computer, and the sizes as Small, Balanced, Sharp.",
        shots: [
          ["b-chat","A chat with its settings","Chats, conversation and this chat's panel"],
          ["b-market","Marketplace","Fits / Partly / Too big; sizes in words; download at the foot"],
          ["b-chat-800","At 800 px","Tabs as icons; the panel folds away"],
        ] },
      { id: "b", name: "Ask home", idea: "Opens on a calm start page: one big message box, your saved prompts as chips, the last few chats as cards and a line saying which model is ready. The sidebar lists the app's places in coloured groups (Models, Library, Play) and a single Chats page holds the history. Arena gets room to breathe: two hidden answers side by side, four plain vote buttons and the leaderboard beside them. Suits people who use Chat for quick questions more than long threads.",
        shots: [
          ["c-home","Home","One message box, saved prompts, recent chats"],
          ["c-arena","Arena","Two hidden answers, vote, leaderboard"],
          ["c-home-800","At 800 px","Rail; the cards stack to two columns"],
        ] },
      { id: "c", name: "Workspace", idea: "The chat on the left, and what it makes on the right: an SVG drawn as a picture, code, a JSON tree, a table. Each new version is kept (v1, v2) so you can flip back or compare, copy it or save it as a file, and the same panel holds this chat's settings. There's no sidebar: Ctrl K (or the chat's name) opens one box to jump to any chat, folder or page (Models, Marketplace, Knowledge, Prompts, Memories, Arena, Stats) or do an action, and it searches every word in your chats. Suits people who use Chat to make things rather than to talk.",
        shots: [
          ["n1-chat","A chat and its workspace","The badge it drew, version 2, beside the chat"],
          ["n1-jump","Ctrl K","Chats, folders, pages and actions in one box"],
          ["n1-chat-800","At 800 px","The workspace takes the window; ‹ Chat goes back"],
        ] },
      { id: "d", name: "Notebook", idea: "Open chats sit in tabs across the top, like a browser, with the app's pages as small pinned tabs at the start. Each chat reads as a document rather than bubbles: your questions are numbered headings, answers flow under them with the model, its thinking and sources on one quiet line, and the sidebar is the chat's outline, its branches, attached files and the memories it uses. Select any words to ask about them. All chats is a page of its own, searching every word, with folders, tags and bulk export. Suits long research chats you come back to.",
        shots: [
          ["n2-chat","A chat as a document","Tabs of chats; the outline; ask about selected words"],
          ["n2-chats","All chats","Search every word; folders and tags; act on several at once"],
        ] },
    ],
    icons: {
      cube: '<path d="m12 3 8 4.5v9L12 21l-8-4.5v-9z"/><path d="m4 7.5 8 4.5 8-4.5M12 12v9"/>',
      bulb: '<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z"/>',
      wrench: '<path d="M14.5 6.5a4 4 0 0 0 5 5L21 13l-2 2-1.5-1.5-8 8a2.1 2.1 0 0 1-3-3l8-8L13 9l2-2z"/>',
      ghost: '<path d="M5 20V10a7 7 0 0 1 14 0v10l-2.3-1.6L14.3 20 12 18.4 9.7 20l-2.4-1.6z"/><path d="M9.5 10.5h.01M14.5 10.5h.01" stroke-width="2.4"/>',
      "arrow-up": '<path d="M12 19V5M6 11l6-6 6 6"/>',
      zap: '<path d="M13 2.5 4.5 13.5H12l-1 8 8.5-11H12z"/>',
      swords: '<path d="M14.5 17.5 3.5 6.5V3.5h3l11 11M13 19l6-6M16 16l4 4M19 21l2-2M9.5 14.5 5 19M3 21l2-2M14.5 9.5l6-6M17.5 3.5h3v3"/>',
      calc: '<rect x="5" y="3" width="14" height="18" rx="2.5"/><path d="M8.5 7h7M8.5 11h.01M12 11h.01M15.5 11h.01M8.5 14.5h.01M12 14.5h.01M15.5 14.5v3M8.5 17.5h.01M12 17.5h.01" stroke-width="1.9"/>',
    },
    pages: {
      "a-chat": () => win({ hdr: hdr(), side: NW() ? "" : sideA(), page: convo() }),
      "a-compare": () => win({ hdr: hdr({ center: `<div class="ch-cmpm">${["Qwen3 8B", "Gemma 3 12B", "Llama 3.2 3B"].map((m) => `<span class="chip2">${icon("spark")}${m}</span>`).join("")}${ib("plus", "Compare with another model")}</div>` }), side: sideA(), page: compare() }),
      "b-chat": () => win({ hdr: hdr({ center: tabsB("Chat"), noPanel: false, panelOn: true }), side: NW() ? "" : sideB(), page: `<div class="cols">${convo({ bar: `<div class="ch-cbar">${modelPick()}<span class="t">Lisbon in March</span><span class="sp"></span>${ib("more", "Rename, pin, tag, export")}</div>`, short: true, follow: NW() })}${NW() ? "" : inspB()}</div>`, over: NW() ? `<div class="ch-float">${inspB()}</div>` : "" }),
      "b-market": () => win({ hdr: hdr({ center: tabsB("Marketplace"), noPanel: true }), side: sideB(), page: market() }),
      "c-home": () => win({ hdr: hdr({ noPanel: true }), side: sideC(), page: home() }),
      "c-arena": () => win({ hdr: hdr({ noPanel: true, center: "" }), side: sideC("arena"), page: arena() }),
      "n1-chat": () => win({ hdr: hdrN1(), side: "", page: n1Page() }),
      "n1-jump": () => win({ hdr: hdrN1(), side: "", page: n1Page(), over: n1Palette() }),
      "n2-chat": () => win({ hdr: hdrN2(), side: NW() ? "" : sideN2(), page: n2Doc() }),
      "n2-chats": () => win({ hdr: hdrN2("All chats"), side: sideN2b(), page: n2Chats() }),
    },
  });
})();
