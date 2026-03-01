import { Hono } from 'hono';
import type { Env } from '../index';

const newsletter = new Hono<{ Bindings: Env }>();

newsletter.post('/subscribe', async (c) => {
  const apiKey = c.env.MAILERLITE_API_KEY;

  if (!apiKey) {
    return c.json({ error: 'MailerLite API key not configured' }, 500);
  }

  let body: { email?: string };
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: 'Invalid JSON body' }, 400);
  }

  if (!body.email) {
    return c.json({ error: 'Email is required' }, 400);
  }

  const response = await fetch('https://connect.mailerlite.com/api/subscribers', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email: body.email }),
  });

  if (response.status === 201) {
    return c.json({ message: 'Successfully subscribed to newsletter' });
  }

  const errorData = await response.json() as any;
  return c.json(
    { error: errorData.message || 'Failed to subscribe' },
    response.status as 400,
  );
});

export default newsletter;
