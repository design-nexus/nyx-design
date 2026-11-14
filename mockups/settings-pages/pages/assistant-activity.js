// Assistant & AI › Activity: what Echo is asking, doing and has done.
(() => {
  const DESC = "What Echo is asking, doing and has done.";
  const o = (ic) => ({ ic, sec: "assistant" });
  const page = (body) => () => swin({ sec: "assistant", page: "Activity", desc: DESC, body: body() });
  const SI = { done: ["check", "var(--success)", "Done"], part: ["info", "var(--warning)", "Partly done"], no: ["x", "var(--danger)", "You said no"], run: ["refresh", "var(--sec-assistant)", "Running"], wait: ["clock", "var(--warning)", "Waiting for you"] };
  const sdot = (s) => `<span class="ac-si" style="--sc:${SI[s][1]}">${icon(SI[s][0])}</span>`;
  const pill = (s, t) => `<div class="pill" style="--tc:${SI[s][1]}">${icon(SI[s][0])}${t || SI[s][2]}</div>`;
  const DAYS = [
    ["Today", [
      ["14:12", "Find the slides Sam sent last week", "3 steps · 6 s", "done"],
      ["11:02", "Clear out my old screenshots", "4 steps · asked you once", "done", true],
      ["10:40", "What's the weather tomorrow?", "1 step · 2 s", "done"],
      ["09:15", "Write up notes from the design review", "6 of 12 steps · ran out of steps", "part"],
    ]],
    ["Yesterday", [
      ["17:45", "Rename my holiday photos by date", "5 steps · 14 s", "done"],
      ["16:12", "Delete the old project folder", "Stopped when you said no", "no"],
      ["08:30", "Set a timer for ten minutes", "1 step", "done"],
    ]],
    ["Tuesday", [
      ["16:05", "Make a playlist for my run", "3 steps · 9 s", "done"],
    ]],
  ];

  /* ── A: timeline and detail ──────────────────────────────────────── */
  const item = ([t, n, d, s, on]) => `<div class="ac-it ${on ? "on" : ""}">${sdot(s)}<div class="tx"><b>${n}</b><span>${d}</span></div><small>${t}</small></div>`;
  const aCtl = () => `
    <div class="ac-tools"><div class="field">${icon("search")}<span class="ph">Search what you asked</span></div>${dd("Everything")}</div>
    ${DAYS.map(([d, items], i) => `<div class="gtitle ${i === 0 ? "first" : ""}">${d}</div><div class="card ac-list">${items.map(item).join("")}</div>`).join("")}`;
  const STEPS = [
    ["search", "Looked in Pictures › Screenshots", "Found 214 screenshots", "done"],
    ["filter", "Picked the ones older than 3 months", "31 files · 412 MB", "done"],
    ["info", "Asked you before moving them", "You said yes at 11:03", "ask"],
    ["trash", "Moved 31 files to the Trash", "Checked: all 31 are in the Trash", "done"],
  ];
  const aPv = () => `
    ${pvhead("Clear out my old screenshots", "Today at 11:02 · 4 of 12 steps · 38 seconds", pill("done"))}
    <div class="card ac-said">${icon("mic")}<span>“Echo, clear out my old screenshots, anything from before the summer.”</span></div>
    <div class="ac-steps">${STEPS.map(([ic, t, d, s], i) => `<div class="st2 ${s}"><span class="n">${s === "ask" ? icon("info") : icon("check")}</span><div class="tx"><b>${i + 1}. ${t}</b><span>${d}</span></div><span class="tool">${icon(ic)}</span></div>`).join("")}</div>
    <div class="card ac-chg"><span class="lic" style="--tc:var(--sec-assistant)">${icon("trash")}</span><div class="ch"><b>31 files are in the Trash</b><span>412 MB · can be put back until Dec 13</span></div>${btn("Put them back", "sm", "refresh")}${btn("Ask again", "sm ghost", "repeat")}</div>
    ${pvfoot("Asked once, as Permissions says for changing files.", "shield", '<span class="lnk">Permissions</span>')}`;

  /* ── B: the week at a glance ─────────────────────────────────────── */
  const WEEK = [["Mon", 14, 3, 0, 1], ["Tue", 22, 4, 1, 0], ["Wed", 9, 1, 0, 0], ["Thu", 31, 5, 0, 1], ["Fri", 18, 2, 1, 0], ["Sat", 4, 0, 0, 0], ["Sun", 0, 0, 0, 0]];
  const bCtl = () => `
    <div class="field">${icon("search")}<span class="ph">Search actions and requests</span></div>
    ${ocard("Show", [
      orow("What", "", seg(["Everything", "Tasks", "Actions"], "Actions"), o("list")),
      orow("When", "", dd("This week"), o("calendar")),
    ], { cls: "icons" })}
    ${ocard("Outcome", [["check", "Done on its own", 98, true, "success"], ["info", "Asked you first", 15, true, "warning"], ["x", "You said no", 2, true, "danger"], ["refresh", "Didn't work", 2, true, "graphite"]].map(([ic, n, c, on, col]) => `<div class="opt">${chk(on)}<span class="ac-sw" style="background:var(--${col === "graphite" ? "sw-graphite" : col})"></span><div class="opt-text"><div>${n}</div></div><span class="rv">${c}</span></div>`))}
    ${ocard("", [orow("Keep for", "Tasks, actions and undo copies.", dd("30 days"), o("history")), orow("Clear all activity", "", btn("Clear…", "sm"), o("trash"))], { cls: "icons" })}`;
  const MAX = 36;
  const bar = ([d, a, k, n, f]) => `<div class="wc"><div class="wb">${[[f, "graphite"], [n, "danger"], [k, "warning"], [a, "success"]].map(([v, c]) => v ? `<b style="height:${(v / MAX) * 100}%;background:var(--${c === "graphite" ? "sw-graphite" : c})"></b>` : "").join("")}</div><small>${d}</small><em>${a + k + n + f || ""}</em></div>`;
  const ACTS = [
    ["Fri 14:12", "search", "Searched your files for “slides” from Sam Rivera", "Allowed by your settings", "0.4 s"],
    ["Fri 11:03", "trash", "Moved 31 screenshots to the Trash", "You allowed it", "1.2 s"],
    ["Fri 11:02", "folder", "Listed Pictures › Screenshots", "Allowed by your settings", "0.1 s"],
    ["Fri 10:40", "globe", "Looked up tomorrow's weather for Portland", "Allowed by your settings", "0.9 s"],
    ["Fri 09:21", "file-text", "Wrote “Design review notes.md” in Documents", "You allowed it", "0.2 s"],
  ];
  const bPv = () => `
    ${pvhead("This week", "117 actions across 34 requests.", seg(["Week", "Month"], "Week"))}
    <div class="card ac-week">
      <div class="wsum">${[["98", "done on its own", "success"], ["15", "asked you first", "warning"], ["2", "you said no", "danger"], ["2", "didn't work", "sw-graphite"]].map(([n, l, c]) => `<div><b style="color:var(--${c})">${n}</b><span>${l}</span></div>`).join("")}</div>
      <div class="wch">${WEEK.map(bar).join("")}</div>
    </div>
    <div class="gtitle gflex">Friday<span class="sp"></span><span class="note">5 of 23</span></div>
    <div class="card ac-log">${ACTS.map(([t, ic, w, how, ms]) => `<div class="lr"><small>${t.split(" ")[1]}</small><span class="lic" style="--tc:var(--sec-assistant)">${icon(ic)}</span><div class="tx"><b>${w}</b><span>${how} · ${ms}</span></div></div>`).join("")}</div>`;

  /* ── C: live, waiting for you ────────────────────────────────────── */
  const LIVE = [["Opened your notes from the design review", "done"], ["Wrote a summary of the decisions", "done"], ["Opened Mail and started a new message", "done"], ["Pasted the summary, addressed it to Sam Rivera", "done"], ["Click “Send” in Mail", "wait"], ["Tell you it's sent", "next"]];
  const cCtl = () => `
    <div class="gtitle first gflex">Now<span class="sp"></span>${btn("Stop", "sm", "x")}</div>
    <div class="card ac-now"><div class="nh">${sdot("wait")}<div class="tx"><b>Send Sam the notes from the design review</b><span>Started 14:20 · 5 of 12 steps · 41 s</span></div></div>
      <div class="ac-live">${LIVE.map(([t, s]) => `<div class="lv ${s}"><i></i><span>${t}</span></div>`).join("")}</div></div>
    <div class="gtitle">Next</div>
    <div class="card">${orow("Remind me to follow up on Monday", "Waiting to start", btn("Cancel", "sm ghost"), o("clock"))}</div>
    <div class="gtitle gflex">Earlier today<span class="sp"></span><span class="lnk">All activity</span></div>
    <div class="card ac-list">${DAYS[0][1].slice(0, 3).map((x) => item([x[0], x[1], x[2], x[3]])).join("")}</div>`;
  const cPv = () => `
    ${pvhead("Echo is waiting for you", "It needs a yes or no before it carries on.", pill("wait", "Asked 14:21"))}
    <div class="card ac-ask">
      <div class="qh"><span class="orb"></span><div><b>Click “Send” in Mail?</b><span>This sends the email to Sam Rivera.</span></div></div>
      <div class="mail">
        <div class="mh"><i></i><i></i><i></i><b>New message</b><span class="sendb">${icon("send")}Send</span></div>
        <div class="mf"><small>To</small><span>Sam Rivera</span></div>
        <div class="mf"><small>Subject</small><span>Notes from Thursday's design review</span></div>
        <div class="mb"><p>Hi Sam,</p><p>Here's a summary of what we decided on Thursday: the new sidebar ships in the next release, the colour work moves to January, and Atlas gets the bigger text by default.</p><p>Open questions:</p><ul><li>Who signs off the new icons?</li><li>Do we keep the old shortcuts for one more release?</li><li>When can we test on the Lumen Book 14?</li></ul><p class="fade">Thanks, and talk on Monday…</p></div>
      </div>
      <div class="why">${icon("shield")}<span>It asks because “Send” is on your list of words to always ask about.</span></div>
      <div class="bt">${btn("No", "")}${btn("Yes, for this task", "")}${btn("Yes, send it", "primary", "send")}</div>
    </div>
    ${pvfoot("If you don't answer, it waits; the time doesn't count against the task.", "clock")}`;

  REG("assistant-activity", {
    name: "Activity",
    summary: "A banner when Echo isn't running, then pending approvals, then the last ten tasks as one flat list of everything you said, each with “Done · 2 of 4 steps · 3.3 s · date”, then thirty recent actions by their tool names. Steps hide inside each task as lines of tool output.",
    problems: [
      "<b>Your words, in full, as the titles:</b> every request is shown exactly as heard, long ones wrapping to two lines, and near-repeats sit one after another.",
      "<b>A flat list:</b> no days, and no icon for done, failed or stopped; “Done · 2 of 4 steps · 3.3 s · Oct 28 09:11” is the only clue.",
      "<b>Steps as tool output:</b> opening a task shows lines like “✓ 1. tool — evidence”, not what it did in plain words.",
      "<b>Actions in developer words:</b> recent actions read “tool · outcome” and “decision (rule)” with timings in ms.",
      "<b>No undo or clear here:</b> undo copies of changed files exist, but there's no “put it back” on the task that changed them, and no way to clear the log from this page.",
      "<b>The not-running banner leads the page</b> even though the history below it can still be read.",
    ],
    today: [["assistant-activity-1280", "Today", ""], ["assistant-activity-800", "Today at 800 px", ""]],
    options: [
      {
        id: "a", name: "Timeline and detail",
        idea: "Requests are grouped by day with an icon for done, partly done or stopped, and a short line on how it went (4 steps, asked you once). Choosing one shows what it did on the right as numbered steps in plain words, including where it asked you and what you said, with Put the files back for anything it changed. Search and a filter sit above the list.",
        shots: [["a", "Timeline and detail", ""], ["a-800", "At 800 px", "The chosen task above the timeline"]],
      },
      {
        id: "b", name: "The week at a glance",
        idea: "For checking what Echo has been up to. A chart shows each day's actions, coloured by how they were decided: on its own, after asking you, refused, or failed. Under it, the day's actions read as sentences (“Moved 31 screenshots to the Trash · You allowed it”). The filters, how long it keeps things and Clear all sit on the left.",
        shots: [["b", "The week at a glance", "Actions per day, then the day's actions in plain words"]],
      },
      {
        id: "c", name: "Live, waiting for you",
        idea: "When Echo is in the middle of a task, the page leads with it: its steps ticking off live, Stop, and what's queued next. The picture is the question it's asking, shown with what it's about to do (here, the email it will send by clicking Send in Mail), why it's asking, and the three answers. Earlier tasks drop to a short list.",
        shots: [["c", "Waiting for you", "The email it's about to send, and why it asks"]],
      },
    ],
    pages: { a: page(() => split(aCtl(), aPv(), { sec: "assistant", ctlw: 420 })), b: page(() => split(bCtl(), bPv(), { sec: "assistant", ctlw: 380 })), c: page(() => split(cCtl(), cPv(), { sec: "assistant", ctlw: 420 })) },
  });
})();
