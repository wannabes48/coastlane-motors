import { ListingsPage } from '@/components/listings-page';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export async function generateMetadata({ searchParams }: { searchParams: Promise<any> }): Promise<Metadata> {
  const params = await searchParams;
  const page = Number(params.page ?? 1);
  const base = `${process.env.NEXT_PUBLIC_SITE_URL}/new`;

  return {
    title: 'New Cars for Sale in Kenya (2026) — Coastlane Motors',
    description: 'Buy new cars in Kenya with transparent KES pricing and full dealer support. Browse our new stock — Toyota, Mazda, Nissan and more. Call or WhatsApp Coastlane Motors today.',
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
