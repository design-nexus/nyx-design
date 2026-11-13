# Nyx Notes: mockups

A simpler Notes (Rust, GTK4, Nyx Design 2.0) with nothing taken away. Open `index.html` for
the gallery, or `screens.html?screen=<name>&theme=dark|light` (add `&w=800` for the tiled
width). `./render.sh` re-renders every shot into `shots/` with headless Chromium;
`./render.sh NAME…` renders only those. `kit.css` and `kit.js` are shared with the Reminders
and Contacts galleries, `notes.*` are this app's. Notes' accent is amber.

## What changes from today

- **One way to do anything:** the header's field is a command palette ("Go to a note or do
  anything", Ctrl+K) for notes, headings, tags and every command. The ⋯ menu shrinks to Note,
  View and Vault groups; nothing is lost, the rest is in the palette.
- **A note list** beside the editor (title, snippet, date, folder; pinned first). It also
  shows search results, with matches highlighted and the query as chips (`tag:`, `path:`,
  `after:`).
- **Sidebar:** the vault switcher, Recent, Pinned, Daily notes, the folder tree, tags as
  chips, sync state at the foot. At 800 px it hides, per STYLE.md.
- **Editor:** the reading column, with Source, Live and Read as a switch above it and the
  note's place as a breadcrumb with its save dot. Formatting floats over a selection.
- **No status bar.** Words, reading time, tasks and save state move to the Info tab, with
  properties and the file path.
- **Inspector tabs:** Outline (headings, backlinks), Links (links from here, mentions not yet
  linked, with Link it), Info, and Assist when it's on.
- **Graph, Collections, Canvas, Projects and History open as tabs**, not 1050×760 windows.
  History is a timeline and the change, with Restore the checked lines or the whole version.
- **Assist** (local AI) proposes edits in the inspector: Apply, Try again or Discard.
- **Sync conflicts** show both versions side by side with Keep this or Keep both.
- **First run** is one card: choose a folder, create a vault, reopen a recent one, or open a
  single file — instead of the welcome page and the Connect dialog at once.

## Other ideas

- B: today's tree-only layout, cleaned up (no note list).
- C: a Library home with pinned, recent and saved searches when the vault opens.
