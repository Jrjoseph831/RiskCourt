-- Lane A v0: auth, preferences, user odds, picks, and RLS

create extension if not exists "pgcrypto";

-- Updated-at helper
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Profiles
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  display_name text,
  onboarding_complete boolean not null default false
);

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
drop policy if exists "Profiles select own" on public.profiles;
drop policy if exists "Profiles insert own" on public.profiles;
drop policy if exists "Profiles update own" on public.profiles;
create policy "Profiles select own"
  on public.profiles for select
  using (id = auth.uid());
create policy "Profiles insert own"
  on public.profiles for insert
  with check (id = auth.uid());
create policy "Profiles update own"
  on public.profiles for update
  using (id = auth.uid());

-- User preferences
create table if not exists public.user_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  terminal_columns jsonb not null default '{}'::jsonb,
  terminal_density text not null default 'comfortable',
  default_strategy text not null default 'balanced',
  constraint user_preferences_density_check
    check (terminal_density in ('compact', 'comfortable'))
);

drop trigger if exists user_preferences_set_updated_at on public.user_preferences;
create trigger user_preferences_set_updated_at
before update on public.user_preferences
for each row execute function public.set_updated_at();

alter table public.user_preferences enable row level security;
drop policy if exists "User preferences select own" on public.user_preferences;
drop policy if exists "User preferences insert own" on public.user_preferences;
drop policy if exists "User preferences update own" on public.user_preferences;
drop policy if exists "User preferences delete own" on public.user_preferences;
create policy "User preferences select own"
  on public.user_preferences for select
  using (user_id = auth.uid());
create policy "User preferences insert own"
  on public.user_preferences for insert
  with check (user_id = auth.uid());
create policy "User preferences update own"
  on public.user_preferences for update
  using (user_id = auth.uid());
create policy "User preferences delete own"
  on public.user_preferences for delete
  using (user_id = auth.uid());

-- Extend games for v0 UI needs
alter table public.games
  add column if not exists league text default 'NBA';
alter table public.games
  add column if not exists start_time timestamptz;
alter table public.games
  add column if not exists away_team text;
alter table public.games
  add column if not exists home_team text;

update public.games
set start_time = scheduled_at
where start_time is null;

update public.games g
set home_team = t.name
from public.teams t
where g.home_team is null
  and g.home_team_id = t.id;

update public.games g
set away_team = t.name
from public.teams t
where g.away_team is null
  and g.away_team_id = t.id;

update public.games
set home_team = 'TBD'
where home_team is null;

update public.games
set away_team = 'TBD'
where away_team is null;

alter table public.games
  alter column start_time set not null;
alter table public.games
  alter column home_team set not null;
alter table public.games
  alter column away_team set not null;

alter table public.games enable row level security;
drop policy if exists "Public read access" on public.games;
drop policy if exists "Games read authenticated" on public.games;
create policy "Games read authenticated"
  on public.games for select
  using (auth.role() = 'authenticated');

-- User odds (user-entered odds)
create table if not exists public.user_odds (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  game_id uuid references public.games(id) on delete cascade,
  book text,
  market_type text not null,
  selection text not null,
  line numeric,
  odds_american integer,
  odds_decimal numeric,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint user_odds_market_type_check
    check (market_type in ('moneyline', 'spread', 'total', 'prop'))
);

drop trigger if exists user_odds_set_updated_at on public.user_odds;
create trigger user_odds_set_updated_at
before update on public.user_odds
for each row execute function public.set_updated_at();

alter table public.user_odds enable row level security;
drop policy if exists "User odds select own" on public.user_odds;
drop policy if exists "User odds insert own" on public.user_odds;
drop policy if exists "User odds update own" on public.user_odds;
drop policy if exists "User odds delete own" on public.user_odds;
create policy "User odds select own"
  on public.user_odds for select
  using (user_id = auth.uid());
create policy "User odds insert own"
  on public.user_odds for insert
  with check (user_id = auth.uid());
create policy "User odds update own"
  on public.user_odds for update
  using (user_id = auth.uid());
create policy "User odds delete own"
  on public.user_odds for delete
  using (user_id = auth.uid());

-- Picks (ledger entries)
create table if not exists public.picks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  game_id uuid references public.games(id) on delete set null,
  user_odds_id uuid references public.user_odds(id) on delete set null,
  status text not null default 'open',
  result text,
  settled_at timestamptz,
  stake_units numeric,
  notes text,
  snapshot jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint picks_status_check
    check (status in ('open', 'settled', 'void')),
  constraint picks_result_check
    check (result is null or result in ('win', 'loss', 'push'))
);

create index if not exists picks_user_created_at_idx
  on public.picks (user_id, created_at desc);
create index if not exists picks_game_id_idx
  on public.picks (game_id);

drop trigger if exists picks_set_updated_at on public.picks;
create trigger picks_set_updated_at
before update on public.picks
for each row execute function public.set_updated_at();

alter table public.picks enable row level security;
drop policy if exists "Picks select own" on public.picks;
drop policy if exists "Picks insert own" on public.picks;
drop policy if exists "Picks update own" on public.picks;
drop policy if exists "Picks delete own" on public.picks;
create policy "Picks select own"
  on public.picks for select
  using (user_id = auth.uid());
create policy "Picks insert own"
  on public.picks for insert
  with check (user_id = auth.uid());
create policy "Picks update own"
  on public.picks for update
  using (user_id = auth.uid());
create policy "Picks delete own"
  on public.picks for delete
  using (user_id = auth.uid());

-- Auth trigger: auto-create profile + preferences
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id)
  values (new.id)
  on conflict (id) do nothing;

  insert into public.user_preferences (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();