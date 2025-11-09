# Static Site with Dynamic Data Pattern

## The Problem

This website uses Next.js with `output: 'export'` for static site generation, deployed on GitHub Pages. However, **API Routes don't work with static exports** - they require a Node.js server to run.

This creates a challenge when you need to:
- Fetch data from external APIs that require authentication
- Display dynamic data that changes frequently
- Keep API keys and secrets secure (not exposed in client-side code)

## The Solution: External Backend API

Instead of using Next.js API routes, we use an **external backend server** to handle API requests and authentication.

### Architecture Overview

```
┌─────────────────────────┐
│   Static Website        │
│   (GitHub Pages)        │
│                         │
│  ┌──────────────────┐   │
│  │ React Component  │   │
│  │  (Client-side)   │   │
│  └────────┬─────────┘   │
└───────────┼─────────────┘
            │
            │ HTTP Request
            │ (No Auth)
            ▼
┌─────────────────────────┐
│  External Backend API   │
│  (trendhighlighter.xyz) │
│                         │
│  ┌──────────────────┐   │
│  │  API Endpoint    │   │
│  │  (Stores tokens) │   │
│  └────────┬─────────┘   │
└───────────┼─────────────┘
            │
            │ Authenticated
            │ API Request
            ▼
┌─────────────────────────┐
│   External Service      │
│   (GitHub, Trakt, etc)  │
└─────────────────────────┘
```

## Implementation Example: GitHub Contributions

### 1. Client-side Data Fetching

**File:** `lib/github.js`

```javascript
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function getContributionsData() {
  try {
    const { data } = await axios.get(`${API_URL}/api/website/github/contributions/alexmc`);
    return data;
  } catch (error) {
    console.error('Error fetching GitHub contributions:', error);
    return {
      contributions: {},
      totalContributions: 0,
    };
  }
}
```

**Key Points:**
- Uses `NEXT_PUBLIC_API_URL` environment variable to point to external backend
- Makes a simple GET request with **no authentication headers**
- Returns fallback data if the request fails (graceful degradation)

### 2. React Component with useEffect

**File:** `components/ContributionsChart.js`

```javascript
import { useState, useEffect } from 'react';
import { getContributionsData } from '../lib/github';

const ContributionsChart = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState({ contributions: {}, totalContributions: 0 });

  useEffect(() => {
    const fetchContributions = async () => {
      try {
        const contributionsData = await getContributionsData();
        setData(contributionsData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching contributions:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchContributions();
  }, []);

  // ... render logic with loading and error states
};
```

**Key Points:**
- Data is fetched **client-side** after the page loads in the browser
- Shows a loading skeleton while fetching (better UX)
- Handles errors gracefully
- The static HTML is generated without this data, then hydrated client-side

### 3. External Backend Implementation

The actual backend is a **FastAPI (Python) application** deployed at `trendhighlighter.xyz`.

**Project Location:** `~/Projects/trend-highlighter/`

**File:** `app/website/router.py`

```python
from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
import httpx
import os

router = APIRouter(prefix="/api/website", tags=["website"])

async def fetch_github_contributions(username: str):
    token = os.getenv("CONTRIB_TOKEN")
    if not token:
        raise HTTPException(status_code=500, detail="GitHub token not configured")

    query = """
        query($username: String!) {
            user(login: $username) {
                contributionsCollection {
                    contributionCalendar {
                        totalContributions
                        weeks {
                            contributionDays {
                                contributionCount
                                date
                            }
                        }
                    }
                }
            }
        }
    """

    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://api.github.com/graphql",
            json={"query": query, "variables": {"username": username}},
            headers={"Authorization": f"bearer {token}"}
        )

        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail="GitHub API error")

        data = response.json()
        if "errors" in data:
            raise HTTPException(status_code=400, detail=data["errors"][0]["message"])

        calendar = data["data"]["user"]["contributionsCollection"]["contributionCalendar"]
        contributions = {}

        for week in calendar["weeks"]:
            for day in week["contributionDays"]:
                contributions[day["date"]] = day["contributionCount"]

        return {
            "contributions": contributions,
            "totalContributions": calendar["totalContributions"]
        }

@router.get("/github/contributions/{username}")
async def get_contributions(username: str):
    try:
        data = await fetch_github_contributions(username)
        return JSONResponse(
            content=data,
            headers={
                "Cache-Control": "public, max-age=3600",  # Cache for 1 hour
                "Access-Control-Allow-Origin": os.getenv("WEBSITE_URL", "https://alexmc.github.io"),
                "Access-Control-Allow-Methods": "GET",
                "Access-Control-Max-Age": "3600",
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

**Key Implementation Details:**

1. **FastAPI Router:** Modular routing with `/api/website` prefix
2. **Async HTTP Client:** Uses `httpx.AsyncClient` for non-blocking requests
3. **Environment Variables:** Secrets loaded via `os.getenv()` from `.env` file
4. **GitHub GraphQL API:** Queries contribution calendar data
5. **CORS Headers:**
   - `Access-Control-Allow-Origin`: Allows requests from your static site
   - Can be configured via `WEBSITE_URL` environment variable
6. **Caching:** `Cache-Control: public, max-age=3600` reduces GitHub API calls
7. **Error Handling:** Proper HTTP status codes and error messages

**Backend Stack:**
- **Framework:** FastAPI (Python web framework)
- **HTTP Client:** httpx (async HTTP library)
- **Deployment:** Standalone server (Heroku/Railway/VPS)
- **Main App:** `main.py` includes this router with CORS middleware

## Why This Works

### Build Time vs Runtime

1. **Build Time (Static Export):**
   - Next.js generates static HTML, CSS, and JavaScript
   - No data from external APIs is included
   - No server-side code runs

2. **Runtime (In Browser):**
   - User loads the static page
   - React hydrates and runs `useEffect`
   - Client-side JavaScript fetches data from external backend
   - Component updates with fetched data

### Security Benefits

- ✅ **API tokens never exposed:** Secrets stay on the backend server
- ✅ **No .env in client:** Only `NEXT_PUBLIC_*` variables are bundled (and these are just URLs)
- ✅ **Centralized auth:** All authentication logic lives on the backend
- ✅ **Rate limiting:** Backend can implement rate limiting and abuse prevention

### Authentication Model

**There is NO authentication between the static site and the external backend.**

The endpoints are publicly accessible but controlled:

#### Client → Backend: No Authentication
- Simple HTTP GET requests with no auth headers
- Anyone with the URL can call the endpoints
- Protected by CORS headers to restrict browser access

#### Backend → External APIs: Authenticated
The backend handles all authentication with external services:

**Example from `app/website/router.py`:**
```python
# Backend stores secrets in environment variables
token = os.getenv("CONTRIB_TOKEN")  # GitHub personal access token

# Backend adds authentication to external API calls
response = await client.post(
    "https://api.github.com/graphql",
    headers={"Authorization": f"bearer {token}"}
)
```

**Secrets stored on backend:**
- `CONTRIB_TOKEN` - GitHub personal access token
- `MAILERLITE_API_KEY` - MailerLite API key
- `GAMES_API_KEY` - Games API key
- `TRAKT_CLIENT_ID`, `TRAKT_CLIENT_SECRET`, `TRAKT_ACCESS_TOKEN` - Trakt OAuth credentials

#### CORS Protection

The backend uses CORS headers to restrict which domains can call it:

```python
headers={
    "Access-Control-Allow-Origin": os.getenv("WEBSITE_URL", "https://alexmc.github.io"),
    "Access-Control-Allow-Methods": "GET",
    "Access-Control-Max-Age": "3600",
}
```

**Main CORS configuration (from `main.py`):**
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Currently allows all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

**Security Trade-offs:**
- ✅ **Secrets protected:** API tokens never exposed to client
- ✅ **Read-only data:** Endpoints only return public information
- ⚠️ **Publicly accessible:** Anyone can call the endpoints (if they know the URL)
- ⚠️ **No rate limiting:** Currently no built-in protection against abuse
- ⚠️ **CORS allows all:** Main app allows all origins (could be restricted per-route)

**If you needed stronger authentication:**
- API keys in request headers
- Request signing with shared secrets
- JWT tokens for user-specific data
- OAuth flows for personalized content

## Configuration

### Environment Variables

#### Static Site (Next.js)

**.env.local** (in website project):
```bash
# External backend URL - This is the ONLY variable needed by the static site
NEXT_PUBLIC_API_URL=https://trendhighlighter.xyz
# NEXT_PUBLIC_API_URL=http://localhost:8000  # For local development
```

**Important:**
- Only `NEXT_PUBLIC_*` variables are bundled into the static site
- This URL is public and visible in the browser's network tab
- Never put secrets in `NEXT_PUBLIC_*` variables

#### Backend (FastAPI)

**.env** (in `~/Projects/trend-highlighter/`):
```bash
# GitHub API
CONTRIB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx
CONTRIB_USERNAME=alexmc

# Trakt API
TRAKT_CLIENT_ID=d58cb851bfc1f2b0f6a6401c338cee89ae06ba019f000d652f94adc317df7699
TRAKT_CLIENT_SECRET=43b25453c6b3d93538494e48908f75285d4f32b78eb1fa6480e970911ee9d5ae
TRAKT_ACCESS_TOKEN=9eee306da57b56c38b3bddbd3dcf151edac082b6318b85307e69a66b54a470ad
TRAKT_USERNAME=alexmc

# Email/Newsletter
MAILERLITE_API_KEY=eyJ0eXAiOiJKV1QiLCJhbGc...

# Games API
GAMES_API_KEY=your_games_api_key

# Website URL for CORS
WEBSITE_URL=https://alexmc.github.io

# Other Farcaster/Neynar settings for main app
NEYNAR_CLIENT_ID=xxx
# ... etc
```

**Important:**
- These secrets are NEVER exposed to the client
- Loaded via Python's `os.getenv()` at runtime
- Never commit `.env` to git
- Use `.env.example` for documentation

### Deployment

#### 1. Static Site (GitHub Pages)

**Build Configuration:**
```bash
# In GitHub Actions or local build
export NEXT_PUBLIC_API_URL=https://trendhighlighter.xyz
npm run build
```

**Deployment:**
- Static files generated to `out/` directory
- Deployed to GitHub Pages via GitHub Actions
- No server needed, just static file hosting

#### 2. External Backend (FastAPI)

**Project:** `~/Projects/trend-highlighter/`

**Local Development:**
```bash
# Install dependencies
pip install -r requirements.txt

# Run with uvicorn
uvicorn main:app --reload --port 8000
```

**Production Deployment:**
- **Platform Options:** Heroku, Railway, Render, DigitalOcean, AWS EC2
- **Requirements:** Python runtime, ability to run `uvicorn`
- **Environment:** Set all `.env` variables in platform's environment config
- **CORS:** Ensure `WEBSITE_URL` is set to your GitHub Pages domain
- **Process:** `uvicorn main:app --host 0.0.0.0 --port $PORT`

**Current Deployment:**
- Hosted at: `trendhighlighter.xyz`
- Main app handles Farcaster trend tracking
- Website-specific routes at `/api/website/*`

## Backend API Endpoints

The external backend (`~/Projects/trend-highlighter/`) provides several website-specific endpoints:

### Available Endpoints

**Base URL:** `https://trendhighlighter.xyz/api/website`

1. **GitHub Contributions**
   ```
   GET /api/website/github/contributions/{username}
   ```
   - Returns GitHub contribution calendar data
   - Cached for 1 hour
   - Uses GitHub GraphQL API with personal access token

2. **Trakt Data**
   ```
   GET /api/website/trakt/{username}
   ```
   - Returns Trakt watch history, stats, and upcoming episodes
   - Cached for 30 minutes
   - Uses Trakt API with OAuth access token
   - Response includes:
     - `history`: Recently watched episodes and movies (last 5 each)
     - `stats`: Overall watch statistics
     - `calendar`: Upcoming episodes (next 14 days)
     - `buildTime`: Timestamp of when data was fetched

3. **Games Data**
   ```
   GET /api/website/games
   ```
   - Proxies to internal games API
   - Cached for 5 minutes
   - Requires `GAMES_API_KEY`

4. **Newsletter Subscription**
   ```
   POST /api/website/newsletter/subscribe
   Body: { "email": "user@example.com" }
   ```
   - Subscribes email to MailerLite newsletter
   - Uses MailerLite API with API key

### Adding New Endpoints

To add a new endpoint for your static site:

1. **Add route to backend** (`~/Projects/trend-highlighter/app/website/router.py`):
   ```python
   @router.get("/trakt/stats/{username}")
   async def get_trakt_stats(username: str):
       # Fetch from Trakt API with OAuth
       # Return formatted data with CORS headers
   ```

2. **Create client library** (in your website):
   ```javascript
   // lib/trakt.js
   import axios from 'axios';

   const API_URL = process.env.NEXT_PUBLIC_API_URL;

   export async function getTraktStats(username) {
     const { data } = await axios.get(
       `${API_URL}/api/website/trakt/stats/${username}`
     );
     return data;
   }
   ```

3. **Use in component:**
   ```javascript
   useEffect(() => {
     getTraktStats('alexmc').then(setData);
   }, []);
   ```

## Complete Example: Trakt Integration

Here's a full implementation example showing how the Trakt integration was refactored to follow this pattern.

### 1. Backend Implementation

**File:** `~/Projects/trend-highlighter/app/website/router.py`

```python
async def fetch_trakt_data(username: str) -> Dict[str, Any]:
    """Fetch Trakt data from the Trakt API"""
    client_id = os.getenv("TRAKT_CLIENT_ID")
    access_token = os.getenv("TRAKT_ACCESS_TOKEN")

    if not client_id or not access_token:
        raise HTTPException(status_code=500, detail="Trakt API credentials not configured")

    TRAKT_API_URL = "https://api.trakt.tv"
    TRAKT_API_VERSION = "2"

    headers = {
        "Content-Type": "application/json",
        "trakt-api-key": client_id,
        "trakt-api-version": TRAKT_API_VERSION,
        "Authorization": f"Bearer {access_token}",
    }

    from datetime import datetime
    import asyncio

    today = datetime.now().date().isoformat()

    async with httpx.AsyncClient() as client:
        # Fetch all data in parallel
        episodes_res, movies_res, stats_res, calendar_res = await asyncio.gather(
            client.get(f"{TRAKT_API_URL}/users/{username}/history/episodes",
                      headers=headers, params={"limit": 5}),
            client.get(f"{TRAKT_API_URL}/users/{username}/history/movies",
                      headers=headers, params={"limit": 5}),
            client.get(f"{TRAKT_API_URL}/users/{username}/stats", headers=headers),
            client.get(f"{TRAKT_API_URL}/calendars/my/shows/{today}/14", headers=headers)
        )

        # Check for errors
        for response in [episodes_res, movies_res, stats_res, calendar_res]:
            if response.status_code != 200:
                raise HTTPException(status_code=response.status_code,
                                  detail=f"Trakt API error: {response.text}")

        return {
            "history": {
                "episodes": episodes_res.json(),
                "movies": movies_res.json(),
            },
            "stats": stats_res.json(),
            "calendar": calendar_res.json(),
            "buildTime": datetime.now().isoformat(),
        }

@router.get("/trakt/{username}")
async def get_trakt_data(username: str):
    """Get Trakt watch history, stats, and upcoming shows"""
    try:
        data = await fetch_trakt_data(username)
        return JSONResponse(
            content=data,
            headers={
                "Cache-Control": "public, max-age=1800",  # Cache for 30 minutes
                "Access-Control-Allow-Origin": os.getenv("WEBSITE_URL", "https://alexmc.github.io"),
                "Access-Control-Allow-Methods": "GET",
                "Access-Control-Max-Age": "3600",
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

### 2. Client Library

**File:** `lib/trakt.js`

```javascript
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

// Keep utility functions that don't need API calls
export function getRelativeTime(date) {
  const now = new Date();
  const watched = new Date(date);
  const diffMs = now - watched;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffMins > 0) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  return 'just now';
}
```

### 3. Component Usage

**File:** `components/TraktModal.js`

```javascript
import { useEffect, useState } from 'react';
import TraktStats from './TraktStats';
import { getTraktData } from '../lib/trakt';

export default function TraktModal({ isOpen, onClose }) {
  const [traktData, setTraktData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch Trakt data from the external backend API
  useEffect(() => {
    if (isOpen && !traktData) {
      setLoading(true);
      getTraktData('alexmc')
        .then(data => {
          setTraktData(data);
          setLoading(false);
        })
        .catch(err => {
          console.error('Failed to load Trakt data:', err);
          setTraktData({ error: 'Failed to load Trakt data' });
          setLoading(false);
        });
    }
  }, [isOpen, traktData]);

  // ... rest of component
}
```

### Key Changes Made

**Before (Build-time Static Data):**
- Build script fetched data and saved to `public/trakt-data.json`
- Component loaded static file at runtime
- Data was stale from build time
- Required `prebuild` script in package.json

**After (Client-side API Fetch):**
- Component fetches data from backend API at runtime
- Data is fresh on each request (cached 30 minutes on backend)
- No build-time fetching needed
- Follows same pattern as GitHub contributions

**Files Removed:**
- `scripts/fetch-trakt-data.js` - Build-time data fetcher
- `scripts/get-trakt-token.js` - OAuth helper script
- `public/trakt-data.json` - Static data file
- `prebuild` script from `package.json`

**Files Modified:**
- `lib/trakt.js` - Simplified to call backend API
- `components/TraktModal.js` - Fetch from API instead of static file
- `components/TraktStats.js` - Updated error messages

**Backend Added:**
- `app/website/router.py` - New `/trakt/{username}` endpoint

## Applying This Pattern to Other APIs

This same pattern works for any external API that requires authentication:

### Alternative: Build-time Static Data

For data that doesn't change frequently, you can also:

1. **Fetch at build time** with a script
2. **Save to public folder** (e.g., `public/trakt-data.json`)
3. **Read from static file** in client

This is useful for data that updates hourly/daily rather than real-time.

## Trade-offs

### Pros
- ✅ Free static hosting (GitHub Pages)
- ✅ Fast page loads (static HTML)
- ✅ Secure (no secrets in client code)
- ✅ Scalable (CDN distribution)
- ✅ Works with any API

### Cons
- ⚠️ Requires external backend infrastructure
- ⚠️ Data fetched after page load (not SEO-friendly)
- ⚠️ Loading states needed for better UX
- ⚠️ Two deployments to manage (static site + backend)

## Conclusion

By using an external backend API, you can have the best of both worlds:
- Static site benefits (speed, cost, simplicity)
- Dynamic data capabilities (live updates, authenticated APIs)

The key is separating concerns:
- **Static site:** UI, presentation, client-side interactions
- **Backend API:** Authentication, data fetching, business logic

## Complete Architecture Summary

```
┌─────────────────────────────────────────────────────────────────┐
│                    User's Browser                               │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Static Website (alexmc.github.io)                       │  │
│  │  - Built with Next.js (output: 'export')                 │  │
│  │  - Deployed to GitHub Pages                              │  │
│  │  - Contains: HTML, CSS, JS                               │  │
│  │  - Client-side React components                          │  │
│  │                                                           │  │
│  │  Environment: NEXT_PUBLIC_API_URL=trendhighlighter.xyz   │  │
│  └─────────────────────────┬────────────────────────────────┘  │
│                            │                                    │
│                            │ Client-side fetch (no auth)        │
│                            │ axios.get(`${API_URL}/api/...`)    │
└────────────────────────────┼────────────────────────────────────┘
                             │
                             ▼
           ┌─────────────────────────────────────┐
           │  External Backend API               │
           │  (trendhighlighter.xyz)             │
           │                                     │
           │  FastAPI Application                │
           │  - main.py (main app)               │
           │  - app/website/router.py (website)  │
           │  - CORS enabled for website origin  │
           │  - No auth required from client     │
           │                                     │
           │  Secrets (from .env):               │
           │  - CONTRIB_TOKEN                    │
           │  - TRAKT_ACCESS_TOKEN               │
           │  - MAILERLITE_API_KEY               │
           │  - GAMES_API_KEY                    │
           └────────┬────────────────────────────┘
                    │
                    │ Authenticated requests
                    │ (adds Bearer tokens, API keys)
                    │
        ┌───────────┴───────────┬────────────────┬─────────────┐
        ▼                       ▼                ▼             ▼
   ┌─────────┐          ┌─────────────┐   ┌──────────┐  ┌──────────┐
   │ GitHub  │          │   Trakt     │   │MailerLite│  │  Games   │
   │   API   │          │    API      │   │   API    │  │   API    │
   └─────────┘          └─────────────┘   └──────────┘  └──────────┘
```

### Request Flow Example

1. **User visits:** `https://alexmc.github.io`
2. **Static page loads:** HTML/CSS/JS delivered from GitHub Pages CDN
3. **React hydrates:** Component runs `useEffect` hook
4. **API call:** `fetch('https://trendhighlighter.xyz/api/website/github/contributions/alexmc')`
5. **Backend receives:** Public request (no auth needed)
6. **Backend authenticates:** Adds `CONTRIB_TOKEN` to GitHub GraphQL request
7. **GitHub responds:** Returns contribution data
8. **Backend transforms:** Formats data and adds CORS headers
9. **Client receives:** JSON response with contribution calendar
10. **React updates:** Component re-renders with fetched data

### File Structure

```
~/Projects/
├── professiona-website/              # Next.js static site
│   ├── .env.local
│   │   └── NEXT_PUBLIC_API_URL=https://trendhighlighter.xyz
│   ├── components/
│   │   └── ContributionsChart.js     # Uses useEffect to fetch
│   ├── lib/
│   │   └── github.js                 # API client (no auth)
│   └── pages/
│       └── api/                      # NOT USED (reference only)
│
└── trend-highlighter/                 # FastAPI backend
    ├── .env
    │   ├── CONTRIB_TOKEN=ghp_xxx
    │   ├── TRAKT_ACCESS_TOKEN=xxx
    │   └── WEBSITE_URL=https://alexmc.github.io
    ├── main.py                        # Main FastAPI app with CORS
    └── app/
        └── website/
            └── router.py              # Website-specific routes
```

This architecture enables:
- ✅ Free static hosting on GitHub Pages
- ✅ Secure API authentication (secrets on backend)
- ✅ Dynamic data fetching (client-side)
- ✅ Shared backend for multiple projects
- ✅ Easy to extend with new endpoints
