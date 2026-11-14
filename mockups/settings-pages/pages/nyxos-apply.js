// NyxOS › Applying changes: how every NyxOS system page applies what changed (Pending in
// platform/nyxos/pages.rs), drawn on Time & Language with two changes waiting.
(() => {
  /* ── The page underneath: Time & Language with two changes ───────── */
  const LAND = [
    [[13, 17], [20, 27]], [[10, 18], [19, 27], [33, 34], [45, 50]], [[2, 6], [7, 17], [19, 27], [34, 37], [38, 59]],
    [[1, 13], [16, 18], [20, 25], [26, 26], [32, 59]], [[3, 6], [8, 13], [16, 20], [29, 29], [31, 33], [34, 55], [56, 57]],
    [[8, 20], [29, 30], [30, 52], [53, 54]], [[9, 19], [29, 48], [49, 51], [53, 54]], [[9, 18], [28, 32], [33, 37], [38, 51], [52, 54]],
    [[10, 17], [28, 35], [36, 52], [52, 53]], [[11, 13], [15, 16], [27, 36], [36, 40], [40, 51]], [[11, 15], [16, 17], [27, 36], [36, 40], [41, 44], [45, 50]],
    [[13, 16], [27, 38], [42, 44], [45, 48], [50, 51]], [[15, 22], [27, 38], [43, 43], [46, 47], [50, 51]], [[16, 23], [31, 37], [45, 49], [50, 51]],
    [[16, 24], [32, 37], [46, 50], [52, 55]], [[16, 25], [32, 37], [47, 51], [53, 54]], [[17, 24], [32, 37], [38, 39], [50, 55]],
    [[17, 24], [32, 36], [38, 39], [48, 55]], [[17, 22], [32, 36], [48, 55]], [[17, 21], [33, 35], [49, 55], [58, 59]],
    [[17, 20], [52, 54], [57, 59]], [[17, 19], [52, 53], [57, 58]], [[17, 19]], [[18, 19]],
  ];
  const px = (lon) => ((lon + 180) / 360) * 600, py = (lat) => ((84 - lat) / 144) * 240;
  const map = () => {
    const b0 = px(-7.5), b1 = px(7.5);
    let d = "";
    LAND.forEach((runs, r) => runs.forEach(([a, b]) => { for (let c = a; c <= b; c++) { const x = c * 10 + 5; d += `<circle cx="${x}" cy="${r * 10 + 5}" r="2.7" class="${x >= b0 && x <= b1 ? "z" : ""}"/>`; } }));
    const pin = (lon, lat, cls) => `<g class="pin ${cls}" transform="translate(${px(lon).toFixed(1)} ${py(lat).toFixed(1)})"><circle r="11" class="halo"/><circle r="5"/></g>`;
    return `<svg class="ap-map" viewBox="0 0 600 240"><rect x="${b0}" y="0" width="${b1 - b0}" height="240" class="band"/>${d}${pin(-74, 40.7, "was")}${pin(-9.1, 38.7, "now")}</svg>`;
  };
  const sys = () => `<span class="ap-sys">${icon("layers")}</span>`;

  /** The controls; `st` is "pending", "building" or "done". */
  const ctl = (st = "pending") => {
    const ch = st !== "done";
    const mark = (t) => `${ch ? '<span class="ap-dot"></span>' : ""}${t}${sys()}`;
    return `${ocard("Date and time", [
        orow(mark("Time zone"), ch ? "Was America/New York" : "Lisbon, Portugal · UTC+0", dd("Europe/Lisbon", "search"), { ic: "globe", sec: "system", cls: ch ? "ap-chg" : "" }),
        orow("Now", "", `<span class="rv">${st === "done" ? "Friday 13 November, 20:21" : "Friday 13 November, 15:19"}</span>`, { ic: "clock", sec: "system" }),
      ], { first: true, cls: "icons" })}
      ${ocard("Language and keyboard", [
        orow(mark("Language and formats"), ch ? "Was English (United States)" : "Menus, dates, numbers and money", dd("English (UK)"), { ic: "chat", sec: "system", cls: ch ? "ap-chg" : "" }),
        orow(`Keyboard layout${sys()}`, "On the desktop and the console", dd("English (US)"), { ic: "keyboard", sec: "system" }),
      ], { cls: "icons" })}
      ${ocard("This computer", [orow(`Name${sys()}`, "Seen by other computers", `<span class="field ap-name">atlas</span>`, { ic: "laptop", sec: "system" })], { cls: "icons" })}`;
  };
  const pv = () => `
    ${pvhead("Lisbon, Portugal", "Europe/Lisbon · UTC+0 · 5 hours ahead of New York", `<div class="ap-big">20:19</div>`)}
    <div class="ap-mapc card">${map()}</div>
    <div class="ap-fmt card">${[["calendar", "Date", "Friday 13 November 2026", ""], ["clock", "Time", "20:19", "3:19 PM"], ["tag", "Money", "£1,234.56", "$1,234.56"], ["grid", "Weeks start on", "Monday", "Sunday"]].map(([ic, k, v, w]) => `<div class="fr">${icon(ic)}<small>${k}</small><b>${v}</b>${w ? `<s>${w}</s>` : ""}</div>`).join("")}</div>`;
  const body = (st, cls = "") => split(ctl(st), pv(), { sec: "system", cls: `ap ${cls}`, ctlw: 430 });
  const CH = [
    ["globe", "Time zone", "America/New York", "Europe/Lisbon", "Clocks move 5 hours ahead, to 20:19."],
    ["chat", "Language and formats", "English (US)", "English (UK)", "Dates read 13/11/2026 and money £1,234.56. Apps use it the next time they open."],
  ];
  const win2 = (o) => nwin({ cat: "system", page: "Time & Language", desc: "The clock, the language and formats, the keyboard and this computer's name.", ...o });

  /* ── Option A: a bar at the foot of the page ──────────────────────── */
  const footBar = (st) => {
    if (st === "pending") return `<div class="ap-bar">
        <span class="bi">${icon("layers")}</span>
        <div class="bt"><b>2 system changes waiting</b><div class="bchips">${CH.map(([ic, t, a, b]) => `<span class="bch">${icon(ic)}${t}<s>${a}</s>${icon("chev-r", "ar")}<b>${b}</b></span>`).join("")}</div></div>
        <span class="sp"></span>${btn("Discard", "ghost")}${btn("Apply…", "primary")}</div>`;
    if (st === "building") return `<div class="ap-bar busy">
        <span class="bi spin">${ring(42, { size: 34, c: "var(--accent)", label: " " })}</span>
        <div class="bt"><b>Building generation 143</b><span>Adding the English (UK) language data · about a minute left</span><div class="bprog">${prog(42)}</div></div>
        <span class="sp"></span>${btn("Show what it's doing", "ghost", "terminal")}</div>`;
    return `<div class="ap-bar ok">
        <span class="bi">${icon("check-c")}</span>
        <div class="bt"><b>Applied. Atlas is on generation 143.</b><span>The time zone and language changed. Apps use English (UK) the next time they open.</span></div>
        <span class="sp"></span>${btn("Go back to 142", "ghost", "hist")}${btn("Done")}</div>`;
  };
  const aPage = (st) => () => win2({ body: `${body(st, st === "building" ? "locked" : "")}${st === "building" ? `<div class="ap-lockn">${icon("lock")}Settings here wait until the build is done</div>` : ""}${footBar(st)}` });

  /* ── Option B: a tray in the header that collects every page's changes ── */
  const trayPill = (st) => st === "building"
    ? `<span class="ap-pill busy">${ring(62, { size: 20, c: "var(--accent)", label: " " })}<b>Building… 62%</b></span>`
    : `<span class="ap-pill"><span class="n">3</span><b>System changes</b>${icon("chev-d")}</span>`;
  const trayPop = (st) => {
    const item = (ic, t, a, b) => `<div class="ti">${T(ic, "system")}<div class="tx"><b>${t}</b><span><s>${a}</s> → ${b}</span></div>${st === "building" ? "" : ib("x", "Drop this change")}</div>`;
    return `<div class="ap-tray pop">
      <div class="th"><b>${st === "building" ? "Building generation 143" : "3 changes waiting"}</b><span>${st === "building" ? "Started 1 minute ago · keep working" : "Built together into one new generation"}</span></div>
      ${st === "building" ? `<div class="tprog">${prog(62)}<div class="steps">${[["Checked the changes", "ok"], ["Building the system", "on"], ["Switching to it", ""]].map(([t, c]) => `<span class="${c}">${c === "ok" ? icon("check") : "<i></i>"}${t}</span>`).join("")}</div></div>` : ""}
      <div class="tg">Time &amp; Language<span>2</span></div>
      ${item("globe", "Time zone", "America/New York", "Europe/Lisbon")}
      ${item("chat", "Language and formats", "English (US)", "English (UK)")}
      <div class="tg">Services<span>1</span></div>
      ${item("printer", "Printing (CUPS)", "Default", "On")}
      <div class="tf">${st === "building" ? `<span class="note">${icon("info")}New changes wait for the next build</span><span class="sp"></span>${btn("Details", "sm ghost", "terminal")}` : `<span class="note">${icon("lock")}Asks for your password</span><span class="sp"></span>${btn("Discard all", "sm ghost")}${btn("Apply 3 changes", "sm primary")}`}</div>
    </div>`;
  };
  const bPage = (st) => () => win2({ hdr: shdr({ end: trayPill(st) }), body: body(st, "tray"), over: trayPop(st) });

  /* ── Option C: a review sheet, then the build, then the result ──── */
  const sheet = (st) => {
    const head = { review: ["Apply 2 system changes?", "Atlas builds a new generation with them and switches to it only if the build works. It takes about 2 minutes."],
      building: ["Applying 2 system changes", "You can close this and keep working; Settings tells you when it's done."],
      failed: ["The build didn't work, so nothing changed", "Atlas is still on generation 142, as it was. Your 2 changes are still waiting on the page."] }[st];
    const chg = CH.map(([ic, t, a, b, fx]) => `<div class="cr">${T(ic, "system")}<div class="tx"><b>${t}</b><span>${fx}</span></div><div class="ba"><s>${a}</s>${icon("chev-r")}<b>${b}</b></div></div>`).join("");
    const steps = (state) => `<div class="steps">${[
      ["Check the changes", "A second", state.c1],
      ["Build generation 143", state.c2 === "bad" ? "Stopped after 48 seconds" : state.c2 === "on" ? "Adding the English (UK) language data · about a minute left" : "About 2 minutes", state.c2],
      ["Switch Atlas to it", state.c3 === "skip" ? "Skipped" : "When the build works", state.c3],
    ].map(([t, d, c], i) => `<div class="st ${c || ""}"><span class="sn">${c === "ok" ? icon("check") : c === "bad" ? icon("x") : c === "on" ? ring(55, { size: 22, c: "var(--accent)", label: " " }) : i + 1}</span><div class="tx"><b>${t}</b><span>${d}</span>${c === "on" ? `<div class="sp2">${prog(55)}</div>` : ""}</div></div>`).join("")}</div>`;
    let mid = "", bts = [];
    if (st === "review") {
      mid = `<div class="lab">What changes</div><div class="chg">${chg}</div>
        <div class="lab">Then</div>${steps({})}
        <div class="pw">${icon("lock")}<span>An administrator's password is asked for. If the build fails, nothing changes.</span></div>`;
      bts = [btn("Cancel"), btn("Apply", "primary")];
    } else if (st === "building") {
      mid = `<div class="chg mini">${chg}</div>${steps({ c1: "ok", c2: "on" })}`;
      bts = [btn("Show what it's doing", "ghost", "terminal"), `<span class="sp"></span>`, btn("Hide")];
    } else {
      mid = `<div class="why">${icon("warn")}<div><b>It couldn't download what English (UK) needs</b><span>Atlas went offline during the build. Connect to a network and try again.</span><code>error: unable to download 'glibc-locales-2.42': could not resolve host cache.nixos.org</code></div></div>
        ${steps({ c1: "ok", c2: "bad", c3: "skip" })}`;
      bts = [btn("Show the build log", "ghost", "terminal"), `<span class="sp"></span>`, btn("Keep them waiting"), btn("Try again", "primary", "refresh")];
    }
    return `<div class="veil"><div class="dlg pop ap-sheet ${st}"><div class="sh"><span class="si">${icon(st === "failed" ? "warn" : st === "building" ? "layers" : "layers")}</span><div><div class="h">${head[0]}</div><p>${head[1]}</p></div></div>${mid}<div class="bt">${bts.join("")}</div></div></div>`;
  };
  const cPage = (st) => () => win2({ body: body(st === "failed" ? "pending" : st), over: sheet(st) });

  REG("nyxos-apply", {
    name: "Applying changes",
    summary: "On NyxOS, system settings (the time zone, services, the boot screen, people) aren't changed one by one: a page collects what you changed, and Apply hands it to the Nyx System Manager, which builds a new generation and switches to it only when the build works. That takes a minute or two and asks for an administrator's password. Today every system page ends with the same “Apply system changes” row; after Apply, the only news is a toast.",
    problems: [
      "<b>You can't see what's waiting:</b> changed rows look like the others, and the Apply row doesn't say how many changes there are or what they are; the button just turns blue.",
      "<b>Changes are lost between pages:</b> each page has its own Apply; change the time zone, go to Services, and the zone is still waiting on a page you've left (and goes when Settings closes).",
      "<b>No way back from a choice:</b> there's no Discard, so undoing a change means remembering the old value and picking it again.",
      "<b>A build of a minute or two shows only a toast:</b> “Building the new system. It's switched to when the build works.” Then nothing until another toast; there's no progress, no way to see what it's doing, and the page isn't locked while it runs.",
      "<b>A failed build reads like an error message:</b> the toast shows the last line of nyx-system's output, and doesn't say the reassuring part: nothing changed, and the changes are still waiting.",
      "<b>The explanation is the same three lines on every page</b> (“System settings are built into a new generation…”), in the row itself, and at 800 px it wraps beside a dimmed button.",
    ],
    today: [
      ["nyxos-region-1280", "Time & Language today", "The Apply row at the foot. Taken without NyxOS's System Manager, so nothing here can be applied; Pending in pages.rs is what the row does."],
      ["nyxos-services-1280", "Services today", "The same row on another page, with its own Apply"],
      ["nyxos-region-800", "At 800 px", "The explanation wraps beside a dimmed button"],
    ],
    options: [
      { id: "a", name: "A bar at the foot of the page", idea: "Changed rows get a dot and say what they were. As soon as one changes, a bar rises at the foot of the page listing each change as before → after, with Discard and Apply. While the build runs the bar shows its progress and what it's doing, and the page's system settings wait. When it's done the bar says so and offers to go back to the previous generation; if it fails, it says nothing changed and keeps the changes waiting.",
        shots: [["a-pending", "Two changes waiting", "The bar lists both as before → after"], ["a-building", "Building", "Progress in the bar; the page's settings wait"], ["a-done-800", "Applied, at 800 px", "Generation 143, and a way back to 142"]] },
      { id: "b", name: "A tray in the header", idea: "Changes from every page collect in one tray in the header, so you can change the time zone, turn on printing in Services and apply both in one rebuild. Its count is always in view; it opens to a list grouped by page, where each change can be dropped. During the build the tray shows its steps and progress while you keep working; anything changed meanwhile waits for the next build.",
        shots: [["b-tray", "Three changes from two pages", "Time & Language and Services, applied together"], ["b-building-800", "Building, at 800 px", "The tray shows the steps; the page stays usable"]] },
      { id: "c", name: "Review, then build", idea: "Apply opens a sheet that shows each change before → after and what it will mean (clocks move 5 hours, dates read 13/11/2026), then the three steps: check, build, switch. The same sheet shows the build's progress and can be hidden. If the build fails it says so plainly first (nothing changed, Atlas is still on 142), then why, with the log one click away and the changes kept for another try.",
        shots: [["c-review", "Before the build", "Each change, what it means, and the steps"], ["c-building", "Building", "Step two of three, about a minute left"], ["c-failed-800", "A failed build, at 800 px", "Nothing changed; the reason and Try again"]] },
    ],
    pages: {
      "a-pending": aPage("pending"), "a-building": aPage("building"), "a-done": aPage("done"),
      "b-tray": bPage("pending"), "b-building": bPage("building"),
      "c-review": cPage("review"), "c-building": cPage("building"), "c-failed": cPage("failed"),
    },
    icons: {
      chat: '<path d="M20.5 11.5a8 8 0 0 1-11.8 7L3.5 20l1.5-4.7A8 8 0 1 1 20.5 11.5z"/><path d="M8.5 10h7M8.5 13.5h4.5"/>',
      laptop: '<rect x="5" y="5" width="14" height="10" rx="1.5"/><path d="M3 18.5h18"/>',
    },
  });
})();
