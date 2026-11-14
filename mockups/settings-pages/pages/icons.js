// Round 3: the round-2 pages with Umbra's icons in place of the solid coloured squares. Each
// look is a class on the page (?look=…, styles in shell.css) with Umbra's own line glyphs, so
// any page here can be drawn in it.
(() => {
  const at = (look, list) => list.map(([s, title, src]) => [s, title, "", `${src}?look=${look}`]);
  REG("icons", {
    name: "Umbra icons",
    summary: "The section and row icons drawn the way Umbra draws its icons, with Umbra's own glyphs, instead of solid squares with a white symbol. Settings would follow the Umbra look you've chosen (yours is Tile), so the four looks are shown; the switches here are still today's (see Switches).",
    problems: [
      "<b>Solid squares shout:</b> nine saturated tiles down the sidebar are brighter than anything on the page, and the section colours compete with the content.",
      "<b>Not the icon set you use:</b> the glyphs are the mockups' own; the files, folders and apps around Settings are drawn by Umbra.",
      "<b>Two kinds of tile:</b> bright squares in the sidebar and soft tinted ones in the rows, side by side on every page.",
    ],
    today: [["../shots/audio-a-eq-dark", "Before: solid squares", "Sound A as drawn in round 2"], ["../shots/home-a-dash-dark", "Before: Home", "Home A as drawn in round 2"]],
    options: [
      { id: "a", name: "Umbra Tile (your look)", idea: "Each icon sits on a satin tile made from the background, with a glow of its section's colour at the top left, a hairline rim of it and the glyph in it, as Umbra Tile draws folders and apps. The sidebar's sections and the icons in rows are the same kind of tile, so the page reads as one set.",
        shots: at("tile", [["a-home", "Home", "home/a-dash"], ["a-sound", "Hardware › Sound", "audio/a-eq"], ["a-wifi", "Connections › Wi-Fi", "wifi/a-list"], ["a-network", "Connections › Network", "network/a-path"], ["a-theme", "Personalization › Appearance", "theme/a"], ["a-home-800", "Home at 800 px", "home/a-dash"]]) },
      { id: "b", name: "Umbra Tinted", idea: "The same satin tile washed in each section's colour, a little warmer and easier to tell apart at a glance than Tile, still far quieter than a solid square.",
        shots: at("tinted", [["b-sound", "Hardware › Sound", "audio/a-eq"], ["b-home", "Home", "home/a-dash"]]) },
      { id: "c", name: "Umbra Frame", idea: "No satin: an outline in the section's colour over a faint wash of it, the lightest of the tiles; it suits light themes especially.",
        shots: at("frame", [["c-sound", "Hardware › Sound", "audio/a-eq"], ["c-wifi", "Connections › Wi-Fi", "wifi/a-list"]]) },
      { id: "d", name: "Umbra Line", idea: "The coloured glyphs alone, with no tile: the calmest sidebar, where the section colour is only in the line.",
        shots: at("line", [["d-sound", "Hardware › Sound", "audio/a-eq"], ["d-home-800", "Home at 800 px", "home/a-dash"]]) },
    ],
    pages: {},
  });
})();
