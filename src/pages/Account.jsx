import { Link, useNavigate } from 'react'
import { useAuth } from '../context/AuthContext'
import { formatPrice } from '../utils/formatPrice'
import './Account.css'

export default function Account() {
  const { user, orders, logout, openAuthModal } = useAuth()
  const navigate = useNavigate()

  if (!user) {
    return (
      <div className="container account-guest-state">
        <span className="guest-icon">🔒</span>
        <h2>Account Access Required</h2>
        <p>Please log in or sign up to view your order history and saved addresses.</p>
        <div className="guest-actions">
          <button className="btn btn-primary" onClick={() => openAuthModal('login')}>
            Log In
          </button>
          <button className="btn btn-outline" onClick={() => openAuthModal('signup')}>
            Create Account
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="account-page">
      <div className="container">
        <div className="account-header">
          <div className="account-user-info">
            <div className="account-avatar">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="account-name">{user.name}</h1>
              <p className="account-email">{user.email} • {user.phone || 'No phone provided'}</p>
            </div>
          </div>
          <button className="btn btn-outline logout-btn" onClick={() => { logout(); navigate('/') }}>
            Log Out
          </button>
        </div>

        <div className="account-grid">
          {/* Left Column: Order History */}
          <div className="account-main">
            <h2 className="section-title">My Orders ({orders.length})</h2>

            {orders.length > 0 ? (
              <div className="orders-list">
                {orders.map(order => (
                  <div key={order.id} className="order-card">
                    <div className="order-card-header">
                      <div>
                        <span className="order-id">Order #{order.id}</span>
                        <span className="order-date">
                          {new Date(order.date).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                      <span className={`order-status-badge status-${order.status.toLowerCase()}`}>
                        {order.status}
                      </span>
                    </div>

                    <div className="order-items-list">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="order-item-row">
                          <span className="order-item-title">
                            {item.quantity}x {item.name}
                          </span>
                          <span className="order-item-price">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="order-card-footer">
                      <div className="order-delivery-info">
                        📍 Delivered to: <strong>{order.shippingAddress?.city || 'Hyderabad'}</strong>
                      </div>
                      <div className="order-total-amount">
                        Total: <strong>{formatPrice(order.total)}</strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="orders-empty">
                <p>You haven't placed any orders yet.</p>
                <Link to="/products" className="btn btn-primary">Start Shopping</Link>
              </div>
            )}
          </div>

          {/* Right Column: Account Details & Saved Addresses */}
          <div className="account-sidebar">
            <div className="account-card">
              <h3 className="card-title">Saved Address</h3>
              {user.savedAddresses && user.savedAddresses.length > 0 ? (
                user.savedAddresses.map((addr) => (
                  <div key={addr.id} className="address-box">
                    <span className="address-label">{addr.name}</span>
                    <p>{addr.street}</p>
                    <p>{addr.city}, {addr.state} - {addr.pincode}</p>
                  </div>
                ))
              ) : (
                <div className="no-address">
                  <p>No saved addresses yet. Addresses are automatically saved on checkout.</p>
                </div>
              )}
            </div>

            <div className="account-card trust-info-card">
              <h3>💖 Komali Home Guarantee</h3>
              <p>100% Homemade with authentic spices, zero artificial colors, and delivered fresh to your doorstep.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
