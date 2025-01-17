import Link from 'next/link'

const Posts = ({ posts, limit }) => {
  const displayPosts = limit ? posts.slice(0, limit) : posts;

  return (
    <div className="space-y-6">
      {displayPosts.map((post, index) => (
        <article key={index} className="border-l-2 border-primary-dark pl-4 py-2 hover:border-primary transition-colors">
          <Link href={`/blog/${post.slug}`} className="block group">
            <time className="text-sm text-primary-light">{post.date}</time>
            <h3 className="text-lg font-medium group-hover:text-glow transition-colors">{post.title}</h3>
          </Link>
        </article>
      ))}
      {limit && (
        <div className="pt-4">
          <Link href="/blog" className="text-primary-light hover:text-primary transition-colors">
            VIEW ALL POSTS &rarr;
          </Link>
        </div>
      )}
    </div>
  );
};

export default Posts;
