// components/whatsapp-icon.tsx
// Reusable WhatsApp icon wrapper that renders the custom PNG at the given size.
// Drop-in replacement for Lucide's MessageCircle wherever WhatsApp branding is needed.

import Image from 'next/image';

type Props = {
  size?: number;
  className?: string;
};

export function WhatsAppIcon({ size = 20, className = '' }: Props) {
  return (
    <Image
      src="/whatsapp-icon.png"
      alt=""
      width={size}
      height={size}
      className={`object-contain ${className}`}
      aria-hidden="true"
    />
  );
}
