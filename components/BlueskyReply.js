import BlueskyEmbed from './BlueskyEmbed';

const MAX_DEPTH = 5;

export default function BlueskyReply({ thread, depth = 0 }) {
  if (!thread || !thread.post) return null;

  const post = thread.post;
  const author = post.author;
  const record = post.record;

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds}s`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d`;

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Build Bluesky post URL
  const postUrl = `https://bsky.app/profile/${author.handle}/post/${post.uri.split('/').pop()}`;

  return (
    <div className="border-l-2 border-primary/20 pl-4 mb-4" style={{ marginLeft: depth * 12 }}>
      {/* Author info */}
      <div className="flex items-start gap-3 mb-2">
        {author.avatar && (
          <a href={`https://bsky.app/profile/${author.handle}`} target="_blank" rel="noopener noreferrer">
            <img
              src={author.avatar}
              alt={author.displayName || author.handle}
              className="w-10 h-10 rounded-full"
            />
          </a>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <a
              href={`https://bsky.app/profile/${author.handle}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium hover:text-primary transition-colors"
            >
              {author.displayName || author.handle}
            </a>
            <span className="text-gray-500 text-sm">@{author.handle}</span>
            <span className="text-gray-600 text-sm">·</span>
            <a
              href={postUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 text-sm hover:text-primary transition-colors"
            >
              {formatDate(record.createdAt)}
            </a>
          </div>

          {/* Post content */}
          <div className="mt-2 whitespace-pre-wrap break-words">
            {record.text}
          </div>

          {/* Embeds */}
          {post.embed && <BlueskyEmbed embed={post.embed} />}

          {/* Post stats */}
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
            {post.replyCount > 0 && (
              <span>💬 {post.replyCount}</span>
            )}
            {post.repostCount > 0 && (
              <span>🔁 {post.repostCount}</span>
            )}
            {post.likeCount > 0 && (
              <span>❤️ {post.likeCount}</span>
            )}
          </div>
        </div>
      </div>

      {/* Nested replies */}
      {depth < MAX_DEPTH && thread.replies && thread.replies.length > 0 && (
        <div className="mt-3">
          {thread.replies.map((reply, idx) => (
            <BlueskyReply key={idx} thread={reply} depth={depth + 1} />
          ))}
        </div>
      )}

      {/* Max depth warning */}
      {depth >= MAX_DEPTH && thread.replies && thread.replies.length > 0 && (
        <div className="mt-2 text-sm text-gray-500 italic">
          Thread continues on{' '}
          <a
            href={postUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Bluesky
          </a>
          ...
        </div>
      )}
    </div>
  );
}
