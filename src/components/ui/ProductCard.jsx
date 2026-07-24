import { Link } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { formatPrice } from '../../utils/formatPrice'
import './ProductCard.css'

export default function ProductCard({ product }) {
  const { addToCart } = useCart()

  const getSpiceBadge = (level) => {
    if (level === 'Hot') return <span className="badge badge-hot">🌶️ Hot</span>
    if (level === 'Medium') return <span className="badge badge-medium">🌶️ Medium</span>
    if (level === 'Mild') return <span className="badge badge-mild">🌶️ Mild</span>
    return null
  }

  return (
    <div className="product-card">
      <Link to={`/products/${product.id}`} className="product-card-image-wrap">
        <img
          src={product.image}
          alt={product.name}
          className="product-card-image"
          loading="lazy"
        />
        {product.originalPrice > product.price && (
          <span className="product-card-discount">
            -{Math.round((1 - product.price / product.originalPrice) * 100)}%
          </span>
        )}
        <div className="product-card-badges">
          {getSpiceBadge(product.spiceLevel)}
        </div>
      </Link>

      <div className="product-card-content">
        <div className="product-card-meta">
          <span className="product-card-category">{product.category}</span>
          {product.rating && (
            <span className="product-card-rating">
              ★ {product.rating} <small>({product.reviews})</small>
            </span>
          )}
        </div>

        <Link to={`/products/${product.id}`}>
          <h3 className="product-card-title">{product.name}</h3>
        </Link>
        <p className="product-card-weight">{product.weight}</p>

        {product.dietary && product.dietary.length > 0 && (
          <div className="product-card-tags">
            {product.dietary.map((tag, idx) => (
              <span key={idx} className="dietary-tag">{tag}</span>
            ))}
          </div>
        )}

        <div className="product-card-footer">
          <div className="product-card-pricing">
            <span className="product-card-price">{formatPrice(product.price)}</span>
            {product.originalPrice > product.price && (
              <span className="product-card-original-price">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          <button
            className="btn btn-primary product-card-add-btn"
            onClick={() => addToCart(product)}
          >
            + Add
          </button>
        </div>
      </div>
    </div>
  )
}
