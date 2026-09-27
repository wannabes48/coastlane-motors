'use client';
import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, CarFront } from 'lucide-react';
// import { VanIcon } from '@/components/icons/van'; // If used elsewhere

const CATEGORIES = [
  { name: 'SUV', url: '/used?body=SUV&tab=used', body: 'SUV', icon: '/suv-icon.png' },
  { name: 'Sedan', url: '/used?body=Sedan&tab=used', body: 'Sedan', icon: '/sedan-icon.png' },
  { name: 'Hatchback', url: '/used?body=Hatchback&tab=used', body: 'Hatchback', icon: '/hatchback-icon.png' },
  { name: 'Station Wagon', url: '/used?body=Station%20Wagon&tab=used', body: 'Station Wagon', icon: '/wagon-icon.png' },
  { name: 'Double Cab', url: '/used?body=Double%20Cab&tab=used', body: 'Double Cab', icon: '/doublecab-icon.png' },
  { name: 'Van', url: '/used?body=Van&tab=used', body: 'Van', icon: '/van-icon.png' },
  { name: 'Minibus', url: '/used?body=Minibus&tab=used', body: 'Minibus', icon: '/minibus-icon.png' },
  { name: 'Pickup', url: '/used?body=Pickup&tab=used', body: 'Pickup', icon: '/pickup-icon.png' },
  { name: 'Coupe', url: '/used?body=Coupe&tab=used', body: 'Coupe', icon: '/coupe-icon.png' }
];

export function CategoryRail({ counts }: { counts: Record<string, { used: number; new: number }> }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 200;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="py-12 bg-sky relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between mb-6">
        <h2 className="text-step-2 font-sans font-semibold text-ink">Explore by category</h2>
        <div className="hidden lg:flex gap-2">
          <button onClick={() => scroll('left')} className="flex items-center justify-center w-11 h-11 rounded-full border border-line text-azure hover:bg-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-azure" aria-label="Scroll left">
            <ChevronLeft size={20} aria-hidden="true" />
          </button>
          <button onClick={() => scroll('right')} className="flex items-center justify-center w-11 h-11 rounded-full bg-azure text-white hover:bg-azure-ink transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-azure" aria-label="Scroll right">
            <ChevronRight size={20} aria-hidden="true" />
          </button>
        </div>
      </div>
      
      <div 
        ref={scrollRef}
        className="flex overflow-x-auto snap-x snap-mandatory gap-3 md:gap-4 px-4 max-w-7xl mx-auto pb-4 hide-scrollbar"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {CATEGORIES.map(cat => {
          const c = counts[cat.body] ?? { used: 0, new: 0 };
          const total = c.used + c.new;
          
          return (
            <Link 
              key={cat.name} 
              href={cat.url} 
              // Changed fixed sizing to responsive (w-[120px] on mobile, md:w-[160px] on desktop)
              // Added explicit rounded-2xl to enforce rounded edges on all devices
              className="snap-start shrink-0 w-[120px] h-[116px] md:w-[160px] md:h-36 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col items-center justify-center p-3 md:p-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-azure group"
            >
              {cat.icon ? (
                <Image 
                  src={cat.icon} 
                  alt={cat.name} 
                  width={48} 
                  height={48} 
                  // Scaled down images for mobile, original size on desktop
                  className="w-10 h-10 md:w-12 md:h-12 mb-2 md:mb-3 opacity-70 group-hover:opacity-100 transition-opacity object-contain" 
                />
              ) : (
                <CarFront 
                  aria-hidden="true" 
                  className="w-10 h-10 md:w-12 md:h-12 text-ink/60 stroke-[1.5px] group-hover:text-azure transition-colors mb-2 md:mb-3" 
                />
              )}
              
              <h3 className="font-sans font-semibold text-ink text-center leading-tight text-[13px] md:text-base">
                {cat.name}
              </h3>
              
              <p className="text-slate text-[11px] md:text-step--2 mt-1 text-center">
                {total === 0 ? 'No cars' : `${c.used} used · ${c.new} new`}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}