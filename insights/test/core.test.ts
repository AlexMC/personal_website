import { describe, expect, it } from 'vitest';
import { brandRecognition, type AnswerRow, type RunSummary } from '../src/data';
import { parseOpenAI, parsePerplexity } from '../src/engines';
import { citesOwnSite, isBrandQuery, ownSourceLabel, parseBingDate, uniqueUrls, weekStart } from '../src/util';

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

  it('counts only the personal site as citing the site', () => {
    expect(citesOwnSite(['https://abstractextraordinary.com/'])).toBe(false);
    expect(citesOwnSite(['https://example.com', 'https://alexcarvalho.me/'])).toBe(true);
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

describe('brandRecognition', () => {
  const answer = (over: Partial<AnswerRow>): AnswerRow => ({
    id: 1,
    run_id: 1,
    engine: 'chatgpt',
    model: null,
    prompt_id: 'who',
    prompt: '',
    answer: '',
    sources: [],
    identity: 'correct',
    issues: [],
    cites_own: false,
    error: null,
    created_at: '',
    ...over,
  });

  it('scores only graded brand prompts for the engine', () => {
    const run: RunSummary = {
      id: 1,
      started_at: '',
      finished_at: null,
      trigger: 'manual',
      answers: [
        answer({ prompt_id: 'who', identity: 'correct' }),
        answer({ prompt_id: 'metaphysic', identity: 'wrong_person' }),
        answer({ prompt_id: 'streetbees', identity: null, error: 'timeout' }), // failed: not counted
        answer({ prompt_id: 'fractional-ctpo', identity: 'not_mentioned' }), // topic prompt: not counted
        answer({ engine: 'perplexity', prompt_id: 'who', identity: 'not_mentioned' }),
      ],
    };
    expect(brandRecognition(run, 'chatgpt')).toBe(0.5);
    expect(brandRecognition(run, 'perplexity')).toBe(0);
    expect(brandRecognition(run, 'gemini')).toBeNull();
  });
});
