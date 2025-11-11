import { useState, useEffect } from 'react';
import { BskyAgent } from '@atproto/api';
import BlueskyReply from './BlueskyReply';

export default function BlueskyComments({ uri, author }) {
  const [thread, setThread] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!uri) {
      setLoading(false);
      return;
    }

    const fetchThread = async () => {
      try {
        setLoading(true);
        setError(null);

        // Initialize agent (no authentication required for public data)
        const agent = new BskyAgent({
          service: 'https://public.api.bsky.app',
        });

        // Fetch the post thread
        const response = await agent.getPostThread({ uri, depth: 10 });

        setThread(response.data.thread);
      } catch (err) {
        console.error('Error fetching Bluesky thread:', err);
        setError('Failed to load comments. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchThread();
  }, [uri]);

  if (!uri) return null;

  // Build the original post URL
  const postUrl = uri ? `https://bsky.app/profile/${author || 'unknown'}/post/${uri.split('/').pop()}` : '#';

  return (
    <div className="mt-12 pt-8 border-t border-primary/20">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Comments</h2>
        <a
          href={postUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-primary hover:underline flex items-center gap-2"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
          </svg>
          Comment on Bluesky
        </a>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded p-4 text-red-400">
          {error}
        </div>
      )}

      {!loading && !error && thread && (
        <>
          {/* Display replies only */}
          {thread.replies && thread.replies.length > 0 ? (
            <div className="space-y-2">
              {thread.replies.map((reply, idx) => (
                <BlueskyReply key={idx} thread={reply} depth={0} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No comments yet. Be the first to{' '}
              <a
                href={postUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                comment on Bluesky
              </a>
              !
            </div>
          )}
        </>
      )}
    </div>
  );
}
