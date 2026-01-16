import Link from "next/link";

export const metadata = {
  title: "RiskCourt Terminal",
};

export default function TerminalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6">
        <aside className="w-64 shrink-0 rounded-lg border border-zinc-800 bg-zinc-900/40 p-4">
          <div className="mb-6">
            <div className="text-lg font-semibold">RiskCourt</div>
            <div className="text-xs text-zinc-500">Quant terminal</div>
          </div>

          <nav className="flex flex-col gap-2">
            <Link className="rounded px-3 py-2 text-sm hover:bg-zinc-800/60" href="/terminal/today">Today</Link>
            <Link className="rounded px-3 py-2 text-sm hover:bg-zinc-800/60" href="/terminal/bet-lab">Bet Lab</Link>
            <Link className="rounded px-3 py-2 text-sm hover:bg-zinc-800/60" href="/terminal/strategy">Strategy</Link>
            <Link className="rounded px-3 py-2 text-sm hover:bg-zinc-800/60" href="/terminal/portfolio">Portfolio</Link>
          </nav>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col gap-6">
          <header className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900/30 px-4 py-2">
            <div className="flex items-center gap-4">
              <div className="text-sm font-semibold">RiskCourt</div>
              <div className="text-xs text-zinc-400">Terminal</div>
            </div>

            <div className="flex items-center gap-3 text-xs text-zinc-400">
              <div>{new Date().toLocaleDateString()}</div>
              <div className="h-6 w-px bg-zinc-800" />
              <div className="rounded-md border border-zinc-800 px-2 py-1 text-xs">Profile</div>
            </div>
          </header>

          <main className="rounded-lg border border-zinc-800 bg-gradient-to-b from-zinc-900/50 to-zinc-950/30 p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
