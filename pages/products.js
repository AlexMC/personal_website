import Layout from '../components/Layout'
import Projects from '../components/Projects'
import { getAllMarkdownFiles } from '../lib/markdown'
import Seo from '../components/Seo'
import { site } from '../lib/site.mjs'
import { breadcrumbSchema } from '../lib/schema'

export default function Products({ products }) {
  return (
    <Layout>
      <Seo
        title="Products"
        path="/products"
        description={`Products built by ${site.name}: SetScout, a LEGO price tracker, and Ghost Runner, an iPhone and Apple Watch app for racing your previous runs.`}
        schema={[
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Products', path: '/products' },
          ]),
        ]}
      />
      <div className="space-y-32">
        <section>
          <p className="text-xl text-primary-light">
            Products I designed and built myself, and that you can use today.
          </p>
        </section>

        <section>
          <h1 className="text-2xl font-bold mb-12 text-primary">&gt; products</h1>
          <Projects projects={products} external />
        </section>
      </div>
    </Layout>
  )
}

export async function getStaticProps() {
  const products = getAllMarkdownFiles('data/products').sort((a, b) => (a.order ?? 99) - (b.order ?? 99))

  return { props: { products } }
}
