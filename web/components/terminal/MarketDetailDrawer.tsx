"use client";

import { X, TrendingUp, TrendingDown } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";
import type { MarketRow } from "./LiveMarketsTable";

interface MarketDetailDrawerProps {
  market: MarketRow | null;
  open: boolean;
  onClose: () => void;
}

// Mock line movement data (small SVG sparkline)
const generateSparklineData = (edge: number) => {
  // Generate 12 mock data points showing line movement
  const baseValue = 100;
  const points: number[] = [];
  let current = baseValue;
  
  for (let i = 0; i < 12; i++) {
    const change = (Math.random() - 0.5) * 3;
    current += change;
    points.push(current);
  }
  
  // Make the final value align with edge direction
  if (edge > 0) {
    points[points.length - 1] = baseValue + Math.abs(edge) * 2;
  } else if (edge < 0) {
    points[points.length - 1] = baseValue - Math.abs(edge) * 2;
  }
  
  return points;
};

const MiniSparkline = ({ data, positive }: { data: number[]; positive: boolean }) => {
  const width = 120;
  const height = 32;
  const padding = 2;
  
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  
  const points = data
    .map((value, index) => {
      const x = (index / (data.length - 1)) * (width - padding * 2) + padding;
      const y = height - padding - ((value - min) / range) * (height - padding * 2);
      return `${x},${y}`;
    })
    .join(" ");
  
  return (
    <svg width={width} height={height} className="inline-block">
      <polyline
        points={points}
        fill="none"
        stroke={positive ? "#00bfa5" : "#ef4444"}
        strokeWidth="1.5"
        opacity="0.8"
      />
    </svg>
  );
};

export function MarketDetailDrawer({ market, open, onClose }: MarketDetailDrawerProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        onClose();
      }
    };
    
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.body.style.overflow = "unset";
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, onClose]);
  
  if (!open || !market) return null;
  
  const handleAddToLedger = () => {
    toast.success("Added to Ledger", {
      description: `${market.matchup} ${market.market}`,
      duration: 2000,
    });
    onClose();
  };
  
  const sparklineData = generateSparklineData(market.edge);
  
  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-[#1e1e1e] border-l border-[#1a1a1a] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between px-4 py-3 border-b border-[#1a1a1a] bg-[#1e1e1e]">
          <div className="flex items-center gap-3">
            <div>
              <h2 className="text-sm font-medium">{market.matchup}</h2>
              <p className="text-xs text-[#666]">{market.time}</p>
            </div>
            <span className="text-[10px] uppercase tracking-wider text-[#00bfa5] border border-[#00bfa5]/20 px-2 py-0.5">
              {market.market}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-[#242424] transition-colors focus:outline-none focus:ring-1 focus:ring-[#00bfa5]"
            aria-label="Close drawer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-4 space-y-6">
          {/* Key Numbers */}
          <div className="grid grid-cols-3 gap-3">
            <div className="border-l-2 border-[#2a2a2a] pl-3">
              <div className="text-[10px] uppercase tracking-wider text-[#666]">Consensus</div>
              <div className="mt-1 text-lg font-mono">{market.consensus > 0 ? '+' : ''}{market.consensus}</div>
            </div>
            <div className="border-l-2 border-[#2a2a2a] pl-3">
              <div className="text-[10px] uppercase tracking-wider text-[#666]">Fair Value</div>
              <div className="mt-1 text-lg font-mono">{market.fairValue > 0 ? '+' : ''}{market.fairValue}</div>
            </div>
            <div className="border-l-2 border-[#00bfa5]/30 pl-3">
              <div className="text-[10px] uppercase tracking-wider text-[#666]">Edge</div>
              <div className={`mt-1 text-lg font-mono font-semibold ${market.edge > 0 ? 'text-[#00bfa5]' : 'text-red-400'}`}>
                {market.edge > 0 ? '+' : ''}{market.edge.toFixed(1)}%
              </div>
            </div>
          </div>
          
          {/* What it Means */}
          <div>
            <h3 className="text-[10px] uppercase tracking-wider text-[#666] mb-2">What it Means</h3>
            <p className="text-sm text-[#a0a0a0] leading-relaxed">
              {market.reasoning || 
                `Our model identifies this line as ${market.edge > 0 ? 'favorable' : 'unfavorable'} based on recent performance trends, matchup dynamics, and market positioning. The ${Math.abs(market.edge).toFixed(1)}% edge suggests ${market.edge > 0 ? 'value' : 'caution'} at current consensus pricing.`}
            </p>
          </div>
          
          {/* Notable Factors */}
          {market.tags && market.tags.length > 0 && (
            <div>
              <h3 className="text-[10px] uppercase tracking-wider text-[#666] mb-2">Notable Factors</h3>
              <div className="flex flex-wrap gap-2">
                {market.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] uppercase tracking-wider text-[#00bfa5] border border-[#00bfa5]/20 px-2 py-0.5"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {/* Line Movement */}
          <div>
            <h3 className="text-[10px] uppercase tracking-wider text-[#666] mb-2">Line Movement (24h)</h3>
            <div className="flex items-center gap-3 p-3 bg-[#0a0a0a] border border-[#1a1a1a]">
              <MiniSparkline data={sparklineData} positive={market.edge > 0} />
              <div className="flex items-center gap-1.5 text-xs">
                {market.edge > 0 ? (
                  <>
                    <TrendingUp className="h-3.5 w-3.5 text-[#00bfa5]" />
                    <span className="text-[#00bfa5]">Improving</span>
                  </>
                ) : (
                  <>
                    <TrendingDown className="h-3.5 w-3.5 text-red-400" />
                    <span className="text-red-400">Declining</span>
                  </>
                )}
              </div>
            </div>
          </div>
          
          {/* Actions */}
          <div className="space-y-2 pt-2 border-t border-[#1a1a1a]">
            <button
              onClick={handleAddToLedger}
              className="w-full flex items-center justify-center gap-2 bg-[#00bfa5] px-4 py-2.5 text-sm font-medium text-black hover:bg-[#00897b] transition-colors focus:outline-none focus:ring-1 focus:ring-[#00bfa5]"
            >
              Add to Ledger
            </button>
            <button
              disabled
              className="w-full border border-[#2a2a2a] px-4 py-2.5 text-sm text-[#666] cursor-not-allowed"
            >
              Simulate Outcome (Coming Soon)
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
