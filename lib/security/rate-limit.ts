const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 5;
const MIN_INTERVAL_MS = 8_000;

type Bucket = {
  timestamps: number[];
};

const buckets = new Map<string, Bucket>();

function prune(bucket: Bucket, now: number) {
  bucket.timestamps = bucket.timestamps.filter((time) => now - time < WINDOW_MS);
}

export type RateLimitResult =
  | { ok: true }
  | { ok: false; retryAfterSeconds: number };

export function rateLimit(key: string): RateLimitResult {
  const now = Date.now();
  const bucket = buckets.get(key) ?? { timestamps: [] };
  prune(bucket, now);

  const last = bucket.timestamps.at(-1);
  if (last && now - last < MIN_INTERVAL_MS) {
    buckets.set(key, bucket);
    return {
      ok: false,
      retryAfterSeconds: Math.ceil((MIN_INTERVAL_MS - (now - last)) / 1000),
    };
  }

  if (bucket.timestamps.length >= MAX_REQUESTS) {
    const oldest = bucket.timestamps[0] ?? now;
    buckets.set(key, bucket);
    return {
      ok: false,
      retryAfterSeconds: Math.max(1, Math.ceil((WINDOW_MS - (now - oldest)) / 1000)),
    };
  }

  bucket.timestamps.push(now);
  buckets.set(key, bucket);
  return { ok: true };
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }

  return request.headers.get("x-real-ip")?.trim() || "unknown";
}
