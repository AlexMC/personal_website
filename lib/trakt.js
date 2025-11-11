import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * Fetches all Trakt data for a user from the external backend
 * @param {string} username - Trakt username
 */
export async function getTraktData(username) {
  try {
    const { data } = await axios.get(`${API_URL}/api/website/trakt/${username}`);
    return data;
  } catch (error) {
    console.error('Error fetching Trakt data:', error);
    return {
      error: 'Failed to load Trakt data',
      buildTime: new Date().toISOString(),
      history: { episodes: [], movies: [] },
      stats: null,
      calendar: [],
    };
  }
}

/**
 * Formats date to relative time (e.g., "2 hours ago")
 */
export function getRelativeTime(date) {
  const now = new Date();
  const watched = new Date(date);
  const diffMs = now - watched;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffYears > 0) return `${diffYears} year${diffYears > 1 ? 's' : ''} ago`;
  if (diffMonths > 0) return `${diffMonths} month${diffMonths > 1 ? 's' : ''} ago`;
  if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffMins > 0) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  return 'just now';
}
