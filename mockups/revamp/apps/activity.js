// Nyx Activity on the revamp page: today's problems and three options.
(() => {
  // A smooth made-up series, 0–1, from a seed.
  const series = (seed, n = 40, base = 0.4, amp = 0.25) => Array.from({ length: n }, (_, i) =>
    Math.max(0.02, Math.min(0.98, base + amp * (Math.sin(i * 0.37 + seed) * 0.6 + Math.sin(i * 0.91 + seed * 2.3) * 0.3 + Math.sin(i * 2.1 + seed * 5) * 0.12))));
  // A line graph that stretches to its box.
  const gline = (vals, c = "var(--accent)", h = 44) => spark(vals, { w: 300, h, c })
    .replace("<svg ", `<svg preserveAspectRatio="none" style="width:100%;height:${h}px" `)
    .replace('stroke-width="1.6"', 'stroke-width="1.6" vector-effect="non-scaling-stroke"');
  const aic = (name, c) => `<span class="ac-aic" style="background:var(--sw-${c})">${name[0].toUpperCase()}</span>`;
  const heat = (pct) => `style="background: color-mix(in srgb, var(--accent) ${Math.round(Math.min(pct, 100) * 0.45)}%, transparent)"`;

  // [name, colour, cpu %, mem, disk, gpu %, threads, user, procs]
  const APPS = [
    ["Blender", "amber", 41.2, "3.8 GB", "12 MB/s", 62, 48, "you", 3],
    ["Firefox", "coral", 8.4, "2.1 GB", "1.2 MB/s", 4, 214, "you", 14],
    ["ffmpeg", "green", 6.9, "412 MB", "38 MB/s", 18, 17, "you", 1],
    ["Code - OSS", "blue", 3.1, "1.4 GB", "–", 1, 96, "you", 9],
    ["Hyprland", "teal", 1.8, "310 MB", "–", 6, 22, "you", 1],
    ["PipeWire", "violet", 0.9, "48 MB", "–", 0, 6, "you", 3],
    ["Syncthing", "graphite", 0.6, "96 MB", "420 KB/s", 0, 31, "you", 1],
    ["kitty", "pink", 0.3, "120 MB", "–", 0, 12, "you", 2],
    ["systemd-journald", "graphite", 0.2, "38 MB", "88 KB/s", 0, 1, "root", 1],
    ["mpv", "red", 0.2, "160 MB", "2.1 MB/s", 9, 18, "you", 1],
    ["Xwayland", "blue", 0.1, "72 MB", "–", 1, 8, "you", 1],
    ["NetworkManager", "green", 0.1, "22 MB", "–", 0, 4, "root", 1],
  ];

  const hdr = (o = {}) => header({
    icon: "pulse", name: "Activity",
    center: o.center !== undefined ? o.center : search(o.q || "Find a process or page", "Ctrl K"),
    end: `<button class="ac-live ${o.paused ? "paused" : ""}">${o.paused ? icon("play") : `<span class="dot"></span>`}<span>${o.paused ? "Paused" : "Live · 1 s"}</span></button>`,
  });

  /* ── Option A: the same sidebar, an overview that reads at a glance ─── */
  const sideA = (on = "overview") => `
    ${tiles([["cpu", "cpu", "36%", "CPU", "blue"], ["mem", "memory", "83%", "Memory", "amber"], ["gpu", "gpu", "21%", "GPU", "violet"], ["temp", "thermo", "64°", "CPU temp", "coral"]], "")}
    ${grp("Monitor", false, "", "accent")}
    ${navx("grid", "Overview", { active: on === "overview" })}
    ${navx("listic", "Processes", { active: on === "processes", cnt: 312 })}
    ${grp("Performance", false, "", "green")}
    ${navx("cpu", "CPU", { sub: "36%" })}
    ${navx("memory", "Memory", { sub: "25.5 GB" })}
    ${navx("drive", "Storage", { sub: "50%" })}
    ${navx("wifi", "Network", { sub: "4.1 MB/s" })}
    ${navx("gpu", "GPU", { sub: "21%" })}
    ${navx("thermo", "Sensors", { sub: "64 °C" })}
    ${grp("System", false, "", "violet")}
    ${navx("rocket", "Startup", { cnt: 14 })}
    ${navx("cog", "Services", { badge: 1 })}`;

  const tileA = (k, ic, label, v, sub, vals, c, o = {}) => `<div class="ac-tile ${o.wide ? "wide" : ""} ${o.warn ? "warn" : ""}">
    <div class="r1"><span class="k">${icon(ic)}${label}</span>${o.chip || ""}<span class="v">${v}</span></div>
    <div class="s">${sub}</div>${gline(vals, c, o.h || 64)}${o.two ? `<div class="two">${gline(o.two, "var(--sw-green)", o.h || 64)}</div>` : ""}</div>`;

  const tilesA = () => `<div class="ac-tiles">
    ${tileA("cpu", "cpu", "CPU", "36%", "3.2 GHz · 16 threads", series(1, 40, .38, .2), "var(--sw-blue)")}
    ${tileA("mem", "memory", "Memory", "83%", "25.5 of 30.8 GB", series(4, 40, .8, .04), "var(--sw-amber)", { warn: true, chip: chip("High", "warn") })}
    ${tileA("gpu", "gpu", "GPU", "21%", "Arc B580 · 3.1 of 12 GB", series(7, 40, .22, .18), "var(--sw-violet)")}
    ${tileA("disk", "drive", "Disk", "50%", "Read 12 MB/s · write 38 MB/s", series(2, 40, .3, .3), "var(--sw-teal)")}
    ${tileA("net", "wifi", "Network", "4.1 MB/s", "Down 3.9 MB/s · up 220 KB/s", series(5, 40, .45, .3), "var(--sw-blue)", { two: series(9, 40, .12, .08) })}
    ${tileA("temp", "thermo", "Temperature", "64 °C", "CPU package · fans 2,140 rpm", series(3, 40, .55, .08), "var(--sw-coral)")}
    ${tileA("bat", "battery", "Battery", "78%", "Charging · full in 40 min", series(8, 40, .7, .05), "var(--sw-green)")}
    ${tileA("up", "clock", "Load", "4.12", "1 min · 3.80 over 5 min", series(6, 40, .5, .15), "var(--sw-graphite)")}
  </div>`;

  const busiest = (by = "CPU") => `<div class="card ac-busy">
    <div class="bh"><b>Busiest apps</b><span class="sp"></span>${seg(["CPU", "Memory", "Disk", "GPU"], by)}</div>
    ${APPS.slice(0, 7).map(([n, c, cpu, mem]) => `<div class="row">${aic(n, c)}<span class="n">${n}</span><span class="bar"><b style="width:${Math.min(100, cpu * 2.2)}%"></b></span><span class="v">${by === "CPU" ? cpu.toFixed(1) + "%" : mem}</span></div>`).join("")}
  </div>`;

  const sysCard = () => `<div class="ac-side">
    <div class="card ac-kv">
      ${[["Up for", "1 day, 22 hours"], ["Load average", "4.12 · 3.80 · 3.41"], ["Processes", "312 · 2,966 threads"], ["Kernel", "6.17.8"], ["Processor", "16-core, 5.1 GHz"]].map(([k, v]) => `<div class="row"><span class="k">${k}</span><span class="v">${v}</span></div>`).join("")}
    </div>
    <div class="banner2 bad ac-fail">${icon("alert")}<div class="tx"><b>1 service failed</b><span>backup-sync stopped at 03:12</span></div>${btn("See log", "sm")}</div>
  </div>`;

  const overviewA = () => `${pbar2("Overview", "", `${seg(["1 min", "5 min", "10 min"], "1 min")}${btn("Edit tiles", "ghost", "pen")}`)}
    <div class="scroll ac-ov">${tilesA()}<div class="ac-lower">${busiest()}${sysCard()}</div></div>`;

  const PROCS = [
    { n: "Blender", c: "amber", open: true, kids: [["blender", 38.9, "3.6 GB", "12 MB/s", 60, 44, 4211], ["blender-softwaregl", 2.1, "180 MB", "–", 2, 3, 4230], ["python3.12", 0.2, "42 MB", "–", 0, 1, 4255]] },
    { n: "Firefox", c: "coral", kids: 14 }, { n: "ffmpeg", c: "green", kids: 1 }, { n: "Code - OSS", c: "blue", kids: 9 },
    { n: "Hyprland", c: "teal", kids: 1 }, { n: "PipeWire", c: "violet", kids: 3 }, { n: "Syncthing", c: "graphite", kids: 1 }, { n: "kitty", c: "pink", kids: 2 },
    { n: "mpv", c: "red", kids: 1 }, { n: "Xwayland", c: "blue", kids: 1 }, { n: "NetworkManager", c: "green", kids: 1 },
  ];
  const procTable = (o = {}) => `<div class="tbl ac-pt">
    <div class="th"><span class="c-n">Name</span><span class="c-cpu"><b>36%</b>CPU</span><span class="c-mem"><b>83%</b>Memory</span><span class="c-disk"><b>50 MB/s</b>Disk</span><span class="c-gpu"><b>21%</b>GPU</span><span class="c-thr">Threads</span><span class="c-pid">PID</span></div>
    ${PROCS.map((p) => {
      const a = APPS.find((x) => x[0] === p.n);
      const head = `<div class="tr pg ${p.open ? "open" : ""}"><span class="c-n">${icon(p.open ? "chev-d" : "chev-r", "chev")}${aic(p.n, p.c)}<b>${p.n}</b><span class="k">${p.open ? 3 : p.kids}</span></span><span class="c-cpu" ${heat(a[2] * 2)}>${a[2].toFixed(1)}%</span><span class="c-mem" ${heat(parseFloat(a[3]) * (a[3].includes("GB") ? 12 : .02))}>${a[3]}</span><span class="c-disk">${a[4]}</span><span class="c-gpu" ${heat(a[5])}>${a[5]}%</span><span class="c-thr">${a[6]}</span><span class="c-pid"></span></div>`;
      const kids = p.open ? p.kids.map(([kn, cpu, mem, disk, gpu, thr, pid], i) => `<div class="tr kid ${o.sel === i ? "sel" : ""}"><span class="c-n">${kn}</span><span class="c-cpu" ${heat(cpu * 2)}>${cpu.toFixed(1)}%</span><span class="c-mem">${mem}</span><span class="c-disk">${disk}</span><span class="c-gpu" ${heat(gpu)}>${gpu}%</span><span class="c-thr">${thr}</span><span class="c-pid">${pid}</span></div>`).join("") : "";
      return head + kids;
    }).join("")}
  </div>`;

  const procInsp = () => `<div class="insp ac-insp">
    <div class="ihead"><div class="ac-ih">${aic("Blender", "amber")}<div><b>blender</b><span>PID 4211 · you · started 14:02</span></div></div></div>
    <div class="ibody">
      <div class="lab">CPU<span class="cnt">38.9%</span></div><div class="card ac-ig">${gline(series(1, 40, .5, .25), "var(--sw-blue)", 40)}</div>
      <div class="lab">Memory<span class="cnt">3.6 GB</span></div><div class="card ac-ig">${gline(series(4, 40, .7, .05), "var(--sw-amber)", 40)}</div>
      <div class="lab">Details</div>
      <div class="card">
        ${[["Disk read · write", "2 · 10 MB/s"], ["Threads", "44"], ["Priority", "Normal (0)"], ["Open files", "128"], ["Parent", "Hyprland (1180)"]].map(([k, v]) => `<div class="row"><span class="k">${k}</span><span class="v">${v}</span></div>`).join("")}
      </div>
      <div class="ac-cmd mono">/usr/bin/blender ~/Models/lighthouse.blend</div>
    </div>
    <div class="ifoot">${btn("Switch to", "", "window")}${ib("pause", "Pause")}${ib("more", "More: priority, location, copy command, kill")}<span style="flex:1"></span>${btn("End task", "danger")}</div>
  </div>`;

  const processesA = () => `${pbar2("Processes", "", `${seg(["Apps", "All", "Tree", "Mine"], "Apps")}<div class="field ac-filter">${icon("filter")}<span class="ph">Filter by name, command, PID or user</span></div>${ib("columns", "Columns")}`)}
    <div class="cols"><div class="main"><div class="scroll">${procTable({ sel: 0 })}</div></div>${procInsp()}</div>`;

  /* ── Option B: a task manager with tabs ─────────────────────────────── */
  const hdrB = (on) => hdr({ center: seg(["Processes", "Performance", "Startup", "Services"], on) }).replace(ib("sidebar", "Sidebar (Ctrl+B)"), "");

  const processesB = () => `<div class="ac-btool">${seg(["Apps", "All", "Tree", "Mine"], "Apps")}<div class="field ac-filter">${icon("filter")}<span class="ph">Filter by name, command, PID or user</span></div><span class="sp"></span><span class="ac-tot">312 processes · 2,966 threads</span>${ib("columns", "Columns")}</div>
    <div class="scroll">${procTable({ sel: 0 })}</div>
    <div class="ac-drawer">
      ${aic("Blender", "amber")}<div class="tx"><b>blender</b><span>PID 4211 · 38.9% CPU · 3.6 GB · 44 threads · started 14:02</span></div>
      ${btn("Switch to", "", "window")}${btn("Pause", "ghost", "pause")}${dd("Priority: Normal")}${ib("folder", "Open location")}${ib("copy", "Copy command")}${ib("chev-u", "Show graphs and open files")}${btn("End task", "danger")}
    </div>`;

  const DEV = [
    ["cpu", "CPU", "36%", "3.2 GHz", "var(--sw-blue)", 1, .38],
    ["memory", "Memory", "83%", "25.5 / 30.8 GB", "var(--sw-amber)", 4, .8],
    ["drive", "Disk 0 (NVMe)", "50%", "Read 12 · write 38 MB/s", "var(--sw-teal)", 2, .3],
    ["wifi", "Wi-Fi", "4.1 MB/s", "Down 3.9 · up 0.2", "var(--sw-pink)", 5, .45],
    ["gpu", "GPU", "21%", "Arc B580", "var(--sw-violet)", 7, .22],
    ["thermo", "Sensors", "64 °C", "Fans 2,140 rpm", "var(--sw-coral)", 3, .55],
  ];
  const perfB = () => `<div class="cols ac-perf">
    <div class="list ac-devs">${DEV.map(([ic, n, v, s, c, seed, base], i) => `<div class="ac-dev ${i === 0 ? "sel" : ""}"><div class="g">${gline(series(seed, 30, base, .2), c, 34)}</div><div class="tx"><b>${n}</b><span class="v">${v}</span><span class="s">${s}</span></div></div>`).join("")}</div>
    <div class="main ac-pmain"><div class="scroll">
      <div class="ac-ph"><div><b>CPU</b><span>16-core processor · 8 performance, 8 efficient</span></div><span class="sp"></span>${seg(["1 min", "5 min", "10 min"], "1 min")}</div>
      <div class="ac-big card">${gline(series(1, 60, .38, .22), "var(--sw-blue)", 170)}<div class="ax"><span>60 s ago</span><span>Now</span></div></div>
      <div class="ac-split">
        <div class="card ac-where"><div class="wt">Where the time goes</div>
          <div class="stack"><b style="width:24%;background:var(--sw-blue)"></b><b style="width:9%;background:var(--sw-violet)"></b><b style="width:2%;background:var(--sw-amber)"></b><b style="width:1%;background:var(--sw-coral)"></b></div>
          <div class="lg"><span><i style="background:var(--sw-blue)"></i>Apps 24%</span><span><i style="background:var(--sw-violet)"></i>Kernel 9%</span><span><i style="background:var(--sw-amber)"></i>Waiting on disk 2%</span><span><i style="background:var(--sw-coral)"></i>Interrupts 1%</span></div>
          <div class="kvs">${[["Speed", "3.2 GHz"], ["Load", "4.12"], ["Processes", "312"], ["Threads", "2,966"], ["Up for", "1 d 22 h"], ["Power", "Balanced"]].map(([k, v]) => `<div><span>${k}</span><b>${v}</b></div>`).join("")}</div>
        </div>
        <div class="card ac-cores"><div class="wt">Each thread<span>Performance · Efficient</span></div>
          <div class="cg">${Array.from({ length: 16 }, (_, i) => { const v = [72, 64, 58, 41, 38, 33, 22, 18, 12, 9, 14, 8, 6, 11, 5, 4][i]; return `<div class="core ${i >= 8 ? "e" : ""}"><b style="height:${v}%"></b><span>${v}%</span></div>`; }).join("")}</div>
        </div>
      </div>
      <div class="card ac-cbusy"><div class="wt">Using the CPU most</div>${APPS.slice(0, 4).map(([n, c, cpu]) => `<div class="row">${aic(n, c)}<span class="n">${n}</span><span class="bar"><b style="width:${Math.min(100, cpu * 2.2)}%"></b></span><span class="v">${cpu.toFixed(1)}%</span></div>`).join("")}</div>
    </div></div>
  </div>`;

  const SVC = [
    ["backup-sync", "Back up ~/Documents to the NAS", "failed", "Failed 03:12", "enabled"],
    ["syncthing", "File synchronization", "run", "Running · 96 MB", "enabled"],
    ["pipewire", "Sound and video server", "run", "Running · 48 MB", "enabled"],
    ["bluetooth", "Bluetooth", "run", "Running · 6 MB", "enabled"],
    ["cups", "Printing", "stop", "Stopped", "disabled"],
    ["fstrim.timer", "Trim SSDs weekly", "timer", "Next Mon 00:00", "enabled"],
    ["docker", "Container engine", "stop", "Stopped", "disabled"],
    ["sshd", "Remote login", "stop", "Stopped", "disabled"],
  ];
  const servicesB = () => `<div class="ac-btool">${seg(["Yours", "System", "Timers"], "Yours")}<div class="field ac-filter">${icon("filter")}<span class="ph">Filter services</span></div><span class="sp"></span><span class="ac-tot">Refreshes by itself</span></div>
    <div class="cols"><div class="list ac-svcs"><div class="scroll">${SVC.map(([n, d, s, st, en], i) => `<div class="ac-svc ${i === 0 ? "sel" : ""}"><span class="sd ${s}"></span><div class="tx"><b>${n}</b><span>${d}</span></div><span class="st ${s}">${st}</span></div>`).join("")}</div></div>
    <div class="main ac-log">
      <div class="ac-lh"><div><b>backup-sync.service</b><span>Back up ~/Documents to the NAS · starts at login</span></div><div class="ac-facts">${[["State", "Failed at 03:12"], ["Last run", "36 s"], ["Memory", "–"], ["CPU time", "1.4 s"]].map(([k, v]) => `<div><span>${k}</span><b>${v}</b></div>`).join("")}<div class="cmd mono">/usr/bin/backup-sync --to nas.local:/backups</div></div></div>
      <div class="ac-lacts">${btn("Restart", "primary", "refresh")}${btn("Stop", "", "stop")}${btn("Turn off at login", "ghost")}<span class="sp"></span>${btn("Edit unit", "ghost", "pen")}</div>
      <div class="ac-lbar"><b>Log</b>${seg(["All", "Warnings", "Errors"], "All")}<div class="field">${icon("filter")}<span class="ph">Filter the log</span></div><span class="sp"></span><span class="tog">Follow ${sw(true)}</span></div>
      <div class="ac-logs mono">${[["Yesterday 03:12", "", "Backup finished: 1,284 files, 2.1 GB"], ["03:12:01", "", "Starting backup of /home/you/Documents…"], ["03:12:02", "", "Connecting to nas.local:22"], ["03:12:07", "w", "Connection timed out, retrying (1/3)"], ["03:12:17", "w", "Connection timed out, retrying (2/3)"], ["03:12:27", "w", "Connection timed out, retrying (3/3)"], ["03:12:37", "e", "rsync: connection unexpectedly closed (0 bytes received)"], ["03:12:37", "e", "backup-sync.service: Main process exited, status=12"], ["03:12:37", "e", "backup-sync.service: Failed with result 'exit-code'."]].map(([t, l, m]) => `<div class="${l}"><span class="t">${t}</span>${m}</div>`).join("")}</div>
    </div></div>`;

  /* ── Option C: a dashboard you arrange ──────────────────────────────── */
  const sideC = () => `
    ${navx("grid", "Dashboard", { active: true })}
    ${navx("listic", "Processes")}
    ${grp("Performance", false, "", "accent")}
    ${navx("cpu", "CPU")}${navx("memory", "Memory")}${navx("drive", "Storage")}${navx("wifi", "Network")}${navx("gpu", "GPU")}${navx("thermo", "Sensors")}
    ${grp("System", false, "", "violet")}
    ${navx("rocket", "Startup")}${navx("cog", "Services", { badge: 1 })}`;

  const dcard = (title, ic, body, o = {}) => `<div class="ac-dc ${o.cls || ""} ${o.edit ? "edit" : ""}" ${o.span ? `style="grid-column: span ${o.span}"` : ""}>
    <div class="dh">${o.edit ? icon("grip", "grip") : ""}${icon(ic, "ic")}<b>${title}</b>${o.meta ? `<span class="m">${o.meta}</span>` : ""}<span class="sp"></span>${o.edit ? `${ib("eye", "Hide")}` : o.more ? `<span class="more">${o.more}</span>` : ""}</div>${body}</div>`;

  const dashC = (o = {}) => `<div class="ac-alerts">
      <div class="banner2 warn">${icon("memory")}<div class="tx"><b>Memory is 83% full</b><span>Blender is using 3.8 GB and Firefox 2.1 GB.</span></div>${btn("Show them", "sm")}</div>
      <div class="banner2 bad">${icon("alert")}<div class="tx"><b>backup-sync failed at 03:12</b><span>It couldn't reach nas.local.</span></div>${btn("See log", "sm")}</div>
    </div>
    <div class="scroll ac-dash"><div class="ac-dgrid">
      ${dcard("CPU", "cpu", `<div class="bigv">36%<span>3.2 GHz · load 4.12</span></div>${gline(series(1, 50, .38, .2), "var(--sw-blue)", 84)}<div class="heat">${Array.from({ length: 16 }, (_, i) => `<b style="opacity:${[.9, .8, .75, .55, .5, .45, .3, .25, .2, .15, .2, .12, .1, .15, .1, .08][i] + .1}"></b>`).join("")}</div>`, { span: 2, meta: "16 threads", more: "Details", edit: o.edit })}
      ${dcard("Memory", "memory", `<div class="bigv">25.5 GB<span>of 30.8 GB</span></div><div class="stack"><b style="width:52%;background:var(--sw-amber)"></b><b style="width:12%;background:var(--sw-violet)"></b><b style="width:19%;background:var(--sw-teal)"></b></div><div class="lg"><span><i style="background:var(--sw-amber)"></i>Apps 16.0 GB</span><span><i style="background:var(--sw-violet)"></i>Kernel 3.7 GB</span><span><i style="background:var(--sw-teal)"></i>Cache 5.8 GB</span></div><div class="swap">Swap and zram: 1.2 GB used, packed 3.1 to 1</div>`, { edit: o.edit, more: "Details" })}
      ${dcard("Storage", "drive", ["/", "/home", "/mnt/media"].map((m, i) => `<div class="mnt"><span>${m}</span>${prog([48, 71, 94][i], [48, 71, 94][i] > 90 ? "bad" : "")}<span class="v">${["96 of 200 GB", "1.1 of 1.6 TB", "1.8 of 1.9 TB"][i]}</span></div>`).join("") + `<div class="io">${icon("download")}Read 12 MB/s ${icon("upload")}Write 38 MB/s</div>`, { edit: o.edit, more: "Details" })}
      ${dcard("Network", "wifi", `<div class="bigv">3.9 MB/s<span>down · 220 KB/s up</span></div>${gline(series(5, 50, .45, .3), "var(--sw-pink)", 54)}<div class="io">Wi-Fi 6 · 5 GHz · signal good</div>`, { edit: o.edit, more: "Details" })}
      ${dcard("GPU", "gpu", `<div class="bigv">21%<span>Arc B580 · 3.1 GB</span></div>${gline(series(7, 50, .22, .18), "var(--sw-violet)", 54)}<div class="io">Render 21% · video 48% · copy 3%</div>`, { edit: o.edit, more: "Details" })}
      ${dcard("Sensors", "thermo", ["CPU package", "NVMe", "GPU"].map((s, i) => `<div class="sen"><span>${s}</span><b>${[64, 41, 58][i]} °C</b></div>`).join("") + `<div class="sen"><span>Fans</span><b>2,140 rpm</b></div><div class="sen"><span>Battery</span><b>78%, charging</b></div>`, { edit: o.edit, more: "Details" })}
      ${dcard("Busiest right now", "listic", APPS.slice(0, 4).map(([n, c, cpu, mem]) => `<div class="bz">${aic(n, c)}<span class="n">${n}</span><span class="v">${cpu.toFixed(1)}%</span><span class="v">${mem}</span></div>`).join(""), { edit: o.edit, more: "All processes", span: 2 })}
      ${dcard("Startup", "rocket", `<div class="ac-su"><span><b>14</b> apps start at login</span><span>Your last login took <b>8.4 s</b>; Syncthing was slowest at 2.1 s</span><span><b>1</b> service failed</span></div>`, { edit: o.edit, more: "Manage", span: 3 })}
    </div></div>`;

  const editPanel = () => `<div class="insp ac-tilesp">
    <div class="ihead"><b class="ac-et">Edit the dashboard</b><span class="ac-es">Drag cards to reorder them.</span></div>
    <div class="ibody">
      <div class="lab">Cards</div>
      <div class="card">${[["CPU", true], ["Memory", true], ["Storage", true], ["Network", true], ["GPU", true], ["Sensors", true], ["Busiest right now", true], ["Battery", false], ["Startup", true], ["Load average", false]].map(([n, on]) => `<div class="row"><span class="k">${n}</span>${sw(on)}</div>`).join("")}</div>
      <div class="lab">Warn me when</div>
      <div class="card">${[["CPU is hotter than", "90 °C"], ["Memory is fuller than", "90%"], ["A disk is fuller than", "95%"], ["One process stays busy for", "5 min"]].map(([k, v]) => `<div class="row"><span class="k">${k}</span>${dd(v)}</div>`).join("")}<div class="row"><span class="k">Also as a notification</span>${sw(true)}</div></div>
    </div>
    <div class="ifoot"><span style="flex:1"></span>${btn("Done", "primary")}</div>
  </div>`;

  /* ── Option C: one timeline you can scrub ───────────────────────────── */
  // A series with bumps [at 0–1, height, width] and an optional step up [at, by].
  const shaped = (seed, n, base, amp, bumps = [], stepAt = null) => series(seed, n, base, amp).map((v, i) => {
    const x = i / (n - 1);
    const b = bumps.reduce((a, [p, h, w]) => a + h * Math.exp(-((x - p) ** 2) / (2 * w * w)), 0);
    const s = stepAt ? stepAt[1] / (1 + Math.exp(-(x - stepAt[0]) * 40)) : 0;
    return Math.max(0.02, Math.min(0.98, v + b + s));
  });
  const N = 90;
  const EVS = [[0.2, "ffmpeg started", "ffmpeg"], [0.62, "Blender began a render", "Render"], [0.84, "Memory passed 80%", "Memory 80%"]];
  // [icon, name, colour, now, sub now, at cursor, sub at cursor, series, second series, warn]
  const LANES = () => [
    ["cpu", "CPU", "blue", "36%", "3.2 GHz · load 4.1", "88%", "4.6 GHz · load 9.8", shaped(1, N, .22, .1, [[.2, .12, .02], [.66, .55, .05], [.9, .2, .05]])],
    ["memory", "Memory", "amber", "83%", "25.5 of 30.8 GB", "71%", "21.9 of 30.8 GB", shaped(4, N, .62, .02, [], [.62, .2]), null, true],
    ["gpu", "GPU", "violet", "21%", "Arc B580", "64%", "Render 64%", shaped(7, N, .12, .08, [[.66, .5, .04]])],
    ["drive", "Disk", "teal", "50 MB/s", "Read 12 · write 38", "141 MB/s", "Read 120 · write 21", shaped(2, N, .14, .1, [[.2, .45, .03], [.63, .55, .015]]), shaped(9, N, .08, .05, [[.24, .25, .05]])],
    ["wifi", "Network", "pink", "4.1 MB/s", "Down 3.9 · up 0.2", "0.4 MB/s", "Down 0.3 · up 0.1", shaped(5, N, .3, .22), shaped(3, N, .08, .05)],
    ["thermo", "Temperature", "coral", "64 °C", "CPU · fans 2,140 rpm", "82 °C", "CPU · fans 3,900 rpm", shaped(3, N, .45, .04, [[.7, .3, .08]])],
    ["battery", "Battery", "green", "78%", "Charging · full in 40 min", "71%", "Charging", shaped(8, N, .66, .01, [], [.5, .1])],
  ];
  const laneG = (vals, c, h, two) => `<div class="g">${gline(vals, `var(--sw-${c})`, h)}${two ? `<div class="g2">${gline(two, "var(--sw-graphite)", h).replace('opacity=".14"', 'opacity="0"')}</div>` : ""}</div>`;
  const lanes = (o = {}) => `<div class="an1-lanes">
    ${LANES().map(([ic, n, c, v, s, pv, ps, vals, two, warn]) => `<div class="an1-lane ${warn && !o.at ? "warn" : ""}" style="--lc:var(--sw-${c})">
      <div class="lb">${icon(ic)}<div class="tx"><span class="n">${n}${icon("chev-r", "go")}</span><div class="r2"><b>${o.at ? pv : v}</b><span class="s">${o.at ? ps : s}</span></div></div></div>${laneG(vals, c, NARROW ? 36 : 40, two)}</div>`).join("")}
    <div class="an1-axis"><span></span><div><span>10 min ago</span><span>5 min</span><span>${o.at ? "Now" : "Now · live"}</span></div></div>
    <div class="an1-evs">${EVS.map(([p, t, short], i) => `<span class="ev ${i === 1 ? "r" : ""}" style="left:${p * 100}%"><em>${NARROW ? short : t}</em></span>`).join("")}
      ${o.at ? `<span class="cur" style="left:${o.at * 100}%"><em>14:06:20</em></span>` : `<span class="now"></span>`}</div>
  </div>`;
  const busyN1 = (o = {}) => {
    const rows = o.at ? [["Blender", "amber", "71.4%", "4.4 GB", "118 MB/s", "64%"], ["ffmpeg", "green", "6.1%", "412 MB", "12 MB/s", "18%"], ["Firefox", "coral", "3.9%", "2.0 GB", "–", "2%"], ["Hyprland", "teal", "2.6%", "310 MB", "–", "6%"], ["Code - OSS", "blue", "1.2%", "1.4 GB", "–", "1%"]]
      : APPS.slice(0, 5).map(([n, c, cpu, mem, disk, gpu]) => [n, c, cpu.toFixed(1) + "%", mem, disk, gpu + "%"]);
    return `<div class="an1-busy">
      <div class="bh"><b>${o.at ? "Busiest at 14:06:20" : "Busiest right now"}</b><span class="m">${o.at ? "Values at that moment, not now" : "312 processes · 2,966 threads"}</span><span class="sp"></span><span class="lnk">All processes</span></div>
      ${tbl([["Name"], ["CPU", "80px"], ["Memory", "84px"], ["Disk", "90px"], ["GPU", "60px"]], rows.map(([n, c, ...v]) => [`${aic(n, c)}<span>${n}</span>`, ...v]), { cls: "an1-tbl", sel: o.at ? 0 : undefined })}
    </div>`;
  };
  const hdrN = (o = {}) => header({
    icon: "pulse", name: "Activity", center: search(o.q || "Find a process or page", "Ctrl K"),
    end: `${btn("Startup", "ghost", "rocket")}<button class="btn ghost an1-svc">${icon("cog")}<span>Services</span><span class="b">1</span></button><button class="ac-live ${o.paused ? "paused" : ""}">${o.paused ? icon("pause") : `<span class="dot"></span>`}<span>${o.paused ? "Paused" : "Live · 1 s"}</span></button>`,
  }).replace(ib("sidebar", "Sidebar (Ctrl+B)"), "");
  const pageN1 = (o = {}) => `<div class="an1-bar">${seg(["1 min", "5 min", "10 min"], "10 min")}<span class="tog">${sw(true)} Events</span><span class="sp"></span>${o.at ? `<span class="hint">${icon("history")}Looking back · values at the line</span>${btn("Back to live", "primary", "play")}` : `<span class="hint">Drag across the graphs to look back</span>`}</div>
    <div class="scroll an1-body">${lanes(o)}${busyN1(o)}</div>
    ${o.menu ? menu(NARROW ? 300 : 420, NARROW ? 640 : 600, [["window", "Switch to"], ["pause", "Pause"], ["sort", "Priority", "›"], "-", ["folder", "Open location"], ["listic", "Show in the tree"], ["copy", "Copy command"], "-", ["x", "End task", "Delete"], ["stop", "Kill", "Shift Delete", "danger"]], 230).replace(/top:\d+px;/, "bottom:22px;") : ""}`;

  /* ── Option D: a map of what's using it ─────────────────────────────── */
  // Blocks: [name, colour, value, sub, x, y, w, h] in % of the map.
  const MEMMAP = [
    ["Blender", "amber", "3.8 GB", "41% CPU · 3 processes", 0, 0, 36, 64],
    ["Firefox", "coral", "2.1 GB", "8% CPU · 14 processes", 0, 64, 36, 36],
    ["Kernel and shared", "graphite", "3.7 GB", "Not an app", 36, 0, 31, 72, "sys"],
    ["Code - OSS", "blue", "1.4 GB", "3% CPU · 9 processes", 36, 72, 31, 28],
    ["Other apps", "graphite", "2.9 GB", "296 processes", 67, 0, 33, 54, "oth"],
    ["Steam", "violet", "1.2 GB", "0.4% CPU", 67, 54, 33, 23],
    ["ffmpeg", "green", "412 MB", "7% CPU", 67, 77, 11, 23],
    ["Hyprland", "teal", "310 MB", "2% CPU", 78, 77, 8.5, 23],
    ["mpv", "red", "160", "", 86.5, 77, 5, 23],
    ["kitty", "pink", "", "", 91.5, 77, 3.5, 23],
    ["Syncthing", "graphite", "", "", 95, 77, 2.5, 23],
    ["PipeWire", "violet", "", "", 97.5, 77, 2.5, 23],
  ];
  const CPUMAP = [
    ["Blender", "amber", "41.2%", "3 processes · 3.8 GB", 0, 0, 46, 100, "", [["blender", "38.9%", 0, 0, 100, 84, true], ["softwaregl", "2.1%", 0, 84, 70, 16], ["python3.12", "", 70, 84, 30, 16]]],
    ["Idle", "graphite", "64%", "Nothing is waiting for the processor", 46, 0, 54, 58, "idle"],
    ["Firefox", "coral", "8.4%", "14 processes", 46, 58, 22, 42],
    ["ffmpeg", "green", "6.9%", "1 process", 68, 58, 17, 42],
    ["Code - OSS", "blue", "3.1%", "", 85, 58, 15, 22],
    ["Hyprland", "teal", "1.8%", "", 85, 80, 8, 20],
    ["Other", "graphite", "1.6%", "", 93, 80, 7, 20, "oth"],
  ];
  const block = ([n, c, v, s, x, y, w, h, kind = "", kids], sel) => `<div class="an2-b ${kind} ${n === sel ? "sel" : ""} ${w * h < 300 ? "tiny" : w * h < 900 ? "small" : ""}" style="left:${x}%;top:${y}%;width:${w}%;height:${h}%;--bc:var(--sw-${c})">
    <div class="in">${w * h >= 160 ? `<b>${n}</b>` : ""}${v && w * h >= 160 ? `<span class="v">${v}</span>` : ""}${s && w * h >= 900 ? `<span class="s">${s}</span>` : ""}${w * h >= 700 && !kind && !kids ? `<div class="ln">${gline(series(hash(n) % 9, 30, .5, .3), "var(--bc)", w * h >= 2000 ? 46 : 26)}</div>` : ""}
      ${kids ? `<div class="kids">${kids.map(([kn, kv, kx, ky, kw, kh, ks]) => `<div class="k ${ks ? "sel" : ""}" style="left:${kx}%;top:${ky}%;width:${kw}%;height:${kh}%"><b>${kn}</b>${kv ? `<span>${kv}</span>` : ""}</div>`).join("")}</div>` : ""}</div></div>`;
  const byBar = (on) => `<div class="an2-by"><span class="lbl">Size by</span>
    ${[["cpu", "CPU", "36%", 36, "blue"], ["memory", "Memory", "25.5 GB", 83, "amber"], ["drive", "Disk", "50 MB/s", 30, "teal"], ["gpu", "GPU", "21%", 21, "violet"], ["wifi", "Network", "4.1 MB/s", 18, "pink"]].map(([ic, n, v, p, c]) => `<div class="m ${n === on ? "on" : ""} ${n === "Memory" ? "warn" : ""}" style="--mc:var(--sw-${c})">${icon(ic)}<div class="tx"><span class="n">${n}</span><b>${v}</b></div><span class="bar"><b style="width:${p}%"></b></span></div>`).join("")}
    <span class="sp"></span><span class="ro">${icon("thermo")}64 °C</span><span class="ro">${icon("battery")}78%</span></div>`;
  const panelN2 = (o = {}) => {
    const cpu = o.by === "CPU";
    return `<div class="insp ac-insp an2-insp">
    <div class="ihead"><div class="ac-ih">${aic(cpu ? "blender" : "Blender", "amber")}<div><b>${cpu ? "blender" : "Blender"}</b><span>${cpu ? "PID 4211 · part of Blender" : "3 processes · you · since 14:02"}</span></div></div></div>
    <div class="ibody">
      <div class="lab">CPU<span class="cnt">${cpu ? "38.9%" : "41.2%"}</span></div><div class="card ac-ig">${gline(series(1, 40, .5, .25), "var(--sw-blue)", 36)}</div>
      <div class="lab">Memory<span class="cnt">${cpu ? "3.6 GB" : "3.8 GB"}</span></div><div class="card ac-ig">${gline(series(4, 40, .7, .05), "var(--sw-amber)", 36)}</div>
      ${cpu ? `<div class="lab">Details</div><div class="card">${[["Threads", "44"], ["Disk read · write", "2 · 10 MB/s"], ["GPU", "60%"], ["Priority", "Normal (0)"], ["Parent", "Hyprland (1180)"]].map(([k, v]) => `<div class="row"><span class="k">${k}</span><span class="v">${v}</span></div>`).join("")}</div>`
        : `<div class="lab">Its processes<span class="cnt">3</span></div><div class="card an2-kids">${[["blender", "3.6 GB", "38.9%", true], ["blender-softwaregl", "180 MB", "2.1%"], ["python3.12", "42 MB", "0.2%"]].map(([n, m, c, s]) => `<div class="row ${s ? "sel" : ""}"><span class="k">${n}</span><span class="v">${m}</span><span class="v c">${c}</span></div>`).join("")}</div>
      <div class="lab">Details</div><div class="card">${[["Disk read · write", "2 · 10 MB/s"], ["GPU", "62% · 3.1 GB"], ["Threads", "48"]].map(([k, v]) => `<div class="row"><span class="k">${k}</span><span class="v">${v}</span></div>`).join("")}</div>`}
    </div>
    <div class="ifoot">${btn("Switch to", "", "window")}${ib("pause", "Pause")}${ib("more", "More: priority, location, copy command, show in the tree, kill")}<span style="flex:1"></span>${btn(o.confirm ? "End it" : "End task", "danger")}</div>
    ${o.confirm ? `<div class="an2-conf pop"><b>End blender?</b><span>Blender has a file open with changes. Press End it, or Delete again, to close it anyway.</span></div>` : ""}
  </div>`;
  };
  const pageN2 = (o = {}) => {
    const by = o.by || "Memory";
    const map = `<div class="an2-wrap"><div class="an2-top">${seg(["Map", "List"], "Map")}<span class="cap">${by === "CPU" ? "36% of the processor is busy · Blender opened into its processes" : "25.5 GB in use · the 5.8 GB cache isn't shown: it's freed whenever an app needs it"}</span></div>
      <div class="an2-map">${(by === "CPU" ? CPUMAP : MEMMAP).map((b) => block(b, by === "CPU" ? "" : "Blender")).join("")}</div></div>`;
    return `${byBar(by)}<div class="cols">${NARROW ? `<div class="main">${map}<div class="ac-drawer an2-dr">${aic("Blender", "amber")}<div class="tx"><b>Blender</b><span>3 processes · 3.8 GB · 41% CPU</span></div>${btn("Switch to", "", "window")}${ib("pause", "Pause")}${ib("chev-u", "Show graphs and processes")}${btn("End task", "danger")}</div></div>` : `<div class="main">${map}</div>${panelN2(o)}`}</div>`;
  };

  /* ── Processes choices (E, F, G), on option B's sidebar and header ──── */
  const sideP = () => `
    ${navx("grid", "Dashboard")}
    ${navx("listic", "Processes", { active: true, cnt: 312 })}
    ${grp("Performance", false, "", "accent")}
    ${navx("cpu", "CPU", { sub: "36%" })}${navx("memory", "Memory", { sub: "83%" })}${navx("drive", "Storage", { sub: "71%" })}${navx("wifi", "Network", { sub: "3.9 MB/s" })}${navx("gpu", "GPU", { sub: "21%" })}${navx("thermo", "Sensors", { sub: "64 °C" })}
    ${grp("System", false, "", "violet")}
    ${navx("rocket", "Startup")}${navx("cog", "Services", { badge: 1 })}`;
  // [name, colour, cpu %, memory, disk, network, gpu %, processes, user, note, cpu history seed]
  const PAPPS = [
    ["Blender", "amber", 41.2, "3.8 GB", "12 MB/s", "–", 62, 3, "you", "Using a lot of the processor", 1],
    ["Firefox", "coral", 8.4, "2.1 GB", "1.2 MB/s", "3.4 MB/s", 4, 14, "you", "Using a lot of memory", 2],
    ["ffmpeg", "green", 6.9, "412 MB", "38 MB/s", "–", 18, 1, "you", "Writing to disk", 3],
    ["Code - OSS", "blue", 3.1, "1.4 GB", "–", "12 KB/s", 1, 9, "you", "", 4],
    ["kitty", "pink", 0.3, "120 MB", "–", "–", 0, 2, "you", "", 5],
  ];
  const PBG = [
    ["Syncthing", "graphite", 0.6, "96 MB", "420 KB/s", "180 KB/s", 0, 1, "you", "Syncing 2 folders", 6],
    ["PipeWire", "violet", 0.9, "48 MB", "–", "–", 0, 3, "you", "", 7],
    ["Hyprland", "teal", 1.8, "310 MB", "–", "–", 6, 1, "you", "", 8],
  ];
  const PSYS = [
    ["systemd-journald", "graphite", 0.2, "38 MB", "88 KB/s", "–", 0, 1, "root", "", 9],
    ["NetworkManager", "green", 0.1, "22 MB", "–", "6 KB/s", 0, 1, "root", "", 10],
  ];
  const KIDS = [["blender", "4211", 38.9, "3.6 GB"], ["blender-softwaregl", "4230", 2.1, "180 MB"], ["python3.12", "4262", 0.2, "42 MB"]];
  // A letter on an Umbra tile: the satin tile, a glow and edge in the app's colour, the
  // letter in it (the icon theme's app style).
  const uic = (name, c) => `<span class="u-aic" style="--uc: var(--sw-${c})">${name[0].toUpperCase()}</span>`;
  const cpuBar = (v) => `<span class="p-cbar"><b style="width:${Math.min(100, v * 1.6)}%"></b></span><span class="p-num">${v.toFixed(1)}%</span>`;

  /* E: apps and what they run */
  const eRow = ([n, c, cpu, mem, disk, net, , procs], o = {}) => `<div class="p-er ${o.sel ? "sel" : ""} ${o.open ? "open" : ""}">
    <span class="p-tw">${procs > 1 ? icon(o.open ? "chev-d" : "chev-r") : ""}</span>${uic(n, c)}<span class="p-nm"><b>${n}</b>${procs > 1 ? `<span>${procs} processes</span>` : ""}</span>
    <span class="p-c cpu">${cpuBar(cpu)}</span><span class="p-c">${mem}</span><span class="p-c w">${disk}</span><span class="p-c w">${net}</span></div>`;
  const eKid = ([n, pid, cpu, mem]) => `<div class="p-er kid"><span class="p-tw"></span><span class="p-kidl"></span><span class="p-nm"><span class="k">${n}</span><span>PID ${pid}</span></span><span class="p-c cpu"><span class="p-num">${cpu.toFixed(1)}%</span></span><span class="p-c">${mem}</span><span class="p-c w">–</span><span class="p-c w">–</span></div>`;
  const eGroup = (title, sw, rows, count, o = {}) => `<div class="p-gh" style="--sc: var(--${sw === "accent" ? "accent" : "sw-" + sw})"><b>${title}</b><span>${count}</span></div>${rows.map((r, i) => eRow(r, { sel: o.sel && i === 0, open: o.open && i === 0 }) + (o.open && i === 0 ? KIDS.map(eKid).join("") : "")).join("")}`;
  const inspector = () => `<aside class="insp p-insp">
    <div class="ihead"><div class="p-ih">${uic("Blender", "amber")}<div><b>Blender</b><span>3 processes · you · since 14:02</span></div></div></div>
    <div class="ibody">
      <div class="lab">Processor <span class="cnt">41.2%</span></div><div class="card p-gcard">${gline(series(1, 40, .45, .25), "var(--sw-amber)", 46)}</div>
      <div class="lab">Memory <span class="cnt">3.8 GB</span></div><div class="card p-gcard">${gline(series(2, 40, .6, .1), "var(--sw-violet)", 46)}</div>
      <div class="lab">About it</div>
      <div class="card">${[["Started", "Today 14:02"], ["Threads", "48"], ["Disk", "12 MB/s write"], ["GPU", "62%"], ["Command", "blender ~/Renders/harbour.blend"]].map(([k, v]) => `<div class="row"><span class="k">${k}</span><span class="v">${v}</span></div>`).join("")}</div>
    </div>
    <div class="ifoot">${btn("Switch to", "", "window")}${ib("pause", "Pause")}${ib("more", "Priority, open location, copy command, force quit")}<span class="grow"></span>${btn("End task", "danger")}</div></aside>`;
  const eTool = () => `<div class="p-tool">${seg(["Apps", "All", "Mine"], "Apps")}<div class="field p-filter">${icon("filter")}<span class="ph">Filter by name, command or PID</span></div><span class="sp"></span><span class="p-tot">312 processes · 2,966 threads</span></div>`;
  const pageE = () => `${eTool()}<div class="cols"><div class="main"><div class="p-eh"><span class="p-tw"></span><span class="nm">Name</span><span class="p-c cpu">CPU ${icon("chev-d")}</span><span class="p-c">Memory</span><span class="p-c w">Disk</span><span class="p-c w">Network</span></div>
    <div class="scroll p-elist">${eGroup("Apps", "accent", PAPPS, 5, { sel: true, open: true })}${eGroup("Background", "green", PBG, 41)}${eGroup("System", "violet", PSYS, 263)}</div></div>${NARROW ? "" : inspector()}</div>
    ${NARROW ? `<div class="p-foot">${uic("Blender", "amber")}<div class="tx"><b>Blender</b><span>3 processes · 41% CPU · 3.8 GB</span></div>${btn("Switch to", "", "window")}${ib("pause", "Pause")}${btn("End task", "danger")}</div>` : ""}`;

  /* F: a clean table */
  const fCell = (v, pct) => `<span class="p-c" ${pct ? heat(pct) : ""}>${v}</span>`;
  const fRow = ([n, c, cpu, mem, disk, net, gpu, procs], sel) => `<div class="p-fr ${sel ? "sel" : ""}">${aic(n, c)}<span class="p-nm"><b>${n}</b>${procs > 1 ? `<span class="p-cnt">${procs}</span>` : ""}</span>${fCell(cpu.toFixed(1) + "%", cpu)}${fCell(mem, parseFloat(mem) > 1 && mem.includes("GB") ? parseFloat(mem) * 12 : 0)}<span class="p-c w">${disk}</span><span class="p-c w">${net}</span><span class="p-c w">${gpu ? gpu + "%" : "–"}</span></div>`;
  const fGroup = (title, rows, count, sel) => `<div class="p-fg">${icon("chev-d")}<b>${title}</b><span>${count}</span></div>${rows.map((r, i) => fRow(r, sel && i === 0)).join("")}`;
  const pageF = () => `<div class="p-tool">${seg(["Apps", "All", "Mine"], "Apps")}<div class="field p-filter">${icon("filter")}<span class="ph">Filter by name, command or PID</span></div><span class="sp"></span>${btn("Columns", "ghost", "columns")}</div>
    <div class="p-fh">${"<span class='lead'></span>"}<span class="nm">Name</span><span class="p-c on">CPU 36% ${icon("chev-d")}</span><span class="p-c">Memory 83%</span><span class="p-c w">Disk</span><span class="p-c w">Network</span><span class="p-c w">GPU 21%</span></div>
    <div class="scroll p-flist">${fGroup("Apps", PAPPS, 5, true)}${fGroup("Background", PBG, 41)}${fGroup("System", PSYS, 263)}</div>
    <div class="p-foot">${aic("Blender", "amber")}<div class="tx"><b>Blender</b><span>3 processes · PID 4211 · you</span></div>${btn("Switch to", "", "window")}${btn("Pause", "", "pause")}${NARROW ? "" : dd("Priority: normal")}${ib("more", "Open location, copy command, force quit")}${btn("End task", "danger")}</div>`;

  /* G: sorted by impact */
  const ALL = [...PAPPS, ...PBG, ...PSYS].sort((a, b) => b[2] - a[2]);
  const gRow = ([n, c, cpu, mem, , , , procs, , note, seed], sel) => `<div class="p-gr ${sel ? "sel" : ""}">${aic(n, c)}<div class="tx"><b>${n}${procs > 1 ? `<span class="p-sub"> · ${procs} processes</span>` : ""}</b><span class="${note ? "note" : ""} ${note.startsWith("Using a lot") ? "warn" : ""}">${note || "Quiet"}</span></div>
    <span class="p-spark">${gline(series(seed, 30, Math.min(.9, cpu / 50 + .08), Math.min(.25, cpu / 120 + .04)), cpu > 5 ? "var(--sw-amber)" : "var(--dim-text)", 24)}</span><span class="p-num big">${cpu.toFixed(1)}%</span><span class="p-num mem">${mem}</span></div>`;
  const sheet = () => `<aside class="p-sheet">
    <div class="sh">${aic("Blender", "amber")}<div><b>Blender</b><span>Using a lot of the processor for 6 minutes</span></div>${ib("x", "Close")}</div>
    <div class="p-big">${gline(series(1, 60, .5, .25), "var(--sw-amber)", 90)}<div class="lg"><span>Last minute</span><span>41.2% now</span></div></div>
    <div class="p-kv">${[["Memory", "3.8 GB"], ["Disk", "12 MB/s"], ["GPU", "62%"], ["Threads", "48"]].map(([k, v]) => `<div><span>${k}</span><b>${v}</b></div>`).join("")}</div>
    <div class="lab">Its processes</div><div class="card">${KIDS.map(([n, pid, c, m]) => `<div class="row"><span class="k">${n}</span><span class="v">${c.toFixed(1)}%</span><span class="v">${m}</span></div>`).join("")}</div>
    <div class="bt">${btn("Switch to", "", "window")}${btn("Pause", "", "pause")}<span class="grow"></span>${btn("End task", "danger")}</div></aside>`;
  const pageG = () => `<div class="p-tool">${["All", "Apps", "Background", "Mine", "Busy"].map((c, i) => chip(c + (i === 4 ? " · 3" : ""), i === 0 ? "on" : "")).join("")}<span class="sp"></span><div class="field p-filter s">${icon("filter")}<span class="ph">Filter</span></div></div>
    <div class="cols"><div class="main"><div class="p-gh2"><span>Busiest first · 312 processes</span><span class="sp"></span><span class="c">CPU, last minute</span><span class="c n">Now</span><span class="c m">Memory</span></div><div class="scroll p-glist">${ALL.map((r, i) => gRow(r, i === 0)).join("")}</div></div>${NARROW ? "" : sheet()}</div>
    ${NARROW ? `<div class="p-foot">${aic("Blender", "amber")}<div class="tx"><b>Blender</b><span>Using a lot of the processor</span></div>${btn("Details", "", "chev-u")}${btn("End task", "danger")}</div>` : ""}`;

  REG("activity", {
    name: "Activity",
    summary: "Activity measures everything a task manager should, in depth, but the Overview hides it: the graphs are thumbnail squiggles in each tile's corner, the busiest list shows thread names twice over, and the detail pages are a click away with nothing pointing to them.",
    problems: [
      "<b>Graphs too small to read:</b> each Overview tile has a big number and a squiggle the size of an icon in its corner, so you can't see a trend at a glance.",
      "<b>The busiest list shows thread names, not apps:</b> “MainThread” appears three times, and two side-by-side pickers (By CPU, By Memory) list the same processes twice.",
      "<b>Temperature in red at all times:</b> 196 °F is shown in warning red even when that's normal for the chip, so the red stops meaning anything.",
      "<b>System details are cut off</b> at the bottom of the Overview, folded under a heading you have to open.",
      "<b>A lone pencil icon</b> edits the tiles, with no label; at 800 px Battery ends up as one tile stretched across the whole width.",
      "<b>Two searches:</b> Ctrl+F filters processes and Ctrl+K goes to anything, but the header has one magnifier icon for both.",
      "<b>Processes' details panel has eight buttons</b> in a row (Switch to, Close window, Pause, Priority, Open location, Copy command, Kill, End task), with the dangerous ones next to the harmless ones.",
      "<b>At 800 px</b> the rail is ten grey icons with no break between Monitor, Performance and System.",
      "<b>Processes looks scattered:</b> rows that open and rows that don't start at different places, so names zig-zag; group counts float in the middle of the Name column; PIDs show for some rows and are blank for others.",
      "<b>Columns don't line up with their headings:</b> the totals are crammed into the headings (“Disk 73.1 MiB”), Disk and GPU sit off to the left with empty space after them, and one random cell is highlighted.",
      "<b>Names without faces:</b> most rows have no icon, a few have a red placeholder, one has an emoji, and threads like “MainThread” appear as if they were apps.",
      "<b>Five ways to filter</b> (Apps, All, Tree, Mine, Group by app) in one row, and a lone icon button for columns; at 800 px Disk and GPU just vanish and names are cut off.",
    ],
    today: [["activity-1280", "Today at 1280 px", "Overview: tiles with tiny graphs, two busiest lists"], ["activity-800", "Today at 800 px", "Battery stretched across; busiest lists cut off"], ["activity-proc-1280", "Processes today at 1280 px", "Ragged names, floating counts, columns adrift"], ["activity-proc-800", "Processes today at 800 px", "Columns drop out; names cut off"]],
    options: [
      { id: "a", name: "Task manager with tabs", idea: "Four tabs in the header instead of a sidebar: Processes, Performance, Startup and Services. Processes is the full-width table with busy cells shaded, and the selected process's actions in a drawer at the foot. Performance lists every device with a small live graph down the left; pick one to see its big graph and numbers. Services shows the log beside the list, with Restart and Stop labelled.",
        shots: [
          ["b-processes","Processes","Full-width table, actions in a drawer"],
          ["b-performance-800","Performance at 800 px","Devices on the left, CPU in detail"],
          ["b-services","Services","A failed service and its log"],
        ] },
      { id: "b", name: "A dashboard you arrange", idea: "The first page is a dashboard of big cards: CPU with a heat strip of every thread, memory split into apps, kernel and cache, every disk's fullness, network, GPU, sensors and the busiest apps. Problems come first, in plain words, with a button to deal with them. Edit the dashboard to show, hide and reorder cards and to set when Activity warns you.",
        shots: [
          ["c-dashboard","Dashboard","Warnings first, then big cards"],
          ["c-edit","Editing the dashboard","Cards to show and when to warn"],
          ["c-dashboard-800","At 800 px","Rail; cards in two columns"],
        ] },
      { id: "c", name: "One timeline you can scrub", idea: "The first page stacks every reading on one shared clock: CPU, memory, GPU, disk, network, temperature and battery as long lanes, each with its value now, and markers where something happened (an app started, memory passed a limit). Drag back across the lanes and every value, and the busiest list below, show that moment, so “why did it slow down at 14:06?” has an answer. Choose a lane's name for its full page; Startup and Services are in the header. Best for working out what went wrong.",
        shots: [
          ["n1-timeline", "Timeline", "Every reading on one clock, live, with the busiest apps below"],
          ["n1-past", "Looking back", "Dragged back to a spike: values and apps at 14:06, a process's menu"],
          ["n1-timeline-800", "At 800 px", "Narrower lanes, fewer columns"],
        ] },
      { id: "d", name: "A map of what's using it", idea: "The first page is a map: every app is a block sized by how much memory it uses (or CPU, disk, GPU or network: pick at the top, where the live readings are). The biggest users are obvious at once, the kernel and idle time are blocks of their own, and choosing a block opens the app with its graphs, its processes and End task, which asks before closing an app with unsaved work. List switches to the full process table; Startup and Services are in the header. Best if you mostly open Activity to find what's hogging the machine.",
        shots: [
          ["n2-map", "Map by memory", "Apps as blocks sized by memory; Blender open on the right"],
          ["n2-cpu", "Map by CPU", "Blender opened into its processes; ending one asks first"],
          ["n2-map-800", "At 800 px", "The map fills the window; the app in a bar below"],
        ] },
      { id: "e", name: "Processes: apps and what they run", idea: "For the picked dashboard (B): its Processes page as one row per app, with its icon (Umbra's tile, or a letter on one for apps without their own), a CPU bar, memory, disk and network in aligned columns. An app opens to show its own processes, indented under it. Apps, Background and System sit under their own coloured headings with counts, and the chosen app's graphs, facts and labelled actions (Switch to, Pause, End task) are in an inspector on the right. Best if you think in apps, not process names.",
        shots: [
          ["e-list", "Processes", "Apps first, Blender opened into its processes, details on the right"],
          ["e-list-800", "At 800 px", "Rail; Name, CPU and Memory; the app's actions in a bar below"],
        ] },
      { id: "f", name: "Processes: a clean table", idea: "For the picked dashboard (B): its Processes page as a tidy table. Six columns by default (Name, CPU, Memory, Disk, Network, GPU), every number lined up, busy cells softly tinted, and the headings with the totals beside them and an arrow for the sort. Apps, Background and System are headed groups you can fold. The selected process's actions, Priority included, sit in a bar along the foot. Best if you like a classic task manager.",
        shots: [
          ["f-table", "Processes", "Six aligned columns, headed groups, actions along the foot"],
          ["f-table-800", "At 800 px", "Rail; Name, CPU and Memory; the foot bar keeps its actions"],
        ] },
      { id: "g", name: "Processes: sorted by impact", idea: "For the picked dashboard (B): its Processes page as one calm list, busiest first. Each row says in plain words what it's doing (“Using a lot of memory”, “Writing to disk”, “Syncing 2 folders”), with a small graph of its last minute, CPU now and memory. Chips filter All, Apps, Background, Mine and Busy, and the chosen one opens in a sheet beside the list with its graph, its processes and End task. Best if you open Activity to find out what's slowing things down.",
        shots: [
          ["g-impact", "Processes", "Busiest first, in plain words, each with its last minute"],
          ["g-impact-800", "At 800 px", "Rail; the list fills the window, the chosen one in a bar below"],
        ] },
    ],
    pages: {
      "a-overview": () => win({ hdr: hdr(), side: sideA("overview"), page: overviewA() }),
      "a-processes": () => win({ hdr: hdr(), side: sideA("processes"), page: processesA() }),
      "b-processes": () => win({ hdr: hdrB("Processes"), side: "", page: processesB() }),
      "b-performance": () => win({ hdr: hdrB("Performance"), side: "", page: perfB() }),
      "b-services": () => win({ hdr: hdrB("Services"), side: "", page: servicesB() }),
      "c-dashboard": () => railed(win({ hdr: hdr(), side: sideC(), page: dashC() })),
      "n1-timeline": () => win({ hdr: hdrN(), side: "", page: pageN1() }),
      "n1-past": () => win({ hdr: hdrN({ paused: true }), side: "", page: pageN1({ at: 0.71, menu: true }) }),
      "n2-map": () => win({ hdr: hdrN(), side: "", page: pageN2() }),
      "n2-cpu": () => win({ hdr: hdrN(), side: "", page: pageN2({ by: "CPU", confirm: true }) }),
      "e-list": () => win({ hdr: hdr(), side: sideP(), page: pageE() }),
      "f-table": () => win({ hdr: hdr(), side: sideP(), page: pageF() }),
      "g-impact": () => win({ hdr: hdr(), side: sideP(), page: pageG() }),
      "c-edit": () => railed(win({ hdr: hdr(), side: sideC(), page: `<div class="cols"><div class="main">${dashC({ edit: true })}</div>${editPanel()}</div>` })),
    },
    icons: {
      pulse: '<path d="M3 12h4l2.5-6 5 12L17 12h4"/>',
      cpu: '<rect x="6" y="6" width="12" height="12" rx="2"/><rect x="9.5" y="9.5" width="5" height="5" rx="1"/><path d="M9.5 3v3M14.5 3v3M9.5 18v3M14.5 18v3M3 9.5h3M3 14.5h3M18 9.5h3M18 14.5h3"/>',
      memory: '<rect x="3" y="7" width="18" height="10" rx="2"/><path d="M7 10.5v3M10.5 10.5v3M14 10.5v3M17.5 10.5v3M6.5 17v2.5M12 17v2.5M17.5 17v2.5"/>',
      gpu: '<rect x="2.5" y="6" width="19" height="11" rx="2"/><circle cx="9" cy="11.5" r="2.8"/><path d="M15 9.5h3.5M15 13.5h3.5M5 17v2.5"/>',
      thermo: '<path d="M14 14.8V5a2 2 0 0 0-4 0v9.8a4 4 0 1 0 4 0z"/><path d="M12 11v5"/>',
      rocket: '<path d="M12 15.5 8.5 12C10 6.5 14 3.5 20.5 3.5 20.5 10 17.5 14 12 15.5z"/><path d="M8.5 12 5 11.5l2.5-3.5h4M12 15.5l.5 3.5 3.5-2.5v-4M5.5 18.5c.5-2 1.5-2.5 3-2"/>',
      cog: '<circle cx="12" cy="12" r="3"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1"/>',
      grip: '<path d="M9 6h.01M15 6h.01M9 12h.01M15 12h.01M9 18h.01M15 18h.01" stroke-width="2.6"/>',
      stop: '<rect x="6" y="6" width="12" height="12" rx="2"/>',
      upload: '<path d="M12 20.5v-11M7.5 14 12 9.5l4.5 4.5M5 4h14"/>',
    },
  });
})();
