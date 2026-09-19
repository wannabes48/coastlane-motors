import { Listings } from '@/components/listings';
import { Metadata } from 'next';

export async function generateMetadata({ searchParams }: { searchParams: Promise<any> }): Promise<Metadata> {
  const params = await searchParams;
  const page = Number(params.page ?? 1);
  const base = `${process.env.NEXT_PUBLIC_SITE_URL}/used`;

  return {
    title: 'Used Cars for Sale in Kenya',
    description: 'Browse verified used cars for sale in Kenya. Clear prices, full photos, duty paid.',
    alternates: {
      canonical: page === 1 ? base : `${base}?page=${page}`,
    },
  };
}

export const revalidate = 300;

export default function UsedPage({ searchParams }: { searchParams: Promise<any> }) {
  return <Listings searchParams={searchParams} condition="used" />;
}
