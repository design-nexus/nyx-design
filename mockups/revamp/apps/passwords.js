// Nyx Passwords on the revamp page: today's problems and three options. Every login here is made up.
(() => {
  const ME = "alex@morgan.example";
  // [name, username, flags]: s = favourite, c = one-time code, w = weak, r = reused, o = old
  const ITEMS = [
    ["Airbnb", ME, ""],
    ["Amazon", ME, "s"],
    ["Bank of Northfield", "amorgan84", "sc"],
    ["City Library", "21890044", "w"],
    ["Duolingo", ME, "r"],
    ["Fastmail", ME, "sc"],
    ["Figma", "alex@studio-morgan.example", "c"],
    ["GitHub", "alex-morgan", "sc"],
    ["Hetzner", "am-2291", "c"],
    ["Netflix", ME, "r"],
    ["Northwind Energy", ME, "o"],
    ["Spotify", ME, ""],
    ["Trainline", ME, "r"],
  ];
  const mono = (name, size = 30) => `<span class="mono2" style="width:${size}px;height:${size}px;font-size:${Math.round(size * 0.44)}px;--mc:${swc(hash(name + "x"))}">${name[0]}</span>`;

  const hdr = (o = {}) => header({
    icon: "pkey", name: "Passwords",
    center: o.center !== undefined ? o.center : search(o.q || "Search the vault", "Ctrl F"),
    end: `${ib("lock", "Lock the vault (Ctrl+L)")}<button class="newbtn">${icon("plus")}<span>New item</span><span class="key">Ctrl N</span></button>`,
  });

  /* ── Option A: three panes, tidied ────────────────────────────────────── */
  const sideA = (on = "all", o = {}) => `
    ${o.noTiles ? navx("listic", "All items", { active: on === "all", cnt: 248 }) + navx("star", "Favorites", { cnt: 12 }) + navx("shield", "To fix", { badge: 9 }) : tiles([["all", "listic", 248, "All items", "blue"], ["fav", "star", 12, "Favorites", "amber"], ["sec", "shield", 9, "To fix", "red"], ["rec", "clock", 20, "Recent", "teal"]], on)}
    ${grp("Types", false, "", "accent")}
    ${navx("pkey", "Logins", { cnt: 214 })}
    ${navx("file-text", "Secure notes", { cnt: 11 })}
    ${navx("pcard", "Cards", { cnt: 4 })}
    ${navx("user", "Identities", { cnt: 2 })}
    ${navx("terminal", "SSH keys", { cnt: 3 })}
    ${navx("wifi", "Wi-Fi networks", { cnt: 3 })}
    ${grp("Folders", false, icon("plus"), "green")}
    ${navx("folder", "Personal", { cnt: 96 })}
    ${navx("folder", "Work", { cnt: 41 })}
    ${navx("folder", "Home and bills", { cnt: 27 })}
    ${grp("Shared", false, "", "violet")}
    ${navx("users", "Morgan family", { cnt: 18 })}
    ${grp("More", false, "", "graphite")}
    ${navx("send", "Email aliases", { cnt: 6 })}
    ${navx("trash", "Trash", { cnt: 8 })}
    <div class="foot">${icon("check-c", "ok")}<span>Synced 2 min ago</span></div>`;

  const list = (sel = 7, o = {}) => `<div class="list plist">
    <div class="lhead"><b>${o.title || "All items"}</b><span class="c">${o.count || "248"}</span><span class="sp"></span>${dd("A to Z", "sort")}</div>
    <div class="scroll">${(o.items || ITEMS).map(([n, u, f], i) => `<div class="prow ${i === sel ? "sel" : ""}">${mono(n)}<div class="tx"><div class="r1"><span class="n">${n}</span>${f.includes("s") ? icon("star", "fav") : ""}</div><div class="u">${u}</div></div>${f.includes("w") || f.includes("r") || f.includes("o") ? `<span class="warn" title="Needs attention">${icon("alert")}</span>` : ""}</div>`).join("")}</div></div>`;

  const ring2 = (s) => `<span class="totp">${ring(s * 100 / 30, { size: 26, c: "var(--accent)", label: " " })}<span>${s}</span></span>`;
  const detail = (o = {}) => `<div class="main pdet">
    <div class="dhead">${mono("GitHub", 48)}<div class="dt"><b>GitHub</b><span>Login · Personal</span></div><span class="sp"></span>${ib("star", "Favorite", "on fav")}${btn("Edit", "", "pen")}${ib("more", "Copy, move, attachments, trash")}</div>
    <div class="dact">${btn("Copy password", "primary", "copy")}${btn("Copy code", "", "clock")}${btn("Open github.com", "", "external")}</div>
    <div class="dbody"><div class="clamp" style="--clamp: 620px">
      <div class="card fields">
        <div class="fr"><span class="k">Username</span><span class="v">alex-morgan</span><span class="h">Click to copy</span></div>
        <div class="fr"><span class="k">Password</span><span class="v dots">•••••••••••••••••</span>${ib("eye", "Show for 30 seconds")}</div>
        <div class="fr"><span class="k">One-time code</span><span class="v code">481 093</span>${ring2(18)}</div>
        <div class="fr"><span class="k">Web address</span><span class="v link">github.com</span></div>
      </div>
      <div class="gtitle">Notes</div>
      <div class="card"><div class="opt"><div class="opt-text">Recovery codes are in the attachment. Organisation: lumen-site (owner).</div></div></div>
      <div class="gtitle">Attachments</div>
      <div class="card"><div class="opt">${icon("file-text", "aic")}<div class="opt-text"><div>github-recovery-codes.txt</div><div class="d">1 KB</div></div>${btn("Save…", "sm")}</div></div>
      ${o.narrow ? "" : `<div class="okline">${icon("check-c")}<span>Strong, not used anywhere else, changed 3 months ago. Two-step login is on.</span></div>`}
    </div></div></div>`;

  const pageA = (o = {}) => `<div class="cols">${list(7, o)}${detail(o)}</div>`;

  const editor = () => `<div class="main pdet pedit">
    <div class="dhead">${mono("GitHub", 48)}<div class="dt"><b>Edit GitHub</b><span>Login · changes save to your server</span></div><span class="sp"></span>${btn("Cancel", "ghost")}${btn("Save", "primary", "check")}</div>
    <div class="dbody"><div class="clamp" style="--clamp: 620px">
      <div class="ef"><label>Name</label><div class="field">GitHub</div></div>
      <div class="ef"><label>Username</label><div class="field">alex-morgan<span class="sp"></span>${ib("pdice", "Make a username")}</div></div>
      <div class="ef"><label>Password</label><div class="field focus mono3">Hearth-Tulip-Copper-41<span class="sp"></span>${ib("eye", "Hide")}${ib("pdice", "Generate", "on")}</div><span class="str"><b style="width:92%"></b></span><span class="strl">Very strong · would take centuries to guess</span></div>
      <div class="ef"><label>One-time code key</label><div class="field">•••• •••• •••• ••••<span class="sp"></span>${ib("eye", "Show")}</div></div>
      <div class="ef"><label>Web addresses</label><div class="field">https://github.com<span class="sp"></span>${dd("Match the site")}</div><span class="addl">${icon("plus")}Add another</span></div>
      <div class="erow"><div class="ef"><label>Folder</label>${dd("Personal", "folder")}</div><div class="ef"><label>Shared with</label>${dd("Only me", "users")}</div></div>
      <div class="ef"><label>Notes</label><div class="field area">Recovery codes are in the attachment.</div></div>
    </div></div>
    <div class="gen pop" style="right:22px;top:262px">
      <div class="gh">Generate a password</div>
      ${seg(["Words", "Characters"], "Words")}
      <div class="gr"><span>Words</span><span class="slider" style="width:150px"><span class="tr"><span class="fill" style="width:40%"></span></span><span class="kn" style="left:40%"></span></span><b>4</b></div>
      <div class="gr"><span>Add a number</span>${sw(true)}</div>
      <div class="gr"><span>Capitals</span>${sw(true)}</div>
      <div class="gr"><span>Between words</span>${dd("Dash")}</div>
      <div class="gb">${btn("Again", "", "refresh")}${btn("Use this", "primary")}</div>
    </div></div>`;

  /* ── Option B: a home with your vault's health ─────────────────────────── */
  const sideB = (on = "home") => `
    ${navx("home", "Home", { active: on === "home" })}
    ${navx("listic", "All items", { cnt: 248 })}
    ${navx("star", "Favorites", { cnt: 12 })}
    ${navx("shield", "Security", { active: on === "sec", badge: 9 })}
    ${grp("Types", false, "", "accent")}
    ${navx("pkey", "Logins", { cnt: 214 })}
    ${navx("file-text", "Secure notes", { cnt: 11 })}
    ${navx("pcard", "Cards", { cnt: 4 })}
    ${navx("user", "Identities", { cnt: 2 })}
    ${navx("terminal", "SSH keys", { cnt: 3 })}
    ${navx("wifi", "Wi-Fi networks", { cnt: 3 })}
    ${grp("Folders", false, icon("plus"), "green")}
    ${navx("folder", "Personal")}
    ${navx("folder", "Work")}
    ${navx("users", "Morgan family", { sub: "Shared" })}
    ${grp("More", false, "", "graphite")}
    ${navx("send", "Email aliases")}
    ${navx("trash", "Trash", { cnt: 8 })}`;

  const health = (narrow) => `<div class="hcard">
    ${ring(86, { size: narrow ? 88 : 104, c: "var(--success)", label: "86" })}
    <div class="ht"><b>Your vault is in good shape</b><span>9 logins could be safer. Everything is checked on this computer; nothing is sent anywhere.</span>
      <div class="hb">${btn("Fix the first one", "primary")}${btn("Check for breaches…", "", "shield")}</div></div></div>`;
  const ISSUES = [
    ["alert", "red", "3", "Weak passwords", "Easy to guess"],
    ["copy", "amber", "4", "Used more than once", "One leak opens several sites"],
    ["clock", "teal", "2", "Over a year old", "Worth changing now and then"],
    ["shield", "violet", "5", "Two-step login is off", "On sites that offer it"],
  ];
  const quick = (n, u) => `<div class="qrow">${mono(n, 28)}<div class="tx"><b>${n}</b><span>${u}</span></div>${ib("user", "Copy username")}${ib("copy", "Copy password")}</div>`;
  const homeB = (narrow) => `<div class="phome"><div class="clamp" style="--clamp: 900px">
    ${health(narrow)}
    <div class="igrid">${ISSUES.map(([i, c, n, t, d]) => `<div class="icard2" style="--ic:var(--sw-${c})"><span class="ii">${icon(i)}</span><b class="n">${n}</b><div><b>${t}</b><span>${d}</span></div></div>`).join("")}</div>
    <div class="twocol">
      <div><div class="sechead">Used lately</div><div class="card qlist">${quick("GitHub", "alex-morgan")}${quick("Bank of Northfield", "amorgan84")}${quick("Fastmail", ME)}${narrow ? "" : quick("Hetzner", "am-2291")}</div></div>
      ${narrow ? "" : `<div><div class="sechead">Favorites</div><div class="card qlist">${quick("Amazon", ME)}${quick("Spotify", ME)}${quick("Figma", "alex@studio-morgan.example")}${quick("Airbnb", ME)}</div></div>`}
    </div>
    ${narrow ? "" : `<div class="sechead">More in Passwords</div><div class="tools">${[["send", "Email aliases", "6 active, made for sign-ups"], ["users", "Emergency access", "2 people you trust"], ["import", "Import", "From Bitwarden or another app"], ["export", "Export", "A backup, with a password"]].map(([i, t, d]) => `<div class="tool">${icon(i)}<div><b>${t}</b><span>${d}</span></div></div>`).join("")}</div>`}
  </div></div>`;

  const SEC = [
    ["Weak passwords", "red", [["City Library", "21890044", "Only 8 numbers", "Change…"], ["Northwind Energy", ME, "A word from the dictionary", "Change…"]]],
    ["Used more than once", "amber", [["Duolingo", ME, "Same as Netflix and Trainline", "Change…"], ["Netflix", ME, "Same as Duolingo and Trainline", "Change…"]]],
    ["Two-step login is off", "violet", [["Amazon", ME, "Amazon offers one-time codes", "Add code…"], ["Spotify", ME, "Spotify offers one-time codes", "How to"]]],
    ["Not secure", "teal", [["City Library", "21890044", "Its address starts with http://", "Use https…"]]],
  ];
  const security = () => `<div class="psec">
    <div class="sbar3"><div><b>Security</b><span>Worked out on this computer. Breach checks send only the first five characters of each password's fingerprint.</span></div><span class="sp"></span>${btn("Check for breaches…", "", "shield")}${btn("Check two-step login…", "", "lock")}</div>
    <div class="scroll"><div class="clamp" style="--clamp: 820px">${SEC.map(([t, c, rows]) => `<div class="gtitle" style="color:var(--sw-${c})">${t}<span class="cn">${rows.length}</span></div><div class="card">${rows.map(([n, u, why, act]) => `<div class="opt">${mono(n, 30)}<div class="opt-text"><div>${n} <span class="uu">${u}</span></div><div class="d">${why}</div></div>${btn(act, "sm")}</div>`).join("")}</div>`).join("")}</div></div></div>`;

  /* ── Option C: find and copy ──────────────────────────────────────────── */
  const RES = [
    ["GitHub", "alex-morgan", "github.com · Personal", true],
    ["GitHub (work)", "amorgan-lumen", "github.com · Work"],
    ["Gitea at home", "alex", "git.morgan.example · Personal"],
    ["GitLab", ME, "gitlab.com · Work"],
  ];
  const findPage = (narrow) => `<div class="pfind"><div class="clamp" style="--clamp: 760px">
    <div class="bigsearch">${icon("search")}<span class="q">git</span><span class="cur"></span><span class="sp"></span>${chip("All types", "", "filter")}</div>
    <div class="rlist">${RES.map(([n, u, w, on], i) => `<div class="fres ${on ? "on" : ""}">${mono(n, 38)}<div class="tx"><b>${n}</b><span>${u}</span><span class="w">${w}</span></div>${on ? `<div class="qa">${btn(narrow ? "User" : "Username", "sm", "user")}${btn("Password", "sm primary", "copy")}${btn("Code", "sm", "clock")}</div>` : `<span class="kh">${kbd("↓")}</span>`}</div>`).join("")}</div>
    <div class="hints"><span>${kbd("Enter")} Copy password</span><span>${kbd("Ctrl Shift U")} Username</span><span>${kbd("Ctrl Shift O")} Code</span>${narrow ? "" : `<span>${kbd("Space")} Show details</span>`}</div>
    <div class="cleared">${icon("check-c")}<span><b>Password copied.</b> The clipboard clears itself in 30 seconds.</span></div>
    <div class="sechead favh">Favorites</div>
    <div class="favs">${[["Amazon", ME], ["Bank of Northfield", "amorgan84"], ["Fastmail", ME], ["Spotify", ME], ["Figma", "alex@studio-morgan.example"], ["Home Wi-Fi", "Morgan-5G"]].slice(0, narrow ? 4 : 6).map(([n, u]) => `<div class="fav2">${mono(n, 30)}<div><b>${n}</b><span>${u}</span></div></div>`).join("")}</div>
  </div></div>`;
  const sideC = () => `
    ${navx("search", "Find", { active: true })}
    ${navx("listic", "All items")}
    ${navx("star", "Favorites")}
    ${navx("shield", "Security", { badge: 9 })}
    ${grp("Types", false, "", "accent")}
    ${navx("pkey", "Logins")}
    ${navx("file-text", "Secure notes")}
    ${navx("pcard", "Cards")}
    ${navx("user", "Identities")}
    ${navx("terminal", "SSH keys")}
    ${navx("wifi", "Wi-Fi networks")}
    ${grp("Folders", false, "", "green")}
    ${navx("folder", "Personal")}
    ${navx("folder", "Work")}
    ${navx("users", "Morgan family")}
    ${grp("More", false, "", "graphite")}
    ${navx("send", "Email aliases")}
    ${navx("trash", "Trash")}`;

  const locked = () => `<div class="plock"><div class="lk">
    <span class="lic">${icon("lock")}</span>
    <b>Vault locked</b><span class="who">${ME} on vault.morgan.example</span>
    <div class="field focus">${icon("pkey")}<span class="ph">Master password</span></div>
    ${btn("Unlock", "primary wide")}
    <div class="or"><span>or</span></div>
    <div class="alts">${btn("Use your face", "", "eye")}${btn("Use the keyring", "", "pkey")}</div>
    <span class="note">Locks after 15 minutes without use, when the screen locks and before sleep. Change it in Settings.</span>
    <span class="so">Sign out of this device…</span>
  </div></div>`;

  /* ── Option C (n1): one list that opens in place ──────────────────────── */
  const n1side = (on = "all") => `
    ${grp("Vault", true, "", "accent")}
    ${navx("listic", "All items", { active: on === "all", cnt: 248 })}
    ${navx("star", "Favorites", { cnt: 12 })}
    ${navx("shield", "Security", { badge: 9 })}
    ${grp("Types", false, "", "teal")}
    ${navx("pkey", "Logins", { cnt: 214 })}
    ${navx("file-text", "Secure notes", { cnt: 11 })}
    ${navx("pcard", "Cards", { cnt: 4, active: on === "cards" })}
    ${navx("user", "Identities", { cnt: 2 })}
    ${navx("terminal", "SSH keys", { cnt: 3 })}
    ${navx("wifi", "Wi-Fi networks", { cnt: 3 })}
    ${grp("Folders", false, icon("plus"), "green")}
    ${navx("folder", "Personal", { cnt: 96 })}
    ${navx("folder", "Work", { cnt: 41 })}
    ${grp("Shared", false, "", "violet")}
    ${navx("users", "Morgan family", { cnt: 18 })}
    ${grp("More", false, "", "graphite")}
    ${navx("send", "Email aliases", { cnt: 6 })}
    ${navx("people", "Emergency access")}
    ${navx("trash", "Trash", { cnt: 8 })}
    <div class="foot">${icon("check-c", "ok")}<span>Synced 2 min ago</span></div>`;
  const FLAG = { w: ["Weak", "red"], r: ["Reused", "amber"], o: ["Over a year old", "teal"] };
  const n1row = ([n, u, f, lead], hover) => `<div class="pn1-row ${hover ? "hover" : ""}">${lead ? `<span class="pn1-ti">${icon(lead)}</span>` : mono(n, 32)}<div class="tx"><div class="r1"><span class="n">${n}</span>${f.includes("s") ? icon("star", "fav") : ""}</div><div class="u">${u}</div></div>${[..."wro"].filter((c) => f.includes(c)).map((c) => `<span class="pn1-flag" style="--fc:var(--sw-${FLAG[c][1]})">${FLAG[c][0]}</span>`).join("")}${f.includes("c") ? `<span class="pn1-has" title="Has a one-time code">${icon("clock")}</span>` : ""}${hover ? `<span class="pn1-q">${btn("Username", "sm", "user")}${btn("Password", "sm", "copy")}</span>` : ""}</div>`;
  const tile = (k, v, end, cls = "") => `<div class="pn1-tile ${cls}"><div class="tt"><span class="k">${k}</span><span class="v">${v}</span></div>${end}</div>`;
  const n1open = () => `<div class="pn1-open">
    <div class="oh">${mono("GitHub", 44)}<div class="dt"><div class="r1"><b>GitHub</b>${icon("star", "fav")}</div><span>Login · Personal</span></div><span class="sp"></span>${btn("Copy password", "primary", "copy")}${btn("Open github.com", "", "external")}${btn("Edit", "", "pen")}${ib("more", "Move, share, attachments, trash")}${ib("chev-u", "Close (Esc)")}</div>
    <div class="ofields">
      ${tile("Username", "alex-morgan", ib("copy", "Copy username (Ctrl+Shift+U)"))}
      ${tile("Password", `<span class="dots">•••••••••••••••</span>`, ib("eye", "Show for 30 seconds") + ib("copy", "Copy password (Ctrl+Shift+C)"))}
      ${tile("One-time code", `<span class="code">481 093</span>`, ring2(18) + ib("copy", "Copy code (Ctrl+Shift+O)"))}
      ${tile("Web address", `<span class="link">github.com</span>`, ib("external", "Open"), "")}
    </div>
    <div class="ometa">
      <span class="ok">${icon("check-c")}Strong and not used anywhere else · changed 3 months ago · two-step login on</span>
    </div>
    <div class="ometa2">
      <span class="note">${icon("file-text")}<span>Recovery codes are in the attachment. Organisation: lumen-site (owner).</span></span>
      <span class="att">${icon("clip")}<span>github-recovery-codes.txt</span><span class="sz">1 KB</span></span>
    </div>
  </div>`;
  const AZ = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#";
  const az = (on) => `<div class="pn1-az">${[...AZ].map((c) => `<span class="${c === on ? "on" : ""} ${"ABCDFGHNST".includes(c) ? "" : "no"}">${c}</span>`).join("")}</div>`;
  const lh = (c) => `<div class="pn1-lh">${c}</div>`;
  const n1list = (body, o = {}) => `${pbar2(o.title || "All items", o.sub || "248 items", `${o.chips || ""}${dd("A to Z", "sort")}`)}<div class="pn1-wrap"><div class="pn1-list"><div class="clamp" style="--clamp: 800px">${body}</div></div>${o.noAz ? "" : az(o.az || "G")}</div>`;
  const n1item = () => n1list(`${lh("D")}${n1row(["Duolingo", ME, "r"])}${lh("F")}${n1row(["Fastmail", ME, "sc"])}${n1row(["Figma", "alex@studio-morgan.example", "c"], true)}${lh("G")}${n1open()}${n1row(["GitLab", ME, "c"])}${lh("H")}${n1row(["Hetzner", "am-2291", "c"])}${n1row(["Home Wi-Fi", "Morgan-5G", "", "wifi"])}`);
  const n1edit = () => n1list(`${lh("F")}${n1row(["Fastmail", ME, "sc"])}${n1row(["Figma", "alex@studio-morgan.example", "c"])}${lh("G")}<div class="pn1-open edit">
      <div class="oh">${mono("GitHub", 44)}<div class="dt"><div class="r1"><b>Editing GitHub</b></div><span>Changes save to vault.morgan.example</span></div><span class="sp"></span>${btn("Cancel", "ghost")}${btn("Save", "primary", "check")}</div>
      <div class="egrid">
        <div class="ef"><label>Name</label><div class="field">GitHub</div></div>
        <div class="ef"><label>Folder</label>${dd("Personal", "folder")}</div>
        <div class="ef"><label>Username</label><div class="field">alex-morgan<span class="sp"></span>${ib("pdice", "Make a username")}</div></div>
        <div class="ef"><label>Shared with</label>${dd("Only me", "users")}</div>
        <div class="ef wide"><label>Password</label><div class="field focus mono3">Hearth-Tulip-Copper-41<span class="sp"></span>${ib("eye", "Hide")}${ib("pdice", "Generate", "on")}</div><span class="str"><b style="width:92%"></b></span><span class="strl">Very strong · would take centuries to guess</span></div>
        <div class="ef"><label>One-time code key</label><div class="field">•••• •••• •••• ••••<span class="sp"></span>${ib("eye", "Show")}</div></div>
        <div class="ef"><label>Web address</label><div class="field">https://github.com<span class="sp"></span>${dd("Match the site")}</div><span class="addl">${icon("plus")}Add another</span></div>
        <div class="ef wide"><label>Notes</label><div class="field area">Recovery codes are in the attachment. Organisation: lumen-site (owner).</div></div>
      </div>
      <div class="gen pop pn1-gen">
        <div class="gh">Generate a password</div>
        ${seg(["Words", "Characters"], "Words")}
        <div class="gr"><span>Words</span><span class="slider" style="width:130px"><span class="tr"><span class="fill" style="width:40%"></span></span><span class="kn" style="left:40%"></span></span><b>4</b></div>
        <div class="gr"><span>Add a number</span>${sw(true)}</div>
        <div class="gr"><span>Capitals</span>${sw(true)}</div>
        <div class="gr"><span>Between words</span>${dd("Dash")}</div>
        <div class="gb">${btn("Again", "", "refresh")}${btn("Use this", "primary")}</div>
      </div>
    </div>${n1row(["GitLab", ME, "c"])}`);
  const CARDS = [["Everyday Visa", "Visa · ends 4417", "blue"], ["Travel Mastercard", "Mastercard · ends 0932", "coral"], ["Northfield debit", "Debit · ends 5510", "green"], ["Shop card", "Lumen Bakery business · ends 2208", "violet"]];
  const ccRow = ([n, u, c]) => `<div class="pn1-row"><span class="pn1-mini" style="--cc:var(--sw-${c})"></span><div class="tx"><div class="r1"><span class="n">${n}</span></div><div class="u">${u}</div></div></div>`;
  const n1card = () => n1list(`<div class="pn1-open">
      <div class="oh">${`<span class="pn1-mini big" style="--cc:var(--sw-blue)"></span>`}<div class="dt"><div class="r1"><b>Everyday Visa</b>${icon("star", "fav")}</div><span>Card · Personal</span></div><span class="sp"></span>${btn("Copy number", "primary", "copy")}${btn("Edit", "", "pen")}${ib("more", "More")}${ib("chev-u", "Close (Esc)")}</div>
      <div class="pn1-ccwrap">
        <div class="pn1-cc"><span class="bank">Northfield</span><span class="chipx"></span><span class="num">•••• •••• •••• 4417</span><div class="b"><span>ALEX MORGAN</span><span>08/29</span></div><span class="brand">VISA</span></div>
        <div class="ofields one">
          ${tile("Cardholder", "Alex Morgan", ib("copy", "Copy"))}
          ${tile("Number", `<span class="dots">•••• 4417</span>`, ib("eye", "Show for 30 seconds") + ib("copy", "Copy"))}
          ${tile("Expires", "08 / 2029", ib("copy", "Copy"))}
          ${tile("Security code", `<span class="dots">•••</span>`, ib("eye", "Show for 30 seconds") + ib("copy", "Copy"))}
        </div>
      </div>
    </div>${CARDS.slice(1).map(ccRow).join("")}<div class="pn1-new">${icon("plus")}<span>New card</span></div><div class="pn1-tip">${icon("info")}<span>Numbers and security codes stay hidden until you show them, and a copied number is cleared from the clipboard after 30 seconds.</span></div>`, { title: "Cards", sub: "4 cards", noAz: true });

  /* ── Option D (n2): the vault as a table ──────────────────────────────── */
  // [name, username, site, health, two-step, changed, flags]
  const TROWS = [
    ["Airbnb", ME, "airbnb.com", "ok", "off", "Mar 2026", ""],
    ["Amazon", ME, "amazon.com", "ok", "off", "Jan 2026", "s"],
    ["Bank of Northfield", "amorgan84", "northfield.example", "ok", "on", "Sep 2026", "s"],
    ["City Library", "21890044", "library.example", "weak", "none", "2019", ""],
    ["Duolingo", ME, "duolingo.com", "reused", "off", "2022", ""],
    ["Fastmail", ME, "fastmail.com", "ok", "on", "Jun 2026", "s"],
    ["Figma", "alex@studio-morgan.example", "figma.com", "ok", "on", "Apr 2026", ""],
    ["GitHub", "alex-morgan", "github.com", "ok", "on", "Aug 2026", "s"],
    ["Hetzner", "am-2291", "hetzner.com", "ok", "on", "Feb 2026", ""],
    ["Netflix", ME, "netflix.com", "reused", "none", "2023", ""],
    ["Northwind Energy", ME, "northwind.example", "old", "none", "2023", ""],
    ["Spotify", ME, "spotify.com", "fair", "off", "Nov 2025", ""],
    ["Trainline", ME, "thetrainline.com", "reused", "off", "2021", ""],
  ];
  const HEALTH = { ok: ["Strong", "green", 92], fair: ["Fair", "amber", 55], weak: ["Weak", "red", 16], reused: ["Reused", "amber", 38], old: ["Over a year old", "teal", 64] };
  const TWO = { on: ["On", "on"], off: ["Off", "off"], none: ["Not offered", "none"] };
  const hbar = (h) => `<span class="pn2-h" style="--hc:var(--sw-${HEALTH[h][1]})"><span class="bar"><b style="width:${HEALTH[h][2]}%"></b></span><span>${HEALTH[h][0]}</span></span>`;
  const tcols = () => `<div class="pn2-th"><span class="c0"><span class="cbx sq"></span></span><span class="c1">Name ${icon("chev-u", "si")}</span><span class="c2">Username</span><span class="c3">Password</span><span class="c4">Two-step</span><span class="c5">Changed</span></div>`;
  const trow = ([n, u, site, h, two, ch, f], o = {}) => `<div class="pn2-tr ${o.sel ? "sel" : ""} ${o.chk ? "chk" : ""}"><span class="c0"><span class="cbx sq ${o.chk ? "done" : ""}">${o.chk ? icon("check") : ""}</span></span><span class="c1">${mono(n, 26)}<span class="nm"><b>${n}${f.includes("s") ? icon("star", "fav") : ""}</b><span>${site}</span></span></span><span class="c2">${u}</span><span class="c3">${hbar(h)}</span><span class="c4"><span class="pn2-two ${TWO[two][1]}">${two === "on" ? icon("check") : ""}${TWO[two][0]}</span></span><span class="c5">${ch}</span></div>`;
  const n2side = (on = "all") => `
    ${grp("Vault", true, "", "accent")}
    ${navx("listic", "All items", { active: on === "all", cnt: 248 })}
    ${navx("star", "Favorites", { cnt: 12 })}
    ${navx("shield", "Needs a fix", { active: on === "fix", badge: 9 })}
    ${grp("Types", false, "", "teal")}
    ${navx("pkey", "Logins", { cnt: 214 })}
    ${navx("file-text", "Secure notes", { cnt: 11 })}
    ${navx("pcard", "Cards", { cnt: 4 })}
    ${navx("user", "Identities", { cnt: 2 })}
    ${navx("terminal", "SSH keys", { cnt: 3 })}
    ${navx("wifi", "Wi-Fi networks", { cnt: 3 })}
    ${grp("Folders", false, icon("plus"), "green")}
    ${navx("folder", "Personal", { cnt: 96 })}
    ${navx("folder", "Work", { cnt: 41 })}
    ${navx("users", "Morgan family", { sub: "Shared" })}
    ${grp("More", false, "", "graphite")}
    ${navx("send", "Email aliases", { cnt: 6 })}
    ${navx("people", "Emergency access")}
    ${navx("import", "Import and export")}
    ${navx("trash", "Trash", { cnt: 8 })}`;
  const n2insp = () => `<div class="insp pn2-insp">
    <div class="pn2-ih">${mono("GitHub", 44)}<div class="dt"><b>GitHub</b><span>Login · Personal</span></div><span class="sp"></span>${ib("star", "Favorite", "on fav")}</div>
    <div class="pn2-ia">${btn("Copy password", "primary", "copy")}${btn("Copy code", "", "clock")}</div>
    <div class="ibody">
      <div class="card">
        <div class="row"><span class="k">Username</span><span class="v">alex-morgan</span></div>
        <div class="row"><span class="k">Password</span><span class="v dots">••••••••••••</span>${ib("eye", "Show for 30 seconds")}</div>
        <div class="row"><span class="k">Code</span><span class="v code">481 093</span>${ring2(18)}</div>
        <div class="row"><span class="k">Website</span><span class="v link">github.com</span></div>
      </div>
      <div class="lab">Health</div>
      <div class="card">
        <div class="row"><span class="k">Password</span><span class="v">${hbar("ok")}</span></div>
        <div class="row"><span class="k">Used elsewhere</span><span class="v">No</span></div>
        <div class="row"><span class="k">Two-step login</span><span class="v okc">On</span></div>
      </div>
      <div class="lab">Details</div>
      <div class="card">
        <div class="row"><span class="k">Changed</span><span class="v">Aug 12, 2026</span></div>
        <div class="row"><span class="k">Attachments</span><span class="v">1 file</span></div>
        <div class="row"><span class="k">Shared with</span><span class="v">Only me</span></div>
      </div>
    </div>
    <div class="ifoot">${btn("Edit", "", "pen")}${btn("Open site", "", "external")}<span class="sp"></span>${ib("more", "Move, share, trash")}</div>
  </div>`;
  const n2bar = () => `<div class="pn2-bar"><b>All items</b><span class="c">248</span><span class="vr"></span>${dd("Any type", "filter")}<span class="vr"></span>${chip("Weak 3", "", "alert")}${chip("Reused 4", "", "copy")}${chip("Old 2", "", "clock")}${chip("Two-step off 5", "", "lock")}<span class="sp"></span>${ib("columns", "Choose columns")}</div>`;
  const n2table = () => `<div class="cols"><div class="main pn2-main">${n2bar()}<div class="pn2-tbl">${tcols()}<div class="pn2-body">${TROWS.map((r) => trow(r, { sel: r[0] === "GitHub" })).join("")}</div></div><div class="pn2-foot"><span>248 items · 9 need a fix</span><span class="sp"></span><span>${kbd("Ctrl Shift C")} copies the password of the selected row</span><span class="vr"></span><span class="okf">${icon("check-c")}Synced 2 min ago</span></div></div>${n2insp()}</div>`;
  const FIX = [
    ["Weak passwords", "red", [["City Library", "21890044", "library.example", "weak", "none", "2019", ""], ["Riverside Forum", "alexm", "forum.example", "weak", "none", "2018", ""]]],
    ["Used more than once", "amber", [["Duolingo", ME, "duolingo.com", "reused", "off", "2022", ""], ["Netflix", ME, "netflix.com", "reused", "none", "2023", ""], ["Pet insurance", ME, "petcover.example", "reused", "none", "2022", ""], ["Trainline", ME, "thetrainline.com", "reused", "off", "2021", ""]], true],
    ["Over a year old", "teal", [["Northwind Energy", ME, "northwind.example", "old", "none", "2023", ""]]],
    ["Two-step login is off", "violet", [["Amazon", ME, "amazon.com", "ok", "off", "Jan 2026", "s"], ["Spotify", ME, "spotify.com", "fair", "off", "Nov 2025", ""]]],
  ];
  const n2fixInsp = () => `<div class="insp pn2-insp">
    <div class="pn2-ih"><span class="pn2-big">${icon("copy")}</span><div class="dt"><b>4 logins, one password</b><span>Used more than once</span></div></div>
    <div class="ibody">
      <p class="pn2-p">If one of these sites leaks, the same password opens the other three. Change them one at a time: Passwords opens each site's change page and has a new password ready to paste.</p>
      <div class="card pn2-steps">${[["Duolingo", "Next"], ["Netflix", ""], ["Pet insurance", ""], ["Trainline", ""]].map(([n, s], i) => `<div class="row">${mono(n, 26)}<span class="k">${n}</span>${s ? `<span class="pn2-next">${s}</span>` : `<span class="v">${i + 1} of 4</span>`}</div>`).join("")}</div>
      <div class="pn2-go">${btn("Start with Duolingo", "primary", "external")}</div>
      <div class="lab">Or, for all 4</div>
      <div class="acts2">${btn("Move to folder…", "sm", "folder")}${btn("Share with…", "sm", "users")}${btn("Add to favorites", "sm", "star")}${btn("Move to Trash", "sm dtext", "trash")}</div>
    </div>
  </div>`;
  const n2fix = () => `<div class="cols"><div class="main pn2-main"><div class="pn2-bar sel"><span class="cbx sq done">${icon("check")}</span><b>4 selected</b><span class="c">of 9 that need a fix</span><span class="sp"></span>${btn("Move to folder", "ghost", "folder")}${btn("Share with", "ghost", "users")}${btn("Move to Trash", "ghost dtext", "trash")}${ib("x", "Clear selection (Esc)")}</div><div class="pn2-tbl">${tcols().replace('<span class="cbx sq"></span>', '<span class="cbx sq part"></span>').replace("Password</span>", "Problem</span>")}<div class="pn2-body">${FIX.map(([t, c, rows, chk]) => `<div class="pn2-gh" style="--gc:var(--sw-${c})">${t}<span class="n">${rows.length}</span></div>${rows.map((r) => trow(r, { chk })).join("")}`).join("")}</div></div><div class="pn2-foot"><span>9 logins need a fix · worked out on this computer</span><span class="sp"></span>${btn("Check for breaches…", "ghost sm", "shield")}</div></div>${n2fixInsp()}</div>`;

  REG("passwords", {
    name: "Passwords",
    summary: "Passwords covers a lot (every item type, folders and collections, a generator, attachments, a security report, email aliases, emergency access), but the list shows the same lock on every row, the details pane sits empty until you pick something, and the header is a string of bare icons.",
    problems: [
      "<b>Every row has the same lock icon:</b> nothing to tell a bank from a newsletter at a glance, and favourites and logins with problems look like the rest.",
      "<b>Half the window says “Select an item”:</b> at 1280 px the list takes a narrow column and the details pane stays empty until you click.",
      "<b>The header is a readout and four bare icons:</b> “861 items · synced 28 min ago” in small type, then sync, lock and a lone + for New item.",
      "<b>Sidebar with five plain groups:</b> Vault, Types, Templates, Folders and Other look alike; “New folder” is a row among the folders; Security sits at the bottom with a big number (817) and no word about what it means.",
      "<b>The update notice takes the top of the page</b> as a full-width banner, pushing the list down.",
      "<b>At 800 px</b> the details pane is gone, the rail is fourteen identical icons without section marks, and the search field is cut to “Search the vault (C…”.",
      "<b>Copying is hidden:</b> Ctrl+Shift+C and friends work, but nothing on screen says how to copy a password from the list.",
    ],
    today: [["passwords-1280", "Today at 1280 px", "Same icon on every row; empty details"], ["passwords-800", "Today at 800 px", "List only; a rail of fourteen icons"]],
    options: [
      { id: "a", name: "Home and security", idea: "Passwords opens on a Home: how healthy the vault is, the four kinds of problem as tiles you can click, and the logins you used lately and your favourites with copy buttons on each. Security becomes a proper page that groups problems by kind with the fix beside each one (Change, Add code, Use https), and explains what the breach check sends.",
        shots: [
          ["b-home","Home","Vault health, problems, used lately"],
          ["b-security","Security","Grouped problems with a fix for each"],
          ["b-home-800","At 800 px","Rail and a narrower Home"],
        ] },
      { id: "b", name: "Find and copy", idea: "For people who open Passwords to grab one thing. The sidebar is a rail; the window is one big search: type a few letters, the top match shows labelled Username, Password and Code buttons, and Enter copies the password. A note says when the clipboard will clear. Locking shows a calm page with the master password and the other ways in (your face, the keyring).",
        shots: [
          ["c-find","Find","Type, then copy with one key"],
          ["c-locked","Locked","Master password, face or keyring"],
          ["c-find-800","At 800 px","The same, tiled"],
        ] },
      { id: "c", name: "Open in place", idea: "One calm list, no empty details pane. Picking a login opens it right where it sits in the list, with big copy targets for the username, password and one-time code, and the next login just below; Esc folds it away. Editing happens in the same spot, with the generator beside the password. Rows say in words what needs fixing (Weak, Reused), an A to Z strip jumps through a long vault, and the same list works unchanged at 800 px.",
        shots: [
          ["n1-item", "GitHub open in the list", "Copy targets, code countdown, health in words"],
          ["n1-edit", "Editing in place", "The form and generator where the login was"],
          ["n1-card-800", "A card, at 800 px", "Every item type opens the same way"],
        ] },
      { id: "d", name: "Vault table", idea: "For big vaults and tidying up. Every item is a row with its username, password health, two-step login and when it was last changed, so problems are visible without a separate report; filter chips narrow to Weak, Reused, Old or Two-step off. The selected login sits in an inspector on the right with copy buttons. Select several rows to move, share or trash them together, or to change a reused password site by site.",
        shots: [
          ["n2-table", "All items as a table", "Health and two-step login as columns; inspector on the right"],
          ["n2-fix", "Fixing a reused password", "Problems grouped; four logins changed one by one"],
        ] },
    ],
    icons: {
      pkey: '<circle cx="8" cy="15" r="4.5"/><path d="m11.2 11.8 8.8-8.8M16.5 6.5l3 3M14 9l2 2"/>',
      pcard: '<rect x="2.5" y="5" width="19" height="14" rx="2.5"/><path d="M2.5 10h19M6.5 15h4"/>',
      pdice: '<rect x="4" y="4" width="16" height="16" rx="3.5"/><path d="M9 9h.01M15 9h.01M12 12h.01M9 15h.01M15 15h.01" stroke-width="2.4"/>',
    },
    pages: {
      "a-item": () => win({ hdr: hdr(), side: sideA(), page: pageA({ narrow: NARROW }) }),
      "a-edit": () => win({ hdr: hdr(), side: sideA(), page: `<div class="cols">${list(7)}${editor()}</div>` }),
      "b-home": () => win({ hdr: hdr({ center: search("Search the vault", "Ctrl F", "wide") }), side: sideB("home"), page: homeB(NARROW) }),
      "b-security": () => win({ hdr: hdr(), side: sideB("sec"), page: security() }),
      "c-find": () => railed(win({ hdr: hdr({ center: "" }), side: sideC(), page: findPage(NARROW) })),
      "n1-item": () => win({ hdr: hdr({ center: search("Search the vault", "Ctrl F", "wide") }), side: n1side(), page: n1item() }),
      "n1-edit": () => win({ hdr: hdr({ center: search("Search the vault", "Ctrl F", "wide") }), side: n1side(), page: n1edit() }),
      "n1-card": () => win({ hdr: hdr({ center: search("Search the vault", "Ctrl F", "wide") }), side: n1side("cards"), page: n1card() }),
      "n2-table": () => win({ hdr: hdr(), side: n2side(), page: n2table() }),
      "n2-fix": () => win({ hdr: hdr(), side: n2side("fix"), page: n2fix() }),
      "c-locked": () => win({ hdr: header({ icon: "pkey", name: "Passwords", end: "" }).replace('<div class="hdr-start">' + ib("sidebar", "Sidebar (Ctrl+B)"), '<div class="hdr-start">'), side: "", page: locked() }),
    },
  });
})();
