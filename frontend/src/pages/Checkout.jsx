import React, { useEffect, useState } from 'react'
import { FiCheck, FiShield, FiTruck } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'

export default function Checkout() {
  const { user } = useAuth()
  const [formData, setFormData] = useState(() => ({
    fullName: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    address: user?.address || '',
    landmark: '',
    city: user?.city || '',
    zipCode: '',
    saveAddress: false,
  }))
  const [deliveryOption, setDeliveryOption] = useState('instant')
  const [paymentMethod, setPaymentMethod] = useState('cod')
  const [cartItems] = useState([{ id: 1, name: 'Dabar Red Toothpaste 100g', quantity: 2, price: 200 }])

  useEffect(() => {
    if (!user) {
      return
    }

    setFormData((prev) => ({
      ...prev,
      fullName: user.name || '',
      phone: user.phone || '',
      email: user.email || '',
      address: user.address || '',
      city: user.city || '',
    }))
  }, [user])

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const deliveryFee = 0
  const discount = 0
  const total = subtotal + deliveryFee - discount

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Checkout</h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-lg bg-white p-6 shadow-md">
            <h2 className="mb-4 text-lg font-semibold">Delivery Address</h2>
            <form className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter phone number"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter email address"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter your address"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium">Land Mark (Optional)</label>
                  <input
                    type="text"
                    name="landmark"
                    value={formData.landmark}
                    onChange={handleChange}
                    className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Nearby landmark"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">City</label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select City</option>
                    <option value="kathmandu">Kathmandu</option>
                    <option value="pokhara">Pokhara</option>
                    <option value="lalitpur">Lalitpur</option>
                    <option value="bhaktapur">Bhaktapur</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Zip Code</label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter zip code"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="saveAddress"
                  checked={formData.saveAddress}
                  onChange={handleChange}
                  className="mr-2"
                />
                <label className="text-sm">Save this address for next time</label>
              </div>

              <button type="button" className="font-medium text-primary hover:underline">
                + Add New Address
              </button>
            </form>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-md">
            <h2 className="mb-4 text-lg font-semibold">Delivery Option</h2>
            <div className="space-y-3">
              <label className="flex cursor-pointer items-center rounded-lg border p-4 hover:bg-gray-50">
                <input
                  type="radio"
                  name="delivery"
                  value="instant"
                  checked={deliveryOption === 'instant'}
                  onChange={(event) => setDeliveryOption(event.target.value)}
                  className="mr-3"
                />
                <div className="flex-1">
                  <div className="font-medium">Instant Delivery</div>
                  <div className="text-sm text-gray-600">Get your order in 30 - 40 minutes</div>
                </div>
                <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-800">Recommended</span>
                <span className="ml-2 font-semibold text-green-600">Free</span>
              </label>
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-md">
            <h2 className="mb-4 text-lg font-semibold">Payment Method</h2>
            <div className="space-y-3">
              {[
                { value: 'esewa', label: 'eSewa', text: 'Pay securely with eSewa' },
                { value: 'khalti', label: 'Khalti', text: 'Pay securely with Khalti' },
                { value: 'cod', label: 'Cash On Delivery', text: 'Pay when you receive your order' },
              ].map((option) => (
                <label key={option.value} className="flex cursor-pointer items-center rounded-lg border p-4 hover:bg-gray-50">
                  <input
                    type="radio"
                    name="payment"
                    value={option.value}
                    checked={paymentMethod === option.value}
                    onChange={(event) => setPaymentMethod(event.target.value)}
                    className="mr-3"
                  />
                  <div className="flex-1">
                    <div className="font-medium">{option.label}</div>
                    <div className="text-sm text-gray-600">{option.text}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-4 rounded-lg bg-white p-6 shadow-md">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Order Summary</h2>
              <button type="button" className="text-sm text-primary hover:underline">
                Edit Cart
              </button>
            </div>

            <div className="mb-6 space-y-3">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="text-sm font-medium">{item.name}</div>
                    <div className="text-xs text-gray-600">Qty: {item.quantity}</div>
                  </div>
                  <div className="font-semibold">Rs: {item.price * item.quantity}</div>
                </div>
              ))}
            </div>

            <div className="space-y-2 border-t pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span>Rs: {subtotal}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Delivery Fee</span>
                <span>{deliveryFee === 0 ? 'Free' : `Rs: ${deliveryFee}`}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Discount</span>
                <span className="text-green-600">{discount === 0 ? 'Rs: 0' : `Rs: ${discount}`}</span>
              </div>
              <div className="flex justify-between border-t pt-2 text-lg font-bold">
                <span>Total</span>
                <span>Rs: {total}</span>
              </div>
            </div>

            <button type="button" className="mt-6 w-full rounded-lg bg-gradient-to-r from-primary to-primary-dark py-3 font-semibold text-white transition hover:opacity-90">
              Place Order
            </button>

            <div className="mt-3 flex items-center justify-center text-sm text-gray-600">
              <FiCheck className="mr-1" />
              <span>Secure and safe payment</span>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4 border-t pt-4">
              <div className="flex items-center text-sm text-gray-600">
                <FiShield className="mr-2 text-primary" />
                <span>Safe Packaging</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <FiTruck className="mr-2 text-primary" />
                <span>Instant Delivery</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
