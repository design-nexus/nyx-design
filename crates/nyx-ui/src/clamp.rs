//! A container that keeps its child at most `max` pixels wide, centred (or at the
//! start, see [`Clamp::set_start`]), and lets it shrink below that. GTK4 has no such widget without libadwaita.

use gtk::glib;
use gtk::prelude::*;
use gtk::subclass::prelude::*;

mod imp {
    use super::*;
    use std::cell::Cell;

    #[derive(Default)]
    pub struct Clamp {
        pub max: Cell<i32>,
        pub start: Cell<bool>,
        /// Pin child to the end (right in LTR). Overrides centering.
        pub end: Cell<bool>,
        pub shrink: Cell<bool>,
    }

    #[glib::object_subclass]
    impl ObjectSubclass for Clamp {
        const NAME: &'static str = "NyxClamp";
        type Type = super::Clamp;
        type ParentType = gtk::Widget;
    }

    impl ObjectImpl for Clamp {
        fn dispose(&self) {
            while let Some(child) = self.obj().first_child() {
                child.unparent();
            }
        }
    }

    impl WidgetImpl for Clamp {
        fn request_mode(&self) -> gtk::SizeRequestMode {
            gtk::SizeRequestMode::HeightForWidth
        }

        fn measure(&self, orientation: gtk::Orientation, for_size: i32) -> (i32, i32, i32, i32) {
            let Some(child) = self.obj().first_child() else { return (0, 0, -1, -1) };
            let max = self.max.get();
            if orientation == gtk::Orientation::Horizontal {
                // Width for no particular height: wrapping text measured for a fixed height
                // asks to be far wider than the clamp would let it be.
                let (min, nat, _, _) = child.measure(orientation, -1);
                if self.shrink.get() {
                    return (0, nat.min(max), -1, -1);
                }
                (min, nat.min(max.max(min)), -1, -1)
            } else {
                // The child's height at exactly the width size_allocate will give it.
                // Measuring at any other width lets wrapped text spill past its row.
                let width = self.child_width(if for_size < 0 { max } else { for_size });
                let (min, nat, _, _) = child.measure(orientation, width);
                (min, nat, -1, -1)
            }
        }

        fn size_allocate(&self, width: i32, height: i32, baseline: i32) {
            if let Some(child) = self.obj().first_child() {
                let w = self.child_width(width);
                // Wider than the space (shrinking): clipped at the right, not centred off-screen.
                let x = if w > width || self.start.get() {
                    0
                } else if self.end.get() {
                    width - w
                } else {
                    (width - w) / 2
                };
                child.size_allocate(&gtk::Allocation::new(x, 0, w, height), baseline);
            }
        }
    }

    impl Clamp {
        /// The child's width when the clamp has `avail` pixels: up to `max`, never below
        /// the child's minimum (shrinking clips the overflow; otherwise the parent was
        /// already asked for at least that minimum). Shared by measure and allocate.
        pub(super) fn child_width(&self, avail: i32) -> i32 {
            let Some(child) = self.obj().first_child() else { return avail.max(0) };
            let (min, _, _, _) = child.measure(gtk::Orientation::Horizontal, -1);
            let w = avail.min(self.max.get());
            if self.shrink.get() { w.max(min) } else { w.max(min.min(avail)) }
        }
    }
}

glib::wrapper! {
    pub struct Clamp(ObjectSubclass<imp::Clamp>) @extends gtk::Widget, @implements gtk::Accessible, gtk::Buildable, gtk::ConstraintTarget;
}

impl Clamp {
    pub fn new(child: &impl IsA<gtk::Widget>, max: i32) -> Self {
        let c: Self = glib::Object::new();
        c.imp().max.set(max);
        child.set_parent(&c);
        c
    }

    /// Let the child grow to `max` pixels wide.
    pub fn set_max(&self, max: i32) {
        if self.imp().max.replace(max) == max {
            return;
        }
        self.queue_resize();
    }

    /// Let the window get narrower than the child's minimum: the child keeps its minimum
    /// width and the clamp clips it, instead of holding the window wide.
    pub fn set_shrink(&self, shrink: bool) {
        self.imp().shrink.set(shrink);
        self.set_overflow(if shrink { gtk::Overflow::Hidden } else { gtk::Overflow::Visible });
        self.queue_resize();
    }

    /// Keep the child at the start of the space instead of centring it.
    pub fn set_start(&self, start: bool) {
        self.imp().start.set(start);
        if start {
            self.imp().end.set(false);
        }
        self.queue_allocate();
    }

    /// Keep the child at the end of the space (outgoing chat bubbles).
    pub fn set_end(&self, end: bool) {
        self.imp().end.set(end);
        if end {
            self.imp().start.set(false);
        }
        self.queue_allocate();
    }
}
