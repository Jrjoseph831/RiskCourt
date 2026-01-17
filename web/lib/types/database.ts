// Database types for RiskCourt v0

export type GameStatus = 'scheduled' | 'live' | 'final' | 'postponed' | 'cancelled';
export type PickStatus = 'open' | 'won' | 'lost' | 'push' | 'cancelled';
export type MarketType = 'moneyline' | 'spread' | 'total' | 'prop';

export interface Team {
  id: number;
  abbr: string;
  name: string;
  city: string;
  conference: 'EAST' | 'WEST';
  division: string;
}

export interface Game {
  id: string;
  external_id: string | null;
  home_team_id: number;
  away_team_id: number;
  scheduled_at: string;
  season: string;
  season_type: string;
  status: GameStatus;
  home_score: number | null;
  away_score: number | null;
  created_at: string;
  updated_at: string;
}

export interface TodayGame {
  game_id: string;
  scheduled_at: string;
  status: GameStatus;
  home_team: string;
  home_name: string;
  away_team: string;
  away_name: string;
  home_score: number | null;
  away_score: number | null;
  consensus_spread: number | null;
  spread_home_odds: number | null;
  spread_away_odds: number | null;
  ml_home_odds: number | null;
  ml_away_odds: number | null;
  consensus_total: number | null;
  total_over_odds: number | null;
  total_under_odds: number | null;
}

export interface Pick {
  id: string;
  user_id: string;
  game_id: string;
  market_type: string;
  selection: string;
  line: number | null;
  odds: number;
  stake_units: number;
  book_slug: string | null;
  notes: string | null;
  snapshot: Record<string, unknown> | null;
  status: PickStatus;
  result_units: number | null;
  settled_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserPreferences {
  user_id: string;
  preferences: Record<string, unknown>;
  updated_at: string;
}

export interface CreatePickInput {
  game_id: string;
  market_type: string;
  selection: string;
  line?: number | null;
  odds: number;
  stake_units: number;
  book_slug?: string | null;
  notes?: string | null;
  snapshot?: Record<string, unknown>;
}
