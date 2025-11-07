#!/usr/bin/env node

/**
 * Fetch Trakt data at build time
 * This runs during the build process to fetch Trakt data and save it as a JSON file
 * that can be imported by the static site.
 */

const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Fetch Trakt data from the API
async function fetchTraktData() {

  const TRAKT_API_URL = 'https://api.trakt.tv';
  const TRAKT_API_VERSION = '2';

  const clientId = process.env.TRAKT_CLIENT_ID;
  const accessToken = process.env.TRAKT_ACCESS_TOKEN;
  const username = process.env.TRAKT_USERNAME;

  // Check if credentials are available
  if (!clientId || !accessToken || !username) {
    console.log('⚠️  Trakt credentials not found. Skipping Trakt data fetch.');
    console.log('   The Matrix code easter egg will show an error message.');
    return {
      error: 'Trakt API credentials not configured',
      buildTime: new Date().toISOString(),
    };
  }

  const client = axios.create({
    baseURL: TRAKT_API_URL,
    headers: {
      'Content-Type': 'application/json',
      'trakt-api-key': clientId,
      'trakt-api-version': TRAKT_API_VERSION,
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  try {
    console.log('🎬 Fetching Trakt data...');

    // Fetch all data in parallel
    const [episodesRes, moviesRes, statsRes, calendarRes] = await Promise.all([
      client.get(`/users/${username}/history/episodes`, { params: { limit: 5 } }),
      client.get(`/users/${username}/history/movies`, { params: { limit: 5 } }),
      client.get(`/users/${username}/stats`),
      client.get(`/calendars/my/shows/${new Date().toISOString().split('T')[0]}/14`),
    ]);

    const data = {
      history: {
        episodes: episodesRes.data,
        movies: moviesRes.data,
      },
      stats: statsRes.data,
      calendar: calendarRes.data,
      buildTime: new Date().toISOString(),
    };

    console.log('✅ Trakt data fetched successfully!');
    console.log(`   - Episodes: ${data.history.episodes.length}`);
    console.log(`   - Movies: ${data.history.movies.length}`);
    console.log(`   - Upcoming: ${data.calendar.length}`);

    return data;
  } catch (error) {
    console.error('❌ Error fetching Trakt data:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    }
    return {
      error: 'Failed to fetch Trakt data: ' + error.message,
      buildTime: new Date().toISOString(),
    };
  }
}

async function main() {
  console.log('🚀 Starting Trakt data fetch for build...\n');

  const data = await fetchTraktData();

  // Save to public directory so it's included in the static export
  const outputPath = path.join(__dirname, '..', 'public', 'trakt-data.json');
  fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));

  console.log(`\n💾 Saved Trakt data to: ${outputPath}`);
  console.log('✨ Build-time Trakt data fetch complete!\n');
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
