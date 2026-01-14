Context (paste this at the top of every agent prompt)

Product:
RiskCourt is a quant-style NBA analytics terminal that estimates fair lines and helps you manage risk across a portfolio of picks (no betting, just decision support).

Non-negotiables:
- No wagering/bet placement.
- No sportsbook scraping or private endpoint reverse engineering.
- Odds only via licensed odds API or user-entered odds.
- No user-submitted code execution.

Stack:
Next.js (App Router) + TypeScript + Tailwind + shadcn/ui + Supabase Postgres/Auth + scheduled ingestion + Python FastAPI quant service.

Output requirements:
- List files you’ll change and acceptance criteria first.
- Return full file contents for modified files.
- Provide SQL separately for DB changes.
- Include a “How to verify” checklist.
