import { PROMPTS } from './config';
import { ENGINES } from './engines';
import type { Env } from './env';
import { judge } from './judge';
import { logJob } from './store';
import { citesOwnSite, errorMessage, mapLimit } from './util';

// One run = every tracked prompt asked to every engine that has an API key,
// each answer graded and stored. A failure on one pair is recorded on that
// answer and does not stop the rest of the run.

const CONCURRENCY = 4;

export async function runAiCheck(env: Env, trigger: 'cron' | 'manual'): Promise<string> {
  const engines = ENGINES.filter((e) => e.enabled(env));
  if (engines.length === 0) throw new Error('No AI engine is configured (set OPENAI_API_KEY or PERPLEXITY_API_KEY)');

  const run = await env.DB.prepare('INSERT INTO ai_runs (started_at, trigger) VALUES (?, ?) RETURNING id')
    .bind(new Date().toISOString(), trigger)
    .first<{ id: number }>();
  if (!run) throw new Error('Could not create the run');

  const pairs = engines.flatMap((engine) => PROMPTS.map((prompt) => ({ engine, prompt })));
  const outcomes = await mapLimit(pairs, CONCURRENCY, async ({ engine, prompt }) => {
    const now = new Date().toISOString();
    try {
      const reply = await engine.ask(env, prompt.text);
      const verdict = await judge(env, prompt.text, reply.answer);
      await env.DB.prepare(
        `INSERT INTO ai_answers (run_id, engine, model, prompt_id, prompt, answer, sources, identity, issues, cites_own, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
        .bind(
          run.id,
          engine.id,
          reply.model,
          prompt.id,
          prompt.text,
          reply.answer,
          JSON.stringify(reply.sources),
          verdict.identity,
          JSON.stringify(verdict.issues),
          citesOwnSite(reply.sources) ? 1 : 0,
          now,
        )
        .run();
      return true;
    } catch (e) {
      await env.DB.prepare(
        `INSERT INTO ai_answers (run_id, engine, prompt_id, prompt, error, created_at) VALUES (?, ?, ?, ?, ?, ?)`,
      )
        .bind(run.id, engine.id, prompt.id, prompt.text, errorMessage(e), now)
        .run();
      return false;
    }
  });

  await env.DB.prepare('UPDATE ai_runs SET finished_at = ? WHERE id = ?').bind(new Date().toISOString(), run.id).run();
  const failed = outcomes.filter((ok) => !ok).length;
  const detail = `run ${run.id}: ${pairs.length - failed}/${pairs.length} answers` + (failed ? `, ${failed} failed` : '');
  await logJob(env, 'ai', failed === 0, detail);
  return detail;
}
