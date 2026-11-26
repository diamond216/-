### 2026-11-26 — Q-20261126-lang-switch — Language switch must translate every heading, but not the works or rooms
- Status: active
- Owner: Build
- Department: build
- Parent: none (owner request, 2026-11-26)
- Goal: When the owner switches EN / ไทย, every UI heading, label, button, tab, filter title and placeholder on every v6 page and on hero/index.html changes language. These stay exactly as written and must NOT change: (1) works themselves: project names, descriptions, update texts, team and maker names, mottos, awards, comments; (2) the room names (Game, Web, IoT, Idea), genre names and tier names (Platinum to Bronze). The choice is remembered and carries from page to page.
- Files: design/v6/*.js, design/v6/*.html, hero/index.html, hero/app.js (only what the fix needs; no new design)
- Context: owner said "เปลี่ยนภาษายังมีบางหัวข้อไม่เปลี่ยน แต่ผลงานไม่ต้องเปลี่ยนภาษา สายผลงานด้วย". PM scan, checked by Build: data-i18n only in design/v6/index.html (4) and hero/index.html (30); two storage keys: `nest-lang` (island.js, devlogs.js) and `hamster-nest-lang` (hero/app.js). PM decisions: no visual design change, text only; Thai copy follows docs/WORKFLOW.md section 8; unify on `nest-lang`, read old `hamster-nest-lang` once as fallback. Thai still needs a reader later (Q-20261126-th-proofread stays waiting).
- Validation: ยังไม่ได้ตรวจ
- Next action: developer Sub Agent builds in a worktree on branch q-lang-switch from a5a844b; then qa
