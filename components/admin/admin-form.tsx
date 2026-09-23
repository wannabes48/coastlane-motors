'use client';

// components/admin/admin-form.tsx
// Invite a new admin — owner only.

import { useState, useTransition } from 'react';
import { Loader2, UserPlus } from 'lucide-react';
import { inviteAdmin } from '@/app/admin/(dashboard)/admins/actions';

const AVATAR_COLOURS = [
  '#1565C0','#0D47A1','#1B5E20','#4A148C',
  '#B71C1C','#E65100','#006064','#37474F',
];

export function AdminForm() {
  const [pending, start] = useTransition();
  const [error, setError]   = useState('');
  const [success, setSuccess] = useState('');
  const [colour, setColour] = useState(AVATAR_COLOURS[0]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(''); setSuccess('');
    const fd = new FormData(e.currentTarget);
    fd.set('avatar_color', colour);
    start(async () => {
      const res = await inviteAdmin(fd);
      if (res.ok) {
        setSuccess(`Invite sent to ${fd.get('email')}`);
        (e.target as HTMLFormElement).reset();
      } else {
        setError(res.message ?? 'Something went wrong.');
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block font-[Poppins] text-[11px] font-semibold
                            text-[#64748B] uppercase tracking-wide mb-1">
            Full name
          </label>
          <input name="display_name" required placeholder="e.g. Ali Hassan"
                 className="w-full h-11 px-3 font-[Poppins] text-[13px]
                            border border-[#E2E8F0] rounded-lg bg-white
                            focus:outline-none focus:border-[#1565C0]
                            text-[#0F1923] placeholder-[#94A3B8]" />
        </div>
        <div>
          <label className="block font-[Poppins] text-[11px] font-semibold
                            text-[#64748B] uppercase tracking-wide mb-1">
            Email
          </label>
          <input name="email" type="email" required placeholder="ali@coastlanemotors.co.ke"
                 className="w-full h-11 px-3 font-[Poppins] text-[13px]
                            border border-[#E2E8F0] rounded-lg bg-white
                            focus:outline-none focus:border-[#1565C0]
                            text-[#0F1923] placeholder-[#94A3B8]" />
        </div>
        <div>
          <label className="block font-[Poppins] text-[11px] font-semibold
                            text-[#64748B] uppercase tracking-wide mb-1">
            WhatsApp number
          </label>
          <input name="whatsapp" type="tel" placeholder="254712345678"
                 pattern="[0-9]{10,15}"
                 className="w-full h-11 px-3 font-[Poppins] text-[13px]
                            border border-[#E2E8F0] rounded-lg bg-white
                            focus:outline-none focus:border-[#1565C0]
                            text-[#0F1923] placeholder-[#94A3B8]" />
          <p className="font-[Poppins] text-[10px] text-[#94A3B8] mt-1">
            E.164 format — digits only, start with country code e.g. 254…
          </p>
        </div>
        <div>
          <label className="block font-[Poppins] text-[11px] font-semibold
                            text-[#64748B] uppercase tracking-wide mb-1">
            Role
          </label>
          <select name="role"
                  className="w-full h-11 px-3 font-[Poppins] text-[13px]
                             border border-[#E2E8F0] rounded-lg bg-white
                             focus:outline-none focus:border-[#1565C0] text-[#0F1923]">
            <option value="editor">Editor — can post and edit listings</option>
            <option value="owner">Owner — can also manage admins</option>
          </select>
        </div>
      </div>

      {/* avatar colour picker */}
      <div>
        <label className="block font-[Poppins] text-[11px] font-semibold
                          text-[#64748B] uppercase tracking-wide mb-2">
          Avatar colour
        </label>
        <div className="flex gap-2">
          {AVATAR_COLOURS.map(c => (
            <button key={c} type="button" onClick={() => setColour(c)}
                    aria-label={`Colour ${c}`}
                    style={{ background: c }}
                    className={`w-7 h-7 rounded-full border-2 transition-transform
                               ${colour === c ? 'border-[#0F1923] scale-110' : 'border-transparent'}`} />
          ))}
          {/* live preview */}
          <div className="w-7 h-7 rounded-full flex items-center justify-center
                          font-[Poppins] text-[10px] font-bold text-white ml-2"
               style={{ background: colour }}>
            AB
          </div>
        </div>
      </div>

      {error   && <p className="font-[Poppins] text-[12px] text-red-600">{error}</p>}
      {success && <p className="font-[Poppins] text-[12px] text-[#1B5E20]">{success}</p>}

      <button type="submit" disabled={pending}
              className="flex items-center justify-center gap-2 h-11 px-6
                         bg-[#1565C0] hover:bg-[#0D47A1] rounded-lg
                         font-[Poppins] text-[13px] font-semibold text-white
                         transition-colors disabled:opacity-60 w-fit">
        {pending
          ? <Loader2 size={16} aria-hidden="true" className="animate-spin" />
          : <UserPlus size={16} aria-hidden="true" />}
        Send invite
      </button>
    </form>
  );
}
