import { useState } from 'react';

export default function BlueskyEmbed({ embed }) {
  const [selectedImage, setSelectedImage] = useState(null);

  if (!embed) return null;

  // Handle images
  if (embed.$type === 'app.bsky.embed.images#view') {
    const images = embed.images || [];

    return (
      <>
        <div className={`grid gap-2 mt-2 ${
          images.length === 1 ? 'grid-cols-1' :
          images.length === 2 ? 'grid-cols-2' :
          images.length === 3 ? 'grid-cols-3' :
          'grid-cols-2'
        }`}>
          {images.map((image, idx) => (
            <div
              key={idx}
              className="relative overflow-hidden rounded border border-primary/20 cursor-pointer hover:border-primary/60 transition-colors"
              onClick={() => setSelectedImage(image)}
            >
              <img
                src={image.thumb}
                alt={image.alt || 'Embedded image'}
                className="w-full h-auto object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </div>

        {/* Image modal */}
        {selectedImage && (
          <div
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <div className="relative max-w-7xl max-h-full">
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 text-white bg-black/50 rounded-full w-10 h-10 flex items-center justify-center hover:bg-black/70 transition-colors"
                aria-label="Close"
              >
                ✕
              </button>
              <img
                src={selectedImage.fullsize}
                alt={selectedImage.alt || 'Full size image'}
                className="max-w-full max-h-[90vh] object-contain"
              />
            </div>
          </div>
        )}
      </>
    );
  }

  // Handle external links
  if (embed.$type === 'app.bsky.embed.external#view') {
    const external = embed.external;

    return (
      <a
        href={external.uri}
        target="_blank"
        rel="noopener noreferrer"
        className="block mt-2 border border-primary/20 rounded overflow-hidden hover:border-primary/60 transition-colors no-underline"
      >
        {external.thumb && (
          <img
            src={external.thumb}
            alt={external.title}
            className="w-full h-48 object-cover"
            loading="lazy"
          />
        )}
        <div className="p-3 bg-white/5">
          <div className="font-medium text-primary">{external.title}</div>
          {external.description && (
            <div className="text-sm text-gray-400 mt-1 line-clamp-2">
              {external.description}
            </div>
          )}
          <div className="text-xs text-gray-500 mt-1">{new URL(external.uri).hostname}</div>
        </div>
      </a>
    );
  }

  // Handle record embeds (quote posts)
  if (embed.$type === 'app.bsky.embed.record#view') {
    const record = embed.record;

    if (record.$type === 'app.bsky.embed.record#viewRecord') {
      const author = record.author;
      const value = record.value;

      return (
        <div className="mt-2 border border-primary/20 rounded p-3 bg-white/5">
          <div className="flex items-center gap-2 mb-2">
            {author.avatar && (
              <img
                src={author.avatar}
                alt={author.displayName || author.handle}
                className="w-6 h-6 rounded-full"
              />
            )}
            <div className="text-sm">
              <span className="font-medium">{author.displayName || author.handle}</span>
              <span className="text-gray-500 ml-1">@{author.handle}</span>
            </div>
          </div>
          <div className="text-sm">{value.text}</div>
        </div>
      );
    }
  }

  // Handle record with media (quote post with images/external)
  if (embed.$type === 'app.bsky.embed.recordWithMedia#view') {
    return (
      <>
        {embed.media && <BlueskyEmbed embed={embed.media} />}
        {embed.record && <BlueskyEmbed embed={embed.record} />}
      </>
    );
  }

  // Fallback for unknown embed types
  return (
    <div className="mt-2 p-3 border border-primary/20 rounded text-sm text-gray-400">
      <em>Unsupported embed type: {embed.$type}</em>
    </div>
  );
}
