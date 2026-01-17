# DB Schema v0 (Lane A)

This document describes the minimal, stable database schema for auth, preferences,
user-entered odds, and picks/ledger support. It is intentionally small and
auditable to unblock the Lane B terminal flow.

## Tables Added

- `public.profiles`
  - One row per authenticated user.
  - Key fields: `id`, `display_name`, `onboarding_complete`.
- `public.user_preferences`
  - One row per authenticated user.
  - Key fields: `terminal_columns`, `terminal_density`, `default_strategy`.
- `public.user_odds`
  - User-entered odds per selection, optional per pick.
  - Key fields: `market_type`, `selection`, `line`, `odds_american`, `odds_decimal`.
- `public.picks`
  - Ledger entries and settlement state.
  - Key fields: `status`, `result`, `stake_units`, `snapshot`.

## Tables Extended

- `public.games`
  - Added fields: `league`, `start_time`, `home_team`, `away_team`.
  - Existing `scheduled_at` remains authoritative; `start_time` is backfilled.

## RLS Summary

RLS is enabled on all user-owned tables with "own-row" policies:
- `profiles`: select/insert/update where `id = auth.uid()`
- `user_preferences`: select/insert/update/delete where `user_id = auth.uid()`
- `user_odds`: select/insert/update/delete where `user_id = auth.uid()`
- `picks`: select/insert/update/delete where `user_id = auth.uid()`

`games` is readable only by authenticated users:
- select policy uses `auth.role() = 'authenticated'`

## Lane B Usage (Read/Write)

- `public.user_preferences`
  - Read and write by `user_id`.
  - `terminal_columns` expects a JSON object with column visibility/ordering.
  - `terminal_density` is `'compact'` or `'comfortable'`.
  - `default_strategy` default is `'balanced'`.

- `public.user_odds`
  - Insert when the user enters odds manually.
  - `market_type`: `'moneyline' | 'spread' | 'total' | 'prop'`.
  - `selection` should be the user-facing label (e.g., `"BOS ML"`).

- `public.picks`
  - Insert on "Add to Ledger".
  - `snapshot` should store what the user saw at time of pick (JSON).
  - `status`: `'open' | 'settled' | 'void'`.
  - `result`: `'win' | 'loss' | 'push'` (nullable until settled).

## Migrations

Apply migrations with:

```
npx supabase db push
```

If you need to inspect policies or tables, use SQL:

```
select tablename from pg_tables where schemaname='public' order by tablename;
select tablename, policyname, cmd from pg_policies where schemaname='public';
```
