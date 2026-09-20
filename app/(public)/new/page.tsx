import { ListingsPage } from '@/components/listings-page';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export async function generateMetadata({ searchParams }: { searchParams: Promise<any> }): Promise<Metadata> {
  const params = await searchParams;
  const page = Number(params.page ?? 1);
  const base = `${process.env.NEXT_PUBLIC_SITE_URL}/new`;

  return {
    title: 'New Cars for Sale in Kenya',
    description: 'Browse verified new cars for sale in Kenya. Clear prices, full photos, duty paid.',
    alternates: {
      canonical: page === 1 ? base : `${base}?page=${page}`,
    },
  };
}

export const revalidate = 300;

export default async function NewPage({ searchParams }: { searchParams: Promise<any> }) {
  const params = await searchParams;
  if (params.tab === 'used') {
    const sp = new URLSearchParams(params);
    redirect(`/used?${sp.toString()}`);
  }
  return <ListingsPage searchParams={params} defaultTab="new" />;
}
