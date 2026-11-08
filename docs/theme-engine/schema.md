# Writing Nyx themes

A Nyx theme is a folder with a `nyx-theme.toml` (schema 2), and optionally a
licence, a preview image and wallpapers. It is data only: nothing in a theme runs.
Put it in a GitHub repository and anyone can install it from Nyx Settings
(Appearance → Install a theme) or with `nyx-theme install <url>`.

Check a theme while you write it:

```sh
nyx-theme validate path/to/my-theme      # errors, readability warnings
nyx-theme resolve --json                  # every resolved token of the active theme
```

To try it, copy the folder to `~/.local/share/nyx/themes/<id>/` (the folder name
must be the id) and choose it in Settings; apps restyle as you save.

## The manifest

```toml
schema = 2                       # required
id = "sunset"                    # required: lowercase letters, digits, dashes; unique
name = "Sunset"                  # required
author = "Your Name"
description = "Warm dusk colours."
version = "1.0.0"
appearance = "dark"              # "dark" or "light"
license = "MIT"
homepage = "https://example.com/sunset"
preview = "preview.png"          # an image in the theme folder
inherits = "catppuccin-mocha"    # start from another theme (by id)

[palette]                        # your named source colours
sun = "#ff8844"
dusk = "#1b1424"
ink = "#f2e9e4"

[tokens]                         # semantic roles: a colour or palette.<name>
"surface.primary" = "palette.dusk"
"text.primary" = "palette.ink"
"accent.primary" = "palette.sun"
```

Every key except `schema`, `id` and `name` is optional. What a theme leaves out
comes from the theme it inherits, else is derived from its colours, else from the
Nyx defaults (Catppuccin Mocha's colours, Nyx Design 2.0's sizes). Unknown keys are
errors, so typos don't go unnoticed. Keys that would run something (`hooks`,
`install`, `post_install`, `exec`, `script`, …) are refused.

Repositories may hold one theme (manifest at the root) or several (in `themes/*/`
or top-level folders); they are found in alphabetical order. A folder with an
Omarchy `colors.toml` instead is converted on install.

## Colour tokens

| Group | Tokens |
|---|---|
| Surfaces | `surface.primary` (window), `surface.secondary` (sidebar, header), `surface.tertiary` (cards), `surface.elevated` (raised controls), `surface.overlay` (menus, dialogs), `surface.alternate` (entries, alternate fill), `surface.inverse` |
| Text | `text.primary`, `text.secondary`, `text.tertiary` (hints), `text.disabled`, `text.inverse`, `text.onAccent` |
| Borders | `border.default`, `border.subtle` (lines in cards), `border.strong`, `border.focus` (the keyboard focus ring) |
| Accent | `accent.primary`, `accent.secondary`, `accent.hover`, `accent.pressed`, `accent.subtle` |
| States | `state.hover`, `state.pressed`, `state.selected`, `state.disabled` |
| Status | `status.success`, `status.warning`, `status.error`, `status.info` |
| Other | `shadow.color`, `scrim.color`, `selection.background`, `selection.foreground` |

Colours are `#rgb`, `#rrggbb`, `#rrggbbaa`, `rgb()`/`rgba()`, a basic CSS name, or
`palette.<name>`. Derived defaults: hover, pressed and subtle states are mixes of
the surface and the accent by the theme's tint strengths (`[effects] hover`,
`selection`); `text.disabled` fades `text.tertiary`; `border.focus` is the accent.

GTK stylesheets see each token as `@nyx_<group>_<name>` (`@nyx_surface_primary`,
`@nyx_text_on_accent`) and the established names (`@theme_bg`, `@theme_accent`, …)
as before; QML components as `NyxTheme.colors.surface.primary`.

## Typography

```toml
[typography]
ui = "Inter, Inter Variable"      # families, preferred first; leave out to keep the system font
mono = "JetBrains Mono"
weight = 400
heading_weight = 600

[typography.roles.heading]        # display, heading, body, caption, label, monospace
size = 1.2                        # em, relative to the interface font size (0.6–3)
weight = 600                      # 100–900
line_height = 1.25                # 0.9–2.5
letter_spacing = 0.0              # em (−0.1–0.3)
```

Sizes are relative, so the user's font size and display scaling still apply. Themes
never need to ship fonts; a family that isn't installed falls back to the next.

## Geometry, motion, effects

```toml
[geometry]
radius_small = 7        # px, 0–32
radius_card = 11
radius_dialog = 15
spacing_unit = 4        # px, 2–8; the scale is xxs…xxl = 1, 2, 3, 4, 6, 8, 12 units
control_height = 32     # px, 24–56: controls stay usable
border_width = 1        # px, 0–4
focus_width = 2         # px, 1–4: the focus ring can't be removed
padding = 12            # px, 4–32

[motion]
fast = 80               # ms, 0–2000
normal = 120
slow = 220
easing_standard = "ease-out"          # linear, ease, ease-in, ease-out, ease-in-out, cubic-bezier(…)
easing_enter = "ease-out"
easing_exit = "ease-in"

[effects]
surface = "solid"       # or "frosted": translucent where the compositor blurs
see_through = false
blended = true          # one surface: no lines between header, sidebar and content
hover = 0.07            # how much accent tints a hovered row (0–1)
selection = 0.18
surface_opacity = 1.0   # 0.5–1, a preference
shadow_intensity = 0.5
blur = false            # a preference; never required
overlay_dim = 0.45
```

Values outside their range are errors and fall back to the default. The user's
reduced-motion setting sets every duration to 0 whatever the theme says; the
high-contrast setting raises text, borders and the focus ring to readable contrast
and separates areas, over any theme.

## Accents, sections, code, icons

```toml
[swatches]        # the accents offered in each app; the same names in every theme
blue = "palette.sun"
violet = "#8b6cf0"     # names: blue, violet, pink, red, coral, amber, green, teal, graphite

[accents]         # an app's default accent: a swatch name or a colour
files = "blue"

[sections.settings]
privacy = "violet"

[syntax]          # code colours: swatch names or colours
keyword = "violet"
string = "green"
constant = "coral"
type = "amber"
preprocessor = "pink"

[icons]
pack = "nyx-icons"     # a recommendation; the icon theme stays the user's choice
file_colors = "brand"  # or "theme"
```

## Assets

```toml
[assets]
wallpapers = ["wallpapers/dusk.jpg"]
```

Allowed files: TOML, PNG, JPEG, WebP, SVG, text and Markdown, and licence/readme
files; at most 20 MB per file, 64 MB and 400 files per theme; no links. Wallpapers
are offered in Settings and never set on their own.

## Schema 1 files

The original flat format (`bg = …`, `accent = …`, `[font]`, `[shape]`,
`[material]`) keeps working, in `~/.config/nyx/themes/*.toml`. A file named like an
existing theme overrides it key by key; any other file is a theme of its own,
`custom:<file name>`. Write new themes as packages.

## Readability

Validation checks body text, secondary text, text on accents, selected text, the
focus ring, accent controls, errors and disabled controls against WCAG contrast
ratios, and reports low pairs as warnings. They don't stop a theme from working,
but Settings shows them.
