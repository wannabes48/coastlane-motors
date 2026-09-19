import Link from 'next/link';
import { CldImage } from '@/components/cld-image';
import { fmtKES } from '@/lib/money';

type SimilarCar = {
  id: string;
  slug: string;
  make: string;
  model: string;
  year: number;
  price_kes: number | null;
  images: { public_id: string; alt?: string }[];
  body_type: string | null;
  mileage_km: number | null;
  transmission: string | null;
  city: string | null;
  condition: 'used' | 'new';
};

type Props = {
  cars: SimilarCar[];
  currentBodyType: string | null;
  currentPrice: number | null;
};

export function SimilarCars({ cars, currentBodyType, currentPrice }: Props) {
  if (!cars.length) return null;

  const reason =
    currentBodyType
      ? `More ${currentBodyType}s`
      : currentPrice
      ? 'Similar price range'
      : 'You may also like';

  return (
    <section
      className="mt-12 pt-10 border-t border-line"
      aria-labelledby="similar-heading"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="font-sans text-step--1 font-semibold tracking-[3px]
                        uppercase text-azure mb-1">
            {reason}
          </p>
          <h2
            id="similar-heading"
            className="font-sans font-bold text-step-1 text-ink leading-tight"
          >
            You may also like
          </h2>
        </div>

        <Link
          href={
            currentBodyType
              ? `/used?body=${encodeURIComponent(currentBodyType)}`
              : '/used'
          }
          className="hidden sm:block font-sans text-step--1 font-semibold
                     text-azure hover:underline shrink-0"
        >
          See all →
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cars.map((car) => {
          const thumb = car.images?.[0];
          return (
            <Link
              key={car.id}
              href={`/cars/${car.slug}`}
              className="group flex flex-col bg-white border border-line
                         rounded-[var(--radius-card)] overflow-hidden
                         hover:border-azure hover:shadow-[var(--shadow-card)]
                         transition-all duration-150"
              aria-label={`${car.year} ${car.make} ${car.model} — ${fmtKES(car.price_kes)}`}
            >
              <div className="relative aspect-[4/3] bg-sky overflow-hidden">
                {thumb ? (
                  <CldImage
                    src={thumb.public_id}
                    alt={thumb.alt || `${car.year} ${car.make} ${car.model}`}
                    fill
                    crop="fill"
                    gravity="auto"
                    format="auto"
                    quality="auto"
                    sizes="(max-width:640px) 50vw, 25vw"
                    className="object-cover transition-transform duration-300
                               group-hover:scale-[1.03]"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" strokeWidth="1" aria-hidden="true">
                      <path d="M5 17H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1l3-4h8l3 4h1
                               a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2"/>
                      <circle cx="12" cy="13" r="3"/>
                    </svg>
                  </div>
                )}
                <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm
                                font-sans text-[10px] font-semibold
                                text-ink px-2 py-0.5 rounded-full capitalize">
                  {car.condition}
                </div>
              </div>

              <div className="p-3 flex flex-col gap-1">
                <p className="font-sans text-step--1 font-semibold
                              text-ink leading-snug truncate">
                  {car.year} {car.make} {car.model}
                </p>
                <p className="font-sans text-step-0 font-bold text-ink">
                  {fmtKES(car.price_kes)}
                </p>
                <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1">
                  {car.mileage_km != null && (
                    <span className="font-sans text-[11px] text-slate">
                      {car.mileage_km.toLocaleString()} km
                    </span>
                  )}
                  {car.transmission && (
                    <span className="font-sans text-[11px] text-slate">
                      {car.transmission}
                    </span>
                  )}
                  {car.city && (
                    <span className="font-sans text-[11px] text-slate">
                      {car.city}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="flex justify-center mt-6 sm:hidden">
        <Link
          href={
            currentBodyType
              ? `/used?body=${encodeURIComponent(currentBodyType)}`
              : '/used'
          }
          className="font-sans text-step--1 font-semibold text-azure
                     border border-azure rounded-full px-6 py-2.5
                     hover:bg-sky transition-colors"
        >
          See all {currentBodyType ?? 'cars'} →
        </Link>
      </div>
    </section>
  );
}
