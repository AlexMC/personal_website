# Personal Website

A modern, statically-generated personal website built with Next.js, featuring a blog, project showcase, GitHub contributions integration, and two hidden easter eggs: a Konami code game bar and a Matrix code Trakt TV integration.

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

## Features

### 1. Blog System
- Markdown-based blog posts with YAML frontmatter
- Syntax-highlighted code blocks
- Tag support
- Automatic post listing with dates
- Featured posts on homepage

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

### 6. Matrix Code Easter Egg (Trakt TV Integration)
Hidden stats modal that displays your TV and movie watching activity! Type **"thereisnospoon"** anywhere on the site to activate.

Features:
- **Recently Watched**: Last 5 episodes and movies you've watched
- **Overall Statistics**: Total movies, episodes, shows watched with watch time
- **Upcoming Episodes**: Next 14 days of episodes from shows you're watching
- **Beautiful UI**: Animated modal with Matrix-themed activation
- **Real-time Data**: Fetches fresh data from external backend API
- **ESC to Close**: Press ESC or click backdrop to close

Powered by the [Trakt API](https://trakt.tv/) - tracks your TV shows and movies.

**Architecture**: Uses the same pattern as GitHub contributions - data is fetched client-side from an external FastAPI backend that handles Trakt OAuth authentication securely.

### 7. Responsive Design
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
# External backend API URL (required for GitHub contributions and Trakt stats)
NEXT_PUBLIC_API_URL=https://trendhighlighter.xyz
# NEXT_PUBLIC_API_URL=http://localhost:8000  # For local development
```

**Note:**
- The `NEXT_PUBLIC_API_URL` points to an external FastAPI backend that handles authentication with GitHub and Trakt APIs
- For local development, you'll need to run the backend server (see Backend Setup section below)
- All API credentials are stored securely on the backend, never exposed to the client

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

### Backend Setup (For Local Development)

This website uses an external FastAPI backend to handle API authentication for GitHub contributions and Trakt stats. The backend is located at `~/Projects/trend-highlighter/`.

**Quick Start:**

1. **Navigate to backend directory:**
   ```bash
   cd ~/Projects/trend-highlighter
   ```

2. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure environment variables:**

   Create/update `.env` file in the backend directory:
   ```bash
   # For the personal website
   CONTRIB_TOKEN=your_github_personal_access_token
   WEBSITE_URL=http://localhost:3000

   # Trakt API
   TRAKT_CLIENT_ID=your_trakt_client_id
   TRAKT_CLIENT_SECRET=your_trakt_client_secret
   TRAKT_ACCESS_TOKEN=your_trakt_access_token
   TRAKT_USERNAME=your_trakt_username

   # Other APIs
   MAILERLITE_API_KEY=your_mailerlite_key
   GAMES_API_KEY=your_games_key
   ```

4. **Start the backend server:**
   ```bash
   uvicorn main:app --reload --port 8000
   ```

5. **Update website environment:**

   In your website's `.env.local`:
   ```bash
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

**Backend Endpoints:**
- `GET /api/website/github/contributions/{username}` - GitHub contribution calendar
- `GET /api/website/trakt/{username}` - Trakt watch history and stats
- `GET /api/website/games` - Gaming activity data
- `POST /api/website/newsletter/subscribe` - Newsletter subscription

**Architecture:**

The backend acts as a secure proxy that:
- Stores API credentials securely (never exposed to client)
- Handles OAuth authentication with external services
- Returns formatted data to the static website
- Implements caching to reduce external API calls

See `docs/static-site-dynamic-data-pattern.md` for detailed architecture documentation.

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
   - `NEXT_PUBLIC_API_URL` - External backend API URL (e.g., `https://trendhighlighter.xyz`)

   **Note:** All other API credentials (GitHub token, Trakt credentials, etc.) are stored on the external backend server, not in GitHub secrets. The static site only needs the backend URL.

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

The following environment variable is injected during the build process:

**Website (Static Site):**
- `NEXT_PUBLIC_API_URL` - External backend API URL (e.g., `https://trendhighlighter.xyz`)

**Backend Server:**
All API credentials are stored on the backend server, not in the static site:
- `CONTRIB_TOKEN` - GitHub personal access token
- `TRAKT_CLIENT_ID` - Trakt API client ID
- `TRAKT_CLIENT_SECRET` - Trakt API client secret
- `TRAKT_ACCESS_TOKEN` - Trakt API access token
- `TRAKT_USERNAME` - Your Trakt username
- `MAILERLITE_API_KEY` - Newsletter service authentication
- `GAMES_API_KEY` - Games API authentication
- `WEBSITE_URL` - Your website domain (for CORS)

**Note:** The static site only knows the backend URL. All secrets remain on the backend server, never exposed to the browser.

### Deployment Checklist

Before pushing to production:

**Website (Static Site):**
- [ ] GitHub secret `NEXT_PUBLIC_API_URL` is configured
- [ ] GitHub Pages is enabled on `gh-pages` branch
- [ ] Custom domain CNAME is correct (if applicable)
- [ ] Test build locally with `npm run build`
- [ ] Verify `/out` directory contains expected files
- [ ] Check that images load correctly (use `/images/` path)

**Backend Server:**
- [ ] Backend is deployed and accessible at the configured URL
- [ ] All backend environment variables are set (CONTRIB_TOKEN, TRAKT_*, etc.)
- [ ] CORS is configured to allow your website domain
- [ ] Backend endpoints return data correctly
- [ ] Test endpoints: `/api/website/github/contributions/{username}`, `/api/website/trakt/{username}`

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
│       └── deploy.yml          # GitHub Actions CI/CD configuration
├── components/                  # React components
│   ├── About.js                # About page content
│   ├── ContributionsChart.js   # GitHub contributions heatmap
│   ├── ErrorBoundary.js        # Error handling wrapper
│   ├── Footer.js               # Footer with social links
│   ├── GameBar.js              # Konami code easter egg game bar
│   ├── Header.js               # Navigation header
│   ├── Layout.js               # Page layout wrapper
│   ├── Meta.js                 # SEO meta tags
│   ├── Newsletter.js           # Email subscription form
│   ├── Posts.js                # Blog post listing
│   ├── Projects.js             # Project cards
│   ├── TraktModal.js           # Matrix code easter egg modal
│   └── TraktStats.js           # Trakt TV statistics display
├── data/                        # Content storage (markdown files)
│   ├── posts/                  # Blog posts
│   │   ├── my-first-post.md
│   │   └── ...
│   └── projects/               # Project pages
│       ├── my-project.md
│       └── ...
├── lib/                         # Utility functions and custom hooks
│   ├── github.js               # GitHub API client (calls backend)
│   ├── markdown.js             # Markdown processing pipeline
│   ├── remarkImagePath.js      # Custom remark plugin for images
│   ├── trakt.js                # Trakt API client (calls backend)
│   ├── useKonamiCode.js        # Konami code detection hook
│   ├── useLocalStorage.js      # localStorage persistence hook
│   ├── useMatrixCode.js        # Matrix phrase detection hook
│   └── utils.js                # Path utilities
├── pages/                       # Next.js pages (routes)
│   ├── api/                     # NOT USED (kept as reference)
│   │   ├── github/
│   │   │   └── contributions.js # Reference implementation
│   │   └── trakt/               # Reference implementations
│   │       ├── calendar.js      # (Actual endpoints are on backend)
│   │       ├── history.js
│   │       └── stats.js
│   ├── blog/
│   │   └── [slug].js           # Dynamic blog post pages
│   ├── work/
│   │   └── [slug].js           # Dynamic project pages
│   ├── _app.js                 # App wrapper with easter eggs
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
├── styles/                      # Global styles
│   ├── globals.css             # Base styles and Tailwind imports
│   └── scrollbar-hide.css      # Custom scrollbar utilities
├── .env.example                # Environment variables template
├── .gitignore                  # Git ignore rules
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
- **styles/** - Global CSS and Tailwind configuration

### Route Structure

**Website Routes:**
- `/` - Homepage (index.js)
- `/blog` - Blog listing (blog.js)
- `/blog/[slug]` - Individual blog post (blog/[slug].js)
- `/work` - Projects listing (work.js)
- `/work/[slug]` - Individual project (work/[slug].js)
- `/about` - About page (about.js)

**Backend API Routes** (external server):
- `GET /api/website/github/contributions/{username}` - GitHub contribution data
- `GET /api/website/trakt/{username}` - Trakt watch history, stats, and calendar
- `GET /api/website/games` - Gaming activity data
- `POST /api/website/newsletter/subscribe` - Newsletter subscription

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

### Easter Eggs

**Konami Code (Game Bar):**
To disable or modify:
- Remove `<GameBar />` from `/components/Layout.js`
- Or modify the code sequence in `/lib/useKonamiCode.js`

**Matrix Code (Trakt Stats):**
To disable or modify:
- Remove the `<TraktModal />` and related hooks from `/pages/_app.js`
- Or change the secret phrase in `/lib/useMatrixCode.js` (default: "thereisnospoon")
- Requires backend API to be running and configured with Trakt credentials

## Performance

This site is optimized for performance:

- **Static Site Generation** - All pages pre-rendered at build time
- **No Server Required** - Pure static HTML/CSS/JS
- **Fast Load Times** - Optimized bundles and assets
- **Smart Caching** - 30-minute cache for API data
- **Minimal JavaScript** - Only what's necessary

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
