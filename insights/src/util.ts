import { BRAND_TERMS, OWN_SOURCES } from './config';

export const isBrandQuery = (query: string): boolean => {
  const q = query.toLowerCase();
  return BRAND_TERMS.some((term) => q.includes(term));
};

/** Label of the owned property a URL belongs to, or null for third-party sources. */
export function ownSourceLabel(url: string): string | null {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }
  return OWN_SOURCES.find((s) => s.matches(parsed))?.label ?? null;
}

/** Whether any source belongs to the owned property with this OWN_SOURCES label. */
export const citesSource = (sources: string[], label: string): boolean =>
  sources.some((s) => ownSourceLabel(s) === label);

/** Bing's WCF JSON dates: "/Date(1399100400000)/" or "/Date(1399100400000-0700)/" -> "2014-05-03". */
export function parseBingDate(value: string): string {
  const match = /\/Date\((-?\d+)(?:[+-]\d{4})?\)\//.exec(value);
  if (!match) throw new Error(`Unrecognised Bing date: ${value}`);
  // The millisecond count is already UTC; Bing's buckets start at Pacific
  // midnight (07:00/08:00 UTC), so the UTC calendar date is the bucket date.
  return new Date(Number(match[1])).toISOString().slice(0, 10);
}

export const isoDate = (d: Date): string => d.toISOString().slice(0, 10);

export function daysAgo(n: number, from = new Date()): string {
  const d = new Date(Date.UTC(from.getUTCFullYear(), from.getUTCMonth(), from.getUTCDate()));
  d.setUTCDate(d.getUTCDate() - n);
  return isoDate(d);
}

/** Monday of the ISO week containing `date` (YYYY-MM-DD). */
export function weekStart(date: string): string {
  const d = new Date(`${date}T00:00:00Z`);
  const offset = (d.getUTCDay() + 6) % 7;
  d.setUTCDate(d.getUTCDate() - offset);
  return isoDate(d);
}

/**
 * De-duplicated http(s) URLs in first-seen order, without tracking parameters.
 * Anything else (malformed, javascript:, data:) is dropped: these URLs come
 * from third-party APIs and end up as links on the dashboard.
 */
export function uniqueUrls(urls: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of urls) {
    let url: string;
    try {
      const u = new URL(raw);
      if (u.protocol !== 'https:' && u.protocol !== 'http:') continue;
      for (const key of [...u.searchParams.keys()]) if (key.startsWith('utm_')) u.searchParams.delete(key);
      url = u.toString();
    } catch {
      continue;
    }
    if (!seen.has(url)) {
      seen.add(url);
      out.push(url);
    }
  }
  return out;
}

/** Run `fn` over `items` with at most `limit` in flight; results keep input order. */
export async function mapLimit<T, R>(items: T[], limit: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const results = new Array<R>(items.length);
  let next = 0;
  const worker = async () => {
    while (next < items.length) {
      const i = next++;
      results[i] = await fn(items[i]);
    }
  };
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}

export interface FetchedText {
  status: number;
  ok: boolean;
  body: string;
}

/**
 * Make a request, retrying while `isTransient` says the failure is temporary
 * (rate limits, throttling, 5xx). Waits `delaysMs[n]` before retry n, or the
 * server's Retry-After when it sends one (capped at 30s). `request` is called
 * afresh per attempt so per-attempt timeouts restart.
 */
export async function fetchRetrying(
  request: () => Promise<Response>,
  isTransient: (status: number, body: string) => boolean,
  delaysMs: number[] = [5_000, 20_000],
): Promise<FetchedText> {
  for (let attempt = 0; ; attempt++) {
    const res = await request();
    const body = await res.text();
    if (attempt >= delaysMs.length || !isTransient(res.status, body)) {
      return { status: res.status, ok: res.ok, body };
    }
    const retryAfter = Number(res.headers.get('retry-after'));
    const wait = retryAfter > 0 ? Math.min(retryAfter * 1000, 30_000) : delaysMs[attempt];
    const { promise, resolve } = Promise.withResolvers<void>();
    setTimeout(resolve, wait);
    await promise;
  }
}

export const errorMessage = (e: unknown): string => (e instanceof Error ? e.message : String(e));
