"""D. Mono: neutral shapes in the theme's own greys; colour only on the mark. Status
icons keep their meaning's colour. Apps sit on the Nyx satin tile in the text colour,
with the accent on one detail."""
from .common import (FOLD, FOLDER_BACK, FOLDER_FRONT, FOLDER_FRONT_OPEN, PAGE, SQUIRCLE, STATUS, colour, label,
                     linear, logo_image, make_icons, mark, mix, px, small, spec_colour, svg, text_width, w)

NAME = "D · Mono"
ABOUT = "Neutral shapes in the theme's greys; colour only on the mark."


def _greys(p):
    bg, text = p["bg"], p["text"]
    if p["light"]:
        return {"top": mix(bg, "#ffffff", 0.9), "bottom": mix(bg, text, 0.06), "back": mix(bg, text, 0.2),
                "line": mix(bg, text, 0.28), "fold": mix(bg, text, 0.14), "ink": mix(text, bg, 0.12),
                "dim": mix(text, bg, 0.4)}
    return {"top": mix(bg, text, 0.4), "bottom": mix(bg, text, 0.27), "back": mix(bg, text, 0.22),
            "line": mix(bg, text, 0.5), "fold": mix(bg, text, 0.55), "ink": mix(text, bg, 0.05),
            "dim": mix(text, bg, 0.3)}


def _face(d, g, size):
    line = '' if small(size) else f'<path d="{d}" fill="none" stroke="{g["line"]}" stroke-width="1.5"/>'
    return f'<path d="{d}" fill="url(#f)"/>' + line


def _folder(spec, p, size):
    g = _greys(p)
    m = spec.get("mark")
    col = colour(p, spec.get("colour")) if not (m and m.startswith("brand:")) else p["accent"]
    front = FOLDER_FRONT_OPEN if m == "open" else FOLDER_FRONT
    body = f'<path d="{FOLDER_BACK}" fill="{g["back"]}"/>' + _face(front, g, size)
    if m and m != "open" and not small(size):
        body += mark(m, col, 64, 73, 1.75, w(4.2, size, 1.15), on_light=p["light"])
    return svg(body, linear("f", g["top"], g["bottom"]))


def _file(spec, p, size):
    g = _greys(p)
    m = spec["mark"]
    col = spec_colour(spec, p)
    lang = m.startswith("lang:")
    body = _face(PAGE, g, size) + f'<path d="{FOLD}" fill="{g["fold"]}"/>'
    if small(size):
        if lang:
            body += mark(m, col, 64, 74, 2.3, 0)
        return svg(body, linear("f", g["top"], g["bottom"]))
    text = spec.get("label") or ""
    labelled = text and px(size) >= 48 and text_width(text, 13) < 66
    if lang:
        body += mark(m, col, 64, 66, 2.1, 0)
    else:
        body += mark(m, col, 64, 56 if labelled else 70, 1.9, w(4.2, size, 1.15))
    if labelled:
        body += label(text, 64, 97, 13, g["dim"], weight=w(2.6, size, 0.9))
    return svg(body, linear("f", g["top"], g["bottom"]))


def _device(spec, p, size):
    g = _greys(p)
    col = spec_colour(spec, p) if spec["mark"] in STATUS else g["ink"]
    rim = '' if small(size) else (f'<rect x="8.75" y="8.75" width="110.5" height="110.5" rx="27.25" fill="none" '
                                  f'stroke="{g["line"]}" stroke-width="1.5"/>')
    body = f'<rect {SQUIRCLE} fill="url(#f)"/>{rim}' + mark(spec["mark"], col, 64, 64, 3.0, w(4.8, size, 1.3))
    return svg(body, linear("f", g["top"], g["bottom"]))


def render(spec, palette, size):
    if spec["kind"] == "folder":
        return _folder(spec, palette, size)
    if spec["kind"] == "file":
        return _file(spec, palette, size)
    return _device(spec, palette, size)


def app(glyph, accent, palette):
    tile = make_icons.tile_for(palette["bg"], palette["text"], palette["light"])
    ink = palette["text"]
    has_detail = bool(glyph.get("detail"))
    back = (f'<path d="{glyph["back"]}" fill="{ink}" fill-opacity=".2"/>' if has_detail
            else f'<path d="{glyph["back"]}" fill="{accent}" fill-opacity=".8"/>')
    detail = (f'<path d="{glyph["detail"]}" fill="none" stroke="{accent}" stroke-width="5.5" stroke-linecap="round" '
              f'stroke-linejoin="round"/>') if has_detail else ""
    defs = linear("t", tile["tile_top"], tile["tile_bottom"], x2=1) + linear("i", ink, mix(ink, palette["bg"], 0.3))
    body = (f'<rect {SQUIRCLE} fill="url(#t)"/><rect x="8.5" y="8.5" width="111" height="111" rx="27.5" fill="none" '
            f'stroke="{ink}" stroke-opacity=".12"/>' + back + f'<path d="{glyph["front"]}" fill="url(#i)"/>' + detail)
    return svg(body, defs)


def logo(png, accent, palette):
    tile = make_icons.tile_for(palette["bg"], palette["text"], palette["light"])
    defs = linear("t", tile["tile_top"], tile["tile_bottom"], x2=1)
    return svg(f'<rect {SQUIRCLE} fill="url(#t)"/><rect x="8.5" y="8.5" width="111" height="111" rx="27.5" '
               f'fill="none" stroke="{palette["text"]}" stroke-opacity=".12"/>' + logo_image(png), defs)
