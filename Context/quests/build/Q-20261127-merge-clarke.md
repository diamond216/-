### 2026-11-27 — Q-20261127-merge-clarke — Merge the 3 commits that only exist on claude/confident-clarke-5rr8x9
- Status: ready-to-close
- Owner: Build
- Department: build
- Parent: Q-20261126-branch-merge
- Goal: 26/11-7.30 contains the 3 commits clarke has and we don't (origin/claude/confident-clarke-5rr8x9, tip e4d1bd5): 170c456 (removes the posting guide and rules), a63cb8c (Post page: team inputs white), e4d1bd5 (Browse: water fades out while the Rooms row is stuck). Merge, no rebase, no force. Clarke's removal wins: the posting guide and the 10 rules are gone, so also remove the Thai/English strings that only served them (design/v6/lang.js dictionary keys, tabs, "After you post" links) without touching the rest of the Thai work. Do not touch main.
- Files: design/v6/** (post.*, guide.*, rules.js, lang.js, browse/bridge css as the merge brings), docs/HANDOFF.md
- Context: owner answered "เอา 3 commit ที่เราไม่มีมารวม" (2026-11-27). Checked at start: origin/26/11-7.30 = b73005a (unchanged), clarke = e4d1bd5 (unchanged). Expect conflicts in post.js, post.html, post.css, docs/HANDOFF.md.
- Validation: qa at 64e17ee: real merge (parents 02e00bc + e4d1bd5), npm test 54 OK, build OK, lint 0 errors / 76 warnings (baseline 78), no console errors or 404s, EN text identical to 02e00bc except the removed guide on post.html, no live guide/rules references. Screenshots: output/merge-clarke/
- Next action: PM reports to owner; not pushed. Merged into 26/11-7.30 locally (fast-forward to 64e17ee).
