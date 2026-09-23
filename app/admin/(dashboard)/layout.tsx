// app/admin/(dashboard)/layout.tsx
// Wraps every /admin/* page (except /admin/login).
// Desktop: fixed left sidebar.
// Mobile: full-width content + sticky bottom tab bar.

import { redirect }       from 'next/navigation';
import { supabaseServer } from '@/lib/supabase/server';
import { supabaseAdmin }  from '@/lib/supabase/admin';
import { AdminSidebar }   from '@/components/admin/admin-sidebar';
import { AdminBottomNav } from '@/components/admin/admin-bottom-nav';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // auth gate — middleware handles redirects but we double-check here
  const supabase = await supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/admin/login');

  // fetch admin profile for the sidebar
  const { data: admin } = await supabaseAdmin
    .from('admin_users')
    .select('display_name, role, whatsapp, avatar_color, email')
    .eq('user_id', user.id)
    .maybeSingle();

  if (!admin) redirect('/admin/login');

  const isOwner = admin.role === 'owner';

  return (
    <div className="min-h-screen bg-[#F0F6FF]">

      {/* ── desktop sidebar ── */}
      <AdminSidebar
        admin={admin}
        isOwner={isOwner}
        userId={user.id}
      />

      {/* ── main content — offset by sidebar width on desktop ── */}
      <div
        className="md:ml-56 pb-20 md:pb-0"
        style={{ minHeight: '100vh' }}
      >
        {/* top bar — desktop only, mobile uses the bottom nav */}
        <header className="hidden md:flex items-center justify-between
                           h-14 px-6 bg-white border-b border-[#E2E8F0] sticky top-0 z-20">
          <p className="font-[Poppins] text-[13px] text-[#64748B]">
            Signed in as{' '}
            <span className="font-semibold text-[#0F1923]">{admin.display_name}</span>
          </p>
          {!admin.whatsapp && (
            <a href="/admin/settings"
               className="font-[Poppins] text-[11px] font-semibold text-amber-700
                          bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-full">
              ⚠ Set your WhatsApp to receive inquiries
            </a>
          )}
        </header>

        {/* page content */}
        <main>{children}</main>
      </div>

      {/* ── mobile bottom tab bar ── */}
      <AdminBottomNav isOwner={isOwner} />
    </div>
  );
}