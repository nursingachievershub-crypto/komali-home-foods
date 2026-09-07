import { useState } from 'react'
import { formatPrice } from '../../utils/formatPrice'
import {
  STORE_CONFIG,
  calculateDeliveryTimeframe,
  buildAdminOrderMessage,
  buildCustomerOrderMessage,
  buildWhatsAppLink
} from '../../utils/whatsapp'
import './OrderSlipModal.css'

export default function OrderSlipModal({ order, onClose }) {
  const [copiedLink, setCopiedLink] = useState(false)
  const delivery = calculateDeliveryTimeframe(order.shippingAddress?.pincode)

  const adminWhatsAppUrl = buildWhatsAppLink(
    buildAdminOrderMessage(order),
    STORE_CONFIG.adminPhone
  )

  const customerWhatsAppUrl = buildWhatsAppLink(
    buildCustomerOrderMessage(order),
    order.shippingAddress?.phone ? order.shippingAddress.phone.replace(/\D/g, '') : STORE_CONFIG.adminPhone
  )

  const handlePrint = () => {
    window.print()
  }

  const handleCopyOrderRef = () => {
    navigator.clipboard.writeText(order.orderRefId || order.id)
    setCopiedLink(true)
    setTimeout(() => setCopiedLink(false), 2500)
  }

  return (
    <div className="order-slip-overlay">
      <div className="order-slip-modal printable-area">
        {/* Header Bar */}
        <div className="order-slip-topbar no-print">
          <div className="topbar-status">
            <span className="status-badge success-pulse">✓ Order Placed & Confirmed</span>
            <span className="ref-tag">Ref: {order.orderRefId || order.id}</span>
          </div>
          <button className="slip-close-btn" onClick={onClose} aria-label="Close Order Slip">
            ✕
          </button>
        </div>

        {/* Printable Order Slip Document */}
        <div className="slip-paper">
          {/* Brand Header */}
          <div className="slip-header">
            <div className="slip-brand">
              <span className="slip-brand-title">KOMALI HOME FOODS</span>
              <span className="slip-brand-tagline">Authentic Andhra Pickles, Sweets & Spices</span>
              <span className="slip-brand-address">{STORE_CONFIG.storeAddress}</span>
              <span className="slip-brand-contact">📞 {STORE_CONFIG.adminDisplayPhone} | ✉️ {STORE_CONFIG.storeEmail}</span>
            </div>
            <div className="slip-badge-box">
              <span className="slip-type-tag">OFFICIAL ORDER SLIP</span>
              <span className="slip-date">
                {new Date().toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
          </div>

          <div className="slip-divider"></div>

          {/* Customer & Delivery Information Grid */}
          <div className="slip-info-grid">
            <div className="slip-info-col">
              <h4>Customer Details</h4>
              <p className="customer-name"><strong>{order.shippingAddress?.fullName || 'Valued Customer'}</strong></p>
              <p>📞 {order.shippingAddress?.phone}</p>
              <p>✉️ {order.shippingAddress?.email}</p>
            </div>
            <div className="slip-info-col">
              <h4>Shipping Address</h4>
              <p>{order.shippingAddress?.address}</p>
              <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} - <strong>{order.shippingAddress?.pincode}</strong></p>
            </div>
          </div>

          {/* Delivery Timeframe Banner */}
          <div className="delivery-timeframe-box">
            <div className="delivery-icon">🚚</div>
            <div className="delivery-text">
              <span className="delivery-badge-title">{delivery.badge}</span>
              <h3 className="delivery-timeframe-heading">{delivery.timeframe}</h3>
              <p className="delivery-subtext">{delivery.details}</p>
            </div>
          </div>

          {/* Itemized Order Table */}
          <div className="slip-table-wrapper">
            <table className="slip-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Item Details</th>
                  <th>Weight</th>
                  <th className="text-center">Qty</th>
                  <th className="text-right">Price</th>
                  <th className="text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, idx) => (
                  <tr key={idx}>
                    <td>{idx + 1}</td>
                    <td className="item-name-cell">
                      <strong>{item.name}</strong>
                    </td>
                    <td>{item.weight || 'Standard'}</td>
                    <td className="text-center">{item.quantity}</td>
                    <td className="text-right">{formatPrice(item.price)}</td>
                    <td className="text-right"><strong>{formatPrice(item.price * item.quantity)}</strong></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Order Summary Financials */}
          <div className="slip-financials">
            <div className="financial-note">
              <p><strong>Payment Method:</strong> {order.paymentMethod || 'UPI Payment (Verified)'}</p>
              <p><strong>Payment Status:</strong> <span className="paid-status-tag">✓ CONFIRMED</span></p>
            </div>
            <div className="financial-totals">
              <div className="total-row">
                <span>Subtotal:</span>
                <span>{formatPrice(order.subtotal || order.total - (order.deliveryFee || 0))}</span>
              </div>
              <div className="total-row">
                <span>Delivery Charge:</span>
                {order.deliveryFee > 0 ? (
                  <span>{formatPrice(order.deliveryFee)}</span>
                ) : (
                  <span className="free-tag">FREE 🎉 (Within 3 km)</span>
                )}
              </div>
              <div className="total-row grand-total-row">
                <span>Grand Total:</span>
                <span className="grand-price">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="slip-footer-note">
            <p>❤️ Thank you for ordering from Komali Home Foods! Handcrafted with love & traditional Andhra recipes.</p>
            <p className="slip-ref-copy" onClick={handleCopyOrderRef}>
              Order Ref: <strong>{order.orderRefId || order.id}</strong> {copiedLink ? '(Copied!)' : '📋 Click to copy'}
            </p>
          </div>
        </div>

        {/* Modal Action Controls (Hidden when printing) */}
        <div className="slip-actions no-print">
          <a
            href={customerWhatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-slip-action customer-wa"
          >
            📱 Send Order Slip to My WhatsApp
          </a>

          <a
            href={adminWhatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-slip-action admin-wa"
          >
            📤 Alert Admin on WhatsApp
          </a>

          <button type="button" className="btn-slip-action print-btn" onClick={handlePrint}>
            🖨️ Print / Save PDF
          </button>

          <button type="button" className="btn-slip-action close-modal-btn" onClick={onClose}>
            🛍️ Done & Continue Shopping
          </button>
        </div>
      </div>
    </div>
  )
}
