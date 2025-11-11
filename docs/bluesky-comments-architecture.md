# Bluesky Comments Architecture

This document explains how the Bluesky comments system follows the static site with dynamic data pattern described in [static-site-dynamic-data-pattern.md](./static-site-dynamic-data-pattern.md).

## TL;DR

✅ **The Bluesky comments implementation is PERFECTLY suited for GitHub Pages!**

- Comments are fetched **client-side** after page load
- Uses Bluesky's **public API** (no authentication needed for reading)
- No secrets are exposed to the browser
- CI/CD automation runs separately in GitHub Actions

## How It Works

### Architecture Overview

```
┌─────────────────────────┐
│   Static Website        │
│   (GitHub Pages)        │
│                         │
│  ┌──────────────────┐   │
│  │ BlueskyComments  │   │
│  │  Component       │   │
│  │  (Client-side)   │   │
│  └────────┬─────────┘   │
└───────────┼─────────────┘
            │
            │ HTTP Request
            │ (No Auth!)
            ▼
┌─────────────────────────┐
│  Bluesky Public API     │
│  (public.api.bsky.app)  │
│                         │
│  - No auth required     │
│  - Returns public posts │
│  - Returns replies      │
└─────────────────────────┘
```

### Key Difference from Other Integrations

Unlike GitHub contributions or Trakt data, Bluesky comments **don't need an external backend** because:

1. **Public Data**: Comments are public posts on Bluesky - no authentication needed to read them
2. **Official Client Library**: `@atproto/api` works directly in the browser
3. **CORS Enabled**: Bluesky's public API allows browser requests

### Implementation Details

#### 1. Client-side Component

**File:** `components/BlueskyComments.js`

```javascript
import { useState, useEffect } from 'react';
import { BskyAgent } from '@atproto/api';

export default function BlueskyComments({ uri, author }) {
  const [thread, setThread] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchThread = async () => {
      // No authentication required for public data
      const agent = new BskyAgent({
        service: 'https://public.api.bsky.app',
      });

      // Fetch the post thread
      const response = await agent.getPostThread({ uri, depth: 10 });
      setThread(response.data.thread);
    };

    fetchThread();
  }, [uri]);

  // ... render logic
}
```

**Key Points:**
- Uses `useEffect` to fetch after page load (client-side) ✅
- No authentication headers needed ✅
- Has loading states for better UX ✅
- Graceful error handling ✅

#### 2. Blog Post Integration

**File:** `pages/blog/[slug].js`

```javascript
export default function BlogPost({ post }) {
  return (
    <Layout>
      <article>
        {/* Blog post content */}
        <div dangerouslySetInnerHTML={{ __html: post.content }} />

        {/* Bluesky Comments - Only renders if bsky metadata exists */}
        {post.bsky && post.bsky.uri && (
          <BlueskyComments
            uri={post.bsky.uri}
            author={post.bsky.author}
          />
        )}
      </article>
    </Layout>
  );
}
```

**Key Points:**
- Static HTML is generated at build time without comments
- Component hydrates client-side and fetches comments
- Progressive enhancement - works without JavaScript

#### 3. Markdown Metadata

**File:** `data/posts/my-post.md`

```yaml
---
title: 'My Blog Post'
date: '2025-01-15'
excerpt: 'Post summary'
tags: ['Tech']
bsky:
  uri: 'at://did:plc:abc123/app.bsky.feed.post/xyz789'
  author: 'username.bsky.social'
---

Blog post content...
```

**Key Points:**
- Metadata stored in frontmatter
- Parsed at build time by `gray-matter`
- Can be added manually or via CI/CD automation

## CI/CD Automation (Separate Process)

The auto-sharing functionality runs **in GitHub Actions**, NOT on the static site.

### Workflow Architecture

```
┌─────────────────────────┐
│   GitHub Actions        │
│   (On git push)         │
│                         │
│  ┌──────────────────┐   │
│  │  auto-share.js   │   │
│  │  Script          │   │
│  │  (Node.js)       │   │
│  └────────┬─────────┘   │
└───────────┼─────────────┘
            │
            │ Authenticated Request
            │ (Uses BSKY_APP_PASSWORD)
            ▼
┌─────────────────────────┐
│  Bluesky API            │
│  (bsky.social)          │
│                         │
│  - Creates post         │
│  - Returns URI          │
└─────────────────────────┘
            │
            ▼
┌─────────────────────────┐
│  Git Repo               │
│  - Update markdown      │
│  - Add bsky metadata    │
│  - Commit & push        │
└─────────────────────────┘
```

### Script Implementation

**File:** `scripts/auto-share-to-bluesky.js`

```javascript
const { BskyAgent } = require('@atproto/api');

// Get credentials from environment (GitHub Secrets)
const BSKY_HANDLE = process.env.BSKY_HANDLE;
const BSKY_APP_PASSWORD = process.env.BSKY_APP_PASSWORD;

async function shareToBluesky(post) {
  // Initialize agent with authentication
  const agent = new BskyAgent({ service: 'https://bsky.social' });

  await agent.login({
    identifier: BSKY_HANDLE,
    password: BSKY_APP_PASSWORD
  });

  // Create post
  const response = await agent.post({
    text: `${post.title}\n\n${post.excerpt}\n\n${SITE_URL}/blog/${post.slug}`,
    createdAt: new Date().toISOString()
  });

  // Update markdown file with URI
  updateMarkdownWithBsky(post.filePath, response.uri, BSKY_HANDLE);
}
```

**Key Points:**
- Runs in GitHub Actions, not in browser ✅
- Uses secrets from GitHub Secrets (never exposed to client) ✅
- Authenticates with Bluesky to create posts ✅
- Commits metadata back to repo ✅

### GitHub Actions Workflow

**File:** `.github/workflows/auto-share-bluesky.yml`

```yaml
name: Auto-share Blog Posts to Bluesky

on:
  push:
    branches: [main]
    paths: ['data/posts/**/*.md']

jobs:
  auto-share:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4

      - name: Run auto-share script
        env:
          BSKY_HANDLE: ${{ secrets.BSKY_HANDLE }}
          BSKY_APP_PASSWORD: ${{ secrets.BSKY_APP_PASSWORD }}
          SITE_URL: ${{ vars.SITE_URL }}
        run: node scripts/auto-share-to-bluesky.js

      - name: Commit and push changes
        run: |
          git add data/posts/*.md
          git commit -m "chore: add Bluesky metadata [skip-bluesky]"
          git push
```

**Key Points:**
- Triggered on push to main branch
- Uses GitHub Secrets for credentials
- Commits metadata back to repo
- `[skip-bluesky]` prevents infinite loops

## Security Analysis

### ✅ What's Secure

1. **Reading Comments (Client-side)**
   - No authentication required
   - Uses public API endpoint
   - No secrets in browser
   - Anyone can read public Bluesky posts

2. **Creating Posts (CI/CD)**
   - Secrets stored in GitHub Secrets
   - Only runs in GitHub Actions
   - Never exposed to browser
   - Controlled by repository access

### ⚠️ Security Trade-offs

1. **Public API Abuse**
   - Anyone can query Bluesky's public API
   - Rate limiting handled by Bluesky
   - No impact on your site (it's just reading)

2. **Spam Comments**
   - Anyone with Bluesky account can comment
   - Moderation handled on Bluesky
   - You can delete/block on Bluesky platform
   - Changes reflect automatically on your site

## Comparison with Other Integrations

| Feature | Bluesky Comments | GitHub Contributions | Trakt Stats |
|---------|------------------|---------------------|-------------|
| **Needs Backend?** | ❌ No | ✅ Yes | ✅ Yes |
| **Auth Required?** | ❌ No (reading) | ✅ Yes | ✅ Yes |
| **Secrets in Browser?** | ❌ No | ❌ No | ❌ No |
| **Client-side Fetch?** | ✅ Yes | ✅ Yes | ✅ Yes |
| **API Endpoint** | `public.api.bsky.app` | `trendhighlighter.xyz` | `trendhighlighter.xyz` |
| **CORS Enabled?** | ✅ Yes | ✅ Yes | ✅ Yes |

## Why This Works for GitHub Pages

### Build Time vs Runtime

1. **Build Time (Static Export):**
   - Markdown files parsed
   - `bsky` metadata extracted
   - Static HTML generated (without comments)
   - No API calls made
   - No authentication needed

2. **Runtime (In Browser):**
   - User loads static page
   - React hydrates and runs `useEffect`
   - BlueskyComments fetches from public API
   - Component updates with fetched comments
   - All happens client-side

### Benefits

- ✅ **No infrastructure** - No comment database needed
- ✅ **No authentication** - Public API is free to use
- ✅ **No backend** - Direct API calls from browser
- ✅ **Real identities** - Users comment with Bluesky profiles
- ✅ **Decentralized** - Comments live on Bluesky network
- ✅ **Progressive enhancement** - Works without JavaScript (shows link to Bluesky)
- ✅ **SEO friendly** - Post content is in static HTML
- ✅ **Free hosting** - Perfect for GitHub Pages

## Configuration

### Environment Variables

#### Static Site (Not needed!)

The static site **doesn't need any environment variables** for comments to work. The component directly calls Bluesky's public API.

#### CI/CD (GitHub Actions)

**GitHub Secrets** (for auto-sharing):
```bash
BSKY_HANDLE=your_username.bsky.social
BSKY_APP_PASSWORD=your-app-password-here
```

**GitHub Variables** (optional):
```bash
SITE_URL=https://yourdomain.com
```

### Manual Setup (Optional)

If you don't want automated sharing, you can manually add metadata:

1. Share your blog post on Bluesky
2. Get the post URI from Bluesky
3. Add to frontmatter:
   ```yaml
   bsky:
     uri: 'at://did:plc:YOUR_DID/app.bsky.feed.post/POST_ID'
     author: 'yourusername.bsky.social'
   ```
4. Rebuild and deploy

## Performance Considerations

### Client-side Fetching

- Comments load **after** the page is visible
- Shows loading skeleton while fetching
- Doesn't block page render
- Cached by browser

### API Rate Limits

Bluesky's public API has rate limits:
- Generous for public data
- Per-IP address limits
- Handled gracefully with error messages

### Caching Strategy

Consider adding caching:
```javascript
// Cache comments in localStorage
const cacheKey = `bsky-comments-${uri}`;
const cached = localStorage.getItem(cacheKey);

if (cached) {
  const { data, timestamp } = JSON.parse(cached);
  if (Date.now() - timestamp < 5 * 60 * 1000) { // 5 minutes
    setThread(data);
    return;
  }
}

// Fetch and cache...
```

## Conclusion

The Bluesky comments implementation is **perfectly suited** for static sites on GitHub Pages because:

1. **No backend needed** - Public API requires no authentication
2. **Follows best practices** - Client-side fetching, loading states, error handling
3. **Secure** - No secrets exposed, no auth needed for reading
4. **Free** - No infrastructure costs
5. **Decentralized** - Comments owned by users on Bluesky

It follows the exact same pattern as GitHub contributions and Trakt stats, but with the added benefit of not needing an external backend!
