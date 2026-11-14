// Accounts › Sign-in & Security: face, fingerprint and security keys (through nyx-authctl), and where each one signs you in.
(() => {
  const sec = "accounts";
  const page = (ctl, pv, ctlw) => () => swin({ sec, page: "Sign-in & Security", desc: "Face, fingerprint and security keys, and where each one signs you in.", body: split(ctl(), pv(), { sec, ctlw }) });
  const M = [["face", "Face"], ["finger", "Fingerprint"], ["skey", "Security key"], ["key", "Password"]];
  // [icon, place, what it is, methods on, state]
  const PLACES = [
    ["user", "Login", "After you log out or restart", ["face", "key"], "ok"],
    ["lock", "Lock screen", "When the screen locks", ["face", "finger", "key"], "ok"],
    ["terminal", "Terminal (sudo)", "Commands that need an administrator", ["finger", "key"], "new"],
    ["admin", "Administrator prompts", "Installing apps, changing the system", ["face", "key"], "ok"],
    ["vault", "Nyx Passwords", "Opening your vault", ["skey", "key"], "app"],
  ];
  const order = (ms) => ms.map((m, i) => { const n = M.find((x) => x[0] === m)[1]; return i ? n.toLowerCase() : n; }).join(", then ");
  const ok = (t = "On") => `<span class="pill" style="--tc:var(--success)">${t}</span>`;
  const L = (ic) => ({ ic, sec });

  const ways = (sel) => ocard("Ways to sign in", [
    orow(`Face ${ok()}`, "Infrared camera · 3 places", btn("Manage…", "sm"), { ...L("face"), cls: sel === "face" ? "picked" : "" }),
    orow(`Fingerprint ${ok()}`, "Built-in reader · 2 fingers", btn("Add a finger…", "sm"), { ...L("finger"), cls: sel === "finger" ? "picked" : "" }),
    nrow("Security keys", "Blue key, and a spare as backup", "2", { ...L("skey"), cls: sel === "skey" ? "picked" : "" }),
    orow(`Password ${ok()}`, "Always works, everywhere", "", L("key")),
  ], { first: true, cls: "icons" });

  /* ── A: what unlocks what ── */
  const aCtl = () => `
    ${ways()}
    ${ocard("More", [
      nrow("How a scan looks", "On the lock screen, prompts and sudo", "Halo", L("eye2")),
      nrow("SSH keys on a security key", "", "1", L("ssh")),
      nrow("This computer", "Camera, reader and helper", `<span class="si-ok">${icon("check-c")}All good</span>`, L("cpu")),
    ], { cls: "icons" })}`;
  const cell = (on, lock) => `<span class="si-c ${on ? "on" : ""} ${lock ? "lock" : ""}">${lock ? icon("lock") : on ? icon("check") : ""}</span>`;
  const aPv = () => `
    ${pvhead("What unlocks what", "Each place tries the ways in order. Your password always works too.", btn("Undo last change", "sm", "rotate"))}
    <div class="si-mx card">
      <div class="mh"><span></span>${M.map(([ic, n]) => `<span>${icon(ic)}<small>${n}</small></span>`).join("")}</div>
      ${PLACES.map(([ic, n, d, ms, st]) => `<div class="mr">
        <span class="mt"><span class="lic" style="--tc:var(--sec-accounts)">${icon(ic)}</span><span><b>${n}${st === "new" ? ` <span class="pill" style="--tc:var(--warning)">Not applied</span>` : st === "app" ? ` <span class="pill" style="--tc:var(--sw-blue)">App</span>` : ""}</b><small>${order(ms)}</small></span></span>
        ${M.map(([m]) => cell(ms.includes(m), m === "key")).join("")}</div>`).join("")}
    </div>
    <div class="banner2 si-apply">${icon("terminal")}<div class="tx"><b>Fingerprint for sudo is ready to apply</b><span>A terminal shows exactly what changes and tests it before keeping it.</span></div>${btn("Apply…", "primary sm")}</div>
    ${pvfoot("Login: autologin is on, so this screen only appears after you log out.", "info")}`;

  /* ── B: pick a place and see it ── */
  const bCtl = () => `
    ${ocard("Places", PLACES.map(([ic, n, , ms], i) => `<div class="opt ${i === 1 ? "picked" : ""}">${radio(i === 1)}<div class="opt-text"><div>${n}</div><div class="d">${order(ms)}</div></div></div>`), { first: true })}
    ${ocard("On the lock screen", [
      orow("Face", "", sw(true), L("face")), orow("Fingerprint", "", sw(true), L("finger")), orow("Security key", "", sw(false), L("skey")),
    ], { cls: "icons" })}`;
  const lockScreen = (o = {}) => `<div class="si-ls ${o.cls || ""}" style="background:${wall("lockwall")}">
      <div class="lt"><b>2:18</b><span>Friday 13 November</span></div>
      <div class="lc"><div class="halo">${av("Sam Rivera", 74)}<i class="h1"></i><i class="h2"></i></div><b>Sam Rivera</b>
        <span class="hint">${icon("face")}Looking for you… or touch the fingerprint reader</span>
        <div class="pw">${icon("key")}<span>Or type your password</span>${icon("chev-r")}</div></div>
      <div class="lb">${icon("wifi")}${icon("battery")}<span>Atlas</span></div>
    </div>`;
  const STYLES = ["Halo", "Circular face scan", "Cyberpunk scanner", "Minimal", "Edge glow"];
  const bPv = () => `
    ${pvhead("Lock screen", "What you'll see while it looks for you. The scan only shows while it runs.", seg(["Subtle", "Normal", "Strong"], "Normal"))}
    ${lockScreen()}
    <div class="si-row"><div class="pvchips">${STYLES.map((s) => chip(s, s === "Halo" ? "on" : "")).join("")}</div><span class="sp"></span><span class="si-an">Animations ${sw(true)}</span></div>`;

  /* ── C: one way at a time ── */
  const cCtl = () => `
    ${ways("face")}
    ${ocard("", [nrow("SSH keys on a security key", "", "1", L("ssh")), nrow("If something goes wrong", "Undo the last change, or recover", "", L("rotate"))], { cls: "icons" })}`;
  const mesh = () => {
    let d = "";
    for (let i = 0; i < 70; i++) { const a = (hash("m" + i) % 628) / 100, r = 18 + (hash("r" + i) % 46); d += `<circle cx="${(80 + Math.cos(a) * r * 0.78).toFixed(1)}" cy="${(88 + Math.sin(a) * r).toFixed(1)}" r="1.3"/>`; }
    return `<svg class="si-mesh" viewBox="0 0 160 176"><ellipse cx="80" cy="88" rx="52" ry="68" class="o"/>${d}<path d="M58 78h10M92 78h10M80 86v14M68 116q12 8 24 0" class="f"/><path d="M14 24V10h14M146 24V10h-14M14 152v14h14M146 152v14h-14" class="k"/></svg>`;
  };
  const cPv = () => `
    ${pvhead("Face", "Irlume, on the infrared camera", `${btn("Look again", "sm", "refresh")}${btn("Remove…", "sm dtext")}`)}
    <div class="si-face card">
      <div class="fv">${mesh()}</div>
      <div class="fx">
        <div class="fs">${icon("check-c")}<div><b>Your face is set up</b><span>Enrolled 3 weeks ago from four angles. It works in the dark.</span></div></div>
        <div class="ff">${[["Camera", "Infrared · front"], ["Strength", "Strong enough for sudo"], ["Last used", "Today at 2:02 PM"]].map(([k, v]) => `<div><small>${k}</small><span>${v}</span></div>`).join("")}</div>
      </div>
    </div>
    <div class="si-uh"><b>Signs you in to</b><span>Your password always works too.</span></div>
    <div class="si-uses card icons">${PLACES.map(([ic, n, d, ms]) => `<div class="opt si-u ${ms.includes("face") ? "on" : ""}"><span class="lic" style="--tc:var(--sec-accounts)">${icon(ic)}</span><div class="opt-text"><div>${n}</div><div class="d">${d}</div></div>${sw(ms.includes("face"))}</div>`).join("")}</div>
    ${pvfoot("Changes open a terminal that shows exactly what changes and tests it first.", "terminal")}`;

  REG("sign-in", {
    name: "Sign-in & Security",
    summary: "Two long cards and more below: Ways to sign in (face, a security-key name field, password), then Where they're used, one row per place with a switch per method and an “In use” tag; SSH keys, hardware checks, how a scan looks and recovery steps follow. It works, but nothing shows the whole picture of what unlocks what.",
    problems: [
      "<b>Where each way works is a column of switches:</b> every place repeats “Face” beside a switch, and its description says “Face, then password” again in grey; you read five rows to see the whole picture.",
      "<b>Adding a security key is a text field:</b> the row asks for a name (“such as Primary YubiKey”) before you've plugged anything in, and the placeholder is cut off.",
      "<b>Status tags crowd the titles:</b> On, In use and Not applied sit as small green pills after each name, with the important one (not applied) looking the same as the others.",
      "<b>The look of a scan is described, not shown:</b> Halo, Circular face scan, Cyberpunk scanner and Edge glow are names in four dropdowns, one per place.",
      "<b>Recovery instructions are a paragraph of paths</b> (a TTY, a helper path and a backup folder) at the bottom of the page, next to the everyday settings.",
      "<b>Explanations wrap at 800 px:</b> the Face row's “Irlume on the infrared camera. Can sign in to sudo, administrator prompts and the lock screen.” takes two lines beside its button.",
    ],
    today: [["sign-in-1280", "Today", ""], ["sign-in-800", "Today at 800 px", ""]],
    icons: {
      admin: '<path d="M12 3 5 6v5c0 4.5 3 8.3 7 9.5 4-1.2 7-5 7-9.5V6z"/><path d="m9 12 2 2 4-4"/>',
      key: '<circle cx="8" cy="15" r="4"/><path d="m11 12 8-8M16 7l2 2M14 9l2 2"/>',
      face: '<path d="M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2"/><path d="M9 9.5v1M15 9.5v1M12 10v3h-1M9.5 15.5a4 4 0 0 0 5 0"/>',
      finger: '<path d="M6.5 7a7 7 0 0 1 12 5v2"/><path d="M5 11.5V14M9 12a3 3 0 0 1 6 0v2.5c0 2-.5 3.8-1.5 5.5"/><path d="M12 12.5v2c0 2.5-.8 4.6-2.2 6.3M8.8 16.5c-.3 1.6-1 3-2 4.2"/>',
      skey: '<rect x="8" y="2.5" width="8" height="5" rx="1"/><rect x="6" y="7.5" width="12" height="14" rx="3"/><circle cx="12" cy="13.5" r="2.2"/>',
      ssh: '<rect x="3" y="4.5" width="18" height="15" rx="2.5"/><path d="m7 9.5 3 2.5-3 2.5M12.5 15H17"/>',
      vault: '<rect x="3.5" y="4" width="17" height="16" rx="2.5"/><circle cx="12" cy="12" r="3.5"/><path d="M12 8.5V7M12 17v-1.5M15.5 12H17M7 12h1.5M6.5 20v1.5M17.5 20v1.5"/>',
    },
    options: [
      { id: "a", name: "What unlocks what", idea: "The ways you can sign in are four short rows on the left, each with its one action (Manage, Add a finger, the keys' page). The right side is a table of every place you sign in (login, lock screen, sudo, administrator prompts, Nyx Passwords) against every way, with a tick where it works and the order it tries them under each place. A change that hasn't been applied yet shows as one banner with its Apply button instead of a tag on a row.",
        shots: [["a-table", "The table", "Fingerprint for sudo is switched on but not applied yet"], ["a-table-800", "At 800 px", ""]] },
      { id: "b", name: "Pick a place, see it", idea: "Choose a place on the left and switch the ways it accepts; the right side shows that place as it will look, here the lock screen with the Halo scan around your picture, the hint and the password field. The scan styles are chips under the picture instead of four dropdowns, and the glow strength sits over it, so you try a look and see it at once.",
        shots: [["b-lock", "The lock screen", "Halo, at normal strength"], ["b-lock-800", "At 800 px", "The lock screen above the places"]] },
      { id: "c", name: "One way at a time", idea: "Each way to sign in opens its own detail on the right: for your face, a picture of the scan, how strong it is, when it was last used, and a switch for each place it can sign you in. Fingerprint shows its fingers, Security keys lists each key with its role. Recovery moves to one row, If something goes wrong.",
        shots: [["c-face", "Face", "Where your face signs you in, as switches"], ["c-face-800", "At 800 px", ""]] },
    ],
    pages: {
      "a-table": page(aCtl, aPv, 400),
      "b-lock": page(bCtl, bPv, 360),
      "c-face": page(cCtl, cPv, 400),
    },
  });
})();
