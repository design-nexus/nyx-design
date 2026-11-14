// Connections › Bluetooth: two style-B layouts.
(() => {
  const DESC = "Find, pair and connect Bluetooth devices.";
  const page = (body) => () => swin({ sec: "connections", page: "Bluetooth", desc: DESC, body: body() });
  // [icon, name, kind, state, battery]
  const MINE = [["headphones", "Pulse Buds", "Headphones", "Connected", 80], ["mouse", "Trail Mouse", "Mouse", "Connected", 55], ["keyboard", "Keys Mini", "Keyboard", "Paired", 0], ["speaker", "Studio Speaker", "Speaker", "Paired", 0], ["gamepad", "Arc Controller", "Game controller", "Paired", 0]];
  const NEAR = [["watch", "Sam's Watch", "Watch", 3], ["speaker", "Kitchen Speaker", "Speaker", 2], ["phone", "Lumen Phone", "Phone", 3], ["bt", "Unnamed device", "Unknown", 1]];
  const tile = (ic, on) => `<span class="bt-ic ${on ? "on" : ""}">${icon(ic)}</span>`;
  const batt = (p) => `<span class="bt-bat"><b style="width:${p}%"></b></span><span class="rv">${p}%</span>`;
  const swTop = () => ocard("", [orow("<b>Bluetooth</b>", "On · nearby devices see this computer as Atlas while this page is open", sw(true), { ic: "bluetooth", sec: "connections" })], { cls: "icons bt-top" });

  /* ── A: your devices beside the one you pick ──────────────────────── */
  const aCtl = () => `
    ${swTop()}
    ${ocard("My devices", MINE.map(([ic, n, k, st, b], i) => `<div class="opt ${i === 0 ? "picked" : ""}">${tile(ic, st === "Connected")}<div class="opt-text"><div>${n}</div><div class="d">${st === "Connected" ? `<span class="okt">Connected</span>` : "Not connected"} · ${k}</div></div>${b ? batt(b) : ""}${icon("chev-r", "cv")}</div>`), { act: `<span class="note">5 paired</span>` })}
    ${ocard("", [orow(`<span class="acc">Pair a new device…</span>`, "Put it in pairing mode first", "", { ic: "plus", sec: "connections" })], { cls: "icons" })}`;
  const aPv = () => `${pvhead("Pulse Buds", "Headphones · paired 3 weeks ago", `${btn("Disconnect")}`)}
     <div class="bt-hero card">
       <div class="bt-art">${icon("headphones")}<span class="bt-live"></span></div>
       <div class="bth"><b>Connected</b><span>Playing sound from Atlas</span>
         <div class="bt-buds">${[["Left", 80], ["Right", 76], ["Case", 45]].map(([n, p]) => `<div><small>${n}</small><span class="bt-bat big"><b style="width:${p}%"></b></span><em>${p}%</em></div>`).join("")}</div></div>
     </div>
     ${ocard("", [
       orow("Connect when it's in range", "It reconnects by itself, without asking", sw(true), { ic: "refresh", sec: "connections" }),
       nrow("Sound", "Plays through it when it connects", "Output and microphone", { ic: "volume", sec: "connections" }),
       orow("Name", "What this computer calls it", `<span class="field bt-name">Pulse Buds</span>`, { ic: "pen", sec: "connections" }),
     ], { cls: "icons" })}
     <div class="bt-facts card">${[["Kind", "Headphones"], ["Codec", "AAC · 48 kHz"], ["Signal", "Strong"], ["Connected for", "42 min"]].map(([k, v]) => `<div><small>${k}</small><span>${v}</span></div>`).join("")}</div>
     <div class="pvfoot">${icon("info")}<span>Unpair to stop it reconnecting; it has to be paired again to use it.</span><span class="sp"></span><span class="lnk dtx">Unpair</span></div>`;
  const aBody = () => split(aCtl(), aPv(), { sec: "connections", cls: "bt-a" });

  /* ── B: pairing in the preview ────────────────────────────────────── */
  const bCtl = () => `
    ${swTop()}
    ${ocard("My devices", MINE.map(([ic, n, k, st, b]) => `<div class="opt">${tile(ic, st === "Connected")}<div class="opt-text"><div>${n}</div><div class="d">${st === "Connected" ? `<span class="okt">Connected</span>${b ? ` · ${b}% battery` : ""}` : `Not connected · ${k}`}</div></div>${btn(st === "Connected" ? "Disconnect" : "Connect", "sm")}${ib("more", "More")}</div>`), { act: `<span class="note">Unpair from a device's ⋯ menu</span>` })}`;
  const step = (n, t, s, st) => `<div class="bt-step ${st}"><span class="n">${st === "done" ? icon("check") : n}</span><div><b>${t}</b><span>${s}</span></div></div>`;
  const bPv = () => `${pvhead("Pair a new device", "Nearby devices show up while this is open.", `${btn("Stop looking", "sm")}`)}
     <div class="bt-steps">${step(1, "Pairing mode", "Its light blinks", "done")}${step(2, "Pick it", "It shows up below", "on")}${step(3, "Check the code", "Both show the same", "")}</div>
     <div class="bt-scan card">
       <div class="bt-radar"><span class="r1"></span><span class="r2"></span><span class="r3"></span><div class="bt-me">${icon("bluetooth")}</div></div>
       <div class="bt-st"><b>Looking for devices…</b><span>4 found · about 6 seconds left</span>${prog(40)}</div>
     </div>
     <div class="bt-found">${NEAR.map(([ic, n, k, s], i) => `<div class="bt-fd card ${i === 0 ? "sel" : ""}">${tile(ic, i === 0)}<div class="tx"><b>${n}</b><span>${k}</span></div>${bars4(s)}${i === 0 ? btn("Pairing…", "sm primary") : btn("Pair", "sm")}</div>`).join("")}</div>
     <div class="bt-code card">${icon("shield")}<div><b>Does Sam's Watch show 482 019?</b><span>Pair only if the numbers match.</span></div><span class="sp"></span>${btn("Cancel", "sm ghost")}${btn("They match", "sm primary")}</div>
     <div class="pvfoot">${icon("info")}<span>Not showing up? Turn it off and on, or restart Bluetooth.</span><span class="sp"></span>${btn("Restart Bluetooth", "sm ghost", "refresh")}</div>`;
  const bBody = () => split(bCtl(), bPv(), { sec: "connections", cls: "bt-b", ctlw: 450 });

  REG("bluetooth", {
    name: "Bluetooth",
    summary: "Today Bluetooth is a switch, a “Pair a new device” row with a Find devices button, and one row per device with Connect and Unpair. Devices have no icons or battery, and a device that's off or away looks the same as one that's paired and ready.",
    problems: [
      "<b>Every device is a name and one word:</b> “-=Pandora=- · Paired”, no icon, no kind, no battery, no sign of which one is playing sound.",
      "<b>Pairing is a 10-second guess:</b> “Find devices” turns into “Searching…”, then the list refills; there's no sign of progress, no steps, and no code to compare.",
      "<b>Controls that don't match the state:</b> with Bluetooth off, Find devices, Connect and Unpair still look ready to press.",
      "<b>Unpair sits beside Connect</b> as an equal button, a click away from undoing a pairing.",
      "<b>Nothing per device:</b> no rename, no reconnect-by-itself choice, no link to its sound settings.",
      "<b>Mostly empty at both widths:</b> two cards at the top, the rest of the window blank.",
    ],
    today: [["bluetooth-1280", "Today", "Bluetooth off, but Find devices and Connect still look ready"], ["bluetooth-800", "Today at 800 px", ""]],
    options: [
      { id: "a", name: "Devices beside the one you pick", idea: "Your devices are a list on the left with icons, whether they're connected and their battery. Picking one fills the right with it: a big picture of the device, the battery of each part (both buds and the case), whether it reconnects by itself, its name, a shortcut to its sound settings and a few facts. Unpair is a quiet link at the foot instead of a button beside Connect.",
        shots: [["a-device", "Pulse Buds picked", ""], ["a-device-800", "At 800 px", "The device above the list"]] },
      { id: "b", name: "Pairing as the picture", idea: "The left keeps your devices one row each, with Connect or Disconnect right there and the rest (Unpair, rename) behind ⋯. The right is pairing, walked through: three steps across the top, a scan that shows how long is left, what it found with their signal, and the code to compare before you say yes. When nothing's being paired the right shows the device you last touched.",
        shots: [["b-pair", "Pairing Sam's Watch", ""], ["b-pair-800", "At 800 px", ""]] },
    ],
    icons: {
      gamepad: '<path d="M7 8h10a4 4 0 0 1 4 4.5l-.6 3.6a2.5 2.5 0 0 1-4.4 1.2L14.5 15h-5L8 17.3a2.5 2.5 0 0 1-4.4-1.2L3 12.5A4 4 0 0 1 7 8z"/><path d="M8 11v3M6.5 12.5h3M15.5 12h.01M17.5 13.5h.01" stroke-width="1.8"/>',
      watch: '<rect x="6.5" y="6.5" width="11" height="11" rx="3"/><path d="M9 6.5 9.5 3h5l.5 3.5M9 17.5l.5 3.5h5l.5-3.5M12 9.5V12l1.5 1"/>',
      bt: '<path d="m7 7.5 10 9-5 4.5V3l5 4.5-10 9"/>',
    },
    pages: { "a-device": page(aBody), "b-pair": page(bBody) },
  });
})();
