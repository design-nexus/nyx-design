// Round 3: dropdown designs (?dd=NAME, styles in shell.css), up close and on round 2's pages.
(() => {
  const D = {
    raised: ["Raised", "Drawn like a button, raised off the card, with the chevron behind a hairline so it reads as \"press to choose\". The open list hangs from it with a check beside the current choice.", "28 px · raised · split chevron"],
    quiet: ["Quiet", "No box until you point at it: the value in medium weight and an accent chevron. The calmest row, and the value reads as part of the sentence.", "the value and a chevron · box on hover"],
    underline: ["Underline", "The value over a hairline that turns the accent while the list is open, like a form field.", "hairline under · accent while open"],
    tinted: ["Tinted", "Today's field with a light accent tint and an accent chevron, so a choice you can change stands out from read-only values.", "28 px · accent tint"],
  };
  const v = () => Q.get("dd") || "raised";
  const DD = (label, cls = "", ic = "") => dd(label, ic).replace('class="dd"', `class="dd ${cls}"`);
  const rows = () => `
    ${ocard("Laptop screen", [
      orow("Resolution", "", DD("2880 × 1800"), { ic: "monitor" }),
      orow("Refresh rate", "", DD("120 Hz"), { ic: "refresh" }),
      orow("Scale", "Bigger text and controls", DD("175%"), { ic: "scale" }),
      orow("Rotation", "", DD("Normal"), { ic: "rotate" }),
    ], { cls: "icons" })}
    ${ocard("Studio 27", [orow("Resolution", "Set by the screen", DD("3840 × 2160", "dis"), { ic: "monitor" }), orow("Colour profile", "", DD("sRGB"), { ic: "palette" })], { cls: "icons" })}`;
  const open = () => `<div class="ddopen card"><div class="ddrow"><span>Scale</span>${DD("175%", "focus")}</div>
      ${menu(0, 0, [["", "125%"], ["", "150%"], ["check", "175%", "Recommended", "check"], ["", "200%"]], 200).replace('class="menu pop"', 'class="menu pop ddm"')}</div>`;
  const page = () => {
    const [name, idea, spec] = D[v()];
    return ctlSpec({ sec: "hardware", page: "Displays", desc: "Resolution, scale, brightness and how the screens sit.", rows: rows(), title: name, spec, idea: "", zoom: 1.3, n: 4, today: true,
      states: [["Closed", DD("175%")], ["Pointed at", DD("175%", "hover")], ["Open", DD("175%", "focus")], ["Can't change", DD("175%", "dis")]],
      real: [["At its real size", `${DD("2880 × 1800")}${DD("Normal")}`], ["Today's dropdown", '<span class="was-dd">2880 × 1800 ▾</span>']],
      extra: open() });
  };
  REG("dropdowns", {
    name: "Dropdowns",
    summary: "Four dropdown designs. Today's is a field-coloured box with a hairline and a grey chevron, the same as a text field, so a choice and a box to type in look alike.",
    problems: [
      "<b>Looks like a text field:</b> the same fill, hairline and radius, so it isn't clear you press it rather than type in it.",
      "<b>Heavy in long cards:</b> Displays and Power have ten or more, a column of boxes down the right side.",
      "<b>Read-only values and choices look the same.</b>",
    ],
    today: [["../shots/displays-a-desk-dark", "Today's dropdowns on Displays A", ""]],
    options: Object.entries(D).map(([k, [name, idea]], i) => {
      const o = "abcd"[i];
      const [src, title] = [["displays/a-desk", "Displays"], ["power/a-battery", "Power & Battery"], ["keyboard/a-picture", "Keyboard"], ["audio/a-eq", "Sound"]][i];
      const shots = [[`${o}-spec`, "Up close, on Displays", "", `dropdowns/spec?dd=${k}&look=tile`], [`${o}-page`, `On ${title}`, "", `${src}?dd=${k}&look=tile`]];
      if (i === 0) shots.push([`${o}-page-800`, "Displays at 800 px", "", `displays/a-desk?dd=${k}&look=tile`]);
      return { id: o, name, idea, shots };
    }),
    pages: { spec: page },
  });
})();
