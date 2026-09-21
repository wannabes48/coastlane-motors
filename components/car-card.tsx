'use client';
import Link from 'next/link';
import { CldImage } from '@/components/cld-image';
import { fmtKES } from '@/lib/money';
import clsx from 'clsx';
import { Eye, Gauge, Settings2, MapPin, ArrowRight } from 'lucide-react';
import { WhatsAppIcon } from '@/components/whatsapp-icon';

export function CarCard({ car, priority = false }: { car: any; priority?: boolean }) {
  const isSold = car.status === 'sold';
  
  return (
    <Link href={`/cars/${car.slug}`} className={clsx(
      "group flex flex-col bg-white border border-line rounded-[var(--radius-lg)] overflow-hidden transition-colors hover:border-azure focus:outline-none focus-visible:ring-2 focus-visible:ring-azure",
      isSold && "opacity-65 hover:opacity-80 hover:border-line"
    )}>
      {/* Photo area */}
      <div className="aspect-[4/3] relative bg-sky flex items-center justify-center">
        {car.images?.[0] ? (
          <CldImage
            src={car.images[0].public_id}
            alt={car.images[0].alt || `${car.year} ${car.make} ${car.model} — ${car.condition} car for sale in ${car.city ?? 'Kenya'}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className={clsx("w-full h-full object-cover transition-transform group-hover:scale-105 duration-500", isSold && "grayscale")}
            crop="fill"
            gravity="auto"
            format="auto"
            quality="auto"
            priority={priority}
          />
        ) : (
           <div className="absolute inset-0 flex items-center justify-center text-slate">
             <span className="font-sans text-xs">No Image</span>
           </div>
        )}
        
        {/* Top-left Badge */}
        {isSold ? (
          <div className="absolute top-2.5 left-2.5 bg-ink text-white px-2 py-0.5 rounded-[3px] font-sans text-[9px] font-bold uppercase tracking-[1.5px]">
            Sold
          </div>
        ) : car.condition === 'new' ? (
          <div className="absolute top-2.5 left-2.5 bg-gold text-white px-2 py-0.5 rounded-[3px] font-sans text-[9px] font-bold uppercase tracking-[1.5px]">
            New
          </div>
        ) : null}

        {/* Bottom-right Views */}
        {car.views > 0 && (
          <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-ink/60 rounded-full px-2 py-[3px] font-sans text-[11px] font-medium text-white/80">
            <Eye size={12} aria-hidden="true" />
            {car.views}
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-3.5 flex flex-col flex-1">
        <h3 className="font-sans font-semibold text-[14px] text-ink line-clamp-1 leading-snug mb-1">
          {car.year} {car.make} {car.model}
        </h3>
        <p className="font-sans font-bold text-[20px] text-ink mb-2">
          {fmtKES(car.price_kes)}
        </p>
        
        <div className="flex flex-wrap gap-1.5 mt-auto">
          {car.mileage_km != null && (
            <span className="flex items-center gap-[3px] font-sans text-[11px] text-slate">
              <Gauge size={12} className="text-azure" aria-hidden="true" />
              {car.mileage_km.toLocaleString()} km
            </span>
          )}
          {car.transmission && (
            <span className="flex items-center gap-[3px] font-sans text-[11px] text-slate">
              <Settings2 size={12} className="text-azure" aria-hidden="true" />
              {car.transmission}
            </span>
          )}
          {car.city && (
            <span className="flex items-center gap-[3px] font-sans text-[11px] text-slate">
              <MapPin size={12} className="text-azure" aria-hidden="true" />
              {car.city}
            </span>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-3.5 py-2.5 border-t border-line">
        {isSold ? (
          <div className="font-sans text-[11px] text-slate">This one's sold — see similar below</div>
        ) : (
          <>
            <div className="flex items-center gap-1.5 bg-[#F0FDF4] border border-[#86EFAC] rounded-full px-2.5 py-1 font-sans text-[11px] font-semibold text-[#15803D]">
              <WhatsAppIcon size={13} aria-hidden="true" />
              WhatsApp
            </div>
            <div className="flex items-center gap-[3px] font-sans text-[11px] font-semibold text-azure group-hover:underline">
              View <ArrowRight size={12} aria-hidden="true" />
            </div>
          </>
        )}
      </div>
    </Link>
  );
}
