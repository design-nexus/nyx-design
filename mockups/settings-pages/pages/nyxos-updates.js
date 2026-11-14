// NyxOS › System › Updates: four kinds with a policy each, Update Everything, generations
// and going back, the history and the update settings.
(() => {
  const DESC = "The system, your apps and tools, and firmware: what's new, and going back.";
  const page = (body) => () => nwin({ cat: "system", page: "Updates", desc: DESC, body: body() });

  // [kind, title, icon, swatch, what, policy, summary]
  const KINDS = [
    ["system", "System", "nyxapp", "red", "NyxOS and the Nyx apps built into the desktop, as one new generation", "Notify me; I install", "NyxOS 26.11.2 · restart needed"],
    ["apps", "Applications", "apps", "blue", "Nyx apps, apps from the catalog and Flatpaks, each on its own", "Install automatically", "2 with updates"],
    ["tools", "Developer Tools", "terminal", "violet", "Coding agents and your mise and uv tools", "Install automatically", "2 with updates"],
    ["firmware", "Firmware", "chip", "amber", "From fwupd and LVFS. Firmware can't be undone", "Notify me; I install", "System firmware 1.14"],
  ];
  // [kind, name, from, to, how, tag]
  const TARGETS = [
    ["system", "NyxOS", "26.11.1", "26.11.2", "The system channel", "Restart"],
    ["apps", "Nyx Files", "2.4.0", "2.4.1", "Comes with the system", "With the system update"],
    ["apps", "Firefox", "151.0", "151.0.2", "A Flatpak", ""],
    ["apps", "Blender", "4.5.2", "4.5.3", "Yours (your Nix profile)", ""],
    ["tools", "Claude Code", "2.1.152", "2.1.311", "A NyxOS tool, for everyone", ""],
    ["tools", "ruff", "0.14.1", "0.14.3", "Your uv tools", ""],
    ["firmware", "System firmware", "1.12.0", "1.14.0", "Firmware", "Can't be undone"],
  ];
  // [number, date, what, detail, kind]
  const GENS = [
    [47, "11 Nov, 21:04", "Updated NyxOS to 26.11.1", "214 packages · Linux 7.2.8", "upd"],
    [46, "8 Nov, 14:30", "Docker containers on", "Sam Rivera joined docker", "set"],
    [45, "3 Nov, 10:02", "Time zone: America/Chicago", "A system setting", "set"],
    [44, "28 Oct, 20:41", "Updated NyxOS to 26.11", "1,042 packages · the November release", "upd"],
  ];
  const HIST = [
    ["Everything", "11 Nov, 21:04", "4 min", "214 packages changed · needed a restart", "ok"],
    ["Applications (automatic)", "11 Nov, 03:00", "42 s", "Firefox and Blender updated", "ok"],
    ["Developer Tools (automatic)", "9 Nov, 03:00", "18 s", "Claude Code updated", "ok"],
    ["Firefox", "6 Nov, 08:15", "6 s", "Failed: there was no network", "bad"],
    ["Going back", "4 Nov, 19:20", "1 min", "Went back a generation", "back"],
  ];

  const lic = (ic, c) => `<span class="lic" style="--tc:var(--sw-${c})">${icon(ic)}</span>`;
  const ready = () => `<div class="upd-ready card">
      <span class="upd-badge">${icon("download")}<b>7</b></span>
      <div class="tx"><b>7 updates are ready</b><span>1.4 GB · a restart after</span></div>
      ${btn("Update Everything", "primary", "download")}
    </div>
    <div class="upd-chk"><span>${icon("check-c")}Checked today at 09:12</span><span class="sp"></span><span class="lnk">${icon("refresh")}Check now</span></div>`;

  /* ── A: the kinds, and the generations they make ───────────────────── */
  const aCtl = () => `
    ${ready()}
    <div class="gtitle gflex">Four kinds<span class="sp"></span><span class="note">When there's an update</span></div>
    <div class="card icons upd-kinds">${KINDS.map(([k, t, ic, c, , pol, sum]) => `<div class="opt ${k === "system" ? "picked" : ""}">${lic(ic, c)}<div class="opt-text"><div>${t}</div><div class="d">${k === "system" ? `<em>${sum}</em>` : sum}</div></div>${dd(pol.replace("Install automatically", "Automatically").replace("Notify me; I install", "Notify me"))}</div>`).join("")}</div>
    ${ocard("", [nrow("Update settings", "Daily check · notify · install at 03:00", "", { ic: "sliders", sec: "system" }), nrow("Update history", "Last: today, 03:00 · 1 failed this month", "", { ic: "hist", sec: "system" })], { cls: "icons upd-more" })}`;
  const gnode = ([n, d, w, x, k], i) => `<div class="upd-g ${i === 0 ? "cur" : ""}"><span class="dot ${k}"></span>
      <div class="gc card"><div class="r1"><b>Generation ${n}</b><span class="dt">${d}</span>${i === 0 ? `<span class="pill" style="--tc:var(--success)">Running</span>` : ""}<span class="sp"></span>${i === 1 ? btn("Go back to this", "sm") : ""}</div>
      <div class="r2">${k === "upd" ? icon("download") : icon("sliders")}<span>${w}</span><small>· ${x}</small></div></div></div>`;
  const aPv = () => `
    ${pvhead("Generations", "Each system update or system change makes one. Going back undoes the newest; your files stay.", seg(["Timeline", "Boot menu"], "Timeline"))}
    <div class="upd-tl">
      <div class="upd-g next"><span class="dot"></span>
        <div class="gc card"><div class="r1"><b>Generation 48</b><span class="dt">After this update</span><span class="sp"></span><span class="pill" style="--tc:var(--accent)">${icon("refresh")}Built first</span></div>
        <div class="r2">${icon("download")}<span>NyxOS 26.11.2 and Nyx Files 2.4.1</span><small>· 186 packages · Linux 7.2.9</small></div>
        <div class="r3">It's switched to only when the build works, then Atlas restarts. Generation 47 stays in the boot menu.</div></div></div>
      ${GENS.map(gnode).join("")}
      <div class="upd-g more"><span class="dot"></span><span class="mt">3 earlier generations · in the boot menu until Disks › Clean up removes them</span></div>
    </div>
    ${pvfoot("Your own apps have their own history.", "info", `<span class="lnk">${icon("hist")}Undo your last app change</span>`)}`;
  const aBody = () => split(aCtl(), aPv(), { sec: "system", ctlw: 440, cls: "upd-a" });

  /* ── B: what's in the update, one thing at a time ──────────────────── */
  const bCtl = () => `
    ${ready()}
    ${KINDS.map(([k, t, ic, c], ki) => {
      const list = TARGETS.filter((x) => x[0] === k);
      return `<div class="gtitle gflex">${t}<span class="sp"></span><span class="note">${k === "system" ? "Notify me; I install" : k === "firmware" ? "Notify me; I install" : "Automatically at 03:00"}</span></div>
      <div class="card upd-tg">${list.map(([, n, a, b, how, tag]) => `<div class="opt ${n === "NyxOS" ? "picked" : ""}">${lic(ic, c)}<div class="opt-text"><div>${n}${tag ? ` <span class="upd-tag ${tag === "Restart" || tag.startsWith("Can't") ? "w" : ""}">${tag}</span>` : ""}</div><div class="d">${a} → ${b} · ${how}</div></div>${tag === "With the system update" ? "" : btn("Update", "sm")}</div>`).join("")}</div>`;
    }).join("")}`;
  const bPv = () => `
    ${pvhead("NyxOS 26.11.2", "The system channel · released 2 days ago · 1.1 GB to download", chip("Stable", "acc"))}
    <div class="notes card">
      <div class="nh">What's new</div>
      <ul>${["Linux 7.2.9, with fixes for suspend on recent AMD laptops.", "Nyx Files 2.4.1 keeps its place in long folders after a copy.", "The sign-in screen remembers the keyboard layout you picked.", "Security fixes for OpenSSL and the Wi-Fi driver."].map((x) => `<li>${x}</li>`).join("")}</ul>
      <div class="nh">Also with the system</div>
      <div class="ntags">${["Linux 7.2.9", "Mesa 26.1.2", "Nyx Files 2.4.1", "183 more"].map((x) => chip(x)).join("")}</div>
    </div>
    <div class="upd-steps card">${[["download", "Download", "1.1 GB", "done"], ["cube", "Build generation 48", "about 3 min", ""], ["refresh", "Switch to it", "only if it built", ""], ["power", "Restart", "when you choose", ""]].map(([ic, t, s], i) => `<div class="st">${icon(ic)}<b>${t}</b><small>${s}</small></div>${i < 3 ? `<span class="ar">${icon("chev-r")}</span>` : ""}`).join("")}</div>
    ${ocard("", [orow("Restart afterwards", "For Linux 7.2.9; you can keep working until then.", "", { ic: "power", sec: "system" }), orow("Generation 47 stays", "Go back to it here or from the boot menu if 48 doesn't suit you.", "", { ic: "hist", sec: "system" })], { cls: "icons" })}
    ${pvfoot("About 4 minutes in all, most of it building.", "clock", btn("Update the system", "primary", "download"))}`;
  const bBody = () => split(bCtl(), bPv(), { sec: "system", ctlw: 450, cls: "upd-b" });

  /* ── C: when updates happen, and what happened ─────────────────────── */
  const DAY = [
    ["System", "red", [[9.2, "bell", "Checked and told you"]], "You install"],
    ["Applications", "blue", [[9.2, "check", "Checked"], [3, "download", "Installed"]], "At 03:00"],
    ["Developer Tools", "violet", [[9.2, "check", "Checked"], [3, "download", "Installed"]], "At 03:00"],
    ["Firmware", "amber", [[9.2, "bell", "Checked and told you"]], "You install"],
  ];
  const SHORT = { system: "NyxOS, as a new generation", apps: "Nyx apps, catalog apps, Flatpaks", tools: "Coding agents, mise and uv tools", firmware: "Can't be undone" };
  const cCtl = () => `
    ${ocard("When there's an update", KINDS.map(([k, t, ic, c]) => orow(t, SHORT[k], dd(k === "apps" || k === "tools" ? "Install automatically" : "Notify me; I install"), { ic, sec: "system" })), { first: true, cls: "icons upd-pol" })}
    ${ocard("Update settings", [
      orow("Check daily", "Once a day, in the background", sw(true)),
      orow("Notify", "For updates, automatic installs and failures", sw(true)),
      orow("Check on metered connections", "Otherwise everything waits for another network", sw(false)),
      orow("Include firmware", "Firmware is only updated when you choose", sw(true)),
      orow("Install automatic updates", "Running apps use the new version when reopened", dd("At 03:00")),
    ], { cls: "upd-set" })}`;
  const hours = [0, 6, 12, 18, 24];
  const cPv = () => `
    ${pvhead("A day of updates", "What happens on its own, and what waits for you.", seg(["Today", "This week"], "Today"))}
    <div class="upd-day card">
      <div class="hx"><span></span><div>${hours.map((h) => `<small style="left:${(h / 24) * 100}%">${String(h).padStart(2, "0")}:00</small>`).join("")}</div></div>
      ${DAY.map(([t, c, evs, end]) => `<div class="dr"><span class="dn"><i style="background:var(--sw-${c})"></i>${t}</span><div class="trk">${evs.map(([h, ic, l]) => `<span class="ev ${ic}" style="left:${(h / 24) * 100}%;--c:var(--sw-${c})" title="${l}">${icon(ic)}</span>`).join("")}<span class="now" style="left:${(14.5 / 24) * 100}%"></span></div><span class="de">${end}</span></div>`).join("")}
      <div class="lg"><span><span class="ev check"><i data-i="check"></i></span>Checked</span><span><span class="ev bell"><i data-i="bell"></i></span>Checked and told you</span><span><span class="ev download"><i data-i="download"></i></span>Installed on its own</span><span class="sp"></span><span class="nw"><i></i>Now, 14:30</span></div>
    </div>
    <div class="gtitle gflex">Update history<span class="sp"></span><span class="lnk">View all</span></div>
    <div class="card upd-hist">${HIST.slice(0, 4).map(([w, d, t, r, k]) => `<div class="opt"><span class="hs ${k}">${icon(k === "bad" ? "x" : k === "back" ? "hist" : "check")}</span><div class="opt-text"><div>${w}</div><div class="d">${d} · ${t} · ${r}</div></div>${k === "bad" ? `<span class="pill" style="--tc:var(--danger)">Failed</span>` : ""}</div>`).join("")}</div>`;
  const cBody = () => split(cCtl(), cPv(), { sec: "system", ctlw: 470, cls: "upd-c" });

  REG("nyxos-updates", {
    name: "Updates",
    summary: "NyxOS's Updates page already has the right parts: Update Everything, the four kinds with a setting each, one row per thing with an update, the history, going back and the update settings. They're all stacked in one long column, though, so what's waiting, what each kind will do and how to go back are screens apart.",
    problems: [
      "<b>A long single column:</b> Updates, then System, Applications, Developer Tools and Firmware as four groups, then Update Settings, History and Going back; the generations are at the very bottom.",
      "<b>No count of what's waiting:</b> the top row is the version and Update Everything; how many updates there are is spread across the four groups' “All system: 1 with updates” lines.",
      "<b>Generations are a list of dates:</b> “Generation 46, 8 Nov 2026, 14:30” says nothing about what that generation changed, so there's no telling which one to go back to.",
      "<b>Each kind repeats “When there's an update”</b> with a dropdown and an “All …” row, which reads as four copies of the same group.",
      "<b>When things happen is hidden:</b> that apps and tools install on their own at night and the system waits for you is spread across four dropdowns and a time in the settings group.",
      "<b>Today's shot</b> shows only “Checking for updates…”: without the System Manager nothing loads, and the heading reads Omarchy.",
    ],
    today: [
      ["nyxos-updates-1280", "Updates today", "Taken on a laptop without NyxOS's System Manager, so nothing loads; the history, generations and settings below the fold come from the Rust source"],
      ["nyxos-updates-800", "Updates today at 800 px", "The description wraps to three lines beside Update Everything"],
    ],
    options: [
      { id: "a", name: "Kinds and generations", idea: "The left column is what's waiting (a count, Update Everything, when it last checked) and the four kinds, each one row with what it has and its setting. The right is the system's generations as a timeline, newest first: the one this update will build, the one running now, and the ones before, each with what changed in it (an update, a service, a time zone), so going back means picking the one before the change you regret.",
        shots: [["a-updates", "Kinds beside the generations", "Generation 48 is what the update builds; 46 is one click back"], ["a-updates-800", "At 800 px", "The timeline above the kinds"]] },
      { id: "b", name: "What's in the update", idea: "Every update is a row under its kind, with its versions, how it's updated and its own Update button; things that come with the system say so instead. The one you pick opens on the right: what's new in it, what else comes along, and the steps it takes (download, build the new generation, switch, restart) so the minute or two and the restart are no surprise.",
        shots: [["b-updates", "NyxOS 26.11.2 picked", "What's new and the four steps"]] },
      { id: "c", name: "When updates happen", idea: "The page leads with the settings: each kind's rule and the daily check, notifications, metered networks, firmware and the time automatic updates install. The right draws a day of it: when Atlas checks, which kinds install on their own at 03:00 and which wait for you, and under that the last few updates with what came of them.",
        shots: [["c-updates", "A day of updates and the history", "Apps and tools install at 03:00; the system and firmware wait"]] },
    ],
    pages: { "a-updates": page(aBody), "b-updates": page(bBody), "c-updates": page(cBody) },
  });
})();
