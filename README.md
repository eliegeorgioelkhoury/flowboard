# Flowboard

[![CI](https://github.com/eliegeorgioelkhoury/flowboard/actions/workflows/ci.yml/badge.svg)](https://github.com/eliegeorgioelkhoury/flowboard/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

> Realtime multiplayer Kanban. Drag cards with spring physics and watch collaborators' live cursors move with their names. Optimistic updates, reconciled on server confirm.

**Status:** 🚧 Scaffolding (GATE 1). See [STATE.md](STATE.md) · [ROADMAP.md](ROADMAP.md).

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
- **CI:** GitHub Actions — build, lint, test

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
> Not scaffolded yet — GATE 1 is repo hygiene + CI. These are the intended steps; they firm up in milestones 1–2.

```bash
# 1. Clone
git clone git@github.com:eliegeorgioelkhoury/flowboard.git && cd flowboard

# 2. Configure environment
cp .env.example .env.local   # fill in your Supabase URL + anon key

# 3. Install and run — http://localhost:3000
npm ci
npm run dev
```

## Project layout
```
flowboard/
├── app/          # Next.js App Router               (milestone 2)
├── components/   # board, cards, presence cursors
├── lib/          # Supabase client, realtime, state
├── supabase/     # SQL migrations + RLS policies     (milestone 1)
└── docs/         # demo GIF, screenshots
```

## License
[MIT](LICENSE) © 2026 Elie El Khoury
