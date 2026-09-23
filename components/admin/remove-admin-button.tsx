'use client';

// components/admin/remove-admin-button.tsx

import { useState, useTransition } from 'react';
import { UserMinus, Loader2 } from 'lucide-react';
import { removeAdmin } from '@/app/admin/(dashboard)/admins/actions';

export function RemoveAdminButton({ userId, name }: { userId: string; name: string }) {
  const [confirm, setConfirm] = useState(false);
  const [pending, start] = useTransition();

  if (confirm) {
    return (
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setConfirm(false)}
          className="h-8 px-3 border border-[#E2E8F0] rounded-lg
                     font-[Poppins] text-[12px] text-[#64748B]"
        >
          Cancel
        </button>
        <button
          type="button"
          disabled={pending}
          onClick={() => start(async () => { await removeAdmin(userId); })}
          className="h-8 px-3 bg-red-600 rounded-lg
                     font-[Poppins] text-[12px] font-semibold text-white
                     flex items-center gap-1.5 disabled:opacity-60"
        >
          {pending
            ? <Loader2 size={12} className="animate-spin" aria-hidden="true" />
            : 'Confirm remove'}
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setConfirm(true)}
      aria-label={`Remove ${name}`}
      className="flex items-center justify-center w-9 h-9
                 border border-[#E2E8F0] rounded-lg text-[#64748B]
                 hover:border-red-300 hover:text-red-600 transition-colors"
    >
      <UserMinus size={15} aria-hidden="true" />
    </button>
  );
}