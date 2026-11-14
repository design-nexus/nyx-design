// Round 3: segmented control designs (?sg=NAME, styles in shell.css), up close and on round 2's pages.
(() => {
  const D = {
    raised: ["Raised (today's, kept)", "Today's control, which already follows Design 2.0: a field track and a raised chosen segment with a soft shadow. Shown here beside the switches and sliders it would sit next to.", "field track · raised segment"],
    tinted: ["Tinted", "The chosen segment is a tint of the accent with an accent outline, like a selected row and the Tinted switch and radio.", "field track · accent tint"],
    solid: ["Solid pill", "A pill track with the chosen segment in the solid accent: the clearest, and the loudest; best kept for a page's one main choice.", "pill · solid accent"],
    outline: ["Outline", "No track: the segments are joined boxes with hairlines between them, and the chosen one is outlined in the accent.", "hairline boxes · accent outline"],
    underline: ["Underline", "Words in a row with the chosen one underlined in the accent, like the page tabs; the lightest, for switching what a preview shows.", "text · 2 px accent underline"],
  };
  const v = () => Q.get("sg") || "tinted";
  const G = (items, on, cls = "") => seg(items, on).replace('class="seg"', `class="seg ${cls}"`);
  const rows = () => `
    ${ocard("Look", [
      orow("Style", "", G(["Light", "Dark", "Auto"], "Dark"), { ic: "palette", sec: "personalization" }),
      orow("Density", "How much fits on a screen.", G(["Compact", "Comfortable"], "Comfortable"), { ic: "grid", sec: "personalization" }),
      orow("Corners", "", G(["Square", "Round", "Rounder"], "Round"), { ic: "window", sec: "personalization" }),
    ], { cls: "icons" })}
    ${ocard("Text", [orow("Size", "", G(["S", "M", "L", "XL"], "M"), { ic: "eye2", sec: "personalization" }), orow("Interface font", "Set by your theme", G(["Inter", "System"], "Inter", "dis"), { ic: "file-text", sec: "personalization" })], { cls: "icons" })}`;
  const page = () => {
    const [name, idea, spec] = D[v()];
    return ctlSpec({ sec: "personalization", page: "Appearance", desc: "Theme, wallpaper, fonts and icons.", rows: rows(), title: name, spec, idea, zoom: 1.5, n: 2, today: v() !== "raised",
      states: [["Two choices", G(["Off", "On"], "On")], ["Three choices", G(["Saver", "Balanced", "Fast"], "Balanced")], ["Can't change", G(["Saver", "Balanced", "Fast"], "Balanced", "dis")], ["Keyboard focus", G(["Day", "Night"], "Night", "focus")]],
      real: [["At its real size", G(["Saver", "Balanced", "Performance"], "Balanced")]].concat(v() === "raised" ? [] : [["Today's segmented control", '<span class="was-sg"><b>Saver</b><b class="on">Balanced</b><b>Performance</b></span>']]) });
  };
  REG("segmented", {
    name: "Segmented controls",
    summary: "Today's segmented control already follows Design 2.0 (a field track and a raised segment); these are four alternatives, so it matches whichever switch you pick.",
    problems: [
      "<b>The chosen segment is subtle in dark themes:</b> a raised grey on a grey track, with no accent.",
      "<b>It may stop matching:</b> once switches and radios take a tint or satin, the raised segment is the odd one out.",
    ],
    today: [["../shots/displays-a-desk-dark", "Today's segmented controls on Displays A", ""]],
    options: Object.entries(D).map(([k, [name, idea]], i) => {
      const o = "abcde"[i];
      const [src, title] = [["displays/a-desk", "Displays"], ["assistant-voice/a", "Voice"], ["switcher/a-desk", "Switcher"], ["displays/a-desk", "Displays"], ["assistant-voice/a", "Voice"]][i];
      const shots = [[`${o}-spec`, "Up close, on Appearance", "", `segmented/spec?sg=${k}&look=tile`], [`${o}-page`, `On ${title}`, "", `${src}?sg=${k}&look=tile`]];
      if (i === 1) shots.push([`${o}-page-800`, "Displays at 800 px", "", `displays/a-desk?sg=${k}&look=tile`]);
      return { id: o, name, idea, shots };
    }),
    pages: { spec: page },
  });
})();
