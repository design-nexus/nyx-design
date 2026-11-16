// A tab per page: what today has, where each thing goes in its options (Kept), then the shots, by
// option (each option's states in a row) or by state (the options side by side). The full-window
// viewer is mockups/git's: click a shot; ← and → step through every shot in the order shown and
// carry on into the next page; D and L switch dark and light; Esc closes.
(() => {
  const theme0 = new URLSearchParams(location.search).get("theme") || "dark";
  document.documentElement.dataset.theme = theme0;
  document.getElementById("theme").innerHTML = ["dark", "light"]
    .map((v) => `<a class="${v === theme0 ? "on" : ""}" href="?theme=${v}${location.hash}">${v[0].toUpperCase() + v.slice(1)}</a>`).join("");

  // These pages have no shot of today; each tab says in words what today has.
  const todayOf = () => [];
  const shot = (p, o, [s, name, note]) => ({ group: o.name, name, sub: note, opt: o.id, state: s, img: (t) => `shots/${p.id}-${o.id}-${s}-${t}.png`, live: `screens.html?panel=${p.id}&opt=${o.id}&state=${s}` });

  // Every shot in both orders: by option (A's states, then B's, then C's) and by state (A, B, C for each).
  const orders = { opt: [], state: [] };
  const byTab = { opt: {}, state: {} };
  for (const mode of ["opt", "state"]) {
    for (const p of PANELS) {
      const mine = (byTab[mode][p.id] = []);
      const add = (x) => { x.tab = p.id; x.tabName = p.name; x.at = orders[mode].length; orders[mode].push(x); mine.push(x); };
      todayOf(p).forEach(add);
      if (mode === "opt") for (const o of p.options) for (const st of p.states) add(shot(p, o, st));
      else for (const st of p.states) for (const o of p.options) add(shot(p, o, st));
    }
  }

  const route = () => { const [tab = PANELS[0].id, mode = "opt"] = location.hash.slice(1).split(":"); return { tab, mode: mode === "state" ? "state" : "opt" }; };
  const tabs = document.getElementById("tabs");
  tabs.innerHTML = PANELS.map((p) => `<a href="#${p.id}" data-tab="${p.id}">${p.name}<span class="n">${p.options.length * p.states.length}</span></a>`).join("");

  const fig = (s, t, title) => `<figure><a class="shot" href="${s.img(t)}" data-at="${s.at}"><img src="${s.img(t)}" loading="lazy" alt="${s.name}"></a><figcaption><b>${title || s.name}</b><span>${s.sub || ""}</span>${s.live ? `<a href="${s.live}&theme=${t}">live</a>` : ""}</figcaption></figure>`;

  function render() {
    const { tab, mode } = route();
    const p = PANELS.find((x) => x.id === tab) || PANELS[0];
    tabs.querySelectorAll("a").forEach((a) => a.classList.toggle("on", a.dataset.tab === p.id));
    const shots = byTab[mode][p.id];
    let h = `<h2>${p.name}</h2><p>Today: ${p.today}</p>`;
    h += `<div class="opts">${p.options.map((o) => `<div><b>${o.name}</b><span>${o.idea}</span></div>`).join("")}</div>`;
    if (p.kept) h += `<details class="keptw" open><summary>Kept: everything it does today, and where<span>${p.kept.length} functions</span></summary><table class="kept"><tr><th>What it does</th>${p.options.map((o) => `<th>${o.name}</th>`).join("")}</tr>
      ${p.kept.map(([what, ...where]) => `<tr><td>${what}</td>${where.map((w) => `<td>${w.replace(/\((added[^)]*)\)/, "<em>($1)</em>")}</td>`).join("")}</tr>`).join("")}</table></details>`;
    h += `<div class="mode"><a class="${mode === "opt" ? "on" : ""}" href="#${p.id}">By option</a><a class="${mode === "state" ? "on" : ""}" href="#${p.id}:state">By state</a></div>`;
    if (mode === "opt") for (const o of p.options) h += `<h3><span class="tag">Option</span>${o.name}</h3><p>${o.idea}</p><div class="grid three">${shots.filter((x) => x.opt === o.id).map((x) => fig(x, theme0)).join("")}</div>`;
    else for (const [s, name, note] of p.states) h += `<h3><span class="tag">State</span>${name}</h3><p>${note}.</p><div class="grid three">${shots.filter((x) => x.state === s).map((x) => fig(x, theme0, p.options.find((o) => o.id === x.opt).name)).join("")}</div>`;
    const out = document.getElementById("out");
    out.innerHTML = h;
    out.querySelectorAll("a.shot").forEach((a) => a.addEventListener("click", (e) => { e.preventDefault(); show(+a.dataset.at); }));
  }

  let at = -1, theme = theme0;
  const v = document.createElement("div");
  v.className = "viewer";
  v.innerHTML = `<div class="stage"><img alt=""></div><button class="nav prev" title="Previous (←)">‹</button><button class="nav next" title="Next (→)">›</button><button class="close" title="Close (Esc)">×</button>
    <div class="bar"><span class="n"></span><span class="app"></span><b></b><span class="sub"></span><span class="keys">← → next and previous · D dark · L light · Esc close</span></div>`;
  document.body.append(v);
  function show(i) {
    const { mode } = route();
    const all = orders[mode];
    at = (i + all.length) % all.length;
    const s = all[at];
    if (s.tab !== route().tab) { history.replaceState(null, "", `#${s.tab}${mode === "state" ? ":state" : ""}`); render(); }
    const mine = byTab[mode][s.tab];
    v.querySelector("img").src = s.img(s.fixed ? "dark" : theme);
    v.querySelector(".n").textContent = `${mine.indexOf(s) + 1} / ${mine.length}`;
    v.querySelector(".app").textContent = s.tabName;
    v.querySelector("b").textContent = s.group === "Today" ? s.name : `${s.group} · ${s.name}`;
    v.querySelector(".sub").textContent = `${s.sub || ""} · ${s.fixed ? "as it is now, Nyx Dark" : theme === "dark" ? "Nyx Dark" : "Nyx Light"}`;
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
  window.addEventListener("hashchange", render);
  render();
})();
