// Assistant & AI › Voice: how Echo hears you, how it sounds, and talking over it.
(() => {
  const DESC = "How Echo hears you, how it sounds, and talking over it.";
  const o = (ic) => ({ ic, sec: "assistant" });
  const page = (body) => () => swin({ sec: "assistant", page: "Voice", desc: DESC, body: body() });
  const VOICES = [
    ["Heart", "US", "Warm, friendly", "pink"], ["Bella", "US", "Bright, upbeat", "coral"], ["Sarah", "US", "Calm, clear", "teal", true], ["Nicole", "US", "Soft, close", "violet"],
    ["Sky", "US", "Light, young", "blue"], ["Adam", "US", "Deep, steady", "amber"], ["Michael", "US", "Relaxed", "green"],
    ["Emma", "UK", "Crisp, precise", "violet"], ["Isabella", "UK", "Gentle", "pink"], ["George", "UK", "Rich, low", "blue"], ["Lewis", "UK", "Easy-going", "teal"],
  ];

  /* ── Drawings ────────────────────────────────────────────────────── */
  const orb = () => `<span class="av-orb"></span>`;
  const bars = (n, seed, o2 = {}) => `<span class="av-wv ${o2.cls || ""}">${Array.from({ length: n }, (_, i) => {
    const h = 15 + (hash(seed + i) % 85), lo = o2.duck && i >= o2.duck[0] && i < o2.duck[1], gone = (o2.gap && i >= o2.gap[0] && i < o2.gap[1]) || (o2.end && i >= o2.end);
    return `<b class="${o2.played !== undefined && i < o2.played ? "pl" : ""} ${lo ? "lo" : ""}" style="height:${gone ? 4 : lo ? h * 0.3 : h}%"></b>`;
  }).join("")}</span>`;

  /* ── A: hear it ──────────────────────────────────────────────────── */
  const aCtl = () => `
    ${ocard("Its voice", [
      orow("Voice", "Calm and clear · American", dd("Sarah"), o("volume")),
      orow("Speed", "", sl(40, "1.1×", 150), o("play")),
    ], { first: true, cls: "icons" })}
    ${ocard("Hearing", [
      orow("Speech to text", "On this computer · ready", `<span class="pill dot" style="--tc:var(--success)">Ready</span>`, o("note")),
      orow("Microphone", meter(46, 14), dd("Like the system"), o("mic")),
      orow("Speaker", "", dd("Like the system"), o("speaker")),
    ], { cls: "icons" })}
    ${ocard("Talking over it", [
      orow("Stop or lower its voice", "When you start talking during an answer.", sw(true), o("chat")),
      orow("When you talk over it", "", seg(["Pause", "Lower"], "Lower"), o("volume")),
      orow("Lowered to", "", sl(25, "25%", 130), o("sliders")),
    ], { cls: "icons" })}
    ${ocard("", [nrow("Fine-tuning", "", "Quietest speech, its first words", o("wrench"))], { cls: "icons" })}`;
  const aPv = () => `
    ${pvhead("Hear it", "A short exchange in the voice and speed on the left.", chip("Sarah · 1.1×", "acc", "volume"))}
    <div class="av-chat card">
      <div class="msg me"><div class="bub">Hey Echo, when's my next meeting?</div>${bars(26, "me", { cls: "me" })}</div>
      <div class="msg it">${orb()}<div class="bub"><p>Your next meeting is the design review with Sam Rivera at 3 pm, in the Lake room.</p>
        <div class="pl">${ib("pause", "Pause")}${bars(52, "it", { played: 30 })}<span class="tm">0:04 / 0:07</span></div></div></div>
    </div>
    <div class="card av-over">
      <div class="oh"><b>Talking over it</b><span>Its voice drops while you speak, then carries on.</span></div>
      <div class="trk"><span class="tl">Echo</span><div class="tw">${bars(64, "duck", { duck: [30, 46] })}<span class="grace" style="width:9%"><em>first 0.3 s ignored</em></span><span class="mark" style="left:46.8%;width:25%"><em>Lowered to 25%</em></span></div></div>
      <div class="trk"><span class="tl">You</span><div class="tw">${bars(64, "you", { cls: "you", gap: [0, 30], end: 46 })}</div></div>
    </div>
    ${pvfoot("Speech to text and its voice both run on this computer.", "lock")}`;

  /* ── B: a gallery of voices ──────────────────────────────────────── */
  const bCtl = () => `
    ${ocard("Hearing", [
      orow("Speech to text", "On this computer · ready", `<span class="pill dot" style="--tc:var(--success)">Ready</span>`, o("note")),
      orow("Microphone", meter(46, 14), dd("Like the system"), o("mic")),
      orow("Speaker", "", dd("Like the system"), o("speaker")),
      orow("Run speech to text on", "The graphics card is faster but shares its memory with the model.", "", o("cpu")),
      `<div class="opt av-seg">${seg(["Processor", "Graphics card"], "Processor")}</div>`,
    ], { first: true, cls: "icons" })}
    ${ocard("Talking over it", [
      orow("Keep listening while it talks", "So you can say “stop” or add to the request.", sw(true), o("mic")),
      orow("When you talk over it", "", seg(["Pause", "Lower"], "Lower"), o("volume")),
      orow("Lowered to", "", sl(25, "25%", 120), o("sliders")),
    ], { cls: "icons" })}`;
  const vcard = ([n, acc, d, c, on]) => `<div class="av-vc ${on ? "on" : ""}" style="--vc:var(--sw-${c})"><span class="vi">${n[0]}</span><div class="tx"><b>${n}</b><span>${d}</span></div>${on ? icon("check-c", "ok") : ib("play", "Hear " + n)}</div>`;
  const bPv = () => `
    ${pvhead("Choose a voice", "Click one to hear it say a sentence.", seg(["All", "American", "British"], "All"))}
    <div class="av-gh">American</div>
    <div class="av-gal">${VOICES.filter((v) => v[1] === "US").map(vcard).join("")}</div>
    <div class="av-gh">British</div>
    <div class="av-gal">${VOICES.filter((v) => v[1] === "UK").map(vcard).join("")}</div>
    <div class="card av-now">${orb()}<div class="tx"><b>Sarah</b><span>“Your next meeting is the design review at 3 pm.”</span></div>
      <div class="spd"><small>Speed</small>${sl(40, "1.1×", 150)}</div>${btn("Play", "primary sm", "play")}</div>`;

  /* ── C: hearing first ────────────────────────────────────────────── */
  const cCtl = () => `
    ${ocard("Hearing", [
      orow("Microphone", "Studio USB mic", dd("Like the system"), o("mic")),
      orow("Quietest speech", "Lower hears softer voices.", sl(30, "Normal", 110), o("sliders")),
      orow("Runs on", "", seg(["Processor", "Graphics card"], "Processor"), o("cpu")),
      nrow("Its name", "", "Echo, Hey Echo", o("chat")),
    ], { first: true, cls: "icons" })}
    ${ocard("Talking over it", [
      orow("Keep listening while it talks", "So you can say “stop” or add to it.", sw(true), o("mic")),
      orow("Stop or lower its voice", "When you start talking.", seg(["Pause", "Lower"], "Lower"), o("volume")),
      orow("Ignore its first words", "So they aren't taken for yours.", sl(15, "0.3 s", 90), o("clock")),
    ], { cls: "icons" })}
    ${ocard("", [nrow("Its voice", "", "Sarah · 1.1×", o("volume")), nrow("Speaker", "", "Like the system", o("speaker"))], { cls: "icons" })}`;
  const level = () => {
    const n = 72, vals = Array.from({ length: n }, (_, i) => {
      const talk = (i > 14 && i < 34) || (i > 40 && i < 62);
      return talk ? 35 + (hash("lv" + i) % 60) : 4 + (hash("nz" + i) % 12);
    });
    return `<div class="av-lv">${vals.map((v, i) => `<b class="${v > 28 ? "sp" : ""}" style="height:${v}%"></b>`).join("")}<span class="thr" style="bottom:28%"><em>Quietest speech it hears</em></span><span class="nz" style="height:16%"><em>Background noise</em></span></div>`;
  };
  const cPv = () => `
    ${pvhead("Microphone check", "Say something; the bars show what it hears.", `<div class="pill dot" style="--tc:var(--success)">Listening</div>`)}
    <div class="card av-mic">${level()}
      <div class="heard"><small>It heard</small><p><span class="w">Hey</span> <span class="w nm">Echo</span>, <span class="w">set</span> <span class="w">a</span> <span class="w">timer</span> <span class="w">for</span> <span class="w">ten</span> <span class="w">minutes</span></p></div>
    </div>
    <div class="av-facts">${[["Your voice", "Clear", "check-c", "ok"], ["Background", "Quiet", "check-c", "ok"], ["Speech to text", "0.2 s behind", "clock", ""]].map(([k, v, ic, c]) => `<div class="card"><span class="lic" style="--tc:var(--sec-assistant)">${icon(ic)}</span><div><small>${k}</small><b class="${c}">${v}</b></div></div>`).join("")}</div>
    ${pvfoot("Nothing it hears is kept or sent anywhere unless you save conversations.", "lock")}`;

  REG("assistant-voice", {
    name: "Voice",
    summary: "Three groups in one column: hearing, talking over it, and its voice. The voice is at the bottom, picked from a list of eleven names with a separate Preview button, and the talking-over settings are five rows of switches and decimals.",
    problems: [
      "<b>Its voice is last:</b> the thing most people come for sits at the bottom, after the speech model, devices and five talking-over rows.",
      "<b>Picking blind:</b> eleven voices in a dropdown (“Heart (US)”, “Bella (US)”), with no hint of how they sound; you choose, then press Preview in another row.",
      "<b>Bare numbers:</b> “Lowered volume 0.25”, “Quietest speech 0.003” and “Ignore the start of its answer for 300 ms” mean nothing until you try them.",
      "<b>No sign the microphone works:</b> Microphone and Speaker say only “Restarts the assistant.”; there's no level meter or test.",
      "<b>Talking over it is hard to picture:</b> three switches and three sliders describe one behaviour (its voice pausing or dropping while you speak).",
      "<b>Long notes wrap at 800 px</b> beside wide dropdowns (“Same as the system”).",
    ],
    today: [["assistant-voice-1280", "Today", ""], ["assistant-voice-800", "Today at 800 px", ""]],
    options: [
      {
        id: "a", name: "Hear it",
        idea: "Its voice comes first, and the picture plays a short exchange in the chosen voice and speed, with a waveform you can play and pause. Under it, two tracks show what talking over it does: its voice dropping to 25% while you speak, and the start of its answer it ignores. Hearing gets a live microphone meter; the rare sensitivity settings move to Fine-tuning.",
        shots: [["a", "Hear it", ""], ["a-800", "At 800 px", "The sample above the controls"]],
      },
      {
        id: "b", name: "Choose a voice",
        idea: "The voices become a gallery, American and British, each with a word or two on how it sounds and a play button; click one to hear it, and it's chosen. Speed sits with the sample sentence under the gallery. Hearing and talking over it stay on the left as two short cards.",
        shots: [["b", "Choose a voice", "Eleven voices to hear and pick"]],
      },
      {
        id: "c", name: "Hearing first",
        idea: "For when Echo mishears you. The picture is a microphone check: bars of what it hears, the quietest-speech line you're setting drawn across them over the background noise, and the words it understood, with its name picked out. The controls lead with the microphone and sensitivity; its voice and speaker are rows that open their own pages.",
        shots: [["c", "Microphone check", "What it hears, and the quietest-speech line"]],
      },
    ],
    pages: { a: page(() => split(aCtl(), aPv(), { sec: "assistant", ctlw: 430 })), b: page(() => split(bCtl(), bPv(), { sec: "assistant", ctlw: 400 })), c: page(() => split(cCtl(), cPv(), { sec: "assistant", ctlw: 430 })) },
  });
})();
