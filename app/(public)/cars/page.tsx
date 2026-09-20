import { ListingsPage } from '@/components/listings-page';
import type { Metadata } from 'next';

type Props = { searchParams: Promise<Record<string, string>> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;
  const q = params.q;
  return {
    title: q
      ? `Search results for "${q}" — Coastlane Motors`
      : 'All cars — Coastlane Motors',
    robots: { index: false, follow: true },
  };
}

export default async function CarsSearchPage({ searchParams }: Props) {
  const params = await searchParams;
  const defaultTab = (params.tab as 'used' | 'new') ?? 'used';
  return <ListingsPage searchParams={params} defaultTab={defaultTab} basePath="/cars" />;
}
