import { supabaseServer } from './supabase/server';

export type Filters = {
  condition?: 'used' | 'new';
  q?: string;
  make?: string; body?: string; fuel?: string; transmission?: string; city?: string;
  min?: number; max?: number; yearFrom?: number;
  sort?: 'newest' | 'price_asc' | 'price_desc' | 'mileage_asc';
  page?: number;
};

const PAGE_SIZE = 12;

export async function listVehicles(f: Filters) {
  const supabase = await supabaseServer();
  let q = supabase.from('vehicles')
    .select('*', { count: 'exact' })
    .in('status', ['published', 'sold']);

  if (f.condition)    q = q.eq('condition', f.condition);
  if (f.q)            q = q.ilike('search_text', `%${f.q.toLowerCase()}%`);
  if (f.make)         q = q.ilike('make', f.make);
  if (f.city)         q = q.ilike('city', f.city);
  if (f.body)         q = q.eq('body_type', f.body);
  if (f.fuel)         q = q.eq('fuel', f.fuel);
  if (f.transmission) q = q.eq('transmission', f.transmission);
  if (f.min)          q = q.gte('price_kes', f.min);
  if (f.max)          q = q.lte('price_kes', f.max);
  if (f.yearFrom)     q = q.gte('year', f.yearFrom);

  q = q.order('status', { ascending: true });        // published before sold
  if (f.sort === 'price_asc')   q = q.order('price_kes', { ascending: true,  nullsFirst: false });
  else if (f.sort === 'price_desc') q = q.order('price_kes', { ascending: false, nullsFirst: false });
  else if (f.sort === 'mileage_asc') q = q.order('mileage_km', { ascending: true, nullsFirst: false });
  else q = q.order('created_at', { ascending: false });

  const page = Math.max(1, f.page ?? 1);
  const from = (page - 1) * PAGE_SIZE;
  const to   = from + PAGE_SIZE - 1;

  const { data, count, error } = await q.range(from, to);
  if (error) throw error;

  return {
    vehicles: data ?? [],
    total:    count ?? 0,
    page,
    pages:    Math.ceil((count ?? 0) / PAGE_SIZE),
  };
}

export async function getVehicle(slug: string) {
  const supabase = await supabaseServer();
  const { data } = await supabase.from('vehicles').select('*').eq('slug', slug)
    .in('status', ['published', 'sold']).maybeSingle();
  return data;
}

export async function getCategoryCounts() {
  const supabase = await supabaseServer();
  const { data } = await supabase.from('vehicles')
    .select('body_type')
    .in('status', ['published', 'sold']);
    
  const counts: Record<string, number> = {};
  if (data) {
    for (const row of data) {
      if (row.body_type) {
        counts[row.body_type] = (counts[row.body_type] || 0) + 1;
      }
    }
  }
  return counts;
}

// ─── StaffPick ────────────────────────────────────────────────────────────────

export async function getFeaturedVehicle() {
  const supabase = await supabaseServer();
  const { data } = await supabase
    .from('vehicles')
    .select('*')
    .eq('featured', true)
    .eq('status', 'published')
    .maybeSingle();
  return data;
}

// ─── StatsBand ────────────────────────────────────────────────────────────────

export async function getStats() {
  const supabase = await supabaseServer();

  const [{ count: total }, { count: sold }] = await Promise.all([
    supabase
      .from('vehicles')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'published'),
    supabase
      .from('vehicles')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'sold'),
  ]);

  return {
    total: total ?? 0,
    sold: sold ?? 0,
    years: new Date().getFullYear() - 2016, // update founding year
  };
}

// ─── RecentlySold ─────────────────────────────────────────────────────────────

export async function getRecentlySold(limit = 4) {
  const supabase = await supabaseServer();
  const { data } = await supabase
    .from('vehicles')
    .select('id, slug, make, model, year, price_kes, images, condition')
    .eq('status', 'sold')
    .order('sold_at', { ascending: false })
    .limit(limit);
  return data ?? [];
}

// ─── BudgetFinder ─────────────────────────────────────────────────────────────

type Bucket = { min: number | null; max: number | null };

const BUCKETS: Bucket[] = [
  { min: null,      max: 1_000_000  },
  { min: 1_000_000, max: 2_500_000  },
  { min: 2_500_000, max: 5_000_000  },
  { min: 5_000_000, max: null       },
];

export async function getBudgetCounts(): Promise<(number | null)[]> {
  const supabase = await supabaseServer();

  const results = await Promise.all(
    BUCKETS.map(({ min, max }) => {
      let q = supabase
        .from('vehicles')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'published');
      if (min != null) q = q.gte('price_kes', min);
      if (max != null) q = q.lt('price_kes', max);
      return q;
    }),
  );

  return results.map(({ count }) => count ?? null);
}

// ─── Adjacent cars (prev / next by created_at) ────────────────────────────────

export async function getAdjacentVehicles(
  currentId: string,
  condition: 'used' | 'new',
  createdAt: string,
) {
  const supabase = await supabaseServer();

  const cols = 'id, slug, make, model, year, price_kes, images, condition';

  const [{ data: prevData }, { data: nextData }] = await Promise.all([
    supabase
      .from('vehicles')
      .select(cols)
      .eq('status', 'published')
      .eq('condition', condition)
      .neq('id', currentId)
      .lt('created_at', createdAt)
      .order('created_at', { ascending: false })
      .limit(1),

    supabase
      .from('vehicles')
      .select(cols)
      .eq('status', 'published')
      .eq('condition', condition)
      .neq('id', currentId)
      .gt('created_at', createdAt)
      .order('created_at', { ascending: true })
      .limit(1),
  ]);

  return {
    prev: prevData?.[0] ?? null,
    next: nextData?.[0] ?? null,
  };
}

// ─── Similar cars ─────────────────────────────────────────────────────────────

export async function getSimilarVehicles(
  currentId: string,
  bodyType: string | null,
  priceKes: number | null,
  condition: 'used' | 'new',
) {
  const supabase = await supabaseServer();
  const LIMIT = 4;

  const cols = 'id, slug, make, model, year, price_kes, images, condition, body_type, mileage_km, transmission, city';

  // ── pass 1: same body type ──
  let byBody: any[] = [];
  if (bodyType) {
    const { data } = await supabase
      .from('vehicles')
      .select(cols)
      .eq('status', 'published')
      .eq('body_type', bodyType)
      .neq('id', currentId)
      .limit(LIMIT);
    byBody = data ?? [];
  }

  if (byBody.length >= LIMIT) return byBody.slice(0, LIMIT);

  // ── pass 2: fill with price-range neighbours ──
  const existingIds = new Set([currentId, ...byBody.map((c) => c.id)]);
  let byPrice: any[] = [];

  if (priceKes) {
    const margin = 0.4;
    const min = Math.round(priceKes * (1 - margin));
    const max = Math.round(priceKes * (1 + margin));

    const { data } = await supabase
      .from('vehicles')
      .select(cols)
      .eq('status', 'published')
      .neq('id', currentId)
      .gte('price_kes', min)
      .lte('price_kes', max)
      .order('price_kes', { ascending: true })
      .limit(LIMIT * 2);

    byPrice = (data ?? []).filter((c) => !existingIds.has(c.id));
  }

  return [...byBody, ...byPrice].slice(0, LIMIT);
}
