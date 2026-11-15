(() => {
  const train = () => tpage("install", `<div class="tm-train">
    <div class="ages">
      <div class="age sel"><div class="rail"><span class="blob"></span></div><div><b>0.1.1</b><div class="dim2">Latest · Nov 12 · 6.8 MB</div></div></div>
      <div class="age cur"><div class="rail"><span class="blob"></span></div><div><b>0.1.0</b><div class="dim2">On this TV · Nov 2</div></div></div>
      <div class="age"><div class="rail"><span class="blob"></span></div><div><b>From a file…</b><div class="dim2">APK you built or downloaded</div></div></div>
    </div>
    <div class="detail">
      <div style="font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--text-tertiary)">Update available</div>
      <h2>Nyx TV 0.1.1</h2>
      <span class="dim2">Signed by design-nexus · SHA-256 checked · replaces 0.1.0 on Bedroom TV</span>
      <div class="changes"><b style="color:var(--text)">What changes</b>
        <ul style="margin:8px 0 0;padding-left:18px">
          <li>Faster cold start on TCL Q570G</li>
          <li>Appearance themes follow the TV's dark mode</li>
          <li>Settings and Plex sign-in stay on the TV</li>
        </ul>
      </div>
      <div style="display:flex;gap:8px">${btn("Update Bedroom TV", "primary", "download")}${btn("Uninstall 0.1.0", "ghost")}</div>
      <div class="term" style="margin-top:4px;background:color-mix(in srgb,var(--shadow) 55%,var(--bg));border-radius:10px;padding:10px 12px;font-family:JetBrains Mono,monospace;font-size:11.5px;color:var(--dim-text)"><b style="color:var(--text)">$</b> adb install -r nyx-tv-0.1.1.apk<br>Performing Streamed Install · 4.3 of 6.8 MB</div>
    </div>
  </div>`);

  const product = () => tpage("install", `<div class="tm-pad">
    <div class="tm-product">
      <div class="art">${icon("tvi")}</div>
      <div class="info">
        <h2>Nyx TV</h2>
        <div class="by">design-nexus · Android TV / Google TV</div>
        <div style="display:flex;gap:8px;flex-wrap:wrap">${btn("Update to 0.1.1", "primary", "download")}${btn("Uninstall", "ghost")}</div>
        <div class="facts"><span>Version <b>0.1.0 → 0.1.1</b></span><span>Size <b>6.8 MB</b></span><span>On TV <b>Bedroom</b></span></div>
        <p class="dim2" style="max-width:48ch;line-height:1.45;margin:0">A Plex-first launcher. Settings, rows and Plex sign-in stay on the TV when you update.</p>
        <div class="shots"><span></span><span></span><span></span></div>
      </div>
    </div>
    <div class="sechead">Other ways</div>
    <div class="card">${lrow({ lead: icon("file"), title: "Install from a file…", sub: "An APK you built or downloaded; signature checked" })}
      ${lrow({ lead: icon("package"), title: "Debug build from this checkout", sub: "For development · separate package id" })}</div>
  </div>`);

  REG("install", {
    name: "Install and update",
    summary: "Today is a flat APK list. Update looks like any other row; progress is easy to lose under it.",
    problems: [
      "<b>Update has the same weight</b> as older builds and “Install from a file”.",
      "<b>No changelog</b> — you don't know what 0.1.1 brings.",
      "<b>Progress sits under the whole list</b> instead of with the version you're pushing.",
    ],
    today: [["install-1280", "Today at 1280 px", "Real app"]],
    options: [
      { id: "a", name: "Version train", idea: "A release timeline on the left; the selected version's changelog, Update, and live adb progress on the right. The build on the TV is marked.",
        good: "Treating installs like releases, not files.",
        shots: [["a-main", "Update selected", "Train + changelog + progress"]] },
      { id: "b", name: "Product page", idea: "A store-style product card for Nyx TV: art, Update, facts, short description, and preview strip. File/debug installs sit under “Other ways”.",
        good: "One obvious Update for the app, not a file browser.",
        shots: [["b-main", "Nyx TV product", "Art + Update + previews"]] },
    ],
    pages: { "a-main": train, "b-main": product },
  });
})();
