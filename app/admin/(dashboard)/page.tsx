import { supabaseServer } from '@/lib/supabase/server';
import Link from 'next/link';
import { fmtKES } from '@/lib/money';
import { Eye, ChevronDown, TrendingUp } from 'lucide-react';
import { ViewCount } from '@/components/view-count';

export const revalidate = 0;

export default async function DashboardPage(props: { searchParams: Promise<{ sort?: string }> }) {
  const searchParams = await props.searchParams;
  const sort = searchParams.sort;
  
  const supabase = await supabaseServer();
  
  const { data: vehicles } = await supabase
    .from('vehicles')
    .select('*')
    .order(sort === 'views' || sort === 'views_asc' ? 'views' : 'created_at', { ascending: sort === 'views_asc' });

  const { data: topCars } = await supabase
    .from('vehicles')
    .select('id, slug, make, model, year, views, status')
    .eq('status', 'published')
    .order('views', { ascending: false })
    .limit(5);
  
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-sans font-bold text-2xl text-ink">Inventory</h1>
        <Link href="/admin/cars/new" className="bg-azure text-white px-4 py-2 rounded-[var(--radius-card)] font-semibold hover:bg-azure-ink transition-colors">
          + Add Vehicle
        </Link>
      </div>

      {topCars && topCars.length > 0 && (
        <section className="bg-white rounded-[var(--radius-card)] shadow-[var(--shadow-card)] p-6 mb-8 border border-line">
          <h2 className="font-sans font-semibold text-ink mb-4 flex items-center gap-2">
            <TrendingUp size={20} className="text-azure" aria-hidden="true" />
            Most viewed
          </h2>
          <ol className="flex flex-col gap-3">
            {topCars.map((car, i) => (
              <li key={car.id} className="flex items-center justify-between gap-4 py-2 border-b border-line last:border-0 last:pb-0">
                <div className="flex items-center gap-4 min-w-0">
                  <span className="text-slate font-medium w-4 shrink-0">{i + 1}.</span>
                  <span className="text-ink font-medium truncate">
                    {car.year} {car.make} {car.model}
                  </span>
                </div>
                <ViewCount count={car.views} className="shrink-0" />
              </li>
            ))}
          </ol>
        </section>
      )}

      <div className="bg-white rounded-[var(--radius-card)] shadow-[var(--shadow-card)] overflow-hidden overflow-x-auto border border-line">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-sky border-b border-line text-slate text-sm">
              <th className="p-4 font-semibold">Vehicle</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold">Price</th>
              <th className="p-4 font-semibold">
                <Link href={`?sort=${sort === 'views' ? 'views_asc' : 'views'}`} className="flex items-center gap-1 hover:text-ink w-fit p-1 -m-1 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-azure">
                  <Eye size={16} aria-hidden="true" className="text-slate" />
                  Views
                  <ChevronDown size={14} aria-hidden="true" className={sort === 'views' ? 'rotate-180 transition-transform' : 'transition-transform'} />
                </Link>
              </th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {vehicles?.map(v => (
              <tr key={v.id} className="border-b border-line hover:bg-slate/5 transition-colors">
                <td className="p-4">
                  <div className="font-semibold text-ink">{v.year} {v.make} {v.model} {v.trim}</div>
                  <div className="text-xs text-slate mt-1">{v.condition} · {v.slug}</div>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    v.status === 'published' ? 'bg-green-100 text-green-800' :
                    v.status === 'sold' ? 'bg-ink text-white' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {v.status}
                  </span>
                </td>
                <td className="p-4 text-ink font-medium">{fmtKES(v.price_kes)}</td>
                <td className="p-4">
                  <ViewCount count={v.views} />
                </td>
                <td className="p-4 text-right">
                  <Link href={`/admin/cars/${v.id}/edit`} className="text-azure hover:underline text-sm mr-4 p-1 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-azure">Edit</Link>
                  <a href={`/cars/${v.slug}`} target="_blank" className="text-slate hover:underline text-sm p-1 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-azure">View</a>
                </td>
              </tr>
            ))}
            {!vehicles?.length && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate">No vehicles found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
