"use client";

import { Check } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import type { Table } from "@tanstack/react-table";

interface ColumnsControlProps<TData> {
  table: Table<TData>;
  storageKey?: string;
}

export function ColumnsControl<TData>({ table, storageKey = "riskcourt:terminal:columns" }: ColumnsControlProps<TData>) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Load from localStorage
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          const columnVisibility = JSON.parse(saved);
          table.setColumnVisibility(columnVisibility);
        } catch (e) {
          console.error("Failed to load column visibility", e);
        }
      }
    }
  }, [storageKey, table]);
  
  useEffect(() => {
    // Save to localStorage whenever visibility changes
    if (typeof window !== "undefined") {
      const visibility = table.getState().columnVisibility;
      localStorage.setItem(storageKey, JSON.stringify(visibility));
    }
  }, [table.getState().columnVisibility, storageKey]);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);
  
  const allColumns = table.getAllColumns().filter(col => col.id !== "expander");
  
  const handleReset = () => {
    table.resetColumnVisibility();
    if (typeof window !== "undefined") {
      localStorage.removeItem(storageKey);
    }
  };
  
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-[#666] hover:text-[#a0a0a0] transition-colors focus:outline-none focus:text-[#00bfa5]"
        aria-label="Toggle columns"
        aria-expanded={isOpen}
      >
        Columns
      </button>
      
      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-48 bg-[#1e1e1e] border border-[#2a2a2a] shadow-lg z-50">
          <div className="p-2 space-y-1">
            {allColumns.map((column) => {
              const isVisible = column.getIsVisible();
              return (
                <label
                  key={column.id}
                  className="flex items-center gap-2 px-2 py-1.5 text-xs hover:bg-[#242424] cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-center w-4 h-4 border border-[#2a2a2a]">
                    {isVisible && <Check className="h-3 w-3 text-[#00bfa5]" />}
                  </div>
                  <input
                    type="checkbox"
                    checked={isVisible}
                    onChange={(e) => column.toggleVisibility(e.target.checked)}
                    className="sr-only"
                  />
                  <span className="capitalize">
                    {typeof column.columnDef.header === "string" 
                      ? column.columnDef.header 
                      : column.id}
                  </span>
                </label>
              );
            })}
          </div>
          <div className="border-t border-[#1a1a1a] p-2">
            <button
              onClick={handleReset}
              className="w-full text-xs text-[#666] hover:text-[#00bfa5] py-1.5 transition-colors"
            >
              Reset to Default
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
