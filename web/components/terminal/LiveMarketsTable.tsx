"use client";

import { Fragment, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
  type ExpandedState,
  type VisibilityState,
} from "@tanstack/react-table";
import { ChevronDown, ChevronRight, Plus, Activity } from "lucide-react";
import { cn } from "@/lib/cn";
import { AddToLedgerDrawer } from "./AddToLedgerDrawer";
import { ColumnsControl } from "./ColumnsControl";
import { DensityControl } from "./DensityControl";
import type { TodayGame } from "@/lib/types/database";

export type MarketRow = {
  id: string;
  matchup: string;
  time: string;
  market: string;
  consensus: number;
  fairValue: number;
  edge: number;
  reasoning?: string;
  tags?: string[];
  gameData?: TodayGame; // Full game data for detail drawer
};

const columns: ColumnDef<MarketRow>[] = [
  {
    id: "expander",
    cell: ({ row }) => (
      <button
        onClick={() => row.toggleExpanded()}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            row.toggleExpanded();
          }
        }}
        aria-label={row.getIsExpanded() ? "Collapse row" : "Expand row"}
        aria-expanded={row.getIsExpanded()}
        className="p-1 hover:bg-[#242424] rounded focus:outline-none focus:ring-2 focus:ring-[#00bfa5]"
      >
        {row.getIsExpanded() ? (
          <ChevronDown className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
      </button>
    ),
  },
  {
    accessorKey: "matchup",
    header: "Matchup",
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.original.matchup}</div>
        <div className="text-xs text-[#666]">{row.original.time}</div>
      </div>
    ),
  },
  {
    accessorKey: "market",
    header: "Market",
    cell: ({ row }) => (
      <span className="inline-flex rounded-full bg-[#00bfa5]/10 px-2 py-0.5 text-xs font-mono text-[#00bfa5]">
        {row.original.market}
      </span>
    ),
  },
  {
    accessorKey: "consensus",
    header: "Consensus",
    cell: ({ row }) => (
      <span className="font-mono text-sm">{row.original.consensus > 0 ? '+' : ''}{row.original.consensus}</span>
    ),
  },
  {
    accessorKey: "fairValue",
    header: "Fair Value",
    cell: ({ row }) => (
      <span className="font-mono text-sm">{row.original.fairValue > 0 ? '+' : ''}{row.original.fairValue}</span>
    ),
  },
  {
    accessorKey: "edge",
    header: "Edge %",
    cell: ({ row }) => {
      const edge = row.original.edge;
      const color = edge > 0 ? "text-[#00bfa5]" : edge < 0 ? "text-red-400" : "text-[#666]";
      return (
        <span className={cn("font-mono text-sm font-semibold", color)}>
          {edge > 0 ? '+' : ''}{edge.toFixed(1)}%
        </span>
      );
    },
  },
];

type Density = "compact" | "comfortable";

export function LiveMarketsTable({ data }: { data: MarketRow[] }) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [selectedMarket, setSelectedMarket] = useState<MarketRow | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [density, setDensity] = useState<Density>("comfortable");

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter, expanded, columnVisibility },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onExpandedChange: setExpanded,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getRowCanExpand: () => true,
  });

  return (
    <div className="border-t border-[#1a1a1a]">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#1a1a1a]">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Activity className="h-3 w-3 text-[#00bfa5]" />
            <span className="text-xs font-medium text-[#00bfa5] uppercase tracking-wider">Live Markets</span>
          </div>
          <div className="h-3 w-px bg-[#2a2a2a]" />
          <button className="text-[10px] uppercase tracking-wider text-[#666] hover:text-[#a0a0a0] transition-colors">
            Feed
          </button>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Filter slate..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            aria-label="Filter markets"
            className="h-7 w-48 bg-transparent border-b border-[#2a2a2a] px-2 text-xs text-white placeholder:text-[#666] focus:border-[#00bfa5] focus:outline-none transition-colors"
          />
          <DensityControl
            onDensityChange={setDensity}
          />
          <ColumnsControl
            table={table}
          />
        </div>
      </div>

      <div>
        <table className="w-full">
          <thead className="sticky top-0 bg-[#121212] z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b border-[#1a1a1a]">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-2.5 text-left text-[10px] font-medium text-[#666] uppercase tracking-wider"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <Fragment key={row.id}>
                <tr
                  className={cn(
                    "border-b border-[#1a1a1a] hover:bg-[#1a1a1a]/30 transition-colors cursor-pointer",
                    density === "compact" ? "h-10" : "h-12"
                  )}
                  onClick={(e) => {
                    // Don't open drawer if clicking expander button
                    const target = e.target as HTMLElement;
                    if (target.closest('button[aria-label*="Expand"]') || target.closest('button[aria-label*="Collapse"]')) {
                      return;
                    }
                    setSelectedMarket(row.original);
                    setDrawerOpen(true);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedMarket(row.original);
                      setDrawerOpen(true);
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  aria-label={`View details for ${row.original.matchup}`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className={cn(
                        "px-4 text-sm",
                        density === "compact" ? "py-2" : "py-3"
                      )}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
                {row.getIsExpanded() && (
                  <tr key={`${row.id}-expanded`}>
                    <td colSpan={columns.length} className="bg-[#0a0a0a] border-b border-[#1a1a1a] p-4">
                      <div className="space-y-3 max-w-4xl">
                        <div>
                          <h4 className="mb-1.5 text-[10px] font-medium text-[#00bfa5] uppercase tracking-wider">
                            Model Reasoning
                          </h4>
                          <p className="text-sm text-[#a0a0a0] leading-relaxed">
                            {row.original.reasoning ||
                              "Our model identified value based on historical performance, recent form, and market inefficiency. Sharp money movement detected on this line."}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {(row.original.tags || ["Trend detected", "Sharp money", "Value play"]).map(
                            (tag) => (
                              <span
                                key={tag}
                                className="text-[10px] uppercase tracking-wider text-[#00bfa5] border border-[#00bfa5]/20 px-2 py-0.5"
                              >
                                {tag}
                              </span>
                            )
                          )}
                        </div>

                        <div className="flex gap-3 pt-1">
                          <button className="flex items-center gap-1.5 bg-[#00bfa5] px-3 py-1.5 text-xs font-medium text-black hover:bg-[#00897b] transition-colors focus:outline-none focus:ring-1 focus:ring-[#00bfa5]">
                            <Plus className="h-3.5 w-3.5" />
                            Add to Ledger
                          </button>
                          <button className="border border-[#2a2a2a] px-3 py-1.5 text-xs text-[#a0a0a0] hover:border-[#00bfa5] hover:text-[#00bfa5] transition-colors focus:outline-none focus:ring-1 focus:ring-[#00bfa5]">
                            Simulate Sizing
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>

        {table.getRowModel().rows.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-sm text-[#666]">No live markets yet — check back soon.</p>
          </div>
        )}
      </div>

      <AddToLedgerDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        market={selectedMarket}
      />
    </div>
  );
}
