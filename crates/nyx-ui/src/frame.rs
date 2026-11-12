//! The main window's frame: the header, the sidebar and a foot bar (a player or
//! status bar) on one surface, and the page, the main body, inset in it as a sheet.
//! Apps build their window on it, so how the body sits in the window changes here
//! and in base2.css (`.app-frame`, `.app-body`, `.app-page`), not in every app.
//!
//! ```text
//! header
//! sidebar | page
//! foot
//! ```

use gtk::prelude::*;

pub struct AppFrame {
    /// The whole frame: the window's child, or inside the app's own overlay or stack.
    pub root: gtk::Box,
    /// The sidebar and the page, side by side.
    pub body: gtk::Box,
    /// The sheet. Put the app's content in it with [`AppFrame::set_page`].
    pub page: gtk::Box,
}

impl AppFrame {
    pub fn new(header: &impl IsA<gtk::Widget>) -> AppFrame {
        let root = gtk::Box::new(gtk::Orientation::Vertical, 0);
        root.add_css_class("window-frame");
        root.add_css_class("app-frame");
        root.add_css_class("no-sidebar");
        root.append(header);
        let body = gtk::Box::new(gtk::Orientation::Horizontal, 0);
        body.add_css_class("app-body");
        body.set_vexpand(true);
        let page = gtk::Box::new(gtk::Orientation::Vertical, 0);
        page.add_css_class("app-page");
        page.set_hexpand(true);
        page.set_vexpand(true);
        // Content that reaches the edges (a backdrop, a map) takes the sheet's corners.
        page.set_overflow(gtk::Overflow::Hidden);
        body.append(&page);
        root.append(&body);
        AppFrame { root, body, page }
    }

    /// The sidebar, left of the page. While it is hidden (a welcome page, an
    /// expanded player) the page has the whole width under the header.
    pub fn set_sidebar(&self, sidebar: &impl IsA<gtk::Widget>) {
        let sidebar = sidebar.as_ref();
        self.body.prepend(sidebar);
        let root = self.root.downgrade();
        let follow = move |s: &gtk::Widget| {
            if let Some(root) = root.upgrade() {
                if s.is_visible() {
                    root.remove_css_class("no-sidebar");
                } else {
                    root.add_css_class("no-sidebar");
                }
            }
        };
        follow(sidebar);
        sidebar.connect_visible_notify(follow);
    }

    /// The page's content, replacing what was there.
    pub fn set_page(&self, content: &impl IsA<gtk::Widget>) {
        while let Some(child) = self.page.first_child() {
            self.page.remove(&child);
        }
        self.page.append(content);
    }

    /// A bar across the foot of the window, under the sidebar and the page.
    pub fn set_foot(&self, foot: &impl IsA<gtk::Widget>) {
        self.root.append(foot);
    }

    /// Make the frame `window`'s content, under an overlay for toasts and cards.
    pub fn install(&self, window: &impl IsA<gtk::Window>) -> gtk::Overlay {
        let overlay = gtk::Overlay::new();
        overlay.set_child(Some(&self.root));
        window.set_child(Some(&overlay));
        overlay
    }
}
