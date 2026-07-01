# Flowboard — STATE

**Status:** not started
**Next:** milestone 1 — Supabase schema + RLS (`boards`, `columns`, `cards`, `card_labels`; one public demo board; auth configured)

_Living doc. Update after each milestone: what shipped, what's in flight, what's blocked._

## Now
- Repo scaffolded at GATE 1 — license, `.gitignore`, README, CI skeleton, `CLAUDE.md`, `.env.example`, living docs. No app code yet.

## Next
- **Milestone 1:** Supabase schema + RLS for `boards`, `columns`, `cards`, `card_labels`, plus one public demo board readable without signup. Auth configured.

## Done
- GATE 1 — repository hygiene, CI, and living docs.

## Blocked
- _none_

## Deploy
- **Homepage:** TODO — set to the Vercel URL (and public demo board link) once live (milestone 7).
- Frontend → Vercel · Backend/DB → Supabase (Postgres, Realtime, Auth).
- **Keep-alive:** a weekly GitHub Actions cron pings the Supabase project so the free tier never pauses.
