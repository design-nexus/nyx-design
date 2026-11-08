# Theme Engine 2.0: performance

Measured November 7, 2026 on the development laptop (release builds), with
scratch XDG folders and a private session bus (`dbus-run-session`). The numbers are baselines for later thresholds, not
thresholds themselves. Re-run with `nyx-theme bench` and the script below.

## Resolution (`nyx-theme bench`)

| What | Time |
|---|---|
| Load the registry (17 built-in themes, no user themes) | 0.36 ms |
| Resolve the system theme | 31 µs |
| Resolve every theme | 0.26 ms |
| Resolve and serialise the snapshot (3 KB of JSON) | 70 µs |

With 30 imported Omarchy themes installed, a debug build loads the registry in
about 2 ms; registry loading grows with the number of installed themes (one
manifest read each).

## Theme service (`nyx-themed`)

| What | Result |
|---|---|
| Memory after start | 7.2 MB RSS |
| Memory after 20 switches | 7.4 MB RSS |
| CPU while idle (10 s) | 0 ticks: it sleeps on inotify and the bus, never polls |

## Switching

| What | Result |
|---|---|
| `nyx-theme set` until a client receives `ThemeChanged` | 3–5 ms (10 runs) |
| 10 changes issued back to back | 11 announcements, increasing generations, the snapshot ends on the last choice |
| GTK apps | restyle within the 120 ms coalescing window after the event; an identical sheet is not reloaded |
| QML module | the `FileView` reload after the snapshot rename; visible change on the next frame (checked on a headless output) |

Before 2.0 every GTK app polled the theme files once a second, so a change took
up to a second and every app woke up once a second forever.

## Reproducing

```sh
cargo build --release -p nyx-theme-cli            # in nyx-design
cargo build --release -p nyx-themed               # in nyx-system
dbus-run-session -- scripts/theme-perf.sh         # in nyx-design, beside a nyx-system checkout
```

The script starts `nyx-themed --no-outputs` in scratch folders, samples
`/proc/<pid>/status` and `/proc/<pid>/stat`, times `nyx-theme set` against
`nyx-theme watch`, then issues ten changes without waiting.
