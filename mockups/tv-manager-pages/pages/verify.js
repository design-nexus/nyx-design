(() => {
  const lights = () => tpage("verify", `${pbar2("Verify", "Bedroom TV", btn("Run again", "", "refresh"))}
    <div class="tm-lights">
      <div class="tm-light ok"><div class="st">Pass</div><b>Nyx TV starts</b><span>Cold start 412 ms</span></div>
      <div class="tm-light ok"><div class="st">Pass</div><b>Home button</b><span>Opens Nyx TV from three apps</span></div>
      <div class="tm-light ok"><div class="st">Pass</div><b>Stock launcher</b><span>Not running</span></div>
      <div class="tm-light ok"><div class="st">Pass</div><b>Other apps</b><span>Settings, Play Store, Plex</span></div>
      <div class="tm-light ok"><div class="st">Pass</div><b>Debugging</b><span>Still connected</span></div>
      <div class="tm-light wait"><div class="st">Waiting</div><b>Restart test</b><span>Optional</span><div style="margin-top:8px">${btn("Restart TV", "sm")}</div></div>
    </div>`);

  const live = () => tpage("verify", `<div class="tm-run">
    <div class="head"><span class="spin"></span><b>Running checks on Bedroom TV</b><span class="dim2">3 of 6</span><span style="flex:1"></span>${btn("Stop", "ghost sm")}</div>
    <div class="log">
      <div class="ln"><span class="ok">✓</span> <b>13:05:01</b> Nyx TV starts · 412 ms</div>
      <div class="ln"><span class="ok">✓</span> <b>13:05:02</b> Home button opens Nyx TV</div>
      <div class="ln"><span class="ok">✓</span> <b>13:05:03</b> Stock launcher not running</div>
      <div class="ln"><span class="wait">…</span> <b>13:05:04</b> Opening Settings, Play Store, Plex</div>
      <div class="ln dim2">   waiting for activity focus…</div>
    </div>
  </div>`);

  REG("verify", {
    name: "Verify",
    summary: "Today is a long checklist with no summary — you scan every row to know if it passed.",
    problems: [
      "<b>No score or headline</b> for a mostly-green run.",
      "<b>Restart test mixes a wait state with a button</b> inside the list.",
      "<b>Run again is only in the page bar</b>.",
    ],
    today: [["verify-1280", "Today at 1280 px", "Real app"]],
    options: [
      { id: "a", name: "Traffic-light board", idea: "Six large pass/wait/fail tiles in a grid. Status is readable across the room; Restart stays on its own waiting tile.",
        good: "Glanceable health after set-as-home.",
        shots: [["a-main", "Board", "5 pass · 1 waiting"]] },
      { id: "b", name: "Live run log", idea: "Checks stream like a live job: a running header and a monospace log. Stop cancels. Re-run starts a new session.",
        good: "Watching the TV respond over adb.",
        shots: [["b-main", "Live run", "Streaming checks"]] },
    ],
    pages: { "a-main": lights, "b-main": live },
  });
})();
