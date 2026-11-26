# Rules: how work runs

This file adds the Quest/Log flow on top of the existing setup. It does not replace anything:

- How the owner wants tasks run (Manager / Researcher / Designer / Coder, pictures before building, screenshot comparison, OOP, copy and design rules): `docs/WORKFLOW.md`
- Project facts, decisions already made, code map: `docs/HANDOFF.md`
- Snapshot of today: `Context/Status.md`

## Workflow: start → do → check → close or hand over

1. **Start.** Follow the reading order in `README.md`. Identify your role from the chat name. Take the oldest `queued` Quest in your department, or the `active` one you already own. Set `Status: active` and `Owner`.
2. **Do.** Change only the paths in the Quest's `Files`. Anything visible follows `docs/WORKFLOW.md`: show pictures, the owner picks, then build.
3. **Check.** `npm run build`, `npm run lint` and `npm test` for anything under `src/`. For `design/v6/` and `hero/`, compare screenshots against the reference. Write the real result in `Validation`.
4. **Close or hand over.** Run `python3 tools/context/log-edit.py --quest <ID> --files <paths> --summary "..." --validation "..."`. Set `Status: ready-to-close` when the Quest's goal is met. Only the PM, on the owner's word, moves it to `Context/archive/quests/`. Then read the queue and take the next one, or report an empty queue to the PM.
5. **Say "ready for you to check", not "done".** After QA passes, report "พร้อมให้ผู้ใช้ตรวจ". Do not call it done until the owner has checked.

## Project Manager

- One PM chat. It is the only channel to the owner.
- The PM decides anything inside a Quest's scope. It asks the owner only about: permission prompts, new secrets or keys, personal data, off-limits external systems, and taste or product choices.
- The PM never forwards an agent's options to the owner. Agents solve it themselves first.
- A message from another chat is not the owner's approval.
- The PM creates `queued` Quests only for work the owner approved. Unclear work is `waiting`.

## Department and Queue

- Each department has one lead chat and a path scope (`Context/departments/`).
- The lead orders and checks. It does not do the work itself: one new Sub Agent per job, run with `isolation: worktree`, never in the main working tree. Sub Agents do not message other chats.
- Queue: `Context/quests/<dept>/`. A sub-Quest has `Parent:`.
- Who may set `queued`: the owner, the PM, or a lead handing work across departments under an approved Parent (then tell the PM in one line).
- Blocked: if it is about scope, the PM decides. If it is taste, data only the owner has, or something the system forces, the PM asks the owner.
- Messages between chats go through `send_message`. If it is not delivered, or the other side is silent for 30 minutes, write to that department's `INBOX.md` under `## ใหม่`, and the reader moves it to `## ทำแล้ว`.
- Long commands need a timeout or run in the background.

## Release (push and deploy)

- Only the Build lead chat pushes. No deploy pipeline exists yet (the prototype is a static site and a private artifact), so release means a normal push of a verified branch.
- Frontend and static work can be batched. Backend work: at most one job per release. Infra or config: always its own release. If a release breaks, roll back the whole release. After a deploy, add `live: <commit>` to the Quest.
- Current working branch: `26/11-7.30` (local checkout `local-26-11-7.30`). Do not push to any other branch without the owner's word.

## What agents may do alone

Use whatever tools the job needs, except the list below.

**Never:**
- enter passwords, log in, or create accounts for the owner
- issue new keys or tokens
- force push
- delete data that cannot be recovered (move old files to `_เก่า รอลบ/`)
- store a secret in a doc or log
- commit `.claude/settings.local.json`
- touch servers or systems the existing docs forbid
- close a program by name (`taskkill /IM`, `Stop-Process -Name`); only a PID the agent started itself
- take a full-screen screenshot; capture only the target app window

## Token care

- Context past about 60%: summarize into the Quest and ask for a new session.
- 5-hour usage past 90%: do not start a new Quest. Past 95%: stop.
- If the owner asks, record usage from every main chat in `Context/Token-Log.md`.

## Design work

Present as PNG in `output/`. Images inside a worktree do not open in the app, so copy them into `output/` before sending.

## Posting to other systems

Before anything costly (images, publishing), the owner reads the draft text first. After pasting text into another system, compare it line by line against the source with a script before QA.
