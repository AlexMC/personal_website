import type { Env } from './env';
import { fetchRetrying, uniqueUrls } from './util';

// Each engine is asked the tracked prompt verbatim, with web search on and no
// system instructions, so the answer is as close as the API gets to what a
// person typing the same question would see.

export interface EngineAnswer {
  model: string;
  answer: string;
  sources: string[];
}

export interface Engine {
  id: string;
  label: string;
  enabled: (env: Env) => boolean;
  ask: (env: Env, prompt: string) => Promise<EngineAnswer>;
}

const TIMEOUT_MS = 120_000;

interface ResponsesContent {
  type: string;
  text?: string;
  annotations?: { type: string; url?: string }[];
}

interface ResponsesOutputItem {
  type: string;
  content?: ResponsesContent[];
  results?: { url?: string }[];
}

interface ResponsesBody {
  model?: string;
  output?: ResponsesOutputItem[];
  error?: { message?: string } | null;
}

/** Answer text from an OpenAI-style Responses `output` array. */
function outputText(body: ResponsesBody): string {
  return (body.output ?? [])
    .filter((item) => item.type === 'message')
    .flatMap((item) => item.content ?? [])
    .filter((c) => c.type === 'output_text')
    .map((c) => c.text ?? '')
    .join('\n')
    .trim();
}

/** OpenAI: sources are the `url_citation` annotations on the answer text. */
export function parseOpenAI(body: ResponsesBody): Omit<EngineAnswer, 'model'> {
  const urls = (body.output ?? [])
    .flatMap((item) => item.content ?? [])
    .flatMap((c) => c.annotations ?? [])
    .filter((a) => a.type === 'url_citation' && a.url)
    .map((a) => a.url as string);
  return { answer: outputText(body), sources: uniqueUrls(urls) };
}

/** Perplexity Agent API: sources are the results of its `search_results` output items. */
export function parsePerplexity(body: ResponsesBody): Omit<EngineAnswer, 'model'> {
  const urls = (body.output ?? [])
    .filter((item) => item.type === 'search_results')
    .flatMap((item) => item.results ?? [])
    .filter((r) => r.url)
    .map((r) => r.url as string);
  return { answer: outputText(body), sources: uniqueUrls(urls) };
}

async function post(url: string, apiKey: string, payload: unknown): Promise<ResponsesBody> {
  const res = await fetchRetrying(
    () =>
      fetch(url, {
        method: 'POST',
        headers: { authorization: `Bearer ${apiKey}`, 'content-type': 'application/json' },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(TIMEOUT_MS),
      }),
    (status) => status === 429 || status >= 500,
  );
  if (!res.ok) throw new Error(`${new URL(url).hostname} ${res.status}: ${res.body.slice(0, 500)}`);
  const body = JSON.parse(res.body) as ResponsesBody;
  if (body.error?.message) throw new Error(body.error.message);
  return body;
}

export const ENGINES: Engine[] = [
  {
    id: 'chatgpt',
    label: 'ChatGPT',
    enabled: (env) => Boolean(env.OPENAI_API_KEY),
    async ask(env, prompt) {
      const body = await post('https://api.openai.com/v1/responses', env.OPENAI_API_KEY!, {
        model: env.OPENAI_MODEL,
        tools: [{ type: 'web_search' }],
        input: prompt,
      });
      return { model: body.model ?? env.OPENAI_MODEL, ...parseOpenAI(body) };
    },
  },
  {
    id: 'perplexity',
    label: 'Perplexity',
    enabled: (env) => Boolean(env.PERPLEXITY_API_KEY),
    async ask(env, prompt) {
      const body = await post('https://api.perplexity.ai/v1/agent', env.PERPLEXITY_API_KEY!, {
        preset: env.PERPLEXITY_PRESET,
        input: prompt,
      });
      return { model: body.model ?? `preset:${env.PERPLEXITY_PRESET}`, ...parsePerplexity(body) };
    },
  },
];
