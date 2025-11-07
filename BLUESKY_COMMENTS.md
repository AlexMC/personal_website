# Bluesky Comments Integration

This blog now supports decentralized comments using the AT Protocol (Bluesky)!

## How It Works

Instead of maintaining a traditional comment system with databases and user management, this implementation uses Bluesky as the commenting platform. When you share a blog post on Bluesky, the replies to that post become the comments on your blog.

### Benefits

- **No infrastructure to maintain** - No databases, user accounts, or moderation tools needed
- **Rich content support** - Comments can include images, links, and threaded conversations
- **Real identities** - Users comment with their actual Bluesky profiles
- **Cross-platform** - Comments live on Bluesky, so they're discoverable through social media
- **You own your content, they own theirs** - No platform lock-in for anyone

## How to Enable Comments on a Blog Post

### Step 1: Share Your Blog Post on Bluesky

First, publish your blog post and share it on Bluesky with a link to the post.

### Step 2: Get the Post URI

After posting to Bluesky, you need to get the AT Protocol URI for your post. The URI has this format:

```
at://did:plc:YOUR_DID/app.bsky.feed.post/POST_ID
```

#### Finding Your Post URI:

**Option 1: From the Bluesky URL**
If your Bluesky post URL is:
```
https://bsky.app/profile/yourusername.bsky.social/post/abc123xyz
```

The URI format is:
```
at://did:plc:YOUR_DID/app.bsky.feed.post/abc123xyz
```

You'll need to find your DID (Decentralized Identifier). You can:
1. Use the Bluesky API to resolve your handle to a DID
2. Visit `https://plc.directory/yourusername.bsky.social`
3. Use a tool like the AT Protocol Explorer

**Option 2: Use the Full URL Method**
You can also just copy the full Bluesky post URL and extract the URI from it programmatically.

### Step 3: Add Metadata to Your Blog Post

Add the following to your blog post's frontmatter (the YAML section at the top of the markdown file):

```yaml
---
title: 'Your Blog Post Title'
date: '2025-01-15'
excerpt: 'Your post excerpt'
tags: ['Tag1', 'Tag2']
bsky:
  uri: 'at://did:plc:YOUR_ACTUAL_DID/app.bsky.feed.post/YOUR_POST_ID'
  author: 'yourusername.bsky.social'
---
```

### Step 4: Rebuild Your Site

Run the build command to regenerate your static site with the new comment section:

```bash
npm run build
```

## Example

Here's a complete example of a blog post with Bluesky comments enabled:

```yaml
---
title: 'My Awesome Blog Post'
date: '2025-01-15'
excerpt: 'This post talks about interesting things'
tags: ['Tech', 'Web']
bsky:
  uri: 'at://did:plc:abc123example456/app.bsky.feed.post/3kh5abc123xyz'
  author: 'myblog.bsky.social'
---

Your blog post content goes here...
```

## Features

The comment system includes:

- **Nested replies** - Supports threaded conversations up to 5 levels deep
- **Rich embeds** - Displays images, external links, and quote posts
- **Responsive design** - Works on all screen sizes
- **Image modal** - Click images to view them full-screen
- **Direct links** - Links to view and participate in the conversation on Bluesky
- **Real-time stats** - Shows reply, repost, and like counts

## Technical Details

### Components

- **BlueskyComments** - Main component that fetches and displays the comment thread
- **BlueskyReply** - Handles rendering individual replies with nesting
- **BlueskyEmbed** - Renders rich content (images, links, quote posts)

### Dependencies

- `@atproto/api` - Official AT Protocol client library

### API

The system uses the public Bluesky API endpoint:
- **Endpoint**: `https://public.api.bsky.app`
- **Method**: `getPostThread`
- **Authentication**: None required (public data only)

## Privacy & Performance

- Comments are loaded client-side after the page loads
- No tracking or analytics from the comment system
- Images are served through Bluesky's CDN
- Progressive enhancement - if JavaScript is disabled, the blog still works perfectly

## Troubleshooting

### Comments not showing?

1. Verify the URI format is correct
2. Make sure the Bluesky post is public
3. Check the browser console for errors
4. Ensure you've rebuilt the site after adding the metadata

### Want to disable comments on a post?

Simply remove or comment out the `bsky` section from the frontmatter.

## Future Enhancements

Potential improvements to consider:

- Add a loading skeleton for better UX
- Implement caching to reduce API calls
- Add a "Report" feature for moderation
- Support for viewing deleted/moderated comments
- Real-time updates using WebSocket firehose
