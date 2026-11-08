//! One theme file as a layer. Schema 1 files and schema 2 packages both become
//! layers; resolving a theme stacks its inheritance chain's layers, base first,
//! then reads the result once.

use crate::schema::{Diag, EffectsFile, GeometryFile, MotionFile, PackageFile, TypographyFile};
use crate::v1::{ThemeFile, layer};
use std::collections::BTreeMap;

#[derive(Debug, Clone, Default)]
pub struct Layer {
    /// Named source colours (`palette.<name>` references).
    pub palette: BTreeMap<String, String>,
    /// Colours and look, in schema 1 terms; tokens with an established name land here.
    pub file: ThemeFile,
    /// Tokens without an established name (`border.focus`, `status.info`, …).
    pub tokens: BTreeMap<String, String>,
    pub typography: TypographyFile,
    pub geometry: GeometryFile,
    pub motion: MotionFile,
    pub effects: EffectsFile,
}

/// Put a token value on its established name, if it has one.
fn project(file: &mut ThemeFile, token: &str, value: &str) -> bool {
    let slot = match token {
        "surface.primary" => &mut file.bg,
        "surface.alternate" => &mut file.surface,
        "surface.secondary" => &mut file.panel,
        "surface.tertiary" => &mut file.card,
        "surface.elevated" => &mut file.raised,
        "surface.overlay" => &mut file.popover,
        "text.primary" => &mut file.text,
        "text.secondary" => &mut file.dim_text,
        "text.tertiary" => &mut file.text_tertiary,
        "border.default" => &mut file.border,
        "border.subtle" => &mut file.divider,
        "border.strong" => &mut file.muted,
        "accent.primary" => &mut file.accent,
        "accent.secondary" => &mut file.glow,
        "state.selected" => &mut file.highlight,
        "status.success" => &mut file.success,
        "status.warning" => &mut file.warning,
        "status.error" => &mut file.danger,
        "shadow.color" => &mut file.shadow,
        _ => return false,
    };
    *slot = Some(value.to_string());
    true
}

impl Layer {
    pub fn from_v1(file: ThemeFile) -> Layer {
        Layer { file, ..Layer::default() }
    }

    /// A user's token overrides (`[tokens]` in `theme.toml`) as a layer.
    pub fn from_tokens(tokens: &BTreeMap<String, String>) -> Layer {
        let mut layer = Layer::default();
        for (k, v) in tokens {
            if !project(&mut layer.file, k, v) {
                layer.tokens.insert(k.clone(), v.clone());
            }
        }
        layer
    }

    pub fn from_package(pkg: &PackageFile) -> Layer {
        let mut file = ThemeFile {
            name: Some(pkg.name.clone()),
            light: pkg.appearance.map(|a| a == crate::Appearance::Light),
            accents: pkg.accents.clone(),
            sections: pkg.sections.clone(),
            swatches: pkg.swatches.clone(),
            syntax: pkg.syntax.clone(),
            icons: pkg.icons.clone(),
            hover: pkg.effects.hover,
            selection: pkg.effects.selection,
            ..ThemeFile::default()
        };
        file.font.ui = pkg.typography.ui.clone();
        file.font.mono = pkg.typography.mono.clone();
        file.font.weight = pkg.typography.weight;
        file.font.heading_weight = pkg.typography.heading_weight;
        file.shape.radius_small = pkg.geometry.radius_small;
        file.shape.radius_card = pkg.geometry.radius_card;
        file.shape.radius_dialog = pkg.geometry.radius_dialog;
        file.material.surface = pkg.effects.surface;
        file.material.see_through = pkg.effects.see_through;
        file.material.blended = pkg.effects.blended;
        let mut tokens = BTreeMap::new();
        for (k, v) in &pkg.tokens {
            if !project(&mut file, k, v) {
                tokens.insert(k.clone(), v.clone());
            }
        }
        Layer {
            palette: pkg.palette.clone(),
            file,
            tokens,
            typography: TypographyFile { roles: pkg.typography.roles.clone(), ..TypographyFile::default() },
            geometry: GeometryFile {
                radius_small: None,
                radius_card: None,
                radius_dialog: None,
                ..pkg.geometry.clone()
            },
            motion: pkg.motion.clone(),
            effects: EffectsFile {
                surface_opacity: pkg.effects.surface_opacity,
                shadow_intensity: pkg.effects.shadow_intensity,
                blur: pkg.effects.blur,
                overlay_dim: pkg.effects.overlay_dim,
                ..EffectsFile::default()
            },
        }
    }

    /// This layer over `base`.
    pub fn over(&self, base: &Layer) -> Layer {
        let mut out = base.clone();
        out.palette.extend(self.palette.clone());
        out.file = self.file.over(&base.file);
        out.tokens.extend(self.tokens.clone());
        for (role, r) in &self.typography.roles {
            let slot = out.typography.roles.entry(role.clone()).or_default();
            layer!(slot, r; size, weight, line_height, letter_spacing);
        }
        layer!(out.geometry, self.geometry; spacing_unit, control_height, border_width, focus_width, padding);
        layer!(out.motion, self.motion; fast, normal, slow, easing_standard, easing_enter, easing_exit);
        layer!(out.effects, self.effects; surface_opacity, shadow_intensity, blur, overlay_dim);
        out
    }

    /// Replace `palette.<name>` references with the colours they name.
    pub fn deref(&mut self, diag: &Diag) {
        for (name, value) in &self.palette {
            if !crate::color::is_color(value) {
                diag.error(format!("palette.{name}"), format!("{value:?} is not a colour"));
            }
        }
        let palette = self.palette.clone();
        let resolve = |v: &mut String| {
            if let Some(name) = v.strip_prefix("palette.") {
                match palette.get(name) {
                    Some(c) => *v = c.clone(),
                    None => diag.error(name.to_string(), format!("refers to palette.{name}, which the palette doesn't have")),
                }
            }
        };
        for v in self.file.colours_mut() {
            resolve(v);
        }
        for v in self.tokens.values_mut() {
            resolve(v);
        }
    }
}
