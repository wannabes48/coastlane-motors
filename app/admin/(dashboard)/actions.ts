'use server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { supabaseServer } from '@/lib/supabase/server';
import { vehicleSchema } from '@/lib/schema';
import { buildSlug } from '@/lib/slug';

export async function saveVehicle(id: string | null, raw: unknown) {
  const parsed = vehicleSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, errors: parsed.error.flatten() };

  const supabase = await supabaseServer();
  const payload = { ...parsed.data, images: parsed.data.images.sort((a,b)=>a.position-b.position) };

  if (id) {
    const { error } = await supabase.from('vehicles').update(payload).eq('id', id);
    if (error) return { ok: false, message: error.message };
  } else {
    const { error } = await supabase.from('vehicles')
      .insert({ ...payload, slug: buildSlug(parsed.data) });
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
