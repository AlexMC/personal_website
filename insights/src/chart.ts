// Server-rendered SVG line chart: no client JavaScript, no external library.

export interface Series {
  name: string;
  color: string;
  /** One value per x label; null leaves a gap. */
  values: (number | null)[];
}

export interface ChartOptions {
  labels: string[];
  series: Series[];
  format?: (n: number) => string;
  /** For rankings, where a smaller number is better: draws 1 at the top. */
  invert?: boolean;
  /** Fix the axis range instead of fitting the data (e.g. 0..1 for shares). */
  domain?: [number, number];
}

const W = 760;
const H = 230;
const PAD = { top: 14, right: 16, bottom: 30, left: 56 };

const escape = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export function lineChart({ labels, series, format = String, invert = false, domain }: ChartOptions): string {
  const values = series.flatMap((s) => s.values).filter((v): v is number => v !== null);
  if (labels.length === 0 || values.length === 0) {
    return `<p class="empty">No data yet.</p>`;
  }

  let [min, max] = domain ?? [invert ? Math.min(...values) : 0, Math.max(...values)];
  if (min === max) {
    min = invert ? Math.max(1, min - 1) : 0;
    max = max + 1;
  }

  const plotW = W - PAD.left - PAD.right;
  const plotH = H - PAD.top - PAD.bottom;
  const x = (i: number) => PAD.left + (labels.length === 1 ? plotW / 2 : (i / (labels.length - 1)) * plotW);
  const y = (v: number) => {
    const t = (v - min) / (max - min);
    return PAD.top + (invert ? t : 1 - t) * plotH;
  };

  const grid = [0, 0.25, 0.5, 0.75, 1].map((t) => {
    const v = min + t * (max - min);
    const yy = y(v).toFixed(1);
    return `<line x1="${PAD.left}" x2="${W - PAD.right}" y1="${yy}" y2="${yy}" class="grid"/>` +
      `<text x="${PAD.left - 8}" y="${yy}" class="axis" text-anchor="end" dominant-baseline="middle">${escape(format(v))}</text>`;
  });

  const every = Math.max(1, Math.ceil(labels.length / 8));
  const xLabels = labels
    .map((label, i) =>
      i % every === 0 || i === labels.length - 1
        ? `<text x="${x(i).toFixed(1)}" y="${H - 8}" class="axis" text-anchor="middle">${escape(label)}</text>`
        : '',
    )
    .join('');

  const lines = series.map((s) => {
    // Split into runs of consecutive values so nulls become gaps.
    const segments: string[][] = [[]];
    s.values.forEach((v, i) => {
      if (v === null) segments.push([]);
      else segments[segments.length - 1].push(`${x(i).toFixed(1)},${y(v).toFixed(1)}`);
    });
    const paths = segments
      .filter((seg) => seg.length > 0)
      .map((seg) =>
        seg.length === 1
          ? `<circle cx="${seg[0].split(',')[0]}" cy="${seg[0].split(',')[1]}" r="3" fill="${s.color}"/>`
          : `<polyline points="${seg.join(' ')}" fill="none" stroke="${s.color}" stroke-width="2"/>`,
      );
    return `<g><title>${escape(s.name)}</title>${paths.join('')}</g>`;
  });

  const legend = series
    .map((s) => `<span class="key"><i style="background:${s.color}"></i>${escape(s.name)}</span>`)
    .join('');

  return `<div class="legend">${legend}</div>` +
    `<svg viewBox="0 0 ${W} ${H}" class="chart" role="img">${grid.join('')}${xLabels}${lines.join('')}</svg>`;
}
