// Personalization › Night Light (hyprsunset): warmth now, and a schedule.
(() => {
  const S = "personalization";
  const KT = [[2500, "255,159,70"], [3000, "255,180,107"], [3500, "255,196,137"], [4000, "255,209,163"], [4500, "255,219,186"], [5000, "255,228,206"], [5500, "255,236,224"], [6000, "255,243,239"], [6500, "255,249,253"]];
  const kc = (k) => `rgb(${(KT.find((t) => t[0] >= k) || KT[8])[1]})`;
  const vars = "--d-bg:#1a1b26;--d-win:#24283b;--d-acc:#7aa2f7;--d-txt:#c0caf5;--d-a2:#bb9af7;--d-a3:#9ece6a;--d-wall:linear-gradient(150deg, color-mix(in srgb, #2ac3de 45%, #1a1b26), color-mix(in srgb, #7aa2f7 30%, #1a1b26) 55%, #1a1b26)";
  const desk = (cls = "") => `<div class="n1-desk ${cls}" style="${vars}">
    <div class="dbar"><span class="ws"><b class="on"></b><b></b><b></b><b></b></span><span class="clk">Fri 21:30</span><span class="tray">${icon("wifi")}${icon("moon")}${icon("volume")}${icon("battery")}</span></div>
    <div class="dw wl"><div class="dwh"><i></i><i></i><i></i></div><div class="dapp"><div class="dside"><b class="on"></b><b></b><b></b><b></b></div><div class="dmain"><span class="l w70"></span><span class="l w50 dim"></span><span class="nl-photo"></span><span class="row"></span><span class="row"></span></div></div></div>
    <div class="dw wt"><div class="dwh"><i></i><i></i><i></i></div><div class="dterm"><span><b class="c1"></b><b class="w40"></b></span><span><b class="c2"></b><b class="w60"></b></span><span><b class="c3"></b><b class="w30"></b></span><span><b class="c1"></b><b class="cur"></b></span></div></div>
    <div class="dw wb"><div class="dwh"><i></i><i></i><i></i></div><div class="dnote"><span class="l w60"></span><span class="l w90 dim"></span><span class="l w80 dim"></span><span class="l w40 dim"></span></div></div>
  </div>`;
  const warm = (k, inner) => `<div class="nl-warm">${inner}<i class="nl-ov" style="background:${kc(k)}"></i><i class="nl-ov2" style="opacity:${((6500 - k) / 4000 * 0.16).toFixed(3)}"></i></div>`;
  const timeField = (t) => `<span class="nl-time">${t}</span>`;
  const PRE = [["Candle", 2700], ["Warm", 3400], ["Soft", 4000], ["Light touch", 5000]];

  /* ═══ A: see the warmth ════════════════════════════════════════════ */
  const aCtl = () => `
    ${ocard("Now", [orow("<b>Night Light</b>", "Warm the screen colours right away", sw(true), { ic: "moon", sec: S }), orow("Warmth", "", sl(43, "4000 K", 130), { ic: "sun", sec: S })], { cls: "icons", first: true })}
    <div class="nl-pre">${PRE.map(([n, k]) => `<div class="nlp ${k === 4000 ? "on" : ""}"><i style="background:${kc(k)}"></i><b>${n}</b><small>${k} K</small></div>`).join("")}</div>
    ${ocard("Schedule", [orow("Turn on automatically", "Every evening until morning", sw(true), { ic: "clock", sec: S }), orow("Turns on at", "", timeField("20:00"), { ic: "moon", sec: S }), orow("Turns off at", "", timeField("07:00"), { ic: "sun", sec: S })], { cls: "icons" })}
    <div class="nl-hint">${icon("info")}<span>Also in the Omarchy menu.</span></div>`;
  const scale = (k) => `<div class="nl-scale"><div class="nls-bar">${KT.map((t) => `<i style="background:rgb(${t[1]})"></i>`).join("")}<b style="left:${((k - 2500) / 4000) * 100}%"></b></div><div class="nls-l"><span>2500 K · candlelight</span><span class="nls-v" style="left:${((k - 2500) / 4000) * 100}%">${k} K</span><span>6500 K · daylight</span></div></div>`;
  const aPv = () => `
    ${pvhead("Before and after", "Drag the line to compare. The right side is what your screen looks like at 4000 K.", "")}
    <div class="nl-cmp">
      ${desk("big")}
      <div class="nl-after">${warm(4000, desk("big"))}</div>
      <div class="nl-line"><span>${icon("chev-l")}${icon("chev-r")}</span></div>
      <span class="nl-tag l">Normal</span><span class="nl-tag r">4000 K</span>
    </div>
    ${scale(4000)}`;

  /* ═══ B: a day on a dial ═══════════════════════════════════════════ */
  const pt = (h, r) => { const a = ((h / 24) * 360 - 90) * (Math.PI / 180); return [150 + r * Math.cos(a), 150 + r * Math.sin(a)]; };
  const arc = (h1, h2, r) => { const [x1, y1] = pt(h1, r), [x2, y2] = pt(h2, r); const span = ((h2 - h1 + 24) % 24); return `M${x1.toFixed(1)},${y1.toFixed(1)} A${r},${r} 0 ${span > 12 ? 1 : 0} 1 ${x2.toFixed(1)},${y2.toFixed(1)}`; };
  const dial = () => {
    const ticks = Array.from({ length: 24 }, (_, h) => { const [x1, y1] = pt(h, 128), [x2, y2] = pt(h, h % 6 ? 122 : 116); return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="${h % 6 ? "" : "maj"}"/>`; }).join("");
    const labels = [0, 6, 12, 18].map((h) => { const [x, y] = pt(h, 100); return `<text x="${x}" y="${y + 4}">${String(h).padStart(2, "0")}:00</text>`; }).join("");
    const [nx, ny] = pt(14 + 17 / 60, 138), [ax, ay] = pt(20, 140), [bx, by] = pt(7, 140);
    return `<svg class="nl-dial" viewBox="0 0 300 300">
      <defs><linearGradient id="nlg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="rgb(255,180,107)"/><stop offset="1" stop-color="rgb(255,140,60)"/></linearGradient></defs>
      <circle cx="150" cy="150" r="140" class="trk"/>
      <path d="${arc(20, 7, 140)}" class="night"/>
      ${ticks}${labels}
      <circle cx="${nx}" cy="${ny}" r="5" class="now"/>
      <circle cx="${ax}" cy="${ay}" r="11" class="hd"/><circle cx="${bx}" cy="${by}" r="11" class="hd"/>
    </svg>`;
  };
  const bCtl = () => `
    ${ocard("Schedule", [orow("<b>Turn on automatically</b>", "Every evening until morning", sw(true), { ic: "clock", sec: S }), orow("Turns on at", "", `<span class="nl-step">${ib("chev-l")}${timeField("20:00")}${ib("chev-r")}</span>`, { ic: "moon", sec: S }), orow("Turns off at", "", `<span class="nl-step">${ib("chev-l")}${timeField("07:00")}${ib("chev-r")}</span>`, { ic: "sun", sec: S })], { cls: "icons", first: true })}
    ${ocard("Warmth", [orow(`<span class="nl-sw" style="background:${kc(3500)}"></span>`, "", `<span class="slw grow">${slider(57, 0)}<span class="readout">3500 K</span></span>`, { cls: "volrow" })])}
    ${ocard("Right now", [orow("Night Light", "Off until 20:00", sw(false), { ic: "moon", sec: S })], { cls: "icons" })}`;
  const bPv = () => `
    ${pvhead("Your day", "Drag either end of the warm arc to change when it starts and stops.", "")}
    <div class="nl-dwrap">${dial()}<div class="nl-dc"><b>14:17</b><span>Turns on in 5 h 43 min</span><small>for 11 hours, at 3500 K</small></div>
      <span class="nl-dt a">${icon("moon")}20:00</span><span class="nl-dt b">${icon("sun")}07:00</span></div>
    <div class="nl-week card">${["Tonight", "Sat", "Sun", "Mon"].map((d, i) => `<div><small>${d}</small><b>20:00 – 07:00</b></div>`).join("")}</div>`;

  /* ═══ C: through the day ═══════════════════════════════════════════ */
  const chart = () => {
    const W = 560, H = 170, x = (h) => (h / 24) * W, y = (k) => 14 + ((6500 - k) / 4000) * (H - 34);
    const pts = [[0, 4000], [6.5, 4000], [7, 6500], [19.5, 6500], [20, 4000], [24, 4000]];
    const d = pts.map(([h, k], i) => `${i ? "L" : "M"}${x(h).toFixed(1)},${y(k).toFixed(1)}`).join(" ");
    return `<svg class="nl-chart" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">
      <defs><linearGradient id="nlc" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="rgb(255,236,224)" stop-opacity=".35"/><stop offset="1" stop-color="rgb(255,160,80)" stop-opacity=".55"/></linearGradient></defs>
      <rect x="0" y="0" width="${x(7)}" height="${H - 20}" class="nightbg"/><rect x="${x(20)}" y="0" width="${W - x(20)}" height="${H - 20}" class="nightbg"/>
      <path d="${d} L${W},${H - 20} L0,${H - 20}Z" class="area"/>
      <path d="${d}" class="ln"/>
      ${[0, 6, 12, 18, 24].map((h) => `<text x="${Math.min(W - 18, Math.max(2, x(h) - 14))}" y="${H - 4}">${String(h % 24).padStart(2, "0")}:00</text>`).join("")}
      <line x1="${x(14.3)}" x2="${x(14.3)}" y1="0" y2="${H - 20}" class="now"/>
      <circle cx="${x(20)}" cy="${y(5250)}" r="7" class="hd"/><circle cx="${x(7)}" cy="${y(5250)}" r="7" class="hd"/>
    </svg>`;
  };
  const cCtl = () => `
    ${ocard("", [orow("<b>Night Light</b>", "On now · until 07:00", sw(true), { ic: "moon", sec: S })], { cls: "icons", first: true })}
    ${ocard("Warmth", [orow("How warm", "Lower is warmer; 6500 K is neutral", "", {}), `<div class="nl-big">${sl(43, "4000 K", 0)}</div>`])}
    ${ocard("Schedule", [orow("Turn on automatically", "", sw(true)), orow("From", "", timeField("20:00")), orow("Until", "", timeField("07:00"))])}`;
  const sample = (t, k, note) => `<div class="nl-s"><div class="nl-sv">${k ? warm(k, desk()) : desk()}</div><div class="nl-st"><b>${t}</b><span>${note}</span></div></div>`;
  const cPv = () => `
    ${pvhead("Through the day", "The screen's colour from midnight to midnight. It warms at 20:00 and clears at 07:00.", "")}
    <div class="card nl-cc">${chart()}<div class="nl-cl"><span><i class="w"></i>4000 K at night</span><span><i class="d"></i>Normal by day</span><span class="nl-now">Now · 14:17</span></div></div>
    <div class="nl-ss">${sample("At noon", 0, "Normal colours")}${sample("At 21:30", 4000, "4000 K")}${sample("At 03:00", 4000, "4000 K")}</div>
    ${pvfoot("On now because you turned it on; the schedule takes over again at 07:00.", "info")}`;

  const Wn = (body) => swin({ sec: S, page: "Night Light", desc: "Warmer colours in the evening, on a schedule or right now.", body });
  REG("nightlight", {
    name: "Night Light",
    summary: "A short page in two cards: a Night light switch and a Warmth slider in kelvin, then a schedule switch with two text boxes for the times. Half the window stays empty, and nothing shows how warm 4000 K is.",
    problems: [
      "<b>Kelvin without a picture:</b> “4000 K” and “Lower is warmer. 6500 K is neutral.” is all you get; you learn the colour only by turning it on.",
      "<b>Times typed as text:</b> the schedule is two boxes taking “HH:MM”, greyed out until the switch is on, with an error toast for a typo.",
      "<b>No sense of when:</b> nothing says whether Night Light is on now, or when it next turns on or off.",
      "<b>Half the page is empty:</b> five rows at the top of a 650 px page; at 1280 px the cards are a narrow column in the middle.",
      "<b>Two switches that sound alike:</b> “Night light” (now) and “Turn on automatically” (schedule) sit in different cards with no link between them.",
    ],
    today: [["nightlight-1280", "Today", ""], ["nightlight-800", "Today at 800 px", ""]],
    options: [
      { id: "a", name: "See the warmth", idea: "The right side shows a desktop with a line down the middle: normal colours on the left, your warmth on the right. Drag the line to compare. A colour scale under it shows where 4000 K sits between candlelight and daylight. On the left, the switch and slider come first with a few named warmths to pick, then the schedule.",
        shots: [["a", "Before and after", "4000 K on the right half"], ["a-800", "At 800 px", "The comparison above the controls"]] },
      { id: "b", name: "A day on a dial", idea: "The schedule is the picture: a 24-hour dial with the warm hours as an arc you drag at either end, the time now on it, and how long until it next turns on. Times step by a quarter hour instead of being typed. Warmth and the switch for right now sit under the schedule.",
        shots: [["b", "Your day", "20:00 to 07:00, turning on in 5 h 43 min"]] },
      { id: "c", name: "Through the day", idea: "A chart of the screen's colour from midnight to midnight, warm at night and clear by day, with the time now marked. Under it, the same desktop at noon, in the evening and in the middle of the night. The controls are one short column: the switch, a wide warmth slider and the two times.",
        shots: [["c", "Through the day", "The colour hour by hour, with samples"]] },
    ],
    pages: {
      a: () => Wn(split(aCtl(), aPv(), { sec: S, ctlw: 400, cls: "nl-a" })),
      b: () => Wn(split(bCtl(), bPv(), { sec: S, ctlw: 400, cls: "nl-b" })),
      c: () => Wn(split(cCtl(), cPv(), { sec: S, ctlw: 380, cls: "nl-c" })),
    },
  });
})();
