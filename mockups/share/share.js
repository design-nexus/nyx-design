// Share Sheet mockup: theme and screen from the URL, the sheet built from the data below.
(() => {
  const q = new URLSearchParams(location.search);
  const html = document.documentElement;
  const SCREENS = ["files", "url", "sending", "menu", "qr", "first"];
  const theme = q.get("theme") || "dark";
  const screen = SCREENS.includes(q.get("screen")) ? q.get("screen") : "files";
  html.dataset.theme = theme;

  const I = {
    share: '<path d="M12 3.5v11M7.5 8 12 3.5 16.5 8"/><path d="M8 11.5H6.5A2.5 2.5 0 0 0 4 14v4.5A2.5 2.5 0 0 0 6.5 21h11a2.5 2.5 0 0 0 2.5-2.5V14a2.5 2.5 0 0 0-2.5-2.5H16"/>',
    sliders: '<path d="M4 7h9M17 7h3M4 17h3M11 17h9M15 4.5v5M9 14.5v5"/>',
    x: '<path d="M17.5 6.5l-11 11M6.5 6.5l11 11"/>',
    "chev-l": '<path d="m15 18-6-6 6-6"/>',
    laptop: '<rect x="4.5" y="5" width="15" height="10.5" rx="2"/><path d="M2.5 19h19"/>',
    server: '<rect x="3.5" y="4" width="17" height="7" rx="2"/><rect x="3.5" y="13" width="17" height="7" rx="2"/><path d="M7.5 7.5h.01M7.5 16.5h.01" stroke-width="2.4"/>',
    phone: '<rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M11 18.5h2"/>',
    tablet: '<rect x="4.5" y="3" width="15" height="18" rx="2.5"/><path d="M11 18h2"/>',
    nas: '<rect x="5" y="3" width="14" height="18" rx="2.5"/><path d="M8.5 7h7M8.5 10.5h7"/><path d="M9 16.5h.01M12 16.5h.01" stroke-width="2.4"/>',
    "folder-down": '<path d="M3 7.5A2.5 2.5 0 0 1 5.5 5H9l2 2.2h7.5A2.5 2.5 0 0 1 21 9.7v7.8a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 17.5z"/><path d="M12 10.5v6M9.3 13.8 12 16.5l2.7-2.7"/>',
    clipboard: '<rect x="5.5" y="4.5" width="13" height="16.5" rx="2.5"/><rect x="9" y="2.5" width="6" height="4" rx="1.2"/><path d="M9 12h6M9 15.5h4"/>',
    qr: '<rect x="3.5" y="3.5" width="6.5" height="6.5" rx="1.2"/><rect x="14" y="3.5" width="6.5" height="6.5" rx="1.2"/><rect x="3.5" y="14" width="6.5" height="6.5" rx="1.2"/><path d="M14 14h2.5v2.5H14zM18 18h2.5v2.5H18zM14 20.5h1M20.5 14v1.5" />',
    bluetooth: '<path d="m7 7 10 10-5 5V2l5 5L7 17"/>',
    more: '<path d="M5 12h.01M12 12h.01M19 12h.01" stroke-width="2.8"/>',
    file: '<path d="M14 3H7.5A2.5 2.5 0 0 0 5 5.5v13A2.5 2.5 0 0 0 7.5 21h9a2.5 2.5 0 0 0 2.5-2.5V8z"/><path d="M14 3v5h5M9 13h6M9 17h4"/>',
    archive: '<rect x="3" y="4" width="18" height="5" rx="1.5"/><path d="M5 9v9.5A1.5 1.5 0 0 0 6.5 20h11a1.5 1.5 0 0 0 1.5-1.5V9M10 13h4"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
    pin: '<path d="M9 3.5h6l-1 6 3.5 3.5h-11L10 9.5z"/><path d="M12 13v7.5"/>',
    "pin-off": '<path d="M9 3.5h6l-1 6 3.5 3.5h-11L10 9.5zM12 13v7.5M3.5 3.5l17 17"/>',
    "arrow-l": '<path d="M19 12H5M11 6l-6 6 6 6"/>',
    "arrow-r": '<path d="M5 12h14M13 6l6 6-6 6"/>',
    "eye-off": '<path d="M3.5 3.5l17 17M10 5.7A9.6 9.6 0 0 1 12 5.5c6 0 9.5 6.5 9.5 6.5a17 17 0 0 1-2.8 3.6M6.3 6.9A16.7 16.7 0 0 0 2.5 12S6 18.5 12 18.5c1.6 0 3-.4 4.2-1M9.9 9.9a3 3 0 0 0 4.2 4.2"/>',
    alert: '<path d="M12 3.5 2.5 20h19z"/><path d="M12 10v4.5M12 17.5h.01" stroke-width="1.9"/>',
    refresh: '<path d="M20.5 12a8.5 8.5 0 1 1-2.6-6.1L20.5 8.5"/><path d="M20.5 3.5v5h-5"/>',
    copy: '<rect x="8" y="8" width="12.5" height="12.5" rx="2.5"/><path d="M16 8V6a2.5 2.5 0 0 0-2.5-2.5h-7.5A2.5 2.5 0 0 0 3.5 6v7.5A2.5 2.5 0 0 0 6 16h2"/>',
    download: '<path d="M12 3.5v11M7.5 10l4.5 4.5 4.5-4.5M5 20h14"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 16v-4.5M12 8h.01" stroke-width="1.9"/>',
  };
  const svg = (n) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${I[n]}</svg>`;
  const ic = (n) => `<i data-i="${n}">${svg(n)}</i>`;

  // Tiles are always dark satin, so their glyphs use the dark-theme swatches.
  const TC = { blue: "#8fb6ff", green: "#7fdcaa", amber: "#f2c46b", teal: "#6fd3de", graphite: "#c3c3cb" };
  const APP = (n) => `../../crates/nyx-icons/apps/io.github.design_nexus.nyx.${n}.svg`;
  const D = {
    g16: { n: "G16 Laptop", i: "laptop", c: "blue", via: "LAN", on: 1, pin: 1 },
    homelab: { n: "Homelab", i: "server", c: "blue", via: "Tailscale", on: 1, pin: 1 },
    pandora: { n: "Pandora", i: "phone", c: "green", via: "Flux", on: 1, pin: 1 },
    nasdocs: { n: "NAS Documents", i: "nas", c: "amber", via: "SMB", on: 1, pin: 1 },
    macbook: { n: "MacBook", i: "laptop", c: "blue", via: "Offline", off: 1, pin: 1 },
    nas: { n: "My NAS", i: "nas", c: "amber", via: "SFTP", on: 1 },
    ipad: { n: "Kitchen iPad", i: "tablet", c: "teal", via: "LocalSend", on: 1 },
    pixel: { n: "Sam’s Pixel", i: "phone", c: "teal", via: "LocalSend", on: 1 },
    clip: { n: "Copy", i: "clipboard", c: "graphite" },
    cliplink: { n: "Copy link", i: "clipboard", c: "graphite" },
    save: { n: "Save to folder", i: "folder-down", c: "graphite" },
    mail: { n: "Email", app: "Mail" },
    pulse: { n: "Telegram", app: "Pulse" },
    notes: { n: "New note", app: "Notes" },
    qr: { n: "QR code", i: "qr", c: "graphite" },
    bt: { n: "Bluetooth", i: "bluetooth", c: "blue" },
    more: { n: "More", i: "more", c: "graphite", via: "4 hidden" },
  };

  const dest = (id, st = {}) => {
    const d = D[id];
    const cls = ["dest", d.off && "off", st.focus && "focus", st.hover && "hover", st.busy != null && "busy", st.failed && "failed"].filter(Boolean).join(" ");
    const face = d.app
      ? `<span class="ic app"><img src="${APP(d.app)}" alt=""></span>`
      : `<span class="ic" style="--tc:${TC[d.c]}">${ic(d.i)}${d.on && st.busy == null && !st.failed ? '<span class="dot"></span>' : ""}${st.busy != null ? ring(st.busy) : ""}</span>`;
    const via = st.busy != null ? `${st.busy}%` : st.failed ? "Failed" : d.via;
    return `<div class="${cls}" id="d-${id}">${face}<span class="nm">${d.n}</span>${via ? `<span class="via">${via}</span>` : ""}${st.menu ? menu() : ""}</div>`;
  };
  const ring = (p) => {
    const r = 26, c = 2 * Math.PI * r;
    return `<svg class="ring" viewBox="0 0 58 58"><circle class="bg" cx="29" cy="29" r="${r}"/><circle class="fg" cx="29" cy="29" r="${r}" stroke-dasharray="${(c * p) / 100} ${c}"/></svg>`;
  };
  const menu = () => `<div class="menu pop">
      <div class="mi hover">${ic("pin-off")}<span>Unpin</span></div>
      <div class="mi">${ic("arrow-l")}<span>Move left</span><span class="key">Ctrl ←</span></div>
      <div class="mi">${ic("arrow-r")}<span>Move right</span><span class="key">Ctrl →</span></div>
      <div class="mi">${ic("eye-off")}<span>Hide</span></div>
      <hr>
      <div class="mi">${ic("sliders")}<span>Sharing settings…</span></div>
    </div>`;
  const section = (title, ids, st = {}, extra = "") =>
    `<div class="sec"><div class="sec-h">${title}${extra}</div><div class="tiles">${ids.map((id) => dest(id, st[id])).join("")}</div></div>`;
  const looking = '<span class="live">Looking</span>';

  const P = {
    files: `<div class="preview card"><div class="stack"><span class="doc">${ic("file")}</span><span class="art g3"></span><span class="doc">${ic("archive")}</span></div>
      <div class="grow"><div class="pt ellipsis">Q3 report.pdf, beach.jpg and 1 more</div><div class="ps">3 items · 24.1 MB</div></div></div>`,
    url: `<div class="preview card"><span class="thumb link">${ic("globe")}</span>
      <div class="grow"><div class="pt ellipsis">Nyx Design 2.0</div><div class="ps ellipsis">https://design-nexus.github.io/nyx-design</div></div></div>`,
    image: `<div class="preview card"><span class="thumb art g10"></span>
      <div class="grow"><div class="pt ellipsis">Screenshot 2026-10-30 21-14.png</div><div class="ps">1 image · 1.2 MB</div></div></div>`,
  };

  const filesPinned = ["g16", "homelab", "pandora", "nasdocs", "nas", "macbook"];
  const filesApps = ["save", "mail", "pulse", "notes", "bt", "more"];
  const jobs = `<div class="sec"><div class="sec-h">Transfers</div><div class="card jobs">
      <div class="opt"><span class="mini" style="--tc:${TC.blue}">${ic("laptop")}</span>
        <div class="opt-text"><div class="jt">Sending 3 items to G16 Laptop</div><div class="js">14.9 of 24.1 MB · 11.2 MB/s · about 1 s left</div><div class="bar"><span style="width:62%"></span></div></div>
        <div class="acts"><button class="ib">${ic("x")}</button></div></div>
      <div class="opt"><span class="mini err">${ic("alert")}</span>
        <div class="opt-text"><div class="jt">Couldn’t reach Homelab</div><div class="js">Tried the LAN (192.168.1.20) and Tailscale (homelab). Nothing was sent.</div></div>
        <div class="acts"><button class="btn">Retry</button></div></div>
    </div><div class="foot-note">${ic("info")}Sending continues if you close this window.</div></div>`;

  const qrSvg = () => {
    const n = 29, cells = [];
    let s = 7;
    const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
    const finder = (x, y) => x < 7 && y < 7 && (x === 0 || y === 0 || x === 6 || y === 6 || (x > 1 && x < 5 && y > 1 && y < 5));
    const inFinder = (x, y) => (x < 8 && y < 8) || (x > n - 9 && y < 8) || (x < 8 && y > n - 9);
    for (let y = 0; y < n; y++)
      for (let x = 0; x < n; x++) {
        let on;
        if (x < 8 && y < 8) on = finder(x, y);
        else if (x > n - 9 && y < 8) on = finder(x - (n - 7), y);
        else if (x < 8 && y > n - 9) on = finder(x, y - (n - 7));
        else on = !inFinder(x, y) && rnd() > 0.52;
        if (on) cells.push(`<rect x="${x}" y="${y}" width="1.02" height="1.02"/>`);
      }
    return `<svg viewBox="0 0 ${n} ${n}" shape-rendering="crispEdges" fill="#111">${cells.join("")}</svg>`;
  };

  const B = {
    files: P.files + section("Pinned", filesPinned, { g16: { focus: 1 } }) + section("Nearby", ["ipad", "pixel"], {}, looking) + section("Apps &amp; services", filesApps),
    url: P.url + section("Pinned", ["g16", "homelab", "pandora", "macbook"], { pandora: { focus: 1 } }) + section("Nearby", ["ipad", "pixel"], {}, looking) + section("Apps &amp; services", ["cliplink", "qr", "mail", "pulse", "notes", "more"]),
    sending: P.files + section("Pinned", filesPinned, { g16: { busy: 62 }, homelab: { failed: 1 } }) + section("Apps &amp; services", filesApps) + jobs,
    menu: P.files + section("Pinned", filesPinned, { homelab: { hover: 1, menu: 1 } }) + section("Nearby", ["ipad", "pixel"], {}, looking) + section("Apps &amp; services", filesApps),
    qr: `<div class="qr-wrap"><div class="qr">${qrSvg()}</div>
      <div class="qr-cap"><div class="pt">Nyx Design 2.0</div><div class="ps">https://design-nexus.github.io/nyx-design</div></div>
      <div class="qr-acts"><button class="btn">${ic("copy")}Copy image</button><button class="btn">${ic("download")}Save image…</button></div></div>`,
    first: P.image + section("Apps &amp; services", ["clip", "save"], { clip: { focus: 1 } }),
  };
  const SUB = { files: "3 items", url: "Link", sending: "3 items", menu: "3 items", qr: "QR code", first: "1 image" };
  const start = screen === "qr" ? `<button class="ib">${ic("chev-l")}</button>` : `<span style="color:var(--accent);display:inline-flex;margin-right:8px">${ic("share")}</span>`;

  const ready = () => {
    document.body.classList.add("after", "v-blended");
    document.getElementById("desk").innerHTML = `<div class="sheet">
      <div class="sh-hdr">${start}<div class="grow"><span class="app-name">Share</span><span class="app-sub"><span class="sep">/</span>${SUB[screen]}</span></div>
        <button class="ib">${ic("sliders")}</button><button class="ib">${ic("x")}</button></div>
      <div class="sh-body">${B[screen]}</div></div>`;
    document.querySelectorAll(".sh-hdr i[data-i]").forEach((el) => (el.style.cssText += ";width:16px;height:16px"));
    if (q.get("shot") === "1") return;
    const bar = document.createElement("nav");
    bar.className = "mock-switch";
    const link = (key, val, label) => {
      const p = new URLSearchParams(location.search);
      p.set(key, val);
      const on = (key === "theme" ? theme : screen) === val;
      return `<a class="${on ? "on" : ""}" href="?${p}">${label}</a>`;
    };
    const names = { files: "Files", url: "Link", sending: "Sending", menu: "Menu", qr: "QR code", first: "First release" };
    bar.innerHTML = SCREENS.map((s) => link("screen", s, names[s])).join("") + "<span></span>" + link("theme", "dark", "Dark") + link("theme", "light", "Light");
    document.body.append(bar);
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", ready);
  else ready();
})();
