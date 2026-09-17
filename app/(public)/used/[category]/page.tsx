import { Listings } from '@/components/listings';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

const categories = {
  'mombasa': { title: 'Used Cars for Sale in Mombasa', city: 'Mombasa', heading: 'Used Cars for Sale in Mombasa' },
  'nairobi': { title: 'Used Cars for Sale in Nairobi', city: 'Nairobi', heading: 'Used Cars for Sale in Nairobi' },
  'toyota': { title: 'Used Toyota Cars for Sale in Kenya', make: 'Toyota', heading: 'Used Toyota Cars for Sale' },
  'suv': { title: 'Used SUVs for Sale in Kenya', body: 'SUV', heading: 'Used SUVs for Sale' },
  'under-1-million': { title: 'Used Cars Under 1 Million KES in Kenya', max: 1000000, heading: 'Used Cars Under 1 Million KES' }
};

export function generateStaticParams() {
  return Object.keys(categories).map(c => ({ category: c }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params;
  const config = categories[category as keyof typeof categories];
  if (!config) return {};
  
  return {
    title: config.title,
    description: `Browse ${config.title.toLowerCase()}. Clear prices, full photos, duty paid. WhatsApp us to view or reserve.`,
    alternates: { canonical: `/used/${category}` },
  };
}

export default async function CategoryPage({ params, searchParams }: { params: Promise<{ category: string }>, searchParams: Promise<any> }) {
  const { category } = await params;
  const config = categories[category as keyof typeof categories];
  if (!config) notFound();

  // merge category filter with searchParams
  const sp = await searchParams;
  const mergedParams = Promise.resolve({ ...sp, ...config });

  return (
    <>
      <Listings searchParams={mergedParams} condition="used" />
    </>
  );
}
