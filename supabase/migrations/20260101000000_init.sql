-- Flowboard schema: boards, columns, cards, card_labels + RLS + realtime.

create extension if not exists "pgcrypto";

-- ---------- Tables ----------
create table public.boards (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  owner_id uuid references auth.users(id) on delete cascade,
  is_demo boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.columns (
  id uuid primary key default gen_random_uuid(),
  board_id uuid not null references public.boards(id) on delete cascade,
  title text not null,
  position double precision not null default 1000,
  created_at timestamptz not null default now()
);
create index columns_board_idx on public.columns (board_id);

create table public.cards (
  id uuid primary key default gen_random_uuid(),
  column_id uuid not null references public.columns(id) on delete cascade,
  board_id uuid not null references public.boards(id) on delete cascade,
  title text not null,
  description text,
  position double precision not null default 1000,
  assignee text,
  due_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index cards_column_idx on public.cards (column_id);
create index cards_board_idx on public.cards (board_id);

create table public.card_labels (
  id uuid primary key default gen_random_uuid(),
  card_id uuid not null references public.cards(id) on delete cascade,
  label text not null,
  color text not null default 'violet',
  created_at timestamptz not null default now()
);
create index card_labels_card_idx on public.card_labels (card_id);

-- Keep cards.updated_at fresh on every update.
create or replace function public.touch_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
create trigger cards_touch_updated_at before update on public.cards
  for each row execute function public.touch_updated_at();

-- ---------- Row-Level Security ----------
alter table public.boards enable row level security;
alter table public.columns enable row level security;
alter table public.cards enable row level security;
alter table public.card_labels enable row level security;

-- The demo board is open to everyone (anon included); every other board is owner-only.
-- SECURITY DEFINER so column/card policies can check the board without recursive RLS.
create or replace function public.can_access_board(b uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.boards
    where id = b and (is_demo or owner_id = auth.uid())
  );
$$;

create policy "boards readable" on public.boards for select
  using (is_demo or owner_id = auth.uid());
create policy "boards insert own" on public.boards for insert
  with check (owner_id = auth.uid());
create policy "boards update own" on public.boards for update
  using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy "boards delete own" on public.boards for delete
  using (owner_id = auth.uid());

create policy "columns access" on public.columns for all
  using (public.can_access_board(board_id))
  with check (public.can_access_board(board_id));

create policy "cards access" on public.cards for all
  using (public.can_access_board(board_id))
  with check (public.can_access_board(board_id));

create policy "labels access" on public.card_labels for all
  using (exists (select 1 from public.cards c where c.id = card_id and public.can_access_board(c.board_id)))
  with check (exists (select 1 from public.cards c where c.id = card_id and public.can_access_board(c.board_id)));

-- ---------- Realtime (postgres_changes) ----------
alter table public.columns replica identity full;
alter table public.cards replica identity full;
alter table public.card_labels replica identity full;
alter publication supabase_realtime add table public.columns;
alter publication supabase_realtime add table public.cards;
alter publication supabase_realtime add table public.card_labels;
