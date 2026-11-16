// Activity › Memory.
(() => {
  const PARTS = [[69, "var(--sw-amber)", "Apps", "21.4 GB"], [8, "var(--sw-pink)", "Shared and tmpfs", "2.4 GB"], [4, "var(--sw-violet)", "Kernel", "1.3 GB"], [19, "var(--sw-teal)", "Cache", "7.6 GB"]];
  const reads = () => readings([["In use", "21.9 GB", "of 30.8 GB · 71%"], ["Free for apps", "8.8 GB", "cache counts as free"], ["Swap and zram", "47%", "packed 2.5 to 1"], ["Waiting for memory", "0.0%", "pressure, 1 min", "good"]], { cols: NARROW ? 2 : 4 });
  const users = (n = 6) => [["Firefox", "coral", "2.1 GB", 28], ["Blender", "amber", "3.8 GB", 50], ["Foot", "graphite", "4.6 GB", 60], ["Code - OSS", "blue", "1.4 GB", 18], ["Hyprland", "teal", "2.0 GB", 26], ["Quickshell", "green", "108 MB", 2]].sort((a, b) => b[3] - a[3]).slice(0, n).map(([n, c, v, p]) => appRow([n, c], v, p)).join("");

  /* A: one bar of where it goes, the readings, then who's using it and the last 10 minutes. */
  const pageA = () => `<div class="ap-body scroll">
    ${phead("Memory", "30.8 GB of RAM · 16 GB of zram · no swap file", seg(["1 min", "10 min", "1 h"], "10 min"))}
    ${reads()}
    ${acard("Where it goes", stack(PARTS, { cls: "tall" }), { end: `<span class="mm-free">8.8 GB could be freed for apps</span>` })}
    <div class="ap-grid" style="--cols:${NARROW ? 1 : 2}">
      ${acard("Using it most", users(), { end: seg(["Apps", "Processes"], "Apps") })}
      ${acard("The last 10 minutes", `${graph(shaped(4, 60, .64, .02, [], [.6, .07]), "var(--sw-amber)", 120, { from: "10 min ago", more: [[shaped(6, 60, .45, .02), "var(--sw-teal)"]] })}<div class="ap-lg"><span><i style="background:var(--sw-amber)"></i>In use</span><span><i style="background:var(--sw-teal)"></i>Swap and zram</span></div>`)}
    </div></div>`;

  /* B: the apps as blocks sized by the memory they use, kernel and cache as blocks of their own. */
  const BLOCKS = [["Foot", "graphite", "4.6 GB", 0, 0, 34, 56], ["Blender", "amber", "3.8 GB", 0, 56, 34, 44], ["Cache", "teal", "7.6 GB", 34, 0, 30, 100, "sys"], ["Firefox", "coral", "2.1 GB", 64, 0, 20, 50], ["Hyprland", "teal", "2.0 GB", 84, 0, 16, 50], ["Shared", "pink", "2.4 GB", 64, 50, 18, 50, "sys"], ["Code - OSS", "blue", "1.4 GB", 82, 50, 11, 50], ["Kernel", "violet", "1.3 GB", 93, 50, 7, 50, "sys"]];
  const pageB = () => `<div class="ap-body scroll">
    ${reads()}
    <div class="mm-map">${BLOCKS.map(([n, c, v, x, y, w, h, k]) => `<div class="mm-b ${k || ""} ${w < 12 ? "tiny" : ""}" style="left:${x}%;top:${y}%;width:${w}%;height:${h}%;--bc:var(--sw-${c})"><b>${n}</b><span>${v}</span></div>`).join("")}</div>
    <div class="mm-cap">${icon("info")}Cache is kept to make files open faster and is given back whenever an app needs it. Choose a block to see the app.</div>
  </div>`;

  /* C: the pressure first: is memory a problem, and if so who, then the parts underneath. */
  const pageC = () => `<div class="ap-body scroll">
    <div class="mm-c">
      <div class="card mm-state">${dial(71, "var(--sw-amber)", 120, "71%", "in use")}<div class="tx"><b>Plenty left</b><span>Apps are never waiting for memory. 8.8 GB more can be given to apps before anything slows down.</span>${stack(PARTS, { legend: false })}</div></div>
      ${acard("Swap and zram", `${readings([["Used", "7.4 GB", "of 16 GB"], ["Packed into", "2.9 GB", "2.5 to 1"]], { cls: "sm" })}${meterBar(47)}`)}
    </div>
    <div class="ap-grid" style="--cols:${NARROW ? 1 : 2}">${acard("Using it most", users(5))}${acard("Promised to apps", `${readings([["Committed", "49.0 GB", "64% of the 76.8 GB limit"]], { cls: "sm" })}${meterBar(64)}<span class="mm-s">Apps have asked for more than there is; that's normal, most is never used.</span>`)}</div>
  </div>`;

  REG("memory", {
    name: "Memory",
    summary: "Memory has a lot of good detail (where it goes, compression, what's promised, pressure), but it's laid out as the CPU page is, a ring beside an empty graph, and the busiest list repeats one app.",
    problems: [
      "<b>The ring and history repeat each other</b>: 71% in the ring, a flat line at 71% in a graph scaled to 100%.",
      "<b>Where it goes</b> is a thin bar under the fold with six parts in small type; it's the page's best part.",
      "<b>Swap, compression, promised and waiting</b> are four readings in a row with no sense of whether any of them is a problem.",
      "<b>Top consumers lists Foot three times</b> (one per window), so the real biggest user is hidden.",
    ],
    today: [["memory-1280", "Today at 1280 px", "Ring, flat graph, where it goes below"], ["memory-800", "Today at 800 px", ""]],
    options: [
      { id: "a", name: "Where it goes, then who", idea: "The readings in a row, then one tall bar of where memory goes (apps, shared, kernel, cache) with how much could be freed, then the apps using it most beside the last 10 minutes.",
        shots: [["a-mem", "Memory", "Readings, where it goes, who's using it"], ["a-mem-800", "At 800 px", ""]] },
      { id: "b", name: "A map of what's in memory", idea: "The apps as blocks sized by the memory they use, with cache, shared memory and the kernel as blocks of their own, so the biggest user is obvious and cache is plainly separate. Choosing a block opens the app.",
        shots: [["b-mem", "Memory", "Apps, cache and the kernel as blocks"]] },
      { id: "c", name: "Is it a problem?", idea: "The page starts with the answer: “Plenty left” (or “Apps are waiting for memory”) in plain words, with how much more apps can have. Swap and compression, what's promised to apps, and the biggest users follow.",
        shots: [["c-mem", "Memory", "A plain answer first, the parts below"]] },
    ],
    pages: { "a-mem": () => apage("memory", pageA()), "b-mem": () => apage("memory", pageB()), "c-mem": () => apage("memory", pageC()) },
  });
})();
