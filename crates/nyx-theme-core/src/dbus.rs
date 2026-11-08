//! The theme's D-Bus contract. The theme service (`nyx-themed`) owns
//! [`BUS_NAME`] and serves [`INTERFACE`] at [`PATH`]. Any process that changes a
//! theme choice may also emit [`SIGNAL`] there itself, so clients hear about
//! changes on Omarchy and while the service is down; they subscribe by interface
//! and path, not by sender.
//!
//! `ThemeChanged(t generation, s system_theme, s scope, s reason, u schema)`:
//! `scope` is `system`, `shell`, `app:<id>` or `applications`; a client fetches
//! or resolves the new theme itself. A client applies a generation once and
//! ignores any older than the last it applied.

pub const BUS_NAME: &str = "io.github.design_nexus.nyx.Theme";
pub const PATH: &str = "/io/github/design_nexus/nyx/Theme";
pub const INTERFACE: &str = "io.github.design_nexus.nyx.Theme1";
pub const SIGNAL: &str = "ThemeChanged";

/// One change, as the signal carries it.
#[derive(Debug, Clone, PartialEq, Eq, serde::Serialize, serde::Deserialize)]
#[cfg_attr(feature = "dbus", derive(zbus::zvariant::Type))]
pub struct ChangeEvent {
    pub generation: u64,
    pub system_theme: String,
    pub scope: String,
    pub reason: String,
    pub schema: u32,
}

#[cfg(feature = "dbus")]
mod bus {
    use super::*;

    /// Announce a change on the session bus.
    pub fn emit(event: &ChangeEvent) -> zbus::Result<()> {
        let conn = zbus::blocking::Connection::session()?;
        conn.emit_signal(
            None::<&str>,
            PATH,
            INTERFACE,
            SIGNAL,
            &(event.generation, event.system_theme.as_str(), event.scope.as_str(), event.reason.as_str(), event.schema),
        )
    }

    /// Whether the theme service is on the bus.
    pub fn service_running() -> bool {
        let Ok(conn) = zbus::blocking::Connection::session() else { return false };
        let Ok(proxy) = zbus::blocking::fdo::DBusProxy::new(&conn) else { return false };
        zbus::names::BusName::try_from(BUS_NAME).ok().and_then(|n| proxy.name_has_owner(n).ok()).unwrap_or(false)
    }

    /// Call `f` for every change until it returns false. Blocks.
    pub fn watch(mut f: impl FnMut(ChangeEvent) -> bool) -> zbus::Result<()> {
        let conn = zbus::blocking::Connection::session()?;
        let rule = zbus::MatchRule::builder()
            .msg_type(zbus::message::Type::Signal)
            .interface(INTERFACE)?
            .path(PATH)?
            .member(SIGNAL)?
            .build();
        let iter = zbus::blocking::MessageIterator::for_match_rule(rule, &conn, Some(16))?;
        for msg in iter {
            let Ok(msg) = msg else { continue };
            let Ok((generation, system_theme, scope, reason, schema)) = msg.body().deserialize::<(u64, String, String, String, u32)>() else {
                continue;
            };
            if !f(ChangeEvent { generation, system_theme, scope, reason, schema }) {
                break;
            }
        }
        Ok(())
    }
}

#[cfg(feature = "dbus")]
pub use bus::{emit, service_running, watch};
