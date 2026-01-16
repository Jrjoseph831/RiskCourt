-- Seed reference data for VS0 (idempotent)
-- Markets: h2h, spreads, totals
-- Books: fanduel, draftkings, betmgm, caesars, pointsbet

-- Ensure key columns exist for idempotent upserts
ALTER TABLE markets ADD COLUMN IF NOT EXISTS market_key VARCHAR(30);
ALTER TABLE books ADD COLUMN IF NOT EXISTS book_key VARCHAR(30);

-- Backfill keys from existing slugs
UPDATE markets SET market_key = slug WHERE market_key IS NULL;
UPDATE books SET book_key = slug WHERE book_key IS NULL;

-- Ensure uniqueness on keys
CREATE UNIQUE INDEX IF NOT EXISTS markets_market_key_key ON markets(market_key);
CREATE UNIQUE INDEX IF NOT EXISTS books_book_key_key ON books(book_key);

INSERT INTO markets (market_key, slug, name)
VALUES
    ('h2h', 'h2h', 'Moneyline'),
    ('spreads', 'spreads', 'Spread'),
    ('totals', 'totals', 'Total')
ON CONFLICT (market_key) DO UPDATE
SET slug = EXCLUDED.slug,
    name = EXCLUDED.name;

INSERT INTO books (book_key, slug, name)
VALUES
    ('fanduel', 'fanduel', 'FanDuel'),
    ('draftkings', 'draftkings', 'DraftKings'),
    ('betmgm', 'betmgm', 'BetMGM'),
    ('caesars', 'caesars', 'Caesars'),
    ('pointsbet', 'pointsbet', 'PointsBet')
ON CONFLICT (book_key) DO UPDATE
SET slug = EXCLUDED.slug,
    name = EXCLUDED.name;