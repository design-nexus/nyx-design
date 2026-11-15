(() => {
  const incident = () => tpage("repair", `<div class="tm-incident">
    <div class="badge">Needs repair</div>
    <h2>A firmware update put Google TV home back</h2>
    <p class="lede">The HOME role points at Google TV again. Nyx TV is still installed. Repair saves a new snapshot, then sets Nyx TV as home.</p>
    <div style="display:flex;gap:8px">${btn("Repair now", "primary")}${btn("Not now", "ghost")}</div>
    <details open><summary>What we found</summary>
      <div class="check"><span class="warn">!</span><span>Firmware changed · Nov 13</span></div>
      <div class="check"><span class="bad">✕</span><span>Google TV home is enabled again</span></div>
      <div class="check"><span class="ok">✓</span><span>Nyx TV still starts · 398 ms</span></div>
      <div class="check"><span class="ok">✓</span><span>Home role still lists Nyx TV</span></div>
    </details>
  </div>`);

  const doctor = () => tpage("repair", `<div class="tm-run">
    <div class="head"><span class="spin"></span><b>Repairing Bedroom TV</b><span class="dim2">Snapshot → set home → verify</span></div>
    <div class="log">
      <div class="ln"><span class="ok">✓</span> <b>13:12:01</b> Saved snapshot “After firmware update”</div>
      <div class="ln"><span class="ok">✓</span> <b>13:12:02</b> Disabled stock launcher for user 0</div>
      <div class="ln"><span class="ok">✓</span> <b>13:12:02</b> HOME role → Nyx TV</div>
      <div class="ln"><span class="wait">…</span> <b>13:12:03</b> Verifying home button…</div>
    </div>
    <div style="padding:12px 22px;border-top:1px solid var(--hair);display:flex;gap:8px;justify-content:flex-end">${btn("Cancel", "ghost")}</div>
  </div>`);

  REG("repair", {
    name: "Repair",
    summary: "Today puts Repair on a red banner above a checklist — the sequence is invisible.",
    problems: [
      "<b>Banner holds the only CTA</b> while the list looks interactive but isn't.",
      "<b>No sequence</b> for what Repair will do.",
      "<b>Reads like another warning page</b>, not an incident with a fix.",
    ],
    today: [["repair-1280", "Today at 1280 px", "Real app"]],
    options: [
      { id: "a", name: "Incident page", idea: "A needs-repair badge, plain-language headline, Repair now, and findings in a disclosure.",
        good: "Understanding the break before you fix it.",
        shots: [["a-main", "Incident", "Badge + headline + Repair"]] },
      { id: "b", name: "Doctor run", idea: "Repair as a live job: snapshot, set home, verify stream in a log.",
        good: "Watching the fix land.",
        shots: [["b-main", "Doctor", "Live repair log"]] },
    ],
    pages: { "a-main": incident, "b-main": doctor },
  });
})();
