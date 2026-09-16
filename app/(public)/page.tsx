import { HeroSearch } from '@/components/hero-search';
import { BrandRow } from '@/components/brand-row';
import { CategoryRail } from '@/components/category-rail';
import { CarCard } from '@/components/car-card';
import { listVehicles, getCategoryCounts } from '@/lib/queries';
import Link from 'next/link';

export default async function Home() {
  const { vehicles } = await listVehicles({ page: 1, sort: 'newest' });
  const featured = vehicles.slice(0, 4);

  const counts = await getCategoryCounts();

  return (
    <>
      <HeroSearch />
      <BrandRow />
      
      <div id="browse">
        <CategoryRail counts={counts} />
      </div>

      <section className="section bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-step-2 font-sans font-semibold text-ink">In stock now</h2>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex bg-sky rounded-[var(--radius-card)] p-1">
                <Link href="/used" className="px-4 py-1 text-sm font-semibold rounded hover:bg-white text-ink transition-colors">Used</Link>
                <Link href="/new" className="px-4 py-1 text-sm font-semibold rounded hover:bg-white text-ink transition-colors">New</Link>
              </div>
              <Link href="/used" className="text-azure font-semibold hover:text-azure-ink transition-colors group flex items-center">
                See all <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featured.length > 0 ? (
              featured.map(car => <CarCard key={car.id} car={car} />)
            ) : (
              <p className="text-slate col-span-full py-12 text-center bg-sky rounded-[var(--radius-card)]">No vehicles in stock yet.</p>
            )}
          </div>
        </div>
      </section>

      <section className="section bg-sky">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-step-2 font-sans font-semibold text-ink text-center mb-12">Why buy from Coastlane</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-[var(--radius-card)] shadow-[var(--shadow-card)]">
              <h3 className="font-sans font-bold text-lg mb-3">Clear, upfront pricing</h3>
              <p className="text-slate">Every car is priced in shillings, with duty fully paid. No hidden fees, no "contact for price" games. What you see is what you pay.</p>
            </div>
            <div className="bg-white p-8 rounded-[var(--radius-card)] shadow-[var(--shadow-card)]">
              <h3 className="font-sans font-bold text-lg mb-3">Verified condition</h3>
              <p className="text-slate">We inspect every vehicle before listing it. We take our own high-resolution photos so you can see exactly what you're buying.</p>
            </div>
            <div className="bg-white p-8 rounded-[var(--radius-card)] shadow-[var(--shadow-card)]">
              <h3 className="font-sans font-bold text-lg mb-3">East Africa delivery</h3>
              <p className="text-slate">Located in Mombasa, but we serve the entire region. We can arrange safe delivery to Nairobi, Kampala, Dar es Salaam and beyond.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-ink py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-step-2 font-sans font-semibold text-white mb-6">Not sure what fits your budget?</h2>
          <p className="text-white/80 mb-8 max-w-2xl mx-auto">Tell us what you're looking for and how much you want to spend. We'll send you options that match.</p>
          <a 
            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP}?text=Hi%20Coastlane%2C%20I%20need%20help%20finding%20a%20car%20within%20my%20budget.`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-whatsapp text-ink font-semibold rounded-full px-8 py-4 inline-flex items-center justify-center transition-opacity hover:opacity-90 text-lg"
          >
            WhatsApp us
          </a>
        </div>
      </section>
    </>
  );
}
