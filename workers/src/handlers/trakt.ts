import { Hono } from 'hono';
import { setCacheHeaders } from '../utils/cache';
import type { Env } from '../index';

const trakt = new Hono<{ Bindings: Env }>();

trakt.get('/:username', async (c) => {
  const username = c.req.param('username');

  try {
    // Call the smart Trakt proxy on the homelab via Cloudflare Tunnel
    const response = await fetch(
      `https://trakt-proxy.alexcarvalho.me/trakt/${username}`,
      { signal: AbortSignal.timeout(30000) }
    );

    if (!response.ok) {
      const text = await response.text();
      return c.json({ error: `Trakt proxy error (${response.status}): ${text}` }, response.status as 400);
    }

    const data = await response.json();
    setCacheHeaders(c, 1800);
    return c.json(data);
  } catch (e) {
    if (e instanceof DOMException && e.name === 'TimeoutError') {
      return c.json({ error: 'Trakt proxy request timed out' }, 504);
    }
    return c.json({ error: `Trakt proxy connection error: ${e}` }, 500);
  }
});

export default trakt;
