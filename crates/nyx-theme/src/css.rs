//! The resolved theme as GTK CSS: the established `@theme_*` names, the semantic
//! tokens as `@nyx_*` colours and `--nyx-*` properties, and libadwaita's named
//! colours for apps that opt in.

use crate::Rgb;
use nyx_theme_core::{Look, Palette, Tokens};

/// `text.onAccent` → `nyx_text_on_accent`.
pub fn token_name(token: &str) -> String {
    let mut out = String::from("nyx_");
    for c in token.chars() {
        match c {
            '.' => out.push('_'),
            c if c.is_ascii_uppercase() => {
                out.push('_');
                out.push(c.to_ascii_lowercase());
            }
            c => out.push(c),
        }
    }
    out
}

/// The look as CSS for one app: extra colours as `@theme_*`, the app's accent
/// as `@theme_app_accent`, radii and tint strengths as `--nyx-*` properties on
/// its window, and its fonts when the theme sets them.
pub fn look_css(window_class: &str, app_accent: &str, look: &Look) -> String {
    let mut css = format!(
        "@define-color theme_panel {};\n@define-color theme_card {};\n@define-color theme_raised {};\n\
         @define-color theme_popover {};\n@define-color theme_text_tertiary {};\n@define-color theme_divider {};\n\
         @define-color theme_warning {};\n@define-color theme_success {};\n@define-color theme_app_accent {};\n",
        look.panel,
        look.card,
        look.raised,
        look.popover,
        look.text_tertiary,
        look.divider,
        look.warning,
        look.success,
        app_accent,
    );
    css.push_str(&format!(
        "window.{window_class} {{ --nyx-radius-small: {}px; --nyx-radius-card: {}px; --nyx-radius-dialog: {}px; \
         --nyx-hover: {}; --nyx-selection: {};",
        look.shape.radius_small, look.shape.radius_card, look.shape.radius_dialog, look.hover, look.selection,
    ));
    if let Some(ui) = &look.font.ui {
        css.push_str(&format!(" font-family: {}, sans-serif;", font_stack(ui)));
    }
    if let Some(weight) = look.font.weight {
        css.push_str(&format!(" font-weight: {weight};"));
    }
    css.push_str(" }\n");
    // Each section's colour on what carries its class (`.section-network`): the
    // sidebar's group heading, its line, and the divider of the icon-only sidebar.
    // Every swatch is a section too (`.section-swatch-blue`), for headings that come
    // from accounts and sources rather than the app's fixed groups.
    let app = window_class.strip_suffix("-window").unwrap_or(window_class);
    let swatches = look.swatches.iter().map(|(name, c)| (format!("swatch-{name}"), c));
    let sections = look.sections.get(app).into_iter().flatten().map(|(name, c)| (name.clone(), c));
    for (name, c) in swatches.chain(sections) {
        let name: String = name.chars().filter(|ch| ch.is_ascii_alphanumeric() || *ch == '-').collect();
        css.push_str(&format!(
            "window.{window_class} .section-{name} {{ color: {c}; }}\n\
             window.{window_class} .nav-group.section-{name} {{ border-bottom-color: alpha({c}, 0.35); }}\n\
             window.{window_class} separator.nav-divider.section-{name} {{ background: alpha({c}, 0.6); }}\n"
        ));
    }
    if let Some(mono) = &look.font.mono {
        css.push_str(&format!(
            "window.{window_class} .monospace, window.{window_class} .mono, window.{window_class} .code-block {{ font-family: {}, monospace; }}\n",
            font_stack(mono)
        ));
    }
    css
}

/// The semantic tokens: every colour as `@nyx_<token>`, and geometry, motion and
/// effects as `--nyx-*` properties on the app's window, plus the focus ring a
/// theme can't take away.
pub fn tokens_css(window_class: &str, tokens: &Tokens) -> String {
    let mut css = String::new();
    for (token, value) in &tokens.colors {
        css.push_str(&format!("@define-color {} {value};\n", token_name(token)));
    }
    let g = &tokens.geometry;
    let m = &tokens.motion;
    let e = &tokens.effects;
    css.push_str(&format!("window.{window_class} {{"));
    for (name, px) in &g.spacing {
        css.push_str(&format!(" --nyx-space-{name}: {px}px;"));
    }
    css.push_str(&format!(
        " --nyx-control-height: {}px; --nyx-border-width: {}px; --nyx-focus-width: {}px; --nyx-padding: {}px;\
         \x20--nyx-motion-fast: {}ms; --nyx-motion-normal: {}ms; --nyx-motion-slow: {}ms;\
         \x20--nyx-easing-standard: {}; --nyx-easing-enter: {}; --nyx-easing-exit: {};\
         \x20--nyx-surface-opacity: {}; --nyx-shadow-intensity: {}; --nyx-overlay-dim: {}; }}\n",
        g.control_height,
        g.border_width,
        g.focus_width,
        g.padding,
        m.fast,
        m.normal,
        m.slow,
        m.easing_standard,
        m.easing_enter,
        m.easing_exit,
        e.surface_opacity,
        e.shadow_intensity,
        e.overlay_dim,
    ));
    css.push_str(&format!(
        "window.{window_class} :focus-visible {{ outline-color: @nyx_border_focus; outline-width: {}px; }}\n",
        g.focus_width
    ));
    css
}

/// A theme's font names, comma-separated with the preferred first (the same
/// family is installed under different names: "Inter", "Inter Variable",
/// Google's static "Inter 18pt"), as quoted CSS families.
pub fn font_stack(names: &str) -> String {
    names
        .split(',')
        .map(|n| n.trim().replace(['"', '\\'], ""))
        .filter(|n| !n.is_empty())
        .map(|n| format!("\"{n}\""))
        .collect::<Vec<_>>()
        .join(", ")
}

/// The theme as libadwaita's named colours, for apps (and dialogs in other
/// processes) built on libadwaita. Only libadwaita's documented colour names are
/// set, never its internal selectors.
pub fn adwaita_css(p: &Palette, look: &Look) -> String {
    let shade = |a: f64| {
        let s = Rgb::hex(&p.shadow);
        format!("rgba({}, {}, {}, {a})", (s.0 * 255.0).round(), (s.1 * 255.0).round(), (s.2 * 255.0).round())
    };
    let on_accent = if p.light { "#ffffff".to_string() } else { p.bg.clone() };
    let colors: Vec<(&str, String)> = vec![
        ("accent_bg_color", p.accent.clone()),
        ("accent_color", p.accent.clone()),
        ("accent_fg_color", on_accent.clone()),
        ("destructive_bg_color", p.danger.clone()),
        ("destructive_color", p.danger.clone()),
        ("destructive_fg_color", on_accent.clone()),
        ("error_bg_color", p.danger.clone()),
        ("error_color", p.danger.clone()),
        ("error_fg_color", on_accent.clone()),
        ("success_bg_color", look.success.clone()),
        ("success_color", look.success.clone()),
        ("success_fg_color", on_accent.clone()),
        ("warning_bg_color", look.warning.clone()),
        ("warning_color", look.warning.clone()),
        ("warning_fg_color", on_accent),
        ("window_bg_color", p.bg.clone()),
        ("window_fg_color", p.text.clone()),
        ("view_bg_color", look.card.clone()),
        ("view_fg_color", p.text.clone()),
        ("headerbar_bg_color", p.bg.clone()),
        ("headerbar_fg_color", p.text.clone()),
        ("headerbar_border_color", p.border.clone()),
        ("headerbar_backdrop_color", p.bg.clone()),
        ("headerbar_shade_color", shade(0.4)),
        ("headerbar_darker_shade_color", shade(0.8)),
        ("sidebar_bg_color", look.panel.clone()),
        ("sidebar_fg_color", p.text.clone()),
        ("sidebar_backdrop_color", look.panel.clone()),
        ("sidebar_border_color", shade(0.4)),
        ("sidebar_shade_color", shade(0.35)),
        ("card_bg_color", look.card.clone()),
        ("card_fg_color", p.text.clone()),
        ("card_shade_color", shade(0.4)),
        ("dialog_bg_color", p.bg.clone()),
        ("dialog_fg_color", p.text.clone()),
        ("popover_bg_color", look.popover.clone()),
        ("popover_fg_color", p.text.clone()),
        ("popover_shade_color", shade(0.4)),
        ("thumbnail_bg_color", look.card.clone()),
        ("thumbnail_fg_color", p.text.clone()),
        ("active_toggle_bg_color", look.raised.clone()),
        ("active_toggle_fg_color", p.text.clone()),
        ("shade_color", shade(0.35)),
        ("theme_selected_bg_color", p.highlight.clone()),
        ("theme_selected_fg_color", p.text.clone()),
        ("link_color", p.accent.clone()),
    ];
    let mut css = String::new();
    for (name, value) in &colors {
        css.push_str(&format!("@define-color {name} {value};\n"));
    }
    css.push_str(":root {\n");
    for (name, value) in &colors {
        css.push_str(&format!("  --{}: {value};\n", name.replace('_', "-")));
    }
    if let Some(font) = &look.font.ui {
        css.push_str(&format!("}}\nwindow, dialog {{ font-family: \"{}\"; }}\n", font.replace('"', "")));
    } else {
        css.push_str("}\n");
    }
    css
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn token_names() {
        assert_eq!(token_name("surface.primary"), "nyx_surface_primary");
        assert_eq!(token_name("text.onAccent"), "nyx_text_on_accent");
    }
}
