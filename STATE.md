# Flowboard — STATE

**Status:** in progress — milestones 1–6 built and tested; **paused before deploy** (milestone 7)
**Next:** milestone 7 — Deploy (awaiting the user's own Supabase + Vercel accounts and secrets)

_Living doc. Update after each milestone: what shipped, what's in flight, what's blocked._

## Now
- Local: `npm run dev` renders the board from a **static-seed fallback** (no Supabase needed for a visual preview). Realtime + persistence require Supabase.
- CI is green on real tests: Vitest units + a Playwright drag-and-drop E2E run against a **real Supabase** (`supabase start` on the runner — Postgres + RLS + realtime), no cloud project required.

## Done
- **GATE 1** — repository hygiene, CI, living docs.
- **M1** — Supabase migrations: `boards`, `columns`, `cards`, `card_labels`; RLS (the demo board is open to anyone, every other board is owner-only via `can_access_board`); realtime publication; seeded public demo board. Auth configured (RLS uses `auth.uid()`).
- **M2** — Next.js App Router: a server component loads the board; a client board with **dnd-kit** drag/drop between columns and **Framer Motion** spring layout (`DragOverlay` + `layout`).
- **M3** — **Supabase Realtime**: `postgres_changes` for cards/columns/labels; presence + broadcast for online users and cursors (names, per-user accent colours). **Optimistic** updates via a pure reducer, reconciled by realtime upserts.
- **M4** — Card detail panel: description, labels (`card_labels`), assignee, due date.
- **M5** — Signature: live presence cursors with names + accent colours and spring movement; a "dragging" flag broadcast so peers see who's dragging; a lifted drag ghost. `prefers-reduced-motion` disables the card + cursor springs.
- **M6** — **Vitest** units (ordering, board reducer, presence) + a **Playwright** drag-and-drop E2E that moves a card across columns and reloads to prove persistence. CI green on real tests.

## Next
- **Milestone 7 — Deploy.** Vercel (Next.js) + a Supabase project; weekly cron ping to keep the free tier warm; public demo-board link; README GIF + screenshots; homepage; pin.

## Blocked
- Deploy is intentionally **paused for review** (GATE 3 stop). It needs the user's own Supabase + Vercel accounts and secrets (no real secrets are committed).

## Design + a11y
- Tokens: **Canvas / Ink** surfaces + per-user accents **Violet / Cyan / Rose / Amber**; **Satoshi** (display) + **Inter** (body). Visible keyboard focus, contrast-checked colours, consistent spacing.
