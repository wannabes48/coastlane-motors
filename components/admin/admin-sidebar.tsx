'use client';

// components/admin/admin-sidebar.tsx
// Fixed left sidebar, desktop only (md+).

import Link       from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Car, PlusCircle, Users,
  Settings, LogOut, Activity, Star,
} from 'lucide-react';
import { Logo } from '@/components/logo';
import { createClient } from '@/lib/supabase/client';
import { useRouter }    from 'next/navigation';

type Admin = {
  display_name: string;
  role: string;
  whatsapp: string | null;
  avatar_color: string;
  email: string;
};

type NavItem = {
  href:    string;
  label:   string;
  icon:    React.ElementType;
  ownerOnly?: boolean;
  exact?:  boolean;
};

const NAV: NavItem[] = [
  { href: '/admin',          label: 'Dashboard',   icon: LayoutDashboard, exact: true },
  { href: '/admin/cars/new', label: 'Add car',      icon: PlusCircle },
  { href: '/admin/activity', label: 'Activity',     icon: Activity },
  { href: '/admin/featured', label: 'Staff pick',   icon: Star },
  { href: '/admin/admins',   label: 'Team',         icon: Users,  ownerOnly: true },
  { href: '/admin/settings', label: 'My settings',  icon: Settings },
];

export function AdminSidebar({
  admin,
  isOwner,
  userId,
}: {
  admin: Admin;
  isOwner: boolean;
  userId: string;
}) {
  const pathname = usePathname();
  const router   = useRouter();

  async function handleSignOut() {
    const sb = createClient();
    await sb.auth.signOut();
    router.push('/admin/login');
  }

  function isActive(item: NavItem) {
    if (item.exact) return pathname === item.href;
    return pathname.startsWith(item.href);
  }

  const visible = NAV.filter(n => !n.ownerOnly || isOwner);

  return (
    <aside
      className="hidden md:flex fixed left-0 top-0 bottom-0 w-56 z-30
                 flex-col bg-[#0F1923] border-r border-white/5"
      aria-label="Admin navigation"
    >
      {/* logo */}
      <div className="flex items-center h-14 px-4 border-b border-white/8 shrink-0">
        <Logo variant="dark" />
      </div>

      {/* nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <p className="font-[Poppins] text-[9px] font-semibold text-white/30
                      uppercase tracking-[2px] px-2 mb-2">
          Menu
        </p>
        <ul className="flex flex-col gap-0.5">
          {visible.map(item => {
            const Icon   = item.icon;
            const active = isActive(item);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-2.5 h-9 px-3 rounded-lg
                              font-[Poppins] text-[13px] font-medium
                              transition-colors duration-100
                              ${active
                                ? 'bg-white/10 text-white'
                                : 'text-white/55 hover:text-white hover:bg-white/6'
                              }`}
                  aria-current={active ? 'page' : undefined}
                >
                  <Icon
                    size={16}
                    aria-hidden="true"
                    className={active ? 'text-[#1565C0]' : 'text-white/40'}
                  />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* admin profile + sign out */}
      <div className="px-3 py-4 border-t border-white/8 shrink-0">
        {/* profile card */}
        <div className="flex items-center gap-2.5 px-2 mb-3">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center
                       font-[Poppins] text-[10px] font-bold text-white shrink-0"
            style={{ background: admin.avatar_color }}
            aria-hidden="true"
          >
            {admin.display_name.slice(0, 2).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-[Poppins] text-[12px] font-semibold text-white truncate">
              {admin.display_name}
            </p>
            <p className="font-[Poppins] text-[10px] text-white/40 truncate">
              {admin.role}
            </p>
          </div>
        </div>

        {/* sign out */}
        <button
          type="button"
          onClick={handleSignOut}
          className="flex items-center gap-2.5 w-full h-9 px-3 rounded-lg
                     font-[Poppins] text-[13px] font-medium text-white/50
                     hover:text-white hover:bg-white/6 transition-colors"
        >
          <LogOut size={15} aria-hidden="true" className="text-white/30" />
          Sign out
        </button>
      </div>
    </aside>
  );
}