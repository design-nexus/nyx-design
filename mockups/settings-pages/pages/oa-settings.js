// Accounts › Online Accounts › Connection settings: what an account's Connection settings
// button opens. Today it's one long dialog (sections/native_accounts.rs manage(), plus
// cloud.rs append_for_account() for Files and Notes); these redraw it.
(() => {
  const sec = "accounts";
  const LOGO = { google: ["p-google", "red"], microsoft: ["p-ms", "blue"], nextcloud: ["p-next", "teal"], dropbox: ["p-drop", "blue"], sftp: ["server", "graphite"] };
  const logo = (k, size = 32) => { const [ic, c] = LOGO[k]; return `<span class="oa-logo" style="--lc:var(--sw-${c});width:${size}px;height:${size}px">${icon(ic)}</span>`; };
  const st = (s) => s === "ok" ? `<span class="oa-st ok">Connected</span>` : `<span class="oa-st warn">Sign in again</span>`;
  const ACC = [["google", "Google", "samrivera@example.com", "ok"], ["microsoft", "Work", "s.rivera@northwind.example", "sign"], ["nextcloud", "Home cloud", "sam · cloud.rivera.example", "ok"]];
  const accRow = ([k, n, a, s], sel) => `<div class="opt oa-r ${sel ? "picked" : ""}">${logo(k)}<div class="opt-text"><div>${n}</div><div class="d">${a}</div></div>${st(s)}</div>`;

  /* ── The Online Accounts page behind the dialog (option A of that page) ── */
  const FEEDS = [["mail", "Mail", "1,204 messages"], ["calendar", "Calendar", "3 calendars"], ["users", "Contacts", "248 people"], ["folder", "Drive", "In Files · 1.4 GB kept here"]];
  const left = () => `${ocard("Accounts", ACC.map((a, i) => accRow(a, i === 0)), { first: true })}
    ${ocard("Storage only", [accRow(["dropbox", "Photos backup", "Dropbox · in Files", "ok"], false)])}`;
  const right = () => `${pvhead("Google", "Connected · signed in through your browser", `${btn("Connection settings", "sm", "cog")}${btn("Remove…", "sm dtext")}`)}
    <div class="cs-bgfeeds">${FEEDS.map(([ic, n, d]) => `<div class="card"><span class="lic" style="--tc:var(--sec-accounts)">${icon(ic)}</span><div><b>${n}</b><span>${d}</span></div>${sw(true)}</div>`).join("")}</div>`;
  const bg = (over, pv = right, cls = "") => swin({ sec, page: "Online Accounts", desc: "Google, Microsoft, Nextcloud and other accounts your apps use.", body: split(left(), pv(), { sec, ctlw: 400, cls }), over });

  /* ── Parts ── */
  const fld = (t, o = {}) => `<div class="field cs-fld ${o.cls || ""}">${o.ic ? icon(o.ic) : ""}<span class="${o.ph ? "ph" : ""}">${t}</span>${o.end || ""}</div>`;
  const frow = (t, d, f) => `<div class="opt cs-frow"><div class="opt-text"><div>${t}</div>${d ? `<div class="d">${d}</div>` : ""}</div>${f}</div>`;
  const okLine = (t, cls = "ok") => `<div class="cs-ok ${cls}">${icon(cls === "ok" ? "check-c" : "warn")}<span>${t}</span></div>`;
  const head = (o = {}) => `<div class="cs-h">${logo("google", o.big ? 44 : 36)}<div class="cs-ht"><b>Google</b><span>samrivera@example.com</span></div><span class="sp"></span>${o.end ?? `<span class="oa-st ok">Connected</span>`}${o.close === false ? "" : ib("x", "Close")}</div>`;
  const foot = (changes = 0) => `<div class="cs-f">${btn("Remove from this computer…", "dtext")}<span class="sp"></span>${changes ? `<span class="cs-n">${changes} change${changes > 1 ? "s" : ""}</span>${btn("Cancel")}${btn("Save", "primary")}` : btn("Done")}</div>`;
  const dlg = (inner, w = 680, h = 560, cls = "") => `<div class="veil"><div class="pop cs-dlg ${cls}" style="width:${w}px;height:${h}px">${inner}</div></div>`;

  /* What's in each part, shared by the three options */
  const signin = () => `
    ${ocard("Sign-in", [
      orow("Signed in through your browser", "3 months ago · Google keeps it signed in", btn("Check now", "sm", "refresh"), { ic: "check-c", sec }),
      `<div class="cs-in">${okLine("Checked just now: Mail, Calendar, Contacts and Drive all answer.")}</div>`,
      orow("Sign in again", "After changing your Google password or its permissions", btn("Sign in", "sm", "external"), { ic: "user", sec }),
      orow("Revoke access", "Forgets the sign-in; the account and what's here stay", btn("Revoke…", "sm dtext"), { ic: "lock", sec }),
    ], { first: true, cls: "icons" })}
    ${ocard("Your own Google app", [
      frow("Client ID", "", fld("Nyx's own", { ph: true })),
      frow("Client secret", "", fld("Empty keeps the saved one", { ph: true, end: ib("eye", "Show") })),
    ], { act: `<span class="note">Only if you made one in Google Cloud</span>` })}`;
  const files = (o = {}) => `
    ${ocard("Google Drive in Files", [
      orow("Show in Files", "Under Cloud in the sidebar", sw(true), { ic: "folder", sec }),
      orow("Connected", "Opens at ~/Cloud/Google · 1.4 GB kept on this computer", `${btn("Test", "sm")}${btn("Disconnect", "sm")}`, { ic: "check-c", sec, cls: "cs-live" }),
      orow("Connect when you sign in", "Otherwise it connects the first time you open it", sw(true), { ic: "power", sec }),
    ], { first: true, cls: "icons" })}
    ${ocard("Space and speed", [
      orow("Keep on this computer", "Files you opened lately stay here, up to this much", `<span class="cs-slw">${sl(40, "2 GB", o.narrow ? 120 : 180)}</span>`, { ic: "download", sec, cls: o.edit ? "cs-edited" : "" }),
      orow("Speed limit", "So big uploads don't slow everything else", dd("No limit"), { ic: "gauge", sec }),
    ], { cls: "icons", note: "Changes apply the next time it connects; uploads waiting to go stay queued." })}`;
  const notes = () => `
    ${ocard("Notes", [
      orow("Sync Notes through Google Drive", "Your notes on every computer signed in to this account", sw(true), { ic: "note", sec }),
      frow("On this computer", "", fld("~/Notes", { ic: "folder", end: btn("Choose…", "sm") })),
      frow("On Google Drive", "", fld("Nyx Notes", { ic: "cloud" })),
    ], { first: true, note: "Each save is kept as its own version, so edits from two computers never overwrite each other." })}`;
  const sync = () => `
    ${ocard("Sync issues", [`<div class="cs-empty">${icon("check-c")}<div><b>Nothing waiting</b><span>A change this computer couldn't send shows here, kept until you decide.</span></div></div>`], { first: true })}
    ${ocard("Saved versions", [
      ["file", "Budget 2026.xlsx", "Drive · yesterday 18:42 · before a change from your phone"],
      ["note", "Trip ideas.md", "Notes · Tuesday · two edits at once, both kept"],
      ["file", "Lease.pdf", "Drive · 3 November · before it was deleted"],
    ].map(([ic, n, d]) => orow(n, d, btn("Restore a copy", "sm"), { ic, sec })), { cls: "icons", act: `<span class="note">Kept for 30 days</span>` })}`;

  /* ── A: tabs across the top ── */
  const TABS = [["signin", "Sign-in"], ["files", "Files"], ["notes", "Notes"], ["sync", "Sync & versions"]];
  const tabs = (on) => `<div class="stabs cs-tabs">${TABS.map(([k, n]) => `<span class="${k === on ? "on" : ""}">${n}</span>`).join("")}</div>`;
  const PART = { signin, files: () => files({ edit: true }), notes, sync };
  const aDlg = (on) => dlg(`${head()}${tabs(on)}<div class="cs-body">${PART[on]()}</div>${foot(on === "files" ? 1 : 0)}`, 680, 560);

  /* ── B: a sidebar inside a wider dialog, opening on an overview ── */
  const NAV = [["overview", "Overview", "eye"], ["signin", "Sign-in", "user"], ["files", "Files", "folder"], ["notes", "Notes", "note"], ["sync", "Sync & versions", "history"]];
  const nav = (on) => `<div class="cs-nav">${NAV.map(([k, n, ic]) => `<div class="cs-ni ${k === on ? "on" : ""}">${icon(ic)}<span>${n}</span></div>`).join("")}<span class="sp"></span><div class="cs-ni danger">${icon("trash")}<span>Remove…</span></div></div>`;
  const overview = () => `
    <div class="cs-hero">${icon("check-c")}<div><b>Everything's working</b><span>Checked 2 minutes ago. Nothing is waiting to sync.</span></div>${btn("Check now", "sm", "refresh")}</div>
    <div class="cs-facts">${[["Signed in", "3 months ago", "user"], ["Last synced", "2 minutes ago", "refresh"], ["Drive in Files", "1.4 GB kept here", "folder"], ["Notes", "~/Notes · synced", "note"]].map(([k, v, ic]) => `<div class="card">${icon(ic)}<small>${k}</small><b>${v}</b></div>`).join("")}</div>
    ${ocard("Used by", [`<div class="cs-used">${[["mail", "Mail", true], ["calendar", "Calendar", true], ["users", "Contacts", true], ["folder", "Drive", true], ["check-c", "Tasks", false]].map(([ic, n, on]) => chip(n, on ? "on" : "", on ? ic : "plus")).join("")}</div><div class="cs-in dim">Turn these on or off on the Online Accounts page.</div>`])}`;
  const BPART = { overview, signin, files, notes, sync };
  const bDlg = (on) => dlg(`${head({ end: "" })}<div class="cs-split">${nav(on)}<div class="cs-body">${BPART[on]()}</div></div>${on === "files" ? foot(1).replace(btn("Remove from this computer…", "dtext"), "") : ""}`, 780, 580, "b");

  /* ── C: no popup: the settings open where the account was drawn ── */
  const cPv = (on) => () => `
    <div class="cs-back">${ib("chev-l", "Back to Google")}<span>Google</span><span class="sep">›</span><b>Connection settings</b></div>
    ${head({ big: false, close: false })}
    <div class="cs-sec">${seg(["Sign-in", "Files", "Notes", "Sync & versions"], on)}</div>
    <div class="cs-cbody">${{ "Sign-in": signin, Files: () => files({ edit: true }), Notes: notes, "Sync & versions": sync }[on]()}</div>
    ${on === "Files" ? `<div class="cs-cf"><span class="cs-n">1 change</span>${btn("Cancel", "sm")}${btn("Save", "sm primary")}</div>` : ""}`;

  const Q = "?look=tile&sw=segment&sl=bar&rd=tinted&cb=tinted";
  const withQ = (shots) => shots.map(([s, l, c]) => [s, l, c, `oa-settings/${s.replace(/-800$/, "")}${Q}`]);

  REG("oa-settings", {
    name: "Online Accounts: connection settings",
    summary: "Connection settings on an account opens a 650 × 550 dialog titled “Account settings” that scrolls through everything at once: the account and its status, Sign in again, the same Services switches the page already has, a second Services heading for Storage and Notes with its own Save, a line of four buttons (Connect, Disconnect, Test connection, Refresh status), display name, cache and bandwidth fields with another Save, a second Sign in again, Stop managing, Remove local configuration, Remove, and finally a folded “Connection settings” group whose Edit button opens a third dialog.",
    problems: [
      "<b>Three Save buttons and instant switches in one dialog:</b> the Services switches save as you flip them, Storage and Notes need “Save services”, cache and bandwidth need “Save”, and account configuration needs “Save changes” in another dialog.",
      "<b>Everything twice:</b> the Services switches repeat the page behind it, and Sign in again shows up both near the top and in the storage part.",
      "<b>The button and the dialog disagree:</b> the button says Connection settings, the dialog says Account settings, and the real connection settings are folded away at the very bottom.",
      "<b>Raw terms:</b> “Cache target (MiB, soft limit)”, “Bandwidth limit (rclone format; blank is unlimited)”, “immutable Markdown revisions”, “Storage: connected · mounted”.",
      "<b>Three ways to remove:</b> Stop managing, Remove local configuration and Remove, each with its own explanation, in different places.",
    ],
    todayNote: "No screenshot: the dialog only opens from a click. It's the long scroll described above.",
    icons: {
      "p-google": '<path d="M19 8.5A7.5 7.5 0 1 0 20 13h-7"/>',
      "p-ms": '<rect x="4" y="4" width="7" height="7" rx="1"/><rect x="13" y="4" width="7" height="7" rx="1"/><rect x="4" y="13" width="7" height="7" rx="1"/><rect x="13" y="13" width="7" height="7" rx="1"/>',
      "p-next": '<circle cx="12" cy="12" r="3.5"/><circle cx="4.5" cy="12" r="2"/><circle cx="19.5" cy="12" r="2"/>',
      "p-drop": '<path d="m7 3.5-5 3.2 5 3.2 5-3.2zM17 3.5l-5 3.2 5 3.2 5-3.2zM2 13.1l5 3.2 5-3.2-5-3.2zM22 13.1l-5 3.2-5-3.2 5-3.2zM7 17.4l5 3.1 5-3.1"/>',
      gauge: '<path d="M4 16a8 8 0 1 1 16 0"/><path d="m12 16 4-5"/>',
    },
    options: [
      { id: "a", name: "Tabs across the top", idea: "Same size as today, but in four short tabs: Sign-in (is it working, check now, sign in again, your own Google app, revoke), Files (Drive in Files, connected or not, space kept here and a speed limit), Notes, and Sync & versions (anything that couldn't sync, and earlier versions to restore). Switches still apply at once; fields and sliders wait for one Save at the bottom, which only shows when you've changed something. Remove is one button, bottom left.",
        shots: withQ([["a-signin", "Sign-in", "Checked just now; your own Google app is optional"], ["a-files", "Files", "Keep on this computer was changed, so Save shows"], ["a-sync", "Sync & versions", "Nothing waiting; three versions you can restore"], ["a-files-800", "Files at 800 px", ""]]) },
      { id: "b", name: "A small Settings of its own", idea: "A wider dialog with its own sidebar, opening on an overview: one line saying whether everything works, four facts (signed in, last synced, space kept, Notes) and what the account is used for. The same parts as A sit in the sidebar, with Remove at its foot. More room per part, and the overview answers “is it working?” before you look for anything.",
        shots: withQ([["b-overview", "Overview", "Everything's working, and what uses it"], ["b-files", "Files", ""]]) },
      { id: "c", name: "No popup: in the page", idea: "Connection settings replaces the account picture on the right instead of opening a window, with a back arrow to it, the same way adding an account already works on this page. A segmented switch picks Sign-in, Files, Notes or Sync & versions. Nothing covers the list, and at 800 px it's just the page scrolled.",
        shots: withQ([["c-signin", "Sign-in", ""], ["c-files", "Files", "One change, with Save at the foot"], ["c-files-800", "Files at 800 px", ""]]) },
    ],
    pages: {
      "a-signin": () => bg(aDlg("signin")),
      "a-files": () => bg(aDlg("files")),
      "a-sync": () => bg(aDlg("sync")),
      "b-overview": () => bg(bDlg("overview")),
      "b-files": () => bg(bDlg("files")),
      "c-signin": () => bg("", cPv("Sign-in"), "cs-c"),
      "c-files": () => bg("", cPv("Files"), "cs-c"),
    },
  });
})();
