# Nyx Git: mockups

Mockups for cleaning up Nyx Git's whole UI (Rust, GTK4, Nyx Design 2.0) before the app
changes. The content is nyx-git's own: its commits, its files and the diff behind the last
header change, with the worktrees, branches, agents and requests Flow and Review would show
around it. Nothing outside this folder changed.

**Chosen:** direction **A** (centred destinations), with the header's search opening the Go to palette (Ctrl+Shift+P) rather than taking a large field. Built in nyx-git as `ui::header`, `ui::pagebar`, `ui::inspector`, `ui::changes` and the sidebar.

Open `index.html` for a gallery of every shot, or a page directly: `directions.html` and
`screens.html` take `?screen=<name>&theme=dark|light`, plus `&w=800` for the tiled width and
`&legend=1` on Flow. Each page has a switcher at the bottom (left out of shots).

`./render.sh` re-renders every shot into `shots/` with headless Chromium (nothing opens on
screen); `./render.sh screens` renders one page and `./render.sh div` the divider-line shots. Windows are 1280 × 800 (the default size),
with Changes, History and Flow also at 800 × 800 (tiled). The pages use the polish mockups'
2.0 look (`../polish/tokens.css`, `mock.css`, `mock.js`, `nyx-after.css`); `git.js` and
`git.css` add Git's parts. Git has no accent of its own, so it takes the theme's.

## What changes from today

- **Header:** the app, then the repository and branch as switchers (Ctrl+K,
  Ctrl+Shift+B), the five destinations centred in equal segments, and on the right only
  Sync (one split button with ↓behind ↑ahead), Search, ⋯ and Settings. The readout, the
  three sync buttons, Refresh and the per-page search slot go. Nothing beside the
  destinations changes width, so they never move.
- **Sidebar:** Worktrees, Branches, Remotes, Tags and Stashes as `nyx_ui::sidebar` groups
  with `+`, counts (commits ahead) and dots (changes, an agent working or waiting). No
  "Manage…" buttons; recent repositories move to the repository switcher. The repository
  tab row shows only with two or more repositories open.
- **Every page:** one page bar (filters, a search field with its key, page actions) and
  one inspector (title, key and value rows, group labels, action rows with one primary).
- **Changes:** files grouped by state with status chips and a hover stage button, the diff
  with its own bar (Unified or Split, Stage lines, Discard), the composer as a card with a
  summary and a description. The File details text and its seven buttons go.
- **History:** ref chips by kind, hash, author and time columns, the commit in the
  inspector with its message, files and diff.

## Divider lines (a 2.0 change)

2.0 draws the header, sidebar and page on one surface with no line between them. These
shots try a thin line that sets the main body off from the header and sidebar, which stay
one surface. Any screen takes `&div=a|b|c|d` (the live switcher has the links), and
`./render.sh div` renders only these shots. The line is `--divider-line`, 1 px of `text`
at 9% (dark) or 11% (light), a step stronger than `--hair`.

- **A. Edge lines** (suggested): the page's top and left edges, square corner. The line
  under the header starts where the sidebar ends; with no sidebar it runs the full width.
- **B. Rounded corner:** the same lines, curving at the page's top-left corner (12 px).
- **C. Inset sheet:** the line on all four sides, rounded, 8 px clear of the window's
  right and bottom edges.
- **D. Edge lines and columns:** A, plus the same line between a page's columns (Changes'
  files and diff, the inspector, Review's list).

| Shot | Shows |
| --- | --- |
| `screens-changes-div-a` … `-div-d`, `screens-history-div-a` … `-div-d` | Changes and History in each of the four directions, beside `screens-changes` and `screens-history` (no lines). |
| `screens-flow-div-a`, `-review-`, `-activity-`, `-rebase-`, `-none-div-a` | Other screens in A; `none` has no sidebar, so only the line under the header. |
| `screens-changes-800-div-a`, `screens-history-800-div-a` | Tiled at 800 px: the icon rail keeps the line. |

## Shots

Every shot comes in `-dark` and `-light`.

| Shot | Shows |
| --- | --- |
| `directions-a` | **A. Centred destinations** (suggested). Switchers on the left, Flow, Changes, History, Review and Activity in the middle, Sync, Search, ⋯ and Settings on the right; the sidebar navigates worktrees and branches. |
| `directions-b` | **B. Destinations in the sidebar.** The five destinations are the sidebar's first group; the header's middle is the command field (Ctrl+Shift+P). |
| `directions-c` | **C. Command field, tabs below.** A wide "Go to…" field in the header; the destinations as a tab row under it. |
| `directions-before` | Today's header and Changes, for comparison. |
| `screens-flow` | Branches by ancestry from main, their worktrees as strips, Claude Code working and Codex waiting, requests with checks, a dotted shared-files line; the branch's inspector with Open worktree as the one primary action. |
| `screens-flow-legend` | The ? button's legend: ancestry, request, shared files, an action about to be taken. |
| `screens-changes` | Staged, Changes and Untracked groups; `style.css` selected, `sidebar.rs` hovered with its stage button; the diff of the header change with word highlights; the composer. |
| `screens-changes-split` | The same diff side by side. |
| `screens-changes-rebase` | A rebase stopped to split a commit: the branch chip says "rebasing", a banner with Abort, Skip and Continue, a conflicted file with Conflict Studio. |
| `screens-history` | ui/header-polish's three commits above main's tip, ref and tag chips, the selected commit in the inspector. |
| `screens-timeline` | main, ui/header-polish and feature/review-checks along time. |
| `screens-review` | Four requests with checks, approvals and drafts; #48 open with its checks, review, commits and files, and Merge as the primary action. |
| `screens-review-empty` | No hosting account: Connect an account. |
| `screens-activity` | Today and Yesterday; Nyx Git's records and Git's reflog as chips; the inspector with the references moved and recovery as making a branch. |
| `screens-rebase` | Rebase Studio: pick, reword (with its new message), split (being dragged), squash and fixup folded under their commit, drop; the proposed history, published commits, a likely conflict, a tag left behind. |
| `screens-conflicts` | Conflict Studio: unresolved and resolved files, Base, Ours and Theirs, the result with its markers, one segmented choice per conflict, Mark resolved. |
| `screens-repo-switcher` | Open, Favorites and Recent repositories with their branch and state; Open, Clone, New. |
| `screens-branch-switcher` | Local branches with ahead and behind and their worktrees, remote branches, New branch. |
| `screens-sync-menu` | Push 2 commits, Pull (already up to date), Fetch, Fetch all, Remotes, with their keys. |
| `screens-empty-repo` | A repository with no commits: go to Changes for the first one. |
| `screens-none` | No repository open: Open, Clone, New, and recent repositories. |
| `screens-settings` | The settings card: Repositories (clone folder, background fetch, open on, watching), Agents, then History, Changes, Accounts and the standard groups. |
| `screens-changes-800`, `screens-history-800`, `screens-flow-800` | Tiled at 800 px: the icon rail, icon-only destinations, no inspector beside History, Flow zoomed to fit. |
