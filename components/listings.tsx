import { listVehicles, Filters } from '@/lib/queries';
import { CarCard } from '@/components/car-card';
import { FilterRail } from '@/components/filter-rail';

export async function Listings({ searchParams, condition }: { searchParams: Promise<any>, condition: 'used' | 'new' }) {
  const params = await searchParams;
  
  const f: Filters = {
    condition,
    q: params.q,
    make: params.make,
    city: params.city,
    body: params.body,
    transmission: params.transmission,
    sort: params.sort as Filters['sort'],
    page: params.page ? parseInt(params.page) : 1
  };

  const { vehicles, total, pages } = await listVehicles(f);

  return (
    <div className="bg-sky min-h-[calc(100vh-72px)] py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="font-sans font-bold text-step-2 text-ink uppercase tracking-tight">
            {condition === 'used' ? 'Used Cars for Sale' : 'New Cars for Sale'}
          </h1>
          <p className="text-slate mt-2">{total} cars available</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="w-full lg:w-64 shrink-0">
             <FilterRail />
          </aside>
          
          <main className="flex-1">
            {vehicles.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {vehicles.map(car => <CarCard key={car.id} car={car} />)}
              </div>
            ) : (
              <div className="bg-white p-12 text-center rounded-[var(--radius-card)] shadow-[var(--shadow-card)]">
                <h3 className="font-sans font-semibold text-xl text-ink mb-2">No cars match these filters.</h3>
                <p className="text-slate">Clear some filters or try a different search to see more results.</p>
              </div>
            )}
            
            {pages > 1 && (
               <div className="mt-12 flex justify-center items-center gap-4">
                 <p className="text-slate font-semibold">Page {f.page} of {pages}</p>
               </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
