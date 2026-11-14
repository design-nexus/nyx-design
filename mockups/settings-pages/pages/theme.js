// Personalization › Appearance: the theme, wallpaper, fonts, icons and apps that follow the theme.
(() => {
  // Themes: [name, bg, panel, accent, text, a2, a3, origin]
  const THEMES = [
    ["Tokyo Night", "#1a1b26", "#24283b", "#7aa2f7", "#c0caf5", "#bb9af7", "#9ece6a", "Built in"],
    ["Everforest", "#2d353b", "#343f44", "#a7c080", "#d3c6aa", "#e69875", "#7fbbb3", "Built in"],
    ["Catppuccin", "#1e1e2e", "#313244", "#cba6f7", "#cdd6f4", "#f38ba8", "#a6e3a1", "Built in"],
    ["Gruvbox", "#282828", "#3c3836", "#fabd2f", "#ebdbb2", "#fb4934", "#b8bb26", "Built in"],
    ["Nord", "#2e3440", "#3b4252", "#88c0d0", "#eceff4", "#bf616a", "#a3be8c", "Built in"],
    ["Rosé Pine", "#191724", "#26233a", "#ebbcba", "#e0def4", "#c4a7e7", "#9ccfd8", "Built in"],
    ["Kanagawa", "#1f1f28", "#2a2a37", "#7e9cd8", "#dcd7ba", "#e46876", "#98bb6c", "From GitHub"],
    ["Catppuccin Latte", "#eff1f5", "#e6e9ef", "#8839ef", "#4c4f69", "#d20f39", "#40a02b", "Built in"],
    ["Harbor", "#16202a", "#1f2c38", "#5fb3b3", "#d8e2ea", "#f99157", "#99c794", "Your own theme file"],
    ["Paper Sun", "#f6f1e7", "#ece5d6", "#d0702b", "#3d3527", "#3b7ea1", "#6a994e", "Imported from Omarchy"],
  ];
  const T0 = THEMES[0], T1 = THEMES[1];
  const TH = (n) => THEMES.find((t) => t[0] === n);

  const deskVars = ([, bg, panel, acc, text, a2, a3]) => `--d-bg:${bg};--d-win:${panel};--d-acc:${acc};--d-txt:${text};--d-a2:${a2};--d-a3:${a3};--d-wall:linear-gradient(150deg, color-mix(in srgb, ${a3} 55%, ${bg}), color-mix(in srgb, ${acc} 30%, ${bg}) 55%, ${bg})`;
  // A miniature desktop in a theme's colours (the revamp's n1-desk).
  const desk = (t, o = {}) => `<div class="n1-desk ap-desk ${o.cls || ""}" style="${deskVars(t)}">
    <div class="dbar"><span class="ws"><b class="on"></b><b></b><b></b><b></b></span><span class="clk">Fri 14:17</span><span class="tray">${icon("wifi")}${icon("bluetooth")}${icon("volume")}${icon("battery")}</span></div>
    <div class="dw wl"><div class="dwh"><i></i><i></i><i></i></div><div class="dapp"><div class="dside"><b class="on"></b><b></b><b></b><b></b></div><div class="dmain"><span class="l w70"></span><span class="l w50 dim"></span><span class="row on"></span><span class="row"></span><span class="row"></span><span class="btnx"></span></div></div></div>
    <div class="dw wt"><div class="dwh"><i></i><i></i><i></i></div><div class="dterm"><span><b class="c1"></b><b class="w40"></b></span><span><b class="c2"></b><b class="w60"></b></span><span><b class="c3"></b><b class="w30"></b></span><span><b class="c1"></b><b class="cur"></b></span></div></div>
    <div class="dw wb"><div class="dwh"><i></i><i></i><i></i></div><div class="dnote"><span class="l w60"></span><span class="l w90 dim"></span><span class="l w80 dim"></span><span class="l w40 dim"></span></div></div>
    ${o.toast ? `<div class="dtoast"><i></i><div><b></b><span></span></div></div>` : ""}
  </div>`;
  const dots = (t, n = 5) => `<span class="ap-dots">${[t[1], t[2], t[3], t[5], t[6]].slice(0, n).map((c) => `<i style="background:${c}"></i>`).join("")}</span>`;
  const thCard = (t, state) => `<div class="n1-th ${state}"><div class="sw" style="background:${t[1]}"><span style="background:${t[2]}"></span><i style="background:${t[3]}"></i><i style="background:${t[5]}"></i><i style="background:${t[6]}"></i></div><b>${t[0]}</b>${state === "use" ? "<small>In use</small>" : state === "try" ? "<small>Previewing</small>" : ""}</div>`;
  const miniTh = (t) => `<span class="n1-th mini">${thCard(t, "").replace('<div class="n1-th ">', "").replace(/<\/div>$/, "")}</span>`;
  const WALLS = ["#a7c080,#2d353b", "#7fbbb3,#232a2e", "#e69875,#3a3530", "#d3c6aa,#4b565c", "#83c092,#1e2326"];
  const walls = (on = 0, list = WALLS) => `<div class="n1-walls">${list.map((g, i) => `<span class="${i === on ? "on" : ""}" style="background:linear-gradient(150deg,${g})"></span>`).join("")}</div>`;

  /* ── Icons drawn in a set's look ─────────────────────────────────── */
  const GLYPH = {
    folder: "M9 16a2.5 2.5 0 0 1 2.5-2.5h7.5l3 3h14.5A2.5 2.5 0 0 1 39 19v15.5a2.5 2.5 0 0 1-2.5 2.5h-25A2.5 2.5 0 0 1 9 34.5z",
    doc: "M15 8.5h12.5l7.5 7.5v22.5a2 2 0 0 1-2 2H15a2 2 0 0 1-2-2v-28a2 2 0 0 1 2-2zM27.5 8.5V16H35",
    image: "M11 12.5h26a2 2 0 0 1 2 2v19a2 2 0 0 1-2 2H11a2 2 0 0 1-2-2v-19a2 2 0 0 1 2-2zM10 31l8-8 6 6 4-4 10 9",
    music: "M20 33V14l15-3v19M20 33a4 4 0 1 1-4-4 4 4 0 0 1 4 4zM35 30a4 4 0 1 1-4-4 4 4 0 0 1 4 4z",
    code: "M19 17l-7 7 7 7M29 17l7 7-7 7M26 13l-4 22",
  };
  const KCOL = { folder: "blue", doc: "graphite", image: "pink", music: "coral", code: "green" };
  // look: tile, solid, line, tinted, frame, colour; paper, mono (Vellum)
  const ico = (look, kind, acc = "var(--sw-blue)", size = 44) => {
    const d = GLYPH[kind], fill = kind === "folder" || kind === "doc";
    const k = `var(--sw-${KCOL[kind]})`;
    const svg = (inner) => `<svg viewBox="0 0 48 48" width="${size}" height="${size}" class="ap-ico">${inner}</svg>`;
    const small = `<g transform="translate(12 12) scale(.5)">`;
    if (look === "tile") return svg(`<rect x="4" y="4" width="40" height="40" rx="10" fill="url(#apg)" style="fill:${acc}"/><rect x="4" y="4" width="40" height="20" rx="10" fill="#fff" opacity=".14"/>${small}<path d="${d}" fill="${fill ? "#fff" : "none"}" stroke="#fff" stroke-width="3.2" stroke-linejoin="round" stroke-linecap="round"/></g>`);
    if (look === "solid") return svg(`<path d="${d}" fill="${fill ? acc : "none"}" stroke="${acc}" stroke-width="${fill ? 0 : 3.4}" stroke-linejoin="round" stroke-linecap="round"/>${fill ? `<path d="M9 21h30" stroke="#000" opacity=".18" stroke-width="2"/>` : ""}`);
    if (look === "line") return svg(`<path d="${d}" fill="none" stroke="${acc}" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round"/>`);
    if (look === "tinted") return svg(`<rect x="4" y="4" width="40" height="40" rx="10" style="fill:color-mix(in srgb, ${acc} 22%, transparent)"/>${small}<path d="${d}" fill="${fill ? acc : "none"}" stroke="${acc}" stroke-width="3.2" stroke-linejoin="round" stroke-linecap="round"/></g>`);
    if (look === "frame") return svg(`<rect x="5" y="5" width="38" height="38" rx="9" fill="none" stroke="${acc}" stroke-width="2"/>${small}<path d="${d}" fill="none" stroke="${acc}" stroke-width="3.4" stroke-linejoin="round" stroke-linecap="round"/></g>`);
    if (look === "colour") return svg(`<rect x="4" y="4" width="40" height="40" rx="10" style="fill:${k}"/><rect x="4" y="4" width="40" height="20" rx="10" fill="#fff" opacity=".16"/>${small}<path d="${d}" fill="${fill ? "#fff" : "none"}" stroke="#fff" stroke-width="3.2" stroke-linejoin="round" stroke-linecap="round"/></g>`);
    if (look === "paper") return svg(`<path d="${d}" style="fill:color-mix(in srgb, ${k} 38%, #fff)" stroke="color-mix(in srgb, ${k} 55%, #000)" stroke-opacity=".35" stroke-width="1.4" stroke-linejoin="round"/>${fill ? "" : ""}`);
    return svg(`<path d="${d}" style="fill:${fill ? "color-mix(in srgb, var(--text) 30%, transparent)" : "none"}" stroke="color-mix(in srgb, var(--text) 55%, transparent)" stroke-width="${fill ? 1.2 : 2.6}" stroke-linejoin="round" stroke-linecap="round"/><circle cx="36" cy="34" r="3.5" style="fill:${acc}"/>`);
  };
  const LOOKS = [["tile", "Tile"], ["solid", "Solid"], ["line", "Line"], ["tinted", "Tinted"], ["frame", "Frame"], ["colour", "Colour"]];
  const KINDS = ["folder", "doc", "image", "music", "code"];

  /* ═══ A: try it on the desktop ═════════════════════════════════════ */
  const aCtl = () => `
    <div class="gtitle first gflex">Theme<span class="sp"></span><span class="lnk">Show all 32 ${icon("chev-r")}</span></div>
    <div class="n1-themes ap-themes">${THEMES.slice(0, 8).map((t, i) => thCard(t, i === 0 ? "use" : i === 1 ? "try" : "")).join("")}</div>
    <div class="gtitle gflex">Wallpaper<span class="sp"></span>${btn("Next", "ghost sm", "refresh")}${btn("Choose…", "sm", "image")}</div>
    ${walls(0)}
    ${ocard("Fonts & icons", [
      orow("Interface font", "", dd("Inter"), { ic: "file-text", sec: "personalization" }),
      orow("Monospace font", "", dd("JetBrains Mono"), { ic: "code", sec: "personalization" }),
      orow("Icons", "", dd("Umbra · Tile"), { ic: "folder", sec: "personalization" }),
    ], { cls: "icons" })}
    ${ocard("", [
      nrow("Apps follow the theme", "", "Synced", { ic: "apps", sec: "personalization" }),
      nrow("Themes and app themes", "", "3 added", { ic: "palette", sec: "personalization" }),
    ], { cls: "icons" })}`;
  const aPv = () => `
    ${pvhead(`Previewing ${T1[0]}`, "Nothing changes until you apply it.", seg(["Desktop", "Apps", "Lock screen"], "Desktop"))}
    <div class="ap-stage">${desk(T1, { cls: "big", toast: true })}</div>
    ${NARROW ? "" : `<div class="ap-sample card" style="${deskVars(T1)}">
      <div class="aps1"><small>Interface</small><b style="font-family:Inter,sans-serif">The quick brown fox</b></div>
      <div class="aps1"><small>Monospace</small><code>fn main() { 42 }</code></div>
      <div class="aps2">${KINDS.slice(0, 4).map((k) => ico("tile", k, T1[3], 34)).join("")}</div>
    </div>`}
    <div class="ap-apply card"><span class="ap-to">${miniTh(T1)}</span><span class="sp"></span>${btn(`Keep ${T0[0]}`, "ghost")}${btn(`Apply ${T1[0]}`, "primary", "check")}</div>`;

  /* ═══ B: a library with details ════════════════════════════════════ */
  const bRow = (t, i) => `<div class="opt ap-trow ${t[0] === "Kanagawa" ? "picked" : ""}">${dots(t)}<div class="opt-text"><div>${t[0]}</div><div class="d">${t[7]}</div></div>${i === 0 ? `<span class="pill" style="--tc:var(--accent)">In use</span>` : t[0] === "Kanagawa" ? `<span class="pill" style="--tc:var(--sw-amber)">Update</span>` : ""}</div>`;
  const bCtl = () => `
    <div class="field">${icon("search")}<span class="ph">Search 32 themes</span></div>
    <div class="pvchips ap-filt">${chip("All", "on")}${chip("Dark")}${chip("Light")}${chip("Added by you · 3")}</div>
    <div class="card ap-tlist">${[T0, TH("Kanagawa"), TH("Harbor"), TH("Paper Sun"), T1, TH("Catppuccin"), TH("Gruvbox"), TH("Nord"), TH("Rosé Pine")].map(bRow).join("")}</div>
    <div class="ap-under">${btn("Install…", "", "download")}${btn("Check for updates", "ghost", "refresh")}</div>`;
  const PAL = (t) => [["Base", t[1]], ["Panels", t[2]], ["Accent", t[3]], ["Text", t[4]], ["Warm", t[5]], ["Green", t[6]], ["Red", "#e46876"], ["Yellow", "#e6c384"]];
  const bPv = (t = TH("Kanagawa")) => `
    ${pvhead(t[0], "By Tomas Kerr · from GitHub · version 1.4 · MIT licence", `${btn("Update", "", "download")}${btn("Apply", "primary", "check")}`)}
    <div class="ap-bdesk">${desk(t, { cls: "big" })}</div>
    <div class="ap-brow">
      <div class="card ap-pal"><div class="aph">Colours</div><div class="appg">${PAL(t).map(([n, c]) => `<div><i style="background:${c}"></i><span>${n}</span></div>`).join("")}</div></div>
      <div class="card ap-wl"><div class="aph">Its wallpapers <span class="dim">· 4</span></div>${walls(1, ["#7e9cd8,#1f1f28", "#e46876,#2a2a37", "#98bb6c,#16161d", "#dcd7ba,#363646"])}</div>
    </div>
    ${pvfoot("Easy to read on every background. Version 1.5 is out.", "check-c", btn("Remove", "sm ghost dtext"))}`;

  const installSheet = () => dialog("Install a theme", "Paste a GitHub repository with Nyx or Omarchy themes. Themes are only colours and pictures: nothing in the repository is run.", [btn("Cancel", "ghost"), btn("Install 2 themes", "primary", "download")],
    `<div class="ap-inst">
      <div class="field focus"><span class="q">github.com/tkerr/kanagawa-themes</span></div>
      <div class="aph">2 themes found <span class="dim">· checked just now</span></div>
      <div class="card">${[["Kanagawa Wave", "Nyx theme · by Tomas Kerr", ["#1f1f28", "#2a2a37", "#7e9cd8", "#e46876", "#98bb6c"]], ["Kanagawa Lotus", "Omarchy theme, converted · by Tomas Kerr", ["#f2ecbc", "#e5ddb0", "#4d699b", "#c84053", "#6f894e"]]].map(([n, d, cs]) => `<div class="opt">${chk(true)}<span class="ap-dots">${cs.map((c) => `<i style="background:${c}"></i>`).join("")}</span><div class="opt-text"><div>${n}</div><div class="d">${d}</div></div></div>`).join("")}</div>
      <div class="ap-or"><span>or import one of Omarchy's</span></div>
      <div class="opt0">${dd("Ethereal")}${btn("Import", "")}</div>
    </div>`, 500);

  /* ═══ C: one card per layer ════════════════════════════════════════ */
  const layer = (ic, title, value, lead, o = {}) => `<div class="card ap-layer ${o.on ? "on" : ""}">
      <div class="apl1">${lead}<div class="opt-text"><div class="apl-t">${title}</div><div class="d">${value}</div></div>${o.end || icon("chev-r", "cv")}</div>${o.more || ""}</div>`;
  const cCtl = (on) => `
    ${layer("palette", "Theme", "Tokyo Night · built in", `<span class="apl-sw" style="background:${T0[1]}"><span class="ap-dots">${[T0[3], T0[5], T0[6]].map((c) => `<i style="background:${c}"></i>`).join("")}</span></span>`, { on: on === "theme" })}
    ${layer("image", "Wallpaper", "2 of 5 from the theme", `<span class="apl-wall" style="background:linear-gradient(150deg,${WALLS[1]})"></span>`, { end: btn("Next", "sm ghost", "refresh") })}
    ${layer("file-text", "Fonts", "Inter · JetBrains Mono in terminals", `<span class="apl-aa">Aa</span>`)}
    ${layer("folder", "Icons", on === "icons" ? "Umbra · folders on satin tiles" : "Umbra · Tile", `<span class="apl-ic">${ico("tile", "folder", T0[3], 30)}</span>`, {
      on: on === "icons", end: on === "icons" ? dd("Umbra") : icon("chev-r", "cv"),
      more: on === "icons" ? `<div class="apl-more">${seg(LOOKS.map((l) => l[1]), "Tile")}</div>` : "" })}
    ${layer("apps", "Apps follow the theme", on === "apps" ? "Other apps take its colours" : "Synced for Tokyo Night · 2 min ago", `<span class="apl-ic apl-apps">${icon("apps")}</span>`, { on: on === "apps", end: sw(true) })}
    ${ocard("", [nrow("Theme library", "Install, update or remove themes", "3 added", { ic: "download", sec: "personalization" }), nrow("App themes", "Give a Nyx app a theme of its own", "All follow", { ic: "nyxapp", sec: "personalization" }), nrow("Settings window and defaults", "", "", { ic: "cog", sec: "personalization" })], { cls: "icons" })}`;
  const filesWin = (look, acc) => `<div class="ap-files" style="${deskVars(T0)}">
      <div class="apf-h"><i></i><i></i><i></i><b>Files</b><span class="sp"></span><span class="apf-path">Home</span></div>
      <div class="apf-b"><div class="apf-s">${["Home", "Documents", "Pictures", "Music", "Projects"].map((x, i) => `<span class="${i === 0 ? "on" : ""}">${ico(look, ["folder", "doc", "image", "music", "code"][i], acc, 16)}${x}</span>`).join("")}</div>
      <div class="apf-g">${[["folder", "Documents"], ["folder", "Pictures"], ["folder", "Music"], ["folder", "Projects"], ["doc", "Notes.txt"], ["image", "Harbor.jpg"], ["music", "Evening.flac"], ["code", "main.rs"]].map(([k, n]) => `<div>${ico(look, k, acc, 46)}<span>${n}</span></div>`).join("")}</div></div>
    </div>`;
  const cPvIcons = () => `
    ${pvhead("Icons: Umbra", "Drawn in the theme's colours, so they change with it.", seg(["Umbra", "Vellum"], "Umbra"))}
    ${filesWin("tile", T0[3])}
    <div class="ap-looks">${LOOKS.map(([k, n]) => `<div class="apk ${k === "tile" ? "on" : ""}"><div class="apk-i">${["folder", "doc"].map((x) => ico(k, x, T0[3], 28)).join("")}</div><span>${n}</span></div>`).join("")}</div>
    ${pvfoot("Satin tiles: the folder colour comes from the theme's accent.", "info", `<span class="lnk">Vellum: Paper and Mono ${icon("chev-r")}</span>`)}`;
  const appWin = (title, kind, t, o = {}) => `<div class="ap-aw ${o.cls || ""}" style="${deskVars(t)}"><div class="apa-h"><i></i><i></i><i></i><b>${title}</b><small>${kind}</small></div><div class="apa-b">${o.body}</div></div>`;
  const cPvApps = () => `
    ${pvhead("Apps follow Tokyo Night", "Windows and dialogs in other apps take the theme's colours and change with it.", btn("Sync now", "sm", "refresh"))}
    <div class="ap-apps">
      ${appWin("Save a copy", "GTK dialog", T0, { cls: "w1", body: `<div class="l w50"></div><div class="apa-f"><span>Holiday notes.md</span></div><div class="apa-r"><span class="apa-b2">Cancel</span><span class="apa-b2 p">Save</span></div>` })}
      ${appWin("Image viewer", "Qt app", T0, { cls: "w2", body: `<div class="apa-pic"></div><div class="apa-tb"><i></i><i></i><i></i><i class="on"></i></div>` })}
      ${appWin("Calendar", "Nyx app", T0, { cls: "w3", body: `<div class="apa-cal">${Array.from({ length: 28 }, (_, i) => `<i class="${i === 12 ? "on" : i % 9 === 3 ? "ev" : ""}"></i>`).join("")}</div>` })}
    </div>
    <div class="card ap-sync">${orow("Synced for <b>Tokyo Night</b>", "2 minutes ago · 14 apps re-coloured", `<span class="pill dot">Up to date</span>`)}${orow("Sync automatically", "Whenever the theme or font changes.", sw(true))}${orow("Restore stock look", "Put apps back to their own styling; sync again to re-theme.", btn("Restore", "sm"))}</div>`;

  /* ── Window ──────────────────────────────────────────────────────── */
  const W = (body) => swin({ sec: "personalization", page: "Appearance", desc: "Theme, wallpaper, fonts, icons, and the apps that follow the theme.", ...body });
  const pages = {
    a: () => W({ body: split(aCtl(), aPv(), { sec: "personalization", ctlw: 430, cls: "ap-a" }) }),
    b: () => W({ body: split(bCtl(), bPv(), { sec: "personalization", ctlw: 360, cls: "ap-b" }) }),
    "b-install": () => W({ body: split(bCtl(), bPv(), { sec: "personalization", ctlw: 360, cls: "ap-b" }), over: installSheet() }),
    c: () => W({ body: split(cCtl("icons"), cPvIcons(), { sec: "personalization", ctlw: 400, cls: "ap-c" }) }),
    "c-apps": () => W({ body: split(cCtl("apps"), cPvApps(), { sec: "personalization", ctlw: 400, cls: "ap-c" }) }),
  };

  REG("theme", {
    name: "Appearance",
    summary: "One long page: a grid of theme screenshots, then wallpaper buttons, fonts and icons, the theme library, installing themes, app themes, apps following the theme, this window's own theme and a reset. Clicking a theme changes the whole desktop at once, with no way to look first.",
    problems: [
      "<b>No way to look before you leap:</b> a click on a theme card re-themes the terminal, bar, editor and lock screen straight away; trying three themes means three full switches.",
      "<b>Screenshots that don't compare:</b> each card is the theme author's own screenshot (an editor, a logo, a terminal), so two themes can't be compared side by side.",
      "<b>The grid takes the whole first screen:</b> wallpaper, fonts and icons only start after nine large cards and a Show all button; at 800 px Fonts & icons is below the fold.",
      "<b>Icons are a dropdown of names:</b> Umbra's six looks and Vellum's two show as words; you only see them by applying one and opening Files.",
      "<b>Nine groups in one column:</b> library, install, app themes, hyprchroma, the Settings window and defaults all sit under the theme, most of them rarely used.",
    ],
    today: [["theme-1280", "Today", ""], ["theme-800", "Today at 800 px", ""]],
    options: [
      { id: "a", name: "Try it on the desktop", idea: "The themes are small swatch cards on the left; clicking one previews it on a miniature desktop on the right (bar, windows, a notification, its wallpaper) with a sample of the fonts and icons. Nothing changes until Apply, and Keep puts the preview back. Fonts and icons sit under the wallpaper; the library, app themes and apps that follow the theme are one row each.",
        shots: [["a", "Previewing Everforest", "Tokyo Night stays until you apply"], ["a-800", "At 800 px", "The preview above the theme cards"]] },
      { id: "b", name: "Theme library with details", idea: "Every theme is a row in a searchable list, with its colours, where it came from and whether an update is waiting. The selected one fills the right side: its desktop, its palette, its wallpapers, the author and version, and Apply, Update or Remove. Installing from GitHub opens a sheet that checks the repository first and shows what it found.",
        shots: [["b", "Kanagawa selected", "An installed theme with an update"], ["b-install", "Install a theme", "A sheet: paste a repository, pick what to install"]] },
      { id: "c", name: "One card per layer", idea: "The look is built from layers, each a card on the left: theme, wallpaper, fonts, icons, and apps that follow the theme. The card you're in opens up with its choices, and the right side shows that layer up close: icon looks in a Files window, or other apps' windows in the theme. Rarely used parts (the library, app themes, this window's settings) are rows that open their own pages.",
        shots: [["c", "Icons: Umbra's six looks", "A Files window in the chosen look"], ["c-apps", "Apps follow the theme", "Other apps' windows in the theme's colours"]] },
    ],
    pages,
  });
})();
