import Link from 'next/link'

export default function Header() {
  return (
    <header className="border-b">
      <nav className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <Link href="/">
            <span className="text-xl font-bold cursor-pointer">AC</span>
          </Link>
          
          <ul className="flex space-x-8">
            <li>
              <Link href="/work">
                <span className="text-gray-600 hover:text-black cursor-pointer">Work</span>
              </Link>
            </li>
            <li>
              <Link href="/blog">
                <span className="text-gray-600 hover:text-black cursor-pointer">Blog</span>
              </Link>
            </li>
            <li>
              <Link href="/about">
                <span className="text-gray-600 hover:text-black cursor-pointer">About</span>
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  )
}
