import { ListingsPage } from '@/components/listings-page';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export async function generateMetadata({ searchParams }: { searchParams: Promise<any> }): Promise<Metadata> {
  const params = await searchParams;
  const page = Number(params.page ?? 1);
  const base = `${process.env.NEXT_PUBLIC_SITE_URL}/used`;

  return {
    title: 'Used Cars for Sale in Kenya (2026) — Coastlane Motors',
    description: 'Browse used cars for sale in Kenya with clear KES prices, real photos and duty paid stock. Toyota, Mazda, Subaru and more. WhatsApp Coastlane Motors to view.',
    alternates: {
      canonical: page === 1 ? base : `${base}?page=${page}`,
    },
  };
}

export const revalidate = 300;

export default async function UsedPage({ searchParams }: { searchParams: Promise<any> }) {
  const params = await searchParams;
  if (params.tab === 'new') {
    const sp = new URLSearchParams(params);
    redirect(`/new?${sp.toString()}`);
  }
  return <ListingsPage searchParams={params} defaultTab="used" />;
}
