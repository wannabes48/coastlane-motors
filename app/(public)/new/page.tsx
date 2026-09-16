import { Listings } from '@/components/listings';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'New Cars for Sale in Kenya',
  description: 'Browse verified new cars for sale in Kenya. Clear prices, full photos, duty paid.',
};

export const revalidate = 300;

export default function NewPage({ searchParams }: { searchParams: Promise<any> }) {
  return <Listings searchParams={searchParams} condition="new" />;
}
