'use client';
import { useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export function ViewCounter({ slug }: { slug: string }) {
  useEffect(() => {
    const key = `viewed_${slug}`;
    const now = Date.now();
    const existing = localStorage.getItem(key);
    
    if (existing) {
      const parsed = parseInt(existing, 10);
      if (!isNaN(parsed) && (now - parsed < 24 * 60 * 60 * 1000)) {
        return; // already counted in the last 24h
      }
    }
    const sb = createClient();
    sb.rpc('bump_views', { p_slug: slug }).then(({ error }: { error: any }) => {
      if (error) {
        console.error('[ViewCounter] bump_views failed:', error.message, error.code);
        return;
      }
      localStorage.setItem(key, now.toString());
    });
  }, [slug]);

  return null;
}
