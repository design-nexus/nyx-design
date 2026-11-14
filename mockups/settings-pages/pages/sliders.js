// Round 3: slider designs (?sl=NAME, styles in shell.css), up close and on round 2's pages.
(() => {
  const D = {
    bar: ["Bar", "A filled bar the height of a button, drawn like the segmented control's track: the accent tint fills it up to a slim handle. Easy to hit, and the value reads as an amount at a glance.", "22 px bar · radius 7 · 4 × 12 handle"],
    tinted: ["Tinted", "A soft 6 px track with the accent fill and an accent knob, ringed by the card it sits on so it lifts off the track without a white blob.", "6 px track · 14 px accent knob with a ring"],
    satin: ["Satin", "Umbra's satin as a groove: a lit accent fill with a soft glow, and a satin knob. Pairs with the Satin switch.", "8 px groove · 18 px satin knob"],
    split: ["Split", "A thick track cut by a tall thin handle, the accent before it and a tint after, as newer phone systems draw them. The handle shows exactly where the value is.", "14 px track · 4 × 26 handle with a gap"],
    ticks: ["Ticks", "Today's thin line with a dot at each step and a raised knob outlined in the accent, for values that move in steps (volume, scale, warmth).", "4 px track · step dots · 18 px knob"],
  };
  const v = () => Q.get("sl") || "tinted";
  const S = (pct, w, cls = "") => slider(pct, w).replace('class="slider"', `class="slider ${cls}"`);
  const rows = () => `
    ${ocard("Output", [
      orow("Volume", "", `<span class="slw">${S(64, 130)}<span class="readout">64%</span></span>`, { ic: "volume" }),
      orow("Maximum volume", "The volume keys stop here.", `<span class="slw">${S(40, 130)}<span class="readout">100%</span></span>`, { ic: "speaker" }),
      orow("Balance", "", `<span class="slw"><small class="dim">L</small>${S(50, 110)}<small class="dim">R</small></span>`, { ic: "headphones" }),
    ], { cls: "icons" })}
    ${ocard("Microphone", [
      orow("Input level", "", `<span class="slw">${S(72, 130)}<span class="readout">72%</span></span>`, { ic: "mic" }),
      orow("Noise reduction", "Set by your administrator", `<span class="slw">${S(30, 130, "dis")}<span class="readout">Low</span></span>`, { ic: "sliders" }),
    ], { cls: "icons" })}`;
  const page = () => {
    const [name, idea, spec] = D[v()];
    return ctlSpec({ sec: "hardware", page: "Sound", desc: "Output, volume, the equalizer and the microphone.", rows: rows(), title: name, spec, idea, zoom: 2, today: true,
      states: [["Empty", S(0, 70)], ["Partway", S(45, 70)], ["Full", S(100, 70)], ["Can't change", S(45, 70, "dis")], ["Keyboard focus", S(45, 70, "focus")], ["Narrow", S(60, 40)]], n: 3,
      real: [["At its real size", S(64, 180)], ["Today's slider", '<span class="was-sl"></span>']],
      foot: "Sliders fill with the theme's accent everywhere; the readout sits to the right of the track." });
  };
  REG("sliders", {
    name: "Sliders",
    summary: "Five slider designs to go with the new switches: today's is a thin accent line with a white knob, the same flat look as today's switch. Each is shown up close and on a page from round 2.",
    problems: [
      "<b>A white knob on a thin line:</b> the knob is the brightest thing in the row, and the 4 px track is hard to see on a card in dark themes.",
      "<b>Doesn't say what it is:</b> nothing tells a volume (an amount) from a balance (a position) or a scale (steps).",
      "<b>A slider you can't change looks like one you can.</b>",
    ],
    today: [["../shots/audio-a-eq-dark", "Today's slider on Sound A", ""]],
    options: Object.entries(D).map(([k, [name, idea]], i) => {
      const o = "abcde"[i];
      const src = ["audio/a-eq", "power/a-battery", "assistant-voice/a", "keyboard/a-picture", "assistant-appearance/a"][i];
      const shots = [[`${o}-spec`, "Up close", "", `sliders/spec?sl=${k}&look=tile`], [`${o}-page`, `On ${["Sound", "Power & Battery", "Voice", "Keyboard", "Aura"][i]}`, "", `${src}?sl=${k}&look=tile`]];
      if (i === 0) shots.push([`${o}-page-800`, "Sound at 800 px", "", `audio/a-eq?sl=${k}&look=tile`]);
      return { id: o, name, idea, shots };
    }),
    pages: { spec: page },
  });
})();
