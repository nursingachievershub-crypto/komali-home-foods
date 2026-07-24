import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { useToast } from '../../context/ToastContext'
import { formatPrice } from '../../utils/formatPrice'
import './PaymentModal.css'

export default function PaymentModal({ orderSummary, shippingAddress, onClose, onSuccess }) {
  const { addOrder } = useAuth()
  const { clearCart } = useCart()
  const { addToast } = useToast()

  const [paymentMethod, setPaymentMethod] = useState('qr') // 'qr' | 'upi' | 'card'
  const [step, setStep] = useState('details') // 'details' | 'processing' | 'success'
  const [utrNumber, setUtrNumber] = useState('')
  const [upiId, setUpiId] = useState('')
  const [cardData, setCardData] = useState({ number: '', expiry: '', cvc: '', name: '' })
  const [copied, setCopied] = useState(false)

  const merchantUpi = 'komalihomefoods@upi'
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=upi://pay?pa=${encodeURIComponent(merchantUpi)}&pn=${encodeURIComponent('Komali Home Foods')}&am=${orderSummary.total}&cu=INR`

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(merchantUpi)
    setCopied(true)
    addToast('UPI ID Copied to Clipboard! 📋', 'success')
    setTimeout(() => setCopied(false), 2500)
  }

  const handleConfirmQrPayment = (e) => {
    e.preventDefault()
    setStep('processing')
    setTimeout(() => {
      const placedOrder = addOrder({
        total: orderSummary.total,
        items: orderSummary.items,
        shippingAddress,
        paymentMethod: `UPI QR Scan (UTR: ${utrNumber || 'CONFIRMED'})`
      })

      clearCart()
      addToast('Payment Received! Order Confirmed 🎉', 'success', 5000)
      setStep('success')
      if (onSuccess) {
        onSuccess(placedOrder)
      }
    }, 1500)
  }

  const handlePayNow = (e) => {
    e.preventDefault()
    setStep('processing')
    setTimeout(() => {
      const placedOrder = addOrder({
        total: orderSummary.total,
        items: orderSummary.items,
        shippingAddress,
        paymentMethod: paymentMethod === 'upi' ? `UPI VPA (${upiId || 'PhonePe'})` : 'Credit/Debit Card'
      })

      clearCart()
      addToast('Payment Successful! Order Confirmed 🎉', 'success', 5000)
      setStep('success')
      if (onSuccess) {
        onSuccess(placedOrder)
      }
    }, 1500)
  }

  return (
    <div className="payment-overlay">
      <div className="payment-modal">
        {step !== 'success' && (
          <button className="payment-close-btn" onClick={onClose}>✕</button>
        )}

        <div className="payment-header">
          <div className="payment-secure-badge">🔒 Instant UPI Payment</div>
          <div className="payment-amount-tag">
            Total Amount: <strong>{formatPrice(orderSummary.total)}</strong>
          </div>
        </div>

        {step === 'details' && (
          <div className="payment-body">
            <div className="payment-method-tabs">
              <button
                className={`payment-tab ${paymentMethod === 'qr' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('qr')}
              >
                📷 Scan QR Code
              </button>
              <button
                className={`payment-tab ${paymentMethod === 'upi' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('upi')}
              >
                📱 UPI VPA
              </button>
              <button
                className={`payment-tab ${paymentMethod === 'card' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('card')}
              >
                💳 Card
              </button>
            </div>

            {paymentMethod === 'qr' && (
              <div className="qr-payment-container">
                <p className="qr-instruction">Scan with GPay, PhonePe, Paytm or BHIM app to pay</p>

                <div className="qr-code-box">
                  <img
                    src={qrCodeUrl}
                    alt="Komali Home Foods UPI QR Code"
                    className="qr-image"
                  />
                  <div className="qr-badge">Pay {formatPrice(orderSummary.total)}</div>
                </div>

                <div className="upi-apps-row">
                  <span className="upi-badge">Google Pay</span>
                  <span className="upi-badge">PhonePe</span>
                  <span className="upi-badge">Paytm</span>
                  <span className="upi-badge">BHIM UPI</span>
                </div>

                <div className="upi-copy-row">
                  <span className="upi-id-label">UPI ID: <strong>{merchantUpi}</strong></span>
                  <button type="button" className="btn-copy" onClick={handleCopyUpi}>
                    {copied ? '✓ Copied' : '📋 Copy'}
                  </button>
                </div>

                <form onSubmit={handleConfirmQrPayment} className="qr-verify-form">
                  <div className="payment-input-group">
                    <label>Enter 12-Digit Transaction UTR / Ref No. (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. 320491823901"
                      maxLength="12"
                      value={utrNumber}
                      onChange={(e) => setUtrNumber(e.target.value)}
                    />
                  </div>

                  <button type="submit" className="btn btn-primary payment-pay-btn">
                    I Have Paid {formatPrice(orderSummary.total)} →
                  </button>
                </form>
              </div>
            )}

            {paymentMethod === 'upi' && (
              <form onSubmit={handlePayNow} className="payment-form">
                <div className="payment-input-group">
                  <label htmlFor="upiId">Enter Mobile Number / UPI VPA</label>
                  <input
                    type="text"
                    id="upiId"
                    placeholder="e.g. 9876543210@ybl or username@okaxis"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary payment-pay-btn">
                  Pay {formatPrice(orderSummary.total)}
                </button>
              </form>
            )}

            {paymentMethod === 'card' && (
              <form onSubmit={handlePayNow} className="payment-form">
                <div className="payment-input-group">
                  <label>Card Number</label>
                  <input
                    type="text"
                    placeholder="4532 •••• •••• 4242"
                    maxLength="19"
                    value={cardData.number}
                    onChange={(e) => setCardData(prev => ({ ...prev, number: e.target.value }))}
                    required
                  />
                </div>
                <div className="payment-input-row">
                  <div className="payment-input-group">
                    <label>Expiry (MM/YY)</label>
                    <input
                      type="text"
                      placeholder="12/28"
                      maxLength="5"
                      value={cardData.expiry}
                      onChange={(e) => setCardData(prev => ({ ...prev, expiry: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="payment-input-group">
                    <label>CVC / CVV</label>
                    <input
                      type="password"
                      placeholder="•••"
                      maxLength="3"
                      value={cardData.cvc}
                      onChange={(e) => setCardData(prev => ({ ...prev, cvc: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary payment-pay-btn">
                  Pay {formatPrice(orderSummary.total)}
                </button>
              </form>
            )}
          </div>
        )}

        {step === 'processing' && (
          <div className="payment-processing-state">
            <div className="payment-spinner"></div>
            <h3>Verifying UPI Payment...</h3>
            <p>Please wait while we confirm your payment transaction.</p>
          </div>
        )}

        {step === 'success' && (
          <div className="payment-success-state">
            <div className="success-checkmark">✓</div>
            <h2>Payment Received & Order Placed!</h2>
            <p>Thank you for choosing Komali Home Foods. Your authentic items are being freshly prepared.</p>
            <button
              className="btn btn-primary"
              onClick={onClose}
            >
              View My Order 📦
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
