import QtQuick
import Quickshell
import Quickshell.Wayland
import Nyx.Ui
import Nyx.PluginView

// Plugin views drawn by Nyx.PluginView, for screenshots (VIEW_SCREEN=HEADLESS-N).
// Prints events; patches the CPU label after a second.
ShellRoot {
    PanelWindow {
        screen: Quickshell.screens.find(s => s.name === Quickshell.env("VIEW_SCREEN")) || null
        visible: screen !== null
        anchors.top: true
        anchors.left: true
        implicitWidth: 760
        implicitHeight: 520
        color: Style.bg
        WlrLayershell.layer: WlrLayer.Top
        WlrLayershell.keyboardFocus: WlrKeyboardFocus.None
        WlrLayershell.namespace: "nyx-plugin-view-test"

        Row {
            x: 20; y: 20; spacing: 20
            Card {
                width: 340; height: 220
                PluginView {
                    id: cpu
                    anchors.fill: parent
                    view: ({ node: "box", orientation: "vertical", spacing: 8, align: "fill", children: [
                        { node: "box", spacing: 8, children: [
                            { node: "icon", name: "utilities-system-monitor-symbolic", size: 18, color: "accent" },
                            { node: "label", id: "pct", text: "CPU 12%", font_size: 15 },
                            { node: "label", text: "<span size=\"small\" foreground=\"dim_text\">4 cores</span>", markup: true, expand: true },
                            { node: "badge", text: "hot", class: ["warning"] } ] },
                        { node: "graph", id: "g", values: [3, 5, 9, 4, 12, 20, 15, 8, 30, 22], style: "bars", height: 40 },
                        { node: "graph", values: [3, 5, 9, 4, 12, 20, 15, 8, 30, 22], height: 30, color: "success" },
                        { node: "progress", value: 0.4 },
                        { node: "box", spacing: 6, children: [
                            { node: "button", label: "Restart", action: "restart" },
                            { node: "button", icon: "view-refresh-symbolic", action: "refresh", tooltip: "Refresh" },
                            { node: "spinner" } ] } ] })
                    onViewEvent: (kind, control, value) => console.log("EVENT", kind, control, JSON.stringify(value))
                }
            }
            Card {
                width: 360; height: 220
                PluginView {
                    anchors.fill: parent
                    view: ({ node: "box", orientation: "vertical", spacing: 6, align: "fill", children: [
                        { node: "row", icon: "weather-few-clouds-symbolic", title: "Toronto", subtitle: "12° partly cloudy", action: "open" },
                        { node: "toggle", id: "t", label: "Notify me", active: true },
                        { node: "slider", id: "s", value: 40, icon: "audio-volume-medium-symbolic" },
                        { node: "separator" },
                        { node: "entry", id: "e", placeholder: "Host to ping" } ] })
                }
            }
        }
        Row {
            x: 20; y: 260; spacing: 20
            Card {
                width: 160; height: 160
                PluginView {
                    anchors.fill: parent
                    view: ({ node: "overlay", children: [
                        { node: "vector", view_box: [0, 0, 24, 24], commands: [
                            { op: "circle", cx: 12, cy: 12, r: 9, stroke: "track", width: 3 },
                            { op: "arc", cx: 12, cy: 12, r: 9, start: -90, end: 135, stroke: "accent", width: 3, round: true },
                            { op: "path", d: "M9 8 L16 12 L9 16 Z", fill: { linear: { x1: 9, y1: 8, x2: 16, y2: 16, stops: [[0, "accent"], [1, "success"]] } } } ] },
                        { node: "label", text: "62%", font_size: 13 } ] })
                }
            }
            Card {
                width: 360; height: 160
                PluginView {
                    anchors.fill: parent
                    view: ({ node: "stack", show: "b", children: [
                        { node: "label", id: "a", text: "first" },
                        { node: "box", id: "b", orientation: "vertical", children: [
                            { node: "label", text: "<b>Bold</b> and <i>italic</i> and <span weight=\"bold\" foreground=\"#f38ba8\">red</span>", markup: true },
                            { node: "label", text: "Hover me", tooltip: "A tooltip", hover: { color: "accent", background: "hover" }, margin: [4, 8, 4, 8] } ] } ] })
                }
            }
        }
        Timer { interval: 1000; running: true; onTriggered: cpu.patch([{ id: "pct", set: { text: "CPU 87%", color: "danger" } }, { id: "g", set: { values: [30, 25, 20, 15, 10, 5] } }]) }
    }
}
