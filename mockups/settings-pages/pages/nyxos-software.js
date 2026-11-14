// NyxOS › Apps & Defaults › Software: what's installed for you and for everyone, moving and
// removing apps, and where apps come from (Nyx Store, Nyx Welcome, nyx install).
(() => {
  const DESC = "Apps installed for you and for everyone, and where to get more.";
  const page = (body) => () => nwin({ cat: "apps", page: "Software", desc: DESC, body: body() });

  // [name, version, from, icon, swatch, what]
  const MINE = [
    ["Blender", "4.5.2", "nixpkgs", "cube", "amber", "3D modelling and animation"],
    ["Firefox", "151.0", "Flathub", "globe", "coral", "Web browser"],
    ["Obsidian", "1.9.4", "NyxOS catalog", "book", "violet", "Notes in Markdown"],
    ["Inkscape", "1.4.2", "Flathub", "pen", "graphite", "Vector drawing"],
    ["Zed", "0.212.4", "nixpkgs", "code", "blue", "Code editor"],
    ["Nyx Music", "1.6.0", "NyxOS catalog", "music", "pink", "Your music library"],
    ["ripgrep", "14.1.1", "nixpkgs", "terminal", "green", "Search inside files, in a terminal"],
  ];
  // [name, kind, desc, icon, swatch, action]
  const ALL = [
    ["GIMP", "movable", "For everyone; can be yours", "image", "teal", "Move to My Account"],
    ["steam", "pkg", "From nixpkgs", "play", "blue", "Remove", "Unfree license"],
    ["virt-manager", "pkg", "From nixpkgs", "monitor", "violet", "Remove"],
    ["htop", "pkg", "From nixpkgs", "pulse", "green", "Remove"],
    ["Nyx Weather", "nyx", "Turned off", "sun", "amber", "Reset"],
    ["Nyx Notes", "nyx", "Turned on", "file-text", "coral", "Reset"],
  ];
  const appic = (ic, c, size = 34) => `<span class="sft-ic" style="--c:var(--sw-${c});width:${size}px;height:${size}px;border-radius:${Math.round(size * 0.26)}px">${icon(ic)}</span>`;
  const pend = (n, what) => `<div class="sft-pend"><span class="pdot"></span><b>${n} change${n > 1 ? "s" : ""} waiting</b><span class="w">${what}</span><span class="sp"></span><span class="pw">${icon("lock")}Asks for an administrator's password · about 2 min</span>${btn("Discard", "ghost")}${btn("Apply", "primary")}</div>`;

  /* ── A: your apps, and a card for the one you pick ─────────────────── */
  const aCtl = () => `
    <div class="sft-seg">${seg(["For you · 7", "For everyone · 6"], "For you · 7")}</div>
    <div class="field sft-find">${icon("search")}<span class="ph">Find an installed app</span></div>
    <div class="card sft-list">${MINE.map(([n, v, from, ic, c]) => `<div class="opt ${n === "Blender" ? "picked" : ""}">${appic(ic, c, 32)}<div class="opt-text"><div>${n}</div><div class="d">${v} · ${from}</div></div></div>`).join("")}</div>
    <div class="sft-get"><span>${icon("store")}</span><div><b>Get more apps</b><small>Nyx Store has the NyxOS catalog, nixpkgs and Flathub</small></div>${btn("Open Store", "sm")}</div>`;
  const aPv = () => `
    <div class="sft-hero card">
      ${appic("cube", "amber", 76)}
      <div class="tx"><b>Blender</b><span>3D modelling and animation</span><div class="chips">${chip("Yours", "acc", "user")}${chip("nixpkgs")}${chip("4.5.2")}</div></div>
      <div class="bts">${btn("Open", "primary")}${btn("Remove", "dtext")}</div>
    </div>
    <div class="sft-facts card">${[["Installed for", "You only"], ["Lives in", "Your Nix profile"], ["Updates", "With Applications, at 03:00"], ["Size", "412 MB"], ["Installed", "14 Oct 2026, from Nyx Store"], ["Removing it", "Needs no password"]].map(([k, v]) => `<div><small>${k}</small><span>${v}</span></div>`).join("")}</div>
    <div class="gtitle">Where apps come from</div>
    <div class="sft-src">
      <div class="card">${icon("store")}<b>Nyx Store</b><span>Browse the NyxOS catalog, nixpkgs and Flathub</span><span class="lnk">Open Store ${icon("chev-r")}</span></div>
      <div class="card">${icon("spark")}<b>Nyx Welcome</b><span>The apps you picked when you first signed in</span><span class="lnk">Open Welcome ${icon("chev-r")}</span></div>
      <div class="card">${icon("terminal")}<b>In a terminal</b><span class="mono">nyx install blender</span><span class="dim">Same place, same updates</span></div>
    </div>
    ${ocard("", [nrow("Opens", ".blend files and 3D models by default", "Default Apps", { ic: "file", sec: "system" }), nrow("Its next update", "4.5.3 installs tonight at 03:00", "Updates", { ic: "download", sec: "system" })], { cls: "icons sft-links" })}
    ${pvfoot("Other accounts on Atlas install their own.", "info", `<span class="lnk">${icon("hist")}Undo your last app change</span>`)}`;
  const aBody = () => split(aCtl(), aPv(), { sec: "system", ctlw: 380, cls: "sft-a" });

  /* ── B: yours and everyone's, side by side ─────────────────────────── */
  const bCtl = () => `
    ${ocard("Get apps", [
      orow("Nyx Store", "The NyxOS catalog, nixpkgs and Flathub", btn("Open Store", "sm"), { ic: "store", sec: "system" }),
      orow("Nyx Welcome", "The starter picks from your first sign-in", btn("Open", "sm"), { ic: "spark", sec: "system" }),
      orow("In a terminal", `<span class="mono">nyx install &lt;app&gt;</span>`, "", { ic: "terminal", sec: "system" }),
    ], { first: true, cls: "icons" })}
    <div class="gtitle gflex">Installed for everyone<span class="sp"></span><span class="note">Changing these is a rebuild</span></div>
    <div class="card sft-all">${ALL.map(([n, k, d, ic, c, act, tag], i) => {
      const chg = n === "GIMP" || n === "htop";
      return `<div class="opt ${chg ? "chg" : ""}">${appic(ic, c, 28)}<div class="opt-text"><div>${k === "pkg" ? `<span class="mono">${n}</span>` : n}${tag ? ` <span class="sft-tag">${tag}</span>` : ""}</div><div class="d">${chg ? `<span class="acc">${n === "GIMP" ? "Moves to you" : "Removed for everyone"}</span> · after Apply` : d}</div></div>${chg ? btn("Undo", "sm ghost") : btn(act, "sm")}</div>`;
    }).join("")}</div>`;
  const shelf = (items, hot) => `<div class="sft-shelf">${items.map(([n, ic, c, st]) => `<div class="ap ${st || ""}">${appic(ic, c, 44)}<span>${n}</span></div>`).join("")}</div>`;
  const bPv = () => `
    ${pvhead("Who has what", "Your apps are yours; everyone's are on Atlas for every account.", seg(["Apps", "Tools"], "Apps"))}
    <div class="sft-two">
      <div class="card sft-col">
        <div class="ch">${av("Sam Rivera", 26)}<div><b>Yours</b><small>No password to install or remove</small></div></div>
        ${shelf(MINE.slice(0, 6).map(([n, , , ic, c]) => [n, ic, c]).concat([["GIMP", "image", "teal", "in"]]))}
      </div>
      <div class="sft-mv"><span>${icon("chev-l")}</span></div>
      <div class="card sft-col every">
        <div class="ch"><span class="sft-pc">${icon("monitor")}</span><div><b>Everyone on Atlas</b><small>Sam Rivera, Alex Chen, Jo Park</small></div></div>
        ${shelf([["GIMP", "image", "teal", "out"], ["steam", "play", "blue"], ["virt-manager", "monitor", "violet"], ["htop", "pulse", "green", "gone"], ["Nyx Notes", "file-text", "coral"], ["Nyx Weather", "sun", "amber", "off"]])}
      </div>
    </div>
    <div class="card sft-call">${icon("info")}<div><b>Moving GIMP to your account</b><span>It's added to your profile and removed for everyone in the same rebuild. Alex and Jo lose it until they install their own.</span></div></div>
    ${pvfoot("Command-line tools like ripgrep are under Tools.", "info")}`;
  const bBody = () => `${split(bCtl(), bPv(), { sec: "system", ctlw: 430, cls: "sft-b" })}${pend(2, "Move GIMP to your account · Remove htop for everyone")}`;

  REG("nyxos-software", {
    name: "Software",
    summary: "NyxOS's Software page is two buttons (Open Store, Open Updates) and two lists: apps installed for you, each with Remove, and what's installed for everyone, with Move to My Account, Remove or Reset. It works, but it's text rows with no icons, and the explanations are longer than the lists.",
    problems: [
      "<b>Mostly explanation:</b> the Store row's description is two lines; “Installed for you” and “Installed for everyone” each open with a paragraph before any app.",
      "<b>Apps are text rows:</b> no icon, and the line under the name is a version and a source (“4.5.2 · nixpkgs”); nothing about size, updates or when it was installed.",
      "<b>Three kinds mixed in one list:</b> “Installed for everyone” holds apps that can be moved, nixpkgs packages to remove and Nyx apps to reset, one after another with different buttons.",
      "<b>Each action rebuilds on its own:</b> moving one app or removing a package for everyone starts its own rebuild and password prompt; three removals are three rebuilds.",
      "<b>Updates is a button here:</b> “Open Updates” sits beside “Open Store” as if it were a second store, while Nyx Welcome and nyx install are only mentioned in a note.",
      "<b>Empty on this laptop:</b> without the System Manager both lists read “Nothing yet”, so today's shot shows only the notes.",
    ],
    today: [
      ["nyxos-software-1280", "Software today", "Taken on a laptop without NyxOS's System Manager, so both lists are empty; what they hold comes from the Rust source"],
      ["nyxos-software-800", "Software today at 800 px", "The tabs scroll and the notes fill the page"],
    ],
    options: [
      { id: "a", name: "Your apps, each with a card", idea: "The left is a list with icons: your apps, or everyone's with a switch at the top, and a search. Picking one opens its card on the right, like a store page for something you already have: what it is, where it came from, who has it, how it's updated, its size, and Open or Remove. Under it, where apps come from: Nyx Store, Nyx Welcome and nyx install in a terminal, all landing in the same place.",
        shots: [["a-software", "Blender picked", "Yours, from nixpkgs, updated with Applications"], ["a-software-800", "At 800 px", "The app's card above the list"]] },
      { id: "b", name: "Yours and everyone's", idea: "The picture is two shelves: your apps, which need no password, and the ones on Atlas for every account. Moving an app from everyone's to yours, or removing one for everyone, shows on the shelves at once and waits in the bar at the bottom, so several changes go in one rebuild with one password. The controls are where to get apps and the everyone list, with its unfree licenses and Nyx apps marked.",
        shots: [["b-software", "GIMP moving to Sam", "htop removed for everyone; both wait for Apply"]] },
    ],
    pages: { "a-software": page(aBody), "b-software": page(bBody) },
  });
})();
