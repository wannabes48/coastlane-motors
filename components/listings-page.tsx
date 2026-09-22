import Link from 'next/link';
import Image from 'next/image';
import { listVehicles } from '@/lib/queries';
import { CarCard }    from '@/components/car-card';
import { FilterRail } from '@/components/filter-rail';
import { Pagination } from '@/components/pagination';
import { Search, ArrowRight } from 'lucide-react';

const BRANDS = [
  { name: 'Toyota',        logo: '/Toyota-Logo.png',     slug: 'toyota',        make: 'Toyota' },
  { name: 'Nissan',        logo: '/Nissan-logo.png',     slug: 'nissan',        make: 'Nissan' },
  { name: 'Mazda',         logo: '/Mazda-Logo.png',      slug: 'mazda',         make: 'Mazda' },
  { name: 'Subaru',        logo: '/Subaru-Logo.png',     slug: 'subaru',        make: 'Subaru' },
  { name: 'Mitsubishi',    logo: '/Mitsubishi-Logo.png', slug: 'mitsubishi',    make: 'Mitsubishi' },
  { name: 'Honda',         logo: '/Honda-Logo.png',      slug: 'honda',         make: 'Honda' },
  { name: 'Isuzu',         logo: '/Isuzu-Logo.png',      slug: 'isuzu',         make: 'Isuzu' },
  { name: 'Mercedes-Benz', logo: '/Mercedes-Logo.png',   slug: 'mercedes-benz', make: 'Mercedes Benz' },
  { name: 'BMW',           logo: '/BMW-Logo.png',        slug: 'bmw',           make: 'BMW' },
  { name: 'Audi',          logo: '/Audi-Logo.png',       slug: 'audi',          make: 'Audi' },
  { name: 'Suzuki',        logo: '/Suzuki-Logo.png',     slug: 'suzuki',        make: 'Suzuki' },
  { name: 'Lexus',         logo: '/Lexus-Logo.svg',      slug: 'lexus',         make: 'Lexus' },
  { name: 'Volkswagen',    logo: '/Volkswagen-Logo.png', slug: 'volkswagen',    make: 'Volkswagen' },
  { name: 'Ford',          logo: '/Ford-Logo.png',       slug: 'ford',          make: 'Ford' },
];

type Props = {
  searchParams: Record<string, string>;
  defaultTab: 'used' | 'new';
  basePath?: string;
};

export async function ListingsPage({
  searchParams,
  defaultTab,
  basePath = '/used',
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

  function tabHref(condition: 'used' | 'new') {
    const sp = new URLSearchParams(searchParams);
    sp.delete('page');
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

  const FILTER_KEYS = ['q', 'make', 'city', 'body', 'fuel', 'transmission', 'min', 'max'];
  const activeFilters = FILTER_KEYS.filter(k => searchParams[k]).length;

  // Build the search action URL — keeps all current params except q and page
  const searchBase = basePath;

  return (
    <main className="bg-sky min-h-screen">

      {/* ── Top bar: Search + Tabs ── */}
      <div className="bg-white border-b border-line sticky top-14 z-30">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-3">

          {/* Search bar */}
          <form method="GET" action={searchBase} className="relative">
            {/* carry non-search params forward as hidden inputs */}
            {['tab', 'make', 'city', 'body', 'fuel', 'transmission', 'min', 'max', 'sort'].map(k =>
              searchParams[k] ? <input key={k} type="hidden" name={k} value={searchParams[k]} /> : null
            )}
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate pointer-events-none" aria-hidden="true" />
            <input
              name="q"
              defaultValue={searchParams.q ?? ''}
              placeholder="Search make, model…"
              autoComplete="off"
              className="w-full h-10 pl-9 pr-4 bg-sky border border-line rounded-full font-sans text-[14px] text-ink placeholder:text-slate focus:outline-none focus-visible:ring-2 focus-visible:ring-azure focus:bg-white transition-colors"
            />
          </form>

          {/* Condition tabs */}
          <div className="flex items-center gap-1 bg-slate/10 rounded-lg p-1 w-fit">
            {(['used', 'new'] as const).map(cond => (
              <Link
                key={cond}
                href={tabHref(cond)}
                className={`h-8 px-5 rounded-md font-sans text-[13px] font-semibold transition-colors capitalize flex items-center
                  ${tab === cond ? 'bg-white text-ink shadow-sm' : 'text-slate hover:text-ink'}`}
              >
                {cond === 'used' ? 'Used' : 'New'}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4">

        {/* Search result heading + Back button */}
        <div className="flex items-center justify-between mb-3 min-h-[32px]">
          {searchParams.q ? (
            <p className="font-sans text-[13px] text-slate">
              Results for <span className="font-semibold text-ink">"{searchParams.q}"</span>
            </p>
            

          ) : <div />}

          {['/cars', '/used', '/new'].includes(basePath) && (
            <Link
              href="/"
              className="flex items-center gap-1.5 h-8 px-3 bg-white border border-line rounded-full font-sans text-[12px] font-semibold text-ink hover:border-azure transition-colors shrink-0 ml-auto"
            >
              <ArrowRight size={14} className="rotate-180 text-azure" aria-hidden="true" />
              Back to home
            </Link>
          )}
        </div>

        {/* ── Mobile filter + sort bar ── */}
        <div className="lg:hidden mb-4">
          <FilterRail tab={tab} basePath={basePath} />
        </div>

        {/* ── Brand pills (below filters, above grid) ── */}
        <div className="mb-5">
          <p className="font-sans text-[11px] font-semibold uppercase tracking-[1.5px] text-slate mb-2 hidden lg:block">Browse by brand</p>
          <div className="flex overflow-x-auto gap-3 pb-1 scrollbar-none">
            {BRANDS.map(b => {
              const isActive = searchParams.make === b.make;
              const sp = new URLSearchParams(searchParams);
              sp.delete('page');
              if (isActive) sp.delete('make');
              else sp.set('make', b.make);
              const href = isActive ? `${basePath}?${sp.toString()}` : `/used/${b.slug}`;
              return (
                <Link
                  key={b.slug}
                  href={href}
                  className={`shrink-0 flex flex-col items-center gap-1 px-3 py-2 rounded-xl border transition-colors ${
                    isActive
                      ? 'border-azure bg-azure/5'
                      : 'border-line bg-white hover:border-azure/50'
                  }`}
                >
                  <Image
                    src={b.logo}
                    alt={b.name}
                    width={36}
                    height={36}
                    className="object-contain"
                  />
                  <span className="font-sans text-[10px] font-semibold text-slate whitespace-nowrap">{b.name}</span>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="flex gap-6">
          {/* Desktop sidebar */}
          <div className="hidden lg:block w-64 shrink-0">
            <FilterRail tab={tab} basePath={basePath} />
          </div>

          {/* Results */}
          <div className="flex-1 min-w-0">
            {/* Count + clear */}
            <div className="flex items-center justify-between mb-4">
              <p className="font-sans text-[13px] text-slate">
                <span className="font-semibold text-ink">{total.toLocaleString()}</span>{' '}
                {tab} car{total !== 1 ? 's' : ''}
                {activeFilters > 0 && (
                  <span className="ml-1 text-azure">· {activeFilters} filter{activeFilters !== 1 ? 's' : ''} active</span>
                )}
              </p>
              {activeFilters > 0 && (
                <Link href={tabHref(tab)} className="font-sans text-[12px] font-semibold text-azure hover:underline">
                  Clear all
                </Link>
              )}
            </div>

            {vehicles.length > 0 ? (
              /* Mobile = 2-col, desktop = 3-col */
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-6">
                {vehicles.map((car, i) => (
                  <CarCard key={car.id} car={car} priority={i === 0} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 gap-3 bg-white rounded-[var(--radius-card)] shadow-[var(--shadow-card)] text-center px-4">
                <p className="font-sans text-[15px] font-semibold text-ink">
                  No {tab} cars match{searchParams.q ? ` "${searchParams.q}"` : ' these filters'}
                </p>
                <p className="font-sans text-[13px] text-slate">
                  {tab === 'used'
                    ? 'Try the New tab — there may be new stock that matches.'
                    : 'Try the Used tab for more options.'}
                </p>
                <Link
                  href={tabHref(tab === 'used' ? 'new' : 'used')}
                  className="mt-1 font-sans text-[13px] font-semibold text-azure border border-azure rounded-full px-6 py-2 hover:bg-sky transition-colors"
                >
                  Switch to {tab === 'used' ? 'new' : 'used'} cars
                </Link>
              </div>
            )}

            <Pagination page={page} pages={pages} total={total} buildHref={buildHref} />
          </div>
        </div>
      </div>
    </main>
  );
}
