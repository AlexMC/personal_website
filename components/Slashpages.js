import Link from 'next/link'

const Slashpages = ({ pages }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {pages.map((page, index) => (
        <article
          key={index}
          className="border border-primary-dark p-6 hover:border-primary transition-colors hover:bg-surface"
        >
          <Link href={`/${page.slug}`} className="block group">
            <h3 className="text-xl font-bold text-primary group-hover:text-glow transition-colors mb-2">
              {page.title}
            </h3>
            <p className="text-sm text-primary-light">{page.description}</p>
            {page.updatedAt && (
              <div className="text-xs text-primary-dark mt-4">
                Updated: {page.updatedAt}
              </div>
            )}
          </Link>
        </article>
      ))}
    </div>
  );
};

export default Slashpages;
