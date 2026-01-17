# Smoke Tests v0 (Lane A)

These smoke tests validate RLS behavior and minimal Lane B functionality.
All write tests run inside a transaction and are rolled back.

## Anon cannot read user tables

Query:
```
begin;
select set_config('request.jwt.claim.role','anon', true);
select set_config('request.jwt.claim.sub','', true);
select
  (select count(*) from public.user_odds) as user_odds_count,
  (select count(*) from public.picks) as picks_count,
  (select count(*) from public.user_preferences) as prefs_count,
  (select count(*) from public.profiles) as profiles_count;
rollback;
```

Result:
```
[{"user_odds_count":0,"picks_count":0,"prefs_count":0,"profiles_count":0}]
```

## Authenticated can read games and write own rows

Query:
```
begin;
insert into auth.users (id, email)
values (gen_random_uuid(), 'smoke+lanea@example.com');
select set_config('request.jwt.claim.role','authenticated', true);
select set_config(
  'request.jwt.claim.sub',
  (select id::text from auth.users where email = 'smoke+lanea@example.com'
   order by created_at desc nulls last, id desc limit 1),
  true
);
insert into public.user_odds (user_id, market_type, selection, odds_american, odds_decimal)
values (auth.uid(), 'moneyline', 'BOS ML', -110, 1.91);
insert into public.picks (user_id, status, snapshot, notes)
values (auth.uid(), 'open', '{"source":"smoke"}'::jsonb, 'smoke');
select
  (select auth.uid()) as uid,
  (select count(*) from public.games) as games_count,
  (select count(*) from public.user_odds) as user_odds_count,
  (select count(*) from public.picks) as picks_count;
rollback;
```

Result:
```
[{"uid":"dfcac697-74aa-4c05-ab1d-012f936fd027","games_count":12,"user_odds_count":1,"picks_count":1}]
```
