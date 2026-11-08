# The system logo

One logo for the whole desktop, drawn in the theme's colours: the Nyx mark until
another is set. It changes with the theme like every other colour.

## Setting it

- **NyxOS:** Settings → Boot & Sign-in → System logo. It is a system setting (the
  System Manager keeps it in `/etc/nyxos/overrides/system.json`, applied with a
  rebuild) and NyxOS installs it as `/etc/nyx/logo.svg` or `.png`.
- **Omarchy, or for one person:** Settings → Appearance → Logo, or
  `nyx-theme logo set FILE`; it is written to `~/.config/nyx/logo.svg` or `.png`
  and wins over the system's. `nyx-theme logo reset` goes back.

The first found is used: `$NYX_LOGO`, `~/.config/nyx/logo.*`, `/etc/nyx/logo.*`, the
Nyx mark.

## Making a logo that follows the theme

Draw the parts that should take the theme's colour in `currentColor`, as the Nyx
mark draws its rim:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <circle cx="32" cy="32" r="28" fill="currentColor"/>
  <path d="…" fill="#ffffff"/>
</svg>
```

The engine sets the root's `color` to the theme's `brand.logo` token: the accent,
unless a theme sets its own (`"brand.logo" = "palette.lavender"` in `[tokens]`).
Everything else keeps its colours. A PNG logo, or an SVG without `currentColor`, is
shown as it is.

Limits: SVG up to 512 KB, PNG up to 2 MB. An SVG can't contain scripts, foreign
content, entities, event handlers, or links to anything outside the file (only
`#fragment` references and embedded `data:image/` pictures).

The Nyx mark switches to its small version below 48 px; a custom logo is drawn the
same at every size.

## Using it

| Where | How |
|---|---|
| GTK apps | `nyx_ui::widgets::logo(size)`: an image that repaints on theme and logo changes. Lower level: `nyx_theme::logo_texture(size, scale)`, `nyx_theme::logo()`. |
| Quickshell | `Image { source: NyxTheme.logo.source; sourceSize.width: 64; sourceSize.height: 64 }` |
| Anything else | `nyx-theme logo svg [--theme ID] [--size PX]` prints the logo in a theme's colours; the published snapshot has it as `logo.svg` beside `system.json` |
| Boot splash | `nyx-plymouth` draws it into each theme's splash in that theme's colours |
| Sign-in screen | Nyx Greeter draws it in the login theme's colours |

GTK stylesheets can use its colour as `@nyx_brand_logo`.
