import { Link } from 'react-router-dom'
import './Hero.css'

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-bg-overlay"></div>
      <div className="container hero-container">
        <div className="hero-content">
          <div className="hero-badge">🌿 100% Homemade • Zero Preservatives</div>
          <h1 className="hero-title">
            Taste the <span className="hero-highlight">Authentic</span> Andhra
          </h1>
          <p className="hero-subtitle">
            Traditional pickles, sweets, and spice mixes crafted with love using time-honored family recipes straight from Andhra Pradesh.
          </p>
          <div className="hero-actions">
            <Link to="/products" className="btn btn-primary hero-btn">
              Explore Catalog 🛒
            </Link>
            <Link to="/about" className="btn btn-outline hero-btn">
              Our Heritage 📜
            </Link>
          </div>

          <div className="hero-trust-row">
            <div className="hero-trust-item">
              <span className="trust-icon">⭐ 4.9/5 Rating</span>
              <span className="trust-text">5,000+ Happy Families</span>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-card-stack">
            <div className="hero-card hero-card-main">
              <img
                src="/images/hero_feast.png"
                alt="Traditional Andhra Feast"
                className="hero-card-img"
              />
              <div className="hero-card-badge">🌶️ Authentic Andhra Delicacies</div>
            </div>

            <div className="hero-card hero-card-sub floating-card">
              <img
                src="/images/ghee_bobbatlu.png"
                alt="Special Ghee Bobbatlu"
                className="hero-card-sub-img"
              />
              <div className="hero-card-sub-info">
                <strong>Ghee Bobbatlu</strong>
                <small>Made with Pure Cow Ghee</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
