// Assistant & AI › Assistant: Echo itself, how you call it, how a conversation goes, and the rest.
(() => {
  const DESC = "Echo, how you call it, and how it talks with you.";
  const o = (ic) => ({ ic, sec: "assistant" });
  const page = (body) => () => swin({ sec: "assistant", page: "Assistant", desc: DESC, body: body() });

  /* ── Small drawings ──────────────────────────────────────────────── */
  const orb = (c = "") => `<span class="as-orb ${c}"></span>`;
  const wave = (n, seed, c = "") => `<span class="as-wave ${c}">${Array.from({ length: n }, (_, i) => `<b style="height:${18 + (hash(seed + i) % 82)}%"></b>`).join("")}</span>`;
  const desk = (inner) => `<div class="as-desk" style="background:linear-gradient(150deg, color-mix(in srgb, var(--sw-violet) 55%, #10121a), color-mix(in srgb, var(--sw-coral) 40%, #0b0c11))"><span class="dbar"><i></i><i class="on"></i><i></i><em>Fri 14:18</em></span><span class="dw a"></span><span class="dw b"></span>${inner}</div>`;
  const overlay = () => `<div class="as-ov">
      <div class="you">${icon("mic")}<span>“What's the weather like tomorrow?”</span></div>
      <div class="ans">${orb("sm")}<div class="tx"><b>Tomorrow in Portland</b><span>14° and cloudy, with light rain after 3 pm. Take a jacket.</span></div>${wave(22, "ans")}</div>
    </div>`;
  const timeline = () => `<div class="card as-tl">
      <div class="tlh"><b>One conversation</b><span>How long it listens, with the settings on the left</span></div>
      <div class="track">
        <span class="sg wake" style="flex:1.1">“Echo”</span>
        <span class="sg you" style="flex:2.4">Your question</span>
        <span class="sg ans" style="flex:3">Its answer</span>
        <span class="sg lis" style="flex:2.6">Listens for a reply</span>
        <span class="sg idle" style="flex:2.4">Quiet</span>
      </div>
      <div class="ticks"><span style="flex:6.5"></span><span class="tk" style="flex:2.6">8 s</span><span class="tk end" style="flex:2.4">Ends after 2 min</span></div>
    </div>`;

  /* ── A: status and a sample conversation ─────────────────────────── */
  const statusCard = () => ocard("", [
    `<div class="opt as-st">${orb()}<div class="opt-text"><div><b>Echo</b><span class="pill dot" style="--tc:var(--success)">Running</span></div><div class="d">Qwen 3 8B on this computer · ready</div></div>${btn("Restart", "sm")}${btn("Stop", "sm ghost")}</div>`,
    orow("Microphone", "Off: it doesn't listen, even for its name.", sw(true), o("mic")),
  ], { cls: "icons" });

  const aCtl = () => `
    ${statusCard()}
    ${ocard("Calling it", [
      orow("Listen for its name", `Answers to ${["Echo", "Hey Echo", "Ekko"].map((w) => `<span class="as-w">${w}</span>`).join("")}`, sw(true), o("eye")),
      orow("Talk to Echo", "Press, or hold to talk.", `<span class="as-k">${keys("Super", "A")}<small>hold</small>${keys("Super", "Ctrl")}</span>`, o("keyboard")),
    ], { cls: "icons" })}
    ${ocard("Conversation", [
      orow("Listen for a reply", "Answer back without its name.", sl(14, "8 s", 110), o("refresh")),
      orow("End a conversation after", "", dd("2 min of quiet"), o("clock")),
      orow("Show the overlay", "What it hears, says and asks.", sw(true), o("window")),
    ], { cls: "icons" })}
    <div class="as-more">${[["check-c", "Tasks", "Small changes only"], ["shield", "Privacy and history", "History off"], ["book", "Personal dictionary", "14 words"], ["spark", "Helpers", "Claude Code"]].map(([ic, n, v]) => `<div class="card mt"><span class="lic" style="--tc:var(--sec-assistant)">${icon(ic)}</span><div class="tx"><b>${n}</b><span>${v}</span></div>${icon("chev-r", "cv")}</div>`).join("")}</div>`;

  const aPv = () => `
    ${pvhead("Talking to Echo", "What you'll see on screen, and how long it listens.", seg(["Listening", "Answering", "Asking"], "Answering"))}
    ${desk(overlay())}
    ${timeline()}
    ${pvfoot("What it hears stays on this computer. The weather used your city, found from your internet address.", "lock")}`;

  /* ── B: pick a part, see it ──────────────────────────────────────── */
  const PARTS = [
    ["power", "Echo", "Running · Qwen 3 8B"], ["mic", "Calling it", "“Echo” · Super + A"], ["refresh", "Conversation", "Listens 8 s for a reply"],
    ["check-c", "Tasks", "Small changes only", true], ["shield", "Privacy", "Asks before searching the web"], ["history", "History", "Not saved"],
    ["book", "Personal dictionary", "14 words"], ["spark", "Helpers", "Claude Code · DuckDuckGo"], ["keyboard", "Keys", "Super + A · hold Super + Ctrl"],
  ];
  const LEVELS = [
    ["Asks before any change", "You approve every step that changes something.", [["Look up the weather", 1], ["Open Music", 0], ["Rename a file", 0], ["Empty the Trash", 0]]],
    ["Small changes only", "Opens apps and changes small things; asks before anything big.", [["Look up the weather", 1], ["Open Music", 1], ["Rename a file", 1], ["Empty the Trash", 0]], true],
    ["Everything allowed", "Does whatever Permissions allows, without stopping.", [["Look up the weather", 1], ["Open Music", 1], ["Rename a file", 1], ["Empty the Trash", 1]]],
  ];
  const bCtl = () => `<div class="as-parts">${PARTS.map(([ic, n, v, on]) => `<div class="as-part ${on ? "on" : ""}"><span class="lic" style="--tc:var(--sec-assistant)">${icon(ic)}</span><div class="tx"><b>${n}</b><span>${v}</span></div>${icon("chev-r", "cv")}</div>`).join("")}</div>
    <div class="as-doc">${icon("wrench")}<div><b>Run a check-up</b><span>Models, sound, browser and search</span></div>${btn("Check", "sm")}</div>`;
  const bPv = () => `
    ${pvhead("Tasks", "Requests that take several steps, like “tidy my Downloads folder”.", btn("Permissions", "sm ghost", "external"))}
    <div class="as-lad">${LEVELS.map(([t, d, ex, on]) => `<div class="as-lv card ${on ? "on" : ""}"><div class="lh">${radio(on)}<b>${t}</b></div><span class="ld">${d}</span><div class="lx">${ex.map(([x, ok]) => `<span class="${ok ? "ok" : "ask"}">${icon(ok ? "check" : "info")}${x}</span>`).join("")}</div></div>`).join("")}</div>
    ${ocard("Limits for one task", [
      orow("Steps", "The most actions one request may take.", sl(36, "12", 150), o("list")),
      orow("Time", "Waiting for your answer doesn't count.", sl(20, "2 min", 150), o("clock")),
    ], { cls: "icons as-lim" })}
    <div class="card as-run"><div class="rh"><b>A task with these limits</b><span>“Tidy my Downloads folder” · 5 of 12 steps · 38 s</span></div>
      <div class="dots">${Array.from({ length: 12 }, (_, i) => `<i class="${i < 4 ? "done" : i === 4 ? "ask" : ""}"></i>`).join("")}</div>
      <div class="rl"><span>${icon("check")}Found 31 old files</span><span class="ask">${icon("info")}Asks you: move them to the Trash?</span></div></div>
    ${pvfoot("Commands Echo writes itself always ask first, whatever the level.", "shield", '<span class="lnk">What it may touch is on Permissions</span>')}`;

  /* ── C: where your words go ──────────────────────────────────────── */
  const cCtl = () => `
    ${ocard("Privacy", [
      orow("Listen for “Echo”", "The microphone stays on while it waits; what it hears stays here.", sw(true), o("mic")),
      orow("Use my location", "For the weather: finds your city from your internet address.", sw(true), o("compass")),
      orow("Search the web", "", seg(["Ask", "Allow", "Off"], "Ask"), o("globe")),
    ], { first: true, cls: "icons" })}
    ${ocard("History", [
      orow("Save conversations", "So you can search them later. Kept on this computer.", sw(false), o("history")),
      orow("Keep for", "Also task records and undo copies.", dd("30 days"), o("calendar")),
      orow("Room for undo copies", "Copies of files it changed, so you can undo.", dd("512 MB"), o("drive")),
    ], { cls: "icons" })}
    ${ocard("", [
      orow("Delete everything it has kept", "Conversations, task records and undo copies.", btn("Delete…", "sm"), o("trash")),
      nrow("Look into a problem", "Record what it hears for 10 minutes", "", o("wrench")),
    ], { cls: "icons" })}`;

  const flowNode = (ic, t, s, c = "") => `<div class="as-fn ${c}"><span class="fi">${icon(ic)}</span><div><b>${t}</b><span>${s}</span></div></div>`;
  const cPv = () => `
    ${pvhead("Where your words go", "Everything Echo hears and says, and what leaves Atlas.", chip("2 things leave", "acc"))}
    <div class="as-flow">
      <div class="as-here card">
        <div class="fh">${icon("laptop")}<b>Stays on Atlas</b></div>
        ${flowNode("mic", "Microphone", "Waits for “Echo”")}
        ${flowNode("note", "Speech to text", "Nyx Voice, on the processor")}
        ${flowNode("cpu", "Language model", "Qwen 3 8B")}
        ${flowNode("volume", "Its voice", "Sarah, on this computer")}
        ${flowNode("history", "History", "Not saved", "off")}
      </div>
      <div class="as-wire">${[["ask", "Asks first"], ["on", "On"], ["off", "When you ask"]].map(([c, l]) => `<span class="${c}"><em>${l}</em></span>`).join("")}</div>
      <div class="as-out">
        ${flowNode("globe", "Web search", "DuckDuckGo · your question", "ask")}
        ${flowNode("compass", "Your city", "ipapi.co · your internet address", "on")}
        ${flowNode("code", "Coding agent", "Claude Code · only for coding help", "idle")}
      </div>
    </div>
    <div class="card as-kept"><div class="kh"><b>What it has kept</b><span>Kept for 30 days</span></div>
      ${[["Conversations", "None", "History is off"], ["Task records", "23", "The last month"], ["Undo copies", "48 MB", "of 512 MB"]].map(([k, v, s]) => `<div class="kv"><small>${k}</small><b>${v}</b><span>${s}</span></div>`).join("")}</div>
    ${pvfoot("Normal logs keep timings, never what you said or what it answered.", "lock")}`;

  REG("assistant", {
    name: "Assistant",
    summary: "One long column of nine groups: whether Echo runs, two separate privacy groups, who it is, talking, tasks, history, helpers, a whole personal dictionary and its keys. Its state is a row reading “Stopped” with a Start button, and nothing on the page shows what a conversation with these settings is like.",
    problems: [
      "<b>The state is a row like any other:</b> “Echo · Stopped” and a Start button look the same as the settings under them; you can't tell at a glance whether it's listening.",
      "<b>Nine groups in one column:</b> Assistant, Privacy, Who it is, Talking, Tasks, Privacy and storage, Helpers, Personal dictionary and Keys; the dictionary and history search are whole tools squeezed into rows.",
      "<b>Related things far apart:</b> “Listen for Echo” is under Privacy, the names it answers to under Who it is, and its keys at the very bottom (read only); privacy is split into two groups pages apart.",
      "<b>Jargon and long notes:</b> “task/audit records”, “MiB”, “Log content for 10 minutes”, a paragraph about journal entries; three maintenance buttons share one row.",
      "<b>No picture of the settings:</b> “Listen for a reply for 8 s” and “A conversation ends after 120 s” are bare sliders; nothing shows how long it really listens.",
      "<b>Cramped at 800 px:</b> descriptions wrap to two and three lines, and the tabs run off the edge.",
    ],
    today: [["assistant-1280", "Today", ""], ["assistant-800", "Today at 800 px", ""]],
    options: [
      {
        id: "a", name: "Status and a sample conversation",
        idea: "Echo's state opens the page: a glowing orb, Running, the model it uses, Restart and Stop, and the microphone switch. Under it, how you call it and how a conversation goes, each as a short card. On the right, a mini desktop shows the overlay mid-answer and a bar shows how long it keeps listening, so the reply and end-of-conversation sliders have a picture. Tasks, privacy, the dictionary and helpers each open their own page.",
        shots: [["a", "Status and a sample conversation", ""], ["a-800", "At 800 px", "The sample conversation above the controls"]],
      },
      {
        id: "b", name: "Pick a part, see it",
        idea: "The page becomes a list of its parts, each with its current value (Running, “Echo” · Super + A, Small changes only, 14 words). Choosing one shows it on the right with a picture of what it means: Tasks shows the three levels of doing things on its own, with examples of what each one asks about, the step and time limits, and a task running within them. Nothing is more than one click away, and no part is longer than a screen.",
        shots: [["b", "Tasks chosen", "What each level does on its own, and a task inside the limits"]],
      },
      {
        id: "c", name: "Privacy first",
        idea: "The privacy and history settings come first, together, in plain words: listening for its name, location, web search, saved conversations, how long things are kept and the delete button. The picture on the right shows where your words go: what stays on this computer (microphone, speech to text, the model, its voice, history) and the few things that leave it, each with when it happens.",
        shots: [["c", "Where your words go", "What stays on this computer and what leaves it"]],
      },
    ],
    pages: { a: page(() => split(aCtl(), aPv(), { sec: "assistant", ctlw: 440 })), b: page(() => split(bCtl(), bPv(), { sec: "assistant", ctlw: 300 })), c: page(() => split(cCtl(), cPv(), { sec: "assistant", ctlw: 440 })) },
  });
})();
