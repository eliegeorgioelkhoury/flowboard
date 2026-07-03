# CLAUDE.md — Flowboard

Guidance for Claude Code when working in this repository.

## What this is
Flowboard is a realtime multiplayer Kanban board. The signature experience: spring-physics drag & drop plus live presence cursors (names + per-user colors), with optimistic updates reconciled on server confirm.

## Stack
- **Frontend:** Next.js (App Router) + React + TypeScript. Server components for initial load; a client board with dnd-kit drag/drop and Framer Motion spring physics.
- **Backend:** Supabase — Postgres, Realtime channels, Auth, Row-Level Security.
- **Tests:** Vitest (units), Playwright (drag-and-drop).

## Layout
- `app/` — Next.js App Router: `page.tsx` (server load, `force-dynamic`), `layout.tsx`, `globals.css` (design tokens)
- `components/board/` — `BoardView` (orchestrator), `Column`, `CardItem`, `CardDetailPanel`, `PresenceLayer`, and the `useRealtime` / `usePresence` hooks
- `lib/` — Supabase client/server, `board.ts` (server load + static fallback), `board-reducer.ts`, `ordering.ts`, `presence.ts`, `types.ts`, `demo-data.ts`
- `supabase/` — SQL migrations, RLS policies, seed
- `tests/` — Vitest units · `e2e/` — Playwright drag-and-drop
- `docs/` — demo GIF, screenshots

> Milestones 1–6 are built and CI-green. Deploy (milestone 7) is intentionally paused for review.

## Key design decisions
- **Static-seed fallback:** when Supabase env is absent, `lib/board.ts` serves `DEMO_BOARD` so the UI previews without a backend. `live:false` disables realtime + persistence.
- **Optimistic + realtime:** the UI mutates a pure reducer (`board-reducer.ts`) immediately, then reconciles against `postgres_changes` upserts. Ordering uses fractional `position` floats (`ordering.ts`) so a reorder only writes the moved card.
- **dnd-kit + Framer:** drag uses a `DragOverlay` (source card dims), and siblings spring via `layout="position"` — this avoids the transform conflict between dnd-kit and Framer layout animations.
- **Motion a11y:** `prefers-reduced-motion` disables both the card springs and the presence-cursor springs (see `globals.css` + `CardItem` / `PresenceLayer`).

## Conventions
- **Commits:** Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, `ci:`, `test:`, `refactor:`).
- **Secrets:** never commit real secrets. `.env.example` is the template; the app needs only the two `NEXT_PUBLIC_*` Supabase values (browser-safe) — every read goes through the anon/publishable key + RLS, so there is no service-role key. Real values live in host dashboards (Vercel) and GitHub Actions secrets.
- **Realtime:** optimistic UI updates must reconcile against the server's confirmed row state.
- **RLS:** users are scoped to their own boards; keep exactly one public demo board readable without signup.
- **Accessibility & motion:** responsive to mobile, visible keyboard focus, honor `prefers-reduced-motion`.

## Commands (once scaffolded)
- Dev: `npm run dev` · lint `npm run lint` · test `npm test` · build `npm run build`

## Living docs
- Current status: [STATE.md](STATE.md)
- Plan: [ROADMAP.md](ROADMAP.md)
