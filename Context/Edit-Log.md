# Edit Log

Latest 10 jobs, newest first, 3 lines each. Older entries are in `Context/archive/edit-log/`. Written by `tools/context/log-edit.py`; do not edit by hand.

- **2026-11-27 — Q-20261127-merge-clarke** — Merged the 3 clarke-only commits (guide/rules removal, white team inputs, Browse water fade); dead guide strings removed from post.js; HANDOFF decisions 28/31 updated
  Files: design/v6/post.js, design/v6/post.html, design/v6/post.css, design/v6/browse.css, design/v6/guide.js, design/v6/guide.css, design/v6/rules.js, docs/HANDOFF.md
  Validation: qa 64e17ee: tests 54 OK, build OK, lint 0 errors/76 warnings, EN identical except removed guide, no dead references
- **2026-11-27 — Q-20261126-lang-switch** — Pushed 26/11-7.30 to origin (fast-forward a5a844b..b73005a); live: b73005a; test worktrees removed
  Files: Context/quests/build/Q-20261126-lang-switch.md
  Validation: git fetch: origin/26/11-7.30 = b73005a
- **2026-11-26 — Q-20261126-baseline** — Set up the Quest/Log system, the Design + Build department layer and Sub Agent definitions; no past work back-filled.
  Files: AGENTS.md, README.md, .gitignore, Context, tools/context, .claude/agents
  Validation: tools/context tests: 8 pass. Chat messaging test and dry run not done yet.
