# Flowboard — ROADMAP

Next.js + Supabase, realtime Kanban. Seeded from the portfolio build plan. One project at a time; nothing deploys without review at the gate.

- [x] **1 — Supabase schema + RLS.** `boards`, `columns`, `cards`, `card_labels`, plus one public demo board readable without signup. Auth configured. _(Demo board also anon-writable for the live demo; other boards owner-only.)_
- [x] **2 — Next.js App Router.** Server component for initial load; client board with dnd-kit drag/drop between columns and Framer Motion spring physics.
- [x] **3 — Realtime.** Supabase channels for row changes and for presence and cursors (names, per-user colors). Optimistic updates reconciled on server confirm.
- [x] **4 — Card details.** Description, labels, assignee, due date.
- [x] **5 — Signature.** Live presence cursors with names, spring-physics movement, a drag ghost when another user is dragging. _(Reduced-motion honored.)_
- [x] **6 — Tests.** Vitest units, Playwright drag-and-drop. CI green — on a real Supabase (`supabase start`).
- [ ] **7 — Deploy.** Vercel + Supabase, weekly cron ping, public demo board link. README with GIF + screenshots, topics, homepage, pin. **← paused here (GATE 3 stop); awaiting the user's Supabase + Vercel accounts and secrets.**
