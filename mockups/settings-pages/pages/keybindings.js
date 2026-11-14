// Desktop › Keyboard Shortcuts, in style B: a keyboard map, or a list with an editor beside it.
(() => {
  const P = { sec: "desktop", page: "Keyboard Shortcuts", desc: "What every key combination does, and your own." };

  /* ── Sample data ─────────────────────────────────────────────────── */
  // [icon, name, count, swatch]
  const CATS = [["apps", "Apps & menus", 52, "blue"], ["window", "Windows", 48, "violet"], ["grid", "Workspaces & monitors", 46, "pink"], ["screenshot", "Screenshots & recording", 12, "teal"], ["volume", "Media & hardware", 32, "amber"], ["user", "Your own", 6, "green"]];
  const WIN_KEYS = [["Close the window", ["Super", "W"]], ["Full screen", ["Super", "F"]], ["Float or tile", ["Super", "T"]], ["Split the other way", ["Super", "J"]], ["Focus left or right", ["Super", "←", "→"]], ["Swap with the next window", ["Super", "Shift", "←"]], ["Grow the window", ["Super", "="]], ["Shrink the window", ["Super", "-"]], ["Pin on every workspace", ["Super", "P"]]];
  // [what, keys, runs]
  const MINE = [["Open Notes", ["Super", "N"], "nyx-notes"], ["Emoji picker", ["Super", "E"], "nyx-emoji"], ["Night Light on or off", ["Super", "Shift", "N"], "nyx-nightlight toggle"], ["Task Manager", ["Super", "Ctrl", "Esc"], "nyx-activity"], ["Weather", ["Super", "Alt", "W"], "nyx-weather"], ["Clipboard history", ["Super", "Ctrl", "V"], "nyx-clipboard"]];

  /* ── The keyboard ────────────────────────────────────────────────── */
  const KMAP = { W: "violet", F: "violet", T: "violet", J: "violet", P: "violet", G: "violet", "=": "violet", "-": "violet", "←": "violet", "→": "violet", Return: "blue", B: "blue", N: "green", E: "blue", M: "blue", Space: "blue", V: "blue", K: "blue", A: "blue", C: "blue", "1": "pink", "2": "pink", "3": "pink", "4": "pink", "5": "pink", "6": "pink", "7": "pink", "8": "pink", "9": "pink", "0": "pink", S: "pink", Tab: "pink", R: "teal", Y: "teal", Print: "teal", F1: "amber", F2: "amber", F3: "amber", F5: "amber", F6: "amber", F10: "amber", L: "amber", O: "green" };
  const KROWS = [
    [["Esc", 1.2], ["F1"], ["F2"], ["F3"], ["F4"], ["F5"], ["F6"], ["F7"], ["F8"], ["F9"], ["F10"], ["F11"], ["F12"], ["Print", 1.3]],
    [["`"], ["1"], ["2"], ["3"], ["4"], ["5"], ["6"], ["7"], ["8"], ["9"], ["0"], ["-"], ["="], ["⌫", 1.8]],
    [["Tab", 1.5], ["Q"], ["W"], ["E"], ["R"], ["T"], ["Y"], ["U"], ["I"], ["O"], ["P"], ["["], ["]"], ["\\", 1.3]],
    [["Caps", 1.8], ["A"], ["S"], ["D"], ["F"], ["G"], ["H"], ["J"], ["K"], ["L"], [";"], ["'"], ["Return", 2]],
    [["Shift", 2.3], ["Z"], ["X"], ["C"], ["V"], ["B"], ["N"], ["M"], [","], ["."], ["/"], ["Shift", 2.5]],
    [["Ctrl", 1.4], ["Fn"], ["Super", 1.4], ["Alt", 1.2], ["Space", 6.2], ["Alt", 1.2], ["Ctrl", 1.4], ["←"], ["→"]],
  ];
  /** o = { sel, clash, lit: [keys lit plainly], map } */
  const keyboard = (o = {}) => {
    const map = o.map || KMAP, lit = o.lit || [];
    return `<div class="kbmap">${KROWS.map((r) => `<div class="kr">${r.map(([k, w = 1]) => {
      const c = map[k];
      const cls = k === "Super" || lit.includes(k) ? "mod" : k === o.sel ? "sel" : k === o.clash ? "has clash" : c ? "has" : "";
      return `<span class="ky ${cls}" style="flex:${w};${c ? `--kc:var(--sw-${c})` : ""}">${k}</span>`;
    }).join("")}</div>`).join("")}</div>`;
  };
  const krow = (t, k, o = {}) => `<div class="opt ${o.on ? "picked" : ""}"><div class="opt-text"><div>${t}</div>${o.d ? `<div class="d">${o.d}</div>` : ""}</div>${keys(...k)}</div>`;

  /* ═══ A: the keyboard map ═══════════════════════════════════════════ */
  const mapPage = () => split(`
    <div class="field focus">${icon("search")}<span class="ph">Search 196 shortcuts, or press the keys</span></div>
    <div class="kcats">${CATS.map(([, n, cnt, c]) => `<span class="kcat ${n === "Windows" ? "on" : ""}" style="--kc:var(--sw-${c})"><i></i>${n}<small>${cnt}</small></span>`).join("")}</div>
    <div class="kb-clash card">${icon("warn")}<div class="opt-text"><div>Super + E does two things</div><div class="d">Files, and your Emoji picker.</div></div>${btn("Fix", "sm")}</div>
    ${ocard("Windows", WIN_KEYS.slice(0, 7).map(([t, k], i) => krow(t, k, { on: i === 1 })), { act: btn("Add", "sm", "plus") })}
    ${ocard("", [nrow("Turned off", "Free keys you can give to something else", "3", { ic: "eye2", sec: "desktop" })], { cls: "icons kb-more" })}`,
    `${pvhead("Super and…", "The keys that do something with Super held, coloured by what they do. Click one to change it.", seg(["Super", "+ Shift", "+ Alt", "+ Ctrl"], "Super"))}
     <div class="kbwrap card">${keyboard({ sel: "F", clash: "E" })}
       <div class="kpop"><span class="kf">F</span><div><b>Super + F: Full screen</b><span>Windows · Super + Shift + F is full screen with the bar kept</span></div><div class="bts">${btn("Change", "sm")}${btn("Turn off", "sm ghost")}</div></div></div>
     <div class="klegend">${CATS.slice(0, 5).map(([, n, , c]) => `<span><i style="background:var(--sw-${c})"></i>${n}</span>`).join("")}<span><i style="background:var(--sw-green)"></i>Your own</span><span><i class="free"></i>Free</span></div>
     <div class="kb-layers">${[["Super", "38 used", "21 free", true], ["Super + Shift", "34 used", "25 free"], ["Super + Alt", "12 used", "47 free"], ["Super + Ctrl", "9 used", "50 free"]].map(([n, u, f, on]) => `<div class="card ${on ? "on" : ""}"><b>${n}</b><span>${u} · ${f}</span></div>`).join("")}</div>
     ${pvfoot("Free with Super alone: U, I, D, H, X, Z and more.", "info")}`, { sec: "desktop", cls: "kb-a" });

  /* ═══ B: a list, and an editor for the one you picked ═══════════════ */
  const listCol = (sel) => `
    <div class="field">${icon("search")}<span class="ph">Search 196 shortcuts</span>${btn("Press keys", "sm ghost", "keyboard")}</div>
    ${ocard("Your shortcuts", MINE.slice(0, 4).map(([t, k, c], i) => `<div class="opt ${i === sel ? "picked" : ""}"><div class="opt-text"><div>${t}</div><div class="d mono">${c}</div></div>${i === 1 ? `<span class="pill kb-pill" style="--tc:var(--warning)">${icon("warn")}Clash</span>` : ""}${keys(...k)}</div>`).concat([`<div class="opt kb-all"><div class="opt-text"><div class="acc">Show all 6</div></div></div>`]), { act: btn("Add", sel === -1 ? "sm primary" : "sm", "plus") })}
    ${ocard("Built in", CATS.slice(0, 5).map(([ic, n, cnt]) => nrow(n, "", String(cnt), { ic, sec: "desktop" })).concat([nrow("Turned off", "", "3", { ic: "eye2", sec: "desktop" })]), { cls: "icons kb-cats" })}`;
  const midKeys = (o) => `<div class="kb-mid card"><div class="kb-mh">Keys used with Super</div>${keyboard(o)}</div>`;

  const editor = () => split(listCol(0), `
    ${pvhead("Open Notes", "One of your shortcuts · added in March", `${btn("Delete", "sm ghost", "trash")}`)}
    <div class="kb-hero card">
      <div class="kb-big">${["Super", "N"].map(kbd).join('<span class="plus">+</span>')}</div>
      <div class="kb-ok">${icon("check-c")}Nothing else uses these keys</div>
    </div>
    <div class="card kb-form">
      ${orow("Keys", "", `<span class="kc">${kbd("Super")}${kbd("N")}</span>${btn("Record new keys", "sm", "keyboard")}`)}
      ${orow("Name", "Shown in Super + K", `<span class="field kb-in">Open Notes</span>`)}
      ${orow("Runs", "A command or an app", `<span class="field kb-in mono">nyx-notes</span>${dd("Command")}`)}
    </div>
    ${midKeys({ sel: "N" })}
    ${pvfoot("Changes take effect as soon as you save; no need to sign out.", "check-c", btn("Save", "primary"))}`, { sec: "desktop", cls: "kb-b" });

  const adding = () => split(listCol(-1), `
    ${pvhead("New shortcut", "Press the keys, then say what they do.", btn("Cancel", "sm ghost"))}
    <div class="kb-hero card rec">
      <div class="kb-big">${["Super", "E"].map(kbd).join('<span class="plus">+</span>')}</div>
      <div class="kb-listen"><span class="dot"></span>Listening: let go when you're done, or press Esc</div>
    </div>
    <div class="banner2 warn kb-ban">${icon("warn")}<div class="tx"><b>Super + E opens Files</b><span>Yours will take its place, and Files moves to Turned off.</span></div>${btn("Use other keys", "sm")}</div>
    <div class="kb-free"><span>Free nearby</span>${["Super + U", "Super + I", "Super + D", "Super + Alt + E"].map((k) => chip(k)).join("")}</div>
    <div class="card kb-form">
      ${orow("Name", "", `<span class="field kb-in"><span class="ph">Like “Open the calculator”</span></span>`)}
      ${orow("Runs", "", `<span class="field kb-in mono"><span class="ph">Command</span></span>${dd("Command")}`)}
    </div>
    ${midKeys({ clash: "E", map: { ...KMAP, E: "blue" } })}
    ${pvfoot("Shortcuts you add replace whatever the keys did before.", "info", btn("Add shortcut", "primary"))}`, { sec: "desktop", cls: "kb-b" });

  REG("keybindings", {
    name: "Keyboard Shortcuts",
    summary: "Today the page is your own shortcuts, an Add form that unfolds, and then all 196 built-in shortcuts as one long list in five groups, each row with keycaps joined by “+” and a switch. You can't see which keys are free, and a clash only shows up while you're typing keys into the form.",
    problems: [
      "<b>196 rows, one switch each:</b> the list is the whole page; groups are only found by scrolling, and the filter is halfway down.",
      "<b>No picture of the keyboard:</b> there's no way to see which keys Super already uses, or which are free for something new.",
      "<b>Clashes hide in the form:</b> “These keys already do …” appears only while typing into Add a shortcut; two shortcuts on the same keys never show on the page.",
      "<b>Typing Hyprland's syntax:</b> the keys box wants “SUPER + ALT + K”, the command line is raw, and Record sits beside it as an afterthought.",
      "<b>Turned off is a separate fold</b> whose rows all read “Off”, so you can't tell what each one used to do.",
      "<b>Your shortcuts show the command, not what it does:</b> “nyx-activity” in monospace under each name.",
    ],
    today: [["keybindings-1280", "Today", ""], ["keybindings-800", "Today at 800 px", ""]],
    options: [
      { id: "a", name: "Keyboard map", idea: "The keyboard is the page: every key that does something with Super is coloured by its group, free keys are blank, and a clash is outlined in amber. The modifier switch above it (Super, + Shift, + Alt, + Ctrl) shows each layer. Click a key to see what it does and change or turn it off; the list on the left follows the group chip you pick, and search also takes a key press.",
        shots: [["a-map", "Super's keys, coloured by group", "Full screen is picked; Super + E has a clash"], ["a-map-800", "At 800 px", "The keyboard above, the list under it"]] },
      { id: "b", name: "List and editor", idea: "Your shortcuts come first on the left, with the built-in ones as six groups that open their own list. Picking any shortcut opens it on the right as big keycaps you can re-record, its name and what it runs, a small keyboard with its keys lit, and a plain line saying whether anything else uses them. Adding one starts by listening for the keys and offers free keys nearby when the ones you pressed are taken.",
        shots: [["b-edit", "Editing one of your shortcuts", ""], ["b-add", "Adding one: the keys are taken", "Files already uses Super + E"]] },
    ],
    pages: {
      "a-map": () => swin({ ...P, body: mapPage() }),
      "b-edit": () => swin({ ...P, body: editor() }),
      "b-add": () => swin({ ...P, body: adding() }),
    },
  });
})();
