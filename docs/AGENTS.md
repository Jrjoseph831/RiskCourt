# RiskCourt — Agent Instructions (source of truth)

Product statement
RiskCourt is a quant-style NBA analytics terminal that estimates fair lines and helps you manage risk across a portfolio of picks (no betting, just decision support).

Hard constraints (must obey)
- Do NOT implement wagering, deposits, withdrawals, bet placement, or sportsbook account linking.
- Do NOT scrape sportsbooks or reverse-engineer private sportsbook endpoints.
- Odds must come from a licensed odds API OR explicit user-entered odds.
- No user-submitted Python/code execution.
- UI must be modern, minimal, terminal-like (dense but calm).

MVP scope (v1)
- NBA only
- Markets: moneyline, spread, total
- Odds snapshots cached in DB (scheduled ingestion)
- Terminal slate: fair lines + edge + confidence + “take threshold”
- Strategy builder: templates + a small set of factor toggles/weights + constraints
- Backtest + robustness summary per strategy
- Portfolio tracker (paper trading)

Engineering standards
- Prefer deterministic, reproducible outputs.
- Strong typing and input validation (zod or equivalent).
- Clear error handling and empty/loading states.
- Small diffs. No unrelated refactors.
- Any feature work must update docs and include a quick verification checklist.

Output format rules
- If modifying code: return full file contents for each changed file.
- SQL changes must be returned separately as migrations/snippets.
- Start by listing which files you will change and why.
