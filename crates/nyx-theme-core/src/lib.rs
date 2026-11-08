//! Nyx Theme Engine 2.0, without GTK: the one implementation of themes that the
//! GTK adapter (`nyx-theme`), the QML module, the theme service (`nyx-themed`),
//! the `nyx-theme` command and Nyx Settings all share.
//!
//! - [`schema`]: the versioned theme format (schema 1 files, schema 2 packages).
//! - [`registry`]: every theme on offer, found in a fixed order.
//! - [`resolver`]: deterministic resolution to a complete [`Tokens`] set.
//! - [`config`]: the system theme and per-app overrides (`~/.config/nyx/theme.toml`).
//! - [`installer`]: installing, updating and removing themes from repositories.
//! - [`omarchy`]: Omarchy themes, live and imported.
//! - [`snapshot`] and [`dbus`]: telling running clients about changes.

pub mod color;
pub mod config;
pub mod contrast;
pub mod dbus;
pub mod installer;
pub mod layer;
pub mod model;
pub mod omarchy;
pub mod paths;
pub mod registry;
pub mod resolver;
pub mod schema;
pub mod snapshot;
pub mod tokens;
pub mod v1;

pub use config::{AppChoice, AppMode, DEFAULT_THEME, Scope, Suite, ThemeMode, read_suite, suite, update_suite};
pub use model::{FileIconColors, Font, Look, Material, Palette, Shape, Surface, Syntax, Theme};
pub use omarchy::from_omarchy_colors;
pub use registry::{Entry, Registry};
pub use resolver::Resolved;
pub use schema::{Appearance, Issue, Meta, Origin, SCHEMA_VERSION, Severity, SourceInfo};
pub use tokens::{A11y, COLOR_TOKENS, LEGACY, Tokens};
pub use v1::{SWATCH_NAMES, current_id};

/// Every theme on offer, with its metadata.
pub fn list_themes() -> Vec<Meta> {
    Registry::load().entries().iter().map(|e| e.meta.clone()).collect()
}

/// One theme's metadata.
pub fn get_theme_metadata(theme_id: &str) -> Option<Meta> {
    Registry::load().get(theme_id).map(|e| e.meta.clone())
}

/// The system theme as chosen: its id, or `omarchy` when following Omarchy's.
pub fn get_active_theme() -> String {
    let s = suite();
    if s.mode == ThemeMode::Omarchy && omarchy::live().is_some() { "omarchy".into() } else { s.theme }
}

/// The theme an app (`Some("nyx-files")`) or the system/shell (`None`) shows now.
pub fn resolve_effective_theme(application_id: Option<&str>, system_preferences: &Suite, accessibility: &A11y) -> Resolved {
    let scope = application_id.map_or(Scope::System, Scope::App);
    resolver::resolve(&Registry::load(), system_preferences, scope, accessibility)
}

/// Every built-in theme, resolved (no user files).
pub fn bundled() -> Vec<Theme> {
    let r = Registry::builtin();
    r.entries()
        .iter()
        .filter_map(|e| resolver::resolve_id(&r, &e.meta.id, None, &A11y::default()).map(|x| x.theme))
        .collect()
}

/// Every theme on offer, resolved.
pub fn all() -> Vec<Theme> {
    let r = Registry::load();
    r.entries()
        .iter()
        .filter_map(|e| resolver::resolve_id(&r, &e.meta.id, None, &A11y::default()).map(|x| x.theme))
        .collect()
}

/// Refuse a theme that doesn't resolve cleanly, so the one showing stays.
fn check_selectable(id: &str) -> Result<(), String> {
    let registry = Registry::load();
    let r = resolver::resolve_id(&registry, id, None, &A11y::default()).ok_or(format!("there is no theme {id}"))?;
    let errors: Vec<String> = r.issues.iter().filter(|i| i.severity == Severity::Error).map(ToString::to_string).collect();
    if errors.is_empty() {
        Ok(())
    } else {
        Err(format!("{} has errors, so the current theme stays:\n{}", r.meta.name, errors.join("\n")))
    }
}

/// Set the system theme. A theme with errors is refused and the current one stays.
pub fn set_system_theme(theme_id: &str) -> Result<(), String> {
    let id = current_id(theme_id);
    if id == "omarchy" {
        update_suite(|s| s.mode = ThemeMode::Omarchy).map_err(|e| e.to_string())?;
    } else {
        check_selectable(id)?;
        update_suite(|s| {
            s.mode = ThemeMode::Theme;
            s.theme = id.to_owned();
        })
        .map_err(|e| e.to_string())?;
    }
    notify_changed("system", "theme-selected");
    Ok(())
}

/// Give one app its own theme. The system theme is untouched.
pub fn set_app_override(app_id: &str, theme_id: &str) -> Result<(), String> {
    let id = current_id(theme_id);
    check_selectable(id)?;
    update_suite(|s| s.set_override(app_id, Some(id))).map_err(|e| e.to_string())?;
    notify_changed(&format!("app:{app_id}"), "override-set");
    Ok(())
}

/// Put an app back on Follow System.
pub fn clear_app_override(app_id: &str) -> Result<(), String> {
    update_suite(|s| s.set_override(app_id, None)).map_err(|e| e.to_string())?;
    notify_changed(&format!("app:{app_id}"), "override-cleared");
    Ok(())
}

/// Fetch, check and install every theme in a repository that passes its checks.
pub fn install_theme(repository_url: &str) -> Result<Vec<String>, String> {
    let ins = installer::inspect(repository_url)?;
    let ok: Vec<usize> = (0..ins.candidates.len()).filter(|&i| ins.candidates[i].installable()).collect();
    if ok.is_empty() {
        let why: Vec<String> = ins.candidates.iter().flat_map(|c| c.issues.iter().filter(|i| i.severity == Severity::Error)).map(ToString::to_string).collect();
        return Err(format!("no theme in the repository passes its checks:\n{}", why.join("\n")));
    }
    let ids = installer::install(&ins, &ok)?;
    notify_changed("system", "theme-installed");
    Ok(ids)
}

pub fn update_theme(theme_id: &str) -> Result<installer::Updated, String> {
    let r = installer::update(theme_id)?;
    if r != installer::Updated::UpToDate {
        notify_changed("system", "theme-updated");
    }
    Ok(r)
}

pub fn remove_theme(theme_id: &str) -> Result<(), String> {
    installer::remove(theme_id)?;
    notify_changed("system", "theme-removed");
    Ok(())
}

/// Reset every appearance choice to the defaults: the default theme (or Omarchy's
/// on Omarchy), no app overrides, no token overrides. Accents, density and text
/// size stay.
pub fn reset_appearance() -> Result<(), String> {
    update_suite(|s| {
        let d = Suite::default();
        s.mode = if omarchy::live().is_some() { ThemeMode::Omarchy } else { ThemeMode::Theme };
        s.theme = d.theme;
        s.applications.clear();
        s.tokens.clear();
    })
    .map_err(|e| e.to_string())?;
    notify_changed("applications", "reset");
    Ok(())
}

impl A11y {
    /// The desktop's accessibility settings (GNOME interface keys; `NYX_REDUCE_MOTION`
    /// and `NYX_HIGH_CONTRAST` override them).
    pub fn system() -> A11y {
        let env = |k: &str| std::env::var(k).ok().map(|v| v == "1" || v == "true");
        let get = |schema: &str, key: &str| -> Option<String> {
            let out = std::process::Command::new("gsettings").args(["get", schema, key]).stderr(std::process::Stdio::null()).output().ok()?;
            out.status.success().then(|| String::from_utf8_lossy(&out.stdout).trim().to_string())
        };
        let reduce_motion = env("NYX_REDUCE_MOTION")
            .unwrap_or_else(|| get("org.gnome.desktop.interface", "enable-animations").is_some_and(|v| v == "false"));
        let high_contrast = env("NYX_HIGH_CONTRAST")
            .unwrap_or_else(|| get("org.gnome.desktop.a11y.interface", "high-contrast").is_some_and(|v| v == "true"));
        A11y { reduce_motion, high_contrast }
    }
}

/// Resolve the system theme, publish it as the next snapshot generation when it
/// (or, for any other scope, anything) changed, and announce it on the bus.
/// Returns the generation clients should be on.
pub fn notify_changed(scope: &str, reason: &str) -> u64 {
    let s = suite();
    let r = resolver::resolve(&Registry::load(), &s, Scope::System, &A11y::system());
    let force = scope != "system";
    match snapshot::publish(&r, reason, force) {
        Ok(p) => {
            #[cfg(feature = "dbus")]
            if p.changed {
                let _ = dbus::emit(&dbus::ChangeEvent {
                    generation: p.generation,
                    system_theme: r.meta.id.clone(),
                    scope: scope.into(),
                    reason: reason.into(),
                    schema: SCHEMA_VERSION,
                });
            }
            p.generation
        }
        Err(_) => snapshot::generation(),
    }
}
