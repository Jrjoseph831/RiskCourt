"use client";

import { useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { ChevronDown, ChevronRight, Filter, Plus, Activity } from "lucide-react";
import { cn } from "@/lib/cn";

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
};

const columns: ColumnDef<MarketRow>[] = [
  {
    id: "expander",
    cell: ({ row }) => (
      <button
        onClick={() => row.toggleExpanded()}
        className="p-1 hover:bg-[#242424] rounded"
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

export function LiveMarketsTable({ data }: { data: MarketRow[] }) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter, expanded },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onExpandedChange: setExpanded,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getRowCanExpand: () => true,
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 rounded-full bg-[#00bfa5]/10 px-4 py-1.5">
            <Activity className="h-3.5 w-3.5 text-[#00bfa5]" />
            <span className="text-sm font-medium text-[#00bfa5]">LIVE MARKETS</span>
          </div>
          <button className="rounded-md border border-[#333] bg-[#242424] px-3 py-1.5 text-xs text-[#a0a0a0] hover:border-[#444] hover:text-white">
            LIVE FEED
          </button>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Filter slate..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="h-9 rounded-md border border-[#333] bg-[#242424] px-3 text-sm text-white placeholder:text-[#666] focus:border-[#00bfa5] focus:outline-none"
          />
          <button className="flex h-9 items-center gap-2 rounded-md border border-[#333] bg-[#242424] px-3 text-sm text-[#a0a0a0] hover:border-[#444] hover:text-white">
            <Filter className="h-4 w-4" />
            Columns
          </button>
        </div>
      </div>

      <div className="rounded-lg border border-[#2a2a2a] bg-[#1e1e1e]">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b border-[#2a2a2a]">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-left text-xs font-medium text-[#a0a0a0]"
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
              <>
                <tr
                  key={row.id}
                  className="border-b border-[#2a2a2a] hover:bg-[#242424]"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3 text-sm">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
                {row.getIsExpanded() && (
                  <tr key={`${row.id}-expanded`}>
                    <td colSpan={columns.length} className="bg-[#242424] p-4">
                      <div className="space-y-4">
                        <div>
                          <h4 className="mb-2 text-sm font-semibold text-[#00bfa5]">
                            MODEL REASONING
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
                                className="rounded-full bg-[#00bfa5]/10 px-3 py-1 text-xs text-[#00bfa5]"
                              >
                                {tag}
                              </span>
                            )
                          )}
                        </div>

                        <div className="flex gap-2">
                          <button className="flex items-center gap-2 rounded-md bg-[#00bfa5] px-4 py-2 text-sm font-medium text-black hover:bg-[#00897b]">
                            <Plus className="h-4 w-4" />
                            Add to Ledger
                          </button>
                          <button className="rounded-md border border-[#333] bg-[#1e1e1e] px-4 py-2 text-sm text-[#a0a0a0] hover:border-[#00bfa5] hover:text-[#00bfa5]">
                            Simulate Sizing
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>

        {table.getRowModel().rows.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-sm text-[#666]">No live markets yet — check back soon.</p>
          </div>
        )}
      </div>
    </div>
  );
}
