'use client';

import { useState, useTransition, useRef, useEffect } from 'react';
import { Trash2, AlertTriangle, Loader2, X } from 'lucide-react';
import { deleteVehicle } from '@/app/admin/(dashboard)/actions';

type Props = {
  vehicleId: string;
  label: string;   // e.g. "2019 Toyota Harrier"
};

export function DeleteVehicleButton({ vehicleId, label }: Props) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  const [pending, startTransition] = useTransition();
  const cancelRef = useRef<HTMLButtonElement>(null);

  // focus the cancel button when the dialog opens
  useEffect(() => {
    if (open) cancelRef.current?.focus();
  }, [open]);

  // close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open]);

  function handleDelete() {
    setError('');
    startTransition(async () => {
      const result = await deleteVehicle(vehicleId);
      if (!result.ok) {
        setError(result.message ?? 'Something went wrong. Try again.');
      }
      // on success the server action redirects, so nothing more needed here
    });
  }

  return (
    <>
      {/* trigger */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Delete ${label}`}
        className="flex items-center justify-center w-9 h-9
                   border border-[#DCE9F2] rounded text-[#6B7D8F]
                   hover:border-red-300 hover:text-red-600
                   transition-colors duration-150"
      >
        <Trash2 size={15} aria-hidden="true" />
      </button>

      {/* modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-dialog-title"
        >
          {/* backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => !pending && setOpen(false)}
            aria-hidden="true"
          />

          {/* panel */}
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-sm p-6">
            {/* close */}
            <button
              type="button"
              onClick={() => setOpen(false)}
              disabled={pending}
              aria-label="Close"
              className="absolute top-4 right-4 flex items-center justify-center
                         w-8 h-8 text-[#6B7D8F] hover:text-[#16293D]
                         transition-colors disabled:opacity-50"
            >
              <X size={18} aria-hidden="true" />
            </button>

            {/* icon */}
            <div className="flex items-center justify-center w-12 h-12 rounded-full
                            bg-red-50 mb-4 mx-auto">
              <AlertTriangle size={24} aria-hidden="true" className="text-red-500" />
            </div>

            {/* copy */}
            <h2
              id="delete-dialog-title"
              className="font-[Poppins] text-[16px] font-bold text-[#16293D]
                         text-center mb-2"
            >
              Delete this listing?
            </h2>
            <p className="font-[Poppins] text-[13px] text-[#6B7D8F] text-center
                          leading-relaxed mb-1">
              <span className="font-semibold text-[#16293D]">{label}</span> will be
              permanently removed from the site and its photos deleted from Cloudinary.
            </p>
            <p className="font-[Poppins] text-[12px] text-red-500 text-center mb-6">
              This cannot be undone.
            </p>

            {/* error */}
            {error && (
              <p className="font-[Poppins] text-[12px] text-red-600 bg-red-50
                            border border-red-200 rounded px-3 py-2 mb-4 text-center">
                {error}
              </p>
            )}

            {/* actions */}
            <div className="flex gap-3">
              <button
                ref={cancelRef}
                type="button"
                onClick={() => setOpen(false)}
                disabled={pending}
                className="flex-1 h-11 border border-[#DCE9F2] rounded
                           font-[Poppins] text-[13px] font-semibold text-[#16293D]
                           hover:border-[#B5C4CC] transition-colors
                           disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={pending}
                className="flex-1 h-11 bg-red-600 hover:bg-red-700 rounded
                           font-[Poppins] text-[13px] font-semibold text-white
                           transition-colors disabled:opacity-60
                           flex items-center justify-center gap-2"
              >
                {pending ? (
                  <>
                    <Loader2 size={14} aria-hidden="true" className="animate-spin" />
                    Deleting…
                  </>
                ) : (
                  <>
                    <Trash2 size={14} aria-hidden="true" />
                    Yes, delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
