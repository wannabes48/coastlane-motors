// app/admin/(dashboard)/page.tsx — updated with multi-admin info + activity log

import Link           from 'next/link';
import { supabaseServer }  from '@/lib/supabase/server';
import { supabaseAdmin }   from '@/lib/supabase/admin';
import { fmtKES }     from '@/lib/money';
import { FeaturedToggle }  from '@/components/admin/featured-toggle';
import { DeleteVehicleButton } from '@/components/admin/delete-vehicle';
import { ViewCount }  from '@/components/view-count';
import { ActivityLog } from '@/components/admin/activity-log';
import { Plus, TrendingUp, Car, Tag, Eye, Users } from 'lucide-react';

export const dynamic = 'force-dynamic';

type SortField = 'updated_at' | 'views' | 'price_kes' | 'created_at';

export default async function AdminDashboard({
  searchParams,
}: {
  searchParams: Promise<{ sort?: SortField; status?: string; q?: string }>;
}) {
  const { sort = 'updated_at', status, q } = await searchParams;

  // get current admin for context
  const supabase = await supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: me } = await supabaseAdmin
    .from('admin_users')
    .select('display_name, role, whatsapp')
    .eq('user_id', user!.id)
    .maybeSingle();

  // ── summary counts ──────────────────────────────────────────────────────────
  const [{ count: published }, { count: draft }, { count: sold }] = await Promise.all([
    supabaseAdmin.from('vehicles').select('*', { count: 'exact', head: true }).eq('status', 'published'),
    supabaseAdmin.from('vehicles').select('*', { count: 'exact', head: true }).eq('status', 'draft'),
    supabaseAdmin.from('vehicles').select('*', { count: 'exact', head: true }).eq('status', 'sold'),
  ]);

  // ── most viewed ──────────────────────────────────────────────────────────────
  const { data: topCars } = await supabaseAdmin
    .from('vehicles_with_admins')
    .select('id, slug, make, model, year, views, created_by_name, created_by_color')
    .eq('status', 'published')
    .order('views', { ascending: false })
    .limit(5);

  // ── vehicle table ────────────────────────────────────────────────────────────
  let query = supabaseAdmin
    .from('vehicles_with_admins')
    .select(`
      id, slug, make, model, year, price_kes, condition,
      status, featured, views, updated_at,
      created_by_name, created_by_color,
      updated_by_name, updated_by_color
    `);

  if (status) query = query.eq('status', status);
  if (q)      query = query.ilike('search_text', `%${q.toLowerCase()}%`);
  query = query.order(sort, { ascending: sort === 'price_kes' });

  const { data: vehicles } = await query;

  const STATUS_COLOURS: Record<string, string> = {
    published: 'bg-[#ECFDF5] text-[#065F46]',
    draft:     'bg-[#E3EEFF] text-[#1565C0]',
    sold:      'bg-[#F1F5F9] text-[#64748B]',
  };

  function sortLink(field: SortField) {
    const p = new URLSearchParams({ sort: field });
    if (status) p.set('status', status);
    if (q) p.set('q', q);
    return `?${p.toString()}`;
  }

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">

      {/* ── header ── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-[Poppins] text-[20px] font-bold text-[#0F1923]">
            Dashboard
          </h1>
          <p className="font-[Poppins] text-[12px] text-[#64748B] mt-0.5">
            Signed in as <span className="font-semibold text-[#0F1923]">{me?.display_name}</span>
            {!me?.whatsapp && (
              <span className="ml-2 text-amber-600 font-medium">
                ⚠ Set your WhatsApp in{' '}
                <Link href="/admin/settings" className="underline">settings</Link>
                {' '}so inquiries reach you.
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {me?.role === 'owner' && (
            <Link href="/admin/admins"
                  className="flex items-center gap-2 h-9 px-3 border border-[#E2E8F0]
                             rounded-lg font-[Poppins] text-[12px] font-medium
                             text-[#0F1923] hover:border-[#1565C0] transition-colors">
              <Users size={14} aria-hidden="true" className="text-[#1565C0]" />
              Team
            </Link>
          )}
          <Link href="/admin/cars/new"
                className="flex items-center gap-2 h-9 px-4 bg-[#1565C0]
                           hover:bg-[#0D47A1] rounded-lg font-[Poppins] text-[12px]
                           font-semibold text-white transition-colors">
            <Plus size={15} aria-hidden="true" />
            Add car
          </Link>
        </div>
      </div>

      {/* ── summary cards ── */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: 'Published', value: published ?? 0, icon: Car,  colour: 'text-[#065F46]' },
          { label: 'Drafts',    value: draft     ?? 0, icon: Tag,  colour: 'text-[#1565C0]' },
          { label: 'Sold',      value: sold      ?? 0, icon: Eye,  colour: 'text-[#64748B]' },
        ].map(({ label, value, icon: Icon, colour }) => (
          <div key={label} className="bg-white border border-[#E2E8F0] rounded-xl p-4">
            <p className="font-[Poppins] text-[11px] text-[#64748B] mb-1 flex items-center gap-1">
              <Icon size={12} aria-hidden="true" className={colour} />
              {label}
            </p>
            <p className="font-[Poppins] text-[26px] font-bold text-[#0F1923] leading-none">
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* ── most viewed ── */}
      {(topCars?.length ?? 0) > 0 && (
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 mb-6">
          <h2 className="font-[Poppins] text-[13px] font-bold text-[#0F1923] mb-3
                         flex items-center gap-2">
            <TrendingUp size={15} aria-hidden="true" className="text-[#1565C0]" />
            Most viewed
          </h2>
          <ol className="flex flex-col gap-2">
            {topCars!.map((car, i) => (
              <li key={car.id} className="flex items-center gap-3">
                <span className="font-[Poppins] text-[11px] text-[#94A3B8] w-4 shrink-0">
                  {i + 1}.
                </span>
                <Link href={`/admin/cars/${car.id}/edit`}
                      className="flex-1 font-[Poppins] text-[12px] font-medium
                                 text-[#0F1923] truncate hover:text-[#1565C0] transition-colors">
                  {car.year} {car.make} {car.model}
                </Link>
                {car.created_by_name && (
                  <span className="font-[Poppins] text-[10px] text-[#94A3B8] shrink-0">
                    by {car.created_by_name}
                  </span>
                )}
                <ViewCount count={car.views} />
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* ── filters ── */}
      <form method="GET" className="flex gap-2 mb-4 flex-wrap">
        <input type="search" name="q" defaultValue={q}
               placeholder="Search cars…"
               className="h-10 px-3 text-[13px] font-[Poppins] border border-[#E2E8F0]
                          rounded-lg bg-white text-[#0F1923] flex-1 min-w-[160px]
                          focus:outline-none focus:border-[#1565C0]" />
        <select name="status" defaultValue={status ?? ''}
                className="h-10 px-3 text-[12px] font-[Poppins] border border-[#E2E8F0]
                           rounded-lg bg-white text-[#0F1923]
                           focus:outline-none focus:border-[#1565C0]">
          <option value="">All statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="sold">Sold</option>
        </select>
        <button type="submit"
                className="h-10 px-4 bg-[#1565C0] text-white font-[Poppins]
                           text-[12px] font-semibold rounded-lg hover:bg-[#0D47A1]">
          Filter
        </button>
        {(q || status) && (
          <Link href="/admin"
                className="h-10 px-4 border border-[#E2E8F0] text-[#64748B]
                           font-[Poppins] text-[12px] rounded-lg flex items-center
                           hover:border-[#1565C0]">
            Clear
          </Link>
        )}
      </form>

      {/* ── vehicle table ── */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden mb-8">
        <div className="overflow-x-auto">
          <table className="w-full text-sm" style={{ tableLayout: 'fixed', minWidth: '820px' }}>
            <colgroup>
              <col style={{ width: '22%' }} />
              <col style={{ width: '11%' }} />
              <col style={{ width: '8%' }}  />
              <col style={{ width: '9%' }}  />
              <col style={{ width: '8%' }}  />
              <col style={{ width: '16%' }} /> 
              <col style={{ width: '16%' }} /> 
              <col style={{ width: '10%' }} />
            </colgroup>
            <thead>
              <tr className="border-b border-[#E2E8F0] bg-[#FAFAFA]">
                {[
                  { label: 'Car',         field: null             },
                  { label: 'Price',       field: 'price_kes' as SortField },
                  { label: 'Type',        field: null             },
                  { label: 'Status',      field: null             },
                  { label: 'Views',       field: 'views' as SortField     },
                  { label: 'Posted by',   field: null             },
                  { label: 'Last edited', field: 'updated_at' as SortField },
                  { label: 'Actions',     field: null             },
                ].map(({ label, field }) => (
                  <th key={label}
                      className="py-3 px-3 text-left font-[Poppins] text-[10px]
                                 font-semibold text-[#64748B] uppercase tracking-wide">
                    {field
                      ? <Link href={sortLink(field)} className="hover:text-[#0F1923]">{label} ↕</Link>
                      : label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {vehicles?.map((v) => {
                const label = `${v.year} ${v.make} ${v.model}`;
                return (
                  <tr key={v.id}
                      className="border-b border-[#E2E8F0] last:border-0 hover:bg-[#FAFAFA]">

                    {/* car name */}
                    <td className="py-3 px-3">
                      <Link href={`/admin/cars/${v.id}/edit`}
                            className="font-[Poppins] text-[12px] font-semibold
                                       text-[#0F1923] hover:text-[#1565C0] truncate block">
                        {label}
                      </Link>
                    </td>

                    {/* price */}
                    <td className="py-3 px-3 font-[Poppins] text-[12px] text-[#64748B]">
                      {fmtKES(v.price_kes)}
                    </td>

                    {/* condition */}
                    <td className="py-3 px-3 font-[Poppins] text-[11px] text-[#64748B] capitalize">
                      {v.condition}
                    </td>

                    {/* status */}
                    <td className="py-3 px-3">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px]
                                        font-[Poppins] font-semibold capitalize
                                        ${STATUS_COLOURS[v.status] ?? ''}`}>
                        {v.status}
                      </span>
                    </td>

                    {/* views */}
                    <td className="py-3 px-3">
                      <ViewCount count={v.views} />
                    </td>

                    {/* ── POSTED BY ── */}
                    <td className="py-3 px-3">
                      {v.created_by_name ? (
                        <div className="flex items-center gap-1.5">
                          <div className="w-5 h-5 rounded-full flex items-center justify-center
                                          font-[Poppins] text-[9px] font-bold text-white shrink-0"
                               style={{ background: v.created_by_color ?? '#1565C0' }}
                               aria-hidden="true">
                            {v.created_by_name.slice(0, 2).toUpperCase()}
                          </div>
                          <span className="font-[Poppins] text-[11px] text-[#0F1923] truncate">
                            {v.created_by_name}
                          </span>
                        </div>
                      ) : (
                        <span className="font-[Poppins] text-[11px] text-[#94A3B8]">—</span>
                      )}
                    </td>

                    {/* ── LAST EDITED ── */}
                    <td className="py-3 px-3">
                      {v.updated_by_name ? (
                        <div>
                          <div className="flex items-center gap-1.5">
                            <div className="w-5 h-5 rounded-full flex items-center justify-center
                                            font-[Poppins] text-[9px] font-bold text-white shrink-0"
                                 style={{ background: v.updated_by_color ?? '#64748B' }}
                                 aria-hidden="true">
                              {v.updated_by_name.slice(0, 2).toUpperCase()}
                            </div>
                            <span className="font-[Poppins] text-[11px] text-[#0F1923] truncate">
                              {v.updated_by_name}
                            </span>
                          </div>
                          <p className="font-[Poppins] text-[10px] text-[#94A3B8] mt-0.5 pl-6.5">
                            {new Date(v.updated_at).toLocaleDateString('en-KE', {
                              day: 'numeric', month: 'short',
                            })}
                            {' '}
                            {new Date(v.updated_at).toLocaleTimeString('en-KE', {
                              hour: '2-digit', minute: '2-digit',
                            })}
                          </p>
                        </div>
                      ) : (
                        <span className="font-[Poppins] text-[11px] text-[#94A3B8]">—</span>
                      )}
                    </td>

                    {/* actions */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <Link href={`/admin/cars/${v.id}/edit`}
                              className="h-8 px-2.5 border border-[#E2E8F0] rounded-lg
                                         font-[Poppins] text-[11px] text-[#0F1923]
                                         hover:border-[#1565C0] flex items-center">
                          Edit
                        </Link>
                        {v.status === 'published' && (
                          <FeaturedToggle vehicleId={v.id} featured={v.featured} label={label} />
                        )}
                        <DeleteVehicleButton vehicleId={v.id} label={label} />
                      </div>
                    </td>
                  </tr>
                );
              })}

              {vehicles?.length === 0 && (
                <tr>
                  <td colSpan={8}
                      className="py-12 text-center font-[Poppins] text-[13px] text-[#64748B]">
                    No cars match these filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── activity log ── */}
      <ActivityLog limit={40} />
    </div>
  );
}