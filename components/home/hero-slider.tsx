'use client';

// components/home/hero-slider.tsx
// Embla Carousel hero — cross-fade, images from real listing thumbnails.

import useEmblaCarousel from 'embla-carousel-react';
import Autoplay         from 'embla-carousel-autoplay';
import Fade             from 'embla-carousel-fade';
import Accessibility    from 'embla-carousel-accessibility';
import { CldImage }     from 'next-cloudinary';
import Link             from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import type { HeroSlideData } from '@/lib/queries-hero';
import { fmtKES } from '@/lib/money';

const GRADIENTS = [
  'linear-gradient(135deg,#0F1923 45%,#1B2E42 100%)',
  'linear-gradient(135deg,#0D2137 40%,#1A3A5C 100%)',
  'linear-gradient(135deg,#071422 40%,#0F2D45 100%)',
  'linear-gradient(135deg,#111827 40%,#1E3A4A 100%)',
];

const FALLBACK: HeroSlideData[] = [
  { slug:'', make:'Vorback', model:'', year: new Date().getFullYear(),
    price_kes:null, condition:'used', body_type:'SUV', city:'Mombasa',
    public_id:'', alt:'', cta_href:'/used' },
  { slug:'', make:'Vorback', model:'', year: new Date().getFullYear(),
    price_kes:null, condition:'new', body_type:null, city:'Mombasa',
    public_id:'', alt:'', cta_href:'/new' },
];

function headline(s: HeroSlideData, i: number) {
  const opts = [
    `${s.year} ${s.make} ${s.model}`.trim(),
    `${s.condition === 'new' ? 'Brand New' : 'Duty-Paid'} ${s.body_type ?? s.make}`,
    `Find Your Next ${s.body_type ?? 'Car'}`,
    `${s.make} In Stock Now`,
  ];
  return opts[i % opts.length];
}

function sub(s: HeroSlideData) {
  return [
    s.price_kes ? fmtKES(s.price_kes) : null,
    s.city,
    s.condition === 'new' ? 'Brand new' : null,
    'Duty paid',
  ].filter(Boolean).join(' · ');
}

function ctaLabel(s: HeroSlideData) {
  if (s.slug)         return 'View this car';
  if (s.condition === 'new') return 'Browse new arrivals';
  if (s.body_type)    return `Browse ${s.body_type}s`;
  return 'Browse all cars';
}

export function HeroSlider({ slides }: { slides: HeroSlideData[] }) {
  const active = slides.length >= 1 ? slides : FALLBACK;

  const plugins = useMemo(
    () => [
      Fade(),
      Autoplay({ delay: 5000, defaultInteraction: false }),
      Accessibility(),
    ],
    [],
  );

  const options = useMemo(() => ({ loop: true, duration: 30 }), []);

  const [emblaRef, emblaApi] = useEmblaCarousel(options, plugins);

  const [cur, setCur] = useState(0);
  const [snaps, setSnaps] = useState(active.length);

  const sync = useCallback(() => {
    if (!emblaApi) return;
    const snap = typeof emblaApi.selectedSnap === 'function'
      ? emblaApi.selectedSnap()
      : (emblaApi as any).selectedScrollSnap?.() ?? 0;
    const snapList = typeof emblaApi.snapList === 'function'
      ? emblaApi.snapList()
      : (emblaApi as any).scrollSnapList?.() ?? [];
    setCur(snap);
    setSnaps(snapList.length || active.length);
  }, [emblaApi, active.length]);

  useEffect(() => {
    if (!emblaApi) return;
    sync();

    // Start Embla autoplay plugin
    const autoplayPlugin = emblaApi.plugins()?.autoplay;
    autoplayPlugin?.play();

    const onSelect = () => {
      sync();
      autoplayPlugin?.reset();
    };

    emblaApi.on('select', onSelect).on('reinit', onSelect);

    // Guaranteed fallback interval: advances slides every 5s if plugin pauses
    const timer = setInterval(() => {
      if (document.hidden) return;
      if (!autoplayPlugin || !autoplayPlugin.isPlaying()) {
        if (typeof emblaApi.goToNext === 'function') {
          emblaApi.goToNext();
        } else {
          (emblaApi as any).scrollNext?.();
        }
      }
    }, 5000);

    return () => {
      clearInterval(timer);
      emblaApi.off('select', onSelect).off('reinit', onSelect);
    };
  }, [emblaApi, sync]);

  const prev = useCallback(() => {
    if (!emblaApi) return;
    if (typeof emblaApi.goToPrev === 'function') emblaApi.goToPrev();
    else (emblaApi as any).scrollPrev?.();
  }, [emblaApi]);

  const next = useCallback(() => {
    if (!emblaApi) return;
    if (typeof emblaApi.goToNext === 'function') emblaApi.goToNext();
    else (emblaApi as any).scrollNext?.();
  }, [emblaApi]);

  const goTo = useCallback((i: number) => {
    if (!emblaApi) return;
    if (typeof emblaApi.goTo === 'function') emblaApi.goTo(i);
    else (emblaApi as any).scrollTo?.(i);
  }, [emblaApi]);

  // swipe
  const tx = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => { tx.current = e.touches[0].clientX; };
  const onTouchEnd   = (e: React.TouchEvent) => {
    if (tx.current === null) return;
    const d = e.changedTouches[0].clientX - tx.current;
    tx.current = null;
    if (Math.abs(d) < 40) return;
    d < 0 ? next() : prev();
  };

  return (
    <section
      className="relative w-full overflow-hidden bg-[#0F1923]"
      style={{ height: 'clamp(520px, 85vh, 720px)' }}
      aria-roledescription="carousel"
      aria-label="Featured vehicles"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Embla viewport */}
      <div ref={emblaRef} className="absolute inset-0 h-full">
        <div className="flex h-full">
          {active.map((s, i) => (
            <div
              key={s.slug || i}
              className="relative flex-[0_0_100%] h-full min-w-0"
              role="group"
              aria-roledescription="slide"
              aria-label={`Slide ${i + 1} of ${active.length}`}
            >
              {/* background */}
              {s.public_id ? (
                <CldImage
                  src={s.public_id}
                  alt={s.alt}
                  fill
                  crop="fill"
                  gravity="auto"
                  format="auto"
                  quality="auto"
                  priority={i === 0}
                  sizes="100vw"
                  className="object-cover"
                />
              ) : (
                <div
                  className="absolute inset-0"
                  style={{ background: GRADIENTS[i % GRADIENTS.length] }}
                  aria-hidden="true"
                />
              )}

              {/* grid texture on gradient slides */}
              {!s.public_id && (
                <div
                  className="absolute inset-0 opacity-[0.035]"
                  style={{
                    backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)',
                    backgroundSize: '48px 48px',
                  }}
                  aria-hidden="true"
                />
              )}

              {/* overlays */}
              <div
                className="absolute inset-0 bg-gradient-to-t from-[#0E1A20]/95 via-[#0E1A20]/40 to-transparent"
                aria-hidden="true"
              />
              <div
                className="absolute inset-0 bg-gradient-to-r from-[#0F1923]/80 via-[#0F1923]/40 to-transparent"
                aria-hidden="true"
              />

              {/* text — mobile constrained to left half for vehicle visibility */}
              <div className="absolute inset-0 flex items-end pb-24 sm:pb-28 px-4 sm:px-12 md:px-16">
                <div className="w-[60%] sm:w-auto max-w-2xl">
                  <p className="font-[Poppins] text-[9px] sm:text-[11px] font-semibold
                                tracking-[2px] sm:tracking-[3px] uppercase text-[#5B8EBF] mb-2 sm:mb-3
                                flex items-center gap-1.5 sm:gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" aria-hidden="true" />
                    {s.condition === 'new' ? 'New arrival' : 'In stock'} · Vorback Motors
                  </p>

                  <h2
                    className="font-[Poppins] font-bold text-white leading-[1.08]
                               tracking-tight mb-2 sm:mb-3 text-lg sm:text-3xl md:text-5xl"
                    style={{ fontSize: 'clamp(1.35rem, 4.5vw, 3.4rem)' }}
                  >
                    {headline(s, i)}
                  </h2>

                  <p className="font-[Poppins] text-[11px] sm:text-[15px]
                                text-white/70 mb-4 sm:mb-6 leading-relaxed line-clamp-2 sm:line-clamp-none">
                    {sub(s)}
                  </p>

                  <Link
                    href={s.cta_href}
                    className="inline-flex items-center gap-2 h-9 sm:h-11 px-4 sm:px-6
                               bg-[#1565C0] hover:bg-[#0D47A1] rounded-full
                               font-[Poppins] text-xs sm:text-[13px] font-semibold text-white
                               transition-colors shadow-lg active:scale-95"
                  >
                    {ctaLabel(s)}
                    <ArrowRight size={14} className="sm:size-[15px]" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* slide counter */}
      <div
        className="absolute top-5 right-5 z-20 font-[Poppins] text-[11px]
                   text-white/40 tabular-nums select-none"
        aria-hidden="true"
      >
        {String(cur + 1).padStart(2, '0')} / {String(snaps).padStart(2, '0')}
      </div>

      {/* Slider controls (Dots) — sleek dots + pill centered at bottom matching reference image */}
      <div
        className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-20
                   flex items-center gap-2 px-2.5 py-1
                   bg-black/40 backdrop-blur-sm border border-white/10
                   rounded-full select-none"
        role="tablist"
        aria-label="Slides"
      >
        {active.map((s, idx) => (
          <button
            key={s.slug || idx}
            role="tab"
            type="button"
            data-no-min
            aria-selected={idx === cur}
            aria-label={`Go to slide ${idx + 1}`}
            onClick={() => goTo(idx)}
            className={`!p-0 !min-h-0 !min-w-0 border-0 outline-none transition-all duration-300 cursor-pointer ${
              idx === cur
                ? '!w-6 !h-1.5 rounded-full bg-white shadow-sm'
                : '!w-1.5 !h-1.5 rounded-full bg-white/40 hover:bg-white/80'
            }`}
          />
        ))}
      </div>

      {/* side arrows — desktop */}
      <button
        type="button"
        onClick={prev}
        aria-label="Previous slide"
        className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 z-20
                   items-center justify-center w-10 h-10 rounded-full
                   bg-white/10 hover:bg-white/20 text-white
                   backdrop-blur-sm transition-colors focus:outline-none"
      >
        <ChevronLeft size={20} aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={next}
        aria-label="Next slide"
        className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 z-20
                   items-center justify-center w-10 h-10 rounded-full
                   bg-white/10 hover:bg-white/20 text-white
                   backdrop-blur-sm transition-colors focus:outline-none"
      >
        <ChevronRight size={20} aria-hidden="true" />
      </button>
    </section>
  );
}
