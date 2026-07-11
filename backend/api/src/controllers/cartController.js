import Cart from '../models/Cart.js'
import User from '../models/User.js'
import Product from '../models/Product.js'
import { calculateCartResponse, mergeCartItem, normalizeQuantity, validateStockForCart } from '../utils/cartHelpers.js'

const getOrCreateCart = async (req) => {
  let cart

  if (req.isAuthenticated) {
    cart = await Cart.findOne({ user: req.user.id })
    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [] })
      await cart.save()
      await User.findByIdAndUpdate(req.user.id, { cart: cart._id })
    }
  } else {
    const sessionId = req.header('X-Session-ID')
    if (!sessionId) {
      return { cart: null, error: 'Session ID required for guest' }
    }

    cart = await Cart.findOne({ sessionId, isGuestCart: true })
    if (!cart) {
      cart = new Cart({
        sessionId,
        isGuestCart: true,
        items: [],
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      })
      await cart.save()
    }
  }

  await cart.populate('items.product')
  return { cart }
}

export const getCart = async (req, res) => {
  try {
    const { cart, error } = await getOrCreateCart(req)
    if (error) {
      return res.status(400).json({ message: error })
    }

    res.json(calculateCartResponse(cart))
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body

    const product = await Product.findById(productId)
    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    let requestedQuantity
    try {
      requestedQuantity = validateStockForCart(product, quantity)
    } catch (error) {
      return res.status(400).json({ message: error.message })
    }

    const { cart, error } = await getOrCreateCart(req)
    if (error) {
      return res.status(400).json({ message: error })
    }

    const { existingItemIndex } = mergeCartItem(cart.items, productId, requestedQuantity)

    if (existingItemIndex > -1) {
      const currentItem = cart.items[existingItemIndex]
      const nextQuantity = currentItem.quantity
      if (nextQuantity > product.stock) {
        return res.status(400).json({ message: 'Not enough stock' })
      }
    }

    await cart.save()
    await cart.populate('items.product')

    res.json(calculateCartResponse(cart))
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

export const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body

    let cart

    if (req.isAuthenticated) {
      cart = await Cart.findOne({ user: req.user.id })
    } else {
      const sessionId = req.header('X-Session-ID')
      cart = await Cart.findOne({ sessionId, isGuestCart: true })
    }

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' })
    }

    const itemIndex = cart.items.findIndex((item) => String(item.product) === String(productId))

    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' })
    }

    const product = await Product.findById(productId)
    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    const parsedQuantity = Number(quantity)
    if (!Number.isFinite(parsedQuantity)) {
      return res.status(400).json({ message: 'Invalid quantity' })
    }

    if (parsedQuantity <= 0) {
      cart.items.splice(itemIndex, 1)
    } else {
      try {
        validateStockForCart(product, parsedQuantity)
      } catch (error) {
        return res.status(400).json({ message: error.message })
      }
      cart.items[itemIndex].quantity = parsedQuantity
    }

    await cart.save()
    await cart.populate('items.product')

    res.json(calculateCartResponse(cart))
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params
    
    let cart
    
    if (req.isAuthenticated) {
      cart = await Cart.findOne({ user: req.user.id })
    } else {
      const sessionId = req.header('X-Session-ID')
      cart = await Cart.findOne({ sessionId, isGuestCart: true })
    }
    
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' })
    }
    
    cart.items = cart.items.filter((item) => String(item.product) !== String(productId))

    await cart.save()
    await cart.populate('items.product')

    res.json(calculateCartResponse(cart))
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

export const clearCart = async (req, res) => {
  try {
    let cart
    
    if (req.isAuthenticated) {
      cart = await Cart.findOne({ user: req.user.id })
    } else {
      const sessionId = req.header('X-Session-ID')
      cart = await Cart.findOne({ sessionId, isGuestCart: true })
    }
    
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' })
    }
    
    cart.items = []
    await cart.save()
    await cart.populate('items.product')

    res.json({ message: 'Cart cleared successfully', cart: calculateCartResponse(cart) })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

export const initiateCheckout = async (req, res) => {
  try {
    let cart
    
    if (req.isAuthenticated) {
      cart = await Cart.findOne({ user: req.user.id }).populate('items.product')
      
      if (!cart || cart.items.length === 0) {
        return res.status(400).json({ message: 'Cart is empty' })
      }
      
      res.json({
        message: 'Checkout initiated',
        requiresRegistration: false,
        cart: calculateCartResponse(cart)
      })
    } else {
      const sessionId = req.header('X-Session-ID')
      cart = await Cart.findOne({ sessionId, isGuestCart: true }).populate('items.product')
      
      if (!cart || cart.items.length === 0) {
        return res.status(400).json({ message: 'Cart is empty' })
      }
      
      res.json({
        message: 'Guest checkout - registration required',
        requiresRegistration: true,
        sessionId,
        cart: calculateCartResponse(cart)
      })
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

export const abandonCheckout = async (req, res) => {
  try {
    const sessionId = req.header('X-Session-ID')
    
    if (!sessionId) {
      return res.status(400).json({ message: 'Session ID required' })
    }
    
    const cart = await Cart.findOne({ sessionId, isGuestCart: true })
    
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' })
    }
    
    cart.items = []
    await cart.save()
    
    res.json({ message: 'Guest cart cleared due to abandoned checkout' })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

export const updateCart = async (req, res) => {
  try {
    const { items } = req.body
    
    let cart
    
    if (req.isAuthenticated) {
      cart = await Cart.findOne({ user: req.user.id })
      if (!cart) {
        cart = new Cart({
          user: req.user.id,
          items: []
        })
        await cart.save()
        
        await User.findByIdAndUpdate(req.user.id, { cart: cart._id })
      }
    } else {
      const sessionId = req.header('X-Session-ID')
      if (!sessionId) {
        return res.status(400).json({ message: 'Session ID required for guest' })
      }
      
      cart = await Cart.findOne({ sessionId, isGuestCart: true })
      if (!cart) {
        cart = new Cart({
          sessionId,
          isGuestCart: true,
          items: [],
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
        })
        await cart.save()
      }
    }
    
    if (!Array.isArray(items)) {
      return res.status(400).json({ message: 'Items must be an array' })
    }

    for (const item of items) {
      const product = await Product.findById(item.product)
      if (!product) {
        return res.status(404).json({ message: 'Product not found' })
      }

      try {
        validateStockForCart(product, item.quantity)
      } catch (error) {
        return res.status(400).json({ message: error.message })
      }
    }

    cart.items = items.map((item) => ({
      product: item.product,
      quantity: normalizeQuantity(item.quantity),
    }))

    await cart.save()
    await cart.populate('items.product')

    res.json(calculateCartResponse(cart))
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}
