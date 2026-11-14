// Desktop › Workspace Profiles, in style B: a board of the profile's workspaces, or what switching moves.
(() => {
  const P = { sec: "desktop", page: "Workspace Profiles", desc: "Named sets of workspaces, like Work and Home, and the apps that open on each." };

  /* ── Sample data ─────────────────────────────────────────────────── */
  // app: [icon, name, swatch]
  const A = { mail: ["mail", "Mail", "blue"], cal: ["calendar", "Calendar", "red"], code: ["code", "Code", "violet"], term: ["terminal", "Terminal", "graphite"], web: ["globe", "Browser", "coral"], chat: ["chat", "Chat", "green"], music: ["music", "Music", "pink"], files: ["folder", "Files", "amber"], notes: ["note", "Notes", "amber"], photos: ["image", "Photos", "teal"], games: ["play", "Games", "violet"] };
  const WORK = [["1", "Mail", ["mail", "cal"]], ["2", "Code", ["code", "term"]], ["3", "Web", ["web"]], ["4", "Chat", ["chat"]], ["5", "Music", ["music"]], ["6", "", []]];
  const PROFILES = [["Work", "6 workspaces · 7 apps placed", "briefcase", "blue", true], ["Home", "4 workspaces · 4 apps placed", "home", "green"], ["Focus", "2 workspaces · 2 apps placed", "moon", "violet"]];

  const appic = (k, sz = "") => { const [ic, , c] = A[k]; return `<span class="wp-ai ${sz}" style="--ac:var(--sw-${c})">${icon(ic)}</span>`; };
  const appchip = (k, o = {}) => `<span class="wp-ac ${o.cls || ""}">${appic(k)}<span>${A[k][1]}</span></span>`;
  const profRows = (on, o = {}) => PROFILES.map(([n, d, ic, c, act]) => `<div class="opt ${n === on ? "picked" : ""}">${radio(n === on)}<span class="lic" style="--tc:var(--sw-${c})">${icon(ic)}</span><div class="opt-text"><div>${n}</div><div class="d">${d}</div></div>${act ? `<span class="pill dot" style="--tc:var(--success)">Active</span>` : o.go ? btn("Switch", "sm") : ""}${ib("dots", "Rename, duplicate or delete")}</div>`)
    .concat([`<div class="opt"><span class="addi">${icon("plus")}</span><div class="opt-text"><div class="acc">New profile…</div></div></div>`]);

  /* ═══ A: the profile's workspaces as a board ═══════════════════════ */
  const ws = ([n, name, apps], o = {}) => `<div class="wp-ws ${o.drop ? "drop" : ""}" style="--wl:${wall("ws" + n)}">
      <div class="wp-wh"><b>${n}</b><span>${name || "Empty"}</span>${o.scr ? `<small>${icon("monitor")}${o.scr}</small>` : ""}</div>
      <div class="wp-apps">${apps.map((k) => appchip(k)).join("")}${!apps.length ? `<span class="wp-drop">${o.drop ? `${appchip("files", { cls: "ghost" })}` : "Drop an app here"}</span>` : ""}</div>
    </div>`;
  const board = () => split(`
    ${ocard("Profiles", profRows("Work"), { first: true, cls: "icons wp-prof" })}
    ${ocard("Switching", [
      orow("Key for the next profile", "Goes Work, Home, Focus, and round again.", `${keys("Super", "Ctrl", "P")}${ib("rename", "Change")}`, { ic: "keyboard", sec: "desktop" }),
      orow("Move open windows", "Switching moves each placed app's windows to its workspace.", sw(true), { ic: "window", sec: "desktop" }),
    ], { cls: "icons" })}
    ${ocard("", [
      nrow("Names, screens and layouts", "On Tiling & Workspaces, for the active profile", "", { ic: "grid", sec: "desktop" }),
      nrow("Copy a workspace's layout", "Its layout and gaps, to other workspaces", "", { ic: "copy", sec: "desktop" }),
    ], { cls: "icons wp-more" })}`,
    `${pvhead("Work", "Each app opens on its workspace. Drag one to move it, or off the board to unplace it.", `${btn("Rename", "sm ghost", "rename")}${btn("Duplicate", "sm", "copy")}`)}
     <div class="wp-board">${WORK.map((w, i) => ws(w, { drop: i === 5, scr: i < 3 ? "Laptop" : i < 5 ? "Studio 27" : "" })).join("")}</div>
     <div class="wp-tray card"><span class="wp-tl">Not placed</span>${["files", "notes", "photos", "games"].map((k) => appchip(k)).join("")}<span class="sp"></span>${btn("Place an app", "sm", "plus")}</div>
     ${pvfoot("Workspaces 1 to 6 always exist while Work is active.", "info")}`, { sec: "desktop", cls: "wp-a" });

  /* ═══ B: pick a profile, see what switching to it moves ════════════ */
  const HOME = [["1", "Web", ["web", "mail"]], ["2", "Music", ["music"]], ["3", "Photos", ["photos"]], ["4", "Games", ["games"]]];
  const moves = [["mail", "1", "1", "stays"], ["web", "3", "1", "moves"], ["music", "5", "2", "moves"], ["photos", "", "3", "opens"], ["code", "2", "2", "stays put"]];
  const switchPage = () => split(`
    ${ocard("Profiles", profRows("Home", { go: true }), { first: true, cls: "icons wp-prof" })}
    ${ocard("Apps in Home", HOME.flatMap(([n, , apps]) => apps.map((k) => `<div class="opt">${appic(k, "md")}<div class="opt-text"><div>${A[k][1]}</div></div>${dd(`Workspace ${n}`)}${ib("x", "Unplace")}</div>`)).concat([`<div class="opt"><span class="addi">${icon("plus")}</span><div class="opt-text"><div class="acc">Place an app…</div></div></div>`]), { act: `<span class="note">5</span>` })}`,
    `${pvhead("Switching to Home", "What happens to the windows you have open now.", btn("Switch to Home", "primary"))}
     <div class="wp-flow card">
       <div class="wp-col"><div class="wp-ch">Work · now</div>${[["1", ["mail", "cal"]], ["2", ["code", "term"]], ["3", ["web"]], ["5", ["music"]]].map(([n, apps]) => `<div class="wp-slot"><b>${n}</b>${apps.map((k) => appchip(k, { cls: k === "web" || k === "music" ? "mv" : "" })).join("")}</div>`).join("")}</div>
       <svg class="wp-arrows" viewBox="0 0 120 260" preserveAspectRatio="none"><defs><marker id="wpa" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10z"/></marker></defs>
         <path d="M4,152 C60,152 60,30 116,30" marker-end="url(#wpa)"/><path d="M4,222 C60,222 60,90 116,90" marker-end="url(#wpa)"/></svg>
       <div class="wp-col"><div class="wp-ch">Home · after</div>${HOME.map(([n, name, apps]) => `<div class="wp-slot to"><b>${n}</b>${apps.map((k) => appchip(k, { cls: k === "photos" ? "new" : k === "web" || k === "music" ? "mv" : "" })).join("")}</div>`).join("")}</div>
     </div>
     <div class="wp-sum">${[["2 windows move", "Browser to 1, Music to 2", "swipe-lr"], ["Photos opens", "On 3; it isn't running yet", "plus"], ["4 stay put", "Mail, Calendar, Code and Terminal", "check"]].map(([b, s, ic]) => `<div class="card"><span class="lic" style="--tc:var(--sec-desktop)">${icon(ic)}</span><div><b>${b}</b><span>${s}</span></div></div>`).join("")}</div>
     <div class="wp-bars card">${[["Bar now", ["1", "2", "3", "4", "5", "6"], 0], ["After", ["1 Web", "2 Music", "3 Photos", "4 Games"], 0]].map(([l, w, on]) => `<div class="wp-bar"><span class="wp-tl">${l}</span><div class="wp-pills">${w.map((x, i) => `<span class="${i === on ? "on" : ""}">${x}</span>`).join("")}</div></div>`).join("")}</div>
     ${pvfoot("Or switch from anywhere with Super + Ctrl + P.", "keyboard")}`, { sec: "desktop", cls: "wp-b" });

  const newSheet = () => dialog("New workspace profile", "It starts as a copy of the profile you pick. Switch to it, then set its workspaces on Tiling & Workspaces.", [btn("Cancel"), btn("Add profile", "primary")],
    `<div class="wp-dlg">
       <label>Name</label><div class="field focus">Weekend<span class="wp-caret"></span></div>
       <label>Start from</label>
       <div class="card">${[["Work", "6 workspaces · 7 apps", true], ["Home", "4 workspaces · 4 apps"], ["Nothing", "Workspaces as they are now, no apps placed"]].map(([n, d, on]) => `<div class="opt ${on ? "picked" : ""}">${radio(on)}<div class="opt-text"><div>${n}</div><div class="d">${d}</div></div></div>`).join("")}</div>
       <div class="wp-dk">${chk(true)}<span>Switch to it now</span></div>
     </div>`, 460);

  REG("workspace-profiles", {
    name: "Workspace Profiles",
    summary: "Until you make a second profile the page is one heading, a sentence and an Add a profile row on an empty screen. Once there are profiles, each is a row of icon buttons, and the active one's apps are a list of dropdowns under it, with its workspaces on another page and the switching key typed in Hyprland's syntax.",
    problems: [
      "<b>An empty page to start:</b> a note and “Add a profile” with a + button, and nothing that says what a profile would look like or why you'd want one.",
      "<b>No picture of a profile:</b> which apps open on which workspace is a list of app names, each with a “Workspace 3” dropdown, so you can't see a workspace's apps together.",
      "<b>Unlabelled icon buttons:</b> switch, rename, duplicate and delete are four small icons on every row.",
      "<b>Switching is a leap:</b> nothing says which windows will move, which apps will open, or that the bar's workspaces will change.",
      "<b>The switching key is typed text</b> (“Keys as Hyprland writes them, like SUPER + CTRL + P”), and the command-line way to switch is a note under it.",
      "<b>Its workspaces live elsewhere:</b> names, screens and layouts are a row that sends you to Tiling & Workspaces, beside a copy tool with ten number chips.",
    ],
    today: [["workspace-profiles-1280", "Today", "Before a second profile exists"], ["workspace-profiles-800", "Today at 800 px", ""]],
    options: [
      { id: "a", name: "Workspace board", idea: "The profiles are a short list on the left with the switching key and Move open windows under them. On the right, the picked profile is a board of its workspaces, each a little screen with its name, which display it's on and the apps that open there. Drag an app between workspaces, from the Not placed tray, or off the board; an empty workspace shows where an app will land.",
        shots: [["a-board", "Work's workspaces", "Files is being dragged onto workspace 6"], ["a-board-800", "At 800 px", "The board above, profiles under it"]] },
      { id: "b", name: "What switching does", idea: "Picking a profile that isn't active shows what switching to it would do with the windows open now: which move and where, which apps start, which stay. Its apps are a plain list with a workspace each on the left, so you change placements and watch the picture update before you switch. New profiles start in a small sheet that asks for a name and which profile to copy.",
        shots: [["b-switch", "Before switching to Home", "Two windows move and Photos opens"], ["b-new", "A new profile", "A copy of Work, or nothing"]] },
    ],
    icons: {
      briefcase: '<rect x="3.5" y="7" width="17" height="12.5" rx="2"/><path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7M3.5 12.5h17"/>',
    },
    pages: {
      "a-board": () => swin({ ...P, body: board() }),
      "b-switch": () => swin({ ...P, body: switchPage() }),
      "b-new": () => swin({ ...P, body: switchPage(), over: newSheet() }),
    },
  });
})();
