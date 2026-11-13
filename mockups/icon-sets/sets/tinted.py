"""G. Tinted Tile: Umbra Tile with each tile washed in its icon's colour."""
from . import umbra_like as u
from .common import mix, surfaces

NAME = "G · Tinted Tile"
ABOUT = "Umbra Tile with each tile washed in its own colour."


def render(spec, palette, size):
    return u.render(spec, palette, size, base=u.tinted)


def _tile(p, accent):
    defs, body = u.tinted(p, accent, "scalable")
    return defs, body, mix(surfaces(p)["tile_bottom"], accent, 0.12)


def app(glyph, accent, palette):
    return u.app(glyph, accent, palette, tile=_tile(palette, accent))


def logo(png, accent, palette):
    return u.logo(png, palette, tile=_tile(palette, accent))
