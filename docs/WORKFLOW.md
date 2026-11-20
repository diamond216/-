# How we work on Hamster Nest (the same setup as the first session)

> **ภาษาไทยสั้น ๆ:** ไฟล์นี้คือ "ระบบและวิธีคิด" ทั้งหมดที่ใช้ใน session แรก ทุก session ใหม่ต้องทำตามนี้: คุยภาษาไทย, แบ่งบทบาท Manager / Researcher / Designer / Coder, **ทำภาพให้เจ้าของงานเลือกก่อนสร้างเสมอ**, สร้างเสร็จแล้วต้องจับภาพเทียบกับต้นแบบทีละส่วนจนเหมือน, เขียนโค้ดแบบ OOP, และเขียนข้อความแบบคนจริง ไม่ใช่แบบ AI

Read this together with `docs/HANDOFF.md` (project facts, decisions, code map, status).

---

## 1. The setup to recreate

| Piece | What it is | How to get it in a new session |
|---|---|---|
| Repository | `diamond216/-`, branch `claude/hamster-nest-portfolio-8gihhk` | Start the cloud session with this repo and branch selected |
| Cloud environment | **hamster-nest** (personal). Limited network, package managers allowed, plus the reference hosts below | Pick "hamster-nest" in the environment menu. Its setup script runs `npm ci`, so dependencies are ready (saved in session 1, not yet seen running on a fresh container; if `node_modules` is missing, run `npm ci`) |
| Allowed hosts | ui.shadcn.com, ui.aceternity.com, assets.aceternity.com, 21st.dev, cdn.21st.dev, assets.21st.dev, www.originkit.dev, cdn.originkit.dev, animejs.com, itch.io, static.itch.io, www.awwwards.com, assets.awwwards.com (awwwards drops connections from the cloud: see HANDOFF) | Already saved on the environment. If you need another host, ask the owner through the environment tools; never work around the proxy |
| Skill | `manager-researcher-coder` (account skill). It tells you to work as Manager / Researcher / Coder and show pictures first | It is synced to the owner's account. Invoke it at the start of every task. Its rules are also copied in section 2 |
| Related skills | `oop-design-playbook` (read before writing code). `dataviz` (read before any chart) | Invoke with the Skill tool |
| Design skill | `frontend-design` (plugin `frontend-design@claude-plugins-official`). The owner asked for all visual work to follow it from 17 Nov 2026 | Invoke it before drafting any picture. If it isn't installed, read `~/.claude/plugins/marketplaces/claude-plugins-official/plugins/frontend-design/skills/frontend-design/SKILL.md` |
| Browser | Pre-installed Chromium + Playwright (`require('playwright')`) | Never run `playwright install` |
| Tools in repo | `tools/shots.cjs`, `tools/compare.py`, `tools/options-sheet.py` | See section 5 |
| shadcn MCP (optional) | `npx shadcn@latest mcp init --client claude`. Free, needs ui.shadcn.com | Only if you want the registry as MCP tools; the CLI is enough |
| 21st.dev MCP / OriginKit MCP | Need API keys (21st `21st_sk_…`, paid generation; OriginKit `cmp_live_…`, 10 a day) | Not set up. Ask the owner for a key through `request_credential` if one is ever needed. Until then, hand-write the components |
| Owner's PC | DESKTOP-GEEKQH2, folder `D:\Hamster nest` | Cloud sessions could not attach it. If work must happen there, the owner runs a session on that PC |

## 2. Roles: the multi-agent system (owner's spec, 20 Nov 2026)

Four agents. The main session is the Manager; the others are spawned only when the job really needs them (not every task needs every agent). Pass the context forward in each brief. Every change stays inside the scope the owner approved.

| Agent | Role | Does | Must not |
|---|---|---|---|
| **1. Manager** (main session) | Project manager and quality control | Reads the request and sets the scope; hands work to the right agent; gathers what Researcher and Designer return; holds the scope; checks the build against the reference; sends it back until it matches | Change the design for the owner; change anything visual without showing a preview and getting approval; widen the scope without asking |
| **2. Researcher** | Technical research | Researches tech stack, skills, MCPs and tools; reads docs, APIs and techniques; checks compatibility; weighs pros, cons and limits; hands checked resources to Designer and Coder | Guess what a library can do; add a dependency without checking it is needed; state anything without a real source |
| **3. Designer** | UI/UX and motion | Analyses the reference; sets visual direction, layout and design system; designs interaction and motion; studies component libraries and techniques; makes previews/prototypes; writes the design spec for the Coder | Change the design direction on their own; implement a new design before the owner picks a preview; add effects outside the scope |
| **4. Coder** | Developer | Builds the approved scope with the Researcher's resources and the Designer's spec; keeps code maintainable and reusable; tests function, responsiveness and performance; hands results to the Manager | Change the design; touch files outside the scope without permission; switch approach on a technical limit without reporting it first |

Global flow: Manager scopes -> Researcher researches -> Designer analyses and makes a preview -> **owner approves the preview** -> Coder builds -> Manager checks against the reference -> back for fixes if it differs -> deliver once it passes.

Reference resources (pick what fits each job): https://animejs.com/, https://www.originkit.dev/, https://21st.dev/, https://ui.aceternity.com/components.

In practice:

- Spawn Researcher, Designer or Coder with the `Agent` tool (`general-purpose`, or `web-fetch` for reading one page). For small jobs the Manager does the step itself but keeps the steps separate and still shows a preview first.
- The goal: work that matches the reference, good code, and every design decision left with the owner.
- Talk to the owner in **Thai** (ฉัน/คุณ). Code, comments, commit messages and docs stay in English.

## 3. The loop for every task

1. **Scope (Manager).** Restate the goal in one or two lines. Ask only what changes what gets built (`AskUserQuestion`, 2–4 options, recommended option first).
2. **Research (Researcher).** Look up the techniques, check the reference sites, and capture reference screenshots. Verify against live docs and `npm view`; don't trust memory for fast-moving libraries.
3. **Show and decide.** Build 2–3 options as static HTML mockups (section 4) and render them to PNG. Send them with `SendUserFile` (`display: render`). Then ask which one. **Do not build before the answer.** If the owner asks for a different look, make new options and show them again.
4. **Build (Coder).** Implement only the chosen option.
5. **Check (Manager).** Screenshot the build and the reference at the same width, and compare them side by side, band by band (`tools/compare.py`). Look at layout, spacing, size, font, colour, copy, order and motion end state. Fix the differences, or send them back to the Coder, and repeat until they match.
6. **Report.** Send the final pictures. Say what changed, what still differs from the reference and why, and what's waiting on the owner. Commit and push.

Things the owner has corrected along the way (follow them):

- When the owner says "go look at the references again", reopen the real sites and make a reference-vs-draft sheet before asking anything else.
- If a graphic feels technical, offer friendlier, more casual options. That's how the tick wheel became a donut. Prettiness matters, so polish the options before showing them.
- When the owner says something is approved ("ผ่านหมด"), move straight to the build. Don't re-ask.
- If the owner drops a feature (like the positioning chart), remove it from drafts and code, and note it in HANDOFF so it doesn't come back.

## 4. Making pictures (mockups and options)

- Drafts and mockups are **plain static HTML/CSS** in `design/<page>/index.html`. They reuse `design/landing/styles.css` and `design/pages.css` so they look like the real site. Placeholder covers are CSS patterns: no stock photos, no AI images.
- The drafts understand `?theme=night` and `?lang=th`, the same as the app.
- Use the same fonts as the site (Bricolage Grotesque, Anuphan, JetBrains Mono). Google Fonts loads in the cloud container, and the app uses `@fontsource-variable/*`.
- For an A/B/C choice, put the options in one HTML file and render it at `deviceScaleFactor: 2`. Give each option a short label: what it is, and why you'd pick it.
- Number the options. Say which is recommended only when there's a real reason.
- Throwaway option files go in the session scratchpad. Pictures of decisions the owner made go in `docs/decisions/` (JPEG, about 1600px wide).
- Check every picture yourself (Read the PNG) before sending. Look for clipped text, overlaps and wrong labels.

## 5. Tools

```bash
# Screenshots. Works on a draft file or a running/static site; variants: day-en, night-en, day-th, night-th
node tools/shots.cjs design/project/index.html /tmp/shots --name=draft-project --widths=1440,390 --variants=day-en,night-en,day-th
npm run build && npx serve out -l 8765 &      # or: cd out && python3 -m http.server 8765
node tools/shots.cjs http://localhost:8765/projects/burrow-knights/ /tmp/shots --name=build-project --variants=day-en,night-en,day-th
node tools/shots.cjs http://localhost:8765/ /tmp/shots --name=home --motion   # end state with animations on

# Side by side, in 1500px bands: reference on the left, build on the right
python3 tools/compare.py /tmp/shots/draft-project-day-en-1440.png /tmp/shots/build-project-day-en-1440.png /tmp/shots/cmp

# One sheet of options to show the owner
python3 tools/options-sheet.py /tmp/shots/options.png a.png b.png c.png --cols=3
```

- Screenshots you'll look at yourself: scale 1. Screenshots for the owner: scale 2. Images over 8000px tall get scaled down when sent; offer a zip if the owner needs the full size.
- `HORIZONTAL OVERFLOW` in the output is a bug at that width. Fix it. (The static drafts were never made for 390px; the app was.)
- Stop any server you started before you finish.

## 6. Working with agents

- Launch Researcher and Coder in the background. Give them a full, standalone brief:
  - The project context.
  - Exact file paths for the references.
  - The rules from this file: OOP, copy, visuals, motion.
  - What's in and out of scope.
  - Done means: build, lint and tests pass, plus screenshots compared with the reference.
  - The commit trailer, and "don't touch `design/`" (drafts are the reference).
  - "Report back: what you built, commands run and their results, screenshot paths, remaining differences, decisions the brief didn't cover."
- Agents can stop on usage limits. When the limit resets, resume the **same** agent with `SendMessage` (its work is saved) instead of starting a new one. Tell it to commit in small steps so progress survives.
- While an agent is busy on code, don't commit its half-done files yourself. Do non-overlapping work instead, such as the next page's draft.
- An agent's report is not the owner's approval. Verify it yourself: run the tests and build, look at the screenshots, then report to the owner.

## 7. Code rules

- **OOP** (invoke `oop-design-playbook` first). Domain classes and value objects live in `src/domain`, with no React. Repositories are interfaces with in-memory implementations. Services hold the rules: strategy for ranking, specification for filters. `src/composition/createNest.ts` is the only place that chooses concrete classes. Components stay thin.
- Data lives in `src/data/sample/` as "time ago" offsets. Everything users read is `LocalizedText` (EN + TH). The Thai dictionary is typed against the English one, so a missing translation fails the type check.
- Every rule gets a vitest test (`npm test`). Before any commit, `npm run build` (static export), `npm run lint` and `npm test` must pass.
- Next 16 has breaking changes. Read `AGENTS.md` and `node_modules/next/dist/docs/` before using Next APIs.
- Animation: anime.js *or* `motion/react` per element, never both (an element animated by both got stuck at opacity 0). Respect reduced motion.

## 8. Writing and design rules (the owner's own prompt)

The owner gave this as the standard for all copy and UI. Keep to it:

> Act as an experienced independent web designer and human copywriter. Write the copy and design the UI/UX with the following strict rules so it feels genuinely human-made and completely avoids generic "AI slop":
>
> 1. **Human copywriting rules:**
>    - Write like a real person talking to a customer, not a corporate brochure.
>    - Ban all AI clichés and buzzwords: never use words like "elevate," "delve," "tapestry," "seamless," "empower," "game-changer," "unlock," "transform," or "in today's digital landscape."
>    - Keep headlines punchy, clear, and honest. Explain what the site actually does in plain English.
>    - Vary sentence lengths naturally. Use casual contractions (it's, we're, don't) and avoid robotic exclamation marks.
> 2. **Human UI & design rules:**
>    - Avoid generic SaaS templates: no standard purple/blue gradients, no floating 3D abstract blobs, and no repetitive 3-column icon grids.
>    - Design with intentional asymmetry, generous whitespace, and clear visual hierarchy.
>    - Use warm, grounded color palettes: off-white backgrounds, dark charcoal text instead of pure black, and one bold, unexpected accent color.
>    - Choose expressive, readable typography (pair a distinct display font with a clean sans-serif or monospace font) rather than default Inter/Roboto everywhere.
>    - Make micro-copy (buttons, error messages, form placeholders) feel warm and helpful (e.g., use "Send it over" instead of "Submit").

The tokens that came out of it (v1; for v2 see HANDOFF decision 13 and `design/v2/v2.css`):

- **Colours:** paper `#f3eee4`, surface `#fbf8f1`, ink `#25211c`, ink-soft `#655c50`, line `#d8cebb`, accent (persimmon) `#e0482a`, fresh `#2f7d55`, sand `#e2c98f`.
- **Night theme:** same roles, warm dark palette.
- **Fonts:** Bricolage Grotesque (display), Anuphan (body; it has Thai), JetBrains Mono (labels).

All names, numbers and quotes are placeholders, and the footer says so. Don't present made-up data as real.

## 9. Git and delivery

- Work on `claude/hamster-nest-portfolio-8gihhk`. Commit in small, clear steps, ending each message with the attribution lines the harness gives. Push when a step is verified.
- Don't open a pull request unless the owner asks.
- If a push is refused with 403, GitHub access for Claude needs fixing. Tell the owner, and keep the commits safe locally.
- The owner may want files on their PC (`D:\Hamster nest`). Options: `git clone -b claude/hamster-nest-portfolio-8gihhk https://github.com/diamond216/-.git`, a zip sent with `SendUserFile`, or a session running on that PC.
