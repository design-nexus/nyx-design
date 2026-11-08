//! Colours without GTK: parsing the forms themes use, mixing as GTK CSS's `mix()`
//! does, and WCAG contrast.

/// A colour with channels in 0..1.
#[derive(Debug, Clone, Copy, PartialEq)]
pub struct Color {
    pub r: f64,
    pub g: f64,
    pub b: f64,
    pub a: f64,
}

const NAMED: &[(&str, &str)] = &[
    ("black", "#000000"),
    ("white", "#ffffff"),
    ("red", "#ff0000"),
    ("green", "#008000"),
    ("blue", "#0000ff"),
    ("yellow", "#ffff00"),
    ("cyan", "#00ffff"),
    ("magenta", "#ff00ff"),
    ("gray", "#808080"),
    ("grey", "#808080"),
    ("silver", "#c0c0c0"),
    ("maroon", "#800000"),
    ("olive", "#808000"),
    ("lime", "#00ff00"),
    ("aqua", "#00ffff"),
    ("teal", "#008080"),
    ("navy", "#000080"),
    ("fuchsia", "#ff00ff"),
    ("purple", "#800080"),
    ("orange", "#ffa500"),
    ("transparent", "#00000000"),
];

impl Color {
    pub const BLACK: Color = Color { r: 0.0, g: 0.0, b: 0.0, a: 1.0 };
    pub const WHITE: Color = Color { r: 1.0, g: 1.0, b: 1.0, a: 1.0 };

    /// `#rgb`, `#rgba`, `#rrggbb`, `#rrggbbaa`, `rgb(…)`, `rgba(…)` (numbers or
    /// percentages) or a basic CSS colour name.
    pub fn parse(s: &str) -> Option<Color> {
        let s = s.trim();
        if let Some(hex) = s.strip_prefix('#') {
            return Self::hex(hex);
        }
        let lower = s.to_ascii_lowercase();
        if let Some((_, hex)) = NAMED.iter().find(|(n, _)| *n == lower) {
            return Self::hex(&hex[1..]);
        }
        let inner = lower.strip_prefix("rgba(").or_else(|| lower.strip_prefix("rgb("))?.strip_suffix(')')?;
        let parts: Vec<&str> = inner.split(',').map(str::trim).collect();
        if !(parts.len() == 3 || parts.len() == 4) {
            return None;
        }
        let channel = |p: &str| -> Option<f64> {
            let v = if let Some(pc) = p.strip_suffix('%') { pc.parse::<f64>().ok()? / 100.0 } else { p.parse::<f64>().ok()? / 255.0 };
            (v.is_finite() && (0.0..=1.0).contains(&v)).then_some(v)
        };
        let alpha = match parts.get(3) {
            Some(p) => {
                let v = if let Some(pc) = p.strip_suffix('%') { pc.parse::<f64>().ok()? / 100.0 } else { p.parse::<f64>().ok()? };
                (v.is_finite() && (0.0..=1.0).contains(&v)).then_some(v)?
            }
            None => 1.0,
        };
        Some(Color { r: channel(parts[0])?, g: channel(parts[1])?, b: channel(parts[2])?, a: alpha })
    }

    fn hex(h: &str) -> Option<Color> {
        if !h.bytes().all(|b| b.is_ascii_hexdigit()) {
            return None;
        }
        let one = |i: usize| u8::from_str_radix(&h[i..i + 1], 16).ok().map(|v| f64::from(v) / 15.0);
        let two = |i: usize| u8::from_str_radix(&h[i..i + 2], 16).ok().map(|v| f64::from(v) / 255.0);
        match h.len() {
            3 => Some(Color { r: one(0)?, g: one(1)?, b: one(2)?, a: 1.0 }),
            4 => Some(Color { r: one(0)?, g: one(1)?, b: one(2)?, a: one(3)? }),
            6 => Some(Color { r: two(0)?, g: two(2)?, b: two(4)?, a: 1.0 }),
            8 => Some(Color { r: two(0)?, g: two(2)?, b: two(4)?, a: two(6)? }),
            _ => None,
        }
    }

    /// `#rrggbb`, or `#rrggbbaa` when not opaque.
    pub fn to_hex(self) -> String {
        let c = |v: f64| (v.clamp(0.0, 1.0) * 255.0).round() as u8;
        if c(self.a) == 255 {
            format!("#{:02x}{:02x}{:02x}", c(self.r), c(self.g), c(self.b))
        } else {
            format!("#{:02x}{:02x}{:02x}{:02x}", c(self.r), c(self.g), c(self.b), c(self.a))
        }
    }

    /// `self` moved towards `other` by `t`, as GTK CSS's `mix()`.
    pub fn mix(self, other: Color, t: f64) -> Color {
        let l = |a: f64, b: f64| a + (b - a) * t;
        Color { r: l(self.r, other.r), g: l(self.g, other.g), b: l(self.b, other.b), a: l(self.a, other.a) }
    }

    /// WCAG relative luminance.
    pub fn luminance(self) -> f64 {
        let lin = |c: f64| if c <= 0.039_28 { c / 12.92 } else { ((c + 0.055) / 1.055).powf(2.4) };
        0.2126 * lin(self.r) + 0.7152 * lin(self.g) + 0.0722 * lin(self.b)
    }

    /// WCAG contrast ratio, 1 to 21.
    pub fn contrast(self, other: Color) -> f64 {
        let (a, b) = (self.luminance(), other.luminance());
        let (hi, lo) = if a > b { (a, b) } else { (b, a) };
        (hi + 0.05) / (lo + 0.05)
    }
}

/// Whether `s` is a colour [`Color::parse`] reads.
pub fn is_color(s: &str) -> bool {
    Color::parse(s).is_some()
}

/// `a` moved towards `b` by `t`, as `#rrggbb`; `a` unchanged if either isn't a colour.
pub fn mix(a: &str, b: &str, t: f64) -> String {
    match (Color::parse(a), Color::parse(b)) {
        (Some(x), Some(y)) => x.mix(y, t).to_hex(),
        _ => a.to_string(),
    }
}

/// Contrast between two colours, 1 when either isn't one.
pub fn contrast(a: &str, b: &str) -> f64 {
    match (Color::parse(a), Color::parse(b)) {
        (Some(x), Some(y)) => x.contrast(y),
        _ => 1.0,
    }
}

/// `fg` moved towards black or white (whichever contrasts more with `bg`) until it
/// reaches `ratio` against `bg`, or as far as it goes.
pub fn with_contrast(fg: &str, bg: &str, ratio: f64) -> String {
    let (Some(f), Some(b)) = (Color::parse(fg), Color::parse(bg)) else { return fg.to_string() };
    if f.contrast(b) >= ratio {
        return fg.to_string();
    }
    let target = if b.contrast(Color::BLACK) > b.contrast(Color::WHITE) { Color::BLACK } else { Color::WHITE };
    let mut t: f64 = 0.0;
    while t < 1.0 {
        t += 0.05;
        let c = f.mix(target, t.min(1.0));
        if c.contrast(b) >= ratio {
            return c.to_hex();
        }
    }
    target.to_hex()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn parses_theme_colours() {
        assert_eq!(Color::parse("#1e1e2e").unwrap().to_hex(), "#1e1e2e");
        assert_eq!(Color::parse("#FFF").unwrap().to_hex(), "#ffffff");
        assert_eq!(Color::parse("#11223380").unwrap().to_hex(), "#11223380");
        assert_eq!(Color::parse("rgb(255, 0, 0)").unwrap().to_hex(), "#ff0000");
        assert_eq!(Color::parse("rgba(0,0,0,0.5)").unwrap().to_hex(), "#00000080");
        assert_eq!(Color::parse("White").unwrap().to_hex(), "#ffffff");
        for bad in ["", "#12", "#ggg", "rgb(1,2)", "rgb(300,0,0)", "not a colour", "#1234567"] {
            assert!(Color::parse(bad).is_none(), "{bad}");
        }
    }

    #[test]
    fn mixes_like_gtk() {
        assert_eq!(mix("#000000", "#ffffff", 0.055), "#0e0e0e");
        assert_eq!(mix("nope", "#ffffff", 0.5), "nope");
    }

    #[test]
    fn contrast_follows_wcag() {
        assert!((contrast("#000000", "#ffffff") - 21.0).abs() < 0.01);
        assert!((contrast("#777777", "#777777") - 1.0).abs() < 0.01);
        let fixed = with_contrast("#444444", "#333333", 4.5);
        assert!(contrast(&fixed, "#333333") >= 4.5);
    }
}
