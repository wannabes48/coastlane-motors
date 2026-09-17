import { waLink } from '@/lib/whatsapp';

export function WhatsAppButton({ car, children, className = '' }: {
  car?: { year: number; make: string; model: string; slug: string; price_kes: number | null };
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <a
      href={waLink(car)}
      target="_blank"
      rel="noopener noreferrer"
      className={`bg-whatsapp text-ink font-semibold rounded-full px-6 py-3 inline-flex items-center justify-center gap-2 transition-opacity hover:opacity-90 ${className}`}
    >
      <img src="/whatsapp-icon.png" alt="WhatsApp" className="w-5 h-5 object-contain" />
      {children || 'WhatsApp us'}
    </a>
  );
}
