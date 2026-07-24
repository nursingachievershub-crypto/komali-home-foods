import { useState } from 'react'
import './Contact.css'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    setFormData({ name: '', email: '', subject: '', message: '' })
  }

  return (
    <div className="contact-page">
      <div className="contact-hero">
        <div className="container">
          <h1 className="contact-hero-title">Get in Touch</h1>
          <p className="contact-hero-subtitle">
            We'd love to hear from you! Reach out with any questions or feedback.
          </p>
        </div>
      </div>

      <div className="container contact-content">
        <div className="contact-grid">
          <div className="contact-info">
            <h2 className="contact-info-title">Contact Information</h2>

            <div className="contact-info-items">
              <div className="contact-info-item">
                <span className="contact-info-icon">📍</span>
                <div>
                  <h4>Address</h4>
                  <p>Sanath Nagar, Hyderabad, Telangana - 500018</p>
                </div>
              </div>
              <div className="contact-info-item">
                <span className="contact-info-icon">📞</span>
                <div>
                  <h4>Phone</h4>
                  <p>+91 91219 77667</p>
                </div>
              </div>
              <div className="contact-info-item">
                <span className="contact-info-icon">✉️</span>
                <div>
                  <h4>Email</h4>
                  <p>hello@komalihomefoods.com</p>
                </div>
              </div>
              <div className="contact-info-item">
                <span className="contact-info-icon">🕐</span>
                <div>
                  <h4>Business Hours</h4>
                  <p>Mon - Sat: 9:00 AM - 7:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          <div className="contact-form-wrap">
            {submitted ? (
              <div className="contact-success">
                <span className="contact-success-icon">✉️</span>
                <h3>Message Sent!</h3>
                <p>Thank you for reaching out. We'll get back to you within 24 hours.</p>
                <button
                  className="btn btn-primary"
                  onClick={() => setSubmitted(false)}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit}>
                <h2 className="contact-form-title">Send us a Message</h2>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Your Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Enter your name"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Your Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="subject">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder="What is this regarding?"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    placeholder="Write your message here..."
                    rows="5"
                  />
                </div>

                <button type="submit" className="btn btn-primary contact-submit-btn">
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

