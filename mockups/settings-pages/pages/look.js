// Personalization › Window Style: gaps, borders, rounding, transparency, blur, shadows, animations, cursor.
(() => {
  const S = "personalization";
  // A tiled desktop drawn with the style's numbers: o = { g, o, bw, r, sh, bl, op, dim, tags, bar, cls, hot }
  const wdesk = (o = {}) => {
    const v = { g: 10, o: 14, bw: 2, r: 10, sh: 18, bl: 8, op: 0.78, dim: 0.18, bh: 24, ...o };
    const st = `--g:${v.g}px;--o:${v.o}px;--bw:${v.bw}px;--r:${v.r}px;--bl:${v.bl}px;--op:${v.op};--dim:${v.dim};--bh:${v.bar === false ? 0 : v.bh}px;--shd:${v.sh ? `0 ${Math.round(v.sh / 3)}px ${v.sh}px rgba(0,0,0,.5)` : "none"}`;
    const tag = (cls, t) => o.tags ? `<span class="wtag ${cls} ${o.hot === cls ? "hot" : ""}">${t}</span>` : "";
    return `<div class="wd ${o.cls || ""}" style="${st}">
      <div class="wd-wall"><i class="b1"></i><i class="b2"></i><i class="b3"></i></div>
      ${v.bar === false ? "" : `<div class="wd-bar"><span class="ws"><b class="on"></b><b></b><b></b><b></b></span><span class="clk">Fri 14:17</span><span class="tray">${icon("wifi")}${icon("volume")}${icon("battery")}</span></div>`}
      <div class="wd-area">
        <div class="wd-w f"><div class="wd-in"><div class="side"><b class="on"></b><b></b><b></b><b></b><b></b></div><div class="main"><span class="l w70"></span><span class="l w40 dim"></span><span class="row on"></span><span class="row"></span><span class="row"></span><span class="row"></span></div></div>
          ${tag("gap", `Gap ${v.g}`)}${tag("edge", `Edge ${v.o}`)}${tag("border", `Border ${v.bw}`)}</div>
        <div class="wd-w t glass"><div class="wd-in term"><span><b class="c1"></b><b class="w40"></b></span><span><b class="c2"></b><b class="w60"></b></span><span><b class="c3"></b><b class="w30"></b></span><span><b class="c1"></b><b class="w50"></b></span><span><b class="c1"></b><b class="cur"></b></span></div>${tag("corner", `Corners ${v.r}`)}${tag("glass", "See-through, blurred")}</div>
        <div class="wd-w n"><div class="wd-in note"><span class="l w60"></span><span class="l w90 dim"></span><span class="l w80 dim"></span><span class="l w50 dim"></span></div>${tag("shadow", `Shadow ${v.sh}`)}</div>
      </div>
    </div>`;
  };
  const px = (n, max, w = 120) => sl(Math.round((n / max) * 100), `${n} px`, w);
  const pct = (n, w = 120) => sl(n, `${n}%`, w);

  /* ═══ A: every slider beside one preview ═══════════════════════════ */
  const aCtl = () => `
    ${ocard("Spacing", [orow("Inner gaps", "Between windows", px(10, 40)), orow("Outer gaps", "At the screen's edge", px(14, 40))], { first: true })}
    ${ocard("Borders & corners", [orow("Border width", "", px(2, 10)), orow("Corner rounding", "", px(10, 30)), orow("Resize from borders", "", sw(true))])}
    ${ocard("Glass & shadow", [orow("Unfocused windows", "Opacity", pct(90)), orow("Blur behind windows", "Frosted, so text stays readable", sw(true)), orow("Shadows", "Lift windows off the wallpaper", sw(true))])}
    ${ocard("", [nrow("Blur, shadow and cursor details", "", "", { ic: "sliders", sec: S }), nrow("Animations", "", "On", { ic: "play", sec: S })], { cls: "icons" })}`;
  const PRESETS = [["Omarchy", { g: 5, o: 10, bw: 2, r: 0, sh: 0 }], ["Tight", { g: 2, o: 2, bw: 1, r: 0, sh: 0 }], ["Airy", { g: 16, o: 24, bw: 2, r: 8, sh: 14 }], ["Soft", { g: 10, o: 14, bw: 2, r: 10, sh: 18 }], ["Glass", { g: 10, o: 14, bw: 1, r: 12, sh: 22, op: 0.55 }], ["Flat", { g: 8, o: 8, bw: 0, r: 4, sh: 0 }]];
  const aPv = () => `
    ${pvhead("Live preview", "The focused window is on the left. It changes as you drag.", btn("Undo", "sm ghost", "history"))}
    <div class="lk-stage">${wdesk({ tags: true, cls: "big" })}</div>
    <div class="lk-pre"><span class="dim">Start from</span>${PRESETS.map(([n]) => chip(n, n === "Soft" ? "on" : "")).join("")}</div>`;

  /* ═══ B: start from a style ════════════════════════════════════════ */
  const bCtl = () => `
    <div class="gtitle first">Styles</div>
    <div class="lk-grid">${PRESETS.map(([n, p]) => `<div class="lk-p ${n === "Airy" ? "on" : ""} ${n === "Omarchy" ? "cur" : ""}"><div class="lk-th">${wdesk({ ...p, g: Math.max(1, Math.round(p.g / 2)), o: Math.max(1, Math.round(p.o / 2)), r: Math.round(p.r / 1.6), bw: Math.min(1.5, p.bw), sh: Math.round(p.sh / 2), bar: false, cls: "th" })}</div><b>${n}</b><small>${n === "Omarchy" ? "Yours now" : n === "Airy" ? "Previewing" : ""}</small></div>`).join("")}</div>
    ${ocard("Fine-tune", [
      nrow("Spacing", "", "5 · 10 px", { ic: "grid", sec: S }),
      nrow("Borders & corners", "", "2 px · square", { ic: "window", sec: S }),
      nrow("Transparency & blur", "", "Off", { ic: "layers", sec: S }),
      nrow("Shadows", "", "Off", { ic: "moon", sec: S }),
      nrow("Animations & cursor", "", "On · 24 px", { ic: "play", sec: S }),
    ], { cls: "icons" })}
    <div class="lk-save">${btn("Save mine as a style", "ghost", "plus")}</div>`;
  const diff = (k, a, b) => `<div class="lk-d"><span>${k}</span><s>${a}</s>${icon("chev-r")}<b>${b}</b></div>`;
  const bPv = () => `
    ${pvhead("Airy", "Wide gaps, a little rounding and soft shadows. Good on big screens.", "")}
    <div class="lk-stage">${wdesk({ ...PRESETS[2][1], cls: "big" })}</div>
    <div class="card lk-diff"><div class="lk-dh">What changes from yours</div><div class="lk-dg">${diff("Inner gaps", "5", "16 px")}${diff("Outer gaps", "10", "24 px")}${diff("Rounding", "0", "8 px")}${diff("Shadows", "Off", "14 px")}</div>
      <div class="lk-db">${btn("Keep mine", "ghost")}${btn("Use Airy", "primary", "check")}</div></div>`;

  const subHead = (t) => `<div class="lk-back">${btn("Window Style", "ghost sm", "chev-l")}<b>${t}</b></div>`;
  const bGlassCtl = () => `
    ${subHead("Transparency & blur")}
    ${ocard("Transparency", [orow("Focused window", "", pct(100)), orow("Unfocused windows", "", pct(85)), orow("Dim unfocused windows", "So the one you're using stands out", sw(true)), orow("Dim amount", "", pct(20))])}
    ${ocard("Blur", [orow("Blur", "Behind see-through windows, the bar and menus", sw(true)), orow("Blur size", "", sl(40, "8", 120)), orow("Blur passes", "More passes look smoother", sl(50, "2", 120)), orow("Vibrancy", "How colourful the blur stays", sl(17, "0.17", 120))])}`;
  const bGlassPv = () => `
    ${pvhead("Transparency & blur", "The terminal is see-through; the notes window is dimmed.", "")}
    <div class="lk-stage">${wdesk({ g: 10, o: 14, r: 10, sh: 18, op: 0.6, bl: 10, dim: 0.28, cls: "big" })}</div>
    <div class="card lk-cost"><span class="lic" style="--tc:var(--sec-${S})">${icon("cpu")}</span><div class="opt-text"><div>Light on the graphics card</div><div class="d">Size 8 with 2 passes. Raise them and blur costs more GPU time.</div></div><span class="lk-meter"><i class="on"></i><i class="on"></i><i></i><i></i><i></i></span></div>`;

  /* ═══ C: pick a part ═══════════════════════════════════════════════ */
  const PARTS = [["grid", "Gaps", "10 px between · 14 at the edge"], ["window", "Corners & border", "10 px round · 2 px border"], ["layers", "Glass", "Unfocused 90% · blur on"], ["moon", "Shadow", "18 px, soft"], ["play", "Motion", "Animations on"], ["mouse", "Cursor", "24 px · hides while typing"]];
  const partList = (on) => `<div class="card lk-parts">${PARTS.map(([ic, n, d]) => `<div class="opt ${n === on ? "picked" : ""}"><span class="lic" style="--tc:var(--sec-${S})">${icon(ic)}</span><div class="opt-text"><div>${n}</div><div class="d">${d}</div></div>${icon("chev-r", "cv")}</div>`).join("")}</div>`;
  const cCtl = () => `
    ${partList("Corners & border")}
    ${ocard("Corners & border", [orow("Corner rounding", "", px(10, 30, 130)), orow("Border width", "", px(2, 10, 130)), orow("Resize from borders", "Drag an edge to resize", sw(true)), nrow("Border colours", "From the theme", "Tokyo Night", { ic: "palette", sec: S })], { cls: "lk-sel" })}`;
  const cPv = () => `
    ${pvhead("Corners & border, up close", "Two windows' corners where they meet, at four times their size.", seg(["Up close", "Whole screen"], "Up close"))}
    <div class="lk-zoom">
      <div class="zw a"><div class="zh"><i></i><i></i><i></i></div><div class="zl"><span class="l w60"></span><span class="l w40 dim"></span><span class="l w80 dim"></span></div></div>
      <div class="zw b"><div class="zh"><i></i><i></i><i></i></div><div class="zl"><span class="l w50"></span><span class="l w70 dim"></span></div></div>
      <svg class="zm" viewBox="0 0 100 100" preserveAspectRatio="none"></svg>
      <i class="zarc"></i><span class="zr"><b>10 px</b>rounding</span>
      <span class="zbw"><b>2 px</b>border</span>
      <span class="zg"><b>10 px</b>gap</span>
    </div>
    ${pvfoot("Rounding above 12 px clips the corners of some terminal apps.", "info")}`;
  const cMotionCtl = () => `
    ${partList("Motion")}
    ${ocard("Motion", [orow("Animations", "Windows and workspaces slide and fade", sw(true)), orow("Animate resizing", "Smooth out keyboard and mouse resizes", sw(false))], { cls: "lk-sel" })}`;
  const frame = (t, cls, s) => `<div class="lk-f"><div class="lk-fs">${s}</div><small>${t}</small></div>`;
  const cMotionPv = () => `
    ${pvhead("Motion", "How a window opens and a workspace changes, frame by frame.", btn("Play", "sm", "play"))}
    <div class="lk-film card"><div class="lk-fh">Opening a window</div><div class="lk-fr">
      ${[0, 1, 2, 3].map((i) => frame(["0 ms", "80 ms", "160 ms", "240 ms"][i], "", `<i class="w1"></i><i class="w2" style="transform:scale(${0.7 + i * 0.1});opacity:${0.2 + i * 0.27}"></i>`)).join("")}
    </div></div>
    <div class="lk-film card"><div class="lk-fh">Switching workspace</div><div class="lk-fr">
      ${[0, 1, 2, 3].map((i) => frame(["0 ms", "100 ms", "200 ms", "300 ms"][i], "", `<i class="ws1" style="transform:translateX(${-i * 34}%)"></i><i class="ws2" style="transform:translateX(${100 - i * 34}%)"></i>`)).join("")}
    </div></div>
    <div class="lk-film card off"><div class="lk-fh">Resizing <span class="pill" style="--tc:var(--text-tertiary)">Off</span></div><div class="lk-fr">
      ${[0, 1, 2, 3].map((i) => frame(["0 ms", "", "", "Instant"][i], "", `<i class="w1" style="width:${i < 3 ? 42 : 56}%"></i><i class="w2" style="left:${i < 3 ? 52 : 66}%;width:${i < 3 ? 42 : 28}%"></i>`)).join("")}
    </div></div>
    ${pvfoot("Turning animations off makes everything instant; it also helps on slow graphics.", "info")}`;

  const W = (body, over = "") => swin({ sec: S, page: "Window Style", desc: "Gaps, borders, rounding, transparency, blur, shadows and animations.", body, over });
  REG("look", {
    name: "Window Style",
    summary: "A small preview of two windows at the top, then sliders for gaps, borders and rounding; transparency, blur, shadows, animations and the cursor are folded groups further down. The preview is there, but it's a thin strip that barely shows what each slider does.",
    problems: [
      "<b>The preview is a strip:</b> two flat grey panels 160 px tall; gaps, rounding and borders at their real sizes are hard to see in it, and blur and shadows don't show at all.",
      "<b>The preview scrolls away:</b> it's the first row of the page, so by the time you reach Blur or Shadows it's off the top.",
      "<b>Sliders with nothing to compare:</b> “Inner gaps 0 px” and “Corner rounding 0 px” give no sense of what a good value is; there's no starting point but zero.",
      "<b>Half the page is folded:</b> Transparency, Blur, Shadows, Animations and Cursor are collapsed groups, each with three or four sliders.",
      "<b>Plumbing in plain view:</b> Cursor shows XCURSOR_THEME and HYPRCURSOR_SIZE; blur passes and vibrancy sit beside everyday settings.",
    ],
    today: [["look-1280", "Today", ""], ["look-800", "Today at 800 px", ""]],
    options: [
      { id: "a", name: "Every slider beside one preview", idea: "The everyday settings are three short cards (spacing, borders and corners, glass and shadow) beside a large tiled desktop that redraws as you drag, with the numbers labelled on it where they apply. Presets under the preview give a starting point. Blur and shadow details, animations and the cursor are rows that open their own pages.",
        shots: [["a", "Soft style, labelled", "Each number sits where it shows"], ["a-800", "At 800 px", "The preview above the sliders"]] },
      { id: "b", name: "Start from a style", idea: "The page opens on six styles, each drawn small. Clicking one shows it large with what would change from yours, and nothing changes until you use it. Fine-tuning is a list of five rows, each opening a page with its sliders beside the same preview.",
        shots: [["b", "Previewing Airy", "What changes, before you use it"], ["b-glass", "Transparency & blur", "One of the fine-tune pages"]] },
      { id: "c", name: "Pick a part", idea: "A list of the parts of a window's look (gaps, corners and border, glass, shadow, motion, cursor) with their values. Picking one opens its few settings under the list and shows that part up close: the corners at four times their size with the numbers on them, or the animations frame by frame.",
        shots: [["c", "Corners & border", "The corner up close"], ["c-motion", "Motion", "Opening a window and switching workspace, frame by frame"]] },
    ],
    pages: {
      a: () => W(split(aCtl(), aPv(), { sec: S, ctlw: 420, cls: "lk-a" })),
      b: () => W(split(bCtl(), bPv(), { sec: S, ctlw: 400, cls: "lk-b" })),
      "b-glass": () => W(split(bGlassCtl(), bGlassPv(), { sec: S, ctlw: 420, cls: "lk-b" })),
      c: () => W(split(cCtl(), cPv(), { sec: S, ctlw: 400, cls: "lk-c" })),
      "c-motion": () => W(split(cMotionCtl(), cMotionPv(), { sec: S, ctlw: 400, cls: "lk-c" })),
    },
  });
})();
