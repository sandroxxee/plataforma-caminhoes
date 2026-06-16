-- Tabela de favoritos
create table if not exists public.favoritos (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  truck_id   uuid not null references public.trucks(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(user_id, truck_id)
);

-- RLS
alter table public.favoritos enable row level security;

create policy "usuario ve seus favoritos"
  on public.favoritos for select
  using (auth.uid() = user_id);

create policy "usuario insere favorito"
  on public.favoritos for insert
  with check (auth.uid() = user_id);

create policy "usuario remove favorito"
  on public.favoritos for delete
  using (auth.uid() = user_id);

-- Index para performance
create index if not exists favoritos_user_id_idx on public.favoritos(user_id);
create index if not exists favoritos_truck_id_idx on public.favoritos(truck_id);
