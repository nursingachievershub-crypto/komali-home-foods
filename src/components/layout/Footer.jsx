import { Link } from 'react-router-dom'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-logo">
              <span className="footer-logo-brand">KOMALI</span>
              <span className="footer-logo-divider">✦</span>
              <span className="footer-logo-sub">HOME FOODS</span>
            </div>
            <p className="footer-description">
              Bringing the authentic taste of Andhra Pradesh to your doorstep. 
              Homemade traditional pickles, sweets, and spice mixes made with love.
            </p>
          </div>

          <div className="footer-links">
            <h4 className="footer-heading">Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/products">Products</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          <div className="footer-links">
            <h4 className="footer-heading">Categories</h4>
            <ul>
              <li><Link to="/products?category=pickles">Pickles</Link></li>
              <li><Link to="/products?category=mixes">Mixes & Powders</Link></li>
              <li><Link to="/products?category=sweets">Sweets</Link></li>
            </ul>
          </div>

          <div className="footer-contact">
            <h4 className="footer-heading">Contact Us</h4>
            <ul>
              <li>
                <span className="footer-contact-icon">📍</span>
                <span>Sanath Nagar, Hyderabad, Telangana - 500018</span>
              </li>
              <li>
                <span className="footer-contact-icon">📞</span>
                <span>+91 91219 77667</span>
              </li>
              <li>
                <span className="footer-contact-icon">✉️</span>
                <span>hello@komalihomefoods.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Komali Home Foods. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

