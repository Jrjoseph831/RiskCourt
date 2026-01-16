-- RiskCourt Schema v0: Game Markets Only
-- Vertical Slice 0 - No player props

-- =============================================================================
-- TEAMS
-- =============================================================================
CREATE TABLE teams (
    id              SERIAL PRIMARY KEY,
    abbr            VARCHAR(3) NOT NULL UNIQUE,       -- e.g., 'LAL', 'BOS'
    name            VARCHAR(50) NOT NULL,             -- e.g., 'Lakers', 'Celtics'
    city            VARCHAR(30) NOT NULL,             -- e.g., 'Los Angeles', 'Boston'
    conference      VARCHAR(4) NOT NULL CHECK (conference IN ('EAST', 'WEST')),
    division        VARCHAR(20) NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_teams_abbr ON teams(abbr);
CREATE INDEX idx_teams_conference ON teams(conference);

-- =============================================================================
-- GAMES
-- =============================================================================
CREATE TABLE games (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    external_id     VARCHAR(50) UNIQUE,               -- External API game ID
    home_team_id    INT NOT NULL REFERENCES teams(id),
    away_team_id    INT NOT NULL REFERENCES teams(id),
    scheduled_at    TIMESTAMPTZ NOT NULL,
    season          VARCHAR(10) NOT NULL,             -- e.g., '2025-26'
    season_type     VARCHAR(15) NOT NULL DEFAULT 'regular' 
                    CHECK (season_type IN ('preseason', 'regular', 'playoff')),
    status          VARCHAR(15) NOT NULL DEFAULT 'scheduled'
                    CHECK (status IN ('scheduled', 'live', 'final', 'postponed', 'cancelled')),
    home_score      SMALLINT,
    away_score      SMALLINT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    CONSTRAINT different_teams CHECK (home_team_id != away_team_id)
);

CREATE INDEX idx_games_scheduled_at ON games(scheduled_at);
CREATE INDEX idx_games_status ON games(status);
CREATE INDEX idx_games_season ON games(season);
CREATE INDEX idx_games_home_team ON games(home_team_id);
CREATE INDEX idx_games_away_team ON games(away_team_id);
CREATE INDEX idx_games_scheduled_status ON games(scheduled_at, status);

-- =============================================================================
-- BOOKS (Sportsbooks)
-- =============================================================================
CREATE TABLE books (
    id              SERIAL PRIMARY KEY,
    slug            VARCHAR(30) NOT NULL UNIQUE,      -- e.g., 'draftkings', 'fanduel'
    name            VARCHAR(50) NOT NULL,             -- e.g., 'DraftKings', 'FanDuel'
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    priority        SMALLINT NOT NULL DEFAULT 100,    -- Lower = higher priority for display
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_books_slug ON books(slug);
CREATE INDEX idx_books_active ON books(is_active) WHERE is_active = TRUE;

-- =============================================================================
-- MARKETS (Market Types)
-- =============================================================================
CREATE TABLE markets (
    id              SERIAL PRIMARY KEY,
    slug            VARCHAR(30) NOT NULL UNIQUE,      -- e.g., 'spread', 'moneyline', 'total'
    name            VARCHAR(50) NOT NULL,             -- e.g., 'Point Spread', 'Moneyline'
    description     TEXT,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_markets_slug ON markets(slug);

-- =============================================================================
-- ODDS_SNAPSHOTS (Append-Only Odds History)
-- =============================================================================
CREATE TABLE odds_snapshots (
    id              BIGSERIAL PRIMARY KEY,
    game_id         UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
    book_id         INT NOT NULL REFERENCES books(id),
    market_id       INT NOT NULL REFERENCES markets(id),
    
    -- Line values (nullable based on market type)
    line            DECIMAL(5,1),                     -- Spread/total line (e.g., -3.5, 220.5)
    home_odds       SMALLINT,                         -- American odds (e.g., -110, +150)
    away_odds       SMALLINT,                         -- American odds for away/under
    over_odds       SMALLINT,                         -- For totals market
    under_odds      SMALLINT,                         -- For totals market
    
    -- Metadata
    captured_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    source          VARCHAR(30),                      -- Data source identifier
    
    -- No unique constraint: append-only design allows duplicate snapshots
    CONSTRAINT valid_american_odds CHECK (
        (home_odds IS NULL OR home_odds <= -100 OR home_odds >= 100) AND
        (away_odds IS NULL OR away_odds <= -100 OR away_odds >= 100) AND
        (over_odds IS NULL OR over_odds <= -100 OR over_odds >= 100) AND
        (under_odds IS NULL OR under_odds <= -100 OR under_odds >= 100)
    )
);

-- Critical indexes for time-series queries
CREATE INDEX idx_odds_game_id ON odds_snapshots(game_id);
CREATE INDEX idx_odds_captured_at ON odds_snapshots(captured_at DESC);
CREATE INDEX idx_odds_game_market ON odds_snapshots(game_id, market_id);
CREATE INDEX idx_odds_game_book_market ON odds_snapshots(game_id, book_id, market_id);
CREATE INDEX idx_odds_game_captured ON odds_snapshots(game_id, captured_at DESC);

-- =============================================================================
-- CONSENSUS_LINES (Aggregated Market Lines)
-- =============================================================================
CREATE TABLE consensus_lines (
    id              BIGSERIAL PRIMARY KEY,
    game_id         UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
    market_id       INT NOT NULL REFERENCES markets(id),
    
    -- Consensus values
    line            DECIMAL(5,1),                     -- Consensus line
    home_odds       SMALLINT,                         -- Consensus home/over odds
    away_odds       SMALLINT,                         -- Consensus away/under odds
    
    -- Stats
    book_count      SMALLINT NOT NULL DEFAULT 0,      -- Number of books in consensus
    line_stddev     DECIMAL(4,2),                     -- Standard deviation of lines
    
    -- Timestamps
    calculated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    valid_from      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    valid_until     TIMESTAMPTZ,                      -- NULL = current consensus
    
    CONSTRAINT unique_active_consensus UNIQUE (game_id, market_id, valid_until)
);

CREATE INDEX idx_consensus_game ON consensus_lines(game_id);
CREATE INDEX idx_consensus_active ON consensus_lines(game_id, market_id) 
    WHERE valid_until IS NULL;
CREATE INDEX idx_consensus_calculated ON consensus_lines(calculated_at DESC);

-- =============================================================================
-- SEED DATA: Core Markets
-- =============================================================================
INSERT INTO markets (slug, name, description) VALUES
    ('spread', 'Point Spread', 'Handicap betting on margin of victory'),
    ('moneyline', 'Moneyline', 'Straight-up winner betting'),
    ('total', 'Total Points', 'Over/under on combined score');

-- =============================================================================
-- SEED DATA: Major Sportsbooks
-- =============================================================================
INSERT INTO books (slug, name, priority) VALUES
    ('draftkings', 'DraftKings', 10),
    ('fanduel', 'FanDuel', 20),
    ('betmgm', 'BetMGM', 30),
    ('caesars', 'Caesars', 40),
    ('pointsbet', 'PointsBet', 50),
    ('bet365', 'Bet365', 60);

-- =============================================================================
-- HELPER FUNCTION: Update timestamp trigger
-- =============================================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER games_updated_at
    BEFORE UPDATE ON games
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- =============================================================================
-- ROW LEVEL SECURITY (RLS) - Prepared for future auth
-- =============================================================================
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE markets ENABLE ROW LEVEL SECURITY;
ALTER TABLE odds_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE consensus_lines ENABLE ROW LEVEL SECURITY;

-- Public read access (no auth required for read)
CREATE POLICY "Public read access" ON teams FOR SELECT USING (true);
CREATE POLICY "Public read access" ON games FOR SELECT USING (true);
CREATE POLICY "Public read access" ON books FOR SELECT USING (true);
CREATE POLICY "Public read access" ON markets FOR SELECT USING (true);
CREATE POLICY "Public read access" ON odds_snapshots FOR SELECT USING (true);
CREATE POLICY "Public read access" ON consensus_lines FOR SELECT USING (true);
