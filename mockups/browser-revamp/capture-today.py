#!/usr/bin/env python3
"""Today's built Browser on the redesign's screens, for the gallery's "Today" shots.

    python3 capture-today.py [SHOT…]

Runs the fork's build headless (MOZ_HEADLESS) through nyx-browser/nyx/tools/marionette.py, with a
scratch home and profile, so no window opens and no real profile is read. Sites are made-up pages
served from here through a local proxy, so the address bar shows their names. Popups are copied
into the window before each shot (headless shots leave them out), as the browser-features compare
shots did. Writes today/SHOT.png in Nyx Dark.
"""
import http.server
import json
import sys
import threading
import time
from pathlib import Path
from urllib.parse import urlsplit

HERE = Path(__file__).resolve().parent
NYX = Path.home() / "Projects/nyx-browser/nyx"
sys.path.insert(0, str(NYX / "tools"))
sys.path.insert(0, str(NYX / "tests"))
from marionette import Browser  # noqa: E402
import look  # noqa: E402

OUT = HERE / "today"
ONLY = set(sys.argv[1:])

# host -> (title, favicon letter, colour, body)
ARTICLE = """<header style="display:flex;justify-content:space-between;padding:16px 44px;border-bottom:1px solid #ebe6da"><b>Field Notes</b><nav>Trips &nbsp; Gear &nbsp; Maps &nbsp; About</nav></header>
<main style="max-width:720px;margin:0 auto;padding:34px 20px"><h1 style="font-size:36px;line-height:1.15;margin:0 0 14px">Water on the ridge: where to fill up between Calera and the saddle</h1>
<div style="height:200px;border-radius:12px;background:linear-gradient(180deg,#f4c58f,#dfe3dc)"></div>
<p style="font:16.5px/1.65 Georgia,serif">Cedar Spring is the only reliable water in late autumn. The creek at the second switchback runs until the first hard frost, and the trough by the old gate is for cattle.</p>
<p style="font:16.5px/1.65 Georgia,serif">From the trailhead, follow <a id=link href="http://maps.example/ridge">the ridge loop map</a> north for 4.2 miles.</p></main>"""
SITES = {
    "fieldnotes.example": ("Water on the ridge · Field Notes", "F", "#c0843d", ARTICLE),
    "maps.example": ("Trailheads near Calera", "M", "#2f9e64", "<h1>Trailheads</h1>"),
    "weather.example": ("Calera · 10-day forecast", "W", "#e0a21b", "<h1>Calera</h1>"),
    "trailkitchen.example": ("Camp stove chili · Trail Kitchen", "K", "#4f8a3c", "<h1>Chili</h1>"),
    "peakoutfitters.example": ("Gaiter sizes · Peak Outfitters", "P", "#2563c9", "<h1>Gaiters</h1>"),
    "calendar.example": ("Calendar", "C", "#d14836", "<h1>Week</h1>"),
}


def page(hostname):
    t, letter, colour, body = SITES.get(hostname, ("Not found", "?", "#888", "<h1>?</h1>"))
    icon = f"<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><rect width='16' height='16' rx='4' fill='{colour}'/><text x='8' y='12' font-size='10' font-family='sans-serif' font-weight='700' fill='white' text-anchor='middle'>{letter}</text></svg>"
    from urllib.parse import quote
    return (f"<!doctype html><meta charset=utf-8><title>{t}</title><link rel=icon href=\"data:image/svg+xml,{quote(icon)}\">"
            f"<body style='margin:0;font:15px Inter,sans-serif;background:#fbf9f4;color:#23211d'>{body}").encode()


class Proxy(http.server.BaseHTTPRequestHandler):
    """Every site, served as a proxy would: the request line has the whole URL."""
    def do_GET(self):
        hostname = urlsplit(self.path).hostname or self.headers.get("Host", "").split(":")[0]
        body = page(hostname)
        self.send_response(200)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, *a):
        pass


# A copy of an open popup, drawn into the window where it was (from browser-features' compare shots).
CLONE = r"""
const [selector] = arguments;
const done = arguments[arguments.length - 1];
(async () => {
  const node = document.querySelector(selector);
  if (!node) return done({ error: "no " + selector });
  const panel = node.closest("panel, menupopup") || node;
  const inner = node.getBoundingClientRect();
  const parts = /^(panel|menupopup)$/.test(node.localName) ? [...node.children] : [node];
  const fix = (from, to) => {
    if (from.nodeType !== 1) return;
    const cs = getComputedStyle(from);
    let text = "";
    for (let i = 0; i < cs.length; i++) { const p = cs[i]; if (!/^(transition|animation)/.test(p)) text += `${p}:${cs.getPropertyValue(p)};`; }
    to.style.cssText = text;
    for (let i = 0; i < from.children.length; i++) fix(from.children[i], to.children[i]);
  };
  const copies = parts.map(part => { const c = part.cloneNode(true); fix(part, c); c.style.position = "static"; c.style.margin = "0"; return c; });
  for (const c of copies) for (const btn of [...c.querySelectorAll("button")].reverse()) {
    const div = document.createElementNS("http://www.w3.org/1999/xhtml", "div");
    div.style.cssText = btn.style.cssText; div.append(...btn.childNodes); btn.replaceWith(div);
  }
  const content = panel.shadowRoot?.querySelector("[part~=content]") ?? panel;
  const pc = getComputedStyle(content);
  const box = content.getBoundingClientRect();
  const host = document.createXULElement("vbox");
  host.className = "nyx-panelshot";
  const x = box.width ? box.x : inner.x, y = box.width ? box.y : inner.y;
  host.style.cssText = `position: fixed; z-index: 99999; left: ${Math.round(x)}px; top: ${Math.round(y)}px;
    width: ${Math.round(box.width || inner.width)}px; height: ${Math.round(box.height || inner.height)}px;
    background-color: ${pc.backgroundColor}; color: ${pc.color}; border-radius: ${pc.borderRadius === "0px" ? "12px" : pc.borderRadius};
    padding: ${pc.padding}; box-sizing: border-box; box-shadow: 0 0 0 1px rgba(255,255,255,.07), 0 18px 48px rgba(0,0,0,.45); overflow: hidden;`;
  host.append(...copies);
  panel.hidePopup?.();
  document.documentElement.append(host);
  done({ x, y });
})().catch(e => done({ error: String(e) }));
"""


def shot(b, name, selector=None):
    if ONLY and name not in ONLY:
        return
    if selector:
        r = b.js_async(CLONE, selector, timeout=20)
        if r and r.get("error"):
            print(name, "copy failed:", r["error"])
        time.sleep(0.8)
    b.screenshot(str(OUT / f"{name}.png"))
    if selector:
        b.js("document.querySelectorAll('.nyx-panelshot').forEach(n => n.remove())")
    print("shot", name)


def close_popups(b):
    b.js("for (const p of document.querySelectorAll('panel, menupopup')) if (p.state === 'open' || p.state === 'showing') p.hidePopup()")
    time.sleep(0.6)


def open_tab(b, url, select=True):
    b.js("gBrowser.addTab(arguments[0], { triggeringPrincipal: Services.scriptSecurityManager.getSystemPrincipal(), inBackground: !arguments[1] })", url, select)
    time.sleep(1.5)


def navigate(b, url, wait=2.5):
    b.js("openTrustedLinkIn(arguments[0], 'current')", url)
    time.sleep(wait)


def content_point(b, element_id):
    """Viewport coordinates of an element in the page."""
    b.call("Marionette:SetContext", {"value": "content"})
    x, y = b.js(f"const r = document.getElementById('{element_id}').getBoundingClientRect(); return [r.x + 20, r.y + r.height / 2]")
    b.call("Marionette:SetContext", {"value": "chrome"})
    ox, oy = b.js("const r = gBrowser.selectedBrowser.getBoundingClientRect(); return [r.x, r.y]")
    return x, y, ox, oy


def focus_content(b, hostname):
    """Point Marionette's content commands at the tab showing `hostname`."""
    b.call("Marionette:SetContext", {"value": "content"})
    handles = b.call("WebDriver:GetWindowHandles", {})
    handles = handles.get("value", handles) if isinstance(handles, dict) else handles
    for h in handles:
        b.call("WebDriver:SwitchToWindow", {"handle": h, "focus": False})
        if b.js("return location.hostname") == hostname:
            return
    raise RuntimeError(f"no tab shows {hostname}")


def right_click_link(b):
    focus_content(b, "fieldnotes.example")
    x, y = b.js("const r = document.getElementById('link').getBoundingClientRect(); return [Math.round(r.x + 30), Math.round(r.y + r.height / 2)]")
    b._call("WebDriver:PerformActions", {"actions": [{"type": "pointer", "id": "mouse", "parameters": {"pointerType": "mouse"}, "actions": [
        {"type": "pointerMove", "x": x, "y": y, "origin": "viewport"}, {"type": "pointerDown", "button": 2}, {"type": "pointerUp", "button": 2}]}]})
    b._call("WebDriver:ReleaseActions", {})
    b.call("Marionette:SetContext", {"value": "chrome"})
    time.sleep(1.2)


def run(width, height, shots):
    server = http.server.ThreadingHTTPServer(("127.0.0.1", 0), Proxy)
    threading.Thread(target=server.serve_forever, daemon=True).start()
    port = server.server_address[1]
    prefs = {
        "network.proxy.type": 1, "network.proxy.http": "127.0.0.1", "network.proxy.http_port": port,
        "network.proxy.no_proxies_on": "", "network.proxy.allow_hijacking_localhost": True,
        "dom.security.https_only_mode": False, "browser.fixup.fallback-to-https": False,
        "identity.fxaccounts.enabled": False, "zen.tabs.vertical": True, "nyx.sidebar.mode": "expanded",
        "widget.gtk.grab-pointer": 0,
    }
    b = Browser(prefs, tokens=look.tokens("nyx-dark"), width=width, height=height, port=2867, passwords=True)
    try:
        b.start()
        time.sleep(5)
        shots(b)
    finally:
        b.stop()
        server.shutdown()


def wide(b):
    for h in ["maps.example", "weather.example", "trailkitchen.example", "peakoutfitters.example"]:
        open_tab(b, f"http://{h}/", select=False)
    open_tab(b, "http://fieldnotes.example/2026/11/water-on-the-ridge")
    b.js("for (const t of [...gBrowser.tabs]) if (!/\\.example\\//.test(t.linkedBrowser.currentURI.spec)) gBrowser.removeTab(t)")
    time.sleep(1)
    shot(b, "main")

    if not ONLY or "address" in ONLY:
        b.js("gURLBar.focus(); gURLBar.search('trail')")
        time.sleep(2)
        shot(b, "address")
        b.js("gURLBar.view.close(); gURLBar.handleRevert(); gURLBar.blur(); gBrowser.selectedBrowser.focus()")
        time.sleep(0.5)

    if not ONLY or "site-identity" in ONLY:
        b.js("gIdentityHandler.handleIdentityButtonEvent(new MouseEvent('click', { button: 0 }))")
        time.sleep(1.5)
        shot(b, "site-identity", "#identity-popup")
        close_popups(b)

    if not ONLY or "site-shield" in ONLY:
        b.js("document.getElementById('nyx-shield-button')?.dispatchEvent(new MouseEvent('click', { button: 0, bubbles: true }))")
        time.sleep(2)
        shot(b, "site-shield", "#nyx-shield-panel")
        close_popups(b)

    if not ONLY or "menu" in ONLY:
        b.js("PanelUI.show()")
        time.sleep(1.5)
        shot(b, "menu", "#appMenu-popup")
        close_popups(b)

    if not ONLY or "context" in ONLY:
        right_click_link(b)
        shot(b, "context", "#contentAreaContextMenu")
        close_popups(b)

    if not ONLY or "extensions" in ONLY:
        b.js("document.getElementById('unified-extensions-button').click()")
        time.sleep(1.5)
        shot(b, "extensions", "#unified-extensions-panel")
        close_popups(b)

    for name, url in [("addons", "about:addons"), ("settings", "about:preferences#nyxTabs")]:
        if not ONLY or name in ONLY:
            navigate(b, url)
            shot(b, name)

    if not ONLY or "newtab" in ONLY:
        b.js("(window.BrowserCommands?.openTab || window.BrowserOpenTab)()")
        time.sleep(2.5)
        b.js("gURLBar.blur(); gBrowser.selectedBrowser.focus()")
        time.sleep(0.5)
        shot(b, "newtab")


def narrow(b):
    for h in ["maps.example", "weather.example", "trailkitchen.example"]:
        open_tab(b, f"http://{h}/", select=False)
    open_tab(b, "http://fieldnotes.example/2026/11/water-on-the-ridge")
    b.js("for (const t of [...gBrowser.tabs]) if (!/\\.example\\//.test(t.linkedBrowser.currentURI.spec)) gBrowser.removeTab(t)")
    time.sleep(1)
    shot(b, "narrow")


OUT.mkdir(exist_ok=True)
if not ONLY or ONLY - {"narrow"}:
    run(1280, 800, wide)
if not ONLY or "narrow" in ONLY:
    run(800, 800, narrow)
