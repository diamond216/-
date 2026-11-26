# Agent handoff: the Board and the Quest template

## Reading the Board

There is no board file. Read the Quest files directly:

```bash
grep -r "^- Status:" Context/quests --include='Q-*.md' | sort -t: -k3
grep -rl "^- Status: active" Context/quests          # what is being worked on
grep -rl "^- Status: queued" Context/quests          # what is next (oldest ID first)
```

One Quest = one file, named `Q-YYYYMMDD-short-name.md`, kept in `Context/quests/<dept>/`. Closed Quests move to `Context/archive/quests/` (PM only, on the owner's word).

## Status table

| Status | Meaning |
|---|---|
| queued | Approved, waiting to be picked up |
| active | Being worked on |
| waiting | Waiting for information or a decision |
| blocked | Cannot continue |
| ready-to-close | Passed its checks and the Log entry is written; waiting for the owner to confirm closing |

## Quest template

```markdown
### YYYY-MM-DD — Q-YYYYMMDD-short-name — Title
- Status: queued
- Owner: the chat or department that actually has it (leave empty if nobody)
- Department: build
- Parent: Q-ID of the main Quest (sub-Quests only)
- Goal: the outcome and how it will be checked
- Files: explicit paths (never "all")
- Context: issue, branch or existing doc links
- Validation: the real result, or "ยังไม่ได้ตรวจ"
- Next action: next step / what it waits for / the blocker
- live: commit that went to production (after a deploy)
```

## Log

`python3 tools/context/log-edit.py --quest Q-ID --files path [path ...] --summary "..." --validation "..."` writes to `Context/Edit-Log.md`. It keeps the 10 latest jobs, 3 lines each, and moves older ones to `Context/archive/edit-log/YYYY-MM.md`. The same Quest ID updates its entry instead of adding a second one. It refuses unknown Quest IDs and paths outside the repo, and redacts common secret patterns.
