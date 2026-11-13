"""Umbra Tile and today's Nyx app icons, drawn by the shipped code, for comparison."""
from .common import make_icons, umbra_looks

NAME = "Umbra Tile (today)"
ABOUT = "Today's set: satin tiles with a coloured line glyph; apps on the Nyx satin tile."


def _tile(palette):
    return make_icons.tile_for(palette["bg"], palette["text"], palette["light"])


def render(spec, palette, size):
    return umbra_looks.render("tile", spec, palette, size)


def app(glyph, accent, palette):
    return make_icons.themed(glyph, accent, _tile(palette))


def logo(png, accent, palette):
    light, mid = make_icons.glyph_colors(accent)
    return make_icons.render_logo(png, light, mid, _tile(palette))
