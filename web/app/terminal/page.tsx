import { Suspense } from "react";
import { StatCards } from "@/components/terminal/StatCards";
import { TableSkeleton } from "@/components/terminal/LoadingSkeleton";
import { TodaySlateWrapper } from "@/components/terminal/TodaySlateWrapper";

export default function TerminalPage() {
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
              disabled={i !== 1}
              title={i !== 1 ? "Coming soon" : undefined}
              className={
                i === 1
                  ? "bg-[#00bfa5] px-3 py-1.5 text-xs font-medium text-black focus:outline-none focus:ring-1 focus:ring-[#00bfa5]"
                  : "border border-[#2a2a2a] px-3 py-1.5 text-xs text-[#666] hover:border-[#444] transition-colors focus:outline-none focus:ring-1 focus:ring-[#00bfa5] opacity-50 cursor-not-allowed"
              }
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <StatCards />
        <Suspense fallback={<TableSkeleton />}>
          <TodaySlateWrapper />
        </Suspense>
      </div>
    </div>
  );
}
