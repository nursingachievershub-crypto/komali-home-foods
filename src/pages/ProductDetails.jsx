import { useParams, Link } from 'react-router-dom'
import { products } from '../data/products'
import { useCart } from '../context/CartContext'
import { formatPrice } from '../utils/formatPrice'
import './ProductDetails.css'

export default function ProductDetails() {
  const { id } = useParams()
  const { addToCart } = useCart()
  const product = products.find(p => p.id === parseInt(id))

  if (!product) {
    return (
      <div className="container not-found">
        <span className="not-found-icon">🔍</span>
        <h2>Product not found</h2>
        <Link to="/products" className="btn btn-primary">
          Back to Products
        </Link>
      </div>
    )
  }

  return (
    <div className="product-details-page">
      <div className="container">
        <nav className="breadcrumb">
          <Link to="/">Home</Link>
          <span className="breadcrumb-separator">/</span>
          <Link to="/products">Products</Link>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">{product.name}</span>
        </nav>

        <div className="product-details-grid">
          <div className="product-details-image">
            <div className="product-image-placeholder">
              <img
                src={product.image}
                alt={product.name}
                className="product-details-img"
              />
            </div>
          </div>

          <div className="product-details-info">
            <span className="product-details-category">{product.category}</span>
            <h1 className="product-details-name">{product.name}</h1>
            <p className="product-details-weight">{product.weight}</p>

            <div className="product-details-rating">
              <span className="rating-stars">
                {'★'.repeat(Math.floor(product.rating))}{'☆'.repeat(5 - Math.floor(product.rating))}
              </span>
              <span className="rating-value">{product.rating}</span>
              <span className="rating-count">({product.reviews} reviews)</span>
            </div>

            <div className="product-details-pricing">
              <span className="product-details-price">{formatPrice(product.price)}</span>
              {product.originalPrice > product.price && (
                <span className="product-details-original">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>

            <p className="product-details-description">{product.description}</p>

            <div className="product-details-ingredients">
              <h3>Ingredients</h3>
              <ul>
                {product.ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
            </div>

            <div className="product-details-nutrition">
              <h3>Nutritional Information (per serving)</h3>
              <div className="nutrition-grid">
                <div className="nutrition-item">
                  <span className="nutrition-value">{product.nutritionalInfo.calories}</span>
                  <span className="nutrition-label">Calories</span>
                </div>
                <div className="nutrition-item">
                  <span className="nutrition-value">{product.nutritionalInfo.fat}</span>
                  <span className="nutrition-label">Fat</span>
                </div>
                <div className="nutrition-item">
                  <span className="nutrition-value">{product.nutritionalInfo.carbs}</span>
                  <span className="nutrition-label">Carbs</span>
                </div>
                <div className="nutrition-item">
                  <span className="nutrition-value">{product.nutritionalInfo.protein}</span>
                  <span className="nutrition-label">Protein</span>
                </div>
              </div>
            </div>

            <button
              className="btn btn-primary product-details-add-btn"
              onClick={() => addToCart(product)}
            >
              🛒 Add to Cart - {formatPrice(product.price)}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

