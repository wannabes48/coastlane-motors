import Link from 'next/link';
import { CldImage } from '@/components/cld-image';
import { getFeaturedVehicle } from '@/lib/queries';
import { fmtKES } from '@/lib/money';
import { ArrowRight, MapPin, Fuel, Settings2, Gauge } from 'lucide-react';

export async function StaffPick() {
  const car = await getFeaturedVehicle();
  if (!car) return null;

  const thumb = car.images?.[0];

  const specs = [
    car.mileage_km != null && {
      icon: Gauge,
      value: `${car.mileage_km.toLocaleString()} km`,
    },
    car.transmission && { icon: Settings2, value: car.transmission },
    car.fuel         && { icon: Fuel,      value: car.fuel },
    car.city         && { icon: MapPin,    value: car.city },
  ].filter(Boolean) as { icon: React.ElementType; value: string }[];

  return (
    <section className="bg-[#E8F4FD] py-14 px-4" aria-labelledby="staff-pick-heading">
      <div className="max-w-4xl mx-auto">
        <p className="font-[Poppins] text-[11px] font-semibold tracking-[3px] uppercase text-[#1479E0] mb-2">
          Staff pick
        </p>
        <h2
          id="staff-pick-heading"
          className="font-[Poppins] text-[22px] font-bold text-[#16293D] mb-6 leading-tight"
        >
          Car of the week
        </h2>

        <Link
          href={`/cars/${car.slug}`}
          className="group flex flex-col sm:flex-row bg-white border border-[#DCE9F2]
                     rounded-lg overflow-hidden hover:border-[#B5D4F4]
                     transition-colors duration-150"
        >
          {/* photo */}
          <div className="relative sm:w-[45%] aspect-[4/3] sm:aspect-auto bg-[#E8F4FD] flex-shrink-0">
            {thumb ? (
              <CldImage
                src={thumb.public_id}
                alt={thumb.alt || `${car.year} ${car.make} ${car.model}`}
                fill
                crop="fill"
                gravity="auto"
                format="auto"
                quality="auto"
                priority
                className="object-cover"
                sizes="(max-width:640px) 100vw, 45vw"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#B5D4F4]">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" strokeWidth="1" aria-hidden="true">
                  <path d="M5 17H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1l3-4h8l3 4h1a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2"/>
                  <circle cx="12" cy="13" r="3"/>
                </svg>
              </div>
            )}

            {/* featured badge */}
            <div className="absolute top-3 left-3 bg-[#1479E0] text-white
                            font-[Poppins] text-[10px] font-semibold
                            px-2.5 py-1 rounded-sm tracking-wide">
              ★ Staff pick
            </div>
          </div>

          {/* details */}
          <div className="flex flex-col justify-between p-6 flex-1">
            <div>
              <p className="font-[Poppins] text-[11px] text-[#6B7D8F] mb-1 uppercase tracking-wide">
                {car.condition === 'new' ? 'Brand new' : 'Used'}
                {car.body_type ? ` · ${car.body_type}` : ''}
              </p>
              <h3 className="font-[Poppins] text-[20px] sm:text-[22px] font-bold text-[#16293D] leading-tight mb-3">
                {car.year} {car.make} {car.model}
              </h3>

              {/* specs row */}
              {specs.length > 0 && (
                <div className="flex flex-wrap gap-x-4 gap-y-1 mb-5">
                  {specs.map(({ icon: Icon, value }) => (
                    <span key={value} className="flex items-center gap-1.5 font-[Poppins] text-[12px] text-[#6B7D8F]">
                      <Icon size={13} aria-hidden="true" className="text-[#1479E0]" />
                      {value}
                    </span>
                  ))}
                </div>
              )}

              {/* price */}
              <p className="font-[Poppins] text-[28px] font-bold text-[#16293D] leading-none">
                {fmtKES(car.price_kes)}
              </p>
              {car.negotiable && (
                <p className="font-[Poppins] text-[11px] text-[#6B7D8F] mt-1">
                  Price negotiable
                </p>
              )}
            </div>

            {/* CTA */}
            <div className="mt-6">
              <span
                className="inline-flex items-center gap-2 h-11 px-5
                           bg-[#1479E0] group-hover:bg-[#0F5CAD]
                           rounded font-[Poppins] text-[13px] font-semibold
                           text-white transition-colors duration-150"
              >
                View this car
                <ArrowRight size={15} aria-hidden="true" />
              </span>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}
