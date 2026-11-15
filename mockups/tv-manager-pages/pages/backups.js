(() => {
  const library = () => tpage("backups", `${pbar2("Backups", "Bedroom TV", btn("Import…", "", "import"))}
    <div class="tm-lib">
      <div class="tm-file"><div class="ic">${icon("rows")}</div><b>Layout</b><span>Rows, favorites, theme · 14 KB · Nov 14</span>${btn("Export…", "sm primary")}</div>
      <div class="tm-file"><div class="ic">${icon("history")}</div><b>Snapshots</b><span>2 system snapshots for this TV</span>${btn("Export…", "sm")}</div>
      <div class="tm-file"><div class="ic">${icon("copy")}</div><b>Copy to Living Room</b><span>Offline · queues until it connects</span>${btn("Queue copy", "sm")}</div>
      <div class="tm-file" style="box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--accent) 35%,transparent)"><div class="ic">${icon("lock")}</div><b>Plex stays out</b><span>Sign-in is never in a backup.</span></div>
    </div>`);

  const sync = () => tpage("backups", `<div class="tm-sync">
    <div class="flow">
      <div class="box"><div class="l">From</div><b>Bedroom TV</b><span class="dim2">Layout · Nov 14</span></div>
      <span class="arrow">→</span>
      <div class="box"><div class="l">To</div><b>Living Room</b><span class="dim2">Offline · will wait</span></div>
    </div>
    <div class="what">
      ${lrow({ lead: icon("check-c"), title: "Rows and favorites", sub: "Included" })}
      ${lrow({ lead: icon("check-c"), title: "Theme and appearance", sub: "Included" })}
      ${lrow({ lead: icon("x"), title: "Plex sign-in", sub: "Never copied" })}
      ${lrow({ lead: icon("x"), title: "Missing apps on the other TV", sub: "Left out" })}
    </div>
    ${btn("Copy layout when Living Room is online", "primary")}
    <span class="dim2">Or export files from the library instead</span>
  </div>`);

  REG("backups", {
    name: "Backups",
    summary: "Today mixes export rows with a copy card and a Plex banner — three jobs without a clear primary.",
    problems: [
      "<b>Export and copy look alike</b>.",
      "<b>Offline copy still shows a primary</b> as if it would run now.",
      "<b>Plex note is a heavy banner</b> after every block.",
    ],
    today: [["backups-1280", "Today at 1280 px", "Real app"]],
    options: [
      { id: "a", name: "Backup library", idea: "A grid of artifacts — layout, snapshots, copy, and the Plex note as a tile. Import in the page bar.",
        good: "Browsing what you can take on or off the TV.",
        shots: [["a-main", "Library", "File tiles"]] },
      { id: "b", name: "Sync panel", idea: "From → To visual for copying layout between TVs, with an explicit include/exclude list.",
        good: "Moving a setup to another TV.",
        shots: [["b-main", "Sync", "From → To + what transfers"]] },
    ],
    pages: { "a-main": library, "b-main": sync },
  });
})();
