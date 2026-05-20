import bcrypt from 'bcryptjs'
import User from '../models/User.js'
import { signToken } from '../utils/jwt.js'

function buildUserProfile(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    created_at: user.createdAt
  }
}

function buildAuthResponse(user) {
  return {
    user: buildUserProfile(user),
    token: signToken({
      id: user._id.toString(),
      email: user.email,
      role: user.role
    })
  }
}

export const register = async (req, res) => {
  const { name, email, password } = req.body

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email and password are required' })
  }

  const normalizedEmail = email.toLowerCase().trim()
  const existingUser = await User.findOne({ email: normalizedEmail })

  if (existingUser) {
    return res.status(409).json({ message: 'Email already in use' })
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password: hashedPassword
  })

  return res.status(201).json({
    message: 'Registration successful',
    ...buildAuthResponse(user)
  })
}

export const login = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' })
  }

  const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password')

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' })
  }

  const passwordMatches = await bcrypt.compare(password, user.password)

  if (!passwordMatches) {
    return res.status(401).json({ message: 'Invalid credentials' })
  }

  return res.json({
    message: 'Login successful',
    ...buildAuthResponse(user)
  })
}
