# Moving to Theme Engine 2.0

## For app code

Nothing has to change: `nyx-theme` keeps every public name (`install`, `Style`,
`ThemePrefs`, `palette()`, `look()`, `all()`, `read_suite()`, `subscribe()`, …) and
every stylesheet name. Moving an app to the new engine is a revision bump of
`nyx-design` in its `Cargo.toml`. What changes in behaviour:

| Before | Now |
|---|---|
| Each app polled the theme files once a second | Apps follow `ThemeChanged` and file monitors; no polling |
| An app's theme choice was copied to every app | An app's theme choice is that app's override; the system theme is chosen in Settings |
| `ThemePrefs.mode` / `.theme` decided an app's theme | They are read once, to start the shared choices file if there is none; the theme comes from `~/.config/nyx/theme.toml` |
| Tokyo Night was the fallback | Catppuccin Mocha is the default and the fallback |
| Colours were parsed with GTK | `nyx-theme-core` parses and mixes colours without GTK |

New calls, all optional:

- `use_shell_scope()`: shell components (always the system theme, no choice).
- `use_fixed_theme(id)`: one set theme (the login and lock screens).
- `use_adwaita()`: libadwaita's named colours in the sheet, for libadwaita widgets.
- `tokens()`, `resolved()`: the semantic tokens and metadata on screen.
- `app_override()`, `set_app_theme()`, `choose_system_theme()`,
  `choose_app_theme_for()`, `themes_changed()`, `announce()`.
- `engine::…`: the whole of `nyx-theme-core`.

Stylesheets may use the semantic names: `@nyx_surface_primary`,
`@nyx_text_secondary`, `@nyx_border_focus`, …, and the window properties
`--nyx-space-*`, `--nyx-control-height`, `--nyx-focus-width`, `--nyx-motion-*`,
`--nyx-easing-*`.

## Token mapping

The established names are generated from the semantic tokens, so both always agree.

| Established | Token |
|---|---|
| `bg` / `@theme_bg` | `surface.primary` |
| `panel` | `surface.secondary` |
| `card` | `surface.tertiary` |
| `raised` | `surface.elevated` |
| `popover` | `surface.overlay` |
| `surface` | `surface.alternate` |
| `text` | `text.primary` |
| `dim_text` | `text.secondary` |
| `text_tertiary` | `text.tertiary` |
| `on_accent` | `text.onAccent` |
| `border` | `border.default` |
| `divider` | `border.subtle` |
| `muted` | `border.strong` |
| `accent` | `accent.primary` |
| `glow` | `accent.secondary` |
| `highlight` | `state.selected` |
| `success`, `warning`, `danger` | `status.success`, `status.warning`, `status.error` |
| `shadow` | `shadow.color` |

New tokens without an established name: `surface.inverse`, `text.disabled`,
`text.inverse`, `border.focus`, `accent.hover`, `accent.pressed`, `accent.subtle`,
`state.hover`, `state.pressed`, `state.disabled`, `status.info`, `scrim.color`,
`selection.background`, `selection.foreground`.

## For Quickshell components

Import `Nyx.Theme` (`QML_IMPORT_PATH` includes `/run/current-system/sw/share/nyx/qml`
on NyxOS) and bind to `NyxTheme.colors.*`, `.radius.*`, `.spacing.*`,
`.typography.*`, `.motion.*`. Use `Behavior on color { ThemeTransition {} }` for
theme changes. Don't read `colors.toml` or theme files. A component that must also
run where the module isn't installed (Omarchy) carries a copy beside its QML and
imports it by folder (`import "Nyx/Theme"`), as Nyx Assistant's HUD does, refreshed
from nyx-design by its `scripts/update-nyx-theme-qml.sh`. Omarchy shell plugins (Nyx
Biometrics' sign-in overlays, Assistant's panel) take the Omarchy shell's own colours,
which on Omarchy are the system theme.

## For users

- `~/.config/nyx/theme.toml` keeps working; new keys appear only when used
  (`[applications.…]`, `[tokens]`).
- Theme files in `~/.config/nyx/themes` keep working as schema 1.
- Apps' own `settings.toml` theme keys are no longer read for the theme. They were
  copies of the shared choice (every change was copied both ways), so no app ends up
  with an override it didn't have.
- On Omarchy nothing visible changes: Nyx apps still follow the Omarchy theme.

## Known leftovers

- `nyx-files` keeps its own theme module (`src/ui/theme.rs`: source-view schemes,
  document colours) on top of `nyx-theme`; its colours come from
  `suite_theme("files")` and it restyles on `on_change`, so it follows the engine.
- NyxOS's build-time colours come from `builtin-themes.json`: Limine's menu in the
  boot theme, the session's defaults (Hyprland's borders before nyx-themed runs, the
  prompt's first colours) in the system theme. The zsh prompt then follows each
  person's theme live, from a file nyx-themed writes.
- Every Nyx app is on 2.0. A branch made before the move (and an app that pins an
  older `nyx-design`) keeps the 1.x engine: it polls, reads the same `theme.toml` so
  it stays in step for every built-in theme, and shows its own fallback for an
  installed (schema 2) system theme until it bumps.
