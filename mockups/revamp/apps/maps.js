// Nyx Maps on the revamp page: today's problems and three options.
(() => {
  const ICONS = {
    directions: '<path d="M12 2.8 21.2 12 12 21.2 2.8 12z"/><path d="M9.5 14.5v-2.5a1.5 1.5 0 0 1 1.5-1.5h4.5M13.5 8.5l2 2-2 2"/>',
    car: '<path d="M5 12.5 6.8 7.6A2.2 2.2 0 0 1 8.9 6h6.2a2.2 2.2 0 0 1 2.1 1.6l1.8 4.9"/><path d="M4 12.5h16v4a1 1 0 0 1-1 1h-1.5a1 1 0 0 1-1-1V16h-9v.5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z"/><path d="M7.5 14.3h.01M16.5 14.3h.01" stroke-width="2.4"/>',
    walk: '<circle cx="13" cy="4.5" r="1.8"/><path d="m8.5 21 2.6-6.5 2.9 2.5v4M9 11.5l2.5-3.5 3 2.5 2.5 1.2M11.1 14.5l.9-6"/>',
    bike: '<circle cx="6" cy="16" r="3.5"/><circle cx="18" cy="16" r="3.5"/><path d="M6 16l3.5-7h5.5L18 16M9.5 9l3 7H6M13.5 6h2.5"/>',
    locate: '<circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="2.4"/><path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5"/>',
    minus: '<path d="M5 12h14"/>',
    food: '<path d="M7 3v8M4.8 3v4.8a2.2 2.2 0 0 0 4.4 0V3M7 11v10M17 21V3c-2 1.5-3 4-3 7v3h3"/>',
    cart: '<circle cx="9.5" cy="19.5" r="1.4"/><circle cx="17" cy="19.5" r="1.4"/><path d="M3 4h2.5l2.2 11h10.6l2-8H6.4"/>',
    fuel: '<path d="M5 21V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v16M3.5 21h13M5 10h10M15 8l3 2.5V17a1.5 1.5 0 0 0 3 0v-7l-3-3"/>',
    ticket: '<path d="M3.5 7.5h17v3a1.8 1.8 0 0 0 0 3.6v3h-17v-3a1.8 1.8 0 0 0 0-3.6z"/><path d="M14.5 8v1.5M14.5 11.3v1.4M14.5 14.5V16"/>',
    tree: '<path d="M12 21v-5M12 3 6.5 11H9l-3.5 5h13L15 11h2.5z"/>',
    briefcase: '<rect x="3" y="7" width="18" height="13" rx="2.5"/><path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7M3 12.5h18"/>',
    swap: '<path d="M8 4v15M4.5 7.5 8 4l3.5 3.5M16 20V5M12.5 16.5 16 20l3.5-3.5"/>',
    "turn-l": '<path d="M16 20v-7a3 3 0 0 0-3-3H6"/><path d="m9.5 6.5-3.5 3.5 3.5 3.5"/>',
    "turn-r": '<path d="M8 20v-7a3 3 0 0 1 3-3h7"/><path d="m14.5 6.5 3.5 3.5-3.5 3.5"/>',
    straight: '<path d="M12 20V5M7.5 9.5 12 5l4.5 4.5"/>',
    pinfill: '<path fill="currentColor" stroke="none" d="M12 21.5s7-6.2 7-11.8a7 7 0 0 0-14 0c0 5.6 7 11.8 7 11.8z"/><circle cx="12" cy="9.7" r="2.6" fill="var(--popover)" stroke="none"/>',
  };

  /* ── The map: a made-up town drawn as SVG, coloured from the theme ─────── */
  const grid = (xs, y1, y2, ys, x1, x2) => xs.map((x) => `M${x},${y1}V${y2}`).join("") + ys.map((y) => `M${x1},${y}H${x2}`).join("");
  const minor = [
    grid([580, 600, 680, 720, 800, 840], 120, 390, [140, 180, 220, 300, 340], 560, 860),
    grid([60, 110, 160, 210, 260, 310], 450, 860, [460, 560, 600, 640, 680, 720, 760, 800], 30, 360),
    grid([720, 760, 840, 880, 920], 470, 860, [500, 540, 620, 660, 700, 740, 780], 680, 1000),
    grid([880, 920], 120, 250, [100], 860, 1010),
    "M40,90 C110,120 150,90 220,130M30,180 C100,170 140,220 210,210M60,250 C120,280 170,250 230,300M90,60 C100,140 70,240 120,330M170,40 C190,120 160,220 200,330",
    "M1100,120H1300M1100,260H1300M1110,400H1300M1150,40V560M1220,40V560",
  ].join("");
  const route = "M290,520 H360 V420 H640 V260 H760";

  const mapSvg = (o = {}) => {
    const pins = (o.pins || []).map(([x, y, n, sel]) => `<g class="mp-npin ${sel ? "sel" : ""}" transform="translate(${x} ${y})"><circle r="11"/><text y="4">${n}</text></g>`).join("");
    const t = `translate(${o.dx || 0} ${o.dy || 0})`;
    return `<svg class="mp-svg" viewBox="${o.vb || "0 0 1200 800"}" preserveAspectRatio="xMidYMid slice">
      <rect x="-600" y="-600" width="2400" height="2000" class="land"/>
      <g transform="${t}">
        <path class="blocks" d="M604,144h72v32h-72zM724,144h72v32h-72zM604,224h32v32h-32zM684,184h32v32h-32zM724,304h72v32h-72zM804,184h32v32h-32zM64,604h42v32h-42zM214,464h42v92h-42zM724,544h32v72h-32zM884,504h32v32h-32z"/>
        <path class="minor" d="${minor}"/>
        <path class="park" d="M120,600h140v120h-140zM836,262h190v150h-190zM862,104h130v-60h-130zM40,330c40-30 90-20 110,10s10,70-30,80-100-40-80-90z"/>
        <path class="parkstrip" d="M470,500 C470,600 540,700 590,830"/>
        <path class="water" d="M260,-60 C300,80 230,180 300,280 S470,420 470,540 S560,720 610,860"/>
        <ellipse class="lake" cx="930" cy="336" rx="70" ry="44"/>
        <path class="mid" d="M-300,520H360M360,420V860"/>
        <path class="case" d="M-300,420H1500M640,-300V1100M-300,760 C200,740 420,640 560,600 S800,560 1000,620"/>
        <path class="major" d="M-300,420H1500M640,-300V1100M-300,760 C200,740 420,640 560,600 S800,560 1000,620"/>
        <path class="hcase" d="M1060,-300 C1030,200 1100,420 1040,600 S1000,760 1030,1100"/>
        <path class="hwy" d="M1060,-300 C1030,200 1100,420 1040,600 S1000,760 1030,1100"/>
        ${o.route ? `<path class="rcase" d="${route}"/><path class="route" d="${route}"/>` : ""}
        <g class="lbl">
          <text x="700" y="203" class="area">OLD TOWN</text>
          <text x="150" y="455" class="area">WEST END</text>
          <text x="96" y="160" class="area">NORTH HILL</text>
          <text x="760" y="470" class="area">RIVERSIDE</text>
          <text x="930" y="340" class="wlbl">Lake Wren</text>
          <text x="190" y="664" class="plbl">Cedar Park</text>
          <text x="860" y="424" class="st">Maple Avenue</text>
          <text x="644" y="680" class="st" transform="rotate(-90 644 680)">Harbor Street</text>
          <text x="364" y="700" class="st sm" transform="rotate(-90 364 700)">Birch Street</text>
          <text x="80" y="524" class="st sm">Elm Street</text>
          <text x="226" y="742" class="st sm" transform="rotate(-6 226 742)">Old Mill Road</text>
          <text x="1110" y="360" class="area">EASTFIELD</text>
        </g>
        <g transform="translate(1054 480)"><rect x="-11" y="-9" width="22" height="18" rx="4" class="shield"/><text y="4" class="shieldt">9</text></g>
        ${o.dest ? `<g transform="translate(760 260)" class="mp-pin"><path d="M0,0c-9-11-14-17-14-24a14,14 0 0 1 28,0c0,7-5,13-14,24z"/><circle cy="-24" r="5" class="dot"/></g><text x="778" y="248" class="pinlbl">Lantern Coffee Roasters</text>` : ""}
        ${pins}
        ${o.you === false ? "" : `<circle cx="290" cy="520" r="24" class="halo"/><circle cx="290" cy="520" r="7.5" class="you"/>`}
      </g></svg>`;
  };

  const controls = (o = {}) => `
    ${o.style === false ? "" : `<div class="mp-style">${seg(["Map", "Terrain", "Satellite"], "Map")}</div>`}
    <div class="mp-ctl">${ib("locate", "Find my location")}<div class="mp-zoom">${ib("plus", "Zoom in (+)")}${ib("minus", "Zoom out (−)")}</div></div>
    <div class="mp-scale"><b></b><span>500 ft</span></div>
    <div class="mp-attr">© OpenFreeMap · © OpenStreetMap contributors</div>`;

  const steps = [
    ["straight", "Head east on Elm Street", "0.1 mi"],
    ["turn-l", "Turn left onto Birch Street", "0.2 mi"],
    ["turn-r", "Turn right onto Maple Avenue, over the river", "0.8 mi"],
    ["turn-l", "Turn left onto Harbor Street", "0.5 mi"],
    ["turn-r", "Turn right onto Front Street", "0.3 mi"],
    ["mapin", "Arrive at Lantern Coffee Roasters, on the left", ""],
  ];
  const stepRows = (n = steps.length) => steps.slice(0, n).map(([ic, t, d]) => `<div class="mp-step">${icon(ic)}<span class="t">${t}</span><span class="d">${d}</span></div>`).join("");
  const modes = (on = "Drive") => `<div class="seg mp-modes">${[["car", "Drive"], ["walk", "Walk"], ["bike", "Cycle"]].map(([ic, l]) => `<button class="${l === on ? "on" : ""}">${icon(ic)}${l}</button>`).join("")}</div>`;
  const ends = () => `<div class="mp-ends">
      <div class="mp-rail"><span class="a"></span><span class="ln"></span><span class="b">${icon("pinfill")}</span></div>
      <div class="mp-fields"><div class="field"><span>My location</span></div><div class="field"><span>Lantern Coffee Roasters</span></div></div>
      ${ib("swap", "Swap start and destination")}
    </div>`;
  const summary = () => `<div class="mp-sum"><div><b>7 min</b><span>1.9 mi · via Maple Avenue</span></div><span class="mp-fast">Fastest</span></div>`;

  const hdr = (o = {}) => (o.noSide ? (h) => h.replace(ib("sidebar", "Sidebar (Ctrl+B)"), "") : (h) => h)(header({ icon: "mapin", name: "Maps", center: o.noSearch ? "" : search(o.q || "Search places and addresses", "Ctrl F"), end: o.end !== undefined ? o.end : `<button class="newbtn ${o.dirOn ? "open" : ""}">${icon("directions")}<span>Directions</span><span class="key">Ctrl R</span></button>` }));

  /* ── Option A: a library sidebar, cards over the map ───────────────────── */
  const sideA = () => `
    ${tiles([["home", "home", "12 min", "Home", "blue"], ["work", "briefcase", "18 min", "Work", "amber"]], "")}
    ${grp("Explore nearby", true, "", "accent")}
    ${navx("food", "Food")}
    ${navx("cart", "Groceries")}
    ${navx("fuel", "Fuel")}
    ${navx("ticket", "Things to do")}
    ${navx("tree", "Parks")}
    ${grp("Saved", false, icon("plus"), "green")}
    ${navx("", "Lantern Coffee Roasters", { dot: "var(--sw-coral)", active: true })}
    ${navx("", "Harbor Market", { dot: "var(--sw-green)" })}
    ${navx("", "Wren Lake boathouse", { dot: "var(--sw-teal)" })}
    ${grp("Recent", false, `<span class="mp-clear">Clear</span>`, "violet")}
    ${navx("history", "Riverside Library")}
    ${navx("history", "42 Linden Court")}`;

  const placeCard = () => `<div class="mp-card mp-place">
    <div class="mp-ph"><div><h2>Lantern Coffee Roasters</h2><div class="mp-cat">Café · Old Town</div></div>${ib("x", "Close (Esc)")}</div>
    <div class="mp-facts"><span>${icon("car")}7 min · 1.9 mi</span><span>${icon("mapin")}118 Front Street</span></div>
    <div class="mp-acts">${btn("Directions", "primary", "directions")}<button class="btn">${icon("star")}<span>Saved</span>${icon("chev-d", "cv")}</button>${btn("Share", "", "share")}</div>
    <div class="mp-coord"><span>41.2034, −72.9147</span>${icon("copy")}</div>
  </div>`;

  const routeCard = () => `<div class="mp-card mp-route">
    <div class="mp-rh"><b>Directions</b>${ib("x", "Close (Esc)")}</div>
    ${modes()}
    ${ends()}
    ${summary()}
    <div class="mp-steps">${stepRows()}</div>
  </div>`;

  const pageA = (o = {}) => `<div class="mp-stage">${mapSvg({ dest: true, route: o.route, dx: o.route ? 200 : 0 })}${controls()}${o.route ? routeCard() : placeCard()}</div>`;

  /* ── Option B: only the map, one card that changes ─────────────────────── */
  const results = [
    ["Lantern Coffee Roasters", "Café · 118 Front Street", "0.8 mi", "Open until 6 PM"],
    ["Fieldnote Café", "Café · 31 Harbor Street", "0.6 mi", "Open until 4 PM"],
    ["Copper Kettle", "Café and bakery · 9 Mill Lane", "1.1 mi", "Closes soon"],
    ["Morning Dock", "Coffee bar · Riverside Walk", "0.4 mi", "Open until 2 PM"],
    ["Bean & Barrel", "Café · 220 Maple Avenue", "1.4 mi", "Open until 8 PM"],
  ];
  const cardSearch = (q, focus) => `<div class="mp-sf ${focus ? "focus" : ""}">${icon("search")}${q ? `<span class="q">${q}</span>${icon("x", "clr")}` : `<span class="ph">Search places and addresses</span><span class="key">Ctrl F</span>`}</div>`;
  const chipsRow = () => `<div class="mp-chips">${[["food", "Food"], ["cart", "Groceries"], ["fuel", "Fuel"], ["ticket", "Things to do"], ["tree", "Parks"]].map(([ic, l]) => chip(l, "", ic)).join("")}</div>`;

  const bHome = () => `<div class="mp-card mp-b">
    ${cardSearch("")}
    <div class="mp-quick"><div class="mp-qb">${icon("home")}<div><b>Home</b><span>12 min</span></div></div><div class="mp-qb">${icon("briefcase")}<div><b>Work</b><span>18 min</span></div></div><div class="mp-qb">${icon("directions")}<div><b>Directions</b><span>Ctrl R</span></div></div></div>
    <div class="mp-sec">Explore nearby</div>
    ${chipsRow()}
    <div class="mp-sec">Saved<span class="act">${icon("plus")}</span></div>
    ${[["Lantern Coffee Roasters", "118 Front Street", "var(--sw-coral)"], ["Harbor Market", "4 Pier Road", "var(--sw-green)"], ["Wren Lake boathouse", "Lake Wren Park", "var(--sw-teal)"]].map(([n, a, c]) => `<div class="mp-row"><span class="mp-dot" style="background:${c}">${icon("star")}</span><div><b>${n}</b><span>${a}</span></div></div>`).join("")}
    <div class="mp-sec">Recent<span class="act mp-clear">Clear</span></div>
    ${[["Riverside Library", "Searched yesterday"], ["42 Linden Court", "Searched Monday"]].map(([n, a]) => `<div class="mp-row"><span class="mp-dot r">${icon("history")}</span><div><b>${n}</b><span>${a}</span></div></div>`).join("")}
  </div>`;

  const bSearch = () => `<div class="mp-card mp-b">
    ${cardSearch("coffee", true)}
    ${chipsRow()}
    <div class="mp-rhead">5 places near Old Town</div>
    ${results.map(([n, a, d, h], i) => `<div class="mp-res ${i === 0 ? "sel" : ""}"><span class="mp-num">${i + 1}</span><div class="tx"><div class="r1"><b>${n}</b><span class="d">${d}</span></div><span>${a}</span><span class="h ${h === "Closes soon" ? "warn" : ""}">${h}</span></div></div>`).join("")}
  </div>`;

  const bRoute = () => `<div class="mp-card mp-b mp-sheet">
    <div class="mp-rh"><b>Directions</b><span class="sp"></span>${modes()}${ib("x", "Close (Esc)")}</div>
    <div class="mp-sheetcols"><div>${ends()}${summary()}</div><div class="mp-steps">${stepRows(4)}<div class="mp-more">2 more steps</div></div></div>
  </div>`;

  const pinsB = [[760, 260, 1, true], [668, 320, 2], [820, 168, 3], [540, 470, 4], [760, 560, 5]];

  /* ── Option C: library on the left, details on the right ──────────────── */
  const sideC = () => `
    ${grp("Go", true, "", "accent")}
    ${navx("home", "Home", { sub: "12 min" })}
    ${navx("briefcase", "Work", { sub: "18 min" })}
    ${grp("Saved", false, icon("plus"), "green")}
    ${navx("", "Lantern Coffee Roasters", { dot: "var(--sw-coral)", sub: "0.8 mi", active: true })}
    ${navx("", "Harbor Market", { dot: "var(--sw-green)", sub: "1.2 mi" })}
    ${navx("", "Wren Lake boathouse", { dot: "var(--sw-teal)", sub: "1.6 mi" })}
    ${navx("", "Dr. Ames, dentist", { dot: "var(--sw-violet)", sub: "3.1 mi" })}
    ${grp("Recent", false, `<span class="mp-clear">Clear</span>`, "violet")}
    ${navx("history", "Riverside Library")}
    ${navx("history", "42 Linden Court")}
    ${grp("Explore nearby", false, "", "amber")}
    <div class="mp-near hide-narrow">${[["food", "Food"], ["cart", "Groceries"], ["fuel", "Fuel"], ["ticket", "Things to do"], ["tree", "Parks"]].map(([ic, l]) => chip(l, "", ic)).join("")}</div>
    <div class="foot">${icon("locate")}<span>Located 2 min ago · ±20 m</span></div>`;

  const inspPlace = () => `<div class="insp mp-insp">
    <div class="mp-ihero">${mapSvg({ dest: true, you: false, vb: "600 170 300 150" })}</div>
    <div class="ibody">
      <h2 class="mp-ih">Lantern Coffee Roasters</h2>
      <div class="mp-cat">Café · Old Town</div>
      <div class="mp-iacts">${btn("Directions", "primary", "directions")}${btn("Share", "", "share")}</div>
      <div class="lab">Save as</div>
      <div class="seg mp-saveas"><button class="on">${icon("star")}Favorite</button><button>${icon("home")}Home</button><button>${icon("briefcase")}Work</button></div>
      <div class="lab">Details</div>
      <div class="card">
        <div class="row">${icon("mapin")}<span class="k">118 Front Street, Old Town</span></div>
        <div class="row">${icon("car")}<span class="k">7 min drive · 1.9 mi</span></div>
        <div class="row">${icon("compass")}<span class="k">41.2034, −72.9147</span>${icon("copy", "mp-cp")}</div>
      </div>
    </div></div>`;

  const inspRoute = () => `<div class="insp mp-insp">
    <div class="ihead mp-irh"><b>Directions</b><span class="sp"></span>${ib("x", "Close (Esc)")}</div>
    <div class="ibody">
      ${modes()}
      ${ends()}
      ${summary()}
      <div class="mp-steps">${stepRows()}</div>
    </div></div>`;

  const pageC = (o = {}) => `<div class="cols"><div class="main mp-stage">${mapSvg({ dest: true, route: o.route })}${controls()}</div>${o.route ? inspRoute() : inspPlace()}</div>`;

  REG("maps", {
    name: "Maps",
    icons: ICONS,
    summary: "Maps has search, saved places and turn-by-turn directions, but most of it hides in a side panel that starts closed, the header is a row of loose controls, and when the map tiles don't load there's only an empty grey sheet.",
    problems: [
      "<b>An empty sheet when tiles don't load:</b> no map, no message and no way to retry, just a lone pin in the dark.",
      "<b>Everything useful starts hidden:</b> saved places, recent searches, Home and Work live in a side panel that's closed when Maps opens.",
      "<b>Three ways into Directions:</b> a header icon, a Places/Directions switch at the top of the panel, and a Route chip inside it, each looking different.",
      "<b>The header is loose parts:</b> raw coordinates (33.1029, −86.7536), a “Standard ▾” text button, then directions and locate as bare icons; at 800 px the search box is cut to “Search places, addresses or coo…”.",
      "<b>Explore nearby is five bare icons</b> (food, groceries, fuel, entertainment, parks) that only say what they are on hover.",
      "<b>Text glyphs instead of icons:</b> “★ Save ▾”, “⌂ Set as Home”, “💼 Set as Work”; swapping start and destination uses the refresh icon.",
      "<b>Map style is a header menu</b> far from the map it changes, while zoom sits on the map and locate in the header.",
    ],
    today: [["maps-1280", "Today at 1280 px", "The map tiles failed to load: an empty sheet"], ["maps-800", "Today at 800 px", "Tiles loaded; search cut off, panel closed"]],
    options: [
      { id: "a", name: "Library sidebar, cards on the map", idea: "The shared Design 2.0 sidebar is always there: Home and Work as tiles with their travel time, Explore nearby as labelled rows, then Saved and Recent under coloured headings. Picking a place opens a card over the map with labelled Directions, Save and Share; Directions turns the card into the route, with the swap button and every turn. Map style, locate and zoom all sit on the map.",
        shots: [["a-place", "A saved place", "Library sidebar; the place as a card on the map"], ["a-route", "Directions", "The card becomes the route"], ["a-place-800", "At 800 px", "Icon rail with coloured bars; the card stays"]] },
      { id: "b", name: "Just the map, one card", idea: "No sidebar: the map fills the window and one card in its corner does everything, like Maps on a phone. Idle, it shows search, Home, Work, Directions, the nearby chips, Saved and Recent; typing turns it into numbered results that match the pins; a route turns it into directions. At 800 px the card docks along the bottom so the route stays in view.",
        shots: [["b-home", "Opening Maps", "Search, Home and Work, nearby, saved and recent"], ["b-search", "Searching", "Numbered results match the pins"], ["b-route-800", "Directions at 800 px", "The card docks to the bottom"]] },
      { id: "c", name: "Library and inspector", idea: "For planning on a big screen: the library on the left (Home, Work, Saved, Recent, Explore nearby), the map in the middle, and the place or route in an inspector on the right. Save as Favorite, Home or Work is one visible choice instead of a menu, and the coordinates live with the place, with a copy button, instead of in the header.",
        shots: [["c-place", "A place", "Save as Favorite, Home or Work in view"], ["c-route", "Directions", "Every turn in the inspector"]] },
    ],
    pages: {
      "a-place": () => win({ hdr: hdr(), side: sideA(), page: pageA() }),
      "a-route": () => win({ hdr: hdr({ dirOn: true }), side: sideA(), page: pageA({ route: true }) }),
      "b-home": () => win({ hdr: hdr({ noSearch: true, noSide: true, end: "" }), side: "", page: `<div class="mp-stage">${mapSvg({ dx: 120 })}${controls()}${bHome()}</div>` }),
      "b-search": () => win({ hdr: hdr({ noSearch: true, noSide: true, end: "" }), side: "", page: `<div class="mp-stage">${mapSvg({ pins: pinsB, dx: 120 })}${controls()}${bSearch()}</div>` }),
      "b-route": () => win({ hdr: hdr({ noSearch: true, noSide: true, end: "" }), side: "", page: `<div class="mp-stage">${mapSvg({ dest: true, route: true, dy: -150 })}${controls({ style: true })}${bRoute()}</div>` }),
      "c-place": () => win({ hdr: hdr(), side: sideC(), page: pageC() }),
      "c-route": () => win({ hdr: hdr({ dirOn: true }), side: sideC(), page: pageC({ route: true }) }),
    },
  });
})();
