'use client';

// components/admin/admin-bottom-nav.tsx
// Sticky bottom tab bar — mobile only (hidden on md+).
// 5 tabs max to fit comfortably on a phone.

import Link          from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, PlusCircle,
  Activity, Settings, Users, LogOut
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

type Tab = {
  href:      string;
  label:     string;
  icon:      React.ElementType;
  ownerOnly?: boolean;
  exact?:    boolean;
};

const TABS: Tab[] = [
  { href: '/admin',          label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/cars/new', label: 'Add car',   icon: PlusCircle },
  { href: '/admin/activity', label: 'Activity',  icon: Activity },
  { href: '/admin/settings', label: 'Settings',  icon: Settings },
];

export function AdminBottomNav({ isOwner }: { isOwner: boolean }) {
  const pathname = usePathname();
  const router = useRouter();

  const visible = TABS.filter(t => !t.ownerOnly || isOwner);

  function isActive(tab: Tab) {
    if (tab.exact) return pathname === tab.href;
    return pathname.startsWith(tab.href);
  }

  async function handleSignOut() {
    const sb = createClient();
    await sb.auth.signOut();
    router.push('/admin/login');
  }

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-40 md:hidden
                 bg-[#0F1923] border-t border-white/8"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      aria-label="Admin navigation"
    >
      <ul className="flex items-stretch overflow-x-auto hide-scrollbar">
        {visible.map(tab => {
          const Icon   = tab.icon;
          const active = isActive(tab);

          return (
            <li key={tab.href} className="flex-1 min-w-[64px]">
              <Link
                href={tab.href}
                aria-current={active ? 'page' : undefined}
                className={`flex flex-col items-center justify-center gap-1
                            h-14 w-full transition-colors
                            ${active ? 'text-white' : 'text-white/40 hover:text-white/70'}`}
              >
                {/* active indicator dot */}
                {active && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2
                                   w-6 h-0.5 bg-[#1565C0] rounded-full" />
                )}
                <Icon
                  size={20}
                  aria-hidden="true"
                  className={active ? 'text-[#5B9BD5]' : ''}
                />
                <span className="font-[Poppins] text-[10px] font-medium leading-none">
                  {tab.label}
                </span>
              </Link>
            </li>
          );
        })}

        {isOwner && (
          <li className="flex-1 min-w-[64px]">
            <Link
              href="/admin/admins"
              aria-current={pathname.startsWith('/admin/admins') ? 'page' : undefined}
              className={`flex flex-col items-center justify-center gap-1
                          h-14 w-full transition-colors
                          ${pathname.startsWith('/admin/admins') ? 'text-white' : 'text-white/40 hover:text-white/70'}`}
            >
              {pathname.startsWith('/admin/admins') && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2
                                 w-6 h-0.5 bg-[#1565C0] rounded-full" />
              )}
              <Users
                size={20}
                aria-hidden="true"
                className={pathname.startsWith('/admin/admins') ? 'text-[#5B9BD5]' : ''}
              />
              <span className="font-[Poppins] text-[10px] font-medium leading-none">
                Team
              </span>
            </Link>
          </li>
        )}

        <li className="flex-1 min-w-[64px]">
          <button
            onClick={handleSignOut}
            className="flex flex-col items-center justify-center gap-1
                       h-14 w-full transition-colors text-white/40 hover:text-white/70"
          >
            <LogOut size={20} aria-hidden="true" />
            <span className="font-[Poppins] text-[10px] font-medium leading-none">
              Logout
            </span>
          </button>
        </li>
      </ul>
    </nav>
  );
}