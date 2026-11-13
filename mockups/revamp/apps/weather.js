// Nyx Weather on the revamp page: today's problems and three options.
(() => {
  const PLACES = [
    ["Larkhaven", "Alder County", 58, "csun", "Partly cloudy", "63° / 41°"],
    ["Eastmoor", "Coast Ridge", 64, "sun", "Sunny", "68° / 50°"],
    ["Brightwater Bay", "Saltmarsh", 49, "rain", "Light rain", "52° / 44°"],
    ["Redfern Hills", "High Plains", 71, "sun", "Clear", "75° / 52°"],
  ];
  const HOURS = [["Now", 58, "csun", 0], ["8 PM", 57, "cmoon", 0], ["9 PM", 55, "cmoon", 0], ["10 PM", 53, "moon", 0], ["11 PM", 51, "moon", 0], ["12 AM", 49, "moon", 0], ["1 AM", 47, "moon", 0], ["2 AM", 46, "moon", 5], ["3 AM", 45, "cloud", 10], ["4 AM", 44, "cloud", 10], ["5 AM", 43, "cloud", 5], ["6 AM", 42, "csun", 0], ["7 AM", 43, "sun", 0], ["8 AM", 47, "sun", 0]];
  const DAYS = [["Today", "csun", "Partly cloudy", 41, 63, 10], ["Fri", "sun", "Sunny", 38, 60, 0], ["Sat", "rain", "Showers", 45, 57, 70], ["Sun", "cloud", "Cloudy", 44, 55, 20], ["Mon", "sun", "Sunny", 39, 58, 0], ["Tue", "sun", "Sunny", 42, 62, 0], ["Wed", "wind", "Windy", 47, 66, 10], ["Thu", "rain", "Rain", 50, 61, 80], ["Fri", "cloud", "Cloudy", 43, 56, 20], ["Sat", "sun", "Sunny", 40, 59, 0]];
  const LO = 36, HI = 68;

  /* ── Parts ──────────────────────────────────────────────────────────── */
  const condC = (ic) => ({ sun: "amber", csun: "amber", moon: "violet", cmoon: "violet", rain: "blue", cloud: "graphite", wind: "teal" })[ic] || "blue";
  const cic = (ic, cls = "") => `<span class="cic ${cls}" style="--cc:${swc(condC(ic))}">${icon(ic)}</span>`;
  // A place in the sidebar: in the icon rail its temperature stands in for the icon.
  const place = ([n, r, t, ic], on) => `<div class="navx wplace ${on ? "active" : ""}">${cic(ic)}<b class="pt">${t}°</b><span>${n}</span><span class="cnt">${t}°</span></div>`;
  const range = (lo, hi) => `<span class="rng"><b style="left:${((lo - LO) / (HI - LO)) * 100}%;right:${100 - ((hi - LO) / (HI - LO)) * 100}%"></b></span>`;
  const dayRows = (n = 10) => DAYS.slice(0, n).map(([d, ic, c, lo, hi, p], i) => `<div class="drw ${i === 0 ? "now" : ""}"><span class="dd2">${d}</span>${cic(ic)}<span class="dc">${c}</span><span class="dp">${p ? `${icon("drop")}${p}%` : ""}</span><span class="lo">${lo}°</span>${range(lo, hi)}<span class="hi">${hi}°</span></div>`).join("");
  // A line through the hourly temperatures, over the strip.
  const hourStrip = (n = 14) => {
    const hs = HOURS.slice(0, n), w = 1000, h = 46, mn = 40, mx = 60;
    const pts = hs.map((x, i) => `${((i + 0.5) / n) * w},${h - ((x[1] - mn) / (mx - mn)) * (h - 10) - 5}`);
    return `<div class="hstrip" style="--n:${n}">
      <div class="hcells">${hs.map(([t, v, ic, p], i) => `<div class="hcell ${i === 0 ? "now" : ""}"><span class="ht">${t}</span>${cic(ic, "sm")}<span class="hp">${p ? p + "%" : ""}</span></div>`).join("")}</div>
      <svg class="hline" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none"><path d="M${pts.join(" L")}" /></svg>
      <div class="hvals">${hs.map(([, v]) => `<span>${v}°</span>`).join("")}</div>
    </div>`;
  };
  const metric = (ic, c, k, v, s, extra = "") => `<div class="kcard wm" style="--dc:${swc(c)}"><span class="k">${icon(ic)}${k}</span><span class="v">${v}</span>${extra}<span class="s">${s}</span></div>`;
  const metrics = () => `<div class="wmetrics">
    ${metric("wind", "teal", "Wind", "6 mph", "From the north-west · gusts 14")}
    ${metric("drop", "blue", "Humidity", "52%", "Dew point 40°")}
    ${metric("gauge", "violet", "Pressure", "30.02 inHg", "Rising slowly")}
    ${metric("sun", "amber", "UV", "1 · Low", "No protection needed")}
    ${metric("leaf", "green", "Air quality", "32 · Good", "Pollen low", `<span class="aqbar"><b style="left:16%"></b></span>`)}
    ${metric("sunset", "coral", "Sunset", "4:48 pm", "Sunrise 6:31 am · 10 h 17 m")}
  </div>`;
  const alertBanner = () => `<div class="banner2 warn walert">${icon("alert")}<div class="tx"><b>Frost advisory</b><span>Tonight 1 am to 9 am · temperatures near 32° in low spots · National Weather Service</span></div>${btn("Details")}</div>`;
  const hero = (o = {}) => `<div class="whero">
    <div class="wh-l"><div class="wh-place"><b>Larkhaven</b><span>Alder County · 7:42 pm</span></div>
      <div class="wh-now">${cic("csun", "xl")}<span class="wt">58°</span><div class="wh-c"><b>Partly cloudy</b><span>Feels like 55° · H 63° L 41°</span></div></div></div>
    ${o.noRain ? "" : `<div class="wh-r"><span class="k">${icon("umbrella")}Next two hours</span><b>No rain expected</b><div class="rainbars">${Array.from({ length: 24 }, () => `<i></i>`).join("")}</div><span class="ax"><span>Now</span><span>+1 h</span><span>+2 h</span></span></div>`}
  </div>`;

  const skyRow = () => `<div class="wsky"><span>${icon("sunrise")}6:31 am</span><span>${icon("sunset")}4:48 pm</span><span class="mo">${icon("moon")}Waxing crescent · 23%</span><span class="more">Sun and moon</span></div>`;
  const fewDays = () => `<div class="wfew">${DAYS.slice(1, 6).map(([d, ic, c, lo, hi]) => `<div class="fd"><span class="n">${d}</span>${cic(ic)}<span class="t">${hi}°<span>${lo}°</span></span></div>`).join("")}</div>`;

  const hdr = (o = {}) => header({ icon: "csun", name: "Weather", center: search(o.q || "Search for a place", "Ctrl F"), end: o.end !== undefined ? o.end : `<span class="wupd">${wideOnly("Updated 2 min ago")}</span>${ib("refresh", "Refresh (Ctrl+R)")}` });

  /* ── Option A: places first in the sidebar ─────────────────────────── */
  const sideA = (on = "today") => `
    ${grp("Places", false, icon("plus"), "accent")}
    ${PLACES.map((p, i) => place(p, i === 0)).join("")}
    ${grp("Forecast", false, "", "violet")}
    ${navx("csun", "Today", { active: on === "today" })}
    ${navx("graph", "Hourly", { active: on === "hourly", sub: "48 h" })}
    ${navx("calendar", "10 days", { active: on === "daily" })}
    ${grp("Maps", false, "", "teal")}
    ${navx("radar", "Radar", { active: on === "radar" })}
    ${grp("Outdoors", false, "", "green")}
    ${navx("leaf", "Air and pollen", { active: on === "air" })}
    ${navx("moon", "Sun and moon", { active: on === "sky" })}
    <div class="foot">${icon("check-c", "ok")}<span>Open-Meteo · NOAA alerts</span></div>`;
  const todayA = () => `<div class="main wpage"><div class="content">
    ${alertBanner()}
    <div class="wcols">
      <div class="wleft">${hero()}<div class="sechead">Next 24 hours<span class="more">Hourly</span></div>${hourStrip(NARROW ? 9 : 10)}<div class="sechead">Right now</div>${metrics()}${skyRow()}</div>
      <div class="wright"><div class="sechead">10 days<span class="more">Outlook</span></div><div class="card wdays">${dayRows()}</div><div class="wweek"><b>This week</b>Showers on Saturday and rain again on Thursday. Friday morning is the coldest, at 38°.</div></div>
    </div>
  </div></div>`;

  const map = (o = {}) => `<div class="wmap ${o.cls || ""}">
    <svg class="land" viewBox="0 0 1000 700" preserveAspectRatio="xMidYMid slice">
      <path class="water" d="M0 520 C 120 480, 180 560, 300 540 S 480 600, 560 700 L0 700Z"/>
      <path class="water" d="M760 0 C 740 80, 820 140, 800 220 S 900 300, 1000 280 L1000 0Z"/>
      <path class="lake" d="M620 380 c 30 -20 80 -10 90 20 s -30 60 -70 50 s -50 -50 -20 -70z"/>
      <g class="roads"><path d="M0 300 C 200 320, 400 260, 1000 330"/><path d="M420 0 C 440 200, 380 400, 470 700"/><path d="M120 0 L 300 700"/><path d="M640 0 C 600 200, 700 420, 900 700"/></g>
      <g class="minor"><path d="M0 160 L1000 120"/><path d="M200 0 L 160 700"/><path d="M560 0 L 520 700"/><path d="M0 430 L 1000 470"/><path d="M820 0 L 760 700"/></g>
    </svg>
    ${o.layer === "temp" ? `<div class="ovl temp"></div>` : `<div class="ovl radar"><i style="left:8%;top:12%;width:360px;height:220px"></i><i class="y" style="left:18%;top:20%;width:170px;height:110px"></i><i class="r" style="left:24%;top:25%;width:60px;height:44px"></i><i style="left:60%;top:55%;width:300px;height:180px"></i><i class="y" style="left:68%;top:62%;width:120px;height:70px"></i></div>`}
    <div class="towns"><span style="left:46%;top:46%" class="me">${icon("mapin")}Larkhaven</span><span style="left:14%;top:30%">Fenwick</span><span style="left:70%;top:24%">Eastmoor</span><span style="left:30%;top:72%">Brightwater Bay</span><span style="left:78%;top:70%">Ostry</span></div>
  </div>`;
  const radarA = () => `<div class="main wpage">
    ${pbar2("Radar", "Larkhaven · a frame every 5 minutes", `${seg(["Radar", "Satellite", "Wind", "Temperature"], "Radar")}`)}
    <div class="wmapwrap">${map()}
      <div class="mzoom">${ib("plus", "Zoom in")}${ib("minus", "Zoom out")}${ib("target", "Back to Larkhaven")}</div>
      <div class="mlegend"><span>Light</span><i></i><span>Heavy</span></div>
      <div class="mplay"><button class="pp">${icon("play")}</button><div class="tl"><div class="tlbar"><b style="width:72%"></b>${Array.from({ length: 13 }, (_, i) => `<i style="left:${(i / 12) * 100}%"></i>`).join("")}</div><div class="tlx"><span>6:45 pm</span><span>7:00</span><span>7:15</span><span>7:30</span><span class="on">7:40 · now</span></div></div><div class="op"><span>Opacity</span><div class="hsl"><b style="width:80%"></b></div><span class="pc">80%</span></div></div>
    </div></div>`;

  /* ── Option B: one page, all of it ─────────────────────────────────── */
  const placeSw = () => `<span class="wps">${cic("csun", "sm")}<b>Larkhaven</b><span>58°</span>${icon("chev-d")}</span>`;
  const hdrB = () => header({ icon: "csun", name: "Weather", start: placeSw(), center: search("Search for a place", "Ctrl F"), end: `<span class="wupd">${wideOnly("Updated 2 min ago")}</span>${ib("refresh", "Refresh (Ctrl+R)")}` });
  const chart48 = (o = {}) => {
    const t = [58, 57, 55, 53, 51, 49, 47, 46, 45, 44, 43, 42, 43, 47, 51, 55, 58, 60, 62, 63, 62, 60, 57, 54, 52, 50, 49, 48, 48, 47, 47, 46, 46, 47, 49, 51, 53, 55, 56, 57, 56, 55, 53, 52, 51, 50, 50, 49];
    const r = [0, 0, 0, 0, 0, 0, 0, 5, 10, 10, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 10, 20, 30, 45, 60, 70, 75, 70, 60, 55, 40, 30, 20, 10, 5, 5, 0, 0, 0, 0, 0, 5, 10, 10, 5, 0, 0];
    const w = 1000, h = o.h || 150, mn = 38, mx = 66;
    const y = (v) => h - 18 - ((v - mn) / (mx - mn)) * (h - 40);
    const pts = t.map((v, i) => `${(i / 47) * w},${y(v).toFixed(1)}`);
    const feel = t.map((v, i) => `${(i / 47) * w},${y(v - 3 - (i % 7 === 0 ? 1 : 0)).toFixed(1)}`);
    return `<div class="c48"><svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">
      ${[0, 1, 2, 3].map((k) => `<line x1="0" x2="${w}" y1="${18 + k * ((h - 40) / 3)}" y2="${18 + k * ((h - 40) / 3)}" class="gl"/>`).join("")}
      ${r.map((v, i) => v ? `<rect x="${(i / 47) * w - 7}" y="${h - 18 - (v / 100) * (h - 40)}" width="14" height="${(v / 100) * (h - 40)}" class="rb"/>` : "").join("")}
      <path d="M0,${h - 18} L${pts.join(" L")} L${w},${h - 18}Z" class="tf"/><path d="M${pts.join(" L")}" class="tl"/><path d="M${feel.join(" L")}" class="fl"/>
      <line x1="${(12 / 47) * w}" x2="${(12 / 47) * w}" y1="8" y2="${h - 18}" class="mid"/>
    </svg><div class="c48x"><span>Now</span><span>Midnight</span><span>6 am</span><span>Noon</span><span>6 pm</span><span>Midnight</span><span>6 am</span></div>
    <div class="c48k"><span class="t">Temperature</span><span class="f">Feels like</span><span class="r">Chance of rain</span></div></div>`;
  };
  const card = (title, ic, body, o = {}) => `<div class="wcard ${o.cls || ""}" ${o.style ? `style="${o.style}"` : ""}><div class="wch">${icon(ic)}<b>${title}</b><span class="sp"></span>${o.more === false ? "" : `<span class="more">${o.more || "More"}${icon("chev-r")}</span>`}</div>${body}</div>`;
  const sunArc = () => `<div class="sunarc"><svg viewBox="0 0 300 120"><path d="M20 110 Q150 -30 280 110" class="arc"/><path d="M20 110 Q110 2 205 62" class="arcd"/><circle cx="214" cy="70" r="8" class="sun"/><line x1="0" x2="300" y1="110" y2="110" class="hz"/></svg><div class="sx"><span>${icon("sunrise")}6:31 am</span><span>10 h 17 m of daylight</span><span>${icon("sunset")}4:48 pm</span></div></div>`;
  const dashB = () => `<div class="main wpage"><div class="content bdash">
    ${alertBanner()}
    <div class="bgrid">
      ${card("Now", "csun", `${hero({ noRain: true })}<div class="bnow">${[["wind", "6 mph NW"], ["drop", "52%"], ["gauge", "30.02 in"], ["umbrella", "No rain for 2 h"]].map(([i, t]) => `<span>${icon(i)}${t}</span>`).join("")}</div>`, { cls: "span2 bn", more: false })}
      ${card("Radar", "radar", `<div class="bmap">${map({ cls: "mini" })}<span class="bmt">${icon("play")} Rain moving east · 7:40 pm</span></div>`, { more: "Open map" })}
      ${card("Next 48 hours", "graph", chart48({ h: 130 }), { cls: "span2", more: "Hourly table" })}
      ${card("Air quality", "leaf", `<div class="baq">${ring(32, { size: 76, c: "var(--success)", label: "32" })}<div><b>Good</b><span>US AQI · PM2.5 6 µg/m³</span><span>Pollen low · UV 1</span></div></div>`)}
      ${card("10 days", "calendar", `<div class="wdays b">${dayRows(NARROW ? 5 : 6)}</div>`, { cls: "span2" })}
      ${card("Sun and moon", "moon", sunArc(), { more: "Models" })}
    </div>
  </div></div>`;
  const airB = () => `<div class="main wpage">
    <div class="pbar">${btn("Larkhaven", "ghost", "chev-l")}<span class="t">Air and pollen</span><span class="s">Updated 7:30 pm</span><span class="sp"></span>${seg(["US AQI", "European"], "US AQI")}</div>
    <div class="content"><div class="airgrid">
      <div class="wcard aqbig"><div class="baq big">${ring(32, { size: 120, c: "var(--success)", label: "32" })}<div><b>Good</b><span>Air quality is fine for everyone. A good evening for a walk.</span><div class="aqscale">${["Good", "Moderate", "Sensitive", "Unhealthy", "Very bad", "Hazardous"].map((s, i) => `<span class="${i === 0 ? "on" : ""}">${s}</span>`).join("")}</div></div></div></div>
      <div class="wcard"><div class="wch">${icon("graph")}<b>Next 24 hours</b></div>${bars([.3, .32, .34, .36, .38, .36, .33, .3, .28, .25, .24, .26, .3, .38, .45, .5, .48, .44, .4, .36, .34, .33, .31, .3], { h: 90, c: "var(--success)" })}<div class="c48x"><span>Now</span><span>Midnight</span><span>6 am</span><span>Noon</span><span>6 pm</span></div></div>
      <div class="wcard"><div class="wch">${icon("layers")}<b>Particles and gases</b></div>${tbl([["", ""], ["Now", "70px"], ["", "110px"]], [["PM2.5", "6 µg/m³", prog(12, "ok")], ["PM10", "11 µg/m³", prog(10, "ok")], ["Ozone", "48 µg/m³", prog(34, "ok")], ["Nitrogen dioxide", "9 µg/m³", prog(8, "ok")], ["Sulphur dioxide", "2 µg/m³", prog(3, "ok")], ["Carbon monoxide", "180 µg/m³", prog(6, "ok")]], { cls: "wtbl" })}</div>
      <div class="wcard"><div class="wch">${icon("leaf")}<b>Pollen</b><span class="sp"></span><span class="note">Forecast for Europe only</span></div>${tbl([["", ""], ["Level", "80px"], ["", "110px"]], [["Grass", "Low", prog(15, "ok")], ["Birch", "None", prog(0, "ok")], ["Ragweed", "Low", prog(10, "ok")], ["Olive", "None", prog(0, "ok")]], { cls: "wtbl" })}<div class="uvrow">${icon("sun")}<span>UV index 1 · Low until sunrise</span></div></div>
      <div class="wcard"><div class="wch">${icon("calendar")}<b>Next five days</b></div><div class="card aqdays">${[["Fri", "Good", 28, "ok", "Clean air behind the cold front"], ["Sat", "Good", 19, "ok", "Rain washes the air out"], ["Sun", "Moderate", 54, "mod", "Light winds let ozone build"], ["Mon", "Good", 41, "ok", ""], ["Tue", "Good", 36, "ok", ""]].map(([d, l, n, c, s]) => `<div class="opt"><div class="opt-text"><span class="dn">${d}</span><span class="num ${c}">${n}</span><span class="lv">${l}${s ? ` · ${s}` : ""}</span></div></div>`).join("")}</div></div>
    </div></div></div>`;

  /* ── Option C: places side by side ─────────────────────────────────── */
  const pcard = ([n, r, t, ic, c, hl], on) => `<div class="pcard ${on ? "on" : ""}" style="--cc:${swc(condC(ic))}"><div class="pc1"><b>${n}</b><span class="pt2">${t}°</span></div><div class="pc2"><span>${r} · ${on ? "7:42 pm" : "7:42 pm"}</span>${cic(ic, "sm")}</div><div class="pc3"><span>${c}</span><span>${hl}</span></div></div>`;
  const spark2 = (v, o) => spark(v, o).replace('<svg ', '<svg preserveAspectRatio="none" ');
  const MORE = [["Northgate", "River Vale", 52, "cloud", "Cloudy", "55° / 43°"], ["Kestrel Point", "Coast Ridge", 60, "wind", "Breezy", "62° / 49°"]];
  const placesC = () => `<div class="list wplist"><div class="lhead3"><b>Places</b><span class="sp"></span>${btn("Add", "ghost", "plus")}</div><div class="scroll">${[...PLACES, ...MORE].map((p, i) => pcard(p, i === 0)).join("")}<div class="pcard add">${icon("search")}<span>Search for a place to add</span></div></div></div>`;
  const tabsC = (on) => `<div class="tabs wtabs">${["Today", "Hourly", "10 days", "Radar", "Air", "Sun and moon"].map((t) => `<span class="tab ${t === on ? "on" : ""}"><span class="tt">${t}</span></span>`).join("")}</div>`;
  const todayC = () => `<div class="cols">${placesC()}<div class="main wpage">${tabsC("Today")}<div class="content">
    ${alertBanner()}
    ${hero()}
    <div class="sechead">Next 24 hours</div>${hourStrip(NARROW ? 7 : 9)}
    <div class="sechead">Right now</div>${metrics()}
    <div class="sechead">Next few days</div>${fewDays()}
  </div></div></div>`;
  const hourlyC = () => `<div class="cols">${placesC()}<div class="main wpage">${tabsC("Hourly")}<div class="content">
    <div class="wcard"><div class="wch">${icon("thermo")}<b>Temperature and rain</b><span class="sp"></span>${seg(["24 h", "48 h"], "48 h")}</div>${chart48({ h: 150 })}</div>
    <div class="hgrid2">
      <div class="wcard"><div class="wch">${icon("wind")}<b>Wind and gusts</b></div>${spark2([.2, .25, .22, .3, .35, .4, .38, .45, .5, .48, .42, .4, .35, .3, .32, .38, .44, .5, .58, .62, .55, .5, .45, .4], { w: 330, h: 70, c: "var(--sw-teal)" })}<span class="cap">Gusts up to 21 mph on Saturday afternoon</span></div>
      <div class="wcard"><div class="wch">${icon("gauge")}<b>Pressure</b></div>${spark2([.5, .52, .55, .58, .6, .62, .63, .64, .63, .6, .55, .5, .44, .38, .33, .3, .28, .3, .34, .4, .45, .5, .52, .55], { w: 330, h: 70, c: "var(--sw-violet)" })}<span class="cap">Falling on Saturday as the rain arrives</span></div>
    </div>
    <div class="sechead">Hour by hour</div>
    ${tbl([["Time", "70px"], ["", "40px"], ["Temp", "60px"], ["Feels", "60px"], ["Rain", "60px"], ["Wind", ""], ["Humidity", "80px"], ["Cloud", "70px"]], HOURS.slice(0, 6).map(([t, v, ic, p], i) => [t, cic(ic, "sm"), `${v}°`, `${v - 3}°`, `${p}%`, `${5 + (i % 3)} mph NW`, `${52 + i * 2}%`, `${20 + i * 5}%`]), { cls: "wtbl hrs" })}
  </div></div></div>`;

  REG("weather", {
    name: "Weather",
    summary: "Weather has rich data (radar, air quality, three forecast models) but spreads one forecast over three pages, turns your places into look-alike moon icons in the rail, and gives its alerts and readings more shouting than shape.",
    problems: [
      "<b>Places look like pages:</b> in the icon rail each saved place is just its sky icon, so two clear nights are two identical moons sitting under the “Sun, Moon &amp; Models” moon.",
      "<b>The forecast is split three ways:</b> Overview has a 24-hour strip and 7 days, Hourly &amp; Graphs has 48 hours, and 10-Day Outlook repeats the days with three more. The 7-day list's → is the only link between them.",
      "<b>The alert shouts:</b> a red title, a long bold sentence and a bright yellow square button with no label take the best spot on the page, even for a watch two days away.",
      "<b>Readings read like links:</b> wind, humidity, pressure and air quality are a line of text in four different colours, and the card's two bare icons (a pin and a strip) don't say what they do.",
      "<b>The 7-day list is mostly gap:</b> tall rows with the condition far from tiny range bars, and at 800 px only three days fit.",
      "<b>The 24-hour strip just stops</b> at the window's edge (eight hours at 800 px) with nothing to say there's more.",
      "<b>Settings carries the plumbing:</b> three custom server addresses and an API key sit next to the temperature unit, and places are reordered with up and down buttons there while the sidebar's right-click does the same.",
    ],
    today: [["weather-1280", "Today at 1280 px", "Alert, conditions, 24 hours and 7 days; places as icons in the rail"], ["weather-800", "Today at 800 px", "Eight hours and three days fit"]],
    options: [
      { id: "a", name: "Places first", idea: "The same pages, sorted out. Your places come first in the sidebar with their temperature (in the icon rail the temperature replaces the icon, so places can't be mistaken for pages), then Forecast, Maps and Outdoors under coloured headings. Today puts the alert in a calm banner with a Details button, the conditions and the next two hours of rain in one card, a 24-hour strip with a temperature line, six readings as tiles, and all ten days beside them.",
        shots: [["a-today", "Today", "Places with temperatures; alert, readings and ten days on one page"], ["a-radar", "Radar", "Layers as tabs; a timeline with play and opacity"], ["a-today-800", "At 800 px", "Rail shows each place's temperature; ten days below"]] },
      { id: "b", name: "One page", idea: "No sidebar: everything about one place on one scrolling page of cards (Now, Radar, the next 48 hours, Air quality, 10 days, Sun and moon). The place switcher sits in the header next to search. Each card's More opens its full page (the hourly table, the map, air and pollen, the models) with a back button to the place. Best if you glance at the weather rather than study it.",
        shots: [["b-dash", "The place", "Every part of the forecast as a card"], ["b-air", "Air and pollen, opened from its card", "Back to the place; AQI scale, gases and pollen"], ["b-dash-800", "At 800 px", "Cards stack in one column"]] },
      { id: "c", name: "Places side by side", idea: "A list of place cards on the left, each with its temperature, sky and high and low, so you can compare them at a glance; the selected place fills the right with tabs for Today, Hourly, 10 days, Radar, Air, and Sun and moon. Best if you follow the weather in several places.",
        shots: [["c-today", "Today", "Place cards; the selected place with tabs"], ["c-hourly", "Hourly", "Temperature, rain, wind and pressure charts with the table"], ["c-today-800", "At 800 px", "Narrower place cards; the tabs scroll"]] },
    ],
    pages: {
      "a-today": () => win({ hdr: hdr(), side: sideA("today"), page: todayA() }),
      "a-radar": () => win({ hdr: hdr(), side: sideA("radar"), page: radarA() }),
      "b-dash": () => win({ hdr: hdrB(), side: "", page: dashB() }),
      "b-air": () => win({ hdr: hdrB(), side: "", page: airB() }),
      "c-today": () => win({ hdr: hdr(), side: "", page: todayC() }),
      "c-hourly": () => win({ hdr: hdr(), side: "", page: hourlyC() }),
    },
    icons: {
      csun: '<path d="M8 3v1.5M3.6 4.8l1 1M2 9.5h1.5M12.4 4.8l-1 1"/><path d="M5.4 11.2A3.5 3.5 0 1 1 11.6 8"/><path d="M17.5 20a3.5 3.5 0 0 0 0-7h-.3A5 5 0 0 0 7.6 14.6 3 3 0 0 0 8 20.5z"/>',
      cmoon: '<path d="M11.5 4.2A4.5 4.5 0 0 0 5.2 10.5a4.6 4.6 0 0 0 1.8.5"/><path d="M17.5 20a3.5 3.5 0 0 0 0-7h-.3A5 5 0 0 0 7.6 14.6 3 3 0 0 0 8 20.5z"/>',
      rain: '<path d="M17 15.5a3.5 3.5 0 0 0 0-7h-.3A5 5 0 0 0 7 9.5a3 3 0 0 0 .5 6"/><path d="M9 18.5l-1 2.5M13 18.5l-1 2.5M17 18.5l-1 2.5"/>',
      cloud: '<path d="M17.5 19a4.5 4.5 0 1 0-1.3-8.8A6 6 0 0 0 4.5 12a3.5 3.5 0 0 0 1.5 7z"/>',
      wind: '<path d="M3 8h11a3 3 0 1 0-3-3M3 12h16a3 3 0 1 1-3 3M3 16h7"/>',
      drop: '<path d="M12 3.5s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/>',
      gauge: '<path d="M4.2 17a9 9 0 1 1 15.6 0"/><path d="m12 13 4-5"/><circle cx="12" cy="13.5" r="1.3"/>',
      leaf: '<path d="M5 19c0-9 5-14 15-14 0 10-5 15-14 15"/><path d="M5 19 14 10"/>',
      sunset: '<path d="M12 9V3M9 6l3 3 3-3M4 18h16M7.5 18a4.5 4.5 0 0 1 9 0M2.5 21.5h19M4.5 13.5l1 1M19.5 13.5l-1 1"/>',
      sunrise: '<path d="M12 3v6M9 6l3-3 3 3M4 18h16M7.5 18a4.5 4.5 0 0 1 9 0M2.5 21.5h19M4.5 13.5l1 1M19.5 13.5l-1 1"/>',
      umbrella: '<path d="M3 12a9 9 0 0 1 18 0zM12 12v7a2 2 0 0 1-4 0"/><path d="M12 3v0"/>',
      thermo: '<path d="M14 14.8V5a2 2 0 0 0-4 0v9.8a4 4 0 1 0 4 0z"/><path d="M12 11v6"/>',
      radar: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><path d="M12 12 18.4 5.6"/><circle cx="12" cy="12" r="1" fill="currentColor"/>',
      minus: '<path d="M5 12h14"/>',
      target: '<circle cx="12" cy="12" r="7.5"/><circle cx="12" cy="12" r="2.5"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>',
    },
  });
})();
