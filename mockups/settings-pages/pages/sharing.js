// Connections › Sharing: three style-B layouts.
(() => {
  const DESC = "Nearby sharing, your computers, NAS folders and what the Share Sheet offers.";
  const page = (body) => () => swin({ sec: "connections", page: "Sharing", desc: DESC, body: body() });
  const S = "connections";
  const dic = (ic, c, on = true) => `<span class="sh-ic ${on ? "" : "off"}" style="--mc:var(--sw-${c})">${icon(ic)}</span>`;
  const TRANSFERS = [["image", "24 photos from Sam's Phone", "Received · 186 MB · 2 min ago", "done", 100], ["file-text", "Budget 2027.pdf to Studio PC", "Sending · 4.2 of 6.8 MB", "run", 62], ["file", "notes.txt to NAS Documents", "Couldn't reach the NAS · 10 min ago", "fail", 0]];
  const WITH = [["image", "24 photos from Sam's Phone", "Received · 186 MB · 2 min ago", "done", 100], ["file-text", "Boarding pass.pdf to Sam's Phone", "Sent through Flux · yesterday", "done", 100], ["link", "A link from Sam's Phone", "Opened in the browser · Monday", "done", 100]];
  const transfers = (list = TRANSFERS) => `<div class="sh-tr card">${list.map(([ic, t, d, st, p]) => `<div class="tr ${st}">${icon(ic)}<div class="tx"><b>${t}</b><span>${d}</span>${st === "run" ? prog(p) : ""}</div>${st === "fail" ? btn("Retry", "sm") : st === "run" ? btn("Cancel", "sm ghost") : icon("check-c", "ok")}</div>`).join("")}</div>`;

  /* ── A: what nearby devices see ───────────────────────────────────── */
  const aCtl = () => `
    ${ocard("Nearby sharing", [
      orow("Visible to nearby devices", "While Share is open, and a minute after you share", sw(true), { ic: "eye", sec: S }),
      orow("Name", "What nearby devices see", `<span class="field sh-name">Atlas</span>`, { ic: "laptop", sec: S }),
      nrow("Save what you receive to", "", "Downloads", { ic: "download", sec: S }),
      orow("Also look over Tailscale", "Reach your devices from any network", sw(true), { ic: "share", sec: S }),
    ], { first: true, cls: "icons" })}
    ${ocard("My computers", [
      orow("Studio PC", "Trusted · sends without asking", `<span class="pill dot">On the network</span>`, { ic: "monitor", sec: S }),
      orow("Lumen Mini", "Asks first", `<span class="pill dot" style="--tc:var(--text-tertiary)">Offline</span>`, { ic: "laptop", sec: S }),
    ], { cls: "icons", act: btn("Add…", "sm", "plus") })}
    ${ocard("", [nrow("Linked devices, NAS folders and the Share Sheet", "", "", { ic: "layers", sec: S })], { cls: "icons" })}`;
  // [name, how, icon, colour, angle°, radius %, trusted]
  const NEAR = [["Sam's Phone", "Flux", "phone", "blue", 21, 28, false], ["Studio PC", "On the network", "monitor", "violet", 79, 30, true], ["Kitchen Tablet", "LocalSend", "tablet", "amber", 23, 74, false], ["Lumen Mini", "Over Tailscale", "laptop", "teal", 77, 72, false]];
  const aPv = () => `${pvhead("Nearby right now", "Who can see Atlas, and who you can send to.", `<span class="pill" style="--tc:var(--sec-connections)">${icon("eye")}Visible for 48 s</span>`)}
     <div class="sh-near card">
       <span class="sh-wave w1"></span><span class="sh-wave w2"></span><span class="sh-wave w3"></span>
       <div class="sh-me">${icon("laptop")}<b>Atlas</b></div>
       ${NEAR.map(([n, h, ic, c, x, y, t]) => `<div class="sh-dev" style="left:${x}%;top:${y}%">${dic(ic, c)}<b>${n}${t ? icon("star", "tr") : ""}</b><span>${h}</span></div>`).join("")}
     </div>
     <div class="gtitle sh-gt gflex">Transfers<span class="sp"></span><span class="lnk">Open Share ${icon("external")}</span></div>
     ${transfers()}`;
  const aBody = () => split(aCtl(), aPv(), { sec: S, cls: "sh-a" });

  /* ── B: the Share Sheet, live ─────────────────────────────────────── */
  // [icon, name, kind, colour, pinned, shown]
  const DEST = [["phone", "Sam's Phone", "Flux", "blue", true, true], ["monitor", "Studio PC", "My computer", "violet", true, true], ["server", "NAS Documents", "NAS folder", "amber", true, true], ["cloud", "Cloud Drive", "Online account", "teal", false, true], ["mail", "Email", "Online account", "red", false, true], ["bluetooth", "Pulse Buds", "Bluetooth", "graphite", false, false], ["tablet", "Kitchen Tablet", "Nearby", "green", false, false]];
  const bCtl = () => `
    ${ocard("In the Share Sheet", [orow("Default", "Listed first; Enter sends to it", dd("Sam's Phone"), { ic: "star", sec: S })], { first: true, cls: "icons" })}
    ${ocard("", DEST.map(([ic, n, k, c, pin, shown]) => `<div class="opt sh-d ${shown ? "" : "hid"}">${icon("grip", "sh-grip")}${dic(ic, c, shown)}<div class="opt-text"><div>${n}</div><div class="d">${k}</div></div>${ib(pin ? "pin" : "pin", pin ? "Pinned" : "Pin", pin ? "on" : "")}${ib(shown ? "eye" : "eye2", shown ? "Shown" : "Hidden: behind More", shown ? "" : "hidden")}</div>`), { act: `<span class="note">Drag to reorder</span>` })}
    ${ocard("", [nrow("Kinds of destination", "Leave a whole kind out of Share", "5 of 6", { ic: "layers", sec: S })], { cls: "icons" })}`;
  const bPv = () => `${pvhead("What you'll see", "Sharing a photo from Files, with these choices.", seg(["A photo", "A link", "Text"], "A photo"))}
     <div class="sh-stage">
       <div class="sh-sheet pop">
         <div class="ss-h">${art("holiday", { w: 46, h: 46, r: 8, ic: "image" })}<div><b>Harbour at dusk.jpg</b><span>4.1 MB · from Files</span></div><span class="sp"></span>${ib("x", "Close")}</div>
         <div class="ss-pin">${DEST.filter((d) => d[4]).map(([ic, n, k, c], i) => `<div class="sp1 ${i === 0 ? "def" : ""}">${dic(ic, c)}<b>${n}</b><span>${i === 0 ? `${kbd("Enter")}` : k}</span></div>`).join("")}</div>
         <div class="ss-list">${DEST.filter((d) => !d[4] && d[5]).map(([ic, n, k, c]) => `<div class="sl">${dic(ic, c)}<b>${n}</b><span>${k}</span></div>`).join("")}
           <div class="sl more">${icon("more")}<b>More</b><span>2 hidden</span></div></div>
         <div class="ss-f">${icon("copy")}<span>Copy</span>${icon("folder")}<span>Save to…</span>${icon("app")}<span>Open with…</span></div>
       </div>
     </div>
     <div class="pvfoot">${icon("check-c")}<span>Pinned ones come first; hidden ones wait behind More. Apps' “Send to” menus follow the same order.</span></div>`;
  const bBody = () => split(bCtl(), bPv(), { sec: S, cls: "sh-b", ctlw: 410 });

  /* ── C: one device, every way to reach it ─────────────────────────── */
  const DEVS = [["phone", "Sam's Phone", "Linked · 3 ways", "blue", true], ["monitor", "Studio PC", "My computer · trusted", "violet", false], ["laptop", "Lumen Mini", "My computer · offline", "teal", false], ["server", "NAS Documents", "NAS folder · SMB", "amber", false]];
  const cCtl = () => `
    ${ocard("Your devices", DEVS.map(([ic, n, d, c, sel]) => `<div class="opt ${sel ? "picked" : ""}">${dic(ic, c)}<div class="opt-text"><div>${n}</div><div class="d">${d}</div></div>${icon("chev-r", "cv")}</div>`).concat([`<div class="opt"><span class="addi">${icon("plus")}</span><div class="opt-text"><div class="acc">Add a computer or NAS folder…</div></div></div>`]), { first: true, cls: "icons" })}
    ${ocard("Nearby sharing", [orow("Visible to nearby devices", "While Share is open", sw(true), { ic: "eye", sec: S }), nrow("Name and folder", "", "Atlas · Downloads", { ic: "laptop", sec: S })], { cls: "icons" })}`;
  const WAYS = [["link", "Flux", "Through Nyx Connect · fastest", "up"], ["wifi", "Nearby", "LocalSend on Home-5G", "up"], ["bluetooth", "Bluetooth", "Slow, for when there's no network", "down"]];
  const cPv = () => `${pvhead("Sam's Phone", "One entry in Share, reached three ways.", `${btn("Unlink", "sm ghost")}`)}
     <div class="sh-ways card">
       <div class="sw-dev">${dic("phone", "blue")}<b>Sam's Phone</b><span>Share sends the way that's up, and tries the next if it fails</span></div>
       <div class="sw-list">${WAYS.map(([ic, n, d, st], i) => `<div class="sw-w ${st}"><span class="n">${i + 1}</span>${icon(ic)}<div><b>${n}</b><span>${d}</span></div><span class="pill dot" style="--tc:${st === "up" ? "var(--success)" : "var(--text-tertiary)"}">${st === "up" ? "Up" : "Off"}</span>${icon("grip", "sh-grip")}</div>`).join("")}</div>
     </div>
     ${ocard("", [
       orow("Trusted", "Sends to you without asking first", sw(true), { ic: "star", sec: S }),
       orow("Pinned in the Share Sheet", "", sw(true), { ic: "pin", sec: S }),
     ], { cls: "icons" })}
     <div class="gtitle sh-gt">With Sam's Phone</div>
     ${transfers(WITH)}`;
  const cBody = () => split(cCtl(), cPv(), { sec: S, cls: "sh-c", ctlw: 380 });

  REG("sharing", {
    name: "Sharing",
    summary: "Today Sharing is seven groups in one long column: nearby sharing, transfers, my computers, linked devices, NAS folders, destinations and the Share Sheet, each opening with a sentence. It's the most complete page in Connections, but nothing shows who's nearby, what the Share Sheet will look like, or how a linked device is reached.",
    problems: [
      "<b>Seven groups, one column:</b> the Share Sheet's order, the part you'd most like to see, is at the very bottom.",
      "<b>A sentence above every group</b> (“One entry for a phone or computer you reach several ways. Share sends the way that's up…”) before any control.",
      "<b>No picture of nearby:</b> “Visible to nearby devices” is a switch; who's around, and whether they can see you right now, isn't shown.",
      "<b>The device key is a hex string</b> split over two lines (“1938 A5FE … 62DF 6947”), in the middle of everyday settings.",
      "<b>Linked devices are hard to follow:</b> the ways to reach one device and their order are text in a row, with no sign of which way is up.",
      "<b>Transfers show raw detail:</b> “Copied Nyx Share test.txt to Google Drive; Cloud uploads it in the background · Oct 31, 21:33” as one wrapped line.",
    ],
    today: [["sharing-1280", "Today", ""], ["sharing-800", "Today at 800 px", ""]],
    options: [
      { id: "a", name: "What nearby devices see", idea: "The right shows who's around: Atlas in the middle with how long it stays visible, and each device you could send to placed around it with how it's reached (Flux, the network, Tailscale), trusted ones starred. Under it, transfers with progress and Retry. The left keeps the everyday settings (visible, name, folder, Tailscale) and your computers; linked devices, NAS folders and the Share Sheet move one level down.",
        shots: [["a-nearby", "Nearby right now", ""], ["a-nearby-800", "At 800 px", ""]] },
      { id: "b", name: "The Share Sheet, live", idea: "The page is about what Share offers. The left is the list of destinations in their order, each with a pin and an eye to hide it behind More, the default at the top and the kinds of destination below. The right is the Share Sheet itself, drawn with a sample photo, changing as you drag, pin or hide, so you see the result instead of imagining it.",
        shots: [["b-sheet", "Arranging the Share Sheet", ""], ["b-sheet-800", "At 800 px", ""]] },
      { id: "c", name: "One device, every way to reach it", idea: "Everything you share with is one list: linked phones, your computers, NAS folders. Picking one shows how it's reached, as numbered ways in the order Share tries them, each marked up or off and draggable, then whether it's trusted and pinned, and what you've sent each other. Nearby sharing's own settings stay as a short card on the left.",
        shots: [["c-device", "Sam's Phone, three ways", ""], ["c-device-800", "At 800 px", ""]] },
    ],
    icons: {
      grip: '<path d="M9 6h.01M15 6h.01M9 12h.01M15 12h.01M9 18h.01M15 18h.01" stroke-width="2.6"/>',
      tablet: '<rect x="4.5" y="3" width="15" height="18" rx="2.5"/><path d="M11 18h2"/>',
    },
    pages: { "a-nearby": page(aBody), "b-sheet": page(bBody), "c-device": page(cBody) },
  });
})();
