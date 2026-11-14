// Assistant & AI › Permissions: what Echo may do on its own, after asking, or never.
(() => {
  const DESC = "What Echo may do on its own, after asking, or never.";
  const o = (ic) => ({ ic, sec: "assistant" });
  const page = (body) => () => swin({ sec: "assistant", page: "Permissions", desc: DESC, body: body() });
  const ST = { allow: ["Allowed", "check", "var(--success)"], ask: ["Asks first", "info", "var(--warning)"], never: ["Never", "x", "var(--danger)"] };
  const pill = (s) => `<div class="pill" style="--tc:${ST[s][2]}">${icon(ST[s][1])}${ST[s][0]}</div>`;
  // [key, icon, name, short, state, x, y] — x and y place it on the map, in %.
  const CAPS = [
    ["apps", "app", "Open apps", "Start and switch apps", "allow", 50, 9],
    ["volume", "volume", "Volume", "Change how loud things are", "ask", 83, 22],
    ["read", "file-text", "Read files", "Look inside your files", "allow", 92, 54],
    ["write", "pen", "Change files", "Create, edit, move, delete", "ask", 77, 86],
    ["power", "power", "Shut down", "Restart and sign out too", "ask", 23, 86],
    ["software", "download", "Software", "Install, remove, update", "ask", 8, 54],
    ["web", "globe", "Search the web", "Your question goes out", "ask", 17, 22],
  ];
  const segFor = (s, adminOnly) => seg(adminOnly ? ["Ask", "Never"] : ["Allow", "Ask", "Never"], { allow: "Allow", ask: "Ask", never: "Never" }[s]);

  /* ── A: the map ──────────────────────────────────────────────────── */
  const aCtl = () => `
    ${ocard("What it may do", CAPS.map(([k, ic, n, d, s]) => orow(n, { software: "Asks for your password too.", web: "Your question goes out." }[k] || "", segFor(s, k === "software"), o(ic))), { first: true, cls: "icons ap-caps" })}
    ${ocard("Using apps for you", [
      orow("Never touch", `${["Vault", "Bank of Pine"].map((w) => `<span class="ap-chip">${w}</span>`).join("")}<span class="ap-chip add">${icon("plus")}App</span>`, "", o("eye")),
      orow("Always ask before clicking", ["Send", "Buy", "Delete"].map((w) => `<span class="ap-chip">${w}</span>`).join(""), "", o("mouse")),
    ], { cls: "icons" })}
    ${ocard("", [nrow("Rules for single tools", "", "3 rules", o("sliders")), nrow("Administrator helper", "", "Installed", o("shield"))], { cls: "icons" })}`;
  const line = ([k, , , , s, x, y]) => `<line x1="50" y1="52" x2="${x}" y2="${y}" class="${s} ${k === "write" ? "sel" : ""}"/>`;
  const node = ([k, ic, n, , s, x, y]) => `<div class="ap-nd ${s} ${k === "write" ? "sel" : ""}" style="left:${x}%;top:${y}%"><span class="ni">${icon(ic)}</span><div><b>${n}</b><span>${ST[s][0]}</span></div></div>`;
  const map = (sel = true) => `<div class="ap-map">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none">${CAPS.map(line).join("")}</svg>
      <div class="ap-core"><span class="orb"></span><b>Echo</b></div>
      ${CAPS.map(node).join("")}
      ${sel ? `<div class="ap-tip" style="left:77%;top:86%"><b>Change files · asks first</b><span>Last asked today at 11:02, to move 31 old downloads to the Trash. You said yes.</span></div>` : ""}
    </div>`;
  const legend = () => `<div class="ap-leg">${Object.entries(ST).map(([k, [n]]) => `<span class="${k}"><i></i>${n}</span>`).join("")}<span class="sp"></span><span class="dim">Commands Echo writes itself always ask first.</span></div>`;
  const aPv = () => `
    ${pvhead("What Echo can reach", "Click a line to change it.", `<div class="ap-sum"><b>2</b> allowed · <b>5</b> ask first · <b>0</b> never</div>`)}
    ${map()}
    ${legend()}`;

  /* ── B: try a request ────────────────────────────────────────────── */
  const bCtl = () => `
    <div class="gtitle first">How much it does on its own</div>
    <div class="card">${[["Asks before any change", "You approve every step that changes something.", false], ["Small changes only", "Opens apps and tidies up; asks before anything big.", true], ["Everything allowed", "Does whatever the list below allows, without stopping.", false]].map(([t, d, on]) => `<div class="opt ${on ? "picked" : ""}">${radio(on)}<div class="opt-text"><div>${t}</div><div class="d">${d}</div></div></div>`).join("")}</div>
    ${ocard("What it may do", CAPS.map(([k, ic, n, , s]) => orow(n, "", dd(ST[s][0]), o(ic))), { cls: "icons ap-tight" })}`;
  const REQS = [
    ["“Open Music and play something calm”", "app", "Just does it", "allow", "Opening apps is allowed."],
    ["“Turn the volume down a bit”", "volume", "Asks first", "ask", "Volume asks first."],
    ["“Clear out my old screenshots”", "trash", "Asks first", "ask", "", true],
    ["“Install a photo editor”", "download", "Asks, then wants your password", "ask", "Software always needs your password."],
    ["“Shut down in ten minutes”", "power", "Asks first", "ask", "Shutting down asks first."],
  ];
  const approval = () => `<div class="ap-ask"><div class="ah"><span class="orb"></span><div><b>Move 31 screenshots to the Trash?</b><span>From Pictures › Screenshots, all older than 3 months · 412 MB</span></div></div>
      <div class="files">${["Screenshot 2026-05-02 09.14.png", "Screenshot 2026-05-11 16.40.png", "Screenshot 2026-06-03 11.02.png"].map((f) => `<span>${icon("image")}${f}</span>`).join("")}<span class="more">and 28 more</span></div>
      <div class="bt">${btn("Deny", "sm")}${btn("Allow for this task", "sm")}${btn("Allow", "primary sm")}</div></div>`;
  const bPv = () => `
    ${pvhead("What happens when you ask", "With the settings on the left. Click a request to see it.", "")}
    <div class="ap-reqs">${REQS.map(([q, ic, r, s, why, open]) => `<div class="ap-rq card ${open ? "open" : ""}"><div class="rr"><span class="lic" style="--tc:var(--sec-assistant)">${icon(ic)}</span><div class="tx"><b>${q}</b>${why ? `<span>${why}</span>` : ""}</div>${pill(s).replace(ST[s][0], r)}</div>${open ? approval() : ""}</div>`).join("")}</div>
    ${pvfoot("Moved files can be put back for 30 days from Activity.", "history")}`;

  /* ── C: one capability in detail ─────────────────────────────────── */
  const GROUPS = [
    ["This computer", [["apps", "app", "Open apps", "allow"], ["volume", "volume", "Volume", "ask"], ["power", "power", "Shut down", "ask"], ["software", "download", "Software", "ask"]]],
    ["Your files", [["read", "file-text", "Read files", "allow"], ["write", "pen", "Change files", "ask", true]]],
    ["Beyond this computer", [["web", "globe", "Search the web", "ask"]]],
    ["Using apps for you", [["click", "mouse", "Clicking and typing", "ask"]]],
  ];
  const cCtl = () => `${GROUPS.map(([g, items], i) => `<div class="gtitle ${i === 0 ? "first" : ""}">${g}</div><div class="card">${items.map(([k, ic, n, s, on]) => `<div class="opt onav ${on ? "picked" : ""}"><span class="lic" style="--tc:var(--sec-assistant)">${icon(ic)}</span><div class="opt-text"><div>${n}</div></div>${pill(s)}${icon("chev-r", "cv")}</div>`).join("")}</div>`).join("")}
    <div class="ap-help">${icon("shield")}<div><b>Administrator helper</b><span>Installed · lets it change software after you type your password</span></div></div>`;
  const TOOLS = [
    ["Write a file", "Makes a new file or saves over one", "Like the group", "ask", false],
    ["Move or rename", "Within your home folder", "Allowed", "allow", true],
    ["Move to the Trash", "Can be put back for 30 days", "Like the group", "ask", false],
    ["Make a folder", "", "Allowed", "allow", true],
  ];
  const cPv = () => `
    <div class="ap-dh"><span class="big">${icon("pen")}</span><div><b>Change files</b><span>Create, edit, move and delete files in your home folder.</span></div></div>
    <div class="ap-pick">${["allow", "ask", "never"].map((k) => `<div class="pk ${k} ${k === "ask" ? "on" : ""}">${icon(ST[k][1])}<b>${ST[k][0]}</b><span>${{ allow: "Changes files without asking", ask: "Shows you what it will change", never: "Says it isn't allowed" }[k]}</span></div>`).join("")}</div>
    ${ocard("Tools in this group", TOOLS.map(([n, d, v, s, rule]) => orow(`${n}${rule ? ' <span class="ap-rule">Your rule</span>' : ""}`, d, `${dd(v)}${rule ? ib("x", "Remove the rule") : '<span class="ap-gap"></span>'}`)), { act: btn("Add a rule", "sm ghost", "plus"), cls: "ap-tools" })}
    <div class="card ap-last"><div class="lh"><b>Lately</b><span class="lnk">All in Activity</span></div>
      ${[["Today 11:02", "Moved 31 old downloads to the Trash", "You allowed it"], ["Yesterday 17:45", "Renamed 12 photos by date", "Your rule allowed it"], ["Tuesday 09:30", "Saved notes from a meeting", "You allowed it"], ["Monday 16:12", "Wanted to delete a project folder", "You said no"]].map(([t, w, d]) => `<div class="lr"><small>${t}</small><span>${w}</span><em>${d}</em></div>`).join("")}</div>
    ${pvfoot("Copies of changed files are kept for 30 days, so Activity can undo them.", "history")}`;

  REG("assistant-permissions", {
    name: "Permissions",
    summary: "Six dropdowns that each say Allowed or Asks first, then rules for tools by their internal names, a developer list of every tool with a search field, two comma-separated text fields for apps and words, and a sudo command to copy. Nothing shows at a glance what Echo can and can't do.",
    problems: [
      "<b>No overview:</b> six identical dropdowns in a column; you read every one to know what Echo may do, and web search is on another page.",
      "<b>Tools by their internal names:</b> single-tool rules read “duckduckgo.search”, with no word on what the tool does or which group it belongs to.",
      "<b>A developer list:</b> “Capability health” lists every registered tool as “permission · reason”, with its own search field.",
      "<b>Typing lists:</b> apps it must never touch are window classes typed comma-separated (“e.g. keepassxc”), and so are the words that make it ask.",
      "<b>A terminal command to copy:</b> the administrator helper says “Run sudo nyx-assistant install-helper”.",
      "<b>No consequences shown:</b> nothing says what “Asks first” looks like, or what Echo will do with a request at these settings.",
    ],
    today: [["assistant-permissions-1280", "Today", ""], ["assistant-permissions-800", "Today at 800 px", ""]],
    options: [
      {
        id: "a", name: "Permission map",
        idea: "Echo sits in the middle of a map with everything it can reach around it: apps, volume, reading and changing files, shutting down, software and web search. Each line is green for allowed, amber and dashed for asks first, red for never, and clicking a line changes it or shows when it was last used. On the left the same list is a column of three-way switches, with the apps it never touches and the words that make it ask as chips.",
        shots: [["a", "Permission map", ""], ["a-800", "At 800 px", "The map above the switches"]],
      },
      {
        id: "b", name: "What happens when you ask",
        idea: "The page starts from how much Echo does on its own (moved here from the Assistant page), then the list of what it may do. The picture runs real requests through those settings: open Music just happens, turning the volume down asks, clearing old screenshots shows the exact question you'd get, installing software asks for your password. You see the consequence of every setting before you need it.",
        shots: [["b", "Sample requests", "One opened to show the question Echo would ask"]],
      },
      {
        id: "c", name: "List and detail",
        idea: "What Echo may do is a short list in four plain groups (this computer, your files, beyond this computer, using apps for you), each with its state. Choosing one opens it on the right: allowed, asks first or never as three big choices, the tools inside it with your own rules for single tools, and what it did with that permission lately. The developer list of tools goes away; its tools live in their groups.",
        shots: [["c", "Change files chosen", "Its tools, your rules and what it did lately"]],
      },
    ],
    pages: { a: page(() => split(aCtl(), aPv(), { sec: "assistant", ctlw: 440 })), b: page(() => split(bCtl(), bPv(), { sec: "assistant", ctlw: 400 })), c: page(() => split(cCtl(), cPv(), { sec: "assistant", ctlw: 360 })) },
  });
})();
