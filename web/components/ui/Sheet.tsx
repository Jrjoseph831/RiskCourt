"use client";

import { X } from "lucide-react";
import { useEffect } from "react";

interface SheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export function Sheet({ open, onOpenChange, children }: SheetProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        onClick={() => onOpenChange(false)}
      />

      {/* Sheet */}
      <div className="fixed inset-y-0 left-0 z-50 w-56 bg-[#1e1e1e] border-r border-[#2a2a2a] lg:hidden">
        <div className="flex h-14 items-center justify-between border-b border-[#2a2a2a] px-3">
          <span className="text-sm font-semibold">RiskCourt_</span>
          <button
            onClick={() => onOpenChange(false)}
            className="rounded p-1 hover:bg-[#242424] focus:outline-none focus:ring-2 focus:ring-[#00bfa5]"
            aria-label="Close menu"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {children}
      </div>
    </>
  );
}
