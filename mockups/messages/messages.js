// Nyx Messages: three layout directions for an SMS/RCS desktop client.
"use strict";

Object.assign(KI, {
  smile: '<circle cx="12" cy="12" r="9"/><path d="M8 14s1.5 2.5 4 2.5 4-2.5 4-2.5M9 9.5h.01M15 9.5h.01" stroke-width="1.9"/>',
  check2: '<path d="m2.5 12.5 3.5 3.5 7-8M10.5 16l3.5 3.5 7.5-9"/>',
  mute: '<path d="M11 5 6.5 9H3.5v6h3L11 19zM22 9l-6 6M16 9l6 6"/>',
  phone2: '<rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M10 18.5h4"/>',
  back: '<path d="M15 18 9 12l6-6"/>',
});

const SWC = ["blue", "violet", "pink", "red", "coral", "amber", "green", "teal"];
const hash = (s) => [...String(s)].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
const swc = (i) => `var(--sw-${typeof i === "number" ? SWC[i % SWC.length] : i})`;
// Design 2.0 face: rounded square soft tile (Settings leading-icon style), not a circle.
const av = (name, size = 28) => {
  const ini = name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
  const c = swc(hash(name));
  return `<span class="avatar" style="width:${size}px;height:${size}px;font-size:${Math.round(size * 0.36)}px;--tc:${c}">${ini}</span>`;
};
const art = (seed, { w = "100%", h = "100%", r = 8 } = {}) => {
  const n = hash(seed), a = SWC[n % 8], b = SWC[(n >>> 3) % 8], ang = n % 360;
  return `<div class="art" style="width:${typeof w === "number" ? w + "px" : w};height:${typeof h === "number" ? h + "px" : h};border-radius:${r}px;background:linear-gradient(${ang}deg, color-mix(in srgb, var(--sw-${a}) 70%, #000), color-mix(in srgb, var(--sw-${b}) 55%, #111))"></div>`;
};

const ME = "Ken";
const CHATS = [
  ["Ada Okafor", "Sounds good — see you at 7", "19:42", 0, { read: true, rcs: true }],
  ["Harbor Climbing", "Maya: Photos from Saturday", "19:20", 3, { grp: true, rcs: true }],
  ["Dad", "📷 Photo", "16:40", 1, {}],
  ["Pharmacy", "Your prescription is ready for pickup", "14:12", 0, { read: true }],
  ["Dev Patel", "I'll send the PDF tonight", "Tue", 0, { star: true, rcs: true, read: true }],
  ["Book club", "Next month: The Dispossessed", "Mon", 0, { grp: true, muted: true }],
  ["+1 555-987-6543", "Who is this?", "Sun", 0, {}],
  ["Olivia Chen", "Thanks for the ride!", "Sat", 0, { read: true, rcs: true }],
];

const FAVS = ["Ada Okafor", "Dad", "Dev Patel", "Olivia Chen", "Harbor Climbing"];

const msg = (who, c, body, time, o = {}) =>
  `<div class="mm ${o.me ? "me" : ""}">${o.me ? "" : av(who, 28)}<div class="bub">${!o.me && who ? `<b class="who" style="color:${swc(c)}">${who}</b>` : ""}${body}<span class="mt2">${time}${o.me ? icon("check2", "rd") : ""}</span></div></div>`;

const file = (n = "harbor-menu.pdf", s = "840 KB · PDF") =>
  `<div class="mfile"><span class="fi">${icon("file-text")}</span><div><b>${n}</b><span>${s}</span></div>${ib("download", "Save")}</div>`;

const thread = () => `<div class="mthread">
  <div class="mday"><span>Today</span></div>
  ${msg("Ada Okafor", "teal", `<p>Are we still on for dinner? I booked the corner table at Harbor.</p>`, "18:52")}
  ${msg(ME, "blue", `<p>Yes! Leaving the office in ten. Want me to pick anything up?</p>`, "19:01", { me: true })}
  ${msg("Ada Okafor", "teal", `<p>Just yourself. Here's the menu they sent:</p>${file()}`, "19:08")}
  ${msg(ME, "blue", `<p>Perfect — see you at 7.</p>`, "19:42", { me: true })}
  ${msg("Ada Okafor", "teal", `<p>Sounds good — see you at 7</p>`, "19:42")}
</div>`;

const composer = (ph = "Text message", o = {}) => {
  const send = o.typed
    ? `<button class="send" title="Send (Enter)">${icon("send")}</button>`
    : `<button class="mic" title="Hold to record, or type to send">${icon("mic")}</button>`;
  return `<div class="mcomp"><div class="min">${ib("clip", "Attach")}${o.typed ? `<span class="typed">${o.typed}</span>` : `<span class="ph">${ph}</span>`}<span class="sp"></span>${ib("smile", "Emoji")}</div>${send}</div>`;
};

const crow = ([n, last, t, u, f], sel) =>
  `<div class="mcrow ${sel ? "sel" : ""}">${av(n, 40)}<div class="tx"><div class="r1"><span class="n">${n}</span>${f.star ? icon("star", "mi st") : ""}${f.read ? icon("check2", "mi rd") : ""}<span class="t">${t}</span></div><div class="r2">${f.rcs ? `<span class="rcs">RCS</span>` : ""}<span class="l">${last}</span>${u ? `<span class="ub">${u}</span>` : ""}</div></div></div>`;

const phonePill = () =>
  `<span class="phone-pill">${icon("phone2")}<span>Pixel 8</span>${icon("check-c", "ok")}</span>`;

/* ═══════════════════════════════════════════════════════════════════════════
   A — Split inbox
   Two panes only: chat list | conversation. Filters are a segment on the list.
   No places sidebar. Closest to a polished Messages-for-web / iMessage Mac.
   ═══════════════════════════════════════════════════════════════════════════ */
// Person lives in the window header with the other chrome — no second header in the sheet.
const hdrA = () => header({
  icon: "chat", name: "Messages",
  center: `<div class="hdr-person">${av("Ada Okafor", 28)}<div class="ct"><b>Ada Okafor</b><span>RCS · +1 555-123-4567</span></div></div>`,
  end: `${ib("search", "Search texts (Ctrl+F)")}${ib("phone", "Call")}${ib("info", "Details")}${phonePill()}<button class="newbtn">${icon("compose")}<span>New</span><span class="key">Ctrl N</span></button>`,
});

const listA = (sel = 0) => `<div class="list mlist a">
  <div class="filters">${seg(["All", "Unread", "Starred"], "All")}<span class="sp"></span>${ib("archive", "Archive")}</div>
  <div class="scroll">${CHATS.map((c, i) => crow(c, i === sel)).join("")}</div>
</div>`;

const chatA = () => `<div class="main mchat">
  <div class="scroll">${thread()}</div>
  ${composer("Message Ada")}
</div>`;

PAGES["a-chat"] = () => win({ hdr: hdrA(), side: "", page: `<div class="cols">${listA()}${chatA()}</div>` });
PAGES["a-chat-800"] = () => win({ hdr: hdrA(), side: "", page: `<div class="cols">${listA()}${chatA()}</div>` });

/* ═══════════════════════════════════════════════════════════════════════════
   B — People first
   Home is people: a favorites strip and large recent rows. Opening someone
   fills the page with the thread; a thin avatar rail keeps the others nearby.
   ═══════════════════════════════════════════════════════════════════════════ */
const hdrB = (o = {}) => header({
  icon: "chat", name: "Messages",
  center: o.inChat
    ? `<div class="person-switch">${av("Ada Okafor", 28)}<b>Ada Okafor</b>${icon("chev-d")}<span class="sub">RCS</span></div>`
    : search("Find someone", "Ctrl F", "wide"),
  end: o.inChat
    ? `${ib("phone", "Call")}${ib("info", "Details")}${phonePill()}`
    : `${phonePill()}<button class="newbtn">${icon("compose")}<span>New</span><span class="key">Ctrl N</span></button>`,
});

const peopleHome = () => `<div class="main people">
  <div class="favs">
    <div class="fav-lab">Favorites</div>
    <div class="fav-row">${FAVS.map((n) => `<div class="fav">${av(n, 52)}<span>${n.split(" ")[0]}</span></div>`).join("")}<div class="fav add">${icon("plus")}<span>Add</span></div></div>
  </div>
  <div class="recents">
    <div class="sec-lab">Recent</div>
    ${CHATS.map(([n, last, t, u, f], i) =>
      `<div class="prow ${i === 0 ? "sel" : ""}">${av(n, 48)}<div class="tx"><div class="r1"><span class="n">${n}</span><span class="t">${t}</span></div><div class="r2">${f.rcs ? `<span class="rcs">RCS</span>` : ""}<span class="l">${last}</span>${u ? `<span class="ub">${u}</span>` : ""}</div></div></div>`
    ).join("")}
  </div>
</div>`;

const peopleChat = () => `<div class="cols people-chat">
  <div class="avatar-rail">${CHATS.map(([n], i) => `<div class="ar ${i === 0 ? "on" : ""}" title="${n}">${av(n, 36)}${i === 1 || i === 2 ? `<span class="dot"></span>` : ""}</div>`).join("")}<div class="ar add" title="New">${icon("plus")}</div></div>
  <div class="main mchat">
    <div class="scroll">${thread()}</div>
    ${composer("Message Ada")}
  </div>
</div>`;

PAGES["b-home"] = () => win({ hdr: hdrB(), side: "", page: peopleHome() });
PAGES["b-chat"] = () => win({ hdr: hdrB({ inChat: true }), side: "", page: peopleChat() });

/* ═══════════════════════════════════════════════════════════════════════════
   C — Focus
   The conversation owns the window. Switch chats from a header control that
   opens a floating list — built for living in a few threads, not scanning
   an inbox all day.
   ═══════════════════════════════════════════════════════════════════════════ */
const hdrC = (o = {}) => header({
  icon: "chat", name: "Messages",
  start: `<button class="chat-switch ${o.open ? "open" : ""}">${av("Ada Okafor", 26)}<span class="nm">Ada Okafor</span>${icon("chev-d")}${o.unread ? `<span class="ub">4</span>` : ""}</button>`,
  center: "",
  end: `${phonePill()}${ib("search", "Search in this chat")}${ib("info", "Details")}<button class="newbtn">${icon("compose")}<span>New</span></button>`,
});

const focusChat = () => `<div class="main mchat focus">
  <div class="focus-meta"><span>RCS · +1 555-123-4567</span><span class="sp"></span><span class="when">Active now</span></div>
  <div class="scroll">${thread()}</div>
  ${composer("Message Ada")}
</div>`;

const chatPicker = () => `<div class="chat-picker pop">
  <div class="field">${icon("search")}<span class="ph">Jump to a chat</span></div>
  <div class="plist">${CHATS.map((c, i) => crow(c, i === 0)).join("")}</div>
  <div class="pfoot">${btn("See all conversations", "ghost", "listic")}</div>
</div>`;

PAGES["c-chat"] = () => win({ hdr: hdrC(), side: "", page: focusChat() });
PAGES["c-picker"] = () => win({
  hdr: hdrC({ open: true, unread: true }),
  side: "",
  page: focusChat(),
  over: chatPicker(),
});

/* ═══════════════════════════════════════════════════════════════════════════
   D — Stack (tiled-first)
   One column: the list is a full page; open a chat and it replaces the list
   with a clear Back. Designed for an 800 px tile, not a wide three-pane.
   ═══════════════════════════════════════════════════════════════════════════ */
const hdrD = (o = {}) => header({
  icon: "chat", name: "Messages",
  start: o.chat ? `${ib("back", "Back to chats")}` : "",
  center: o.chat
    ? `<div class="person-switch tight">${av("Ada Okafor", 28)}<b>Ada Okafor</b></div>`
    : search("Search texts", "Ctrl F"),
  end: o.chat
    ? `${ib("phone", "Call")}${ib("more", "More")}`
    : `${phonePill()}<button class="newbtn">${icon("compose")}<span>New</span></button>`,
});

const stackList = () => `<div class="main stack-list">
  <div class="filters">${seg(["All", "Unread", "Starred"], "All")}</div>
  <div class="scroll big">${CHATS.map(([n, last, t, u, f], i) =>
    `<div class="srow ${i === 0 ? "sel" : ""}">${av(n, 48)}<div class="tx"><div class="r1"><span class="n">${n}</span><span class="t">${t}</span></div><div class="r2">${f.rcs ? `<span class="rcs">RCS</span>` : ""}<span class="l">${last}</span>${u ? `<span class="ub">${u}</span>` : ""}</div></div>${icon("chev-r", "chev")}</div>`
  ).join("")}</div>
</div>`;

const stackChat = () => `<div class="main mchat">
  <div class="scroll">${thread()}</div>
  ${composer("Message Ada")}
</div>`;

PAGES["d-list"] = () => win({ hdr: hdrD(), side: "", page: stackList() });
PAGES["d-chat"] = () => win({ hdr: hdrD({ chat: true }), side: "", page: stackChat() });
