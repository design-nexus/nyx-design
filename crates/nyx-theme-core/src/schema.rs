//! The versioned theme format. Schema 1 is the original flat file (`bg = …`,
//! `accent = …`, see [`crate::v1`]); schema 2 is a theme package's
//! `nyx-theme.toml`: metadata, a named source palette, semantic tokens, and
//! typography, geometry, motion, effects and assets. A theme is data only:
//! keys that would run something are refused outright.

use crate::v1::{IconsFile, SyntaxFile};
use serde::{Deserialize, Serialize};
use std::collections::BTreeMap;
use std::path::PathBuf;

/// The newest schema this library reads.
pub const SCHEMA_VERSION: u32 = 2;
/// A theme package's manifest.
pub const MANIFEST: &str = "nyx-theme.toml";

/// Keys that would make a theme run something. A theme is declarative data.
const HOOK_KEYS: &[&str] =
    &["hooks", "hook", "install", "pre_install", "post_install", "exec", "script", "scripts", "run", "command", "commands"];

#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum Severity {
    /// Worth knowing (a low contrast pair, an ignored file); the theme works.
    Warning,
    /// Something in the theme is wrong and was replaced by a default; installing
    /// refuses a theme with errors.
    Error,
}

/// One finding about a theme, with where it is and what to do.
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct Issue {
    pub severity: Severity,
    /// The file or theme it is about.
    pub origin: String,
    /// The key, token or file, if any.
    pub key: String,
    pub message: String,
}

impl std::fmt::Display for Issue {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        let level = match self.severity {
            Severity::Warning => "warning",
            Severity::Error => "error",
        };
        if self.key.is_empty() {
            write!(f, "{level}: {}: {}", self.origin, self.message)
        } else {
            write!(f, "{level}: {}: {}: {}", self.origin, self.key, self.message)
        }
    }
}

/// Collects issues while a theme is read and resolved.
#[derive(Debug, Default)]
pub struct Diag {
    pub origin: String,
    issues: std::cell::RefCell<Vec<Issue>>,
}

impl Diag {
    pub fn new(origin: impl Into<String>) -> Diag {
        Diag { origin: origin.into(), issues: Default::default() }
    }

    pub fn push(&self, severity: Severity, key: impl Into<String>, message: impl Into<String>) {
        let issue = Issue { severity, origin: self.origin.clone(), key: key.into(), message: message.into() };
        let mut issues = self.issues.borrow_mut();
        if !issues.contains(&issue) {
            issues.push(issue);
        }
    }

    pub fn error(&self, key: impl Into<String>, message: impl Into<String>) {
        self.push(Severity::Error, key, message);
    }

    pub fn warn(&self, key: impl Into<String>, message: impl Into<String>) {
        self.push(Severity::Warning, key, message);
    }

    pub fn extend(&self, more: impl IntoIterator<Item = Issue>) {
        for i in more {
            let mut issues = self.issues.borrow_mut();
            if !issues.contains(&i) {
                issues.push(i);
            }
        }
    }

    pub fn take(&self) -> Vec<Issue> {
        std::mem::take(&mut *self.issues.borrow_mut())
    }

    pub fn has_errors(&self) -> bool {
        self.issues.borrow().iter().any(|i| i.severity == Severity::Error)
    }
}

#[derive(Debug, Clone, Copy, Default, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum Appearance {
    #[default]
    Dark,
    Light,
}

/// Where a theme comes from.
#[derive(Debug, Clone, Copy, Default, PartialEq, Eq, PartialOrd, Ord, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum Origin {
    /// Compiled into this library; always there, never removable.
    #[default]
    BuiltIn,
    /// Installed with the system (`$XDG_DATA_DIRS/nyx/themes`).
    System,
    /// Installed by the user from a repository (`~/.local/share/nyx/themes`).
    Installed,
    /// A theme file the user wrote (`~/.config/nyx/themes`).
    User,
    /// The active Omarchy theme, read live.
    Omarchy,
}

/// Where an installed theme was installed from, for updates.
#[derive(Debug, Clone, Default, PartialEq, Serialize, Deserialize)]
pub struct SourceInfo {
    pub url: String,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub git_ref: Option<String>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub subpath: Option<String>,
    pub commit: String,
    /// `nyx` (a theme package) or `omarchy` (converted from `colors.toml`).
    pub format: String,
    pub installed: String,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated: Option<String>,
}

/// What a theme says about itself, and where it was found.
#[derive(Debug, Clone, Default, PartialEq, Serialize, Deserialize)]
pub struct Meta {
    pub id: String,
    pub name: String,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub author: Option<String>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,
    pub schema: u32,
    pub appearance: Appearance,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub license: Option<String>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub homepage: Option<String>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub preview: Option<PathBuf>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub inherits: Option<String>,
    pub origin: Origin,
    /// The theme's folder (packages) or file (user themes).
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub path: Option<PathBuf>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub source: Option<SourceInfo>,
    /// How it was converted (Omarchy imports): format, notes on what wasn't carried over.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub conversion: Option<SourceFile>,
    /// Wallpapers the theme offers. Never applied on their own.
    #[serde(default, skip_serializing_if = "Vec::is_empty")]
    pub wallpapers: Vec<PathBuf>,
    /// A user file that overrides a shipped theme of the same id.
    #[serde(default, skip_serializing_if = "std::ops::Not::not")]
    pub overridden: bool,
}

impl Meta {
    pub fn removable(&self) -> bool {
        self.origin == Origin::Installed
    }
}

/// `nyx-theme.toml`.
#[derive(Debug, Clone, Default, Deserialize, Serialize)]
#[serde(deny_unknown_fields)]
pub struct PackageFile {
    pub schema: u32,
    pub id: String,
    pub name: String,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub author: Option<String>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub appearance: Option<Appearance>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub license: Option<String>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub homepage: Option<String>,
    /// An image in the package, relative to it.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub preview: Option<String>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub inherits: Option<String>,
    /// Named source colours, which tokens and swatches refer to as `palette.<name>`.
    #[serde(default, skip_serializing_if = "BTreeMap::is_empty")]
    pub palette: BTreeMap<String, String>,
    /// Semantic tokens (`"surface.primary" = "palette.base"` or a colour).
    #[serde(default, skip_serializing_if = "BTreeMap::is_empty")]
    pub tokens: BTreeMap<String, String>,
    #[serde(default, skip_serializing_if = "TypographyFile::is_empty")]
    pub typography: TypographyFile,
    #[serde(default, skip_serializing_if = "GeometryFile::is_empty")]
    pub geometry: GeometryFile,
    #[serde(default, skip_serializing_if = "MotionFile::is_empty")]
    pub motion: MotionFile,
    #[serde(default, skip_serializing_if = "EffectsFile::is_empty")]
    pub effects: EffectsFile,
    #[serde(default, skip_serializing_if = "AssetsFile::is_empty")]
    pub assets: AssetsFile,
    #[serde(default, skip_serializing_if = "BTreeMap::is_empty")]
    pub swatches: BTreeMap<String, String>,
    #[serde(default, skip_serializing_if = "BTreeMap::is_empty")]
    pub accents: BTreeMap<String, String>,
    #[serde(default, skip_serializing_if = "BTreeMap::is_empty")]
    pub sections: BTreeMap<String, BTreeMap<String, String>>,
    #[serde(default, skip_serializing_if = "SyntaxFile::is_empty")]
    pub syntax: SyntaxFile,
    #[serde(default, skip_serializing_if = "IconsFile::is_empty")]
    pub icons: IconsFile,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub source: Option<SourceFile>,
}

/// Conversion metadata, written by importers.
#[derive(Debug, Clone, Default, PartialEq, Deserialize, Serialize)]
#[serde(deny_unknown_fields)]
pub struct SourceFile {
    /// `omarchy`, …
    pub format: String,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub origin: Option<String>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub converted: Option<String>,
    /// What the source had that a Nyx theme doesn't carry.
    #[serde(default, skip_serializing_if = "Vec::is_empty")]
    pub notes: Vec<String>,
}

#[derive(Debug, Clone, Default, PartialEq, Deserialize, Serialize)]
#[serde(deny_unknown_fields)]
pub struct TypographyFile {
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub ui: Option<String>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub mono: Option<String>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub weight: Option<u16>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub heading_weight: Option<u16>,
    /// `display`, `heading`, `body`, `caption`, `label`, `monospace`.
    #[serde(default, skip_serializing_if = "BTreeMap::is_empty")]
    pub roles: BTreeMap<String, TypeRoleFile>,
}

#[derive(Debug, Clone, Default, PartialEq, Deserialize, Serialize)]
#[serde(deny_unknown_fields)]
pub struct TypeRoleFile {
    /// Relative to the interface font size (em), so system font scaling still applies.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub size: Option<f64>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub weight: Option<u16>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub line_height: Option<f64>,
    /// em.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub letter_spacing: Option<f64>,
}

#[derive(Debug, Clone, Default, PartialEq, Deserialize, Serialize)]
#[serde(deny_unknown_fields)]
pub struct GeometryFile {
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub radius_small: Option<u8>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub radius_card: Option<u8>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub radius_dialog: Option<u8>,
    /// The spacing step in px; the scale is multiples of it.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub spacing_unit: Option<u32>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub control_height: Option<u32>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub border_width: Option<u32>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub focus_width: Option<u32>,
    /// Padding inside cards and grouped rows, px.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub padding: Option<u32>,
}

#[derive(Debug, Clone, Default, PartialEq, Deserialize, Serialize)]
#[serde(deny_unknown_fields)]
pub struct MotionFile {
    /// ms.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub fast: Option<u32>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub normal: Option<u32>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub slow: Option<u32>,
    /// CSS easing: a keyword or `cubic-bezier(…)`.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub easing_standard: Option<String>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub easing_enter: Option<String>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub easing_exit: Option<String>,
}

#[derive(Debug, Clone, Default, PartialEq, Deserialize, Serialize)]
#[serde(deny_unknown_fields)]
pub struct EffectsFile {
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub surface: Option<crate::Surface>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub see_through: Option<bool>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub blended: Option<bool>,
    /// How much accent tints a hovered row (0–1).
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub hover: Option<f64>,
    /// How much accent tints a selected row (0–1).
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub selection: Option<f64>,
    /// Opacity of translucent surfaces (0.5–1), where the toolkit and compositor allow.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub surface_opacity: Option<f64>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub shadow_intensity: Option<f64>,
    /// A preference for blur behind translucent surfaces; never required.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub blur: Option<bool>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub overlay_dim: Option<f64>,
}

#[derive(Debug, Clone, Default, PartialEq, Deserialize, Serialize)]
#[serde(deny_unknown_fields)]
pub struct AssetsFile {
    /// Images in the package, relative to it.
    #[serde(default, skip_serializing_if = "Vec::is_empty")]
    pub wallpapers: Vec<String>,
}

macro_rules! all_none {
    ($t:ty; $($f:ident),*) => {
        impl $t {
            pub fn is_empty(&self) -> bool { true $(&& self.$f.is_none())* }
        }
    };
}
all_none!(GeometryFile; radius_small, radius_card, radius_dialog, spacing_unit, control_height, border_width, focus_width, padding);
all_none!(MotionFile; fast, normal, slow, easing_standard, easing_enter, easing_exit);
all_none!(EffectsFile; surface, see_through, blended, hover, selection, surface_opacity, shadow_intensity, blur, overlay_dim);

impl TypographyFile {
    pub fn is_empty(&self) -> bool {
        self.ui.is_none() && self.mono.is_none() && self.weight.is_none() && self.heading_weight.is_none() && self.roles.is_empty()
    }
}

impl AssetsFile {
    pub fn is_empty(&self) -> bool {
        self.wallpapers.is_empty()
    }
}

/// A theme id: lowercase letters, digits and dashes, 1–64 long, not a reserved name.
pub fn valid_id(id: &str) -> bool {
    (1..=64).contains(&id.len())
        && id.bytes().all(|b| b.is_ascii_lowercase() || b.is_ascii_digit() || b == b'-')
        && !id.starts_with('-')
        && !id.ends_with('-')
        && !matches!(id, "omarchy" | "system" | "default" | "follow-system")
}

/// Whether `text` is a schema 2 manifest (it says `schema = 2` or more).
pub fn is_package(text: &str) -> bool {
    toml::from_str::<toml::Table>(text).ok().and_then(|t| t.get("schema").and_then(|v| v.as_integer())).is_some_and(|s| s >= 2)
}

/// Read a manifest, refusing hook keys, unknown keys, newer schemas and bad ids.
pub fn parse_package(text: &str, origin: &str) -> Result<PackageFile, Vec<Issue>> {
    let diag = Diag::new(origin);
    let table: toml::Table = match toml::from_str(text) {
        Ok(t) => t,
        Err(e) => {
            diag.error("", format!("not valid TOML: {}", e.message()));
            return Err(diag.take());
        }
    };
    for key in table.keys() {
        if HOOK_KEYS.contains(&key.as_str()) {
            diag.error(key, "themes can't run anything; executable hooks and scripts aren't supported");
        }
    }
    match table.get("schema").and_then(|v| v.as_integer()) {
        None => diag.error("schema", "missing; a theme package says `schema = 2`"),
        Some(s) if s > i64::from(SCHEMA_VERSION) => {
            diag.error("schema", format!("schema {s} needs a newer Nyx (this one reads up to {SCHEMA_VERSION})"))
        }
        Some(s) if s < 2 => diag.error("schema", "a package manifest is schema 2; schema 1 is the flat theme file"),
        _ => {}
    }
    if diag.has_errors() {
        return Err(diag.take());
    }
    let file: PackageFile = match toml::from_str(text) {
        Ok(f) => f,
        Err(e) => {
            diag.error("", e.message().to_string());
            return Err(diag.take());
        }
    };
    if !valid_id(&file.id) {
        diag.error("id", format!("{:?} isn't a valid theme id (lowercase letters, digits and dashes)", file.id));
    }
    if file.name.trim().is_empty() {
        diag.error("name", "empty");
    }
    if let Some(v) = &file.preview
        && !safe_relative(v)
    {
        diag.error("preview", format!("{v:?} must be a file inside the theme"));
    }
    for w in &file.assets.wallpapers {
        if !safe_relative(w) {
            diag.error("assets.wallpapers", format!("{w:?} must be a file inside the theme"));
        }
    }
    if diag.has_errors() { Err(diag.take()) } else { Ok(file) }
}

/// A relative path that stays inside its folder.
pub fn safe_relative(p: &str) -> bool {
    !p.is_empty() && !p.starts_with('/') && !p.contains('\\') && p.split('/').all(|c| !c.is_empty() && c != ".." && c != ".")
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn ids() {
        for ok in ["catppuccin-mocha", "a", "nord2"] {
            assert!(valid_id(ok), "{ok}");
        }
        for bad in ["", "Nord", "a b", "../x", "-a", "omarchy", "custom:x", &"x".repeat(65)] {
            assert!(!valid_id(bad), "{bad}");
        }
    }

    #[test]
    fn refuses_hooks_and_newer_schemas() {
        let errs = parse_package("schema = 2\nid = \"x\"\nname = \"X\"\npost_install = \"rm -rf ~\"", "t").unwrap_err();
        assert!(errs.iter().any(|i| i.key == "post_install"));
        let errs = parse_package("schema = 9\nid = \"x\"\nname = \"X\"", "t").unwrap_err();
        assert!(errs[0].message.contains("newer"));
        assert!(parse_package("schema = 2\nid = \"x\"\nname = \"X\"\ncolour = 1", "t").is_err());
        assert!(parse_package("schema = 2\nid = \"x\"\nname = \"X\"\npreview = \"../../etc/passwd\"", "t").is_err());
        assert!(parse_package("not toml = = =", "t").is_err());
        assert!(parse_package("schema = 2\nid = \"x\"\nname = \"X\"", "t").is_ok());
    }

    #[test]
    fn relative_paths() {
        assert!(safe_relative("assets/a.png"));
        for bad in ["/etc/x", "../x", "a/../../x", "a//b", "./a", ""] {
            assert!(!safe_relative(bad), "{bad}");
        }
    }
}
