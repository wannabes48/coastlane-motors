'use client';

import Image from 'next/image';

type Props = {
  car: {
    slug: string;
    year: number;
    make: string;
    model: string;
    price_kes?: number | null;
  };
};

export function ShareButton({ car }: Props) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://coastlanemotors.co.ke';
  const shareUrl = `${siteUrl}/cars/${car.slug}`;
  const price = car.price_kes ? `KSh ${car.price_kes.toLocaleString()}` : '';
  const shareText = `Check out this ${car.year} ${car.make} ${car.model}${price ? ` at ${price}` : ''} — Coastlane Motors\n${shareUrl}`;

  return (
    <a
      href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center gap-2 h-[38px] bg-white border border-line rounded-[var(--radius)] font-sans text-[13px] font-semibold text-slate hover:border-ink hover:text-ink transition-colors"
      aria-label="Share this car on WhatsApp"
    >
      <Image src="/whatsapp-icon.png" alt="" width={15} height={15} className="object-contain opacity-80" />
      Share this car
    </a>
  );
}
