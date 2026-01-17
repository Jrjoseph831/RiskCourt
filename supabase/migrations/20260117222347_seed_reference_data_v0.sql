-- Seed reference data for Lane B (idempotent)

create table if not exists public.leagues (
  league_code text primary key,
  name text not null,
  created_at timestamptz not null default now()
);

insert into public.leagues (league_code, name)
values
  ('NBA', 'National Basketball Association')
on conflict (league_code) do update
set name = excluded.name;

-- Teams (at least 10)
insert into public.teams (abbr, name, city, conference, division)
values
  ('BOS', 'Celtics', 'Boston', 'EAST', 'Atlantic'),
  ('NYK', 'Knicks', 'New York', 'EAST', 'Atlantic'),
  ('PHI', '76ers', 'Philadelphia', 'EAST', 'Atlantic'),
  ('BKN', 'Nets', 'Brooklyn', 'EAST', 'Atlantic'),
  ('MIA', 'Heat', 'Miami', 'EAST', 'Southeast'),
  ('MIL', 'Bucks', 'Milwaukee', 'EAST', 'Central'),
  ('CHI', 'Bulls', 'Chicago', 'EAST', 'Central'),
  ('ATL', 'Hawks', 'Atlanta', 'EAST', 'Southeast'),
  ('LAL', 'Lakers', 'Los Angeles', 'WEST', 'Pacific'),
  ('GSW', 'Warriors', 'Golden State', 'WEST', 'Pacific'),
  ('DAL', 'Mavericks', 'Dallas', 'WEST', 'Southwest'),
  ('DEN', 'Nuggets', 'Denver', 'WEST', 'Northwest')
on conflict (abbr) do nothing;

-- Games (today + yesterday + tomorrow)
insert into public.games (
  external_id,
  home_team_id,
  away_team_id,
  scheduled_at,
  start_time,
  season,
  season_type,
  status,
  home_team,
  away_team,
  league
)
values
  -- Yesterday
  (
    'seed-' || to_char(current_date - 1, 'YYYYMMDD') || '-BOS-NYK-1900',
    (select id from public.teams where abbr = 'BOS'),
    (select id from public.teams where abbr = 'NYK'),
    (current_date - 1)::timestamptz + interval '19 hours',
    (current_date - 1)::timestamptz + interval '19 hours',
    '2025-26',
    'regular',
    'final',
    'Celtics',
    'Knicks',
    'NBA'
  ),
  (
    'seed-' || to_char(current_date - 1, 'YYYYMMDD') || '-LAL-GSW-2130',
    (select id from public.teams where abbr = 'LAL'),
    (select id from public.teams where abbr = 'GSW'),
    (current_date - 1)::timestamptz + interval '21 hours 30 minutes',
    (current_date - 1)::timestamptz + interval '21 hours 30 minutes',
    '2025-26',
    'regular',
    'final',
    'Lakers',
    'Warriors',
    'NBA'
  ),

  -- Today (8 games)
  (
    'seed-' || to_char(current_date, 'YYYYMMDD') || '-BOS-PHI-1900',
    (select id from public.teams where abbr = 'BOS'),
    (select id from public.teams where abbr = 'PHI'),
    current_date::timestamptz + interval '19 hours',
    current_date::timestamptz + interval '19 hours',
    '2025-26',
    'regular',
    'scheduled',
    'Celtics',
    '76ers',
    'NBA'
  ),
  (
    'seed-' || to_char(current_date, 'YYYYMMDD') || '-NYK-BKN-1930',
    (select id from public.teams where abbr = 'NYK'),
    (select id from public.teams where abbr = 'BKN'),
    current_date::timestamptz + interval '19 hours 30 minutes',
    current_date::timestamptz + interval '19 hours 30 minutes',
    '2025-26',
    'regular',
    'scheduled',
    'Knicks',
    'Nets',
    'NBA'
  ),
  (
    'seed-' || to_char(current_date, 'YYYYMMDD') || '-MIA-ATL-1900',
    (select id from public.teams where abbr = 'MIA'),
    (select id from public.teams where abbr = 'ATL'),
    current_date::timestamptz + interval '19 hours',
    current_date::timestamptz + interval '19 hours',
    '2025-26',
    'regular',
    'scheduled',
    'Heat',
    'Hawks',
    'NBA'
  ),
  (
    'seed-' || to_char(current_date, 'YYYYMMDD') || '-MIL-CHI-2000',
    (select id from public.teams where abbr = 'MIL'),
    (select id from public.teams where abbr = 'CHI'),
    current_date::timestamptz + interval '20 hours',
    current_date::timestamptz + interval '20 hours',
    '2025-26',
    'regular',
    'scheduled',
    'Bucks',
    'Bulls',
    'NBA'
  ),
  (
    'seed-' || to_char(current_date, 'YYYYMMDD') || '-DAL-DEN-2030',
    (select id from public.teams where abbr = 'DAL'),
    (select id from public.teams where abbr = 'DEN'),
    current_date::timestamptz + interval '20 hours 30 minutes',
    current_date::timestamptz + interval '20 hours 30 minutes',
    '2025-26',
    'regular',
    'scheduled',
    'Mavericks',
    'Nuggets',
    'NBA'
  ),
  (
    'seed-' || to_char(current_date, 'YYYYMMDD') || '-LAL-DEN-2130',
    (select id from public.teams where abbr = 'LAL'),
    (select id from public.teams where abbr = 'DEN'),
    current_date::timestamptz + interval '21 hours 30 minutes',
    current_date::timestamptz + interval '21 hours 30 minutes',
    '2025-26',
    'regular',
    'scheduled',
    'Lakers',
    'Nuggets',
    'NBA'
  ),
  (
    'seed-' || to_char(current_date, 'YYYYMMDD') || '-GSW-DAL-2200',
    (select id from public.teams where abbr = 'GSW'),
    (select id from public.teams where abbr = 'DAL'),
    current_date::timestamptz + interval '22 hours',
    current_date::timestamptz + interval '22 hours',
    '2025-26',
    'regular',
    'scheduled',
    'Warriors',
    'Mavericks',
    'NBA'
  ),
  (
    'seed-' || to_char(current_date, 'YYYYMMDD') || '-DEN-LAL-2230',
    (select id from public.teams where abbr = 'DEN'),
    (select id from public.teams where abbr = 'LAL'),
    current_date::timestamptz + interval '22 hours 30 minutes',
    current_date::timestamptz + interval '22 hours 30 minutes',
    '2025-26',
    'regular',
    'scheduled',
    'Nuggets',
    'Lakers',
    'NBA'
  ),

  -- Tomorrow
  (
    'seed-' || to_char(current_date + 1, 'YYYYMMDD') || '-PHI-MIA-1900',
    (select id from public.teams where abbr = 'PHI'),
    (select id from public.teams where abbr = 'MIA'),
    (current_date + 1)::timestamptz + interval '19 hours',
    (current_date + 1)::timestamptz + interval '19 hours',
    '2025-26',
    'regular',
    'scheduled',
    '76ers',
    'Heat',
    'NBA'
  ),
  (
    'seed-' || to_char(current_date + 1, 'YYYYMMDD') || '-BKN-ATL-1930',
    (select id from public.teams where abbr = 'BKN'),
    (select id from public.teams where abbr = 'ATL'),
    (current_date + 1)::timestamptz + interval '19 hours 30 minutes',
    (current_date + 1)::timestamptz + interval '19 hours 30 minutes',
    '2025-26',
    'regular',
    'scheduled',
    'Nets',
    'Hawks',
    'NBA'
  )
on conflict (external_id) do nothing;

-- Helper views (do not bypass RLS)
create or replace view public.v_today_games
with (security_invoker = true) as
select *
from public.games
where start_time::date = current_date;

create or replace view public.v_slate_games
with (security_invoker = true) as
select *
from public.games
where start_time::date between current_date - 1 and current_date + 1;