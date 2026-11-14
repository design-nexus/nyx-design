// Connections › Connected Devices (phones and tablets through Flux): three style-B layouts.
(() => {
  const DESC = "Pair phones and tablets through Flux, and choose what each may do.";
  const page = (body) => () => swin({ sec: "connections", page: "Connected Devices", desc: DESC, body: body() });
  const S = "connections";
  // [icon, title, what it means, on]
  const ACCESS = [["copy", "Clipboard", "Copies go both ways", true], ["bell", "Notifications", "Shown in the Notification Center", true], ["folder", "Your files", "It can open your home folder", false], ["mouse", "Pointer and keys", "It can move the pointer and type", false], ["monitor", "This screen", "It can show what's on screen", false]];
  const OFFERS = ["Battery", "Clipboard", "Files and links", "Notifications", "Find my phone", "Text messages", "Commands", "Camera and microphone"];
  const devRows = (sel) => [
    `<div class="opt ${sel ? "picked" : ""}"><span class="cd-ic on">${icon("phone")}</span><div class="opt-text"><div>Sam's Phone</div><div class="d"><span class="okt">Connected</span> · 82% battery, charging</div></div>${sel ? icon("chev-r", "cv") : btn("Ring", "sm", "bell")}</div>`,
    `<div class="opt"><span class="cd-ic">${icon("tablet")}</span><div class="opt-text"><div>Studio Tablet</div><div class="d">Not connected · last seen yesterday</div></div>${icon("chev-r", "cv")}</div>`,
  ];
  const every = (title = "For every device") => ocard(title, [
    orow("Sync the clipboard", "Passwords and copies from excluded apps stay here", sw(true), { ic: "copy", sec: S }),
    orow("Show their notifications", "In the Notification Center", sw(true), { ic: "bell", sec: S }),
    orow("Let them browse this computer", "Each device can still be kept out", sw(false), { ic: "folder", sec: S }),
    nrow("Files they send", "", "Downloads", { ic: "download", sec: S }),
  ], { cls: "icons" });
  const trust = () => ocard("", [orow("Trust Home-5G", "Phones reach Atlas only on networks you trust: home or work, not a café", sw(true), { ic: "shield", sec: S })], { cls: "icons" });

  /* ── A: the phone and what it may do ──────────────────────────────── */
  const phone = (o = {}) => `<div class="cd-phone ${o.cls || ""}"><span class="notch"></span><div class="scr">
      <div class="st"><b>14:16</b><span class="sp"></span>${icon("wifi")}<span class="bt"><b style="width:82%"></b></span></div>
      ${o.inner || `<div class="fl"><span class="flo">${icon("link")}</span><b>Flux</b><span>Connected to Atlas</span></div>
      <div class="ftiles"><span>${icon("copy")}</span><span>${icon("bell")}</span><span class="off">${icon("folder")}</span><span>${icon("send")}</span></div>`}
    </div></div>`;
  const aCtl = () => `
    ${ocard("Devices", devRows(true).concat([`<div class="opt"><span class="addi">${icon("plus")}</span><div class="opt-text"><div class="acc">Pair a new device…</div><div class="d">Open Flux on the phone, on the same network</div></div></div>`]), { first: true, cls: "icons" })}
    ${every()}
    ${trust()}
    ${ocard("", [nrow("Diagnostics", "Flux's version, port and what's on its way", "", { ic: "wrench", sec: S })], { cls: "icons" })}`;
  const aPv = () => `${pvhead("Sam's Phone", "Flux for Android 0.19.1 · paired 2 months ago", `${btn("Send clipboard", "sm", "copy")}${btn("Ring", "sm", "bell")}`)}
     <div class="cd-a">
       <div class="cd-stage">${phone()}<div class="cd-bat"><b>82%</b><span>${icon("battery")}Charging</span></div></div>
       <div class="cd-side">
         <div class="cd-h">What it may do here</div>
         <div class="cd-acc">${ACCESS.map(([ic, t, d, on]) => `<div class="cd-at card ${on ? "on" : ""}"><span class="cd-ic ${on ? "on" : ""}">${icon(ic)}</span><div><b>${t}</b><span>${d}</span></div>${sw(on)}</div>`).join("")}</div>
         <div class="cd-h cd-h2">It offers</div>
         <div class="cd-off">${OFFERS.map((o) => chip(o)).join("")}</div>
       </div>
     </div>
     <div class="pvfoot">${icon("info")}<span>Unpair to stop it connecting; Forget also drops its choices here.</span><span class="sp"></span><span class="lnk dtx">Unpair</span><span class="lnk dtx">Forget</span></div>`;
  const aBody = () => split(aCtl(), aPv(), { sec: S, cls: "cd-pa" });

  /* ── B: pairing, side by side ─────────────────────────────────────── */
  const KEY = ["4821", "0937", "5562"];
  const bCtl = () => `
    ${ocard("Devices", devRows(false).concat([`<div class="opt picked"><span class="cd-ic sel">${icon("tablet")}</span><div class="opt-text"><div>Lumen Tab</div><div class="d">Wants to pair · compare the key</div></div><span class="pill" style="--tc:var(--accent)">Pairing</span></div>`]), { first: true, cls: "icons", act: btn("Look for devices", "sm", "refresh") })}
    ${trust()}
    ${every()}`;
  const keyRow = KEY.map((k) => `<span>${k}</span>`).join("");
  const bPv = () => `${pvhead("Pair Lumen Tab", "Check the key is the same on both screens, then accept.", `<span class="pill" style="--tc:var(--warning)">${icon("clock")}Ends in 24 s</span>`)}
     <div class="cd-pair card">
       <div class="cd-dev"><div class="cd-lap"><div class="scr"><small>Atlas</small><div class="key">${keyRow}</div></div><span class="base"></span></div><b>This computer</b><span>Atlas</span></div>
       <div class="cd-link"><span></span>${icon("lock")}<span></span></div>
       <div class="cd-dev">${phone({ cls: "sm", inner: `<div class="fl"><b>Pair with Atlas?</b></div><div class="key v">${keyRow}</div><div class="fb"><span>Reject</span><span class="ok">Accept</span></div>` })}<b>Lumen Tab</b><span>Flux for Android 0.19.1</span></div>
     </div>
     <div class="cd-ask card">${icon("shield")}<div><b>Does Lumen Tab show 4821 0937 5562?</b><span>If the numbers differ, someone else may be asking. Reject it.</span></div><span class="sp"></span>${btn("Reject")}${btn("Accept", "primary")}</div>
     <div class="pvfoot">${icon("check-c")}<span>Home-5G is trusted, so phones can reach Atlas here.</span></div>`;
  const bBody = () => split(bCtl(), bPv(), { sec: S, cls: "cd-pb" });

  /* ── C: what goes where ───────────────────────────────────────────── */
  // [label, icon, direction: in | out | both, on]
  const FLOWS = [["Clipboard", "copy", "both", true], ["Notifications", "bell", "in", true], ["Files you send", "send", "out", true], ["Browse your files", "folder", "out", false], ["Pointer and keys", "mouse", "in", false], ["This screen", "monitor", "out", false]];
  const cCtl = () => `
    ${ocard("Devices", devRows(true), { first: true, cls: "icons", act: btn("Pair…", "sm", "plus") })}
    ${every("Everyone")}
    ${trust()}`;
  const flowRow = ([t, ic, dir, on]) => `<div class="cf-row ${on ? "on" : ""}"><span class="cf-line ${dir}"><i></i></span><span class="cf-lab">${icon(ic)}<b>${t}</b>${sw(on)}</span></div>`;
  const cPv = () => `${pvhead("Between Atlas and Sam's Phone", "Each line is something that crosses. Switch one off to stop it, for this phone only.", seg(["Sam's Phone", "Studio Tablet"], "Sam's Phone"))}
     <div class="cf card">
       <div class="cf-end">${icon("laptop")}<b>Atlas</b><span>This computer</span></div>
       <div class="cf-mid">${FLOWS.map(flowRow).join("")}</div>
       <div class="cf-end ph">${icon("phone")}<b>Sam's Phone</b><span>82% · charging</span></div>
     </div>
     <div class="cf-legend"><span><i class="in"></i>To Atlas</span><span><i class="out"></i>To the phone</span><span><i class="both"></i>Both ways</span><span class="sp"></span>${btn("Send clipboard", "sm", "copy")}${btn("Ring", "sm", "bell")}</div>
     <div class="pvfoot">${icon("info")}<span>Files sent from the phone land in Downloads. Passwords never leave the clipboard here.</span></div>`;
  const cBody = () => split(cCtl(), cPv(), { sec: S, cls: "cd-pc" });

  REG("devices", {
    name: "Connected Devices",
    summary: "Today the page is one long column: three switches for every device, the download folder, then a Devices group where each phone is a name, a line of status, a paragraph of what it offers and a switch for each kind of access, followed by Ring, Unpair and Forget. Pairing happens inside a row, with the key in the middle of a sentence.",
    problems: [
      "<b>Long sentences instead of labels:</b> “What you copy goes to your devices after Nyx Clipboard's filters: copies from excluded apps, passwords and secrets stay here…” wraps to three lines at both widths.",
      "<b>A phone is a paragraph:</b> name, “Connected · 96% battery · Flux for Android 0.19.1”, then “Offers: Battery, Clipboard, Files and links…” as one wrapped line, then its switches.",
      "<b>Every-device and one-device switches look the same:</b> “Show notifications from devices” at the top and a phone's own “Notifications” further down are identical rows.",
      "<b>Pairing is a sentence:</b> “Accept on the device if it shows <b>4821 0937</b>” sits in a row's description, with no picture of the two screens to compare.",
      "<b>Real paths and odd names in the open:</b> “Files from devices are saved in /home/…/Downloads” is a raw path; device names show as the phone reports them.",
      "<b>Unpair and Forget</b> are buttons beside Ring, two different removals with only a tooltip between them.",
    ],
    today: [["devices-1280", "Today", ""], ["devices-800", "Today at 800 px", ""]],
    options: [
      { id: "a", name: "The phone and what it may do", idea: "Devices are a short list on the left, above the few switches that apply to all of them and the network you trust. Picking a phone draws it on the right with its battery, and beside it the five things it may do here, each a tile with a switch, and the features its Flux app offers as tags. Ring and Send clipboard sit in the heading; Unpair and Forget are quiet links at the foot, each with one plain sentence.",
        shots: [["a-phone", "Sam's Phone picked", ""], ["a-phone-800", "At 800 px", ""]] },
      { id: "b", name: "Pairing side by side", idea: "Pairing gets the whole picture: this computer and the phone drawn next to each other, the same key on both screens, a countdown, and Accept or Reject under them, so comparing is a glance instead of reading a sentence. The left lists devices with the one asking marked, then whether this network is trusted, then the every-device switches. When nobody's pairing, the right shows the picked phone as in A.",
        shots: [["b-pair", "Lumen Tab asking to pair", ""], ["b-pair-800", "At 800 px", ""]] },
      { id: "c", name: "What goes where", idea: "The picture is the connection itself: Atlas on one side, the phone on the other, and a line for each thing that crosses (clipboard both ways, notifications in, files out, and the risky ones: browsing, the pointer, the screen), each with a switch on the line. Switching all off on the left (Everyone) greys the lines for every phone; a phone's own switch only cuts its line.",
        shots: [["c-flows", "What crosses between Atlas and Sam's Phone", ""], ["c-flows-800", "At 800 px", ""]] },
    ],
    icons: {
      tablet: '<rect x="4.5" y="3" width="15" height="18" rx="2.5"/><path d="M11 18h2"/>',
    },
    pages: { "a-phone": page(aBody), "b-pair": page(bBody), "c-flows": page(cBody) },
  });
})();
