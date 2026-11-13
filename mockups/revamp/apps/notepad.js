// Nyx Notepad on the revamp page: today's problems and two options.
(() => {
  const ICONS = {
    save: '<path d="M5 4h11l3 3v11.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 18.5z"/><path d="M8 4v5h7V4M8 20v-6h8v6"/>',
    "arrow-up": '<path d="M12 19V5M6.5 10.5 12 5l5.5 5.5"/>',
    "arrow-down": '<path d="M12 5v14M6.5 13.5 12 19l5.5-5.5"/>',
    "folder-open": '<path d="M3 18V7.5A2.5 2.5 0 0 1 5.5 5H9l2 2.2h6.5A2.5 2.5 0 0 1 20 9.7V11"/><path d="M3 18l2.6-6.2A1.5 1.5 0 0 1 7 11h13.3a1 1 0 0 1 .9 1.4L18.6 18.6a1.5 1.5 0 0 1-1.4.9H4.5A1.5 1.5 0 0 1 3 18z"/>',
  };

  const TEXT = [
    "Trip to the coast: packing list",
    "================================",
    "",
    "Clothes",
    "- 3 t-shirts, 1 long sleeve",
    "- rain jacket (check the hood zip)",
    "- swimsuit",
    "- walking shoes and sandals",
    "",
    "Gear",
    "- headlamp and spare batteries",
    "- chargers: phone, watch, camera",
    "- day pack, water bottles x2",
    "- the spare key for the bike lock",
    "",
    "Before leaving",
    "- water the plants",
    "- set the thermostat to 16°",
    "- drop the house key with Ines",
    "- print the ferry tickets (Friday 07:40)",
  ];
  const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
  const editor = (o = {}) => {
    const cur = o.cur ?? 12;
    const lines = TEXT.slice(0, o.n || TEXT.length).map((l, i) => {
      let h = esc(l) || "&nbsp;";
      if (o.q) h = h.replace(new RegExp(o.q, "g"), (m) => `<mark class="${i === 13 ? "cur" : ""}">${m}</mark>`);
      if (i === cur && !o.q) h += '<span class="caret"></span>';
      return `<div class="np-l ${i === cur ? "on" : ""}">${o.nums !== false ? `<span class="no">${i + 1}</span>` : ""}<span class="tx">${h}</span></div>`;
    }).join("");
    return `<div class="np-ed ${o.col ? "col" : ""} ${o.nums === false ? "nonum" : ""}"><div class="np-lines">${lines}</div></div>`;
  };
  const status = (o = {}) => `<div class="np-foot"><span>Ln ${o.ln || 13}, Col ${o.col || 33}</span><span>·</span><span>104 words</span>${o.sel ? `<span>·</span><span>2 matches</span>` : ""}<span class="sp"></span>${o.clickable ? `<span class="np-pill">LF${icon("chev-d")}</span><span class="np-pill">Spaces: 4${icon("chev-d")}</span><span class="np-pill">13 pt${icon("chev-d")}</span>` : `<span>LF</span><span>·</span><span>Spaces: 4</span>`}</div>`;

  /* ── Option A: open files in a sidebar ─────────────────────────────────── */
  const sideA = () => `
    ${grp("Open", true, icon("plus"), "accent")}
    ${navx("file-text", "packing-list.txt", { active: true, badge: "•" })}
    ${navx("file-text", "notes.txt")}
    ${navx("file", "Call the plumber about…", { sub: "Not saved" })}
    ${navx("code", "hyprland.lua")}
    ${grp("Recent", false, `<span class="np-clear">Clear</span>`, "green")}
    ${navx("history", "todo.txt")}
    ${navx("history", "server-setup.md")}
    ${navx("history", "budget-2026.csv")}
    ${navx("folder-open", "Open a file…", { sub: "Ctrl O" })}
    <div class="foot">${icon("check-c", "ok")}<span>Unsaved text is kept, even after closing</span></div>`;

  const docTitle = (o = {}) => `<div class="doc"><b>packing-list.txt</b>${o.dirty === false ? "" : '<span class="dot"></span>'}<span class="dim">~/Documents/trips</span></div>`;
  const hdrA = (o = {}) => header({ icon: "file-text", name: "Notepad", center: docTitle(o), end: `<button class="newbtn">${icon("save")}<span>Save</span><span class="key">Ctrl S</span></button>${ib("search", "Find and replace (Ctrl F)", o.find ? "on" : "")}` });

  const findBar = () => `<div class="np-find">
    <div class="field focus">${icon("search")}<span>key</span><span class="np-cnt">1 of 2</span></div>
    ${ib("arrow-up", "Previous (Shift Enter)")}${ib("arrow-down", "Next (Enter)")}
    <div class="field">${icon("rename")}<span>keys</span></div>
    ${btn("Replace", "")}${btn("Replace all", "")}
    <span class="sp"></span>${ib("x", "Close (Esc)")}
  </div>`;

  /* ── Option B: just the page, tabs on top ─────────────────────────────── */
  const tabsB = (o = {}) => `<div class="np-tabs">${[["packing-list.txt", true, true], ["notes.txt"], ["Call the plumber about…", false, true], ["hyprland.lua"]].slice(0, o.n || 4).map(([t, on, dirty]) => `<div class="tab ${on ? "on" : ""}"><span class="tt">${t}</span>${dirty ? '<span class="np-dot"></span>' : ""}<span class="x">${icon("x")}</span></div>`).join("")}${o.more ? `<span class="np-more">+${o.more}</span>` : ""}<span class="plus">${icon("plus")}</span></div>`;
  const hdrB = (o = {}) => header({ icon: "file-text", name: "Notepad", start: tabsB(o), end: `<button class="newbtn ${o.menu ? "open" : ""}"><span>File</span>${icon("chev-d", "cv")}</button>${ib("search", "Find and replace (Ctrl F)", o.find ? "on" : "")}` }).replace(ib("sidebar", "Sidebar (Ctrl+B)"), "");

  const fileMenu = () => menu(NARROW ? 470 : 950, 4, [
    ["file", "New tab", "Ctrl T"], ["folder-open", "Open…", "Ctrl O"], ["save", "Save", "Ctrl S"], ["", "Save as…", "Ctrl Shift S"], ["history", "Reopen closed tab", "Ctrl Shift T"],
    "-", ["#", "Recent"],
    ["file-text", "todo.txt"], ["file-text", "server-setup.md"], ["file-text", "budget-2026.csv"], ["", "Clear recent files", "", "dim"],
  ], 270);

  const findCard = () => `<div class="np-fcard pop">
    <div class="r"><div class="field focus">${icon("search")}<span>key</span><span class="np-cnt">1 of 2</span></div>${ib("arrow-up", "Previous")}${ib("arrow-down", "Next")}${ib("x", "Close (Esc)")}</div>
    <div class="r"><div class="field">${icon("rename")}<span>keys</span></div>${btn("Replace", "sm")}${btn("All", "sm")}</div>
  </div>`;

  REG("notepad", {
    name: "Notepad",
    icons: ICONS,
    summary: "Notepad is a solid plain-text editor (tabs, nothing lost on close, find and replace, careful saving), but Save hides behind an open-folder icon, and tabs, the find bar and the menus all fight for one header.",
    problems: [
      "<b>Save is hidden:</b> it's inside a menu behind an open-folder icon (“File”), with nothing on screen when a file has unsaved changes but a small dot on its tab.",
      "<b>One crowded header:</b> the app name, every tab and +, then the find and replace fields when finding, then the menu and Settings, all in a single bar.",
      "<b>Replace one and Replace all are bare icons</b> (a find-replace glyph and a select-all glyph) beside the replace field.",
      "<b>Tabs scroll out of sight:</b> at 800 px the strip scrolls sideways with the mouse wheel, with no sign that more tabs are hidden.",
      "<b>Recent files only live in that menu,</b> under the open-folder icon; there's no place that shows what's open and what was open lately.",
      "<b>Where a file lives isn't shown:</b> the full path is only a tooltip on its tab, and untitled tabs named after their first line look just like saved files.",
      "<b>The whole window is monospace,</b> buttons and menus included, not only the text you're editing.",
    ],
    today: [],
    todayNote: "No screenshot: Notepad crashed on the test screen (a GTK text-view check failed). The problems come from its code.",
    options: [
      { id: "a", name: "Open files in a sidebar", idea: "The shared sidebar lists what's open (unsaved ones marked, untitled ones saying so) and what was open lately, with Open a file at the foot. The header names the file and its folder, with a labelled Save. Find and replace drops in as a strip above the text with Replace and Replace all spelled out. At 800 px the sidebar is a rail of file icons.",
        shots: [["a-editor", "Editing", "Open and recent files in the sidebar; labelled Save"], ["a-find", "Find and replace", "A strip above the text, with a match count"], ["a-editor-800", "At 800 px", "Icon rail, line numbers kept"]] },
      { id: "b", name: "Just the page", idea: "Keeps Notepad small and quiet: tabs on top, the text in a centred column, nothing else. The open-folder icon becomes a labelled File menu with Save, Reopen closed tab and recent files. The footer's line ending, indent and text size are buttons that change them. At 800 px, hidden tabs show as “+2”, and find and replace is a small card over the text.",
        shots: [["b-editor", "Editing", "Tabs, a centred column, a useful footer"], ["b-menu", "The File menu", "Save, reopen and recent files, labelled"], ["b-find-800", "Find at 800 px", "+2 for hidden tabs; find as a card"]] },
    ],
    pages: {
      "a-editor": () => win({ hdr: hdrA(), side: sideA(), page: `${editor()}${status()}` }),
      "a-find": () => win({ hdr: hdrA({ find: true }), side: sideA(), page: `${findBar()}${editor({ q: "key", cur: 13 })}${status({ sel: true, ln: 14, col: 25 })}` }),
      "b-editor": () => win({ hdr: hdrB(), side: "", page: `${editor({ col: true, nums: false })}${status({ clickable: true })}` }),
      "b-menu": () => win({ hdr: hdrB({ menu: true }), side: "", page: `${editor({ col: true, nums: false })}${status({ clickable: true })}${fileMenu()}${toast("Closed notes.txt without saving", "Undo")}` }),
      "b-find": () => win({ hdr: hdrB({ n: 2, more: 2, find: true }), side: "", page: `${editor({ col: true, nums: false, q: "key", cur: 13 })}${findCard()}${status({ clickable: true, sel: true, ln: 14, col: 25 })}` }),
    },
  });
})();
