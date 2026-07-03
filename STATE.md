# Flowboard — STATE

**Status:** milestones 1–6 built & CI-green; **milestone 7 deploy config prepared** (config only — nothing deployed yet)
**Next:** run the deploy — create the Supabase + Vercel projects, set the env vars / cron secrets, push the schema (manual dashboard steps; awaiting the owner's accounts)

_Living doc. Update after each milestone: what shipped, what's in flight, what's blocked._

## Now
- Local: `npm run dev` renders the board from a **static-seed fallback** (no Supabase needed for a visual preview). Realtime + persistence require Supabase.
- CI is green on real tests: Vitest units + a Playwright drag-and-drop E2E run against a **real Supabase** (`supabase start` on the runner — Postgres + RLS + realtime), no cloud project required.
- **Deploy config is in place** (config only, nothing deployed): `vercel.json` (zero-config Next.js), a twice-weekly `keep-warm` cron ([`.github/workflows/keep-warm.yml`](.github/workflows/keep-warm.yml)), and the exact Vercel env vars + cron secrets documented in the [README](README.md#deploy-vercel--supabase). The app reads only the two `NEXT_PUBLIC_` Supabase values — no service-role key.

## Done
- **GATE 1** — repository hygiene, CI, living docs.
- **M1** — Supabase migrations: `boards`, `columns`, `cards`, `card_labels`; RLS (the demo board is open to anyone, every other board is owner-only via `can_access_board`); realtime publication; seeded public demo board. Auth configured (RLS uses `auth.uid()`).
- **M2** — Next.js App Router: a server component loads the board; a client board with **dnd-kit** drag/drop between columns and **Framer Motion** spring layout (`DragOverlay` + `layout`).
- **M3** — **Supabase Realtime**: `postgres_changes` for cards/columns/labels; presence + broadcast for online users and cursors (names, per-user accent colours). **Optimistic** updates via a pure reducer, reconciled by realtime upserts.
- **M4** — Card detail panel: description, labels (`card_labels`), assignee, due date.
- **M5** — Signature: live presence cursors with names + accent colours and spring movement; a "dragging" flag broadcast so peers see who's dragging; a lifted drag ghost. `prefers-reduced-motion` disables the card + cursor springs.
- **M6** — **Vitest** units (ordering, board reducer, presence) + a **Playwright** drag-and-drop E2E that moves a card across columns and reloads to prove persistence. CI green on real tests.

## Next
- **Milestone 7 — Deploy (execute).** Create the Supabase project + apply `migrations`/`seed`; create the Vercel project + set the two `NEXT_PUBLIC_` env vars; add the two `keep-warm` repo secrets. Then: public demo-board link, README GIF + screenshots, homepage, pin.

## Blocked
- The deploy itself is a **manual dashboard step** awaiting the owner's Supabase + Vercel accounts and secrets. All config is committed; no real secrets are.

## Design + a11y
- Tokens: **Canvas / Ink** surfaces + per-user accents **Violet / Cyan / Rose / Amber**; **Satoshi** (display) + **Inter** (body). Visible keyboard focus, contrast-checked colours, consistent spacing.
