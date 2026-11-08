//! The one place theme choices live: `~/.config/nyx/theme.toml`. It holds the
//! system theme, each app's choice (Follow System, the default, or an override),
//! and the interface preferences every app shares. Apps never keep their own copy.

use crate::v1::current_id;
use serde::{Deserialize, Serialize};
use std::collections::BTreeMap;

/// The theme NyxOS ships with, and the last resort everywhere.
pub const DEFAULT_THEME: &str = "catppuccin-mocha";

/// Where the system theme's colours come from.
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "kebab-case")]
pub enum ThemeMode {
    /// Follow the active Omarchy theme live (Omarchy only; elsewhere the theme below).
    Omarchy,
    /// Use an installed theme.
    Theme,
}

/// How one app picks its theme.
#[derive(Debug, Clone, Copy, Default, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "kebab-case")]
pub enum AppMode {
    /// The system theme, whatever it is.
    #[default]
    FollowSystem,
    /// [`AppChoice::theme`], whatever the system theme is.
    Override,
}

#[derive(Debug, Clone, Default, Serialize, Deserialize, PartialEq, Eq)]
pub struct AppChoice {
    pub mode: AppMode,
    /// The override's theme. Kept when the theme goes missing, so the override
    /// comes back with it.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub theme: Option<String>,
}

/// `~/.config/nyx/theme.toml`.
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(default)]
pub struct Suite {
    pub mode: ThemeMode,
    /// The system theme's id.
    pub theme: String,
    /// `comfortable` or `compact`.
    pub density: String,
    /// Text size as a multiple of the normal size, 0.9 to 1.25.
    pub text_scale: f64,
    /// Where apps open: `home` (their start page) or `last` (the page shown last).
    pub start: String,
    /// The accent each app was given in its settings, by swatch name (`files = "violet"`).
    pub app_accents: BTreeMap<String, String>,
    /// Each app's theme choice, by app id (`nyx-files`). An app not listed follows the system.
    #[serde(skip_serializing_if = "BTreeMap::is_empty")]
    pub applications: BTreeMap<String, AppChoice>,
    /// The user's own token values over any theme (`"accent.primary" = "#ff8800"`).
    #[serde(skip_serializing_if = "BTreeMap::is_empty")]
    pub tokens: BTreeMap<String, String>,
    /// Whether apps' own theme settings were folded into this file.
    #[serde(skip_serializing_if = "is_zero")]
    pub migrated: u32,
}

fn is_zero(v: &u32) -> bool {
    *v == 0
}

impl Default for Suite {
    fn default() -> Self {
        Self {
            mode: ThemeMode::Omarchy,
            theme: DEFAULT_THEME.into(),
            density: "comfortable".into(),
            text_scale: 1.0,
            start: "home".into(),
            app_accents: Default::default(),
            applications: Default::default(),
            tokens: Default::default(),
            migrated: 0,
        }
    }
}

/// Which part of the desktop a theme is resolved for.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum Scope<'a> {
    /// The system theme.
    System,
    /// Shell components and their plugins: always the system theme.
    Shell,
    /// A standalone app, by id (`nyx-files`): its override, else the system theme.
    App(&'a str),
}

impl Scope<'_> {
    pub fn label(&self) -> String {
        match self {
            Scope::System => "system".into(),
            Scope::Shell => "shell".into(),
            Scope::App(id) => format!("app:{id}"),
        }
    }
}

/// The shared settings, if they have been written.
pub fn read_suite() -> Option<Suite> {
    let text = std::fs::read_to_string(crate::paths::suite_file()).ok()?;
    let mut suite: Suite = toml::from_str(&text).ok()?;
    suite.theme = current_id(&suite.theme).to_owned();
    for choice in suite.applications.values_mut() {
        if let Some(t) = &mut choice.theme {
            *t = current_id(t).to_owned();
        }
    }
    Some(suite)
}

/// The shared settings, or the defaults.
pub fn suite() -> Suite {
    read_suite().unwrap_or_default()
}

/// Change the shared settings atomically. Unchanged settings aren't rewritten.
pub fn update_suite(change: impl FnOnce(&mut Suite)) -> std::io::Result<Suite> {
    let before = read_suite();
    let mut suite = before.clone().unwrap_or_default();
    change(&mut suite);
    if before.as_ref() != Some(&suite) {
        let text = toml::to_string_pretty(&suite).map_err(std::io::Error::other)?;
        nyx_core::cmd::atomic_write(&crate::paths::suite_file(), text).map_err(std::io::Error::other)?;
    }
    Ok(suite)
}

impl Suite {
    /// The app's choice, Follow System when it has none.
    pub fn app(&self, app: &str) -> AppChoice {
        self.applications.get(app).cloned().unwrap_or_default()
    }

    /// The theme `scope` asks for: `(mode, id, overridden)`. An app's override
    /// beats the system theme; the shell always takes the system theme.
    pub fn selection(&self, scope: Scope) -> (ThemeMode, String, bool) {
        if let Scope::App(app) = scope
            && let Some(choice) = self.applications.get(app)
            && choice.mode == AppMode::Override
            && let Some(theme) = &choice.theme
        {
            return (ThemeMode::Theme, current_id(theme).to_owned(), true);
        }
        (self.mode.clone(), self.theme.clone(), false)
    }

    pub fn set_override(&mut self, app: &str, theme: Option<&str>) {
        match theme {
            Some(t) => {
                self.applications.insert(app.into(), AppChoice { mode: AppMode::Override, theme: Some(t.into()) });
            }
            None => {
                self.applications.remove(app);
            }
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn apps_follow_the_system_unless_overridden() {
        let mut s = Suite { mode: ThemeMode::Theme, theme: "nord".into(), ..Suite::default() };
        assert_eq!(s.selection(Scope::App("nyx-files")), (ThemeMode::Theme, "nord".into(), false));
        s.set_override("nyx-files", Some("dracula"));
        assert_eq!(s.selection(Scope::App("nyx-files")), (ThemeMode::Theme, "dracula".into(), true));
        assert_eq!(s.selection(Scope::App("nyx-mail")).1, "nord");
        assert_eq!(s.selection(Scope::Shell).1, "nord", "the shell ignores overrides");
        s.theme = "gruvbox-dark".into();
        assert_eq!(s.selection(Scope::App("nyx-files")).1, "dracula", "an override survives a system change");
        s.set_override("nyx-files", None);
        assert_eq!(s.selection(Scope::App("nyx-files")).1, "gruvbox-dark");
    }

    #[test]
    fn old_files_still_read() {
        let s: Suite = toml::from_str("mode = \"theme\"\ntheme = \"nord\"\ndensity = \"compact\"\n[app_accents]\nfiles = \"violet\"").unwrap();
        assert_eq!(s.theme, "nord");
        assert!(s.applications.is_empty());
        let text = toml::to_string_pretty(&s).unwrap();
        assert!(!text.contains("applications") && !text.contains("migrated"), "{text}");
        let with: Suite = toml::from_str("[applications.nyx-chat]\nmode = \"override\"\ntheme = \"dracula\"").unwrap();
        assert_eq!(with.app("nyx-chat").theme.as_deref(), Some("dracula"));
        assert_eq!(Suite::default().theme, DEFAULT_THEME);
    }
}
