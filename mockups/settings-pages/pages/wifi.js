// Connections › Wi-Fi: three style-B layouts.
(() => {
  const DESC = "Networks nearby, the one you're on, and saved ones.";
  const page = (body, over = "") => () => swin({ sec: "connections", page: "Wi-Fi", desc: DESC, body: body(), over });
  // [name, security, bars, signal %, band, saved]
  const NETS = [["Harbor Café", "Open", 3, 64, "2.4 GHz", false], ["Studio Guest", "WPA3", 3, 58, "5 GHz", false], ["Neighbours-2G", "WPA2", 2, 41, "2.4 GHz", false], ["Office-Mesh", "WPA3", 2, 36, "5 GHz", true], ["Printer-Direct", "WPA2", 1, 22, "2.4 GHz", false], ["Atlas Hotspot", "WPA3", 1, 18, "5 GHz", true]];
  const SAVED = [["Home-5G", "Joins first · this one now", 4], ["Office-Mesh", "Joins automatically", 2], ["Lumen Phone", "Hotspot · asks first", 0], ["Library Free", "Open · asks first", 0]];
  const qr = (n = 11) => { let s = ""; for (let i = 0; i < 121; i++) s += `<b class="${(hash("q" + i) % 3 === 0) || [0, 1, 2, 10, 11, 12, 22, 23, 24, 8, 9, 19, 20, 30, 31, 96, 97, 98, 108, 109, 110, 118, 119, 120].includes(i) ? "on" : ""}"></b>`; return `<span class="qr">${s}</span>`; };
  const lockOr = (s) => s === "Open" ? `<span class="wf-open">Open</span>` : icon("lock", "lk");
  const traffic = (w = 440, h = 64) => spark([0.1, 0.2, 0.15, 0.4, 0.3, 0.7, 0.5, 0.35, 0.3, 0.6, 0.8, 0.4, 0.25, 0.3, 0.5, 0.45, 0.2, 0.3], { w, h, c: "var(--sec-connections)" }).replace("<svg ", '<svg preserveAspectRatio="none" ');
  const sw1 = (sub = "7 networks nearby") => ocard("", [orow("<b>Wi-Fi</b>", sub, sw(true), { ic: "wifi", sec: "connections" })], { cls: "icons wf-top" });

  /* ── A: the list beside the network you're on ─────────────────────── */
  const aCtl = () => `
    ${sw1()}
    ${ocard("Networks", [`<div class="opt picked">${bars4(4)}<div class="opt-text"><div>Home-5G</div><div class="d">Connected · WPA3 · 5 GHz</div></div>${icon("check", "okc")}</div>`]
      .concat(NETS.slice(0, 5).map(([n, s, b, , band, saved]) => `<div class="opt">${bars4(b)}<div class="opt-text"><div>${n}</div><div class="d">${s === "Open" ? "Open · anyone nearby can see what you send" : `${saved ? "Saved · " : ""}${s} · ${band}`}</div></div>${lockOr(s)}</div>`))
      .concat([`<div class="opt"><span class="addi">${icon("plus")}</span><div class="opt-text"><div class="acc">Join a hidden network…</div></div></div>`]), { act: `<span class="note">Looked 20 s ago</span>${ib("refresh", "Look again")}`, cls: "wf-list" })}
    ${ocard("", [nrow("Saved networks", "Forget one, or choose which joins first", "8", { ic: "hist", sec: "connections" })], { cls: "icons" })}`;
  const aPv = () => `${pvhead("Home-5G", "Connected for 3 h 12 min · joined automatically", `${btn("Disconnect")}`)}
     <div class="netcard card">
       <div class="nsig">${ring(92, { size: 92, c: "var(--sec-connections)", label: "92%" })}<div><b>Excellent signal</b><span>5 GHz · channel 44 · 866 Mb/s</span></div></div>
       <div class="nspark"><div class="r1"><b>Traffic</b><span>${chip("Down 2.1 MB/s", "acc")} ${chip("Up 180 kB/s")}</span></div>${traffic()}</div>
     </div>
     <div class="nfacts card">${[["Address", "192.168.1.24"], ["Router", "192.168.1.1"], ["DNS", "From the network"], ["Security", "WPA3 Personal"], ["Hardware address", "Private for this network"], ["Today", "1.8 GB down · 240 MB up"]].map(([k, v]) => `<div><small>${k}</small><span>${v}</span></div>`).join("")}</div>
     <div class="nrowx"><div class="card">${orow("Join automatically", "When it's in range", sw(true))}${orow("Wi-Fi band", "", dd("Automatic"))}</div><div class="card nshare">${qr()}<div><b>Share</b><span>Scan with a phone to join without typing the password</span></div></div></div>
     <div class="pvfoot">${icon("info")}<span>DNS, VPN and the firewall are on the Network page.</span><span class="sp"></span><span class="lnk dtx">Forget this network</span></div>`;
  const aBody = () => split(aCtl(), aPv(), { sec: "connections", cls: "wf-a" });

  /* ── B: a map of the networks around you ──────────────────────────── */
  // [name, security, bars, angle°, signal %]
  const MAP = [["Home-5G", "WPA3", 4, 305, 92, "me"], ["Harbor Café", "Open", 3, 15, 64], ["Studio Guest", "WPA3", 3, 150, 58, "sel"], ["Neighbours-2G", "WPA2", 2, 215, 41], ["Office-Mesh", "WPA3", 2, 62, 36], ["Printer-Direct", "WPA2", 1, 178, 22], ["Atlas Hotspot", "WPA3", 1, 262, 18]];
  const at = (a, sig) => { const r = (1 - sig / 100) * 40 + 14; return [50 + r * Math.cos((a * Math.PI) / 180), 50 + r * Math.sin((a * Math.PI) / 180)]; };
  const bCtl = () => `
    ${sw1()}
    ${ocard("Connected", [orow("Home-5G", "Excellent · 5 GHz · 192.168.1.24", `${btn("Details", "sm")}`, { ic: "wifi", sec: "connections" })], { cls: "icons" })}
    ${ocard("Saved networks", SAVED.map(([n, d, b], i) => `<div class="opt">${icon("grip", "wf-grip")}<div class="opt-text"><div>${n}</div><div class="d">${d}</div></div>${b ? bars4(b) : `<span class="rv">Not here</span>`}</div>`), { act: `<span class="note">Drag to choose which joins first</span>` })}
    ${ocard("", [orow(`<span class="acc">Join a hidden network…</span>`, "", "", { ic: "plus", sec: "connections" }), nrow("4 more saved networks", "", "", { ic: "hist", sec: "connections" })], { cls: "icons" })}`;
  const dot = ([n, s, b, a, sig, cls = ""]) => {
    const [x, y] = at(a, sig);
    return `<div class="wr-dot ${cls} ${s === "Open" ? "open" : ""} ${x < 46 ? "l" : ""}" style="left:${x}%;top:${y}%"><i></i><span>${bars4(b)}<b>${n}</b>${s === "Open" ? "" : icon("lock", "lk")}</span></div>`;
  };
  const bPv = () => `${pvhead("Around you", "Closer to the middle is a stronger signal. Click one to join it.", `${seg(["Map", "List"], "Map")}${ib("refresh", "Look again")}`)}
     <div class="wr-map card"><div class="wr-sq">
       <span class="wr-ring r1"></span><span class="wr-ring r2"></span><span class="wr-ring r3"></span><span class="wr-ring r4"></span>
       <span class="wr-sweep"></span>
       <div class="wr-me">${icon("laptop")}<b>Atlas</b></div>
       ${MAP.map(dot).join("")}
       <div class="wr-pop pop" style="left:calc(${at(150, 58)[0]}% - 100px);top:calc(${at(150, 58)[1]}% + 24px)">
         <div class="wp1">${bars4(3)}<div><b>Studio Guest</b><span>Good signal · WPA3 · 5 GHz</span></div></div>
         <div class="field focus">${icon("lock")}<span>••••••••••</span><span class="sp"></span>${icon("eye")}</div>
         <div class="wp2">${chk(true)}<span>Join automatically</span><span class="sp"></span>${btn("Join", "primary sm")}</div>
       </div>
     </div>
     <div class="wr-leg"><span><i class="me"></i>You're on</span><span><i></i>Secured</span><span><i class="op"></i>Open: anyone nearby can see what you send</span></div></div>`;
  const bBody = () => split(bCtl(), bPv(), { sec: "connections", cls: "wf-b" });

  /* ── C: this network's settings, the others in a sheet ────────────── */
  const cCtl = () => `
    ${sw1("Connected to Home-5G")}
    ${ocard("This network", [orow("Join automatically", "Whenever it's in range", sw(true), { ic: "refresh", sec: "connections" }), orow("Wi-Fi band", "2.4 GHz reaches further; 5 GHz is faster", seg(["Auto", "2.4", "5 GHz"], "Auto"), { ic: "wifi", sec: "connections" }), orow("Private address", "A different hardware address here, so it can't follow you", sw(true), { ic: "shield", sec: "connections" })], { cls: "icons" })}
    ${ocard("Addresses", [orow("IP address", "", `<span class="rv">192.168.1.24 · automatic</span>`, { ic: "network", sec: "connections" }), nrow("DNS", "Set it on the Network page", "From the network", { ic: "globe", sec: "connections" })], { cls: "icons" })}
    <div class="wf-btns">${btn("Disconnect")}${btn("Forget this network", "dtext")}</div>`;
  const sheet = () => `<div class="wc-sheet pop">
      <div class="wsh">${icon("search")}<span class="ph">Nearby networks</span><span class="sp"></span>${ib("refresh", "Look again")}</div>
      <div class="wsl">
        <div class="wsr on">${bars4(4)}<div><b>Home-5G</b><span>Connected</span></div>${icon("check", "okc")}</div>
        ${NETS.slice(0, 5).map(([n, s, b, , band, saved]) => `<div class="wsr">${bars4(b)}<div><b>${n}</b><span>${saved ? "Saved · " : ""}${s} · ${band}</span></div>${lockOr(s)}</div>`).join("")}
        <div class="wsr add"><span class="addi">${icon("plus")}</span><div><b class="acc">Hidden network…</b></div></div>
      </div></div>`;
  const cPv = () => `<div class="pvh"><button class="wc-pick">${bars4(4)}<b>Home-5G</b>${icon("chev-d")}</button><span class="sp"></span>${btn("Share", "sm", "qr")}</div>
     <div class="wc-hero card">
       ${ring(92, { size: 132, c: "var(--sec-connections)", label: "92%" })}
       <div class="wch"><b>Excellent signal</b><span>5 GHz · channel 44 · up to 866 Mb/s</span><div class="wcc">${chip("Down 2.1 MB/s", "acc")}${chip("Up 180 kB/s")}</div></div>
     </div>
     <div class="wc-graph card"><div class="r1"><b>The last ten minutes</b><span class="dim">Peak 6.4 MB/s at 14:08</span></div>${traffic(560, 120)}<div class="wcx"><span>14:00</span><span>14:05</span><span>now</span></div></div>
     <div class="pvfoot">${icon("check-c")}<span>Connected for 3 h 12 min · 1.8 GB down and 240 MB up today</span></div>
     ${sheet()}`;
  const cBody = () => split(cCtl(), cPv(), { sec: "connections", cls: "wf-c" });

  REG("wifi", {
    name: "Wi-Fi",
    summary: "Today Wi-Fi is a switch, a line saying what you're connected to, and a Scan button. The networks only appear after Scan, as plain rows with Connect and Forget, and the details of the one you're on hide in a fold under the list. Saved networks you're not near can't be seen or forgotten.",
    problems: [
      "<b>Empty until you press Scan:</b> the page opens on two rows and a button; nothing nearby shows until you ask, and the rest of the window is blank.",
      "<b>The network you're on is a line of text:</b> “Connected to SkyNet (Wi-Fi)” sits beside the switch, with no signal, speed or address.",
      "<b>Signal as a number:</b> each network says “Signal 64%” in its description instead of bars, so the list can't be read at a glance.",
      "<b>Saved networks are invisible</b> unless they're in range; there's no way to forget an old one or choose which joins first.",
      "<b>Per-network choices live elsewhere:</b> the Wi-Fi band is under Network › Tools, and the connection details are a fold at the bottom of the list.",
      "<b>At 800 px</b> the card stretches the full width with the switch far from its label, and the page is still mostly empty.",
    ],
    today: [["wifi-1280", "Today", "Before Scan: two rows and a button"], ["wifi-800", "Today at 800 px", ""]],
    options: [
      { id: "a", name: "List beside the network you're on", idea: "Round 1's layout, filled in. The networks are listed straight away on the left, with bars, a lock and whether they're saved; the one you're on is on top and ticked. The right shows that network: its signal and live traffic, its address and router, the two choices that belong to it (join automatically, Wi-Fi band) and a code to share it with a phone. Saved networks open on their own page.",
        shots: [["a-list", "Networks and the one you're on", ""], ["a-list-800", "At 800 px", "The network you're on above the list"]] },
      { id: "b", name: "A map of what's around you", idea: "The picture is the networks themselves: you in the middle, each network placed by how strong it is, open ones marked so you think twice. Clicking one opens a small card on the map to type its password and join, so joining never leaves the page. The left column is for what you keep: the network you're on, and your saved networks in the order they're tried, which you drag to change.",
        shots: [["b-map", "Joining Studio Guest from the map", ""], ["b-map-800", "At 800 px", "The map shrinks above the saved networks"]] },
      { id: "c", name: "This network first, others in a sheet", idea: "Most visits are about the network you're already on, so it fills the page: a big signal gauge and ten minutes of traffic on the right, and its own settings on the left (join automatically, band, a private address, its IP and DNS, Forget). The network's name at the top is a button; it drops a sheet of nearby networks to switch to, like the Wi-Fi menu in the bar.",
        shots: [["c-sheet", "Switching networks from the sheet", ""], ["c-sheet-800", "At 800 px", ""]] },
    ],
    icons: {
      grip: '<path d="M9 6h.01M15 6h.01M9 12h.01M15 12h.01M9 18h.01M15 18h.01" stroke-width="2.6"/>',
    },
    pages: { "a-list": page(aBody), "b-map": page(bBody), "c-sheet": page(cBody) },
  });
})();
