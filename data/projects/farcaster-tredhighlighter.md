---
title: "Trend Highlighter"
description: "(personal project) Surface the most relevant and trending content from the Farcaster social network."
technologies: ["Python", "TypeScript", "Tailwind"]
link: "https://trendhighlighter.xyz"
image: "/images/trendhighlighter.png"
featured: true
---

# Building a Real-time Link Aggregator for Farcaster

## 1. Introduction

The [Farcaster Trend Highlighter](https://trendhighlighter.xyz) is a web application designed to surface the most relevant and trending content from the Farcaster social network. It addresses the challenge of information overload by aggregating and analyzing link-sharing patterns within user networks and custom groups.

Key challenges this project tackles:
- Real-time data collection and processing from the Farcaster network
- Efficient storage and retrieval of social graph data
- Intelligent content aggregation and trend detection
- Scalable background processing for continuous updates

## 2. Architecture Overview

The application is built on a modern stack designed for scalability and real-time processing. At its core, it utilizes FastAPI, PostgreSQL, and Redis for caching and real-time data processing. The system is containerized using Docker, which ensures consistent deployment across environments.

A key architectural decision was the implementation of Celery for background task processing, allowing us to handle time-consuming operations like data synchronization without impacting the user experience. This is complemented by Prometheus monitoring, giving us insights into system performance and helping identify bottlenecks.

## 3. Core Technical Features

### 3.1 Efficient Data Collection

We use the excelent Neynar API to fetch data from the Farcaster network. Our implementation uses Redis for efficient caching, ensuring data freshness and reducing API calls (and costs).:

```python
class FarcasterClient:
    def __init__(self):
        self.api_key = os.getenv("NEYNAR_API_KEY")
        self.base_url = "https://api.neynar.com/v2"
        
        # Initialize Redis connection with TTL-based caching
        redis_url = os.getenv("REDIS_URL", "redis://redis:6379/0")
        self.redis: Redis = redis.from_url(redis_url)
        self.cache_ttl = 300  # 5 minutes cache TTL
        
        # Maintain a single aiohttp session for connection pooling
        self.session = None
```

### 3.2 Intelligent Content Processing

One of the most interesting challenges was implementing intelligent URL extraction and processing. Our system can identify and categorize different types of content, from simple text links to embedded media. We developed an algorithm that not only extracts URLs but also analyzes their context and metadata.

The system handles various edge cases, such as duplicate URLs across different casts, embedded media content, and URL normalization. It also implements smart filtering to exclude image URLs and other media content that doesn't contribute to trend analysis.

### 3.3 Real-time Updates

The real-time update system utilizes a combination of background tasks and event-driven architecture. Celery workers continuously process user timelines, while the main application maintains real-time connections with clients through efficient database queries and caching strategies.

### 3.4 Performance Optimizations

Our performance optimization strategy focuses on three key areas: database query optimization, caching strategies, and efficient data structures. We use carefully crafted database indices, materialized views for complex aggregations, and a multi-level caching system that balances data freshness with response time.

## 4. User Management and Authentication

The authentication system integrates with Neynar's OAuth flow while maintaining its own user management system. This hybrid approach allows us to leverage Farcaster's authentication while maintaining control over user permissions and features. The system includes plan management, allowing for different levels of access and features based on user subscriptions.

## 6. Deployment and Monitoring

Our deployment strategy utilizes Docker Compose for orchestrating multiple services, including the main application, Celery workers, Redis, and PostgreSQL. The system includes comprehensive monitoring through Prometheus, with custom metrics for tracking API usage, cache hit rates, and background task performance.

## 7. Advanced Features

The application includes several advanced features, such as custom user lists for tracking specific groups of Farcaster users, trend analysis across different time windows, and intelligent content categorization. These features are implemented with scalability in mind, using efficient database queries and caching strategies.

## 8. Technical Challenges and Solutions

Throughout development, we encountered and solved several significant challenges:
- Implementing efficient rate limiting while maintaining data freshness
- Designing a scalable database schema for social graph data
- Building a reliable background processing system
- Managing cache invalidation across multiple services

