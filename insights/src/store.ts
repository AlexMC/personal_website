import type { Env } from './env';

export interface SearchTotal {
  date: string;
  clicks: number;
  impressions: number;
  position: number | null;
}

export interface SearchRow extends SearchTotal {
  query: string;
  page: string;
}

// D1 runs a batch as one transaction; chunking keeps each well under the
// per-batch limits even on a large backfill.
const BATCH_SIZE = 100;

async function runInBatches(db: D1Database, statements: D1PreparedStatement[]): Promise<void> {
  for (let i = 0; i < statements.length; i += BATCH_SIZE) {
    await db.batch(statements.slice(i, i + BATCH_SIZE));
  }
}

export async function upsertTotals(env: Env, source: string, totals: SearchTotal[]): Promise<void> {
  const stmt = env.DB.prepare(
    `INSERT INTO search_totals (source, date, clicks, impressions, position) VALUES (?, ?, ?, ?, ?)
     ON CONFLICT (source, date) DO UPDATE SET
       clicks = excluded.clicks, impressions = excluded.impressions, position = excluded.position`,
  );
  await runInBatches(
    env.DB,
    totals.map((t) => stmt.bind(source, t.date, t.clicks, t.impressions, t.position)),
  );
}

export async function upsertRows(env: Env, source: string, rows: SearchRow[]): Promise<void> {
  const stmt = env.DB.prepare(
    `INSERT INTO search_rows (source, date, query, page, clicks, impressions, position) VALUES (?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT (source, date, query, page) DO UPDATE SET
       clicks = excluded.clicks, impressions = excluded.impressions, position = excluded.position`,
  );
  await runInBatches(
    env.DB,
    rows.map((r) => stmt.bind(source, r.date, r.query, r.page, r.clicks, r.impressions, r.position)),
  );
}

export async function logJob(env: Env, job: string, ok: boolean, detail: string): Promise<void> {
  await env.DB.prepare('INSERT INTO job_log (at, job, ok, detail) VALUES (?, ?, ?, ?)')
    .bind(new Date().toISOString(), job, ok ? 1 : 0, detail)
    .run();
}
