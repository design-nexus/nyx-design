// Extra symbolic icons for the desktop mockups (same 24 px grid, 1.6 px strokes as mock.js).
// Use <i data-x="name">; mock.js handles <i data-i="name">.
(() => {
  const X = {
    trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4.5h6V7"/>',
    bulb: '<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.6 10.8c.7.6 1.1 1.3 1.1 2.2h5c0-.9.4-1.6 1.1-2.2A6 6 0 0 0 12 3z"/>',
    headphones: '<path d="M4 15v-3a8 8 0 0 1 16 0v3"/><rect x="3.5" y="14" width="4" height="6.5" rx="1.5"/><rect x="16.5" y="14" width="4" height="6.5" rx="1.5"/>',
    speaker: '<rect x="6" y="3" width="12" height="18" rx="2.5"/><circle cx="12" cy="14.5" r="3"/><path d="M12 7h.01" stroke-width="2.4"/>',
    hdmi: '<rect x="3" y="4.5" width="18" height="12" rx="2"/><path d="M8 20h8M12 16.5V20"/>',
    leaf: '<path d="M5 19c0-8 5-13 15-14-1 10-6 15-14 15"/><path d="M5 19l7-7"/>',
    gauge: '<path d="M4.5 17a8.5 8.5 0 1 1 15 0"/><path d="m12 13 3.5-4"/>',
    bolt: '<path d="M13 3 5 13.5h6L10 21l8-10.5h-6z"/>',
    tiles: '<rect x="3.5" y="4" width="8" height="16" rx="2"/><rect x="13.5" y="4" width="7" height="7" rx="2"/><rect x="13.5" y="13" width="7" height="7" rx="2"/>',
    float: '<rect x="3" y="7" width="12" height="11" rx="2"/><path d="M9 7V5.5A2 2 0 0 1 11 3.5h8a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-4"/>',
    coffee: '<path d="M5 9h11v5a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5z"/><path d="M16 10.5h1.5a2.5 2.5 0 0 1 0 5H16M8.5 3.5v2.5M12 3.5v2.5"/>',
    shot: '<path d="M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2"/><circle cx="12" cy="12" r="3"/>',
    pin: '<path d="M9 4h6l-1 6 3 3v1.5H7V13l3-3z"/><path d="M12 14.5V20"/>',
    unpin: '<path d="M9 4h6l-1 6 3 3v1.5H7V13l3-3z"/><path d="M12 14.5V20M4 4l16 16"/>',
    newwin: '<rect x="3.5" y="5" width="13" height="13" rx="2.5"/><path d="M20 4v6M17 7h6"/>',
    windows: '<rect x="3" y="6" width="12" height="10" rx="2"/><rect x="9" y="10" width="12" height="10" rx="2"/>',
    resize: '<path d="M20 13v7h-7M20 20l-7-7"/>',
    drag: '<path d="M9 6h.01M15 6h.01M9 12h.01M15 12h.01M9 18h.01M15 18h.01" stroke-width="2.6"/>',
    minus: '<path d="M6 12h12"/>',
    signal: '<path d="M5 20v-3M10 20v-7M15 20v-11M20 20V5"/>',
    vpn: '<path d="M12 3 4.5 6v5.5c0 4.5 3.2 8.2 7.5 9.5 4.3-1.3 7.5-5 7.5-9.5V6z"/><path d="m9 12 2 2 4-4"/>',
    meter: '<path d="M4 19h16M6 15l4-5 3 3 5-7"/>',
    fan: '<path d="M6 20c4-1 7-4 9-9M6 20c2-4 3-8 3-13M6 20c4.5-.5 9-2.5 12-6"/>',
    thermo: '<path d="M10 4a2 2 0 0 1 4 0v10a4 4 0 1 1-4 0z"/>',
    sofa: '<path d="M5 11V8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v3"/><path d="M3 13a2 2 0 0 1 4 0v1h10v-1a2 2 0 0 1 4 0v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM6 19v1.5M18 19v1.5"/>',
    scene: '<path d="M12 3v2M12 19v2M5 12H3M21 12h-2M7 7 5.6 5.6M18.4 18.4 17 17M7 17l-1.4 1.4M18.4 5.6 17 7"/><circle cx="12" cy="12" r="3.5"/>',
    zip: '<path d="M14 3H7.5A2.5 2.5 0 0 0 5 5.5v13A2.5 2.5 0 0 0 7.5 21h9a2.5 2.5 0 0 0 2.5-2.5V8z"/><path d="M14 3v5h5M11 6h1M11 9h1M11 12h1M10.5 15h2v3h-2z"/>',
    pdf: '<path d="M14 3H7.5A2.5 2.5 0 0 0 5 5.5v13A2.5 2.5 0 0 0 7.5 21h9a2.5 2.5 0 0 0 2.5-2.5V8z"/><path d="M14 3v5h5M8.5 17v-4h1.5a1.3 1.3 0 0 1 0 2.6H8.5"/>',
    battery: '<rect x="3" y="7.5" width="16" height="9" rx="2"/><path d="M21.5 10.5v3"/><path d="M5.5 10h8v4h-8z" fill="currentColor" stroke="none"/>',
    cloudsun: '<path d="M7 18a4 4 0 0 1 .5-8 5.5 5.5 0 0 1 10.5 2 3 3 0 0 1-.5 6z"/>',
    sticky: '<path d="M5 4h14v10l-6 6H5z"/><path d="M13 20v-6h6"/>',
    box: '<path d="M12 3 4 7v10l8 4 8-4V7z"/><path d="m4 7 8 4 8-4M12 11v10"/>',
  };
  const svg = (n) =>
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${X[n] || ""}</svg>`;
  const fill = () => document.querySelectorAll("i[data-x]").forEach((el) => (el.innerHTML = svg(el.dataset.x)));
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fill);
  else fill();
})();
