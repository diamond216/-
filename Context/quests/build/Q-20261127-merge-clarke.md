### 2026-11-27 — Q-20261127-merge-clarke — Merge the 3 commits that only exist on claude/confident-clarke-5rr8x9
- Status: active
- Owner: Build
- Department: build
- Parent: Q-20261126-branch-merge
- Goal: 26/11-7.30 contains the 3 commits clarke has and we don't (origin/claude/confident-clarke-5rr8x9, tip e4d1bd5): 170c456 (removes the posting guide and rules), a63cb8c (Post page: team inputs white), e4d1bd5 (Browse: water fades out while the Rooms row is stuck). Merge, no rebase, no force. Clarke's removal wins: the posting guide and the 10 rules are gone, so also remove the Thai/English strings that only served them (design/v6/lang.js dictionary keys, tabs, "After you post" links) without touching the rest of the Thai work. Do not touch main.
- Files: design/v6/** (post.*, guide.*, rules.js, lang.js, browse/bridge css as the merge brings), docs/HANDOFF.md
- Context: owner answered "เอา 3 commit ที่เราไม่มีมารวม" (2026-11-27). Checked at start: origin/26/11-7.30 = b73005a (unchanged), clarke = e4d1bd5 (unchanged). Expect conflicts in post.js, post.html, post.css, docs/HANDOFF.md.
- Validation: ยังไม่ได้ตรวจ
- Next action: developer Sub Agent merges in a worktree on branch q-merge-clarke from 5f66c5d; then qa. No push.
