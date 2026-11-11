//! The snapshot's writers while the theme service runs (a process of its own, as it
//! sets `XDG_RUNTIME_DIR`).

use nyx_theme_core::{A11y, Registry, resolver, snapshot};

#[test]
fn only_a_running_theme_service_holds_the_snapshot() {
    let dir = std::env::temp_dir().join(format!("nyx-theme-service-{}", std::process::id()));
    std::fs::create_dir_all(dir.join("nyx/theme")).unwrap();
    unsafe { std::env::set_var("XDG_RUNTIME_DIR", &dir) };
    let r = resolver::resolve_id(&Registry::builtin(), "nord", None, &A11y::default()).unwrap();

    // A service that has gone: anyone may write.
    std::fs::write(dir.join("nyx/theme/service"), "999999999").unwrap();
    assert!(!snapshot::service_running());
    assert!(snapshot::publish(&r, "test", false).unwrap().changed);

    // The service itself writes.
    snapshot::claim_service().unwrap();
    assert!(!snapshot::service_running(), "this process is the service");
    assert!(snapshot::publish(&r, "test", true).unwrap().changed);
    let _ = std::fs::remove_dir_all(dir);
}
