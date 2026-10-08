import { formatCareerDates, site } from '../../lib/site.mjs';
import type { Env } from './env';

// Grades each AI answer against the facts published on alexcarvalho.me
// (lib/site.mjs, the same source the website uses), so "correct" always means
// "agrees with what the site says today".

export type Identity = 'correct' | 'wrong_person' | 'not_mentioned' | 'unverified';

export interface Issue {
  claim: string;
  problem: string;
}

export interface Verdict {
  identity: Identity;
  /** The answer names Abstract Extraordinary, the studio (the visibility plan's success metric). */
  company_named: boolean;
  issues: Issue[];
}

const FACTS = {
  name: site.name,
  alsoKnownAs: site.alternateName,
  summary: site.summary,
  title: site.jobTitle,
  location: site.location.label,
  company: { name: site.company.name, url: site.company.url, description: site.company.description },
  education: `${site.education.credential}, ${site.education.name} (${site.education.year})`,
  career: site.career.map((job) => ({
    period: formatCareerDates(job),
    role: job.role,
    organisation: job.org,
    ...(job.highlight ? { detail: job.highlight } : {}),
  })),
  profiles: [site.url, ...site.sameAs],
};

const INSTRUCTIONS = `You audit what an AI assistant's answer says about one specific person.

FACTS describes him: Alexandre Carvalho, the Lisbon-based CTPO. Other people share that name (for example academics, athletes or other business people); they are not him.

Return:
- identity: whether the answer refers to HIM, the person. "correct" if it names him and describes him in a way consistent with FACTS; "wrong_person" if it presents a different Alexandre Carvalho as him, or mixes his details with another person's; "not_mentioned" if he is not named. An answer that only describes his company, without naming him, is "not_mentioned".
- company_named: true if the answer names his company, the AI engineering studio Abstract Extraordinary described in FACTS.company (a variant spelling such as "Abstract & Extraordinary" counts when it clearly refers to that studio); false otherwise, including when it is mentioned only as an unnamed source.
- issues: statements about him, or about his company Abstract Extraordinary, that CONTRADICT FACTS: a wrong employer, role or title, dates, location, company name or achievement. Quote the claim briefly and say what FACTS says instead. Do not report claims that FACTS simply does not cover; they may well be true. Ignore statements about other people and companies. Do not report omissions. Use an empty list when there are none.`;

const SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['identity', 'company_named', 'issues'],
  properties: {
    identity: { type: 'string', enum: ['correct', 'wrong_person', 'not_mentioned'] },
    company_named: { type: 'boolean' },
    issues: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['claim', 'problem'],
        properties: { claim: { type: 'string' }, problem: { type: 'string' } },
      },
    },
  },
};

const NAME_PATTERN = /\b(alexandre|alex)\s+(m\.?\s+)?carvalho\b/i;
const COMPANY_PATTERN = /\babstract\s*(&|and)?\s*extraordinary\b/i;

export async function judge(env: Env, question: string, answer: string): Promise<Verdict> {
  // Without an OpenAI key there is no grader: fall back to name matches, which
  // cannot tell him apart from other people with the same name.
  if (!env.OPENAI_API_KEY) {
    return {
      identity: NAME_PATTERN.test(answer) ? 'unverified' : 'not_mentioned',
      company_named: COMPANY_PATTERN.test(answer),
      issues: [],
    };
  }

  const res = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: { authorization: `Bearer ${env.OPENAI_API_KEY}`, 'content-type': 'application/json' },
    body: JSON.stringify({
      model: env.JUDGE_MODEL,
      instructions: INSTRUCTIONS,
      input: JSON.stringify({ FACTS, question, answer }),
      text: { format: { type: 'json_schema', name: 'verdict', strict: true, schema: SCHEMA } },
    }),
    signal: AbortSignal.timeout(60_000),
  });
  if (!res.ok) throw new Error(`Grader ${res.status}: ${(await res.text()).slice(0, 300)}`);

  const body = (await res.json()) as { output?: { type: string; content?: { type: string; text?: string }[] }[] };
  const text = (body.output ?? [])
    .flatMap((item) => (item.type === 'message' ? (item.content ?? []) : []))
    .find((c) => c.type === 'output_text')?.text;
  if (!text) throw new Error('Grader returned no verdict');
  return JSON.parse(text) as Verdict;
}
