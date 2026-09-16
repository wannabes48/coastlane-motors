'use client';
import { useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export function ViewCounter({ slug }: { slug: string }) {
  useEffect(() => {
    const key = `viewed_${slug}`;
    if (sessionStorage.getItem(key)) return;   // already counted this session
    sessionStorage.setItem(key, '1');
    
    const sb = createClient();
    sb.rpc('bump_views', { p_slug: slug });   // fire-and-forget, no await needed
  }, [slug]);

  return null;
}
