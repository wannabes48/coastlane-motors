import Link from 'next/link';
import { supabaseServer } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { LogoutButton } from '@/components/admin/logout-button';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) redirect('/admin/login');

  return (
    <div className="min-h-screen bg-sky flex flex-col">
      <header className="bg-white border-b border-line px-4 h-16 flex items-center justify-between">
        <Link href="/admin" className="font-sans font-bold text-ink">Coastlane Admin</Link>
        <div className="flex gap-4 items-center">
           <Link href="/" target="_blank" className="text-sm text-azure hover:underline">View Site ↗</Link>
           <LogoutButton />
        </div>
      </header>
      <main className="flex-1 p-4 lg:p-8 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
