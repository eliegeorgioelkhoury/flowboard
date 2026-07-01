# CLAUDE.md — Flowboard

Guidance for Claude Code when working in this repository.

## What this is
Flowboard is a realtime multiplayer Kanban board. The signature experience: spring-physics drag & drop plus live presence cursors (names + per-user colors), with optimistic updates reconciled on server confirm.

## Stack
- **Frontend:** Next.js (App Router) + React + TypeScript. Server components for initial load; a client board with dnd-kit drag/drop and Framer Motion spring physics.
- **Backend:** Supabase — Postgres, Realtime channels, Auth, Row-Level Security.
- **Tests:** Vitest (units), Playwright (drag-and-drop).

## Layout (target)
- `app/` — Next.js App Router routes (milestone 2)
- `components/` — board, cards, presence cursors
- `lib/` — Supabase client, realtime subscriptions, state
- `supabase/` — SQL migrations + RLS policies (milestone 1)
- `docs/` — demo GIF, screenshots

> As of GATE 1, only repo hygiene, CI, and docs exist. App code arrives from milestone 1 onward.

## Conventions
- **Commits:** Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, `ci:`, `test:`, `refactor:`).
- **Secrets:** never commit real secrets. `.env.example` is the template; `NEXT_PUBLIC_*` values are browser-safe, `SUPABASE_SERVICE_ROLE_KEY` is server-only. Real values live in host dashboards and GitHub Actions secrets.
- **Realtime:** optimistic UI updates must reconcile against the server's confirmed row state.
- **RLS:** users are scoped to their own boards; keep exactly one public demo board readable without signup.
- **Accessibility & motion:** responsive to mobile, visible keyboard focus, honor `prefers-reduced-motion`.

## Commands (once scaffolded)
- Dev: `npm run dev` · lint `npm run lint` · test `npm test` · build `npm run build`

## Living docs
- Current status: [STATE.md](STATE.md)
- Plan: [ROADMAP.md](ROADMAP.md)
