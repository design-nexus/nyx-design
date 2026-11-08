# Theme Engine 2.0: D-Bus interface

`nyx-themed` owns **`io.github.design_nexus.nyx.Theme`** on the session bus and
serves **`io.github.design_nexus.nyx.Theme1`** at
**`/io/github/design_nexus/nyx/Theme`**. On NyxOS the name is D-Bus activated
(`nyx-themed.service`, `Type=dbus`).

Clients don't need the service: they resolve themes with `nyx-theme-core`, and any
program that changes a choice also emits `ThemeChanged` itself (from no well-known
name), so subscribe by interface, path and member, never by sender.

## Signal

```
ThemeChanged(t generation, s system_theme, s scope, s reason, u schema)
```

| Field | Meaning |
|---|---|
| `generation` | Increases with every published change; apply each once, ignore older ones |
| `system_theme` | The system theme's id (`omarchy` when following Omarchy's) |
| `scope` | `system`, `applications` (an app override changed), `app:<id>`, `themes` (installed, updated or removed), `shell` |
| `reason` | `theme-selected`, `override-set`, `override-cleared`, `theme-installed`, `theme-updated`, `theme-removed`, `theme-imported`, `reset`, `files-changed`, `omarchy-theme-set`, `start`, `sync` |
| `schema` | The theme schema version the publisher reads (2) |

The signal carries no theme data. Fetch or resolve the theme for your scope:
`ResolveEffectiveTheme`, the snapshot file, or `nyx_theme_core::resolve_effective_theme`.

## Methods

| Method | Returns |
|---|---|
| `ListThemes()` | `s`: JSON array of theme metadata |
| `GetThemeMetadata(s id)` | `s`: JSON metadata |
| `GetActiveTheme()` | `s`: the system theme's id |
| `GetGeneration()` | `t`: the newest generation published |
| `GetSnapshotPath()` | `s`: the snapshot file |
| `ResolveEffectiveTheme(s app_id)` | `s`: JSON snapshot for the app (`""` for the system) |
| `SetSystemTheme(s id)` | Refused (error) for a theme with errors |
| `SetAppOverride(s app_id, s id)` | |
| `ClearAppOverride(s app_id)` | |
| `InstallTheme(s repository_url)` | `as`: ids installed (every theme in the repository that passes its checks) |
| `UpdateTheme(s id)` | `s`: `up-to-date` or `updated <from> <to>` |
| `RemoveTheme(s id)` | Refused for built-in and system themes |
| `Reset()` | Appearance back to the defaults |

Property: `Generation` (`t`).

Errors are `org.freedesktop.DBus.Error.Failed` with a message for people.

## Snapshot

`$XDG_RUNTIME_DIR/nyx/theme/system.json` (format 1): `generation`, `scope`,
`reason`, `theme {id, name, appearance, origin}`, `tokens {colors, typography,
geometry, motion, effects}`, `legacy` (the established names), `swatches`,
`accents`, `logo {source, recolorable, path, stamp}` (the system logo in the theme's
colours, written beside it as `logo.svg`), `issues`. It is replaced atomically under a lock
(`$XDG_RUNTIME_DIR/nyx/theme/.lock`); `generation` beside it holds the counter.

## Plugins

Plugin hosts (bar, Control Center, desktop widgets) send their plugins
`{"type":"theme","theme":{"light":…,"name":…,"generation":…}}`; `generation` is new
and optional, 0 from older hosts.

## Watching from a shell

```sh
nyx-theme watch
dbus-monitor "type='signal',interface='io.github.design_nexus.nyx.Theme1'"
```
