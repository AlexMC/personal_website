export interface Env {
  DB: D1Database;

  // Config vars (wrangler.toml)
  GSC_SITE: string;
  BING_SITE: string;
  OPENAI_MODEL: string;
  JUDGE_MODEL: string;
  PERPLEXITY_PRESET: string;
  ACCESS_TEAM_DOMAIN: string;
  ACCESS_AUD: string;

  // Secrets (`wrangler secret put <NAME>`); every source is optional and is
  // skipped until its secret exists.
  GSC_SERVICE_ACCOUNT?: string; // the service account's JSON key, verbatim
  BING_API_KEY?: string;
  OPENAI_API_KEY?: string;
  PERPLEXITY_API_KEY?: string;

  // Local development only (.dev.vars). Ignored unless the request is to localhost.
  DEV_AUTH_BYPASS?: string;
}
