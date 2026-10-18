'use client';

import { LOCATIONS } from '@/lib/locations';
import { Search, MapPin, ChevronDown } from 'lucide-react';

export function HeroSearch() {
  return (
    <div className="w-full px-4 md:px-0 relative z-30 -mt-7 mb-7 md:-mt-10 md:mb-10 max-w-4xl mx-auto">
      <form
        method="GET"
        action="/cars"
        className="
          flex flex-col gap-[1px] bg-line md:gap-0
          md:flex-row md:items-stretch
          bg-white rounded-[var(--radius)] shadow-[var(--shadow-bar)] overflow-hidden
        "
      >
        <label className="sr-only" htmlFor="q">Search</label>
        <div className="flex items-center gap-2 bg-white px-4 h-[52px] md:flex-1 md:border-r border-line">
          <Search size={16} className="text-slate shrink-0" aria-hidden="true" />
          <input
            id="q"
            name="q"
            type="search"
            placeholder='Try "Harrier"'
            className="flex-1 bg-transparent text-ink placeholder-slate font-sans text-[13px] focus:outline-none"
          />
        </div>

        <label className="sr-only" htmlFor="city">Location</label>
        <div className="flex items-center gap-2 bg-white px-4 h-[52px] md:w-48 md:border-r border-line relative">
          <MapPin size={14} className="text-slate shrink-0" aria-hidden="true" />
          <select
            id="city"
            name="city"
            defaultValue="Mombasa"
            className="flex-1 bg-transparent text-ink font-sans text-[13px] font-medium pr-6 focus:outline-none appearance-none cursor-pointer"
          >
            <option value="">Anywhere</option>
            {LOCATIONS.flatMap((g) =>
              g.cities.map((c) => <option key={c} value={c}>{c}</option>)
            )}
          </select>
          <ChevronDown size={12} className="text-slate shrink-0 absolute right-4 pointer-events-none" aria-hidden="true" />
        </div>

        <button
          type="submit"
          className="flex items-center justify-center gap-2 h-[52px] px-6
                     bg-azure hover:bg-azure-h text-white font-sans text-[13px] font-semibold
                     transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-azure cursor-pointer"
        >
          <Search size={15} aria-hidden="true" />
          Search cars
        </button>
      </form>
    </div>
  );
}