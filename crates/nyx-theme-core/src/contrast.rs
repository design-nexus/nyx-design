//! Readability checks on a resolved token set. Findings are warnings: a theme that
//! fails them still works, but Nyx says so instead of calling it accessible.

use crate::color::contrast;
use crate::schema::{Issue, Severity};
use crate::tokens::Tokens;

/// Foreground, background, the WCAG ratio it needs, and what it is for.
pub const PAIRS: &[(&str, &str, f64, &str)] = &[
    ("text.primary", "surface.primary", 4.5, "body text"),
    ("text.primary", "surface.secondary", 4.5, "text in sidebars and headers"),
    ("text.primary", "surface.tertiary", 4.5, "text on cards"),
    ("text.primary", "surface.overlay", 4.5, "text in menus and dialogs"),
    ("text.secondary", "surface.primary", 4.5, "secondary text"),
    ("text.secondary", "surface.secondary", 4.5, "secondary text in sidebars and headers"),
    ("text.secondary", "surface.tertiary", 4.5, "secondary text on cards"),
    ("text.tertiary", "surface.primary", 4.5, "hints, captions and timestamps"),
    ("text.onAccent", "accent.primary", 4.5, "text on accent buttons"),
    ("border.strong", "surface.primary", 3.0, "the outlines of fields and controls"),
    ("selection.foreground", "selection.background", 4.5, "selected text"),
    ("border.focus", "surface.primary", 3.0, "the keyboard focus ring"),
    ("accent.primary", "surface.primary", 3.0, "accent-coloured controls"),
    ("status.error", "surface.primary", 3.0, "error messages"),
    ("text.disabled", "surface.primary", 1.5, "disabled controls, which must stay visible"),
];

/// Every pair below its ratio.
pub fn check(tokens: &Tokens, origin: &str) -> Vec<Issue> {
    PAIRS
        .iter()
        .filter_map(|(fg, bg, min, what)| {
            let ratio = contrast(tokens.color(fg), tokens.color(bg));
            (ratio + 1e-6 < *min).then(|| Issue {
                severity: Severity::Warning,
                origin: origin.into(),
                key: format!("{fg} on {bg}"),
                message: format!("contrast {ratio:.1}:1 for {what}; at least {min}:1 is needed to read it easily"),
            })
        })
        .collect()
}
