import Link from 'next/link';

const BRANDS = [
  { name: 'Toyota', logo: '/Toyota-Logo.png', url: '/used?make=Toyota' },
  { name: 'Nissan', logo: '/Nissan-Logo.png', url: '/used?make=Nissan' },
  { name: 'Mazda', logo: '/Mazda-Logo.png', url: '/used?make=Mazda' },
  { name: 'Subaru', logo: '/Subaru-Logo.png', url: '/used?make=Subaru' },
  { name: 'Mitsubishi', logo: '/Mitsubishi-Logo.png', url: '/used?make=Mitsubishi' },
  { name: 'Honda', logo: '/Honda-Logo.png', url: '/used?make=Honda' },
  { name: 'Isuzu', logo: '/Isuzu-Logo.png', url: '/used?make=Isuzu' },
  { name: 'Mercedes-Benz', logo: '/Mercedes-Logo.png', url: '/used?make=Mercedes-Benz' }
];

export function BrandRow() {
  return (
    <div className="py-8 md:py-12 text-center bg-sky overflow-hidden">
      <h2 className="text-slate text-sm font-semibold mb-6">Popular car brands</h2>
      {/* Scrollable horizontally on mobile, fits in one line on desktop */}
      <div className="flex flex-nowrap overflow-x-auto scrollbar-none justify-start lg:justify-center items-center gap-6 md:gap-8 lg:gap-12 px-4 max-w-7xl mx-auto pb-4">
        {BRANDS.map(b => (
          <Link key={b.url} href={b.url} className="shrink-0 flex items-center justify-center">
            <img src={b.logo} alt={b.name} className="w-16 md:w-20 lg:w-[100px] h-16 md:h-20 lg:h-[100px] object-contain" />
          </Link>
        ))}
      </div>
    </div>
  );
}
