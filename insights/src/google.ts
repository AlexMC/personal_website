import { importPKCS8, SignJWT } from 'jose';
import type { Env } from './env';
import { upsertRows, upsertTotals, type SearchRow, type SearchTotal } from './store';

// Google Search Console via a service account: the Worker signs a JWT with the
// account's private key, swaps it for an access token, then reads Search
// Analytics. The service account must be added as a user on the property.

interface ServiceAccount {
  client_email: string;
  private_key: string;
}

interface AnalyticsRow {
  keys: string[];
  clicks: number;
  impressions: number;
  position: number;
}

const ROW_LIMIT = 25_000;

async function accessToken(account: ServiceAccount): Promise<string> {
  const key = await importPKCS8(account.private_key, 'RS256');
  const assertion = await new SignJWT({ scope: 'https://www.googleapis.com/auth/webmasters.readonly' })
    .setProtectedHeader({ alg: 'RS256', typ: 'JWT' })
    .setIssuer(account.client_email)
    .setAudience('https://oauth2.googleapis.com/token')
    .setIssuedAt()
    .setExpirationTime('1h')
    .sign(key);

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion }),
  });
  if (!res.ok) throw new Error(`Google sign-in failed (${res.status}): ${await res.text()}`);
  const { access_token } = (await res.json()) as { access_token: string };
  return access_token;
}

/** Every row for the range, following Google's pagination. */
async function queryAll(
  token: string,
  site: string,
  startDate: string,
  endDate: string,
  dimensions: string[],
): Promise<AnalyticsRow[]> {
  const url = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(site)}/searchAnalytics/query`;
  const all: AnalyticsRow[] = [];
  for (let startRow = 0; ; startRow += ROW_LIMIT) {
    const res = await fetch(url, {
      method: 'POST',
      headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
      body: JSON.stringify({ startDate, endDate, dimensions, rowLimit: ROW_LIMIT, startRow }),
    });
    if (!res.ok) throw new Error(`Search Console query failed (${res.status}): ${await res.text()}`);
    const { rows = [] } = (await res.json()) as { rows?: AnalyticsRow[] };
    all.push(...rows);
    if (rows.length < ROW_LIMIT) return all;
  }
}

export interface GoogleCounts {
  days: number;
  rows: number;
}

/** Fetch and store each [startDate, endDate] range; returns how much data Google had. */
export async function collectGoogle(env: Env, ranges: [string, string][]): Promise<GoogleCounts> {
  if (!env.GSC_SERVICE_ACCOUNT) throw new Error('GSC_SERVICE_ACCOUNT secret is not set');
  const token = await accessToken(JSON.parse(env.GSC_SERVICE_ACCOUNT) as ServiceAccount);
  const counts: GoogleCounts = { days: 0, rows: 0 };

  for (const [startDate, endDate] of ranges) {
    const totals: SearchTotal[] = (await queryAll(token, env.GSC_SITE, startDate, endDate, ['date'])).map((r) => ({
      date: r.keys[0],
      clicks: r.clicks,
      impressions: r.impressions,
      position: r.position,
    }));
    const rows: SearchRow[] = (
      await queryAll(token, env.GSC_SITE, startDate, endDate, ['date', 'query', 'page'])
    ).map((r) => ({
      date: r.keys[0],
      query: r.keys[1],
      page: r.keys[2],
      clicks: r.clicks,
      impressions: r.impressions,
      position: r.position,
    }));
    await upsertTotals(env, 'google', totals);
    await upsertRows(env, 'google', rows);
    counts.days += totals.length;
    counts.rows += rows.length;
  }
  return counts;
}
