import { useState, useEffect } from 'react';
import { getRelativeTime } from '../lib/trakt';

export default function TraktStats({ traktData }) {
  const [error, setError] = useState(null);

  // Use data fetched from external backend API
  const history = traktData?.history || { episodes: [], movies: [] };
  const stats = traktData?.stats || null;
  const calendar = traktData?.calendar || [];
  const continueWatching = traktData?.continue_watching || [];
  const watchlist = traktData?.watchlist || [];
  const buildTime = traktData?.buildTime;

  if (traktData?.error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500">{traktData.error}</p>
        <p className="text-primary-light text-sm mt-2">
          Unable to fetch Trakt data from the backend API.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-primary mb-4">
          Secret Trakt Stats
        </h1>
        <p className="text-primary-light">You found the hidden easter egg!</p>
        {buildTime && (
          <p className="text-primary-light text-sm mt-2">
            Last updated: {new Date(buildTime).toLocaleString()}
          </p>
        )}
      </div>

      {/* Overall Stats */}
      {stats && (
        <section className="bg-surface border border-primary/20 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-primary mb-6">&gt; Overall Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Movies Watched"
              value={stats.movies?.watched || 0}
              subtitle={`${stats.movies?.minutes ? Math.round(stats.movies.minutes / 60) : 0} hours`}
            />
            <StatCard
              title="Episodes Watched"
              value={stats.episodes?.watched || 0}
              subtitle={`${stats.episodes?.minutes ? Math.round(stats.episodes.minutes / 60) : 0} hours`}
            />
            <StatCard
              title="Shows Watched"
              value={stats.shows?.watched || 0}
              subtitle={`${stats.shows?.collected || 0} collected`}
            />
            <StatCard
              title="Total Minutes"
              value={stats.episodes?.minutes + stats.movies?.minutes || 0}
              subtitle={`${Math.round((stats.episodes?.minutes + stats.movies?.minutes) / 60 / 24) || 0} days`}
              format={(val) => Math.round(val / 60)}
            />
          </div>
        </section>
      )}

      {/* Continue Watching */}
      {continueWatching.length > 0 && (
        <section className="bg-surface border border-primary/20 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-primary mb-6">&gt; Continue Watching</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {continueWatching.map((item, index) => (
              <ContinueWatchingItem key={index} item={item} />
            ))}
          </div>
        </section>
      )}

      {/* Watchlist */}
      {watchlist.length > 0 && (
        <section className="bg-surface border border-primary/20 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-primary mb-6">&gt; Watchlist</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {watchlist.map((item, index) => (
              <WatchlistItem key={index} item={item} />
            ))}
          </div>
        </section>
      )}

      {/* Recent Episodes */}
      <section className="bg-surface border border-primary/20 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-primary mb-6">&gt; Recently Watched Episodes</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {history.episodes.length > 0 ? (
            history.episodes.map((item, index) => (
              <WatchedEpisode key={index} item={item} />
            ))
          ) : (
            <p className="text-primary-light col-span-full">No recent episodes</p>
          )}
        </div>
      </section>

      {/* Recent Movies */}
      <section className="bg-surface border border-primary/20 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-primary mb-6">&gt; Recently Watched Movies</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {history.movies.length > 0 ? (
            history.movies.map((item, index) => (
              <WatchedMovie key={index} item={item} />
            ))
          ) : (
            <p className="text-primary-light col-span-full">No recent movies</p>
          )}
        </div>
      </section>

      {/* Upcoming Episodes */}
      <section className="bg-surface border border-primary/20 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-primary mb-6">&gt; Next Episodes to Watch</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {calendar.length > 0 ? (
            calendar.slice(0, 10).map((item, index) => (
              <UpcomingEpisode key={index} item={item} />
            ))
          ) : (
            <p className="text-primary-light col-span-full">No upcoming episodes</p>
          )}
        </div>
      </section>
    </div>
  );
}

function StatCard({ title, value, subtitle, format = (v) => v }) {
  return (
    <div className="bg-background border border-primary/10 rounded p-4">
      <h3 className="text-primary-light text-sm mb-2">{title}</h3>
      <p className="text-3xl font-bold text-primary">{format(value).toLocaleString()}</p>
      {subtitle && <p className="text-primary-light text-sm mt-1">{subtitle}</p>}
    </div>
  );
}

function WatchedEpisode({ item }) {
  const { episode, show, watched_at } = item;
  const posterUrl = show?.images?.poster?.[0] ? `https://${show.images.poster[0]}` : null;

  return (
    <div className="bg-background border border-primary/10 rounded overflow-hidden hover:border-primary/30 transition-colors group">
      {posterUrl ? (
        <img
          src={posterUrl}
          alt={show.title}
          className="w-full aspect-[2/3] object-cover"
          onError={(e) => { e.target.style.display = 'none'; }}
        />
      ) : (
        <div className="w-full aspect-[2/3] bg-primary/10 flex items-center justify-center">
          <span className="text-primary-light text-4xl">📺</span>
        </div>
      )}
      <div className="p-3">
        <h3 className="font-semibold text-primary text-sm truncate">{show.title}</h3>
        <p className="text-primary-light text-xs">
          S{String(episode.season).padStart(2, '0')}E{String(episode.number).padStart(2, '0')}
        </p>
        <p className="text-primary-light text-xs truncate" title={episode.title}>
          {episode.title}
        </p>
        <p className="text-primary-light text-xs mt-1">{getRelativeTime(watched_at)}</p>
      </div>
    </div>
  );
}

function WatchedMovie({ item }) {
  const { movie, watched_at } = item;
  const posterUrl = movie?.images?.poster?.[0] ? `https://${movie.images.poster[0]}` : null;

  return (
    <div className="bg-background border border-primary/10 rounded overflow-hidden hover:border-primary/30 transition-colors group">
      {posterUrl ? (
        <img
          src={posterUrl}
          alt={movie.title}
          className="w-full aspect-[2/3] object-cover"
          onError={(e) => { e.target.style.display = 'none'; }}
        />
      ) : (
        <div className="w-full aspect-[2/3] bg-primary/10 flex items-center justify-center">
          <span className="text-primary-light text-4xl">🎬</span>
        </div>
      )}
      <div className="p-3">
        <h3 className="font-semibold text-primary text-sm truncate">{movie.title}</h3>
        <p className="text-primary-light text-xs">{movie.year}</p>
        <p className="text-primary-light text-xs mt-1">{getRelativeTime(watched_at)}</p>
      </div>
    </div>
  );
}

function UpcomingEpisode({ item }) {
  const { episode, show, first_aired } = item;
  const posterUrl = show?.images?.poster?.[0] ? `https://${show.images.poster[0]}` : null;
  const airDate = new Date(first_aired);
  const isToday = airDate.toDateString() === new Date().toDateString();
  const isTomorrow = airDate.toDateString() === new Date(Date.now() + 86400000).toDateString();

  let dateLabel;
  if (isToday) dateLabel = 'Today';
  else if (isTomorrow) dateLabel = 'Tomorrow';
  else dateLabel = airDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return (
    <div className="bg-background border border-primary/10 rounded overflow-hidden hover:border-primary/30 transition-colors group">
      {posterUrl ? (
        <img
          src={posterUrl}
          alt={show.title}
          className="w-full aspect-[2/3] object-cover"
          onError={(e) => { e.target.style.display = 'none'; }}
        />
      ) : (
        <div className="w-full aspect-[2/3] bg-primary/10 flex items-center justify-center">
          <span className="text-primary-light text-4xl">📺</span>
        </div>
      )}
      <div className="p-3">
        <h3 className="font-semibold text-primary text-sm truncate">{show.title}</h3>
        <p className="text-primary-light text-xs">
          S{String(episode.season).padStart(2, '0')}E{String(episode.number).padStart(2, '0')}
        </p>
        <p className="text-primary-light text-xs truncate" title={episode.title}>
          {episode.title}
        </p>
        <p className={`text-xs mt-1 ${isToday ? 'text-green-500 font-semibold' : 'text-primary-light'}`}>
          {dateLabel}
        </p>
      </div>
    </div>
  );
}

function ContinueWatchingItem({ item }) {
  const { show, next_episode, last_watched_at, first_aired } = item;
  const posterUrl = show?.images?.poster?.[0] ? `https://${show.images.poster[0]}` : null;

  // Parse air date if available (passed from backend)
  let dateLabel = null;
  let isToday = false;
  if (first_aired) {
    const airDate = new Date(first_aired);
    isToday = airDate.toDateString() === new Date().toDateString();
    const isTomorrow = airDate.toDateString() === new Date(Date.now() + 86400000).toDateString();
    const isPast = airDate < new Date();

    if (isPast) {
      dateLabel = 'Available';
    } else if (isToday) {
      dateLabel = 'Airs Today';
    } else if (isTomorrow) {
      dateLabel = 'Airs Tomorrow';
    } else {
      dateLabel = `Airs ${airDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
    }
  }

  return (
    <div className="bg-background border border-primary/10 rounded overflow-hidden hover:border-primary/30 transition-colors group">
      {posterUrl ? (
        <img
          src={posterUrl}
          alt={show.title}
          className="w-full aspect-[2/3] object-cover"
          onError={(e) => { e.target.style.display = 'none'; }}
        />
      ) : (
        <div className="w-full aspect-[2/3] bg-primary/10 flex items-center justify-center">
          <span className="text-primary-light text-4xl">📺</span>
        </div>
      )}
      <div className="p-3">
        <h3 className="font-semibold text-primary text-sm truncate">{show.title}</h3>
        <p className="text-primary-light text-xs">
          Next: S{String(next_episode.season).padStart(2, '0')}E{String(next_episode.number).padStart(2, '0')}
        </p>
        {next_episode.title && (
          <p className="text-primary-light text-xs truncate" title={next_episode.title}>
            {next_episode.title}
          </p>
        )}
        {dateLabel && (
          <p className={`text-xs mt-1 ${isToday ? 'text-green-500 font-semibold' : 'text-primary-light'}`}>
            {dateLabel}
          </p>
        )}
      </div>
    </div>
  );
}

function WatchlistItem({ item }) {
  const { type, notes } = item;

  if (type === 'show') {
    const { show } = item;
    const posterUrl = show?.images?.poster?.[0] ? `https://${show.images.poster[0]}` : null;

    return (
      <div className="bg-background border border-primary/10 rounded overflow-hidden hover:border-primary/30 transition-colors group">
        {posterUrl ? (
          <img
            src={posterUrl}
            alt={show.title}
            className="w-full aspect-[2/3] object-cover"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        ) : (
          <div className="w-full aspect-[2/3] bg-primary/10 flex items-center justify-center">
            <span className="text-primary-light text-4xl">📺</span>
          </div>
        )}
        <div className="p-3">
          <h3 className="font-semibold text-primary text-sm truncate">{show.title}</h3>
          <p className="text-primary-light text-xs">{show.year}</p>
          {notes && <p className="text-primary-light text-xs mt-1 italic line-clamp-2">{notes}</p>}
        </div>
      </div>
    );
  }

  if (type === 'movie') {
    const { movie } = item;
    const posterUrl = movie?.images?.poster?.[0] ? `https://${movie.images.poster[0]}` : null;

    return (
      <div className="bg-background border border-primary/10 rounded overflow-hidden hover:border-primary/30 transition-colors group">
        {posterUrl ? (
          <img
            src={posterUrl}
            alt={movie.title}
            className="w-full aspect-[2/3] object-cover"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        ) : (
          <div className="w-full aspect-[2/3] bg-primary/10 flex items-center justify-center">
            <span className="text-primary-light text-4xl">🎬</span>
          </div>
        )}
        <div className="p-3">
          <h3 className="font-semibold text-primary text-sm truncate">{movie.title}</h3>
          <p className="text-primary-light text-xs">{movie.year}</p>
          {notes && <p className="text-primary-light text-xs mt-1 italic line-clamp-2">{notes}</p>}
        </div>
      </div>
    );
  }

  return null;
}
