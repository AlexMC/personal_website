# insights

Private dashboard at **https://insights.alexcarvalho.me** that tracks how
alexcarvalho.me ranks over time:

- **Google Search Console** and **Bing Webmaster Tools**: clicks, impressions
  and average position, per day and per query, split into searches for the name
  and everything else. Synced daily (06:30 UTC). Stored permanently, unlike
  Search Console's 16-month window.
- **AI answers**: every prompt in `src/config.ts` is asked to ChatGPT and
  Perplexity through their APIs with web search on, weekly (Mondays 07:00 UTC).
  Each answer is graded against `../lib/site.mjs`, the same facts the website
  publishes: does it name the right Alexandre Carvalho, does it cite the site,
  and which claims are wrong.

A Cloudflare Worker (Hono) with a D1 database. Pages are server-rendered HTML
with inline SVG charts; no client JavaScript.

## Access

[Cloudflare Access](https://developers.cloudflare.com/cloudflare-one/policies/access/)
does the login. The Worker additionally verifies the Access assertion on every
request and refuses everything while `ACCESS_TEAM_DOMAIN` / `ACCESS_AUD` are
unset, so a misconfiguration fails closed. There is no `*.workers.dev` URL.

## Setup

### 1. Cloudflare Access
1. Cloudflare dashboard → **Zero Trust**. First time only: pick a team name
   (your team domain becomes `https://<team>.cloudflareaccess.com`) and the
   **Free** plan.
2. **Access → Applications → Add an application → Self-hosted**.
   - Name: `Insights`. Session duration: as you like (e.g. 1 month).
   - Application domain: subdomain `insights`, domain `alexcarvalho.me`.
   - Policy: Action **Allow**, Include **Emails** → your email.
   - Login method: **One-time PIN** (and/or Google).
3. Open the application and copy its **Application Audience (AUD) Tag**.
4. Put the team domain and AUD tag in `wrangler.toml` (`ACCESS_TEAM_DOMAIN`,
   `ACCESS_AUD`) and deploy. Neither value is secret.

### 2. Data sources
Each is optional; a source is skipped until its secret is set. From this folder:

| Secret | Where it comes from |
|---|---|
| `GSC_SERVICE_ACCOUNT` | Google Cloud: create a project, enable the **Google Search Console API**, create a service account, add a **JSON key**. Then in Search Console → Settings → **Users and permissions**, add the service account's email as a **Restricted** user. Upload with `npx wrangler secret put GSC_SERVICE_ACCOUNT < key.json` and delete the file. |
| `BING_API_KEY` | Bing Webmaster Tools → Settings → **API access** → generate. |
| `OPENAI_API_KEY` | platform.openai.com → API keys. Also grades the answers of every engine. |
| `PERPLEXITY_API_KEY` | Perplexity API portal → API keys. |

`npx wrangler secret put <NAME>` prompts for the value. Secrets take effect
immediately; no redeploy needed.

### 3. First run
Open the dashboard, press **Backfill 16 months of Google**, then **Run AI check now**.

## Development

```bash
npm install
printf 'DEV_AUTH_BYPASS=1\n' > .dev.vars        # skips Access, localhost only
npx wrangler d1 migrations apply insights --local
npm run dev                                      # http://localhost:8799
npm test && npm run typecheck
```

Wrangler needs Node 22 or newer. `DEV_AUTH_BYPASS` is honoured only for
requests to `localhost`; `npm run dev` passes `--local-upstream` so the Worker
sees that host rather than the production domain.

## Deploy

```bash
npm run migrate      # only when migrations/ changed
npm run deploy
```

## Changing what is tracked

- **Prompts**: `src/config.ts`. History is grouped by prompt `id`; give a
  reworded prompt a new id instead of editing the text in place.
- **Name searches**: `BRAND_TERMS` in `src/config.ts`.
- **Facts used for grading**: `../lib/site.mjs`, shared with the website.
- **Models**: `OPENAI_MODEL`, `JUDGE_MODEL`, `PERPLEXITY_PRESET` in `wrangler.toml`.

## Limits

API answers approximate what the consumer apps show; they do not reproduce a
given person's ChatGPT or Perplexity session. Read the AI charts as trends.
Copilot and LinkedIn have no API and are not tracked.
