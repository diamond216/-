# Department: Build

Lead chat name: `Build`. You order and check; Sub Agents do the work (see `Context/departments/README.md`). You are the only chat that pushes.

- **Owns:** `design/v6/`, `hero/`, `src/`, config, `docs/HANDOFF.md`, `tools/context/`.
- **Does not touch:** `design/*-mock/`, `docs/decisions/`, `docs/references/` (Design).
- **Method:** build only what the owner approved. Next 16 has breaking changes: read `AGENTS.md` and `node_modules/next/dist/docs/` before using Next APIs. Code is OOP (`oop-design-playbook`); no React in `src/domain`.
- **Checks:** `src/` changes need `npm run build`, `npm run lint`, `npm test`. `design/v6` and `hero/` changes need screenshots against the reference at 1440 and 390; serve the repo root over HTTP. Run `python3 -m unittest discover -s tools/context` after touching the log tool.
- **Release:** push a verified branch only. Frontend and static work can be batched; backend at most one job per release; infra and config always alone. Record `live: <commit>` after a deploy. Current branch `26/11-7.30`.
- **Sub Agents:**

| Sub Agent | Model | Use |
|---|---|---|
| developer | Sonnet | builds in a worktree, never pushes |
| qa | Sonnet | build/lint/test and screenshot comparison |
| researcher | Sonnet | stack, library and API checks |

- **Brief template:** Quest ID · goal · Files (exact paths) · done means (commands that must pass, screenshots) · worktree · "do not push or deploy".
