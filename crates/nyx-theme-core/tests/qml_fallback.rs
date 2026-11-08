//! The QML module's built-in fallback is the default theme as this library
//! resolves it; regenerate it with `nyx-theme qml-fallback > qml/Nyx/Theme/fallback.js`.

#[test]
fn qml_fallback_is_current() {
    let path = std::path::Path::new(env!("CARGO_MANIFEST_DIR")).join("../../qml/Nyx/Theme/fallback.js");
    let file = std::fs::read_to_string(&path).expect("qml/Nyx/Theme/fallback.js exists");
    assert!(
        file == nyx_theme_core::snapshot::fallback_js(),
        "{} is out of date: run `cargo run -p nyx-theme-cli -- qml-fallback > qml/Nyx/Theme/fallback.js`",
        path.display()
    );
}
