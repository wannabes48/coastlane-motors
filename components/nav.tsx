'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/logo';
import { Menu, X, ChevronRight } from 'lucide-react';
import Image from 'next/image';

const NAV_LINKS = [
  { label: 'Used Cars', href: '/used', desc: 'Browse used stock' },
  { label: 'New Cars',  href: '/new',  desc: 'Brand new vehicles' },
  { label: 'About',     href: '/about', desc: 'Our story' },
  { label: 'Contact',   href: '/contact', desc: 'Get in touch' },
];

export function Nav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const waLink = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP}`;

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + '/') || pathname.startsWith(href + '?');

  return (
    <header
      className="fixed top-0 inset-x-0 z-40 bg-ink"
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
    >
      <div className="flex items-center justify-between h-14 px-4 max-w-7xl mx-auto">
        <Logo variant="dark" />

        <div className="flex items-center gap-2">
          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1 mr-4">
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`h-9 px-4 rounded-lg font-sans text-[14px] font-medium flex items-center transition-colors
                  ${isActive(link.href)
                    ? 'bg-white/10 text-white'
                    : 'text-white/75 hover:text-white hover:bg-white/5'
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* WhatsApp CTA */}
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 h-9 px-4 rounded-full bg-wa text-ink text-[13px] font-semibold hover:opacity-90 transition-opacity"
          >
            <Image src="/whatsapp-icon.png" alt="" width={16} height={16} className="object-contain" />
            <span className="hidden sm:inline">WhatsApp</span>
          </a>

          {/* Hamburger */}
          <button
            onClick={() => setOpen(o => !o)}
            className="md:hidden flex items-center justify-center w-11 h-11 text-white rounded-lg hover:bg-white/10 transition-colors"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            {open ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 top-14 bg-ink/60 md:hidden z-30"
            onClick={() => setOpen(false)}
          />
          <nav
            className="md:hidden absolute top-full left-0 right-0 z-40 bg-ink border-t border-white/10 shadow-2xl"
            style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
          >
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`flex items-center justify-between px-5 py-4 border-b border-white/5 active:bg-white/10 transition-colors
                  ${isActive(link.href) ? 'bg-white/10' : ''}`}
              >
                <div>
                  <p className={`font-sans font-semibold text-[15px] ${isActive(link.href) ? 'text-white' : 'text-white/90'}`}>
                    {link.label}
                  </p>
                  <p className="font-sans text-[12px] text-white/50 mt-0.5">{link.desc}</p>
                </div>
                <ChevronRight size={16} className="text-white/40 shrink-0" aria-hidden="true" />
              </Link>
            ))}

            {/* WhatsApp row at bottom */}
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-5 py-4 active:bg-white/10 transition-colors"
            >
              <Image src="/whatsapp-icon.png" alt="" width={20} height={20} className="object-contain" />
              <div>
                <p className="font-sans font-semibold text-[15px] text-wa">WhatsApp us</p>
                <p className="font-sans text-[12px] text-white/50 mt-0.5">Chat with us directly</p>
              </div>
              <ChevronRight size={16} className="text-white/40 shrink-0 ml-auto" aria-hidden="true" />
            </a>
          </nav>
        </>
      )}
    </header>
  );
}
