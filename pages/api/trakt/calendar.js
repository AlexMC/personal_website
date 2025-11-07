import { getMyCalendar } from '../../../lib/trakt';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { days = 7 } = req.query;
    const calendar = await getMyCalendar(parseInt(days));
    res.status(200).json(calendar);
  } catch (error) {
    console.error('Trakt API error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: error.response?.data?.error || 'Failed to fetch calendar',
    });
  }
}
