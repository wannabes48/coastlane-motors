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
  published: 'bg-[#E1F5EE] text-[#0F6E56]',
  draft:     'bg-[#E8F4FD] text-[#1479E0]',
  sold:      'bg-[#E8E8E8] text-[#5C6B72]',
};

export function AdminTableRow({ vehicle: v }: { vehicle: Vehicle }) {
  const label = `${v.year} ${v.make} ${v.model}`;

  return (
    <tr className="border-b border-[#DCE9F2] last:border-0 hover:bg-[#FBFBF9]">

      {/* car name */}
      <td className="py-3 px-4">
        <Link
          href={`/admin/cars/${v.id}/edit`}
          className="font-[Poppins] text-[13px] font-semibold text-[#16293D]
                     hover:text-[#1479E0] transition-colors truncate block"
        >
          {label}
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
          {/* edit */}
          <Link
            href={`/admin/cars/${v.id}/edit`}
            className="h-9 px-3 border border-[#DCE9F2] rounded
                       font-[Poppins] text-[12px] font-medium text-[#16293D]
                       hover:border-[#1479E0] hover:text-[#1479E0]
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
