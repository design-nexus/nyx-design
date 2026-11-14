// Round 3: text field designs (?fd=NAME, styles in shell.css), up close and on round 2's pages.
(() => {
  const D = {
    sunken: ["Sunken", "The field sinks into the card: darker than it, with a soft inner shadow and a hairline, so it reads as a place to type. Focus outlines it in the accent.", "32 px · darker fill · inner shadow"],
    outline: ["Outline", "No fill, a hairline outline; focus turns it the accent. Light and modern, and clearly different from the raised buttons and dropdowns.", "32 px · hairline outline"],
    underline: ["Underline", "Just a line under the text, which turns the accent while you type; for forms (adding a person, an account) more than search.", "a line under · accent while typing"],
    pill: ["Pill", "Today's field fill in a pill, matching the pill switches; good for search fields especially.", "32 px · pill"],
  };
  const v = () => Q.get("fd") || "sunken";
  const F = (text, o = {}) => `<div class="field ${o.cls || ""}" style="width:${typeof o.w === "string" ? o.w : (o.w || 150) + "px"}">${o.ic ? icon(o.ic) : ""}${text ? `<span>${text}</span>` : `<span class="ph">${o.ph || "Full name"}</span>`}${o.cls === "focus" ? '<span class="caret"></span>' : ""}</div>`;
  const rows = () => `
    ${ocard("A new person", [
      `<div class="frow"><label>Full name</label>${F("Rina Park", { w: "100%" })}</div>`,
      `<div class="frow"><label>Login name</label>${F("rina", { w: "100%", cls: "focus" })}<small>Lowercase letters and digits; it can't be changed later.</small></div>`,
      `<div class="frow"><label>Password</label>${F("••••", { w: "100%", cls: "err" })}<small class="er">At least 8 characters.</small></div>`,
      `<div class="frow"><label>Home folder</label>${F("/home/rina", { w: "100%", cls: "dis" })}</div>`,
    ])}
    ${ocard("", [`<div class="frow"><label>Search shortcuts</label>${F("", { w: "100%", ic: "search", ph: "Search, or press the keys" })}</div>`])}`;
  const page = () => {
    const [name, idea, spec] = D[v()];
    return ctlSpec({ sec: "accounts", page: "Users", desc: "The people who use this computer.", rows: rows(), title: name, spec, idea, zoom: 1.25, n: 2, today: true,
      states: [["Empty", F("", { ph: "Full name" })], ["Filled", F("Rina Park")], ["Typing", F("Rina P", { cls: "focus" })], ["Wrong", F("••••", { cls: "err" })], ["Can't change", F("/home/rina", { cls: "dis" })], ["Search", F("", { ic: "search", ph: "Search" })]],
      real: [["At its real size", F("Rina Park", { w: 200 })], ["Today's text field", `<span class="was-fd">Rina Park</span>`]] });
  };
  REG("fields", {
    name: "Text fields",
    summary: "Four text field designs. Today's field is the same fill, hairline and radius as a dropdown and a button, so the three are hard to tell apart.",
    problems: [
      "<b>Looks like a dropdown and a button:</b> nothing says \"type here\".",
      "<b>Errors have nowhere to go:</b> a wrong value is a toast, not a mark on the field.",
      "<b>Focus is a soft glow</b> that's hard to see in light themes.",
    ],
    today: [["../shots/nyxos-users-c-add-dark", "Today's fields on NyxOS › Users, adding a person", ""]],
    options: Object.entries(D).map(([k, [name, idea]], i) => {
      const o = "abcd"[i];
      const [src, title] = [["nyxos-users/c-add", "NyxOS › Users"], ["keybindings/b-add", "Keyboard Shortcuts"], ["rules/b-add", "Startup & Rules"], ["keybindings/b-add", "Keyboard Shortcuts"]][i];
      const shots = [[`${o}-spec`, "Up close, on Users", "", `fields/spec?fd=${k}&look=tile`], [`${o}-page`, `On ${title}`, "", `${src}?fd=${k}&look=tile`]];
      if (i === 0) shots.push([`${o}-spec-800`, "Users at 800 px", "", `fields/spec?fd=${k}&look=tile`]);
      return { id: o, name, idea, shots };
    }),
    pages: { spec: page },
  });
})();
