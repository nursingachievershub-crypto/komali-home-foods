import { testimonials } from '../../data/products'
import './Testimonials.css'

function StarRating({ rating }) {
  return (
    <div className="stars">
      {[1, 2, 3, 4, 5].map(star => (
        <span key={star} className={`star ${star <= rating ? 'filled' : ''}`}>
          ★
        </span>
      ))}
    </div>
  )
}

export default function Testimonials() {
  return (
    <section className="testimonials section-padding">
      <div className="container">
        <h2 className="section-title">Loved Across India</h2>
        <div className="authentic-divider">✦ ✨ ✦</div>
        <p className="section-subtitle">
          Over 5,000+ happy homes trust Komali for genuine homestyle taste and festive sweets
        </p>

        <div className="testimonials-grid">
          {testimonials.map(testimonial => (
            <div key={testimonial.id} className="testimonial-card">
              <div className="testimonial-stars">
                <StarRating rating={testimonial.rating} />
              </div>
              <p className="testimonial-comment">"{testimonial.comment}"</p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="testimonial-avatar-img"
                  />
                </div>
                <div>
                  <p className="testimonial-name">{testimonial.name}</p>
                  <p className="testimonial-location">📍 {testimonial.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
