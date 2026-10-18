// lib/queries-hero.ts
// Pulls up to 4 published vehicles to use as hero slides.
// Priority order: featured first, then most-viewed, then newest.
// Falls back to gradient slides if fewer than 2 images are available.

import { supabaseServer } from '@/lib/supabase/server';
import { cached }         from '@/lib/cache';
import { TTL }            from '@/lib/redis';

export type HeroSlideData = {
  slug:        string;
  make:        string;
  model:       string;
  year:        number;
  price_kes:   number | null;
  condition:   'used' | 'new';
  body_type:   string | null;
  city:        string | null;
  public_id:   string;        // Cloudinary public_id of the cover photo
  alt:         string;
  cta_href:    string;
};

export async function getHeroSlides(limit = 4): Promise<HeroSlideData[]> {
  return cached(
    `hero-slides:${limit}`,
    async () => {
      const supabase = await supabaseServer();

      // fetch more than needed so we can filter out any without images
      const { data } = await supabase
        .from('vehicles')
        .select('slug, make, model, year, price_kes, condition, body_type, city, images, featured, views')
        .eq('status', 'published')
        .order('featured', { ascending: false })
        .order('views',    { ascending: false })
        .order('created_at', { ascending: false })
        .limit(limit * 3);   // fetch 3× so we can filter

      if (!data?.length) return [];

      // keep only cars that have at least one image with a public_id
      const withImages = data.filter(
        (v) => Array.isArray(v.images) && v.images[0]?.public_id,
      );

      return withImages.slice(0, limit).map((v) => ({
        slug:      v.slug,
        make:      v.make,
        model:     v.model,
        year:      v.year,
        price_kes: v.price_kes,
        condition: v.condition,
        body_type: v.body_type,
        city:      v.city,
        public_id: v.images[0].public_id,
        alt:       v.images[0].alt || `${v.year} ${v.make} ${v.model} at Coastlane Motors`,
        cta_href:  `/cars/${v.slug}`,
      }));
    },
    TTL.featured,  // 10-minute cache — same as staff pick
  );
}
