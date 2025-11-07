# Personal Website

A modern, statically-generated personal website built with Next.js, featuring a blog, project showcase, GitHub contributions integration, and a hidden Konami code easter egg.

**Live Site:** [alexcarvalho.me](https://alexcarvalho.me)

## Tech Stack

### Core Framework
- **Next.js 14.2.23** - React framework with static site generation (SSG)
- **React 18.2.0** - UI library
- **Node.js 18** - Runtime environment

### Styling
- **Tailwind CSS 3.4.1** - Utility-first CSS framework
- **@tailwindcss/typography** - Enhanced typography and prose styling
- **PostCSS** - CSS processing with autoprefixer
- **Custom Theme** - Cyberpunk/terminal aesthetic with monospace fonts

### Content Management
- **gray-matter** - YAML frontmatter parser for markdown files
- **remark** - Markdown processor
- **remark-html** - HTML rendering from markdown
- **remark-prism** - Syntax highlighting for code blocks

### Utilities
- **axios** - HTTP client for API requests
- **unist-util-visit** - AST traversal for custom markdown plugins
- **@atproto/api** - AT Protocol (Bluesky) client for decentralized comments

## Features

### 1. Blog System
- Markdown-based blog posts with YAML frontmatter
- Syntax-highlighted code blocks
- Tag support
- Automatic post listing with dates
- Featured posts on homepage
- **Decentralized comments via Bluesky/AT Protocol** (see [BLUESKY_COMMENTS.md](BLUESKY_COMMENTS.md))
  - No database or user management required
  - Comments pulled from Bluesky post replies
  - Rich content support (images, links, threaded conversations)
  - Fully automated CI/CD workflow for sharing posts

### 2. Project Showcase
- Project pages with markdown content
- Featured projects display
- Technology tags
- External links to live projects

### 3. GitHub Contributions Chart
- Visual heatmap of GitHub activity
- Last 365 days of contributions
- Color-coded by activity level
- Hover tooltips with dates and counts

### 4. Newsletter Integration
- Email subscription form
- Integration with external API
- Success/error state handling

### 5. Konami Code Easter Egg
Hidden game bar that displays your gaming activity! Try entering the classic Konami code: ↑ ↑ ↓ ↓ ← → ← → B A

Features:
- Fetches gaming data from external API
- Carousel navigation with game box art
- 30-minute cache using localStorage
- Can be closed with ESC key

### 6. Responsive Design
- Mobile-first approach
- Terminal/hacker aesthetic
- Custom animations (blink, slideUp)
- JetBrains Mono monospace font

## Getting Started

### Prerequisites
- Node.js 18 or higher
- npm or yarn
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/AlexMC/personal_website.git
cd personal_website
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:

Create a `.env.local` file in the root directory:
```bash
# GitHub configuration (optional - for contributions chart)
NEXT_PUBLIC_GITHUB_TOKEN=your_github_personal_access_token
NEXT_PUBLIC_GITHUB_USERNAME=your_github_username

# Bluesky configuration (optional - for auto-sharing blog posts)
# Get an app password from: https://bsky.app/settings/app-passwords
BSKY_HANDLE=your_username.bsky.social
BSKY_APP_PASSWORD=your-app-password-here
SITE_URL=https://yourdomain.com
```

**Note:**
- The GitHub token is optional. If not provided, the contributions chart will use fallback data or not display.
- Bluesky credentials are optional. If not provided, you can still manually add comment metadata to posts. See [BLUESKY_COMMENTS.md](BLUESKY_COMMENTS.md) for details.

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Available Scripts

- `npm run dev` - Start development server on port 3000
- `npm run build` - Build static site for production
- `npm start` - Run production build locally
- `npm run lint` - Run Next.js linter
- `npm run share-to-bluesky` - Manually share posts to Bluesky (requires BSKY_ env vars)

## Content Management

### Adding a New Blog Post

1. Create a new markdown file in `/data/posts/` directory:
```bash
touch data/posts/my-new-post.md
```

2. Add frontmatter and content:
```markdown
---
title: 'Your Post Title'
date: '2025-01-15'
excerpt: 'A brief summary of your post that appears in listings'
tags: ['Tag1', 'Tag2', 'Tag3']
# Optional: Bluesky comments (will be auto-added by CI/CD if configured)
# bsky:
#   uri: 'at://did:plc:YOUR_DID/app.bsky.feed.post/POST_ID'
#   author: 'yourusername.bsky.social'
---

Your blog post content goes here. You can use all standard markdown features:

## Headings

**Bold text**, *italic text*, and `inline code`.

### Code Blocks

\`\`\`javascript
function example() {
  console.log("Code blocks support syntax highlighting!");
}
\`\`\`

### Images

![Alt text](/images/your-image.png)

### Lists

- Item 1
- Item 2
- Item 3
```

3. Add images to `/public/images/` directory if needed

4. The post will automatically appear in:
   - `/blog` - Full blog listing
   - `/` - Homepage (latest 3 posts)

**Important Notes:**
- Use YYYY-MM-DD format for dates
- Images should be placed in `/public/images/`
- Reference images with `/images/filename.png` (no /public prefix)
- Posts are sorted by date automatically (newest first)
- **Bluesky Comments:** If configured, posts are automatically shared to Bluesky when pushed to `main`, and the `bsky` metadata is added automatically. See [BLUESKY_COMMENTS.md](BLUESKY_COMMENTS.md) for setup instructions.

### Adding a New Project

1. Create a new markdown file in `/data/projects/` directory:
```bash
touch data/projects/my-project.md
```

2. Add frontmatter and content:
```markdown
---
title: "Project Name"
description: "A brief description that appears on the project card"
technologies: ["React", "Node.js", "PostgreSQL"]
link: "https://your-project-url.com"
image: "/images/project-screenshot.png"
featured: true
---

# Project Name

Detailed description of your project...

## Features

- Feature 1
- Feature 2

## Technical Implementation

Explain your architecture, challenges, solutions, etc.
```

3. The project will automatically appear in:
   - `/work` - Full project listing
   - `/` - Homepage (if `featured: true`, limited to 2 projects)

**Frontmatter Fields:**
- `title` (required) - Project name
- `description` (required) - Short description for cards
- `technologies` (optional) - Array of tech stack items
- `link` (optional) - External project URL
- `image` (optional) - Screenshot or logo
- `featured` (optional) - Set to `true` to display on homepage

## Deployment

This site uses GitHub Actions for automated deployment to GitHub Pages.

### Initial Setup

1. **Enable GitHub Pages:**
   - Go to your repository Settings → Pages
   - Source: Deploy from a branch
   - Branch: `gh-pages` (will be created automatically)
   - Folder: `/ (root)`

2. **Configure GitHub Secrets:**

   Go to Settings → Secrets and variables → Actions and add:

   Required secrets:
   - `CONTRIB_TOKEN` - GitHub personal access token for contributions API
   - `CONTRIB_USERNAME` - Your GitHub username
   - `MAILERLITE_API_KEY` - MailerLite API key for newsletter
   - `NEXT_PUBLIC_API_URL` - External API endpoint URL

   Optional secrets (for Bluesky comments):
   - `BSKY_HANDLE` - Your Bluesky handle (e.g., username.bsky.social)
   - `BSKY_APP_PASSWORD` - Bluesky app password (from https://bsky.app/settings/app-passwords)

   Optional variables:
   - `SITE_URL` - Your website URL (e.g., https://yourdomain.com)

   **Creating a GitHub Personal Access Token:**
   - Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
   - Generate new token with `read:user` scope
   - Copy the token and add it as `CONTRIB_TOKEN` secret

   **Creating a Bluesky App Password:**
   - Go to Bluesky Settings → App Passwords
   - Create a new app password
   - Copy the password immediately (you won't see it again)
   - Add it as `BSKY_APP_PASSWORD` secret

3. **Custom Domain (Optional):**

   If using a custom domain, update `/public/CNAME`:
   ```
   yourdomain.com
   ```

### Deployment Process

The deployment is fully automated via GitHub Actions:

**Trigger:** Push to `main` branch

**Workflow Steps:**
1. **Checkout** - Fetches repository code
2. **Setup Node.js** - Installs Node.js 18 with npm cache
3. **Install Dependencies** - Runs `npm ci` for clean install
4. **Build** - Runs `npm run build` with environment variables
   - Generates static HTML/CSS/JS in `/out` directory
   - Pre-renders all pages at build time
   - Optimizes assets and bundles
5. **Create .nojekyll** - Prevents Jekyll processing on GitHub Pages
6. **Deploy** - Pushes `/out` directory to `gh-pages` branch
   - Uses JamesIves/github-pages-deploy-action@v4
   - Cleans previous builds
   - Makes site live at your GitHub Pages URL

**Deployment File:** `.github/workflows/deploy.yml`

### Manual Deployment

To build and deploy manually:

1. Build the static site:
```bash
npm run build
```

2. The output will be in the `/out` directory

3. Deploy the `/out` directory to any static hosting service (Vercel, Netlify, etc.)

### Environment Variables in Production

The following environment variables are injected during the build process:

- `CONTRIB_TOKEN` - GitHub contributions API authentication
- `CONTRIB_USERNAME` - Your GitHub username for contributions chart
- `MAILERLITE_API_KEY` - Newsletter service authentication
- `NEXT_PUBLIC_API_URL` - Base URL for external API calls

**Note:** Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser and embedded in the static build.

### Deployment Checklist

Before pushing to production:
- [ ] All GitHub secrets are configured
- [ ] GitHub Pages is enabled on `gh-pages` branch
- [ ] Custom domain CNAME is correct (if applicable)
- [ ] Environment variables are set in GitHub Actions
- [ ] Test build locally with `npm run build`
- [ ] Verify `/out` directory contains expected files
- [ ] Check that images load correctly (use `/images/` path)

### Troubleshooting Deployment

**Build fails:**
- Check GitHub Actions logs for errors
- Verify all dependencies are in package.json
- Ensure Node.js version matches (18)

**Images not loading:**
- Images must be in `/public/images/`
- Reference as `/images/filename.png` (not `/public/images/`)
- Check image paths in markdown files

**404 on page refresh:**
- This is expected with static export
- GitHub Pages handles this automatically for Next.js routes

**Custom domain not working:**
- Verify CNAME file in `/public` directory
- Check DNS settings point to GitHub Pages
- Allow 24-48 hours for DNS propagation

## Project Structure

```
personal_website/
├── .github/
│   └── workflows/
│       ├── deploy.yml          # GitHub Actions deployment configuration
│       └── auto-share-bluesky.yml # Auto-share posts to Bluesky workflow
├── components/                  # React components
│   ├── About.js                # About page content
│   ├── BlueskyComments.js      # Bluesky comment thread display
│   ├── BlueskyEmbed.js         # Bluesky rich content embeds
│   ├── BlueskyReply.js         # Individual comment with nesting
│   ├── ContributionsChart.js   # GitHub contributions heatmap
│   ├── ErrorBoundary.js        # Error handling wrapper
│   ├── Footer.js               # Footer with social links
│   ├── GameBar.js              # Konami code easter egg game bar
│   ├── Header.js               # Navigation header
│   ├── Layout.js               # Page layout wrapper
│   ├── Meta.js                 # SEO meta tags
│   ├── Newsletter.js           # Email subscription form
│   ├── Posts.js                # Blog post listing
│   └── Projects.js             # Project cards
├── data/                        # Content storage (markdown files)
│   ├── posts/                  # Blog posts
│   │   ├── my-first-post.md
│   │   └── ...
│   └── projects/               # Project pages
│       ├── my-project.md
│       └── ...
├── lib/                         # Utility functions and custom hooks
│   ├── github.js               # GitHub API client
│   ├── markdown.js             # Markdown processing pipeline
│   ├── remarkImagePath.js      # Custom remark plugin for images
│   ├── useKonamiCode.js        # Konami code detection hook
│   ├── useLocalStorage.js      # localStorage persistence hook
│   └── utils.js                # Path utilities
├── pages/                       # Next.js pages (routes)
│   ├── api/
│   │   └── github/
│   │       └── contributions.js # GitHub GraphQL API endpoint
│   ├── blog/
│   │   └── [slug].js           # Dynamic blog post pages
│   ├── work/
│   │   └── [slug].js           # Dynamic project pages
│   ├── _app.js                 # App wrapper
│   ├── about.js                # About page
│   ├── blog.js                 # Blog listing page
│   ├── index.js                # Homepage
│   └── work.js                 # Projects listing page
├── public/                      # Static assets (served as-is)
│   ├── images/                 # Images for posts and projects
│   ├── CNAME                   # Custom domain configuration
│   ├── favicon.ico             # Site favicon
│   ├── manifest.json           # PWA manifest
│   └── browserconfig.xml       # Windows tile configuration
├── scripts/                     # Automation scripts
│   └── auto-share-to-bluesky.js # Auto-share blog posts to Bluesky
├── styles/                      # Global styles
│   ├── globals.css             # Base styles and Tailwind imports
│   └── scrollbar-hide.css      # Custom scrollbar utilities
├── .env.example                # Environment variables template
├── .gitignore                  # Git ignore rules
├── BLUESKY_COMMENTS.md         # Bluesky comments setup guide
├── next.config.js              # Next.js configuration
├── package.json                # Dependencies and scripts
├── postcss.config.js           # PostCSS configuration
├── tailwind.config.js          # Tailwind CSS configuration
└── README.md                   # This file
```

### Key Directories

- **components/** - Reusable React components used across pages
- **data/** - All content stored as markdown files (posts and projects)
- **lib/** - Utility functions, API clients, and custom React hooks
- **pages/** - Next.js file-based routing (each file = a route)
- **public/** - Static assets served directly (images, favicons, etc.)
- **scripts/** - Automation scripts (Bluesky auto-sharing, etc.)
- **styles/** - Global CSS and Tailwind configuration

### Route Structure

- `/` - Homepage (index.js)
- `/blog` - Blog listing (blog.js)
- `/blog/[slug]` - Individual blog post (blog/[slug].js)
- `/work` - Projects listing (work.js)
- `/work/[slug]` - Individual project (work/[slug].js)
- `/about` - About page (about.js)
- `/api/github/contributions` - GitHub API endpoint (api/github/contributions.js)

## Customization

### Theme Colors

Edit `/tailwind.config.js` to customize the color scheme:

```javascript
theme: {
  extend: {
    colors: {
      primary: '#00FF9E',      // Main accent color
      background: '#000000',    // Background
      // Add your colors...
    },
  },
}
```

### Fonts

The site uses JetBrains Mono. To change fonts, update:

1. `/tailwind.config.js` - Font family configuration
2. `/styles/globals.css` - Font imports

### Navigation

Edit `/components/Header.js` to modify navigation links:

```javascript
const navigation = [
  { name: 'HOME', href: '/' },
  { name: 'WORK', href: '/work' },
  { name: 'BLOG', href: '/blog' },
  { name: 'ABOUT', href: '/about' },
]
```

### Social Links

Edit `/components/Footer.js` to update social media links.

### Konami Code

To disable or modify the Konami code easter egg:
- Remove `<GameBar />` from `/components/Layout.js`
- Or modify the code sequence in `/lib/useKonamiCode.js`

## Performance

This site is optimized for performance:

- **Static Site Generation** - All pages pre-rendered at build time
- **No Server Required** - Pure static HTML/CSS/JS
- **Fast Load Times** - Optimized bundles and assets
- **Smart Caching** - 30-minute cache for API data
- **Minimal JavaScript** - Only what's necessary

## Bluesky Comments Integration

This site features a decentralized comment system powered by Bluesky's AT Protocol, eliminating the need for a traditional comment database.

### How It Works

- Blog posts are shared to Bluesky when pushed to the `main` branch
- Replies to the Bluesky post become comments on the blog
- Comments are fetched client-side via the AT Protocol API
- No user management, databases, or backend infrastructure needed

### Features

- ✅ **Fully automated** - CI/CD workflow shares posts and adds metadata
- ✅ **Rich content** - Images, links, and threaded conversations
- ✅ **Real identities** - Users comment with their Bluesky profiles
- ✅ **No tracking** - Privacy-focused, no analytics
- ✅ **Decentralized** - Comments live on Bluesky's network
- ✅ **Progressive enhancement** - Works without JavaScript

### Setup

See [BLUESKY_COMMENTS.md](BLUESKY_COMMENTS.md) for detailed setup instructions.

Quick setup:
1. Get Bluesky app password from https://bsky.app/settings/app-passwords
2. Add `BSKY_HANDLE` and `BSKY_APP_PASSWORD` to GitHub Secrets
3. Push a new blog post - it's automatically shared and configured!

### Manual Sharing

To manually share posts to Bluesky:

```bash
# Ensure BSKY_HANDLE, BSKY_APP_PASSWORD, and SITE_URL are set in .env
npm run share-to-bluesky
```

## License

This project is open source and available for personal use. Feel free to use it as a template for your own site.

## Support

For issues or questions:
- Check the [Next.js documentation](https://nextjs.org/docs)
- Review the [Tailwind CSS docs](https://tailwindcss.com/docs)
- Open an issue on GitHub

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Deployed on [GitHub Pages](https://pages.github.com/)
- Icons and assets from various open-source projects
