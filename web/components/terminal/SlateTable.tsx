"use client";

import { useMemo, useState } from "react";
import type { MarketKey, SlateRow } from "@/lib/mock/slate";

function formatMarket(m: MarketKey) {
  if (m === "h2h") return "ML";
  if (m === "spreads") return "Spread";
  return "Total";
}

function formatPrice(american: number) {
  return american > 0 ? `+${american}` : `${american}`;
}

function formatLine(row: SlateRow) {
  if (row.market === "h2h") return "—";
  return row.market === "totals" ? `${row.line}` : `${row.line}`;
}

export function SlateTable({ rows }: { rows: SlateRow[] }) {
  const [q, setQ] = useState("");
  const [market, setMarket] = useState<MarketKey | "all">("all");

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    return rows.filter((r) => {
      const matchQ =
        !qq ||
        r.away.toLowerCase().includes(qq) ||
        r.home.toLowerCase().includes(qq);
      const matchM = market === "all" ? true : r.market === market;
      return matchQ && matchM;
    });
  }, [rows, q, market]);

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2">
          <input
            className="w-full sm:w-64 rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm outline-none focus:border-zinc-600"
            placeholder="Search team (e.g. BOS)"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <select
            className="rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm outline-none focus:border-zinc-600"
            value={market}
            onChange={(e) => setMarket(e.target.value as any)}
          >
            <option value="all">All</option>
            <option value="h2h">Moneyline</option>
            <option value="spreads">Spreads</option>
            <option value="totals">Totals</option>
          </select>
        </div>

        <div className="text-xs text-zinc-400">
          Rows: {filtered.length}
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-zinc-800">
        <div className="grid grid-cols-12 gap-0 bg-zinc-950 px-3 py-2 text-xs text-zinc-400">
          <div className="col-span-2">Time</div>
          <div className="col-span-4">Matchup</div>
          <div className="col-span-2">Mkt</div>
          <div className="col-span-2">Pick</div>
          <div className="col-span-1 text-right">Line</div>
          <div className="col-span-1 text-right">Price</div>
        </div>

        <div className="divide-y divide-zinc-900">
          {filtered.map((r) => (
            <div
              key={r.id}
              className="grid grid-cols-12 px-3 py-2 text-sm hover:bg-zinc-950/60"
            >
              <div className="col-span-2 text-zinc-300">
                {new Date(r.gameTime).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
              <div className="col-span-4 text-zinc-200">
                {r.away} @ {r.home}
              </div>
              <div className="col-span-2 text-zinc-300">{formatMarket(r.market)}</div>
              <div className="col-span-2 text-zinc-200">{r.selection}</div>
              <div className="col-span-1 text-right text-zinc-300">{formatLine(r)}</div>
              <div className="col-span-1 text-right text-zinc-200">{formatPrice(r.bestPrice)}</div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="px-3 py-8 text-center text-sm text-zinc-500">
              No rows match your filters.
            </div>
          )}
        </div>
      </div>

      <div className="text-xs text-zinc-500">
        Mock data for UI build. Will be replaced by Supabase reads after db-schema-v0 merges.
      </div>
    </div>
  );
}
