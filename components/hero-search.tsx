'use client';
import { LOCATIONS } from '@/lib/locations';
import { Search, MapPin, ChevronDown } from 'lucide-react';
import Image from 'next/image';

export function HeroSearch() {
  return (
    <div className="relative w-full">
      <div className="relative w-full aspect-[4/3] lg:aspect-[21/9] bg-ink">
        <Image
          src="https://res.cloudinary.com/aqmtifbk/image/upload/v1789579878/heroimage.webp"
          alt="Coastlane Motors"
          priority
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-scrim to-transparent" />
        
        <div className="absolute inset-0 flex flex-col justify-center px-4 lg:px-12 max-w-7xl mx-auto">
          <h1 className="text-step-4 font-extrabold text-white uppercase leading-none tracking-tight max-w-[12ch]">
            USED & NEW<br />CARS, PRICED<br />OPENLY
          </h1>
          <p className="text-white/90 text-step-0 mt-4 max-w-[42ch]">
            Every car photographed in full, priced in shillings, duty paid. WhatsApp us to view.
          </p>
          <a href="#browse" className="mt-8 text-white hover:text-white/80 transition-colors inline-block" aria-label="Scroll down to browse">
             ↓
          </a>
        </div>
      </div>

      <div className="bg-sky pt-2 pb-6 px-4 md:px-0">
        <form method="GET" action="/used"
              className="
                flex flex-col gap-2
                md:flex-row md:items-stretch
                md:max-w-4xl md:mx-auto
                md:-mt-10 md:bg-white md:rounded-[var(--radius-card)] md:shadow-[var(--shadow-bar)] md:overflow-hidden relative z-10
              ">
          {/* keyword */}
          <label className="sr-only" htmlFor="q">Search</label>
          <div className="flex items-center gap-2 bg-white rounded-[var(--radius-card)] px-4 h-14 md:flex-1 md:rounded-none md:border-r border-line">
            <Search size={18} className="text-slate shrink-0" aria-hidden="true" />
            <input id="q" name="q" type="search" placeholder='Try "Harrier"'
                   className="flex-1 bg-transparent text-ink placeholder-slate text-base
                              focus:outline-none" />
          </div>

          {/* city */}
          <label className="sr-only" htmlFor="city">Location</label>
          <div className="flex items-center gap-2 bg-white rounded-[var(--radius-card)] px-4 h-14 md:w-48 md:rounded-none md:border-r border-line relative">
            <MapPin size={18} className="text-slate shrink-0" aria-hidden="true" />
            <select id="city" name="city" defaultValue="Mombasa"
                    className="flex-1 bg-transparent text-ink text-base pr-6
                               focus:outline-none appearance-none cursor-pointer">
              <option value="">Anywhere</option>
              {LOCATIONS.flatMap(g =>
                g.cities.map(c => <option key={c} value={c}>{c}</option>)
              )}
            </select>
            <ChevronDown size={16} className="text-slate shrink-0 absolute right-4 pointer-events-none" aria-hidden="true" />
          </div>

          {/* submit */}
          <button type="submit"
                  className="flex items-center justify-center gap-2 h-14 px-8
                             bg-azure hover:bg-azure-ink text-white font-sans font-semibold
                             rounded-[var(--radius-card)] md:rounded-none transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-azure">
            <Search size={18} aria-hidden="true" />
            Search cars
          </button>
        </form>
      </div>
    </div>
  );
}
