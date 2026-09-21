'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { LOCATIONS } from '@/lib/locations';
import {
  SlidersHorizontal, X, ChevronDown, ArrowUpDown, Search
} from 'lucide-react';

const MAKES = ['Toyota', 'Nissan', 'Mazda', 'Subaru', 'Mitsubishi', 'Honda', 'Isuzu', 'Mercedes Benz', 'Volkswagen', 'BMW', 'Audi', 'Land Rover'];
const BODIES = ['SUV', 'Sedan', 'Hatchback', 'Double Cab', 'Station Wagon', 'Van', 'Minibus', 'Pickup', 'Coupe', 'Bus'];
const TRANSMISSIONS = ['Automatic', 'Manual', 'CVT'];
const FUELS = ['Petrol', 'Diesel', 'Hybrid', 'Electric'];
const PRICE_RANGES = [
  { label: 'Under KSh 1M', max: '1000000' },
  { label: 'KSh 1M – 2.5M', min: '1000000', max: '2500000' },
  { label: 'KSh 2.5M – 5M', min: '2500000', max: '5000000' },
  { label: 'Above KSh 5M', min: '5000000' },
];

export function FilterRail({
  tab,
  basePath = '/used',
}: {
  tab?: string;
  basePath?: string;
  counts?: Record<string, number>;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen]       = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  const current = (key: string) => searchParams.get(key) ?? '';

  const [localMin, setLocalMin] = useState(current('min'));
  const [localMax, setLocalMax] = useState(current('max'));

  // Sync local inputs if the URL changes externally (like when 'Clear all' is clicked)
  useEffect(() => {
    setLocalMin(current('min'));
    setLocalMax(current('max'));
  }, [searchParams]);

  const updateFilter = (key: string, value: string) => {
    const p = new URLSearchParams(searchParams.toString());
    if (value) p.set(key, value);
    else p.delete(key);
    p.delete('page');
    router.push(`${basePath}?${p.toString()}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const applyPriceRange = (min?: string, max?: string) => {
    const p = new URLSearchParams(searchParams.toString());
    p.delete('min'); p.delete('max'); p.delete('page');
    if (min) p.set('min', min);
    if (max) p.set('max', max);
    router.push(`${basePath}?${p.toString()}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearAll = () => {
    router.push(basePath);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setOpen(false);
  };

  const FILTER_KEYS = ['q', 'make', 'city', 'body', 'fuel', 'transmission', 'min', 'max'];
  const activeCount = FILTER_KEYS.filter(k => searchParams.get(k)).length;
  const currentSort = current('sort') || 'newest';
  const sortLabel: Record<string, string> = {
    newest: 'Newest first',
    price_asc: 'Price ↑',
    price_desc: 'Price ↓',
    mileage_asc: 'Mileage ↑',
  };

  const renderSelectField = (label: string, id: string, options: string[], filterKey: string, placeholder: string) => (
    <div>
      <label htmlFor={id} className="block font-sans text-[11px] font-semibold uppercase tracking-[1.5px] text-slate mb-1.5">{label}</label>
      <select
        id={id}
        className="w-full border border-line rounded-[var(--radius)] px-3 h-11 text-ink text-[14px] focus:outline-none focus-visible:ring-2 focus-visible:ring-azure bg-white appearance-none"
        value={current(filterKey)}
        onChange={e => updateFilter(filterKey, e.target.value)}
      >
        <option value="">{placeholder}</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );

  const renderAllFilters = () => (
    <div className="space-y-5">
      {/* Make */}
      {renderSelectField("Make", "make", MAKES, "make", "Any make")}
      {/* Body type */}
      {renderSelectField("Body type", "body", BODIES, "body", "Any body type")}
      {/* Transmission */}
      {renderSelectField("Transmission", "transmission", TRANSMISSIONS, "transmission", "Any transmission")}
      {/* Fuel */}
      {renderSelectField("Fuel type", "fuel", FUELS, "fuel", "Any fuel")}
      {/* Location */}
      <div>
        <label htmlFor="city" className="block font-sans text-[11px] font-semibold uppercase tracking-[1.5px] text-slate mb-1.5">Location</label>
        <select
          id="city"
          className="w-full border border-line rounded-[var(--radius)] px-3 h-11 text-ink text-[14px] focus:outline-none focus-visible:ring-2 focus-visible:ring-azure bg-white"
          value={current('city')}
          onChange={e => updateFilter('city', e.target.value)}
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
      {/* Price range */}
      <div>
        <p className="font-sans text-[11px] font-semibold uppercase tracking-[1.5px] text-slate mb-2">Price range</p>
        <div className="flex flex-wrap gap-2">
          {PRICE_RANGES.map(r => {
            const active = current('min') === (r.min ?? '') && current('max') === (r.max ?? '');
            return (
              <button
                key={r.label}
                type="button"
                onClick={() => applyPriceRange(r.min, r.max)}
                className={`h-8 px-3 rounded-full font-sans text-[12px] font-semibold transition-colors border ${
                  active
                    ? 'bg-azure text-white border-azure'
                    : 'bg-white text-ink border-line hover:border-azure'
                }`}
              >
                {r.label}
              </button>
            );
          })}
        </div>
        {/* Custom price inputs */}
        <div className="flex gap-2 mt-3">
          <input
            type="number"
            placeholder="Min KSh"
            value={localMin}
            onChange={e => setLocalMin(e.target.value)}
            onBlur={() => updateFilter('min', localMin)}
            onKeyDown={e => e.key === 'Enter' && updateFilter('min', localMin)}
            className="flex-1 w-24 border border-line rounded-[var(--radius)] px-3 h-10 text-[13px] text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-azure bg-white"
          />
          <input
            type="number"
            placeholder="Max KSh"
            value={localMax}
            onChange={e => setLocalMax(e.target.value)}
            onBlur={() => updateFilter('max', localMax)}
            onKeyDown={e => e.key === 'Enter' && updateFilter('max', localMax)}
            className="flex-1 w-24 border border-line rounded-[var(--radius)] px-3 h-10 text-[13px] text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-azure bg-white"
          />
        </div>
      </div>
      {/* Sort */}
      <div>
        <label htmlFor="sort" className="block font-sans text-[11px] font-semibold uppercase tracking-[1.5px] text-slate mb-1.5">Sort by</label>
        <select
          id="sort"
          className="w-full border border-line rounded-[var(--radius)] px-3 h-11 text-ink text-[14px] focus:outline-none focus-visible:ring-2 focus-visible:ring-azure bg-white"
          value={currentSort}
          onChange={e => updateFilter('sort', e.target.value)}
        >
          <option value="newest">Newest Arrivals</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="mileage_asc">Mileage: Low to High</option>
        </select>
      </div>
    </div>
  );

  return (
    <>
      {/* ── Mobile toolbar: Filter + Sort buttons ── */}
      <div className="flex gap-2 lg:hidden">
        {/* Filter button */}
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 h-10 px-4 bg-white border border-line rounded-full font-sans text-[13px] font-semibold text-ink shadow-sm flex-1"
        >
          <SlidersHorizontal size={15} className="text-azure" aria-hidden="true" />
          Filters
          {activeCount > 0 && (
            <span className="ml-auto flex items-center justify-center w-5 h-5 rounded-full bg-azure text-white text-[10px]">{activeCount}</span>
          )}
        </button>

        {/* Sort button */}
        <div className="relative" ref={sortRef}>
          <button
            onClick={() => setSortOpen(o => !o)}
            className="flex items-center gap-1.5 h-10 px-3 bg-white border border-line rounded-full font-sans text-[13px] font-semibold text-ink shadow-sm whitespace-nowrap"
          >
            <ArrowUpDown size={14} className="text-azure" aria-hidden="true" />
            {sortLabel[currentSort]}
            <ChevronDown size={12} className={`text-slate transition-transform ${sortOpen ? 'rotate-180' : ''}`} />
          </button>
          {sortOpen && (
            <div className="absolute right-0 top-12 z-50 bg-white border border-line rounded-xl shadow-lg min-w-[180px] py-1">
              {Object.entries(sortLabel).map(([v, l]) => (
                <button
                  key={v}
                  className={`w-full text-left px-4 py-2.5 font-sans text-[13px] hover:bg-sky transition-colors ${v === currentSort ? 'font-semibold text-azure' : 'text-ink'}`}
                  onClick={() => { updateFilter('sort', v); setSortOpen(false); }}
                >
                  {l}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Mobile bottom sheet ── */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
          <div className="absolute inset-0 bg-ink/40" onClick={() => setOpen(false)} />
          <div className="absolute bottom-0 inset-x-0 bg-white rounded-t-2xl max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-line shrink-0">
              <span className="font-sans font-semibold text-ink">Filter cars</span>
              {activeCount > 0 && (
                <button onClick={clearAll} className="font-sans text-[12px] text-azure font-semibold">Clear all</button>
              )}
              <button onClick={() => setOpen(false)} className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-sky transition-colors ml-auto">
                <X size={20} aria-hidden="true" />
              </button>
            </div>
            {/* Scrollable content */}
            <div className="overflow-y-auto flex-1 p-4">
              {renderAllFilters()}
            </div>
            {/* Footer */}
            <div className="p-4 border-t border-line shrink-0">
              <button
                onClick={() => setOpen(false)}
                className="w-full h-12 bg-azure text-white rounded-[var(--radius-card)] font-sans font-semibold text-[14px] hover:bg-azure-ink transition-colors"
              >
                Show results
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Desktop sidebar ── */}
      <aside className="hidden lg:block w-64 shrink-0 bg-white p-5 rounded-[var(--radius-card)] shadow-[var(--shadow-card)] h-fit sticky top-24">
        <div className="flex items-center justify-between mb-4">
          <span className="font-sans font-semibold text-ink">Filters</span>
          {activeCount > 0 && (
            <button onClick={clearAll} className="font-sans text-[12px] text-azure font-semibold hover:underline">Clear all</button>
          )}
        </div>
        {renderAllFilters()}
      </aside>
    </>
  );
}
