// The revamp page: a tab per app (from ORDER and each app's REG), and the full-window
// viewer. Click a shot to open it; ← and → step through every shot of the tab and carry
// on into the next or previous tab; D and L switch dark and light; Esc closes.
(() => {
  const theme0 = new URLSearchParams(location.search).get("theme") || "dark";
  document.documentElement.dataset.theme = theme0;
  document.getElementById("theme").innerHTML = ["dark", "light"]
    .map((v) => `<a class="${v === theme0 ? "on" : ""}" href="?theme=${v}${location.hash}">${v[0].toUpperCase() + v.slice(1)}</a>`).join("");

  // Every shot of every app, in order: { app, i (index in app), name, sub, img(theme), live }.
  const all = [];
  const byApp = {};
  for (const [id, name] of ORDER) {
    const d = APPS[id];
    byApp[id] = [];
    if (!d) continue;
    const add = (s) => { s.app = id; s.appName = name; s.at = all.length; all.push(s); byApp[id].push(s); };
    (d.today || []).forEach(([file, title, note]) => add({ group: "Today", name: title, sub: note, img: () => `today/${file}.png`, live: "" }));
    (d.options || []).forEach((o) => o.shots.forEach(([s, title, note]) => {
      const narrow = s.endsWith("-800");
      add({ group: `Option ${o.id.toUpperCase()} · ${o.name}`, name: title, sub: note, img: (t) => `shots/${id}-${s}-${t}.png`,
        live: `screens.html?app=${id}&screen=${s.replace(/-800$/, "")}${narrow ? "&w=800" : ""}` });
    }));
  }

  const tabs = document.getElementById("tabs");
  tabs.innerHTML = ORDER.map(([id, name]) => `<a href="#${id}" data-app="${id}" class="${APPS[id] ? "" : "todo"}">${name}${APPS[id] ? `<span class="n">${(APPS[id].options || []).length}</span>` : ""}</a>`).join("");

  const fig = (s, t) => `<figure><a class="shot" href="${s.img(t)}" data-at="${s.at}"><img src="${s.img(t)}" loading="lazy" alt="${s.name}"></a><figcaption><b>${s.name}</b><span>${s.sub || ""}</span>${s.live ? `<a href="${s.live}&theme=${t}">live</a>` : ""}</figcaption></figure>`;

  const render = (id) => {
    const d = APPS[id];
    const name = (ORDER.find((o) => o[0] === id) || [id, id])[1];
    tabs.querySelectorAll("a").forEach((a) => a.classList.toggle("on", a.dataset.app === id));
    document.documentElement.style.setProperty("--accent", d && d.accent ? `var(--sw-${d.accent})` : "var(--theme-accent)");
    const out = document.getElementById("out");
    if (!d) { out.innerHTML = `<h2>${name}</h2><p class="none">Not done yet.</p>`; return; }
    const shots = byApp[id];
    const today = shots.filter((s) => s.group === "Today");
    let h = `<h2>${name}</h2>${d.summary ? `<p>${d.summary}</p>` : ""}`;
    h += `<h3>What's wrong today</h3><ul class="problems">${(d.problems || []).map((p) => `<li>${p}</li>`).join("")}</ul>`;
    h += `<h3>Today</h3>${today.length ? `<div class="grid">${today.map((s) => fig(s, theme0)).join("")}</div>` : `<p class="none">${d.todayNote || "No screenshot of today's app."}</p>`}`;
    for (const o of d.options || []) {
      const os = shots.filter((s) => s.group.startsWith(`Option ${o.id.toUpperCase()} `));
      const L = o.id.toUpperCase();
      const say = o.variants ? `<p class="say">Choices inside it: ${o.variants.map((v) => `<b>${L} ${v.toLowerCase()}</b>`).join(" or ")}</p>` : "";
      const pick = (PICKS[id] || "").split(":");
      const chosen = pick[0].split("+").includes(o.id) ? `<span class="picked">Picked${pick[1] ? ` · ${pick[1].toLowerCase()}` : ""}</span>` : "";
      h += `<h3><span class="tag">Option ${L}</span>${o.name}${chosen}</h3><p>${o.idea}</p>${say}<div class="grid">${os.map((s) => fig(s, theme0)).join("")}</div>`;
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
  const current = () => (location.hash.slice(1) || ORDER[0][0]);
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
