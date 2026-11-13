// Nyx Pulse (a Telegram client) on the revamp page: today's problems and three options.
(() => {
  const CHATS = [
    ["Harbor Climbing Club", "Maya: Photos from Saturday 🧗", "19:42", 6, { pin: true, grp: true }],
    ["Theo Park", "Sounds good, see you at 8", "19:20", 0, { pin: true, read: true }],
    ["Design Crew", "Ines: new icons are in the shared folder", "18:55", 14, { grp: true }],
    ["Pine Street Neighbours", "Bins go out on Tuesday this week", "17:03", 3, { grp: true, muted: true }],
    ["Dad", "📷 Photo", "16:40", 1, {}],
    ["Nyx Releases", "Pulse 0.9: voice chats and folders", "14:12", 0, { chan: true }],
    ["Saved Messages", "route-map.pdf", "12:30", 0, { saved: true }],
    ["Book Club", "Juno: chapter 9 was something else", "Tue", 0, { grp: true, muted: true }],
    ["Kai Moreno", "voice message · 0:24", "Mon", 0, { read: true }],
  ];
  const me = "Robin Ashdown";

  /* ── Parts ──────────────────────────────────────────────────────────── */
  const crow = ([n, last, t, u, f], sel) => `<div class="pcrow ${sel ? "sel" : ""}">${f.saved ? `<span class="avatar sv" style="width:40px;height:40px">${icon("bookmark")}</span>` : av(n, 40)}<div class="tx"><div class="r1"><span class="n">${n}</span>${f.muted ? icon("mute", "mi") : ""}${f.read ? icon("check2", "mi rd") : ""}<span class="t">${t}</span></div><div class="r2"><span class="l">${last}</span>${f.pin && !u ? icon("pin", "mi") : ""}${u ? `<span class="ub ${f.muted ? "m" : ""}">${u}</span>` : ""}</div></div></div>`;
  const msg = (who, c, body, time, o = {}) => `<div class="pm2 ${o.me ? "me" : ""} ${o.cont ? "cont" : ""}">${o.me || o.cont ? '<span class="avsp"></span>' : av(who, 32)}<div class="bub ${o.cls || ""}">${!o.me && !o.cont ? `<b class="who" style="color:${swc(c)}">${who}</b>` : ""}${body}<span class="mt2">${time}${o.me ? icon("check2", "rd") : ""}</span></div></div>`;
  const photos = () => `<div class="album">${art("climb1", { r: 6 })}${art("climb2", { r: 6 })}${art("climb3", { r: 6 })}</div>`;
  const file = (n = "route-map.pdf", s = "2.4 MB · PDF") => `<div class="pfile"><span class="fi">${icon("file-text")}</span><div><b>${n}</b><span>${s}</span></div>${btn("Download", "sm", "download")}</div>`;
  const voice = () => `<div class="pvoice"><button class="vp">${icon("play")}</button><div class="wave">${[3, 6, 10, 7, 12, 16, 9, 5, 8, 14, 18, 11, 6, 9, 13, 7, 4, 8, 12, 15, 10, 6, 4, 7, 11, 8, 5, 3].map((h, i) => `<b style="height:${h}px" class="${i < 9 ? "on" : ""}"></b>`).join("")}</div><span>0:24</span></div>`;
  const poll = () => `<div class="ppoll"><b>Next trip: where?</b><span class="pk">Poll · 9 votes</span>${[["Granite Gully", 56, true], ["The Boulder Barn", 33], ["Stay in, watch films", 11]].map(([o, p, mine]) => `<div class="po ${mine ? "mine" : ""}"><div class="pl"><span>${o}</span><span>${p}%</span></div>${prog(p)}</div>`).join("")}</div>`;
  const conv = (o = {}) => `<div class="pthread">
    <div class="pday"><span>Today</span></div>
    ${msg("Maya Lindqvist", "pink", `<p>Photos from Saturday! The overhang on the left wall finally went 🧗</p>${photos()}`, "19:31")}
    ${msg("Sam Okoye", "teal", `<p>Amazing. I've put the route for next time in here:</p>${file()}`, "19:36")}
    ${o.short ? "" : msg("Sam Okoye", "teal", poll(), "19:37", { cont: true })}
    ${msg("Juno Hale", "violet", voice(), "19:40")}
    ${msg(me, "blue", `<p>Count me in for Granite Gully. I can drive two people from the station.</p>`, "19:42", { me: true })}
  </div>`;
  const composer = () => `<div class="pcomp"><div class="pin">${ib("clip", "Attach a file or photo")}<span class="ph">Message Harbor Climbing Club</span><span class="sp"></span>${ib("smile", "Emoji, stickers and GIFs")}</div><button class="mic" title="Hold to record, or type to send">${icon("mic")}</button></div>`;
  const chead = (o = {}) => `<div class="pch">${av("Harbor Climbing Club", 36)}<div class="ct"><b>Harbor Climbing Club</b><span>24 members · 3 online</span></div><span class="sp"></span>${o.pinned === false ? "" : `<span class="ppin">${icon("pin")}<span><b>Pinned</b> Saturday 9:00 at the gym</span></span>`}${ib("search", "Search in this chat")}${btn("Voice chat", "", "phone")}${ib("info", "Group info", o.info ? "on" : "")}${ib("more", "More")}</div>`;
  const details = () => `<div class="insp pdet">
    <div class="dh">${av("Harbor Climbing Club", 72)}<b>Harbor Climbing Club</b><span>Group · 24 members</span><div class="dq">${[["bell", "Mute"], ["search", "Search"], ["phone", "Voice chat"], ["more", "More"]].map(([i, t]) => `<span class="qa">${icon(i)}<span>${t}</span></span>`).join("")}</div></div>
    <div class="ibody">
      <div class="card"><div class="row"><span class="k">Description</span></div><div class="row dd3">Weekly sessions at the Harbor wall, trips once a month. Beginners welcome.</div><div class="row"><span class="k">Invite link</span><span class="v lnk">t.me/+harborclimb</span></div></div>
      <div class="lab">Shared media<span class="cnt">128</span><span class="act">See all</span></div>
      <div class="dmedia">${["climb1", "climb2", "climb3", "climb4", "climb5", "climb6"].map((s) => art(s, { h: 68, r: 6 })).join("")}</div>
      <div class="lab">Members<span class="cnt">24</span><span class="act">Manage</span></div>
      <div class="card">${[["Maya Lindqvist", "admin"], ["Sam Okoye", "online"], ["Juno Hale", "last seen 5 min ago"]].map(([n, s]) => `<div class="row">${av(n, 26)}<span class="k">${n}</span><span class="v">${s}</span></div>`).join("")}</div>
    </div></div>`;

  /* ── Option A: three panes ──────────────────────────────────────────── */
  const sideA = (on = "all") => `
    ${grp("Chats", false, "", "accent")}
    ${navx("chat", "All chats", { active: on === "all", badge: 24 })}
    ${navx("unread", "Unread", { cnt: 5 })}
    ${navx("person", "Personal", { cnt: 2 })}
    ${navx("people", "Groups", { cnt: 3 })}
    ${navx("radio", "Channels")}
    ${grp("Folders", false, icon("plus"), "violet")}
    ${navx("", "Climbing", { dot: swc("teal"), cnt: 6 })}
    ${navx("", "Work", { dot: swc("amber"), cnt: 14 })}
    ${navx("", "Family", { dot: swc("coral"), cnt: 1 })}
    ${grp("Yours", false, "", "amber")}
    ${navx("bookmark", "Saved messages")}
    ${navx("archive", "Archive", { cnt: 31 })}
    ${navx("phone", "Calls")}
    <div class="pacct">${av(me, 28)}<div><b>${me}</b><span>${icon("check-c", "ok")}Connected</span></div>${ib("chev-d", "Switch account")}</div>`;
  const hdrA = () => header({ icon: "send", name: "Pulse", center: search("Search chats and messages", "Ctrl F"), end: `<button class="newbtn">${icon("compose")}<span>New</span><span class="key">Ctrl N</span></button>` });
  const listA = (sel = 0) => `<div class="list plist"><div class="scroll">${CHATS.map((c, i) => crow(c, i === sel)).join("")}</div></div>`;
  const chatA = (o = {}) => `<div class="cols">${listA()}<div class="main pchat">${chead({ info: o.info, pinned: !o.info })}<div class="scroll">${conv({ short: o.info })}</div>${composer()}</div>${o.info ? details() : ""}</div>`;

  /* ── Option B: folders as tabs, two panes ──────────────────────────── */
  const hdrB = () => header({ icon: "send", name: "Pulse", center: "", end: `<span class="pconn">${icon("check-c", "ok")}${wideOnly("Connected")}</span>${av(me, 26)}` });
  const listB = (sel = 0) => `<div class="list plist b">
    <div class="lsr"><div class="field">${icon("search")}<span class="ph">Search</span></div>${ib("compose", "New message, group or channel (Ctrl+N)", "primary")}</div>
    <div class="ftabs">${[["All", 24], ["Unread", 5], ["Climbing", 6], ["Work", 14], ["Family", 1]].map(([t, n], i) => `<span class="ft ${i === 0 ? "on" : ""}">${t}${n ? `<span>${n}</span>` : ""}</span>`).join("")}<span class="ft ed">${icon("sliders")}</span></div>
    <div class="scroll">${CHATS.map((c, i) => crow(c, i === sel)).join("")}</div>
    <div class="lfoot">${btn("Archive · 31", "ghost", "archive")}<span class="sp"></span>${btn("Saved", "ghost", "bookmark")}</div>
  </div>`;
  const chatB = () => `<div class="cols">${listB()}<div class="main pchat">${chead({})}<div class="scroll">${conv()}</div>${composer()}</div></div>`;

  /* ── Option C: Chats, Calls and Tools as places ────────────────────── */
  const sideC = (on) => `
    ${grp("Pulse", false, "", "accent")}
    ${navx("chat", "Chats", { active: on === "chats", badge: 24 })}
    ${navx("phone", "Calls", { active: on === "calls", badge: on === "calls" ? "" : "Live" })}
    ${navx("stories", "Stories", { cnt: 4 })}
    ${navx("bookmark", "Saved messages")}
    ${grp("Account", false, "", "green")}
    ${navx("person", "Profile", { active: on === "profile" })}
    ${navx("shield", "Privacy and security", { active: on === "privacy" })}
    ${navx("bell", "Notifications")}
    ${grp("Tools", false, "", "violet")}
    ${navx("folder", "Folders")}
    ${navx("download", "Downloads", { cnt: 2 })}
    ${navx("export", "Export chats")}
    ${navx("apps", "Mini apps")}
    ${navx("briefcase", "Business", { active: on === "business" })}
    <div class="pacct">${av(me, 28)}<div><b>${me}</b><span>${icon("check-c", "ok")}Connected</span></div>${ib("chev-d", "Switch account")}</div>`;
  const privacyC = () => `<div class="main ppg"><div class="content"><div class="clamp" style="--clamp: 680px">
    <div class="pghead"><h1>Privacy and security</h1><p>Who can see you and reach you, and the devices signed in to your account.</p></div>
    ${setcard("Who can see", [["Phone number", "Only you", dd("Nobody")], ["Last seen and online", "Two people are exceptions", dd("My contacts")], ["Profile photo", "", dd("Everybody")], ["Birthday", "", dd("My contacts")]])}
    ${setcard("Who can reach you", [["Calls", "", dd("My contacts")], ["Group invites", "", dd("My contacts")], ["Messages from strangers", "New chats from people you don't know go to Archive", sw(true)]])}
    ${setcard("Security", [["Two-step verification", "On · recovery email confirmed", btn("Change")], ["Passkeys", "1 security key", btn("Manage")], ["Blocked people", "3 people", btn("See all")]])}
    ${setcard("Signed-in devices", [[`<span class="dv">${icon("monitor")}This computer · Pulse 0.9</span>`, "Active now", `<span class="chip2 acc">This device</span>`], [`<span class="dv">${icon("phone2")}Phone · Telegram 11.2</span>`, "Last active 2 hours ago", btn("Sign out", "dtext")]])}
  </div></div></div>`;
  const callC = () => `<div class="main pcall">
    <div class="cth"><div><b>Harbor Climbing Club</b><span>Voice chat · 6 people · 12:40</span></div><span class="sp"></span>${btn("Invite", "", "addperson")}${ib("more", "More: record, settings")}</div>
    <div class="cgrid">${[["Maya Lindqvist", true, false], ["Sam Okoye", false, false], [me, false, true], ["Juno Hale", false, false, true], ["Kai Moreno", false, false], ["Theo Park", false, false]].map(([n, talk, mine, hand]) => `<div class="ctile ${talk ? "talk" : ""}">${av(n, 64)}<b>${mine ? "You" : n}</b><span>${talk ? `${icon("mic")} Speaking` : hand ? "✋ Raised a hand" : mine ? `${icon("mic-off")} Muted` : `${icon("mic-off")} Muted`}</span></div>`).join("")}</div>
    <div class="cbar">${[["mic-off", "Unmute", "primary"], ["camera2", "Camera", ""], ["screen", "Share screen", ""], ["hand", "Raise hand", ""], ["speaker", "Speaker", ""]].map(([i, t, c]) => `<span class="cb ${c}"><span class="cbi">${icon(i)}</span><span>${t}</span></span>`).join("")}<span class="cb leave"><span class="cbi">${icon("phone")}</span><span>Leave</span></span></div>
  </div>`;

  REG("pulse", {
    name: "Pulse",
    summary: "Pulse is a full Telegram client with calls, folders, stories, Business tools and more, but its sidebar mixes filters with actions, the chat list is squeezed into the sidebar's foot, and almost every control is a bare icon.",
    problems: [
      "<b>Filters and actions in one list:</b> All Chats, Unread and Archive sit among Manage folders, Search messages, New group or channel and Tools, eight rows that look alike but do different kinds of things.",
      "<b>The chat list lives in the sidebar's foot:</b> below those eight rows, names are cut off (“ModCombo…”), and at 800 px it turns into a column of avatars mixed in with the action icons.",
      "<b>A header of bare icons:</b> search, call, video, ⋯ and ☰ for a channel, where calls can't work (they're greyed out, not hidden), and ⋯ and ☰ are two menus side by side.",
      "<b>A composer of bare icons:</b> attach, bold, mention, emoji, microphone, send and a ▾ for send options, with “Send as: Telegram default ▾” floating above the field.",
      "<b>Doubled buttons on messages:</b> a file shows “Download / Open” and “Download / Retry” as two buttons, and its name is cut in the middle (“DMPLAY NUMBER H… ew.apk”).",
      "<b>Tools is a grab-bag:</b> profile history, passkeys, privacy, exports, Mini Apps, gifts and Business controls all hide behind one Tools row, with no Settings-style page to find them.",
      "<b>“Load older messages”</b> is a button at the top of every chat instead of loading as you scroll, and “Connected to Telegram” takes room in the header.",
    ],
    today: [["pulse-1280", "Today at 1280 px", "Eight mixed rows above a squeezed chat list"], ["pulse-800", "Today at 800 px", "Action icons and avatars in one rail"]],
    options: [
      { id: "a", name: "Three panes", idea: "Like Mail: folders on the left, chats in the middle, the conversation on the right. The sidebar holds only places (All chats, Unread, Personal, Groups, Channels, your folders, Saved messages, Archive, Calls) under coloured headings, with your account at the foot; New and search move to the header, which searches chats and messages together. The conversation shows the pinned message, Voice chat only where calls work, and one Info button that opens members and shared media beside the chat. The composer is a single field: attach, emoji, and a microphone that becomes Send when you type.",
        shots: [["a-chat", "A group chat", "Places in the sidebar; chats and the conversation"], ["a-info", "With group info open", "Members, shared media and the invite link"], ["a-chat-800", "At 800 px", "Rail with coloured bars; list and chat"]] },
      { id: "b", name: "Folder tabs", idea: "Two panes, as Telegram Desktop does it: no sidebar, so the chat list gets the room. Search and New sit above the list, your folders are tabs across it (All, Unread, Climbing, Work, Family; the last tab edits them), and Archive and Saved messages wait at its foot. Best if you live in a few busy chats.",
        shots: [["b-chat", "Chats and a conversation", "Folder tabs over the list"], ["b-chat-800", "At 800 px", "The list narrows; the chat keeps its room"]] },
      { id: "c", name: "Places for everything", idea: "Pulse as a full app rather than a chat list with a Tools menu. The sidebar has Chats, Calls, Stories and Saved messages, then Account (Profile, Privacy and security, Notifications) and Tools (Folders, Downloads, Export chats, Mini apps, Business), each a real page in the shared Settings style. Calls gets its own screen: who's speaking, raised hands, and labelled controls. Best if you use Telegram's extras, not only its chats.",
        shots: [["c-privacy", "Privacy and security", "A real page instead of a Tools menu"], ["c-call", "A voice chat", "Speakers, hands and labelled controls"], ["c-privacy-800", "At 800 px", "Rail; the page keeps its width"]] },
    ],
    pages: {
      "a-chat": () => win({ hdr: hdrA(), side: sideA(), page: chatA() }),
      "a-info": () => railed(win({ hdr: hdrA(), side: sideA(), page: chatA({ info: true }) })),
      "b-chat": () => win({ hdr: hdrB(), side: "", page: chatB() }),
      "c-privacy": () => win({ hdr: header({ icon: "send", name: "Pulse", center: search("Search settings and chats", "Ctrl F"), end: "" }), side: sideC("privacy"), page: privacyC() }),
      "c-call": () => win({ hdr: header({ icon: "send", name: "Pulse", center: search("Search chats and messages", "Ctrl F"), end: "" }), side: sideC("calls"), page: callC() }),
    },
    icons: {
      unread: '<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="m3.5 7 8.5 6 8.5-6"/><circle cx="19" cy="5.5" r="3" fill="currentColor" stroke="none"/>',
      mute: '<path d="M11 5 6.5 9H3.5v6h3L11 19zM16 9.5l5 5M21 9.5l-5 5"/>',
      check2: '<path d="m2.5 12.5 4 4 8-9M10.5 15.5l1 1 8-9"/>',
      smile: '<circle cx="12" cy="12" r="9"/><path d="M8.5 14.5a4.5 4.5 0 0 0 7 0M9 9.5h.01M15 9.5h.01" stroke-width="1.9"/>',
      stories: '<circle cx="12" cy="12" r="9" stroke-dasharray="4 2.2"/><circle cx="12" cy="12" r="4.5"/>',
      apps: '<rect x="4" y="4" width="6.5" height="6.5" rx="2"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="3.25"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="2"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="2"/>',
      briefcase: '<rect x="3" y="7" width="18" height="13" rx="2.5"/><path d="M8.5 7V5.5A1.5 1.5 0 0 1 10 4h4a1.5 1.5 0 0 1 1.5 1.5V7M3 12.5h18"/>',
      "mic-off": '<path d="M3 3l18 18M9 9v2a3 3 0 0 0 5 2.2M15 10V6a3 3 0 0 0-5.8-1"/><path d="M5.5 10.5a6.5 6.5 0 0 0 10.6 5M18.5 10.5a6.4 6.4 0 0 1-.5 2.4M12 17v4"/>',
      camera2: '<rect x="3" y="7" width="13" height="10" rx="2.5"/><path d="m16 11 5-3v8l-5-3"/>',
      screen: '<rect x="3" y="4" width="18" height="12" rx="2.5"/><path d="M8.5 20h7M12 16v4M12 13V7.5M9.5 10 12 7.5l2.5 2.5"/>',
      hand: '<path d="M8 13V5.5a1.5 1.5 0 0 1 3 0V11M11 10V4.5a1.5 1.5 0 0 1 3 0V11M14 10.5V6a1.5 1.5 0 0 1 3 0v8a7 7 0 0 1-7 7 6 6 0 0 1-5-2.8L3.2 15a1.6 1.6 0 0 1 2.5-2L8 15"/>',
      speaker: '<path d="M11 5 6.5 9H3.5v6h3L11 19z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9.5 9.5 0 0 1 0 13"/>',
      phone2: '<rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M11 18.5h2"/>',
    },
  });
})();
