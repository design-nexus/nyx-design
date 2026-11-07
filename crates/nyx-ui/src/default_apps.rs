//! Default apps, shared by Nyx Settings and Nyx Welcome: which app opens each kind of
//! file or link (MIME defaults), the terminal (`xdg-terminals.list`) and the text editor
//! the terminal and config buttons use.

use gtk::gio;
use gtk::prelude::*;
use std::path::PathBuf;

pub struct Category {
    pub title: &'static str,
    pub desc: &'static str,
    /// Every type this row sets; the first is read for the current choice.
    /// An app that opens any of them is offered.
    pub types: &'static [&'static str],
    pub keywords: &'static str,
    /// Desktop-entry categories whose apps open these types but don't fit the
    /// row (browsers under Email, video editors under Video player).
    pub skip: &'static [&'static str],
}

pub const WEB_BROWSER: Category = Category {
    title: "Web browser",
    desc: "Opens links from every app.",
    types: &["x-scheme-handler/https", "x-scheme-handler/http", "text/html", "application/xhtml+xml"],
    keywords: "browser web links internet",
    skip: &["TextEditor"],
};

pub const CATEGORIES: &[Category] = &[
    Category {
        title: "File manager",
        desc: "Opens folders from every app.",
        types: &["inode/directory"],
        keywords: "folders files browse",
        skip: &[],
    },
    Category {
        title: "Image viewer",
        desc: "Opens photos and pictures.",
        types: &[
            "image/png",
            "image/jpeg",
            "image/gif",
            "image/webp",
            "image/bmp",
            "image/tiff",
            "image/svg+xml",
            "image/avif",
            "image/heic",
            "image/x-icon",
        ],
        keywords: "photos pictures images jpg png viewer",
        skip: &["WebBrowser", "AudioVideo", "TextEditor"],
    },
    Category {
        title: "Video player",
        desc: "Opens video files.",
        types: &["video/mp4", "video/x-matroska", "video/webm", "video/quicktime", "video/x-msvideo", "video/mpeg", "video/ogg"],
        keywords: "movies videos mp4 mkv player",
        skip: &["AudioVideoEditing", "TextEditor"],
    },
    Category {
        title: "Music player",
        desc: "Opens audio files.",
        types: &["audio/mpeg", "audio/flac", "audio/ogg", "audio/wav", "audio/x-wav", "audio/mp4", "audio/aac", "audio/opus"],
        keywords: "music songs audio mp3 flac player",
        skip: &["AudioVideoEditing", "TextEditor"],
    },
    Category {
        title: "PDFs",
        desc: "Opens PDF documents.",
        types: &["application/pdf"],
        keywords: "pdf reader document viewer",
        skip: &[],
    },
    Category {
        title: "Documents",
        desc: "Word processing files (.docx, .odt, .doc).",
        types: &[
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/vnd.oasis.opendocument.text",
            "application/msword",
            "application/rtf",
        ],
        keywords: "office word docx odt writer libreoffice document",
        skip: &["WebBrowser"],
    },
    Category {
        title: "Spreadsheets",
        desc: "Spreadsheet files (.xlsx, .ods, .xls).",
        types: &[
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "application/vnd.oasis.opendocument.spreadsheet",
            "application/vnd.ms-excel",
        ],
        keywords: "office excel xlsx ods calc sheets spreadsheet",
        skip: &["WebBrowser"],
    },
    Category {
        title: "Presentations",
        desc: "Slide decks (.pptx, .odp, .ppt).",
        types: &[
            "application/vnd.openxmlformats-officedocument.presentationml.presentation",
            "application/vnd.oasis.opendocument.presentation",
            "application/vnd.ms-powerpoint",
        ],
        keywords: "office powerpoint pptx odp impress slides presentation",
        skip: &["WebBrowser"],
    },
    Category {
        title: "Text files",
        desc: "Plain text, Markdown, logs and data files opened from a file manager.",
        types: &[
            "text/plain",
            "text/markdown",
            "text/csv",
            "text/x-log",
            "application/json",
            "application/xml",
            "text/xml",
            "application/x-yaml",
            "text/x-shellscript",
        ],
        keywords: "text txt markdown notes json",
        skip: &["WebBrowser"],
    },
    Category {
        title: "Archives",
        desc: "Opens zip, tar and other compressed files.",
        types: &[
            "application/zip",
            "application/x-tar",
            "application/x-7z-compressed",
            "application/vnd.rar",
            "application/gzip",
            "application/x-compressed-tar",
            "application/zstd",
        ],
        keywords: "zip archive compressed extract unzip rar 7z",
        skip: &["WebBrowser", "TextEditor"],
    },
    Category {
        title: "Email",
        desc: "Opens <tt>mailto:</tt> links.",
        types: &["x-scheme-handler/mailto"],
        keywords: "mail email mailto",
        skip: &["WebBrowser", "TextEditor"],
    },
    Category {
        title: "Calendar",
        desc: "Opens calendar invites and subscriptions.",
        types: &["text/calendar", "x-scheme-handler/webcal"],
        keywords: "calendar ics invite events",
        skip: &["WebBrowser", "TextEditor"],
    },
    Category {
        title: "Torrents",
        desc: "Opens magnet links and .torrent files.",
        types: &["x-scheme-handler/magnet", "application/x-bittorrent"],
        keywords: "torrent magnet bittorrent download",
        skip: &["WebBrowser", "TextEditor"],
    },
];

/// The apps a category offers as (desktop ID, name), and the current default's ID
/// (empty for none). The current default is offered even if it doesn't list the type.
/// Only apps that list a type themselves are offered: text/html and application/rtf
/// are subtypes of text/plain, so every text editor would otherwise be a browser.
pub fn options(c: &Category) -> (Vec<(String, String)>, String) {
    let info = |a: &gio::AppInfo| (a.id().map(|s| s.to_string()).unwrap_or_default(), a.name().to_string());
    let apps: Vec<(String, String, bool)> = c
        .types
        .iter()
        .flat_map(|t| gio::AppInfo::recommended_for_type(t))
        .filter(|a| a.id().is_some())
        .map(|a| {
            let (id, name) = info(&a);
            (id, name, a.should_show() && !in_categories(&a, c.skip))
        })
        .collect();
    let current = gio::AppInfo::default_for_type(c.types[0], false).map(|a| info(&a));
    let current_id = current.as_ref().map(|(i, _)| i.clone()).unwrap_or_default();
    let mut options = choices(&apps, current);
    disambiguate(&mut options, executable);
    (options, current_id)
}

/// Make the app with desktop ID `id` the default for every type in `c`. Returns the
/// types that couldn't be set.
pub fn set(c: &Category, id: &str) -> Result<(), String> {
    let Some(app) = app_info(id) else { return Err(format!("{id} isn't installed")) };
    let failed: Vec<String> =
        c.types.iter().filter_map(|t| app.set_as_default_for_type(t).err().map(|e| format!("{t}: {e}"))).collect();
    if failed.is_empty() { Ok(()) } else { Err(failed.join(", ")) }
}

fn app_info(id: &str) -> Option<gio::AppInfo> {
    gio::AppInfo::all().into_iter().find(|a| a.id().is_some_and(|i| i == id))
}

fn executable(id: &str) -> String {
    app_info(id).and_then(|a| a.executable().file_name().map(|e| e.to_string_lossy().to_string())).unwrap_or_default()
}

fn desktop_categories(id: &str) -> Vec<String> {
    let dirs = std::iter::once(gtk::glib::user_data_dir()).chain(gtk::glib::system_data_dirs());
    for dir in dirs {
        let file = gtk::glib::KeyFile::new();
        if file.load_from_file(dir.join("applications").join(id), gtk::glib::KeyFileFlags::NONE).is_ok() {
            let categories = file.string("Desktop Entry", "Categories").unwrap_or_default();
            return categories.split(';').filter(|c| !c.is_empty()).map(String::from).collect();
        }
    }
    Vec::new()
}

/// True when the app's desktop entry lists any of the categories.
fn in_categories(app: &gio::AppInfo, skip: &[&str]) -> bool {
    app.id().is_some_and(|id| desktop_categories(&id).iter().any(|c| skip.contains(&c.as_str())))
}

/// (id, name) choices: visible apps, no repeats, and the current default kept
/// even if it doesn't declare the type (so the row always shows the truth).
fn choices(apps: &[(String, String, bool)], current: Option<(String, String)>) -> Vec<(String, String)> {
    let mut out: Vec<(String, String)> = Vec::new();
    for (id, name, visible) in apps {
        if *visible && !out.iter().any(|(i, _)| i == id) {
            out.push((id.clone(), name.clone()));
        }
    }
    if let Some((id, name)) = current
        && !out.iter().any(|(i, _)| *i == id)
    {
        out.insert(0, (id, name));
    }
    out
}

/// Two apps with the same name get their program added so they can be told
/// apart: "Image Viewer (imv)" and "Image Viewer (loupe)".
fn disambiguate(options: &mut [(String, String)], program: impl Fn(&str) -> String) {
    let names: Vec<String> = options.iter().map(|(_, n)| n.clone()).collect();
    for (id, name) in options.iter_mut() {
        if names.iter().filter(|n| *n == name).count() > 1 {
            let exe = program(id);
            if !exe.is_empty() {
                *name = format!("{name} ({exe})");
            }
        }
    }
}

// ----- The terminal (xdg-terminal-exec) -----

fn config_dir() -> PathBuf {
    gtk::glib::user_config_dir()
}

/// `~/.config/xdg-terminals.list`: the terminals xdg-terminal-exec tries, in order.
pub fn terminals_list() -> PathBuf {
    config_dir().join("xdg-terminals.list")
}

/// Installed terminals as (desktop ID, name), and the current one's ID (empty for none).
pub fn terminals() -> (Vec<(String, String)>, String) {
    let mut options: Vec<(String, String)> = gio::AppInfo::all()
        .into_iter()
        .filter(|a| a.should_show())
        .filter_map(|a| {
            let id = a.id()?.to_string();
            desktop_categories(&id).iter().any(|c| c == "TerminalEmulator").then(|| (id, a.name().to_string()))
        })
        .collect();
    options.sort_by_key(|a| a.1.to_lowercase());
    options.dedup_by(|a, b| a.0 == b.0);
    let listed = std::fs::read_to_string(terminals_list()).unwrap_or_default();
    let current = first_entry(&listed).unwrap_or_default();
    (options, current)
}

/// The first desktop ID in an `xdg-terminals.list`, skipping comments and blank lines.
fn first_entry(list: &str) -> Option<String> {
    list.lines().map(str::trim).find(|l| !l.is_empty() && !l.starts_with('#')).map(String::from)
}

/// Put `id` first in `xdg-terminals.list`, keeping the others after it.
pub fn set_terminal(id: &str) -> std::io::Result<()> {
    let path = terminals_list();
    let old = std::fs::read_to_string(&path).unwrap_or_default();
    let mut lines = vec![id.to_string()];
    lines.extend(old.lines().map(str::trim).filter(|l| !l.is_empty() && *l != id).map(String::from));
    std::fs::create_dir_all(config_dir())?;
    std::fs::write(&path, lines.join("\n") + "\n")
}

// ----- The text editor ($EDITOR) -----

/// Editors offered as the text editor: (command, name). Terminal editors run in the
/// default terminal.
pub const EDITORS: &[(&str, &str)] = &[
    ("nvim", "Neovim"),
    ("hx", "Helix"),
    ("vim", "Vim"),
    ("nano", "nano"),
    ("micro", "micro"),
    ("emacs", "Emacs"),
    ("zeditor", "Zed"),
    ("code", "VS Code"),
    ("codium", "VSCodium"),
    ("cursor", "Cursor"),
    ("subl", "Sublime Text"),
];

/// `~/.config/nyx/editor`: the command NyxOS's shells export as `EDITOR`.
pub fn editor_file() -> PathBuf {
    config_dir().join("nyx").join("editor")
}

fn on_path(command: &str) -> bool {
    std::env::var_os("PATH").is_some_and(|p| std::env::split_paths(&p).any(|d| d.join(command).is_file()))
}

/// Installed editors as (command, name), and the current one's command.
pub fn editors() -> (Vec<(String, String)>, String) {
    let saved = std::fs::read_to_string(editor_file()).ok().map(|s| s.trim().to_string()).filter(|s| !s.is_empty());
    let current = saved.or_else(|| std::env::var("EDITOR").ok()).unwrap_or_default();
    let current = current.rsplit('/').next().unwrap_or("").to_string();
    let options = EDITORS
        .iter()
        .filter(|(cmd, _)| *cmd == current || on_path(cmd))
        .map(|(cmd, name)| (cmd.to_string(), name.to_string()))
        .collect();
    (options, current)
}

/// Make `command` the editor: for new terminals (`~/.config/nyx/editor`) and for the
/// session's apps from the next sign-in (`environment.d`).
pub fn set_editor(command: &str) -> std::io::Result<()> {
    if !EDITORS.iter().any(|(c, _)| *c == command) {
        return Err(std::io::Error::new(std::io::ErrorKind::InvalidInput, format!("{command} isn't an editor Nyx knows")));
    }
    std::fs::create_dir_all(config_dir().join("nyx"))?;
    std::fs::write(editor_file(), format!("{command}\n"))?;
    let env = config_dir().join("environment.d");
    std::fs::create_dir_all(&env)?;
    std::fs::write(env.join("60-nyx-editor.conf"), format!("EDITOR={command}\nVISUAL={command}\n"))
}

#[cfg(test)]
mod tests {
    use super::*;

    fn app(id: &str, visible: bool) -> (String, String, bool) {
        (id.to_string(), id.trim_end_matches(".desktop").to_string(), visible)
    }

    #[test]
    fn choices_hide_helpers_and_keep_the_default() {
        let apps =
            [app("imv.desktop", true), app("imv.desktop", true), app("userapp-x.desktop", false), app("pinta.desktop", true)];
        let c = choices(&apps, Some(("imv.desktop".into(), "imv".into())));
        assert_eq!(c.iter().map(|(i, _)| i.as_str()).collect::<Vec<_>>(), ["imv.desktop", "pinta.desktop"]);
        let c = choices(&apps, Some(("odd.desktop".into(), "Odd".into())));
        assert_eq!(c[0].0, "odd.desktop");
        assert!(choices(&[], None).is_empty());
    }

    #[test]
    fn same_names_get_their_program() {
        let mut o = vec![
            ("a.desktop".to_string(), "Image Viewer".to_string()),
            ("b.desktop".into(), "Image Viewer".into()),
            ("c.desktop".into(), "Zed".into()),
        ];
        disambiguate(&mut o, |id| id.trim_end_matches(".desktop").to_string());
        assert_eq!(o.iter().map(|(_, n)| n.as_str()).collect::<Vec<_>>(), ["Image Viewer (a)", "Image Viewer (b)", "Zed"]);
    }

    #[test]
    fn the_terminal_list_starts_with_the_choice() {
        assert_eq!(first_entry("# mine\n\nfoot.desktop\nkitty.desktop\n").as_deref(), Some("foot.desktop"));
        assert_eq!(first_entry("# only a comment\n"), None);
    }
}
