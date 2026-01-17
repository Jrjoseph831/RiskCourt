import { TrendingUp, Shield, Database, Zap } from "lucide-react";

const stats = [
  {
    label: "Opportunities",
    value: "12",
    sublabel: "with +EV",
    icon: TrendingUp,
    color: "#00bfa5",
  },
  {
    label: "Risk Cap Utilized",
    value: "23%",
    sublabel: "of $50k daily",
    icon: Shield,
    color: "#00bfa5",
  },
  {
    label: "Data Status",
    value: "LIVE",
    sublabel: "all sources connected",
    icon: Database,
    color: "#00bfa5",
  },
  {
    label: "Engine Latency",
    value: "42ms",
    sublabel: "avg response time",
    icon: Zap,
    color: "#00bfa5",
  },
];

export function StatCards() {
  return (
    <div className="flex flex-col sm:flex-row sm:divide-x sm:divide-[#2a2a2a] border-y border-[#1a1a1a]">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className={`flex-1 px-4 py-3 ${index > 0 ? 'border-t sm:border-t-0 border-[#1a1a1a]' : ''}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-[10px] uppercase tracking-wider text-[#666] font-medium">{stat.label}</p>
                <p className="mt-1.5 text-xl font-mono font-semibold">{stat.value}</p>
                <p className="mt-0.5 text-[11px] text-[#666]">{stat.sublabel}</p>
              </div>
              <Icon className="h-4 w-4 text-[#666] ml-3" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
