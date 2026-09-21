import Link from 'next/link';
import { listVehicles } from '@/lib/queries';
import { CarCard } from '@/components/car-card';

export async function InStock() {
  const { vehicles } = await listVehicles({ page: 1, sort: 'newest' });
  const featured = vehicles.slice(0, 6);

  return (
    <section className="bg-white py-14 px-4" aria-labelledby="instock-heading">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="font-[Poppins] text-[11px] font-semibold tracking-[3px] uppercase text-[#1479E0] mb-2">
              In stock now
            </p>
            <h2 id="instock-heading" className="font-[Poppins] text-[22px] sm:text-[26px] font-bold text-[#16293D] leading-tight">
              Latest arrivals
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex bg-[#E8F4FD] rounded-md p-1">
              <Link href="/used" className="px-4 py-1.5 text-[13px] font-[Poppins] font-semibold rounded hover:bg-white text-[#16293D] transition-colors">Used</Link>
              <Link href="/new" className="px-4 py-1.5 text-[13px] font-[Poppins] font-semibold rounded hover:bg-white text-[#16293D] transition-colors">New</Link>
            </div>
            <Link href="/used" className="text-[#1479E0] font-[Poppins] text-[13px] font-semibold hover:underline group flex items-center">
              See all <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
          {featured.length > 0 ? (
            featured.map((car, i) => <CarCard key={car.id} car={car} priority={i === 0} />)
          ) : (
            <p className="text-[#6B7D8F] font-[Poppins] text-[13px] col-span-full py-12 text-center bg-[#E8F4FD] rounded-lg">No vehicles in stock yet.</p>
          )}
        </div>
      </div>
    </section>
  );
}
