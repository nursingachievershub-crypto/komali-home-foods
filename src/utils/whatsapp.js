// WhatsApp Integration Utility for Komali Home Foods

export const STORE_CONFIG = {
  adminPhone: '919121977667', // International format without +
  adminDisplayPhone: '+91 91219 77667',
  merchantUpi: 'komalihomefoodss@axl',
  storeName: 'Komali Home Foods',
  storeAddress: 'Sanath Nagar, Hyderabad, Telangana - 500018',
  storeEmail: 'hello@komalihomefoods.com'
}

export const DELIVERY_DISTANCE_PRESETS = [
  { km: 3, label: 'Within 3 km (Local - Sanath Nagar / Ameerpet)', fee: 0, isFree: true },
  { km: 5, label: '5 km (e.g. Punjagutta / SR Nagar)', fee: 20, isFree: false },
  { km: 8, label: '8 km (e.g. Begumpet / Kukatpally / Secunderabad)', fee: 50, isFree: false },
  { km: 10, label: '10 km (e.g. Madhapur / Banjara Hills)', fee: 70, isFree: false },
  { km: 13, label: '13 km (e.g. Hitech City / Jubilee Hills)', fee: 100, isFree: false },
  { km: 18, label: '18 km (e.g. Gachibowli / Kondapur / Miyapur)', fee: 150, isFree: false },
  { km: 23, label: '23 km (e.g. LB Nagar / Uppal / Outer)', fee: 200, isFree: false }
]

/**
 * Calculates delivery fee based on distance:
 * - Within 3 km: FREE Delivery (₹0)
 * - Beyond 3 km: ₹10 per km after the initial 3 km (e.g., 5 km = 2 km extra * ₹10 = ₹20)
 * @param {number|string} distanceKm 
 * @returns {number} fee in INR
 */
export function calculateDeliveryFee(distanceKm) {
  const km = Math.max(0, Number(distanceKm) || 0)
  if (km <= 3) return 0
  return Math.round((km - 3) * 10)
}

/**
 * Calculates estimated delivery window based on pincode or region
 * @param {string} pincode 
 * @returns {object} delivery metadata
 */
export function calculateDeliveryTimeframe(pincode = '') {
  const cleanPincode = String(pincode).trim()
  
  // Hyderabad & Secunderabad local (500xxx)
  if (cleanPincode.startsWith('500')) {
    return {
      type: 'express',
      timeframe: 'Delivered within 24 Hours',
      badge: '⚡ Express Local Delivery',
      estimatedDays: '1 Day',
      details: 'Freshly prepared and dispatched via local courier in Hyderabad'
    }
  }

  // Telangana & Andhra Pradesh (50xxxx - 53xxxx)
  if (cleanPincode.startsWith('50') || cleanPincode.startsWith('51') || cleanPincode.startsWith('52') || cleanPincode.startsWith('53')) {
    return {
      type: 'standard_ap_tg',
      timeframe: 'Delivered within 1-2 Business Days',
      badge: '🚚 Regional Express',
      estimatedDays: '1-2 Days',
      details: 'Direct dispatch via fast regional logistics'
    }
  }

  // Rest of India
  return {
    type: 'national',
    timeframe: 'Delivered within 3-5 Business Days',
    badge: '📦 National Express Delivery',
    estimatedDays: '3-5 Days',
    details: 'Packed in protective food-grade packaging for safe national transit'
  }
}

/**
 * Formats a clean WhatsApp direct chat link
 * @param {string} text 
 * @param {string} phone 
 * @returns {string} wa.me URL
 */
export function buildWhatsAppLink(text, phone = STORE_CONFIG.adminPhone) {
  const encodedText = encodeURIComponent(text)
  return `https://wa.me/${phone}?text=${encodedText}`
}

/**
 * Generates Admin WhatsApp alert message payload when an order is placed
 */
export function buildAdminOrderMessage(orderData) {
  const delivery = calculateDeliveryTimeframe(orderData.shippingAddress?.pincode)
  const itemsText = orderData.items
    .map(item => `  • ${item.quantity}x ${item.name} (${item.weight}) - ₹${item.price * item.quantity}`)
    .join('\n')

  const deliveryFeeText = orderData.deliveryFee > 0 ? `₹${orderData.deliveryFee} (${orderData.distanceText || 'Distance Delivery'})` : 'FREE (Within 3 km)'

  return `📦 *NEW ORDER ACCEPTED!*
Order Ref: *${orderData.orderRefId || orderData.id}*
Date: ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}

👤 *CUSTOMER DETAILS:*
• *Name:* ${orderData.shippingAddress?.fullName || 'Valued Customer'}
• *Phone:* ${orderData.shippingAddress?.phone || 'N/A'}
• *Email:* ${orderData.shippingAddress?.email || 'N/A'}
• *Address:* ${orderData.shippingAddress?.address || ''}, ${orderData.shippingAddress?.city || ''}, ${orderData.shippingAddress?.state || ''} - ${orderData.shippingAddress?.pincode || ''}

🛒 *ORDER ITEMS:*
${itemsText}

💰 *FINANCIAL SUMMARY:*
• Items Subtotal: ₹${orderData.subtotal || orderData.total}
• Delivery Charge: ${deliveryFeeText}
• *GRAND TOTAL:* ₹${orderData.total}

💳 *PAYMENT:* ${orderData.paymentMethod || 'UPI Payment'}

⏱️ *TARGET DELIVERY:* ${delivery.badge}
*${delivery.timeframe}*

⚠️ *Seller Action Required:* Please verify payment credit before dispatching.`
}

/**
 * Generates Customer WhatsApp order receipt & tracking message
 */
export function buildCustomerOrderMessage(orderData) {
  const delivery = calculateDeliveryTimeframe(orderData.shippingAddress?.pincode)
  const itemsText = orderData.items
    .map(item => `• ${item.quantity}x ${item.name} (${item.weight})`)
    .join('\n')

  const deliveryFeeText = orderData.deliveryFee > 0 ? `₹${orderData.deliveryFee}` : 'FREE (Within 3 km)'

  return `🎉 *ORDER CONFIRMED - KOMALI HOME FOODS*
Order Ref: *${orderData.orderRefId || orderData.id}*

Dear *${orderData.shippingAddress?.fullName || 'Customer'}*, thank you for ordering authentic home foods!

🛒 *YOUR ORDER SUMMARY:*
${itemsText}

💰 *PAYMENT BREAKDOWN:*
• Subtotal: ₹${orderData.subtotal || orderData.total}
• Delivery Fee: ${deliveryFeeText}
• *Total Paid:* ₹${orderData.total}

🚚 *ESTIMATED DELIVERY:*
*${delivery.timeframe}*
${delivery.details}

📍 *Shipping Address:*
${orderData.shippingAddress?.address}, ${orderData.shippingAddress?.city} - ${orderData.shippingAddress?.pincode}

If you have any questions, reply to this message anytime!`
}

/**
 * Generates Single Product WhatsApp inquiry / order link
 */
export function buildProductWhatsAppLink(product) {
  const text = `👋 Hello *Komali Home Foods*!
I would like to order:
*${product.name}* (${product.weight}) - ₹${product.price}

Please confirm availability and help me place this order!`
  return buildWhatsAppLink(text)
}
