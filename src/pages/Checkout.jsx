import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { formatPrice } from '../utils/formatPrice'
import {
  STORE_CONFIG,
  DELIVERY_DISTANCE_PRESETS,
  calculateDeliveryFee,
  buildAdminOrderMessage,
  buildWhatsAppLink
} from '../utils/whatsapp'
import PaymentModal from '../components/checkout/PaymentModal'
import './Checkout.css'

export default function Checkout() {
  const navigate = useNavigate()
  const { cartItems, cartTotal } = useCart()
  const { user, openAuthModal } = useAuth()
  
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [placedOrder, setPlacedOrder] = useState(null)
  const [distanceKm, setDistanceKm] = useState(3)

  const [formData, setFormData] = useState({
    fullName: user ? user.name : '',
    email: user ? user.email : '',
    phone: user ? user.phone || '' : '',
    address: user && user.savedAddresses?.[0] ? user.savedAddresses[0].street : '',
    city: user && user.savedAddresses?.[0] ? user.savedAddresses[0].city : '',
    state: user && user.savedAddresses?.[0] ? user.savedAddresses[0].state : '',
    pincode: user && user.savedAddresses?.[0] ? user.savedAddresses[0].pincode : '',
  })

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: prev.fullName || user.name,
        email: prev.email || user.email,
        phone: prev.phone || user.phone || ''
      }))
    }
  }, [user])

  const deliveryFee = calculateDeliveryFee(distanceKm)
  const grandTotal = cartTotal + deliveryFee
  const distanceText = Number(distanceKm) <= 3 ? 'Within 3 km (Free)' : `${distanceKm} km (${distanceKm - 3} km extra × ₹10/km)`

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleOpenPayment = (e) => {
    e.preventDefault()
    
    // Create draft order data for WhatsApp payload
    const draftOrder = {
      orderRefId: `KHF-${Math.floor(100000 + Math.random() * 900000)}`,
      items: cartItems,
      subtotal: cartTotal,
      deliveryFee,
      distanceText,
      total: grandTotal,
      shippingAddress: formData,
      paymentMethod: 'UPI / QR Code'
    }

    // Open WhatsApp to send order alert to Admin
    const waUrl = buildWhatsAppLink(buildAdminOrderMessage(draftOrder), STORE_CONFIG.adminPhone)
    window.open(waUrl, '_blank')

    // Open Payment Modal
    setShowPaymentModal(true)
  }

  if (cartItems.length === 0 && !placedOrder) {
    return (
      <div className="container checkout-empty">
        <span className="checkout-empty-icon">🛒</span>
        <h2>Your cart is empty</h2>
        <p>Add some products before checking out.</p>
        <Link to="/products" className="btn btn-primary">Browse Products</Link>
      </div>
    )
  }

  if (placedOrder) {
    return (
      <div className="container order-success">
        <div className="order-success-card">
          <span className="order-success-icon">🎉</span>
          <h2>Order Confirmed! ({placedOrder.id})</h2>
          <p>Thank you, <strong>{formData.fullName}</strong>. Your order is being freshly prepared with love!</p>
          <p className="order-success-info">
            Order Total: <strong>{formatPrice(placedOrder.total)}</strong> • Payment: <strong>{placedOrder.paymentMethod}</strong>
          </p>
          <div className="order-success-actions">
            <Link to="/account" className="btn btn-primary">
              View My Orders
            </Link>
            <Link to="/products" className="btn btn-outline">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <div className="checkout-header-row">
          <h1 className="checkout-title">Checkout</h1>
          {!user && (
            <div className="checkout-login-prompt">
              Already have an account?{' '}
              <button className="text-btn" onClick={() => openAuthModal('login')}>
                Sign in to prefill details
              </button>
            </div>
          )}
        </div>

        <div className="checkout-content">
          <form className="checkout-form" onSubmit={handleOpenPayment}>
            <h2 className="checkout-section-title">Shipping & Contact Details</h2>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="fullName">Full Name</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  placeholder="Enter your full name"
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
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

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="+91 98765 43210"
                />
              </div>
              <div className="form-group">
                <label htmlFor="pincode">Pincode</label>
                <input
                  type="text"
                  id="pincode"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  required
                  placeholder="500018"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="address">Street Address</label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                placeholder="Flat / House No., Street, Area, Landmark"
                rows="3"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city">City</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  placeholder="Hyderabad"
                />
              </div>
              <div className="form-group">
                <label htmlFor="state">State</label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                  placeholder="Telangana"
                />
              </div>
            </div>

            {/* Delivery Distance Section */}
            <div className="checkout-delivery-section">
              <h2 className="checkout-section-title">🚚 Delivery Distance & Fare Calculation</h2>
              <div className="delivery-rule-banner">
                <span>📍 Dispatch Store: <strong>Sanath Nagar, Hyderabad (500018)</strong></span>
                <p>• <strong>Within 3 km: FREE Delivery (₹0)</strong></p>
                <p>• <strong>Beyond 3 km: ₹10 per km</strong> for extra distance</p>
              </div>

              <div className="distance-calculator-box">
                <div className="form-group">
                  <label htmlFor="presetSelect">Select Quick Distance Preset</label>
                  <select
                    id="presetSelect"
                    value={distanceKm}
                    onChange={(e) => setDistanceKm(Number(e.target.value))}
                    className="distance-select"
                  >
                    {DELIVERY_DISTANCE_PRESETS.map(preset => (
                      <option key={preset.km} value={preset.km}>
                        {preset.label} — {preset.fee === 0 ? 'FREE Delivery 🎉' : `₹${preset.fee} Fee`}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group custom-km-input-group">
                  <label htmlFor="customKm">Or Enter Custom Distance (in km):</label>
                  <div className="km-input-wrapper">
                    <input
                      type="number"
                      id="customKm"
                      min="1"
                      max="100"
                      value={distanceKm}
                      onChange={(e) => setDistanceKm(Math.max(1, Number(e.target.value)))}
                      className="km-input"
                    />
                    <span className="km-unit">km</span>
                  </div>
                </div>

                <div className="km-fee-breakdown-badge">
                  {Number(distanceKm) <= 3 ? (
                    <span className="fee-free-text">🎉 {distanceKm} km is within 3 km range = <strong>FREE Delivery!</strong></span>
                  ) : (
                    <span className="fee-calc-text">
                      📏 {distanceKm} km total = 3 km Free + {distanceKm - 3} km extra @ ₹10/km = <strong>₹{deliveryFee} Delivery Charge</strong>
                    </span>
                  )}
                </div>
              </div>
            </div>

            <button type="submit" className="btn btn-primary place-order-btn">
              Proceed to Payment • {formatPrice(grandTotal)}
            </button>
          </form>

          <div className="checkout-summary">
            <h2 className="checkout-section-title">Order Summary</h2>
            <div className="checkout-items">
              {cartItems.map(item => (
                <div key={item.id} className="checkout-item">
                  <img src={item.image} alt={item.name} className="checkout-item-img" />
                  <div className="checkout-item-info">
                    <p className="checkout-item-name">{item.name}</p>
                    <p className="checkout-item-qty">Qty: {item.quantity} • {item.weight}</p>
                  </div>
                  <p className="checkout-item-price">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            <div className="checkout-divider"></div>

            <div className="checkout-row">
              <span>Subtotal</span>
              <span>{formatPrice(cartTotal)}</span>
            </div>
            <div className="checkout-row">
              <span>Delivery Fee ({distanceKm} km)</span>
              <span>
                {deliveryFee === 0 ? (
                  <strong className="checkout-free">FREE 🎉</strong>
                ) : (
                  <strong>{formatPrice(deliveryFee)}</strong>
                )}
              </span>
            </div>
            <div className="checkout-divider"></div>
            <div className="checkout-row checkout-total">
              <span>Total Payable</span>
              <span>{formatPrice(grandTotal)}</span>
            </div>
          </div>
        </div>

        {showPaymentModal && (
          <PaymentModal
            orderSummary={{
              total: grandTotal,
              subtotal: cartTotal,
              deliveryFee,
              distanceText: `${distanceKm} km`,
              items: cartItems
            }}
            shippingAddress={formData}
            onClose={() => setShowPaymentModal(false)}
            onSuccess={(order) => {
              setPlacedOrder(order)
              setShowPaymentModal(false)
            }}
          />
        )}
      </div>
    </div>
  )
}
