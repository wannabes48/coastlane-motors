import { getVehicle, getAdjacentVehicles, getSimilarVehicles } from '@/lib/queries';
import { Gallery } from '@/components/gallery';
import { CarNav } from '@/components/car-nav';
import { SimilarCars } from '@/components/similar-cars';
import { WhatsAppButton } from '@/components/whatsapp-button';
import { ShareButton } from '@/components/share-button';
import { fmtKES } from '@/lib/money';
import { waLink } from '@/lib/whatsapp';
import { Metadata } from 'next';
import { Phone, Eye, Gauge, Settings2, MapPin, ArrowRight } from 'lucide-react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ViewCounter } from './view-counter';
import { LiveViewCount } from '@/components/live-view-count';

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const car = await getVehicle(slug);
  if (!car) return {};
  
  const priceStr = car.price_kes ? `KSh ${car.price_kes.toLocaleString()}` : '';
  const title = [
    `${car.year} ${car.make} ${car.model} for Sale`,
    car.city ? `in ${car.city}` : 'in Kenya',
    priceStr ? `— ${priceStr}` : '',
  ].filter(Boolean).join(' ').trim();

  const description = [
    `${car.year} ${car.make} ${car.model} for sale in ${car.city ?? 'Kenya'}.`,
    car.mileage_km != null ? `${car.mileage_km.toLocaleString()} km,` : '',
    car.transmission ? `${car.transmission},` : '',
    car.fuel ? `${car.fuel}.` : '',
    'Duty paid, clearly priced in KES. WhatsApp Coastlane Motors to arrange a viewing.',
  ].filter(Boolean).join(' ').replace(/\s+/g, ' ').trim();

  let ogImages: any[] = [];
  if (car.images && car.images[0]) {
    const imageUrl = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_fill,w_1200,h_630,f_jpg,q_80/${car.images[0].public_id}`;
    ogImages = [
      {
        url: imageUrl,
        width: 1200,
        height: 630,
        alt: title,
      },
    ];
  }

  return {
    title,
    description,
    alternates: { canonical: `/cars/${car.slug}` },
    openGraph: { 
      type: 'website', 
      title, 
      description,
      images: ogImages 
    },
    robots: car.status === 'sold' ? { index: false, follow: true } : { index: true, follow: true },
  };
}

export default async function CarDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const car = await getVehicle(slug);
  if (!car) notFound();

  // run all data fetches in parallel — no waterfall
  const [{ prev, next }, similar] = await Promise.all([
    getAdjacentVehicles(car.id, car.condition, car.created_at),
    getSimilarVehicles(car.id, car.body_type, car.price_kes, car.condition),
  ]);

  const isSold = car.status === 'sold';
  const price = fmtKES(car.price_kes);
  const wa = waLink(car);
  const phone = process.env.NEXT_PUBLIC_PHONE!;

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
          seller: { '@type': 'AutoDealer', name: 'Coastlane Motors', telephone: phone },
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

        {/* breadcrumb + back button */}
        <div className="flex items-center justify-between text-sm text-slate mb-6">
          <div className="flex items-center gap-1.5 flex-wrap">
            <Link href="/" className="hover:text-ink transition-colors">Home</Link>
            <span>/</span>
            <Link href={`/${car.condition}`} className="hover:text-ink transition-colors capitalize">{car.condition}</Link>
            <span>/</span>
            <span className="text-ink truncate max-w-[140px] sm:max-w-none">{car.make} {car.model}</span>
          </div>
          {/* Back button — always visible, prominent on mobile */}
          <Link
            href={`/${car.condition}`}
            className="flex items-center gap-1.5 h-9 px-4 bg-white border border-line rounded-full font-sans text-[13px] font-semibold text-ink hover:border-azure transition-colors shrink-0 ml-3"
          >
            <ArrowRight size={14} className="rotate-180 text-azure" aria-hidden="true" />
            <span className="hidden sm:inline">All {car.condition} cars</span>
            <span className="sm:hidden">Back</span>
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 lg:items-start">
          {/* ── LEFT: gallery + nav ── */}
          <div className="w-full lg:w-3/5 shrink-0 relative">
             {isSold && (
                <div className="absolute top-4 right-4 bg-ink text-white px-4 py-2 font-sans font-semibold z-10 rounded-[var(--radius-card)] shadow-lg text-lg">
                  SOLD
                </div>
              )}
            <Gallery 
              images={car.images || []} 
              make={car.make} 
              model={car.model} 
              year={car.year} 
            />

            {/* prev / next navigation */}
            <CarNav prev={prev} next={next} />
          </div>

          {/* ── RIGHT: info panel ── */}
          <div className="flex-1 lg:w-[320px] max-w-sm shrink-0 flex flex-col gap-3">
            
            {/* Top Card: Title, Price, Views */}
            <div className="bg-sky border border-line rounded-[var(--radius-lg)] p-4">
              <div className="text-[11px] text-slate uppercase tracking-[1.5px] font-medium mb-1">
                {car.condition} {car.body_type ? `· ${car.body_type}` : ''}
              </div>
              <h1 className="font-sans font-bold text-[18px] text-ink leading-snug mb-2.5">
                {car.year} {car.make} {car.model}
              </h1>
              <p className="font-sans font-extrabold text-[26px] text-ink">{price}</p>
              {car.negotiable && (
                <p className="font-sans text-[11px] text-slate mt-0.5">Price negotiable</p>
              )}
              
              <div className="flex items-center gap-1.5 mt-2">
                <Eye size={13} className="text-azure" aria-hidden="true" />
                <div className="text-[11px] text-slate"><LiveViewCount slug={car.slug} initial={car.views || 0} /></div>
              </div>

              {isSold && (
                <div className="mt-3 bg-white/50 border border-line rounded-[var(--radius)] px-3 py-2 font-sans text-[11px] text-slate">
                  This car has been sold.
                </div>
              )}
            </div>

            {/* CTAs */}
            {!isSold && (
              <div className="flex flex-col gap-2 my-1">
                <a href={wa} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 h-[46px] bg-wa rounded-[var(--radius)] font-sans text-[14px] font-bold text-white transition-opacity hover:opacity-90">
                  <img src="/whatsapp-icon.png" alt="" className="w-4 h-4 object-contain" />
                  WhatsApp us about this car
                </a>
                <a href={`tel:${phone}`} className="flex items-center justify-center gap-2 h-[42px] bg-white border border-line-md rounded-[var(--radius)] font-sans text-[14px] font-semibold text-ink transition-colors hover:border-ink">
                  <Phone size={16} className="text-azure" aria-hidden="true" />
                  Call us
                </a>
                <ShareButton car={{ slug: car.slug, year: car.year, make: car.make, model: car.model, price_kes: car.price_kes }} />
              </div>
            )}

            {/* Specs Card */}
            <div className="bg-sky border border-line rounded-[var(--radius-lg)] p-4">
              <div className="font-sans text-[12px] font-semibold text-ink mb-3">Specifications</div>
              <div className="grid grid-cols-2 gap-x-2 gap-y-2.5">
                {car.mileage_km != null && (
                  <div>
                    <div className="flex items-center gap-1 text-[10px] text-slate uppercase tracking-[1.5px] mb-0.5">
                      <Gauge size={11} className="text-azure" aria-hidden="true" /> Mileage
                    </div>
                    <div className="font-sans text-[13px] font-semibold text-ink">{car.mileage_km.toLocaleString()} km</div>
                  </div>
                )}
                {car.transmission && (
                  <div>
                    <div className="flex items-center gap-1 text-[10px] text-slate uppercase tracking-[1.5px] mb-0.5">
                      <Settings2 size={11} className="text-azure" aria-hidden="true" /> Trans.
                    </div>
                    <div className="font-sans text-[13px] font-semibold text-ink">{car.transmission}</div>
                  </div>
                )}
                {car.city && (
                  <div>
                    <div className="flex items-center gap-1 text-[10px] text-slate uppercase tracking-[1.5px] mb-0.5">
                      <MapPin size={11} className="text-azure" aria-hidden="true" /> Location
                    </div>
                    <div className="font-sans text-[13px] font-semibold text-ink">{car.city}</div>
                  </div>
                )}
                {car.fuel && (
                  <div>
                    <div className="flex items-center gap-1 text-[10px] text-slate uppercase tracking-[1.5px] mb-0.5">
                      <div className="w-2.5 h-2.5 rounded-full border-[2px] border-azure" aria-hidden="true" /> Fuel
                    </div>
                    <div className="font-sans text-[13px] font-semibold text-ink">{car.fuel}</div>
                  </div>
                )}
                {car.engine_cc && (
                  <div>
                    <div className="flex items-center gap-1 text-[10px] text-slate uppercase tracking-[1.5px] mb-0.5">
                      <div className="w-2.5 h-2.5 rounded-sm border-[2px] border-azure" aria-hidden="true" /> Engine
                    </div>
                    <div className="font-sans text-[13px] font-semibold text-ink">{car.engine_cc} CC</div>
                  </div>
                )}
                {car.exterior && (
                  <div>
                    <div className="flex items-center gap-1 text-[10px] text-slate uppercase tracking-[1.5px] mb-0.5">
                      <div className="w-2.5 h-2.5 rounded border-[2px] border-azure" aria-hidden="true" /> Color
                    </div>
                    <div className="font-sans text-[13px] font-semibold text-ink">{car.exterior}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Description (bare) */}
            {car.description && (
              <div className="mt-2">
                <div className="prose prose-slate max-w-none font-sans text-[13px] whitespace-pre-wrap leading-relaxed text-slate">
                  {car.description}
                </div>
              </div>
            )}
            
            {/* Features (bare) */}
            {car.features && car.features.length > 0 && (
              <div className="mt-2 border-t border-line pt-4">
                <ul className="flex flex-col gap-2 font-sans text-[13px] text-ink">
                  {car.features.map((f: string, i: number) => (
                    <li key={i} className="flex items-center before:content-['✓'] before:text-azure before:mr-2 before:font-bold before:text-[14px]">
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* About this car — auto-generated SEO copy */}
            <div className="mt-2 bg-white border border-line rounded-[var(--radius-lg)] p-4">
              <h2 className="font-sans text-[13px] font-semibold text-ink mb-2">
                About this {car.make} {car.model}
              </h2>
              <p className="font-sans text-[13px] text-slate leading-relaxed">
                The {car.year} {car.make} {car.model} is a {car.condition}{' '}
                {car.body_type?.toLowerCase() ?? 'vehicle'}
                {car.mileage_km != null ? ` with ${car.mileage_km.toLocaleString()} km on the clock` : ''}.
                {car.transmission ? ` It comes with a ${car.transmission.toLowerCase()} gearbox` : ''}
                {car.fuel ? ` and runs on ${car.fuel.toLowerCase()}` : ''}.
                {' '}Duty is fully paid — no additional import costs.
                {car.city ? ` Located in ${car.city}, Kenya.` : ' Located in Kenya.'}
                {' '}WhatsApp us to arrange a viewing.
              </p>
            </div>

            {/* Internal category links — build topical authority */}
            <div className="flex flex-wrap gap-2 mt-1">
              {car.make && (
                <Link
                  href={`/used/${car.make.toLowerCase().replace(/\s+/g, '-')}`}
                  className="flex items-center gap-1 font-sans text-[12px] text-azure hover:underline"
                >
                  More {car.make} vehicles <ArrowRight size={12} aria-hidden="true" />
                </Link>
              )}
              {car.body_type && (
                <Link
                  href={`/used/${car.body_type.toLowerCase().replace(/\s+/g, '-')}`}
                  className="flex items-center gap-1 font-sans text-[12px] text-azure hover:underline"
                >
                  More {car.body_type}s <ArrowRight size={12} aria-hidden="true" />
                </Link>
              )}
            </div>
            
          </div>
        </div>
        
        {/* ── similar cars ── */}
        <SimilarCars
          cars={similar}
          currentBodyType={car.body_type}
          currentPrice={car.price_kes}
        />
      </div>

      {/* Sticky Mobile CTA */}
      {!isSold && (
        <>
          <div className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-white border-t border-line p-3"
               style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom))' }}>
            <div className="flex gap-3 h-12">
              <a href={`tel:${phone}`}
                 className="flex items-center justify-center gap-2 h-12 flex-1
                            border border-line rounded-[var(--radius-card)] font-semibold text-ink active:bg-sky">
                <Phone size={18} aria-hidden="true" className="text-azure" />
                Call
              </a>
              <a href={wa} target="_blank" rel="noopener noreferrer"
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
