// app/admin/(dashboard)/actions.ts
// Full replacement — multi-admin, activity log, per-listing WhatsApp stamping.

'use server';

import { revalidatePath } from 'next/cache';
import { redirect }       from 'next/navigation';
import { v2 as cloudinary } from 'cloudinary';

import { supabaseServer } from '@/lib/supabase/server';
import { supabaseAdmin }  from '@/lib/supabase/admin';
import { vehicleSchema }  from '@/lib/schema';
import { buildSlug }      from '@/lib/slug';
import { logActivity, buildDiff, type ActivityAction } from '@/lib/activity';
import { resolveAdminWhatsapp } from '@/lib/whatsapp';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ── helpers ───────────────────────────────────────────────────────────────────

async function requireAdmin() {
  const supabase = await supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data: adminRow } = await supabaseAdmin
    .from('admin_users')
    .select('user_id, display_name, whatsapp, role')
    .eq('user_id', user.id)
    .maybeSingle();

  if (!adminRow) throw new Error('Not an admin');
  return adminRow;
}

function vehicleName(data: { year: number; make: string; model: string }) {
  return `${data.year} ${data.make} ${data.model}`;
}

// ── saveVehicle ───────────────────────────────────────────────────────────────

export async function saveVehicle(
  id: string | null,
  raw: unknown,
): Promise<{ ok: boolean; errors?: unknown; message?: string }> {

  const parsed = vehicleSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, errors: parsed.error.flatten() };

  let admin;
  try { admin = await requireAdmin(); }
  catch (e: any) { return { ok: false, message: e.message }; }

  const payload = {
    ...parsed.data,
    images:    parsed.data.images.sort((a, b) => a.position - b.position),
    updated_by: admin.user_id,
    // stamp the poster's WhatsApp so inquiries go directly to them
    contact_whatsapp: resolveAdminWhatsapp(admin.whatsapp),
  };

  if (id) {
    // ── UPDATE ────────────────────────────────────────────────────────────────
    const { data: oldRow } = await supabaseAdmin
      .from('vehicles')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (!oldRow) return { ok: false, message: 'Vehicle not found.' };

    const { error } = await supabaseAdmin
      .from('vehicles')
      .update(payload)
      .eq('id', id);

    if (error) return { ok: false, message: error.message };

    // determine the most meaningful action label
    let action: ActivityAction = 'updated';
    if (payload.status === 'published' && oldRow.status !== 'published') action = 'published';
    if (payload.status === 'draft'     && oldRow.status === 'published') action = 'unpublished';
    if (payload.status === 'sold'      && oldRow.status !== 'sold')      action = 'sold';

    await logActivity({
      adminId:     admin.user_id,
      vehicleId:   id,
      vehicleSlug: oldRow.slug,
      vehicleName: vehicleName(payload),
      action,
      diff: buildDiff(oldRow, payload),
    });

  } else {
    // ── CREATE ────────────────────────────────────────────────────────────────
    const slug = buildSlug(parsed.data);
    const { data: newRow, error } = await supabaseAdmin
      .from('vehicles')
      .insert({
        ...payload,
        slug,
        created_by: admin.user_id,
      })
      .select('id')
      .single();

    if (error) return { ok: false, message: error.message };

    await logActivity({
      adminId:     admin.user_id,
      vehicleId:   newRow.id,
      vehicleSlug: slug,
      vehicleName: vehicleName(payload),
      action:      'created',
    });
  }

  revalidatePath('/');
  revalidatePath('/used');
  revalidatePath('/new');
  revalidatePath('/admin');
  redirect('/admin');
}

// ── setFeatured ───────────────────────────────────────────────────────────────

export async function setFeatured(
  id: string,
  featured: boolean,
): Promise<{ ok: boolean; message?: string }> {

  let admin;
  try { admin = await requireAdmin(); }
  catch (e: any) { return { ok: false, message: e.message }; }

  if (featured) {
    await supabaseAdmin
      .from('vehicles')
      .update({ featured: false })
      .eq('featured', true)
      .neq('id', id);
  }

  const { data: row } = await supabaseAdmin
    .from('vehicles')
    .select('slug, make, model, year')
    .eq('id', id)
    .maybeSingle();

  const { error } = await supabaseAdmin
    .from('vehicles')
    .update({ featured, updated_by: admin.user_id })
    .eq('id', id);

  if (error) return { ok: false, message: error.message };

  if (row) {
    await logActivity({
      adminId:     admin.user_id,
      vehicleId:   id,
      vehicleSlug: row.slug,
      vehicleName: vehicleName(row),
      action:      featured ? 'featured' : 'unfeatured',
    });
  }

  revalidatePath('/');
  revalidatePath('/admin');
  return { ok: true };
}

// ── deleteVehicle ─────────────────────────────────────────────────────────────

export async function deleteVehicle(
  id: string,
): Promise<{ ok: boolean; message?: string }> {

  let admin;
  try { admin = await requireAdmin(); }
  catch (e: any) { return { ok: false, message: e.message }; }

  const { data: vehicle } = await supabaseAdmin
    .from('vehicles')
    .select('id, slug, make, model, year')
    .eq('id', id)
    .maybeSingle();

  if (!vehicle) return { ok: false, message: 'Vehicle not found.' };

  // log BEFORE delete so the vehicle_id FK is still valid
  await logActivity({
    adminId:     admin.user_id,
    vehicleId:   id,
    vehicleSlug: vehicle.slug,
    vehicleName: vehicleName(vehicle),
    action:      'deleted',
  });

  // Cloudinary cleanup (non-fatal)
  try {
    await cloudinary.api.delete_resources_by_prefix(`coastlane/vehicles/${id}`);
    await cloudinary.api.delete_folder(`coastlane/vehicles/${id}`).catch(() => {});
  } catch (err: any) {
    console.error('[deleteVehicle] Cloudinary cleanup failed:', err?.message);
  }

  const { error } = await supabaseAdmin.from('vehicles').delete().eq('id', id);
  if (error) return { ok: false, message: error.message };

  revalidatePath('/');
  revalidatePath('/used');
  revalidatePath('/new');
  revalidatePath(`/cars/${vehicle.slug}`);
  revalidatePath('/admin');
  redirect('/admin');
}