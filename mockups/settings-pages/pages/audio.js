// Hardware › Sound: output, volume and its maximum, the 9-band equalizer and preamp with
// presets, input, apps playing sound, remembered devices and troubleshooting.
(() => {
  const page = (body) => () => swin({ sec: "hardware", page: "Sound", desc: "Output, volume, the equalizer and the microphone.", body: body() });
  const OUTS = [["speaker", "Studio Speakers", "USB audio", true], ["headphones", "Pulse Buds", "Bluetooth · 80% battery", false], ["laptop", "Laptop speakers", "Built in", false], ["monitor", "Studio 27", "HDMI", false]];
  const PRESETS = ["Flat", "Loudness", "Voice", "More bass", "More treble", "Night"];
  const lic = (ic) => `<span class="lic" style="--tc:var(--sec-hardware)">${icon(ic)}</span>`;
  const volrow = (pct, o = {}) => `<div class="opt volrow">${ib(o.muted ? "mute" : "volume", "Mute")}<span class="slw grow">${slider(pct, 0)}<span class="readout">${pct}%</span></span></div>`;
  const eqBig = () => `<div class="eqbig card">
       <div class="eqy"><span>+12</span><span>+6</span><span>0</span><span>−6</span><span>−12</span></div>
       <div class="eqp">${eqCurve(EQ_LOUD, NARROW ? { w: 560, h: 190 } : { w: 410, h: 300 })}<div class="eqx">${EQ_BANDS.map((b) => `<span>${b}</span>`).join("")}</div></div>
       <div class="pre"><small>Preamp</small><div class="vsl"><b style="bottom:62%"></b></div><span>+2 dB</span></div>
     </div>`;

  /* ── A: the equalizer beside the controls ──────────────────────── */
  const eqA = () => split(`
    ${ocard("Plays through", OUTS.slice(0, 3).map(([ic, n, d, on]) => `<div class="opt ${on ? "picked" : ""}">${radio(on)}${lic(ic)}<div class="opt-text"><div>${n}</div><div class="d">${d}</div></div>${on ? `<span class="au-lv">${meter(62, 10)}</span>` : ""}</div>`), { first: true, act: `<span class="lnk">All 4 ${icon("chev-r")}</span>` })}
    ${ocard("Volume", [volrow(64), orow("Maximum volume", "Above 100% can distort.", dd("100%"))])}
    ${ocard("Microphone", [orow("Built-in microphone", meter(58, 16), dd("Change")), orow("Input level", "", sl(72, "72%", 120))])}
    ${ocard("", [nrow("Apps playing sound", "", "Music, Browser", { ic: "apps" }), nrow("Remembered devices", "", "3", { ic: "hist" }), nrow("Troubleshooting", "", "", { ic: "wrench" })], { cls: "icons au-more" })}`,
    `${pvhead("Equalizer", "Every app passes through it on its way to Studio Speakers.", `${dd("Loudness")}${sw(true)}`)}
     ${eqBig()}
     <div class="pvchips">${PRESETS.map((p) => chip(p, p === "Loudness" ? "on" : "")).join("")}${chip("Save as a preset…", "", "plus")}<span class="au-reset">${btn("Reset", "sm ghost", "refresh")}</span></div>
     <div class="pvfoot">${icon("check-c")}<span>Up to +4 dB louder. The limiter keeps loud peaks from distorting.</span><span class="sp"></span><span class="lvls">L ${meter(64, 18)}<br>R ${meter(60, 18)}</span></div>`);

  /* ── B: where sound goes ───────────────────────────────────────── */
  const APPS = [["music", "Music", "Harbor Lights · Slow Tide", 80, "blue"], ["globe", "Browser", "A video · 2:14", 55, "coral"], ["users", "Video call", "Team stand-up", 100, "green"]];
  const routeB = () => split(`
    ${ocard("Output", [
      orow("Plays through", "", dd("Studio Speakers", "speaker")),
      volrow(64),
      orow("Maximum volume", "Above 100% can distort.", dd("100%")),
      orow("Use whenever it's connected", "Switch to Studio Speakers when they're plugged in.", sw(true)),
    ], { first: true })}
    ${ocard("Input", [orow("Microphone", meter(58, 14), dd("Built-in", "mic")), orow("Input level", "", sl(72, "72%", 120))])}
    ${ocard("", [
      orow("Equalizer", "Loudness · up to +4 dB", `<span class="au-mini">${eqCurve(EQ_LOUD, { w: 84, h: 26, handles: false })}</span>${icon("chev-r", "cv")}`, { ic: "eq", cls: "onav" }),
      nrow("Remembered devices", "", "3", { ic: "hist" }),
      nrow("Troubleshooting", "Restart sound if a device goes missing", "", { ic: "wrench" }),
    ], { cls: "icons" })}`,
    `${pvhead("Where sound goes", "Apps show up here while they play. Drag one onto another device to move it.", btn("Equalizer", "sm", "eq"))}
     <div class="au-route card">
       <svg class="au-wires" viewBox="0 0 100 100" preserveAspectRatio="none">
         <path d="M35,15 C42,15 41,27 47,27" class="w on"/>
         <path d="M35,47 C42,47 41,27 47,27" class="w on"/>
         <path d="M63,27 C66,27 64,12 67,12" class="w on"/>
         <path d="M35,79 C52,79 50,26 67,26" class="w alt"/>
         <path d="M67,88 C52,88 50,82 35,82" class="w mic"/>
       </svg>
       ${APPS.map(([ic, n, d, v, c], i) => `<div class="au-app" style="top:${[5, 37, 69][i]}%"><span class="au-ai" style="background:var(--sw-${c})">${icon(ic)}</span><div><b>${n}</b><span>${d}</span>${slider(v, 0)}</div></div>`).join("")}
       <div class="au-eqn"><span>${icon("eq")}</span><b>Equalizer</b><small>Loudness</small></div>
       ${OUTS.map(([ic, n, d, on], i) => `<div class="au-out ${on ? "on" : ""} ${i === 1 ? "alt" : ""}" style="top:${5 + i * 14}%">${icon(ic)}<div><b>${n}</b><span>${on ? "64% · default" : i === 1 ? "Video call" : d}</span></div></div>`).join("")}
       <div class="au-out in" style="top:81%">${icon("mic")}<div><b>Microphone</b><span>Built in · Video call</span></div></div>
     </div>
     <div class="au-leg"><span><i class="on"></i>Through the equalizer</span><span><i class="alt"></i>Straight to a device</span><span><i class="mic"></i>Microphone</span></div>`, { ctlw: 410 });

  /* ── C: one device at a time ───────────────────────────────────── */
  const dev = (ic, n, d, o = {}) => `<div class="opt ${o.on ? "picked" : ""} ${o.off ? "au-off" : ""}">${lic(ic)}<div class="opt-text"><div>${n}</div><div class="d">${d}</div></div>${o.def ? `<span class="pill" style="--tc:var(--sec-hardware)">Default</span>` : ""}</div>`;
  const deviceC = () => split(`
    ${ocard("Outputs", [
      dev("speaker", "Studio Speakers", "USB audio", { on: true, def: true }),
      dev("headphones", "Pulse Buds", "Bluetooth · 80%"),
      dev("laptop", "Laptop speakers", "Built in"),
      dev("monitor", "Studio 27", "HDMI"),
    ], { first: true })}
    ${ocard("Inputs", [dev("mic", "Built-in microphone", "72%", { def: true }), dev("headphones", "Pulse Buds microphone", "Bluetooth")])}
    ${ocard("Not connected", [dev("speaker", "Kitchen speaker", "Last used Sunday", { off: true })])}
    ${ocard("", [nrow("Troubleshooting", "", "", { ic: "wrench" })], { cls: "icons au-gap" })}`,
    `<div class="au-dh"><span class="au-big">${icon("speaker")}</span><div><b>Studio Speakers</b><span>USB audio · 48 kHz · stereo</span></div><span class="sp"></span><span class="pill dot" style="--tc:var(--success)">Playing</span></div>
     <div class="card au-vol">
       <div class="au-vr">${ib("volume", "Mute")}${slider(64, 0)}<b>64%</b></div>
       <div class="au-lr"><span>L</span>${meter(64, 40)}<span>R</span>${meter(60, 40)}</div>
     </div>
     <div class="card">
       ${orow("Maximum volume", "The volume keys and the slider stop here. Above 100% can distort.", dd("100%"))}
       ${orow("Use whenever it's connected", "Switch to these each time they're plugged in or turned on.", sw(true))}
     </div>
     <div class="card au-eqs">
       <div class="au-eqh"><b>Equalizer</b><span class="sp"></span>${dd("Loudness")}${sw(true)}</div>
       <div class="au-eqc">${eqCurve(EQ_LOUD, { w: 560, h: 56, handles: false })}<div class="eqx">${EQ_BANDS.map((b) => `<span>${b}</span>`).join("")}</div></div>
       <div class="au-eqf"><span>Preamp +2 dB · up to +4 dB louder</span><span class="sp"></span><span class="lnk">Edit the bands ${icon("chev-r")}</span></div>
     </div>
     <div class="card">
       <div class="gtitle au-ph">Playing here</div>
       ${APPS.slice(0, 2).map(([ic, n, d, v, c]) => `<div class="opt"><span class="au-ai sm" style="background:var(--sw-${c})">${icon(ic)}</span><div class="opt-text"><div>${n}</div><div class="d">${d}</div></div>${slider(v, 110)}${dd("Studio Speakers")}</div>`).join("")}
     </div>`, { ctlw: 330 });

  REG("audio", {
    name: "Sound",
    summary: "Sound covers everything Hyprland's audio needs (output and input, a maximum volume past 100%, a nine-band equalizer with a preamp and presets, apps playing sound, remembered devices and a restart), but it's one long column where the equalizer is nine columns of numbers and a banner about the equalizer comes before the volume.",
    problems: [
      "<b>A banner before the volume:</b> “Sound isn't going through the equalizer” sits at the top, so the first thing on the page is a warning, not what's playing or how loud.",
      "<b>The output is a device's raw name in a list:</b> “Built-in Audio Analog Stereo” in a dropdown; the other devices aren't shown until you open it.",
      "<b>The equalizer is numbers:</b> nine columns of +3.0, −1.0 and so on over short sliders, with no curve to see what the sound will be like.",
      "<b>Explanations push the controls down:</b> a paragraph on what the preamp does sits above the equalizer and wraps to two lines at 800 px.",
      "<b>Apps, remembered devices and troubleshooting</b> are full groups below the equalizer, a long scroll from the volume; there's no picture of which app plays where.",
    ],
    today: [["audio-1280", "Today", "A banner, then Output, then the equalizer's columns"], ["audio-800", "Today at 800 px", ""]],
    options: [
      { id: "a", name: "Equalizer beside the controls", idea: "Round 1's pick, tidied. The left column is what you change every day: which device plays, the volume and its maximum, the microphone. The equalizer fills the right as a curve you drag, with the preamp beside it, presets under it and the left and right levels at the foot. Apps, remembered devices and troubleshooting are one row each that open their own page.",
        shots: [["a-eq", "Studio Speakers with the Loudness equalizer", ""], ["a-eq-800", "At 800 px", "The curve above, the controls below"]] },
      { id: "b", name: "Where sound goes", idea: "The picture is a map of sound: apps on the left with their own volume, wires through the equalizer to the device that plays them, and the microphone wired to the app that's listening. Drag an app onto another device to move it, as the Apps group does today. The equalizer becomes a row that opens its own page with the full curve.",
        shots: [["b-route", "Music and the browser through the equalizer, a call on the earbuds", ""]] },
      { id: "c", name: "One device at a time", idea: "Every device is in a list on the left (outputs, inputs, and remembered ones that aren't connected now), and the right shows the chosen one: its volume and live levels, its maximum, whether to switch to it when it connects, the equalizer as a small curve, and the apps playing through it, each with its own volume and a device to move it to.",
        shots: [["c-device", "Studio Speakers chosen", ""]] },
    ],
    pages: { "a-eq": page(eqA), "b-route": page(routeB), "c-device": page(deviceC) },
  });
})();
