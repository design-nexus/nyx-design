// Desktop › Switcher: Nyx Switcher (Alt+Tab, Super+Tab, the overview): what it lists, how it
// looks, how soon it shows, its keys and the touchpad gesture.
(() => {
  /* ── Sample data ─────────────────────────────────────────────────── */
  // [app icon, swatch, window title, workspace, kind of drawing]
  const WINS = [["terminal", "graphite", "Terminal · ~/garden", 1, "term"], ["globe", "coral", "Trip ideas · Lisbon", 2, "web"], ["note", "amber", "Notes", 1, "doc", 3], ["folder", "blue", "Files · Pictures", 3, "files"], ["mail", "teal", "Mail · Inbox", 2, "files"]];
  const APPS = [["globe", "coral", "Browser", 2], ["terminal", "graphite", "Terminal", 1], ["note", "amber", "Notes", 3], ["folder", "blue", "Files", 1], ["mail", "teal", "Mail", 1], ["music", "pink", "Music", 1]];
  // [title, keys, back keys, description]
  const MODES = [
    ["Switch windows", ["Alt", "Tab"], ["Alt", "Shift", "Tab"], "Every window, newest first"],
    ["Switch apps", ["Super", "Tab"], ["Super", "Shift", "Tab"], "One entry per app"],
    ["Windows of this app", ["Alt", "`"], ["Alt", "Shift", "`"], "Only the app you're in"],
    ["Show all windows", ["Super", "Alt", "W"], null, "Every window at once, to pick with the mouse"],
  ];

  /* ── Small drawings ──────────────────────────────────────────────── */
  const ai = (ic, c, is) => `<span class="ai" style="--a:var(--sw-${c})${is ? `;--is:${is}px` : ""}">${icon(ic)}</span>`;
  const body = (kind) => ({
    files: `<div class="dsd"><b class="on"></b><b></b><b></b><b></b></div><div class="dmn"><span class="l w60"></span><span class="rw on"></span><span class="rw"></span><span class="rw"></span><span class="rw"></span></div>`,
    term: `<div class="tm"><span><b class="c1 w20"></b><b class="w40"></b></span><span><b class="c2 w30"></b><b class="w50"></b></span><span><b class="c3 w20"></b><b class="w30"></b></span><span><b class="c1 w20"></b><b class="w60"></b></span></div>`,
    web: `<div class="dmn"><span class="pic" style="background:${wall("trip")}"></span><span class="l w70"></span><span class="l w90 dim"></span><span class="l w80 dim"></span></div>`,
    doc: `<div class="dmn"><span class="l w50"></span><span class="l w90 dim"></span><span class="l w80 dim"></span><span class="l w90 dim"></span><span class="l w40 dim"></span></div>`,
  })[kind];
  const dwin = (style, kind = "files", cls = "") => `<div class="dw ${cls}" style="${style}"><div class="dwh"><i></i><i></i><i></i><b></b></div><div class="dwb">${body(kind)}</div></div>`;
  const dbar = () => `<div class="dbar"><span class="ws"><b class="on"></b><b></b><b></b><b></b></span><span class="clk">Fri 14:20</span><span class="tray">${icon("wifi")}${icon("volume")}${icon("battery")}</span></div>`;
  const desk = (inner, o = {}) => `<div class="dsk ${o.cls || ""}" style="background:${wall("atlas-desk")};${o.style || ""}">${dbar()}
    ${dwin("left:3%;top:9%;width:52%;height:84%", "files")}${dwin("left:57.5%;top:9%;width:39.5%;height:40%", "term", "f")}${dwin("left:57.5%;top:52%;width:39.5%;height:41%", "doc")}
    ${o.veil === false ? "" : `<div class="veil2 ${o.deep ? "deep" : ""}"></div>`}${inner}</div>`;
  const thumb = ([ic, c, t, ws, kind, tabs], o = {}) => `<div class="sth ${o.on ? "on" : ""} ${tabs ? "tgrp" : ""}" style="${o.tw ? `--tw:${o.tw}px` : ""}">${o.ws !== false ? `<span class="wsn">${ws}</span>` : ""}<div class="tb">${dwin("", kind)}</div>${tabs ? `<span class="tabn">${tabs} tabs ${icon("chev-d")}</span>` : ""}<div class="cap">${ai(ic, c)}<span>${t}</span></div></div>`;
  const switcher = (o = {}) => o.icons
    ? `<div class="swo icons">${APPS.map(([ic, c, n, k], i) => `<div class="sth ${i === 1 ? "on" : ""}" style="position:relative">${ai(ic, c)}${k > 1 ? `<span class="cnt">${k}</span>` : ""}<div class="cap"><span>${n}</span></div></div>`).join("")}</div>`
    : `<div class="swo">${WINS.map((w, i) => thumb(w, { on: i === 1, tw: o.tw })).join("")}</div>`;
  const timeline = (short) => `<div class="card tl">
      <div class="th"><b>Show after</b><span>How long you hold the keys before it appears.</span><span class="sp"></span><em>80 ms</em></div>
      <div class="tr"><span class="a">Tap</span><span class="b">Hold: the switcher shows, and Tab moves along</span><span class="mk"></span></div>
      <div class="ticks"><span>0</span><span>100</span><span>200</span><span>300</span><span>400 ms</span></div>
      ${short ? "" : '<div class="th"><span>A quick tap switches straight to the last window without showing anything.</span></div>'}</div>`;

  /* ── A: the switcher over a desk ─────────────────────────────────── */
  const ctlA = () => `
    ${ocard("What it lists", [
      orow("Windows from", "", dd("Every workspace"), { ic: "layers", sec: "desktop" }),
      orow("Tabbed windows once", "↓ shows a group's tabs.", sw(true), { ic: "columns", sec: "desktop" }),
      orow("Assistant workspaces", "Windows assistants work in.", sw(false), { ic: "sparkle", sec: "desktop" }),
    ], { first: true, cls: "icons" })}
    ${ocard("How it looks", [
      orow("Window thumbnails", "Off: app icons only.", sw(true), { ic: "image", sec: "desktop" }),
      orow("Thumbnail size", "", seg(["Small", "Medium", "Large"], "Medium"), { ic: "expand", sec: "desktop" }),
      orow("Animation", "Fade in, slide the selection.", sw(true), { ic: "spark", sec: "desktop" }),
    ], { cls: "icons" })}
    ${NARROW ? ocard("Timing", [orow("Show after", "A quicker tap switches without showing it.", sl(20, "80 ms", 120), { ic: "clock", sec: "desktop" })], { cls: "icons" }) : ""}
    ${ocard("Keys and gestures", [
      nrow("Keys", "Alt + Tab, Super + Tab and 5 more", "", { ic: "keyboard", sec: "desktop" }),
      nrow("Touchpad gesture", "Opens Show all windows", "Spread four fingers", { ic: "touchpad", sec: "desktop" }),
    ], { cls: "icons" })}`;

  const pvA = () => `
    ${pvhead("Alt + Tab", "Windows from every workspace, newest first.", seg(["Windows", "Apps", "All windows"], "Windows"))}
    <div class="dskw">${desk(`${switcher({ tw: NARROW ? 66 : 84 })}<span class="keyhint">${keys("Alt", "Tab")} next · ${keys("Shift")} back · ${keys("↓")} tabs</span>`)}</div>
    ${NARROW ? "" : `${timeline()}${pvfoot("Alt + Tab lists windows; Super + Tab lists apps, one entry each.", "info")}`}`;

  /* ── B: the keys and what each opens ─────────────────────────────── */
  const kart = (i) => [
    `${WINS.slice(0, 4).map((_, j) => `<span class="mw ${j === 1 ? "on" : ""}"></span>`).join("")}`,
    `${APPS.slice(0, 5).map(([ic, c], j) => `<span class="ai ${j === 1 ? "on" : ""}" style="--a:var(--sw-${c})">${icon(ic)}</span>`).join("")}`,
    `${ai("globe", "coral", 26)}<span class="mw on"></span><span class="mw"></span>`,
    `<div class="ogrid">${"<span class='mw'></span>".repeat(8)}</div>`,
  ][i];
  const ctlB = () => `
    ${ocard("What it lists", [
      orow("Windows from", "", dd("Every workspace")),
      orow("Tabbed windows once", "↓ shows a group's tabs.", sw(true)),
      orow("Assistant workspaces", "", sw(false)),
    ], { first: true })}
    ${ocard("How it looks", [
      orow("Window thumbnails", "", sw(true)),
      orow("Thumbnail size", "", seg(["Small", "Medium", "Large"], "Medium")),
      orow("Show after", "A quicker tap switches without showing it.", sl(20, "80 ms", 110)),
      orow("Animation", "", sw(true)),
    ])}
    ${ocard("Touchpad", [orow("Show all windows", "", dd("Spread four fingers"))])}`;
  const pvB = () => `
    ${pvhead("Keys", "What each one opens. Click one and press the new keys.", btn("Back to the defaults", "sm ghost", "refresh"))}
    <div class="kgrid">${MODES.map(([t, k, back, d], i) => `<div class="card km ${i === 2 ? "rec" : ""}">
        <div class="kh"><b>${t}</b>${i === 2 ? "" : keys(...k)}</div>
        <div class="kart">${kart(i)}</div>
        ${i === 2 ? `<div class="recf"><span class="recdot"></span>Press the new keys…<span class="sp"></span><small>Esc to cancel</small></div>` : `<div class="kl">${back ? `<span>Back</span>${keys(...back)}` : `<span>${d}</span>`}<span class="sp"></span>${i === 3 ? `<span>${icon("touchpad")}</span>` : ""}</div>`}
      </div>`).join("")}</div>
    ${pvfoot("A key another shortcut uses isn't taken; you'll see which one. Clear a key to turn it off.", "info")}`;

  /* ── C: one way of switching at a time ───────────────────────────── */
  const ctlC = (on) => `
    <div class="gtitle first">Ways to switch</div>
    <div class="modes">${MODES.map(([t, k, , d], i) => `<div class="mc ${i === on ? "on" : ""}"><span class="lic" style="--tc:var(--sec-desktop)">${icon(["window", "app", "layers", "grid"][i])}</span><div class="tx"><b>${t}</b><span>${d}</span></div>${keys(...k)}</div>`).join("")}</div>
    ${ocard("For all of them", [orow("Animation", "Fade in, slide the selection.", sw(true)), orow("Assistant workspaces", "List the windows assistants work in.", sw(false))])}`;
  const overview = () => `<div class="ovw"><div class="wsr"><span class="on">All</span><span>1</span><span>2</span><span>3</span></div><div class="og">${WINS.concat([["music", "pink", "Music", 3, "files"]]).map((w, i) => thumb(w, { on: i === 1 })).join("")}</div></div>`;
  const pvC = () => `
    ${pvhead("Show all windows", "Every window on every workspace, to pick with the mouse or the arrows.", "")}
    <div class="dskw mid" style="--dw:470px">${desk(overview(), { deep: true })}</div>
    ${ocard("", [orow("Keys", "", `${keys("Super", "Alt", "W")}${btn("Change", "sm")}`), orow("Touchpad gesture", "One another setting uses isn't offered.", "")])}
    <div class="gest">${[["No gesture", ""], ["Spread four fingers", "spread"], ["Five fingers up", "up"], ["Five fingers down", "down"]].map(([n, k]) => `<div class="gs ${k === "spread" ? "on" : ""}"><span class="fg">${k === "spread" ? `${icon("chev-l")}<b></b><b></b><b></b><b></b>${icon("chev-r")}` : k === "up" ? `<b></b><b></b><b></b><b></b><b></b>${icon("chev-u")}` : k === "down" ? `<b></b><b></b><b></b><b></b><b></b>${icon("chev-d")}` : icon("x")}</span>${n}</div>`).join("")}</div>`;
  const pvCw = () => `
    ${pvhead("Switch windows", "Hold Alt, press Tab to move along, let go to switch.", "")}
    <div class="dskw mid" style="--dw:440px">${desk(`${switcher({ tw: 66 })}<span class="keyhint">${keys("Alt", "Tab")} next · ${keys("Alt", "Shift", "Tab")} back</span>`)}</div>
    ${ocard("", [
      orow("Windows from", "", dd("Every workspace")),
      orow("Thumbnails", "", `${seg(["Off", "Small", "Medium", "Large"], "Medium")}`),
      orow("Tabbed windows once", "↓ shows a group's tabs.", sw(true)),
    ])}
    ${timeline(true)}`;

  /* ── The window ──────────────────────────────────────────────────── */
  const page = (body) => () => swin({ sec: "desktop", page: "Switcher", desc: "Alt + Tab and Super + Tab: what they list and how they look.", body: body() });

  REG("switcher", {
    name: "Switcher",
    summary: "Three groups in one column: seven settings under Switching, one touchpad gesture, then seven key fields that take Hyprland's own spelling (“ALT + SHIFT + grave”). Nothing shows the switcher, so thumbnail size or “Show after 80 ms” is guesswork until you press Alt + Tab.",
    problems: [
      "<b>No picture of the switcher:</b> thumbnails, their size, groups shown once and the animation are switches and a dropdown; what Medium looks like only shows when you press Alt + Tab.",
      "<b>“Show after” is a number:</b> 80 ms on a slider, with a two-line explanation of taps and holds that wraps at 800 px.",
      "<b>Keys typed in Hyprland's spelling:</b> seven text fields reading “ALT + TAB” and “ALT + SHIFT + grave”; you can't press the keys, and a typo only shows as a toast.",
      "<b>The four ways of switching are mixed together:</b> windows, apps, this app's windows and the overview share one list of settings, and the page doesn't say which setting changes which.",
      "<b>Long descriptions on every row</b> (“Show each group of tabbed windows once when switching windows; ↓ lists its tabs. The overview shows every tab.”) make it a page of reading.",
    ],
    today: [["switcher-1280", "Today", ""], ["switcher-800", "Today at 800 px", ""]],
    options: [
      { id: "a", name: "The switcher on your desk", idea: "The preview is the switcher drawn over a dimmed desktop, at the thumbnail size you pick, with workspace numbers and a tabbed group; the bar above it flips between Windows, Apps and All windows. Under it, “Show after” is a timeline: a tap on the left switches straight away, a hold on the right shows the switcher. Keys and the gesture are rows that open a level down.",
        shots: [["a-desk", "The switcher on your desk", "Thumbnails at Medium, the timeline under it"], ["a-desk-800", "At 800 px", "The switcher above; Show after moves into the controls"]] },
      { id: "b", name: "Keys you press", idea: "The settings sit in one column on the left. The preview is the keys: a card for each way of switching with its keycaps, a little drawing of what it opens, and the keys that go back. Click a card and press the new keys; a clash names the shortcut that already has them.",
        shots: [["b-keys", "Keys you press", "One card is waiting for new keys"]] },
      { id: "c", name: "One way at a time", idea: "The controls list the four ways of switching, each with its keys. Pick one and the preview shows it on the desk, with only the settings that change it underneath: Switch windows has the thumbnails and the timeline; Show all windows has its keys and the touchpad gesture as pictures.",
        shots: [["c-windows", "Switch windows open", "Its thumbnails and timing"], ["c-overview", "Show all windows open", "The overview, its keys and the gesture"]] },
    ],
    pages: {
      "a-desk": page(() => split(ctlA(), pvA(), { sec: "desktop" })),
      "b-keys": page(() => split(ctlB(), pvB(), { sec: "desktop", ctlw: 410 })),
      "c-windows": page(() => split(ctlC(0), pvCw(), { sec: "desktop", ctlw: 380 })),
      "c-overview": page(() => split(ctlC(3), pvC(), { sec: "desktop", ctlw: 380 })),
    },
  });
})();
