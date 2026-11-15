(() => {
  const obs = () => tpage("diagnostics", `${pbar2("Diagnostics", "Bedroom TV · live", btn("Export…", "", "export") + btn("Run audit", "primary"))}
    <div class="tm-obs">
      <div class="charts">
        <div class="chart"><div class="k">Memory (PSS)</div><div class="v">54 MB</div>${spark([.5,.52,.55,.5,.48,.49,.51,.5,.47,.48,.5,.52], { w: 280, h: 64 })}</div>
        <div class="chart"><div class="k">CPU when idle</div><div class="v">0.3%</div>${spark([.1,.05,.08,.04,.03,.05,.02,.03,.02,.03,.04,.02], { w: 280, h: 64 })}</div>
        <div class="chart"><div class="k">Cold start</div><div class="v">780 ms</div><span class="dim2">Warm 210 ms · last run 13:41</span></div>
        <div class="chart"><div class="k">Google TV home</div><div class="v">Not running</div><span class="dim2">Was 182 MB PSS before Nyx TV</span></div>
      </div>
      <div class="drawer"><b>13:41:02</b> cold start 780 ms<br><b>13:41:03</b> Plex connected · local<br><b>13:52:40</b> <span style="color:var(--warning)">Home Server unreachable</span><br><b>13:54:41</b> reconnected · 3 rows refreshed</div>
    </div>`);

  const report = () => tpage("diagnostics", `<div class="tm-report">
    <div style="display:flex;gap:8px;justify-content:flex-end">${btn("Export report…", "", "export")}${btn("Run again", "primary")}</div>
    <div class="doc">
      <h3>Bedroom TV · audit</h3>
      <div class="when">Nov 14, 13:41 · wireless debugging · 6 ms</div>
      <h4>Summary</h4>
      <p>Nyx TV is installed and healthy. HOME still points at Google TV. Plex recovered after a short outage.</p>
      <h4>Readings</h4>
      <div class="inline">
        <span>Memory</span><span>54 MB PSS</span>
        <span>Idle CPU</span><span>0.3%</span>
        <span>Cold start</span><span>780 ms</span>
        <span>Stock home</span><span>Not running</span>
      </div>
      <h4>Findings</h4>
      <p>✓ Nyx TV process healthy<br>✓ Stock launcher not running<br>! Plex reconnected after a blip at 13:52<br>→ Set Nyx TV as home to finish setup</p>
    </div>
  </div>`);

  REG("diagnostics", {
    name: "Diagnostics",
    summary: "Today repeats Overview's metric cards above a log — little that feels like an audit.",
    problems: [
      "<b>Same four cards as Overview</b>.",
      "<b>Log is a wall</b> with no severity or filter.",
      "<b>Export and audit aren't a clear pair</b>.",
    ],
    today: [["diagnostics-1280", "Today at 1280 px", "Real app"]],
    options: [
      { id: "a", name: "Observatory", idea: "Large live charts fill the page; the log is a drawer along the bottom. Export and Run audit in the page bar.",
        good: "Watching the TV breathe.",
        shots: [["a-main", "Observatory", "Charts + log drawer"]] },
      { id: "b", name: "Audit report", idea: "A document-style audit you can export: summary, readings, findings, and a suggested next step.",
        good: "Something you could send or keep.",
        shots: [["b-main", "Report", "Formatted audit"]] },
    ],
    pages: { "a-main": obs, "b-main": report },
  });
})();
