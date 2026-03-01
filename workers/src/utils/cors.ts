import type { Context, MiddlewareHandler } from 'hono';

export function corsHeaders(origin: string): Record<string, string> {
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '3600',
  };
}

export function corsMiddleware(): MiddlewareHandler<{ Bindings: { ALLOWED_ORIGIN: string } }> {
  return async (c, next) => {
    if (c.req.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: corsHeaders(c.env.ALLOWED_ORIGIN),
      });
    }

    await next();

    const headers = corsHeaders(c.env.ALLOWED_ORIGIN);
    for (const [key, value] of Object.entries(headers)) {
      c.res.headers.set(key, value);
    }
  };
}
