import { Listings } from '@/components/listings';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Used Cars for Sale in Kenya',
  description: 'Browse verified used cars for sale in Kenya. Clear prices, full photos, duty paid.',
};

export const revalidate = 300;

export default function UsedPage({ searchParams }: { searchParams: Promise<any> }) {
  return <Listings searchParams={searchParams} condition="used" />;
}
