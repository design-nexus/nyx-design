//! Nyx Design 2.0 semantic tokens: the complete, resolved set every adapter
//! reads (`surface.primary`, `text.secondary`, `motion.normal`, …). They are
//! derived from a theme's palette and look, then the theme's explicit tokens win.
//! The established GTK names (`@theme_bg`, …) are generated from them, see
//! [`LEGACY`].

use crate::color::{Color, is_color, mix, with_contrast};
use crate::model::{Surface, Theme};
use crate::schema::{Diag, EffectsFile, GeometryFile, MotionFile, TypographyFile};
use serde::{Deserialize, Serialize};
use std::collections::BTreeMap;

/// Every colour token, in documentation order.
pub const COLOR_TOKENS: &[&str] = &[
    "surface.primary",
    "surface.secondary",
    "surface.tertiary",
    "surface.elevated",
    "surface.overlay",
    "surface.alternate",
    "surface.inverse",
    "text.primary",
    "text.secondary",
    "text.tertiary",
    "text.disabled",
    "text.inverse",
    "text.onAccent",
    "border.default",
    "border.subtle",
    "border.strong",
    "border.focus",
    "accent.primary",
    "accent.secondary",
    "accent.hover",
    "accent.pressed",
    "accent.subtle",
    "state.hover",
    "state.pressed",
    "state.selected",
    "state.disabled",
    "status.success",
    "status.warning",
    "status.error",
    "status.info",
    "shadow.color",
    "scrim.color",
    "selection.background",
    "selection.foreground",
    "brand.logo",
];

/// The established colour names and the token each one is. Setting the token in a
/// theme sets the name; resolving writes the token back to it, so the 2.0 sheet
/// and every app stylesheet see the resolved colours.
pub const LEGACY: &[(&str, &str)] = &[
    ("bg", "surface.primary"),
    ("surface", "surface.alternate"),
    ("panel", "surface.secondary"),
    ("card", "surface.tertiary"),
    ("raised", "surface.elevated"),
    ("popover", "surface.overlay"),
    ("text", "text.primary"),
    ("dim_text", "text.secondary"),
    ("text_tertiary", "text.tertiary"),
    ("border", "border.default"),
    ("divider", "border.subtle"),
    ("muted", "border.strong"),
    ("accent", "accent.primary"),
    ("glow", "accent.secondary"),
    ("highlight", "state.selected"),
    ("success", "status.success"),
    ("warning", "status.warning"),
    ("danger", "status.error"),
    ("shadow", "shadow.color"),
];

/// Typography roles every theme resolves.
pub const TYPE_ROLES: &[&str] = &["display", "heading", "body", "caption", "label", "monospace"];

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct TypeRole {
    /// `ui` or `mono`.
    pub family: String,
    /// em, relative to the interface font size.
    pub size: f64,
    pub weight: u16,
    pub line_height: f64,
    /// em.
    pub letter_spacing: f64,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct Typography {
    /// Interface families, preferred first; `None` keeps the system font.
    pub ui: Option<String>,
    pub mono: Option<String>,
    pub roles: BTreeMap<String, TypeRole>,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct Geometry {
    pub radius_small: u32,
    pub radius_card: u32,
    pub radius_dialog: u32,
    pub spacing_unit: u32,
    /// `xxs` … `xxl`, px.
    pub spacing: BTreeMap<String, u32>,
    pub control_height: u32,
    pub border_width: u32,
    pub focus_width: u32,
    pub padding: u32,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct Motion {
    /// ms; 0 with reduced motion.
    pub fast: u32,
    pub normal: u32,
    pub slow: u32,
    pub easing_standard: String,
    pub easing_enter: String,
    pub easing_exit: String,
    /// The system asked for reduced motion; adapters skip animation.
    pub reduced: bool,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct Effects {
    pub surface: Surface,
    pub see_through: bool,
    pub blended: bool,
    pub hover: f64,
    pub selection: f64,
    pub surface_opacity: f64,
    pub shadow_intensity: f64,
    /// A preference only: whether it shows depends on the compositor and toolkit.
    pub blur: bool,
    pub overlay_dim: f64,
}

/// A complete resolved token set.
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct Tokens {
    pub colors: BTreeMap<String, String>,
    pub typography: Typography,
    pub geometry: Geometry,
    pub motion: Motion,
    pub effects: Effects,
}

impl Tokens {
    pub fn color(&self, token: &str) -> &str {
        self.colors.get(token).map(String::as_str).unwrap_or("#ff00ff")
    }
}

/// Accessibility preferences that apply over any theme.
#[derive(Debug, Clone, Default, PartialEq, Serialize, Deserialize)]
pub struct A11y {
    pub reduce_motion: bool,
    pub high_contrast: bool,
}

/// Whether `s` is a CSS easing this engine passes on.
pub fn valid_easing(s: &str) -> bool {
    let s = s.trim();
    if matches!(s, "linear" | "ease" | "ease-in" | "ease-out" | "ease-in-out") {
        return true;
    }
    let Some(args) = s.strip_prefix("cubic-bezier(").and_then(|r| r.strip_suffix(')')) else { return false };
    let n: Vec<f64> = args.split(',').filter_map(|a| a.trim().parse().ok()).collect();
    n.len() == 4 && n.iter().all(|v| v.is_finite()) && (0.0..=1.0).contains(&n[0]) && (0.0..=1.0).contains(&n[2])
}

fn ranged<T: PartialOrd + Copy + std::fmt::Display>(diag: &Diag, key: &str, v: Option<T>, lo: T, hi: T, default: T) -> T {
    match v {
        Some(x) if x < lo || x > hi => {
            diag.error(key, format!("{x} is outside {lo} to {hi}; using {default}"));
            default
        }
        Some(x) => x,
        None => default,
    }
}

fn ranged_f(diag: &Diag, key: &str, v: Option<f64>, lo: f64, hi: f64, default: f64) -> f64 {
    match v {
        Some(x) if !x.is_finite() || x < lo || x > hi => {
            diag.error(key, format!("{x} is outside {lo} to {hi}; using {default}"));
            default
        }
        Some(x) => x,
        None => default,
    }
}

/// The token set for `theme`, with `explicit` colour tokens (already checked to be
/// colours and known names) over the derived ones.
pub(crate) fn derive(
    theme: &mut Theme,
    explicit: &BTreeMap<String, String>,
    typography: &TypographyFile,
    geometry: &GeometryFile,
    motion: &MotionFile,
    effects: &EffectsFile,
    diag: &Diag,
) -> Tokens {
    let (p, l) = (&theme.palette, &theme.look);
    let on_accent = if p.light { "#ffffff".to_string() } else { p.bg.clone() };
    let info = l.swatches.iter().find(|(n, _)| n == "teal" || n == "blue").map(|(_, c)| c.clone()).unwrap_or(p.accent.clone());
    let derived: [(&str, String); 35] = [
        ("surface.primary", p.bg.clone()),
        ("surface.secondary", l.panel.clone()),
        ("surface.tertiary", l.card.clone()),
        ("surface.elevated", l.raised.clone()),
        ("surface.overlay", l.popover.clone()),
        ("surface.alternate", p.surface.clone()),
        ("surface.inverse", p.text.clone()),
        ("text.primary", p.text.clone()),
        ("text.secondary", p.dim_text.clone()),
        ("text.tertiary", l.text_tertiary.clone()),
        ("text.disabled", mix(&l.text_tertiary, &p.bg, 0.35)),
        ("text.inverse", p.bg.clone()),
        ("text.onAccent", on_accent),
        ("border.default", p.border.clone()),
        ("border.subtle", l.divider.clone()),
        ("border.strong", p.muted.clone()),
        ("border.focus", p.accent.clone()),
        ("accent.primary", p.accent.clone()),
        ("accent.secondary", p.glow.clone()),
        ("accent.hover", mix(&p.accent, &p.text, 0.12)),
        ("accent.pressed", mix(&p.accent, &p.bg, 0.2)),
        ("accent.subtle", mix(&p.bg, &p.accent, l.selection)),
        ("state.hover", mix(&p.bg, &p.accent, l.hover)),
        ("state.pressed", mix(&p.bg, &p.accent, (l.selection + 0.06).min(1.0))),
        ("state.selected", p.highlight.clone()),
        ("state.disabled", mix(&p.bg, &p.text, 0.06)),
        ("status.success", l.success.clone()),
        ("status.warning", l.warning.clone()),
        ("status.error", p.danger.clone()),
        ("status.info", info),
        ("shadow.color", p.shadow.clone()),
        ("scrim.color", mix(&p.bg, &p.shadow, 0.45)),
        ("selection.background", mix(&p.bg, &p.accent, 0.3)),
        ("selection.foreground", p.text.clone()),
        // The logo's themeable parts (the Nyx mark's rim): the accent unless the theme says.
        ("brand.logo", p.accent.clone()),
    ];
    let mut colors: BTreeMap<String, String> = derived.into_iter().map(|(k, v)| (k.to_string(), v)).collect();
    for (k, v) in explicit {
        colors.insert(k.clone(), v.clone());
    }

    let weight = ranged(diag, "typography.weight", l.font.weight, 100, 900, 400);
    let heading = ranged(diag, "typography.heading_weight", l.font.heading_weight, 100, 900, 600);
    let defaults: [(&str, &str, f64, u16, f64); 6] = [
        ("display", "ui", 1.6, heading, 1.2),
        ("heading", "ui", 1.15, heading, 1.25),
        ("body", "ui", 1.0, weight, 1.4),
        ("caption", "ui", 0.846, weight, 1.35),
        ("label", "ui", 0.885, 500.max(weight), 1.3),
        ("monospace", "mono", 0.95, weight, 1.4),
    ];
    for name in typography.roles.keys() {
        if !TYPE_ROLES.contains(&name.as_str()) {
            diag.error(format!("typography.roles.{name}"), format!("unknown role; roles are {}", TYPE_ROLES.join(", ")));
        }
    }
    let roles = defaults
        .iter()
        .map(|(name, family, size, w, lh)| {
            let own = typography.roles.get(*name).cloned().unwrap_or_default();
            let key = |k: &str| format!("typography.roles.{name}.{k}");
            (
                (*name).to_string(),
                TypeRole {
                    family: (*family).to_string(),
                    size: ranged_f(diag, &key("size"), own.size, 0.6, 3.0, *size),
                    weight: ranged(diag, &key("weight"), own.weight, 100, 900, *w),
                    line_height: ranged_f(diag, &key("line_height"), own.line_height, 0.9, 2.5, *lh),
                    letter_spacing: ranged_f(diag, &key("letter_spacing"), own.letter_spacing, -0.1, 0.3, 0.0),
                },
            )
        })
        .collect();

    let shape = theme.look.shape.clone();
    let radius = |key: &str, v: u8, default: u8| ranged(diag, key, Some(v), 0, 32, default);
    theme.look.shape.radius_small = radius("geometry.radius_small", shape.radius_small, 6);
    theme.look.shape.radius_card = radius("geometry.radius_card", shape.radius_card, 10);
    theme.look.shape.radius_dialog = radius("geometry.radius_dialog", shape.radius_dialog, 14);
    let unit = ranged(diag, "geometry.spacing_unit", geometry.spacing_unit, 2, 8, 4);
    let spacing = [("xxs", 1), ("xs", 2), ("sm", 3), ("md", 4), ("lg", 6), ("xl", 8), ("xxl", 12)]
        .into_iter()
        .map(|(n, m)| (n.to_string(), unit * m))
        .collect();
    let geometry = Geometry {
        radius_small: theme.look.shape.radius_small.into(),
        radius_card: theme.look.shape.radius_card.into(),
        radius_dialog: theme.look.shape.radius_dialog.into(),
        spacing_unit: unit,
        spacing,
        control_height: ranged(diag, "geometry.control_height", geometry.control_height, 24, 56, 32),
        border_width: ranged(diag, "geometry.border_width", geometry.border_width, 0, 4, 1),
        // Keyboard focus must stay visible: a theme can't take the ring away.
        focus_width: ranged(diag, "geometry.focus_width", geometry.focus_width, 1, 4, 2),
        padding: ranged(diag, "geometry.padding", geometry.padding, 4, 32, 12),
    };

    let easing = |key: &str, v: &Option<String>, default: &str| match v {
        Some(e) if !valid_easing(e) => {
            diag.error(key, format!("{e:?} isn't an easing (linear, ease, ease-in, ease-out, ease-in-out or cubic-bezier(…))"));
            default.to_string()
        }
        Some(e) => e.trim().to_string(),
        None => default.to_string(),
    };
    let fast = ranged(diag, "motion.fast", motion.fast, 0, 2000, 80);
    let normal = ranged(diag, "motion.normal", motion.normal, 0, 2000, 120);
    let slow = ranged(diag, "motion.slow", motion.slow, 0, 2000, 220);
    if !(fast <= normal && normal <= slow) {
        diag.warn("motion", "fast, normal and slow are usually in that order");
    }
    let motion = Motion {
        fast,
        normal,
        slow,
        easing_standard: easing("motion.easing_standard", &motion.easing_standard, "ease-out"),
        easing_enter: easing("motion.easing_enter", &motion.easing_enter, "ease-out"),
        easing_exit: easing("motion.easing_exit", &motion.easing_exit, "ease-in"),
        reduced: false,
    };

    let m = &theme.look.material;
    let effects = Effects {
        surface: m.surface,
        see_through: m.see_through,
        blended: m.blended,
        hover: theme.look.hover,
        selection: theme.look.selection,
        surface_opacity: ranged_f(diag, "effects.surface_opacity", effects.surface_opacity, 0.5, 1.0, 1.0),
        shadow_intensity: ranged_f(diag, "effects.shadow_intensity", effects.shadow_intensity, 0.0, 1.0, 0.5),
        blur: effects.blur.unwrap_or(false),
        overlay_dim: ranged_f(diag, "effects.overlay_dim", effects.overlay_dim, 0.0, 1.0, 0.45),
    };

    let typography = Typography { ui: theme.look.font.ui.clone(), mono: theme.look.font.mono.clone(), roles };
    Tokens { colors, typography, geometry, motion, effects }
}

/// Write the colour tokens back to the established names.
pub(crate) fn sync_legacy(theme: &mut Theme, tokens: &Tokens) {
    let p = &mut theme.palette;
    let l = &mut theme.look;
    for (name, token) in LEGACY {
        let v = tokens.color(token).to_string();
        let slot = match *name {
            "bg" => &mut p.bg,
            "surface" => &mut p.surface,
            "text" => &mut p.text,
            "dim_text" => &mut p.dim_text,
            "accent" => &mut p.accent,
            "border" => &mut p.border,
            "muted" => &mut p.muted,
            "highlight" => &mut p.highlight,
            "danger" => &mut p.danger,
            "glow" => &mut p.glow,
            "shadow" => &mut p.shadow,
            "panel" => &mut l.panel,
            "card" => &mut l.card,
            "raised" => &mut l.raised,
            "popover" => &mut l.popover,
            "text_tertiary" => &mut l.text_tertiary,
            "divider" => &mut l.divider,
            "warning" => &mut l.warning,
            "success" => &mut l.success,
            _ => continue,
        };
        *slot = v;
    }
}

/// Accessibility over the theme: reduced motion stops animation; high contrast
/// raises text and lines to WCAG AAA/AA levels and keeps areas separated, without
/// replacing the theme's colours wholesale.
pub(crate) fn apply_a11y(tokens: &mut Tokens, a11y: &A11y) {
    if a11y.reduce_motion {
        tokens.motion.reduced = true;
        tokens.motion.fast = 0;
        tokens.motion.normal = 0;
        tokens.motion.slow = 0;
    }
    if a11y.high_contrast {
        let bg = tokens.color("surface.primary").to_string();
        let c = &mut tokens.colors;
        let raise = |c: &mut BTreeMap<String, String>, token: &str, against: &str, ratio: f64| {
            if let Some(v) = c.get(token).cloned() {
                c.insert(token.to_string(), with_contrast(&v, against, ratio));
            }
        };
        for surface in ["surface.primary", "surface.secondary", "surface.tertiary", "surface.overlay"] {
            let s = c.get(surface).cloned().unwrap_or_else(|| bg.clone());
            raise(c, "text.primary", &s, 7.0);
            raise(c, "text.secondary", &s, 4.5);
            raise(c, "text.tertiary", &s, 4.5);
        }
        raise(c, "text.disabled", &bg, 3.0);
        raise(c, "border.default", &bg, 3.0);
        raise(c, "border.subtle", &bg, 1.6);
        raise(c, "border.focus", &bg, 3.0);
        raise(c, "accent.primary", &bg, 3.0);
        let accent = c.get("accent.primary").cloned().unwrap_or_default();
        raise(c, "text.onAccent", &accent, 4.5);
        tokens.geometry.focus_width = tokens.geometry.focus_width.max(3);
        tokens.geometry.border_width = tokens.geometry.border_width.max(1);
        tokens.effects.blended = false;
        tokens.effects.surface_opacity = 1.0;
    }
}

/// Whether `token` names a colour token.
pub fn is_color_token(token: &str) -> bool {
    COLOR_TOKENS.contains(&token)
}

/// Check explicit colour tokens: known names, colour values.
pub(crate) fn check_explicit(tokens: &BTreeMap<String, String>, diag: &Diag) -> BTreeMap<String, String> {
    tokens
        .iter()
        .filter(|(k, v)| {
            if !is_color_token(k) {
                diag.error(format!("tokens.{k}"), "unknown token; see the list in the theme author guide");
                false
            } else if !is_color(v) {
                diag.error(format!("tokens.{k}"), format!("{v:?} is not a colour"));
                false
            } else {
                true
            }
        })
        .map(|(k, v)| (k.clone(), Color::parse(v).map(|c| c.to_hex()).unwrap_or_else(|| v.clone())))
        .collect()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn easings() {
        for ok in ["ease-out", "cubic-bezier(0.2, 0, 0, 1)", "linear"] {
            assert!(valid_easing(ok), "{ok}");
        }
        for bad in ["bounce", "cubic-bezier(2,0,0,1)", "cubic-bezier(0,0,0)", "steps(4)"] {
            assert!(!valid_easing(bad), "{bad}");
        }
    }

    #[test]
    fn every_legacy_name_has_a_token() {
        for (_, t) in LEGACY {
            assert!(is_color_token(t), "{t}");
        }
    }
}
