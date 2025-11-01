// Simple in-memory cache with TTL for inventory
type CacheEntry = { expiresAt: number; data: any };
const cacheStore: Map<string, CacheEntry> = new Map();
const DEFAULT_TTL_MS = 60_000; // 60s

export function makeKey(parts: any[]): string {
  return parts.map((p) => (typeof p === 'string' ? p : JSON.stringify(p))).join('|');
}

export function cacheGet(key: string): any | undefined {
  const entry = cacheStore.get(key);
  if (!entry) return undefined;
  if (Date.now() > entry.expiresAt) {
    cacheStore.delete(key);
    return undefined;
  }
  return entry.data;
}

export function cacheSet(key: string, data: any, ttlMs: number = DEFAULT_TTL_MS): void {
  cacheStore.set(key, { data, expiresAt: Date.now() + ttlMs });
}

export function invalidateProjectCache(projectId: string): void {
  const prefix = `inv:${projectId}`;
  for (const k of Array.from(cacheStore.keys())) {
    if (k.includes(prefix)) cacheStore.delete(k);
  }
}

