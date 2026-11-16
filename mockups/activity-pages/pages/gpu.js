// Activity › GPU.
(() => {
  const intel = (o = {}) => acard("Intel Arc Pro 130T", `${readings([["Busy", "7%", "render 7% · video 0%"], ["Clock", "1.75 GHz", "of 2.35 GHz"], ["Memory", "1.4 GB", "shared with the system"], ["Power", "4.1 W", ""]], { cls: "sm", cols: NARROW ? 2 : 4 })}${o.graph === false ? "" : graph(shaped(7, 60, .07, .05, [[.88, .15, .03]]), "var(--sw-violet)", o.h || 100)}`, { ic: "gpu", meta: "built in · i915", end: `<span class="gp-st on">In use</span>` });
  const nvidia = (o = {}) => acard("NVIDIA GeForce RTX 5080 Laptop GPU", `${note("moon", "Asleep", "Activity doesn't wake it to read it, so it can stay asleep and save power.", "", o.wake === false ? "" : btn("Read it now", "sm"))}${sect("Keeping it awake")}${[["Hyprland", "teal", "Has it open"], ["llama-server", "graphite", "Has it open"], ["Firefox", "coral", "Has it open"]].map(([n, c, v]) => appRow([n, c], v)).join("")}`, { ic: "gpu", meta: "dedicated · nvidia 580", end: `<span class="gp-st">Asleep</span>` });

  /* A: a card per GPU: the busy one in full, the sleeping one says so and who keeps it awake. */
  const pageA = () => `<div class="ap-body scroll">${intel()}<div class="ap-grid" style="--cols:${NARROW ? 1 : 2}">${nvidia()}${acard("Using the Intel GPU most", [["Hyprland", "teal", "6%", 30], ["Quickshell", "green", "0.9%", 5], ["Firefox", "coral", "0.4%", 2]].map(([n, c, v, p]) => appRow([n, c], v, p)).join(""), { end: seg(["Busy", "Memory"], "Busy") })}</div></div>`;

  /* B: engines: each engine of the GPU as a lane (render, video, compute, copy). */
  const ENG = [["Render", .07, "violet", "7%"], ["Video", .02, "pink", "0%"], ["Video enhance", .01, "blue", "0%"], ["Compute", .03, "teal", "1%"], ["Copy", .02, "amber", "0%"]];
  const pageB = () => `<div class="ap-body scroll">
    ${phead("Intel Arc Pro 130T", "Built in · i915 · 1.75 of 2.35 GHz · 4.1 W", seg(["Intel Arc", "NVIDIA RTX 5080"], "Intel Arc"))}
    <div class="card gp-lanes">${ENG.map(([n, b, c, v], i) => `<div class="gp-lane"><div class="lb"><b>${n}</b><span>${v}</span></div>${gline(shaped(i + 3, 60, b, b, i === 0 ? [[.88, .2, .03]] : []), `var(--sw-${c})`, 38)}</div>`).join("")}</div>
    <div class="ap-grid" style="--cols:${NARROW ? 1 : 2}">${acard("Video memory by app", [["Hyprland", "teal", "640 MB", 46], ["Quickshell", "green", "210 MB", 15], ["Firefox", "coral", "180 MB", 13], ["Code - OSS", "blue", "96 MB", 7]].map(([n, c, v, p]) => appRow([n, c], v, p)).join(""))}${acard("Facts", kv([["Driver", "i915 · Mesa 25.3"], ["Memory", "Shared with the system, 1.4 GB in use"], ["Temperature", "Not reported"], ["PCI", "0000:00:02.0"]]))}</div>
  </div>`;

  REG("gpu", {
    name: "GPU",
    summary: "GPU lists both graphics chips with a ring, a history and a top-consumers list each. The built-in one is mostly dashes; the NVIDIA one, asleep, gets a paragraph and a list of apps whose value is the word “open”.",
    problems: [
      "<b>Dashes where readings would be</b>: the Intel GPU's temperature and power are “–” because the driver doesn't report them, but the rows stay.",
      "<b>The NVIDIA GPU's sleep is explained in a paragraph</b> (“Awake but unused. Activity doesn't poll it now…”), with nothing to do about it.",
      "<b>“Apps using it, by video memory” shows “open”</b> for every app, because asleep it can't say how much.",
      "<b>Engines and hardware details are folded</b>, though render, video and compute are what tell you what the GPU is doing.",
    ],
    today: [["gpu-1280", "Today at 1280 px", "Two GPUs, dashes and a paragraph"], ["gpu-800", "Today at 800 px", ""]],
    options: [
      { id: "a", name: "A card per GPU", idea: "The GPU in use gets its readings and graph; one that's asleep says so in a word, with who keeps it awake and a button to read it anyway. Rows the driver can't fill are left out, not shown as dashes.",
        shots: [["a-gpu", "GPU", "Intel in full, NVIDIA asleep with who keeps it awake"], ["a-gpu-800", "At 800 px", ""]] },
      { id: "b", name: "What its engines are doing", idea: "One GPU at a time (picked at the top), its engines as lanes (render, video, video enhance, compute, copy), so you can see a video decoding or a render running; video memory by app and the facts below.",
        shots: [["b-gpu", "GPU", "Engines as lanes, video memory by app"]] },
    ],
    pages: { "a-gpu": () => apage("gpu", pageA()), "b-gpu": () => apage("gpu", pageB()) },
    icons: { moon: '<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/>' },
  });
})();
