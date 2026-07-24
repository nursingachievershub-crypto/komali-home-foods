import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import './Header.css'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false)
  const { cartCount } = useCart()
  const { user, openAuthModal, logout } = useAuth()
  const navigate = useNavigate()

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/products', label: 'Products' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' },
  ]

  const handleLogout = () => {
    logout()
    setIsUserDropdownOpen(false)
    navigate('/')
  }

  return (
    <header className="header">
      <div className="container header-container">
        <Link to="/" className="header-logo">
          <span className="header-logo-brand">KOMALI</span>
          <span className="header-logo-divider">✦</span>
          <span className="header-logo-sub">HOME FOODS</span>
        </Link>

        <nav className={`header-nav ${isMenuOpen ? 'open' : ''}`}>
          <ul className="header-nav-list">
            {navLinks.map(link => (
              <li key={link.path}>
                <NavLink
                  to={link.path}
                  className={({ isActive }) =>
                    `header-nav-link ${isActive ? 'active' : ''}`
                  }
                  end={link.path === '/'}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="header-actions">
          <Link to="/cart" className="header-cart-btn" title="Shopping Cart">
            <span className="header-cart-icon">🛒</span>
            {cartCount > 0 && (
              <span className="header-cart-badge">{cartCount}</span>
            )}
          </Link>

          {user ? (
            <div className="header-user-menu">
              <button 
                className="header-user-btn"
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                title="Account Settings"
              >
                <span className="header-user-avatar">
                  {user.name.charAt(0).toUpperCase()}
                </span>
                <span className="header-user-name">{user.name.split(' ')[0]}</span>
                <span className="header-user-caret">▾</span>
              </button>

              {isUserDropdownOpen && (
                <div className="header-user-dropdown" onClick={() => setIsUserDropdownOpen(false)}>
                  <div className="dropdown-header">
                    <strong>{user.name}</strong>
                    <small>{user.email}</small>
                  </div>
                  <hr className="dropdown-divider" />
                  <Link to="/account" className="dropdown-item">
                    📦 My Orders & Account
                  </Link>
                  <button onClick={handleLogout} className="dropdown-item dropdown-logout">
                    🚪 Log Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button 
              className="btn btn-outline header-login-btn"
              onClick={() => openAuthModal('login')}
            >
              Sign In
            </button>
          )}

          <button
            className="header-menu-btn"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <span className={`hamburger ${isMenuOpen ? 'open' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
        </div>
      </div>
    </header>
  )
}
