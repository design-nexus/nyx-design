// Activity › Settings.
(() => {
  const ocard = (h, rows) => `${h ? sect(h) : ""}<div class="card st-card">${rows.join("")}</div>`;
  const rowx = (t, d, c) => `<div class="opt"><div class="opt-text"><div>${t}</div>${d ? `<div class="d">${d}</div>` : ""}</div>${c}</div>`;
  const groups = () => `
    ${ocard("Monitoring", [rowx("Update every", "Faster costs a little more CPU", dd("1 second")), rowx("Graphs show", "", dd("The last minute")), rowx("Rest while hidden", "Stops reading the GPU and every process while the window is closed", sw(true)), rowx("Temperatures in", "", seg(["°C", "°F"], "°C")), rowx("Network speeds in", "", seg(["Bytes", "Bits"], "Bytes"))])}
    ${ocard("Warn me when", [rowx("The processor is hotter than", "", dd("90 °C")), rowx("Memory is fuller than", "", dd("90%")), rowx("A disk is fuller than", "", dd("95%")), rowx("A service fails", "", sw(true)), rowx("Also as a notification", "", sw(true))])}
    ${ocard("Processes", [rowx("Ending an app", "Ask first when it has unsaved work", sw(true)), rowx("Show kernel threads", "", sw(false))])}
    ${ocard("", [rowx("Export graph history", "Every graph's history as a CSV file", btn("Export…", "sm"))])}`;

  /* A: Settings as a page in the sidebar, one column of groups, like the rest of the app. */
  const sideS = () => aside("") + `${grp("App", false, "", "graphite")}${navx("cog", "Settings", { active: true })}`;
  const pageA = () => `<div class="ap-body scroll st-one">${phead("Settings", "How often Activity reads the machine, and when it warns you")}${groups()}</div>`;

  /* B: a split page: the settings beside a live preview of what they change. */
  const pageB = () => `<div class="ap-body st-split"><div class="scroll st-l">${groups()}</div>
    <div class="st-r">${phead("What it looks like", "Updates every second · the last minute")}${acard("CPU", graph(series(1, 60, .35, .2), "var(--sw-blue)", 130), { ic: "cpu", end: `<b>36%</b>` })}
      ${note("thermo", "Warning at 90 °C", "The processor is at 86 °C now; you'd be told 4 °C from here.", "")}
      ${note("battery", "About 0.3% of the processor", "What reading every second costs on this machine.", "good")}</div></div>`;

  REG("settings", {
    name: "Settings",
    summary: "Activity's settings open as a dialog with its own sidebar of seven parts (Monitoring, Warnings, Alerts, Processes, Appearance, Keyboard, About) over the dimmed window, though most parts hold two or three rows.",
    problems: [
      "<b>A dialog with its own sidebar</b> over the app's sidebar: two lists of places on screen at once.",
      "<b>Seven parts for about twenty settings</b>, so Warnings and Alerts, which are about the same thing, are two places.",
      "<b>Long explanations under short settings</b> (“Stop reading every process and the GPU while this window is out of sight. The graphs keep going.”).",
      "<b>Appearance repeats the system's</b> theme and accent choices, which the rest of Nyx takes from Settings.",
    ],
    today: [["settings-1280", "Today at 1280 px", "A dialog with its own sidebar"], ["settings-800", "Today at 800 px", ""]],
    options: [
      { id: "a", name: "A page in the sidebar", idea: "Settings becomes a page under App in Activity's own sidebar, one column of four groups: Monitoring, Warn me when (warnings and alerts together), Processes, and export. Appearance follows Nyx Settings; Keyboard shortcuts and About go to the app menu.",
        shots: [["a-set", "Settings", "Four groups in one column"], ["a-set-800", "At 800 px", ""]] },
      { id: "b", name: "Settings beside a preview", idea: "The same four groups beside a preview of what they change: a graph at the chosen speed and length, where the warning would trigger compared with now, and what reading the machine that often costs.",
        shots: [["b-set", "Settings", "Groups beside a live preview"]] },
    ],
    pages: {
      "a-set": () => apage("settings", pageA(), { side: sideS() }),
      "b-set": () => apage("settings", pageB(), { side: sideS() }),
    },
  });
})();
