"""K. Frame: Umbra Tile's lines in an outlined tile of their colour instead of the satin."""
from . import umbra_like as u

NAME = "K · Frame"
ABOUT = "Umbra's lines in an outlined tile of their own colour, no satin."


def render(spec, palette, size):
    return u.render(spec, palette, size, base=u.frame)


def _tile(p, accent):
    defs, body = u.frame(p, accent, "scalable")
    return defs, body, p["bg"]


def app(glyph, accent, palette):
    return u.app(glyph, accent, palette, tile=_tile(palette, accent))


def logo(png, accent, palette):
    return u.logo(png, palette, tile=_tile(palette, palette["swatches"]["graphite"]))
