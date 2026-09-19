// lib/slug.ts — 2019-bmw-x5-xdrive40i-a1b2
export const buildSlug = (v: { year: number; make: string; model: string }) =>
  [v.year, v.make, v.model]
    .filter(Boolean).join(' ').toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-')
    + '-' + Math.random().toString(36).slice(2, 6);
