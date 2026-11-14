// NyxOS › Accounts (platform/nyxos/accounts.rs): you, your online accounts (native_accounts),
// storage-only accounts (cloud), VPN (vpn_accounts), face and fingerprint, and Users.
(() => {
  /* ── Sample data ─────────────────────────────────────────────────── */
  // [id, provider, label, identity, services on, services it has, status]
  const ACC = [
    ["google", "Google", "Personal", "sam.rivera@example.com", ["mail", "calendar", "contacts"], ["mail", "calendar", "contacts", "files", "tasks"], "ok"],
    ["fastmail", "Fastmail", "Work", "sam@rivera-studio.example", ["mail", "calendar"], ["mail", "calendar", "contacts"], "warn"],
    ["nextcloud", "Nextcloud", "Home cloud", "sam@cloud.rivera.example", ["files", "calendar", "contacts"], ["files", "calendar", "contacts", "tasks"], "ok"],
  ];
  const SVC = [["mail", "Mail", "mail"], ["calendar", "Calendar", "calendar"], ["contacts", "Contacts", "people"], ["files", "Files", "folder"], ["tasks", "Tasks", "task"]];
  const PROV = [["google", "Google", "Gmail, Calendar, Contacts and Drive"], ["microsoft", "Microsoft", "Outlook calendar, contacts and OneDrive"], ["fastmail", "Fastmail", "Mail, calendar and contacts"], ["nextcloud", "Nextcloud", "Files, calendar and contacts on your server"], ["zoho", "Zoho", "Zoho Mail, Calendar and Contacts"], ["imap", "Other mail", "Any provider, with IMAP and SMTP"], ["webdav", "WebDAV", "Calendars, contacts and files on a server"]];

  /* ── Parts ───────────────────────────────────────────────────────── */
  const LOGO = { google: ["G", "#fff", "#4285f4"], fastmail: ["F", "#0b57a4", "#fff"], nextcloud: ["N", "#0082c9", "#fff"], zoho: ["Z", "#e42527", "#fff"], imap: ["@", "var(--sw-graphite)", "#fff"], webdav: ["W", "var(--sw-teal)", "#fff"], dropbox: ["D", "#0061fe", "#fff"], proton: ["P", "#6d4aff", "#fff"] };
  const logo = (id, s = 32) => id === "microsoft"
    ? `<span class="ac-logo ms" style="--s:${s}px"><b style="background:#f25022"></b><b style="background:#7fba00"></b><b style="background:#00a4ef"></b><b style="background:#ffb900"></b></span>`
    : `<span class="ac-logo" style="--s:${s}px;background:${LOGO[id][1]};color:${LOGO[id][2]}">${LOGO[id][0]}</span>`;
  const status = (st) => st === "ok" ? `<span class="pill dot" style="--tc:var(--success)">Connected</span>` : `<span class="pill" style="--tc:var(--warning)">${icon("warn")}Sign in again</span>`;
  const svcNames = (on) => on.map((k) => SVC.find((s) => s[0] === k)[1]).join(", ");
  const you = () => `<div class="card ac-you">${av("Sam Rivera", 44)}<div class="tx"><b>Sam Rivera</b><span>Signed in as sam · Administrator</span></div>${btn("Edit", "sm")}</div>`;
  const accRow = ([id, prov, label, who, on, , st], sel) => `<div class="opt ac-row ${sel ? "picked" : ""}">${logo(id)}<div class="opt-text"><div>${label} <span class="dim">· ${prov}</span></div><div class="d">${st === "ok" ? svcNames(on) : "Stopped syncing yesterday"}</div></div>${status(st)}</div>`;
  const lists = (sel = "google") => `
    ${you()}
    ${ocard("Online accounts", ACC.map((a) => accRow(a, a[0] === sel)), { act: btn("Add", "sm", "plus"), cls: "ac-list" })}
    ${ocard("Files and VPN", [
      `<div class="opt ac-row">${logo("dropbox")}<div class="opt-text"><div>Dropbox <span class="dim">· files only</span></div><div class="d">In Files · connects when you sign in</div></div>${icon("chev-r", "cv")}</div>`,
      `<div class="opt ac-row">${logo("proton")}<div class="opt-text"><div>Proton VPN</div><div class="d">The Control Center's VPN tile</div></div>${icon("chev-r", "cv")}</div>`,
    ], { cls: "ac-list" })}
    ${ocard("", [nrow("Face and fingerprint", "", "Fingerprint", { ic: "finger", sec: "accounts" }), nrow("Other people on Atlas", "", "2", { ic: "users", sec: "accounts" })], { cls: "icons" })}`;

  /* ── Option A: the account list, and the picked one in detail ───── */
  const aPv = () => {
    const [id, prov, label, who, on, has] = ACC[0];
    const info = { mail: "Nyx Mail · 1,204 messages", calendar: "3 calendars · Work, Family, Holidays", contacts: "412 people", files: "Google Drive in Files", tasks: "2 lists" };
    return `<div class="ac-head">${logo(id, 48)}<div class="tx"><b>${label}</b><span>${who} · ${prov}</span></div><span class="sp"></span>${status("ok")}</div>
      <div class="ac-lab">What Atlas uses it for</div>
      <div class="ac-svc">${has.map((k) => { const [, n, ic] = SVC.find((s) => s[0] === k); const o = on.includes(k); return `<div class="card sv ${o ? "on" : ""}"><div class="r1"><span class="si">${icon(ic)}</span>${sw(o)}</div><b>${k === "files" ? "Google Drive" : n}</b><span>${o ? info[k] : k === "files" ? "Show it in Files" : "Off"}</span></div>`; }).join("")}
        <div class="card sv sync"><div class="r1"><span class="si">${icon("refresh")}</span>${btn("Sync now", "sm")}</div><b>Synced 2 minutes ago</b><span>Every 5 minutes, and on changes</span></div></div>
      ${ocard("", [
        nrow("Sync problems", "Changes Atlas kept when the server said no", "None", { ic: "warn", sec: "accounts" }),
        nrow("Saved versions", "Get back an earlier copy of a file", "", { ic: "hist", sec: "accounts" }),
        nrow("Connection settings", "Client ID, app password and servers", "", { ic: "cog", sec: "accounts" }),
      ], { cls: "icons" })}
      ${pvfoot("Removing it from Atlas never deletes anything on Google.", "info", btn("Remove from Atlas…", "sm ghost dtext"))}`;
  };

  /* ── Option B: which account feeds which app ────────────────────── */
  const bCtl = () => `${you()}
    <div class="gtitle">Add an account</div>
    <div class="ac-prov">${PROV.slice(0, 6).map(([id, n]) => `<div class="pv1 card">${logo(id, 28)}<b>${n}</b></div>`).join("")}</div>
    ${ocard("Files only and VPN", [
      nrow("Storage accounts", "Dropbox, OneDrive, SFTP and others, in Files", "1", { ic: "cloud", sec: "accounts" }),
      nrow("VPN", "Proton VPN, in the Control Center", "1", { ic: "shield", sec: "accounts" }),
      nrow("Face and fingerprint", "", "Fingerprint", { ic: "finger", sec: "accounts" }),
      nrow("Other people on Atlas", "", "2", { ic: "users", sec: "accounts" }),
    ], { cls: "icons" })}`;
  const bPv = () => {
    const rows = ACC.concat([["dropbox", "Dropbox", "Dropbox", "sam.rivera@example.com", ["files"], ["files"], "ok"]]);
    const counts = SVC.map(([k]) => rows.filter((r) => r[4].includes(k)).length);
    return `${pvhead("What each account brings", "Switch a service off and Atlas stops using it; nothing is deleted on the provider.", btn("Add", "sm", "plus"))}
      <div class="card ac-grid">
        <div class="gh"><span></span>${SVC.map(([, n, ic]) => `<span>${icon(ic)}${n}</span>`).join("")}</div>
        ${rows.map(([id, prov, label, who, on, has, st]) => `<div class="gr ${st}"><div class="who">${logo(id, 30)}<div><b>${label}</b><span>${st === "ok" ? prov : `${prov} · <em>sign in again</em>`}</span></div></div>${SVC.map(([k]) => `<span class="c">${has.includes(k) ? sw(on.includes(k)) : '<i class="na">—</i>'}</span>`).join("")}</div>`).join("")}
        <div class="gf"><span>In your apps</span>${counts.map((n, i) => `<span><b>${n}</b> ${n === 1 ? "account" : "accounts"}</span>`).join("")}</div>
      </div>
      <div class="ac-warn card">${logo("fastmail", 30)}<div class="tx"><b>Fastmail stopped syncing yesterday</b><span>Its app password was changed. Mail and Calendar keep what they have until you sign in again.</span></div>${btn("Sign in again", "primary sm")}</div>
      ${pvfoot("Mail, Calendar, Contacts, Files and Tasks read from the accounts switched on here.", "info")}`;
  };

  /* ── Option C: adding an account, as a sheet with the provider beside ── */
  const addSheet = () => `<div class="veil"><div class="dlg pop ac-add">
      <div class="ah"><div class="h">Add an account</div><p>Choose a provider, then sign in. Atlas keeps the sign-in in your keyring.</p></div>
      <div class="ab">
        <div class="pl">${PROV.map(([id, n, d]) => `<div class="pi ${id === "fastmail" ? "on" : ""}">${logo(id, 28)}<div><b>${n}</b><span>${d}</span></div></div>`).join("")}</div>
        <div class="pf">
          <div class="ph">${logo("fastmail", 40)}<div><b>Connect Fastmail</b><span>With an app password from Fastmail's settings</span></div></div>
          <div class="fl"><small>Email</small><div class="field">sam@rivera-studio.example</div></div>
          <div class="fl two"><div><small>Name it</small><div class="field">Work</div></div><div><small>App password</small><div class="field focus">••••••••••••••••<span class="sp"></span>${icon("eye")}</div></div></div>
          <span class="lnk">Make an app password in Fastmail ${icon("external")}</span>
          <div class="sv3">${[["mail", "Mail", true], ["calendar", "Calendar", true], ["people", "Contacts", false]].map(([ic, n, o]) => `<div class="s1">${icon(ic)}<span>${n}</span>${sw(o)}</div>`).join("")}</div>
          <div class="fold2">${icon("chev-r")}<span>Server settings</span><small>Filled in for Fastmail</small></div>
        </div>
      </div>
      <div class="bt"><span class="note">${icon("lock")}Nothing is sent until you connect</span><span class="sp"></span>${btn("Cancel")}${btn("Connect", "primary")}</div>
    </div></div>`;

  const page = (body, over) => () => nwin({ cat: "accounts", page: "Accounts", desc: "You, your online accounts, files, VPN and how you sign in.", body: body(), over: over ? over() : "" });
  const aBody = () => split(lists("google"), aPv(), { sec: "accounts", cls: "ac", ctlw: 420 });
  REG("nyxos-accounts", {
    name: "Accounts",
    summary: "On NyxOS, the Accounts category opens one page: you at the top (Edit… opens Users), your online accounts for mail, calendars, contacts, files and tasks, storage-only accounts for Files, VPN services for the Control Center, face and fingerprint, and a row that opens Users. It's a long column of cards, and an account's services are only reachable through a small gear that opens a dialog.",
    problems: [
      "<b>An account is one line:</b> the address, the provider and its services as a run of words, a status tag and a gear; what Atlas does with the account (which apps, how much mail, when it last synced) needs the dialog.",
      "<b>A broken account doesn't stand out:</b> one that needs signing in again is a small yellow tag among green ones, with no reason and no button to fix it on the page.",
      "<b>Three kinds of account in three styles:</b> online accounts, storage-only accounts (Add, Discover, Refresh status as three button rows) and VPN each have their own cards, notes and buttons, one under the other.",
      "<b>“You” is a placeholder:</b> a generic person icon, the login name twice (“ken · Signed in as ken”) and Edit…, which opens a different page.",
      "<b>Adding swaps the whole page</b> for a grid of provider cards with a back button; signing in is then a separate tall dialog with the provider's setup steps.",
      "<b>Users is a row at the very bottom</b> (“Other users… Open”), after face and fingerprint.",
    ],
    today: [
      ["nyxos-online-accounts-1280", "Accounts today", "Taken on a laptop without NyxOS's System Manager; the online accounts and storage parts are the real ones (the address is Ken's own)."],
      ["nyxos-online-accounts-800", "At 800 px", ""],
    ],
    options: [
      { id: "a", name: "Accounts and the one you pick", idea: "The left column lists everything you've connected, in one style: you, then online accounts with a logo and a plain status (Connected, or Sign in again), then files and VPN, then face and fingerprint and the other people. The picture is the picked account: a tile per service with its switch and what it holds (1,204 messages, 3 calendars), when it last synced, sync problems and saved versions, and Remove at the foot with what it won't delete.",
        shots: [["a-account", "Google picked", "Mail, Calendar and Contacts on; Drive and Tasks off"], ["a-account-800", "At 800 px", "The account above the list"]] },
      { id: "b", name: "Which account feeds which app", idea: "The picture is a grid: accounts down the side, Mail, Calendar, Contacts, Files and Tasks across, a switch where an account offers a service and a dash where it doesn't, with how many accounts each app reads from. An account that needs you is a card under it with its reason and a Sign in again button. The left column puts adding first, as provider tiles, and folds storage accounts, VPN, face and fingerprint and other people into rows.",
        shots: [["b-grid", "Accounts and apps", "Fastmail needs signing in again"]] },
      { id: "c", name: "Adding in a sheet", idea: "Add opens a sheet over the page instead of replacing it: providers down the left with what each brings, the picked one's sign-in on the right (email, a name for it, the app password with a link to make one, and which services to use), and server settings folded away because they're filled in. Google and Microsoft show one button that opens the browser instead of the fields.",
        shots: [["c-add", "Adding Fastmail", "Email, app password and services in one sheet"]] },
    ],
    pages: {
      "a-account": page(aBody),
      "b-grid": page(() => split(bCtl(), bPv(), { sec: "accounts", cls: "ac", ctlw: 400 })),
      "c-add": page(aBody, addSheet),
    },
    icons: {
      finger: '<path d="M7.5 5.2A8 8 0 0 1 20 12v1.5M4 12a8 8 0 0 1 1.2-4.2M8 18.5c.6-1.6 1-3.6 1-6.5a3 3 0 0 1 6 0c0 2.5-.3 4.6-1 6.6M12 12c0 3.4-.6 6.3-2 8.5M17 15.5c-.2 1.8-.6 3.3-1.2 4.5M4.5 16c.7-1.1 1-2.4 1-4"/>',
      people: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.6a3.5 3.5 0 0 1 0 6.8M18 14a6.5 6.5 0 0 1 3.5 6"/>',
      task: '<rect x="3.5" y="4" width="6" height="6" rx="1.5"/><path d="m4.8 7 1.2 1.2 2.2-2.4M13 7h7.5M3.5 14h6v6h-6zM13 17h7.5"/>',
    },
  });
})();
