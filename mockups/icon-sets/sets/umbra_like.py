"""Umbra Tile's drawing, with the parts the Umbra-like sets change passed in: the tile
behind the glyph, a fill inside folder and page outlines, a glow under the lines and the
glyph's scale. Glyph positions, stroke widths and small-size rules are Umbra Tile's."""
from .common import (G, SQUIRCLE, app_tones, blur, linear, logo_image, make_icons, mark, mix, placed,
                     small, spec_colour, stroke, surfaces, svg, w)


def satin(p, col, size, shape="squircle"):
    """Umbra Tile's tile: the satin gradient, an accent glow at the top left, an accent hairline."""
    s = surfaces(p)
    return _tile(p, col, s["tile_top"], s["tile_bottom"], 0.3, shape)


def _tile(p, col, top, bottom, rim, shape="squircle"):
    glow = 0.14 if p["light"] else 0.2
    defs = (linear("t", top, bottom)
            + f'<radialGradient id="g" cx=".18" cy=".1" r=".75"><stop offset="0" stop-color="{col}" '
              f'stop-opacity="{glow}"/><stop offset="1" stop-color="{col}" stop-opacity="0"/></radialGradient>')
    if shape == "circle":
        body = ('<circle cx="64" cy="64" r="57" fill="url(#t)"/><circle cx="64" cy="64" r="57" fill="url(#g)"/>'
                f'<circle cx="64" cy="64" r="56.5" fill="none" stroke="{col}" stroke-opacity="{rim}"/>')
    else:
        body = (f'<rect {SQUIRCLE} fill="url(#t)"/><rect {SQUIRCLE} fill="url(#g)"/>'
                f'<rect x="8.5" y="8.5" width="111" height="111" rx="27.5" fill="none" stroke="{col}" '
                f'stroke-opacity="{rim}"/>')
    return defs, body


def tinted(p, col, size, shape="squircle"):
    """The satin tile washed with the icon's own colour."""
    s = surfaces(p)
    top, bottom = (mix(s["tile_top"], col, 0.1), mix(s["tile_bottom"], col, 0.16)) if p["light"] else \
        (mix(s["tile_top"], col, 0.2), mix(s["tile_bottom"], col, 0.1))
    return _tile(p, col, top, bottom, 0.42, shape)


def frame(p, col, size, shape="squircle"):
    """No satin: the tile's outline in the icon's colour over a faint wash of it."""
    width = w(3, size, 1)
    return "", (f'<rect x="10" y="10" width="108" height="108" rx="27" fill="{col}" fill-opacity=".07" '
                f'stroke="{col}" stroke-opacity=".6" stroke-width="{width:.2f}"/>')


def _lines(name, col, cx, cy, s, width, size, fill, glow):
    x, y = cx - 12 * s, cy - 12 * s
    out = ""
    if glow and not small(size):
        out += f'<g filter="url(#h)" opacity=".75">' + placed(stroke(G[name], col, width * 1.8 / s), x, y, s) + '</g>'
    inner = f'<path d="{G[name]}" fill="{col}" fill-opacity="{fill}"/>' if fill else ""
    return out + placed(inner + stroke(G[name], col, width / s), x, y, s)


def _mark(m, col, cx, cy, s, width, size, glow, light):
    if m.startswith(("brand:", "lang:")):
        return mark(m, col, cx, cy, s, 0, on_light=light)
    return _lines(m, col, cx, cy, s, width, size, 0, glow)


def render(spec, p, size, base=satin, fill=0, glow=False, scale=1.0, shape="squircle"):
    kind, m = spec["kind"], spec.get("mark")
    col = spec_colour(spec, p)
    outline = w(6, size, 1.3)
    inner = w(3.8, size, 1.15)
    tile_col = col
    if kind == "folder":
        brand = bool(m and m.startswith("brand:"))
        if brand:
            col, tile_col = surfaces(p)["neutral"], p["accent"]
        if m == "open":
            body = _lines("folder-open", col, 64, 62, 3.5, outline, size, fill, glow)
        else:
            body = _lines("folder", col, 64, 62, 3.5, outline, size, fill, glow)
            if m and not small(size):
                body += _mark(m, col, 63 if brand else 64, 69, 1.42, inner, size, glow, p["light"])
    elif kind == "file":
        if m.startswith("lang:") and small(size):
            body = mark(m, col, 64, 64, 3.5, inner)
        else:
            body = _lines("page", col, 64.2, 61.2, 3.6, outline, size, fill, glow)
            if not small(size):
                body += mark(m, col, 63.8, 66.8, 1.9, 0) if m.startswith("lang:") else \
                    _mark(m, col, 63.2, 69.2, 1.6, inner, size, glow, p["light"])
    else:
        body = _lines(m, col, 64, 64, 3, w(4.8, size, 1.3), size, 0, glow)
    if scale != 1:
        body = f'<g transform="translate(64 64) scale({scale}) translate(-64 -64)">{body}</g>'
    defs, back = base(p, tile_col, size, shape)
    if glow and not small(size):
        defs += blur("h", 3.5)
    return svg(back + body, defs)


# ---------- Apps ----------

def nyx_tile(p, accent, shape="squircle"):
    """The Nyx app tile (make_icons.tile_for), as a body and its cut colour."""
    t = make_icons.tile_for(p["bg"], p["text"], p["light"])
    defs, body = _tile(p, accent, t["tile_top"], t["tile_bottom"], 0.3, shape)
    return defs, body, t["cut"]


def app(glyph, accent, p, tile=None, glow=False, lines=False, scale=1.0):
    """An app glyph in the make_icons layers (a 35% back, a light-to-mid front, the detail
    cut in), or as lines with a soft fill, on `tile` (defs, body, cut colour)."""
    hi, lo = app_tones(glyph, accent)
    defs, base, cut = tile or nyx_tile(p, accent)
    detail = glyph.get("detail")
    if lines:
        glyph_body = (f'<path d="{glyph["back"]}" fill="{hi}" fill-opacity=".12" stroke="{hi}" stroke-opacity=".5" '
                      f'stroke-width="3" stroke-linejoin="round"/>'
                      f'<path d="{glyph["front"]}" fill="{hi}" fill-opacity=".2" stroke="{hi}" stroke-width="4.5" '
                      f'stroke-linejoin="round"/>'
                      + (stroke(detail, hi, 4.5) if detail else ""))
    else:
        glyph_body = (f'<path d="{glyph["back"]}" fill="{hi}" fill-opacity=".35"/>'
                      f'<path d="{glyph["front"]}" fill="url(#i)"/>' + (stroke(detail, cut, 5) if detail else ""))
        defs += linear("i", hi, lo, x2=1)
    if glow:
        glyph_body = (f'<g filter="url(#h)" opacity=".7"><path d="{glyph["front"]}" fill="{hi}"/></g>' + glyph_body)
        defs += blur("h", 5)
    if scale != 1:
        glyph_body = f'<g transform="translate(64 64) scale({scale}) translate(-64 -64)">{glyph_body}</g>'
    return svg(base + glyph_body, defs)


def logo(png, p, tile=None):
    defs, base, _cut = tile or nyx_tile(p, p["swatches"]["graphite"])
    return svg(base + logo_image(png), defs)
