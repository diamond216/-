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
| 16 | **Rooms have a left sidebar** (option A, with numbers; 17 Nov 2026): genre list with counts (one genre at a time), stage checkboxes, investor checkboxes (open to investment, has a demo, updated in the last 7 days). On the right, "Flowing strongest this week" (one big No. 1 card, smaller No. 2 and No. 3, each with "N updates in 30 days"), then "Latest updates" with every match. This replaces the chip row. Counts and ranks are allowed in rooms; the home page still has none | `docs/decisions/10-room-sidebar-option-A-chosen.png` |
| 17 | **Home v6** (owner's direction, 17 Nov 2026, draft `design/v6/`): a full-width hero shows one work, its pictures slide left as cards (option A, after the FRZN reference, with an "01 — 07" counter), and three buttons bottom right switch to another work. Below it, **tiers replace everything else on the home page**: Platinum, Diamond, Gold, Silver, Bronze (in that order), 10 works each, with a sticky **rail on the left** that fills as you scroll (option C). Hovering a card plays a preview (a video if the work has one, otherwise its pictures in turn). The statement headline, four rooms and three lists are gone from the home page. Ranks are now allowed on the home page. A **Filters button beside the Platinum title** (option A) opens a box: pick a room from the tabs (All, Game, IoT, Web, Idea), then tick any of its genres. It filters every tier; a tier with no match says so. Genres follow the room pages, plus Smart home (IoT) and School (Web). Round 3 (owner): one line under each picture (just the name; the big card adds room and genre), no "01 — 07" counter, the hero switches works with plain previous/next arrows and dots (no names), every tier uses the big Platinum layout, type follows Apple (system SF font first, Inter and Noto Sans Thai as web fallback, weight 600, tight tracking), flat pill buttons with no glow, and copy is checked against petergyang/no-ai-slop. Round 4 (owner): the green Malachite theme is gone. The page colour follows the work in the hero (its own background and accent colours), then changes to each tier's colour as you scroll into it. The top bar and footer use the Hamster Hub site colours (near-black `#111116`, orange `#FF6A1A` "NEST" and "Post your work" button, outlined "Sign in"). Round 5 (owner): the statement "High schoolers can do all this!?" is back, centred, right under the hero (Prompt 800), so the first screen shows the work and the statement together; the hero is shorter to make room. Round 6: the statement is one line at Apple heading size (system font, weight 600, like the "iPhone Duo" heading), and the "Platinum · Game" label above the hero title is gone. Round 7: the statement uses **Fraunces 600** (owner chose D of four fonts), plain off-white with no lamp or glow, sits lower, and the hero picture fades into the page with no seam. Round 8: FC Iconic Text was tried and dropped. Round 9: all UI text uses **IBM Plex Sans Thai Looped** (OFL, from Google Fonts; the statement stays Fraunces). Below the hero, a soft light in the page colour **follows the pointer** (option B of three) and every card's shadow turns away from it; cards have a lit top edge and a soft shadow (`design/v6/light.js`). Round 10: each tier head is a centred wordmark after Apple product names (`design/v6/marks.js`): Platinum and Silver like Watch Series (logo, heavy name, light TIER, metal gradient), Diamond and Bronze like iPad mini (one word in Yellowtail script with a gradient), Gold like MacBook Pro (the line under it runs yellow into orange), each with a pair of pills "See all 10" and "How ranking works". Round 11: no subtitle and no logo on any tier. Platinum is navy (`#6E8FE0` accent, PLATINUM TIER in a navy metal gradient); the handwriting moved to Diamond (the word "Diamond" in Kaushan Script, larger and easier to read); Gold and Bronze have their name in a colour gradient; Silver keeps the metal badge. Round 12: the tier colours are painted down the page itself (`TierBackdrop` in `home.js`), so each one fades into the next as you scroll; the rail sits further left (140px column) and each tier name is centred on the page, not on the card column | `design/v6/index.html` |
| 23 | **Hero + Browse on one page** (owner, 24 Nov 2026): the hero by SakanaKan (`hero/`, from `main`) is the first screen of `hero/index.html`, and the Browse page follows straight under it when you scroll. The owner chose join **A of three** (A: the Lagoon water band starts under the hero; B: plain paper; C: a white sheet sliding over a sinking hero). The water rises out of the strip under the hero panel with a soft edge. A "Scroll down" cue sits in that strip; it, "Explore projects" and the header's Browse link glide to Browse with its heading just under the header. The hero header is clear over the hero at rest and turns solid white (dark type, orange NEST) as soon as the page scrolls past 24px, so the hero text never runs under clear menu type; Browse's search row sticks under that 88px header. Files: `design/v6/bridge.css` and `bridge.js` (join only; the hero's own files are untouched except new markup and the `scrollDown` EN/TH text in `app.js`) | `hero/index.html` |
| 22 | **Admin review queue and posting rules** (owner chose layout A of three in `design/admin-mock/`, 24 Nov 2026): `design/v6/admin.html`. Tabs Waiting / Approved / Turned down; list on the left, the work on the right (pictures, their About, team with profile links, their link), screening checks the admin can tick (they don't block). Only two decisions: **Approve** with a tier (Platinum to Bronze, Bronze picked by default; the button reads "Approve as Gold") and **Reject**. A rejection always needs a comment in the admin's own words (15+ characters; lines added by ticking a rule don't count); the admin can tick the rules it breaks, which adds each rule's suggested fix to the comment, and sees a preview of what the maker will get. Decisions are saved with the admin's name, can be undone from the toast or moved back to waiting, and survive a refresh (localStorage; "Reset the sample queue" restores it). **Rules**: ten rules in `design/v6/rules.js`, modelled on the kinds of rules stores like Steam use, written in our own words for a school (owned or credited, as described, safe, respectful, school-appropriate, private details, no money games, AI disclosure, one page per project, finished enough to try), each with a fix. **Posting guide** (`guide.js`): a dialog on the post page with "A good post" (an annotated example tile), "The rules" (expandable, with the fix) and "After you post"; it opens when you start a new project unless you tick "Don't open this…", from the "Posting guide and rules" button any time, from the checklist's "the rules" link, and from `post.html#rules` or `#rule-3` (the link in a rejection) | `design/v6/admin.html` |
| 21 | **Post your work** (owner chose layout A of three in `design/post-mock/`, 24 Nov 2026): `design/v6/post.html`. Two modes: **New project** and **Update a project**. New project: 1 Basics (name and one line with counters, room, genre one or two, platforms by room), 2 Clip and pictures (drop or choose files; first is the cover; reorder by drag or ‹ ›, "Cover" button, remove; clips over 60 s get a note), 3 About (grows as you type), 4 Team (you first; add people by name with suggestions; a role each), 5 How to reach you (filled from your profile; show phone toggle), 6 Something to try (label + link, optional). Update: pick one of your projects, title, a few words, pictures. Right side: a live preview (the Browse tile, or how the update will read) and a "Before it goes up" checklist; only name, line, room and cover (or project and title for updates) block posting, and the first missing one is scrolled to. The draft saves itself (words only; files stay on your computer), with "Saved just now", "Save for later" and a two-click "Start over". No Contacts block in this page's footer (owner) | `design/v6/post.html` |
| 20 | **Profile page** (owner chose layout A of three in `design/profile-mock/`, 24 Nov 2026): `design/v6/profile.html#<name>`. Water-band header: avatar, @handle, full name, role, motto (Mali), stats (works, best rank, followers, awards), "Say hi to <name>" and Follow (or "Profile settings" on your own). Tabs: **Works** (one grid, best rank first, each tile shows its rank and their part, e.g. "Platinum · Lead"), **Updates** (everything they posted, with the work), **Favourites** (grouped by the day saved, like a browsing history; on your own profile always, with a lock or globe; on someone else's only if they share it), **About** (bio, into, tools, open to, since, awards). Side: Contact (copy buttons, Say hi), Latest from them, About. **Say hi** opens a short message form (quick lines, reply email, "Send it over"; Hamster Hub gets a copy, per decision 4). **Profile settings** dialog: favourites Only me / Everyone, show contact card, show phone. Account menu (avatar) in the top bar: your profile, works, favourites, settings, feedback, log out. You are signed in as Pim in the prototype; favourites and settings live in localStorage. The project page gained a **heart** next to Download (saves to the same favourites) and team names link to profiles. Sample people, team, contact and updates are in `design/v6/details.js` | `design/v6/profile.html` |
| 19 | **Home top bar and opening** (20 Nov 2026, from the owner's clip of another prototype): logo left, a black "dynamic island" with Browse and About in the middle (a pill slides to the link under the pointer, the island opens slightly on hover), TH/EN switch and Sign in on the right. Clear over the hero, a white frame once you scroll. A line-drawn **HAMSTER_NEST** opening plays once per visit (`intro.js`). TH/EN swaps the texts marked `data-i18n` (`island.js`); the Thai copy needs a Thai speaker's read | `design/v6/index.html` |
| 18 | **Browse page** (owner's direction, 19 Nov 2026, draft `design/v6/browse.html`): Behance-style top. A Filter button and a search bar, with an itch.io-style **rank menu** (All ranks, Platinum to Bronze) at the right end of the bar. Under it, dark picture tabs for **All work, Game, Web, IoT, Idea**. The Filter panel (left column) has Rank checkboxes, then Room checkboxes only under All, then the genres of the chosen rooms (or of the tab's room), each with a count. Results come **four to a row** as itch.io-style cards (picture, name with a rank chip, one-line description, maker, room and genre, platform icons). Hovering a card **widens it and slides the rest of its row aside**, plays the preview clip and shows one line of text inside the clip. Theme: **clear shallow sea** with moving sunlight caustics (`water.js`, WebGL), white cards with teal shadows, IBM Plex Sans Thai Looped. Round 2: the water is **blue, sky and near-white** with slow cyan and periwinkle drifts; the top bar is **liquid glass** (logo left; Browse and About in a glass pill in the middle; EN/ไทย, Log in and Sign up on the right); the filter button and search bar are glass too. The rank menu picks one rank: its button shows that rank's gem and name (e.g. Gold); with two or more ranks ticked in the filter the button just says "Rank" (no count, no gem). The one line inside the clip has no box: white text on a dark fade at the bottom of the picture. Water colour: the owner chose **Lagoon** (clear turquoise-blue; `data-tone="lagoon"` on `<body>`) from six palettes, ice to midnight, which stay in `browse.css`. **Rank reveal** (first draft, waiting for the owner's comments; `design/v6/reveal.js`): choosing exactly one rank (menu or filter) plays a 3.4 s full-screen fade to that rank's colour, its gem rising out of a blur with a soft flare, then its name; two or more ranks play nothing; click or Esc skips it. **Rank change order** (owner's spec): `ResultGrid` keeps `activeRank` (on screen) and `pendingRank` (latest choice) and never repaints at once on a rank change. It runs exit (staggered: lift, scale, blur, clip-path wipe upward) -> reveal enter (one rank only) -> swap to the newest state -> entrance (rises from below, unblurs, wipe opens) together with the reveal leaving -> idle, looping if the choice changed meanwhile. Every step waits on `Animation.finished`; no `setTimeout`. Cards take no hover while it runs. Non-rank changes (search, room, genre) still show at once. **Round 4 (20 Nov):** results are Behance-style tiles, four to a row (three with the filter open), every picture 1.28 : 1 with the work's name only under it. Hover no longer widens a card: a rank flag drops from the top-right corner and a "Notify me" bell appears top-left (toggles to Following). Clicking a tile opens a **player** (a large clip box, not full screen) with the one-line text inside the clip and a "View full" button (no up/down: removed at the owner's request) to the project page; Esc, the close button or the dim page close it. The ring on the chosen room tab is no longer cut off | `design/v6/browse.html` |

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

**v2 build (17 Nov 2026, on the owner's PC, not committed yet):** the v2 home and the four rooms are built. Rooms follow decision 16 and were compared with `design/v2/game.html`, `iot.html`, `web.html`, `idea.html` at 1440 (EN, plus TH for Game and Idea). Build, lint and 45 tests pass.

- Room code: `src/app/[room]/page.tsx`, `src/components/room/` (`RoomPageView`, `RoomSidebar`, `RoomStrongest`, `RoomCard`), `src/hooks/useRoomQuery.ts` (URL state: `q`, `genre`, `stage`, `open`, `demo`, `week`), `Shelf.roomView()` / `roomSize()`, styles in `src/app/v2.css`. Home code: `src/components/home/`.
- Under 900px the sidebar folds behind a "Filters" button.
- Rooms keep their own colours in night mode.
- Screen sizes (owner's request, 17 Nov 2026): computers use the whole width of the screen (`.wrap` has no max width, only a gutter; past 1440px the big headlines and cover blocks grow with the screen, and room grids add columns). Tablets (1100px and under) and phones (700px and under) have their own layouts; there the room links sit in a second row of the top bar. All of it is in the "screen sizes" block and the media queries of `src/app/v2.css`.
- Project page (owner's request, 17 Nov 2026): the activity graph and the "N updates in 30 days" line at the top right are gone. In their place is the same "Before and now" pair as the home page (`src/components/common/BeforeNowPair.tsx`) with the latest update's title under it. The stage, investment and rank chips stay. The big cover that had collapsed under v2 is fixed.
- This PC has no Playwright or Python, so `tools/` doesn't run here. Screenshots were taken with headless Chrome against a static server on `out/`. Headless Chrome can't go narrower than about 500px, so 390px was only checked for overflow in the app's browser pane (none on the room page).

**Awwwards research (20 Nov 2026):** the owner asked us to study https://www.awwwards.com/websites/sites_of_the_day/. The host is allowed on the environment, but awwwards drops every connection from the cloud session (connection reset / tunnel closed mid-exchange), and WebFetch cannot resolve it. Nothing from that page has been verified yet; waiting on screenshots from the owner.

**Browse layout C (21 Nov 2026, owner chose C of three mockups in `design/browse-mock/`, plus the tile-to-player transition):** water band at the top with the page title ("Browse what students are building", live count) and the search row; a pale paper page below. The search row sticks under the top bar on scroll and both turn white. Results header: room name + count badge, "Sorted by" (most updates, name A to Z, maker A to Z). Every active filter shows as a removable chip, with Clear all. "/" jumps to search, Esc clears it. Search, room, genre and sort changes rise in with a short stagger. The player now grows out of the clicked tile and shrinks back into it on close (or sinks away if the tile scrolled off), keeps focus inside, and returns focus to the tile.

**Browse round 6 (21 Nov 2026, owner):** no more player. Rest the pointer on a tile for **0.75 s** (a thin line in the rank colour fills along the picture's bottom edge meanwhile) and it opens to **two columns by two rows**, pushing the other tiles aside (FLIP, `grid-auto-flow: dense`; a tile in the last column opens to the left). Opened, it shows the maker (initial avatar), room and genre, **the last update** ("Updated 2 days ago" + what changed; sample data in `works.js`), the one-line description and "Open project". Clicking a tile goes to its project page. Leaving the tile closes it; passing over tiles quickly opens nothing; keyboard focus opens a tile at once. **Filter transition:** opening slides the panel in from the left (clip-path wipe) while the tiles re-flow from 4 to 3 a row and the panel's rows stagger in; closing slides it out first, then the tiles re-flow back to 4; newly shown genre groups slide in.

**Browse spacing (22 Nov 2026, owner chose C of three):** five tiles a row (four with the filter open), 44px row gap, a smaller title band and room tabs, tile names 14px medium. Opened tiles still take two by two.

**Project page (22 Nov 2026, owner chose layout A of three in `design/project-mock/`):** `design/v6/project.html#<work-id>`, opened from every Browse tile. Same glass top bar and Lagoon water band as Browse. On the band: "Back to Browse", room/genre/platform tags and a rank chip, the title and one line. Left: the clip (play button starts the preview and moves to the corner as pause) and an Updates list, newest first. Right, sticky: Team (avatar, name, role, "Say hi to the team"), Latest update, Awards (the rank first). Side order (owner, 22 Nov): Team, Contact, Awards (the Latest update card was removed; the newest update leads the Updates list). A **Download** pill sits right of the title (after Apple's price-and-buy pill): what you get, its size, and a blue Download button (sample: game build, code ZIP, plan PDF). The clip is now a **gallery**: the clip first, then four pictures, scroll-snapped, with arrows on hover, a "1 / 5" count, thumbnails underneath and arrow keys; leaving the clip pauses it. Under the gallery, an **About this project** description (three short paragraphs, sample text by room in `SampleDetails.description()`), then **Updates**, seven entries in a box that scrolls on its own, with a fade at whichever end still has more (bottom at first, top once you reach the end). **Compact size** (owner chose C of three, with larger text and dividers, then "a little larger, more air"): page 1160px wide, 320px side column, 36px gap, title 44px, a line between the header and the content, lines between rows in every side card, EXPLORE MORE at 64px. Emails wrap after the @. A **Contact** card under Team (email link, phone, LINE; each with a copy button and a "Copied" note; sample values on example.ac.th). Foot: **"EXPLORE MORE"** in Anton with the work's room and genre as the label, up to ten works scored by shared room, genre and platforms, shown with the **same Browse tiles** (hover 0.75 s to open two by two). The tile, FLIP and hover-expand code moved to `design/v6/tiles.js`, shared by both pages. Team, roles, awards and older updates are sample data in `SampleDetails` (`project.js`), the one place to swap for real data.

**Hero + Browse (24 Nov 2026):** `hero/index.html` loads the Browse styles and scripts from `design/v6/`, so serve the **repo root** (`python3 -m http.server 8173`, then http://127.0.0.1:8173/hero/), not `hero/`. Two fixes on the way in: the bridge's `.br>*{position:relative}` was overriding the sticky search row (it then sat on the room tabs), and Browse's own sticky watcher was switching the hero header back to clear; now `bridge.js` alone decides the header's look. On phones the search box can shrink (it ran off the screen before, on standalone Browse too). **Phones (24 Nov 2026, owner said fix):** the hero has no small-screen CSS of its own, so `bridge.css` adds it at 720px and under: the header goes to two rows (logo and account on top, the island centred under them, 112px; Browse's sticky row follows the header height on resize), the hero copy uses the width, and the arrows move down beside the dots (hidden at 360px and under, where the logo name hides and the buttons may wrap). Every v6 page was wider than a phone because v5's `footer .wrap{display:flex}` beat the footer's link grid; `v6.css` keeps it a grid, two columns under 900px. The glass top bar shows only the hamster under 480px. Profile tabs scroll sideways on phones. Checked at 390px: hero page, browse, project, profile, post and admin all fit. Still open at 320px only: project (title row), profile (stats) and admin (queue list) run 10 to 70px over.

**Focus (20 Nov 2026):** the owner has paused the home page; work only on the Browse page (`design/v6/browse.html`) for now.

**Next step:** compare the v2 home with `design/v2/index.html`, check phone width by eye, look over the old project and maker pages under the new top bar and footer, then commit and push once the owner says yes.

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
