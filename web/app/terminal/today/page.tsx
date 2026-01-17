import { SlateTable } from "@/components/terminal/SlateTable";
import { mockSlate } from "@/lib/mock/slate";

export default function TodayTerminalPage() {
  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-[#1a1a1a]">
        <h1 className="text-lg font-medium tracking-tight">Today's Slate</h1>
        <p className="mt-0.5 text-xs text-[#666]">
          Quant-style terminal view (mock data for now).
        </p>
      </div>

      <div className="flex-1 overflow-auto">
        <SlateTable rows={mockSlate} />
      </div>
    </div>
  );
}
