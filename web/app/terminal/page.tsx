"use client";

import { useState } from "react";
import { StatCards } from "@/components/terminal/StatCards";
import { LiveMarketsTable, type MarketRow } from "@/components/terminal/LiveMarketsTable";
import { StatCardsSkeleton, TableSkeleton } from "@/components/terminal/LoadingSkeleton";
import { ErrorState } from "@/components/terminal/ErrorState";

const mockData: MarketRow[] = [
  {
    id: "1",
    matchup: "NYK @ BOS",
    time: "7:30 PM ET",
    market: "ML",
    consensus: -135,
    fairValue: -148,
    edge: 2.3,
    reasoning: "Our model shows Boston's defensive efficiency has improved significantly in recent home games. Public money is split, but sharp action came in on Boston at better numbers.",
    tags: ["Home advantage", "Sharp money", "Defensive edge"],
  },
  {
    id: "2",
    matchup: "LAL @ DEN",
    time: "10:00 PM ET",
    market: "SPREAD",
    consensus: -4.5,
    fairValue: -6.2,
    edge: 3.1,
    reasoning: "Denver's rest advantage (3 days vs 1) combined with altitude factor presents exploitable value. Line movement suggests recreational money on Lakers.",
    tags: ["Rest advantage", "Value play", "Line movement"],
  },
  {
    id: "3",
    matchup: "GSW @ PHX",
    time: "9:00 PM ET",
    market: "TOTAL",
    consensus: 229.5,
    fairValue: 224.0,
    edge: 1.8,
    reasoning: "Pace metrics suggest Under value. Both teams rank bottom-10 in transition frequency recently, and defensive ratings trending up.",
    tags: ["Pace factor", "Defensive trend"],
  },
];

export default function TerminalPage() {
  // Simulate different states - set to "success" for normal operation
  const [state] = useState<"loading" | "error" | "success">("success");

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between px-4 py-3 border-b border-[#1a1a1a]">
        <div>
          <h1 className="text-lg font-medium tracking-tight">Terminal</h1>
          <p className="mt-0.5 text-xs text-[#666]">
            Live market analysis and opportunities
          </p>
        </div>

        <div className="flex items-center gap-1.5 mt-3 md:mt-0">
          {["Yesterday", "Today", "Tomorrow"].map((day, i) => (
            <button
              key={day}
              className={
                i === 1
                  ? "bg-[#00bfa5] px-3 py-1.5 text-xs font-medium text-black focus:outline-none focus:ring-1 focus:ring-[#00bfa5]"
                  : "border border-[#2a2a2a] px-3 py-1.5 text-xs text-[#666] hover:border-[#444] hover:text-white transition-colors focus:outline-none focus:ring-1 focus:ring-[#00bfa5]"
              }
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {state === "loading" && (
          <>
            <StatCardsSkeleton />
            <TableSkeleton />
          </>
        )}

        {state === "error" && (
          <>
            <StatCards />
            <ErrorState
              title="Unable to load live markets"
              message="We're having trouble connecting to our data sources. Showing sample data below."
              details="Network error: Failed to fetch from api.riskcourt.com/v1/slate/today"
              onRetry={() => window.location.reload()}
            />
            <LiveMarketsTable data={mockData} />
          </>
        )}

        {state === "success" && (
          <>
            <StatCards />
            <LiveMarketsTable data={mockData} />
          </>
        )}
      </div>
    </div>
  );
}
