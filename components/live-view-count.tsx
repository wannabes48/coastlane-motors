'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Eye } from 'lucide-react';

export function LiveViewCount({ slug, initial }: { slug: string; initial: number }) {
  const [count, setCount] = useState(initial);

  useEffect(() => {
    createClient()
      .from('vehicles')
      .select('views')
      .eq('slug', slug)
      .single()
      .then(({ data }: { data: any }) => {
        if (data?.views != null) setCount(data.views);
      });
  }, [slug]);

  return (
    <span className="flex items-center gap-1.5 text-slate text-sm">
      <Eye size={15} aria-hidden="true" />
      {count.toLocaleString()} {count === 1 ? 'view' : 'views'}
    </span>
  );
}
