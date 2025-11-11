#!/usr/bin/env node

/**
 * Quick script to check if OG tags are properly set on deployed blog posts
 */

const https = require('https');

const url = 'https://alexcarvalho.me/blog/are-developers-missing-the-mark-on-ai';

console.log('🔍 Checking OG tags for:', url);
console.log('');

https.get(url, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    // Extract OG tags
    const ogImageMatch = data.match(/<meta\s+property="og:image"\s+content="([^"]+)"/);
    const ogTitleMatch = data.match(/<meta\s+property="og:title"\s+content="([^"]+)"/);
    const ogDescMatch = data.match(/<meta\s+property="og:description"\s+content="([^"]+)"/);
    const ogUrlMatch = data.match(/<meta\s+property="og:url"\s+content="([^"]+)"/);

    if (ogImageMatch) {
      console.log('✅ og:image found:', ogImageMatch[1]);
    } else {
      console.log('❌ og:image NOT found');
    }

    if (ogTitleMatch) {
      console.log('✅ og:title found:', ogTitleMatch[1]);
    } else {
      console.log('❌ og:title NOT found');
    }

    if (ogDescMatch) {
      console.log('✅ og:description found:', ogDescMatch[1]);
    } else {
      console.log('❌ og:description NOT found');
    }

    if (ogUrlMatch) {
      console.log('✅ og:url found:', ogUrlMatch[1]);
    } else {
      console.log('❌ og:url NOT found');
    }

    console.log('');

    if (ogImageMatch) {
      console.log('🔍 Checking if image is accessible...');
      https.get(ogImageMatch[1], (imgRes) => {
        if (imgRes.statusCode === 200) {
          console.log('✅ Image is accessible (200 OK)');
        } else {
          console.log(`❌ Image returned status: ${imgRes.statusCode}`);
        }
      }).on('error', (err) => {
        console.log('❌ Image not accessible:', err.message);
      });
    }
  });
}).on('error', (err) => {
  console.log('❌ Error fetching page:', err.message);
});
