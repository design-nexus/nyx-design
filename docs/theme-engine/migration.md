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
theme changes. Don't read `colors.toml` or theme files. The `nyx-assistant` and
`nyx-biometrics` overlays still read Omarchy's `colors.toml` themselves and should
move to `Nyx.Theme` when they are migrated (handoff 03).

## For users

- `~/.config/nyx/theme.toml` keeps working; new keys appear only when used
  (`[applications.…]`, `[tokens]`).
- Theme files in `~/.config/nyx/themes` keep working as schema 1.
- Apps' own `settings.toml` theme keys are no longer read for the theme. They were
  copies of the shared choice (every change was copied both ways), so no app ends up
  with an override it didn't have.
- On Omarchy nothing visible changes: Nyx apps still follow the Omarchy theme.

## Known leftovers

- `nyx-files` has its own theme engine (`src/ui/theme.rs`) with file monitors; it
  should move to `nyx-theme` when it next bumps `nyx-design`.
- `nyxos/themes/nyx-dark.nix` holds build-time Nyx Dark colours (an older palette)
  for Limine's menu and the zsh prompt; they don't follow the theme yet. The boot
  splash and the sign-in screen do: they use `nyxos.theme.boot` and
  `nyxos.theme.login` (Settings → Boot & Sign-in), which default to the system theme.
- 41 other apps pin older `nyx-design` revisions; they keep the 1.x engine
  (polling, their own theme copies) until their next bump, and read the same
  `theme.toml`, so they stay in step for every built-in theme. A system theme that
  is an installed package (schema 2) is unknown to them, so they show their own
  fallback until they move to 2.0.
