(() => {
  const film = () => tpage("restore", `<div class="tm-film">
    <div class="strip">
      <div class="shot sel"><div class="preview">Google TV home<br>2 packages</div><b>Before Nyx TV</b><span class="dim2">Nov 14, 13:02</span></div>
      <div class="shot"><div class="preview">3 packages<br>debloat point</div><b>Before debloat</b><span class="dim2">Nov 14, 13:40</span></div>
      <div class="shot" style="opacity:.45"><div class="preview">Other TV</div><b>Other device</b><span class="dim2">Can't apply</span></div>
    </div>
    <div class="detail">
      <h2 style="margin:0;font-size:1.35em;font-weight:600">Before Nyx TV</h2>
      <span class="dim2">Firmware match · this TV</span>
      <p style="color:var(--dim-text);line-height:1.45;margin:0">Turns Google TV home back on and makes it the home app. Nyx TV stays installed unless you remove it.</p>
      <div style="display:flex;gap:8px;flex-wrap:wrap">${btn("Restore Google TV home", "primary")}${btn("Restore and remove Nyx TV", "dtext")}</div>
    </div>
  </div>`);

  const undo = () => tpage("restore", `<div class="tm-undo">
    <div class="icon-wrap">${icon("restore")}</div>
    <h2>Undo Nyx TV as home</h2>
    <p>Puts Google TV home back from the latest matching snapshot. Nyx TV stays installed.</p>
    <div class="snap"><b>Before Nyx TV · Nov 14, 13:02</b><div class="dim2">Auto-selected · matches this firmware</div></div>
    ${btn("Restore Google TV home", "primary")}
    <span class="more">Choose another snapshot…</span>
    <span class="dim2" style="font-size:.9em">Or restore and remove Nyx TV</span>
  </div>`);

  REG("restore", {
    name: "Restore",
    summary: "Today is a snapshot list plus a large explanation card — the common case (undo home) isn't obvious.",
    problems: [
      "<b>Explanation card rivals the picker</b> in size.",
      "<b>Two restore actions</b> sit side by side with no default.",
      "<b>Other-TV snapshots look selectable</b> until you read the meta line.",
    ],
    today: [["restore-1280", "Today at 1280 px", "Real app"]],
    options: [
      { id: "a", name: "Snapshot filmstrip", idea: "Horizontal filmstrip of snapshots with a preview of what each restores. Detail and actions for the selected one below.",
        good: "Choosing a point in time visually.",
        shots: [["a-main", "Filmstrip", "Selected snapshot + actions"]] },
      { id: "b", name: "Simple undo", idea: "One centered undo: auto-picks the latest matching snapshot, one primary. Other snapshots are a secondary link.",
        good: "The 95% case without a list.",
        shots: [["b-main", "Undo", "One button, snapshot noted"]] },
    ],
    pages: { "a-main": film, "b-main": undo },
  });
})();
