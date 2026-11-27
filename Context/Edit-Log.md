# Edit Log

Latest 10 jobs, newest first, 3 lines each. Older entries are in `Context/archive/edit-log/`. Written by `tools/context/log-edit.py`; do not edit by hand.

- **2026-11-27 — Q-20261126-lang-switch** — One shared NestLang module; EN/TH switch translates all UI text, room and genre names; works, maker text and tier names stay; one key nest-lang with old key fallback
  Files: design/v6/lang.js, design/v6/session.js, design/v6/devlogs.js, design/v6/browse.js, design/v6/tiles.js, design/v6/project.js, design/v6/profile.js, design/v6/post.js, design/v6/guide.js, design/v6/ru…
  Validation: qa 350468f: tests 54 OK, lint 0 errors, build OK, EN identical to a5a844b, TH sweep clean; home 390 overflow 138px TH vs 125px EN pre-existing
- **2026-11-26 — Q-20261126-baseline** — Set up the Quest/Log system, the Design + Build department layer and Sub Agent definitions; no past work back-filled.
  Files: AGENTS.md, README.md, .gitignore, Context, tools/context, .claude/agents
  Validation: tools/context tests: 8 pass. Chat messaging test and dry run not done yet.
