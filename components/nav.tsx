'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/logo';
import { MessageCircle, Menu, X } from 'lucide-react';

export function Nav() {
  const [open, setOpen] = useState(false);

  const waLink = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP}`;

  return (
    <header className="fixed top-0 inset-x-0 z-40 bg-ink"
            style={{ paddingTop: 'env(safe-area-inset-top)' }}>
      <div className="flex items-center justify-between h-14 px-4 max-w-7xl mx-auto">
        <Logo variant="dark" />

        <div className="flex items-center gap-2">
          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 mr-6">
            <Link href="/used" className="text-white hover:text-white/80 transition-colors h-11 px-3 flex items-center">Used</Link>
            <Link href="/new" className="text-white hover:text-white/80 transition-colors h-11 px-3 flex items-center">New</Link>
            <Link href="/about" className="text-white hover:text-white/80 transition-colors h-11 px-3 flex items-center">About</Link>
            <Link href="/contact" className="text-white hover:text-white/80 transition-colors h-11 px-3 flex items-center">Contact</Link>
          </nav>

          {/* WhatsApp always visible */}
          <a href={waLink} target="_blank" rel="noopener noreferrer"
             className="flex items-center justify-center gap-2 h-11 px-4 rounded-full bg-whatsapp text-ink text-sm font-semibold hover:opacity-90 transition-opacity">
            <MessageCircle size={18} aria-hidden="true" />
            <span className="hidden sm:inline">WhatsApp</span>
          </a>

          {/* hamburger — 44x44 tap target */}
          <button onClick={() => setOpen(o => !o)}
                  className="md:hidden flex items-center justify-center w-11 h-11 text-white"
                  aria-label={open ? 'Close menu' : 'Open menu'}
                  aria-expanded={open}>
            {open ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* drawer — slides down, full width, thumb-reachable links */}
      {open && (
        <nav className="md:hidden flex flex-col border-t border-white/10 pb-4 bg-ink absolute top-full left-0 right-0 shadow-xl"
             style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
          {['Used', 'New', 'About', 'Contact'].map(label => (
            <Link key={label} href={`/${label.toLowerCase()}`}
               onClick={() => setOpen(false)}
               className="flex items-center h-12 px-6 text-white font-medium
                          border-b border-white/5 active:bg-white/10">
              {label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
