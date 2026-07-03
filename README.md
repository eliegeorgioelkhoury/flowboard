# Flowboard

[![CI](https://github.com/eliegeorgioelkhoury/flowboard/actions/workflows/ci.yml/badge.svg)](https://github.com/eliegeorgioelkhoury/flowboard/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

> Realtime multiplayer Kanban. Drag cards with spring physics and watch collaborators' live cursors move with their names. Optimistic updates, reconciled on server confirm.

**Status:** ✅ Milestones 1–6 built & tested (schema/RLS, board, realtime, card details, signature cursors, tests). ⏸️ Paused before deploy. See [STATE.md](STATE.md) · [ROADMAP.md](ROADMAP.md).

<!-- TODO: replace with a looping capture of two cursors dragging cards live; drop the file at docs/demo.gif -->
![Flowboard demo — coming soon](https://placehold.co/1200x600/4338ca/f8fafc?text=Flowboard+demo+GIF+coming+soon)

## Screenshots
<!-- TODO: add real captures under docs/ and swap these placeholders -->
| Board | Live cursors | Card details | Public demo board |
|---|---|---|---|
| ![Board](https://placehold.co/300x200?text=Board) | ![Cursors](https://placehold.co/300x200?text=Live+cursors) | ![Card](https://placehold.co/300x200?text=Card+details) | ![Demo](https://placehold.co/300x200?text=Demo+board) |

## Features
- Drag & drop cards between columns with **dnd-kit** + **Framer Motion** spring physics.
- **Live presence:** per-user cursors with names and colors; a drag ghost when another user is dragging.
- Realtime row sync over Supabase channels; optimistic updates reconciled on server confirm.
- Card details: description, labels, assignee, due date.
- One **public demo board**, readable without signup.

## Stack
- **Frontend:** Next.js (App Router) · React · TypeScript · dnd-kit · Framer Motion
- **Backend:** Supabase — Postgres, Realtime, Auth, Row-Level Security
- **Tests:** Vitest (units) · Playwright (drag-and-drop)
- **CI:** GitHub Actions — typecheck, lint, unit tests, build, then a Playwright E2E against a **real Supabase** (`supabase start`)

## Architecture
```
Next.js (Vercel) ⇄ Supabase (Postgres + Realtime + Auth)
   server components → initial load
   client board      → Postgres change + presence/cursor channels
```
- Server components render the initial board; the client subscribes to row changes and to presence/cursor channels.
- RLS keeps each user scoped to their boards, while one demo board stays publicly readable.
- A **weekly GitHub Actions cron** pings the Supabase project so the free tier never pauses.
- Milestone-by-milestone breakdown in [ROADMAP.md](ROADMAP.md).

## Run locally

```bash
git clone git@github.com:eliegeorgioelkhoury/flowboard.git && cd flowboard
npm ci
npm run dev            # http://localhost:3000
```

Without Supabase configured, the board renders from a **static seed** so you can preview the UI — drag/drop animates locally but nothing persists and there's no realtime. For the full experience (persistence, realtime row sync, presence cursors), point it at Supabase:

```bash
# Option A — local Supabase (needs Docker); applies migrations + seed automatically
supabase start
supabase status -o env          # copy API URL + anon key into .env.local

# Option B — a hosted Supabase project
cp .env.example .env.local      # fill in NEXT_PUBLIC_SUPABASE_URL + ANON_KEY
supabase db push                # apply supabase/migrations + seed
```

```bash
npm run typecheck      # tsc --noEmit
npm run lint
npm test               # Vitest units
npm run e2e            # Playwright drag-and-drop (expects a running Supabase + build)
```

## Project layout
```
flowboard/
├── app/          # Next.js App Router — server load + globals/tokens
├── components/   # board, cards, presence cursors, card detail panel
├── lib/          # Supabase client, realtime, board reducer, ordering, presence
├── supabase/     # SQL migrations + RLS policies + seed
├── tests/        # Vitest units (ordering, reducer, presence)
├── e2e/          # Playwright drag-and-drop spec
└── docs/         # demo GIF, screenshots
```

## License
[MIT](LICENSE) © 2026 Elie El Khoury
