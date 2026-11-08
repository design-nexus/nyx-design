//! Schema 1: the flat theme file every shipped theme and every user theme was
//! written in (`bg = …`, `[accents]`, `[font]`, …). Every key is optional; what a
//! file leaves out comes from the theme it overrides or `inherits`, or is derived
//! from its colours. It stays fully supported; schema 2 packages are converted to
//! the same layers ([`crate::layer`]).

use crate::color::{is_color, mix};
use crate::model::{FileIconColors, Font, Look, Material, Palette, Shape, Surface, Syntax, Theme};
use crate::schema::Diag;
use serde::{Deserialize, Serialize};
use std::collections::BTreeMap;

/// The last resort when a theme leaves a colour out or gets one wrong:
/// Catppuccin Mocha, compiled in so an app always has every colour.
pub fn fallback_palette() -> Palette {
    Palette {
        bg: "#1e1e2e".into(),
        surface: "#181825".into(),
        text: "#cdd6f4".into(),
        dim_text: "#a6adc8".into(),
        accent: "#89b4fa".into(),
        border: "#45475a".into(),
        muted: "#585b70".into(),
        highlight: "#313244".into(),
        danger: "#f38ba8".into(),
        glow: "#b4befe".into(),
        shadow: "#11111b".into(),
        light: false,
    }
}

/// Accent names every theme offers, so an app's pick survives a theme switch.
pub const SWATCH_NAMES: &[&str] = &["blue", "violet", "pink", "red", "coral", "amber", "green", "teal", "graphite"];

/// Swatches for themes that don't define their own, for dark and light backgrounds.
const DARK_SWATCHES: [&str; 9] =
    ["#3d8ae8", "#8b6cf0", "#c95fc6", "#f2655f", "#f5875a", "#eeb43f", "#59d45b", "#3cc4c9", "#9ea2bf"];
const LIGHT_SWATCHES: [&str; 9] =
    ["#136dcd", "#6a4fd0", "#aa41a8", "#cf3434", "#c9532a", "#a87012", "#2f9a33", "#14869a", "#6a6e90"];

/// A schema 1 theme file.
#[derive(Debug, Clone, Default, Deserialize, Serialize)]
#[serde(deny_unknown_fields)]
pub struct ThemeFile {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub name: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub inherits: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub light: Option<bool>,
    pub bg: Option<String>,
    pub surface: Option<String>,
    pub text: Option<String>,
    pub dim_text: Option<String>,
    pub accent: Option<String>,
    pub border: Option<String>,
    pub muted: Option<String>,
    pub highlight: Option<String>,
    pub danger: Option<String>,
    pub glow: Option<String>,
    pub shadow: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub panel: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub card: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub raised: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub popover: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub text_tertiary: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub divider: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub warning: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub success: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub hover: Option<f64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub selection: Option<f64>,
    #[serde(default, skip_serializing_if = "BTreeMap::is_empty")]
    pub accents: BTreeMap<String, String>,
    #[serde(default, skip_serializing_if = "BTreeMap::is_empty")]
    pub sections: BTreeMap<String, BTreeMap<String, String>>,
    #[serde(default, skip_serializing_if = "BTreeMap::is_empty")]
    pub swatches: BTreeMap<String, String>,
    #[serde(default, skip_serializing_if = "FontFile::is_empty")]
    pub font: FontFile,
    #[serde(default, skip_serializing_if = "ShapeFile::is_empty")]
    pub shape: ShapeFile,
    #[serde(default, skip_serializing_if = "MaterialFile::is_empty")]
    pub material: MaterialFile,
    #[serde(default, skip_serializing_if = "IconsFile::is_empty")]
    pub icons: IconsFile,
    #[serde(default, skip_serializing_if = "SyntaxFile::is_empty")]
    pub syntax: SyntaxFile,
}

#[derive(Debug, Clone, Default, PartialEq, Deserialize, Serialize)]
#[serde(deny_unknown_fields)]
pub struct SyntaxFile {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub keyword: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub string: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub constant: Option<String>,
    #[serde(rename = "type", skip_serializing_if = "Option::is_none")]
    pub type_name: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub preprocessor: Option<String>,
}

#[derive(Debug, Clone, Default, PartialEq, Deserialize, Serialize)]
#[serde(deny_unknown_fields)]
pub struct FontFile {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub ui: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub mono: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub weight: Option<u16>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub heading_weight: Option<u16>,
}

#[derive(Debug, Clone, Default, PartialEq, Deserialize, Serialize)]
#[serde(deny_unknown_fields)]
pub struct ShapeFile {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub radius_small: Option<u8>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub radius_card: Option<u8>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub radius_dialog: Option<u8>,
}

#[derive(Debug, Clone, Default, PartialEq, Deserialize, Serialize)]
#[serde(deny_unknown_fields)]
pub struct MaterialFile {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub surface: Option<Surface>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub see_through: Option<bool>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub blended: Option<bool>,
}

#[derive(Debug, Clone, Default, PartialEq, Deserialize, Serialize)]
#[serde(deny_unknown_fields)]
pub struct IconsFile {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub pack: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub file_colors: Option<FileIconColors>,
}

/// `top`'s values over `base`'s, field by field.
macro_rules! layer {
    ($base:expr, $top:expr; $($field:ident),*) => {
        $( if $top.$field.is_some() { $base.$field = $top.$field.clone(); } )*
    };
}
pub(crate) use layer;

impl FontFile {
    pub fn is_empty(&self) -> bool {
        self.ui.is_none() && self.mono.is_none() && self.weight.is_none() && self.heading_weight.is_none()
    }
}

impl ShapeFile {
    pub fn is_empty(&self) -> bool {
        self.radius_small.is_none() && self.radius_card.is_none() && self.radius_dialog.is_none()
    }
}

impl MaterialFile {
    pub fn is_empty(&self) -> bool {
        self.surface.is_none() && self.see_through.is_none() && self.blended.is_none()
    }
}

impl IconsFile {
    pub fn is_empty(&self) -> bool {
        self.pack.is_none() && self.file_colors.is_none()
    }
}

impl SyntaxFile {
    pub fn is_empty(&self) -> bool {
        self.keyword.is_none()
            && self.string.is_none()
            && self.constant.is_none()
            && self.type_name.is_none()
            && self.preprocessor.is_none()
    }
}

/// `value` if it is a colour; a value that isn't is reported.
fn color(diag: &Diag, key: &str, value: &Option<String>) -> Option<String> {
    let v = value.as_ref()?;
    if is_color(v) {
        Some(v.clone())
    } else {
        diag.error(key, format!("{v:?} is not a colour; using the default"));
        None
    }
}

impl ThemeFile {
    pub fn parse(text: &str, diag: &Diag) -> Option<ThemeFile> {
        toml::from_str(text).map_err(|e| diag.error("", e.message().to_string())).ok()
    }

    /// This file over `base`.
    pub fn over(&self, base: &ThemeFile) -> ThemeFile {
        let mut out = base.clone();
        layer!(out, self; name, light, bg, surface, text, dim_text, accent, border, muted, highlight, danger, glow, shadow,
            panel, card, raised, popover, text_tertiary, divider, warning, success, hover, selection);
        out.inherits = None;
        out.accents.extend(self.accents.clone());
        out.swatches.extend(self.swatches.clone());
        for (app, sections) in &self.sections {
            out.sections.entry(app.clone()).or_default().extend(sections.clone());
        }
        layer!(out.font, self.font; ui, mono, weight, heading_weight);
        layer!(out.shape, self.shape; radius_small, radius_card, radius_dialog);
        layer!(out.material, self.material; surface, see_through, blended);
        layer!(out.icons, self.icons; pack, file_colors);
        layer!(out.syntax, self.syntax; keyword, string, constant, type_name, preprocessor);
        out
    }

    /// Every colour value in the file, for rewriting references.
    pub(crate) fn colours_mut(&mut self) -> Vec<&mut String> {
        let mut out: Vec<&mut String> = [
            &mut self.bg,
            &mut self.surface,
            &mut self.text,
            &mut self.dim_text,
            &mut self.accent,
            &mut self.border,
            &mut self.muted,
            &mut self.highlight,
            &mut self.danger,
            &mut self.glow,
            &mut self.shadow,
            &mut self.panel,
            &mut self.card,
            &mut self.raised,
            &mut self.popover,
            &mut self.text_tertiary,
            &mut self.divider,
            &mut self.warning,
            &mut self.success,
            &mut self.syntax.keyword,
            &mut self.syntax.string,
            &mut self.syntax.constant,
            &mut self.syntax.type_name,
            &mut self.syntax.preprocessor,
        ]
        .into_iter()
        .filter_map(Option::as_mut)
        .collect();
        out.extend(self.accents.values_mut());
        out.extend(self.swatches.values_mut());
        out.extend(self.sections.values_mut().flat_map(|m| m.values_mut()));
        out
    }

    /// The core colours, each checked; a missing or unreadable one comes from
    /// the fallback.
    pub fn palette(&self, diag: &Diag) -> Palette {
        let base = fallback_palette();
        let pick = |key: &str, value: &Option<String>, fallback: &String| color(diag, key, value).unwrap_or_else(|| fallback.clone());
        Palette {
            bg: pick("bg", &self.bg, &base.bg),
            surface: pick("surface", &self.surface, &base.surface),
            text: pick("text", &self.text, &base.text),
            dim_text: pick("dim_text", &self.dim_text, &base.dim_text),
            accent: pick("accent", &self.accent, &base.accent),
            border: pick("border", &self.border, &base.border),
            muted: pick("muted", &self.muted, &base.muted),
            highlight: pick("highlight", &self.highlight, &base.highlight),
            danger: pick("danger", &self.danger, &base.danger),
            glow: pick("glow", &self.glow, &base.glow),
            shadow: pick("shadow", &self.shadow, &base.shadow),
            light: self.light.unwrap_or(base.light),
        }
    }

    /// The rest of the look; what the file leaves out is derived from `p`.
    pub fn look(&self, p: &Palette, diag: &Diag) -> Look {
        let pick = |key: &str, value: &Option<String>, derived: String| color(diag, key, value).unwrap_or(derived);
        let swatches = swatches(&self.swatches, p.light, diag);
        // Accents may name a swatch (`files = "blue"`), so they follow the theme's
        // own version of that colour, Omarchy's included.
        let colors = |map: &BTreeMap<String, String>, scope: &str| -> BTreeMap<String, String> {
            map.iter()
                .filter_map(|(k, v)| {
                    let named = swatches.iter().find(|(n, _)| n == v).map(|(_, c)| c.clone());
                    named.or_else(|| color(diag, &format!("{scope}.{k}"), &Some(v.clone()))).map(|c| (k.clone(), c))
                })
                .collect()
        };
        let unit = |key: &str, v: Option<f64>, default: f64| match v {
            Some(x) if !(0.0..=1.0).contains(&x) || !x.is_finite() => {
                diag.error(key, format!("{x} is outside 0 to 1; using {default}"));
                default
            }
            Some(x) => x,
            None => default,
        };
        Look {
            panel: pick("panel", &self.panel, mix(&p.bg, &p.text, 0.025)),
            card: pick("card", &self.card, mix(&p.bg, &p.text, 0.055)),
            raised: pick("raised", &self.raised, mix(&p.bg, &p.text, 0.09)),
            popover: pick("popover", &self.popover, p.surface.clone()),
            text_tertiary: pick("text_tertiary", &self.text_tertiary, mix(&p.dim_text, &p.bg, 0.2)),
            divider: pick("divider", &self.divider, mix(&p.bg, &p.text, 0.08)),
            warning: pick("warning", &self.warning, if p.light { "#b7791f" } else { "#e5a50a" }.into()),
            success: pick("success", &self.success, if p.light { "#1f9e5c" } else { "#46d08a" }.into()),
            hover: unit("hover", self.hover, 0.07),
            selection: unit("selection", self.selection, 0.18),
            accents: colors(&self.accents, "accents"),
            sections: self.sections.iter().map(|(app, m)| (app.clone(), colors(m, &format!("sections.{app}")))).collect(),
            swatches: swatches.clone(),
            font: Font {
                ui: self.font.ui.clone(),
                mono: self.font.mono.clone(),
                weight: self.font.weight,
                heading_weight: self.font.heading_weight,
            },
            shape: Shape {
                radius_small: self.shape.radius_small.unwrap_or(6),
                radius_card: self.shape.radius_card.unwrap_or(10),
                radius_dialog: self.shape.radius_dialog.unwrap_or(14),
            },
            material: Material {
                surface: self.material.surface.unwrap_or(Surface::Solid),
                see_through: self.material.see_through.unwrap_or(false),
                blended: self.material.blended.unwrap_or(false),
            },
            icons: self.icons.pack.clone(),
            file_icon_colors: self.icons.file_colors.unwrap_or_default(),
            syntax: {
                let one = |key: &str, v: &Option<String>| {
                    v.as_ref().and_then(|v| colors(&BTreeMap::from([(key.to_string(), v.clone())]), "syntax").remove(key))
                };
                Syntax {
                    keyword: one("keyword", &self.syntax.keyword),
                    string: one("string", &self.syntax.string),
                    constant: one("constant", &self.syntax.constant),
                    type_name: one("type", &self.syntax.type_name),
                    preprocessor: one("preprocessor", &self.syntax.preprocessor),
                }
            },
        }
    }

    /// A complete file for `theme`, to edit.
    pub fn of(theme: &Theme) -> ThemeFile {
        let (p, l) = (&theme.palette, &theme.look);
        ThemeFile {
            name: Some(theme.name.clone()),
            inherits: None,
            light: Some(p.light),
            bg: Some(p.bg.clone()),
            surface: Some(p.surface.clone()),
            text: Some(p.text.clone()),
            dim_text: Some(p.dim_text.clone()),
            accent: Some(p.accent.clone()),
            border: Some(p.border.clone()),
            muted: Some(p.muted.clone()),
            highlight: Some(p.highlight.clone()),
            danger: Some(p.danger.clone()),
            glow: Some(p.glow.clone()),
            shadow: Some(p.shadow.clone()),
            panel: Some(l.panel.clone()),
            card: Some(l.card.clone()),
            raised: Some(l.raised.clone()),
            popover: Some(l.popover.clone()),
            text_tertiary: Some(l.text_tertiary.clone()),
            divider: Some(l.divider.clone()),
            warning: Some(l.warning.clone()),
            success: Some(l.success.clone()),
            hover: Some(l.hover),
            selection: Some(l.selection),
            accents: l.accents.clone(),
            sections: l.sections.clone(),
            swatches: l.swatches.iter().cloned().collect(),
            font: FontFile {
                ui: l.font.ui.clone(),
                mono: l.font.mono.clone(),
                weight: l.font.weight,
                heading_weight: l.font.heading_weight,
            },
            shape: ShapeFile {
                radius_small: Some(l.shape.radius_small),
                radius_card: Some(l.shape.radius_card),
                radius_dialog: Some(l.shape.radius_dialog),
            },
            material: MaterialFile {
                surface: Some(l.material.surface),
                see_through: Some(l.material.see_through),
                blended: Some(l.material.blended),
            },
            icons: IconsFile { pack: l.icons.clone(), file_colors: Some(l.file_icon_colors) },
            syntax: SyntaxFile {
                keyword: l.syntax.keyword.clone(),
                string: l.syntax.string.clone(),
                constant: l.syntax.constant.clone(),
                type_name: l.syntax.type_name.clone(),
                preprocessor: l.syntax.preprocessor.clone(),
            },
        }
    }

    pub fn theme(&self, id: &str, diag: &Diag) -> Theme {
        let palette = self.palette(diag);
        let look = self.look(&palette, diag);
        Theme { id: id.into(), name: self.name.clone().unwrap_or_else(|| id.into()), palette, look }
    }
}

/// A theme's swatches in [`SWATCH_NAMES`] order, the defaults filling any name it
/// leaves out, then any extra names it adds.
fn swatches(own: &BTreeMap<String, String>, light: bool, diag: &Diag) -> Vec<(String, String)> {
    let own: BTreeMap<String, String> = own
        .iter()
        .filter(|(k, v)| color(diag, &format!("swatches.{k}"), &Some((*v).clone())).is_some())
        .map(|(k, v)| (k.clone(), v.clone()))
        .collect();
    let defaults = if light { LIGHT_SWATCHES } else { DARK_SWATCHES };
    let mut out: Vec<(String, String)> = SWATCH_NAMES
        .iter()
        .zip(defaults)
        .map(|(name, c)| ((*name).to_string(), own.get(*name).cloned().unwrap_or_else(|| c.to_string())))
        .collect();
    out.extend(own.iter().filter(|(k, _)| !SWATCH_NAMES.contains(&k.as_str())).map(|(k, v)| (k.clone(), v.clone())));
    out
}

/// A theme id as it is now: the shipped Nixe Dark and Light were renamed to
/// Nyx, and settings saved before that still name them `nixe-*`.
pub fn current_id(id: &str) -> &str {
    match id {
        "nixe-dark" => "nyx-dark",
        "nixe-light" => "nyx-light",
        _ => id,
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn partial_file_keeps_the_rest() {
        let d = Diag::new("test");
        let base = ThemeFile::parse(crate::registry::shipped_text("nyx-dark").unwrap(), &d).unwrap();
        let top = ThemeFile::parse("accent = \"#ff0000\"\nbg = \"not a colour\"\n[accents]\nfiles = \"#00ff00\"", &d).unwrap();
        let t = top.over(&base).theme("nyx-dark", &d);
        let shipped = base.theme("nyx-dark", &d);
        assert_eq!(t.palette.accent, "#ff0000");
        assert_eq!(t.palette.bg, fallback_palette().bg, "a bad colour falls back");
        assert!(d.take().iter().any(|i| i.key == "bg"), "and is reported");
        assert_eq!(t.palette.text, shipped.palette.text, "a missing key keeps the shipped value");
        assert_eq!(t.look.accents["files"], "#00ff00");
        assert_eq!(t.look.accents.get("mail"), shipped.look.accents.get("mail"), "other accents stay");
        assert_eq!(t.look.font, shipped.look.font);
    }

    #[test]
    fn derives_what_a_theme_leaves_out() {
        let d = Diag::new("test");
        let t = ThemeFile::parse("bg = \"#000000\"\ntext = \"#ffffff\"", &d).unwrap().theme("x", &d);
        assert_eq!(t.look.card, "#0e0e0e");
        assert_eq!(t.look.shape.radius_card, 10);
        assert_eq!(t.look.material.surface, Surface::Solid);
        assert!(t.look.font.ui.is_none(), "no font unless the theme sets one");
    }

    #[test]
    fn full_copy_round_trips() {
        let d = Diag::new("test");
        for theme in crate::bundled() {
            let text = toml::to_string_pretty(&ThemeFile::of(&theme)).unwrap();
            let back = ThemeFile::parse(&text, &d).unwrap().theme(&theme.id, &d);
            assert_eq!(back.palette, theme.palette, "{}", theme.id);
            assert_eq!(back.look, theme.look, "{}", theme.id);
        }
    }

    #[test]
    fn swatches_keep_their_names_across_themes() {
        for theme in crate::bundled() {
            let names: Vec<_> = theme.look.swatches.iter().take(SWATCH_NAMES.len()).map(|(n, _)| n.as_str()).collect();
            assert_eq!(names, SWATCH_NAMES, "{}", theme.id);
        }
        let light = crate::bundled().into_iter().find(|t| t.id == "nyx-light").unwrap();
        assert_eq!(light.look.swatches[0], ("blue".to_string(), "#136dcd".to_string()));
    }

    #[test]
    fn old_ids_name_the_renamed_themes() {
        assert_eq!(current_id("nixe-dark"), "nyx-dark");
        assert_eq!(current_id("nixe-light"), "nyx-light");
        assert_eq!(current_id("nord"), "nord");
    }

    #[test]
    fn unknown_keys_and_bad_tints_are_rejected() {
        let d = Diag::new("test");
        assert!(ThemeFile::parse("acent = \"#ff0000\"", &d).is_none());
        let t = ThemeFile::parse("hover = 4.0", &d).unwrap().theme("x", &d);
        assert_eq!(t.look.hover, 0.07);
        assert!(d.take().iter().any(|i| i.key == "hover"));
    }
}
