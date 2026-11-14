// System › Boot & Login: the boot menu, the start-up and login screens' look, signing in, hibernation and recovery.
(() => {
  const sec = "system";
  const page = (ctl, pv, ctlw) => () => swin({ sec, page: "Boot & Login", desc: "What you see from power-on to your desktop, and how to get back if something breaks.", body: split(ctl(), pv(), { sec, ctlw }) });
  const L = (ic) => ({ ic, sec });
  // Themes the screens can borrow: [name, background, accent, text].
  const THEMES = [["Omarchy", "#101114", "#e7e8ee", "#e7e8ee"], ["Tokyo Night", "#1a1b26", "#7aa2f7", "#c0caf5"], ["Catppuccin", "#1e1e2e", "#cba6f7", "#cdd6f4"], ["Gruvbox", "#282828", "#d79921", "#ebdbb2"], ["Nord", "#2e3440", "#88c0d0", "#eceff4"], ["Rosé Pine", "#191724", "#ebbcba", "#e0def4"]];
  const TV = (name) => { const t = THEMES.find((x) => x[0] === name); return `--b-bg:${t[1]};--b-acc:${t[2]};--b-tx:${t[3]}`; };

  /* The three screens, drawn in a theme. */
  const bootMenu = (th = "Tokyo Night") => `<div class="bt-scr menu" style="${TV(th)}"><div class="mn"><small>Limine</small>
      ${[["Omarchy", true], ["Snapshot · Nov 12, 9:40 AM"], ["Snapshot · Nov 10, 6:15 PM"], ["Firmware settings"]].map(([t, on]) => `<span class="${on ? "on" : ""}">${t}</span>`).join("")}
      <em>Starting Omarchy in 3 s</em></div></div>`;
  const splash = (th = "Tokyo Night") => `<div class="bt-scr splash" style="${TV(th)}"><div class="sp1">${icon("nyxapp")}<b>omarchy</b></div><div class="unl"><span>Unlock the disk</span><div class="pwd"><i></i><i></i><i></i><i></i><i></i></div></div></div>`;
  const login = (th = "Tokyo Night", o = {}) => `<div class="bt-scr login" style="${TV(th)}">
      <div class="lt">2:18 PM<small>Friday, November 13</small></div>
      <div class="lc">${av("Sam Rivera", o.big ? 64 : 40)}<b>Sam Rivera</b><div class="pf"><span>Password</span>${icon("chev-r")}</div>${o.big ? `<div class="others">${av("Alex Kim", 24)}${av("Jordan Lee", 24)}<span>Other people</span></div>` : ""}</div>
      <div class="lb"><span>${icon("window")}Hyprland</span><span>${icon("power")}</span></div>
    </div>`;

  /* ── A: from power-on to sign-in, step by step ── */
  const ctlA = () => `
    ${ocard("Start-up", [
      orow("Boot menu", "Skip it to start right away", seg(["Show", "Skip"], "Show"), L("list")),
      nrow("Restore a snapshot", "Go back to how the system was", "4 saved", L("history")),
    ], { first: true, cls: "icons" })}
    ${ocard("Look", [
      orow("Style from a theme", "For start-up and login", dd("Tokyo Night"), L("palette")),
    ], { cls: "icons" })}
    ${ocard("Signing in", [
      orow("Sign in automatically", "As Sam Rivera, once the disk is unlocked", sw(true), L("user")),
      orow("Hibernation", "Saves everything to disk, then switches off", sw(true), L("moon")),
    ], { cls: "icons" })}
    ${ocard("", [nrow("If something goes wrong", "Repairs, and Omarchy's own look", "", L("wrench"))], { cls: "icons" })}`;
  const STEPS = [
    [bootMenu, "Boot menu", "Shows for 3 seconds. Pick a snapshot here to go back.", "Shown"],
    [splash, "Start-up screen", "Tokyo Night's colours and logo, while it asks for the disk password.", "Tokyo Night"],
    [login, "Login screen", "Skipped: Sam signs in automatically. It still shows after you log out.", "Skipped"],
  ];
  const pvA = () => `
    ${pvhead("From power-on to your desktop", "About 9 seconds on Atlas. Each step as it will look.", btn("Restart to try it", "sm", "power"))}
    <div class="bt-steps">${STEPS.map(([f, t, d, v], i) => `<div class="bt-step card ${i === 2 ? "skip" : ""}"><span class="n">${i + 1}</span><div class="th">${f()}</div><div class="tx"><b>${t}</b><span>${d}</span></div><span class="pill" style="--tc:${i === 2 ? "var(--text-tertiary)" : "var(--sec-system)"}">${v}</span></div>`).join("")}
      <div class="bt-step card end"><span class="n">${icon("check")}</span><div class="tx"><b>Your desktop</b><span>After hibernating, everything opens where you left it.</span></div></div>
    </div>`;

  /* ── B: one big screen and the themes under it ── */
  const ctlB = () => `
    ${ocard("Signing in", [
      orow("Sign in automatically", "As Sam Rivera", sw(false), L("user")),
      nrow("Your face on the login screen", "On Sign-in & Security", "Off", L("face")),
    ], { first: true, cls: "icons" })}
    ${ocard("Start-up", [
      orow("Show the boot menu", "To pick a snapshot or another system", sw(true), L("list")),
      orow("Hibernation", "Opens where you left off", sw(true), L("moon")),
    ], { cls: "icons" })}
    ${ocard("If something goes wrong", [
      nrow("Restore a snapshot", "", "4 saved", L("history")),
      orow("Repair the login screen", "Reinstall it if it looks broken", btn("Repair…", "sm"), L("wrench")),
      orow("Repair the boot menu", "Rebuild its settings", btn("Repair…", "sm"), L("wrench")),
    ], { cls: "icons" })}`;
  const pvB = () => `
    ${pvhead("Login screen", "What everyone sees after a restart or when they log out.", seg(["Boot menu", "Start-up", "Login"], "Login"))}
    <div class="bt-big">${login("Catppuccin", { big: true })}</div>
    <div class="bt-th">${THEMES.map(([n, b, a]) => `<div class="tc ${n === "Catppuccin" ? "on" : ""}"><span class="sw" style="background:${b}"><i style="background:${a}"></i></span><b>${n}</b></div>`).join("")}</div>
    ${pvfoot("Catppuccin is your desktop theme too. Applying asks for your password in a terminal.", "palette", btn("Apply", "primary sm"))}`;

  REG("boot", {
    name: "Boot & Login",
    summary: "Three groups of button rows: Boot and login screens (a theme dropdown, Back to default, Repair login screen), Hibernation (one row whose description says On, with a Remove button), and Recovery and boot loader (Restore a snapshot, Boot directly, Repair the boot menu). Every action opens a terminal, and nothing shows what the screens look like.",
    problems: [
      "<b>No picture of the screens it styles:</b> “Style from a theme” is a dropdown; you only see the boot and login screens by restarting.",
      "<b>Buttons instead of settings:</b> hibernation is a row with a Remove… button and “On.” at the start of its description, rather than a switch.",
      "<b>Jargon for the boot menu:</b> “Add or remove a firmware boot entry so the computer starts Omarchy without the boot menu” behind a button called Open…, which wraps at 800 px.",
      "<b>Repairs sit with everyday choices:</b> Repair login screen and Repair the boot menu are as prominent as the theme, one per group.",
      "<b>A long note before the first row</b> explains that a terminal opens and asks for your password, and wraps to two lines at both widths.",
      "<b>Signing in is somewhere else:</b> whether you sign in automatically, and whether the login screen takes your face, live on other pages.",
    ],
    today: [["boot-1280", "Today", ""], ["boot-800", "Today at 800 px", ""]],
    icons: {
      wrench: '<path d="M14.5 6.5a4 4 0 0 0-5.3 5.3L4 17l3 3 5.2-5.2a4 4 0 0 0 5.3-5.3l-2.5 2.5-2.5-.5-.5-2.5z"/>',
      face: '<path d="M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2"/><path d="M9 9.5v1M15 9.5v1M12 10v3h-1M9.5 15.5a4 4 0 0 0 5 0"/>',
    },
    options: [
      { id: "a", name: "Step by step", idea: "The right side is the start-up in order: the boot menu, the start-up screen asking for the disk password, the login screen, then your desktop, each drawn small in the chosen theme with a line on what happens there. Settings on the left change the steps you see: skip the boot menu and its step greys out; sign in automatically and the login step says it's skipped. Repairs and going back to Omarchy's own look move to one row, If something goes wrong.",
        shots: [["a-steps", "From power-on to the desktop", "The login screen is skipped because Sam signs in automatically"], ["a-steps-800", "At 800 px", ""]] },
      { id: "b", name: "One screen, big", idea: "One large picture of the screen you're styling, with a switch above it for the boot menu, the start-up screen and the login screen, and your themes as swatches under it: click one and the picture changes, then Apply. Signing in, the boot menu and hibernation are switches on the left; snapshots and the two repairs share a card at the bottom.",
        shots: [["b-big", "The login screen in Catppuccin", "Two other people on the computer show under the password"], ["b-big-800", "At 800 px", ""]] },
    ],
    pages: {
      "a-steps": page(ctlA, pvA, 410),
      "b-big": page(ctlB, pvB, 400),
    },
  });
})();
