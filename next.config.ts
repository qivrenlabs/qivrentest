import "server-only";

type RateRecord = {
  count: number;
  resetAt: number;
};

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 20;
const records = new Map<string, RateRecord>();

export function checkRateLimit(key: string) {
  const now = Date.now();
  const current = records.get(key);

  if (!current || current.resetAt <= now) {
    const next = { count: 1, resetAt: now + WINDOW_MS };
    records.set(key, next);
    return { allowed: true, remaining: MAX_REQUESTS - 1, resetAt: next.resetAt };
  }

  current.count += 1;
  records.set(key, current);

  if (records.size > 5_000) {
    for (const [recordKey, record] of records) {
      if (record.resetAt <= now) records.delete(recordKey);
    }
  }

  return {
    allowed: current.count <= MAX_REQUESTS,
    remaining: Math.max(0, MAX_REQUESTS - current.count),
    resetAt: current.resetAt
  };
}
