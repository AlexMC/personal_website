import type { Env } from './env';
import { upsertRows, upsertTotals } from './store';
import { fetchRetrying, parseBingDate } from './util';

// Bing Webmaster API. Neither call takes a date range: each returns all the
// history Bing holds (about six months), so every sync simply upserts it all.

const BASE = 'https://ssl.bing.com/webmaster/api.svc/json';

interface TrafficStat {
  Date: string;
  Clicks: number;
  Impressions: number;
}

interface QueryStat extends TrafficStat {
  Query: string;
  AvgImpressionPosition: number;
}

async function call<T>(env: Env, method: string): Promise<T[]> {
  const params = new URLSearchParams({ siteUrl: env.BING_SITE, apikey: env.BING_API_KEY ?? '' });
  // Bing answers short bursts with HTTP 400 "ThrottleIP"; it clears within seconds to minutes.
  const res = await fetchRetrying(
    () => fetch(`${BASE}/${method}?${params}`),
    (status, body) => body.includes('ThrottleIP') || status >= 500,
    [15_000, 45_000],
  );
  if (!res.ok) throw new Error(`Bing ${method} failed (${res.status}): ${res.body}`);
  const { d } = JSON.parse(res.body) as { d: T[] | null };
  return d ?? [];
}

export async function collectBing(env: Env): Promise<string> {
  if (!env.BING_API_KEY) throw new Error('BING_API_KEY secret is not set');

  // Daily site totals. Bing reports no average position at site level.
  const traffic = await call<TrafficStat>(env, 'GetRankAndTrafficStats');
  await upsertTotals(
    env,
    'bing',
    traffic.map((t) => ({ date: parseBingDate(t.Date), clicks: t.Clicks, impressions: t.Impressions, position: null })),
  );

  // Per query, in weekly buckets. A position of 0 means "not reported".
  const queries = await call<QueryStat>(env, 'GetQueryStats');
  await upsertRows(
    env,
    'bing',
    queries.map((q) => ({
      date: parseBingDate(q.Date),
      query: q.Query,
      page: '',
      clicks: q.Clicks,
      impressions: q.Impressions,
      position: q.AvgImpressionPosition > 0 ? q.AvgImpressionPosition : null,
    })),
  );

  return `${traffic.length} days, ${queries.length} query rows`;
}
