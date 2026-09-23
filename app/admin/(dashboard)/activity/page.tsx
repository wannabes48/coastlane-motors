// app/admin/(dashboard)/activity/page.tsx
// Full activity log page — all admins, all vehicles.

import { ActivityLog } from '@/components/admin/activity-log';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Activity log — Coastlane Admin' };
export const dynamic = 'force-dynamic';

export default function ActivityPage() {
  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto">
      <h1 className="font-[Poppins] text-[20px] font-bold text-[#0F1923] mb-1">
        Activity log
      </h1>
      <p className="font-[Poppins] text-[13px] text-[#64748B] mb-6">
        Every vehicle addition and edit, timestamped and attributed.
      </p>
      <ActivityLog limit={100} />
    </div>
  );
}