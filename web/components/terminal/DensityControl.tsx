"use client";

import { useState, useEffect } from "react";

type Density = "compact" | "comfortable";

interface DensityControlProps {
  onDensityChange: (density: Density) => void;
  storageKey?: string;
}

export function DensityControl({ onDensityChange, storageKey = "riskcourt:terminal:density" }: DensityControlProps) {
  const [density, setDensity] = useState<Density>("comfortable");
  
  useEffect(() => {
    // Load from localStorage
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(storageKey) as Density | null;
      if (saved && (saved === "compact" || saved === "comfortable")) {
        setDensity(saved);
        onDensityChange(saved);
      }
    }
  }, [storageKey, onDensityChange]);
  
  const toggleDensity = () => {
    const newDensity = density === "compact" ? "comfortable" : "compact";
    setDensity(newDensity);
    onDensityChange(newDensity);
    
    if (typeof window !== "undefined") {
      localStorage.setItem(storageKey, newDensity);
    }
  };
  
  return (
    <button
      onClick={toggleDensity}
      className="text-[10px] uppercase tracking-wider text-[#666] hover:text-[#a0a0a0] transition-colors focus:outline-none focus:text-[#00bfa5]"
      title={`Current: ${density === "compact" ? "Compact" : "Comfortable"}. Click to toggle.`}
    >
      {density === "compact" ? "Compact" : "Comfortable"}
    </button>
  );
}

export type { Density };
