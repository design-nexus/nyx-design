(() => {
  const cardList = () => {
    const body = `<div class="settings-card">
      <h2>Settings</h2><div class="lede">TV Manager</div>
      <div class="sechead">Devices</div>
      <div class="card">
        ${lrow({ lead: `<span class="dot on"></span>`, title: "Bedroom TV", sub: "192.168.1.237:5555", end: btn("Rename", "sm") + btn("Remove", "sm ghost") })}
      </div>
      <div class="sechead" style="margin-top:14px">Appearance</div>
      <div class="card">${lrow({ lead: icon("moon"), title: "Theme", sub: "Follow the system", end: `<span class="dim2">System</span>` })}</div>
      <div class="sechead" style="margin-top:14px">About</div>
      <div class="card">${lrow({ lead: icon("info"), title: "TV Manager", sub: "0.1.0 · nyx-tv-manager" })}</div>
    </div>`;
    return tpage("overview", `<div class="tm-pad"><div class="dim2">Overview behind settings</div></div>`,
      `<div class="settings-overlay">${body}</div>`);
  };

  const sheets = () => {
    const body = `<div class="settings-card">
      <h2>Devices</h2><div class="lede">Each TV is a sheet — rename, forget, or open it</div>
      <div class="card" style="padding:14px;display:flex;flex-direction:column;gap:10px">
        <div style="display:flex;align-items:center;gap:10px"><span class="dot on"></span><div style="flex:1"><b>Bedroom TV</b><div class="dim2 mono">192.168.1.237:5555</div></div>${chip("Selected", "acc")}</div>
        <div class="field"><span>Bedroom TV</span></div>
        <div style="display:flex;gap:8px">${btn("Save name", "primary sm")}${btn("Forget this TV", "dtext sm")}</div>
      </div>
      <div class="sechead" style="margin-top:14px">App</div>
      <div class="card">${lrow({ lead: icon("moon"), title: "Theme", end: `<span class="dim2">System</span>` })}
        ${lrow({ lead: icon("info"), title: "TV Manager 0.1.0", sub: "Binary nyx-tv-manager" })}</div>
    </div>`;
    return tpage("overview", `<div class="tm-pad"></div>`,
      `<div class="settings-overlay">${body}</div>`);
  };

  REG("settings", {
    name: "Settings",
    summary: "Today's settings card lists devices with Rename/Remove that don't match Settings 2.0 patterns.",
    problems: [
      "<b>Rename is always a separate dialog</b>.",
      "<b>Devices don't feel like Settings 2.0 rows</b>.",
      "<b>About still needed the display-name fix</b> to TV Manager.",
    ],
    today: [["settings-1280", "Today at 1280 px", "Real app"]],
    options: [
      { id: "a", name: "Settings 2.0 card", idea: "Devices as standard settings rows, then Appearance and About — aligned with the rest of Nyx.",
        good: "Consistency with Settings.",
        shots: [["a-main", "Settings card", "Devices list"]] },
      { id: "b", name: "Device sheet", idea: "Selecting a TV opens an inline sheet: edit the name, forget, see the address. App prefs below.",
        good: "Managing one TV without a modal rename.",
        shots: [["b-main", "Device sheet", "Inline rename + forget"]] },
    ],
    pages: { "a-main": cardList, "b-main": sheets },
  });
})();
