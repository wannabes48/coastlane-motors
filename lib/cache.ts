// lib/cache.ts
import { redis, TTL } from '@/lib/redis';

/**
 * Try to get `key` from Redis.
 * On miss, call `fetcher()`, store the result, and return it.
 */
export async function cached<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = TTL.listings,
): Promise<T> {
  // 1. try cache
  try {
    const hit = await redis.get<T>(key);
    if (hit !== null) {
      console.log(`[cache] HIT  ${key}`);
      return hit;
    }
    console.log(`[cache] MISS ${key}`);
  } catch (err: any) {
    // Let Next.js dynamic-usage detection propagate — don't swallow it
    if (err?.digest === 'DYNAMIC_SERVER_USAGE') throw err;
    // Redis unavailable — fall through to DB, never crash the page
    console.error('[cache] get error:', key, err);
  }

  // 2. cache miss — fetch from DB
  const data = await fetcher();

  // 3. store in background — don't await so the response isn't delayed
  redis.setex(key, ttl, JSON.stringify(data)).catch((err) => {
    console.error('[cache] set error:', key, err);
  });

  return data;
}

/**
 * Delete one or more cache keys (call from server actions after writes).
 */
export async function bust(...keys: string[]) {
  if (!keys.length) return;
  try {
    await redis.del(...keys);
  } catch (err) {
    console.error('[cache] bust failed:', keys, err);
  }
}

/**
 * Delete all keys matching a pattern (e.g. "listings:*").
 * Uses SCAN so it's safe on large datasets.
 */
export async function bustPattern(pattern: string) {
  try {
    let cursor = 0;
    do {
      const [next, keys] = await redis.scan(cursor, {
        match: pattern,
        count: 100,
      });
      cursor = Number(next);
      if (keys.length) await redis.del(...keys);
    } while (cursor !== 0);
  } catch (err) {
    console.error('[cache] bustPattern failed:', pattern, err);
  }
}