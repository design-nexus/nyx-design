//! Omarchy themes. One translation from Omarchy's `colors.toml` to a Nyx theme
//! package serves both Follow System on Omarchy (the active theme, read live) and
//! importing an Omarchy theme for good. Omarchy's palette is not Nyx's set of
//! roles: named colours map onto the tokens they mean, the rest is derived, and
//! the look (fonts, radii, material) is Nyx's. Nothing in a theme folder runs.

use crate::color::{Color, is_color};
use crate::layer::Layer;
use crate::model::Palette;
use crate::schema::{Appearance, Diag, Issue, Meta, Origin, PackageFile, SCHEMA_VERSION, SourceFile, valid_id};
use crate::v1::{IconsFile, SyntaxFile, ThemeFile};
use std::collections::BTreeMap;
use std::path::{Path, PathBuf};

/// Map Omarchy's `colors.toml` onto the core palette (schema 1 names).
pub fn from_omarchy_colors(text: &str) -> Option<Palette> {
    let table: toml::Table = toml::from_str(text).ok()?;
    let get = |key: &str| table.get(key).and_then(|v| v.as_str()).map(str::to_string);
    let background = get("background")?;
    let foreground = get("foreground")?;
    let accent = get("accent").or_else(|| get("blue"))?;
    let light = table.get("mode").and_then(|v| v.as_str()) == Some("light");
    Some(Palette {
        surface: get("dark_background").unwrap_or_else(|| background.clone()),
        dim_text: get("dark_foreground").or_else(|| get("muted")).unwrap_or_else(|| foreground.clone()),
        border: get("lighter_background").or_else(|| get("selection")).unwrap_or_else(|| foreground.clone()),
        muted: get("muted").or_else(|| get("lighter_background")).unwrap_or_else(|| background.clone()),
        highlight: get("selection").or_else(|| get("lighter_background")).unwrap_or_else(|| background.clone()),
        danger: get("red").unwrap_or_else(|| "#e06c75".into()),
        shadow: get("darker_background").unwrap_or_else(|| "#000000".into()),
        glow: accent.clone(),
        bg: background,
        text: foreground,
        accent,
        light,
    })
}

/// Tokens and the Omarchy keys they come from, first present wins; a `#` value is a
/// literal fallback.
const TOKEN_MAP: &[(&str, &[&str])] = &[
    ("surface.primary", &["background"]),
    ("surface.alternate", &["dark_background", "background"]),
    ("text.primary", &["foreground"]),
    ("text.secondary", &["dark_foreground", "muted", "foreground"]),
    ("accent.primary", &["accent", "blue"]),
    ("accent.secondary", &["accent", "blue"]),
    ("border.default", &["lighter_background", "selection", "foreground"]),
    ("border.strong", &["muted", "lighter_background", "background"]),
    ("state.selected", &["selection", "lighter_background", "background"]),
    ("status.error", &["red", "#e06c75"]),
    ("status.warning", &["yellow"]),
    ("status.success", &["green"]),
    ("status.info", &["cyan"]),
    ("shadow.color", &["darker_background", "#000000"]),
    ("selection.background", &["selection_background"]),
    ("selection.foreground", &["selection_foreground"]),
];

/// Nyx swatch names and the Omarchy colours that stand for them.
const SWATCH_MAP: &[(&str, &str)] = &[
    ("blue", "blue"),
    ("violet", "magenta"),
    ("pink", "bright_magenta"),
    ("red", "red"),
    ("coral", "orange"),
    ("amber", "yellow"),
    ("green", "green"),
    ("teal", "cyan"),
    ("graphite", "dark_foreground"),
];

/// App accents from Omarchy's named colours, for apps the Nyx look leaves out.
const ACCENT_MAP: &[(&str, &str)] = &[
    ("files", "blue"),
    ("mail", "magenta"),
    ("notes", "yellow"),
    ("photos", "orange"),
    ("calendar", "red"),
    ("music", "magenta"),
    ("lyra", "magenta"),
    ("home", "green"),
    ("weather", "cyan"),
    ("chat", "cyan"),
    ("tasks", "green"),
];

/// The required keys, so a theme without them is reported, not guessed.
const REQUIRED: &[&str] = &["background", "foreground"];

fn nyx_base(light: bool) -> ThemeFile {
    let id = if light { "nyx-light" } else { "nyx-dark" };
    let text = crate::registry::shipped_text(id).unwrap_or_default();
    ThemeFile::parse(text, &Diag::new(id)).unwrap_or_default()
}

/// A Nyx theme package for an Omarchy palette. `None` when it lacks a background,
/// foreground or accent.
pub fn package_for(table: &toml::Table, id: &str, name: &str, light_hint: bool) -> Option<PackageFile> {
    let palette: BTreeMap<String, String> = table
        .iter()
        .filter_map(|(k, v)| Some((k.clone(), v.as_str()?.to_string())))
        .filter(|(k, v)| is_color(v) && !k.contains('.') && !k.is_empty())
        .collect();
    if REQUIRED.iter().any(|k| !palette.contains_key(*k)) || !(palette.contains_key("accent") || palette.contains_key("blue")) {
        return None;
    }
    let reference = |keys: &[&str]| {
        keys.iter().find_map(|k| if k.starts_with('#') { Some(k.to_string()) } else { palette.contains_key(*k).then(|| format!("palette.{k}")) })
    };
    let mut tokens = BTreeMap::new();
    for (token, keys) in TOKEN_MAP {
        if let Some(v) = reference(keys) {
            tokens.insert(token.to_string(), v);
        }
    }
    let light = match table.get("mode").and_then(|v| v.as_str()) {
        Some(m) => m == "light",
        None => light_hint || Color::parse(&palette["background"]).is_some_and(|c| c.luminance() > 0.5),
    };
    let nyx = nyx_base(light);
    let mut swatches = nyx.swatches.clone();
    for (name, key) in SWATCH_MAP {
        if palette.contains_key(*key) {
            swatches.insert(name.to_string(), format!("palette.{key}"));
        }
    }
    let mut accents = nyx.accents.clone();
    for (app, key) in ACCENT_MAP {
        if palette.contains_key(*key) {
            accents.entry(app.to_string()).or_insert(format!("palette.{key}"));
        }
    }
    let pick = |keys: &[&str]| keys.iter().find(|k| palette.contains_key(**k)).map(|k| format!("palette.{k}"));
    let syntax = SyntaxFile {
        keyword: pick(&["magenta", "blue"]),
        string: pick(&["green"]),
        constant: pick(&["orange", "yellow"]),
        type_name: pick(&["cyan", "blue"]),
        preprocessor: pick(&["yellow"]),
    };
    let mut pkg = PackageFile {
        schema: SCHEMA_VERSION,
        id: id.into(),
        name: name.into(),
        appearance: Some(if light { Appearance::Light } else { Appearance::Dark }),
        palette,
        tokens,
        swatches,
        accents,
        sections: nyx.sections.clone(),
        syntax,
        icons: IconsFile { pack: nyx.icons.pack.clone(), file_colors: nyx.icons.file_colors },
        ..PackageFile::default()
    };
    pkg.typography.ui = nyx.font.ui.clone();
    pkg.typography.mono = nyx.font.mono.clone();
    pkg.typography.weight = nyx.font.weight;
    pkg.typography.heading_weight = nyx.font.heading_weight;
    pkg.geometry.radius_small = nyx.shape.radius_small;
    pkg.geometry.radius_card = nyx.shape.radius_card;
    pkg.geometry.radius_dialog = nyx.shape.radius_dialog;
    pkg.effects.surface = nyx.material.surface;
    pkg.effects.see_through = nyx.material.see_through;
    pkg.effects.blended = nyx.material.blended;
    pkg.effects.hover = nyx.hover;
    pkg.effects.selection = nyx.selection;
    Some(pkg)
}

/// The active Omarchy theme, read live, as a theme to resolve. `None` off Omarchy.
pub fn live() -> Option<(Meta, Layer)> {
    let text = std::fs::read_to_string(crate::paths::omarchy_colors()).ok()?;
    let table: toml::Table = toml::from_str(&text).ok()?;
    let light_hint = crate::paths::omarchy_dir().join("light.mode").exists();
    let pkg = package_for(&table, "omarchy", "Omarchy", light_hint)?;
    let theme_name = std::fs::read_to_string(nyx_core::paths::state_home().join("omarchy/current/theme.name"))
        .map(|s| s.trim().to_string())
        .unwrap_or_default();
    let meta = Meta {
        id: "omarchy".into(),
        name: "Omarchy".into(),
        description: (!theme_name.is_empty()).then(|| format!("The active Omarchy theme ({})", pretty_name(&theme_name))),
        schema: SCHEMA_VERSION,
        appearance: pkg.appearance.unwrap_or_default(),
        origin: Origin::Omarchy,
        path: Some(crate::paths::omarchy_dir()),
        ..Meta::default()
    };
    Some((meta, Layer::from_package(&pkg)))
}

/// `tokyo-night` → `Tokyo Night`.
pub fn pretty_name(slug: &str) -> String {
    slug.split(['-', '_', ' '])
        .filter(|w| !w.is_empty())
        .map(|w| {
            let mut c = w.chars();
            c.next().map(|f| f.to_uppercase().chain(c).collect::<String>()).unwrap_or_default()
        })
        .collect::<Vec<_>>()
        .join(" ")
}

/// An Omarchy theme folder converted: the package, the files to copy into it
/// (source, path in the package), and what wasn't carried over.
#[derive(Debug, Clone)]
pub struct Conversion {
    pub package: PackageFile,
    pub assets: Vec<(PathBuf, String)>,
    pub notes: Vec<String>,
}

const IMAGE_EXTENSIONS: &[&str] = &["png", "jpg", "jpeg", "webp"];

fn is_image(p: &Path) -> bool {
    p.extension().and_then(|e| e.to_str()).is_some_and(|e| IMAGE_EXTENSIONS.contains(&e.to_ascii_lowercase().as_str()))
}

/// Convert the Omarchy theme in `dir` (a folder with `colors.toml`). Scripts and
/// app-specific configuration are listed in the notes and never run or copied.
pub fn convert_dir(dir: &Path, id: &str, name: &str, origin: &str) -> Result<Conversion, Vec<Issue>> {
    let diag = Diag::new(origin);
    if !valid_id(id) {
        diag.error("id", format!("{id:?} isn't a valid theme id"));
        return Err(diag.take());
    }
    let colors = dir.join("colors.toml");
    let text = match std::fs::read_to_string(&colors) {
        Ok(t) => t,
        Err(e) => {
            diag.error("colors.toml", format!("can't be read: {e}"));
            return Err(diag.take());
        }
    };
    let table: toml::Table = match toml::from_str(&text) {
        Ok(t) => t,
        Err(e) => {
            diag.error("colors.toml", format!("not valid TOML: {}", e.message()));
            return Err(diag.take());
        }
    };
    let Some(mut package) = package_for(&table, id, name, dir.join("light.mode").exists()) else {
        diag.error("colors.toml", "needs at least background, foreground and accent (or blue)");
        return Err(diag.take());
    };
    let mut notes = Vec::new();
    for (k, v) in &table {
        if let Some(s) = v.as_str()
            && !is_color(s)
            && k != "mode"
        {
            notes.push(format!("colors.toml: {k} = {s:?} isn't a colour Nyx reads, so it was left out"));
        }
    }
    let mut assets = Vec::new();
    let mut entries: Vec<PathBuf> = std::fs::read_dir(dir).map(|r| r.flatten().map(|e| e.path()).collect()).unwrap_or_default();
    entries.sort();
    for path in entries {
        let file = path.file_name().map(|f| f.to_string_lossy().to_string()).unwrap_or_default();
        let meta = std::fs::symlink_metadata(&path);
        if meta.as_ref().is_ok_and(|m| m.file_type().is_symlink()) {
            notes.push(format!("{file}: a link, not copied"));
            continue;
        }
        match file.as_str() {
            "colors.toml" | "light.mode" => {}
            "preview.png" | "preview.jpg" | "preview.webp" => {
                package.preview = Some(file.clone());
                assets.push((path.clone(), file.clone()));
            }
            "backgrounds" if path.is_dir() => {
                let mut images: Vec<PathBuf> =
                    std::fs::read_dir(&path).map(|r| r.flatten().map(|e| e.path()).collect()).unwrap_or_default();
                images.sort();
                for img in images {
                    let n = img.file_name().map(|f| f.to_string_lossy().to_string()).unwrap_or_default();
                    let link = std::fs::symlink_metadata(&img).is_ok_and(|m| m.file_type().is_symlink());
                    if is_image(&img) && img.is_file() && !link {
                        let dest = format!("wallpapers/{n}");
                        package.assets.wallpapers.push(dest.clone());
                        assets.push((img, dest));
                    } else {
                        notes.push(format!("backgrounds/{n}: not an image Nyx uses, not copied"));
                    }
                }
            }
            "icons.theme" => {
                if let Ok(t) = std::fs::read_to_string(&path) {
                    let pack = t.trim().to_string();
                    if !pack.is_empty() && pack.len() < 128 {
                        notes.push(format!("icons.theme: recommends the {pack} icons; the icon theme stays your choice"));
                    }
                }
            }
            _ if file.starts_with('.') => {}
            _ if file.ends_with(".sh") || is_executable(&path) => {
                notes.push(format!("{file}: a script; themes never run anything, so it was left out"));
            }
            _ => notes.push(format!("{file}: Omarchy's setting for one app; Nyx themes apps through its own adapters, so it wasn't imported")),
        }
    }
    package.description = Some(format!("Imported from the Omarchy theme {}", pretty_name(name)));
    package.source = Some(SourceFile {
        format: "omarchy".into(),
        origin: Some(origin.into()),
        converted: Some(crate::installer::now_utc()),
        notes: notes.clone(),
    });
    Ok(Conversion { package, assets, notes })
}

fn is_executable(p: &Path) -> bool {
    use std::os::unix::fs::PermissionsExt;
    std::fs::metadata(p).is_ok_and(|m| m.is_file() && m.permissions().mode() & 0o111 != 0)
}

/// Omarchy themes on this computer (user's first), by folder name.
pub fn installed_themes() -> Vec<(String, PathBuf)> {
    let mut out = BTreeMap::new();
    let dirs = [PathBuf::from("/usr/share/omarchy/themes"), nyx_core::paths::config_home().join("omarchy/themes")];
    for dir in dirs {
        for e in std::fs::read_dir(&dir).into_iter().flatten().flatten() {
            let path = e.path();
            if path.join("colors.toml").is_file() {
                out.insert(e.file_name().to_string_lossy().to_string(), path);
            }
        }
    }
    out.into_iter().collect()
}

#[cfg(test)]
mod tests {
    use super::*;

    const MOCHA: &str = r##"
        mode = "dark"
        accent = "#89b4fa"
        selection = "#45475a"
        muted = "#585b70"
        background = "#1e1e2e"
        dark_background = "#161622"
        darker_background = "#101019"
        lighter_background = "#313244"
        foreground = "#cdd6f4"
        dark_foreground = "#6c7086"
        red = "#f38ba8"
        magenta = "#f5c2e7"
        green = "#a6e3a1"
        hyprland_active_border = "rgba(89b4faee) rgba(cba6f7ee) 45deg"
    "##;

    #[test]
    fn maps_omarchy_colors() {
        let p = from_omarchy_colors(MOCHA).unwrap();
        assert_eq!(p.bg, "#1e1e2e");
        assert_eq!(p.surface, "#161622");
        assert_eq!(p.dim_text, "#6c7086");
        assert_eq!(p.border, "#313244");
        assert_eq!(p.highlight, "#45475a");
        assert_eq!(p.danger, "#f38ba8");
        assert!(!p.light);
    }

    #[test]
    fn rejects_incomplete_colors() {
        assert!(from_omarchy_colors("accent = \"#fff\"").is_none());
        let t: toml::Table = toml::from_str("accent = \"#fff\"").unwrap();
        assert!(package_for(&t, "x", "X", false).is_none());
    }

    #[test]
    fn the_package_matches_the_palette_mapping() {
        let t: toml::Table = toml::from_str(MOCHA).unwrap();
        let pkg = package_for(&t, "omarchy-mocha", "Mocha", false).unwrap();
        let resolved = crate::resolver::resolve_layers("x", &[Layer::from_package(&pkg)], &crate::A11y::default());
        let p = from_omarchy_colors(MOCHA).unwrap();
        let r = &resolved.theme.palette;
        assert_eq!((&r.bg, &r.surface, &r.text), (&p.bg, &p.surface, &p.text));
        assert_eq!((&r.border, &r.highlight, &r.danger, &r.shadow), (&p.border, &p.highlight, &p.danger, &p.shadow));
        // Too faint in Omarchy's palette, so raised until they read: secondary text and
        // the outline of a control.
        assert!(crate::color::contrast(&r.dim_text, &r.bg) >= 4.5 && r.dim_text != p.dim_text);
        assert!(crate::color::contrast(&r.muted, &r.bg) >= 3.0 && r.muted != p.muted);
        assert_eq!(resolved.tokens.color("status.success"), "#a6e3a1", "named colours fill tokens Omarchy has");
        assert!(resolved.theme.look.material.blended, "the look is Nyx's");
        assert!(resolved.theme.look.swatches.iter().any(|(n, c)| n == "violet" && c == "#f5c2e7"));
        assert_eq!(resolved.theme.look.syntax.keyword.as_deref(), Some("#f5c2e7"));
        assert!(!pkg.palette.contains_key("hyprland_active_border"), "only colours become the palette");
    }

    #[test]
    fn converts_a_folder_without_running_anything() {
        let dir = std::env::temp_dir().join(format!("nyx-omarchy-test-{}", std::process::id()));
        let _ = std::fs::remove_dir_all(&dir);
        std::fs::create_dir_all(dir.join("backgrounds")).unwrap();
        std::fs::write(dir.join("colors.toml"), MOCHA).unwrap();
        std::fs::write(dir.join("backgrounds/1.jpg"), b"jpg").unwrap();
        std::fs::write(dir.join("backgrounds/notes.txt"), b"x").unwrap();
        std::fs::write(dir.join("waybar.css"), b"x").unwrap();
        std::fs::write(dir.join("setup.sh"), b"rm -rf ~").unwrap();
        let c = convert_dir(&dir, "omarchy-test", "test", "test").unwrap();
        assert_eq!(c.package.assets.wallpapers, ["wallpapers/1.jpg"]);
        assert_eq!(c.assets.len(), 1);
        assert!(c.notes.iter().any(|n| n.starts_with("setup.sh") && n.contains("never run")));
        assert!(c.notes.iter().any(|n| n.starts_with("waybar.css")));
        assert_eq!(c.package.source.as_ref().unwrap().format, "omarchy");
        let text = toml::to_string_pretty(&c.package).unwrap();
        crate::schema::parse_package(&text, "round trip").unwrap();
        let _ = std::fs::remove_dir_all(&dir);
    }

    #[test]
    fn names() {
        assert_eq!(pretty_name("tokyo-night"), "Tokyo Night");
        assert_eq!(pretty_name("catppuccin_latte"), "Catppuccin Latte");
    }
}
