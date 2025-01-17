export default function Footer() {
  return (
    <footer className="py-8 border-t border-primary-dark">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <div className="flex justify-center space-x-8 mb-6">
          <a href="https://github.com/alexmc" target="_blank" rel="noopener noreferrer" className="text-primary-light hover:text-primary transition-colors">
            GITHUB
          </a>
          <a href="https://twitter.com/alexmc" target="_blank" rel="noopener noreferrer" className="text-primary-light hover:text-primary transition-colors">
            TWITTER
          </a>
          <a href="https://linkedin.com/in/alexmc" target="_blank" rel="noopener noreferrer" className="text-primary-light hover:text-primary transition-colors">
            LINKEDIN
          </a>
        </div>
        <p className="text-primary-light">&copy; {new Date().getFullYear()} Alexandre Carvalho</p>
      </div>
    </footer>
  )
}
