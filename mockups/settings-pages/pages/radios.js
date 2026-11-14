// Round 3: radio button designs (?rd=NAME, styles in shell.css), up close and on round 2's pages.
(() => {
  const D = {
    filled: ["Filled", "Off is a soft filled circle with a hairline, like the fields; on fills with the accent around a dot in the colour the accent's text uses. Reads at a glance, even small.", "18 px · hairline off · accent fill on"],
    tinted: ["Tinted", "On is a tint of the accent with an accent ring and dot, the way a selected row and the Tinted switch are drawn: present but not loud.", "18 px · 1.5 px ring · tint on"],
    satin: ["Satin", "An Umbra satin bead; on, a soft accent glow and a lit dot. Pairs with the Satin switch and slider.", "18 px satin · lit dot"],
    check: ["Check", "On is an accent disc with a check, the same mark a dropdown puts beside its current choice, so a chosen option looks the same everywhere.", "18 px · accent disc with a check"],
    cards: ["Choice rows", "No circles: the options are rows, and the chosen one is tinted and outlined with a check at its end. Best for short lists of choices with a line of explanation each.", "the row is the control · check at the end"],
  };
  const v = () => Q.get("rd") || "tinted";
  const R = (on, cls = "") => `<span class="rad ${on ? "on" : ""} ${cls}"></span>`;
  const row = (on, t, d, ic) => `<div class="opt">${R(on)}<span class="lic" style="--tc:var(--sec-hardware)">${icon(ic)}</span><div class="opt-text"><div>${t}</div><div class="d">${d}</div></div></div>`;
  const rows = () => `
    ${ocard("When the lid closes", [row(true, "Sleep", "Wakes in a second; uses a little battery.", "moon"), row(false, "Hibernate", "Saves everything to the disk and turns off.", "drive"), row(false, "Lock the screen", "Keeps running, with the screen off.", "lock"), row(false, "Do nothing", "For when an external screen is connected.", "monitor")], { cls: "icons" })}
    ${ocard("Power profile", [row(false, "Saver", "Slower, and the battery lasts about 2 hours longer.", "battery"), row(true, "Balanced", "Fast when you need it.", "sliders"), row(false, "Performance", "Fastest; the fans run more.", "cpu")], { cls: "icons" })}`;
  const page = () => {
    const [name, idea, spec] = D[v()];
    return ctlSpec({ sec: "hardware", page: "Power & Battery", desc: "Profiles, the battery, and what the lid and buttons do.", rows: rows(), title: name, spec, idea, today: true,
      states: [["Off", R(false)], ["On", R(true)], ["Off, can't change", R(false, "dis")], ["On, can't change", R(true, "dis")], ["Keyboard focus", R(true, "focus")]],
      real: [["At its real size", `${R(true)}${R(false)}${R(false)}`], ["Today's radio button", '<span class="was-rd on"></span><span class="was-rd"></span><span class="was-rd"></span>']],
      foot: v() === "cards" ? "Up close the rows aren't drawn, so the states show only the check; see it on Power & Battery to the left." : "Radio buttons sit at the start of their row, before its icon." });
  };
  REG("radios", {
    name: "Radio buttons",
    summary: "Five radio button designs to match the new switches. Today's is a thin grey ring that turns into an accent ring and dot. Each is shown up close and on round 2's pages.",
    problems: [
      "<b>Faint when off:</b> a 1.5 px grey ring on a dark card is easy to miss, so a list of choices looks like plain text.",
      "<b>Two marks for one idea:</b> radio buttons use a dot, dropdowns a check, picked rows a tint.",
      "<b>Disabled looks like off.</b>",
    ],
    today: [["../shots/audio-a-eq-dark", "Today's radio buttons on Sound A", "Plays through"]],
    options: Object.entries(D).map(([k, [name, idea]], i) => {
      const o = "abcde"[i];
      const [src, title] = [["audio/a-eq", "Sound"], ["assistant-appearance/a", "Aura"], ["capture/a-shot", "Capture & Tools"], ["dock/a-desk", "Dock"], ["audio/a-eq", "Sound"]][i];
      const shots = [[`${o}-spec`, "Up close, on Power & Battery", "", `radios/spec?rd=${k}&look=tile`], [`${o}-page`, `On ${title}`, "", `${src}?rd=${k}&look=tile`]];
      if (i === 4) shots.push([`${o}-spec-800`, "Power & Battery at 800 px", "", `radios/spec?rd=${k}&look=tile`]);
      return { id: o, name, idea, shots };
    }),
    pages: { spec: page },
  });
})();
