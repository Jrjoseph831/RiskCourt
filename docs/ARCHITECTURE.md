# RiskCourt Architecture

Product
RiskCourt is a quant-style NBA analytics terminal that estimates fair lines and helps manage risk across a portfolio of picks (no betting; decision support only).

Non-negotiables
- No wagering / bet placement / deposits / withdrawals.
- No sportsbook scraping or private endpoints.
- Odds only via a licensed odds API OR user-entered odds.
- App never calls the odds provider from the client. Only server-side ingestion writes snapshots into the DB.
- No user-submitted code execution.

Stack
- Web: Next.js (App Router) + TypeScript
- UI: Tailwind + shadcn/ui
- Client data: TanStack Query
- DB/Auth: Supabase Postgres + Supabase Auth
- Jobs: scheduled ingestion (cron/queue)
- Quant: Python FastAPI service (modeling/backtests), versioned outputs

High-level components
- Ingestion Service (server-only)
  - pulls schedule + odds snapshots (licensed) + optional stats sources
  - writes append-only snapshots into Supabase
  - updates derived tables/views (consensus lines, latest slate)
- App API layer (Next.js route handlers)
  - reads from Supabase only
  - returns terminal-ready data to the UI
- Web UI
  - Today’s Slate Terminal
  - Bet Lab (edge/confidence/sizing)
  - Strategy Builder (templates + constraints)
  - Backtests/Robustness (Labs)
  - Portfolio/Tracking (Ledger)

Data in, data out (the core loop)
Inputs we ingest
- NBA structure: teams + games schedule + game status (cheap, stable)
- Market prices: odds/lines snapshots (licensed provider; server-side only)
- Basketball facts for modeling (team stats initially; player stats later if needed)

What we compute
- De-vig implied probabilities (from odds snapshots)
- Fair line / fair probability (model outputs)
- Edge = model probability vs market implied probability
- Uncertainty proxy + sensitivity to line moves
- Risk controls: stake sizing (capped fractional Kelly), exposure limits, correlation flags
- Backtests + robustness summaries
- Portfolio metrics (paper tracking): ROI, drawdown, hit rate, etc.

Data flow rules
- All external data enters through ingestion jobs.
- Client reads only from Supabase.
- Snapshots are append-only; derived “latest” tables are computed from snapshots.

Versioning (required for trust)
- model_version
- feature_version
- strategy_version
Every prediction/backtest row stores these.

Security and ops
- API keys and secrets live in env vars only.
- No secrets in tracked repo files.
- Start on a dev Supabase project; lock production later.
