// System › Software: web and terminal apps, Omarchy's installers, packages, and (on Omarchy)
// the update channel and maintenance tools. Style B: controls on the left, a picture on the right.
(() => {
  const S = "system";
  const P = ["system", "Software", "Web and terminal apps, apps to install, packages and updates."];
  const page = (body) => () => swin({ sec: P[0], page: P[1], desc: P[2], body: body() });

  /* ── Sample data ─────────────────────────────────────────────────── */
  // [name, address or command, colour, kind, detail]
  const LAUNCHERS = [
    ["Figma", "figma.com", "violet", "web"],
    ["YouTube", "youtube.com", "red", "web"],
    ["WhatsApp", "web.whatsapp.com", "green", "web"],
    ["GitHub", "github.com", "graphite", "web"],
    ["Photos", "photos.google.com", "amber", "web"],
    ["Disk Usage", "dua i / · floating", "teal", "term"],
    ["Docker", "lazydocker · tiled", "blue", "term"],
  ];
  const GROUPS = [
    ["code", "Editors", "VS Code, Zed, Helix, Emacs", "1 of 4"],
    ["game", "Games", "Steam, Lutris, Heroic, RetroArch…", "2 of 8"],
    ["sparkle", "AI", "Claude, ChatGPT, Ollama, LM Studio…", "1 of 7"],
    ["cloud", "Services", "1Password, Dropbox, Tailscale…", "3 of 7"],
  ];
  const GAMES = [
    ["Steam", "Valve's store and your library", true, "blue", "game"],
    ["Lutris", "Every game in one library", false, "amber", "grid"],
    ["Heroic", "Epic, GOG and Amazon games", false, "violet", "star"],
    ["RetroArch", "Classic consoles", false, "graphite", "disc"],
    ["Battle.net", "Blizzard's launcher", false, "blue", "spark"],
    ["GeForce Now", "Games streamed from the cloud", true, "green", "cloud"],
    ["Xbox Cloud", "Game Pass in a window", false, "green", "tv"],
    ["Xbox controllers", "Wireless pads, rumble, battery", false, "teal", "game"],
  ];

  /* ── Small parts ─────────────────────────────────────────────────── */
  const fav = (name, c, cls = "") => `<span class="sw-fav ${cls}" style="--c:var(--sw-${c})">${name[0]}</span>`;
  const termic = (c, cls = "") => `<span class="sw-fav term ${cls}" style="--c:var(--sw-${c})">${icon("terminal")}</span>`;
  const lic = (l, cls = "") => (l[3] === "term" ? termic(l[2], cls) : fav(l[0], l[2], cls));
  const appic = (ic, c, cls = "") => `<span class="sw-appic ${cls}" style="--c:var(--sw-${c})">${icon(ic)}</span>`;
  const fld = (v, w = 250, cls = "") => `<span class="field sw-in ${cls}" style="width:${w}px">${v}</span>`;

  const launcherRow = (l, sel) => `<div class="opt ${sel ? "picked" : ""}">${lic(l)}<div class="opt-text"><div>${l[0]}</div><div class="d">${l[1]}</div></div>${l[3] === "term" ? chip("Terminal") : chip("Web")}</div>`;

  const updatesRow = () => nrow("Updates and maintenance", "Channel, firmware, the AUR, package keys", "Stable", { ic: "download", sec: S });

  /* ═══ A: your launchers, with how they look ══════════════════════════ */
  const aCtl = () => `
    ${ocard("Your launchers", LAUNCHERS.map((l, i) => launcherRow(l, i === 0)), { first: true, act: btn("Add", "sm", "plus") })}
    ${ocard("", [
      nrow("Install apps", "Editors, games, AI tools and services", "7 installed", { ic: "store", sec: S }),
      nrow("Packages", "Find anything in Arch or the AUR", "642", { ic: "pkg", sec: S }),
      updatesRow(),
    ], { cls: "icons" })}`;

  const launcherMock = () => `<div class="sw-launch">
      <div class="sw-ls">${icon("search")}<span>fig</span><i class="sw-caret"></i></div>
      <div class="sw-lr on">${fav("Figma", "violet", "sm")}<b>Figma</b><small>Web app</small></div>
      <div class="sw-lr">${appic("image", "pink", "sm")}<b>Image Viewer</b><small>App</small></div>
      <div class="sw-lr">${appic("file-text", "blue", "sm")}<b>Configure…</b><small>Settings</small></div>
      <div class="sw-lr">${appic("folder", "teal", "sm")}<b>Files</b><small>App</small></div>
    </div>`;
  const windowMock = () => `<div class="sw-win">
      <div class="sw-wt"><i></i><i></i><i></i><b>Figma</b></div>
      <div class="sw-wb"><span class="sw-wside"><b></b><b></b><b class="on"></b><b></b></span><span class="sw-canvas"><i class="r1"></i><i class="r2"></i><i class="r3"></i></span></div>
    </div>`;

  const aPv = () => `
    ${pvhead("Figma", "A web app: figma.com in a window of its own", `${btn("Remove", "ghost sm", "trash")}${btn("Open", "sm", "external")}`)}
    <div class="sw-stage card">
      <div class="sw-col"><small>In the app launcher</small>${launcherMock()}</div>
      <i data-i="chev-r" class="sw-arr"></i>
      <div class="sw-col"><small>When it opens: no browser bars</small>${windowMock()}</div>
    </div>
    ${ocard("", [
      orow("Name", "", fld("Figma", 260)),
      orow("Address", "", fld("https://figma.com", 260)),
      orow("Icon", "Fetched from the site", `${fav("Figma", "violet")}${btn("Fetch again", "sm", "refresh")}`),
      nrow("Shortcut", "Open it with a key combination, on Keyboard Shortcuts", "None"),
    ], { cls: "sw-form" })}
    ${pvfoot("Changes save as you type. Removing a launcher can be undone for a few seconds.")}`;

  /* ═══ B: apps to install, as a catalog ═══════════════════════════════ */
  const bCtl = (q) => `
    <div class="field ${q ? "focus" : ""} sw-search">${icon("search")}${q ? `<span>${q}</span>` : `<span class="ph">Find an app or a package</span>`}${q ? icon("x", "sw-clear") : ""}</div>
    ${ocard("Omarchy installs these for you", GROUPS.map(([ic, n, d, v], i) => `<div class="opt onav ${!q && i === 1 ? "picked" : ""}"><span class="lic" style="--tc:var(--sec-${S})">${icon(ic)}</span><div class="opt-text"><div>${n}</div><div class="d">${d}</div></div><span class="rv">${v}</span>${icon("chev-r", "cv")}</div>`).concat([
      orow("Starter apps", "Omarchy's own set", `${btn("Install…", "sm")}${btn("Remove…", "sm")}`, { ic: "apps", sec: S }),
    ]), { cls: "icons" })}
    ${ocard("", [
      nrow("Your web and terminal apps", "", "5 web · 2 terminal", { ic: "web", sec: S }),
      updatesRow(),
    ], { cls: "icons" })}`;

  const bPv = () => `
    ${pvhead("Games", "Pick one to install. A terminal opens to show progress and ask for your password.", chip("2 installed", "acc"))}
    <div class="sw-grid">${GAMES.map(([n, d, on, c, ic]) => `<div class="sw-app card ${on ? "on" : ""}">
        <div class="sw-ah">${appic(ic, c)}${on ? `<span class="pill dot" style="--tc:var(--success)">Installed</span>` : ""}</div>
        <b>${n}</b><span>${d}</span>
        <div class="sw-ab">${on ? btn("Remove…", "sm ghost") : btn("Install", "sm", "plus")}</div>
      </div>`).join("")}<div class="sw-app sw-more">${icon("search")}<b>Not here?</b><span>Search every package in Arch and the AUR from the box on the left.</span></div></div>`;

  const RESULTS = [
    ["obsidian", "Notes on Markdown files, linked together", "Arch", "1.9.10", true],
    ["obsidian-cli", "Open and search a vault from the terminal", "AUR", "0.4.2", false],
    ["obsidian-icon-theme", "Icons in the Obsidian style", "Arch", "2026.10", false],
    ["obsidian-appimage", "The AppImage, kept up to date", "AUR", "1.9.10", false],
    ["python-obsidiantools", "Read a vault from Python", "AUR", "0.11", false],
  ];
  const bsPv = () => `
    ${pvhead("Results for “obsidian”", "From Arch and the AUR, best match first", seg(["All", "Arch", "AUR"], "All"))}
    <div class="card sw-res">${RESULTS.map(([n, d, src, v, on], i) => `<div class="opt ${i === 0 ? "picked" : ""}">${appic("pkg", src === "AUR" ? "amber" : "blue", "sm")}<div class="opt-text"><div>${n} <span class="sw-v">${v}</span></div><div class="d">${d}</div></div>${chip(src, src === "AUR" ? "" : "acc")}${on ? `<span class="pill dot" style="--tc:var(--success)">Installed</span>` : btn("Install…", "sm")}</div>`).join("")}</div>
    ${pvfoot("Packages from the AUR are built on this computer; only install ones you trust.", "shield")}`;

  /* ═══ C: updates first ═══════════════════════════════════════════════ */
  const CH = [
    ["Stable", "Tested the most. Right for nearly everyone.", true],
    ["Release candidate", "The next version a week or two early.", false],
    ["Edge", "Changes as they land; things may break.", false],
  ];
  const cCtl = () => `
    <div class="ubar card"><span class="lic" style="--tc:var(--success)">${icon("check-c")}</span><div class="opt-text"><div><b>Omarchy 4.5.1</b> is up to date</div><div class="d">Checked 10 minutes ago</div></div>${btn("Check", "sm")}</div>
    ${ocard("Update channel", CH.map(([n, d, on], i) => `<div class="opt ${i === 1 ? "picked" : ""}">${radio(i === 1)}<div class="opt-text"><div>${n}${on ? ` <span class="sw-now">You're here</span>` : ""}</div><div class="d">${d}</div></div></div>`))}
    ${ocard("Keep it healthy", [
      orow("Firmware", "", `<span class="rv">Up to date</span>${btn("Check", "sm")}`, { ic: "chip", sec: S }),
      orow("Packages from the AUR", "", `<span class="rv">2 waiting</span>${btn("Update…", "sm")}`, { ic: "pkg", sec: S }),
      orow("Unused packages", "", `<span class="rv">14 · 340 MB</span>${btn("Remove…", "sm")}`, { ic: "trash", sec: S }),
      nrow("More tools", "Refresh package keys, check the last update", "", { ic: "wrench", sec: S }),
    ], { cls: "icons sw-tight" })}`;

  // Three lanes of releases across six weeks; x in %.
  const LANES = [
    ["Stable", "var(--success)", [[8, "4.4.3"], [44, "4.5.0"], [70, "4.5.1", "you"]]],
    ["Release candidate", "var(--sw-amber)", [[30, "4.5.0-rc3"], [60, "4.6.0-rc1"], [88, "4.6.0-rc2", "to"]]],
    ["Edge", "var(--sw-violet)", [[6], [14], [21], [28], [35], [42], [50], [57], [64], [71], [78], [85], [92, "today"]]],
  ];
  const lanes = () => `<div class="sw-lanes card">
      <div class="sw-axis">${["Oct 6", "Oct 20", "Nov 3", "Nov 13"].map((d) => `<span>${d}</span>`).join("")}</div>
      ${LANES.map(([n, c, pts]) => `<div class="sw-lane" style="--lc:${c}"><span class="sw-ln">${n}</span><div class="sw-track"><i class="sw-rail"></i>${pts.map(([x, v, f]) => `<span class="sw-pt ${v ? "v" : ""} ${f || ""}" style="left:${x}%">${v ? `<em>${v}</em>` : ""}</span>`).join("")}${n === "Stable" ? '<svg class="sw-jump" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M71.5 4 C 80 4, 82 96, 87 98" /></svg>' : ""}</div></div>`).join("")}
    </div>`;

  const cPv = () => `
    ${pvhead("Switching to Release candidate", "Where each channel is now, and what changes for you", btn("Switch…", "primary sm"))}
    ${lanes()}
    <div class="notes card sw-notes">
      <div class="nh">What happens</div>
      <ul>${["You move from 4.5.1 to <b>4.6.0-rc2</b>: the new bar, faster theme changes and Wi-Fi sharing.", "A terminal opens to switch and asks for your password; it takes about two minutes.", "To come back, switch to Stable. You stay on 4.6 until Stable reaches it, in about two weeks."].map((x) => `<li>${x}</li>`).join("")}</ul>
    </div>
    ${pvfoot("A snapshot is taken first, so you can go back from the boot menu.", "hist")}`;

  REG("software", {
    name: "Software",
    icons: {
      game: '<path d="M7 8h10a4 4 0 0 1 4 4.5l-.6 3.7a2.4 2.4 0 0 1-4.2 1.1L14.5 15h-5l-1.7 2.3a2.4 2.4 0 0 1-4.2-1.1L3 12.5A4 4 0 0 1 7 8z"/><path d="M8 10.5v3M6.5 12h3M15.5 11.5h.01M17.5 13h.01" />',
    },
    summary: "Software is six folded groups in one column: the update channel on top, then web apps, terminal apps, packages, Omarchy's installers and maintenance. Each group is a heading and a chevron until you open it, so nothing on the page shows what's installed or what's waiting.",
    problems: [
      "<b>Everything is folded away:</b> web apps, terminal apps, installers and maintenance are closed rows; the page never shows a single app until you open a group.",
      "<b>No picture of a launcher:</b> a web app is a name and an address; you can't see how it shows up in the launcher or what its window looks like, and Edit opens a bare dialog.",
      "<b>Installers are buried two levels down:</b> Install apps opens to Editors, Games, AI and Services, each its own fold of name-and-button rows with no description or icon.",
      "<b>Updates are a dropdown with a warning:</b> “Release candidate” sits in a menu; nothing says which version each channel is on, or what switching would change.",
      "<b>Maintenance is a list of scripts:</b> firmware, AUR updates, package keys, unused packages and the update log are five Run… buttons with no state (is anything waiting? how much would it free?).",
      "<b>Package search hides its results:</b> “Find a package” is a field that needs Enter; results appear as plain rows with Install… under it, mixing Arch and AUR with no way to tell them apart.",
    ],
    today: [["software-1280", "Today", ""], ["software-800", "Today at 800 px", ""]],
    options: [
      { id: "a", name: "Your launchers, with how they look",
        idea: "The page opens on what you made yourself: every web app and terminal app in one list with its icon. The selected one shows on the right as it appears in the app launcher and as the window it opens, with its name, address and icon editable right there. Installers, packages and updates are three rows under the list that each open their own page.",
        shots: [["a-launchers", "Your launchers", "Figma selected: its launcher entry, its window, and its details"], ["a-launchers-800", "At 800 px", "The launcher and window above the list"]] },
      { id: "b", name: "A catalog to install from",
        idea: "Omarchy's installers become a small store. The left column has one search box for apps and packages and the four groups with how many of each are installed; the right shows the chosen group as cards with a picture, a line on what each is, and Install. Typing in the search box turns the right side into package results, marked Arch or AUR.",
        shots: [["b-catalog", "Games", "Eight cards; Steam and GeForce Now are installed"], ["b-search-800", "Searching packages at 800 px", "Results from Arch and the AUR above the groups"]] },
      { id: "c", name: "Updates first",
        idea: "On Omarchy, this page is where updates are steered, so it leads with them: Omarchy's version, the channel as three choices, and the maintenance tools with what each would do right now (2 waiting, frees 340 MB). Picking a channel draws where each one is on the right, the jump you'd make, and what happens when you switch; Switch… then runs it. Launchers and installers live one row down.",
        shots: [["c-updates", "Choosing a channel", "Release candidate picked: the jump from 4.5.1 to 4.6.0-rc2"]] },
    ],
    pages: {
      "a-launchers": page(() => split(aCtl(), aPv(), { sec: S })),
      "b-catalog": page(() => split(bCtl(), bPv(), { sec: S })),
      "b-search": page(() => split(bCtl("obsidian"), bsPv(), { sec: S })),
      "c-updates": page(() => split(cCtl(), cPv(), { sec: S })),
    },
  });
})();
