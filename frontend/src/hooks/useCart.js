import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { toast } from 'react-hot-toast'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    if (typeof window === 'undefined') return []
    try {
      return JSON.parse(localStorage.getItem('kosheli-cart') || '[]')
    } catch {
      return []
    }
  })

  const [wishlistItems, setWishlistItems] = useState(() => {
    if (typeof window === 'undefined') return []
    try {
      return JSON.parse(localStorage.getItem('kosheli-wishlist') || '[]')
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem('kosheli-cart', JSON.stringify(cartItems))
  }, [cartItems])

  useEffect(() => {
    localStorage.setItem('kosheli-wishlist', JSON.stringify(wishlistItems))
  }, [wishlistItems])

  const addToCart = (product) => {
    const available = Number(product.stock ?? product._stock ?? 0)
    if (available <= 0) {
      toast.error('No stock available')
      return
    }

    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id)
      if (existing) {
        if ((existing.quantity + 1) > available) {
          toast.error('No more stock available')
          return prev
        }
        return prev.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
      }
      return [...prev, { ...product, quantity: 1 }]
    })
  }

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id))
  }

  const updateQuantity = (id, quantity) => {
    setCartItems((prev) => {
      const found = prev.find((item) => item.id === id)
      if (!found) return prev
      const available = Number(found.stock ?? found._stock ?? 0)
      if (quantity <= 0) {
        return prev.filter((item) => item.id !== id)
      }
      if (available > 0 && quantity > available) {
        toast.error('Requested quantity exceeds available stock')
        return prev
      }
      return prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    })
  }

  const clearCart = () => setCartItems([])

  const toggleWishlist = (product) => {
    setWishlistItems((prev) => {
      const exists = prev.some((item) => item.id === product.id)
      return exists ? prev.filter((item) => item.id !== product.id) : [...prev, product]
    })
  }

  const isInWishlist = (id) => wishlistItems.some((item) => item.id === id)

  const cartCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  )

  const wishlistCount = useMemo(() => wishlistItems.length, [wishlistItems])

  return React.createElement(
    CartContext.Provider,
    {
      value: {
        cartItems,
        wishlistItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleWishlist,
        isInWishlist,
        cartCount,
        wishlistCount,
      },
    },
    children
  )
}

export default function useCart() {
  return useContext(CartContext)
}
