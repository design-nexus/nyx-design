// What the gallery shows: every surface, with today's shots where there are some and what's wrong
// with them. The window and the address bar are drawn in each of Browser's three layouts; everything
// else is the same in all three and drawn once, in Focus. Data only; the drawings are in screens.js
// (shared), pages.js (Browser's pages) and dirs/ID.js (each layout's frame). Read by index.html and
// by render.sh (with node), so nothing here may touch the page.

// The three layouts, chosen in Settings and at first run. Only the frame differs between them.
const LAYOUTS = [
  { id: "a", name: "Studio", idea: "A header across the top with a centred address and one Site button, the bookmarks bar under it, the tab sidebar, and the page as an inset sheet." },
  { id: "b", name: "Focus", idea: "Sidebar only. Navigation, the address, Essentials, a bookmarks shelf and the tabs are all in the sidebar, and the page runs the full height. Ctrl+L opens a command bar in the middle of the window." },
  { id: "c", name: "Workbench", idea: "A tab bar across the top, the address bar under it, then the bookmarks bar, and a Library rail on the left for workspaces, bookmarks, history and the reading list." },
];
// Screens drawn in each layout; the rest are the same everywhere.
const PER_LAYOUT = new Set(["main", "bookmarks", "collapsed", "split", "workspaces", "narrow", "private", "address"]);

// Tabs, by section: [section, [[id, tab name, what it shows, width, height], …]]
const SECTIONS = [
  ["Window", [
    ["main", "Main window", "Reading an article, with the bookmarks bar", 1280, 800],
    ["bookmarks", "Bookmarks", "A bookmarks folder open", 1280, 800],
    ["collapsed", "Collapsed", "Each layout's smallest frame at full width", 1280, 800],
    ["split", "Split view", "Two pages side by side", 1280, 800],
    ["workspaces", "Workspaces", "Switching and managing workspaces", 1280, 800],
    ["narrow", "800 px", "Tiled beside another window", 800, 800],
    ["private", "Private window", "Nothing kept after it closes", 1280, 800],
  ]],
  ["Tabs", [
    ["tab-menu", "Tab menu", "Right-click on a tab", 1280, 800],
    ["tab-preview", "Tab preview", "Hovering over a tab", 1280, 800],
  ]],
  ["Address & site", [
    ["address", "Address bar", "Typing, with suggestions", 1280, 800],
    ["site", "Site panel", "Blocking, permissions and logins for this site", 1280, 800],
    ["permission", "Permission request", "A site asks for your location", 1280, 800],
    ["insecure", "Not secure", "A page without HTTPS, and what the site panel says", 1280, 800],
    ["find", "Find in page", "Ctrl+F", 1280, 800],
  ]],
  ["Menus", [
    ["menu", "App menu", "Everything else the browser does", 1280, 800],
    ["context", "Link", "Right-click on a link", 1280, 800],
    ["context-page", "Page", "Right-click on the page", 1280, 800],
    ["context-image", "Image", "Right-click on an image", 1280, 800],
    ["context-text", "Selection", "Right-click on selected text", 1280, 800],
  ]],
  ["Panels", [
    ["downloads", "Downloads", "What's downloading and done", 1280, 800],
    ["share", "Share", "Apps, nearby devices, QR code", 1280, 800],
    ["vpn", "VPN", "Browser-only VPN, per workspace", 1280, 800],
    ["passwords", "Passwords", "Logins and passkeys for this site", 1280, 800],
    ["video", "Video download", "Saving a video with yt-dlp", 1280, 800],
    ["assistant", "Assistant", "Asking about the page", 1280, 800],
  ]],
  ["Extensions", [
    ["extensions", "Extensions panel", "The toolbar's extensions, built-ins first", 1280, 800],
    ["addons", "Manager", "Extensions, themes and plugins", 1280, 800],
    ["addon-detail", "Details", "One extension's settings and access", 1280, 800],
    ["install", "Installing", "What a new extension asks for", 1280, 800],
  ]],
  ["Library", [
    ["history", "History", "Grouped by day, searchable", 1280, 800],
    ["library-bookmarks", "Bookmarks", "Every bookmark and folder", 1280, 800],
    ["library-downloads", "Downloads", "Every download", 1280, 800],
  ]],
  ["Settings", [
    ["settings", "Layout & tabs", "The three layouts, and tab behaviour", 1280, 800],
    ["settings-general", "General", "Startup, files, language", 1280, 800],
    ["settings-privacy", "Privacy", "Blocking, cookies, history", 1280, 800],
    ["settings-search", "Search", "Engines, suggestions, keywords", 1280, 800],
    ["settings-find", "Find in Settings", "Searching for \"cookies\"", 1280, 800],
  ]],
  ["Pages & prompts", [
    ["newtab", "New tab", "The start page", 1280, 800],
    ["firstrun", "First run", "Choosing a layout", 1280, 800],
    ["save-login", "Save login", "After signing in", 1280, 800],
    ["reader", "Reader view", "The article, without the site", 1280, 800],
    ["error", "Can't connect", "The site can't be reached", 1280, 800],
    ["print", "Print", "Printing the article", 1280, 800],
  ]],
];
const SCREENS = SECTIONS.flatMap(([sec, tabs]) => tabs.map(([id, name, what, w, h]) => ({ id, name, what, w, h, sec, per: PER_LAYOUT.has(id) })));

// Today's built Browser, from capture-today.py (Nyx Dark, a scratch profile, made-up pages):
// tab -> [[file in today/, title, note], …]
const TODAY = {
  main: [["main", "Today", "The fork as built, 1280 × 800"]],
  narrow: [["narrow", "Today at 800 px", "Sidebar expanded, as set"]],
  address: [["address", "Today", "Firefox's results list, restyled"]],
  site: [["site-identity", "Today: the padlock", "Firefox's site information panel"], ["site-shield", "Today: the shield", "Content blocking, a separate panel"]],
  menu: [["menu", "Today", "Firefox's app menu"]],
  context: [["context", "Today", "Firefox's link menu"]],
  extensions: [["extensions", "Today", "Firefox's extensions panel"]],
  addons: [["addons", "Today", "about:addons"]],
  settings: [["settings", "Today", "Browser's Tabs & Sidebar pane"]],
  newtab: [["newtab", "Today", "The approved new tab page"]],
};

const PROBLEMS = {
  main: [
    "<b>Ten actions the same size:</b> Share, Capture, Assistant, Passwords, Extensions, VPN, Open in, Downloads, Settings and the menu all sit in one row of identical 16 px icons, so none of them reads first.",
    "<b>Site state is scattered:</b> the shield, the video button, QR and the star are inside the address field, the padlock is on its left, and the key and VPN are out in the toolbar.",
    "<b>The address field is crowded:</b> a \"Not secure\" badge, an unlabelled site icon, the URL, then the shield, QR and star, all at one size.",
    "<b>The sidebar is a list of rows:</b> the active tab is a tinted row like the others; pinned tabs, folders and today's tabs only differ by their small headings.",
  ],
  narrow: [
    "<b>The address is cut to \"fieldnotes.examp\"</b> while \"Not secure\", the shield, QR, the star, Share and Settings keep their room.",
    "<b>The expanded sidebar takes a quarter of the window,</b> and the page loses its margins.",
  ],
  address: [
    "<b>It's Firefox's results list</b> recoloured: rows of the same weight, the search engines as a strip of tiny icons at the foot, nothing for open tabs beyond a \"Switch to tab\" label.",
    "<b>No commands:</b> Quick Commands (F2) is a separate box; the address can't run \"Split with…\" or \"Clear site data\".",
  ],
  site: [
    "<b>Two panels for one site:</b> the padlock opens Firefox's site information (connection, permissions, cookies), the shield opens content blocking. Saved logins are in a third, the key.",
    "<b>Permissions only show once changed:</b> a site without exceptions gets a one-line panel, \"Connection not secure\", with nothing to set.",
    "<b>The shield panel is a different design</b> from the rest: a tile grid of five toggles, two big buttons, a footer of links.",
  ],
  menu: [
    "<b>Firefox's long list:</b> about twenty rows of the same weight, with Firefox account and sync at the top and Browser's own tools (Capture, Assistant, VPN) nowhere in it.",
    "<b>Zoom and edit controls</b> are squeezed into small inline buttons.",
  ],
  context: [
    "<b>Firefox's menu with additions tacked on:</b> sixteen rows in Firefox's Title Case with no icons, Zen's Glance and Split in the middle, and Share link and Block element (uBlock's red logo) at the very bottom.",
    "<b>Missing:</b> open in another workspace, Open in another browser, Ask Assistant; \"Inspect Accessibility Properties\" sits above Share.",
  ],
  extensions: [
    "<b>Built-ins look like any extension:</b> content blocking shows as uBlock Origin with its own logo and Firefox's permission sentence; Passwords and VPN, also Browser's own, aren't there at all.",
    "<b>No site access at a glance:</b> whether an extension can read this site is behind each one's ⋯ menu.",
  ],
  addons: [
    "<b>about:addons is Firefox's page:</b> its own sidebar, card style and wording, with Firefox's recommendations and none of the Nyx frame.",
    "<b>Plugins (the video codecs) are a separate, obscure page.</b>",
  ],
  settings: [
    "<b>Two settings apps in one:</b> Browser's panes sit above Firefox's own (Look and Feel, Zen Mods, Home and startup…) in the same list, with overlapping options.",
    "<b>Segmented controls stretched over long labels</b> (\"After related tabs\", \"A background tab\") and no preview of what a layout choice does.",
  ],
  newtab: [
    "<b>Mostly empty at first:</b> a lone Add tile, then a plain list of recent tabs with letter icons that don't match the sites (W for Field Notes, G for Peak Outfitters).",
    "<b>Nothing from the rest of Browser:</b> no other workspaces' tabs, nothing downloading, no weather or calendar from the suite.",
  ],
};

if (typeof module !== "undefined") module.exports = { LAYOUTS, PER_LAYOUT, SECTIONS, SCREENS, TODAY, PROBLEMS };
