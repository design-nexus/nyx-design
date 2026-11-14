// NyxOS › Users (platform/nyxos/users.rs), opened from Accounts: your name and password,
// the other people on this computer, administrators, and adding someone, all through the
// System Manager (accounts are part of the system configuration; passwords are set apart).
(() => {
  /* ── Sample data ─────────────────────────────────────────────────── */
  // [full name, login, admin, set in the configuration by hand, home folder]
  const PEOPLE = [
    ["Sam Rivera", "sam", true, false, "268 GB", true],
    ["Alex Rivera", "alex", false, false, "113 GB"],
    ["Jordan Lee", "jordan", true, false, "41 GB"],
    ["Robin Park", "robin", false, true, "9 GB"],
  ];

  /* ── Parts ───────────────────────────────────────────────────────── */
  const role = (admin) => admin ? "Administrator" : "Standard";
  const shield = () => `<span class="us-sh" title="Administrator">${icon("shield")}</span>`;
  const back = () => `<span class="us-back">${icon("chev-l")}Accounts</span>`;
  const page = (body, over) => () => nwin({ cat: "accounts", page: "Users", desc: "The people on Atlas, who can make system changes, and adding someone.", end: back(), body: body(), over: over ? over() : "" });
  const youCard = (o = {}) => ocard("You", [
    `<div class="opt us-me">${av("Sam Rivera", 40)}<div class="opt-text"><div><b>Sam Rivera</b></div><div class="d">Signed in as sam · Administrator</div></div>${o.compact ? btn("Password…", "sm") : ""}</div>`,
    ...(o.compact ? [] : [
      orow("Full name", "On the sign-in screen", `<span class="field us-f">Sam Rivera</span>`),
      orow("Password", "For signing in and system changes", btn("Change…", "sm")),
    ]),
  ], { first: true });
  const personRow = ([n, login, admin, fixed], sel) => `<div class="opt us-p ${sel ? "picked" : ""}">${av(n, 34)}<div class="opt-text"><div>${n}${admin ? shield() : ""}</div><div class="d">${fixed ? `${login} · set in Atlas's configuration` : `${login} · ${role(admin)}`}</div></div>${fixed ? icon("lock", "lk") : icon("chev-r", "cv")}</div>`;
  const addRow = () => `<div class="opt us-add"><span class="ai">${icon("plus")}</span><div class="opt-text"><div class="acc">Add a person</div><div class="d">Someone else who uses Atlas</div></div></div>`;

  /* ── Option A: people, and the picked one in detail ─────────────── */
  const aCtl = () => `${youCard()}
    ${ocard("Other people", PEOPLE.slice(1).map((p) => personRow(p, p[1] === "alex")).concat([addRow()]), { note: "" })}`;
  const choice = (on, ic, t, d) => `<div class="us-ch ${on ? "on" : ""}">${radio(on)}<div><b>${icon(ic)}${t}</b><span>${d}</span></div></div>`;
  const aPv = () => `
    <div class="us-head">${av("Alex Rivera", 60)}<div class="tx"><b>Alex Rivera</b><span>alex · Standard account · home folder 113 GB</span></div></div>
    <div class="us-lab">What Alex can do</div>
    <div class="us-chs">
      ${choice(true, "user", "Standard", "Use the apps, install their own, and change their own settings.")}
      ${choice(false, "shield", "Administrator", "Also change Atlas for everyone: updates, services, other people. Approves with their password.")}
    </div>
    ${ocard("", [
      orow("Password", "Set by Alex in March", btn("Set a new one…", "sm"), { ic: "lock", sec: "accounts" }),
      orow("Face and fingerprint", "Alex sets these up when signed in", `<span class="rv">Not set up</span>`, { ic: "finger", sec: "accounts" }),
      orow("Home folder", "/home/alex · stays if the account is removed", `<span class="rv">113 GB</span>`, { ic: "folder", sec: "accounts" }),
    ], { cls: "icons" })}
    <div class="us-rm card">${icon("trash")}<div class="tx"><b>Remove Alex's account</b><span>Alex can't sign in any more; the home folder stays on Atlas.</span></div>${btn("Remove…", "sm dtext")}</div>
    ${pvfoot("Each change is built into Atlas in about a minute, with your password.", "layers")}`;

  /* ── Option B: the sign-in screen as the picture ────────────────── */
  const bCtl = () => `${youCard({ compact: true })}
    ${ocard("Everyone else", PEOPLE.slice(1).map(([n, login, admin, fixed]) => `<div class="opt us-p2 ${login === "alex" ? "picked" : ""}">${av(n, 32)}<div class="opt-text"><div>${n}</div><div class="d">${fixed ? "Set in Atlas's configuration" : login}</div></div>${fixed ? `<span class="rv">${role(admin)}</span>${icon("lock", "lk")}` : `<span class="adm">Administrator</span>${sw(admin)}${ib("more", "Password, remove")}`}</div>`).concat([addRow()]))}
    <div class="us-note">${icon("shield")}<span>Administrators can update Atlas, turn services on and off, and add or remove people. Everyone can install their own apps.</span></div>`;
  const bPv = () => `
    ${pvhead("The sign-in screen", "Everyone with an account on Atlas, as they'll see it when it starts.", seg(["Sign-in", "Lock screen"], "Sign-in"))}
    <div class="us-scr" style="background:linear-gradient(160deg, color-mix(in srgb, var(--sw-violet) 55%, #0c0d14), color-mix(in srgb, var(--sw-teal) 45%, #0c0d14))">
      <div class="top"><span>Atlas</span><span class="ck">Fri 13 November · 20:19</span><span class="tr">${icon("wifi")}${icon("battery")}${icon("power")}</span></div>
      <div class="ppl">${PEOPLE.map(([n, login, admin], i) => `<div class="ptile ${login === "alex" ? "on" : ""}">${av(n, login === "alex" ? 76 : 56)}${admin ? `<span class="badge">${icon("shield")}</span>` : ""}<b>${n.split(" ")[0]}</b></div>`).join("")}</div>
      <div class="pw"><span>Password for Alex</span>${icon("chev-r")}</div>
      <div class="hint">${icon("finger")}Or touch the fingerprint reader</div>
    </div>
    <div class="us-leg card">${PEOPLE.map(([n, login, admin, fixed]) => `<span>${av(n, 22)}<b>${n.split(" ")[0]}</b>${admin ? '<em class="a">Administrator</em>' : fixed ? '<em>Set by hand</em>' : "<em>Standard</em>"}</span>`).join("")}</div>`;

  /* ── Option C: adding a person, with the new account drawn beside ── */
  const addSheet = () => `<div class="veil"><div class="dlg pop us-add2">
      <div class="ah"><div class="h">Add a person</div><p>They get their own account and home folder on Atlas.</p></div>
      <div class="ab">
        <div class="fm">
          <div class="fl"><small>Full name</small><div class="field">Maya Chen</div></div>
          <div class="fl"><small>Login name</small><div class="field focus mono">maya<span class="sp"></span><span class="ok">${icon("check")}Free</span></div><span class="hn">Filled in from the name. Lower-case letters, digits, - and _.</span></div>
          <div class="fl two"><div><small>Password</small><div class="field">••••••••••••</div></div><div><small>Again</small><div class="field">••••••••••••</div></div></div>
          <div class="str"><span class="m">${[1, 2, 3, 4].map((i) => `<b class="${i <= 3 ? "on" : ""}"></b>`).join("")}</span><span>Strong enough. Maya can change it after signing in.</span></div>
          <div class="adm">${chk(false)}<div><b>Administrator</b><span>Can update Atlas, change services and add people</span></div></div>
        </div>
        <div class="pvw">
          <div class="pt">${av("Maya Chen", 64)}<b>Maya Chen</b><small>maya · Standard</small></div>
          <div class="rows">${[["folder", "Home folder", "/home/maya"], ["apps", "Apps", "Installs her own"], ["lock", "System changes", "Asks an administrator"]].map(([ic, k, v]) => `<div>${icon(ic)}<small>${k}</small><b>${v}</b></div>`).join("")}</div>
          <div class="steps">${[["Added to Atlas's configuration", "ok"], ["Atlas is rebuilt · about a minute", ""], ["Maya can sign in", ""]].map(([t, c], i) => `<span class="${c}"><i>${c ? icon("check") : i + 1}</i>${t}</span>`).join("")}</div>
        </div>
      </div>
      <div class="bt"><span class="note">${icon("lock")}Your password is asked for</span><span class="sp"></span>${btn("Cancel")}${btn("Add Maya", "primary")}</div>
    </div></div>`;

  const aBody = () => split(aCtl(), aPv(), { sec: "accounts", cls: "us", ctlw: 410 });
  REG("nyxos-users", {
    name: "Users",
    summary: "NyxOS's Users page opens from Accounts: your full name and password, the other people on the computer with an Administrator switch, Password… and Remove on each row, people set in the configuration by hand shown read-only, and Add a person. Accounts are part of the system configuration, so each change is built by the System Manager; passwords are set apart and never stored in it.",
    problems: [
      "<b>Every control on one line:</b> each person's row carries “Administrator”, a switch, Password… and Remove side by side, so a long name pushes them together and the row says nothing else (home folder, what they can do).",
      "<b>Administrator is a bare switch:</b> it doesn't say what an administrator can do that others can't, and flipping it starts a rebuild straight away with only a toast.",
      "<b>Your name is an empty text field:</b> with no full name set, “Your name” is a placeholder in a box, and the row's only description is the login name.",
      "<b>No faces:</b> nobody has a picture or initials, and there's no hint of how the sign-in screen shows them.",
      "<b>Adding someone is a plain four-field dialog:</b> the login name isn't suggested from the full name, and it only says afterwards that the system is rebuilt.",
      "<b>“Users” and Accounts disagree:</b> the page's head reads “Users, groups, administrator access, SSH keys and sign-in security”, most of which is on other pages, and there's no way back to Accounts but the sidebar.",
    ],
    today: [
      ["nyxos-accounts-1280", "Users today", "Taken on a laptop without NyxOS's System Manager, so nobody else is listed and the name is empty; users.rs has the rows for other people."],
      ["nyxos-accounts-800", "At 800 px", ""],
    ],
    options: [
      { id: "a", name: "People and the one you pick", idea: "The left column is you (name and password) and everyone else as a list with initials, their login and whether they're an administrator; people set in the configuration by hand have a lock instead of a chevron. The picture is the picked person: two plain choices, Standard or Administrator, saying what each can do, then their password, face and fingerprint and home folder, and Remove with what stays behind.",
        shots: [["a-person", "Alex picked", "Standard or Administrator, in words"], ["a-person-800", "At 800 px", "Alex above the list"]] },
      { id: "b", name: "The sign-in screen", idea: "One column of people with the Administrator switch on each and the rest in a menu, as today but with faces and room to breathe. The picture is Atlas's sign-in screen as it will look: everyone's initials, administrators marked, the picked person's password field. A line under it says who's what.",
        shots: [["b-signin", "Who's on Atlas", "The sign-in screen with four people"]] },
      { id: "c", name: "Adding a person", idea: "Add a person opens a sheet with the form on the left: the full name fills in the login name (and says it's free), the password shows its strength, Administrator says what it allows. On the right the new account is drawn as it will be: their tile, home folder and what they can do, and the three steps adding takes, including the rebuild.",
        shots: [["c-add", "Adding Maya", "The login name filled in from her name"], ["c-add-800", "At 800 px", ""]] },
    ],
    pages: {
      "a-person": page(aBody),
      "b-signin": page(() => split(bCtl(), bPv(), { sec: "accounts", cls: "us", ctlw: 430 })),
      "c-add": page(aBody, addSheet),
    },
    icons: {
      finger: '<path d="M7.5 5.2A8 8 0 0 1 20 12v1.5M4 12a8 8 0 0 1 1.2-4.2M8 18.5c.6-1.6 1-3.6 1-6.5a3 3 0 0 1 6 0c0 2.5-.3 4.6-1 6.6M12 12c0 3.4-.6 6.3-2 8.5M17 15.5c-.2 1.8-.6 3.3-1.2 4.5M4.5 16c.7-1.1 1-2.4 1-4"/>',
    },
  });
})();
