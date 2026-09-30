// Best-effort in-memory sliding-window limiter.
// On serverless hosts each instance keeps its own counters, so this blunts
// casual abuse only. Swap for a shared store (Upstash, Vercel KV) for a hard cap.

const buckets = new Map<string, number[]>();
const MAX_KEYS = 5000;

export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const hits = (buckets.get(key) ?? []).filter(t => now - t < windowMs);

  if (hits.length >= limit) {
    buckets.set(key, hits);
    return false;
  }

  hits.push(now);
  buckets.set(key, hits);

  if (buckets.size > MAX_KEYS) {
    for (const [k, v] of buckets) {
      if (v.every(t => now - t >= windowMs)) buckets.delete(k);
    }
  }
  return true;
}

export function clientIp(req: Request): string {
  const fwd = req.headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0].trim();
  return req.headers.get('x-real-ip') ?? 'unknown';
}
