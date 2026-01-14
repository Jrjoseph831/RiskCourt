# RiskCourt Prompt Pack

Use the Context Header at the top of every prompt.

## 1) Product spec (PRD slice)
Task:
Write a PRD section for: <feature>. Include:
- user story
- UI flow
- data requirements
- non-goals
- acceptance criteria
Output: markdown.

## 2) UX spec for a screen
Task:
Design the UX spec for screen: <screen>.
Include:
- page layout regions
- table columns and sorting/filtering behavior
- empty/loading/error states
- mobile/tablet behavior
Output: markdown.

## 3) Data model / Supabase schema
Task:
Design the minimal schema to support: <feature>.
Include:
- tables + columns + types
- primary keys and indexes
- RLS policy intent (high level)
Output:
- SQL migrations
- short explanation

## 4) Ingestion job (odds snapshots)
Task:
Implement scheduled ingestion for odds snapshots.
Constraints:
- Never call odds API from client
- Store append-only snapshots
- Derive a cached “consensus line” view/table
Output:
- files to change
- full file contents
- SQL for tables
- how to verify

## 5) Quant model v1 (fair lines)
Task:
Implement model v1 for fair win prob / fair spread / fair total.
Requirements:
- deterministic and reproducible
- outputs include uncertainty proxy + sensitivity hooks
- store predictions with model_version + feature_version
Output:
- API endpoints
- model code
- tests or verification script
- how to verify

## 6) Strategy engine (no-code)
Task:
Implement strategy builder that produces a strategy JSON config with:
- factor toggles + weights
- constraints (min edge, min confidence, max bets/day, exposure caps)
- sizing policy (flat / fractional Kelly with caps)
Output:
- UI + schema + validation
- storage + retrieval
- how to verify

## 7) Backtest protocol
Task:
Implement backtesting for a strategy with:
- train/test split rules
- walk-forward evaluation
- metrics: ROI, drawdown, volatility proxy, calibration proxy
Output:
- code + stored results table
- how to verify

## 8) Debugging prompt
Task:
Given these logs + files, find root cause and propose minimal fix.
Rules:
- don’t rewrite unrelated modules
- explain the failure mode and the fix
Output:
- root cause
- fix steps
- full file changes

## 9) “Senior code review” prompt
Task:
Review this PR diff for correctness, security, and maintainability.
Focus:
- violating constraints
- missing validation
- performance traps
- confusing UI
Output:
- prioritized issues
- recommended patch list
