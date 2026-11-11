//! Deterministic theme resolution, in this order:
//!
//! 1. built-in fallback values (Catppuccin Mocha's colours, Nyx Design defaults),
//! 2. the theme's inheritance chain, base first,
//! 3. the theme's own values and tokens,
//! 4. the user's token overrides from `theme.toml`,
//! 5. accessibility adjustments.
//!
//! The result is always complete. A broken theme never fails resolution: each
//! problem becomes an [`Issue`] and the value it affected falls back.

use crate::config::{DEFAULT_THEME, Scope, Suite, ThemeMode};
use crate::layer::Layer;
use crate::model::Theme;
use crate::registry::{Entry, Registry};
use crate::schema::{Diag, Issue, Meta};
use crate::tokens::{A11y, Tokens, apply_a11y, check_explicit, derive, sync_legacy};
use std::collections::BTreeMap;

/// Longest inheritance chain followed.
const MAX_DEPTH: usize = 16;

/// A theme resolved for one scope: complete, checked, ready for any adapter.
#[derive(Debug, Clone)]
pub struct Resolved {
    pub meta: Meta,
    /// The schema 1 view (palette and look), in step with the tokens.
    pub theme: Theme,
    pub tokens: Tokens,
    pub issues: Vec<Issue>,
    /// `system`, `shell` or `app:<id>`.
    pub scope: String,
    /// An app override decided the theme.
    pub overridden: bool,
    /// The theme asked for, when it differs from the one shown (missing, say).
    pub requested: Option<String>,
}

/// `id` and what it inherits, base first. A cycle or missing base is reported and
/// the chain stops there.
pub fn chain<'a>(registry: &'a Registry, id: &str, diag: &Diag) -> Vec<&'a Entry> {
    let mut seen: Vec<String> = Vec::new();
    let mut out = Vec::new();
    let mut current = id.to_string();
    loop {
        if seen.contains(&current) {
            diag.error("inherits", format!("{} inherit each other in a loop; stopping at {current}", seen.join(" → ")));
            break;
        }
        if seen.len() >= MAX_DEPTH {
            diag.error("inherits", format!("more than {MAX_DEPTH} themes deep; stopping at {current}"));
            break;
        }
        let Some(entry) = registry.get(&current) else {
            if seen.is_empty() {
                diag.error("", format!("there is no theme {current}"));
            } else {
                diag.error("inherits", format!("{} inherits {current}, which isn't installed", seen.last().unwrap()));
            }
            break;
        };
        seen.push(current.clone());
        out.push(entry);
        match &entry.meta.inherits {
            Some(base) => current = base.clone(),
            None => break,
        }
    }
    out.reverse();
    out
}

fn build(meta: Meta, layers: &[Layer], user: Option<&BTreeMap<String, String>>, a11y: &A11y, diag: &Diag) -> (Theme, Tokens) {
    let mut merged = layers.iter().fold(Layer::default(), |acc, l| l.over(&acc));
    if let Some(tokens) = user.filter(|t| !t.is_empty()) {
        let user_diag = Diag::new("your token overrides (theme.toml)");
        let ok = check_explicit(tokens, &user_diag);
        diag.extend(user_diag.take());
        merged = Layer::from_tokens(&ok).over(&merged);
    }
    merged.deref(diag);
    let explicit = check_explicit(&merged.tokens, diag);
    let mut theme = merged.file.theme(&meta.id, diag);
    theme.name = meta.name.clone();
    let mut tokens = derive(&mut theme, &explicit, &merged.typography, &merged.geometry, &merged.motion, &merged.effects, diag);
    apply_a11y(&mut tokens, a11y);
    sync_legacy(&mut theme, &tokens);
    theme.look.material.blended = tokens.effects.blended;
    (theme, tokens)
}

fn finish(meta: Meta, theme: Theme, tokens: Tokens, diag: &Diag, scope: String) -> Resolved {
    let mut issues = diag.take();
    issues.extend(crate::contrast::check(&tokens, &meta.name));
    Resolved { meta, theme, tokens, issues, scope, overridden: false, requested: None }
}

/// Resolve bare layers (an import preview, tests).
pub fn resolve_layers(id: &str, layers: &[Layer], a11y: &A11y) -> Resolved {
    let meta = Meta { id: id.into(), name: id.into(), ..Meta::default() };
    let diag = Diag::new(id);
    let (theme, tokens) = build(meta.clone(), layers, None, a11y, &diag);
    finish(meta, theme, tokens, &diag, "preview".into())
}

/// Resolve the theme `id` from `registry`, with the user's token overrides.
pub fn resolve_id(registry: &Registry, id: &str, user: Option<&BTreeMap<String, String>>, a11y: &A11y) -> Option<Resolved> {
    let entry = registry.get(id)?;
    let diag = Diag::new(entry.meta.name.clone());
    let entries = chain(registry, &entry.meta.id, &diag);
    for e in &entries {
        diag.extend(e.issues.clone());
    }
    let layers: Vec<Layer> = entries.iter().flat_map(|e| e.layers.iter().cloned()).collect();
    let (theme, tokens) = build(entry.meta.clone(), &layers, user, a11y, &diag);
    Some(finish(entry.meta.clone(), theme, tokens, &diag, "system".into()))
}

/// The theme `scope` shows under `suite`: an app's override, else the system
/// theme (live Omarchy colours when following Omarchy and present), else the
/// default. A theme that has gone missing is reported, not fatal.
pub fn resolve(registry: &Registry, suite: &Suite, scope: Scope, a11y: &A11y) -> Resolved {
    let (mode, id, overridden) = suite.selection(scope);
    let user = Some(&suite.tokens);
    let mut note = None;
    if overridden {
        if let Some(mut r) = resolve_id(registry, &id, user, a11y) {
            r.scope = scope.label();
            r.overridden = true;
            return r;
        }
        note = Some(format!("{id} isn't installed, so this app follows the system theme until it is back"));
    }
    let (sys_mode, sys_id, _) = suite.selection(Scope::System);
    let (mode, id) = if overridden { (sys_mode, sys_id) } else { (mode, id) };
    if mode == ThemeMode::Omarchy
        && let Some((meta, layer)) = crate::omarchy::live()
    {
        let diag = Diag::new("Omarchy");
        let (theme, tokens) = build(meta.clone(), &[layer], user, a11y, &diag);
        let mut r = finish(meta, theme, tokens, &diag, scope.label());
        r.requested = overridden.then(|| suite.app(scope_app(scope)).theme.unwrap_or_default());
        push_note(&mut r, note);
        return r;
    }
    let mut r = match resolve_id(registry, &id, user, a11y) {
        Some(r) => r,
        None => {
            note.get_or_insert_with(|| format!("{id} isn't installed; showing Catppuccin Mocha"));
            let mut r = resolve_id(registry, DEFAULT_THEME, user, a11y)
                .or_else(|| resolve_id(&Registry::builtin(), DEFAULT_THEME, user, a11y))
                .expect("the default theme is built in");
            r.requested = Some(id.clone());
            r
        }
    };
    r.scope = scope.label();
    if overridden {
        r.requested = suite.app(scope_app(scope)).theme;
    }
    push_note(&mut r, note);
    r
}

fn scope_app<'a>(scope: Scope<'a>) -> &'a str {
    match scope {
        Scope::App(a) => a,
        _ => "",
    }
}

fn push_note(r: &mut Resolved, note: Option<String>) {
    if let Some(n) = note {
        r.issues.insert(0, Issue { severity: crate::Severity::Warning, origin: r.meta.name.clone(), key: String::new(), message: n });
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::schema::{Origin, parse_package};

    fn reg(extra: &[(&str, &str)]) -> Registry {
        let mut r = Registry::builtin();
        for (id, text) in extra {
            let pkg = parse_package(text, id).unwrap();
            r.push_for_test(Entry {
                meta: Meta { id: pkg.id.clone(), name: pkg.name.clone(), inherits: pkg.inherits.clone(), origin: Origin::Installed, ..Meta::default() },
                layers: vec![Layer::from_package(&pkg)],
                issues: vec![],
            });
        }
        r
    }

    #[test]
    fn every_builtin_resolves_cleanly() {
        let r = Registry::builtin();
        for e in r.entries() {
            let res = resolve_id(&r, &e.meta.id, None, &A11y::default()).unwrap();
            let errors: Vec<_> = res.issues.iter().filter(|i| i.severity == crate::Severity::Error).collect();
            assert!(errors.is_empty(), "{}: {errors:?}", e.meta.id);
            for t in crate::COLOR_TOKENS {
                assert!(crate::color::is_color(res.tokens.color(t)), "{} {t}", e.meta.id);
            }
        }
    }

    /// Resolve an Omarchy `colors.toml` as Follow Omarchy does.
    fn from_omarchy(text: &str) -> Resolved {
        let table: toml::Table = toml::from_str(text).unwrap();
        let pkg = crate::omarchy::package_for(&table, "omarchy", "Omarchy", false).unwrap();
        let mut r = Registry::builtin();
        r.push_for_test(Entry {
            meta: Meta { id: "omarchy".into(), name: "Omarchy".into(), origin: Origin::Omarchy, ..Meta::default() },
            layers: vec![Layer::from_package(&pkg)],
            issues: vec![],
        });
        resolve_id(&r, "omarchy", None, &A11y::default()).unwrap()
    }

    #[test]
    fn every_builtin_converts() {
        let r = Registry::builtin();
        assert!(r.skipped.is_empty(), "{:?}", r.skipped);
        assert_eq!(r.entries().len(), 17);
    }

    #[test]
    fn a_builtin_theme_looks_as_its_omarchy_version_does() {
        let builtin = resolve_id(&Registry::builtin(), "gruvbox-dark", None, &A11y::default()).unwrap();
        let omarchy = from_omarchy(include_str!("../themes/gruvbox-dark/colors.toml"));
        assert_eq!(builtin.tokens.colors, omarchy.tokens.colors);
        assert_eq!(builtin.theme.look.swatches, omarchy.theme.look.swatches);
    }

    /// Nyx Dark and Light are designed in Nyx's own format; their Omarchy versions
    /// (nyx-themes) carry the colours that make them look as they do. Omarchy's format
    /// has fewer roles (`muted` is both a border and a text colour), so the shades
    /// Nyx derives between them can differ slightly.
    #[test]
    fn nyx_dark_and_light_look_as_their_omarchy_versions_do() {
        const DEFINING: &[&str] = &[
            "surface.primary",
            "text.primary",
            "text.secondary",
            "accent.primary",
            "border.default",
            "status.error",
            "status.warning",
            "status.success",
        ];
        for (id, text) in [
            ("nyx-dark", include_str!("../themes/omarchy-nyx/nyx-dark.colors.toml")),
            ("nyx-light", include_str!("../themes/omarchy-nyx/nyx-light.colors.toml")),
        ] {
            let builtin = resolve_id(&Registry::builtin(), id, None, &A11y::default()).unwrap();
            let omarchy = from_omarchy(text);
            for t in DEFINING {
                assert_eq!(builtin.tokens.color(t), omarchy.tokens.color(t), "{id} {t}");
            }
            assert_eq!(builtin.theme.look.swatches, omarchy.theme.look.swatches, "{id}");
        }
    }

    #[test]
    fn catppuccin_mocha_keeps_its_palette() {
        let r = resolve_id(&Registry::builtin(), "catppuccin-mocha", None, &A11y::default()).unwrap();
        assert_eq!(r.tokens.color("surface.primary"), "#1e1e2e");
        assert_eq!(r.tokens.color("text.primary"), "#cdd6f4");
        assert_eq!(r.tokens.color("accent.primary"), "#89b4fa");
        assert_eq!(r.tokens.color("border.default"), "#313244");
        assert_eq!(r.theme.palette.bg, "#1e1e2e", "the established names follow the tokens");
        assert!(r.issues.iter().all(|i| i.severity != crate::Severity::Error), "{:?}", r.issues);
    }

    #[test]
    fn inheritance_and_explicit_tokens() {
        let r = reg(&[(
            "child",
            "schema = 2\nid = \"child\"\nname = \"Child\"\ninherits = \"catppuccin-mocha\"\n[tokens]\n\"accent.primary\" = \"#ff8800\"\n\"status.info\" = \"palette.magenta\"",
        )]);
        let res = resolve_id(&r, "child", None, &A11y::default()).unwrap();
        assert_eq!(res.tokens.color("accent.primary"), "#ff8800");
        assert_eq!(res.tokens.color("surface.primary"), "#1e1e2e", "inherited");
        assert_eq!(res.tokens.color("status.info"), "#f5c2e7", "the parent's palette is in scope");
        assert_eq!(res.theme.palette.accent, "#ff8800");
        let parent = resolve_id(&r, "catppuccin-mocha", None, &A11y::default()).unwrap();
        assert_ne!(res.tokens.color("accent.subtle"), parent.tokens.color("accent.subtle"), "derived tokens follow");
    }

    #[test]
    fn cycles_and_missing_bases_are_reported_not_fatal() {
        let r = reg(&[
            ("a", "schema = 2\nid = \"a\"\nname = \"A\"\ninherits = \"b\""),
            ("b", "schema = 2\nid = \"b\"\nname = \"B\"\ninherits = \"a\""),
            ("c", "schema = 2\nid = \"c\"\nname = \"C\"\ninherits = \"nope\""),
        ]);
        let a = resolve_id(&r, "a", None, &A11y::default()).unwrap();
        assert!(a.issues.iter().any(|i| i.message.contains("loop")));
        let c = resolve_id(&r, "c", None, &A11y::default()).unwrap();
        assert!(c.issues.iter().any(|i| i.message.contains("isn't installed")));
        assert!(crate::color::is_color(c.tokens.color("surface.primary")));
    }

    #[test]
    fn invalid_values_fall_back_with_errors() {
        let r = reg(&[(
            "bad",
            "schema = 2\nid = \"bad\"\nname = \"Bad\"\n[tokens]\n\"surface.primary\" = \"nope\"\n\"made.up\" = \"#fff\"\n\"border.focus\" = \"palette.missing\"\n[geometry]\nradius_card = 200\ncontrol_height = 4\nfocus_width = 0\n[motion]\nnormal = 99999\neasing_standard = \"bounce\"",
        )]);
        let res = resolve_id(&r, "bad", None, &A11y::default()).unwrap();
        let keys: Vec<&str> = res.issues.iter().filter(|i| i.severity == crate::Severity::Error).map(|i| i.key.as_str()).collect();
        for k in ["bg", "tokens.made.up", "geometry.radius_card", "geometry.control_height", "geometry.focus_width", "motion.normal", "motion.easing_standard"] {
            assert!(keys.iter().any(|x| x.contains(k)), "{k} not reported: {keys:?}");
        }
        assert_eq!(res.tokens.geometry.radius_card, 10);
        assert_eq!(res.tokens.geometry.control_height, 32);
        assert_eq!(res.tokens.geometry.focus_width, 2, "focus can't be turned off");
        assert_eq!(res.tokens.motion.easing_standard, "ease-out");
    }

    #[test]
    fn overrides_and_missing_themes() {
        let r = Registry::builtin();
        let mut suite = Suite { mode: ThemeMode::Theme, theme: "nord".into(), ..Suite::default() };
        suite.set_override("nyx-files", Some("dracula"));
        assert_eq!(resolve(&r, &suite, Scope::App("nyx-files"), &A11y::default()).meta.id, "dracula");
        assert_eq!(resolve(&r, &suite, Scope::Shell, &A11y::default()).meta.id, "nord");
        suite.set_override("nyx-files", Some("gone"));
        let res = resolve(&r, &suite, Scope::App("nyx-files"), &A11y::default());
        assert_eq!(res.meta.id, "nord", "a missing override follows the system");
        assert_eq!(res.requested.as_deref(), Some("gone"));
        suite.theme = "gone-too".into();
        assert_eq!(resolve(&r, &suite, Scope::System, &A11y::default()).meta.id, DEFAULT_THEME);
    }

    #[test]
    fn user_tokens_and_accessibility() {
        let r = Registry::builtin();
        let mut suite = Suite { mode: ThemeMode::Theme, theme: "catppuccin-mocha".into(), ..Suite::default() };
        suite.tokens.insert("accent.primary".into(), "#ff0000".into());
        suite.tokens.insert("bogus".into(), "#ff0000".into());
        let a11y = A11y { reduce_motion: true, high_contrast: true };
        let res = resolve(&r, &suite, Scope::System, &a11y);
        assert_eq!(res.tokens.motion.normal, 0);
        assert!(res.tokens.motion.reduced);
        assert!(res.tokens.geometry.focus_width >= 3);
        assert!(res.issues.iter().any(|i| i.key.contains("bogus")));
        let c = crate::color::contrast(res.tokens.color("text.secondary"), res.tokens.color("surface.primary"));
        assert!(c >= 4.5, "{c}");
        assert_eq!(res.theme.palette.dim_text, res.tokens.color("text.secondary"));
    }
}
