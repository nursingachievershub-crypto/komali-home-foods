import { createContext, useContext, useReducer, useEffect } from 'react'
import { useToast } from './ToastContext'

const CartContext = createContext()

const CART_STORAGE_KEY = 'komali-cart'

const loadCartFromStorage = () => {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existingIndex = state.findIndex(item => item.id === action.payload.id)
      if (existingIndex >= 0) {
        const updated = [...state]
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + 1,
        }
        return updated
      }
      return [...state, { ...action.payload, quantity: 1 }]
    }

    case 'REMOVE_FROM_CART':
      return state.filter(item => item.id !== action.payload)

    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload
      if (quantity <= 0) {
        return state.filter(item => item.id !== id)
      }
      return state.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    }

    case 'CLEAR_CART':
      return []

    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [cartItems, dispatch] = useReducer(cartReducer, [], loadCartFromStorage)
  const { addToast } = useToast()

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems))
  }, [cartItems])

  const addToCart = (product) => {
    dispatch({ type: 'ADD_TO_CART', payload: product })
    addToast(`Added "${product.name}" to cart! 🛒`, 'success')
  }

  const removeFromCart = (productId) => {
    const item = cartItems.find(i => i.id === productId)
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId })
    if (item) {
      addToast(`Removed "${item.name}" from cart`, 'info')
    }
  }

  const updateQuantity = (productId, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id: productId, quantity } })
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
  }

  const cartTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  )

  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

