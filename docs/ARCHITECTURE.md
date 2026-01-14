# Architecture

Frontend
- Next.js (App Router) + TypeScript
- Tailwind + shadcn/ui
- TanStack Query for client caching
- Recharts (or similar) for simple charts

Backend / Data
- Supabase Postgres (source of truth)
- Supabase Auth
- Scheduled ingestion (cron) writes odds snapshots into DB
- App never calls odds provider directly (only reads DB)

Quant engine
- Python service (FastAPI) for modeling + backtests
- Strict versioning:
  - model_version
  - feature_version
  - strategy_version

Data sourcing rules
- Odds: licensed odds API only (cached snapshots)
- Stats: permitted sources only (no ToS scraping)

Non-negotiables
- No wagering, no deposits, no withdrawals, no bet placement
- No sportsbook scraping or reverse-engineering private endpoints
- No user-submitted arbitrary code execution
