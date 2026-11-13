// Nyx Clipboard on the revamp page: today's problems and two options.
(() => {
  const ICONS = {
    clipboard: '<rect x="5" y="4.5" width="14" height="16.5" rx="2.5"/><path d="M9 4.5V4a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 4v.5M9 4.5h6v2.2H9z"/>',
    eyeoff: '<path d="M3 3l18 18M10.6 5.6A10 10 0 0 1 12 5.5c6 0 9.5 6.5 9.5 6.5a17 17 0 0 1-3 3.8M6.6 6.6A17 17 0 0 0 2.5 12S6 18.5 12 18.5a9.5 9.5 0 0 0 4.5-1.1M9.9 9.9a3 3 0 0 0 4.2 4.2"/>',
    snippet: '<path d="M8 4H6.5A1.5 1.5 0 0 0 5 5.5v4L3.5 12 5 14.5v4A1.5 1.5 0 0 0 6.5 20H8M16 4h1.5A1.5 1.5 0 0 1 19 5.5v4l1.5 2.5-1.5 2.5v4a1.5 1.5 0 0 1-1.5 1.5H16"/>',
    otp: '<rect x="3" y="6.5" width="18" height="11" rx="2.5"/><path d="M7 12h.01M10.5 12h.01M14 12h.01M17.5 12h.01" stroke-width="2.4"/>',
    text: '<path d="M5 6h14M5 10.5h14M5 15h9M5 19.5h6"/>',
    enter: '<path d="M19 5v6a3 3 0 0 1-3 3H5"/><path d="m9 10-4 4 4 4"/>',
  };

  const ITEMS = [
    { k: "link", ic: "link", t: "https://docs.lumen.example/setup#install", m: "Link · Firefox · now" },
    { k: "text", ic: "text", t: "Meet at the north entrance at 6:15. I'll have the tickets, just text me when you're parking.", m: "Text · Signal · 4 min" },
    { k: "image", ic: "image", t: "Screenshot 14:02", m: "Screenshot · 1440 × 900 · 12 min · 284 KB", img: true },
    { k: "code", ic: "code", t: "const total = items.reduce((sum, i) => sum + i.price, 0);", m: "Code · Zed · 25 min" },
    { k: "file", ic: "file", t: "invoice-0412.pdf", m: "File · Files · 1 h" },
    { k: "rich", ic: "file-text", t: "Q4 pricing: free tier goes to 5 projects, annual discount 15%", m: "Formatted text · Office · 2 h", pin: true },
    { k: "text", ic: "text", t: "118 Front Street, Old Town", m: "Text · Maps · 3 h", star: true },
    { k: "link", ic: "link", t: "https://shop.example.com/order/88213?utm_source=mail&utm_campaign=nov", m: "Link · Mail · Yesterday" },
  ];

  const desk = (inner, o = {}) => `<div class="cb-desk">
    <div class="cb-bar"><span class="ws"><b>2</b><i></i><i></i></span><span class="sp"></span><span>Thu 12 Nov  20:09</span></div>
    <div class="cb-bgwin" style="${o.narrow ? "left:30px;right:30px" : "left:90px;right:90px"}"><div class="h"><i></i><span></span></div><div class="b">${Array.from({ length: 14 }, (_, i) => `<span style="width:${30 + ((i * 37) % 60)}%"></span>`).join("")}</div></div>
    <div class="cb-veil"></div>${inner}</div>`;

  const codeCard = (o = {}) => `<div class="cb-code ${o.small ? "sm" : ""}">${icon("otp")}<div class="tx"><b>483 920</b><span>Verification code · Fairhaven Credit Union</span></div><span class="cb-left">${ring(70, { size: 30, label: " " })}<span>2:41</span></span>${btn("Copy", "", "copy")}</div>`;
  const tabs = (on = "Recent") => `<div class="seg cb-tabs">${[["Recent", "1,284"], ["Pinned", "23"], ["Snippets", "9"]].map(([t, n]) => `<button class="${t === on ? "on" : ""}">${t}<span class="n">${n}</span></button>`).join("")}</div>`;
  const kinds = (on = "All") => `<div class="cb-kinds">${["All", "Text", "Links", "Images", "Files", "Code"].map((k) => `<span class="cb-kind ${k === on ? "on" : ""}">${k}</span>`).join("")}<span class="sp"></span><span class="cb-tip">or type <code>img:</code> <code>url:</code> <code>fav:</code></span></div>`;
  const head = (o = {}) => `<div class="cb-head">
    <div class="cb-search ${o.q ? "" : "noq"} ${o.blur ? "blur" : ""}">${icon("search")}${o.q ? `<span class="q">${o.q}</span>` : `<span class="ph">${o.ph || "Search everything you copied"}</span>`}</div>
    ${tabs(o.tab)}
    <button class="cb-priv">${icon("eyeoff")}<span>Private</span></button>
  </div>`;
  const glyph = (it) => it.img ? `<span class="cb-g img">${art("shot", { w: 32, h: 32, r: 6 })}</span>` : `<span class="cb-g k-${it.k}">${icon(it.ic)}</span>`;
  const row = (it, i, sel, o = {}) => `<div class="cb-row ${sel ? "sel" : ""}">${glyph(it)}<div class="tx"><span class="t ${it.k === "code" ? "mono" : ""}">${it.t}</span><span class="m">${it.m}</span></div>${it.star ? icon("star", "mk st") : ""}${it.pin ? icon("pin", "mk") : ""}${o.keys && i < 9 ? `<span class="cb-n">Alt ${i + 1}</span>` : ""}</div>`;
  const foot = (left, o = {}) => `<div class="cb-foot"><span>${left}</span><span class="sp"></span>${o.noSettings ? "" : `<span class="cb-set">${icon("sliders")}Settings</span>`}</div>`;

  /* ── Option A: list and preview ───────────────────────────────────────── */
  const previewText = () => `<div class="cb-prev">
    <div class="cb-pm">${icon("text")}<span>Text · copied from Signal · 4 min ago · 92 characters</span></div>
    <div class="cb-pbody">Meet at the north entrance at 6:15. I'll have the tickets, just text me when you're parking.</div>
    <div class="cb-facts"><span>From</span><b>Signal</b><span>Copied</span><b>Twice today, last at 20:05</b><span>Pastes as</span><b>Plain text</b></div>
    <div class="cb-pacts">${btn("Paste", "primary", "enter")}${btn("Paste as plain text", "")}<span class="sp"></span>${ib("pin", "Pin (Ctrl P)")}${ib("star", "Favorite (Ctrl S)")}${btn("Actions", "ghost", "more")}</div>
  </div>`;

  const actionsPane = () => {
    const G = [
      ["Change it", [["text", "UPPERCASE"], ["text", "lowercase"], ["text", "Title Case"], ["text", "Sentence case"], ["text", "Trim spaces"], ["text", "Join lines"]]],
      ["Send to", [["file-text", "New note"], ["file-text", "Add to a note…"], ["share", "Share…"], ["cloud", "Save to Drive"], ["file", "Save as a file…"]]],
      ["Assistant, on this computer", [["sparkle", "Summarize"], ["sparkle", "Rewrite"], ["sparkle", "Translate into English"], ["sparkle", "Pull out the details"]]],
      ["Keep", [["pin", "Pin"], ["star", "Add to favorites"], ["snippet", "Save as a snippet"], ["trash", "Delete", "danger"]]],
    ];
    return `<div class="cb-prev cb-actp">
      <div class="cb-afield">${icon("search")}<span class="q">tr</span><span class="cb-ah">Actions for “Meet at the north entrance…”</span></div>
      <div class="cb-agrid">${G.map(([h, xs]) => `<div class="cb-ag"><div class="h">${h}</div>${xs.map(([ic, l, c]) => `<div class="cb-ai ${c || ""} ${/^Tr/.test(l) ? "hit" : ""} ${l === "Translate into English" ? "sel" : ""}">${icon(ic)}<span>${l}</span></div>`).join("")}</div>`).join("")}</div>
      <div class="cb-pacts">${btn("Back", "ghost", "chev-l")}<span class="sp"></span><span class="cb-hint">↵ runs it · Esc goes back</span></div>
    </div>`;
  };

  const cardA = (o = {}) => `<div class="cb-card a">
    ${head({ blur: o.actions })}
    ${kinds()}
    <div class="cb-body">
      <div class="cb-list">${codeCard({ small: true })}<div class="cb-day">Today</div>${ITEMS.slice(0, 7).map((it, i) => row(it, i, i === 1, { keys: true })).join("")}</div>
      ${o.actions ? actionsPane() : previewText()}
    </div>
    ${foot("↑ ↓ move · Ctrl Space picks several · F1 every key")}
  </div>`;

  /* Settings › Clipboard, the page in Nyx Settings */
  const settingsSide = () => `
    ${grp("Desktop", true, "", "pink")}
    ${navx("monitor", "Bar")}
    ${navx("grid", "Dock")}
    ${navx("bell", "Notifications")}
    ${navx("clipboard", "Clipboard", { active: true })}
    ${navx("window", "Workspaces")}
    ${grp("Input", false, "", "coral")}
    ${navx("keyboard", "Keyboard")}
    ${navx("mouse", "Mouse and trackpad")}
    ${grp("System", false, "", "red")}
    ${navx("power", "Power")}
    ${navx("shield", "Privacy")}`;
  const settingsPage = () => `<div class="content"><div class="clamp" style="--clamp: 680px">
    <div class="cb-stat">${icon("clipboard")}<div class="tx"><b>1,284 items · 23 pinned · 9 snippets</b><span>48.2 MB on this computer · watching the clipboard</span></div>${btn("Open Clipboard", "", "external")}</div>
    ${setcard("", [["Private mode", "Stop saving what you copy until you turn it off. Also Ctrl Shift P in the pop-up.", sw(false)]])}
    ${setcard("Opening", [
      ["Shortcut", "Super V still pastes as Omarchy does.", `<span class="cb-keyf">${kbd("Super")}${kbd("Ctrl")}${kbd("V")}</span>`],
      ["Opens", "", seg(["In the middle", "At the pointer"], "In the middle")],
      ["Between items pasted together", "When you pick several with Ctrl Space.", dd("A new line")],
    ])}
    ${setcard("History", [
      ["Keep", "Older items go first. Pinned items always stay.", dd("1,000 items")],
      ["For", "Items you haven't used for this long are removed.", dd("30 days")],
      ["Save images", "Screenshots and copied pictures, up to 10 MB each.", sw(true)],
      ["Clear history", "Everything except pinned items.", btn("Clear", "dtext")],
    ])}
    ${setcard("Privacy", [
      ["Don't save passwords and keys", "Kept in memory for two minutes, never written down.", sw(true)],
      ["Don't save copies from", "", `<span class="cb-apps">${chip("1Password")}${chip("KeePassXC")}${chip("Add", "acc", "plus")}</span>`],
    ])}
    <div class="cb-more">${icon("chev-d")}Verification codes, Assistant, and actions from other apps</div>
  </div></div>`;

  /* ── Option B: one list, the chosen item opens in place ───────────────── */
  const openRow = () => `<div class="cb-row sel open">${glyph(ITEMS[1])}<div class="tx"><span class="t full">${ITEMS[1].t}</span><span class="m">${ITEMS[1].m}</span>
      <div class="cb-ra">${btn("Paste", "primary sm", "enter")}${btn("Plain text", "sm")}${btn("Pin", "sm ghost", "pin")}${btn("Actions", "sm ghost", "more")}</div></div><span class="cb-n">Alt 2</span></div>`;
  const cardB = (o = {}) => `<div class="cb-card b">
    ${head({ ph: "Search" })}
    ${o.narrow ? "" : kinds()}
    <div class="cb-listb">${codeCard()}${row(ITEMS[0], 0, false, { keys: true })}${openRow()}${ITEMS.slice(2, o.narrow ? 6 : 7).map((it, i) => row(it, i + 2, false, { keys: true })).join("")}</div>
    ${foot("1,284 items · Ctrl Space picks several · F1 keys")}
  </div>`;

  const SNIPS = [
    ["Email signature", "Sam Rivera · Lumen Labs · sam@lumen.example"],
    ["Standup", "Yesterday: … Today: … Blocked: nothing ({weekday})"],
    ["Home address", "42 Linden Court, West End"],
    ["Meeting link", "https://meet.example.com/sam-rivera"],
  ];
  const cardSnip = () => `<div class="cb-card b">
    ${head({ tab: "Snippets", ph: "Search snippets", blur: true })}
    <div class="cb-listb">
      <div class="cb-edit">
        <div class="cb-eh">${icon("snippet")}<b>New snippet</b></div>
        <div class="field"><span>Thanks reply</span></div>
        <div class="cb-ebody">Thanks, {clipboard} is perfect. I'll send the final version on {weekday}.<span class="caret"></span></div>
        <div class="cb-ph"><span>Fill in when pasted:</span>${["{date}", "{time}", "{datetime}", "{weekday}", "{clipboard}"].map((p) => `<code>${p}</code>`).join("")}</div>
        <div class="cb-eb"><span class="cb-prevt">Pastes as: “Thanks, <i>what you copied</i> is perfect. I'll send the final version on Friday.”</span><span class="sp"></span>${btn("Cancel", "ghost")}${btn("Save", "primary")}</div>
      </div>
      ${SNIPS.map(([n, b], i) => `<div class="cb-row"><span class="cb-g k-snip">${icon("snippet")}</span><div class="tx"><span class="t">${n}</span><span class="m">${b}</span></div><span class="cb-n">Alt ${i + 1}</span></div>`).join("")}
    </div>
    ${foot("Ctrl N new · Ctrl E edit · ↵ paste")}
  </div>`;

  REG("clipboard", {
    name: "Clipboard",
    icons: ICONS,
    summary: "Clipboard keeps a searchable history with pins, snippets, smart actions and verification codes, but its pop-up hides nearly all of that behind three unlabelled icons, a line of key hints and a right-click.",
    problems: [
      "<b>Three unlabelled tabs:</b> Recent, Pinned and Snippets are bare icons beside the search, with the private-mode eye next to them looking like a fourth tab.",
      "<b>You can't read what you'd paste:</b> each item is one cut-off line; the whole text or a larger picture only appears as a hover tooltip, so the keyboard never sees it.",
      "<b>The actions are hidden:</b> change case, convert, send to Notes, the Assistant and the rest only open with the Menu key, Shift F10 or a right-click.",
      "<b>Filters are secret words:</b> <code>img:</code>, <code>url:</code>, <code>file:</code>, <code>code:</code> and <code>fav:</code> work in the search but nothing shows them.",
      "<b>A footer of shortcuts</b> (“↵ Paste · ⇧↵ Plain · Ctrl+P Pin · Menu Actions · F1 Keys”) stands in for buttons.",
      "<b>Pinned and favorite are two marks</b> (a pin and a star) that mean nearly the same thing, and every row ends in an “Alt 1”…“Alt 9” label.",
      "<b>Settings are out of reach:</b> they live in Settings › Desktop › Clipboard, and the pop-up has no way to get there or to show how much is stored.",
    ],
    today: [],
    todayNote: "No screenshot: Clipboard's window is a pop-up over the screen, so it wasn't run. The problems come from its code.",
    options: [
      { id: "a", name: "The clipboard pop-up", idea: "Labelled tabs with counts, labelled Paste and Paste as plain text, Pin and Actions, a verification code on top with its countdown, and a private switch that says what it does. Two layouts: a list and preview (a wider pop-up with the chosen item in full on the right, actions opening in place of the preview, and Settings one click away), or rows that open in place (today's compact pop-up, where the chosen row opens up with its buttons, and snippets are written with their fill-ins as chips).",
        variants: ["With a list and preview","With rows that open in place"],
        shots: [
          ["a-recent","With a list and preview · The pop-up","History on the left, the item in full on the right"],
          ["a-actions","With a list and preview · Actions","Grouped and searchable, in place of the preview"],
          ["a-settings","With a list and preview · Settings › Clipboard","What's stored first, then the options"],
          ["b-recent","With rows that open in place · The pop-up","The chosen item opens with its buttons"],
          ["b-snippet","With rows that open in place · Writing a snippet","Fill-ins as chips, with a preview"],
          ["b-recent-800","With rows that open in place · On an 800 px screen","Same card, kind chips folded away"],
        ] },
    ],
    pages: {
      "a-recent": () => desk(cardA()),
      "a-actions": () => desk(cardA({ actions: true })),
      "a-settings": () => win({ hdr: header({ icon: "sliders", name: "Settings", center: search("Search settings", "Ctrl F") }).replace(ib("sliders", "Settings (Ctrl+,)"), ""), side: settingsSide(), page: `${pbar2("Clipboard", "History, privacy, snippets and codes")}${settingsPage()}` }),
      "b-recent": () => desk(cardB({ narrow: NARROW }), { narrow: NARROW }),
      "b-snippet": () => desk(cardSnip()),
    },
  });
})();
