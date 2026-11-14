// Hardware › Disks: drives and their partition maps, each partition's details and actions
// (mount, unlock, format, resize, rename, passphrase, delete), new partitions and tables,
// SMART health, and safely removing removable drives.
(() => {
  const page = (body) => () => swin({ sec: "hardware", page: "Disks", desc: "Drives and partitions: format, resize, encrypt and check their health.", body: body() });
  const FS = { btrfs: "violet", ext4: "blue", exfat: "green", fat32: "amber", ntfs: "teal", free: "" };
  // [name, fs, size label, share of the drive (0–1), used share of the partition, flags]
  const ATLAS = [["EFI", "fat32", "2 GB", 0.03, 0.4, ""], ["Atlas", "btrfs", "880 GB", 0.85, 0.49, "lock sel"], ["Free space", "free", "118 GB", 0.12, 0, ""]];
  const BACKUP = [["Backup", "exfat", "1.8 TB", 1, 0.66, ""]];
  const DRIVES = [["drive", "Atlas SSD", "1 TB · built in", "System drive", "Healthy · 38 °C", 0.46, true], ["usb", "Backup Drive", "2 TB · USB", "Removable", "Healthy · 31 °C", 0.6, false], ["disc", "SD card", "64 GB · card reader", "", "Not checked", 0.12, false]];
  const map = (parts, o = {}) => `<div class="dk-map ${o.cls || ""}">${parts.map(([n, fs, size, share, used, fl]) => `<div class="dk-p ${fs === "free" ? "free" : ""} ${fl.includes("sel") && !o.nosel ? "sel" : ""}" style="flex:${Math.max(share, 0.035)};--pc:var(--sw-${FS[fs] || "graphite"})">${fs !== "free" ? `<i class="dk-u" style="width:${used * 100}%"></i>` : ""}${share > 0.1 ? `<div class="dk-pl">${fl.includes("lock") ? icon("lock") : ""}<b>${n}</b><span>${fs === "free" ? size : `${size} · ${fs === "fat32" ? "FAT32" : fs === "exfat" ? "exFAT" : fs}`}</span></div>` : ""}</div>`).join("")}</div>`;
  const facts = (rows) => `<div class="dk-facts">${rows.map(([k, v]) => `<div><small>${k}</small><span>${v}</span></div>`).join("")}</div>`;
  const drv = (ic, n, d, tag, h, used, on) => `<div class="opt ${on ? "picked" : ""}"><span class="lic" style="--tc:var(--sec-hardware)">${icon(ic)}</span><div class="opt-text"><div>${n}${tag ? ` <span class="dk-tag">${tag}</span>` : ""}</div><div class="d">${d}</div><span class="dk-bar">${prog(used * 100)}</span><div class="d dk-h"><span class="${h.startsWith("Healthy") ? "ok" : ""}">${h}</span><span>${Math.round(used * 100)}% full</span></div></div></div>`;

  /* ── A: the drive's map, and the chosen partition ──────────────── */
  const mapA = () => split(`
    ${ocard("Drives", DRIVES.map((d) => drv(...d)), { first: true })}
    <div class="card dk-hint">${icon("info", "inl")}<span>Changes ask for your password once, then remember it for a few minutes.</span></div>`,
    `${pvhead("Atlas SSD", "Lumen NVMe 1 TB · NVMe · GPT", `<div class="pill dot" style="--tc:var(--success)">Healthy · 38 °C</div>${ib("more", "More")}`)}
     ${map(ATLAS)}
     <div class="dk-leg"><span><i style="background:var(--sw-amber)"></i>FAT32</span><span><i style="background:var(--sw-violet)"></i>btrfs</span><span><i class="fr"></i>Free</span><span class="sp"></span><span class="dim">Click a part to see what's on it</span></div>
     <div class="card dk-det">
       <div class="dk-dh"><i class="dk-sw" style="background:var(--sw-violet)"></i><div><b>Atlas</b><span>btrfs · 880 GB · encrypted, unlocked</span></div><span class="sp"></span><span class="pill" style="--tc:var(--sec-hardware)">${icon("lock")}Passphrase</span></div>
       <div class="dk-use">${prog(46)}<span><b>432 GB used</b> of 880 GB · 448 GB free</span></div>
       ${facts([["Device", "/dev/nvme0n1p2"], ["Mounted at", "/ (the system)"], ["At startup", "Unlocked and mounted"], ["UUID", "4f1c…9a2e"]])}
       <div class="dk-warn">${icon("warn")}<span>This partition holds the system you're running. Changing it can leave the computer unable to start.</span></div>
       <div class="dk-acts">${btn("Lock", "", "lock")}${btn("Passphrase…", "", "pen")}${btn("Rename…", "", "rename")}${btn("Resize…", "", "scale")}${btn("Check", "", "check-c")}</div>
     </div>
     <div class="card dk-freec"><i class="dk-sw fr"></i><div class="opt-text"><div>118 GB of free space</div><div class="d">Not part of any partition. Make a new one here.</div></div>${btn("New partition…", "", "plus")}</div>`, { ctlw: 340 });

  /* ── B: a tree of drives, and each drive's health ──────────────── */
  const part = (n, fs, size, extra, on) => `<div class="opt dk-pr ${on ? "picked" : ""}"><i class="dk-sw" style="background:var(--sw-${FS[fs] || "graphite"})"></i><div class="opt-text"><div>${n}</div><div class="d">${extra}</div></div><span class="rv">${size}</span></div>`;
  const healthB = () => split(`
    <div class="card dk-tree">
      <div class="opt picked dk-dr"><span class="lic" style="--tc:var(--sec-hardware)">${icon("drive")}</span><div class="opt-text"><div>Atlas SSD <span class="dk-tag">System drive</span></div><div class="d">1 TB · NVMe</div></div><span class="dk-ok"></span></div>
      ${part("EFI", "fat32", "2 GB", "FAT32 · /boot")}
      ${part("Atlas", "btrfs", "880 GB", "btrfs · encrypted · the system")}
      <div class="opt dk-pr dk-free"><i class="dk-sw fr"></i><div class="opt-text"><div>Free space</div><div class="d acc">New partition…</div></div><span class="rv">118 GB</span></div>
    </div>
    <div class="card dk-tree">
      <div class="opt dk-dr"><span class="lic" style="--tc:var(--sec-hardware)">${icon("usb")}</span><div class="opt-text"><div>Backup Drive</div><div class="d">2 TB · USB · removable</div></div>${btn("Safely remove", "sm", "external")}</div>
      ${part("Backup", "exfat", "1.8 TB", "exFAT · open in Files")}
    </div>
    <div class="card dk-tree">
      <div class="opt dk-dr"><span class="lic" style="--tc:var(--sec-hardware)">${icon("disc")}</span><div class="opt-text"><div>SD card</div><div class="d">64 GB · card reader</div></div>${btn("Mount", "sm")}</div>
    </div>`,
    `${pvhead("Atlas SSD's health", "Temperature, wear and errors, as the drive reports them.", btn("Check now", "sm", "refresh"))}
     <div class="card dk-hh">${ring(94, { size: 92, c: "var(--success)", label: "94%" })}<div><b>Healthy</b><span>94% of its rated life left. Nothing to do.</span><small>Last checked today at 09:12</small></div></div>
     <div class="dk-tiles">
       <div class="card dk-t wide"><small>Temperature</small><b>38 °C</b><span>Cool; drives slow down above 70 °C</span>${spark([0.3, 0.32, 0.35, 0.5, 0.62, 0.45, 0.38, 0.36, 0.4, 0.55, 0.42, 0.37], { w: 220, h: 36, c: "var(--sec-hardware)" }).replace("<svg ", '<svg preserveAspectRatio="none" ')}</div>
       <div class="card dk-t"><small>Wear</small><b>6%</b><span>of its rated life used</span></div>
       <div class="card dk-t"><small>Spare blocks</small><b>100%</b><span>left</span></div>
       <div class="card dk-t"><small>Written</small><b>18.4 TB</b><span>since new</span></div>
       <div class="card dk-t"><small>Powered on</small><b>2,140 h</b><span>about 89 days</span></div>
       <div class="card dk-t"><small>Media errors</small><b class="ok">0</b><span>none found</span></div>
       <div class="card dk-t"><small>Unsafe shutdowns</small><b>12</b><span>power lost while on</span></div>
     </div>
     ${pvfoot("If a drive ever reports it's failing, this says so in red: back it up straight away.", "info")}`, { ctlw: 390 });

  /* ── C: formatting as its own page, before and after ───────────── */
  const KINDS = [["exFAT", "Every computer, files of any size", true], ["ext4", "Linux: reliable and fast"], ["btrfs", "Linux, with snapshots and compression"], ["FAT32", "Every computer and device, files up to 4 GB"], ["NTFS", "Windows"]];
  const formatC = () => split(`
    <div class="dk-back">${icon("chev-l")}<span>Disks</span><span class="dim">/</span><b>Format Backup</b></div>
    ${ocard("", [orow("Name", "Shown in Files and here.", `<span class="field dk-nm"><span>Backup</span></span>`)], { cls: "dk-gap0" })}
    <div class="gtitle">Kind</div>
    <div class="card">${KINDS.map(([n, d, on]) => `<div class="opt ${on ? "picked" : ""}">${radio(on)}<div class="opt-text"><div>${n}</div><div class="d">${d}</div></div></div>`).join("")}</div>
    ${ocard("", [
      orow("Encrypt with a passphrase", "It can't be read without it.", sw(false), { ic: "lock" }),
      orow("Overwrite the old data", "Slow: nothing can be recovered.", sw(false), { ic: "trash" }),
    ], { cls: "icons dk-gap" })}`,
    `${pvhead("Backup Drive", "2 TB · USB · what changes", "")}
     <div class="card dk-ba">
       <div class="dk-bl">Now</div>
       ${map(BACKUP, { nosel: true })}
       <div class="dk-bs">${icon("folder")}<span>1.2 TB of files: Photos, Projects and 3 more folders</span></div>
       <div class="dk-arrow">${icon("chev-d")}</div>
       <div class="dk-bl">After formatting</div>
       <div class="dk-map"><div class="dk-p new" style="flex:1;--pc:var(--sw-green)"><div class="dk-pl"><b>Backup</b><span>1.8 TB · exFAT · empty</span></div></div></div>
       <div class="dk-bs">${icon("check-c")}<span>Opens on Windows, macOS and Linux</span></div>
     </div>
     <div class="card dk-confirm">
       <div class="dk-cw">${icon("warn")}<div><b>Formatting erases Backup</b><span>1.8 TB, exFAT. This can't be undone.</span></div></div>
       <div class="dk-cr"><span>Type <b>Backup</b> to confirm</span><span class="field dk-type"><span>Back</span><i class="dk-caret"></i></span>${btn("Cancel")}${btn("Format", "danger")}</div>
     </div>`, { ctlw: 420 });

  REG("disks", {
    name: "Disks",
    summary: "Disks shows every drive with its partition map, health and a menu, and picking part of the map opens its details and actions (mount, unlock, format, resize, rename, passphrase, delete) under it; formatting and new partitions open dialogs that ask you to type the name to confirm. It's capable, but it reads like a technical tool: model numbers, device paths and UUIDs come first.",
    problems: [
      "<b>Drives are named by their model codes:</b> “MTFDKBA2T0QFM-1BD1AABGB” with “1.9 TB · NVMe · GPT · /dev/nvme1n1” under it, not what the drive is for.",
      "<b>Partitions are device names:</b> the map labels parts “nvme1n1p2”, and a small boot partition is a sliver you can barely click.",
      "<b>One long scroll of drives:</b> each drive's map, details, warning and buttons stack, so the second drive starts below the fold.",
      "<b>Health is one coloured word:</b> “Healthy · 84°F” at the end of the drive's row; temperature, wear and errors are behind the menu.",
      "<b>Explanations up top:</b> two lines about passwords and Users settings above the first drive, wrapping to three at 800 px.",
      "<b>Actions far from the map:</b> Resize and the others sit at the bottom of the details card, under facts and a warning.",
    ],
    today: [["disks-1280", "Today", ""], ["disks-800", "Today at 800 px", ""]],
    options: [
      { id: "a", name: "Drive map and details", idea: "Drives are a list on the left, each with what it's for, its size and how full it is. The right shows the chosen drive's map, large enough to click every part (small parts get at least a sliver with a label on hover), then the chosen partition's details: how full it is, where it opens, a warning if it holds the system, and its actions in one row.",
        shots: [["a-map", "Atlas SSD, with the system partition chosen", ""], ["a-map-800", "At 800 px", "The map and details above, the drives below"]] },
      { id: "b", name: "A tree with each drive's health", idea: "One list on the left holds every drive with its partitions under it, free space included (New partition… is right there), and Safely remove or Mount on the drive's row. The right shows the drive's health: a gauge of its rated life left, then its temperature over time, wear, spare blocks, data written and errors in plain words.",
        shots: [["b-health", "Atlas SSD's health", ""]] },
      { id: "c", name: "Changes as their own page", idea: "Format, resize, new partition and the like open as a page of their own instead of a dialog. The form is on the left (name, kind with what each is good for, encrypt, overwrite), and the right shows the drive before and after the change, what you'll lose, and the confirmation where you type the name, so nothing is erased by accident.",
        shots: [["c-format", "Formatting the backup drive", ""]] },
    ],
    pages: { "a-map": page(mapA), "b-health": page(healthB), "c-format": page(formatC) },
  });
})();
