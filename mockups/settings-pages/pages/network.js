// Connections › Network: two style-B layouts.
(() => {
  const DESC = "Wired and Wi-Fi connections, DNS, VPNs, Tailscale and the firewall.";
  const page = (body) => () => swin({ sec: "connections", page: "Network", desc: DESC, body: body() });
  const S = "connections";

  /* ── A: the way out, drawn ───────────────────────────────────────── */
  const aCtl = () => `
    ${ocard("Connections", [
      orow("Wi-Fi", "Home-5G · 192.168.1.24", `<span class="pill dot">Connected</span>`, { ic: "wifi", sec: S }),
      orow("Ethernet", "Plug in a cable or a dock", `<span class="rv">Not plugged in</span>`, { ic: "network", sec: S }),
    ], { first: true, cls: "icons" })}
    ${ocard("On the way out", [
      orow("VPN", "Mullvad · Stockholm", sw(true), { ic: "lock", sec: S }),
      orow("DNS", "Which servers look up website names", dd("Cloudflare"), { ic: "globe", sec: S }),
      orow("Tailscale", "Your own devices, from anywhere", sw(true), { ic: "share", sec: S }),
      orow("Block incoming connections", "Only the ports you allow get in", sw(true), { ic: "shield", sec: S }),
    ], { cls: "icons" })}
    ${ocard("", [
      nrow("VPN services", "Add, sign in, and pick the Control Center's", "2", { ic: "lock", sec: S }),
      nrow("Firewall rules", "", "3 allowed", { ic: "shield", sec: S }),
      nrow("Tools", "Wi-Fi band, speed test, restart Wi-Fi", "", { ic: "wrench", sec: S }),
    ], { cls: "icons nw-more" })}`;
  // [icon, title, sub, badge, cls]
  const HOPS = [["laptop", "Atlas", "Firewall on · 3 ports open", "shield", "me"], ["wifi", "Home-5G", "Wi-Fi · 192.168.1.24", "", ""], ["server", "Router", "192.168.1.1", "", ""], ["lock", "Mullvad", "VPN · Stockholm · 10.64.0.7", "", "vpn"], ["globe", "Internet", "Seen as 203.0.113.40, in Sweden", "", "end"]];
  const hop = ([ic, t, s, b, cls], i) => `<div class="nh ${cls}"><span class="nd">${icon(ic)}${b ? `<em>${icon(b)}</em>` : ""}</span><div class="nt"><b>${t}${i === 3 ? ` <span class="pill">${icon("lock")}Private</span>` : ""}</b><span>${s}</span>${i === 3 ? dns() : ""}</div></div>`;
  const dns = () => `<div class="nw-dns"><span class="nd sm">${icon("search")}</span><div><b>Cloudflare DNS</b><span>1.1.1.1 · looks up names inside the tunnel</span></div></div>`;
  const SHORT = ["Firewall on", "Wi-Fi", "192.168.1.1", "VPN", "Seen in Sweden"];
  const aPv = () => `${pvhead("Your way out", "How this computer reaches the internet, step by step.", btn("Test speed", "sm", "refresh"))}
     <div class="nw-a">
       <div class="nw-path card">
         ${HOPS.map(hop).join("")}
       </div>
       <div class="nw-side">
         <div class="card nw-speed"><small>Last speed test</small><div class="sp2r"><div><b>412</b><span>Mb/s down</span></div><div><b>38</b><span>Mb/s up</span></div></div><span class="dim">Ping 14 ms · 2 hours ago</span></div>
         <div class="card nw-tail"><div class="th">${icon("share")}<b>Tailscale</b><span class="sp"></span><span class="pill dot">On</span></div>
           ${[["Atlas", "100.88.4.12 · this one", true], ["Studio PC", "100.88.4.20", true], ["Home NAS", "100.88.4.31", true], ["Lumen Phone", "Offline 2 days", false]].map(([n, a, on]) => `<div class="tr"><i class="${on ? "on" : ""}"></i><div><b>${n}</b><span>${a}</span></div></div>`).join("")}
         </div>
       </div>
     </div>
     <div class="nw-hpath">${HOPS.map(([ic, t, s, b, cls], i) => `<div class="hh ${cls}"><span class="nd">${icon(ic)}</span><b>${t}</b><span>${SHORT[i]}</span></div>`).join(`<span class="hl"></span>`)}</div>
     <div class="pvfoot">${icon("check-c")}<span>Everything leaving Atlas goes through Mullvad. Local devices like the printer still work.</span></div>`;
  const aBody = () => split(aCtl(), aPv(), { sec: S, cls: "nw-pa" });

  /* ── B: topics, one open at a time ───────────────────────────────── */
  const TOPICS = [["wifi", "Connections", "Wi-Fi · Home-5G"], ["globe", "DNS", "Cloudflare"], ["lock", "VPN", "Mullvad · on"], ["share", "Tailscale", "3 of 4 online"], ["shield", "Firewall", "On · 3 allowed"], ["wrench", "Tools", "Speed, band, restart"]];
  const topics = (on) => ocard("", TOPICS.map(([ic, t, s]) => `<div class="opt nt ${t === on ? "picked" : ""}"><span class="lic" style="--tc:var(--sec-connections)">${icon(ic)}</span><div class="opt-text"><div>${t}</div><div class="d">${s}</div></div>${icon("chev-r", "cv")}</div>`), { cls: "icons nw-topics" })
    + ocard("Right now", [`<div class="nw-now"><div><b>412</b><span>Mb/s down</span></div><div><b>38</b><span>Mb/s up</span></div><div><b>14</b><span>ms ping</span></div></div>`, orow("Seen online as", "203.0.113.40 · Sweden, through Mullvad", btn("Test", "sm"))], { cls: "nw-nowc" });
  const bFirewall = () => `${pvhead("Firewall", "Other computers can only reach the ports you allow.", sw(true))}
     <div class="nw-wall card">
       <div class="wl-in">${[["Studio PC", "Nearby sharing", true], ["Unknown", "Port 3389", false], ["Phone", "SSH", true], ["Unknown", "Port 445", false]].map(([n, p, ok]) => `<div class="wl-r ${ok ? "ok" : "no"}"><b>${n}</b><span>${p}</span><i class="ar"></i>${icon(ok ? "check" : "x")}</div>`).join("")}</div>
       <div class="wl-shield">${icon("shield")}<b>Atlas</b><span>Blocking the rest</span></div>
     </div>
     ${ocard("Allowed in", [
       orow("SSH", "22/tcp · from anywhere", btn("Remove", "sm ghost"), { ic: "terminal", sec: S }),
       orow("Nearby sharing", "53317/tcp · from this network", btn("Remove", "sm ghost"), { ic: "send", sec: S }),
       orow("Media server", "8096/tcp · from 192.168.1.0/24", btn("Remove", "sm ghost"), { ic: "film", sec: S }),
       `<div class="opt nw-add"><span class="field">${icon("plus")}<span class="ph">A port, like 8080 or 8080/tcp</span></span>${dd("From anywhere")}${btn("Allow", "primary sm")}</div>`,
     ], { cls: "icons", act: `<span class="note">Showing the rules asked for your password</span>` })}
     <div class="pvfoot">${icon("check-c")}<span>14 attempts turned away today, most recently on port 445 from 192.168.1.77.</span></div>`;
  const VPNS = [["Mullvad", "Account number", "M", "amber", true], ["NordVPN", "Sign in in the browser", "N", "blue", false], ["Proton VPN", "App or WireGuard file", "P", "violet", false], ["ExpressVPN", "Activation code", "E", "red", false], ["Private Internet Access", "Sign in once in its app", "PI", "green", false], ["Surfshark", "WireGuard file", "S", "teal", false], ["Windscribe", "WireGuard file", "W", "graphite", false], ["Other", "A .conf or .ovpn file", "+", "graphite", false]];
  const bVpn = () => `${pvhead("VPN", "Services set up here; the Control Center's VPN tile connects the one you choose.", btn("Add a VPN", "sm primary", "plus"))}
     ${ocard("", [
       orow("Mullvad", "WireGuard · Stockholm · connected 2 h", `${sw(true)}`, { ic: "lock", sec: S }),
       orow("Proton VPN", "WireGuard file · not connected", `${btn("Remove", "sm ghost")}${sw(false)}`, { ic: "lock", sec: S }),
       orow("In the Control Center", "The one its VPN tile connects", dd("Mullvad"), { ic: "sliders", sec: S }),
     ], { cls: "icons" })}
     <div class="gtitle">Add a service</div>
     <div class="nw-vg">${VPNS.map(([n, d, l, c, on]) => `<div class="vg card ${on ? "has" : ""}"><span class="vl" style="background:var(--sw-${c})">${l}</span><div><b>${n}</b><span>${on ? "Set up" : d}</span></div></div>`).join("")}</div>
     <div class="pvfoot">${icon("info")}<span>Services with their own app are installed and signed in here; others come as a file from your account page.</span></div>`;
  const bBody = (on, pv) => () => split(topics(on), pv(), { sec: S, cls: "nw-pb", ctlw: 300 });

  REG("network", {
    name: "Network",
    summary: "Today Network is a column of groups: the connection as one line of text, DNS with a dropdown and a box for custom servers, then Tools, Firewall, Tailscale and NordVPN as folds you open one by one. VPN accounts live on another page, Online Accounts, and a wired connection only shows once it's plugged in.",
    problems: [
      "<b>The connection is one line:</b> “Wi-Fi (wlo1) · SkyNet · 192.168.1.196/24”, with the device's internal name and the address in network notation.",
      "<b>A text box that's always there:</b> “Custom DNS servers” shows even when the provider is “From the network”, with an example in its description.",
      "<b>Folds hide the important parts:</b> whether the firewall is on, or Tailscale connected, is inside a closed group; the page doesn't say until you open it.",
      "<b>VPNs are split up:</b> NordVPN has a fold here, but adding a VPN and choosing the Control Center's is on Online Accounts.",
      "<b>Nothing shows how it fits together:</b> no picture of whether traffic goes through the VPN, which DNS is used, or what's let in.",
      "<b>At 800 px</b> descriptions wrap (“Changing it asks for your password”, “e.g. 8080/tcp. Press Enter.”) and the rules field runs off the bottom.",
    ],
    today: [["network-1280", "Today", ""], ["network-800", "Today at 800 px", ""]],
    options: [
      { id: "a", name: "Your way out, drawn", idea: "The right draws the path from this computer to the internet, one step per line: Atlas with its firewall, the Wi-Fi network, the router, the VPN tunnel, and where the internet sees you, with DNS hanging off the step that does the lookups. Beside it the last speed test and your Tailscale devices. The left is short: your connections, then the four switches that change the path (VPN, DNS, Tailscale, the firewall), and rows into VPN services, rules and tools.",
        shots: [["a-path", "The path through Mullvad", ""], ["a-path-800", "At 800 px", "The path across the top"]] },
      { id: "b", name: "Topics, one open at a time", idea: "The left is a list of the six topics, each with its state (Cloudflare, Mullvad on, firewall on with 3 allowed), so the page answers “is it on” without opening anything. Picking one fills the right: the firewall as a picture of what's let in and what's turned away, then the allowed ports and a single line to add one; the VPN as your services plus every provider to add, moved here from Online Accounts.",
        shots: [["b-firewall", "Firewall open", ""], ["b-vpn-800", "VPN at 800 px", "The topic above the list"]] },
    ],
    pages: { "a-path": page(aBody), "b-firewall": page(bBody("Firewall", bFirewall)), "b-vpn": page(bBody("VPN", bVpn)) },
  });
})();
