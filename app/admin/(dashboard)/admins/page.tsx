// app/admin/(dashboard)/admins/page.tsx
// Owner-only page — manage who has admin access and their WhatsApp numbers.

import { redirect }     from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { supabaseServer } from '@/lib/supabase/server';
import { AdminForm }    from '@/components/admin/admin-form';
import { RemoveAdminButton } from '@/components/admin/remove-admin-button';

export default async function AdminsPage() {
  // owner-only gate
  const supabase = await supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/admin/login');

  const { data: me } = await supabaseAdmin
    .from('admin_users')
    .select('role')
    .eq('user_id', user.id)
    .maybeSingle();

  if (me?.role !== 'owner') redirect('/admin');

  const { data: admins } = await supabaseAdmin
    .from('admin_users')
    .select('user_id, email, display_name, whatsapp, role, avatar_color, created_at, last_seen_at')
    .order('created_at', { ascending: true });

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto">
      <h1 className="font-[Poppins] text-[20px] font-bold text-[#0F1923] mb-1">
        Admin team
      </h1>
      <p className="font-[Poppins] text-[13px] text-[#64748B] mb-8">
        Each admin's WhatsApp number receives inquiries for cars they post.
      </p>

      {/* current admins */}
      <div className="flex flex-col gap-3 mb-10">
        {(admins ?? []).map((a) => (
          <div key={a.user_id}
               className="flex items-center gap-4 bg-white border border-[#E2E8F0]
                          rounded-xl px-4 py-4">

            {/* avatar */}
            <div className="w-10 h-10 rounded-full flex items-center justify-center
                            font-[Poppins] text-[13px] font-bold text-white shrink-0"
                 style={{ background: a.avatar_color }}>
              {a.display_name.slice(0, 2).toUpperCase()}
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-[Poppins] text-[14px] font-semibold text-[#0F1923] truncate">
                {a.display_name}
              </p>
              <p className="font-[Poppins] text-[12px] text-[#64748B] truncate">
                {a.email}
              </p>
              <p className="font-[Poppins] text-[11px] text-[#94A3B8] mt-0.5">
                WA: {a.whatsapp ?? 'not set'}
                {a.last_seen_at && (
                  <span> · last seen {new Date(a.last_seen_at).toLocaleDateString('en-KE')}</span>
                )}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className={`font-[Poppins] text-[10px] font-semibold px-2 py-1 rounded-full
                              ${a.role === 'owner'
                                ? 'bg-[#FEF9EE] text-[#D4A843] border border-[#F5D87A]'
                                : 'bg-[#E3EEFF] text-[#1565C0]'}`}>
                {a.role}
              </span>

              {/* owner can't remove themselves */}
              {a.user_id !== user.id && (
                <RemoveAdminButton userId={a.user_id} name={a.display_name} />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* invite form */}
      <div className="bg-[#F0F6FF] border border-[#E2E8F0] rounded-xl p-5">
        <h2 className="font-[Poppins] text-[14px] font-bold text-[#0F1923] mb-1">
          Invite a new admin
        </h2>
        <p className="font-[Poppins] text-[12px] text-[#64748B] mb-4">
          They'll receive an email to set their password. Their WhatsApp receives
          inquiries for every car they post.
        </p>
        <AdminForm />
      </div>
    </div>
  );
}
