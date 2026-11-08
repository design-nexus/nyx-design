# Theme Engine 2.0: audit of the existing theme infrastructure

Audit of every Nyx repository in `~/Projects` (November 7, 2026) before Theme
Engine 2.0. It records what each system does, what is reused, what was missing and
what had to migrate. Everything listed under "Reused" was kept; nothing that worked
was replaced without the reason given here.

## 1. Design tokens (Nyx Design 2.0)

| | |
|---|---|
| Where | `nyx-design/STYLE.md` (2.0), `crates/nyx-theme/src/base2.css`, `lib.rs` (`palette_css`, `defines2`), `themes.rs` (`look_css`) |
| Format | GTK `@define-color` names and `--nyx-*` custom properties, generated from the Rust structs `Palette` and `Look` |
| Names | `@theme_bg, _surface, _text, _dim_text, _accent, _border, _muted, _highlight, _danger, _glow, _shadow, _on_accent, _panel, _card, _raised, _popover, _text_tertiary, _divider, _warning, _success, _app_accent`; 2.0 mixes `@hairline, @divider, @nav_active, @row_hover, @lift, @lift_active, @veil, @field, @track`; `--nyx-radius-small/-card/-dialog`, `--nyx-hover`, `--nyx-selection` |
| Missing | Dotted semantic names (`surface.primary`…), `border.focus`, `status.info`, colour `state.*` tokens, spacing, control heights, border widths, motion, typography roles |

Reused: every established name stays. The engine now resolves the dotted semantic
tokens first and generates the `@theme_*` names and 2.0 mixes from them, so the
800-line 2.0 sheet and every app stylesheet keep working unchanged
(see `migration.md` for the mapping).

## 2. Theme configuration and storage

| File | Owner | Holds |
|---|---|---|
| `~/.config/nyx/theme.toml` | `nyx_theme::Suite` | `mode` (`omarchy`/`theme`), `theme`, `density`, `text_scale`, `start`, `[app_accents]` |
| `~/.config/<app>/settings.toml` | each app | its own `mode`/`theme` copy (synced both ways by `Style::set_theme`), `glow`, `reduce_motion` |
| `~/.config/nyx/themes/*.toml` | user | user themes (`custom:<stem>`) and key-by-key overrides of shipped themes |
| `~/.config/<app>/themes/*.toml` | user | the same, for one app |
| `/etc/nyxos/defaults/appearance.toml`, `/etc/nyxos/overrides`, `~/.config/nyx/appearance.toml` | `nyx-config` (nyx-system) | `theme`, `lock-theme`, `lock-style`, `wallpaper` |
| `$XDG_STATE_HOME/omarchy/current/theme/colors.toml`, `…/theme.name` | Omarchy | the active Omarchy theme |

Problem: two sources of truth for the theme (the suite file and every app's own
`settings.toml`, kept in step by a two-way sync). Theme Engine 2.0 makes
`theme.toml` the only one: the system theme plus `[applications."<slug>"]`
overrides. App files are read once for migration and never again for the theme.

## 3. Catppuccin

`crates/nyx-theme/themes/catppuccin-{mocha,macchiato,frappe,latte}.toml`, eleven
core colours each, values matching the official palette but without attribution.
The default was Tokyo Night (`Suite::default`, `fallback_palette`), and on NyxOS
`nyxos.theme.system = "nyx-dark"`. Catppuccin Mocha is now a full package with the
26 official colours, MIT attribution, and the default and fallback everywhere.

## 4. Omarchy integration

- `nyx_theme::from_omarchy_colors` maps `colors.toml` onto the palette;
  `themes::omarchy_look/_swatches/_syntax/_accents` fill the rest from Nyx Dark/Light.
  Reused unchanged as the live Follow System source on Omarchy, and as the basis
  of the new importer (which also records conversion metadata and assets).
- `nyx-settings` drives `omarchy-theme-list/-current/-set`, previews from
  `colors.toml`, and installs `~/.config/omarchy/hooks/theme-set.d/50-settings-theme`
  (`nyx-settings --theme-sync`). Reused: the hook now also refreshes the Nyx
  snapshot and announces the change.
- Direct readers outside `nyx-theme`: `nyx-files` (own engine with file monitors),
  `nyx-assistant(-auth)` Quickshell overlays, `nyx-settings` extensions
  (`common/src/sys.rs` read the legacy `~/.config/omarchy/current/theme` path; fixed).

## 5. GTK4 CSS

`nyx_theme::install(Style)` adds one `CssProvider` per display and rebuilds the
whole sheet on every change (`apply`). Colour parsing and mixing use
`gdk::RGBA`, so the token model could not be used without GTK. No libadwaita
dependency; `nyx-settings` has its own `adwaita_css` for the `nyx-goa-helper`
dialogs. Reused: the sheet assembly and `@APP@` scoping; the colour maths moved to
the GTK-free core.

## 6. Quickshell / QML

No Quickshell shell component exists (the bar, dock, Control Center, Notification
Center, switcher and widgets are GTK4 + layer-shell). QML exists only as Omarchy
shell plugins (`BarWidget.qml`, `Service.qml`, which use Omarchy's `Style`) and the
`nyx-assistant` / `nyx-biometrics` overlays, which read Omarchy's `colors.toml`
themselves. There was no `NyxTheme` singleton, `qmldir` or token file.

## 7. Nyx Settings

`sections/theme.rs` (Appearance): Omarchy theme grid, wallpaper, fonts, icons,
hyprchroma, and the Settings window's own theme. `sections/nyx.rs` ("Nyx apps"):
the suite theme, Follow Omarchy, density, text size. No per-app overrides, no
installer, no theme metadata, no reset.

## 8. Theme switching and runtime updates

- Each GTK app polls once a second (`watch_omarchy`): the `colors.toml` mtime and
  `theme.name`, the `theme.toml` mtime, and the theme folders.
- `nyx-system/apps/themed` (`nyx-themed`, NyxOS user service) watches
  `~/.config/nyx` and `omarchy/current` with `notify` and writes Hyprland, Foot,
  dconf, wallpaper, hyprlock and Umbra outputs. It linked GTK only because
  `nyx-theme` does.
- Plugins (bar, widgets, Control Center tiles) get a JSON `theme` message
  (`light`, `name`) over stdio from their host.

## 9. D-Bus and other notification services

No theme interface existed. Existing patterns: `io.github.design_nexus.nyx.Control`
(`nyx-core/src/control.rs`), `…Panel1` with an `Opened` signal
(`nyx-desktop/src/panel.rs`), `…Notifications1`, `…Bar1`, the system-bus
`io.github.nyxos_project.System`. Theme Engine 2.0 adds
`io.github.design_nexus.nyx.Theme1`, owned by `nyx-themed` (no second service).

## 10. Theme assets

Wallpapers: `nyx-wallpapers` (`wallpapers.toml` maps a theme id to its set; only
Nyx Dark has any) and `nyxos` installs them to `share/backgrounds/nyx`.
`nyx-themed` picks the user's wallpaper, else the theme's default. `nyx-themes` is
an Omarchy-format pack (Nyx Dark/Light `colors.toml`, backgrounds). Theme packages
can now carry wallpapers and a preview; the engine lists them and never sets the
wallpaper on its own.

## 11. Application-specific overrides

Only accents: `Suite.app_accents` (per-app swatch) and a theme's `[accents]` and
`[sections]`. Apps with `Style::set_theme` could hold their own theme, but every
change was copied to the suite, so in practice there were no independent overrides.

## 12. Theme repository / installer

None for themes. Reusable: `nyx-core/crates/nyx-plugin/src/install.rs` (URL
allow-list, git hardening, staging, symlink refusal, atomic install, rollback).
The Settings extension installer runs extension scripts and is not suitable.

## Compatibility constraints

- 50 repos pin `nyx-design` by git rev (12 different revs). The public API of
  `nyx-theme` stays source-compatible so any app can move to the new rev without
  code changes.
- `Style` is built with struct literals in every app; no field was added.
- The plugin protocol `ThemeInfo` only gains an optional field.
- Existing user theme files (`~/.config/nyx/themes/*.toml`) and `theme.toml` keep
  loading; the v1 flat format is a supported schema version.
- `nyxos/themes/nyx-dark.nix` (build-time colours for Limine, Plymouth, zsh) is
  stale against the crate; boot visuals are out of scope, recorded in `migration.md`.
