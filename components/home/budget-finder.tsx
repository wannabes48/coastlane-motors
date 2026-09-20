import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getBudgetCounts } from '@/lib/queries';

const BUCKETS = [
  { label: 'Under KSh 1M',      sub: 'Budget picks',   min: null,    max: 1_000_000 },
  { label: 'KSh 1M – 2.5M',     sub: 'Most popular',   min: 1_000_000, max: 2_500_000 },
  { label: 'KSh 2.5M – 5M',     sub: 'Premium used',   min: 2_500_000, max: 5_000_000 },
  { label: 'Above KSh 5M',      sub: 'Luxury & new',   min: 5_000_000, max: null  },
] as const;

function bucketHref(min: number | null, max: number | null) {
  const params = new URLSearchParams();
  params.set('tab', 'used');        // always explicit
  if (min != null) params.set('min', String(min));
  if (max != null) params.set('max', String(max));
  return `/used?${params.toString()}`;
}

export async function BudgetFinder() {
  const counts = await getBudgetCounts();

  return (
    <section className="bg-[#E8F4FD] py-14 px-4" aria-labelledby="budget-heading">
      <div className="max-w-4xl mx-auto">
        <p className="font-[Poppins] text-[11px] font-semibold tracking-[3px] uppercase text-[#1479E0] mb-2">
          Find by budget
        </p>
        <h2
          id="budget-heading"
          className="font-[Poppins] text-[22px] font-bold text-[#16293D] mb-2 leading-tight"
        >
          What's your budget?
        </h2>
        <p className="font-[Poppins] text-[13px] text-[#6B7D8F] mb-8">
          Quick-jump to cars priced within your range.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {BUCKETS.map(({ label, sub, min, max }, i) => (
            <Link
              key={i}
              href={bucketHref(min, max)}
              className="flex items-center justify-between bg-white border border-[#DCE9F2]
                         rounded-lg px-5 py-4 min-h-[64px]
                         hover:border-[#1479E0] transition-colors duration-150 group"
            >
              <div>
                <p className="font-[Poppins] text-[14px] font-semibold text-[#16293D]">
                  {label}
                </p>
                <p className="font-[Poppins] text-[12px] text-[#6B7D8F] mt-0.5">
                  {sub}
                  {counts[i] != null && (
                    <span className="ml-1 text-[#1479E0]">· {counts[i]} cars</span>
                  )}
                </p>
              </div>
              <ArrowRight
                size={18}
                aria-hidden="true"
                className="text-[#1479E0] shrink-0 group-hover:translate-x-0.5 transition-transform"
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
