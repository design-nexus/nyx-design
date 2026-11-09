//! Where theme data lives. Every path honours the XDG variables, so a scratch
//! `XDG_CONFIG_HOME`/`XDG_DATA_HOME`/`XDG_RUNTIME_DIR` isolates a test run.
//!
//! - choices: `~/.config/nyx/theme.toml` (system theme, per-app overrides)
//! - user theme files: `~/.config/nyx/themes/*.toml`, `~/.config/<app>/themes/*.toml`
//! - installed packages: `~/.local/share/nyx/themes/<id>/` and `registry.toml` there
//! - system packages: `$XDG_DATA_DIRS/nyx/themes/<id>/` (read-only, e.g. the Nix store)
//! - resolved snapshot: `$XDG_RUNTIME_DIR/nyx/theme/`

use nyx_core::paths;
use std::path::PathBuf;

pub fn suite_file() -> PathBuf {
    paths::suite_dir().join("theme.toml")
}

/// User theme files: for every app, then for this one (a file there wins).
pub fn theme_dirs() -> [PathBuf; 2] {
    [paths::suite_dir().join("themes"), paths::custom_themes_dir()]
}

/// Installed theme packages and their registry.
pub fn installed_dir() -> PathBuf {
    paths::data_home().join("nyx/themes")
}

pub fn registry_file() -> PathBuf {
    installed_dir().join("registry.toml")
}

/// Earlier versions kept for rollback, and staging folders, out of the theme list.
pub fn previous_dir() -> PathBuf {
    installed_dir().join(".previous")
}

pub fn staging_dir() -> PathBuf {
    installed_dir().join(".staging")
}

/// Theme packages installed with the system, in `$XDG_DATA_DIRS` order.
pub fn system_dirs() -> Vec<PathBuf> {
    let dirs = std::env::var("XDG_DATA_DIRS").unwrap_or_else(|_| "/usr/local/share:/usr/share".into());
    dirs.split(':').filter(|d| d.starts_with('/')).map(|d| PathBuf::from(d).join("nyx/themes")).collect()
}

/// `$XDG_RUNTIME_DIR/nyx/theme`, else a per-user folder under the cache.
pub fn runtime_dir() -> PathBuf {
    std::env::var_os("XDG_RUNTIME_DIR")
        .map(PathBuf::from)
        .filter(|p| p.is_absolute())
        .map(|d| d.join("nyx/theme"))
        .unwrap_or_else(|| paths::cache_home().join("nyx/theme-runtime"))
}

pub fn snapshot_file() -> PathBuf {
    runtime_dir().join("system.json")
}

pub fn omarchy_dir() -> PathBuf {
    paths::omarchy_theme_dir()
}

pub fn omarchy_colors() -> PathBuf {
    paths::omarchy_colors()
}

/// The folders to watch for a change to anything a resolved theme depends on.
pub fn watched_dirs() -> Vec<PathBuf> {
    let mut dirs = vec![paths::suite_dir(), paths::suite_dir().join("themes"), installed_dir()];
    dirs.push(paths::state_home().join("omarchy/current"));
    dirs.push(paths::state_home().join("omarchy"));
    // The system logo; the user's is in the suite folder already.
    if let Some(dir) = crate::logo::system_files()[0].parent() {
        dirs.push(dir.to_path_buf());
    }
    // The system's default theme (`appearance` in NyxOS's defaults and overrides).
    let layers = nyx_config::Layers::standard();
    dirs.push(layers.defaults);
    dirs.push(layers.system);
    dirs
}
