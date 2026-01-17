import { createClient } from "@/lib/supabase/server";
import { Clock, TrendingUp } from "lucide-react";
import type { Pick } from "@/lib/types/database";

function formatOdds(odds: number): string {
  return odds > 0 ? `+${odds}` : `${odds}`;
}

function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'America/New_York'
  });
}

function getStatusBadge(status: string) {
  const styles = {
    open: "bg-[#00bfa5]/10 text-[#00bfa5] border-[#00bfa5]/30",
    won: "bg-[#00bfa5]/10 text-[#00bfa5] border-[#00bfa5]/30",
    lost: "bg-red-500/10 text-red-400 border-red-500/30",
    push: "bg-[#666]/10 text-[#666] border-[#666]/30",
    cancelled: "bg-[#666]/10 text-[#666] border-[#666]/30",
  };

  return (
    <span className={`px-2 py-0.5 text-[10px] uppercase tracking-wider border ${styles[status as keyof typeof styles] || styles.open}`}>
      {status}
    </span>
  );
}

interface PickRowProps {
  pick: Pick;
}

function PickRow({ pick }: PickRowProps) {
  const snapshot = (pick.snapshot as Record<string, unknown>) || {};
  const matchup = snapshot?.matchup || 'Unknown matchup';
  const displayLine = pick.line ? ` ${pick.line > 0 ? '+' : ''}${pick.line}` : '';

  return (
    <tr className="border-b border-[#1a1a1a] hover:bg-[#1a1a1a]/30 transition-colors">
      <td className="px-4 py-3">
        <div className="text-sm font-medium">{matchup}</div>
        <div className="text-xs text-[#666] mt-0.5">{formatDateTime(pick.created_at)}</div>
      </td>
      <td className="px-4 py-3">
        <div className="text-sm uppercase">{pick.market_type}</div>
        <div className="text-xs text-[#a0a0a0] mt-0.5">{pick.selection}{displayLine}</div>
      </td>
      <td className="px-4 py-3 font-mono text-sm">{formatOdds(pick.odds)}</td>
      <td className="px-4 py-3 font-mono text-sm">{pick.stake_units}</td>
      <td className="px-4 py-3">
        {pick.book_slug ? (
          <span className="text-xs text-[#a0a0a0]">{pick.book_slug}</span>
        ) : (
          <span className="text-xs text-[#444]">—</span>
        )}
      </td>
      <td className="px-4 py-3">{getStatusBadge(pick.status)}</td>
      <td className="px-4 py-3 font-mono text-sm">
        {pick.result_units !== null ? (
          <span className={pick.result_units > 0 ? 'text-[#00bfa5]' : pick.result_units < 0 ? 'text-red-400' : 'text-[#666]'}>
            {pick.result_units > 0 ? '+' : ''}{pick.result_units.toFixed(2)}
          </span>
        ) : (
          <span className="text-[#444]">—</span>
        )}
      </td>
    </tr>
  );
}

export async function PortfolioList() {
  const supabase = await createClient();
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="py-16 text-center border-t border-[#1a1a1a]">
        <Clock className="h-8 w-8 text-[#666] mx-auto mb-3" />
        <p className="text-sm text-[#666]">Sign in to view your picks</p>
        <p className="mt-2 text-xs text-[#444]">Track your positions and manage your ledger</p>
      </div>
    );
  }

  // Fetch user's picks
  const { data: picks, error } = await supabase
    .from('picks')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching picks:', error);
    return (
      <div className="py-16 text-center border-t border-[#1a1a1a]">
        <p className="text-sm text-red-400">Failed to load picks</p>
        <p className="mt-2 text-xs text-[#666]">{error.message}</p>
      </div>
    );
  }

  if (!picks || picks.length === 0) {
    return (
      <div className="py-16 text-center border-t border-[#1a1a1a]">
        <TrendingUp className="h-8 w-8 text-[#666] mx-auto mb-3" />
        <p className="text-sm text-[#666]">No picks yet</p>
        <p className="mt-2 text-xs text-[#444]">Add one from the Terminal to get started</p>
      </div>
    );
  }

  const openPicks = picks.filter(p => p.status === 'open');
  const settledPicks = picks.filter(p => p.status !== 'open');

  return (
    <div className="border-t border-[#1a1a1a]">
      {/* Open Picks */}
      <div className="px-4 py-3 border-b border-[#1a1a1a]">
        <div className="flex items-center gap-2">
          <Clock className="h-3 w-3 text-[#00bfa5]" />
          <span className="text-xs font-medium text-[#00bfa5] uppercase tracking-wider">
            Open Positions ({openPicks.length})
          </span>
        </div>
      </div>

      {openPicks.length > 0 ? (
        <table className="w-full">
          <thead className="bg-[#0a0a0a] border-b border-[#1a1a1a]">
            <tr>
              <th className="px-4 py-2.5 text-left text-[10px] font-medium text-[#666] uppercase tracking-wider">
                Game
              </th>
              <th className="px-4 py-2.5 text-left text-[10px] font-medium text-[#666] uppercase tracking-wider">
                Market
              </th>
              <th className="px-4 py-2.5 text-left text-[10px] font-medium text-[#666] uppercase tracking-wider">
                Odds
              </th>
              <th className="px-4 py-2.5 text-left text-[10px] font-medium text-[#666] uppercase tracking-wider">
                Stake
              </th>
              <th className="px-4 py-2.5 text-left text-[10px] font-medium text-[#666] uppercase tracking-wider">
                Book
              </th>
              <th className="px-4 py-2.5 text-left text-[10px] font-medium text-[#666] uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-2.5 text-left text-[10px] font-medium text-[#666] uppercase tracking-wider">
                Result
              </th>
            </tr>
          </thead>
          <tbody>
            {openPicks.map(pick => (
              <PickRow key={pick.id} pick={pick} />
            ))}
          </tbody>
        </table>
      ) : (
        <div className="py-8 text-center">
          <p className="text-xs text-[#666]">No open positions</p>
        </div>
      )}

      {/* Settled Picks */}
      {settledPicks.length > 0 && (
        <>
          <div className="px-4 py-3 border-y border-[#1a1a1a] mt-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-3 w-3 text-[#666]" />
              <span className="text-xs font-medium text-[#666] uppercase tracking-wider">
                Settled ({settledPicks.length})
              </span>
            </div>
          </div>

          <table className="w-full">
            <thead className="bg-[#0a0a0a] border-b border-[#1a1a1a]">
              <tr>
                <th className="px-4 py-2.5 text-left text-[10px] font-medium text-[#666] uppercase tracking-wider">
                  Game
                </th>
                <th className="px-4 py-2.5 text-left text-[10px] font-medium text-[#666] uppercase tracking-wider">
                  Market
                </th>
                <th className="px-4 py-2.5 text-left text-[10px] font-medium text-[#666] uppercase tracking-wider">
                  Odds
                </th>
                <th className="px-4 py-2.5 text-left text-[10px] font-medium text-[#666] uppercase tracking-wider">
                  Stake
                </th>
                <th className="px-4 py-2.5 text-left text-[10px] font-medium text-[#666] uppercase tracking-wider">
                  Book
                </th>
                <th className="px-4 py-2.5 text-left text-[10px] font-medium text-[#666] uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-2.5 text-left text-[10px] font-medium text-[#666] uppercase tracking-wider">
                  Result
                </th>
              </tr>
            </thead>
            <tbody>
              {settledPicks.map(pick => (
                <PickRow key={pick.id} pick={pick} />
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
