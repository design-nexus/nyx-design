// Round 3: checkbox designs (?cb=NAME, styles in shell.css), up close and on round 2's pages.
(() => {
  const D = {
    field: ["Field", "Off is a soft filled square with a hairline, like the fields and the Filled radio; on is the accent with a check in the accent's text colour.", "18 px · radius 5 · accent on"],
    tinted: ["Tinted", "On is a tint of the accent with an accent outline and check: the same family as the Tinted switch and radio.", "18 px · 1.5 px outline · tint on"],
    satin: ["Satin", "An Umbra satin square; on, a lit accent with a soft glow. Pairs with the Satin switch, slider and radio.", "18 px satin · lit on"],
    round: ["Round", "A circle that fills with the accent and a check, the way tasks are ticked off in Reminders; it suits lists of things more than settings.", "18 px circle"],
  };
  const v = () => Q.get("cb") || "tinted";
  const C = (on, cls = "") => `<span class="cbx sq ${on ? "done" : ""} ${cls}">${on ? icon("check") : ""}</span>`;
  const row = (on, t, d, s, cls = "") => `<div class="opt">${C(on, cls)}<div class="opt-text"><div>${t}</div><div class="d">${d}</div></div><span class="rv">${s}</span></div>`;
  const rows = () => `
    <div class="ubar card">${C(true)}<div class="opt-text"><div><b>9 of 12 updates</b> chosen</div><div class="d">390 MB · about 3 minutes</div></div>${btn("Update", "primary", "download")}</div>
    ${ocard("Packages", [row(true, "Linux kernel", "7.2.8 → 7.2.9 · restart needed", "142 MB"), row(true, "Mesa", "26.1.1 → 26.1.2", "38 MB"), row(false, "Firefox", "151.0 → 151.0.2", "88 MB"), row(true, "PipeWire", "1.6.2 → 1.6.3", "4 MB"), row(true, "OpenSSL", "Security fix, always installed", "7 MB", "dis")])}`;
  const page = () => {
    const [name, idea, spec] = D[v()];
    return ctlSpec({ sec: "system", page: "Updates", desc: "Omarchy, packages, the AUR and firmware.", rows: rows(), title: name, spec, idea, today: true,
      states: [["Off", C(false)], ["On", C(true)], ["Off, can't change", C(false, "dis")], ["On, can't change", C(true, "dis")], ["Keyboard focus", C(true, "focus")]],
      real: [["At its real size", `${C(true)}${C(false)}${C(true)}`], ["Today's checkbox", `<span class="was-cb on">${icon("check")}</span><span class="was-cb"></span><span class="was-cb on">${icon("check")}</span>`]],
      foot: "Settings uses checkboxes only for picking several things from a list; a setting that turns on or off is a switch." });
  };
  REG("checkboxes", {
    name: "Checkboxes",
    summary: "Four checkbox designs to match the switches and radio buttons. Today's is a grey outline that fills with the accent.",
    problems: [
      "<b>Faint when off,</b> like the radio buttons: a 1.5 px grey outline on a dark card.",
      "<b>A different family from the switch:</b> once the switch changes, today's checkbox no longer matches it.",
      "<b>Disabled looks like off.</b>",
    ],
    today: [["../shots/styles-b-updates-dark", "Today's checkboxes on Updates (round 1, style B)", ""]],
    options: Object.entries(D).map(([k, [name, idea]], i) => {
      const o = "abcd"[i];
      const shots = [[`${o}-spec`, "Up close, on Updates", "", `checkboxes/spec?cb=${k}&look=tile`], [`${o}-page`, "On Updates (round 1)", "", `styles/b-updates?cb=${k}&look=tile`]];
      if (i === 1) shots.push([`${o}-spec-800`, "Updates at 800 px", "", `checkboxes/spec?cb=${k}&look=tile`]);
      return { id: o, name, idea, shots };
    }),
    pages: { spec: page },
  });
})();
