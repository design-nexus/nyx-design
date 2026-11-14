// Accounts › Users: the people on this computer, what each can do, and the rarer account tools.
(() => {
  const PEOPLE = [
    ["Sam Rivera", "sam", "Administrator · you", true, "Signed in now"],
    ["Alex Kim", "alex", "Administrator", true, "Today at 9:12"],
    ["Jordan Lee", "jordan", "Standard", false, "Yesterday"],
    ["Guest", "guest", "Locked · can't sign in", false, "3 weeks ago"],
  ];
  // What a group lets its members do: [icon, name, what it means, members].
  const CAN = [
    ["admin", "Change the system", "Install apps and use sudo", ["sam", "alex"]],
    ["printer", "Use printers", "Print and scan", ["sam", "alex", "jordan"]],
    ["drive", "Mount drives", "USB sticks and other disks", ["sam", "alex", "jordan"]],
    ["cam", "Cameras and the screen", "Video calls and screen capture", ["sam", "alex", "jordan"]],
    ["cube", "Virtual machines", "Run them at full speed", ["sam"]],
    ["docker", "Run Docker", "The same as administrator", ["sam"]],
  ];
  const sec = "accounts";
  const page = (ctl, pv, ctlw) => () => swin({ sec, page: "Users", desc: "The people who use this computer and what each one can do.", body: split(ctl(), pv(), { sec, ctlw }) });

  const person = ([n, , role, , last], on, o = {}) => `<div class="opt acp ${on ? "picked" : ""}">${av(n, 34)}<div class="opt-text"><div>${n}${o.you ? ` <span class="ac-you">You</span>` : ""}</div><div class="d">${role}</div></div>${o.end !== undefined ? o.end : `<span class="rv">${last}</span>`}</div>`;
  const addRow = (t = "Add a person") => `<div class="opt"><span class="ac-add">${icon("plus")}</span><div class="opt-text"><div class="acc">${t}</div></div></div>`;

  /* ── A: a list of people, and the chosen person's card ── */
  const capTile = ([ic, t, d, mem], who, o = {}) => {
    const on = mem.includes(who);
    return `<div class="ac-cap ${on ? "on" : ""} ${o.warn ? "warn" : ""}"><span class="lic" style="--tc:var(--sec-accounts)">${icon(ic)}</span><div><b>${t}</b><span>${d}</span></div>${sw(on)}</div>`;
  };
  const personCard = (p, who) => `
    <div class="ac-pc card">
      ${av(p[0], 72)}
      <div class="ac-pt"><div class="ac-n"><b>${p[0]}</b><span class="pill" style="--tc:var(--sec-accounts)">${icon("admin")}Administrator</span><span class="sp"></span>${btn("Edit", "sm", "pen")}${btn("Set a password", "sm", "key")}</div>
        <div class="ac-facts">${[["User name", p[1]], ["Home folder", `/home/${p[1]}`], ["Shell", "zsh"], ["Last signed in", p[4]]].map(([k, v]) => `<div><small>${k}</small><span>${v}</span></div>`).join("")}</div></div>
    </div>`;

  const aCtl = () => `
    ${ocard("People on Atlas", PEOPLE.map((p, i) => person(p, i === 1, { you: i === 0 })).concat([addRow()]), { first: true, act: `<span class="note">4</span>` })}
    ${ocard("For everyone", [
      orow("Skip the password for disks", "Users and the firewall still ask", sw(false), { ic: "drive", sec }),
      nrow("Groups", "", "7", { ic: "users", sec }),
      nrow("Remote sign-in", "Let other computers sign in with SSH", "Off", { ic: "ssh", sec }),
      nrow("Pause the sudo password", "For a few minutes, then it asks again", "", { ic: "clock", sec }),
    ], { cls: "icons" })}`;

  const aPv = () => `
    ${personCard(PEOPLE[1], "alex")}
    <div class="ac-caph"><b>What Alex can do</b><span>Each switch adds Alex to the group behind it.</span></div>
    <div class="ac-caps">${CAN.map((c) => capTile(c, "alex", { warn: c[0] === "docker" })).join("")}</div>
    <div class="ac-caph"><b>Signing in</b></div>
    <div class="card ac-sin">
      <div><small>Signs in with</small><span class="ac-chips">${chip("Password", "", "key")}${chip("Fingerprint", "", "finger")}</span></div>
      <div><small>Home folder</small><span class="ac-use">${prog(28)}<b>36 GB</b> of 512 GB</span></div>
      <div><small>Account</small><span class="ac-ok">${icon("check-c")}Can sign in</span></div>
    </div>
    ${pvfoot("Deleting someone keeps their home folder, so no files are lost.", "info", `${btn("Lock", "sm", "lock")}${btn("Delete", "sm dtext", "trash")}`)}`;

  /* ── B: you first; everyone as cards ── */
  const bCtl = () => `
    <div class="card ac-me">${av("Sam Rivera", 52)}<div class="opt-text"><div><b>Sam Rivera</b></div><div class="d">sam · administrator · signed in now</div></div>${ib("pen", "Edit")}</div>
    ${ocard("", [
      orow("Password", "Changed 4 months ago", btn("Change", "sm"), { ic: "key", sec }),
      orow("Login shell", "New terminals start with it", dd("zsh"), { ic: "terminal", sec }),
    ], { cls: "icons" })}
    ${ocard("Asking for your password", [
      orow("Disks, mounts and cleanup", "Ask each time, or skip it", seg(["Ask", "Skip"], "Ask"), { ic: "drive", sec }),
      orow("Pause the sudo password", "For a few minutes", btn("Pause…", "sm"), { ic: "clock", sec }),
    ], { cls: "icons" })}
    ${ocard("More", [
      nrow("Groups", "", "7", { ic: "users", sec }),
      nrow("Remote sign-in", "", "Off", { ic: "ssh", sec }),
      nrow("Docker and the disk password", "", "", { ic: "shield", sec }),
    ], { cls: "icons" })}`;

  const pcard = ([n, u, role, admin, last], o = {}) => `<div class="ac-gc card ${o.sel ? "sel" : ""} ${o.locked ? "locked" : ""}">
      <div class="r1">${av(n, 44)}${o.locked ? `<span class="pill" style="--tc:var(--text-tertiary)">${icon("lock")}Locked</span>` : admin ? `<span class="pill" style="--tc:var(--sec-accounts)">${icon("admin")}Admin</span>` : `<span class="pill" style="--tc:var(--sw-blue)">Standard</span>`}</div>
      <b>${n}${o.you ? ` <span class="ac-you">You</span>` : ""}</b><span>${u} · ${last}</span>
      <div class="ac-ics">${CAN.map(([ic, t, , mem]) => `<i data-i="${ic}" class="${mem.includes(u) ? "on" : ""}" title="${t}"></i>`).join("")}</div>
      <div class="ac-bt">${o.locked ? btn("Unlock", "sm") : btn("Password", "sm")}${ib("more", "More")}</div>
    </div>`;
  const bPv = () => `
    ${pvhead("Everyone on Atlas", "The icons show what each person can do. Click a card for the details.", btn("Add a person", "primary sm", "plus"))}
    <div class="ac-grid">
      ${pcard(PEOPLE[0], { you: true })}${pcard(PEOPLE[1], { sel: true })}${pcard(PEOPLE[2])}${pcard(PEOPLE[3], { locked: true })}
    </div>
    <div class="ac-legend">${CAN.map(([ic, t]) => `<span>${icon(ic)}${t}</span>`).join("")}</div>
    ${pvfoot("A locked account keeps its files; it just can't sign in until you unlock it.", "info")}`;

  /* ── C: who can do what, as one table ── */
  const cCtl = () => `
    ${ocard("People", PEOPLE.map((p, i) => person(p, false, { you: i === 0, end: i === 3 ? btn("Unlock", "sm") : `<span class="rv">${p[4]}</span>` })), { first: true, act: btn("Add", "sm", "plus") })}
    ${ocard("Groups you made", [
      orow("family-photos", "Sam, Alex and Jordan", `${btn("Rename", "sm ghost")}`, { ic: "folder", sec }),
      `<div class="opt"><span class="ac-add">${icon("plus")}</span><div class="opt-text"><div class="acc">New group…</div></div></div>`,
    ], { cls: "icons" })}
    ${ocard("", [nrow("Remote sign-in", "", "Off", { ic: "ssh", sec }), nrow("Passwords for system changes", "", "Ask", { ic: "key", sec })], { cls: "icons" })}`;

  const cPv = () => {
    const who = PEOPLE.slice(0, 3).concat([["Guest", "guest", "", false, ""]]);
    const rows = CAN.concat([["folder", "family-photos", "A group you made", ["sam", "alex", "jordan"]]]);
    return `${pvhead("Who can do what", "Tick a box to add someone to the group behind it.", seg(["Everything", "Hardware", "Yours"], "Everything"))}
    <div class="ac-mx card">
      <div class="mh"><span></span>${who.map(([n]) => `<span>${av(n, 30)}<small>${n.split(" ")[0]}</small></span>`).join("")}</div>
      ${rows.map(([ic, t, d, mem]) => `<div class="mr ${ic === "docker" ? "warn" : ""}"><span class="mt"><span class="lic" style="--tc:var(--sec-accounts)">${icon(ic)}</span><span><b>${t}</b><small>${d}</small></span></span>${who.map(([, u]) => `<span>${chk(mem.includes(u))}</span>`).join("")}</div>`).join("")}
    </div>
    <div class="banner2 warn ac-warn">${icon("warn")}<div class="tx"><b>Docker is the same as administrator</b><span>Anyone in it can take over the computer. Only add people you'd give the administrator password to.</span></div></div>`;
  };

  REG("accounts", {
    name: "Users",
    summary: "One long column: your own account as a row of text with your groups spelled out, a switch for password-free disk changes, other people, then Groups, Administrator access, SSH and sign-in security folded at the bottom. Nothing shows who someone is or what they can do at a glance; that's buried in group names.",
    problems: [
      "<b>You are a line of text:</b> your user name, your home folder path and every group you're in (docker, wheel, …) in one grey sentence, with no picture or name.",
      "<b>What someone can do is hidden in groups:</b> to make a person able to print or mount drives you open Groups, find the group by its system name and switch them on there.",
      "<b>A long warning before one switch:</b> “Passwords for system changes” is three lines of explanation over a single toggle, and wraps to four lines at 800 px.",
      "<b>Adding a person is a row with a button</b> under “Nobody else has an account on this computer”, so the empty state and the action look the same as settings.",
      "<b>Rare tools sit with everyday ones:</b> SSH keys, an SSH agent, Docker without sudo and the disk encryption password share the page with your password and shell.",
      "<b>Buttons on every row:</b> each person carries an admin switch, Lock, an edit pencil, Password and Delete side by side, which crowds the row at 800 px.",
    ],
    today: [["accounts-1280", "Today", ""], ["accounts-800", "Today at 800 px", ""]],
    icons: {
      admin: '<path d="M12 3 5 6v5c0 4.5 3 8.3 7 9.5 4-1.2 7-5 7-9.5V6z"/><path d="m9 12 2 2 4-4"/>',
      cam: '<rect x="3" y="7" width="13" height="10" rx="2"/><path d="m16 11 5-3v8l-5-3"/>',
      docker: '<rect x="3" y="11" width="18" height="7" rx="2"/><path d="M6 11V8h3v3M9 11V8h3v3M12 11V8h3v3M9 8V5h3v3"/>',
      key: '<circle cx="8" cy="15" r="4"/><path d="m11 12 8-8M16 7l2 2M14 9l2 2"/>',
      finger: '<path d="M6.5 7a7 7 0 0 1 12 5v2"/><path d="M5 11.5V14M9 12a3 3 0 0 1 6 0v2.5c0 2-.5 3.8-1.5 5.5"/><path d="M12 12.5v2c0 2.5-.8 4.6-2.2 6.3M8.8 16.5c-.3 1.6-1 3-2 4.2"/>',
      ssh: '<rect x="3" y="4.5" width="18" height="15" rx="2.5"/><path d="m7 9.5 3 2.5-3 2.5M12.5 15H17"/>',
    },
    options: [
      { id: "a", name: "People and a person's card", idea: "The people on the computer are a short list with their faces and roles; Add a person sits at the end of it. Choosing someone fills the right side with their card: name, user name, home folder, when they last signed in, and what they can do as plain switches (change the system, print, mount drives, run Docker) instead of group names. Groups, remote sign-in and pausing sudo are rows under For everyone that open their own pages.",
        shots: [["a-list", "A person's card", "Alex is chosen; each switch adds Alex to the group behind it"], ["a-list-800", "At 800 px", "The card above, the list below"]] },
      { id: "b", name: "You first, everyone as cards", idea: "The left column is about you: your name and picture, your password and shell, and when the computer asks for your password. Everyone else is a grid of cards on the right, each with its role and a row of small icons for what that person can do, so you see the whole household at once. Groups, remote sign-in and the Docker and disk-password tools move to More.",
        shots: [["b-cards", "Everyone as cards", "Icons light up for what each person can do"], ["b-cards-800", "At 800 px", ""]] },
      { id: "c", name: "Who can do what", idea: "The right side is one table: what people can do down the side, everyone across the top, a tick where they can. It makes groups visible without the word: ticking Jordan under Use printers adds Jordan to the printer group, and groups you made sit in the same table. The left column keeps the people, your own groups and the rare tools.",
        shots: [["c-matrix", "The table", "Docker carries its warning in the table"], ["c-matrix-800", "At 800 px", ""]] },
    ],
    pages: {
      "a-list": page(aCtl, aPv, 410),
      "b-cards": page(bCtl, bPv, 410),
      "c-matrix": page(cCtl, cPv, 390),
    },
  });
})();
