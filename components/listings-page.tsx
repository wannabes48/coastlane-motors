import Link from 'next/link';
import { listVehicles } from '@/lib/queries';
import { CarCard }      from '@/components/car-card';
import { FilterRail }   from '@/components/filter-rail';
import { Pagination }   from '@/components/pagination';

type Props = {
  searchParams: Record<string, string>;
  defaultTab: 'used' | 'new';
  basePath?: '/used' | '/new' | '/cars';
};

export async function ListingsPage({
  searchParams,
  defaultTab,
  basePath = '/used'
}: Props) {
  const tab  = (searchParams.tab as 'used' | 'new') ?? defaultTab;
  const page = Math.max(1, Number(searchParams.page ?? 1));

  const filters = {
    condition:    tab,
    q:            searchParams.q,
    make:         searchParams.make,
    city:         searchParams.city,
    body:         searchParams.body,
    fuel:         searchParams.fuel,
    transmission: searchParams.transmission,
    min:          searchParams.min ? Number(searchParams.min) : undefined,
    max:          searchParams.max ? Number(searchParams.max) : undefined,
    sort:         searchParams.sort as any,
    page,
  };

  const { vehicles, total, pages } = await listVehicles(filters);

  // preserve all filters when switching tabs — only condition changes
  function tabHref(condition: 'used' | 'new') {
    const sp = new URLSearchParams(searchParams);
    sp.delete('page');          // reset to page 1 on tab switch
    sp.set('tab', condition);
    if (basePath === '/cars') return `/cars?${sp.toString()}`;
    return condition === 'used' ? `/used?${sp.toString()}` : `/new?${sp.toString()}`;
  }

  function buildHref(p: number) {
    const sp = new URLSearchParams(searchParams);
    sp.set('tab', tab);
    if (p === 1) sp.delete('page');
    else         sp.set('page', String(p));
    return `${basePath}?${sp.toString()}`;
  }

  // count of active filters (excluding tab and page)
  const FILTER_KEYS = ['q','make','city','body','fuel','transmission','min','max'];
  const activeFilters = FILTER_KEYS.filter(k => searchParams[k]).length;

  return (
    <main className="bg-sky min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-6">

        {/* search query heading — only on /cars */}
        {searchParams.q && (
          <div className="mb-4">
            <p className="font-sans text-[13px] text-slate">
              Results for{' '}
              <span className="font-semibold text-ink">
                "{searchParams.q}"
              </span>
            </p>
          </div>
        )}

        {/* ── condition tabs ── */}
        <div className="flex items-center gap-1 mb-6
                        bg-slate/20 rounded-[var(--radius)] p-1 w-fit">
          {(['used', 'new'] as const).map((cond) => (
            <Link
              key={cond}
              href={tabHref(cond)}
              className={`h-9 px-6 rounded-[var(--radius)] font-sans text-[13px] font-semibold
                          transition-colors capitalize flex items-center justify-center
                          ${tab === cond
                            ? 'bg-white text-ink shadow-sm'
                            : 'text-slate hover:text-ink'
                          }`}
            >
              {cond === 'used' ? 'Used cars' : 'New cars'}
            </Link>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* ── filter rail ── */}
          <aside className="w-full lg:w-64 shrink-0">
            <FilterRail tab={tab} basePath={basePath} />
          </aside>

          {/* ── results ── */}
          <div className="flex-1 min-w-0">

            {/* result count + active filter count */}
            <div className="flex items-center justify-between mb-4">
              <p className="font-sans text-[13px] text-slate">
                <span className="font-semibold text-ink">
                  {total.toLocaleString()}
                </span>{' '}
                {tab} car{total !== 1 ? 's' : ''}
                {activeFilters > 0 && (
                  <span className="ml-1 text-azure">
                    · {activeFilters} filter{activeFilters !== 1 ? 's' : ''} active
                  </span>
                )}
              </p>

              {/* clear all filters — keeps tab, clears everything else */}
              {activeFilters > 0 && (
                <Link
                  href={tabHref(tab)}
                  className="font-sans text-[12px] font-semibold
                             text-azure hover:underline"
                >
                  Clear all filters
                </Link>
              )}
            </div>

            {vehicles.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {vehicles.map((car) => (
                  <CarCard key={car.id} car={car} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 gap-3 bg-white rounded-[var(--radius-card)] shadow-[var(--shadow-card)] text-center">
                <p className="font-sans text-[15px] font-semibold text-ink">
                  No {tab} cars match
                  {searchParams.q ? ` "${searchParams.q}"` : ' these filters'}
                </p>
                <p className="font-sans text-[13px] text-slate">
                  {tab === 'used'
                    ? 'Try the New cars tab — there may be new stock that matches.'
                    : 'Try the Used cars tab for more options.'}
                </p>
                <Link
                  href={tabHref(tab === 'used' ? 'new' : 'used')}
                  className="mt-2 font-sans text-[13px] font-semibold
                             text-azure border border-azure rounded-full
                             px-6 py-2 hover:bg-sky transition-colors"
                >
                  Switch to {tab === 'used' ? 'new' : 'used'} cars
                </Link>
              </div>
            )}

            <Pagination
              page={page}
              pages={pages}
              total={total}
              buildHref={buildHref}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
