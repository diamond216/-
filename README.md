# Hamster Nest

The shelf for work made by people at Hamster Hub. Next.js (App Router, static export), React, TypeScript, Tailwind v4, shadcn, motion and anime.js.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # static files in out/
npm run lint
npm test
```

All projects, people, numbers and quotes are placeholders. The approved visual drafts are in `design/`.

**Picking this up in a new session? Start with [`docs/HANDOFF.md`](docs/HANDOFF.md).**

## Layout

- `src/domain/` — entities and value objects (`Project`, `Maker`, `ProjectUpdate`, `Category`, `Genre`, `Stage`, `Endorsement`, `LocalizedText`, …). No React.
- `src/data/` — repository interfaces and in-memory versions over the sample data. Update times are stored as "how long ago" so the shelf always looks alive.
- `src/services/` — ranking strategies, filter specifications, search (MiniSearch with a Thai word tokenizer), the shelf and activity digest, the contact form's validator and sender, the localizer, and stored preferences.
- `src/composition/createNest.ts` — the one place that picks concrete classes. Swap repositories or the message sender here for a real backend.
- `src/components/` — thin React components that are handed those objects.

To add a sort: write a `RankingStrategy`, register it in `createNest.ts`, add its label to `src/services/i18n/en.ts` and `th.ts`.
To add a filter: write a `Specification<Listing>` and add it in `ListingSpecificationBuilder`.
