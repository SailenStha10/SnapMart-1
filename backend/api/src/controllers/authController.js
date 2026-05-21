import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import User from '../models/User.js'
import Cart from '../models/Cart.js'

export const register = async (req, res) => {
  try {
    const { name, email, password, sessionId } = req.body

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = new User({
      name,
      email,
      password: hashedPassword,
      isGuest: false
    })

    await user.save()

    if (sessionId) {
      const guestCart = await Cart.findOne({ sessionId, isGuestCart: true })
      if (guestCart) {
        guestCart.user = user._id
        guestCart.sessionId = undefined
        guestCart.isGuestCart = false
        await guestCart.save()
        
        user.cart = guestCart._id
        await user.save()
      }
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    )

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isGuest: user.isGuest
      }
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    )

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isGuest: user.isGuest
      }
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

export const createGuestSession = async (req, res) => {
  try {
    const sessionId = req.body.sessionId || crypto.randomBytes(16).toString('hex')
    
    const guestCart = new Cart({
      sessionId,
      isGuestCart: true,
      items: [],
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    })
    
    await guestCart.save()
    
    res.json({
      sessionId,
      message: 'Guest session created'
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}
