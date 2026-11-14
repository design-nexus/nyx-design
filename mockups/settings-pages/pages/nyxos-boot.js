// NyxOS › System › Boot & Sign-in: the boot menu and its generations, the boot screen, the
// sign-in screen and the system logo; changes applied together as one rebuild.
(() => {
  const DESC = "The boot menu, the boot screen and the sign-in screen, for everyone.";
  const page = (body) => () => nwin({ cat: "system", page: "Boot & Sign-in", desc: DESC, body: body() });

  // [name, bg, accent, second]
  const THEMES = [
    ["Same as the system", "#0d0e12", "#5b8cff", "#b07cff", "Nyx Night"],
    ["Tokyo Night", "#1a1b26", "#7aa2f7", "#bb9af7"],
    ["Catppuccin Mocha", "#1e1e2e", "#cba6f7", "#f5c2e7"],
    ["Rosé Pine", "#191724", "#ebbcba", "#c4a7e7"],
    ["Gruvbox", "#282828", "#fabd2f", "#fe8019"],
    ["Nord", "#2e3440", "#88c0d0", "#a3be8c"],
    ["Everforest", "#2d353b", "#a7c080", "#dbbc7f"],
    ["Nyx Dawn", "#f1ece4", "#d06a3c", "#3c7bd0"],
  ];
  const TN = THEMES[1];
  const GENS = [[47, "11 Nov 2026, 21:04", "NyxOS 26.11.1", true], [46, "8 Nov 2026, 14:30", "Docker containers on"], [45, "3 Nov 2026, 10:02", "Time zone: America/Chicago"], [44, "28 Oct 2026, 20:41", "NyxOS 26.11"], [43, "20 Oct 2026, 09:15", "Printing on"]];
  const pend = (n, what) => `<div class="bt-pend"><span class="pdot"></span><b>${n} change${n > 1 ? "s" : ""} waiting</b><span class="w">${what}</span><span class="sp"></span><span class="pw">${icon("lock")}Asks for an administrator's password · about 2 min</span>${btn("Discard", "ghost")}${btn("Apply", "primary")}</div>`;
  const vars = ([, bg, a, b]) => `--t-bg:${bg};--t-a:${a};--t-b:${b}`;
  const logo = (cls = "") => `<span class="bt-logo ${cls}">${icon("atlas")}</span>`;

  /* ── The three screens ────────────────────────────────────────────── */
  const signin = (t = TN) => `<div class="bt-scr signin" style="${vars(t)}">
      <div class="top">${logo()}<span class="sp"></span><span class="ic">${icon("wifi")}${icon("battery")}</span></div>
      <div class="clock"><b>14:30</b><span>Friday 13 November</span></div>
      <div class="who">${av("Sam Rivera", 58)}<b>Sam Rivera</b><div class="pw"><span>••••••••</span><i class="go">${icon("chev-r")}</i></div><small>${icon("eye2")}Or look at the camera</small></div>
      <div class="bot"><span class="users">${av("Alex Chen", 22)}${av("Jo Park", 22)}<span>Other people</span></span><span class="sp"></span><span class="kb">${icon("keyboard")}English (US)</span><span class="ic">${icon("power")}</span></div>
    </div>`;
  const splash = (t = TN) => `<div class="bt-scr splash" style="${vars(t)}">
      <div class="mid">${logo("big")}<span class="spin"></span></div>
    </div>`;
  const bootmenu = () => `<div class="bt-scr menu"><div class="in">
      <div class="mh">Choose a generation to start</div>
      <div class="ml">${GENS.map(([n, d, w, cur], i) => `<div class="mi ${i === 0 ? "on" : ""}"><span>NyxOS · generation ${n}${cur ? " (running)" : ""}</span><span class="md">${d}</span></div>`).join("")}<div class="mi dim"><span>3 more</span></div><div class="mi dim"><span>Firmware settings</span></div></div>
      <div class="mf">↑ ↓ to choose · Enter to start · starts generation 47 in 3 s</div>
    </div></div>`;

  /* ── A: each screen as it will look ────────────────────────────────── */
  const sws = (on) => `<div class="bt-sws">${THEMES.map((t, i) => `<div class="tsw ${t[0] === on ? "on" : ""}"><span class="sw" style="${vars(t)}"><i></i><i></i></span><b>${i === 0 ? "System" : t[0]}</b></div>`).join("")}</div>`;
  const aCtl = () => `
    <div class="gtitle first gflex">Boot screen<span class="sp"></span><span class="pill" style="--tc:var(--accent)">Changed</span></div>
    <div class="card bt-pick">${sws("Tokyo Night")}</div>
    ${ocard("Sign-in screen", [orow("Look", "Follows the system unless set", dd("Tokyo Night"), { ic: "user", sec: "system" })], { cls: "icons", act: `<span class="pill" style="--tc:var(--accent)">Changed</span>` })}
    ${ocard("System logo", [orow("Atlas logo", "On both screens, in apps", `${logo("row")}${btn("Choose…", "sm")}${btn("Nyx mark", "sm ghost")}`, { cls: "bt-lrow" })])}
    ${ocard("", [nrow("Earlier generations", "8 in the boot menu", "Updates", { ic: "hist", sec: "system" })], { cls: "icons bt-rec" })}`;
  const aPv = (which) => `
    ${pvhead(which === "signin" ? "Sign-in screen" : "Boot screen", which === "signin" ? "What everyone sees before signing in." : "What shows while Atlas starts.", seg(["Boot menu", "Boot screen", "Sign-in"], which === "signin" ? "Sign-in" : "Boot screen"))}
    <div class="bt-stage">${which === "signin" ? signin() : splash()}</div>
    ${pvfoot(which === "signin" ? "Each person's own theme takes over once they've signed in." : "The logo takes the theme's colour.", "eye2", `<span class="lnk">${icon("eye2")}Try it full screen</span>`)}`;
  const aSignin = () => `${split(aCtl(), aPv("signin"), { sec: "system", ctlw: 420, cls: "bt-a" })}${pend(2, "Boot screen and sign-in screen: Tokyo Night")}`;
  const aSplash = () => `${split(aCtl(), aPv("splash"), { sec: "system", ctlw: 420, cls: "bt-a" })}${pend(2, "Boot screen and sign-in screen: Tokyo Night")}`;

  /* ── B: the start of the day, step by step ─────────────────────────── */
  const step = (n, t, s, body, on) => `<div class="bt-step ${on ? "on" : ""}"><div class="sh"><span class="n">${n}</span><div><b>${t}</b><small>${s}</small></div></div>${body}</div>`;
  const bCtl = () => `
    ${step(1, "Boot menu", "Lists the system's generations", ocard("", [
      orow("Generations in the menu", "Disks › Clean up removes ones older than two weeks", `<span class="rv">8</span>`),
      nrow("Start an earlier one now", "Go back without restarting", "Updates"),
    ]), true)}
    ${step(2, "Boot screen", "While NyxOS starts", ocard("", [orow("Look", "", dd("Same as the system")), orow("Logo", "", `${logo("row")}${btn("Choose…", "sm")}`)]))}
    ${step(3, "Sign-in screen", "Before anyone signs in", ocard("", [orow("Look", "", dd("Tokyo Night")), nrow("Ways to sign in", "Password, face", "Sign-in & Security")]))}`;
  const bPv = () => `
    <div class="bt-film">${[["Boot menu", bootmenu(), true], ["Boot screen", splash(THEMES[0]), false], ["Sign-in", signin(TN), false]].map(([t, h, on], i) => `${i ? `<span class="ar">${icon("chev-r")}</span>` : ""}<div class="fr ${on ? "on" : ""}"><div class="mini">${h}</div><span>${i + 1} · ${t}</span></div>`).join("")}</div>
    <div class="bt-stage">${bootmenu()}</div>
    ${pvfoot("If a change goes wrong, start the generation before it. Your files stay.", "info")}`;
  const bBody = () => `${split(bCtl(), bPv(), { sec: "system", ctlw: 420, cls: "bt-b" })}${pend(1, "Sign-in screen: Tokyo Night")}`;

  REG("nyxos-boot", {
    name: "Boot & Sign-in",
    summary: "NyxOS's Boot & Sign-in page has two theme dropdowns (the boot screen and the sign-in screen), the system logo, an Apply row, and a Recovery row that sends you to Updates for earlier generations. You choose how two screens look without ever seeing them, and the boot menu, where those generations actually show, isn't on the page at all.",
    problems: [
      "<b>Looks chosen blind:</b> “Same as the system theme” and a list of theme names, with no picture of the boot or sign-in screen in any of them.",
      "<b>The boot menu is missing:</b> the page that's about starting the computer only says the boot menu lists earlier generations, and links to Updates.",
      "<b>The logo row is crowded:</b> a spinning preview, Choose… and Nyx mark beside a three-line description about SVGs drawn in currentColor.",
      "<b>Apply sits between groups:</b> the Apply row is a card of its own between the screens and Recovery, greyed out with nothing to say what's waiting.",
      "<b>Every row says System:</b> the tag repeats on each row, while what it means (a rebuild, a password, a minute or two) is only in the Apply row's description.",
    ],
    today: [
      ["nyxos-boot-1280", "Boot & Sign-in today", "Taken on a laptop without NyxOS's System Manager; the rows are all there, and the logo preview is still loading"],
      ["nyxos-boot-800", "Boot & Sign-in today at 800 px", "The logo's description wraps to three lines"],
    ],
    options: [
      { id: "a", name: "See each screen", idea: "Pick a look for the boot screen from swatches, and one for the sign-in screen, and the right side shows the screen as it'll look after you apply: the sign-in screen with the clock, the people on this computer and the password field, or the boot screen with your logo. A switch above it flips between the boot menu, the boot screen and the sign-in screen. Changes wait in the bar at the bottom.",
        shots: [["a-signin", "The sign-in screen in Tokyo Night", "Both screens changed; Apply builds them together"], ["a-splash-800", "The boot screen at 800 px", "The screen above the swatches"]] },
      { id: "b", name: "Step by step", idea: "The page follows what happens when you turn the computer on: 1, the boot menu with its generations; 2, the boot screen while NyxOS starts; 3, the sign-in screen. Each step has its few settings, and the right shows the three as a strip with the chosen one large, so the boot menu, where earlier generations live, is part of the page instead of a link to Updates.",
        shots: [["b-boot", "The boot menu, step 1", "Generation 47 running, four before it"]] },
    ],
    icons: {
      atlas: '<path d="M12 3 20 7.5v9L12 21l-8-4.5v-9z"/><path d="m8.5 15 3.5-7 3.5 7M9.8 12.5h4.4"/>',
    },
    pages: { "a-signin": page(aSignin), "a-splash": page(aSplash), "b-boot": page(bBody) },
  });
})();
