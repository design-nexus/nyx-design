// Desktop › Tiling & Workspaces: the layout, focus, workspaces on each screen, a workspace's
// own layout, name, gaps and decorations, the scratchpad, and window controls.
(() => {
  /* ── Sample data ─────────────────────────────────────────────────── */
  // [number, name, screen, own settings, layout icon]
  const WS = [[1, "", "lap"], [2, "Web", "lap", "Master & stack"], [3, "", "lap"], [4, "Writing", "lap", "Scrolling · large gaps · bare windows", "columns"], [5, "", "lap"], [6, "", "studio"], [7, "Tools", "studio", "Floating", "layers"], [8, "", "studio"], [9, "", ""], [10, "", ""]];
  const ALWAYS = 6;
  // Window rectangles as shares of the area: [x, y, w, h, kind, flags]
  const LAYOUTS = {
    dwindle: [[0, 0, 0.5, 1, "files"], [0.5, 0, 0.5, 0.5, "term"], [0.5, 0.5, 0.25, 0.5, "doc", "f"], [0.75, 0.5, 0.25, 0.5, "", "slot"]],
    master: [[0, 0, 0.58, 1, "web", "f"], [0.58, 0, 0.42, 0.34, "term"], [0.58, 0.34, 0.42, 0.33, "doc"], [0.58, 0.67, 0.42, 0.33, "", "slot"]],
    scrolling: [[-0.3, 0, 0.42, 1, "files", "off"], [0.12, 0, 0.5, 1, "doc", "f"], [0.62, 0, 0.42, 1, "web"], [1.04, 0, 0.3, 1, "term", "off"]],
  };
  const LAYNAMES = [["dwindle", "Dwindle", "Each new window splits the last in half"], ["master", "Master & stack", "One big window, the rest beside it"], ["scrolling", "Scrolling", "Columns side by side; scroll through"]];

  /* ── Small drawings ──────────────────────────────────────────────── */
  const body = (kind) => ({
    files: `<div class="dsd"><b class="on"></b><b></b><b></b><b></b></div><div class="dmn"><span class="l w60"></span><span class="rw on"></span><span class="rw"></span><span class="rw"></span><span class="rw"></span></div>`,
    term: `<div class="tm"><span><b class="c1 w20"></b><b class="w40"></b></span><span><b class="c2 w30"></b><b class="w50"></b></span><span><b class="c3 w20"></b><b class="w30"></b></span><span><b class="c1 w20"></b><b class="w60"></b></span></div>`,
    web: `<div class="dmn"><span class="pic" style="background:${wall("trip")}"></span><span class="l w70"></span><span class="l w90 dim"></span><span class="l w80 dim"></span></div>`,
    doc: `<div class="dmn"><span class="l w50"></span><span class="l w90 dim"></span><span class="l w80 dim"></span><span class="l w90 dim"></span><span class="l w40 dim"></span><span class="l w80 dim"></span></div>`,
  })[kind] || "";
  const ptr = (style) => `<svg class="ptr" viewBox="0 0 24 24" style="${style}"><path d="M5 3.5 18 12l-6 1.5-3 6z" fill="currentColor" stroke="#000" stroke-width="1" stroke-opacity=".4"/></svg>`;
  // A workspace at layout `lay` with inner and outer gaps (drawn larger than life so they show).
  const tiled = (lay, o = {}) => {
    const gi = o.gi ?? 8, go = o.go ?? 14, bar = 18, oo = go - gi / 2;
    const rect = ([x, y, w, h, kind, fl = ""]) => {
      const st = `left:calc(${oo}px + (100% - ${2 * oo}px) * ${x} + ${gi / 2}px);top:calc(${bar + oo}px + (100% - ${bar + 2 * oo}px) * ${y} + ${gi / 2}px);width:calc((100% - ${2 * oo}px) * ${w} - ${gi}px);height:calc((100% - ${bar + 2 * oo}px) * ${h} - ${gi}px)`;
      if (fl === "slot") return `<div class="dw slot" style="${st}">${icon("plus")}Next window</div>`;
      return `<div class="dw ${fl}" style="${st}"><div class="dwh"><i></i><i></i><i></i><b></b></div><div class="dwb">${body(kind)}</div></div>`;
    };
    const gx = (x) => `calc(${oo}px + (100% - ${2 * oo}px) * ${x})`, gy = (y) => `calc(${bar + oo}px + (100% - ${bar + 2 * oo}px) * ${y})`;
    return `<div class="dsk tws ${o.cls || ""}" style="background:${wall(o.seed || "atlas-desk")}">
      <div class="dbar"><span class="ws">${[1, 2, 3, 4].map((n) => `<b class="${n === (o.ws || 3) ? "on" : ""}"></b>`).join("")}</span><span class="clk">Fri 14:20</span><span class="tray">${icon("wifi")}${icon("volume")}${icon("battery")}</span></div>
      ${LAYOUTS[lay].map(rect).join("")}
      ${o.gaps === false ? "" : `<span class="gp" style="left:${gx(lay === "scrolling" ? 0.62 : 0.5)};top:${gy(0.25)}">${o.gil || "5 px"}</span><span class="gp" style="left:${gx(0.25)};top:${bar + go / 2}px">${o.gol || "10 px at the edges"}</span>`}
      ${o.ptr === false ? "" : lay === "dwindle" ? ptr(`left:${gx(0.62)};top:${gy(0.7)}`) : lay === "master" ? ptr(`left:${gx(0.3)};top:${gy(0.55)}`) : ptr(`left:${gx(0.4)};top:${gy(0.5)}`)}
      ${lay === "scrolling" ? `<span class="scrollhint">${icon("chev-l")}Scroll or Super + ← → for the next column${icon("chev-r")}</span>` : ""}</div>`;
  };
  const sketch = (lay) => `<span class="lsk">${{
    dwindle: '<i style="left:3px;top:3px;width:calc(50% - 4.5px);bottom:3px"></i><i style="left:calc(50% + 1.5px);top:3px;right:3px;height:calc(50% - 4.5px)"></i><i style="left:calc(50% + 1.5px);bottom:3px;width:calc(25% - 3px);height:calc(50% - 4.5px)"></i><i class="n" style="right:3px;bottom:3px;width:calc(25% - 3px);height:calc(50% - 4.5px)"></i>',
    master: '<i style="left:3px;top:3px;width:calc(58% - 4.5px);bottom:3px"></i><i style="right:3px;top:3px;width:calc(42% - 4.5px);height:calc(33% - 3px)"></i><i style="right:3px;top:calc(33% + 2px);width:calc(42% - 4.5px);height:calc(33% - 3px)"></i><i class="n" style="right:3px;bottom:3px;width:calc(42% - 4.5px);height:calc(33% - 3px)"></i>',
    scrolling: '<i style="left:-12px;top:3px;width:30%;bottom:3px;opacity:.5"></i><i style="left:calc(22% + 0px);top:3px;width:44%;bottom:3px"></i><i style="left:calc(68% + 2px);top:3px;width:40%;bottom:3px;opacity:.5"></i>',
  }[lay]}</span>`;
  const lays = (on) => `<div class="lays">${LAYNAMES.map(([k, n, d]) => `<div class="lay ${k === on ? "on" : ""}">${sketch(k)}<b>${n}</b><small>${d}</small></div>`).join("")}</div>`;
  const wch = ([n, name, , own, ic], cur) => `<span class="wch ${n <= ALWAYS ? "always" : ""} ${n === cur ? "cur" : ""}">${n}${name ? `<em>${name}</em>` : ""}${ic ? icon(ic) : ""}</span>`;
  const strip = (cur = 3) => `<div class="card wstrip">
      <div class="wh"><b>Workspaces</b><span>1–6 always there; the rest come and go.</span><span class="sp"></span><span class="lnk">Change ${icon("chev-r")}</span></div>
      <div class="wscr">
        <div class="wsc"><span class="sn">${icon("laptop")}Laptop screen</span><span class="chs">${WS.filter((w) => w[2] === "lap").map((w) => wch(w, cur)).join("")}</span></div>
        <div class="wsc"><span class="sn">${icon("monitor")}Studio 27</span><span class="chs">${WS.filter((w) => w[2] === "studio").map((w) => wch(w, cur)).join("")}</span></div>
        <div class="wsc any"><span class="sn">${icon("swipe-lr")}Any screen</span><span class="chs">${WS.filter((w) => !w[2]).map((w) => wch(w, cur)).join("")}</span></div>
      </div></div>`;

  /* ── A: a tiled workspace; the rest a level down ─────────────────── */
  const ctlA = () => `
    ${ocard("Layout", [lays("dwindle"), orow("Split toward the pointer", "A new window opens on the side the pointer is on.", sw(false)), orow("Keep split direction", "Splits stay as they are when windows move or close.", sw(true))], { first: true })}
    ${ocard("Focus", [orow("Typing goes to", "", dd("The window under the pointer")), orow("Apps that ask come forward", "Like a link opened from elsewhere.", sw(true))])}
    ${ocard("", [
      nrow("Workspaces and screens", "", "1–6 always there", { ic: "grid", sec: "desktop" }),
      nrow("Workspaces with their own settings", "", "3", { ic: "layers", sec: "desktop" }),
      nrow("Window controls", "", "Adaptive", { ic: "window", sec: "desktop" }),
      nrow("Scratchpad and small habits", "Swallowing, middle-click paste", "", { ic: "spark", sec: "desktop" }),
    ], { cls: "icons" })}`;
  const pvA = () => `
    ${pvhead("Dwindle", "Workspace 3. The dashed box is where the next window opens.", NARROW ? "" : chip("Gaps on Window Style", "", "external"))}
    <div class="twsw">${tiled("dwindle")}</div>
    ${NARROW ? "" : strip()}`;

  /* ── B: workspace by workspace ───────────────────────────────────── */
  const wsrow = ([n, name, scr, own], pick) => `<div class="opt ${n === pick ? "picked" : ""}"><span class="wn ${n <= ALWAYS ? "always" : ""}">${n}</span><div class="opt-text"><div>${name ? `${name}` : `Workspace ${n}`}</div><div class="d">${own ? `<em>${own}</em>` : "Same as everywhere"}</div></div>${icon("chev-r", "cv")}</div>`;
  const ctlB = () => `
    ${ocard("", [nrow("<b>Everywhere</b>", "Dwindle · focus follows the pointer", "", { ic: "grid", sec: "desktop" }), orow("Always there", "In the bar even when empty.", sl(60, "1–6", 90), { ic: "layers", sec: "desktop" })], { cls: "icons" })}
    <div class="grpl">${icon("laptop")}Laptop screen</div>
    <div class="card wsl">${WS.filter((w) => w[2] === "lap").map((w) => wsrow(w, 4)).join("")}</div>
    <div class="grpl">${icon("monitor")}Studio 27</div>
    <div class="card wsl">${WS.filter((w) => w[2] === "studio").slice(0, 2).map((w) => wsrow(w, 4)).join("")}</div>`;
  const pvB = () => `
    ${pvhead("Workspace 4 · Writing", "Anything left as “Same” follows the rest of the page.", btn("Back to the same as everywhere", "sm ghost", "refresh"))}
    <div class="twsw mid">${tiled("scrolling", { cls: "bare", gi: 16, go: 26, gil: "Large gaps", gol: "20 px at the edges", ws: 4, seed: "writing" })}</div>
    ${ocard("", [
      orow("Name", "Shown in the bar.", `<span class="field" style="width:200px">Writing</span>`),
      orow("Layout", "", seg(["Same", "Dwindle", "Master", "Scrolling"], "Scrolling")),
      orow("Gaps", "", seg(["Same", "None", "Small", "Medium", "Large"], "Large")),
      orow("Windows", "", dd("No borders, rounding or shadows")),
      orow("Screen", "", dd("Laptop screen", "laptop")),
    ])}`;

  /* ── C: four parts, one at a time ────────────────────────────────── */
  const ctlC = () => `
    <div class="parts">${seg(["Tiling", "Focus", "Workspaces", "Windows"], "Windows")}</div>
    ${ocard("Window controls", [orow("Adaptive window controls", "Nyx apps show one Close button that opens the rest.", sw(true)), orow("Open the rest after", "Resting the pointer on Close.", sl(40, "400 ms", 110))])}
    ${ocard("Nyx headerbar", [orow("Height", "On apps without controls of their own.", sl(33, "32 px", 110)), orow("Double-click to maximize", "Again to bring it back.", sw(true))])}
    ${ocard("Floating windows", [orow("Float where they were", "Tile a window and float it again: it goes back.", sw(true)), orow("Control on floating terminals", "A small button that opens the window menu.", sw(true)), orow("In the corner", "", `<span class="corners"><b class="on"></b><b></b><b></b><b></b></span>`)])}
    ${ocard("", [nrow("Each app's controls", "Headerbar, its own, or floating", "3 apps", { ic: "apps", sec: "desktop" })], { cls: "icons" })}`;
  const pvC = () => `
    ${pvHeadC()}
    <div class="wcstage" style="background:${wall("atlas-desk")}">
      <div class="wcwin"><div class="hb"><b>Files</b><span class="srch">${icon("search")}Search Pictures</span><span class="sp"></span>${ib("list")}<span class="xb">${icon("x")}</span></div>
        <div class="bd"><div class="sd"><b class="on"></b><b></b><b></b><b></b><b></b></div><div class="mn">${"<span></span>".repeat(8)}</div></div>
        <div class="wcpop">${[["minus", "Minimize", "Super H"], ["expand", "Maximize", "Super F"], ["layers", "Float", "Super T"], ["grid", "Move to workspace…", ""]].map(([ic, t, k], i) => `<div class="mi2 ${i === 1 ? "on" : ""}">${icon(ic)}<span>${t}</span><small>${k}</small></div>`).join("")}<div class="sep2"></div><div class="mi2 dz">${icon("x")}<span>Close</span><small>Super W</small></div></div>
      </div>
      ${ptr("right:calc(6% + 22px);top:44px")}
      <span class="wctag" style="right:calc(6% + 210px);top:58px">${icon("clock")}Opens after 400 ms</span>
    </div>
    <div class="wc2">
      <div class="card"><div class="mini-w" style="background:${wall("hb")}"><span class="hbm"><span>32 px</span><i class="br"></i></span><div class="w" style="left:24%;right:6%"><div class="hdb">Spreadsheet<span class="sp"></span><span class="x"></span></div><div class="ln" style="width:60%"></div><div class="ln" style="width:80%"></div><div class="ln" style="width:40%"></div></div></div><div class="cap2"><b>Nyx headerbar</b><span>Apps that draw no controls get a 32 px bar with a title and Close.</span></div></div>
      <div class="card"><div class="mini-w" style="background:${wall("tm")}"><div class="w" style="bottom:8px;border-radius:7px"><div class="tm"><span><b class="c1" style="width:20%"></b><b style="width:40%"></b></span><span><b class="c2" style="width:30%"></b><b style="width:30%"></b></span><span><b class="c1" style="width:20%"></b><b style="width:50%"></b></span></div><span class="cb">${icon("more")}</span></div></div><div class="cap2"><b>Floating terminals</b><span>A small button in the top-right corner opens the window menu.</span></div></div>
    </div>`;
  const pvHeadC = () => pvhead("Window controls", "Rest the pointer on a Nyx app's Close button and the others open.", "");

  /* ── The window ──────────────────────────────────────────────────── */
  const page = (body) => () => swin({ sec: "desktop", page: "Tiling & Workspaces", desc: "How windows share the screen, which one has focus, and how workspaces behave.", body: body() });

  REG("workspaces", {
    name: "Tiling & Workspaces",
    summary: "The longest page in Desktop: tiling with a preview and three picture cards, then focus, workspace habits, a strip of screens with ten workspace dropdowns, workspace rules, the scratchpad, window controls with a per-app list, and titlebars, all in one column. It has pictures for each switch, but you scroll a long way to find any one thing.",
    problems: [
      "<b>One very long column:</b> nine groups, from the layout to per-app window controls; the window controls and titlebars are several screens down, under the scratchpad.",
      "<b>The preview only shows the layout:</b> the big tiling picture at the top doesn't show gaps, focus or which workspace you're on, and doesn't change with the settings below it.",
      "<b>Ten dropdowns for ten workspaces:</b> with two screens, “Workspace 1 … Workspace 10” each get a row to pick a screen, next to a strip that already draws them.",
      "<b>A workspace's own settings live in a form:</b> name, layout, gaps and decorations are four dropdowns in a dialog, and the list shows them as “Scrolling · Large (10 / 20) · No borders…”.",
      "<b>Small pictures on every switch:</b> a thumbnail beside each row makes long rows longer, and the layout cards' two-line captions crowd at 800 px.",
      "<b>Gaps aren't here:</b> the page about tiling has gaps only per workspace; the ones everywhere are on Window Style, with no link.",
    ],
    today: [["workspaces-1280", "Today", ""], ["workspaces-800", "Today at 800 px", ""]],
    options: [
      { id: "a", name: "A tiled workspace", idea: "The preview is one workspace tiled with the chosen layout, its gaps marked, the window under the pointer focused and a dashed box where the next window opens; under it, the workspaces on each screen, with the ones that always exist filled. The controls keep only what you change often (layout, its two switches, focus); workspaces, their own settings, window controls and the scratchpad are rows that open their own pages.",
        shots: [["a-tiled", "A tiled workspace", "Layout, gaps, focus and the workspaces on each screen"], ["a-tiled-800", "At 800 px", "The workspace above the controls"]] },
      { id: "b", name: "Workspace by workspace", idea: "The controls list the workspaces by screen, with “Everywhere” at the top for the page-wide settings. Picking one shows it on the right with its own layout, gaps and window style, and its settings as plain choices under the picture (no form): each can stay “Same as everywhere”.",
        shots: [["b-workspace", "Workspace by workspace", "Workspace 4 · Writing: scrolling, large gaps, bare windows"]] },
      { id: "c", name: "Four parts", idea: "A bar at the top of the controls splits the page in four: Tiling, Focus, Workspaces and Windows, each short enough to fit without scrolling, each with its own picture. Windows, shown here, has a Nyx app with its Close button opened into the other controls, the headerbar other apps get, and the small control on floating terminals.",
        shots: [["c-windows", "The Windows part", "The Close button opened into the window controls"]] },
    ],
    pages: {
      "a-tiled": page(() => split(ctlA(), pvA(), { sec: "desktop" })),
      "b-workspace": page(() => split(ctlB(), pvB(), { sec: "desktop", ctlw: 380 })),
      "c-windows": page(() => split(ctlC(), pvC(), { sec: "desktop", ctlw: 420 })),
    },
    icons: { minus: '<path d="M5.5 12h13"/>' },
  });
})();
