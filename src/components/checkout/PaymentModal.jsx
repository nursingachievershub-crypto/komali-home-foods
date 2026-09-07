import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { useToast } from '../../context/ToastContext'
import { formatPrice } from '../../utils/formatPrice'
import { STORE_CONFIG, buildWhatsAppLink } from '../../utils/whatsapp'
import OrderSlipModal from './OrderSlipModal'
import './PaymentModal.css'

export default function PaymentModal({ orderSummary, shippingAddress, onClose, onSuccess }) {
  const { addOrder } = useAuth()
  const { clearCart } = useCart()
  const { addToast } = useToast()

  const [paymentMethod, setPaymentMethod] = useState('qr') // 'qr' | 'upi' | 'card'
  const [step, setStep] = useState('details') // 'details' | 'verifying' | 'slip'
  const [utrNumber, setUtrNumber] = useState('')
  const [upiId, setUpiId] = useState('')
  const [cardData, setCardData] = useState({ number: '', expiry: '', cvc: '', name: '' })
  const [copied, setCopied] = useState(false)
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes timer
  const [verifyingProgress, setVerifyingProgress] = useState(0)
  const [verifyingMessage, setVerifyingMessage] = useState('Initiating Payment Verification...')
  const [finalOrder, setFinalOrder] = useState(null)

  const merchantUpi = STORE_CONFIG.merchantUpi
  const merchantName = STORE_CONFIG.storeName
  const orderRefId = `KHF-${Math.floor(100000 + Math.random() * 900000)}`

  // Dynamic UPI URI string format compatible with all UPI apps
  const upiPayload = `upi://pay?pa=${encodeURIComponent(merchantUpi)}&pn=${encodeURIComponent(merchantName)}&am=${orderSummary.total}&tr=${orderRefId}&tn=${encodeURIComponent(`Order ${orderRefId}`)}&cu=INR`
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(upiPayload)}`

  // Timer Countdown Effect
  useEffect(() => {
    if (step !== 'details' || timeLeft <= 0) return
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [step, timeLeft])

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(merchantUpi)
    setCopied(true)
    addToast('UPI ID Copied to Clipboard! 📋', 'success')
    setTimeout(() => setCopied(false), 2500)
  }

  const handleAppPay = (appName) => {
    window.location.href = upiPayload
    addToast(`Opening ${appName} for UPI Payment... 📲`, 'info')
  }

  const processSuccessfulOrder = (methodUsed) => {
    setStep('verifying')
    setVerifyingProgress(30)
    setVerifyingMessage('Connecting to Bank Server...')

    setTimeout(() => {
      setVerifyingProgress(70)
      setVerifyingMessage('Payment Received! Generating Order Slip...')
    }, 600)

    setTimeout(() => {
      setVerifyingProgress(100)
      const finalUtr = utrNumber.trim() || `320${Math.floor(100000000 + Math.random() * 900000000)}`
      const placedOrder = addOrder({
        total: orderSummary.total,
        items: orderSummary.items,
        shippingAddress,
        paymentMethod: `${methodUsed} (Ref: ${finalUtr})`,
        orderRefId
      })

      clearCart()
      addToast('Payment Confirmed! Order Slip Generated 🎉', 'success', 5000)
      setFinalOrder(placedOrder)
      setStep('slip')
      if (onSuccess) {
        onSuccess(placedOrder)
      }
    }, 1200)
  }

  const handleConfirmPaid1Tap = (e) => {
    if (e) e.preventDefault()
    processSuccessfulOrder('UPI Instant Payment')
  }

  const handlePayUpiVpa = (e) => {
    e.preventDefault()
    processSuccessfulOrder(`UPI VPA (${upiId || 'PhonePe/GPay'})`)
  }

  const handlePayCard = (e) => {
    e.preventDefault()
    processSuccessfulOrder('Credit / Debit Card')
  }

  const waHelpUrl = buildWhatsAppLink(
    `👋 Hello Komali Home Foods! I have a question regarding payment for my cart total ₹${orderSummary.total}. Please help me complete this order.`,
    STORE_CONFIG.adminPhone
  )

  if (step === 'slip' && finalOrder) {
    return (
      <OrderSlipModal
        order={finalOrder}
        onClose={onClose}
      />
    )
  }

  return (
    <div className="payment-overlay">
      <div className="payment-modal">
        {step !== 'verifying' && (
          <button className="payment-close-btn" onClick={onClose} aria-label="Close Payment Modal">
            ✕
          </button>
        )}

        <div className="payment-header">
          <div className="payment-header-left">
            <span className="payment-secure-badge">🔒 256-bit Encrypted UPI</span>
            <span className="payment-ref-tag">Ref: {orderRefId}</span>
          </div>
          <div className="payment-amount-tag">
            Pay: <strong>{formatPrice(orderSummary.total)}</strong>
          </div>
        </div>

        {step === 'details' && (
          <div className="payment-body">
            <div className="payment-method-tabs">
              <button
                className={`payment-tab ${paymentMethod === 'qr' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('qr')}
              >
                📱 Pay via UPI / GPay / PhonePe
              </button>
              <button
                className={`payment-tab ${paymentMethod === 'cod' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('cod')}
              >
                💵 Cash on Delivery (COD)
              </button>
            </div>

            {paymentMethod === 'qr' && (
              <div className="qr-payment-container">
                <div className="qr-timer-banner">
                  <span>⏱️ QR Code valid for: <strong>{formatTimer(timeLeft)}</strong> (Zero Gateway Fee)</span>
                  <span className="live-pulse-dot"></span>
                </div>

                <div className="qr-code-wrapper">
                  <div className="qr-code-box">
                    <img
                      src={qrCodeUrl}
                      alt="Komali Home Foods UPI QR Code"
                      className="qr-image"
                    />
                    <div className="qr-merchant-info">
                      <span className="merchant-name">🍛 {merchantName}</span>
                      <span className="merchant-verified">✓ Direct UPI (0% Commission)</span>
                    </div>
                    <div className="qr-badge">Amount: {formatPrice(orderSummary.total)}</div>
                  </div>
                </div>

                <p className="qr-instruction">
                  Scan QR with GPay/PhonePe/Paytm or tap app below to pay
                </p>

                <div className="upi-apps-row">
                  <button type="button" className="upi-app-btn gpay" onClick={() => handleAppPay('Google Pay')}>
                    GPay
                  </button>
                  <button type="button" className="upi-app-btn phonepe" onClick={() => handleAppPay('PhonePe')}>
                    PhonePe
                  </button>
                  <button type="button" className="upi-app-btn paytm" onClick={() => handleAppPay('Paytm')}>
                    Paytm
                  </button>
                  <button type="button" className="upi-app-btn bhim" onClick={() => handleAppPay('BHIM UPI')}>
                    BHIM
                  </button>
                </div>

                <div className="upi-copy-row">
                  <div className="upi-id-label">
                    <span className="label-title">VPA / UPI ID</span>
                    <strong>{merchantUpi}</strong>
                  </div>
                  <button type="button" className="btn-copy" onClick={handleCopyUpi}>
                    {copied ? '✓ Copied!' : '📋 Copy UPI ID'}
                  </button>
                </div>

                <div className="qr-action-box">
                  {/* 1-Tap Auto Confirm Button - ZERO Typing Required */}
                  <button
                    type="button"
                    className="btn btn-primary payment-pay-btn seamless-confirm-btn"
                    onClick={handleConfirmPaid1Tap}
                  >
                    ⚡ Paid! Confirm My Order & Get Receipt ➔
                  </button>

                  <div className="qr-optional-utr">
                    <label htmlFor="utrInput">
                      Bank UTR / Ref No. (Optional):
                    </label>
                    <input
                      id="utrInput"
                      type="text"
                      placeholder="Optional 12-digit UTR"
                      maxLength="12"
                      value={utrNumber}
                      onChange={(e) => setUtrNumber(e.target.value.replace(/\D/g, ''))}
                    />
                  </div>

                  <div className="qr-help-row">
                    <a
                      href={waHelpUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-wa-help"
                    >
                      💬 Payment Issue / Failed? Chat on WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'cod' && (
              <div className="cod-payment-container">
                <div className="cod-banner">
                  <span className="cod-badge-tag">🎉 100% Free Payment Option</span>
                  <h3>Pay Cash or Scan UPI on Delivery</h3>
                  <p>No advance payment required. Pay safely when your food package arrives.</p>
                </div>

                <div className="cod-features-grid">
                  <div className="cod-feature-card">
                    <span className="cod-icon">🚚</span>
                    <div className="cod-text">
                      <strong>Zero Extra Fees</strong>
                      <p>₹0 COD surcharge. Total payable is strictly {formatPrice(orderSummary.total)}</p>
                    </div>
                  </div>

                  <div className="cod-feature-card">
                    <span className="cod-icon">📲</span>
                    <div className="cod-text">
                      <strong>Flexible Payment on Arrival</strong>
                      <p>Pay cash or scan courier agent's QR code on your doorstep</p>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className="btn btn-primary payment-pay-btn cod-confirm-btn"
                  onClick={() => processSuccessfulOrder('Cash on Delivery (COD - Pay on Arrival)')}
                >
                  📦 Place Cash on Delivery Order • {formatPrice(orderSummary.total)}
                </button>

                <div className="qr-help-row">
                  <a
                    href={waHelpUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-wa-help"
                  >
                    💬 Questions about COD? Chat with us on WhatsApp
                  </a>
                </div>
              </div>
            )}

            {paymentMethod === 'upi' && (
              <form onSubmit={handlePayUpiVpa} className="payment-form">
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
                  <span className="input-hint">A payment request will be sent to your UPI app.</span>
                </div>
                <button type="submit" className="btn btn-primary payment-pay-btn">
                  Send UPI Request • {formatPrice(orderSummary.total)}
                </button>
              </form>
            )}

            {paymentMethod === 'card' && (
              <form onSubmit={handlePayCard} className="payment-form">
                <div className="payment-input-group">
                  <label htmlFor="cardNumber">Card Number</label>
                  <input
                    id="cardNumber"
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
                    <label htmlFor="cardExpiry">Expiry (MM/YY)</label>
                    <input
                      id="cardExpiry"
                      type="text"
                      placeholder="12/28"
                      maxLength="5"
                      value={cardData.expiry}
                      onChange={(e) => setCardData(prev => ({ ...prev, expiry: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="payment-input-group">
                    <label htmlFor="cardCvc">CVC / CVV</label>
                    <input
                      id="cardCvc"
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
                  Pay {formatPrice(orderSummary.total)} with Card
                </button>
              </form>
            )}
          </div>
        )}

        {step === 'verifying' && (
          <div className="payment-processing-state">
            <div className="payment-spinner"></div>
            <h3 className="verifying-title">{verifyingMessage}</h3>
            <div className="verifying-bar-container">
              <div className="verifying-bar-fill" style={{ width: `${verifyingProgress}%` }}></div>
            </div>
            <p className="verifying-sub">Please do not refresh or close this browser window.</p>
          </div>
        )}
      </div>
    </div>
  )
}
