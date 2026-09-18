import Link from 'next/link';
import { CldImage } from '@/components/cld-image';
import { getRecentlySold } from '@/lib/queries';
import { fmtKES } from '@/lib/money';
import { ArrowRight } from 'lucide-react';

export async function RecentlySold() {
  const cars = await getRecentlySold(4);
  if (!cars.length) return null;

  return (
    <section className="bg-white py-14 px-4" aria-labelledby="recently-sold-heading">
      <div className="max-w-5xl mx-auto">
        {/* header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="font-[Poppins] text-[11px] font-semibold tracking-[3px] uppercase text-[#1479E0] mb-2">
              Moving fast
            </p>
            <h2
              id="recently-sold-heading"
              className="font-[Poppins] text-[22px] font-bold text-[#16293D] leading-tight"
            >
              Recently sold
            </h2>
            <p className="font-[Poppins] text-[13px] text-[#6B7D8F] mt-1">
              Shows what's popular — and how fast stock moves.
            </p>
          </div>
          <Link
            href="/used?status=sold"
            className="hidden sm:flex items-center gap-1 font-[Poppins] text-[13px]
                       font-semibold text-[#1479E0] hover:underline shrink-0"
          >
            View all sold <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>

        {/* grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {cars.map((car) => {
            const thumb = car.images?.[0];
            return (
              <div
                key={car.id}
                className="border border-[#DCE9F2] rounded-lg overflow-hidden opacity-75"
                aria-label={`Sold: ${car.year} ${car.make} ${car.model}`}
              >
                {/* photo */}
                <div className="relative aspect-[4/3] bg-[#E8F4FD]">
                  {thumb ? (
                    <CldImage
                      src={thumb.public_id}
                      alt={thumb.alt || `${car.year} ${car.make} ${car.model}`}
                      fill
                      crop="fill"
                      gravity="auto"
                      format="auto"
                      quality="auto"
                      className="object-cover grayscale-[30%]"
                      sizes="(max-width:640px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#B5D4F4]">
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none"
                           stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                        <path d="M5 17H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1l3-4h8l3 4h1a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2"/>
                        <circle cx="12" cy="13" r="3"/>
                      </svg>
                    </div>
                  )}
                  {/* sold ribbon */}
                  <div className="absolute top-2 left-2 bg-[#16293D] text-white
                                  font-[Poppins] text-[10px] font-semibold
                                  px-2 py-0.5 rounded">
                    Sold
                  </div>
                </div>

                {/* meta */}
                <div className="p-3">
                  <p className="font-[Poppins] text-[12px] font-semibold text-[#16293D] leading-tight truncate">
                    {car.year} {car.make} {car.model}
                  </p>
                  <p className="font-[Poppins] text-[11px] text-[#6B7D8F] mt-1">
                    {fmtKES(car.price_kes)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
