export type MarketKey = "h2h" | "spreads" | "totals";

export type SlateRow = {
  id: string;
  gameTime: string;      // ISO or display
  away: string;          // "NYK"
  home: string;          // "BOS"
  market: MarketKey;
  selection: string;     // "away" | "home" | "over" | "under"
  line: number | null;   // spread/total line or null for h2h
  bestPrice: number;     // american odds e.g. -110
  updatedAt: string;     // ISO
};

export const mockSlate: SlateRow[] = [
  {
    id: "1",
    gameTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    away: "NYK",
    home: "BOS",
    market: "h2h",
    selection: "home",
    line: null,
    bestPrice: -135,
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    gameTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    away: "NYK",
    home: "BOS",
    market: "spreads",
    selection: "away",
    line: 4.5,
    bestPrice: -110,
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    gameTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    away: "LAL",
    home: "DEN",
    market: "totals",
    selection: "over",
    line: 229.5,
    bestPrice: -108,
    updatedAt: new Date().toISOString(),
  },
];
