'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Check if user has already consented
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      setShow(true);
    }
  }, []);

  const accept = () => {
    localStorage.setItem('cookie_consent', 'true');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-ink text-white p-4 md:p-6 shadow-2xl border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="text-sm text-white/80 max-w-3xl">
        We use cookies and similar technologies (like local storage) to ensure you get the best experience on our website, remember your vehicle preferences, and analyze our traffic. By clicking "Accept", you consent to our use of these technologies. Read our <Link href="/privacy-policy" className="underline hover:text-white">Privacy Policy</Link> and <Link href="/terms" className="underline hover:text-white">Terms of Service</Link> for more details.
      </div>
      <div className="flex shrink-0 gap-3 w-full md:w-auto">
        <button 
          onClick={accept}
          className="bg-azure hover:bg-azure-ink text-white font-semibold py-2 px-6 rounded-full transition-colors w-full md:w-auto text-sm"
        >
          Accept
        </button>
      </div>
    </div>
  );
}
