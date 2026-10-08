import { collectBing } from './bing';
import { GOOGLE_BACKFILL_DAYS, SEARCH_REFRESH_DAYS } from './config';
import type { Env } from './env';
import { collectGoogle } from './google';
import { logJob } from './store';
import { daysAgo, errorMessage } from './util';

export interface SyncResult {
  job: 'google' | 'bing';
  ok: boolean;
  detail: string;
}

/**
 * Pull search data from every configured source. A daily sync re-reads the
 * last SEARCH_REFRESH_DAYS days, since Google keeps revising recent days;
 * a backfill reads everything Google still holds, one month at a time.
 */
export async function syncSearch(env: Env, { backfill = false } = {}): Promise<SyncResult[]> {
  const results: SyncResult[] = [];

  if (env.GSC_SERVICE_ACCOUNT) {
    try {
      const span = backfill ? GOOGLE_BACKFILL_DAYS : SEARCH_REFRESH_DAYS;
      const ranges: [string, string][] = [];
      for (let from = span; from > 0; from -= 30) ranges.push([daysAgo(from), daysAgo(Math.max(from - 29, 1))]);
      const { days, rows } = await collectGoogle(env, ranges);
      const period = `${ranges[0][0]}..${ranges[ranges.length - 1][1]}`;
      const detail =
        days === 0
          ? `${period}: connected, but Google has no data for this period yet (a newly added property can take up to a week)`
          : `${period}: ${days} days, ${rows} query rows`;
      results.push({ job: 'google', ok: true, detail });
    } catch (e) {
      results.push({ job: 'google', ok: false, detail: errorMessage(e) });
    }
  }

  if (env.BING_API_KEY) {
    try {
      results.push({ job: 'bing', ok: true, detail: await collectBing(env) });
    } catch (e) {
      results.push({ job: 'bing', ok: false, detail: errorMessage(e) });
    }
  }

  for (const r of results) await logJob(env, r.job, r.ok, r.detail);
  return results;
}
