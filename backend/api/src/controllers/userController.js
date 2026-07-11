import bcrypt from 'bcryptjs'
import User from '../models/User.js'
import Address from '../models/Address.js'

function buildProfile(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    address: user.address,
    city: user.city,
    role: user.role,
    created_at: user.createdAt
  }
}

function validateAddressPayload(body) {
  const requiredFields = ['label', 'street', 'city', 'state', 'zip', 'country']
  const missingFields = requiredFields.filter((field) => !String(body[field] || '').trim())

  if (missingFields.length > 0) {
    return `Missing required fields: ${missingFields.join(', ')}`
  }

  return null
}

export async function getProfile(req, res) {
  const user = await User.findById(req.user.id)

  if (!user) {
    return res.status(404).json({ message: 'User not found' })
  }

  return res.json(buildProfile(user))
}

export async function updateProfile(req, res) {
  const { name, email, phone, address, city } = req.body
  const user = await User.findById(req.user.id).select('+password')

  if (!user) {
    return res.status(404).json({ message: 'User not found' })
  }

  if (email) {
    const normalizedEmail = email.toLowerCase().trim()
    const existingUser = await User.findOne({
      email: normalizedEmail,
      _id: { $ne: user._id }
    })

    if (existingUser) {
      return res.status(409).json({ message: 'Email already in use' })
    }

    user.email = normalizedEmail
  }

  if (name) {
    user.name = name.trim()
  }

  if (phone !== undefined) {
    user.phone = String(phone).trim()
  }

  if (address !== undefined) {
    user.address = String(address).trim()
  }

  if (city !== undefined) {
    user.city = String(city).trim()
  }

  await user.save()

  return res.json(buildProfile(user))
}

export async function changePassword(req, res) {
  const { currentPassword, newPassword, confirmNewPassword } = req.body

  if (!currentPassword || !newPassword || !confirmNewPassword) {
    return res.status(400).json({ message: 'All password fields are required' })
  }

  if (newPassword !== confirmNewPassword) {
    return res.status(400).json({ message: 'New passwords do not match' })
  }

  if (newPassword.length < 8) {
    return res.status(400).json({ message: 'New password must be at least 8 characters long' })
  }

  const user = await User.findById(req.user.id).select('+password')

  if (!user) {
    return res.status(404).json({ message: 'User not found' })
  }

  const currentPasswordMatches = await bcrypt.compare(currentPassword, user.password)

  if (!currentPasswordMatches) {
    return res.status(400).json({ message: 'Current password is incorrect' })
  }

  user.password = await bcrypt.hash(newPassword, 10)
  await user.save()

  return res.status(200).json({ message: 'Password updated successfully' })
}

export async function listAddresses(req, res) {
  const addresses = await Address.find({ user: req.user.id }).sort({ isDefault: -1, createdAt: -1 })

  return res.json(addresses)
}

export async function createAddress(req, res) {
  const validationError = validateAddressPayload(req.body)

  if (validationError) {
    return res.status(400).json({ message: validationError })
  }

  const addressData = {
    user: req.user.id,
    label: req.body.label.trim(),
    street: req.body.street.trim(),
    city: req.body.city.trim(),
    state: req.body.state.trim(),
    zip: req.body.zip.trim(),
    country: req.body.country.trim(),
    isDefault: Boolean(req.body.isDefault)
  }

  if (addressData.isDefault) {
    await Address.updateMany({ user: req.user.id }, { isDefault: false })
  }

  const address = await Address.create(addressData)

  return res.status(201).json(address)
}

export async function updateAddress(req, res) {
  const address = await Address.findById(req.params.addressId)

  if (!address) {
    return res.status(404).json({ message: 'Address not found' })
  }

  if (String(address.user) !== String(req.user.id)) {
    return res.status(403).json({ message: 'You do not have permission to update this address' })
  }

  const fields = ['label', 'street', 'city', 'state', 'zip', 'country']

  for (const field of fields) {
    if (req.body[field] !== undefined) {
      address[field] = String(req.body[field]).trim()
    }
  }

  if (req.body.isDefault !== undefined) {
    address.isDefault = Boolean(req.body.isDefault)

    if (address.isDefault) {
      await Address.updateMany(
        { user: req.user.id, _id: { $ne: address._id } },
        { isDefault: false }
      )
    }
  }

  await address.save()

  return res.json(address)
}

export async function deleteAddress(req, res) {
  const address = await Address.findById(req.params.addressId)

  if (!address) {
    return res.status(404).json({ message: 'Address not found' })
  }

  if (String(address.user) !== String(req.user.id)) {
    return res.status(403).json({ message: 'You do not have permission to delete this address' })
  }

  await address.deleteOne()

  return res.json({ message: 'Address deleted successfully' })
}