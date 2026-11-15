(() => {
  const stateMap = () => tpage("launcher", `<div class="tm-state">
    <div class="map">
      <div class="node on"><div class="l">Now</div><b>Google TV home</b><span class="dim2" style="font-size:.85em">Nyx TV installed</span></div>
      <span class="arrow">→</span>
      <div class="node"><div class="l">Goal</div><b>Nyx TV home</b><span class="dim2" style="font-size:.85em">Stock restorable</span></div>
    </div>
    ${btn("Set Nyx TV as home", "primary", "home")}
    <div class="ops">
      <div class="card"><b>${icon("check-c")} Verify</b><span>Home button, restart, apps</span>${btn("Open", "sm")}</div>
      <div class="card"><b>${icon("restore")} Restore</b><span>Google TV from a snapshot</span>${btn("Open", "sm")}</div>
      <div class="card"><b>${icon("wrench")} Repair</b><span>After a firmware update</span>${btn("Open", "sm")}</div>
    </div>
  </div>`);

  const mission = () => tpage("launcher", `<div class="tm-mission">
    <div class="prog-line"><span>Setup · 2 of 4</span><span class="bar"><b style="width:50%"></b></span></div>
    <div class="step done"><span class="num">✓</span><div class="tx"><b>Connect the TV</b><span>Wireless debugging · 192.168.1.237</span></div></div>
    <div class="step done"><span class="num">✓</span><div class="tx"><b>Install Nyx TV</b><span>0.1.0 signed</span></div></div>
    <div class="step on"><span class="num">3</span><div class="tx"><b>Set as the home app</b><span>Saves a snapshot, then changes the HOME role</span></div>
      <div class="body">${btn("Continue", "primary")}<span class="dim2" style="margin-left:10px">Nothing is uninstalled</span></div></div>
    <div class="step"><span class="num">4</span><div class="tx"><b>Verify</b><span>Home button, cold start, stock launcher off</span></div></div>
    <div class="sechead" style="margin-top:8px">Later</div>
    <div class="card">${lrow({ lead: icon("restore"), title: "Restore Google TV home", sub: "From a snapshot" })}
      ${lrow({ lead: icon("wrench"), title: "Repair after an update", sub: "When firmware turns stock home back on" })}
      ${lrow({ lead: icon("history"), title: "Take a snapshot now", sub: "Home role and disabled packages" })}</div>
  </div>`);

  REG("launcher", {
    name: "Launcher",
    summary: "Today is a warning banner plus five equal rows — no sense of whether setup is done or what's next.",
    problems: [
      "<b>Five equal actions</b> hide the one that matters when Nyx TV isn't home.",
      "<b>No state</b> — you can't see Stock vs Nyx at a glance.",
      "<b>Verify / Restore / Repair</b> look like peers of Set as home.",
    ],
    today: [["launcher-1280", "Today at 1280 px", "Real app"]],
    options: [
      { id: "a", name: "State map", idea: "A Now → Goal diagram (Google TV home → Nyx TV home) with one primary path button. Verify, Restore and Repair are secondary cards under it.",
        good: "Seeing the launcher state as a transition, not a menu.",
        shots: [["a-main", "State map", "Now → Goal + primary CTA"]] },
      { id: "b", name: "Setup mission", idea: "A four-step setup checklist with progress. The current step expands inline; Restore/Repair/Snapshot sit under “Later”.",
        good: "First-time and return visits share one progress story.",
        shots: [["b-main", "Mission", "Step 3 expanded"]] },
    ],
    pages: { "a-main": stateMap, "b-main": mission },
  });
})();
