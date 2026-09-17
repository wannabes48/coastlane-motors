import { getVehicle } from '@/lib/queries';
import { Gallery } from '@/components/gallery';
import { WhatsAppButton } from '@/components/whatsapp-button';
import { fmtKES } from '@/lib/money';
import { Metadata } from 'next';
import { Phone, MessageCircle } from 'lucide-react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ViewCounter } from './view-counter';
import { ViewCount } from '@/components/view-count';

export const revalidate = 0;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const car = await getVehicle(slug);
  if (!car) return {};
  const title = `${car.year} ${car.make} ${car.model} ${car.trim ?? ''} — ${fmtKES(car.price_kes)}`.trim();
  return {
    title,
    description: `${title} for sale in ${car.city}. ${car.mileage_km?.toLocaleString() ?? ''}km, ${car.transmission ?? ''}, ${car.fuel ?? ''}. Photos, specs and WhatsApp contact.`,
    alternates: { canonical: `/cars/${car.slug}` },
    openGraph: { type: 'website', title, images: [{ url: `/cars/${car.slug}/opengraph-image` }] },
    robots: car.status === 'sold' ? { index: false, follow: true } : { index: true, follow: true },
  };
}

export default async function CarDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const car = await getVehicle(slug);
  if (!car) notFound();

  let similarCars: any[] = [];
  if (car.status === 'sold') {
    const { supabaseServer } = await import('@/lib/supabase/server');
    const supabase = await supabaseServer();
    const { data } = await supabase.from('vehicles').select('*')
      .eq('status', 'published').eq('body_type', car.body_type).neq('id', car.id).limit(4);
    similarCars = data || [];
  }

  const isSold = car.status === 'sold';
  const price = fmtKES(car.price_kes);

  const ld = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Car',
        name: `${car.year} ${car.make} ${car.model}`,
        brand: { '@type': 'Brand', name: car.make },
        model: car.model,
        vehicleModelDate: String(car.year),
        bodyType: car.body_type,
        vehicleTransmission: car.transmission,
        fuelType: car.fuel,
        vehicleEngine: car.engine_cc ? { '@type':'EngineSpecification', engineDisplacement: { '@type':'QuantitativeValue', value: car.engine_cc, unitCode: 'CMQ' } } : undefined,
        mileageFromOdometer: car.mileage_km ? { '@type':'QuantitativeValue', value: car.mileage_km, unitCode: 'KMT' } : undefined,
        itemCondition: car.condition === 'new' ? 'https://schema.org/NewCondition' : 'https://schema.org/UsedCondition',
        image: car.images?.map((i: any) => `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/w_1200/${i.public_id}`),
        description: car.description,
        offers: car.price_kes ? {
          '@type': 'Offer',
          price: car.price_kes, priceCurrency: 'KES',
          availability: car.status === 'sold' ? 'https://schema.org/SoldOut' : 'https://schema.org/InStock',
          itemCondition: car.condition === 'new' ? 'https://schema.org/NewCondition' : 'https://schema.org/UsedCondition',
          seller: { '@type': 'AutoDealer', name: 'Coastlane Motors', telephone: process.env.NEXT_PUBLIC_PHONE },
          url: `${process.env.NEXT_PUBLIC_SITE_URL}/cars/${car.slug}`,
        } : undefined,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: process.env.NEXT_PUBLIC_SITE_URL },
          { '@type': 'ListItem', position: 2, name: car.condition === 'used' ? 'Used Cars' : 'New Cars', item: `${process.env.NEXT_PUBLIC_SITE_URL}/${car.condition}` },
          { '@type': 'ListItem', position: 3, name: car.make, item: `${process.env.NEXT_PUBLIC_SITE_URL}/used/${car.make?.toLowerCase()}` },
          { '@type': 'ListItem', position: 4, name: `${car.year} ${car.make} ${car.model}` }
        ]
      }
    ]
  };

  return (
    <div className="bg-white min-h-[calc(100vh-72px)]">
      <ViewCounter slug={car.slug} />
      <div className="max-w-7xl mx-auto px-4 py-8 lg:py-12">
        <div className="flex items-center text-sm text-slate mb-6">
          <Link href="/" className="hover:text-ink transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <Link href={`/${car.condition}`} className="hover:text-ink transition-colors capitalize">{car.condition}</Link>
          <span className="mx-2">/</span>
          <span className="text-ink">{car.make} {car.model}</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 lg:items-start">
          <div className="w-full lg:w-3/5 shrink-0 relative">
             {isSold && (
                <div className="absolute top-4 right-4 bg-ink text-white px-4 py-2 font-sans font-semibold z-10 rounded-[var(--radius-card)] shadow-lg text-lg">
                  SOLD
                </div>
              )}
            <Gallery images={car.images || []} carMeta={{ year: car.year, make: car.make, model: car.model }} />
          </div>

          <div className="flex-1 space-y-8">
            <div>
              <h1 className="font-sans font-bold text-step-2 text-ink leading-tight mb-2">
                {car.year} {car.make} {car.model} {car.trim}
              </h1>
              <p className="font-sans font-bold text-step-3 text-ink">{price}</p>
              
              <div className="flex flex-wrap gap-2 mt-4 text-step--1 font-medium">
                <span className="px-3 py-1 bg-sky text-ink rounded-full capitalize">{car.condition}</span>
                {car.mileage_km != null && <span className="px-3 py-1 bg-sky text-ink rounded-full">{car.mileage_km.toLocaleString()} km</span>}
                <span className="px-3 py-1 bg-sky text-ink rounded-full">{car.transmission}</span>
                <span className="px-3 py-1 bg-sky text-ink rounded-full">{car.fuel}</span>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-4">
                 {car.duty_paid && <span className="flex items-center gap-1 text-sm font-semibold text-green-700 bg-green-50 px-3 py-1 rounded border border-green-200">✓ Duty Paid</span>}
                 <span className="flex items-center gap-1 text-sm font-semibold text-green-700 bg-green-50 px-3 py-1 rounded border border-green-200">✓ Logbook Ready</span>
                 {car.condition === 'used' && <span className="flex items-center gap-1 text-sm font-semibold text-green-700 bg-green-50 px-3 py-1 rounded border border-green-200">✓ Verified Mileage</span>}
              </div>
              
              <div className="mt-4">
                <ViewCount count={car.views} />
              </div>
            </div>

            <div className="bg-sky p-6 rounded-[var(--radius-card)] flex flex-col gap-4">
               {isSold ? (
                 <p className="font-sans font-medium text-ink">This one's sold — we usually have similar stock arriving.</p>
               ) : (
                 <>
                   <p className="font-sans font-medium text-ink">Interested? We're ready to help.</p>
                   <div className="flex flex-col sm:flex-row gap-4">
                     <WhatsAppButton car={car} className="flex-1" />
                     <a href={`tel:${process.env.NEXT_PUBLIC_PHONE}`} className="flex-1 bg-white border border-line text-ink font-semibold rounded-full px-6 py-3 inline-flex items-center justify-center transition-colors hover:border-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-azure">
                       Call {process.env.NEXT_PUBLIC_PHONE}
                     </a>
                   </div>
                 </>
               )}
            </div>

            <div>
              <h2 className="font-sans font-semibold text-step-1 text-ink mb-4">Description</h2>
              <div className="prose prose-slate max-w-none text-step-0 whitespace-pre-wrap">
                {car.description}
              </div>
            </div>

            <div className="border-t border-line pt-8">
              <h2 className="font-sans font-semibold text-step-1 text-ink mb-4">Specifications</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-step-0">
                {car.make && <div className="flex justify-between border-b border-line pb-2"><span className="text-slate">Make</span><span className="font-medium text-ink">{car.make}</span></div>}
                {car.model && <div className="flex justify-between border-b border-line pb-2"><span className="text-slate">Model</span><span className="font-medium text-ink">{car.model}</span></div>}
                {car.year && <div className="flex justify-between border-b border-line pb-2"><span className="text-slate">Year</span><span className="font-medium text-ink">{car.year}</span></div>}
                {car.body_type && <div className="flex justify-between border-b border-line pb-2"><span className="text-slate">Body Type</span><span className="font-medium text-ink">{car.body_type}</span></div>}
                {car.engine_cc && <div className="flex justify-between border-b border-line pb-2"><span className="text-slate">Engine</span><span className="font-medium text-ink">{car.engine_cc} CC</span></div>}
                {car.drive && <div className="flex justify-between border-b border-line pb-2"><span className="text-slate">Drive</span><span className="font-medium text-ink">{car.drive}</span></div>}
                {car.exterior && <div className="flex justify-between border-b border-line pb-2"><span className="text-slate">Exterior Color</span><span className="font-medium text-ink">{car.exterior}</span></div>}
                {car.interior && <div className="flex justify-between border-b border-line pb-2"><span className="text-slate">Interior Color</span><span className="font-medium text-ink">{car.interior}</span></div>}
                {car.seats && <div className="flex justify-between border-b border-line pb-2"><span className="text-slate">Seats</span><span className="font-medium text-ink">{car.seats}</span></div>}
                {car.city && <div className="flex justify-between border-b border-line pb-2"><span className="text-slate">Location</span><span className="font-medium text-ink">{car.city}</span></div>}
              </div>
            </div>

            {car.features && car.features.length > 0 && (
              <div className="border-t border-line pt-8">
                <h2 className="font-sans font-semibold text-step-1 text-ink mb-4">Features</h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-step-0">
                  {car.features.map((f: string, i: number) => (
                    <li key={i} className="flex items-center text-ink before:content-['✓'] before:text-azure before:mr-3 before:font-bold">
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}

          </div>
        </div>
        
        {isSold && similarCars.length > 0 && (
          <div className="mt-16 pt-12 border-t border-line">
            <h2 className="font-sans font-bold text-step-2 text-ink mb-6">Similar {car.body_type}s Available Now</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarCars.map(c => {
                 // lazy import CarCard or just map. Actually let's import it at top or require it. 
                 // Wait, I didn't import CarCard at the top of page.tsx. Let me do that via a standard import.
                 // Actually I'll use a local import inside the block to avoid needing to replace line 1.
                 const { CarCard } = require('@/components/car-card');
                 return <CarCard key={c.id} car={c} />;
              })}
            </div>
          </div>
        )}
      </div>

      {/* Sticky Mobile CTA */}
      {!isSold && (
        <>
          <div className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-white border-t border-line p-3"
               style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom))' }}>
            <div className="flex gap-3 h-12">
              <a href={`tel:${process.env.NEXT_PUBLIC_PHONE}`}
                 className="flex items-center justify-center gap-2 h-12 flex-1
                            border border-line rounded-[var(--radius-card)] font-semibold text-ink active:bg-sky">
                <Phone size={18} aria-hidden="true" className="text-azure" />
                Call
              </a>
              <a href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP}?text=Hi%2C%20I%27m%20interested%20in%20the%20${car.year}%20${car.make}%20${car.model}`} target="_blank" rel="noopener noreferrer"
                 className="flex items-center justify-center gap-2 h-12 flex-[2]
                            bg-whatsapp rounded-[var(--radius-card)] font-semibold text-ink active:opacity-90">
                <img src="/whatsapp-icon.png" alt="" className="w-5 h-5 object-contain" />
                WhatsApp us
              </a>
            </div>
          </div>
          {/* Spacer to prevent content from being hidden behind the sticky bar */}
          <div className="h-24 md:hidden" aria-hidden="true" />
        </>
      )}

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
    </div>
  );
}
