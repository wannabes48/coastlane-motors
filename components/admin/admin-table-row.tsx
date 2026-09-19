// components/admin/admin-table-row.tsx
// Drop-in replacement for the <tr> inside the admin dashboard table.
// Wire it like this in app/admin/(dashboard)/page.tsx:
//
//   import { AdminTableRow } from '@/components/admin/admin-table-row';
//   ...
//   {vehicles?.map((v) => <AdminTableRow key={v.id} vehicle={v} />)}

import Link from 'next/link';
import { FeaturedToggle } from '@/components/admin/featured-toggle';
import { DeleteVehicleButton } from '@/components/admin/delete-vehicle';
import { ViewCount } from '@/components/view-count';
import { fmtKES } from '@/lib/money';

type Vehicle = {
  id: string;
  slug: string;
  make: string;
  model: string;
  year: number;
  price_kes: number | null;
  condition: 'used' | 'new';
  status: 'draft' | 'published' | 'sold';
  featured: boolean;
  views: number;
  updated_at: string;
};

const STATUS_COLOURS: Record<string, string> = {
  published: 'bg-[#ECFDF5] text-[#065F46]',
  draft:     'bg-azure-l text-azure',
  sold:      'bg-[#F1F5F9] text-slate',
};

export function AdminTableRow({ vehicle: v }: { vehicle: Vehicle }) {
  const label = `${v.year} ${v.make} ${v.model}`;

  return (
    <tr className="border-b border-line last:border-0 hover:bg-[#FAFAFA] bg-white group">

      {/* car name */}
      <td className="py-2.5 px-3.5">
        <Link
          href={`/admin/cars/${v.id}/edit`}
          className="font-sans text-[12px] font-semibold text-ink
                     hover:text-azure transition-colors truncate block"
        >
          {label}
        </Link>
      </td>

      {/* price */}
      <td className="py-2.5 px-3.5 font-sans text-[12px] text-slate">
        {fmtKES(v.price_kes)}
      </td>

      {/* condition */}
      <td className="py-2.5 px-3.5">
        <span className="font-sans text-[11px] font-medium text-slate capitalize">
          {v.condition}
        </span>
      </td>

      {/* status badge */}
      <td className="py-2.5 px-3.5">
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px]
                      font-sans font-semibold capitalize
                      ${STATUS_COLOURS[v.status] ?? ''}`}
        >
          {v.status}
        </span>
      </td>

      {/* views */}
      <td className="py-2.5 px-3.5">
        <div className="flex items-center gap-1.5 text-slate text-[11px]">
           <ViewCount count={v.views} />
        </div>
      </td>

      {/* actions */}
      <td className="py-2.5 px-3.5 border-l border-line">
        <div className="flex items-center gap-1.5">
          {/* edit */}
          <Link
            href={`/admin/cars/${v.id}/edit`}
            className="h-[28px] px-2.5 border border-line rounded
                       font-sans text-[11px] font-medium text-ink
                       hover:border-azure hover:text-azure
                       transition-colors flex items-center"
          >
            Edit
          </Link>

          {/* staff pick toggle — published only */}
          {v.status === 'published' && (
            <FeaturedToggle
              vehicleId={v.id}
              featured={v.featured}
              label={label}
            />
          )}

          {/* delete — always available */}
          <DeleteVehicleButton vehicleId={v.id} label={label} />
        </div>
      </td>
    </tr>
  );
}
