(() => {
  /* A: Discovery stage — radar hero, TVs as large tiles, pairing as a bottom sheet. */
  const discover = (o = {}) => tpage("add", `<div class="tm-discover" style="position:relative">
    <div class="hero">
      <div class="pulse">${icon("radar")}</div>
      <h2>Looking for TVs…</h2>
      <p>Wireless debugging has to be on. Found devices show up as tiles; pair opens a sheet so the list stays visible.</p>
    </div>
    <div class="tiles">
      <div class="tm-tile sel"><span class="dot on"></span><div class="nm">Bedroom TV</div><div class="sub">192.168.1.237 · already connected</div><div class="foot"><span class="dim2">This computer</span></div></div>
      <div class="tm-tile"><span class="dot on"></span><div class="nm">TV at 192.168.1.200</div><div class="sub">Network debugging on port 5555</div><div class="foot">${btn("Connect", "primary sm")}</div></div>
      <div class="tm-tile"><span class="dot off"></span><div class="nm">Enter an address</div><div class="sub">Other network, or discovery blocked</div><div class="foot">${btn("Type address", "sm")}</div></div>
    </div>
    ${o.pair ? `<div class="tm-pair-sheet">
      <b>Pair with TV at 192.168.1.200</b>
      <span class="dim2">On the TV: Developer options → Wireless debugging → Pair device with pairing code.</span>
      <div style="display:flex;gap:16px;align-items:center;flex-wrap:wrap">
        <div class="pair"><span>4</span><span>8</span><span>3</span><span class="focus">|</span><span></span><span></span></div>
        <div class="field" style="width:200px"><span class="mono">192.168.1.200:</span><span class="ph mono">port</span></div>
        ${btn("Pair", "primary")}${btn("Cancel", "ghost")}
      </div>
    </div>` : ""}
  </div>`);

  /* B: Full-page wizard — Find → Pair → Name → Done. */
  const wiz = (step = 0) => {
    const steps = ["Find", "Pair", "Name", "Done"];
    const rail = steps.map((s, i) => `${i ? '<span class="ln"></span>' : ""}<span class="st ${i < step ? "done" : i === step ? "on" : ""}"><b>${i < step ? "✓" : i + 1}</b>${s}</span>`).join("");
    const panels = [
      `<h2>Find your TV</h2><p class="lede">TVs with debugging on appear here. Choose one to continue.</p>
        <div class="card">${lrow({ lead: `<span class="dot on"></span>`, title: "TV at 192.168.1.200", sub: "port 5555 · pairing available", end: btn("Use this TV", "primary"), sel: true })}
        ${lrow({ lead: `<span class="dot on"></span>`, title: "Bedroom TV", sub: "Already on this computer", end: `<span class="dim2">Saved</span>` })}</div>`,
      `<h2>Pair with the TV</h2><p class="lede">Type the six-digit code from Wireless debugging → Pair device.</p>
        <div class="pair" style="display:flex;gap:6px">${[4,8,3,"|","",""].map((c) => `<span style="width:40px;height:48px;border-radius:8px;background:var(--field);box-shadow:inset 0 0 0 1px var(--hair);display:inline-flex;align-items:center;justify-content:center;font-size:1.4em;font-weight:600">${c === "|" ? "" : c}</span>`).join("")}</div>`,
      `<h2>Name it</h2><p class="lede">Shown in the sidebar. You can rename later in Settings.</p>
        <div class="field" style="max-width:320px"><span>Bedroom TV</span></div>`,
      `<h2>Bedroom TV is ready</h2><p class="lede">Next: install Nyx TV, then set it as the home app.</p>
        <div class="card">${lrow({ lead: icon("check-c"), title: "Connected over wireless debugging", sub: "192.168.1.200:5555" })}</div>`,
    ];
    // fix done panel - checkRow not in scope, use lrow only
    panels[3] = `<h2>Bedroom TV is ready</h2><p class="lede">Next: install Nyx TV, then set it as the home app.</p>
      <div class="card">${lrow({ lead: icon("check-c"), title: "Connected over wireless debugging", sub: "192.168.1.200:5555" })}</div>`;
    return tpage("add", `<div class="tm-wiz"><div class="rail">${rail}</div>
      <div class="panel">${panels[step]}<div class="foot">${step ? btn("Back", "ghost") : ""}${btn(step === 3 ? "Open Overview" : "Continue", "primary")}</div></div></div>`);
  };

  REG("add", {
    name: "Add a TV",
    summary: "Today stacks a discovery list, a pair card, and a manual address card — three jobs on one scroll, with Pair in two places.",
    problems: [
      "<b>Pair and manual cards sit under the list</b> and fight for space at 800 px.",
      "<b>Pair appears on the row and in a card</b> at the same time.",
      "<b>No calm empty or searching state</b> — the page always looks like a dense form.",
    ],
    today: [["add-1280", "Today at 1280 px", "Real app"]],
    options: [
      { id: "a", name: "Discovery tiles + pair sheet", idea: "A searching hero with a radar, TVs as large tiles, and pairing as a bottom sheet that covers the foot without burying the list. Manual address is just another tile.",
        good: "Finding and pairing without a form stack.",
        shots: [["a-main", "Searching", "Hero + tiles"], ["a-pair", "Pairing sheet", "Code entry over the tiles"]] },
      { id: "b", name: "Setup wizard", idea: "A full-page stepper: Find → Pair → Name → Done. The sidebar still lists TVs, but adding one is a guided path instead of three cards.",
        good: "First-time setup that can't get lost mid-scroll.",
        shots: [["b-find", "Find", "Step 1"], ["b-pair", "Pair", "Step 2"], ["b-done", "Done", "Step 4"]] },
    ],
    pages: {
      "a-main": () => discover(),
      "a-pair": () => discover({ pair: true }),
      "b-find": () => wiz(0),
      "b-pair": () => wiz(1),
      "b-done": () => wiz(3),
    },
  });
})();
