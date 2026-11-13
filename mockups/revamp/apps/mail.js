// Nyx Mail on the revamp page: today's problems and three options.
(() => {
  const MSGS = [
    ["Sam Rivera", "Q4 roadmap: notes before Thursday", "I went through the draft and left comments on the pricing section — two things I'd like…", "10:42", { unread: true, star: true }],
    ["Acme Billing", "Invoice INV-2291 is due Friday", "Your invoice for October is attached. Net 30, as agreed. Reply if anything looks off.", "9:15", { unread: true, clip: true }],
    ["GitHub", "[nyx-design] PR #412 merged", "ada-o merged 3 commits into main from sidebar-sections. View it on GitHub.", "8:03", {}],
    ["Mom", "Thanksgiving train times", "The 2:15 gets in at 5:40, or there's the 4:05 that's a bit quicker but always full…", "Yesterday", { unread: true }],
    ["Lumen Labs", "Your design review is booked", "Thursday 13 Nov, 14:00–15:00 with Ada Okafor. Add it to your calendar.", "Yesterday", { cal: true }],
    ["Figma", "What's new in Figma: November", "Variables in prototypes, a faster canvas, and the new AI tools for design systems.", "Tue", { feed: true }],
    ["Delta", "Your trip to Chicago: check in now", "Flight DL 1182 · Fri 21 Nov · BHM 07:10 → ORD 08:55. Seat 14C.", "Tue", { paper: true }],
    ["Alabama Power", "Your November bill is ready", "Amount due $142.18 by 28 Nov. Pay online or set up AutoPay.", "Mon", { paper: true }],
  ];
  const acct = "ken@design-nex.us";

  const hdr = (o = {}) => header({ icon: "mail", name: "Mail", center: search(o.q || "Search mail", "Ctrl F"), end: `<button class="newbtn">${icon("compose")}<span>Compose</span><span class="key">Ctrl N</span></button>` });

  /* ── Option A: tidy three panes ─────────────────────────────────────── */
  const sideA = (on = "inbox", o = {}) => `
    ${o.noTiles ? "" : tiles([["inbox", "inbox", 12, "Inbox", "violet"], ["unread", "mail", 4, "Unread", "blue"], ["flag", "flag", 2, "Flagged", "amber"], ["snooze", "clock", 3, "Snoozed", "teal"]], on)}
    ${grp(acct, false, icon("chev-d"), "accent")}
    ${navx("inbox", "Inbox", { active: on === "inbox", cnt: 12 })}
    ${navx("pen", "Drafts", { cnt: 2 })}
    ${navx("send", "Sent")}
    ${navx("archive", "Archive")}
    ${navx("alert", "Junk", { cnt: 19 })}
    ${navx("trash", "Trash")}
    ${grp("Sorted for you", false, "", "green")}
    ${navx("star", "Imbox", { cnt: 8 })}
    ${navx("radio", "The Feed", { cnt: 3 })}
    ${navx("file-text", "Paper Trail", { cnt: 5 })}
    ${grp("Folders", false, icon("plus"), "amber")}
    ${navx("", "Receipts", { dot: "var(--sw-coral)" })}
    ${navx("", "Travel", { dot: "var(--sw-teal)" })}
    <div class="foot">${icon("check-c", "ok")}<span>Up to date · 2 min ago</span></div>`;

  const listA = (sel = 0) => `<div class="list mlist">
    <div class="lhead"><b>Inbox</b><span class="c">12 · 4 unread</span><span class="sp"></span>${seg(["All", "Unread", "Flagged"], "All")}</div>
    <div class="scroll">${MSGS.slice(0, 7).map(([f, s, p, t, x], i) => `<div class="mrow ${i === sel ? "sel" : ""} ${x.unread ? "unread" : ""}">${av(f, 30)}<div class="tx"><div class="r1"><span class="f">${f}</span>${x.clip ? icon("clip", "mi") : ""}${x.star ? icon("star", "mi st") : ""}<span class="t">${t}</span></div><div class="s">${s}</div><div class="p">${p}</div></div></div>`).join("")}</div></div>`;

  const reader = (o = {}) => `<div class="main reader">
    <div class="rbar">${btn("Reply", "primary", "reply")}${btn("Reply all", "", "reply-all")}${btn("Forward", "", "forward")}<span class="sp"></span>${ib("archive", "Archive (E)")}${ib("clock", "Snooze")}${ib("trash", "Delete")}${ib("more", "More")}</div>
    <div class="rbody">
      <h1>Q4 roadmap: notes before Thursday</h1>
      <div class="from">${av("Sam Rivera", 36)}<div><b>Sam Rivera</b> <span class="addr">sam@lumen.example</span><div class="to">To you · Cc Ada Okafor</div></div><span class="sp"></span><span class="when">Today 10:42</span></div>
      <div class="msg">
        <p>Hi Ken,</p>
        <p>I went through the draft and left comments on the pricing section — two things I'd like to settle before Thursday:</p>
        <ul><li>Do we keep the free tier at 3 projects, or move it to 5?</li><li>Is the annual discount 15% or 20%? Finance prefers 15.</li></ul>
        <p>The rest reads well. I'll bring the numbers from the last two quarters.</p>
        <p>— Sam</p>
      </div>
      ${o.att ? `<div class="atts"><div class="att">${icon("file-text")}<div><b>roadmap-q4-v3.pdf</b><span>1.2 MB · PDF</span></div></div></div>` : ""}
      <div class="quick">${av("Ken", 28)}<span>Reply to Sam…</span></div>
    </div></div>`;

  const pageA = (o = {}) => `<div class="cols">${listA()}${reader(o)}</div>`;

  /* ── Option B: sorted inbox (Imbox, Feed, Paper Trail, Screener) ────── */
  const sideB = (on) => `
    ${navx("star", "Imbox", { active: on === "imbox", badge: 3 })}
    ${navx("radio", "The Feed", { active: on === "feed", cnt: 6 })}
    ${navx("file-text", "Paper Trail", { active: on === "paper", cnt: 5 })}
    ${navx("filter", "Screener", { active: on === "screen", badge: 2 })}
    ${grp("Later", false, "", "accent")}
    ${navx("clock", "Snoozed", { cnt: 3 })}
    ${navx("flag", "Set aside", { cnt: 2 })}
    ${navx("pen", "Drafts", { cnt: 2 })}
    ${grp(acct, false, icon("chev-r"), "violet")}
    <div class="foldnote hide-narrow">Sent, Archive, Junk and Trash</div>
    <div class="foot">${icon("check-c", "ok")}<span>Up to date</span></div>`;

  const imbox = () => `<div class="main imbox">
    <div class="ihead"><div><b>Imbox</b><span>People and things you said yes to</span></div><span class="sp"></span>${seg(["New for you", "Previously seen"], "New for you")}</div>
    <div class="scroll"><div class="clamp" style="--clamp: 760px">
      <div class="newfor">New for you · 3</div>
      ${MSGS.filter((m) => m[4].unread).map(([f, s, p, t]) => `<div class="icard">${av(f, 40)}<div class="tx"><div class="r1"><b>${f}</b><span class="t">${t}</span></div><div class="s">${s}</div><div class="p">${p}</div></div></div>`).join("")}
      <div class="newfor seen">Previously seen</div>
      ${MSGS.filter((m) => !m[4].unread && !m[4].feed && !m[4].paper).map(([f, s, p, t]) => `<div class="icard seen">${av(f, 32)}<div class="tx"><div class="r1"><b>${f}</b><span class="t">${t}</span></div><div class="s">${s}</div></div></div>`).join("")}
    </div></div></div>`;

  const feed = () => `<div class="main imbox">
    <div class="ihead"><div><b>The Feed</b><span>Newsletters and updates, to read when you like</span></div><span class="sp"></span>${btn("Mark all read", "ghost", "check")}</div>
    <div class="scroll"><div class="fgrid">
      ${[["Figma", "What's new in Figma: November", "Variables in prototypes, a faster canvas, and the new AI tools."], ["The Verge", "The best laptops of 2026", "Our picks after testing 40 machines this year."], ["Stratechery", "The agent economy", "Why every app is becoming a set of tools for someone else's model."], ["AAWireless", "Meet CHARGE", "Magnetic wireless charging for the road."], ["Omarchy", "3.2 is out", "New themes, a faster installer and Hyprland 0.52."], ["GitHub", "Your year in code", "1,284 contributions across 61 repositories."]].map(([f, s, p], i) => `<div class="fcard">${art(f + i, { h: 110, r: 0 })}<div class="fb"><span class="f">${f}</span><b>${s}</b><span class="p">${p}</span></div></div>`).join("")}
    </div></div></div>`;

  const screener = () => `<div class="main imbox">
    <div class="ihead"><div><b>Screener</b><span>First-time senders wait here until you decide</span></div></div>
    <div class="scroll"><div class="clamp" style="--clamp: 720px">
      ${[["Northwind Recruiting", "jobs@northwind.example", "Exciting senior design role — remote"], ["Pinecrest HOA", "board@pinecrest.example", "Pool closes for the season on Nov 15"]].map(([f, a, s]) => `<div class="scard">${av(f, 40)}<div class="tx"><b>${f}</b><span class="a">${a}</span><span class="s">“${s}”</span></div><div class="yn">${btn("Yes, to Imbox", "primary", "check")}${btn("Feed")}${btn("Paper Trail")}${btn("No", "dtext", "x")}</div></div>`).join("")}
      <p class="snote">${icon("info")} Say no and you won't see mail from them again. You can change your mind in Settings › Screened out.</p>
    </div></div></div>`;

  /* ── Option C: conversations ─────────────────────────────────────────── */
  const convList = (sel = 0) => `<div class="list mlist conv">
    <div class="lhead"><b>Conversations</b><span class="sp"></span>${ib("filter", "Filter")}</div>
    <div class="scroll">${[["Sam Rivera", "Q4 roadmap", "You: Let's go with 5 projects and…", "10:51", 3, true], ["Acme Billing", "Invoice INV-2291", "Your invoice for October is attached.", "9:15", 1, true], ["Mom", "Thanksgiving train times", "The 2:15 gets in at 5:40, or…", "Yesterday", 4, true], ["Ada Okafor", "Design review", "Thursday works. I'll book a room.", "Yesterday", 6, false], ["GitHub", "PR #412 merged", "ada-o merged 3 commits into main", "8:03", 1, false]].map(([f, s, p, t, n, u], i) => `<div class="crow ${i === sel ? "sel" : ""} ${u ? "unread" : ""}">${av(f, 36)}<div class="tx"><div class="r1"><span class="f">${f}</span>${n > 1 ? `<span class="n">${n}</span>` : ""}<span class="t">${t}</span></div><div class="s">${s}</div><div class="p">${p}</div></div></div>`).join("")}</div></div>`;

  const thread = () => `<div class="main thread">
    <div class="thead"><b>Q4 roadmap: notes before Thursday</b><span class="who">Sam Rivera, Ada Okafor and you · 3 messages</span><span class="sp"></span>${ib("archive", "Archive")}${ib("trash", "Delete")}${ib("more", "More")}</div>
    <div class="scroll"><div class="bubbles">
      <div class="b them">${av("Sam Rivera", 28)}<div class="bb"><div class="bh"><b>Sam Rivera</b><span>10:42</span></div><p>I went through the draft and left comments on the pricing section. Two things to settle before Thursday: keep the free tier at 3 projects or move it to 5? And is the annual discount 15% or 20%?</p></div></div>
      <div class="b them">${av("Ada Okafor", 28)}<div class="bb"><div class="bh"><b>Ada Okafor</b><span>10:47</span></div><p>Finance prefers 15. I'd push for 5 projects — it's what people ask for in every interview.</p></div></div>
      <div class="b me"><div class="bb"><div class="bh"><b>You</b><span>10:51</span></div><p>Let's go with 5 projects and 15%. I'll update the doc tonight.</p></div></div>
      <div class="collapsed">${icon("chev-d")} Quoted text and signatures are hidden</div>
    </div></div>
    <div class="composer"><div class="cfield"><span class="to">To Sam, Ada</span><span class="ph">Write a reply…</span></div><div class="crow2">${ib("clip", "Attach")}${ib("image", "Image")}<span class="sp"></span>${btn("Send", "primary", "send")}</div></div>
  </div>`;

  /* ── Option C: one at a time ─────────────────────────────────────────── */
  const NWm = () => typeof NARROW !== "undefined" && NARROW;
  const hdrN1 = (open) => header({ icon: "mail", name: "Mail",
    start: `<button class="n1-box ${open ? "open" : ""}">${icon("inbox")}<b>Inbox</b><span class="c">12</span>${icon("chev-d")}</button>`,
    center: search("Search mail", "Ctrl F"),
    end: `<button class="newbtn">${icon("compose")}<span>Compose</span>${NWm() ? "" : `<span class="key">C</span>`}</button>` });
  const n1Strip = () => {
    const done = [["Ada Okafor", "archive"], ["GitHub", "archive"], ["Figma", "clock"]];
    const next = ["Acme Billing", "Mom", "Lumen Labs", "Delta", "Alabama Power", "Jonah Lee"].slice(0, NWm() ? 2 : 6);
    return `<div class="n1-strip">
      <div class="n1-prog"><div class="r"><b>4 of 12</b><span>8 to go</span></div>${prog(33)}</div>
      <div class="n1-q">
        ${NWm() ? "" : done.map(([n, i]) => `<span class="qc done">${icon(i)}<span>${n}</span></span>`).join("")}
        <span class="qc on">${av("Sam Rivera", 20)}<span>Sam Rivera</span></span>
        ${next.map((n) => `<span class="qc">${av(n, 20)}<span>${n}</span></span>`).join("")}
      </div>
      ${NWm() ? "" : seg(["All", "Unread", "Starred"], "All")}
    </div>`;
  };
  const n1Key = (ic, label, k, c = "") => `<button class="n1-k ${c}">${icon(ic)}<span class="l">${label}</span>${kbd(k)}</button>`;
  const n1Dock = () => `<div class="n1-dock">
    <button class="n1-k nav" title="Previous (K)">${icon("chev-l")}${kbd("K")}</button>
    <span class="dv"></span>
    ${n1Key("reply", "Reply", "R", "pri")}${NWm() ? "" : n1Key("reply-all", "Reply all", "A")}${n1Key("forward", "Forward", "F")}
    <span class="dv"></span>
    ${n1Key("archive", "Archive", "E")}${n1Key("clock", "Snooze", "Z")}${n1Key("star", "Star", "S")}
    <span class="dv"></span>
    ${n1Key("alert", "Junk", "!")}${n1Key("trash", "Delete", "#")}
    <span class="dv"></span>
    <button class="n1-k nav" title="Next (J)">${kbd("J")}${icon("chev-r")}</button>
  </div>`;
  const n1Who = () => `<aside class="n1-who">
    <div class="card n1-wc">
      <div class="top">${av("Sam Rivera", 44)}<div class="tx"><b>Sam Rivera</b><span>sam@lumen.example</span></div></div>
      <div class="facts"><span>${icon("star")}In your Imbox</span><span>${icon("mail")}14 conversations since 2023</span></div>
      <div class="opt"><div class="opt-text"><div>Their mail goes to</div></div>${dd("Imbox")}</div>
      <div class="opt"><div class="opt-text"><div>Notify me</div></div>${sw(true)}</div>
    </div>
    <div class="n1-lab">Recent with Sam</div>
    <div class="n1-rec">${[["Pricing page copy", "Nov 3"], ["Re: Offsite agenda", "Oct 21"], ["Q3 numbers", "Oct 2"]].map(([s, d]) => `<div class="rr"><span>${s}</span><em>${d}</em></div>`).join("")}</div>
    <div class="n1-lab">Files from Sam</div>
    <div class="n1-rec">${[["file-text", "roadmap-q4-v3.pdf", "1.2 MB"], ["file", "pricing-tiers.xlsx", "84 KB"]].map(([i, n, s]) => `<div class="rr f">${icon(i)}<span>${n}</span><em>${s}</em></div>`).join("")}</div>
  </aside>`;
  const n1Page = (o = {}) => `<div class="main n1-page">
    ${n1Strip()}
    <div class="n1-stage">
      <article class="n1-msg">
        <div class="lbl">${chip("Imbox", "acc", "star")}${chip("Starred", "", "star")}<span class="sp"></span><span class="when">Today 10:42</span></div>
        <h1>Q4 roadmap: notes before Thursday</h1>
        <div class="from">${av("Sam Rivera", 36)}<div><b>Sam Rivera</b> <span class="addr">sam@lumen.example</span><div class="to">To you · Cc Ada Okafor</div></div></div>
        <div class="msg">
          <p>Hi Ken,</p>
          <p>I went through the draft and left comments on the pricing section — two things I'd like to settle before Thursday:</p>
          <ul><li>Do we keep the free tier at 3 projects, or move it to 5?</li><li>Is the annual discount 15% or 20%? Finance prefers 15.</li></ul>
          <p>The rest reads well. I'll bring the numbers from the last two quarters.</p>
          <p>— Sam</p>
        </div>
        <div class="atts"><div class="att">${icon("file-text")}<div><b>roadmap-q4-v3.pdf</b><span>1.2 MB · PDF</span></div></div></div>
      </article>
      ${NWm() ? "" : n1Who()}
    </div>
    ${n1Dock()}
  </div>`;
  const n1Places = () => {
    const it = (ic, t, end = "", c = "") => `<div class="pi ${c}">${ic.startsWith("var(") ? `<span class="dot" style="background:${ic}"></span>` : icon(ic)}<span class="t">${t}</span>${end}</div>`;
    const n = (x) => `<span class="n">${x}</span>`;
    return `<div class="n1-places pop">
      <div class="field">${icon("search")}<span class="ph">Go to a mailbox or folder</span></div>
      <div class="cols2">
        <div>
          <div class="h" style="--sc: var(--accent)">All accounts</div>
          ${it("inbox", "Inbox", kbd("1"), "on")}${it("pen", "Drafts", kbd("2"))}${it("send", "Sent", kbd("3"))}${it("archive", "Archive", kbd("4"))}${it("alert", "Junk", n(19))}${it("trash", "Trash")}
          <div class="h" style="--sc: var(--sw-amber)">ken@design-nex.us</div>
          ${it("var(--sw-coral)", "Receipts", n(41))}${it("var(--sw-teal)", "Travel", n(9))}
        </div>
        <div>
          <div class="h" style="--sc: var(--sw-green)">Sorted for you</div>
          ${it("star", "Imbox", n(8))}${it("radio", "The Feed", n(3))}${it("file-text", "Paper Trail", n(5))}${it("filter", "Screener", `<span class="b">2 new</span>`)}
          <div class="h" style="--sc: var(--sw-blue)">Later</div>
          ${it("clock", "Snoozed", n(3))}${it("send", "Send later", n(1))}${it("bell", "Waiting for a reply", n(2))}
        </div>
      </div>
      <div class="ft">${it("users", "Senders")}${it("plus", "Add an account…")}<span class="sp"></span><span class="sync">${icon("check-c")}Up to date · 2 min ago</span></div>
    </div>`;
  };

  /* ── Option D: board ─────────────────────────────────────────────────── */
  const sideN2 = () => `
    ${navx("inbox", "Inbox", { active: true, cnt: 12 })}
    ${navx("star", "Imbox", { cnt: 8 })}
    ${navx("radio", "The Feed", { cnt: 3 })}
    ${navx("file-text", "Paper Trail", { cnt: 5 })}
    ${navx("filter", "Screener", { badge: 2 })}
    ${grp("Mailboxes", false, "", "violet")}
    ${navx("pen", "Drafts", { cnt: 2 })}
    ${navx("send", "Sent")}
    ${navx("archive", "Archive")}
    ${navx("alert", "Junk", { cnt: 19 })}
    ${navx("trash", "Trash")}
    ${grp("Folders", false, icon("plus"), "amber")}
    ${navx("", "Receipts", { dot: "var(--sw-coral)" })}
    ${navx("", "Travel", { dot: "var(--sw-teal)" })}
    ${grp("People", false, "", "green")}
    ${navx("users", "Senders")}`;
  const BOARD = [
    ["New", "accent", "Fresh mail you haven't sorted", [
      ["Sam Rivera", "Q4 roadmap: notes before Thursday", "10:42", { sel: true, unread: true, clip: true }],
      ["Acme Billing", "Invoice INV-2291 is due Friday", "9:15", { unread: true, tag: ["Paper Trail", "file-text"] }],
      ["Mom", "Thanksgiving train times", "Wed", { unread: true }],
      ["Lumen Labs", "Your design review is booked", "Wed", { tag: ["Thu 14:00", "calendar"] }],
    ]],
    ["To reply", "amber", "", [
      ["Jonah Lee", "Band practice moved to Sunday?", "Tue", {}],
      ["Ada Okafor", "Slides for the review", "Mon", { clip: true }],
    ]],
    ["Waiting", "teal", "", [
      ["Inkwell Press", "Quote for 200 posters", "Mon", { you: true, tag: ["Reminds you Fri", "bell"] }],
      ["Dana Wu", "Kitchen tap still drips", "Nov 6", { you: true, tag: ["Reminds you Mon", "bell"] }],
    ]],
    ["Snoozed", "violet", "", [
      ["Delta", "Your trip to Chicago: check in now", "Tue", { tag: ["Back Thu 7:00", "clock"] }],
      ["Alabama Power", "Your November bill is ready", "Mon", { tag: ["Back Nov 25", "clock"] }],
      ["Figma", "What's new in Figma: November", "Tue", { tag: ["Back Saturday", "clock"] }],
    ]],
  ];
  const n2Card = ([f, s, t, x]) => `<div class="n2-card ${x.sel ? "sel" : ""} ${x.unread ? "unread" : ""}">
    <div class="r1">${av(f, 20)}<span class="f">${x.you ? icon("send", "you") : ""}${f}</span>${x.clip ? icon("clip", "mi") : ""}<span class="t">${t}</span></div>
    <div class="s">${s}</div>
    ${x.tag ? `<div class="tg">${chip(x.tag[0], "", x.tag[1])}</div>` : ""}
  </div>`;
  const n2Col = ([name, c, , cards]) => `<div class="n2-col" style="--cc: ${c === "accent" ? "var(--accent)" : `var(--sw-${c})`}">
    <div class="ch"><span class="dot"></span><b>${name}</b><span class="n">${cards.length}</span></div>
    <div class="cards">${cards.map(n2Card).join("")}</div>
  </div>`;
  const n2Top = () => `<div class="n2-top"><b>Inbox</b><span class="s">12 conversations · drag a card to move it</span><span class="sp"></span>${NWm() ? "" : dd("All accounts", "users")}${seg(["Board", "List"], "Board")}${ib("plus", "Add a column")}</div>`;
  const n2Lanes = () => `<div class="scroll n2-lanes">${BOARD.map(([name, c, , cards]) => `<div class="n2-lane" style="--cc: ${c === "accent" ? "var(--accent)" : `var(--sw-${c})`}">
    <div class="ch"><span class="dot"></span><b>${name}</b><span class="n">${cards.length}</span><span class="sp"></span>${cards.length > 3 ? `<span class="more">+${cards.length - 3} more</span>` : ""}</div>
    <div class="lrow3">${cards.slice(0, 3).map((x, i) => n2Card([x[0], x[1], x[2], { ...x[3], sel: false }])).join("")}</div>
  </div>`).join("")}</div>`;
  const n2Drawer = (reply) => `<div class="n2-drawer">
    <div class="dbar">${ib("x", "Close (Esc)")}<span class="mv">Move to ${dd(reply ? "Waiting" : "New")}</span><span class="sp"></span>${ib("archive", "Archive (E)")}${ib("clock", "Snooze (Z)")}${ib("trash", "Delete (#)")}${ib("more", "Junk, mark unread, print")}</div>
    <div class="dbody">
      <h2>Q4 roadmap: notes before Thursday</h2>
      ${reply ? `<div class="n2-quoted">${av("Sam Rivera", 24)}<div class="tx"><div class="r1"><b>Sam Rivera</b><span>Today 10:42</span></div><span class="p">I went through the draft and left comments on the pricing section — two things I'd like to settle before Thursday…</span></div>${icon("chev-d")}</div>
      <div class="n2-comp">
        <div class="hd"><span class="k">To</span>${chip("Sam Rivera")}<span class="k">Cc</span>${chip("Ada Okafor")}</div>
        <div class="body"><p>Thanks Sam — let's go with 5 projects and 15%.</p><p>I'll update the doc tonight and send it round before Thursday.</p><p class="sig">— Ken</p></div>
        <div class="tb">${ib("clip", "Attach")}${ib("image", "Image")}${dd("Signature: Work")}<span class="sp"></span><span class="saved">${icon("check")}Draft saved</span></div>
      </div>
      <div class="card n2-after">
        <div class="opt"><div class="opt-text"><div>Remind me if nobody replies</div><div class="d">It waits in Waiting till then</div></div>${dd("In 3 days")}${sw(true)}</div>
        <div class="opt"><div class="opt-text"><div>Send</div></div>${dd("Now", "send")}</div>
      </div>` : `<div class="from">${av("Sam Rivera", 32)}<div><b>Sam Rivera</b> <span class="addr">sam@lumen.example</span><div class="to">To you · Cc Ada Okafor · Today 10:42</div></div></div>
      <div class="msg">
        <p>Hi Ken,</p>
        <p>I went through the draft and left comments on the pricing section — two things I'd like to settle before Thursday:</p>
        <ul><li>Do we keep the free tier at 3 projects, or move it to 5?</li><li>Is the annual discount 15% or 20%? Finance prefers 15.</li></ul>
        <p>The rest reads well. I'll bring the numbers from the last two quarters.</p>
        <p>— Sam</p>
      </div>
      <div class="atts"><div class="att">${icon("file-text")}<div><b>roadmap-q4-v3.pdf</b><span>1.2 MB · PDF</span></div></div></div>`}
    </div>
    <div class="dfoot">${reply ? `${btn("Discard", "ghost dtext", "trash")}<span class="sp"></span>${btn("Send", "primary", "send")}` : `${btn("Reply", "primary", "reply")}${btn("Reply all", "", "reply-all")}${btn("Forward", "", "forward")}<span class="sp"></span>${btn("To reply", "ghost", "flag")}`}</div>
  </div>`;
  const n2Page = (reply) => NWm()
    ? `<div class="main n2-page">${n2Top()}${n2Lanes()}</div>`
    : `<div class="main n2-page"><div class="n2-split"><div class="n2-board">${n2Top()}<div class="n2-cols">${BOARD.map(n2Col).join("")}</div></div>${n2Drawer(reply)}</div></div>`;

  REG("mail", {
    name: "Mail", accent: "violet",
    summary: "Mail works, but its sidebar mixes two ways of sorting mail into one long list, its reader is a row of unlabelled icons, and HTML mail sits on a white slab inside a dark card.",
    problems: [
      "<b>Two inboxes in one list:</b> Imbox, The Feed and Paper Trail sit among Inbox, Drafts, Sent and Junk: 13 rows with no grouping, and “Imbox” next to “Inbox” reads like a typo.",
      "<b>The account heading is cut off</b> (“YOURNAME@GM…”), with + and › squeezed in beside it.",
      "<b>The reader's toolbar is ten bare icons</b>; Reply isn't any more prominent than Junk, and Archive, Junk and Delete sit side by side.",
      "<b>HTML mail on a white slab</b> inside a dark card: a frame inside a frame, and blinding at night.",
      "<b>The list header truncates</b> (“167 conversations…”), and only All and Unread can be filtered.",
      "<b>At 800 px</b> the sidebar becomes 13 identical icons and the reader's title wraps over three lines.",
      "<b>Accounts and sync</b> show only as an avatar in the corner; there's no sign of when mail last arrived.",
    ],
    today: [["mail-1280", "Today at 1280 px", "Unified inbox and a newsletter"], ["mail-800", "Today at 800 px", "Rail of 13 icons; the reader squeezed"]],
    options: [
      { id: "a", name: "Sorted inbox", idea: "Mail sorted for you, made the whole app. The sidebar is Imbox, The Feed, Paper Trail and Screener; the classic folders fold away under the account. Imbox is a calm list of people (new first), the Feed is a grid of newsletters to browse, and new senders wait in the Screener until you say where they go.",
        shots: [
          ["b-imbox","Imbox","New for you, then previously seen"],
          ["b-feed","The Feed","Newsletters as cards"],
          ["b-screener","Screener","Yes, Feed, Paper Trail or No for each new sender"],
        ] },
      { id: "b", name: "Conversations", idea: "Two panes instead of three: conversations on the left, the thread on the right as messages from people (quoted text hidden), with a reply box always at the foot. Folders and accounts live in the rail. Best for people who mostly reply.",
        shots: [
          ["c-thread","A conversation","Messages as bubbles; reply at the foot"],
          ["c-thread-800","At 800 px","Rail, list and thread"],
        ] },
      { id: "c", name: "One at a time", idea: "Mail as a short to-do list you work through. One message fills the window, with the rest of the inbox as a strip of senders across the top and how far you've got. A dock at the foot has every action with its key (R reply, E archive, Z snooze, J and K next and previous), so you can clear the inbox without touching the mouse. Mailboxes, sorted mail, folders and Senders are one menu away under “Inbox”. Beside the message: who sent it, where their mail goes, and your recent mail and files from them. Suits people who want to reach an empty inbox every day.",
        shots: [
          ["n1-inbox","A message open","One message; senders still to go along the top; keys in the dock"],
          ["n1-places","Mailboxes","Everything else under the Inbox button, with 1–4 shortcuts"],
          ["n1-inbox-800","At 800 px","The sender card folds away; the dock keeps its keys"],
        ] },
      { id: "d", name: "Board", idea: "The inbox as a board you move mail across: New, To reply, Waiting and Snoozed, each a column of cards. Drag a card, or press a key, to move it; mail you send can sit in Waiting and remind you if nobody answers; snoozed mail shows when it comes back. Opening a card slides the message in from the right, and replying happens in the same drawer. Mailboxes and folders sit in an icon rail. Suits people who treat mail as a list of things to do.",
        shots: [
          ["n2-board","A message open","Four columns; the message in a drawer on the right"],
          ["n2-reply","Replying","Reply in the drawer; remind me if nobody replies"],
          ["n2-board-800","At 800 px","The columns turn into rows"],
        ] },
    ],
    pages: {
      "a-inbox": () => win({ hdr: hdr(), side: sideA(), page: pageA() }),
      "a-attach": () => win({ hdr: hdr(), side: sideA(), page: pageA({ att: true }) }),
      "b-imbox": () => win({ hdr: hdr(), side: sideB("imbox"), page: imbox() }),
      "b-feed": () => win({ hdr: hdr(), side: sideB("feed"), page: feed() }),
      "b-screener": () => win({ hdr: hdr(), side: sideB("screen"), page: screener() }),
      "c-thread": () => railed(win({ hdr: hdr(), side: sideA("inbox", { noTiles: true }), page: `<div class="cols">${convList()}${thread()}</div>` })),
      "n1-inbox": () => win({ hdr: hdrN1(), side: "", page: n1Page() }),
      "n1-places": () => win({ hdr: hdrN1(true), side: "", page: n1Page(), over: n1Places() }),
      "n2-board": () => railed(win({ hdr: hdr(), side: sideN2(), page: n2Page(false) })),
      "n2-reply": () => railed(win({ hdr: hdr(), side: sideN2(), page: n2Page(true) })),
    },
  });
})();
