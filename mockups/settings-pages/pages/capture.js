// Desktop › Capture & Tools, in style B: a capture studio on a mini screen, or every tool in a list.
(() => {
  const P = { sec: "desktop", page: "Capture & Tools", desc: "Screenshots, screen recording, reminders, dictation and small tools." };

  const MODES = [["spark", "Smart"], ["crop", "Region"], ["window", "Window"], ["monitor", "Screen"], ["scroll", "Scrolling"]];
  const tiles = (on) => `<div class="cp-modes">${MODES.map(([ic, n]) => `<div class="cp-mode ${n === on ? "on" : ""}">${icon(ic)}<span>${n}</span></div>`).join("")}</div>`;
  const tabs = (on) => `<div class="cp-tabs">${seg(["Screenshot", "Recording"], on)}</div>`;

  /* A mini screen with windows; o = { region, rec, cam } */
  const screen = (o = {}) => `<div class="cp-scr ${o.rec ? "rec" : ""}" style="--wl:${wall("capture-desk")}">
      <div class="cp-bar"><span>${[1, 2, 3].map((n) => `<b class="${n === 1 ? "on" : ""}">${n}</b>`).join("")}</span>${o.rec ? `<span class="cp-recp"><i></i>00:42</span>` : ""}<span class="cp-clk">14:20</span></div>
      <div class="cp-w w1"><div class="cp-wh"><i></i><i></i><i></i><b>Photos</b></div><div class="cp-gal">${[0, 1, 2, 3, 4, 5].map((i) => `<span style="background:${wall("ph" + i)}"></span>`).join("")}</div></div>
      <div class="cp-w w2"><div class="cp-wh"><i></i><i></i><i></i><b>Notes</b></div><div class="cp-lines"><span></span><span class="s"></span><span></span><span class="m"></span><span></span></div></div>
      ${o.region ? `<div class="cp-reg"><span class="h tl"></span><span class="h tr"></span><span class="h bl"></span><span class="h br"></span><span class="cp-size">1040 × 620</span></div>
        <div class="cp-tip">${icon("window")}Click a window, or drag a region</div>` : ""}
      ${o.cam ? `<div class="cp-cam">${av("Sam Rivera", 64)}</div>` : ""}
    </div>`;
  const hud = (items) => `<div class="cp-hud">${items}</div>`;

  /* ═══ A: a capture studio ═══════════════════════════════════════════ */
  const more = () => ocard("More tools", [
    nrow("Reminders", "A notification after a while", "1 waiting", { ic: "bell", sec: "desktop" }),
    nrow("Dictation", "Type by talking, in any app", "On", { ic: "mic", sec: "desktop" }),
    nrow("Weather and status", "Location, and time or battery pop-ups", "", { ic: "sun", sec: "desktop" }),
    nrow("Helpers and fixes", "Coding agent, crash alerts, restarts", "", { ic: "wrench", sec: "desktop" }),
  ], { cls: "icons cp-more" });
  const shot = () => split(`
    ${tabs("Screenshot")}
    <div class="gtitle first">What to capture</div>
    ${tiles("Smart")}
    ${ocard("Where it goes", [
      `<div class="opt picked">${radio(true)}<div class="opt-text"><div>Copy to the clipboard</div></div><span class="rv">Paste it anywhere</span></div>`,
      `<div class="opt">${radio(false)}<div class="opt-text"><div>Save to a file</div></div><span class="rv">In Pictures</span></div>`,
    ])}
    ${more()}`,
    `${pvhead("Smart screenshot", "Settings steps aside, then you click a window or drag a region.", `<span class="dim cp-or">or press</span>${keys("Print")}`)}
     ${screen({ region: true })}
     ${hud(`${MODES.map(([ic, n]) => `<span class="${n === "Smart" ? "on" : ""}" title="${n}">${icon(ic)}</span>`).join("")}<i class="sep"></i>${dd("Copy", "copy")}${btn("Capture", "primary", "screenshot")}`)}
     <div class="cp-tools">${[["text", "Copy text", "Drag over words in a picture or video"], ["qr", "Read a QR code", "Drag over the code"], ["drop", "Pick a colour", "Copies it as #3D8AE8"]].map(([ic, n, d]) => `<div class="card">${T(ic, "desktop")}<div><b>${n}</b><span>${d}</span></div></div>`).join("")}</div>`, { sec: "desktop", cls: "cp-a" });

  const record = () => split(`
    ${tabs("Recording")}
    ${ocard("What to record", [
      `<div class="opt">${radio(false)}<div class="opt-text"><div>A region or a window</div><div class="d">You choose when you press Start.</div></div></div>`,
      `<div class="opt picked">${radio(true)}<div class="opt-text"><div>The whole screen</div></div></div>`,
    ], { first: true })}
    ${ocard("Include", [
      orow("Sound from the computer", "Music, calls and videos", sw(true), { ic: "volume", sec: "desktop" }),
      orow("Your microphone", "Your voice", sw(true), { ic: "mic", sec: "desktop" }),
      orow("The webcam", "A small picture of you in a corner", sw(true), { ic: "cam", sec: "desktop" }),
    ], { cls: "icons" })}
    ${ocard("", [orow("Start or stop", "From anywhere", keys("Super", "Ctrl", "Print"), { ic: "keyboard", sec: "desktop" }), orow("Recordings go to Videos", "", btn("Open folder", "sm", "folder"), { ic: "film", sec: "desktop" })], { cls: "icons cp-more" })}`,
    `${pvhead("Recording", "The whole screen, with sound, your voice and the webcam.", `${btn("Stop", "danger", "stop")}`)}
     ${screen({ rec: true, cam: true })}
     <div class="cp-lv card">${[["volume", "Computer", 62], ["mic", "Microphone", 38]].map(([ic, n, v]) => `<div class="cp-lr">${icon(ic)}<span>${n}</span>${meter(v, 28)}</div>`).join("")}</div>
     ${pvfoot("Stop from the red dot in the bar, or with Super + Ctrl + Print.", "info")}`, { sec: "desktop", cls: "cp-a" });

  /* ═══ B: every tool in one list, the picked one beside it ══════════ */
  const TOOLS = [["Capture", [["screenshot", "Screenshot", "Smart · copy"], ["rec", "Screen recording", "Region · with sound"], ["text", "Copy text from the screen"], ["qr", "Read a QR code"], ["drop", "Pick a colour"]]],
    ["Helpers", [["bell", "Reminders", "1 waiting"], ["mic", "Dictation", "Typed into the window"], ["sun", "Weather and status", "Riverside"], ["wrench", "Fixes and tests", ""]]]];
  const list = (on) => TOOLS.map(([g, rows], gi) => ocard(g, rows.map(([ic, n, d]) => `<div class="opt onav ${n === on ? "picked" : ""}"><span class="lic" style="--tc:var(--sec-desktop)">${icon(ic)}</span><div class="opt-text"><div>${n}</div>${d ? `<div class="d">${d}</div>` : ""}</div>${icon("chev-r", "cv")}</div>`), { first: gi === 0, cls: "icons cp-list" })).join("");

  const reminders = () => split(list("Reminders"), `
    ${pvhead("Reminders", "A notification after the time you choose, even with Settings closed.")}
    <div class="card cp-rform">
      <div class="cp-rr"><span>Remind me in</span><span class="field cp-min">25</span><span>minutes</span></div>
      <div class="cp-quick">${["5 min", "15 min", "25 min", "1 hour", "Tomorrow 9:00"].map((q) => chip(q, q === "25 min" ? "on" : "")).join("")}</div>
      <div class="field cp-msg">Take the bread out of the oven</div>
      <div class="cp-rb"><span class="dim">At 14:45</span><span class="sp"></span>${btn("Remind me", "primary", "bell")}</div>
    </div>
    <div class="cp-np"><small>It will look like this</small><div class="cp-note">${T("bell", "desktop")}<div><b>Take the bread out of the oven</b><span>Reminder · now</span></div>${ib("x")}</div></div>
    ${ocard("Waiting", [orow("Call Sam back", "In 12 minutes, at 14:32", btn("Cancel", "sm ghost"), { ic: "clock", sec: "desktop" }), orow("Stretch your legs", "In 48 minutes, at 15:08", btn("Cancel", "sm ghost"), { ic: "clock", sec: "desktop" })], { act: btn("Clear all", "sm ghost"), cls: "icons" })}
    ${pvfoot("Reminders wait even with Settings closed, but not through a restart.", "info")}`, { sec: "desktop", cls: "cp-b" });

  const fixes = () => split(list("Fixes and tests"), `
    ${pvhead("Fixes and tests", "For when something on the computer misbehaves.")}
    <div class="cp-fix">${[["volume", "Restart sound", "When a device goes quiet or goes missing."], ["bar", "Restart the bar and menus", "When the bar freezes or looks wrong."]].map(([ic, n, d]) => `<div class="card">${T(ic, "desktop")}<b>${n}</b><span>${d}</span>${btn("Restart", "sm", "refresh")}</div>`).join("")}</div>
    ${ocard("", [
      orow("Tell me when a program crashes", "A notification with a way to look into it.", sw(true), { ic: "warn", sec: "desktop" }),
      orow("Coding agent", "What the agent shortcut opens. Choosing one installs it.", dd("Claude Code"), { ic: "code", sec: "desktop" }),
    ], { cls: "icons", first: true })}
    <div class="card cp-disk">
      <div class="cp-dh">${T("drive", "desktop")}<div><b>Disk speed test</b><span>Last run on Tuesday · Lumen SSD, 1 TB</span></div><span class="sp"></span>${btn("Run again", "sm")}</div>
      ${[["Reading", 82, "3.1 GB/s"], ["Writing", 64, "2.4 GB/s"]].map(([n, p, v]) => `<div class="cp-dr"><span>${n}</span>${prog(p)}<b>${v}</b></div>`).join("")}
    </div>
    ${pvfoot("A restart takes a few seconds; your open apps keep running.", "info")}`, { sec: "desktop", cls: "cp-b" });

  REG("capture", {
    name: "Capture & Tools",
    summary: "A long column of rows for Omarchy's own commands: Screenshots (two dropdowns and a Capture button, then Copy text, QR and colour), Screen recording (four switches and Start/Stop), then folds for Reminders, Weather, Dictation and Tools. Every action is a button at the end of a row, with no picture of what it will capture.",
    problems: [
      "<b>No picture of what gets captured:</b> “What to capture: Smart” is a dropdown; you only see Smart, Region or Scrolling in action after Settings hides itself.",
      "<b>Buttons at the ends of rows:</b> Capture, Select…, Scan…, Pick… and Start each sit at the right of a row that reads like a setting.",
      "<b>Recording's options are switches with no state:</b> nothing shows you're recording, what's being recorded, or whether the microphone is picking you up.",
      "<b>Unrelated things share the page:</b> reminders, the weather location, dictation, the coding agent, a disk test and Restart buttons all come after capture, in folds.",
      "<b>Reminders are a minutes box:</b> “Minutes”, “Message (optional)”, and the waiting ones are one text block.",
      "<b>At 800 px</b> the descriptions wrap to two lines under every row.",
    ],
    today: [["capture-1280", "Today", ""], ["capture-800", "Today at 800 px", ""]],
    options: [
      { id: "a", name: "Capture studio", idea: "Screenshot and Recording are the two halves of the page. The left picks the mode as five tiles and where the picture goes; the right is a small screen showing that mode in action, with the bar Settings will show (modes, Copy or Save, Capture). Copy text, QR codes and the colour picker are three tiles under it. Recording shows the red outline, the timer, the webcam corner and live sound levels. The helpers move to a More tools card, each opening its own page.",
        shots: [["a-shot", "Smart screenshot", ""], ["a-record", "Recording with the webcam", ""], ["a-record-800", "Recording at 800 px", ""]] },
      { id: "b", name: "Every tool in a list", idea: "The left is a list of every tool, in Capture and Helpers, each with what it's set to. The right shows the one you picked with its own controls: Reminders gets quick times, a preview of the notification and the waiting ones with Cancel; Fixes gets two plain Restart cards, crash alerts, the coding agent, and the disk test's last result as bars.",
        shots: [["b-reminders", "Reminders", ""], ["b-fixes", "Fixes and tests", ""]] },
    ],
    icons: {
      crop: '<path d="M6 3v13.5a1.5 1.5 0 0 0 1.5 1.5H21M3 6h13.5A1.5 1.5 0 0 1 18 7.5V21"/>',
      scroll: '<rect x="6" y="3" width="12" height="18" rx="2"/><path d="M12 7v10M9.5 9.5 12 7l2.5 2.5M9.5 14.5 12 17l2.5-2.5"/>',
      text: '<path d="M4 7V5h16v2M12 5v14M9 19h6"/>',
      drop: '<path d="M12 3.5s6 6.2 6 10.5a6 6 0 0 1-12 0c0-4.3 6-10.5 6-10.5z"/>',
      cam: '<rect x="3" y="6.5" width="13" height="11" rx="2"/><path d="m16 10.5 5-3v9l-5-3"/>',
      rec: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="3.5" fill="currentColor"/>',
      stop: '<rect x="7" y="7" width="10" height="10" rx="1.5" fill="currentColor"/>',
    },
    pages: {
      "a-shot": () => swin({ ...P, body: shot() }),
      "a-record": () => swin({ ...P, body: record() }),
      "b-reminders": () => swin({ ...P, body: reminders() }),
      "b-fixes": () => swin({ ...P, body: fixes() }),
    },
  });
})();
