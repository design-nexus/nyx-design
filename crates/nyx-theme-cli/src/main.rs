//! `nyx-theme`: the theme engine from the command line. Everything here is also in
//! Nyx Settings; this is for scripts, hooks (Omarchy's theme-set hook runs
//! `nyx-theme sync`), the QML module's first start, and testing.

use nyx_theme_core::{self as core, A11y, Registry, Scope, Severity, installer, resolver};
use std::io::{BufRead, IsTerminal, Write};
use std::path::Path;
use std::process::ExitCode;

const USAGE: &str = "\
nyx-theme: Nyx themes

  list [--json]                  every theme on offer
  get [--app ID] [--json]        the theme shown (system, or one app)
  set ID|omarchy                 choose the system theme
  app set APP ID                 give one app its own theme
  app clear APP                  put an app back on Follow System
  app list                       apps with their own theme
  install URL [--yes]            install the themes in a repository (GitHub URL)
  check-updates                  which installed themes have updates
  update ID|--all                update installed themes
  rollback ID                    back to the version before the last update
  remove ID                      remove an installed theme
  import-omarchy DIR             import an Omarchy theme folder
  validate PATH                  check a theme folder or file
  resolve [--app ID] [--json] [--high-contrast] [--reduce-motion]
                                 the resolved tokens
  snapshot                       write the resolved system theme for clients
  sync                           re-resolve, write the snapshot, announce changes
  watch                          print theme change announcements
  reset                          appearance back to the defaults
  bench                          time theme resolution
";

fn flag(args: &[String], name: &str) -> bool {
    args.iter().any(|a| a == name)
}

fn value<'a>(args: &'a [String], name: &str) -> Option<&'a str> {
    args.iter().position(|a| a == name).and_then(|i| args.get(i + 1)).map(String::as_str)
}

fn positional(args: &[String]) -> Vec<&str> {
    let mut out = Vec::new();
    let mut skip = false;
    for a in args {
        if skip {
            skip = false;
        } else if a == "--app" {
            skip = true;
        } else if !a.starts_with("--") {
            out.push(a.as_str());
        }
    }
    out
}

fn print_issues(issues: &[core::Issue]) {
    for i in issues {
        eprintln!("  {i}");
    }
}

fn confirm(question: &str) -> bool {
    if !std::io::stdin().is_terminal() {
        return false;
    }
    print!("{question} [y/N] ");
    let _ = std::io::stdout().flush();
    let mut line = String::new();
    let _ = std::io::stdin().lock().read_line(&mut line);
    matches!(line.trim(), "y" | "Y" | "yes")
}

fn json(v: &impl serde::Serialize) {
    println!("{}", serde_json::to_string_pretty(v).unwrap_or_default());
}

fn main() -> ExitCode {
    let args: Vec<String> = std::env::args().skip(1).collect();
    let Some(cmd) = args.first().map(String::as_str) else {
        print!("{USAGE}");
        return ExitCode::from(2);
    };
    let rest = &args[1..];
    let pos = positional(rest);
    let result: Result<(), String> = match cmd {
        "list" => {
            let metas = core::list_themes();
            if flag(rest, "--json") {
                json(&metas);
            } else {
                let active = core::get_active_theme();
                for m in metas {
                    let mark = if m.id == active { "*" } else { " " };
                    println!("{mark} {:<24} {:<28} {:?}/{:?}", m.id, m.name, m.origin, m.appearance);
                }
            }
            Ok(())
        }
        "get" => {
            let s = core::suite();
            let app = value(rest, "--app");
            let r = core::resolve_effective_theme(app, &s, &A11y::system());
            if flag(rest, "--json") {
                json(&serde_json::json!({ "id": r.meta.id, "name": r.meta.name, "scope": r.scope, "overridden": r.overridden, "requested": r.requested }));
            } else {
                println!("{} ({}){}", r.meta.id, r.meta.name, if r.overridden { ", this app's own choice" } else { "" });
            }
            Ok(())
        }
        "set" => match pos.first() {
            Some(id) => core::set_system_theme(id),
            None => Err("set needs a theme id".into()),
        },
        "app" => match (pos.first().copied(), pos.get(1), pos.get(2)) {
            (Some("set"), Some(app), Some(id)) => core::set_app_override(app, id),
            (Some("clear"), Some(app), _) => core::clear_app_override(app),
            (Some("list"), _, _) => {
                for (app, c) in core::suite().applications {
                    println!("{app}: {:?} {}", c.mode, c.theme.unwrap_or_default());
                }
                Ok(())
            }
            _ => Err("app set APP ID | app clear APP | app list".into()),
        },
        "install" => install(pos.first().copied(), flag(rest, "--yes")),
        "check-updates" => {
            for m in core::list_themes().into_iter().filter(|m| m.origin == core::Origin::Installed) {
                match installer::check_update(&m.id) {
                    Ok(c) if c.available() => println!("{}: update available ({} → {})", m.id, short(&c.installed), short(&c.latest)),
                    Ok(_) => println!("{}: up to date", m.id),
                    Err(e) => println!("{}: {e}", m.id),
                }
            }
            Ok(())
        }
        "update" => {
            let ids: Vec<String> = if flag(rest, "--all") {
                core::list_themes().into_iter().filter(|m| m.origin == core::Origin::Installed).map(|m| m.id).collect()
            } else {
                pos.first().map(|s| vec![s.to_string()]).unwrap_or_default()
            };
            if ids.is_empty() {
                Err("update ID | update --all".into())
            } else {
                let mut failed = None;
                for id in ids {
                    match core::update_theme(&id) {
                        Ok(installer::Updated::UpToDate) => println!("{id}: up to date"),
                        Ok(installer::Updated::Updated { from, to }) => println!("{id}: updated {} → {}", short(&from), short(&to)),
                        Err(e) => {
                            eprintln!("{id}: {e}");
                            failed = Some(e);
                        }
                    }
                }
                failed.map_or(Ok(()), Err)
            }
        }
        "rollback" => match pos.first() {
            Some(id) => installer::rollback(id).map(|_| {
                core::notify_changed("system", "theme-rolled-back");
            }),
            None => Err("rollback needs a theme id".into()),
        },
        "remove" => match pos.first() {
            Some(id) => core::remove_theme(id),
            None => Err("remove needs a theme id".into()),
        },
        "import-omarchy" => match pos.first() {
            Some(dir) => installer::import_omarchy(Path::new(dir)).map(|id| {
                core::notify_changed("system", "theme-imported");
                println!("imported as {id}");
            }),
            None => Err("import-omarchy needs a folder".into()),
        },
        "validate" => match pos.first() {
            Some(p) => validate(Path::new(p)),
            None => Err("validate needs a theme folder or file".into()),
        },
        "resolve" => {
            let s = core::suite();
            let mut a11y = A11y::system();
            a11y.high_contrast |= flag(rest, "--high-contrast");
            a11y.reduce_motion |= flag(rest, "--reduce-motion");
            let r = core::resolve_effective_theme(value(rest, "--app"), &s, &a11y);
            if flag(rest, "--json") {
                json(&core::snapshot::Snapshot::from_resolved(&r, core::snapshot::generation(), "resolve"));
            } else {
                println!("{} ({}) for {}", r.meta.id, r.meta.name, r.scope);
                for (k, v) in &r.tokens.colors {
                    println!("  {k:<22} {v}");
                }
                print_issues(&r.issues);
            }
            Ok(())
        }
        "snapshot" => {
            let r = resolver::resolve(&Registry::load(), &core::suite(), Scope::System, &A11y::system());
            core::snapshot::publish(&r, "snapshot", false).map(|p| println!("{} (generation {})", core::paths::snapshot_file().display(), p.generation)).map_err(|e| e.to_string())
        }
        "sync" => {
            let g = core::notify_changed("system", "sync");
            println!("generation {g}");
            Ok(())
        }
        "watch" => {
            #[cfg(feature = "dbus")]
            {
                core::dbus::watch(|e| {
                    println!("generation {} {} {} ({})", e.generation, e.scope, e.system_theme, e.reason);
                    let _ = std::io::stdout().flush();
                    true
                })
                .map_err(|e| e.to_string())
            }
            #[cfg(not(feature = "dbus"))]
            Err("built without D-Bus".into())
        }
        "reset" => core::reset_appearance(),
        "qml-fallback" => {
            print!("{}", core::snapshot::fallback_js());
            Ok(())
        }
        "bench" => bench(),
        "help" | "--help" | "-h" => {
            print!("{USAGE}");
            Ok(())
        }
        other => Err(format!("unknown command {other:?}\n{USAGE}")),
    };
    match result {
        Ok(()) => ExitCode::SUCCESS,
        Err(e) => {
            eprintln!("nyx-theme: {e}");
            ExitCode::FAILURE
        }
    }
}

fn short(commit: &str) -> &str {
    commit.get(..10).unwrap_or(commit)
}

fn install(url: Option<&str>, yes: bool) -> Result<(), String> {
    let url = url.ok_or("install needs a repository URL")?;
    let ins = installer::inspect(url)?;
    println!("{} at {}", ins.repo.url, short(&ins.commit));
    let mut ok = Vec::new();
    for (i, c) in ins.candidates.iter().enumerate() {
        let state = if !c.installable() {
            "can't be installed"
        } else if c.updates {
            "update"
        } else {
            "new"
        };
        let author = c.meta.author.as_deref().map(|a| format!(" by {a}")).unwrap_or_default();
        println!("  {} ({}){author}, {} theme from {}: {state}", c.meta.name, c.meta.id, c.format.label(), if c.subpath.is_empty() { "/" } else { &c.subpath });
        print_issues(&c.issues);
        if c.installable() {
            ok.push(i);
        }
    }
    if ok.is_empty() {
        return Err("nothing to install".into());
    }
    if !yes && !confirm(&format!("Install {} theme(s)?", ok.len())) {
        return Err("not installed (pass --yes to install without asking)".into());
    }
    let ids = installer::install(&ins, &ok)?;
    core::notify_changed("system", "theme-installed");
    println!("installed {}", ids.join(", "));
    Ok(())
}

fn validate(path: &Path) -> Result<(), String> {
    let mut issues = Vec::new();
    if path.is_dir() {
        let ins = installer::inspect_local(path)?;
        for c in &ins.candidates {
            println!("{} ({}), {} theme", c.meta.name, c.meta.id, c.format.label());
            issues.extend(c.issues.iter().cloned().map(|mut i| {
                if !c.installable() && i.key == "id" && i.message.contains("can't share an id") {
                    i.severity = Severity::Warning;
                }
                i
            }));
        }
    } else {
        let text = std::fs::read_to_string(path).map_err(|e| format!("{}: {e}", path.display()))?;
        let origin = path.display().to_string();
        if core::schema::is_package(&text) {
            match core::schema::parse_package(&text, &origin) {
                Ok(pkg) => {
                    let r = resolver::resolve_layers(&pkg.id, &[core::layer::Layer::from_package(&pkg)], &A11y::default());
                    issues.extend(r.issues);
                }
                Err(e) => issues.extend(e),
            }
        } else {
            let diag = core::schema::Diag::new(&origin);
            if let Some(f) = core::v1::ThemeFile::parse(&text, &diag) {
                let r = resolver::resolve_layers("file", &[core::layer::Layer::from_v1(f)], &A11y::default());
                issues.extend(r.issues);
            }
            issues.extend(diag.take());
        }
    }
    print_issues(&issues);
    let errors = issues.iter().filter(|i| i.severity == Severity::Error).count();
    if errors > 0 { Err(format!("{errors} error(s)")) } else {
        println!("ok ({} warning(s))", issues.len());
        Ok(())
    }
}

fn bench() -> Result<(), String> {
    let t = std::time::Instant::now();
    let reg = Registry::load();
    let load = t.elapsed();
    let s = core::suite();
    let n = 200;
    let t = std::time::Instant::now();
    for _ in 0..n {
        let _ = resolver::resolve(&reg, &s, Scope::System, &A11y::default());
    }
    let per = t.elapsed() / n;
    let t = std::time::Instant::now();
    for e in reg.entries() {
        let _ = resolver::resolve_id(&reg, &e.meta.id, None, &A11y::default());
    }
    let all = t.elapsed();
    let t = std::time::Instant::now();
    let r = resolver::resolve(&reg, &s, Scope::System, &A11y::default());
    let snap = serde_json::to_vec(&core::snapshot::Snapshot::from_resolved(&r, 0, "bench")).unwrap_or_default();
    let ser = t.elapsed();
    println!("registry load ({} themes): {load:?}", reg.entries().len());
    println!("resolve system theme: {per:?} each ({n} runs)");
    println!("resolve every theme: {all:?}");
    println!("resolve + snapshot JSON ({} bytes): {ser:?}", snap.len());
    Ok(())
}
