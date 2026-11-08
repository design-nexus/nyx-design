// A Quickshell test component for the Nyx.Theme module: every colour token as a
// swatch, the typography roles, and the generation on screen, all following live.
// It opens only on the output named in NYX_TEST_OUTPUT (a headless test output),
// takes no keyboard focus, and shows nothing if that output isn't there.
//
//   NYX_TEST_OUTPUT=HEADLESS-2 QML_IMPORT_PATH=$PWD/qml qs -p qml/tests/theme-preview

import QtQuick
import Quickshell
import Quickshell.Wayland
import Nyx.Theme

ShellRoot {
    id: root
    readonly property string target: Quickshell.env("NYX_TEST_OUTPUT") || ""

    Variants {
        model: Quickshell.screens

        Scope {
            id: perScreen
            required property var modelData

            LazyLoader {
                active: root.target !== "" && perScreen.modelData.name === root.target

                PanelWindow {
                    screen: perScreen.modelData
                    anchors { top: true; bottom: true; left: true; right: true }
                    exclusionMode: ExclusionMode.Ignore
                    WlrLayershell.layer: WlrLayer.Top
                    WlrLayershell.keyboardFocus: WlrKeyboardFocus.None
                    WlrLayershell.namespace: "nyx-theme-test"
                    color: NyxTheme.colors.surface.primary
                    Behavior on color { ThemeTransition {} }

                    Column {
                        x: NyxTheme.spacing.xl
                        y: NyxTheme.spacing.xl
                        spacing: NyxTheme.spacing.md

                        Text {
                            text: NyxTheme.theme.name + "  ·  generation " + NyxTheme.generation + (NyxTheme.live ? "" : "  (built-in fallback)")
                            color: NyxTheme.colors.text.primary
                            font.pixelSize: NyxTheme.typography.display.size
                            font.weight: NyxTheme.typography.display.weight
                            font.family: NyxTheme.typography.display.family
                        }
                        Text {
                            text: "Secondary text on the primary surface; motion " + NyxTheme.motion.normal + " ms" + (NyxTheme.motion.reduced ? " (reduced)" : "")
                            color: NyxTheme.colors.text.secondary
                            font.pixelSize: NyxTheme.typography.body.size
                            font.family: NyxTheme.typography.body.family
                        }

                        Grid {
                            columns: 6
                            spacing: NyxTheme.spacing.sm
                            Repeater {
                                model: Object.keys(NyxTheme.snapshot.tokens.colors)
                                Rectangle {
                                    required property string modelData
                                    width: 190
                                    height: 52
                                    radius: NyxTheme.radius.medium
                                    color: NyxTheme.qmlColor(NyxTheme.snapshot.tokens.colors[modelData])
                                    border.width: NyxTheme.geometry.border_width
                                    border.color: NyxTheme.colors.border.default
                                    Behavior on color { ThemeTransition {} }
                                    Text {
                                        anchors.centerIn: parent
                                        text: parent.modelData
                                        color: Qt.colorEqual(parent.color, NyxTheme.colors.text.primary) ? NyxTheme.colors.surface.primary : NyxTheme.colors.text.primary
                                        font.pixelSize: NyxTheme.typography.caption.size
                                        style: Text.Outline
                                        styleColor: NyxTheme.colors.surface.primary
                                    }
                                }
                            }
                        }

                        Rectangle {
                            width: 260
                            height: NyxTheme.geometry.control_height
                            radius: NyxTheme.radius.small
                            color: NyxTheme.colors.accent.primary
                            Behavior on color { ThemeTransition {} }
                            Text {
                                anchors.centerIn: parent
                                text: "Accent button"
                                color: NyxTheme.colors.text.onAccent
                                font.pixelSize: NyxTheme.typography.label.size
                                font.weight: NyxTheme.typography.label.weight
                            }
                        }
                    }
                }
            }
        }
    }
}
