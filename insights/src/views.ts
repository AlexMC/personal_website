import { html, raw } from 'hono/html';
import type { HtmlEscapedString } from 'hono/utils/html';
import { lineChart } from './chart';
import { PROMPTS } from './config';
import {
  answerShare,
  type AnswerRow,
  type JobStatus,
  type PeriodComparison,
  type QueryStat,
  type RunSummary,
  type Source,
  type WeeklyPoint,
} from './data';
import { ENGINES } from './engines';
import { ownSourceLabel } from './util';

type View = HtmlEscapedString | Promise<HtmlEscapedString>;

const COLORS = { green: '#00FF9E', teal: '#00AB70', cyan: '#4DD0E1', amber: '#FFC857', red: '#FF6B6B' };
const ENGINE_COLOR: Record<string, string> = { chatgpt: COLORS.green, perplexity: COLORS.cyan };
const ENGINE_LABEL: Record<string, string> = Object.fromEntries(ENGINES.map((e) => [e.id, e.label]));

const int = new Intl.NumberFormat('en-GB', { maximumFractionDigits: 0 });
const formatPct = (n: number) => `${Math.round(n * 100)}%`;
const formatPos = (n: number | null) => (n === null ? '—' : n.toFixed(1));
const shortDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' });

const CSS = `
  :root{--bg:#000;--surface:#0d0f0e;--line:#16352a;--fg:#00FF9E;--muted:#00AB70;--dim:#4e7a68;--warn:#FFC857;--bad:#FF6B6B}
  *{box-sizing:border-box}
  body{margin:0;background:var(--bg);color:var(--muted);font:14px/1.5 ui-monospace,SFMono-Regular,Menlo,"JetBrains Mono",monospace}
  a{color:var(--fg)}
  header{border-bottom:1px solid var(--line);padding:18px 28px;display:flex;gap:28px;align-items:baseline;flex-wrap:wrap}
  header b{color:var(--fg);letter-spacing:.08em}
  nav a{margin-right:18px;text-decoration:none;color:var(--muted)} nav a:hover,nav a.on{color:var(--fg)}
  header .who{margin-left:auto;color:var(--dim);font-size:12px}
  main{max-width:1100px;margin:0 auto;padding:28px}
  h1{color:var(--fg);font-size:20px;margin:0 0 18px} h2{color:var(--fg);font-size:15px;margin:36px 0 12px;letter-spacing:.04em}
  .cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:12px}
  .card{border:1px solid var(--line);background:var(--surface);padding:14px 16px}
  .card .k{font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--dim)}
  .card .v{font-size:24px;color:var(--fg);margin-top:4px}
  .card .d{font-size:12px} .up{color:var(--fg)} .down{color:var(--bad)}
  .panel{border:1px solid var(--line);background:var(--surface);padding:16px}
  .two{display:grid;grid-template-columns:1fr 1fr;gap:16px} @media(max-width:860px){.two{grid-template-columns:1fr}}
  .chart{width:100%;height:auto;display:block} .chart .grid{stroke:var(--line)} .chart .axis{fill:var(--dim);font-size:11px}
  .legend{display:flex;gap:16px;flex-wrap:wrap;font-size:12px;margin-bottom:6px} .key i{display:inline-block;width:10px;height:10px;margin-right:6px}
  table{width:100%;border-collapse:collapse} th,td{text-align:left;padding:7px 10px;border-bottom:1px solid var(--line);vertical-align:top}
  th{font-weight:normal;color:var(--dim);font-size:11px;letter-spacing:.08em;text-transform:uppercase} td.n{text-align:right;font-variant-numeric:tabular-nums}
  .tag{font-size:10px;border:1px solid var(--line);padding:1px 6px;margin-left:6px;color:var(--dim)}
  .ok{color:var(--fg)} .bad{color:var(--bad)} .warn{color:var(--warn)} .muted{color:var(--dim)}
  .status{display:flex;gap:22px;flex-wrap:wrap;font-size:12px;margin-bottom:22px}
  form{display:inline} button{background:none;border:1px solid var(--muted);color:var(--fg);font:inherit;padding:6px 12px;cursor:pointer;margin:0 8px 8px 0} button:hover{border-color:var(--fg)}
  .flash{border:1px solid var(--muted);padding:10px 14px;margin-bottom:22px;color:var(--fg);white-space:pre-wrap}
  .answer{white-space:pre-wrap;border-left:2px solid var(--line);padding-left:14px}
  .empty{color:var(--dim)}
  .filters a{margin-right:12px}
`;

function layout(title: string, active: string, email: string, body: View, flash?: string): View {
  const link = (href: string, label: string) =>
    html`<a href="${href}" class="${active === href ? 'on' : ''}">${label}</a>`;
  return html`<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow"><title>${title} · insights</title><style>${raw(CSS)}</style></head>
<body><header><b>INSIGHTS</b><nav>${link('/', 'Overview')}${link('/queries', 'Queries')}${link('/runs', 'AI runs')}</nav>
<span class="who">${email}</span></header>
<main>${flash ? html`<div class="flash">${flash}</div>` : ''}${body}</main></body></html>`;
}

function delta(current: number, previous: number): View {
  if (previous === 0) return html`<span class="muted">no prior data</span>`;
  const change = (current - previous) / previous;
  return html`<span class="${change === 0 ? 'muted' : change > 0 ? 'up' : 'down'}">${change > 0 ? '+' : ''}${formatPct(change)} vs prior 28d</span>`;
}

/** Ranking change in places; moving up means a smaller number. */
function positionDelta(current: number, previous: number): View {
  const places = previous - current;
  const text = Math.abs(places) < 0.05 ? 'no change' : `${places > 0 ? '▲' : '▼'} ${Math.abs(places).toFixed(1)} places`;
  return html`<span class="${places > 0 ? 'up' : places < 0 ? 'down' : 'muted'}">${text} vs prior 28d</span>`;
}

function card(label: string, value: string, detail: View | string = ''): View {
  return html`<div class="card"><div class="k">${label}</div><div class="v">${value}</div><div class="d">${detail}</div></div>`;
}

function searchCards(google: PeriodComparison | null, bing: PeriodComparison | null): View {
  const cards: View[] = [];
  if (google) {
    cards.push(
      card('Google clicks · 28d', int.format(google.current.clicks), delta(google.current.clicks, google.previous.clicks)),
      card('Google impressions · 28d', int.format(google.current.impressions), delta(google.current.impressions, google.previous.impressions)),
      card(
        'Google avg position',
        formatPos(google.current.position),
        google.current.position !== null && google.previous.position !== null
          ? positionDelta(google.current.position, google.previous.position)
          : '',
      ),
      card('Name searches · position', formatPos(google.brand.position), `${int.format(google.brand.impressions)} impressions`),
    );
  }
  if (bing) {
    cards.push(
      card('Bing clicks · 28d', int.format(bing.current.clicks), delta(bing.current.clicks, bing.previous.clicks)),
      card('Bing impressions · 28d', int.format(bing.current.impressions), delta(bing.current.impressions, bing.previous.impressions)),
    );
  }
  if (cards.length === 0) return html`<p class="empty">No search data yet. Run a search sync once a source is connected.</p>`;
  return html`<div class="cards">${cards}</div>`;
}

/**
 * One answer in the run grid: for target and company questions the headline is
 * whether Abstract Extraordinary is named; for the brand question, whether
 * Alexandre is recognised.
 */
function answerCell(a: AnswerRow): View {
  if (a.error) return html`<a class="bad" href="/answers/${a.id}">error</a>`;
  const kind = PROMPTS.find((p) => p.id === a.prompt_id)?.kind ?? 'brand';
  const identity: Record<string, [string, string]> = {
    correct: ['✓ recognised', 'ok'],
    wrong_person: ['✗ wrong person', 'bad'],
    not_mentioned: ['– not named', 'muted'],
    unverified: ['? named', 'warn'],
  };
  const [text, cls] =
    kind !== 'brand' && a.company_named !== null
      ? a.company_named
        ? ['✓ AE named', 'ok']
        : ['– AE not named', 'muted']
      : identity[a.identity ?? 'unverified'];
  const tag = (on: boolean, label: string) => (on ? html`<span class="tag">${label}</span>` : '');
  return html`<a class="${cls}" href="/answers/${a.id}">${text}</a>${tag(a.cites_company, 'cites AE site')}${tag(
    a.cites_own,
    'cites alexcarvalho.me',
  )}${a.issues.length ? html`<span class="tag warn">${a.issues.length} issue${a.issues.length > 1 ? 's' : ''}</span>` : ''}`;
}

function runGrid(run: RunSummary): View {
  const engines = [...new Set(run.answers.map((a) => a.engine))];
  if (engines.length === 0) return html`<p class="empty">This run has no answers.</p>`;
  const rows = PROMPTS.map((p) => {
    const cells = engines.map((e) => {
      const a = run.answers.find((x) => x.engine === e && x.prompt_id === p.id);
      return html`<td>${a ? answerCell(a) : html`<span class="muted">—</span>`}</td>`;
    });
    return html`<tr><td>${p.text}<span class="tag">${p.kind}</span></td>${cells}</tr>`;
  });
  return html`<table><tr><th>Prompt</th>${engines.map((e) => html`<th>${ENGINE_LABEL[e] ?? e}</th>`)}</tr>${rows}</table>`;
}

function queryTable(rows: QueryStat[], dimension: 'query' | 'page'): View {
  if (rows.length === 0) return html`<p class="empty">No data for this period.</p>`;
  return html`<table><tr><th>${dimension}</th><th class="n">Clicks</th><th class="n">Impressions</th><th class="n">Position</th></tr>${rows.map(
    (r) => html`<tr><td>${dimension === 'page' ? html`<a href="${r.key}">${r.key.replace(/^https?:\/\/[^/]+/, '') || '/'}</a>` : r.key}${
      r.brand && dimension === 'query' ? html`<span class="tag">name</span>` : ''
    }</td><td class="n">${int.format(r.clicks)}</td><td class="n">${int.format(r.impressions)}</td><td class="n">${formatPos(r.position)}</td></tr>`,
  )}</table>`;
}

function statusLine(sources: Record<string, boolean>, jobs: JobStatus[]): View {
  const job = (name: string) => jobs.find((j) => j.job === name);
  const item = (label: string, configured: boolean, last?: JobStatus) =>
    html`<span>${label}: ${
      !configured
        ? html`<span class="muted">not connected</span>`
        : !last
          ? html`<span class="warn">connected, never run</span>`
          : html`<span class="${last.ok ? 'ok' : 'bad'}" title="${last.detail}">${last.ok ? 'ok' : 'failed'} · ${shortDate(last.at)}</span>`
    }</span>`;
  return html`<div class="status">${item('Google', sources.google, job('google'))}${item('Bing', sources.bing, job('bing'))}${item(
    'AI engines',
    sources.ai,
    job('ai'),
  )}</div>`;
}

export interface OverviewData {
  email: string;
  flash?: string;
  sources: Record<string, boolean>;
  jobs: JobStatus[];
  google: PeriodComparison | null;
  bing: PeriodComparison | null;
  weekly: WeeklyPoint[];
  runs: RunSummary[];
  topQueries: QueryStat[];
}

export function overviewPage(d: OverviewData): View {
  const labels = d.weekly.map((w) => shortDate(w.week));
  const impressions = lineChart({
    labels,
    series: [
      { name: 'Google', color: COLORS.green, values: d.weekly.map((w) => w.google.impressions) },
      { name: 'Google · name searches', color: COLORS.amber, values: d.weekly.map((w) => w.googleBrand.impressions) },
      { name: 'Bing', color: COLORS.cyan, values: d.weekly.map((w) => w.bing.impressions) },
    ],
    format: (n) => int.format(n),
  });
  const position = lineChart({
    labels,
    series: [
      { name: 'All searches', color: COLORS.green, values: d.weekly.map((w) => w.google.position) },
      { name: 'Name searches', color: COLORS.amber, values: d.weekly.map((w) => w.googleBrand.position) },
    ],
    format: (n) => n.toFixed(1),
    invert: true,
  });

  const chronological = [...d.runs].reverse();
  const runEngines = [...new Set(d.runs.flatMap((r) => r.answers.map((a) => a.engine)))];
  const perRun = (share: (r: RunSummary, engine: string) => number | null) =>
    lineChart({
      labels: chronological.map((r) => shortDate(r.started_at)),
      series: runEngines.map((e) => ({
        name: ENGINE_LABEL[e] ?? e,
        color: ENGINE_COLOR[e] ?? COLORS.teal,
        values: chronological.map((r) => share(r, e)),
      })),
      format: formatPct,
      domain: [0, 1],
    });
  const companyNamed = perRun((r, e) =>
    answerShare(r, e, 'target', (a) => a.company_named === true, (a) => a.company_named !== null),
  );
  const companyCited = perRun((r, e) =>
    answerShare(r, e, 'target', (a) => a.cites_company, (a) => a.company_named !== null),
  );

  const latest = d.runs[0];
  const body = html`
    ${statusLine(d.sources, d.jobs)}
    <div>
      <form method="post" action="/run/search"><button>Sync search data</button></form>
      <form method="post" action="/run/search?backfill=1"><button>Backfill 16 months of Google</button></form>
      <form method="post" action="/run/ai"><button>Run AI check now</button></form>
      <span class="muted">The AI check takes 1–3 minutes; keep the page open.</span>
    </div>

    <h2>&gt; search · last 28 days${d.google ? html` <span class="muted">(through ${d.google.through})</span>` : ''}</h2>
    ${searchCards(d.google, d.bing)}

    <div class="two">
      <div><h2>&gt; weekly impressions</h2><div class="panel">${raw(impressions)}</div></div>
      <div><h2>&gt; google average position</h2><div class="panel">${raw(position)}</div></div>
    </div>

    <h2>&gt; ai answers</h2>
    <div class="two">
      <div class="panel"><div class="muted">Abstract Extraordinary named · target questions</div>${raw(companyNamed)}</div>
      <div class="panel"><div class="muted">Target answers citing abstractextraordinary.com</div>${raw(companyCited)}</div>
    </div>
    <h2>&gt; latest ai run${latest ? html` <span class="muted">· ${shortDate(latest.started_at)} · <a href="/runs/${latest.id}">details</a></span>` : ''}</h2>
    <div class="panel">${latest ? runGrid(latest) : html`<p class="empty">No AI runs yet.</p>`}</div>

    <h2>&gt; top google queries · 28d <span class="muted">· <a href="/queries">all</a></span></h2>
    <div class="panel">${queryTable(d.topQueries, 'query')}</div>`;
  return layout('Overview', '/', d.email, body, d.flash);
}

export function queriesPage(
  email: string,
  source: Source,
  days: number,
  queries: QueryStat[],
  pages: QueryStat[],
): View {
  const filter = (s: Source, n: number, label: string) =>
    html`<a href="/queries?source=${s}&days=${n}" class="${s === source && n === days ? '' : 'muted'}">${label}</a>`;
  const body = html`<h1>Search queries</h1>
    <p class="filters">${filter('google', 28, 'Google 28d')}${filter('google', 90, 'Google 90d')}${filter('google', 365, 'Google 1y')}${filter(
      'bing',
      28,
      'Bing 28d',
    )}${filter('bing', 90, 'Bing 90d')}</p>
    <h2>&gt; queries</h2><div class="panel">${queryTable(queries, 'query')}</div>
    ${source === 'google' ? html`<h2>&gt; pages</h2><div class="panel">${queryTable(pages, 'page')}</div>` : ''}`;
  return layout('Queries', '/queries', email, body);
}

export function runsPage(email: string, runs: RunSummary[]): View {
  const rows = runs.map((r) => {
    const answered = r.answers.filter((a) => !a.error);
    return html`<tr><td><a href="/runs/${r.id}">${shortDate(r.started_at)}</a> <span class="muted">${r.trigger}</span></td>
      <td class="n">${answered.length}/${r.answers.length}</td>
      <td class="n">${answered.filter((a) => a.company_named === true).length}</td>
      <td class="n">${answered.filter((a) => a.cites_company).length}</td>
      <td class="n">${answered.some((a) => PROMPTS.find((p) => p.id === a.prompt_id)?.kind === 'brand' && a.identity === 'correct') ? '✓' : '–'}</td>
      <td class="n">${answered.reduce((n, a) => n + a.issues.length, 0)}</td></tr>`;
  });
  const body = html`<h1>AI runs</h1><div class="panel">${
    runs.length
      ? html`<table><tr><th>Run</th><th class="n">Answered</th><th class="n">AE named</th><th class="n">Cite AE site</th><th class="n">Alexandre recognised</th><th class="n">Issues</th></tr>${rows}</table>`
      : html`<p class="empty">No AI runs yet.</p>`
  }</div>`;
  return layout('AI runs', '/runs', email, body);
}

export function runPage(email: string, run: RunSummary): View {
  const body = html`<h1>AI run · ${shortDate(run.started_at)} <span class="muted">${run.trigger}</span></h1><div class="panel">${runGrid(run)}</div>`;
  return layout('AI run', '/runs', email, body);
}

export function answerPage(email: string, a: AnswerRow): View {
  const sources = a.sources.map((url) => {
    const own = ownSourceLabel(url);
    return html`<li><a href="${url}" rel="noreferrer">${url}</a>${own ? html`<span class="tag ok">${own}</span>` : ''}</li>`;
  });
  const body = html`<h1>${a.prompt}</h1>
    <p class="muted">${ENGINE_LABEL[a.engine] ?? a.engine} · ${a.model ?? ''} · ${shortDate(a.created_at)} · <a href="/runs/${a.run_id}">run</a></p>
    ${a.error
      ? html`<div class="panel bad">${a.error}</div>`
      : html`<p>${answerCell(a)}</p>
        ${a.issues.length
          ? html`<h2>&gt; issues</h2><div class="panel"><table><tr><th>Claim</th><th>Problem</th></tr>${a.issues.map(
              (i) => html`<tr><td>${i.claim}</td><td class="warn">${i.problem}</td></tr>`,
            )}</table></div>`
          : ''}
        <h2>&gt; answer</h2><div class="panel"><div class="answer">${a.answer ?? ''}</div></div>
        <h2>&gt; sources (${a.sources.length})</h2><div class="panel">${
          sources.length ? html`<ul>${sources}</ul>` : html`<p class="empty">No sources returned.</p>`
        }</div>`}`;
  return layout('Answer', '/runs', email, body);
}

export function deniedPage(reason: 'not-configured' | 'denied'): string {
  const message =
    reason === 'not-configured'
      ? 'Cloudflare Access is not configured for this dashboard yet (ACCESS_TEAM_DOMAIN / ACCESS_AUD). See insights/README.md.'
      : 'Not authorised.';
  return `<!DOCTYPE html><meta name="robots" content="noindex,nofollow"><title>insights</title><p style="font-family:monospace">${message}</p>`;
}
