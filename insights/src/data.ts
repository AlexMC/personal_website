import { PROMPTS, type TrackedPrompt } from './config';
import type { Env } from './env';
import type { Identity, Issue } from './judge';
import { daysAgo, isBrandQuery, weekStart } from './util';

// Read side of the dashboard. Data volumes for a personal site are small
// (hundreds to low thousands of rows), so aggregation happens here in JS
// rather than in SQL, which keeps the brand/non-brand logic in one place.

export type Source = 'google' | 'bing';

export interface Totals {
  clicks: number;
  impressions: number;
  /** Impression-weighted average position; null when the source reports none. */
  position: number | null;
}

interface Measured {
  clicks: number;
  impressions: number;
  position: number | null;
}

function sumUp(rows: Measured[]): Totals {
  let clicks = 0;
  let impressions = 0;
  let weighted = 0;
  let weight = 0;
  for (const r of rows) {
    clicks += r.clicks;
    impressions += r.impressions;
    if (r.position !== null) {
      weighted += r.position * r.impressions;
      weight += r.impressions;
    }
  }
  return { clicks, impressions, position: weight > 0 ? weighted / weight : null };
}

/** Newest date with data for a source, or null when nothing is stored yet. */
async function latestDate(env: Env, source: Source): Promise<string | null> {
  const row = await env.DB.prepare('SELECT MAX(date) AS d FROM search_totals WHERE source = ?')
    .bind(source)
    .first<{ d: string | null }>();
  return row?.d ?? null;
}

export interface PeriodComparison {
  source: Source;
  through: string;
  current: Totals;
  previous: Totals;
  brand: Totals;
}

/** The latest `days` days with data, against the `days` before them. */
export async function comparePeriods(env: Env, source: Source, days: number): Promise<PeriodComparison | null> {
  const through = await latestDate(env, source);
  if (!through) return null;
  const end = new Date(`${through}T00:00:00Z`);
  const currentFrom = daysAgo(days - 1, end);
  const previousFrom = daysAgo(days * 2 - 1, end);

  const { results: totals } = await env.DB.prepare(
    'SELECT date, clicks, impressions, position FROM search_totals WHERE source = ? AND date >= ? AND date <= ?',
  )
    .bind(source, previousFrom, through)
    .all<Measured & { date: string }>();
  const { results: rows } = await env.DB.prepare(
    'SELECT query, clicks, impressions, position FROM search_rows WHERE source = ? AND date >= ? AND date <= ?',
  )
    .bind(source, currentFrom, through)
    .all<Measured & { query: string }>();

  return {
    source,
    through,
    current: sumUp(totals.filter((t) => t.date >= currentFrom)),
    previous: sumUp(totals.filter((t) => t.date < currentFrom)),
    brand: sumUp(rows.filter((r) => isBrandQuery(r.query))),
  };
}

export interface WeeklyPoint {
  week: string;
  google: Totals;
  googleBrand: Totals;
  bing: Totals;
}

export async function weeklySeries(env: Env, weeks: number): Promise<WeeklyPoint[]> {
  const from = weekStart(daysAgo(weeks * 7));
  const { results: totals } = await env.DB.prepare(
    'SELECT source, date, clicks, impressions, position FROM search_totals WHERE date >= ?',
  )
    .bind(from)
    .all<Measured & { source: Source; date: string }>();
  const { results: brandRows } = await env.DB.prepare(
    `SELECT date, query, clicks, impressions, position FROM search_rows WHERE source = 'google' AND date >= ?`,
  )
    .bind(from)
    .all<Measured & { date: string; query: string }>();

  const buckets = new Map<string, { google: Measured[]; googleBrand: Measured[]; bing: Measured[] }>();
  const bucket = (date: string) => {
    const week = weekStart(date);
    let b = buckets.get(week);
    if (!b) {
      b = { google: [], googleBrand: [], bing: [] };
      buckets.set(week, b);
    }
    return b;
  };
  for (const t of totals) bucket(t.date)[t.source].push(t);
  for (const r of brandRows) if (isBrandQuery(r.query)) bucket(r.date).googleBrand.push(r);

  // Drop the newest week while it is still incomplete: a partial week would
  // read as a sudden collapse at the right edge of every chart.
  const latest = totals.reduce((max, t) => (t.date > max ? t.date : max), '');
  return [...buckets.entries()]
    .filter(([week]) => daysAgo(-6, new Date(`${week}T00:00:00Z`)) <= latest)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([week, b]) => ({ week, google: sumUp(b.google), googleBrand: sumUp(b.googleBrand), bing: sumUp(b.bing) }));
}

export interface QueryStat extends Totals {
  key: string;
  brand: boolean;
}

/** Per-query (or per-page) totals over the last `days` days, most impressions first. */
export async function topBy(
  env: Env,
  source: Source,
  dimension: 'query' | 'page',
  days: number,
  limit: number,
): Promise<QueryStat[]> {
  const through = await latestDate(env, source);
  if (!through) return [];
  const from = daysAgo(days - 1, new Date(`${through}T00:00:00Z`));
  const { results } = await env.DB.prepare(
    `SELECT ${dimension} AS key, clicks, impressions, position FROM search_rows
     WHERE source = ? AND date >= ? AND date <= ? AND ${dimension} != ''`,
  )
    .bind(source, from, through)
    .all<Measured & { key: string }>();

  const groups = new Map<string, Measured[]>();
  for (const r of results) {
    const list = groups.get(r.key);
    if (list) list.push(r);
    else groups.set(r.key, [r]);
  }
  return [...groups.entries()]
    .map(([key, rows]) => ({ key, brand: isBrandQuery(key), ...sumUp(rows) }))
    .sort((a, b) => b.impressions - a.impressions || b.clicks - a.clicks)
    .slice(0, limit);
}

export interface AnswerRow {
  id: number;
  run_id: number;
  engine: string;
  model: string | null;
  prompt_id: string;
  prompt: string;
  answer: string | null;
  sources: string[];
  identity: Identity | null;
  /** Null for answers graded before company tracking existed. */
  company_named: boolean | null;
  issues: Issue[];
  cites_own: boolean;
  cites_company: boolean;
  error: string | null;
  created_at: string;
}

interface AnswerRecord extends Omit<AnswerRow, 'sources' | 'issues' | 'cites_own' | 'cites_company' | 'company_named'> {
  sources: string;
  issues: string;
  cites_own: number;
  cites_company: number;
  company_named: number | null;
}

const toAnswer = (r: AnswerRecord): AnswerRow => ({
  ...r,
  sources: JSON.parse(r.sources) as string[],
  issues: JSON.parse(r.issues) as Issue[],
  cites_own: r.cites_own === 1,
  cites_company: r.cites_company === 1,
  company_named: r.company_named === null ? null : r.company_named === 1,
});

export interface RunSummary {
  id: number;
  started_at: string;
  finished_at: string | null;
  trigger: string;
  answers: AnswerRow[];
}

export async function runs(env: Env, limit: number): Promise<RunSummary[]> {
  const { results: runRows } = await env.DB.prepare(
    'SELECT id, started_at, finished_at, trigger FROM ai_runs ORDER BY id DESC LIMIT ?',
  )
    .bind(limit)
    .all<Omit<RunSummary, 'answers'>>();
  if (runRows.length === 0) return [];

  const { results: answerRows } = await env.DB.prepare(
    `SELECT * FROM ai_answers WHERE run_id >= ? ORDER BY id`,
  )
    .bind(runRows[runRows.length - 1].id)
    .all<AnswerRecord>();
  const answers = answerRows.map(toAnswer);
  return runRows.map((run) => ({ ...run, answers: answers.filter((a) => a.run_id === run.id) }));
}

export async function run(env: Env, id: number): Promise<RunSummary | null> {
  const row = await env.DB.prepare('SELECT id, started_at, finished_at, trigger FROM ai_runs WHERE id = ?')
    .bind(id)
    .first<Omit<RunSummary, 'answers'>>();
  if (!row) return null;
  const { results } = await env.DB.prepare('SELECT * FROM ai_answers WHERE run_id = ? ORDER BY id')
    .bind(id)
    .all<AnswerRecord>();
  return { ...row, answers: results.map(toAnswer) };
}

export async function answer(env: Env, id: number): Promise<AnswerRow | null> {
  const row = await env.DB.prepare('SELECT * FROM ai_answers WHERE id = ?').bind(id).first<AnswerRecord>();
  return row ? toAnswer(row) : null;
}

/**
 * Share of an engine's answers in a run, over the current prompts of `kind`,
 * that pass `test`. Failed answers and answers graded before the measured
 * field existed (`isGraded` false) are left out; null when nothing qualifies.
 */
export function answerShare(
  run: RunSummary,
  engine: string,
  kind: TrackedPrompt['kind'],
  test: (a: AnswerRow) => boolean,
  isGraded: (a: AnswerRow) => boolean = () => true,
): number | null {
  const ids = new Set(PROMPTS.filter((p) => p.kind === kind).map((p) => p.id));
  const graded = run.answers.filter((a) => a.engine === engine && ids.has(a.prompt_id) && !a.error && isGraded(a));
  if (graded.length === 0) return null;
  return graded.filter(test).length / graded.length;
}

export interface JobStatus {
  job: string;
  at: string;
  ok: boolean;
  detail: string;
}

export async function lastJobs(env: Env): Promise<JobStatus[]> {
  const { results } = await env.DB.prepare(
    `SELECT job, at, ok, detail FROM job_log WHERE id IN (SELECT MAX(id) FROM job_log GROUP BY job) ORDER BY job`,
  ).all<{ job: string; at: string; ok: number; detail: string }>();
  return results.map((r) => ({ ...r, ok: r.ok === 1 }));
}
