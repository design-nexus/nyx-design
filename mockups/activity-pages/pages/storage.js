// Activity › Storage.
(() => {
  // [name, model, mounts [[path, used %, text]], read, write, busy %, temp, response]
  const DISKS = [
    ["Disk 0", "WD PC SN740 1 TB · NVMe", [["/", 74, "1.4 of 1.9 TB"], ["/boot", 75, "1.5 of 2.0 GB"]], "2.8 MB/s", "0 B/s", 4, "30 °C", "0.2 ms"],
    ["Disk 1", "Samsung 990 EVO 2 TB · NVMe", [["/home/ken/Media", 91, "1.8 of 2.0 TB"]], "0 B/s", "38 MB/s", 21, "41 °C", "0.6 ms"],
  ];
  const all = () => readings([["Reading", "2.8 MB/s", "3.7 TB since boot"], ["Writing", "38 MB/s", "4.4 TB since boot"], ["Busiest disk", "21%", "Disk 1"], ["Waiting on disk", "1%", "pressure, 1 min"]], { cols: NARROW ? 2 : 4 });
  const mounts = (m) => m.map(([p, u, t]) => `<div class="st-m"><span class="p">${p}</span>${meterBar(u, u > 90 ? "bad" : u > 80 ? "warn" : "")}<span class="v">${t}</span></div>`).join("");

  /* A: a card for every disk: how full each of its places is, its reading and writing, and how
     busy it is, with the graph only as tall as it needs to be. */
  const pageA = () => `<div class="ap-body scroll">${all()}
    ${DISKS.map(([n, m, ms, r, w, b, t, lat], i) => acard(n, `${mounts(ms)}<div class="st-io">${graph(shaped(i + 2, 60, i ? .3 : .05, i ? .2 : .03), "var(--sw-teal)", 56, { top: i ? "60 MB/s" : "10 MB/s", more: [[shaped(i + 5, 60, .05, .03), "var(--sw-blue)"]] })}${readings([["Read", r], ["Write", w], ["Busy", `${b}%`], ["Response", lat]], { cls: "sm", cols: NARROW ? 2 : 4 })}</div>`, { ic: "drive", meta: m, end: `<span class="st-t">${icon("thermo")}${t}</span>` })).join("")}
    ${note("drive", "/home/ken/Media is 91% full", "180 GB left. Most of it is videos in ~/Media/Raw.", "warn")}
  </div>`;

  /* B: one graph of all reading and writing, the disks as a list beside it. */
  const pageB = () => `<div class="ap-body scroll">${all()}
    <div class="st-b">
      ${acard("Reading and writing", `${graph(shaped(2, 60, .2, .15, [[.7, .4, .05]]), "var(--sw-teal)", 200, { top: "60 MB/s", more: [[shaped(5, 60, .05, .04), "var(--sw-blue)"]] })}<div class="ap-lg"><span><i style="background:var(--sw-teal)"></i>Write <b>38 MB/s</b></span><span><i style="background:var(--sw-blue)"></i>Read <b>2.8 MB/s</b></span></div>`, { end: seg(["1 min", "10 min"], "1 min") })}
      <div class="st-list">${DISKS.map(([n, m, ms, r, w, b], i) => `<div class="card st-d ${i ? "sel" : ""}"><div class="h">${icon("drive")}<b>${n}</b><span>${b}% busy</span></div><span class="mdl">${m}</span>${mounts(ms)}</div>`).join("")}</div>
    </div>
    ${acard("Writing most", [["ffmpeg", "green", "38 MB/s", 90], ["Syncthing", "graphite", "420 KB/s", 6], ["systemd-journald", "graphite", "88 KB/s", 2]].map(([n, c, v, p]) => appRow([n, c], v, p)).join(""))}
  </div>`;

  /* C: what's taking the space: the places on each disk by size, the biggest folders. */
  const pageC = () => `<div class="ap-body scroll">
    ${phead("Space", "3.9 TB across 2 disks · 1.4 TB free")}
    ${DISKS.map(([n, m, ms]) => acard(`${n} · ${m}`, ms.map(([p, u, t]) => `<div class="st-sp"><div class="r"><b>${p}</b><span>${t}</span></div>${stack(p === "/" ? [[38, "var(--sw-blue)", "System", "720 GB"], [26, "var(--sw-amber)", "Home", "490 GB"], [10, "var(--sw-violet)", "Flatpak and containers", "190 GB"]] : p === "/boot" ? [[75, "var(--sw-blue)", "Kernels", "1.5 GB"]] : [[64, "var(--sw-pink)", "Videos", "1.3 TB"], [27, "var(--sw-amber)", "Photos", "540 GB"]], { cls: "tall" })}</div>`).join(""), { ic: "drive" })).join("")}
    ${note("info", "Folder sizes are measured once a day", "Last measured at 03:00 · Measure now", "", btn("Measure now", "sm"))}
  </div>`;

  REG("storage", {
    name: "Storage",
    summary: "Storage has every disk and what it's doing, but most of the page is a throughput graph with nothing in it, and how full each disk is, the thing most people come here for, is a dash.",
    problems: [
      "<b>Throughput graphs are empty boxes</b>: a disk that's reading 0 B/s gets a full-width graph with a flat line.",
      "<b>How full a disk is shows “–, nothing mounted”</b> for the system disk, because the space is reported per partition and not tied back to the disk.",
      "<b>Four readings per disk in capitals</b> (active time, response time, space used, temperature), the same row repeated for every disk.",
      "<b>Requests and drive details</b> is folded away, and there's no hint of what's taking the space.",
    ],
    today: [["storage-1280", "Today at 1280 px", "Empty graphs, space as a dash"], ["storage-800", "Today at 800 px", ""]],
    options: [
      { id: "a", name: "A card for every disk", idea: "The totals in a row, then a card for every disk: how full each of its places is first, then a short graph of reading and writing, how busy it is and its temperature. A disk that's nearly full gets a plain note.",
        shots: [["a-disk", "Storage", "Space first, then activity, per disk"], ["a-disk-800", "At 800 px", ""]] },
      { id: "b", name: "One graph, the disks beside it", idea: "One graph of all reading and writing, with the disks as a list beside it (each with its places and how full they are) and the apps writing most below.",
        shots: [["b-disk", "Storage", "One graph, the disks as a list"]] },
      { id: "c", name: "What's taking the space", idea: "A page about space: each disk's places split into what's using them (system, home, Flatpak and containers, videos, photos), measured once a day so it never slows the machine.",
        shots: [["c-disk", "Storage", "Space by what's using it"]] },
    ],
    pages: { "a-disk": () => apage("storage", pageA()), "b-disk": () => apage("storage", pageB()), "c-disk": () => apage("storage", pageC()) },
  });
})();
