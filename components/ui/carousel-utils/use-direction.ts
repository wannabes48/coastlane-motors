'use client';

import { useEffect, useState } from 'react';

export function useDirection(): 'ltr' | 'rtl' {
  const [dir, setDir] = useState<'ltr' | 'rtl'>('ltr');
  useEffect(() => {
    const el = document.documentElement;
    setDir((el.getAttribute('dir') as 'ltr' | 'rtl') || 'ltr');
  }, []);
  return dir;
}
