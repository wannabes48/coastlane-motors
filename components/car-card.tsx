'use client';
import Link from 'next/link';
import { CldImage } from 'next-cloudinary';
import { fmtKES } from '@/lib/money';
import clsx from 'clsx';
import { ViewCount } from '@/components/view-count';

export function CarCard({ car }: { car: any }) {
  const isSold = car.status === 'sold';
  
  return (
    <Link href={`/cars/${car.slug}`} className="group block bg-white rounded-[var(--radius-card)] shadow-[var(--shadow-card)] overflow-hidden transition-shadow hover:shadow-md relative focus:outline-none focus-visible:ring-2 focus-visible:ring-azure">
      {isSold && (
        <div className="absolute top-0 right-0 bg-ink text-white px-3 py-1 text-xs font-semibold z-10 rounded-bl-[var(--radius-card)]">
          SOLD
        </div>
      )}
      <div className="aspect-[4/3] relative bg-sky">
        {car.images?.[0] ? (
          <CldImage
            src={car.images[0].public_id}
            alt={car.images[0].alt || `${car.year} ${car.make} ${car.model}`}
            width={400}
            height={300}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className={clsx("w-full h-full object-cover transition-transform group-hover:scale-105 duration-500", isSold && "grayscale opacity-80")}
            crop="fill"
            gravity="auto"
            format="auto"
            quality="auto"
          />
        ) : (
           <div className="absolute inset-0 flex items-center justify-center text-slate">No Image</div>
        )}
      </div>
      <div className="p-4 flex flex-col gap-1">
        <h3 className="font-sans font-semibold text-step-1 text-ink group-hover:text-azure transition-colors line-clamp-1 leading-snug">
          {car.year} {car.make} {car.model} {car.trim}
        </h3>
        <p className="font-sans font-bold text-step-1 text-ink">
          {fmtKES(car.price_kes)}
        </p>
        <p className="text-slate text-step--1 mt-1 line-clamp-1">
          {[car.mileage_km != null ? `${car.mileage_km.toLocaleString()} km` : 'New', car.transmission, car.fuel, car.city].filter(Boolean).join(' · ')}
        </p>
        
        {/* views — right-aligned, small, unobtrusive */}
        <div className="flex justify-end mt-1">
          <ViewCount count={car.views} />
        </div>
      </div>
    </Link>
  );
}
