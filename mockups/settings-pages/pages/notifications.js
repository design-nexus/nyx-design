// Desktop › Notifications: who shows pop-ups, Do not disturb on a schedule, how long history
// is kept, and each app's pop-ups and history.
(() => {
  /* ── Sample data ─────────────────────────────────────────────────── */
  // [icon, swatch, app, count, pop-ups, history]
  const APPS = [["calendar", "red", "Calendar", 23, true, true], ["chat", "green", "Messages", 58, true, true], ["mail", "teal", "Mail", 41, true, true], ["download", "violet", "Updates", 6, true, true], ["music", "pink", "Music", 12, false, true], ["globe", "coral", "Browser", 9, true, false], ["sun", "amber", "Weather", 15, false, true], ["folder", "blue", "Files", 4, true, true]];

  /* ── Small drawings ──────────────────────────────────────────────── */
  const ai = (ic, c, is) => `<span class="ai" style="--a:var(--sw-${c})${is ? `;--is:${is}px` : ""}">${icon(ic)}</span>`;
  const pop = (o) => `<div class="np ${o.cls || ""}"><div class="nh">${ai(o.ic, o.c)}<b>${o.app}</b><span class="sp"></span><span>${o.when}</span></div>${o.av ? `<span class="avt">${av(o.av, 30)}</span>` : ""}<div class="nt">${o.title}</div><div class="nb" ${o.av ? 'style="padding-right:38px"' : ""}>${o.body}</div>${o.acts ? `<div class="na">${o.acts.map((a) => btn(a, "sm")).join("")}</div>` : ""}</div>`;
  const POPS = [
    { ic: "chat", c: "green", app: "Messages", when: "now", av: "Sam Rivera", title: "Sam Rivera", body: "Are we still on for Saturday? I can bring the tent.", acts: ["Reply", "Mark as read"] },
    { ic: "calendar", c: "red", app: "Calendar", when: "2 min ago", title: "Dentist in 30 minutes", body: "Today at 15:30 · Harbour Street Clinic" },
  ];
  const corner = (o = {}) => `<div class="corner" style="background:${wall("atlas-desk")}">
      <div class="cbar"><span>Fri 14:20</span><span class="sp"></span>${icon("wifi")}${icon("volume")}${icon("battery")}<span class="bell">${icon("bell")}<b>3</b></span></div>
      <div class="cwin"><span class="l w40"></span><span class="l dim w90"></span><span class="l dim w80"></span><span class="l dim w90"></span><span class="l dim w60"></span><span class="l dim w80"></span></div>
      <div class="stack">${POPS.slice(0, o.n || 2).map((p) => pop({ ...p, cls: o.short ? "short" : "", acts: o.short ? null : p.acts })).join("")}<span class="more">1 more in the Notification Center</span></div></div>`;
  const day = (o = {}) => `<div class="card d24">
      <div class="dh"><b>Tonight</b><span>Quiet from 22:00 to 07:00</span><span class="sp"></span>${o.end || ""}</div>
      <div class="trk"><span class="q a">${icon("moon")}until 07:00</span><span class="q b">${icon("moon")}</span><span class="hd" style="left:29.17%"></span><span class="hd" style="left:91.67%"></span><span class="now" style="left:59.7%"><span>Now</span></span></div>
      <div class="tk"><span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span><span>24:00</span></div>
      <div class="keep">${icon("check-c", "inl")}<span>Critical alerts and sign-in codes still show. Turning it on or off by hand sticks until the next start or end.</span></div></div>`;
  const timeRow = () => `<span class="tpair">From <span class="tfield">22:00</span> to <span class="tfield">07:00</span></span>`;

  /* ── A: pop-ups on a corner of the desktop ───────────────────────── */
  const ctlA = () => `
    ${ocard("Pop-ups shown by", [
      `<div class="opt picked">${radio(true)}<div class="opt-text"><div>Nyx Notification Center</div><div class="d">With an Inbox, pinned notifications and the history</div></div></div>`,
      `<div class="opt">${radio(false)}<div class="opt-text"><div>Omarchy</div><div class="d">History is still kept</div></div></div>`,
      orow("Show text in pop-ups", "Off: only the app and the title.", sw(true)),
      orow("Bell in the bar", "Unread count; right-click for Do not disturb.", sw(true)),
    ], { first: true })}
    ${ocard("Do not disturb", [orow("Every night", "", sw(true)), orow("Quiet hours", "", timeRow())])}
    ${ocard("History", [orow("Keep for", "", seg(["7 days", "30 days", "90 days"], "30 days")), orow("Delete history", "Pinned ones are always kept.", btn("Delete", "sm dtext"))])}
    ${ocard("", [nrow("Apps", "Quiet an app, or keep no history", "3 changed", { ic: "apps", sec: "desktop" })], { cls: "icons" })}`;
  const pvA = () => `
    ${pvhead("As they arrive", "At the top right of the screen, under the bell.", seg(["With text", "Title only"], "With text"))}
    ${corner({ n: NARROW ? 1 : 2 })}
    ${NARROW ? "" : `${day({ end: chip("On", "acc", "moon") })}${pvfoot(`${kbd("Super N")} or the bell opens the Notification Center.`, "info")}`}`;

  /* ── B: apps one by one ──────────────────────────────────────────── */
  const ctlB = () => `
    ${ocard("", [
      nrow("Do not disturb", "Every night, 22:00 to 07:00", "On", { ic: "moon", sec: "desktop" }),
      nrow("Pop-ups and history", "Nyx Notification Center · kept 30 days", "", { ic: "bell", sec: "desktop" }),
    ], { cls: "icons" })}
    <div class="gtitle gflex">Apps<span class="sp"></span><span class="note">8</span></div>
    <div class="field" style="margin-bottom:8px">${icon("search")}<span class="ph">Search apps</span></div>
    <div class="card alist">${APPS.slice(0, 7).map(([ic, c, n, k, p, h], i) => `<div class="opt ${i === 0 ? "picked" : ""}">${ai(ic, c)}<div class="opt-text"><div>${n}</div><div class="d">${k} notifications</div></div><span class="st2">${icon(p ? "bell" : "belloff", p ? "" : "off")}${icon("hist", h ? "" : "off")}</span></div>`).join("")}</div>`;
  const pvB = () => `
    <div class="apph">${ai("calendar", "red")}<div><b>Calendar</b><span>23 notifications this month · the last at 13:50</span></div>${btn("Back to normal", "sm ghost")}</div>
    <div class="tcards">
      <div class="tcd"><div class="r">${icon("bell")}<b>Pop-ups</b>${sw(true)}</div><span>Show them as they arrive. Off: they arrive quietly in the Inbox.</span></div>
      <div class="tcd"><div class="r">${icon("hist")}<b>Keep in history</b>${sw(true)}</div><span>Off: none of Calendar's notifications are kept.</span></div>
    </div>
    <div class="card" style="display:flex;justify-content:center;padding:18px;background:${wall("atlas-desk")}">${pop({ ic: "calendar", c: "red", app: "Calendar", when: "now", title: "Dentist in 30 minutes", body: "Today at 15:30 · Harbour Street Clinic", acts: ["Snooze", "Open"] })}</div>
    ${ocard("Recent", [
      orow("Dentist in 30 minutes", "Today at 15:30 · Harbour Street Clinic", `<span class="tm2">13:50</span>`),
      orow("Book club moved to Thursday", "Changed by Alex Chen", `${icon("pin", "pin")}<span class="tm2">Yesterday</span>`),
      orow("Bin day tomorrow", "Recycling and garden waste", `<span class="tm2">Wed</span>`),
    ], { cls: "recent" })}`;

  /* ── C: the quiet hours on a dial ────────────────────────────────── */
  const dial = () => {
    const R = 90, c = 110, pt = (h, r = R) => { const a = (h / 24) * 2 * Math.PI - Math.PI / 2; return [c + r * Math.cos(a), c + r * Math.sin(a)]; };
    const [x1, y1] = pt(22), [x2, y2] = pt(7), [nx, ny] = pt(14 + 20 / 60), [tx, ty] = pt(14 + 20 / 60, R + 24);
    const ticks = Array.from({ length: 24 }, (_, h) => { const [a, b] = pt(h, R - 16), [d, e] = pt(h, R - (h % 6 ? 19 : 23)); return `<line class="tk" x1="${a}" y1="${b}" x2="${d}" y2="${e}"/>`; }).join("");
    const labels = [0, 6, 12, 18].map((h) => { const [a, b] = pt(h, R + 22); return `<text x="${a}" y="${b}">${String(h).padStart(2, "0")}</text>`; }).join("");
    return `<svg class="dial" width="220" height="220" viewBox="0 0 220 220"><circle class="rg" cx="${c}" cy="${c}" r="${R}"/>
      <path class="qa" d="M${x1},${y1} A${R},${R} 0 0 1 ${x2},${y2}"/>${ticks}${labels}
      <circle class="nowr" cx="${nx}" cy="${ny}" r="6"/><text class="nowt" x="${tx}" y="${ty}">now</text>
      <circle class="hn" cx="${x1}" cy="${y1}" r="9"/><circle class="hn" cx="${x2}" cy="${y2}" r="9"/>
      <text class="c1" x="${c}" y="${c - 6}">7 h 40 min</text><text class="c2" x="${c}" y="${c + 16}">until it goes quiet</text></svg>`;
  };
  const ctlC = () => `
    ${ocard("Do not disturb", [orow("<b>Every night</b>", "On a schedule; you can still switch it by hand.", sw(true), { ic: "moon", sec: "desktop" }), orow("Starts", "", `<span class="tfield">22:00</span>`, { ic: "clock", sec: "desktop" }), orow("Ends", "", `<span class="tfield">07:00</span>`, { ic: "sun", sec: "desktop" })], { first: true, cls: "icons" })}
    ${ocard("Pop-ups", [orow("Shown by", "", dd("Nyx Notification Center")), orow("Show text in pop-ups", "", sw(true)), orow("Bell in the bar", "", sw(true))])}
    ${ocard("History", [orow("Keep for", "", seg(["7 days", "30 days", "90 days"], "30 days")), orow("Delete history", "Pinned ones stay.", btn("Delete", "sm dtext"))])}
    ${ocard("", [nrow("Apps", "", "8 apps · 3 changed", { ic: "apps", sec: "desktop" })], { cls: "icons" })}`;
  const pvC = () => `
    ${pvhead("Quiet hours", "Drag the ends of the purple arc to change them.", chip("Off now", "", "sun"))}
    <div class="dialrow"><div class="card dialc">${dial()}</div>
      <div class="through"><div class="tth">Still gets through</div>
        ${ocard("", [orow("Critical alerts", "Like a battery about to run out.", icon("check", "okc"), { ic: "battery", sec: "desktop" }), orow("Sign-in codes", "So you can still log in somewhere.", icon("check", "okc"), { ic: "lock", sec: "desktop" })], { cls: "icons" })}
        <div class="tth">Everything else</div>
        ${ocard("", [orow("Waits in the Inbox", "No sound and no pop-up; the bell shows a moon.", "", { ic: "inbox", sec: "desktop" })], { cls: "icons" })}
      </div></div>
    ${day({ end: btn("Turn on now", "sm", "moon") })}`;

  /* ── The window ──────────────────────────────────────────────────── */
  const page = (body) => () => swin({ sec: "desktop", page: "Notifications", desc: "Pop-ups, quiet hours, history, and each app's notifications.", body: body() });

  REG("notifications", {
    name: "Notifications",
    summary: "Four groups in a column: a row saying how to open the Notification Center, who shows pop-ups and the bell, Do not disturb on a schedule with two typed times, and history. Each app's pop-ups and history are in a folded list at the very bottom. Nothing shows a pop-up or the quiet hours.",
    problems: [
      "<b>No picture of a pop-up:</b> “Show text in pop-ups” and who shows them are a switch and a dropdown; you don't see the difference until a notification arrives.",
      "<b>Quiet hours are two text fields:</b> “Starts at · 24-hour time, like 22:30” and “Ends at”, greyed out when the schedule is off; nothing shows the night they cover or how long until they start.",
      "<b>Apps are hidden at the bottom:</b> the setting people reach for (silence one noisy app) is a folded group under History, with two unlabelled-looking switches per row.",
      "<b>An instruction as a row:</b> “Open it · Super N, or the bell in the bar” looks like a setting with nothing to set.",
      "<b>Long descriptions that wrap at 800 px:</b> “Quiet every night; critical notifications and sign-in codes still show. Switching it by hand in between sticks.”",
    ],
    today: [["notifications-1280", "Today", ""], ["notifications-800", "Today at 800 px", ""]],
    options: [
      { id: "a", name: "Pop-ups on a corner", idea: "The preview is the top-right corner of the desktop with two pop-ups as they'd arrive, under the bell, switching between with text and title only. Under it, tonight's quiet hours as a strip across the day with a marker for now. The controls are short cards: who shows pop-ups as two choices, Do not disturb with its two times in one row, history, and Apps a level down.",
        shots: [["a-corner", "Pop-ups on a corner", "The pop-ups, and tonight's quiet hours"], ["a-corner-800", "At 800 px", "The corner above the controls"]] },
      { id: "b", name: "App by app", idea: "Apps come first: the controls are a searchable list of every app that has sent notifications, with a mark for any that are quiet or not kept. Picking one shows its pop-up as it looks, two large switches for pop-ups and history, and its recent notifications. Do not disturb and the pop-up settings are two rows at the top that open their own pages.",
        shots: [["b-apps", "App by app", "Calendar picked: its pop-up, switches and recent notifications"]] },
      { id: "c", name: "Quiet hours first", idea: "The preview is about Do not disturb: a 24-hour dial with the quiet hours as an arc you drag by its ends, the time until it starts, what still gets through, and where everything else goes. The settings are the same short cards as the first option, with the schedule at the top.",
        shots: [["c-quiet", "Quiet hours first", "A dial for the night, and what gets through"]] },
    ],
    pages: {
      "a-corner": page(() => split(ctlA(), pvA(), { sec: "desktop" })),
      "b-apps": page(() => split(ctlB(), pvB(), { sec: "desktop", ctlw: 380 })),
      "c-quiet": page(() => split(ctlC(), pvC(), { sec: "desktop", ctlw: 410 })),
    },
    icons: {
      belloff: '<path d="M6.5 8.5a5.5 5.5 0 0 1 9.3-3.9M17.5 11v3l2 3H7M10 20a2 2 0 0 0 4 0M3.5 3.5l17 17"/>',
      pin: '<path d="M9 3.5h6l-1 5 3.5 3.5h-11L10 8.5zM12 12v8.5"/>',
    },
  });
})();
