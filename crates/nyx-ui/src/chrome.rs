//! The window's frame without a top bar. Where you are shows in the sidebar
//! (and the window title); the sidebar's head holds its toggle and search;
//! the settings gear and app actions sit at the right of the status bar.

use crate::widgets;
use gtk::glib;
use gtk::prelude::*;
use nyx_desktop::{Desktop, actions};
use nyx_shell_proto::{Fullscreen, WindowActionKind as A, WindowControlsConfig, WindowState};
use std::cell::RefCell;
use std::rc::Rc;
use std::sync::Arc;

/// The sidebar's first row: the collapse toggle, the app's name, and a search
/// button when the app has one. In the icon-only sidebar the name hides and
/// the buttons stack.
pub struct SidebarHead {
    pub root: gtk::Box,
    pub toggle: gtk::Button,
    pub search: Option<gtk::Button>,
}

pub fn sidebar_head(app_name: &str, search_tooltip: Option<&str>) -> SidebarHead {
    let root = gtk::Box::new(gtk::Orientation::Horizontal, 2);
    root.add_css_class("sidebar-head");
    let toggle = widgets::bar_button("sidebar-show-symbolic", "Collapse or expand the sidebar (Ctrl+B)");
    root.append(&toggle);
    let name = widgets::label(app_name, "sidebar-app-name");
    name.add_css_class("compact-hide");
    name.set_hexpand(true);
    name.set_xalign(0.0);
    root.append(&name);
    let search = search_tooltip.map(|tip| {
        let b = widgets::bar_button("system-search-symbolic", tip);
        root.append(&b);
        b
    });
    SidebarHead { root, toggle, search }
}

/// Lay the head out for the icon-only sidebar (stacked) or the full one (a row).
pub fn set_head_compact(head: &gtk::Box, compact: bool) {
    head.set_orientation(if compact { gtk::Orientation::Vertical } else { gtk::Orientation::Horizontal });
    head.set_halign(if compact { gtk::Align::Center } else { gtk::Align::Fill });
    let mut child = head.first_child();
    while let Some(c) = child {
        if c.has_css_class("sidebar-app-name") {
            c.set_visible(!compact);
        }
        child = c.next_sibling();
    }
}

/// A slim strip over the page that holds `entry`, shown only while the entry is.
/// Apps keep showing and hiding the entry itself.
pub fn search_strip(entry: &gtk::SearchEntry) -> gtk::Box {
    let strip = gtk::Box::new(gtk::Orientation::Horizontal, 0);
    strip.add_css_class("search-strip");
    entry.set_hexpand(true);
    if let Some(parent) = entry.parent().and_downcast::<gtk::Box>() {
        parent.remove(entry);
    }
    strip.append(entry);
    strip.set_visible(entry.get_visible());
    let s = strip.clone();
    // Effective visibility includes the hidden strip itself; use the entry’s
    // requested visibility so showing it can reveal its parent.
    entry.connect_visible_notify(move |e| s.set_visible(e.get_visible()));
    strip
}

/// The settings gear for the end of the status bar.
pub fn gear(open: impl Fn() + 'static) -> gtk::Button {
    let b = settings_button(open);
    b.add_css_class("status-action");
    b
}

/// The settings button every Nyx app uses: two sliders. In 2.0 it sits at the
/// right end of the header.
pub fn settings_button(open: impl Fn() + 'static) -> gtk::Button {
    install_icons();
    let b = widgets::bar_button(SETTINGS_ICON, "Settings (Ctrl+,)");
    b.connect_clicked(move |_| open());
    b
}

const SETTINGS_ICON: &str = "nyx-settings-symbolic";

/// The suite's own symbolic icons, written once to the app's cache and added to
/// the icon theme. Filled shapes: GTK fills every path of a symbolic icon.
fn install_icons() {
    thread_local! {
        static DONE: std::cell::Cell<bool> = const { std::cell::Cell::new(false) };
    }
    if DONE.with(|d| d.replace(true)) {
        return;
    }
    let dir = nyx_core::paths::cache_dir().join("nyx-icons");
    let path = dir.join(format!("{SETTINGS_ICON}.svg"));
    if std::fs::read_to_string(&path).ok().as_deref() != Some(SETTINGS_SVG) {
        let _ = nyx_core::cmd::atomic_write(&path, SETTINGS_SVG);
    }
    if let Some(display) = gtk::gdk::Display::default() {
        gtk::IconTheme::for_display(&display).add_search_path(dir);
    }
}

const SETTINGS_SVG: &str = r##"<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
<g fill="#000000">
<rect x="3.2" y="6.2" width="10.6" height="1.6" rx="0.8"/>
<rect x="16.2" y="6.2" width="4.6" height="1.6" rx="0.8"/>
<rect x="3.2" y="16.2" width="4.6" height="1.6" rx="0.8"/>
<rect x="10.2" y="16.2" width="10.6" height="1.6" rx="0.8"/>
<rect x="14.2" y="4.2" width="1.6" height="5.6" rx="0.8"/>
<rect x="8.2" y="14.2" width="1.6" height="5.6" rx="0.8"/>
</g>
</svg>
"##;

/// A small icon button for the status bar (an app action that used to sit in
/// the top bar).
pub fn status_action(icon: &str, tooltip: &str, run: impl Fn() + 'static) -> gtk::Button {
    let b = widgets::bar_button(icon, tooltip);
    b.add_css_class("status-action");
    b.connect_clicked(move |_| run());
    b
}

/// The window title for a page: "Music — Albums".
pub fn set_title(window: &impl IsA<gtk::Window>, app_name: &str, page: &str) {
    let title = if page.is_empty() || page == app_name { app_name.to_string() } else { format!("{app_name} — {page}") };
    window.set_title(Some(&title));
}

/// The suite's F1 control: the key is highlighted separately from its label.
pub fn shortcuts_button(open: impl Fn() + 'static) -> gtk::Button {
    let help = gtk::Button::new();
    help.add_css_class("status-help");
    let content = widgets::hbox(10);
    content.append(&widgets::label("F1", "status-key"));
    content.append(&widgets::label("Shortcuts", ""));
    help.set_child(Some(&content));
    help.set_tooltip_text(Some("Show the keyboard shortcuts"));
    help.connect_clicked(move |_| open());
    help
}

/// The Nyx 2.0 unified header: the app's symbolic icon and name (in its accent)
/// with an optional subtitle at the left, what the app navigates by in the
/// middle, its actions at the right, and the window's Close button after them,
/// which opens the other window controls (see [`window_controls`]). Empty parts
/// drag the window; a double-click maximizes.
pub struct AppHeader {
    /// Put this at the top of the window.
    pub root: gtk::WindowHandle,
    pub subtitle: gtk::Label,
    /// After the name and subtitle (a sidebar toggle, back and forward).
    pub start: gtk::Box,
    /// Centred in the header (a path, a search field, a view switch).
    pub center: gtk::Box,
    /// Before the window controls (the app's actions and its `⋯` menu).
    pub end: gtk::Box,
}

pub fn app_header(window: &impl IsA<gtk::Window>, icon: &str, name: &str) -> AppHeader {
    let bar = gtk::CenterBox::new();
    bar.add_css_class("app-header");
    let left = gtk::Box::new(gtk::Orientation::Horizontal, 0);
    let image = gtk::Image::from_icon_name(icon);
    image.add_css_class("app-icon");
    left.append(&image);
    left.append(&widgets::label(name, "app-title"));
    let subtitle = widgets::label("", "app-subtitle");
    subtitle.set_ellipsize(gtk::pango::EllipsizeMode::End);
    subtitle.set_visible(false);
    left.append(&subtitle);
    let start = gtk::Box::new(gtk::Orientation::Horizontal, 2);
    start.set_margin_start(10);
    left.append(&start);
    let center = gtk::Box::new(gtk::Orientation::Horizontal, 6);
    let right = gtk::Box::new(gtk::Orientation::Horizontal, 2);
    let end = gtk::Box::new(gtk::Orientation::Horizontal, 2);
    right.append(&end);
    right.append(&window_controls(window.upcast_ref()));
    bar.set_start_widget(Some(&left));
    bar.set_center_widget(Some(&center));
    bar.set_end_widget(Some(&right));
    let root = gtk::WindowHandle::new();
    root.set_child(Some(&bar));
    AppHeader { root, subtitle, start, center, end }
}

impl AppHeader {
    /// Show `text` after the app's name (the page, folder or account), or nothing.
    pub fn set_subtitle(&self, text: &str) {
        self.subtitle.set_text(text);
        self.subtitle.set_visible(!text.is_empty());
    }
}

/// The Hyprland tag on windows that draw their own controls. Settings' Hyprland
/// config gives windows with it no Omarchy titlebar on floating workspaces.
pub const OWN_CONTROLS_TAG: &str = "nyx-own-controls";

/// Where the compositor has a window, as far as window controls care.
#[derive(Clone, Debug, Default, PartialEq)]
pub struct Placement {
    /// Floating and not fullscreen.
    pub floating: bool,
    /// On one of Omarchy's floating workspaces, where a minimized window waits in
    /// the dock, and Omarchy's minimize is installed.
    pub can_minimize: bool,
    /// The window as Nyx Shell Core describes it, with the actions it can take now
    /// (`None` outside Hyprland, or before the window is found).
    pub window: Option<WindowState>,
    /// The monitors it could move to: connector and description.
    pub monitors: Vec<(String, String)>,
    address: Option<String>,
}

/// Call `changed` with `window`'s placement now and whenever it changes. Under
/// Hyprland the window is also tagged [`OWN_CONTROLS_TAG`], so it gets no Omarchy
/// titlebar. Hyprland reports every window as tiled, floating or not, so GTK's
/// tiled states only decide outside it.
pub fn follow_placement(window: &impl IsA<gtk::Window>, changed: impl Fn(&Placement) + 'static) {
    let t = tracked(window.upcast_ref());
    changed(&t.placement.borrow());
    t.listeners.borrow_mut().push(Rc::new(changed));
}

/// The window's placement as last seen (not floating until it is known).
pub fn placement(window: &impl IsA<gtk::Window>) -> Placement {
    tracked(window.upcast_ref()).placement.borrow().clone()
}

/// Minimize to the dock the way Omarchy's titlebar does, or ask the compositor
/// outside Hyprland.
pub fn minimize(window: &impl IsA<gtk::Window>) {
    match placement(window).address {
        Some(a) => {
            actions::minimize(&a);
        }
        None => window.as_ref().minimize(),
    }
}

/// Maximize, or bring back to its own size. Omarchy ignores a window's own
/// request, so under Hyprland this asks Hyprland.
pub fn toggle_maximized(window: &impl IsA<gtk::Window>) {
    match placement(window).address {
        Some(a) => {
            std::thread::spawn(move || actions::toggle_maximized(&a).run());
        }
        None => {
            let w = window.as_ref();
            if w.is_maximized() { w.unmaximize() } else { w.maximize() }
        }
    }
}

/// The window's controls: one Close button at the end of the header. Resting the
/// pointer on it (`[window_controls] hover_delay_ms`), a right-click, a long press, or
/// the Menu key, Shift+F10 or Down while it has focus open the other window actions
/// below it, so they never cover the header's own buttons. A click always closes.
fn window_controls(window: &gtk::Window) -> gtk::Box {
    let root = gtk::Box::new(gtk::Orientation::Horizontal, 2);
    root.add_css_class("window-controls");
    root.set_valign(gtk::Align::Center);
    let close = widgets::bar_button("window-close-symbolic", "Close");
    close.add_css_class("window-close");
    close.set_tooltip_text(Some("Close\nRest the pointer here or right-click for the other window controls"));
    close.update_property(&[
        gtk::accessible::Property::Label("Close"),
        gtk::accessible::Property::Description("The other window controls open with the Menu key or Shift+F10"),
        gtk::accessible::Property::HasPopup(true),
    ]);
    root.append(&close);
    let w = window.downgrade();
    close.connect_clicked(move |_| {
        if let Some(w) = w.upgrade() {
            w.close();
        }
    });
    let hover = Rc::new(Hover {
        window: window.downgrade(),
        anchor: close.downgrade(),
        open: RefCell::default(),
        pending_open: RefCell::default(),
        pending_close: RefCell::default(),
    });

    let motion = gtk::EventControllerMotion::new();
    let h = hover.clone();
    motion.connect_enter(move |_, _, _| h.pointer_in());
    let h = hover.clone();
    motion.connect_leave(move |_| h.pointer_out());
    close.add_controller(motion);
    let h = hover.clone();
    crate::menu::on_right_click(&close, move |_, _, _| h.show(true));
    let keys = gtk::EventControllerKey::new();
    let h = hover.clone();
    keys.connect_key_pressed(move |_, key, _, state| {
        if crate::menu::is_menu_key(key, state) || key == gtk::gdk::Key::Down {
            h.show(true);
            return glib::Propagation::Stop;
        }
        glib::Propagation::Proceed
    });
    close.add_controller(keys);

    // A change of mode changes the actions: close what was shown for the old one.
    // NYX_UI_TEST_WINDOW_CONTROLS=open shows it as hovering would, =focus as the
    // keyboard would, for screenshots of test copies.
    let test = std::env::var("NYX_UI_TEST_WINDOW_CONTROLS").unwrap_or_default();
    let (test_open, test_focus) = (test == "open" || test == "focus", test == "focus");
    let (r, h) = (root.downgrade(), hover.clone());
    follow_placement(window, move |p| {
        if let Some(r) = r.upgrade() {
            r.set_visible(settings().enabled);
        }
        h.hide();
        if test_open && p.window.is_some() {
            let h = h.clone();
            glib::timeout_add_local_once(std::time::Duration::from_millis(300), move || h.show(test_focus));
        }
    });
    let h = hover.clone();
    window.connect_is_active_notify(move |w| {
        if !w.is_active() {
            h.hide();
        }
    });
    root
}

/// The window controls' popover and the timers that open and close it on hover.
struct Hover {
    window: glib::WeakRef<gtk::Window>,
    anchor: glib::WeakRef<gtk::Button>,
    open: RefCell<Option<gtk::Popover>>,
    pending_open: RefCell<Option<glib::SourceId>>,
    pending_close: RefCell<Option<glib::SourceId>>,
}

/// How long the pointer may be outside both the button and the popover before a
/// hover-opened popover closes, so a small detour on the way in doesn't close it.
const HOVER_GRACE: std::time::Duration = std::time::Duration::from_millis(350);

impl Hover {
    fn pointer_in(self: &Rc<Self>) {
        cancel(&self.pending_close);
        if self.open.borrow().is_some() || self.pending_open.borrow().is_some() {
            return;
        }
        let delay = std::time::Duration::from_millis(settings().hover_delay_ms);
        let h = Rc::downgrade(self);
        let id = glib::timeout_add_local_once(delay, move || {
            if let Some(h) = h.upgrade() {
                h.pending_open.borrow_mut().take();
                h.show(false);
            }
        });
        *self.pending_open.borrow_mut() = Some(id);
    }

    fn pointer_out(self: &Rc<Self>) {
        cancel(&self.pending_open);
        let hovering = self.open.borrow().as_ref().is_some_and(|p| !p.is_autohide());
        if !hovering || self.pending_close.borrow().is_some() {
            return;
        }
        let h = Rc::downgrade(self);
        let id = glib::timeout_add_local_once(HOVER_GRACE, move || {
            if let Some(h) = h.upgrade() {
                h.pending_close.borrow_mut().take();
                h.hide();
            }
        });
        *self.pending_close.borrow_mut() = Some(id);
    }

    /// Open the popover. From the keyboard or a click it takes focus and closes on a
    /// click elsewhere; from hover it leaves clicks alone, so Close still closes.
    fn show(self: &Rc<Self>, focus: bool) {
        cancel(&self.pending_open);
        cancel(&self.pending_close);
        let (Some(window), Some(anchor)) = (self.window.upgrade(), self.anchor.upgrade()) else { return };
        if let Some(open) = self.open.borrow().as_ref() {
            if focus && !open.is_autohide() {
                open.set_autohide(true);
                open.grab_focus();
            }
            return;
        }
        let entries = entries(&window, &placement(&window));
        if entries.is_empty() {
            return;
        }
        let popover = crate::menu::popover(&anchor, entries);
        popover.add_css_class("window-controls-popover");
        popover.set_position(gtk::PositionType::Bottom);
        popover.set_halign(gtk::Align::End);
        popover.set_autohide(focus);
        let motion = gtk::EventControllerMotion::new();
        let h = self.clone();
        motion.connect_enter(move |_, _, _| cancel(&h.pending_close));
        let h = self.clone();
        motion.connect_leave(move |_| h.pointer_out());
        popover.add_controller(motion);
        let h = Rc::downgrade(self);
        popover.connect_closed(move |_| {
            if let Some(h) = h.upgrade() {
                h.open.borrow_mut().take();
                cancel(&h.pending_close);
            }
        });
        *self.open.borrow_mut() = Some(popover.clone());
        popover.popup();
    }

    fn hide(&self) {
        cancel(&self.pending_open);
        cancel(&self.pending_close);
        let open = self.open.borrow_mut().take();
        if let Some(p) = open {
            p.popdown();
        }
    }
}

fn cancel(slot: &RefCell<Option<glib::SourceId>>) {
    if let Some(id) = slot.borrow_mut().take() {
        id.remove();
    }
}

/// The other window actions for the window's mode: what Nyx Shell Core's action table
/// says it can take now (`nyx_shell_proto::window::available`). Outside Hyprland, GTK's
/// own minimize, maximize and fullscreen.
fn entries(window: &gtk::Window, p: &Placement) -> Vec<crate::menu::Entry> {
    use crate::menu::{check, item, separator, sub};
    let Some(w) = &p.window else {
        let (a, b, c) = (window.downgrade(), window.downgrade(), window.downgrade());
        let maximized = window.is_maximized();
        return vec![
            item("Minimize", move || a.upgrade().into_iter().for_each(|w| w.minimize())).icon("window-minimize-symbolic"),
            item(if maximized { "Restore size" } else { "Maximize" }, move || {
                b.upgrade().into_iter().for_each(|w| if w.is_maximized() { w.unmaximize() } else { w.maximize() })
            })
            .icon(if maximized { "window-restore-symbolic" } else { "window-maximize-symbolic" }),
            item(if window.is_fullscreen() { "Leave fullscreen" } else { "Fullscreen" }, move || {
                c.upgrade().into_iter().for_each(|w| if w.is_fullscreen() { w.unfullscreen() } else { w.fullscreen() })
            })
            .icon("view-fullscreen-symbolic"),
        ];
    };
    let has = |a: A| w.actions.contains(&a);
    let mut out: Vec<crate::menu::Entry> = rows(w)
        .into_iter()
        .map(|r| {
            let address = w.address.clone();
            let run = move || request(address.clone(), r.action, None);
            match r.checked {
                Some(on) => check(r.label, on, move |_| run()),
                None => item(r.label, run).icon(r.icon),
            }
        })
        .collect();
    let workspaces: Vec<crate::menu::Entry> = if has(A::MoveToWorkspace) {
        (1..=10)
            .filter(|n| *n != w.workspace)
            .map(|n| {
                let address = w.address.clone();
                item(&format!("Workspace {n}"), move || request(address.clone(), A::MoveToWorkspace, Some(n.to_string())))
            })
            .collect()
    } else {
        Vec::new()
    };
    let monitors: Vec<crate::menu::Entry> = if has(A::MoveToMonitor) {
        p.monitors
            .iter()
            .filter(|(name, _)| w.monitor.as_deref() != Some(name.as_str()))
            .map(|(name, description)| {
                let (address, name) = (w.address.clone(), name.clone());
                let label = if description.is_empty() { name.clone() } else { format!("{description} ({name})") };
                item(&label, move || request(address.clone(), A::MoveToMonitor, Some(name.clone())))
            })
            .collect()
    } else {
        Vec::new()
    };
    if !workspaces.is_empty() || !monitors.is_empty() {
        out.push(separator());
    }
    if !workspaces.is_empty() {
        out.push(sub("Move to workspace", workspaces).icon("view-app-grid-symbolic"));
    }
    if !monitors.is_empty() {
        out.push(sub("Move to monitor", monitors).icon("video-display-symbolic"));
    }
    out
}

/// One of the popover's actions, named for the window's mode.
#[derive(Debug, PartialEq)]
struct Row {
    action: A,
    label: &'static str,
    icon: &'static str,
    /// A check row (keep on top), and whether it's on.
    checked: Option<bool>,
}

/// The popover's actions for `w`, in order: floating windows minimize, maximize and
/// tile; tiled ones expand (staying tiled) and float; both go fullscreen.
fn rows(w: &WindowState) -> Vec<Row> {
    let has = |a: A| w.actions.contains(&a);
    let row = |action, label, icon| Row { action, label, icon, checked: None };
    let maximized = w.fullscreen == Fullscreen::Maximized;
    let fullscreen = w.fullscreen == Fullscreen::Fullscreen;
    let mut out = Vec::new();
    if has(A::Minimize) {
        out.push(row(A::Minimize, "Minimize", "window-minimize-symbolic"));
    }
    if has(A::ToggleMaximized) {
        out.push(match (w.floating, maximized) {
            (true, false) => row(A::ToggleMaximized, "Maximize", "window-maximize-symbolic"),
            (true, true) => row(A::ToggleMaximized, "Restore size", "window-restore-symbolic"),
            (false, false) => row(A::ToggleMaximized, "Expand", "window-maximize-symbolic"),
            (false, true) => row(A::ToggleMaximized, "Restore to the layout", "window-restore-symbolic"),
        });
    }
    if has(A::SetFloating) {
        out.push(row(A::SetFloating, "Float", "window-new-symbolic"));
    }
    if has(A::SetTiled) {
        out.push(row(A::SetTiled, "Tile", "view-grid-symbolic"));
    }
    if has(A::ToggleFullscreen) {
        out.push(if fullscreen {
            row(A::ToggleFullscreen, "Leave fullscreen", "view-restore-symbolic")
        } else {
            row(A::ToggleFullscreen, "Fullscreen", "view-fullscreen-symbolic")
        });
    }
    if has(A::TogglePinned) {
        out.push(Row { checked: Some(w.pinned), ..row(A::TogglePinned, "Keep on top, on every workspace", "view-pin-symbolic") });
    }
    out
}

/// Run a window action on another thread: through Nyx Shell Core when it runs (it
/// checks the action against the window's state), else straight with Hyprland.
fn request(address: String, action: A, target: Option<String>) {
    std::thread::spawn(move || match through_shell_core(&address, action, target.as_deref()) {
        Ok(true) => {}
        Ok(false) => directly(&address, action, target.as_deref()),
        Err(Refused(e)) => eprintln!("window controls: {e}"),
    });
}

/// Shell Core refused the action itself (it isn't available for the window now).
struct Refused(String);

/// Ask Shell Core. `Ok(true)` when it ran the action, `Ok(false)` when Shell Core isn't
/// there or can't do it for this app (Hyprland is asked directly instead).
fn through_shell_core(address: &str, action: A, target: Option<&str>) -> Result<bool, Refused> {
    use nyx_shell_proto::{ErrorCode, Op, RawRequest, Reply, WindowAction};
    use std::io::{BufRead, Write};
    let Some(path) = nyx_shell_proto::socket_path() else { return Ok(false) };
    let Ok(stream) = std::os::unix::net::UnixStream::connect(path) else { return Ok(false) };
    let _ = stream.set_read_timeout(Some(std::time::Duration::from_secs(2)));
    let op = Op::RequestWindowAction(WindowAction {
        window: address.into(),
        action,
        workspace: (action == A::MoveToWorkspace).then(|| target.map(str::to_string)).flatten(),
        monitor: (action == A::MoveToMonitor).then(|| target.map(str::to_string)).flatten(),
        follow: false,
    });
    let Ok(mut line) = serde_json::to_string(&RawRequest::new(1, &op)) else { return Ok(false) };
    line.push('\n');
    if (&stream).write_all(line.as_bytes()).is_err() {
        return Ok(false);
    }
    let mut answer = String::new();
    if std::io::BufReader::new(&stream).read_line(&mut answer).is_err() {
        return Ok(false);
    }
    let Ok(reply) = serde_json::from_str::<Reply>(&answer) else { return Ok(false) };
    match reply.err {
        None => Ok(true),
        Some(e) if matches!(e.code, ErrorCode::Invalid | ErrorCode::NotFound) => Err(Refused(e.to_string())),
        // An older Shell Core, one without window.own, or one that doesn't act.
        Some(_) => Ok(false),
    }
}

/// Without Shell Core (Omarchy): the same actions as Hyprland dispatchers.
fn directly(address: &str, action: A, target: Option<&str>) {
    use nyx_desktop::actions::Dispatch;
    let lua = |s: String, classic: String| Dispatch { lua: s, classic }.run();
    let to = format!("window = \"address:0x{address}\"");
    match action {
        A::Focus => {}
        A::Close => actions::close(address),
        A::ToggleFloating => {
            actions::toggle_floating(address).run();
        }
        A::SetFloating | A::SetTiled => {
            let (set, classic) = if action == A::SetFloating { ("enable", "setfloating") } else { ("disable", "settiled") };
            lua(format!("hl.dsp.window.float({{ action = \"{set}\", {to} }})"), format!("{classic} address:0x{address}"));
        }
        A::ToggleMaximized => {
            actions::toggle_maximized(address).run();
        }
        A::ToggleFullscreen => {
            lua(format!("hl.dsp.window.fullscreen({{ mode = \"fullscreen\", action = \"toggle\", {to} }})"), "fullscreen 0".into());
        }
        A::TogglePinned => {
            lua(format!("hl.dsp.window.pin({{ action = \"toggle\", {to} }})"), format!("pin address:0x{address}"));
        }
        A::Minimize => {
            actions::minimize(address);
        }
        A::MoveToWorkspace => {
            if let Some(ws) = target {
                actions::move_to_workspace(address, ws, false).run();
            }
        }
        A::MoveToMonitor => {
            if let Some(m) = target {
                actions::move_to_monitor(address, m).run();
            }
        }
    }
}

/// `[window_controls]` from the `shell` settings layers (NyxOS's defaults, the
/// administrator's, the user's), read once.
fn settings() -> WindowControlsConfig {
    thread_local! {
        static SETTINGS: std::cell::OnceCell<WindowControlsConfig> = const { std::cell::OnceCell::new() };
    }
    SETTINGS.with(|s| s.get_or_init(read_settings).clone())
}

fn read_settings() -> WindowControlsConfig {
    let user = std::env::var_os("XDG_CONFIG_HOME")
        .map(std::path::PathBuf::from)
        .filter(|p| p.is_absolute())
        .unwrap_or_else(|| std::path::PathBuf::from(std::env::var_os("HOME").unwrap_or_default()).join(".config"))
        .join("nyx/shell.toml");
    let mut merged = toml::Table::new();
    for path in [std::path::PathBuf::from("/etc/nyxos/defaults/shell.toml"), "/etc/nyxos/overrides/shell.toml".into(), user] {
        if let Some(t) = std::fs::read_to_string(&path).ok().and_then(|s| s.parse::<toml::Table>().ok()) {
            merge(&mut merged, t);
        }
    }
    nyx_shell_proto::ShellConfig::from_table(&merged).0.window_controls
}

fn merge(into: &mut toml::Table, from: toml::Table) {
    for (k, v) in from {
        match (into.get_mut(&k), v) {
            (Some(toml::Value::Table(a)), toml::Value::Table(b)) => merge(a, b),
            (_, v) => {
                into.insert(k, v);
            }
        }
    }
}

type Listener = Rc<dyn Fn(&Placement)>;

/// A window whose placement is followed, matched to its Hyprland window.
struct Tracked {
    window: glib::WeakRef<gtk::Window>,
    placement: RefCell<Placement>,
    listeners: RefCell<Vec<Listener>>,
    tagged: RefCell<Option<String>>,
}

impl Tracked {
    fn set(&self, p: Placement) {
        if *self.placement.borrow() == p {
            return;
        }
        *self.placement.borrow_mut() = p.clone();
        let listeners = self.listeners.borrow().clone();
        for l in listeners {
            l(&p);
        }
    }
}

thread_local! {
    static TRACKED: RefCell<Vec<Rc<Tracked>>> = RefCell::default();
    static HYPRLAND: bool = nyx_desktop::hypr::Instance::find().is_ok();
    static OMARCHY_MINIMIZE: bool = on_path("omarchy-hyprland-window-minimize");
    static WATCHER: RefCell<Option<nyx_desktop::watch::Watcher>> = const { RefCell::new(None) };
    static LAST: RefCell<Option<Arc<Desktop>>> = const { RefCell::new(None) };
}

fn tracked(window: &gtk::Window) -> Rc<Tracked> {
    let found = TRACKED.with(|l| l.borrow().iter().find(|t| t.window.upgrade().as_ref() == Some(window)).cloned());
    if let Some(t) = found {
        return t;
    }
    let t = Rc::new(Tracked {
        window: window.downgrade(),
        placement: RefCell::default(),
        listeners: RefCell::default(),
        tagged: RefCell::default(),
    });
    TRACKED.with(|l| l.borrow_mut().push(t.clone()));
    if HYPRLAND.with(|h| *h) {
        window.connect_map(|_| refresh());
        window.connect_title_notify(|_| refresh());
        WATCHER.with(|w| {
            if w.borrow().is_none() {
                *w.borrow_mut() = Some(nyx_desktop::watch::watch_local(|u| {
                    LAST.with(|l| *l.borrow_mut() = Some(u.desktop.clone()));
                    refresh();
                }));
            }
        });
        refresh();
    } else {
        follow_toplevel_state(window, &t);
    }
    t
}

fn refresh() {
    let Some(desktop) = LAST.with(|l| l.borrow().clone()) else { return };
    let pid = std::process::id() as i32;
    let mine: Vec<&nyx_desktop::Window> = desktop.windows.iter().filter(|w| w.pid == pid).collect();
    let list: Vec<Rc<Tracked>> = TRACKED.with(|l| {
        let mut l = l.borrow_mut();
        l.retain(|t| t.window.upgrade().is_some());
        l.clone()
    });
    let single = mine.len() == 1 && list.len() == 1;
    for t in &list {
        let Some(window) = t.window.upgrade() else { continue };
        let found = if single {
            mine.first().copied()
        } else {
            let title = window.title().unwrap_or_default();
            let previous = t.placement.borrow().address.clone();
            mine.iter()
                .find(|h| h.title == title.as_str())
                .or_else(|| previous.and_then(|a| mine.iter().find(|h| h.address == a)))
                .copied()
        };
        t.apply(found, &desktop);
    }
}

impl Tracked {
    fn apply(&self, found: Option<&nyx_desktop::Window>, desktop: &Desktop) {
        let Some(h) = found else {
            self.set(Placement::default());
            return;
        };
        let layout = desktop.workspaces.iter().find(|w| w.id == h.workspace).map_or("", |w| w.tiled_layout.as_str());
        let can_minimize = OMARCHY_MINIMIZE.with(|m| *m)
            && nyx_desktop::omarchy::workspace_mode(h.workspace, layout) == nyx_desktop::omarchy::Mode::Floating;
        let monitor = |id: i64| desktop.monitors.iter().find(|m| m.id == id).map(|m| m.name.clone());
        let minimized = desktop.workspaces.iter().any(|w| w.id == h.workspace && w.name == nyx_desktop::actions::MINIMIZED);
        let mut state = WindowState {
            address: h.address.clone(),
            app_id: h.class.clone(),
            initial_app_id: h.initial_class.clone(),
            workspace: h.workspace,
            monitor: monitor(h.monitor),
            floating: h.floating,
            fullscreen: match h.fullscreen {
                0 => Fullscreen::None,
                1 => Fullscreen::Maximized,
                _ => Fullscreen::Fullscreen,
            },
            hidden: h.hidden,
            minimized,
            pinned: h.pinned,
            pid: Some(h.pid),
            controls: Some(nyx_shell_proto::Controls::NativeNyx),
            ..Default::default()
        };
        let here: std::collections::BTreeSet<i64> = if can_minimize { [h.workspace].into() } else { Default::default() };
        state.actions = nyx_shell_proto::window::available(&state, &here);
        self.set(Placement {
            floating: desktop.connected && h.floating && h.fullscreen & 2 == 0,
            can_minimize,
            window: desktop.connected.then_some(state),
            monitors: desktop.monitors.iter().filter(|m| !m.disabled).map(|m| (m.name.clone(), m.description.clone())).collect(),
            address: Some(h.address.clone()),
        });
        if self.tagged.borrow().as_deref() != Some(h.address.as_str()) {
            *self.tagged.borrow_mut() = Some(h.address.clone());
            let a = h.address.clone();
            std::thread::spawn(move || actions::tag(&a, OWN_CONTROLS_TAG, true).run());
        }
    }
}

fn on_path(program: &str) -> bool {
    std::env::var_os("PATH").is_some_and(|p| std::env::split_paths(&p).any(|d| d.join(program).is_file()))
}

/// Outside Hyprland: a tiled, maximized or fullscreen window, as GTK reports it, is
/// placed by the compositor and gets no controls.
fn follow_toplevel_state(window: &gtk::Window, t: &Rc<Tracked>) {
    let tw = Rc::downgrade(t);
    let update = move |surface: &gtk::gdk::Toplevel| {
        use gtk::gdk::ToplevelState as S;
        let placed = S::TILED | S::TOP_TILED | S::RIGHT_TILED | S::BOTTOM_TILED | S::LEFT_TILED | S::MAXIMIZED | S::FULLSCREEN;
        if let Some(t) = tw.upgrade() {
            t.set(Placement { floating: !surface.state().intersects(placed), ..Default::default() });
        }
    };
    let watch = move |w: &gtk::Window| {
        let Some(toplevel) = w.surface().and_downcast::<gtk::gdk::Toplevel>() else { return };
        update(&toplevel);
        let update = update.clone();
        toplevel.connect_state_notify(move |t| update(t));
    };
    if window.is_realized() {
        watch(window);
    } else {
        window.connect_realize(watch);
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::collections::BTreeSet;

    fn window(floating: bool, fullscreen: Fullscreen, minimize_here: bool) -> WindowState {
        let mut w = WindowState { address: "a1".into(), workspace: 1, floating, fullscreen, ..Default::default() };
        let here: BTreeSet<i64> = if minimize_here { [1].into() } else { BTreeSet::new() };
        w.actions = nyx_shell_proto::window::available(&w, &here);
        w
    }

    fn labels(w: &WindowState) -> Vec<&'static str> {
        rows(w).into_iter().map(|r| r.label).collect()
    }

    #[test]
    fn tiled_windows_expand_and_float() {
        assert_eq!(labels(&window(false, Fullscreen::None, true)), ["Expand", "Float", "Fullscreen"]);
        assert_eq!(labels(&window(false, Fullscreen::Maximized, true))[0], "Restore to the layout");
    }

    #[test]
    fn floating_windows_minimize_maximize_and_tile() {
        let w = window(true, Fullscreen::None, true);
        assert_eq!(labels(&w), ["Minimize", "Maximize", "Tile", "Fullscreen", "Keep on top, on every workspace"]);
        assert_eq!(rows(&w).last().unwrap().checked, Some(false));
        assert_eq!(labels(&window(true, Fullscreen::Maximized, false)), ["Restore size", "Tile", "Fullscreen", "Keep on top, on every workspace"]);
    }

    #[test]
    fn fullscreen_only_leaves() {
        assert_eq!(labels(&window(true, Fullscreen::Fullscreen, true)), ["Leave fullscreen"]);
    }

    #[test]
    fn settings_layers_merge_table_by_table() {
        let mut a: toml::Table = "[window_controls]\nhover_delay_ms = 300\nenabled = true\n".parse().unwrap();
        merge(&mut a, "[window_controls]\nenabled = false\n".parse().unwrap());
        let c = nyx_shell_proto::ShellConfig::from_table(&a).0.window_controls;
        assert_eq!((c.hover_delay_ms, c.enabled), (300, false));
    }
}
