# Nyx Browser: feature mockups

Proposals for Browser (the Zen source fork, `design-nexus/nyx-browser`) before any code is
written. They're drawn with the approved browser mockups' own files (`../browser/tokens.css`,
`browser.css`, `browser.js`), so the frame, top bar and sidebar are the same; `features.js` and
`features.css` add the new screens. Nothing in `../browser/` changed.

Open `index.html` for the gallery, or `browser.html?screen=<name>&theme=mocha|dark|light` for one
screen. `./render.sh` re-renders every shot into `shots/` with headless Chromium (nothing opens on
screen); `./render.sh share vpn-panel` renders only those. Windows are 1440 × 900.

## What the shots propose

- **Top bar:** the address field gains the video download icon (on sites yt-dlp supports) and the
  content-blocking shield with its count; the action area gains VPN (a dot when connected) and
  Open in, beside Passwords and Extensions. All of them can be moved or removed in Customize.
- **Selection search:** Swift Selection Search's popup built in, drawn by Browser above the page
  rather than injected into it: the selection in a text box on top, engines underneath.
- **VPN:** browser only, like NordVPN's extension: provider proxies or a WireGuard file, a choice
  per workspace, and nothing outside Browser goes through it.
- **Content blocking:** uBlock Origin ships inside Browser; the shield and the settings pane are
  Nyx's, and uBlock's dashboard stays one click away for advanced rules.
- **Passwords:** the extension's popup, field menu, save bar and passkey card, built into Browser.
  Firefox's own saving and autofill go away; passkeys come from Nyx Passwords first.
- **Tabs:** Vivaldi's tab behaviour as settings; Firefox's own preferences where they exist.
- **Share:** the page on top, app tiles, nearby devices, and the QR code inside the dropdown.

| Shot | Shows |
| --- | --- |
| `pwicon-board` | Six options for the Passwords icon, side by side |
| `pwicon-a` … `pwicon-f` | The login page with each option: top bar, fields, field menu |
| `selection-popup` | Selecting text: the text box on top, the engines below |
| `settings-selection` | Settings, Selection Search |
| `video-panel` | Downloading a video: format, quality, subtitles, folder |
| `video-progress` | The Downloads panel with yt-dlp jobs |
| `settings-downloads` | Settings, Downloads, with Videos |
| `vpn-panel` | The VPN panel |
| `vpn-add` | Adding a VPN: the providers, NordVPN's service credentials |
| `settings-vpn` | Settings, VPN |
| `open-in` | The Open in dropdown |
| `open-in-link` | Open link in another browser |
| `shield-panel` | The content-blocking shield's panel |
| `shield-picker` | Picking an element to hide |
| `settings-blocking` | Settings, Content Blocking |
| `passwords-field` | The key in login fields, and the field menu |
| `passwords-panel` | The Passwords panel |
| `passwords-save` | Saving a login |
| `passkey` | Signing in with a passkey from Nyx Passwords |
| `settings-passwords` | Settings, Passwords |
| `settings-tabs` | Settings, Tabs & Sidebar: new tabs and closing tabs |
| `settings-tabs-2` | Settings, Tabs & Sidebar further down: the tab bar, switching, hibernation, startup |
| `tab-hibernated` | Hibernated tabs and the tab menu |
| `share` | The Share dropdown, redesigned |
| `share-qr` | Share's QR code |
| `quick-commands` | Quick Commands (F2) |
| `settings-gestures` | Settings, Gestures |
