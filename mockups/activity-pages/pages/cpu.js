// Activity › CPU.
(() => {
  const CORES = [72, 64, 58, 41, 38, 33, 22, 18, 12, 9, 14, 8, 6, 11, 5, 4];
  const busy = (o = {}) => readings([["Busy", "36%", "of 16 threads"], ["Speed", "3.09 GHz", "fastest 5.10 · max 5.40"], ["Load", "5.65", "5 min 3.64 · 15 min 4.32"], ["Waiting for CPU", "5%", "1 min · pressure"], ["Temperature", "86 °C", "hottest core", "warn"]], { cols: NARROW ? 3 : 5, cls: o.cls });
  const where = () => stack([[27, "var(--sw-blue)", "Apps", "27%"], [8, "var(--sw-violet)", "Kernel", "8%"], [0.6, "var(--sw-amber)", "Waiting on disk", "0.6%"], [1, "var(--sw-coral)", "Interrupts", "1%"]], { cls: "tall" });
  const users = (n = 5) => APPS_NOW.slice(0, n).map((a) => appRow(a, `${a[2].toFixed(1)}%`, a[2] * 2)).join("");
  const heat = (o = {}) => `<div class="cp-heat ${o.cls || ""}">${CORES.map((v, i) => `<div class="core ${i >= 8 ? "e" : ""}"><b style="height:${v}%"></b><span>${v}%</span></div>`).join("")}</div>`;

  /* A: one big graph, every thread below it as a strip of bars, then who's using it. */
  const pageA = () => `<div class="ap-body scroll">
    ${phead("Intel Core Ultra 9 285H", "16 threads: 6 performance, 8 efficient, 2 low-power", seg(["1 min", "5 min", "10 min"], "1 min"))}
    ${busy()}
    ${acard("", `${graph(shaped(1, 60, .3, .12, [[.85, .35, .04]]), "var(--sw-blue)", NARROW ? 110 : 150, { more: [[shaped(2, 60, .08, .03, [[.85, .1, .04]]), "var(--sw-violet)"]] })}<div class="ap-lg"><span><i style="background:var(--sw-blue)"></i>Busy <b>36%</b></span><span><i style="background:var(--sw-violet)"></i>Kernel <b>8%</b></span></div>`)}
    <div class="ap-grid" style="--cols:${NARROW ? 1 : 2}">
      ${acard("Each thread", heat(), { meta: "Performance · efficient" })}
      ${acard("Using it most", users(), { end: seg(["Apps", "Processes"], "Apps") })}
    </div></div>`;

  /* B: a small graph for every thread, with where the time goes beside them. */
  const pageB = () => `<div class="ap-body scroll">
    ${phead("Intel Core Ultra 9 285H", "16 threads", seg(["Graphs", "Bars"], "Graphs"))}
    <div class="cp-b">
      <div class="cp-cores">${CORES.map((v, i) => `<div class="card cp-core ${i >= 8 ? "e" : ""}"><div class="t"><span>${i < 6 ? "P" : i < 14 ? "E" : "LP"}${i}</span><b>${v}%</b></div>${gline(series(i + 1, 30, v / 120 + .05, .08), i < 6 ? "var(--sw-blue)" : "var(--sw-teal)", 34)}</div>`).join("")}</div>
      <div class="cp-side">${acard("Where the time goes", `${where()}${kv([["Speed", "3.09 GHz"], ["Load", "5.65 · 3.64 · 4.32"], ["Processes", "709 · 2,312 threads"], ["Context switches", "18,204 a second"]])}`)}</div>
    </div></div>`;

  /* C: who's using it first: the apps by share of the processor, then the machine's numbers. */
  const pageC = () => `<div class="ap-body scroll">
    ${busy({ cls: "sm" })}
    <div class="cp-c">
      ${acard("What's using the processor", `<div class="cp-share">${stack([[41, "var(--sw-amber)"], [8, "var(--sw-coral)"], [7, "var(--sw-green)"], [3, "var(--sw-blue)"], [8, "var(--sw-violet)"]], { cls: "tall", legend: false })}</div>${APPS_NOW.slice(0, 6).map((a) => appRow(a, `${a[2].toFixed(1)}%`, a[2] * 2, { sub: `${a[6]} process${a[6] > 1 ? "es" : ""}` })).join("")}<div class="cp-k">${icon("cpu")}Kernel and interrupts: 9%</div>`, { end: seg(["Now", "Last 5 min"], "Now") })}
      ${acard("The last minute", `${graph(shaped(1, 60, .3, .12, [[.85, .35, .04]]), "var(--sw-blue)", 120)}${heat({ cls: "sm" })}`)}
    </div></div>`;

  REG("cpu", {
    name: "CPU",
    summary: "The CPU page has the right numbers (busy, speed, load, pressure, temperature) but reads like a form: a small ring with a legend of percentages, a history graph that's mostly empty, and the most interesting part folded away at the bottom.",
    problems: [
      "<b>A ring and a legend for one number:</b> the ring says 36% busy and the five-line legend beside it repeats the parts in small type.",
      "<b>The history graph is scaled to 100%</b> and runs for a minute, so most of it is an empty box with a spike at the right.",
      "<b>Every thread is missing:</b> 16 threads, but you can only see one total; how busy each is, and which are performance or efficient cores, isn't shown.",
      "<b>Top consumers shows two of five running</b> (“2 running now”) with long empty bars, and a Show more link.",
      "<b>Clock, load and pressure history</b> is a folded section at the very bottom, cut off at 800 × 1280.",
    ],
    today: [["cpu-1280", "Today at 1280 px", "Ring, empty history, top consumers"], ["cpu-800", "Today at 800 px", ""]],
    options: [
      { id: "a", name: "One big graph, every thread below", idea: "The readings in one row (busy, speed, load, waiting, temperature), one big graph of the last minute with the kernel's share dashed, then every thread as a bar, performance and efficient cores told apart, beside the apps using it most.",
        shots: [["a-cpu", "CPU", "Readings, a big graph, threads and apps"], ["a-cpu-800", "At 800 px", "Threads under the graph, apps below"]] },
      { id: "b", name: "A graph for every thread", idea: "A small live graph for each of the 16 threads, labelled P, E and LP, so you can see which are busy and for how long. Beside them, where the time goes (apps, kernel, waiting on disk, interrupts) and the machine's numbers.",
        shots: [["b-cpu", "CPU", "Sixteen small graphs, where the time goes"]] },
      { id: "c", name: "Who's using it first", idea: "The page starts with what's using the processor: one bar split by app, then the apps with their share and how many processes each runs. The graph of the last minute and the threads sit beside it. Best if you open the CPU page to find out what's busy.",
        shots: [["c-cpu", "CPU", "The apps' share, the last minute beside it"]] },
    ],
    pages: {
      "a-cpu": () => apage("cpu", pageA()),
      "b-cpu": () => apage("cpu", pageB()),
      "c-cpu": () => apage("cpu", pageC()),
    },
  });
})();
