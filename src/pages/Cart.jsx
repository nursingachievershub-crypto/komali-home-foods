import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { formatPrice } from '../utils/formatPrice'
import { STORE_CONFIG, buildAdminOrderMessage, buildWhatsAppLink } from '../utils/whatsapp'
import './Cart.css'

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart()

  if (cartItems.length === 0) {
    return (
      <div className="container cart-empty">
        <span className="cart-empty-icon">🛒</span>
        <h2>Your cart is empty</h2>
        <p>Looks like you haven't added anything to your cart yet.</p>
        <Link to="/products" className="btn btn-primary">
          Browse Products
        </Link>
      </div>
    )
  }

  return (
    <div className="cart-page">
      <div className="container">
        <div className="cart-header">
          <h1 className="cart-title">Shopping Cart</h1>
          <button className="btn btn-outline cart-clear-btn" onClick={clearCart}>
            Clear Cart
          </button>
        </div>

        <div className="cart-content">
          <div className="cart-items">
            {cartItems.map(item => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-image">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="cart-item-img"
                  />
                </div>

                <div className="cart-item-info">
                  <Link to={`/products/${item.id}`}>
                    <h3 className="cart-item-name">{item.name}</h3>
                  </Link>
                  <p className="cart-item-weight">{item.weight}</p>
                  <p className="cart-item-price">{formatPrice(item.price)}</p>
                </div>

                <div className="cart-item-quantity">
                  <button
                    className="qty-btn"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    −
                  </button>
                  <span className="qty-value">{item.quantity}</span>
                  <button
                    className="qty-btn"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>

                <div className="cart-item-total">
                  <p className="cart-item-total-price">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>

                <button
                  className="cart-item-remove"
                  onClick={() => removeFromCart(item.id)}
                  aria-label="Remove item"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h3 className="summary-title">Order Summary</h3>

            <div className="summary-row">
              <span>Subtotal</span>
              <span>{formatPrice(cartTotal)}</span>
            </div>
            <div className="summary-row">
              <span>Delivery</span>
              <span className="summary-free">FREE within 3 km *</span>
            </div>
            <p className="cart-delivery-note">
              * Delivery is FREE within 3 km of Sanath Nagar. Beyond 3 km: ₹10 per additional km.
            </p>
            <div className="summary-divider"></div>
            <div className="summary-row summary-total">
              <span>Total</span>
              <span>{formatPrice(cartTotal)}</span>
            </div>

            <Link to="/checkout" className="btn btn-primary summary-checkout-btn">
              Proceed to Checkout
            </Link>

            <button
              type="button"
              className="btn btn-whatsapp-order"
              onClick={() => {
                const draftOrder = {
                  orderRefId: `KHF-${Math.floor(100000 + Math.random() * 900000)}`,
                  items: cartItems,
                  total: cartTotal,
                  shippingAddress: { fullName: 'Customer', address: 'Details via WhatsApp' }
                }
                const waUrl = buildWhatsAppLink(buildAdminOrderMessage(draftOrder), STORE_CONFIG.adminPhone)
                window.open(waUrl, '_blank')
              }}
            >
              💬 Quick Order via WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

