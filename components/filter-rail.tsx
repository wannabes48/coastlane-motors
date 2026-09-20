'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { LOCATIONS } from '@/lib/locations';
import { SlidersHorizontal, X } from 'lucide-react';

export function FilterRail({ counts, tab, basePath = '/used' }: { counts?: Record<string, number>, tab?: string, basePath?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete('page'); // Reset to page 1
    router.push(`${basePath}?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeCount = Array.from(searchParams.keys()).filter(k => k !== 'page' && k !== 'sort').length;

  const FilterFields = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-sans font-semibold text-ink mb-3">Sort by</h3>
        <select 
          className="w-full border border-line rounded-[var(--radius-card)] p-3 h-12 text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-azure bg-white text-base"
          defaultValue={searchParams.get('sort') || 'newest'}
          onChange={(e) => updateFilters('sort', e.target.value)}
        >
          <option value="newest">Newest Arrivals</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="mileage_asc">Mileage: Low to High</option>
        </select>
      </div>

      <div>
        <h3 className="font-sans font-semibold text-ink mb-3">Location</h3>
        <select 
          className="w-full border border-line rounded-[var(--radius-card)] p-3 h-12 text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-azure bg-white text-base"
          defaultValue={searchParams.get('city') || ''}
          onChange={(e) => updateFilters('city', e.target.value)}
        >
          <option value="">Anywhere</option>
          {LOCATIONS.map(group => (
            <optgroup key={group.country} label={group.country}>
              {group.cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      <div>
        <h3 className="font-sans font-semibold text-ink mb-3">Body Type</h3>
        <select 
          className="w-full border border-line rounded-[var(--radius-card)] p-3 h-12 text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-azure bg-white text-base"
          defaultValue={searchParams.get('body') || ''}
          onChange={(e) => updateFilters('body', e.target.value)}
        >
          <option value="">All Body Types</option>
          {['SUV', 'Sedan', 'Hatchback', 'Pickup', 'Van', 'Bus', 'Coupe', 'Station Wagon', 'Double Cab', 'Minibus'].map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>
      
      <div>
        <h3 className="font-sans font-semibold text-ink mb-3">Transmission</h3>
        <select 
          className="w-full border border-line rounded-[var(--radius-card)] p-3 h-12 text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-azure bg-white text-base"
          defaultValue={searchParams.get('transmission') || ''}
          onChange={(e) => updateFilters('transmission', e.target.value)}
        >
          <option value="">All</option>
          {['Automatic', 'Manual', 'CVT'].map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>
    </div>
  );

  return (
    <>
      {/* mobile trigger — sticky, above the grid */}
      <div className="sticky top-14 z-30 flex gap-2 py-4 bg-white md:hidden">
        <button onClick={() => setOpen(true)}
                className="flex items-center gap-2 h-11 px-4 bg-white border border-line
                           rounded-full text-sm font-semibold text-ink shadow-[var(--shadow-card)]">
          <SlidersHorizontal size={18} aria-hidden="true" className="text-azure" />
          Filter
          {activeCount > 0 && (
            <span className="flex items-center justify-center w-5 h-5 rounded-full
                             bg-azure text-white text-[10px]">{activeCount}</span>
          )}
        </button>
      </div>

      {/* mobile bottom sheet */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden"
             style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
          <div className="absolute inset-0 bg-ink/40 transition-opacity" onClick={() => setOpen(false)} />
          <div className="absolute bottom-0 inset-x-0 bg-white rounded-t-2xl
                          max-h-[85vh] overflow-y-auto flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-line shrink-0">
              <span className="font-semibold text-ink">Filter cars</span>
              <button onClick={() => setOpen(false)}
                      className="flex items-center justify-center w-11 h-11 text-slate rounded-full hover:bg-sky transition-colors">
                <X size={22} aria-hidden="true" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto">
              <FilterFields />
            </div>
            <div className="flex gap-3 p-4 border-t border-line shrink-0">
              <button onClick={() => { router.push(basePath); window.scrollTo({ top: 0, behavior: 'smooth' }); setOpen(false); }}
                      className="flex-1 h-12 border border-line rounded-[var(--radius-card)] font-semibold text-ink hover:bg-sky transition-colors">
                Clear all
              </button>
              <button onClick={() => setOpen(false)}
                      className="flex-1 h-12 bg-azure hover:bg-azure-ink transition-colors text-white rounded-[var(--radius-card)] font-semibold">
                Show cars
              </button>
            </div>
          </div>
        </div>
      )}

      {/* desktop sidebar */}
      <aside className="hidden md:block w-64 shrink-0 bg-white p-6 rounded-[var(--radius-card)] shadow-[var(--shadow-card)] h-fit sticky top-24">
        <FilterFields />
        <button 
          onClick={() => { router.push(basePath); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className="w-full mt-6 text-slate hover:text-ink text-sm py-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-azure rounded-[var(--radius-card)] h-11"
        >
          Clear all filters
        </button>
      </aside>
    </>
  );
}
