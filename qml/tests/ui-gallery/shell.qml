import QtQuick
import Quickshell
import Quickshell.Wayland
import Nyx.Ui

// Every Nyx.Ui control on one surface, for screenshots:
//   QML_IMPORT_PATH=…/nyx-design/qml GALLERY_SCREEN=HEADLESS-N qs -p qml/tests/ui-gallery/shell.qml
ShellRoot {
    PanelWindow {
        id: win
        screen: Quickshell.screens.find(s => s.name === Quickshell.env("GALLERY_SCREEN")) || null
        visible: screen !== null
        anchors.top: true
        anchors.left: true
        implicitWidth: 900
        implicitHeight: 640
        color: Style.bg
        WlrLayershell.layer: WlrLayer.Top
        WlrLayershell.keyboardFocus: WlrKeyboardFocus.None
        WlrLayershell.namespace: "nyx-ui-gallery"

        Row {
            x: 24
            y: 24
            spacing: 24
            Surface {
                width: 380
                height: 590
                Column {
                    x: 16
                    y: 16
                    width: parent.width - 32
                    spacing: 12
                    Label { text: "Quick settings"; role: "title" }
                    Label { text: "Connections"; role: "group"; color: Style.tertiary }
                    Row {
                        spacing: 8
                        SplitTile { width: 170; icon: "network-wireless-symbolic"; title: "Wi-Fi"; subtitle: "Home"; active: true }
                        SplitTile { width: 170; icon: "bluetooth-active-symbolic"; title: "Bluetooth"; subtitle: "Off" }
                    }
                    Row {
                        spacing: 8
                        SplitTile { compact: true; width: 48; icon: "notifications-disabled-symbolic"; active: true }
                        SplitTile { compact: true; width: 48; icon: "night-light-symbolic"; busy: true }
                    }
                    Slider { width: parent.width; icon: "audio-volume-high-symbolic"; value: 62 }
                    Slider { width: parent.width; icon: "display-brightness-symbolic"; value: 30 }
                    Separator { width: parent.width }
                    ListRow { width: parent.width; icon: "network-wireless-signal-good-symbolic"; title: "Home network"; subtitle: "Connected, secured"; selected: true; Badge { text: "5G" } }
                    ListRow { width: parent.width; icon: "network-wireless-signal-ok-symbolic"; title: "Café"; Toggle { checked: true } }
                    ListRow { width: parent.width; icon: "network-wireless-signal-weak-symbolic"; title: "Neighbour"; Toggle {} }
                    SearchField { width: parent.width; hint: "Ctrl F" }
                    Segmented { width: parent.width; options: [{id: "a", label: "Saver"}, {id: "b", label: "Balanced"}, {id: "c", label: "Performance"}]; current: "b" }
                    ProgressBar { width: parent.width; value: 0.64 }
                }
            }
            Column {
                spacing: 16
                Row {
                    spacing: 8
                    IconButton { icon: "edit-symbolic" }
                    IconButton { icon: "view-pin-symbolic"; toggled: true }
                    IconButton { icon: "list-add-symbolic"; primary: true }
                    IconButton { icon: "user-trash-symbolic"; danger: true }
                    Spinner { size: 20; anchors.verticalCenter: parent.verticalCenter }
                    Badge { text: "12"; anchors.verticalCenter: parent.verticalCenter }
                    Badge { text: "!"; tone: "warning"; anchors.verticalCenter: parent.verticalCenter }
                }
                Row {
                    spacing: 8
                    Button { text: "Cancel" }
                    Button { text: "Connect"; primary: true }
                    Button { text: "Forget"; danger: true; armed: true }
                    Button { text: "Settings"; icon: "emblem-system-symbolic"; flat: true }
                }
                Card {
                    width: 420
                    height: 120
                    StateView { anchors.fill: parent; text: "No notifications"; icon: "notifications-symbolic" }
                }
                Card {
                    width: 420
                    height: 120
                    StateView { anchors.fill: parent; kind: "error"; text: "Can't reach NetworkManager"; actionText: "Try again" }
                }
                Item {
                    id: menuAnchor
                    width: 420
                    height: 40
                    Label { text: "Menu below (opened at start)"; dim: true }
                }
            }
        }
        Menu {
            id: menu
            anchorItem: menuAnchor
            entries: [{heading: "Firefox"}, {id: "new", label: "New Window", icon: "window-new-symbolic", keys: "Ctrl N"}, {id: "pin", label: "Keep in Dock", checked: true}, {separator: true}, {id: "quit", label: "Quit", danger: true, icon: "application-exit-symbolic"}, {id: "off", label: "Unavailable", enabled: false}]
        }
        Timer { interval: 400; running: true; onTriggered: menu.openAt(0, 30) }
    }
}
