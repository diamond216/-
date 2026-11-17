# Hamster Nest: handoff for the next session

> **สรุปภาษาไทย:** Hamster Nest คือเว็บรวมผลงานหัวกะทิของบริษัท Hamster Hub ให้ความรู้สึกแบบ itch.io มี 4 หมวด (Game, Web, IoT, Idea) ค้นหาง่ายสำหรับนักลงทุน ทุกผลงานต้องลงอัปเดตเรื่อย ๆ ("สายน้ำ ไม่ใช่หนองน้ำนิ่ง") งานที่อัปเดตบ่อยจะถูกดันขึ้นบน และหน้าโปรไฟล์ต้องทำให้คนอยากทักไปคุยกับเจ้าของผลงาน
> ตอนนี้หน้าแรก, หน้าผลงาน และหน้าโปรไฟล์สร้างเสร็จและผ่านการอนุมัติแล้ว (ข้อมูลยังเป็นข้อมูลสมมติ ยังไม่มี backend)
> session ใหม่: อ่าน `docs/WORKFLOW.md` (ระบบและวิธีคิดทั้งหมด) และไฟล์นี้ให้จบก่อนเริ่มงาน

Last updated: 17 Nov 2026. Branch: `claude/hamster-nest-portfolio-8gihhk`.

---

## 1. What this is

**Hamster Nest** is the showcase "shelf" for the best work made by people at the company **Hamster Hub**. It should feel like itch.io. Goals, from the owner's brief and handwritten note (`docs/brief/handwritten-note.jpg`):

- **Make visitors want to talk to the maker.** This is the main job of every page.
- **Four categories** with clear genres: Game, Web, IoT, Idea. Search and filters must make it easy for an investor or publisher to find work.
- **Trust.** The business model is transparent and checkable. Every project traces back to Hamster Hub. Work and teams are screened by published criteria. Credible people who played, viewed or invested can be quoted.
- **Living projects.** Every project shows a stream of updates. "A waterfall, not a still pond": projects that update often rank higher, which pushes everyone to keep posting.
- **Maker profiles.** Show the latest update, past work, awards, background, and a personal motto that shows their attitude.

## 2. How the owner wants us to work (important)

The full version, with the setup, tools, agent habits and the owner's own copy and design prompt, is in **`docs/WORKFLOW.md`**. Short version:

Talk to the owner in **Thai** (ฉัน/คุณ). Work as three roles:

- **Manager** (the main session) sets scope and briefs the others. It must not make design decisions alone. **Before building anything visible, show pictures** (mockups, or options A/B/C rendered as images) and let the owner choose with a question. After a build, compare screenshots with the reference, detail by detail, and send fixes back until it matches.
- **Researcher** looks into the stack, tools, MCP servers and techniques, and captures reference screenshots.
- **Coder** builds only from the Manager's scope and the Researcher's resources.

Spawn agents only when worth it (multi-source research, a large build). Small fixes can be done inline, but still show pictures first.

Other standing rules from the owner:

- **Code is OOP:** classes, composition, interfaces, repositories and services, strategy and specification patterns. No React in `src/domain`.
- **Copy:** EN is the default, with a TH switch. Write like a real person: plain words, contractions, no exclamation marks. Never use "elevate, delve, tapestry, seamless, empower, game-changer, unlock, transform" or "in today's digital landscape". Microcopy stays warm ("Send it over", not "Submit"). A test enforces part of this (`src/services/i18n/i18n.test.ts`).
- **Visuals:** warm paper and charcoal, one loud persimmon accent. No purple or blue gradients, no floating blobs, no repetitive 3-column icon grids. Keep the intentional asymmetry and whitespace.
- **Motion:** medium level, and it always respects `prefers-reduced-motion`. Each element has exactly one animation owner (anime.js *or* `motion/react`, never both). Never import `framer-motion`.

## 3. Decisions already made (do not reopen)

| # | Decision | Picture |
|---|---|---|
| 1 | Home layout follows **direction A, "Arcade Shelf"**: filter sidebar, then card grid, then live update feed, itch.io style | `docs/decisions/01-home-direction-A-chosen.jpg` |
| 2 | First round is a **front-end prototype on typed sample data**. The OOP structure is ready for a backend later | |
| 3 | **English by default**, switchable to Thai | |
| 4 | "Say hi" opens a **contact form on the site**. Hamster Hub gets a copy of every message, so every deal traces back to the company | |
| 5 | **Light theme by default**, with a night toggle | |
| 6 | Hero right side keeps **both** the activity graphic and the "note from a maker" card | |
| 7 | Animation level is **medium** | |
| 8 | The tick wheel became a **friendly donut** (option 2), styled as **"Soft segments" (A)** | `docs/decisions/03-…`, `04-…` |
| 9 | The positioning chart (price × player pull) from the handwritten note was **removed** at the owner's request. Don't add it back | |
| 10 | Project page and maker profile drafts were **approved as built** | |
| 11 | Hero left side is a **rotating highlight of 3 projects** (option 2): big card, three tabs that fill and move on every ~6.5 s, pausing on hover, focus or while writing to the maker. The maker note on the right follows the project on show. Donut and note sit in panels with the same frame as the card. The search moved to a **Browse** header above the category tabs. The big "Work that's still moving." headline is now screen-reader only | `docs/decisions/05-hero-highlight-option-2.jpg` |
| 12 | **Home v2 structure** (owner's direction, 17 Nov 2026): a statement headline in quote marks ("High schoolers can do all this!?"), then an Epic-style highlight with **the best project from each category**, then **four rooms** (Game, IoT, Web, Idea) as a 2x2 grid, then updates, then Hamster Hub info at the bottom. Entering a room opens that room's browse page. This replaces decisions 1, 6, 8 and 11 for the home page | `docs/decisions/06-home-v2-approved.jpg` |
| 13 | **Look v2** (made with the `frontend-design` skill, owner chose it over the first pass): paper and charcoal stay, the one loud colour is **highlighter yellow `#ffe14d`, used only to mark what is new today**. Type is **Archivo** at different widths (condensed black for headlines), and **Mali** handwriting only for words a maker wrote. No persimmon, no mono uppercase labels, no numbers or charts on the home page | same picture |
| 14 | **Updates are shown as "Before and now"** photo pairs (option 2 of 3). No counts, graphs or donut | `docs/decisions/08-updates-options-2-chosen.jpg` |
| 15 | **Room themes:** Game = arcade at night (charcoal + yellow), IoT = LED panel (dark + amber dots), Web = browser window (white, address bar), Idea = school notebook (ruled paper, blue pen) | `docs/decisions/07-rooms-themes-chosen.jpg`, options in `09-room-theme-options.jpg` |

`docs/decisions/02-reference-sites-vs-draft.jpg` shows what was borrowed from each reference site.

## 4. Reference sources the owner named

- **anime.js** (https://animejs.com): instrument and technical-drawing look, timelines and stagger. It powers the hero motion.
- **OriginKit** (https://www.originkit.dev): animated components. Fetching code needs a free key (10 a day), and some components use framer-motion, so they'd need rewriting.
- **21st.dev** (https://21st.dev): component marketplace. Code access needs an API key (paid generation).
- **Aceternity UI** (https://ui.aceternity.com/components): free components install via `npx shadcn@latest add https://ui.aceternity.com/registry/<name>.json`. `3d-card` is installed and restyled.
- **itch.io**: browse page, tags, devlogs and creator pages. We borrow the patterns, never the branding.

## 5. Stack and how to run

Next.js **16.4.6** (App Router, `output: "export"`), React 19.3, TypeScript 5, Tailwind 4.3.3, shadcn (radix base), `motion` 14, `animejs` 4.5, `minisearch`, `nuqs`, `lucide-react`, and vitest 5. Fonts come from npm: Bricolage Grotesque (display), Anuphan (Thai + Latin body), JetBrains Mono.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # static site in out/ (home + /projects/<slug>/ + /makers/<slug>/)
npm run lint
npm test        # 38 tests
```

**Read `AGENTS.md`.** Next 16 differs from older versions, so check `node_modules/next/dist/docs/` before using Next APIs. For static export, `cacheComponents` and `partialPrefetching` must stay out of `next.config.ts`. Dynamic routes need `generateStaticParams` and `dynamicParams = false`.

## 6. Code map

- `src/domain/`: entities and value objects. Examples: `Project`, `Maker`, `ProjectUpdate`, `Category`, `Genre`, `Stage`, `UpdateType`, `Endorsement`, `LocalizedText` (en/th), `Money`, `MoneyLedger`, `HubCheck`, `MakerStory`, `Clock` / `FrozenClock`.
- `src/data/`: repository interfaces, in-memory implementations, and the sample data in `src/data/sample/`. Times are stored as "how long ago", so the prototype always looks alive.
- `src/services/`:
  - `ranking/`: `FlowRanking`, `NewestFirst`, `MostFollowed`, and the `RankingRegistry`.
  - `filters/`: specifications.
  - `search/`: MiniSearch with a Thai `Intl.Segmenter` tokenizer.
  - `shelf/`: `Shelf` (also `highlights()` for the hero), plus `ActivityDigest` (stats, feed, `spotlight()` / `spotlightFor(listing)`, donut `momentum()`).
  - `pages/`: project and profile page services.
  - `contact/`: validator, plus a local-outbox sender.
  - `follow/`, `i18n/` (EN/TH dictionaries, kept in parity by types), `preferences/`, `storage/`.
- `src/composition/createNest.ts`: **the only place that picks concrete classes.** To connect a real backend, swap the repositories and the `MessageSender` here.
- `src/components/`: thin React components (hero, shelf, project, profile, contact, layout, ui).
- `src/app/`: routes. `/` is the home page, `/projects/[slug]/` and `/makers/[slug]/`, with styles in `globals.css`.
- `design/`: approved static HTML drafts and the copy doc.
  - `design/landing/`, `design/project/`, `design/profile/`, `design/pages.css`.
  - `design/landing/COPY.md`.
  - These are the visual reference. Don't edit them to match the code; it works the other way round.

**Ranking formula** (`FlowRanking`):

```
flow = Σ w(type) × 2^(−ageDays/14)
```

- Weights: release 5, milestone 4, devlog 3, media 1.5, changelog 1.
- Each project scores at most 6 points per day.
- `rank = 0.60 × (1 − e^(−flow/6)) + 0.25 × quality + 0.15 × trust`

**Donut slices** (`ActivityDigest.momentum()`): every project counts in exactly one slice, checked in this order: posted today, open to investment, paused, building. So "looking for investors" leaves out projects that posted today.

## 7. Status

**Done:** home page, project page (all projects), maker profile (all makers), EN/TH, light/night, mobile at 390px, contact dialog, follow toggle, links between pages, unit tests. Everything has been compared against the drafts with screenshots.

**Known differences from the drafts (accepted):**

- Counts are smaller and computed: 17 projects, about 100 updates, instead of 68 / 312.
- Times like "25 min ago" are computed.
- Pim's profile shows 4 project cards.
- No filters are pre-selected on load.
- The Thai copy for the project and profile pages was written by the agent and should be proofread by a Thai speaker.

**Not built yet (links are `#` for now):**

- "Post your work" (maker submission and update posting)
- "For investors"
- "How we pick" (the public screening checklist)
- "How ranking works"
- Real backend: auth, database, sending messages, uploads
- Deployment

**UX/UI restructure (17 Nov 2026):** the hold is over. The owner gave the new direction and chose every option (decisions 12 to 15). The approved drafts are `design/v2/index.html` (home) and `design/v2/game.html`, `iot.html`, `web.html`, `idea.html` (rooms), styled by `design/v2/v2.css` on top of `design/landing/styles.css`. They are the reference for the build. The 25 showcase sites in `docs/references/` were the research for this.

**Next step:** build the v2 home and the four room pages in the app to match `design/v2/`, then compare with screenshots. The old home sections (donut, maker note, filter sidebar, feed) go away on the home page; project and maker pages stay as they are until the owner asks.

**Open questions for the owner:**

- The headline is the owner's example line. It may change.
- All Thai copy for v2 still needs writing and a Thai speaker's proofread.
- Figma: the connector was not visible in the 17 Nov session (not connected on the account as seen from the desktop app). The owner worked from pictures instead.

## 8. Environment notes

- The cloud environment **hamster-nest** allows these hosts: ui.shadcn.com, ui.aceternity.com, 21st.dev, www.originkit.dev, animejs.com, itch.io, static.itch.io, assets.aceternity.com, cdn.21st.dev, assets.21st.dev, cdn.originkit.dev. `img.itch.zone` and creator subdomains (`*.itch.io`) are still blocked.
- GitHub push works now. Earlier in the first session it failed with a 403 until access was fixed.
- The owner's PC is DESKTOP-GEEKQH2, with the project folder at `D:\Hamster nest`. Cloud sessions could not attach that folder through Remote Control. To work on files there, run a session on that PC, or clone this branch into the folder.
- Playwright and Chromium are pre-installed in cloud containers. Don't run `playwright install`.
- The environment's setup script runs `npm ci` in the checkout, so a fresh session can build and test right away. It was saved at the end of the first session and hasn't been seen running on a fresh container yet. If `node_modules` is missing, run `npm ci`.
- Screenshot and compare tools are in `tools/` (see `docs/WORKFLOW.md`, section 5).
- Commit messages end with the attribution lines the harness gives you.
