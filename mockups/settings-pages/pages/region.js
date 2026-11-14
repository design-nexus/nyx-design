// System › Time & Language: time zone, automatic time, clock, language and formats, the computer's name.
(() => {
  const sec = "system";
  const page = (ctl, pv, ctlw) => () => swin({ sec, page: "Time & Language", desc: "Time zone, the clock, language and formats, and this computer's name.", body: split(ctl(), pv(), { sec, ctlw }) });
  const L = (ic) => ({ ic, sec });

  /* A dot map of the world: rough outlines (longitude, latitude), dots inside them, shaded where it's night. */
  const LAND = [
    [[-168, 66], [-162, 70], [-140, 70], [-125, 71], [-95, 72], [-80, 73], [-62, 67], [-55, 52], [-66, 45], [-75, 38], [-81, 31], [-80, 25], [-90, 29], [-97, 26], [-97, 20], [-90, 16], [-83, 9], [-79, 8], [-85, 14], [-105, 20], [-110, 24], [-117, 32], [-124, 40], [-124, 48], [-135, 58], [-150, 60], [-165, 60]],
    [[-55, 60], [-45, 60], [-20, 70], [-20, 80], [-60, 82], [-72, 78], [-60, 70]],
    [[-80, 9], [-72, 12], [-60, 10], [-50, 0], [-35, -6], [-38, -15], [-48, -26], [-58, -38], [-65, -42], [-68, -55], [-74, -50], [-72, -30], [-71, -18], [-81, -5]],
    [[-10, 36], [-9, 44], [-2, 44], [-5, 48], [2, 51], [8, 54], [5, 58], [10, 63], [20, 70], [30, 71], [40, 68], [45, 60], [50, 50], [40, 44], [30, 45], [28, 41], [22, 37], [15, 38], [12, 44], [8, 44], [3, 42], [-5, 36]],
    [[-17, 21], [-17, 14], [-12, 7], [-5, 5], [8, 4], [9, -1], [13, -12], [12, -18], [18, -34], [26, -34], [33, -26], [40, -15], [40, -3], [51, 12], [43, 12], [37, 20], [33, 31], [20, 32], [10, 37], [-5, 36], [-10, 30]],
    [[28, 41], [36, 36], [35, 30], [44, 13], [55, 17], [58, 23], [62, 25], [67, 24], [73, 20], [77, 8], [80, 14], [88, 22], [92, 21], [98, 16], [100, 7], [104, 1], [106, 10], [110, 20], [118, 24], [122, 30], [122, 40], [128, 35], [130, 43], [140, 48], [142, 55], [135, 58], [155, 60], [160, 62], [170, 65], [180, 68], [180, 72], [140, 74], [110, 78], [80, 74], [68, 72], [60, 68], [45, 68], [40, 68], [45, 60], [50, 50], [40, 44]],
    [[130, 31], [136, 34], [140, 36], [142, 41], [141, 45], [139, 40], [133, 34]],
    [[95, 5], [105, -6], [115, -8], [125, -9], [140, -8], [141, -3], [131, -1], [120, 2], [117, 7], [110, 2], [100, 3]],
    [[114, -22], [114, -34], [122, -34], [132, -31], [138, -35], [146, -39], [150, -37], [153, -28], [146, -19], [142, -11], [136, -12], [130, -12], [122, -17]],
    [[-6, 50], [2, 51], [0, 53], [-2, 56], [-3, 58], [-6, 58], [-5, 54], [-3, 52]],
    [[44, -25], [47, -25], [50, -15], [49, -12], [44, -17]],
    [[172, -34], [178, -38], [174, -41], [167, -46], [171, -44]],
  ];
  const inside = (x, y, poly) => { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const [xi, yi] = poly[i], [xj, yj] = poly[j]; if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c; } return c; };
  const SUN = { lon: -124.5, dec: -18 * Math.PI / 180 };
  const night = (lon, lat) => { const r = Math.PI / 180, la = lat * r; return Math.sin(la) * Math.sin(SUN.dec) + Math.cos(la) * Math.cos(SUN.dec) * Math.cos((lon - SUN.lon) * r) < 0; };
  const map = (o = {}) => {
    const W = 720, H = 300, top = 80, span = 140, px = (lon) => ((lon + 180) / 360) * W, py = (lat) => ((top - lat) / span) * H;
    let dots = "";
    for (let lat = top - 2; lat > top - span; lat -= 3.6) for (let lon = -178; lon < 180; lon += 3.6) {
      if (!LAND.some((p) => inside(lon, lat, p))) continue;
      const zone = lon >= -97.5 && lon < -82.5 && lat > 14 && lat < 60;
      dots += `<circle cx="${px(lon).toFixed(1)}" cy="${py(lat).toFixed(1)}" r="2.3" class="${zone ? "z" : night(lon, lat) ? "n" : ""}"/>`;
    }
    const bx = px(-97.5), bw = px(-82.5) - bx, cx = px(-87.6), cy = py(41.9);
    return `<svg class="rg-map" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet">
      <rect x="${bx}" y="0" width="${bw}" height="${H}" class="band"/>
      ${dots}
      <circle cx="${cx}" cy="${cy}" r="14" class="halo"/><circle cx="${cx}" cy="${cy}" r="6" class="pin"/>
      ${o.label !== false ? `<g class="tag" transform="translate(${cx + 14} ${cy - 40})"><rect width="118" height="34" rx="8"/><text x="10" y="14" class="t1">Chicago</text><text x="10" y="27" class="t2">2:18 PM · UTC−6</text></g>` : ""}
      ${[["London", -0.1, 51.5, "8:18 PM", 1], ["Tokyo", 139.7, 35.7, "5:18 AM", -1], ["Sydney", 151.2, -33.9, "7:18 AM", -1]].map(([n, lo, la, t, s]) => `<g class="oth" transform="translate(${px(lo)} ${py(la)})"><circle r="3.5"/><text x="${s * 7}" y="4" text-anchor="${s > 0 ? "start" : "end"}">${n} ${t}</text></g>`).join("")}
    </svg>`;
  };

  /* ── A: the map and samples in your formats ── */
  const ctlA = () => `
    ${ocard("Date and time", [
      orow("Set the time automatically", "From the internet · checked 4 minutes ago", sw(true), L("refresh")),
      orow("Time zone", "", dd("Chicago · Central Time"), L("globe")),
      orow("Clock", "", seg(["12-hour", "24-hour"], "12-hour"), L("clock")),
    ], { first: true, cls: "icons" })}
    ${ocard("Language and formats", [
      orow("Language", "Menus and apps", dd("English (US)"), L("lang")),
      orow("Formats", "Dates, numbers and money", dd("United States"), L("hash")),
      nrow("Add a language", "Install another to choose it above", "", L("plus")),
    ], { cls: "icons" })}
    ${ocard("This computer", [
      orow("Name", "On the network", `<span class="field rg-f">Atlas</span>`, L("laptop")),
      nrow("Keyboard layout", "On the Keyboard page", "English (US)", L("keyboard")),
    ], { cls: "icons" })}`;
  const SAMPLES = [["Today", "Friday, November 13, 2026"], ["Short date", "11/13/26"], ["Time", "2:18 PM"], ["Numbers", "1,234,567.89"], ["Money", "$1,234.56"], ["Week starts", "Sunday"], ["Measurements", "Feet, pounds, °F"], ["Paper", "Letter"]];
  const pvA = () => `
    ${pvhead("Central Time", "Chicago · UTC−6 · clocks went back an hour on November 1", `<div class="rg-now"><b>2:18</b> PM</div>`)}
    <div class="card rg-mapc">${map()}<div class="rg-leg"><span><i class="d"></i>Day</span><span><i class="n"></i>Night</span><span><i class="z"></i>Your time zone</span></div></div>
    <div class="rg-sh"><b>In your formats</b><span>United States, English</span></div>
    <div class="card rg-samp">${SAMPLES.map(([k, v]) => `<div><small>${k}</small><span>${v}</span></div>`).join("")}</div>
    ${pvfoot("The clock is right: synced with the internet 4 minutes ago.", "check-c")}`;

  /* ── B: pick a city; the clock, a month and real-looking samples ── */
  const CITIES = [["Chicago", "Central Time · UTC−6", "2:18 PM", true], ["Denver", "Mountain Time · UTC−7", "1:18 PM"], ["New York", "Eastern Time · UTC−5", "3:18 PM"], ["Los Angeles", "Pacific Time · UTC−8", "12:18 PM"], ["Mexico City", "Central Time · UTC−6", "2:18 PM"]];
  const ctlB = () => `
    <div class="field rg-search">${icon("search")}<span class="ph">Search for a city or a country</span></div>
    ${ocard("Near you", CITIES.map(([c, z, t, on]) => `<div class="opt ${on ? "picked" : ""}">${radio(on)}<div class="opt-text"><div>${c}</div><div class="d">${z}</div></div><span class="rv">${t}</span></div>`))}
    ${ocard("", [orow("Use my location", "Change the time zone when you travel", sw(false), L("mapin")), orow("Set the time automatically", "", sw(true), L("refresh"))], { cls: "icons" })}
    ${ocard("", [nrow("Language and formats", "", "English (US)", L("lang")), nrow("Computer name", "", "Atlas", L("laptop"))], { cls: "icons" })}`;
  const clock = () => {
    const h = 2 + 18 / 60, m = 18;
    const ticks = Array.from({ length: 60 }, (_, i) => { const a = (i * 6 * Math.PI) / 180, r1 = i % 5 ? 88 : 82; return `<line x1="${100 + Math.sin(a) * r1}" y1="${100 - Math.cos(a) * r1}" x2="${100 + Math.sin(a) * 93}" y2="${100 - Math.cos(a) * 93}" class="${i % 5 ? "" : "big"}"/>`; }).join("");
    const nums = [12, 3, 6, 9].map((n, i) => { const a = (i * 90 * Math.PI) / 180; return `<text x="${100 + Math.sin(a) * 68}" y="${105 - Math.cos(a) * 68}">${n}</text>`; }).join("");
    const hand = (deg, len, cls) => { const a = (deg * Math.PI) / 180; return `<line x1="100" y1="100" x2="${100 + Math.sin(a) * len}" y2="${100 - Math.cos(a) * len}" class="${cls}"/>`; };
    return `<svg class="rg-clock" viewBox="0 0 200 200"><circle cx="100" cy="100" r="97" class="face"/>${ticks}${nums}${hand(h * 30, 48, "hh")}${hand(m * 6, 72, "mh")}${hand(42 * 6, 80, "sh")}<circle cx="100" cy="100" r="4.5" class="ctr"/></svg>`;
  };
  const month = () => {
    const days = ["S", "M", "T", "W", "T", "F", "S"];
    let cells = days.map((d) => `<b>${d}</b>`).join("");
    for (let i = 0; i < 30; i++) cells += `<span class="${i + 1 === 13 ? "on" : ""} ${(i % 7 === 0 || i % 7 === 6) ? "we" : ""}">${i + 1}</span>`;
    return `<div class="rg-month"><div class="mh">November 2026</div><div class="mg">${cells}</div></div>`;
  };
  const pvB = () => `
    ${pvhead("Chicago", "Central Time · UTC−6", seg(["12-hour", "24-hour"], "12-hour"))}
    <div class="rg-top">
      <div class="card rg-ck">${clock()}<div><b>2:18 PM</b><span>Friday, November 13</span></div></div>
      <div class="card rg-mo">${month()}<small>Weeks start on Sunday</small></div>
    </div>
    <div class="rg-sh"><b>How things will look</b>${dd("United States")}</div>
    <div class="card rg-files">
      ${[["image", "Holiday photo.jpg", "Today at 2:02 PM", "4.2 MB"], ["file-text", "Budget.ods", "Yesterday at 9:40 AM", "18 KB"], ["film", "Lake trip.mp4", "Nov 3, 2026", "1.3 GB"]].map(([ic, n, d, s]) => `<div class="fr">${icon(ic)}<span>${n}</span><span class="dim">${d}</span><span class="dim">${s}</span></div>`).join("")}
      <div class="fr tot">${icon("tag")}<span>Total for groceries</span><span class="dim">Week of Nov 8</span><span><b>$1,234.56</b></span></div>
    </div>
    <div class="card rg-samp">${[["Numbers", "1,234,567.89"], ["Temperature", "48 °F"], ["Distance", "3.2 miles"], ["Paper", "Letter"]].map(([k, v]) => `<div><small>${k}</small><span>${v}</span></div>`).join("")}</div>`;

  REG("region", {
    name: "Time & Language",
    summary: "Three cards of rows: Date & time (a read-only “Now”, a time zone dropdown, automatic time), Language (a locale dropdown such as en_US.utf8 and a text field for building a new locale) and This computer (the name, as a text field). It's short and correct, but the values are system codes and nothing shows what a choice will look like.",
    problems: [
      "<b>System codes for names:</b> the time zone reads “US/Central” and the language “en_US.utf8”; you choose from a list of the same codes.",
      "<b>Adding a language means typing a code:</b> the row asks for an entry “as it appears in /usr/share/i18n/SUPPORTED, e.g. de_DE.UTF-8 UTF-8”, and wraps to three lines at 800 px.",
      "<b>No picture of the choice:</b> the time zone has no map or clock, and there's no sample of dates, numbers or money in the chosen language.",
      "<b>Formats and language are one setting:</b> you can't keep English menus with day-month dates or a Monday week start; the 12- or 24-hour clock isn't here either.",
      "<b>“Now” takes a whole row</b> for a read-out, as tall as the controls under it.",
      "<b>Press Enter to save:</b> the computer's name is a plain text field with “Press Enter” in its description and no sign when it's been saved.",
    ],
    today: [["region-1280", "Today", ""], ["region-800", "Today at 800 px", ""]],
    icons: {
      lang: '<path d="M4 5h9M8.5 3v2M6 5c.5 3.5 3 6 6 7.5M11 5c-.5 3.5-3 6.5-7 8"/><path d="m12.5 20 4-9 4 9M14 17h5"/>',
      hash: '<path d="M9 3.5 7 20.5M17 3.5l-2 17M4 9h16.5M3.5 15H20"/>',
      laptop: '<rect x="5" y="5" width="14" height="10" rx="1.5"/><path d="M3 18.5h18"/>',
      mapin: '<path d="M12 21s7-6.2 7-11.5a7 7 0 0 0-14 0C5 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
    },
    options: [
      { id: "a", name: "The map and your formats", idea: "Plain names on the left: Chicago · Central Time instead of US/Central, English (US) instead of en_US.utf8, and Formats as its own choice so dates and numbers can follow another country. The right side is a world map with your time zone lit, where it's day and night, and a few other cities' times, then a card of samples (today's date, a short date, money, the first day of the week) in the formats you picked.",
        shots: [["a-map", "Map and samples", "Central Time lit; night over Europe and Asia"], ["a-map-800", "At 800 px", "The map above the controls"]] },
      { id: "b", name: "Find your city, see the clock", idea: "The left column starts with a search for a city or country and the places near you, each with its time now, so picking a time zone is picking a place. The right side shows that place's clock face, this month with the week starting where it should, and a few files and a total as they'd appear in the chosen formats. Language, formats and the computer's name are rows that open their own pages below.",
        shots: [["b-city", "Pick a city", "Places near you first, each with its time now"], ["b-city-800", "At 800 px", ""]] },
    ],
    pages: {
      "a-map": page(ctlA, pvA, 410),
      "b-city": page(ctlB, pvB, 380),
    },
  });
})();
