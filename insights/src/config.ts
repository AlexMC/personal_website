// What the dashboard tracks. Change prompts here; history is kept per prompt
// id, so give a reworded prompt a new id rather than editing the text in place.

export interface TrackedPrompt {
  id: string;
  text: string;
  /** brand: should name Alexandre. company: about Abstract Extraordinary. topic: open market questions. */
  kind: 'brand' | 'company' | 'topic';
}

export const PROMPTS: TrackedPrompt[] = [
  { id: 'who', text: 'Who is Alexandre Carvalho, CTPO?', kind: 'brand' },
  { id: 'metaphysic', text: 'Who was the CPTO of Metaphysic.ai?', kind: 'brand' },
  { id: 'streetbees', text: 'Who led engineering at Streetbees?', kind: 'brand' },
  { id: 'abstract-extraordinary', text: 'What is Abstract Extraordinary?', kind: 'company' },
  { id: 'fractional-ctpo', text: 'Fractional CTPO for an AI startup in Lisbon / Portugal', kind: 'topic' },
  { id: 'genai-production', text: 'Experts in taking generative AI from prototype to production in Europe', kind: 'topic' },
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
