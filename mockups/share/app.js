// Share app mockup: a compact floating window. Theme and screen from the URL.
(() => {
  const q = new URLSearchParams(location.search);
  const html = document.documentElement;
  const SCREENS = ["nearby", "sending", "incoming", "transfers", "settings", "empty"];
  const theme = q.get("theme") || "dark";
  const screen = SCREENS.includes(q.get("screen")) ? q.get("screen") : "nearby";
  html.dataset.theme = theme;

  const I = {
    share: '<path d="M12 3.5v11M7.5 8 12 3.5 16.5 8"/><path d="M8 11.5H6.5A2.5 2.5 0 0 0 4 14v4.5A2.5 2.5 0 0 0 6.5 21h11a2.5 2.5 0 0 0 2.5-2.5V14a2.5 2.5 0 0 0-2.5-2.5H16"/>',
    radar: '<circle cx="12" cy="12" r="2"/><path d="M16.2 7.8a6 6 0 0 1 0 8.4M7.8 16.2a6 6 0 0 1 0-8.4M19 5a10 10 0 0 1 0 14M5 19A10 10 0 0 1 5 5"/>',
    sliders: '<path d="M4 7h9M17 7h3M4 17h3M11 17h9M15 4.5v5M9 14.5v5"/>',
    refresh: '<path d="M20.5 12a8.5 8.5 0 1 1-2.6-6.1L20.5 8.5"/><path d="M20.5 3.5v5h-5"/>',
    upload: '<path d="M12 15.5V4M7.5 8.5 12 4l4.5 4.5M5 20h14"/>',
    file: '<path d="M14 3H7.5A2.5 2.5 0 0 0 5 5.5v13A2.5 2.5 0 0 0 7.5 21h9a2.5 2.5 0 0 0 2.5-2.5V8z"/><path d="M14 3v5h5M9 13h6M9 17h4"/>',
    archive: '<rect x="3" y="4" width="18" height="5" rx="1.5"/><path d="M5 9v9.5A1.5 1.5 0 0 0 6.5 20h11a1.5 1.5 0 0 0 1.5-1.5V9M10 13h4"/>',
    phone: '<rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M11 18.5h2"/>',
    tablet: '<rect x="4.5" y="3" width="15" height="18" rx="2.5"/><path d="M11 18h2"/>',
    laptop: '<rect x="4.5" y="5" width="15" height="10.5" rx="2"/><path d="M2.5 19h19"/>',
    x: '<path d="M17.5 6.5l-11 11M6.5 6.5l11 11"/>',
    check: '<path d="M20 6.5 9 17.5l-5-5"/>',
    up: '<path d="M12 19V5M6 11l6-6 6 6"/>',
    down: '<path d="M12 5v14M6 13l6 6 6-6"/>',
    alert: '<path d="M12 3.5 2.5 20h19z"/><path d="M12 10v4.5M12 17.5h.01" stroke-width="1.9"/>',
    folder: '<path d="M3 7.5A2.5 2.5 0 0 1 5.5 5H9l2 2.2h7.5A2.5 2.5 0 0 1 21 9.7v7.8a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 17.5z"/>',
    text: '<path d="M4 6h16M4 12h10M4 18h7"/>',
    chev: '<path d="m6 9 6 6 6-6"/>',
    back: '<path d="m15 18-6-6 6-6"/>',
  };
  const ic = (n, cls = "") => `<i data-i="${n}" class="${cls}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${I[n]}</svg></i>`;

  const DEV = {
    pixel: { n: "Pixel 8", sub: "Android", i: "phone", key: "4BAD … 52FA" },
    ipad: { n: "Kitchen iPad", sub: "iPadOS", i: "tablet", key: "91C0 … 0B13" },
    g16: { n: "G16 Laptop", sub: "Linux", i: "laptop", key: "E2F1 … 7D40" },
    mac: { n: "MacBook", sub: "macOS", i: "laptop", key: "5A3B … C2D8" },
  };
  const dev = (id, st = {}) => {
    const d = DEV[id];
    const can = !!st.items;
    let middle = `<div class="sub">${d.sub} · LocalSend <span class="key">· ${d.key}</span></div>`;
    let right = `<button class="btn ${can ? "primary" : ""}" ${can ? "" : "disabled"}>Send</button>`;
    if (st.progress != null) {
      middle = `<div class="sub">Sending · ${st.progress}% · 11.2 MB/s</div><div class="bar"><span style="width:${st.progress}%"></span></div>`;
      right = `<button class="ib">${ic("x")}</button>`;
    } else if (st.done) {
      middle = `<div class="sub"><span class="ok">${ic("check")}Sent 3 items</span></div>`;
      right = `<button class="btn">Again</button>`;
    }
    return `<div class="opt ${st.cls || ""}"><span class="dev-ic">${ic(d.i)}<span class="dot"></span></span>
      <div class="opt-text"><div class="nm">${d.n}</div>${middle}</div>${right}</div>`;
  };

  const trayEmpty = `<div class="card tray idle"><span class="drop">${ic("upload")}</span>
    <div class="grow"><div class="pt">Drop files to send</div><div class="ps">Or choose files or text, then a device.</div></div>
    <button class="btn">${ic("file")}Files…</button><button class="btn">${ic("text")}Text…</button></div>`;
  const trayFull = `<div class="card tray"><div class="thumbs"><span class="doc">${ic("file")}</span><span class="art g3"></span><span class="doc">${ic("archive")}</span></div>
    <div class="grow"><div class="pt ellipsis">Q3 report.pdf, beach.jpg and 1 more</div><div class="ps">3 items · 24.1 MB</div></div>
    <button class="ib">${ic("x")}</button></div>`;

  const devices = (st) => `<div class="sec"><div class="sec-h">Nearby devices<span class="live">Looking</span></div>
    <div class="card devs">${["pixel", "ipad", "g16", "mac"].map((d) => dev(d, st[d])).join("")}</div></div>`;

  const nearby = (state) => {
    if (state === "sending") {
      return trayFull + devices({ pixel: { items: 1, progress: 62 }, ipad: { items: 1 }, g16: { items: 1 }, mac: { items: 1, done: true } });
    }
    return trayEmpty + devices({ pixel: { cls: "hover" } });
  };

  const empty = `${trayEmpty}<div class="sec"><div class="sec-h">Nearby devices<span class="live">Looking</span></div>
    <div class="card empty empty-list">${ic("radar")}<div class="t">No devices nearby yet</div>
    <div class="d">Open LocalSend on your phone or computer, on the same network.</div>
    <button class="btn" style="margin-top:6px">${ic("refresh")}Look again</button></div></div>`;

  const transfers = () => {
    const row = (dir, title, sub, st, when, extra = "") =>
      `<div class="opt"><span class="dir ${dir}">${ic(dir === "out" ? "up" : dir === "in" ? "down" : "alert")}</span>
       <div class="opt-text"><div class="t ellipsis">${title}</div><div class="d">${sub}</div></div>${extra}
       <div class="right"><span class="st ${dir === "bad" ? "bad" : ""}">${st}</span><span class="when">${when}</span></div></div>`;
    return `<div class="sec"><div class="sec-h">Today</div><div class="card tx">
      ${row("out", "Q3 report.pdf and 2 more", "To Pixel 8 · 24.1 MB", '62%<div class="mini-bar"><span style="width:62%"></span></div>', "22:41", `<button class="ib">${ic("x")}</button>`)}
      ${row("in", "IMG_2041.HEIC, IMG_2042.HEIC", "From Kitchen iPad · 6.8 MB", "Received", "21:58", `<button class="ib">${ic("folder")}</button>`)}
      ${row("out", "design-nexus.github.io/nyx-design", "To MacBook · link", "Sent", "20:12")}
      ${row("bad", "Holiday video.mkv", "From Pixel 8 · 1.1 GB", "Declined", "19:30")}
    </div></div>
    <div class="sec"><div class="sec-h">Yesterday</div><div class="card tx">
      ${row("in", "boarding-pass.pdf", "From Pixel 8 · 182 kB", "Received", "08:03", `<button class="ib">${ic("folder")}</button>`)}
      ${row("out", "screenshot-2026-10-29.png", "To G16 Laptop · 1.2 MB", "Sent", "17:46")}
    </div></div>`;
  };

  const settings = `<div class="gtitle first">This computer</div><div class="card">
      <div class="opt"><div class="opt-text"><div class="t">Device name</div><div class="d">What nearby devices see.</div></div><span class="entry">Hades</span></div>
      <div class="opt"><div class="opt-text"><div class="t">Visible to nearby devices</div><div class="d">While Share is open, and a minute after you share.</div></div><span class="switch on"></span></div>
      <div class="opt"><div class="opt-text"><div class="t">Device key</div><div class="d">Others can check it matches what they see.</div></div><span class="t-sec">DADE 906B … 0B30 C50C</span></div>
    </div>
    <div class="gtitle">Receiving</div><div class="card">
      <div class="opt"><div class="opt-text"><div class="t">Save received files to</div></div><span class="dd">Downloads${ic("chev")}</span></div>
      <div class="opt"><div class="opt-text"><div class="t">Ask before receiving</div><div class="d">Trusted devices come with My computers.</div></div><span class="switch on locked"></span></div>
    </div>
    <div class="gtitle">App</div><div class="card">
      <div class="opt"><div class="opt-text"><div class="t">Appearance, keyboard and about</div></div><span class="dd">Open${ic("chev")}</span></div>
    </div><div style="height:16px"></div>`;

  const offer = `<div class="veil"><div class="offer">
    <div class="who"><span class="dev-ic">${ic("phone")}</span><div><div class="t">Pixel 8 wants to send you 3 files</div><div class="d">1.1 GB · LocalSend · 192.168.1.42</div></div></div>
    <div class="card files"><div class="opt"><div class="opt-text">Holiday video.mkv</div><span class="sz">1.1 GB</span></div>
      <div class="opt"><div class="opt-text">IMG_2041.HEIC</div><span class="sz">3.4 MB</span></div>
      <div class="opt"><div class="opt-text">IMG_2042.HEIC</div><span class="sz">3.4 MB</span></div></div>
    <div class="note">Device key 4BAD DE53 … 52FA · Saves to ~/Downloads</div>
    <div class="buttons"><button class="btn">Decline</button><button class="btn primary">Accept</button></div></div></div>`;

  const isSettings = screen === "settings";
  const tab = screen === "transfers" ? "transfers" : "nearby";
  const body = {
    nearby: nearby("nearby"),
    sending: nearby("sending"),
    incoming: nearby("nearby"),
    transfers: transfers(),
    settings,
    empty,
  }[screen];
  const foot = isSettings ? "" : `<div class="foot"><span class="switch on"></span><span class="t">Visible as Hades</span><span class="d live">Receiving to Downloads</span><button class="ib">${ic("sliders")}</button></div>`;

  const header = isSettings
    ? `<div class="sh-hdr"><button class="ib">${ic("back")}</button><div class="grow"><span class="app-name">Share</span><span class="app-sub"><span class="sep">/</span>Settings</span></div><button class="ib">${ic("x")}</button></div>`
    : `<div class="sh-hdr"><span style="color:var(--accent);display:inline-flex;margin-right:6px">${ic("share")}</span><span class="app-name">Share</span>
        <span class="seg"><button class="${tab === "nearby" ? "on" : ""}">Nearby</button><button class="${tab === "transfers" ? "on" : ""}">Transfers</button></span>
        <button class="ib">${ic("refresh")}</button><button class="ib">${ic("x")}</button></div>`;

  const ready = () => {
    document.body.classList.add("after", "v-blended");
    document.body.innerHTML = `<div class="desk"><div class="sheet app">${header}<div class="sh-body">${body}</div>${foot}${screen === "incoming" ? offer : ""}</div></div>`;
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
    const names = { nearby: "Nearby", sending: "Sending", incoming: "Incoming", transfers: "Transfers", settings: "Settings", empty: "No devices" };
    bar.innerHTML = SCREENS.map((s) => link("screen", s, names[s])).join("") + "<span></span>" + link("theme", "dark", "Dark") + link("theme", "light", "Light") + '<span></span><a href="share.html">Share Sheet</a>';
    document.body.append(bar);
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", ready);
  else ready();
})();
