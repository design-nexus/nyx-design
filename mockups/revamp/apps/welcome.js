// Nyx Welcome on the revamp page: today's problems and two options.
(() => {
  const ICONS = {
    nyx: '<path d="M12 2.8 20 7.4v9.2L12 21.2 4 16.6V7.4z"/><path d="M8.5 15.5v-7l7 7v-7"/>',
    apps: '<rect x="4" y="4" width="6.5" height="6.5" rx="1.8"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.8"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.8"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.8"/>',
    rocket: '<path d="M14 4.5c3-1.5 5.5-1 5.5-1s.5 2.5-1 5.5L13 14.5 9.5 11z"/><path d="M9.5 11 6 10.5 3.5 13l4 1M13 14.5l.5 3.5L11 20.5l-1-4M7.5 16.5 5 19"/>',
    undo: '<path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11"/>',
    bolt: '<path d="M13 3 5 13.5h6L10 21l8-10.5h-6z"/>',
    box: '<path d="M12 3 20 7.5v9L12 21l-8-4.5v-9z"/><path d="M4 7.5 12 12l8-4.5M12 12v9"/>',
  };
  const noSettings = (h) => h.replace(ib("sliders", "Settings (Ctrl+,)"), "");

  const THEMES = [
    ["Nyx Night", "#0d0e12", "#191a21", "#e7e8ee", "#a2a5ba", "#3d8ae8"],
    ["Nyx Day", "#ecedf2", "#f5f6f9", "#171820", "#50546c", "#136dcd"],
    ["Tokyo Night", "#1a1b26", "#24283b", "#c0caf5", "#7a82a8", "#7aa2f7"],
    ["Catppuccin", "#1e1e2e", "#2a2b3c", "#cdd6f4", "#9399b2", "#cba6f7"],
    ["Gruvbox", "#282828", "#32302f", "#ebdbb2", "#a89984", "#d79921"],
    ["Nord", "#2e3440", "#3b4252", "#eceff4", "#a3abbd", "#88c0d0"],
    ["Rosé Pine", "#191724", "#1f1d2e", "#e0def4", "#908caa", "#ebbcba"],
    ["Everforest", "#2d353b", "#343f44", "#d3c6aa", "#9da9a0", "#a7c080"],
  ];
  const themeCard = ([n, bg, sf, tx, dim, ac], on) => `<div class="wl-th ${on ? "on" : ""}"><div class="pv" style="background:${bg}"><div class="sf" style="background:${sf}"><i style="background:${tx};width:62%"></i><i style="background:${dim};width:40%"></i><b style="background:${ac}"></b></div></div><span>${n}${on ? icon("check-c") : ""}</span></div>`;

  /* ── Option A: grouped steps ──────────────────────────────────────────── */
  const sideA = (on) => {
    const st = (ic, t, k, mark) => navx(ic, t, { active: on === k, sub: mark === "done" ? icon("check", "wl-ok") : mark === "skip" ? "Skipped" : mark || "" });
    return `
    ${grp("Make it yours", true, "", "accent")}
    ${st("star", "Welcome", "welcome", "done")}
    ${st("palette", "Appearance", "appearance", on === "software" ? "done" : "")}
    ${st("monitor", "Computer and desktop", "computer", on === "software" ? "done" : "")}
    ${grp("Software", false, "", "green")}
    ${st("rocket", "Starting point", "presets", on === "software" ? "done" : "")}
    ${st("apps", "Choose software", "software", on === "software" ? "15" : "")}
    ${grp("You", false, "", "violet")}
    ${st("bolt", "Default apps", "defaults")}
    ${st("user", "Accounts and sign-in", "accounts")}
    ${grp("Finish", false, "", "amber")}
    ${st("shield", "Updates and recovery", "care")}
    ${st("check-c", "Review and apply", "review")}
    <div class="foot">${icon("info")}<span>Nothing for everyone changes until Review</span></div>`;
  };
  const hdrW = (step, n) => noSettings(header({ icon: "nyx", name: "Welcome", center: `<div class="wl-prog"><span>${step}</span>${prog((n / 9) * 100)}<span class="n">${n} of 9</span></div>` }));
  const footer = (o = {}) => `<div class="wl-foot">${btn("Back", "ghost", "chev-l")}<span class="sp"></span>${o.note ? `<span class="wl-note">${icon(o.noteIc || "bolt")}${o.note}</span>` : ""}${btn("Skip")}${btn(o.next || "Next", "primary")}</div>`;

  const appearance = () => `<div class="content wl-c"><div class="clamp" style="--clamp: 760px">
    <h1 class="wl-h">Appearance</h1><p class="wl-lede">Pick a theme. Nyx apps and the desktop change as you click.</p>
    <div class="wl-themes">${THEMES.map((t, i) => themeCard(t, i === 2)).join("")}</div>
    ${setcard("", [
      ["Use it for the lock screen too", "", sw(true)],
      ["Use it for the boot and sign-in screens", "Applied with the rest at Review.", sw(false)],
      ["Density", "How much space Nyx apps leave around things.", seg(["Comfortable", "Compact"], "Comfortable")],
      ["Fonts, accents, icons and the wallpaper", "", btn("Open Settings", "", "external")],
    ])}
  </div></div>${footer({ note: "Changes right away, for you" })}`;

  const SECTIONS = [["Nyx apps", 4], ["Apps", 3], ["Command-line tools", 2], ["Development", 4], ["Infrastructure", 0], ["AI agents", 2]];
  const DEV = [
    ["Zed", "A fast code editor with collaboration built in.", true, [["For you"], ["Flathub"]]],
    ["VS Code", "Microsoft's editor, with its extension marketplace.", false, [["For you"], ["Unfree licence", "warn"]]],
    ["Rust", "rustup, cargo and the stable toolchain.", true, [["For you"]], "Developer"],
    ["Node.js 22", "With npm and corepack.", true, [["For everyone"]], "Developer"],
    ["Docker", "Containers, with the docker group for you.", true, [["For everyone"], ["Service: docker"], ["Group: docker", "warn"]], "Homelab"],
    ["Podman", "Rootless containers, no daemon.", false, [["For everyone"]]],
    ["Go", "The Go toolchain.", false, [["For you"]]],
  ];
  const software = (o = {}) => `<div class="cols"><div class="main"><div class="content wl-c"><div class="clamp" style="--clamp: 720px">
      <h1 class="wl-h">Choose software</h1><p class="wl-lede">Your starting point (Developer, Homelab) checked some of these. Change anything; Nyx Store has the rest any time.</p>
      <div class="wl-secs">${SECTIONS.map(([n, c]) => `<span class="wl-sec ${n === "Development" ? "on" : ""}">${n}${c ? `<b>${c}</b>` : ""}</span>`).join("")}</div>
      <div class="card wl-items">${DEV.map(([n, d, on, tags, from]) => `<div class="wl-it"><span class="cbx sq ${on ? "done" : ""}">${on ? icon("check") : ""}</span><div class="tx"><div class="r1"><b>${n}</b>${from ? `<span class="wl-from">from ${from}</span>` : ""}</div><span class="d">${d}</span></div><div class="tags">${tags.map(([t, c]) => `<span class="wl-tag ${c || ""}">${t}</span>`).join("")}</div></div>`).join("")}</div>
      <p class="wl-inc">Included with NyxOS: Git, curl, Neovim.</p>
    </div></div>${footer(o.narrow ? { note: "15 picked, installed at Review", noteIc: "box" } : { note: "Installed at Review, all together", noteIc: "box" })}</div>
    ${o.narrow ? "" : `<div class="insp wl-basket"><div class="ibody">
      <div class="lab">Your picks <span class="cnt">15</span></div>
      ${[["Nyx apps", "Notepad, Calculator, Archive, Photos"], ["Apps", "Firefox, Signal, Obsidian"], ["Command-line tools", "ripgrep, btop"], ["Development", "Zed, Rust, Node.js 22, Docker"], ["AI agents", "Claude Code, Codex"]].map(([s, xs]) => `<div class="wl-bk"><span>${s}</span><b>${xs}</b></div>`).join("")}
      <div class="lab">Starting point</div>
      <div class="wl-pre">${chip("Developer", "on", "check")}${chip("Homelab", "on", "check")}${chip("Everyday")}${chip("AI Developer")}</div>
      <div class="wl-bnote">${icon("alert")}<span>Docker adds you to the docker group and VS Code has an unfree licence; Review asks you to agree.</span></div>
    </div></div>`}</div>`;

  /* ── Option B: one thing at a time ────────────────────────────────────── */
  const STAGES = ["Look", "Computer", "Software", "Accounts", "Review"];
  const stepper = (on) => `<div class="wl-stepper">${STAGES.map((s, i) => `<span class="wl-st ${i < on ? "done" : i === on ? "on" : ""}"><b>${i < on ? icon("check") : i + 1}</b>${s}</span>${i < STAGES.length - 1 ? '<i class="ln"></i>' : ""}`).join("")}</div>`;
  const hdrB = (on) => noSettings(header({ icon: "nyx", name: "Welcome", center: on < 0 ? "" : stepper(on) })).replace(ib("sidebar", "Sidebar (Ctrl+B)"), "");

  const welcome = () => `<div class="wl-hero">
    <div class="wl-logo">${icon("nyx")}</div>
    <h1>Welcome to NyxOS, Sam</h1>
    <p>A few steps to make this computer yours: how it looks, the software you want, and your accounts. Skip anything; Welcome stays in the launcher.</p>
    <div class="wl-how">
      <div>${icon("bolt")}<b>Right away, for you</b><span>Your theme, default apps and accounts change as you choose them.</span></div>
      <div>${icon("box")}<b>Together, at the end</b><span>The computer's name, time zone and software for everyone are applied in one go, after you review them.</span></div>
      <div>${icon("undo")}<b>Always reversible</b><span>Each change is a new system version. The one before stays in the boot menu.</span></div>
    </div>
    <div class="wl-go">${btn("Get started", "primary big")}<span>About 10 minutes · 5 parts</span></div>
  </div>`;

  const PRESETS = [
    ["Everyday", "home", "Browsing, mail, music, photos and office documents.", "Firefox, Thunderbird, LibreOffice, Spotify", 6, false],
    ["Developer", "code", "Editors, toolchains and the command-line tools developers reach for.", "Zed, Rust, Node.js 22, ripgrep", 9, true],
    ["AI Developer", "sparkle", "Coding agents and local models on top of the Developer set.", "Claude Code, Codex, Ollama, LM Studio", 7, false],
    ["Homelab", "server", "Containers, remote access and the tools to run services at home.", "Docker, Tailscale, Cockpit, restic", 8, true],
  ];
  const presets = () => `<div class="content wl-c"><div class="clamp" style="--clamp: 760px">
    <div class="wl-kick">Software · 1 of 2</div>
    <h1 class="wl-h">Where do you want to start?</h1><p class="wl-lede">Pick any that fit. Each checks a set of software on the next page, where you can change every item, or pick none and choose as you go.</p>
    <div class="wl-presets">${PRESETS.map(([n, ic, d, xs, more, on]) => `<div class="wl-pc ${on ? "on" : ""}"><div class="r1"><span class="ic">${icon(ic)}</span><b>${n}</b><span class="cbx ${on ? "done" : ""}">${on ? icon("check") : ""}</span></div><span class="d">${d}</span><span class="xs">${xs} <em>and ${more} more</em></span></div>`).join("")}</div>
  </div></div>${footer({ next: "Next: choose software" })}`;

  const review = () => `<div class="content wl-c"><div class="clamp" style="--clamp: 720px">
    <div class="wl-kick">Review</div>
    <h1 class="wl-h">Ready to apply</h1><p class="wl-lede">NyxOS builds the new system first and switches to it only when it works. You can keep using the computer meanwhile.</p>
    <div class="wl-rv">
      <div class="wl-rc"><div class="h">${icon("monitor")}<b>This computer</b><span class="ed">Change</span></div><div class="kv"><span>Name</span><b>sams-laptop</b><span>Time zone</span><b>Europe/Lisbon</b><span>Keyboard</span><b>Portuguese</b><span>Boot and sign-in</span><b>Tokyo Night theme</b></div></div>
      <div class="wl-rc"><div class="h">${icon("apps")}<b>Software</b><span class="ed">Change</span></div><div class="kv"><span>For everyone</span><b>Docker, Node.js 22, Tailscale, Cockpit, ripgrep, btop</b><span>For you</span><b>Zed, VS Code, Rust, Notepad, Calculator, Archive, Photos</b><span>From Flathub</span><b>Signal, Obsidian</b></div></div>
    </div>
    ${setcard("", [["Update NyxOS afterwards", "The latest NyxOS, apps and packages.", sw(true)]])}
    <div class="gtitle">Needs your agreement</div>
    <div class="card wl-agree">
      <div class="opt"><span class="cbx sq done">${icon("check")}</span><div class="opt-text"><div>Docker runs a background service and adds you to the docker group</div><div class="d">Members of the group can control containers as if they were the system's administrator.</div></div></div>
      <div class="opt"><span class="cbx sq"></span><div class="opt-text"><div>VS Code uses Microsoft's licence, which isn't open source</div><div class="d">You can pick Zed or VSCodium instead on the Software page.</div></div></div>
    </div>
  </div></div><div class="wl-foot">${btn("Back", "ghost", "chev-l")}<span class="sp"></span><span class="wl-note warn">${icon("alert")}Agree to both to apply</span>${btn("Apply", "primary wl-dis")}</div>`;

  REG("welcome", {
    name: "Welcome",
    icons: ICONS,
    summary: "Welcome walks a new NyxOS user through thirteen steps in a numbered list, six of them separate pages of software checkboxes, and many steps are mostly buttons that open Settings.",
    problems: [
      "<b>Thirteen steps in a numbered list:</b> “1 Welcome” to “13 Review and apply”, each with a number, an icon and a name, so it reads like a long form before you start.",
      "<b>Software is six steps in a row:</b> Nyx apps, Apps, Command-line tools, Development, Infrastructure and AI agents are separate pages of checkboxes, with no running total of what you've picked.",
      "<b>Many steps send you away:</b> Computer and desktop is mostly five “Open” buttons into Settings, and Accounts is three more.",
      "<b>Done and skipped are tiny marks:</b> a small check or a “not available” icon at the end of a row, easy to miss.",
      "<b>Below 760 px the steps vanish:</b> the list hides completely, leaving only Back, Skip and Next with no sense of how far you are.",
      "<b>Skip sits beside Next with nearly the same weight,</b> and there's no idea of how long the whole thing takes.",
      "<b>Review asks for agreement item by item</b> with a bare “I agree” checkbox on each row, without saying why it's needed.",
    ],
    today: [],
    todayNote: "No screenshot: Welcome isn't installed on this laptop. The problems come from its code.",
    options: [
      { id: "a", name: "Grouped steps", idea: "The same steps, grouped under four coloured headings in the shared sidebar (Make it yours, Software, You, Finish), with done and skipped written out. The six software pages become one “Choose software” page with a tab per section and a running list of your picks beside it. A progress bar in the header says where you are, also when the sidebar is a rail.",
        shots: [["a-appearance", "Appearance", "Grouped steps; themes change as you click"], ["a-software", "Choosing software", "One page, a tab per section, your picks beside"], ["a-software-800", "At 800 px", "Icon rail with coloured bars; progress in the header"]] },
      { id: "b", name: "One thing at a time", idea: "No list of steps at all: five parts (Look, Computer, Software, Accounts, Review) across the top, and one roomy page at a time, with the time it takes said up front. Starting points are big cards that say what they bring. Review is a short summary you can change from, and anything needing agreement says why.",
        shots: [["b-welcome", "Welcome", "How changes are made, and how long it takes"], ["b-presets", "Starting point", "Presets as cards that say what they bring"], ["b-review", "Review", "A summary, and agreement explained"]] },
    ],
    pages: {
      "a-appearance": () => win({ hdr: hdrW("Appearance", 2), side: sideA("appearance"), page: appearance() }),
      "a-software": () => win({ hdr: hdrW("Choose software", 5), side: sideA("software"), page: software({ narrow: NARROW }) }),
      "b-welcome": () => win({ hdr: hdrB(-1), side: "", page: welcome() }),
      "b-presets": () => win({ hdr: hdrB(2), side: "", page: presets() }),
      "b-review": () => win({ hdr: hdrB(4), side: "", page: review() }),
    },
  });
})();
