// Nyx Calendar on the revamp page: today's problems and three options.
(() => {
  const NW = () => typeof NARROW !== "undefined" && NARROW;
  const CAL = { work: "blue", home: "green", family: "pink", hol: "teal", conf: "amber", rem: "violet" };
  const cc = (k) => `var(--sw-${CAL[k] || k})`;

  // Sun 8 – Sat 14 November 2026; today is Thursday 12.
  const DAYS = [["Sun", 8], ["Mon", 9], ["Tue", 10], ["Wed", 11], ["Thu", 12], ["Fri", 13], ["Sat", 14]];
  const TODAY = 12;
  // [day, start, end, title, calendar, place]
  const EV = [
    [8, 10, 11.5, "Brunch with Priya", "family", "Juniper Café"],
    [9, 9, 9.5, "Team standup", "work", ""],
    [9, 13, 14, "Design review", "work", "Room 4B"],
    [9, 18, 19, "Climbing", "home", "Boulder Barn"],
    [10, 9, 9.5, "Team standup", "work", ""],
    [10, 11, 12, "1:1 with Jordan", "work", ""],
    [10, 16.5, 17.5, "Piano lesson", "family", ""],
    [11, 9, 9.5, "Team standup", "work", ""],
    [11, 14, 15.5, "Sprint planning", "work", "Room 2A"],
    [12, 9, 9.5, "Team standup", "work", ""],
    [12, 12.5, 13.5, "Lunch with Sam", "home", "Café Lumen"],
    [12, 15, 16, "Dentist", "home", "Dr. Patel, 2nd floor"],
    [12, 17.5, 18.5, "Pick up Maya", "family", "Westside Field"],
    [13, 9, 9.5, "Team standup", "work", ""],
    [13, 10, 11, "Interview: Lena Ortiz", "work", "Video call"],
    [13, 13.5, 15, "Roadmap workshop", "work", "Lumen HQ · Room 4B"],
    [13, 16, 17, "Friday demo", "work", ""],
    [14, 9, 10.5, "Farmers market", "family", "Main Street"],
    [14, 13, 15, "Soccer: Maya vs. Hornets", "family", "Westside Field"],
  ];
  // [first day, last day, title, calendar, reminder?]
  const ALLDAY = [[11, 11, "Veterans Day", "hol"], [13, 14, "DevWorld 2026", "conf"], [10, 10, "Renew passport", "rem", true]];
  const H0 = 8, H1 = 20;
  const hl = (h) => h === 12 ? "Noon" : `${h > 12 ? h - 12 : h} ${h >= 12 ? "PM" : "AM"}`;
  const tm = (h) => { const hh = Math.floor(h), m = Math.round((h - hh) * 60); return `${hh > 12 ? hh - 12 : hh}${m ? ":" + String(m).padStart(2, "0") : ""}`; };
  const span = (a, b) => `${tm(a)}–${tm(b)} ${b >= 12 ? "PM" : "AM"}`;

  /* ── Parts ─────────────────────────────────────────────────────────── */
  const mini = (o = {}) => {
    const busy = new Set(EV.map((e) => e[0]).concat([16, 18, 19, 23, 25, 26]));
    const cells = [];
    for (let d = 1; d <= 30; d++) cells.push([d, true]);
    for (let d = 1; d <= 5; d++) cells.push([d, false]);
    return `<div class="cal-mini">
      <div class="mh"><b>November 2026</b><span class="sp"></span>${ib("chev-l")}${ib("chev-r")}</div>
      <div class="mg">${["S", "M", "T", "W", "T", "F", "S"].map((d) => `<span class="dw">${d}</span>`).join("")}
      ${cells.map(([d, inm]) => `<span class="d ${inm ? "" : "out"} ${inm && d === TODAY ? "today" : ""} ${inm && d >= 8 && d <= 14 && !o.noWeek ? "wk" : ""} ${inm && d === 8 && !o.noWeek ? "ws" : ""} ${inm && d === 14 && !o.noWeek ? "we" : ""}">${d}${inm && busy.has(d) && d !== TODAY ? "<i class='bd'></i>" : ""}</span>`).join("")}</div></div>`;
  };

  const crow = (name, k, o = {}) => `<div class="navx cal-row ${o.off ? "off" : ""}"><span class="cbox" style="--cc:${cc(k)}">${o.off ? "" : icon("check")}</span><span>${name}</span>${o.lock ? icon("lock", "lk") : ""}${o.cnt !== undefined ? `<span class="cnt">${o.cnt}</span>` : ""}</div>`;

  const cals = (o = {}) => `
    ${grp("Google · alex.rivera", false, icon("more"), "accent")}
    ${crow("Work", "work")}
    ${crow("Personal", "home")}
    ${crow("Family", "family")}
    ${crow("US holidays", "hol", { lock: true })}
    ${crow("Reminders", "rem", { off: o.remOff })}
    ${grp("On this computer", false, icon("plus"), "green")}
    ${crow("Garden", "coral", { off: true })}
    ${grp("Imported · not syncing", false, "", "amber")}
    ${crow("DevWorld 2026", "conf", { cnt: 16 })}
    ${o.sets === false ? "" : `${grp("Sets", false, icon("plus"), "violet")}
    <div class="cal-sets">${chip("Everything", "on")}${chip("Work")}${chip("Family")}</div>`}
    <div class="foot">${icon("check-c", "ok")}<span>Up to date · 2 min ago</span></div>`;

  const ev = (e, o = {}) => {
    const [, s, en, t, k, place] = e;
    const top = ((s - H0) / (H1 - H0)) * 100, h = ((en - s) / (H1 - H0)) * 100;
    const short = en - s <= 0.5;
    return `<div class="cal-ev ${short ? "short" : ""} ${o.sel ? "sel" : ""} ${o.past ? "past" : ""}" style="top:${top}%;height:calc(${h}% - 2px);--cc:${cc(k)}"><b>${t}</b>${short ? `<span>${tm(s)}</span>` : `<span>${span(s, en)}</span>${place && en - s >= 1 ? `<span class="pl">${place}</span>` : ""}`}</div>`;
  };

  // A week (or five days) of columns: o = { days, sel, now }
  const grid = (o = {}) => {
    const days = o.days || DAYS;
    const n = days.length, first = days[0][1], last = days[n - 1][1];
    const col = (d) => d - first + 1;
    const ad = ALLDAY.filter(([a, b]) => b >= first && a <= last).map(([a, b, t, k, rem]) => {
      const s = Math.max(a, first), e = Math.min(b, last);
      return `<div class="cal-ad ${rem ? "rem" : ""}" style="grid-column:${col(s) + 1} / ${col(e) + 2};--cc:${cc(k)}">${rem ? `<span class="rb"></span>` : ""}${t}</div>`;
    }).join("");
    return `<div class="cal-week" style="--n:${n}">
      <div class="cal-dh"><span></span>${days.map(([w, d]) => `<div class="${d === TODAY ? "today" : ""}"><span class="w">${w}</span><span class="n">${d}</span></div>`).join("")}</div>
      <div class="cal-adrow"><span class="lab">All day</span>${ad}</div>
      <div class="cal-body">
        <div class="cal-hours">${Array.from({ length: H1 - H0 }, (_, i) => `<span>${hl(H0 + i)}</span>`).join("")}</div>
        ${days.map(([, d]) => `<div class="cal-col ${d === TODAY ? "today" : ""}">${EV.filter((e) => e[0] === d).map((e) => ev(e, { sel: o.sel === e[3] && d === (o.selDay || d), past: d < TODAY || (d === TODAY && e[2] <= 14.33) })).join("")}${d === TODAY ? `<div class="cal-now" style="top:${((14.33 - H0) / (H1 - H0)) * 100}%"></div>` : ""}</div>`).join("")}
      </div></div>`;
  };

  const hdrA = (o = {}) => header({
    icon: "calendar", name: "Calendar",
    start: `${btn("Today")}${ib("chev-l", "Previous (K)")}${ib("chev-r", "Next (J)")}<span class="cal-range">${o.range || (NW() ? "Nov 9 – 13" : "November 2026")}</span>`,
    center: seg(["Day", "Week", "Month", "Year", "Agenda"], o.view || "Week"),
    end: `${NW() ? "" : `<div class="search cal-qa">${icon("plus")}<span>Add “Lunch with Sam tomorrow at 1”</span></div>`}${ib("search", "Find events (Ctrl+F)")}<button class="newbtn">${icon("plus")}<span>New event</span>${NW() ? "" : `<span class="key">N</span>`}</button>`,
  });

  const pop = () => `<div class="cal-pop pop">
    <div class="ph"><span class="bar" style="background:${cc("work")}"></span><div><b>Roadmap workshop</b><span>Fri 13 Nov · 1:30–3:00 PM</span></div><span class="sp"></span>${ib("pen", "Edit (E)")}${ib("trash", "Delete")}${ib("more", "More")}</div>
    <div class="inv"><span>Ada Okafor invited you</span>${seg(["Going", "Maybe", "Not going"], "Going")}</div>
    ${btn("Join the video call", "primary", "video")}
    <div class="rows">
      <div class="r">${icon("mapin")}<span>Lumen HQ · Room 4B</span><a>Show on a map</a></div>
      <div class="r">${icon("users")}<span>6 people · 4 going, 1 maybe</span></div>
      <div class="ppl">${["Ada Okafor", "Sam Rivera", "Jordan Lee", "Priya Nair", "Lena Ortiz"].map((n) => av(n, 24)).join("")}<span class="more">+1</span></div>
      <div class="r">${icon("bell")}<span>10 minutes before</span></div>
      <div class="r">${icon("calendar")}<span>Work · Google</span></div>
      <div class="note">Bring the Q4 numbers. We'll pick the three bets for next quarter and who owns each one.</div>
    </div></div>`;

  const pageA = (o = {}) => `<div class="cal-wrap">${grid(o)}</div>${o.pop ? pop() : ""}`;
  const sideA = (o = {}) => `${mini()}${cals(o)}`;

  /* ── Option B: agenda and details ──────────────────────────────────── */
  const sideB = (on = "agenda") => `
    ${grp("Views", true, "", "accent")}
    ${navx("listic", "Agenda", { active: on === "agenda", cnt: 23 })}
    ${navx("daily", "Day")}
    ${navx("columns", "Week")}
    ${navx("calendar", "Month")}
    ${navx("grid", "Year")}
    ${grp("Google · alex.rivera", false, "", "blue")}
    ${navx("", "Work", { dot: cc("work") })}
    ${navx("", "Personal", { dot: cc("home") })}
    ${navx("", "Family", { dot: cc("family") })}
    ${navx("", "Holidays", { dot: cc("hol") })}
    ${navx("", "Reminders", { dot: cc("rem") })}
    ${grp("This computer", false, "", "green")}
    ${navx("", "Garden", { dot: cc("coral") })}
    ${navx("", "DevWorld 2026", { dot: cc("conf"), sub: "imported" })}
    <div class="foot">${icon("check-c", "ok")}<span>Up to date · 2 min ago</span></div>`;

  const AG = [
    ["Today", "Thursday 12 November", [[12, 9, 9.5, "Team standup", "work", "Repeats weekdays"], [12, 12.5, 13.5, "Lunch with Sam", "home", "Café Lumen"], [12, 15, 16, "Dentist", "home", "Dr. Patel, 2nd floor"], [12, 17.5, 18.5, "Pick up Maya", "family", "Westside Field"]]],
    ["Tomorrow", "Friday 13 November", [[13, 0, 0, "DevWorld 2026", "conf", "All day · day 1 of 2"], [13, 10, 11, "Interview: Lena Ortiz", "work", "Video call"], [13, 16, 17, "Friday demo", "work", ""]]],
    ["Saturday", "14 November", [[14, 9, 10.5, "Farmers market", "family", "Main Street"], [14, 13, 15, "Soccer: Maya vs. Hornets", "family", "Westside Field"]]],
    ["Monday", "16 November", [[16, 9, 9.5, "Team standup", "work", ""], [16, 14, 15.5, "Roadmap workshop", "work", "Lumen HQ · Room 4B"]]],
  ];
  const agenda = (sel) => `<div class="list cal-ag">
    <div class="lhead2"><b>Agenda</b><span class="c">Next 2 weeks · 23 events</span><span class="sp"></span>${ib("search", "Find events (Ctrl+F)")}</div>
    <div class="scroll">${AG.map(([d, sub, evs]) => `<div class="agd ${d === "Today" ? "today" : ""}"><b>${d}</b><span>${sub}</span></div>${evs.map(([, s, e, t, k, p]) => `<div class="agr ${t === sel ? "sel" : ""} ${d === "Today" && e <= 14.33 && e ? "past" : ""}"><span class="bar" style="background:${cc(k)}"></span><span class="tm">${s ? `${tm(s)}<small>${s >= 12 ? "PM" : "AM"}</small>` : "All day"}</span><div class="tx"><b>${t}</b>${p ? `<span>${p}</span>` : ""}</div>${t === "Roadmap workshop" ? `<span class="inv-dot" title="Waiting for your answer"></span>` : ""}</div>`).join("")}`).join("")}</div></div>`;

  const detail = () => `<div class="main cal-det">
    <div class="dbar">${btn("Edit", "", "pen")}${btn("Duplicate", "", "copy")}<span class="sp"></span>${ib("export", "Export as .ics")}${ib("trash", "Delete")}</div>
    <div class="scroll"><div class="dbody">
      <div class="tt"><span class="bar" style="background:${cc("work")}"></span><div><h1>Roadmap workshop</h1><div class="when">Monday 16 November · 2:00–3:30 PM <span class="tz">Central time</span></div></div></div>
      <div class="inv"><div><b>Ada Okafor invited you</b><span>She'd like an answer by Friday.</span></div><span class="sp"></span>${btn("Going", "primary", "check")}${btn("Maybe")}${btn("Not going")}</div>
      <div class="card cal-facts">
        <div class="r">${icon("video")}<div><b>Video call</b><span>meet.lumen.example/roadmap-q1</span></div>${btn("Join", "", "")}</div>
        <div class="r">${icon("mapin")}<div><b>Lumen HQ · Room 4B</b><span>200 Market Street</span></div>${btn("Show on a map")}</div>
        <div class="r">${icon("bell")}<div><b>10 minutes before</b><span>And at 9 AM on the day</span></div></div>
        <div class="r">${icon("calendar")}<div><b>Work</b><span>Google · alex.rivera</span></div></div>
      </div>
      <div class="lab">Who's coming <span>6 · 4 going, 1 maybe, 1 waiting</span></div>
      <div class="cal-people">${[["Ada Okafor", "Organizer"], ["Sam Rivera", "Going"], ["Jordan Lee", "Going"], ["Priya Nair", "Maybe"], ["Lena Ortiz", "Going"], ["You", "Waiting"]].map(([n, s]) => `<div class="p">${av(n === "You" ? "Alex Rivera" : n, 28)}<span>${n}</span><em class="${s.toLowerCase()}">${s}</em></div>`).join("")}</div>
      <div class="lab">Notes</div>
      <p class="nt">Bring the Q4 numbers. We'll pick the three bets for next quarter and who owns each one. Slides are in the shared folder.</p>
    </div></div></div>`;

  const qa = () => `<div class="cal-qpop pop">
    <div class="field focus">${icon("plus")}<span>Lunch with Sam tomorrow at 1 at Café Lumen</span></div>
    <div class="qres">
      <div class="qline"><span class="bar" style="background:${cc("home")}"></span><div><b>Lunch with Sam</b><span>Friday 13 November · 1:00–2:00 PM</span></div></div>
      <div class="qchips">${chip("Tomorrow, 1 PM", "", "calendar")}${chip("1 hour", "", "clock")}${chip("Café Lumen", "", "mapin")}${chip("Personal", "", "")}</div>
      <div class="qalt"><span>Or did you mean:</span>${chip("Friday 13 at 1 AM")}${chip("Every Friday at 1 PM", "", "repeat")}</div>
    </div>
    <div class="qbt">${btn("More options", "ghost", "sliders")}<span class="sp"></span>${btn("Add", "primary", "")}<span class="k">Enter</span></div>
  </div>`;

  const hdrB = () => header({
    icon: "calendar", name: "Calendar",
    start: `${btn("Today")}${ib("chev-l", "Earlier")}${ib("chev-r", "Later")}`,
    center: search(NW() ? "Find events" : "Find events in the next year", "Ctrl F"),
    end: `<button class="newbtn">${icon("plus")}<span>New event</span>${NW() ? "" : `<span class="key">N</span>`}</button>`,
  });

  /* ── Option C: month canvas ────────────────────────────────────────── */
  const MON = {
    2: [["10:00", "Book club", "family"]], 3: [["9:00", "Team standup", "work"], ["14:00", "Quarterly review", "work"]],
    4: [["9:00", "Team standup", "work"]], 5: [["9:00", "Team standup", "work"], ["19:00", "Parent night", "family"]],
    6: [["9:00", "Team standup", "work"]], 7: [["11:00", "Car service", "home"]],
    8: [["10:00", "Brunch with Priya", "family"]], 9: [["9:00", "Team standup", "work"], ["13:00", "Design review", "work"], ["18:00", "Climbing", "home"]],
    10: [["", "Renew passport", "rem"], ["9:00", "Team standup", "work"], ["11:00", "1:1 with Jordan", "work"], ["16:30", "Piano lesson", "family"]],
    11: [["", "Veterans Day", "hol"], ["9:00", "Team standup", "work"], ["14:00", "Roadmap workshop", "work"]],
    12: [["9:00", "Team standup", "work"], ["12:30", "Lunch with Sam", "home"], ["15:00", "Dentist", "home"], ["17:30", "Pick up Maya", "family"]],
    13: [["", "DevWorld 2026", "conf"], ["10:00", "Interview: Lena Ortiz", "work"], ["16:00", "Friday demo", "work"]],
    14: [["", "DevWorld 2026", "conf"], ["9:00", "Farmers market", "family"], ["13:00", "Soccer: Maya", "family"]],
    16: [["9:00", "Team standup", "work"]], 17: [["9:00", "Team standup", "work"], ["18:00", "Climbing", "home"]],
    18: [["9:00", "Team standup", "work"], ["12:00", "Lunch: design team", "work"]], 19: [["9:00", "Team standup", "work"]],
    20: [["9:00", "Team standup", "work"], ["20:00", "Concert: The Lanterns", "home"]], 21: [["", "Maya's birthday", "family"]],
    23: [["9:00", "Team standup", "work"]], 24: [["9:00", "Team standup", "work"]], 25: [["", "Travel to Mom's", "family"]],
    26: [["", "Thanksgiving", "hol"], ["", "Travel to Mom's", "family"]], 27: [["", "Travel to Mom's", "family"]],
    30: [["9:00", "Team standup", "work"], ["15:00", "Budget sign-off", "work"]],
  };
  const month = (o = {}) => {
    const max = o.max || 3;
    const cells = [];
    for (let i = 0; i < 35; i++) { const d = i + 1; cells.push(d <= 30 ? [d, true] : [d - 30, false]); }
    return `<div class="cal-month">
      <div class="mdh">${["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => `<span>${d}</span>`).join("")}</div>
      <div class="mgrid">${cells.map(([d, inm]) => {
        const evs = inm ? MON[d] || [] : [];
        const shown = evs.slice(0, evs.length > max ? max - 1 : max);
        return `<div class="mc ${inm ? "" : "out"} ${inm && d === TODAY ? "today" : ""} ${inm && d === o.sel ? "sel" : ""} ${inm && d < TODAY ? "past" : ""}"><span class="dn">${d === 1 && !inm ? "Dec 1" : d}</span>${shown.map(([t, n, k]) => t ? `<div class="me" style="--cc:${cc(k)}"><i></i><span class="t">${t}</span><span class="n">${n}</span></div>` : `<div class="me ad" style="--cc:${cc(k)}">${n}</div>`).join("")}${evs.length > shown.length ? `<div class="more">${evs.length - shown.length} more</div>` : ""}</div>`;
      }).join("")}</div></div>`;
  };
  const chipsC = () => `<div class="cal-chips">
    ${dd("Everything", "layers")}
    <span class="sep"></span>
    ${[["Work", "work"], ["Personal", "home"], ["Family", "family"], ["Holidays", "hol"], ["Reminders", "rem"], ["DevWorld 2026", "conf"], ["Garden", "coral", true]].map(([n, k, off]) => `<span class="cchip ${off ? "off" : ""}" style="--cc:${cc(k)}"><i></i>${n}</span>`).join("")}
    <span class="cchip off nmore" style="--cc:var(--text-tertiary)">3 more</span>
    <span class="sp"></span>
    <span class="sync">${icon("check-c")}Up to date</span>
  </div>`;
  const dayDrawer = () => `<div class="insp cal-day">
    <div class="dh"><div><b>Thursday 12</b><span>Today · 4 events</span></div><span class="sp"></span>${ib("x", "Close")}</div>
    <div class="field">${icon("plus")}<span class="ph">Add to this day…</span></div>
    <div class="dl">${MON[12].map(([t, n, k], i) => `<div class="de ${i < 2 ? "past" : ""} ${i === 2 ? "next" : ""}" style="--cc:${cc(k)}"><span class="bar"></span><div><b>${n}</b><span>${t} · ${EV.find((e) => e[0] === 12 && e[3] === n)[5] || "Repeats weekdays"}</span></div>${i === 2 ? `<span class="in">in 40 min</span>` : ""}</div>`).join("")}</div>
    <div class="lab">Coming up</div>
    <div class="dl sm">${[["Fri 13", "Interview: Lena Ortiz", "work"], ["Fri 13", "Friday demo", "work"], ["Sat 14", "Farmers market", "family"]].map(([d, n, k]) => `<div class="de" style="--cc:${cc(k)}"><span class="bar"></span><div><b>${n}</b><span>${d}</span></div></div>`).join("")}</div>
  </div>`;
  const hdrC = (view = "Month") => header({
    icon: "calendar", name: "Calendar",
    start: `${btn("Today")}${ib("chev-l", "Previous (K)")}${ib("chev-r", "Next (J)")}<span class="cal-range">${view === "Year" ? "2026" : NW() ? "Nov 2026" : "November 2026"}</span>`,
    center: seg(["Day", "Week", "Month", "Year", "Agenda"], view),
    end: `${ib("search", "Find events (Ctrl+F)")}<button class="newbtn">${icon("plus")}<span>New event</span>${NW() ? "" : `<span class="key">N</span>`}</button>`,
  });
  const year = () => {
    const names = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const load = (m, d) => { const h = hash(`${m}-${d}`) % 10; return m === 10 && d === TODAY ? "today" : h > 7 ? "b3" : h > 5 ? "b2" : h > 3 ? "b1" : ""; };
    return `<div class="cal-year">${names.map((n, m) => {
      const first = new Date(2026, m, 1).getDay(), len = new Date(2026, m + 1, 0).getDate();
      const past = m < 10;
      return `<div class="ym ${m === 10 ? "cur" : ""} ${past ? "past" : ""}"><b>${n}</b><div class="yg">${["S", "M", "T", "W", "T", "F", "S"].map((d) => `<span class="dw">${d}</span>`).join("")}${"<span></span>".repeat(first)}${Array.from({ length: len }, (_, i) => `<span class="yd ${load(m, i + 1)}">${i + 1}</span>`).join("")}</div></div>`;
    }).join("")}</div>
    <div class="cal-yfoot"><span>Busy days</span><i class="b1"></i><i class="b2"></i><i class="b3"></i><span class="sp"></span><span>Click a day to open it; double-click to add an event.</span></div>`;
  };

  REG("calendar", {
    name: "Calendar", accent: "red",
    summary: "Calendar has every view and a good editor, but the week opens as an empty dark grid with a red slab over today, the sidebar packs three kinds of calendar list into different shapes, and at 800 px the sidebar vanishes and seven squeezed days cut their events off.",
    problems: [
      "<b>Today looks selected, not marked:</b> the whole Thursday column is a dark red slab, so it reads as a selection and hides the hour lines under it.",
      "<b>No labelled way to add:</b> New event is a bare + in the corner next to Settings and the window controls; the quick “Lunch with Sam tomorrow at 1” box only shows after you press N.",
      "<b>Three calendar lists, three shapes:</b> the account's calendars are open rows, “On this computer” and “Imported (not syncing)” are collapsed one-liners with counts that get cut off (“Imported (not synci…”), and the account email is repeated as a calendar name.",
      "<b>Arrows without words:</b> ← ⌂ → sit in the header with no label; the house means Today, which you'd only find from the tooltip.",
      "<b>A status bar Design 2.0 dropped:</b> “Week 45 · 4 events” and a Refresh button sit at the foot of the sidebar, under the calendars.",
      "<b>Search lives in the sidebar</b> and only looks at this week until you press Enter, which the box doesn't say.",
      "<b>At 800 px</b> the sidebar disappears altogether (no mini month, no calendars to turn on or off) and seven columns squeeze all-day events to “Alabama Po…”, where Design 2.0 asks for five days.",
    ],
    today: [["calendar-1280", "Today at 1280 px", "Week view with the sidebar"], ["calendar-800", "Today at 800 px", "No sidebar; seven narrow days"]],
    options: [
      { id: "a", name: "Tidy week", idea: "The week view everyone knows, sorted out. Today is a red date and a now line rather than a slab. The header reads left to right: Today and the arrows, the view switch, then Quick add (“Lunch with Sam tomorrow at 1”) and a labelled New event. The sidebar keeps the mini month, then one coloured section per account, This computer and Imported, each as the same tick-box rows, with Sets as chips and sync at the foot. Clicking an event opens a popover that leads with your answer and Join the video call. At 800 px it shows five days and the sidebar slides over when you need it.",
        shots: [["a-week", "Week", "Mini month, calendars by account, quick add in the header"], ["a-event", "An invitation", "Going, Maybe or Not going; join the call; who's coming"], ["a-week-800", "At 800 px", "Five days; the sidebar tucks away"]] },
      { id: "b", name: "Agenda and details", idea: "A list of what's coming, with the event open beside it, like Mail. Views move into the sidebar (Agenda, Day, Week, Month, Year) above the calendars, so the header is free for a search that covers the whole year. Invitations waiting for an answer have a dot, and the details pane shows the answer buttons, the call, the place and who's coming. Quick add drops down from New event and shows how it read your words before it adds anything. Suits people who think in “what's next” rather than in grids.",
        shots: [["b-agenda", "Agenda", "Upcoming days on the left, the event on the right"], ["b-quickadd", "Quick add", "What it understood, with other readings to pick"], ["b-agenda-800", "At 800 px", "Icon rail with coloured bars; list and details"]] },
      { id: "c", name: "Month canvas", idea: "No sidebar: the month fills the window and calendars become a row of coloured chips under the header (click to show or hide; the Sets menu sits at the start). Clicking a day opens it in a drawer on the right with the day's events, a quick add for that day and what's coming next. The Year view becomes a year at a glance, shaded by how busy each day is. Best for planning weeks ahead and for people with few calendars.",
        shots: [["c-month", "Month", "Calendar chips; the chosen day in a drawer"], ["c-year", "Year", "Twelve months, shaded by how busy each day is"], ["c-month-800", "At 800 px", "The month alone; the drawer opens over it"]] },
    ],
    icons: {
      video: '<rect x="2.5" y="6" width="13" height="12" rx="2.5"/><path d="m15.5 10.5 6-3.5v10l-6-3.5"/>',
    },
    pages: {
      "a-week": () => win({ hdr: hdrA(), side: NW() ? "" : sideA(), page: pageA({ days: NW() ? DAYS.slice(1, 6) : DAYS }) }),
      "a-event": () => win({ hdr: hdrA(), side: sideA(), page: pageA({ sel: "Roadmap workshop", pop: true }) }),
      "b-agenda": () => win({ hdr: hdrB(), side: sideB(), page: `<div class="cols">${agenda("Roadmap workshop")}${detail()}</div>` }),
      "b-quickadd": () => win({ hdr: hdrB(), side: sideB(), page: `<div class="cols">${agenda("Roadmap workshop")}${detail()}</div>`, over: qa() }),
      "c-month": () => win({ hdr: hdrC(), side: "", page: `${chipsC()}<div class="cols"><div class="main">${month({ sel: TODAY, max: 4 })}</div>${NW() ? "" : dayDrawer()}</div>` }),
      "c-year": () => win({ hdr: hdrC("Year"), side: "", page: `${chipsC()}${year()}` }),
    },
  });
})();
