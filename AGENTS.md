<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Project rules for AI agents (Quest/Log system)

- Talk to the owner in Thai: "ฉัน" for yourself, "คุณ" for the owner, no ครับ/ค่ะ, short answers. Code, comments, commit messages and docs stay in English.
- Start of every session: `AGENTS.md` → `README.md` → `Context/departments/<your department>.md` → your `INBOX.md` → active Quests → queued Quests. Details in `Context/Rules.md`.
- Identify your role only from the chat name (`get_session` with no id), never from memory.
- The Project Manager (PM) chat is the only channel to the owner. Other agents never ask the owner directly: solve it, or report to the PM once with what you tried.
- Change the minimum scope a Quest names. One job per Quest file in `Context/quests/<dept>/`.
- Never store secrets, tokens or passwords in docs, logs or commits. Never commit `.claude/settings.local.json`.
- Never force push, delete unrecoverable data, log in or create accounts for the owner, or issue new keys. Old files move to `_เก่า รอลบ/`, they are not deleted.
- Keep each file's existing line endings (these docs are LF). A diff that rewrites the whole file means something went wrong.
- Work method, roles and design/copy rules are in `docs/WORKFLOW.md`. Project facts and decisions are in `docs/HANDOFF.md`. Do not reopen decisions made there.
