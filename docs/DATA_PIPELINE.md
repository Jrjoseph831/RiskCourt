# RiskCourt Data Pipeline

Goal
Create a reliable market + stats substrate so RiskCourt can compute fair lines, edge, and risk controls with reproducible outputs.

Ingestion sources (provider-agnostic)
1) NBA structure
- teams
- games schedule (today + upcoming window)
- game status + start time

2) Odds snapshots (licensed odds provider)
For each snapshot row:
- book (fanduel, dk, etc.)
- market (moneyline, spread, total) for v0
- line + price
- fetched_at timestamp
Notes:
- server-side only
- append-only storage

3) Stats for modeling (v0: team-level)
- team game logs / box score outputs
- derived features (rolling offense/defense, pace proxies, rest, etc.)
Notes:
- refresh after games complete (nightly) + optional quick refresh for “today”

Optional later (not required for first slice)
- players/rosters + player game logs (only if we move into player props)
- injuries/status signals

What RiskCourt computes (derived layers)
- implied probabilities from prices
- de-vig probabilities (per book, plus a consensus)
- consensus_lines: best available / consensus line for today’s slate
- predictions: fair probability / fair line + uncertainty proxy
- strategy evaluation: edge/confidence filters + sizing recommendations
- portfolio events: tracked picks and results

Recommended refresh cadence (cost-controlled)
- teams/schedule: 1–2x per day
- odds snapshots:
  - early day: every 15–30 minutes
  - 3 hours pre-tip: every 5–10 minutes
  - last 60 minutes: every 1–2 minutes (only today’s slate)
- stats: nightly (post-games)

Minimal DB tables for the first working slice (VS0)
- teams
- games
- books
- markets (moneyline/spread/total)
- odds_snapshots (append-only)
- consensus_lines (derived latest/best line per game+market)

Extensibility note
Player props can be added later without rewriting VS0 by introducing:
- players
- player_markets / player_selections
- prop_odds_snapshots
But we do not block VS0 on player data.
