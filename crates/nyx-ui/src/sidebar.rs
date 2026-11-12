//! The 212 px sidebar of nav items and group labels, which collapses to an icon
//! rail below 980 px of window width or when the user collapses it (Ctrl+B).

use std::{cell::Cell, rc::Rc};

use gtk::{glib, prelude::*};

use crate::widgets;

/// Window width under which the sidebar shows icons only.
pub const NARROW_WIDTH: i32 = 980;

/// A nav row: icon, label and an optional count or badge.
#[derive(Clone)]
pub struct NavItem {
    pub button: gtk::Button,
    pub label: gtk::Label,
    readout: gtk::Label,
}

impl NavItem {
    pub fn set_active(&self, active: bool) {
        if active {
            self.button.add_css_class("active");
        } else {
            self.button.remove_css_class("active");
        }
    }

    /// A count in `text_tertiary`, hidden when `None` or zero.
    pub fn set_count(&self, count: Option<u64>) {
        self.readout.remove_css_class("badge");
        match count {
            Some(n) if n > 0 => {
                self.readout.set_text(&n.to_string());
                self.readout.set_visible(!self.button.has_css_class("compact"));
            }
            _ => self.readout.set_visible(false),
        }
    }

    /// An unread-style badge in the accent tint.
    pub fn set_badge(&self, count: Option<u64>) {
        self.set_count(count);
        if count.is_some_and(|n| n > 0) {
            self.readout.add_css_class("badge");
        }
    }

    pub fn set_title(&self, title: &str) {
        self.label.set_text(title);
    }
}

pub fn nav_item(icon: &str, title: &str, tooltip: &str) -> NavItem {
    let button = gtk::Button::new();
    button.add_css_class("nav-item");
    let content = gtk::Box::new(gtk::Orientation::Horizontal, 12);
    let image = gtk::Image::from_icon_name(icon);
    image.add_css_class("nav-icon");
    content.append(&image);
    let label = widgets::label(title, "nav-label");
    label.set_hexpand(true);
    label.set_ellipsize(gtk::pango::EllipsizeMode::End);
    label.add_css_class("compact-hide");
    content.append(&label);
    let readout = widgets::label("", "nav-readout");
    readout.add_css_class("compact-hide");
    readout.set_visible(false);
    content.append(&readout);
    button.set_child(Some(&content));
    button.set_tooltip_text(Some(tooltip));
    button.update_property(&[gtk::accessible::Property::Label(title)]);
    NavItem { button, label, readout }
}

/// A group's heading (UPPERCASE). `first` drops the space above it.
pub fn group_label(text: &str, first: bool) -> gtk::Box {
    let row = gtk::Box::new(gtk::Orientation::Horizontal, 0);
    row.add_css_class("compact-hide");
    row.add_css_class("nav-group-row");
    let label = widgets::label(&text.to_uppercase(), "nav-group");
    if first {
        label.add_css_class("first");
    }
    label.set_hexpand(true);
    label.set_ellipsize(gtk::pango::EllipsizeMode::End);
    row.append(&label);
    row
}

/// Colour a group's heading, and the line under it, as its section: a name from
/// the theme's `[sections.<app>]` (`"branches"`), or a swatch from
/// [`rotating_section`]. `heading` is the label or the row that holds it.
pub fn set_section(heading: &impl IsA<gtk::Widget>, section: &str) {
    let class = format!("section-{section}");
    let heading = heading.as_ref();
    heading.add_css_class(&class);
    fn first_label(w: &gtk::Widget) -> Option<gtk::Widget> {
        let mut child = w.first_child();
        while let Some(c) = child {
            if c.is::<gtk::Label>() {
                return Some(c);
            }
            if let Some(l) = first_label(&c) {
                return Some(l);
            }
            child = c.next_sibling();
        }
        None
    }
    if !heading.is::<gtk::Label>()
        && let Some(label) = first_label(heading)
    {
        label.add_css_class(&class);
    }
}

/// The section for the `index`th heading that comes from an account or a source
/// (Mail's accounts, Calendar's): a swatch, in the same order every time.
pub fn rotating_section(index: usize) -> String {
    const ORDER: [&str; 8] = ["blue", "violet", "green", "pink", "coral", "teal", "red", "amber"];
    format!("swatch-{}", ORDER[index % ORDER.len()])
}

/// A heading with a `+` at its right.
pub fn group_label_with_add(text: &str, first: bool, tooltip: &str, add: impl Fn() + 'static) -> gtk::Box {
    let row = group_label(text, first);
    let plus = widgets::icon_button("list-add-symbolic", tooltip);
    plus.add_css_class("nav-group-add");
    plus.set_valign(gtk::Align::End);
    plus.connect_clicked(move |_| add());
    row.append(&plus);
    row
}

type CompactFn = Box<dyn Fn(bool)>;

/// The sidebar column: `root` holds the scrolled `list` the app fills.
pub struct Sidebar {
    pub root: gtk::Box,
    pub list: gtk::Box,
    pub scroller: gtk::ScrolledWindow,
    narrow: Cell<bool>,
    collapsed: Cell<bool>,
    compact: Cell<bool>,
    on_compact: std::cell::RefCell<Vec<CompactFn>>,
}

impl Sidebar {
    pub fn new() -> Rc<Sidebar> {
        let root = gtk::Box::new(gtk::Orientation::Vertical, 0);
        root.add_css_class("settings-navigation");
        root.add_css_class("sidebar");
        root.set_hexpand(false);
        let list = gtk::Box::new(gtk::Orientation::Vertical, 1);
        list.set_hexpand(false);
        let scroller = gtk::ScrolledWindow::builder()
            .hscrollbar_policy(gtk::PolicyType::Never)
            .vexpand(true)
            .hexpand(false)
            .child(&list)
            .build();
        root.append(&scroller);
        Rc::new(Sidebar {
            root,
            list,
            scroller,
            narrow: Cell::new(false),
            collapsed: Cell::new(false),
            compact: Cell::new(false),
            on_compact: Default::default(),
        })
    }

    /// Adds a row at the end of the list.
    pub fn append(&self, widget: &impl IsA<gtk::Widget>) {
        self.list.append(widget);
    }

    /// Adds a widget under the list (an account, storage or status foot).
    pub fn append_foot(&self, widget: &impl IsA<gtk::Widget>) {
        self.root.append(widget);
    }

    pub fn clear(&self) {
        while let Some(c) = self.list.first_child() {
            self.list.remove(&c);
        }
    }

    pub fn is_compact(&self) -> bool {
        self.compact.get()
    }

    pub fn is_collapsed(&self) -> bool {
        self.collapsed.get()
    }

    /// The user's collapse choice (save it as `sidebar_collapsed`).
    pub fn set_collapsed(&self, collapsed: bool) {
        self.collapsed.set(collapsed);
        self.refresh();
    }

    pub fn toggle(&self) {
        self.set_collapsed(!self.collapsed.get());
    }

    /// Called with the new state whenever the rail turns on or off.
    pub fn connect_compact(&self, f: impl Fn(bool) + 'static) {
        self.on_compact.borrow_mut().push(Box::new(f));
    }

    /// Re-applies compact mode to rows added since (call after refilling the list).
    pub fn refresh(&self) {
        let compact = self.narrow.get() || self.collapsed.get();
        let changed = compact != self.compact.get();
        self.compact.set(compact);
        set_compact(&self.root, compact);
        if changed {
            for f in self.on_compact.borrow().iter() {
                f(compact);
            }
        }
    }

    /// Follows `window`'s width: icons only below [`NARROW_WIDTH`].
    pub fn follow_window(self: &Rc<Self>, window: &impl IsA<gtk::Window>) {
        let window = window.as_ref().clone();
        let weak = Rc::downgrade(self);
        let apply = move |w: &gtk::Window| {
            let Some(sidebar) = weak.upgrade() else { return };
            let width = if w.width() > 0 { w.width() } else { w.default_width() };
            let narrow = width > 0 && width < NARROW_WIDTH;
            if narrow != sidebar.narrow.get() || !sidebar.root.has_css_class("sized") {
                sidebar.root.add_css_class("sized");
                sidebar.narrow.set(narrow);
                sidebar.refresh();
            }
        };
        let a = apply.clone();
        window.connect_realize(move |w| a(w));
        // A tick callback sees every size the compositor gives, tiled ones included.
        let last = Cell::new(0);
        window.add_tick_callback(move |w, _| {
            if w.width() != last.get() {
                last.set(w.width());
                if let Some(win) = w.downcast_ref::<gtk::Window>() {
                    apply(win);
                }
            }
            glib::ControlFlow::Continue
        });
    }
}

/// Shows icons only (`compact`) or full rows across `root`'s nav items.
pub fn set_compact(root: &impl IsA<gtk::Widget>, compact: bool) {
    let root = root.as_ref();
    if compact {
        root.add_css_class("compact");
    } else {
        root.remove_css_class("compact");
    }
    fn walk(widget: &gtk::Widget, compact: bool) {
        if widget.has_css_class("nav-toggle") {
            widget.set_halign(if compact { gtk::Align::Center } else { gtk::Align::End });
        }
        if widget.has_css_class("compact-hide") {
            if compact {
                widget.set_visible(false);
            } else if !widget.has_css_class("nav-readout") || widget.downcast_ref::<gtk::Label>().is_some_and(|l| !l.text().is_empty()) {
                widget.set_visible(true);
            }
        }
        if widget.has_css_class("nav-item") {
            if compact {
                widget.add_css_class("compact");
            } else {
                widget.remove_css_class("compact");
            }
            if let Some(content) = widget.downcast_ref::<gtk::Button>().and_then(|b| b.child()) {
                content.set_halign(if compact { gtk::Align::Center } else { gtk::Align::Fill });
            }
        }
        let mut child = widget.first_child();
        while let Some(next) = child {
            walk(&next, compact);
            child = next.next_sibling();
        }
    }
    walk(root, compact);
}
