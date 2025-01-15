import Link from 'next/link';

const Blog = ({ posts }) => {
  if (!posts || posts.length === 0) {
    return (
      <div className="section">
        <div className="container-custom">
          <h2 className="text-2xl font-bold mb-8 text-glow">&gt; latest posts</h2>
          <div className="p-6 bg-surface rounded-none border border-primary-dark">
            <p className="text-primary-light text-center">
              <span className="loading-cursor">No posts available_</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="section">
      <div className="container-custom">
        <h2 className="text-2xl font-bold mb-8 text-glow">&gt; latest posts</h2>
        <div className="space-y-8">
          {posts.map((post, index) => (
            <Link
              key={index}
              href={`/blog/${post.slug}`}
              className="block p-6 bg-surface rounded-none border border-primary-dark hover:border-primary transition-all duration-300 hover:shadow-glow"
            >
              <article>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-primary">{post.title}</h3>
                  <time className="text-sm text-primary-light">{post.date}</time>
                </div>
                <p className="text-primary-light mb-4">{post.excerpt}</p>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="px-2 py-1 text-sm bg-primary-dark text-primary border border-primary-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;
