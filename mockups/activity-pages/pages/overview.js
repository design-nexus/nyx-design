// Activity › Dashboard: a second pass on the dashboard Ken picked on the revamp page (B).
(() => {
  const S = (seed, base, amp) => series(seed, 50, base, amp);
  const problems = () => `<div class="ov-probs">
    ${note("alert", "xdg-document-portal failed on 11 Nov at 04:13", "The Flatpak document portal stopped with an error.", "bad", btn("See log", "sm"))}
    ${note("drive", "/mnt/nas didn't mount at 00:10", "The log says why.", "warn", btn("See log", "sm"))}
  </div>`;
  // The cards, the same set as today.
  const cpuCard = (o = {}) => acard("CPU", `${readings([["Busy", "61%", "4.32 GHz · load 3.29"]], { cls: "sm" })}${graph(S(1, .45, .25), "var(--sw-blue)", o.h || 64, { top: "100%" })}`, { ic: "cpu", meta: "16 threads", end: `<span class="ov-go">${icon("chev-r")}</span>`, cls: "ov-c" });
  const memCard = () => acard("Memory", `${readings([["In use", "22.8 GB", "of 30.8 GB"]], { cls: "sm" })}${stack([[69, "var(--sw-amber)", "Apps", "21.4 GB"], [4, "var(--sw-violet)", "Kernel", "1.3 GB"], [27, "var(--sw-teal)", "Cache", "8.3 GB"]])}<span class="ov-s">Swap and zram: 2.9 GB used, packed 2.5 to 1</span>`, { ic: "memory", end: `<span class="ov-go">${icon("chev-r")}</span>`, cls: "ov-c" });
  const diskCard = () => acard("Storage", `${[["/", 74, "1.4 of 1.9 TB"], ["/boot", 75, "1.5 of 2.0 GB"]].map(([m, p, v]) => `<div class="ov-mnt"><span>${m}</span>${meterBar(p)}<span class="v">${v}</span></div>`).join("")}<span class="ov-s">${icon("download")} Read 55 MB/s · ${icon("upload")} write 0 B/s</span>`, { ic: "drive", end: `<span class="ov-go">${icon("chev-r")}</span>`, cls: "ov-c" });
  const netCard = (o = {}) => acard("Network", `${readings([["Down", "3.6 KB/s", "831 B/s up"]], { cls: "sm" })}${graph(S(5, .3, .2), "var(--sw-pink)", o.h || 46, { top: "10 KB/s", more: [[S(9, .1, .06), "var(--sw-graphite)"]] })}<span class="ov-s">Wi-Fi 7 · 6 GHz · signal fair · SkyNet</span>`, { ic: "wifi", end: `<span class="ov-go">${icon("chev-r")}</span>`, cls: "ov-c" });
  const gpuCard = (o = {}) => acard("GPU", `${readings([["Busy", "9%", "Arc Pro 130T · 1.2 GB"]], { cls: "sm" })}${graph(S(7, .12, .08), "var(--sw-violet)", o.h || 46)}<span class="ov-s">Render 9% · compute 0% · copy 0%</span>`, { ic: "gpu", end: `<span class="ov-go">${icon("chev-r")}</span>`, cls: "ov-c" });
  const sensCard = () => acard("Sensors", kv([["CPU package", "78 °C"], ["NVMe", "30 °C"], ["Fans", "2,719 rpm"], ["Battery", "100%, full"]]), { ic: "thermo", end: `<span class="ov-go">${icon("chev-r")}</span>`, cls: "ov-c" });
  const busyCard = (o = {}) => acard("Busiest right now", APPS_NOW.slice(0, o.n || 4).map((a) => appRow(a, `${a[2].toFixed(1)}%`, a[2] * 2, { sub: a[3] })).join(""), { ic: "listic", end: `<span class="ov-lnk">All processes</span>`, cls: "ov-c", span: o.span });

  /* A: the same cards, calmer: problems in one strip, every card the same height with its graph
     filling the bottom, the busiest list as apps (not windows), Startup as a line at the foot. */
  const strip = () => `<div class="ov-strip">${icon("alert")}<b>2 things need a look</b><span class="it bad">xdg-document-portal failed on 11 Nov</span><span class="it warn">/mnt/nas didn't mount</span><span class="sp"></span>${btn("Show", "sm")}</div>`;
  const dashA = () => `<div class="ap-body scroll">${strip()}
    <div class="ap-grid ov-ga" style="--cols:${NARROW ? 1 : 3}">${cpuCard({ h: 70 })}${memCard()}${diskCard()}${netCard({ h: 70 })}${gpuCard({ h: 70 })}${sensCard()}${busyCard({ span: NARROW ? 1 : 2, n: 5 })}
      ${acard("Startup", `<div class="ov-su"><span><b>15</b> apps start at login</span><span>Last login took <b>6.6 s</b></span><span class="bad"><b>2</b> services failed</span></div>`, { ic: "rocket", end: `<span class="ov-lnk">Manage</span>`, cls: "ov-c ov-top" })}
    </div></div>`;

  /* B: readings first: a row of rings for the six things Activity watches, each opening its page;
     below, what's using them (the busiest apps) beside one shared history of the last 10 min. */
  const RINGS = [["CPU", 61, "var(--sw-blue)", "61%", "4.3 GHz"], ["Memory", 74, "var(--sw-amber)", "74%", "22.8 GB"], ["Storage", 74, "var(--sw-teal)", "74%", "1.4 TB"], ["Network", 12, "var(--sw-pink)", "3.6", "KB/s down"], ["GPU", 9, "var(--sw-violet)", "9%", "1.2 GB"], ["Temperature", 78, "var(--sw-coral)", "78°", "CPU"]];
  const dashB = () => `<div class="ap-body scroll">${problems()}
    <div class="ov-rings">${RINGS.map(([n, p, c, v, s]) => `<div class="card ov-r">${dial(p, c, NARROW ? 70 : 84, v, s)}<span class="n">${n}</span></div>`).join("")}</div>
    <div class="ap-grid" style="--cols:${NARROW ? 1 : 2}">
      ${acard("Using it most", `<div class="ov-tabs">${seg(["CPU", "Memory", "Disk", "GPU"], "CPU")}</div>${APPS_NOW.slice(0, 6).map((a) => appRow(a, `${a[2].toFixed(1)}%`, a[2] * 2)).join("")}`, { ic: "listic", end: `<span class="ov-lnk">All processes</span>` })}
      ${acard("The last 10 minutes", `${graph(shaped(1, 60, .3, .1, [[.66, .4, .05]]), "var(--sw-blue)", 150, { from: "10 min ago", more: [[shaped(4, 60, .66, .02), "var(--sw-amber)"], [shaped(7, 60, .1, .06, [[.66, .3, .04]]), "var(--sw-violet)"]], mark: [.66, "Blender began a render"] })}<div class="ap-lg"><span><i style="background:var(--sw-blue)"></i>CPU</span><span><i style="background:var(--sw-amber)"></i>Memory</span><span><i style="background:var(--sw-violet)"></i>GPU</span></div>`, { ic: "history", end: seg(["10 min", "1 h"], "10 min") })}
    </div></div>`;

  /* C: two columns: what needs a look and what's busy on the left, the readings on the right. */
  const dashC = () => `<div class="ap-body scroll"><div class="ov-c2">
    <div class="ov-left">
      ${acard("Needs a look", `${note("alert", "xdg-document-portal failed", "11 Nov at 04:13 · Flatpak document portal", "bad", btn("Log", "sm"))}${note("drive", "/mnt/nas didn't mount", "00:10 today", "warn", btn("Log", "sm"))}${note("thermo", "CPU has been above 75 °C for 6 min", "Blender is rendering", "", "")}`, { ic: "alert" })}
      ${busyCard({ n: 6 })}
    </div>
    <div class="ov-right">${cpuCard({ h: 54 })}${memCard()}${netCard({ h: 40 })}${diskCard()}</div>
  </div></div>`;

  REG("overview", {
    name: "Dashboard",
    summary: "The dashboard you picked (B) is built: problems first, then a card for every reading. Up close it's busy in places and thin in others, and the Startup card falls off the bottom.",
    problems: [
      "<b>Two problem banners take a full row each</b>, so at 1280 px every card starts a third of the way down.",
      "<b>The CPU card's strip of threads is sixteen identical blocks</b>, with the graph squeezed into the corner above it.",
      "<b>Network and GPU graphs are thumbnails</b> in the bottom-right corner of their cards; Storage has no graph and a lot of empty space.",
      "<b>Busiest right now lists Foot twice</b> (two terminal windows), because it lists windows, not apps.",
      "<b>Every card has a blue Details link</b>, five times on one screen, though the whole card could open its page.",
      "<b>Startup is cut off</b> at the bottom at 1280 × 800, its line running off to the right.",
    ],
    today: [["overview-1280", "Today at 1280 px", "Two banners, cards of uneven weight"], ["overview-800", "Today at 800 px", ""]],
    options: [
      { id: "a", name: "The same cards, calmer", idea: "The same cards in three even columns. The problems become one strip (“2 things need a look”) that opens to the list; every card is the same height with its graph filling the bottom; a chevron instead of Details, and the whole card opens its page. Busiest right now lists apps, so Foot appears once. Startup is a line at the foot.",
        shots: [["a-dash", "Dashboard", "One problem strip, even cards, apps not windows"], ["a-dash-800", "At 800 px", "One column under the rail"]] },
      { id: "b", name: "Readings first", idea: "A row of six rings (CPU, memory, storage, network, GPU, temperature), each opening its page, read at a glance. Below them, what's using the machine (the busiest apps, by CPU, memory, disk or GPU) beside one shared history of the last 10 minutes, with what happened marked on it.",
        shots: [["b-dash", "Dashboard", "Rings, then the busiest apps beside one history"], ["b-dash-800", "At 800 px", "Rings wrap; the history under the apps"]] },
      { id: "c", name: "What needs a look, then the readings", idea: "Two columns. The left one is about you: what needs a look (failures, a hot CPU, a full disk), then the busiest apps. The right one is the machine: CPU, memory, network and storage as compact cards. Best if you open Activity to find out what's wrong.",
        shots: [["c-dash", "Dashboard", "Needs a look and busiest on the left, readings on the right"]] },
    ],
    pages: {
      "a-dash": () => apage("overview", dashA(), { end: btn("Edit", "ghost", "pen") }),
      "b-dash": () => apage("overview", dashB(), { end: btn("Edit", "ghost", "pen") }),
      "c-dash": () => apage("overview", dashC(), { end: btn("Edit", "ghost", "pen") }),
    },
  });
})();
