import { Hono } from 'hono';
import { setCacheHeaders } from '../utils/cache';
import type { Env } from '../index';

const github = new Hono<{ Bindings: Env }>();

const CONTRIBUTIONS_QUERY = `
  query($username: String!) {
    user(login: $username) {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              contributionCount
              date
            }
          }
        }
      }
    }
  }
`;

github.get('/contributions/:username', async (c) => {
  const username = c.req.param('username');
  const token = c.env.GITHUB_TOKEN;

  if (!token) {
    return c.json({ error: 'GitHub token not configured' }, 500);
  }

  const response = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      'Authorization': `bearer ${token}`,
      'Content-Type': 'application/json',
      'User-Agent': 'website-api-worker',
    },
    body: JSON.stringify({
      query: CONTRIBUTIONS_QUERY,
      variables: { username },
    }),
  });

  if (!response.ok) {
    return c.json({ error: 'GitHub API error' }, response.status as 400);
  }

  const data = await response.json() as any;

  if (data.errors) {
    return c.json({ error: data.errors[0].message }, 400);
  }

  const calendar = data.data.user.contributionsCollection.contributionCalendar;
  const contributions: Record<string, number> = {};

  for (const week of calendar.weeks) {
    for (const day of week.contributionDays) {
      contributions[day.date] = day.contributionCount;
    }
  }

  setCacheHeaders(c, 3600);
  return c.json({
    contributions,
    totalContributions: calendar.totalContributions,
  });
});

export default github;
