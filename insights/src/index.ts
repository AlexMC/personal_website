import { Hono } from 'hono';
import { runAiCheck } from './ai';
import { authorize } from './auth';
import { answer, comparePeriods, lastJobs, run, runs, topBy, weeklySeries, type Source } from './data';
import { ENGINES } from './engines';
import type { Env } from './env';
import { logJob } from './store';
import { syncSearch } from './search';
import { errorMessage } from './util';
import { answerPage, deniedPage, overviewPage, queriesPage, runPage, runsPage } from './views';

const CRON_DAILY_SEARCH = '30 6 * * *';
const CRON_WEEKLY_AI = '0 7 * * 1';

const app = new Hono<{ Bindings: Env; Variables: { email: string } }>();

app.use('*', async (c, next) => {
  const auth = await authorize(c.req.raw, c.env);
  if (!auth.ok) return c.html(deniedPage(auth.reason), 403);
  c.set('email', auth.email);

  // State-changing requests must come from the dashboard itself: the Access
  // cookie would otherwise ride along on a form posted from another site.
  if (c.req.method === 'POST') {
    const site = c.req.header('sec-fetch-site');
    const origin = c.req.header('origin');
    const sameOrigin = site ? site === 'same-origin' : origin === new URL(c.req.url).origin;
    if (!sameOrigin) return c.text('Cross-site request refused', 403);
  }
  await next();
});

app.get('/', async (c) => {
  const env = c.env;
  const [jobs, google, bing, weekly, recentRuns, topQueries] = await Promise.all([
    lastJobs(env),
    comparePeriods(env, 'google', 28),
    comparePeriods(env, 'bing', 28),
    weeklySeries(env, 26),
    runs(env, 20),
    topBy(env, 'google', 'query', 28, 15),
  ]);
  return c.html(
    overviewPage({
      email: c.get('email'),
      flash: c.req.query('msg'),
      sources: {
        google: Boolean(env.GSC_SERVICE_ACCOUNT),
        bing: Boolean(env.BING_API_KEY),
        ai: ENGINES.some((e) => e.enabled(env)),
      },
      jobs,
      google,
      bing,
      weekly,
      runs: recentRuns,
      topQueries,
    }),
  );
});

app.get('/queries', async (c) => {
  const source: Source = c.req.query('source') === 'bing' ? 'bing' : 'google';
  const days = [28, 90, 365].includes(Number(c.req.query('days'))) ? Number(c.req.query('days')) : 28;
  const [queries, pages] = await Promise.all([
    topBy(c.env, source, 'query', days, 200),
    source === 'google' ? topBy(c.env, source, 'page', days, 100) : Promise.resolve([]),
  ]);
  return c.html(queriesPage(c.get('email'), source, days, queries, pages));
});

app.get('/runs', async (c) => c.html(runsPage(c.get('email'), await runs(c.env, 100))));

app.get('/runs/:id{[0-9]+}', async (c) => {
  const found = await run(c.env, Number(c.req.param('id')));
  return found ? c.html(runPage(c.get('email'), found)) : c.notFound();
});

app.get('/answers/:id{[0-9]+}', async (c) => {
  const found = await answer(c.env, Number(c.req.param('id')));
  return found ? c.html(answerPage(c.get('email'), found)) : c.notFound();
});

app.post('/run/search', async (c) => {
  const results = await syncSearch(c.env, { backfill: c.req.query('backfill') === '1' });
  const msg = results.length
    ? results.map((r) => `${r.job}: ${r.ok ? 'ok' : 'failed'} · ${r.detail}`).join('\n')
    : 'No search source is connected yet.';
  return c.redirect(`/?msg=${encodeURIComponent(msg)}`, 303);
});

app.post('/run/ai', async (c) => {
  let msg: string;
  try {
    msg = `AI check: ${await runAiCheck(c.env, 'manual')}`;
  } catch (e) {
    msg = `AI check failed: ${errorMessage(e)}`;
  }
  return c.redirect(`/?msg=${encodeURIComponent(msg)}`, 303);
});

export default {
  fetch: app.fetch,
  async scheduled(event, env, ctx) {
    if (event.cron === CRON_DAILY_SEARCH) {
      ctx.waitUntil(syncSearch(env));
    } else if (event.cron === CRON_WEEKLY_AI) {
      ctx.waitUntil(
        runAiCheck(env, 'cron').catch((e) => logJob(env, 'ai', false, errorMessage(e))),
      );
    }
  },
} satisfies ExportedHandler<Env>;
