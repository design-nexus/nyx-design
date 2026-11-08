//! The resolved look as the GTK stylesheets have always used it: the core
//! [`Palette`] and the rest of the [`Look`]. Both are generated from, and kept in
//! step with, the semantic tokens ([`crate::Tokens`]).

use serde::{Deserialize, Serialize};
use std::collections::BTreeMap;

#[derive(Debug, Clone, Deserialize, Serialize, PartialEq)]
pub struct Palette {
    pub bg: String,
    pub surface: String,
    pub text: String,
    pub dim_text: String,
    pub accent: String,
    pub border: String,
    pub muted: String,
    pub highlight: String,
    pub danger: String,
    pub glow: String,
    pub shadow: String,
    #[serde(default)]
    pub light: bool,
}

#[derive(Debug, Clone)]
pub struct Theme {
    pub id: String,
    pub name: String,
    pub palette: Palette,
    /// Everything beyond the core colours: accents, fonts, radii, material.
    pub look: Look,
}

/// Everything a theme sets beyond the core colours in [`Palette`].
#[derive(Debug, Clone, PartialEq)]
pub struct Look {
    /// Sidebar and header.
    pub panel: String,
    /// Cards and grouped rows.
    pub card: String,
    /// Raised controls: the selected segment, buttons on cards.
    pub raised: String,
    /// Popovers, menus and dialogs.
    pub popover: String,
    /// Hints and placeholders, below `dim_text`.
    pub text_tertiary: String,
    /// Lines between rows inside a card.
    pub divider: String,
    pub warning: String,
    pub success: String,
    /// How much accent tints a hovered row (0–1).
    pub hover: f64,
    /// How much accent tints a selected row or nav item (0–1).
    pub selection: f64,
    /// Accent per app, by app name (`files`, `mail`, …).
    pub accents: BTreeMap<String, String>,
    /// Accent per section of an app (`settings` → `privacy` → colour).
    pub sections: BTreeMap<String, BTreeMap<String, String>>,
    /// The accents offered in each app's settings, by name, in [`crate::SWATCH_NAMES`] order first.
    pub swatches: Vec<(String, String)>,
    pub font: Font,
    pub shape: Shape,
    pub material: Material,
    /// Icon pack the theme recommends; the icon theme stays the user's choice.
    pub icons: Option<String>,
    /// Whether file-type icons keep their brand colours or take the theme's.
    pub file_icon_colors: FileIconColors,
    /// Colours for code; `None` leaves an app to derive its own.
    pub syntax: Syntax,
}

#[derive(Debug, Clone, Copy, Default, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum FileIconColors {
    /// Logos and file types keep their own colours.
    #[default]
    Brand,
    /// File-type icons are drawn in the theme's colours.
    Theme,
}

#[derive(Debug, Clone, Default, PartialEq, Serialize, Deserialize)]
pub struct Syntax {
    pub keyword: Option<String>,
    pub string: Option<String>,
    pub constant: Option<String>,
    pub type_name: Option<String>,
    pub preprocessor: Option<String>,
}

#[derive(Debug, Clone, Default, PartialEq, Serialize, Deserialize)]
pub struct Font {
    /// Interface font family; `None` leaves the app's own.
    pub ui: Option<String>,
    /// Code and readout font family.
    pub mono: Option<String>,
    pub weight: Option<u16>,
    pub heading_weight: Option<u16>,
}

/// Corner radii in px.
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct Shape {
    pub radius_small: u8,
    pub radius_card: u8,
    pub radius_dialog: u8,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum Surface {
    Solid,
    /// Translucent over the compositor's blur (Hyprland), solid without it.
    Frosted,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct Material {
    pub surface: Surface,
    /// Frosted panels show the blurred desktop; off keeps the frost opaque.
    pub see_through: bool,
    /// One surface: no lines or different fills between header, sidebar and content.
    pub blended: bool,
}
