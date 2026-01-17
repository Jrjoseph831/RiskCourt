"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import type { MarketRow } from "./LiveMarketsTable";
import type { CreatePickInput } from "@/lib/types/database";

interface AddToLedgerDrawerProps {
  market: MarketRow | null;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function AddToLedgerDrawer({ market, open, onClose, onSuccess }: AddToLedgerDrawerProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    marketType: 'spread' as 'moneyline' | 'spread' | 'total' | 'prop',
    selection: 'home',
    line: '',
    odds: '',
    stakeUnits: '1',
    bookSlug: '',
    notes: '',
  });

  // Reset form when drawer opens with new market
  useEffect(() => {
    if (open && market) {
      // Set sensible defaults based on market data
      const defaultMarket = market.market.toLowerCase();
      setFormData({
        marketType: defaultMarket.includes('spread') ? 'spread' : 
                   defaultMarket.includes('total') ? 'total' : 
                   'moneyline',
        selection: 'home',
        line: market.consensus?.toString() || '',
        odds: '-110',
        stakeUnits: '1',
        bookSlug: '',
        notes: '',
      });
    }
  }, [open, market]);

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
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [open, onClose]);

  if (!market) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const supabase = createClient();
      
      // Check if user is authenticated
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Please sign in to add picks to your ledger");
        setIsSubmitting(false);
        return;
      }

      // Build snapshot for full context preservation
      const snapshot = {
        matchup: market.matchup,
        time: market.time,
        consensus: market.consensus,
        fairValue: market.fairValue,
        edge: market.edge,
        reasoning: market.reasoning,
        tags: market.tags,
        gameData: market.gameData,
        capturedAt: new Date().toISOString(),
      };

      const pickInput: CreatePickInput = {
        game_id: market.gameData?.game_id || market.id,
        market_type: formData.marketType,
        selection: formData.selection,
        line: formData.line ? parseFloat(formData.line) : null,
        odds: parseInt(formData.odds),
        stake_units: parseFloat(formData.stakeUnits),
        book_slug: formData.bookSlug || null,
        notes: formData.notes || null,
        snapshot,
      };

      const { error } = await supabase
        .from('picks')
        .insert([pickInput])
        .select()
        .single();

      if (error) throw error;

      toast.success("Pick added to Ledger", {
        description: `${market.matchup} • ${formData.marketType.toUpperCase()} ${formData.selection}`,
      });

      onClose();
      onSuccess?.();
    } catch (err) {
      console.error('Error adding pick:', err);
      toast.error("Failed to add pick", {
        description: err instanceof Error ? err.message : "Please try again",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity ${
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 bottom-0 w-full md:w-[440px] bg-[#121212] border-l border-[#1a1a1a] z-50 flex flex-col transition-transform ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#1a1a1a]">
          <div>
            <h2 className="text-sm font-medium">{market.matchup}</h2>
            <p className="text-xs text-[#666] mt-0.5">{market.time}</p>
          </div>
          <button
            onClick={onClose}
            className="text-[#666] hover:text-white transition-colors p-1 focus:outline-none focus:ring-1 focus:ring-[#00bfa5]"
            aria-label="Close drawer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Market Type */}
          <div>
            <label htmlFor="marketType" className="block text-xs font-medium text-[#a0a0a0] mb-1.5">
              Market Type
            </label>
            <select
              id="marketType"
              value={formData.marketType}
              onChange={(e) => setFormData({ ...formData, marketType: e.target.value as 'moneyline' | 'spread' | 'total' | 'prop' })}
              className="w-full bg-[#0a0a0a] border border-[#2a2a2a] px-3 py-2 text-sm text-white focus:border-[#00bfa5] focus:outline-none transition-colors"
              required
            >
              <option value="moneyline">Moneyline</option>
              <option value="spread">Spread</option>
              <option value="total">Total</option>
              <option value="prop">Prop</option>
            </select>
          </div>

          {/* Selection */}
          <div>
            <label htmlFor="selection" className="block text-xs font-medium text-[#a0a0a0] mb-1.5">
              Selection
            </label>
            <select
              id="selection"
              value={formData.selection}
              onChange={(e) => setFormData({ ...formData, selection: e.target.value })}
              className="w-full bg-[#0a0a0a] border border-[#2a2a2a] px-3 py-2 text-sm text-white focus:border-[#00bfa5] focus:outline-none transition-colors"
              required
            >
              {formData.marketType === 'total' ? (
                <>
                  <option value="over">Over</option>
                  <option value="under">Under</option>
                </>
              ) : (
                <>
                  <option value="home">Home</option>
                  <option value="away">Away</option>
                </>
              )}
            </select>
          </div>

          {/* Line (optional for moneyline) */}
          {formData.marketType !== 'moneyline' && (
            <div>
              <label htmlFor="line" className="block text-xs font-medium text-[#a0a0a0] mb-1.5">
                Line
              </label>
              <input
                id="line"
                type="number"
                step="0.5"
                value={formData.line}
                onChange={(e) => setFormData({ ...formData, line: e.target.value })}
                placeholder="e.g., -4.5 or 220.5"
                className="w-full bg-[#0a0a0a] border border-[#2a2a2a] px-3 py-2 text-sm text-white placeholder:text-[#666] focus:border-[#00bfa5] focus:outline-none transition-colors font-mono"
              />
            </div>
          )}

          {/* Odds */}
          <div>
            <label htmlFor="odds" className="block text-xs font-medium text-[#a0a0a0] mb-1.5">
              Odds (American)
            </label>
            <input
              id="odds"
              type="number"
              value={formData.odds}
              onChange={(e) => setFormData({ ...formData, odds: e.target.value })}
              placeholder="e.g., -110 or +150"
              className="w-full bg-[#0a0a0a] border border-[#2a2a2a] px-3 py-2 text-sm text-white placeholder:text-[#666] focus:border-[#00bfa5] focus:outline-none transition-colors font-mono"
              required
            />
            <p className="mt-1 text-[10px] text-[#666]">Use negative for favorites, positive for underdogs</p>
          </div>

          {/* Stake Units */}
          <div>
            <label htmlFor="stakeUnits" className="block text-xs font-medium text-[#a0a0a0] mb-1.5">
              Stake (units)
            </label>
            <input
              id="stakeUnits"
              type="number"
              step="0.1"
              min="0.1"
              value={formData.stakeUnits}
              onChange={(e) => setFormData({ ...formData, stakeUnits: e.target.value })}
              className="w-full bg-[#0a0a0a] border border-[#2a2a2a] px-3 py-2 text-sm text-white focus:border-[#00bfa5] focus:outline-none transition-colors font-mono"
              required
            />
          </div>

          {/* Book (optional) */}
          <div>
            <label htmlFor="bookSlug" className="block text-xs font-medium text-[#a0a0a0] mb-1.5">
              Sportsbook <span className="text-[#666]">(optional)</span>
            </label>
            <input
              id="bookSlug"
              type="text"
              value={formData.bookSlug}
              onChange={(e) => setFormData({ ...formData, bookSlug: e.target.value })}
              placeholder="e.g., draftkings, fanduel"
              className="w-full bg-[#0a0a0a] border border-[#2a2a2a] px-3 py-2 text-sm text-white placeholder:text-[#666] focus:border-[#00bfa5] focus:outline-none transition-colors"
            />
          </div>

          {/* Notes (optional) */}
          <div>
            <label htmlFor="notes" className="block text-xs font-medium text-[#a0a0a0] mb-1.5">
              Notes <span className="text-[#666]">(optional)</span>
            </label>
            <textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Any additional context or reasoning..."
              rows={3}
              className="w-full bg-[#0a0a0a] border border-[#2a2a2a] px-3 py-2 text-sm text-white placeholder:text-[#666] focus:border-[#00bfa5] focus:outline-none transition-colors resize-none"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2 border-t border-[#1a1a1a]">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#00bfa5] px-4 py-2.5 text-sm font-medium text-black hover:bg-[#00897b] disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-1 focus:ring-[#00bfa5]"
            >
              {isSubmitting ? 'Adding...' : 'Add to Ledger'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
