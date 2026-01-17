"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Terminal, BarChart3, BookOpen, Settings } from "lucide-react";
import { cn } from "@/lib/cn";

const navItems = [
  { name: "Terminal", href: "/terminal", icon: Terminal },
  { name: "Analysis", href: "/analysis", icon: BarChart3 },
  { name: "Ledger", href: "/ledger", icon: BookOpen },
];

const bottomItems = [
  { name: "Parameters", href: "/parameters", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-screen w-60 flex-col border-r border-[#2a2a2a] bg-[#1e1e1e]">
      <div className="flex h-14 items-center border-b border-[#2a2a2a] px-4">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded bg-[#00bfa5]" />
          <span className="text-sm font-semibold">RiskCourt_</span>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname?.startsWith(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-[#00bfa5]/10 text-[#00bfa5]"
                  : "text-[#a0a0a0] hover:bg-[#242424] hover:text-white"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-[#2a2a2a] p-3">
        {bottomItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-[#00bfa5]/10 text-[#00bfa5]"
                  : "text-[#a0a0a0] hover:bg-[#242424] hover:text-white"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
