//! Every theme on offer, found in a fixed order: built in, installed with the
//! system, installed by the user, then the user's own files. Ids are unique: a
//! package whose id is taken is reported and skipped, never silently swapped in.
//! The one deliberate exception is kept from schema 1: a user's theme file named
//! like an existing theme overrides it key by key.

use crate::layer::Layer;
use crate::schema::{Appearance, Diag, Issue, MANIFEST, Meta, Origin, PackageFile, SourceInfo, is_package, parse_package};
use crate::v1::{ThemeFile, current_id};
use std::collections::BTreeMap;
use std::path::{Path, PathBuf};

enum Shipped {
    V1(&'static str),
    /// An Omarchy `colors.toml` and the theme's name: converted as Follow Omarchy
    /// converts the active Omarchy theme, so a theme looks the same either way.
    Omarchy(&'static str, &'static str),
}

macro_rules! omarchy {
    ($id:literal, $name:literal) => {
        ($id, Shipped::Omarchy(include_str!(concat!("../themes/", $id, "/colors.toml")), $name))
    };
}

/// The themes Nyx ships, built in so they never go missing.
const SHIPPED: &[(&str, Shipped)] = &[
    omarchy!("catppuccin-mocha", "Catppuccin Mocha"),
    ("nyx-dark", Shipped::V1(include_str!("../themes/nyx-dark.toml"))),
    ("nyx-light", Shipped::V1(include_str!("../themes/nyx-light.toml"))),
    omarchy!("dracula", "Dracula"),
    omarchy!("catppuccin-macchiato", "Catppuccin Macchiato"),
    omarchy!("catppuccin-frappe", "Catppuccin Frappé"),
    omarchy!("catppuccin-latte", "Catppuccin Latte"),
    omarchy!("tokyo-night", "Tokyo Night"),
    omarchy!("tokyo-night-storm", "Tokyo Night Storm"),
    omarchy!("tokyo-night-moon", "Tokyo Night Moon"),
    omarchy!("one-dark-pro", "One Dark Pro"),
    omarchy!("nord", "Nord"),
    omarchy!("gruvbox-dark", "Gruvbox Dark"),
    omarchy!("rose-pine", "Rosé Pine"),
    omarchy!("everforest", "Everforest"),
    omarchy!("solarized-dark", "Solarized Dark"),
    omarchy!("kanagawa", "Kanagawa"),
];

/// The shipped text of a built-in theme: its v1 file or its Omarchy colours.
pub fn shipped_text(id: &str) -> Option<&'static str> {
    SHIPPED.iter().find(|(s, _)| *s == id).map(|(_, t)| match t {
        Shipped::V1(t) | Shipped::Omarchy(t, _) => *t,
    })
}

/// A built-in theme's preview picture, installed with the system
/// (`<data dir>/nyx/theme-previews/<id>.jpg`).
fn builtin_preview(id: &str) -> Option<PathBuf> {
    crate::paths::data_dirs()
        .into_iter()
        .flat_map(|d| ["jpg", "png"].map(|ext| d.join("nyx/theme-previews").join(format!("{id}.{ext}"))))
        .find(|p| p.is_file())
}

pub fn is_builtin(id: &str) -> bool {
    SHIPPED.iter().any(|(s, _)| *s == current_id(id))
}

/// One theme: what it says about itself, its own layers (base first, not counting
/// what it inherits), and what was found wrong while reading it.
#[derive(Debug, Clone)]
pub struct Entry {
    pub meta: Meta,
    pub layers: Vec<Layer>,
    pub issues: Vec<Issue>,
}

#[derive(Debug, Clone, Default)]
pub struct Registry {
    entries: Vec<Entry>,
    /// Problems with themes that couldn't be listed at all.
    pub skipped: Vec<Issue>,
}

fn package_meta(pkg: &PackageFile, origin: Origin, root: Option<&Path>) -> Meta {
    let in_root = |rel: &str| root.map(|r| r.join(rel)).filter(|p| p.is_file());
    Meta {
        id: pkg.id.clone(),
        name: pkg.name.clone(),
        author: pkg.author.clone(),
        description: pkg.description.clone(),
        version: pkg.version.clone(),
        schema: pkg.schema,
        appearance: pkg.appearance.unwrap_or_default(),
        license: pkg.license.clone(),
        homepage: pkg.homepage.clone(),
        preview: pkg.preview.as_deref().and_then(in_root),
        inherits: pkg.inherits.as_deref().map(|i| current_id(i).to_owned()),
        origin,
        path: root.map(Path::to_path_buf),
        source: None,
        conversion: pkg.source.clone(),
        wallpapers: pkg.assets.wallpapers.iter().filter_map(|w| in_root(w)).collect(),
        overridden: false,
    }
}

fn v1_meta(id: &str, name: &str, file: &ThemeFile, origin: Origin, path: Option<&Path>) -> Meta {
    Meta {
        id: id.into(),
        name: name.into(),
        schema: 1,
        appearance: if file.light == Some(true) { Appearance::Light } else { Appearance::Dark },
        inherits: file.inherits.as_deref().map(|i| current_id(i).to_owned()),
        origin,
        path: path.map(Path::to_path_buf),
        ..Meta::default()
    }
}

/// Recorded sources of installed themes, by id.
pub fn read_sources() -> BTreeMap<String, SourceInfo> {
    #[derive(serde::Deserialize, Default)]
    struct File {
        #[serde(default)]
        themes: BTreeMap<String, SourceInfo>,
    }
    std::fs::read_to_string(crate::paths::registry_file())
        .ok()
        .and_then(|t| toml::from_str::<File>(&t).ok())
        .map(|f| f.themes)
        .unwrap_or_default()
}

impl Registry {
    /// Only the built-in themes.
    pub fn builtin() -> Registry {
        let mut r = Registry::default();
        for (id, shipped) in SHIPPED {
            let diag = Diag::new(format!("{id} (built in)"));
            match shipped {
                Shipped::V1(text) => {
                    let file = ThemeFile::parse(text, &diag).unwrap_or_default();
                    let name = file.name.clone().unwrap_or_else(|| (*id).into());
                    let mut meta = v1_meta(id, &name, &file, Origin::BuiltIn, None);
                    meta.preview = builtin_preview(id);
                    r.entries.push(Entry { meta, layers: vec![Layer::from_v1(file)], issues: diag.take() });
                }
                Shipped::Omarchy(text, name) => {
                    let pkg = toml::from_str::<toml::Table>(text).ok().and_then(|t| crate::omarchy::package_for(&t, id, name, false));
                    match pkg {
                        Some(pkg) => {
                            let mut meta = package_meta(&pkg, Origin::BuiltIn, None);
                            meta.preview = builtin_preview(id);
                            r.entries.push(Entry { meta, layers: vec![Layer::from_package(&pkg)], issues: diag.take() });
                        }
                        None => {
                            diag.error("colors.toml", "needs at least background, foreground and accent");
                            r.skipped.extend(diag.take());
                        }
                    }
                }
            }
        }
        r
    }

    /// Every theme: built in, system, installed, then the user's own files.
    pub fn load() -> Registry {
        let mut r = Registry::builtin();
        for dir in crate::paths::system_dirs() {
            r.add_packages(&dir, Origin::System);
        }
        r.add_packages(&crate::paths::installed_dir(), Origin::Installed);
        let sources = read_sources();
        for e in &mut r.entries {
            if e.meta.origin == Origin::Installed {
                e.meta.source = sources.get(&e.meta.id).cloned();
            }
        }
        r.add_user_files();
        r.fill_appearance();
        r
    }

    pub fn entries(&self) -> &[Entry] {
        &self.entries
    }

    pub fn get(&self, id: &str) -> Option<&Entry> {
        let id = current_id(id);
        self.entries.iter().find(|e| e.meta.id == id)
    }

    pub fn contains(&self, id: &str) -> bool {
        self.get(id).is_some()
    }

    #[cfg(test)]
    pub(crate) fn push_for_test(&mut self, entry: Entry) {
        self.entries.push(entry);
    }

    /// A staged theme in place of any installed one with its id, to resolve it
    /// before installing.
    pub(crate) fn insert_for_check(&mut self, entry: Entry) {
        match self.entries.iter_mut().find(|e| e.meta.id == entry.meta.id && e.meta.origin == crate::Origin::Installed) {
            Some(slot) => *slot = entry,
            None => self.entries.push(entry),
        }
    }

    fn add_packages(&mut self, dir: &Path, origin: Origin) {
        let mut folders: Vec<PathBuf> = std::fs::read_dir(dir)
            .map(|r| r.flatten().map(|e| e.path()).filter(|p| p.is_dir()).collect())
            .unwrap_or_default();
        folders.sort();
        for folder in folders {
            let name = folder.file_name().map(|n| n.to_string_lossy().to_string()).unwrap_or_default();
            if name.starts_with('.') {
                continue;
            }
            let manifest = folder.join(MANIFEST);
            let Ok(text) = std::fs::read_to_string(&manifest) else { continue };
            let origin_label = manifest.display().to_string();
            let pkg = match parse_package(&text, &origin_label) {
                Ok(p) => p,
                Err(issues) => {
                    self.skipped.extend(issues);
                    continue;
                }
            };
            let diag = Diag::new(&origin_label);
            if pkg.id != name {
                diag.error("id", format!("the folder is {name:?} but the theme says it is {:?}; skipped", pkg.id));
                self.skipped.extend(diag.take());
                continue;
            }
            if let Some(existing) = self.get(&pkg.id) {
                diag.error("id", format!("{} is already a {:?} theme; this one is skipped", pkg.id, existing.meta.origin));
                self.skipped.extend(diag.take());
                continue;
            }
            let meta = package_meta(&pkg, origin, Some(&folder));
            self.entries.push(Entry { meta, layers: vec![Layer::from_package(&pkg)], issues: diag.take() });
        }
    }

    fn add_user_files(&mut self) {
        let mut by_stem: BTreeMap<String, (PathBuf, String)> = BTreeMap::new();
        for dir in crate::paths::theme_dirs() {
            let Ok(entries) = std::fs::read_dir(&dir) else { continue };
            for path in entries.flatten().map(|e| e.path()) {
                if path.extension().is_none_or(|x| x != "toml") {
                    continue;
                }
                let Some(stem) = path.file_stem().map(|s| current_id(&s.to_string_lossy()).to_owned()) else { continue };
                let Ok(text) = std::fs::read_to_string(&path) else { continue };
                by_stem.insert(stem, (path, text));
            }
        }
        let mut custom = Vec::new();
        for (stem, (path, text)) in by_stem {
            let origin = path.display().to_string();
            if is_package(&text) {
                match parse_package(&text, &origin) {
                    Ok(pkg) if self.contains(&pkg.id) => {
                        self.skipped.push(Issue {
                            severity: crate::Severity::Error,
                            origin,
                            key: "id".into(),
                            message: format!("{} is already a theme; this file is skipped", pkg.id),
                        });
                    }
                    Ok(pkg) => {
                        let meta = package_meta(&pkg, Origin::User, path.parent());
                        custom.push(Entry { meta: Meta { path: Some(path.clone()), ..meta }, layers: vec![Layer::from_package(&pkg)], issues: vec![] });
                    }
                    Err(issues) => self.skipped.extend(issues),
                }
                continue;
            }
            let diag = Diag::new(&origin);
            let Some(file) = ThemeFile::parse(&text, &diag) else {
                self.skipped.extend(diag.take());
                continue;
            };
            let inherits = file.inherits.as_deref().map(|i| current_id(i).to_owned());
            if let Some(slot) = self.entries.iter_mut().find(|e| e.meta.id == stem) {
                // A user file named like a theme: its keys over that theme's.
                if let Some(base) = inherits {
                    slot.meta.inherits = Some(base);
                    slot.layers = vec![Layer::from_v1(file)];
                } else {
                    slot.layers.push(Layer::from_v1(file));
                }
                slot.meta.overridden = true;
                slot.issues.extend(diag.take());
                continue;
            }
            let id = format!("custom:{stem}");
            let named = file.name.is_some() || file.inherits.is_some();
            let name = if named { file.name.clone().unwrap_or_else(|| id.clone()) } else { stem.clone() };
            let meta = v1_meta(&id, &name, &file, Origin::User, Some(&path));
            custom.push(Entry { meta, layers: vec![Layer::from_v1(file)], issues: diag.take() });
        }
        custom.sort_by(|a, b| a.meta.name.cmp(&b.meta.name));
        self.entries.extend(custom);
    }

    /// Themes that inherit their lightness take it from their base.
    fn fill_appearance(&mut self) {
        for i in 0..self.entries.len() {
            let e = &self.entries[i];
            let says = e.layers.iter().rev().find_map(|l| l.file.light);
            let appearance = match says {
                Some(light) => Some(if light { Appearance::Light } else { Appearance::Dark }),
                None => e.meta.inherits.as_deref().and_then(|b| self.get(b)).map(|b| b.meta.appearance),
            };
            if let Some(a) = appearance {
                self.entries[i].meta.appearance = a;
            }
        }
    }
}