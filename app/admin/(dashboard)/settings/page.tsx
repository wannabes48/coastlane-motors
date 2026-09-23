'use client';

// app/admin/(dashboard)/settings/page.tsx — each admin sets their own WhatsApp

import { useState, useTransition } from 'react';
import { Phone, Loader2, Check } from 'lucide-react';
import { updateMyWhatsapp } from '@/app/admin/(dashboard)/admins/actions';

export default function SettingsPage() {
  const [value, setValue] = useState('');
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [pending, start] = useTransition();

  function handleSave() {
    setError(''); setSaved(false);
    start(async () => {
      const res = await updateMyWhatsapp(value);
      if (res.ok) setSaved(true);
      else setError(res.message ?? 'Failed to save.');
    });
  }

  return (
    <div className="p-4 sm:p-6 max-w-lg mx-auto">
      <h1 className="font-[Poppins] text-[20px] font-bold text-[#0F1923] mb-1">
        My settings
      </h1>
      <p className="font-[Poppins] text-[13px] text-[#64748B] mb-8">
        Cars you post will route buyer inquiries to your WhatsApp number.
      </p>

      <div className="bg-white border border-[#E2E8F0] rounded-xl p-5">
        <label className="block font-[Poppins] text-[12px] font-semibold text-[#64748B] uppercase tracking-wide mb-2">
          Your WhatsApp number
        </label>
        <div className="flex gap-2 sm:gap-3">
          {/* ADDED min-w-0 to the wrapper */}
          <div className="flex items-center gap-2 flex-1 min-w-0 h-11 px-2 sm:px-3 border border-[#E2E8F0] rounded-lg bg-white focus-within:border-[#1565C0]">
            <Phone size={15} aria-hidden="true" className="text-[#1565C0] shrink-0" />
            
            {/* ADDED min-w-0 and w-full to the input */}
            <input
              type="tel"
              value={value}
              onChange={e => setValue(e.target.value)}
              placeholder="254712345678"
              className="flex-1 min-w-0 w-full font-[Poppins] text-[13px] text-[#0F1923] placeholder-[#94A3B8] focus:outline-none bg-transparent"
            />
          </div>
          
          {/* REDUCED mobile padding (px-3) and restored on larger screens (sm:px-5) */}
          <button
            type="button"
            onClick={handleSave}
            disabled={pending || !value}
            className="h-11 px-3 sm:px-5 shrink-0 bg-[#1565C0] hover:bg-[#0D47A1] rounded-lg font-[Poppins] text-[13px] font-semibold text-white transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {pending ? (
              <Loader2 size={14} className="animate-spin" aria-hidden="true" />
            ) : saved ? (
              <Check size={14} aria-hidden="true" />
            ) : null}
            
            {/* OPTIONAL: Hide text on tiny screens, show only icon */}
            <span className="hidden sm:inline">
              {saved ? 'Saved' : 'Save'}
            </span>
            <span className="sm:hidden">
              {saved ? 'Saved' : 'Save'}
            </span>
          </button>
        </div>
        <p className="font-[Poppins] text-[11px] text-[#94A3B8] mt-2">
          Digits only, include country code — e.g. 254712345678 for a Kenyan number.
        </p>
        {error && (
          <p className="font-[Poppins] text-[12px] text-red-600 mt-2">{error}</p>
        )}
        {saved && (
          <p className="font-[Poppins] text-[12px] text-[#1B5E20] mt-2">
            ✓ Saved. New listings you post will route inquiries to this number.
          </p>
        )}
      </div>
    </div>
  );
}
