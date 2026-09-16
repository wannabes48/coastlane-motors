import Link from 'next/link';

const BRANDS = [
  { name: 'Toyota', url: '/used?make=Toyota' },
  { name: 'Nissan', url: '/used?make=Nissan' },
  { name: 'Mazda', url: '/used?make=Mazda' },
  { name: 'Subaru', url: '/used?make=Subaru' },
  { name: 'Mitsubishi', url: '/used?make=Mitsubishi' },
  { name: 'Honda', url: '/used?make=Honda' },
  { name: 'Isuzu', url: '/used?make=Isuzu' },
  { name: 'Mercedes', url: '/used?make=Mercedes-Benz' }
];

export function BrandRow() {
  return (
    <div className="py-12 text-center bg-sky">
      <h2 className="text-slate text-sm font-semibold mb-6">Popular car brands</h2>
      <div className="flex flex-wrap justify-center items-center gap-6 lg:gap-12 px-4 max-w-7xl mx-auto">
        {BRANDS.map(b => (
          <Link key={b.name} href={b.url} className="text-slate hover:text-azure font-sans font-bold text-xl lg:text-2xl transition-colors uppercase tracking-tight">
            {b.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
