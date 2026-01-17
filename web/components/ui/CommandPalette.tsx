"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { 
  Search, 
  TrendingUp, 
  BarChart3, 
  BookOpen, 
  Settings,
  X 
} from "lucide-react";

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, onOpenChange]);

  const navigate = (path: string) => {
    router.push(path);
    onOpenChange(false);
    setSearch("");
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50" onClick={() => onOpenChange(false)}>
      <div className="fixed left-1/2 top-1/4 w-full max-w-xl -translate-x-1/2" onClick={(e) => e.stopPropagation()}>
        <Command className="rounded-lg border border-[#333] bg-[#1e1e1e] shadow-xl">
          <div className="flex items-center border-b border-[#2a2a2a] px-4">
            <Search className="h-4 w-4 text-[#666]" />
            <Command.Input
              value={search}
              onValueChange={setSearch}
              placeholder="Search markets, navigate pages..."
              className="flex h-14 w-full bg-transparent px-3 text-sm text-white placeholder:text-[#666] focus:outline-none"
            />
            <button
              onClick={() => onOpenChange(false)}
              className="rounded p-1 hover:bg-[#242424]"
            >
              <X className="h-4 w-4 text-[#666]" />
            </button>
          </div>

          <Command.List className="max-h-96 overflow-y-auto p-2">
            <Command.Empty className="py-6 text-center text-sm text-[#666]">
              No results found.
            </Command.Empty>

            <Command.Group heading="Pages" className="mb-2">
              <div className="mb-1 px-2 py-1.5 text-xs font-medium text-[#666]">PAGES</div>
              <Command.Item
                onSelect={() => navigate("/terminal")}
                className="flex cursor-pointer items-center gap-3 rounded-md px-2 py-2 text-sm hover:bg-[#242424] aria-selected:bg-[#242424]"
              >
                <TrendingUp className="h-4 w-4 text-[#00bfa5]" />
                <span>Terminal</span>
                <kbd className="ml-auto text-xs text-[#666]">⌘1</kbd>
              </Command.Item>
              <Command.Item
                onSelect={() => navigate("/analysis")}
                className="flex cursor-pointer items-center gap-3 rounded-md px-2 py-2 text-sm hover:bg-[#242424] aria-selected:bg-[#242424]"
              >
                <BarChart3 className="h-4 w-4 text-[#00bfa5]" />
                <span>Analysis</span>
                <kbd className="ml-auto text-xs text-[#666]">⌘2</kbd>
              </Command.Item>
              <Command.Item
                onSelect={() => navigate("/ledger")}
                className="flex cursor-pointer items-center gap-3 rounded-md px-2 py-2 text-sm hover:bg-[#242424] aria-selected:bg-[#242424]"
              >
                <BookOpen className="h-4 w-4 text-[#00bfa5]" />
                <span>Ledger</span>
                <kbd className="ml-auto text-xs text-[#666]">⌘3</kbd>
              </Command.Item>
              <Command.Item
                onSelect={() => navigate("/parameters")}
                className="flex cursor-pointer items-center gap-3 rounded-md px-2 py-2 text-sm hover:bg-[#242424] aria-selected:bg-[#242424]"
              >
                <Settings className="h-4 w-4 text-[#00bfa5]" />
                <span>Parameters</span>
                <kbd className="ml-auto text-xs text-[#666]">⌘4</kbd>
              </Command.Item>
            </Command.Group>
          </Command.List>
        </Command>
      </div>
    </div>
  );
}
