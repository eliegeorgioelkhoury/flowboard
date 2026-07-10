# Flowboard — STATE

**Status:** ✅ **Complete — shipped & live** at https://flowboard-five-ochre.vercel.app (milestones 1–7). CI green; keep-warm cron green.
**Next:** none required. Optional polish: swap the README placeholder GIF + screenshots for real captures.

_Living doc. Update after each milestone: what shipped, what's in flight, what's blocked._

## Now
- **Live in production** at https://flowboard-five-ochre.vercel.app — Next.js on Vercel + a Supabase project; the public demo board loads without login and drag / persistence / realtime work (owner-confirmed). The **keep-warm** cron ([`.github/workflows/keep-warm.yml`](.github/workflows/keep-warm.yml)) is green, so the free project won't auto-pause.
- CI is green on real tests: Vitest units + a Playwright drag-and-drop E2E against a **real Supabase** (`supabase start` on the runner). Local `npm run dev` still renders from a static-seed fallback when no Supabase env is set. The app reads only the two `NEXT_PUBLIC_` Supabase values — no service-role key.

## Done
- **GATE 1** — repository hygiene, CI, living docs.
- **M1** — Supabase migrations: `boards`, `columns`, `cards`, `card_labels`; RLS (the demo board is open to anyone, every other board is owner-only via `can_access_board`); realtime publication; seeded public demo board. Auth configured (RLS uses `auth.uid()`).
- **M2** — Next.js App Router: a server component loads the board; a client board with **dnd-kit** drag/drop between columns and **Framer Motion** spring layout (`DragOverlay` + `layout`).
- **M3** — **Supabase Realtime**: `postgres_changes` for cards/columns/labels; presence + broadcast for online users and cursors (names, per-user accent colours). **Optimistic** updates via a pure reducer, reconciled by realtime upserts.
- **M4** — Card detail panel: description, labels (`card_labels`), assignee, due date.
- **M5** — Signature: live presence cursors with names + accent colours and spring movement; a "dragging" flag broadcast so peers see who's dragging; a lifted drag ghost. `prefers-reduced-motion` disables the card + cursor springs.
- **M6** — **Vitest** units (ordering, board reducer, presence) + a **Playwright** drag-and-drop E2E that moves a card across columns and reloads to prove persistence. CI green on real tests.

## Next
- **None required — Flowboard is done** (all 7 milestones). Optional finishing polish: replace the README hero GIF and the four screenshot placeholders with real captures of drag + presence (drop files under `docs/`).

## Blocked
- Nothing. Deploy shipped; repo topics, homepage, and profile pin are done.

## Design + a11y
- Tokens: **Canvas / Ink** surfaces + per-user accents **Violet / Cyan / Rose / Amber**; **Satoshi** (display) + **Inter** (body). Visible keyboard focus, contrast-checked colours, consistent spacing.
