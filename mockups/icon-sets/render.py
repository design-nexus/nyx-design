#!/usr/bin/env python3
"""Check every icon set against Umbra's catalog and the Nyx app glyphs, then write the
mockup pages (pages/<set>-<view>-<dark|light>.html) that render.sh photographs.

    render.py            check, then write the pages
    render.py --check    only the check
"""
import base64
import json
import re
import shutil
import subprocess
import sys
import xml.etree.ElementTree as ET
from concurrent.futures import ThreadPoolExecutor
from html import escape
from pathlib import Path

sys.dont_write_bytecode = True
HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))

from sets import colour_tile, common, frame, mono, paper, tinted, umbra_tile  # noqa: E402

SETS = [("umbra", umbra_tile), ("tinted", tinted), ("frame", frame), ("colour-tile", colour_tile),
        ("mono", mono), ("paper", paper)]
FIXED = [16, 22, 24, 32, 48]
P = common.umbra_palette
OMARCHY = Path("/usr/share/omarchy/themes")
THEMES = {"dark": ["tokyo-night", "gruvbox", "retro-82"], "light": ["catppuccin-latte", "rose-pine", "flexoki-light"]}
GLYPHS = json.loads((common.NYX_ICONS / "app-glyphs.json").read_text())
LOGO = Path("/usr/share/icons/hicolor/128x128/apps/firefox.png").read_bytes()

INDEX = {}
for _ctx, _names, _spec in common.catalog.full_colour():
    for _n in _names:
        INDEX.setdefault(_n, _spec)
    if (_spec.get("mark") or "").startswith("lang:"):
        INDEX[_spec["mark"]] = _spec


def nyx(mode):
    return dict(P.NYX_LIGHT if mode == "light" else P.NYX_DARK)


def omarchy(name):
    p = P.from_omarchy(OMARCHY / name / "colors.toml")
    p["name"] = name.replace("-", " ").title()
    return p


# ---------- The check ----------

def problems(text):
    """What's wrong with one icon's SVG, if anything."""
    try:
        root = ET.fromstring(text)
    except ET.ParseError as error:
        return [f"not valid XML: {error}"]
    found = []
    if root.tag != "{http://www.w3.org/2000/svg}svg" or root.get("viewBox") != "0 0 128 128":
        found.append("not a 128 px SVG")
    ids = {el.get("id") for el in root.iter() if el.get("id")}
    missing = set(re.findall(r"url\(#([\w-]+)\)", text)) - ids
    if missing:
        found.append(f"refers to missing {sorted(missing)}")
    if re.search(r"\b(None|nan|inf)\b", text):
        found.append("has an unset value")
    return found


def marks_kept(spec, text):
    """Brand and language marks must be drawn exactly as Umbra draws them."""
    m = spec.get("mark") or ""
    if m.startswith("brand:") and m != "brand:github":
        return common.BRAND[m[6:]] in text
    if m.startswith("lang:"):
        return common.LANG[m[5:]][0]() in text
    return True


def rsvg(text, size):
    r = subprocess.run(["rsvg-convert", "-w", str(size), "-h", str(size)], input=text.encode(),
                       capture_output=True)
    return r.returncode == 0 and r.stdout.startswith(b"\x89PNG")


def check():
    palettes = [nyx("dark"), nyx("light")] + [omarchy(d.name) for d in sorted(OMARCHY.iterdir())
                                              if (d / "colors.toml").is_file()]
    entries = common.catalog.full_colour()
    failures, count, librsvg = [], 0, []
    for key, mod in SETS:
        for p in palettes:
            for _ctx, names, spec in entries:
                for size in FIXED + ["scalable"]:
                    text = mod.render(spec, p, size)
                    count += 1
                    for issue in problems(text):
                        failures.append(f"{key} {p['name']} {names[0]} @{size}: {issue}")
                    if size == "scalable" and not marks_kept(spec, text):
                        failures.append(f"{key} {p['name']} {names[0]}: brand or language mark changed")
                    if p["name"] in ("Nyx Dark", "Nyx Light") and size in (16, "scalable"):
                        librsvg.append((f"{key} {p['name']} {names[0]} @{size}", text, 16 if size == 16 else 96))
            for gid, g in GLYPHS.items():
                text = mod.app(g, common.app_accent(g, p), p)
                count += 1
                for issue in problems(text):
                    failures.append(f"{key} {p['name']} app {gid}: {issue}")
                if p["name"] in ("Nyx Dark", "Nyx Light"):
                    librsvg.append((f"{key} {p['name']} app {gid}", text, 48))
            text = mod.logo(LOGO, p["swatches"]["graphite"], p)
            count += 1
            failures += [f"{key} {p['name']} logo: {issue}" for issue in problems(text)]
    if shutil.which("rsvg-convert"):
        with ThreadPoolExecutor(16) as pool:
            for (name, _t, _s), ok in zip(librsvg, pool.map(lambda job: rsvg(job[1], job[2]), librsvg)):
                if not ok:
                    failures.append(f"{name}: librsvg can't draw it")
    else:
        print("rsvg-convert is missing: librsvg drawing not checked", file=sys.stderr)
    print(f"Checked {count} icons in {len(SETS)} sets x {len(palettes)} palettes "
          f"({len(entries)} catalog entries x {len(FIXED) + 1} sizes, {len(GLYPHS)} app glyphs and a logo each); "
          f"{len(librsvg)} drawn with librsvg.")
    for failure in failures[:40]:
        print("  " + failure)
    if failures:
        print(f"{len(failures)} problems.")
    return not failures


# ---------- Pages ----------

def render_size(shown):
    if shown >= 56:
        return "scalable"
    return next((s for s in FIXED if s >= shown), 48)


def img(svg, shown):
    data = base64.b64encode(svg.encode()).decode()
    return f'<img src="data:image/svg+xml;base64,{data}" width="{shown}" height="{shown}" alt="">'


def icon(mod, name, p, shown):
    return img(mod.render(INDEX[name], p, render_size(shown)), shown)


def app_icon(mod, gid, p, shown):
    if gid == "firefox":
        return img(mod.logo(LOGO, p["swatches"]["graphite"], p), shown)
    g = GLYPHS[gid]
    return img(mod.app(g, common.app_accent(g, p), p), shown)


def css(p):
    mix = common.mix
    bg, text = p["bg"], p["text"]
    return (f':root{{--bg:{bg};--text:{text};--dim:{mix(text, bg, 0.42)};--card:{mix(bg, text, 0.045)};'
            f'--raised:{mix(bg, text, 0.08)};--border:{mix(bg, text, 0.1)};--accent:{p["accent"]};'
            f'--desk:{mix(bg, "#000000", 0.25) if not p["light"] else mix(bg, text, 0.08)}}}')


BASE = """
* { box-sizing: border-box; margin: 0; }
html, body { width: 1280px; height: 800px; overflow: hidden; }
body { background: var(--bg); color: var(--text); font: 400 13px/1.4 Inter, "Inter Variable", sans-serif; }
header { display: flex; align-items: baseline; gap: 12px; padding: 22px 32px 6px; }
header b { font-size: 18px; font-weight: 600; letter-spacing: -.01em; }
header span { color: var(--dim); }
header em { margin-left: auto; color: var(--dim); font-style: normal; font-size: 12px; }
h3 { font-size: 11px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; color: var(--dim); margin: 0 0 6px; }
.row { display: flex; gap: 2px; }
.cell { width: 98px; display: flex; flex-direction: column; align-items: center; gap: 5px; }
.cell span { font-size: 11.5px; color: var(--text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 96px; }
img { display: block; }
"""

APPS = [("Files", "Files"), ("Notes", "Notes"), ("Mail", "Mail"), ("Music", "Music"), ("Photos", "Photos"),
        ("Calendar", "Calendar"), ("Settings", "Settings"), ("Git", "Git"), ("Weather", "Weather"),
        ("Passwords", "Passwords"), ("firefox", "Firefox (logo)")]
FOLDERS = [("folder", "Folder"), ("user-home", "Home"), ("user-desktop", "Desktop"), ("folder-documents", "Documents"),
           ("folder-download", "Downloads"), ("folder-pictures", "Pictures"), ("folder-music", "Music"),
           ("folder-videos", "Videos"), ("folder-projects", "Projects"), ("folder-games", "Games"),
           ("folder-dropbox", "Dropbox"), ("folder-google-drive", "Google Drive")]
FILES = [("text-x-generic", "Text"), ("application-pdf", "PDF"), ("x-office-document", "Document"),
         ("x-office-spreadsheet", "Spreadsheet"), ("x-office-presentation", "Slides"), ("image-x-generic", "Image"),
         ("video-x-generic", "Video"), ("audio-x-generic", "Audio"), ("package-x-generic", "Archive"),
         ("font-x-generic", "Font"), ("application-epub+zip", "E-book"), ("application-x-executable", "Program")]
CODE = [("lang:rust", "Rust"), ("lang:python", "Python"), ("lang:javascript", "JavaScript"),
        ("lang:typescript", "TypeScript"), ("lang:go", "Go"), ("lang:c", "C"), ("lang:html", "HTML"),
        ("lang:css", "CSS"), ("lang:json", "JSON"), ("lang:markdown", "Markdown"), ("lang:nix", "Nix"),
        ("lang:shell", "Shell")]
DEVICES = [("drive-harddisk", "Disk"), ("drive-removable-media", "USB drive"), ("computer-laptop", "Laptop"),
           ("phone", "Phone"), ("camera-photo", "Camera"), ("audio-headphones", "Headphones"),
           ("input-gaming", "Gamepad"), ("printer", "Printer"), ("network-wireless", "Wi-Fi"),
           ("dialog-warning", "Warning"), ("user-trash-full", "Trash"), ("utilities-terminal", "Terminal")]


def page(title, p, body, extra_css=""):
    return (f'<!doctype html><html><head><meta charset="utf-8"><title>{escape(title)}</title>'
            f'<style>{css(p)}{BASE}{extra_css}</style></head><body>{body}</body></html>\n')


def head(mod, p, view):
    return f'<header><b>{escape(mod.NAME)}</b><span>{escape(view)}</span><em>{escape(p["name"])}</em></header>'


def overview(mod, p):
    def row(title, items, draw):
        cells = "".join(f'<div class="cell">{draw(k)}<span>{escape(n)}</span></div>' for k, n in items)
        return f'<section><h3>{title}</h3><div class="row">{cells}</div></section>'
    body = head(mod, p, mod.ABOUT) + '<main>' + "".join([
        row("Apps", APPS, lambda k: app_icon(mod, k, p, 64)),
        row("Folders", FOLDERS, lambda k: icon(mod, k, p, 64)),
        row("Files", FILES, lambda k: icon(mod, k, p, 64)),
        row("Code", CODE, lambda k: icon(mod, k, p, 64)),
        row("Devices and status", DEVICES, lambda k: icon(mod, k, p, 64)),
    ]) + '</main>'
    extra = "main { padding: 8px 40px; display: grid; gap: 14px; } .row { gap: 4px; }"
    return page(f"{mod.NAME} overview", p, body, extra)


SIDEBAR = [("Places", [("user-home", "Home"), ("user-desktop", "Desktop"), ("folder-documents", "Documents"),
                       ("folder-download", "Downloads"), ("folder-pictures", "Pictures"), ("folder-music", "Music"),
                       ("folder-videos", "Videos"), ("folder-projects", "Projects")]),
           ("Cloud", [("folder-dropbox", "Dropbox"), ("folder-proton-drive", "Proton Drive")]),
           ("Devices", [("drive-harddisk-solidstate", "System"), ("drive-removable-media", "Backup"),
                        ("user-trash-full", "Trash")])]
GRID = [("user-desktop", "Desktop"), ("folder-documents", "Documents"), ("folder-download", "Downloads"),
        ("folder-music", "Music"), ("folder-pictures", "Pictures"), ("folder-videos", "Videos"),
        ("folder-projects", "Projects"), ("folder-games", "Games"), ("folder-dropbox", "Dropbox"),
        ("folder-git", "Repos"), ("folder-wallpapers", "Wallpapers"), ("folder-screenshots", "Screenshots"),
        ("application-pdf", "lease.pdf"), ("x-office-spreadsheet", "budget.xlsx"),
        ("x-office-presentation", "pitch.pptx"), ("lang:markdown", "notes.md"), ("lang:rust", "main.rs"),
        ("lang:python", "sync.py"), ("lang:nix", "flake.nix"), ("image-x-generic", "beach.jpg"),
        ("audio-x-generic", "song.flac"), ("package-x-generic", "photos.tar.zst"),
        ("application-x-cd-image", "nyxos.iso"), ("text-x-generic", "todo.txt")]
DOCK = ["Files", "Mail", "Notes", "Music", "Photos", "Calendar", "Weather", "Git", "Settings", "firefox"]


def context(mod, p):
    side = "".join(f'<h4>{g}</h4>' + "".join(
        f'<div class="item{" on" if k == "user-home" else ""}">{icon(mod, k, p, 16)}<span>{n}</span></div>'
        for k, n in items) for g, items in SIDEBAR)
    grid = "".join(f'<div class="cell">{icon(mod, k, p, 64)}<span>{escape(n)}</span></div>' for k, n in GRID)
    dock = "".join(app_icon(mod, k, p, 48) for k in DOCK)
    body = (f'<div class="desk"></div><div class="win"><div class="top"><b>Home</b><span>24 items</span>'
            f'<i>{icon(mod, "folder-saved-search", p, 16)}</i></div><aside>{side}</aside>'
            f'<div class="grid">{grid}</div></div><div class="dock">{dock}</div>'
            f'<div class="tag"><b>{escape(mod.NAME)}</b> · in Files and the dock · {escape(p["name"])}</div>')
    a, v = p["accent"], p["swatches"]["violet"]
    extra = f"""
.desk {{ position: absolute; inset: 0; background: radial-gradient(circle at 15% 20%, {a}44, transparent 45%),
  radial-gradient(circle at 85% 80%, {v}40, transparent 50%), var(--desk); }}
.win {{ position: absolute; left: 100px; top: 34px; width: 1080px; height: 640px; background: var(--bg);
  border-radius: 14px; box-shadow: 0 0 0 1px var(--border), 0 24px 60px rgba(0,0,0,.35); display: grid;
  grid-template-columns: 210px 1fr; grid-template-rows: 48px 1fr; overflow: hidden; }}
.top {{ grid-column: 1 / 3; display: flex; align-items: center; gap: 10px; padding: 0 18px 0 228px; }}
.top b {{ font-size: 14px; font-weight: 600; }} .top span {{ color: var(--dim); font-size: 12px; }}
.top i {{ margin-left: auto; opacity: .8; }}
aside {{ padding: 4px 10px; }}
aside h4 {{ font-size: 11px; font-weight: 600; color: var(--dim); margin: 10px 8px 4px; }}
.item {{ display: flex; align-items: center; gap: 9px; height: 28px; padding: 0 8px; border-radius: 7px; }}
.item.on {{ background: color-mix(in srgb, var(--accent) 18%, transparent); }}
.grid {{ display: grid; grid-template-columns: repeat(8, 1fr); gap: 10px 0; padding: 8px 14px; align-content: start;
  background: var(--card); border-top-left-radius: 12px; box-shadow: inset 1px 1px 0 var(--border); }}
.grid .cell {{ width: auto; }}
.dock {{ position: absolute; left: 50%; bottom: 14px; transform: translateX(-50%); display: flex; gap: 10px;
  padding: 8px 12px; border-radius: 20px; background: color-mix(in srgb, var(--raised) 88%, transparent);
  box-shadow: 0 0 0 1px var(--border), 0 12px 30px rgba(0,0,0,.3); }}
.tag {{ position: absolute; left: 18px; bottom: 18px; color: var(--dim); font-size: 11.5px; max-width: 300px; }}
.tag b {{ color: var(--text); font-weight: 600; }}
"""
    return page(f"{mod.NAME} in context", p, body, extra)


SIZE_ROWS = [[("folder-documents", "Documents"), ("folder-dropbox", "Dropbox"), ("application-pdf", "PDF"),
              ("lang:rust", "Rust"), ("computer-laptop", "Laptop")],
             [("dialog-warning", "Warning"), ("app:Files", "Files app"), ("app:Mail", "Mail app"),
              ("app:Settings", "Settings app"), ("app:firefox", "Firefox logo")]]
SIZES = [16, 24, 32, 48, 96]


def sizes(mod, p):
    def draw(k, s):
        return app_icon(mod, k[4:], p, s) if k.startswith("app:") else icon(mod, k, p, s)
    cols = []
    for items in SIZE_ROWS:
        heads = '<div class="lab"></div>' + "".join(f'<div class="sz">{s} px</div>' for s in SIZES)
        rows = "".join(f'<div class="lab">{escape(n)}</div>' + "".join(
            f'<div class="sz">{draw(k, s)}</div>' for s in SIZES) for k, n in items)
        cols.append(f'<div class="col">{heads}{rows}</div>')
    body = head(mod, p, "Sizes: fixed 16 to 48 px, scalable at 96. Small sizes drop fine detail.") + \
        f'<main>{"".join(cols)}</main>'
    extra = """
main { display: grid; grid-template-columns: 1fr 1fr; gap: 28px; padding: 18px 40px; }
.col { display: grid; grid-template-columns: 96px 52px 60px 70px 92px 1fr; align-items: center; row-gap: 14px;
  background: var(--card); border: 1px solid var(--border); border-radius: 14px; padding: 14px 18px; }
.lab { color: var(--dim); font-size: 12px; }
.sz { display: flex; justify-content: center; color: var(--dim); font-size: 11px; }
"""
    return page(f"{mod.NAME} sizes", p, body, extra)


THEME_ICONS = [("app:Files", ""), ("app:Mail", ""), ("app:Music", ""), ("app:Notes", ""), ("app:Photos", ""),
               ("app:Settings", ""), ("user-home", ""), ("folder-documents", ""), ("folder-download", ""),
               ("folder-pictures", ""), ("folder-music", ""), ("folder-projects", ""), ("application-pdf", ""),
               ("x-office-document", ""), ("x-office-spreadsheet", ""), ("image-x-generic", ""),
               ("lang:rust", ""), ("lang:python", ""), ("computer-laptop", ""), ("audio-headphones", ""),
               ("drive-removable-media", ""), ("input-gaming", ""), ("dialog-warning", ""), ("user-trash-full", "")]
HERO = ["folder-documents", "app:Files", "x-office-presentation"]


def themes(mod, mode):
    def draw(k, p, s):
        return app_icon(mod, k[4:], p, s) if k.startswith("app:") else icon(mod, k, p, s)
    panels = []
    for name in THEMES[mode]:
        p = omarchy(name)
        sw = "".join(f'<i style="background:{c}"></i>' for c in p["swatches"].values())
        hero = "".join(draw(k, p, 96) for k in HERO)
        grid = "".join(f'<div>{draw(k, p, 56)}</div>' for k, _ in THEME_ICONS)
        panels.append(f'<section style="{css(p)[6:-1]};background:{p["bg"]};color:{p["text"]}">'
                      f'<h2>{escape(p["name"])}</h2><div class="sw">{sw}</div><div class="hero">{hero}</div>'
                      f'<div class="g">{grid}</div></section>')
    p0 = nyx(mode)
    body = head(mod, p0, "Follows the theme: the same icons in three Omarchy themes.") + \
        f'<main>{"".join(panels)}</main>'
    extra = """
main { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; padding: 14px 32px; }
section { border-radius: 16px; padding: 16px 18px 18px; box-shadow: 0 0 0 1px var(--border); height: 690px; }
section h2 { font-size: 15px; font-weight: 600; }
.sw { display: flex; gap: 4px; margin: 8px 0 14px; } .sw i { width: 18px; height: 6px; border-radius: 3px; }
.hero { display: flex; justify-content: space-around; padding: 10px 0 26px; }
.g { display: grid; grid-template-columns: repeat(6, 1fr); row-gap: 30px; justify-items: center; }
"""
    return page(f"{mod.NAME} themes", p0, body, extra)


VIEWS = ["overview", "context", "sizes", "themes"]


def write_pages():
    out = HERE / "pages"
    out.mkdir(exist_ok=True)
    for key, mod in SETS:
        for mode in ("dark", "light"):
            p = nyx(mode)
            pages = {"overview": overview(mod, p), "context": context(mod, p), "sizes": sizes(mod, p),
                     "themes": themes(mod, mode)}
            for view, text in pages.items():
                (out / f"{key}-{view}-{mode}.html").write_text(text)
    print(f"Wrote {len(SETS) * len(VIEWS) * 2} pages to {out}")


def main():
    ok = check()
    if "--check" in sys.argv[1:]:
        return 0 if ok else 1
    write_pages()
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
