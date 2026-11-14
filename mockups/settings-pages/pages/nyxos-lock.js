// NyxOS › Security › Lock Screen: when the screen locks, turns off and the computer sleeps,
// how Nyx Locker looks, the ways to unlock, and staying awake. Saved as you go (nyx-system
// config), no password and no rebuild.
(() => {
  const DESC = "When the screen locks, turns off and sleeps, and how the lock screen looks.";
  const page = (body) => () => nwin({ cat: "security", page: "Lock Screen", desc: DESC, body: body() });
  const STYLES = [["circular", "Circular"], ["cyberpunk", "Cyberpunk"], ["minimal", "Minimal"], ["edge", "Edge glow"]];

  /* ── Drawings ─────────────────────────────────────────────────────── */
  const mini = (k) => ({
    use: `<div class="lks-m use"><i class="bar"></i><i class="w1"></i><i class="w2"></i></div>`,
    lock: `<div class="lks-m lock"><b>14:30</b><i class="av"></i><i class="pw"></i></div>`,
    off: `<div class="lks-m off"></div>`,
    sleep: `<div class="lks-m sleep">${icon("moon")}</div>`,
  })[k];
  const anim = (id) => ({
    circular: `<span class="lks-an circ"><i></i></span>`,
    cyberpunk: `<span class="lks-an cyb"><i></i><i></i><i></i><i></i><b></b></span>`,
    minimal: `<span class="lks-an min"><i></i></span>`,
    edge: `<span class="lks-an edge"></span>`,
  })[id];
  const styleTile = ([id, n], on) => `<div class="lks-st ${on ? "on" : ""}"><div class="tp ${id}"><i class="clk"></i><span class="box">${anim(id)}</span><i class="fld"></i></div><b>${n}</b></div>`;
  const lockscreen = (style = "circular") => `<div class="lks-scr ${style}">
      <div class="clock"><b>14:30</b><span>Friday 13 November</span></div>
      <div class="who"><span class="ring">${av("Sam Rivera", 64)}${style === "circular" ? `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="46"/></svg>` : ""}</span><b>Sam Rivera</b><div class="pw"><span>•••••</span></div><small>Checking your password…</small></div>
      <div class="bot"><span>${icon("keyboard")}English (US)</span><span class="sp"></span><span>${icon("battery")}82%</span></div>
    </div>`;

  /* ── A: a timeline from the last touch ─────────────────────────────── */
  const TIMES = [["lock", "Lock the screen after", "0 never locks on its own", 8, "5 min"], ["monitor", "Turn the screen off after", "0 leaves it on", 10, "6 min"], ["moon", "Sleep after", "Closing the lid still sleeps", 25, "30 min"]];
  const aCtl = () => `
    ${ocard("When you're away", TIMES.map(([ic, t, d, p, v]) => orow(t, d, sl(p, v, 96), { ic, sec: "accounts" })), { first: true, cls: "icons lks-times" })}
    ${ocard("Look", [orow("Sign-in animation", "While it checks your password or face", dd("Circular"), { ic: "eye2", sec: "accounts" }), orow("Preview", "Opens the lock screen in a window; the password is “nyx”", btn("Preview", "sm"), { ic: "window", sec: "accounts" })], { cls: "icons" })}
    ${ocard("", [nrow("Ways to unlock", "Your password or your face, whichever comes first", "Sign-in", { ic: "shield", sec: "accounts" })], { cls: "icons lks-gap" })}
    ${ocard("Right now", [orow("Stay awake", "Keeps the screen on and unlocked until you turn it off or sign out", sw(false), { ic: "sun", sec: "accounts" })], { cls: "icons" })}`;
  // minutes → position on a 0–40 min axis that gives the first minutes more room
  const X = (m) => (m <= 10 ? m * 7 : 70 + (m - 10)).toFixed(2);
  const aPv = () => `
    ${pvhead("After your last touch", "What Atlas does when you walk away, as you set it.", btn("Lock now", "sm", "lock"))}
    <div class="lks-flow">${[["use", "You're working", "Any key or touch starts this again", ""], ["lock", "Locked", "after 5 min", "lock"], ["off", "Screen off", "after 6 min", "monitor"], ["sleep", "Asleep", "after 30 min", "moon"]].map(([k, t, s], i) => `${i ? `<span class="ar">${icon("chev-r")}</span>` : ""}<div class="stg ${k}">${mini(k)}<b>${t}</b><small>${s}</small></div>`).join("")}</div>
    <div class="lks-axis card">
      <div class="trk">
        <span class="seg use" style="left:0;width:${X(5)}%"></span><span class="seg lock" style="left:${X(5)}%;width:${X(6) - X(5)}%"></span><span class="seg off" style="left:${X(6)}%;width:${X(30) - X(6)}%"></span><span class="seg sleep" style="left:${X(30)}%;right:0"></span>
        ${[[5, "Lock", "lock"], [6, "Off", "monitor"], [30, "Sleep", "moon"]].map(([m, l, ic]) => `<span class="hd ${l === "Lock" ? "hot" : ""}" style="left:${X(m)}%">${icon(ic)}</span><span class="hl ${l === "Off" ? "lo" : ""}" style="left:${X(m)}%">${l} · ${m} min</span>`).join("")}
      </div>
      <div class="ticks">${[0, 2, 4, 6, 8, 10, 20, 30, 40].map((m) => `<small style="left:${X(m)}%">${m}${m === 40 ? " min" : ""}</small>`).join("")}</div>
    </div>
    <div class="lks-note card">${icon("info")}<div><b>On battery it's the same</b><span>These times hold whether Atlas is plugged in or not; Power has what the lid and the power button do.</span></div></div>
    ${pvfoot("Saved as you change it. No password, no rebuild.", "check-c")}`;
  const aBody = () => split(aCtl(), aPv(), { sec: "accounts", ctlw: 450, cls: "lks-a" });

  /* ── B: the lock screen itself ─────────────────────────────────────── */
  const bCtl = () => `
    <div class="gtitle first">When you're away</div>
    <div class="card lks-mini">
      <div class="lks-bar"><b class="b1" style="flex:5"></b><b class="b2" style="flex:1"></b><b class="b3" style="flex:6"></b></div><div class="lks-bl"><span style="flex:5">Locks at 5 min</span><span style="flex:7">Screen off at 6 · never sleeps</span></div>
      ${orow("Lock the screen after", "", dd("5 minutes"))}${orow("Turn the screen off after", "", dd("6 minutes"))}${orow("Sleep after", "Closing the lid still sleeps", dd("Never"))}
    </div>
    ${ocard("Unlocking", [orow("Your password", "Always works", icon("check", "okc"), { ic: "lock", sec: "accounts" }), orow("Your face", "Set up on Sign-in & Security", icon("check", "okc"), { ic: "eye2", sec: "accounts" }), nrow("Add a fingerprint or a security key", "", "Sign-in", { ic: "plus", sec: "accounts" })], { cls: "icons" })}
    ${ocard("Right now", [orow("Stay awake", "For presentations and long downloads", sw(true), { ic: "sun", sec: "accounts" }), orow("Lock now", "", btn("Lock", "sm"), { ic: "lock", sec: "accounts" })], { cls: "icons" })}`;
  const bPv = () => `
    ${pvhead("Your lock screen", "How it looks while it checks your password or face.", btn("Try it", "sm", "eye2"))}
    <div class="lks-stage">${lockscreen("circular")}</div>
    <div class="lks-sts">${STYLES.map((s) => styleTile(s, s[0] === "circular")).join("")}</div>
    <div class="lks-awake">${icon("sun")}<span><b>Stay awake is on.</b> Atlas won't lock or sleep until you turn it off or sign out.</span>${btn("Turn off", "sm")}</div>`;
  const bBody = () => split(bCtl(), bPv(), { sec: "accounts", ctlw: 420, cls: "lks-b" });

  REG("nyxos-lock", {
    name: "Lock Screen",
    summary: "NyxOS's Lock Screen page has a small timeline over three sliders (lock, screen off, sleep), the four sign-in animations as pictures, Preview, Ways to unlock, and Stay awake. Everything saves as you go. The timeline is a thin line with labels that collide, and the lock screen's look is a row of thumbnails far down the page.",
    problems: [
      "<b>The timeline is hard to read:</b> a thin line with dots, and the “Lock · 5 min” and “Screen off · 6 min” labels stack on top of each other when the times are close.",
      "<b>Sliders for minutes:</b> an hour-long slider makes 5 and 6 minutes a few pixels apart, and the readouts are in a monospaced font that looks out of place.",
      "<b>The look is buried:</b> the four animations sit under the times, and the page is cut off at 800 px before Preview and Ways to unlock.",
      "<b>Stay awake is last:</b> the switch you reach for before a presentation is at the very bottom, under Look.",
      "<b>Nothing says it saves itself:</b> unlike NyxOS's system pages there's no Apply, but the page doesn't say changes are kept as you make them.",
    ],
    today: [
      ["nyxos-idle-1280", "Lock Screen today", "Taken on a laptop without NyxOS's System Manager; the times and styles are its defaults, and Preview, Ways to unlock and Stay awake are below the fold"],
      ["nyxos-idle-800", "Lock Screen today at 800 px", "The timeline's labels overlap; the page is cut after the animations"],
    ],
    options: [
      { id: "a", name: "After your last touch", idea: "The controls are three sliders, the look, how you unlock and Stay awake, each a short card. The picture is what happens when you walk away: four little screens from working to locked, screen off and asleep, with when each comes, and under them a time axis that gives the first minutes more room so 5 and 6 minutes don't run together. You drag the handles on it or the sliders; both move.",
        shots: [["a-lock", "Lock, screen off and sleep", "5, 6 and 30 minutes"], ["a-lock-800", "At 800 px", "The four screens above the sliders"]] },
      { id: "b", name: "The lock screen itself", idea: "The picture is the lock screen as it'll look, large, with the four animations under it to pick from and Try it to open it for real. The times become three dropdowns under a small bar, how you unlock is a short list of what works today, and when Stay awake is on, a line under the picture says so and turns it off.",
        shots: [["b-lock", "Circular, with Stay awake on", "Password and face both work"]] },
    ],
    pages: { "a-lock": page(aBody), "b-lock": page(bBody) },
  });
})();
