// Activity › Network.
(() => {
  const wifi = (o = {}) => acard("Wi-Fi · SkyNet", `${readings([["Down", "2.2 KB/s", "since boot 55.7 GB"], ["Up", "74 B/s", "since boot 16.6 GB"], ["Signal", "Fair", "−70 dBm"], ["Link", "721 Mb/s", "6 GHz · channel 37"]], { cls: "sm", cols: NARROW ? 2 : 4 })}${graph(shaped(5, 60, .08, .05, [[.9, .6, .02]]), "var(--sw-pink)", o.h || 110, { top: "10 KB/s", more: [[shaped(9, 60, .03, .02), "var(--sw-graphite)"]] })}`, { ic: "wifi", meta: "wlo1 · Wi-Fi 7", end: `<span class="nw-ok">${icon("check-c")}Connected</span>` });
  const virt = () => acard("Virtual", [["incusbr0", "Containers' bridge", "0 B/s"], ["tap0aaa1277", "A container's link", "0 B/s"], ["tailscale0", "Tailscale", "12 B/s"]].map(([n, d, v]) => `<div class="nw-v"><span class="n">${n}</span><span class="d">${d}</span><span class="v">${v}</span></div>`).join(""), { ic: "layers", meta: "3 links, quiet", end: `<span class="nw-more">${icon("chev-r")}</span>` });
  const conns = () => acard("Connections", `${readings([["Open", "214", "TCP and UDP"], ["Listening", "11", "ports"], ["Waiting to close", "6", ""]], { cls: "sm" })}${[["Firefox", "coral", "86 open"], ["Syncthing", "graphite", "24 open"], ["Code - OSS", "blue", "9 open"], ["sshd", "graphite", "listening on 22"]].map(([n, c, v]) => appRow([n, c], v)).join("")}`, { ic: "eth" });

  /* A: the real connections first; virtual ones folded into one quiet card. */
  const pageA = () => `<div class="ap-body scroll">${wifi()}<div class="ap-grid" style="--cols:${NARROW ? 1 : 2}">${conns()}${virt()}</div></div>`;

  /* B: lanes: every link as a line of traffic on one clock, quiet ones shrink to a row. */
  const LANES = [["Wi-Fi · SkyNet", "pink", "2.2 KB/s ↓ · 74 B/s ↑", .1, true], ["Tailscale", "blue", "12 B/s", .02], ["incusbr0", "graphite", "Quiet", 0], ["tap0aaa1277", "graphite", "Quiet", 0]];
  const pageB = () => `<div class="ap-body scroll">
    ${phead("Network", "4 links · 1 connected to the internet", seg(["1 min", "10 min", "1 h"], "10 min"))}
    <div class="card nw-lanes">${LANES.map(([n, c, v, base, big], i) => `<div class="nw-lane ${base === 0 ? "quiet" : ""}"><div class="lb"><b>${n}</b><span>${v}</span></div>${base === 0 ? `<span class="nw-flat"></span>` : gline(shaped(i + 5, 60, base, base / 2, big ? [[.9, .6, .02]] : []), `var(--sw-${c})`, big ? 70 : 30)}</div>`).join("")}<div class="nw-ax"><span></span><span>10 min ago</span><span>Now</span></div></div>
    <div class="ap-grid" style="--cols:${NARROW ? 1 : 2}">${conns()}${acard("Wi-Fi", kv([["Signal", "Fair · −70 dBm"], ["Band", "6 GHz · channel 37 · 160 MHz"], ["Standard", "Wi-Fi 7"], ["Link speed", "721 Mb/s down · 432 up"], ["Address", "192.168.1.196"]]), { ic: "wifi" })}</div>
  </div>`;

  /* C: compact: one card per link with only what changes, and the details one click down. */
  const pageC = () => `<div class="ap-body scroll"><div class="ap-grid" style="--cols:${NARROW ? 1 : 3}">
    ${[["wifi", "Wi-Fi · SkyNet", "2.2 KB/s", "↑ 74 B/s · signal fair", .1, "pink"], ["shield", "Tailscale", "12 B/s", "4 devices online", .02, "blue"], ["layers", "incusbr0", "0 B/s", "Containers' bridge", 0, "graphite"]].map(([ic, n, v, s, b, c], i) => acard(n, `${readings([["Down", v, s]], { cls: "sm" })}${b ? gline(shaped(i + 5, 50, b, b / 2), `var(--sw-${c})`, 46) : `<span class="nw-flat tall"></span>`}`, { ic, end: `<span class="nw-more">${icon("chev-r")}</span>` })).join("")}
  </div>${conns()}</div>`;

  REG("network", {
    name: "Network",
    summary: "Network has a card for every link, real or virtual, each with a connection panel, a traffic graph and a folded “Link diagnostics” section. On a machine with containers that's most of the page spent on links that never carry anything.",
    problems: [
      "<b>Virtual links get the same space as Wi-Fi</b>: incusbr0 and every container's tap link have a full card with “0% of link” and an empty graph.",
      "<b>−70 dBm in large type</b> is the headline for Wi-Fi; “Fair” is a small word in the corner.",
      "<b>Two graphs per card</b> (one per direction would do), both scaled to the link's speed, so normal traffic is a flat line.",
      "<b>Link diagnostics and configuration</b> is folded under every card, the same words repeated down the page.",
      "<b>Which apps are talking</b> isn't shown, though Activity counts each app's open connections.",
    ],
    today: [["network-1280", "Today at 1280 px", "Wi-Fi, then a card per virtual link"], ["network-800", "Today at 800 px", ""]],
    options: [
      { id: "a", name: "The real link first", idea: "Wi-Fi (or Ethernet) as one card with its readings in plain words (Signal: Fair) and one graph, then the apps with open connections, and the virtual links folded into one quiet card that opens to the list.",
        shots: [["a-net", "Network", "Wi-Fi, connections by app, virtual links folded"], ["a-net-800", "At 800 px", ""]] },
      { id: "b", name: "Lanes on one clock", idea: "Every link as a lane on one shared clock; quiet links shrink to a thin line instead of an empty graph. Below, the apps with open connections and the Wi-Fi details.",
        shots: [["b-net", "Network", "Lanes, quiet links as thin lines"]] },
      { id: "c", name: "Compact cards", idea: "A small card per link with only what changes (how fast it's going, a short graph), and everything else one click down on the link's own page. Best with many links.",
        shots: [["c-net", "Network", "A card per link, details one click down"]] },
    ],
    pages: { "a-net": () => apage("network", pageA()), "b-net": () => apage("network", pageB()), "c-net": () => apage("network", pageC()) },
  });
})();
