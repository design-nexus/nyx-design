// Accounts › Online Accounts: mail, calendar, contacts and files accounts, storage-only cloud accounts, and the VPN tile.
(() => {
  const sec = "accounts";
  const page = (ctl, pv, ctlw) => () => swin({ sec, page: "Online Accounts", desc: "Google, Microsoft, Nextcloud and other accounts your apps use.", body: split(ctl(), pv(), { sec, ctlw }) });
  // Provider marks on a tile in a swatch: [icon, swatch].
  const LOGO = { google: ["p-google", "red"], microsoft: ["p-ms", "blue"], nextcloud: ["p-next", "teal"], fastmail: ["mail", "blue"], zoho: ["p-zoho", "amber"], imap: ["mail", "graphite"], dav: ["calendar", "violet"], dropbox: ["p-drop", "blue"], sftp: ["server", "graphite"], mullvad: ["shield", "amber"], onedrive: ["cloud", "blue"], gdrive: ["p-gdrive", "green"] };
  const logo = (k, size = 32) => { const [ic, c] = LOGO[k]; return `<span class="oa-logo" style="--lc:var(--sw-${c});width:${size}px;height:${size}px">${icon(ic)}</span>`; };
  // [logo, name, address, status, services]
  const ACC = [
    ["google", "Google", "samrivera@example.com", "ok", "Mail, Calendar, Contacts, Drive"],
    ["microsoft", "Work", "s.rivera@northwind.example", "sign", "Mail, Calendar, Contacts"],
    ["nextcloud", "Home cloud", "sam · cloud.rivera.example", "ok", "Files, Calendar, Contacts"],
  ];
  const STORE = [["dropbox", "Photos backup", "Dropbox · in Files · 2 GB kept here", "ok"], ["sftp", "Home server", "SFTP · connects when you sign in", "ok"]];
  const st = (s) => s === "ok" ? `<span class="oa-st ok">Connected</span>` : `<span class="oa-st warn">Sign in again</span>`;
  const accRow = ([k, n, a, s], sel) => `<div class="opt oa-r ${sel ? "picked" : ""}">${logo(k)}<div class="opt-text"><div>${n}</div><div class="d">${a}</div></div>${st(s)}</div>`;
  const addRow = (t) => `<div class="opt"><span class="oa-add">${icon("plus")}</span><div class="opt-text"><div class="acc">${t}</div></div></div>`;

  const leftA = (sel = 0) => `
    ${ocard("Accounts", ACC.map((a, i) => accRow(a, i === sel)).concat([addRow("Add an account")]), { first: true, act: `<span class="note">Mail, calendars, contacts and files</span>` })}
    ${ocard("Storage only", STORE.map((a) => accRow(a, false)).concat([addRow("Add cloud storage")]), { act: ib("refresh", "Check again") })}
    ${ocard("VPN", [orow("Control Center tile", "Signed in to Mullvad", dd("Mullvad"), { ic: "shield", sec })], { cls: "icons" })}`;

  /* ── A: an account and the apps it feeds ── */
  const FEEDS = [["mail", "Mail", "1,204 messages · synced 2 min ago", true], ["calendar", "Calendar", "3 calendars · Family, Work, Birthdays", true], ["users", "Contacts", "248 people", true], ["p-gdrive", "Drive", "In Files · 14 GB of 100 GB", true], ["check-c", "Tasks", "Off · your tasks stay on Google", false]];
  const feeds = () => {
    const h = 58, g = 8, H = FEEDS.length * h + (FEEDS.length - 1) * g, yc = H / 2;
    const lines = FEEDS.map((f, i) => { const y = i * (h + g) + h / 2; return `<path d="M0 ${yc} C 40 ${yc}, 40 ${y}, 80 ${y}" class="${f[3] ? "on" : ""}"/>`; }).join("");
    return `<div class="oa-feed" style="height:${H}px">
      <div class="src card">${logo("google", 56)}<b>Google</b><span>samrivera@<br>example.com</span></div>
      <svg class="lines" viewBox="0 0 80 ${H}" preserveAspectRatio="none">${lines}</svg>
      <div class="apps">${FEEDS.map(([ic, n, d, on]) => `<div class="app ${on ? "on" : ""}"><span class="lic" style="--tc:var(--sec-accounts)">${icon(ic)}</span><div><b>${n}</b><span>${d}</span></div>${sw(on)}</div>`).join("")}</div>
    </div>`;
  };
  const aPv = () => `
    ${pvhead("Google", "Connected · signed in through your browser", `${btn("Connection settings", "sm", "cog")}${btn("Remove…", "sm dtext")}`)}
    ${feeds()}
    <div class="card oa-facts">${[["Signed in", "3 months ago"], ["Last synced", "2 minutes ago"], ["Sync issues", "None"]].map(([k, v]) => `<div><small>${k}</small><span>${v}</span></div>`).join("")}<span class="sp"></span><span class="bts">${btn("Saved versions", "sm", "history")}</span></div>
    ${pvfoot("Turning one off stops this computer using it; nothing is deleted on Google.", "info")}`;

  /* A, adding: the providers and what the new account will be used for */
  const PROV = [["google", "Google", "Gmail, Calendar, Contacts and Drive"], ["microsoft", "Microsoft", "Outlook, calendar, contacts and OneDrive"], ["fastmail", "Fastmail", "With an app password"], ["nextcloud", "Nextcloud", "Files, calendar and contacts on your server"], ["zoho", "Zoho", "Mail, Calendar and Contacts"], ["imap", "Other mail", "Any provider, with IMAP and SMTP"], ["dav", "Calendar or contacts server", "CalDAV, CardDAV or WebDAV"]];
  const aAdd = () => `
    ${pvhead("Add an account", "Choose who it's with, then sign in in your browser.", ib("x", "Close"))}
    <div class="oa-prov">${PROV.map(([k, n, d], i) => `<div class="pt ${i === 1 ? "on" : ""}">${logo(k, 30)}<div><b>${n}</b><span>${d}</span></div></div>`).join("")}</div>
    <div class="card oa-new">
      <div class="nh">${logo("microsoft", 36)}<div><b>Microsoft</b><span>Personal accounts: Outlook.com, Hotmail and Live</span></div></div>
      <div class="nf"><div class="field">${icon("mail")}<span class="ph">Email address</span></div><div class="field"><span class="ph">Name it, such as Work (optional)</span></div></div>
      <div class="ns"><small>Use it for</small>${["Mail", "Calendar", "Contacts", "OneDrive"].map((s) => chip(s, "on", "check")).join("")}${chip("Tasks", "", "plus")}</div>
      <div class="nb"><span class="dim">Your password goes to Microsoft, never to this computer.</span><span class="sp"></span>${btn("Continue in browser", "primary", "external")}</div>
    </div>
    <div class="card oa-only">${logo("dropbox", 30)}<div><b>Only want files?</b><span>Add cloud storage instead: Dropbox, OneDrive, Google Drive, SFTP and more. It shows up in Files.</span></div>${btn("Add cloud storage", "sm")}</div>`;

  /* ── B: the apps, and the accounts behind them ── */
  const SV = ["Mail", "Calendar", "Contacts", "Files", "Tasks"];
  const HAS = { google: ["Mail", "Calendar", "Contacts", "Files"], microsoft: ["Mail", "Calendar", "Contacts"], nextcloud: ["Files", "Calendar", "Contacts"], dropbox: ["Files"], sftp: ["Files"] };
  const CAN = { google: SV, microsoft: ["Mail", "Calendar", "Contacts", "Files", "Tasks"], nextcloud: ["Files", "Calendar", "Contacts", "Tasks"], dropbox: ["Files"], sftp: ["Files"] };
  const bCtl = () => `
    ${ocard("Accounts", ACC.concat(STORE.map(([k, n, a, s]) => [k, n, a, s])).map(([k, n, a, s]) => `<div class="opt oa-r2">${logo(k, 30)}<div class="opt-text"><div>${n}${s !== "ok" ? ` <span class="oa-st warn">Sign in again</span>` : ""}</div><div class="oa-chips">${CAN[k].map((x) => chip(x, HAS[k].includes(x) ? "on" : "")).join("")}</div></div>${ib("more", "More")}</div>`), { first: true, act: btn("Add", "sm", "plus") })}
    ${ocard("", [orow("VPN in the Control Center", "", dd("Mullvad"), { ic: "shield", sec }), nrow("Existing rclone accounts", "Show them in Files too", "Find", { ic: "search", sec })], { cls: "icons" })}`;
  const bPv = () => {
    const L = ["google", "microsoft", "nextcloud", "dropbox", "sftp"], LN = { google: "Google", microsoft: "Work", nextcloud: "Home cloud", dropbox: "Photos backup", sftp: "Home server" };
    const AP = [["mail", "Mail"], ["calendar", "Calendar"], ["users", "Contacts"], ["folder", "Files"], ["check-c", "Tasks"]];
    const H = 420, lh = H / L.length, ah = H / AP.length;
    const ly = (i) => i * lh + lh / 2, ay = (i) => i * ah + ah / 2;
    let paths = "";
    L.forEach((k, i) => HAS[k].forEach((s) => { const j = SV.indexOf(s); const hot = s === "Calendar"; paths += `<path d="M0 ${ly(i)} C 50 ${ly(i)}, 50 ${ay(j)}, 100 ${ay(j)}" class="${hot ? "hot" : ""} ${k === "microsoft" ? "warn" : ""}"/>`; }));
    return `${pvhead("Where your apps get their data", "Each line is an account feeding an app. Calendar is picked.", seg(["All", "Mail", "Calendar", "Files"], "Calendar"))}
    <div class="oa-map" style="--h:${H}px">
      <svg class="lines" viewBox="0 0 100 ${H}" preserveAspectRatio="none">${paths}</svg>
      <div class="col l">${L.map((k) => `<div class="nd ${["google", "microsoft", "nextcloud"].includes(k) ? "hot" : ""}">${logo(k, 26)}<span>${LN[k]}</span></div>`).join("")}</div>
      <div class="col r">${AP.map(([ic, n]) => `<div class="nd ${n === "Calendar" ? "hot" : ""} ${n === "Tasks" ? "none" : ""}"><span class="lic" style="--tc:var(--sec-accounts)">${icon(ic)}</span><span>${n}</span><small>${{ Mail: "2 accounts", Calendar: "3 accounts", Contacts: "3 accounts", Files: "4 accounts", Tasks: "None yet" }[n]}</small></div>`).join("")}</div>
    </div>
    <div class="card oa-cal">${["Family · Google", "Birthdays · Google", "Work · Microsoft, needs sign-in", "Home · Home cloud"].map((c, i) => `<span><i style="background:var(--sw-${["red", "amber", "blue", "teal"][i]})"></i>${c}</span>`).join("")}</div>`;
  };

  REG("online-accounts", {
    name: "Online Accounts",
    summary: "Three stacked groups: Accounts (each one a row with its address, provider, services and a Connected tag, plus Add), Storage-only accounts (an empty line, then Add, Discover and Refresh as three button rows), and VPN. What an account is used for is a list of words in grey; changing it means opening a dialog behind a cog.",
    problems: [
      "<b>An account is one row of text:</b> “Google · Mail, Calendar, Contacts, Tasks” in grey; you can't see which apps use it or turn one off without opening its settings dialog.",
      "<b>Three button rows for one list:</b> Storage-only accounts has Add, Discover and Refresh status as separate rows with their own explanations, under “No storage-only accounts.”",
      "<b>Two kinds of account, two places:</b> a Google account adds mail and calendars at the top, while Google Drive for files alone is added in the second group, and the page doesn't say why they differ.",
      "<b>The settings hide behind a small cog:</b> status, services, sign in again, sync issues, saved versions and Remove all live in a dialog opened from an unlabelled icon.",
      "<b>VPN sits at the bottom of Accounts</b> as its own group, cut off at both widths, with Sign out and Sign in buttons side by side.",
      "<b>Real addresses as titles:</b> the email address is the row's title, so two accounts at the same provider look alike; there's no name like Work or Family.",
    ],
    today: [["online-accounts-1280", "Today", ""], ["online-accounts-800", "Today at 800 px", ""]],
    icons: {
      "p-google": '<path d="M19 8.5A7.5 7.5 0 1 0 20 13h-7"/>',
      "p-ms": '<rect x="4" y="4" width="7" height="7" rx="1"/><rect x="13" y="4" width="7" height="7" rx="1"/><rect x="4" y="13" width="7" height="7" rx="1"/><rect x="13" y="13" width="7" height="7" rx="1"/>',
      "p-next": '<circle cx="12" cy="12" r="3.5"/><circle cx="4.5" cy="12" r="2"/><circle cx="19.5" cy="12" r="2"/>',
      "p-zoho": '<rect x="3.5" y="6" width="7" height="7" rx="1.5" transform="rotate(-8 7 9.5)"/><rect x="13.5" y="11" width="7" height="7" rx="1.5" transform="rotate(8 17 14.5)"/>',
      "p-drop": '<path d="m7 3.5-5 3.2 5 3.2 5-3.2zM17 3.5l-5 3.2 5 3.2 5-3.2zM2 13.1l5 3.2 5-3.2-5-3.2zM22 13.1l-5 3.2-5-3.2 5-3.2zM7 17.4l5 3.1 5-3.1"/>',
      "p-gdrive": '<path d="M8.5 3.5h7l6 10.5-3.5 6h-12L2.5 14z"/><path d="m8.5 3.5 6 10.5H2.5M15.5 3.5l-6 10.5M18 20l-3.5-6"/>',
    },
    options: [
      { id: "a", name: "An account and the apps it feeds", idea: "The left column lists everything you've signed in to: accounts for mail, calendars, contacts and files, storage-only ones that just show in Files, and the VPN for the Control Center tile. Choosing an account draws it on the right with a line to each app it feeds, what each holds (1,204 messages, 3 calendars, 14 GB) and a switch to stop using it. Add an account opens in the same place: pick a provider, name it, choose what it's for, then sign in in the browser.",
        shots: [["a-feeds", "Google and its apps", "Tasks is off; the rest feed Mail, Calendar, Contacts and Files"], ["a-add", "Adding an account", "The providers, then one form for the chosen one"], ["a-feeds-800", "At 800 px", "The picture above the list"]] },
      { id: "b", name: "Your apps and where their data comes from", idea: "The right side starts from the apps: every account on the left, every app on the right, and a line for each account that feeds each app. Picking an app (Calendar here) lights up its lines and lists what it shows, so a missing calendar points straight at the account that needs signing in again. On the left each account is a row of service chips you click on or off, storage-only accounts included.",
        shots: [["b-map", "The map", "Calendar is picked; Work needs signing in again"], ["b-map-800", "At 800 px", ""]] },
    ],
    pages: {
      "a-feeds": page(() => leftA(0), aPv, 400),
      "a-add": page(() => leftA(-1), aAdd, 400),
      "b-map": page(bCtl, bPv, 410),
    },
  });
})();
