# Design

Canonical [STYLE.md](STYLE.md), GTK widgets, themes/CSS, icons, and shared playback.
Crates: nyx-theme-core (Theme Engine 2.0, no GTK), nyx-theme (its GTK adapter),
nyx-theme-cli (`nyx-theme`), nyx-ui, nyx-icons, nyx-playback, nyx-plugin-view. The
QML module is [qml/Nyx/Theme](qml/Nyx/Theme).

Theme Engine 2.0: [architecture](docs/theme-engine/architecture.md), [writing
themes](docs/theme-engine/schema.md), [D-Bus](docs/theme-engine/dbus.md),
[migration](docs/theme-engine/migration.md), [the logo](docs/theme-engine/logo.md), [audit](docs/theme-engine/audit.md),
[performance](docs/theme-engine/performance.md).

Check: `cargo check --locked --workspace`. Assets: `python3 tools/package-assets.py`.

Architecture and public API boundaries: [AGENTS.md](AGENTS.md).
