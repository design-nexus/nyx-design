// Round 3: switch designs. Each is a class on the page (?sw=NAME, styles in shell.css), so the
// same design can be drawn on any page here; this tab's own screen shows one up close.
(() => {
  const D = {
    segment: ["Segment", "Drawn like the segmented control: a field track with a hairline and the small radius, a raised knob. On, the knob turns the accent and the track takes a tint of it.", "38 × 22 · radius 7 · knob 16, radius 5"],
    tinted: ["Tinted", "Today's pill, quieter: off is the field with a dim knob; on is a soft tint of the accent with an accent knob, the way a selected row is drawn.", "36 × 20 · pill · knob 14"],
    satin: ["Satin", "The Umbra tile as a pill: a satin track with a hairline rim. On, the rim and a glow behind the knob take the accent, and the knob is the accent, softly lit.", "38 × 22 · pill · knob 16"],
    marked: ["Marked", "Today's shape with a raised knob. On, the track is the accent sunk into the background and the knob carries a check, so on and off differ by more than colour.", "40 × 22 · pill · knob 16 with a check"],
    rail: ["Rail", "A slim rail and a larger raised knob that sits over it. On, the rail tints and the knob is the accent: the knob is what you see.", "34 × 20 · rail 8 · knob 18"],
  };
  const v = () => Q.get("sw") || "tinted";
  const S = (on, cls = "") => `<span class="switch ${on ? "on" : ""} ${cls}"></span>`;
  const old = (on) => `<span class="oldsw ${on ? "on" : ""}"></span>`;

  const rows = () => `
    ${ocard("", [orow("<b>Do not disturb</b>", "Pop-ups wait in the Notification Center until you turn it off.", S(false), { ic: "bell", sec: "desktop" })], { cls: "icons" })}
    ${ocard("Pop-ups", [
      orow("Show pop-ups", "In the top-right corner of the screen you're using.", S(true), { ic: "bell", sec: "desktop" }),
      orow("On the lock screen", "Only the app's name, not what it says.", S(false), { ic: "lock", sec: "desktop" }),
      orow("Play a sound", "", S(true), { ic: "volume", sec: "desktop" }),
      orow("Keep important ones until I close them", "", S(true), { ic: "star", sec: "desktop" }),
    ], { cls: "icons" })}
    ${ocard("Apps", [
      orow("Mail", "Pop-ups and a sound", S(true), { ic: "mail", sec: "desktop" }),
      orow("Calendar", "Pop-ups only", S(true), { ic: "calendar", sec: "desktop" }),
      orow("Updates", "Managed by your administrator", S(true, "dis"), { ic: "download", sec: "desktop" }),
    ], { cls: "icons" })}`;

  const up = () => {
    const [name, idea, spec] = D[v()];
    const col = (label, sw) => `<div class="spc"><div class="big">${sw}</div><small>${label}</small></div>`;
    return `${pvhead(`${name}, up close`, spec)}
      <div class="card spk2">
        <div class="spr">${col("Off", S(false))}${col("On", S(true))}${col("Off, can't change", S(false, "dis"))}${col("On, can't change", S(true, "dis"))}${col("Keyboard focus", S(true, "focus"))}</div>
      </div>
      <div class="card spk3">
        <div class="sl1"><b>At its real size</b><span>${S(false)}${S(true)}</span></div>
        <div class="sl1 was"><b>Today's switch</b><span>${old(false)}${old(true)}</span></div>
      </div>
      <p class="spidea">${idea}</p>
      ${pvfoot("Switches follow the accent of the theme; they never take a section's colour, so on always looks the same.", "info")}`;
  };

  REG("switches", {
    name: "Switches",
    summary: "Five switch designs for Design 2.0, to replace today's bright accent pill with a white knob. Each is shown up close in every state, and on a real page from round 2 (with Umbra tiles), in dark and light.",
    problems: [
      "<b>Loudest thing on the page:</b> a solid accent pill with a white knob outshines the content; a card of six switches is six bright blue blobs.",
      "<b>Doesn't match the rest of 2.0:</b> buttons, fields and the segmented control are quiet fills with hairlines and a raised part; the switch is the only flat, saturated shape.",
      "<b>On and off differ only by colour</b>, and a switch you can't change looks like an off one.",
    ],
    today: [["../shots/audio-a-eq-dark", "Today's switch on Sound A", "The accent pill with a white knob"]],
    options: [
      { id: "a", name: "Segment", idea: D.segment[1], shots: [["a-spec", "Up close", "", "switches/spec?sw=segment&look=tile"], ["a-page", "On Notifications", "", "notifications/a-corner?sw=segment&look=tile"], ["a-page-800", "Control Center at 800 px", "", "control-center/a-panel?sw=segment&look=tile"]] },
      { id: "b", name: "Tinted", idea: D.tinted[1], shots: [["b-spec", "Up close", "", "switches/spec?sw=tinted&look=tile"], ["b-page", "On Trackpad", "", "trackpad/a-gestures?sw=tinted&look=tile"]] },
      { id: "c", name: "Satin", idea: D.satin[1], shots: [["c-spec", "Up close", "", "switches/spec?sw=satin&look=tile"], ["c-page", "On Window Style", "", "look/a?sw=satin&look=tile"]] },
      { id: "d", name: "Marked", idea: D.marked[1], shots: [["d-spec", "Up close", "", "switches/spec?sw=marked&look=tile"], ["d-page", "On Control Center", "", "control-center/a-panel?sw=marked&look=tile"]] },
      { id: "e", name: "Rail", idea: D.rail[1], shots: [["e-spec", "Up close", "", "switches/spec?sw=rail&look=tile"], ["e-page", "On Lock Screen", "", "idle/a-timeline?sw=rail&look=tile"]] },
    ],
    pages: {
      spec: () => swin({ sec: "desktop", page: "Notifications", desc: "Pop-ups, sounds, Do not disturb and what each app may show.", body: split(rows(), up(), { sec: "desktop" }) }),
    },
  });
})();
