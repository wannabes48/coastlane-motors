// lib/activity.ts
// Server-only — import only from server actions and route handlers.
import 'server-only';
import { supabaseAdmin } from '@/lib/supabase/admin';

export type ActivityAction =
  | 'created'
  | 'updated'
  | 'published'
  | 'unpublished'
  | 'sold'
  | 'deleted'
  | 'featured'
  | 'unfeatured';

type LogParams = {
  adminId:     string;
  vehicleId:   string | null;
  vehicleSlug: string;
  vehicleName: string;
  action:      ActivityAction;
  diff?:       Record<string, [unknown, unknown]>;  // { field: [oldVal, newVal] }
};

export async function logActivity(params: LogParams) {
  const { error } = await supabaseAdmin.from('activity_log').insert({
    admin_id:     params.adminId,
    vehicle_id:   params.vehicleId,
    vehicle_slug: params.vehicleSlug,
    vehicle_name: params.vehicleName,
    action:       params.action,
    diff:         params.diff ?? null,
  });

  if (error) {
    // non-fatal — log to server console but don't break the main operation
    console.error('[activity_log] insert failed:', error.message);
  }
}

// ── diff builder ──────────────────────────────────────────────────────────────
// Pass the old DB row and the new validated payload.
// Returns only changed fields, ignoring images (too noisy) and timestamps.

const SKIP_FIELDS = new Set([
  'images', 'updated_at', 'created_at', 'updated_by', 'created_by',
  'views', 'search_text',
]);

export function buildDiff(
  oldRow: Record<string, unknown>,
  newRow: Record<string, unknown>,
): Record<string, [unknown, unknown]> {
  const diff: Record<string, [unknown, unknown]> = {};

  for (const key of Object.keys(newRow)) {
    if (SKIP_FIELDS.has(key)) continue;
    const oldVal = oldRow[key];
    const newVal = newRow[key];
    if (JSON.stringify(oldVal) !== JSON.stringify(newVal)) {
      diff[key] = [oldVal, newVal];
    }
  }

  return diff;
}

// ── activity query (for the log UI) ──────────────────────────────────────────

export type ActivityEntry = {
  id: string;
  action: ActivityAction;
  vehicle_slug: string | null;
  vehicle_name: string | null;
  vehicle_id: string | null;
  diff: Record<string, [unknown, unknown]> | null;
  created_at: string;
  admin: {
    display_name: string;
    avatar_color: string;
  } | null;
};

export async function getActivityLog(limit = 50): Promise<ActivityEntry[]> {
  const { data, error } = await supabaseAdmin
    .from('activity_log')
    .select(`
      id, action, vehicle_slug, vehicle_name, vehicle_id, diff, created_at,
      admin:admin_id ( display_name, avatar_color )
    `)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('[getActivityLog]', error.message);
    return [];
  }

  return (data ?? []) as ActivityEntry[];
}

export async function getVehicleActivityLog(vehicleId: string): Promise<ActivityEntry[]> {
  const { data, error } = await supabaseAdmin
    .from('activity_log')
    .select(`
      id, action, vehicle_slug, vehicle_name, vehicle_id, diff, created_at,
      admin:admin_id ( display_name, avatar_color )
    `)
    .eq('vehicle_id', vehicleId)
    .order('created_at', { ascending: false })
    .limit(30);

  if (error) return [];
  return (data ?? []) as ActivityEntry[];
}