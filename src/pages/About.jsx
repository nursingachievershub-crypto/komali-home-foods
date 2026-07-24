import './About.css'

export default function About() {
  return (
    <div className="about-page">
      <div className="about-hero">
        <div className="container">
          <h1 className="about-hero-title">Our Story</h1>
          <p className="about-hero-subtitle">
            Preserving the authentic taste of Andhra Pradesh, one jar at a time
          </p>
        </div>
      </div>

      <div className="container about-content">
        <section className="about-section">
          <div className="about-section-grid">
            <div className="about-section-text">
              <h2>From Our Kitchen to Your Table</h2>
              <p>
                Komali Home Foods was born out of a passion for preserving the rich 
                culinary heritage of Andhra Pradesh. What started as a small home kitchen 
                operation, sharing our family's traditional recipes with friends and 
                neighbors, has grown into a beloved brand trusted by families across India.
              </p>
              <p>
                Every product we make is crafted using time-honored techniques passed down 
                through generations. We use only the finest ingredients - sun-ripened 
                mangoes for our pickles, pure cold-pressed sesame oil, hand-picked spices 
                from local farmers, and traditional stone-grinding methods that bring out 
                the authentic flavors.
              </p>
            </div>
            <div className="about-section-visual">
              <div className="about-image-placeholder">
                <span className="about-image-emoji">👩‍🍳</span>
              </div>
            </div>
          </div>
        </section>

        <section className="about-values">
          <h2 className="section-title">What Makes Us Special</h2>
          <div className="values-grid">
            <div className="value-card">
              <span className="value-icon">🌿</span>
              <h3>100% Natural</h3>
              <p>No preservatives, no artificial colors, no additives. Just pure, natural ingredients.</p>
            </div>
            <div className="value-card">
              <span className="value-icon">👵</span>
              <h3>Traditional Recipes</h3>
              <p>Our recipes have been perfected over generations in Andhra kitchens.</p>
            </div>
            <div className="value-card">
              <span className="value-icon">🧴</span>
              <h3>Premium Quality</h3>
              <p>We use the finest ingredients - pure ghee, cold-pressed oils, and freshest spices.</p>
            </div>
            <div className="value-card">
              <span className="value-icon">📦</span>
              <h3>Hygienic Batch Packing</h3>
              <p>Every product is freshly packed in food-grade sealed containers for maximum freshness.</p>
            </div>
          </div>
        </section>

        <section className="about-process">
          <h2 className="section-title">Our Process</h2>
          <div className="process-steps">
            <div className="process-step">
              <div className="step-number">01</div>
              <h3>Sourcing</h3>
              <p>We carefully select the finest ingredients from local farmers and trusted suppliers.</p>
            </div>
            <div className="process-step">
              <div className="step-number">02</div>
              <h3>Preparation</h3>
              <p>Each product is prepared using traditional methods in small batches for quality.</p>
            </div>
            <div className="process-step">
              <div className="step-number">03</div>
              <h3>Packaging</h3>
              <p>We hygienically pack our products to preserve freshness and flavor.</p>
            </div>
            <div className="process-step">
              <div className="step-number">04</div>
              <h3>Delivery</h3>
              <p>Your order is carefully packed and delivered fresh to your doorstep.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

