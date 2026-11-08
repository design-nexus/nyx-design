//! Installing themes from repositories, safely. A theme is declarative data: the
//! repository is cloned into a staging folder (git with local and helper
//! transports off), only data files are copied (no links, no executables, size
//! limits), the manifest is validated and the theme resolved, and only then is it
//! moved into place atomically. An update that fails any check leaves the working
//! version as it was; the version before an update is kept for rollback.
//!
//! Layout: `~/.local/share/nyx/themes/<id>/` per theme, `registry.toml` recording
//! where each came from, `.previous/<id>` and `.staging/` beside them.

use crate::config::{DEFAULT_THEME, update_suite};
use crate::layer::Layer;
use crate::paths;
use crate::registry::{Entry, Registry, read_sources};
use crate::schema::{Diag, Issue, MANIFEST, Meta, Origin, Severity, SourceInfo, parse_package, valid_id};
use crate::tokens::A11y;
use nyx_core::fetch;
use std::collections::BTreeMap;
use std::path::{Path, PathBuf};

/// Largest single file in a theme.
pub const MAX_FILE: u64 = 20 * 1024 * 1024;
/// Largest theme in total.
pub const MAX_TOTAL: u64 = 64 * 1024 * 1024;
/// Most files in a theme.
pub const MAX_FILES: usize = 400;

const DATA_EXTENSIONS: &[&str] = &["toml", "png", "jpg", "jpeg", "webp", "svg", "txt", "md"];
const DATA_NAMES: &[&str] = &["LICENSE", "LICENCE", "COPYING", "README", "AUTHORS", "NOTICE"];
const SCRIPT_EXTENSIONS: &[&str] = &["sh", "bash", "zsh", "fish", "py", "pl", "rb", "lua", "js", "exe", "so", "desktop", "service"];

/// The current time as RFC 3339 UTC.
pub fn now_utc() -> String {
    let secs = std::time::SystemTime::now().duration_since(std::time::UNIX_EPOCH).map(|d| d.as_secs()).unwrap_or(0) as i64;
    let (days, rem) = (secs.div_euclid(86_400), secs.rem_euclid(86_400));
    // Howard Hinnant's civil-from-days.
    let z = days + 719_468;
    let era = z.div_euclid(146_097);
    let doe = z - era * 146_097;
    let yoe = (doe - doe / 1460 + doe / 36_524 - doe / 146_096) / 365;
    let doy = doe - (365 * yoe + yoe / 4 - yoe / 100);
    let mp = (5 * doy + 2) / 153;
    let d = doy - (153 * mp + 2) / 5 + 1;
    let m = if mp < 10 { mp + 3 } else { mp - 9 };
    let y = yoe + era * 400 + i64::from(m <= 2);
    format!("{y:04}-{m:02}-{d:02}T{:02}:{:02}:{:02}Z", rem / 3600, rem % 3600 / 60, rem % 60)
}

/// A repository to fetch: the URL git clones, and an optional ref and folder.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct RepoRef {
    pub url: String,
    pub git_ref: Option<String>,
    pub subpath: Option<String>,
}

/// Read what a user pastes: `https://github.com/o/r`, `github.com/o/r`, with
/// `.git`, or `/tree/<ref>/<folder>`; or any https/ssh git URL.
pub fn parse_url(input: &str) -> Result<RepoRef, String> {
    let s = input.trim().trim_end_matches('/');
    let s = if s.starts_with("github.com/") { format!("https://{s}") } else { s.to_string() };
    if let Some(rest) = s.strip_prefix("https://github.com/") {
        let parts: Vec<&str> = rest.split('/').collect();
        if parts.len() < 2 || parts[0].is_empty() || parts[1].is_empty() {
            return Err(format!("{input:?}: a GitHub repository URL looks like https://github.com/owner/repository"));
        }
        let valid = |p: &str| p.bytes().all(|b| b.is_ascii_alphanumeric() || b"-_.".contains(&b)) && !p.starts_with('.');
        let repo = parts[1].trim_end_matches(".git");
        if !valid(parts[0]) || !valid(repo) {
            return Err(format!("{input:?}: that isn't a GitHub owner and repository name"));
        }
        let url = format!("https://github.com/{}/{repo}.git", parts[0]);
        let (git_ref, subpath) = match parts.get(2) {
            Some(&"tree") => {
                let r = parts.get(3).filter(|r| !r.is_empty()).ok_or(format!("{input:?}: /tree/ needs a branch or tag"))?;
                let sub = parts[4..].join("/");
                (Some(r.to_string()), (!sub.is_empty()).then_some(sub))
            }
            None => (None, None),
            Some(_) => return Err(format!("{input:?}: use the repository's address, or /tree/<branch>/<folder>")),
        };
        if let Some(r) = &git_ref
            && (r.starts_with('-') || r.contains(".."))
        {
            return Err(format!("{r:?} isn't a branch or tag"));
        }
        if let Some(sub) = &subpath
            && !crate::schema::safe_relative(sub)
        {
            return Err(format!("{sub:?} isn't a folder in the repository"));
        }
        return Ok(RepoRef { url, git_ref, subpath });
    }
    fetch::check_url(&s).map_err(|e| e.to_string())?;
    Ok(RepoRef { url: s, git_ref: None, subpath: None })
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum Format {
    /// A Nyx theme package (`nyx-theme.toml`).
    Nyx,
    /// An Omarchy theme (`colors.toml`), converted on install.
    Omarchy,
}

impl Format {
    pub fn label(self) -> &'static str {
        match self {
            Format::Nyx => "nyx",
            Format::Omarchy => "omarchy",
        }
    }
}

/// One theme found in a repository, staged and checked.
#[derive(Debug, Clone)]
pub struct Candidate {
    /// Its folder in the repository (`""` for the root).
    pub subpath: String,
    pub format: Format,
    pub meta: Meta,
    /// Errors refuse installation; warnings (contrast, ignored files) are shown.
    pub issues: Vec<Issue>,
    /// Sample colours for a preview: surface, text, accent, then swatches.
    pub colors: Vec<String>,
    /// Installing it updates the copy installed from the same place.
    pub updates: bool,
    staged: PathBuf,
}

impl Candidate {
    pub fn installable(&self) -> bool {
        !self.issues.iter().any(|i| i.severity == Severity::Error)
    }
}

/// A fetched repository and the themes in it. Dropping it deletes the staging folder.
#[derive(Debug)]
pub struct Inspection {
    pub repo: RepoRef,
    pub commit: String,
    pub candidates: Vec<Candidate>,
    work: PathBuf,
}

impl Drop for Inspection {
    fn drop(&mut self) {
        let _ = std::fs::remove_dir_all(&self.work);
    }
}

fn work_dir() -> Result<PathBuf, String> {
    let nanos = std::time::SystemTime::now().duration_since(std::time::UNIX_EPOCH).map(|d| d.subsec_nanos()).unwrap_or(0);
    let work = paths::staging_dir().join(format!("{}-{nanos}", std::process::id()));
    let _ = std::fs::remove_dir_all(&work);
    std::fs::create_dir_all(&work).map_err(|e| format!("can't create {}: {e}", work.display()))?;
    Ok(work)
}

/// The theme folders under `root`, in a fixed order: `root` itself if it is one,
/// else its `themes/*` and `*` folders, sorted.
pub fn discover(root: &Path) -> Vec<(PathBuf, Format)> {
    let kind = |d: &Path| {
        if d.join(MANIFEST).is_file() {
            Some(Format::Nyx)
        } else if d.join("colors.toml").is_file() {
            Some(Format::Omarchy)
        } else {
            None
        }
    };
    if let Some(k) = kind(root) {
        return vec![(root.to_path_buf(), k)];
    }
    let mut out = Vec::new();
    for parent in [root.join("themes"), root.to_path_buf()] {
        let mut dirs: Vec<PathBuf> = std::fs::read_dir(&parent)
            .map(|r| r.flatten().map(|e| e.path()).filter(|p| p.is_dir() && !std::fs::symlink_metadata(p).is_ok_and(|m| m.file_type().is_symlink())).collect())
            .unwrap_or_default();
        dirs.sort();
        for d in dirs {
            let hidden = d.file_name().is_some_and(|n| n.to_string_lossy().starts_with('.'));
            if !hidden
                && let Some(k) = kind(&d)
                && !out.iter().any(|(p, _)| *p == d)
            {
                out.push((d, k));
            }
        }
    }
    out
}

/// `Tokyo Night theme!` → `tokyo-night-theme`.
pub fn slugify(s: &str) -> String {
    let mut out = String::new();
    for c in s.chars().flat_map(char::to_lowercase) {
        if c.is_ascii_alphanumeric() {
            out.push(c);
        } else if !out.ends_with('-') && !out.is_empty() {
            out.push('-');
        }
    }
    out.trim_end_matches('-').chars().take(56).collect::<String>().trim_end_matches('-').to_string()
}

/// The id for an Omarchy theme from its folder or repository name.
pub fn omarchy_id(name: &str) -> String {
    let slug = slugify(name);
    let slug = slug.strip_prefix("omarchy-").unwrap_or(&slug);
    let slug = slug.strip_suffix("-theme").unwrap_or(slug);
    format!("omarchy-{}", if slug.is_empty() { "theme" } else { slug })
}

fn is_executable(meta: &std::fs::Metadata) -> bool {
    use std::os::unix::fs::PermissionsExt;
    meta.permissions().mode() & 0o111 != 0
}

/// Copy the data files of `from` into `to`: refuse links and oversized trees, leave
/// out executables, scripts and anything that isn't theme data. Reported in `diag`.
fn copy_data(from: &Path, to: &Path, rel: &str, depth: usize, total: &mut (u64, usize), diag: &Diag) {
    if depth > 4 {
        diag.error(rel, "folders nested too deep");
        return;
    }
    let mut entries: Vec<PathBuf> = std::fs::read_dir(from).map(|r| r.flatten().map(|e| e.path()).collect()).unwrap_or_default();
    entries.sort();
    for path in entries {
        let name = path.file_name().map(|n| n.to_string_lossy().to_string()).unwrap_or_default();
        let here = if rel.is_empty() { name.clone() } else { format!("{rel}/{name}") };
        let Ok(meta) = std::fs::symlink_metadata(&path) else { continue };
        if name.starts_with('.') {
            continue;
        }
        if meta.file_type().is_symlink() {
            diag.error(&here, "a symbolic link; themes can't contain links");
            continue;
        }
        if meta.is_dir() {
            copy_data(&path, &to.join(&name), &here, depth + 1, total, diag);
            continue;
        }
        if !meta.is_file() {
            diag.error(&here, "not a regular file");
            continue;
        }
        let ext = path.extension().and_then(|e| e.to_str()).map(str::to_ascii_lowercase).unwrap_or_default();
        if is_executable(&meta) || SCRIPT_EXTENSIONS.contains(&ext.as_str()) {
            diag.warn(&here, "a program or script; themes never run anything, so it isn't installed");
            continue;
        }
        if !(DATA_EXTENSIONS.contains(&ext.as_str()) || DATA_NAMES.iter().any(|n| name.to_ascii_uppercase().starts_with(n))) {
            diag.warn(&here, "not theme data (TOML, images, text), so it isn't installed");
            continue;
        }
        if meta.len() > MAX_FILE {
            diag.error(&here, format!("{} MB; a theme file can be at most {} MB", meta.len() / 1_048_576, MAX_FILE / 1_048_576));
            continue;
        }
        total.0 += meta.len();
        total.1 += 1;
        if total.0 > MAX_TOTAL {
            diag.error(&here, format!("the theme is over {} MB", MAX_TOTAL / 1_048_576));
            return;
        }
        if total.1 > MAX_FILES {
            diag.error(&here, format!("the theme has more than {MAX_FILES} files"));
            return;
        }
        let dest = to.join(&name);
        let copied = std::fs::create_dir_all(to).and_then(|_| std::fs::copy(&path, &dest)).and_then(|_| {
            use std::os::unix::fs::PermissionsExt;
            std::fs::set_permissions(&dest, std::fs::Permissions::from_mode(0o644))
        });
        if let Err(e) = copied {
            diag.error(&here, format!("couldn't be copied: {e}"));
        }
    }
}

/// Stage one theme folder into `dest`, converting Omarchy themes, and check it.
fn stage(src: &Path, format: Format, dest: &Path, id_hint: &str, origin: &str) -> (Option<Meta>, Vec<Issue>) {
    let diag = Diag::new(origin);
    match format {
        Format::Nyx => {
            copy_data(src, dest, "", 0, &mut (0, 0), &diag);
            let text = match std::fs::read_to_string(dest.join(MANIFEST)) {
                Ok(t) => t,
                Err(_) => {
                    diag.error(MANIFEST, "missing or unreadable");
                    return (None, diag.take());
                }
            };
            match parse_package(&text, origin) {
                Ok(pkg) => {
                    for w in pkg.assets.wallpapers.iter().chain(pkg.preview.iter()) {
                        if !dest.join(w).is_file() {
                            diag.warn(w, "listed but not in the theme");
                        }
                    }
                    (Some(meta_of(&pkg, dest)), diag.take())
                }
                Err(issues) => {
                    diag.extend(issues);
                    (None, diag.take())
                }
            }
        }
        Format::Omarchy => {
            let name = crate::omarchy::pretty_name(id_hint.strip_prefix("omarchy-").unwrap_or(id_hint));
            let conversion = match crate::omarchy::convert_dir(src, id_hint, &name, origin) {
                Ok(c) => c,
                Err(issues) => {
                    diag.extend(issues);
                    return (None, diag.take());
                }
            };
            for n in &conversion.notes {
                diag.warn("", n.clone());
            }
            let mut total = (0u64, 0usize);
            let mut pkg = conversion.package.clone();
            let mut kept = Vec::new();
            for (from, rel) in &conversion.assets {
                let len = std::fs::metadata(from).map(|m| m.len()).unwrap_or(0);
                if len > MAX_FILE || total.0 + len > MAX_TOTAL || total.1 >= MAX_FILES {
                    diag.warn(rel, "too large; not imported");
                    continue;
                }
                total = (total.0 + len, total.1 + 1);
                let to = dest.join(rel);
                if std::fs::create_dir_all(to.parent().unwrap_or(dest)).and_then(|_| std::fs::copy(from, &to)).is_ok() {
                    kept.push(rel.clone());
                }
            }
            pkg.assets.wallpapers.retain(|w| kept.contains(w));
            if pkg.preview.as_ref().is_some_and(|p| !kept.contains(p)) {
                pkg.preview = None;
            }
            let text = toml::to_string_pretty(&pkg).unwrap_or_default();
            if let Err(e) = std::fs::create_dir_all(dest).and_then(|_| std::fs::write(dest.join(MANIFEST), text)) {
                diag.error(MANIFEST, format!("couldn't be written: {e}"));
                return (None, diag.take());
            }
            (Some(meta_of(&pkg, dest)), diag.take())
        }
    }
}

fn meta_of(pkg: &crate::schema::PackageFile, root: &Path) -> Meta {
    let in_root = |rel: &str| Some(root.join(rel)).filter(|p| p.is_file());
    Meta {
        id: pkg.id.clone(),
        name: pkg.name.clone(),
        author: pkg.author.clone(),
        description: pkg.description.clone(),
        version: pkg.version.clone(),
        schema: pkg.schema,
        appearance: pkg.appearance.unwrap_or_default(),
        license: pkg.license.clone(),
        homepage: pkg.homepage.clone(),
        preview: pkg.preview.as_deref().and_then(in_root),
        inherits: pkg.inherits.clone(),
        origin: Origin::Installed,
        path: Some(root.to_path_buf()),
        conversion: pkg.source.clone(),
        wallpapers: pkg.assets.wallpapers.iter().filter_map(|w| in_root(w)).collect(),
        ..Meta::default()
    }
}

/// Resolve a staged theme against the installed ones: inheritance, values,
/// contrast. Returns its preview colours.
fn check_resolves(meta: &Meta, staged: &Path, issues: &mut Vec<Issue>) -> Vec<String> {
    let Ok(text) = std::fs::read_to_string(staged.join(MANIFEST)) else { return vec![] };
    let Ok(pkg) = parse_package(&text, &meta.id) else { return vec![] };
    let mut registry = Registry::load();
    registry.insert_for_check(Entry { meta: meta.clone(), layers: vec![Layer::from_package(&pkg)], issues: vec![] });
    let Some(r) = crate::resolver::resolve_id(&registry, &meta.id, None, &A11y::default()) else { return vec![] };
    for i in r.issues {
        if !issues.contains(&i) {
            issues.push(i);
        }
    }
    let mut colors: Vec<String> = ["surface.primary", "text.primary", "accent.primary"].iter().map(|t| r.tokens.color(t).to_string()).collect();
    colors.extend(r.theme.look.swatches.iter().take(9).map(|(_, c)| c.clone()));
    colors
}

/// Whether installing `id` from `url`/`subpath` would replace another theme.
fn conflict(registry: &Registry, sources: &BTreeMap<String, SourceInfo>, id: &str, url: &str, subpath: &str) -> Option<String> {
    let existing = registry.get(id)?;
    let same_source = existing.meta.origin == Origin::Installed
        && sources.get(id).is_some_and(|s| s.url == url && s.subpath.as_deref().unwrap_or("") == subpath);
    if same_source {
        return None;
    }
    let from = match existing.meta.origin {
        Origin::BuiltIn => "a theme built into Nyx".to_string(),
        Origin::System => "a theme installed with the system".into(),
        Origin::Installed => match sources.get(id) {
            Some(s) => format!("already installed from {}", s.url),
            None => "already installed".into(),
        },
        Origin::User | Origin::Omarchy => "one of your own themes".into(),
    };
    Some(format!("{id} is {from}; two themes can't share an id, so this one can't be installed as well"))
}

fn inspect_tree(repo: RepoRef, commit: String, root: &Path, work: PathBuf, base_name: &str) -> Result<Inspection, String> {
    let found = discover(root);
    if found.is_empty() {
        return Err("no theme found: a theme has nyx-theme.toml (a Nyx theme) or colors.toml (an Omarchy theme)".into());
    }
    let registry = Registry::load();
    let sources = read_sources();
    let mut candidates = Vec::new();
    for (n, (dir, format)) in found.into_iter().enumerate() {
        let subpath = dir.strip_prefix(root).unwrap_or(&dir).to_string_lossy().to_string();
        let full_sub = match (&repo.subpath, subpath.is_empty()) {
            (Some(s), true) => s.clone(),
            (Some(s), false) => format!("{s}/{subpath}"),
            (None, _) => subpath.clone(),
        };
        let folder = if subpath.is_empty() { base_name.to_string() } else { dir.file_name().map(|f| f.to_string_lossy().to_string()).unwrap_or_default() };
        let id_hint = omarchy_id(&folder);
        let staged = work.join("pkg").join(n.to_string());
        let origin = if full_sub.is_empty() { repo.url.clone() } else { format!("{} ({full_sub})", repo.url) };
        let (meta, mut issues) = stage(&dir, format, &staged, &id_hint, &origin);
        let Some(meta) = meta else {
            candidates.push(Candidate {
                subpath: full_sub,
                format,
                meta: Meta { id: id_hint, name: folder, ..Meta::default() },
                issues,
                colors: vec![],
                updates: false,
                staged,
            });
            continue;
        };
        let colors = check_resolves(&meta, &staged, &mut issues);
        let updates = registry.get(&meta.id).is_some() && conflict(&registry, &sources, &meta.id, &repo.url, &full_sub).is_none();
        if let Some(msg) = conflict(&registry, &sources, &meta.id, &repo.url, &full_sub) {
            issues.insert(0, Issue { severity: Severity::Error, origin: origin.clone(), key: "id".into(), message: msg });
        }
        candidates.push(Candidate { subpath: full_sub, format, meta, issues, colors, updates, staged });
    }
    Ok(Inspection { repo, commit, candidates, work })
}

/// Fetch a repository and check the themes in it, installing nothing.
pub fn inspect(input: &str) -> Result<Inspection, String> {
    let repo = parse_url(input)?;
    let work = work_dir()?;
    let checkout = work.join("src");
    let commit = match fetch::clone(&repo.url, repo.git_ref.as_deref(), None, &checkout) {
        Ok(c) => c,
        Err(e) => {
            let _ = std::fs::remove_dir_all(&work);
            return Err(format!("couldn't fetch {}: {e:#}", repo.url));
        }
    };
    let root = match fetch::subpath(&checkout, repo.subpath.as_deref()) {
        Ok(r) if r.is_dir() => r,
        _ => {
            let _ = std::fs::remove_dir_all(&work);
            return Err(format!("the repository has no folder {:?}", repo.subpath.as_deref().unwrap_or("")));
        }
    };
    let base = repo.url.trim_end_matches(".git").rsplit(['/', ':']).next().unwrap_or("theme").to_string();
    let base = repo.subpath.as_deref().and_then(|s| s.rsplit('/').next()).map(str::to_string).unwrap_or(base);
    inspect_tree(repo, commit, &root, work, &base)
}

/// Check a theme folder on this computer (an Omarchy theme to import, or a Nyx
/// theme package being developed), installing nothing.
pub fn inspect_local(dir: &Path) -> Result<Inspection, String> {
    // Named as given: a linked theme folder is often called `theme` underneath.
    let base = dir.file_name().map(|f| f.to_string_lossy().to_string()).unwrap_or_else(|| "theme".into());
    let dir = dir.canonicalize().map_err(|e| format!("{}: {e}", dir.display()))?;
    let work = work_dir()?;
    let repo = RepoRef { url: format!("file://{}", dir.display()), git_ref: None, subpath: None };
    inspect_tree(repo, String::new(), &dir, work, &base)
}

fn write_sources(sources: &BTreeMap<String, SourceInfo>) -> Result<(), String> {
    #[derive(serde::Serialize)]
    struct File<'a> {
        themes: &'a BTreeMap<String, SourceInfo>,
    }
    let text = toml::to_string_pretty(&File { themes: sources }).map_err(|e| e.to_string())?;
    nyx_core::cmd::atomic_write(&paths::registry_file(), text).map_err(|e| format!("{e:#}"))
}

/// Install the chosen candidates (by index). Each is moved into place
/// atomically; a theme from the same place is updated, keeping the old copy.
pub fn install(ins: &Inspection, which: &[usize]) -> Result<Vec<String>, String> {
    let mut sources = read_sources();
    let mut done = Vec::new();
    for &i in which {
        let c = ins.candidates.get(i).ok_or("no such theme in the repository")?;
        if !c.installable() {
            let first = c.issues.iter().find(|i| i.severity == Severity::Error).map(ToString::to_string).unwrap_or_default();
            return Err(format!("{} can't be installed: {first}", c.meta.name));
        }
        let registry = Registry::load();
        if let Some(msg) = conflict(&registry, &sources, &c.meta.id, &ins.repo.url, &c.subpath) {
            return Err(msg);
        }
        let target = paths::installed_dir().join(&c.meta.id);
        let keep = paths::previous_dir().join(&c.meta.id);
        std::fs::create_dir_all(paths::previous_dir()).map_err(|e| e.to_string())?;
        fetch::swap_in(&c.staged, &target, &keep).map_err(|e| format!("{e:#}"))?;
        let now = now_utc();
        let installed = sources.get(&c.meta.id).map(|s| s.installed.clone()).unwrap_or_else(|| now.clone());
        let updated = sources.contains_key(&c.meta.id).then_some(now);
        sources.insert(
            c.meta.id.clone(),
            SourceInfo {
                url: ins.repo.url.clone(),
                git_ref: ins.repo.git_ref.clone(),
                subpath: (!c.subpath.is_empty()).then(|| c.subpath.clone()),
                commit: ins.commit.clone(),
                format: c.format.label().into(),
                installed,
                updated,
            },
        );
        write_sources(&sources)?;
        done.push(c.meta.id.clone());
    }
    Ok(done)
}

/// Whether an installed theme's repository has moved on.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct UpdateCheck {
    pub id: String,
    pub installed: String,
    pub latest: String,
}

impl UpdateCheck {
    pub fn available(&self) -> bool {
        !self.latest.is_empty() && !self.latest.eq_ignore_ascii_case(&self.installed)
    }
}

/// Ask the repository for its latest commit, without fetching it.
pub fn check_update(id: &str) -> Result<UpdateCheck, String> {
    let src = read_sources().remove(id).ok_or(format!("{id} wasn't installed from a repository"))?;
    if src.url.starts_with("file://") {
        return Ok(UpdateCheck { id: id.into(), installed: src.commit.clone(), latest: src.commit });
    }
    fetch::check_url(&src.url).map_err(|e| e.to_string())?;
    let r = src.git_ref.clone().unwrap_or_else(|| "HEAD".into());
    let out = fetch::git(None, &["ls-remote", "--", &src.url, &r]).map_err(|e| format!("{e:#}"))?;
    let latest = out.lines().next().and_then(|l| l.split_whitespace().next()).unwrap_or("").to_string();
    Ok(UpdateCheck { id: id.into(), installed: src.commit, latest })
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum Updated {
    UpToDate,
    Updated { from: String, to: String },
}

/// Fetch, check and install the latest version of `id`. A version that fails any
/// check is refused and the installed one stays.
pub fn update(id: &str) -> Result<Updated, String> {
    let src = read_sources().remove(id).ok_or(format!("{id} wasn't installed from a repository"))?;
    if src.url.starts_with("file://") {
        return Err(format!("{id} was imported from a folder on this computer; import it again to update it"));
    }
    let mut url = src.url.trim_end_matches(".git").to_string();
    if src.git_ref.is_some() || src.subpath.is_some() {
        url = format!("{url}/tree/{}/{}", src.git_ref.as_deref().unwrap_or("HEAD"), src.subpath.as_deref().unwrap_or(""));
    }
    let ins = if url.starts_with("https://github.com/") {
        inspect(&url)?
    } else {
        inspect(&src.url)?
    };
    if ins.commit.eq_ignore_ascii_case(&src.commit) {
        return Ok(Updated::UpToDate);
    }
    let idx = ins
        .candidates
        .iter()
        .position(|c| c.meta.id == id)
        .ok_or(format!("the repository no longer has a theme {id}; the installed version stays"))?;
    let c = &ins.candidates[idx];
    if !c.installable() {
        let first = c.issues.iter().find(|i| i.severity == Severity::Error).map(ToString::to_string).unwrap_or_default();
        return Err(format!("the new version of {id} doesn't pass its checks ({first}); the installed version stays"));
    }
    install(&ins, &[idx])?;
    Ok(Updated::Updated { from: src.commit, to: ins.commit.clone() })
}

/// Go back to the version before the last update (and forward again).
pub fn rollback(id: &str) -> Result<(), String> {
    if !valid_id(id) {
        return Err(format!("{id:?} isn't a theme id"));
    }
    fetch::swap_back(&paths::installed_dir().join(id), &paths::previous_dir().join(id)).map_err(|e| format!("{id}: {e:#}"))
}

/// Remove an installed theme. Built-in and system themes can't be removed. The
/// system theme falls back to the default if it was this one; app overrides keep
/// naming it, so they come back if it is installed again.
pub fn remove(id: &str) -> Result<(), String> {
    let registry = Registry::load();
    let entry = registry.get(id).ok_or(format!("there is no theme {id}"))?;
    if entry.meta.origin != Origin::Installed {
        return Err(match entry.meta.origin {
            Origin::BuiltIn => format!("{} is built into Nyx and can't be removed", entry.meta.name),
            Origin::System => format!("{} came with the system and can't be removed here", entry.meta.name),
            _ => format!("{} is one of your own theme files ({}); delete the file to remove it", entry.meta.name, entry.meta.path.as_deref().map(|p| p.display().to_string()).unwrap_or_default()),
        });
    }
    let target = paths::installed_dir().join(&entry.meta.id);
    if target.parent() != Some(paths::installed_dir().as_path()) {
        return Err("refusing to remove a folder outside the themes folder".into());
    }
    std::fs::remove_dir_all(&target).map_err(|e| format!("{}: {e}", target.display()))?;
    let _ = std::fs::remove_dir_all(paths::previous_dir().join(&entry.meta.id));
    let mut sources = read_sources();
    sources.remove(&entry.meta.id);
    write_sources(&sources)?;
    update_suite(|s| {
        if s.theme == entry.meta.id {
            s.theme = DEFAULT_THEME.into();
        }
    })
    .map_err(|e| e.to_string())?;
    Ok(())
}

/// Import an Omarchy theme folder on this computer as a Nyx theme.
pub fn import_omarchy(dir: &Path) -> Result<String, String> {
    let ins = inspect_local(dir)?;
    let idx = ins
        .candidates
        .iter()
        .position(|c| c.format == Format::Omarchy)
        .ok_or(format!("{} isn't an Omarchy theme (no colors.toml)", dir.display()))?;
    Ok(install(&ins, &[idx])?.remove(0))
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::sync::Mutex;

    /// Tests that change XDG folders run one at a time.
    static ENV: Mutex<()> = Mutex::new(());

    struct Scratch(PathBuf);
    impl Drop for Scratch {
        fn drop(&mut self) {
            let _ = std::fs::remove_dir_all(&self.0);
        }
    }

    fn scratch(name: &str) -> Scratch {
        let root = std::env::temp_dir().join(format!("nyx-theme-install-{name}-{}", std::process::id()));
        let _ = std::fs::remove_dir_all(&root);
        for d in ["config", "data", "state", "runtime", "cache", "repo"] {
            std::fs::create_dir_all(root.join(d)).unwrap();
        }
        // SAFETY: tests that touch the environment hold `ENV`.
        unsafe {
            std::env::set_var("XDG_CONFIG_HOME", root.join("config"));
            std::env::set_var("XDG_DATA_HOME", root.join("data"));
            std::env::set_var("XDG_STATE_HOME", root.join("state"));
            std::env::set_var("XDG_RUNTIME_DIR", root.join("runtime"));
            std::env::set_var("XDG_CACHE_HOME", root.join("cache"));
            std::env::set_var("XDG_DATA_DIRS", root.join("none"));
            std::env::set_var("NYX_FETCH_TEST_ALLOW_FILE", "1");
        }
        Scratch(root)
    }

    fn git_repo(dir: &Path) -> String {
        let run = |args: &[&str]| {
            let ok = std::process::Command::new("git")
                .arg("-C")
                .arg(dir)
                .args(["-c", "user.email=t@t", "-c", "user.name=t", "-c", "commit.gpgsign=false"])
                .args(args)
                .output()
                .unwrap();
            assert!(ok.status.success(), "git {args:?}: {}", String::from_utf8_lossy(&ok.stderr));
        };
        run(&["init", "-q", "-b", "main"]);
        run(&["add", "-A"]);
        run(&["commit", "-qm", "theme"]);
        format!("file://{}", dir.display())
    }

    const PKG: &str = "schema = 2\nid = \"sunset\"\nname = \"Sunset\"\nappearance = \"dark\"\ninherits = \"catppuccin-mocha\"\n[tokens]\n\"accent.primary\" = \"#ff8844\"\n";

    #[test]
    fn github_urls() {
        let _env = ENV.lock().unwrap_or_else(|e| e.into_inner());
        // SAFETY: tests that touch the environment hold `ENV`.
        unsafe { std::env::remove_var("NYX_FETCH_TEST_ALLOW_FILE") };
        let r = parse_url("https://github.com/acme/themes").unwrap();
        assert_eq!(r, RepoRef { url: "https://github.com/acme/themes.git".into(), git_ref: None, subpath: None });
        let r = parse_url("github.com/acme/themes.git/").unwrap();
        assert_eq!(r.url, "https://github.com/acme/themes.git");
        let r = parse_url("https://github.com/acme/themes/tree/v2/themes/sunset").unwrap();
        assert_eq!((r.git_ref.as_deref(), r.subpath.as_deref()), (Some("v2"), Some("themes/sunset")));
        for bad in [
            "https://github.com/acme",
            "https://github.com/acme/x/tree/../../etc",
            "https://github.com/acme/x/tree/main/../../etc",
            "https://github.com/acme/x/blob/main/a",
            "https://github.com/-x/y;rm",
            "file:///etc",
            "ext::sh -c x",
        ] {
            assert!(parse_url(bad).is_err(), "{bad}");
        }
        assert_eq!(omarchy_id("omarchy-tokyo-night-theme"), "omarchy-tokyo-night");
        assert!(now_utc().ends_with('Z') && now_utc().len() == 20);
    }

    #[test]
    fn install_update_rollback_remove() {
        let _env = ENV.lock().unwrap_or_else(|e| e.into_inner());
        let s = scratch("cycle");
        let repo = s.0.join("repo");
        std::fs::write(repo.join(MANIFEST), PKG).unwrap();
        std::fs::write(repo.join("LICENSE"), "MIT").unwrap();
        std::fs::write(repo.join("install.sh"), "rm -rf ~").unwrap();
        let url = git_repo(&repo);
        let ins = inspect(&url).unwrap();
        assert_eq!(ins.candidates.len(), 1);
        let c = &ins.candidates[0];
        assert!(c.installable(), "{:?}", c.issues);
        assert!(c.issues.iter().any(|i| i.key == "install.sh"), "the script is reported");
        assert_eq!(install(&ins, &[0]).unwrap(), ["sunset"]);
        let dir = paths::installed_dir().join("sunset");
        assert!(dir.join(MANIFEST).is_file() && dir.join("LICENSE").is_file());
        assert!(!dir.join("install.sh").exists(), "scripts are never installed");
        let reg = Registry::load();
        assert_eq!(reg.get("sunset").unwrap().meta.source.as_ref().unwrap().url, url);
        drop(ins);

        // A broken update is refused and the working version stays.
        std::fs::write(repo.join(MANIFEST), PKG.replace("schema = 2", "schema = 2\nhooks = \"x\"")).unwrap();
        git_repo(&repo);
        let ins = inspect(&url).unwrap();
        assert!(!ins.candidates[0].installable());
        assert!(install(&ins, &[0]).is_err());
        assert!(std::fs::read_to_string(dir.join(MANIFEST)).unwrap().contains("#ff8844"));
        drop(ins);

        // A good update replaces it and keeps the old one for rollback.
        std::fs::write(repo.join(MANIFEST), PKG.replace("#ff8844", "#00aaff")).unwrap();
        git_repo(&repo);
        let ins = inspect(&url).unwrap();
        assert!(ins.candidates[0].updates);
        install(&ins, &[0]).unwrap();
        assert!(std::fs::read_to_string(dir.join(MANIFEST)).unwrap().contains("#00aaff"));
        rollback("sunset").unwrap();
        assert!(std::fs::read_to_string(dir.join(MANIFEST)).unwrap().contains("#ff8844"));
        drop(ins);

        update_suite(|s| s.theme = "sunset".into()).unwrap();
        remove("sunset").unwrap();
        assert!(!dir.exists());
        assert_eq!(crate::config::suite().theme, DEFAULT_THEME, "the system theme falls back");
        assert!(remove("catppuccin-mocha").is_err(), "built-in themes stay");
    }

    #[test]
    fn hostile_repositories() {
        let _env = ENV.lock().unwrap_or_else(|e| e.into_inner());
        let s = scratch("hostile");
        let repo = s.0.join("repo");
        // A link out of the repository, a theme claiming a built-in id, a path escape.
        std::fs::create_dir_all(repo.join("themes/escape")).unwrap();
        std::fs::write(repo.join("themes/escape").join(MANIFEST), "schema = 2\nid = \"escape\"\nname = \"E\"\npreview = \"../../../etc/passwd\"").unwrap();
        std::fs::create_dir_all(repo.join("themes/linky")).unwrap();
        std::fs::write(repo.join("themes/linky").join(MANIFEST), "schema = 2\nid = \"linky\"\nname = \"L\"").unwrap();
        std::os::unix::fs::symlink("/etc/passwd", repo.join("themes/linky/passwd.txt")).unwrap();
        std::fs::create_dir_all(repo.join("themes/thief")).unwrap();
        std::fs::write(repo.join("themes/thief").join(MANIFEST), "schema = 2\nid = \"catppuccin-mocha\"\nname = \"Fake\"").unwrap();
        std::fs::create_dir_all(repo.join("themes/huge")).unwrap();
        std::fs::write(repo.join("themes/huge").join(MANIFEST), "schema = 2\nid = \"huge\"\nname = \"H\"").unwrap();
        std::fs::File::create(repo.join("themes/huge/big.png")).unwrap().set_len(MAX_FILE + 1).unwrap();
        std::fs::create_dir_all(repo.join("themes/corrupt")).unwrap();
        std::fs::write(repo.join("themes/corrupt").join(MANIFEST), "schema = = 2").unwrap();
        let url = git_repo(&repo);
        let ins = inspect(&url).unwrap();
        let ids: Vec<&str> = ins.candidates.iter().map(|c| c.subpath.as_str()).collect();
        assert_eq!(ids, ["themes/corrupt", "themes/escape", "themes/huge", "themes/linky", "themes/thief"], "found in a fixed order");
        for c in &ins.candidates {
            assert!(!c.installable(), "{} should be refused: {:?}", c.subpath, c.issues);
        }
        assert!(install(&ins, &[0, 1, 2, 3, 4]).is_err());
        assert!(!paths::installed_dir().join("catppuccin-mocha").exists());
    }

    #[test]
    fn imports_an_omarchy_theme() {
        let _env = ENV.lock().unwrap_or_else(|e| e.into_inner());
        let s = scratch("omarchy");
        let theme = s.0.join("repo/omarchy-sunrise-theme");
        std::fs::create_dir_all(theme.join("backgrounds")).unwrap();
        std::fs::write(theme.join("colors.toml"), "background = \"#202020\"\nforeground = \"#eeeeee\"\naccent = \"#ffaa00\"\n").unwrap();
        std::fs::write(theme.join("backgrounds/a.png"), b"png").unwrap();
        std::fs::write(theme.join("hyprland.conf"), b"x").unwrap();
        let id = import_omarchy(&theme).unwrap();
        assert_eq!(id, "omarchy-sunrise");
        let reg = Registry::load();
        let e = reg.get(&id).unwrap();
        assert_eq!(e.meta.wallpapers.len(), 1);
        assert_eq!(e.meta.conversion.as_ref().unwrap().format, "omarchy");
        assert_eq!(e.meta.source.as_ref().unwrap().format, "omarchy");
        let r = crate::resolver::resolve_id(&reg, &id, None, &A11y::default()).unwrap();
        assert_eq!(r.tokens.color("accent.primary"), "#ffaa00");
    }
}
