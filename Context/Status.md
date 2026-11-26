# Status snapshot: 2026-11-26

A snapshot of today, not a history. Past decisions live in `docs/HANDOFF.md` and are not repeated here.

- **Branch:** `26/11-7.30` at 80ff7d3 (local checkout `local-26-11-7.30`). It is 118 commits ahead of `main` and has not been merged. `claude/confident-clarke-5rr8x9` is 2 commits ahead of it (a63cb8c); the owner chose not to take them for now.
- **Live product:** the static prototype in `design/v6/` and `hero/` (start page `hero/index.html`; serve the repo root over HTTP). Decisions run to No. 30 in `docs/HANDOFF.md`.
- **Next.js app (`src/`):** frozen at the v2 look since 17 Nov. Tests: 54 pass (`npm test`), and they cover `src/` only.
- **Authors, last 90 days:** 119 commits (Claude 89, SakanaKan 23, diamond216 7). `hero/` came from SakanaKan via `main`.
- **Hotspots, last 90 days (file touches):** `design/v6` 284, `design/` total 341, `docs` 98, `hero` 45, `src/` ~270.
- **Test link:** the prototype is a private claude.ai artifact; the link is in `docs/HANDOFF.md`.
- **Open GitHub issues / PRs:** none.
- **Not allowed:** force push; secrets in docs or logs. No secrets were found in the docs. Environment variables and keys live only in the cloud environment.
- **Known risks:** `hero/` holds about 6 MB of video in git. awwwards drops connections from the cloud. `docs/HANDOFF.md` header still says "Last updated 17 Nov".
- **No deploy pipeline** exists. Release means pushing a verified branch.
