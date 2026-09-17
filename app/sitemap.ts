import { supabaseAdmin } from '@/lib/supabase/admin';

export default async function sitemap() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  
  let vehicles: any[] = [];
  try {
    const { data } = await supabaseAdmin.from('vehicles')
      .select('slug, updated_at, status').in('status', ['published','sold']);
    vehicles = data || [];
  } catch (e) {
    console.error('Sitemap fetch error:', e);
  }

  return [
    { url: base, priority: 1, changeFrequency: 'daily' as const },
    { url: `${base}/used`, priority: 0.9, changeFrequency: 'daily' as const },
    { url: `${base}/used/mombasa`, priority: 0.8, changeFrequency: 'daily' as const },
    { url: `${base}/used/nairobi`, priority: 0.8, changeFrequency: 'daily' as const },
    { url: `${base}/used/toyota`, priority: 0.8, changeFrequency: 'daily' as const },
    { url: `${base}/used/suv`, priority: 0.8, changeFrequency: 'daily' as const },
    { url: `${base}/used/under-1-million`, priority: 0.8, changeFrequency: 'daily' as const },
    { url: `${base}/new`,  priority: 0.9, changeFrequency: 'daily' as const },
    { url: `${base}/about`, priority: 0.4 },
    { url: `${base}/contact`, priority: 0.5 },
    ...vehicles.map(v => ({
      url: `${base}/cars/${v.slug}`,
      lastModified: v.updated_at ? new Date(v.updated_at) : new Date(),
      priority: v.status === 'sold' ? 0.3 : 0.8,
      changeFrequency: 'weekly' as const,
    })),
  ];
}
