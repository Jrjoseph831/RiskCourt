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
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="rounded-lg border border-[#2a2a2a] bg-[#1e1e1e] p-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-[#a0a0a0]">{stat.label}</p>
                <p className="mt-2 text-2xl font-semibold font-mono">{stat.value}</p>
                <p className="mt-1 text-xs text-[#666]">{stat.sublabel}</p>
              </div>
              <Icon className="h-5 w-5" style={{ color: stat.color }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
