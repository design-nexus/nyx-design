// NyxOS › System › Services: the System Manager's services and groups, your own services.
(() => {
  const DESC = "What runs on Atlas, and who may use containers and virtual machines.";
  const page = (body) => () => nwin({ cat: "system", page: "Services", desc: DESC, body: body() });

  // [id, short name, real name, technical name, icon, swatch, state]; state: on, def-on, off, def-off, turning-on
  const SVCS = [
    ["bluetooth", "Bluetooth", "Bluetooth", "BlueZ", "bluetooth", "blue", "def-on"],
    ["printing", "Printing", "Printing (CUPS)", "CUPS", "printer", "teal", "on"],
    ["ssh", "Remote login", "Remote login (OpenSSH)", "OpenSSH", "terminal", "graphite", "def-off"],
    ["avahi", "Network discovery", "Local network discovery (Avahi)", "Avahi", "compass", "green", "def-on"],
    ["tailscale", "Tailscale", "Tailscale", "Private network", "link", "violet", "off"],
    ["fwupd", "Firmware updates", "Firmware updates (fwupd)", "fwupd", "chip", "amber", "def-on"],
    ["flatpak", "Flatpak apps", "Flatpak apps", "Flathub", "apps", "pink", "def-on"],
    ["docker", "Docker", "Docker containers", "Containers", "cube", "blue", "turning-on"],
    ["podman", "Podman", "Podman containers", "Containers", "cube", "violet", "def-off"],
    ["incus", "Incus", "Incus containers and virtual machines", "Containers and VMs", "server", "coral", "def-off"],
    ["libvirtd", "Virtual machines", "Virtual machines (libvirt)", "libvirt", "monitor", "teal", "on"],
    ["ollama", "Ollama", "Ollama, local AI models", "Local AI models", "sparkle", "graphite", "off"],
  ];
  const STATE = {
    "def-on": ["On", "default", "ok"], on: ["On", "", "ok"], off: ["Off", "", "off"],
    "def-off": ["Off", "default", "off"], "turning-on": ["Turns on", "after Apply", "wait"],
  };
  const GROUPS = [
    ["docker", "Run Docker containers", "As good as an administrator on Atlas", "cube", true],
    ["libvirtd", "Manage system virtual machines", "", "monitor", false],
    ["incus-admin", "Manage Incus containers and virtual machines", "As good as an administrator", "server", true],
    ["kvm", "Use hardware virtualization directly", "", "cpu", false],
    ["dialout", "Use serial ports", "Boards, modems, 3D printers", "usb", false],
  ];
  const PEOPLE = [["Sam Rivera", "You · administrator", { libvirtd: 1, kvm: 1, dialout: 1, docker: "join" }], ["Alex Chen", "Administrator", { libvirtd: 1, kvm: 1, "incus-admin": 1 }], ["Jo Park", "Standard account", { dialout: 1 }]];
  const MINE = [
    ["syncthing", "Syncs files between your devices", "running", true],
    ["backup-photos", "Backs up Pictures every morning", "failed", true],
    ["pipewire", "Sound and screen sharing", "running", true],
    ["ssh-agent", "Keeps your SSH keys unlocked", "running", true],
    ["nyx-clipboard", "Clipboard history", "running", true],
    ["mpd", "Music Player Daemon · not at sign-in", "stopped", false],
  ];

  const lic = (ic, c) => `<span class="lic" style="--tc:var(--sw-${c})">${icon(ic)}</span>`;
  const pend = (n, what) => `<div class="svc-pend"><span class="pdot"></span><b>${n} change${n > 1 ? "s" : ""} waiting</b><span class="w">${what}</span><span class="sp"></span><span class="pw">${icon("lock")}Asks for an administrator's password · about 2 min</span>${btn("Discard", "ghost")}${btn("Apply", "primary")}</div>`;
  const stline = (st) => { const [a, b, k] = STATE[st]; return `<span class="svc-st ${k}"><i></i>${a}${b ? `<small> · ${b}</small>` : ""}</span>`; };

  /* ── A: a switchboard, and what the chosen one adds ────────────────── */
  const tile = ([id, short, , tech, ic, c, st]) => `<div class="svc-t ${id === "docker" ? "sel" : ""}">${lic(ic, c)}<div class="tx"><b>${short}</b>${stline(st)}</div></div>`;
  const aCtl = () => `
    <div class="gtitle first gflex">System services<span class="sp"></span><span class="note">Default is what NyxOS chooses</span></div>
    <div class="svc-grid">${SVCS.map(tile).join("")}</div>
    ${ocard("", [nrow("Your services", "Run as you, from when you sign in", "6 running", { ic: "user", sec: "system" }), nrow("Everything running on Atlas", "The whole computer's services, for reference", "143", { ic: "list", sec: "system" })], { cls: "icons svc-more" })}`;
  const adds = [
    ["server", "The Docker service", "dockerd and containerd, started with the computer"],
    ["users", "A docker group", "People in it run containers without a password"],
    ["network", "A network for containers", "docker0, so containers reach each other and the internet"],
    ["download", "About 240 MB", "Downloaded once, in the rebuild"],
  ];
  const aPv = () => `
    ${pvhead("Docker containers", "Runs containers for development and self-hosted apps.", seg(["Default", "On", "Off"], "On"))}
    <div class="svc-flip card">
      <div class="fs"><small>Now</small><b><span class="svc-st off"><i></i></span>Off</b><span>NyxOS's default</span></div>
      <span class="ar">${icon("chev-r")}</span>
      <div class="fs to"><small>After you apply</small><b><span class="svc-st ok"><i></i></span>On</b><span>Starts when Atlas starts</span></div>
    </div>
    ${ocard("Turning it on adds", adds.map(([ic, t, d]) => orow(t, d, "", { ic, sec: "system" })), { cls: "icons svc-adds" })}
    ${ocard("Who can use it", [
      orow(`${av("Sam Rivera", 26)}<span>Sam Rivera</span><span class="pill" style="--tc:var(--accent)">Joins</span>`, "", sw(true), { cls: "svc-who" }),
      orow(`${av("Alex Chen", 26)}<span>Alex Chen</span>`, "", sw(false), { cls: "svc-who" }),
    ], { cls: "svc-whoc", note: `<span class="svc-warn">${icon("warn")}Being in docker is as good as being an administrator</span>`, act: " " })}
    ${pvfoot("Podman runs the same containers without a group, if you'd rather.", "info")}`;
  const aBody = () => `${split(aCtl(), aPv(), { sec: "system", ctlw: 450, cls: "svc-a" })}${pend(2, "Docker containers on · Sam Rivera joins docker")}`;

  /* ── B: system, yours and groups, one at a time ────────────────────── */
  const bseg = (on) => `<div class="svc-seg">${seg(["System · 12", "Yours · 6", "Groups · 5"], on)}</div>`;
  const cell = (v) => v === "join" ? `<span class="svc-c join">${icon("plus")}</span>` : v ? `<span class="svc-c on">${icon("check")}</span>` : `<span class="svc-c"></span>`;
  const bGroupsCtl = () => `
    ${bseg("Groups · 5")}
    <div class="gtitle gflex">Groups<span class="sp"></span></div>
    <div class="card icons svc-gl">${GROUPS.map(([g, what, warn, ic], i) => {
      const who = PEOPLE.filter(([, , m]) => m[g]);
      return `<div class="opt ${i === 0 ? "picked" : ""}"><span class="lic" style="--tc:var(--sec-system)">${icon(ic)}</span><div class="opt-text"><div class="mono">${g}</div><div class="d">${what}${warn ? ` · ${GROUPS[i][4] ? `<em>${warn}</em>` : warn}` : ""}</div></div><span class="svc-avs">${who.map(([n]) => av(n, 22)).join("")}</span></div>`;
    }).join("")}</div>
    <div class="svc-note">${icon("info")}<span>Being in a group lets an account use containers, virtual machines or devices directly. People see a new group the next time they sign in.</span></div>`;
  const bGroupsPv = () => `
    ${pvhead("Who's in which group", "Click a square to add or take someone out.", btn("Add someone…", "sm", "plus"))}
    <div class="svc-mx card">
      <div class="mh"><span></span>${GROUPS.map(([g, , , , admin]) => `<span class="mono ${g === "docker" ? "hl" : ""}">${g}${admin ? icon("warn", "wi") : ""}</span>`).join("")}</div>
      ${PEOPLE.map(([n, role, m]) => `<div class="mr"><span class="who">${av(n, 30)}<span><b>${n}</b><small>${role}</small></span></span>${GROUPS.map(([g]) => `<span class="${g === "docker" ? "hl" : ""}">${cell(m[g])}</span>`).join("")}</div>`).join("")}
    </div>
    <div class="svc-key"><span>${cell(1)}In the group</span><span>${cell("join")}Joins when you apply</span><span>${icon("warn", "wi")}As good as an administrator</span></div>
    <div class="card svc-call">${icon("warn")}<div><b>Sam Rivera joins docker</b><span>Anyone in docker can start a container that reads or changes any file on Atlas. Only add people you'd make an administrator.</span></div></div>
    ${pvfoot("Groups are system settings, applied with the page's other changes.", "info")}`;
  const bGroups = () => `${split(bGroupsCtl(), bGroupsPv(), { sec: "system", ctlw: 400, cls: "svc-b" })}${pend(1, "Sam Rivera joins docker")}`;

  const ust = (s) => s === "running" ? `<span class="pill dot" style="--tc:var(--success)">Running</span>` : s === "failed" ? `<span class="pill dot" style="--tc:var(--danger)">Failed</span>` : `<span class="pill dot" style="--tc:var(--text-tertiary)">Stopped</span>`;
  const bYoursCtl = () => `
    ${bseg("Yours · 6")}
    <div class="field svc-find">${icon("search")}<span class="ph">Find a service</span></div>
    <div class="card svc-ul">${MINE.map(([n, d, s, boot]) => `<div class="opt ${n === "backup-photos" ? "picked" : ""}"><div class="opt-text"><div class="mono">${n}</div><div class="d">${d}</div></div>${ust(s)}</div>`).join("")}</div>
    ${ocard("", [nrow("Everything running on Atlas", "The whole computer's services, for reference", "143", { ic: "list", sec: "system" })], { cls: "icons" })}`;
  const LOG = [
    ["Yesterday", "Backup finished: 1.2 GB added, 38 photos", "old"],
    ["09:00:02", "Starting backup of /home/sam/Pictures", ""],
    ["09:00:02", "Opening the repository on backup-drive", ""],
    ["09:00:04", "Fatal: the repository can't be opened: the drive isn't mounted", "bad"],
    ["09:00:04", "backup-photos.service: Main process exited, status=1/FAILURE", "bad"],
    ["09:00:04", "backup-photos.service: Failed with result 'exit-code'", "bad"],
  ];
  const bYoursPv = () => `
    ${pvhead("backup-photos", "Copies Pictures to the backup drive, every morning at 9.", `${btn("Start", "sm", "play")}${btn("Edit", "sm ghost", "pen")}`)}
    <div class="svc-uhero card">
      <span class="svc-ubig bad">${icon("warn")}</span>
      <div class="tx"><b>Failed 2 hours ago</b><span>The backup drive wasn't plugged in. It runs again tomorrow at 9:00.</span></div>
    </div>
    <div class="svc-facts card">${[["Started by", "A timer, daily at 09:00"], ["Starts at sign-in", "Yes"], ["Last worked", "Yesterday, 09:03 · 1.2 GB"], ["Runs", "restic backup ~/Pictures"]].map(([k, v]) => `<div><small>${k}</small><span>${v}</span></div>`).join("")}</div>
    <div class="svc-log card"><div class="lh"><b>Log</b><span class="sp"></span><span class="lnk">Full log ${icon("external")}</span></div>${LOG.map(([t, l, c]) => `<div class="ll ${c}"><span>${t}</span>${l}</div>`).join("")}</div>
    ${pvfoot("Your services start and stop right away; no password and no rebuild.", "check-c", `<span class="lnk">Don't start at sign-in</span>`)}`;
  const bYours = () => split(bYoursCtl(), bYoursPv(), { sec: "system", ctlw: 440 });

  /* ── C: one list, sorted by what you'd use it for ──────────────────── */
  const CGROUPS = [
    ["Connecting and sharing", ["bluetooth", "printing", "ssh", "avahi", "tailscale"]],
    ["Apps, machines and hardware", ["flatpak", "docker", "podman", "incus", "libvirtd", "ollama", "fwupd"]],
  ];
  const BY = Object.fromEntries(SVCS.map((s) => [s[0], s]));
  const triRow = ([id, , name, , ic, c, st]) => {
    const chg = id === "ssh" || id === "docker";
    const v = chg ? "On" : st === "def-on" || st === "def-off" ? "Default" : st === "off" ? "Off" : "On";
    return `<div class="opt ${id === "ssh" ? "picked" : ""} ${chg ? "chg" : ""}">${lic(ic, c)}<div class="opt-text"><div>${name}</div></div>${chg ? `<span class="pill" style="--tc:var(--accent)">Changed</span>` : ""}<span class="svc-tri">${seg(["Default", "On", "Off"], v)}</span></div>`;
  };
  const cCtl = () => CGROUPS.map(([h, ids], i) => `<div class="gtitle ${i === 0 ? "first" : ""}">${h}</div><div class="card icons svc-tl">${ids.map((id) => triRow(BY[id])).join("")}</div>`).join("");
  const cPv = () => `
    ${pvhead("Remote login (OpenSSH)", "Sign in to Atlas from another computer, in a terminal.", `<span class="pill" style="--tc:var(--accent)">Turns on after Apply</span>`)}
    <div class="svc-net card">
      <div class="nd far">${icon("laptop")}<b>Another computer</b><small>ssh sam@atlas.local</small></div>
      <div class="ln"><span>port 22</span></div>
      <div class="nd fw">${icon("shield")}<b>Firewall</b><small>Opens port 22</small></div>
      <div class="ln"><span></span></div>
      <div class="nd me">${icon("monitor")}<b>Atlas</b><small>sshd</small></div>
    </div>
    ${ocard("What changes", [
      orow("The firewall lets port 22 in", "From any network Atlas joins; the Network page lists it", "", { ic: "shield", sec: "system" }),
      orow("Passwords or keys", "Accounts sign in with their password or an SSH key in ~/.ssh/authorized_keys", "", { ic: "lock", sec: "system" }),
      orow("Administrators can't sign in as root", "They sign in as themselves, then use sudo", "", { ic: "user", sec: "system" }),
    ], { cls: "icons" })}
    <div class="card svc-call">${icon("warn")}<div><b>Only if you need it</b><span>Anyone who can reach Atlas on the network can try a password. Away from home, Tailscale is a safer way in.</span></div></div>
    ${pvfoot("Changed services are applied together, as one rebuild.", "info")}`;
  const cBody = () => `${split(cCtl(), cPv(), { sec: "system", ctlw: 500, cls: "svc-c3" })}${pend(2, "Docker containers on · Remote login on")}`;

  REG("nyxos-services", {
    name: "Services",
    summary: "NyxOS's Services page is a long list of twelve dropdowns reading Default, then five group switches, then your own services and the whole computer's. Nothing says what a service does, whether it's running, or what turning it on would add, and the Apply row sits between the groups and the lists.",
    problems: [
      "<b>Every service reads “Default”:</b> twelve identical dropdowns with a System tag; you can't tell whether Bluetooth or Docker is actually on without opening each one.",
      "<b>No idea what a switch does:</b> “Remote login (OpenSSH)” or “Incus containers and virtual machines” come with no word on what they add (a firewall port, a group, a download) or why you'd want them.",
      "<b>Groups are about you only:</b> each group is a switch for the account that's signed in, with others squeezed into the description (“Also: alex”); there's no view of who's in what.",
      "<b>The danger is in a footnote:</b> that docker and incus-admin are as good as an administrator is one sentence in the group note and a parenthesis in a description.",
      "<b>Apply is lost in the middle:</b> the Apply row sits under the groups, before the long lists of your services and the computer's, so it scrolls away.",
      "<b>Rows are tall and empty:</b> each service takes a 54 px row for a name and a dropdown; at 800 px the whole screen is eight rows.",
    ],
    today: [
      ["nyxos-services-1280", "Services today", "Taken on a laptop without NyxOS's System Manager, so every service reads Default and the groups and lists below come from the Rust source"],
      ["nyxos-services-800", "Services today at 800 px", "Eight dropdowns fill the window"],
    ],
    options: [
      { id: "a", name: "Switchboard", idea: "The twelve services are tiles, each with a short name and whether it's on (and whether that's NyxOS's default). Clicking one opens it on the right: Default, On or Off, what it is now and after you apply, what turning it on adds, and who in this computer may use it. Your own services and the whole computer's list are rows at the foot that open their own pages. Changes wait in a bar at the bottom until you apply them together.",
        shots: [["a-services", "Docker picked", "Turning it on adds a service, a group, a network and a download; Sam joins the group"], ["a-services-800", "At 800 px", "The detail above the tiles"]] },
      { id: "b", name: "System, yours and groups", idea: "A switch at the top of the page picks one of three lists: the system's services, your own (run as you, started at sign-in, no password), and the groups. Groups get a grid of people against groups, so you see who can run containers or virtual machines at a glance and add someone with one click; the ones as good as an administrator are marked. Your own services show their state, the last run's log and Start or Stop on the right.",
        shots: [["b-groups", "Groups as a grid of people", "Sam joins docker; the warning sits under the grid"], ["b-yours", "Your services", "A failed backup, why it failed and what's next"]] },
      { id: "c", name: "One list by purpose", idea: "One column of every service, sorted by what you'd use it for (sharing and connecting; apps, containers and machines; hardware), each with Default, On and Off side by side instead of a dropdown, so the whole state of the computer is readable in one look. The service you touch shows on the right as a picture of what it opens up: for remote login, the path from another computer through the firewall to Atlas, then what changes.",
        shots: [["c-services", "Remote login picked", "The path it opens, and what changes"]] },
    ],
    pages: { "a-services": page(aBody), "b-groups": page(bGroups), "b-yours": page(bYours), "c-services": page(cBody) },
  });
})();
