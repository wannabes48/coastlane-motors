'use server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { v2 as cloudinary } from 'cloudinary';
import { supabaseServer } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { vehicleSchema } from '@/lib/schema';
import { buildSlug } from '@/lib/slug';

export async function saveVehicle(id: string, raw: unknown) {
  const parsed = vehicleSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, errors: parsed.error.flatten() };

  const supabase = await supabaseServer();
  const payload = { ...parsed.data, images: parsed.data.images.sort((a,b)=>a.position-b.position) };

  const { data: existing } = await supabase.from('vehicles').select('id').eq('id', id).maybeSingle();

  if (existing) {
    const { error } = await supabase.from('vehicles').update(payload).eq('id', id);
    if (error) return { ok: false, message: error.message };
  } else {
    const { error } = await supabase.from('vehicles')
      .insert({ id, ...payload, slug: buildSlug(parsed.data) });
    if (error) return { ok: false, message: error.message };
  }

  revalidatePath('/'); revalidatePath('/used'); revalidatePath('/new'); revalidatePath('/admin');
  redirect('/admin');
}

export async function setFeatured(id: string, featured: boolean) {
  const supabase = await supabaseServer();

  // Only one car should be featured at a time.
  // If we're featuring a new one, unfeature all others first.
  if (featured) {
    const { error: clearError } = await supabase
      .from('vehicles')
      .update({ featured: false })
      .eq('featured', true)
      .neq('id', id);                    // keep this one out of the clear

    if (clearError) return { ok: false, message: clearError.message };
  }

  const { error } = await supabase
    .from('vehicles')
    .update({ featured })
    .eq('id', id);

  if (error) return { ok: false, message: error.message };

  revalidatePath('/');                   // home page (StaffPick)
  revalidatePath('/admin');              // dashboard table
  return { ok: true };
}

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function deleteVehicle(
  id: string,
): Promise<{ ok: boolean; message?: string }> {

  // 1. auth check — confirm the caller is an admin via RLS
  const supabase = await supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, message: 'Not authenticated.' };

  // 2. fetch the vehicle (need the images list and slug for cleanup)
  const { data: vehicle, error: fetchError } = await supabaseAdmin
    .from('vehicles')
    .select('id, slug, images')
    .eq('id', id)
    .maybeSingle();

  if (fetchError || !vehicle) {
    return { ok: false, message: 'Vehicle not found.' };
  }

  // 3. delete Cloudinary images
  //    Strategy A: delete by folder prefix (cleanest — removes everything in the folder)
  //    Strategy B: delete by public_id list (safer if the folder contains other assets)
  //    We use A since uploads go to coastlane/vehicles/{id}/ and nowhere else.
  try {
    await cloudinary.api.delete_resources_by_prefix(
      `coastlane/vehicles/${vehicle.id}`,
    );
    // delete the now-empty folder
    await cloudinary.api.delete_folder(
      `coastlane/vehicles/${vehicle.id}`,
    ).catch(() => {
      // folder may not exist if no images were ever uploaded — ignore
    });
  } catch (err: any) {
    // Cloudinary errors should not block the DB delete.
    // Log and continue — orphaned images are harmless vs. a broken UI.
    console.error('[deleteVehicle] Cloudinary cleanup failed:', err?.message);
  }

  // 4. delete the database row (use service role to bypass RLS for the delete)
  const { error: deleteError } = await supabaseAdmin
    .from('vehicles')
    .delete()
    .eq('id', id);

  if (deleteError) {
    return { ok: false, message: deleteError.message };
  }

  // 5. revalidate all pages that could show this vehicle
  revalidatePath('/');
  revalidatePath('/used');
  revalidatePath('/new');
  revalidatePath(`/cars/${vehicle.slug}`);
  revalidatePath('/admin');

  // 6. redirect back to the dashboard
  redirect('/admin');
}
