// app/(public)/page.tsx  —  Home page
// All section components are React Server Components.
// No 'use client' here — data fetching happens inside each section.

import { Suspense } from 'react';
import type { Metadata } from 'next';

import { HeroSearch }    from '@/components/hero-search';
import { TrustBar }      from '@/components/home/trust-bar';
import { BrandRow }      from '@/components/brand-row';
import { CategoryRail }  from '@/components/category-rail';
import { StatsBand }     from '@/components/home/stats-band';
import { InStock }       from '@/components/home/in-stock';
import { BudgetFinder }  from '@/components/home/budget-finder';
import { StaffPick }     from '@/components/home/staff-pick';
import { WhyUs }         from '@/components/home/why-us';
import { HowItWorks }    from '@/components/home/how-it-works';
import { RecentlySold }  from '@/components/home/recently-sold';
import { Testimonials }  from '@/components/home/testimonials';
import { CTABand }       from '@/components/home/cta-band';
import { getCategoryCountsByCondition } from '@/lib/queries';

export const revalidate = 300; // revalidate every 5 minutes

export const metadata: Metadata = {
  title: 'Coastlane Motors — Used & New Cars for Sale in Kenya',
  description:
    'Browse verified used and new cars for sale in Kenya. Clear prices, full photos, duty paid. WhatsApp us to view or reserve.',
  alternates: { canonical: '/' },
};

// Skeleton used for Suspense fallbacks
function SectionSkeleton({ height = 200 }: { height?: number }) {
  return (
    <div
      className="w-full animate-pulse bg-[#E8F4FD]"
      style={{ height }}
      aria-hidden="true"
    />
  );
}

export default async function HomePage() {
  const counts = await getCategoryCountsByCondition();

  return (
    <main>
      {/* ① Hero + search — above the fold */}
      <HeroSearch />

      {/* ② Trust bar — answers first objections immediately */}
      <TrustBar />

      {/* ③ Brand row + category rail — browse entry points */}
      <Suspense fallback={<SectionSkeleton height={80} />}>
        <BrandRow />
      </Suspense>
      <Suspense fallback={<SectionSkeleton height={180} />}>
        <CategoryRail counts={counts} />
      </Suspense>

      {/* ④ Stats band — social proof anchor */}
      <Suspense fallback={<SectionSkeleton height={120} />}>
        <StatsBand />
      </Suspense>

      {/* ⑤ In-stock listings (Used + New tabs) */}
      <Suspense fallback={<SectionSkeleton height={400} />}>
        <InStock />
      </Suspense>

      {/* ⑥ Budget finder — second most common navigation path */}
      <Suspense fallback={<SectionSkeleton height={260} />}>
        <BudgetFinder />
      </Suspense>

      {/* ⑦ Staff pick — featured single car */}
      <Suspense fallback={<SectionSkeleton height={300} />}>
        <StaffPick />
      </Suspense>

      {/* ⑧ Why us */}
      <WhyUs />

      {/* ⑨ How it works */}
      <HowItWorks />

      {/* ⑩ Recently sold — throughput signal */}
      <Suspense fallback={<SectionSkeleton height={280} />}>
        <RecentlySold />
      </Suspense>

      {/* ⑪ Testimonials */}
      <Testimonials />

      {/* ⑫ CTA band — last chance before footer */}
      <CTABand />
    </main>
  );
}
