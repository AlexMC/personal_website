#!/usr/bin/env node

/**
 * Trakt OAuth Token Exchange Script
 *
 * This script exchanges an authorization code for an access token.
 *
 * Usage:
 *   node scripts/get-trakt-token.js <auth_code> <client_id> <client_secret>
 *
 * Example:
 *   node scripts/get-trakt-token.js abc123def456 your_client_id your_client_secret
 */

const https = require('https');

// Get command line arguments
const [authCode, clientId, clientSecret] = process.argv.slice(2);

if (!authCode || !clientId || !clientSecret) {
  console.error('Error: Missing required arguments\n');
  console.log('Usage: node scripts/get-trakt-token.js <auth_code> <client_id> <client_secret>\n');
  console.log('Example:');
  console.log('  node scripts/get-trakt-token.js abc123def456 your_client_id your_client_secret\n');
  process.exit(1);
}

// Prepare the request data
const postData = JSON.stringify({
  code: authCode,
  client_id: clientId,
  client_secret: clientSecret,
  redirect_uri: 'urn:ietf:wg:oauth:2.0:oob',
  grant_type: 'authorization_code'
});

// Configure the request
const options = {
  hostname: 'api.trakt.tv',
  port: 443,
  path: '/oauth/token',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

console.log('Exchanging authorization code for access token...\n');

// Make the request
const req = https.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const response = JSON.parse(data);

      if (res.statusCode === 200) {
        console.log('✅ Success! Here are your tokens:\n');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('Access Token:  ', response.access_token);
        console.log('Token Type:    ', response.token_type);
        console.log('Expires In:    ', response.expires_in, 'seconds');
        console.log('Refresh Token: ', response.refresh_token);
        console.log('Created At:    ', new Date(response.created_at * 1000).toLocaleString());
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

        console.log('Add these to your .env.local file:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`TRAKT_CLIENT_ID=${clientId}`);
        console.log(`TRAKT_CLIENT_SECRET=${clientSecret}`);
        console.log(`TRAKT_ACCESS_TOKEN=${response.access_token}`);
        console.log(`TRAKT_USERNAME=your_trakt_username`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

        console.log('⚠️  Save the refresh token somewhere safe!');
        console.log('You can use it to get a new access token when this one expires.\n');
      } else {
        console.error('❌ Error:', res.statusCode);
        console.error(JSON.stringify(response, null, 2));
      }
    } catch (error) {
      console.error('❌ Failed to parse response:', error.message);
      console.error('Raw response:', data);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Request failed:', error.message);
});

req.write(postData);
req.end();
