"use client";

import { Search, Activity } from "lucide-react";
import { useState } from "react";

export function TopBar() {
  const [, setCommandOpen] = useState(false);

  return (
    <div className="flex h-14 items-center justify-between border-b border-[#2a2a2a] bg-[#1e1e1e] px-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setCommandOpen(true)}
          className="flex h-9 w-96 items-center gap-2 rounded-md border border-[#333] bg-[#242424] px-3 text-sm text-[#666] hover:border-[#444] hover:text-[#a0a0a0]"
        >
          <Search className="h-4 w-4" />
          <span>Search markets...</span>
          <kbd className="ml-auto rounded bg-[#1e1e1e] px-1.5 py-0.5 text-xs font-mono text-[#666]">
            ⌘K
          </kbd>
        </button>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-xs">
          <Activity className="h-3.5 w-3.5 text-[#00bfa5]" />
          <span className="font-mono text-[#00bfa5]">SYSTEM: ONLINE</span>
        </div>

        <div className="font-mono text-xs text-[#a0a0a0]">
          LATENCY: <span className="text-white">42ms</span>
        </div>

        <div className="text-xs text-[#a0a0a0]">
          {new Date().toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
          })}
        </div>

        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#00bfa5] text-xs font-semibold text-black">
          JD
        </div>
      </div>
    </div>
  );
}
