// The gallery: an Overview of the three layouts, then a tab per surface (grouped by section) with
// today's shot where there is one, what's wrong with it, and the surface: in each layout for the
// window and the address bar, once (drawn in Focus) for everything that's the same in all three. The
// full-window viewer is mockups/settings-pages' (as in mockups/git): click a shot to open it; ← and →
// step through every shot and carry on into the next or previous tab; D and L switch dark and light;
// Esc closes.
(() => {
  const theme0 = new URLSearchParams(location.search).get("theme") || "dark";
  document.documentElement.dataset.theme = theme0;
  document.getElementById("theme").innerHTML = ["dark", "light"]
    .map((v) => `<a class="${v === theme0 ? "on" : ""}" href="?theme=${v}${location.hash}">${v[0].toUpperCase() + v.slice(1)}</a>`).join("");

  // Every shot, in order: { tab, tabName, group, name, sub, img(theme), live, at }.
  const all = [];
  const byTab = {};
  for (const s of SCREENS) {
    byTab[s.id] = [];
    const add = (x) => { x.tab = s.id; x.tabName = `${s.sec} › ${s.name}`; x.at = all.length; all.push(x); byTab[s.id].push(x); };
    (TODAY[s.id] || []).forEach(([file, title, note]) => add({ group: "Today", name: title, sub: note, img: () => `today/${file}.png`, live: "" }));
    for (const l of s.per ? LAYOUTS : [{ id: "b", name: "Every layout" }]) {
      add({ group: l.name, dir: l.id, per: s.per, name: s.name, sub: s.what, img: (t) => `shots/${l.id}-${s.id}-${t}.png`,
        live: `screens.html?dir=${l.id}&screen=${s.id}${s.w === 800 ? "&w=800" : ""}` });
    }
  }

  const tabs = document.getElementById("tabs");
  tabs.innerHTML = `<span class="sgrp"><a href="#overview" data-tab="overview">Overview</a></span>` +
    SECTIONS.map(([sec, list]) => `<span class="sgrp"><span class="sl">${sec}</span>${list.map(([id, name]) => `<a href="#${id}" data-tab="${id}">${name}</a>`).join("")}</span>`).join("");

  const fig = (s, t, title) => `<figure><a class="shot" href="${s.img(t)}" data-at="${s.at}"><img src="${s.img(t)}" loading="lazy" alt="${s.name}"></a><figcaption><b>${title || s.name}</b><span>${s.sub || ""}</span>${s.live ? `<a href="${s.live}&theme=${t}">live</a>` : ""}</figcaption></figure>`;

  const overview = () => {
    let h = `<h2>Three layouts, one design</h2><p>Browser has three layouts, chosen at first run and in Settings › Layout & tabs. They differ only in the window's frame: where the tabs, the address and the bookmarks sit. Everything that opens from the frame (menus, the Site card, panels, prompts) is the same in all three, in Focus's frosted style, and Browser's own pages (Settings, Library, Extensions, the new tab page) are Studio's. The tabs above go surface by surface, with today's Browser first where there's a shot of it.</p>`;
    for (const l of LAYOUTS) {
      const mine = all.filter((s) => s.dir === l.id && s.per);
      const pick = ["main", "bookmarks", "workspaces", "address"].map((id) => mine.find((s) => s.tab === id));
      h += `<h3><span class="tag">Layout</span>${l.name}</h3><p>${l.idea}</p><div class="grid four">${pick.map((s) => fig(s, theme0, s.tabName.split(" › ")[1])).join("")}</div>`;
    }
    const shared = ["site", "menu", "tab-menu", "settings"].map((id) => all.find((s) => s.tab === id && s.group === "Every layout"));
    h += `<h3><span class="tag">Shared</span>In every layout</h3><p>Drawn in Focus here; Studio and Workbench open the same card from their own buttons.</p><div class="grid four">${shared.map((s) => fig(s, theme0, s.tabName.split(" › ")[1])).join("")}</div>`;
    return h;
  };

  const render = (id) => {
    tabs.querySelectorAll("a").forEach((a) => a.classList.toggle("on", a.dataset.tab === id));
    const out = document.getElementById("out");
    if (id === "overview") out.innerHTML = overview();
    else {
      const s = SCREENS.find((x) => x.id === id);
      const shots = byTab[id];
      const today = shots.filter((x) => x.group === "Today");
      let h = `<h2><span class="crumb">${s.sec} ›</span> ${s.name}</h2><p>${s.what}.</p>`;
      if (PROBLEMS[id]) h += `<h3>What's wrong today</h3><ul class="problems">${PROBLEMS[id].map((p) => `<li>${p}</li>`).join("")}</ul>`;
      if (today.length) h += `<h3>Today</h3><div class="grid">${today.map((x) => fig(x, theme0)).join("")}</div>`;
      h += s.per
        ? `<h3>In each layout</h3><div class="grid three">${LAYOUTS.map((l) => fig(shots.find((x) => x.dir === l.id), theme0, l.name)).join("")}</div>`
        : `<h3>In every layout</h3><p class="note">The same in Studio, Focus and Workbench; drawn here in Focus.</p><div class="grid one">${fig(shots.find((x) => x.group === "Every layout"), theme0, "Every layout")}</div>`;
      out.innerHTML = h;
    }
    out.querySelectorAll("a.shot").forEach((a) => a.addEventListener("click", (e) => { e.preventDefault(); show(+a.dataset.at); }));
  };

  let at = -1, theme = theme0;
  const v = document.createElement("div");
  v.className = "viewer";
  v.innerHTML = `<div class="stage"><img alt=""></div><button class="nav prev" title="Previous (←)">‹</button><button class="nav next" title="Next (→)">›</button><button class="close" title="Close (Esc)">×</button>
    <div class="bar"><span class="n"></span><span class="app"></span><b></b><span class="sub"></span><span class="keys">← → next and previous · D dark · L light · Esc close</span></div>`;
  document.body.append(v);
  const current = () => (location.hash.slice(1) || "overview");
  function show(i) {
    if (!all.length) return;
    at = (i + all.length) % all.length;
    const s = all[at];
    if (current() !== "overview" && s.tab !== current()) history.replaceState(null, "", `#${s.tab}`), render(s.tab);
    const mine = byTab[s.tab];
    v.querySelector("img").src = s.img(theme);
    v.querySelector(".n").textContent = `${mine.indexOf(s) + 1} / ${mine.length}`;
    v.querySelector(".app").textContent = s.tabName;
    v.querySelector("b").textContent = s.group;
    v.querySelector(".sub").textContent = `${s.sub || ""} · ${s.group === "Today" ? "as it is now, Nyx Dark" : theme === "dark" ? "Nyx Dark" : "Nyx Light"}`;
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
