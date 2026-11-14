// The pages gallery: a tab per page, grouped by section (SECTIONS in index.html), and the
// full-window viewer from mockups/revamp. Click a shot to open it; ← and → step through every
// shot of the tab and carry on into the next or previous drawn tab; D and L switch dark and
// light; Esc closes.
(() => {
  const theme0 = new URLSearchParams(location.search).get("theme") || "dark";
  document.documentElement.dataset.theme = theme0;
  document.getElementById("theme").innerHTML = ["dark", "light"]
    .map((v) => `<a class="${v === theme0 ? "on" : ""}" href="?theme=${v}${location.hash}">${v[0].toUpperCase() + v.slice(1)}</a>`).join("");

  // Every shot of every tab, in order: { app, appName, group, name, sub, img(theme), live, at }.
  const all = [];
  const byApp = {};
  for (const [id, name, sec] of ORDER) {
    const d = APPS[id];
    byApp[id] = [];
    if (!d) continue;
    const label = sec.startsWith("Round") ? name : `${sec} › ${name}`;
    const add = (s) => { s.app = id; s.appName = label; s.at = all.length; all.push(s); byApp[id].push(s); };
    (d.today || []).forEach(([file, title, note]) => add({ group: "Today", name: title, sub: note, img: () => `today/${file}.png`, live: "" }));
    // A shot is [screen, title, note], or with a 4th "TAB/SCREEN?query" drawing another tab's screen.
    (d.options || []).forEach((o) => o.shots.forEach(([s, title, note, src]) => {
      const narrow = s.endsWith("-800");
      const [app, rest] = src ? src.split("/") : [id, s.replace(/-800$/, "")];
      const [scr, q] = rest.split("?");
      add({ group: `Option ${o.id.toUpperCase()} · ${o.name}`, name: title, sub: note, img: (t) => `shots/${id}-${s}-${t}.png`,
        live: `screens.html?app=${app}&screen=${scr}${q ? `&${q}` : ""}${narrow ? "&w=800" : ""}` });
    }));
  }

  const tabs = document.getElementById("tabs");
  tabs.innerHTML = SECTIONS.map(([sec, list]) => `<span class="sgrp"><span class="sl">${sec}</span>${list.map(([id, name]) =>
    `<a href="#${id}" data-app="${id}" class="${APPS[id] ? "" : "todo"}" title="${APPS[id] ? "" : "Not drawn yet"}">${name}${APPS[id] ? `<span class="n">${(APPS[id].options || []).length}</span>` : ""}</a>`).join("")}</span>`).join("");

  const fig = (s, t) => `<figure><a class="shot" href="${s.img(t)}" data-at="${s.at}"><img src="${s.img(t)}" loading="lazy" alt="${s.name}"></a><figcaption><b>${s.name}</b><span>${s.sub || ""}</span>${s.live ? `<a href="${s.live}&theme=${t}">live</a>` : ""}</figcaption></figure>`;

  const render = (id) => {
    const d = APPS[id];
    const [, name, sec] = ORDER.find((o) => o[0] === id) || [id, id, ""];
    tabs.querySelectorAll("a").forEach((a) => a.classList.toggle("on", a.dataset.app === id));
    const out = document.getElementById("out");
    if (!d) { out.innerHTML = `<h2>${sec && !sec.startsWith("Round") ? `<span class="crumb">${sec} ›</span> ` : ""}${name}</h2><p class="none">Not drawn yet: this page comes in round 2, in the style you pick from Page styles.</p>`; return; }
    const shots = byApp[id];
    const today = shots.filter((s) => s.group === "Today");
    let h = `<h2>${sec && !sec.startsWith("Round") ? `<span class="crumb">${sec} ›</span> ` : ""}${d.name || name}</h2>${d.summary ? `<p>${d.summary}</p>` : ""}`;
    if (d.problems && d.problems.length) h += `<h3>What's wrong today</h3><ul class="problems">${d.problems.map((p) => `<li>${p}</li>`).join("")}</ul>`;
    h += `<h3>Today</h3>${today.length ? `<div class="grid">${today.map((s) => fig(s, theme0)).join("")}</div>` : `<p class="none">${d.todayNote || "No screenshot of today's page."}</p>`}`;
    for (const o of d.options || []) {
      const os = shots.filter((s) => s.group.startsWith(`Option ${o.id.toUpperCase()} `));
      const L = o.id.toUpperCase();
      const pick = (PICKS[id] || "").split(":");
      const chosen = pick[0] === o.id ? `<span class="picked">Picked${pick[1] ? ` · ${pick[1].toLowerCase()}` : ""}</span>` : "";
      h += `<h3><span class="tag">Option ${L}</span>${o.name}${chosen}</h3><p>${o.idea}</p>${o.good ? `<p class="say"><b>Good for:</b> ${o.good}</p>` : ""}<div class="grid">${os.map((s) => fig(s, theme0)).join("")}</div>`;
    }
    out.innerHTML = h;
    out.querySelectorAll("a.shot").forEach((a) => a.addEventListener("click", (e) => { e.preventDefault(); show(+a.dataset.at); }));
  };

  let at = -1, theme = theme0;
  const v = document.createElement("div");
  v.className = "viewer";
  v.innerHTML = `<div class="stage"><img alt=""></div><button class="nav prev" title="Previous (←)">‹</button><button class="nav next" title="Next (→)">›</button><button class="close" title="Close (Esc)">×</button>
    <div class="bar"><span class="n"></span><span class="app"></span><b></b><span class="sub"></span><span class="keys">← → next and previous · D dark · L light · Esc close</span></div>`;
  document.body.append(v);
  const first = (ORDER.find(([id]) => APPS[id]) || ORDER[0])[0];
  const current = () => (location.hash.slice(1) || first);
  function show(i) {
    if (!all.length) return;
    at = (i + all.length) % all.length;
    const s = all[at];
    if (s.app !== current()) history.replaceState(null, "", `#${s.app}`), render(s.app);
    const mine = byApp[s.app];
    v.querySelector("img").src = s.img(theme);
    v.querySelector(".n").textContent = `${mine.indexOf(s) + 1} / ${mine.length}`;
    v.querySelector(".app").textContent = s.appName;
    v.querySelector("b").textContent = `${s.group} — ${s.name}`;
    v.querySelector(".sub").textContent = `${s.sub || ""} · ${s.group === "Today" ? "as it is now" : theme === "dark" ? "Nyx Dark" : "Nyx Light"}`;
    v.classList.add("on");
  }
  const close = () => { v.classList.remove("on"); at = -1; };
  v.querySelector(".prev").onclick = () => show(at - 1);
  v.querySelector(".next").onclick = () => show(at + 1);
  v.querySelector(".close").onclick = close;
  v.querySelector(".stage").onclick = (e) => { if (e.target === e.currentTarget) close(); };
  document.addEventListener("keydown", (e) => {
    if (at < 0) return;
    if (e.key === "ArrowRight" || e.key === " ") show(at + 1);
    else if (e.key === "ArrowLeft") show(at - 1);
    else if (e.key === "Escape") close();
    else if (e.key === "d" || e.key === "l") { theme = e.key === "d" ? "dark" : "light"; show(at); }
    else return;
    e.preventDefault();
  });
  window.addEventListener("hashchange", () => render(current()));
  render(current());
})();
