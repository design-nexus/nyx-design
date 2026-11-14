// Hardware › Lock Screen: when the screensaver starts and the screen locks, staying awake
// for now, whether the screensaver shows, Suspend in the system menu, and Lock now.
(() => {
  const page = (body) => () => swin({ sec: "hardware", page: "Lock Screen", desc: "When the screensaver starts, the screen locks and the computer sleeps.", body: body() });
  const desk = () => `<div class="id-scr id-desk" style="background:${wall("atlas-lumen")}"><span class="mb"></span><span class="mw"></span><span class="mw b"></span></div>`;
  const saver = () => `<div class="id-scr id-saver"><pre>${["  ▄▀▀▄ ▀█▀ █   ▄▀▀▄ ▄▀▀▀", "  █▄▄█  █  █   █▄▄█ ▀▀▀▄", "  █  █  █  █▄▄ █  █ ▄▄▄▀"].join("\n")}</pre></div>`;
  const lock = (big) => `<div class="id-scr id-lock ${big ? "big" : ""}" style="--w:${wall("atlas-lumen")}"><div class="id-blur"></div>
      <div class="id-lc"><b>14:17</b><span>Friday, 13 November</span></div>
      <div class="id-lu">${av("Sam Rivera", big ? 54 : 22)}<b>Sam Rivera</b><span class="id-pw">${big ? `<i></i><i></i><i></i><i></i><i></i>` : ""}</span></div>
      ${big ? `<div class="id-lb">${icon("wifi")}${icon("battery")}<span>82%</span></div>` : ""}
    </div>`;

  /* ── A: a timeline from when you stop ──────────────────────────── */
  const stage = (pic, t, s, on) => `<div class="id-st ${on ? "on" : ""}">${pic}<b>${t}</b><span>${s}</span></div>`;
  const timelineA = () => split(`
    ${ocard("When you step away", [
      orow("Screensaver after", "", sl(9, "5 min", 140), { ic: "spark" }),
      orow("Lock after", "", sl(17, "10 min", 140), { ic: "lock" }),
      orow("Show the screensaver", "Off goes straight to the lock screen.", sw(true), { ic: "eye" }),
    ], { first: true, cls: "icons" })}
    ${ocard("Right now", [
      orow("Stay awake", "Keep the screen on and unlocked until you turn this off: for talks and long downloads.", sw(false), { ic: "sun" }),
      orow("Lock the screen now", "", btn("Lock", "", "lock"), { ic: "lock" }),
    ], { cls: "icons" })}
    ${ocard("System menu", [
      orow("Show Suspend", "In the menu with Lock, Restart and Shut down.", sw(true), { ic: "moon" }),
      nrow("Lid, power button and sleep", "On Power & Battery", "", { ic: "battery" }),
    ], { cls: "icons" })}`,
    `${pvhead("When you step away", "Drag a dot to change when it happens.")}
     <div class="id-mid"><div class="id-stages">
       ${stage(desk(), "You stop", "Your desktop, as you left it")}
       <i class="id-arr">${icon("chev-r")}</i>
       ${stage(saver(), "5 minutes", "The screensaver starts")}
       <i class="id-arr">${icon("chev-r")}</i>
       ${stage(lock(), "10 minutes", "The screen locks", true)}
     </div>
     <div class="card id-tl">
       <div class="id-track"><div class="id-fill" style="width:62%"></div>
         ${[[0, "You stop", ""], [31, "Screensaver", "5 min"], [62, "Lock", "10 min"]].map(([x, n, t], i) => `<div class="id-mk ${i ? "h" : ""}" style="left:${x}%"><i></i><b>${n}</b><span>${t}</span></div>`).join("")}
       </div>
       <div class="id-ticks">${[0, 2, 4, 6, 8, 10, 12, 14, 16].map((m) => `<span>${m}</span>`).join("")}</div>
     </div></div>
     ${pvfoot("Moving the mouse or pressing a key starts the count again from the beginning.", "info")}`);

  /* ── B: what you'll see ────────────────────────────────────────── */
  const chips = (items, on) => `<div class="id-chips">${items.map((x) => `<span class="chip2 ${x === on ? "on" : ""}">${x}</span>`).join("")}</div>`;
  const lookB = () => split(`
    <div class="card id-awake"><span class="lic" style="--tc:var(--sec-hardware)">${icon("sun")}</span><div class="opt-text"><div>Stay awake</div><div class="d">Until you turn it off</div></div>${sw(false)}</div>
    <div class="gtitle">Start the screensaver</div>
    <div class="card id-pick">${chips(["Never", "2 min", "5 min", "10 min", "15 min"], "5 min")}</div>
    <div class="gtitle">Lock the screen</div>
    <div class="card id-pick">${chips(["Never", "5 min", "10 min", "15 min", "30 min"], "10 min")}<div class="id-note">${icon("info")}5 minutes after the screensaver starts.</div></div>
    ${ocard("", [
      orow("Show the screensaver before locking", "", sw(true)),
      orow("Suspend in the system menu", "", sw(true)),
    ], { cls: "id-gap" })}
    ${ocard("", [nrow("Lid, power button and sleep", "On Power & Battery", "", { ic: "battery" })], { cls: "icons id-gap" })}`,
    `${pvhead("What you'll see", "Sam Rivera's lock screen on Atlas.", `${seg(["Screensaver", "Lock screen"], "Lock screen")}${btn("Lock now", "sm", "lock")}`)}
     <div class="id-frame">${lock(true)}</div>
     <div class="id-facts card">${[["lock", "Unlock with", "Your password"], ["bell", "Notifications", "Hidden until you unlock"], ["image", "Background", "Your wallpaper, blurred"]].map(([ic, k, v]) => `<div>${icon(ic)}<span><small>${k}</small>${v}</span></div>`).join("")}</div>`, { ctlw: 410 });

  REG("idle", {
    name: "Lock Screen",
    summary: "Lock Screen already draws a timeline of when the screensaver starts and the screen locks, with a slider for each, then Stay awake, the screensaver switch, Suspend in the system menu and Lock now. It's short, but the timeline is a thin line far from its sliders and nothing shows what the screensaver or lock screen look like.",
    problems: [
      "<b>The timeline is a thin line:</b> two dots labelled in tiny bold text at the top of the card, with the sliders that move them below.",
      "<b>Minutes in a monospace font:</b> “5 min” and “10 min” as readouts at the end of long sliders that run to 60, so small times are a few pixels apart.",
      "<b>Zero means off, explained in grey:</b> “0 turns the screensaver off” and “0 never locks on its own” instead of a Never choice.",
      "<b>No picture of what happens:</b> nothing shows the screensaver or the lock screen, and the Screensaver switch is far from the slider it affects.",
      "<b>Lock now is a row at the bottom</b> with its button cut off at 1280 × 800; Stay awake, which you'd use most, is a group of its own in the middle.",
    ],
    today: [["idle-1280", "Today", ""], ["idle-800", "Today at 800 px", ""]],
    options: [
      { id: "a", name: "A timeline from when you stop", idea: "The picture is what your screen does after you step away: your desktop, then the screensaver at 5 minutes, then the lock screen at 10, each drawn small with a track under them whose dots you drag. On the left the two times are sliders next to the screensaver switch they go with, then Stay awake and Lock now, then the system menu.",
        shots: [["a-timeline", "Screensaver at 5 minutes, lock at 10", ""], ["a-timeline-800", "At 800 px", "The timeline above, the settings below"]] },
      { id: "b", name: "What you'll see", idea: "Stay awake is the first thing on the page. The times are rows of choices (Never, 1, 2, 5 minutes…) instead of sliders to 60, and under the lock time a line says how long after the screensaver it comes. The right shows the lock screen itself, or the screensaver with the switch above it, with Lock now beside them to try it.",
        shots: [["b-look", "The lock screen", ""]] },
    ],
    pages: { "a-timeline": page(timelineA), "b-look": page(lookB) },
  });
})();
