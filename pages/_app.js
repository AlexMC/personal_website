import '../styles/globals.css'
import Meta from '../components/Meta'
import TraktModal from '../components/TraktModal'
import { useMatrixCode } from '../lib/useMatrixCode'
import { useState, useEffect } from 'react'
// import Header from '../components/Header'
// import Footer from '../components/Footer'

function MyApp({ Component, pageProps }) {
  const [showTraktModal, setShowTraktModal] = useState(false)
  const matrixDetected = useMatrixCode()

  // Show modal when Matrix code is detected (type "there is no spoon")
  useEffect(() => {
    if (matrixDetected) {
      setShowTraktModal(true)
    }
  }, [matrixDetected])

  // Listen for mobile tap trigger on name/title
  useEffect(() => {
    const handleTraktModalActivated = () => {
      setShowTraktModal(true)
    }

    document.addEventListener('traktModalActivated', handleTraktModalActivated)

    return () => {
      document.removeEventListener('traktModalActivated', handleTraktModalActivated)
    }
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <Meta />
      {/* <Header /> */}
      <main className="flex-grow">
        <Component {...pageProps} />
      </main>
      {/* <Footer /> */}

      {/* Hidden Trakt Stats Modal */}
      <TraktModal
        isOpen={showTraktModal}
        onClose={() => setShowTraktModal(false)}
      />
    </div>
  )
}

export default MyApp
