// components/admin/activity-log.tsx
// Server component — fetches and renders the log.
// Props let it be scoped to a vehicle or show the global feed.

import { getActivityLog, getVehicleActivityLog, type ActivityEntry } from '@/lib/activity';
import { formatDistanceToNow } from 'date-fns';
import {
  PlusCircle, Edit3, Eye, EyeOff, CheckCircle,
  Trash2, Star, StarOff, Clock,
} from 'lucide-react';

type Props = {
  vehicleId?: string;  // scoped to one vehicle if provided
  limit?: number;
};

const ACTION_META: Record<string, { label: string; icon: React.ElementType; colour: string }> = {
  created:     { label: 'Added',       icon: PlusCircle,  colour: '#1B5E20' },
  updated:     { label: 'Edited',      icon: Edit3,       colour: '#1565C0' },
  published:   { label: 'Published',   icon: Eye,         colour: '#1B5E20' },
  unpublished: { label: 'Unpublished', icon: EyeOff,      colour: '#B45309' },
  sold:        { label: 'Marked sold', icon: CheckCircle, colour: '#4A148C' },
  deleted:     { label: 'Deleted',     icon: Trash2,      colour: '#B71C1C' },
  featured:    { label: 'Featured',    icon: Star,        colour: '#D4A843' },
  unfeatured:  { label: 'Unfeatured',  icon: StarOff,     colour: '#64748B' },
};

function DiffSummary({ diff }: { diff: Record<string, [unknown, unknown]> | null }) {
  if (!diff) return null;
  const keys = Object.keys(diff);
  if (!keys.length) return null;

  const readable: Record<string, string> = {
    status: 'status', price_kes: 'price', make: 'make', model: 'model',
    year: 'year', city: 'city', condition: 'condition', featured: 'featured',
    description: 'description', mileage_km: 'mileage',
  };

  const changed = keys
    .filter(k => readable[k])
    .map(k => readable[k])
    .join(', ');

  if (!changed) return null;

  return (
    <p className="font-[Poppins] text-[11px] text-[#94A3B8] mt-0.5">
      Changed: {changed}
    </p>
  );
}

function LogEntry({ entry }: { entry: ActivityEntry }) {
  const meta = ACTION_META[entry.action] ?? ACTION_META.updated;
  const Icon = meta.icon;
  const admin = entry.admin;
  const name = admin?.display_name ?? 'Unknown';
  const initials = name.slice(0, 2).toUpperCase();
  const colour = admin?.avatar_color ?? '#64748B';

  const timeAgo = formatDistanceToNow(new Date(entry.created_at), { addSuffix: true });
  const fullDate = new Date(entry.created_at).toLocaleString('en-KE', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

  return (
    <li className="flex items-start gap-3 py-3.5 border-b border-[#F1F5F9] last:border-0">
      {/* avatar */}
      <div className="w-8 h-8 rounded-full flex items-center justify-center
                      font-[Poppins] text-[11px] font-bold text-white shrink-0 mt-0.5"
           style={{ background: colour }}
           aria-hidden="true">
        {initials}
      </div>

      <div className="flex-1 min-w-0">
        {/* action row */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <Icon size={13} aria-hidden="true" style={{ color: meta.colour }} />
          <span className="font-[Poppins] text-[12px] font-semibold text-[#0F1923]">
            {name}
          </span>
          <span className="font-[Poppins] text-[12px] text-[#64748B]">
            {meta.label}
          </span>
          {entry.vehicle_name && (
            <>
              <span className="text-[#94A3B8] text-[11px]">·</span>
              {entry.vehicle_id ? (
                <a
                  href={`/admin/cars/${entry.vehicle_id}/edit`}
                  className="font-[Poppins] text-[12px] font-medium text-[#1565C0]
                             hover:underline truncate max-w-[200px]"
                >
                  {entry.vehicle_name}
                </a>
              ) : (
                <span className="font-[Poppins] text-[12px] text-[#94A3B8] italic">
                  {entry.vehicle_name} (deleted)
                </span>
              )}
            </>
          )}
        </div>

        {/* diff */}
        <DiffSummary diff={entry.diff} />

        {/* timestamp */}
        <div className="flex items-center gap-1 mt-0.5">
          <Clock size={10} aria-hidden="true" className="text-[#94A3B8]" />
          <time
            dateTime={entry.created_at}
            title={fullDate}
            className="font-[Poppins] text-[10px] text-[#94A3B8]"
          >
            {timeAgo}
          </time>
        </div>
      </div>
    </li>
  );
}

export async function ActivityLog({ vehicleId, limit = 50 }: Props) {
  const entries = vehicleId
    ? await getVehicleActivityLog(vehicleId)
    : await getActivityLog(limit);

  return (
    <section aria-labelledby="activity-heading">
      <h2
        id="activity-heading"
        className="font-[Poppins] text-[14px] font-bold text-[#0F1923] mb-3"
      >
        Activity log
      </h2>

      {entries.length === 0 ? (
        <p className="font-[Poppins] text-[13px] text-[#94A3B8] py-4">
          No activity recorded yet.
        </p>
      ) : (
        <ul className="bg-white border border-[#E2E8F0] rounded-xl px-4 divide-y-0">
          {entries.map((e) => (
            <LogEntry key={e.id} entry={e} />
          ))}
        </ul>
      )}
    </section>
  );
}