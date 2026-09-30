// lib/redis.ts
import { Redis } from '@upstash/redis';

export const redis = new Redis({
  url:   process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// TTLs in seconds — one place to tune them
export const TTL = {
  listings:    60 * 5,    // 5 min — listing pages
  vehicle:     60 * 10,   // 10 min — detail pages
  counts:      60 * 5,    // 5 min — tab badges, category counts
  stats:       60 * 60,   // 1 hr — homepage stats band
  featured:    60 * 10,   // 10 min — staff pick
  recentSold:  60 * 15,   // 15 min — recently sold
  budgetCounts:60 * 5,    // 5 min — budget finder counts
} as const;