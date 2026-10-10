import { describe, expect, it } from 'vitest';
import { answerShare, type AnswerRow, type RunSummary } from '../src/data';
import { parseOpenAI, parsePerplexity } from '../src/engines';
import {
  citesSource,
  fetchRetrying,
  isBrandQuery,
  ownSourceLabel,
  parseBingDate,
  uniqueUrls,
  weekStart,
} from '../src/util';

describe('fetchRetrying', () => {
  const sequence = (...responses: [number, string][]) => {
    let calls = 0;
    const request = async () => {
      const [status, body] = responses[Math.min(calls++, responses.length - 1)];
      return new Response(body, { status });
    };
    return { request, calls: () => calls };
  };
  const rateLimited = (status: number) => status === 429;

  it('retries transient failures and returns the eventual success', async () => {
    const s = sequence([429, 'slow down'], [429, 'slow down'], [200, 'ok']);
    expect(await fetchRetrying(s.request, rateLimited, [0, 0])).toEqual({ status: 200, ok: true, body: 'ok' });
    expect(s.calls()).toBe(3);
  });

  it('gives up after the last delay and returns the final failure', async () => {
    const s = sequence([429, 'slow down']);
    expect(await fetchRetrying(s.request, rateLimited, [0, 0])).toMatchObject({ status: 429, ok: false });
    expect(s.calls()).toBe(3);
  });

  it('does not retry permanent failures', async () => {
    const s = sequence([401, 'bad key']);
    expect(await fetchRetrying(s.request, rateLimited, [0, 0])).toMatchObject({ status: 401 });
    expect(s.calls()).toBe(1);
  });
});

describe('parseBingDate', () => {
  it('reads plain and offset WCF dates as the bucket date', () => {
    expect(parseBingDate('/Date(1399100400000)/')).toBe('2014-05-03');
    // Pacific-midnight buckets keep their calendar date.
    expect(parseBingDate('/Date(1759302000000-0700)/')).toBe('2025-10-01');
  });

  it('rejects anything else instead of storing a bogus date', () => {
    expect(() => parseBingDate('2025-10-01')).toThrow();
  });
});

describe('uniqueUrls', () => {
  it('drops non-http links, strips utm parameters and de-duplicates', () => {
    expect(
      uniqueUrls([
        'https://alexcarvalho.me/about?utm_source=chatgpt.com',
        'https://alexcarvalho.me/about',
        'javascript:alert(1)',
        'not a url',
        'http://example.com/a?b=1',
      ]),
    ).toEqual(['https://alexcarvalho.me/about', 'http://example.com/a?b=1']);
  });
});

describe('own sources', () => {
  it('recognises his properties and nobody else’s', () => {
    expect(ownSourceLabel('https://www.alexcarvalho.me/work/streetbees')).toBe('alexcarvalho.me');
    expect(ownSourceLabel('https://pt.linkedin.com/in/alexandremcarvalho/')).toBe('LinkedIn (profile)');
    expect(ownSourceLabel('https://www.linkedin.com/in/alexandre-carvalho-b4b039b6')).toBeNull();
    expect(ownSourceLabel('https://github.com/AlexMC/personal_website')).toBe('GitHub');
    expect(ownSourceLabel('https://github.com/alexmcfarlane')).toBeNull();
    expect(ownSourceLabel('https://notalexcarvalho.me/')).toBeNull();
  });

  it('tells the personal site and the company site apart', () => {
    const sources = ['https://example.com', 'https://www.abstractextraordinary.com/blog/'];
    expect(citesSource(sources, 'Abstract Extraordinary')).toBe(true);
    expect(citesSource(sources, 'alexcarvalho.me')).toBe(false);
  });
});

describe('isBrandQuery', () => {
  it('matches name searches in any form', () => {
    expect(isBrandQuery('Alexandre Carvalho CTPO')).toBe(true);
    expect(isBrandQuery('alexcarvalho.me')).toBe(true);
    expect(isBrandQuery('fractional cto lisbon')).toBe(false);
  });
});

describe('weekStart', () => {
  it('maps every day to the Monday of its ISO week', () => {
    expect(weekStart('2026-10-05')).toBe('2026-10-05'); // Monday
    expect(weekStart('2026-10-11')).toBe('2026-10-05'); // Sunday
    expect(weekStart('2026-10-01')).toBe('2026-09-28'); // Thursday, previous month
  });
});

describe('engine responses', () => {
  it('OpenAI: joins the answer text and takes sources from url_citation annotations', () => {
    const parsed = parseOpenAI({
      output: [
        { type: 'web_search_call' },
        {
          type: 'message',
          content: [
            {
              type: 'output_text',
              text: 'Alexandre Carvalho is a CTPO.',
              annotations: [
                { type: 'url_citation', url: 'https://alexcarvalho.me/about?utm_source=openai' },
                { type: 'url_citation', url: 'https://alexcarvalho.me/about' },
                { type: 'file_citation' },
              ],
            },
          ],
        },
      ],
    });
    expect(parsed).toEqual({ answer: 'Alexandre Carvalho is a CTPO.', sources: ['https://alexcarvalho.me/about'] });
  });

  it('Perplexity: takes sources from search_results output items', () => {
    const parsed = parsePerplexity({
      output: [
        { type: 'search_results', results: [{ url: 'https://abstractextraordinary.com/' }, {}] },
        { type: 'message', content: [{ type: 'output_text', text: 'A studio.[1]' }] },
      ],
    });
    expect(parsed).toEqual({ answer: 'A studio.[1]', sources: ['https://abstractextraordinary.com/'] });
  });
});

describe('answerShare', () => {
  const answer = (over: Partial<AnswerRow>): AnswerRow => ({
    id: 1,
    run_id: 1,
    engine: 'chatgpt',
    model: null,
    prompt_id: 'pilot-who-can-help',
    prompt: '',
    answer: '',
    sources: [],
    identity: 'not_mentioned',
    company_named: false,
    issues: [],
    cites_own: false,
    cites_company: false,
    error: null,
    created_at: '',
    ...over,
  });
  const run = (answers: AnswerRow[]): RunSummary => ({ id: 1, started_at: '', finished_at: null, trigger: 'manual', answers });
  const named = (a: AnswerRow) => a.company_named === true;
  const graded = (a: AnswerRow) => a.company_named !== null;

  it('measures the company on target questions only, per engine', () => {
    const r = run([
      answer({ prompt_id: 'rag-who-builds', company_named: true }),
      answer({ prompt_id: 'rag-company-midsize', company_named: false }),
      answer({ prompt_id: 'abstract-extraordinary', company_named: true }), // company question: not a target
      answer({ prompt_id: 'who', company_named: true }), // brand question: not a target
      answer({ engine: 'perplexity', prompt_id: 'rag-company-midsize', company_named: true }),
    ]);
    expect(answerShare(r, 'chatgpt', 'target', named, graded)).toBe(0.5);
    expect(answerShare(r, 'perplexity', 'target', named, graded)).toBe(1);
    expect(answerShare(r, 'gemini', 'target', named, graded)).toBeNull();
  });

  it('leaves out failed answers and answers graded before the field existed', () => {
    const r = run([
      answer({ prompt_id: 'rag-who-builds', company_named: true }),
      answer({ prompt_id: 'rag-company-midsize', company_named: null, error: 'timeout' }),
      answer({ prompt_id: 'graphrag-consultancy', company_named: null }), // old run, not graded for this
      answer({ prompt_id: 'pilot-cost', company_named: false }), // retired prompt, no longer tracked
    ]);
    expect(answerShare(r, 'chatgpt', 'target', named, graded)).toBe(1);
  });

  it('scores Alexandre on the brand question', () => {
    const r = run([answer({ prompt_id: 'who', identity: 'correct' }), answer({ prompt_id: 'rag-company-midsize', identity: 'wrong_person' })]);
    expect(answerShare(r, 'chatgpt', 'brand', (a) => a.identity === 'correct')).toBe(1);
  });
});
