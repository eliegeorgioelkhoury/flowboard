-- The public demo board (readable + writable by anyone via RLS).
-- Runs as the service role on `supabase db reset`, so RLS is bypassed here.

insert into public.boards (id, title, is_demo)
values ('11111111-1111-1111-1111-111111111111', 'Product launch', true)
on conflict (id) do nothing;

insert into public.columns (id, board_id, title, position) values
  ('aaaaaaaa-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'To do', 1000),
  ('aaaaaaaa-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', 'In progress', 2000),
  ('aaaaaaaa-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111111', 'Done', 3000)
on conflict (id) do nothing;

insert into public.cards (id, column_id, board_id, title, description, position, assignee, due_date) values
  ('bbbbbbbb-0000-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'Draft the launch announcement', 'Blog post + social copy.', 1000, 'Mira', '2026-07-10'),
  ('bbbbbbbb-0000-0000-0000-000000000002', 'aaaaaaaa-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'Finalize pricing tiers', null, 2000, null, null),
  ('bbbbbbbb-0000-0000-0000-000000000003', 'aaaaaaaa-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'Record the demo GIF', 'Show the drag + live cursors.', 3000, 'Theo', null),
  ('bbbbbbbb-0000-0000-0000-000000000004', 'aaaaaaaa-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', 'Wire realtime presence', 'Names + per-user colours.', 1000, 'Mira', '2026-07-05'),
  ('bbbbbbbb-0000-0000-0000-000000000005', 'aaaaaaaa-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', 'Polish the empty states', null, 2000, null, null),
  ('bbbbbbbb-0000-0000-0000-000000000006', 'aaaaaaaa-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111111', 'Set up the Supabase schema', 'Boards, columns, cards, labels + RLS.', 1000, 'Theo', null)
on conflict (id) do nothing;

insert into public.card_labels (id, card_id, label, color) values
  ('cccccccc-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 'marketing', 'rose'),
  ('cccccccc-0000-0000-0000-000000000002', 'bbbbbbbb-0000-0000-0000-000000000004', 'engineering', 'cyan'),
  ('cccccccc-0000-0000-0000-000000000003', 'bbbbbbbb-0000-0000-0000-000000000004', 'realtime', 'violet'),
  ('cccccccc-0000-0000-0000-000000000004', 'bbbbbbbb-0000-0000-0000-000000000006', 'engineering', 'cyan')
on conflict (id) do nothing;
