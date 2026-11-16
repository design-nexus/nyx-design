// Activity › Startup.
(() => {
  // [name, colour, kind, how long it took, on]
  const ITEMS = [
    ["omarchy-backup", "graphite", "Service", "5 min 41 s", true, "slow"],
    ["wayland-session-waitenv", "graphite", "Service", "4.3 s", true],
    ["Syncthing", "graphite", "App", "2.1 s", true],
    ["hyprpolkitagent", "violet", "Hyprland", "2.1 s", true],
    ["nyx-icons", "blue", "Service", "1.2 s", true],
    ["Events and Tasks Reminders", "amber", "App", "0.6 s", true],
    ["Fcitx 5", "green", "App", "0.4 s", false],
  ];
  const boot = () => acard("Your last start", `${stack([[24, "var(--sw-graphite)", "Firmware", "6.7 s"], [15, "var(--sw-blue)", "Boot loader", "4.0 s"], [38, "var(--sw-violet)", "Kernel", "10.4 s"], [23, "var(--sw-teal)", "System services", "6.6 s"]], { cls: "tall" })}<span class="su-s">27.7 s from power on to the sign-in screen, then 6.6 s for your session.</span>`, { ic: "timer" });
  const item = ([n, c, k, t, on, slow]) => `<div class="su-i">${uic(n, c)}<div class="tx"><b>${n}</b><span>${k}</span></div><span class="t ${slow ? "bad" : ""}">${t}</span>${sw(on)}</div>`;

  /* A: everything that starts, slowest first, one switch each, kinds as chips. */
  const pageA = () => `<div class="ap-body scroll">${boot()}
    <div class="su-tool">${["All 51", "Apps 7", "Hyprland 8", "Services 36"].map((c, i) => chip(c, i === 0 ? "on" : "")).join("")}<span class="sp"></span>${btn("Add…", "", "plus")}</div>
    ${note("timer", "omarchy-backup held up your last start by 5 min 41 s", "It waits for the network before it starts.", "warn", btn("See log", "sm"))}
    ${acard("", ITEMS.map(item).join(""), { cls: "su-list" })}</div>`;

  /* B: a timeline of your last start: what ran when, and for how long. */
  const TL = [["Firmware", 0, 24, "graphite"], ["Boot loader", 24, 15, "blue"], ["Kernel", 39, 38, "violet"], ["System services", 77, 23, "teal"]];
  const SESS = [["Hyprland", 0, 8, "teal"], ["wayland-session-waitenv", 4, 26, "graphite"], ["hyprpolkitagent", 30, 12, "violet"], ["Syncthing", 32, 13, "graphite"], ["nyx-icons", 36, 8, "blue"], ["Events and Tasks Reminders", 44, 6, "amber"], ["omarchy-backup", 30, 70, "red"]];
  const bars = (rows) => rows.map(([n, x, w, c]) => `<div class="su-bar"><span class="n">${n}</span><div class="tr"><b style="left:${x}%;width:${w}%;background:var(--sw-${c})"></b></div></div>`).join("");
  const pageB = () => `<div class="ap-body scroll">
    ${phead("Your last start", "Today 08:41 · 27.7 s to sign-in, 6.6 s for your session", seg(["Today", "Yesterday", "Average"], "Today"))}
    ${acard("Until you sign in", bars(TL), { ic: "timer", meta: "27.7 s" })}
    ${acard("After you sign in", bars(SESS) + `<div class="su-ax"><span></span><span>Sign-in</span><span>+6.6 s</span><span>still running</span></div>`, { ic: "rocket", meta: "6.6 s · omarchy-backup kept going", end: btn("Manage what starts", "sm") })}
  </div>`;

  REG("startup", {
    name: "Startup",
    summary: "Startup tells you a lot (how long the last start took, the slowest things, how many apps and services start) but splits it into five pieces, and the list you'd change is at the bottom, past an “Add a startup item” row.",
    problems: [
      "<b>The slowest item is a red bar with “5m 41s”</b> beside four short ones, with nothing saying what it held up.",
      "<b>Four counts in capitals</b> (with Hyprland 8, apps 7, background services 36, turned off 26) before you get to anything you can change.",
      "<b>The things you turn on and off are at the bottom</b>, below “Added here” and an Add row, and only apps are listed; Hyprland's and the services' items are elsewhere.",
      "<b>The boot bar's parts are labelled in a line of small text</b> under it, so you read it twice to see which part is the kernel.",
    ],
    today: [["startup-1280", "Today at 1280 px", "Five pieces; the list at the bottom"], ["startup-800", "Today at 800 px", ""]],
    options: [
      { id: "a", name: "One list, slowest first", idea: "Your last start as one labelled bar, then everything that starts at sign-in in one list (apps, Hyprland's items and services, filtered by chips), slowest first, each with how long it took and a switch. Something that held up the start gets a plain note.",
        shots: [["a-start", "Startup", "The boot bar, a note, one list with switches"], ["a-start-800", "At 800 px", ""]] },
      { id: "b", name: "A timeline of your last start", idea: "Your last start drawn as a timeline: until you sign in (firmware, boot loader, kernel, services), then everything that started after, as bars, so a slow one is obvious. Compare today with yesterday or the average.",
        shots: [["b-start", "Startup", "Two timelines, omarchy-backup running long"]] },
    ],
    pages: { "a-start": () => apage("startup", pageA()), "b-start": () => apage("startup", pageB()) },
  });
})();
