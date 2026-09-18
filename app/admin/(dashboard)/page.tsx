import Link from 'next/link';
import { supabaseServer } from '@/lib/supabase/server';
import { fmtKES } from '@/lib/money';
import { FeaturedToggle } from '@/components/admin/featured-toggle';
import { ViewCount } from '@/components/view-count';
import { Plus, TrendingUp, Eye, Car, Tag } from 'lucide-react';

export const dynamic = 'force-dynamic';

type SortField = 'updated_at' | 'views' | 'price_kes' | 'created_at';

export default async function AdminDashboard({
  searchParams,
}: {
  searchParams: Promise<{ sort?: SortField; status?: string; q?: string }>;
}) {
  const { sort = 'updated_at', status, q } = await searchParams;
  const supabase = await supabaseServer();

  // ── summary counts ────────────────────────────────────────────────────────
  const [{ count: published }, { count: draft }, { count: sold }] = await Promise.all([
    supabase.from('vehicles').select('*', { count: 'exact', head: true }).eq('status', 'published'),
    supabase.from('vehicles').select('*', { count: 'exact', head: true }).eq('status', 'draft'),
    supabase.from('vehicles').select('*', { count: 'exact', head: true }).eq('status', 'sold'),
  ]);

  // ── most viewed (top 5 published) ─────────────────────────────────────────
  const { data: topCars } = await supabase
    .from('vehicles')
    .select('id, slug, make, model, year, views')
    .eq('status', 'published')
    .order('views', { ascending: false })
    .limit(5);

  // ── vehicle table ──────────────────────────────────────────────────────────
  let query = supabase
    .from('vehicles')
    .select('id, slug, make, model, year, price_kes, condition, status, featured, views, updated_at');

  if (status) query = query.eq('status', status);
  if (q)      query = query.ilike('search_text', `%${q.toLowerCase()}%`);

  query = query.order(sort, { ascending: sort === 'price_kes' });

  const { data: vehicles } = await query;

  const STATUS_COLOURS: Record<string, string> = {
    published: 'bg-[#E1F5EE] text-[#0F6E56]',
    draft:     'bg-[#E8F4FD] text-[#1479E0]',
    sold:      'bg-[#E8E8E8] text-[#5C6B72]',
  };

  const sortLink = (field: SortField) => {
    const p = new URLSearchParams({ sort: field });
    if (status) p.set('status', status);
    if (q) p.set('q', q);
    return `?${p.toString()}`;
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">

      {/* ── page header ── */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-[Poppins] text-[20px] font-bold text-[#16293D]">Dashboard</h1>
        <Link
          href="/admin/cars/new"
          className="flex items-center gap-2 h-10 px-4 bg-[#1479E0] hover:bg-[#0F5CAD]
                     rounded font-[Poppins] text-[13px] font-semibold text-white
                     transition-colors"
        >
          <Plus size={16} aria-hidden="true" />
          Add car
        </Link>
      </div>

      {/* ── summary cards ── */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: 'Published', value: published ?? 0, icon: Car,   colour: 'text-[#0F6E56]' },
          { label: 'Drafts',    value: draft     ?? 0, icon: Tag,   colour: 'text-[#1479E0]' },
          { label: 'Sold',      value: sold      ?? 0, icon: Eye,   colour: 'text-[#6B7D8F]' },
        ].map(({ label, value, icon: Icon, colour }) => (
          <div key={label} className="bg-[#E8F4FD] rounded-lg p-4">
            <p className="font-[Poppins] text-[11px] text-[#6B7D8F] mb-1 flex items-center gap-1">
              <Icon size={13} aria-hidden="true" className={colour} />
              {label}
            </p>
            <p className="font-[Poppins] text-[26px] font-bold text-[#16293D] leading-none">
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* ── most viewed ── */}
      {topCars && topCars.length > 0 && (
        <div className="bg-white border border-[#DCE9F2] rounded-lg p-4 mb-6">
          <h2 className="font-[Poppins] text-[14px] font-semibold text-[#16293D] mb-3
                         flex items-center gap-2">
            <TrendingUp size={16} aria-hidden="true" className="text-[#1479E0]" />
            Most viewed
          </h2>
          <ol className="flex flex-col gap-2">
            {topCars.map((car, i) => (
              <li key={car.id} className="flex items-center gap-3">
                <span className="font-[Poppins] text-[12px] text-[#6B7D8F] w-4 shrink-0">
                  {i + 1}.
                </span>
                <Link
                  href={`/admin/cars/${car.id}/edit`}
                  className="flex-1 font-[Poppins] text-[13px] font-medium text-[#16293D]
                             truncate hover:text-[#1479E0] transition-colors"
                >
                  {car.year} {car.make} {car.model}
                </Link>
                <ViewCount count={car.views} />
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* ── filters ── */}
      <form method="GET" className="flex gap-2 mb-4 flex-wrap">
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Search cars…"
          className="h-10 px-3 text-[14px] font-[Poppins] border border-[#DCE9F2]
                     rounded bg-white text-[#16293D] flex-1 min-w-[160px]
                     focus:outline-none focus:border-[#1479E0]"
        />
        <select
          name="status"
          defaultValue={status ?? ''}
          className="h-10 px-3 text-[13px] font-[Poppins] border border-[#DCE9F2]
                     rounded bg-white text-[#16293D]
                     focus:outline-none focus:border-[#1479E0]"
        >
          <option value="">All statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="sold">Sold</option>
        </select>
        <button
          type="submit"
          className="h-10 px-4 bg-[#1479E0] text-white font-[Poppins] text-[13px]
                     font-semibold rounded hover:bg-[#0F5CAD] transition-colors"
        >
          Filter
        </button>
        {(q || status) && (
          <Link
            href="/admin"
            className="h-10 px-4 border border-[#DCE9F2] text-[#6B7D8F]
                       font-[Poppins] text-[13px] rounded flex items-center
                       hover:border-[#1479E0] transition-colors"
          >
            Clear
          </Link>
        )}
      </form>

      {/* ── vehicle table ── */}
      <div className="bg-white border border-[#DCE9F2] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm" style={{ tableLayout: 'fixed', minWidth: '680px' }}>
            <colgroup>
              <col style={{ width: '28%' }} />
              <col style={{ width: '14%' }} />
              <col style={{ width: '10%' }} />
              <col style={{ width: '10%' }} />
              <col style={{ width: '14%' }} />
              <col style={{ width: '24%' }} />
            </colgroup>
            <thead>
              <tr className="border-b border-[#DCE9F2] bg-[#FBFBF9]">
                {[
                  { label: 'Car',    field: null           },
                  { label: 'Price',  field: 'price_kes' as SortField },
                  { label: 'Type',   field: null           },
                  { label: 'Status', field: null           },
                  { label: 'Views',  field: 'views' as SortField     },
                  { label: 'Actions', field: null          },
                ].map(({ label, field }) => (
                  <th
                    key={label}
                    className="py-3 px-4 text-left font-[Poppins] text-[11px]
                               font-semibold text-[#6B7D8F] uppercase tracking-wide"
                  >
                    {field ? (
                      <Link
                        href={sortLink(field)}
                        className="hover:text-[#16293D] transition-colors"
                      >
                        {label} ↕
                      </Link>
                    ) : label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {vehicles?.map((v) => (
                <tr
                  key={v.id}
                  className="border-b border-[#DCE9F2] last:border-0 hover:bg-[#FBFBF9]"
                >
                  {/* car name */}
                  <td className="py-3 px-4">
                    <Link
                      href={`/admin/cars/${v.id}/edit`}
                      className="font-[Poppins] text-[13px] font-semibold text-[#16293D]
                                 hover:text-[#1479E0] transition-colors truncate block"
                    >
                      {v.year} {v.make} {v.model}
                    </Link>
                  </td>

                  {/* price */}
                  <td className="py-3 px-4 font-[Poppins] text-[13px] text-[#6B7D8F]">
                    {fmtKES(v.price_kes)}
                  </td>

                  {/* condition */}
                  <td className="py-3 px-4">
                    <span className="font-[Poppins] text-[11px] font-medium text-[#6B7D8F] capitalize">
                      {v.condition}
                    </span>
                  </td>

                  {/* status badge */}
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[11px]
                                  font-[Poppins] font-semibold capitalize
                                  ${STATUS_COLOURS[v.status] ?? ''}`}
                    >
                      {v.status}
                    </span>
                  </td>

                  {/* views */}
                  <td className="py-3 px-4">
                    <ViewCount count={v.views} />
                  </td>

                  {/* actions */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Link
                        href={`/admin/cars/${v.id}/edit`}
                        className="h-8 px-3 border border-[#DCE9F2] rounded
                                   font-[Poppins] text-[12px] text-[#16293D]
                                   hover:border-[#1479E0] transition-colors
                                   flex items-center"
                      >
                        Edit
                      </Link>

                      {/* ★ featured toggle — the staff pick button */}
                      {v.status === 'published' && (
                        <FeaturedToggle
                          vehicleId={v.id}
                          featured={v.featured}
                          label={`${v.year} ${v.make} ${v.model}`}
                        />
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {vehicles?.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="py-12 text-center font-[Poppins] text-[13px] text-[#6B7D8F]"
                  >
                    No cars match these filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
