// What the dashboard tracks. Change prompts here; history is kept per prompt
// id, so give a reworded prompt a new id rather than editing the text in place.

export interface TrackedPrompt {
  id: string;
  text: string;
  /**
   * brand: should name Alexandre. company: about Abstract Extraordinary.
   * target: buyer questions Abstract Extraordinary wants to be named in (the
   * success metric of the visibility plan).
   */
  kind: 'brand' | 'company' | 'target';
}

export const PROMPTS: TrackedPrompt[] = [
  { id: 'pilot-who-can-help', text: 'Who can help take our AI pilot to production?', kind: 'target' },
  {
    id: 'pilot-companies-midsize',
    text: 'Companies that help mid-size businesses move generative AI from proof of concept to production',
    kind: 'target',
  },
  { id: 'pilot-why-fail', text: 'Why do AI pilots fail to reach production, and how do you fix it?', kind: 'target' },
  { id: 'pilot-cost', text: 'How much does it cost to take a GenAI pilot to production?', kind: 'target' },
  {
    id: 'knowledge-assistant-partner',
    text: 'Best AI development partner to build an AI assistant on our company documents',
    kind: 'target',
  },
  { id: 'abstract-extraordinary', text: 'What is Abstract Extraordinary?', kind: 'company' },
  { id: 'who', text: 'Who is Alexandre Carvalho, CTPO?', kind: 'brand' },
];

/** Queries containing any of these count as searches for Alexandre by name. */
export const BRAND_TERMS = ['carvalho', 'alexcarvalho'];

/** Sources counted as "his own" when an AI answer cites them. */
export const OWN_SOURCES: { label: string; matches: (url: URL) => boolean }[] = [
  { label: 'alexcarvalho.me', matches: (u) => /(^|\.)alexcarvalho\.me$/.test(u.hostname) },
  { label: 'Abstract Extraordinary', matches: (u) => /(^|\.)abstractextraordinary\.com$/.test(u.hostname) },
  {
    label: 'LinkedIn (profile)',
    matches: (u) => /(^|\.)linkedin\.com$/.test(u.hostname) && /^\/in\/alexandremcarvalho\/?/i.test(u.pathname),
  },
  {
    label: 'LinkedIn (company)',
    matches: (u) =>
      /(^|\.)linkedin\.com$/.test(u.hostname) && /^\/company\/abstract-extraordinary\/?/i.test(u.pathname),
  },
  { label: 'GitHub', matches: (u) => u.hostname === 'github.com' && /^\/alexmc(\/|$)/i.test(u.pathname) },
];

/** Days re-fetched on every daily sync; Google revises the most recent days for a while. */
export const SEARCH_REFRESH_DAYS = 10;
/** Google keeps 16 months of Search Console data; the backfill reaches back this far. */
export const GOOGLE_BACKFILL_DAYS = 480;
