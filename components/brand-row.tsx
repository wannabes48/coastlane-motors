import { LogoMarquee } from '@/components/ui/logo-marquee';

const BRANDS = [
  { alt: 'Toyota',        src: '/Toyota-Logo.png',        href: '/used/toyota' },
  { alt: 'Nissan',        src: '/Nissan-logo.png',        href: '/used/nissan' },
  { alt: 'Mazda',         src: '/Mazda-Logo.png',         href: '/used/mazda' },
  { alt: 'Subaru',        src: '/Subaru-Logo.png',        href: '/used/subaru' },
  { alt: 'Mitsubishi',    src: '/Mitsubishi-Logo.png',    href: '/used/mitsubishi' },
  { alt: 'Honda',         src: '/Honda-Logo.png',         href: '/used/honda' },
  { alt: 'Isuzu',         src: '/Isuzu-Logo.png',         href: '/used/isuzu' },
  { alt: 'Mercedes-Benz', src: '/Mercedes-Logo.png',      href: '/used/mercedes-benz' },
  { alt: 'BMW',           src: '/BMW-Logo.png',           href: '/used/bmw' },
  { alt: 'Audi',          src: '/Audi-Logo.png',          href: '/used/audi' },
  { alt: 'Suzuki',        src: '/Suzuki-Logo.png',        href: '/used/suzuki' },
  { alt: 'Lexus',         src: '/Lexus-Logo.png',         href: '/used/lexus' },
  { alt: 'Volkswagen',    src: '/Volkswagen-Logo.png',    href: '/used/volkswagen' },
  { alt: 'Ford',          src: '/Ford-Logo.png',          href: '/used/ford' },
];

export function BrandRow() {
  return (
    <div className="py-8 md:py-10 bg-sky">
      <h2 className="text-center font-sans text-[11px] font-semibold tracking-[3px] uppercase text-slate mb-5">
        Popular car brands
      </h2>
      <LogoMarquee logos={BRANDS} />
    </div>
  );
}
