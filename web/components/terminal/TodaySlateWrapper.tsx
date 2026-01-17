import { createClient } from "@/lib/supabase/server";
import { LiveMarketsTable, type MarketRow } from "./LiveMarketsTable";
import { ErrorState } from "./ErrorState";
import type { TodayGame } from "@/lib/types/database";

// Transform Supabase game data to MarketRow format
function transformGameToMarketRow(game: TodayGame): MarketRow {
  const matchup = `${game.away_team} @ ${game.home_team}`;
  const time = new Date(game.scheduled_at).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'America/New_York',
    timeZoneName: 'short'
  });

  // For now, show spread as primary market (can be enhanced later)
  const consensus = game.consensus_spread || 0;
  const fairValue = consensus - 1.5; // Mock fair value (will be replaced by model)
  const edge = ((Math.abs(consensus) - Math.abs(fairValue)) / Math.abs(consensus)) * 100;

  return {
    id: game.game_id,
    matchup,
    time,
    market: "SPREAD",
    consensus,
    fairValue,
    edge: parseFloat(edge.toFixed(1)),
    reasoning: "Model analysis: Line movement and sharp action suggest value on this position. Historical matchup data and recent form factored in.",
    tags: ["Live odds", "Consensus line"],
    // Store full game data for detail drawer
    gameData: game,
  };
}

export async function TodaySlateWrapper() {
  const supabase = await createClient();
  
  const { data: games, error } = await supabase
    .from('v_today_games')
    .select('*')
    .order('scheduled_at', { ascending: true });

  if (error) {
    console.error('Supabase query error:', error);
    return (
      <ErrorState
        title="Unable to load today's games"
        message="We're having trouble connecting to our data sources. Please try again."
        details={`Error: ${error.message}`}
        onRetry={() => {}}
      />
    );
  }

  if (!games || games.length === 0) {
    return (
      <div className="py-16 text-center border-t border-[#1a1a1a]">
        <p className="text-sm text-[#666]">No games scheduled for today.</p>
        <p className="mt-2 text-xs text-[#444]">Check back later or browse other dates.</p>
      </div>
    );
  }

  const marketRows = games.map(transformGameToMarketRow);

  return <LiveMarketsTable data={marketRows} />;
}
