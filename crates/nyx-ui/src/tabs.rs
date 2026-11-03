//! A row of tabs: the active one is a pill in the hover tone, each has a close
//! button, `+` opens one. Middle-click closes, drag reorders, the wheel scrolls.
//! The row sits under the header (34 px) or inside it (Notepad).

use std::{
    cell::{Cell, RefCell},
    rc::Rc,
};

use gtk::{gdk, glib, prelude::*};

use crate::widgets;

#[derive(Clone, Debug, Default, PartialEq)]
pub struct Tab {
    pub title: String,
    pub icon: Option<String>,
    pub tooltip: Option<String>,
    /// Unsaved changes: a dot in the accent.
    pub dirty: bool,
}

type IndexFn = Box<dyn Fn(usize)>;

#[derive(Default)]
struct Handlers {
    select: Vec<IndexFn>,
    close: Vec<IndexFn>,
    new: Vec<Box<dyn Fn()>>,
    reorder: Vec<Box<dyn Fn(usize, usize)>>,
}

pub struct TabRow {
    pub root: gtk::Box,
    pub add: gtk::Button,
    tabs: gtk::Box,
    scroll: gtk::ScrolledWindow,
    shown: RefCell<(Vec<Tab>, usize)>,
    handlers: Rc<RefCell<Handlers>>,
    hide_single: Cell<bool>,
}

impl TabRow {
    /// `new_tooltip` names `+` with its key ("New tab (Ctrl+T)").
    pub fn new(new_tooltip: &str) -> Rc<TabRow> {
        let root = widgets::hbox(2);
        root.add_css_class("tab-row");
        let tabs = widgets::hbox(2);
        tabs.add_css_class("tabs");
        let scroll = gtk::ScrolledWindow::builder()
            .hscrollbar_policy(gtk::PolicyType::External)
            .vscrollbar_policy(gtk::PolicyType::Never)
            .propagate_natural_width(true)
            .child(&tabs)
            .build();
        scroll.set_hexpand(false);
        let wheel = gtk::EventControllerScroll::new(gtk::EventControllerScrollFlags::BOTH_AXES);
        let s = scroll.clone();
        wheel.connect_scroll(move |_, dx, dy| {
            let adj = s.hadjustment();
            adj.set_value(adj.value() + (dx + dy) * 40.0);
            glib::Propagation::Stop
        });
        scroll.add_controller(wheel);
        root.append(&scroll);
        let add = widgets::bar_button("list-add-symbolic", new_tooltip);
        add.add_css_class("tab-new");
        root.append(&add);
        let row = Rc::new(TabRow {
            root,
            add,
            tabs,
            scroll,
            shown: RefCell::new((Vec::new(), 0)),
            handlers: Default::default(),
            hide_single: Cell::new(false),
        });
        let handlers = row.handlers.clone();
        row.add.connect_clicked(move |_| {
            for f in handlers.borrow().new.iter() {
                f();
            }
        });
        row
    }

    /// Hide the tabs (not `+`) while only one is open.
    pub fn set_hide_single(&self, hide: bool) {
        self.hide_single.set(hide);
        let (tabs, active) = self.shown.borrow().clone();
        self.rebuild(&tabs, active);
    }

    pub fn connect_select(&self, f: impl Fn(usize) + 'static) {
        self.handlers.borrow_mut().select.push(Box::new(f));
    }

    pub fn connect_close(&self, f: impl Fn(usize) + 'static) {
        self.handlers.borrow_mut().close.push(Box::new(f));
    }

    pub fn connect_new(&self, f: impl Fn() + 'static) {
        self.handlers.borrow_mut().new.push(Box::new(f));
    }

    /// A tab dragged from `from` and dropped at `to` (both before the move).
    pub fn connect_reorder(&self, f: impl Fn(usize, usize) + 'static) {
        self.handlers.borrow_mut().reorder.push(Box::new(f));
    }

    /// Shows `tabs` with `active` selected; unchanged rows are kept.
    pub fn set_tabs(self: &Rc<Self>, tabs: &[Tab], active: usize) {
        {
            let shown = self.shown.borrow();
            if shown.0 == tabs && shown.1 == active {
                return;
            }
        }
        *self.shown.borrow_mut() = (tabs.to_vec(), active);
        self.rebuild(tabs, active);
        let (scroll, tabs_box) = (self.scroll.clone(), self.tabs.clone());
        glib::idle_add_local_once(move || {
            let mut child = tabs_box.first_child();
            let mut i = 0;
            while let Some(c) = child {
                if i == active
                    && let Some(bounds) = c.compute_bounds(&tabs_box)
                {
                    let adj = scroll.hadjustment();
                    let (x, w) = (f64::from(bounds.x()), f64::from(bounds.width()));
                    if x < adj.value() {
                        adj.set_value(x);
                    } else if x + w > adj.value() + adj.page_size() {
                        adj.set_value(x + w - adj.page_size());
                    }
                }
                i += 1;
                child = c.next_sibling();
            }
        });
    }

    fn rebuild(&self, tabs: &[Tab], active: usize) {
        while let Some(c) = self.tabs.first_child() {
            self.tabs.remove(&c);
        }
        self.scroll.set_visible(!(self.hide_single.get() && tabs.len() <= 1));
        for (i, tab) in tabs.iter().enumerate() {
            self.tabs.append(&tab_widget(tab, i, i == active, tabs.len() > 1, &self.handlers));
        }
    }
}

fn tab_widget(tab: &Tab, index: usize, active: bool, closable: bool, handlers: &Rc<RefCell<Handlers>>) -> gtk::Box {
    let item = widgets::hbox(0);
    item.add_css_class("tab");
    if active {
        item.add_css_class("active");
    }
    let main = gtk::Button::new();
    main.add_css_class("tab-main");
    let content = widgets::hbox(6);
    if let Some(icon) = &tab.icon {
        let image = gtk::Image::from_icon_name(icon);
        image.add_css_class("tab-icon");
        content.append(&image);
    }
    let title = gtk::Label::new(Some(&tab.title));
    title.set_ellipsize(gtk::pango::EllipsizeMode::Middle);
    title.set_max_width_chars(24);
    content.append(&title);
    if tab.dirty {
        content.append(&widgets::label("•", "tab-dirty"));
    }
    main.set_child(Some(&content));
    main.set_tooltip_text(Some(tab.tooltip.as_deref().unwrap_or(&tab.title)));
    main.update_property(&[gtk::accessible::Property::Label(&tab.title)]);
    let h = handlers.clone();
    main.connect_clicked(move |_| fire(&h.borrow().select, index));
    item.append(&main);

    let close = gtk::Button::from_icon_name("window-close-symbolic");
    close.add_css_class("tab-close");
    close.set_tooltip_text(Some("Close tab (Ctrl+W)"));
    close.set_valign(gtk::Align::Center);
    close.set_visible(closable);
    let h = handlers.clone();
    close.connect_clicked(move |_| fire(&h.borrow().close, index));
    item.append(&close);

    let middle = gtk::GestureClick::new();
    middle.set_button(gdk::BUTTON_MIDDLE);
    let h = handlers.clone();
    middle.connect_released(move |g, _, _, _| {
        g.set_state(gtk::EventSequenceState::Claimed);
        fire(&h.borrow().close, index);
    });
    item.add_controller(middle);

    let drag = gtk::DragSource::new();
    drag.set_actions(gdk::DragAction::MOVE);
    drag.connect_prepare(move |_, _, _| Some(gdk::ContentProvider::for_value(&(index as u32).to_value())));
    item.add_controller(drag);
    let drop = gtk::DropTarget::new(u32::static_type(), gdk::DragAction::MOVE);
    let h = handlers.clone();
    drop.connect_drop(move |_, value, _, _| {
        let Ok(from) = value.get::<u32>() else { return false };
        let from = from as usize;
        if from != index {
            for f in h.borrow().reorder.iter() {
                f(from, index);
            }
        }
        true
    });
    item.add_controller(drop);
    item
}

fn fire(handlers: &[IndexFn], index: usize) {
    for f in handlers {
        f(index);
    }
}
