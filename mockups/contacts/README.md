# Nyx Contacts: mockups

A simpler Contacts (Rust, GTK4, Nyx Design 2.0) with nothing taken away. Open `index.html`
for the gallery, or `screens.html?screen=<name>&theme=dark|light` (add `&w=800` for the tiled
width). `./render.sh` re-renders every shot into `shots/` with headless Chromium;
`./render.sh NAME…` renders only those. `kit.css` and `kit.js` are shared with the Reminders
and Notes galleries, `contacts.*` are this app's.

## What changes from today

- **Header:** search in the centre and a labelled "+ New"; the Edit button and the ten-item
  "…" menu go. Each action moves to where it applies.
- **Sidebar:** All contacts and Favorites; Lists with + on its heading; Accounts with each
  book's sync state and a read-only mark; Tidy up for Birthdays (its count matches its view)
  and Duplicates (shown with a badge when there are any). Sync state at the foot.
- **List:** avatars (photo or coloured initials), letter headings, a favourite star.
  Checkboxes show for multiple selection, with a bar of what can be done to them: Add to
  list, Email, Export, Delete.
- **Details:** a large header with Email, Call, Message, Edit and More; fields as card rows
  whose Copy, Email, Call or Map show on hover; birthday with age and countdown; lists as
  chips you add or remove in place; notes.
- **Edit in place** instead of a 600×720 dialog: first, last, company and job title up top,
  "More name fields" folded, label dropdowns with single-line values, a birthday date
  picker (with "No year"), lists as chips, Delete with Cancel and Save.
- **A list's menu** holds only what applies to it: Email everyone, Export, Rename, Colour,
  Delete this list (its people stay).
- **Duplicates** side by side: choose per field where they differ; every email, phone and
  list is kept; "Not the same person" dismisses the pair.
- **Import preview** with a checkbox per person, showing who updates someone you have and
  who looks like a duplicate.

## Other ideas

- Favorites as cards, one click from Email, Call or Message.
