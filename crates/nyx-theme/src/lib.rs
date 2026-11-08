//! Theming for Nyx GTK4 apps: the GTK adapter of Nyx Theme Engine 2.0. The theme
//! itself (format, resolution, choices, installing) is `nyx-theme-core`; this
//! crate turns the resolved theme into one stylesheet and keeps it live.
//!
//! Every stylesheet is written against colour names (`@theme_bg`, `@theme_accent`,
//! …, and the semantic `@nyx_surface_primary`, …). An app hands [`install`] its
//! stylesheet and a way to read its preferences, and gets live restyling: it
//! follows the system theme, or the theme chosen for it alone, and changes the
//! moment the theme does (the theme service's `ThemeChanged`, or the choices file
//! changing when the service isn't running).

use gtk::prelude::*;
use gtk::{gdk, gio, glib};
use nyx_theme_core::{self as core, Registry, Scope};
use std::cell::{Cell, RefCell};

mod css;
pub use css::{adwaita_css, font_stack, look_css, token_name, tokens_css};
pub use nyx_theme_core as engine;
pub use nyx_theme_core::{
    A11y, AppChoice, AppMode, DEFAULT_THEME, FileIconColors, Font, Issue, Look, Material, Meta, Palette, Resolved, SWATCH_NAMES,
    Shape, Suite, Surface, Syntax, Theme, ThemeMode, Tokens, current_id, from_omarchy_colors,
};

/// The theme-related part of an app's preferences.
#[derive(Debug, Clone)]
pub struct ThemePrefs {
    pub mode: ThemeMode,
    /// Theme id, used when `mode` is [`ThemeMode::Theme`].
    pub theme: String,
    pub glow: bool,
    pub reduce_motion: bool,
}

/// What an app supplies to [`install`].
pub struct Style {
    /// The CSS class of the app's main window, which scopes the shared rules.
    pub window_class: &'static str,
    /// Shared rules the app styles its own way, by selector (as written in
    /// `base.css`, with `@APP@`), left out of its sheet.
    pub base_skip: &'static [&'static str],
    /// The app's stylesheet, loaded after the shared one.
    pub css: &'static str,
    /// Extra rules loaded when the Glow preference is off.
    pub no_glow_css: &'static str,
    /// Extra `@define-color` lines derived from the palette, if the app needs any.
    pub extra_colors: Option<fn(&Palette) -> String>,
    /// Reads the app's current preferences (Glow and Reduce motion; its theme
    /// fields are only read once, to carry an old choice over).
    pub prefs: fn() -> ThemePrefs,
    /// Records a theme chosen for this app in its own preferences, as well.
    pub set_theme: Option<fn(ThemeMode, String)>,
}

/// The page an app opens on: `home` (its start page), or `last` (the one it
/// remembers) when the suite is set to reopen the last page.
pub fn start_page(home: &str, last: &str) -> String {
    let reopen = read_suite().is_some_and(|s| s.start == "last");
    if reopen && !last.is_empty() { last.to_string() } else { home.to_string() }
}

/// Whether apps reopen the last page instead of their start page.
pub fn reopens_last_page() -> bool {
    read_suite().is_some_and(|s| s.start == "last")
}

/// The suite's density and text size as CSS for one app, loaded after its own
/// stylesheet so they apply on top.
pub fn suite_css(window_class: &str, suite: &Suite) -> String {
    let mut css = String::new();
    let scale = suite.text_scale.clamp(0.9, 1.25);
    if (scale - 1.0).abs() > 0.001 {
        css.push_str(&format!("window.{window_class} {{ font-size: {scale:.3}em; }}\n"));
    }
    if suite.density == "compact" {
        css.push_str(&COMPACT.replace("@APP@", window_class));
    }
    css
}

/// Compact density: the same layout, tighter.
const COMPACT: &str = "
window.@APP@ .settings-navigation button.nav-item { min-height: 34px; }
window.@APP@ .status-bar { min-height: 28px; }
window.@APP@ .toolbar, window.@APP@ .list-toolbar { min-height: 38px; }
window.@APP@ .settings-option { min-height: 40px; padding-top: 6px; padding-bottom: 6px; }
window.@APP@ columnview > listview > row { min-height: 28px; }
window.@APP@ .commandbar { min-height: 40px; }
window.@APP@ .inspector-section { padding-top: 10px; padding-bottom: 12px; }
";

/// The Nyx 2.0 stylesheet, loaded on top of [`BASE_CSS`] by apps that have
/// moved to 2.0 ([`use_design_2`]).
pub const BASE2_CSS: &str = include_str!("base2.css");

/// Lines between areas, for themes that turn `blended` off.
const UNBLENDED: &str = "
.top-bar, .app-header { border-bottom: 1px solid @hairline; }
.settings-navigation { border-right: 1px solid @hairline; }
.status-bar { border-top: 1px solid @hairline; }
.group-list, .card, .settings-option { border: 1px solid @hairline; }
.group-list .settings-option { border: none; border-top: 1px solid @theme_divider; }
.group-list > .settings-option:first-child, .group-list > box:first-child > .settings-option:first-child { border-top: none; }
";

/// 2.0 sizes for the suite's density: `(header, nav item, row, option row, control, status bar)`.
fn density_sizes(density: &str) -> (u32, u32, u32, u32, u32, u32) {
    match density {
        "compact" => (42, 30, 30, 44, 30, 26),
        "relaxed" => (50, 38, 42, 60, 34, 30),
        _ => (46, 34, 36, 52, 32, 28),
    }
}

/// The suite's density and text size as 2.0 CSS for one app.
fn suite2_css(window_class: &str, suite: &Suite) -> String {
    let (header, nav, row, option, control, status) = density_sizes(&suite.density);
    let segment = control - 6;
    let mut css = format!(
        "window.{w} .top-bar, window.{w} .app-header {{ min-height: {header}px; }}\n\
         window.{w} .settings-navigation button.nav-item {{ min-height: {nav}px; }}\n\
         window.{w} listview > row, window.{w} list > row, window.{w} columnview > listview > row {{ min-height: {row}px; }}\n\
         window.{w} .settings-option {{ min-height: {option}px; }}\n\
         window.{w} button, window.{w} entry, window.{w} spinbutton, window.{w} dropdown > button {{ min-height: {control}px; }}\n\
         window.{w} button.bar-button, window.{w} button.icon-button, window.{w} menubutton.bar-button > button {{ min-width: {control}px; min-height: {control}px; padding: 0; }}\n\
         window.{w} .segmented button.segment {{ min-height: {segment}px; }}\n\
         window.{w} .status-bar {{ min-height: {status}px; }}\n",
        w = window_class
    );
    let scale = suite.text_scale.clamp(0.9, 1.25);
    if (scale - 1.0).abs() > 0.001 {
        css.push_str(&format!("window.{window_class} {{ font-size: {scale:.3}em; }}\n"));
    }
    css
}

/// The mixes the 2.0 sheet uses, from the theme's tint strengths.
fn defines2(look: &Look) -> String {
    format!(
        "@define-color hairline {hairline};\n\
         @define-color divider {divider};\n\
         @define-color nav_active mix(@theme_bg, @theme_accent, {sel});\n\
         @define-color row_hover mix(@theme_bg, @theme_accent, {hover});\n\
         @define-color lift @theme_card;\n\
         @define-color lift_active mix(@theme_card, @theme_accent, 0.1);\n\
         @define-color veil alpha(mix(@theme_bg, @theme_shadow, 0.45), 0.82);\n\
         @define-color field alpha(@theme_text, 0.035);\n\
         @define-color track alpha(@theme_text, 0.1);\n",
        sel = look.selection,
        hover = look.hover,
        // Blended: the lines an app's own sheet still draws between areas and rows vanish.
        hairline = if look.material.blended { "alpha(@theme_bg, 0)" } else { "mix(@theme_bg, @theme_border, 0.82)" },
        divider = if look.material.blended { "alpha(@theme_bg, 0)" } else { "@theme_divider" },
    )
}

/// The full sheet an app with no stylesheet of its own would load for `theme`,
/// for checking that GTK accepts it (see `examples/check_css.rs`).
pub fn sheet_for_check(window_class: &str, theme: &Theme, v2: bool) -> String {
    let suite = Suite::default();
    let mut css = palette_css(&theme.palette);
    css.push_str(&look_css(window_class, &theme.palette.accent, &theme.look));
    if v2 {
        let tokens = core::resolver::resolve_id(&Registry::builtin(), &theme.id, None, &A11y::default())
            .map(|r| r.tokens)
            .unwrap_or_else(|| core::resolver::resolve_id(&Registry::builtin(), DEFAULT_THEME, None, &A11y::default()).unwrap().tokens);
        css.push_str(&tokens_css(window_class, &tokens));
        css.push_str(&defines2(&theme.look));
        css.push_str(&without_defines(&base_css(window_class, &[])));
        css.push('\n');
        css.push_str(&BASE2_CSS.replace("@APP@", window_class));
        css.push_str(UNBLENDED);
        css.push_str(&suite2_css(window_class, &suite));
    } else {
        css.push_str(&base_css(window_class, &[]));
        css.push_str(&suite_css(window_class, &suite));
    }
    css
}

/// Colours `css` uses but never defines with `@define-color`. GTK draws an
/// undefined colour as its initial value (usually white) without any error.
pub fn undefined_colors(css: &str) -> Vec<String> {
    let mut code = String::with_capacity(css.len());
    let mut rest = css;
    while let Some(open) = rest.find("/*") {
        code.push_str(&rest[..open]);
        rest = rest[open..].find("*/").map_or("", |close| &rest[open + close + 2..]);
    }
    code.push_str(rest);
    let css = code.as_str();
    let mut defined = std::collections::BTreeSet::new();
    let mut used = std::collections::BTreeSet::new();
    let bytes = css.as_bytes();
    let mut i = 0;
    while let Some(at) = css[i..].find('@').map(|o| i + o) {
        let start = at + 1;
        let end = start
            + css[start..].find(|c: char| !(c.is_ascii_alphanumeric() || c == '_' || c == '-')).unwrap_or(css.len() - start);
        let name = &css[start..end];
        if name == "define-color" {
            let rest = css[end..].trim_start();
            let len = rest.find(|c: char| !(c.is_ascii_alphanumeric() || c == '_' || c == '-')).unwrap_or(rest.len());
            defined.insert(rest[..len].to_string());
        } else if !name.is_empty() && !matches!(name, "import" | "keyframes" | "media" | "APP") && bytes.get(end) != Some(&b'@') {
            used.insert(name.to_string());
        }
        i = end.max(at + 1);
    }
    used.difference(&defined).cloned().collect()
}

/// The shared v1 sheet without its colour definitions, which 2.0 replaces.
fn without_defines(css: &str) -> String {
    css.lines().filter(|l| !l.trim_start().starts_with("@define-color")).collect::<Vec<_>>().join("\n")
}

pub fn suite_file() -> std::path::PathBuf {
    core::paths::suite_file()
}

/// The shared settings, if they have been written.
pub fn read_suite() -> Option<Suite> {
    core::read_suite()
}

/// Change the shared settings; every open Nyx app follows at once.
pub fn update_suite(change: impl FnOnce(&mut Suite)) {
    if let Err(e) = core::update_suite(change) {
        eprintln!("nyx-theme: {e}");
    }
}

/// Where user theme files live: `~/.config/nyx/themes/` for every app, then
/// `~/.config/<app>/themes/` for this one.
pub fn theme_dirs() -> [std::path::PathBuf; 2] {
    core::paths::theme_dirs()
}

/// The palette of the active Omarchy theme, if this is Omarchy.
pub fn omarchy_palette() -> Option<Palette> {
    from_omarchy_colors(&std::fs::read_to_string(core::paths::omarchy_colors()).ok()?)
}

pub fn omarchy_available() -> bool {
    omarchy_palette().is_some()
}

/// Every built-in theme, resolved.
pub fn bundled() -> Vec<Theme> {
    core::bundled()
}

/// Every theme on offer, resolved: built in, system, installed and the user's own.
pub fn all() -> Vec<Theme> {
    core::all()
}

/// The user's own theme files (not overrides of other themes), sorted by name.
pub fn custom() -> Vec<Theme> {
    all().into_iter().filter(|t| t.id.starts_with("custom:")).collect()
}

/// The file to edit for theme `id`, written out in full first if the user
/// has none yet, so a theme can be tuned without touching the app. Saving it
/// restyles every open Nyx app.
pub fn edit_copy(id: &str) -> Option<std::path::PathBuf> {
    let stem = id.strip_prefix("custom:").unwrap_or(id);
    let reg = Registry::load();
    if let Some(e) = reg.get(id)
        && let Some(path) = &e.meta.path
        && e.meta.origin == core::Origin::User
    {
        return Some(path.clone());
    }
    let theme = core::resolver::resolve_id(&reg, id, None, &A11y::default())?.theme;
    let path = core::paths::theme_dirs()[0].join(format!("{stem}.toml"));
    if path.exists() {
        return Some(path);
    }
    let text = toml::to_string_pretty(&core::v1::ThemeFile::of(&theme)).ok()?;
    nyx_core::cmd::atomic_write(&path, text).ok()?;
    Some(path)
}

pub fn palette_css(p: &Palette) -> String {
    format!(
        "@define-color theme_bg {};\n@define-color theme_surface {};\n@define-color theme_text {};\n\
         @define-color theme_dim_text {};\n@define-color theme_accent {};\n@define-color theme_border {};\n\
         @define-color theme_muted {};\n@define-color theme_highlight {};\n@define-color theme_danger {};\n\
         @define-color theme_glow {};\n@define-color theme_shadow {};\n\
         @define-color theme_on_accent {};\n",
        p.bg,
        p.surface,
        p.text,
        p.dim_text,
        p.accent,
        p.border,
        p.muted,
        p.highlight,
        p.danger,
        p.glow,
        p.shadow,
        if p.light { "#ffffff" } else { &p.bg },
    )
}

/// The stylesheet every app shares.
pub const BASE_CSS: &str = include_str!("base.css");

/// The shared stylesheet for one app: scoped to its window class, without the
/// rules it styles its own way.
pub fn base_css(window_class: &str, skip: &[&str]) -> String {
    let mut out = String::with_capacity(BASE_CSS.len());
    for block in blocks(BASE_CSS) {
        let selector = block.split('{').next().unwrap_or_default();
        let selector = strip_comments(selector).split_whitespace().collect::<Vec<_>>().join(" ");
        if block.contains('{') && skip.contains(&selector.as_str()) {
            continue;
        }
        out.push_str(block);
    }
    out.replace("@APP@", window_class)
}

/// Top-level statements and rule blocks, each with the comments before it.
fn blocks(css: &str) -> Vec<&str> {
    let mut out = Vec::new();
    let (mut depth, mut start, mut i) = (0usize, 0usize, 0usize);
    let bytes = css.as_bytes();
    while i < bytes.len() {
        if css[i..].starts_with("/*") {
            i = css[i..].find("*/").map_or(bytes.len(), |j| i + j + 2);
            continue;
        }
        match bytes[i] {
            b'{' => depth += 1,
            b'}' => {
                depth = depth.saturating_sub(1);
                if depth == 0 {
                    out.push(&css[start..=i]);
                    start = i + 1;
                }
            }
            b';' if depth == 0 => {
                out.push(&css[start..=i]);
                start = i + 1;
            }
            _ => {}
        }
        i += 1;
    }
    out.push(&css[start..]);
    out
}

fn strip_comments(s: &str) -> String {
    let mut out = String::new();
    let mut rest = s;
    while let Some(i) = rest.find("/*") {
        out.push_str(&rest[..i]);
        rest = rest[i..].find("*/").map_or("", |j| &rest[i + j + 2..]);
    }
    out.push_str(rest);
    out
}

type Listener = Box<dyn Fn()>;

thread_local! {
    static STYLE: RefCell<Option<Style>> = const { RefCell::new(None) };
    static PROVIDER: RefCell<Option<gtk::CssProvider>> = const { RefCell::new(None) };
    /// The theme on screen (palette and look with this app's accent), cached.
    static ACTIVE: RefCell<Option<(Palette, Look)>> = const { RefCell::new(None) };
    /// The resolved theme behind it.
    static RESOLVED: RefCell<Option<Resolved>> = const { RefCell::new(None) };
    /// Whether this app has moved to Nyx 2.0.
    static DESIGN_2: Cell<bool> = const { Cell::new(false) };
    /// A shell component: always the system theme, no choice of its own.
    static SHELL: Cell<bool> = const { Cell::new(false) };
    /// libadwaita's named colours in the sheet too.
    static ADWAITA: Cell<bool> = const { Cell::new(false) };
    /// One set theme, whatever anyone chose (the login screen's).
    static FIXED: RefCell<Option<String>> = const { RefCell::new(None) };
    /// The section of the app on screen, for section accents (2.0).
    static SECTION: RefCell<Option<String>> = const { RefCell::new(None) };
    static LISTENERS: RefCell<Vec<(glib::WeakRef<gtk::Widget>, Listener)>> = const { RefCell::new(Vec::new()) };
    static GLOBAL: RefCell<Vec<Listener>> = const { RefCell::new(Vec::new()) };
    /// The sheet last loaded, to skip reloading an identical one.
    static LAST_CSS: RefCell<String> = const { RefCell::new(String::new()) };
    /// The newest theme generation applied; older announcements are ignored.
    static GENERATION: Cell<u64> = const { Cell::new(0) };
    static PENDING: Cell<bool> = const { Cell::new(false) };
    /// File monitors, the bus subscription and settings kept alive.
    static KEEP: RefCell<Vec<glib::Object>> = const { RefCell::new(Vec::new()) };
    static BUS: RefCell<Option<(gio::DBusConnection, gio::SignalSubscription)>> = const { RefCell::new(None) };
}

/// Make this app a shell component (bar, dock, panels): it always shows the
/// system theme and offers no theme choice. Call before [`install`].
pub fn use_shell_scope() {
    SHELL.with(|s| s.set(true));
}

/// Always show theme `id`, whatever the system theme or anyone's choice (the login
/// screen shows the system's login theme). Falls back to the default theme if `id`
/// isn't installed. Call before [`install`].
pub fn use_fixed_theme(id: &str) {
    FIXED.with(|f| *f.borrow_mut() = Some(current_id(id).to_owned()));
}

/// Put libadwaita's named colours in the sheet too, for apps that use
/// libadwaita widgets. Call before [`install`].
pub fn use_adwaita() {
    ADWAITA.with(|a| a.set(true));
}

fn is_shell() -> bool {
    SHELL.with(Cell::get)
}

fn installed() -> bool {
    STYLE.with(|s| s.borrow().is_some())
}

/// This app's id for per-app choices (`nyx-files`).
pub fn app_id() -> &'static str {
    nyx_core::app::slug()
}

fn scope() -> Scope<'static> {
    if is_shell() {
        Scope::Shell
    } else if installed() {
        Scope::App(app_id())
    } else {
        Scope::System
    }
}

fn style_prefs() -> ThemePrefs {
    STYLE.with(|s| s.borrow().as_ref().map(|s| (s.prefs)())).unwrap_or(ThemePrefs {
        mode: ThemeMode::Omarchy,
        theme: DEFAULT_THEME.into(),
        glow: true,
        reduce_motion: false,
    })
}

thread_local! {
    static A11Y_SETTINGS: RefCell<Option<(Option<gio::Settings>, Option<gio::Settings>)>> = const { RefCell::new(None) };
}

fn gsettings(schema: &str) -> Option<gio::Settings> {
    let source = gio::SettingsSchemaSource::default()?;
    source.lookup(schema, true)?;
    Some(gio::Settings::new(schema))
}

/// The desktop's accessibility settings, read through GSettings and followed live.
fn system_a11y() -> A11y {
    A11Y_SETTINGS.with(|cell| {
        let mut cell = cell.borrow_mut();
        let (interface, a11y) = cell.get_or_insert_with(|| {
            let interface = gsettings("org.gnome.desktop.interface");
            let a11y = gsettings("org.gnome.desktop.a11y.interface");
            if let Some(s) = &interface {
                s.connect_changed(Some("enable-animations"), |_, _| schedule());
            }
            if let Some(s) = &a11y {
                s.connect_changed(Some("high-contrast"), |_, _| schedule());
            }
            (interface, a11y)
        });
        let env = |k: &str| std::env::var(k).ok().map(|v| v == "1" || v == "true");
        let has = |s: &Option<gio::Settings>, key: &str| s.as_ref().is_some_and(|s| s.settings_schema().is_some_and(|x| x.has_key(key)));
        A11y {
            reduce_motion: env("NYX_REDUCE_MOTION")
                .unwrap_or_else(|| has(interface, "enable-animations") && !interface.as_ref().unwrap().boolean("enable-animations")),
            high_contrast: env("NYX_HIGH_CONTRAST")
                .unwrap_or_else(|| has(a11y, "high-contrast") && a11y.as_ref().unwrap().boolean("high-contrast")),
        }
    })
}

/// Resolve the theme this app shows now, from the files.
fn resolve_now() -> Resolved {
    let prefs = style_prefs();
    let mut a11y = if installed() { system_a11y() } else { A11y::default() };
    a11y.reduce_motion |= prefs.reduce_motion;
    let registry = Registry::load();
    if let Some(id) = FIXED.with(|f| f.borrow().clone()) {
        return core::resolver::resolve_id(&registry, &id, None, &a11y)
            .or_else(|| core::resolver::resolve_id(&registry, DEFAULT_THEME, None, &a11y))
            .expect("the default theme is built in");
    }
    core::resolver::resolve(&registry, &core::suite(), scope(), &a11y)
}

/// The theme this app shows (the system theme, or the one chosen for it).
pub fn current_theme() -> Theme {
    resolve_now().theme
}

/// The resolved theme on screen: tokens, metadata and any problems found.
pub fn resolved() -> Resolved {
    RESOLVED.with(|r| r.borrow_mut().get_or_insert_with(resolve_now).clone())
}

/// The semantic tokens on screen.
pub fn tokens() -> Tokens {
    resolved().tokens
}

/// The suite's theme as app `app` (`files`) shows it in 2.0: its theme (its own
/// choice, else the system's), with its accent as the palette's accent. For apps
/// that run their own stylesheet machinery instead of [`install`].
pub fn suite_theme(app: &str) -> Theme {
    let suite = core::suite();
    let slug = format!("nyx-{app}");
    let mut theme = core::resolver::resolve(&Registry::load(), &suite, Scope::App(&slug), &A11y::default()).theme;
    let accent = resolve_app_accent(app, &theme.palette, &theme.look, &suite);
    theme.palette.glow = accent.clone();
    theme.palette.accent = accent;
    theme
}

/// The palette this app shows now, from the files.
pub fn current_palette() -> Palette {
    current_theme().palette
}

/// This app's theme preferences as they apply now, for the settings card:
/// `mode` is `Theme` when the app has its own theme, else the system's mode.
pub fn app_prefs() -> ThemePrefs {
    let suite = core::suite();
    let mut prefs = style_prefs();
    let (mode, theme, _) = suite.selection(scope());
    prefs.mode = mode;
    prefs.theme = theme;
    prefs
}

/// The theme chosen for this app alone, if any (`None` follows the system).
pub fn app_override() -> Option<String> {
    if is_shell() {
        return None;
    }
    let choice = core::suite().app(app_id());
    (choice.mode == AppMode::Override).then_some(choice.theme).flatten()
}

/// Whether this app can have a theme of its own (shell components can't).
pub fn can_choose_theme() -> bool {
    installed() && !is_shell() && FIXED.with(|f| f.borrow().is_none())
}

/// Choose this app's theme: `Some(id)` for its own, `None` to follow the system.
/// The system theme is untouched. A theme with errors is refused.
pub fn set_app_theme(theme: Option<&str>) -> Result<(), String> {
    if !can_choose_theme() {
        return Err("this part of the desktop always shows the system theme".into());
    }
    choose_app_theme_for(app_id(), theme)?;
    if let Some(set) = STYLE.with(|s| s.borrow().as_ref().and_then(|s| s.set_theme)) {
        match theme {
            Some(id) => set(ThemeMode::Theme, id.to_string()),
            None => set(ThemeMode::Omarchy, String::new()),
        }
    }
    Ok(())
}

/// The settings card's theme choice: [`ThemeMode::Omarchy`] follows the system,
/// [`ThemeMode::Theme`] gives this app `theme`.
pub fn choose_theme(mode: ThemeMode, theme: &str) {
    let result = match mode {
        ThemeMode::Omarchy => set_app_theme(None),
        ThemeMode::Theme => set_app_theme(Some(theme)),
    };
    if let Err(e) = result {
        eprintln!("nyx-theme: {e}");
    }
}

/// Tell every running client about a change made here: publish the snapshot and
/// emit `ThemeChanged` (the theme service does the same when it is running).
pub fn announce(scope: &str, reason: &str) {
    let generation = core::notify_changed(scope, reason);
    let system = core::get_active_theme();
    if let Some(conn) = BUS.with(|b| b.borrow().as_ref().map(|(c, _)| c.clone())).or_else(|| gio::bus_get_sync(gio::BusType::Session, gio::Cancellable::NONE).ok()) {
        let body = (generation, system, scope.to_string(), reason.to_string(), core::SCHEMA_VERSION).to_variant();
        let _ = conn.emit_signal(None, core::dbus::PATH, core::dbus::INTERFACE, core::dbus::SIGNAL, Some(&body));
        // A short-lived caller (the Omarchy theme hook) exits right after this.
        let _ = conn.flush_sync(gio::Cancellable::NONE);
    }
}

/// Choose the system theme (`omarchy` follows Omarchy's), tell every client, and
/// restyle. A theme with errors is refused and the current one stays.
pub fn choose_system_theme(theme_id: &str) -> Result<(), String> {
    core::set_system_theme(theme_id)?;
    announce("system", "theme-selected");
    apply();
    Ok(())
}

/// Give app `app_id` (`nyx-files`) its own theme, or `None` to follow the system.
pub fn choose_app_theme_for(app_id: &str, theme_id: Option<&str>) -> Result<(), String> {
    match theme_id {
        Some(id) => core::set_app_override(app_id, id)?,
        None => core::clear_app_override(app_id)?,
    }
    announce(&format!("app:{app_id}"), if theme_id.is_some() { "override-set" } else { "override-cleared" });
    apply();
    Ok(())
}

/// After themes were installed, updated or removed (or appearance reset).
pub fn themes_changed(reason: &str) {
    announce("themes", reason);
    apply();
}

/// The palette currently on screen (cached; graphs read it on every frame).
pub fn palette() -> Palette {
    active().0
}

/// The look currently on screen: accents, fonts, radii, material (cached).
pub fn look() -> Look {
    active().1
}

fn active() -> (Palette, Look) {
    ACTIVE.with(|a| {
        a.borrow_mut()
            .get_or_insert_with(|| {
                let t = resolved().theme;
                (t.palette, t.look)
            })
            .clone()
    })
}

/// The accent for app `app` (`files`, `mail`, …): the swatch picked in its
/// settings, else the theme's colour for it, else the theme accent.
pub fn app_accent(app: &str) -> String {
    resolve_app_accent(app, &palette(), &look(), &read_suite().unwrap_or_default())
}

fn resolve_app_accent(app: &str, palette: &Palette, look: &Look, suite: &Suite) -> String {
    suite
        .app_accents
        .get(app)
        .and_then(|name| look.swatches.iter().find(|(n, _)| n == name))
        .map(|(_, c)| c.clone())
        .or_else(|| look.accents.get(app).cloned())
        .unwrap_or_else(|| palette.accent.clone())
}

/// The accents to offer in an app's settings: `(name, colour)` from the active theme.
pub fn swatches() -> Vec<(String, String)> {
    look().swatches
}

/// The swatch picked for `app`, if any (`None` is *Theme default*).
pub fn app_swatch(app: &str) -> Option<String> {
    read_suite().and_then(|s| s.app_accents.get(app).cloned())
}

/// Pick a swatch for `app`, or `None` for the theme default.
pub fn set_app_swatch(app: &str, name: Option<&str>) {
    update_suite(|s| match name {
        Some(n) => {
            s.app_accents.insert(app.to_string(), n.to_string());
        }
        None => {
            s.app_accents.remove(app);
        }
    });
}

/// The accent for a section of an app (Settings → Privacy), else the app's.
pub fn section_accent(app: &str, section: &str) -> String {
    look().sections.get(app).and_then(|s| s.get(section)).cloned().unwrap_or_else(|| app_accent(app))
}

/// Call `f` whenever the theme changes, for as long as `owner` lives.
pub fn subscribe(owner: &impl IsA<gtk::Widget>, f: impl Fn() + 'static) {
    LISTENERS.with(|l| l.borrow_mut().push((owner.upcast_ref::<gtk::Widget>().downgrade(), Box::new(f))));
}

/// Call `f` after every restyle for the rest of the run.
pub fn on_change(f: impl Fn() + 'static) {
    GLOBAL.with(|g| g.borrow_mut().push(Box::new(f)));
}

/// Move this app to Nyx 2.0: the 2.0 stylesheet on top of the shared one, the
/// app's own accent as `@theme_accent`, and 2.0 sizes for the suite's density.
/// Call it before [`install`].
pub fn use_design_2() {
    DESIGN_2.with(|d| d.set(true));
}

/// Tell the theme which section of the app is on screen (`Some("privacy")`), so
/// its section accent applies; `None` for none. Restyles when it changes. A
/// swatch picked in the app's Accent row wins over section accents.
pub fn set_section(section: Option<&str>) {
    let new = section.map(str::to_string);
    if SECTION.with(|s| *s.borrow() != new) {
        SECTION.with(|s| *s.borrow_mut() = new);
        apply();
    }
}

/// Whether this app uses Nyx 2.0.
pub fn design_2() -> bool {
    DESIGN_2.with(|d| d.get())
}

/// Carry an old theme choice over once: an app that stored its own theme starts
/// the shared choices file if there is none yet, as it always did. Its stored
/// choice was a copy of the shared one, so it never becomes an override.
fn migrate(style: &Style) {
    // Only a choice the app actually stored (its settings file exists) carries over.
    if style.set_theme.is_none() || is_shell() || core::paths::suite_file().exists() || !nyx_core::paths::prefs_file().exists() {
        return;
    }
    let p = (style.prefs)();
    let theme = current_id(&p.theme).to_owned();
    update_suite(|s| {
        s.mode = p.mode.clone();
        if !theme.is_empty() {
            s.theme = theme;
        }
        s.migrated = 1;
    });
}

/// Install the app's stylesheet and the current theme on the default display,
/// and follow changes.
pub fn install(style: Style) {
    migrate(&style);
    STYLE.with(|s| *s.borrow_mut() = Some(style));
    let display = gdk::Display::default().expect("no display");
    let provider = gtk::CssProvider::new();
    gtk::style_context_add_provider_for_display(&display, &provider, gtk::STYLE_PROVIDER_PRIORITY_APPLICATION);
    PROVIDER.with(|p| *p.borrow_mut() = Some(provider));
    apply();
    watch();
}

/// Re-resolve and restyle live. The colours and the stylesheet are loaded as one
/// sheet so every colour name resolves against the new theme.
pub fn apply() {
    let prefs = style_prefs();
    let r = resolve_now();
    let Theme { mut palette, mut look, .. } = r.theme.clone();
    let v2 = design_2();
    let suite = read_suite().unwrap_or_default();
    let app_accent = STYLE.with(|s| {
        s.borrow().as_ref().map(|style| {
            let app = style.window_class.strip_suffix("-window").unwrap_or(style.window_class);
            let section = SECTION.with(|s| s.borrow().clone());
            let picked = suite.app_accents.contains_key(app);
            section
                .filter(|_| !picked)
                .and_then(|sec| look.sections.get(app).and_then(|m| m.get(&sec)).cloned())
                .unwrap_or_else(|| resolve_app_accent(app, &palette, &look, &suite))
        })
    });
    if v2 {
        // In 2.0 the app's own accent is the accent everything uses.
        if let Some(accent) = &app_accent {
            palette.accent = accent.clone();
            palette.glow = accent.clone();
        }
        if look.material.blended {
            look.panel = palette.bg.clone();
        }
    }
    let mut css = palette_css(&palette);
    STYLE.with(|s| {
        if let Some(style) = s.borrow().as_ref() {
            let accent = app_accent.clone().unwrap_or_else(|| palette.accent.clone());
            if v2 {
                css.push_str(&look_css(style.window_class, &accent, &look));
                css.push_str(&tokens_css(style.window_class, &r.tokens));
                css.push_str(&defines2(&look));
            }
            if let Some(extra) = style.extra_colors {
                css.push_str(&extra(&palette));
            }
            let base = base_css(style.window_class, style.base_skip);
            if v2 {
                css.push_str(&without_defines(&base));
                css.push('\n');
                css.push_str(&BASE2_CSS.replace("@APP@", style.window_class));
                if !look.material.blended {
                    css.push_str(UNBLENDED);
                }
            } else {
                css.push_str(&base);
            }
            css.push_str(style.css);
            if v2 {
                // Again after the app's sheet, so the theme's fonts win over an app's own.
                css.push_str(&look_css(style.window_class, &accent, &look));
                css.push_str(&suite2_css(style.window_class, &suite));
            } else {
                css.push_str(&look_css(style.window_class, &accent, &look));
                css.push_str(&tokens_css(style.window_class, &r.tokens));
                css.push_str(&suite_css(style.window_class, &suite));
            }
            if !prefs.glow {
                css.push('\n');
                css.push_str(style.no_glow_css);
            }
            if ADWAITA.with(Cell::get) {
                css.push_str(&adwaita_css(&palette, &look));
            }
        }
    });
    GENERATION.with(|g| g.set(g.get().max(core::snapshot::generation())));
    RESOLVED.with(|x| *x.borrow_mut() = Some(r.clone()));
    let unchanged = LAST_CSS.with(|l| *l.borrow() == css);
    let was = ACTIVE.with(|a| a.borrow().clone());
    ACTIVE.with(|a| *a.borrow_mut() = Some((palette.clone(), look.clone())));
    if unchanged && was.as_ref() == Some(&(palette.clone(), look.clone())) {
        return;
    }
    #[cfg(debug_assertions)]
    for name in undefined_colors(&css) {
        eprintln!("nyx-theme: the stylesheet uses @{name}, which no theme defines; GTK draws it white");
    }
    PROVIDER.with(|p| {
        if let Some(provider) = p.borrow().as_ref() {
            provider.load_from_string(&css);
        }
    });
    LAST_CSS.with(|l| *l.borrow_mut() = css);
    if let Some(settings) = gtk::Settings::default() {
        if let Some(property) = settings.find_property("gtk-interface-color-scheme") {
            if let Some(value) = glib::EnumClass::with_type(property.value_type())
                .and_then(|class| class.to_value_by_nick(if palette.light { "light" } else { "dark" }))
            {
                settings.set_property_from_value("gtk-interface-color-scheme", &value);
            }
        } else {
            settings.set_gtk_application_prefer_dark_theme(!palette.light);
        }
        settings.set_gtk_enable_animations(!(prefs.reduce_motion || r.tokens.motion.reduced));
    }
    notify_listeners();
}

/// Run every listener with the lists taken out, so a listener may subscribe (a page
/// rebuilt on a theme change does) without borrowing them twice.
fn notify_listeners() {
    let mut taken = LISTENERS.with(|l| std::mem::take(&mut *l.borrow_mut()));
    taken.retain(|(w, _)| w.upgrade().is_some());
    for (_, f) in &taken {
        f();
    }
    LISTENERS.with(|l| {
        let mut l = l.borrow_mut();
        let added = std::mem::take(&mut *l);
        *l = taken;
        l.extend(added);
        l.retain(|(w, _)| w.upgrade().is_some());
    });
    let global = GLOBAL.with(|g| std::mem::take(&mut *g.borrow_mut()));
    for f in &global {
        f();
    }
    GLOBAL.with(|g| {
        let mut g = g.borrow_mut();
        let added = std::mem::take(&mut *g);
        *g = global;
        g.extend(added);
    });
}

/// Restyle shortly, once, however many changes arrive meanwhile.
fn schedule() {
    if PENDING.with(|p| p.replace(true)) {
        return;
    }
    glib::timeout_add_local_once(std::time::Duration::from_millis(120), || {
        PENDING.with(|p| p.set(false));
        apply();
    });
}

/// Follow changes without polling: `ThemeChanged` on the session bus, and file
/// monitors on everything a theme is resolved from, for when no service runs.
/// Only if neither can be set up does it fall back to a slow poll.
fn watch() {
    let mut watching = false;
    if let Ok(conn) = gio::bus_get_sync(gio::BusType::Session, gio::Cancellable::NONE) {
        let subscription = conn.subscribe_to_signal(
            None,
            Some(core::dbus::INTERFACE),
            Some(core::dbus::SIGNAL),
            Some(core::dbus::PATH),
            None,
            gio::DBusSignalFlags::NONE,
            |signal| {
                let generation = signal.parameters.child_value(0).get::<u64>().unwrap_or(u64::MAX);
                if generation > GENERATION.with(Cell::get) {
                    schedule();
                }
            },
        );
        BUS.with(|b| *b.borrow_mut() = Some((conn, subscription)));
        watching = true;
    }
    let mut dirs = core::paths::watched_dirs();
    dirs.push(core::paths::theme_dirs()[1].clone());
    for dir in dirs {
        let file = gio::File::for_path(&dir);
        if let Ok(monitor) = file.monitor_directory(gio::FileMonitorFlags::WATCH_MOVES, gio::Cancellable::NONE) {
            monitor.connect_changed(|_, file, other, _| {
                let name = |f: Option<&gio::File>| f.and_then(|f| f.basename()).map(|b| b.to_string_lossy().to_string()).unwrap_or_default();
                let (a, b) = (name(Some(file)), name(other));
                // Our own snapshot lock and the installer's scratch folders are no change.
                if [a.as_str(), b.as_str()].into_iter().all(|n| n.is_empty() || n == ".staging" || n == ".previous" || n.ends_with(".lock")) {
                    return;
                }
                schedule();
            });
            KEEP.with(|k| k.borrow_mut().push(monitor.upcast()));
            watching = true;
        }
    }
    if !watching {
        poll();
    }
}

/// The last resort without a bus or file monitors: look for changes every two seconds.
fn poll() {
    let stamp = || {
        core::paths::watched_dirs()
            .iter()
            .map(|d| std::fs::metadata(d).and_then(|m| m.modified()).ok())
            .chain(std::iter::once(std::fs::metadata(core::paths::suite_file()).and_then(|m| m.modified()).ok()))
            .chain(std::iter::once(std::fs::metadata(core::paths::omarchy_colors()).and_then(|m| m.modified()).ok()))
            .collect::<Vec<_>>()
    };
    let last = RefCell::new(stamp());
    glib::timeout_add_seconds_local(2, move || {
        let now = stamp();
        if now != *last.borrow() {
            *last.borrow_mut() = now;
            apply();
        }
        glib::ControlFlow::Continue
    });
}

/// An RGB colour in 0..1, for drawing with cairo.
#[derive(Debug, Clone, Copy, PartialEq)]
pub struct Rgb(pub f64, pub f64, pub f64);

impl Rgb {
    pub fn hex(s: &str) -> Rgb {
        let h = s.trim().trim_start_matches('#');
        let v = |i: usize| h.get(i..i + 2).and_then(|x| u8::from_str_radix(x, 16).ok()).unwrap_or(0) as f64 / 255.0;
        if h.len() == 3 {
            let c = |i: usize| h.get(i..i + 1).and_then(|x| u8::from_str_radix(x, 16).ok()).unwrap_or(0) as f64 / 15.0;
            return Rgb(c(0), c(1), c(2));
        }
        Rgb(v(0), v(2), v(4))
    }

    pub fn to_hex(self) -> String {
        let c = |v: f64| (v.clamp(0.0, 1.0) * 255.0).round() as u8;
        format!("#{:02x}{:02x}{:02x}", c(self.0), c(self.1), c(self.2))
    }

    /// `mix(self, other, t)`, as in GTK CSS.
    pub fn mix(self, other: Rgb, t: f64) -> Rgb {
        Rgb(self.0 + (other.0 - self.0) * t, self.1 + (other.1 - self.1) * t, self.2 + (other.2 - self.2) * t)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn listener_may_subscribe_while_notified() {
        thread_local!(static RUNS: std::cell::Cell<u32> = const { std::cell::Cell::new(0) });
        on_change(|| {
            RUNS.with(|r| r.set(r.get() + 1));
            on_change(|| RUNS.with(|r| r.set(r.get() + 10)));
        });
        notify_listeners();
        assert_eq!(RUNS.with(|r| r.get()), 1);
        notify_listeners();
        // The first listener again (and it adds another), plus the one it added.
        assert_eq!(RUNS.with(|r| r.get()), 12);
    }

    #[test]
    fn design_2_replaces_the_v1_colours() {
        let base = without_defines(&base_css("files-window", &[]));
        assert!(!base.contains("@define-color"));
        let look = bundled().into_iter().find(|t| t.id == "nyx-dark").unwrap().look;
        let defines = defines2(&look);
        for name in ["hairline", "divider", "nav_active", "row_hover", "lift", "lift_active", "veil", "field", "track"] {
            assert!(defines.contains(&format!("@define-color {name} ")), "{name}");
        }
        let used = ["@field", "@track", "@theme_panel", "@theme_card", "@theme_raised", "@theme_popover", "@theme_text_tertiary"];
        for name in used {
            assert!(BASE2_CSS.contains(name), "2.0 sheet uses {name}");
        }
    }

    #[test]
    fn finds_undefined_colours() {
        let css = "@define-color theme_text #fff;\n.a { color: @theme_text; border-color: @border; }\n@keyframes x {}\n";
        assert_eq!(undefined_colors(css), ["border"]);
    }

    #[test]
    fn shared_sheets_define_every_colour_they_use() {
        for theme in bundled() {
            for v2 in [false, true] {
                let sheet = sheet_for_check("files-window", &theme, v2);
                assert_eq!(undefined_colors(&sheet), Vec::<String>::new(), "{} (2.0: {v2})", theme.id);
            }
        }
    }

    #[test]
    fn semantic_tokens_and_the_focus_ring_are_in_the_sheet() {
        let theme = bundled().into_iter().find(|t| t.id == DEFAULT_THEME).unwrap();
        let sheet = sheet_for_check("files-window", &theme, true);
        assert!(sheet.contains("@define-color nyx_surface_primary #1e1e2e;"));
        assert!(sheet.contains("@define-color nyx_text_on_accent "));
        assert!(sheet.contains("--nyx-motion-normal: 120ms"));
        assert!(sheet.contains(":focus-visible { outline-color: @nyx_border_focus; outline-width: 2px; }"));
        assert_eq!(theme.palette.bg, "#1e1e2e", "the established names carry the same colours");
    }

    #[test]
    fn density_sizes_follow_the_suite() {
        let mut suite = Suite::default();
        assert!(suite2_css("files-window", &suite).contains(".app-header { min-height: 46px; }"));
        suite.density = "compact".into();
        assert!(suite2_css("files-window", &suite).contains(".app-header { min-height: 42px; }"));
    }

    #[test]
    fn base_css_scopes_and_skips() {
        let all = base_css("music-window", &[]);
        assert!(all.contains("window.music-window {"));
        assert!(!all.contains("@APP@"));
        let without = base_css("music-window", &[".toast"]);
        assert!(all.contains(".toast {") && !without.contains("\n.toast {"));
        assert!(without.contains(".toast-"), "only the exact selector is dropped");
    }

    #[test]
    fn bundled_ids_are_unique() {
        let themes = bundled();
        let mut ids: Vec<_> = themes.iter().map(|t| t.id.clone()).collect();
        ids.sort();
        ids.dedup();
        assert_eq!(ids.len(), themes.len());
    }

    #[test]
    fn app_accents_name_swatches() {
        let dark = bundled().into_iter().find(|t| t.id == "nyx-dark").unwrap();
        let blue = dark.look.swatches.iter().find(|(n, _)| n == "blue").unwrap().1.clone();
        assert_eq!(dark.look.sections["settings"]["connections"], blue);
        let css = look_css("settings-window", &blue, &dark.look);
        assert!(css.contains(".nav-group.section-connections { border-bottom-color: alpha("));
        let t = bundled().into_iter().find(|t| t.id == "nyx-dark").unwrap();
        let css = look_css("files-window", &t.look.accents["files"], &t.look);
        assert!(css.contains("font-family: \"Inter\", \"Inter Variable\", \"Inter 18pt\", sans-serif;"));
    }
}
