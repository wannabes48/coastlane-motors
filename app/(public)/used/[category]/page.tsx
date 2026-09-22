import { ListingsPage } from '@/components/listings-page';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

type CategoryConfig = {
  title: string;
  description: string;
  h1: string;
  filter: {
    make?: string;
    body?: string;
    city?: string;
    max?: number;
  };
};

const CATEGORY_MAP: Record<string, CategoryConfig> = {
  // — Makes —
  toyota: {
    title: 'Used Toyota Cars for Sale in Kenya (2026) — Coastlane Motors',
    description: 'Browse used Toyota cars for sale in Kenya — Harrier, Prado, Hilux, Vitz and more. Duty paid, clearly priced in KES. WhatsApp Coastlane Motors to view.',
    h1: 'Used Toyota Cars for Sale in Kenya',
    filter: { make: 'Toyota' },
  },
  nissan: {
    title: 'Used Nissan Cars for Sale in Kenya (2026) — Coastlane Motors',
    description: 'Browse used Nissan vehicles for sale in Kenya — Note, X-Trail, Navara and more. Duty paid, clearly priced in KES. WhatsApp Coastlane Motors to view.',
    h1: 'Used Nissan Cars for Sale in Kenya',
    filter: { make: 'Nissan' },
  },
  mazda: {
    title: 'Used Mazda Cars for Sale in Kenya (2026) — Coastlane Motors',
    description: 'Browse used Mazda vehicles for sale in Kenya — CX-5, Demio, Atenza and more. Duty paid, clearly priced in KES. WhatsApp Coastlane Motors to view.',
    h1: 'Used Mazda Cars for Sale in Kenya',
    filter: { make: 'Mazda' },
  },
  subaru: {
    title: 'Used Subaru Cars for Sale in Kenya (2026) — Coastlane Motors',
    description: 'Browse used Subaru vehicles for sale in Kenya — Forester, Outback, Legacy and more. Duty paid, clearly priced in KES. WhatsApp Coastlane Motors to view.',
    h1: 'Used Subaru Cars for Sale in Kenya',
    filter: { make: 'Subaru' },
  },
  'mercedes-benz': {
    title: 'Used Mercedes-Benz for Sale in Kenya (2026) — Coastlane Motors',
    description: 'Browse used Mercedes-Benz vehicles for sale in Kenya. Duty paid, clearly priced in KES. WhatsApp Coastlane Motors to view.',
    h1: 'Used Mercedes-Benz for Sale in Kenya',
    filter: { make: 'Mercedes Benz' },
  },
  honda: {
    title: 'Used Honda Cars for Sale in Kenya (2026) — Coastlane Motors',
    description: 'Browse used Honda vehicles for sale in Kenya — Fit, CR-V, Accord and more. Duty paid, clearly priced in KES. WhatsApp Coastlane Motors to view.',
    h1: 'Used Honda Cars for Sale in Kenya',
    filter: { make: 'Honda' },
  },
  mitsubishi: {
    title: 'Used Mitsubishi Cars for Sale in Kenya (2026) — Coastlane Motors',
    description: 'Browse used Mitsubishi vehicles for sale in Kenya — Outlander, Pajero, L200 and more. Duty paid, clearly priced in KES. WhatsApp Coastlane Motors to view.',
    h1: 'Used Mitsubishi Cars for Sale in Kenya',
    filter: { make: 'Mitsubishi' },
  },
  isuzu: {
    title: 'Used Isuzu for Sale in Kenya (2026) — Coastlane Motors',
    description: 'Browse used Isuzu vehicles for sale in Kenya — D-Max, MU-X and more. Duty paid, clearly priced in KES. WhatsApp Coastlane Motors to view.',
    h1: 'Used Isuzu for Sale in Kenya',
    filter: { make: 'Isuzu' },
  },
  bmw: {
    title: 'Used BMW for Sale in Kenya (2026) — Coastlane Motors',
    description: 'Browse used BMW vehicles for sale in Kenya — 3 Series, 5 Series, X5 and more. Duty paid, clearly priced in KES. WhatsApp Coastlane Motors to view.',
    h1: 'Used BMW for Sale in Kenya',
    filter: { make: 'BMW' },
  },
  audi: {
    title: 'Used Audi for Sale in Kenya (2026) — Coastlane Motors',
    description: 'Browse used Audi vehicles for sale in Kenya — A3, A4, Q5 and more. Duty paid, clearly priced in KES. WhatsApp Coastlane Motors to view.',
    h1: 'Used Audi for Sale in Kenya',
    filter: { make: 'Audi' },
  },
  suzuki: {
    title: 'Used Suzuki Cars for Sale in Kenya (2026) — Coastlane Motors',
    description: 'Browse used Suzuki vehicles for sale in Kenya — Swift, Vitara, Jimny and more. Duty paid, clearly priced in KES. WhatsApp Coastlane Motors to view.',
    h1: 'Used Suzuki Cars for Sale in Kenya',
    filter: { make: 'Suzuki' },
  },
  lexus: {
    title: 'Used Lexus for Sale in Kenya (2026) — Coastlane Motors',
    description: 'Browse used Lexus vehicles for sale in Kenya — LX, RX, IS and more. Duty paid, clearly priced in KES. WhatsApp Coastlane Motors to view.',
    h1: 'Used Lexus for Sale in Kenya',
    filter: { make: 'Lexus' },
  },
  volkswagen: {
    title: 'Used Volkswagen for Sale in Kenya (2026) — Coastlane Motors',
    description: 'Browse used Volkswagen vehicles for sale in Kenya — Golf, Polo, Tiguan and more. Duty paid, clearly priced in KES. WhatsApp Coastlane Motors to view.',
    h1: 'Used Volkswagen for Sale in Kenya',
    filter: { make: 'Volkswagen' },
  },
  ford: {
    title: 'Used Ford Cars for Sale in Kenya (2026) — Coastlane Motors',
    description: 'Browse used Ford vehicles for sale in Kenya — Ranger, Everest, Explorer and more. Duty paid, clearly priced in KES. WhatsApp Coastlane Motors to view.',
    h1: 'Used Ford Cars for Sale in Kenya',
    filter: { make: 'Ford' },
  },

  // — Body types —
  suv: {
    title: 'Used SUVs for Sale in Kenya (2026) — Coastlane Motors',
    description: 'Find used SUVs for sale in Kenya with clear KES prices and real yard photos. Toyota, Mazda, Subaru, Nissan and more. WhatsApp Coastlane Motors to view.',
    h1: 'Used SUVs for Sale in Kenya',
    filter: { body: 'SUV' },
  },
  sedan: {
    title: 'Used Sedans for Sale in Kenya (2026) — Coastlane Motors',
    description: 'Browse used saloon cars for sale in Kenya. Clearly priced in KES, duty paid, real photos. WhatsApp Coastlane Motors to view.',
    h1: 'Used Sedans for Sale in Kenya',
    filter: { body: 'Sedan' },
  },
  hatchback: {
    title: 'Used Hatchbacks for Sale in Kenya (2026) — Coastlane Motors',
    description: 'Browse used hatchback cars for sale in Kenya. Clearly priced in KES, duty paid, real photos. WhatsApp Coastlane Motors to view.',
    h1: 'Used Hatchbacks for Sale in Kenya',
    filter: { body: 'Hatchback' },
  },
  'double-cab': {
    title: 'Used Double Cabs for Sale in Kenya (2026) — Coastlane Motors',
    description: 'Browse used double cab pickup trucks for sale in Kenya — Toyota Hilux, Nissan Navara, Isuzu D-Max and more. WhatsApp Coastlane Motors to view.',
    h1: 'Used Double Cabs for Sale in Kenya',
    filter: { body: 'Double Cab' },
  },
  'station-wagon': {
    title: 'Used Station Wagons for Sale in Kenya (2026) — Coastlane Motors',
    description: 'Browse used station wagons for sale in Kenya. Clearly priced in KES, duty paid, real photos. WhatsApp Coastlane Motors to view.',
    h1: 'Used Station Wagons for Sale in Kenya',
    filter: { body: 'Station Wagon' },
  },
  van: {
    title: 'Used Vans for Sale in Kenya (2026) — Coastlane Motors',
    description: 'Browse used vans for sale in Kenya. Clearly priced in KES, duty paid, real photos. WhatsApp Coastlane Motors to view.',
    h1: 'Used Vans for Sale in Kenya',
    filter: { body: 'Van' },
  },
  minibus: {
    title: 'Used Minibuses for Sale in Kenya (2026) — Coastlane Motors',
    description: 'Browse used minibuses for sale in Kenya. Clearly priced in KES, duty paid, real photos. WhatsApp Coastlane Motors to view.',
    h1: 'Used Minibuses for Sale in Kenya',
    filter: { body: 'Minibus' },
  },

  // — Locations —
  mombasa: {
    title: 'Used Cars for Sale in Mombasa (2026) — Coastlane Motors',
    description: 'Browse used cars for sale in Mombasa. All stock is duty paid, photographed at the yard, and priced in KES. Call or WhatsApp Coastlane Motors.',
    h1: 'Used Cars for Sale in Mombasa',
    filter: { city: 'Mombasa' },
  },
  nairobi: {
    title: 'Used Cars for Sale in Nairobi (2026) — Coastlane Motors',
    description: 'Browse used cars for sale in Nairobi. All stock is duty paid, clearly priced in KES. Call or WhatsApp Coastlane Motors to view.',
    h1: 'Used Cars for Sale in Nairobi',
    filter: { city: 'Nairobi' },
  },

  // — Budget —
  'under-1-million': {
    title: 'Used Cars Under KSh 1 Million in Kenya (2026) — Coastlane Motors',
    description: 'Browse used cars for sale in Kenya under KSh 1,000,000. Budget picks, duty paid, clearly priced. WhatsApp Coastlane Motors to view.',
    h1: 'Used Cars Under KSh 1 Million in Kenya',
    filter: { max: 1_000_000 },
  },
  'under-2-million': {
    title: 'Used Cars Under KSh 2 Million in Kenya (2026) — Coastlane Motors',
    description: 'Browse used cars for sale in Kenya under KSh 2,000,000. Duty paid, clearly priced in KES. WhatsApp Coastlane Motors to view.',
    h1: 'Used Cars Under KSh 2 Million in Kenya',
    filter: { max: 2_000_000 },
  },
};

export function generateStaticParams() {
  return Object.keys(CATEGORY_MAP).map(c => ({ category: c }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params;
  const config = CATEGORY_MAP[category];
  if (!config) return {};

  return {
    title: config.title,
    description: config.description,
    alternates: { canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/used/${category}` },
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<any>;
}) {
  const { category } = await params;
  const config = CATEGORY_MAP[category];
  if (!config) notFound();

  const sp = await searchParams;

  // Merge category filter into search params
  const mergedParams: Record<string, string> = { ...sp };
  if (config.filter.make)        mergedParams.make = config.filter.make;
  if (config.filter.body)        mergedParams.body = config.filter.body;
  if (config.filter.city)        mergedParams.city = config.filter.city;
  if (config.filter.max != null) mergedParams.max  = String(config.filter.max);

  // Default tab to 'used' if not set
  if (!mergedParams.tab) mergedParams.tab = 'used';

  const { ListingsPage } = await import('@/components/listings-page');

  return (
    <>
      {/* SEO h1 heading above the listings */}
      <div className="bg-sky border-b border-line px-4 py-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="font-sans font-bold text-[22px] text-ink leading-tight">
            {config.h1}
          </h1>
          <p className="font-sans text-[13px] text-slate mt-1">
            Duty paid · Clearly priced in KES · Real yard photos
          </p>
        </div>
      </div>
      <ListingsPage
        searchParams={mergedParams}
        defaultTab="used"
        basePath={`/used/${category}`}
      />
    </>
  );
}
