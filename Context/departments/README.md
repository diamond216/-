# Departments

Chosen by the owner on 2026-11-26: **option 2, Design + Build**, plus the PM. Three chats in total. Role comes from the chat name (`get_session` with no id), never from memory.

| Department | Chat name | Scope (paths) | Queue | Sub Agents | Takes work from | Hands work to |
|---|---|---|---|---|---|---|
| PM | `PM` | `Context/` (Status, Rules, department files), owner contact | `Context/quests/` (all) | none | the owner | Design, Build |
| Design | `Design` | `design/*-mock/`, `docs/decisions/`, `docs/references/`, `tools/shots.cjs`, `tools/compare.py`, `tools/options-sheet.py`, `output/` | `Context/quests/design/` | designer (Opus), researcher (Sonnet) | PM | Build (approved pictures), PM |
| Build | `Build` | `design/v6/`, `hero/`, `src/`, config files, `docs/HANDOFF.md`, `tools/context/` | `Context/quests/build/` | developer, qa, researcher (Sonnet) | PM, Design | PM. **Build is the only chat that pushes** |

**Overlap to remember:** `docs/WORKFLOW.md` calls `design/` the reference that is never edited to match code. Since decisions 17 to 30, `design/v6/` is the working prototype, so it belongs to Build. `design/*-mock/` (the option pictures) belongs to Design. `docs/` is split: Design owns `decisions/` and `references/`, Build owns `HANDOFF.md`. i18n text changes follow the Quest that asked for them.

**Why two departments:** the owner's rule is pictures first, then build, so Design and Build are a natural handoff. Merge back into one if the Design queue stays empty for two weeks. Split Build into Core and UI when a real backend starts or Build holds more than five open Quests.

## Roles of the four agents in `docs/WORKFLOW.md`

The Manager is the PM chat. Researcher, Designer and Coder are Sub Agents (`.claude/agents/`): `researcher`, `designer`, `developer`, plus `qa` for checks.

## Session start order

`AGENTS.md` → `README.md` → your department file in `Context/departments/` → your `INBOX.md` → active Quests → queued Quests.

## Lead chat rules

- The lead orders and checks. It does not do the work itself. One new Sub Agent per job, in its own worktree (`isolation: worktree`). Sub Agents do not contact other chats.
- Write each Sub Agent a self-contained brief: Quest ID, goal, Files, how it is checked, worktree. First step of every Sub Agent brief: `git checkout --detach <lead HEAD sha>`, then `ls Context tools` (worktrees start from `origin/main`, not from the lead's branch).
- Do not ask again: try every route, and if truly stuck report to the PM once with what was tried.
- When done: update the Quest, write the Log (`tools/context/log-edit.py`), read the queue, take the oldest `queued` Quest, or report an empty queue to the PM.
- QA passed means "พร้อมให้ผู้ใช้ตรวจ" (ready for the owner), never "done".
- Never close a program by name; only a PID the agent started. Screenshot only the target app window.
