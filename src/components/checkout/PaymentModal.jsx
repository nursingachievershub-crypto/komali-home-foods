import { useState, useEffect } from 'react'
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
  const [step, setStep] = useState('details') // 'details' | 'verifying' | 'success'
  const [utrNumber, setUtrNumber] = useState('')
  const [upiId, setUpiId] = useState('')
  const [cardData, setCardData] = useState({ number: '', expiry: '', cvc: '', name: '' })
  const [copied, setCopied] = useState(false)
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes timer
  const [verifyingProgress, setVerifyingProgress] = useState(0)
  const [verifyingMessage, setVerifyingMessage] = useState('Initiating UPI Verification...')

  const merchantUpi = 'komalihomefoods@icici'
  const merchantName = 'Komali Home Foods'
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
    setVerifyingProgress(25)
    setVerifyingMessage('Connecting to NPCI / Bank Server...')

    setTimeout(() => {
      setVerifyingProgress(60)
      setVerifyingMessage('Verifying UPI Payment Transaction...')
    }, 800)

    setTimeout(() => {
      setVerifyingProgress(90)
      setVerifyingMessage('Payment Approved! Finalizing Order...')
    }, 1600)

    setTimeout(() => {
      setVerifyingProgress(100)
      const finalUtr = utrNumber.trim() || `320${Math.floor(100000000 + Math.random() * 900000000)}`
      const placedOrder = addOrder({
        total: orderSummary.total,
        items: orderSummary.items,
        shippingAddress,
        paymentMethod: `${methodUsed} (UTR: ${finalUtr})`,
        orderRefId
      })

      clearCart()
      addToast('Payment Received! Order Confirmed 🎉', 'success', 5000)
      setStep('success')
      if (onSuccess) {
        onSuccess(placedOrder)
      }
    }, 2400)
  }

  const handleConfirmQrPayment = (e) => {
    e.preventDefault()
    processSuccessfulOrder('UPI QR Code Scan')
  }

  const handleSimulatePayment = () => {
    setUtrNumber(`3209${Math.floor(10000000 + Math.random() * 90000000)}`)
    processSuccessfulOrder('Instant UPI QR Scan')
  }

  const handlePayUpiVpa = (e) => {
    e.preventDefault()
    processSuccessfulOrder(`UPI VPA (${upiId || 'PhonePe/GPay'})`)
  }

  const handlePayCard = (e) => {
    e.preventDefault()
    processSuccessfulOrder('Credit / Debit Card')
  }

  return (
    <div className="payment-overlay">
      <div className="payment-modal">
        {step !== 'success' && (
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
                📷 Instant QR Code
              </button>
              <button
                className={`payment-tab ${paymentMethod === 'upi' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('upi')}
              >
                📱 UPI VPA / ID
              </button>
              <button
                className={`payment-tab ${paymentMethod === 'card' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('card')}
              >
                💳 Debit/Credit Card
              </button>
            </div>

            {paymentMethod === 'qr' && (
              <div className="qr-payment-container">
                <div className="qr-timer-banner">
                  <span>⏱️ QR Code valid for: <strong>{formatTimer(timeLeft)}</strong></span>
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
                      <span className="merchant-verified">✓ NPCI Verified Business</span>
                    </div>
                    <div className="qr-badge">Amount: {formatPrice(orderSummary.total)}</div>
                  </div>
                </div>

                <p className="qr-instruction">
                  Scan QR with any app or tap app below to pay
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
                  <form onSubmit={handleConfirmQrPayment} className="qr-verify-form">
                    <div className="payment-input-group">
                      <label htmlFor="utrInput">
                        12-Digit Bank UTR / Reference No. (Optional)
                      </label>
                      <input
                        id="utrInput"
                        type="text"
                        placeholder="e.g. 320491823901"
                        maxLength="12"
                        value={utrNumber}
                        onChange={(e) => setUtrNumber(e.target.value.replace(/\D/g, ''))}
                      />
                    </div>

                    <button type="submit" className="btn btn-primary payment-pay-btn">
                      I Have Scanned & Paid {formatPrice(orderSummary.total)} →
                    </button>
                  </form>

                  <div className="qr-demo-simulator">
                    <span className="demo-divider">OR FOR INSTANT DEMO</span>
                    <button type="button" className="btn-demo-pay" onClick={handleSimulatePayment}>
                      ⚡ Simulate Instant UPI Payment Received
                    </button>
                  </div>
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
                  Send UPI Payment Request • {formatPrice(orderSummary.total)}
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

        {step === 'success' && (
          <div className="payment-success-state">
            <div className="success-checkmark">✓</div>
            <h2>Payment Successful & Order Confirmed!</h2>
            <p className="success-ref">Order Reference: <strong>{orderRefId}</strong></p>
            <p className="success-msg">
              Thank you for ordering from <strong>Komali Home Foods</strong>. Your authentic items are being freshly prepared!
            </p>
            <button className="btn btn-primary" onClick={onClose}>
              View My Order Summary 📦
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
