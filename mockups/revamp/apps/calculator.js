// Nyx Calculator on the revamp page: today's problems and two options.
(() => {
  const ICONS = {
    calc: '<rect x="5" y="3" width="14" height="18" rx="2.5"/><path d="M8.5 7h7"/><path d="M8.7 11.5h.01M12 11.5h.01M15.3 11.5h.01M8.7 15h.01M12 15h.01M15.3 15h.01M8.7 18h.01M12 18h.01M15.3 18h.01" stroke-width="2"/>',
    fx: '<path d="M10 20.5c2 0 2.6-1.5 3-4l2-10c.4-2 1.2-3 3-3M7.5 10h9"/>',
    binary: '<path d="M7 4v6M5.5 4H7M5.5 10h3M15 4a2 2 0 0 1 2 2v2a2 2 0 0 1-4 0V6a2 2 0 0 1 2-2zM7 14a2 2 0 0 1 2 2v2a2 2 0 0 1-4 0v-2a2 2 0 0 1 2-2zM17 14v6M15.5 14H17M15.5 20h3"/>',
    convert: '<path d="M4 7.5h14M14.5 4 18 7.5 14.5 11M20 16.5H6M9.5 13 6 16.5 9.5 20"/>',
    sheet: '<rect x="4" y="3.5" width="16" height="17" rx="2.5"/><path d="M8 8.5h5M8 12h4M8 15.5h6M16 8.5h.01M16 12h.01M16 15.5h.01" />',
    plot: '<path d="M4 4v16h16"/><path d="M6.5 16c2.5-9 5-9 7 0s3.5 3 5-6"/>',
    backspace: '<path d="M8.5 5H19a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H8.5L3 12z"/><path d="m11 9.5 5 5M16 9.5l-5 5"/>',
  };
  const noSideBtn = (h) => h.replace(ib("sidebar", "Sidebar (Ctrl+B)"), "");

  const KEYS = [
    [["%", "fn"], ["CE", "fn"], ["C", "fn"], ["⌫", "fn bs"]],
    [["1/x", "fn"], ["x²", "fn"], ["√x", "fn"], ["÷", "op"]],
    [["7"], ["8"], ["9"], ["×", "op"]],
    [["4"], ["5"], ["6"], ["−", "op"]],
    [["1"], ["2"], ["3"], ["+", "op"]],
    [["±"], ["0"], ["."], ["=", "eq"]],
  ];
  const keypad = () => `<div class="cl-keys">${KEYS.flat().map(([k, c = ""]) => `<button class="cl-k ${c}">${k === "⌫" ? icon("backspace") : k}</button>`).join("")}</div>`;
  const display = (o = {}) => `<div class="cl-disp">
    <div class="cl-expr">${o.expr || "1,250 × 1.0825 + 48"}</div>
    <div class="cl-res">${o.res || "1,401.13"}</div>
  </div>`;
  const memRow = (set) => `<div class="cl-mem">${set ? `<span class="cl-mtag">M <b>1,250</b></span>${btn("MR", "ghost sm")}${btn("MC", "ghost sm")}` : `<span class="cl-mnone">Memory is empty</span>`}<span class="sp"></span>${btn("M+", "ghost sm")}${btn("M−", "ghost sm")}${btn("MS", "ghost sm")}</div>`;

  const HIST = [
    ["2,400 ÷ 3", "800", true, "Rent split"],
    ["1,250 × 1.0825 + 48", "1,401.13"],
    ["18% of 64.50", "11.61"],
    ["(42 + 17.5) × 12", "714"],
    ["√2 × 300", "424.26"],
    ["3.2 ÷ 0.4", "8"],
  ];
  const histPanel = () => `<div class="insp cl-hist">
    <div class="ihead cl-hh"><b>History</b><span class="sp"></span>${btn("Clear", "ghost sm")}</div>
    <div class="cl-hs">${search("Search calculations", "")}</div>
    <div class="ibody">
      <div class="lab">Pinned</div>
      ${HIST.filter((h) => h[2]).map(([e, r, , n]) => `<div class="cl-h pin"><div><span class="nm">${n}</span><span class="e">${e}</span><b>= ${r}</b></div>${icon("pin", "pn")}</div>`).join("")}
      <div class="lab">Today</div>
      ${HIST.filter((h) => !h[2]).map(([e, r], i) => `<div class="cl-h ${i === 0 ? "hov" : ""}"><div><span class="e">${e}</span><b>= ${r}</b></div>${i === 0 ? `<span class="acts">${ib("pin", "Pin to top")}${ib("copy", "Copy result")}</span>` : ""}</div>`).join("")}
    </div></div>`;

  /* ── Option A: one window with the modes in a sidebar ──────────────────── */
  const sideA = (on) => `
    ${grp("Calculate", true, "", "accent")}
    ${navx("calc", "Standard", { active: on === "std", sub: "Alt 1" })}
    ${navx("fx", "Scientific", { sub: "Alt 2" })}
    ${navx("binary", "Programmer", { sub: "Alt 3" })}
    ${grp("Tools", false, "", "green")}
    ${navx("convert", "Unit converter", { sub: "Alt 4" })}
    ${navx("sheet", "Sheets", { active: on === "sheets", sub: "Alt 5" })}
    ${navx("plot", "Graph", { sub: "Alt 6" })}
    ${grp("Sheets", false, icon("plus"), "amber")}
    ${navx("", "Trip budget", { dot: "var(--sw-coral)", active: on === "trip" })}
    ${navx("", "Kitchen remodel", { dot: "var(--sw-teal)" })}
    ${navx("", "Freelance rates", { dot: "var(--sw-violet)" })}`;

  const hdrA = (o = {}) => header({ icon: "calc", name: "Calculator", center: "", end: `<button class="newbtn ${o.hist ? "open" : ""}">${icon("history")}<span>History</span><span class="key">Ctrl H</span></button>` });

  const stdPage = (o = {}) => `<div class="cols"><div class="main cl-std">
      ${display()}
      ${memRow(o.mem !== false)}
      ${keypad()}
    </div>${o.hist ? histPanel() : ""}</div>`;

  const SHEET = [
    ["flights = 2 × $318", "$636.00"],
    ["hotel = 4 nights × $142", "$568.00"],
    ["food = $55 × 5 days", "$275.00"],
    ["", ""],
    ["flights + hotel + food", "$1,479.00"],
    ["prev + 8% tax", "$1,597.32"],
    ["prev split between 3", "$532.44"],
    ["", ""],
    ["# Getting there", "", "h"],
    ["210 miles in km", "337.96 km"],
    ["210 miles ÷ 31 mpg × $3.40", "$23.03"],
    ["15% of $1,479", "$221.85"],
    ["72 fahrenheit to celsius", "22.22 °C"],
  ];
  const sheetPage = () => `${pbar2("Trip budget", "Saved 2 min ago", btn("Copy all", "ghost", "copy") + btn("New sheet", "", "plus") + ib("more", "Rename, export or delete"))}
    <div class="cl-sheet">
      <div class="cl-lines">${SHEET.map(([t, r, k], i) => `<div class="cl-ln ${k || ""} ${i === 6 ? "cur" : ""}"><span class="no">${i + 1}</span><span class="src">${t.replace(/(flights|hotel|food)(?= =)/, '<span class="var">$1</span>').replace(/\bprev\b/, '<span class="ref">prev</span>')}${i === 6 ? '<span class="caret"></span>' : ""}</span><span class="out">${r}</span></div>`).join("")}</div>
      <div class="cl-tip">${icon("info")}<span>Write sums the way you'd say them: <code>15% of 249</code>, <code>5 miles in km</code>, <code>$250 split between 4</code>. Name a line with <code>=</code>, or use <code>prev</code> and <code>$2</code> for earlier lines.</span></div>
    </div>`;

  /* ── Option B: a small floating calculator ─────────────────────────────── */
  // The desktop behind it; `busy` adds another app's window, dimmed while a tool panel is open.
  const desk = (inner, o = {}) => `<div class="cl-desk"><div class="cl-bar"><span class="ws"><b>1</b><i></i><i></i><i></i></span><span class="sp"></span><span>Thu 12 Nov  20:09</span></div>${o.busy ? `<div class="cl-bgwin"><div class="h"><i></i><span></span></div><div class="b">${Array.from({ length: 14 }, (_, i) => `<span style="width:${30 + ((i * 37) % 60)}%"></span>`).join("")}</div></div><div class="cl-veil"></div>` : ""}${inner}</div>`;
  const fl = (x, y, w, h, html, cls = "") => `<div class="cl-fl ${cls}" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px">${html}</div>`;

  const calcHdr = (o = {}) => noSideBtn(header({ icon: "calc", name: "", start: `<button class="cl-mode ${o.menu ? "open" : ""}">${o.mode || "Standard"}${icon("chev-d")}</button>`, end: (o.tool ? ib(o.tool, "Hide the tool (Esc)", "on cl-tool") : "") + ib("history", "History (Ctrl H)", o.hist ? "on" : "") }));
  const smallCalc = (o = {}) => win({
    hdr: calcHdr(o),
    side: "",
    page: `<div class="cols"><div class="main cl-std sm">${display(o)}${memRow(o.mem)}${keypad()}</div>${o.hist ? `<div class="cl-mini">${histPanel()}</div>` : ""}</div>`,
  });

  const SCI = [
    [["sin", "fn"], ["cos", "fn"], ["tan", "fn"], ["π", "fn"], ["C", "fn"], ["⌫", "fn bs"]],
    [["asin", "fn"], ["acos", "fn"], ["atan", "fn"], ["e", "fn"], ["(", "fn"], [")", "fn"]],
    [["sinh", "fn"], ["cosh", "fn"], ["tanh", "fn"], ["τ", "fn"], ["xʸ", "fn"], ["÷", "op"]],
    [["ln", "fn"], ["log", "fn"], ["7"], ["8"], ["9"], ["×", "op"]],
    [["√x", "fn"], ["∛x", "fn"], ["4"], ["5"], ["6"], ["−", "op"]],
    [["n!", "fn"], ["1/x", "fn"], ["1"], ["2"], ["3"], ["+", "op"]],
    [["abs", "fn"], ["EXP", "fn"], ["±"], ["0"], ["."], ["=", "eq"]],
  ];
  const PROG = [
    [["AND", "fn"], ["OR", "fn"], ["NOT", "fn"], ["XOR", "fn"], ["C", "fn"], ["⌫", "fn bs"]],
    [["LSH", "fn"], ["RSH", "fn"], ["mod", "fn"], ["(", "fn"], [")", "fn"], ["÷", "op"]],
    [["A", "hx"], ["B", "hx"], ["7"], ["8"], ["9"], ["×", "op"]],
    [["C", "hx"], ["D", "hx"], ["4"], ["5"], ["6"], ["−", "op"]],
    [["E", "hx"], ["F", "hx"], ["1"], ["2"], ["3"], ["+", "op"]],
    [["CE", "fn"], ["±"], ["0", "w3"], ["=", "eq"]],
  ];
  const pad6 = (rows) => `<div class="cl-keys c6">${rows.flat().map(([k, c = ""]) => `<button class="cl-k ${c}">${k === "⌫" ? icon("backspace") : k}</button>`).join("")}</div>`;

  const sciCalc = (o = {}) => win({
    hdr: calcHdr({ ...o, mode: "Scientific" }),
    side: "",
    page: `<div class="main cl-std cl-sci">${display({ expr: "2 × π × 6.5", res: "40.8407045" })}
      <div class="cl-mem">${seg(["Deg", "Rad"], "Deg")}<span class="sp"></span><span class="cl-mnone">Memory is empty</span><span class="cl-gap"></span>${btn("M+", "ghost sm")}${btn("M−", "ghost sm")}${btn("MS", "ghost sm")}</div>
      ${pad6(SCI)}</div>`,
  });

  const BITS = "1011111011101111".padStart(64, "0");
  const bitRows = () => [0, 1, 2, 3].map((r) => `<div class="cl-bits">${[0, 1, 2, 3].map((n) => `<span class="nib">${[0, 1, 2, 3].map((b) => { const v = BITS[r * 16 + n * 4 + b]; return `<b class="${v === "1" ? "on" : ""}">${v}</b>`; }).join("")}</span>`).join("")}<span class="pos">${48 - r * 16}</span></div>`).join("");
  const progCalc = () => win({
    hdr: calcHdr({ mode: "Programmer" }),
    side: "",
    page: `<div class="main cl-std cl-prog">
      <div class="cl-pexpr">BE00 OR EF</div>
      <div class="cl-radix">${[["HEX", "BEEF", true], ["DEC", "48,879"], ["OCT", "137 357"], ["BIN", "1011 1110 1110 1111"]].map(([t, v, on]) => `<div class="cl-rx ${on ? "on" : ""}"><span class="t">${t}</span><span class="v">${v}</span></div>`).join("")}</div>
      <div class="cl-pctl">${dd("64-bit")}${dd("Signed")}<span class="sp"></span><span class="cl-mnone">Click a bit to flip it</span></div>
      <div class="cl-bitgrid">${bitRows()}</div>
      ${pad6(PROG)}</div>`,
  });

  const modeMenu = () => menu(48, 40, [
    ["#", "Keypad"],
    ["check", "Standard", "Alt 1", "check"],
    ["fx", "Scientific", "Alt 2"],
    ["binary", "Programmer", "Alt 3"],
    "-",
    ["#", "Opens beside the calculator"],
    ["convert", "Unit converter", "Alt 4"],
    ["sheet", "Sheets", "Alt 5"],
    ["plot", "Graph", "Alt 6"],
  ], 236);

  // A tool's pop-up panel: its own header with a close button, no sidebar or settings.
  const popHdr = (ic, name, o = {}) => header({ icon: ic, name, start: o.start || "", end: (o.end || "") + ib("close", "Close (Esc)", "cl-x") }).replace(ib("sidebar", "Sidebar (Ctrl+B)"), "").replace(ib("sliders", "Settings (Ctrl+,)"), "").replace('<span class="gap"></span>', "");

  const W = 540, H = 580, X0 = -5.4, X1 = 5.4, Y0 = -3.5, Y1 = 3.5;
  const sx = (x) => ((x - X0) / (X1 - X0)) * W, sy = (y) => H - ((y - Y0) / (Y1 - Y0)) * H;
  const path = (f, a = X0, b = X1, n = 240) => Array.from({ length: n + 1 }, (_, i) => { const x = a + ((b - a) * i) / n; return `${i ? "L" : "M"}${sx(x).toFixed(1)},${sy(f(x)).toFixed(1)}`; }).join("");
  const graphSvg = () => {
    const gl = [];
    for (let x = Math.ceil(X0); x <= X1; x++) gl.push(`<path class="${x === 0 ? "ax" : "gl"}" d="M${sx(x)},0V${H}"/>`);
    for (let y = Math.ceil(Y0); y <= Y1; y++) gl.push(`<path class="${y === 0 ? "ax" : "gl"}" d="M0,${sy(y)}H${W}"/>`);
    const nums = [-4, -2, 2, 4].map((x) => `<text x="${sx(x)}" y="${sy(0) + 16}" class="tk">${x}</text>`).join("") + [-3, -2, -1, 1, 2, 3].map((y) => `<text x="${sx(0) - 8}" y="${sy(y) + 4}" class="tk r">${y}</text>`).join("");
    const area = `${path(Math.sin, 0, Math.PI, 60)}L${sx(Math.PI)},${sy(0)}L${sx(0)},${sy(0)}Z`;
    const roots = [-2 * Math.PI, -Math.PI, 0, Math.PI, 2 * Math.PI].map((x) => `<circle cx="${sx(x)}" cy="${sy(0)}" r="4" class="rt b"/>`).join("") + [-2, 2].map((x) => `<circle cx="${sx(x)}" cy="${sy(0)}" r="4" class="rt c"/>`).join("");
    const ext = [-1.5, -0.5, 0.5, 1.5].map((k) => k * Math.PI).filter((x) => x > X0 && x < X1).map((x) => `<circle cx="${sx(x)}" cy="${sy(Math.sin(x))}" r="4" class="ex"/>`).join("") + `<circle cx="${sx(0)}" cy="${sy(-1)}" r="4" class="ex c"/>`;
    return `<svg class="cl-g" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice">${gl.join("")}${nums}
      <path d="${area}" class="area"/>
      <path d="${path((x) => Math.cos(x))}" class="dv"/>
      <path d="${path(Math.sin)}" class="cv b"/>
      <path d="${path((x) => (x * x) / 4 - 1, -4.8, 4.8)}" class="cv c"/>
      ${roots}${ext}
      <path d="M${sx(Math.PI / 2)},${sy(1)}V${sy(0)}" class="xh"/>
      <g transform="translate(${sx(Math.PI / 2) + 10} ${sy(1) - 34})"><rect width="118" height="26" rx="6" class="tip"/><text x="10" y="17" class="tipt">max (1.571, 1)</text></g>
    </svg>`;
  };
  const FNS = () => `<div class="cl-fn on" style="--fc: var(--sw-blue)"><span class="sw"></span><code>f(x) = sin(x)</code><span class="dvb on">f′</span></div>
        <div class="cl-fn" style="--fc: var(--sw-coral)"><span class="sw"></span><code>g(x) = x²/4 − 1</code><span class="dvb">g′</span></div>`;
  const SHOW = () => `${chip("Roots", "on", "check")}${chip("Highs and lows", "on", "check")}${chip("Area under f", "on", "check")}`;
  const plot = () => `<div class="cl-gm">${graphSvg()}<div class="cl-gz">${ib("plus", "Zoom in")}${ib("refresh", "Reset the view")}</div></div>`;
  const graphPanel = (o = {}) => win({
    hdr: popHdr("plot", "Graph", { end: o.narrow ? ib("copy", "Copy image") : btn("Copy image", "ghost", "copy") }),
    side: "",
    page: o.narrow
      ? `<div class="main cl-gn">
          <div class="cl-gnt">${FNS()}<div class="cl-add">${icon("plus")}Add a function</div></div>
          <div class="cl-tg">${SHOW()}</div>
          ${plot()}
          <div class="cl-gnr"><span>Area under f, 0 to π</span><b>2.0000</b><span class="dot">·</span><span>Roots of g</span><b>−2, 2</b></div>
        </div>`
      : `<div class="cols"><div class="list cl-fns">
        <div class="cl-fh">Functions</div>
        ${FNS()}
        <div class="cl-add">${icon("plus")}Add a function</div>
        <div class="cl-fh">Show</div>
        <div class="cl-tg">${SHOW()}</div>
        <div class="cl-ar"><span>Area from</span><div class="field"><span>0</span></div><span>to</span><div class="field"><span>π</span></div></div>
        <div class="cl-res2"><span>Area under f</span><b>2.0000</b><span>Roots of g</span><b>−2, 2</b></div>
      </div><div class="main">${plot()}</div></div>`,
  });

  const sheetPanel = () => win({
    hdr: popHdr("sheet", "Sheets", { start: `<button class="cl-mode">Trip budget${icon("chev-d")}</button>`, end: btn("Copy all", "ghost", "copy") + ib("plus", "New sheet (Ctrl N)") + ib("more", "Rename, export or delete") }),
    side: "",
    page: `<div class="cl-sheet">
      <div class="cl-lines">${SHEET.map(([t, r, k], i) => `<div class="cl-ln ${k || ""} ${i === 6 ? "cur" : ""}"><span class="no">${i + 1}</span><span class="src">${t.replace(/(flights|hotel|food)(?= =)/, '<span class="var">$1</span>').replace(/\bprev\b/, '<span class="ref">prev</span>')}${i === 6 ? '<span class="caret"></span>' : ""}</span><span class="out">${r}</span></div>`).join("")}</div>
      <div class="cl-tip">${icon("info")}<span>Write sums the way you'd say them: <code>15% of 249</code>, <code>5 miles in km</code>. Name a line with <code>=</code>, or use <code>prev</code> for the line above.</span></div>
    </div>`,
  });

  const convPanel = () => win({
    hdr: popHdr("convert", "Unit converter"),
    side: "",
    page: `<div class="cl-cv">
      <div class="cl-cvk">${["Length", "Weight", "Temperature", "More"].map((k, i) => `<span class="cl-kind ${i === 0 ? "on" : ""}">${k}${i === 3 ? icon("chev-d") : ""}</span>`).join("")}</div>
      <div class="cl-cvc"><div class="hd"><span>From</span>${dd("Miles")}</div><div class="val">26.2<span class="caret"></span></div></div>
      <div class="cl-swap"><button class="ib" title="Swap (Ctrl S)">${icon("convert")}</button></div>
      <div class="cl-cvc to"><div class="hd"><span>To</span>${dd("Kilometers")}</div><div class="val">42.16<small>km</small><span class="sp"></span>${ib("copy", "Copy")}</div></div>
      <div class="cl-cvf">1 mile = 1.609 km</div>
      <div class="cl-cvr"><span>Recent</span>${chip("°F to °C")}${chip("lb to kg")}${chip("cups to ml")}</div>
    </div>`,
  });

  REG("calculator", {
    name: "Calculator",
    icons: ICONS,
    summary: "Calculator packs six tools (standard, scientific, programmer, units, natural-language sheets and graphs) behind one “Standard ▾” text button, in a window that changes size each time you switch.",
    problems: [
      "<b>Six tools behind a text button:</b> the only way between modes is “Standard ▾” (or Alt 1–6); nothing shows that sheets and graphs exist.",
      "<b>The window jumps in size:</b> from 360 px wide for Standard to 780 px for Graph, and 280 px more when History opens, so it moves under the pointer.",
      "<b>Two very different kinds of tool share one window:</b> a small keypad and full-size editors (sheets, graphs) that need room, so neither fits well when tiled at 800 px.",
      "<b>Memory keys that can't work are shown:</b> MC and MR stay in the row, greyed, when nothing is stored; the stored number shows only as a small “M”.",
      "<b>Sheets' toolbar is four bare icons</b> (rename, new, copy all, delete) next to a dropdown that holds every sheet.",
      "<b>Everything is in a monospace font,</b> keypad labels and menus included, so it doesn't look like the other Nyx apps.",
      "<b>History has no empty state or pinned section</b> to speak of: pins sit in the list, with only a pin icon to tell them apart.",
    ],
    today: [],
    todayNote: "No screenshot: Calculator has no test app ID yet, so a test copy can't run beside your own. The problems come from its code.",
    options: [
      { id: "a", name: "One window, modes in a sidebar", idea: "Calculator becomes a normal Nyx window that tiles well. The sidebar lists the keypads (Standard, Scientific, Programmer) and the tools (Unit converter, Sheets, Graph), with your sheets under their own heading so they're one click away. History is an inspector you open with a labelled button, with pinned sums on top. The memory row only offers what can work.",
        shots: [["a-standard", "Standard with history", "Modes in the sidebar, history beside"], ["a-sheets", "A sheet", "Results line up beside each line"], ["a-standard-800", "At 800 px", "Icon rail; memory empty, so no MR or MC"]] },
      { id: "b", name: "Small calculator, big tools apart", idea: "Keeps the quick floating calculator. Standard is a small window that never changes size. Scientific and Programmer get the bigger windows they had before (500 × 580 and 580 × 660), so their six-column keypads have room. Unit converter, Sheets and Graph open as a pop-up panel beside the calculator, lined up with its top edge, with their own header and close button; they never tile, and Esc or the calculator's tool button puts them away. The menu says which is which. History slides out beside the keypad.",
        shots: [
          ["b-standard", "The mode menu", "Keypads switch here; tools open beside it"],
          ["b-scientific", "Scientific, 500 × 580", "The old size: six columns, keys with room"],
          ["b-programmer", "Programmer, 580 × 660", "Every base, the bits and A–F with room"],
          ["b-graph", "Graph beside the calculator", "A pop-up panel lined up with its top edge"],
          ["b-sheets", "Sheets beside the calculator", "Pick a sheet in the panel's header"],
          ["b-converter", "Unit converter beside Scientific", "Tools sit beside any keypad, sized to fit"],
          ["b-graph-800", "On an 800 px screen", "No room on the right, so it opens on the left"],
        ] },
    ],
    pages: {
      "a-standard": () => win({ hdr: hdrA({ hist: !NARROW }), side: sideA("std"), page: stdPage({ hist: !NARROW, mem: !NARROW }) }),
      "a-sheets": () => win({ hdr: hdrA(), side: sideA("trip"), page: sheetPage() }),
      "b-standard": () => desk(fl(460, 113, 360, 600, smallCalc({ menu: true, mem: true }) + modeMenu())),
      "b-scientific": () => desk(fl(390, 123, 500, 580, sciCalc())),
      "b-programmer": () => desk(fl(350, 83, 580, 660, progCalc())),
      "b-graph": () => NARROW
        ? desk(fl(420, 100, 360, 600, smallCalc({ tool: "plot", expr: "sin(π ÷ 2)", res: "1" })) + fl(20, 100, 390, 600, graphPanel({ narrow: true }), "pop"), { busy: true })
        : desk(fl(85, 100, 360, 600, smallCalc({ tool: "plot", expr: "sin(π ÷ 2)", res: "1" })) + fl(455, 100, 740, 600, graphPanel(), "pop"), { busy: true }),
      "b-sheets": () => desk(fl(105, 100, 360, 600, smallCalc({ tool: "sheet", expr: "1,479 × 1.08 ÷ 3", res: "532.44" })) + fl(475, 100, 700, 600, sheetPanel(), "pop"), { busy: true }),
      "b-converter": () => desk(fl(185, 110, 500, 580, sciCalc({ tool: "convert" })) + fl(695, 110, 400, 420, convPanel(), "pop"), { busy: true }),
    },
  });
})();
