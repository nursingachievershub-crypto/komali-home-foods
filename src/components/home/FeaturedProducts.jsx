import { Link } from 'react-router-dom'
import { products } from '../../data/products'
import ProductCard from '../ui/ProductCard'
import './FeaturedProducts.css'

export default function FeaturedProducts() {
  const featuredItems = products.filter(p => p.isFeatured).slice(0, 6)

  return (
    <section className="featured-products section-padding">
      <div className="container">
        <h2 className="section-title">Our Traditional Bestsellers</h2>
        <div className="authentic-divider">✦ ✨ ✦</div>
        <p className="section-subtitle">
          Handcrafted in small batches using traditional stone-grinding techniques, authentic spices, and 100% pure cow ghee.
        </p>

        <div className="featured-grid">
          {featuredItems.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="featured-cta">
          <Link to="/products" className="btn btn-secondary">
            Explore Complete Collection →
          </Link>
        </div>
      </div>
    </section>
  )
}
