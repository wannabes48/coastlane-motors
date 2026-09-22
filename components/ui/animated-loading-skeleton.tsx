'use client';
import { useEffect, useState } from 'react';

// Single shimmer card matching the real CarCard proportions
function SkeletonCard() {
  return (
    <div className="flex flex-col bg-white border border-line rounded-[var(--radius-lg)] overflow-hidden">
      {/* photo area 4:3 */}
      <div className="aspect-[4/3] bg-[#E8F4FD] animate-pulse" />
      {/* body */}
      <div className="p-3.5 flex flex-col gap-2">
        <div className="h-3.5 w-3/4 rounded bg-[#E2EEF8] animate-pulse" />
        <div className="h-5 w-1/2 rounded bg-[#DDE8F5] animate-pulse" />
        <div className="flex gap-2 mt-1">
          <div className="h-2.5 w-16 rounded bg-[#E8F4FD] animate-pulse" />
          <div className="h-2.5 w-16 rounded bg-[#E8F4FD] animate-pulse" />
        </div>
      </div>
      {/* footer */}
      <div className="flex items-center justify-between px-3.5 py-2.5 border-t border-line">
        <div className="h-6 w-20 rounded-full bg-[#E8F4FD] animate-pulse" />
        <div className="h-3 w-12 rounded bg-[#E8F4FD] animate-pulse" />
      </div>
    </div>
  );
}

// A single shimmer bar with configurable width/height
function Bar({ w = 'w-full', h = 'h-10', rounded = 'rounded-full' }: { w?: string; h?: string; rounded?: string }) {
  return <div className={`${w} ${h} ${rounded} bg-[#E8F4FD] animate-pulse`} />;
}

const ListingsLoadingSkeleton = () => {
  // Avoid SSR mismatch — only render after mount
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="min-h-screen bg-sky" />;

  const CARD_COUNT = 6;

  return (
    <main className="bg-sky min-h-screen">

      {/* ── Sticky top bar (search + tabs) ── */}
      <div className="bg-white border-b border-line">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-3">
          {/* search bar */}
          <Bar w="w-full" h="h-10" rounded="rounded-full" />
          {/* condition tabs */}
          <div className="flex gap-1 w-fit">
            <div className="h-8 w-16 rounded-md bg-[#E2EEF8] animate-pulse" />
            <div className="h-8 w-16 rounded-md bg-[#E8F4FD] animate-pulse" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4">

        {/* Back / result heading row */}
        <div className="flex items-center justify-between mb-3 h-8">
          <div className="h-3.5 w-32 rounded bg-[#E8F4FD] animate-pulse" />
          <div className="h-8 w-28 rounded-full bg-[#E8F4FD] animate-pulse" />
        </div>

        {/* ── Mobile filter + sort bar ── */}
        <div className="flex gap-2 mb-4 lg:hidden">
          <Bar w="flex-1" h="h-10" rounded="rounded-full" />
          <div className="h-10 w-28 rounded-full bg-[#E8F4FD] animate-pulse shrink-0" />
        </div>

        {/* ── Brand pills ── */}
        <div className="mb-5 flex gap-3 overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="shrink-0 flex flex-col items-center gap-1 px-3 py-2 rounded-xl border border-line bg-white">
              <div className="w-9 h-9 rounded-full bg-[#E8F4FD] animate-pulse" />
              <div className="h-2.5 w-10 rounded bg-[#E8F4FD] animate-pulse" />
            </div>
          ))}
        </div>

        <div className="flex gap-6">

          {/* ── Desktop sidebar ── */}
          <aside className="hidden lg:flex flex-col gap-5 w-64 shrink-0 bg-white p-5 rounded-[var(--radius-card)] shadow-[var(--shadow-card)] h-fit">
            <div className="flex justify-between mb-1">
              <div className="h-4 w-14 rounded bg-[#E2EEF8] animate-pulse" />
              <div className="h-3.5 w-14 rounded bg-[#E8F4FD] animate-pulse" />
            </div>
            {/* Filter groups */}
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex flex-col gap-1.5">
                <div className="h-2.5 w-20 rounded bg-[#E8F4FD] animate-pulse" />
                <div className="h-11 w-full rounded-[var(--radius)] bg-[#E8F4FD] animate-pulse" />
              </div>
            ))}
          </aside>

          {/* ── Results area ── */}
          <div className="flex-1 min-w-0">
            {/* Count row */}
            <div className="flex items-center justify-between mb-4 h-5">
              <div className="h-3.5 w-36 rounded bg-[#E8F4FD] animate-pulse" />
            </div>

            {/* Car grid — 2 cols mobile, 3 cols desktop */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-6">
              {[...Array(CARD_COUNT)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ListingsLoadingSkeleton;
