// The gallery: sections of shots from GALLERY, and the full-window viewer (click a shot;
// ← → step through every shot, D and L switch dark and light, Esc closes).
// The same file is in mockups/reminders, contacts and notes.
(() => {
  const t = new URLSearchParams(location.search).get("theme") || "dark";
  document.documentElement.dataset.theme = t;
  document.getElementById("theme").innerHTML = ["dark", "light"]
    .map((v) => `<a class="${v === t ? "on" : ""}" href="?theme=${v}">${v[0].toUpperCase() + v.slice(1)}</a>`).join("");
  // A shot is [screen, title, note], with "-800" on the screen for the tiled width.
  document.getElementById("out").innerHTML = GALLERY.map(([title, shots]) =>
    `<h2>${title}</h2><div class="grid">${shots.map(([s, name, sub]) => {
      const img = `shots/screens-${s}-${t}.png`;
      const narrow = s.endsWith("-800");
      const live = `screens.html?screen=${s.replace(/-800$/, "")}&theme=${t}${narrow ? "&w=800" : ""}`;
      return `<figure><a href="${img}" data-shot="screens-${s}" data-name="${name}" data-sub="${sub}"><img src="${img}" loading="lazy" alt="${name}"></a><figcaption><b>${name}</b><span>${sub}</span><a href="${live}">live</a></figcaption></figure>`;
    }).join("")}</div>`).join("");

  const shots = [...document.querySelectorAll("a[data-shot]")];
  let at = -1, theme = t;
  const v = document.createElement("div");
  v.className = "viewer";
  v.innerHTML = `<div class="stage"><img alt=""></div><button class="nav prev" title="Previous (←)">‹</button><button class="nav next" title="Next (→)">›</button><button class="close" title="Close (Esc)">×</button>
    <div class="bar"><span class="n"></span><b></b><span class="sub"></span><span class="keys">← → next and previous · D dark · L light · Esc close</span></div>`;
  document.body.append(v);
  const show = (i) => {
    at = (i + shots.length) % shots.length;
    const a = shots[at];
    v.querySelector("img").src = `shots/${a.dataset.shot}-${theme}.png`;
    v.querySelector(".n").textContent = `${at + 1} / ${shots.length}`;
    v.querySelector("b").textContent = a.dataset.name;
    v.querySelector(".sub").textContent = `${a.dataset.sub} · ${theme === "dark" ? "Nyx Dark" : "Nyx Light"}`;
    v.classList.add("on");
  };
  const close = () => { v.classList.remove("on"); at = -1; };
  shots.forEach((a, i) => a.addEventListener("click", (e) => { e.preventDefault(); show(i); }));
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
})();
