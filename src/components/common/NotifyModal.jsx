import { useState } from 'react'
import { STORE_CONFIG, buildWhatsAppLink } from '../../utils/whatsapp'
import { useToast } from '../../context/ToastContext'
import './NotifyModal.css'

export default function NotifyModal({ product, onClose }) {
  const { addToast } = useToast()
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    pincode: '',
    quantity: '1',
    note: ''
  })

  if (!product) return null

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const waText = `👋 Hello *Komali Home Foods*!

I would like to request an alert when this item is back in stock:
📌 *${product.name}* (${product.weight || 'Standard'})

👤 *CUSTOMER DETAILS:*
• *Name:* ${formData.name.trim()}
• *Phone/WhatsApp:* ${formData.phone.trim()}
${formData.pincode ? `• *Pincode/City:* ${formData.pincode.trim()}\n` : ''}• *Requested Quantity:* ${formData.quantity}
${formData.note ? `• *Note:* ${formData.note.trim()}\n` : ''}
Please notify me on WhatsApp as soon as fresh batch is ready! Thank you! 🙏`

    const waUrl = buildWhatsAppLink(waText, STORE_CONFIG.adminPhone)
    window.open(waUrl, '_blank')

    addToast(`Restock alert requested for "${product.name}" via WhatsApp! 📲`, 'success', 5000)
    onClose()
  }

  return (
    <div className="notify-overlay">
      <div className="notify-modal">
        <button className="notify-close-btn" onClick={onClose} aria-label="Close Notify Modal">
          ✕
        </button>

        <div className="notify-header">
          <span className="notify-badge">🔔 RESTOCK ALERT REQUEST</span>
          <h3>Notify Me When Back in Stock</h3>
          <p className="notify-product-title">
            <strong>{product.name}</strong> ({product.weight})
          </p>
        </div>

        <form onSubmit={handleSubmit} className="notify-form">
          <div className="notify-input-group">
            <label htmlFor="name">Your Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Ramesh Kumar"
              required
            />
          </div>

          <div className="notify-input-group">
            <label htmlFor="phone">Phone / WhatsApp Number *</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+91 98765 43210"
              required
            />
          </div>

          <div className="notify-row">
            <div className="notify-input-group">
              <label htmlFor="pincode">Pincode / City (Optional)</label>
              <input
                type="text"
                id="pincode"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                placeholder="500018"
              />
            </div>
            <div className="notify-input-group">
              <label htmlFor="quantity">Quantity Needed</label>
              <select
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
              >
                <option value="1">1 pack</option>
                <option value="2">2 packs</option>
                <option value="3">3 packs</option>
                <option value="5">5+ packs (Bulk)</option>
              </select>
            </div>
          </div>

          <div className="notify-input-group">
            <label htmlFor="note">Additional Note (Optional)</label>
            <input
              type="text"
              id="note"
              name="note"
              value={formData.note}
              onChange={handleChange}
              placeholder="e.g. Need by next week for festival"
            />
          </div>

          <button type="submit" className="btn btn-primary notify-submit-btn">
            📱 Send Restock Request to Admin WhatsApp
          </button>
        </form>
      </div>
    </div>
  )
}
