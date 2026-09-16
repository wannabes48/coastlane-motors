'use client';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export function LogoutButton() {
  const router = useRouter();
  const supabase = createClient();
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };
  return <button onClick={handleLogout} className="text-sm text-slate hover:text-ink">Sign Out</button>;
}
