// Hardware › Power & Battery: power profiles (now, plugged in, on battery), the battery,
// brightness and the keyboard light, the session buttons, the lid and power button,
// hibernation, and the graphics mode on laptops with two GPUs.
(() => {
  const page = (body) => () => swin({ sec: "hardware", page: "Power & Battery", desc: "Power profiles, the battery, the lid and the power button.", body: body() });
  const PROF = [["leaf", "Power saver", "Longest battery"], ["balance", "Balanced", "For most things"], ["gauge", "Performance", "Fastest, warmest"]];
  const batt = (pct, o = {}) => `<div class="pw-batt ${o.cls || ""}"><div class="pw-bb"><div class="pw-bf" style="width:${pct}%"></div>${o.bolt ? `<span class="pw-bolt">${icon("bolt")}</span>` : ""}</div><i class="pw-bn"></i></div>`;
  const profCards = (on) => `<div class="pw-prof">${PROF.map(([ic, n, d]) => `<div class="pw-pc ${n === on ? "on" : ""}">${icon(ic)}<b>${n}</b><span>${d}</span></div>`).join("")}</div>`;

  /* ── A: the battery, and how long each profile lasts ───────────── */
  const batteryA = () => split(`
    <div class="gtitle first">Power profile</div>
    ${profCards("Balanced")}
    ${ocard("", [
      orow("When plugged in", "", dd("Performance"), { ic: "plug" }),
      orow("On battery", "In use now", dd("Balanced"), { ic: "battery" }),
    ], { cls: "icons pw-gap" })}
    ${ocard("Brightness", [
      orow("Screen", "", sl(70, "70%", 120), { ic: "sun" }),
      orow("Keyboard light", "", sl(66, "2 of 3", 120), { ic: "keyboard" }),
      orow("Turn the keyboard light off after", "", dd("30 seconds"), { ic: "clock" }),
    ], { cls: "icons" })}
    ${ocard("", [
      nrow("Lid and power button", "", "Suspend", { ic: "laptop" }),
      nrow("Lock, sleep and shut down", "", "", { ic: "power" }),
      nrow("Graphics", "", "Integrated", { ic: "chip" }),
    ], { cls: "icons pw-gap" })}`,
    `${pvhead("Battery", "Atlas · Lumen Book 14", `<div class="pill dot" style="--tc:var(--sec-hardware)">On battery</div>`)}
     <div class="card pw-hero">
       ${batt(82)}
       <div class="pw-ht"><b>82%</b><span>About 6 h 20 min left</span><small>Using 7.8 W right now</small></div>
     </div>
     <div class="card pw-last">
       <div class="pw-lh"><b>How long a full charge lasts</b><span>With what you usually do</span></div>
       ${[["leaf", "Power saver", 92, "about 9 h"], ["balance", "Balanced", 66, "about 6 h 30 min"], ["gauge", "Performance", 44, "about 4 h 20 min"]].map(([ic, n, w, t]) => `<div class="pw-lr ${n === "Balanced" ? "on" : ""}">${icon(ic)}<span>${n}</span><div class="pw-lbar"><b style="width:${w}%"></b></div><em>${t}</em></div>`).join("")}
     </div>
     <div class="pw-facts card">${[["Holds", "92% of new"], ["Charge limit", "Stops at 80%"], ["Charged", "214 times"], ["Size", "64 Wh"]].map(([k, v]) => `<div><small>${k}</small><span>${v}</span></div>`).join("")}</div>
     ${pvfoot("Stopping at 80% while plugged in helps the battery last for years.", "check-c")}`);

  /* ── B: the lid and buttons, drawn ─────────────────────────────── */
  const call = (cls, ic, t, v, o = "") => `<div class="pw-call ${cls} ${o}"><span class="lic" style="--tc:var(--sec-hardware)">${icon(ic)}</span><div><small>${t}</small>${dd(v)}</div></div>`;
  const lidB = () => split(`
    ${ocard("Power profile", [orow("Right now", "", seg(["Saver", "Balanced", "Performance"], "Balanced")), orow("When plugged in", "", dd("Performance")), orow("On battery", "", dd("Balanced"))], { first: true })}
    <div class="card pw-mini">${ring(82, { size: 46, c: "var(--sec-hardware)", label: "82%" })}<div><b>About 6 h 20 min left</b><span>On battery · stops charging at 80%</span></div>${icon("chev-r", "cv")}</div>
    ${ocard("Brightness", [orow("Screen", "", sl(70, "70%", 130), { ic: "sun" }), orow("Keyboard light", "", sl(66, "2 of 3", 130), { ic: "keyboard" })], { cls: "icons" })}
    <div class="gtitle">Right now</div>
    <div class="pw-acts">${btn("Lock", "", "lock")}${btn("Suspend", "", "moon")}${btn("Hibernate", "", "disc")}</div>
    <div class="pw-acts">${btn("Log out", "dtext", "user")}${btn("Restart", "dtext", "refresh")}${btn("Shut down", "dtext", "power")}</div>`,
    `${pvhead("Lid and power button", "What Atlas does when you close it or press its button.")}
     <div class="pw-stage">
       <div class="pw-lap">
         <div class="pw-scr"><div class="pw-glass" style="background:${wall("atlas-lumen")}"><span class="mb"></span><span class="mw"></span><span class="mw b"></span></div></div>
         <div class="pw-deck"><span class="pw-keys">${Array.from({ length: 42 }, () => "<i></i>").join("")}</span><span class="pw-pwr"></span><span class="pw-pad"></span></div>
       </div>
       <svg class="pw-lines" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M30,33 L35.5,33"/><path d="M70,33 L64.5,33"/><path d="M30,67 L33.5,48"/><path d="M70,67 L63,50"/></svg>
       <i class="pw-dot" style="left:35.5%;top:33%"></i><i class="pw-dot" style="left:64.5%;top:33%"></i><i class="pw-dot" style="left:33.5%;top:48%"></i><i class="pw-dot" style="left:63%;top:50%"></i>
       ${call("l1", "battery", "Lid closes on battery", "Suspend, then hibernate", "hot")}
       ${call("r1", "plug", "Lid closes on power", "Suspend")}
       ${call("l2", "monitor", "Lid closes, screen connected", "Do nothing")}
       ${call("r2", "power", "Power button", "Power off")}
     </div>
     <div class="card pw-sth">
       <div class="pw-sh"><b>Suspend, then hibernate</b><span class="sp"></span><span class="dim">Hibernate after</span>${dd("2 hours")}</div>
       <div class="pw-st"><div class="a" style="flex:2"><b>Asleep</b><span>Wakes in a second</span></div><div class="b" style="flex:3"><b>Hibernating</b><span>Uses no battery; wakes in about 15 seconds</span></div></div>
       <div class="pw-sx"><span>Lid closes</span><span>2 hours</span><span></span></div>
     </div>`, { ctlw: 400 });

  /* ── C: plugged in or on battery, and a day of it ──────────────── */
  const LEVEL = [100, 100, 100, 100, 100, 100, 100, 100, 100, 96, 88, 80, 74, 73, 72, 72, 66, 58, 80, 96, 100, 100, 100, 100];
  const dayC = () => split(`
    <div class="pw-tabs"><div class="pw-tab on">${icon("battery")}<div><b>On battery</b><span>In use now</span></div></div><div class="pw-tab">${icon("plug")}<div><b>Plugged in</b><span>Charging stops at 80%</span></div></div></div>
    ${ocard("", [
      orow("Profile", "", seg(["Saver", "Balanced", "Performance"], "Balanced"), { ic: "gauge" }),
      orow("When the lid closes", "", dd("Suspend, then hibernate"), { ic: "laptop" }),
      orow("Hibernate after", "Asleep first, so it wakes quickly.", dd("2 hours"), { ic: "clock" }),
    ], { cls: "icons pw-gap" })}
    ${ocard("Either way", [
      orow("Lid closes, screen connected", "", dd("Do nothing"), { ic: "monitor" }),
      orow("Power button", "", dd("Power off"), { ic: "power" }),
      orow("Screen brightness", "", sl(70, "70%", 110), { ic: "sun" }),
      orow("Keyboard light", "Off after 30 seconds", sl(66, "2 of 3", 110), { ic: "keyboard" }),
    ], { cls: "icons" })}
    ${ocard("", [nrow("Lock, sleep and shut down", "", "", { ic: "power" }), nrow("Graphics", "", "Integrated", { ic: "chip" })], { cls: "icons pw-gap" })}`,
    `${pvhead("Yesterday", "What your settings did as the day went.", seg(["Yesterday", "Today"], "Yesterday"))}
     <div class="card pw-day">
       <div class="pw-yl"><span>100%</span><span>50%</span><span>0%</span></div>
       <div class="pw-plot">
         <svg viewBox="0 0 23 100" preserveAspectRatio="none"><path class="fa" d="M0,100 ${LEVEL.map((v, i) => `L${i},${100 - v}`).join(" ")} L23,100Z"/><path class="ln" d="M${LEVEL.map((v, i) => `${i},${100 - v}`).join(" L")}"/></svg>
         <div class="pw-band" style="left:0;width:39%"></div><div class="pw-band bat" style="left:39%;width:39%"></div><div class="pw-band" style="left:78%;width:22%"></div>
         ${[["9:10", 39, "Unplugged", "Balanced", "left"], ["12:30", 52, "Lid closed", "Asleep", ""], ["14:30", 61, "", "Hibernated", "lo"], ["18:00", 78, "Plugged in", "Performance", ""]].map(([t, x, a, b, c]) => `<div class="pw-ev ${c}" style="left:${x}%"><i></i><div><small>${t}</small><b>${a || b}</b>${a ? `<span>${b}</span>` : ""}</div></div>`).join("")}
       </div>
       <div class="pw-xl"><span>0:00</span><span>6:00</span><span>12:00</span><span>18:00</span><span>24:00</span></div>
     </div>
     <div class="pw-key"><span><i class="ac"></i>Plugged in · Performance</span><span><i class="bat"></i>On battery · Balanced</span></div>
     <div class="pw-sum">${[["6 h 10 min", "on battery"], ["2 h", "asleep, then hibernated"], ["−34%", "battery used"]].map(([a, b]) => `<div class="card"><b>${a}</b><span>${b}</span></div>`).join("")}</div>`, { ctlw: 440 });

  REG("power", {
    name: "Power & Battery",
    summary: "Power & Battery has a profile for now, plugged in and on battery, the battery's status, brightness and the keyboard light, then the session buttons, the lid and power button and hibernation in folded groups. All of it is the same rows of dropdowns, and the battery is two lines of text.",
    problems: [
      "<b>The battery is two text rows:</b> “100% · Fully charged · 86Wh” and “Time remaining: Plugged in”; there's no gauge, no sense of its health or the charge limit.",
      "<b>Three profile dropdowns in a row:</b> Right now, When plugged in and On battery look alike, and nothing says what a profile changes or how long the battery lasts on each.",
      "<b>Lid and buttons are hidden:</b> four dropdowns named after logind's settings sit in a folded group at the bottom, with the hibernation delay explained in a sentence.",
      "<b>Shut down and restart sit in Settings</b> as a folded “Session” group of buttons that each need a second click, mixed in with configuration.",
      "<b>At 800 px</b> the descriptions wrap (“Switched to automatically when power changes. This is the one in use now.”) and brightness is below the fold.",
    ],
    today: [["power-1280", "Today", ""], ["power-800", "Today at 800 px", ""]],
    options: [
      { id: "a", name: "Battery and profiles", idea: "The right side is the battery: a gauge with the time left and what it's using now, how long a full charge lasts on each profile (so choosing one shows what it costs), and its health and charge limit. On the left the profiles are three cards to pick from, with the plugged-in and on-battery choices under them, then brightness. The lid, the session buttons and graphics are one row each.",
        shots: [["a-battery", "On battery, Balanced", ""], ["a-battery-800", "At 800 px", "The battery above, the profiles below"]] },
      { id: "b", name: "The lid and buttons, drawn", idea: "The picture is the laptop itself, with a label on the lid and on the power button saying what each does, changed right there. Under it, “Suspend, then hibernate” is drawn as two stretches (asleep, then hibernating) with the delay between them. The left keeps the profiles, a battery summary, brightness and Lock, Suspend and Shut down buttons.",
        shots: [["b-lid", "The lid and power button on Atlas", ""]] },
      { id: "c", name: "Plugged in or on battery", idea: "Settings are grouped by when they apply: switch between On battery and Plugged in at the top to see that state's profile and what closing the lid does, with the rest under “Either way”. The picture is a day of the battery, marked where the computer was unplugged, slept, hibernated and switched profile, so you can see your settings at work.",
        shots: [["c-day", "On battery, with yesterday's battery", ""]] },
    ],
    icons: {
      plug: '<path d="M9 3v5M15 3v5M6.5 8h11v3.5a5.5 5.5 0 0 1-11 0zM12 17v4"/>',
      bolt: '<path d="M13 2.5 5 13.5h6l-1 8 8-11h-6z"/>',
      gauge: '<path d="M4 17a8 8 0 1 1 16 0"/><path d="m12 17 4.5-5.5"/><circle cx="12" cy="17" r="1.2"/>',
      leaf: '<path d="M5 19c0-8.5 5.5-14 15-14 0 9.5-5.5 15-14 15"/><path d="m5 19 8-8"/>',
      balance: '<path d="M12 4v16M7 20h10M5 8h14M5 8l-2.5 6a2.5 2.5 0 0 0 5 0zM19 8l-2.5 6a2.5 2.5 0 0 0 5 0z"/>',
    },
    pages: { "a-battery": page(batteryA), "b-lid": page(lidB), "c-day": page(dayC) },
  });
})();
