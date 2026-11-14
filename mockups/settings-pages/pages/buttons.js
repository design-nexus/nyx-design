// Round 3: button designs (?bt=NAME, styles in shell.css), up close and on round 2's pages.
(() => {
  const D = {
    bright: ["Bright primary", "Today's buttons with the primary's text in white rather than the near-black the accent uses now, which reads as dim on blue; plain buttons a step lighter.", "solid accent · white text"],
    tinted: ["Tinted", "Every button is a tint: the primary a strong tint of the accent with accent text, Remove a tint of red. Quiet pages where the switches and sliders carry the colour.", "accent tint · accent text"],
    satin: ["Satin", "Umbra's satin on plain buttons, and the primary a lit accent with a soft highlight. Pairs with the Satin switch, slider and radio.", "satin · lit accent primary"],
    outline: ["Outline", "Plain buttons are a hairline outline, the primary stays solid and Remove is outlined in red, so a page's one main action is unmistakable.", "hairline outline · solid primary"],
  };
  const v = () => Q.get("bt") || "bright";
  const B = (label, cls = "", ic = "") => btn(label, cls, ic);
  const rows = () => `
    ${ocard("Updates", [orow("<b>12 updates are ready</b>", "Omarchy 4.5.1 and 11 packages · 412 MB", B("Update now", "primary", "download"), { ic: "download", sec: "system" }), orow("Last checked", "10 minutes ago", B("Check now", "", "refresh"), { ic: "hist", sec: "system" })], { cls: "icons" })}
    ${ocard("Maintenance", [orow("Package keys", "Fix \"invalid signature\" errors", B("Refresh")), orow("Unused packages", "6 packages nothing needs · 210 MB", B("Remove 6", "danger")), orow("Firmware", "Needs the power cable", B("Check", "dis"))])}`;
  const page = () => {
    const [name, idea, spec] = D[v()];
    return ctlSpec({ sec: "system", page: "Software", desc: "Apps, packages, updates and maintenance.", rows: rows(), title: name, spec, idea, zoom: 1.5, n: 3,
      states: [["Main action", B("Update", "primary", "download")], ["Plain", B("Check now")], ["Quiet", B("What's new", "ghost")], ["Remove", B("Remove", "danger")], ["Can't press", B("Check", "dis")], ["Keyboard focus", B("Update", "primary focus")]],
      real: [["At its real size", `${B("What's new", "ghost")}${B("Check now")}${B("Update now", "primary", "download")}`]] });
  };
  REG("buttons", {
    name: "Buttons",
    summary: "Four button designs. Today's primary button is the accent with near-black text, which reads as dim on blue in dark themes, and plain buttons are close to the card's colour.",
    problems: [
      "<b>The main button looks dim:</b> near-black text on the accent blue.",
      "<b>Plain buttons barely show</b> on a card in dark themes, and look like dropdowns and fields.",
      "<b>Remove looks like any other button</b> until it's pressed once.",
    ],
    today: [["../shots/home-a-dash-dark", "Today's buttons on Home A", ""]],
    options: Object.entries(D).map(([k, [name, idea]], i) => {
      const o = "abcd"[i];
      const [src, title] = [["home/a-dash", "Home"], ["nyxos-apply/c-failed", "Applying changes"], ["software/c-updates", "Software"], ["printers/a-list", "Printers"]][i];
      const shots = [[`${o}-spec`, "Up close, on Software", "", `buttons/spec?bt=${k}&look=tile`], [`${o}-page`, `On ${title}`, "", `${src}?bt=${k}&look=tile`]];
      if (i === 0) shots.push([`${o}-page-800`, "Home at 800 px", "", `home/a-dash?bt=${k}&look=tile`]);
      return { id: o, name, idea, shots };
    }),
    pages: { spec: page },
  });
})();
