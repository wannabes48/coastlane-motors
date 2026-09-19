import Link from 'next/link';
import { CldImage } from '@/components/cld-image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { fmtKES } from '@/lib/money';

type AdjacentCar = {
  slug: string;
  make: string;
  model: string;
  year: number;
  price_kes: number | null;
  images: { public_id: string; alt?: string }[];
} | null;

type Props = {
  prev: AdjacentCar;
  next: AdjacentCar;
};

function NavCard({
  car,
  direction,
}: {
  car: NonNullable<AdjacentCar>;
  direction: 'prev' | 'next';
}) {
  const thumb = car.images?.[0];
  const isPrev = direction === 'prev';

  return (
    <Link
      href={`/cars/${car.slug}`}
      className={`group flex items-center gap-3 flex-1 min-w-0
                  bg-white border border-line rounded-[var(--radius-card)] p-3
                  hover:border-azure transition-colors duration-150
                  ${isPrev ? 'flex-row' : 'flex-row-reverse'}`}
      aria-label={`${isPrev ? 'Previous' : 'Next'} car: ${car.year} ${car.make} ${car.model}`}
    >
      {/* thumbnail */}
      <div className="relative w-16 h-12 shrink-0 rounded overflow-hidden bg-sky">
        {thumb ? (
          <CldImage
            src={thumb.public_id}
            alt=""
            fill
            crop="fill"
            gravity="auto"
            format="auto"
            quality="auto"
            sizes="64px"
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="M5 17H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1l3-4h8l3 4h1
                       a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2"/>
              <circle cx="12" cy="13" r="3"/>
            </svg>
          </div>
        )}
      </div>

      {/* text */}
      <div className={`flex-1 min-w-0 ${isPrev ? 'text-left' : 'text-right'}`}>
        <p className="font-sans text-step--1 font-semibold text-slate
                      uppercase tracking-wide mb-0.5">
          {isPrev ? '← Previous' : 'Next →'}
        </p>
        <p className="font-sans text-step--1 font-semibold text-ink
                      truncate leading-tight">
          {car.year} {car.make} {car.model}
        </p>
        <p className="font-sans text-step--1 text-azure mt-0.5">
          {fmtKES(car.price_kes)}
        </p>
      </div>

      {/* arrow */}
      <div className="shrink-0 flex items-center justify-center w-7 h-7
                       rounded-full bg-sky text-azure
                       group-hover:bg-azure group-hover:text-white
                       transition-colors duration-150">
        {isPrev
          ? <ChevronLeft  size={16} aria-hidden="true" />
          : <ChevronRight size={16} aria-hidden="true" />}
      </div>
    </Link>
  );
}

export function CarNav({ prev, next }: Props) {
  if (!prev && !next) return null;

  return (
    <nav
      aria-label="Browse other cars"
      className="flex gap-3 flex-col sm:flex-row mt-8"
    >
      {prev ? (
        <NavCard car={prev} direction="prev" />
      ) : (
        <div className="flex-1" aria-hidden="true" />
      )}

      {next ? (
        <NavCard car={next} direction="next" />
      ) : (
        <div className="flex-1" aria-hidden="true" />
      )}
    </nav>
  );
}
