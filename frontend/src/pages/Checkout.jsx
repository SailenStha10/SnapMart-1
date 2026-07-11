import React, { useState, useEffect } from 'react'
import { FiCheck, FiTruck, FiShield } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'

export default function Checkout(){
  const { user } = useAuth()
  const [formData, setFormData] = useState(() => ({
    fullName: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    address: user?.address || '',
    landmark: '',
    city: user?.city || '',
    zipCode: '',
    saveAddress: false
  }))

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: user.name || '',
        phone: user.phone || '',
        email: user.email || '',
        address: user.address || '',
        city: user.city || ''
      }))
    }
  }, [user])
  
  const [deliveryOption, setDeliveryOption] = useState('instant')
  const [paymentMethod, setPaymentMethod] = useState('cod')
  
  const [cartItems] = useState([
    { id: 1, name: 'Dabar Red Toothpaste 100g', quantity: 2, price: 200 }
  ])
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }
  
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const deliveryFee = 0
  const discount = 0
  const total = subtotal + deliveryFee - discount
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Form Sections */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Delivery Address */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">Delivery Address</h2>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter phone number"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter email address"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter your address"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Land Mark (Optional)</label>
                  <input
                    type="text"
                    name="landmark"
                    value={formData.landmark}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Nearby landmark"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">City</label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
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
                <label className="block text-sm font-medium mb-1">Zip Code</label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
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
                <label className="text-sm">Save this address for Next time</label>
              </div>
              
              <button type="button" className="text-primary font-medium hover:underline">
                + Add New Address
              </button>
            </form>
          </div>
          
          {/* Delivery Option */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">Delivery Option</h2>
            <div className="space-y-3">
              <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="delivery"
                  value="instant"
                  checked={deliveryOption === 'instant'}
                  onChange={(e) => setDeliveryOption(e.target.value)}
                  className="mr-3"
                />
                <div className="flex-1">
                  <div className="font-medium">Instant Delivery</div>
                  <div className="text-sm text-gray-600">Get Your Order in 30 - 40 minutes</div>
                </div>
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Recommended</span>
                <span className="ml-2 font-semibold text-green-600">Free</span>
              </label>
            </div>
          </div>
          
          {/* Payment Method */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">Payment Method</h2>
            <div className="space-y-3">
              <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="payment"
                  value="esewa"
                  checked={paymentMethod === 'esewa'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-3"
                />
                <div className="flex-1">
                  <div className="font-medium">eSewa</div>
                  <div className="text-sm text-gray-600">Pay securely with eSewa</div>
                </div>
              </label>
              
              <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="payment"
                  value="khalti"
                  checked={paymentMethod === 'khalti'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-3"
                />
                <div className="flex-1">
                  <div className="font-medium">Khalti</div>
                  <div className="text-sm text-gray-600">Pay securely with Khalti</div>
                </div>
              </label>
              
              <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-3"
                />
                <div className="flex-1">
                  <div className="font-medium">Cash On Delivery</div>
                  <div className="text-sm text-gray-600">Pay when you receive your order</div>
                </div>
              </label>
            </div>
          </div>
        </div>
        
        {/* Right Column - Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Order Summary</h2>
              <button className="text-primary text-sm hover:underline">Edit Cart</button>
            </div>
            
            {/* Cart Items */}
            <div className="space-y-3 mb-6">
              {cartItems.map(item => (
                <div key={item.id} className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="font-medium text-sm">{item.name}</div>
                    <div className="text-xs text-gray-600">Qty: {item.quantity}</div>
                  </div>
                  <div className="font-semibold">Rs: {item.price * item.quantity}</div>
                </div>
              ))}
            </div>
            
            {/* Price Breakdown */}
            <div className="border-t pt-4 space-y-2">
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
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total</span>
                <span>Rs: {total}</span>
              </div>
            </div>
            
            {/* Place Order Button */}
            <button className="w-full mt-6 bg-gradient-to-r from-primary to-primary-dark text-white py-3 rounded-lg font-semibold hover:opacity-90 transition">
              Place Order
            </button>
            
            <div className="flex items-center justify-center mt-3 text-sm text-gray-600">
              <FiCheck className="mr-1" />
              <span>Secure and safe payment</span>
            </div>
            
            {/* Trust Badges */}
            <div className="mt-6 pt-4 border-t grid grid-cols-2 gap-4">
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
