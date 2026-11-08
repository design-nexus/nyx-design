//! builtin-themes.json is every built-in theme as this library resolves it;
//! regenerate it with `nyx-theme builtin-json > crates/nyx-theme-core/builtin-themes.json`.

#[test]
fn builtin_json_is_current() {
    let path = std::path::Path::new(env!("CARGO_MANIFEST_DIR")).join("builtin-themes.json");
    let file = std::fs::read_to_string(&path).expect("builtin-themes.json exists");
    assert!(
        file == nyx_theme_core::snapshot::builtin_json(),
        "{} is out of date: run `cargo run -p nyx-theme-cli -- builtin-json > crates/nyx-theme-core/builtin-themes.json`",
        path.display()
    );
}
