"""E. Paper: soft paper in pastel tints of the swatch, with a crisp fold, a sheet peeking
out of each folder and a gentle shadow. On dark themes the paper is a raised surface."""
from .common import (FOLD, FOLDER_BACK, FOLDER_FRONT, FOLDER_FRONT_OPEN, LANG, PAGE, app_tones, colour,
                     label, linear, logo_image, mark, mix, placed, px, shade, shadow, small, spec_colour, svg,
                     text_width, tint, tones, w)

NAME = "E · Paper"
ABOUT = "Pastel paper with a crisp fold and a gentle shadow; raised surfaces on dark themes."


def _paper(p):
    bg, text = p["bg"], p["text"]
    if p["light"]:
        return {"top": "#ffffff", "bottom": mix(bg, text, 0.03), "sheet": "#ffffff", "edge": mix(bg, text, 0.14),
                "shadow": ("#000000", 0.18)}
    return {"top": mix(bg, text, 0.24), "bottom": mix(bg, text, 0.17), "sheet": mix(bg, text, 0.62),
            "edge": mix(bg, text, 0.32), "shadow": ("#000000", 0.55)}


def _ink(col, p):
    return shade(col, 0.28) if p["light"] else tint(col, 0.4)


def _wrap(body, defs, p, size):
    if small(size):
        return svg(body, defs)
    col, op = _paper(p)["shadow"]
    return svg(f'<g filter="url(#o)">{body}</g>', defs + shadow("o", col, op, 3, 3))


def _folder(spec, p, size):
    pp = _paper(p)
    m = spec.get("mark")
    brand = bool(m and m.startswith("brand:"))
    col = p["accent"] if brand else colour(p, spec.get("colour"))
    front = FOLDER_FRONT_OPEN if m == "open" else FOLDER_FRONT
    t_top, t_bottom = (0.62, 0.52) if p["light"] else (0.62, 0.7)
    body = f'<path d="{FOLDER_BACK}" fill="{mix(col, pp["top"], 0.42)}"/>'
    if not small(size):
        body += (f'<rect x="22" y="27" width="84" height="44" rx="4" fill="{pp["sheet"]}" stroke="{pp["edge"]}" '
                 f'stroke-width="1" transform="rotate(-3 64 50)"/>')
    body += f'<path d="{front}" fill="url(#f)"/>'
    if not small(size) and m != "open":
        body += '<path d="M17 37.5h94a8.5 8.5 0 0 1 8.5 8.5" fill="none" stroke="#ffffff" stroke-opacity=".5" stroke-width="1.5"/>'
    if m and m != "open" and not small(size):
        if brand:
            body += f'<rect x="43" y="52" width="42" height="42" rx="12" fill="{pp["top"]}"/>'
            body += mark(m, col, 64, 73, 1.45, 0, on_light=p["light"])
        else:
            body += mark(m, _ink(col, p), 64, 73, 1.7, w(4, size, 1.15))
    defs = linear("f", mix(col, pp["top"], t_top), mix(col, pp["top"], t_bottom))
    return _wrap(body, defs, p, size)


def _file(spec, p, size):
    pp = _paper(p)
    m = spec["mark"]
    lang = m.startswith("lang:")
    if lang and small(size):
        return svg(placed(LANG[m[5:]][0](), 4, 4, 5))
    col = spec_colour(spec, p)
    tinted = pp["top"] if lang else mix(col, pp["top"], 0.9)
    body = (f'<path d="{PAGE}" fill="url(#f)"/><path d="{PAGE}" fill="none" stroke="{pp["edge"]}" stroke-width="1"/>'
            f'<path d="{FOLD}" fill="{mix(col, pp["top"], 0.45)}"/>')
    text = spec.get("label") or ""
    if not small(size):
        labelled = text and px(size) >= 48 and text_width(text, 13) < 66
        if lang:
            body += mark(m, col, 64, 70, 2.1, 0)
        else:
            body += mark(m, _ink(col, p), 64, 56 if labelled else 70, 1.9, w(4.2, size, 1.15))
            if labelled:
                body += label(text, 64, 97, 13, _ink(col, p), weight=w(2.6, size, 0.9))
    return _wrap(body, linear("f", tinted, mix(col, pp["bottom"], 0.94)), p, size)


def _device(spec, p, size):
    pp = _paper(p)
    col = spec_colour(spec, p)
    body = (f'<rect x="12" y="12" width="104" height="104" rx="26" fill="url(#f)"/>'
            f'<rect x="12.5" y="12.5" width="103" height="103" rx="25.5" fill="none" stroke="{pp["edge"]}"/>'
            + mark(spec["mark"], _ink(col, p), 64, 64, 2.8, w(5, size, 1.3)))
    return _wrap(body, linear("f", mix(col, pp["top"], 0.88), mix(col, pp["bottom"], 0.8)), p, size)


def render(spec, palette, size):
    if spec["kind"] == "folder":
        return _folder(spec, palette, size)
    if spec["kind"] == "file":
        return _file(spec, palette, size)
    return _device(spec, palette, size)


def _card(accent, p):
    pp = _paper(p)
    defs = linear("c", mix(accent, pp["top"], 0.92), mix(accent, pp["bottom"], 0.84))
    body = (f'<rect x="10" y="10" width="108" height="108" rx="27" fill="url(#c)"/>'
            f'<rect x="10.5" y="10.5" width="107" height="107" rx="26.5" fill="none" stroke="{pp["edge"]}"/>')
    return body, defs


def app(glyph, accent, palette):
    hi, lo = tones(accent, True) if palette["light"] else app_tones(glyph, accent)
    card, defs = _card(accent, palette)
    detail = (f'<path d="{glyph["detail"]}" fill="none" stroke="{_paper(palette)["top"]}" stroke-width="5" '
              f'stroke-linecap="round" stroke-linejoin="round"/>') if glyph.get("detail") else ""
    body = (card + f'<path d="{glyph["back"]}" fill="{hi}" fill-opacity=".35"/>'
            f'<path d="{glyph["front"]}" fill="url(#i)"/>' + detail)
    return _wrap(body, defs + linear("i", hi, lo, x2=1), palette, "scalable")


def logo(png, accent, palette):
    card, defs = _card(palette["swatches"]["graphite"], palette)
    return _wrap(card + logo_image(png), defs, palette, "scalable")
