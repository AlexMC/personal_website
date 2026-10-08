import { createRemoteJWKSet, jwtVerify, type JWTVerifyGetKey } from 'jose';
import type { Env } from './env';

// Cloudflare Access sits in front of insights.alexcarvalho.me and does the
// login. This Worker still verifies the signed assertion Access attaches to
// every request, so a request that reaches the Worker any other way (a
// misconfigured route, Access switched off) is rejected rather than served.

export type AuthResult = { ok: true; email: string } | { ok: false; reason: 'not-configured' | 'denied' };

const jwksByTeam = new Map<string, JWTVerifyGetKey>();

export async function authorize(request: Request, env: Env): Promise<AuthResult> {
  const { hostname } = new URL(request.url);
  if (env.DEV_AUTH_BYPASS === '1' && (hostname === 'localhost' || hostname === '127.0.0.1')) {
    return { ok: true, email: 'local-dev' };
  }

  if (!env.ACCESS_TEAM_DOMAIN || !env.ACCESS_AUD) return { ok: false, reason: 'not-configured' };

  const token = request.headers.get('cf-access-jwt-assertion');
  if (!token) return { ok: false, reason: 'denied' };

  const team = env.ACCESS_TEAM_DOMAIN.replace(/\/+$/, '');
  let jwks = jwksByTeam.get(team);
  if (!jwks) {
    jwks = createRemoteJWKSet(new URL(`${team}/cdn-cgi/access/certs`));
    jwksByTeam.set(team, jwks);
  }

  try {
    const { payload } = await jwtVerify(token, jwks, { issuer: team, audience: env.ACCESS_AUD });
    return { ok: true, email: String(payload.email ?? '') };
  } catch {
    return { ok: false, reason: 'denied' };
  }
}
