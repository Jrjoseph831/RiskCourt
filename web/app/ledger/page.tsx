import { Suspense } from "react";
import { PortfolioList } from "@/components/ledger/PortfolioList";
import { TableSkeleton } from "@/components/terminal/LoadingSkeleton";

export default function LedgerPage() {
  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-[#1a1a1a]">
        <h1 className="text-lg font-medium tracking-tight">Portfolio / Ledger</h1>
        <p className="mt-0.5 text-xs text-[#666]">
          Track your picks and manage your positions
        </p>
      </div>

      <div className="flex-1 overflow-auto">
        <Suspense fallback={<TableSkeleton />}>
          <PortfolioList />
        </Suspense>
      </div>
    </div>
  );
}
