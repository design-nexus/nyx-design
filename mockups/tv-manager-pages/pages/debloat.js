(() => {
  const split = () => tpage("debloat", `<div class="tm-deb">
    <div class="list">
      <div class="grp">Verified optional</div>
      ${PKGS.filter(p=>p[0]==="opt").map(p=>`<div class="pkg"><span class="cbx sq ${p[3]?"done":""}">${p[3]?icon("check"):""}</span><div class="tx"><b>${p[1]}</b><span class="mono">${p[2]}</span></div></div>`).join("")}
      <div class="grp">Device dependent</div>
      ${PKGS.filter(p=>p[0]==="dep").map(p=>`<div class="pkg dim"><span class="cbx sq"></span><div class="tx"><b>${p[1]}</b><span class="mono">${p[2]}</span></div></div>`).join("")}
      <div class="grp">Protected</div>
      ${PKGS.filter(p=>p[0]==="pro").map(p=>`<div class="pkg dim"><span class="cbx sq"></span><div class="tx"><b>${p[1]}</b><span class="mono">${p[2]}</span></div></div>`).join("")}
    </div>
    <div class="aside">
      <h3>Will disable</h3>
      <ul class="will"><li>TCL Home Channel</li><li>TCL Weather widget</li><li>Google TV recommendations</li></ul>
      <span class="dim2" style="font-size:.9em">Snapshot first. Never uninstalled — turn back on here.</span>
      <div style="flex:1"></div>
      ${btn("Disable 3 packages", "primary")}
    </div>
  </div>`);

  const splitConfirm = () => tpage("debloat", `<div class="tm-deb"><div class="list"></div><div class="aside"></div></div>`,
    dialog("Disable 3 packages?", "A snapshot is saved first. Each one can be turned back on.",
      [btn("Cancel", "ghost"), btn("Disable", "primary")],
      `<div class="card" style="margin-top:12px">${tbl([["", ""], ["Before", "100px"], ["After", "100px"]], [["Free memory", "1.21 GB", '<span class="dim2">after</span>'], ["Background services", "41", '<span class="dim2">—</span>']])}</div>`, 460));

  const profiles = () => tpage("debloat", `<div class="tm-prof">
    <p class="dim2" style="margin:0">Packages are disabled, never removed. Pick a profile, then review.</p>
    <div class="picks">
      <div class="pick sel"><b>Light cleanup</b><span>3 verified optional packages that only feed the stock launcher.</span>${chip("Recommended", "acc")}</div>
      <div class="pick"><b>With TCL extras</b><span>Light cleanup plus Magic Connect and Voice if you don't use them.</span></div>
      <div class="pick"><b>Choose myself</b><span>Empty selection — tick packages in the list.</span></div>
    </div>
    <div class="review">
      ${lrow({ lead: `<span class="cbx sq done">${icon("check")}</span>`, title: "TCL Home Channel", sub: "com.tcl.example.channel" })}
      ${lrow({ lead: `<span class="cbx sq done">${icon("check")}</span>`, title: "TCL Weather widget", sub: "com.tcl.example.weather" })}
      ${lrow({ lead: `<span class="cbx sq done">${icon("check")}</span>`, title: "Google TV recommendations", sub: "com.google.android.example.recs" })}
    </div>
    <div style="display:flex;justify-content:flex-end">${btn("Disable 3 packages", "primary")}</div>
  </div>`);

  const profilesConfirm = () => tpage("debloat", `<div class="tm-prof"></div>`,
    dialog("Disable 3 packages?", "Light cleanup on Bedroom TV. Snapshot first.",
      [btn("Cancel", "ghost"), btn("Disable", "primary")], "", 420));

  REG("debloat", {
    name: "Debloat",
    summary: "Today is a long scroll of grouped checkboxes; protected packages look almost interactive; confirm is easy to miss.",
    problems: [
      "<b>Four groups make a long scroll</b> before Disable.",
      "<b>Protected packages look clickable</b> with faded checkboxes.",
      "<b>No running summary</b> of what will change.",
    ],
    today: [["debloat-1280", "Today at 1280 px", "Real app"], ["debloat-800", "Today at 800 px", "Real app"]],
    options: [
      { id: "a", name: "List + will-change rail", idea: "Catalog on the left; a sticky “Will disable” rail on the right with the primary. Protected rows are clearly inert. Confirm compares before/after.",
        good: "Always seeing the blast radius.",
        shots: [["a-main", "Split", "List + will-change"], ["a-confirm", "Confirm", "Before/after"], ["a-main-800", "At 800 px", "Rail under list"]] },
      { id: "b", name: "Profiles", idea: "Light cleanup / With TCL extras / Choose myself. Review the packages a profile selects, then Disable. Confirm is short.",
        good: "Deciding a policy, not ticking boxes from scratch.",
        shots: [["b-main", "Profiles", "Light cleanup selected"], ["b-confirm", "Confirm", ""], ["b-main-800", "At 800 px", ""]] },
    ],
    pages: {
      "a-main": split,
      "a-confirm": splitConfirm,
      "b-main": profiles,
      "b-confirm": profilesConfirm,
    },
  });
})();
