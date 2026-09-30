'use client';

import { LOCATIONS } from '@/lib/locations';
import { Search, MapPin, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import Image from 'next/image';

const slides = [
  {
    id: 1,
    title: <>USED & NEW<br />CARS, PRICED<br />OPENLY</>,
    desc: "Every car photographed in full, priced in shillings, duty paid. WhatsApp us to view.",
    img: "https://res.cloudinary.com/aqmtifbk/image/upload/v1789579878/heroimage.webp",
  },
  {
    id: 2,
    title: <>PREMIUM SUVS<br />READY IN<br />MOMBASA</>,
    desc: "Handpicked Land Cruisers and Harriers. Fully inspected, logbook ready for immediate transfer.",
    img: "https://res.cloudinary.com/aqmtifbk/image/upload/v1790499184/3552-hero-2024-toyota-land-cruiser-review.avif",
  },
  {
    id: 3,
    title: <>DIRECT<br />JAPAN<br />IMPORTS</>,
    desc: "Custom order your exact spec. We handle the auction bidding, shipping, and port clearance.",
    img: "https://res.cloudinary.com/aqmtifbk/image/upload/v1790499133/hero2.png",
  },
  {
    id: 4,
    title: <>FLEXIBLE<br />ASSET<br />FINANCING</>,
    desc: "Partnered with top Kenyan banks to get you on the road with manageable monthly payments.",
    img: "https://res.cloudinary.com/aqmtifbk/image/upload/v1790499058/iStock-2148823639-1-scaled.avif",
  }
];

export function HeroSearch() {
  const [current, setCurrent] = useState(0);

  const nextSlide = () => setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  const prevSlide = () => setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full">
      {/* 1. SLIDER WRAPPER: Enforces height and clips images, but allows sibling search bar to overlap */}
      <div className="relative w-full aspect-[4/3] lg:aspect-[21/9] bg-ink overflow-hidden group">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <Image
              src={slide.img}
              alt="Coastlane Motors Hero"
              priority={index === 0}
              fill
              sizes="100vw"
              className="object-cover"
            />
            
            <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/60 to-ink/20 lg:to-transparent" />
            
            <div className="absolute inset-0 flex flex-col justify-center px-4 lg:px-12 max-w-7xl mx-auto">
              <div className={`w-1/2 md:w-auto transform transition-all duration-700 delay-300 ${index === current ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                <h1 className="text-xl sm:text-3xl md:text-step-4 font-extrabold text-white uppercase leading-[1.1] md:leading-none tracking-tight md:max-w-[12ch]">
                  {slide.title}
                </h1>
                <p className="text-white/90 text-[10px] leading-relaxed sm:text-sm md:text-step-0 mt-2 md:mt-4 md:max-w-[42ch]">
                  {slide.desc}
                </p>
                
                {index === 0 && (
                  <a href="#browse" className="mt-4 md:mt-8 text-white hover:text-white/80 transition-colors inline-block text-xs md:text-base" aria-label="Scroll down to browse">
                    ↓
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* --- SLIDER CONTROLS (Dots) --- */}
        <div className="absolute bottom-6 left-0 right-0 z-20 flex justify-center gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`h-1 rounded-full transition-all duration-500 ${
                current === index ? 'w-6 bg-azure' : 'w-3 bg-white/30 hover:bg-white/60'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* 2. SEARCH BAR: Sat outside the overflow-hidden box, allowing the negative margin to pull it up over the images safely */}
      <div className="px-4 md:px-0 relative z-30 -mt-7 mb-7 md:-mt-10 md:mb-10 max-w-4xl mx-auto">
        <form method="GET" action="/cars"
              className="
                flex flex-col gap-[1px] bg-line md:gap-0
                md:flex-row md:items-stretch
                bg-white rounded-[var(--radius)] shadow-[var(--shadow-bar)] overflow-hidden
              ">
          
          <label className="sr-only" htmlFor="q">Search</label>
          <div className="flex items-center gap-2 bg-white px-4 h-[52px] md:flex-1 md:border-r border-line">
            <Search size={16} className="text-slate shrink-0" aria-hidden="true" />
            <input id="q" name="q" type="search" placeholder='Try "Harrier"'
                   className="flex-1 bg-transparent text-ink placeholder-slate font-sans text-[13px] focus:outline-none" />
          </div>

          <label className="sr-only" htmlFor="city">Location</label>
          <div className="flex items-center gap-2 bg-white px-4 h-[52px] md:w-48 md:border-r border-line relative">
            <MapPin size={14} className="text-slate shrink-0" aria-hidden="true" />
            <select id="city" name="city" defaultValue="Mombasa"
                    className="flex-1 bg-transparent text-ink font-sans text-[13px] font-medium pr-6 focus:outline-none appearance-none cursor-pointer">
              <option value="">Anywhere</option>
              {LOCATIONS.flatMap(g =>
                g.cities.map(c => <option key={c} value={c}>{c}</option>)
              )}
            </select>
            <ChevronDown size={12} className="text-slate shrink-0 absolute right-4 pointer-events-none" aria-hidden="true" />
          </div>

          <button type="submit"
                  className="flex items-center justify-center gap-2 h-[52px] px-6
                             bg-azure hover:bg-azure-h text-white font-sans text-[13px] font-semibold
                             transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-azure">
            <Search size={15} aria-hidden="true" />
            Search cars
          </button>
        </form>
      </div>
    </div>
  );
}