(() => {
  /* A: Next-action console — one headline decision, then a history of what Manager did. */
  const nextAction = (o = {}) => {
    const offline = !!o.offline;
    return tpage("overview", `<div class="tm-next">
      <div class="stage">
        <div class="eyebrow">Bedroom TV · ${offline ? "unreachable" : "connected"}</div>
        <div class="headline">${offline ? "This TV isn't answering" : "Nyx TV isn't the home app yet"}</div>
        <p class="lede">${offline
          ? "Last seen over wireless debugging at 192.168.1.237:5555. Reconnect, or pick another TV from the sidebar."
          : "Nyx TV 0.1.0 is installed. The HOME role still points at Google TV. One step finishes setup."}</p>
        <div class="cta-row">${offline
          ? btn("Try again", "primary", "refresh") + btn("Add a different TV", "ghost")
          : btn("Set Nyx TV as home", "primary", "home") + btn("Verify first", "ghost")}</div>
        <div class="meta-row"><span>Model <b>TCL · Android TV 12</b></span><span>Nyx TV <b>0.1.0</b></span><span>adb <b>6 ms</b></span></div>
      </div>
      <div class="feed">
        <h4>On this computer</h4>
        <div class="tm-feed-row"><span class="t">13:03</span><span>Installed Nyx TV 0.1.0</span><span class="x">6.7 MB</span></div>
        <div class="tm-feed-row"><span class="t">12:58</span><span>Paired over wireless debugging</span><span class="x">192.168.1.237</span></div>
        <div class="tm-feed-row"><span class="t">12:55</span><span>Added Bedroom TV</span><span class="x"></span></div>
      </div>
    </div>`);
  };

  /* B: TV face — bezel preview + HUD vitals + remote-style actions. */
  const tvFace = () => tpage("overview", `<div class="tm-face">
    <div class="screen"><div class="hud">
      <div class="top"><span class="sub">Bedroom TV</span><span class="chip2 acc">${icon("check-c")} Connected</span></div>
      <div class="bot">
        <div class="title">Google TV home is running</div>
        <div class="sub">Nyx TV installed · not set as home</div>
        <div class="vitals">
          <div class="vital"><b>54 MB</b>Memory</div>
          <div class="vital"><b>0.3%</b>Idle CPU</div>
          <div class="vital"><b>780 ms</b>Cold start</div>
        </div>
      </div>
    </div></div>
    <div class="side">
      <div class="eyebrow" style="font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--text-tertiary)">Remote</div>
      <div class="pad">
        ${btn("Set as home", "primary")}
        ${btn("Verify", "")}
        ${btn("Update", "ghost")}
        ${btn("Restore", "ghost")}
      </div>
      <div class="card" style="padding:12px 14px">
        <div style="font-size:.75em;text-transform:uppercase;letter-spacing:.06em;color:var(--text-tertiary);font-weight:600;margin-bottom:8px">This TV</div>
        <div style="display:grid;grid-template-columns:90px 1fr;gap:6px 10px;font-size:.9em">
          <span class="dim2">Model</span><span>TCL 55Q570G</span>
          <span class="dim2">Address</span><span class="mono">192.168.1.237:5555</span>
          <span class="dim2">Nyx TV</span><span>0.1.0 · signed</span>
          <span class="dim2">Home</span><span>Google TV</span>
        </div>
      </div>
    </div>
  </div>`);

  REG("overview", {
    name: "Overview",
    summary: "Today the Overview is two empty cards and a watermark when the TV is offline — no next step, no history, metrics that belong on Diagnostics.",
    problems: [
      "<b>Offline is an empty shell</b>: “This TV” with nothing in it, Launcher copy that doesn't match the state, and the desktop wallpaper showing through.",
      "<b>No single next action</b> — Update, Verify and Restore compete; Install lives elsewhere.",
      "<b>The same four metric cards</b> also appear on Diagnostics.",
      "<b>Nothing records what you already did</b> on this TV from this computer.",
    ],
    today: [["overview-1280", "Today at 1280 px", "Real app · offline / empty cards"], ["overview-800", "Today at 800 px", "Real app"]],
    options: [
      { id: "a", name: "Next-action console", idea: "A full-width stage with one headline for the TV's state (reconnect, set as home, update, or all good) and one primary button. Below, a short feed of what this computer already did to the TV. Metrics move to Diagnostics.",
        good: "Opening the app and knowing what to do in two seconds.",
        shots: [["a-main", "Needs set-as-home", "Headline + one CTA + activity feed"], ["a-offline", "Unreachable", "Reconnect as the only job"], ["a-main-800", "At 800 px", ""]] },
      { id: "b", name: "TV face", idea: "A TV bezel fills the page: what's effectively on screen, vitals as a HUD, and a remote pad of actions on the right. Facts stay in a compact sheet under the pad.",
        good: "Feeling like you're looking at the TV, not a settings form.",
        shots: [["b-main", "TV face", "Bezel + HUD + remote"], ["b-main-800", "At 800 px", "Bezel above, remote below"]] },
    ],
    pages: {
      "a-main": () => nextAction(),
      "a-offline": () => nextAction({ offline: true }),
      "b-main": tvFace,
    },
  });
})();
