-- Seed reference data for VS0 (safe to run multiple times)

alter table public.markets
  add column if not exists market_key varchar(30);

alter table public.books
  add column if not exists book_key varchar(30);

update public.markets
set market_key = slug
where market_key is null;

update public.books
set book_key = slug
where book_key is null;

create unique index if not exists markets_market_key_key
  on public.markets (market_key);

create unique index if not exists books_book_key_key
  on public.books (book_key);

insert into public.markets (market_key, slug, name)
values
  ('h2h', 'h2h', 'Moneyline'),
  ('spreads', 'spreads', 'Spread'),
  ('totals', 'totals', 'Total')
on conflict (market_key) do update
set slug = excluded.slug,
    name = excluded.name;

insert into public.books (book_key, slug, name)
values
  ('fanduel', 'fanduel', 'FanDuel'),
  ('draftkings', 'draftkings', 'DraftKings'),
  ('betmgm', 'betmgm', 'BetMGM'),
  ('caesars', 'caesars', 'Caesars'),
  ('pointsbet', 'pointsbet', 'PointsBet')
on conflict (book_key) do update
set slug = excluded.slug,
    name = excluded.name;