// NyxOS › Sidebar & Home: the twelve categories (platform/nyxos/layout.rs) and Home
// (sections/home.rs, with nyxos::home_updates: the system generation and updates).
(() => {
  /* ── Sample data ─────────────────────────────────────────────────── */
  const FACTS = [["System", "NyxOS 26.11"], ["Generation", "142 · Tuesday"], ["Kernel", "Linux 6.18.4"], ["Processor", "Ryzen 7 7840U"], ["Memory", "32 GB"], ["Up for", "2 days 4 hours"]];
  const GAUGES = [["Processor", 18, "8 cores", "var(--sw-blue)"], ["Memory", 41, "13 of 32 GB", "var(--sw-violet)"], ["Disk", 86, "68 GB free", "var(--warning)"], ["Battery", 82, "Charging", "var(--success)"], ["Temperature", 52, "CPU package", "var(--sw-coral)", "52°"]];
  const CPU = [0.12, 0.18, 0.15, 0.22, 0.4, 0.31, 0.2, 0.16, 0.14, 0.28, 0.52, 0.36, 0.22, 0.18, 0.2, 0.17, 0.26, 0.19, 0.15, 0.18];
  const NET = [0.05, 0.1, 0.08, 0.3, 0.55, 0.42, 0.2, 0.12, 0.1, 0.35, 0.7, 0.62, 0.3, 0.2, 0.15, 0.12, 0.4, 0.3, 0.18, 0.22];
  const NEEDS = [
    ["download", "system", "NyxOS 26.11.2 is ready", "12 packages and Linux 6.18.5 · builds generation 143", ["Update", "primary sm"]],
    ["mail", "accounts", "Fastmail needs you to sign in", "Work mail and calendar stopped syncing yesterday", ["Sign in", "sm"]],
    ["drive", "hardware", "The disk is 86% full", "14 old generations use 9.2 GB of it", ["Clean up", "sm"]],
  ];

  /* ── Parts ───────────────────────────────────────────────────────── */
  const head = (desc) => `<div class="shead fr-head" style="--sc:var(--sec-home)"><div class="sh1"><span class="sk">Home</span><span class="sp"></span></div><div class="sh2"><b>Atlas</b><span>${desc}</span></div></div>`;
  const home = (desc, body) => win({ hdr: shdr(), side: nside("home"), page: `${head(desc)}${body}` });
  const laptop = () => `<div class="fr-lap"><div class="scr"><span class="bar"></span><span class="w1"></span><span class="w2"></span></div><div class="deck"></div></div>`;
  const facts = (list = FACTS) => `<div class="fr-facts">${list.map(([k, v]) => `<div><small>${k}</small><b>${v}</b></div>`).join("")}</div>`;
  const gauges = () => `<div class="fr-gauges">${GAUGES.map(([n, p, d, c, l]) => `<div class="card gg">${ring(p, { size: 66, c, label: l || p + "%" })}<b>${n}</b><span>${d}</span></div>`).join("")}</div>`;
  const sparkW = (vals, c) => spark(vals, { w: 300, h: 90, c }).replace("<svg ", '<svg preserveAspectRatio="none" ');
  const needs = () => ocard(`Needs you<span class="fr-n">3</span>`, NEEDS.map(([ic, sec, t, d, b]) => orow(t, d, btn(...b), { ic, sec })), { first: true, cls: "icons fr-needs", act: "" });
  const quick = (stack) => ocard("Quick settings", [
    orow("Do not disturb", "Silence notifications until you turn it back on", sw(false), { ic: "bell", sec: "desktop" }),
    stack ? orow("Power profile", seg(["Saver", "Balanced", "Performance"], "Balanced"), "", { ic: "battery", sec: "hardware", cls: "fr-pp" })
      : orow("Power profile", "Right now", seg(["Saver", "Balanced", "Performance"], "Balanced"), { ic: "battery", sec: "hardware" }),
  ], { cls: "icons" });
  const actions = () => `<div class="fr-acts">${[["lock", "Lock"], ["refresh", "Restart"], ["power", "Shut down"]].map(([ic, t]) => `<span class="fa ${ic === "lock" ? "" : "dz"}">${icon(ic)}${t}</span>`).join("")}</div>`;
  const pc = (o = {}) => `<div class="card fr-pcw"><div class="fr-pc"><span class="orb"></span><div class="tx"><b>Atlas</b><span>Framework Laptop 13 · NyxOS 26.11</span></div>${o.end || chip("142", "acc", "layers")}</div>${o.facts ? `<div class="fr-mini">${facts(o.facts)}</div>` : ""}</div>`;

  /* ── Option A: what needs you, and the computer as the picture ───── */
  const aCtl = () => `${needs()}${quick()}<div class="gtitle">Quick actions</div>${actions()}`;
  const aPv = () => `
    ${pvhead("This computer", "Framework Laptop 13 · up for 2 days 4 hours", `${chip("Generation 142", "acc", "layers")}`)}
    <div class="card fr-hero">${laptop()}${facts()}</div>
    ${gauges()}
    <div class="fr-act2">
      <div class="card spk"><div class="r1"><b>Processor</b><span>18% · last minute</span></div>${sparkW(CPU, "var(--sw-blue)")}</div>
      <div class="card spk"><div class="r1"><b>Network</b><span>↓ 2.1 MB/s · ↑ 180 kB/s</span></div>${sparkW(NET, "var(--sw-teal)")}</div>
    </div>
    ${pvfoot("Generation 142 has run since Tuesday; 14 earlier ones are in the boot menu.", "check-c", `<span class="lnk">Generations ${icon("chev-r")}</span>`)}`;

  /* ── Option B: the generations as the picture ───────────────────── */
  const storage = () => `<div class="gtitle gflex">Storage<span class="sp"></span><span class="note">68 GB free of 512 GB</span></div>
    <div class="card fr-stor"><div class="sbar">${[["System and generations", 41, "var(--sw-red)"], ["Your files", 268, "var(--sw-blue)"], ["Apps and tools", 22, "var(--sw-violet)"], ["Alex Rivera", 113, "var(--sw-teal)"]].map(([, g, c]) => `<b style="flex:${g};background:${c}"></b>`).join("")}<b class="free" style="flex:68"></b></div>
      <div class="slg">${[["System", "41 GB", "var(--sw-red)"], ["Your files", "268 GB", "var(--sw-blue)"], ["Apps", "22 GB", "var(--sw-violet)"], ["Alex", "113 GB", "var(--sw-teal)"]].map(([n, v, c]) => `<span><i style="background:${c}"></i>${n}<small>${v}</small></span>`).join("")}</div></div>`;
  const bCtl = () => `${pc({ facts: [["Processor", "Ryzen 7 7840U"], ["Memory", "32 GB · 41% used"], ["Kernel", "Linux 6.18.4"], ["Up for", "2 days 4 hours"]] })}${quick(true)}${storage()}<div class="gtitle">Quick actions</div>${actions()}`;
  const GENS = () => [
    { n: 143, cls: "next", when: "Ready to build", what: "NyxOS 26.11.2 · 12 packages and Linux 6.18.5", end: btn("Update", "primary sm", "download") },
    { n: 142, cls: "cur", when: "Tuesday 10 November, 09:14", what: "Time zone → Europe/Lisbon · Language → English (UK)", end: `<span class="pill" style="--tc:var(--success)">Running now</span>` },
    { fail: true, when: "Monday 9 November", what: "Turning on Printing didn't build: cups-2.5 couldn't be downloaded. Nothing changed." },
    { n: 141, cls: "sel", when: "Sunday 8 November, 18:40", what: "Added Alex Rivera's account", more: true },
    { n: 140, when: "Thursday 5 November", what: "NyxOS 26.11.1 · 48 packages and Linux 6.18.4" },
    { n: 139, when: "Monday 2 November", what: "Turned on Remote login (SSH) · opened port 22" },
  ];
  const timeline = () => `<div class="fr-tl">${GENS().map((g) => g.fail
    ? `<div class="tn fail"><span class="dot">${icon("x")}</span><div class="tx"><small>${g.when}</small><span>${g.what}</span></div></div>`
    : `<div class="tn ${g.cls || ""}"><span class="dot"></span><div class="tx"><div class="t1"><b>Generation ${g.n}</b><small>${g.when}</small></div><span>${g.what}</span>${g.more ? `<div class="tm">${btn("Go back to 141", "sm", "hist")}<span class="dim">Undoes generation 142's changes; your files stay.</span></div>` : ""}</div>${g.end || ""}</div>`).join("")}
    <div class="tn older"><span class="dot"></span><div class="tx"><span class="lnk">12 older generations, back to 2 October ${icon("chev-r")}</span></div></div></div>`;
  const bPv = () => `
    ${pvhead("Generations", "Every system change is built as a new one; the boot menu can start any of them.", seg(["All", "Updates", "Settings"], "All"))}
    ${timeline()}
    ${pvfoot("Generations older than two weeks use 9.2 GB; Disks can clean them up.", "info", `<span class="lnk">Clean up ${icon("chev-r")}</span>`)}`;

  /* ── Option C: live activity as the picture ──────────────────────── */
  const cores = [0.32, 0.12, 0.45, 0.08, 0.22, 0.6, 0.15, 0.1];
  const cCtl = () => `${pc()}
    ${ocard("", [nrow("3 things need you", "An update, a sign-in and a full disk", "", { ic: "bell", sec: "home" }), nrow("NyxOS 26.11", "Updates and earlier generations", "142", { ic: "download", sec: "system" })], { cls: "icons" })}
    ${quick(true)}<div class="gtitle">Quick actions</div>${actions()}`;
  const cPv = () => `
    ${pvhead("Right now", "The last minute, updated every second while Home is open.", seg(["1 min", "10 min", "1 hour"], "1 min"))}
    <div class="fr-big card"><div class="r1"><b>Processor</b><span class="v">18%</span><span class="sp"></span><span class="lg"><i style="background:var(--sw-blue)"></i>All cores</span></div>
      ${spark(CPU.concat(CPU.slice(0, 10)), { w: 560, h: 180, c: "var(--sw-blue)" }).replace("<svg ", '<svg preserveAspectRatio="none" ')}
      <div class="cores">${cores.map((v, i) => `<span><small>${i + 1}</small>${prog(v * 100)}</span>`).join("")}</div></div>
    <div class="fr-act2">
      <div class="card spk"><div class="r1"><b>Memory</b><span>13 GB of 32 GB · swap 0</span></div>${sparkW([0.4, 0.41, 0.41, 0.42, 0.4, 0.41, 0.43, 0.44, 0.42, 0.41, 0.41, 0.42, 0.41, 0.4, 0.41, 0.41, 0.42, 0.41, 0.41, 0.41], "var(--sw-violet)")}</div>
      <div class="card spk"><div class="r1"><b>Network</b><span>↓ 2.1 MB/s · ↑ 180 kB/s</span></div>${sparkW(NET, "var(--sw-teal)")}</div>
    </div>
    <div class="fr-strip">${GAUGES.slice(2).map(([n, p, d, c, l]) => `<div class="card st">${ring(p, { size: 50, c, label: l || p + "%" })}<div><b>${n}</b><span>${d}</span></div></div>`).join("")}</div>`;

  const D = "This computer at a glance, and what needs you.";
  REG("nyxos-frame", {
    name: "Sidebar & Home",
    summary: "On NyxOS, Settings' sidebar is twelve categories (Accounts, Appearance, Displays, Desktop, Input, Network, Sound, Power, Security, Apps & Defaults, Storage & Backup, System), in the colours of the groups they come from, with Home above them. Home is the computer card with its facts and a Generation badge, Quick settings, five gauges, an Activity section, Storage, an Updates row that opens Updates, and Lock, Restart and Shut down. It's long, and the one NyxOS part (the generation) is a number in a badge.",
    problems: [
      "<b>The generation is a bare number:</b> the hero's badge says “Generation” over a number, with nothing about when it was built, what changed in it, or that there are earlier ones to go back to.",
      "<b>Nothing says what needs you:</b> a waiting update is one row near the foot (“NyxOS … Open”), below the gauges, Activity and Storage; an account that stopped syncing or a nearly full disk isn't mentioned.",
      "<b>Omarchy's facts on NyxOS:</b> the hero lists Hyprland's version beside the kernel; on NyxOS it should be the system's version and generation (the today shots were taken on an Omarchy laptop, so they show Omarchy's).",
      "<b>A long page of equals:</b> gauges, four charts, a disk list and quick actions all have the same weight; at 800 px the facts are cut to “4.5.0rc…” and “Intel Co…”.",
      "<b>Sidebar subtitles that trail off:</b> each category lists its first pages (“Printers, ASUS, Aura Lig…”, “Keyboard Shortcuts, Ke…”), cut at the sidebar's width, and Home's badge doesn't say what it counts.",
    ],
    today: [
      ["nyxos-home-1280", "Home today", "Taken on a laptop without NyxOS's System Manager, so the badge has no generation and the facts are Omarchy's; the layout is the real one."],
      ["nyxos-home-800", "At 800 px", "The facts are cut short and the gauges wrap"],
    ],
    options: [
      { id: "a", name: "What needs you, and the computer", idea: "The left column starts with what needs you, each with its own button (an update ready to build, an account to sign in to again, a disk to clean up), then Quick settings and Quick actions. The picture is the computer itself: a drawing with its facts (NyxOS's version and generation, not Hyprland's), five gauges, and the last minute of processor and network. A line at the foot says how long this generation has run and how many earlier ones the boot menu keeps.",
        shots: [["a-home", "Home", "Three things need you; the computer beside them"], ["a-home-800", "At 800 px", "The computer above what needs you"]] },
      { id: "b", name: "A timeline of generations", idea: "The picture is the system's history: the update waiting to become generation 143 at the top, the one running now, and the earlier ones, each saying what changed in it (an update, a time zone, a new person). A build that failed shows where it happened and that nothing changed. Choosing one shows what going back to it would undo. The computer, Quick settings, storage and Quick actions are on the left.",
        shots: [["b-generations", "Generations", "142 is running; going back to 141 would undo it"], ["b-generations-800", "At 800 px", "The timeline above the computer"]] },
      { id: "c", name: "Live activity", idea: "For people who keep Home open to watch the computer: the picture is a small system monitor, the last minute of the processor with every core, memory and network, and the disk, battery and temperature underneath. What needs you shrinks to one row that opens the list; updates and generations are one row too.",
        shots: [["c-activity", "Right now", "A system monitor as Home's picture"]] },
    ],
    pages: {
      "a-home": () => home(D, split(aCtl(), aPv(), { sec: "home", cls: "fr", ctlw: 450 })),
      "b-generations": () => home(D, split(bCtl(), bPv(), { sec: "home", cls: "fr", ctlw: 420 })),
      "c-activity": () => home(D, split(cCtl(), cPv(), { sec: "home", cls: "fr", ctlw: 420 })),
    },
  });
})();
