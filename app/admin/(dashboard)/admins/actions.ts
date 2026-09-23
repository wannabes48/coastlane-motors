'use server';

// app/admin/(dashboard)/admins/actions.ts

import { supabaseAdmin } from '@/lib/supabase/admin';
import { supabaseServer } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

async function requireOwner() {
  const supabase = await supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data } = await supabaseAdmin
    .from('admin_users')
    .select('role')
    .eq('user_id', user.id)
    .maybeSingle();

  if (data?.role !== 'owner') throw new Error('Owner access required');
  return user;
}

// ── invite ────────────────────────────────────────────────────────────────────

export async function inviteAdmin(
  fd: FormData,
): Promise<{ ok: boolean; message?: string }> {
  try { await requireOwner(); }
  catch (e: any) { return { ok: false, message: e.message }; }

  const email        = String(fd.get('email') ?? '').trim().toLowerCase();
  const display_name = String(fd.get('display_name') ?? '').trim();
  const whatsapp     = String(fd.get('whatsapp') ?? '').replace(/\D/g, '') || null;
  const role         = String(fd.get('role') ?? 'editor');
  const avatar_color = String(fd.get('avatar_color') ?? '#1565C0');

  if (!email || !display_name) {
    return { ok: false, message: 'Email and name are required.' };
  }

  // create the Supabase Auth user — they'll receive a magic link / invite email
  const { data: authUser, error: authErr } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
    data: { display_name },
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/admin/login`,
  });

  if (authErr) return { ok: false, message: authErr.message };

  // register in our admin_users table
  const { error: insertErr } = await supabaseAdmin.from('admin_users').insert({
    user_id:      authUser.user.id,
    email,
    display_name,
    whatsapp,
    role,
    avatar_color,
  });

  if (insertErr) {
    // rollback auth user if table insert fails
    await supabaseAdmin.auth.admin.deleteUser(authUser.user.id);
    return { ok: false, message: insertErr.message };
  }

  revalidatePath('/admin/admins');
  return { ok: true };
}

// ── remove ────────────────────────────────────────────────────────────────────

export async function removeAdmin(
  userId: string,
): Promise<{ ok: boolean; message?: string }> {
  try { await requireOwner(); }
  catch (e: any) { return { ok: false, message: e.message }; }

  // remove from admin_users (does NOT delete the Supabase auth user)
  const { error } = await supabaseAdmin
    .from('admin_users')
    .delete()
    .eq('user_id', userId);

  if (error) return { ok: false, message: error.message };

  revalidatePath('/admin/admins');
  return { ok: true };
}

// ── update own WhatsApp (editor can update their own) ─────────────────────────

export async function updateMyWhatsapp(
  whatsapp: string,
): Promise<{ ok: boolean; message?: string }> {
  const supabase = await supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, message: 'Not authenticated' };

  const cleaned = whatsapp.replace(/\D/g, '');
  if (cleaned.length < 10) return { ok: false, message: 'Enter a valid number.' };

  const { error } = await supabaseAdmin
    .from('admin_users')
    .update({ whatsapp: cleaned })
    .eq('user_id', user.id);

  if (error) return { ok: false, message: error.message };
  revalidatePath('/admin/settings');
  return { ok: true };
}
