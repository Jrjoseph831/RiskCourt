-- Add User Picks and Ledger Tables for Lane B v0
-- Enables users to track picks, manage portfolio, and store preferences

-- =============================================================================
-- USER PROFILES (extends Supabase auth.users)
-- =============================================================================
CREATE TABLE user_profiles (
    id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name    VARCHAR(100),
    default_stake   DECIMAL(10,2) DEFAULT 1.0,          -- Default units per pick
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_user_profiles_id ON user_profiles(id);

-- =============================================================================
-- USER PREFERENCES (UI state persistence)
-- =============================================================================
CREATE TABLE user_preferences (
    user_id         UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    preferences     JSONB NOT NULL DEFAULT '{}'::jsonb, -- Flexible JSON for UI state
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_user_preferences_user ON user_preferences(user_id);

-- =============================================================================
-- PICKS (User's tracked positions)
-- =============================================================================
CREATE TABLE picks (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    game_id         UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
    
    -- Pick details
    market_type     VARCHAR(30) NOT NULL,               -- 'moneyline', 'spread', 'total', 'prop'
    selection       VARCHAR(50) NOT NULL,               -- 'home', 'away', 'over', 'under', or player name
    line            DECIMAL(5,1),                       -- Spread/total line (nullable for ML)
    odds            SMALLINT NOT NULL,                  -- American odds (e.g., -110, +150)
    stake_units     DECIMAL(10,2) NOT NULL DEFAULT 1.0, -- Units risked
    
    -- Metadata
    book_slug       VARCHAR(30),                        -- Which book (optional)
    notes           TEXT,                               -- User notes
    snapshot        JSONB,                              -- Full context at time of pick (game info, consensus, model data)
    
    -- Status tracking
    status          VARCHAR(15) NOT NULL DEFAULT 'open'
                    CHECK (status IN ('open', 'won', 'lost', 'push', 'cancelled')),
    result_units    DECIMAL(10,2),                      -- Units won/lost (calculated on settle)
    settled_at      TIMESTAMPTZ,
    
    -- Timestamps
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    CONSTRAINT valid_american_odds_pick CHECK (odds <= -100 OR odds >= 100),
    CONSTRAINT valid_stake CHECK (stake_units > 0)
);

CREATE INDEX idx_picks_user ON picks(user_id);
CREATE INDEX idx_picks_game ON picks(game_id);
CREATE INDEX idx_picks_status ON picks(status);
CREATE INDEX idx_picks_user_status ON picks(user_id, status);
CREATE INDEX idx_picks_created ON picks(created_at DESC);
CREATE INDEX idx_picks_user_created ON picks(user_id, created_at DESC);

-- =============================================================================
-- USER_ODDS (User's custom odds for comparison - optional for v0)
-- =============================================================================
CREATE TABLE user_odds (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    game_id         UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
    market_type     VARCHAR(30) NOT NULL,
    
    fair_line       DECIMAL(5,1),                       -- User's estimated fair line
    fair_odds       SMALLINT,                           -- User's fair odds
    confidence      SMALLINT CHECK (confidence BETWEEN 1 AND 10), -- 1-10 scale
    reasoning       TEXT,                               -- Why this is the fair value
    
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    CONSTRAINT unique_user_game_market UNIQUE (user_id, game_id, market_type)
);

CREATE INDEX idx_user_odds_user ON user_odds(user_id);
CREATE INDEX idx_user_odds_game ON user_odds(game_id);
CREATE INDEX idx_user_odds_user_game ON user_odds(user_id, game_id);

-- =============================================================================
-- UPDATE TRIGGERS
-- =============================================================================
CREATE TRIGGER user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER picks_updated_at
    BEFORE UPDATE ON picks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER user_odds_updated_at
    BEFORE UPDATE ON user_odds
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER user_preferences_updated_at
    BEFORE UPDATE ON user_preferences
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- =============================================================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================================================
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE picks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_odds ENABLE ROW LEVEL SECURITY;

-- User profiles: users can only see/edit their own
CREATE POLICY "Users can view own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- User preferences: users can only see/edit their own
CREATE POLICY "Users can view own preferences" ON user_preferences
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences" ON user_preferences
    FOR ALL USING (auth.uid() = user_id);

-- Picks: users can only see/edit their own picks
CREATE POLICY "Users can view own picks" ON picks
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own picks" ON picks
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own picks" ON picks
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own picks" ON picks
    FOR DELETE USING (auth.uid() = user_id);

-- User odds: users can only see/edit their own odds
CREATE POLICY "Users can view own odds" ON user_odds
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own odds" ON user_odds
    FOR ALL USING (auth.uid() = user_id);

-- =============================================================================
-- HELPER VIEW: Today's Games with Consensus
-- =============================================================================
CREATE OR REPLACE VIEW v_today_games AS
SELECT 
    g.id as game_id,
    g.scheduled_at,
    g.status,
    ht.abbr as home_team,
    ht.name as home_name,
    at.abbr as away_team,
    at.name as away_name,
    g.home_score,
    g.away_score,
    
    -- Consensus lines (latest valid)
    cl_spread.line as consensus_spread,
    cl_spread.home_odds as spread_home_odds,
    cl_spread.away_odds as spread_away_odds,
    
    cl_ml.home_odds as ml_home_odds,
    cl_ml.away_odds as ml_away_odds,
    
    cl_total.line as consensus_total,
    cl_total.home_odds as total_over_odds,
    cl_total.away_odds as total_under_odds
    
FROM games g
JOIN teams ht ON g.home_team_id = ht.id
JOIN teams at ON g.away_team_id = at.id
LEFT JOIN LATERAL (
    SELECT line, home_odds, away_odds
    FROM consensus_lines
    WHERE game_id = g.id 
    AND market_id = (SELECT id FROM markets WHERE slug = 'spreads' LIMIT 1)
    AND valid_until IS NULL
    LIMIT 1
) cl_spread ON true
LEFT JOIN LATERAL (
    SELECT home_odds, away_odds
    FROM consensus_lines
    WHERE game_id = g.id 
    AND market_id = (SELECT id FROM markets WHERE slug = 'h2h' LIMIT 1)
    AND valid_until IS NULL
    LIMIT 1
) cl_ml ON true
LEFT JOIN LATERAL (
    SELECT line, home_odds as home_odds, away_odds as away_odds
    FROM consensus_lines
    WHERE game_id = g.id 
    AND market_id = (SELECT id FROM markets WHERE slug = 'totals' LIMIT 1)
    AND valid_until IS NULL
    LIMIT 1
) cl_total ON true
WHERE DATE(g.scheduled_at AT TIME ZONE 'America/New_York') = DATE(NOW() AT TIME ZONE 'America/New_York')
  AND g.status IN ('scheduled', 'live')
ORDER BY g.scheduled_at;

-- Grant access to view
GRANT SELECT ON v_today_games TO authenticated, anon;
