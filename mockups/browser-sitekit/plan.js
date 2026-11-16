// Browser's site styles (like Stylus), scripts (like Tampermonkey), the YouTube enhancer and the
// Swift Selection Search import: Settings panes, the install card, and the Site card's "On this
// site". Data only; screens.js draws, render.sh renders.
//
// kept: what the extension (Stylus, Tampermonkey, Enhancer for YouTube, Swift Selection Search)
// did, and where it is in each option.

const PANELS = [
  {
    id: "styles",
    name: "Site styles",
    today: "Nothing: Stylus is an extension, with its own pages in its own colours. Browser will ship styles for common sites that take the current Nyx theme's colours, and keep yours (imported or written) beside them.",
    // Ken picked A (Rows), 14 Nov 2026. Controls are Design 2.0 (Segment switches, Bar
    // sliders, Tinted checkboxes).
    options: [
      { id: "a", name: "A · Rows", idea: "Browser's styles as rows, each with its site's icon and a switch; Your styles under them; Import and New at the top." },
    ],
    states: [
      ["list", "Every style", "Browser's styles in Tokyo Night, and two of yours"],
      ["editor", "Editing a style", "Its code, its sites and its options (@var), with a live preview"],
      ["import", "Importing", "A Stylus backup: what will come in, and what needs its options"],
    ],
    kept: [
      ["Turn a style on or off", "Switch on its row"],
      ["Write or edit a style (code editor)", "Editor view"],
      ["Which sites it applies to (domains, URLs, prefixes, regexps)", "Editor, Sites"],
      ["UserCSS options (@var: flavour, accent, toggles)", "Editor, Options"],
      ["Import a Stylus backup, a .user.css or .user.less file, a URL", "Import menu"],
      ["Install from a link (userstyles.world, GitHub)", "Install card"],
      ["Check for updates", "Row menu; Check all"],
      ["Styles for this site, on or off", "Site card"],
      ["Follow the Nyx theme", "Browser's styles (added)"],
    ],
  },
  {
    id: "scripts",
    name: "Scripts",
    today: "Nothing: Tampermonkey is an extension. Scripts will be Browser's, with the same metadata and GM functions.",
    options: [{ id: "a", name: "Scripts", idea: "A row per script: its icon, name, sites, version and a switch; its editor and its stored values as views; Import from Tampermonkey or a file." }],
    states: [
      ["list", "Every script", "Four scripts, one off"],
      ["editor", "Editing a script", "Code, with what it may do in words"],
      ["values", "Its stored values", "What it kept with GM_setValue, editable"],
      ["import", "Importing", "A Tampermonkey backup"],
    ],
    kept: [
      ["Turn a script on or off", "Switch on its row"],
      ["Write or edit (code editor), with its metadata", "Editor view"],
      ["What it may do (@grant, @connect), in words", "Editor, side"],
      ["Its stored values", "Values view"],
      ["Import Tampermonkey zip or JSON, a .user.js file", "Import menu"],
      ["Install from GreasyFork, OpenUserJS, GitHub", "Install card"],
      ["Check for updates (@updateURL)", "Row menu; Check all"],
      ["Its menu commands (GM_registerMenuCommand)", "Site card"],
    ],
  },
  {
    id: "install",
    name: "Install card",
    today: "Stylus and Tampermonkey open their own install pages.",
    options: [{ id: "a", name: "Over the page", idea: "A card over the page that showed the .user.css or .user.js file: name, author, sites, what it may do, version, Install." }],
    states: [
      ["style", "A style", "A YouTube style from userstyles.world"],
      ["script", "A script", "A GreasyFork script that asks to talk to a site"],
    ],
  },
  {
    id: "sitecard",
    name: "Site card",
    today: "Stylus and Tampermonkey had toolbar buttons with their own popups.",
    options: [{ id: "a", name: "On this site", idea: "A group in the Site card: the style for this site with its switch, the scripts running here with their menu commands." }],
    states: [["main", "On a styled page", "github.com with Browser's GitHub style and a script"]],
  },
  {
    id: "youtube",
    name: "YouTube",
    today: "Enhancer for YouTube, with dozens of settings. Browser keeps the ones that matter.",
    options: [{ id: "a", name: "In Settings", idea: "A Settings page with three groups: Player, Playback, Page." }],
    states: [["main", "YouTube", "Theater mode on, no mini player"]],
    kept: [
      ["Auto theater mode", "Player"],
      ["No mini player when scrolling", "Player"],
      ["Default quality, default speed, default volume", "Playback"],
      ["Mouse wheel: volume; with Ctrl, speed", "Playback"],
      ["Pause other tabs, no autoplay in background tabs, no autoplay next", "Playback"],
      ["Hide cards and end screens, Shorts in the normal player", "Page"],
    ],
  },
  {
    id: "sss",
    name: "Selection search import",
    today: "Swift Selection Search's engines and settings stay in the extension.",
    options: [{ id: "a", name: "Import", idea: "Selection search gets Import from Swift Selection Search; a preview shows the engines to add and what can't come across." }],
    states: [
      ["pane", "Selection search", "With Import"],
      ["preview", "The preview", "19 engines, one to fix, two settings"],
    ],
  },
];

const W = 1280, H = 800;

if (typeof module !== "undefined") module.exports = { PANELS, W, H };
