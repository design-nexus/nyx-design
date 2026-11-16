// Activity › Sensors.
(() => {
  // [group, icon, [[name, °C, limit]]]
  const GROUPS = [
    ["Processor", "cpu", [["Package", 88, 100], ["Hottest core", 88, 100]]],
    ["Storage", "drive", [["Disk 0 (NVMe)", 47, 80], ["Disk 1 (NVMe)", 32, 80]]],
    ["Board and Wi-Fi", "wifi", [["ACPI zone", 78, 105], ["Wi-Fi card", 61, 90]]],
  ];
  const temp = ([n, t, lim]) => `<div class="sn-t2"><div class="r"><span class="n">${n}</span><b class="${t / lim > .85 ? "warn" : ""}">${t} °C</b><span class="lim">of ${lim}</span></div>${meterBar((t / lim) * 100, t / lim > .85 ? "warn" : "")}</div>`;
  const fans = () => acard("Fans", kv([["CPU fan", "2,702 rpm"], ["GPU fan", "2,600 rpm"], ["Case fan", "1,340 rpm"]]), { ic: "fan", meta: "3 of 3 spinning" });
  const power = () => acard("Battery and power", readings([["Battery", "100%", "full · plugged in", "good"], ["Drawing", "38 W", "from the charger"], ["Health", "92%", "of its original capacity"]], { cls: "sm" }), { ic: "battery" });

  /* A: temperatures grouped by what they're in, each against its limit; fans and power below. */
  const pageA = () => `<div class="ap-body scroll">
    ${note("thermo", "The processor is running hot", "88 °C for 6 minutes while Blender renders. It slows itself down at 100 °C.", "warn")}
    <div class="ap-grid" style="--cols:${NARROW ? 1 : 3}">${GROUPS.map(([g, ic, ts]) => acard(g, ts.map(temp).join(""), { ic })).join("")}</div>
    <div class="ap-grid" style="--cols:${NARROW ? 1 : 2}">${fans()}${power()}</div></div>`;

  /* B: one graph per group over 10 minutes, so you can see what heats up together. */
  const pageB = () => `<div class="ap-body scroll">
    ${phead("Sensors", "7 temperatures · 3 fans · battery", seg(["1 min", "10 min", "1 h"], "10 min"))}
    <div class="ap-grid" style="--cols:${NARROW ? 1 : 2}">
      ${acard("Processor", graph(shaped(3, 60, .7, .05, [[.75, .15, .08]]), "var(--sw-coral)", 110, { top: "100 °C", mid: "50", from: "10 min ago", mark: [.62, "Render started"] }), { ic: "cpu", end: `<b class="sn-big warn">88 °C</b>` })}
      ${acard("Fans", graph(shaped(6, 60, .4, .03, [[.75, .2, .08]]), "var(--sw-blue)", 110, { top: "4,000 rpm", from: "10 min ago" }), { ic: "fan", end: `<b class="sn-big">2,702 rpm</b>` })}
      ${acard("Storage", graph(shaped(2, 60, .45, .02), "var(--sw-teal)", 80, { top: "80 °C", from: "10 min ago" }), { ic: "drive", end: `<b class="sn-big">47 °C</b>` })}
      ${acard("Board and Wi-Fi", graph(shaped(5, 60, .7, .02), "var(--sw-amber)", 80, { top: "105 °C", from: "10 min ago" }), { ic: "wifi", end: `<b class="sn-big">78 °C</b>` })}
    </div>${power()}</div>`;

  REG("sensors", {
    name: "Sensors",
    summary: "Sensors shows every temperature as a tile named the way the kernel names it (“ACPI ZONE temp1”, “NVME 0 Sensor 1”), two graphs, and the fans; each sensor's limit, and the battery and power, are folded away.",
    problems: [
      "<b>Sensor names are the kernel's</b>: ACPI ZONE temp1, NVME 1 Sensor 1, Wi-Fi temp1; you can't tell which disk is which or what the ACPI zone is.",
      "<b>Red with no reason</b>: the CPU's 88 °C is red, but nothing says how close that is to its limit or whether it's a problem.",
      "<b>“Hottest elsewhere”</b> picks one sensor out of many and graphs it on its own.",
      "<b>All temperature sensors and individual fans are folded</b>, and the battery and power the page's description promises aren't on it.",
    ],
    today: [["sensors-1280", "Today at 1280 px", "Kernel names, red without a limit"], ["sensors-800", "Today at 800 px", ""]],
    options: [
      { id: "a", name: "Grouped, against their limits", idea: "Temperatures grouped by what they're in (processor, storage, board and Wi-Fi), each as a bar against its own limit, so “hot” means something; a plain note when something is close. Fans and battery and power below.",
        shots: [["a-sens", "Sensors", "Groups, limits, a note when it's hot"], ["a-sens-800", "At 800 px", ""]] },
      { id: "b", name: "What heats up together", idea: "One graph per group over 10 minutes (processor, fans, storage, board), with what happened marked on it, so you can see the fans follow the processor. Battery and power below.",
        shots: [["b-sens", "Sensors", "A graph per group, fans beside the processor"]] },
    ],
    pages: { "a-sens": () => apage("sensors", pageA()), "b-sens": () => apage("sensors", pageB()) },
  });
})();
