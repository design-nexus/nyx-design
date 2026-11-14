// Desktop › Startup & Rules, in style B: a sign-in timeline and rule previews, or everything per app.
(() => {
  const P = { sec: "desktop", page: "Startup & Rules", desc: "Programs that start when you sign in, and how windows and the shell behave." };

  /* ── Sample data ─────────────────────────────────────────────────── */
  const AP = { chat: ["chat", "Chat", "green"], music: ["music", "Music", "pink"], calc: ["grid", "Calculator", "graphite"], pip: ["film", "Picture-in-Picture", "coral"], backup: ["cloud", "Backup helper", "blue"], mail: ["mail", "Mail", "blue"], bar: ["bar", "Bar", "violet"], menus: ["list", "Menus and launcher", "violet"], term: ["terminal", "Terminal", "graphite"], web: ["globe", "Browser", "coral"], print: ["printer", "Print queue", "teal"], snap: ["hist", "Snapshot alerts", "amber"], clip: ["copy", "Clipboard history", "teal"] };
  const ai = (k, cls = "") => { const [ic, , c] = AP[k]; return `<span class="rl-ai ${cls}" style="--ac:var(--sw-${c})">${icon(ic)}</span>`; };
  const tabs = (on) => `<div class="rl-tabs">${seg(["Startup", "Window rules", "Shell rules"], on)}</div>`;

  /* A mini desktop: tiled windows, and the rule's window drawn as it would open. o = { float, pin, ws } */
  const desk = (o = {}) => `<div class="rl-desk" style="--wl:${wall("rules-desk")}">
      <div class="rl-bar"><span class="rl-ws">${[1, 2, 3, 4, 5].map((n) => `<b class="${n === (o.ws || 2) ? "on" : ""}">${n}</b>`).join("")}</span><span class="rl-clock">Fri 14:20</span></div>
      <div class="rl-win t1"><i></i><span></span><span class="s"></span><span></span></div>
      <div class="rl-win t2"><i></i><span class="s"></span><span></span></div>
      <div class="rl-win t3"><i></i><span></span><span class="s"></span></div>
      ${o.float ? `<div class="rl-win fl">${ai(o.float)}<div class="rl-calc">${"789÷456×123−0.=+".split("").map((c) => `<b>${c}</b>`).join("")}</div></div>
        <div class="rl-call" style="left:${o.cx || "62%"};top:${o.cy || "20%"}">${o.call}</div>` : ""}
    </div>`;

  /* ═══ A: startup on a timeline; rules on a mini desktop ════════════ */
  const own = [["chat", "Starts in the tray", true], ["music", "Opens on workspace 5", true], ["mail", "Checks for new mail", false]];
  const sys = [["clip", "Clipboard history", true], ["print", "Print queue", true], ["snap", "Snapshot alerts", true]];
  const startup = () => split(`
    ${tabs("Startup")}
    ${ocard("Your apps", own.map(([k, d, on]) => `<div class="opt">${ai(k)}<div class="opt-text"><div>${AP[k][1]}</div><div class="d">${d}</div></div>${sw(on)}</div>`)
      .concat([`<div class="opt">${ai("backup")}<div class="opt-text"><div>Backup helper</div><div class="d mono">backup-helper --quiet</div></div>${ib("rename", "Edit")}${sw(true)}</div>`,
        `<div class="opt rl-add"><span class="addi">${icon("plus")}</span><div class="opt-text"><div class="acc">Add an app or a command…</div></div></div>`]), { cls: "rl-list" })}
    ${ocard("Started by the system", sys.map(([k, n, on]) => `<div class="opt">${ai(k)}<div class="opt-text"><div>${n}</div></div>${sw(on)}</div>`).concat([`<div class="opt rl-add"><div class="opt-text"><div class="acc">3 more</div></div></div>`]), { cls: "rl-list", note: "Installed with your apps. You can turn them off, not remove them." })}`,
    `${pvhead("After you sign in", "What starts, in order, at your last sign-in. Apps already running aren't started again.", chip("Ready in 3.8 s", "acc"))}
     <div class="rl-tl card">
       <div class="rl-axis"><span></span>${[0, 1, 2, 3, 4].map((s) => `<span>${s} s</span>`).join("")}</div>
       ${[["Desktop", "Bar, notifications, wallpaper", "sys", 0, 1.1, "bar"], ["Clipboard history", "System", "sys", 0.4, 0.8, "clip"], ["Print queue", "System", "sys", 0.6, 1.0, "print"], ["Snapshot alerts", "System", "sys", 0.7, 0.9, "snap"], ["Backup helper", "Command", "own", 1.2, 1.6, "backup"], ["Chat", "In the tray", "own", 1.3, 3.2, "chat"], ["Music", "Workspace 5", "own", 1.5, 3.8, "music"], ["Mail", "Off", "off", 0, 0, "mail"]]
        .map(([n, d, kind, a, b, k]) => `<div class="rl-lane ${kind}"><div class="rl-ln">${ai(k, "sm")}<div><b>${n}</b><span>${d}</span></div></div><div class="rl-track">${kind === "off" ? `<span class="rl-offl">Won't start</span>` : `<span class="rl-seg" style="left:${(a / 5) * 100}%;width:${((b - a) / 5) * 100}%"></span>`}</div></div>`).join("")}
     </div>
     <div class="rl-key">${[["own", "Yours"], ["sys", "The system's"]].map(([c, n]) => `<span><i class="${c}"></i>${n}</span>`).join("")}<span class="sp"></span><span class="dim">Music opens on workspace 5 because of a window rule</span></div>`, { sec: "desktop", cls: "rl-a" });

  const RULES = [["calc", "Calculator", "Open floating · Center on the screen", true], ["pip", "Picture-in-Picture", "Show on every workspace · Open floating"], ["music", "Music", "Open on workspace 5"], ["term", "Terminal", "Opacity 0.95 when not focused"], ["chat", "Chat", "Don't take focus"]];
  const windows = () => split(`
    ${tabs("Window rules")}
    ${ocard("", RULES.map(([k, n, d, on]) => `<div class="opt ${on ? "picked" : ""}">${ai(k)}<div class="opt-text"><div>${n}</div><div class="d">${d}</div></div>${icon("chev-r", "cv")}</div>`)
      .concat([`<div class="opt rl-add"><span class="addi">${icon("plus")}</span><div class="opt-text"><div class="acc">Add a window rule…</div></div></div>`]), { cls: "rl-list" })}
    ${ocard("Open now", [["web", "Browser"], ["term", "Terminal"], ["mail", "Mail"]].map(([k, n]) => `<div class="opt">${ai(k)}<div class="opt-text"><div>${n}</div></div>${btn("Make a rule", "sm")}</div>`), { cls: "rl-list", note: "Start a rule from a window that's open, instead of typing its app." })}`,
    `${pvhead("Calculator", "Matches app <span class=\"mono\">calculator</span>, any title", `${btn("Edit", "sm", "rename")}${btn("Remove", "sm ghost", "trash")}`)}
     ${desk({ float: "calc", call: "Opens floating, in the middle", cx: "67%", cy: "46%" })}
     <div class="rl-fx">${[["Open floating", true], ["Center on the screen", true], ["Show on every workspace"], ["Don't take focus"], ["No shadow"]].map(([n, on]) => chip(n, on ? "on" : "", on ? "check" : "")).join("")}${chip("More…", "", "plus")}</div>`, { sec: "desktop", cls: "rl-a" });

  /* ═══ B: one list of apps, everything about each ═══════════════════ */
  const PERAPP = [["chat", ["Starts at sign-in", "Workspace 4", "Don't take focus"], true], ["calc", ["Floating", "Centered"]], ["music", ["Starts at sign-in", "Workspace 5"]], ["pip", ["Every workspace", "Floating"]], ["backup", ["Starts at sign-in"]], ["mail", ["Start is off"]]];
  const appList = (sel) => `
    <div class="field">${icon("search")}<span class="ph">Search apps and rules</span></div>
    ${ocard("Apps", PERAPP.map(([k, tags], i) => `<div class="opt ${i === sel ? "picked" : ""}">${ai(k, "md")}<div class="opt-text"><div>${AP[k][1]}</div><div class="rl-tags">${tags.map((t) => `<span>${t}</span>`).join("")}</div></div>${icon("chev-r", "cv")}</div>`)
      .concat([`<div class="opt rl-add"><span class="addi">${icon("plus")}</span><div class="opt-text"><div class="acc">Add an app…</div></div></div>`]), { cls: "rl-list rl-apps" })}
    ${ocard("Shell", [nrow("Bar, menus and other surfaces", "Blur and dim rules for the shell", "2 rules", { ic: "layers", sec: "desktop" }), nrow("Started by the system", "", "6", { ic: "cog", sec: "desktop" })], { cls: "icons rl-more" })}`;
  const perApp = () => split(appList(0), `
    <div class="rl-dh">${ai("chat", "lg")}<div><b>Chat</b><span>Matches app <span class="mono">chat</span> · any title</span></div><span class="sp"></span>${btn("Change match", "sm")}</div>
    ${ocard("When you sign in", [orow("Start Chat", "Unless it's already running.", sw(true), { ic: "startup", sec: "desktop" })], { first: true, cls: "icons" })}
    ${ocard("How its windows open", [
      orow("Workspace", "", dd("Workspace 4"), { ic: "grid", sec: "desktop" }),
      orow("Don't take focus", "It opens without pulling you away.", sw(true), { ic: "eye2", sec: "desktop" }),
      `<div class="opt rl-add"><span class="addi">${icon("plus")}</span><div class="opt-text"><div class="acc">Add a rule for Chat…</div></div></div>`,
    ], { cls: "icons" })}
    <div class="card rl-where"><div class="rl-wh">Where it opens</div><div class="rl-wsstrip">${[1, 2, 3, 4, 5].map((n) => `<div class="rl-wsm ${n === 4 ? "on" : n === 2 ? "here" : ""}" style="--wl:${wall("ws" + n)}"><b>${n}</b>${n === 4 ? `<span class="rl-mw">${ai("chat", "sm")}Chat</span>` : n === 2 ? `<span class="rl-you">You</span>` : ""}</div>`).join("")}</div></div>
    <div class="card rl-mini"><div class="rl-wh">At sign-in</div>${[["Desktop", "sys", 0, 1.1, "bar"], ["Chat", "own", 1.3, 3.2, "chat"], ["Music", "sys", 1.5, 3.8, "music"]].map(([n, kind, a, b, k]) => `<div class="rl-lane ${kind}"><div class="rl-ln">${ai(k, "sm")}<div><b>${n}</b></div></div><div class="rl-track"><span class="rl-seg" style="left:${(a / 5) * 100}%;width:${((b - a) / 5) * 100}%"></span></div></div>`).join("")}</div>
    ${pvfoot("You stay on workspace 2; Chat opens quietly on 4.", "check-c")}`, { sec: "desktop", cls: "rl-b" });

  const addSheet = () => dialog("New window rule", "", [btn("Cancel"), btn("Add rule", "primary")], `
    <div class="rl-dlg">
      <div class="rl-dl">
        <label>Which windows</label>
        <div class="rl-pick">${[["web", "Browser"], ["term", "Terminal"], ["calc", "Calculator", true], ["music", "Music"]].map(([k, n, on]) => `<div class="rl-pk ${on ? "on" : ""}">${ai(k, "md")}<span>${n}</span></div>`).join("")}</div>
        <div class="rl-or"><span>or match</span></div>
        <div class="rl-fl"><span>App</span><div class="field mono">calculator</div></div>
        <div class="rl-fl"><span>Title</span><div class="field"><span class="ph">Any title</span></div></div>
        <label>What it does</label>
        <div class="rl-fx">${[["Open floating", true], ["Center on the screen", true], ["Always tile"], ["Open fullscreen"], ["Show on every workspace"], ["Open on workspace…"], ["Opacity…"], ["Don't take focus"]].map(([n, on]) => chip(n, on ? "on" : "", on ? "check" : "")).join("")}</div>
      </div>
      <div class="rl-dp">${desk({ float: "calc", call: "Floating, centred", cx: "52%", cy: "16%" })}<span>How Calculator will open</span></div>
    </div>`, 700);

  REG("rules", {
    name: "Startup & Rules",
    summary: "One long column in four parts: startup apps (an app picker and a command box), the system's startup items as switches with their raw names, then window rules and layer rules, each an Add form that unfolds into blank boxes for patterns. Nothing shows when things start, or what a rule will do to a window.",
    problems: [
      "<b>Startup is two add-boxes before any list:</b> “Pick an installed app to start at login…” and a command box come first; what already starts is below them.",
      "<b>The system's items show their package names:</b> “Limine-snapper-restore notification”, “Print Queue Applet”, with no plain idea of what turning one off does.",
      "<b>Rules are written as patterns:</b> “App class, e.g. ^mpv$”, a title pattern, an effect dropdown and a value box (“e.g. 0.9 0.8”); nothing shows what the rule does to the window.",
      "<b>The same app is in two places:</b> Chat can start at sign-in under Startup and open on workspace 4 under Window rules, with nothing tying them together.",
      "<b>Layer rules</b> (blur behind the bar, dim around menus) sit at the same level as everyday startup apps, with their own namespace jargon.",
      "<b>At 800 px</b> the long descriptions wrap and the app picker's label is cut off.",
    ],
    today: [["rules-1280", "Today", ""], ["rules-800", "Today at 800 px", ""]],
    options: [
      { id: "a", name: "Timeline and rule previews", idea: "A switch at the top of the controls picks Startup, Window rules or Shell rules. Startup shows your apps with a switch each, the system's in one row that opens its own list, and on the right a timeline of the last sign-in: what started, in what order and how long until it was ready. A window rule shows on a small desktop, with the window opening the way the rule says and its effects as chips you can toggle.",
        shots: [["a-startup", "Startup on a timeline", ""], ["a-windows", "A window rule", "Calculator floats in the middle"], ["a-windows-800", "A window rule at 800 px", ""]] },
      { id: "b", name: "Everything per app", idea: "One list of apps, each with tags for everything set about it: starts at sign-in, its workspace, floating, focus. Picking one shows all of it together on the right: the startup switch, how its windows open, and a strip of workspaces showing where it lands. A new rule starts by picking an open window instead of typing a pattern, with the effects as chips and a live picture of how it'll open.",
        shots: [["b-app", "Chat: starts at sign-in and opens on 4", ""], ["b-add", "A new rule, from an open window", ""]] },
    ],
    pages: {
      "a-startup": () => swin({ ...P, body: startup() }),
      "a-windows": () => swin({ ...P, body: windows() }),
      "b-app": () => swin({ ...P, body: perApp() }),
      "b-add": () => swin({ ...P, body: perApp(), over: addSheet() }),
    },
  });
})();
