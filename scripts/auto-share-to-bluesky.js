#!/usr/bin/env node

/**
 * Automatically share blog posts to Bluesky and update markdown with comment metadata
 *
 * This script is designed to run in CI/CD pipelines. It:
 * 1. Finds blog posts without Bluesky metadata
 * 2. Posts them to Bluesky with a link
 * 3. Updates the markdown file with the post URI
 * 4. Exits with status code indicating if changes were made
 *
 * Required environment variables:
 * - BSKY_HANDLE: Your Bluesky handle (e.g., username.bsky.social)
 * - BSKY_APP_PASSWORD: Your Bluesky app password (not your main password!)
 * - SITE_URL: Your website URL (e.g., https://yourdomain.com)
 */

const fs = require('fs');
const path = require('path');
const { BskyAgent } = require('@atproto/api');
const matter = require('gray-matter');

// Configuration
const POSTS_DIR = path.join(process.cwd(), 'data/posts');
const BSKY_HANDLE = process.env.BSKY_HANDLE;
const BSKY_APP_PASSWORD = process.env.BSKY_APP_PASSWORD;
const SITE_URL = process.env.SITE_URL || 'https://yourdomain.com';

// Validate environment variables
function validateEnv() {
  const missing = [];

  if (!BSKY_HANDLE) missing.push('BSKY_HANDLE');
  if (!BSKY_APP_PASSWORD) missing.push('BSKY_APP_PASSWORD');

  if (missing.length > 0) {
    console.error(`❌ Missing required environment variables: ${missing.join(', ')}`);
    console.error('Please set these in your CI/CD secrets or .env file');
    process.exit(1);
  }
}

// Find posts without Bluesky metadata
function findPostsWithoutBsky() {
  const posts = [];
  const files = fs.readdirSync(POSTS_DIR);

  for (const filename of files) {
    if (!filename.endsWith('.md')) continue;

    const filePath = path.join(POSTS_DIR, filename);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(fileContent);

    // Check if post already has Bluesky metadata
    if (!data.bsky || !data.bsky.uri) {
      posts.push({
        filename,
        filePath,
        slug: filename.replace(/\.md$/, ''),
        title: data.title,
        excerpt: data.excerpt,
        date: data.date
      });
    }
  }

  return posts;
}

// Create Bluesky post text
function createPostText(post) {
  const postUrl = `${SITE_URL}/blog/${post.slug}`;

  // Bluesky has a 300 character limit for posts
  const maxExcerptLength = 250 - post.title.length - postUrl.length - 10; // Leave room for formatting

  let excerpt = post.excerpt || '';
  if (excerpt.length > maxExcerptLength) {
    excerpt = excerpt.substring(0, maxExcerptLength - 3) + '...';
  }

  return `${post.title}\n\n${excerpt}\n\n${postUrl}`;
}

// Post to Bluesky and get the URI
async function postToBluesky(agent, post) {
  try {
    const text = createPostText(post);
    const postUrl = `${SITE_URL}/blog/${post.slug}`;

    // Create the post with embedded link
    const response = await agent.post({
      text: text,
      createdAt: new Date().toISOString(),
      // Add facets for the URL to make it clickable
      facets: [{
        index: {
          byteStart: text.lastIndexOf(postUrl),
          byteEnd: text.lastIndexOf(postUrl) + postUrl.length
        },
        features: [{
          $type: 'app.bsky.richtext.facet#link',
          uri: postUrl
        }]
      }]
    });

    return {
      uri: response.uri,
      cid: response.cid
    };
  } catch (error) {
    console.error(`❌ Failed to post "${post.title}" to Bluesky:`, error.message);
    throw error;
  }
}

// Update markdown file with Bluesky metadata
function updateMarkdownWithBsky(filePath, uri, handle) {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContent);

  // Add Bluesky metadata
  data.bsky = {
    uri: uri,
    author: handle
  };

  // Reconstruct the file with updated frontmatter
  const updatedContent = matter.stringify(content, data);
  fs.writeFileSync(filePath, updatedContent, 'utf8');
}

// Main function
async function main() {
  console.log('🚀 Starting Bluesky auto-share process...\n');

  // Validate environment
  validateEnv();

  // Find posts to share
  const postsToShare = findPostsWithoutBsky();

  if (postsToShare.length === 0) {
    console.log('✅ No posts found without Bluesky metadata. All posts are already shared!');
    process.exit(0);
  }

  console.log(`📝 Found ${postsToShare.length} post(s) to share:\n`);
  postsToShare.forEach(post => {
    console.log(`   - ${post.title} (${post.slug})`);
  });
  console.log('');

  // Initialize Bluesky agent
  console.log('🔐 Authenticating with Bluesky...');
  const agent = new BskyAgent({
    service: 'https://bsky.social'
  });

  try {
    await agent.login({
      identifier: BSKY_HANDLE,
      password: BSKY_APP_PASSWORD
    });
    console.log('✅ Authentication successful!\n');
  } catch (error) {
    console.error('❌ Authentication failed:', error.message);
    console.error('Please check your BSKY_HANDLE and BSKY_APP_PASSWORD');
    process.exit(1);
  }

  // Process each post
  let successCount = 0;
  let failCount = 0;

  for (const post of postsToShare) {
    try {
      console.log(`📤 Sharing: ${post.title}...`);

      const { uri } = await postToBluesky(agent, post);

      console.log(`   ✅ Posted to Bluesky (URI: ${uri})`);

      updateMarkdownWithBsky(post.filePath, uri, BSKY_HANDLE);

      console.log(`   ✅ Updated ${post.filename} with Bluesky metadata\n`);

      successCount++;

      // Rate limiting: wait 1 second between posts to be respectful
      if (postsToShare.length > 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    } catch (error) {
      console.error(`   ❌ Failed to process post: ${error.message}\n`);
      failCount++;
    }
  }

  // Summary
  console.log('═══════════════════════════════════════');
  console.log(`✅ Successfully shared: ${successCount} post(s)`);
  if (failCount > 0) {
    console.log(`❌ Failed: ${failCount} post(s)`);
  }
  console.log('═══════════════════════════════════════\n');

  if (successCount > 0) {
    console.log('📝 Changes have been made to markdown files.');
    console.log('   The CI/CD workflow will commit and push these changes.\n');
    process.exit(0); // Exit with success, changes were made
  } else if (failCount > 0) {
    process.exit(1); // Exit with error
  } else {
    process.exit(0); // Exit with success, no changes needed
  }
}

// Run the script
main().catch(error => {
  console.error('❌ Unexpected error:', error);
  process.exit(1);
});
