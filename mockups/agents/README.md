# Nyx Agents: mockups

A simpler Nyx Agents (Rust, GTK4, Nyx Design 2.0) with nothing taken away. The window is
on the 2.0 frame: the header and sidebar one surface, the tabs and terminals in an inset
sheet.

Open `index.html` for a gallery of every shot, or `screens.html?screen=<name>&theme=dark|light`
for one page (a switcher at the bottom, left out of shots). `./render.sh` re-renders every
shot into `shots/` with headless Chromium (nothing opens on screen); `./render.sh NAME…`
renders only those. Windows are 1280 × 800. The pages carry their own copy of the polish
mockups' 2.0 look (`tokens.css`, `mock.css`, `mock.js`, `nyx-after.css`); `agents.js` and
`agents.css` add Agents' parts.

## What changes from today

- **One thing to manage: a session.** An agent, a terminal, a worktree and a desktop are
  things a session has. Agents are named in full ("Claude Code", "Terminal"), never by id.
- **One way to stop, one way out.** Stop while it runs; pressed again, or when the agent
  ignores it, Force stop. Once it ends: Resume or Discard. Discard replaces Forget and asks
  once, with the worktree included when it has one. Closing a tab only hides the session.
- **Never stuck.** A start that fails says so ("didn't start", with the log), with Try
  again and Discard. Stop always ends a session, even one whose program never started or
  whose holder went away.
- **Sidebar:** Needs you, Active, Recent, then History. Each row has the agent and what it
  is doing under its title. Projects go; recent folders are one click away in New.
- **Session bar:** the title (click to rename), its state, the agent, branch and folder,
  Stop, and More. More holds what the six icon buttons did: Find, Terminal beside and
  below, Subagents, Open in Nyx Git, Copy folder path, Rename, Force stop and Discard.
- **New session:** the agents, the folder with recent ones as chips, Own worktree and Own
  desktop (offered only to agents that can drive it), and Start. The choices are kept.
- **Nothing open:** the installed agents as tiles; one click starts one in the last folder.
- **Desktop and subagents in the tab:** the agent's desktop beside its terminal, with Take
  over and Open in a window; the subagents under it as chips, opening to a transcript.
- **History in the app:** every agent's past sessions, with Resume here, Peek, In a
  terminal, Folder, Copy ID and Move to Trash. The AI Hub keeps the glance (needs you,
  working, quotas) with Open, Stop and New, and its History button opens this page.
