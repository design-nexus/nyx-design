(() => {
  const diff = () => tpage("replace", `<div class="tm-diff">
    <div class="col"><div class="hh">Now</div>
      <div class="row"><span class="k">Home app</span><span class="v">Google TV</span></div>
      <div class="row"><span class="k">Stock launcher</span><span class="v">Enabled</span></div>
      <div class="row"><span class="k">Nyx TV</span><span class="v">Installed · not home</span></div>
      <div class="row"><span class="k">Play Store / Cast / OTA</span><span class="v">Unchanged</span></div>
    </div>
    <div class="col after"><div class="hh">After</div>
      <div class="row chg"><span class="k">Home app</span><span class="v">Nyx TV</span></div>
      <div class="row chg"><span class="k">Stock launcher</span><span class="v warn">Disabled for user 0</span></div>
      <div class="row chg"><span class="k">Nyx TV</span><span class="v">Home app</span></div>
      <div class="row"><span class="k">Play Store / Cast / OTA</span><span class="v">Unchanged</span></div>
    </div>
    <div class="tm-diff-bar">
      <span class="dim2">Snapshot saved first · restorable anytime</span>
      <span style="flex:1"></span>
      ${btn("Cancel", "ghost")}${btn("Set Nyx TV as home", "primary")}
    </div>
  </div>`);

  const consent = () => tpage("replace", `<div class="tm-consent">
    <h2>Make Nyx TV the home app?</h2>
    <div class="bullets">
      <div class="b">${icon("check-c")}<div><b>A snapshot is saved first</b><span>You can put Google TV home back from this computer.</span></div></div>
      <div class="b">${icon("check-c")}<div><b>Nothing is uninstalled</b><span>The stock launcher is only disabled for your user.</span></div></div>
      <div class="b">${icon("check-c")}<div><b>Wireless debugging stays on</b><span>So Manager can still reach the TV.</span></div></div>
    </div>
    <details><summary>Show technical details</summary>
      <div class="card" style="margin-top:8px;font-size:.9em">
        <div>HOME role → Nyx TV</div>
        <div class="mono dim2">com.google.android.apps.tv.launcherx → disabled-user</div>
        <div class="dim2">setupwraith, Play Store, Chromecast unchanged</div>
      </div>
    </details>
    <div style="display:flex;gap:8px">${btn("Cancel", "ghost")}${btn("Save snapshot and set Nyx TV", "primary")}</div>
  </div>`);

  REG("replace", {
    name: "Set as home",
    summary: "Today stacks a warning, a dense package table, a snapshot note, and a CTA — four blocks with no clear reading order.",
    problems: [
      "<b>Package names dominate</b> a decision that should be plain language.",
      "<b>Warning + snapshot + table + buttons</b> feel like four separate pages.",
      "<b>At 800 px the table overflows</b> and the CTA scrolls away.",
    ],
    today: [["replace-1280", "Today at 1280 px", "Real app"], ["replace-800", "Today at 800 px", "Real app"]],
    options: [
      { id: "a", name: "Now / After diff", idea: "Two full-height columns: Now and After. Changed rows highlight. Snapshot note and the primary sit in a sticky bar.",
        good: "Comparing the TV before you commit.",
        shots: [["a-main", "Diff", "Now | After + sticky CTA"], ["a-main-800", "At 800 px", "Columns stack"]] },
      { id: "b", name: "Consent sheet", idea: "Three plain-language promises, technical details behind a disclosure, one primary. No table unless you ask.",
        good: "Saying yes without reading package IDs.",
        shots: [["b-main", "Consent", "Bullets + optional details"], ["b-main-800", "At 800 px", ""]] },
    ],
    pages: { "a-main": diff, "b-main": consent },
  });
})();
