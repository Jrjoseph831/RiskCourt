import { SlateTable } from "@/components/terminal/SlateTable";
import { mockSlate } from "@/lib/mock/slate";

export default function TodayTerminalPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6">
        <div className="text-2xl font-semibold tracking-tight text-zinc-100">
          Today’s Slate
        </div>
        <div className="mt-1 text-sm text-zinc-400">
          Quant-style terminal view (mock data for now).
        </div>
      </div>

      <SlateTable rows={mockSlate} />
    </main>
  );
}
