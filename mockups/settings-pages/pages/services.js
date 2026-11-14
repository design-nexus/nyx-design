// System › Services: background services (systemd units) for you and for the whole computer.
// Style B: the services on the left, a picture of what they're doing on the right.
(() => {
  const S = "system";
  const P = ["system", "Services", "What runs in the background, and what starts by itself."];
  const page = (body) => () => swin({ sec: P[0], page: P[1], desc: P[2], body: body() });

  /* ── Sample data: [friendly name, unit, state, starts, memory MB] ── */
  const MINE = [
    ["File sync", "syncthing", "fail", "sign-in", 0],
    ["Sound server", "pipewire", "run", "sign-in", 38],
    ["Sound sessions", "wireplumber", "run", "sign-in", 21],
    ["Idle and lock timer", "hypridle", "run", "sign-in", 6],
    ["App launcher", "walker", "run", "sign-in", 64],
    ["Clipboard history", "nyx-clipboard", "run", "sign-in", 12],
    ["Local AI models", "ollama", "stop", "", 0],
  ];
  const SYSTEM = [
    ["Network", "NetworkManager", "run", "boot", 18],
    ["Bluetooth", "bluetooth", "run", "boot", 5],
    ["Private network", "tailscaled", "run", "boot", 44],
    ["Power profiles", "power-profiles-daemon", "run", "boot", 9],
    ["Containers", "docker", "run", "boot", 96],
    ["Printing", "cups", "stop", "", 0],
    ["Remote login", "sshd", "stop", "", 0],
  ];
  const STATE = { run: "Running", stop: "Off", fail: "Stopped with an error" };

  /* ── Small parts ─────────────────────────────────────────────────── */
  const dot = (st) => `<span class="sv-dot ${st}"></span>`;
  const startsTxt = (s) => (s === "sign-in" ? "At sign-in" : s === "boot" ? "At start-up" : "");
  const urow = ([n, u, st, starts], o = {}) => `<div class="opt sv-u ${o.sel ? "picked" : ""}">${dot(st)}<div class="opt-text"><div>${n}</div><div class="d mono">${u}</div></div>${o.end !== undefined ? o.end : `<span class="rv">${st === "fail" ? '<b class="sv-bad">Error</b>' : startsTxt(starts) || "Off"}</span>`}</div>`;

  /* ═══ A: list and a detail panel ═════════════════════════════════════ */
  const aCtl = () => `
    <div class="sv-top"><div class="field sv-find">${icon("search")}<span class="ph">Find a service</span></div>${seg(["Yours", "System"], "Yours")}</div>
    ${ocard(`Needs attention`, [urow(MINE[0], { sel: true })], { cls: "sv-attn" })}
    ${ocard("Your services", MINE.slice(1).map((u) => urow(u)), { note: "6 running" , act: "" })}
    ${ocard("", [nrow("System services", "Changing them asks for your password", "64", { ic: "server", sec: S })], { cls: "icons" })}`;

  // A week of states for a long-running service: each day [start%, end%, state].
  const WEEK = [
    ["Thu", [[0, 37, "off"], [37, 100, "run"]]],
    ["Fri", [[0, 100, "run"]]],
    ["Sat", [[0, 100, "run"]]],
    ["Sun", [[0, 44, "run"], [44, 46, "fail"], [46, 100, "run"]]],
    ["Mon", [[0, 100, "run"]]],
    ["Tue", [[0, 100, "run"]]],
    ["Today", [[0, 38, "off"], [38, 55, "run"], [55, 56.5, "fail"], [56.5, 58, "off"]]],
  ];
  const week = () => `<div class="sv-week">${WEEK.map(([d, segs]) => `<div class="sv-day"><span>${d}</span><div class="sv-bar">${segs.map(([a, b, st]) => `<i class="${st}" style="left:${a}%;width:${b - a}%"></i>`).join("")}${d === "Today" ? '<em class="sv-now" style="left:58%"></em>' : ""}</div></div>`).join("")}
      <div class="sv-day sv-hours"><span></span><div>${["0:00", "6:00", "12:00", "18:00", "24:00"].map((h) => `<small>${h}</small>`).join("")}</div></div></div>`;

  const LOG = [
    ["09:14:02", "Started File sync."],
    ["09:14:03", "My name is “Atlas”; listening on port 22000"],
    ["09:14:04", "Ready to sync “Documents” and “Photos”"],
    ["11:52:40", "Device “Sam's phone” connected"],
    ["13:20:05", "Folder “Photos” isn't making progress: folder path missing", "warn"],
    ["13:20:06", "Main process exited, code=exited, status=1/FAILURE", "bad"],
    ["13:20:06", "syncthing.service: Failed with result 'exit-code'.", "bad"],
  ];
  const log = (lines) => `<div class="sv-log mono">${lines.map(([t, m, c]) => `<div class="${c || ""}"><span>${t}</span>${m}</div>`).join("")}</div>`;

  const aPv = () => `
    ${pvhead("File sync", "syncthing · runs as you · starts when you sign in", `<span class="pill dot" style="--tc:var(--danger)">Stopped with an error</span>`)}
    <div class="card sv-why"><span class="lic" style="--tc:var(--danger)">${icon("warn")}</span><div class="opt-text"><b>The Photos folder couldn't be found</b><span>It stopped at 13:20 after running for 4 hours. If Photos is on a drive that isn't plugged in, plug it in and start it again.</span></div><div class="sv-bts">${btn("Start", "primary sm", "play")}${btn("Turn off", "sm")}</div></div>
    <div class="card sv-hist"><div class="sv-ch"><b>The last 7 days</b><span class="sv-leg"><i class="run"></i>Running<i class="fail"></i>Error<i class="off"></i>Off</span></div>${week()}</div>
    <div class="card sv-logc"><div class="sv-ch"><b>Recent messages</b><span class="lnk">Full log ${icon("external")}</span></div>${log(LOG)}</div>`;

  /* ═══ B: what starts by itself, and what's running now ═══════════════ */
  const swrow = ([n, u, st, starts]) => urow([n, u, st, starts], { end: sw(!!starts || st === "fail") });
  const bCtl = () => `
    <div class="field sv-find">${icon("search")}<span class="ph">Find a service</span></div>
    ${ocard("Starts when you sign in", [MINE[0], MINE[1], MINE[4], MINE[5], MINE[6]].map(swrow), { note: "Yours" })}
    ${ocard("Starts with the computer", [SYSTEM[0], SYSTEM[2], SYSTEM[4], SYSTEM[5]].map(swrow), { note: "Asks for your password", act: "" })}`;

  const BOARD = [
    ["Containers", "docker", 96, [0.2, 0.3, 0.25, 0.6, 0.4, 0.35, 0.5, 0.45, 0.3, 0.7, 0.5, 0.4], "sys"],
    ["App launcher", "walker", 64, [0.1, 0.1, 0.4, 0.1, 0.05, 0.2, 0.1, 0.1, 0.3, 0.1, 0.1, 0.15], "you"],
    ["Private network", "tailscaled", 44, [0.1, 0.15, 0.1, 0.12, 0.1, 0.1, 0.14, 0.1, 0.1, 0.12, 0.1, 0.1], "sys"],
    ["Sound server", "pipewire", 38, [0.3, 0.35, 0.32, 0.3, 0.4, 0.38, 0.35, 0.3, 0.33, 0.36, 0.3, 0.34], "you"],
    ["Sound sessions", "wireplumber", 21, [0.05, 0.05, 0.06, 0.05, 0.05, 0.08, 0.05, 0.05, 0.05, 0.06, 0.05, 0.05], "you"],
    ["Network", "NetworkManager", 18, [0.05, 0.1, 0.05, 0.05, 0.2, 0.05, 0.05, 0.05, 0.1, 0.05, 0.05, 0.05], "sys"],
    ["Clipboard history", "nyx-clipboard", 12, [0.02, 0.1, 0.02, 0.02, 0.15, 0.02, 0.02, 0.08, 0.02, 0.02, 0.02, 0.02], "you"],
    ["Power profiles", "power-profiles-daemon", 9, [0.02, 0.02, 0.02, 0.02, 0.02, 0.02, 0.02, 0.02, 0.02, 0.02, 0.02, 0.02], "sys"],
  ];
  const bPv = () => `
    ${pvhead("Running now", "41 services · 412 MB of memory · updated every 2 seconds", seg(["Memory", "Processor"], "Memory"))}
    <div class="card sv-board">
      <div class="sv-bh"><span>Service</span><span>Last minute</span><span>Memory</span><span></span></div>
      ${BOARD.map(([n, u, mb, cpu, who], i) => `<div class="sv-br ${i === 0 ? "sel" : ""}"><span class="sv-bn">${dot("run")}<span class="sv-bt"><b>${n}</b><small class="mono">${u}</small></span></span><span class="sv-bs">${spark(cpu, { w: 120, h: 22, c: who === "you" ? "var(--sw-teal)" : "var(--sw-blue)" })}</span><span class="sv-bm"><span class="prog"><b style="width:${(mb / 96) * 100}%"></b></span><small>${mb} MB</small></span><span class="sv-ba">${i === 0 ? `${btn("Restart", "sm")}${btn("Stop", "sm")}` : ""}</span></div>`).join("")}
      <div class="sv-br more"><span class="dim">33 more, under 8 MB each</span></div>
    </div>
    <div class="sv-legend"><span><i style="background:var(--sw-teal)"></i>Yours</span><span><i style="background:var(--sw-blue)"></i>The computer's</span><span class="sp"></span><span class="dim">File sync stopped with an error · ${"<span class=\"lnk\">See why</span>"}</span></div>`;

  /* ═══ C: start-up, in order ══════════════════════════════════════════ */
  // [name, unit, start s, length s, slow?]
  const BOOT = [
    ["Disks and files", "systemd-fsck", 0.2, 0.6],
    ["Network", "NetworkManager", 0.9, 0.7],
    ["Bluetooth", "bluetooth", 1.0, 0.4],
    ["Power profiles", "power-profiles-daemon", 1.1, 0.3],
    ["Wait for the network", "NetworkManager-wait-online", 1.6, 2.4, true],
    ["Private network", "tailscaled", 1.7, 0.9],
    ["Containers", "docker", 2.2, 3.1, true],
    ["Sign-in screen", "greetd", 5.4, 0.5],
    ["Your desktop", "hyprland", 7.1, 1.1],
    ["Sound and sync", "pipewire, syncthing", 7.6, 0.8],
  ];
  const BT = 9.5;
  const cPv = () => `
    ${pvhead("This morning's start-up", "From power on to your desktop in 8.2 seconds", seg(["Start-up", "Sign-in"], "Start-up"))}
    <div class="card sv-gantt">
      <div class="sv-gx">${[0, 2, 4, 6, 8].map((s) => `<small style="left:${(s / BT) * 100}%">${s} s</small>`).join("")}</div>
      ${BOOT.map(([n, u, a, l, slow], i) => `<div class="sv-gr ${slow ? "slow" : ""} ${i === 6 ? "sel" : ""}"><span class="sv-gn">${n}</span><div class="sv-gt"><i style="left:${(a / BT) * 100}%;width:${(l / BT) * 100}%"></i>${slow ? `<em style="left:${((a + l) / BT) * 100}%">${l} s</em>` : ""}</div></div>`).join("")}
      <div class="sv-gline" style="left:calc(166px + (100% - 182px) * ${8.2 / BT})"><span>Desktop ready</span></div>
    </div>
    <div class="card sv-tip"><span class="lic" style="--tc:var(--sw-amber)">${icon("clock")}</span><div class="opt-text"><b>Containers add 3.1 seconds</b><span>Docker starts with the computer but you used it twice this week. Start it only when something asks for it?</span></div>${btn("Start when needed", "sm")}</div>`;

  const crow = ([n, u, a, l, slow], on = true) => `<div class="opt sv-u ${u === "docker" ? "picked" : ""}">${dot(on ? "run" : "stop")}<div class="opt-text"><div>${n}</div><div class="d mono">${u}</div></div><span class="rv ${slow ? "sv-slow" : ""}">${on ? l.toFixed(1) + " s" : "Off"}</span>${sw(on)}</div>`;
  const cCtl = () => `
    ${ocard("Starts with the computer", [BOOT[6], BOOT[4], BOOT[5], BOOT[1], BOOT[2]].map((b) => crow(b)).concat([crow(["Printing", "cups", 0, 0], false), crow(["Remote login", "sshd", 0, 0], false)]), { first: true, note: "Slowest first" })}
    ${ocard("", [nrow("Starts when you sign in", "Sound, sync, the launcher and 4 more", "1.4 s", { ic: "user", sec: S }), nrow("Every service", "Start, stop and read the log of any of them", "64", { ic: "server", sec: S })], { cls: "icons" })}`;

  REG("services", {
    name: "Services",
    icons: {},
    summary: "Services lists every background service in long cards: Needs attention first, then yours, then the system's, folded. Each is a technical unit name with a running tag and up to three buttons, twenty at a time behind a search box that needs Enter.",
    problems: [
      "<b>Unit names, not what they do:</b> rows lead with names like <tt>app-geoclue\\x2ddemo\\x2dagent@autostart</tt>; the plain description is the small line under it.",
      "<b>A wall of buttons:</b> every row carries Stop, Restart and Disable, so a card of twenty services is sixty buttons, and Disable means “don't start at boot”, which the page never says.",
      "<b>No way to see why one failed:</b> Needs attention shows “failed” and a Start button; there's no log, no time, no hint of what went wrong.",
      "<b>Nothing about what it's doing:</b> no memory, no history, no sense of which services slow the start-up or keep restarting.",
      "<b>“Starts at boot” hides in the description,</b> after the dot; whether a service starts by itself is the main thing you'd change, and it's the least visible.",
      "<b>Search needs Enter</b> and shows at most twenty; at 800 px the three buttons crowd the text so descriptions wrap.",
    ],
    today: [["services-1280", "Today", ""], ["services-800", "Today at 800 px", ""]],
    options: [
      { id: "a", name: "List and a detail panel",
        idea: "Services are listed by what they do, with the unit name small underneath and a dot for running, off or failed; anything that failed sits on top. Selecting one shows it on the right: why it stopped in plain words, Start and Turn off, a week of when it ran, and its recent messages from the log.",
        shots: [["a-detail", "File sync failed", "Why it stopped, the last 7 days and its log"], ["a-detail-800", "At 800 px", "The detail above the list"]] },
      { id: "b", name: "What starts by itself, and what's running",
        idea: "The left column is the thing people change: a switch per service for whether it starts by itself, split into yours (at sign-in) and the computer's (at start-up, asks for your password). The right shows what's running now and what each costs, with a minute of processor use and its memory, biggest first; Restart and Stop appear on the selected one.",
        shots: [["b-board", "Running now", "Memory per service; Docker selected"]] },
      { id: "c", name: "Start-up, in order",
        idea: "Built around one question: what slows the computer down when it starts? The right side draws this morning's start-up as bars in time, from power on to your desktop, with the slow ones marked. The left lists what starts with the computer, slowest first, each with its time and a switch, and a suggestion for the worst one.",
        shots: [["c-boot", "This morning's start-up", "Docker and waiting for the network take the longest"]] },
    ],
    pages: {
      "a-detail": page(() => split(aCtl(), aPv(), { sec: S })),
      "b-board": page(() => split(bCtl(), bPv(), { sec: S, ctlw: 400 })),
      "c-boot": page(() => split(cCtl(), cPv(), { sec: S })),
    },
  });
})();
