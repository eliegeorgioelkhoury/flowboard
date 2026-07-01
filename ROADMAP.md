# Flowboard — ROADMAP

Next.js + Supabase, realtime Kanban. Seeded from the portfolio build plan. One project at a time; nothing deploys without review at the gate.

- [ ] **1 — Supabase schema + RLS.** `boards`, `columns`, `cards`, `card_labels`, plus one public demo board readable without signup. Auth configured.
- [ ] **2 — Next.js App Router.** Server components for initial load; client board with dnd-kit drag/drop between columns and Framer Motion spring physics.
- [ ] **3 — Realtime.** Supabase channels for row changes and for presence and cursors (names, per-user colors). Optimistic updates reconciled on server confirm.
- [ ] **4 — Card details.** Description, labels, assignee, due date.
- [ ] **5 — Signature.** Live presence cursors with names, spring-physics movement, a drag ghost when another user is dragging.
- [ ] **6 — Tests.** Vitest units, Playwright drag-and-drop. CI green.
- [ ] **7 — Deploy.** Vercel + Supabase, weekly cron ping, public demo board link. README with GIF + screenshots, topics, homepage, pin.
