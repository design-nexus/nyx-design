//! The system logo, in the theme's colours. One logo for the whole desktop: the
//! Nyx mark until one is set. An SVG logo draws its themeable parts in
//! `currentColor` (as the Nyx mark draws its rim); they take the theme's
//! `brand.logo` colour, the accent unless the theme says otherwise. A PNG logo is
//! shown as it is.
//!
//! Where it comes from, first found wins: `$NYX_LOGO`, the user's
//! `~/.config/nyx/logo.svg|png`, the system's `/etc/nyx/logo.svg|png` (set in
//! Settings on NyxOS, from the system configuration), the Nyx mark.

use serde::{Deserialize, Serialize};
use std::path::{Path, PathBuf};

/// The Nyx mark (`brand/nyx-mark.svg`).
pub const NYX_MARK: &str = include_str!("../brand/nyx-mark.svg");
/// The Nyx mark for 16–47 px: no glow or stars, a thicker rim.
pub const NYX_MARK_SMALL: &str = include_str!("../brand/nyx-mark-small.svg");
/// Below this size the Nyx mark's small version is used.
pub const SMALL_BELOW: u32 = 48;

pub const MAX_SVG: usize = 512 * 1024;
pub const MAX_PNG: usize = 2 * 1024 * 1024;

/// The colour token logos are drawn in.
pub const TOKEN: &str = "brand.logo";

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum Source {
    /// The Nyx mark, built in.
    BuiltIn,
    /// Set for the computer (`/etc/nyx`).
    System,
    /// Set for this person (`~/.config/nyx`).
    User,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum Image {
    Svg(String),
    Png(Vec<u8>),
}

impl Image {
    pub fn extension(&self) -> &'static str {
        match self {
            Image::Svg(_) => "svg",
            Image::Png(_) => "png",
        }
    }

    /// Read a logo file, checked.
    pub fn read(path: &Path) -> Result<Image, String> {
        let bytes = std::fs::read(path).map_err(|e| format!("{}: {e}", path.display()))?;
        Image::from_bytes(&bytes).map_err(|e| format!("{}: {e}", path.display()))
    }

    /// A logo from a file's bytes: a PNG by its signature, else SVG text.
    pub fn from_bytes(bytes: &[u8]) -> Result<Image, String> {
        if bytes.starts_with(PNG_SIGNATURE) {
            check_png(bytes)?;
            return Ok(Image::Png(bytes.to_vec()));
        }
        let text = std::str::from_utf8(bytes).map_err(|_| "neither a PNG nor SVG text".to_string())?;
        check_svg(text)?;
        Ok(Image::Svg(text.to_string()))
    }
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct Logo {
    pub image: Image,
    pub source: Source,
    pub path: Option<PathBuf>,
}

const PNG_SIGNATURE: &[u8] = b"\x89PNG\r\n\x1a\n";

/// Refuse what an SVG logo has no use for and a renderer might act on: scripts,
/// foreign content, entities, event handlers and anything outside the file.
pub fn check_svg(text: &str) -> Result<(), String> {
    if text.len() > MAX_SVG {
        return Err(format!("{} KB; a logo can be at most {} KB", text.len() / 1024, MAX_SVG / 1024));
    }
    let lower = text.to_ascii_lowercase();
    if !lower.contains("<svg") {
        return Err("not an SVG image".into());
    }
    for bad in ["<script", "<foreignobject", "<!entity", "<!doctype", "<iframe", "<embed", "<object", "javascript:", "@import"] {
        if lower.contains(bad) {
            return Err(format!("it contains {bad}, which a logo can't use"));
        }
    }
    let bytes = lower.as_bytes();
    for (i, _) in lower.match_indices("on") {
        let before = if i == 0 { b' ' } else { bytes[i - 1] };
        let name_end = lower[i + 2..].find(|c: char| !c.is_ascii_alphabetic()).map_or(lower.len(), |n| i + 2 + n);
        if before.is_ascii_whitespace() && name_end > i + 2 && lower[name_end..].trim_start().starts_with('=') {
            return Err(format!("it has an event handler ({}), which a logo can't use", &lower[i..name_end]));
        }
    }
    for (i, _) in lower.match_indices("href") {
        let rest = lower[i + 4..].trim_start();
        let Some(rest) = rest.strip_prefix('=') else { continue };
        let value = rest.trim_start().trim_start_matches(['"', '\'']);
        if !(value.starts_with('#') || value.starts_with("data:image/")) {
            return Err("it links to something outside the file, which a logo can't use".into());
        }
    }
    for (i, _) in lower.match_indices("url(") {
        let value = lower[i + 4..].trim_start().trim_start_matches(['"', '\'']);
        if !value.starts_with('#') {
            return Err("it refers to something outside the file, which a logo can't use".into());
        }
    }
    Ok(())
}

pub fn check_png(bytes: &[u8]) -> Result<(), String> {
    if !bytes.starts_with(PNG_SIGNATURE) {
        return Err("not a PNG image".into());
    }
    if bytes.len() > MAX_PNG {
        return Err(format!("{} KB; a logo can be at most {} KB", bytes.len() / 1024, MAX_PNG / 1024));
    }
    Ok(())
}

/// The user's logo files.
pub fn user_files() -> [PathBuf; 2] {
    let dir = nyx_core::paths::suite_dir();
    [dir.join("logo.svg"), dir.join("logo.png")]
}

/// The computer's logo files (NyxOS puts the one set in Settings here).
pub fn system_files() -> [PathBuf; 2] {
    let dir = std::env::var_os("NYX_SYSTEM_LOGO_DIR").map(PathBuf::from).unwrap_or_else(|| PathBuf::from("/etc/nyx"));
    [dir.join("logo.svg"), dir.join("logo.png")]
}

fn first_readable(files: &[PathBuf], source: Source) -> Option<Logo> {
    files.iter().find(|p| p.is_file()).and_then(|p| match Image::read(p) {
        Ok(image) => Some(Logo { image, source, path: Some(p.clone()) }),
        Err(e) => {
            eprintln!("nyx-theme: logo {e}; using the next one");
            None
        }
    })
}

/// The logo in use.
pub fn current() -> Logo {
    if let Some(p) = std::env::var_os("NYX_LOGO").map(PathBuf::from)
        && let Some(l) = first_readable(&[p], Source::User)
    {
        return l;
    }
    first_readable(&user_files(), Source::User)
        .or_else(|| first_readable(&system_files(), Source::System))
        .unwrap_or_else(builtin)
}

pub fn builtin() -> Logo {
    Logo { image: Image::Svg(NYX_MARK.into()), source: Source::BuiltIn, path: None }
}

/// Set (or with `None` remove) the user's own logo, written atomically.
pub fn set_user(image: Option<&Image>) -> Result<(), String> {
    let [svg, png] = user_files();
    match image {
        Some(i) => {
            let (path, other, bytes) = match i {
                Image::Svg(t) => (svg, png, t.as_bytes().to_vec()),
                Image::Png(b) => (png, svg, b.clone()),
            };
            nyx_core::cmd::atomic_write(&path, bytes).map_err(|e| format!("{e:#}"))?;
            let _ = std::fs::remove_file(other);
        }
        None => {
            let _ = std::fs::remove_file(svg);
            let _ = std::fs::remove_file(png);
        }
    }
    Ok(())
}

/// `svg` with its `currentColor` parts in `color`: the root element's `color`.
pub fn recolor(svg: &str, color: &str) -> String {
    let Some(start) = svg.find("<svg") else { return svg.to_string() };
    let Some(len) = svg[start..].find('>') else { return svg.to_string() };
    let tag = &svg[start..start + len];
    let safe: String = color.chars().filter(|c| c.is_ascii_alphanumeric() || "#(),. %".contains(*c)).collect();
    let new_tag = match find_attr(tag, "color") {
        Some((a, b)) => format!("{}{safe}{}", &tag[..a], &tag[b..]),
        None => format!("<svg color=\"{safe}\"{}", &tag[4..]),
    };
    format!("{}{new_tag}{}", &svg[..start], &svg[start + len..])
}

/// The value range of attribute `name` in a tag (`color="…"`), not `stop-color`.
fn find_attr(tag: &str, name: &str) -> Option<(usize, usize)> {
    let mut from = 0;
    while let Some(i) = tag[from..].find(name).map(|i| i + from) {
        from = i + name.len();
        if !tag[..i].ends_with(char::is_whitespace) {
            continue;
        }
        let Some(after_eq) = tag[from..].trim_start().strip_prefix('=') else { continue };
        let value = after_eq.trim_start();
        let quote = value.chars().next()?;
        if quote != '"' && quote != '\'' {
            continue;
        }
        let open = tag.len() - value.len() + 1;
        let close = tag[open..].find(quote)? + open;
        return Some((open, close));
    }
    None
}

impl Logo {
    /// Whether the theme colours it (an SVG that draws in `currentColor`).
    pub fn recolorable(&self) -> bool {
        matches!(&self.image, Image::Svg(s) if s.contains("currentColor") || s.contains("currentcolor"))
    }

    /// The logo as SVG drawn at about `size` px in `color`: an SVG logo recoloured
    /// (the Nyx mark's small version below 48 px), a PNG one embedded as it is.
    pub fn svg(&self, color: &str, size: u32) -> String {
        match &self.image {
            Image::Svg(s) => {
                let s = if self.source == Source::BuiltIn && size < SMALL_BELOW { NYX_MARK_SMALL } else { s.as_str() };
                recolor(s, color)
            }
            Image::Png(b) => format!(
                "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 1 1\"><image width=\"1\" height=\"1\" href=\"data:image/png;base64,{}\"/></svg>",
                base64(b)
            ),
        }
    }

    /// A short fingerprint, to notice a different logo.
    pub fn stamp(&self) -> String {
        let bytes: &[u8] = match &self.image {
            Image::Svg(s) => s.as_bytes(),
            Image::Png(b) => b,
        };
        let mut h: u64 = 0xcbf2_9ce4_8422_2325;
        for b in bytes {
            h = (h ^ u64::from(*b)).wrapping_mul(0x0100_0000_01b3);
        }
        format!("{h:016x}")
    }
}

pub fn base64(bytes: &[u8]) -> String {
    const T: &[u8; 64] = b"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    let mut out = String::with_capacity(bytes.len().div_ceil(3) * 4);
    for chunk in bytes.chunks(3) {
        let n = (u32::from(chunk[0]) << 16) | (u32::from(*chunk.get(1).unwrap_or(&0)) << 8) | u32::from(*chunk.get(2).unwrap_or(&0));
        for (k, shift) in [18, 12, 6, 0].into_iter().enumerate() {
            if k <= chunk.len() {
                out.push(T[(n >> shift & 63) as usize] as char);
            } else {
                out.push('=');
            }
        }
    }
    out
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn the_nyx_mark_matches_the_brand() {
        let brand = Path::new(env!("CARGO_MANIFEST_DIR")).join("../../brand");
        for (file, copy) in [("nyx-mark.svg", NYX_MARK), ("nyx-mark-small.svg", NYX_MARK_SMALL)] {
            if let Ok(original) = std::fs::read_to_string(brand.join(file)) {
                assert_eq!(original, copy, "crates/nyx-theme-core/brand/{file} differs from brand/{file}");
            }
            check_svg(copy).unwrap();
        }
    }

    #[test]
    fn recolours_the_root_only() {
        let svg = recolor(NYX_MARK, "#ff8800");
        assert!(svg.starts_with("<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 128 128\" color=\"#ff8800\">"));
        assert!(svg.contains("stop-color=\"#2c2c31\""), "stop colours stay");
        let plain = recolor("<svg viewBox=\"0 0 1 1\"><path fill=\"currentColor\"/></svg>", "#123456");
        assert!(plain.starts_with("<svg color=\"#123456\" viewBox"));
        assert_eq!(recolor("<svg color='red'/>", "\"><script>"), "<svg color='script'/>", "nothing but colour characters");
        assert!(builtin().recolorable());
    }

    #[test]
    fn small_sizes_use_the_small_mark() {
        assert!(builtin().svg("#fff", 24).contains("viewBox=\"0 0 32 32\""));
        assert!(builtin().svg("#fff", 64).contains("viewBox=\"0 0 128 128\""));
    }

    #[test]
    fn hostile_svgs_are_refused() {
        for bad in [
            "<svg><script>alert(1)</script></svg>",
            "<svg onload=\"x()\"/>",
            "<svg><image href=\"http://example.com/a.png\"/></svg>",
            "<svg><image xlink:href='file:///etc/passwd'/></svg>",
            "<svg><rect fill=\"url(http://x/#a)\"/></svg>",
            "<!DOCTYPE svg [<!ENTITY x SYSTEM \"file:///etc/passwd\">]><svg/>",
            "<svg><foreignObject/></svg>",
            "<svg><style>@import url(x.css)</style></svg>",
            "not an image",
        ] {
            assert!(check_svg(bad).is_err(), "{bad}");
        }
        for ok in [NYX_MARK, "<svg><a href=\"#x\"/><rect fill=\"url(#g)\" font-family=\"Oneplus\"/></svg>", "<svg><image href=\"data:image/png;base64,AAAA\"/></svg>"] {
            check_svg(ok).unwrap_or_else(|e| panic!("{ok}: {e}"));
        }
        assert!(check_svg(&format!("<svg>{}</svg>", " ".repeat(MAX_SVG))).is_err());
    }

    #[test]
    fn pngs_are_embedded_unchanged() {
        let png = [PNG_SIGNATURE, b"rest"].concat();
        let logo = Logo { image: Image::from_bytes(&png).unwrap(), source: Source::User, path: None };
        assert!(!logo.recolorable());
        assert!(logo.svg("#fff", 64).contains(&format!("data:image/png;base64,{}", base64(&png))));
        assert_eq!(base64(b"Man"), "TWFu");
        assert_eq!(base64(b"Ma"), "TWE=");
        assert_eq!(base64(b"M"), "TQ==");
    }
}
