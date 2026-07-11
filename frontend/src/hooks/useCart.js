import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    if (typeof window === 'undefined') return []
    try {
      return JSON.parse(localStorage.getItem('snapmart-cart') || '[]')
    } catch {
      return []
    }
  })

  const [wishlistItems, setWishlistItems] = useState(() => {
    if (typeof window === 'undefined') return []
    try {
      return JSON.parse(localStorage.getItem('snapmart-wishlist') || '[]')
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem('snapmart-cart', JSON.stringify(cartItems))
  }, [cartItems])

  useEffect(() => {
    localStorage.setItem('snapmart-wishlist', JSON.stringify(wishlistItems))
  }, [wishlistItems])

  const addToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id)
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [...prev, { ...product, quantity: 1 }]
    })
  }

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id))
  }

  const updateQuantity = (id, quantity) => {
    setCartItems((prev) => {
      if (quantity <= 0) {
        return prev.filter((item) => item.id !== id)
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
