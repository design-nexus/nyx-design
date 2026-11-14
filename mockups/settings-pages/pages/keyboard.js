// Input › Keyboard, in style B: a picture of the layout, or how typing feels.
(() => {
  const P = { sec: "input", page: "Keyboard", desc: "Layouts, what Caps Lock does, key repeat and the keyboard light." };

  /* ── The keyboard ────────────────────────────────────────────────── */
  const US = [
    [["Esc", 1.2], ["F1"], ["F2"], ["F3"], ["F4"], ["F5"], ["F6"], ["F7"], ["F8"], ["F9"], ["F10"], ["F11"], ["F12"], ["⌦", 1.3]],
    [["`"], ["1"], ["2"], ["3"], ["4"], ["5"], ["6"], ["7"], ["8"], ["9"], ["0"], ["-"], ["="], ["⌫", 1.8]],
    [["Tab", 1.5], ["Q"], ["W"], ["E"], ["R"], ["T"], ["Y"], ["U"], ["I"], ["O"], ["P"], ["["], ["]"], ["\\", 1.3]],
    [["Caps", 1.8], ["A"], ["S"], ["D"], ["F"], ["G"], ["H"], ["J"], ["K"], ["L"], [";"], ["'"], ["Return", 2]],
    [["Shift", 2.3], ["Z"], ["X"], ["C"], ["V"], ["B"], ["N"], ["M"], [","], ["."], ["/"], ["Shift", 2.5]],
    [["Ctrl", 1.4], ["Fn"], ["Super", 1.4], ["Alt", 1.2], ["", 6.2], ["Alt", 1.2], ["Ctrl", 1.4], ["←"], ["→"]],
  ];
  const DE = US.map((r) => r.map(([k, w]) => [({ "`": "^", "-": "ß", "=": "´", Y: "Z", "[": "Ü", "]": "+", ";": "Ö", "'": "Ä", "\\": "#", Z: "Y", "/": "-" })[k] ?? k, w]));
  DE[5][5] = ["Alt Gr", 1.2];
  /** o = { rows, mark: { key: [cls, label] }, rowIdx } */
  const keyboard = (o = {}) => `<div class="kb-map">${(o.rows || US).map((r, ri) => `<div class="kb-r">${r.map(([k, w = 1], ci) => {
    const m = (o.mark || {})[`${ri}:${ci}`] || (o.mark || {})[k];
    return `<span class="kb-k ${m ? m[0] : ""} ${k.length > 1 ? "w" : ""}" style="flex:${w}">${m && m[1] ? `<small>${k}</small><b>${m[1]}</b>` : k}</span>`;
  }).join("")}</div>`).join("")}</div>`;

  /* The repeat a held key makes: a wait, then ticks. */
  const repeat = (delay = 350, rate = 40, o = {}) => {
    const W = o.w || 520, total = 1000, x = (ms) => 10 + (ms / total) * (W - 20), ticks = [];
    for (let t = delay; t <= total; t += 1000 / rate) ticks.push(t);
    return `<svg class="kb-rep" viewBox="0 0 ${W} 74" preserveAspectRatio="none">
      <rect x="${x(0)}" y="18" width="${x(delay) - x(0)}" height="28" rx="6" class="wait"/>
      <line x1="${x(0)}" x2="${x(total)}" y1="46" y2="46" class="base"/>
      <line x1="${x(0)}" x2="${x(0)}" y1="10" y2="46" class="press"/>
      ${ticks.map((t) => `<line x1="${x(t)}" x2="${x(t)}" y1="30" y2="46" class="tick"/>`).join("")}
      <text x="${(x(0) + x(delay)) / 2}" y="36" text-anchor="middle">wait ${delay} ms</text>
      ${[0, 250, 500, 750, 1000].map((m) => `<text x="${x(m)}" y="66" text-anchor="${m === 0 ? "start" : m === 1000 ? "end" : "middle"}" class="ax">${m === 0 ? "press" : m === 1000 ? "1 s" : m + " ms"}</text>`).join("")}
    </svg>`;
  };

  /* ═══ A: the layout as a picture ═══════════════════════════════════ */
  const layouts = (on) => ocard("Layouts", [
    `<div class="opt ${on === 0 ? "picked" : ""}">${icon("grip", "kb-grip")}<span class="kb-flag">EN</span><div class="opt-text"><div>English (US)</div><div class="d">First · used at sign-in</div></div>${ib("x", "Remove")}</div>`,
    `<div class="opt ${on === 1 ? "picked" : ""}">${icon("grip", "kb-grip")}<span class="kb-flag">DE</span><div class="opt-text"><div>German</div><div class="d">No dead keys</div></div>${ib("x", "Remove")}</div>`,
    `<div class="opt"><span class="addi">${icon("plus")}</span><div class="opt-text"><div class="acc">Add a layout…</div></div></div>`,
  ], { first: true, act: `<span class="note">Drag to reorder</span>` });
  const picture = () => split(`
    ${layouts(0)}
    ${ocard("", [
      orow("Switch layouts with", "", dd("Both Alt keys"), { ic: "swipe-lr", sec: "input" }),
      orow("Caps Lock key", "Caps, ' then e types é", dd("Compose"), { ic: "keyboard", sec: "input" }),
      orow("Num Lock on at sign-in", "", sw(true), { ic: "lock", sec: "input" }),
    ], { cls: "icons" })}
    ${ocard("Typing", [
      orow("Repeat after", "", sl(31, "350 ms", 130), { ic: "clock", sec: "input" }),
      orow("Repeat speed", "", sl(43, "40 a second", 110), { ic: "repeat", sec: "input" }),
      orow("Keyboard light off after", "Without typing or touching", dd("30 seconds"), { ic: "sun", sec: "input" }),
    ], { cls: "icons kb-typ" })}`,
    `${pvhead("English (US)", "Press both Alt keys to switch to German; the bar shows which one you're on.", seg(["English (US)", "German"], "English (US)"))}
     <div class="kb-wrap card">${keyboard({ mark: { Caps: ["hot", "Compose"], "5:3": ["sw", ""], "5:5": ["sw", ""] } })}
       <div class="kb-legend"><span><i class="hot"></i>Caps Lock is Compose</span><span><i class="sw"></i>Both Alt keys switch layouts</span><span class="sp"></span><span class="dim">Click a key for more</span></div></div>
     <div class="kb-try card"><div class="kb-th"><b>Try it</b><span>Hold a key here to feel the repeat</span></div><div class="field kb-tf">Hello from Atlas — éèê aaaaaaaaaaaaaa<span class="kb-caret"></span></div>${repeat(350, 40)}</div>`, { sec: "input", cls: "kb-a" });

  /* ═══ B: how typing feels first; layouts in a sheet ════════════════ */
  const feel = () => split(`
    ${ocard("Typing", [
      orow("Repeat after", "", sl(31, "350 ms", 120), { ic: "clock", sec: "input" }),
      orow("Repeat speed", "", sl(43, "40 a second", 120), { ic: "repeat", sec: "input" }),
    ], { first: true, cls: "icons kb-typ" })}
    ${ocard("Keys", [
      nrow("Layouts", "English (US), German · both Alt keys switch", "2", { ic: "globe", sec: "input" }),
      orow("Caps Lock key", "", dd("Compose"), { ic: "keyboard", sec: "input" }),
      orow("Num Lock on at sign-in", "", sw(true), { ic: "lock", sec: "input" }),
    ], { cls: "icons" })}
    ${ocard("Keyboard light", [
      orow("Brightness", "", sl(66, "2 of 3", 120), { ic: "sun", sec: "input" }),
      orow("Turn off after", "Back on with the next key", dd("30 seconds"), { ic: "moon", sec: "input" }),
    ], { cls: "icons" })}`,
    `${pvhead("Holding a key", "What one held key types: a wait, then a steady stream.", btn("Reset", "sm ghost", "refresh"))}
     <div class="card kb-big">${repeat(350, 40, { w: 560 })}
       <div class="kb-out">${'<b>a</b>'.repeat(1)}<span class="gap">350 ms</span>${"<b>a</b>".repeat(26)}</div>
       <div class="kb-tf2 field">Hold a key here to try it<span class="kb-caret"></span></div></div>
     <div class="kb-cmp">${[["Slower", "500 ms · 25/s", "For careful typing"], ["Yours", "350 ms · 40/s", "", true], ["Faster", "200 ms · 60/s", "For coding and games"]].map(([n, v, d, on]) => `<div class="card ${on ? "on" : ""}"><b>${n}</b><span>${v}</span>${d ? `<small>${d}</small>` : `<small>Set on the left</small>`}</div>`).join("")}</div>
     <div class="card kb-light"><div class="kb-th"><b>Keyboard light</b><span>On while you type, off 30 s after you stop</span></div>
       <div class="kb-glow">${keyboard()}</div><div class="kb-lt"><span class="on" style="width:42%">Typing</span><span class="fade" style="width:30%">30 s</span><span class="off">Off until the next key</span></div></div>`, { sec: "input", cls: "kb-b" });

  const LAYS = [["German", "Deutsch", true], ["German (no dead keys)", "Deutsch"], ["German (Switzerland)", "Deutsch (Schweiz)"], ["French", "Français"], ["Spanish", "Español"], ["Swedish", "Svenska"], ["English (UK)", ""], ["English (US, international)", "Accents with ' and `"]];
  const addSheet = () => dialog("Add a layout", "", [btn("Cancel"), btn("Add German", "primary")], `
    <div class="kb-dlg">
      <div class="kb-dl"><div class="field focus">${icon("search")}<span>Ger</span><span class="kb-caret"></span></div>
        <div class="card">${LAYS.slice(0, 6).map(([n, d, on]) => `<div class="opt ${on ? "picked" : ""}"><div class="opt-text"><div>${n}</div>${d ? `<div class="d">${d}</div>` : ""}</div>${on ? icon("check", "okc") : ""}</div>`).join("")}</div></div>
      <div class="kb-dp"><div class="kb-th"><b>German</b><span>QWERTZ · Ü, Ö, Ä and ß on their own keys</span></div>
        <div class="kb-wrap card">${keyboard({ rows: DE, mark: { Z: ["hot", ""], Y: ["hot", ""], "Ü": ["hot", ""], "Ö": ["hot", ""], "Ä": ["hot", ""], "ß": ["hot", ""] } })}</div>
        <div class="kb-legend"><span><i class="hot"></i>Different from English (US)</span></div>
        <div class="kb-opt">${dd("Variant: standard")}<span class="dim">Dead keys: ´ then e types é</span></div></div>
    </div>`, 820);

  REG("keyboard", {
    name: "Keyboard",
    summary: "A short page of three groups: layouts and variants typed as xkb codes (“us,de”), a Caps Lock dropdown whose current value can show as “Custom: omarchy:shift_caps_compose”, and repeat rate and delay sliders. The keyboard light's timeout lives on Power & Battery, and nothing shows what a layout or a repeat setting means.",
    problems: [
      "<b>Layouts are typed codes:</b> “Comma-separated xkb codes, e.g. us, us,de or gb,fr” in a text box, with variants in a second box that has to line up with the first.",
      "<b>No way to see a layout:</b> nothing shows where Z, Ü or the accents are before you switch to it.",
      "<b>Caps Lock reads as config:</b> the dropdown can say “Custom: omarchy:shift_caps_compose”, and how to switch layouts is hidden in the same list (“Compose, and Left+Right Alt switch layouts”).",
      "<b>Repeat rate and delay are bare numbers</b> (40/s, 350 ms), with no place to try them.",
      "<b>The keyboard light is on another page:</b> its brightness and timeout are under Power & Battery.",
      "<b>Lots of empty space</b> under three short cards at 1280 px.",
    ],
    today: [["keyboard-1280", "Today", ""], ["keyboard-800", "Today at 800 px", ""]],
    options: [
      { id: "a", name: "Layout picture", idea: "Layouts are a list you reorder and add to by name, with how to switch between them right under it. The right side is the keyboard as it types in the picked layout, with the Caps Lock and layout-switch keys marked by what they now do; switching the chip above it redraws the keys. Under it, a Try it box with a strip that draws what one held key does at your repeat settings.",
        shots: [["a-picture", "English (US), Caps Lock as Compose", ""], ["a-picture-800", "At 800 px", ""]] },
      { id: "b", name: "Feel first", idea: "The page leads with how typing feels: the repeat sliders, then a large picture of one held key (the wait, then the stream of letters), a test box, and Slower and Faster beside yours to compare. The keyboard light joins the page with its own timeline. Layouts are one row that opens a sheet: search by name and see the layout's keyboard, with the keys that differ marked, before you add it.",
        shots: [["b-feel", "Repeat and the keyboard light", ""], ["b-add", "Adding a layout", "German, with its different keys marked"]] },
    ],
    icons: {
      grip: '<path d="M9 6h.01M15 6h.01M9 12h.01M15 12h.01M9 18h.01M15 18h.01" stroke-width="2.6"/>',
    },
    pages: {
      "a-picture": () => swin({ ...P, body: picture() }),
      "b-feel": () => swin({ ...P, body: feel() }),
      "b-add": () => swin({ ...P, body: feel(), over: addSheet() }),
    },
  });
})();
