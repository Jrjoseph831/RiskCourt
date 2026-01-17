"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { Sidebar, SidebarContent } from "./Sidebar";
import { TopBar } from "./TopBar";
import { Sheet } from "@/components/ui/Sheet";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-[#121212]">
      <Sidebar />
      
      {/* Mobile Menu Sheet */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SidebarContent onNavigate={() => setMobileMenuOpen(false)} />
      </Sheet>

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile Menu Button */}
        <div className="flex lg:hidden h-14 items-center border-b border-[#2a2a2a] bg-[#1e1e1e] px-4">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="rounded p-2 hover:bg-[#242424] focus:outline-none focus:ring-2 focus:ring-[#00bfa5]"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="ml-3 flex items-center gap-2">
            <div className="h-5 w-5 rounded bg-[#00bfa5]" />
            <span className="text-sm font-semibold">RiskCourt_</span>
          </div>
        </div>

        <TopBar />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
