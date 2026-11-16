// Mockup runtime: variant, theme and screen from the URL; inline icons; the switcher.
(() => {
  const q = new URLSearchParams(location.search);
  const html = document.documentElement;
  const v = q.get("v") || "blended";
  const theme = q.get("theme") || "dark";
  const screen = q.get("screen") || html.dataset.screens?.split(",")[0] || "";
  html.dataset.theme = theme;
  html.dataset.screen = screen;
  if (html.dataset.accent) html.style.setProperty("--app-accent", `var(--sw-${html.dataset.accent})`);
  if (v === "sheet" || v === "sheet2") document.head.insertAdjacentHTML("beforeend", '<link rel="stylesheet" href="../sheet/sheet.css">');

  const I = {
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    sliders: '<path d="M4 7h9M17 7h3M4 17h3M11 17h9M15 4.5v5M9 14.5v5"/>',
    sidebar: '<rect x="3" y="4.5" width="18" height="15" rx="3"/><path d="M9.5 4.5v15"/>',
    "chev-l": '<path d="m15 18-6-6 6-6"/>',
    "chev-r": '<path d="m9 18 6-6-6-6"/>',
    "chev-d": '<path d="m6 9 6 6 6-6"/>',
    "chev-u": '<path d="m6 15 6-6 6 6"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    more: '<path d="M5 12h.01M12 12h.01M19 12h.01" stroke-width="2.8"/>',
    folder: '<path d="M3 7.5A2.5 2.5 0 0 1 5.5 5H9l2 2.2h7.5A2.5 2.5 0 0 1 21 9.7v7.8a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 17.5z"/>',
    "folder-fill": '<path fill="currentColor" stroke="none" d="M3 7.5A2.5 2.5 0 0 1 5.5 5H9l2 2.2h7.5A2.5 2.5 0 0 1 21 9.7v7.8a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 17.5z"/>',
    file: '<path d="M14 3H7.5A2.5 2.5 0 0 0 5 5.5v13A2.5 2.5 0 0 0 7.5 21h9a2.5 2.5 0 0 0 2.5-2.5V8z"/><path d="M14 3v5h5"/>',
    "file-text": '<path d="M14 3H7.5A2.5 2.5 0 0 0 5 5.5v13A2.5 2.5 0 0 0 7.5 21h9a2.5 2.5 0 0 0 2.5-2.5V8z"/><path d="M14 3v5h5M9 13h6M9 17h4"/>',
    code: '<path d="m16 18 6-6-6-6M8 6l-6 6 6 6"/>',
    image: '<rect x="3" y="4" width="18" height="16" rx="2.5"/><circle cx="9" cy="10" r="1.8"/><path d="m21 16-5-5-9 9"/>',
    music: '<path d="M9 18V5.5l11-2V16"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="17.5" cy="16" r="2.5"/>',
    note: '<path d="M10 18V5l8-1.5"/><circle cx="7.5" cy="18" r="2.5"/>',
    film: '<rect x="3" y="3" width="18" height="18" rx="2.5"/><path d="M7.5 3v18M16.5 3v18M3 8h4.5M3 16h4.5M16.5 8H21M16.5 16H21M3 12h18"/>',
    home: '<path d="M3.5 11 12 4l8.5 7"/><path d="M5.5 9.5V20h13V9.5"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    star: '<path d="m12 3.5 2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.8l-5.2 2.8 1-5.8-4.3-4.1 5.9-.8z"/>',
    download: '<path d="M12 3.5v11M7.5 10l4.5 4.5 4.5-4.5M5 20h14"/>',
    monitor: '<rect x="3" y="4" width="18" height="12" rx="2.5"/><path d="M8.5 20h7M12 16v4"/>',
    drive: '<rect x="3" y="13" width="18" height="7" rx="2"/><path d="M4.5 13 7 5h10l2.5 8M7 16.5h.01"/>',
    trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
    grid: '<rect x="4" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5"/>',
    list: '<path d="M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01" />',
    columns: '<rect x="3" y="4" width="18" height="16" rx="2.5"/><path d="M9 4v16M15 4v16"/>',
    "folder-plus": '<path d="M3 7.5A2.5 2.5 0 0 1 5.5 5H9l2 2.2h7.5A2.5 2.5 0 0 1 21 9.7v7.8a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 17.5z"/><path d="M12 10.5v6M9 13.5h6"/>',
    inbox: '<path d="M3 13h5l1.5 3h5l1.5-3h5"/><path d="M5.5 5h13L21 13v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5z"/>',
    send: '<path d="M21 3 10 14M21 3l-6.5 18-4.5-7-7-4.5z"/>',
    archive: '<rect x="3" y="4" width="18" height="5" rx="1.5"/><path d="M5 9v9.5A1.5 1.5 0 0 0 6.5 20h11a1.5 1.5 0 0 0 1.5-1.5V9M10 13h4"/>',
    flag: '<path d="M5 21V4M5 4h12l-2.5 4.5L17 13H5"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="m3.5 7 8.5 6 8.5-6"/>',
    pen: '<path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16z"/><path d="m13.5 6.5 4 4"/>',
    compose: '<path d="M12 4H6.5A2.5 2.5 0 0 0 4 6.5v11A2.5 2.5 0 0 0 6.5 20h11a2.5 2.5 0 0 0 2.5-2.5V12"/><path d="M18.4 3.6a2 2 0 0 1 2.9 2.9L12 15.8l-3.8.9.9-3.8z"/>',
    reply: '<path d="M9 16 4 11l5-5"/><path d="M4 11h10a6 6 0 0 1 6 6v2"/>',
    "reply-all": '<path d="M12 16 7 11l5-5M7 16l-5-5 5-5"/><path d="M7 11h8a6 6 0 0 1 6 6v2"/>',
    forward: '<path d="m15 16 5-5-5-5"/><path d="M20 11H10a6 6 0 0 0-6 6v2"/>',
    clip: '<path d="m20.5 11.5-8.4 8.4a5 5 0 0 1-7.1-7.1l8.4-8.4a3.3 3.3 0 0 1 4.7 4.7l-8.4 8.4a1.7 1.7 0 0 1-2.4-2.4l7.8-7.8"/>',
    wifi: '<path d="M5 12.5a10 10 0 0 1 14 0M8.5 16a5 5 0 0 1 7 0M2 9a15 15 0 0 1 20 0M12 19.5h.01"/>',
    bluetooth: '<path d="m7 7 10 10-5 5V2l5 5L7 17"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
    volume: '<path d="M11 5 6.5 9H3.5v6h3L11 19z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9.5 9.5 0 0 1 0 13"/>',
    battery: '<rect x="2.5" y="7" width="17" height="10" rx="2.5"/><path d="M22 11v2M6 10.5v3M9.5 10.5v3"/>',
    printer: '<path d="M6.5 9V3.5h11V9M6.5 17.5h-2A2 2 0 0 1 2.5 15.5v-4.5a2 2 0 0 1 2-2h15a2 2 0 0 1 2 2v4.5a2 2 0 0 1-2 2h-2"/><rect x="6.5" y="14" width="11" height="7" rx="1"/>',
    palette: '<path d="M12 3a9 9 0 0 0 0 18c1.4 0 2-.9 2-2 0-1.4-1.3-2 0-3.2.8-.8 2-.8 3-.8a4 4 0 0 0 4-4C21 6.6 17 3 12 3z"/><path d="M7.5 11.5h.01M9.5 7.5h.01M14.5 7.5h.01" stroke-width="2.6"/>',
    moon: '<path d="M20.5 13.2A8.5 8.5 0 1 1 10.8 3.5a6.6 6.6 0 0 0 9.7 9.7z"/>',
    lock: '<rect x="4.5" y="11" width="15" height="10" rx="2.5"/><path d="M8 11V7.5a4 4 0 0 1 8 0V11"/>',
    bell: '<path d="M6 9a6 6 0 0 1 12 0c0 6 2.5 8 2.5 8h-17S6 15 6 9M10.3 20.5a2 2 0 0 0 3.4 0"/>',
    keyboard: '<rect x="2.5" y="6" width="19" height="12" rx="2.5"/><path d="M6.5 10h.01M10 10h.01M14 10h.01M17.5 10h.01M7.5 14h9" stroke-width="1.8"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4.5 20.5a7.5 7.5 0 0 1 15 0"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.6a3.5 3.5 0 0 1 0 6.8M18 14a6.5 6.5 0 0 1 3.5 6"/>',
    calendar: '<rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
    play: '<path fill="currentColor" stroke="none" d="M8 5.2v13.6a1 1 0 0 0 1.5.9l11-6.8a1 1 0 0 0 0-1.8l-11-6.8A1 1 0 0 0 8 5.2z"/>',
    pause: '<rect fill="currentColor" stroke="none" x="6" y="5" width="4" height="14" rx="1.2"/><rect fill="currentColor" stroke="none" x="14" y="5" width="4" height="14" rx="1.2"/>',
    prev: '<path fill="currentColor" stroke="none" d="M19 6.2v11.6a1 1 0 0 1-1.6.8L10 13a1.2 1.2 0 0 1 0-2l7.4-5.6a1 1 0 0 1 1.6.8z"/><rect fill="currentColor" stroke="none" x="5" y="5.5" width="2.6" height="13" rx="1"/>',
    next: '<path fill="currentColor" stroke="none" d="M5 6.2v11.6a1 1 0 0 0 1.6.8L14 13a1.2 1.2 0 0 0 0-2L6.6 5.4a1 1 0 0 0-1.6.8z"/><rect fill="currentColor" stroke="none" x="16.4" y="5.5" width="2.6" height="13" rx="1"/>',
    shuffle: '<path d="M16 3.5h4.5V8M3.5 20 20.5 3.5M20.5 16v4.5H16M14.5 14.5l6 6M3.5 4l5 5"/>',
    repeat: '<path d="m17 2.5 3.5 3.5L17 9.5"/><path d="M3.5 11.5v-1A4.5 4.5 0 0 1 8 6h12.5M7 21.5 3.5 18 7 14.5"/><path d="M20.5 12.5v1A4.5 4.5 0 0 1 16 18H3.5"/>',
    heart: '<path d="M12 20s-7.5-4.6-9-9.3C2 7.4 4.2 4.5 7.3 4.5c2 0 3.6 1.1 4.7 2.7 1.1-1.6 2.7-2.7 4.7-2.7 3.1 0 5.3 2.9 4.3 6.2-1.5 4.7-9 9.3-9 9.3z"/>',
    queue: '<path d="M3.5 6h12M3.5 11h12M3.5 16h7M17.5 18V9.5l3.5-1"/><circle cx="15.5" cy="18" r="2"/>',
    disc: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="2.5"/>',
    mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 10.5a6.5 6.5 0 0 0 13 0M12 17v4"/>',
    radio: '<circle cx="12" cy="12" r="2"/><path d="M16.2 7.8a6 6 0 0 1 0 8.4M7.8 16.2a6 6 0 0 1 0-8.4M19 5a10 10 0 0 1 0 14M5 19A10 10 0 0 1 5 5"/>',
    podcast: '<circle cx="12" cy="10" r="2.5"/><path d="M12 15v6M8 14.5a6 6 0 1 1 8 0"/>',
    genre: '<path d="M4 20V10M9 20V4M14 20v-7M19 20V8"/>',
    tv: '<rect x="2.5" y="7" width="19" height="13.5" rx="2.5"/><path d="m16.5 2.5-4.5 4.5-4.5-4.5"/>',
    compass: '<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5z"/>',
    layers: '<path d="m12 3 9 4.5-9 4.5-9-4.5z"/><path d="m3 12 9 4.5 9-4.5M3 16.5 12 21l9-4.5"/>',
    bookmark: '<path d="M18.5 21 12 16.5 5.5 21V5.5A2.5 2.5 0 0 1 8 3h8a2.5 2.5 0 0 1 2.5 2.5z"/>',
    server: '<rect x="3" y="3.5" width="18" height="7.5" rx="2"/><rect x="3" y="13" width="18" height="7.5" rx="2"/><path d="M7 7.25h.01M7 16.75h.01" stroke-width="2.4"/>',
    check: '<path d="M20 6.5 9 17.5l-5-5"/>',
    "check-c": '<circle cx="12" cy="12" r="9"/><path d="m8 12.3 2.7 2.7L16 9.6"/>',
    x: '<path d="M17.5 6.5l-11 11M6.5 6.5l11 11"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 16v-4.5M12 8h.01" stroke-width="1.9"/>',
    refresh: '<path d="M20.5 12a8.5 8.5 0 1 1-2.6-6.1L20.5 8.5"/><path d="M20.5 3.5v5h-5"/>',
    filter: '<path d="M3.5 5h17l-6.5 7.5v6l-4 2v-8z"/>',
    sort: '<path d="M7 4v16M3.5 16.5 7 20l3.5-3.5M17 20V4M13.5 7.5 17 4l3.5 3.5"/>',
    cloud: '<path d="M17.5 19a4.5 4.5 0 1 0-1.3-8.8A6 6 0 0 0 4.5 12a3.5 3.5 0 0 0 1.5 7z"/>',
    tag: '<path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8z"/><path d="M7.5 7.5h.01" stroke-width="2.6"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4"/>',
    power: '<path d="M12 3v9M17.7 6.6a8 8 0 1 1-11.4 0"/>',
    mouse: '<rect x="6" y="3" width="12" height="18" rx="6"/><path d="M12 7v3.5"/>',
    window: '<rect x="3" y="4" width="18" height="16" rx="2.5"/><path d="M3 8.5h18"/>',
    shield: '<path d="M12 21s7.5-3.6 7.5-9.5V5.5L12 3 4.5 5.5v6C4.5 17.4 12 21 12 21z"/>',
    external: '<path d="M14.5 3.5h6v6M10 14 20.5 3.5M18.5 13.5v5a2 2 0 0 1-2 2h-11a2 2 0 0 1-2-2v-11a2 2 0 0 1 2-2h5"/>',
    eye: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',
    spark: '<path d="M12 3.5 13.8 9 19.5 10.5 13.8 12.2 12 18 10.2 12.2 4.5 10.5 10.2 9z"/>',
    eq: '<path d="M6 4v16M12 4v16M18 4v16"/><rect fill="currentColor" stroke="none" x="4" y="13" width="4" height="3" rx="1"/><rect fill="currentColor" stroke="none" x="10" y="7" width="4" height="3" rx="1"/><rect fill="currentColor" stroke="none" x="16" y="11" width="4" height="3" rx="1"/>',
    lyrics: '<path d="M4 5.5h16M4 10h10M4 14.5h12M4 19h7"/>',
    cast: '<path d="M3 8V6.5A2.5 2.5 0 0 1 5.5 4h13A2.5 2.5 0 0 1 21 6.5v11a2.5 2.5 0 0 1-2.5 2.5H14M3 12a8 8 0 0 1 8 8M3 16a4 4 0 0 1 4 4M3 20h.01"/>',
    usb: '<rect x="7" y="2.5" width="10" height="8" rx="1.5"/><path d="M5.5 10.5h13V19a2.5 2.5 0 0 1-2.5 2.5H8A2.5 2.5 0 0 1 5.5 19z"/>',
    network: '<rect x="9" y="2.5" width="6" height="5" rx="1.2"/><rect x="2.5" y="16.5" width="6" height="5" rx="1.2"/><rect x="15.5" y="16.5" width="6" height="5" rx="1.2"/><path d="M12 7.5V12M5.5 16.5V12h13v4.5"/>',
    app: '<rect x="4" y="4" width="16" height="16" rx="4.5"/>',
  };
  const svg = (name) =>
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${I[name] || I.app}</svg>`;

  const ready = () => {
    document.body.classList.add(`v-${v}`, v === "before" ? "before" : "after");
    if (v === "sheet2") document.body.classList.add("v-sheet");
    document.querySelectorAll("i[data-i]").forEach((el) => (el.innerHTML = svg(el.dataset.i)));
    document.querySelectorAll("[data-scr]").forEach((el) => {
      if (!el.dataset.scr.split(",").includes(screen)) el.remove();
    });
    if (q.get("shot") === "1") return;
    const bar = document.createElement("nav");
    bar.className = "mock-switch";
    const link = (key, val, label) => {
      const p = new URLSearchParams(location.search);
      p.set(key, val);
      const on = (q.get(key) || { v: "blended", theme: "dark", screen }[key]) === val;
      return `<a class="${on ? "on" : ""}" href="?${p}">${label}</a>`;
    };
    let h = link("v", "before", "Before") + link("v", "blended", "After A · blended") + link("v", "tinted", "After B · tinted") + link("v", "sheet", "After C · inset sheet") + link("v", "sheet2", "C · padded, separators") + "<span></span>" + link("theme", "dark", "Dark") + link("theme", "light", "Light");
    const screens = html.dataset.screens ? html.dataset.screens.split(",") : [];
    if (screens.length > 1) h += "<span></span>" + screens.map((s) => link("screen", s, s[0].toUpperCase() + s.slice(1))).join("");
    h += '<span></span><a href="index.html">Gallery</a>';
    bar.innerHTML = h;
    document.body.append(bar);
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", ready);
  else ready();
})();
