// NyxOS › Time & Language (platform/nyxos/pages.rs, region()): the time zone, the clock,
// language and formats, the keyboard layout and this computer's name, applied as one rebuild.
(() => {
  /* ── Sample data ─────────────────────────────────────────────────── */
  // Land on a 60 × 24 grid (6° a cell, 84° N to 60° S), as inclusive column ranges per row.
  const LAND = [
    [[13, 17], [20, 27]],
    [[10, 18], [19, 27], [33, 34], [45, 50]],
    [[2, 6], [7, 17], [19, 27], [34, 37], [38, 59]],
    [[1, 13], [16, 18], [20, 25], [26, 26], [32, 59]],
    [[3, 6], [8, 13], [16, 20], [29, 29], [31, 33], [34, 55], [56, 57]],
    [[8, 20], [29, 30], [30, 52], [53, 54]],
    [[9, 19], [29, 48], [49, 51], [53, 54]],
    [[9, 18], [28, 32], [33, 37], [38, 51], [52, 54]],
    [[10, 17], [28, 35], [36, 52], [52, 53]],
    [[11, 13], [15, 16], [27, 36], [36, 40], [40, 51]],
    [[11, 15], [16, 17], [27, 36], [36, 40], [41, 44], [45, 50]],
    [[13, 16], [27, 38], [42, 44], [45, 48], [50, 51]],
    [[15, 22], [27, 38], [43, 43], [46, 47], [50, 51]],
    [[16, 23], [31, 37], [45, 49], [50, 51]],
    [[16, 24], [32, 37], [46, 50], [52, 55]],
    [[16, 25], [32, 37], [47, 51], [53, 54]],
    [[17, 24], [32, 37], [38, 39], [50, 55]],
    [[17, 24], [32, 36], [38, 39], [48, 55]],
    [[17, 22], [32, 36], [48, 55]],
    [[17, 21], [33, 35], [49, 55], [58, 59]],
    [[17, 20], [52, 54], [57, 59]],
    [[17, 19], [52, 53], [57, 58]],
    [[17, 19]],
    [[18, 19]],
  ];
  const ZONE = { name: "Europe/Lisbon", city: "Lisbon", where: "Portugal", lon: -9.1, lat: 38.7, band: [-7.5, 7.5], off: "UTC+0", time: "20:19" };
  const WAS = { name: "America/New York", city: "New York", lon: -74, lat: 40.7, off: "UTC−5", time: "15:19" };
  const FMT_US = { date: "Friday, November 13, 2026", short: "11/13/2026", time: "3:19 PM", num: "1,234,567.89", cur: "$1,234.56", week: "Sunday" };
  const FMT_GB = { date: "Friday 13 November 2026", short: "13/11/2026", time: "20:19", num: "1,234,567.89", cur: "£1,234.56", week: "Monday" };

  /* ── Drawings ────────────────────────────────────────────────────── */
  const W = 600, H = 240;
  const px = (lon) => ((lon + 180) / 360) * W;
  const py = (lat) => ((84 - lat) / 144) * H;
  /** The dotted world, the chosen zone as a band, night shaded, pins for the zone and the old one. */
  const worldMap = (o = {}) => {
    const [b0, b1] = (o.zone || ZONE).band.map(px);
    let dots = "";
    LAND.forEach((runs, r) => runs.forEach(([a, b]) => {
      for (let c = a; c <= b; c++) {
        const x = c * 10 + 5, y = r * 10 + 5, inz = x >= b0 && x <= b1;
        dots += `<circle cx="${x}" cy="${y}" r="2.7" class="${inz ? "z" : ""}"/>`;
      }
    }));
    const z = o.zone || ZONE, n0 = px(-34.8), n1 = px(145.2);
    const pin = (p, cls, label) => `<g class="pin ${cls}" transform="translate(${px(p.lon).toFixed(1)} ${py(p.lat).toFixed(1)})"><circle r="11" class="halo"/><circle r="5"/>${label ? `<text x="${cls === "was" ? -10 : 10}" y="-12" text-anchor="${cls === "was" ? "end" : "start"}">${label}</text>` : ""}</g>`;
    return `<svg class="rg-map" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet">
      <defs><linearGradient id="rgn" x1="0" x2="1"><stop offset="0" stop-opacity="0"/><stop offset=".12" stop-opacity="1"/><stop offset=".88" stop-opacity="1"/><stop offset="1" stop-opacity="0"/></linearGradient></defs>
      ${o.night !== false ? `<rect x="${n0 - 30}" y="0" width="${n1 - n0 + 60}" height="${H}" class="night" fill="url(#rgn)"/>` : ""}
      <rect x="${b0}" y="0" width="${b1 - b0}" height="${H}" class="band"/>
      ${dots}
      ${o.was ? pin(WAS, "was", o.labels !== false ? WAS.city : "") : ""}
      ${pin(z, "now", o.labels !== false ? z.city : "")}
    </svg>`;
  };

  const UK = [
    [["`", "¬", 1, 1], ["1", "!"], ["2", '"', 1, 1], ["3", "£", 1, 1], ["4", "$"], ["5", "%"], ["6", "^"], ["7", "&"], ["8", "*"], ["9", "("], ["0", ")"], ["-", "_"], ["=", "+"], ["⌫", "", 1.9]],
    [["Tab", "", 1.5], ["Q"], ["W"], ["E"], ["R"], ["T"], ["Y"], ["U"], ["I"], ["O"], ["P"], ["[", "{"], ["]", "}"], ["Enter", "", 1.4, 0, "ent"]],
    [["Caps", "", 1.8], ["A"], ["S"], ["D"], ["F"], ["G"], ["H"], ["J"], ["K"], ["L"], [";", ":"], ["'", "@", 1, 1], ["#", "~", 1, 1], ["", "", 1.1, 0, "gap"]],
    [["Shift", "", 1.3], ["\\", "|", 1, 1], ["Z"], ["X"], ["C"], ["V"], ["B"], ["N"], ["M"], [",", "<"], [".", ">"], ["/", "?"], ["Shift", "", 2.7]],
    [["Ctrl", "", 1.4], ["Super", "", 1.3], ["Alt", "", 1.3], ["", "", 6.4], ["AltGr", "", 1.3], ["Ctrl", "", 1.4]],
  ];
  /** A keyboard drawn with the layout's legends; keys that differ from English (US) in colour. */
  const keyboard = (o = {}) => `<div class="rg-kb ${o.cls || ""}">${UK.map((r) => `<div class="kr">${r.map(([k, s = "", w = 1, diff = 0, cls = ""]) =>
    `<span class="k ${diff ? "diff" : ""} ${k.length > 1 ? "fn" : ""} ${cls}" style="flex:${w}">${s ? `<small>${s}</small>` : ""}<b>${k}</b></span>`).join("")}</div>`).join("")}</div>`;

  /** Sample formats, with what they were when `was` is given. */
  const samples = (f, was, o = {}) => {
    const rows = [["calendar", "Date", f.date, ""], ["clock", "Time", f.time, was && was.time], ["hash", "Numbers", f.num, ""], ["tag", "Money", f.cur, was && was.cur], ["grid", "Weeks start on", f.week, was && was.week]];
    return `<div class="rg-fmt card ${o.cls || ""}">${rows.map(([ic, k, v, w]) => `<div class="fr">${icon(ic)}<small>${k}</small><b>${v}</b>${w && w !== v ? `<s>${w}</s>` : ""}</div>`).join("")}</div>`;
  };

  const tag = () => `<span class="rg-sys" title="A system setting, applied with a rebuild">${icon("layers")}</span>`;
  /** A row that's been changed and waits to be applied: a dot, and what it was. */
  const changed = (t, was) => [`<span class="rg-ch"></span>${t}`, `Was ${was}`];

  /** The bar at the foot of the controls: what's waiting, Discard and Apply. */
  const pending = (n, what, stack) => `<div class="rg-pend card ${stack ? "stack" : ""}">
      <div class="pt"><span class="pi">${icon("layers")}</span>
      <div class="opt-text"><div><b>${n} change${n > 1 ? "s" : ""} waiting</b></div><div class="d">${what}</div></div></div>
      <div class="pb">${btn("Discard", "ghost sm")}${btn("Apply…", "primary sm")}</div>
    </div>`;

  /** The name as others see it: in a file browser's network list, and as an address. */
  const nameCard = (name = "atlas", head = true) => `<div class="rg-net card">
      <div class="nl">${head ? "<small>On the network</small>" : ""}
        <div class="nside"><span>${icon("drive")}This computer</span><span class="on">${icon("laptop")}${name}</span><span>${icon("printer")}Office printer</span></div></div>
      <div class="na"><small>Address</small><b class="mono">${name}.local</b><span>Letters, digits and dashes</span></div>
    </div>`;

  /* ── Option A: one column, the map and the formats beside it ────── */
  const aCtl = () => `
    ${ocard("Date and time", [
      orow(...changed(`Time zone${tag()}`, WAS.name), dd(ZONE.name, "search"), { ic: "globe", sec: "system", cls: "rg-chg" }),
      orow("Now", "", `<span class="rv">Friday 13 November, ${WAS.time}</span>`, { ic: "clock", sec: "system" }),
    ], { first: true, cls: "icons" })}
    ${ocard("Language and keyboard", [
      orow(...changed(`Language and formats${tag()}`, "English (United States)"), dd("English (UK)"), { ic: "chat", sec: "system", cls: "rg-chg" }),
      orow(`Keyboard layout${tag()}`, "On the desktop and the console", dd("English (US)"), { ic: "keyboard", sec: "system" }),
      nrow("More layouts", "To switch between while you type", "Keyboard", { ic: "layers", sec: "system" }),
    ], { cls: "icons" })}
    ${ocard("This computer", [
      orow(`Name${tag()}`, "Seen by other computers", `<span class="field rg-name">atlas</span>`, { ic: "laptop", sec: "system" }),
    ], { cls: "icons" })}
    ${pending(2, "About 2 minutes, in one rebuild")}`;

  const aPv = () => `
    ${pvhead("Lisbon, Portugal", `Europe/Lisbon · ${ZONE.off} · 5 hours ahead of New York`, `<div class="rg-big">${ZONE.time}</div>`)}
    <div class="rg-mapc card">${worldMap({ was: true })}
      <div class="rg-mapk"><span><i class="k1"></i>Your new zone</span><span><i class="k2"></i>Now</span><span><i class="k3"></i>Night</span></div></div>
    <div class="rg-two">
      <div class="rg-col"><div class="rg-h">In English (UK)<span class="chip2 acc">After applying</span></div>${samples(FMT_GB, FMT_US)}</div>
      <div class="rg-col nn"><div class="rg-h">This computer</div>${nameCard()}</div>
    </div>`;

  /* ── Option B: four topics, the open one's picker as the picture ── */
  const topics = (on) => `
    <div class="card rg-topics">${[
      ["globe", "Time zone", ZONE.name, "zone", true],
      ["chat", "Language and formats", "English (UK)", "lang", true],
      ["keyboard", "Keyboard layout", "English (UK)", "keys", true],
      ["laptop", "Computer name", "atlas", "name", false],
    ].map(([ic, t, v, id, ch]) => `<div class="opt onav ${id === on ? "picked" : ""}"><span class="lic" style="--tc:var(--sec-system)">${icon(ic)}</span><div class="opt-text"><div>${ch ? '<span class="rg-ch"></span>' : ""}${t}</div><div class="d">${v}</div></div>${icon("chev-r", "cv")}</div>`).join("")}</div>
    <div class="rg-clock card"><div><small>Now in Lisbon</small><b>${ZONE.time}</b><span>Friday 13 November 2026</span></div><div class="was"><small>On Atlas until you apply</small><b>${WAS.time}</b><span>New York</span></div></div>
    ${pending(3, "Zone, language and keyboard, built together in one rebuild · about 2 minutes", true)}`;

  const bKeysPv = () => `
    ${pvhead("Keyboard layout", "For the desktop, the console and the sign-in screen", `<div class="field rg-srch">${icon("search")}<span>English</span></div>`)}
    <div class="pvchips">${["English (US)", "English (UK)", "Canadian", "Spanish (Latin America)", "Portuguese", "Irish"].map((n) => chip(n, n === "English (UK)" ? "on" : "")).join("")}</div>
    <div class="rg-kbc card">${keyboard()}
      <div class="rg-kbl"><span><i class="d"></i>Different from English (US)</span><span>Small marks are with Shift</span><span class="sp"></span><span class="dim">English (UK) · ISO keyboard</span></div></div>
    <div class="rg-try card">${icon("pen")}<span class="tx">Try it: <b>Shift + 3</b> types <b>£</b>, <b>Shift + '</b> types <b>@</b><span class="cur"></span></span><span class="sp"></span>${btn("Use English (UK)", "primary sm")}</div>
    ${pvfoot("Settings › Keyboard keeps more layouts to switch between with Super + Space.", "info")}`;

  const bZonePv = () => `
    ${pvhead("Time zone", "Search a city, a country or a zone", "")}
    <div class="field focus rg-srchw">${icon("search")}<span>Portugal</span><span class="cnt">3 zones</span></div>
    <div class="rg-zgrid"><div class="rg-zmap card">${worldMap({ labels: false, night: false })}</div>
    <div class="card rg-zl">${[
      ["Lisbon", "Europe/Lisbon · mainland Portugal", "UTC+0", "20:19", true],
      ["Madeira", "Atlantic/Madeira", "UTC+0", "20:19", false],
      ["Azores", "Atlantic/Azores", "UTC−1", "19:19", false],
    ].map(([c, z, off, t, on]) => `<div class="opt ${on ? "picked" : ""}">${radio(on)}<div class="opt-text"><div>${c}</div><div class="d">${z}</div></div><span class="rv">${off}</span><b class="zt">${t}</b></div>`).join("")}</div></div>`;

  /* ── Option C: the picture is your own desktop with the settings in it ── */
  const cCtl = () => `
    ${ocard("", [
      orow(...changed("Time zone", WAS.name), dd("Europe/Lisbon", "search"), { cls: "rg-chg" }),
      orow(...changed("Language and formats", "English (United States)"), dd("English (UK)"), { cls: "rg-chg" }),
      orow("Keyboard layout", "", dd("English (US)")),
      orow("Computer name", "", `<span class="field rg-name">atlas</span>`),
    ], { first: true })}
    <div class="rg-note">${icon("layers")}<span>These are system settings, for everyone on Atlas. They're built into a new generation together, and Atlas switches to it when the build works.</span></div>
    ${pending(2, "Built together in about 2 minutes; your password is asked for", true)}`;

  const cPv = () => `
    ${pvhead("How Atlas will look", "Your desk, the lock screen and the network after you apply", seg(["After", "Now"], "After"))}
    <div class="rg-desk">
      <div class="rg-scr" style="background:${wall("lisbon")}">
        <div class="bar"><span class="ws"><b class="on"></b><b></b><b></b></span><span class="ck">Fri 13 Nov 20:19</span><span class="tr">${icon("wifi")}${icon("volume")}${icon("battery")}</span></div>
        <div class="files"><div class="fh"><i></i><i></i><i></i><b>Files</b></div>
          <div class="fth"><span>Name</span><span>Modified</span><span>Size</span></div>
          ${[["Flat lease.pdf", "13/11/2026", "1.2 MB"], ["Budget.ods", "12/11/2026", "84 kB"], ["Moving list.md", "09/11/2026", "3 kB"]].map(([n, d, s]) => `<div class="ftr"><span>${icon("file")}${n}</span><span class="hl">${d}</span><span>${s}</span></div>`).join("")}</div>
        <div class="cal"><b>November 2026</b><div class="cg">${["M", "T", "W", "T", "F", "S", "S"].map((d, i) => `<small class="${i === 0 ? "hl" : ""}">${d}</small>`).join("")}${Array.from({ length: 21 }, (_, i) => `<span class="${i - 5 === 13 ? "on" : ""}">${i < 6 ? "" : i - 5}</span>`).join("")}</div></div>
        <div class="note"><span class="ni">${icon("calendar")}</span><div><b>Flat viewing</b><span>Tomorrow at 10:30 · Rua da Rosa</span></div></div>
      </div>
      <div class="rg-lock"><div class="lk" style="background:${wall("tejo")}"><b>20:19</b><span>Friday 13 November</span><i></i></div><small>Lock screen</small></div>
    </div>
    <div class="rg-two">
      <div class="rg-col"><div class="rg-h">Money and numbers</div><div class="card rg-mini">${[["A price", "£1,234.56"], ["A big number", "1,234,567.89"], ["Weeks start", "Monday"], ["A short date", "13/11/2026"], ["The time", "20:19"], ["Paper", "A4"]].map(([k, v]) => `<div><small>${k}</small><b>${v}</b></div>`).join("")}</div></div>
      <div class="rg-col nn"><div class="rg-h">On the network</div>${nameCard("atlas", false)}</div>
    </div>`;

  const page = (body) => () => nwin({ cat: "system", page: "Time & Language", desc: "The clock, the language and formats, the keyboard and this computer's name.", body: body() });

  REG("nyxos-region", {
    name: "Time & Language",
    summary: "NyxOS's own Time & Language page: the time zone, the clock, the language and formats, the keyboard layout and the computer's name, all system settings that are built together into a new generation. Today it's three cards of dropdowns with a “System” tag on every row and an Apply row at the bottom; nothing shows what a choice will look like, or what's waiting to be applied.",
    problems: [
      "<b>No picture of a choice:</b> the time zone is a dropdown of 600 zone names (America/New_York, Europe/Lisbon); there's no map, no “it's 20:19 there”, and no sample of how dates, money and weeks look in a language.",
      "<b>Pending changes are invisible:</b> changing a dropdown only wakes up the Apply button at the foot; nothing marks which rows changed or what they were before.",
      "<b>The Apply row is cramped and wordy:</b> it sits flush against the Name card with a three-line explanation, and at 800 px the explanation wraps around a dimmed button.",
      "<b>A “System” tag on every row</b> repeats the same word five times; the page is all system settings, so it says nothing.",
      "<b>Keyboard layout without the keyboard:</b> picking English (UK) doesn't show that £, @ and # move, and the hint pointing to Settings › Keyboard is a sentence, not a link.",
      "<b>The computer's name is a bare text field:</b> nothing shows where the name appears (other computers, phones, the address) or what's allowed until a toast complains.",
    ],
    today: [
      ["nyxos-region-1280", "Time & Language today", "Taken on a laptop without NyxOS's System Manager, so the values are the laptop's own; the page's layout is the real one."],
      ["nyxos-region-800", "At 800 px", "The Apply row's explanation wraps beside a dimmed button."],
    ],
    options: [
      { id: "a", name: "Map and samples", idea: "The controls stay one short column: date and time, language and keyboard, this computer. Beside them the picture shows the picked zone on a world map (where it's night, where you were), the time there, and dates, money and week starts in the picked language with the old ones struck through. Changed rows get a dot and say what they were; a bar at the foot of the controls counts what's waiting and applies it in one rebuild.",
        shots: [["a-map", "Moving to Lisbon", "Two changes waiting: the zone and the language"], ["a-map-800", "At 800 px", "The map and the samples above the controls"]] },
      { id: "b", name: "One topic at a time", idea: "The controls are four rows, one per topic, each with its current value. The open one fills the picture with a proper picker: Keyboard layout draws the keyboard with the keys that move in colour and a line to try it in; Time zone is a search over cities and countries with the matches on the map and the time in each. The clock under the topics shows the time there and on Atlas until you apply.",
        shots: [["b-keys", "Keyboard layout open", "English (UK): £, @, # and \\ move"], ["b-zone-800", "Time zone open, at 800 px", "Searching “Portugal” finds three zones"]] },
      { id: "c", name: "Your desktop as the preview", idea: "All four settings sit in one card, with one plain note on what system settings are. The picture is Atlas itself after you apply: the bar's clock, a Files window's dates and sizes, a calendar whose weeks start on Monday, the lock screen, money and numbers, and the name in the network list. After and Now flip between the two.",
        shots: [["c-desk", "After applying", "The bar, Files, the calendar and the lock screen in English (UK) and Lisbon time"]] },
    ],
    pages: {
      "a-map": page(() => split(aCtl(), aPv(), { sec: "system", cls: "rg", ctlw: 440 })),
      "b-keys": page(() => split(topics("keys"), bKeysPv(), { sec: "system", cls: "rg", ctlw: 360 })),
      "b-zone": page(() => split(topics("zone"), bZonePv(), { sec: "system", cls: "rg rgz", ctlw: 360 })),
      "c-desk": page(() => split(cCtl(), cPv(), { sec: "system", cls: "rg", ctlw: 400 })),
    },
    icons: {
      chat: '<path d="M20.5 11.5a8 8 0 0 1-11.8 7L3.5 20l1.5-4.7A8 8 0 1 1 20.5 11.5z"/><path d="M8.5 10h7M8.5 13.5h4.5"/>',
      hash: '<path d="M9 3.5 7 20.5M17 3.5l-2 17M4 9h16.5M3.5 15H20"/>',
      laptop: '<rect x="5" y="5" width="14" height="10" rx="1.5"/><path d="M3 18.5h18"/>',
    },
  });
})();
