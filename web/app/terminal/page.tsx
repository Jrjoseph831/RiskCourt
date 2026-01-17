import { StatCards } from "@/components/terminal/StatCards";
import { LiveMarketsTable, type MarketRow } from "@/components/terminal/LiveMarketsTable";

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
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Terminal</h1>
          <p className="mt-1 text-sm text-[#a0a0a0]">
            Live market analysis and opportunities
          </p>
        </div>

        <div className="flex items-center gap-2">
          {["Yesterday", "Today", "Tomorrow"].map((day, i) => (
            <button
              key={day}
              className={
                i === 1
                  ? "rounded-md bg-[#00bfa5] px-4 py-2 text-sm font-medium text-black"
                  : "rounded-md border border-[#333] bg-[#242424] px-4 py-2 text-sm text-[#a0a0a0] hover:border-[#444] hover:text-white"
              }
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      <StatCards />

      <LiveMarketsTable data={mockData} />
    </div>
  );
}
