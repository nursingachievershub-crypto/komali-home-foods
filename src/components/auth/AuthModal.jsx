import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import './AuthModal.css'

export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, authMode, login, signup } = useAuth()
  const { addToast } = useToast()

  const [mode, setMode] = useState(authMode || 'login')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: ''
  })
  const [error, setError] = useState('')

  if (!isAuthModalOpen) return null

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.email || !formData.password) {
      setError('Please fill in all required fields.')
      return
    }

    if (mode === 'login') {
      login(formData.email, formData.password)
      addToast('Welcome back to Komali Home Foods! 👋', 'success')
    } else {
      if (!formData.name) {
        setError('Please enter your full name.')
        return
      }
      signup(formData.name, formData.email, formData.password, formData.phone)
      addToast('Account created successfully! Welcome! 🎉', 'success')
    }
  }

  return (
    <div className="auth-overlay" onClick={closeAuthModal}>
      <div className="auth-modal" onClick={e => e.stopPropagation()}>
        <button className="auth-close-btn" onClick={closeAuthModal} aria-label="Close modal">
          ✕
        </button>

        <div className="auth-header">
          <div className="auth-logo">🍛</div>
          <h2 className="auth-title">Komali Home Foods</h2>
          <p className="auth-subtitle">Authentic Andhra Delicacies at Your Doorstep</p>
        </div>

        <div className="auth-tabs">
          <button
            className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
            onClick={() => { setMode('login'); setError('') }}
          >
            Log In
          </button>
          <button
            className={`auth-tab ${mode === 'signup' ? 'active' : ''}`}
            onClick={() => { setMode('signup'); setError('') }}
          >
            Sign Up
          </button>
        </div>

        {error && <div className="auth-error-banner">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <div className="auth-input-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="e.g. Ramesh Varma"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <div className="auth-input-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="e.g. ramesh@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="auth-input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {mode === 'signup' && (
            <div className="auth-input-group">
              <label htmlFor="phone">Phone Number (Optional)</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          )}

          <button type="submit" className="btn btn-primary auth-submit-btn">
            {mode === 'login' ? 'Log In to Account' : 'Create Free Account'}
          </button>

          <div className="auth-demo-hint">
            💡 <strong>Quick Demo:</strong> Enter any email & password to test.
          </div>
        </form>
      </div>
    </div>
  )
}
