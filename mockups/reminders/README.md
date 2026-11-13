# Nyx Reminders: mockups

A simpler Reminders (Rust, GTK4, Nyx Design 2.0) with nothing taken away. Open `index.html`
for the gallery, or `screens.html?screen=<name>&theme=dark|light` (add `&w=800` for the tiled
width). `./render.sh` re-renders every shot into `shots/` with headless Chromium;
`./render.sh NAME…` renders only those. The pages carry their own copy of the 2.0 look
(`tokens.css`, `mock.css`, `mock.js`, `nyx-after.css`); `kit.css` and `kit.js` hold the
window parts shared with the Contacts and Notes galleries, `reminders.*` this app's.

## What changes from today

- **One search, in the header.** Quick add moves to the top of the list. Its preview shows
  what it understood (date, repeat, #tags) as chips and names the list it goes to, with a
  chip to pick another (today it's the default list, unnamed).
- **Smart lists as tiles** with counts (Today, Scheduled, Flagged, All), then Completed with
  its count too. Account lists below; one Accounts row replaces the "+" and "Online
  accounts" buttons. Sync or offline state shows once, at the sidebar's foot.
- **Rows:** checkbox, title, then chips for when (red when overdue), repeat, list (on smart
  lists), #tags and the start of the notes. A flag icon for flagged (not a star), and a thin
  coloured bar for priority instead of `!!!`.
- **Page bar:** the page's name and date, Show completed (was only in Settings) and the
  order (By date or Manual; drag to reorder in Manual).
- **Details as an inspector:** every field always shown — Date, Time (a dropdown, not free
  text), Repeat and Alert, then List (move it to another list), Priority, Flagged, Tags and
  Link — subtasks that open, "From" as a labelled Mail link, Delete as a labelled button.
- **Scheduled** is grouped by Overdue, Today, Tomorrow, This week and Later; Completed by day.
- **Right-click** gains Move to list. **Empty states** say what to do; a search with no
  matches says so and offers to search every list.

## Other ideas

- Rows that open in place (Things-style) instead of an inspector.
- Today as a day at a glance: counts, then the day by morning, evening and any time.
