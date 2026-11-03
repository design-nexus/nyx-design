//! Toasts: one line bottom-centre over the content, replacing any toast showing.
//! 3.5 s, or 6 s with an action (Undo).

use gtk::{glib, prelude::*};

type Action<'a> = Option<(&'a str, Box<dyn Fn()>)>;

const SHORT_MS: u64 = 3500;
const WITH_ACTION_MS: u64 = 6000;

pub fn show(overlay: &gtk::Overlay, message: &str) {
    present(overlay, message, None);
}

/// A toast with Undo.
pub fn show_undo(overlay: &gtk::Overlay, message: &str, undo: impl Fn() + 'static) {
    present(overlay, message, Some(("Undo", Box::new(undo))));
}

/// A toast with one text action ("Show", "Retry").
pub fn show_action(overlay: &gtk::Overlay, message: &str, label: &str, act: impl Fn() + 'static) {
    present(overlay, message, Some((label, Box::new(act))));
}

/// Removes the toast showing over `overlay`, if any.
pub fn dismiss(overlay: &gtk::Overlay) {
    let mut child = overlay.first_child();
    while let Some(c) = child {
        child = c.next_sibling();
        if c.has_css_class("toast") {
            overlay.remove_overlay(&c);
        }
    }
}

fn present(overlay: &gtk::Overlay, message: &str, action: Action<'_>) {
    dismiss(overlay);
    let label = gtk::Label::new(Some(message));
    label.set_wrap(true);
    label.set_max_width_chars(70);
    label.set_xalign(0.0);
    let toast = gtk::Box::new(gtk::Orientation::Horizontal, 12);
    toast.add_css_class("toast");
    toast.add_css_class("nyx-toast");
    toast.set_halign(gtk::Align::Center);
    toast.set_valign(gtk::Align::End);
    toast.set_margin_bottom(24);
    toast.set_margin_start(16);
    toast.set_margin_end(16);
    toast.append(&label);
    toast.update_property(&[gtk::accessible::Property::Label(message)]);
    let lasts = if action.is_some() { WITH_ACTION_MS } else { SHORT_MS };
    if let Some((text, act)) = action {
        let button = gtk::Button::with_label(text);
        button.add_css_class("toast-action");
        button.set_valign(gtk::Align::Center);
        let (o, t) = (overlay.downgrade(), toast.downgrade());
        button.connect_clicked(move |_| {
            act();
            if let (Some(o), Some(t)) = (o.upgrade(), t.upgrade())
                && t.parent().is_some()
            {
                o.remove_overlay(&t);
            }
        });
        toast.append(&button);
    }
    overlay.add_overlay(&toast);
    let (o, t) = (overlay.downgrade(), toast.downgrade());
    glib::timeout_add_local_once(std::time::Duration::from_millis(lasts), move || {
        if let (Some(o), Some(t)) = (o.upgrade(), t.upgrade())
            && t.parent().is_some()
        {
            o.remove_overlay(&t);
        }
    });
}
