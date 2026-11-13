"""C. Colour Tile: every icon is a squircle in its swatch, holding a white folder, page or
line glyph. Brand and language marks sit on the white shape in their own colours."""
from .common import (FOLD, FOLDER_BACK, FOLDER_FRONT, FOLDER_FRONT_OPEN, LANG, PAGE, SQUIRCLE, app_tones, colour,
                     linear, logo_image, mark, placed, shade, small, spec_colour, svg, tint, w)

NAME = "C · Colour Tile"
ABOUT = "A squircle in the swatch with a white shape on it, bold and uniform."

SHAPE = 'transform="translate(64 64) scale(.62) translate(-64 -64)"'
PAGE_SHAPE = 'transform="translate(64 66) scale(.6) translate(-64 -65)"'


def _defs(col):
    return (linear("t", tint(col, 0.14), shade(col, 0.2), x2=0.6)
            + '<radialGradient id="s" cx=".2" cy=".05" r=".8"><stop offset="0" stop-color="#ffffff" stop-opacity=".28"/>'
              '<stop offset="1" stop-color="#ffffff" stop-opacity="0"/></radialGradient>')


def _tile(col, inner, size):
    rim = '' if small(size) else ('<rect x="8.75" y="8.75" width="110.5" height="110.5" rx="27.25" fill="none" '
                                  'stroke="#ffffff" stroke-opacity=".22" stroke-width="1.5"/>')
    return svg(f'<rect {SQUIRCLE} fill="url(#t)"/><rect {SQUIRCLE} fill="url(#s)"/>{rim}{inner}', _defs(col))


def _folder(spec, p, size):
    m = spec.get("mark")
    brand = bool(m and m.startswith("brand:"))
    col = p["accent"] if brand else colour(p, spec.get("colour"))
    front = FOLDER_FRONT_OPEN if m == "open" else FOLDER_FRONT
    inner = (f'<g {SHAPE}><path d="{FOLDER_BACK}" fill="#ffffff" fill-opacity=".6"/>'
             f'<path d="{front}" fill="#ffffff"/></g>')
    if m and m != "open" and not small(size):
        inner += mark(m, shade(col, 0.08), 64, 70, 1.35 if brand else 1.5, w(4.2, size, 1.1), on_light=True)
    return _tile(col, inner, size)


def _file(spec, p, size):
    m = spec["mark"]
    lang = m.startswith("lang:")
    col = spec_colour(spec, p)
    if lang and small(size):
        return svg(f'<rect {SQUIRCLE} fill="#ffffff"/>' + placed(LANG[m[5:]][0](), 16, 16, 4))
    inner = (f'<g {PAGE_SHAPE}><path d="{PAGE}" fill="#ffffff"/>'
             f'<path d="{FOLD}" fill="{tint(col, 0.45)}"/></g>')
    if not small(size):
        inner += mark(m, shade(col, 0.08), 64, 72, 1.6 if lang else 1.7, w(4.2, size, 1.1), on_light=True)
    return _tile(col, inner, size)


def _device(spec, p, size):
    col = spec_colour(spec, p)
    return _tile(col, mark(spec["mark"], "#ffffff", 64, 64, 2.9, w(5, size, 1.3)), size)


def render(spec, palette, size):
    if spec["kind"] == "folder":
        return _folder(spec, palette, size)
    if spec["kind"] == "file":
        return _file(spec, palette, size)
    return _device(spec, palette, size)


def app(glyph, accent, palette):
    hi, lo = app_tones(glyph, accent)
    detail = (f'<path d="{glyph["detail"]}" fill="none" stroke="{lo}" stroke-width="5" stroke-linecap="round" '
              f'stroke-linejoin="round"/>') if glyph.get("detail") else ""
    defs = (linear("t", hi, shade(lo, 0.12), x2=0.6) + linear("i", "#ffffff", tint(hi, 0.7))
            + '<radialGradient id="s" cx=".2" cy=".05" r=".8"><stop offset="0" stop-color="#ffffff" '
              'stop-opacity=".28"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></radialGradient>')
    body = (f'<rect {SQUIRCLE} fill="url(#t)"/><rect {SQUIRCLE} fill="url(#s)"/>'
            '<rect x="8.75" y="8.75" width="110.5" height="110.5" rx="27.25" fill="none" stroke="#ffffff" '
            'stroke-opacity=".22" stroke-width="1.5"/>'
            f'<path d="{glyph["back"]}" fill="#ffffff" fill-opacity=".38"/><path d="{glyph["front"]}" fill="url(#i)"/>'
            + detail)
    return svg(body, defs)


def logo(png, accent, palette):
    return svg(f'<rect {SQUIRCLE} fill="#ffffff"/>' + logo_image(png))
