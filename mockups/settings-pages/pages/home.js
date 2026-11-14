// Home: this computer, quick settings, live activity, storage and updates. Three style-B layouts.
(() => {
  const head = (end = "") => `<div class="shead bare hm-head" style="--sc:var(--sec-home)"><div class="sh2"><b>Home</b><span>This computer at a glance: what it's doing, its space and its updates.</span><span class="sp"></span>${end}</div></div>`;
  const page = (body, end) => () => win({ hdr: shdr(), side: sside("home"), page: `${head(end ? end() : "")}${body()}` });
  const H = "home";
  const CPU = [0.12, 0.08, 0.1, 0.22, 0.18, 0.09, 0.07, 0.3, 0.42, 0.25, 0.12, 0.1, 0.08, 0.15, 0.11, 0.09, 0.2, 0.14, 0.08, 0.07, 0.1, 0.06, 0.12, 0.09];
  const MEM = [0.4, 0.4, 0.41, 0.41, 0.42, 0.42, 0.42, 0.44, 0.45, 0.44, 0.43, 0.43, 0.42, 0.42, 0.41, 0.41, 0.42, 0.41, 0.41, 0.41, 0.41, 0.41, 0.41, 0.41];
  const NET = [0.05, 0.1, 0.08, 0.3, 0.55, 0.4, 0.2, 0.1, 0.06, 0.05, 0.15, 0.6, 0.75, 0.5, 0.3, 0.12, 0.08, 0.05, 0.04, 0.2, 0.35, 0.18, 0.1, 0.06];
  const CORES = [12, 4, 8, 30, 6, 3, 9, 2, 18, 5, 7, 3, 22, 4, 6, 2];
  const chart = (vals, c, h = 70, w = 300) => spark(vals, { w, h, c }).replace("<svg ", '<svg preserveAspectRatio="none" ');
  // [icon, name, value, detail, pct, colour]
  const GAUGES = [["chip", "Processor", "7%", "16 cores", 7, "var(--sec-home)"], ["layers", "Memory", "41%", "13.2 of 32 GB", 41, "var(--sw-violet)"], ["drive", "Disk", "62%", "380 GB free", 62, "var(--sw-blue)"], ["battery", "Battery", "86%", "About 5 h left", 86, "var(--success)"], ["sun", "Temperature", "52°", "Processor", 52, "var(--sw-amber)"]];
  const orb = (cls = "") => `<span class="orb ${cls}"></span>`;
  const me = () => `<div class="hm-me card">${orb("big")}<div class="tx"><b>Atlas</b><span>Lumen Book 14</span></div>${btn("About", "sm ghost")}</div>`;
  const facts = () => `<div class="hm-facts">${[["Omarchy", "4.5.1"], ["Kernel", "7.2.9"], ["Processor", "Core Ultra 7"], ["Memory", "32 GB"], ["Hyprland", "0.57.2"], ["Up for", "2 days 4 h"]].map(([k, v]) => `<div><small>${k}</small><span>${v}</span></div>`).join("")}</div>`;
  const quick = () => ocard("Quick settings", [
    orow("Do not disturb", "Until you turn it off", sw(false), { ic: "moon", sec: H }),
    orow("Power", "For now", seg(["Saver", "Balanced", "Fast"], "Balanced"), { ic: "power", sec: H }),
  ], { cls: "icons" });
  const actions = () => `<div class="hm-acts">${btn("Lock", "", "lock")}${btn("Snapshot", "", "hist")}${btn("Restart", "dtext", "refresh")}${btn("Shut down", "dtext", "power")}</div>`;
  const updCard = () => `<div class="hm-upd card"><span class="lic" style="--tc:var(--sec-system)">${icon("download")}</span><div class="opt-text"><div><b>12 updates</b> · 412 MB</div><div class="d">Omarchy 4.5.1 and 11 packages · checked 10 min ago</div></div>${btn("Update", "primary sm", "download")}</div>`;
  const cores = () => `<div class="hm-cores">${CORES.map((p, i) => `<div><small>${i + 1}</small><span class="cb"><b style="width:${Math.max(4, p * 2.5)}%"></b></span></div>`).join("")}</div>`;

  /* ── A: controls beside a live dashboard ──────────────────────────── */
  const aCtl = () => `${me()}${facts()}${quick()}
    <div class="gtitle">Updates</div>${updCard()}
    <div class="gtitle">Quick actions</div>${actions()}`;
  const ringG = ([ic, n, v, d, p, c]) => `<div class="hm-g">${ring(p, { size: 70, c, label: v })}<b>${n}</b><span>${d}</span></div>`;
  const aPv = () => `${pvhead("Right now", "The last minute, updated every second while Home is open.", "")}
     <div class="hm-rings card">${GAUGES.map(ringG).join("")}</div>
     <div class="hm-charts">
       <div class="hm-ch card"><div class="r1"><b>Processor</b><span>7%</span></div>${chart(CPU, "var(--sec-home)")}${cores()}</div>
       <div class="hm-ch2">
         <div class="hm-ch card"><div class="r1"><b>Memory</b><span>13.2 GB used</span></div>${chart(MEM, "var(--sw-violet)", 44)}</div>
         <div class="hm-ch card"><div class="r1"><b>Network</b><span>↓ 2.1 MB/s · ↑ 180 kB/s</span></div>${chart(NET, "var(--sw-blue)", 44)}</div>
       </div>
     </div>
     <div class="hm-stor card">${icon("drive")}<div class="tx"><div class="r1"><b>Storage</b><span>620 GB used of 1 TB · 1,284 packages</span></div><div class="hm-sbar"><b style="width:38%;background:var(--sw-blue)"></b><b style="width:14%;background:var(--sw-violet)"></b><b style="width:10%;background:var(--sw-teal)"></b></div><div class="hm-sleg"><span><i style="background:var(--sw-blue)"></i>Your files 380 GB</span><span><i style="background:var(--sw-violet)"></i>Apps 140 GB</span><span><i style="background:var(--sw-teal)"></i>System 100 GB</span></div></div>${btn("Disks", "sm")}</div>`;
  const aBody = () => split(aCtl(), aPv(), { sec: H, cls: "hm-a", ctlw: 400 });

  /* ── B: pick a gauge ──────────────────────────────────────────────── */
  const ROWS = () => [["chip", "Processor", "7%", spark(CPU.slice(8), { w: 72, h: 22, c: "var(--sec-home)" }), true], ["layers", "Memory", "13.2 of 32 GB", `<span class="mm">${prog(41)}</span>`], ["drive", "Disk", "380 GB free", `<span class="mm">${prog(62)}</span>`], ["battery", "Battery", "86% · 5 h left", `<span class="mm ok">${prog(86, "ok")}</span>`], ["sun", "Temperature", "52 °C", `<span class="mm warn">${prog(52, "warn")}</span>`], ["network", "Network", "↓ 2.1 MB/s", spark(NET.slice(6), { w: 72, h: 22, c: "var(--sw-blue)" })], ["download", "Updates", "12 ready", `<span class="pill" style="--tc:var(--sec-system)">412 MB</span>`]];
  const bCtl = () => `${quick()}
    ${ocard("This computer", ROWS().map(([ic, n, v, vis, on]) => `<div class="opt ${on ? "picked" : ""}"><span class="lic" style="--tc:var(--sec-home)">${icon(ic)}</span><div class="opt-text"><div>${n}</div><div class="d">${v}</div></div>${vis}${icon("chev-r", "cv")}</div>`), { cls: "icons hm-list" })}
    ${actions()}`;
  const bPv = () => `${pvhead("Processor", "Intel Core Ultra 7 · 16 cores · up to 4.8 GHz", seg(["1 min", "10 min", "1 h"], "1 min"))}
     <div class="hm-big card"><div class="r1"><div><b>7%</b><span>busy now</span></div><div><b>42%</b><span>highest this minute</span></div><div><b>1.4 GHz</b><span>speed now</span></div></div>
       <div class="hm-plot"><div class="ya"><span>100%</span><span>50%</span><span>0</span></div>${chart(CPU, "var(--sec-home)", 170, 520)}</div><div class="xa"><span>60 s ago</span><span>30 s</span><span>now</span></div></div>
     <div class="card hm-cc"><div class="r1"><b>Each core</b><span>Busiest now: core 4 at 30%</span></div>${cores()}</div>
     <div class="pvfoot">${icon("check-c")}<span>Running cool and quiet in Balanced. Fast lets it go to 4.8 GHz.</span><span class="sp"></span><span class="lnk">Power & Battery ${icon("chev-r")}</span></div>`;
  const bBody = () => split(bCtl(), bPv(), { sec: H, cls: "hm-b", ctlw: 380 });

  /* ── C: updates first ─────────────────────────────────────────────── */
  const PK = [["Linux kernel", "7.2.8 → 7.2.9", "Restart"], ["Mesa", "26.1.1 → 26.1.2", ""], ["Hyprland", "0.57.1 → 0.57.2", "Sign out"], ["Firefox", "151.0 → 151.0.2", ""], ["PipeWire", "1.6.2 → 1.6.3", ""]];
  const meterRow = ([ic, n, v, d, p, c]) => `<div class="hm-mr"><span class="lic" style="--tc:var(--sec-home)">${icon(ic)}</span><div class="tx"><div class="r1"><b>${n}</b><span>${v} · ${d}</span></div><span class="cb"><b style="width:${p}%;background:${c}"></b></span></div></div>`;
  const cCtl = () => `${me()}
    <div class="card hm-mrs">${GAUGES.map(meterRow).join("")}</div>
    ${quick()}
    <div class="gtitle">Quick actions</div>${actions()}`;
  const cPv = () => `${pvhead("12 updates ready", "412 MB · about 4 minutes · checked 10 minutes ago", `${btn("Check now", "sm ghost", "refresh")}${btn("Update now", "primary", "download")}`)}
     <div class="hm-om card"><span class="lic" style="--tc:var(--sec-system)">${icon("nyxapp")}</span><div class="tx"><div class="r1"><b>Omarchy 4.5.1</b>${chip("Release notes", "acc")}</div>
       <ul><li>Themes switch about twice as fast.</li><li>The bar keeps its place when a second screen is plugged in.</li><li>Fixes for the lock screen on 120 Hz screens.</li></ul></div></div>
     <div class="hm-grp card"><div class="gh"><b>System packages</b><span>9 · from the Arch and Omarchy repositories</span></div>
       ${PK.map(([n, v, w]) => `<div class="pk"><span>${n}</span><span class="v">${v}</span>${w ? `<span class="pill" style="--tc:var(--warning)">${w} needed</span>` : "<span></span>"}</div>`).join("")}
       <div class="pk more"><span class="acc">4 more</span></div></div>
     <div class="hm-row3">
       <div class="card hm-s">${icon("pkg")}<div><b>AUR</b><span>2 updates · built here</span></div></div>
       <div class="card hm-s">${icon("cpu")}<div><b>Firmware</b><span>Up to date</span></div></div>
       <div class="card hm-s">${icon("puzzle")}<div><b>Settings</b><span>1 extension update</span></div></div>
     </div>
     <div class="pvfoot">${icon("hist")}<span>A snapshot is taken first, so you can go back from the boot menu.</span></div>`;
  const cBody = () => split(cCtl(), cPv(), { sec: H, cls: "hm-c", ctlw: 380 });

  REG("home", {
    name: "Home",
    summary: "Today Home is a long scrolling page: a card for the computer with its facts and an updates count, two quick settings, five ring gauges, four live charts, storage rows, then Updates and quick actions further down. Everything is there, but the live parts and the things you'd act on are spread over several screens.",
    problems: [
      "<b>One long column:</b> the gauges fill the first screen, the charts the second, storage and updates the third; the updates badge has to scroll the page to reach them.",
      "<b>Big rings with little in them:</b> five 150 px tiles say 7%, 66%, 75%; at 800 px they wrap to two rows and push everything else down.",
      "<b>Facts truncate at 800 px:</b> “4.5.0rc…”, “Intel Co…”, “2 days …” in a three-column grid squeezed beside the updates badge.",
      "<b>Actions far from what they act on:</b> Update now sits deep in the Updates group; Lock, Restart and Shut down are at the very bottom.",
      "<b>Charts with no scale:</b> the activity charts have no axes or peaks, and the cores are a grid of tiny meters in a card of their own.",
      "<b>Real machine details everywhere:</b> the model number, kernel build and Hyprland version are all top-level text, the same weight as the name.",
    ],
    today: [["home-1280", "Today", ""], ["home-800", "Today at 800 px", ""]],
    options: [
      { id: "a", name: "Controls beside a live dashboard", idea: "Everything you'd do on Home is in the left column, top to bottom: the computer and its facts, the two quick settings, the updates waiting with Update right on them, and Lock, Snapshot, Restart and Shut down. The right is the live picture, all on one screen: five smaller gauges in a row, the processor with each core, memory and network, and storage as one bar split into your files, apps and the system.",
        shots: [["a-dash", "Controls and the live dashboard", ""], ["a-dash-800", "At 800 px", "The dashboard above the controls"]] },
      { id: "b", name: "Pick a gauge", idea: "The left lists every reading as a row with its value and a small meter or line: processor, memory, disk, battery, temperature, network, updates. Picking one fills the right with it in depth: a chart with a scale, a minute or an hour, the highest point, and what it's made of (each core; for Disk each drive; for Updates the list). Quick settings and the session buttons stay at the top and bottom of the list.",
        shots: [["b-cpu", "Processor picked", ""], ["b-cpu-800", "At 800 px", ""]] },
      { id: "c", name: "Updates first", idea: "Home is where you're told about updates, so they're the picture: what's in Omarchy's release, the packages with the ones that need a restart marked, the AUR, firmware and Settings' own, with Update now in the heading. The left is the computer in one compact column: its readings as thin meters, quick settings, and the session buttons. When everything's up to date, the right shows the live activity from A instead.",
        shots: [["c-updates", "12 updates ready", ""], ["c-updates-800", "At 800 px", ""]] },
    ],
    pages: { "a-dash": page(aBody), "b-cpu": page(bBody), "c-updates": page(cBody) },
  });
})();
