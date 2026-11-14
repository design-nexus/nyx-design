// Hardware › Printers: the printing service, your printers (default, test page, address,
// remove), finding driverless printers on the network, and adding one by its address.
(() => {
  const page = (body) => () => swin({ sec: "hardware", page: "Printers", desc: "Add printers, choose the default and print a test page.", body: body() });
  const dev = (size = "", o = {}) => `<span class="pr-dev ${size} ${o.ink ? "ink" : ""}"><i class="pr-top"></i><i class="pr-body"><b class="pr-led ${o.off ? "off" : ""}"></b></i><i class="pr-paper"></i></span>`;
  const st = (t, c) => `<span class="pr-st" style="--tc:${c}"><i></i>${t}</span>`;
  const MINE = [["Office LaserJet", "HP LaserJet 400", "Ready", "var(--success)", true, false], ["Hallway Inkjet", "Epson ET-2850", "Idle", "var(--text-tertiary)", false, true], ["Label printer", "Brother QL-820", "Not responding", "var(--warning)", false, false]];

  /* ── A: your printers, and the chosen one ──────────────────────── */
  const listA = () => split(`
    ${ocard("", [orow("<b>Printing</b>", "Sends documents to printers. Turn off if you never print.", sw(true), { ic: "printer" })], { first: true, cls: "icons" })}
    ${ocard("Your printers", MINE.map(([n, m, s, c, def, ink], i) => `<div class="opt ${i === 0 ? "picked" : ""}">${dev("sm", { ink, off: c.includes("warning") })}<div class="opt-text"><div>${n}${def ? ` <span class="pr-def">Default</span>` : ""}</div><div class="d">${st(s, c)}</div></div>${icon("chev-r", "cv")}</div>`))}
    ${ocard("Add a printer", [
      orow("Find printers", "On your network, without a driver.", btn("Search", "", "search"), { ic: "wifi" }),
      orow("Add by address", "", `<span class="field pr-addr"><span class="ph">ipp://…</span></span>`, { ic: "globe" }),
    ], { cls: "icons" })}`,
    `${pvhead("Office LaserJet", "HP LaserJet 400 · on the network", `<div class="pill" style="--tc:var(--sec-hardware)">${icon("star")}Default</div>`)}
     <div class="card pr-hero">
       ${dev("lg")}
       <div class="pr-ht">${st("Ready", "var(--success)")}<b>Ready to print</b><span>Last used this morning by Sam Rivera</span>
         <div class="pr-bts">${btn("Print a test page", "primary", "file-text")}${btn("Edit address", "", "pen")}</div></div>
     </div>
     <div class="pr-facts card">${[["Address", "ipp://192.168.1.50/ipp/print"], ["Connected", "Network, no driver needed"], ["Paper", "A4"], ["Prints in", "Black and white, both sides"]].map(([k, v]) => `<div><small>${k}</small><span>${v}</span></div>`).join("")}</div>
     <div class="card pr-q">
       <div class="gtitle pr-qh">Waiting to print<span class="sp"></span><span class="note">2</span></div>
       <div class="opt">${icon("file-text", "inl")}<div class="opt-text"><div>Boarding pass.pdf</div><div class="d">Sam Rivera · printing page 1 of 2</div></div><span class="pr-prog">${prog(45)}</span>${ib("x", "Cancel")}</div>
       <div class="opt">${icon("file-text", "inl")}<div class="opt-text"><div>Lemon cake recipe</div><div class="d">Sam Rivera · next</div></div>${ib("x", "Cancel")}</div>
     </div>
     <div class="pr-foot"><span class="sp"></span>${btn("Remove this printer", "ghost dtext", "trash")}</div>`, { ctlw: 400 });

  /* ── B: find and add ───────────────────────────────────────────── */
  const FOUND = [["Studio Color Laser", "Canon i-SENSYS · Wi-Fi", "add", false], ["Hallway Inkjet", "Epson ET-2850 · Wi-Fi", "added", true], ["Library Copier", "Ricoh IM C3000 · network", "adding", false], ["Brother MFC", "Brother MFC-L2750 · USB", "add", false]];
  const findB = () => split(`
    ${ocard("", [orow("<b>Printing</b>", "Turn off if you never print.", sw(true), { ic: "printer" })], { first: true, cls: "icons" })}
    ${ocard("Your printers", MINE.slice(0, 2).map(([n, m, s, c, def, ink]) => `<div class="opt ${def ? "picked" : ""}">${radio(def)}${dev("sm", { ink })}<div class="opt-text"><div>${n}</div><div class="d">${st(s, c)}</div></div>${ib("more", "More")}</div>`), { note: "The chosen one is the default: apps print to it first." })}
    <div class="card pr-menu">
      ${[["file-text", "Print a test page"], ["pen", "Edit address"], ["star", "Make default"], ["trash", "Remove", "dtext"]].map(([ic, t, c]) => `<div class="pr-mi ${c || ""}">${icon(ic)}<span>${t}</span></div>`).join("")}
    </div>`,
    `${pvhead("Printers nearby", "On Home-5G. These print without installing a driver.", btn("Search again", "sm", "refresh"))}
     <div class="pr-grid">${FOUND.map(([n, d, state, ink]) => `<div class="card pr-fc ${state}">${dev("md", { ink })}<b>${n}</b><span>${d}</span>${state === "added" ? `<span class="pr-done">${icon("check")}Added</span>` : state === "adding" ? `<span class="pr-adding">${prog(60)}<small>Adding…</small></span>` : btn("Add", "sm primary", "plus")}</div>`).join("")}</div>
     <div class="card pr-byaddr"><span class="lic" style="--tc:var(--sec-hardware)">${icon("globe")}</span><div class="opt-text"><div>Not listed?</div><div class="d">Add it by its address, like ipp://192.168.1.50/ipp/print</div></div><span class="field pr-addr"><span class="ph">ipp://…</span></span>${btn("Add")}</div>
     ${pvfoot("Looking for printers… 4 found so far.", "refresh")}`, { ctlw: 380 });

  REG("printers", {
    name: "Printers",
    summary: "Printers turns the printing service on, lists your printers (making one the default, printing a test page, editing its address, removing it) and finds driverless printers on the network or adds one by address. With no printers yet it's three rows and an empty page.",
    problems: [
      "<b>Mostly empty:</b> with no printers the page is a switch, a sentence and two rows, and the rest of the window is blank.",
      "<b>The service is named for its software:</b> “CUPS, which sends documents to printers” is the first thing you read.",
      "<b>Search hides its results:</b> Find printers is a row with a Search button; what it finds appears as more rows in the same card.",
      "<b>The address field wants a technical address</b> (ipp://…) with “Press Enter” in grey, and nothing confirms it worked.",
      "<b>A printer is a row:</b> no status (ready, out of paper, not responding), nothing waiting to print, and its actions are buttons crowded on the row.",
    ],
    today: [["printers-1280", "Today", "No printers added yet"], ["printers-800", "Today at 800 px", ""]],
    options: [
      { id: "a", name: "Your printers and the chosen one", idea: "Your printers are a list on the left, each with a small picture and whether it's ready, and adding one (search the network or type an address) sits under them. The right shows the chosen printer: its status, Print a test page, its address and what it prints, anything waiting to print, and Remove at the foot.",
        shots: [["a-list", "Office LaserJet chosen", ""], ["a-list-800", "At 800 px", "The printer above, the list below"]] },
      { id: "b", name: "Find and add", idea: "The right is about adding: printers found on your network as cards with an Add button that turns into progress and then Added, and a line for typing an address if yours isn't listed. Your printers stay a short list on the left, where the radio button picks the default and each printer's menu holds the test page, address and Remove.",
        shots: [["b-find", "Printers found on Home-5G", "One added, one adding"]] },
    ],
    pages: { "a-list": page(listA), "b-find": page(findB) },
  });
})();
