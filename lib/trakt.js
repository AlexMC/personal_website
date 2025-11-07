import axios from 'axios';

const TRAKT_API_URL = 'https://api.trakt.tv';
const TRAKT_API_VERSION = '2';

/**
 * Creates a configured axios instance for Trakt API calls
 */
export function createTraktClient() {
  const client = axios.create({
    baseURL: TRAKT_API_URL,
    headers: {
      'Content-Type': 'application/json',
      'trakt-api-key': process.env.TRAKT_CLIENT_ID,
      'trakt-api-version': TRAKT_API_VERSION,
    },
  });

  // Add auth token if available
  if (process.env.TRAKT_ACCESS_TOKEN) {
    client.defaults.headers.common['Authorization'] = `Bearer ${process.env.TRAKT_ACCESS_TOKEN}`;
  }

  return client;
}

/**
 * Fetches user's watch history
 * @param {string} username - Trakt username
 * @param {string} type - 'movies' or 'episodes'
 * @param {number} limit - Number of items to fetch
 */
export async function getUserHistory(username, type = null, limit = 10) {
  const client = createTraktClient();
  const typeParam = type ? `/${type}` : '';
  const response = await client.get(`/users/${username}/history${typeParam}`, {
    params: { limit },
  });
  return response.data;
}

/**
 * Fetches user statistics
 * @param {string} username - Trakt username
 */
export async function getUserStats(username) {
  const client = createTraktClient();
  const response = await client.get(`/users/${username}/stats`);
  return response.data;
}

/**
 * Fetches user's calendar (upcoming episodes)
 * @param {number} days - Number of days to fetch
 */
export async function getMyCalendar(days = 7) {
  const client = createTraktClient();
  const today = new Date().toISOString().split('T')[0];
  const response = await client.get(`/calendars/my/shows/${today}/${days}`);
  return response.data;
}

/**
 * Fetches user's watching progress
 * @param {string} username - Trakt username
 */
export async function getWatchedProgress(username) {
  const client = createTraktClient();
  const response = await client.get(`/users/${username}/watched/shows`);
  return response.data;
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
