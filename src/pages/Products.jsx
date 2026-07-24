import { useState } from 'react'
import { Link } from 'react-router-dom'
import { products, categories } from '../data/products'
import ProductCard from '../components/ui/ProductCard'
import './Products.css'

export default function Products() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false)
  const [maxPrice, setMaxPrice] = useState(1000)
  const [sortBy, setSortBy] = useState('featured')
  const [selectedSpiceLevels, setSelectedSpiceLevels] = useState([])

  const spiceOptions = ['Hot', 'Medium', 'Mild', 'None']

  const handleSpiceToggle = (level) => {
    setSelectedSpiceLevels(prev =>
      prev.includes(level) ? prev.filter(item => item !== level) : [...prev, level]
    )
  }

  // Live Auto-complete search suggestions
  const searchSuggestions = searchQuery.trim()
    ? products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 4)
    : []

  // Filter Logic
  let filteredProducts = products.filter(product => {
    const matchesCategory = activeCategory === 'all' || product.category === activeCategory
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesPrice = product.price <= maxPrice
    const matchesSpice = selectedSpiceLevels.length === 0 || selectedSpiceLevels.includes(product.spiceLevel)

    return matchesCategory && matchesSearch && matchesPrice && matchesSpice
  })

  // Sorting Logic
  if (sortBy === 'price-low') {
    filteredProducts.sort((a, b) => a.price - b.price)
  } else if (sortBy === 'price-high') {
    filteredProducts.sort((a, b) => b.price - a.price)
  } else if (sortBy === 'rating') {
    filteredProducts.sort((a, b) => b.rating - a.rating)
  }

  return (
    <div className="products-page">
      <div className="products-hero">
        <div className="container">
          <h1 className="products-hero-title">Our Delicacies</h1>
          <p className="products-hero-subtitle">
            Explore authentic Andhra pickles, handmade sweets, and aromatic spice mixes
          </p>
        </div>
      </div>

      <div className="container products-content">
        <div className="products-topbar">
          {/* Live Search Input with Suggestions */}
          <div className="products-search-wrap">
            <div className="products-search">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search Avakaya, Gongura, Sweets..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setShowSearchSuggestions(true)
                }}
                onFocus={() => setShowSearchSuggestions(true)}
                className="search-input"
              />
              {searchQuery && (
                <button className="search-clear" onClick={() => setSearchQuery('')}>✕</button>
              )}
            </div>

            {showSearchSuggestions && searchSuggestions.length > 0 && (
              <div className="search-suggestions-dropdown">
                {searchSuggestions.map(item => (
                  <Link
                    key={item.id}
                    to={`/products/${item.id}`}
                    className="suggestion-item"
                    onClick={() => setShowSearchSuggestions(false)}
                  >
                    <img src={item.image} alt={item.name} className="suggestion-img" />
                    <div>
                      <div className="suggestion-title">{item.name}</div>
                      <div className="suggestion-price">₹{item.price} • {item.weight}</div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Category Pills */}
          <div className="products-categories">
            {categories.map(category => (
              <button
                key={category.id}
                className={`category-btn ${activeCategory === category.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(category.id)}
              >
                <span className="category-icon">{category.icon}</span>
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="products-main-layout">
          {/* Sidebar Filters */}
          <aside className="products-sidebar">
            <div className="filter-card">
              <h3 className="filter-title">Filters & Sorting</h3>

              {/* Sort By Dropdown */}
              <div className="filter-group">
                <label className="filter-label">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="filter-select"
                >
                  <option value="featured">Featured / Default</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>

              {/* Price Slider */}
              <div className="filter-group">
                <div className="filter-label-row">
                  <label className="filter-label">Max Price</label>
                  <span className="filter-value">₹{maxPrice}</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="1000"
                  step="50"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="price-slider"
                />
                <div className="price-range-labels">
                  <span>₹100</span>
                  <span>₹1000</span>
                </div>
              </div>

              {/* Spice Level Filter */}
              <div className="filter-group">
                <label className="filter-label">Spice Level</label>
                <div className="spice-checkboxes">
                  {spiceOptions.map(level => (
                    <label key={level} className="spice-checkbox-item">
                      <input
                        type="checkbox"
                        checked={selectedSpiceLevels.includes(level)}
                        onChange={() => handleSpiceToggle(level)}
                      />
                      <span>{level === 'Hot' ? '🌶️ Hot' : level === 'Medium' ? '🌶️ Medium' : level === 'Mild' ? '🌶️ Mild' : '🍬 Sweet'}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Reset Filters */}
              {(maxPrice < 1000 || sortBy !== 'featured' || selectedSpiceLevels.length > 0 || searchQuery) && (
                <button
                  className="btn btn-outline filter-reset-btn"
                  onClick={() => {
                    setMaxPrice(1000)
                    setSortBy('featured')
                    setSelectedSpiceLevels([])
                    setSearchQuery('')
                    setActiveCategory('all')
                  }}
                >
                  Reset All Filters
                </button>
              )}
            </div>
          </aside>

          {/* Products Grid */}
          <div className="products-grid-container">
            <div className="products-result-count">
              Showing <strong>{filteredProducts.length}</strong> items
            </div>

            {filteredProducts.length > 0 ? (
              <div className="products-grid">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="products-empty">
                <span className="empty-icon">📭</span>
                <h3>No products match your criteria</h3>
                <p>Try resetting filters or adjusting search keywords.</p>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    setMaxPrice(500)
                    setSelectedSpiceLevels([])
                    setSearchQuery('')
                    setActiveCategory('all')
                  }}
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
