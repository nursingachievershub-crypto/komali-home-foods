import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

const AUTH_STORAGE_KEY = 'komali-user'
const ORDERS_STORAGE_KEY = 'komali-orders'

const initialUser = () => {
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY)
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

const initialOrders = () => {
  try {
    const stored = localStorage.getItem(ORDERS_STORAGE_KEY)
    return stored ? JSON.parse(stored) : [
      {
        id: 'KHF-98421',
        date: '2026-07-20T14:30:00.000Z',
        status: 'Delivered',
        total: 598,
        items: [
          { id: 1, name: 'Traditional Andhra Pickle (Avakaya)', quantity: 1, price: 299 },
          { id: 2, name: 'Gongura Pachadi', quantity: 1, price: 249 }
        ],
        shippingAddress: {
          fullName: 'Demo Customer',
          address: 'Flat 402, Sunshine Apartments, Jubilee Hills',
          city: 'Hyderabad',
          pincode: '500033',
          phone: '+91 98765 43210'
        },
        paymentMethod: 'UPI (PhonePe)'
      }
    ]
  } catch {
    return []
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(initialUser)
  const [orders, setOrders] = useState(initialOrders)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState('login') // 'login' | 'signup'

  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user))
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY)
    }
  }, [user])

  useEffect(() => {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders))
  }, [orders])

  const login = (email, password) => {
    // Simulated authentication logic
    const newUser = {
      id: 'usr_' + Date.now(),
      name: email.split('@')[0].replace('.', ' ').replace(/^./, c => c.toUpperCase()),
      email: email,
      phone: '+91 98765 43210',
      savedAddresses: [
        {
          id: 'addr_1',
          name: 'Home',
          street: 'Plot No 45, Road No 10, Banjara Hills',
          city: 'Hyderabad',
          state: 'Telangana',
          pincode: '500034'
        }
      ]
    }
    setUser(newUser)
    setIsAuthModalOpen(false)
    return { success: true }
  }

  const signup = (name, email, password, phone) => {
    const newUser = {
      id: 'usr_' + Date.now(),
      name,
      email,
      phone,
      savedAddresses: []
    }
    setUser(newUser)
    setIsAuthModalOpen(false)
    return { success: true }
  }

  const logout = () => {
    setUser(null)
  }

  const addOrder = (orderData) => {
    const newOrder = {
      id: 'KHF-' + Math.floor(10000 + Math.random() * 90000),
      date: new Date().toISOString(),
      status: 'Processing',
      ...orderData
    }
    setOrders(prev => [newOrder, ...prev])
    return newOrder
  }

  const openAuthModal = (mode = 'login') => {
    setAuthMode(mode)
    setIsAuthModalOpen(true)
  }

  const closeAuthModal = () => {
    setIsAuthModalOpen(false)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        orders,
        login,
        signup,
        logout,
        addOrder,
        isAuthModalOpen,
        authMode,
        openAuthModal,
        closeAuthModal
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
