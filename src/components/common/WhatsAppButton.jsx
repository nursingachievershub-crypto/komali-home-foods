import { useState } from 'react'
import { STORE_CONFIG, buildWhatsAppLink } from '../../utils/whatsapp'
import './WhatsAppButton.css'

export default function WhatsAppButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [userPincode, setUserPincode] = useState('')

  const handleQuickChat = (topic) => {
    let msg = ''
    if (topic === 'custom') {
      msg = `👋 Hi Komali Home Foods! I want to inquire about custom/bulk pickle & sweet orders.`
    } else if (topic === 'pincode') {
      msg = `👋 Hi! Can you please confirm delivery availability & timeframe for pincode: ${userPincode || '500018'}?`
    } else if (topic === 'track') {
      msg = `👋 Hi! I would like to track my order status. Please help.`
    } else {
      msg = `👋 Hi Komali Home Foods! I have a question about your home food items.`
    }

    window.open(buildWhatsAppLink(msg, STORE_CONFIG.adminPhone), '_blank')
    setIsOpen(false)
  }

  return (
    <div className="wa-float-container no-print">
      {/* Popover Card */}
      {isOpen && (
        <div className="wa-popover">
          <div className="wa-popover-header">
            <div className="wa-avatar">🍛</div>
            <div className="wa-header-info">
              <span className="wa-title">Komali Home Foods</span>
              <span className="wa-status"><span className="wa-status-dot"></span> Typically replies in 5 mins</span>
            </div>
            <button className="wa-popover-close" onClick={() => setIsOpen(false)}>✕</button>
          </div>

          <div className="wa-popover-body">
            <p className="wa-greeting">
              Namaste! 🙏 How can we help you today with authentic home foods?
            </p>

            <div className="wa-quick-options">
              <button className="wa-option-btn" onClick={() => handleQuickChat('general')}>
                💬 Chat with Support (+91 91219 77667)
              </button>

              <button className="wa-option-btn" onClick={() => handleQuickChat('custom')}>
                🍯 Custom / Bulk Pack Inquiry
              </button>

              <button className="wa-option-btn" onClick={() => handleQuickChat('track')}>
                📦 Track My Order Status
              </button>

              <div className="wa-pincode-check">
                <input
                  type="text"
                  placeholder="Enter Pincode..."
                  maxLength="6"
                  value={userPincode}
                  onChange={(e) => setUserPincode(e.target.value.replace(/\D/g, ''))}
                />
                <button type="button" onClick={() => handleQuickChat('pincode')}>
                  Check Delivery
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        className="wa-float-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Chat on WhatsApp"
        title="Chat with Komali Home Foods on WhatsApp"
      >
        <svg className="wa-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.66 0 001.333 4.993L2 22l5.233-1.237a9.96 9.96 0 004.779 1.221h.004c5.505 0 9.988-4.478 9.989-9.985 0-2.667-1.04-5.174-2.928-7.06A9.923 9.923 0 0012.012 2zM12.012 20.165h-.003a8.29 8.29 0 01-4.225-1.157l-.303-.18-3.14.743.755-3.056-.197-.314a8.27 8.27 0 01-1.267-4.421c.001-4.57 3.717-8.286 8.29-8.286 2.215 0 4.296.863 5.86 2.428a8.23 8.23 0 012.427 5.86c-.002 4.57-3.718 8.284-8.197 8.284z"/>
        </svg>
        <span className="wa-tooltip">Order / Chat on WhatsApp</span>
      </button>
    </div>
  )
}
