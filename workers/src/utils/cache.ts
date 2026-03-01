import type { Context } from 'hono';

export function setCacheHeaders(c: Context, maxAge: number): void {
  c.header('Cache-Control', `public, max-age=${maxAge}`);
}
