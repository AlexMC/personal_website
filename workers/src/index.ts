import { Hono } from 'hono';
import { corsMiddleware } from './utils/cors';
import github from './handlers/github';
import trakt from './handlers/trakt';
import games from './handlers/games';
import newsletter from './handlers/newsletter';

export interface Env {
  // Secrets
  GITHUB_TOKEN: string;
  MAILERLITE_API_KEY: string;
  GAMES_API_KEY: string;
  // Config vars
  ALLOWED_ORIGIN: string;
  GAMES_API_URL: string;
}

const app = new Hono<{ Bindings: Env }>();

// CORS middleware for all routes
app.use('*', corsMiddleware());

// Mount handlers
app.route('/api/github', github);
app.route('/api/trakt', trakt);
app.route('/api/games', games);
app.route('/api/newsletter', newsletter);

// Health check
app.get('/api/health', (c) => c.json({ status: 'ok' }));

export default app;
