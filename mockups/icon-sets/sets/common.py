"""What every icon set shares: Umbra's glyphs, catalog and palette, the Nyx app glyphs,
and the SVG helpers. Umbra and Nyx are read from their checkouts, never changed.

A set is a module with NAME, ABOUT and three functions, the inputs `nyx icons` and
`umbra-icons refresh` already have:

    render(spec, palette, size)   a catalog entry at 16, 22, 24, 32, 48 or "scalable"
    app(glyph, accent, palette)   an app-glyphs.json glyph in the app's accent
    logo(png, accent, palette)    a third-party logo the set doesn't recolour
"""
import base64
import importlib.util
import sys
from pathlib import Path

sys.dont_write_bytecode = True

PROJECTS = Path.home() / "Projects"
UMBRA = PROJECTS / "umbra-icons"
NYX_ICONS = PROJECTS / "nyx/assets/icons"
sys.path.insert(0, str(UMBRA))

from umbra import catalog  # noqa: E402,F401
from umbra import looks as umbra_looks  # noqa: E402,F401
from umbra import palette as umbra_palette  # noqa: E402,F401
from umbra.glyphs import BRAND, G, LANG, label, text_width  # noqa: E402,F401
from umbra.palette import colour, mix, surfaces  # noqa: E402,F401


def _load(name, path):
    spec = importlib.util.spec_from_file_location(name, path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


make_icons = _load("nyx_make_icons", NYX_ICONS / "make_icons.py")

FOLDER_BACK = umbra_looks.FOLDER_BACK
FOLDER_FRONT = umbra_looks.FOLDER_FRONT
FOLDER_FRONT_OPEN = umbra_looks.FOLDER_FRONT_OPEN
PAGE = umbra_looks.PAGE
FOLD = umbra_looks.FOLD
SQUIRCLE = 'x="8" y="8" width="112" height="112" rx="28"'
SCALABLE = 96
# Status glyphs keep their meaning's colour even in the quiet sets.
STATUS = {"info", "warning", "error", "question", "lock", "shield", "shield-warn", "shield-off", "missing"}


def px(size):
    return SCALABLE if size == "scalable" else size


def w(canvas_width, size, min_px):
    """A stroke `canvas_width` wide on the 128 canvas, but at least `min_px` on screen."""
    return max(canvas_width, min_px * 128 / px(size))


def small(size):
    return px(size) <= 22


def svg(body, defs=""):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128">'
            f'{"<defs>" + defs + "</defs>" if defs else ""}{body}</svg>\n')


def shade(col, t):
    return mix(col, "#000000", t)


def tint(col, t):
    return mix(col, "#ffffff", t)


def tones(col, light):
    """A light and a deeper version of `col` for two-tone shapes."""
    if light:
        return col, shade(col, 0.2)
    return make_icons.glyph_colors(col)


def stroke(d, col, width, opacity=None, extra=""):
    op = f' stroke-opacity="{opacity}"' if opacity is not None else ""
    return (f'<path d="{d}" fill="none" stroke="{col}" stroke-width="{width:.3f}"{op} stroke-linecap="round" '
            f'stroke-linejoin="round"{extra}/>')


def placed(inner, x, y, s):
    return f'<g transform="translate({x:g} {y:g}) scale({s:g})">{inner}</g>'


def glyph(name, col, x, y, s, canvas_width, opacity=None):
    return placed(stroke(G[name], col, canvas_width / s, opacity), x, y, s)


def brand_mark(name, on_light):
    """A cloud-drive mark. GitHub's mark is one colour by its own rules: dark on light
    surfaces, light on dark ones."""
    frag = BRAND[name]
    if name == "github" and on_light:
        frag = frag.replace("#e8e8ea", "#1f2328")
    return frag


def mark(m, col, cx, cy, s, canvas_width, on_light=False):
    """Mark `m` (a glyph, `brand:` or `lang:`) centred on (cx, cy), `s` times its 24 px size."""
    x, y = cx - 12 * s, cy - 12 * s
    if m.startswith("brand:"):
        return placed(brand_mark(m[6:], on_light), x, y, s)
    if m.startswith("lang:"):
        return placed(LANG[m[5:]][0](), x, y, s)
    return glyph(m, col, x, y, s, canvas_width)


def spec_colour(spec, palette):
    m = spec.get("mark") or ""
    if m.startswith("lang:"):
        return LANG[m[5:]][1]
    if m.startswith("brand:"):
        return palette["accent"]
    return colour(palette, spec.get("colour"))


def linear(id_, top, bottom, top_opacity=1, bottom_opacity=1, x2=0):
    return (f'<linearGradient id="{id_}" x1="0" y1="0" x2="{x2}" y2="1">'
            f'<stop offset="0" stop-color="{top}" stop-opacity="{top_opacity}"/>'
            f'<stop offset="1" stop-color="{bottom}" stop-opacity="{bottom_opacity}"/></linearGradient>')


def shadow(id_, col, opacity, blur, dy):
    """A soft drop shadow (feGaussianBlur and feOffset: librsvg and browsers both draw it)."""
    return (f'<filter id="{id_}" x="-20%" y="-20%" width="140%" height="150%">'
            f'<feGaussianBlur in="SourceAlpha" stdDeviation="{blur}"/><feOffset dy="{dy}" result="b"/>'
            f'<feFlood flood-color="{col}" flood-opacity="{opacity}"/><feComposite in2="b" operator="in"/>'
            f'<feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter>')


def blur(id_, amount):
    return (f'<filter id="{id_}" x="-40%" y="-40%" width="180%" height="180%">'
            f'<feGaussianBlur stdDeviation="{amount}"/></filter>')


# ---------- App glyphs ----------

def app_accent(glyph_spec, palette):
    """The swatch `nyx icons` gives an app without an accent of its own: the theme's
    version of the glyph's swatch."""
    return palette["swatches"][make_icons.family(glyph_spec["light"])]


def app_tones(glyph_spec, accent):
    """The glyph's light and mid colours in `accent`, as make_icons.themed picks them."""
    if accent.lower() == make_icons.SWATCHES[make_icons.family(glyph_spec["light"])]:
        return glyph_spec["light"], glyph_spec["mid"]
    return make_icons.glyph_colors(accent)


def logo_image(png, x=28, size=72):
    data = base64.b64encode(png).decode("ascii")
    return (f'<image x="{x}" y="{x}" width="{size}" height="{size}" preserveAspectRatio="xMidYMid meet" '
            f'href="data:image/png;base64,{data}"/>')
