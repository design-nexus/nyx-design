// Activity › Processes: a second pass on Processes as apps and what they run (revamp E).
(() => {
  const cpuBar = (v) => `<span class="pr-cbar"><b style="width:${Math.min(100, v * 1.6)}%"></b></span><span class="pr-num">${v.toFixed(1)}%</span>`;
  // [name, colour, cpu, memory, disk, gpu, processes, windows, note]
  const APPS = [
    ["Blender", "amber", 41.2, "3.8 GB", "12 MB/s", "62%", 3, 1],
    ["Foot", "graphite", 3.7, "4.6 GB", "–", "–", 17, 3],
    ["Firefox", "coral", 2.4, "1.0 GB", "1.2 MB/s", "4%", 15, 2],
    ["Code - OSS", "blue", 1.1, "1.4 GB", "–", "1%", 9, 1],
  ];
  const BG = [["Hyprland", "teal", 8.2, "2.0 GB", "–", "6%", 4], ["PipeWire", "violet", 2.1, "35 MB", "–", "–", 3], ["Quickshell", "green", 0.4, "108 MB", "–", "1%", 1], ["nyx-dock", "blue", 0.2, "12 MB", "–", "–", 2]];
  const SYS = [["systemd", "graphite", 0.2, "8.6 MB", "–", "–", 2], ["NetworkManager", "green", 0.1, "22 MB", "–", "–", 1]];
  const head = (o = {}) => `<div class="pr-h"><span class="pr-tw"></span><span class="nm">Name</span><span class="c cpu">CPU ${icon("chev-d")}</span><span class="c">Memory</span>${o.narrow ? "" : `<span class="c w">Disk</span><span class="c w">GPU</span>`}</div>`;
  const row = ([n, c, cpu, mem, disk, gpu, procs, wins], o = {}) => `<div class="pr-r ${o.sel ? "sel" : ""}">
    <span class="pr-tw">${procs > 1 ? icon(o.open ? "chev-d" : "chev-r") : ""}</span>${uic(n, c)}<span class="nm"><b>${n}</b>${wins > 1 ? `<span>${wins} windows · ${procs} processes</span>` : procs > 1 ? `<span>${procs} processes</span>` : ""}</span>
    <span class="c cpu">${cpuBar(cpu)}</span><span class="c">${mem}</span>${o.narrow ? "" : `<span class="c w">${disk}</span><span class="c w">${gpu}</span>`}</div>`;
  const kid = ([n, pid, cpu, mem], o = {}) => `<div class="pr-r kid"><span class="pr-tw"></span><span class="pr-kl"></span><span class="nm"><span class="k">${n}</span><span>PID ${pid}</span></span><span class="c cpu"><span class="pr-num">${cpu.toFixed(1)}%</span></span><span class="c">${mem}</span>${o.narrow ? "" : `<span class="c w">–</span><span class="c w">–</span>`}</div>`;
  const gh = (t, sw, n) => `<div class="pr-gh" style="--sc: var(--${sw === "accent" ? "accent" : "sw-" + sw})"><b>${t}</b><span>${n}</span></div>`;
  const list = (o = {}) => `${head(o)}<div class="scroll pr-list">
    ${gh("Apps", "accent", 4)}${APPS.map((a, i) => row(a, { sel: o.sel && i === 0, open: o.open && i === 0, narrow: o.narrow }) + (o.open && i === 0 ? [["blender", "4211", 38.9, "3.6 GB"], ["blender-softwaregl", "4230", 2.1, "180 MB"], ["python3.12", "4262", 0.2, "42 MB"]].map((k) => kid(k, o)).join("") : "")).join("")}
    ${gh("Background", "green", 63)}${BG.map((a) => row(a, { narrow: o.narrow })).join("")}
    ${gh("System", "violet", 642)}${SYS.map((a) => row(a, { narrow: o.narrow })).join("")}</div>`;
  const tool = (o = {}) => `<div class="pr-tool">${seg(["Apps", "All", "Mine"], "Apps")}<div class="field pr-filter">${icon("filter")}<span class="ph">Filter by name, command or PID</span></div><span class="sp"></span>${NARROW ? "" : `<span class="pr-tot">709 processes · 2,312 threads</span>`}${o.end || ""}</div>`;
  const insp = () => `<aside class="insp pr-insp">
    <div class="ihead"><div class="pr-ih">${uic("Blender", "amber")}<div><b>Blender</b><span>3 processes · you · since 14:02</span></div></div></div>
    <div class="ibody">
      <div class="lab">Processor <span class="cnt">41.2%</span></div><div class="card pr-gc">${gline(series(1, 40, .45, .25), "var(--sw-amber)", 46)}</div>
      <div class="lab">Memory <span class="cnt">3.8 GB</span></div><div class="card pr-gc">${gline(series(2, 40, .6, .1), "var(--sw-violet)", 46)}</div>
      <div class="lab">About it</div>
      <div class="card">${kv([["Started", "Today 14:02"], ["Threads", "48"], ["Disk", "12 MB/s write"], ["GPU", "62% · 3.1 GB"], ["Connections", "2 open"], ["Command", "blender ~/Renders/harbour.blend"]])}</div>
    </div>
    <div class="ifoot">${btn("Switch to", "", "window")}${ib("pause", "Pause")}${ib("more", "Priority, open location, copy command, force quit")}<span class="grow"></span>${btn("End task", "danger")}</div></aside>`;

  /* A: one row per app (Foot once, with its windows), every column back, and no inspector until
     something is chosen: the list has the whole width; choosing an app opens it on the right. */
  const pageA = (o = {}) => `${tool()}<div class="cols"><div class="main">${list({ sel: o.sel, open: o.sel, narrow: NARROW })}</div>${o.sel && !NARROW ? insp() : ""}</div>
    ${o.sel && NARROW ? `<div class="pr-foot">${uic("Blender", "amber")}<div class="tx"><b>Blender</b><span>3 processes · 41% CPU · 3.8 GB</span></div>${btn("Switch to", "", "window")}${btn("End task", "danger")}</div>` : ""}`;

  /* B: the inspector stays, and with nothing chosen it says how the machine is doing: where the
     processor and memory go by group, the busiest, and what's new since you opened Activity. */
  const summary = () => `<aside class="insp pr-insp">
    <div class="ihead"><b class="pr-st">709 processes</b><span class="pr-ss">2,312 threads · you run 64 of them</span></div>
    <div class="ibody">
      <div class="lab">Processor by group</div><div class="card pr-sum">${stack([[46, "var(--accent)", "Apps", "48%"], [11, "var(--sw-green)", "Background", "11%"], [2, "var(--sw-violet)", "System", "2%"]])}</div>
      <div class="lab">Memory by group</div><div class="card pr-sum">${stack([[34, "var(--accent)", "Apps", "10.8 GB"], [8, "var(--sw-green)", "Background", "2.4 GB"], [6, "var(--sw-violet)", "System", "1.9 GB"]])}</div>
      <div class="lab">Started since you opened Activity</div>
      <div class="card">${kv([["ffmpeg", "4 min ago"], ["blender-softwaregl", "6 min ago"], ["python3.12", "6 min ago"]])}</div>
    </div></aside>`;
  const pageB = () => `${tool()}<div class="cols"><div class="main">${list({ narrow: false })}</div>${summary()}</div>`;

  /* C: by what started it: Hyprland's 145 processes are the apps you opened, so each gets its own
     row; a tree view shows who started whom. */
  const TREE = [["Hyprland", "teal", 0, 8.2, "2.0 GB"], ["Foot", "graphite", 1, 3.7, "4.6 GB", "3 windows"], ["fish", "graphite", 2, 0.1, "12 MB"], ["nvim", "green", 3, 0.6, "180 MB"], ["Firefox", "coral", 1, 2.4, "1.0 GB", "2 windows"], ["Blender", "amber", 1, 41.2, "3.8 GB"], ["Code - OSS", "blue", 1, 1.1, "1.4 GB"], ["Quickshell", "green", 1, 0.4, "108 MB"]];
  const pageC = () => `${tool({ end: seg(["List", "Tree"], "Tree") })}<div class="cols"><div class="main"><div class="pr-h"><span class="nm">Started by</span><span class="c cpu">CPU</span><span class="c">Memory</span></div><div class="scroll pr-list">
    ${TREE.map(([n, c, d, cpu, mem, sub], i) => `<div class="pr-r tree ${i === 5 ? "sel" : ""}" style="--d:${d}"><span class="pr-ind"></span>${d < 3 ? icon("chev-d", "tw") : `<span class="tw"></span>`}${uic(n, c)}<span class="nm"><b>${n}</b>${sub ? `<span>${sub}</span>` : ""}</span><span class="c cpu">${cpuBar(cpu)}</span><span class="c">${mem}</span></div>`).join("")}
  </div></div>${insp()}</div>`;

  REG("processes", {
    name: "Processes",
    summary: "Processes as apps (E) is built: apps, background and system under their own headings, an app opening into its processes. On a real machine the grouping shows its gaps: terminal windows are separate apps, Hyprland owns everything it started, and an empty inspector takes a third of the width.",
    problems: [
      "<b>Foot is three apps</b>, one per window, each with its own processes, so the list reads Foot, Foot, Foot.",
      "<b>Hyprland has 145 processes</b> under it in Background, because every app you open from it counts as its child.",
      "<b>pipewire appears twice</b>, once as an app and once inside PipeWire.",
      "<b>Only CPU and Memory</b> are shown; Disk and GPU went when the window got narrower, and there's no way to bring them back.",
      "<b>The inspector is empty</b> until you choose something (“Choose an app or process to see its graphs”), and takes a third of the width meanwhile.",
    ],
    today: [["processes-1280", "Today at 1280 px", "Foot three times; an empty inspector"], ["processes-800", "Today at 800 px", ""]],
    options: [
      { id: "a", name: "One row per app, full width", idea: "Every app is one row (Foot once: “3 windows · 17 processes”), with CPU, Memory, Disk and GPU back. Nothing is on the right until you choose an app; then its graphs, facts and labelled actions open beside the list. At 800 px the chosen app's actions sit in a bar at the foot.",
        shots: [["a-list", "Processes", "Apps merged, the whole width for the list"], ["a-chosen", "An app chosen", "Blender open, its inspector on the right"], ["a-chosen-800", "At 800 px", "Name, CPU and Memory; actions in a bar below"]] },
      { id: "b", name: "The inspector says how it's going", idea: "The inspector stays, and with nothing chosen it's a summary: how many processes, where the processor and memory go by Apps, Background and System, and what's started since you opened Activity. Choosing an app swaps it for the app's details, as today.",
        shots: [["b-summary", "Nothing chosen", "A summary in the inspector"]] },
      { id: "c", name: "By what started it", idea: "A Tree view groups by what started each app, so Hyprland's 145 processes become the apps you opened from it (Foot with its shells, Firefox, Blender), each with its own numbers. List is the apps view.",
        shots: [["c-tree", "Tree", "Hyprland's children as apps, Blender chosen"]] },
    ],
    pages: {
      "a-list": () => apage("processes", pageA()),
      "a-chosen": () => apage("processes", pageA({ sel: true })),
      "b-summary": () => apage("processes", pageB()),
      "c-tree": () => apage("processes", pageC()),
    },
  });
})();
