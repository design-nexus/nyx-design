// Activity › Services.
(() => {
  // [unit, what it is, state, detail]
  const SVC = [
    ["xdg-document-portal", "Lets Flatpak apps open your files", "failed", "Failed 11 Nov 04:13"],
    ["dropbox", "Dropbox", "run", "Running · 54 MB"],
    ["syncthing", "File synchronization", "run", "Running · 96 MB"],
    ["pipewire", "Sound and video", "run", "Running · 48 MB"],
    ["gnome-keyring", "Passwords and keys", "run", "Running · 4 MB"],
    ["at-spi-dbus-bus", "Accessibility", "run", "Running · 1 MB"],
    ["geoclue-demo-agent", "Location for apps", "stop", "Stopped"],
    ["omarchy-backup", "Omarchy backup", "stop", "Ran at sign-in, 5 min 41 s"],
  ];
  const svc = ([u, d, s, st], sel) => `<div class="sv-r ${sel ? "sel" : ""}"><span class="sd ${s}"></span><div class="tx"><b>${d}</b><span>${u}</span></div><span class="st ${s}">${st}</span></div>`;
  const LOG = [["04:13:01", "", "Starting xdg-document-portal…"], ["04:13:02", "w", "Failed to open /run/user/1000/doc: Transport endpoint is not connected"], ["04:13:02", "e", "xdg-document-portal.service: Main process exited, status=1"], ["04:13:02", "e", "Failed with result 'exit-code'."]];
  const log = () => `<div class="sv-log mono">${LOG.map(([t, l, m]) => `<div class="${l}"><span class="t">${t}</span>${m}</div>`).join("")}</div>`;
  const detail = () => `<div class="main sv-d">
    <div class="sv-dh">${phead("Lets Flatpak apps open your files", "xdg-document-portal.service · yours · starts when an app asks")}${readings([["State", "Failed", "11 Nov at 04:13", "bad"], ["Ran for", "1 s", ""], ["Memory", "–", "not running"]], { cls: "sm" })}
      <div class="sv-acts">${btn("Restart", "primary", "refresh")}${btn("Stop", "", "stop")}${btn("Don't start it", "ghost")}<span class="sp"></span>${btn("Edit", "ghost", "pen")}</div></div>
    <div class="sv-lb"><b>Log</b>${seg(["All", "Warnings", "Errors"], "All")}<span class="sp"></span><span class="tog">Follow ${sw(true)}</span></div>${log()}</div>`;
  const tool = () => `<div class="sv-tool">${seg(["Yours", "System", "Timers"], "Yours")}<div class="field sv-filter">${icon("filter")}<span class="ph">Filter services</span></div><span class="sp"></span>${NARROW ? "" : `<span class="sv-tot">57 running · 1 failed · 64 stopped</span>`}</div>`;

  /* A: the list beside the chosen one's log, failed first, each named by what it does. */
  const pageA = () => `${tool()}<div class="cols"><div class="list sv-list"><div class="scroll">${SVC.map((s, i) => svc(s, i === 0)).join("")}</div></div>${NARROW ? "" : detail()}</div>`;

  /* B: by state: what failed, what's running, what's stopped, each a headed group. */
  const grpS = (t, tone, rows, n) => `<div class="sv-gh ${tone}"><b>${t}</b><span>${n}</span></div>${rows.map((s) => svc(s)).join("")}`;
  const pageB = () => `${tool()}<div class="scroll sv-bl"><div class="ap-body">
    ${note("alert", "1 service failed", "Lets Flatpak apps open your files (xdg-document-portal) stopped on 11 Nov.", "bad", btn("See log", "sm"))}
    <div class="card sv-groups">${grpS("Failed", "bad", SVC.filter((s) => s[2] === "failed"), 1)}${grpS("Running", "good", SVC.filter((s) => s[2] === "run"), 57)}${grpS("Stopped", "", SVC.filter((s) => s[2] === "stop"), 64)}</div>
  </div></div>`;

  REG("services", {
    name: "Services",
    summary: "Services lists all 122 of yours as a table of unit names with “generated”, “static” and “transient” in a column, under a bar of how many are running, failed and stopped. The one that failed is a line in a banner; you have to find it in the list.",
    problems: [
      "<b>Unit names, not what they do</b>: org.gnome.SettingsDaemon.DiskUtilityNotify, dbus-:1.1-io.github.design_nexus.nyx.Account…, app-com.mitchellh.ghostty.",
      "<b>systemd's words in a column</b> (generated, static, transient, enabled) where you'd want running or stopped.",
      "<b>“1 service failed. Open one to see more.”</b> doesn't say which one; it isn't first in the list.",
      "<b>Two filters, two dropdowns and two tabs</b> (Services, Timers, Yours, Any state, Filter) in one toolbar.",
    ],
    today: [["services-1280", "Today at 1280 px", "Unit names, systemd's words"], ["services-800", "Today at 800 px", ""]],
    options: [
      { id: "a", name: "The list beside its log", idea: "Each service named by what it does (its unit name underneath), failed ones first, with Running, Stopped or Failed in plain words. Choosing one shows its state, labelled actions (Restart, Stop, Don't start it) and its log beside the list.",
        shots: [["a-svc", "Services", "Failed first, its log beside the list"], ["a-svc-800", "At 800 px", "The list alone; the log opens on its own"]] },
      { id: "b", name: "By state", idea: "One list in three headed groups (Failed, Running, Stopped), the failed one named in a note at the top. Choosing a service opens it with its log.",
        shots: [["b-svc", "Services", "Failed, Running and Stopped groups"]] },
    ],
    pages: { "a-svc": () => apage("services", pageA()), "b-svc": () => apage("services", pageB()) },
  });
})();
