import { Hono } from 'hono';
import { setCacheHeaders } from '../utils/cache';
import type { Env } from '../index';

const games = new Hono<{ Bindings: Env }>();

games.get('/', async (c) => {
  const apiKey = c.env.GAMES_API_KEY;
  const apiUrl = c.env.GAMES_API_URL;

  if (!apiKey) {
    return c.json({ error: 'Games API key not configured' }, 500);
  }

  if (!apiUrl) {
    return c.json({ error: 'Games API URL not configured' }, 500);
  }

  try {
    // TODO: GAMES_API_URL will be a Cloudflare Tunnel URL once set up
    const response = await fetch(`${apiUrl}/api/games?api_key=${apiKey}`, {
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      return c.json({ error: 'Games API error' }, response.status as 400);
    }

    const data = await response.json();
    setCacheHeaders(c, 300);
    return c.json(data);
  } catch (e) {
    if (e instanceof DOMException && e.name === 'TimeoutError') {
      return c.json({ error: 'Games API request timed out' }, 504);
    }
    return c.json({ error: `Games API connection error: ${e}` }, 500);
  }
});

export default games;
