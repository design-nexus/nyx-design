// System › Default Apps: the browser, terminal, editor and coding agent, and which app opens each kind of file or link.
(() => {
  const sec = "system";
  const page = (ctl, pv, ctlw) => () => swin({ sec, page: "Default Apps", desc: "Which app opens links, folders, files and mail.", body: split(ctl(), pv(), { sec, ctlw }) });
  const L = (ic) => ({ ic, sec });
  // Installed apps: name → [icon, swatch].
  const APP = { Firefox: ["globe", "coral"], Browser: ["compass", "blue"], Thunderbird: ["mail", "blue"], Files: ["folder", "teal"], Ghostty: ["terminal", "graphite"], Neovim: ["code", "green"], "Claude Code": ["sparkle", "coral"], imv: ["image", "violet"], mpv: ["film", "pink"], Music: ["music", "red"], Papers: ["file-text", "red"], LibreOffice: ["file", "teal"], Archives: ["archive", "amber"], Calendar: ["calendar", "red"], Transmission: ["download", "red"] };
  const at = (n, s = 22) => { const [ic, c] = APP[n]; return `<span class="ap-t" style="--ac:var(--sw-${c});width:${s}px;height:${s}px">${icon(ic)}</span>`; };
  const pick = (n) => `<span class="dd ap-dd">${at(n, 18)}${n}${icon("chev-d")}</span>`;
  // Kinds of file and link: [key, icon, name, examples, app, group]
  const KINDS = [
    ["web", "globe", "Web links", "http, https, .html", "Firefox", "e"],
    ["mail", "mail", "Email links", "mailto:", "Thunderbird", "e"],
    ["dir", "folder", "Folders", "", "Files", "e"],
    ["img", "image", "Images", ".jpg .png .webp .heic", "imv", "m"],
    ["vid", "film", "Videos", ".mp4 .mkv .webm", "mpv", "m"],
    ["aud", "music", "Music", ".mp3 .flac .ogg", "Music", "m"],
    ["pdf", "file-text", "PDFs", ".pdf", "Papers", "d"],
    ["doc", "file", "Documents", ".docx .odt .doc", "LibreOffice", "d"],
    ["xls", "grid", "Spreadsheets", ".xlsx .ods .csv", "LibreOffice", "d"],
    ["ppt", "layers", "Presentations", ".pptx .odp", "LibreOffice", "d"],
    ["txt", "file-text", "Text files", ".txt .md .log .json", "Neovim", "d"],
    ["zip", "archive", "Archives", ".zip .tar.gz .7z", "Archives", "o"],
    ["ics", "calendar", "Calendar invites", ".ics, webcal:", "Calendar", "o"],
    ["tor", "download", "Torrents", "magnet:, .torrent", "Transmission", "o"],
  ];
  const tools = () => ocard("Tools", [
    orow("Terminal", "Super + Enter opens it", pick("Ghostty"), L("terminal")),
    orow("Text editor", "Opens config files", pick("Neovim"), L("pen")),
    orow("Coding agent", "Super + Shift + Ctrl + A", pick("Claude Code"), L("sparkle")),
  ], { cls: "icons" });

  /* ── A: a map from kinds of file to apps ── */
  const ctlA = () => `
    ${ocard("Everyday", [
      orow("Web browser", "Links from every app", pick("Firefox"), L("globe")),
      orow("Email", "mailto: links", pick("Thunderbird"), L("mail")),
      orow("Files", "Folders from every app", pick("Files"), L("folder")),
    ], { first: true, cls: "icons" })}
    ${tools()}
    ${ocard("", [nrow("Each kind of file", "Images, music, PDFs, documents and 10 more", "14", L("file")), nrow("Browser's connections", "Share, Capture and the Assistant", "", L("compass"))], { cls: "icons" })}`;
  const pvA = () => {
    const K = KINDS.filter((k) => k[0] !== "web" && k[0] !== "mail" && k[0] !== "dir"), apps = [...new Set(K.map((k) => k[4]))];
    const H = 500, kh = H / K.length, ah = H / apps.length, ky = (i) => i * kh + kh / 2, ay = (j) => j * ah + ah / 2;
    const paths = K.map((k, i) => `<path d="M0 ${ky(i)} C 50 ${ky(i)}, 50 ${ay(apps.indexOf(k[4]))}, 100 ${ay(apps.indexOf(k[4]))}" class="${k[0] === "pdf" ? "hot" : ""}"/>`).join("");
    return `${pvhead("What opens what", "Every kind of file and the app it opens in. Click a line to change it.", btn("Reset to recommended", "sm", "rotate"))}
    <div class="ap-map" style="--h:${H}px">
      <svg class="lines" viewBox="0 0 100 ${H}" preserveAspectRatio="none">${paths}</svg>
      <div class="col l">${K.map(([k, ic, n, ex]) => `<div class="nd ${k === "pdf" ? "hot" : ""}">${icon(ic)}<span>${n}</span><small>${ex.split(" ")[0]}</small></div>`).join("")}</div>
      <div class="col r">${apps.map((a) => `<div class="nd ${a === "Papers" ? "hot" : ""}">${at(a)}<span>${a}</span></div>`).join("")}</div>
      <div class="ap-pop" style="top:${ky(3) - 10}px">
        <div class="ph">Open PDFs with</div>
        ${[["Papers", "Recommended", true], ["Firefox", ""], ["LibreOffice", "As a drawing"]].map(([a, d, on]) => `<div class="po ${on ? "on" : ""}">${at(a, 20)}<span>${a}${d ? `<small>${d}</small>` : ""}</span>${on ? icon("check", "okc") : ""}</div>`).join("")}
      </div>
    </div>`;
  };

  /* ── B: start from an app ── */
  const MINE = [["LibreOffice", "Documents, spreadsheets, presentations", 3], ["Firefox", "Web links", 1], ["Files", "Folders", 1], ["Neovim", "Text files", 1], ["mpv", "Videos", 1], ["Music", "Music", 1], ["Papers", "PDFs", 1], ["imv", "Images", 1]];
  const ctlB = () => `
    <div class="field ap-search">${icon("search")}<span class="ph">Search apps or kinds of file</span></div>
    ${ocard("Your apps", MINE.map(([a, d, n], i) => `<div class="opt ap-ar ${i === 0 ? "picked" : ""}">${at(a, 30)}<div class="opt-text"><div>${a}</div><div class="d">${d}</div></div><span class="rv">${n}</span>${icon("chev-r", "cv")}</div>`), { first: true, act: `<span class="note">15 installed</span>` })}`;
  const CAN = [["doc", "Documents", ".docx .odt .doc", true, ""], ["xls", "Spreadsheets", ".xlsx .ods .csv", true, ""], ["ppt", "Presentations", ".pptx .odp", true, ""], ["pdf", "PDFs", ".pdf", false, "Papers"], ["txt", "Text files", ".txt .md", false, "Neovim"], ["img", "Images", ".jpg .png .svg", false, "imv"]];
  const pvB = () => `
    <div class="ap-hero card">${at("LibreOffice", 64)}<div class="tx"><b>LibreOffice</b><span>Office suite · opens 3 of the 6 kinds it can</span></div><span class="sp"></span>${btn("Use for all 6", "sm")}</div>
    <div class="ap-sh"><b>Opens these</b><span>Switch one on and LibreOffice takes it over from the app shown.</span></div>
    <div class="ap-kinds">${CAN.map(([k, n, ex, on, from]) => { const kk = KINDS.find((x) => x[0] === k); return `<div class="ap-k ${on ? "on" : ""}"><span class="lic" style="--tc:var(--sec-system)">${icon(kk[1])}</span><div><b>${n}</b><span>${ex}</span>${from ? `<em>Now: ${at(from, 14)}${from}</em>` : `<em class="me">Opens in LibreOffice</em>`}</div>${sw(on)}</div>`; }).join("")}</div>
    ${ocard("", [orow("Open with LibreOffice", "Always offered in Files' Open with menu, whatever the default", sw(true), L("list")), orow("Show in the launcher", "", sw(true), L("grid"))], { cls: "icons" })}`;

  /* ── C: every kind as a tile, and a chooser ── */
  const ctlC = () => `
    <div class="ap-tiles">${KINDS.slice(0, 3).concat([["term", "", "Terminal", "", "Ghostty"], ["ed", "", "Text editor", "", "Neovim"], ["ag", "", "Coding agent", "", "Claude Code"]], KINDS.slice(3)).map(([k, ic, n, , a]) => `<div class="ap-tl ${k === "img" ? "on" : ""}">${at(a, 28)}<div><b>${n}</b><span>${a}</span></div></div>`).join("")}</div>`;
  const pvC = () => `
    ${pvhead("Images", ".jpg, .png, .webp, .heic, .gif and .svg", btn("Choose per format", "sm", "sliders"))}
    <div class="ap-cho card">${[["imv", "Quick and light · opens in a moment", true, "Now"], ["Files", "Shows the image in Files' preview", false], ["Firefox", "Opens it in a tab", false], ["LibreOffice", "As a drawing you can edit", false]].map(([a, d, on, tag]) => `<div class="opt ${on ? "picked" : ""}">${radio(on)}${at(a, 34)}<div class="opt-text"><div>${a}${tag ? ` <span class="pill" style="--tc:var(--sec-system)">${tag}</span>` : ""}</div><div class="d">${d}</div></div></div>`).join("")}
      <div class="opt"><span class="ap-add">${icon("store")}</span><div class="opt-text"><div class="acc">Find an image viewer in Software…</div></div></div></div>
    <div class="ap-sh"><b>Try it</b><span>Files on this computer that would open in imv.</span></div>
    <div class="ap-try">${["Lake at dawn.jpg", "Screenshot.png", "Logo.svg", "Cat.heic"].map((f, i) => `<div class="ap-f"><div class="ap-im" style="background:${wall("img" + i)}"></div><b>${f}</b><span>${at("imv", 14)}imv</span></div>`).join("")}</div>`;

  REG("apps", {
    name: "Default Apps",
    summary: "Two long cards of dropdowns: Defaults (web browser, terminal, text editor, coding agent) and Files and links (file manager, images, video, music, PDFs, documents, spreadsheets, presentations, text, archives, email, calendar, torrents), then Browser's own switches when it's installed. Every row is a title, a sentence and a dropdown of app names.",
    problems: [
      "<b>Seventeen identical rows:</b> a title, a grey sentence (“Opens video files.”) and a dropdown, one after another, so finding Archives or Torrents means scrolling past everything else.",
      "<b>No picture of what opens what:</b> nothing shows that LibreOffice opens three kinds of file, or which file endings a row covers.",
      "<b>App names without faces:</b> the dropdowns read imv, foot and mpv Media Player in plain text; there's no icon to recognise them by.",
      "<b>Tools and file types mixed:</b> the terminal, the editor and the coding agent sit in the same card style as images and music, with keyboard shortcuts in code font inside their descriptions.",
      "<b>Everything for a kind is one choice:</b> you can't send .svg to a different app from .jpg, and there's no way back to the recommended apps.",
      "<b>Browser's switches are at the bottom</b> of a page about defaults, although they're about what Browser may connect to.",
    ],
    today: [["apps-1280", "Today", ""], ["apps-800", "Today at 800 px", ""]],
    icons: {
      sparkle: '<path d="M12 3.5 13.8 9 19.5 10.5 13.8 12.2 12 18 10.2 12.2 4.5 10.5 10.2 9z"/><path d="M19 3v3M17.5 4.5h3"/>',
    },
    options: [
      { id: "a", name: "What opens what", idea: "The left column keeps the choices you make once: the browser, email and files apps, then the terminal, editor and coding agent, each dropdown with the app's icon. The right side maps every kind of file to the app it opens in, so you see at a glance that LibreOffice takes documents, spreadsheets and presentations. Click a line and a small menu of the apps that can open that kind appears in place.",
        shots: [["a-map", "Every kind of file and its app", "Changing PDFs from the map"], ["a-map-800", "At 800 px", ""]] },
      { id: "b", name: "Start from an app", idea: "The left column lists your apps with how many kinds of file each one opens. Choosing one shows everything it can open on the right, with a switch for each and the app that opens it now, so “make LibreOffice open my spreadsheets” is one switch. Use for all takes over every kind at once.",
        shots: [["b-app", "LibreOffice", "It opens 3 of the 6 kinds it can"], ["b-app-800", "At 800 px", ""]] },
      { id: "c", name: "Tiles and a chooser", idea: "Every kind of file and link is a tile showing the app it opens in; the tools (terminal, editor, agent) are tiles too. Choosing a tile lists the apps that can open it on the right with a line on how each one does it, a way to set different apps per format, and a few of your own files as they'd open, plus a link to Software when nothing installed fits.",
        shots: [["c-tiles", "Images", "Four apps can open images"], ["c-tiles-800", "At 800 px", ""]] },
    ],
    pages: {
      "a-map": page(ctlA, pvA, 420),
      "b-app": page(ctlB, pvB, 380),
      "c-tiles": page(ctlC, pvC, 430),
    },
  });
})();
