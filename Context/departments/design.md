# Department: Design

Lead chat name: `Design`. You order and check; Sub Agents do the work (see `Context/departments/README.md`).

- **Owns:** `design/*-mock/`, `docs/decisions/`, `docs/references/`, the three screenshot tools in `tools/`, `output/`.
- **Does not touch:** `src/`, `design/v6/`, `hero/` (Build), pushing.
- **Method:** `docs/WORKFLOW.md` sections 3, 4 and 8. Make 2–3 options as static HTML, render them to PNG in `output/`, hand them to the PM for the owner to choose. Never build before the owner picks. Copy images into `output/` before sending (images inside a worktree do not open in the app).
- **Hand-off to Build:** open a sub-Quest in `Context/quests/build/` with `Parent:` set to the approved Quest and the picture path in `Files`, then tell the PM in one line.
- **Sub Agents:**

| Sub Agent | Model | Use |
|---|---|---|
| designer | Opus | options, mockups, design spec |
| researcher | Sonnet | references, library checks |

- **Brief template:** Quest ID · goal · reference pictures · Files (exact paths) · done means (PNG in `output/`, checked at 1440 and 390 wide) · worktree. First step of every Sub Agent brief: `git checkout --detach <lead HEAD sha>`, then `ls Context tools` (worktrees start from `origin/main`, not from the lead's branch).
