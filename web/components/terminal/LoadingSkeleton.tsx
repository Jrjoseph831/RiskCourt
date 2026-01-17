export function StatCardsSkeleton() {
  return (
    <div className="flex flex-col sm:flex-row sm:divide-x sm:divide-[#2a2a2a] border-y border-[#1a1a1a]">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className={`flex-1 px-4 py-3 ${i > 0 ? 'border-t sm:border-t-0 border-[#1a1a1a]' : ''}`}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="h-2.5 w-24 animate-pulse rounded bg-[#2a2a2a]" />
              <div className="mt-2 h-6 w-16 animate-pulse rounded bg-[#2a2a2a]" />
              <div className="mt-1 h-2 w-20 animate-pulse rounded bg-[#2a2a2a]" />
            </div>
            <div className="h-4 w-4 animate-pulse rounded bg-[#2a2a2a] ml-3" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function TableSkeleton() {
  return (
    <div className="border-t border-[#1a1a1a]">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#1a1a1a]">
        <div className="h-4 w-32 animate-pulse rounded bg-[#2a2a2a]" />
        <div className="flex gap-2">
          <div className="h-7 w-48 animate-pulse rounded bg-[#2a2a2a]" />
          <div className="h-7 w-24 animate-pulse rounded bg-[#2a2a2a]" />
        </div>
      </div>

      <div className="border-b border-[#1a1a1a] p-4">
        <div className="flex gap-4">
          <div className="h-3 w-3 animate-pulse rounded bg-[#2a2a2a]" />
          <div className="h-3 w-24 animate-pulse rounded bg-[#2a2a2a]" />
          <div className="h-3 w-16 animate-pulse rounded bg-[#2a2a2a]" />
          <div className="h-3 w-20 animate-pulse rounded bg-[#2a2a2a]" />
          <div className="h-3 w-20 animate-pulse rounded bg-[#2a2a2a]" />
          <div className="h-3 w-16 animate-pulse rounded bg-[#2a2a2a]" />
        </div>
      </div>
      {[...Array(3)].map((_, i) => (
        <div key={i} className="border-b border-[#1a1a1a] p-4">
          <div className="flex gap-4">
            <div className="h-3 w-3 animate-pulse rounded bg-[#2a2a2a]" />
            <div className="h-3 w-24 animate-pulse rounded bg-[#2a2a2a]" />
            <div className="h-3 w-16 animate-pulse rounded bg-[#2a2a2a]" />
            <div className="h-3 w-20 animate-pulse rounded bg-[#2a2a2a]" />
            <div className="h-3 w-20 animate-pulse rounded bg-[#2a2a2a]" />
            <div className="h-3 w-16 animate-pulse rounded bg-[#2a2a2a]" />
          </div>
        </div>
      ))}
    </div>
  );
}
