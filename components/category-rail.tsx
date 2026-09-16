'use client';
import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, CarFront } from 'lucide-react';

const CATEGORIES = [
  { name: 'SUV', url: '/used?body=SUV' },
  { name: 'Sedan', url: '/used?body=Sedan' },
  { name: 'Hatchback', url: '/used?body=Hatchback' },
  { name: 'Station Wagon', url: '/used?body=Wagon' },
  { name: 'Double Cab', url: '/used?body=Pickup' },
  { name: 'Minibus', url: '/used?body=Bus' },
  { name: 'Pickup', url: '/used?body=Pickup' },
  { name: 'Coupe', url: '/used?body=Coupe' }
];

export function CategoryRail({ counts }: { counts: Record<string, number> }) {
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
        className="flex overflow-x-auto snap-x snap-mandatory gap-4 px-4 max-w-7xl mx-auto pb-4 hide-scrollbar"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {CATEGORIES.map(cat => (
          <Link key={cat.name} href={cat.url} className="snap-start shrink-0 w-36 h-36 bg-white rounded-[var(--radius-card)] shadow-[var(--shadow-card)] flex flex-col items-center justify-center p-4 hover:shadow-md transition-shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-azure group">
            {cat.name === 'SUV' ? (
              <Image src="/suv-icon.png" alt="SUV" width={48} height={48} className="mb-3 opacity-70 group-hover:opacity-100 transition-opacity" />
            ) : cat.name === 'Sedan' ? (
              <Image src="/sedan-icon.png" alt="Sedan" width={48} height={48} className="mb-3 opacity-70 group-hover:opacity-100 transition-opacity" />
            ) : cat.name === 'Hatchback' ? (
              <Image src="/hatchback-icon.png" alt="Hatchback" width={48} height={48} className="mb-3 opacity-70 group-hover:opacity-100 transition-opacity" />
            ) : cat.name === 'Station Wagon' ? (
              <Image src="/wagon-icon.png" alt="Station Wagon" width={48} height={48} className="mb-3 opacity-70 group-hover:opacity-100 transition-opacity" />
            ) : cat.name === 'Double Cab' ? (
              <Image src="/doublecab-icon.png" alt="Double Cab" width={48} height={48} className="mb-3 opacity-70 group-hover:opacity-100 transition-opacity" />
            ) : cat.name === 'Minibus' ? (
              <Image src="/minibus-icon.png" alt="Minibus" width={48} height={48} className="mb-3 opacity-70 group-hover:opacity-100 transition-opacity" />
            ) : cat.name === 'Pickup' ? (
              <Image src="/pickup-icon.png" alt="Pickup" width={48} height={48} className="mb-3 opacity-70 group-hover:opacity-100 transition-opacity" />
            ) : cat.name === 'Coupe' ? (
              <Image src="/coupe-icon.png" alt="Coupe" width={48} height={48} className="mb-3 opacity-70 group-hover:opacity-100 transition-opacity" />
            ) : (
              <CarFront size={48} aria-hidden="true" className="text-ink/60 stroke-[1.5px] group-hover:text-azure transition-colors mb-3" />
            )}
            <h3 className="font-sans font-semibold text-ink text-center leading-tight">{cat.name}</h3>
            <p className="text-slate text-step--1 mt-1">{counts[cat.name] || 0} cars</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
