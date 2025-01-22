import '../styles/globals.css'
import Meta from '../components/Meta'
// import Header from '../components/Header'
// import Footer from '../components/Footer'

function MyApp({ Component, pageProps }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Meta />
      {/* <Header /> */}
      <main className="flex-grow">
        <Component {...pageProps} />
      </main>
      {/* <Footer /> */}
    </div>
  )
}

export default MyApp
