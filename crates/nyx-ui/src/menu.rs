//! Context and button menus: rows with an optional icon and key hint,
//! separators, check items and submenus that slide in within the same popover.

use std::rc::Rc;

use gtk::prelude::*;

pub enum Entry {
    Item { icon: Option<String>, label: String, key: Option<String>, danger: bool, enabled: bool, run: Box<dyn Fn()> },
    Check { label: String, key: Option<String>, active: bool, run: Box<dyn Fn(bool)> },
    Sub { icon: Option<String>, label: String, entries: Vec<Entry> },
    Heading(String),
    Separator,
}

impl Entry {
    /// The key hint shown at the row's end ("Ctrl+C").
    pub fn key(mut self, keys: &str) -> Self {
        if let Entry::Item { key, .. } | Entry::Check { key, .. } = &mut self {
            *key = Some(keys.into());
        }
        self
    }

    pub fn icon(mut self, name: &str) -> Self {
        if let Entry::Item { icon, .. } | Entry::Sub { icon, .. } = &mut self {
            *icon = Some(name.into());
        }
        self
    }

    pub fn enabled(mut self, on: bool) -> Self {
        if let Entry::Item { enabled, .. } = &mut self {
            *enabled = on;
        }
        self
    }

    /// Deletes or can't be undone: shown in the danger colour.
    pub fn danger(mut self) -> Self {
        if let Entry::Item { danger, .. } = &mut self {
            *danger = true;
        }
        self
    }
}

pub fn item(label: &str, run: impl Fn() + 'static) -> Entry {
    Entry::Item { icon: None, label: label.into(), key: None, danger: false, enabled: true, run: Box::new(run) }
}

/// A row with a check mark when `active`; clicking passes the new state.
pub fn check(label: &str, active: bool, run: impl Fn(bool) + 'static) -> Entry {
    Entry::Check { label: label.into(), key: None, active, run: Box::new(run) }
}

pub fn sub(label: &str, entries: Vec<Entry>) -> Entry {
    Entry::Sub { icon: None, label: label.into(), entries }
}

/// A small group label inside a menu ("Sort by").
pub fn heading(text: &str) -> Entry {
    Entry::Heading(text.into())
}

pub fn separator() -> Entry {
    Entry::Separator
}

fn row(icon: Option<&str>, label: &str, end: Option<gtk::Widget>, danger: bool, with_icon_column: bool) -> gtk::Button {
    let button = gtk::Button::new();
    button.add_css_class("flat");
    button.add_css_class("menu-item");
    let content = gtk::Box::new(gtk::Orientation::Horizontal, 10);
    if let Some(icon) = icon {
        let image = gtk::Image::from_icon_name(icon);
        image.add_css_class("menu-icon");
        content.append(&image);
    } else if with_icon_column {
        let spacer = gtk::Box::new(gtk::Orientation::Horizontal, 0);
        spacer.add_css_class("menu-icon");
        spacer.set_size_request(16, -1);
        content.append(&spacer);
    }
    let text = gtk::Label::new(Some(label));
    text.set_xalign(0.0);
    text.set_hexpand(true);
    if danger {
        button.add_css_class("danger");
    }
    content.append(&text);
    if let Some(end) = end {
        content.append(&end);
    }
    button.set_child(Some(&content));
    button
}

fn key_hint(key: Option<&str>) -> Option<gtk::Widget> {
    key.map(|k| {
        let l = gtk::Label::new(Some(k));
        l.add_css_class("menu-key");
        l.upcast()
    })
}

fn page(popover: &gtk::Popover, pages: &gtk::Stack, entries: Vec<Entry>, back: Option<&str>, depth: &mut usize) -> gtk::Box {
    let list = gtk::Box::new(gtk::Orientation::Vertical, 1);
    list.add_css_class("menu-list");
    let icons = entries.iter().any(|e| matches!(e, Entry::Item { icon: Some(_), .. } | Entry::Sub { icon: Some(_), .. }));
    if let Some(title) = back {
        let back_row = row(Some("go-previous-symbolic"), title, None, false, false);
        let p = pages.clone();
        back_row.connect_clicked(move |_| p.set_visible_child_name("main"));
        list.append(&back_row);
        list.append(&gtk::Separator::new(gtk::Orientation::Horizontal));
    }
    for entry in entries {
        match entry {
            Entry::Separator => list.append(&gtk::Separator::new(gtk::Orientation::Horizontal)),
            Entry::Heading(text) => {
                let l = gtk::Label::new(Some(&text));
                l.set_xalign(0.0);
                l.add_css_class("menu-heading");
                list.append(&l);
            }
            Entry::Item { icon, label, key, danger, enabled, run } => {
                let r = row(icon.as_deref(), &label, key_hint(key.as_deref()), danger, icons);
                r.set_sensitive(enabled);
                let p = popover.clone();
                r.connect_clicked(move |_| {
                    p.popdown();
                    run();
                });
                list.append(&r);
            }
            Entry::Check { label, key, active, run } => {
                let mark = if active { Some("object-select-symbolic") } else { None };
                let r = row(mark, &label, key_hint(key.as_deref()), false, true);
                r.add_css_class("menu-check");
                if active {
                    r.add_css_class("checked");
                }
                let p = popover.clone();
                r.connect_clicked(move |_| {
                    p.popdown();
                    run(!active);
                });
                list.append(&r);
            }
            Entry::Sub { icon, label, entries } => {
                *depth += 1;
                let name = format!("sub{depth}");
                let sub_page = page(popover, pages, entries, Some(&label), depth);
                pages.add_named(&sub_page, Some(&name));
                let r = row(icon.as_deref(), &label, Some(gtk::Image::from_icon_name("go-next-symbolic").upcast()), false, icons);
                let p = pages.clone();
                r.connect_clicked(move |_| p.set_visible_child_name(&name));
                list.append(&r);
            }
        }
    }
    list
}

/// A popover holding `entries`, parented to `anchor`; it unparents itself when closed.
pub fn popover(anchor: &impl IsA<gtk::Widget>, entries: Vec<Entry>) -> gtk::Popover {
    let anchor = anchor.as_ref().clone();
    let popover = gtk::Popover::new();
    popover.set_has_arrow(false);
    popover.add_css_class("menu-popover");
    popover.set_parent(&anchor);
    let pages = gtk::Stack::new();
    pages.set_vhomogeneous(false);
    pages.set_hhomogeneous(false);
    pages.set_transition_type(gtk::StackTransitionType::SlideLeftRight);
    let mut depth = 0;
    let main = page(&popover, &pages, entries, None, &mut depth);
    pages.add_named(&main, Some("main"));
    pages.set_visible_child_name("main");
    popover.set_child(Some(&pages));
    let p = pages.clone();
    popover.connect_closed(move |pop| {
        p.set_visible_child_name("main");
        let (pop, a) = (pop.clone(), anchor.downgrade());
        gtk::glib::idle_add_local_once(move || {
            if a.upgrade().is_some() && pop.parent().is_some() {
                pop.unparent();
            }
        });
    });
    popover
}

/// Shows a menu at a point in `anchor` (a right-click's position).
pub fn popup_at(anchor: &impl IsA<gtk::Widget>, x: f64, y: f64, entries: Vec<Entry>) {
    if entries.is_empty() {
        return;
    }
    let popover = popover(anchor, entries);
    popover.set_position(gtk::PositionType::Bottom);
    popover.set_halign(gtk::Align::Start);
    popover.set_pointing_to(Some(&gtk::gdk::Rectangle::new(x as i32, y as i32, 1, 1)));
    popover.popup();
}

/// Shows a menu under `anchor` (a header button), built fresh on each open.
pub fn popup_below(anchor: &impl IsA<gtk::Widget>, entries: Vec<Entry>) {
    if entries.is_empty() {
        return;
    }
    let popover = popover(anchor, entries);
    popover.set_position(gtk::PositionType::Bottom);
    popover.popup();
}

/// Calls `open(widget, x, y)` on a right-click (or a long press) on `widget`.
pub fn on_right_click(widget: &impl IsA<gtk::Widget>, open: impl Fn(&gtk::Widget, f64, f64) + 'static) {
    let open = Rc::new(open);
    let click = gtk::GestureClick::new();
    click.set_button(gtk::gdk::BUTTON_SECONDARY);
    let o = open.clone();
    click.connect_pressed(move |g, _, x, y| {
        if let Some(w) = g.widget() {
            g.set_state(gtk::EventSequenceState::Claimed);
            o(&w, x, y);
        }
    });
    widget.add_controller(click);
    let press = gtk::GestureLongPress::new();
    press.set_touch_only(true);
    press.connect_pressed(move |g, x, y| {
        if let Some(w) = g.widget() {
            open(&w, x, y);
        }
    });
    widget.add_controller(press);
}

/// The Menu key or Shift+F10.
pub fn is_menu_key(key: gtk::gdk::Key, state: gtk::gdk::ModifierType) -> bool {
    key == gtk::gdk::Key::Menu || (key == gtk::gdk::Key::F10 && state.contains(gtk::gdk::ModifierType::SHIFT_MASK))
}
