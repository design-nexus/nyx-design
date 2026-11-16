// Browser's pages that replace Firefox's last ones: Themes (Nyx themes and Browser's accent), the
// Extensions page's row menu, permissions and shortcuts, Keyboard shortcuts, About, Containers,
// and the Library's import and back up. Data only; screens.js draws, render.sh renders.
//
// kept: what the Firefox page (or the old Browser page) did, and where it is in each option.

const PANELS = [
  {
    id: "themes",
    name: "Themes",
    today: "Extensions › Themes lists Firefox's add-on themes; Use changes nothing you can see, because Browser's colours come from the Nyx theme. Settings › Appearance offers only Follow, Nyx Dark and Nyx Light, and an accent.",
    options: [
      { id: "a", name: "A · Cards", idea: "Follow system as a wide card, then every Nyx theme as a small picture of a window in its colours, dark ones then light. The accent is a row of swatches under them." },
      { id: "b", name: "B · Rows", idea: "Two columns of rows, each with the theme's colours as a strip, its name and whether it's dark or light. The accent sits on top, beside Follow system." },
      { id: "c", name: "C · Preview and list", idea: "A big picture of Browser in the chosen theme and accent, with the accent swatches under it; every theme is a row in the list beside it." },
    ],
    states: [
      ["follow", "Following the system", "Omarchy's theme, the theme's own accent"],
      ["picked", "A theme of its own", "Tokyo Night with a teal accent: the page takes them at once"],
    ],
    kept: [
      ["Pick Browser's theme", "A card", "A row", "A row"],
      ["Follow the system's theme (Omarchy, or Nyx Settings')", "First card", "First row", "First row"],
      ["Pick Browser's accent", "Swatches under the cards", "Swatches on top", "Swatches under the preview"],
      ["See which is in use", "Ring and check", "Check", "Check, and the preview"],
      ["Firefox's add-on themes", "Gone (they didn't change Browser)", "Gone", "Gone"],
    ],
  },
  {
    id: "extensions",
    name: "Extensions",
    today: "Each extension is a row with a switch; Remove, Pin and its options are only on its own page, and Shortcuts and Permissions and more open Firefox's add-ons manager.",
    options: [{ id: "a", name: "The Extensions page", idea: "Each row gets a ⋯ menu with what the toolbar's panel has. An extension's page holds its permissions, sites and its own options; Shortcuts is a section of the page." }],
    states: [
      ["menu", "A row's menu", "Pin, move, its options, Manage, Remove, Report"],
      ["permissions", "Its permissions", "What it needs, what it may ask for, its sites"],
      ["options", "Its own options", "The extension's options page inside its page"],
      ["shortcuts", "Shortcuts", "Every extension's commands and their keys"],
      ["recording", "Changing a key", "Press the new keys; Esc keeps the old ones"],
      ["clash", "Two on one key", "Said in the row, with which one has it"],
    ],
    kept: [
      ["Turn on or off", "Switch on the row"],
      ["Remove", "Row's ⋯ menu, and its page"],
      ["Pin its button, move it", "Row's ⋯ menu, and its page"],
      ["Its own options", "Row's ⋯ menu; inside its page"],
      ["Permissions it has and may ask for", "Its page, Permissions"],
      ["Sites it may read", "Its page, Sites: add and remove"],
      ["Run in private windows, update automatically", "Its page, In Browser"],
      ["Keyboard shortcuts for its commands", "Shortcuts section"],
      ["Report", "Row's ⋯ menu, and its page"],
    ],
  },
  {
    id: "keys",
    name: "Keyboard shortcuts",
    today: "F1 opens Firefox's about:keyboard; Settings › Gestures › Edit lands on General.",
    options: [
      { id: "a", name: "A · In Settings", idea: "A page of Settings, under Gestures: groups of rows, each with its keys and Change; search at the top." },
      { id: "b", name: "B · Its own page", idea: "A page of its own, like the Library: its groups in the side, search on top, a row per command with its keys." },
    ],
    states: [
      ["list", "Every shortcut", "Tabs, the page, the window, Browser's tools"],
      ["search", "Search", "“tab”: what matches, across the groups"],
      ["edit", "Changing one", "Press the new keys; Reset puts back Browser's"],
    ],
    kept: [
      ["Every shortcut, by group", "Groups of rows", "Groups in the side"],
      ["Search", "Field at the top", "Field at the top"],
      ["Change a key", "Change on the row", "Click the keys"],
      ["Reset one, reset all", "On the row; at the top", "On the row; in the side"],
      ["Opened by F1, Help and Settings › Gestures", "Yes", "Yes"],
    ],
  },
  {
    id: "about",
    name: "About Browser",
    today: "Help › About opens Zen's About dialog, in Zen's colours; copying its build info says “Firefox”.",
    options: [
      { id: "a", name: "A · A Settings page", idea: "The last item in Settings' side: Browser's version, updates, what's new, credits and licences." },
      { id: "b", name: "B · A small window", idea: "A card over the window, as About is elsewhere in Nyx: the logo, version and update, three links." },
    ],
    states: [["main", "About", "Up to date, version and date"]],
    kept: [
      ["Version and build date", "Top", "Under the name"],
      ["Check for updates", "Button", "Button"],
      ["Copy version info (no Firefox in it)", "Row", "Link"],
      ["What's new, credits, licences", "Rows", "Links"],
    ],
  },
  {
    id: "containers",
    name: "Containers",
    today: "Manage Containers opens Settings › Layout & tabs, which has nothing about containers.",
    options: [{ id: "a", name: "In Layout & tabs", idea: "A Containers group in Settings › Layout & tabs: each with its colour and icon, how many tabs it has open, Edit and Remove; New container." }],
    states: [
      ["list", "Containers", "Personal, Work, Banking, Shopping"],
      ["edit", "Editing one", "Name, colour and icon, in the row"],
    ],
  },
  {
    id: "library",
    name: "Library: import and back up",
    today: "Nowhere: the menubar is hidden, and the Library has only Add and New folder.",
    options: [{ id: "a", name: "In Bookmarks", idea: "Bookmarks gets an Import and back up menu beside Add and New folder." }],
    states: [["menu", "Import and back up", "From another browser or a file; back up, restore, export"]],
  },
];

const W = 1280, H = 800;

if (typeof module !== "undefined") module.exports = { PANELS, W, H };
