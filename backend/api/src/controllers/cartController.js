import Cart from '../models/Cart.js'
import User from '../models/User.js'
import Product from '../models/Product.js'

export const getCart = async (req, res) => {
  try {
    let cart
    
    if (req.isAuthenticated) {
      cart = await Cart.findOne({ user: req.user.id }).populate('items.product')
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
      
      cart = await Cart.findOne({ sessionId, isGuestCart: true }).populate('items.product')
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
    
    res.json(cart)
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
    
    const existingItemIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    )
    
    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += quantity || 1
    } else {
      cart.items.push({
        product: productId,
        quantity: quantity || 1
      })
    }
    
    await cart.save()
    await cart.populate('items.product')
    
    res.json(cart)
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
    
    const itemIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    )
    
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' })
    }
    
    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1)
    } else {
      cart.items[itemIndex].quantity = quantity
    }
    
    await cart.save()
    await cart.populate('items.product')
    
    res.json(cart)
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
    
    cart.items = cart.items.filter(
      item => item.product.toString() !== productId
    )
    
    await cart.save()
    await cart.populate('items.product')
    
    res.json(cart)
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
    
    res.json({ message: 'Cart cleared successfully', cart })
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
        cart
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
        cart
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
    
    cart.items = items
    await cart.save()
    await cart.populate('items.product')
    
    res.json(cart)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}
