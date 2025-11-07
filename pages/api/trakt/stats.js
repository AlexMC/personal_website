import { getUserStats } from '../../../lib/trakt';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const username = process.env.TRAKT_USERNAME;

  if (!username) {
    return res.status(500).json({ error: 'Trakt username not configured' });
  }

  try {
    const stats = await getUserStats(username);
    res.status(200).json(stats);
  } catch (error) {
    console.error('Trakt API error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: error.response?.data?.error || 'Failed to fetch stats',
    });
  }
}
