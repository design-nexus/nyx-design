//! Breadcrumbs for the header's middle: each crumb opens its place, the last is
//! where you are. Clicking the empty space after them (or `edit`, for Ctrl+L)
//! turns the bar into an entry; Enter goes there, Esc or leaving puts the
//! crumbs back.

use std::{cell::RefCell, rc::Rc};

use gtk::{glib, prelude::*};

#[derive(Clone, Debug, PartialEq)]
pub struct Crumb {
    pub label: String,
    /// An icon instead of the label's text start (Home, a drive).
    pub icon: Option<String>,
    /// What activating it passes to `connect_open` (a path or URI).
    pub target: String,
}

type TextFn = Box<dyn Fn(&str)>;

#[derive(Default)]
struct State {
    crumbs: Vec<Crumb>,
    edit_text: String,
    open: Vec<TextFn>,
    typed: Vec<TextFn>,
}

pub struct PathBar {
    pub root: gtk::Stack,
    pub entry: gtk::Entry,
    crumbs: gtk::Box,
    scroll: gtk::ScrolledWindow,
    state: Rc<RefCell<State>>,
}

impl PathBar {
    pub fn new() -> Rc<PathBar> {
        let root = gtk::Stack::new();
        root.add_css_class("pathbar");
        root.set_hhomogeneous(false);
        root.set_transition_type(gtk::StackTransitionType::Crossfade);
        root.set_transition_duration(120);

        let crumbs = gtk::Box::new(gtk::Orientation::Horizontal, 0);
        crumbs.add_css_class("crumbs");
        let scroll = gtk::ScrolledWindow::builder()
            .hscrollbar_policy(gtk::PolicyType::External)
            .vscrollbar_policy(gtk::PolicyType::Never)
            .propagate_natural_width(true)
            .child(&crumbs)
            .build();
        let row = gtk::Box::new(gtk::Orientation::Horizontal, 0);
        row.append(&scroll);
        let filler = gtk::Box::new(gtk::Orientation::Horizontal, 0);
        filler.set_hexpand(true);
        filler.add_css_class("pathbar-filler");
        row.append(&filler);
        root.add_named(&row, Some("crumbs"));

        let entry = gtk::Entry::new();
        entry.add_css_class("pathbar-entry");
        entry.set_hexpand(true);
        root.add_named(&entry, Some("entry"));
        root.set_visible_child_name("crumbs");

        let bar = Rc::new(PathBar { root, entry, crumbs, scroll, state: Default::default() });

        let click = gtk::GestureClick::new();
        let weak = Rc::downgrade(&bar);
        click.connect_released(move |_, n, _, _| {
            if n == 1
                && let Some(bar) = weak.upgrade()
            {
                let text = bar.state.borrow().edit_text.clone();
                bar.edit(&text);
            }
        });
        filler.add_controller(click);

        let weak = Rc::downgrade(&bar);
        bar.entry.connect_activate(move |e| {
            let Some(bar) = weak.upgrade() else { return };
            let text = e.text().to_string();
            bar.stop_edit();
            for f in bar.state.borrow().typed.iter() {
                f(&text);
            }
        });
        let keys = gtk::EventControllerKey::new();
        let weak = Rc::downgrade(&bar);
        keys.connect_key_pressed(move |_, key, _, _| {
            if key == gtk::gdk::Key::Escape
                && let Some(bar) = weak.upgrade()
            {
                bar.stop_edit();
                return glib::Propagation::Stop;
            }
            glib::Propagation::Proceed
        });
        bar.entry.add_controller(keys);
        let focus = gtk::EventControllerFocus::new();
        let weak = Rc::downgrade(&bar);
        focus.connect_leave(move |_| {
            if let Some(bar) = weak.upgrade() {
                bar.stop_edit();
            }
        });
        bar.entry.add_controller(focus);
        bar
    }

    /// A crumb was activated: its target.
    pub fn connect_open(&self, f: impl Fn(&str) + 'static) {
        self.state.borrow_mut().open.push(Box::new(f));
    }

    /// Enter in the entry: the text as typed.
    pub fn connect_typed(&self, f: impl Fn(&str) + 'static) {
        self.state.borrow_mut().typed.push(Box::new(f));
    }

    /// Shows `crumbs`; `edit_text` is what the entry starts with (the full path).
    pub fn set_crumbs(&self, crumbs: &[Crumb], edit_text: &str) {
        {
            let mut state = self.state.borrow_mut();
            state.edit_text = edit_text.to_string();
            if state.crumbs == crumbs {
                return;
            }
            state.crumbs = crumbs.to_vec();
        }
        while let Some(c) = self.crumbs.first_child() {
            self.crumbs.remove(&c);
        }
        let last = crumbs.len().saturating_sub(1);
        for (i, crumb) in crumbs.iter().enumerate() {
            if i > 0 {
                let sep = gtk::Image::from_icon_name("go-next-symbolic");
                sep.add_css_class("crumb-sep");
                self.crumbs.append(&sep);
            }
            let button = gtk::Button::new();
            button.add_css_class("flat");
            button.add_css_class("crumb");
            if i == last {
                button.add_css_class("last");
            }
            let content = gtk::Box::new(gtk::Orientation::Horizontal, 6);
            if let Some(icon) = &crumb.icon {
                content.append(&gtk::Image::from_icon_name(icon));
            }
            if crumb.icon.is_none() || !crumb.label.is_empty() {
                let label = gtk::Label::new(Some(&crumb.label));
                label.set_ellipsize(gtk::pango::EllipsizeMode::Middle);
                label.set_max_width_chars(28);
                content.append(&label);
            }
            button.set_child(Some(&content));
            button.set_tooltip_text(Some(&crumb.target));
            button.update_property(&[gtk::accessible::Property::Label(&crumb.label)]);
            let (state, target) = (self.state.clone(), crumb.target.clone());
            button.connect_clicked(move |_| {
                for f in state.borrow().open.iter() {
                    f(&target);
                }
            });
            self.crumbs.append(&button);
        }
        let scroll = self.scroll.clone();
        glib::idle_add_local_once(move || {
            let adj = scroll.hadjustment();
            adj.set_value(adj.upper());
        });
    }

    pub fn is_editing(&self) -> bool {
        self.root.visible_child_name().as_deref() == Some("entry")
    }

    /// Turns the bar into an entry holding `text`, all of it selected.
    pub fn edit(&self, text: &str) {
        self.entry.set_text(text);
        self.root.set_visible_child_name("entry");
        self.entry.grab_focus();
        self.entry.select_region(0, -1);
    }

    pub fn stop_edit(&self) {
        if self.is_editing() {
            self.root.set_visible_child_name("crumbs");
        }
    }
}
